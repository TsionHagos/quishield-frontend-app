'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

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

export default function UserDashboard() {
  const [riskData, setRiskData] = useState<any>(null);
  const [scanCount, setScanCount] = useState<number | null>(null);
  const [trainingProgress, setTrainingProgress] = useState<number | null>(null);
  const [quizAvg, setQuizAvg] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== 'undefined' ? getUserIdFromToken() : null;
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

  useEffect(() => {
    if (!userId || !token) return;

    const fetchAll = async () => {
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Fetch risk score
        const riskRes = await fetch(`${API_BASE}/analytics/risk-score/${userId}`, { headers });
        if (riskRes.ok) {
          const data = await riskRes.json();
          setRiskData(data);
          // Try to extract scan count from risk score breakdown
          if (data.scan_count !== undefined) {
            setScanCount(data.scan_count);
          }
        }
      } catch (e) {
        console.error('Failed to fetch risk score', e);
      }

      try {
        // Fetch scan logs (fallback for scan count)
        if (scanCount === null) {
          const logsRes = await fetch(`${API_BASE}/scan/logs/user/${userId}`, { headers });
          if (logsRes.ok) {
            const logsData = await logsRes.json();
            const logs = logsData.scans || logsData.logs || logsData || [];
            setScanCount(Array.isArray(logs) ? logs.length : 0);
          } else {
            setScanCount(0);
          }
        }
      } catch (e) {
        setScanCount(0);
      }

      try {
        // Fetch training progress
        const progRes = await fetch(`${API_BASE}/awareness/progress/${userId}`, { headers });
        if (progRes.ok) {
          const progData = await progRes.json();
          if (Array.isArray(progData)) {
            const completedCount = progData.filter((p: any) => p.completed === true).length;
            setTrainingProgress(Math.round((completedCount / 4) * 100));
          } else {
            setTrainingProgress(0);
          }
        } else {
          setTrainingProgress(0);
        }
      } catch (e) {
        setTrainingProgress(0);
      }

      try {
        // Fetch quiz results
        const quizRes = await fetch(`${API_BASE}/awareness/quiz/results/${userId}`, { headers });
        if (quizRes.ok) {
          const quizData = await quizRes.json();
          if (Array.isArray(quizData) && quizData.length > 0) {
            const total = quizData.reduce((sum: number, r: any) => sum + Number(r.score), 0);
            const avg = Math.round(total / quizData.length);
            setQuizAvg(avg);
          } else {
            setQuizAvg(0);
          }
        } else {
          setQuizAvg(0);
        }
      } catch (e) {
        setQuizAvg(0);
      }

      setLoading(false);
    };

    fetchAll();
  }, [userId, token]);

  const getRiskLevel = (score: number) => {
    if (score === 0) return { label: 'No Risk', color: 'emerald' };
    if (score <= 30) return { label: 'Low Risk', color: 'emerald' };
    if (score <= 70) return { label: 'Medium Risk', color: 'yellow' };
    return { label: 'High Risk', color: 'red' };
  };

  const riskLevel = riskData ? getRiskLevel(riskData.score) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-8 pt-14">
        <div className="mb-12">
          <div className="text-sm text-primary tracking-[2px] font-semibold mb-3">USER DASHBOARD</div>
          <h1 className="text-6xl font-bold tracking-tighter">Your Progress</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-card p-8 border border-border">
            <div className="text-emerald-400 text-sm font-medium">SCAN HISTORY</div>
            {loading ? (
              <p className="mt-9 text-3xl text-muted-foreground">Loading...</p>
            ) : (
              <>
                <p className="mt-9 text-7xl font-bold">{scanCount ?? 0}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {scanCount === 0 ? 'No scans yet' : 'Total QR scans analyzed'}
                </p>
              </>
            )}
          </div>
          <div className="rounded-3xl bg-card p-8 border border-border">
            <div className="text-emerald-400 text-sm font-medium">TRAINING PROGRESS</div>
            {loading ? (
              <p className="mt-9 text-3xl text-muted-foreground">Loading...</p>
            ) : (
              <>
                <p className="mt-9 text-7xl font-bold">{trainingProgress ?? 0}%</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {trainingProgress === 0 ? 'Not started yet' : 'Modules completed'}
                </p>
              </>
            )}
          </div>
          <div className="rounded-3xl bg-card p-8 border border-border">
            <div className="text-emerald-400 text-sm font-medium">AVERAGE QUIZ SCORE</div>
            {loading ? (
              <p className="mt-9 text-3xl text-muted-foreground">Loading...</p>
            ) : (
              <>
                <p className="mt-9 text-7xl font-bold">{quizAvg ?? 0}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {quizAvg === 0 ? 'No quizzes taken yet' : 'Average across all quizzes'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Risk Score Card */}
        <div className="mt-10">
          <div className="mb-4 text-sm font-medium text-muted-foreground">RISK ASSESSMENT</div>

          {loading ? (
            <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground">
              Loading risk score...
            </div>
          ) : riskData ? (
            <div className="rounded-3xl border border-border bg-card p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                  <div className={`text-8xl font-bold tracking-tighter ${riskLevel?.color === 'emerald' ? 'text-emerald-400' : riskLevel?.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {riskData.score}
                  </div>
                  <div className={`text-3xl font-semibold mt-1 ${riskLevel?.color === 'emerald' ? 'text-emerald-400' : riskLevel?.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {riskLevel?.label}
                  </div>
                  <p className="mt-4 max-w-md text-sm text-muted-foreground">
                    Your risk score is calculated based on recent suspicious activities. Lower is better.
                  </p>
                </div>

                <div className="md:w-96">
                  <div className="text-sm font-medium mb-4 text-muted-foreground">Risk Breakdown</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>{riskData.factors?.scanned_qr ? '✓' : '✗'} Scanned a QR code</span>
                      <span className="font-mono text-muted-foreground">+20</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{riskData.factors?.visited_phishing ? '✓' : '✗'} Visited phishing page</span>
                      <span className="font-mono text-muted-foreground">+40</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{riskData.factors?.submitted_credentials ? '✓' : '✗'} Submitted credentials</span>
                      <span className="font-mono text-muted-foreground">+40</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground">
              Risk data unavailable
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <Link href="/dashboard/scan" className="inline-block text-xl font-medium bg-primary text-primary-foreground px-16 py-4 rounded-2xl">
            Open QR Scanner →
          </Link>
        </div>
      </div>
    </div>
  );
}
