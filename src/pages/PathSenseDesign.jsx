import "./pathsense-design.css";
import home from "../assets/design-1.jpg";
import features from "../assets/design-2.jpg";
import obstacle from "../assets/design-3.jpg";
import live from "../assets/design-4.jpg";
import settings from "../assets/design-5.jpg";
import sos from "../assets/design-6.jpg";

const pages = [
  { id: "home", title: "Home", image: home },
  { id: "features", title: "Features", image: features },
  { id: "obstacle", title: "Obstacle Tracking", image: obstacle },
  { id: "live", title: "Live Assistance", image: live },
  { id: "settings-design", title: "Settings", image: settings },
  { id: "sos-design", title: "SOS / Emergency", image: sos },
];

export default function PathSenseDesign({ view = "home", onNavigate = () => {}, onGetStarted = () => {}, onSOS = () => {} }) {
  const index = Math.max(0, pages.findIndex(page => page.id === view));
  const page = pages[index];
  const actions = {
    home: [["Get Started", onGetStarted], ["View Features", () => onNavigate("features")]],
    features: [["Start Obstacle Detection", () => onNavigate("detect")], ["Live Assistance", () => onNavigate("navigation")], ["Settings", () => onNavigate("preferences")], ["SOS", onSOS]],
    obstacle: [["Start Real Camera Detection", () => onNavigate("detect")]],
    live: [["Open GPS & Voice Assistance", () => onNavigate("navigation")]],
    "settings-design": [["Open Working Settings", () => onNavigate("preferences")], ["Emergency Contacts", onSOS]],
    "sos-design": [["Open Emergency Options", onSOS]],
  };

  return (
    <div className="exact-design-app">
      <div className="exact-page">
        <div className="exact-page-label"><span>{String(index + 1).padStart(2, "0")} / 06</span><h1>{page.title}</h1></div>
        <img className="exact-image" src={page.image} alt={`${page.title} — exact supplied PathSense design reference`} />
        <div className="exact-actions" aria-label={`${page.title} actions`}>
          {actions[page.id].map(([label, handler]) => <button key={label} className="exact-action" onClick={handler}>{label} →</button>)}
        </div>
        <div className="exact-pagination">
          <button disabled={index === 0} onClick={() => onNavigate(pages[index - 1].id)}>← Previous</button>
          <button onClick={() => onNavigate(pages[(index + 1) % pages.length].id)}>{index === pages.length - 1 ? "Back to Home" : "Next Page →"}</button>
        </div>
        <nav className="exact-dots" aria-label="Design screens">
          {pages.map((p, i) => <button key={p.id} aria-label={`Open ${p.title}`} aria-current={i === index ? "page" : undefined} className={i === index ? "active" : ""} onClick={() => onNavigate(p.id)} />)}
        </nav>
        <p className="exact-note">The supplied designs are images. The functional controls are provided below the image; the image itself is not an interactive interface.</p>
      </div>
    </div>
  );
}
