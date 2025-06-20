// src/api.js
// Konfigurasi endpoint API GuestBook
const API_BASE_URL = 'https://api-invitation.onetobot.com/api/v1';
const CLOUD_NAME = 'dpysdqing';

export const generateCloudinaryUrl = (publicId, options = {}) => {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop,
    gravity,
    effect,
    secure = true,
  } = options;

  const baseUrl = `${secure ? 'https' : 'http'}://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

  const transforms = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  if (gravity) transforms.push(`g_${gravity}`);
  if (effect) transforms.push(`e_${effect}`);
  if (quality) transforms.push(`q_${quality}`);
  if (format) transforms.push(`f_${format}`);

  const transformationStr = transforms.join(',');

  return `${baseUrl}/${transformationStr}/${publicId}`;
};


// Guest APIs
export const getGuests = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/guests?userId=${userId}`);
  if (!res.ok) throw new Error('Gagal mengambil data tamu');
  return res.json();
};

export const postGuest = async (guest, token) => {
  const res = await fetch(`${API_BASE_URL}/guests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify(guest),
  });
  if (!res.ok) throw new Error('Gagal mengirim data tamu');
  return res.json();
};

export const editGuest = async (guest, id, token) => {
  const res = await fetch(`${API_BASE_URL}/guests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify(guest),
  });
  if (!res.ok) throw new Error('Gagal mengedit data tamu');
  return res.json();
}

export const deleteGuest = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/guests/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    },
  });
  if (!res.ok) throw new Error('Gagal menghapus data tamu');
  return res.json();
}

export const verifyGuestByQrCode = async (qrCode) => {
  const res = await fetch(`${API_BASE_URL}/guests/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrCode }),
  });
  if (!res.ok) throw new Error('Verifikasi gagal');
  return res.json();
};

export const getGuestByQrCode = async (qrCode) => {
  const res = await fetch(`${API_BASE_URL}/guests/qrcode/${qrCode}`);
  if (!res.ok) throw new Error('Tamu tidak ditemukan');
  return res.json();
};

// Guest Comment APIs
export const getGuestComments = async (userId) => {
  const url = userId ? `${API_BASE_URL}/guestComments?userId=${userId}` : `${API_BASE_URL}/guestComments`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal mengambil komentar');
  return res.json();
};

export const postGuestComment = async (comment) => {
  const res = await fetch(`${API_BASE_URL}/guestComments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });
  if (!res.ok) throw new Error('Gagal mengirim komentar');
  return res.json();
};

// Wedding Info APIs
export const getWeddingInfos = async (userId) => {
  let url = `${API_BASE_URL}/weddingInfos`;
  if (userId) url += `?userId=${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal mengambil data wedding info');
  return res.json();
};

export const postWeddingInfo = async (info, token) => {
  const res = await fetch(`${API_BASE_URL}/weddingInfos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify(info),
  });
  if (!res.ok) throw new Error('Gagal mengirim data wedding info');
  return res.json();
};

export const updateWeddingInfo = async (id, info, token) => {
  const res = await fetch(`${API_BASE_URL}/weddingInfos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify(info),
  });
  if (!res.ok) throw new Error('Gagal mengupdate data wedding info');
  return res.json();
};

// User APIs
export const login = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login gagal');
  return res.json();
};

export const register = async (user) => {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Registrasi gagal');
  return res.json();
};


// gift Info APIs
export const getGifts = async (userId) => {
  let url = `${API_BASE_URL}/gifts`;
  if (userId) url += `?userId=${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal mengambil data gift info');
  return res.json();
};

export const postGift = async (info, token) => {
  const res = await fetch(`${API_BASE_URL}/gifts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify(info),
  });
  if (!res.ok) throw new Error('Gagal mengirim data gift info');
  return res.json();
};

export const updateGift = async (info, id, token) => {
  const res = await fetch(`${API_BASE_URL}/gifts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify(info),
  });
  if (!res.ok) throw new Error('Gagal mengupdate data gift info');
  return res.json();
};


export const deleteGift = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/gifts/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    },
  });
  if (!res.ok) throw new Error('Gagal menghapus data gift');
  return res.json();
}

// gift Info APIs
export const getStoryBoards = async (userId) => {
  let url = `${API_BASE_URL}/storyBoards`;
  if (userId) url += `?userId=${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal mengambil data storyBoards info');
  return res.json();
};

export const postStoryBoard = async (info, token) => {
  const res = await fetch(`${API_BASE_URL}/storyBoards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify(info),
  });
  if (!res.ok) throw new Error('Gagal mengirim data storyBoard info');
  return res.json();
};

export const updateStoryBoard = async (info, id, token) => {
  const res = await fetch(`${API_BASE_URL}/storyBoards/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify(info),
  });
  if (!res.ok) throw new Error('Gagal mengupdate data storyBoard info');
  return res.json();
};

export const deleteStoryBoard = async (id, token) => {
  const res = await fetch(`${API_BASE_URL}/storyBoards/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    },
  });
  if (!res.ok) throw new Error('Gagal menghapus data storyBoards');
  return res.json();
}
