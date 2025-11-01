import React from 'react';

const SubscriptionCard = ({ subscription, isCurrent, onSubscribe, featured = false, actionText = 'Subscribe Now' }) => {
  const features = [
    { text: `${subscription.max_devices} simultaneous device${subscription.max_devices > 1 ? 's' : ''}`, included: true },
    { text: 'Access to all movies', included: true },
    { text: 'HD streaming', included: true },
    { text: 'Download movies', included: subscription.can_download },
    { text: 'No device switch cooldown', included: subscription.cooldown_days === 0 },
  ];

  return (
    <div className={`relative rounded-lg overflow-hidden ${
      featured 
        ? 'bg-gradient-to-br from-red-600 to-red-800 transform scale-105 shadow-2xl' 
        : 'bg-gray-800 shadow-lg'
    }`}>
      {featured && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-gray-900 px-4 py-1 text-sm font-bold rounded-bl-lg">
          MOST POPULAR
        </div>
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className={`text-2xl font-bold ${featured ? 'text-white' : 'text-white'}`}>
            {subscription.level_name}
          </h3>
          <div className="mt-4">
            <span className={`text-4xl font-bold ${featured ? 'text-white' : 'text-white'}`}>
              £{subscription.monthly_fee}
            </span>
            <span className={`ml-2 ${featured ? 'text-red-200' : 'text-gray-400'}`}>
              /month
            </span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                className={`w-5 h-5 mr-3 ${
                  feature.included 
                    ? featured ? 'text-green-300' : 'text-green-500' 
                    : 'text-gray-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {feature.included ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
              <span className={featured ? 'text-white' : 'text-gray-300'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Subscribe Button */}
        <button
          onClick={onSubscribe}
          disabled={isCurrent}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            isCurrent
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : featured
              ? 'bg-white text-red-600 hover:bg-gray-100'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {actionText}
        </button>

        {subscription.cooldown_days > 0 && (
          <p className="text-xs text-center mt-3 text-gray-400">
            * {subscription.cooldown_days}-day device switch cooldown applies
          </p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;