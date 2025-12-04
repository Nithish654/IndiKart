import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader, Wand2 } from 'lucide-react';
import { api } from '../services/api';
import { generateProductDescription } from '../services/geminiService';
import { StoreContext } from '../App';
import { Product, ProductType } from '../types';

const AdminProductForm = () => {
  const { id } = useParams(); // If ID exists, it's edit mode
  const navigate = useNavigate();
  const { addToast } = useContext(StoreContext)!;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    type: ProductType.PHYSICAL,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    sku: ''
  });

  useEffect(() => {
    if (id) {
        // Fetch product details if editing
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const product = await api.getProductById(id);
                if (product) {
                    setFormData(product);
                } else {
                    addToast("Product not found", "error");
                    navigate('/admin/products');
                }
            } catch (err) {
                addToast("Error loading product", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }
  }, [id, navigate, addToast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
        if (id) {
            await api.updateProduct(id, formData);
            addToast("Product updated successfully", "success");
        } else {
            // @ts-ignore
            await api.createProduct(formData);
            addToast("Product created successfully", "success");
        }
        navigate('/admin/products');
    } catch (error) {
        addToast("Failed to save product", "error");
    } finally {
        setSaving(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.type) {
        addToast("Enter product name and type first", "info");
        return;
    }
    setIsGenerating(true);
    const desc = await generateProductDescription(formData.name, formData.type);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
        <div className="mb-6 flex items-center justify-between">
            <button onClick={() => navigate('/admin/products')} className="flex items-center text-gray-500 hover:text-gray-900 transition">
                <ArrowLeft size={20} className="mr-2" /> Back to Products
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Product' : 'Add New Product'}</h1>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input 
                            type="text" 
                            required
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <input 
                            type="number" 
                            required
                            min="0"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                        <input 
                            type="number" 
                            required
                            min="0"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                            value={formData.stock}
                            onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                        />
                    </div>
                </div>
            </div>

            {/* Categorization */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Categorization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                        <select 
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value as ProductType})}
                        >
                            <option value={ProductType.PHYSICAL}>Physical</option>
                            <option value={ProductType.DIGITAL}>Digital</option>
                            <option value={ProductType.SERVICE}>Service</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                         <select 
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="Home">Home</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Service">Service</option>
                            <option value="Books">Books</option>
                        </select>
                     </div>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                     <h3 className="text-lg font-bold text-gray-900">Description</h3>
                     <button 
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={isGenerating}
                        className="text-xs flex items-center space-x-1 text-brand-600 hover:text-brand-700 font-medium disabled:opacity-50"
                     >
                        {isGenerating ? <Loader size={14} className="animate-spin" /> : <Wand2 size={14} />}
                        <span>AI Generate</span>
                     </button>
                </div>
                <textarea 
                    className="w-full p-3 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter detailed product description..."
                />
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                     <input 
                        type="text" 
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                        value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                    />
                </div>
            </div>

            <div className="pt-6 flex justify-end space-x-4 border-t border-gray-100">
                <button 
                    type="button"
                    onClick={() => navigate('/admin/products')}
                    className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition font-medium"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition flex items-center font-bold shadow-lg shadow-brand-200 disabled:opacity-70"
                >
                    {saving && <Loader size={18} className="animate-spin mr-2" />}
                    Save Product
                </button>
            </div>
        </form>
    </div>
  );
};

export default AdminProductForm;
