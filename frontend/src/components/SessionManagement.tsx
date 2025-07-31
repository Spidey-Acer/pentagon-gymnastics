import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';

interface Session {
  id: number;
  timeSlot: string;
  capacity: number;
  bookingCount: number;
  class: {
    id: number;
    name: string;
  };
}

const SessionManagement: React.FC = () => {
  const [editingSession, setEditingSession] = useState<number | null>(null);
  const [newCapacity, setNewCapacity] = useState<number>(0);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ['adminSessions'],
    queryFn: () => api.get('/admin/sessions').then(res => res.data),
    refetchInterval: 2000, // Auto-refresh every 2 seconds
  });

  const updateCapacityMutation = useMutation({
    mutationFn: ({ sessionId, capacity }: { sessionId: number; capacity: number }) =>
      api.put(`/admin/sessions/${sessionId}/capacity`, { capacity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSessions'] });
      setEditingSession(null);
      showSuccess('Capacity Updated', 'Session capacity has been successfully updated.');
    },
    onError: (error) => {
      console.error('Error updating capacity:', error);
      showError('Update Failed', 'Failed to update session capacity. Please try again.');
    },
  });

  const handleEditCapacity = (session: Session) => {
    setEditingSession(session.id);
    setNewCapacity(session.capacity);
  };

  const handleSaveCapacity = () => {
    if (editingSession && newCapacity > 0) {
      updateCapacityMutation.mutate({ sessionId: editingSession, capacity: newCapacity });
    }
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
    setNewCapacity(0);
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600 bg-red-100';
    if (utilization >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Session Management</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="animate-pulse h-2 w-2 bg-green-500 rounded-full"></div>
          <span>Auto-refreshing every 5s</span>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {sessions?.map((session) => {
            const utilization = (session.bookingCount / session.capacity) * 100;
            const isEditing = editingSession === session.id;

            return (
              <li key={session.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {session.class.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {session.timeSlot} Session
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {session.bookingCount}/{isEditing ? newCapacity : session.capacity}
                          </div>
                          <div className="text-xs text-gray-500">Bookings</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getUtilizationColor(utilization)}`}>
                          {utilization.toFixed(1)}% Full
                        </div>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="mt-4 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <label htmlFor="capacity" className="text-sm font-medium text-gray-700">
                            New Capacity:
                          </label>
                          <input
                            type="number"
                            id="capacity"
                            min="1"
                            max="100"
                            value={newCapacity}
                            onChange={(e) => setNewCapacity(parseInt(e.target.value) || 0)}
                            className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveCapacity}
                            disabled={updateCapacityMutation.isPending || newCapacity <= 0 || newCapacity < session.bookingCount}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                          >
                            {updateCapacityMutation.isPending ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancel
                          </button>
                        </div>
                        {newCapacity < session.bookingCount && (
                          <p className="text-xs text-red-600">
                            Capacity cannot be less than current bookings ({session.bookingCount})
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4">
                        <button
                          onClick={() => handleEditCapacity(session)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Capacity
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {sessions?.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No sessions found.</div>
        </div>
      )}
    </div>
  );
};

export default SessionManagement;
