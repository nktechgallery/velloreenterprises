'use client';
import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3600,
        style: {
          background: 'rgba(12,12,12,0.92)',
          color: '#f8f5ea',
          border: '1px solid rgba(201,162,39,0.28)',
          borderRadius: '16px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
          backdropFilter: 'blur(18px)',
        },
        success: { iconTheme: { primary: '#C9A227', secondary: '#050505' } },
        error: { iconTheme: { primary: '#F04418', secondary: '#050505' } },
      }}
    />
  );
}
