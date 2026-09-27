import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  FileText,
  RotateCcw,
  ArrowLeft,
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/catalog';

interface OrderHistoryScreenProps {
  onBackToHome: () => void;
  onTrackOrder?: (orderId: string) => void;
}

interface OrderRecord {
  id: string;
  date: string;
  status: 'in_transit' | 'delivered' | 'processing';
  siteName: string;
  addressLine: string;
  googleMapsQuery: string;
  eta: string;
  items: {
    id: string;
    name: string;
    qty: number;
    price: number;
    image: string;
  }[];
  totalAmount: number;
  gstNumber: string;
  invoiceNumber: string;
}

const PAST_ORDERS: OrderRecord[] = [
  {
    id: 'BLT-98421',
    date: 'Today, 04:15 PM',
    status: 'in_transit',
    siteName: 'Brigade Tech Town (Site A)',
    addressLine: 'Gate 2, Outer Ring Road, Bellandur, Bengaluru',
    googleMapsQuery: 'Brigade Tech Gardens, Outer Ring Road, Bengaluru',
    eta: '4 mins away',
    items: [
      {
        id: 'pt-1',
        name: 'Bosch GSB 600 Professional Impact Drill Kit',
        qty: 1,
        price: 3499,
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'fas-1',
        name: 'M3/M4/M5 Stainless Steel 304 Socket Cap Screws Kit (500 pcs)',
        qty: 2,
        price: 499,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80'
      }
    ],
    totalAmount: 4497,
    gstNumber: '29AAAAA0000A1Z5',
    invoiceNumber: 'INV-2026-98421'
  },
  {
    id: 'BLT-97812',
    date: 'Yesterday, 11:30 AM',
    status: 'delivered',
    siteName: 'Embassy Tech Village (Phase 2)',
    addressLine: 'Tower 4 Basement Fabrication Unit, Kadubeesanahalli',
    googleMapsQuery: 'Embassy Tech Village, Outer Ring Road, Bengaluru',
    eta: 'Delivered in 7m 42s',
    items: [
      {
        id: 'el-1',
        name: 'Espressif ESP32-WROOM-32 IoT Dev Board (WiFi + BLE)',
        qty: 4,
        price: 389,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'plumb-1',
        name: 'Astral UPVC Class 1 Schedule 40 Pipe (1-inch x 10ft)',
        qty: 6,
        price: 420,
        image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=500&auto=format&fit=crop&q=80'
      }
    ],
    totalAmount: 4076,
    gstNumber: '29AAAAA0000A1Z5',
    invoiceNumber: 'INV-2026-97812'
  },
  {
    id: 'BLT-96540',
    date: '02 Sep 2026, 09:15 AM',
    status: 'delivered',
    siteName: 'Electronic City R&D Lab',
    addressLine: 'Plot 12, Phase 1, Hosur Main Road, Bengaluru',
    googleMapsQuery: 'Electronic City Phase 1, Bengaluru',
    eta: 'Delivered in 8m 10s',
    items: [
      {
        id: 'pnt-apex-ult-20l',
        name: 'Asian Paints Apex Ultima Advanced Anti-Algal Exterior Emulsion (20L)',
        qty: 1,
        price: 6450,
        image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop&q=80'
      }
    ],
    totalAmount: 6450,
    gstNumber: '29AAAAA0000A1Z5',
    invoiceNumber: 'INV-2026-96540'
  }
];

