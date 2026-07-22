import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardStats, fetchAllUsers, toggleUserBlock } from '../../Store/Slices/adminSlice.jsx';
import {
  Users, FileText, CheckCircle, Heart, MessageSquare,
  Award, ChevronRight, TrendingUp
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, isLoadingStats } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoadingStats && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = stats ? [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, gradient: 'from-blue-600 to-blue-700' },
    { title: 'Total Blogs', value: stats.totalBlogs, icon: FileText, gradient: 'from-yellow-500 to-yellow-600' },
    { title: 'Published', value: stats.publishedBlogs, icon: CheckCircle, gradient: 'from-green-600 to-green-700' },
    { title: 'Total Likes', value: stats.totalLikes, icon: Heart, gradient: 'from-red-600 to-red-700' },
    { title: 'Comments', value: stats.totalComments, icon: MessageSquare, gradient: 'from-purple-600 to-purple-700' },
  ] : [];

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedGrowth = stats?.userGrowth?.map(item => ({
    name: monthNames[item._id - 1],
    users: item.count
  })) || [];

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your platform's activity</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5 hover:-translate-y-0.5 transition-transform duration-200">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shrink-0`}>
                  <Icon size={20} />
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-slate-900 leading-none">{stat.value}</span>
                  <span className="block text-xs font-medium text-slate-500 mt-1">{stat.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {formattedGrowth.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" /> User Growth
            </h3>
            <div className="h-64 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      color: '#0f172a'
                    }}
                    itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#adminChartGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {stats?.blogsPerMonth && stats.blogsPerMonth.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-yellow-500" /> Blogs Published
            </h3>
            <div className="h-64 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.blogsPerMonth.map(item => ({
                  name: monthNames[item._id - 1],
                  blogs: item.count
                }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(234, 179, 8, 0.05)' }}
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      color: '#0f172a'
                    }}
                    itemStyle={{ color: '#ca8a04', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="blogs" fill="#eab308" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Top Popular Users */}
      {stats?.topUsers && stats.topUsers.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award size={18} className="text-purple-500" /> Most Popular Authors
            </h3>
            <Link to="/run/Dashboard/users" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80">
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Blogs Published</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Total Likes Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.topUsers.map((user, idx) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=eab308&color=fff&bold=true`}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          {idx < 3 && (
                            <span className={`absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-white border-2 border-white shadow-sm ${
                              idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-slate-300' : 'bg-orange-400'
                            }`}>
                              {idx + 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{user.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">
                        {user.blogCount} Blogs
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center bg-red-50 text-red-700 font-bold px-3 py-1 rounded-full text-xs gap-1.5">
                        <Heart size={12} className="fill-current" /> {user.totalLikes} Likes
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;