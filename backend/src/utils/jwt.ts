import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/interfaces';

export class JWTUtils {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  /**
   * Generate JWT token for user
   */
  public static generateToken(payload: {
    userId: string;
    email: string;
    role: string;
  }): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
      issuer: 'ecommerce-app',
      audience: 'ecommerce-users'
    });
  }

  /**
   * Verify JWT token
   */
  public static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.JWT_SECRET, {
      issuer: 'ecommerce-app',
      audience: 'ecommerce-users'
    }) as JwtPayload;
  }

  /**
   * Generate refresh token
   */
  public static generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, this.JWT_SECRET, {
      expiresIn: '30d',
      issuer: 'ecommerce-app',
      audience: 'ecommerce-refresh'
    });
  }

  /**
   * Verify refresh token
   */
  public static verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, this.JWT_SECRET, {
      issuer: 'ecommerce-app',
      audience: 'ecommerce-refresh'
    }) as { userId: string };
  }

  /**
   * Generate password reset token
   */
  public static generatePasswordResetToken(userId: string): string {
    return jwt.sign({ userId }, this.JWT_SECRET, {
      expiresIn: '1h',
      issuer: 'ecommerce-app',
      audience: 'password-reset'
    });
  }

  /**
   * Verify password reset token
   */
  public static verifyPasswordResetToken(token: string): { userId: string } {
    return jwt.verify(token, this.JWT_SECRET, {
      issuer: 'ecommerce-app',
      audience: 'password-reset'
    }) as { userId: string };
  }
}