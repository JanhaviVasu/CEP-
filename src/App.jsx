import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import HomeScreen from "./pages/HomeScreen";
import DetectionScreen from "./pages/DetectionScreen";
import SettingsScreen from "./pages/SettingsScreen";
import HelpScreen from "./pages/HelpScreen";
import EmergencyScreen from "./pages/EmergencyScreen";
import ReferencePage from "./pages/ReferencePage";
import BottomNavigation from "./components/BottomNavigation";
import { useLocalSettings } from "./utils/useLocalSettings";

const DEFAULT_SETTINGS = {
  alertMode: "both", voiceEnabled: true, vibrationEnabled: true,
  speechRate: 1, largeText: true, highContrast: true,
  reducedMotion: false, hapticFeedback: true, safeDistance: 3,
  dangerDistance: 1.5, demoMode: false, camera: "environment"
};
const titles = { home: "Home", navigation: "Navigation", detect: "Live Assistance", read: "Read Text", guardian: "Guardian", settings: "Settings", more: "More", help: "About & Help" };
export default function App() {
  const [settings, setSettings] = useLocalSettings("pathsense-settings", DEFAULT_SETTINGS);
  const [screen, setScreen] = useState("home");
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [detection, setDetection] = useState(null);
  useEffect(() => {
    document.documentElement.classList.toggle("large-text", settings.largeText);
    document.documentElement.classList.toggle("high-contrast", settings.highContrast);
    document.documentElement.classList.toggle("reduced-motion", settings.reducedMotion);
  }, [settings]);
  const go = id => { if (id === "sos") setEmergencyOpen(true); else setScreen(id); };
  const navCurrent = ["home","navigation","read"].includes(screen) ? screen : "more";
  return <div className="app-shell ss-app">
    <header className="ss-top"><button className="ss-brand" onClick={()=>go("home")}>● PathSense</button><div><strong>{titles[screen] || "PathSense"}</strong><small>Your personal walking assistant</small></div></header>
    <main className="ss-main">
      {screen === "home" && <HomeScreen onNavigate={go} onStart={()=>go("detect")} onEmergency={()=>setEmergencyOpen(true)}/>}
      {screen === "detect" && <div className="ss-detect-wrap"><DetectionScreen settings={settings} detection={detection} onDetection={setDetection} onBack={()=>go("home")} onSettings={()=>go("settings")}/></div>}
      {screen === "settings" && <div className="ss-wrap"><SettingsScreen settings={settings} setSettings={setSettings} onBack={()=>go("more")}/></div>}
      {screen === "help" && <div className="ss-wrap"><HelpScreen onBack={()=>go("more")}/></div>}
      {["navigation","read","guardian","more"].includes(screen) && <ReferencePage screen={screen} onNavigate={go} onEmergency={()=>setEmergencyOpen(true)}/>}
      <div className="ss-warning"><Info size={17}/><span>Experimental object recognition. Distance and route safety are not determined. Continue using established mobility aids.</span></div>
    </main>
    <BottomNavigation current={navCurrent} onNavigate={go}/>
    {emergencyOpen && <EmergencyScreen onClose={()=>setEmergencyOpen(false)}/>}
  </div>;
}
