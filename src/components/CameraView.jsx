import { useEffect, useRef, useState } from "react";
import { getCameraStream, stopCamera } from "../services/cameraService";
import { detectObstacles, loadObjectDetector } from "../services/obstacleDetection";

export default function CameraView({ facingMode = "environment", running = true, sensitivity = "balanced", onResults }) {
  const videoRef = useRef(null);
  const callbackRef = useRef(onResults);
  const runningRef = useRef(running);
  const sensitivityRef = useRef(sensitivity);
  const [status, setStatus] = useState("Starting camera…");
  const [objects, setObjects] = useState([]);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

  useEffect(() => { callbackRef.current = onResults; }, [onResults]);
  useEffect(() => { runningRef.current = running; if (!running) setObjects([]); }, [running]);
  useEffect(() => { sensitivityRef.current = sensitivity; }, [sensitivity]);

  useEffect(() => {
    let active = true;
    let timer;
    let stream;
    const video = videoRef.current;
    setObjects([]);
    setFrameSize({ width: 0, height: 0 });
    callbackRef.current?.([]);

    async function start() {
      try {
        setStatus(`Opening ${facingMode === "user" ? "front" : "back"} camera…`);
        stream = await getCameraStream(facingMode);
        if (!active) { stream.getTracks().forEach(track => track.stop()); return; }
        if (!video) { stream.getTracks().forEach(track => track.stop()); return; }
        video.srcObject = stream;
        await video.play();
        if (!active) return;
        setFrameSize({ width: video.videoWidth, height: video.videoHeight });
        setStatus("Loading object recognition…");
        await loadObjectDetector();
        if (!active) return;
        setStatus("ready");
        async function scan() {
          if (!active) return;
          if (runningRef.current) {
            try {
              const results = await detectObstacles(video, sensitivityRef.current);
              if (!active) return;
              setObjects(results);
              callbackRef.current?.(results);
            } catch (error) {
              if (active) setStatus(`Recognition error: ${error.message}`);
              return;
            }
          }
          if (active) timer = setTimeout(scan, 250);
        }
        scan();
      } catch (error) {
        if (active) setStatus(`Camera unavailable: ${error.message}`);
      }
    }
    start();
    return () => {
      active = false;
      clearTimeout(timer);
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (video) stopCamera(video);
    };
  }, [facingMode]);

  function boxStyle(bbox) {
    const video = videoRef.current;
    if (!video || !frameSize.width || !frameSize.height) return {};
    const container = video.getBoundingClientRect();
    if (!container.width || !container.height) return {};
    const scale = Math.max(container.width / frameSize.width, container.height / frameSize.height);
    const offsetX = (container.width - frameSize.width * scale) / 2;
    const offsetY = (container.height - frameSize.height * scale) / 2;
    const [x, y, width, height] = bbox;
    return { left: offsetX + x * scale, top: offsetY + y * scale, width: width * scale, height: height * scale };
  }

  return <div className="camera-frame real-camera">
    <video ref={videoRef} autoPlay playsInline muted aria-label={`${facingMode === "user" ? "Front" : "Back"} camera preview`} style={facingMode === "user" ? { transform: "scaleX(-1)" } : undefined} />
    {status !== "ready" && <div className="camera-error" role="status">{status}</div>}
    {status === "ready" && <>
      <span className="real-scan-label">{running ? `● ${facingMode === "user" ? "FRONT" : "BACK"} CAMERA · LIVE` : "PAUSED"}</span>
      {objects.map((item, index) => <div key={`${item.type}-${index}`} className="real-object-box" style={{ ...boxStyle(item.bbox), ...(facingMode === "user" ? { transform: "scaleX(-1)" } : {}) }}><span>{item.type} · {item.direction} · {Math.round(item.confidence * 100)}%</span></div>)}
      <div className="camera-distance">{objects.length} recognized object(s) · Distance unavailable</div>
      <div className="pathsense-object-panel" style={{ position: "absolute", left: 12, right: 12, bottom: 52, maxHeight: 135, overflowY: "auto", background: "rgba(23,43,70,.92)", color: "#fff", padding: "10px 14px", borderRadius: 12, fontSize: 13, zIndex: 5 }}>
        <strong>Detected objects</strong>
        {!running ? <p>Detection paused</p> : objects.length === 0 ? <p>No supported objects recognized. This does not mean the path is clear.</p> : <ul style={{ paddingLeft: 18, margin: "8px 0 0" }}>{objects.map((item, index) => <li key={`${item.type}-${index}`}>{item.type} — {item.direction} — {Math.round(item.confidence * 100)}% confidence</li>)}</ul>}
      </div>
    </>}
  </div>;
}
