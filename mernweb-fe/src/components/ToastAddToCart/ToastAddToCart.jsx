import React, { useEffect } from 'react';

const toastBaseStyle = {
  position: 'fixed',
  top: '80px',
  right: '20px',
  padding: '12px 20px',
  color: '#fff',
  borderRadius: '6px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  zIndex: 9999,
  fontWeight: 'bold',
  animation: 'fadeInOut 3s',
  maxWidth: '300px',
};

const ToastAddToCart = ({ type = 'success', message = 'Đã thêm vào giỏ hàng!', onClose }) => {
  
  const backgroundColor = type === 'success' ? '#52c41a' : '#ff4d4f';

  return (
    <div style={{ ...toastBaseStyle, background: backgroundColor }}>
      {message}
    </div>
  );
};

export default ToastAddToCart;
