import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  TrendingUp,
  Calendar,
  Settings,
  Users,
  DollarSign,
  BarChart3,
  Clock,
  Bell,
  MapPin,
  Star,
  Edit3,
  Plus,
  Filter,
  Download,
} from "lucide-react";

export default function BusinessManagement() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-shadow-lavender mb-2">
                Business Management Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your business, deals, and bookings all in one place
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button className="bg-shadow-lavender hover:bg-shadow-lavender/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Deal
              </Button>
              <Button variant="ghost" className="border border-gray-300 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">$12,485</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">147</p>
                  <p className="text-sm text-green-600">+8% from last month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Deals</p>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                  <p className="text-sm text-gray-500">5 expiring soon</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Customer Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                  <p className="text-sm text-gray-500">Based on 89 reviews</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Bookings */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Recent Bookings
                    </h2>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="border border-gray-300 hover:bg-gray-50">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Link to="/bookings">
                        <Button variant="ghost" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        customer: "Sarah Johnson",
                        service: "Deep Tissue Massage",
                        date: "Today, 2:00 PM",
                        status: "confirmed",
                        amount: "$89",
                      },
                      {
                        id: 2,
                        customer: "Mike Chen",
                        service: "Facial Treatment",
                        date: "Today, 4:30 PM",
                        status: "confirmed",
                        amount: "$65",
                      },
                      {
                        id: 3,
                        customer: "Emma Wilson",
                        service: "Swedish Massage",
                        date: "Tomorrow, 10:00 AM",
                        status: "pending",
                        amount: "$75",
                      },
                      {
                        id: 4,
                        customer: "David Lee",
                        service: "Hot Stone Massage",
                        date: "Tomorrow, 3:00 PM",
                        status: "confirmed",
                        amount: "$95",
                      },
                    ].map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-shadow-lavender/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-shadow-lavender" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {booking.customer}
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.service}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {booking.amount}
                          </p>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Active Deals */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Quick Actions
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <Button className="w-full justify-start bg-shadow-lavender hover:bg-shadow-lavender/90">
                      <Plus className="w-4 h-4 mr-3" />
                      Create New Deal
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start border border-gray-300 hover:bg-gray-50"
                    >
                      <Calendar className="w-4 h-4 mr-3" />
                      Manage Calendar
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start border border-gray-300 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Business Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start border border-gray-300 hover:bg-gray-50"
                    >
                      <BarChart3 className="w-4 h-4 mr-3" />
                      View Analytics
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Deals */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Active Deals
                    </h2>
                    <Link to="/deals">
                      <Button variant="ghost" size="sm">
                        View All
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        title: "50% Off Deep Tissue Massage",
                        timeSlot: "2:00 PM - 4:00 PM",
                        bookings: 12,
                        status: "active",
                      },
                      {
                        id: 2,
                        title: "30% Off Facial Treatment",
                        timeSlot: "10:00 AM - 12:00 PM",
                        bookings: 8,
                        status: "active",
                      },
                      {
                        id: 3,
                        title: "40% Off Swedish Massage",
                        timeSlot: "6:00 PM - 8:00 PM",
                        bookings: 5,
                        status: "expiring",
                      },
                    ].map((deal) => (
                      <div
                        key={deal.id}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 text-sm">
                            {deal.title}
                          </h3>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 mb-2">
                          <Clock className="w-3 h-3 mr-1" />
                          {deal.timeSlot}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            {deal.bookings} bookings
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              deal.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {deal.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Info Section */}
      <section className="py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-shadow-lavender mb-4">
                Business Profile
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Zen Spa & Wellness</p>
                    <p className="text-sm text-gray-600">
                      123 Wellness Street, San Francisco, CA 94110
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Business Hours</p>
                    <p className="text-sm text-gray-600">
                      Mon-Fri: 9:00 AM - 8:00 PM, Sat-Sun: 10:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-600">
                      Email and SMS notifications enabled
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="ghost" className="border border-gray-300 hover:bg-gray-50">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Business Profile
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-shadow-lavender mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {[
                  {
                    action: "New booking received",
                    details: "Sarah Johnson booked Deep Tissue Massage",
                    time: "2 hours ago",
                  },
                  {
                    action: "Deal updated",
                    details: "50% Off Swedish Massage deal was modified",
                    time: "4 hours ago",
                  },
                  {
                    action: "Payment received",
                    details: "$89 payment processed for booking #1247",
                    time: "6 hours ago",
                  },
                  {
                    action: "Review received",
                    details: "5-star review from Emma Wilson",
                    time: "1 day ago",
                  },
                ].map((activity, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
