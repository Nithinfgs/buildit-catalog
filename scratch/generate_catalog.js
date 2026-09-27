const fs = require('fs');
const path = require('path');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i+1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

const CATEGORY_MAP = {
  'Power Tools & Machinery': { id: 'power-tools', name: 'POWER TOOLS', binPrefix: 'BAY-A' },
  'Electronics & Robotics': { id: 'electronics-robotics', name: 'ELECTRONICS & ROBOTICS', binPrefix: 'BAY-E' },
  'Li-Ion Batteries & Power': { id: 'lithium-batteries', name: 'LI-ION BATTERIES', binPrefix: 'BAY-B' },
  'Fasteners & Hardware': { id: 'fasteners-hardware', name: 'FASTENERS & HARDWARE', binPrefix: 'AISLE-3 · BIN F-' },
  'Plumbing & PVC Fittings': { id: 'plumbing-pvc', name: 'PLUMBING & PIPES', binPrefix: 'AISLE-4 · BIN P-' },
  'Electricals & Cables': { id: 'electrical-wiring', name: 'CABLES & SWITCHGEAR', binPrefix: 'BAY-E · CABLE RACK ' },
  'Cement & Raw Materials': { id: 'construction-cement', name: 'CEMENT & MATERIALS', binPrefix: 'YARD-C · PALLET ' },
  'Adhesives & Sealants': { id: 'adhesives-sealants', name: 'ADHESIVES & SEALANTS', binPrefix: 'AISLE-5 · BIN A-' },
  'Site Safety & PPE': { id: 'safety-ppe', name: 'SAFETY & PPE', binPrefix: 'BAY-S · PPE RACK ' },
  'Paints & Finishes': { id: 'paints-finishes', name: 'PAINTS & COATINGS', binPrefix: 'AISLE-6 · PAINT ROW ' },
  'Painting Supplies & Tools': { id: 'painting-supplies', name: 'PAINTING TOOLS', binPrefix: 'AISLE-6 · BIN T-' },
  'Door Hardware & Fittings': { id: 'door-hardware', name: 'DOOR HARDWARE', binPrefix: 'AISLE-7 · BIN D-' },
  'Hand Tools & Measuring': { id: 'hand-tools', name: 'HAND TOOLS & GAUGES', binPrefix: 'AISLE-2 · TOOL WALL ' },
  'On-Demand Fabrication': { id: 'fabrication', name: 'PCB & 3D FABRICATION', binPrefix: 'STUDIO-FAB-01' },
  'CAD & Blueprints': { id: 'cad-blueprints', name: 'CAD BLUEPRINTS', binPrefix: 'PLOTTER-BAY-01' }
};

const csvPath = '/Users/nithinselvaraj/Desktop/buildit_complete_catalog_inventory.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split(/\r?\n/).filter(Boolean);

const products = [];
const binCounters = {};

for (let i = 1; i < lines.length; i++) {
  const cols = parseCSVLine(lines[i]);
  if (cols.length < 13) continue;

  const [
    categoryRaw,
    skuId,
    name,
    imageUrl,
    brand,
    unit,
    priceStr,
    mrpStr,
    discountStr,
    deliverySpeed,
    stockStatus,
    ratingRaw,
    descRaw
  ] = cols.map(c => c.trim());

  const catMeta = CATEGORY_MAP[categoryRaw] || { id: 'all', name: categoryRaw, binPrefix: 'BAY-X' };
  const catId = catMeta.id;

  binCounters[catId] = (binCounters[catId] || 0) + 1;
  const binNumber = String(binCounters[catId]).padStart(2, '0');
  const warehouseBin = catMeta.binPrefix.endsWith('-') || catMeta.binPrefix.endsWith(' ')
    ? catMeta.binPrefix + binNumber
    : catMeta.binPrefix + '-' + binNumber;

  const price = parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 100;
  const originalPrice = parseInt(mrpStr.replace(/[^0-9]/g, ''), 10) || price;
  const discountPercentage = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  let rating = 4.8;
  let ratingCount = 1240;
  const ratingMatch = ratingRaw.match(/([0-9\.]+)\s*\(([0-9,]+)\)/);
  if (ratingMatch) {
    rating = parseFloat(ratingMatch[1]) || 4.8;
    ratingCount = parseInt(ratingMatch[2].replace(/,/g, ''), 10) || 1240;
  }

  let deliveryMins = 8;
  if (deliverySpeed.toLowerCase().includes('hour')) {
    const hours = parseInt(deliverySpeed, 10) || 24;
    deliveryMins = hours * 60;
  } else if (deliverySpeed.toLowerCase().includes('min')) {
    deliveryMins = parseInt(deliverySpeed, 10) || 8;
  }

  const inStock = !stockStatus.toLowerCase().includes('out of stock');
  const inStockCount = inStock ? (20 + ((i * 7) % 80)) : 0;

  const specifications = {
    'Manufacturer': brand,
    'Dispatch Bin': warehouseBin,
    'Package / Unit': unit,
    'Quality Standard': '100% OEM Tested / ISI Compliant'
  };

  products.push({
    id: skuId || `sku-${i}`,
    sku: skuId ? skuId.toUpperCase() : `SKU-${i}`,
    mpn: `MPN-${(skuId || '').toUpperCase().slice(0, 8)}`,
    manufacturer: brand,
    name,
    category: catId,
    subCategory: categoryRaw,
    image: imageUrl,
    price,
    originalPrice,
    discountPercentage,
    unit,
    deliveryTimeMins: deliveryMins,
    etaMinutes: deliveryMins <= 60 ? deliveryMins : 8,
    inStock,
    inStockCount,
    warehouseBin,
    rating,
    ratingCount,
    description: descRaw,
    brand,
    shelfLife: '100% Genuine OEM',
    countryOfOrigin: 'India',
    tags: [brand, catMeta.name, unit].filter(Boolean),
    specifications
  });
}

