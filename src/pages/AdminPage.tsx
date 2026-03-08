import { motion } from 'framer-motion';
import { Shield, Bell, Users, CheckCircle, Clock, Send, AlertTriangle, Loader2, MapPin, Calendar } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useHotspots, useAlerts, useUpdateAlert, useInsertAlert } from '@/hooks/useHotspots';
import { useSquadAssignments } from '@/hooks/useSquadAssignments';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminPage() {
  const { data: hotspots = [] } = useHotspots();
  const { data: alerts = [], isLoading } = useAlerts();
  const { data: squads = [], isLoading: squadsLoading } = useSquadAssignments();
  const updateAlert = useUpdateAlert();
  const insertAlert = useInsertAlert();

  const highRiskHotspots = hotspots.filter(v => v.risk_score >= 0.7).slice(0, 4);

  const markResolved = (id: string) => {
    updateAlert.mutate({ id, status: 'resolved' }, {
      onSuccess: () => toast.success('Alert marked as resolved'),
    });
  };

  const sendAlert = (hotspot: typeof hotspots[0]) => {
    insertAlert.mutate({
      hotspot_id: hotspot.id,
      village: hotspot.village_name,
      sent_to: '+91 98765 00000',
      risk_score: hotspot.risk_score,
      status: 'sent',
    }, {
      onSuccess: () => toast.success(`Alert sent for ${hotspot.village_name}`),
    });
  };

  return (
    <div className="pt-20 pb-24 md:pb-6 min-h-screen">
      <AnimatedBackground />
      <div className="container py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring' }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl gradient-primary glow">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Admin Panel</h1>
              <p className="text-sm text-muted-foreground font-medium">Manage alerts and squad assignments</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highRiskHotspots.map((v, i) => (
            <motion.button
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => sendAlert(v)}
              className="bg-card border border-border/60 rounded-2xl p-5 shadow-card text-left hover:border-primary/50 hover:shadow-elevated transition-all group"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                  <Send className="w-3.5 h-3.5 text-destructive" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Send Alert</span>
              </div>
              <p className="font-bold text-sm">{v.village_name}</p>
              <p className="text-xs text-destructive font-bold mt-1">{(v.risk_score * 100).toFixed(0)}% risk</p>
            </motion.button>
          ))}
        </div>

        {/* Alerts Table */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/60 rounded-2xl shadow-card overflow-hidden"
        >
          <div className="p-6 border-b border-border/60 flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center gap-2 tracking-tight">
              <Bell className="w-5 h-5 text-primary" /> Alert History
            </h2>
            <span className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground font-semibold">{alerts.length} alerts</span>
          </div>
          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No alerts yet. Send one from the quick actions above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Village</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Sent To</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Risk</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Time</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((a, i) => (
                    <motion.tr 
                      key={a.id} 
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 font-semibold">{a.village}</td>
                      <td className="p-4 text-muted-foreground font-mono text-xs">{a.sent_to}</td>
                      <td className="p-4">
                        <span className="font-extrabold" style={{ color: a.risk_score >= 0.7 ? 'hsl(0,84%,60%)' : 'hsl(38,95%,54%)' }}>
                          {(a.risk_score * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
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
                      <td className="p-4 text-xs text-muted-foreground">
                        {format(new Date(a.created_at), 'MMM d, h:mm a')}
                      </td>
                      <td className="p-4">
                        {a.status !== 'resolved' && (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => markResolved(a.id)} 
                            className="text-xs text-primary font-bold hover:underline px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                          >
                            Resolve
                          </motion.button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Squad Assignments */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }} 
          className="bg-card border border-border/60 rounded-2xl shadow-card overflow-hidden"
        >
          <div className="p-6 border-b border-border/60 flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center gap-2 tracking-tight">
              <Users className="w-5 h-5 text-primary" /> Spray Squad Assignments
            </h2>
            <span className="text-xs bg-muted px-3 py-1.5 rounded-full text-muted-foreground font-semibold">
              {squads.length} squads
            </span>
          </div>

          {squadsLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : squads.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No squad assignments yet.</p>
            </div>
          ) : (
            <>
              {/* Squad Cards */}
              <div className="p-6 grid md:grid-cols-3 gap-4">
                {squads.filter(s => s.status === 'active').map((squad, i) => (
                  <motion.div
                    key={squad.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-muted/50 rounded-xl p-5 border border-border/30 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-sm">{squad.squad_name}</p>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                        squad.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${squad.status === 'active' ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                        {squad.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(squad.villages as string[]).map((v) => (
                        <span key={v} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-background border border-border/40 text-xs font-medium">
                          <MapPin className="w-3 h-3 text-primary" />
                          {v}
                        </span>
                      ))}
                    </div>
                    {squad.notes && (
                      <p className="text-xs text-muted-foreground">{squad.notes}</p>
                    )}
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(squad.created_at), 'MMM d, yyyy h:mm a')}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Assignment History Table */}
              <div className="border-t border-border/60">
                <div className="p-4 px-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Assignment History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40 bg-muted/30">
                        <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Squad</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Villages</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Notes</th>
                        <th className="text-left p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Assigned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {squads.map((squad, i) => (
                        <motion.tr
                          key={squad.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                        >
                          <td className="p-4 font-semibold">{squad.squad_name}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {(squad.villages as string[]).map((v) => (
                                <span key={v} className="text-xs bg-muted px-2 py-0.5 rounded-md font-medium">{v}</span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              squad.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                            }`}>
                              {squad.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {squad.status}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-muted-foreground max-w-[200px] truncate">{squad.notes || '—'}</td>
                          <td className="p-4 text-xs text-muted-foreground">
                            {format(new Date(squad.created_at), 'MMM d, yyyy')}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
