import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StoreContext } from '../App';
import { Loader, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { addToast } = React.useContext(StoreContext)!;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await login(email, password);
    
    setIsSubmitting(false);

    if (error) {
      addToast(error, 'error');
    } else {
      addToast('Welcome back!', 'success');
      // Navigation is handled by AuthGuard or component logic, but we can force it
      if (email.includes('admin')) {
          navigate('/admin/dashboard');
      } else {
          navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-brand-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            I
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to IndiKart</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-500">create a new account</Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all shadow-lg hover:shadow-brand-500/30 disabled:opacity-70"
            >
              {isSubmitting ? <Loader className="animate-spin" /> : 'Sign in'}
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-xs text-blue-700">
             <p className="font-bold">Demo Credentials:</p>
             <p>Admin: admin@indikart.in / password</p>
             <p>Customer: user@test.com / password</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
