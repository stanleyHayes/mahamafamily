import { createHmac, timingSafeEqual, randomBytes, scryptSync } from "node:crypto";

export class JwtError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "JwtError";
  }
}

const base64url = {
  encode(input: Buffer | string): string {
    const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
    return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  },
  decode(input: string): Buffer {
    const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
    return Buffer.from(padded, "base64");
  },
};

export interface SignOptions {
  secret: string;
  expiresInSeconds: number;
  issuer?: string;
  audience?: string;
}

export interface VerifyOptions {
  secret: string;
  issuer?: string;
  audience?: string;
  clockSkewSeconds?: number;
}

type Claims = Record<string, unknown> & {
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
};

export function signJwt(payload: Record<string, unknown>, opts: SignOptions): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claims: Claims = {
    ...payload,
    iat: now,
    exp: now + opts.expiresInSeconds,
  };
  if (opts.issuer) claims.iss = opts.issuer;
  if (opts.audience) claims.aud = opts.audience;

  const encodedHeader = base64url.encode(JSON.stringify(header));
  const encodedPayload = base64url.encode(JSON.stringify(claims));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac("sha256", opts.secret).update(signingInput).digest();
  return `${signingInput}.${base64url.encode(signature)}`;
}

export function verifyJwt<T extends Claims = Claims>(token: string, opts: VerifyOptions): T {
  const parts = token.split(".");
  if (parts.length !== 3) throw new JwtError("Malformed token", "MALFORMED");
  const [encodedHeader, encodedPayload, encodedSignature] = parts as [string, string, string];

  const expectedSig = createHmac("sha256", opts.secret).update(`${encodedHeader}.${encodedPayload}`).digest();
  const providedSig = base64url.decode(encodedSignature);
  if (expectedSig.length !== providedSig.length || !timingSafeEqual(expectedSig, providedSig)) {
    throw new JwtError("Invalid signature", "INVALID_SIGNATURE");
  }

  let claims: Claims;
  try {
    claims = JSON.parse(base64url.decode(encodedPayload).toString("utf8"));
  } catch {
    throw new JwtError("Invalid payload", "INVALID_PAYLOAD");
  }

  const now = Math.floor(Date.now() / 1000);
  const skew = opts.clockSkewSeconds ?? 5;
  if (typeof claims.exp === "number" && claims.exp + skew < now) {
    throw new JwtError("Token expired", "EXPIRED");
  }
  if (opts.issuer && claims.iss !== opts.issuer) {
    throw new JwtError("Issuer mismatch", "ISSUER_MISMATCH");
  }
  if (opts.audience && claims.aud !== opts.audience) {
    throw new JwtError("Audience mismatch", "AUDIENCE_MISMATCH");
  }
  return claims as T;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [algo, saltHex, hashHex] = stored.split("$");
  if (algo !== "scrypt" || !saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const candidate = scryptSync(password, salt, expected.length);
  if (expected.length !== candidate.length) return false;
  return timingSafeEqual(expected, candidate);
}

export function newRefreshToken(): string {
  return randomBytes(48).toString("base64url");
}
