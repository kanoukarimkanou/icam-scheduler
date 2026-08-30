import { useState, useEffect, useCallback } from 'react';
import { supabase, fetchRendezVous } from './supabase';

export const useRealtimeRendezVous = (targetDate = null) => {
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRendezVous(targetDate);
      setRendezVous(data);
    } catch (err) {
      setError(err.message || 'Erreur chargement rendez-vous.');
    } finally {
      setLoading(false);
    }
  }, [targetDate]);

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel(`realtime-rdv-${targetDate || 'all'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rendez_vous' }, () => loadData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [targetDate, loadData]);

  return { rendezVous, loading, error, refresh: loadData };
};
