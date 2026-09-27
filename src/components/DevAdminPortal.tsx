import React, { useState } from 'react';
import {
  Sliders,
  Terminal,
  Database,
  Truck,
  Package,
  Wrench,
  Activity,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Zap,
  DollarSign,
  TrendingUp,
  MapPin,
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight,
  Store,
  Building,
  PhoneCall,
  Plus,
  Clock,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '../data/catalog';
import { RENTAL_TOOLS } from '../data/rentalTools';
import { Product } from '../types';
import { useSound } from '../context/SoundContext';

interface DevAdminPortalProps {
  onBackToStorefront: () => void;
}

interface OnboardShop {
  id: string;
  name: string;
  owner: string;
  phone: string;
  gstin: string;
  location: string;
  mapsQuery: string;
  category: string;
  activeSkus: number;
  dailyOrders: number;
  status: 'Online' | 'Busy' | 'Paused';
  slaScore: string;
  radiusKm: number;
  commission: string;
  activeOrdersCount: number;
}

const INITIAL_SHOPS: OnboardShop[] = [
  {
    id: 'shop-1',
    name: 'Sri Balaji Hardware & Electricals (Bellandur Hub)',
    owner: 'Ramesh Kumar',
    phone: '+91 98451 22334',
    gstin: '29AABCS1429K1Z4',
    location: 'Outer Ring Road, Bellandur, Bengaluru',
    mapsQuery: 'Bellandur, Bengaluru',
    category: 'Power Tools, Fasteners & Electricals',
    activeSkus: 210,
    dailyOrders: 48,
    status: 'Online',
    slaScore: '99.6%',
    radiusKm: 4.5,
    commission: '8.0%',
    activeOrdersCount: 2
  },
  {
    id: 'shop-2',
    name: 'Sreeram Steels & Fasteners Depot',
    owner: 'M. Sreeram',
    phone: '+91 98860 99441',
    gstin: '29SRERM8821B1Z2',
    location: 'Electronic City Phase 1, Bengaluru',
    mapsQuery: 'Electronic City Phase 1, Bengaluru',
    category: 'SS304 Hex Screws, Drywall Bolts & Anchor Sets',
    activeSkus: 145,
    dailyOrders: 34,
    status: 'Online',
    slaScore: '99.1%',
    radiusKm: 5.0,
    commission: '7.5%',
    activeOrdersCount: 1
  },
  {
    id: 'shop-3',
    name: 'Apex Paints & Waterproofing Master Depot',
    owner: 'Vikram Joshi',
    phone: '+91 97312 44556',
    gstin: '29APEXP7712M1Z8',
    location: 'ITPL Main Road, Whitefield, Bengaluru',
    mapsQuery: 'ITPL Main Road, Whitefield, Bengaluru',
    category: 'Asian Paints, Dr. Fixit & Primers',
    activeSkus: 88,
    dailyOrders: 29,
    status: 'Online',
    slaScore: '98.8%',
    radiusKm: 4.0,
    commission: '9.0%',
    activeOrdersCount: 1
  },
  {
    id: 'shop-4',
    name: 'Astral & Ashirvad FlowGuard PVC Mega Yard',
    owner: 'Suresh Patel',
    phone: '+91 99001 55667',
    gstin: '29ASTRL9901F1Z3',
    location: 'Koramangala 4th Block, Bengaluru',
    mapsQuery: 'Koramangala 4th Block, Bengaluru',
    category: 'Astral UPVC, CPVC Brass Fittings & Solvent Cements',
    activeSkus: 130,
    dailyOrders: 42,
    status: 'Online',
    slaScore: '99.4%',
    radiusKm: 4.2,
    commission: '8.0%',
    activeOrdersCount: 1
  },
  {
    id: 'shop-5',
    name: 'RoboCraze & Embedded Electronics Dark Hub',
    owner: 'Aditya Sen',
    phone: '+91 98450 77889',
    gstin: '29ROBOC4412P1Z0',
    location: 'HSR Layout Sector 1, Bengaluru',
    mapsQuery: 'HSR Layout Sector 1, Bengaluru',
    category: 'ESP32, Arduino, Li-Ion Cells, N20 Motors & BMS',
    activeSkus: 180,
    dailyOrders: 65,
    status: 'Online',
    slaScore: '99.8%',
    radiusKm: 6.0,
    commission: '10.0%',
    activeOrdersCount: 3
  }
];

export const DevAdminPortal: React.FC<DevAdminPortalProps> = ({ onBackToStorefront }) => {
  const { playClick, playSuccess } = useSound();
  const [activeAdminTab, setActiveAdminTab] = useState<'inventory' | 'orders' | 'shops' | 'rentals' | 'logs'>('inventory');
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Onboarded Shops state
  const [onboardedShops, setOnboardedShops] = useState<OnboardShop[]>(INITIAL_SHOPS);
  const [selectedShopFilter, setSelectedShopFilter] = useState<string>('all');
  const [isAddingShop, setIsAddingShop] = useState(false);

  // New Shop Form State
  const [newShopName, setNewShopName] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGstin, setNewGstin] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCategory, setNewCategory] = useState('General Hardware & Tools');
  const [newRadius, setNewRadius] = useState('5.0');

  // Admin Order State
  const [activeOrders, setActiveOrders] = useState([
    {
      id: 'BLT-98421',
      customer: 'Nithin Selvaraj (Lead Engineer)',
      gstin: '29AAAAA0000A1Z5',
      hub: 'BLR-01 Bellandur Micro-Hub',
      shopId: 'shop-1',
      shopName: 'Sri Balaji Hardware & Electricals (Bellandur Hub)',
      vanId: 'VAN-KA-01-MJ-8812',
      destination: 'Brigade Tech Town (Site A)',
      mapsQuery: 'Brigade Tech Gardens, Bellandur, Bengaluru',
      itemsCount: 3,
      amount: 4497,
      status: 'Van Dispatched',
      slaMinutesLeft: 3.5
    },
    {
      id: 'BLT-98422',
      customer: 'Prestige Infra Projects',
      gstin: '29PREST9912K1Z9',
      hub: 'BLR-04 Electronic City Dark Hub',
      shopId: 'shop-2',
      shopName: 'Sreeram Steels & Fasteners Depot',
      vanId: 'VAN-KA-51-AB-1902',
      destination: 'Prestige Tech Cloud Tower C',
      mapsQuery: 'Prestige Tech Cloud, Bengaluru',
      itemsCount: 8,
      amount: 14890,
      status: 'Bin Picking',
      slaMinutesLeft: 7.2
    },
    {
      id: 'BLT-98423',
      customer: 'Embassy Tech Village R&D Lab',
      gstin: '29EMBASSY882B1Z1',
      hub: 'BLR-01 Bellandur Micro-Hub',
      shopId: 'shop-4',
      shopName: 'Astral & Ashirvad FlowGuard PVC Mega Yard',
      vanId: 'VAN-KA-01-ZZ-9910',
      destination: 'Embassy Tech Village Phase 2',
      mapsQuery: 'Embassy Tech Village, Outer Ring Road, Bengaluru',
      itemsCount: 12,
      amount: 8750,
      status: 'Arrived at Site',
      slaMinutesLeft: 0.8
    },
    {
      id: 'BLT-98424',
      customer: 'Salarpuria Sattva Construction',
      gstin: '29SALAR8812P1Z0',
      hub: 'BLR-03 Whitefield Central Hub',
      shopId: 'shop-3',
      shopName: 'Apex Paints & Waterproofing Master Depot',
      vanId: 'VAN-KA-03-TR-4421',
      destination: 'Sattva Knowledge City Site B',
      mapsQuery: 'Whitefield, Bengaluru',
      itemsCount: 5,
      amount: 18400,
      status: 'Bin Picking',
      slaMinutesLeft: 6.5
    }
  ]);

  // Telemetry logs
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [SYSTEM] BuildIt Hyper-Logistics Gateway 14.0.0 Online.`,
    `[${new Date().toLocaleTimeString()}] [SHOP-FLEET] 5 Onboarded partner merchant shops online and linked with 12 dispatch vans.`,
    `[${new Date().toLocaleTimeString()}] [TELEMETRY] GPS van VAN-KA-01-MJ-8812 pinged at 12.9279° N, 77.6848° E (Speed: 38 km/h).`,
    `[${new Date().toLocaleTimeString()}] [INVENTORY] Automated bin allocation verified for 462 active SKUs across 8 hubs.`,
    `[${new Date().toLocaleTimeString()}] [GST-GATEWAY] E-Invoice IRN verified with NIC e-way bill system for PO #BLT-98421.`,
    `[${new Date().toLocaleTimeString()}] [RENTAL-ESCROW] Security deposit escrow holds ₹25,000 for active heavy machinery.`
  ]);

  const toggleProductStock = (id: string) => {
    playClick();
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] [ADMIN] Stock status toggled for SKU #${id}.`,
      ...prev.slice(0, 30)
    ]);
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice <= 0) return;
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    );
  };

  const advanceOrderStatus = (orderId: string) => {
    playSuccess();
    setActiveOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        let nextStatus = 'Delivered';
        if (order.status === 'Bin Picking') nextStatus = 'Van Dispatched';
        else if (order.status === 'Van Dispatched') nextStatus = 'Arrived at Site';
        else if (order.status === 'Arrived at Site') nextStatus = 'Delivered';
        else nextStatus = 'Bin Picking';
        return { ...order, status: nextStatus };
      })
    );
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] [DISPATCH-OVERRIDE] Order #${orderId} status advanced manually.`,
      ...prev.slice(0, 30)
    ]);
  };

  const toggleShopStatus = (shopId: string) => {
    playClick();
    setOnboardedShops((prev) =>
      prev.map((s) => {
        if (s.id !== shopId) return s;
        const newStatus = s.status === 'Online' ? 'Paused' : 'Online';
        return { ...s, status: newStatus };
      })
    );
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] [SHOP-STATUS] Merchant status toggled for #${shopId}.`,
      ...prev.slice(0, 30)
    ]);
  };

  const handleOnboardNewShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName || !newOwner || !newPhone) return;

    const newShop: OnboardShop = {
      id: `shop-${Date.now()}`,
      name: newShopName,
      owner: newOwner,
      phone: newPhone,
      gstin: newGstin || '29AAAAA0000A1Z5',
      location: newLocation || 'Bengaluru Metro Area',
      mapsQuery: newLocation || 'Bengaluru, Karnataka',
      category: newCategory,
      activeSkus: 85,
      dailyOrders: 0,
      status: 'Online',
      slaScore: '100%',
      radiusKm: parseFloat(newRadius) || 5.0,
      commission: '8.0%',
      activeOrdersCount: 0
    };

    setOnboardedShops([newShop, ...onboardedShops]);
    playSuccess();
    setIsAddingShop(false);
    setNewShopName('');
    setNewOwner('');
    setNewPhone('');
    setNewGstin('');
    setNewLocation('');
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] [SHOP-ONBOARD] New merchant partner "${newShop.name}" onboarded.`,
      ...prev.slice(0, 30)
    ]);
  };

  const handleExportCSV = () => {
    playSuccess();
    const headers = 'ID,Name,Category,Price,MRP,Discount,StockStatus,DeliveryTime,SKU\n';
    const rows = productsList
      .map((p) => `"${p.id}","${p.name.replace(/"/g, '""')}","${p.category}",${p.price},${p.originalPrice},"${p.discountPercentage || 0}%",${p.inStock ? 'InStock' : 'OutOfStock'},"${p.deliveryTimeMins || 8} MINS","${p.sku || p.id}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buildit_live_catalog_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportShopsCSV = () => {
    playSuccess();
    const headers = 'Shop_ID,Shop_Name,Owner_Name,Phone,GSTIN,Location,Category,Active_SKUs,Daily_Orders,Status,SLA_Score,Radius_Km,Commission_Rate\n';
    const rows = onboardedShops
      .map((s) => `"${s.id}","${s.name.replace(/"/g, '""')}","${s.owner}","${s.phone}","${s.gstin}","${s.location}","${s.category}",${s.activeSkus},${s.dailyOrders},"${s.status}","${s.slaScore}",${s.radiusKm},"${s.commission}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buildit_onboarded_partner_shops.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportOrdersCSV = () => {
    playSuccess();
    const headers = 'Order_ID,Customer_Name,GSTIN,Fulfilling_Shop,Hub,Van_ID,Destination,Items_Count,Amount_INR,Status,SLA_Minutes_Left\n';
    const rows = activeOrders
      .map((o) => `"${o.id}","${o.customer}","${o.gstin}","${o.shopName}","${o.hub}","${o.vanId}","${o.destination}",${o.itemsCount},${o.amount},"${o.status}",${o.slaMinutesLeft}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buildit_active_dispatches_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportRentalsCSV = () => {
    playSuccess();
    const headers = 'Tool_ID,Tool_Name,Category,Daily_Rate_INR,Weekly_Rate_INR,Security_Deposit_INR,Brand,Power_Specs,In_Stock\n';
    const rows = RENTAL_TOOLS
      .map((t) => `"${t.id}","${t.name.replace(/"/g, '""')}","${t.category}",${t.dailyRate},${t.weeklyRate},${t.securityDeposit},"${t.brand}","${t.powerSpecs}",${t.inStock ? 'TRUE' : 'FALSE'}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buildit_heavy_machinery_rental_fleet.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredProducts = productsList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchFilter.toLowerCase()) || p.id.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredOrders = selectedShopFilter === 'all'
    ? activeOrders
    : activeOrders.filter((o) => o.shopId === selectedShopFilter);

  return (
    <div className="space-y-5 max-w-7xl mx-auto select-none pb-12">
      {/* Dev Admin Top Command Bar */}
      <div className="bg-[#041E24] text-white p-5 rounded-2xl border border-[#093E48] shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClick();
              onBackToStorefront();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
          >
            <ArrowLeft size={16} />
            <span>Storefront</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#D8F43A] text-[#062B32] flex items-center justify-center font-black shadow-xs">
              <Terminal size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">BuildIt Dev & Operations Admin Portal</h1>
                <span className="px-2 py-0.5 rounded-md bg-[#D8F43A]/20 text-[#D8F43A] text-[10px] font-black border border-[#D8F43A]/30">
                  LIVE PROD GATEWAY
                </span>
              </div>
              <p className="text-xs text-white/60">
                Direct Catalog Control • Onboarded Partner Shops • Real-Time Van Telemetry • 8-Min SLA Dispatch
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
          >
            <Download size={14} className="text-[#D8F43A]" />
            <span>Export Catalog (CSV)</span>
          </button>
          <button
            onClick={() => {
              playSuccess();
              onBackToStorefront();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D8F43A] hover:bg-[#cbe633] text-[#062B32] text-xs font-black transition-all shadow-sm"
          >
            <CheckCircle2 size={15} />
            <span>Return to App</span>
          </button>
        </div>
      </div>

      {/* Real-time Executive KPI Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs mb-1 font-bold">
            <span>Live Catalog</span>
            <Package size={16} className="text-[#062B32]" />
          </div>
          <p className="text-2xl font-black text-[#0F172A]">{productsList.length}</p>
          <span className="text-[10px] font-bold text-emerald-600">100% Synced</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs mb-1 font-bold">
            <span>Onboarded Shops</span>
            <Store size={16} className="text-purple-600" />
          </div>
          <p className="text-2xl font-black text-[#0F172A]">{onboardedShops.length}</p>
          <span className="text-[10px] font-bold text-purple-600">{onboardedShops.filter(s => s.status === 'Online').length} Active Live Hubs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs mb-1 font-bold">
            <span>Active Vans</span>
            <Truck size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-black text-[#0F172A]">12</p>
          <span className="text-[10px] font-bold text-blue-600">Bengaluru Metro Fleet</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs mb-1 font-bold">
            <span>8-Min SLA Rate</span>
            <Zap size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black text-[#0F172A]">99.4%</p>
          <span className="text-[10px] font-bold text-emerald-600">&lt; 7.4 min avg delivery</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#64748B] text-xs mb-1 font-bold">
            <span>Processed GMV</span>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-[#0F172A]">₹48.6 L</p>
          <span className="text-[10px] font-bold text-emerald-600">This Month</span>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => {
            playClick();
            setActiveAdminTab('inventory');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'inventory'
              ? 'bg-[#062B32] text-[#D8F43A] shadow-xs'
              : 'bg-white text-[#475569] hover:bg-slate-100'
          }`}
        >
          <Package size={15} />
          <span>Catalog & Inventory ({productsList.length})</span>
        </button>

        <button
          onClick={() => {
            playClick();
            setActiveAdminTab('shops');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'shops'
              ? 'bg-[#062B32] text-[#D8F43A] shadow-xs'
              : 'bg-white text-[#475569] hover:bg-slate-100'
          }`}
        >
          <Store size={15} />
          <span>Onboarded Partner Shops ({onboardedShops.length})</span>
        </button>

        <button
          onClick={() => {
            playClick();
            setActiveAdminTab('orders');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'orders'
              ? 'bg-[#062B32] text-[#D8F43A] shadow-xs'
              : 'bg-white text-[#475569] hover:bg-slate-100'
          }`}
        >
          <Truck size={15} />
          <span>Live Order Tracking ({activeOrders.length})</span>
        </button>

        <button
          onClick={() => {
            playClick();
            setActiveAdminTab('rentals');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'rentals'
              ? 'bg-[#062B32] text-[#D8F43A] shadow-xs'
              : 'bg-white text-[#475569] hover:bg-slate-100'
          }`}
        >
          <Wrench size={15} />
          <span>Heavy Machinery Fleet ({RENTAL_TOOLS.length})</span>
        </button>

        <button
          onClick={() => {
            playClick();
            setActiveAdminTab('logs');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'logs'
              ? 'bg-[#062B32] text-[#D8F43A] shadow-xs'
              : 'bg-white text-[#475569] hover:bg-slate-100'
          }`}
        >
          <Activity size={15} />
          <span>Live Telemetry</span>
        </button>
      </div>

      {/* 1. INVENTORY MANAGER TAB */}
      {activeAdminTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden space-y-4 p-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-[#E5E7EB] rounded-xl px-3 py-2">
              <Search size={16} className="text-[#64748B]" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by SKU ID, Brand, or Product Name..."
                className="w-full bg-transparent text-xs text-[#0F172A] outline-none font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A] outline-none"
              >
                <option value="all">All Categories</option>
                <option value="power-tools">Power Tools</option>
                <option value="electronics-robotics">Electronics & Robotics</option>
                <option value="fasteners-hardware">Fasteners & Screws</option>
                <option value="plumbing-pvc">Plumbing & PVC</option>
                <option value="construction-cement">Construction & Cement</option>
                <option value="paints-finishes">Paints & Finishes</option>
                <option value="electrical-wiring">Electrical Wiring</option>
                <option value="safety-ppe">Safety Gear</option>
              </select>

              <button
                onClick={() => {
                  setProductsList(PRODUCTS);
                  playSuccess();
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#475569] flex items-center gap-1"
              >
                <RefreshCw size={13} />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto max-h-[600px] border border-[#E5E7EB] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[#64748B] font-bold border-b border-[#E5E7EB] sticky top-0 z-10">
                <tr>
                  <th className="p-3">Product / SKU</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Live Price (₹)</th>
                  <th className="p-3">MRP (₹)</th>
                  <th className="p-3">SLA Dispatch</th>
                  <th className="p-3 text-center">Stock Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] font-medium text-[#0F172A]">
                {filteredProducts.slice(0, 100).map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-contain bg-slate-100 border border-[#E5E7EB] p-1 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#0F172A] line-clamp-1 max-w-sm">{prod.name}</p>
                          <span className="text-[10px] text-[#64748B] font-mono">SKU: {prod.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-[#475569] text-[10px] font-bold">
                        {prod.category}
                      </span>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <input
                        type="number"
                        defaultValue={prod.price}
                        onBlur={(e) => updateProductPrice(prod.id, parseInt(e.target.value))}
                        className="w-20 bg-slate-50 border border-[#E5E7EB] rounded-lg px-2 py-1 text-xs font-black text-[#0F172A] outline-none focus:border-[#062B32]"
                      />
                    </td>

                    <td className="p-3 whitespace-nowrap text-[#64748B]">
                      ₹{prod.originalPrice}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                        ⚡ {prod.deliveryTimeMins || 8} MINS
                      </span>
                    </td>

                    <td className="p-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => toggleProductStock(prod.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                          prod.inStock
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {prod.inStock ? 'In Stock (Active)' : 'Out of Stock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-[#64748B] text-right font-medium">
            Showing {Math.min(100, filteredProducts.length)} of {filteredProducts.length} filtered items
          </div>
        </div>
      )}

      {/* 2. ONBOARDED PARTNER SHOPS & HUBS TAB */}
      {activeAdminTab === 'shops' && (
        <div className="space-y-4">
          {/* Top Bar for Partner Shops */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-2xs">
            <div>
              <h3 className="text-sm font-black text-[#0F172A]">Onboarded Partner Merchant Stores & Dark Hubs</h3>
              <p className="text-xs text-[#64748B]">Hyper-local fulfillment nodes powering 8-min site dispatch</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportShopsCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all border border-[#E5E7EB]"
              >
                <FileSpreadsheet size={14} className="text-[#062B32]" />
                <span>Export Shops (CSV)</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  setIsAddingShop(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#062B32] hover:bg-[#093E48] text-[#D8F43A] text-xs font-black transition-all shadow-xs"
              >
                <Plus size={15} />
                <span>Onboard New Partner Shop</span>
              </button>
            </div>
          </div>

          {/* Onboard New Shop Form Modal */}
          <AnimatePresence>
            {isAddingShop && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-[#062B32] p-5 shadow-md space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                    Onboard New Merchant Partner / Hardware Distributor
                  </h4>
                  <button
                    onClick={() => setIsAddingShop(false)}
                    className="text-xs text-[#64748B] hover:text-[#0F172A] font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleOnboardNewShop} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div>
                    <label className="font-bold text-[#0F172A] block mb-1">Shop / Agency Name</label>
                    <input
                      type="text"
                      required
                      value={newShopName}
                      onChange={(e) => setNewShopName(e.target.value)}
                      placeholder="e.g. Mahalakshmi Electricals & Tools"
                      className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] outline-none focus:border-[#062B32] font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0F172A] block mb-1">Owner / Lead Partner</label>
                    <input
                      type="text"
                      required
                      value={newOwner}
                      onChange={(e) => setNewOwner(e.target.value)}
                      placeholder="e.g. Anand Gowda"
                      className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] outline-none focus:border-[#062B32] font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0F172A] block mb-1">Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+91 98450 11223"
                      className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] outline-none focus:border-[#062B32] font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0F172A] block mb-1">GSTIN</label>
                    <input
                      type="text"
                      value={newGstin}
                      onChange={(e) => setNewGstin(e.target.value)}
                      placeholder="29AAAAA0000A1Z5"
                      className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] outline-none focus:border-[#062B32] font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0F172A] block mb-1">Location / Hub Area</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Koramangala 80ft Road, Bengaluru"
                      className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] outline-none focus:border-[#062B32] font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#0F172A] block mb-1">Dispatch Radius (km)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newRadius}
                      onChange={(e) => setNewRadius(e.target.value)}
                      placeholder="5.0"
                      className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] outline-none focus:border-[#062B32] font-medium"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsAddingShop(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-[#475569] font-bold text-xs hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#062B32] text-[#D8F43A] font-black text-xs hover:bg-[#093E48]"
                    >
                      Complete Merchant Onboarding
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Onboarded Shops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onboardedShops.map((shop) => {
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.mapsQuery)}`;
              const shopOrders = activeOrders.filter((o) => o.shopId === shop.id);

              return (
                <div
                  key={shop.id}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-2xs space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-black flex-shrink-0 border border-purple-100">
                          <Store size={20} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[#0F172A]">{shop.name}</h4>
                          <span className="text-[11px] text-[#64748B] font-medium">{shop.category}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleShopStatus(shop.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all ${
                          shop.status === 'Online'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {shop.status === 'Online' ? '● Online (Live)' : '❚❚ Paused'}
                      </button>
                    </div>

                    {/* Partner Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-[#F1F5F9]">
                      <div>
                        <span className="text-[10px] text-[#64748B] font-bold block">Owner / Partner</span>
                        <p className="font-bold text-[#0F172A]">{shop.owner}</p>
                        <span className="text-[11px] text-[#475569]">{shop.phone}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#64748B] font-bold block">Fulfillment SLA</span>
                        <p className="font-black text-emerald-600">{shop.slaScore} Score</p>
                        <span className="text-[11px] text-[#475569]">Radius: {shop.radiusKm} km</span>
                      </div>
                    </div>

                    {/* Location & GST */}
                    <div className="flex items-center justify-between text-xs text-[#475569]">
                      <span className="text-[11px]">GSTIN: <strong className="font-mono text-[#0F172A]">{shop.gstin}</strong></span>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <MapPin size={12} className="text-rose-500" />
                        <span>Google Maps</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>

                  {/* Active Orders Assigned to this shop */}
                  <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#64748B]">
                        Active Dispatches: <strong className="text-[#062B32]">{shopOrders.length} Orders</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        playClick();
                        setSelectedShopFilter(shop.id);
                        setActiveAdminTab('orders');
                      }}
                      className="flex items-center gap-1 text-xs font-black text-[#062B32] hover:text-teal-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>Track Shop Orders</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. LIVE ORDER TRACKING PER ONBOARDED SHOP */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-4">
          {/* Shop Filter Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E5E7EB] shadow-2xs text-xs">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-[#062B32]" />
              <span className="font-bold text-[#0F172A]">Filter by Onboarded Shop:</span>
              <select
                value={selectedShopFilter}
                onChange={(e) => setSelectedShopFilter(e.target.value)}
                className="bg-slate-50 border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 font-bold text-[#0F172A] outline-none"
              >
                <option value="all">All Partner Shops & Hubs ({activeOrders.length} Orders)</option>
                {onboardedShops.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportOrdersCSV}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all border border-[#E5E7EB]"
              >
                <FileSpreadsheet size={14} className="text-[#062B32]" />
                <span>Export Orders (CSV)</span>
              </button>

              {selectedShopFilter !== 'all' && (
                <button
                  onClick={() => setSelectedShopFilter('all')}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((ord) => {
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ord.mapsQuery)}`;
              return (
                <div key={ord.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-2xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#062B32] text-[#D8F43A] flex items-center justify-center font-black text-sm">
                        <Truck size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-black text-[#0F172A]">Order #{ord.id}</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] font-medium">{ord.customer} • GSTIN: {ord.gstin}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => advanceOrderStatus(ord.id)}
                        className="px-3.5 py-2 rounded-xl bg-[#062B32] hover:bg-[#093E48] text-[#D8F43A] text-xs font-black transition-all shadow-xs"
                      >
                        Advance Dispatch Status →
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-[#F1F5F9]">
                      <span className="text-[10px] text-[#64748B] font-bold block uppercase">Fulfilling Onboarded Shop</span>
                      <p className="font-black text-[#0F172A] mt-0.5 line-clamp-1">{ord.shopName || ord.hub}</p>
                      <span className="text-[11px] font-mono text-[#475569]">{ord.vanId}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-[#F1F5F9]">
                      <span className="text-[10px] text-[#64748B] font-bold block uppercase">Delivery Site & Map</span>
                      <p className="font-black text-[#0F172A] mt-0.5">{ord.destination}</p>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span>Google Maps Route</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-[#F1F5F9]">
                      <span className="text-[10px] text-[#64748B] font-bold block uppercase">Order Value & SLA</span>
                      <p className="font-black text-[#0F172A] mt-0.5">₹{ord.amount.toLocaleString('en-IN')} ({ord.itemsCount} Items)</p>
                      <span className="text-[11px] font-black text-amber-600">SLA: {ord.slaMinutesLeft}m remaining</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. HEAVY MACHINERY RENTALS */}
      {activeAdminTab === 'rentals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {RENTAL_TOOLS.map((tool) => (
            <div key={tool.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-16 h-16 rounded-xl object-contain bg-slate-50 border border-[#E5E7EB] p-1.5 flex-shrink-0"
                />
                <div>
                  <h4 className="text-xs font-black text-[#0F172A] line-clamp-1">{tool.name}</h4>
                  <p className="text-[11px] text-[#64748B] font-medium">{tool.powerSpecs}</p>
                  <span className="text-xs font-black text-[#062B32]">
                    ₹{tool.dailyRate}/day • Dep: ₹{tool.securityDeposit}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  Active in Rental Fleet
                </span>
                <span className="text-[11px] text-[#64748B] font-medium">Ready for 8-min Van Dispatch</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. LIVE TELEMETRY LOGS */}
      {activeAdminTab === 'logs' && (
        <div className="bg-[#090D11] text-emerald-400 p-5 rounded-2xl border border-slate-800 font-mono text-xs space-y-2 h-[500px] overflow-y-auto shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400 text-[11px]">
            <span>LIVE EVENT BUS STREAM (WEBSOCKET PORT 8080)</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>
          {logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed hover:bg-slate-900/60 px-1 py-0.5 rounded">
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
