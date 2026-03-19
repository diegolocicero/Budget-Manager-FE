import { motion } from "framer-motion";

interface CirclePos {
  x: string;
  y: string;
  size: number;
}

interface BackgroundProps {
  positions: CirclePos[];
}

export default function BackgroundCircles({ positions }: BackgroundProps) {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          animate={{ 
            x: pos.x, 
            y: pos.y 
          }}
          transition={{ 
            duration: 1.5, 
            ease: [0.22, 1, 0.36, 1] // EaseOutQuart per un movimento ultra-soft
          }}
          style={{
            position: 'absolute',
            width: pos.size,
            height: pos.size,
            borderRadius: '50%',
            backgroundColor: '#493979',
            filter: 'blur(60px)',
            opacity: 0.7
          }}
        />
      ))}
    </div>
  );
}