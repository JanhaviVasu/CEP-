import { useCallback, useRef, useState } from "react";
import { ArrowLeft, Settings2, Square, Play } from "lucide-react";
import CameraView from "../components/CameraView";
import { generateAlert } from "../services/alertService";
export default function DetectionScreen({ settings, onDetection, onBack, onSettings }) {
  const [running, setRunning] = useState(true);
  const [objects, setObjects] = useState([]);
  const lastAnnouncement = useRef(0);
  const stableHistory = useRef(new Map());
  const onResults = useCallback(results => {
    setObjects(results);
    // Speak only classes observed in consecutive scans, reducing transient false alerts.
    const current = new Set(results.map(r => `${r.type}:${r.direction}`));
    for (const key of stableHistory.current.keys()) {
      if (!current.has(key)) stableHistory.current.delete(key);
    }
    for (const key of current) stableHistory.current.set(key, Math.min(3,(stableHistory.current.get(key)||0)+1));
    const stable = results.filter(r => (stableHistory.current.get(`${r.type}:${r.direction}`)||0)>=2);
    if (!stable.length) return;
    const primary = [...stable].sort((a,b)=>b.confidence-a.confidence)[0];
    onDetection?.(primary, false);
    if (Date.now()-lastAnnouncement.current > 7000) {
      generateAlert(primary, settings);
      lastAnnouncement.current = Date.now();
    }
  }, [onDetection, settings]);
  return <div className="detection-page">
    <header className="detection-top">
      <button className="round-control" onClick={onBack} aria-label="Back"><ArrowLeft/></button>
      <div><strong>LIVE ASSISTANCE</strong><span className="scanning">REAL CAMERA RECOGNITION</span></div>
      <button className="round-control" onClick={onSettings} aria-label="Settings"><Settings2/></button>
    </header>
    <CameraView facingMode={settings.camera} running={running} onResults={onResults}/>
    <div className="detection-content">
      <div className="real-info" role="status">Objects shown below are recognized from your camera. <strong>Distance and safe walking routes are NOT determined.</strong> An empty result does not mean the path is clear.</div>
      <h2 className="real-section-title">Recognized objects ({objects.length})</h2>
      {objects.length ? <div className="real-object-list">{objects.map((o,i)=><div className="real-object-item" key={`${o.type}-${i}`}><strong>{o.type}</strong><span>{o.direction} · {Math.round(o.confidence*100)}% confidence</span></div>)}</div> : <p className="real-empty">No supported objects recognized in this frame. Keep using normal mobility aids.</p>}
      <button className="stop-button" onClick={()=>setRunning(r=>!r)}>{running ? <><Square size={18}/> PAUSE RECOGNITION</> : <><Play size={18}/> RESUME RECOGNITION</>}</button>
    </div>
  </div>;
}
