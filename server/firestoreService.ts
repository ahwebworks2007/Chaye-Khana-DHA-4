import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  writeBatch,
} from 'firebase/firestore';
import { serverDb } from './firebaseAdmin';
import { defaultCategories, defaultMenuItems } from '../src/data/defaultMenu';
import { defaultCafeSettings } from '../src/data/defaultSettings';
import { MenuItem, MenuCategory, CafeSettings, CustomerOrder, OrderStatus } from '../src/types';

const CATEGORIES_COL = 'categories';
const MENU_ITEMS_COL = 'menu_items';
const SETTINGS_COL = 'cafe_settings';
const ORDERS_COL = 'orders';
const ADMIN_USERS_COL = 'admin_users';
const SETTINGS_DOC_ID = 'default';
const ADMIN_DOC_ID = 'admin';

export interface StoredAdminUser {
  id: string;
  email: string;
  role: 'admin';
  salt: string;
  passwordHash: string;
  updatedAt: number;
}

// Default initial admin credentials (hashed)
const defaultAdminSeed: StoredAdminUser = {
  id: 'admin_dha4',
  email: 'admin@chaayekhana.com',
  role: 'admin',
  salt: '06c96520672f00a8d6aee395eded95e1',
  passwordHash:
    '7f776b60c46692a23237bbe906e84e60c866b6e780aa76f9b13f155aad10044c88668d41301d260bbe701ae019f1f7a23d7c041cc7e59be8177e6826646aa75d',
  updatedAt: 1726150000000,
};

let hasSeeded = false;

// ==========================================
// 1. One-Time Firestore Seeder (No overwriting)
// ==========================================
export async function ensureFirestoreSeeded(): Promise<void> {
  if (hasSeeded) return;

  try {
    // Check if categories collection has documents
    const catQuery = query(collection(serverDb, CATEGORIES_COL), limit(1));
    const catSnapshot = await getDocs(catQuery);
    if (catSnapshot.empty) {
      console.log('[Firestore] Empty categories collection detected. Seeding categories...');
      const batch = writeBatch(serverDb);
      for (const cat of defaultCategories) {
        const docRef = doc(serverDb, CATEGORIES_COL, cat.id);
        batch.set(docRef, { ...cat, updatedAt: Date.now() });
      }
      await batch.commit();
      console.log(`[Firestore] Seeded ${defaultCategories.length} categories.`);
    }

    // Check if menu_items collection has documents
    const menuQuery = query(collection(serverDb, MENU_ITEMS_COL), limit(1));
    const menuSnapshot = await getDocs(menuQuery);
    if (menuSnapshot.empty) {
      console.log('[Firestore] Empty menu_items collection detected. Seeding authentic menu items...');
      const chunkSize = 400;
      for (let i = 0; i < defaultMenuItems.length; i += chunkSize) {
        const chunk = defaultMenuItems.slice(i, i + chunkSize);
        const batch = writeBatch(serverDb);
        for (const item of chunk) {
          const docRef = doc(serverDb, MENU_ITEMS_COL, item.id);
          batch.set(docRef, { ...item, updatedAt: Date.now() });
        }
        await batch.commit();
      }
      console.log(`[Firestore] Seeded ${defaultMenuItems.length} menu items successfully.`);
    }

    // Check if cafe_settings document exists
    const settingsDocRef = doc(serverDb, SETTINGS_COL, SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsDocRef);
    if (!settingsSnap.exists()) {
      console.log('[Firestore] Seeding default cafe settings...');
      await setDoc(settingsDocRef, {
        ...defaultCafeSettings,
        updatedAt: Date.now(),
      });
      console.log('[Firestore] Seeded default cafe settings.');
    }

    // Check if admin user exists
    const adminDocRef = doc(serverDb, ADMIN_USERS_COL, ADMIN_DOC_ID);
    const adminSnap = await getDoc(adminDocRef);
    if (!adminSnap.exists()) {
      console.log('[Firestore] Seeding default admin account...');
      await setDoc(adminDocRef, defaultAdminSeed);
      console.log('[Firestore] Seeded admin account.');
    }

    hasSeeded = true;
  } catch (err) {
    console.error('[Firestore] Seeding error:', err);
  }
}

// ==========================================
// 2. Categories Operations
// ==========================================
export async function getFirestoreCategories(): Promise<MenuCategory[]> {
  try {
    await ensureFirestoreSeeded();
    const catQuery = query(collection(serverDb, CATEGORIES_COL), orderBy('order', 'asc'));
    const snapshot = await getDocs(catQuery);
    if (snapshot.empty) return defaultCategories;
    return snapshot.docs.map((d) => d.data() as MenuCategory);
  } catch (err) {
    console.error('[Firestore] Error getting categories:', err);
    return defaultCategories;
  }
}

