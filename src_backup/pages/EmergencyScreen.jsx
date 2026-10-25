import { CheckCircle2, PhoneCall, ShieldAlert, X } from "lucide-react";
import { useState } from "react";

export default function EmergencyScreen({ onClose }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="emergency-title">
      <div className="emergency-modal">
        {!sent ? (
          <>
            <button className="modal-close" onClick={onClose} aria-label="Close"><X/></button>
            <div className="emergency-icon"><ShieldAlert size={44}/></div>
            <span className="eyebrow danger-text">EMERGENCY ASSISTANCE</span>
            <h1 id="emergency-title">Do you need emergency assistance?</h1>
            <p>For this prototype, no message or call will actually be sent.</p>
            <div className="emergency-actions">
              <button className="secondary-button" onClick={onClose}>CANCEL</button>
              <button className="danger-button" onClick={() => setSent(true)}><PhoneCall/> YES, SEND ALERT</button>
            </div>
          </>
        ) : (
          <>
            <div className="success-big"><CheckCircle2 size={55}/></div>
            <span className="eyebrow">SIMULATION ACTIVE</span>
            <h1>Emergency alert simulation activated.</h1>
            <p>In a future version, this action could connect to emergency contacts, SMS, location sharing or a phone call.</p>
            <button className="primary-button wide" onClick={onClose}>Return to PathSense</button>
          </>
        )}
      </div>
    </div>
  );
}