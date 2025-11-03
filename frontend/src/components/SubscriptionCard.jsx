// components/SubscriptionCard.jsx
const SubscriptionCard = ({ 
  subscription, 
  isCurrent, 
  onSubscribe, 
  featured, 
  actionText, 
  disabled 
}) => {
  return (
    <div className={`relative rounded-lg p-6 ${
      featured 
        ? 'bg-gradient-to-br from-blue-600 to-purple-700 scale-105 transform' 
        : 'bg-gray-800'
    } ${isCurrent ? 'ring-2 ring-green-500' : ''}`}>
      
      {featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-white mb-2">{subscription.level_name}</h3>
      <div className="text-3xl font-bold text-white mb-4">
        £{subscription.monthly_fee}<span className="text-lg text-gray-300">/month</span>
      </div>
      
      <ul className="space-y-2 mb-6">
        <li className="text-gray-300">✓ {subscription.max_devices} simultaneous device{subscription.max_devices > 1 ? 's' : ''}</li>
        <li className="text-gray-300">{subscription.can_download ? '✓ Download movies' : '✗ No downloads'}</li>
        <li className="text-gray-300">{subscription.cooldown_days > 0 ? `${subscription.cooldown_days}-day device cooldown` : 'No device cooldown'}</li>
        <li className="text-gray-300">✓ HD streaming</li>
        <li className="text-gray-300">✓ Access to all movies</li>
      </ul>
      
      <button
        onClick={onSubscribe}
        disabled={isCurrent || disabled}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
          isCurrent
            ? 'bg-green-600 text-white cursor-default'
            : featured
            ? 'bg-white text-blue-600 hover:bg-gray-100'
            : 'bg-blue-600 text-white hover:bg-blue-500'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {actionText}
      </button>
    </div>
  );
};

export default SubscriptionCard;