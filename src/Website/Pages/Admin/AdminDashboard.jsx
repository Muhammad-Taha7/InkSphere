import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../Store/Slices/adminSlice.jsx';
import { Users, FileText, CheckCircle, Heart, MessageSquare } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoadingStats } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoadingStats || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-500"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Total Blogs', value: stats.totalBlogs, icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'Published Blogs', value: stats.publishedBlogs, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Total Likes', value: stats.totalLikes, icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'Total Comments', value: stats.totalComments, icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  // Map month numbers to short names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedGrowth = stats.userGrowth.map(item => ({
    name: monthNames[item._id - 1],
    users: item.count
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-sm text-gray-500">Welcome to the InkSphere admin control panel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`rounded-full p-3 ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-900">User Growth</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="users" stroke="#EAB308" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Note: Can add more charts here in the future */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="bg-yellow-50 p-4 rounded-full mb-4">
            <FileText className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">More Insights Coming Soon</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            We are gathering more data to provide detailed analytics on blog engagement and reading time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
