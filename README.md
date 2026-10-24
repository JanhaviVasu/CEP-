# PathSense

A mobile-first React + Vite accessibility prototype for visually impaired users.

## Run in VS Code

```bash
npm install
npm run dev
```

Open the local Vite address in a browser. For camera access, use `localhost` or HTTPS.

## Prototype capabilities

- Mobile-first accessible UI
- Camera API with rear camera default
- Simulated obstacle detection
- Demo controls for reliable presentations
- Voice alerts with Web Speech API
- Vibration alerts with Vibration API where supported
- Alert modes: voice, vibration, both
- LocalStorage settings
- Large text, high contrast and reduced motion
- Emergency simulation
- Modular detection service ready for a real AI model
- Friendly camera/API error states

## Important limitation

The current prototype does **not** perform real AI object detection or reliable real-world distance measurement. Demo distances are simulated.

## Future AI integration

Replace the implementation of `detectObstacles(videoElement)` in:

`src/services/obstacleDetection.js`

with a detector such as YOLO, TensorFlow Lite, MediaPipe, ONNX Runtime, or another suitable model. Keep the detector interface independent from the UI.

## Mobile testing

A phone browser generally requires camera access from a secure context. `localhost` works on the development machine; for another device on the network, use an HTTPS deployment/tunnel or a native wrapper.

## Presentation flow

1. Home → Start Detection
2. Allow camera permission
3. Show live camera view
4. Use Demo Mode buttons: Person, Chair, Wall, Pothole, Stairs
5. Demonstrate voice/vibration warning
6. Open Settings to show accessibility controls
7. Demonstrate SOS simulation

## Architecture

Camera → Obstacle Detection Service → Distance → Direction → Risk → Alert Manager → Voice/Vibration.
