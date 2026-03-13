import SEO from '@/components/SEO';
import { Services } from '@/components/home/Sections';

export default function ServicesPage() {
  return (
    <div className="pt-20 pb-12">
      <SEO 
        title="Services - MukitX" 
        description="Explore our professional services including website design, app development, brand identity, and more."
      />
      <Services />
    </div>
  );
}
