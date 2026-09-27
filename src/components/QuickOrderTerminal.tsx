import React, { useState } from 'react';
import { Terminal, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { useCart } from '../context/CartContext';

export const QuickOrderTerminal: React.FC = () => {
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const [inputText, setInputText] = useState(
`ESP-WROOM-32 x 4
BOS-GSB-500 x 1
POL-CU-25-RED x 2
FAS-M3-SS304 x 2`
  );
  const [parsedItems, setParsedItems] = useState<Array<{ sku: string; qty: number; product: any; available: boolean }>>([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleValidate = () => {
    const lines = inputText.split('\n').filter((l) => l.trim().length > 0);
    const results = lines.map((line) => {
      // Parse patterns like "SKU x 4" or "SKU 4" or "SKU"
      const match = line.match(/^([A-Z0-9\-_]+)(?:\s*[xX*,\s]\s*(\d+))?/i);
      const rawSku = match ? match[1].trim().toUpperCase() : line.trim().toUpperCase();
      const qty = match && match[2] ? parseInt(match[2], 10) : 1;

      // Match against product catalog
      const product = PRODUCTS.find(
        (p) =>
          p.sku.toUpperCase() === rawSku ||
          p.id.toUpperCase() === rawSku ||
          p.mpn?.toUpperCase() === rawSku ||
          p.name.toUpperCase().includes(rawSku)
      );

      return {
        sku: rawSku,
        qty: isNaN(qty) ? 1 : qty,
        product,
        available: !!product && product.inStock,
      };
    });

    setParsedItems(results);
    setHasValidated(true);
  };

  const handleAddAllToCart = () => {
    parsedItems.forEach((item) => {
      if (item.product && item.available) {
        for (let i = 0; i < item.qty; i++) {
          addToCart(item.product, item.product.unit);
        }
      }
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setIsCartDrawerOpen(true);
    }, 600);
  };

  return (
    <div className="bg-[#FAFAF6] rounded-[14px] border border-[#D7DDD8] p-5 sm:p-6 space-y-4 select-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D7DDD8] pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase text-[#062B32] bg-[#ECEBE3] px-2.5 py-0.5 rounded-[4px] border border-[#D7DDD8]">
              QUICK ORDER TERMINAL
            </span>
            <span className="text-[11px] font-bold text-[#66736F]">Paste Part Numbers, SKUs or Quantities</span>
          </div>
          <p className="text-xs text-[#66736F] mt-1 font-medium">
            Paste BOM list or SKUs directly from Excel, AutoCAD schedule or requisition note.
          </p>
        </div>

        <button
          onClick={handleValidate}
          className="bg-[#062B32] hover:bg-[#071C20] text-lime font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-[7px] border border-[#1C3E3A] self-start sm:self-auto transition-colors"
        >
          [ CHECK AVAILABILITY ]
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Input Box */}
        <div className="lg:col-span-6 space-y-2">
          <label className="text-[11px] font-mono font-bold uppercase text-[#66736F] block">
            SKU Requisition Input
          </label>
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setHasValidated(false);
            }}
            rows={5}
            placeholder="ESP-WROOM-32 x 4&#10;BOS-GSB-500 x 1&#10;POL-CU-25-RED x 2"
            className="w-full bg-white border border-[#D7DDD8] rounded-[8px] p-3 font-mono text-xs text-[#102326] focus:border-[#062B32] outline-none resize-none leading-relaxed"
          />
          <span className="text-[10px] text-[#66736F] font-mono block">
            Format: &lt;SKU&gt; x &lt;QTY&gt; (e.g. ESP-WROOM-32 x 4)
          </span>
        </div>

        {/* Right Parsed Resolution List */}
        <div className="lg:col-span-6 space-y-2 flex flex-col justify-between">
          <div>
            <label className="text-[11px] font-mono font-bold uppercase text-[#66736F] block mb-2">
              Resolved Inventory Status {hasValidated && `(${parsedItems.filter((p) => p.available).length}/${parsedItems.length} Available)`}
            </label>

            {!hasValidated ? (
              <div className="h-[120px] rounded-[8px] border border-dashed border-[#D7DDD8] bg-[#ECEBE3]/40 flex flex-col items-center justify-center text-center p-4">
                <Terminal size={20} className="text-[#66736F] mb-1.5" />
                <span className="text-xs font-mono font-bold text-[#66736F]">
                  Click [ CHECK AVAILABILITY ] to verify real-time stock at Site A
                </span>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto hide-scrollbar pr-1">
                {parsedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-[6px] border text-xs font-mono ${
                      item.available
                        ? 'bg-white border-[#D7DDD8] text-[#102326]'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {item.available ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      )}
                      <span className="font-bold">{item.sku}</span>
                      <span className="text-[#66736F]">×{item.qty}</span>
                      {item.product && (
                        <span className="text-[11px] text-[#66736F] truncate">
                          ({item.product.name.slice(0, 24)}...)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 font-bold">
                      {item.available ? (
                        <>
                          <span>₹{item.product.price * item.qty}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            IN STOCK
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                          UNAVAILABLE
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {hasValidated && (
            <button
              onClick={handleAddAllToCart}
              className="w-full mt-2 bg-lime hover:bg-lime-hover text-[#071C20] font-mono text-xs font-black uppercase tracking-wider py-2.5 px-4 rounded-[7px] flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              {isAdded ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>ALL ITEMS ADDED TO SITE CART</span>
                </>
              ) : (
                <>
                  <span>ADD ALL AVAILABLE ITEMS TO CART</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
