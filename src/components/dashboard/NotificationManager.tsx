"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Shield, X, Check } from 'lucide-react';

interface NotificationManagerProps {
  userId: string;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ userId }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);
  const [step, setStep] = useState(1); // 1: Initial Prompt, 2: System Request

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // If default, we might show the prompt after a delay or certain action
      if (Notification.permission === 'default') {
        const timer = setTimeout(() => setShowPrompt(true), 5000); // 5s delay
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicVapidKey) {
        console.error('VAPID Public Key missing');
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });

      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          subscription: subscription.toJSON()
        })
      });

      console.log('Push subscription successful');
    } catch (e) {
      console.error('Push subscription failed', e);
    }
  };

  const handleRequest = async () => {
    if (step === 1) {
      setStep(2); // Move to real system request
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        await subscribeToPush();
        setShowPrompt(false);
      } else {
        setShowPrompt(false);
      }
    }
  };

  if (!showPrompt || permission === 'granted' || permission === 'denied') return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] max-w-sm w-full animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="glass-card p-6 rounded-3xl shadow-2xl border border-primary/20 bg-white/90 dark:bg-black/80 backdrop-blur-xl">
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Bell size={24} className="animate-bounce" />
          </div>
          <div>
            <h4 className="font-bold text-inherit leading-tight">Enable Live Status Alerts?</h4>
            <p className="text-sm text-inherit opacity-70 mt-1">Get real-time updates for your visa applications and invoices directly on your desktop.</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleRequest}
            className="flex-1 bg-primary text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            {step === 1 ? "Yes, Keep Me Updated" : "Allow in Browser"}
            <Check size={18} />
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="px-6 py-3 rounded-2xl border border-gray-200 dark:border-white/10 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Later
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold opacity-60">
          <Shield size={10} /> 100% Secure & Privacy Focused
        </div>
      </div>
    </div>
  );
};

export default NotificationManager;
