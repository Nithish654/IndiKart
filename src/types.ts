export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  type: string;
  sku?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: any[];
}

export enum OrderStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  SHIPPED = 'Shipped',
  COMPLETED = 'Completed',
  REFUNDED = 'Refunded'
}

export enum ProductType {
  PHYSICAL = 'Physical',
  DIGITAL = 'Digital',
  SERVICE = 'Service'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalSpent: number;
  lastOrderDate: string;
  tags: string[];
}

export interface StoreSettings {
  storeName: string;
  email: string;
  currency: string;
  taxRate: string;
  notifications: boolean;
}

export interface DashboardStats {
  revenue: number;
  orders: number;
  customers: number;
  avgOrderValue: number;
  salesData: { name: string; sales: number }[];
  recentOrders: Order[];
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}