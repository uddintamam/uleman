// src/components/GuestBook.jsx
import React, { useState, useEffect } from 'react';
import { getGuests, postGuest, postGuestComment } from '../api';
import useSectionAnimation from './useSectionAnimation';

const GuestBook = ({ guest, guestComments }) => {
  const [ref, animClass] = useSectionAnimation();
  const [comment, setComment] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil((guestComments?.length || 0) / itemsPerPage);
  const pagedComments = (guestComments || []).slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await postGuestComment({ guestId: guest?.id, comment });
      setMsg('Ucapan berhasil dikirim!');
      setComment('');
      // Optional: refresh comment list dari parent jika ingin real-time
    } catch {
      setMsg('Gagal mengirim ucapan');
    }
  };

  // Tampilkan ucapan dari guestComments
  return (
    <div className='guestbook-div'>
      <section ref={ref} className={`guestbook-section ${animClass}`}>
        <h2>Ucapan</h2>
        <form onSubmit={handleSubmit} className="guestbook-form" style={{marginBottom: 16}}>
          <textarea
            placeholder="Tulis ucapan untuk mempelai..."
            className="guestbook-textarea"
            rows={3}
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
          />
          <button type="submit" className="guestbook-submit-btn">Kirim</button>
        </form>
        {msg && <div style={{color: msg.includes('berhasil') ? 'green' : 'red'}}>{msg}</div>}
        <div className="guestbook-list">
          {pagedComments.length === 0 && (
            <div className="guestbook-empty">Belum ada ucapan.</div>
          )}
          {pagedComments.map((cmnt, idx) => (
            <div key={idx} className="guestbook-item">
              <div className="guestbook-name">{cmnt.Guest?.name || 'Tamu'}</div>
              <div className="guestbook-message">{cmnt.comment}</div>
              <div className="guestbook-date" style={{fontSize: '0.85em', color: '#888'}}>
                {cmnt.createdAt ? new Date(cmnt.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          <span>Halaman {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
        </div>
      </section>
    </div>
  );
};

export default GuestBook;
