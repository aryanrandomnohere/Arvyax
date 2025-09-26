import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WellnessSession, api } from '../lib/api';
import { Layout } from '../components/Layout';
import { SessionCard } from '../components/SessionCard';
import { 
  Plus, 
  Search, 
  Filter, 
  Loader, 
  FileText, 
  Globe,
  TrendingUp,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

export function Dashboard() {
  const [sessions, setSessions] = useState<WellnessSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await api.getMySessions();
      if (response.data) {
        setSessions(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSession = (session: WellnessSession) => {
    navigate(`/editor/${session.id}`);
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await api.deleteSession(id);
      setSessions(sessions.filter(session => session.id !== id));
      toast.success('Session deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete session');
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: sessions.length,
    drafts: sessions.filter(s => s.status === 'draft').length,
    published: sessions.filter(s => s.status === 'published').length,
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto text-green-600 mb-4" />
            <p className="text-gray-600">Loading your sessions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Wellness Sessions
          </h1>
          <p className="text-gray-600">
            Create, manage, and publish your mindfulness and wellness content
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.drafts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => {
                    const sessionDate = new Date(s.created_at);
                    const now = new Date();
                    return sessionDate.getMonth() === now.getMonth() && 
                           sessionDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search sessions by title or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Drafts</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={() => navigate('/editor')}
              className="bg-gradient-to-r from-green-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Session
            </button>
          </div>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            {sessions.length === 0 ? (
              <div>
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first wellness session to get started on your journey
                </p>
                <button
                  onClick={() => navigate('/editor')}
                  className="bg-gradient-to-r from-green-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-purple-700 transition-all duration-200 inline-flex items-center font-medium"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Session
                </button>
              </div>
            ) : (
              <div>
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters to find what you're looking for
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onEdit={handleEditSession}
                onDelete={handleDeleteSession}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}