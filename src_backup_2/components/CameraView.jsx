
import { useEffect, useRef, useState } from "react";
import {
  getCameraStream,
  stopCamera,
} from "../services/cameraService";
import {
  detectObstacles,
  loadObjectDetector,
} from "../services/obstacleDetection";

export default function CameraView({
  facingMode = "environment",
  running = true,
  onResults,
}) {
  const videoRef = useRef(null);
  const callbackRef = useRef(onResults);
  const runningRef = useRef(running);

  const [status, setStatus] = useState("Starting camera…");
  const [objects, setObjects] = useState([]);
  const [frameSize, setFrameSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    callbackRef.current = onResults;
  }, [onResults]);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    let active = true;
    let timer = null;
    let stream = null;

    async function startCamera() {
      try {
        setStatus("Starting camera…");

        stream = await getCameraStream(facingMode);

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const video = videoRef.current;

        if (!video) return;

        video.srcObject = stream;
        await video.play();

        if (!active) return;

        setFrameSize({
          width: video.videoWidth,
          height: video.videoHeight,
        });

        setStatus("Loading AI model…");

        await loadObjectDetector();

        if (!active) return;

        setStatus("ready");

        async function scan() {
          if (!active) return;

          if (runningRef.current) {
            try {
              const results = await detectObstacles(video);

              if (!active) return;

              setObjects(results);
              callbackRef.current?.(results);
            } catch (error) {
              if (active) {
                setStatus(
                  `Detection error: ${error.message}`
                );
              }
              return;
            }
          }

          if (active) {
            timer = setTimeout(scan, 650);
          }
        }

        scan();
      } catch (error) {
        if (active) {
          setStatus(
            `Camera or model unavailable: ${error.message}`
          );
        }
      }
    }

    startCamera();

    return () => {
      active = false;
      clearTimeout(timer);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      stopCamera(videoRef.current);
    };
  }, [facingMode]);

  const video = videoRef.current;

  function getBoxStyle(bbox) {
    if (!video || !frameSize.width || !frameSize.height) {
      return {};
    }

    const [x, y, width, height] = bbox;

    const container = video.getBoundingClientRect();

    if (!container.width || !container.height) {
      return {};
    }

    const scale = Math.max(
      container.width / frameSize.width,
      container.height / frameSize.height
    );

    const offsetX =
      (container.width - frameSize.width * scale) / 2;

    const offsetY =
      (container.height - frameSize.height * scale) / 2;

    return {
      left: offsetX + x * scale,
      top: offsetY + y * scale,
      width: width * scale,
      height: height * scale,
    };
  }

  return (
    <div className="camera-frame real-camera">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        aria-label="Live camera"
      />

      {status !== "ready" && (
        <div className="camera-error" role="status">
          {status}
        </div>
      )}

      {status === "ready" && (
        <>
          <span className="real-scan-label">
            {running
              ? "● LIVE AI RECOGNITION"
              : "PAUSED"}
          </span>

          {objects.map((item, index) => (
            <div
              key={`${item.type}-${index}`}
              className="real-object-box"
              style={getBoxStyle(item.bbox)}
            >
              <span>
                {item.type} · {item.direction} ·{" "}
                {Math.round(item.confidence * 100)}%
              </span>
            </div>
          ))}

          <div className="camera-distance">
            {objects.length} recognized object(s)
            {" · "}
            Distance unavailable
          </div>

          <div
            className="pathsense-object-panel"
            style={{
              position: "absolute",
              left: "12px",
              right: "12px",
              bottom: "52px",
              maxHeight: "135px",
              overflowY: "auto",
              background: "rgba(23, 43, 70, 0.92)",
              color: "#ffffff",
              padding: "10px 14px",
              borderRadius: "12px",
              fontSize: "13px",
              zIndex: 5,
            }}
          >
            <strong>Detected objects</strong>

            {!running ? (
              <p>Detection paused</p>
            ) : objects.length === 0 ? (
              <p>
                No supported objects recognized.
                This does not mean the path is clear.
              </p>
            ) : (
              <ul
                style={{
                  paddingLeft: "18px",
                  margin: "8px 0 0",
                }}
              >
                {objects.map((item, index) => (
                  <li key={`${item.type}-list-${index}`}>
                    {item.type} — {item.direction} —{" "}
                    {Math.round(item.confidence * 100)}%
                    {" confidence · "}
                    {Number.isFinite(item.distanceMeters)
                      ? `Estimated ${item.distanceMeters.toFixed(1)} m`
                      : "Distance unavailable"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
