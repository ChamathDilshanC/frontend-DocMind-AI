import { useAuthStore } from "@/stores/auth-store";
import type { ApiProblemDetails, AuthResultDto } from "@/types/api";

// Strip any trailing slash(es) so a stray trailing "/" in the env var never
// produces a double slash when concatenated with a "/"-prefixed path below
// (ASP.NET Core routing 404s on the empty path segment that creates).
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5180").replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  problem?: ApiProblemDetails;

  constructor(status: number, message: string, problem?: ApiProblemDetails) {
    super(message);
    this.status = status;
    this.problem = problem;
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const { refreshToken, setSession, clearSession } = useAuthStore.getState();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearSession();
      return false;
    }

    const result: AuthResultDto = await response.json();
    setSession(result);
    return true;
  } catch {
    clearSession();
    return false;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  isFormData?: boolean;
  skipAuth?: boolean;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, isFormData, skipAuth, headers, ...rest } = options;

  const doFetch = async (): Promise<Response> => {
    const token = useAuthStore.getState().accessToken;
    const finalHeaders: HeadersInit = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    };

    return fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body === undefined ? undefined : isFormData ? (body as BodyInit) : JSON.stringify(body),
    });
  };

  let response = await doFetch();

  if (response.status === 401 && !skipAuth) {
    refreshPromise ??= tryRefresh().finally(() => {
      refreshPromise = null;
    });

    const refreshed = await refreshPromise;
    if (refreshed) {
      response = await doFetch();
    }
  }

  if (!response.ok) {
    let problem: ApiProblemDetails | undefined;
    try {
      problem = await response.json();
    } catch {
      // response had no JSON body
    }
    throw new ApiError(response.status, problem?.detail ?? problem?.title ?? response.statusText, problem);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return response as unknown as T;
}

export { API_BASE_URL };
