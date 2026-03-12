import { motion } from 'framer-motion';
import { Book, Download, Clock, Play, Calendar, History, Loader2, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-green-500 font-bold">Class is starting or has started!</span>;

  return (
    <div className="flex items-center gap-2 text-sm font-mono bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg">
      <span className="text-primary font-bold">{timeLeft.days}d</span>:
      <span className="text-primary font-bold">{timeLeft.hours}h</span>:
      <span className="text-primary font-bold">{timeLeft.minutes}m</span>:
      <span className="text-primary font-bold">{timeLeft.seconds}s</span>
    </div>
  );
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<any[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    
    // Set up real-time listener for orders
    let subscription: any;
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        subscription = supabase
          .channel('orders_changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'orders',
            filter: `user_id=eq.${user.id}`
          }, () => {
            fetchUserData();
          })
          .subscribe();
      }
    });

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchUserData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setUser(user);

    // Fetch approved orders for this user
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersData) {
      setOrders(ordersData);
      
      const approvedOrders = ordersData.filter(o => o.status === 'approved');
      
      // Fetch details for purchased courses
      const courseIds = approvedOrders.filter(o => o.item_type === 'course').map(o => o.item_id);
      if (courseIds.length > 0) {
        const { data: coursesData } = await supabase
          .from('courses')
          .select('*')
          .in('id', courseIds);
        if (coursesData) setPurchasedCourses(coursesData);

        // Fetch live classes for these courses
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
        const { data: classesData } = await supabase
          .from('live_classes')
          .select('*')
          .in('course_id', courseIds)
          .gte('start_time', twoHoursAgo)
          .order('start_time', { ascending: true });
        
        if (classesData) setLiveClasses(classesData);
      }

      // Fetch details for purchased products
      const productIds = approvedOrders.filter(o => o.item_type === 'product').map(o => o.item_id);
      if (productIds.length > 0) {
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);
        if (productsData) setPurchasedProducts(productsData);
      }
    }
    setLoading(false);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.user_metadata?.full_name || 'Student'}!</h1>
            <p className="text-secondary/60 dark:text-white/60">Manage your learning and digital assets in one place.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all w-fit"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'courses', label: 'My Courses', icon: Book },
            { id: 'products', label: 'My Products', icon: Download },
            { id: 'history', label: 'Order History', icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all shrink-0",
                activeTab === tab.id 
                  ? "bg-primary text-white" 
                  : "bg-white dark:bg-white/5 border dark:border-white/10 hover:bg-black/5"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'courses' && (
          <div className="grid md:grid-cols-2 gap-8">
            {purchasedCourses.map((course) => {
              const upcomingClass = liveClasses.find(c => c.course_id === course.id);
              return (
                <div key={course.id} className="glass dark:glass-dark rounded-3xl p-6 flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-32 h-48 sm:h-32 rounded-2xl overflow-hidden shrink-0">
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold mb-2">{course.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-secondary/40 dark:text-white/40 mb-4">
                        <span className="flex items-center gap-1"><Clock size={14} /> {course.duration || 'N/A'}</span>
                        {course.type === 'live' && <span className="flex items-center gap-1 text-red-500"><Calendar size={14} /> Live Course</span>}
                      </div>
                      
                      {course.type === 'live' && upcomingClass && (
                        <div className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
                          <p className="text-xs font-bold text-primary mb-2">Upcoming: {upcomingClass.title}</p>
                          <CountdownTimer targetDate={upcomingClass.start_time} />
                        </div>
                      )}
                    </div>
                    
                    {course.type === 'live' ? (
                      <a 
                        href={upcomingClass?.zoom_link || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={cn(
                          "btn-gradient !py-2 !px-4 text-sm flex items-center justify-center gap-2 w-fit",
                          !upcomingClass && "opacity-50 cursor-not-allowed pointer-events-none"
                        )}
                      >
                        <Play size={14} /> Join Class
                      </a>
                    ) : (
                      <button className="btn-gradient !py-2 !px-4 text-sm flex items-center justify-center gap-2 w-fit">
                        <Play size={14} /> Start Learning
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {purchasedCourses.length === 0 && (
              <div className="col-span-2 text-center py-20 glass dark:glass-dark rounded-3xl">
                <p className="text-secondary/40">You haven't purchased any courses yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid md:grid-cols-3 gap-8">
            {purchasedProducts.map((product) => (
              <div key={product.id} className="glass dark:glass-dark rounded-3xl p-6">
                <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                  <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <h3 className="font-bold mb-4">{product.title}</h3>
                <a 
                  href={product.download_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl border dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                >
                  <Download size={16} /> Download Files
                </a>
              </div>
            ))}
            {purchasedProducts.length === 0 && (
              <div className="col-span-3 text-center py-20 glass dark:glass-dark rounded-3xl">
                <p className="text-secondary/40">You haven't purchased any products yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="glass dark:glass-dark rounded-3xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-black/5 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold">Item</th>
                  <th className="px-6 py-4 text-sm font-bold">Type</th>
                  <th className="px-6 py-4 text-sm font-bold">Amount</th>
                  <th className="px-6 py-4 text-sm font-bold">Status</th>
                  <th className="px-6 py-4 text-sm font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{order.item_name}</td>
                    <td className="px-6 py-4 text-sm capitalize">{order.item_type}</td>
                    <td className="px-6 py-4 text-sm font-bold">{formatCurrency(order.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        order.status === 'approved' ? "bg-green-500/10 text-green-500" : 
                        order.status === 'rejected' ? "bg-red-500/10 text-red-500" : 
                        "bg-yellow-500/10 text-yellow-500"
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary/40">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-secondary/40">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
