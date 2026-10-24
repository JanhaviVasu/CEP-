import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function StatusCard({ obstacle }) {
  const safe = obstacle.danger === "safe";
  const danger = obstacle.danger === "danger";
  const Icon = safe ? CheckCircle2 : danger ? ShieldAlert : AlertTriangle;
  const title = safe ? "PATH CLEAR" : danger ? "STOP" : "OBSTACLE AHEAD";

  return (
    <section className={`status-card ${obstacle.danger}`} aria-live="polite">
      <div className="status-heading"><Icon size={27}/><strong>{title}</strong></div>
      <h2>{safe ? "No immediate obstacle detected." : `${obstacle.type} detected`}</h2>
      {!safe && <div className="status-details"><span>{obstacle.distance.toFixed(1)} m</span><span>•</span><span>{obstacle.direction}</span></div>}
      <p>{safe ? "You can continue carefully." : danger ? "Stop. Obstacle very close." : "Slow down and move carefully."}</p>
    </section>
  );
}