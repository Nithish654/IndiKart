import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, Heart, X, LogIn, LogOut } from 'lucide-react';
import { StoreContext } from '../App';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { 
    cart, 
    setIsCartOpen, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    wishlist
  } = useContext(StoreContext)!;
  
  const { user, logout, isAdmin } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist ? wishlist.length : 0;

  const categories = ['Mobiles', 'Fashion', 'Electronics', 'Home', 'Beauty', 'Service'];

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    navigate('/'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
      await logout();
      navigate('/');
  };

  return (
    <>
      <div className="sticky top-0 z-40 w-full glass-nav border-b border-gray-100 shadow-sm transition-all duration-300">
        {/* Top Banner */}
        <div className="bg-brand-700 text-white text-xs text-center py-1.5 font-medium tracking-wide">
          🇮🇳 Made in India • Free Shipping on Orders Above ₹499
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Left: Mobile Menu & Logo */}
            <div className="flex items-center gap-4">
              <button 
                className="md:hidden text-gray-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <Link to="/" className="flex items-center group" onClick={() => setSelectedCategory('All')}>
                 <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-brand-200 transition-all duration-300">
                    <span className="text-white font-bold text-lg md:text-xl">I</span>
                 </div>
                 <span className="ml-2 text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-brand-700 transition-colors">
                   Indi<span className="text-brand-600">Kart</span>
                 </span>
              </Link>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full group">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all shadow-inner"
                  placeholder="Search for products..."
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 md:space-x-6">
               
               {user ? (
                   <>
                      <div className="hidden md:flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Hi, {user.name}</span>
                      </div>
                      
                      {isAdmin && (
                        <Link to="/admin/dashboard" className="hidden lg:flex items-center space-x-2 text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors px-3 py-1.5 rounded-lg font-medium text-sm">
                            <span>Admin Panel</span>
                        </Link>
                      )}

                      <button onClick={handleLogout} className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors px-2 py-1">
                          <LogOut size={20} />
                      </button>
                   </>
               ) : (
                   <Link to="/login" className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-brand-700 transition-colors px-2 py-1 rounded-md hover:bg-brand-50">
                      <LogIn size={20} />
                      <span className="text-sm font-medium">Login</span>
                   </Link>
               )}
               
               {/* --- FIXED NAVIGATION BUTTON --- */}
               <button 
                  onClick={() => {
                    console.log("Navigating to Wishlist...");
                    navigate('/wishlist');
                  }}
                  className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-brand-700 transition-colors px-2 py-1 rounded-md hover:bg-brand-50 relative group"
               >
                  <div className="relative">
                    <Heart 
                      size={20} 
                      className={wishlistCount > 0 ? "text-red-500 fill-red-500" : ""} 
                    />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-white animate-fade-in">
                          {wishlistCount}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">Wishlist</span>
               </button>
               {/* ------------------------------- */}

               <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

               <button 
                onClick={() => setIsCartOpen(true)}
                className="relative group p-2"
               >
                  <div className="bg-brand-50 text-brand-700 p-2 rounded-xl group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                    <ShoppingCart size={22} />
                  </div>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-white animate-pulse">
                        {cartCount}
                    </span>
                  )}
               </button>
            </div>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {isMobileMenuOpen && (
           <div className="md:hidden bg-white border-t border-gray-100 p-4 absolute w-full left-0 top-full shadow-lg animate-fade-in z-50">
              <div className="relative w-full mb-4">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-100 border-none text-gray-800 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-brand-500"
                    placeholder="Search products..."
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                 {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => handleCategoryClick(cat)}
                      className="text-left px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {cat}
                    </button>
                 ))}
              </div>
              
              <div className="border-t border-gray-100 pt-4 space-y-2">
                 {user ? (
                     <>
                        <div className="flex items-center justify-between px-2">
                            <span className="font-bold text-gray-800">Hi, {user.name}</span>
                            <button onClick={handleLogout} className="text-red-500 text-sm">Logout</button>
                        </div>
                        {isAdmin && (
                            <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-center w-full py-2 bg-brand-600 text-white rounded-lg font-medium">Go to Admin Panel</Link>
                        )}
                     </>
                 ) : (
                     <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-center w-full py-2 bg-brand-50 text-brand-700 rounded-lg font-medium">Login / Signup</Link>
                 )}
              </div>
           </div>
        )}
      </div>

      <div className="bg-white border-b border-gray-100 hidden md:block transition-all">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
              <div className="flex items-center space-x-8 py-3 text-sm font-medium text-gray-600 overflow-x-auto no-scrollbar">
                  <button onClick={() => handleCategoryClick('All')} className={`${selectedCategory === 'All' ? 'text-brand-600 bg-brand-50 px-3 py-1 rounded-full' : 'hover:text-brand-600'} whitespace-nowrap transition-all`}>
                    🔥 Best Sellers
                  </button>
                  {categories.map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`${selectedCategory === cat ? 'text-brand-600 bg-brand-50 px-3 py-1 rounded-full' : 'hover:text-brand-600'} whitespace-nowrap transition-all`}
                    >
                      {cat}
                    </button>
                  ))}
                  <span className="flex-1"></span>
                  <Link to="/shop" className="text-accent-600 hover:text-accent-700 font-semibold whitespace-nowrap animate-pulse">Sale Live Now!</Link>
              </div>
          </div>
      </div>
    </>
  );
};

export default Navbar;