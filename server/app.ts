import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import {
  authenticateUser,
  changeUserPassword,
} from './auth';
import {
  getBranchData,
  updateBranchMenuItems,
  updateBranchCategories,
  updateBranchSettings,
  deleteBranchMenuItem,
  exportBranchBackup,
  restoreBranchBackup,
} from './db';
import {
  requireAuth,
  enforceBranchAuthorization,
  AuthenticatedRequest,
} from './middleware';

export function createExpressApp(): Express {
  const app = express();

  // Standard middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // ==========================================
  // 1. Health Endpoint
  // ==========================================
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // ==========================================
  // 2. Authentication Endpoints (Server-Enforced)
  // ==========================================
  const handleLogin = async (req: express.Request, res: express.Response) => {
    let { email, password } = req.body || {};
    // If email is omitted or generic, target primary admin account
    if (!email || email.trim() === 'admin') {
      email = 'admin@chaayekhana.com';
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const authResult = await authenticateUser(email, password);
    if (!authResult) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    // Set secure HTTP-only cookie for browser sessions
    res.cookie('ck_auth_token', authResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return res.json({
      success: true,
      token: authResult.token,
      user: authResult.user,
    });
  };

  app.post('/api/auth/login', handleLogin);
  app.post('/auth/login', handleLogin);

  const handleMe = (req: AuthenticatedRequest, res: express.Response) => {
    return res.json({
      authenticated: true,
      user: req.user,
    });
  };

  app.get('/api/auth/me', requireAuth, handleMe);
  app.get('/auth/me', requireAuth, handleMe);

  const handleLogout = (req: express.Request, res: express.Response) => {
    // Clear HTTP-only cookie
    res.clearCookie('ck_auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return res.json({ success: true, message: 'Logged out successfully.' });
  };

  app.post('/api/auth/logout', handleLogout);
  app.post('/auth/logout', handleLogout);

  const handleChangePassword = async (req: AuthenticatedRequest, res: express.Response) => {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required.' });
    }

    const result = await changeUserPassword(req.user!.id, currentPassword, newPassword);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.json({ success: true, message: 'Password updated successfully.' });
  };

  app.post('/api/auth/change-password', requireAuth, handleChangePassword);
  app.post('/auth/change-password', requireAuth, handleChangePassword);

  // ==========================================
  // 3. Public Storefront Branch Data Endpoint
  // ==========================================
  app.get('/api/public/branch/:branchId', (req, res) => {
    const branchId = req.params.branchId;
    const branchData = getBranchData(branchId);
    if (!branchData) {
      return res.status(404).json({ error: `Branch not found: ${branchId}` });
    }

    return res.json({
      branch: branchData.branch,
      menuItems: branchData.menuItems,
      categories: branchData.categories,
      cafeSettings: branchData.cafeSettings,
    });
  });

  // ==========================================
  // 4. Admin Branch Data (Implicit from verified token)
  // ==========================================
  app.get('/api/admin/branch-data', requireAuth, (req: AuthenticatedRequest, res) => {
    const userBranchId = req.user!.branchId;
    const data = getBranchData(userBranchId);
    if (!data) {
      return res.status(404).json({ error: `No data found for branch ${userBranchId}` });
    }

    return res.json({
      user: req.user,
      branch: data.branch,
      menuItems: data.menuItems,
      categories: data.categories,
      cafeSettings: data.cafeSettings,
    });
  });

  app.put('/api/admin/menu', requireAuth, (req: AuthenticatedRequest, res) => {
    const userBranchId = req.user!.branchId;
    const { menuItems } = req.body || {};
    if (!Array.isArray(menuItems)) {
      return res.status(400).json({ error: 'menuItems must be an array.' });
    }

    const updated = updateBranchMenuItems(userBranchId, menuItems);
    if (!updated) {
      return res.status(500).json({ error: 'Failed to update menu items.' });
    }

    return res.json({ success: true, count: menuItems.length });
  });

  app.put('/api/admin/categories', requireAuth, (req: AuthenticatedRequest, res) => {
    const userBranchId = req.user!.branchId;
    const { categories } = req.body || {};
    if (!Array.isArray(categories)) {
      return res.status(400).json({ error: 'categories must be an array.' });
    }

    const updated = updateBranchCategories(userBranchId, categories);
    if (!updated) {
      return res.status(500).json({ error: 'Failed to update categories.' });
    }

    return res.json({ success: true, count: categories.length });
  });

  app.put('/api/admin/settings', requireAuth, (req: AuthenticatedRequest, res) => {
    const userBranchId = req.user!.branchId;
    const { settings } = req.body || {};
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'settings object is required.' });
    }

    const updated = updateBranchSettings(userBranchId, settings);
    if (!updated) {
      return res.status(500).json({ error: 'Failed to update settings.' });
    }

    return res.json({ success: true, settings });
  });

  // =========================================================
  // 5. Explicit Branch-Targeted Endpoints with Authorization
  // =========================================================
  app.get(
    '/api/admin/branches/:targetBranchId/data',
    requireAuth,
    enforceBranchAuthorization((r) => r.params.targetBranchId),
    (req: AuthenticatedRequest, res) => {
      const data = getBranchData(req.params.targetBranchId);
      if (!data) return res.status(404).json({ error: 'Branch not found.' });
      return res.json(data);
    }
  );

  app.put(
    '/api/admin/branches/:targetBranchId/menu',
    requireAuth,
    enforceBranchAuthorization((r) => r.params.targetBranchId),
    (req: AuthenticatedRequest, res) => {
      const { menuItems } = req.body || {};
      if (!Array.isArray(menuItems)) {
        return res.status(400).json({ error: 'menuItems must be an array.' });
      }
      updateBranchMenuItems(req.params.targetBranchId, menuItems);
      return res.json({ success: true, branchId: req.params.targetBranchId });
    }
  );

  app.delete(
    '/api/admin/branches/:targetBranchId/menu/:itemId',
    requireAuth,
    enforceBranchAuthorization((r) => r.params.targetBranchId),
    (req: AuthenticatedRequest, res) => {
      const { targetBranchId, itemId } = req.params;
      const deleted = deleteBranchMenuItem(targetBranchId, itemId);
      if (!deleted) {
        return res.status(404).json({ error: 'Item not found in specified branch.' });
      }
      return res.json({ success: true, deletedItemId: itemId, branchId: targetBranchId });
    }
  );

  app.put(
    '/api/admin/branches/:targetBranchId/settings',
    requireAuth,
    enforceBranchAuthorization((r) => r.params.targetBranchId),
    (req: AuthenticatedRequest, res) => {
      const { settings } = req.body || {};
      if (!settings || typeof settings !== 'object') {
        return res.status(400).json({ error: 'settings object is required.' });
      }
      updateBranchSettings(req.params.targetBranchId, settings);
      return res.json({ success: true, branchId: req.params.targetBranchId });
    }
  );

  // ==========================================
  // 6. Branch Backup & Disaster Recovery
  // ==========================================
  app.get('/api/admin/backup', requireAuth, (req: AuthenticatedRequest, res) => {
    const userBranchId = req.user!.branchId;
    const backup = exportBranchBackup(userBranchId);
    if (!backup) {
      return res.status(404).json({ error: 'No data available to backup.' });
    }
    return res.json({
      timestamp: new Date().toISOString(),
      branchId: userBranchId,
      backup,
    });
  });

  app.post('/api/admin/restore', requireAuth, (req: AuthenticatedRequest, res) => {
    const userBranchId = req.user!.branchId;
    const { backup } = req.body || {};
    if (!backup || typeof backup !== 'object') {
      return res.status(400).json({ error: 'Invalid backup object provided.' });
    }

    const restored = restoreBranchBackup(userBranchId, backup);
    if (!restored) {
      return res.status(500).json({ error: 'Failed to restore backup.' });
    }

    return res.json({ success: true, message: 'Branch data restored successfully.' });
  });

  return app;
}

export default createExpressApp();
