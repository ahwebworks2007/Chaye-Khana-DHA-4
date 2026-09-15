import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultCategories, defaultMenuItems } from '../data/defaultMenu';
import { defaultCafeSettings } from '../data/defaultSettings';
import {
  CafeSettings,
  MenuCategory,
  MenuItem,
} from '../types';
import { CK_BRANCHES, Branch } from '../data/branchesData';
import { AdminUser } from '../data/adminUsers';

export type AppView =
  | 'home'
  | 'menu'
  | 'about'
  | 'contact'
  | 'branches'
  | 'admin';

export type ThemeMode = 'dark' | 'light';

interface CafeContextType {
  // Navigation & UI
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  selectedItemForModal: MenuItem | null;
  setSelectedItemForModal: (item: MenuItem | null) => void;
  theme: ThemeMode;
  toggleTheme: () => void;

  // Single Source of Truth for Branches
  publicBranchId: string;
  setPublicBranchId: (id: string) => void;
  adminBranchId: string;
  setAdminBranchId: (id: string) => void;
  activeBranchId: string;
  activeBranch: Branch;

  // Branch-specific Dynamic Data
  menuItems: MenuItem[];
  categories: MenuCategory[];
  cafeSettings: CafeSettings;

  // Backend Authentication & Session States
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  loginAdmin: (passwordOrEmail: string, optionalPassword?: string) => Promise<boolean>;
  logoutAdmin: () => void;
  changeAdminPassword: (
    currentPass: string,
    newPass: string
  ) => Promise<{ success: boolean; error?: string }>;

  // Admin Operations (Secured by Backend)
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;
  toggleItemPopular: (id: string) => void;

  addCategory: (category: Omit<MenuCategory, 'id'>) => void;
  updateCategory: (category: MenuCategory) => void;
  deleteCategory: (id: string) => void;

  updateCafeSettings: (settings: CafeSettings) => void;
  resetToDefaultData: () => void;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Navigation & UI state
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('artisan_cafe_theme');
      return saved === 'dark' || saved === 'light' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('artisan_cafe_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.remove('light-mode');
        document.documentElement.classList.add('dark');
      }
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Authenticated Admin User (Verified strictly by backend)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Public Branch Selection (Storefront deployment configuration fallback)
  const [selectedBranchId, setSelectedBranchIdState] = useState<string>(() => {
    try {
      const envBranch = import.meta.env.VITE_ACTIVE_BRANCH_ID;
      if (envBranch && CK_BRANCHES.some((b) => b.id === envBranch)) {
        return envBranch;
      }
      const savedId = localStorage.getItem('ck_selected_branch');
      if (savedId && CK_BRANCHES.some((b) => b.id === savedId)) {
        return savedId;
      }
      return 'dha-phase-4';
    } catch {
      return 'dha-phase-4';
    }
  });

  const setBranchId = (id: string) => {
    // If admin is authenticated, branch selection is strictly locked to their assigned branchId
    if (isAdminAuthenticated && adminUser) {
      console.warn('Unauthorized: Branch administrators are strictly locked to their assigned branch.');
      return;
    }
    if (CK_BRANCHES.some((b) => b.id === id)) {
      setSelectedBranchIdState(id);
      try {
        localStorage.setItem('ck_selected_branch', id);
      } catch {}
    }
  };

  const publicBranchId = selectedBranchId;
  const adminBranchId = selectedBranchId;
  const setPublicBranchId = setBranchId;
  const setAdminBranchId = setBranchId;

  // Active Branch: If admin is authenticated, trusted assignment comes from server-verified adminUser.
  const activeBranchId = isAdminAuthenticated && adminUser ? adminUser.branchId : selectedBranchId;
  const activeBranch = CK_BRANCHES.find((b) => b.id === activeBranchId) || CK_BRANCHES[0];

  // Branch-specific Menu, Categories, and Settings State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => defaultMenuItems);
  const [categories, setCategories] = useState<MenuCategory[]>(() => defaultCategories);
  const [cafeSettings, setCafeSettings] = useState<CafeSettings>(() => ({
    ...defaultCafeSettings,
    cafeName: activeBranch.name,
    address: activeBranch.address,
    phone: activeBranch.phone,
    openingHoursDisplay: activeBranch.openingHours,
    city: activeBranch.city,
    googleMapsUrl: activeBranch.googleMapsUrl,
  }));

