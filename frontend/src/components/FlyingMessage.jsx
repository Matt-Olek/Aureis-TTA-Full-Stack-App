// src/components/FlyingMessage.jsx
import { useEffect } from 'react';
import './FlyingMessage.css';

const FlyingMessage = ({ message, visible, duration }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        visible = false;
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  return (
    <div className={`flying-message ${visible ? 'visible' : ''}`}>
      {message}
    </div>
  );
};

export default FlyingMessage;
