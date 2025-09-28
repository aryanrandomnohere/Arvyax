import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySessions();
  }, []);

  const fetchMySessions = async () => {
    try {
      const response = await axios.get('/api/sessions/my-sessions');
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load your sessions');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (sessionId) => {
    try {
      await axios.post('/api/sessions/my-sessions/publish', { sessionId });
      toast.success('Session published successfully!');
      fetchMySessions(); // Refresh the list
    } catch (error) {
      console.error('Error publishing session:', error);
      toast.error('Failed to publish session');
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await axios.delete(`/api/sessions/my-sessions/${sessionId}`);
      toast.success('Session deleted successfully!');
      fetchMySessions(); // Refresh the list
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div>Loading your sessions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1>My Sessions</h1>
        <Link to="/session-editor" className="btn btn-primary">
          Create New Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: '#6b7280', marginBottom: '1rem' }}>
            No sessions yet
          </h3>
          <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
            Create your first wellness session to get started!
          </p>
          <Link to="/session-editor" className="btn btn-primary">
            Create Your First Session
          </Link>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {sessions.map((session) => (
            <div key={session._id} className="card">
              <div className="card-header">
                <h3 className="card-title">{session.title}</h3>
                <span className={`badge ${session.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
                  {session.status}
                </span>
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
                marginBottom: '1rem',
                wordBreak: 'break-all'
              }}>
                <strong>JSON URL:</strong> {session.jsonFileUrl}
              </div>
              
              <div style={{ 
                color: '#6b7280', 
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                Created: {new Date(session.createdAt).toLocaleDateString()}
                {session.updatedAt !== session.createdAt && (
                  <span> • Updated: {new Date(session.updatedAt).toLocaleDateString()}</span>
                )}
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                flexWrap: 'wrap' 
              }}>
                <Link 
                  to={`/session-editor/${session._id}`} 
                  className="btn btn-outline"
                >
                  Edit
                </Link>
                
                {session.status === 'draft' && (
                  <button 
                    onClick={() => handlePublish(session._id)}
                    className="btn btn-success"
                  >
                    Publish
                  </button>
                )}
                
                <button 
                  onClick={() => handleDelete(session._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySessions;
