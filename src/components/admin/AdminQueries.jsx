import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Search, Filter, ShieldAlert, Mail, MessageCircle, Send, CheckCircle2, AlertCircle, Eye, EyeOff, LayoutList } from 'lucide-react';
import Swal from 'sweetalert2';

export const AdminQueries = () => {
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [resolvingId, setResolvingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);

  const { adminToken } = useSelector((state) => state.admin);

  useEffect(() => {
    fetchQueries();
  }, [adminToken]);

  const fetchQueries = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/queries/admin`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setQueries(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch queries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (queryId) => {
    if (!replyText.trim()) return;

    try {
      setResolvingId(queryId);
      setIsSubmitting(true);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/queries/admin/${queryId}/resolve`,
        { reply: replyText },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      
      Swal.fire({
        icon: 'success',
        title: 'Query Resolved',
        text: 'The user has been notified via email.',
        confirmButtonColor: '#FACC15',
      });
      
      setReplyText('');
      setResolvingId(null);
      fetchQueries(); // refresh list
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to resolve query.',
      });
      setResolvingId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group queries by user
  const groupedQueries = queries.reduce((acc, query) => {
    if (!query.user) return acc;
    const userId = query.user._id;
    if (!acc[userId]) {
      acc[userId] = {
        user: query.user,
        queries: [],
        openCount: 0,
        resolvedCount: 0
      };
    }
    acc[userId].queries.push(query);
    if (query.status === 'Resolved') acc[userId].resolvedCount++;
    else acc[userId].openCount++;
    return acc;
  }, {});

  const groupedArray = Object.values(groupedQueries);

  const filteredGroups = groupedArray.filter(g => {
    const matchesSearch = 
      g.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
      g.user?.email?.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = filterStatus === 'All' || g.queries.some(q => q.status === filterStatus);
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 border-4 border-slate-200 border-t-yellow-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Support Queries</h1>
          <p className="text-sm text-slate-500 mt-1">Manage user support tickets and send resolutions grouped by user.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
          />
        </div>
        <div className="relative min-w-[160px]">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No queries found</h3>
            <p className="text-slate-500 text-sm">You are all caught up!</p>
          </div>
        ) : (
          filteredGroups.map((g) => (
            <div key={g.user._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={g.user?.avatar || 'https://via.placeholder.com/40'} 
                      alt={g.user?.name}
                      className="w-12 h-12 rounded-full border border-slate-200 object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{g.user?.name} <span className="text-sm font-normal text-slate-500">(@{g.user?.username})</span></h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Mail className="h-3 w-3"/> {g.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {g.openCount > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                          {g.openCount} Open
                        </span>
                      )}
                      {g.resolvedCount > 0 && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          {g.resolvedCount} Resolved
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => setExpandedUserId(expandedUserId === g.user._id ? null : g.user._id)}
                      className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-center transition-all shadow-sm"
                      title={expandedUserId === g.user._id ? 'Collapse' : 'View Tickets'}
                    >
                      {expandedUserId === g.user._id ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {expandedUserId === g.user._id && (
                  <div className="mt-6 border-t border-slate-100 pt-6 animate-in slide-in-from-top-2 duration-300">
                    <h5 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                      <LayoutList className="h-4 w-4 text-slate-400" /> Ticket History
                    </h5>
                    
                    <div className="space-y-6">
                      {g.queries.map((query) => (
                        <div key={query._id} className="bg-white border-2 border-slate-100 rounded-xl overflow-hidden shadow-sm">
                          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600">
                              {query.category}
                            </span>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                              query.status === 'Resolved' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {query.status}
                            </span>
                          </div>
                          <div className="p-4">
                            <div className="mb-4">
                              <h6 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> Issue Description
                              </h6>
                              <p className="text-sm text-slate-700 whitespace-pre-wrap">{query.description}</p>
                            </div>

                            {query.status === 'Resolved' && query.adminReply && (
                              <div className="bg-green-50/50 rounded-lg p-3 border border-green-100 mb-4">
                                <h6 className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Previous Replies (Sent)
                                </h6>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{query.adminReply}</p>
                              </div>
                            )}

                            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                                {query.status === 'Resolved' ? 'Write Follow-up Email' : 'Write Resolution'}
                              </label>
                              <div className="flex gap-2 items-start">
                                <textarea
                                  value={resolvingId === query._id ? replyText : ''}
                                  onChange={(e) => {
                                    setResolvingId(query._id);
                                    setReplyText(e.target.value);
                                  }}
                                  placeholder="Type response to this specific ticket..."
                                  rows="2"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all resize-none"
                                />
                                <button
                                  onClick={() => handleResolve(query._id)}
                                  disabled={resolvingId === query._id && !replyText.trim()}
                                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 h-[54px] w-24 shrink-0"
                                >
                                  {resolvingId === query._id && isSubmitting ? (
                                    <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                  ) : (
                                    <>Send <Send className="h-3.5 w-3.5" /></>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
