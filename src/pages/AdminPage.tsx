import { motion } from 'framer-motion';
import { Shield, Bell, Users, CheckCircle, Clock, Send, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { MOCK_ALERTS, VILLAGES } from '@/utils/mockData';

export default function AdminPage() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const markResolved = (id: string) => {
    setAlerts(a => a.map(al => al.id === id ? { ...al, status: 'resolved' as const } : al));
  };

  const sendAlert = (village: string) => {
    const newAlert = {
      id: `alert-new-${Date.now()}`,
      hotspot_id: '0',
      village,
      sent_to: '+91 98765 00000',
      status: 'sent' as const,
      timestamp: new Date().toISOString(),
      risk_score: 0.8,
    };
    setAlerts(a => [newAlert, ...a]);
  };

  return (
    <div className="pt-16 pb-20 md:pb-4">
      <div className="container py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6 text-primary" /> Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Manage alerts and squad assignments</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {VILLAGES.filter(v => v.risk_score >= 0.7).slice(0, 4).map(v => (
            <motion.button
              key={v.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => sendAlert(v.village_name)}
              className="bg-card border rounded-xl p-4 shadow-card text-left hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-4 h-4 text-destructive" />
                <span className="text-xs font-medium text-muted-foreground">Send Alert</span>
              </div>
              <p className="font-semibold text-sm">{v.village_name}</p>
              <p className="text-xs text-destructive font-medium">{(v.risk_score * 100).toFixed(0)}% risk</p>
            </motion.button>
          ))}
        </div>

        {/* Alerts Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border rounded-xl shadow-card overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2"><Bell className="w-4 h-4" /> Alert History</h2>
            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{alerts.length} alerts</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Village</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Sent To</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Risk</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(a => (
                  <tr key={a.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{a.village}</td>
                    <td className="p-3 text-muted-foreground">{a.sent_to}</td>
                    <td className="p-3">
                      <span className="font-bold" style={{ color: a.risk_score >= 0.7 ? 'hsl(0,72%,51%)' : 'hsl(45,93%,52%)' }}>
                        {(a.risk_score * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        a.status === 'resolved'
                          ? 'bg-accent text-accent-foreground'
                          : a.status === 'read'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {a.status === 'resolved' ? <CheckCircle className="w-3 h-3" /> : a.status === 'read' ? <Clock className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {a.status !== 'resolved' && (
                        <button onClick={() => markResolved(a.id)} className="text-xs text-primary font-medium hover:underline">
                          Mark Resolved
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Squad Assignment */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border rounded-xl p-5 shadow-card">
          <h2 className="font-bold flex items-center gap-2 mb-4"><Users className="w-4 h-4" /> Spray Squad Assignments</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {['Squad Alpha — Tumkūr City & Sira', 'Squad Beta — Pavagada & Madhugiri', 'Squad Gamma — Tiptur & Turuvekere'].map((squad, i) => (
              <div key={i} className="bg-muted rounded-lg p-4">
                <p className="font-medium text-sm">{squad.split('—')[0]}</p>
                <p className="text-xs text-muted-foreground mt-1">{squad.split('—')[1]}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-primary font-medium">Active</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
