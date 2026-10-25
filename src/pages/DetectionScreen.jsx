import { useCallback, useRef, useState } from "react";
import { ArrowLeft, Settings2, Square, Play } from "lucide-react";
import CameraView from "../components/CameraView";
import { generateAlert } from "../services/alertService";
export default function DetectionScreen({ settings, onDetection, onBack, onSettings }) {
  const [running, setRunning] = useState(true);
  const [objects, setObjects] = useState([]);
  const lastAnnouncement = useRef(0);
  const onResults = useCallback(results => {
    setObjects(results);
    if (!results.length) return;
    const primary = [...results].sort((a,b)=>b.confidence-a.confidence)[0];
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
