export interface ProService {
  id: string;
  title: string;
  trade: string;
  category: 'electrical' | 'plumbing' | 'tile-masonry' | 'carpentry' | 'painting' | 'welding' | 'helpers' | 'robotics';
  image: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  halfDayRate: number;
  fullDayRate: number;
  description: string;
  etaMinutes: number;
  verifiedBadges: string[];
  skills: string[];
  toolsEquipped: string[];
  insuranceCover: string;
}

export const PRO_SERVICES: ProService[] = [
  {
    id: 'srv-electrician',
    title: 'Certified Master Electrician & Wireman',
    trade: 'Electrical & Automation',
    category: 'electrical',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    rating: 4.95,
    reviewsCount: 420,
    hourlyRate: 499,
    halfDayRate: 1099,
    fullDayRate: 1899,
    description: 'Specialist for industrial 3-phase DB panel dressing, MCB/RCCB installation, conduit wiring, inverter/UPS setup, and emergency short-circuit troubleshooting.',
    etaMinutes: 15,
    verifiedBadges: ['Licensed Wireman Grade-A', 'Aadhaar Verified', '₹10 Lakh Site Insurance'],
    skills: ['3-Phase Industrial Wiring', 'DB Dressing & MCB Setup', 'Conduit Chasing', 'Earth Pit Resistance Testing', 'Smart Home Automation'],
    toolsEquipped: ['Fluke Digital Multimeter', 'Bosch Wall Chaser', 'Insulated 1000V VDE Screwdrivers', 'Automatic Wire Strippers'],
    insuranceCover: '₹10,00,000 Accidental Damage Cover Included'
  },
  {
    id: 'srv-plumber',
    title: 'Certified Master Plumber & Pipefitter',
    trade: 'Plumbing & SWR Drainage',
    category: 'plumbing',
    image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80',
    rating: 4.92,
    reviewsCount: 380,
    hourlyRate: 449,
    halfDayRate: 999,
    fullDayRate: 1699,
    description: 'Expert for Astral/Ashirvad CPVC hot/cold piping, concealed PPR pipelines, brass ball valve replacement, pressure booster pump installations, and acoustic leak detection.',
    etaMinutes: 15,
    verifiedBadges: ['CIPET Certified', 'Aadhaar & Police Verified', 'Zero-Mess Cleanup'],
    skills: ['CPVC & UPVC Pipe Welding', 'SWR Underground Drainage', 'Pressure Pump Calibration', 'Concealed Diverter Setup', 'Core Drilling & Traps'],
    toolsEquipped: ['Rothenberger Pipe Threader', 'Heavy Pipe Wrench Set', 'PPR Fusion Welding Machine', 'High-Pressure Hydrostatic Tester'],
    insuranceCover: '₹10,00,000 Water Ingress & Pipe Damage Insurance'
  },
  {
    id: 'srv-tile-mason',
    title: 'Precision Tile Layer, Marble & Stone Mason',
    trade: 'Tiling, Stone & Masonry',
    category: 'tile-masonry',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    rating: 4.88,
    reviewsCount: 290,
    hourlyRate: 599,
    halfDayRate: 1299,
    fullDayRate: 2199,
    description: 'High-precision vitrified tile, Italian marble, and granite slab installation with laser level alignment, 45-degree miter edge chamfering, and epoxy grout filling.',
    etaMinutes: 20,
    verifiedBadges: ['Master Mason Certified', 'Laser Calibration Expert', '100% Hollow-Free Guarantee'],
    skills: ['Large Format Slab Tiling (4x2, 6x4)', 'Laser Line Alignment', 'Epoxy Grout Application', 'Waterjet Cut Fitting', 'Brickwork & Mortar Bedding'],
    toolsEquipped: ['Bosch 3D Green Laser Level', 'Heavy Tile Vibration Machine', 'Ruby Tile Cutter 1200mm', 'Diamond Grinding Wheels'],
    insuranceCover: '₹10,00,000 Tile Breakage & Damage Guarantee'
  },
  {
    id: 'srv-carpenter',
    title: 'Precision Finish Carpenter & Woodworker',
    trade: 'Carpentry & Modular Fitments',
    category: 'carpentry',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    rating: 4.91,
    reviewsCount: 310,
    hourlyRate: 549,
    halfDayRate: 1199,
    fullDayRate: 1999,
    description: 'Skilled carpentry for commercial drywall partitions, acoustic panels, modular kitchen/wardrobe assembly, lock mortising, flush doors, and architectural molding.',
    etaMinutes: 20,
    verifiedBadges: ['Master Joiner Certified', 'Aadhaar Verified', 'Dust-Controlled Workspace'],
    skills: ['Drywall & Gypsum Partition', 'Modular Hardware Installation (Hettich/Hafele)', 'Door Frame & Mortise Lock Fitting', 'Laminate Edge Banding'],
    toolsEquipped: ['DeWalt Cordless Plunge Saw', 'Makita Laminate Trimmer', 'Pneumatic Brad Nailer', 'Digital Angle Finder'],
    insuranceCover: '₹10,00,000 Structural Woodwork Guarantee'
  },
  {
    id: 'srv-painter',
    title: 'Master Painter & Wall Coating Applicator',
    trade: 'Paints, Textures & Waterproofing',
    category: 'painting',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80',
    rating: 4.89,
    reviewsCount: 340,
    hourlyRate: 429,
    halfDayRate: 949,
    fullDayRate: 1599,
    description: 'Professional surface preparation, Birla White putty leveling, airless high-volume paint spraying, Apex Ultima exterior coatings, and Dr. Fixit waterproofing membrane application.',
    etaMinutes: 15,
    verifiedBadges: ['Asian Paints Certified', 'Dust-Free Sander Equipped', 'Full Masking & Floor Covering'],
    skills: ['Airless Paint Spraying', 'Putty Surface Sanding', 'Waterproofing Membrane Application', 'Exterior Texture Troweling', 'Wood & Metal PU Enamel'],
    toolsEquipped: ['Wagner Airless Spray Gun', 'Mirka Dustless Drywall Sander', 'Laser Moisture Meter', 'Heavy Drop Cloths & Masking Tapes'],
    insuranceCover: '₹10,00,000 Paint Spill & Overspray Insurance'
  },
  {
    id: 'srv-welder',
    title: 'Certified Structural Welder & Fabricator',
    trade: 'Welding & Metal Fabrication',
    category: 'welding',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    rating: 4.93,
    reviewsCount: 220,
    hourlyRate: 649,
    halfDayRate: 1399,
    fullDayRate: 2399,
    description: 'Certified arc, MIG, and TIG welding for MS structural columns, safety grills, staircase railings, automated sliding gates, and heavy machinery chassis modifications.',
    etaMinutes: 25,
    verifiedBadges: ['IS 7307 Welder Certified', 'Fire-Retardant PPE Equipped', 'Site Hot-Work Permit Ready'],
    skills: ['Shielded Metal Arc Welding (SMAW)', 'MIG/MAG Structural Jointing', 'Angle Iron & Box Pipe Cutting', 'Heavy Hinge Alignment', 'Anti-Rust Red Oxide Priming'],
    toolsEquipped: ['IGBT Inverter Arc Welder 250A', 'Bosch 9-Inch Heavy Angle Grinder', 'Auto-Darkening Welding Helmet', 'Heavy Magnetic Clamps'],
    insuranceCover: '₹10,00,000 Hot Work & Fire Safety Insurance'
  },
  {
    id: 'srv-helpers',
    title: 'General Construction Site Helpers & Shifting Crew',
    trade: 'Site Assistance & Material Handling',
    category: 'helpers',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
    rating: 4.87,
    reviewsCount: 510,
    hourlyRate: 299,
    halfDayRate: 699,
    fullDayRate: 1199,
    description: 'Energetic, physically verified labor crew for heavy material unloading (cement bags, steel rebars, tiles), concrete mixing, trenching, scaffolding assembly, and debris clearing.',
    etaMinutes: 15,
    verifiedBadges: ['Full Background Verified', 'Equipped with Safety Helmet & Boots', 'High-Stamina Crew'],
    skills: ['Heavy Material Unloading & Shifting', 'Mortar & Concrete Mixing', 'Scaffolding Stacking', 'Demolition Debris Disposal', 'Trench Digging'],
    toolsEquipped: ['3M Hard Hat & High-Vis Vest', 'Steel Toe Safety Boots', 'Heavy Grip Gloves', 'Shovels & Wheelbarrows'],
    insuranceCover: '₹10,00,000 Workman Compensation Insurance'
  },
  {
    id: 'srv-robotics',
    title: 'Embedded Hardware & IoT Prototyping Specialist',
    trade: 'Electronics & Firmware Engineering',
    category: 'robotics',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    rating: 4.97,
    reviewsCount: 160,
    hourlyRate: 699,
    halfDayRate: 1499,
    fullDayRate: 2599,
    description: 'Hands-on electronic engineer for SMD/THT PCB rework, ESP32/STM32 firmware flashing, lithium battery BMS wiring, motor driver debugging, and IoT cloud gateway setup.',
    etaMinutes: 20,
    verifiedBadges: ['B.Tech / Embedded Certified', 'ESD-Safe Workstation Ready', 'Firmware Code Verification'],
    skills: ['Precision SMD/THT Soldering', 'BMS & 18650 Battery Pack Spot Welding', 'ESP32/Arduino Firmware Flashing', 'Logic Analyzer Protocol Debugging', 'Sensor Calibration'],
    toolsEquipped: ['TS101 Digital Soldering Station', 'Saleae Logic Analyzer', 'Portable Digital Oscilloscope', 'Battery Spot Welder'],
    insuranceCover: '₹10,00,000 ESD Component Protection Insurance'
  }
];

export const SERVICE_CATEGORIES = [
  { id: 'all', label: 'All Pro Services' },
  { id: 'electrical', label: 'Electricians' },
  { id: 'plumbing', label: 'Plumbers' },
  { id: 'tile-masonry', label: 'Tile & Masonry' },
  { id: 'carpentry', label: 'Carpenters' },
  { id: 'painting', label: 'Painters' },
  { id: 'welding', label: 'Welders' },
  { id: 'helpers', label: 'Site Helpers' },
  { id: 'robotics', label: 'IoT & Electronics' },
];
