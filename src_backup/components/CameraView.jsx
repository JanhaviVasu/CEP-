import { CameraOff, Circle, ScanLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getCameraStream, stopCamera } from "../services/cameraService";

export default function CameraView({ obstacle, facingMode = "environment" }) {
  const videoRef = useRef(null);
  const [cameraState, setCameraState] = useState("loading");

  useEffect(() => {
    let active = true;
    getCameraStream(facingMode)
      .then(stream => {
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        videoRef.current.srcObject = stream;
        setCameraState("ready");
      })
      .catch(() => setCameraState("error"));
    return () => {
      active = false;
      stopCamera(videoRef.current);
    };
  }, [facingMode]);

  return (
    <div className="camera-frame">
      <video ref={videoRef} autoPlay playsInline muted aria-label="Live camera view"/>
      {cameraState === "error" && (
        <div className="camera-error">
          <CameraOff size={40}/>
          <strong>Camera access isn't available.</strong>
          <span>Check your browser permissions. Demo mode remains available.</span>
        </div>
      )}
      <div className="camera-gradient"/>
      <div className="scan-label"><Circle size={10} fill="currentColor"/> SCANNING</div>
      <div className="vision-zone" aria-label="Path analysis area">
        <span className="corner tl"/><span className="corner tr"/><span className="corner bl"/><span className="corner br"/>
        <ScanLine className="scan-line"/>
      </div>
      {obstacle.danger !== "safe" && (
        <div className={`bounding-box ${obstacle.danger}`} aria-label={`${obstacle.type} detected`}>
          <span>{obstacle.type.toUpperCase()}</span>
        </div>
      )}
      <div className="camera-distance">
        {obstacle.danger === "safe" ? "PATH CLEAR" : `${obstacle.distance.toFixed(1)} m • ${obstacle.direction}`}
      </div>
    </div>
  );
}