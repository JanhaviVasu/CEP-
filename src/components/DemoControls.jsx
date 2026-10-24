import { demoObstacles } from "../services/obstacleDetection";

export default function DemoControls({ onSelect }) {
  const names = ["Path Clear", "Person", "Vehicle", "Chair", "Wall", "Pothole", "Stairs"];
  return (
    <section className="demo-panel">
      <div className="section-title"><span>DEMO MODE</span><small>Presentation controls</small></div>
      <div className="demo-grid">
        {names.map(name => {
          const obstacle = demoObstacles.find(x => x.type === name);
          return <button key={name} onClick={() => onSelect(obstacle)}>{name}</button>;
        })}
      </div>
    </section>
  );
}