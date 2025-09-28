import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/api/sessions');
      setSessions(response.data.sessions);
      setFilteredSessions(response.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSessions(sessions);
    } else {
      const filtered = sessions.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredSessions(filtered);
    }
  }, [searchTerm, sessions]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div>Loading sessions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Toaster />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1>Wellness Sessions</h1>
        <Link to="/session-editor" className="btn btn-primary">
          Create New Session
        </Link>
      </div>

      {/* Search Bar */}
      <div style={{ 
        marginBottom: '2rem',
        maxWidth: '500px'
      }}>
        <input
          type="text"
          placeholder="Search sessions by title or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
      </div>

      {filteredSessions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: '#6b7280', marginBottom: '1rem' }}>
            No published sessions yet
          </h3>
          <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
            Be the first to create and publish a wellness session!
          </p>
          <Link to="/session-editor" className="btn btn-primary">
            Create Your First Session
          </Link>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredSessions.map((session) => (
            <div key={session._id} className="card">
              <div className="card-header">
                <h3 className="card-title">{session.title}</h3>
              </div>
              
              {session.tags && session.tags.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem' 
                  }}>
                    {session.tags.map((tag, index) => (
                      <span 
                        key={index}
                        style={{
                          background: '#f3f4f6',
                          color: '#374151',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{ 
                color: '#6b7280', 
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                Created by {session.userId?.email || 'Unknown User'}
              </div>
              
              <div style={{ 
                color: '#6b7280', 
                fontSize: '0.875rem'
              }}>
                {new Date(session.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
