'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

const getUserIdFromToken = () => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  } catch {
    return null;
  }
};

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  const userId = typeof window !== 'undefined' ? getUserIdFromToken() : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/adaptive/recommendations/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } catch {
        toast.error('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold tracking-tighter mb-4">Defense Recommendations</h1>
      <p className="text-muted-foreground mb-10">Personalized actions based on your quiz mistakes and phishing attempts</p>

      {loading ? (
        <div>Loading your recommendations...</div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6">
              <div className="font-medium text-lg">{rec.title}</div>
              <div className="text-muted-foreground mt-2">{rec.description}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-border rounded-3xl">No personalized recommendations yet. Complete more quizzes.</div>
      )}
    </div>
  );
}
