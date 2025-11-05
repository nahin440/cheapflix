import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Smartphone, 
  Download, 
  CreditCard, 
  LogOut, 
  Edit2, 
  Save, 
  X,
  CheckCircle,
  AlertCircle,
  Trash2,
  Calendar,
  DollarSign,
  MapPin,
  Globe,
  FileText
} from 'lucide-react';
import { authService, userService } from '../services';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setEditForm({
      full_name: currentUser.full_name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      address: currentUser.address || '',
      country: currentUser.country || '',
      currency_code: currentUser.currency_code || 'GBP'
    });
    fetchUserData(currentUser.user_id);
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      const [devicesRes, downloadsRes, paymentsRes] = await Promise.all([
        userService.getUserDevices(userId),
        userService.getUserDownloads(userId),
        userService.getUserPayments(userId)
      ]);

      setDevices(devicesRes.devices || []);
      setDownloads(downloadsRes.downloads || []);
      
      // Remove duplicate payments based on payment_id
      const uniquePayments = (paymentsRes.payments || []).reduce((acc, current) => {
        const x = acc.find(item => item.payment_id === current.payment_id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      
      setPayments(uniquePayments);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      showMessage('error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form when canceling
      setEditForm({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        country: user.country || '',
        currency_code: user.currency_code || 'GBP'
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    // Validate required fields
    if (!editForm.full_name.trim()) {
      showMessage('error', 'Full name is required');
      return;
    }

    try {
      setSaveLoading(true);
      const response = await userService.updateProfile(user.user_id, editForm);
      
      if (response.success) {
        // Update local user data
        const updatedUser = { ...user, ...editForm };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setIsEditing(false);
        showMessage('success', response.message || 'Profile updated successfully!');
      } else {
        showMessage('error', response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      showMessage('error', error.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId) => {
    try {
      if (!user) return;
      
      await userService.removeDevice(user.user_id, deviceId);
      setDevices(devices.filter(device => device.device_id !== deviceId));
      showMessage('success', 'Device removed successfully');
    } catch (error) {
      console.error('Failed to remove device:', error);
      showMessage('error', error.message || 'Failed to remove device');
    }
  };

  const handleDownloadInvoice = async (payment) => {
    try {
      // Create invoice content
      const invoiceContent = generateInvoiceContent(payment, user);
      
      // Create blob and download
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${payment.payment_id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showMessage('success', 'Invoice downloaded successfully');
    } catch (error) {
      console.error('Failed to download invoice:', error);
      showMessage('error', 'Failed to download invoice');
    }
  };

  const generateInvoiceContent = (payment, user) => {
    const invoiceDate = new Date().toLocaleDateString();
    const paymentDate = new Date(payment.transaction_date).toLocaleDateString();
    
    return `
CHEAPFLIX - INVOICE
===================

Invoice Number: INV-${payment.payment_id}
Invoice Date: ${invoiceDate}
Payment Date: ${paymentDate}

BILL TO:
${user.full_name}
${user.email}
${user.phone ? `Phone: ${user.phone}` : ''}
${user.address ? `Address: ${user.address}` : ''}
${user.country ? `Country: ${user.country}` : ''}

PAYMENT DETAILS:
----------------
Description: ${payment.level_name} Subscription
Payment Method: ${payment.payment_method || 'Credit Card'}
Card Last 4: ${payment.card_last4 ? `**** ${payment.card_last4}` : 'N/A'}
Transaction ID: ${payment.payment_id}

AMOUNT:
-------
Subtotal: ${payment.currency_code} ${payment.amount}
Tax: ${payment.currency_code} 0.00
Total: ${payment.currency_code} ${payment.amount}

STATUS: PAID

Thank you for your business!
CheapFlix Streaming Service
support@cheapflix.com
www.cheapflix.com

Terms & Conditions:
- This is a digital invoice
- Payment is non-refundable
- Subscription auto-renews unless cancelled
    `;
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const getDeviceLimitInfo = () => {
    if (!user) return null;
    
    let maxDevices = 1;
    if (user.current_subscription_id === 3) {
      maxDevices = 3;
    }
    
    return {
      maxDevices,
      currentDevices: devices.length,
      canAddMore: devices.length < maxDevices
    };
  };

  const getSubscriptionColor = (subscription) => {
    switch (subscription?.toLowerCase()) {
      case 'premium': return 'from-purple-500 to-pink-500';
      case 'standard': return 'from-blue-500 to-cyan-500';
      case 'basic': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  // Currency options
  const currencyOptions = [
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'BDT', name: 'BDT (৳)' },
  ];

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white text-xl font-light"
          >
            Loading your profile...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const deviceInfo = getDeviceLimitInfo();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'payments', label: 'Payments', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 pt-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 mb-8 border border-gray-700/50 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-400 text-lg">Manage your account and preferences</p>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05, backgroundColor: "#DC2626" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg mt-4 md:mt-0"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Message Alert */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-2xl mb-6 flex items-center space-x-3 ${
                message.type === 'success' 
                  ? 'bg-green-600/20 border border-green-500/50 text-green-400' 
                  : 'bg-red-600/20 border border-red-500/50 text-red-400'
              }`}
            >
              {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-8 scrollbar-hide">
          <div className="flex space-x-1 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Profile Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && user && (
            <motion.div
              key="profile"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <User className="mr-3" size={24} />
                  Personal Information
                </h2>
                <motion.button
                  onClick={handleEditToggle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    isEditing 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                      : 'bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white shadow-lg'
                  }`}
                >
                  {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </motion.button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Personal Info */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Personal Details</h3>
                  
                  {/* Full Name - Required */}
                  <div>
                    <label className="block text-gray-400 mb-3 font-medium">
                      Full Name *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.full_name}
                        onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter your full name"
                        required
                      />
                    ) : (
                      <p className="text-white text-lg bg-gray-700/30 rounded-xl px-4 py-3 backdrop-blur-sm">{user.full_name}</p>
                    )}
                  </div>

                  {/* Email - Read Only */}
                  <div>
                    <label className="block text-gray-400 mb-3 font-medium">Email</label>
                    <p className="text-white text-lg bg-gray-700/30 rounded-xl px-4 py-3 backdrop-blur-sm opacity-80">
                      {user.email}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-400 mb-3 font-medium">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone || ''}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-white text-lg bg-gray-700/30 rounded-xl px-4 py-3 backdrop-blur-sm">
                        {user.phone || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address & Preferences */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Location & Preferences</h3>

                  {/* Address */}
                  <div>
                    <label className="block text-gray-400 mb-3 font-medium flex items-center">
                      <MapPin size={16} className="mr-2" />
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editForm.address || ''}
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                        rows="3"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm resize-none"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <p className="text-white text-lg bg-gray-700/30 rounded-xl px-4 py-3 backdrop-blur-sm">
                        {user.address || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-gray-400 mb-3 font-medium flex items-center">
                      <Globe size={16} className="mr-2" />
                      Country
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.country || ''}
                        onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter your country"
                      />
                    ) : (
                      <p className="text-white text-lg bg-gray-700/30 rounded-xl px-4 py-3 backdrop-blur-sm">
                        {user.country || 'Not provided'}
                      </p>
                    )}
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-gray-400 mb-3 font-medium">Currency</label>
                    {isEditing ? (
                      <select
                        value={editForm.currency_code}
                        onChange={(e) => setEditForm({...editForm, currency_code: e.target.value})}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm"
                      >
                        {currencyOptions.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-white text-lg bg-gray-700/30 rounded-xl px-4 py-3 backdrop-blur-sm">
                        {currencyOptions.find(c => c.code === user.currency_code)?.name || 'GBP - British Pound (£)'}
                      </p>
                    )}
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <motion.button
                      onClick={handleSaveProfile}
                      disabled={saveLoading || !editForm.full_name.trim()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {saveLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <Save size={20} />
                      )}
                      <span>{saveLoading ? 'Saving...' : 'Save Changes'}</span>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Subscription Info - Moved to bottom */}
              <div className="mt-8 pt-8 border-t border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-6">Subscription Details</h3>
                <div className={`bg-gradient-to-r ${getSubscriptionColor(user.current_subscription)} rounded-2xl p-6 text-white shadow-2xl`}>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-2xl font-bold">{user.current_subscription || 'Free Tier'}</h4>
                    <CheckCircle size={24} className="text-green-300" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <p className="flex items-center space-x-2">
                        <CheckCircle size={18} className="text-green-300" />
                        <span>{user.max_devices || 1} Simultaneous Device{user.max_devices > 1 ? 's' : ''}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        {user.can_download ? (
                          <>
                            <CheckCircle size={18} className="text-green-300" />
                            <span>Download Movies Enabled</span>
                          </>
                        ) : (
                          <>
                            <X size={18} className="text-red-300" />
                            <span>Download Movies Disabled</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="flex items-center space-x-2">
                        <CheckCircle size={18} className="text-green-300" />
                        <span>HD Streaming Quality</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <CheckCircle size={18} className="text-green-300" />
                        <span>Cancel Anytime</span>
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => navigate('/subscription')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-6 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold text-white border border-white/20 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Manage Subscription</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Devices Tab */}
          {activeTab === 'devices' && (
            <motion.div
              key="devices"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Smartphone className="mr-3" size={24} />
                Registered Devices
              </h2>
              
              {/* Device Limit Info */}
              {deviceInfo && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-2xl mb-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Device Usage</h3>
                      <p className="text-blue-100">
                        {deviceInfo.currentDevices} of {deviceInfo.maxDevices} devices active
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{deviceInfo.currentDevices}/{deviceInfo.maxDevices}</p>
                      <p className="text-blue-100 text-sm">
                        {deviceInfo.canAddMore 
                          ? `${deviceInfo.maxDevices - deviceInfo.currentDevices} slots available`
                          : 'Limit reached'
                        }
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {devices.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Smartphone size={64} className="text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-xl">No devices registered yet</p>
                </motion.div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {devices.map((device, index) => (
                    <motion.div
                      key={device.device_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg mb-1">{device.device_name}</h3>
                          <p className="text-gray-400 text-sm">ID: {device.device_id}</p>
                        </div>
                        <motion.button 
                          onClick={() => handleRemoveDevice(device.device_id)}
                          whileHover={{ scale: 1.1, color: "#EF4444" }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-red-400 transition-colors p-2"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar size={14} className="mr-2" />
                        Last login: {new Date(device.last_login).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Downloads Tab */}
          {activeTab === 'downloads' && (
            <motion.div
              key="downloads"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Download className="mr-3" size={24} />
                Download History
              </h2>

              {downloads.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Download size={64} className="text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-xl">No downloads yet</p>
                  <p className="text-gray-500 mt-2">Downloaded movies will appear here</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {downloads.map((download, index) => (
                    <motion.div
                      key={download.download_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-white font-bold text-lg mb-1">{download.title}</h3>
                          <p className="text-gray-400 text-sm flex items-center">
                            <Calendar size={14} className="mr-2" />
                            Downloaded on {new Date(download.download_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                            Completed
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <CreditCard className="mr-3" size={24} />
                Payment History
              </h2>

              {payments.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <CreditCard size={64} className="text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-xl">No payment history</p>
                  <p className="text-gray-500 mt-2">Your subscription payments will appear here</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment, index) => (
                    <motion.div
                      key={payment.payment_id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg mb-1">{payment.level_name}</h3>
                          <p className="text-gray-400 text-sm flex items-center">
                            <Calendar size={14} className="mr-2" />
                            {new Date(payment.transaction_date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-400 text-sm capitalize mt-1">
                            {payment.payment_method} • {payment.card_last4 ? `**** ${payment.card_last4}` : ''}
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            Transaction ID: {payment.payment_id}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-white font-bold text-xl flex items-center justify-end">
                            <DollarSign size={20} className="mr-1" />
                            {payment.amount}
                          </p>
                          <p className="text-gray-400 text-sm">{payment.currency_code}</p>
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium mt-2 inline-block">
                            Completed
                          </span>
                          <motion.button
                            onClick={() => handleDownloadInvoice(payment)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white text-sm font-medium mt-3 transition-all duration-200"
                          >
                            <FileText size={16} />
                            <span>Invoice</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;