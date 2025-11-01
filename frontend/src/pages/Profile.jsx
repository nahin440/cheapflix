import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../services';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    fetchUserData(currentUser.user_id);
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      // Fetch devices, downloads, payments in parallel
      const [devicesRes, downloadsRes, paymentsRes] = await Promise.all([
        userService.getUserDevices(userId),
        userService.getUserDownloads(userId),
        userService.getUserPayments(userId)
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
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          {['profile', 'devices', 'downloads', 'payments'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${
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
            <button
              onClick={handleLogout}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Registered Devices</h2>
            {devices.length === 0 ? (
              <p className="text-gray-400">No devices registered</p>
            ) : (
              <div className="space-y-4">
                {devices.map(device => (
                  <div key={device.device_id} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{device.device_name}</p>
                      <p className="text-gray-400 text-sm">Last login: {new Date(device.last_login).toLocaleDateString()}</p>
                    </div>
                    <button className="text-red-500 hover:text-red-400">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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