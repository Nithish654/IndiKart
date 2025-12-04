import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate, Link } from 'react-router-dom';

// Layouts
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import ShopHome from './pages/ShopHome';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AdminProductForm from './pages/AdminProductForm';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { About, Terms, Privacy, Contact } from './pages/StaticPages';
import Wishlist from './pages/wishlist'; // <--- ADDED THIS IMPORT

// Types & Services
import { Product, CartItem, ToastNotification } from './types';
import { api } from './services/api';

// --- Global Context ---
export const StoreContext = React.createContext<{
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  
  placeOrder: () => Promise<void>;
} | null>(null);


// --- Auth Guards ---

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const RequireAdmin = ({ children }: { children: React.ReactElement }) => {
    const { user, loading, isAdmin } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user || !isAdmin) return <Navigate to="/login" replace />;
    return children;
};

// --- Layouts ---

const AdminLayout = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 overflow-y-auto h-screen no-scrollbar">
        <div className="max-w-7xl mx-auto">
           <Outlet />
        </div>
      </div>
    </div>
  );
};

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
               <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">I</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">IndiKart</span>
               </div>
               <p className="text-gray-500 text-sm leading-relaxed">
                  The ultimate platform for Indian freelancers and creators to buy, sell, and grow their business.
               </p>
            </div>
            <div>
               <h4 className="font-bold text-gray-900 mb-4">Shop</h4>
               <ul className="space-y-2 text-sm text-gray-500">
                  <li><Link to="/" className="hover:text-brand-600">All Products</Link></li>
                  <li><Link to="/" className="hover:text-brand-600">Featured</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-gray-900 mb-4">Company</h4>
               <ul className="space-y-2 text-sm text-gray-500">
                  <li><Link to="/about" className="hover:text-brand-600">About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-brand-600">Contact</Link></li>
                  <li><Link to="/terms" className="hover:text-brand-600">Terms of Service</Link></li>
                  <li><Link to="/privacy" className="hover:text-brand-600">Privacy Policy</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-gray-900 mb-4">Stay in loop</h4>
               <div className="flex">
                  <input type="email" placeholder="Enter your email" className="bg-gray-100 border border-gray-200 rounded-l-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-brand-500" />
                  <button className="bg-brand-600 text-white px-4 py-2 rounded-r-lg hover:bg-brand-700 text-sm font-medium">Subscribe</button>
               </div>
            </div>
        </div>
        <div className="border-t border-gray-100 pt-8 text-center">
             <p className="text-gray-400 text-sm">© 2024 IndiKart Commerce Solutions Pvt Ltd. Made with ❤️ in India.</p>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  // Global Client State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  
  // Global Filter State (Shared)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Load Wishlist from LocalStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('indikart_wishlist');
    if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // --- ACTIONS ---

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    addToast(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => 
      prev.map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  const placeOrder = async () => {
    try {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        await api.createOrder({
            items: cart.map(i => ({ productId: i.id, productName: i.name, quantity: i.quantity, price: i.price, image: i.image })),
            total: total
        });
        clearCart();
        addToast("Order placed successfully! 🎉", "success");
    } catch (error) {
        addToast("Failed to place order", "error");
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      let newList;
      if (prev.includes(productId)) {
        addToast("Removed from wishlist", "info");
        newList = prev.filter((id) => id !== productId);
      } else {
        addToast("Added to wishlist", "success");
        newList = [...prev, productId];
      }
      localStorage.setItem('indikart_wishlist', JSON.stringify(newList));
      return newList;
    });
  };

  const storeValues = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    wishlist,
    toggleWishlist,
    addToast,
    placeOrder
  };

  return (
    <AuthProvider>
      <StoreContext.Provider value={storeValues}>
        <HashRouter>
          <Routes>
            {/* Public Pages */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<ShopHome />} />
              <Route path="/wishlist" element={<Wishlist />} /> {/* <--- ADDED ROUTE HERE */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Routes (Protected) */}
            <Route path="/admin" element={
                <RequireAdmin>
                   <AdminLayout />
                </RequireAdmin>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:id/edit" element={<AdminProductForm />} />
              <Route path="customers" element={<Customers />} />
              <Route path="orders" element={<Orders />} />
              <Route path="settings" element={<Settings />} />
              <Route path="reports" element={<div className="bg-white p-12 rounded-xl shadow-sm text-center text-gray-400 font-medium border border-gray-100">Detailed Reports (Coming Soon)</div>} />
            </Route>

          </Routes>

          {/* Global Overlays */}
          <CartDrawer />
          
          <div className="fixed top-4 right-4 z-[60] space-y-2 pointer-events-none">
            {toasts.map((toast) => (
              <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToasts(p => p.filter(t => t.id !== toast.id))} />
            ))}
          </div>

        </HashRouter>
      </StoreContext.Provider>
    </AuthProvider>
  );
};

export default App;