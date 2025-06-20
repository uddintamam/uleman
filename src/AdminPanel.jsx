import React, { useEffect, useRef, useState } from 'react';
import { login, getGuests, getWeddingInfos, postGuest, editGuest, getGifts, deleteGuest, updateGift, postGift, deleteGift, deleteStoryBoard, postStoryBoard, updateStoryBoard, getStoryBoards } from './api';
import { Link } from 'react-router-dom';
import { Edit3, Share2, Trash2 } from "lucide-react";

const AdminPanel = ({ token }) => {
  const [dashboard, setDashboard] = useState(null);
  const userId = localStorage.getItem('admin_userId');

  const [error, setError] = useState('');
  const [guests, setGuests] = useState([]);
  const [guestForm, setGuestForm] = useState({ name: '', address: '', greeting: '' });
  const [guestId, setGuestId] = useState('');
  const [guestMsg, setGuestMsg] = useState('');

  const divRef = useRef();
  const prevMessageRef = useRef('');

  const [gifts, setGifts] = useState([]);
  const [giftForm, setGiftForm] = useState({ bankName: '', accountName: '', accountNumber: '' });
  const [giftId, setGiftId] = useState('');
  const [giftMsg, setGiftMsg] = useState('');


  const [storyBoards, setStoryBoards] = useState([]);
  const [storyBoardForm, setStoryBoardForm] = useState({ title : '', message : '' });
  const [storyBoardId, setStoryBoardId] = useState('');
  const [storyBoardMsg, setStoryBoardMsg] = useState('');
  const [btnAddStoryBoard, setBtnAddStoryBoard] = useState(true);


  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [showAddWedding, setShowAddWedding] = useState(false);
  const [weddingForm, setWeddingForm] = useState({
    brideNickName: '',
    groomNickName: '',
    brideName: '',
    groomName: '',
    fatherBrideName: '',
    motherBrideName: '',
    fatherGroomName: '',
    motherGroomName: '',
    brideBirthOrder: '',
    groomBirthOrder: '',
    date: '',
    akadTime: '',
    receptionTime: '',
    venue: '',
    address: '',
    mapUrl: '',
    additionalInfo: ''
  });
  const [weddingMsg, setWeddingMsg] = useState('');
  const [weddingInfos, setWeddingInfos] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', color: '#166534' });

  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.address.toLowerCase().includes(search.toLowerCase()) ||
    (g.greeting || '').toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
  const pagedGuests = filteredGuests.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const fetchDashboard = async (token) => {
    try {
      const guests = await getGuests(userId);
      setGuests(guests);
      const gifts = await getGifts(userId);
      setGifts(gifts);

      const story = await getStoryBoards(userId);
      setStoryBoards(story);

      const hadir = guests.filter(g => g.hasVisited).length;
      setDashboard({ total: guests.length, hadir });
    } catch (err) {
      setError('Gagal mengambil data dashboard');
    }
  };

  const handleDownloadExcel = () => {
    const header = ['Nama', 'Alamat', 'Sapaan', 'QR Code', 'Telah Berkunjung'];
    const rows = guests.map(g => [g.name, g.address, g.greeting, g.qrCode, g.hasVisited ? 'Ya' : 'Tidak']);
    let csv = header.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-tamu.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGuestFormChange = e => {
    setGuestForm({ ...guestForm, [e.target.name]: e.target.value });
  };

  const handleGuestFormSubmit = async e => {
    e.preventDefault();
    setGuestMsg('');
    if (!guestId) {
      try {
        await postGuest({ ...guestForm, userId }, token); // userId bisa diganti sesuai user login
        setGuestMsg('Tamu berhasil ditambahkan');
        setGuestForm({ name: '', address: '', greeting: '' });
        fetchDashboard(token);
      } catch (err) {
        setGuestMsg('Gagal menambah tamu');
      }
    } else {
      
      try {
        await editGuest({ ...guestForm, userId }, guestId, token); // userId bisa diganti sesuai user login
        setGuestMsg('Tamu berhasil diubah');
        setGuestForm({ name: '', address: '', greeting: '' });
        fetchDashboard(token);
      } catch (err) {
        setGuestMsg('Gagal mengubah tamu');
      }

      setGuestId('');
    }
  };

  useEffect(() => {
    // Hanya set innerHTML jika message dari luar berubah (bukan karena user mengetik)
    if (
      divRef.current &&
      storyBoardForm.message !== prevMessageRef.current &&
      divRef.current.innerHTML !== storyBoardForm.message
    ) {
      divRef.current.innerHTML = storyBoardForm.message || '';
      prevMessageRef.current = storyBoardForm.message;
    }
  }, [storyBoardForm.message]);

  const handleInput = (e) => {
    const value = e.currentTarget.innerHTML;
    prevMessageRef.current = value;

    handleStoryBoardFormChange({
      target: { name: 'message', value },
    });
  };

  const handleGiftFormChange = e => {
    setGiftForm({ ...giftForm, [e.target.name]: e.target.value });
  };

  const handleGiftFormSubmit = async e => {
    e.preventDefault();
    setGiftMsg('');
    if (!giftId) {
      try {
        await postGift({ ...giftForm, userId }, token); // userId bisa diganti sesuai user login
        setGiftMsg('Gift berhasil ditambahkan');
        setGiftForm({ bankName: '', accountName: '', accountNumber: '' });
        fetchDashboard(token);
      } catch (err) {
        setGiftMsg('Gagal menambah gift');
      }
    } else {
      
      try {
        await updateGift({ ...giftForm, userId }, giftId, token); // userId bisa diganti sesuai user login
        setGiftMsg('Gift berhasil diubah');
        setGiftForm({ bankName: '', accountName: '', accountNumber: '' });
        fetchDashboard(token);
      } catch (err) {
        setGiftMsg('Gagal mengubah gift');
      }

      setGiftId('');
    }
  };

  const handleWeddingFormChange = e => {
    setWeddingForm({ ...weddingForm, [e.target.name]: e.target.value });
  };
  const handleWeddingFormSubmit = async e => {
    e.preventDefault();
    setWeddingMsg('');
    
    try {
      const formData = { ...weddingForm, userId };
      if (weddingInfos.length > 0) {
        // Edit mode
        const { updateWeddingInfo } = await import('./api');
        await updateWeddingInfo(weddingInfos[0].id, formData, token);
        setWeddingMsg('Wedding info berhasil diupdate');
      } else {
        // Add mode
        const { postWeddingInfo } = await import('./api');
        await postWeddingInfo(formData, token);
        setWeddingMsg('Wedding info berhasil ditambahkan');
      }
      setShowAddWedding(false);
      // Refresh wedding info
      getWeddingInfos(userId).then(setWeddingInfos).catch(() => {});
    } catch (err) {
      setWeddingMsg('Gagal menyimpan wedding info');
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard(token);
      // Ambil wedding info berdasarkan userId (misal userId=1, sesuaikan jika ada sistem user login)
      getWeddingInfos(1).then(setWeddingInfos).catch(() => {});
    }
  }, [token]);

  // Saat weddingInfos.length > 0, form otomatis mode edit dan field terisi data lama
  useEffect(() => {
    if (weddingInfos.length > 0) {
      const info = weddingInfos[0];
      setWeddingForm({
        brideNickName: info.brideNickName || '',
        groomNickName: info.groomNickName || '',
        brideName: info.brideName || '',
        groomName: info.groomName || '',
        fatherBrideName: info.fatherBrideName || '',
        motherBrideName: info.motherBrideName || '',
        fatherGroomName: info.fatherGroomName || '',
        motherGroomName: info.motherGroomName || '',
        brideBirthOrder: info.brideBirthOrder || '',
        groomBirthOrder: info.groomBirthOrder || '',
        date: info.date ? info.date.slice(0, 10) : '',
        akadTime: info.akadTime || '',
        receptionTime: info.receptionTime || '',
        venue: info.venue || '',
        address: info.address || '',
        mapUrl: info.mapUrl || '',
        additionalInfo: info.additionalInfo || ''
      });
    }
  }, [weddingInfos]);

  if (!token) {
    return null;
  }
  
  const handleStoryBoardFormChange = e => {
    setStoryBoardForm({ ...storyBoardForm, [e.target.name]: e.target.value });
  };

  const handleStoryBoardFormSubmit = async e => {
    e.preventDefault();
    setStoryBoardMsg('');
    if (!storyBoardId) {
      try {
        await postStoryBoard({ ...storyBoardForm, userId }, token); // userId bisa diganti sesuai user login
        setStoryBoardMsg('StoryBoard berhasil ditambahkan');
        setStoryBoardForm({ title : '', message : '' });
        fetchDashboard(token);
      } catch (err) {
        setStoryBoardMsg('Gagal menambah storyBoard');
      }
    } else {
      
      try {
        await updateStoryBoard({ ...storyBoardForm, userId }, storyBoardId, token); // userId bisa diganti sesuai user login
        setStoryBoardMsg('StoryBoard berhasil diubah');
        setStoryBoardForm({ title : '', message : '' });
        fetchDashboard(token);
      } catch (err) {
        setStoryBoardMsg('Gagal mengubah storyBoard');
      }

      setStoryBoardId('');
    }

    setBtnAddStoryBoard(true);
  };

 const handleStoryBoardEdit = (storyBoard) => {
    setStoryBoardForm({ title: storyBoard.title, message: storyBoard.message });
    setStoryBoardId(storyBoard.id);
    setBtnAddStoryBoard(false);
    // Implementasi form edit bisa ditambahkan di sini
  };

  const handleStoryBoardDelete = async (storyBoard) => {
    if (window.confirm('Yakin hapus story board ini?')) {
       await deleteStoryBoard(storyBoard.id, token); // userId bisa diganti sesuai user login
        setStoryBoardMsg('story board berhasil dihapus');
        setStoryBoardForm({ title : '', message : '' });
        fetchDashboard(token);
    }
  };

  const handleEdit = (guest) => {
    // setSnackbar({ open: true, message: 'Edit guest: ' + guest.name, color: '#fbbf24' });
    setGuestForm({ name: guest.name, address: guest.address, greeting: guest.greeting });
    setGuestId(guest.id);
    // Implementasi form edit bisa ditambahkan di sini
  };

    const handleGiftEdit = (gift) => {
    setGiftForm({ bankName: gift.bankName, accountName: gift.accountName, accountNumber: gift.accountNumber });
    setGiftId(gift.id);
    // Implementasi form edit bisa ditambahkan di sini
  };

  const handleShare = (guest) => {
    navigator.clipboard.writeText(window.location.origin + '/guest/' + guest.qrCode);
    setSnackbar({ open: true, message: 'Link undangan disalin!', color: '#2563eb' });
  };

  const handleDelete = async (guest) => {
    if (window.confirm('Yakin hapus tamu ini?')) {
       await deleteGuest(guest.id, token); // userId bisa diganti sesuai user login
        setGuestMsg('Tamu berhasil dihapus');
        setGuestForm({ name: '', address: '', greeting: '' });
        fetchDashboard(token);
    }
  };

  const handleGiftDelete = async (gift) => {
    if (window.confirm('Yakin hapus tamu ini?')) {
       await deleteGift(gift.id, token); // userId bisa diganti sesuai user login
        setGiftMsg('Tamu berhasil dihapus');
        setGiftForm({ bankName: '', accountName: '', accountNumber: '' });
        fetchDashboard(token);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_userId');
    window.location.href = '/login';
  };
  

  // Snackbar auto hide interval
  const SNACKBAR_AUTOHIDE = 2500; // ms

  useEffect(() => {
    if (snackbar.open) {
      const t = setTimeout(() => setSnackbar(s => ({ ...s, open: false })), SNACKBAR_AUTOHIDE);
      return () => clearTimeout(t);
    }
  }, [snackbar.open]);

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-slate-50 rounded-2xl shadow-lg">
     <h2 className="text-center text-2xl mb-6 text-green-800 tracking-wide font-semibold">
        Admin Dashboard
      </h2>
      <div className="flex flex-wrap gap-3 justify-center sm:justify-between items-center mb-6">
        <Link to="/scan" >
          <button className="bg-red-600 text-white font-semibold px-5 py-2 rounded-lg shadow"
          style={{ background: '#6a5acd', color: 'white', padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #0002', marginLeft: 12 }}>
            Scan QR Code Tamu
          </button>
        </Link>

        <button onClick={handleDownloadExcel} className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow"
                  style={{ background: '#0000ff', color: 'white', padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #0002', marginLeft: 12 }}>
          Download Data Tamu (Excel)
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white font-semibold px-5 py-2 rounded-lg shadow"
                    style={{ background: '#dc2626', color: 'white', padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #0002', marginLeft: 12 }}
        >
          Logout
        </button>
      </div>
      {weddingMsg && <div style={{ color: weddingMsg.includes('berhasil') ? '#16a34a' : '#dc2626', marginBottom: 16, textAlign: 'center' }}>{weddingMsg}</div>}
    {dashboard && (
        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 8px #0001', textAlign: 'center' }}>
            <div style={{ fontSize: 18, color: '#64748b' }}>Total Undangan</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#166534' }}>{dashboard.total}</div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 8px #0001', textAlign: 'center' }}>
            <div style={{ fontSize: 18, color: '#64748b' }}>Undangan Hadir</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#166534' }}>{dashboard.hadir}</div>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-3 justify-center sm:justify-between items-center mb-6">
        <button
          onClick={() => setShowAddWedding(v => !v)}
          className={`text-white font-semibold px-5 py-2 rounded-lg shadow ${weddingInfos.length > 0 ? 'bg-yellow-400' : 'bg-green-600'}`}
                    style={{ background: '#3cb371', color: 'white', padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #0002', marginLeft: 12 }}
        >
          {weddingInfos.length > 0 ? 'Edit Wedding Info' : 'Add Wedding Info'}
        </button>
      </div>
      {showAddWedding && (
        <form onSubmit={handleWeddingFormSubmit} style={{ marginBottom: 24, background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 8px #0001', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input name="brideNickName" placeholder="Nama Panggilan Wanita" value={weddingForm.brideNickName} onChange={handleWeddingFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="groomNickName" placeholder="Nama Panggilan Pria" value={weddingForm.groomNickName} onChange={handleWeddingFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="brideName" placeholder="Nama Lengkap Wanita" value={weddingForm.brideName} onChange={handleWeddingFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="groomName" placeholder="Nama Lengkap Pria" value={weddingForm.groomName} onChange={handleWeddingFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="fatherBrideName" placeholder="Nama Ayah Wanita" value={weddingForm.fatherBrideName} onChange={handleWeddingFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="motherBrideName" placeholder="Nama Ibu Wanita" value={weddingForm.motherBrideName} onChange={handleWeddingFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="fatherGroomName" placeholder="Nama Ayah Pria" value={weddingForm.fatherGroomName} onChange={handleWeddingFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="motherGroomName" placeholder="Nama Ibu Pria" value={weddingForm.motherGroomName} onChange={handleWeddingFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="brideBirthOrder" placeholder="Anak ke- (Wanita)" value={weddingForm.brideBirthOrder} onChange={handleWeddingFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="groomBirthOrder" placeholder="Anak ke- (Pria)" value={weddingForm.groomBirthOrder} onChange={handleWeddingFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="date" type="date" placeholder="Tanggal" value={weddingForm.date} onChange={handleWeddingFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="akadTime" placeholder="Jam Akad" value={weddingForm.akadTime} onChange={handleWeddingFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="receptionTime" placeholder="Jam Resepsi" value={weddingForm.receptionTime} onChange={handleWeddingFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="venue" placeholder="Venue" value={weddingForm.venue} onChange={handleWeddingFormChange} required style={{ flex: 2, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="address" placeholder="Alamat Lengkap" value={weddingForm.address} onChange={handleWeddingFormChange} required style={{ flex: 2, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="mapUrl" placeholder="Link Google Maps" value={weddingForm.mapUrl} onChange={handleWeddingFormChange} required style={{ flex: 2, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <input name="contactPerson" placeholder="Contact Person" value={weddingForm.contactPerson} onChange={handleWeddingFormChange} style={{ flex: 2, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          <button type="submit" style={{ background: '#16a34a', color: 'white', padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}>Simpan</button>
        </form>
      )}

      {weddingInfos.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 8px #0001', marginBottom: 24 }}>
          <h3 style={{ color: '#166534', marginBottom: 12 }}>Wedding Info</h3>
          {weddingInfos.map((info, idx) => (
            <div key={info.id || idx} style={{ marginBottom: 12 }}>
              <div><b>Mempelai Pria:</b> {info.groomName}</div>
              <div><b>Mempelai Wanita:</b> {info.brideName}</div>
              <div><b>Tanggal:</b> {info.date?.slice(0,10)}</div>
              <div><b>Lokasi:</b> {info.venue}</div>
            </div>
          ))}
        </div>
      )}
      <h3 style={{ marginBottom: 12, color: '#166534' }}>Tambah Gift</h3>
      <form onSubmit={handleGiftFormSubmit} style={{ marginBottom: 24, background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 8px #0001', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input name="bankName" placeholder="Nama Bank" value={giftForm.bankName} onChange={handleGiftFormChange} style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 0 }} />
        <input name="accountNumber" placeholder="No. Rek" value={giftForm.accountNumber} onChange={handleGiftFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 0 }} />
        <input name="accountName" placeholder="Nama Akun" value={giftForm.accountName} onChange={handleGiftFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 0 }} />
        <button type="submit" style={{ background: '#16a34a', color: 'white', padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}>{ guestId ? 'Edit' : 'Tambah'}</button>
      </form>
      {giftMsg && <div style={{ color: giftMsg.includes('berhasil') ? '#16a34a' : '#dc2626', marginBottom: 16, textAlign: 'center' }}>{giftMsg}</div>}
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 1px 8px #0001', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>Nama Bank</th>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>No. Rek</th>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>Nama Akun</th>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {gifts.map(gift => (
              <tr key={gift.id}>
                <td className="px-4 py-2 border-b border-gray-200">{gift.bankName}</td>
                <td className="px-4 py-2 border-b border-gray-200">{gift.accountNumber}</td>
                <td className="px-4 py-2 border-b border-gray-200">{gift.accountName}</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleGiftEdit(gift)}
                      className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleGiftDelete(gift)}
                      className="p-1.5 rounded-full text-red-600 hover:bg-red-100 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>


      <h3 style={{ marginBottom: 12, color: '#166534' }}>Tambah Story Board</h3>
      {
        btnAddStoryBoard ? (
          <div className='p-2'>
            <button type="button" onClick={() => setBtnAddStoryBoard(false)} style={{ background: '#16a34a', color: 'white', padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}>Tambah</button>
          </div>
        ) : (
          <form onSubmit={handleStoryBoardFormSubmit} style={{ marginBottom: 24, background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 8px #0001', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input name="title" placeholder="Judul" value={storyBoardForm.title} onChange={handleStoryBoardFormChange} style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 0 }} />
            <div
                  ref={divRef}
                  contentEditable
                  suppressContentEditableWarning
                  value={storyBoardForm.message}
                  onInput={handleInput}
                  className="w-full min-h-[120px] border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Deskripsi"
                ></div>
            <button type="submit" style={{ background: '#16a34a', color: 'white', padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}>{ storyBoardId ? 'Edit' : 'Tambah'}</button>
            <button type="button" onClick={() => setBtnAddStoryBoard(true)} style={{ background: '#dc2626', color: 'white', padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #0002', marginLeft: 12 }}>Batal</button>
          </form>
        )
      }
      {storyBoardMsg && <div style={{ color: storyBoardMsg.includes('berhasil') ? '#16a34a' : '#dc2626', marginBottom: 16, textAlign: 'center' }}>{storyBoardMsg}</div>}
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 1px 8px #0001', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>Judul</th>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>Deskripsi</th>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {storyBoards.map(storyBoard => (
              <tr key={storyBoard.id}>
                <td className="px-4 py-2 border-b border-gray-200">{storyBoard.title}</td>
                <td className="px-4 py-2 border-b border-gray-200"> {storyBoard.message.length > 100
                  ? `${storyBoard.message.slice(0, 100)}...`
                  : storyBoard.message}</td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleStoryBoardEdit(storyBoard)}
                      className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleStoryBoardDelete(storyBoard)}
                      className="p-1.5 rounded-full text-red-600 hover:bg-red-100 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginBottom: 12, color: '#166534' }}>Tambah Tamu</h3>
      <form onSubmit={handleGuestFormSubmit} style={{ marginBottom: 24, background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 8px #0001', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input name="greeting" placeholder="Sapaan" value={guestForm.greeting} onChange={handleGuestFormChange} style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 0 }} />
        <input name="name" placeholder="Nama" value={guestForm.name} onChange={handleGuestFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 0 }} />
        <input name="address" placeholder="Alamat" value={guestForm.address} onChange={handleGuestFormChange} required style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 0 }} />
        <button type="submit" style={{ background: '#16a34a', color: 'white', padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}>{ guestId ? 'Edit' : 'Tambah'}</button>
      </form>
      {guestMsg && <div style={{ color: guestMsg.includes('berhasil') ? '#16a34a' : '#dc2626', marginBottom: 16, textAlign: 'center' }}>{guestMsg}</div>}
      <h3 style={{ marginBottom: 8, color: '#166534' }}>Daftar Tamu</h3>
      <input
        type="text"
        placeholder="Cari tamu..."
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        style={{ width: 300, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginBottom: 16 }}
      />
      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 1px 8px #0001', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>Sapaan</th>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>Nama</th>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>Alamat</th>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>QR Code</th>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>Hadir</th>
              <th style={{ padding: 10, borderBottom: '1px solid #e2e8f0' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pagedGuests.map(guest => (
              <tr key={guest.id} className={guest.hasVisited ? 'bg-green-50' : ''}>
                <td className="px-4 py-2 border-b border-gray-200">{guest.greeting}</td>
                <td className="px-4 py-2 border-b border-gray-200">{guest.name}</td>
                <td className="px-4 py-2 border-b border-gray-200">{guest.address}</td>
                <td className="px-4 py-2 border-b border-gray-200 font-mono">{guest.qrCode}</td>
                <td
                  className={`px-4 py-2 border-b border-gray-200 font-semibold ${
                    guest.hasVisited ? 'text-green-600' : 'text-slate-500'
                  }`}
                >
                  {guest.hasVisited ? 'Ya' : 'Tidak'}
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(guest)}
                      className="p-1.5 rounded-full text-yellow-500 hover:bg-yellow-100 cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleShare(guest)}
                      className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 cursor-pointer"
                      title="Share"
                    >
                      <Share2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(guest)}
                      className="p-1.5 rounded-full text-red-600 hover:bg-red-100 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: '#e5e7eb', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
        <span style={{ alignSelf: 'center' }}>Halaman {page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ background: '#e5e7eb', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
      </div>
      {/* Snackbar */}
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

export default AdminPanel;
