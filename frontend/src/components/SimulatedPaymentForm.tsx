import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

interface PaymentFormProps {
  amount: number;
  description: string;
  onPaymentSuccess: (paymentId: number) => void;
  onPaymentCancel: () => void;
  subscriptionId?: number;
  gearOrderId?: number;
}

interface SimulatedCard {
  id: number;
  cardNumber: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  cardType: string;
  isValid: boolean;
  balance: number;
}

export default function SimulatedPaymentForm({
  amount,
  description,
  onPaymentSuccess,
  onPaymentCancel,
  subscriptionId,
  gearOrderId
}: PaymentFormProps) {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [testCards, setTestCards] = useState<SimulatedCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTestCards, setShowTestCards] = useState(false);
  const { showSuccess, showError } = useToast();

  // Custom card form state
  const [customCard, setCustomCard] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  // Load test cards
  const loadTestCards = async () => {
    try {
      const response = await fetch('/api/payments/test-cards');
      const data = await response.json();
      if (data.success) {
        setTestCards(data.cards);
        setShowTestCards(true);
      }
    } catch (error) {
      console.error('Error loading test cards:', error);
    }
  };

  // Process payment
  const processPayment = async () => {
    if (!selectedCardId && !customCard.cardNumber) {
      showError('Error', 'Please select a test card or enter custom card details');
      return;
    }

    setLoading(true);

    try {
      let paymentData;
      
      if (selectedCardId) {
        // Using test card
        paymentData = {
          cardId: selectedCardId,
          amount,
          description,
          subscriptionId,
          gearOrderId
        };
      } else {
        // Using custom card (validate first)
        const validateResponse = await fetch('/api/payments/validate-card', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            cardNumber: customCard.cardNumber,
            cardholderName: customCard.cardholderName,
            expiryMonth: parseInt(customCard.expiryMonth),
            expiryYear: parseInt(customCard.expiryYear),
            cvv: customCard.cvv,
            cardType: 'visa' // Default for custom cards
          })
        });

        const validateResult = await validateResponse.json();
        if (!validateResult.success) {
          showError('Card Validation Failed', validateResult.error);
          setLoading(false);
          return;
        }

        // For demo purposes, we'll create a temporary card
        showError('Demo Mode', 'Please use one of the test cards for the demo');
        setLoading(false);
        return;
      }

      // Process the payment
      const endpoint = subscriptionId ? '/api/payments/subscription' : '/api/payments/gear';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Payment Successful', result.message);
        onPaymentSuccess(result.paymentId);
      } else {
        showError('Payment Failed', result.error || 'Payment could not be processed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      showError('Error', 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Amount:</strong> £{amount.toFixed(2)}
          </p>
          <p className="text-sm text-blue-800">
            <strong>Description:</strong> {description}
          </p>
        </div>
      </div>

      {/* Test Cards Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
          <button
            onClick={loadTestCards}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {showTestCards ? 'Hide Test Cards' : 'Show Test Cards'}
          </button>
        </div>

        {showTestCards && (
          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-600">Select a test card for demo purposes:</p>
            {testCards.map((card) => (
              <div
                key={card.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedCardId === card.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCardId(card.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{card.cardNumber}</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        card.cardType === 'visa' ? 'bg-blue-100 text-blue-800' :
                        card.cardType === 'mastercard' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {card.cardType.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{card.cardholderName}</p>
                    <p className="text-sm text-gray-500">
                      Expires: {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 text-xs rounded ${
                      card.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {card.isValid ? 'Valid' : 'Will Decline'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Balance: £{card.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Card Form (for future enhancement) */}
        {!showTestCards && (
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-4">
              For this demo, please use the test cards above. Custom card entry is not available in demo mode.
            </p>
            <button
              onClick={loadTestCards}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Use Test Cards
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onPaymentCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={processPayment}
          disabled={loading || (!selectedCardId && !customCard.cardNumber)}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay £${amount.toFixed(2)}`
          )}
        </button>
      </div>

      {/* Demo Notice */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Demo Mode</h4>
            <p className="text-sm text-yellow-700">
              This is a simulated payment system for demonstration purposes. No real money will be charged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
