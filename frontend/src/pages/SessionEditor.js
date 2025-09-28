import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const SessionEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    jsonFileUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [sessionId, setSessionId] = useState(id || null);
  const [hasCreatedDraft, setHasCreatedDraft] = useState(false);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!formData.title.trim() || !formData.jsonFileUrl.trim()) {
      return;
    }

    // If we already created a draft but don't have sessionId yet, don't autosave
    if (hasCreatedDraft && !sessionId) {
      return;
    }

    try {
      setSaving(true);
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const response = await axios.post('/api/sessions/my-sessions/save-draft', {
        title: formData.title,
        tags: tagsArray,
        jsonFileUrl: formData.jsonFileUrl,
        sessionId: sessionId || undefined
      });

      // If this was a new session, update the session ID and redirect
      if (!sessionId && response.data.session) {
        const newSessionId = response.data.session._id;
        setSessionId(newSessionId);
        setHasCreatedDraft(true);
        navigate(`/session-editor/${newSessionId}`, { replace: true });
      }

      setAutoSaveStatus('Auto-saved');
      setHasUnsavedChanges(false);
      
      // Show success toast
      toast.success('Auto-saved', {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: 'white',
        },
      });
    } catch (error) {
      console.error('Auto-save error:', error);
      setAutoSaveStatus('Auto-save failed');
      
      // Show error toast
      toast.error('Auto-save failed', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#ef4444',
          color: 'white',
        },
      });
    } finally {
      setSaving(false);
    }
  }, [formData, sessionId, hasCreatedDraft, navigate]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timeoutId = setTimeout(() => {
      autoSave();
    }, 3000); // Auto-save after 5 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [formData, hasUnsavedChanges, autoSave]);

  // Initialize sessionId when we have an id from URL
  useEffect(() => {
    if (id && !sessionId) {
      setSessionId(id);
    }
  }, [id, sessionId]);

  // Load existing session if editing
  useEffect(() => {
    if (id) {
      loadSession();
    }
  }, [id]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/sessions/my-sessions/${id}`);
      const session = response.data.session;
      
      setFormData({
        title: session.title,
        tags: session.tags.join(', '),
        jsonFileUrl: session.jsonFileUrl
      });
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Failed to load session');
      navigate('/my-sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasUnsavedChanges(true);
    setAutoSaveStatus('Unsaved changes');
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim() || !formData.jsonFileUrl.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const response = await axios.post('/api/sessions/my-sessions/save-draft', {
        title: formData.title,
        tags: tagsArray,
        jsonFileUrl: formData.jsonFileUrl,
        sessionId: sessionId || undefined
      });

      toast.success('Draft saved successfully!');
      setHasUnsavedChanges(false);
      setAutoSaveStatus('');
      
      // If this was a new session, update the session ID and URL
      if (!sessionId && response.data.session) {
        const newSessionId = response.data.session._id;
        setSessionId(newSessionId);
        setHasCreatedDraft(true);
        navigate(`/session-editor/${newSessionId}`, { replace: true });
      }
    } catch (error) {
      console.error('Save draft error:', error);
      toast.error('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title.trim() || !formData.jsonFileUrl.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      // First save as draft if needed
      if (hasUnsavedChanges || !sessionId) {
        const tagsArray = formData.tags 
          ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : [];

        const draftResponse = await axios.post('/api/sessions/my-sessions/save-draft', {
          title: formData.title,
          tags: tagsArray,
          jsonFileUrl: formData.jsonFileUrl,
          sessionId: sessionId || undefined
        });

        // Use the session ID from the draft response
        const currentSessionId = draftResponse.data.session._id;
        
        // Update our session ID if it was a new session
        if (!sessionId) {
          setSessionId(currentSessionId);
          setHasCreatedDraft(true);
        }
        
        // Then publish
        await axios.post('/api/sessions/my-sessions/publish', { sessionId: currentSessionId });
      } else {
        // Just publish existing session
        await axios.post('/api/sessions/my-sessions/publish', { sessionId: sessionId });
      }

      toast.success('Session published successfully!');
      navigate('/my-sessions');
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish session');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div>Loading session...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <Toaster />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1>{sessionId ? 'Edit Session' : 'Create New Session'}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {autoSaveStatus && (
            <span style={{ 
              color: autoSaveStatus.includes('failed') ? '#ef4444' : '#10b981',
              fontSize: '0.875rem'
            }}>
              {autoSaveStatus}
            </span>
          )}
          {saving && (
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Saving...
            </span>
          )}
        </div>
      </div>

      <div className="card">
        <form>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Session Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter session title (e.g., Morning Yoga Flow)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter tags separated by commas (e.g., yoga, morning, beginner)"
            />
            <div style={{ 
              color: '#6b7280', 
              fontSize: '0.75rem', 
              marginTop: '0.25rem' 
            }}>
              Separate multiple tags with commas
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="jsonFileUrl" className="form-label">
              JSON File URL *
            </label>
            <input
              type="url"
              id="jsonFileUrl"
              name="jsonFileUrl"
              value={formData.jsonFileUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/session-data.json"
              required
            />
            <div style={{ 
              color: '#6b7280', 
              fontSize: '0.75rem', 
              marginTop: '0.25rem' 
            }}>
              URL to the JSON file containing your session data
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'flex-end',
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={() => navigate('/my-sessions')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving || !formData.title.trim() || !formData.jsonFileUrl.trim()}
              className="btn btn-secondary"
            >
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            
            <button
              type="button"
              onClick={handlePublish}
              disabled={saving || !formData.title.trim() || !formData.jsonFileUrl.trim()}
              className="btn btn-success"
            >
              {saving ? 'Publishing...' : 'Publish Session'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ 
        background: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        borderRadius: '0.5rem', 
        padding: '1rem', 
        marginTop: '1rem',
        fontSize: '0.875rem',
        color: '#475569'
      }}>
        <strong>💡 Tips:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>Your session will auto-save as a draft every 5 seconds while you type</li>
          <li>Use descriptive titles and relevant tags to help others find your sessions</li>
          <li>Make sure your JSON file URL is publicly accessible</li>
          <li>You can edit published sessions, but changes will need to be saved as a new draft</li>
        </ul>
      </div>
    </div>
  );
};

export default SessionEditor;
