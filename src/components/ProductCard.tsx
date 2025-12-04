import React, { useContext, useState } from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '../types';
import { StoreContext } from '../App';
import Modal from './Modal';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useContext(StoreContext)!;
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const isWishlisted = wishlist.includes(product.id);

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.03] group relative border border-gray-100 flex flex-col h-full">
        
        {/* Wishlist Button - Always visible on mobile, nicely positioned */}
        <div className="absolute top-3 right-3 z-10">
           <button 
             onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
             className={`p-2 rounded-full shadow-sm transition-all transform active:scale-90 ${
               isWishlisted 
                 ? 'bg-red-50 text-red-500' 
                 : 'bg-white/90 text-gray-400 hover:text-red-500'
             }`}
           >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
           </button>
        </div>
        
        {/* Product Badge */}
        <div className="absolute top-3 left-3 z-10">
            {product.type !== 'Physical' && (
                 <span className="bg-white/90 backdrop-blur-sm text-brand-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border border-brand-100 shadow-sm">
                    {product.type}
                 </span>
            )}
        </div>

        {/* Image Container */}
        <div 
            className="h-48 w-full mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center relative cursor-pointer" 
            onClick={() => setIsQuickViewOpen(true)}
        >
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
            />
            
            {/* Quick View Button - Hidden on mobile unless active, Slide up on desktop hover */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsQuickViewOpen(true); }}
                    className="bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-white"
                >
                    <Eye size={14} /> Quick View
                </button>
            </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
            <h3 
              className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-brand-600 transition-colors cursor-pointer"
              onClick={() => setIsQuickViewOpen(true)}
            >
                {product.name}
            </h3>
            <p className="text-xs text-gray-400 mb-3">{product.category}</p>
            
            <div className="mt-auto flex items-center justify-between">
                <div>
                   <span className="font-bold text-lg text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    className="bg-gray-900 text-white p-2.5 rounded-xl shadow-md hover:bg-brand-600 hover:shadow-brand-500/30 hover:scale-105 transition-all duration-300 active:scale-95"
                    aria-label="Add to cart"
                >
                    <ShoppingCart size={18} />
                </button>
            </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <Modal isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} title="Product Details">
          <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 rounded-xl overflow-hidden bg-gray-100 h-64 md:h-auto">
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded">{product.category}</span>
                     {product.stock < 10 && <span className="text-xs font-bold text-red-500">Only {product.stock} left!</span>}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      {product.description}
                  </p>
                  
                  <div className="mt-auto">
                      <div className="text-3xl font-bold text-gray-900 mb-6">₹{product.price.toLocaleString('en-IN')}</div>
                      <div className="flex gap-3">
                          <button 
                            onClick={() => { addToCart(product); setIsQuickViewOpen(false); }}
                            className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-200 active:scale-95"
                          >
                              Add to Cart
                          </button>
                          <button 
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition active:scale-95 ${isWishlisted ? 'text-red-500 bg-red-50 border-red-100' : 'text-gray-400'}`}
                          >
                              <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </Modal>
    </>
  );
};

export default ProductCard;
