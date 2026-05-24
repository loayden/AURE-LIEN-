import { loadFont } from "@remotion/google-fonts/Cairo";
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_SECONDS = 22;
export const DURATION_IN_FRAMES = DURATION_SECONDS * FPS;

const { fontFamily } = loadFont("normal", {
  weights: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["arabic", "latin"],
});

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const sharpEase = Easing.bezier(0.22, 1, 0.36, 1);
const snapEase = Easing.bezier(0.7, 0, 0.12, 1);

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const sec = (seconds: number) => Math.round(seconds * FPS);
const cx = WIDTH / 2;

const interp = (
  frame: number,
  input: number[],
  output: number[],
  easing: ((input: number) => number) | undefined = easeOut
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

const ASSETS = {
  mall: "uploads/homepage.jpg",
  street: "uploads/look2.jpg",
  elegant: "uploads/look3.jpg",
  casual: "uploads/look1.jpg",
  night: "uploads/collections.jpg",
  beach: "uploads/main.jpg",
  store: "uploads/boutique-storefront-home.webp",
  logo: "logo.png",
  audio: "audio/boutique-reel-bed.wav",
};

const outfitCombos = [
  {
    label: "Streetwear",
    arabic: "ستريت وير",
    image: "uploads/look2.jpg",
    accent: "#00D1B2",
    pieces: ["Wide-leg pants", "Mini bag", "Clean sneakers"],
  },
  {
    label: "Elegant",
    arabic: "أنيق",
    image: "uploads/look3.jpg",
    accent: "#D9B46B",
    pieces: ["Cream suit", "Gold earrings", "Soft heel"],
  },
  {
    label: "Uni casual",
    arabic: "جامعة",
    image: "uploads/look1.jpg",
    accent: "#B8D7FF",
    pieces: ["Chunky knit", "Relaxed denim", "Daily tote"],
  },
  {
    label: "Night-out",
    arabic: "خروجة",
    image: "uploads/collections.jpg",
    accent: "#F05B8F",
    pieces: ["Black layers", "Statement bag", "Sharp boot"],
  },
];

const brandTiles = [
  { name: "Cairo Studio", area: "Zamalek", image: "uploads/Suits.jpg" },
  { name: "Nile Streetwear", area: "New Cairo", image: "uploads/Jackets & Coats.jpg" },
  { name: "Maadi Edit", area: "Maadi", image: "uploads/Knitwear.jpg" },
  { name: "Alex Nights", area: "Alexandria", image: "uploads/accessories.jpg" },
];

const productTiles = [
  { label: "Jacket", image: "uploads/teddy-jacket-cream.jpg", price: "EGP 799" },
  { label: "Denim", image: "uploads/Medium Wash Cargo Denim Jeans.jpg", price: "EGP 680" },
  { label: "Sneakers", image: "uploads/Sneakers.jpg", price: "EGP 920" },
  { label: "Bag", image: "uploads/Bags & Wallets.jpg", price: "EGP 490" },
];

function CinematicImage({
  src,
  scale = 1,
  x = 0,
  y = 0,
  rotate = 0,
  opacity = 1,
  brightness = 1,
  contrast = 1,
  saturate = 1,
  blur = 0,
  objectPosition = "center",
}: {
  src: string;
  scale?: number;
  x?: number;
  y?: number;
  rotate?: number;
  opacity?: number;
  brightness?: number;
  contrast?: number;
  saturate?: number;
  blur?: number;
  objectPosition?: string;
}) {
  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`,
          filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturate}) blur(${blur}px)`,
        }}
      />
    </AbsoluteFill>
  );
}

function FilmGrain({ frame }: { frame: number }) {
  const opacity = 0.055 + (frame % 5) * 0.006;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        mixBlendMode: "overlay",
        backgroundImage:
          "radial-gradient(circle at 18% 12%, rgba(255,255,255,0.42) 0 1px, transparent 1px), radial-gradient(circle at 71% 38%, rgba(0,0,0,0.35) 0 1px, transparent 1px), radial-gradient(circle at 34% 78%, rgba(255,255,255,0.28) 0 1px, transparent 1px)",
        backgroundSize: "17px 19px, 23px 29px, 31px 37px",
        transform: `translate(${frame % 3}px, ${-(frame % 4)}px)`,
      }}
    />
  );
}

