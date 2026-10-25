import { Home, Camera, Settings, ShieldAlert } from "lucide-react";

export default function BottomNavigation({ current, onNavigate, onEmergency }) {
  const items = [
    ["home", "Home", Home],
    ["detect", "Detect", Camera],
    ["settings", "Settings", Settings]
  ];
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map(([id, label, Icon]) => (
        <button
          key={id}
          className={`${current === id ? "active" : ""} ${id === "detect" ? "detect-nav" : ""}`}
          onClick={() => onNavigate(id)}
          aria-label={label}
          aria-current={current === id ? "page" : undefined}
        >
          <Icon size={23}/><span>{label}</span>
        </button>
      ))}
      <button className="sos-nav" onClick={onEmergency} aria-label="Emergency assistance">
        <ShieldAlert size={23}/><span>SOS</span>
      </button>
    </nav>
  );
}