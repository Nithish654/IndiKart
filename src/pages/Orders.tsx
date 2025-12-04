import React, { useEffect, useState, useContext } from 'react';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';
import { Clock, CheckCircle, Truck, XCircle, Loader } from 'lucide-react';
import { StoreContext } from '../App';

const Orders = () => {
  const { addToast } = useContext(StoreContext)!;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetchOrders();
  }, []);

  const fetchOrders = async () => {
      setLoading(true);
      try {
          const data = await api.getOrders();
          setOrders(data);
      } catch (error) {
          addToast("Failed to fetch orders", "error");
      } finally {
          setLoading(false);
      }
  };

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
      // Optimistic update
      const originalOrders = [...orders];
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      
      try {
          await api.updateOrderStatus(orderId, status);
          addToast(`Order updated to ${status}`, "success");
      } catch (error) {
          setOrders(originalOrders); // Revert
          addToast("Failed to update status", "error");
      }
  };

  const statusColors = {
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.PAID]: 'bg-blue-100 text-blue-800',
    [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
    [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [OrderStatus.REFUNDED]: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    [OrderStatus.PENDING]: <Clock size={14} className="mr-1" />,
    [OrderStatus.PAID]: <CheckCircle size={14} className="mr-1" />,
    [OrderStatus.SHIPPED]: <Truck size={14} className="mr-1" />,
    [OrderStatus.COMPLETED]: <CheckCircle size={14} className="mr-1" />,
    [OrderStatus.REFUNDED]: <XCircle size={14} className="mr-1" />,
  };

  if (loading) {
      return <div className="flex justify-center p-12"><Loader className="animate-spin text-brand-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage and track customer orders</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {order.id}
                  </span>
                </td>
                <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.items.length} items</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4 font-bold text-gray-900">₹{order.total.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {statusIcons[order.status]}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select 
                    className="text-xs border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring focus:ring-brand-200 focus:ring-opacity-50 p-1"
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                  >
                    {Object.values(OrderStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
