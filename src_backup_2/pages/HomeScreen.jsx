import { Camera, CircleHelp, Settings, ShieldAlert, Volume2 } from "lucide-react";
export default function HomeScreen({ settings, detection, onStart, onSettings, onHelp, onEmergency }) {
  return <div className="home-page safe-home">
    <header className="topbar"><div className="brand"><div className="mini-logo">PS</div><div><strong>PathSense</strong><small>Accessible smart assistance</small></div></div><button className="icon-button" onClick={onSettings} aria-label="Settings"><Settings/></button></header>
    <section className="safe-hero"><div className="eyebrow">WELCOME TO PATHSENSE</div><h1>Explore with more awareness.</h1><p>Real camera object recognition and spoken announcements in a calm, accessible interface.</p></section>
    <h2 className="safe-heading">How can we help?</h2>
    <button className="safe-feature" onClick={onStart}><span className="safe-feature-icon"><Camera/></span><span><strong>Live Assistance</strong><small>Recognize objects from your camera</small></span><span aria-hidden="true">›</span></button>
    <button className="safe-feature" onClick={onSettings}><span className="safe-feature-icon"><Volume2/></span><span><strong>Voice & Settings</strong><small>Personalize spoken announcements</small></span><span aria-hidden="true">›</span></button>
    <button className="safe-feature" onClick={onEmergency}><span className="safe-feature-icon coral"><ShieldAlert/></span><span><strong>Emergency SOS</strong><small>Open the emergency contact options</small></span><span aria-hidden="true">›</span></button>
    <button className="safe-feature" onClick={onHelp}><span className="safe-feature-icon"><CircleHelp/></span><span><strong>Help & About</strong><small>Understand the current capabilities</small></span><span aria-hidden="true">›</span></button>
    <p className="safe-disclaimer">Prototype: not a replacement for a white cane, guide dog, or trained mobility assistance. Object recognition does not detect every hazard.</p>
  </div>;
}
