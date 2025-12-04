import React, { useState, useEffect, useContext } from 'react';
import { Mail, Phone, Sparkles, Loader } from 'lucide-react';
import { StoreContext } from '../App';
import Modal from '../components/Modal';
import { generateMarketingEmail } from '../services/geminiService';
import { Customer } from '../types';
import { api } from '../services/api';

const Customers = () => {
  const { addToast } = useContext(StoreContext)!;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
      const fetchCustomers = async () => {
          try {
              const data = await api.getCustomers();
              setCustomers(data);
          } catch (error) {
              addToast("Failed to fetch customers", "error");
          } finally {
              setLoading(false);
          }
      };
      fetchCustomers();
  }, []);

  const handleGenerateEmail = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEmailModalOpen(true);
    setEmailDraft('');
    setIsGenerating(true);
    const recentProduct = "Premium Icon Pack"; 
    const draft = await generateMarketingEmail(customer.name, recentProduct);
    setEmailDraft(draft);
    setIsGenerating(false);
  };

  if (loading) {
      return <div className="flex justify-center p-12"><Loader className="animate-spin text-brand-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500">View and manage your client base</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center space-x-2">
           <input 
             type="text" 
             placeholder="Search customers..." 
             className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500 w-64"
           />
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tags</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total Spent (INR)</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">Last seen: {customer.lastOrderDate}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-sm text-gray-600">
                    <span className="flex items-center space-x-1"><Mail size={12} className="mr-1"/> {customer.email}</span>
                    <span className="flex items-center space-x-1 mt-1"><Phone size={12} className="mr-1"/> {customer.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {customer.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-xs bg-brand-50 text-brand-700 rounded-full border border-brand-100">
                            {tag}
                        </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ₹{customer.totalSpent.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleGenerateEmail(customer)}
                    className="text-brand-600 hover:bg-brand-50 p-2 rounded-lg transition-colors flex items-center justify-end ml-auto space-x-1 text-xs font-medium"
                    title="Generate Email with AI"
                  >
                    <Sparkles size={14} />
                    <span>Email</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Email Modal */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Draft Email (AI Generated)"
      >
        <div className="space-y-4">
             {isGenerating ? (
                 <div className="flex flex-col items-center justify-center py-8">
                     <Loader size={32} className="animate-spin text-brand-500 mb-2" />
                     <p className="text-sm text-gray-500">Gemini is writing an email for {selectedCustomer?.name}...</p>
                 </div>
             ) : (
                 <>
                    <textarea 
                        className="w-full h-48 p-3 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-brand-500 outline-none"
                        value={emailDraft}
                        onChange={(e) => setEmailDraft(e.target.value)}
                    />
                    <div className="flex justify-end space-x-3">
                        <button 
                            onClick={() => setIsEmailModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                        >
                            Discard
                        </button>
                        <button 
                            onClick={() => { setIsEmailModalOpen(false); addToast("Email sent successfully", "success"); }}
                            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm flex items-center"
                        >
                            <Mail size={16} className="mr-2" />
                            Send Email
                        </button>
                    </div>
                 </>
             )}
        </div>
      </Modal>
    </div>
  );
};

export default Customers;