import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home,
  Film,
  Crown,
  User,
  HelpCircle,
  Phone,
  Lightbulb,
  BarChart3,
  FileText,
  Shield,
  Cookie,
  Clapperboard,
  Mail,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const socialLinks = [
    { name: 'Twitter', icon: 'Twitter', url: '#' },
    { name: 'Facebook', icon: 'Facebook', url: '#' },
    { name: 'Instagram', icon: 'Instagram', url: '#' },
    { name: 'YouTube', icon: 'Youtube', url: '#' }
  ];

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
      className="bg-gradient-to-b from-gray-900 to-gray-800 border-t border-gray-700/50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2%, transparent 0%), 
                           radial-gradient(circle at 75px 75px, rgba(255,255,255,0.3) 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="container w-11/12 mx-auto px-4 py-12 relative z-10">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <motion.div 
              className="flex items-center mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link to="/">
                <img 
                  src="/logo.png" 
                  alt="CheapFlix"
                  className="h-16 w-48 object-contain"
                />
              </Link>
            </motion.div>
            <motion.p 
              variants={itemVariants}
              className="text-gray-400 mb-6 leading-relaxed"
            >
              Your ultimate destination for unlimited entertainment. Stream thousands of movies and shows in stunning quality with flexible subscription plans.
            </motion.p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { path: '/', label: 'Home', icon: Home },
                { path: '/movies', label: 'Movies', icon: Film },
                { path: '/subscription', label: 'Subscription', icon: Crown },
                { path: '/profile', label: 'My Profile', icon: User }
              ].map((link, index) => (
                <motion.li key={link.path} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-red-400 transition-all duration-300 flex items-center group"
                  >
                    <link.icon size={16} className="mr-3" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Help Center', icon: HelpCircle },
                { label: 'Contact Us', icon: Phone },
                { label: 'FAQ', icon: Lightbulb },
                { label: 'System Status', icon: BarChart3 }
              ].map((item, index) => (
                <motion.li key={item.label} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-purple-400 transition-all duration-300 flex items-center group"
                  >
                    <item.icon size={16} className="mr-2" />
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal & Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Legal & Info
            </h4>
            <ul className="space-y-3 mb-6">
              {[
                { label: 'Terms of Service', icon: FileText },
                { label: 'Privacy Policy', icon: Shield },
                { label: 'Cookie Policy', icon: Cookie },
                { label: 'Content Policy', icon: Clapperboard }
              ].map((item, index) => (
                <motion.li key={item.label} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-blue-400 transition-all duration-300 flex items-center group"
                  >
                    <item.icon size={16} className="mr-2" />
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            
            {/* Contact Info */}
            <motion.div 
              className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-400 text-sm mb-2 flex items-center">
                <Mail size={16} className="mr-2" />
                support@cheapflix.com
              </p>
              <p className="text-gray-400 text-sm flex items-center">
                <Phone size={16} className="mr-2" />
                24/7 Customer Support
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-gray-700/50 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p className="text-gray-400 text-center md:text-left flex items-center">
            &copy; {currentYear} CheapFlix. All rights reserved. 
            <span className="flex items-center mx-2">
              Made with <Heart size={16} className="mx-1 text-red-400" /> for movie lovers.
            </span>
          </p>
          
          <motion.div 
            className="flex items-center space-x-6 text-sm text-gray-500"
            whileHover={{ scale: 1.05 }}
          >
            <span className="flex items-center">
              <Clapperboard size={16} className="mr-1" />
              Unlimited Entertainment
            </span>
            <span className="flex items-center">
              <BarChart3 size={16} className="mr-1" />
              Lightning Fast
            </span>
            <span className="flex items-center">
              <Shield size={16} className="mr-1" />
              Secure Streaming
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;