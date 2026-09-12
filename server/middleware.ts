import { Request, Response, NextFunction } from 'express';
import { verifySignedSessionToken, AuthenticatedUser } from './auth';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token: string | undefined;

  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 2. Check HTTP-only cookie as secure fallback
  if (!token && req.cookies && req.cookies['ck_auth_token']) {
    token = req.cookies['ck_auth_token'];
  }

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication token required.',
    });
  }

  const user = verifySignedSessionToken(token);
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid or expired session token.',
    });
  }

  req.user = user;
  next();
}

export function enforceBranchAuthorization(
  targetBranchGetter: (req: AuthenticatedRequest) => string | undefined
) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const targetBranchId = targetBranchGetter(req);
    if (!targetBranchId) {
      return res.status(400).json({ error: 'Bad Request: Target branch ID missing.' });
    }

    if (req.user.branchId !== targetBranchId) {
      return res.status(403).json({
        error: 'Forbidden: You are not authorized to access or modify data for another branch.',
        assignedBranchId: req.user.branchId,
        attemptedBranchId: targetBranchId,
      });
    }

    next();
  };
}
