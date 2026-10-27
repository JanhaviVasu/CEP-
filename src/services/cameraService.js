export async function requestCameraPermission() {
  if (!navigator.mediaDevices?.getUserMedia) return false;
  try {
    const stream = await getCameraStream("environment");
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch { return false; }
}

export async function getCameraStream(facingMode = "environment") {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera access requires HTTPS or localhost and a supported browser.");
  }
  const selected = facingMode === "user" ? "user" : "environment";
  // Try exact facing first. Some Android browsers only honor the ideal preference.
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { exact: selected }, width: { ideal: 1280 }, height: { ideal: 720 } },
    });
  } catch (error) {
    if (error.name !== "OverconstrainedError" && error.name !== "NotFoundError") throw error;
    // Do not silently show the wrong camera when a requested lens is unavailable.
    throw new Error(`${selected === "user" ? "Front" : "Back"} camera not available in this browser. Check Android camera permissions or try Chrome.`);
  }
}

export function stopCamera(videoElement) {
  const stream = videoElement?.srcObject;
  if (stream) stream.getTracks().forEach(track => track.stop());
  if (videoElement) videoElement.srcObject = null;
}
