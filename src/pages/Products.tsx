import React, { useState, useEffect, useContext } from 'react';
import { Plus, Edit2, Trash2, Loader } from 'lucide-react';
import { Product, ProductType } from '../types';
import { api } from '../services/api';
import { StoreContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const { addToast } = useContext(StoreContext)!;
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
      setLoading(true);
      try {
          const data = await api.getProducts(); 
          setProducts(data);
      } catch (err) {
          addToast("Failed to load products", "error");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
      if(!window.confirm("Are you sure?")) return;
      try {
          await api.deleteProduct(id);
          addToast("Product deleted", "info");
          fetchProducts();
      } catch (error) {
          addToast("Error deleting product", "error");
      }
  };

  if (loading) {
      return <div className="flex justify-center p-12"><Loader className="animate-spin text-brand-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <button 
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center space-x-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition shadow-md"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Price (INR)</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-200" />
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.type === ProductType.DIGITAL 
                      ? 'bg-purple-100 text-purple-700' 
                      : product.type === ProductType.SERVICE 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700'
                  }`}>
                    {product.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{product.price.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => navigate(`/admin/products/${product.id}/edit`)} className="text-gray-400 hover:text-brand-600 transition">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-600 transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
