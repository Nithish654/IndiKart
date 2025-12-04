import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../App';
import { Product } from '../types';
import { api } from '../services/api';
import { Trash2, ShoppingCart, Heart, ArrowLeft, Loader, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart, addToast } = useContext(StoreContext)!;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to clear old/bad data manually
  const clearWishlistData = () => {
    localStorage.removeItem('indikart_wishlist');
    window.location.reload(); // Force reload to reset context
  };

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);
      try {
        // 1. Get all real products from Supabase
        const allProducts = await api.getProducts();
        
        console.log("My Wishlist IDs:", wishlist);
        console.log("Database Products:", allProducts);

        // 2. Filter: Keep product ONLY if its ID is in your wishlist array
        const wishlistedItems = allProducts.filter(p => wishlist.includes(p.id));
        
        console.log("Matches Found:", wishlistedItems);
        setProducts(wishlistedItems);
      } catch (error) {
        console.error("Failed to load wishlist", error);
        addToast("Failed to load wishlist", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist, addToast]); 

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader className="animate-spin text-brand-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
            <Heart className="text-red-500 fill-red-500" size={28} />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {products.length} items
            </span>
        </div>
        
        {/* Debug / Clear Button - Helps if you have stuck data */}
        {wishlist.length > 0 && products.length === 0 && (
            <button 
                onClick={clearWishlistData}
                className="text-xs text-red-600 hover:text-red-800 underline flex items-center"
            >
                <RefreshCw size={12} className="mr-1"/> Fix / Reset Wishlist
            </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-red-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Items you added might not be available or were removed.</p>
          <Link 
            to="/" 
            className="inline-flex items-center bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition"
          >
            <ArrowLeft size={20} className="mr-2" />
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col">
              <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-gray-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition shadow-sm"
                    title="Remove from wishlist"
                >
                    <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col">
                  <p className="text-xs text-brand-600 font-bold mb-1 uppercase tracking-wider">{product.category}</p>
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition shadow-lg shadow-brand-200"
                        title="Move to Cart"
                      >
                          <ShoppingCart size={18} />
                      </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;