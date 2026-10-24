import { Activity, Camera, Volume2 } from "lucide-react";
import { requestCameraPermission } from "../services/cameraService";

export default function PermissionScreen({ onContinue }) {
  const continueSetup = async () => {
    await requestCameraPermission();
    onContinue();
  };

  return (
    <div className="setup-page">
      <div className="brand-row"><div className="mini-logo">PS</div><strong>PathSense</strong></div>
      <div className="setup-hero">
        <span className="eyebrow">ACCESSIBILITY FIRST</span>
        <h1>Let PathSense help you navigate</h1>
        <p>PathSense can use your phone's camera, audio and vibration to provide short navigation warnings.</p>
      </div>

      <section className="permission-list" aria-label="Required permissions">
        <article className="permission-card">
          <div className="icon-box cyan"><Camera/></div>
          <div><h2>Camera</h2><p>Camera helps PathSense understand what is ahead.</p></div>
        </article>
        <article className="permission-card">
          <div className="icon-box green"><Activity/></div>
          <div><h2>Sensors</h2><p>Phone sensors can help detect movement and orientation.</p></div>
        </article>
        <article className="permission-card">
          <div className="icon-box purple"><Volume2/></div>
          <div><h2>Audio & vibration</h2><p>Alerts can guide you using sound and vibration.</p></div>
        </article>
      </section>

      <button className="primary-button wide" onClick={continueSetup}>
        Allow & Continue
      </button>
      <p className="privacy-note">You can change these settings anytime.</p>
    </div>
  );
}