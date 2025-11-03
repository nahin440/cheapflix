import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../services';
import DeviceManagement from '../components/DeviceManagement';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [deviceLimitWarning, setDeviceLimitWarning] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    fetchUserData(currentUser.user_id);
    
    // Check for device limit warnings in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const deviceError = urlParams.get('device_error');
    if (deviceError === 'limit_exceeded') {
      setDeviceLimitWarning('You have reached your device limit. Please manage your devices below.');
      setActiveTab('devices');
    }
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      // Fetch devices, downloads, payments in parallel
      const [devicesRes, downloadsRes, paymentsRes] = await Promise.all([
        userService.getUserDevices(userId).catch(err => ({ devices: [] })),
        userService.getUserDownloads(userId).catch(err => ({ downloads: [] })),
        userService.getUserPayments(userId).catch(err => ({ payments: [] }))
      ]);

      setDevices(devicesRes.devices || []);
      setDownloads(downloadsRes.downloads || []);
      setPayments(paymentsRes.payments || []);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
              <p className="text-gray-400">Manage your account and preferences</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Device Limit Warning */}
        {deviceLimitWarning && (
          <div className="bg-yellow-600 border border-yellow-500 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-yellow-200 mr-2">⚠️</span>
              <p className="text-yellow-200">{deviceLimitWarning}</p>
              <button 
                onClick={() => setDeviceLimitWarning('')}
                className="ml-auto text-yellow-200 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
          {['profile', 'devices', 'downloads', 'payments'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && user && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">Full Name</label>
                <p className="text-white text-lg">{user.full_name}</p>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <p className="text-white text-lg">{user.email}</p>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Subscription</label>
                <p className="text-white text-lg">{user.current_subscription || 'No subscription'}</p>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Download Access</label>
                <p className="text-white text-lg">{user.can_download ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <DeviceManagement />
        )}

        {/* Downloads Tab */}
        {activeTab === 'downloads' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Download History</h2>
            {downloads.length === 0 ? (
              <p className="text-gray-400">No downloads yet</p>
            ) : (
              <div className="space-y-3">
                {downloads.map(download => (
                  <div key={download.download_id} className="p-4 bg-gray-700 rounded-lg">
                    <p className="text-white font-medium">{download.title}</p>
                    <p className="text-gray-400 text-sm">Downloaded on {new Date(download.download_date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Payment History</h2>
            {payments.length === 0 ? (
              <p className="text-gray-400">No payment history</p>
            ) : (
              <div className="space-y-3">
                {payments.map(payment => (
                  <div key={payment.payment_id} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{payment.level_name}</p>
                        <p className="text-gray-400 text-sm">{new Date(payment.transaction_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{payment.currency_code} {payment.amount}</p>
                        <p className="text-gray-400 text-sm capitalize">{payment.payment_method}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;