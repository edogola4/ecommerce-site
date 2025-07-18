import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '../utils/jwt';
import { ResponseUtils } from '../utils/response';
import { User } from '../models/User';
import { JwtPayload } from '../types/interfaces';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to verify JWT token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      ResponseUtils.unauthorized(res, 'Access token required');
      return;
    }

    const decoded = JWTUtils.verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      ResponseUtils.unauthorized(res, 'User not found');
      return;
    }

    if (!user.isVerified) {
      ResponseUtils.unauthorized(res, 'Please verify your email address');
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      ResponseUtils.unauthorized(res, 'Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      ResponseUtils.unauthorized(res, 'Invalid token');
    } else {
      ResponseUtils.error(res, 'Authentication failed');
    }
  }
};

/**
 * Middleware to authorize user roles
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Authentication required');
      return;
    }

    if (!roles.includes(req.user.role)) {
      ResponseUtils.forbidden(res, 'Insufficient permissions');
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    ResponseUtils.unauthorized(res, 'Authentication required');
    return;
  }

  if (req.user.role !== 'admin') {
    ResponseUtils.forbidden(res, 'Admin access required');
    return;
  }

  next();
};

/**
 * Middleware to check if user is seller or admin
 */
export const isSellerOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    ResponseUtils.unauthorized(res, 'Authentication required');
    return;
  }

  if (!['seller', 'admin'].includes(req.user.role)) {
    ResponseUtils.forbidden(res, 'Seller or admin access required');
    return;
  }

  next();
};

/**
 * Optional authentication middleware
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    
    if (token) {
      const decoded = JWTUtils.verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isVerified) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

/**
 * Extract token from request headers
 */
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
};