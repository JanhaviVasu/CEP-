import { useEffect, useState } from "react";
import {
  AlertTriangle, ArrowLeft, Camera, CheckCircle2, ChevronRight, CircleHelp,
  Eye, Home, Info, Mic, Pause, Play, Settings as SettingsIcon, ShieldAlert,
  Smartphone, Square, Volume2, Vibrate, Waves, X, Zap
} from "lucide-react";
import SplashScreen from "./components/SplashScreen";
import PermissionScreen from "./components/PermissionScreen";
import BottomNavigation from "./components/BottomNavigation";
import HomeScreen from "./pages/HomeScreen";
import DetectionScreen from "./pages/DetectionScreen";
import SettingsScreen from "./pages/SettingsScreen";
import HelpScreen from "./pages/HelpScreen";
import EmergencyScreen from "./pages/EmergencyScreen";
import { useLocalSettings } from "./utils/useLocalSettings";

import { generateAlert } from "./services/alertService";

const DEFAULT_SETTINGS = {
  alertMode: "both",
  voiceEnabled: true,
  vibrationEnabled: true,
  speechRate: 1,
  largeText: true,
  highContrast: true,
  reducedMotion: false,
  hapticFeedback: true,
  safeDistance: 3,
  dangerDistance: 1.5,
  demoMode: true,
  camera: "environment"
};

export default function App() {
  const [settings, setSettings] = useLocalSettings("pathsense-settings", DEFAULT_SETTINGS);
  const [screen, setScreen] = useState("home");
  const [showSplash, setShowSplash] = useState(true);
  const [showPermissions, setShowPermissions] = useState(true);
  const [detection, setDetection] = useState(null);
  const [lastDetection, setLastDetection] = useState(null);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("large-text", settings.largeText);
    document.documentElement.classList.toggle("high-contrast", settings.highContrast);
    document.documentElement.classList.toggle("reduced-motion", settings.reducedMotion);
  }, [settings]);

  const selectObstacle = (obstacle, announce = true) => {
    setDetection(obstacle);
    setLastDetection(obstacle);
    // Spoken alerts are controlled by the live recognition screen.
  };

  const openDetection = () => {
    setScreen("detect");
  };

  if (showSplash) return <SplashScreen />;

  if (showPermissions) {
    return (
      <PermissionScreen
        onContinue={() => setShowPermissions(false)}
        onCamera={openDetection}
      />
    );
  }

  const isMain = ["home", "detect", "settings"].includes(screen);

  return (
    <div className="app-shell">
      <div className="prototype-banner" role="status"><Info size={17}/><span><strong>Experimental recognition:</strong> not validated for obstacle avoidance or navigation.</span></div>

      <main className="page">
        {screen === "home" && (
          <HomeScreen
            settings={settings}
            detection={lastDetection || detection}
            onStart={openDetection}
            onSettings={() => setScreen("settings")}
            onHelp={() => setScreen("help")}
            onEmergency={() => setEmergencyOpen(true)}
          />
        )}

        {screen === "detect" && (
          <DetectionScreen
            settings={settings}
            detection={detection}
            onDetection={selectObstacle}
            onStop={() => setScreen("home")}
            onBack={() => setScreen("home")}
            onSettings={() => setScreen("settings")}
          />
        )}

        {screen === "settings" && (
          <SettingsScreen settings={settings} setSettings={setSettings} onBack={() => setScreen("home")} />
        )}

        {screen === "help" && <HelpScreen onBack={() => setScreen("home")} />}
      </main>

      {isMain && (
        <BottomNavigation current={screen} onNavigate={setScreen} onEmergency={() => setEmergencyOpen(true)} />
      )}

      {emergencyOpen && (
        <EmergencyScreen onClose={() => setEmergencyOpen(false)} />
      )}
    </div>
  );
}