export async function saveFirestoreCategory(category: MenuCategory): Promise<boolean> {
  try {
    await setDoc(doc(serverDb, CATEGORIES_COL, category.id), {
      ...category,
      updatedAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.error('[Firestore] Error saving category:', err);
    return false;
  }
}

export async function deleteFirestoreCategory(categoryId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(serverDb, CATEGORIES_COL, categoryId));
    return true;
  } catch (err) {
    console.error('[Firestore] Error deleting category:', err);
    return false;
  }
}

// ==========================================
// 3. Menu Items Operations
// ==========================================
export async function getFirestoreMenuItems(): Promise<MenuItem[]> {
  try {
    await ensureFirestoreSeeded();
    const snapshot = await getDocs(collection(serverDb, MENU_ITEMS_COL));
    if (snapshot.empty) return defaultMenuItems;
    return snapshot.docs.map((d) => d.data() as MenuItem);
  } catch (err) {
    console.error('[Firestore] Error getting menu items:', err);
    return defaultMenuItems;
  }
}

export async function saveFirestoreMenuItem(item: MenuItem): Promise<boolean> {
  try {
    await setDoc(doc(serverDb, MENU_ITEMS_COL, item.id), {
      ...item,
      updatedAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.error('[Firestore] Error saving menu item:', err);
    return false;
  }
}

export async function deleteFirestoreMenuItem(itemId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(serverDb, MENU_ITEMS_COL, itemId));
    return true;
  } catch (err) {
    console.error('[Firestore] Error deleting menu item:', err);
    return false;
  }
}

// ==========================================
// 4. Cafe Settings Operations
// ==========================================
export async function getFirestoreCafeSettings(): Promise<CafeSettings> {
  try {
    await ensureFirestoreSeeded();
    const snap = await getDoc(doc(serverDb, SETTINGS_COL, SETTINGS_DOC_ID));
    if (snap.exists()) {
      return snap.data() as CafeSettings;
    }
    return defaultCafeSettings;
  } catch (err) {
    console.error('[Firestore] Error getting cafe settings:', err);
    return defaultCafeSettings;
  }
}

export async function saveFirestoreCafeSettings(settings: CafeSettings): Promise<boolean> {
  try {
    await setDoc(doc(serverDb, SETTINGS_COL, SETTINGS_DOC_ID), {
      ...settings,
      updatedAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.error('[Firestore] Error saving cafe settings:', err);
    return false;
  }
}

// ==========================================
// 5. Orders Operations (Guest creation & Admin tracking)
// ==========================================
export async function getFirestoreOrders(): Promise<CustomerOrder[]> {
  try {
    const ordersQuery = query(collection(serverDb, ORDERS_COL), orderBy('createdAtTimestamp', 'desc'));
    const snapshot = await getDocs(ordersQuery);
    return snapshot.docs.map((d) => d.data() as CustomerOrder);
  } catch (err) {
    console.error('[Firestore] Error getting orders:', err);
    return [];
  }
}

export async function getFirestoreOrderById(orderId: string): Promise<CustomerOrder | null> {
  try {
    const snap = await getDoc(doc(serverDb, ORDERS_COL, orderId));
    if (snap.exists()) {
      return snap.data() as CustomerOrder;
    }
    return null;
  } catch (err) {
    console.error('[Firestore] Error getting order by ID:', err);
    return null;
  }
}

export async function createFirestoreOrder(order: CustomerOrder): Promise<boolean> {
  try {
    await setDoc(doc(serverDb, ORDERS_COL, order.id), {
      ...order,
      createdAtTimestamp: order.createdAt ? new Date(order.createdAt).getTime() : Date.now(),
    });
    return true;
  } catch (err) {
    console.error('[Firestore] Error creating order in Firestore:', err);
    return false;
  }
}

export async function updateFirestoreOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  try {
    await updateDoc(doc(serverDb, ORDERS_COL, orderId), {
      status,
      updatedAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.error('[Firestore] Error updating order status in Firestore:', err);
    return false;
  }
}

// ==========================================
// 6. Admin Authentication & Password Operations
// ==========================================
export async function getFirestoreAdminUser(): Promise<StoredAdminUser> {
  try {
    await ensureFirestoreSeeded();
    const snap = await getDoc(doc(serverDb, ADMIN_USERS_COL, ADMIN_DOC_ID));
    if (snap.exists()) {
      return snap.data() as StoredAdminUser;
    }
    return defaultAdminSeed;
  } catch (err) {
    console.error('[Firestore] Error getting admin user from Firestore:', err);
    return defaultAdminSeed;
  }
}

export async function updateFirestoreAdminPassword(
  newSalt: string,
  newPasswordHash: string
): Promise<boolean> {
  try {
    await setDoc(
      doc(serverDb, ADMIN_USERS_COL, ADMIN_DOC_ID),
      {
        salt: newSalt,
        passwordHash: newPasswordHash,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error('[Firestore] Error updating admin password in Firestore:', err);
    return false;
  }
}

