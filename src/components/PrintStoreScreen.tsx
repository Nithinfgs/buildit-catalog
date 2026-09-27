import React, { useState } from 'react';
import { Compass, Upload, CheckCircle, ShieldCheck, Printer, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';

export const PrintStoreScreen: React.FC = () => {
  const { playClick, playSuccess } = useSound();
  const [drawingSize, setDrawingSize] = useState<'a0' | 'a1' | 'a2' | 'a3'>('a1');
  const [printType, setPrintType] = useState<'blueprint' | 'color_cad'>('blueprint');
  const [sheetCount, setSheetCount] = useState(2);
  const [copies, setCopies] = useState(1);
  const [hasLamination, setHasLamination] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isOrdered, setIsOrdered] = useState(false);

  const pricePerSheet = drawingSize === 'a0' ? 80 : drawingSize === 'a1' ? 45 : drawingSize === 'a2' ? 25 : 12;
  const colorMultiplier = printType === 'color_cad' ? 1.8 : 1;
  const laminationCost = hasLamination ? 40 * sheetCount * copies : 0;
  const totalPrintCost = Math.round(sheetCount * pricePerSheet * colorMultiplier * copies + laminationCost);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      playClick();
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleOrderPrint = () => {
    playSuccess();
    setIsOrdered(true);
    setTimeout(() => {
      setIsOrdered(false);
      setUploadedFileName(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Banner */}
      <div className="bg-gradient-to-r from-navy via-primary to-primary-secondary text-white rounded-3xl p-6 shadow-hero relative overflow-hidden border border-primary-secondary">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-lime flex-shrink-0 border border-white/10">
            <Compass size={28} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-lime">
              BuildIt CAD & Blueprint Dispatch Studio
            </span>
            <h2 className="text-xl font-black leading-tight mt-0.5">
              Architectural Blueprints & PCB Schematics in 10 Mins
            </h2>
            <p className="text-xs text-white/80 mt-1">High-dpi plotter printing on 90 GSM bond & waterproof poly-sheet</p>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-surface-card rounded-3xl p-6 border border-stroke shadow-crisp">
        <label className="block text-xs font-black text-navy uppercase tracking-wider mb-3">
          Upload Drawings (DWG / DXF / PDF / Gerber PCB Zip)
        </label>

        <div className="border-2 border-dashed border-stroke rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-surface-secondary hover:border-primary/50 transition-colors cursor-pointer relative">
          <input
            type="file"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept=".pdf,.dwg,.dxf,.zip,.png,.jpg"
          />
          <Upload size={28} className="text-primary mb-2" />
          <p className="text-sm font-bold text-navy">
            {uploadedFileName ? uploadedFileName : 'Drag & drop architectural drawings or tap to browse'}
          </p>
          <span className="text-xs text-content-secondary mt-1 font-medium">
            Max 100MB • Auto-scaled to standard metric drawing sizes
          </span>
        </div>
      </div>

      {/* Blueprint Options */}
      <div className="bg-surface-card rounded-3xl p-6 border border-stroke shadow-crisp space-y-4">
        <span className="text-xs font-black text-navy uppercase tracking-wider block">
          Plotter & Paper Specifications
        </span>

        {/* Paper Size Selection */}
        <div>
          <label className="text-xs font-bold text-content-secondary block mb-2">Drawing Size</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'a0', label: 'A0 (841 x 1189 mm)', price: '₹80' },
              { id: 'a1', label: 'A1 (594 x 841 mm)', price: '₹45' },
              { id: 'a2', label: 'A2 (420 x 594 mm)', price: '₹25' },
              { id: 'a3', label: 'A3 (297 x 420 mm)', price: '₹12' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  playClick();
                  setDrawingSize(s.id as any);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  drawingSize === s.id
                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary font-bold'
                    : 'border-stroke bg-surface-secondary text-navy'
                }`}
              >
                <p className="text-xs font-black">{s.label.split(' ')[0]}</p>
                <span className="text-[10px] text-content-secondary block">{s.label.split('(')[1].replace(')', '')}</span>
                <span className="text-xs font-black text-primary mt-1 block">{s.price}/sheet</span>
              </button>
            ))}
          </div>
        </div>

        {/* Blueprint vs Full Color CAD */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              playClick();
              setPrintType('blueprint');
            }}
            className={`p-4 rounded-2xl border text-left transition-all ${
              printType === 'blueprint'
                ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary font-bold'
                : 'border-stroke bg-surface-secondary text-navy'
            }`}
          >
            <p className="text-xs font-black">Monochrome / Blueprint Lines</p>
            <span className="text-[11px] text-content-secondary font-medium">Standard structural & wiring schematics</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setPrintType('color_cad');
            }}
            className={`p-4 rounded-2xl border text-left transition-all ${
              printType === 'color_cad'
                ? 'border-navy bg-navy/5 text-navy ring-1 ring-navy font-bold'
                : 'border-stroke bg-surface-secondary text-navy'
            }`}
          >
            <p className="text-xs font-black">Full Color Render & Elevations</p>
            <span className="text-[11px] text-content-secondary font-medium">High precision 1200 DPI architectural color</span>
          </button>
        </div>

        {/* Sheet & Copy Counters */}
        <div className="flex items-center justify-between text-xs py-1 border-t border-stroke pt-3">
          <span className="font-bold text-navy">Number of Drawing Sheets in Set</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSheetCount(Math.max(1, sheetCount - 1))}
              className="w-8 h-8 rounded-xl bg-surface-secondary font-bold text-navy border border-stroke"
            >
              -
            </button>
            <span className="w-8 text-center font-black text-navy">{sheetCount}</span>
            <button
              onClick={() => setSheetCount(sheetCount + 1)}
              className="w-8 h-8 rounded-xl bg-surface-secondary font-bold text-navy border border-stroke"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs py-1">
          <span className="font-bold text-navy">Number of Duplicate Sets</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCopies(Math.max(1, copies - 1))}
              className="w-8 h-8 rounded-xl bg-surface-secondary font-bold text-navy border border-stroke"
            >
              -
            </button>
            <span className="w-8 text-center font-black text-navy">{copies}</span>
            <button
              onClick={() => setCopies(copies + 1)}
              className="w-8 h-8 rounded-xl bg-surface-secondary font-bold text-navy border border-stroke"
            >
              +
            </button>
          </div>
        </div>

        {/* Site Weatherproof Lamination */}
        <label className="flex items-center justify-between pt-2 border-t border-stroke cursor-pointer">
          <div>
            <p className="text-xs font-bold text-navy">Site Weatherproof Heavy-Duty Lamination</p>
            <span className="text-[11px] text-content-secondary font-medium">Resists rain, dust, mud and tearing on active job sites</span>
          </div>
          <input
            type="checkbox"
            checked={hasLamination}
            onChange={(e) => {
              playClick();
              setHasLamination(e.target.checked);
            }}
            className="accent-primary rounded w-4 h-4"
          />
        </label>
      </div>

      {/* Confidentiality Guarantee */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-3 text-xs text-primary">
        <ShieldCheck size={20} className="text-primary flex-shrink-0" />
        <span className="font-semibold text-xs">
          Intellectual property & proprietary CAD files are encrypted and purged from plotter spoolers immediately after printing.
        </span>
      </div>

      {/* Order Button */}
      {isOrdered ? (
        <div className="bg-primary text-white rounded-2xl p-4 text-center font-bold text-xs flex items-center justify-center gap-2 shadow-hero border border-primary-secondary">
          <CheckCircle size={18} className="text-lime" />
          <span>Blueprint plot order received! Dispatched to site in 10 mins.</span>
        </div>
      ) : (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleOrderPrint}
          className="w-full py-4 rounded-2xl bg-lime hover:bg-lime-hover text-navy text-xs font-black uppercase tracking-wider shadow-lime-glow flex items-center justify-center gap-2 border border-navy/10"
        >
          <span>Dispatch CAD Prints to Site • ₹{totalPrintCost}</span>
        </motion.button>
      )}
    </div>
  );
};

