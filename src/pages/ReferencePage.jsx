import { useState } from "react";
import { Navigation, ScanText, Users, MapPin, Mic, ScanEye, Settings, CircleHelp, ShieldAlert, ChevronRight, Volume2, LockKeyhole, BookOpen, RotateCcw } from "lucide-react";

function Tile({ icon: Icon, title, subtitle, onClick, coral = false }) {
  return <button type="button" className="ss-tile" onClick={onClick}>
    <span className={`ss-icon ${coral ? "ss-coral" : ""}`}><Icon /></span>
    <span className="ss-tile-copy"><strong>{title}</strong><small>{subtitle}</small></span><ChevronRight size={19}/>
  </button>;
}

export default function ReferencePage({ screen, onNavigate, onEmergency }) {
  const [destination, setDestination] = useState("");
  if (screen === "more") return <section className="ss-wrap">
    <h1>More</h1><p className="ss-muted">Settings and assistance options.</p>
    <Tile icon={Settings} title="Settings" subtitle="Personalize your experience" onClick={() => onNavigate("settings")}/>
    <Tile icon={Users} title="Guardian" subtitle="Trusted contacts and sharing" onClick={() => onNavigate("guardian")}/>
    <Tile icon={CircleHelp} title="About & Help" subtitle="Learn about PathSense" onClick={() => onNavigate("help")}/>
    <Tile icon={ShieldAlert} title="Emergency SOS" subtitle="Open emergency options" onClick={onEmergency} coral/>
  </section>;

  if (screen === "navigation") return <section className="ss-wrap">
    <h1>Where would you like to go?</h1>
    <p className="ss-muted">Enter a destination to prepare for a future route-planning feature.</p>
    <label htmlFor="ss-destination">Destination</label>
    <input id="ss-destination" className="ss-field" type="text" placeholder="Enter destination or address" value={destination} onChange={e => setDestination(e.target.value)}/>
    <button className="ss-btn" disabled><Mic size={18}/> Use voice input (not connected)</button>
    <div className="ss-reference-map" role="img" aria-label="Illustrative map placeholder; no live route"><div className="ss-route-line"/><span><MapPin size={20}/> Illustrative map — not live</span></div>
    <div className="ss-card"><div className="ss-card-row"><h2>Walking route</h2><span className="ss-pill">Not available</span></div>
      <p className="ss-muted">Live directions and travel times are not available yet. No safe route has been calculated.</p>
      <button className="ss-btn" onClick={() => onNavigate("detect")}><ScanEye size={18}/> Start Live Assistance</button>
      <button className="ss-btn ss-btn-light" disabled><Volume2 size={18}/> Repeat directions (not connected)</button>
    </div>
  </section>;

  if (screen === "read") return <section className="ss-wrap">
    <h1>Read signs and documents</h1><p className="ss-muted">Point your camera at printed text, then listen to the recognized words.</p>
    <div className="ss-reference-hero"><ScanText size={55}/><h2>Camera scan area</h2><p>Real text scanning requires OCR integration. The camera reader is not connected yet.</p></div>
    <div className="ss-card"><span className="ss-pill">Sample recognized text</span><h2 style={{marginTop:14}}>Library Main Building</h2><p aria-label="Arrow pointing left">←</p>
      <button className="ss-btn" disabled><Volume2 size={18}/> Read aloud (sample only)</button>
      <div className="ss-two-buttons"><button className="ss-btn ss-btn-light" disabled>Pause</button><button className="ss-btn ss-btn-light" disabled><RotateCcw size={17}/> Scan again</button></div>
    </div><p className="ss-footnote">The displayed text is an example, not a result from your camera.</p>
  </section>;

  if (screen === "guardian") return <section className="ss-wrap">
    <h1>Stay connected with trusted people.</h1><p className="ss-muted">Choose contacts who may receive your location when you request help.</p>
    <div className="ss-card"><div className="ss-card-row"><div><h2>Trusted contacts</h2><p className="ss-muted">No contacts connected yet</p></div><Users size={34}/></div>
      <label htmlFor="ss-contact-name">Contact name</label><input id="ss-contact-name" className="ss-field" placeholder="Enter a name" disabled/>
      <label htmlFor="ss-contact-phone">Phone number</label><input id="ss-contact-phone" className="ss-field" type="tel" placeholder="Enter a phone number" disabled/>
      <button className="ss-btn" disabled>+ Add trusted contact (not connected)</button>
      <div className="ss-safe-notice"><LockKeyhole size={18}/> Contact storage and sharing are not implemented. No information is being saved or sent.</div>
    </div>
    <div className="ss-card"><h2>Location sharing</h2><p>Location sharing must be optional and visibly indicate when active. It is not active in this prototype.</p><button className="ss-btn ss-btn-light" onClick={() => onNavigate("settings")}><Settings size={18}/> Privacy and permissions</button></div>
  </section>;
  return null;
}
