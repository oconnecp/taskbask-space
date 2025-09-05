import React from 'react';

const modalStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const contentStyle: React.CSSProperties = {
  padding: '2rem',
  borderRadius: '8px',
  background: '#242424',

  border: '3px solid rgba(255, 255, 255, 0.87)',
  minWidth: '300px',
  maxWidth: '90vw',
};


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        <button style={{ float: 'right' }} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;