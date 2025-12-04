import React, { useContext, useRef, useEffect, useState } from 'react';
import { ChevronRight, Zap, Loader, Frown } from 'lucide-react';
import { StoreContext } from '../App';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { Product } from '../types';

const ShopHome = () => {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useContext(StoreContext)!;
  const productsRef = useRef<HTMLDivElement>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products via API when filters change
  useEffect(() => {
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await api.getProducts(searchQuery, selectedCategory);
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search slightly
    const timeoutId = setTimeout(() => {
        fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const categories = [
    { name: 'Mobiles', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&w=150&q=80' },
    { name: 'Fashion', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=150&q=80' },
    { name: 'Home', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80' },
    { name: 'Beauty', img: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=150&q=80' },
    { name: 'Electronics', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=150&q=80' },
    { name: 'Books', img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=150&q=80' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Modern Hero Section */}
      {searchQuery === '' && selectedCategory === 'All' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px] group">
            <img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt="Shopping Hero"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/60 to-transparent flex items-center">
                <div className="pl-8 md:pl-16 max-w-xl text-white">
                    <span className="inline-block px-4 py-1.5 bg-accent-500 text-white text-xs font-bold rounded-full mb-4 shadow-lg tracking-wide uppercase animate-bounce-subtle">
                        Festival Sale Live
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                        Upgrade Your <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-yellow-200">Lifestyle</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 font-light">
                        Get up to <span className="font-bold text-white">60% OFF</span> on top brands this week. Free delivery on your first order.
                    </p>
                    <button 
                        onClick={scrollToProducts}
                        className="bg-white text-brand-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-50 hover:scale-105 transition-all shadow-xl flex items-center gap-2"
                    >
                        Shop Now
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
            </div>
        </div>
      )}

      {/* Categories Bubbles */}
      {searchQuery === '' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Shop by Category</h2>
            <div className="flex space-x-8 overflow-x-auto pb-4 no-scrollbar">
                {categories.map((cat, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`flex flex-col items-center flex-shrink-0 group cursor-pointer transition-all ${selectedCategory === cat.name ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                    >
                        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-tr ${selectedCategory === cat.name ? 'from-brand-600 to-accent-500 scale-105 shadow-lg' : 'from-brand-200 to-gray-200'} group-hover:scale-105 transition-all duration-300`}>
                            <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden">
                                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <span className={`mt-3 text-sm font-medium ${selectedCategory === cat.name ? 'text-brand-700 font-bold' : 'text-gray-700'} group-hover:text-brand-700`}>{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12" ref={productsRef}>
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
                {selectedCategory === 'All' && searchQuery === '' && (
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg animate-pulse">
                        <Zap size={24} fill="currentColor" />
                    </div>
                )}
                <div>
                   <h2 className="text-2xl font-bold text-gray-900">
                        {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory === 'All' ? 'Flash Deals' : `${selectedCategory} Store`}
                   </h2>
                   {selectedCategory === 'All' && !searchQuery && <p className="text-sm text-gray-500">Ends in 05:43:21</p>}
                </div>
            </div>
            {selectedCategory === 'All' && !searchQuery && (
                <button onClick={() => setSelectedCategory('Mobiles')} className="text-brand-600 font-semibold hover:text-brand-700 flex items-center">
                    View All <ChevronRight size={16} />
                </button>
            )}
        </div>
        
        {loading ? (
             <div className="flex items-center justify-center h-64">
                 <Loader size={40} className="animate-spin text-brand-600" />
             </div>
        ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <Frown size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or category filter.</p>
                <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="mt-6 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
                >
                    Clear Filters
                </button>
            </div>
        )}
      </div>

      {/* Services Section (Only show on Home) */}
      {selectedCategory === 'All' && searchQuery === '' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 animate-on-scroll">
              <div className="bg-brand-900 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-700 rounded-full opacity-50 blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-accent-600 rounded-full opacity-30 blur-3xl"></div>
                  
                  <div className="relative z-10 mb-8 md:mb-0 text-center md:text-left">
                      <h2 className="text-3xl font-bold text-white mb-3">Premium Services for Pros</h2>
                      <p className="text-brand-200 max-w-md">Consultations, Digital Kits, and Professional Tools tailored for Indian Freelancers.</p>
                  </div>
                  <div className="relative z-10 flex space-x-4">
                      <button 
                        onClick={() => { setSelectedCategory('Service'); scrollToProducts(); }}
                        className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-accent-500/30"
                      >
                          Explore Services
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ShopHome;