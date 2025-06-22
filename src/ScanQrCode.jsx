import React, { useEffect, useRef, useState } from 'react';
import { verifyGuestByQrCode } from './api';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useNavigate } from 'react-router-dom';

const ScanQrCode = ({ token }) => {
  const [result, setResult] = useState('');
  const [guest, setGuest] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scanning, setScanning] = useState(false);
  const [videoInputDevices, setVideoInputDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(undefined);
  const [scannerReady, setScannerReady] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', color: '#166534' });
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const scannerPromiseRef = useRef(Promise.resolve());
  const navigate = useNavigate();

  // Ambil daftar kamera
  useEffect(() => {
    BrowserMultiFormatReader.listVideoInputDevices().then(devices => {
      setVideoInputDevices(devices);
      if (devices.length > 0) setSelectedDeviceId(devices[0].deviceId);
    });
  }, []);

  // Inisialisasi scanner setiap ganti kamera/token
useEffect(() => {
  let cancelled = false;
  setScannerReady(false);
  setScanning(false);
  setError('');
  setResult('');
  setGuest(null);

  const cleanup = async () => {
    if (codeReaderRef.current) {
      try {
        await codeReaderRef.current.reset();
      } catch (e) {
        console.warn('Error on reset:', e);
      }
      codeReaderRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startScan = async () => {
    if (!videoRef.current) return;

    const reader = new BrowserMultiFormatReader();
    codeReaderRef.current = reader;

    try {
      setScanning(true);

      await new Promise((resolve) => setTimeout(resolve, 200));

      reader.decodeFromVideoDevice(
        selectedDeviceId || undefined,
        videoRef.current,
        async (result, err) => {
          if (cancelled) return;

          if (result) {
            const data = result.getText();
            setScanning(false);

            try {
              const res = await verifyGuestByQrCode(data, token);
              if (res) {
                setResult(data);
                setGuest(res.guest);
                setSuccess('Tamu berhasil diverifikasi!');
              } else {
                setError('Tamu sudah diverifikasi atau QR tidak valid.');
                setGuest(null);
              }
            } catch {
              setError('QR tidak valid atau tamu sudah diverifikasi.');
              setGuest(null);
            }

            // Stop scanning sementara
            try {
              await reader.reset();
            } catch (e) {
              console.warn('Reset error after scan:', e);
            }

            // Tunggu 5 detik sebelum memulai kembali scanning
            setTimeout(() => {
                setSuccess('');
              if (!cancelled) {
                startScan(); // Mulai scanning ulang
              }
            }, 2500); // delay 5 detik
          } else if (err && !(err instanceof DOMException)) {
            setError('Gagal membaca QR: ' + err.message);
          }
        }
      );

      setScannerReady(true);
    } catch (err) {
      console.error('Gagal akses kamera:', err);

      if (err.name === 'NotAllowedError') {
        setError('Akses kamera ditolak. Harap izinkan akses kamera.');
      } else if (err.name === 'NotFoundError') {
        setError('Tidak ditemukan kamera aktif di perangkat.');
      } else {
        setError('Gagal mengakses kamera: ' + err.message);
      }
    }
  };

  const setupScanner = async () => {
    await cleanup();
    await startScan();
  };

  setupScanner();

  return () => {
    cancelled = true;
    cleanup();
  };
}, [token, selectedDeviceId]);

  useEffect(() => {
    // if (success) setSnackbar({ open: true, message: success, color: '#16a34a' });
    if (!success && error) setSnackbar({ open: true, message: error, color: '#dc2626' });
  }, [success, error]);

  useEffect(() => {
    if (success && guest && guest.name) {
      setSnackbar({ open: true, message: `${success} | Tamu: ${guest.name} (${guest.address})`, color: '#16a34a' });
    } 
    // else if (success) {
    //   setSnackbar({ open: true, message: success, color: '#16a34a' });
    // } else if (guest && guest.name) {
    //   setSnackbar({ open: true, message: `Tamu: ${guest.name} (${guest.address})`, color: '#2563eb' });
    // }
  }, [success, guest]);

  // Snackbar auto hide
  useEffect(() => {
    if (snackbar.open) {
      const t = setTimeout(() => setSnackbar(s => ({ ...s, open: false })), 2500);
      return () => clearTimeout(t);
    }
  }, [snackbar.open]);

  useEffect(() => {
    BrowserMultiFormatReader.listVideoInputDevices()
      .then(devices => {
        if (devices.length === 0) {
          setError('Tidak ada kamera yang terdeteksi di perangkat ini.');
        } else {
          setVideoInputDevices(devices);
          setSelectedDeviceId(devices[0].deviceId);
        }
      })
      .catch(err => {
        console.error('Gagal mendapatkan daftar kamera:', err);
        setError('Gagal mendapatkan daftar kamera. Pastikan izin kamera diaktifkan.');
      });
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: '10px auto', padding: 24 }}>
      <h2>Scan QR Code Tamu</h2>
      <button
        onClick={() => navigate('/admin')}
        style={{ marginBottom: 16, background: '#2563eb', color: 'white', padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}
      >
        &larr; Kembali ke Admin Panel
      </button>
      {videoInputDevices.length > 1 ? (
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="camera-select">Pilih Kamera: </label>
          <select
            id="camera-select"
            value={selectedDeviceId}
            onChange={e => setSelectedDeviceId(e.target.value)}
            style={{ padding: 4, borderRadius: 6 }}
          >
            {videoInputDevices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>{device.label || `Kamera ${device.deviceId}`}</option>
            ))}
          </select>
        </div>
      ): (
          <div style={{ color: 'red', marginTop: 16 }}>
            Tidak ada kamera terdeteksi. Coba gunakan browser lain atau cek izin akses kamera.
          </div>
        )}
      <video ref={videoRef} style={{ width: '100%', borderRadius: 8, background: '#222' }} autoPlay playsInline />
      {scanning && <div style={{ marginTop: 8 }}>Mencari QR code...</div>}
      {result && <div style={{ marginTop: 12 }}>QR: {result}</div>}
      {guest && (
        <div style={{ marginTop: 12 }}>
          <b>Nama:</b> {guest.name}<br />
          <b>Alamat:</b> {guest.address}<br />
          <b>Hadir:</b> {guest.hasVisited ? 'Ya' : 'Belum'}
        </div>
      )}
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
      {success && null}
      {error && null}
    </div>
  );
};

export default ScanQrCode;
