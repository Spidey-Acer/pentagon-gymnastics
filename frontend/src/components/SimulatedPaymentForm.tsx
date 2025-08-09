import { useState, useEffect, useRef } from "react";
import { useToast } from "../contexts/ToastContext";
import api from "../services/api";

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
  gearOrderId,
}: PaymentFormProps) {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [testCards, setTestCards] = useState<SimulatedCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTestCards, setShowTestCards] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  // Payment ID is tracked only during status checks; no need to store in state
  const [statusMessage, setStatusMessage] = useState<string>("");
  const { showSuccess, showError } = useToast();
  const statusCheckInterval = useRef<number | null>(null);

  // Custom card form state
  const customCard = {
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  };

  // Check payment status every 2 seconds
  const startStatusCheck = (id: number) => {
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
    }

    statusCheckInterval.current = setInterval(async () => {
      try {
        const { data: result } = await api.get(`/payments/status/${id}`);

        if (result.success) {
          setPaymentStatus(result.status);
          setStatusMessage(
            result.message || `Payment status: ${result.status}`
          );

          if (result.status === "success" || result.status === "failed") {
            clearInterval(statusCheckInterval.current!);

            if (result.status === "success") {
              showSuccess(
                "Payment Completed",
                "Your payment has been processed successfully!"
              );
              setTimeout(() => onPaymentSuccess(id), 1000);
            } else {
              showError(
                "Payment Failed",
                result.message || "Payment could not be processed"
              );
              setLoading(false);
            }
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 2000); // Check every 2 seconds
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
    };
  }, []);

  // Load test cards
  const loadTestCards = async () => {
    try {
      const { data } = await api.get("/payments/test-cards");
      if (data.success) {
        setTestCards(data.cards);
        setShowTestCards(true);
      } else {
        console.error("Failed to load test cards:", data.error);
      }
    } catch (error) {
      console.error("Error loading test cards:", error);
    }
  };

  // Process payment
  const processPayment = async () => {
    if (!selectedCardId && !customCard.cardNumber) {
      showError(
        "Error",
        "Please select a test card or enter custom card details"
      );
      return;
    }

    setLoading(true);
    setPaymentStatus("processing");
    setStatusMessage("Processing payment...");

    try {
      let paymentData;

      if (selectedCardId) {
        // Using test card
        paymentData = {
          cardId: selectedCardId,
          amount,
          description,
          subscriptionId,
          gearOrderId,
        };
      } else {
        // Using custom card (validate first)
        const { data: validateResult } = await api.post(
          "/payments/validate-card",
          {
            cardNumber: customCard.cardNumber,
            cardholderName: customCard.cardholderName,
            expiryMonth: parseInt(customCard.expiryMonth),
            expiryYear: parseInt(customCard.expiryYear),
            cvv: customCard.cvv,
            cardType: "visa", // Default for custom cards
          }
        );
        if (!validateResult.success) {
          showError("Card Validation Failed", validateResult.error);
          setLoading(false);
          setPaymentStatus("failed");
          return;
        }

        // For demo purposes, we'll create a temporary card
        showError("Demo Mode", "Please use one of the test cards for the demo");
        setLoading(false);
        setPaymentStatus("failed");
        return;
      }

      // Process the payment
      const endpoint = subscriptionId
        ? "/payments/subscription"
        : "/payments/gear";
      const { data: result } = await api.post(endpoint, paymentData);

      if (result.success) {
        setStatusMessage("Payment initiated. Checking status...");
        // Start checking payment status every 2 seconds
        startStatusCheck(result.paymentId);
      } else {
        setPaymentStatus("failed");
        showError(
          "Payment Failed",
          result.error || "Payment could not be processed"
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
      showError("Error", "Payment processing failed");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Payment
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Amount:</strong> £{amount.toFixed(2)}
          </p>
          <p className="text-sm text-blue-800">
            <strong>Description:</strong> {description}
          </p>
        </div>

        {/* Payment Status Display */}
        {paymentStatus !== "idle" && (
          <div
            className={`mt-4 p-4 rounded-lg border ${
              paymentStatus === "processing"
                ? "bg-yellow-50 border-yellow-200"
                : paymentStatus === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center">
              {paymentStatus === "processing" && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
              )}
              {paymentStatus === "success" && (
                <svg
                  className="w-4 h-4 text-green-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {paymentStatus === "failed" && (
                <svg
                  className="w-4 h-4 text-red-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span
                className={`text-sm font-medium ${
                  paymentStatus === "processing"
                    ? "text-yellow-800"
                    : paymentStatus === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {statusMessage}
              </span>
            </div>

            {paymentStatus === "processing" && (
              <p className="text-xs text-yellow-700 mt-2">
                🔄 Status will refresh every 2 seconds...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Test Cards Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
          <button
            onClick={loadTestCards}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {showTestCards ? "Hide Test Cards" : "Show Test Cards"}
          </button>
        </div>

        {showTestCards && (
          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-600">
              Select a test card for demo purposes:
            </p>
            {testCards.map((card) => (
              <div
                key={card.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedCardId === card.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedCardId(card.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{card.cardNumber}</span>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          card.cardType === "visa"
                            ? "bg-blue-100 text-blue-800"
                            : card.cardType === "mastercard"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {card.cardType.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {card.cardholderName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires: {card.expiryMonth.toString().padStart(2, "0")}/
                      {card.expiryYear}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`px-2 py-1 text-xs rounded ${
                        card.isValid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {card.isValid ? "Valid" : "Will Decline"}
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
              For this demo, please use the test cards above. Custom card entry
              is not available in demo mode.
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
          <svg
            className="w-5 h-5 text-yellow-400 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Demo Mode</h4>
            <p className="text-sm text-yellow-700">
              This is a simulated payment system for demonstration purposes. No
              real money will be charged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
