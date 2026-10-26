import { useState } from "react";
import { X, PhoneCall, MapPin, Share2 } from "lucide-react";
export default function EmergencyScreen({ onClose }) {
 const [phone,setPhone]=useState(()=>localStorage.getItem("pathsense-emergency-phone")||"");
 const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);
 const save=()=>{localStorage.setItem("pathsense-emergency-phone",phone.trim());setMessage("Contact saved on this device.");};
 const share=()=>{
  if(!navigator.geolocation){setMessage("Location unavailable on this device.");return;}
  setBusy(true);
  navigator.geolocation.getCurrentPosition(async ({coords})=>{
   setBusy(false);
   const text=`I need assistance. My approximate location: https://www.google.com/maps?q=${coords.latitude},${coords.longitude} (GPS accuracy ~${Math.round(coords.accuracy)} m).`;
   try { if(navigator.share) await navigator.share({text}); else {await navigator.clipboard.writeText(text);setMessage("Message copied. Paste it into your messaging app and send it.");} }
   catch(e){setMessage(e.name==="AbortError"?"Sharing cancelled.":"Could not share. Please call your contact.");}
  },e=>{setBusy(false);setMessage(`Location unavailable: ${e.message}`);},{enableHighAccuracy:true,timeout:15000});
 };
 const call=()=>{const cleaned=phone.replace(/[\s()-]/g,"");if(!/^\+?\d{7,15}$/.test(cleaned)){setMessage("Enter a valid contact number first.");return;}if(window.confirm(`Open the phone dialer for ${cleaned}?`))window.location.href=`tel:${cleaned}`;};
 return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="emergency-title"><div className="emergency-modal">
  <button className="modal-close" onClick={onClose} aria-label="Close"><X/></button><h1 id="emergency-title">Emergency Assistance</h1>
  <p>Calls and messages require your confirmation. This website cannot automatically notify emergency services or contacts.</p>
  <label htmlFor="emergency-phone">Trusted contact phone number</label>
  <input id="emergency-phone" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" style={{width:"100%",padding:12,margin:"12px 0",borderRadius:10,border:"1px solid #aaa"}}/>
  <div className="emergency-actions" style={{display:"flex",gap:10,flexWrap:"wrap"}}>
   <button className="secondary-button" onClick={save}>Save Contact</button>
   <button className="danger-button" onClick={call}><PhoneCall size={18}/> Open Dialer</button>
   <button className="secondary-button" onClick={share} disabled={busy}><Share2 size={18}/> {busy?"Locating...":"Share My Location"}</button>
  </div><p role="status">{message}</p><button className="secondary-button" onClick={onClose}>Close</button>
 </div></div>;
}
