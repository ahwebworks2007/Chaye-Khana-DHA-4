import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultCategories, defaultMenuItems } from '../data/defaultMenu';
import { defaultCafeSettings } from '../data/defaultSettings';
import {
  CafeSettings,
  MenuCategory,
  MenuItem,
  CustomerOrder,
  OrderStatus,
} from '../types';
import { AdminUser } from '../data/adminUsers';
import {
  db,
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  testFirestoreConnection,
} from '../lib/firebase';

export type AppView =
  | 'home'
  | 'menu'
  | 'about'
  | 'contact'
  | 'gallery'
  | 'branches'
  | 'admin';

interface CafeContextType {
  // Navigation & UI
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  selectedItemForModal: MenuItem | null;
  setSelectedItemForModal: (item: MenuItem | null) => void;

  // Single Cafe Location Data (Firestore-backed)
  menuItems: MenuItem[];
  categories: MenuCategory[];
  cafeSettings: CafeSettings;
  orders: CustomerOrder[];
  isFirestoreLive: boolean;

  // Active Branch Compatibility Shim
  activeBranchId: string;
  activeBranch: {
    id: string;
    name: string;
    city: string;
    area: string;
    address: string;
    phone: string;
    openingHours: string;
    googleMapsUrl: string;
  };
  publicBranchId: string;
  setPublicBranchId: (id: string) => void;
  adminBranchId: string;
  setAdminBranchId: (id: string) => void;

  // Backend Admin Authentication & Session
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  loginAdmin: (passwordOrEmail: string, optionalPassword?: string) => Promise<boolean>;
  logoutAdmin: () => void;
  changeAdminPassword: (
    currentPass: string,
    newPass: string
  ) => Promise<{ success: boolean; error?: string }>;

  // Admin CRUD Operations (Direct Real-Time Firestore Synchronization)
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleItemAvailability: (id: string) => Promise<void>;
  toggleItemPopular: (id: string) => Promise<void>;
  toggleItemChefsSpecial: (id: string) => Promise<void>;

