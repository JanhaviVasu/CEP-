import { useEffect, useRef, useState } from "react";
import { Home, Grid2X2, Camera, MapPin, Settings, Siren, Volume2, Mic, Phone, Share2, LocateFixed, Navigation, X, Play, Square, Accessibility, Compass, Save, ArrowLeft } from "lucide-react";
import DetectionScreen from "./pages/DetectionScreen";
import SettingsScreen from "./pages/SettingsScreen";
import { useLocalSettings } from "./utils/useLocalSettings";
import homeArt from "./assets/design-1.jpg";

const defaults={alertMode:"both",voiceEnabled:true,vibrationEnabled:true,speechRate:1,largeText:false,highContrast:false,reducedMotion:false,hapticFeedback:true,safeDistance:3,dangerDistance:1.5,demoMode:false,camera:"environment"};
const emergencyNumbers=[
 {name:"National emergency",number:"112",detail:"Police, fire and medical emergency"},
 {name:"Police",number:"100",detail:"Police assistance"},
 {name:"Fire",number:"101",detail:"Fire and rescue"},
 {name:"Ambulance",number:"102",detail:"Medical transport"},
 {name:"Ambulance / emergency services",number:"108",detail:"Availability can vary by state"},
 {name:"Women helpline",number:"181",detail:"Support for women"},
 {name:"Women in distress",number:"1091",detail:"Police women helpline"},
 {name:"Child helpline",number:"1098",detail:"Child protection"},
 {name:"Cybercrime",number:"1930",detail:"Report cyber financial fraud"},
 {name:"Road accident",number:"1073",detail:"Road accident assistance"},
 {name:"LPG gas leak",number:"1906",detail:"Gas leak helpline"},
 {name:"Disaster relief",number:"1070",detail:"Relief commissioner"}
];
// Curated Pune destinations. Coordinates are approximate map points, not entrance locations.
const PUNE_CENTER={lat:18.5204,lng:73.8567};
const PUNE_PLACES=[
 {name:"Shivajinagar",lat:18.5314,lng:73.8446},
 {name:"Pune Railway Station",lat:18.5289,lng:73.8744},
 {name:"Swargate",lat:18.5018,lng:73.8636},
 {name:"Deccan Gymkhana",lat:18.5165,lng:73.8415},
 {name:"Kothrud",lat:18.5074,lng:73.8077},
 {name:"Karve Nagar",lat:18.4916,lng:73.8213},
 {name:"Hadapsar",lat:18.5089,lng:73.9260},
 {name:"Koregaon Park",lat:18.5362,lng:73.8939},
 {name:"Viman Nagar",lat:18.5679,lng:73.9143},
 {name:"Aundh",lat:18.5590,lng:73.8077},
 {name:"Baner",lat:18.5590,lng:73.7868},
 {name:"Wakad",lat:18.5975,lng:73.7643},
 {name:"Hinjawadi",lat:18.5913,lng:73.7389},
 {name:"Camp / MG Road",lat:18.5164,lng:73.8792},
 {name:"FC Road",lat:18.5206,lng:73.8418},
 {name:"Sinhagad Road",lat:18.4764,lng:73.8246},
 {name:"Pune University",lat:18.5522,lng:73.8246},
 {name:"Katraj",lat:18.4529,lng:73.8652},
];
// Approximate Pune urban-area boundary, for destination selection only.
const inPune=p=>Boolean(p&&p.lat>=18.40&&p.lat<=18.67&&p.lng>=73.68&&p.lng<=74.02);
const tabs=[{id:"home",label:"Home",icon:Home},{id:"features",label:"Features",icon:Grid2X2},{id:"map",label:"Map",icon:MapPin},{id:"settings",label:"Settings",icon:Settings},{id:"sos",label:"SOS",icon:Siren}];
const validPhone=s=>/^\+?\d{7,15}$/.test(s.replace(/[\s()-]/g,""));
function distanceMeters(a,b){const r=Math.PI/180,p1=a.lat*r,p2=b.lat*r,dp=(b.lat-a.lat)*r,dl=(b.lng-a.lng)*r;const h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;return Math.round(12742000*Math.asin(Math.sqrt(h)));}
function bearing(a,b){const rad=Math.PI/180,p1=a.lat*rad,p2=b.lat*rad,dl=(b.lng-a.lng)*rad;return (Math.atan2(Math.sin(dl)*Math.cos(p2),Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl))*180/Math.PI+360)%360;}
function direction(deg){return ["north","northeast","east","southeast","south","southwest","west","northwest"][Math.round(deg/45)%8]}
export default function App(){
 const [screen,setScreen]=useState("home");const [settings,setSettings]=useLocalSettings("pathsense-settings",defaults);
 const [status,setStatus]=useState("");const [location,setLocation]=useState(null);const [target,setTarget]=useState(null);
 const [tracking,setTracking]=useState(false);const [listening,setListening]=useState(false);const [contact,setContact]=useState(()=>localStorage.getItem("pathsense-emergency-phone")||"");
 const [note,setNote]=useState("");
 const [contacts,setContacts]=useState(()=>{try{const x=JSON.parse(localStorage.getItem("pathsense-contacts-v2")||"[]");return Array.isArray(x)?x:[]}catch{return []}});
 const [contactName,setContactName]=useState("");
 const [route,setRoute]=useState(null);
 const [placeName,setPlaceName]=useState("");
 const [routeBusy,setRouteBusy]=useState(false);
 const [routingKey,setRoutingKey]=useState(()=>localStorage.getItem("pathsense-ors-key")||"");
 const lastReroute=useRef(0);const lastInstruction=useRef(-1);
const watch=useRef(null);const recognizer=useRef(null);const lastSpeech=useRef(0);
 const navigate=id=>{setScreen(id);setStatus("");window.scrollTo(0,0)};
 const say=(words,force=false)=>{setStatus(words);if((settings.voiceEnabled||force)&&"speechSynthesis" in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(words);u.lang="en-IN";u.rate=Number(settings.speechRate)||1;window.speechSynthesis.speak(u)}};
 const onPosition=p=>{const pos={lat:p.coords.latitude,lng:p.coords.longitude,accuracy:p.coords.accuracy};setLocation(pos);setStatus(`Location updated. Accuracy approximately ${Math.round(pos.accuracy)} metres.`)};
 const onGpsError=e=>setStatus(({1:"Location permission denied. Allow location access in browser and phone settings.",2:"Location unavailable. Enable location services and retry.",3:"Location timed out. Try outdoors with GPS enabled."})[e.code]||e.message);
 const locate=()=>{if(!window.isSecureContext){setStatus("GPS requires HTTPS or localhost.");return}if(!navigator.geolocation){setStatus("Location is not supported on this device.");return}setStatus("Requesting your location...");navigator.geolocation.getCurrentPosition(p=>{onPosition(p);say("Location received.")},onGpsError,{enableHighAccuracy:true,timeout:20000,maximumAge:5000})};
 const startTracking=()=>{if(!window.isSecureContext){setStatus("GPS tracking requires HTTPS or localhost.");return}if(!navigator.geolocation){setStatus("GPS unavailable.");return}if(watch.current!==null)return;watch.current=navigator.geolocation.watchPosition(p=>{onPosition(p);},onGpsError,{enableHighAccuracy:true,maximumAge:1000,timeout:20000});setTracking(true);say("GPS tracking started. Select a Pune destination and calculate a walking route to hear available directions. Follow your mobility aids and official crossing signals.")};
 const stopTracking=()=>{if(watch.current!==null)navigator.geolocation.clearWatch(watch.current);watch.current=null;setTracking(false);say("Location tracking stopped.")};
 useEffect(()=>()=>{if(watch.current!==null)navigator.geolocation.clearWatch(watch.current);recognizer.current?.abort?.();window.speechSynthesis?.cancel?.()},[]);
 const orientation=()=>{if(!location){say("Get your location first.");return}if(!target){say("Tap the map to select a destination.");return}const d=distanceMeters(location,target),dir=direction(bearing(location,target));say(`Your selected point is approximately ${d} metres ${dir} of your current position, in a straight line. This is not a walking route. Do not use this direction to cross roads or avoid obstacles.`)};
 useEffect(()=>{if(!tracking||!target||!location||Date.now()-lastSpeech.current<30000)return;lastSpeech.current=Date.now();if(route)return;const d=distanceMeters(location,target);if(d<30){say(`You may be near the selected point. Location accuracy is approximately ${Math.round(location.accuracy)} metres.`);return}orientation()},[location,tracking,target]);
 const commands=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){say("Voice commands are not supported in this browser. Spoken announcements may still work.");return}recognizer.current?.abort?.();const r=new SR();recognizer.current=r;r.lang="en-IN";r.interimResults=false;r.onstart=()=>setListening(true);r.onend=()=>setListening(false);r.onerror=e=>setStatus(`Microphone error: ${e.error}`);r.onresult=e=>{const cmd=e.results[0][0].transcript.toLowerCase();if(cmd.includes("emergency")||cmd.includes("sos"))navigate("sos");else if(cmd.includes("camera")||cmd.includes("obstacle"))navigate("camera");else if(cmd.includes("location"))locate();else if(cmd.includes("where")||cmd.includes("direction"))orientation();else if(cmd.includes("map")||cmd.includes("navigation"))navigate("map");else if(cmd.includes("setting"))navigate("settings");else if(cmd.includes("home"))navigate("home");else say(`I heard ${cmd}. Say camera, map, location, direction, emergency, settings or home.`)};try{r.start()}catch(e){setStatus(e.message)}};
 const saveContactsList=(next)=>{setContacts(next);localStorage.setItem("pathsense-contacts-v2",JSON.stringify(next))};
 const addContact=()=>{if(!validPhone(contact)){setStatus("Enter a valid phone number first.");return}const clean=contact.replace(/[\s()-]/g,"");const name=contactName.trim()||"Trusted contact";saveContactsList([...contacts,{id:Date.now(),name,number:clean}]);setContact("");setContactName("");setStatus(`${name} added to trusted contacts.`)};
 const removeContact=id=>{if(window.confirm("Remove this contact?"))saveContactsList(contacts.filter(c=>c.id!==id))};
 const dialNumber=(number,label)=>{if(window.confirm(`Open your phone dialer to call ${label} (${number})?`)){window.location.href=`tel:${number}`}};
 const saveRoutingKey=()=>{localStorage.setItem("pathsense-ors-key",routingKey.trim());setStatus("Routing key saved on this device. Route requests go to OpenRouteService.")};
 const requestRoute=async(origin=location,destination=target,quiet=false)=>{
   if(!origin||!destination){setStatus("First locate yourself and select a destination on the map.");return}
   if(!inPune(origin)||!inPune(destination)){setStatus("Pune-only routing: your current position and selected destination must both be in the Pune area. Your actual GPS position will not be changed.");return}
   const key=routingKey.trim();if(!key){setStatus("Walking routes need an OpenRouteService API key. Enter one below to enable real route instructions.");return}
   setRouteBusy(true);if(!quiet)setStatus("Calculating a walking route…");
   try{const res=await fetch("https://api.openrouteservice.org/v2/directions/foot-walking/geojson",{method:"POST",headers:{"Authorization":key,"Content-Type":"application/json"},body:JSON.stringify({coordinates:[[origin.lng,origin.lat],[destination.lng,destination.lat]],instructions:true})});
     if(!res.ok)throw Error(`Routing service error ${res.status}. Check the API key, network or routing limits.`);
     const data=await res.json();const feature=data.features?.[0];if(!feature?.geometry?.coordinates?.length)throw Error("No walking route was returned.");
     const summary=feature.properties?.summary||{};const steps=(feature.properties?.segments||[]).flatMap(seg=>seg.steps||[]);
     setRoute({points:feature.geometry.coordinates.map(([lng,lat])=>[lat,lng]),steps,meters:summary.distance||0});lastInstruction.current=-1;
     setStatus(`Walking route loaded: approximately ${Math.round(summary.distance||0)} metres. Follow official crossing guidance and your mobility aids.`);
     if(quiet)say("Updated walking route available. Stop safely and review the next instruction.");
     if(!quiet)say(`Walking route calculated. Approximately ${Math.round(summary.distance||0)} metres. ${steps[0]?.instruction||"Review the route before walking."}`);
   }catch(e){setStatus(`Route unavailable: ${e.message}`);setRoute(null)}finally{setRouteBusy(false)}
 };
 const speakRouteStep=()=>{if(!route||!location){say("Calculate a walking route and enable GPS first.");return}
   const steps=route.steps.filter(st=>st.way_points?.length);if(!steps.length){say("No spoken instructions were supplied by the routing service.");return}
   let nearestIndex=0,nearest=Infinity;
   for(let i=0;i<route.points.length;i++){const d=distanceMeters(location,{lat:route.points[i][0],lng:route.points[i][1]});if(d<nearest){nearest=d;nearestIndex=i}}
   if(nearest>50+location.accuracy){say("You may be away from the planned route. Recalculate the route before continuing.");return}
   const next=steps.findIndex(st=>st.way_points[1]>=nearestIndex);const index=next<0?steps.length-1:next;
   const st=steps[index];const end=route.points[st.way_points[1]];const meters=end?distanceMeters(location,{lat:end[0],lng:end[1]}):0;
   say(`${st.instruction}. Approximately ${meters} metres to the next instruction. Check your surroundings and crossings.`);
 };
 const saveContact=()=>{if(!validPhone(contact)){setStatus("Enter a valid phone number including area or country code.");return}localStorage.setItem("pathsense-emergency-phone",contact.trim());setStatus("Trusted contact saved on this phone.")};
 const call=()=>{if(!validPhone(contact)){setStatus("Save a valid contact number first.");return}if(window.confirm(`Open phone dialer for ${contact}?`))window.location.href=`tel:${contact.replace(/[\s()-]/g,"")}`};
 const emergencyText=()=>`I need assistance. ${note?note+'. ':''}${location?`My approximate location: https://www.google.com/maps?q=${location.lat},${location.lng} (accuracy about ${Math.round(location.accuracy)} metres).`:"I could not obtain my location."}`;
 const share=async()=>{const message=emergencyText();try{if(navigator.share)await navigator.share({text:message});else if(navigator.clipboard){await navigator.clipboard.writeText(message);setStatus("Message copied. Paste it into SMS and send it.")}else setStatus(message)}catch(e){if(e.name!=="AbortError")setStatus("Could not share. Try SMS or calling.")}};
 useEffect(()=>{if(!tracking||!route||!location||!target)return;
   const now=Date.now();if(now-lastReroute.current<45000)return;
   let nearest=Infinity;for(const [lat,lng] of route.points){nearest=Math.min(nearest,distanceMeters(location,{lat,lng}))}
   if(location.accuracy>60){setStatus("GPS accuracy is too low for reliable route-change guidance. Move to an open area and wait for a better fix.");return}
   const threshold=Math.max(40,location.accuracy*1.8);
   if(nearest>threshold){lastReroute.current=now;say("You may have left the planned route. Stop somewhere safe while PathSense attempts to recalculate. Do not change direction based only on this alert.");requestRoute(location,target,true);return}
   const steps=route.steps.filter(st=>st.way_points?.length);let nearestIndex=0,nearestPoint=Infinity;
   route.points.forEach(([lat,lng],i)=>{const d=distanceMeters(location,{lat,lng});if(d<nearestPoint){nearestPoint=d;nearestIndex=i}});
   const idx=steps.findIndex(st=>st.way_points[1]>=nearestIndex);const next=idx<0?steps.length-1:idx;
   if(next>=0&&next!==lastInstruction.current){lastInstruction.current=next;const st=steps[next];say(`${st.instruction}. Confirm road crossings and obstacles independently.`)}
 },[location,tracking,route,target]);
 const choosePunePlace=(name)=>{const p=PUNE_PLACES.find(x=>x.name===name);setPlaceName(name);if(p){setTarget({lat:p.lat,lng:p.lng});setRoute(null);lastInstruction.current=-1;setStatus(`${name} selected in Pune. Tap Calculate Walking Route.`)}};
 const chooseMapPoint=p=>{if(!inPune(p)){setStatus("Only Pune-area destinations are supported. Choose a point within Pune.");return}setPlaceName("");setTarget(p);setRoute(null);lastInstruction.current=-1;setStatus("Pune destination selected. Calculate a walking route to begin guidance.")};
 const sms=()=>{if(!validPhone(contact)){setStatus("Enter a valid trusted contact number first.");return}window.location.href=`sms:${contact.replace(/[\s()-]/g,"")}?body=${encodeURIComponent(emergencyText())}`};
 return <div className="mobile-app"><header className="mobile-header"><button className="brand" onClick={()=>navigate("home")} aria-label="PathSense home"><span className="brand-dot">●</span> PathSense</button><span className="header-tag">WALKING ASSISTANCE</span></header><main className="mobile-main">
 {screen==="home"&&<section className="home-screen"><div className="eyebrow">SMART ACCESSIBILITY</div><h1>A Safer Step<br/><em>for Everyone</em></h1><p>Camera recognition, spoken assistance and emergency contact options, designed for your phone.</p><div className="home-visual" role="img" aria-label="Two people walking along a leafy city street, including a pedestrian using a white cane"><img src={homeArt} alt="" /></div><button className="solid big" onClick={()=>navigate("features")}>Get Started →</button><p className="fine">Experimental support only. Continue using your usual mobility aids.</p></section>}
 {screen==="features"&&<section><div className="eyebrow">EXPLORE PATHSENSE</div><h1>Assistance tools</h1><p className="intro">Tap a feature to use it.</p><div className="feature-grid"><Feature icon={Camera} title="Obstacle Tracking" subtitle="Camera object recognition" onClick={()=>navigate("camera")}/><Feature icon={MapPin} title="Map & Location" subtitle="Pune destinations and GPS" onClick={()=>navigate("map")}/><Feature icon={Volume2} title="Voice Assistance" subtitle="Speech and commands" onClick={()=>navigate("voice")}/><Feature icon={Settings} title="Accessibility" subtitle="Voice and alert settings" onClick={()=>navigate("settings")}/><Feature icon={Siren} title="Emergency SOS" subtitle="Call or share location" onClick={()=>navigate("sos")}/></div></section>}
 {screen==="camera"&&<section><button className="back" onClick={()=>navigate("features")}><ArrowLeft size={18}/> Features</button><h1>Obstacle tracking</h1><p className="intro">Recognizes certain objects. Does not measure distance or identify safe walking paths.</p><DetectionScreen settings={settings} onBack={()=>navigate("features")} onSettings={()=>navigate("settings")}/></section>}
 {screen==="map"&&<section><div className="eyebrow">LOCATION ASSISTANCE</div><h1>Pune navigation</h1><p className="intro">Choose a Pune destination or tap within Pune on the map. Actual GPS location is never replaced with a preset.</p><label className="field-label" htmlFor="pune-place">Pune destination</label><select id="pune-place" value={placeName} onChange={e=>choosePunePlace(e.target.value)}><option value="">Choose a Pune location</option>{PUNE_PLACES.map(p=><option key={p.name} value={p.name}>{p.name}</option>)}</select><div className="map-actions"><button className="solid" onClick={locate}><LocateFixed size={18}/> Find Me</button><button className="outline" onClick={tracking?stopTracking:startTracking}>{tracking?<Square size={18}/>:<Play size={18}/>} {tracking?"Stop GPS":"Track GPS"}</button></div><MapView location={location} target={target} route={route} onTarget={chooseMapPoint}/><div className="info-box" role="status">{location?`Position: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)} · ±${Math.round(location.accuracy)} m`:"Tap Find Me to request your location."}{target&&location?` · Selected point ~${distanceMeters(location,target)} m away (straight line).`:""}</div><label className="field-label" htmlFor="routingKey">OpenRouteService API key (required for walking routes)</label><input id="routingKey" type="password" autoComplete="off" value={routingKey} onChange={e=>setRoutingKey(e.target.value)} placeholder="Paste your routing API key"/><button className="outline full" onClick={saveRoutingKey}>Save Routing Key</button>
 <button className="solid full" disabled={routeBusy} onClick={()=>requestRoute()}><Navigation size={18}/>{routeBusy?"Calculating…":"Calculate Walking Route"}</button>
 {route&&<div className="route-card"><strong>Walking route: {Math.round(route.meters)} m</strong><p>{route.steps.length} navigation instructions available</p><button className="solid full" onClick={speakRouteStep}><Volume2 size={18}/> Speak Next Route Instruction</button><button className="outline full" onClick={tracking?stopTracking:startTracking}>{tracking?"Stop Live Route Guidance":"Start Live Route Guidance"}</button><ol className="route-steps">{route.steps.map((st,i)=><li key={i}>{st.instruction} ({Math.round(st.distance||0)} m)</li>)}</ol></div>}<button className="outline full" onClick={()=>{setTarget(null);setPlaceName("");setRoute(null);setStatus("Destination cleared.")}}>Clear Destination</button><p className="fine">Map tiles require internet. Walking route instructions are provided by an external routing service only when a valid API key is configured. Routes may be inaccurate or inaccessible; never rely on them for crossing decisions or obstacle avoidance.</p></section>}
 {screen==="voice"&&<section><div className="eyebrow">AUDIO ASSISTANCE</div><h1>Voice assistant</h1><p className="intro">Speak a command or hear location information.</p><div className="voice-orb"><Mic size={48}/><span>{listening?"Listening…":"Ready to listen"}</span></div><button className="solid big" onClick={commands}><Mic size={18}/> {listening?"Listening…":"Start Voice Command"}</button><button className="outline big" onClick={()=>say("PathSense is ready. Say camera, map, location, direction, settings, home or emergency.",true)}><Volume2 size={18}/> Hear Available Commands</button><button className="outline big" onClick={speakRouteStep}><Compass size={18}/> Speak Next Walking Instruction</button><button className="outline big" onClick={()=>{if(navigator.vibrate){navigator.vibrate([180,120,180]);setStatus("Vibration requested.")}else setStatus("Vibration not supported on this device.")}}>Test Vibration</button><p className="fine">Speech recognition support varies by Android browser and may require an internet connection.</p></section>}
 {screen==="settings"&&<section><div className="eyebrow">YOUR PREFERENCES</div><h1>Accessibility settings</h1><div className="settings-frame"><SettingsScreen settings={settings} setSettings={setSettings} onBack={()=>navigate("features")}/></div></section>}
 {screen==="sos"&&<section><div className="eyebrow">EMERGENCY ASSISTANCE · INDIA</div><h1>Emergency SOS</h1><p className="intro">In immediate danger, call India's national emergency number. Calling requires a phone and your confirmation.</p>
 <button className="sos-orb" onClick={()=>dialNumber("112","National emergency") } aria-label="Call national emergency number 112">112<span>EMERGENCY CALL</span></button>
 <h2 className="sos-heading">Emergency helplines</h2><div className="emergency-grid">{emergencyNumbers.map(item=><button className="emergency-item" key={item.number} onClick={()=>dialNumber(item.number,item.name)}><span><strong>{item.name}</strong><small>{item.detail}</small></span><b><Phone size={15}/>{item.number}</b></button>)}</div>
 <h2 className="sos-heading">Trusted contacts</h2><p className="intro">Add contacts on this device. Their names and phone numbers are saved locally.</p>
 <label className="field-label" htmlFor="trustedName">Contact name</label><input id="trustedName" value={contactName} onChange={e=>setContactName(e.target.value)} placeholder="e.g. Family member"/>
 <label className="field-label" htmlFor="trusted">Contact phone number</label><input id="trusted" type="tel" value={contact} onChange={e=>setContact(e.target.value)} placeholder="+91 9876543210"/>
 <button className="solid full" onClick={addContact}><Save size={18}/> Add Trusted Contact</button>
 {contacts.length===0&&<p className="fine">No trusted contacts saved yet.</p>}
 <div className="contact-list">{contacts.map(c=><div className="contact-row" key={c.id}><span><strong>{c.name}</strong><small>{c.number}</small></span><button className="solid" onClick={()=>dialNumber(c.number,c.name)}><Phone size={17}/> Call</button><button className="outline" aria-label={`Remove ${c.name}`} onClick={()=>removeContact(c.id)}><X size={18}/></button></div>)}</div>
 <label className="field-label" htmlFor="note">Optional emergency message</label><input id="note" value={note} onChange={e=>setNote(e.target.value)} placeholder="I need assistance"/>
 {contacts.length>0&&<><label className="field-label" htmlFor="smsContact">Choose a contact for SMS</label><select id="smsContact" value={contact} onChange={e=>setContact(e.target.value)}><option value="">Select contact</option>{contacts.map(c=><option key={c.id} value={c.number}>{c.name} — {c.number}</option>)}</select></>}
 <button className="outline full" onClick={sms}><Share2 size={18}/> Prepare SMS to Selected Contact</button>
 <button className="outline full" onClick={share}><Share2 size={18}/> Share Emergency Location Message</button>
 <button className="outline full" onClick={locate}><LocateFixed size={18}/> Update Location for Emergency Message</button>
 <p className="fine">Calls and messages are not automatically sent. Availability of specific helplines varies by location; 112 is the nationwide emergency number. The application cannot guarantee delivery or dispatch.</p></section>}
 {status&&<div className="live-status" role="status" aria-live="polite">{status}</div>}
 </main><nav className="bottom-tabs" aria-label="App navigation">{tabs.map(({id,label,icon:Icon})=><button key={id} className={screen===id?"active":""} onClick={()=>navigate(id)} aria-current={screen===id?"page":undefined}><Icon size={22}/><span>{label}</span></button>)}</nav></div>
}
function Feature({icon:Icon,title,subtitle,onClick}){return <button className="feature-card" onClick={onClick}><span className="feature-icon"><Icon size={25}/></span><strong>{title}</strong><small>{subtitle}</small><span className="open-feature">Open →</span></button>}
function MapView({location,target,route,onTarget}){const node=useRef(null),map=useRef(null),marker=useRef(null),destination=useRef(null),routeLine=useRef(null),Lref=useRef(null);const [error,setError]=useState("");useEffect(()=>{let disposed=false;let timer;async function setup(){try{const L=await import("leaflet");await import("leaflet/dist/leaflet.css");if(disposed||!node.current)return;Lref.current=L;const m=L.map(node.current,{zoomControl:true,attributionControl:true}).setView([PUNE_CENTER.lat,PUNE_CENTER.lng],12);map.current=m;L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(m);m.setMaxBounds([[18.39,73.67],[18.68,74.03]]);m.on("click",e=>onTarget({lat:e.latlng.lat,lng:e.latlng.lng}));timer=setTimeout(()=>m.invalidateSize(),120)}catch(e){setError("Map could not load. Install Leaflet and check your internet connection.")}}setup();return()=>{disposed=true;clearTimeout(timer);map.current?.remove();map.current=null}},[]);useEffect(()=>{const L=Lref.current,m=map.current;if(!L||!m||!location)return;marker.current?.remove();marker.current=L.circleMarker([location.lat,location.lng],{radius:9,color:"#fff",weight:3,fillColor:"#149d86",fillOpacity:1}).addTo(m).bindPopup("Approximate current position");if(inPune(location))m.setView([location.lat,location.lng],Math.max(m.getZoom(),16))},[location]);useEffect(()=>{const L=Lref.current,m=map.current;if(!L||!m)return;destination.current?.remove();destination.current=null;if(target)destination.current=L.circleMarker([target.lat,target.lng],{radius:9,color:"#fff",weight:3,fillColor:"#f25d65",fillOpacity:1}).addTo(m).bindPopup("Selected point")},[target]);useEffect(()=>{const L=Lref.current,m=map.current;if(!L||!m)return;routeLine.current?.remove();routeLine.current=null;if(route?.points?.length){routeLine.current=L.polyline(route.points,{color:"#147d72",weight:6,opacity:.85}).addTo(m);m.fitBounds(routeLine.current.getBounds(),{padding:[22,22]})}},[route]);return <div className="map-frame">{error?<div className="map-error">{error}</div>:<div ref={node} className="map-canvas" aria-label="Interactive OpenStreetMap. Tap to select a point."/>}</div>}
