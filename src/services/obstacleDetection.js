export const demoObstacles = [
  { type: "Path Clear", distance: 4.5, direction: "Center", danger: "safe" },
  { type: "Person", distance: 2.8, direction: "Center", danger: "caution" },
  { type: "Chair", distance: 1.5, direction: "Left", danger: "caution" },
  { type: "Wall", distance: 0.7, direction: "Center", danger: "danger" },
  { type: "Pothole", distance: 1.2, direction: "Right", danger: "danger" },
  { type: "Vehicle", distance: 2.2, direction: "Right", danger: "caution" },
  { type: "Stairs", distance: 1.1, direction: "Center", danger: "danger" }
];

export function getNextObstacle(current) {
  const index = demoObstacles.findIndex(x => x.type === current?.type);
  return demoObstacles[(index + 1) % demoObstacles.length];
}

// FUTURE AI INTEGRATION:
// Keep this interface independent from the UI.
// A YOLO, TensorFlow Lite, MediaPipe, ONNX Runtime, or other detector
// can replace this demo implementation without changing the screens.
export async function detectObstacles(videoElement) {
  return demoObstacles[0];
}

export function estimateDistance(obstacle) {
  return obstacle?.distance ?? null;
}

export function determineDirection(obstacle) {
  return obstacle?.direction ?? "Center";
}

export function calculateRisk(distance, safeDistance = 3, dangerDistance = 1.5) {
  if (distance == null) return "safe";
  if (distance < dangerDistance) return "danger";
  if (distance <= safeDistance) return "caution";
  return "safe";
}