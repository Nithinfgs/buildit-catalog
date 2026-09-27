import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, MessageSquare, Bike, X, UserCheck, PhoneCall, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useSound } from '../context/SoundContext';

export const OrderTrackingModal: React.FC = () => {
  const { activeOrder, isTrackingOpen, setIsTrackingOpen } = useCart();
  const { playClick, playSuccess } = useSound();

  const [deliveryStep, setDeliveryStep] = useState<number>(1);
  const [etaRemainingMins, setEtaRemainingMins] = useState(8);
  const [showRiderCallModal, setShowRiderCallModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isTrackingOpen) return;

    setDeliveryStep(1);
    setEtaRemainingMins(8);

    const step2Timer = setTimeout(() => {
      setDeliveryStep(2);
      setEtaRemainingMins(6);
    }, 4000);

    const step3Timer = setTimeout(() => {
      setDeliveryStep(3);
      setEtaRemainingMins(3);
    }, 9000);

    const step4Timer = setTimeout(() => {
      setDeliveryStep(4);
      setEtaRemainingMins(0);
      playSuccess();
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }, 18000);

    return () => {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      clearTimeout(step4Timer);
    };
  }, [isTrackingOpen]);

  // Animated Map Simulation on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let progress = 0.1;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep navy theme map background
      ctx.fillStyle = '#061F2B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stylized road grid
      ctx.strokeStyle = '#0E2E3D';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Road 1 (Main route)
      ctx.beginPath();
      ctx.moveTo(30, 140);
      ctx.lineTo(120, 140);
      ctx.lineTo(180, 70);
      ctx.lineTo(290, 70);
      ctx.lineTo(340, 130);
      ctx.stroke();

      // Active delivery path (Electric Lime #D9F04A route highlight)
      ctx.strokeStyle = '#D9F04A';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(30, 140);
      ctx.lineTo(120, 140);
      ctx.lineTo(180, 70);
      ctx.lineTo(290, 70);
      ctx.lineTo(340, 130);
      ctx.stroke();

      // Dark Store Pin (Left)
      ctx.fillStyle = '#063B32';
      ctx.beginPath();
      ctx.arc(30, 140, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D9F04A';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Jobsite Destination Pin (Right)
      ctx.fillStyle = '#F5F5F0';
      ctx.beginPath();
      ctx.arc(340, 130, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#063B32';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Rider Marker moving based on stage
      let riderX = 30;
      let riderY = 140;

      if (deliveryStep === 1) {
        riderX = 30;
        riderY = 140;
      } else if (deliveryStep === 2) {
        riderX = 120;
        riderY = 140;
      } else if (deliveryStep === 3) {
        progress += 0.008;
        if (progress > 1) progress = 0.2;
        riderX = 180 + Math.sin(progress * Math.PI) * 110;
        riderY = 70 + Math.cos(progress * Math.PI) * 20;
      } else {
        riderX = 340;
        riderY = 130;
      }

      // Rider Pulse (Electric Lime Glow)
      ctx.fillStyle = 'rgba(217, 240, 74, 0.35)';
      ctx.beginPath();
      ctx.arc(riderX, riderY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Rider Dot
      ctx.fillStyle = '#D9F04A';
      ctx.beginPath();
      ctx.arc(riderX, riderY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#061F2B';
      ctx.lineWidth = 2;
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [deliveryStep]);

  if (!isTrackingOpen || !activeOrder) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-xs flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg bg-surface-page rounded-3xl overflow-hidden flex flex-col z-10 shadow-2xl border border-stroke"
        >
          {/* Top Header */}
          <div className="bg-navy px-5 py-4 border-b border-primary-secondary flex items-center justify-between shadow-sm sticky top-0 z-20 text-white">
            <button
              onClick={() => {
                playClick();
                setIsTrackingOpen(false);
              }}
              className="p-1.5 -ml-1 text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="text-center">
              <h2 className="text-xs font-black tracking-tight text-white uppercase">
                ORDER #{activeOrder.orderNumber}
              </h2>
              <span className="text-[10px] font-bold text-lime">
                Live GPS Fleet Telemetry
              </span>
            </div>

            <button
              onClick={() => {
                playClick();
                setIsTrackingOpen(false);
              }}
              className="p-1.5 text-white hover:bg-white/10 rounded-xl"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Tracking Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[80vh] hide-scrollbar">
            {/* Main Delivery Status Card */}
            <div className="bg-surface-card rounded-2xl p-4 border border-stroke shadow-crisp relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold text-content-secondary uppercase tracking-wider block">
                    Estimated Jobsite Arrival
                  </span>
                  <h3 className="text-xl font-black text-navy">
                    {deliveryStep === 4 ? 'Materials Delivered at Gate!' : `${etaRemainingMins} Minutes`}
                  </h3>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-surface-secondary border border-stroke flex items-center justify-center text-primary">
                  <Bike size={22} />
                </div>
              </div>

              {/* Stage Progress Bar */}
              <div className="space-y-3 pt-2">
                <div className="relative flex justify-between items-center z-10">
                  <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-1 bg-stroke -z-10" />
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-500"
                    style={{
                      width: `${((deliveryStep - 1) / 3) * 100}%`
                    }}
                  />

                  {[
                    { step: 1, label: 'Verified' },
                    { step: 2, label: 'Warehouse Pick' },
                    { step: 3, label: 'In Transit' },
                    { step: 4, label: 'At Gate' }
                  ].map((s) => {
                    const isDone = deliveryStep >= s.step;
                    return (
                      <div key={s.step} className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                            isDone
                              ? 'bg-primary border-primary text-white'
                              : 'bg-surface-card border-stroke text-content-secondary'
                          }`}
                        >
                          {isDone ? <Check size={11} strokeWidth={3} /> : s.step}
                        </div>
                        <span className="text-[9px] font-bold text-content-secondary mt-1">{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Map Canvas Card */}
            <div className="bg-navy rounded-2xl overflow-hidden border border-navy/40 shadow-elevated relative">
              <canvas
                ref={canvasRef}
                width={380}
                height={190}
                className="w-full h-44 object-cover"
              />
              <div className="absolute top-2.5 left-2.5 bg-navy/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-lime animate-ping" />
                <span>Ramesh (Fleet Driver) • 750m away from site gate</span>
              </div>
            </div>

            {/* Delivery Partner Details */}
            <div className="bg-surface-card rounded-2xl p-4 border border-stroke shadow-crisp flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-surface-secondary border border-stroke flex items-center justify-center text-primary">
                  <UserCheck size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-navy">
                    {activeOrder.riderName}
                  </h4>
                  <p className="text-[10px] text-content-secondary font-semibold">
                    Verified Industrial Fleet Driver • 4.9 Rating
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playClick();
                    setShowRiderCallModal(true);
                  }}
                  className="p-2.5 rounded-xl bg-surface-secondary text-primary hover:bg-primary hover:text-white transition-colors border border-stroke"
                  title="Call Driver"
                >
                  <Phone size={16} />
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setShowRiderCallModal(true);
                  }}
                  className="p-2.5 rounded-xl bg-surface-secondary text-navy hover:bg-neutral-100 transition-colors border border-stroke"
                  title="Message Driver"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>

            {/* Order Summary Dropdown */}
            <div className="bg-surface-card rounded-2xl p-4 border border-stroke space-y-2 shadow-crisp">
              <div className="flex items-center justify-between text-xs font-bold text-navy">
                <span>Materials Dispatched ({activeOrder.items.length})</span>
                <span className="font-black text-primary">₹{activeOrder.totalAmount}</span>
              </div>

              <div className="divide-y divide-stroke text-xs">
                {activeOrder.items.map((it) => (
                  <div key={it.product.id} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-4 h-4 rounded bg-surface-secondary text-[10px] font-bold flex items-center justify-center text-navy border border-stroke">
                        {it.quantity}x
                      </span>
                      <span className="text-navy font-medium truncate">{it.product.name}</span>
                    </div>
                    <span className="font-bold text-navy tabular-nums">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Simulated Driver Call Modal */}
          <AnimatePresence>
            {showRiderCallModal && (
              <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-xs flex items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-surface-card rounded-3xl p-6 w-full max-w-xs text-center space-y-3.5 border border-stroke shadow-2xl"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-secondary text-primary flex items-center justify-center mx-auto border border-stroke">
                    <PhoneCall size={28} />
                  </div>
                  <h3 className="text-sm font-bold text-navy">Calling {activeOrder.riderName}</h3>
                  <p className="text-xs text-content-secondary">
                    Connecting to site dispatch partner at {activeOrder.riderPhone}...
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setShowRiderCallModal(false)}
                      className="w-full py-2.5 rounded-xl bg-navy text-white font-bold text-xs hover:bg-navy-dark transition-colors"
                    >
                      End Call
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

