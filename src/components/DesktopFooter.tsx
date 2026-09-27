import React from 'react';
import { ShieldCheck, Clock, Cpu } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';

export const DesktopFooter: React.FC = () => {
  return (
    <footer className="bg-surface-card border-t border-stroke mt-16 text-xs text-content-secondary select-none">
      {/* 3 Core Value Pillars */}
      <div className="border-b border-stroke bg-surface-secondary/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-card border border-stroke shadow-crisp">
            <div className="w-12 h-12 rounded-2xl bg-primary text-lime flex items-center justify-center flex-shrink-0 shadow-sm">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="font-black text-sm text-navy">10-Minute Jobsite Delivery</h4>
              <p className="text-[11px] text-content-secondary mt-0.5">Rapid dispatch directly to construction gates & hardware labs.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-card border border-stroke shadow-crisp">
            <div className="w-12 h-12 rounded-2xl bg-primary text-lime flex items-center justify-center flex-shrink-0 shadow-sm">
              <Cpu size={24} />
            </div>
            <div>
              <h4 className="font-black text-sm text-navy">100% Genuine Electronics & Tools</h4>
              <p className="text-[11px] text-content-secondary mt-0.5">Direct authorized distributor stock: Bosch, Arduino, Polycab, UltraTech.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-card border border-stroke shadow-crisp">
            <div className="w-12 h-12 rounded-2xl bg-primary text-lime flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-black text-sm text-navy">GST Invoicing & Bulk Credit</h4>
              <p className="text-[11px] text-content-secondary mt-0.5">Instant B2B GST tax invoices & flexible site project billing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Categories Col 1 */}
        <div>
          <h5 className="font-black text-navy uppercase tracking-wider text-[11px] mb-3">
            Electronics & Hardware
          </h5>
          <ul className="space-y-2 font-medium">
            {CATEGORIES.slice(1, 5).map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} className="hover:text-primary transition-colors">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories Col 2 */}
        <div>
          <h5 className="font-black text-navy uppercase tracking-wider text-[11px] mb-3">
            Building & Safety
          </h5>
          <ul className="space-y-2 font-medium">
            {CATEGORIES.slice(5).map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} className="hover:text-primary transition-colors">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h5 className="font-black text-navy uppercase tracking-wider text-[11px] mb-3">
            Contractor Solutions
          </h5>
          <ul className="space-y-2 font-medium">
            <li><a href="#" className="hover:text-primary transition-colors">BuildIt Pro Club</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Bulk Site Procurement</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">CAD & Blueprint Hub</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Hardware Dark Stores</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Manufacturer Partners</a></li>
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h5 className="font-black text-navy uppercase tracking-wider text-[11px] mb-3">
            Support & Safety
          </h5>
          <ul className="space-y-2 font-medium">
            <li><a href="#" className="hover:text-primary transition-colors">24x7 Site Emergency Line</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Tool Warranty & Servicing</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">GST B2B Billing</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Equipment Supply</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy & Data Policy</a></li>
          </ul>
        </div>

        {/* Delivery Industrial Hubs */}
        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <h5 className="font-black text-navy uppercase tracking-wider text-[11px] mb-3">
            Active Project Hubs
          </h5>
          <p className="text-[11px] leading-relaxed font-medium">
            Bengaluru (Peenya, Whitefield, Electronic City) • Mumbai (Bandra-Kurla, Navi Mumbai) • Delhi NCR (Noida, Gurgaon) • Hyderabad (HITEC City) • Pune
          </p>
          <div className="mt-4 pt-3 border-t border-stroke">
            <span className="text-[10px] text-content-secondary font-bold">
              Powering India&apos;s Builders, Engineers & Creators
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-stroke py-6 bg-surface-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
          <p className="font-medium">© 2026 BuildIt Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4 font-bold text-navy">
            <span>ISO 9001 Certified Supplier</span>
            <span>B2B Credit • NetBanking • UPI • Corporate Card</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

