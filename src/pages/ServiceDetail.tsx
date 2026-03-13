import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchService() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (data) {
        setService(data);
      }
      setLoading(false);
    }
    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-3xl font-bold mb-4">Service Not Found</h2>
        <Link to="/" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  const IconComponent = (Icons as any)[service.icon] || Icons.Globe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-24"
    >
      <SEO 
        title={`${service.title} - MukitX`} 
        description={service.short_description}
      />
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-12 font-medium">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <div className="glass dark:glass-dark p-8 md:p-16 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8">
              <IconComponent size={40} />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{service.title}</h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {service.full_description.split('\n').map((paragraph: string, i: number) => (
                <p key={i} className="mb-6 text-secondary/80 dark:text-white/80 leading-relaxed text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
