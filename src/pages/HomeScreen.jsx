import { CircleHelp, ShieldAlert, Volume2, Vibrate } from "lucide-react";

export default function HomeScreen({ settings, detection, onStart, onSettings, onHelp, onEmergency }) {
  return (
    <div className="home-page">
      <header className="topbar">
        <div className="brand"><div className="mini-logo">PS</div><div><strong>PathSense</strong><small>● Ready to assist</small></div></div>
        <button className="icon-button" onClick={onSettings} aria-label="Open settings">⚙</button>
      </header>

      <section className="welcome-card">
        <div className="eyebrow">SMART ASSISTANCE</div>
        <h1>Ready to scan<br/>your path?</h1>
        <p>Point your phone forward and let PathSense guide your next step.</p>
        <button className="start-orb" onClick={onStart} aria-label="Start detection">
          <span><span className="play-mark">▶</span></span>
          <strong>START</strong><small>DETECTION</small>
        </button>
      </section>

      <section className="quick-alert">
        <div><span className="eyebrow">ALERT MODE</span><strong><Volume2 size={18}/> Voice + <Vibrate size={18}/> Vibration</strong></div>
        <button onClick={onSettings} aria-label="Change alert mode">Change</button>
      </section>

      <section>
        <div className="section-title"><span>LAST DETECTION</span></div>
        <div className="last-card">
          <div className={`last-icon ${detection.danger}`}><ShieldAlert size={23}/></div>
          <div><strong>{detection.type === "Path Clear" ? "Path clear" : `${detection.type} detected`}</strong><span>{detection.danger === "safe" ? "No immediate obstacle" : `${detection.distance.toFixed(1)} m • ${detection.direction}`}</span></div>
          <span className={`risk-pill ${detection.danger}`}>{detection.danger.toUpperCase()}</span>
        </div>
      </section>

      <section className="quick-actions">
        <div className="section-title"><span>QUICK ACTIONS</span></div>
        <div className="action-grid">
          <button onClick={onHelp}><CircleHelp/><span>Help</span></button>
          <button className="emergency-action" onClick={onEmergency}><ShieldAlert/><span>Emergency</span></button>
        </div>
      </section>
    </div>
  );
}