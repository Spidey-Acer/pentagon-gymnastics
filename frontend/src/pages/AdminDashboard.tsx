import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { useState } from "react";
import { useToast } from "../contexts/ToastContext";

interface User {
  id: number;
  email: string;
  role: string;
  _count: {
    bookings: number;
  };
}

interface DashboardData {
  summary: {
    totalUsers: number;
    totalClasses: number;
    totalSessions: number;
    totalBookings: number;
  };
  recentBookings: Array<{
    id: number;
    user: { email: string };
    session: {
      timeSlot: string;
      class: { name: string };
    };
  }>;
  sessionUtilization: Array<{
    id: number;
    className: string;
    timeSlot: string;
    capacity: number;
    bookings: number;
    utilizationRate: number;
  }>;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "sessions">("dashboard");
  const [editingSession, setEditingSession] = useState<number | null>(null);
  const [tempCapacity, setTempCapacity] = useState<number>(0);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery<DashboardData>({
    queryKey: ["adminDashboard"],
    queryFn: () => api.get("/admin/dashboard").then((res) => res.data),
    enabled: activeTab === "dashboard",
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["adminUsers"],
    queryFn: () => api.get("/admin/users").then((res) => res.data),
    enabled: activeTab === "users",
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      api.put(`/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      showSuccess("Role Updated", "User role updated successfully!");
    },
    onError: () => {
      showError("Update Failed", "Failed to update user role");
    },
  });

  const updateCapacityMutation = useMutation({
    mutationFn: ({ sessionId, capacity }: { sessionId: number; capacity: number }) =>
      api.put(`/admin/sessions/${sessionId}/capacity`, { capacity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      showSuccess("Success!", "Session capacity updated successfully!");
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      showError("Error", `Failed to update capacity: ${error.response?.data?.error || "Unknown error"}`);
    },
  });

  const handleRoleChange = (userId: number, newRole: string) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      updateUserRoleMutation.mutate({ userId, role: newRole });
    }
  };

  const handleCapacityChange = (sessionId: number, newCapacity: number) => {
    if (newCapacity < 1) {
      showError("Invalid Capacity", "Capacity must be at least 1");
      return;
    }
    updateCapacityMutation.mutate({ sessionId, capacity: newCapacity });
  };

  const startEditing = (sessionId: number, currentCapacity: number) => {
    setEditingSession(sessionId);
    setTempCapacity(currentCapacity);
  };

  const saveCapacity = (sessionId: number) => {
    if (tempCapacity < 1) {
      showError("Invalid Capacity", "Capacity must be at least 1");
      return;
    }
    handleCapacityChange(sessionId, tempCapacity);
    setEditingSession(null);
  };

  const cancelEditing = () => {
    setEditingSession(null);
    setTempCapacity(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your gym operations</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { key: "dashboard", label: "Dashboard", icon: "📊" },
              { key: "users", label: "Users", icon: "👥" },
              { key: "sessions", label: "Sessions", icon: "📅" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "dashboard" | "users" | "sessions")}
                className={`${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {dashboardLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: "Total Users", value: dashboardData?.summary.totalUsers, icon: "👥", color: "blue" },
                    { label: "Total Classes", value: dashboardData?.summary.totalClasses, icon: "🏋️‍♂️", color: "green" },
                    { label: "Total Sessions", value: dashboardData?.summary.totalSessions, icon: "📅", color: "yellow" },
                    { label: "Total Bookings", value: dashboardData?.summary.totalBookings, icon: "📝", color: "purple" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <div className="ml-4">
                          <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                          <dd className={`text-2xl font-semibold text-${stat.color}-600`}>{stat.value}</dd>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Session Utilization */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Session Utilization</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {dashboardData?.sessionUtilization.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {session.className} - {session.timeSlot}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {session.bookings}/{session.capacity} booked
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  session.utilizationRate >= 80
                                    ? "bg-red-600"
                                    : session.utilizationRate >= 60
                                    ? "bg-yellow-600"
                                    : "bg-green-600"
                                }`}
                                style={{ width: `${session.utilizationRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {session.utilizationRate}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Users Management */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">User Management</h3>
            </div>
            <div className="p-6">
              {usersLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users?.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user._count.bookings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                              disabled={updateUserRoleMutation.isPending}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sessions Management */}
        {activeTab === "sessions" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Session Management</h3>
            </div>
            <div className="p-6">
              {dashboardLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData?.sessionUtilization.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {session.className} - {session.timeSlot}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Current bookings: {session.bookings}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700">Capacity:</label>
                        {editingSession === session.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="1"
                              value={tempCapacity}
                              onChange={(e) => setTempCapacity(parseInt(e.target.value) || 0)}
                              className="border border-gray-300 rounded px-3 py-1 w-20 text-center"
                              autoFocus
                            />
                            <button
                              onClick={() => saveCapacity(session.id)}
                              disabled={updateCapacityMutation.isPending}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              disabled={updateCapacityMutation.isPending}
                              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="w-20 text-center font-medium">{session.capacity}</span>
                            <button
                              onClick={() => startEditing(session.id, session.capacity)}
                              disabled={updateCapacityMutation.isPending}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
