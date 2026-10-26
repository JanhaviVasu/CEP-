PathSense Pune Navigation + Camera Detection Update

1. Back up your existing CEP-/src folder.
2. Extract this archive and copy its src folder into CEP-.
3. In the VS Code terminal run: npm.cmd install leaflet lucide-react @tensorflow-models/coco-ssd @tensorflow/tfjs
4. Run: npm.cmd run dev
5. Open the Map tab. Choose a Pune destination, then Find Me and Track GPS.
6. For real pedestrian routing, supply a valid OpenRouteService key in Map.
7. Calculate Walking Route, then Start Live Route Guidance.
8. Test Camera recognition outdoors and indoors with permission granted.

Notes:
- Pune-only restriction is applied to routing endpoints and selected destinations. GPS still reports the device's true position, even outside Pune.
- Preset locations are approximate coordinates, not verified entrances.
- Camera uses COCO-SSD at 52% minimum confidence, filters tiny detections, and requires two consecutive detections before voice announcements. This reduces some false alerts but may miss objects.
- COCO-SSD recognizes a limited set of object classes. It cannot estimate physical distance, recognize every obstacle, verify accessible paths, or make crossing decisions.
- Routing needs HTTPS or localhost for location permissions, internet, and a valid external routing key. This remains experimental assistance and is not safe to rely on as the sole navigation aid.
