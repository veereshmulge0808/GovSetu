import { Building2 } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[480px] bg-indigo-600 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg">GovSetu</span>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Government Innovation<br />Made Accessible
            </h1>
            <p className="text-indigo-200 mt-4 text-base leading-relaxed">
              Connect government departments with vetted startups through AI-powered matching,
              structured evaluation, and transparent pilot management.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '200+', label: 'Challenges Posted' },
              { value: '1,400+', label: 'Startups Registered' },
              { value: '45+', label: 'Active Pilots' },
              { value: '₹120 Cr', label: 'Pilot Value' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-indigo-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-300 text-xs">
          © 2026 GovSetu. Government of India Initiative.
        </p>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">GovSetu</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
