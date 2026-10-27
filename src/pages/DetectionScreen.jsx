import { useCallback, useRef, useState } from "react";
import { ArrowLeft, Settings2, Square, Play } from "lucide-react";
import CameraView from "../components/CameraView";
import { generateAlert } from "../services/alertService";
export default function DetectionScreen({ settings, onDetection, onBack, onSettings }) {
  const [running, setRunning] = useState(true);
  const [objects, setObjects] = useState([]);
  const lastAnnouncement = useRef(0);
  const [sensitivity, setSensitivity] = useState("balanced");
  const [cameraFacing, setCameraFacing] = useState("environment");
  const onResults = useCallback(results => {
    setObjects(results);
    // Show objects immediately. Spoken alerts are rate-limited separately.
    if (!results.length) return;
    const primary = results[0];
    onDetection?.(primary, false);
    if (Date.now() - lastAnnouncement.current > 5500) {
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
    <div role="group" aria-label="Choose camera" style={{display:"flex",gap:10,padding:"12px 16px",background:"#fff",borderRadius:14,margin:"10px 0"}}>
      {[["environment", "📷 Back Camera"], ["user", "🤳 Front Camera"]].map(([mode,label]) => <button key={mode} type="button" aria-pressed={cameraFacing === mode} onClick={() => { setCameraFacing(mode); setObjects([]); }} style={{flex:1,padding:"12px 8px",borderRadius:12,border:"2px solid #159e8a",background:cameraFacing===mode?"#159e8a":"#fff",color:cameraFacing===mode?"#fff":"#173451",fontWeight:700,fontSize:14,cursor:"pointer"}}>{label}</button>)}
    </div>
    <CameraView facingMode={cameraFacing} running={running} sensitivity={sensitivity} onResults={onResults}/>
    <div className="detection-content">
      <div className="real-info" role="status">Objects shown below are recognized from your camera. <strong>Distance and safe walking routes are NOT determined.</strong> An empty result does not mean the path is clear.</div>
      <label htmlFor="detection-sensitivity" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,margin:"12px 0",fontWeight:700}}>
        Detection sensitivity
        <select id="detection-sensitivity" value={sensitivity} onChange={event => setSensitivity(event.target.value)} style={{padding:"10px",borderRadius:10,border:"1px solid #a8b9b4",background:"white",color:"#172b46"}}>
          <option value="high">High (more objects)</option>
          <option value="balanced">Balanced</option>
          <option value="low">Low (fewer false alerts)</option>
        </select>
      </label>
      <h2 className="real-section-title">Recognized objects ({objects.length})</h2>
      {objects.length ? <div className="real-object-list">{objects.map((o,i)=><div className="real-object-item" key={`${o.type}-${i}`}><strong>{o.type}</strong><span>{o.direction} · {Math.round(o.confidence*100)}% confidence</span></div>)}</div> : <p className="real-empty">No supported objects recognized in this frame. Keep using normal mobility aids.</p>}
      <button className="stop-button" onClick={()=>setRunning(r=>!r)}>{running ? <><Square size={18}/> PAUSE RECOGNITION</> : <><Play size={18}/> RESUME RECOGNITION</>}</button>
    </div>
  </div>;
}
