import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultCategories, defaultMenuItems } from '../data/defaultMenu';
import { defaultCafeSettings } from '../data/defaultSettings';
import {
  CafeSettings,
  MenuCategory,
  MenuItem,
} from '../types';
import { hashPassword, verifyPassword } from '../utils/security';

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

  // Menu & Categories
  menuItems: MenuItem[];
  categories: MenuCategory[];

  // Cafe Settings
  cafeSettings: CafeSettings;
  updateCafeSettings: (settings: CafeSettings) => void;

  // Admin Authentication & Security
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  changeAdminPassword: (
    currentPass: string,
    newPass: string
  ) => Promise<{ success: boolean; error?: string }>;

  // Menu & Category Management
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (itemId: string) => void;
  toggleItemAvailability: (itemId: string) => void;
  toggleItemPopular: (itemId: string) => void;
  addCategory: (category: Omit<MenuCategory, 'id'>) => void;
  updateCategory: (category: MenuCategory) => void;
  deleteCategory: (catId: string) => void;
  resetToDefaultData: () => void;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('chaaye_khana_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chaaye_khana_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
      } else {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
      }
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('artisan_admin_auth') === 'true';
  });

  // Persistent Menu Items - Clean up old storage keys to enforce new official menu
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      localStorage.removeItem('artisan_menu_items');
      localStorage.removeItem('chaaye_khana_menu_items');
      const saved = localStorage.getItem('ck_official_menu_v4');
      return saved ? JSON.parse(saved) : defaultMenuItems;
    } catch {
      return defaultMenuItems;
    }
  });

  // Persistent Categories - Clean up old storage keys
  const [categories, setCategories] = useState<MenuCategory[]>(() => {
    try {
      localStorage.removeItem('artisan_categories');
      localStorage.removeItem('chaaye_khana_categories');
      const saved = localStorage.getItem('ck_official_categories_v4');
      return saved ? JSON.parse(saved) : defaultCategories;
    } catch {
      return defaultCategories;
    }
  });

  // Persistent Cafe Settings
  const [cafeSettings, setCafeSettings] = useState<CafeSettings>(() => {
    try {
      const saved = localStorage.getItem('ck_official_settings_v4');
      const parsed: CafeSettings = saved ? JSON.parse(saved) : defaultCafeSettings;
      
      const merged: CafeSettings = {
        ...defaultCafeSettings,
        ...parsed,
        socialsConfig: parsed.socialsConfig && parsed.socialsConfig.length > 0 
          ? parsed.socialsConfig 
          : defaultCafeSettings.socialsConfig,
      };

      const savedHash = localStorage.getItem('ck_admin_pwd_hash');
      if (savedHash && !merged.adminPasswordHash) {
        merged.adminPasswordHash = savedHash;
      }
      return merged;
    } catch {
      return defaultCafeSettings;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ck_official_menu_v4', JSON.stringify(menuItems));
    } catch {}
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem('ck_official_categories_v4', JSON.stringify(categories));
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('ck_official_settings_v4', JSON.stringify(cafeSettings));
    } catch {}
  }, [cafeSettings]);

  // Admin authentication
  const loginAdmin = async (password: string): Promise<boolean> => {
    const trimmed = password.trim();
    const storedHash = cafeSettings.adminPasswordHash || localStorage.getItem('ck_admin_pwd_hash') || undefined;
    const isValid = await verifyPassword(trimmed, storedHash);
    if (isValid) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('artisan_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('artisan_admin_auth');
  };

  const changeAdminPassword = async (
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedCurrent = currentPass.trim();
    const trimmedNew = newPass.trim();

    if (!trimmedCurrent) {
      return { success: false, error: 'Current password is required.' };
    }
    if (!trimmedNew) {
      return { success: false, error: 'New password cannot be empty.' };
    }

    const storedHash = cafeSettings.adminPasswordHash || localStorage.getItem('ck_admin_pwd_hash') || undefined;
    const isCurrentValid = await verifyPassword(trimmedCurrent, storedHash);

    if (!isCurrentValid) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    const newHash = await hashPassword(trimmedNew);
    const updatedSettings: CafeSettings = {
      ...cafeSettings,
      adminPasswordHash: newHash,
      adminPin: undefined,
    };

    setCafeSettings(updatedSettings);
    try {
      localStorage.setItem('ck_admin_pwd_hash', newHash);
      localStorage.setItem('ck_official_settings_v4', JSON.stringify(updatedSettings));
    } catch {}

    return { success: true };
  };

  // Menu Admin Operations
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newId = `item-${Date.now()}`;
    const newItem: MenuItem = {
      ...itemData,
      id: newId,
    };
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const toggleItemPopular = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isPopular: !item.isPopular } : item
      )
    );
  };

  // Category Admin Operations
  const addCategory = (categoryData: Omit<MenuCategory, 'id'>) => {
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCategory: MenuCategory = {
      ...categoryData,
      id: `${slug}-${Date.now().toString().slice(-4)}`,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (updatedCat: MenuCategory) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat))
    );
  };

  const deleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== catId));
  };

  const updateCafeSettings = (settings: CafeSettings) => {
    setCafeSettings(settings);
  };

  const resetToDefaultData = () => {
    setMenuItems(defaultMenuItems);
    setCategories(defaultCategories);
    setCafeSettings(defaultCafeSettings);
    localStorage.removeItem('artisan_menu_items');
    localStorage.removeItem('artisan_categories');
    localStorage.removeItem('artisan_cafe_settings');
    localStorage.removeItem('artisan_orders');
    localStorage.removeItem('artisan_cart');
    localStorage.removeItem('artisan_delivery_settings');
    localStorage.removeItem('artisan_pickup_settings');
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
        menuItems,
        categories,
        cafeSettings,
        isAdminAuthenticated,
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
