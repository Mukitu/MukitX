import SEO from '@/components/SEO';

export default function ServicesPage() {
  const services = [
    { title: "Web Development", description: "Custom web applications using modern tech stacks." },
    { title: "Mobile App Development", description: "Native and cross-platform mobile apps." },
    { title: "UI/UX Design", description: "User-centric design for better engagement." },
    { title: "Digital Marketing", description: "Data-driven marketing strategies." },
  ];
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <SEO 
        title="Services" 
        description="Explore our professional services including web development, mobile app development, UI/UX design, and digital marketing."
      />
      <h1 className="text-4xl font-bold mb-12 text-center">Our Services</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {services.map((s, i) => (
          <div key={i} className="glass p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
            <p className="text-secondary/60">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
