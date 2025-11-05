import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscriptionService } from '../../services/subscriptionService';

const PricingSection = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const subscriptionsData = await subscriptionService.getSubscriptions();
        // Ensure subscriptions is always an array, fallback to default if empty
        const subscriptionsArray = Array.isArray(subscriptionsData) ? subscriptionsData : [];
        setSubscriptions(subscriptionsArray.length > 0 ? subscriptionsArray : getDefaultSubscriptions());
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
        // Fallback to default subscriptions if API fails
        setSubscriptions(getDefaultSubscriptions());
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Fallback default subscriptions in case API fails
  const getDefaultSubscriptions = () => [
    {
      subscription_id: 1,
      level_name: 'Level 1',
      monthly_fee: 4.99,
      max_devices: 1,
      can_download: false,
      cooldown_days: 7
    },
    {
      subscription_id: 2,
      level_name: 'Level 2',
      monthly_fee: 7.99,
      max_devices: 1,
      can_download: true,
      cooldown_days: 0
    },
    {
      subscription_id: 3,
      level_name: 'Level 3',
      monthly_fee: 9.99,
      max_devices: 3,
      can_download: true,
      cooldown_days: 0
    }
  ];

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that works for you. All plans include access to our entire library.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-8 text-center animate-pulse">
                <div className="h-8 bg-gray-700 rounded mb-4 mx-auto w-32"></div>
                <div className="h-12 bg-gray-700 rounded mb-6 w-24 mx-auto"></div>
                <div className="space-y-3 mb-8">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
                <div className="h-12 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-800/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that works for you. All plans include access to our entire library.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {subscriptions.map((subscription, index) => (
            <div
              key={subscription.subscription_id}
              className={`rounded-xl p-8 text-center border-2 transition-all duration-300 ${
                index === 1
                  ? 'bg-gradient-to-br from-red-600 to-red-800 transform scale-105 relative shadow-2xl border-transparent'
                  : 'bg-gray-800 border-gray-700 hover:border-red-500'
              }`}
            >
              {index === 1 && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-gray-900 px-4 py-1 text-sm font-bold rounded-bl-xl rounded-tr-xl">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-white mb-4">{subscription.level_name}</h3>
              <div className="text-4xl font-bold text-white mb-6">
                £{subscription.monthly_fee}
                <span className={`text-lg ${index === 1 ? 'text-red-200' : 'text-gray-400'}`}>/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className={`flex items-center justify-center ${index === 1 ? 'text-white' : 'text-gray-300'}`}>
                  <svg
                    className={`w-5 h-5 mr-2 ${
                      index === 1 ? 'text-green-300' : 'text-green-500'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {subscription.max_devices} Device{subscription.max_devices > 1 ? 's' : ''}
                </li>
                <li className={`flex items-center justify-center ${index === 1 ? 'text-white' : 'text-gray-300'}`}>
                  <svg
                    className={`w-5 h-5 mr-2 ${
                      index === 1 ? 'text-green-300' : 'text-green-500'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  HD Streaming
                </li>
                <li className={`flex items-center justify-center ${index === 1 ? 'text-white' : 'text-gray-300'}`}>
                  <svg
                    className={`w-5 h-5 mr-2 ${
                      subscription.can_download
                        ? index === 1
                          ? 'text-green-300'
                          : 'text-green-500'
                        : 'text-gray-500'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d={
                        subscription.can_download
                          ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          : 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      }
                      clipRule="evenodd"
                    />
                  </svg>
                  {subscription.can_download ? 'Download Movies' : 'No Downloads'}
                </li>
              </ul>
              
              <Link
                to="/subscription"
                className={`w-full py-3 rounded-lg font-semibold transition-colors block ${
                  index === 1
                    ? 'bg-white hover:bg-gray-100 text-red-600'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;