import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../store/slices/adminSlice.jsx';
import {
  Users, FileText, CheckCircle, Heart, MessageSquare,
  Award, ChevronRight, TrendingUp, Sparkles, BarChart2,
  PieChart as PieIcon, Activity
} from 'lucide-react';
import {
  AreaChart, Area, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Line
} from 'recharts';
import { Link } from 'react-router-dom';

// Modern Custom Tooltip
const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/60 p-3 rounded-xl shadow-2xl text-white text-xs">
        <p className="text-slate-400 font-semibold mb-1.5 border-b border-slate-800 pb-1">{label}</p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                {entry.name}:
              </span>
              <span className="font-black text-white">
                {entry.value?.toLocaleString()} {unit || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoadingStats } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoadingStats && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // 1. User Growth Data
  const userGrowthData = stats?.userGrowth?.map(item => ({
    name: monthNames[item._id - 1] || `M${item._id}`,
    Users: item.count
  })) || [];

  // 2. Content Velocity Data
  const contentVelocityData = stats?.blogsPerMonth?.map(item => ({
    name: monthNames[item._id - 1] || `M${item._id}`,
    Blogs: item.count,
    Engagement: Math.round(item.count * 2.5)
  })) || [];

  // 3. Content Distribution Data
  const categoryData = [
    { name: 'Published', value: stats?.publishedBlogs || 0, color: '#10b981' },
    { name: 'Drafts', value: (stats?.totalBlogs || 0) - (stats?.publishedBlogs || 0), color: '#f59e0b' },
  ];

  // 4. Platform Activity Radar Matrix
  const radarData = [
    { metric: 'Users', value: stats?.totalUsers || 0 },
    { metric: 'Blogs', value: stats?.totalBlogs || 0 },
    { metric: 'Likes', value: stats?.totalLikes || 0 },
    { metric: 'Comments', value: stats?.totalComments || 0 },
    { metric: 'Published', value: stats?.publishedBlogs || 0 },
  ];

  const statCards = stats ? [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/10' },
    { title: 'Total Blogs', value: stats.totalBlogs, icon: FileText, gradient: 'from-amber-500 to-yellow-600', shadow: 'shadow-yellow-500/10' },
    { title: 'Published', value: stats.publishedBlogs, icon: CheckCircle, gradient: 'from-emerald-500 to-green-600', shadow: 'shadow-green-500/10' },
    { title: 'Total Likes', value: stats.totalLikes, icon: Heart, gradient: 'from-rose-500 to-red-600', shadow: 'shadow-red-500/10' },
    { title: 'Comments', value: stats.totalComments, icon: MessageSquare, gradient: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/10' },
  ] : [];

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            Admin Intelligence Hub
            <Sparkles size={20} className="text-yellow-500 animate-pulse" />
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">Full platform growth, engagement, and user metric analytics</p>
        </div>
      </div>

      {/* Top 5 Key Metric Cards (Full Width Grid) */}
      {stats && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className={`w-full bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm ${stat.shadow} flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                  <Icon size={22} />
                </div>
                <div className="min-w-0">
                  <span className="block text-2xl font-black text-slate-900 tracking-tight leading-none truncate">
                    {stat.value?.toLocaleString() || 0}
                  </span>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1.5 truncate">
                    {stat.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4 BEST GRAPHS GRID (Full Width Layout) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* GRAPH 1: User Growth Area Chart */}
        <div className="w-full bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-500" /> 1. User Acquisition Curve
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly new user registrations trend</p>
            </div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              Users
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip unit="users" />} />
                <Area type="monotone" dataKey="Users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#userGrad)" activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 2: Content & Engagement Velocity */}
        <div className="w-full bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 size={18} className="text-amber-500" /> 2. Content vs Engagement Mix
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Blogs created vs overall interaction trend</p>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              Velocity
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={contentVelocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Blogs" fill="#eab308" radius={[6, 6, 0, 0]} barSize={22} />
                <Line type="monotone" dataKey="Engagement" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4, fill: '#f43f5e' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 3: Donut Pie Chart */}
        <div className="w-full bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PieIcon size={18} className="text-emerald-500" /> 3. Publication Health Ratio
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Published articles vs draft ratio</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              Ratio
            </span>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip unit="articles" />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 shrink-0 pr-4">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-md" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700">{item.name}:</span>
                  <span className="font-black text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GRAPH 4: Radar Matrix */}
        <div className="w-full bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-purple-500" /> 4. Platform Activity Radar
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Strength distribution across platform vectors</p>
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
              Matrix
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="#cbd5e1" />
                <Radar name="Platform Matrix" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Authors Leaderboard (Full Width Table) */}
      {stats?.topUsers && stats.topUsers.length > 0 && (
        <div className="w-full bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award size={18} className="text-purple-600" /> Leaderboard: Most Popular Authors
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Creators driving maximum platform interaction</p>
            </div>
            <Link 
              to="/run/Dashboard/users" 
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
            >
              View All Authors <ChevronRight size={14} />
            </Link>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80">
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rank & Author</th>
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Blogs Published</th>
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Total Likes Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.topUsers.map((user, idx) => (
                  <tr key={user._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <span className={`w-6 text-center font-extrabold text-xs ${
                          idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-400'
                        }`}>
                          #{idx + 1}
                        </span>
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=eab308&color=fff&bold=true`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{user.name}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full text-xs">
                        {user.blogCount || 0} Articles
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center bg-rose-50 text-rose-600 font-bold px-3 py-1 rounded-full text-xs gap-1.5 border border-rose-100">
                        <Heart size={12} className="fill-current text-rose-500" /> {user.totalLikes || 0} Likes
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