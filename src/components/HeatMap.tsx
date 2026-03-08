import { lazy, Suspense, useState, useEffect } from 'react';
import { type Hotspot } from '@/utils/mockData';

const LeafletMap = lazy(() => import('./LeafletMap'));

interface HeatMapProps {
  onSelectHotspot?: (h: Hotspot) => void;
  className?: string;
}

export default function HeatMap({ onSelectHotspot, className = '' }: HeatMapProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`rounded-lg overflow-hidden border shadow-card flex items-center justify-center bg-muted ${className}`} style={{ minHeight: 400 }}>
        <p className="text-muted-foreground text-sm">Map failed to load. Try refreshing.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden border shadow-card ${className}`}>
      <ErrorBoundary onError={() => setHasError(true)}>
        <Suspense fallback={
          <div className="flex items-center justify-center bg-muted animate-pulse" style={{ minHeight: 400 }}>
            <p className="text-muted-foreground text-sm">Loading map...</p>
          </div>
        }>
          <LeafletMap onSelectHotspot={onSelectHotspot} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Simple error boundary
import React from 'react';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