export const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ onBackToHome }) => {
  const { playClick, playSuccess } = useSound();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const [downloadedInvoiceId, setDownloadedInvoiceId] = useState<string | null>(null);

  const handleDownloadInvoice = (order: OrderRecord) => {
    playClick();
    setDownloadedInvoiceId(order.id);

    const invoiceContent = `=====================================================
BUILDIT TECHNOLOGIES INDIA PVT LTD - GST TAX INVOICE
=====================================================
Invoice Number : ${order.invoiceNumber}
Date & Time    : ${order.date}
Client GSTIN   : ${order.gstNumber}
Delivery Site  : ${order.siteName}
Address        : ${order.addressLine}
IRN Verification: e-inv-${order.id}-9941a87b-verified
-----------------------------------------------------
ITEMIZED BREAKDOWN:
${order.items.map((it, idx) => `${idx + 1}. ${it.name} | Qty: ${it.qty} | Price: ₹${it.price} | Total: ₹${it.qty * it.price}`).join('\n')}
-----------------------------------------------------
SUBTOTAL       : ₹${order.totalAmount}
CGST (9%)      : ₹${Math.round(order.totalAmount * 0.09)}
SGST (9%)      : ₹${Math.round(order.totalAmount * 0.09)}
TOTAL PAID     : ₹${order.totalAmount}
PAYMENT STATUS : PAID VIA CORPORATE PO / UPI
=====================================================
Thank you for building with BuildIt 8-Min Hyper-Logistics.`;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${order.invoiceNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadedInvoiceId(null), 3000);
  };

  const handleReorder = (order: OrderRecord) => {
    playSuccess();
    order.items.forEach((item) => {
      const fullProduct = PRODUCTS.find((p) => p.id === item.id) || {
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: Math.round(item.price * 1.2),
        discountPercentage: 16,
        unit: '1 unit',
        deliveryTimeMins: 8,
        inStock: true,
        sku: item.id,
        rating: 4.8,
        ratingCount: 120,
        category: 'power-tools',
        image: item.image,
        description: item.name
      };
      for (let i = 0; i < item.qty; i++) {
        addToCart(fullProduct);
      }
    });
    setIsCartDrawerOpen(true);
  };

  const handleExportAllOrdersCSV = () => {
    playSuccess();
    const headers = 'Order_ID,Date,Status,Site_Name,Address,Total_Amount_INR,GSTIN,Invoice_Number,Items_Summary\n';
    const rows = PAST_ORDERS.map(
      (o) =>
        `"${o.id}","${o.date}","${o.status}","${o.siteName}","${o.addressLine}",${o.totalAmount},"${o.gstNumber}","${o.invoiceNumber}","${o.items.map(i => `${i.name} (x${i.qty})`).join('; ')}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buildit_past_orders_history.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="bg-[#062B32] text-white p-5 rounded-2xl border border-[#041E24] flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClick();
              onBackToHome();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Package size={20} className="text-[#D8F43A]" />
              <h2 className="text-lg font-black tracking-tight">Order History & Dispatches</h2>
            </div>
            <p className="text-xs text-white/70 mt-0.5">
              Live tracking, Google Maps directions, and GST tax invoice downloads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAllOrdersCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
          >
            <Download size={14} className="text-[#D8F43A]" />
            <span>Export Orders (CSV)</span>
          </button>

          <span className="text-xs font-black bg-[#D8F43A] text-[#062B32] px-3 py-2 rounded-xl">
            {PAST_ORDERS.length} Orders Logged
          </span>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {PAST_ORDERS.map((order) => {
          const isTransit = order.status === 'in_transit';
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.googleMapsQuery)}`;

          return (
            <div
              key={order.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-2xs ${
                isTransit ? 'border-amber-400 ring-1 ring-amber-300' : 'border-[#E5E7EB]'
              }`}
            >
              {/* Top Order Status Banner */}
              <div className="p-4 bg-slate-50 border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isTransit ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {isTransit ? <Truck size={16} className="animate-pulse" /> : <CheckCircle2 size={16} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#0F172A]">Order #{order.id}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isTransit
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isTransit ? `Van Dispatched • ${order.eta}` : order.eta}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B] font-medium">{order.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadInvoice(order)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#062B32] text-xs font-bold text-[#0F172A] transition-all shadow-2xs"
                  >
                    <FileText size={13} className="text-[#062B32]" />
                    <span>{downloadedInvoiceId === order.id ? 'Downloaded' : 'GST Invoice'}</span>
                  </button>

                  <button
                    onClick={() => handleReorder(order)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#062B32] hover:bg-[#093E48] text-[#D8F43A] text-xs font-black transition-all shadow-2xs"
                  >
                    <RotateCcw size={13} />
                    <span>Re-Order</span>
                  </button>
                </div>
              </div>

              {/* Destination Address & Google Maps Link */}
              <div className="px-4 py-3 bg-white border-b border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-[#475569]">
                  <MapPin size={15} className="text-rose-500 flex-shrink-0" />
                  <span className="font-bold text-[#0F172A]">{order.siteName}:</span>
                  <span className="font-medium text-[#64748B] truncate max-w-md">{order.addressLine}</span>
                </div>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-black text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <span>View on Google Maps</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Items List */}
              <div className="p-4 divide-y divide-[#F1F5F9] space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-[#E5E7EB] p-1 flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-[#0F172A] line-clamp-1">{item.name}</h4>
                        <span className="text-[11px] text-[#64748B] font-medium">Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#0F172A] whitespace-nowrap">
                      ₹{(item.qty * item.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Summary Footer */}
              <div className="px-4 py-3 bg-slate-50/70 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-bold">
                <span className="text-[#64748B]">Total Paid (Incl. GST & Instant Dispatch)</span>
                <span className="text-sm font-black text-[#062B32]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
