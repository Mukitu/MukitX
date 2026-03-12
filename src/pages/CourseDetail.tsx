import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, Clock, Users, Star, CheckCircle2, 
  Lock, ArrowLeft, Loader2, CreditCard, Send
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency, cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ number: '', transactionId: '' });
  const [paymentNumbers, setPaymentNumbers] = useState({ bkash: '', rocket: '' });

  useEffect(() => {
    fetchCourseDetails();
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

  async function fetchCourseDetails() {
    try {
      const { data: courseData } = await supabase.from('courses').select('*').eq('id', id).single();
      if (courseData) {
        setCourse(courseData);
        const { data: videoData } = await supabase.from('course_videos').select('*').eq('course_id', id).order('order_index');
        setVideos(videoData || []);
      }

      if (user) {
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .eq('item_id', id)
          .order('created_at', { ascending: false });
          
        if (orders && orders.length > 0) {
          const latestOrder = orders[0];
          if (latestOrder.status === 'approved') {
            setIsPurchased(true);
          } else if (latestOrder.status === 'pending') {
            setIsPending(true);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isPending) {
      alert('Your previous order is still pending approval. Please wait.');
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
      item_type: 'course',
      item_name: course.title,
      amount: course.price,
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
  if (!course) return <div className="min-h-screen flex items-center justify-center">Course not found</div>;

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary/60 hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Courses
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden glass shadow-2xl">
              <img src={course.thumbnail_url} className="w-full h-full object-cover" alt={course.title} />
              {!isPurchased && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-8 text-center">
                  <Lock size={48} className="mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-2">Course Content Locked</h3>
                  <p className="text-white/60 mb-6">Enroll in this course to get full access to all lessons and materials.</p>
                  <button 
                    onClick={handleEnroll} 
                    disabled={isPending}
                    className="btn-gradient px-8 py-3 rounded-2xl disabled:opacity-50"
                  >
                    {isPending ? 'Approval Pending' : 'Enroll Now'}
                  </button>
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-secondary/60 dark:text-white/60 mb-8">
                <span className="flex items-center gap-2"><Clock size={18} className="text-primary" /> {course.duration}</span>
                <span className="flex items-center gap-2"><Users size={18} className="text-primary" /> 1,240 Students</span>
                <span className="flex items-center gap-2"><Star size={18} className="text-yellow-400" /> 4.9 (240 Reviews)</span>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold mb-4">About this Course</h3>
                <p className="text-secondary/70 dark:text-white/70 leading-relaxed">{course.description}</p>
              </div>
            </div>

            {/* Curriculum */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Course Curriculum</h3>
              <div className="space-y-3">
                {videos.map((video, i) => (
                  <div key={video.id} className="flex items-center justify-between p-4 glass dark:glass-dark rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                        {i + 1}
                      </div>
                      <p className="font-medium">{video.title}</p>
                    </div>
                    {isPurchased ? (
                      <button className="text-primary hover:underline flex items-center gap-1 text-sm">
                        <PlayCircle size={16} /> Watch
                      </button>
                    ) : (
                      <Lock size={16} className="text-secondary/20" />
                    )}
                  </div>
                ))}
                {videos.length === 0 && <p className="text-secondary/40 italic">No lessons added yet.</p>}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="glass dark:glass-dark p-8 rounded-[2.5rem] sticky top-32">
              <div className="text-3xl font-bold text-primary mb-6">{formatCurrency(course.price)}</div>
              <button 
                onClick={handleEnroll}
                disabled={isPurchased}
                className="w-full btn-gradient py-4 rounded-2xl font-bold mb-6 disabled:opacity-50"
              >
                {isPurchased ? 'Already Enrolled' : 'Enroll Now'}
              </button>
              
              <div className="space-y-4">
                <p className="font-bold text-sm">This course includes:</p>
                <ul className="space-y-3">
                  {[
                    'Full lifetime access',
                    'Access on mobile and TV',
                    'Certificate of completion',
                    '12 Downloadable resources'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-secondary/60 dark:text-white/60">
                      <CheckCircle2 size={16} className="text-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
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
              <h2 className="text-2xl font-bold mb-6">Complete Enrollment</h2>
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
