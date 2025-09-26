import { useEffect, useRef, useCallback } from 'react';
import { api, WellnessSession } from '../lib/api';
import toast from 'react-hot-toast';

interface UseAutoSaveProps {
  sessionId: string | null;
  data: {
    title: string;
    tags: string[];
    json_url: string;
  };
  onSaveSuccess?: (session: WellnessSession) => void;
}

export function useAutoSave({ sessionId, data, onSaveSuccess }: UseAutoSaveProps) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastSavedData = useRef(data);
  const isSavingRef = useRef(false);

  const saveSession = useCallback(async () => {
    if (isSavingRef.current || !sessionId) return;
    
    const hasChanges = 
      data.title !== lastSavedData.current.title ||
      JSON.stringify(data.tags) !== JSON.stringify(lastSavedData.current.tags) ||
      data.json_url !== lastSavedData.current.json_url;

    if (!hasChanges) return;

    isSavingRef.current = true;
    
    try {
      const response = await api.updateSession(sessionId, {
        title: data.title,
        tags: data.tags,
        json_url: data.json_url,
      });

      if (response.data) {
        lastSavedData.current = data;
        onSaveSuccess?.(response.data);
        
        // Show subtle save indicator
        toast.success('Auto-saved', {
          duration: 1500,
          icon: '💾',
          style: {
            fontSize: '12px',
            padding: '4px 8px',
          }
        });
      }
    } catch (error: any) {
      console.error('Auto-save error:', error);
      toast.error('Failed to auto-save');
    } finally {
      isSavingRef.current = false;
    }
  }, [sessionId, data, onSaveSuccess]);

  // Clear existing timeouts and set new ones
  const scheduleAutoSave = useCallback(() => {
    if (!sessionId) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule save after 5 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      saveSession();
    }, 5000);
  }, [sessionId, saveSession]);

  // Set up auto-save on data change (after inactivity)
  useEffect(() => {
    scheduleAutoSave();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scheduleAutoSave, data]);

  // Set up periodic auto-save (every 30 seconds)
  useEffect(() => {
    if (!sessionId) return;

    intervalRef.current = setInterval(() => {
      saveSession();
    }, 30000); // 30 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionId, saveSession]);

  return { saveNow: saveSession };
}