import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, ShoppingBag, CreditCard, 
  Users, Settings, Plus, Check, X, Edit, Trash2,
  Briefcase, MessageSquare, UserPlus, Loader2, Image as ImageIcon,
  LogOut
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: BookOpen, label: 'Courses', id: 'courses' },
  { icon: ShoppingBag, label: 'Products', id: 'products' },
  { icon: Briefcase, label: 'Portfolio', id: 'portfolio' },
  { icon: MessageSquare, label: 'Testimonials', id: 'testimonials' },
  { icon: UserPlus, label: 'Team', id: 'team' },
  { icon: BookOpen, label: 'Videos', id: 'course_videos' },
  { icon: BookOpen, label: 'Live', id: 'live_classes' },
  { icon: CreditCard, label: 'Payments', id: 'payments' },
  { icon: Users, label: 'Users', id: 'users' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && profile?.role !== 'admin') {
      navigate('/');
    }
  }, [profile, authLoading, navigate]);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (profile?.role !== 'admin') return null;

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-[1600px] mx-auto px-6 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="glass dark:glass-dark rounded-3xl p-4 sticky top-24">
            <div className="flex items-center gap-3 px-4 py-6 mb-4 border-b dark:border-white/5">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold">A</div>
              <div>
                <h4 className="font-bold text-sm">Admin Panel</h4>
                <p className="text-xs text-secondary/40 dark:text-white/40">MukitX Management</p>
              </div>
            </div>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                    activeTab === item.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "hover:bg-black/5 dark:hover:bg-white/5 text-secondary/60 dark:text-white/60"
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate('/login');
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap text-red-500 hover:bg-red-500/10 mt-4 border-t dark:border-white/5 pt-4 lg:mt-4"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow pb-12">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
            {activeTab !== 'overview' && activeTab !== 'payments' && activeTab !== 'users' && (
              <button 
                onClick={handleAddNew}
                className="btn-gradient flex items-center gap-2 text-sm py-2"
              >
                <Plus size={18} /> Add New {activeTab.slice(0, -1)}
              </button>
            )}
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'courses' && <DataManagementTab table="courses" onEdit={handleEdit} />}
              {activeTab === 'products' && <DataManagementTab table="products" onEdit={handleEdit} />}
              {activeTab === 'portfolio' && <DataManagementTab table="portfolio_projects" onEdit={handleEdit} />}
              {activeTab === 'testimonials' && <DataManagementTab table="testimonials" onEdit={handleEdit} />}
              {activeTab === 'team' && <DataManagementTab table="team_members" onEdit={handleEdit} />}
              {activeTab === 'course_videos' && <DataManagementTab table="course_videos" onEdit={handleEdit} />}
              {activeTab === 'live_classes' && <DataManagementTab table="live_classes" onEdit={handleEdit} />}
              {activeTab === 'payments' && <PaymentsTab />}
              {activeTab === 'users' && <UsersTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-dark-bg rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">{editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <DynamicForm 
                type={activeTab} 
                initialData={editingItem}
                onSuccess={() => {
                  setIsModalOpen(false);
                  window.location.reload(); // Refresh to show new data
                }} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DynamicForm({ type, initialData, onSuccess }: { type: string, initialData?: any, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(initialData || {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let table = '';
    switch(type) {
      case 'courses': table = 'courses'; break;
      case 'products': table = 'products'; break;
      case 'portfolio': table = 'portfolio_projects'; break;
      case 'testimonials': table = 'testimonials'; break;
      case 'team': table = 'team_members'; break;
      case 'course_videos': table = 'course_videos'; break;
      case 'live_classes': table = 'live_classes'; break;
      case 'settings': table = 'settings'; break;
    }

    let error;
    if (initialData?.id) {
      const { error: err } = await supabase.from(table).update(formData).eq('id', initialData.id);
      error = err;
    } else {
      const { error: err } = await supabase.from(table).insert([formData]);
      error = err;
    }
    
    if (error) {
      alert(error.message);
    } else {
      onSuccess();
    }
    setLoading(false);
  };

  const renderFields = () => {
    switch(type) {
      case 'courses':
        return (
          <>
            <Input label="Title" name="title" value={formData.title} onChange={setFormData} />
            <Input label="Description" name="description" value={formData.description} isTextArea onChange={setFormData} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price" name="price" type="number" value={formData.price} onChange={setFormData} />
              <Input label="Duration" name="duration" placeholder="e.g. 8 Weeks" value={formData.duration} onChange={setFormData} />
            </div>
            <Input label="Thumbnail URL" name="thumbnail_url" value={formData.thumbnail_url} onChange={setFormData} />
            <select 
              className="w-full p-4 rounded-2xl border dark:border-white/10 bg-white/50 dark:bg-black/20 outline-none"
              value={formData.type || 'recorded'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="recorded">Recorded</option>
              <option value="live">Live</option>
            </select>
          </>
        );
      case 'products':
        return (
          <>
            <Input label="Title" name="title" value={formData.title} onChange={setFormData} />
            <Input label="Description" name="description" value={formData.description} isTextArea onChange={setFormData} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price" name="price" type="number" value={formData.price} onChange={setFormData} />
            </div>
            <Input label="Image URL" name="image_url" value={formData.image_url} onChange={setFormData} />
            <Input label="Download URL" name="download_url" value={formData.download_url} onChange={setFormData} />
          </>
        );
      case 'portfolio':
        return (
          <>
            <Input label="Title" name="title" value={formData.title} onChange={setFormData} />
            <Input label="Result/Description" name="result" value={formData.result} isTextArea onChange={setFormData} />
            <Input label="Category" name="category" value={formData.category} onChange={setFormData} />
            <Input label="Image URL" name="image" value={formData.image} onChange={setFormData} />
          </>
        );
      case 'testimonials':
        return (
          <>
            <Input label="Name" name="name" value={formData.name} onChange={setFormData} />
            <Input label="Profession" name="profession" value={formData.profession} onChange={setFormData} />
            <Input label="Country" name="country" value={formData.country} onChange={setFormData} />
            <Input label="Feedback" name="feedback" value={formData.feedback} isTextArea onChange={setFormData} />
            <Input label="Photo URL" name="photo" value={formData.photo} onChange={setFormData} />
          </>
        );
      case 'team':
        return (
          <>
            <Input label="Name" name="name" value={formData.name} onChange={setFormData} />
            <Input label="Position" name="position" value={formData.position} onChange={setFormData} />
            <Input label="Display Order" name="display_order" type="number" value={formData.display_order} onChange={setFormData} />
            <Input label="Bio" name="bio" value={formData.bio} isTextArea onChange={setFormData} />
            <Input label="Photo URL" name="photo" value={formData.photo} onChange={setFormData} />
          </>
        );
      case 'course_videos':
        return (
          <>
            <Input label="Course ID" name="course_id" value={formData.course_id} onChange={setFormData} />
            <Input label="Video Title" name="title" value={formData.title} onChange={setFormData} />
            <Input label="YouTube URL" name="video_url" value={formData.video_url} onChange={setFormData} />
            <Input label="Order Index" name="order_index" type="number" value={formData.order_index} onChange={setFormData} />
          </>
        );
      case 'live_classes':
        return (
          <>
            <Input label="Course ID" name="course_id" value={formData.course_id} onChange={setFormData} />
            <Input label="Class Title" name="title" value={formData.title} onChange={setFormData} />
            <Input label="Zoom Link" name="zoom_link" value={formData.zoom_link} onChange={setFormData} />
            <Input label="Start Time" name="start_time" type="datetime-local" value={formData.start_time} onChange={setFormData} />
          </>
        );
      case 'settings':
        return (
          <>
            <Input label="Setting Key" name="key" value={formData.key} onChange={setFormData} />
            <Input label="Setting Value" name="value" value={formData.value} onChange={setFormData} />
            <Input label="Description" name="description" value={formData.description} onChange={setFormData} />
          </>
        );
      default: return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderFields()}
      <button disabled={loading} className="w-full btn-gradient py-4 flex items-center justify-center gap-2 mt-6">
        {loading ? <Loader2 className="animate-spin" /> : initialData ? 'Update Item' : 'Create Item'}
      </button>
    </form>
  );
}

function Input({ label, name, type = 'text', placeholder, isTextArea, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold px-1">{label}</label>
      {isTextArea ? (
        <textarea 
          required
          placeholder={placeholder}
          value={value || ''}
          className="w-full p-4 rounded-2xl border dark:border-white/10 bg-white/50 dark:bg-black/20 outline-none min-h-[100px]"
          onChange={(e) => onChange((prev: any) => ({ ...prev, [name]: e.target.value }))}
        />
      ) : (
        <input 
          required
          type={type}
          placeholder={placeholder}
          value={value || ''}
          className="w-full p-4 rounded-2xl border dark:border-white/10 bg-white/50 dark:bg-black/20 outline-none"
          onChange={(e) => onChange((prev: any) => ({ ...prev, [name]: type === 'number' ? parseFloat(e.target.value) : e.target.value }))}
        />
      )}
    </div>
  );
}

function DataManagementTab({ table, onEdit }: { table: string, onEdit: (item: any) => void }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [table]);

  async function fetchData() {
    let query = supabase.from(table).select('*');
    
    if (table === 'team_members') {
      query = query.order('display_order', { ascending: true });
    } else if (table === 'course_videos') {
      query = query.order('order_index', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: result } = await query;
    if (result) setData(result);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) fetchData();
  }

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((item) => (
        <div key={item.id} className="glass dark:glass-dark p-6 rounded-3xl group relative">
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(item)} className="p-2 bg-white dark:bg-black rounded-lg shadow-lg text-secondary/60 hover:text-primary"><Edit size={16} /></button>
            <button onClick={() => handleDelete(item.id)} className="p-2 bg-white dark:bg-black rounded-lg shadow-lg text-secondary/60 hover:text-red-500"><Trash2 size={16} /></button>
          </div>
          <div className="aspect-video rounded-2xl bg-slate-100 dark:bg-white/5 mb-4 overflow-hidden">
            <img 
              src={item.thumbnail_url || item.image_url || item.image || item.photo || 'https://picsum.photos/seed/placeholder/400/225'} 
              className="w-full h-full object-cover"
              alt=""
              referrerPolicy="no-referrer"
            />
          </div>
          <h4 className="font-bold mb-1 truncate">{item.title || item.name}</h4>
          <p className="text-xs text-secondary/40 dark:text-white/40 line-clamp-2">{item.description || item.feedback || item.bio || item.result}</p>
        </div>
      ))}
      {data.length === 0 && (
        <div className="col-span-full py-20 text-center text-secondary/40">No items found. Click "Add New" to get started.</div>
      )}
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '$0', change: '+0%', icon: CreditCard },
    { label: 'Active Students', value: '0', change: '+0%', icon: Users },
    { label: 'Course Sales', value: '0', change: '+0%', icon: BookOpen },
    { label: 'Product Sales', value: '0', change: '+0%', icon: ShoppingBag },
  ]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverviewData() {
      try {
        // Fetch stats
        const { data: orders } = await supabase.from('orders').select('amount, status, type');
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        
        if (orders) {
          const totalRevenue = orders
            .filter(o => o.status === 'approved')
            .reduce((acc, curr) => acc + (curr.amount || 0), 0);
          
          const courseSales = orders.filter(o => o.type === 'course' && o.status === 'approved').length;
          const productSales = orders.filter(o => o.type === 'product' && o.status === 'approved').length;

          setStats([
            { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12%', icon: CreditCard },
            { label: 'Active Students', value: (userCount || 0).toString(), change: '+5%', icon: Users },
            { label: 'Course Sales', value: courseSales.toString(), change: '+8%', icon: BookOpen },
            { label: 'Product Sales', value: productSales.toString(), change: '+15%', icon: ShoppingBag },
          ]);
        }

        // Fetch recent activity
        const { data: recent } = await supabase
          .from('orders')
          .select('*, profiles(full_name)')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (recent) setRecentActivity(recent);
      } catch (error) {
        console.error('Error fetching overview data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOverviewData();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass dark:glass-dark p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-secondary/40 dark:text-white/40 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="glass dark:glass-dark rounded-3xl p-8">
        <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
        <div className="space-y-6">
          {recentActivity.map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b dark:border-white/5 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">{activity.profiles?.full_name || 'New Order'}</p>
                  <p className="text-xs text-secondary/40 dark:text-white/40">
                    Purchased {activity.item_name || 'a product'} for ${activity.amount}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{activity.status}</p>
                <p className="text-[10px] text-secondary/40 dark:text-white/40">{new Date(activity.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <div className="text-center py-10 text-secondary/40">No recent activity found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentsTab() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    const { data } = await supabase.from('orders').select('*, profiles(full_name)').order('created_at', { ascending: false });
    if (data) setPayments(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) fetchPayments();
  }

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="glass dark:glass-dark rounded-3xl overflow-hidden overflow-x-auto">
      <table className="w-full text-left min-w-[800px]">
        <thead className="bg-black/5 dark:bg-white/5">
          <tr>
            <th className="px-6 py-4 text-sm font-bold">User</th>
            <th className="px-6 py-4 text-sm font-bold">Item</th>
            <th className="px-6 py-4 text-sm font-bold">Amount</th>
            <th className="px-6 py-4 text-sm font-bold">Transaction ID</th>
            <th className="px-6 py-4 text-sm font-bold">Status</th>
            <th className="px-6 py-4 text-sm font-bold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-white/5">
          {payments.map((p) => (
            <tr key={p.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 text-sm font-medium">{p.profiles?.full_name || 'Unknown'}</td>
              <td className="px-6 py-4 text-sm">{p.item_name}</td>
              <td className="px-6 py-4 text-sm font-bold">${p.amount}</td>
              <td className="px-6 py-4 text-sm font-mono">{p.transaction_id}</td>
              <td className="px-6 py-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  p.status === 'approved' ? "bg-green-500/10 text-green-500" :
                  p.status === 'pending' ? "bg-yellow-500/10 text-yellow-500" :
                  "bg-red-500/10 text-red-500"
                )}>
                  {p.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateStatus(p.id, 'approved')} className="p-2 hover:bg-green-500/10 hover:text-green-500 rounded-lg transition-colors"><Check size={16} /></button>
                  <button onClick={() => updateStatus(p.id, 'rejected')} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"><X size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr><td colSpan={6} className="px-6 py-10 text-center text-secondary/40">No payments found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSetting, setEditingSetting] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('*').order('key');
    if (data) setSettings(data);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('settings').upsert(editingSetting);
    if (!error) {
      setEditingSetting(null);
      fetchSettings();
    }
  }

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="glass dark:glass-dark p-8 rounded-3xl">
        <h3 className="text-lg font-bold mb-6">General Settings</h3>
        <div className="grid gap-6">
          {settings.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl">
              <div>
                <p className="font-bold text-sm">{s.key}</p>
                <p className="text-xs text-secondary/40">{s.value}</p>
              </div>
              <button 
                onClick={() => setEditingSetting(s)}
                className="p-2 hover:text-primary transition-colors"
              >
                <Edit size={18} />
              </button>
            </div>
          ))}
          <button 
            onClick={() => setEditingSetting({ key: '', value: '', description: '' })}
            className="btn-gradient w-fit px-6 py-2 text-sm"
          >
            Add New Setting
          </button>
        </div>
      </div>

      {editingSetting && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingSetting(null)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-white dark:bg-dark-bg rounded-[2.5rem] p-8"
          >
            <h2 className="text-2xl font-bold mb-6">{editingSetting.id ? 'Edit' : 'Add'} Setting</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <Input label="Key" name="key" value={editingSetting.key} onChange={setEditingSetting} />
              <Input label="Value" name="value" value={editingSetting.value} onChange={setEditingSetting} />
              <Input label="Description" name="description" value={editingSetting.description} onChange={setEditingSetting} />
              <button className="w-full btn-gradient py-4 mt-4">Save Setting</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  }

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="glass dark:glass-dark rounded-3xl overflow-hidden overflow-x-auto">
      <table className="w-full text-left min-w-[600px]">
        <thead className="bg-black/5 dark:bg-white/5">
          <tr>
            <th className="px-6 py-4 text-sm font-bold">Name</th>
            <th className="px-6 py-4 text-sm font-bold">Email</th>
            <th className="px-6 py-4 text-sm font-bold">Role</th>
            <th className="px-6 py-4 text-sm font-bold">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-white/5">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 text-sm font-medium">{u.full_name}</td>
              <td className="px-6 py-4 text-sm">{u.email}</td>
              <td className="px-6 py-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  u.role === 'admin' ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                )}>
                  {u.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-secondary/40">{new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
