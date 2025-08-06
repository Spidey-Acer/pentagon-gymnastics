import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
  relatedId?: number;
  relatedType?: string;
}

interface Activity {
  id: number;
  action: string;
  description: string;
  createdAt: string;
  ipAddress?: string;
}

interface TransactionSummary {
  summary: {
    totalRevenue: number;
    totalTransactions: number;
  };
  byType: Array<{
    type: string;
    count: number;
    totalAmount: number;
  }>;
  byStatus: Array<{
    status: string;
    count: number;
    totalAmount: number;
  }>;
}

export default function Profile() {
  const { user, login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'transactions' | 'activity' | 'subscription'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    forename: user?.forename || '',
    surname: user?.surname || '',
    email: user?.email || '',
    address: user?.address || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
  });

  // Fetch user transactions
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['userTransactions'],
    queryFn: () => api.get('/transactions/my-transactions').then(res => res.data),
    enabled: activeTab === 'transactions'
  });

  // Fetch user activity log
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['userActivity'],
    queryFn: () => api.get('/transactions/my-activity').then(res => res.data),
    enabled: activeTab === 'activity'
  });

  // Fetch transaction summary
  const { data: summaryData } = useQuery({
    queryKey: ['transactionSummary'],
    queryFn: () => api.get('/transactions/my-summary').then(res => res.data),
    enabled: activeTab === 'transactions'
  });

  // Fetch current subscription
  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['currentSubscription'],
    queryFn: () => api.get('/subscriptions/current').then(res => res.data.subscription),
    enabled: activeTab === 'subscription'
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: typeof formData) => api.put(`/auth/profile/${user?.id}`, data),
    onSuccess: (response) => {
      const updatedUser = response.data.user;
      login(localStorage.getItem('token') || '', updatedUser);
      setIsEditing(false);
      showSuccess('Profile Updated', 'Your profile has been updated successfully!');
    },
    onError: (error: Error) => {
      showError('Update Failed', error.message || 'Failed to update profile');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.forename || !formData.surname || !formData.email || !formData.address || !formData.phoneNumber || !formData.dateOfBirth) {
      showError('Validation Error', 'All fields are required');
      return;
    }
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      forename: user?.forename || '',
      surname: user?.surname || '',
      email: user?.email || '',
      address: user?.address || '',
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'subscription': return 'text-blue-600 bg-blue-100';
      case 'gear': return 'text-purple-600 bg-purple-100';
      case 'penalty': return 'text-red-600 bg-red-100';
      case 'refund': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="mt-2 text-gray-600">Manage your profile, view transactions, and track your activity</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { key: 'profile', label: 'Profile', icon: '👤' },
              { key: 'subscription', label: 'Subscription', icon: '📋' },
              { key: 'transactions', label: 'Transactions', icon: '💳' },
              { key: 'activity', label: 'Activity Log', icon: '📊' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'profile' | 'transactions' | 'activity' | 'subscription')}
                className={`${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={formData.forename}
                      onChange={(e) => setFormData({ ...formData, forename: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={formData.surname}
                      onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Current Subscription</h3>
            </div>
            <div className="p-6">
              {subscriptionLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading subscription...</p>
                </div>
              ) : subscription ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{subscription.package.name} Package</h4>
                        <p className="text-gray-600">{subscription.package.description}</p>
                        <div className="mt-2 space-y-1 text-sm">
                          <p><span className="font-medium">Status:</span> 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {subscription.status}
                            </span>
                          </p>
                          <p><span className="font-medium">Start Date:</span> {new Date(subscription.startDate).toLocaleDateString()}</p>
                          <p><span className="font-medium">End Date:</span> {new Date(subscription.endDate).toLocaleDateString()}</p>
                          <p><span className="font-medium">Auto Renew:</span> {subscription.isAutoRenew ? 'Yes' : 'No'}</p>
                          {subscription.proteinSupplement && (
                            <p className="text-blue-600"><span className="font-medium">Protein Supplements:</span> Included (+£50/month)</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">£{subscription.package.price}</p>
                        <p className="text-gray-600">/month</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Change Package
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                      Manage Subscription
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No active subscription found</p>
                  <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Choose a Package
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Transaction Summary */}
            {summaryData && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-2xl font-bold text-green-600">£{summaryData.summary.totalRevenue.toFixed(2)}</p>
                    <p className="text-gray-600">Total Spent</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{summaryData.summary.totalTransactions}</p>
                    <p className="text-gray-600">Total Transactions</p>
                  </div>
                  <div className="space-y-2">
                    {summaryData.byType.map((type: { type: string; count: number; totalAmount: number }) => (
                      <div key={type.type} className="flex justify-between text-sm">
                        <span className="capitalize">{type.type}:</span>
                        <span>£{type.totalAmount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Transaction List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
              </div>
              <div className="p-6">
                {transactionsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading transactions...</p>
                  </div>
                ) : transactionsData?.transactions?.length ? (
                  <div className="space-y-4">
                    {transactionsData.transactions.map((transaction: Transaction) => (
                      <div key={transaction.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(transaction.type)}`}>
                                {transaction.type.toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                {transaction.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="mt-1 font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(transaction.createdAt).toLocaleDateString()} at {new Date(transaction.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              {transaction.amount >= 0 ? '+' : ''}£{transaction.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">{transaction.currency.toUpperCase()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No transactions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Account Activity</h3>
            </div>
            <div className="p-6">
              {activityLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading activity...</p>
                </div>
              ) : activityData?.activities?.length ? (
                <div className="space-y-4">
                  {activityData.activities.map((activity: Activity) => (
                    <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{activity.action.replace(/_/g, ' ').toUpperCase()}</p>
                          <p className="text-gray-600">{activity.description}</p>
                          {activity.ipAddress && (
                            <p className="text-xs text-gray-500">IP: {activity.ipAddress}</p>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.createdAt).toLocaleDateString()} at {new Date(activity.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No activity found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
