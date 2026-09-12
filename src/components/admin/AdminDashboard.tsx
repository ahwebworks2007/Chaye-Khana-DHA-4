import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpDown,
  Cake,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Citrus,
  Clock,
  Coffee,
  CupSoda,
  Edit2,
  Eye,
  EyeOff,
  Flame,
  Folder,
  GlassWater,
  IceCream,
  Info,
  Layers,
  Lock,
  LogOut,
  MapPin,
  Package,
  Phone,
  Pizza,
  Plus,
  Save,
  Search,
  Settings,
  Soup,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  Unlock,
  Upload,
  Image as ImageIcon,
  Utensils,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { useCafe } from '../../context/CafeContext';
import {
  MenuCategory,
  MenuItem,
  MenuItemOption,
  MenuItemVariant,
} from '../../types';
import { formatPrice } from '../../utils/helpers';
import { navigateTo } from '../../utils/router';
import { ProfileDropdown } from '../ProfileDropdown';

interface AdminDashboardProps {
  onNavigate?: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const {
    isAdminAuthenticated,
    logoutAdmin,
    changeAdminPassword,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    cafeSettings,
    updateCafeSettings,
    setCurrentView,
  } = useCafe();

  // Redirect to /admin/login if not authenticated
  React.useEffect(() => {
    if (!isAdminAuthenticated) {
      if (onNavigate) {
        onNavigate('/admin/login');
      } else {
        navigateTo('/admin/login');
      }
    }
  }, [isAdminAuthenticated, onNavigate]);

  // Change Password Modal & Form State
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Admin Active Tab: 'menu' | 'categories' | 'settings'
  const [adminTab, setAdminTab] = useState<'menu' | 'categories' | 'settings'>('menu');

  // Category-based menu management state
  const [selectedAdminCategoryId, setSelectedAdminCategoryId] = useState<string | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [inCategorySearch, setInCategorySearch] = useState('');
  const [inCategoryDietFilter, setInCategoryDietFilter] = useState<string>('all');

