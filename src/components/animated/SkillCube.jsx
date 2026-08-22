import React, { useEffect, useRef } from "react";

const THEME = {
  bg: "#0a0a0f",
  surface: "#12121a",
  primary: "#7c3aed",
  secondary: "#06b6d4",
  glow: "#a78bfa",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  danger: "#f43f5e",
};

const FACES = [
  {
    key: "front",
    label: "lang",
    name: "Python",
    color: THEME.glow,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    key: "right",
    label: "data",
    name: "SQL",
    color: THEME.secondary,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    key: "back",
    label: "lang",
    name: "C++",
    color: THEME.textPrimary,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
  {
    key: "left",
    label: "web",
    name: "JavaScript",
    color: THEME.glow,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    key: "top",
    label: "ai",
    name: "ML / AI",
    color: THEME.secondary,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  {
    key: "bottom",
    label: "ui",
    name: "React",
    color: THEME.textPrimary,
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
];

const STYLE_ID = "skillcube-global-styles";

function useGlobalStyles() {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(fontLink);

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html, body, #root { height: 100%; }
      body { margin: 0; background: ${THEME.bg}; }
      @keyframes sc-glow-pulse {
        0%, 100% { box-shadow: inset 0 0 24px rgba(167,139,250,0.10), 0 0 18px rgba(124,58,237,0.18); }
        50%      { box-shadow: inset 0 0 40px rgba(167,139,250,0.32), 0 0 34px rgba(124,58,237,0.42); }
      }
      @keyframes skillcube-spin {
        from { transform: rotateX(-18deg) rotateY(0deg); }
        to   { transform: rotateX(-18deg) rotateY(360deg); }
      }
      .skillcube-box--spinning {
        animation: skillcube-spin 20s linear infinite;
      }
      @media (max-width: 768px) {
        .skillcube-box--spinning {
          animation-duration: 30s;
        }
        .skillcube-face {
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          background: rgba(18, 18, 26, 0.95);
        }
      }
      .skillcube-face {
        background: rgba(18, 18, 26, 0.95);
      }
    `;
    document.head.appendChild(style);
  }, []);
}

function SkillCube({ size = 200 }) {
  useGlobalStyles();

  const half = size / 2;
  const boxRef = useRef(null);
  const rotRef = useRef({ x: -18, y: 24 });
  const drag = useRef({ active: false, lastX: 0, lastY: 0 });

  const applyRotation = () => {
    if (!boxRef.current) return;
    boxRef.current.style.transform = `rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg)`;
  };

  useEffect(() => {
    const isNarrow = typeof window !== 'undefined' && window.innerWidth <= 768;
    const spinDuration = isNarrow ? 30000 : 20000; // ms

    // Helper: extract Y rotation (degrees) from element's transform matrix
    const getYRotation = (el) => {
      const style = window.getComputedStyle(el);
      const matrix = style.transform;
      if (matrix === 'none') return 0;
      // matrix3d(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
      // For rotateX(rx) rotateY(ry): we can extract ry from the matrix
      const values = matrix.match(/matrix3d?\(([^)]+)\)/);
      if (!values) return 0;
      const nums = values[1].split(',').map(Number);
      if (nums.length === 16) {
        // matrix3d: [0]=m11, [1]=m12, [2]=m13, [4]=m21, [5]=m22, [6]=m23, [8]=m31, [9]=m32, [10]=m33
        // rotateY(ry): m11=cos(ry), m13=-sin(ry), m31=sin(ry), m33=cos(ry)
        const ry = Math.atan2(nums[8], nums[10]) * (180 / Math.PI);
        return ry;
      } else if (nums.length === 6) {
        // 2D matrix - shouldn't happen for 3D
        return 0;
      }
      return 0;
    };

    // Start CSS animation
    if (boxRef.current) {
      boxRef.current.style.animation = `skillcube-spin ${isNarrow ? '30s' : '20s'} linear infinite`;
    }

    const onMove = (e) => {
      if (!drag.current.active) return;
      const point = e.touches ? e.touches[0] : e;
      const dx = point.clientX - drag.current.lastX;
      const dy = point.clientY - drag.current.lastY;
      drag.current.lastX = point.clientX;
      drag.current.lastY = point.clientY;
      rotRef.current = {
        x: rotRef.current.x - dy * 0.4,
        y: rotRef.current.y + dx * 0.4,
      };
      applyRotation();
    };

    const onUp = () => {
      drag.current.active = false;
      document.body.style.userSelect = "";

      // Resume CSS animation from current rotation
      if (boxRef.current) {
        const currentY = getYRotation(boxRef.current);
        const progress = ((currentY % 360) + 360) % 360 / 360; // 0-1
        const delay = -progress * spinDuration; // negative delay jumps into animation
        boxRef.current.style.animation = `skillcube-spin ${spinDuration}ms linear infinite`;
        boxRef.current.style.animationDelay = `${delay}ms`;
        boxRef.current.style.animationPlayState = 'running';
      }
    };

    const onDown = () => {
      drag.current.active = true;
      document.body.style.userSelect = "none";
      // Pause CSS animation during drag
      if (boxRef.current) {
        boxRef.current.style.animation = 'none';
      }
    };

    const onVisibilityChange = () => {
      if (boxRef.current) {
        boxRef.current.style.animationPlayState = document.hidden ? 'paused' : 'running';
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    window.addEventListener("touchstart", onDown, { passive: true });

    applyRotation();

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("touchstart", onDown);
    };
  }, []);

  const faceTransforms = {
    front: `rotateY(0deg) translateZ(${half}px)`,
    right: `rotateY(90deg) translateZ(${half}px)`,
    back: `rotateY(180deg) translateZ(${half}px)`,
    left: `rotateY(-90deg) translateZ(${half}px)`,
    top: `rotateX(90deg) translateZ(${half}px)`,
    bottom: `rotateX(-90deg) translateZ(${half}px)`,
  };

  return (
    <div
      style={{
        perspective: "900px",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "grab",
        touchAction: "none",
      }}
    >
      <div
        ref={boxRef}
        className="skillcube-box--spinning"
        style={{
          width: size,
          height: size,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: "rotateX(-18deg) rotateY(24deg)",
          willChange: "transform",
        }}
      >
        {FACES.map((face, i) => (
          <div
            key={face.key}
            className="skillcube-face"
            style={{
              position: "absolute",
              width: size,
              height: size,
              transform: faceTransforms[face.key],
              background: "rgba(18, 18, 26, 0.78)",
              border: "1px solid #7c3aed30",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              animation: "sc-glow-pulse 4s ease-in-out infinite",
              animationDelay: `${i * 0.66}s`,
              overflow: "hidden",
            }}
          >
            <img
              src={face.logo}
              alt={face.name + " logo"}
              crossOrigin="anonymous"
              draggable={false}
              style={{
                width: 52,
                height: 52,
                objectFit: "contain",
                filter: `drop-shadow(0 0 12px ${face.color}66)`,
                pointerEvents: "none",
              }}
            />

            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "-0.02em",
                color: face.color,
                textShadow: `0 0 18px ${face.color}55`,
                textAlign: "center",
                padding: "0 12px",
              }}
            >
              {face.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  useGlobalStyles();
  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        background: THEME.bg,
        color: THEME.textPrimary,
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 56,
        overflow: "hidden",
      }}
    >
      <header style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: THEME.secondary,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontSize: 12,
            margin: 0,
          }}
        >
          {"// skills"}
        </p>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            fontSize: 40,
            margin: "12px 0 0",
          }}
        >
          Things I build with
        </h1>
      </header>

      <SkillCube size={200} />

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          color: THEME.textSecondary,
          fontSize: 14,
          margin: 0,
        }}
      >
        Drag the cube to rotate
      </p>
    </main>
  );
}

export { SkillCube };
