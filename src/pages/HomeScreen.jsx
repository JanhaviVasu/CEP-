import { Mic, Navigation, ScanEye, ScanText, Users, PhoneCall, ChevronRight } from "lucide-react";

export default function HomeScreen({ onNavigate, onStart, onEmergency }) {
  const items = [
    ["navigation", "Navigation", "Find a walking route", Navigation],
    ["detect", "Live Assistance", "Recognize objects using your camera", ScanEye],
    ["read", "Read Text", "Scan signs and listen", ScanText],
    ["guardian", "Guardian", "Manage trusted contacts", Users],
  ];
  return <section className="ss-wrap ss-home">
    <h1>Hello! Ready when you are.</h1>
    <p className="ss-muted">Speak or type your destination to begin.</p>
    <button className="ss-tile" onClick={() => onNavigate("navigation")}>
      <span className="ss-icon"><Mic /></span><span className="ss-tile-copy"><strong>Speak your destination</strong><small>Voice input or typed address</small></span><ChevronRight size={19}/>
    </button>
    <h2 className="ss-section-title">Quick access</h2>
    {items.map(([id, title, sub, Icon]) => <button key={id} className="ss-tile" onClick={() => id === "detect" ? onStart() : onNavigate(id)}>
      <span className="ss-icon"><Icon /></span><span className="ss-tile-copy"><strong>{title}</strong><small>{sub}</small></span><ChevronRight size={19}/>
    </button>)}
    <button className="ss-tile" onClick={onEmergency}><span className="ss-icon ss-coral"><PhoneCall /></span><span className="ss-tile-copy"><strong>Emergency SOS</strong><small>Get help when you need it</small></span><ChevronRight size={19}/></button>
    <p className="ss-footnote">Prototype: AI recognition is experimental and does not establish a safe walking path or measure distance.</p>
  </section>;
}