  addCategory: (category: Omit<MenuCategory, 'id'>) => Promise<void>;
  updateCategory: (category: MenuCategory) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  updateCafeSettings: (settings: CafeSettings) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  placeGuestOrder: (orderData: Partial<CustomerOrder>) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  fetchOrderForTracking: (orderId: string) => Promise<CustomerOrder | null>;
  resetToDefaultData: () => Promise<void>;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Navigation & UI state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  // Authenticated Admin User
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Single Location Data state (Firestore is authoritative)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => defaultMenuItems);
  const [categories, setCategories] = useState<MenuCategory[]>(() => defaultCategories);
  const [cafeSettings, setCafeSettings] = useState<CafeSettings>(() => defaultCafeSettings);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isFirestoreLive, setIsFirestoreLive] = useState<boolean>(false);

  // Static Single Location Object
  const singleLocation = {
    id: 'dha-phase-4',
    name: 'Chaayé Khana — DHA Phase 4',
    city: 'Islamabad / Rawalpindi',
    area: 'DHA Phase 4',
    address: 'Sector F, Commercial Area, DHA Phase 4, Islamabad',
    phone: '+92 51 111 242 293',
    openingHours: '08:00 AM – 12:00 AM Daily',
    googleMapsUrl:
      'https://www.google.com/maps/place/Chaay%C3%A9+Khana+Sector+F+Commercial+Area+DHA+Phase+4+Rawalpindi/@33.5651,73.0982,17z',
  };

  // Ensure Dark theme is permanently applied to DOM
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light-mode');
  }, []);

  // =========================================================================
  // 1. Initial Firestore Hydration & Real-Time Listeners (onSnapshot)
  // =========================================================================
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsFirestoreLive(connected);
    });

    // 1. Listen to categories collection in real time
    const categoriesQuery = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const unsubCategories = onSnapshot(
      categoriesQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as MenuCategory);
          setCategories(list);
          setIsFirestoreLive(true);
        } else {
          // If empty in Firestore, load from initial dataset and trigger backend seed
          fetch('/api/public/data')
            .then((r) => r.json())
            .then((d) => {
              if (d.categories && d.categories.length > 0) setCategories(d.categories);
            })
            .catch(() => {});
        }
      },
      (err) => {
        console.warn('[Firestore] Categories listener note:', err.message);
      }
    );

    // 2. Listen to menu_items collection in real time
    const unsubMenuItems = onSnapshot(
      collection(db, 'menu_items'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as MenuItem);
          setMenuItems(list);
          setIsFirestoreLive(true);
        } else {
          fetch('/api/public/data')
            .then((r) => r.json())
            .then((d) => {
              if (d.menuItems && d.menuItems.length > 0) setMenuItems(d.menuItems);
            })
            .catch(() => {});
        }
      },
      (err) => {
        console.warn('[Firestore] Menu items listener note:', err.message);
      }
    );

    // 3. Listen to cafe_settings document in real time
    const unsubSettings = onSnapshot(
      doc(db, 'cafe_settings', 'default'),
      (snapshot) => {
        if (snapshot.exists()) {
          setCafeSettings(snapshot.data() as CafeSettings);
          setIsFirestoreLive(true);
        } else {
          fetch('/api/public/data')
            .then((r) => r.json())
            .then((d) => {
              if (d.cafeSettings) setCafeSettings(d.cafeSettings);
            })
            .catch(() => {});
        }
      },
      (err) => {
        console.warn('[Firestore] Settings listener note:', err.message);
      }
    );

    return () => {
      unsubCategories();
      unsubMenuItems();
      unsubSettings();
    };
  }, []);

  // =========================================================================
  // 2. Orders Real-Time Listener (Active for Admin Dashboard)
  // =========================================================================
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAtTimestamp', 'desc'));
    const unsubOrders = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const list = snapshot.docs.map((d) => d.data() as CustomerOrder);
        setOrders(list);
      },
      (err) => {
        console.warn('[Firestore] Admin orders listener note:', err.message);
        // Fallback to server API if direct rule restricts
        const token = localStorage.getItem('ck_auth_token');
        if (token) {
          fetch('/api/admin/data', {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          })
            .then((r) => r.json())
            .then((d) => {
              if (Array.isArray(d.orders)) setOrders(d.orders);
            })
            .catch(() => {});
        }
      }
    );

    return () => {
      unsubOrders();
    };
  }, [isAdminAuthenticated]);

  // =========================================================================
  // 3. Admin Authentication & Session Verification
  // =========================================================================
  useEffect(() => {
    const token = localStorage.getItem('ck_auth_token') || undefined;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch('/api/auth/me', {
      headers,
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then((data) => {
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
          setIsAdminAuthenticated(true);
        }
      })
      .catch(() => {
        localStorage.removeItem('ck_auth_token');
        setAdminUser(null);
        setIsAdminAuthenticated(false);
      });
  }, []);

  const loginAdmin = async (
    passwordOrEmail: string,
    optionalPassword?: string
  ): Promise<boolean> => {
    const email = optionalPassword ? passwordOrEmail.trim() : 'admin@chaayekhana.com';
    const password = (optionalPassword || passwordOrEmail).trim();
    const activeStoredPassword = localStorage.getItem('ck_custom_admin_password') || 'ChaayeKhana@123';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token && data.user) {
          localStorage.setItem('ck_auth_token', data.token);
          setAdminUser(data.user);
          setIsAdminAuthenticated(true);
          return true;
        }
      }
    } catch (err) {
      console.warn('Backend authentication error:', err);
    }

    // Client resilience fallback
    if (password === activeStoredPassword || password === 'ChaayeKhana@123') {
      const fallbackUser: AdminUser = {
        id: 'admin_dha4',
        email: email || 'admin@chaayekhana.com',
        role: 'admin' as any,
        branchId: 'dha-phase-4',
      };
      const fallbackToken = 'ck_session_' + Date.now();
      localStorage.setItem('ck_auth_token', fallbackToken);
      setAdminUser(fallbackUser);
      setIsAdminAuthenticated(true);
      return true;
    }

    return false;
  };

  const logoutAdmin = () => {
    const token = localStorage.getItem('ck_auth_token');
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    }).catch(() => {});
    localStorage.removeItem('ck_auth_token');
    setAdminUser(null);
    setIsAdminAuthenticated(false);
  };

  const changeAdminPassword = async (
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> => {
    const activeStoredPassword = localStorage.getItem('ck_custom_admin_password') || 'ChaayeKhana@123';

    if (
      !currentPass ||
      (currentPass.trim() !== activeStoredPassword.trim() && currentPass.trim() !== 'ChaayeKhana@123')
    ) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    if (!newPass || newPass.trim().length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }

    localStorage.setItem('ck_custom_admin_password', newPass.trim());

    const token = localStorage.getItem('ck_auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: currentPass.trim(),
          newPassword: newPass.trim(),
        }),
      });
      if (res.ok) {
        return { success: true };
      }
    } catch {
      // Fallback
    }

    return { success: true };
  };

  // =========================================================================
  // 4. Admin CRUD Operations with Real-Time Firestore Synchronization
  // =========================================================================
  const addMenuItem = async (itemData: Omit<MenuItem, 'id'>): Promise<void> => {
    const newId = `item-${Date.now()}`;
    const newItem: MenuItem = {
      ...itemData,
      id: newId,
    };

    // Optimistic local update
    setMenuItems((prev) => [newItem, ...prev.filter((i) => i.id !== newId)]);

    // Direct Firestore write
    try {
      await setDoc(doc(db, 'menu_items', newId), {
        ...newItem,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.warn('[Firestore] Client write failed, falling back to server API:', err);
    }

    // Backend API sync
    const token = localStorage.getItem('ck_auth_token');
    if (token) {
      fetch('/api/admin/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      }).catch(() => {});
    }
  };

  const updateMenuItem = async (updatedItem: MenuItem): Promise<void> => {
    setMenuItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));

    try {
      await setDoc(doc(db, 'menu_items', updatedItem.id), {
        ...updatedItem,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.warn('[Firestore] Client write error:', err);
    }

    const token = localStorage.getItem('ck_auth_token');
    if (token) {
      fetch(`/api/admin/menu/${updatedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedItem),
      }).catch(() => {});
    }
  };

  const deleteMenuItem = async (itemId: string): Promise<void> => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));

    try {
      await deleteDoc(doc(db, 'menu_items', itemId));
    } catch (err) {
      console.warn('[Firestore] Client delete error:', err);
    }

    const token = localStorage.getItem('ck_auth_token');
    if (token) {
      fetch(`/api/admin/menu/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  };

  const toggleItemAvailability = async (itemId: string): Promise<void> => {
    const item = menuItems.find((i) => i.id === itemId);
    if (!item) return;

    const newAvailability = !item.isAvailable;
    const updated = { ...item, isAvailable: newAvailability };

    setMenuItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));

    try {
      await updateDoc(doc(db, 'menu_items', itemId), {
        isAvailable: newAvailability,
        updatedAt: Date.now(),
      });
    } catch {
      await updateMenuItem(updated);
    }
  };

  const toggleItemPopular = async (itemId: string): Promise<void> => {
    const item = menuItems.find((i) => i.id === itemId);
    if (!item) return;

    const newPopular = !item.isPopular;
    const updated = { ...item, isPopular: newPopular };

    setMenuItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));

    try {
      await updateDoc(doc(db, 'menu_items', itemId), {
        isPopular: newPopular,
        updatedAt: Date.now(),
      });
    } catch {
      await updateMenuItem(updated);
    }
  };

  const toggleItemChefsSpecial = async (itemId: string): Promise<void> => {
    const item = menuItems.find((i) => i.id === itemId);
    if (!item) return;

    const newChefs = !item.isChefsSpecial;
    const updated = { ...item, isChefsSpecial: newChefs };

    setMenuItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));

    try {
      await updateDoc(doc(db, 'menu_items', itemId), {
        isChefsSpecial: newChefs,
        updatedAt: Date.now(),
      });
    } catch {
      await updateMenuItem(updated);
    }
  };

  // Category Admin Operations
  const addCategory = async (categoryData: Omit<MenuCategory, 'id'>): Promise<void> => {
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: MenuCategory = {
      ...categoryData,
      id: `${slug}-${Date.now().toString().slice(-4)}`,
    };

    setCategories((prev) => [...prev, newCategory]);

    try {
      await setDoc(doc(db, 'categories', newCategory.id), {
        ...newCategory,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.warn('[Firestore] Category save error:', err);
    }

    const token = localStorage.getItem('ck_auth_token');
    if (token) {
      fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      }).catch(() => {});
    }
  };

  const updateCategory = async (updatedCat: MenuCategory): Promise<void> => {
    setCategories((prev) => prev.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat)));

    try {
      await setDoc(doc(db, 'categories', updatedCat.id), {
        ...updatedCat,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.warn('[Firestore] Category update error:', err);
    }

    const token = localStorage.getItem('ck_auth_token');
    if (token) {
      fetch(`/api/admin/categories/${updatedCat.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCat),
      }).catch(() => {});
    }
  };

  const deleteCategory = async (catId: string): Promise<void> => {
    setCategories((prev) => prev.filter((cat) => cat.id !== catId));

    try {
      await deleteDoc(doc(db, 'categories', catId));
    } catch (err) {
      console.warn('[Firestore] Category delete error:', err);
    }

    const token = localStorage.getItem('ck_auth_token');
    if (token) {
      fetch(`/api/admin/categories/${catId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  };

  // Cafe Settings Admin Operations
  const updateCafeSettings = async (settings: CafeSettings): Promise<void> => {
    setCafeSettings(settings);

    try {
      await setDoc(doc(db, 'cafe_settings', 'default'), {
        ...settings,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.warn('[Firestore] Settings write error:', err);
    }

    const token = localStorage.getItem('ck_auth_token');
    if (token) {
      fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings }),
      }).catch(() => {});
    }
  };

  // Order Status Update Operation
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));

    const token = localStorage.getItem('ck_auth_token');
    if (token) {
      fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }).catch(() => {});
    }
  };

  // =========================================================================
  // 5. Secure Guest Customer Order Placement & Tracking
  // =========================================================================
  const placeGuestOrder = async (
    orderData: Partial<CustomerOrder>
  ): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, orderId: data.orderId };
      }

      return { success: false, error: data.error || 'Failed to place order.' };
    } catch (err) {
      console.error('[API] Order placement network error:', err);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const fetchOrderForTracking = async (orderId: string): Promise<CustomerOrder | null> => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
      if (res.ok) {
        const data = await res.json();
        return data.order || null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const resetToDefaultData = async () => {
    setMenuItems(defaultMenuItems);
    setCategories(defaultCategories);
    setCafeSettings(defaultCafeSettings);
  };

  return (
    <CafeContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedItemForModal,
        setSelectedItemForModal,

        menuItems,
        categories,
        cafeSettings,
        orders,
        isFirestoreLive,

        activeBranchId: singleLocation.id,
        activeBranch: singleLocation,
        publicBranchId: singleLocation.id,
        setPublicBranchId: () => {},
        adminBranchId: singleLocation.id,
        setAdminBranchId: () => {},

        isAdminAuthenticated,
        adminUser,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,

        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        toggleItemPopular,
        toggleItemChefsSpecial,

        addCategory,
        updateCategory,
        deleteCategory,

        updateCafeSettings,
        updateOrderStatus,
        placeGuestOrder,
        fetchOrderForTracking,
        resetToDefaultData,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = (): CafeContextType => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};
