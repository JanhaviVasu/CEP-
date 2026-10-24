import { ArrowLeft, Pause, Settings2, Square } from "lucide-react";
import CameraView from "../components/CameraView";
import StatusCard from "../components/StatusCard";
import DemoControls from "../components/DemoControls";
import { demoObstacles, getNextObstacle } from "../services/obstacleDetection";
import { useEffect, useState } from "react";

export default function DetectionScreen({ settings, detection, onDetection, onStop, onBack, onSettings }) {
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running || !settings.demoMode) return;
    const timer = setInterval(() => onDetection(getNextObstacle(detection), false), 5000);
    return () => clearInterval(timer);
  }, [running, settings.demoMode, detection, onDetection]);

  return (
    <div className="detection-page">
      <header className="detection-top">
        <button className="round-control" onClick={onBack} aria-label="Go back"><ArrowLeft/></button>
        <div><strong>LIVE DETECTION</strong><span className="scanning"><i/> SCANNING</span></div>
        <button className="round-control" onClick={onSettings} aria-label="Open detection settings"><Settings2/></button>
      </header>

      <CameraView obstacle={detection} facingMode={settings.camera}/>
      <div className="detection-content">
        <div className="direction-strip" aria-label={`Obstacle direction: ${detection.direction}`}>
          {["Left", "Center", "Right"].map(d => <div key={d} className={detection.direction === d ? "selected" : ""}><span>{d === "Left" ? "←" : d === "Right" ? "→" : "↑"}</span><small>{d.toUpperCase()}</small></div>)}
        </div>

        <StatusCard obstacle={detection}/>

        {settings.demoMode && <DemoControls onSelect={onDetection}/>}
        <button className={`stop-button ${running ? "" : "paused"}`} onClick={() => setRunning(!running)}>
          {running ? <><Square size={19} fill="currentColor"/> STOP DETECTION</> : <><Pause size={20}/> PAUSED — TAP TO RESUME</>}
        </button>
      </div>
    </div>
  );
}