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
  { icon: MessageSquare, label: 'Blog', id: 'blog' },
  { icon: MessageSquare, label: 'Testimonials', id: 'testimonials' },
  { icon: UserPlus, label: 'Team', id: 'team' },
  { icon: BookOpen, label: 'Videos', id: 'course_videos' },
  { icon: BookOpen, label: 'Live', id: 'live_classes' },
  { icon: CreditCard, label: 'Payments', id: 'payments' },
  { icon: Users, label: 'Users', id: 'users' },
  { icon: Settings, label: 'Settings', id: 'settings' },
]; // Sidebar items defined here

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
              {activeTab === 'blog' && <DataManagementTab table="blog_posts" onEdit={handleEdit} />}
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
      case 'blog': table = 'blog_posts'; break;
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
            <Input label="Instructor" name="instructor" value={formData.instructor} onChange={setFormData} />
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
            <Input label="Project Link" name="link" value={formData.link} onChange={setFormData} />
          </>
        );
      case 'blog':
        return (
          <>
            <Input label="Title" name="title" value={formData.title} onChange={setFormData} />
            <Input label="Content" name="content" value={formData.content} isTextArea onChange={setFormData} />
            <Input label="Image URL" name="image_url" value={formData.image_url} onChange={setFormData} />
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
            <Input label="X (Twitter) Link" name="x_link" value={formData.x_link} onChange={setFormData} />
            <Input label="GitHub Link" name="github_link" value={formData.github_link} onChange={setFormData} />
            <Input label="LinkedIn Link" name="linkedin_link" value={formData.linkedin_link} onChange={setFormData} />
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

  async function handleDeleteAll() {
    if (!confirm('Are you sure you want to delete ALL testimonials?')) return;
    setLoading(true);
    const { error } = await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (!error) fetchData();
    else {
      alert(error.message);
      setLoading(false);
    }
  }

  async function handleBulkAdd() {
    if (!confirm('Are you sure you want to add the provided testimonials?')) return;
    setLoading(true);
    const testimonials = [
      { name: "Robert Harrison", profession: "CEO, Nexa Digital", country: "Web Development", feedback: "The website is incredibly fast. They used the latest tech stack which significantly improved our SEO rankings." },
      { name: "Sarah Miller", profession: "Founder, Bloom Boutique", country: "Web Development", feedback: "Exceptional work! My e-commerce site is now fully responsive and handles heavy traffic without any lag." },
      { name: "David Thompson", profession: "Marketing Director, Prime Global", country: "Web Development", feedback: "Professional, clean code, and delivered on time. They turned our complex requirements into a sleek website." },
      { name: "Elena Volkov", profession: "Product Manager, TechStream", country: "Web Development", feedback: "Their attention to detail in frontend development is unmatched. Highly recommended for any web project." },
      { name: "Mark Fletcher", profession: "Owner, MF Logistics", country: "Web Development", feedback: "Simple, clean, and effective. The new site has doubled our online inquiries within a month." },
      { name: "Jessica Lee", profession: "Co-Founder, Artify", country: "Web Development", feedback: "The backend is very easy to manage, and the design is exactly what we envisioned for our brand." },
      { name: "Andrew Cook", profession: "Director, Insight Media", country: "Web Development", feedback: "Fast turnaround and great communication throughout the development process." },
      { name: "Monica Geller", profession: "Lead Developer, Kitchen Pro", country: "Web Development", feedback: "Great technical skills. The site structure is perfectly optimized for both users and search engines." },
      { name: "Jason Wright", profession: "Founder, CloudSettle", country: "SaaS Development", feedback: "The multi-tenant architecture they built is robust and scalable. Exactly what our SaaS needed." },
      { name: "Kevin O'Sullivan", profession: "CTO, FinFlow", country: "SaaS Development", feedback: "Impressed by their understanding of subscription logic and data security in SaaS development." },
      { name: "Linda Chen", profession: "Operations Head, TaskLink", country: "SaaS Development", feedback: "Our platform now handles thousands of concurrent users with zero downtime. Brilliant engineering." },
      { name: "Michael Vance", profession: "CEO, Streamline ERP", country: "SaaS Development", feedback: "They built our MVP in record time without compromising on quality or security." },
      { name: "Sophie Turner", profession: "Product Owner, HR Pulse", country: "SaaS Development", feedback: "Highly skilled in cloud integrations. The dashboard they designed is both powerful and easy to use." },
      { name: "Ryan Reynolds", profession: "Founder, Creative CRM", country: "SaaS Development", feedback: "The most reliable partner for long-term SaaS maintenance and feature development." },
      { name: "Alice Morgan", profession: "Manager, EduCloud", country: "SaaS Development", feedback: "Their modular approach to coding makes it very easy for us to scale in the future." },
      { name: "Paul Walker", profession: "DevOps Engineer, SecureVault", country: "SaaS Development", feedback: "Top-tier SaaS solutions. The automated billing system works flawlessly." },
      { name: "Chloe Bennett", profession: "Brand Lead, Pixel Creative", country: "UI UX Design", feedback: "The designs are modern, clean, and very intuitive. Our users love the new interface." },
      { name: "Daniel Smith", profession: "Founder, Lux Decor", country: "UI UX Design", feedback: "They have a great eye for aesthetics. The UI design perfectly matches our premium brand identity." },
      { name: "Megan Fox", profession: "Creative Director, Aura App", country: "UI UX Design", feedback: "User experience was their priority, and it shows. Our bounce rate has dropped significantly." },
      { name: "Liam Neeson", profession: "CEO, SafeStay", country: "UI UX Design", feedback: "Professional and minimalist design. They made a complex app look very simple to navigate." },
      { name: "Olivia Wilde", profession: "Marketing Head, GreenTech", country: "UI UX Design", feedback: "The wireframes were detailed, and the final design exceeded our expectations in every way." },
      { name: "Chris Evans", profession: "Product Manager, Shield IT", country: "UI UX Design", feedback: "Fantastic color palettes and typography. They truly understand modern design trends." },
      { name: "Natalie Hills", profession: "Owner, EcoShop", country: "UI UX Design", feedback: "Every pixel was thoughtfully placed. The mobile UI is especially impressive." },
      { name: "Tom Hardy", profession: "Director, Venom Agency", country: "UI UX Design", feedback: "Creative and innovative. They helped us stand out from our competitors with a unique look." },
      { name: "Steve Jobs", profession: "Founder, ConnectApp", country: "Mobile App Development", feedback: "The React Native app they built is incredibly smooth. It feels like a native iOS/Android app." },
      { name: "Will Smith", profession: "CEO, Fresh Delivery", country: "Mobile App Development", feedback: "A single codebase for both platforms saved us a lot of time and money. Great performance." },
      { name: "Scarlett Johnson", profession: "Director, BlackWidow Media", country: "Mobile App Development", feedback: "High-performance app with zero bugs. The integration with our backend was seamless." },
      { name: "Tom Holland", profession: "App Developer, WebSlinger", country: "Mobile App Development", feedback: "Clean architecture and smooth animations. One of the best mobile dev teams I've worked with." },
      { name: "Zendaya Coleman", profession: "Founder, Euphoria", country: "Mobile App Development", feedback: "They took care of everything from the UI design to the App Store submission process." },
      { name: "Robert Downey", profession: "Investor, Stark Ventures", country: "Mobile App Development", feedback: "Reliable mobile solutions. The app is fast, secure, and very easy to navigate." },
      { name: "Elizabeth Olsen", profession: "Founder, Visionary Tech", country: "Mobile App Development", feedback: "The offline mode works perfectly. It's exactly what our users in remote areas needed." },
      { name: "Benedict C.", profession: "Manager, Strange Solutions", country: "Mobile App Development", feedback: "Complex features were implemented effortlessly. Great communication throughout the sprint." },
      { name: "Brian Hall", profession: "Manager, AutoFlow", country: "Automation Tools", feedback: "Their custom automation scripts are saving us over 15 hours of manual work every week." },
      { name: "Jeffery Dean", profession: "Operations Head, Logistics Pro", country: "Automation Tools", feedback: "The data scraping and reporting tool they built is a game-changer for our business." },
      { name: "Billie Eilish", profession: "Founder, Creative Automation", country: "Automation Tools", feedback: "Simple tools that solved our most repetitive problems. Highly efficient service." },
      { name: "Lawrence Page", profession: "CTO, Searchly", country: "Automation Tools", feedback: "The automated email workflow has improved our response time by 80%." },
      { name: "Sheryl White", profession: "Director, DataLink", country: "Automation Tools", feedback: "Reliable automation that integrated perfectly with our existing Google Workspace." },
      { name: "Samuel Jackson", profession: "Owner, SJ Enterprises", country: "Automation Tools", feedback: "Professional scripts with clear documentation. Very easy to maintain and scale." },
      { name: "Grace Hopper", profession: "Software Architect, G-Tech", country: "Automation Tools", feedback: "Smart solutions for high-volume tasks. The ROI was visible within the first month." },
      { name: "Timothy Cook", profession: "Operations Manager, FruitCo", country: "Automation Tools", feedback: "They simplified our complex reporting process with a very elegant automation tool." },
      { name: "Gary V.", profession: "Founder, Media Labs", country: "Digital Marketing", feedback: "Our social media engagement grew by 200% after they took over our digital strategy." },
      { name: "Neil P.", profession: "Marketing Consultant", country: "Digital Marketing", feedback: "Data-driven SEO that actually works. We are now ranking on the first page for key terms." },
      { name: "Arianna H.", profession: "CEO, Thrive Digital", country: "Digital Marketing", feedback: "Great content strategy and targeted ads. Our lead generation has never been better." },
      { name: "Seth G.", profession: "Brand Strategist", country: "Digital Marketing", feedback: "They know how to reach the right audience. Very creative and effective campaigns." },
      { name: "Ann Handley", profession: "Director, Content Marketing", country: "Digital Marketing", feedback: "Professional ad management with a clear focus on ROI. Highly recommended for growth." },
      { name: "Brian Halligan", profession: "Founder, Inbound Inc.", country: "Digital Marketing", feedback: "Their PPC strategy helped us scale our sales in a very competitive international market." },
      { name: "Rand Fishkin", profession: "CEO, SparkToro", country: "Digital Marketing", feedback: "Excellent technical SEO audit and implementation. Our organic traffic is up by 50%." },
      { name: "Mari Smith", profession: "Social Specialist", country: "Digital Marketing", feedback: "Engaging post designs and strategic ad placement. Real growth, real results." },
      { name: "Ryan Deiss", profession: "Founder, Marketing Pros", country: "Digital Marketing", feedback: "They focus on conversions, not just clicks. A very professional and results-driven team." },
      { name: "Guy Kawasaki", profession: "Chief Evangelist", country: "Digital Marketing", feedback: "Strategic branding and growth plans that work perfectly for global expansion." }
    ];
    
    // Shuffle the array
    for (let i = testimonials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [testimonials[i], testimonials[j]] = [testimonials[j], testimonials[i]];
    }

    const { error } = await supabase.from('testimonials').insert(testimonials);
    if (!error) fetchData();
    else {
      alert(error.message);
      setLoading(false);
    }
  }

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div>
      {table === 'testimonials' && (
        <div className="flex gap-4 mb-6">
          <button onClick={handleBulkAdd} className="btn-gradient text-sm py-2 px-4">
            Add Realistic Testimonials
          </button>
          <button onClick={handleDeleteAll} className="bg-red-500 text-white text-sm py-2 px-4 rounded-lg hover:bg-red-600">
            Delete All Testimonials
          </button>
        </div>
      )}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.map((item) => (
        <div key={item.id} className="glass dark:glass-dark p-6 rounded-3xl group relative">
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(item)} className="p-2 bg-white dark:bg-black rounded-lg shadow-lg text-secondary/60 hover:text-primary"><Edit size={16} /></button>
            <button onClick={() => handleDelete(item.id)} className="p-2 bg-white dark:bg-black rounded-lg shadow-lg text-secondary/60 hover:text-red-500"><Trash2 size={16} /></button>
          </div>
          {table === 'testimonials' ? (
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-white/10 mb-4 flex items-center justify-center text-2xl font-bold text-secondary/40">
              {item.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="aspect-video rounded-2xl bg-slate-100 dark:bg-white/5 mb-4 overflow-hidden">
              <img 
                src={item.thumbnail_url || item.image_url || item.image || item.photo || 'https://picsum.photos/seed/placeholder/400/225'} 
                className="w-full h-full object-cover"
                alt=""
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <h4 className="font-bold mb-1 truncate">{item.title || item.name}</h4>
          <p className="text-xs text-secondary/40 dark:text-white/40 line-clamp-2">{item.description || item.feedback || item.bio || item.result}</p>
        </div>
      ))}
      {data.length === 0 && (
        <div className="col-span-full py-20 text-center text-secondary/40">No items found. Click "Add New" to get started.</div>
      )}
    </div>
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
