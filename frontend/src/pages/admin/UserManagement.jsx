import React, { useState, useEffect } from 'react';
import { adminService } from '../../services';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'withSubscription') return user.current_subscription_id;
    if (filter === 'withoutSubscription') return !user.current_subscription_id;
    return true;
  });

  const getSubscriptionBadge = (user) => {
    if (!user.current_subscription_id) {
      return <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">No Subscription</span>;
    }
    
    const colors = {
      'Level 1': 'bg-blue-500',
      'Level 2': 'bg-green-500', 
      'Level 3': 'bg-purple-500'
    };
    
    return (
      <span className={`${colors[user.level_name] || 'bg-gray-500'} text-white px-2 py-1 rounded text-xs`}>
        {user.level_name || 'Unknown'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">Manage all registered users and their subscriptions</p>
          </div>
          <div className="text-white">
            Total Users: <span className="font-bold">{users.length}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded ${
                filter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setFilter('withSubscription')}
              className={`px-4 py-2 rounded ${
                filter === 'withSubscription' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              With Subscription ({users.filter(u => u.current_subscription_id).length})
            </button>
            <button
              onClick={() => setFilter('withoutSubscription')}
              className={`px-4 py-2 rounded ${
                filter === 'withoutSubscription' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Without Subscription ({users.filter(u => !u.current_subscription_id).length})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">User</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Contact</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Subscription</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Country</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Joined</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map(user => (
                  <tr key={user.user_id} className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{user.full_name}</p>
                        <p className="text-gray-400 text-sm">ID: {user.user_id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{user.email}</p>
                      {user.phone && (
                        <p className="text-gray-400 text-sm">{user.phone}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getSubscriptionBadge(user)}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {user.country || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No users found</p>
              <p className="text-gray-500 text-sm">Try changing your filter</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm">Total Users</p>
            <p className="text-white text-3xl font-bold">{users.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm">Subscribed Users</p>
            <p className="text-white text-3xl font-bold">
              {users.filter(u => u.current_subscription_id).length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm">Level 1 Users</p>
            <p className="text-white text-3xl font-bold">
              {users.filter(u => u.level_name === 'Level 1').length}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400 text-sm">Level 3 Users</p>
            <p className="text-white text-3xl font-bold">
              {users.filter(u => u.level_name === 'Level 3').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;