import React, { useState, useEffect } from 'react';
import { subscriptionService, authService, paymentService } from '../services';
import SubscriptionCard from '../components/SubscriptionCard';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subscriptionsRes, userProfile] = await Promise.all([
        subscriptionService.getSubscriptions(),
        subscriptionService.getCurrentSubscription(user.user_id)
      ]);
      
      setSubscriptions(subscriptionsRes.subscriptions || []);
      setUserSubscription(userProfile);
    } catch (err) {
      setError(err.message || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (subscription) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // First process payment
      const paymentData = {
        user_id: user.user_id,
        subscription_id: subscription.subscription_id,
        payment_method: 'CreditCard',
        amount: subscription.monthly_fee,
        currency_code: user.currency_code || 'GBP',
        card_last4: '4242' // In real app, this would come from payment form
      };

      const paymentResult = await paymentService.processPayment(paymentData);
      
      // Then update subscription
      const subscriptionData = {
        subscription_id: subscription.subscription_id,
        payment_method: 'CreditCard',
        card_last4: '4242'
      };

      const subscriptionResult = await subscriptionService.updateSubscription(
        user.user_id, 
        subscriptionData
      );

      // Update local state
      setUserSubscription({
        ...userSubscription,
        current_subscription_id: subscription.subscription_id,
        level_name: subscription.level_name,
        can_download: subscription.can_download,
        max_devices: subscription.max_devices
      });

      // Update localStorage
      const updatedUser = {
        ...user,
        current_subscription: subscription.level_name,
        can_download: subscription.can_download,
        max_devices: subscription.max_devices
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      alert(`Successfully subscribed to ${subscriptionResult.new_subscription}!`);

    } catch (err) {
      setError(err.message || 'Subscription failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpgradeDowngrade = async (newSubscription) => {
    if (!userSubscription) return;

    const currentSubscription = subscriptions.find(
      sub => sub.subscription_id === userSubscription.current_subscription_id
    );

    if (!currentSubscription) return;

    const isUpgrade = newSubscription.subscription_id > currentSubscription.subscription_id;
    const action = isUpgrade ? 'upgrade' : 'downgrade';

    if (isUpgrade) {
      // For upgrades, show confirmation
      const difference = newSubscription.monthly_fee - currentSubscription.monthly_fee;
      const confirmMessage = `Upgrade to ${newSubscription.level_name} for an additional £${difference} per month?`;
      
      if (!window.confirm(confirmMessage)) return;
    } else {
      // For downgrades, show warning about no refunds
      const warningMessage = `Downgrading to ${newSubscription.level_name}. Note: No refunds will be issued for the price difference. Continue?`;
      
      if (!window.confirm(warningMessage)) return;
    }

    await handleSubscribe(newSubscription);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select the subscription that best fits your streaming needs. 
            Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Processing Overlay */}
        {processing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-white">Processing your subscription...</p>
            </div>
          </div>
        )}

        {/* Current Subscription Banner */}
        {userSubscription?.current_subscription_id && (
          <div className="bg-blue-600 text-white p-4 rounded-lg mb-8 max-w-2xl mx-auto">
            <p className="text-center">
              Your current plan: <strong>{userSubscription.level_name}</strong>
              {userSubscription.can_download && ' • Download Enabled'}
              {` • ${userSubscription.max_devices} Device${userSubscription.max_devices > 1 ? 's' : ''}`}
            </p>
          </div>
        )}

        {/* Subscription Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscriptions.map((subscription, index) => {
            const isCurrent = userSubscription?.current_subscription_id === subscription.subscription_id;
            const isUpgrade = userSubscription?.current_subscription_id && 
                             subscription.subscription_id > userSubscription.current_subscription_id;
            const isDowngrade = userSubscription?.current_subscription_id && 
                               subscription.subscription_id < userSubscription.current_subscription_id;

            return (
              <SubscriptionCard
                key={subscription.subscription_id}
                subscription={subscription}
                isCurrent={isCurrent}
                onSubscribe={() => {
                  if (isCurrent) return;
                  if (userSubscription?.current_subscription_id) {
                    handleUpgradeDowngrade(subscription);
                  } else {
                    handleSubscribe(subscription);
                  }
                }}
                featured={index === 1}
                actionText={
                  isCurrent ? 'Current Plan' :
                  !userSubscription?.current_subscription_id ? 'Subscribe Now' :
                  isUpgrade ? 'Upgrade' : 'Downgrade'
                }
              />
            );
          })}
        </div>

        {/* Subscription Features Comparison */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Plan Comparison</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-4 text-left text-white">Feature</th>
                  {subscriptions.map(sub => (
                    <th key={sub.subscription_id} className="p-4 text-center text-white">
                      {sub.level_name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="p-4 text-gray-300">Monthly Price</td>
                  {subscriptions.map(sub => (
                    <td key={sub.subscription_id} className="p-4 text-center text-white">
                      £{sub.monthly_fee}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 text-gray-300">Simultaneous Devices</td>
                  {subscriptions.map(sub => (
                    <td key={sub.subscription_id} className="p-4 text-center text-white">
                      {sub.max_devices}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 text-gray-300">Download Movies</td>
                  {subscriptions.map(sub => (
                    <td key={sub.subscription_id} className="p-4 text-center text-white">
                      {sub.can_download ? '✅' : '❌'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-4 text-gray-300">Video Quality</td>
                  {subscriptions.map(sub => (
                    <td key={sub.subscription_id} className="p-4 text-center text-white">
                      HD
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-gray-300">Device Switch Cooldown</td>
                  {subscriptions.map(sub => (
                    <td key={sub.subscription_id} className="p-4 text-center text-white">
                      {sub.cooldown_days > 0 ? `${sub.cooldown_days} days` : 'None'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-8 max-w-4xl mx-auto bg-yellow-900 bg-opacity-20 border border-yellow-600 rounded-lg p-4">
          <h3 className="text-yellow-400 font-semibold mb-2">Important Information</h3>
          <ul className="text-yellow-300 text-sm space-y-1">
            <li>• Payments are non-refundable</li>
            <li>• Downgrading your plan does not issue refunds for price differences</li>
            <li>• Level 1 subscribers have a 7-day device switch cooldown period</li>
            <li>• 30-day cancellation notice required</li>
            <li>• All plans include access to the entire movie library</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Subscription;