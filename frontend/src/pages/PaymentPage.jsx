// components/PaymentPage.jsx - FIXED
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { paymentService, subscriptionService, authService } from '../services';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Get subscription data from navigation state or fetch it
  const [subscription, setSubscription] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CreditCard');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Get subscription from location state or fetch based on ID
    if (location.state?.subscription) {
      setSubscription(location.state.subscription);
    } else if (location.state?.subscriptionId) {
      fetchSubscription(location.state.subscriptionId);
    } else {
      navigate('/subscription');
    }
  }, [user, navigate, location]);

  const fetchSubscription = async (subscriptionId) => {
    try {
      const subscriptions = await subscriptionService.getSubscriptions();
      const selectedSubscription = subscriptions.find(sub => sub.subscription_id === subscriptionId);
      if (selectedSubscription) {
        setSubscription(selectedSubscription);
      } else {
        setError('Subscription not found');
      }
    } catch (err) {
      setError('Failed to load subscription details');
    }
  };

  // FIXED calculateAmount function
  const calculateAmount = () => {
    if (!subscription) return 0;

    // Ensure monthly_fee is a number
    const subscriptionFee = parseFloat(subscription.monthly_fee) || 0;
    
    // If user has no current subscription or it's a new subscription
    if (!user?.current_subscription_id) {
      return subscriptionFee;
    }

    // For upgrades, calculate difference
    const currentSubId = user.current_subscription_id;
    
    // Define subscription fees for calculation
    const subscriptionFees = {
      1: 4.99,
      2: 7.99,
      3: 9.99
    };

    const currentFee = subscriptionFees[currentSubId] || 0;
    
    // If upgrading, charge difference
    if (subscription.subscription_id > currentSubId) {
      const difference = subscriptionFee - currentFee;
      return Math.max(difference, 0); // Ensure non-negative
    }
    
    // For downgrades or same tier, charge full price or 0
    return subscriptionFee;
  };

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;
    
    // Format card number with spaces
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }
    
    // Format expiry date
    if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    }
    
    // Format CVV
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const validateForm = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
      return 'Please enter a valid 16-digit card number';
    }
    if (!cardDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      return 'Please enter a valid expiry date (MM/YY)';
    }
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      return 'Please enter a valid CVV';
    }
    if (!cardDetails.cardholderName) {
      return 'Please enter cardholder name';
    }
    return null;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const amount = calculateAmount();
      
      // Process payment only if amount > 0
      if (amount > 0) {
        const paymentData = {
          user_id: user.user_id,
          subscription_id: subscription.subscription_id,
          payment_method: paymentMethod,
          amount: amount,
          currency_code: user.currency_code || 'GBP',
          card_last4: cardDetails.cardNumber.slice(-4)
        };

        await paymentService.processPayment(paymentData);
      }

      // Update subscription
      const subscriptionData = {
        subscription_id: subscription.subscription_id,
        payment_method: paymentMethod,
        card_last4: cardDetails.cardNumber.slice(-4)
      };

      await subscriptionService.updateSubscription(user.user_id, subscriptionData);

      // Update local user data
      const updatedUser = {
        ...user,
        current_subscription_id: subscription.subscription_id,
        current_subscription: subscription.level_name,
        can_download: subscription.can_download,
        max_devices: subscription.max_devices
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/subscription', { 
          state: { message: `Successfully subscribed to ${subscription.level_name}!` }
        });
      }, 3000);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading payment details...</div>
      </div>
    );
  }

  // FIXED: Ensure amount is always a number
  const amount = parseFloat(calculateAmount()) || 0;
  const isUpgrade = user?.current_subscription_id && subscription.subscription_id > user.current_subscription_id;
  const isFreeChange = amount === 0;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            {isFreeChange ? 'Complete Subscription Change' : 'Complete Your Subscription'}
          </h1>
          <div className="bg-blue-600 text-white p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{subscription.level_name}</h2>
            <p className="text-lg">
              {isFreeChange ? (
                'No additional charge'
              ) : (
                `£${amount.toFixed(2)} ${isUpgrade ? '(Upgrade difference)' : '/month'}`
              )}
            </p>
            <div className="text-sm mt-2">
              {subscription.can_download && '✓ Download movies • '}
              {subscription.max_devices} device{subscription.max_devices > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Payment Successful! 🎉</h3>
            <p>You are now subscribed to {subscription.level_name}. Redirecting...</p>
          </div>
        )}

        {/* Payment Form */}
        {!success && (
          <div className="bg-gray-800 rounded-lg p-6">
            <form onSubmit={handlePayment}>
              {/* Payment Method Selection - Only show if payment required */}
              {!isFreeChange && (
                <div className="mb-6">
                  <label className="block text-white text-sm font-medium mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['CreditCard', 'PayPal', 'GooglePay'].map(method => (
                      <button
                        key={method}
                        type="button"
                        className={`p-3 border-2 rounded-lg text-center transition-colors ${
                          paymentMethod === method
                            ? 'border-blue-500 bg-blue-500 bg-opacity-20 text-white'
                            : 'border-gray-600 text-gray-400 hover:border-gray-500'
                        }`}
                        onClick={() => setPaymentMethod(method)}
                      >
                        {method === 'CreditCard' && '💳 Credit Card'}
                        {method === 'PayPal' && '📧 PayPal'}
                        {method === 'GooglePay' && '📱 Google Pay'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Details - Only show if payment required and CreditCard selected */}
              {!isFreeChange && paymentMethod === 'CreditCard' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cardholderName}
                      onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="John Doe"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="1234 5678 9012 3456"
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiryDate}
                        onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        placeholder="MM/YY"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        placeholder="123"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Buttons */}
              {!isFreeChange && paymentMethod !== 'CreditCard' && (
                <div className="text-center py-4">
                  <p className="text-gray-400 mb-4">
                    You will be redirected to {paymentMethod} to complete your payment.
                  </p>
                </div>
              )}

              {/* Free Change Notice */}
              {isFreeChange && (
                <div className="text-center py-4">
                  <div className="bg-green-600 text-white p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold mb-2">No Payment Required</h3>
                    <p>This subscription change doesn't require any additional payment.</p>
                  </div>
                </div>
              )}

              {/* Security Notice - Only show if payment required */}
              {!isFreeChange && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center text-green-400 mb-2">
                    <span className="mr-2">🔒</span>
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Your payment information is encrypted and secure. We do not store your full card details.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/subscription')}
                  className="flex-1 py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : isFreeChange ? (
                    'Confirm Change'
                  ) : (
                    `Pay £${amount.toFixed(2)}`
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Demo Notice */}
        <div className="mt-6 p-4 bg-yellow-900 bg-opacity-20 border border-yellow-600 rounded-lg">
          <h3 className="text-yellow-400 font-semibold mb-2">Demo Notice</h3>
          <p className="text-yellow-300 text-sm">
            This is a demonstration. No real payments will be processed. 
            {!isFreeChange && ' Use test card number: 4242 4242 4242 4242'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;