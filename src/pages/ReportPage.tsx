import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, Droplets, CloudRain, Clock, Send, Mic, MicOff, CheckCircle } from 'lucide-react';
import RiskGauge from '@/components/RiskGauge';
import { predictRisk, getRiskLabel } from '@/utils/mockData';

export default function ReportPage() {
  const [form, setForm] = useState({ lat: '13.3429', lng: '77.1029', temp: '36', humidity: '70', rain: '4', stagnation: '3', village: '' });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePredict = () => {
    const score = predictRisk(+form.temp, +form.humidity, +form.rain, +form.stagnation);
    setPrediction(score);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePredict();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    setListening(!listening);
  };

  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setForm(f => ({ ...f, lat: pos.coords.latitude.toFixed(4), lng: pos.coords.longitude.toFixed(4) }));
      });
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

  return (
    <div className="pt-16 pb-20 md:pb-4">
      <div className="container max-w-lg py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Report Hotspot</h1>
          <p className="text-sm text-muted-foreground">Submit environmental data for AI risk prediction</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border rounded-xl p-6 shadow-card space-y-4"
        >
          {/* Location */}
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" /> Location
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" step="0.0001" placeholder="Latitude" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} className={inputClass} />
              <input type="number" step="0.0001" placeholder="Longitude" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} className={inputClass} />
            </div>
            <button type="button" onClick={handleGPS} className="mt-2 text-xs text-primary font-medium hover:underline flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Auto-detect GPS
            </button>
          </div>

          {/* Village */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Village Name</label>
            <div className="relative">
              <input placeholder="Enter village name" value={form.village} onChange={e => setForm(f => ({ ...f, village: e.target.value }))} className={inputClass} />
              <button type="button" onClick={toggleVoice} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {listening ? <Mic className="w-4 h-4 text-destructive animate-pulse" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>
            {listening && <p className="text-xs text-destructive mt-1 animate-pulse">🎙️ Listening (Kannada/English)...</p>}
          </div>

          {/* Sensors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Thermometer className="w-3 h-3" /> Temp (°C)</label>
              <input type="number" value={form.temp} onChange={e => setForm(f => ({ ...f, temp: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Droplets className="w-3 h-3" /> Humidity (%)</label>
              <input type="number" value={form.humidity} onChange={e => setForm(f => ({ ...f, humidity: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><CloudRain className="w-3 h-3" /> Rain 24h (mm)</label>
              <input type="number" value={form.rain} onChange={e => setForm(f => ({ ...f, rain: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Clock className="w-3 h-3" /> Stagnation (days)</label>
              <input type="number" value={form.stagnation} onChange={e => setForm(f => ({ ...f, stagnation: e.target.value }))} className={inputClass} />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 glow transition-transform hover:scale-[1.02]"
          >
            <Send className="w-4 h-4" />
            Submit & Predict
          </button>

          {submitted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 justify-center text-sm text-primary font-medium">
              <CheckCircle className="w-4 h-4" /> Report submitted successfully!
            </motion.div>
          )}
        </motion.form>

        {/* Prediction Result */}
        {prediction !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-xl p-6 shadow-card text-center space-y-3"
          >
            <h2 className="font-bold">AI Prediction Result</h2>
            <RiskGauge score={prediction} />
            <p className="text-sm text-muted-foreground">
              {prediction >= 0.7
                ? '⚠️ High risk zone! Alert sent to spray squad.'
                : prediction >= 0.3
                ? '⚡ Medium risk. Monitoring recommended.'
                : '✅ Low risk area. Keep monitoring.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
