let lastSpoken = "";
let lastSpokenAt = 0;

function buildMessage(obstacle) {
  if (!obstacle || obstacle.danger === "safe") return "Path is clear.";
  if (obstacle.type === "Stairs") return `Stairs detected ahead. ${obstacle.distance.toFixed(1)} meters.`;
  if (obstacle.type === "Pothole") return `Pothole detected ${obstacle.direction.toLowerCase()}.`;
  if (obstacle.danger === "danger") return `Stop. ${obstacle.type} very close.`;
  return `Caution. ${obstacle.type} ahead. ${obstacle.distance.toFixed(1)} meters.`;
}

export function speakAlert(obstacle, settings) {
  if (!settings.voiceEnabled || settings.alertMode === "vibration") return;
  if (!("speechSynthesis" in window)) return;

  const message = buildMessage(obstacle);
  const now = Date.now();
  if (message === lastSpoken && now - lastSpokenAt < 3500) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.rate = settings.speechRate;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
  lastSpoken = message;
  lastSpokenAt = now;
}

export function vibrateAlert(obstacle, settings) {
  if (!settings.vibrationEnabled || settings.alertMode === "voice") return;
  if (!("vibrate" in navigator)) return;
  if (obstacle.danger === "danger") navigator.vibrate([300, 150, 300]);
  else if (obstacle.danger === "caution") navigator.vibrate([200]);
  else navigator.vibrate(0);
}

export function generateAlert(obstacle, settings) {
  speakAlert(obstacle, settings);
  vibrateAlert(obstacle, settings);
}