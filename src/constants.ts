import { Product, ProductType, Customer, Order, OrderStatus, AnalyticsData } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Godrej Ergonomic Office Chair',
    description: 'High-back mesh chair with adjustable lumbar support, perfect for WFH setups.',
    price: 12999.00,
    type: ProductType.PHYSICAL,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1616627561839-074385245c4e?auto=format&fit=crop&w=400&q=80',
    sku: 'FURN-001',
    category: 'Home'
  },
  {
    id: 'p2',
    name: 'boAt Rockerz 550 Headphones',
    description: 'Wireless Bluetooth headphones with 20H playback and thumping bass.',
    price: 1999.00,
    type: ProductType.PHYSICAL,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    sku: 'ELEC-202',
    category: 'Electronics'
  },
  {
    id: 'p3',
    name: 'Startup Legal Consultation',
    description: '45-minute call with a CA for GST and business registration queries.',
    price: 2499.00,
    type: ProductType.SERVICE,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&q=80',
    sku: 'SERV-101',
    category: 'Service'
  },
  {
    id: 'p4',
    name: 'Ultimate Social Media Kit',
    description: '500+ Canva templates for Instagram, LinkedIn and Twitter marketing.',
    price: 999.00,
    type: ProductType.DIGITAL,
    stock: 999,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80',
    sku: 'DIGI-005',
    category: 'Service'
  },
  {
    id: 'p5',
    name: 'Logitech MX Master 3S',
    description: 'Performance wireless mouse with ultra-fast scrolling and 8K DPI.',
    price: 8995.00,
    type: ProductType.PHYSICAL,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80',
    sku: 'ELEC-305',
    category: 'Electronics'
  },
  {
    id: 'p6',
    name: 'Jaipur Cotton Bedsheet (King)',
    description: '100% Cotton traditional Rajasthani printed bedsheet with pillow covers.',
    price: 849.00,
    type: ProductType.PHYSICAL,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1522771753035-0a1518ac39da?auto=format&fit=crop&w=400&q=80',
    sku: 'HOME-102',
    category: 'Home'
  },
  {
    id: 'p7',
    name: 'iPhone 15 (128GB)',
    description: 'The latest iPhone with Dynamic Island and 48MP camera.',
    price: 79900.00,
    type: ProductType.PHYSICAL,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=400&q=80',
    sku: 'MOB-001',
    category: 'Mobiles'
  },
  {
    id: 'p8',
    name: 'Nike Air Jordan 1',
    description: 'Classic high-top sneakers in red and white colorway.',
    price: 13995.00,
    type: ProductType.PHYSICAL,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    sku: 'FASH-001',
    category: 'Fashion'
  },
  {
    id: 'p9',
    name: 'Lakme Absolute Lipstick',
    description: 'Matte finish long-lasting lipstick in Red Rush.',
    price: 750.00,
    type: ProductType.PHYSICAL,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    sku: 'BEAU-001',
    category: 'Beauty'
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    phone: '+91 98765 43210',
    totalSpent: 15498.00,
    tags: ['Premium', 'Bangalore'],
    lastOrderDate: '2023-10-15',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'c2',
    name: 'Rahul Verma',
    email: 'rahul.v@example.com',
    phone: '+91 99887 76655',
    totalSpent: 1999.00,
    tags: ['New', 'Mumbai'],
    lastOrderDate: '2023-10-20',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'c3',
    name: 'Amit Patel',
    email: 'amit.p@example.com',
    phone: '+91 91234 56789',
    totalSpent: 45000.00,
    tags: ['Wholesale', 'Ahmedabad'],
    lastOrderDate: '2023-09-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7782',
    customerId: 'c1',
    customerName: 'Priya Sharma',
    date: '2023-10-15',
    total: 12999.00,
    status: OrderStatus.SHIPPED,
    items: [{ productId: 'p1', productName: 'Godrej Ergonomic Office Chair', quantity: 1, price: 12999.00 }]
  },
  {
    id: 'ORD-7783',
    customerId: 'c2',
    customerName: 'Rahul Verma',
    date: '2023-10-20',
    total: 1999.00,
    status: OrderStatus.PAID,
    items: [{ productId: 'p2', productName: 'boAt Rockerz 550 Headphones', quantity: 1, price: 1999.00 }]
  },
  {
    id: 'ORD-7784',
    customerId: 'c3',
    customerName: 'Amit Patel',
    date: '2023-10-22',
    total: 4998.00,
    status: OrderStatus.PENDING,
    items: [{ productId: 'p3', productName: 'Startup Legal Consultation', quantity: 2, price: 2499.00 }]
  }
];

export const SALES_DATA: AnalyticsData[] = [
  { name: 'Mon', sales: 25000, visitors: 240 },
  { name: 'Tue', sales: 18000, visitors: 139 },
  { name: 'Wed', sales: 12000, visitors: 980 },
  { name: 'Thu', sales: 35000, visitors: 390 },
  { name: 'Fri', sales: 42000, visitors: 480 },
  { name: 'Sat', sales: 55000, visitors: 380 },
  { name: 'Sun', sales: 60000, visitors: 430 },
];