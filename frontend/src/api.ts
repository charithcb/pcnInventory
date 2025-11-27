const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

type ApiResponseError = {
  message?: string;
};

async function postJson<TResponse, TRequest extends object = Record<string, unknown>>(path: string, body: TRequest): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data: ApiResponseError | (TResponse & ApiResponseError) | null = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const message = data?.message || 'Unable to complete request. Please try again.';
    throw new Error(message);
  }

  return (data || ({} as TResponse)) as TResponse;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export interface CustomerRegistrationRequest {
  name: string;
  email: string;
  password: string;
}

export interface CustomerLoginRequest {
  email: string;
  password: string;
}

export interface SystemLoginRequest {
  username: string;
  password: string;
}

export function registerCustomer(data: CustomerRegistrationRequest) {
  return postJson<AuthenticatedUser>('/auth/register', data);
}

export function loginCustomer(data: CustomerLoginRequest) {
  return postJson<{ token: string }>('/auth/login', data);
}

export function loginSystemUser(data: SystemLoginRequest) {
  return postJson<{ token: string; user: AuthenticatedUser }>('/auth/system-login', data);
}

export const apiBaseUrl = API_BASE_URL;
