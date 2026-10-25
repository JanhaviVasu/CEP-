export function getSensorStatus() {
  return {
    camera: Boolean(navigator.mediaDevices?.getUserMedia),
    motion: "DeviceMotionEvent" in window,
    orientation: "DeviceOrientationEvent" in window,
    vibration: "vibrate" in navigator
  };
}

// Browser prototypes may not expose sensor permissions consistently.
// Never treat missing browser APIs as real-world sensor measurements.