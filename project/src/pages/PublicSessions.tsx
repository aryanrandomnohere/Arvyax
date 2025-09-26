import { useState, useEffect } from 'react';
import { WellnessSession, api } from '../lib/api';
import { Layout } from '../components/Layout';
import { SessionCard } from '../components/SessionCard';
import { Search, Filter, Loader, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export function PublicSessions() {
  const [sessions, setSessions] = useState<WellnessSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPublicSessions();
  }, []);

  const loadPublicSessions = async () => {
    try {
      setLoading(true);
      const response = await api.getPublishedSessions();
      if (response.data) {
        setSessions(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load public sessions');
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto text-green-600 mb-4" />
            <p className="text-gray-600">Loading published sessions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Wellness Sessions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover mindfulness practices, yoga flows, and meditation sessions created by our community
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search wellness sessions by title or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            {sessions.length === 0 ? (
              <div>
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No published sessions yet</h3>
                <p className="text-gray-600">
                  Be the first to publish a wellness session for the community
                </p>
              </div>
            ) : (
              <div>
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
                <p className="text-gray-600">
                  Try adjusting your search to find what you're looking for
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {searchTerm ? `Search Results (${filteredSessions.length})` : `All Sessions (${filteredSessions.length})`}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onEdit={() => {}} // No edit for public sessions
                  onDelete={() => {}} // No delete for public sessions
                  showActions={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}