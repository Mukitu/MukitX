import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Star, ArrowLeft, Loader2, 
  CheckCircle2, Send, ShieldCheck, Zap, Globe
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ number: '', transactionId: '' });
  const [paymentNumbers, setPaymentNumbers] = useState({ bkash: '', rocket: '' });

  useEffect(() => {
    fetchProductDetails();
    fetchSettings();
  }, [id, user]);

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('*');
    if (data) {
      const bkash = data.find(s => s.key === 'bkash_number')?.value || 'Not Set';
      const rocket = data.find(s => s.key === 'rocket_number')?.value || 'Not Set';
      setPaymentNumbers({ bkash, rocket });
    }
  }

  async function fetchProductDetails() {
    try {
      const { data: productData } = await supabase.from('products').select('*').eq('id', id).single();
      if (productData) {
        setProduct(productData);
      }

      if (user) {
        const { data: order } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .eq('item_id', id)
          .eq('status', 'approved')
          .single();
        if (order) setIsPurchased(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleBuy = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowPaymentModal(true);
  };

  const submitPayment = async () => {
    if (!paymentDetails.number || !paymentDetails.transactionId) {
      alert('Please fill all payment details');
      return;
    }

    const { error } = await supabase.from('orders').insert([{
      user_id: user?.id,
      item_id: id,
      item_type: 'product',
      item_name: product.title,
      amount: product.price,
      payment_number: paymentDetails.number,
      transaction_id: paymentDetails.transactionId,
      status: 'pending'
    }]);

    if (error) {
      alert(error.message);
    } else {
      alert('Payment submitted successfully! Please wait for admin approval.');
      setShowPaymentModal(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary/60 hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Marketplace
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden glass shadow-2xl">
              <img src={product.image_url} className="w-full h-full object-cover" alt={product.title} />
            </div>

            <div className="glass dark:glass-dark p-8 rounded-[2.5rem]">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-secondary/60 dark:text-white/60 mb-8">
                <span className="flex items-center gap-2"><Star size={18} className="text-yellow-400" /> 5.0 (12 Reviews)</span>
                <span className="flex items-center gap-2"><Zap size={18} className="text-primary" /> Instant Delivery</span>
                <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-green-500" /> Verified Product</span>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold mb-4">Product Description</h3>
                <p className="text-secondary/70 dark:text-white/70 leading-relaxed">{product.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass dark:glass-dark p-6 rounded-3xl">
                <Globe className="text-primary mb-4" size={32} />
                <h4 className="font-bold mb-2">Global Access</h4>
                <p className="text-sm text-secondary/60">Access your digital assets from anywhere in the world, anytime.</p>
              </div>
              <div className="glass dark:glass-dark p-6 rounded-3xl">
                <Zap className="text-primary mb-4" size={32} />
                <h4 className="font-bold mb-2">Instant Download</h4>
                <p className="text-sm text-secondary/60">Get immediate access to files once your payment is approved.</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="glass dark:glass-dark p-8 rounded-[2.5rem] sticky top-32">
              <div className="text-3xl font-bold text-primary mb-6">{formatCurrency(product.price)}</div>
              <button 
                onClick={handleBuy}
                disabled={isPurchased}
                className="w-full btn-gradient py-4 rounded-2xl font-bold mb-6 disabled:opacity-50"
              >
                {isPurchased ? 'Already Purchased' : 'Buy Now'}
              </button>
              
              <div className="space-y-4">
                <p className="font-bold text-sm">Product Features:</p>
                <ul className="space-y-3">
                  {[
                    'Full Source Code',
                    'Documentation Included',
                    'Future Updates',
                    'Premium Support'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-secondary/60 dark:text-white/60">
                      <CheckCircle2 size={16} className="text-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {isPurchased && (
                <div className="mt-8 pt-8 border-t dark:border-white/5">
                  <a 
                    href={product.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-colors"
                  >
                    Download Files
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-md bg-white dark:bg-dark-bg rounded-[2.5rem] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Complete Purchase</h2>
              <div className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-sm font-bold mb-2">Send Payment to:</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-secondary/60">bKash (Personal):</span>
                      <span className="text-sm font-bold text-primary">{paymentNumbers.bkash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-secondary/60">Rocket (Personal):</span>
                      <span className="text-sm font-bold text-primary">{paymentNumbers.rocket}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold px-1">Your Payment Number</label>
                    <input 
                      type="text" 
                      placeholder="017XXXXXXXX"
                      className="w-full p-4 rounded-2xl border dark:border-white/10 bg-white/50 dark:bg-black/20 outline-none"
                      value={paymentDetails.number}
                      onChange={(e) => setPaymentDetails({...paymentDetails, number: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold px-1">Transaction ID</label>
                    <input 
                      type="text" 
                      placeholder="TRX12345678"
                      className="w-full p-4 rounded-2xl border dark:border-white/10 bg-white/50 dark:bg-black/20 outline-none"
                      value={paymentDetails.transactionId}
                      onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})}
                    />
                  </div>
                </div>

                <button onClick={submitPayment} className="w-full btn-gradient py-4 flex items-center justify-center gap-2 font-bold">
                  <Send size={18} /> Submit Payment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
