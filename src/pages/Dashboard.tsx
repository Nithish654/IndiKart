import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp, Loader } from 'lucide-react';
import { OrderStatus, DashboardStats } from '../types';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className="text-green-500 font-medium flex items-center">
        <TrendingUp size={14} className="mr-1" /> {trend}
      </span>
      <span className="text-gray-400 ml-2">vs last month</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const data = await api.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats", error);
        } finally {
            setLoading(false);
        }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
      return (
          <div className="h-full flex items-center justify-center">
              <Loader size={40} className="animate-spin text-brand-600" />
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500">Welcome back, here's what's happening with your store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.revenue.toLocaleString('en-IN')}`} 
          icon={DollarSign} 
          color="bg-green-500 text-green-600"
          trend="+12.5%"
        />
        <StatCard 
          title="Orders" 
          value={stats.orders} 
          icon={ShoppingBag} 
          color="bg-brand-500 text-brand-600"
          trend="+5.2%"
        />
        <StatCard 
          title="Active Customers" 
          value={stats.customers} 
          icon={Users} 
          color="bg-purple-500 text-purple-600"
          trend="+2.1%"
        />
        <StatCard 
          title="Avg. Order Value" 
          value={`₹${stats.avgOrderValue.toFixed(0)}`} 
          icon={TrendingUp} 
          color="bg-orange-500 text-orange-600"
          trend="+8.4%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Analytics</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ fill: '#f3f4f6' }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-4 overflow-y-auto no-scrollbar flex-1">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100 group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                    {order.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-brand-700 transition">{order.customerName}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">
                        {order.items && order.items.length > 0 ? order.items[0].productName : 'Order Info'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">₹{order.total.toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-semibold ${
                    order.status === OrderStatus.PAID || order.status === OrderStatus.SHIPPED || order.status === OrderStatus.COMPLETED
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/orders" className="w-full mt-4 py-2 text-sm text-center text-brand-600 font-bold bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
