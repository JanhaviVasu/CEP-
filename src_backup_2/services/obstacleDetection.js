
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

let modelPromise = null;

export function loadObjectDetector() {
  if (!modelPromise) {
    modelPromise = cocoSsd
      .load({ base: "mobilenet_v2" })
      .catch((error) => {
        modelPromise = null;
        throw error;
      });
  }

  return modelPromise;
}

export async function detectObstacles(video) {
  if (
    !video ||
    video.readyState < 2 ||
    !video.videoWidth ||
    !video.videoHeight
  ) {
    return [];
  }

  const model = await loadObjectDetector();

  const predictions = await model.detect(video, 30, 0.3);

  return predictions
    .filter((prediction) => {
      const [x, y, width, height] = prediction.bbox;

      return (
        prediction.score >= 0.3 &&
        width > 0 &&
        height > 0 &&
        x + width > 0 &&
        y + height > 0
      );
    })
    .map((prediction) => {
      const [x, y, width, height] = prediction.bbox;

      const centerX = (x + width / 2) / video.videoWidth;

      let direction = "Center";

      if (centerX < 1 / 3) {
        direction = "Left";
      } else if (centerX > 2 / 3) {
        direction = "Right";
      }

      return {
        type: prediction.class,
        confidence: prediction.score,
        direction,
        bbox: prediction.bbox,

        // COCO-SSD does not measure physical distance.
        distanceMeters: null,
        distanceStatus: "unavailable",

        // Danger cannot be determined from object detection alone.
        danger: "unknown",
      };
    })
    .sort((a, b) => b.confidence - a.confidence);
}
