import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import {
  authenticateUser,
  changeUserPassword,
} from './auth';
import {
  getFirestoreCategories,
  getFirestoreMenuItems,
  getFirestoreCafeSettings,
  getFirestoreOrders,
  getFirestoreOrderById,
  createFirestoreOrder,
  updateFirestoreOrderStatus,
  saveFirestoreMenuItem,
  deleteFirestoreMenuItem,
  saveFirestoreCategory,
  deleteFirestoreCategory,
  saveFirestoreCafeSettings,
  ensureFirestoreSeeded,
} from './firestoreService';
import {
  requireAuth,
  AuthenticatedRequest,
} from './middleware';
import { CustomerOrder, OrderStatus } from '../src/types';

export function createExpressApp(): Express {
  const app = express();

  // Standard middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // Ensure Firestore is initialized / seeded on first request
  app.use(async (req, res, next) => {
    try {
      await ensureFirestoreSeeded();
    } catch {
      // Non-blocking fallback
    }
    next();
  });

  // ==========================================
  // 1. Health Endpoint
  // ==========================================
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), database: 'Firestore' });
  });

  // ==========================================
  // 2. Authentication Endpoints (Server-Enforced)
  // ==========================================
  const handleLogin = async (req: express.Request, res: express.Response) => {
    let { email, password } = req.body || {};
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
  // 3. Public Storefront Data Endpoint (Firestore)
  // ==========================================
  const handlePublicData = async (req: express.Request, res: express.Response) => {
    try {
      const [categories, menuItems, cafeSettings] = await Promise.all([
        getFirestoreCategories(),
        getFirestoreMenuItems(),
        getFirestoreCafeSettings(),
      ]);

      return res.json({
        categories,
        menuItems,
        cafeSettings,
      });
    } catch (err) {
      console.error('[API] Error loading public data:', err);
      return res.status(500).json({ error: 'Failed to retrieve cafe data.' });
    }
  };

  app.get('/api/public/data', handlePublicData);
  app.get('/api/public/branch/:branchId', handlePublicData);

  // ==========================================
  // 4. Secure Guest Customer Order Creation & Validation
  // ==========================================
  app.post('/api/orders', async (req: express.Request, res: express.Response) => {
    try {
      const orderPayload = req.body as Partial<CustomerOrder>;

      if (!orderPayload || !orderPayload.customerName || !orderPayload.customerPhone) {
        return res.status(400).json({ error: 'Customer name and phone number are required.' });
      }

      if (!Array.isArray(orderPayload.items) || orderPayload.items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item.' });
      }

      // Fetch authentic menu items from Firestore for server-side price validation
      const actualMenuItems = await getFirestoreMenuItems();
      const menuMap = new Map(actualMenuItems.map((item) => [item.id, item]));

      let calculatedSubtotal = 0;
      const validatedItems = [];

      for (const item of orderPayload.items) {
        const authenticItem = menuMap.get(item.menuItem?.id);
        if (!authenticItem || !authenticItem.isAvailable) {
          return res.status(400).json({
            error: `Item "${item.menuItem?.name || 'Unknown'}" is currently unavailable or does not exist.`,
          });
        }

        const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
        let unitPrice = authenticItem.price;

        // Verify variant price if selected
        const selectedVariantName =
          typeof item.selectedVariant === 'string'
            ? item.selectedVariant
            : item.selectedVariant && typeof item.selectedVariant === 'object'
            ? (item.selectedVariant as any).name
            : undefined;

        if (selectedVariantName) {
          const matchedVariant = authenticItem.variants?.find((v) => v.name === selectedVariantName);
          if (matchedVariant) {
            unitPrice = matchedVariant.price;
          }
        }

        // Add selected options prices
        if (Array.isArray(item.selectedOptions)) {
          for (const opt of item.selectedOptions) {
            const optName =
              typeof opt === 'string'
                ? opt
                : opt && typeof opt === 'object'
                ? (opt as any).name
                : undefined;
            if (optName) {
              const matchedOpt = authenticItem.options?.find((o) => o.name === optName);
              if (matchedOpt) {
                unitPrice += matchedOpt.price;
              }
            }
          }
        }

        const itemTotal = unitPrice * quantity;
        calculatedSubtotal += itemTotal;

        validatedItems.push({
          ...item,
          quantity,
          unitPrice,
          totalPrice: itemTotal,
          menuItem: authenticItem,
        });
      }

      const cafeSettings = await getFirestoreCafeSettings();
      const taxRate = (cafeSettings.taxRatePercent || 0) / 100;
      const calculatedTax = Math.round(calculatedSubtotal * taxRate);

      let deliveryFee = 0;
      if (orderPayload.orderType === 'delivery') {
        const zoneFee = orderPayload.deliveryFee || 150;
        deliveryFee = Math.max(0, Number(zoneFee));
      }

      const calculatedTotal = calculatedSubtotal + calculatedTax + deliveryFee;
      const orderId = orderPayload.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      const newOrder: CustomerOrder = {
        id: orderId,
        customerName: String(orderPayload.customerName).trim(),
        customerPhone: String(orderPayload.customerPhone).trim(),
        customerEmail: orderPayload.customerEmail ? String(orderPayload.customerEmail).trim() : undefined,
        orderType: orderPayload.orderType || 'delivery',
        items: validatedItems,
        subtotal: calculatedSubtotal,
        deliveryFee,
        tax: calculatedTax,
        total: calculatedTotal,
        status: 'New',
        deliveryAddress: orderPayload.deliveryAddress ? String(orderPayload.deliveryAddress).trim() : undefined,
        deliveryLandmark: orderPayload.deliveryLandmark ? String(orderPayload.deliveryLandmark).trim() : undefined,
        pickupTime: orderPayload.pickupTime,
        paymentMethod: orderPayload.paymentMethod || 'cash_on_delivery',
        createdAt: new Date().toISOString(),
        createdAtTimestamp: Date.now(),
      };

      const saved = await createFirestoreOrder(newOrder);
      if (!saved) {
        return res.status(500).json({ error: 'Failed to persist order to Firestore.' });
      }

      return res.status(201).json({
        success: true,
        orderId: newOrder.id,
        order: newOrder,
      });
    } catch (err) {
      console.error('[API] Order creation error:', err);
      return res.status(500).json({ error: 'Server error while processing your order.' });
    }
  });

  // Specific Order Tracking Endpoint (Restricted to single order ID)
  app.get('/api/orders/:orderId', async (req: express.Request, res: express.Response) => {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required.' });
    }

    const order = await getFirestoreOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    return res.json({ success: true, order });
  });

  // ==========================================
  // 5. Admin Endpoints (Protected by JWT Session)
  // ==========================================
  app.get('/api/admin/data', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const [categories, menuItems, cafeSettings, orders] = await Promise.all([
        getFirestoreCategories(),
        getFirestoreMenuItems(),
        getFirestoreCafeSettings(),
        getFirestoreOrders(),
      ]);

      return res.json({
        user: req.user,
        categories,
        menuItems,
        cafeSettings,
        orders,
      });
    } catch (err) {
      console.error('[Admin API] Error loading admin data:', err);
      return res.status(500).json({ error: 'Failed to retrieve admin data from Firestore.' });
    }
  });

  // Admin Menu Item Operations
  app.post('/api/admin/menu', requireAuth, async (req: AuthenticatedRequest, res) => {
    const item = req.body;
    if (!item || !item.name || !item.categoryId) {
      return res.status(400).json({ error: 'Item name and category are required.' });
    }

    const itemId = item.id || `item-${Date.now()}`;
    const saved = await saveFirestoreMenuItem({ ...item, id: itemId });
    if (!saved) {
      return res.status(500).json({ error: 'Failed to save menu item.' });
    }

    return res.json({ success: true, item: { ...item, id: itemId } });
  });

  app.put('/api/admin/menu/:itemId', requireAuth, async (req: AuthenticatedRequest, res) => {
    const { itemId } = req.params;
    const item = req.body;
    if (!item) {
      return res.status(400).json({ error: 'Item payload is required.' });
    }

    const saved = await saveFirestoreMenuItem({ ...item, id: itemId });
    if (!saved) {
      return res.status(500).json({ error: 'Failed to update menu item.' });
    }

    return res.json({ success: true, item: { ...item, id: itemId } });
  });

  app.delete('/api/admin/menu/:itemId', requireAuth, async (req: AuthenticatedRequest, res) => {
    const { itemId } = req.params;
    const deleted = await deleteFirestoreMenuItem(itemId);
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete menu item.' });
    }

    return res.json({ success: true, deletedItemId: itemId });
  });

  // Admin Category Operations
  app.post('/api/admin/categories', requireAuth, async (req: AuthenticatedRequest, res) => {
    const category = req.body;
    if (!category || !category.name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    const catId = category.id || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const saved = await saveFirestoreCategory({ ...category, id: catId });
    if (!saved) {
      return res.status(500).json({ error: 'Failed to save category.' });
    }

    return res.json({ success: true, category: { ...category, id: catId } });
  });

  app.put('/api/admin/categories/:categoryId', requireAuth, async (req: AuthenticatedRequest, res) => {
    const { categoryId } = req.params;
    const category = req.body;
    const saved = await saveFirestoreCategory({ ...category, id: categoryId });
    if (!saved) {
      return res.status(500).json({ error: 'Failed to update category.' });
    }

    return res.json({ success: true, category: { ...category, id: categoryId } });
  });

  app.delete('/api/admin/categories/:categoryId', requireAuth, async (req: AuthenticatedRequest, res) => {
    const { categoryId } = req.params;
    const deleted = await deleteFirestoreCategory(categoryId);
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete category.' });
    }

    return res.json({ success: true, deletedCategoryId: categoryId });
  });

  // Admin Settings Operations
  app.put('/api/admin/settings', requireAuth, async (req: AuthenticatedRequest, res) => {
    const { settings } = req.body || {};
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Settings object is required.' });
    }

    const saved = await saveFirestoreCafeSettings(settings);
    if (!saved) {
      return res.status(500).json({ error: 'Failed to update cafe settings.' });
    }

    return res.json({ success: true, settings });
  });

  // Admin Order Status Update
  app.patch('/api/admin/orders/:orderId/status', requireAuth, async (req: AuthenticatedRequest, res) => {
    const { orderId } = req.params;
    const { status } = req.body as { status: OrderStatus };
    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const updated = await updateFirestoreOrderStatus(orderId, status);
    if (!updated) {
      return res.status(500).json({ error: 'Failed to update order status.' });
    }

    return res.json({ success: true, orderId, status });
  });

  // Compatibility routes for existing admin branch calls
  app.get('/api/admin/branch-data', requireAuth, async (req: AuthenticatedRequest, res) => {
    const [categories, menuItems, cafeSettings, orders] = await Promise.all([
      getFirestoreCategories(),
      getFirestoreMenuItems(),
      getFirestoreCafeSettings(),
      getFirestoreOrders(),
    ]);

    return res.json({
      user: req.user,
      categories,
      menuItems,
      cafeSettings,
      orders,
    });
  });

  return app;
}

export default createExpressApp();
