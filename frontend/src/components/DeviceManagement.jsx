import React, { useState, useEffect } from 'react';
import { userService } from '../services';

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDeviceData();
  }, []);

  const fetchDeviceData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching REAL device data from database...');
      
      // Fetch devices from real database
      const devicesRes = await userService.getUserDevices();
      console.log('Real devices response:', devicesRes);
      
      if (devicesRes.success) {
        setDevices(devicesRes.devices || []);
      } else {
        throw new Error(devicesRes.message || 'Failed to load devices');
      }
      
      // Fetch device info from real database
      const infoRes = await userService.getDeviceInfo();
      console.log('Real device info response:', infoRes);
      
      if (infoRes.success) {
        setDeviceInfo(infoRes);
      } else {
        throw new Error(infoRes.message || 'Failed to load device info');
      }
      
    } catch (error) {
      console.error('Real device data fetch error:', error);
      setError(error.message || 'Failed to load device information from database');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId) => {
    if (!window.confirm('Are you sure you want to remove this device?')) return;

    try {
      setError('');
      setSuccess('');
      
      console.log('Removing device from database:', deviceId);
      await userService.removeDevice(deviceId);
      
      // Update local state
      setDevices(devices.filter(device => device.device_id !== deviceId));
      setSuccess('Device removed successfully');
      
      // Refresh device info to update counts
      const updatedInfo = await userService.getDeviceInfo();
      if (updatedInfo.success) {
        setDeviceInfo(updatedInfo);
      }
      
    } catch (error) {
      console.error('Remove device error:', error);
      setError(error.message || 'Failed to remove device from database');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="text-white text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <p className="mt-2 text-gray-400">Loading devices from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Device Management</h2>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-white hover:text-gray-200 text-lg">
              ×
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-600 text-white p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-white hover:text-gray-200 text-lg">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Device Limits - Now showing REAL data */}
      {deviceInfo && (
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Device Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{deviceInfo.current_devices}</div>
              <div className="text-gray-400 text-xs mt-1">CURRENT DEVICES</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{deviceInfo.max_devices}</div>
              <div className="text-gray-400 text-xs mt-1">MAX ALLOWED</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{deviceInfo.subscription_level}</div>
              <div className="text-gray-400 text-xs mt-1">SUBSCRIPTION</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                deviceInfo.current_devices >= deviceInfo.max_devices ? 'text-red-400' : 'text-green-400'
              }`}>
                {deviceInfo.current_devices >= deviceInfo.max_devices ? 'FULL' : 'OK'}
              </div>
              <div className="text-gray-400 text-xs mt-1">STATUS</div>
            </div>
          </div>
          
          {deviceInfo.current_devices >= deviceInfo.max_devices && (
            <div className="mt-3 p-3 bg-yellow-600 bg-opacity-20 border border-yellow-500 rounded">
              <p className="text-yellow-300 text-sm">
                ⚠️ You have reached the maximum number of devices ({deviceInfo.max_devices}) for your {deviceInfo.subscription_level} plan. 
                To add a new device, please remove an existing one first or upgrade your subscription.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Real Devices List from Database */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-3">Your Registered Devices</h3>
        
        {devices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No devices registered in database.</p>
            <p className="text-gray-500 text-sm mt-2">
              Devices will appear here when you login from different browsers or devices.
            </p>
          </div>
        ) : (
          devices.map(device => (
            <div key={device.device_id} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors">
              <div className="flex-1">
                <p className="text-white font-medium">{device.device_name}</p>
                <p className="text-gray-400 text-sm">
                  Device ID: {device.device_id} | Token: {device.device_token?.substring(0, 20)}...
                </p>
                <p className="text-gray-400 text-sm">
                  Last active: {formatDate(device.last_login)}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Registered: {formatDate(device.registered_at)}
                </p>
              </div>
              <button
                onClick={() => handleRemoveDevice(device.device_id)}
                className="text-red-500 hover:text-red-400 px-4 py-2 border border-red-500 rounded hover:bg-red-500 hover:bg-opacity-10 transition-colors whitespace-nowrap ml-4"
                disabled={loading}
              >
                {loading ? 'Removing...' : 'Remove'}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-750 rounded-lg">
        <h4 className="text-white font-semibold mb-2">About Device Management</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• Device limits are based on your subscription plan</li>
          <li>• Level 1: 1 device | Level 2: 1 device | Level 3: 3 devices</li>
          <li>• Each login from a new browser/device creates an entry</li>
          <li>• Remove unused devices to make room for new ones</li>
          <li>• Device management helps protect your account security</li>
        </ul>
      </div>
    </div>
  );
};

export default DeviceManagement;