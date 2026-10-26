import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

let modelPromise = null;
// A larger COCO-SSD base network can improve classification on capable phones,
// at the cost of slower loading and inference. This is not a safety detector.
export function loadObjectDetector() {
  if (!modelPromise) {
    modelPromise = cocoSsd.load({ base: "mobilenet_v2" }).catch(error => {
      modelPromise = null;
      throw error;
    });
  }
  return modelPromise;
}

const MIN_CONFIDENCE = 0.52;
const MAX_OBJECTS = 20;
const MAX_ASPECT_RATIO = 15;

export async function detectObstacles(video) {
  if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return [];
  const model = await loadObjectDetector();
  const predictions = await model.detect(video, MAX_OBJECTS, MIN_CONFIDENCE);
  const frameArea = video.videoWidth * video.videoHeight;
  return predictions
    .filter(p => {
      if (!Number.isFinite(p.score) || p.score < MIN_CONFIDENCE) return false;
      const [x,y,w,h] = p.bbox;
      if (![x,y,w,h].every(Number.isFinite) || w <= 0 || h <= 0) return false;
      if (w*h < frameArea * 0.0006 || Math.max(w/h,h/w) > MAX_ASPECT_RATIO) return false;
      return x < video.videoWidth && y < video.videoHeight && x+w > 0 && y+h > 0;
    })
    .map(p => {
      const [x,,w] = p.bbox;
      const normalizedX = (x+w/2)/video.videoWidth;
      return {
        type: p.class,
        confidence: p.score,
        direction: normalizedX < 0.38 ? "Left" : normalizedX > 0.62 ? "Right" : "Center",
        bbox: p.bbox,
        distanceMeters: null,
        distanceStatus: "unavailable",
        danger: "unknown",
      };
    })
    .sort((a,b)=>b.confidence-a.confidence);
}
