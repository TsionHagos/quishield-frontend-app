'use client';

import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const containerId = 'qr-reader';

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        containerId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        },
        false // verbose
      );

      scannerRef.current.render(
        (decodedText) => {
          onScanSuccess(decodedText);
          // Stop scanning after successful scan
          if (scannerRef.current) {
            scannerRef.current.clear().catch(console.error);
          }
        },
        (error) => {
          if (onScanError) onScanError(error);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div id={containerId} className="w-full rounded-2xl overflow-hidden border border-border bg-black" />
      <p className="text-center text-sm text-muted-foreground mt-4">
        Point camera at QR code
      </p>
    </div>
  );
}