  // Item Editor Modal State
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  // Category Editor Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<Partial<MenuCategory>>({
    name: '',
    description: '',
    iconName: 'Utensils',
    order: 1,
    isActive: true,
  });
  const [categoryToDelete, setCategoryToDelete] = useState<MenuCategory | null>(null);
  const [categoryWarningModal, setCategoryWarningModal] = useState<{ title: string; message: string } | null>(null);

  // Form fields for editing/creating menu item
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    categoryId: 'breakfast',
    image: '',
    isAvailable: true,
    isPopular: false,
    isChefsSpecial: false,
    isVegetarian: false,
    isSpicy: false,
    variants: [],
    options: [],
  });

  // Cafe info local form
  const [localCafe, setLocalCafe] = useState(cafeSettings);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);

  const handleLogoUpload = (file: File) => {
    setLogoUploadError(null);
    if (!file.type.startsWith('image/')) {
      setLogoUploadError('Please drop or select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoUploadError('Image size should be less than 2MB for optimized performance.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLocalCafe((prev) => ({ ...prev, logo: result }));
      showSuccessNotice('Logo uploaded successfully! Make sure to click Save Settings at the bottom.');
    };
    reader.onerror = () => {
      setLogoUploadError('Error reading the image file. Please try another one.');
    };
    reader.readAsDataURL(file);
  };

  React.useEffect(() => {
    setLocalCafe(cafeSettings);
  }, [cafeSettings]);

  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  const showSuccessNotice = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const showErrorNotice = (msg: string) => {
    setSaveErrorMsg(msg);
    setTimeout(() => setSaveErrorMsg(null), 4000);
  };

  const handleLogout = () => {
    logoutAdmin();
    if (onNavigate) {
      onNavigate('/admin/login');
    } else {
      navigateTo('/admin/login');
    }
  };

  const handleViewStorefront = () => {
    setCurrentView('home');
    if (onNavigate) {
      onNavigate('/');
    } else {
      navigateTo('/');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');

    if (!currentPasswordInput) {
      setPasswordChangeError('Please enter your current password.');
      return;
    }
    if (!newPasswordInput) {
      setPasswordChangeError('New password cannot be empty.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('New Password and Confirm New Password must match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await changeAdminPassword(currentPasswordInput, newPasswordInput);
      if (!result.success) {
        setPasswordChangeError(result.error || 'Failed to update password.');
        setIsChangingPassword(false);
        return;
      }

      showSuccessNotice('Password updated successfully.');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setPasswordChangeError('');
      setIsChangePasswordModalOpen(false);
    } catch {
      setPasswordChangeError('An unexpected error occurred while updating password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Helper to render category icon
  const renderCategoryIcon = (catId: string, iconName?: string, className: string = 'w-5 h-5') => {
    const key = (iconName || catId).toLowerCase();
    if (key.includes('breakfast') || key.includes('coffee') || key.includes('egg')) {
      return <Coffee className={className} />;
    }
    if (key.includes('soup') || key.includes('broth')) {
      return <Soup className={className} />;
    }
    if (key.includes('sandwich') || key.includes('burger')) {
      return <Utensils className={className} />;
    }
    if (key.includes('bun') || key.includes('flame') || key.includes('kabab')) {
      return <Flame className={className} />;
    }
    if (key.includes('chef') || key.includes('special') || key.includes('sparkle')) {
      return <Sparkles className={className} />;
    }
    if (key.includes('snack')) {
      return <UtensilsCrossed className={className} />;
    }
    if (key.includes('main') || key.includes('course')) {
      return <UtensilsCrossed className={className} />;
    }
    if (key.includes('pizza')) {
      return <Pizza className={className} />;
    }
    if (key.includes('bakery') || key.includes('dessert') || key.includes('cake')) {
      return <Cake className={className} />;
    }
    if (key.includes('beverage') || key.includes('glass') || key.includes('water') || key.includes('cooler')) {
      return <GlassWater className={className} />;
    }
    if (key.includes('shake') || key.includes('icecream') || key.includes('gelato')) {
      return <IceCream className={className} />;
    }
    if (key.includes('juice') || key.includes('citrus') || key.includes('fruit')) {
      return <Citrus className={className} />;
    }
    if (key.includes('tea') || key.includes('chai') || key.includes('cup')) {
      return <CupSoda className={className} />;
    }
    return <Tag className={className} />;
  };

  // Open Edit Item
  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      variants: item.variants ? [...item.variants] : [],
      options: item.options ? [...item.options] : [],
    });
    setIsNewItemModalOpen(true);
  };

  // Open New Item (Optionally specifying a target category)
  const handleOpenNew = (preselectedCatId?: string) => {
    setEditingItem(null);
    const targetCatId = preselectedCatId || selectedAdminCategoryId || categories[0]?.id || 'breakfast';
    setFormData({
      id: `item-${Date.now()}`,
      name: '',
      description: '',
      price: 500,
      categoryId: targetCatId,
      image: '',
      isAvailable: true,
      isPopular: false,
      isChefsSpecial: false,
      isVegetarian: false,
      isSpicy: false,
      variants: [],
      options: [],
    });
    setIsNewItemModalOpen(true);
  };

  // Save Item (Create or Update)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.categoryId) return;

    const catName = categories.find((c) => c.id === formData.categoryId)?.name || formData.categoryId;

    if (editingItem) {
      const oldCatId = editingItem.categoryId;
      const newCatId = formData.categoryId;
      updateMenuItem(formData as MenuItem);

      if (oldCatId !== newCatId) {
        showSuccessNotice(`Updated "${formData.name}" and moved to ${catName}.`);
      } else {
        showSuccessNotice(`Updated "${formData.name}" successfully.`);
      }
    } else {
      const { id: _ignoredId, ...rest } = formData as MenuItem;
      addMenuItem(rest);
      showSuccessNotice(`Added "${formData.name}" to ${catName}.`);
    }

    setIsNewItemModalOpen(false);
    setEditingItem(null);
  };

  // Handle Category Management
  const handleOpenNewCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      description: '',
      iconName: 'Utensils',
      order: categories.length + 1,
      isActive: true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: MenuCategory) => {
    setEditingCategory(cat);
    setCategoryFormData({ ...cat });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name?.trim()) return;

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: categoryFormData.name.trim(),
        description: categoryFormData.description || '',
        iconName: categoryFormData.iconName || 'Utensils',
        order: categoryFormData.order || editingCategory.order,
        isActive: categoryFormData.isActive ?? true,
      });
      showSuccessNotice(`Category "${categoryFormData.name}" updated successfully.`);
    } else {
      addCategory({
        name: categoryFormData.name.trim(),
        description: categoryFormData.description || '',
        iconName: categoryFormData.iconName || 'Utensils',
        order: categoryFormData.order || categories.length + 1,
        isActive: categoryFormData.isActive ?? true,
      });
      showSuccessNotice(`Created new category "${categoryFormData.name}".`);
    }

    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategoryPrompt = (cat: MenuCategory) => {
    const itemsInCat = menuItems.filter((i) => i.categoryId === cat.id).length;
    if (itemsInCat > 0) {
      setCategoryWarningModal({
        title: `Cannot Delete "${cat.name}"`,
        message: `This category currently contains ${itemsInCat} menu item(s). Please move or delete its dishes before deleting this category.`,
      });
    } else {
      setCategoryToDelete(cat);
    }
  };

  const handleConfirmDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      showSuccessNotice(`Category "${categoryToDelete.name}" deleted.`);
      if (selectedAdminCategoryId === categoryToDelete.id) {
        setSelectedAdminCategoryId(null);
      }
      setCategoryToDelete(null);
    }
  };

  const handleConfirmDeleteItem = () => {
    if (itemToDelete) {
      deleteMenuItem(itemToDelete.id);
      showSuccessNotice(`Removed "${itemToDelete.name}".`);
      setItemToDelete(null);
    }
  };

  // Active category being viewed inside Category Screen
  const activeSelectedCategory = selectedAdminCategoryId
    ? categories.find((c) => c.id === selectedAdminCategoryId) || null
    : null;

  // Dishes belonging to the currently selected category
  const itemsInSelectedCategory = selectedAdminCategoryId
    ? menuItems.filter((item) => item.categoryId === selectedAdminCategoryId)
    : [];

  // Filtered dishes inside the selected category
  const filteredCategoryItems = itemsInSelectedCategory.filter((item) => {
    const matchQuery =
      !inCategorySearch ||
      item.name.toLowerCase().includes(inCategorySearch.toLowerCase()) ||
      item.description.toLowerCase().includes(inCategorySearch.toLowerCase());

    if (!matchQuery) return false;

    if (inCategoryDietFilter === 'in-stock') return item.isAvailable;
    if (inCategoryDietFilter === 'out-of-stock') return !item.isAvailable;
    if (inCategoryDietFilter === 'special') return item.isChefsSpecial;
    if (inCategoryDietFilter === 'popular') return item.isPopular;
    if (inCategoryDietFilter === 'veg') return item.isVegetarian;
    if (inCategoryDietFilter === 'spicy') return item.isSpicy;

    return true;
  });

  // Filtered categories in the main category directory
  const filteredCategories = categories.filter((cat) => {
    if (!categorySearch.trim()) return true;
    const q = categorySearch.toLowerCase().trim();
    const matchCat = cat.name.toLowerCase().includes(q) || (cat.description && cat.description.toLowerCase().includes(q));
    // Also check if any menu item inside this category matches
    const hasMatchingItem = menuItems.some(
      (item) => item.categoryId === cat.id && (item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q))
    );
    return matchCat || hasMatchingItem;
  });

  // If Not Authenticated, return null (redirect effect handles navigation to /admin/login)
  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <div className="py-8 sm:py-12 bg-stone-950 min-h-[90vh] text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Admin Header */}
        <div className="bg-stone-900 text-stone-100 p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400 shadow-inner">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-stone-100">
                Menu & Storefront Manager
              </h1>
              <p className="text-xs text-stone-400">
                {cafeSettings.cafeName} • Catalog & Showcase Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ProfileDropdown isAdminContext={true} />
            <button
              type="button"
              onClick={() => {
                setPasswordChangeError('');
                setCurrentPasswordInput('');
                setNewPasswordInput('');
                setConfirmPasswordInput('');
                setIsChangePasswordModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 hover:bg-stone-700 text-xs font-semibold text-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Password</span>
            </button>
            <button
              onClick={handleViewStorefront}
              className="px-4 py-2 rounded-xl bg-stone-800 border border-stone-700 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-colors cursor-pointer"
            >
              View Storefront
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-rose-950/80 border border-rose-800/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Panel</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccessMsg && (
          <div className="p-3.5 rounded-2xl bg-amber-950/80 border border-amber-800/80 text-amber-200 text-xs font-semibold flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-stone-900/90 p-1.5 rounded-2xl border border-stone-800 shadow-lg flex flex-wrap gap-1 text-xs font-medium backdrop-blur-sm">
          <button
            onClick={() => setAdminTab('menu')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              adminTab === 'menu'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/80'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Menu Items ({menuItems.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('categories')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              adminTab === 'categories'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/80'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              adminTab === 'settings'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/80'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Store Info & PIN</span>
          </button>
        </div>

        {/* TAB: MENU ITEMS MANAGEMENT (CATEGORY-BASED SYSTEM) */}
        {adminTab === 'menu' && (
          <div className="space-y-6">
            {!selectedAdminCategoryId ? (
              /* VIEW A: CATEGORIES DIRECTORY */
              <div className="bg-stone-900 rounded-3xl border border-stone-800 shadow-xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/80">
                        <Folder className="w-5 h-5 text-amber-400" />
                      </span>
                      <h2 className="text-xl font-bold font-display text-stone-100">
                        Menu Categories Directory
                      </h2>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">
                      Select a menu category below to manage its dishes, add new items, or adjust availability. ({menuItems.length} total dishes across {categories.length} categories)
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenNewCategory}
                      className="px-3.5 py-2 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Add Category</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenNew()}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Quick Add Dish</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar Across Categories */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search category name, description, or search for a dish..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-800 text-xs bg-stone-950 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium"
                  />
                  {categorySearch && (
                    <button
                      onClick={() => setCategorySearch('')}
                      className="absolute right-3 top-2.5 p-1 text-stone-500 hover:text-stone-300 text-xs cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCategories.map((cat) => {
                    const catItems = menuItems.filter((item) => item.categoryId === cat.id);
                    const availableCount = catItems.filter((i) => i.isAvailable).length;

                    return (
                      <div
                        key={cat.id}
                        className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                          cat.isActive
                            ? 'bg-stone-950/80 border-stone-800 hover:border-amber-500/50 hover:bg-stone-950 shadow-sm'
                            : 'bg-stone-950/40 border-stone-850 opacity-60'
                        }`}
                      >
                        <div className="p-5 space-y-3">
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                                  cat.isActive
                                    ? 'bg-amber-950/80 text-amber-400 border-amber-800/80 group-hover:scale-105 group-hover:bg-amber-900/60'
                                    : 'bg-stone-850 text-stone-500 border-stone-800'
                                }`}
                              >
                                {renderCategoryIcon(cat.id, cat.iconName, 'w-5 h-5')}
                              </div>
                              <div>
                                <h3 className="font-bold text-stone-100 text-base leading-tight group-hover:text-amber-400 transition-colors">
                                  {cat.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                                    {catItems.length} {catItems.length === 1 ? 'Dish' : 'Dishes'}
                                  </span>
                                  {!cat.isActive && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700">
                                      Disabled
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditCategory(cat);
                              }}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                              title="Edit Category Info"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed min-h-[32px]">
                            {cat.description || 'Delicious handcrafted cafe specialties and artisan offerings.'}
                          </p>

                          {/* Stock summary */}
                          <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1">
                            <span>In Stock: <strong className="text-emerald-400">{availableCount}</strong></span>
                            {catItems.length - availableCount > 0 && (
                              <span className="text-amber-400">Out of Stock: {catItems.length - availableCount}</span>
                            )}
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="px-5 py-3 bg-stone-900/90 border-t border-stone-800 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAdminCategoryId(cat.id);
                              setInCategorySearch('');
                              setInCategoryDietFilter('all');
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 border border-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <span>Manage Dishes ({catItems.length})</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredCategories.length === 0 && (
                  <div className="text-center py-12 text-stone-500 border border-dashed border-stone-800 rounded-3xl">
                    <Folder className="w-10 h-10 mx-auto mb-2 text-stone-600" />
                    <p className="text-sm font-semibold text-stone-300">No categories found matching "{categorySearch}"</p>
                    <p className="text-xs text-stone-500 mt-1">Try searching another keyword or create a new category.</p>
                    <button
                      type="button"
                      onClick={() => setCategorySearch('')}
                      className="mt-3 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 bg-amber-950/80 hover:bg-amber-900/80 border border-amber-800"
                    >
                      Reset Filter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* VIEW B: IN-CATEGORY MANAGEMENT SCREEN */
              <div className="bg-stone-900 rounded-3xl border border-stone-800 shadow-xl p-6 sm:p-8 space-y-6">
                {/* Top Navigation & Breadcrumbs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedAdminCategoryId(null)}
                      className="p-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                      title="Back to All Categories"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Categories</span>
                    </button>

                    <div className="h-6 w-[1px] bg-stone-800 hidden sm:block" />

                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800 flex items-center justify-center shrink-0">
                        {renderCategoryIcon(
                          activeSelectedCategory?.id || '',
                          activeSelectedCategory?.iconName,
                          'w-4 h-4'
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold font-display text-stone-100 leading-none">
                            {activeSelectedCategory?.name || 'Category Dishes'}
                          </h2>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                            {itemsInSelectedCategory.length} {itemsInSelectedCategory.length === 1 ? 'Dish' : 'Dishes'}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {activeSelectedCategory?.description || 'Manage menu items for this category'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleOpenNew(selectedAdminCategoryId)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Dish to {activeSelectedCategory?.name}</span>
                    </button>
                  </div>
                </div>

                {/* In-Category Search and Filters */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      value={inCategorySearch}
                      onChange={(e) => setInCategorySearch(e.target.value)}
                      placeholder={`Search dishes in ${activeSelectedCategory?.name || 'this category'}...`}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-800 text-xs bg-stone-950 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 font-medium"
                    />
                    {inCategorySearch && (
                      <button
                        onClick={() => setInCategorySearch('')}
                        className="absolute right-3 top-2 text-stone-500 hover:text-stone-300 text-xs cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-stone-400 text-[11px] font-semibold mr-1">Filter:</span>
                    {[
                      { id: 'all', label: `All (${itemsInSelectedCategory.length})` },
                      {
                        id: 'in-stock',
                        label: `In Stock (${itemsInSelectedCategory.filter((i) => i.isAvailable).length})`,
                      },
                      {
                        id: 'out-of-stock',
                        label: `Out of Stock (${itemsInSelectedCategory.filter((i) => !i.isAvailable).length})`,
                      },
                      {
                        id: 'special',
                        label: `Special (${itemsInSelectedCategory.filter((i) => i.isChefsSpecial).length})`,
                      },
                      {
                        id: 'popular',
                        label: `Popular (${itemsInSelectedCategory.filter((i) => i.isPopular).length})`,
                      },
                      {
                        id: 'veg',
                        label: `Vegetarian (${itemsInSelectedCategory.filter((i) => i.isVegetarian).length})`,
                      },
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setInCategoryDietFilter(pill.id)}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                          inCategoryDietFilter === pill.id
                            ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items in Category Listing */}
                <div className="divide-y divide-stone-800 border border-stone-800 rounded-2xl overflow-hidden">
                  {filteredCategoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-stone-950/60 hover:bg-stone-950 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-stone-800 overflow-hidden flex-shrink-0 border border-stone-700 shadow-2xs">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-500">
                              <Utensils className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-stone-100 text-sm">{item.name}</h4>
                            {item.isChefsSpecial && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-stone-950 shadow-2xs">
                                Special
                              </span>
                            )}
                            {item.isPopular && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-2xs">
                                Popular
                              </span>
                            )}
                            {item.isVegetarian && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                                Veg
                              </span>
                            )}
                            {item.isSpicy && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                                Spicy
                              </span>
                            )}
                          </div>
                          <p className="text-stone-400 line-clamp-1 max-w-lg leading-relaxed">{item.description}</p>
                          <div className="flex items-center gap-3 text-[11px] text-stone-500">
                            <span>
                              Variants:{' '}
                              <strong className="text-stone-300">
                                {item.variants && item.variants.length > 0 ? `${item.variants.length} options` : 'Standard'}
                              </strong>
                            </span>
                            {item.options && item.options.length > 0 && (
                              <span>
                                Add-ons: <strong className="text-stone-300">{item.options.length}</strong>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                        <div className="text-right">
                          <span className="font-bold text-stone-100 text-base block">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-[10px] text-stone-400">Base Price</span>
                        </div>

                        {/* Availability Toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            toggleItemAvailability(item.id);
                            showSuccessNotice(
                              `"${item.name}" marked as ${!item.isAvailable ? 'In Stock' : 'Out of Stock'}.`
                            );
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                            item.isAvailable
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                              : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </button>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
                            title="Edit Item Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setItemToDelete(item)}
                            className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredCategoryItems.length === 0 && (
                  <div className="text-center py-12 text-stone-500 border border-dashed border-stone-800 rounded-3xl">
                    <Utensils className="w-10 h-10 mx-auto mb-2 text-stone-600" />
                    {itemsInSelectedCategory.length === 0 ? (
                      <>
                        <p className="text-sm font-semibold text-stone-300">
                          No dishes in "{activeSelectedCategory?.name}" yet.
                        </p>
                        <p className="text-xs text-stone-500 mt-1">
                          Click below to add your first menu item to this category.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenNew(selectedAdminCategoryId)}
                          className="mt-3 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add First Dish</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-stone-300">
                          No dishes match the selected filter.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setInCategorySearch('');
                            setInCategoryDietFilter('all');
                          }}
                          className="mt-3 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 bg-amber-950/80 hover:bg-amber-900 border border-amber-800 cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {adminTab === 'categories' && (
          <div className="bg-stone-900 rounded-3xl border border-stone-800 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
              <div>
                <h2 className="text-xl font-bold font-display text-stone-100">
                  Menu Categories Management ({categories.length})
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Manage the shared category structure for both customer and admin views. Add, rename, reorder, or toggle category visibility.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewCategory}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Category</span>
              </button>
            </div>

            <div className="divide-y divide-stone-800 border border-stone-800 rounded-2xl overflow-hidden">
              {categories.map((cat, index) => {
                const itemsCount = menuItems.filter((i) => i.categoryId === cat.id).length;

                return (
                  <div
                    key={cat.id}
                    className="p-4 bg-stone-950/60 hover:bg-stone-950 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800 flex items-center justify-center shrink-0">
                        {renderCategoryIcon(cat.id, cat.iconName, 'w-5 h-5')}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-100 text-sm">{cat.name}</span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                            {itemsCount} {itemsCount === 1 ? 'Dish' : 'Dishes'}
                          </span>
                        </div>
                        <span className="text-stone-400 text-[11px] block mt-0.5">
                          {cat.description || `ID: ${cat.id}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      {/* View dishes in this category button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAdminCategoryId(cat.id);
                          setAdminTab('menu');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        View Dishes ({itemsCount})
                      </button>

                      {/* Active Status Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          updateCategory({ ...cat, isActive: !cat.isActive });
                          showSuccessNotice(`Category "${cat.name}" is now ${!cat.isActive ? 'Active' : 'Disabled'}.`);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          cat.isActive
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                            : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Disabled'}
                      </button>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCategory(cat)}
                          className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategoryPrompt(cat)}
                          className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: CAFE SETTINGS */}
        {adminTab === 'settings' && (
          <div className="bg-stone-900 rounded-3xl border border-stone-800 shadow-xl p-6 sm:p-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold font-display text-stone-100 tracking-tight">
                Contact & Social Links Settings
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Manage the restaurant's public contact details, business information, and social media presence dynamically. All changes will reflect instantly across the public website.
              </p>
            </div>

            {/* Notification Toast Message Inside Panel */}
            {(saveSuccessMsg || saveErrorMsg) && (
              <div className="animate-fade-in duration-300">
                {saveSuccessMsg && (
                  <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}
                {saveErrorMsg && (
                  <div className="p-4 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
                    <span>{saveErrorMsg}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-6">
              {/* SECTION A: CAFE IDENTITY */}
              <div className="border-b border-stone-800/60 pb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500/90 mb-4 font-display">
                  Cafe Identity
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Cafe Name</label>
                    <input
                      type="text"
                      value={localCafe.cafeName}
                      onChange={(e) => setLocalCafe({ ...localCafe, cafeName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm font-semibold focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={localCafe.tagline}
                      onChange={(e) => setLocalCafe({ ...localCafe, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>

                  {/* Logo URL, Upload and presets */}
                  <div className="sm:col-span-2 space-y-4">
                    <label className="block font-semibold text-stone-300">Website Brand Logo</label>
                    
                    {/* Interactive Drag and Drop Upload Area */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingLogo(true);
                      }}
                      onDragLeave={() => setIsDraggingLogo(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingLogo(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleLogoUpload(file);
                      }}
                      onClick={() => document.getElementById('logo-file-input')?.click()}
                      className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                        isDraggingLogo
                          ? 'border-amber-500 bg-amber-500/5 shadow-inner scale-[0.99]'
                          : 'border-stone-800 bg-stone-950/40 hover:bg-stone-950/70 hover:border-stone-700'
                      }`}
                    >
                      <input
                        type="file"
                        id="logo-file-input"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload(file);
                        }}
                      />
                      
                      <div className="flex items-center gap-4">
                        {localCafe.logo ? (
                          <div className="relative group/logo shrink-0">
                            <img
                              src={localCafe.logo}
                              alt="Cafe Brand Logo"
                              className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/30 bg-stone-900 shadow-lg"
                            />
                            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center text-[10px] text-white font-medium transition-opacity duration-200">
                              Change
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 shrink-0">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                        
                        <div className="text-left">
                          <p className="text-sm font-medium text-stone-200">
                            {localCafe.logo ? 'Change restaurant logo' : 'Upload custom logo'}
                          </p>
                          <p className="text-xs text-stone-500 mt-1">
                            Drag & drop your logo here, or <span className="text-amber-500 hover:underline">browse files</span>
                          </p>
                        </div>
                      </div>

                      {logoUploadError && (
                        <div className="mt-3 text-red-400 text-xs font-semibold flex items-center gap-1.5 bg-red-950/40 border border-red-900/30 px-3 py-1.5 rounded-lg">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{logoUploadError}</span>
                        </div>
                      )}
                    </div>

                    {/* Logo Presets & Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <span className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                          Quick Presets
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocalCafe((prev) => ({
                                ...prev,
                                logo: '/src/assets/images/chaaye_khana_logo_1788541097460.jpg'
                              }));
                              showSuccessNotice('Reverted to original brand logo preset! Click Save below.');
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Original Brand Logo
                          </button>
                          
                          {localCafe.logo && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocalCafe((prev) => ({ ...prev, logo: '' }));
                                showSuccessNotice('Logo cleared. Click Save below to apply text-only fallback.');
                              }}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-950/30 hover:bg-red-950/50 border border-red-900/30 text-red-300 hover:text-red-200 transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              Remove Logo
                            </button>
                          )}
                        </div>
                      </div>

                      {/* URL input field fallback */}
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                          Or enter Image URL manually
                        </label>
                        <input
                          type="url"
                          value={localCafe.logo || ''}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setLocalCafe({ ...localCafe, logo: e.target.value })}
                          placeholder="https://example.com/logo.png"
                          className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-xs font-mono focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: CONTACT INFORMATION */}
              <div className="border-b border-stone-800/60 pb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500/90 mb-4 font-display">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={localCafe.phone}
                      onChange={(e) => setLocalCafe({ ...localCafe, phone: e.target.value })}
                      placeholder="+92 51 111 242 293"
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm font-semibold focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">WhatsApp Number (Direct Link Number)</label>
                    <input
                      type="text"
                      value={localCafe.whatsapp}
                      onChange={(e) => setLocalCafe({ ...localCafe, whatsapp: e.target.value })}
                      placeholder="+923005552429"
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm font-semibold focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={localCafe.email || ''}
                      onChange={(e) => setLocalCafe({ ...localCafe, email: e.target.value })}
                      placeholder="info@chaayekhana.com"
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">City</label>
                    <input
                      type="text"
                      value={localCafe.city || ''}
                      onChange={(e) => setLocalCafe({ ...localCafe, city: e.target.value })}
                      placeholder="Islamabad"
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Opening Hours Display Text</label>
                    <input
                      type="text"
                      value={localCafe.openingHoursDisplay}
                      onChange={(e) =>
                        setLocalCafe({ ...localCafe, openingHoursDisplay: e.target.value })
                      }
                      placeholder="Monday – Sunday: 8:00 AM – 12:00 Midnight"
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-300 mb-1">Physical Business Address</label>
                    <input
                      type="text"
                      value={localCafe.address}
                      onChange={(e) => setLocalCafe({ ...localCafe, address: e.target.value })}
                      placeholder="Sector F, Commercial Area, DHA Phase 4, Islamabad"
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-300 mb-1">Google Maps / Directions URL</label>
                    <input
                      type="url"
                      value={localCafe.googleMapsUrl}
                      onChange={(e) => setLocalCafe({ ...localCafe, googleMapsUrl: e.target.value })}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm font-mono focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: SOCIAL MEDIA LINKS */}
              <div className="border-b border-stone-800/60 pb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500/90 mb-4 font-display">
                  Social Media Links
                </h3>
                <p className="text-[11px] text-stone-400 mb-4 leading-relaxed">
                  Toggle each social media channel to enable or disable its public visibility. Ensure URLs are fully formed (e.g. starting with https://).
                </p>
                <div className="space-y-4">
                  {['instagram', 'facebook', 'tiktok', 'youtube'].map((platform) => {
                    const socials = localCafe.socialsConfig || [];
                    const config = socials.find(s => s.platform === platform) || {
                      platform,
                      url: platform === 'instagram' ? 'https://instagram.com/chaayekhana' : '',
                      isEnabled: false
                    };

                    return (
                      <div key={platform} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                        <div className="w-32 shrink-0 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="font-bold text-stone-200 capitalize">{platform}</span>
                        </div>

                        <div className="flex-1">
                          <input
                            type="url"
                            value={config.url}
                            onChange={(e) => {
                              const updatedUrl = e.target.value;
                              const updatedSocials = socials.map(s => 
                                s.platform === platform ? { ...s, url: updatedUrl } : s
                              );
                              if (!updatedSocials.some(s => s.platform === platform)) {
                                updatedSocials.push({ platform, url: updatedUrl, isEnabled: config.isEnabled });
                              }
                              setLocalCafe({ ...localCafe, socialsConfig: updatedSocials });
                            }}
                            placeholder={`https://${platform}.com/username`}
                            className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-900 text-stone-100 text-sm font-mono focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const newEnabled = !config.isEnabled;
                              const updatedSocials = socials.map(s => 
                                s.platform === platform ? { ...s, isEnabled: newEnabled } : s
                              );
                              if (!updatedSocials.some(s => s.platform === platform)) {
                                updatedSocials.push({ platform, url: config.url, isEnabled: newEnabled });
                              }
                              setLocalCafe({ ...localCafe, socialsConfig: updatedSocials });
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              config.isEnabled 
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                                : 'bg-stone-800 hover:bg-stone-750 text-stone-400 border border-stone-700/60'
                            }`}
                          >
                            {config.isEnabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION D: FOOD PHILOSOPHY & ABOUT EXTRAS */}
              <div className="border-b border-stone-800/60 pb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500/90 mb-4 font-display">
                  Story & General Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-stone-300 mb-1">About Text (Story & Heritage)</label>
                    <textarea
                      rows={3}
                      value={localCafe.aboutStory}
                      onChange={(e) => setLocalCafe({ ...localCafe, aboutStory: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm leading-relaxed focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Sales Tax (%)</label>
                    <input
                      type="number"
                      value={localCafe.taxRatePercent}
                      onChange={(e) =>
                        setLocalCafe({
                          ...localCafe,
                          taxRatePercent: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm font-semibold focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION E: SECURITY SETTINGS */}
              <div className="pt-2">
                <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400 shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-200 text-sm">Admin Access Security</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Protected with cryptographic SHA-256 password hashing. Passwords are never stored or transmitted in plain text.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPasswordChangeError('');
                      setCurrentPasswordInput('');
                      setNewPasswordInput('');
                      setConfirmPasswordInput('');
                      setIsChangePasswordModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 shrink-0"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Change Password</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON: SAVE */}
            <div className="pt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  // Phone
                  if (!localCafe.phone.trim()) {
                    showErrorNotice('Phone number is required and cannot be empty.');
                    return;
                  }

                  // WhatsApp Number check (only allow digits, space, +, -, brackets)
                  if (localCafe.whatsapp && !/^\+?[0-9\s\-()]+$/.test(localCafe.whatsapp.trim())) {
                    showErrorNotice('Please enter a valid WhatsApp number. Only numbers, spaces, +, -, and () are allowed.');
                    return;
                  }

                  // Email check
                  if (localCafe.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localCafe.email.trim())) {
                    showErrorNotice('Please enter a valid, fully formed email address.');
                    return;
                  }

                  // Google Maps URL check
                  if (localCafe.googleMapsUrl && !/^https?:\/\//.test(localCafe.googleMapsUrl.trim())) {
                    showErrorNotice('Google Maps URL must start with http:// or https://');
                    return;
                  }

                  // Social URLs validation
                  const socials = localCafe.socialsConfig || [];
                  for (const s of socials) {
                    if (s.isEnabled && s.url) {
                      if (!/^https?:\/\//.test(s.url.trim())) {
                        showErrorNotice(`The URL for ${s.platform.charAt(0).toUpperCase() + s.platform.slice(1)} is enabled but does not start with http:// or https://.`);
                        return;
                      }
                    }
                  }

                  // Save
                  updateCafeSettings(localCafe);
                  showSuccessNotice('Contact & Social Links updated successfully.');
                }}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>SAVE CHANGES</span>
              </button>
            </div>
          </div>
        )}

        {/* MODAL: CREATE / EDIT MENU ITEM */}
        {isNewItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto my-8">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <h3 className="font-display font-bold text-lg text-stone-100">
                  {editingItem ? 'Edit Menu Item' : 'Add New Dish'}
                </h3>
                <button
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="text-stone-400 hover:text-stone-100 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">
                    Dish Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Chicken Chow Mein"
                    className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm font-medium focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">
                    Assigned Menu Category <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={formData.categoryId || categories[0]?.id}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm font-medium focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Base Price (Rs.)</label>
                    <input
                      type="number"
                      required
                      value={formData.price || 0}
                      onChange={(e) =>
                        setFormData({ ...formData, price: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-amber-400 text-sm font-bold focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short appetizing description..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm leading-relaxed focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Flags Checkboxes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable ?? true}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="rounded text-amber-500 bg-stone-950 border-stone-700 focus:ring-amber-500"
                    />
                    <span className="text-stone-300">In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isChefsSpecial ?? false}
                      onChange={(e) =>
                        setFormData({ ...formData, isChefsSpecial: e.target.checked })
                      }
                      className="rounded text-amber-500 bg-stone-950 border-stone-700 focus:ring-amber-500"
                    />
                    <span className="text-stone-300">Chef's Special</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPopular ?? false}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="rounded text-amber-500 bg-stone-950 border-stone-700 focus:ring-amber-500"
                    />
                    <span className="text-stone-300">Popular</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVegetarian ?? false}
                      onChange={(e) =>
                        setFormData({ ...formData, isVegetarian: e.target.checked })
                      }
                      className="rounded text-amber-500 bg-stone-950 border-stone-700 focus:ring-amber-500"
                    />
                    <span className="text-stone-300">Vegetarian</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isSpicy ?? false}
                      onChange={(e) => setFormData({ ...formData, isSpicy: e.target.checked })}
                      className="rounded text-amber-500 bg-stone-950 border-stone-700 focus:ring-amber-500"
                    />
                    <span className="text-stone-300">Spicy</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewItemModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-colors shadow-md cursor-pointer"
                  >
                    Save Dish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CREATE / EDIT CATEGORY */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto my-8">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <h3 className="font-display font-bold text-lg text-stone-100">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-stone-400 hover:text-stone-100 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">
                    Category Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryFormData.name || ''}
                    onChange={(e) =>
                      setCategoryFormData({ ...categoryFormData, name: e.target.value })
                    }
                    placeholder="e.g. Artisanal Pastries"
                    className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm font-medium focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={categoryFormData.description || ''}
                    onChange={(e) =>
                      setCategoryFormData({ ...categoryFormData, description: e.target.value })
                    }
                    placeholder="Brief description for customers & kitchen staff..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm leading-relaxed focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Category Icon Presets */}
                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    Category Icon Style
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'Coffee', label: 'Coffee/Breakfast' },
                      { id: 'Soup', label: 'Soup' },
                      { id: 'Utensils', label: 'Sandwiches/Burgers' },
                      { id: 'Flame', label: 'Bun Kabab/Grill' },
                      { id: 'Sparkles', label: 'Chef Specials' },
                      { id: 'UtensilsCrossed', label: 'Snacks/Main' },
                      { id: 'Pizza', label: 'Pizza' },
                      { id: 'Cake', label: 'Bakery/Dessert' },
                      { id: 'GlassWater', label: 'Beverages' },
                      { id: 'IceCream', label: 'Milkshakes' },
                      { id: 'Citrus', label: 'Fresh Juices' },
                      { id: 'CupSoda', label: 'Teas/Chai' },
                    ].map((iconOption) => (
                      <button
                        key={iconOption.id}
                        type="button"
                        onClick={() =>
                          setCategoryFormData({ ...categoryFormData, iconName: iconOption.id })
                        }
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          categoryFormData.iconName === iconOption.id
                            ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold shadow-2xs'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                        }`}
                      >
                        {renderCategoryIcon('', iconOption.id, 'w-4 h-4')}
                        <span className="text-[9px] truncate max-w-full">{iconOption.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Display Order</label>
                    <input
                      type="number"
                      min={1}
                      value={categoryFormData.order || 1}
                      onChange={(e) =>
                        setCategoryFormData({
                          ...categoryFormData,
                          order: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm font-bold focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categoryFormData.isActive ?? true}
                        onChange={(e) =>
                          setCategoryFormData({
                            ...categoryFormData,
                            isActive: e.target.checked,
                          })
                        }
                        className="rounded text-amber-500 bg-stone-950 border-stone-700 focus:ring-amber-500 w-4 h-4"
                      />
                      <span className="font-semibold text-stone-200">Category Active</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-colors shadow-md cursor-pointer"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CONFIRM DELETE MENU ITEM */}
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="font-display font-bold text-lg text-stone-100">
                  Delete Dish Confirmation
                </h3>
                <p className="text-xs text-stone-300">
                  Are you sure you want to permanently delete{' '}
                  <strong className="text-stone-100">"{itemToDelete.name}"</strong>?
                </p>
                <p className="text-[11px] text-stone-400">
                  This item will be removed immediately from both the customer online menu and admin panel.
                </p>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-700 text-stone-300 font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteItem}
                  className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Delete Dish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CONFIRM DELETE CATEGORY */}
        {categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="font-display font-bold text-lg text-stone-100">
                  Delete Category Confirmation
                </h3>
                <p className="text-xs text-stone-300">
                  Are you sure you want to delete the category{' '}
                  <strong className="text-stone-100">"{categoryToDelete.name}"</strong>?
                </p>
                <p className="text-[11px] text-stone-400">
                  This category contains 0 dishes and will be removed from your catalog.
                </p>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryToDelete(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-700 text-stone-300 font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteCategory}
                  className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CATEGORY WARNING (CONTAINS ITEMS) */}
        {categoryWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="font-display font-bold text-lg text-stone-100">
                  {categoryWarningModal.title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {categoryWarningModal.message}
                </p>
              </div>

              <div className="pt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => setCategoryWarningModal(null)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}
        {/* MODAL: CHANGE PASSWORD */}
        {isChangePasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-stone-100">
                    Change Password
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="text-stone-400 hover:text-stone-100 p-1 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
                {passwordChangeError && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{passwordChangeError}</span>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    Current Password <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm font-mono focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none transition-all placeholder:text-stone-600 placeholder:font-sans"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    New Password <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm font-mono focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none transition-all placeholder:text-stone-600 placeholder:font-sans"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    Confirm New Password <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-800 bg-stone-950 text-stone-100 text-sm font-mono focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none transition-all placeholder:text-stone-600 placeholder:font-sans"
                  />
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    {isChangingPassword ? (
                      <span>Updating...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
