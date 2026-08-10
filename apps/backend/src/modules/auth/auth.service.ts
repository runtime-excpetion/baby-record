import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { Request } from 'express';

interface SessionPayload {
  exp: number;
  iat: number;
}

@Injectable()
export class AuthService {
  static readonly COOKIE_NAME = 'baby_record_session';

  private readonly password: string;
  private readonly signingKey: Buffer;
  readonly sessionSeconds: number;
  readonly cookieSecure: boolean;

  constructor(config: ConfigService) {
    this.password = config.getOrThrow<string>('auth.password');
    const secret = config.getOrThrow<string>('auth.secret');
    this.signingKey = createHash('sha256').update(`baby-record:${secret}`).digest();
    this.sessionSeconds = config.getOrThrow<number>('auth.sessionDays') * 24 * 60 * 60;
    this.cookieSecure = config.getOrThrow<boolean>('auth.cookieSecure');
  }

  verifyPassword(candidate: string): boolean {
    const expected = createHash('sha256').update(this.password).digest();
    const actual = createHash('sha256').update(candidate).digest();
    return timingSafeEqual(expected, actual);
  }

  createSession(): string {
    const now = Math.floor(Date.now() / 1000);
    const payload = Buffer.from(JSON.stringify({ iat: now, exp: now + this.sessionSeconds } satisfies SessionPayload))
      .toString('base64url');
    return `${payload}.${this.sign(payload)}`;
  }

  isAuthenticated(request: Request): boolean {
    const token = this.readCookie(request, AuthService.COOKIE_NAME);
    if (!token) return false;

    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return false;

    const expected = this.sign(payload);
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return false;
    }

    try {
      const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionPayload;
      return Number.isFinite(parsed.exp) && parsed.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }

  cookieOptions() {
    return {
      httpOnly: true,
      secure: this.cookieSecure,
      sameSite: 'strict' as const,
      path: '/',
      maxAge: this.sessionSeconds * 1000,
    };
  }

  private sign(payload: string): string {
    return createHmac('sha256', this.signingKey).update(payload).digest('base64url');
  }

  private readCookie(request: Request, name: string): string | null {
    const raw = request.headers.cookie;
    if (!raw) return null;
    for (const item of raw.split(';')) {
      const separator = item.indexOf('=');
      if (separator < 0) continue;
      if (item.slice(0, separator).trim() === name) {
        return decodeURIComponent(item.slice(separator + 1).trim());
      }
    }
    return null;
  }
}
