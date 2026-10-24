import { ArrowLeft, Check, ChevronRight, Volume2, Vibrate, Accessibility, Camera, Gauge, Info } from "lucide-react";

function Toggle({ checked, onChange, label }) {
  return <button className={`toggle ${checked ? "on" : ""}`} role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}><span/></button>;
}

export default function SettingsScreen({ settings, setSettings, onBack }) {
  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));
  return (
    <div className="settings-page">
      <header className="simple-header"><button className="round-control" onClick={onBack}><ArrowLeft/></button><div><strong>Settings</strong><small>Personalize your assistance</small></div><div/></header>

      <SettingSection title="ALERTS">
        <Row icon={<Volume2/>} title="Alert Mode" sub="Choose how warnings are delivered">
          <select value={settings.alertMode} onChange={e => update("alertMode", e.target.value)} aria-label="Alert mode">
            <option value="both">Voice + Vibration</option><option value="voice">Voice Only</option><option value="vibration">Vibration Only</option>
          </select>
        </Row>
        <Row icon={<Volume2/>} title="Voice Alerts" sub="Short spoken warnings"><Toggle checked={settings.voiceEnabled} onChange={v => update("voiceEnabled", v)} label="Voice alerts"/></Row>
        <Row icon={<Vibrate/>} title="Vibration" sub="Haptic warning patterns"><Toggle checked={settings.vibrationEnabled} onChange={v => update("vibrationEnabled", v)} label="Vibration"/></Row>
        <Row title="Speech Rate" sub={`${settings.speechRate.toFixed(1)}×`}>
          <input className="range" type="range" min="0.6" max="1.5" step="0.1" value={settings.speechRate} onChange={e => update("speechRate", Number(e.target.value))} aria-label="Speech rate"/>
        </Row>
      </SettingSection>

      <SettingSection title="ACCESSIBILITY">
        <Row icon={<Accessibility/>} title="Large Text" sub="Increase important text"><Toggle checked={settings.largeText} onChange={v => update("largeText", v)} label="Large text"/></Row>
        <Row title="High Contrast" sub="Stronger visual contrast"><Toggle checked={settings.highContrast} onChange={v => update("highContrast", v)} label="High contrast"/></Row>
        <Row title="Reduced Motion" sub="Minimize animation"><Toggle checked={settings.reducedMotion} onChange={v => update("reducedMotion", v)} label="Reduced motion"/></Row>
        <Row title="Haptic Feedback" sub="Use touch feedback"><Toggle checked={settings.hapticFeedback} onChange={v => update("hapticFeedback", v)} label="Haptic feedback"/></Row>
      </SettingSection>

      <SettingSection title="DETECTION">
        <Row icon={<Gauge/>} title="Safe Distance" sub={`Safe above ${settings.safeDistance.toFixed(1)} m`}><input className="range" type="range" min="2" max="5" step="0.5" value={settings.safeDistance} onChange={e => update("safeDistance", Number(e.target.value))} aria-label="Safe distance"/></Row>
        <Row title="Danger Distance" sub={`Danger below ${settings.dangerDistance.toFixed(1)} m`}><input className="range" type="range" min="0.5" max="2" step="0.1" value={settings.dangerDistance} onChange={e => update("dangerDistance", Number(e.target.value))} aria-label="Danger distance"/></Row>
      </SettingSection>

      <SettingSection title="CAMERA">
        <Row icon={<Camera/>} title="Camera Selection" sub="Use the rear camera by default">
          <select value={settings.camera} onChange={e => update("camera", e.target.value)} aria-label="Camera selection"><option value="environment">Back</option><option value="user">Front</option></select>
        </Row>
        <Row title="Demo Mode" sub="Reliable simulated obstacles for presentation"><Toggle checked={settings.demoMode} onChange={v => update("demoMode", v)} label="Demo mode"/></Row>
      </SettingSection>

      <SettingSection title="ABOUT">
        <div className="about-card"><div className="about-logo">PS</div><div><strong>PathSense</strong><p>Version 1.0 Prototype</p><small>Assistive technology concept • AI detection can be integrated later.</small></div></div>
      </SettingSection>
    </div>
  );
}

function SettingSection({ title, children }) {
  return <section className="settings-section"><div className="section-title"><span>{title}</span></div><div className="settings-card">{children}</div></section>;
}
function Row({ icon, title, sub, children }) {
  return <div className="setting-row">{icon && <div className="setting-icon">{icon}</div>}<div className="setting-copy"><strong>{title}</strong><span>{sub}</span></div><div className="setting-control">{children}</div></div>;
}