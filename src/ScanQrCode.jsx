import React, { useEffect, useRef, useState } from 'react';
import { verifyGuestByQrCode } from './api';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useNavigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';

const ScanQrCode = ({ token }) => {
  const [result, setResult] = useState('');
  const [guest, setGuest] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scanning, setScanning] = useState(false);
  const [videoInputDevices, setVideoInputDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [activeDeviceId, setActiveDeviceId] = useState('');
  const [scannerReady, setScannerReady] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', color: '#166534' });
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const scannerPromiseRef = useRef(Promise.resolve());
  const navigate = useNavigate();

  // Ambil daftar kamera
  // useEffect(() => {
  //   BrowserMultiFormatReader.listVideoInputDevices().then(devices => {
  //     setVideoInputDevices(devices);
  //     setSelectedDeviceId(prev => prev || devices[0]?.deviceId);
  //   });
  // }, []);

  useEffect(() => {
    BrowserMultiFormatReader.listVideoInputDevices()
      .then(devices => {
        if (devices.length === 0) {
          setError('Tidak ada kamera yang terdeteksi di perangkat ini.');
        } else {
          setVideoInputDevices(devices);

          // Hanya set selected jika belum ada pilihan
          if (!selectedDeviceId) {
            setSelectedDeviceId(devices[0].deviceId);
            setActiveDeviceId(devices[0].deviceId); // Aktifkan langsung hanya jika belum pernah dipilih
          }
        }
      })
      .catch(err => {
        console.error('Gagal mendapatkan daftar kamera:', err);
        setError('Gagal mendapatkan daftar kamera. Pastikan izin kamera diaktifkan.');
      });
  }, []);
  
    // Inisialisasi scanner setiap ganti kamera/token
  useEffect(() => {
    if (!activeDeviceId) return; // Jangan jalan kalau belum ada kamera

    let cancelled = false;
    const reader = new BrowserMultiFormatReader();
    codeReaderRef.current = reader;

    const cleanup = async () => {
      try {
        await reader.reset();
      } catch (e) {
        console.warn('Reset error:', e);
      }
      const video = videoRef.current;
      if (video?.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    };

    const scanLoop = async () => {
      while (!cancelled) {
        try {
          const result = await reader.decodeOnceFromVideoDevice(activeDeviceId, videoRef.current);
          if (result && result.getText) {
            const data = result.getText();
            setResult(data);
            setScanning(false);

            try {
              const res = await verifyGuestByQrCode(data, token);
              if (res) {
                setGuest(res.guest);
                setSuccess('Tamu berhasil diverifikasi!');
                setError('');
              } else {
                setError('Tamu sudah diverifikasi atau QR tidak valid.');
                setGuest(null);
                setSuccess('');
              }
            } catch {
              setError('QR tidak valid atau tamu sudah diverifikasi.');
              setGuest(null);
              setSuccess('');
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (err) {
          if (cancelled) return;
          console.warn('Scan error:', err.message);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    };

    const setup = async () => {
      await cleanup();
      setScanning(true);
      setScannerReady(true);
      scanLoop();
    };

    setup();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [activeDeviceId, token]);


  // useEffect(() => {
  //   // if (success) setSnackbar({ open: true, message: success, color: '#16a34a' });
  //   if (!success && error) setSnackbar({ open: true, message: error, color: '#dc2626' });
  // }, [success, error]);

  // useEffect(() => {
  //   if (success && guest && guest.name) {
  //     setSnackbar({ open: true, message: `${success} | Tamu: ${guest.name} (${guest.address})`, color: '#16a34a' });
  //   } 
  //   // else if (success) {
  //   //   setSnackbar({ open: true, message: success, color: '#16a34a' });
  //   // } else if (guest && guest.name) {
  //   //   setSnackbar({ open: true, message: `Tamu: ${guest.name} (${guest.address})`, color: '#2563eb' });
  //   // }
  // }, [success, guest]);

  // Snackbar auto hide
  useEffect(() => {
    if (snackbar.open) {
      const t = setTimeout(() => setSnackbar(s => ({ ...s, open: false })), 2500);
      return () => clearTimeout(t);
    }
  }, [snackbar.open]);


  return (
   <div style={{ maxWidth: 400, margin: '10px auto', padding: 24, position: 'relative' }}>
      <h2>Scan QR Code Tamu</h2>
      
      <button
        onClick={() => navigate('/admin')}
        style={{
          marginBottom: 16,
          background: '#2563eb',
          color: 'white',
          padding: '8px 20px',
          borderRadius: 8,
          border: 'none',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 1px 4px #0002'
        }}
      >
        &larr; Kembali ke Admin Panel
      </button>

      {videoInputDevices.length > 1 && (
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="camera-select">Pilih Kamera: </label>
          <select
            value={selectedDeviceId}
            onChange={(e) => {
              setSelectedDeviceId(e.target.value);
              setActiveDeviceId(e.target.value); // trigger scanner ulang
            }}
          >
            {videoInputDevices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Kamera ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ position: 'relative', width: '100%' }}>
        <video
          ref={videoRef}
          style={{
            width: '100%',
            borderRadius: 8,
            background: '#222',
            aspectRatio: '4 / 3', // Tambahkan rasio agar tidak berubah-ubah
            objectFit: 'cover'
          }}
          autoPlay
          playsInline
        />
        {scanning && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600,
            fontSize: 18
          }}>
            Mencari QR Code...
          </div>
        )}
      </div>

      {/* Hasil Scan QR / Info Tamu */}
      <div style={{ minHeight: 120, marginTop: 16 }}>
        {result && (
          <div style={{
            fontSize: 12,
            color: '#6b7280',
            marginBottom: 8,
            fontStyle: 'italic'
          }}>
            QR Code: {result}
          </div>
        )}

        {guest && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            padding: '16px 20px',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            color: '#166534'
          }}>
            <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>✅ Tamu Terverifikasi</div>
            <div><b>Nama:</b> {guest.name}</div>
            <div><b>Alamat:</b> {guest.address}</div>
            <div><b>Hadir:</b> {guest.hasVisited ? '✅ Ya' : '❌ Belum'}</div>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            padding: '14px 20px',
            borderRadius: 12,
            color: '#b91c1c',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            marginTop: 12,
            transition: 'all 0.3s ease',
          }}>
            ❗ {error}
          </div>
        )}
      </div>

      {snackbar.open && (
        <div style={{
          position: 'fixed',
          left: '50%',
          bottom: 32,
          transform: 'translateX(-50%)',
          background: snackbar.color,
          color: '#fff',
          padding: '12px 32px',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 16,
          boxShadow: '0 2px 12px #0003',
          zIndex: 9999,
          transition: 'all 0.3s',
        }}>
          {snackbar.message}
        </div>
      )}
    </div>

  );
};

export default ScanQrCode;
