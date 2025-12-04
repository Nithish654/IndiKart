import { supabase } from './supabase';
import { Product, Order, Customer, StoreSettings, DashboardStats } from '../types';

export const api = {
  getProducts: async (search?: string, category?: string): Promise<Product[]> => {
    if (!supabase) return [];
    let query = supabase.from('products').select('*');
    if (category && category !== 'All') query = query.eq('category', category);
    if (search) query = query.ilike('name', `%${search}%`);
    
    const { data } = await query;
    return data || [];
  },

  getProductById: async (id: string) => {
    if (!supabase) return null;
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    return data;
  },

  createProduct: async (product: any) => {
    if (!supabase) return;
    return await supabase.from('products').insert([product]);
  },
  
  updateProduct: async (id: string, updates: any) => {
    if (!supabase) return;
    return await supabase.from('products').update(updates).eq('id', id);
  },

  deleteProduct: async (id: string) => {
    if (!supabase) return;
    return await supabase.from('products').delete().eq('id', id);
  },

  createOrder: async (orderData: { items: any[], total: number }) => {
    if (!supabase) return;
    return await supabase.from('orders').insert([{
      customer_name: 'Guest User',
      total: orderData.total,
      items: orderData.items,
      status: 'Pending'
    }]);
  },

  getOrders: async (): Promise<Order[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    return data?.map(o => ({
        ...o,
        customerName: o.customer_name,
        date: new Date(o.created_at).toLocaleDateString()
    })) || [];
  },
  
  updateOrderStatus: async (id: string, status: string) => {
    if (!supabase) return;
    await supabase.from('orders').update({ status }).eq('id', id);
  },

  getCustomers: async (): Promise<Customer[]> => {
    if (!supabase) return [];
    const { data } = await supabase.from('customers').select('*');
    return data?.map(c => ({
        ...c,
        totalSpent: c.total_spent,
        lastOrderDate: c.last_order_date
    })) || [];
  },

  getSettings: async (): Promise<StoreSettings> => {
    if (!supabase) return {} as StoreSettings;
    const { data } = await supabase.from('settings').select('*').single();
    return data ? {
        storeName: data.store_name,
        email: data.email,
        currency: data.currency,
        taxRate: data.tax_rate,
        notifications: data.notifications
    } : {} as StoreSettings;
  },

  updateSettings: async (settings: StoreSettings) => {
    if (!supabase) return;
    const { data } = await supabase.from('settings').select('id').single();
    if (data) {
        await supabase.from('settings').update({
            store_name: settings.storeName,
            email: settings.email,
            currency: settings.currency,
            tax_rate: settings.taxRate,
            notifications: settings.notifications
        }).eq('id', data.id);
    }
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
     // Mock data for dashboard visuals
     return {
         revenue: 125000,
         orders: 142,
         customers: 89,
         avgOrderValue: 850,
         salesData: [
             { name: 'Mon', sales: 4000 },
             { name: 'Tue', sales: 3000 },
             { name: 'Wed', sales: 2000 },
             { name: 'Thu', sales: 2780 },
             { name: 'Fri', sales: 1890 },
             { name: 'Sat', sales: 2390 },
             { name: 'Sun', sales: 3490 },
         ],
         recentOrders: []
     }
  }
};