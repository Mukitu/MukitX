import { motion } from 'framer-motion';
import { Search, Filter, Clock, Users, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { formatCurrency, cn } from '@/lib/utils';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (data) setCourses(data);
    setLoading(false);
  }

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Master the <span className="text-primary">Future of Tech</span>
          </motion.h1>
          <p className="text-secondary/60 dark:text-white/60 max-w-2xl mx-auto mb-10">
            High-quality courses designed to take you from beginner to professional. Learn from industry experts and build real-world projects.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={20} />
              <input 
                type="text" 
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border dark:border-white/10 bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-4 rounded-2xl border dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all font-medium">
              <Filter size={20} /> Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group glass dark:glass-dark rounded-3xl overflow-hidden hover:border-primary/50 transition-all"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={course.thumbnail_url || 'https://picsum.photos/seed/course/800/450'} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                      course.type === 'live' ? "bg-red-500 text-white" : "bg-primary text-white"
                    )}>
                      {course.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-secondary/60 dark:text-white/60 mb-3">
                    <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
                    <span className="flex items-center gap-1"><Users size={14} /> Students</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-sm text-secondary/60 dark:text-white/60 mb-6 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">{formatCurrency(course.price)}</div>
                    <Link to={`/courses/${course.id}`} className="flex items-center gap-2 text-sm font-bold group/btn">
                      Details <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-20 text-secondary/40">No courses found matching your search.</div>
        )}
      </div>
    </div>
  );
}
