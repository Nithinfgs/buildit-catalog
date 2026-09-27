import React from 'react';
import {
  Cpu,
  Hammer,
  Zap,
  Wrench,
  Layers,
  HardHat,
  Boxes,
  ShieldCheck,
  Printer,
  Store,
  Compass,
  Droplets,
  Package,
  BatteryCharging,
  Box,
  Nut,
  Paintbrush,
  Palette,
  DoorClosed,
  Ruler,
  Users
} from 'lucide-react';

export const getCategoryIcon = (id: string, className = "w-5 h-5") => {
  switch (id) {
    case 'all':
      return <Store className={className} />;
    case 'services':
      return <Users className={className} />;
    case 'power-tools':
      return <Wrench className={className} />;
    case 'electronics-robotics':
    case 'electronics-iot':
      return <Cpu className={className} />;
    case 'lithium-batteries':
      return <BatteryCharging className={className} />;
    case 'pcb-quotes':
    case 'fabrication':
      return <Layers className={className} />;
    case '3d-printing-quotes':
      return <Box className={className} />;
    case 'construction-cement':
      return <Boxes className={className} />;
    case 'fasteners-hardware':
      return <Nut className={className} />;
    case 'plumbing-pipes':
    case 'plumbing-pvc':
      return <Droplets className={className} />;
    case 'electrical-wiring':
      return <Zap className={className} />;
    case 'lighting-safety':
    case 'safety-ppe':
      return <HardHat className={className} />;
    case 'hand-tools':
      return <Hammer className={className} />;
    case 'adhesives-sealants':
      return <ShieldCheck className={className} />;
    case 'blueprints':
    case 'cad-blueprints':
      return <Printer className={className} />;
    case 'paints-finishes':
      return <Palette className={className} />;
    case 'painting-supplies':
      return <Paintbrush className={className} />;
    case 'door-hardware':
      return <DoorClosed className={className} />;
    default:
      return <Package className={className} />;
  }
};
