import { Eye, Waves } from "lucide-react";

export default function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-logo" aria-label="PathSense logo">
        <div className="logo-ring"><Eye size={54}/></div>
        <Waves className="logo-wave" size={28}/>
      </div>
      <h1>PathSense</h1>
      <p>See the path. Feel the way.</p>
      <span>Smart obstacle assistance for safer navigation.</span>
      <div className="path-loader" aria-hidden="true"><i/><i/><i/></div>
    </div>
  );
}