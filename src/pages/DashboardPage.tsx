import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, MapPin, AlertTriangle, Activity, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import StatsCard from '@/components/StatsCard';
import { VILLAGES, MOCK_FORECASTS, MOCK_ALERTS } from '@/utils/mockData';

const COLORS = ['hsl(160,64%,40%)', 'hsl(45,93%,52%)', 'hsl(0,72%,51%)'];

export default function DashboardPage() {
  const high = VILLAGES.filter(v => v.risk_score >= 0.7).length;
  const med = VILLAGES.filter(v => v.risk_score >= 0.3 && v.risk_score < 0.7).length;
  const low = VILLAGES.filter(v => v.risk_score < 0.3).length;
  const pieData = [
    { name: 'Low', value: low },
    { name: 'Medium', value: med },
    { name: 'High', value: high },
  ];

  const topVillages = [...VILLAGES].sort((a, b) => b.risk_score - a.risk_score).slice(0, 5);

  const accuracyData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    accuracy: +(78 + Math.random() * 15).toFixed(1),
  }));

  return (
    <div className="pt-16 pb-20 md:pb-4">
      <div className="container py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="w-6 h-6 text-primary" /> Dashboard</h1>
          <p className="text-sm text-muted-foreground">Tumkūr District Analytics</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatsCard title="Total Hotspots" value={VILLAGES.length} icon={MapPin} />
          <StatsCard title="High Risk" value={high} icon={AlertTriangle} variant="danger" />
          <StatsCard title="Alerts Sent" value={MOCK_ALERTS.length} icon={Activity} variant="warning" />
          <StatsCard title="Resolved" value={MOCK_ALERTS.filter(a => a.status === 'resolved').length} icon={Shield} variant="success" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* 7-Day Forecast */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border rounded-xl p-5 shadow-card">
            <h2 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> 7-Day Risk Forecast</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MOCK_FORECASTS}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="risk_level" stroke="hsl(0,72%,51%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="confidence" stroke="hsl(160,64%,40%)" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Risk Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border rounded-xl p-5 shadow-card">
            <h2 className="font-bold mb-4">Risk Distribution</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Model Accuracy */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border rounded-xl p-5 shadow-card">
            <h2 className="font-bold mb-4">Prediction Accuracy Trend</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="hsl(160,64%,40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top 5 Villages */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border rounded-xl p-5 shadow-card">
            <h2 className="font-bold mb-4">Top 5 High-Risk Villages</h2>
            <div className="space-y-3">
              {topVillages.map((v, i) => (
                <div key={v.id} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{v.village_name}</p>
                    <div className="h-2 rounded-full bg-muted mt-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${v.risk_score * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: v.risk_score >= 0.7 ? 'hsl(0,72%,51%)' : v.risk_score >= 0.3 ? 'hsl(45,93%,52%)' : 'hsl(160,64%,40%)' }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: v.risk_score >= 0.7 ? 'hsl(0,72%,51%)' : 'hsl(45,93%,52%)' }}>
                    {(v.risk_score * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
