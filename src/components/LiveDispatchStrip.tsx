import React, { useState, useEffect } from 'react';
import { Truck, ArrowRight, ShieldCheck } from 'lucide-react';

interface ActiveShipment {
  id: string;
  sku: string;
  item: string;
  site: string;
  etaMins: number;
  status: 'DISPATCHED' | 'OUT FOR DELIVERY' | 'PICKING';
}

const INITIAL_SHIPMENTS: ActiveShipment[] = [
  { id: 'ORD-8921', sku: 'ESP-WROOM-32', item: '4× ESP32-WROOM-32 Dev Boards', site: 'Site A · Brigade Tech', etaMins: 7, status: 'OUT FOR DELIVERY' },
  { id: 'ORD-8922', sku: 'BOS-GSB-500', item: '1× Bosch GSB 500W Impact Kit', site: 'Site A · Brigade Tech', etaMins: 9, status: 'DISPATCHED' },
  { id: 'ORD-8923', sku: 'POL-CU-25-RED', item: '3× Polycab 2.5mm Copper Coils', site: 'Lab 3 · Ecospace', etaMins: 11, status: 'PICKING' },
  { id: 'ORD-8924', sku: 'FAS-M3-SS304', item: '2× M3 SS304 Hex Bolt Kits', site: 'Site A · Brigade Tech', etaMins: 6, status: 'OUT FOR DELIVERY' },
];

export const LiveDispatchStrip: React.FC = () => {
  const [shipments, setShipments] = useState<ActiveShipment[]>(INITIAL_SHIPMENTS);

  // Subtle live countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setShipments((prev) =>
        prev.map((s) => ({
          ...s,
          etaMins: s.etaMins > 1 ? s.etaMins - 0.1 : 8,
        }))
      );
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#071C20] border-y border-[#1C3E3A] text-white py-2 px-4 sm:px-6 select-none font-mono text-[11px]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Status Anchor */}
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-lime animate-ping" />
          <span className="font-bold text-lime tracking-wider uppercase">LIVE DISPATCH FEED</span>
          <span className="text-[#66736F] hidden sm:inline">|</span>
          <span className="text-[#A2B3B0] hidden sm:inline">14 Active Shipments Moving from BLR-01 Hub</span>
        </div>

        {/* Live Moving Ticker */}
        <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar text-xs">
          {shipments.slice(0, 2).map((s) => (
            <div key={s.id} className="flex items-center gap-2 bg-[#062B32] px-2.5 py-1 rounded-[6px] border border-[#1C3E3A]">
              <span className="text-lime font-bold">● {s.status}</span>
              <span className="text-white font-bold">{s.item}</span>
              <span className="text-[#66736F]">→ {s.site}</span>
              <span className="bg-[#071C20] text-lime px-1.5 py-0.5 rounded font-bold">
                ETA ~{Math.ceil(s.etaMins)} MIN
              </span>
            </div>
          ))}
        </div>

        {/* Right Hub Metric */}
        <div className="hidden lg:flex items-center gap-2 text-[#A2B3B0]">
          <Truck size={13} className="text-lime" />
          <span>Avg Site Transit: <strong className="text-white">8.4 Mins</strong></span>
        </div>
      </div>
    </div>
  );
};
