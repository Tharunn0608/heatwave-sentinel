import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Activity, Plus } from 'lucide-react';
import HeatMap from '@/components/HeatMap';
import StatsCard from '@/components/StatsCard';
import RiskGauge from '@/components/RiskGauge';
import { VILLAGES, type Hotspot, getRiskLabel } from '@/utils/mockData';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const high = VILLAGES.filter(v => v.risk_score >= 0.7).length;
  const active = VILLAGES.filter(v => v.status === 'active').length;

  return (
    <div className="pt-16 pb-20 md:pb-4">
      <div className="container py-6 space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="text-gradient">HeatWave Vector</span> Predictor
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            AI-powered heatwave risk prediction for Karnataka. Report hotspots, track risks, protect communities.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatsCard title="Total Hotspots" value={VILLAGES.length} icon={MapPin} />
          <StatsCard title="High Risk" value={high} icon={AlertTriangle} variant="danger" />
          <StatsCard title="Active" value={active} icon={Activity} variant="warning" />
          <StatsCard title="Avg Risk" value={`${(VILLAGES.reduce((a, v) => a + v.risk_score, 0) / VILLAGES.length * 100).toFixed(0)}%`} icon={Activity} variant="success" />
        </div>

        {/* Map + Detail */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <HeatMap onSelectHotspot={setSelected} className="h-[450px]" />
          </div>
          <div className="space-y-4">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card border rounded-xl p-5 shadow-card space-y-4"
              >
                <h2 className="font-bold text-lg">{selected.village_name}</h2>
                <RiskGauge score={selected.risk_score} size={140} />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Temperature</p>
                    <p className="font-bold">{selected.temp}°C</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Humidity</p>
                    <p className="font-bold">{selected.humidity}%</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Rain (24h)</p>
                    <p className="font-bold">{selected.rain_mm}mm</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Stagnation</p>
                    <p className="font-bold">{selected.water_stagnation_days}d</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Status: <span className="capitalize font-medium text-foreground">{selected.status}</span></p>
              </motion.div>
            ) : (
              <div className="bg-card border rounded-xl p-8 shadow-card text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Click a marker on the map to view details</p>
              </div>
            )}

            <Link
              to="/report"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold shadow-card glow transition-transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              Report New Hotspot
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
