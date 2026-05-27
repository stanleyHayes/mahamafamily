export type AdminRole = "owner" | "editor" | "viewer";

export interface AdminUserDTO {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  active: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: AdminUserDTO;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: AdminRole;
  iat: number;
  exp: number;
}