  // Fetch admin branch data strictly from backend using verified token or cookie
  const fetchAdminBranchData = async (token?: string) => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin/branch-data', {
        headers,
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.menuItems)) setMenuItems(data.menuItems);
        if (Array.isArray(data.categories)) setCategories(data.categories);
        if (data.cafeSettings) setCafeSettings(data.cafeSettings);
      }
    } catch (err) {
      console.error('Error fetching admin branch data:', err);
    }
  };

  // Verify stored session token or HTTP-only cookie on application boot
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
          fetchAdminBranchData(token);
        }
      })
      .catch(() => {
        localStorage.removeItem('ck_auth_token');
        setAdminUser(null);
        setIsAdminAuthenticated(false);
      });
  }, []);

  // Fetch public storefront data when not in admin mode
  useEffect(() => {
    if (isAdminAuthenticated && adminUser) return;

    fetch(`/api/public/branch/${activeBranchId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (Array.isArray(data.menuItems) && data.menuItems.length > 0) {
            setMenuItems(data.menuItems);
          }
          if (Array.isArray(data.categories) && data.categories.length > 0) {
            setCategories(data.categories);
          }
          if (data.cafeSettings) {
            setCafeSettings(data.cafeSettings);
          }
        }
      })
      .catch(() => {
        // Fallback to defaults
        const baseDefaultSettings: CafeSettings = {
          ...defaultCafeSettings,
          cafeName: activeBranch.name,
          address: activeBranch.address,
          phone: activeBranch.phone,
          openingHoursDisplay: activeBranch.openingHours,
          city: activeBranch.city,
          googleMapsUrl: activeBranch.googleMapsUrl,
        };
        setCafeSettings(baseDefaultSettings);
        setMenuItems(defaultMenuItems);
        setCategories(defaultCategories);
      });
  }, [activeBranchId, isAdminAuthenticated, adminUser]);

  // Admin authentication (Strict backend-enforced for DHA-4 single-branch setup)
  const loginAdmin = async (
    passwordOrEmail: string,
    optionalPassword?: string
  ): Promise<boolean> => {
    try {
      const email = optionalPassword ? passwordOrEmail.trim() : 'admin@chaayekhana.com';
      const password = (optionalPassword || passwordOrEmail).trim();

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();
      if (data.token && data.user) {
        localStorage.setItem('ck_auth_token', data.token);
        setAdminUser(data.user);
        setIsAdminAuthenticated(true);
        await fetchAdminBranchData(data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Backend login error:', err);
      return false;
    }
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
    const token = localStorage.getItem('ck_auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update password.' };
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Network error while updating password.' };
    }
  };

  // Helper to sync mutations to backend
  const syncMenuMutation = (items: MenuItem[]) => {
    const token = localStorage.getItem('ck_auth_token');
    if (!token || !isAdminAuthenticated) return;
    fetch('/api/admin/menu', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ menuItems: items }),
    }).catch((err) => console.error('Failed to sync menu mutation to backend:', err));
  };

  const syncCategoriesMutation = (cats: MenuCategory[]) => {
    const token = localStorage.getItem('ck_auth_token');
    if (!token || !isAdminAuthenticated) return;
    fetch('/api/admin/categories', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ categories: cats }),
    }).catch((err) => console.error('Failed to sync category mutation to backend:', err));
  };

  const syncSettingsMutation = (settings: CafeSettings) => {
    const token = localStorage.getItem('ck_auth_token');
    if (!token || !isAdminAuthenticated) return;
    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ settings }),
    }).catch((err) => console.error('Failed to sync settings mutation to backend:', err));
  };

  // Menu Admin Operations
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newId = `item-${Date.now()}`;
    const newItem: MenuItem = {
      ...itemData,
      id: newId,
    };
    const updated = [newItem, ...menuItems];
    setMenuItems(updated);
    syncMenuMutation(updated);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    const updated = menuItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setMenuItems(updated);
    syncMenuMutation(updated);
  };

  const deleteMenuItem = (itemId: string) => {
    const updated = menuItems.filter((item) => item.id !== itemId);
    setMenuItems(updated);
    syncMenuMutation(updated);
  };

  const toggleItemAvailability = (itemId: string) => {
    const updated = menuItems.map((item) =>
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    );
    setMenuItems(updated);
    syncMenuMutation(updated);
  };

  const toggleItemPopular = (itemId: string) => {
    const updated = menuItems.map((item) =>
      item.id === itemId ? { ...item, isPopular: !item.isPopular } : item
    );
    setMenuItems(updated);
    syncMenuMutation(updated);
  };

  // Category Admin Operations
  const addCategory = (categoryData: Omit<MenuCategory, 'id'>) => {
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCategory: MenuCategory = {
      ...categoryData,
      id: `${slug}-${Date.now().toString().slice(-4)}`,
    };
    const updated = [...categories, newCategory];
    setCategories(updated);
    syncCategoriesMutation(updated);
  };

  const updateCategory = (updatedCat: MenuCategory) => {
    const updated = categories.map((cat) =>
      cat.id === updatedCat.id ? updatedCat : cat
    );
    setCategories(updated);
    syncCategoriesMutation(updated);
  };

  const deleteCategory = (catId: string) => {
    const updated = categories.filter((cat) => cat.id !== catId);
    setCategories(updated);
    syncCategoriesMutation(updated);
  };

  const updateCafeSettings = (settings: CafeSettings) => {
    setCafeSettings(settings);
    syncSettingsMutation(settings);
  };

  const resetToDefaultData = () => {
    setMenuItems(defaultMenuItems);
    setCategories(defaultCategories);
    const baseDefaultSettings: CafeSettings = {
      ...defaultCafeSettings,
      cafeName: activeBranch.name,
      address: activeBranch.address,
      phone: activeBranch.phone,
      openingHoursDisplay: activeBranch.openingHours,
      city: activeBranch.city,
      googleMapsUrl: activeBranch.googleMapsUrl,
    };
    setCafeSettings(baseDefaultSettings);
    syncMenuMutation(defaultMenuItems);
    syncCategoriesMutation(defaultCategories);
    syncSettingsMutation(baseDefaultSettings);
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
        theme,
        toggleTheme,
        publicBranchId,
        setPublicBranchId,
        adminBranchId,
        setAdminBranchId,
        activeBranchId,
        activeBranch,
        menuItems,
        categories,
        cafeSettings,
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
        addCategory,
        updateCategory,
        deleteCategory,
        updateCafeSettings,
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
