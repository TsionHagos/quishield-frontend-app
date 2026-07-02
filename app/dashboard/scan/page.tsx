'use client';

import { useState } from 'react';
import QRScanner from '@/components/QRScanner';
import { toast } from 'sonner';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [scannedUrl, setScannedUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

  const handleScanSuccess = async (decodedText: string) => {
    setIsScanning(false);
    setScannedUrl(decodedText);
    setLoading(true);

    try {
      const userId = sessionStorage.getItem('userId');

      const res = await fetch(`${API_BASE}/scan/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: decodedText,
          user_id: userId ? parseInt(userId) : null,
        }),
      });

      const data = await res.json();
      setResult(data);
      toast.success('Scan completed');
    } catch (err) {
      toast.error('Failed to assess risk');
    } finally {
      setLoading(false);
    }
  };

  const startScan = () => {
    setResult(null);
    setIsScanning(true);
  };

  const resetScan = () => {
    setResult(null);
    setScannedUrl('');
    setIsScanning(false);
  };

  const getRiskClass = (risk: string) => {
    if (risk === 'SAFE') return 'risk-safe';
    if (risk === 'SUSPICIOUS') return 'risk-suspicious';
    return 'risk-high';
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 md:py-16">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-center">QR Scanner</h1>
        <p className="text-muted-foreground text-center mb-10 text-lg">Scan suspicious QR codes</p>

        {!isScanning && !result && (
          <div className="text-center">
            <button
              onClick={startScan}
              className="w-full md:w-auto px-16 py-6 text-xl font-semibold rounded-2xl bg-primary hover:bg-primary/90 active:scale-[0.985] transition-all"
            >
              Start Camera Scan
            </button>
            <p className="mt-4 text-sm text-muted-foreground">
              Works best on mobile devices
            </p>
          </div>
        )}

        {isScanning && (
          <div className="mt-4">
            <QRScanner
              onScanSuccess={handleScanSuccess}
              onScanError={(err) => console.log(err)}
            />
            <button
              onClick={() => setIsScanning(false)}
              className="mt-6 w-full py-4 rounded-2xl border border-border text-sm font-medium"
            >
              Cancel Scan
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-lg text-muted-foreground">
            Analyzing QR code...
          </div>
        )}

        {result && (
          <div className="mt-8">
            <div className={`rounded-3xl p-8 border text-center ${getRiskClass(result.risk)}`}>
              <div className="uppercase tracking-[3px] text-sm font-medium mb-2">{result.risk}</div>
              <div className="text-4xl font-bold tracking-tight">{result.message}</div>
            </div>

            {result.warning && (
              <div className="mt-5 text-center text-lg text-muted-foreground">
                {result.warning}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={startScan}
                className="py-5 rounded-2xl bg-primary font-semibold tracking-wider"
              >
                Scan Again
              </button>
              <button
                onClick={resetScan}
                className="py-5 text-sm text-muted-foreground"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