function Vignette({ strength = 0.8 }: { strength?: number }) {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(circle at 50% 42%, transparent 0%, rgba(0,0,0,0.06) 42%, rgba(0,0,0,${strength}) 100%)`,
      }}
    />
  );
}

function TransitionFlashes({ frame }: { frame: number }) {
  const cuts = [sec(3), sec(6), sec(10), sec(14), sec(18)];
  const intensity = cuts.reduce((max, cut) => Math.max(max, clamp(1 - Math.abs(frame - cut) / 7)), 0);
  const wipeX = interp(intensity, [0, 1], [-WIDTH, WIDTH], snapEase);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: intensity }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255, 244, 218, 0.78)",
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: wipeX - 180,
          width: 220,
          transform: "skewX(-13deg)",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.92), transparent)",
        }}
      />
    </AbsoluteFill>
  );
}

function BeatBars({ frame, color = "rgba(255,255,255,0.9)" }: { frame: number; color?: string }) {
  const pulse = clamp(1 - (frame % 15) / 15);
  const width = 22 + pulse * 34;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width,
          background: color,
          opacity: pulse * 0.16,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width,
          background: color,
          opacity: pulse * 0.16,
        }}
      />
    </>
  );
}

function Kicker({ children, color = "#E9D7B1" }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        border: `1px solid ${color}55`,
        borderRadius: 999,
        padding: "10px 18px",
        color,
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        background: "rgba(16,14,12,0.46)",
        backdropFilter: "blur(18px)",
      }}
    >
      {children}
    </div>
  );
}

function Headline({
  frame,
  children,
  top,
  bottom,
  maxWidth = 900,
  align = "left",
  delay = 0,
  size = 82,
}: {
  frame: number;
  children: React.ReactNode;
  top?: number;
  bottom?: number;
  maxWidth?: number;
  align?: "left" | "center";
  delay?: number;
  size?: number;
}) {
  const local = frame - delay;
  const opacity = interp(local, [0, 12], [0, 1]);
  const y = interp(local, [0, 16], [36, 0], sharpEase);

  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? (WIDTH - maxWidth) / 2 : 76,
        right: align === "center" ? (WIDTH - maxWidth) / 2 : undefined,
        top,
        bottom,
        maxWidth,
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: align,
      }}
    >
      <div
        style={{
          color: "#FFF7E8",
          fontSize: size,
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: 0,
          textShadow: "0 20px 60px rgba(0,0,0,0.46)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ArabicLine({ children, frame, delay = 0 }: { children: React.ReactNode; frame: number; delay?: number }) {
  const local = frame - delay;
  return (
    <div
      dir="rtl"
      style={{
        marginTop: 18,
        opacity: interp(local, [0, 12], [0, 1]),
        color: "#F3D28E",
        fontSize: 34,
        fontWeight: 700,
        lineHeight: 1.25,
      }}
    >
      {children}
    </div>
  );
}

function CrowdSilhouette({
  frame,
  index,
  reverse = false,
}: {
  frame: number;
  index: number;
  reverse?: boolean;
}) {
  const speed = 5.7 + index * 0.82;
  const raw = (frame * speed + index * 172) % (WIDTH + 360);
  const x = reverse ? WIDTH + 170 - raw : raw - 180;
  const bump = Math.sin(frame * 0.42 + index) * 10;
  const height = 470 + (index % 4) * 95;
  const opacity = 0.18 + (index % 3) * 0.06;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: 170 + (index % 3) * 70 + bump,
        width: 94 + (index % 3) * 24,
        height,
        borderRadius: "999px 999px 40px 40px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.48), rgba(14,13,12,0.72))",
        filter: "blur(10px)",
        opacity,
        transform: `rotate(${(index % 2 ? -1 : 1) * 5}deg)`,
      }}
    />
  );
}

function ShoppingBag({ frame, x, y, color, delay = 0 }: { frame: number; x: number; y: number; color: string; delay?: number }) {
  const local = frame - delay;
  const swing = Math.sin(local * 0.24) * 8;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 128,
        height: 158,
        transform: `rotate(${swing}deg) translateY(${Math.sin(local * 0.3) * 6}px)`,
        transformOrigin: "50% 0%",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 31,
          top: -30,
          width: 66,
          height: 56,
          border: "8px solid rgba(255,255,255,0.78)",
          borderBottom: 0,
          borderRadius: "46px 46px 0 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          background: color,
          boxShadow: "0 22px 50px rgba(0,0,0,0.36)",
          border: "2px solid rgba(255,255,255,0.38)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "22px 20px auto",
          height: 2,
          background: "rgba(255,255,255,0.52)",
        }}
      />
    </div>
  );
}

function HookScene() {
  const frame = useCurrentFrame();
  const chaos = interp(frame, [0, 68, sec(3)], [1, 1, 0.2]);
  const cut = Math.floor(frame / 7);
  const shake = chaos * (Math.sin(frame * 1.9) * 14 + Math.sin(frame * 0.57) * 8);
  const zoomPunch = cut % 2 === 0 ? 0.055 : -0.012;
  const titlePunch = clamp(1 - Math.abs((frame % 15) - 2) / 8) * 0.045;

  return (
    <AbsoluteFill style={{ background: "#090806" }}>
      <CinematicImage
        src={ASSETS.mall}
        scale={1.46 + zoomPunch + interp(frame, [0, sec(3)], [0.08, 0])}
        x={shake}
        y={-80 + Math.sin(frame * 0.8) * 14}
        brightness={0.5}
        contrast={1.22}
        saturate={0.72}
        blur={chaos * 1.4}
        objectPosition="center"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.22), rgba(0,0,0,0.05) 34%, rgba(0,0,0,0.92) 100%)",
        }}
      />
      {Array.from({ length: 11 }).map((_, index) => (
        <CrowdSilhouette key={index} frame={frame} index={index} reverse={index % 2 === 0} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 122 + shake * 0.35,
          top: 268 + Math.sin(frame * 0.38) * 12,
          width: 690,
          height: 940,
          overflow: "hidden",
          borderRadius: 42,
          border: "4px solid rgba(255,255,255,0.2)",
          boxShadow: "0 42px 90px rgba(0,0,0,0.46)",
          transform: `rotate(${-4 + Math.sin(frame * 0.28) * 1.8}deg) scale(${1 + titlePunch})`,
        }}
      >
        <CinematicImage
          src={ASSETS.street}
          scale={1.18}
          x={-20}
          y={60}
          brightness={0.74}
          contrast={1.24}
          saturate={0.8}
          blur={cut % 3 === 0 ? 1.1 : 0}
          objectPosition="center"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.62))",
          }}
        />
      </div>
      <ShoppingBag frame={frame} x={92 + shake * 0.22} y={1035} color="linear-gradient(135deg, #F6E4BD, #9A7031)" />
      <ShoppingBag frame={frame} x={798 - shake * 0.12} y={1000} color="linear-gradient(135deg, #15120F, #6B5641)" delay={9} />
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 92,
          display: "flex",
          gap: 12,
          alignItems: "center",
          opacity: interp(frame, [0, 8], [0, 1]),
        }}
      >
        <Kicker color="#FF6D6D">Mall panic</Kicker>
        <div
          style={{
            color: "#FFF7E8",
            borderRadius: 999,
            padding: "10px 16px",
            background: "rgba(255,255,255,0.11)",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          41 min in
        </div>
      </div>
      <Headline frame={frame} top={1320} size={86} maxWidth={940}>
        Still wasting <span style={{ color: "#FF6D6D" }}>HOURS</span> in malls for one outfit?
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 76,
          bottom: 110,
          display: "flex",
          gap: 12,
          opacity: interp(frame, [18, 34], [0, 1]),
        }}
      >
        {["QUEUE", "CROWDS", "NO SIZE"].map((label, index) => (
          <div
            key={label}
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: "rgba(255,109,109,0.18)",
              border: "1px solid rgba(255,109,109,0.42)",
              color: "#FFE6E6",
              fontSize: 24,
              fontWeight: 800,
              transform: `translateY(${Math.sin(frame * 0.4 + index) * 6}px)`,
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <BeatBars frame={frame} color="rgba(255,109,109,0.92)" />
      <Vignette strength={0.92} />
    </AbsoluteFill>
  );
}

function ProductPhoneCard({ item, index, frame }: { item: (typeof productTiles)[number]; index: number; frame: number }) {
  const pop = spring({
    frame: frame - index * 5,
    fps: FPS,
    config: { damping: 16, stiffness: 140, mass: 0.7 },
  });

  return (
    <div
      style={{
        flex: "0 0 236px",
        height: 360,
        borderRadius: 26,
        overflow: "hidden",
        background: "#F8F2E8",
        boxShadow: "0 18px 34px rgba(25,20,15,0.12)",
        transform: `translateY(${(1 - pop) * 28}px) scale(${0.94 + pop * 0.06})`,
        opacity: clamp(pop),
      }}
    >
      <div style={{ position: "relative", width: "100%", height: 242, overflow: "hidden" }}>
        <Img
          src={staticFile(item.image)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ fontSize: 21, fontWeight: 800, color: "#181512" }}>{item.label}</div>
        <div style={{ marginTop: 7, fontSize: 18, fontWeight: 700, color: "#9A7031" }}>{item.price}</div>
      </div>
    </div>
  );
}

function PhoneMock({ frame, compact = false }: { frame: number; compact?: boolean }) {
  const scroll = compact ? 0 : interp(frame, [12, 72], [0, -375], sharpEase);
  const glow = 0.34 + Math.sin(frame * 0.12) * 0.12;

  return (
    <div
      style={{
        width: compact ? 520 : 630,
        height: compact ? 1040 : 1260,
        borderRadius: compact ? 58 : 74,
        padding: compact ? 18 : 22,
        background: "linear-gradient(145deg, #15120F, #3B3024)",
        boxShadow: `0 42px 100px rgba(0,0,0,0.48), 0 0 82px rgba(217,180,107,${glow})`,
        border: "3px solid rgba(255,255,255,0.2)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: compact ? 44 : 56,
          overflow: "hidden",
          background: "#FBF7EF",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 15,
            left: "50%",
            width: 148,
            height: 36,
            transform: "translateX(-50%)",
            borderRadius: 999,
            background: "#171513",
            zIndex: 8,
          }}
        />
        <div
          style={{
            padding: compact ? "68px 28px 0" : "78px 34px 0",
            color: "#171513",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: compact ? 27 : 31, fontWeight: 900, letterSpacing: 0 }}>Boutique</div>
              <div dir="rtl" style={{ marginTop: 4, fontSize: compact ? 17 : 19, color: "#8C6C3A", fontWeight: 700 }}>
                اللوك كامل في دقائق
              </div>
            </div>
            <div
              style={{
                width: compact ? 58 : 66,
                height: compact ? 58 : 66,
                borderRadius: 20,
                background: "#171513",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Img src={staticFile(ASSETS.logo)} style={{ width: "72%", height: "72%", objectFit: "contain" }} />
            </div>
          </div>
          <div
            style={{
              marginTop: 28,
              height: compact ? 58 : 66,
              borderRadius: 999,
              background: "#EFE6D8",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              color: "#7B6A54",
              fontSize: compact ? 19 : 22,
              fontWeight: 700,
            }}
          >
            Search full outfit...
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 22, overflow: "hidden" }}>
            {["Streetwear", "Elegant", "Uni", "Night"].map((chip, index) => (
              <div
                key={chip}
                style={{
                  flex: "0 0 auto",
                  borderRadius: 999,
                  padding: compact ? "11px 16px" : "13px 20px",
                  background: index === 0 ? "#171513" : "#F2ECE2",
                  color: index === 0 ? "#FFF7E8" : "#171513",
                  fontSize: compact ? 17 : 19,
                  fontWeight: 800,
                }}
              >
                {chip}
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 30,
              transform: `translateY(${scroll}px)`,
            }}
          >
            <div style={{ display: "flex", gap: 18 }}>
              {productTiles.map((item, index) => (
                <ProductPhoneCard key={item.label} item={item} index={index} frame={frame} />
              ))}
            </div>
            <div style={{ marginTop: 24, display: "grid", gap: 18 }}>
              {outfitCombos.map((combo, index) => (
                <div
                  key={combo.label}
                  style={{
                    height: compact ? 134 : 154,
                    borderRadius: 26,
                    display: "grid",
                    gridTemplateColumns: "120px 1fr auto",
                    gap: 18,
                    alignItems: "center",
                    padding: 16,
                    background: index % 2 ? "#171513" : "#FFFFFF",
                    color: index % 2 ? "#FFF7E8" : "#171513",
                    boxShadow: "0 14px 34px rgba(25,20,15,0.08)",
                  }}
                >
                  <div style={{ width: 116, height: 116, borderRadius: 22, overflow: "hidden" }}>
                    <Img src={staticFile(combo.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: compact ? 24 : 28, fontWeight: 900 }}>{combo.label}</div>
                    <div dir="rtl" style={{ marginTop: 4, color: combo.accent, fontSize: compact ? 16 : 18, fontWeight: 800 }}>
                      {combo.arabic}
                    </div>
                    <div style={{ marginTop: 8, color: index % 2 ? "#D7C8AE" : "#766855", fontSize: compact ? 15 : 17 }}>
                      {combo.pieces[0]} + {combo.pieces[1]}
                    </div>
                  </div>
                  <div
                    style={{
                      borderRadius: 999,
                      padding: "10px 14px",
                      background: combo.accent,
                      color: "#15120F",
                      fontSize: 15,
                      fontWeight: 900,
                    }}
                  >
                    Match
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppFreezeScene() {
  const frame = useCurrentFrame();
  const phoneEnter = spring({
    frame: frame - 5,
    fps: FPS,
    config: { damping: 17, stiffness: 135, mass: 0.82 },
  });
  const freeze = interp(frame, [0, 18], [0, 1], snapEase);

  return (
    <AbsoluteFill style={{ background: "#11100D" }}>
      <CinematicImage
        src={ASSETS.mall}
        scale={1.58}
        y={-64}
        brightness={0.56 - freeze * 0.2}
        contrast={1.2}
        saturate={1 - freeze * 0.75}
        blur={freeze * 7}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(8,10,12,${0.2 + freeze * 0.46})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 120,
          opacity: interp(frame, [6, 18], [0, 1]),
        }}
      >
        <Kicker>Chaos frozen</Kicker>
      </div>
      <Headline frame={frame} top={138} delay={14} size={74} maxWidth={820}>
        Pick your full outfit in minutes.
        <ArabicLine frame={frame} delay={22}>اختاري اللوك كامل في دقائق</ArabicLine>
      </Headline>
      <div
        style={{
          position: "absolute",
          left: cx - 315,
          top: 456,
          transform: `translateY(${(1 - phoneEnter) * 520}px) scale(${0.82 + phoneEnter * 0.18})`,
          opacity: phoneEnter,
        }}
      >
        <PhoneMock frame={frame} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 178,
          top: 1490,
          width: 724,
          height: 210,
          borderRadius: 36,
          background: "rgba(255,247,232,0.92)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.34)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 2,
          overflow: "hidden",
          opacity: interp(frame, [58, 74], [0, 1]),
        }}
      >
        {["Size ready", "Full fit", "COD"].map((label, index) => (
          <div
            key={label}
            style={{
              display: "grid",
              placeItems: "center",
              padding: 18,
              color: "#171513",
              fontSize: 27,
              fontWeight: 900,
              background: index === 1 ? "#E8CF96" : "transparent",
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <BeatBars frame={frame} />
      <Vignette strength={0.85} />
    </AbsoluteFill>
  );
}

function OutfitCard({ combo, frame, index }: { combo: (typeof outfitCombos)[number]; frame: number; index: number }) {
  const local = frame - index * 8;
  const enter = spring({
    frame: local,
    fps: FPS,
    config: { damping: 18, stiffness: 120, mass: 0.72 },
  });
  const side = index % 2 === 0 ? -1 : 1;
  const x = (1 - enter) * side * 440;
  const y = (1 - enter) * (index < 2 ? -160 : 160);
  const rotate = side * interp(local, [0, 24], [8, -1.5], sharpEase);

  return (
    <div
      style={{
        position: "absolute",
        left: index % 2 === 0 ? 62 : 560,
        top: 250 + Math.floor(index / 2) * 520,
        width: 460,
        height: 482,
        borderRadius: 36,
        overflow: "hidden",
        opacity: clamp(enter),
        transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
        boxShadow: `0 38px 90px rgba(0,0,0,0.42), 0 0 60px ${combo.accent}44`,
        border: `2px solid ${combo.accent}88`,
        background: "#15120F",
      }}
    >
      <Img
        src={staticFile(combo.image)}
        style={{
          width: "100%",
          height: "67%",
          objectFit: "cover",
          objectPosition: combo.label === "Elegant" ? "center top" : "center",
          filter: "brightness(0.92) contrast(1.08)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 44%, rgba(0,0,0,0.86))" }} />
      <div style={{ position: "absolute", left: 26, right: 26, bottom: 24 }}>
        <div style={{ color: combo.accent, fontSize: 23, fontWeight: 900 }}>{combo.label}</div>
        <div dir="rtl" style={{ marginTop: 4, color: "#FFF7E8", fontSize: 20, fontWeight: 700 }}>
          {combo.arabic}
        </div>
        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {combo.pieces.map((piece) => (
            <span
              key={piece}
              style={{
                borderRadius: 999,
                background: "rgba(255,255,255,0.13)",
                border: "1px solid rgba(255,255,255,0.17)",
                padding: "8px 11px",
                color: "#F8EBD5",
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              {piece}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function OutfitCombinationsScene() {
  const frame = useCurrentFrame();
  const glow = 0.5 + Math.sin(frame * 0.16) * 0.2;

  return (
    <AbsoluteFill style={{ background: "#080706" }}>
      <CinematicImage
        src={ASSETS.night}
        scale={1.22 + interp(frame, [0, sec(4)], [0.02, 0.08])}
        brightness={0.35}
        contrast={1.4}
        saturate={0.65}
        blur={2}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(7,6,5,0.94), rgba(7,6,5,0.38) 50%, rgba(7,6,5,0.95))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: cx - 3,
          top: 188,
          width: 6,
          height: 1240,
          borderRadius: 999,
          background: `linear-gradient(180deg, transparent, rgba(232,207,150,${glow}), transparent)`,
          boxShadow: `0 0 52px rgba(232,207,150,${glow})`,
          opacity: interp(frame, [18, 40], [0, 1]),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 74,
          left: 76,
          right: 76,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Kicker>Auto match</Kicker>
        <div
          style={{
            color: "#FFF7E8",
            fontSize: 26,
            fontWeight: 900,
            borderRadius: 999,
            padding: "12px 18px",
            background: "rgba(255,255,255,0.1)",
          }}
        >
          4 looks ready
        </div>
      </div>
      {outfitCombos.map((combo, index) => (
        <OutfitCard key={combo.label} combo={combo} frame={frame} index={index} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 126,
          bottom: 126,
          right: 126,
          padding: "30px 34px",
          borderRadius: 34,
          background: "rgba(255,247,232,0.9)",
          color: "#171513",
          boxShadow: "0 28px 80px rgba(0,0,0,0.38)",
          opacity: interp(frame, [92, 112], [0, 1]),
        }}
      >
        <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1 }}>Accessories + shoes matched automatically.</div>
        <div dir="rtl" style={{ marginTop: 10, color: "#9A7031", fontSize: 30, fontWeight: 800 }}>
          الشنطة والجزمة مناسبين للوك
        </div>
      </div>
      <BeatBars frame={frame} color="rgba(232,207,150,0.9)" />
      <Vignette strength={0.88} />
    </AbsoluteFill>
  );
}

function Box({ frame, x, y, delay, label }: { frame: number; x: number; y: number; delay: number; label: string }) {
  const local = frame - delay;
  const enter = spring({
    frame: local,
    fps: FPS,
    config: { damping: 14, stiffness: 130, mass: 0.8 },
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 260,
        height: 190,
        borderRadius: 18,
        background: "linear-gradient(135deg, #D7B778, #9A7031)",
        border: "3px solid rgba(255,255,255,0.25)",
        boxShadow: "0 26px 70px rgba(0,0,0,0.35)",
        transform: `translateY(${(1 - enter) * 160}px) rotate(${(1 - enter) * -8}deg)`,
        opacity: clamp(enter),
      }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, top: 72, height: 3, background: "rgba(65,38,15,0.24)" }} />
      <div
        style={{
          position: "absolute",
          left: 28,
          top: 28,
          color: "#171513",
          fontSize: 24,
          fontWeight: 900,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          right: 24,
          bottom: 22,
          padding: "8px 12px",
          borderRadius: 999,
          background: "rgba(255,247,232,0.68)",
          color: "#171513",
          fontSize: 15,
          fontWeight: 900,
        }}
      >
        TODAY
      </div>
    </div>
  );
}

function DeliveryRoute({ frame }: { frame: number }) {
  const progress = interp(frame, [50, 104], [0, 1], sharpEase);
  const riderX = 176 + progress * 664;
  const riderY = 1032 - Math.sin(progress * Math.PI) * 125;

  return (
    <div
      style={{
        position: "absolute",
        left: 108,
        top: 888,
        width: 864,
        height: 350,
        borderRadius: 38,
        background: "rgba(255,247,232,0.92)",
        boxShadow: "0 28px 86px rgba(0,0,0,0.36)",
        overflow: "hidden",
        opacity: interp(frame, [42, 58], [0, 1]),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(154,112,49,0.12) 1px, transparent 1px), linear-gradient(0deg, rgba(154,112,49,0.12) 1px, transparent 1px)",
          backgroundSize: "86px 86px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 172,
          top: 170,
          width: 520 * progress,
          height: 8,
          borderRadius: 999,
          background: "#171513",
          transform: "rotate(-12deg)",
          transformOrigin: "0 50%",
          boxShadow: "0 0 24px rgba(154,112,49,0.34)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 122,
          top: 156,
          width: 78,
          height: 78,
          borderRadius: 999,
          background: "#171513",
          color: "#FFF7E8",
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
          fontSize: 21,
        }}
      >
        Pick
      </div>
      <div
        style={{
          position: "absolute",
          right: 122,
          top: 72,
          width: 96,
          height: 96,
          borderRadius: 999,
          background: "#D9B46B",
          color: "#171513",
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
          fontSize: 23,
        }}
      >
        Home
      </div>
      <div
        style={{
          position: "absolute",
          left: riderX,
          top: riderY,
          width: 116,
          height: 70,
          transform: `rotate(${-10 + Math.sin(frame * 0.2) * 3}deg)`,
        }}
      >
        <div style={{ position: "absolute", left: 17, bottom: 0, width: 34, height: 34, borderRadius: 999, background: "#171513" }} />
        <div style={{ position: "absolute", right: 8, bottom: 0, width: 34, height: 34, borderRadius: 999, background: "#171513" }} />
        <div style={{ position: "absolute", left: 36, bottom: 23, width: 66, height: 22, borderRadius: 999, background: "#D9B46B" }} />
        <div style={{ position: "absolute", left: 56, top: 0, width: 34, height: 40, borderRadius: "16px 16px 4px 4px", background: "#171513" }} />
      </div>
    </div>
  );
}

function DeliveryScene() {
  const frame = useCurrentFrame();
  const packOpacity = interp(frame, [0, 16, 68, 88], [0, 1, 1, 0], sharpEase);
  const receiveOpacity = interp(frame, [72, 96], [0, 1], sharpEase);

  return (
    <AbsoluteFill style={{ background: "#0B0907" }}>
      <CinematicImage src={ASSETS.mall} scale={1.36} brightness={0.5} contrast={1.26} saturate={0.7} blur={1.2} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,7,6,0.9), rgba(8,7,6,0.25), rgba(8,7,6,0.94))" }} />
      <div style={{ opacity: packOpacity }}>
        <Box frame={frame} x={86} y={454} delay={4} label="Packed" />
        <Box frame={frame} x={388} y={516} delay={14} label="Styled" />
        <Box frame={frame} x={690} y={456} delay={24} label="Sealed" />
        <div
          style={{
            position: "absolute",
            left: 118,
            top: 244,
            color: "#FFF7E8",
            fontSize: 67,
            fontWeight: 900,
            lineHeight: 0.95,
            textShadow: "0 20px 60px rgba(0,0,0,0.42)",
          }}
        >
          Fast packing.
          <br />
          Same-day route.
        </div>
      </div>
      <DeliveryRoute frame={frame} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: receiveOpacity,
        }}
      >
        <CinematicImage
          src={ASSETS.casual}
          scale={1.13 + interp(frame, [72, 120], [0.05, 0])}
          y={110}
          brightness={0.88}
          contrast={1.08}
          saturate={0.95}
          objectPosition="center top"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.22), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.78))" }} />
        <Box frame={frame} x={594} y={1150} delay={86} label="Boutique" />
      </div>
      <Headline frame={frame} bottom={155} delay={72} size={95} maxWidth={910}>
        Delivered <span style={{ color: "#D9B46B" }}>TODAY.</span>
        <ArabicLine frame={frame} delay={82}>يوصلك النهارده</ArabicLine>
      </Headline>
      <BeatBars frame={frame} color="rgba(217,180,107,0.88)" />
      <Vignette strength={0.82} />
    </AbsoluteFill>
  );
}

function BrandTile({ tile, frame, index }: { tile: (typeof brandTiles)[number]; frame: number; index: number }) {
  const local = frame - 8 - index * 8;
  const enter = spring({
    frame: local,
    fps: FPS,
    config: { damping: 15, stiffness: 130, mass: 0.75 },
  });

  return (
    <div
      style={{
        width: 410,
        height: 410,
        borderRadius: 34,
        overflow: "hidden",
        position: "relative",
        background: "#171513",
        opacity: clamp(enter),
        transform: `translateY(${(1 - enter) * 100}px) scale(${0.88 + enter * 0.12})`,
        boxShadow: "0 26px 72px rgba(0,0,0,0.36)",
        border: "2px solid rgba(255,255,255,0.18)",
      }}
    >
      <Img src={staticFile(tile.image)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.82) contrast(1.08)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 42%, rgba(0,0,0,0.84))" }} />
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 22 }}>
        <div style={{ color: "#FFF7E8", fontSize: 33, fontWeight: 900 }}>{tile.name}</div>
        <div style={{ marginTop: 8, display: "inline-flex", borderRadius: 999, padding: "8px 12px", background: "#D9B46B", color: "#171513", fontSize: 16, fontWeight: 900 }}>
          {tile.area}
        </div>
      </div>
    </div>
  );
}

function LocalBrandsScene() {
  const frame = useCurrentFrame();
  const phone = spring({
    frame: frame - 22,
    fps: FPS,
    config: { damping: 18, stiffness: 120, mass: 0.8 },
  });

  return (
    <AbsoluteFill style={{ background: "#100E0B" }}>
      <CinematicImage src={ASSETS.mall} scale={1.2} brightness={0.35} contrast={1.24} saturate={0.58} blur={2} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.88), rgba(0,0,0,0.48) 48%, rgba(0,0,0,0.92))" }} />
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 78,
          opacity: interp(frame, [0, 18], [0, 1]),
        }}
      >
        <Kicker>Local brands</Kicker>
      </div>
      <Headline frame={frame} top={176} size={75} maxWidth={900} delay={8}>
        Best local fashion brands in one place.
      </Headline>
      <div
        style={{
          position: "absolute",
          left: 78,
          top: 538,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        {brandTiles.map((tile, index) => (
          <BrandTile key={tile.name} tile={tile} frame={frame} index={index} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 64,
          transform: `translateX(${(1 - phone) * 300}px) rotate(${6 - phone * 3}deg) scale(${0.72})`,
          opacity: phone,
        }}
      >
        <PhoneMock frame={frame + 30} compact />
      </div>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          left: 76,
          bottom: 108,
          color: "#D9B46B",
          fontSize: 35,
          fontWeight: 900,
          opacity: interp(frame, [80, 104], [0, 1]),
        }}
      >
        براندات مصرية، اختيارات أسرع
      </div>
      <BeatBars frame={frame} />
      <Vignette strength={0.9} />
    </AbsoluteFill>
  );
}

function FriendBubble({ frame, delay, x, y, text }: { frame: number; delay: number; x: number; y: number; text: string }) {
  const local = frame - delay;
  const enter = spring({
    frame: local,
    fps: FPS,
    config: { damping: 14, stiffness: 150, mass: 0.66 },
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "18px 22px",
        borderRadius: 999,
        background: "rgba(255,247,232,0.92)",
        color: "#171513",
        fontSize: 24,
        fontWeight: 900,
        boxShadow: "0 20px 54px rgba(0,0,0,0.28)",
        transform: `translateY(${(1 - enter) * 46}px) scale(${0.82 + enter * 0.18})`,
        opacity: clamp(enter),
      }}
    >
      {text}
    </div>
  );
}

function FinalScene() {
  const frame = useCurrentFrame();
  const slow = interp(frame, [0, sec(4)], [0, 1], easeOut);
  const logoOpacity = interp(frame, [28, 52], [0, 1]);
  const titleOpacity = interp(frame, [50, 78], [0, 1]);

  return (
    <AbsoluteFill style={{ background: "#080706" }}>
      <CinematicImage
        src={ASSETS.elegant}
        scale={1.06 + slow * 0.08}
        x={-70 + slow * 35}
        y={40}
        brightness={0.84}
        contrast={1.1}
        saturate={0.88}
        objectPosition="center"
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.04) 38%, rgba(0,0,0,0.86))" }} />
      <FriendBubble frame={frame} delay={18} x={606} y={430} text="Where did you get that?" />
      <FriendBubble frame={frame} delay={34} x={120} y={560} text="10/10 fit" />
      <FriendBubble frame={frame} delay={48} x={652} y={680} text="Send the link" />
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 84,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: logoOpacity,
        }}
      >
        <div
          style={{
            width: 74,
            height: 74,
            borderRadius: 22,
            background: "#FFF7E8",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Img src={staticFile(ASSETS.logo)} style={{ width: "75%", height: "75%", objectFit: "contain" }} />
        </div>
        <div style={{ color: "#FFF7E8", fontSize: 36, fontWeight: 900 }}>Boutique</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          bottom: 142,
          opacity: titleOpacity,
          transform: `translateY(${interp(frame, [48, 78], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            color: "#FFF7E8",
            fontSize: 86,
            fontWeight: 900,
            lineHeight: 0.96,
            letterSpacing: 0,
            textShadow: "0 28px 86px rgba(0,0,0,0.6)",
          }}
        >
          Boutique — Your Mall.
          <br />
          <span style={{ color: "#D9B46B" }}>Without The Chaos.</span>
        </div>
        <div
          style={{
            marginTop: 34,
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            borderRadius: 999,
            padding: "18px 26px",
            background: "#FFF7E8",
            color: "#171513",
            fontSize: 26,
            fontWeight: 900,
            boxShadow: "0 24px 64px rgba(0,0,0,0.34)",
          }}
        >
          Shop the look
          <span style={{ color: "#9A7031" }}>today</span>
        </div>
      </div>
      <BeatBars frame={frame} color="rgba(217,180,107,0.8)" />
      <Vignette strength={0.74} />
    </AbsoluteFill>
  );
}

