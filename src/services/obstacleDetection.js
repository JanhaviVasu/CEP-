import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

let modelPromise;
export function loadObjectDetector() {
  if (!modelPromise) {
    modelPromise = cocoSsd.load({ base: "mobilenet_v2" }).catch(async () => {
      // Some devices fail to initialize the larger backbone.
      return cocoSsd.load({ base: "lite_mobilenet_v2" });
    }).catch(error => { modelPromise = null; throw error; });
  }
  return modelPromise;
}

export const DETECTION_SENSITIVITY = {
  high: 0.25,
  balanced: 0.35,
  low: 0.55,
};

export async function detectObstacles(video, sensitivity = "balanced") {
  if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return [];
  const model = await loadObjectDetector();
  const threshold = DETECTION_SENSITIVITY[sensitivity] ?? DETECTION_SENSITIVITY.balanced;
  const predictions = await model.detect(video, 30, threshold);
  return predictions.filter(p => {
    if (!Number.isFinite(p.score) || p.score < threshold || !Array.isArray(p.bbox)) return false;
    const [x, y, w, h] = p.bbox;
    return [x, y, w, h].every(Number.isFinite) && w > 1 && h > 1 && x < video.videoWidth && y < video.videoHeight && x + w > 0 && y + h > 0;
  }).map(p => {
    const [x, , w] = p.bbox;
    const cx = (x + w / 2) / video.videoWidth;
    return {
      type: p.class,
      confidence: p.score,
      direction: cx < 0.38 ? "Left" : cx > 0.62 ? "Right" : "Center",
      bbox: p.bbox,
      distanceMeters: null,
      distanceStatus: "unavailable",
      danger: "unknown",
    };
  }).sort((a, b) => b.confidence - a.confidence);
}
