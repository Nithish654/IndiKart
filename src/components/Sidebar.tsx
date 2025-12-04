import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, FileText, Settings, ShoppingCart, ArrowLeft, Package } from 'lucide-react';

const Sidebar = () => {
  const navClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      isActive 
        ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20' 
        : 'text-brand-100 hover:bg-brand-800 hover:text-white'
    }`;

  return (
    <div className="w-64 bg-brand-900 h-screen fixed left-0 top-0 flex flex-col text-white shadow-2xl z-40">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
            <span className="font-bold text-brand-700 text-xl">I</span>
          </div>
          <div>
              <span className="text-lg font-bold tracking-tight block leading-none">IndiKart</span>
              <span className="text-[10px] text-brand-300 uppercase tracking-widest font-semibold">Admin Panel</span>
          </div>
        </div>
      </div>

      <div className="px-6 mb-2">
         <p className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">Main Menu</p>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <NavLink to="/admin/dashboard" className={navClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/orders" className={navClass}>
          <ShoppingBag size={20} />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/admin/products" className={navClass}>
          <Package size={20} />
          <span>Products</span>
        </NavLink>
        <NavLink to="/admin/customers" className={navClass}>
          <Users size={20} />
          <span>Customers</span>
        </NavLink>
        <NavLink to="/admin/reports" className={navClass}>
          <FileText size={20} />
          <span>Reports</span>
        </NavLink>
      </nav>

      <div className="p-4 m-4 bg-brand-800 rounded-xl">
         <div className="flex items-center space-x-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center">
                 <Settings size={16} />
             </div>
             <div>
                 <p className="text-sm font-medium">Settings</p>
                 <p className="text-xs text-brand-300">App config</p>
             </div>
         </div>
         <NavLink to="/admin/settings" className="text-xs text-center block w-full py-1.5 bg-brand-700 rounded-lg hover:bg-brand-600 transition">
             Manage
         </NavLink>
      </div>

      <div className="p-4 border-t border-brand-800">
        <NavLink to="/" className="flex items-center space-x-2 text-brand-200 hover:text-white transition-colors group">
            <div className="p-1.5 bg-brand-800 rounded-lg group-hover:bg-brand-700 transition">
                <ArrowLeft size={16} />
            </div>
            <span className="text-sm font-medium">Back to Shop</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;