const CATEGORIES = [
  { id: 'all', name: 'ALL INVENTORY', icon: 'all' },
  { id: 'power-tools', name: 'POWER TOOLS', icon: 'power-tools' },
  { id: 'electronics-robotics', name: 'ELECTRONICS & ROBOTICS', icon: 'electronics-robotics' },
  { id: 'lithium-batteries', name: 'LI-ION BATTERIES', icon: 'lithium-batteries' },
  { id: 'fasteners-hardware', name: 'FASTENERS & HARDWARE', icon: 'fasteners-hardware' },
  { id: 'plumbing-pvc', name: 'PLUMBING & PIPES', icon: 'plumbing-pvc' },
  { id: 'electrical-wiring', name: 'CABLES & SWITCHGEAR', icon: 'electrical-wiring' },
  { id: 'construction-cement', name: 'CEMENT & RAW MATERIALS', icon: 'construction-cement' },
  { id: 'adhesives-sealants', name: 'ADHESIVES & SEALANTS', icon: 'adhesives-sealants' },
  { id: 'safety-ppe', name: 'SITE SAFETY & PPE', icon: 'safety-ppe' },
  { id: 'paints-finishes', name: 'PAINTS & COATINGS', icon: 'paints-finishes' },
  { id: 'painting-supplies', name: 'PAINTING TOOLS', icon: 'painting-supplies' },
  { id: 'door-hardware', name: 'DOOR HARDWARE', icon: 'door-hardware' },
  { id: 'hand-tools', name: 'HAND TOOLS & GAUGES', icon: 'hand-tools' },
  { id: 'fabrication', name: 'PCB & 3D PRINTING', icon: 'fabrication' },
  { id: 'cad-blueprints', name: 'CAD BLUEPRINTS', icon: 'cad-blueprints' }
];

const BANNERS = [
  {
    id: 'banner-1',
    title: '10-Minute Jobsite Logistics & BOM Dispatch',
    subtitle: 'High-speed delivery of genuine power tools, electronic components, raw cement, UPVC pipes, and hardware directly to active construction bays.',
    tag: 'EXPRESS TERMINAL',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    actionCategory: 'power-tools'
  },
  {
    id: 'banner-2',
    title: 'ESP32, Robotics & High-Drain 18650 Power Cells',
    subtitle: 'Rapid prototyping hardware, N20 gear motors, 3S/4S BMS modules, multimeters and bench testing instruments delivered in ~8 minutes.',
    tag: 'R&D HARDWARE',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
    actionCategory: 'electronics-robotics'
  },
  {
    id: 'banner-3',
    title: 'Heavy Equipment & Machinery Rental Fleet',
    subtitle: 'Hilti demolition hammers, diamond core drills, and ESAB inverter welders available on flexible 24h/7d jobsite lease with 100% refundable deposits.',
    tag: 'MACHINERY LEASE',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80',
    actionCategory: 'rent'
  }
];

const MOCK_ADDRESSES = [
  {
    id: 'addr-1',
    type: 'work',
    title: 'Site A - Brigade Tech Tower',
    addressLine: 'Gate 4, Plot 18, Electronic City Phase 1',
    landmark: '1.8 km from BLR-01 Hub',
    pincode: '560100',
    isDefault: true
  },
  {
    id: 'addr-2',
    type: 'work',
    title: 'Electronics & Robotics R&D Lab',
    addressLine: 'Building 7A, Hardware Lab 3, Ecospace Tech Park',
    landmark: '3.2 km from BLR-01 Hub',
    pincode: '560103'
  },
  {
    id: 'addr-3',
    type: 'home',
    title: 'Peenya Contractor Warehouse',
    addressLine: '#142, Industrial Suburb, Peenya 2nd Stage',
    landmark: 'Central Inventory Yard',
    pincode: '560058'
  }
];

const TRENDING_SEARCHES = [
  'BOSCH GSB 500',
  'ESP32-WROOM-32',
  '18650 BATTERY PACK',
  'M3 SS304 HEX BOLT',
  'ASTRAL UPVC 1-INCH',
  'POLYCAB 2.5MM WIRE',
  'ULTRATECH 50KG CEMENT',
  'DR. FIXIT LW+',
  'DEWALT 20V DRILL',
  'ASIAN PAINTS APCOLITE',
  'BIRLA WHITE PUTTY',
  'SCHNEIDER 16A MCB'
];

const tsFileContent = `import { Category, Product, Address, Banner } from '../types';

export const BANNERS: Banner[] = ${JSON.stringify(BANNERS, null, 2)};

export const CATEGORIES: Category[] = ${JSON.stringify(CATEGORIES, null, 2)};

export const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

export const MOCK_ADDRESSES: Address[] = ${JSON.stringify(MOCK_ADDRESSES, null, 2)};

export const TRENDING_SEARCHES = ${JSON.stringify(TRENDING_SEARCHES, null, 2)};
`;

const targetPath = path.join(__dirname, '../src/data/catalog.ts');
fs.writeFileSync(targetPath, tsFileContent, 'utf8');
console.log('Successfully written catalog.ts with', products.length, 'products to', targetPath);
