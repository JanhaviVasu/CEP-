import { House, Navigation, ScanText, Menu } from "lucide-react";
export default function BottomNavigation({ current, onNavigate }) {
  const items = [["home","Home",House],["navigation","Navigate",Navigation],["read","Read",ScanText],["more","More",Menu]];
  return <nav className="ss-bottom" aria-label="Main navigation">{items.map(([id,label,Icon]) =>
    <button key={id} onClick={() => onNavigate(id)} className={current === id ? "active" : ""} aria-current={current === id ? "page" : undefined}><Icon size={23}/><span>{label}</span></button>
  )}</nav>;
}
