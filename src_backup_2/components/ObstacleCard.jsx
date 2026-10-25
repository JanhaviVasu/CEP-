import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ObstacleCard({ obstacle }) {
  const Icon = obstacle.danger === "safe" ? CheckCircle2 : obstacle.danger === "danger" ? ShieldAlert : AlertTriangle;
  const label = obstacle.danger === "safe" ? "SAFE" : obstacle.danger === "danger" ? "DANGER" : "CAUTION";
  return (
    <div className={`obstacle-card ${obstacle.danger}`}>
      <div className="obstacle-card-top"><Icon/><span>{label}</span></div>
      <h3>{obstacle.type === "Path Clear" ? "PATH CLEAR" : `${obstacle.type.toUpperCase()} DETECTED`}</h3>
      {!obstacle.type.includes("Clear") && (
        <div className="obstacle-meta">
          <div><small>Distance</small><strong>{obstacle.distance.toFixed(1)} m</strong></div>
          <div><small>Direction</small><strong>{obstacle.direction}</strong></div>
        </div>
      )}
    </div>
  );
}