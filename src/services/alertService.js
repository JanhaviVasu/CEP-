let lastSpoken = "";
let lastSpokenAt = 0;
export function generateAlert(obstacle, settings) {
  if (!obstacle || !settings.voiceEnabled || settings.alertMode === "vibration") return;
  if (!("speechSynthesis" in window)) return;
  const message = `${obstacle.type} detected ${obstacle.direction.toLowerCase()} in the camera view. Distance unknown.`;
  const now = Date.now();
  if (message === lastSpoken && now - lastSpokenAt < 6500) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = Number(settings.speechRate) || 1;
  window.speechSynthesis.speak(utterance);
  lastSpoken = message;
  lastSpokenAt = now;
}
