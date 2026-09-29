"use client";

const COLORS = ["#ffcb2e", "#ff5a5a", "#4ac6ff", "#6ce07a", "#c77dff", "#ffffff"];

// Explosion depuis le centre : angle d'or pour répartir les morceaux sans Math.random
// (le rendu serveur et le rendu client doivent être identiques).
const BITS = Array.from({ length: 70 }, (_, i) => {
  const angle = (i * 137.5 * Math.PI) / 180;
  const dist = 16 + ((i * 29) % 28);
  return {
    x: Math.cos(angle) * dist,        // vw
    y: Math.sin(angle) * dist * 0.8,  // vh
    rot: ((i * 47) % 360) + 180,
    color: COLORS[i % COLORS.length],
    duration: 1.5 + ((i * 11) % 11) / 10,
    delay: ((i * 7) % 5) / 25,
  };
});

export default function Confetti() {
  return (
    <div className="confetti" aria-hidden>
      {BITS.map((b, i) => (
        <i
          key={i}
          style={{
            background: b.color,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            ["--x" as string]: `${b.x.toFixed(1)}vw`,
            ["--y" as string]: `${b.y.toFixed(1)}vh`,
            ["--r" as string]: `${b.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}
