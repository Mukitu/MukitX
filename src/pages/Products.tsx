import { motion } from 'framer-motion';
import { ShoppingCart, Download, Star, Loader2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Digital <span className="text-primary">Marketplace</span>
          </motion.h1>
          <p className="text-secondary/60 dark:text-white/60 max-w-2xl mx-auto mb-10">
            Premium software, templates, and tools to accelerate your development workflow. High-quality source code and SaaS scripts.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group glass dark:glass-dark rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all border-transparent hover:border-primary/20"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={product.image_url || 'https://picsum.photos/seed/product/800/600'} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <Link to={`/products/${product.id}`} className="w-full btn-gradient flex items-center justify-center gap-2">
                      <ShoppingCart size={18} /> View Details
                    </Link>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{product.title}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                      <Star size={14} fill="currentColor" /> 5.0
                    </div>
                  </div>
                  <p className="text-secondary/60 dark:text-white/60 text-sm mb-6 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t dark:border-white/5">
                    <div className="text-2xl font-bold text-primary">{formatCurrency(product.price)}</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-secondary/40 dark:text-white/40">
                      <Download size={14} /> Sales
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20 text-secondary/40">No products found.</div>
        )}
      </div>
    </div>
  );
}
