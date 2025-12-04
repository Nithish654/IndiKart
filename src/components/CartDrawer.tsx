import React, { useContext, useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, CheckCircle } from 'lucide-react';
import { StoreContext } from '../App';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity, placeOrder } = useContext(StoreContext)!;
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Call the API via context action
    await placeOrder();
    
    setIsCheckingOut(false);
    setOrderPlaced(true);
    setTimeout(() => {
        setOrderPlaced(false);
        setIsCartOpen(false); // Close drawer after success
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
      
      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform duration-300 ease-in-out slide-in-from-right">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full">
            
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <ShoppingBag className="mr-2 text-brand-600" /> Your Cart
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 no-scrollbar relative">
             {orderPlaced ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 animate-fade-in-up">
                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={40} className="text-green-600" />
                     </div>
                     <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h3>
                     <p className="text-gray-500">Thank you for shopping with IndiKart. Your order is being processed.</p>
                 </div>
             ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingBag size={32} className="text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                    <button onClick={() => setIsCartOpen(false)} className="text-brand-600 font-medium hover:underline">Start Shopping</button>
                </div>
             ) : (
                <div className="space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex space-x-4 animate-fade-in">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                            </div>
                            <div className="flex flex-1 flex-col">
                                <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3 className="line-clamp-2 text-sm leading-snug">{item.name}</h3>
                                        <p className="ml-4">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">{item.type}</p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100 text-gray-600 disabled:opacity-50" disabled={item.quantity <= 1}>
                                            <Minus size={14} />
                                        </button>
                                        <span className="px-2 font-medium text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100 text-gray-600">
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <button onClick={() => removeFromCart(item.id)} className="font-medium text-red-500 hover:text-red-700 flex items-center text-xs">
                                        <Trash2 size={14} className="mr-1" /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             )}
          </div>

          {/* Footer */}
          {!orderPlaced && cart.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-6 bg-gray-50">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                    <p>Subtotal</p>
                    <p>₹{total.toLocaleString('en-IN')}</p>
                </div>
                <p className="mt-0.5 text-xs text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
                <button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full flex items-center justify-center rounded-xl border border-transparent bg-brand-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isCheckingOut ? (
                        <span className="flex items-center">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            Processing...
                        </span>
                    ) : (
                        <>Checkout <ArrowRight size={18} className="ml-2" /></>
                    )}
                </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
