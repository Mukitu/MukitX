import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { 
  Globe, Cpu, Layout, Smartphone, Zap, BarChart, 
  CheckCircle, ArrowRight, Star, Quote, Github, Twitter, Linkedin, Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center z-10">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6"
        >
          Building Powerful <span className="text-primary">Digital Solutions</span> <br />
          & Teaching Future Tech Skills
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl text-secondary/70 dark:text-white/70 max-w-2xl mx-auto mb-10"
        >
          MukitX helps startups, businesses and students grow using modern technology solutions and high-quality education.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/courses" className="btn-gradient text-lg px-8 py-4 w-full sm:w-auto text-center">
            Explore Courses
          </Link>
          <a href="#portfolio" className="px-8 py-4 rounded-full border border-secondary/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all font-medium w-full sm:w-auto text-center">
            View Our Work
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export function Stats() {
  const stats = [
    { label: "Projects Completed", value: 150, suffix: "+" },
    { label: "Professional Developers", value: 20, suffix: "+" },
    { label: "Students", value: 10000, suffix: "+" },
    { label: "Digital Products", value: 25, suffix: "+" },
  ];

  return (
    <section className="py-20 bg-white dark:bg-dark-bg/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="text-secondary/60 dark:text-white/60 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <h2 ref={ref} className="text-4xl md:text-5xl font-bold text-primary mb-2">
      {count.toLocaleString()}{suffix}
    </h2>
  );
}

export function Services() {
  const services = [
    { icon: Globe, title: "Web Development", desc: "Modern, fast, and SEO-friendly websites built with the latest technologies." },
    { icon: Cpu, title: "SaaS Development", desc: "Scalable multi-tenant software solutions for your business needs." },
    { icon: Layout, title: "UI UX Design", desc: "Apple-level premium designs that focus on user experience and aesthetics." },
    { icon: Smartphone, title: "Mobile App Development", desc: "High-performance iOS and Android apps using React Native." },
    { icon: Zap, title: "Automation Tools", desc: "Custom scripts and tools to automate your repetitive business tasks." },
    { icon: BarChart, title: "Digital Marketing", desc: "Data-driven strategies to grow your online presence and sales." },
  ];

  return (
    <section id="services" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premium Services</h2>
          <p className="text-secondary/60 dark:text-white/60 max-w-2xl mx-auto">
            We provide end-to-end digital solutions to help your business thrive in the modern tech landscape.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="glass dark:glass-dark p-8 rounded-3xl hover:border-primary/50 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                <service.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-secondary/60 dark:text-white/60 leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Portfolio() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('portfolio_projects').select('*').limit(4).then(({ data }) => {
      if (data) setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <section id="portfolio" className="py-24 bg-white dark:bg-dark-bg/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Selected Works</h2>
            <p className="text-secondary/60 dark:text-white/60 max-w-xl">
              A showcase of our most impactful projects for startups and global brands.
            </p>
          </div>
          <button className="flex items-center gap-2 text-primary font-bold group">
            View All Projects <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {projects.map((project, i) => (
              <motion.div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-3xl mb-6">
                  <img 
                    src={project.image || 'https://picsum.photos/seed/portfolio/800/450'} 
                    alt={project.title}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {project.category && (
                      <span className="px-3 py-1 bg-white/80 backdrop-blur-md text-xs font-bold rounded-full">
                        {project.category}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-secondary/60 dark:text-white/60 mb-4 line-clamp-2">{project.result}</p>
                <div className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View Case Study <ArrowRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Team() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('team_members').select('*').limit(4).then(({ data }) => {
      if (data) setMembers(data);
      setLoading(false);
    });
  }, []);

  return (
    <section id="team" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Experts</h2>
          <p className="text-secondary/60 dark:text-white/60 max-w-2xl mx-auto">
            The talented individuals behind MukitX who make the magic happen.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.map((member, i) => (
              <div key={i} className="group">
                <div className="relative overflow-hidden rounded-3xl mb-4">
                  <img 
                    src={member.photo || 'https://picsum.photos/seed/team/400/400'} 
                    alt={member.name}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="flex gap-4">
                      <a href="#" className="text-white hover:text-primary transition-colors"><Twitter size={20} /></a>
                      <a href="#" className="text-white hover:text-primary transition-colors"><Linkedin size={20} /></a>
                      <a href="#" className="text-white hover:text-primary transition-colors"><Github size={20} /></a>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-primary font-medium text-sm mb-2">{member.position}</p>
                <p className="text-secondary/60 dark:text-white/60 text-sm line-clamp-2">{member.bio}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Testimonials() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('testimonials').select('*').limit(20).then(({ data }) => {
      if (data) setItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-dark-bg/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Trusted by Thousands</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
      ) : (
        <div className="flex flex-col gap-8">
          <Marquee items={items} speed={40} />
        </div>
      )}
    </section>
  );
}

function Marquee({ items, speed, reverse = false }: { items: any[], speed: number, reverse?: boolean }) {
  if (items.length === 0) return null;
  
  return (
    <div className="flex overflow-hidden select-none">
      <motion.div 
        animate={{ x: reverse ? [0, 1000] : [0, -1000] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex gap-6 whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="glass dark:glass-dark p-6 rounded-2xl w-[350px] shrink-0">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={item.photo || 'https://picsum.photos/seed/avatar/100/100'} 
                alt={item.name} 
                className="w-12 h-12 rounded-full object-cover" 
                referrerPolicy="no-referrer" 
              />
              <div>
                <h4 className="font-bold text-sm">{item.name}</h4>
                <p className="text-xs text-secondary/60 dark:text-white/60">{item.profession}</p>
              </div>
              <div className="ml-auto flex text-yellow-400">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={12} fill="currentColor" />
                ))}
              </div>
            </div>
            <p className="text-sm text-secondary/80 dark:text-white/80 italic leading-relaxed whitespace-normal line-clamp-3">
              "{item.feedback}"
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="py-20 border-t dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-primary flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">M</div>
              MukitX
            </Link>
            <p className="text-secondary/60 dark:text-white/60 max-w-sm mb-8">
              Building the future of tech with premium digital solutions and world-class education. Join us on our mission to empower the next generation of developers.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full border dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Linkedin size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full border dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Github size={18} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-secondary/60 dark:text-white/60">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
              <li><a href="#portfolio" className="hover:text-primary transition-colors">Portfolio</a></li>
              <li><Link to="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-secondary/60 dark:text-white/60">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t dark:border-white/10 text-center text-sm text-secondary/40 dark:text-white/40">
          © {new Date().getFullYear()} MukitX. All rights reserved. Built with passion by Mukit Ahmed.
        </div>
      </div>
    </footer>
  );
}
