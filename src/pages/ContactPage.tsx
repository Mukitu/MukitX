import SEO from '@/components/SEO';
import { useState } from 'react';

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Using mailto as a simple way to trigger the user's mail client
    window.location.href = `mailto:mukitunishat@gmail.com?subject=Contact from ${name}&body=Name: ${name}%0AEmail: ${email}%0A%0A${message}`;
    setStatus('Opening your mail client...');
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <SEO 
        title="Contact" 
        description="Contact MukitX for web development, mobile apps, and digital solutions."
      />
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12 mb-12">
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-4">Contact Information</h3>
          <p className="text-secondary/60 mb-2"><strong>Owner:</strong> Mukitu Islam Nishat</p>
          <p className="text-secondary/60 mb-2"><strong>Phone:</strong> +8809638-957563</p>
          <p className="text-secondary/60 mb-2"><strong>Location:</strong> Rajshahi, Bangladesh</p>
          <p className="text-secondary/60"><strong>Email:</strong> mukitunishat@gmail.com</p>
        </div>
        
        <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-4">
          <input name="name" type="text" placeholder="Your Name" required className="w-full p-3 rounded-lg border dark:border-white/10 bg-transparent" />
          <input name="email" type="email" placeholder="Your Email" required className="w-full p-3 rounded-lg border dark:border-white/10 bg-transparent" />
          <textarea name="message" placeholder="Your Message" required className="w-full p-3 rounded-lg border dark:border-white/10 bg-transparent h-32"></textarea>
          <button type="submit" className="w-full bg-primary text-white p-3 rounded-lg font-bold">Send Message</button>
          {status && <p className="text-center text-sm text-primary">{status}</p>}
        </form>
      </div>
    </div>
  );
}
