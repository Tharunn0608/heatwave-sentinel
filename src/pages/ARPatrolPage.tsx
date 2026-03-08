import { motion } from 'framer-motion';
import { Camera, AlertTriangle, MapPin, Wifi, WifiOff } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { VILLAGES, getRiskColor, getRiskLabel } from '@/utils/mockData';

export default function ARPatrolPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraOn(true);
      }
    } catch {
      setError('Camera access denied. Enable camera permissions to use AR mode.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
      setCameraOn(false);
    }
  };

  useEffect(() => () => stopCamera(), []);

  const highRisk = VILLAGES.filter(v => v.risk_score >= 0.7);

  return (
    <div className="pt-16 pb-20 md:pb-4">
      <div className="container max-w-2xl py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Camera className="w-6 h-6 text-primary" /> AR Patrol Mode
          </h1>
          <p className="text-sm text-muted-foreground">Point camera at surroundings to see risk overlays</p>
        </motion.div>

        {/* Camera view */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative rounded-xl overflow-hidden border shadow-card bg-foreground/5 aspect-video"
        >
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

          {!cameraOn && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Camera className="w-16 h-16 text-muted-foreground/30" />
              <button onClick={startCamera} className="px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold glow hover:scale-[1.02] transition-transform">
                Start Camera
              </button>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <WifiOff className="w-12 h-12 text-destructive/50" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* AR Overlays */}
          {cameraOn && highRisk.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.2 }}
              className="absolute pulse-danger rounded-full flex items-center justify-center"
              style={{
                width: 60 + v.risk_score * 40,
                height: 60 + v.risk_score * 40,
                top: `${15 + (i * 18) % 60}%`,
                left: `${10 + (i * 22) % 70}%`,
                background: `${getRiskColor(v.risk_score)}33`,
                border: `2px solid ${getRiskColor(v.risk_score)}`,
              }}
            >
              <div className="text-center">
                <AlertTriangle className="w-5 h-5 mx-auto" style={{ color: getRiskColor(v.risk_score) }} />
                <p className="text-[10px] font-bold" style={{ color: getRiskColor(v.risk_score) }}>SPRAY HERE</p>
              </div>
            </motion.div>
          ))}

          {cameraOn && (
            <button onClick={stopCamera} className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium">
              Stop
            </button>
          )}
        </motion.div>

        {/* Nearby hotspots */}
        <div className="space-y-3">
          <h2 className="font-bold text-lg">Nearby High-Risk Zones</h2>
          {highRisk.map((v) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border rounded-xl p-4 shadow-card flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center pulse-danger" style={{ background: `${getRiskColor(v.risk_score)}22` }}>
                <MapPin className="w-5 h-5" style={{ color: getRiskColor(v.risk_score) }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{v.village_name}</p>
                <p className="text-xs text-muted-foreground">{v.temp}°C · {v.humidity}% humidity</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: getRiskColor(v.risk_score) }}>{(v.risk_score * 100).toFixed(0)}%</p>
                <p className="text-[10px] text-muted-foreground">{getRiskLabel(v.risk_score)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
