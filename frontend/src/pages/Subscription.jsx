// components/Subscription.jsx - ENHANCED ATTRACTIVE VERSION
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscriptionService, authService, paymentService } from '../services';
import SubscriptionCard from '../components/SubscriptionCard';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  // Use useRef to store user and prevent re-renders
  const userRef = useRef(authService.getCurrentUser());

  useEffect(() => {
    const user = userRef.current;
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    let isMounted = true;
    let timeoutId;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('Starting API calls for user:', user.user_id);
        
        const [subscriptionsData, currentSubscription] = await Promise.all([
          subscriptionService.getSubscriptions(),
          subscriptionService.getCurrentSubscription(user.user_id)
        ]);
        
        if (!isMounted) return;
        
        console.log('API calls completed successfully');
        console.log('Subscriptions data:', subscriptionsData);
        console.log('Current subscription:', currentSubscription);
        
        // Ensure subscriptions is always an array
        const subscriptionsArray = Array.isArray(subscriptionsData) ? subscriptionsData : [];
        
        setSubscriptions(subscriptionsArray);
        setUserSubscription(currentSubscription);
        
        if (subscriptionsArray.length === 0) {
          setError('No subscription plans available');
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Fetch data error:', err);
        setError('Failed to load subscription data');
        // Use fallback data
        setSubscriptions(subscriptionService.getDefaultSubscriptions());
        setUserSubscription(subscriptionService.getFreeSubscription());
      } finally {
        if (isMounted) {
          // Add a small delay to prevent rapid state updates
          timeoutId = setTimeout(() => {
            setLoading(false);
          }, 100);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      console.log('Component cleanup - stopping API calls');
    };
  }, [navigate]); // Removed user from dependencies

  // FIXED handleSubscribe function - navigates to payment page
  const handleSubscribe = async (subscription) => {
    const user = userRef.current;
    
    if (!user) {
      navigate('/login');
      return;
    }

    // Navigate to payment page with subscription data
    navigate('/payment', { 
      state: { 
        subscription: subscription,
        userSubscription: userSubscription, // Pass current subscription for upgrade calculations
        isUpgrade: !!userSubscription?.current_subscription_id
      }
    });
  };

  // Keep handleUpgradeDowngrade for direct upgrades without payment page
  const handleUpgradeDowngrade = async (newSubscription) => {
    const user = userRef.current;
    
    if (!user || !userSubscription) return;

    const currentSubscription = subscriptions.find(
      sub => sub.subscription_id === userSubscription.current_subscription_id
    );

    if (!currentSubscription) return;

    const isUpgrade = newSubscription.subscription_id > currentSubscription.subscription_id;
    
    if (isUpgrade) {
      const difference = newSubscription.monthly_fee - currentSubscription.monthly_fee;
      const confirmMessage = `Upgrade to ${newSubscription.level_name} for an additional £${difference.toFixed(2)} per month?`;
      
      if (!window.confirm(confirmMessage)) return;
    } else {
      const warningMessage = `Downgrading to ${newSubscription.level_name}. Note: No refunds will be issued for the price difference. Continue?`;
      
      if (!window.confirm(warningMessage)) return;
    }

    // For immediate upgrades/downgrades without payment page
    await processSubscriptionChange(newSubscription);
  };

  // Process subscription change directly (without payment page)
  const processSubscriptionChange = async (subscription) => {
    const user = userRef.current;
    
    if (!user) return;

    setProcessing(true);
    setError('');

    try {
      // Calculate amount based on current subscription
      let amount = subscription.monthly_fee;
      if (userSubscription?.current_subscription_id) {
        const currentSub = subscriptions.find(
          sub => sub.subscription_id === userSubscription.current_subscription_id
        );
        if (currentSub && subscription.subscription_id > currentSub.subscription_id) {
          // Upgrade - charge difference
          amount = subscription.monthly_fee - currentSub.monthly_fee;
        } else if (subscription.subscription_id < currentSub.subscription_id) {
          // Downgrade - no charge (as per your business logic)
          amount = 0;
        }
      }

      // Process payment only if amount > 0
      if (amount > 0) {
        const paymentData = {
          user_id: user.user_id,
          subscription_id: subscription.subscription_id,
          payment_method: 'CreditCard',
          amount: amount,
          currency_code: user.currency_code || 'GBP',
          card_last4: '4242' // This would come from saved payment method
        };

        await paymentService.processPayment(paymentData);
      }

      // Update subscription
      const subscriptionData = {
        subscription_id: subscription.subscription_id,
        payment_method: 'CreditCard',
        card_last4: '4242'
      };

      await subscriptionService.updateSubscription(user.user_id, subscriptionData);

      // Update local state
      const updatedSubscription = {
        current_subscription_id: subscription.subscription_id,
        level_name: subscription.level_name,
        can_download: subscription.can_download,
        max_devices: subscription.max_devices
      };
      setUserSubscription(updatedSubscription);

      // Update localStorage user data
      const updatedUser = {
        ...user,
        current_subscription_id: subscription.subscription_id,
        current_subscription: subscription.level_name,
        can_download: subscription.can_download,
        max_devices: subscription.max_devices
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update the ref as well
      userRef.current = updatedUser;

      alert(`Successfully subscribed to ${subscription.level_name}!`);

    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.message || 'Subscription failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    rest: { 
      scale: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.05,
      y: -10,
      transition: { 
        duration: 0.4,
        type: "spring",
        stiffness: 300
      }
    }
  };

  const featuredCardHoverVariants = {
    rest: { 
      scale: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.08,
      y: -15,
      transition: { 
        duration: 0.4,
        type: "spring",
        stiffness: 300
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-40 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
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
            Loading amazing plans...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-block mb-6">
            <span className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
              UNLIMITED MOVIES • ANYTIME • ANYWHERE
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            Choose Your Adventure
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Experience cinema like never before. Stream thousands of movies in stunning quality, 
            with plans for every movie lover.
          </motion.p>

          {/* Animated stars */}
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="absolute top-10 right-10 text-yellow-400 text-2xl opacity-30"
          >
            ⭐
          </motion.div>
          <motion.div 
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity }
            }}
            className="absolute bottom-10 left-10 text-yellow-400 text-2xl opacity-30"
          >
            ⭐
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="bg-red-600 text-white p-6 rounded-2xl mb-8 max-w-2xl mx-auto text-center shadow-2xl border border-red-400"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing Overlay */}
        <AnimatePresence>
          {processing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-800 rounded-2xl p-8 text-center shadow-2xl border border-purple-500"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-6"
                />
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white text-xl font-light mb-2"
                >
                  Setting up your cinematic experience...
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400"
                >
                  This will just take a moment
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Subscription Banner */}
        <AnimatePresence>
          {userSubscription?.current_subscription_id && (
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl mb-12 max-w-4xl mx-auto text-center shadow-2xl border border-blue-400"
            >
              <div className="flex items-center justify-center space-x-3 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-lg font-semibold">
                  Your Current Plan: <span className="text-yellow-300">{userSubscription.level_name}</span>
                </p>
              </div>
              <p className="text-gray-200">
                {userSubscription.can_download && '🎬 Download Enabled • '}
                {`📱 ${userSubscription.max_devices} Device${userSubscription.max_devices > 1 ? 's' : ''} • `}
                🎉 Unlimited Streaming
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subscription Cards */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative"
        >
          {subscriptions.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-end">
              {subscriptions.map((subscription, index) => {
                const isCurrent = userSubscription?.current_subscription_id === subscription.subscription_id;
                const isUpgrade = userSubscription?.current_subscription_id && 
                                subscription.subscription_id > userSubscription.current_subscription_id;
                const isDowngrade = userSubscription?.current_subscription_id && 
                                  subscription.subscription_id < userSubscription.current_subscription_id;
                const isFeatured = index === 1;

                return (
                  <motion.div
                    key={subscription.subscription_id}
                    variants={itemVariants}
                    custom={index}
                    initial="rest"
                    whileHover={isFeatured ? "hover" : "hover"}
                    animate="rest"
                    onHoverStart={() => setHoveredCard(subscription.subscription_id)}
                    onHoverEnd={() => setHoveredCard(null)}
                  >
                    <motion.div
                      variants={isFeatured ? featuredCardHoverVariants : cardHoverVariants}
                      className={`relative ${
                        isFeatured 
                          ? 'scale-105 z-10 ring-4 ring-purple-500/50' 
                          : 'scale-100'
                      } ${
                        isCurrent 
                          ? 'ring-4 ring-green-500/50' 
                          : ''
                      } transition-all duration-300`}
                    >
                      {/* Glow effect for featured card */}
                      {isFeatured && (
                        <motion.div 
                          animate={{ 
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity 
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-red-500 rounded-2xl blur-xl -z-10"
                        />
                      )}
                      
                      <SubscriptionCard
                        subscription={subscription}
                        isCurrent={isCurrent}
                        onSubscribe={() => {
                          if (isCurrent) return;
                          
                          // For new subscriptions, go to payment page
                          if (!userSubscription?.current_subscription_id) {
                            handleSubscribe(subscription);
                          } else {
                            // For existing subscribers, show upgrade/downgrade confirmation
                            handleUpgradeDowngrade(subscription);
                          }
                        }}
                        featured={isFeatured}
                        actionText={
                          isCurrent ? 'Current Plan' :
                          !userSubscription?.current_subscription_id ? 'Get Started' :
                          isUpgrade ? 'Upgrade Now' : 'Downgrade'
                        }
                        disabled={processing}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white text-xl"
            >
              No subscription plans available at the moment.
            </motion.div>
          )}
        </motion.div>

        {/* Plan Comparison Table */}
        {subscriptions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mt-20 max-w-6xl mx-auto"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              Compare All Features
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gray-800/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700 shadow-2xl"
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-red-600">
                    <th className="p-6 text-left text-white text-lg font-semibold">Feature</th>
                    {subscriptions.map((sub, index) => (
                      <th key={sub.subscription_id} className="p-6 text-center text-white text-lg font-semibold">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="inline-block"
                        >
                          {sub.level_name}
                        </motion.div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Monthly Price', key: 'monthly_fee', format: (val) => `£${val}` },
                    { name: 'Simultaneous Devices', key: 'max_devices', format: (val) => val },
                    { name: 'Download Movies', key: 'can_download', format: (val) => val ? '✅' : '❌' },
                    { name: 'Video Quality', key: 'video_quality', format: () => '4K Ultra HD' },
                    { name: 'Exclusive Content', key: 'exclusive', format: () => '✅' },
                    { name: 'Ad-Free Experience', key: 'ad_free', format: () => '✅' },
                  ].map((row, rowIndex) => (
                    <motion.tr 
                      key={row.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: rowIndex * 0.1 }}
                      viewport={{ once: true }}
                      className={`${rowIndex % 2 === 0 ? 'bg-gray-700/30' : 'bg-gray-800/30'} hover:bg-gray-700/50 transition-colors`}
                    >
                      <td className="p-5 text-gray-300 font-medium">{row.name}</td>
                      {subscriptions.map(sub => (
                        <td key={sub.subscription_id} className="p-5 text-center text-white font-semibold">
                          {row.format(sub[row.key] || (row.key === 'video_quality' ? '4K' : sub[row.key]))}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        )}

        {/* Important Notes */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 max-w-4xl mx-auto bg-gradient-to-r from-yellow-900/30 to-orange-900/30 backdrop-blur-sm border border-yellow-600/50 rounded-2xl p-6 shadow-2xl"
        >
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-yellow-400 font-bold text-xl mb-4 flex items-center"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Important Information
          </motion.h3>
          <motion.ul 
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
            className="text-yellow-300 space-y-3"
          >
            {[
              "🎬 All plans include access to our entire movie library",
              "💳 Payments are securely processed and non-refundable",
              "⬇️ Downgrading doesn't issue refunds for price differences",
              "⏰ 30-day cancellation notice required for all plans",
              "📱 Level 1 subscribers have a 7-day device switch cooldown",
              "🎁 New subscribers get 7-day free trial on all paid plans"
            ].map((item, index) => (
              <motion.li 
                key={index}
                variants={itemVariants}
                className="flex items-center space-x-3"
              >
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-gray-400 text-lg mb-6"
          >
            Ready to start your cinematic journey?
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-red-500/25 transition-all duration-300"
            onClick={() => {
              const firstSubscription = subscriptions[0];
              if (firstSubscription) {
                handleSubscribe(firstSubscription);
              }
            }}
          >
            🎬 Start Your Free Trial
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Subscription;