export const BoutiqueReelAd = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        width: WIDTH,
        height: HEIGHT,
        overflow: "hidden",
        background: "#090806",
        fontFamily,
      }}
    >
      <Audio src={staticFile(ASSETS.audio)} volume={0.78} />
      <Sequence from={0} durationInFrames={sec(3)}>
        <HookScene />
      </Sequence>
      <Sequence from={sec(3)} durationInFrames={sec(3)}>
        <AppFreezeScene />
      </Sequence>
      <Sequence from={sec(6)} durationInFrames={sec(4)}>
        <OutfitCombinationsScene />
      </Sequence>
      <Sequence from={sec(10)} durationInFrames={sec(4)}>
        <DeliveryScene />
      </Sequence>
      <Sequence from={sec(14)} durationInFrames={sec(4)}>
        <LocalBrandsScene />
      </Sequence>
      <Sequence from={sec(18)} durationInFrames={sec(4)}>
        <FinalScene />
      </Sequence>
      <TransitionFlashes frame={frame} />
      <FilmGrain frame={frame} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 7,
          background: "rgba(255,255,255,0.16)",
        }}
      >
        <div
          style={{
            width: `${(frame / Math.max(1, durationInFrames - 1)) * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #FF6D6D, #D9B46B, #FFF7E8)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
