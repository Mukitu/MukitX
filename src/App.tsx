import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import { Hero, Stats, Services, Portfolio, Team, Testimonials, Footer } from './components/home/Sections';
import ThreeHero from './components/home/ThreeHero';
import CoursesPage from './pages/Courses';
import CourseDetailPage from './pages/CourseDetail';
import ProductDetailPage from './pages/ProductDetail';
import ProductsPage from './pages/Products';
import AdminDashboard from './pages/Admin';
import UserDashboard from './pages/Dashboard';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import { motion, AnimatePresence } from 'framer-motion';
import TeamPage from './pages/TeamPage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import { AuthProvider } from './contexts/AuthContext';
import Chatbot from './components/Chatbot';

import SEO from './components/SEO';

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SEO 
        title="Home" 
        description="MukitX - Your partner for web development, mobile apps, and digital solutions."
      />
      <div className="relative">
        <ThreeHero />
        <Hero />
      </div>
      <Stats />
      <Services />
      <Portfolio />
      <Team />
      <Testimonials />
    </motion.div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:id" element={<CourseDetailPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}
