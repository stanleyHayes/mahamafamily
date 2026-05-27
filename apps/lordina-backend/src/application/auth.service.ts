import { injectable, inject } from "inversify";
import { TYPES } from "@mahama/backend-core";
import { UnauthorizedError } from "@mahama/backend-core";
import { signJwt, verifyPassword, newRefreshToken } from "@mahama/jwt-utils";
import type { BackendEnv } from "@mahama/config";
import type { AdminUserDTO, JwtPayload, LoginResponse } from "@mahama/shared-types";
import type { AdminUserRepository } from "../domain/ports.js";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.AdminUserRepository) private readonly repo: AdminUserRepository,
    @inject(TYPES.Config) private readonly env: BackendEnv,
  ) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.repo.findByEmail(email);
    if (!user || !user.active) throw new UnauthorizedError("Invalid credentials");
    if (!verifyPassword(password, user.passwordHash)) throw new UnauthorizedError("Invalid credentials");

    return this.issueTokens({ id: user.id, email: user.email, name: user.name, role: user.role, active: user.active, createdAt: user.createdAt, updatedAt: user.updatedAt });
  }

  async refresh(refreshToken: string): Promise<LoginResponse> {
    const consumed = await this.repo.consumeRefreshToken(refreshToken);
    if (!consumed) throw new UnauthorizedError("Refresh token invalid or expired");
    const user = await this.repo.findById(consumed.userId);
    if (!user || !user.active) throw new UnauthorizedError("User inactive");
    return this.issueTokens(user);
  }

  async issueTokens(user: AdminUserDTO): Promise<LoginResponse> {
    const token = signJwt(
      { sub: user.id, email: user.email, role: user.role } satisfies Omit<JwtPayload, "iat" | "exp">,
      { secret: this.env.JWT_SECRET, expiresInSeconds: this.env.JWT_TTL_SECONDS, issuer: this.env.JWT_ISSUER },
    );
    const refresh = newRefreshToken();
    const expiresAt = new Date(Date.now() + this.env.REFRESH_TTL_SECONDS * 1000);
    await this.repo.saveRefreshToken(refresh, user.id, expiresAt);
    await this.repo.recordLogin(user.id);
    return { token, refreshToken: refresh, user };
  }

  async me(userId: string): Promise<AdminUserDTO> {
    const user = await this.repo.findById(userId);
    if (!user) throw new UnauthorizedError();
    return user;
  }
}
