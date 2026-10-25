import { ArrowLeft, Camera, CheckCircle2, Ear, Footprints, Scan, Volume2, Vibrate, Waves } from "lucide-react";

export default function HelpScreen({ onBack }) {
  const steps = [
    ["Point your phone forward.", Camera],
    ["Start Detection.", Scan],
    ["PathSense analyzes the camera view.", Waves],
    ["Obstacles are identified.", CheckCircle2],
    ["The app estimates distance and direction.", Footprints],
    ["You receive voice and/or vibration alerts.", Volume2]
  ];
  return (
    <div className="help-page">
      <header className="simple-header"><button className="round-control" onClick={onBack}><ArrowLeft/></button><div><strong>How PathSense Works</strong><small>A simple assistive workflow</small></div><div/></header>
      <section className="flow-card">
        {steps.map(([text, Icon], i) => <div className="flow-step" key={text}><div className="step-icon"><Icon/></div><div><span>STEP {i+1}</span><strong>{text}</strong></div>{i < steps.length-1 && <div className="step-line"/>}</div>)}
      </section>
      <section className="chain-card">
        <div className="chain-node"><Camera/>CAMERA</div><b>↓</b><div className="chain-node"><Scan/>AI DETECTION</div><b>↓</b><div className="chain-node"><Waves/>DISTANCE</div><b>↓</b><div className="chain-node"><Footprints/>DIRECTION</div><b>↓</b><div className="chain-alert"><Volume2/> VOICE + <Vibrate/> VIBRATION</div>
      </section>
      <div className="warning-note"><strong>Important</strong><p>PathSense is an assistive tool and should not replace safe judgment or other mobility aids.</p></div>
    </div>
  );
}