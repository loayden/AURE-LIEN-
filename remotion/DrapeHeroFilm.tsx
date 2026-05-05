import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const drapeFps = 24;
export const drapeDurationInFrames = 75 * drapeFps;

type Format = "vertical" | "landscape" | "square";
type Props = { format: Format };

type Shot = {
  id: string;
  name: string;
  duration: number;
  type: string;
  lens: string;
  movement: string;
  lighting: string;
  intent: string;
};

type Scene = {
  id: number;
  role: string;
  title: string;
  subtitle: string;
  start: number;
  duration: number;
  color: string;
  accent: string;
  grade: string;
  music: string;
  transition: string;
  vo?: string;
  voNote?: string;
  shots: Shot[];
};

const scenes: Scene[] = [
  {
    id: 1,
    role: "DIRECTOR",
    title: "The Question",
    subtitle: "Hook",
    start: 0,
    duration: 5,
    color: "#1A1510",
    accent: "#8C8070",
    grade: "Kodak 5219 pushed 1 stop - shadows #1A1510, midtones #8C8070, highlights #E8DDD0",
    music: "Silence. Room tone, exhale, cotton fabric close-mic.",
    transition: "Hard cut, 4 frames, to make stillness jolt into motion.",
    vo: "كل يوم... نفس السؤال.",
    voNote: "Female Egyptian Arabic target, intimate whisper, one exhale, pause after يوم.",
    shots: [
      {
        id: "1.1",
        name: "Wardrobe Master",
        duration: 2.5,
        type: "Medium-wide from slightly below eye level",
        lens: "85mm f/1.4",
        movement: "Imperceptible 2% push-in",
        lighting: "Overcast window key through 4x8 silk, tungsten bedside practical",
        intent: "Everything and nothing to wear",
      },
      {
        id: "1.2",
        name: "Fabric Insert",
        duration: 1.5,
        type: "Extreme close-up hand touching fabric",
        lens: "100mm macro",
        movement: "Static",
        lighting: "Soft window spill with warm practical lift",
        intent: "Indecision becomes tactile",
      },
    ],
  },
  {
    id: 2,
    role: "DIRECTOR",
    title: "The Exhaustion",
    subtitle: "Problem",
    start: 5,
    duration: 7,
    color: "#27231F",
    accent: "#5C5050",
    grade: "Most desaturated point - nearly monochrome mall world",
    music: "D4 piano note and ambient pad. Reference mood: Max Richter restraint.",
    transition: "Two-frame black flash reset before the idea arrives.",
    vo: "ليه اختيار لبسك... بياخد كل ده؟",
    voNote: "Weighted, bewildered, breath before بياخد and after the question.",
    shots: [
      {
        id: "2.1",
        name: "Mall Aerial",
        duration: 1.5,
        type: "Aerial descending to Cairo mall entrance",
        lens: "DJI Mavic 3 Cine wide",
        movement: "Crane down from 40m to 15m",
        lighting: "Harsh midday sun",
        intent: "Scale overwhelms the individual",
      },
      {
        id: "2.2",
        name: "Mall Walk",
        duration: 1.5,
        type: "Medium follow through crowded corridor",
        lens: "35mm f/2.8 gimbal",
        movement: "Floating follow, crowds blur past",
        lighting: "Fluorescent mall strips",
        intent: "Choice feels loud and draining",
      },
      {
        id: "2.3",
        name: "Feet",
        duration: 0.8,
        type: "Extreme close-up of tired steps",
        lens: "100mm low angle",
        movement: "Floor-level tracking drift",
        lighting: "Cool reflected mall light",
        intent: "Fatigue becomes physical",
      },
      {
        id: "2.4",
        name: "Queue",
        duration: 1,
        type: "Medium checkout queue from corridor",
        lens: "85mm static",
        movement: "Imperceptible zoom out",
        lighting: "Flat corridor practicals",
        intent: "She gets smaller in the system",
      },
      {
        id: "2.5",
        name: "Taxi",
        duration: 1,
        type: "Close-up reflected in taxi window",
        lens: "85mm handheld",
        movement: "Slow tired drift left",
        lighting: "Blue-grey end-of-day city light",
        intent: "Effort without satisfaction",
      },
    ],
  },
  {
    id: 3,
    role: "CINEMATOGRAPHER",
    title: "The Revelation",
    subtitle: "The Idea",
    start: 12,
    duration: 8,
    color: "#332B24",
    accent: "#C9A84C",
    grade: "Warmth begins. Phone screen is first full-color object.",
    music: "D-F#-A-E piano motif, D major, no percussion. Nils Frahm-style restraint.",
    transition: "Match cut from phone UI to physical fabric texture.",
    vo: "تخيل إن كل المولات... في موبايلك.",
    voNote: "Conspiratorial wonder, exact 0.8s pause after المولات.",
    shots: [
      {
        id: "3.1",
        name: "Phone Wake",
        duration: 1,
        type: "ECU phone face-down on bed",
        lens: "100mm macro",
        movement: "Static, light does the movement",
        lighting: "Warm screen glow blooms onto sheets",
        intent: "The room wakes up",
      },
      {
        id: "3.2",
        name: "Pick Up",
        duration: 1,
        type: "Close hand lifting phone",
        lens: "85mm",
        movement: "Subtle follow tilt",
        lighting: "Phone glow becomes 2700K face key",
        intent: "Curiosity begins",
      },
      {
        id: "3.3",
        name: "Face + Phone",
        duration: 2,
        type: "Medium close-up by phone light",
        lens: "85mm f/1.2",
        movement: "Imperceptible pull-back",
        lighting: "Practicals, phone key, 3200K rim",
        intent: "Interest becomes relief",
      },
      {
        id: "3.4",
        name: "UI Reveal",
        duration: 2,
        type: "POV app feed insert",
        lens: "iPhone 15 Pro 1x LOG",
        movement: "Slow thumb scroll",
        lighting: "Screen brightest plane",
        intent: "The solution becomes tangible",
      },
    ],
  },
  {
    id: 4,
    role: "DIRECTOR",
    title: "The Experience",
    subtitle: "The Browse",
    start: 20,
    duration: 15,
    color: "#201E27",
    accent: "#6B6070",
    grade: "Warmer, restrained, energized. Accent #C9A84C appears only in UI.",
    music: "Cello and viola enter quietly at 66-72 BPM. Johann Johannsson-style minimal strings.",
    transition: "Whip pan right from Order Now tap to delivery engine.",
    vo: "اختار... في ثواني.",
    voNote: "Gentle invitation, 1.2s pause between phrases.",
    shots: [
      {
        id: "4.1",
        name: "Scrolling",
        duration: 2,
        type: "Over-shoulder browse, phone and reaction",
        lens: "85mm",
        movement: "Smooth dolly in",
        lighting: "Lamp, phone glow, warm rim",
        intent: "Browsing without pressure",
      },
      {
        id: "4.2",
        name: "Fabric Match",
        duration: 1.5,
        type: "Digital-to-physical fabric transition",
        lens: "100mm macro",
        movement: "Push through screen texture",
        lighting: "Matched soft directional light",
        intent: "Digital has physical value",
      },
      {
        id: "4.4",
        name: "Size Tap",
        duration: 1,
        type: "Macro fingertip tap",
        lens: "100mm macro",
        movement: "Locked micro-movement",
        lighting: "Controlled screen key",
        intent: "Decision feels precise",
      },
      {
        id: "4.9",
        name: "Private Smile",
        duration: 1,
        type: "Close-up private smile",
        lens: "85mm f/1.4",
        movement: "Static",
        lighting: "Warm low contrast",
        intent: "Freedom, not commerce",
      },
    ],
  },
  {
    id: 5,
    role: "DIRECTOR",
    title: "The Order",
    subtitle: "Delivery Set In Motion",
    start: 35,
    duration: 10,
    color: "#2D2721",
    accent: "#8B7355",
    grade: "Outside cools slightly but remains alive.",
    music: "Subtle 72 BPM percussion, kicks every two beats, premium urgency.",
    transition: "Slow dissolve, 16 frames, into doorbell.",
    vo: "واطلب... وانت في مكانك.",
    voNote: "Quiet satisfaction; rest, not speed.",
    shots: [
      {
        id: "5.1",
        name: "Confirm",
        duration: 1,
        type: "Screen insert confirmation",
        lens: "iPhone screen capture",
        movement: "Package icon resolves to checkmark",
        lighting: "Screen clean, gold accent isolated",
        intent: "Trust locks in",
      },
      {
        id: "5.2",
        name: "Pickup",
        duration: 2,
        type: "Wide boutique pickup exterior",
        lens: "50mm static",
        movement: "Rider exits and mounts motorcycle",
        lighting: "Late afternoon street light",
        intent: "Platform moves calmly",
      },
      {
        id: "5.3",
        name: "City Move",
        duration: 2,
        type: "Low tracking beside motorcycle",
        lens: "35mm tracking car",
        movement: "Parallel same speed",
        lighting: "Golden dust Cairo light",
        intent: "City becomes useful",
      },
    ],
  },
  {
    id: 6,
    role: "CINEMATOGRAPHER",
    title: "The Arrival",
    subtitle: "The Door",
    start: 45,
    duration: 10,
    color: "#4A3524",
    accent: "#B8956A",
    grade: "Warmest richest grade. Maximum light.",
    music: "Full string arrangement +4dB, then music pauses under package transfer.",
    transition: "Left-to-right branded wipe into merchant story.",
    vo: "ويجيلك... لحد باب بيتك.",
    voNote: "Warm, gift-like, pause after ويجيلك.",
    shots: [
      {
        id: "6.1",
        name: "Doorbell",
        duration: 1,
        type: "Macro finger on doorbell",
        lens: "100mm macro",
        movement: "Locked press",
        lighting: "Soft late sun plus bounce",
        intent: "Arrival feels designed",
      },
      {
        id: "6.2",
        name: "Open Door",
        duration: 2,
        type: "Exterior eye-level reveal",
        lens: "50mm static",
        movement: "Door opens into frame",
        lighting: "Sun plus 4x4 bounce",
        intent: "Recognition and surprise",
      },
      {
        id: "6.3",
        name: "Exchange",
        duration: 2,
        type: "Slow-motion hands only",
        lens: "100mm macro, 120fps",
        movement: "Micro track on box transfer",
        lighting: "Gold reflector glow",
        intent: "Tactile luxury",
      },
    ],
  },
  {
    id: 7,
    role: "DIRECTOR",
    title: "The Merchant",
    subtitle: "The Other Side",
    start: 55,
    duration: 10,
    color: "#17201D",
    accent: "#4A5568",
    grade: "Warmer, more saturated, purposeful.",
    music: "Purposeful pullback: piano and low strings, less emotional.",
    transition: "Pure black for 0.5 seconds, then final reveal.",
    vo: "ولو عندك محل... هنوصلك عملاء، من غير ما تتعب.",
    voNote: "More direct and assured; not over shot 7.4.",
    shots: [
      {
        id: "7.1",
        name: "Storefront",
        duration: 1.5,
        type: "Wide static boutique exterior",
        lens: "50mm tripod",
        movement: "Static",
        lighting: "Late afternoon Cairo street",
        intent: "Trust and pride",
      },
      {
        id: "7.2",
        name: "Upload",
        duration: 3,
        type: "Medium Khaled uploads product",
        lens: "50mm static",
        movement: "Photographs shirt, taps upload",
        lighting: "Warm practicals plus window side light",
        intent: "Craft plus platform",
      },
      {
        id: "7.4",
        name: "Direct",
        duration: 2,
        type: "Medium direct-to-lens beat",
        lens: "50mm",
        movement: "Static tripod",
        lighting: "Dignified key, store alive behind",
        intent: "His presence is the statement",
      },
    ],
  },
  {
    id: 8,
    role: "POST-PRODUCTION SUP",
    title: "The Future",
    subtitle: "The Reveal",
    start: 65,
    duration: 10,
    color: "#000000",
    accent: "#C9A84C",
    grade: "Kodak 5207 pulled - richest warmth and luminous skin.",
    music: "Silence, then single D4 piano note returns for closure.",
    transition: "Fade to black after logo. Silence holds.",
    shots: [
      {
        id: "8.2",
        name: "Slow Turn",
        duration: 3,
        type: "Slow turn reveal",
        lens: "85mm static, 120fps to 60fps",
        movement: "She turns, camera does not",
        lighting: "Golden backlight plus warm Kino fill",
        intent: "Exactly herself",
      },
      {
        id: "8.5",
        name: "Title",
        duration: 3,
        type: "Black title card",
        lens: "Graphic",
        movement: "800ms fade plus 4px upward translate",
        lighting: "Pure black",
        intent: "The thought lands",
      },
      {
        id: "8.6",
        name: "Logo",
        duration: 4,
        type: "Black logo card",
        lens: "Graphic",
        movement: "400ms crossfade, 800ms gold glow",
        lighting: "Pure black with #C9A84C",
        intent: "Final brand memory",
      },
    ],
  },
];

const audioCues = [
  { src: "audio/drape/vo-01.wav", from: 3.0, end: 5.0 },
  { src: "audio/drape/vo-02.wav", from: 5.35, end: 10.8 },
  { src: "audio/drape/vo-03.wav", from: 13.05, end: 19.6 },
  { src: "audio/drape/vo-04.wav", from: 21.4, end: 27.0 },
  { src: "audio/drape/vo-05.wav", from: 35.65, end: 41.2 },
  { src: "audio/drape/vo-06.wav", from: 45.8, end: 51.2 },
  { src: "audio/drape/vo-07.wav", from: 55.65, end: 62.7 },
];

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const serif = "Playfair Display, Cormorant Garamond, Georgia, Times New Roman, serif";
const sans = "Inter, Jost, Avenir Next, Helvetica Neue, Arial, sans-serif";
const arabic = "Cairo, Inter, Arial, sans-serif";

const f = (seconds: number, fps: number) => Math.round(seconds * fps);

const enter = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: ease,
  });

const activeShot = (scene: Scene, frame: number, fps: number) => {
  const total = scene.shots.reduce((sum, shot) => sum + shot.duration, 0);
  const weighted = (frame / fps / scene.duration) * total;
  let cursor = 0;

  for (const shot of scene.shots) {
    cursor += shot.duration;
    if (weighted <= cursor) return shot;
  }

  return scene.shots[scene.shots.length - 1];
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <div
      style={{
        color: "rgba(245,240,232,0.46)",
        fontSize: 18,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: 8,
      }}
    >
      {label}
    </div>
    <div style={{ color: "#F5F0E8", fontSize: 26, lineHeight: 1.22 }}>{children}</div>
  </div>
);

const SceneBackground = ({
  scene,
  localFrame,
  isVertical,
}: {
  scene: Scene;
  localFrame: number;
  isVertical: boolean;
}) => {
  const drift = interpolate(localFrame, [0, scene.duration * 24], [0, isVertical ? -80 : -130], clamp);
  const pulse = enter(localFrame, 12, 60);

  if (scene.id === 8 && localFrame > 128) {
    const title = localFrame < 190;
    const p = enter(localFrame, title ? 128 : 188, 20);

    return (
      <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center" }}>
        {title ? (
          <div
            style={{
              color: "#FFFFFF",
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: isVertical ? 82 : 58,
              textAlign: "center",
              lineHeight: 1.18,
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [12, 0])}px)`,
              width: isVertical ? 1360 : 1600,
            }}
          >
            هذا ليس تسوقاً. هذا هو مستقبل الموضة.
            <div
              style={{
                marginTop: 34,
                fontFamily: sans,
                fontStyle: "normal",
                fontSize: isVertical ? 34 : 26,
                color: "rgba(255,255,255,0.62)",
              }}
            >
              This is not shopping. This is the future of fashion.
            </div>
          </div>
        ) : (
          <div style={{ color: "#C9A84C", textAlign: "center", opacity: p }}>
            <div style={{ fontSize: isVertical ? 132 : 108, letterSpacing: "0.24em" }}>DRAPE</div>
            <div style={{ marginTop: 34, fontSize: isVertical ? 38 : 30, letterSpacing: "0.15em" }}>
              Fashion. Delivered.
            </div>
          </div>
        )}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 68% 34%, ${scene.accent}55, transparent 28%), linear-gradient(135deg, ${scene.color}, #0D0D12 78%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "9%",
          border: "1px solid rgba(245,240,232,0.12)",
          transform: `translateX(${drift}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: isVertical ? "18%" : "12%",
          top: isVertical ? "21%" : "16%",
          width: isVertical ? 470 : 330,
          height: isVertical ? 850 : 590,
          borderRadius: isVertical ? 70 : 52,
          padding: isVertical ? 25 : 18,
          background: "#111116",
          boxShadow: `0 0 ${80 + pulse * 80}px rgba(201,168,76,0.24)`,
          opacity: scene.id >= 3 && scene.id <= 5 ? 1 : 0,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: isVertical ? 46 : 34,
            background: "#F5F0E8",
            overflow: "hidden",
            color: "#171513",
            padding: isVertical ? 32 : 22,
          }}
        >
          <div style={{ color: "#C9A84C", letterSpacing: "0.18em", fontSize: isVertical ? 42 : 28 }}>
            DRAPE
          </div>
          {["Linen shirt", "Tailored pants", "Evening set", "Soft blazer"].map((item, index) => (
            <div
              key={item}
              style={{
                marginTop: isVertical ? 26 : 17,
                display: "grid",
                gridTemplateColumns: isVertical ? "120px 1fr" : "80px 1fr",
                gap: isVertical ? 20 : 14,
                padding: isVertical ? 18 : 12,
                border: `1px solid ${index === 1 ? "#C9A84C" : "rgba(23,21,19,0.12)"}`,
              }}
            >
              <div style={{ background: index % 2 ? "#2D2A2D" : "#BCA887" }} />
              <div style={{ fontSize: isVertical ? 24 : 16 }}>{item}</div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: isVertical ? "37%" : "46%",
          bottom: isVertical ? "18%" : "10%",
          width: isVertical ? 270 : 210,
          height: isVertical ? 700 : 500,
          background:
            scene.id >= 6
              ? "linear-gradient(180deg, #F5F0E8, #C9A84C 65%, #171513)"
              : "linear-gradient(180deg, #F2E9DE, #BDAA97)",
          borderRadius: "45% 45% 8% 8%",
          opacity: scene.id === 7 ? 0.35 : 0.8,
        }}
      />
    </AbsoluteFill>
  );
};

const DrapeAudio = () => {
  const { fps } = useVideoConfig();
  const windows = audioCues.map((cue) => ({ from: f(cue.from, fps), end: f(cue.end, fps) }));

  return (
    <>
      <Audio
        src={staticFile("audio/drape/score-sfx.wav")}
        volume={(frame) => (windows.some((w) => frame >= w.from - 4 && frame <= w.end + 5) ? 0.48 : 0.72)}
      />
      {audioCues.map((cue) => (
        <Sequence key={cue.src} from={f(cue.from, fps)} durationInFrames={f(cue.end - cue.from, fps)}>
          <Audio src={staticFile(cue.src)} volume={0.86} />
        </Sequence>
      ))}
    </>
  );
};

const SceneLayer = ({
  scene,
  globalStart,
  isVertical,
}: {
  scene: Scene;
  globalStart: number;
  isVertical: boolean;
}) => {
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shot = activeShot(scene, localFrame, fps);
  const inP = enter(localFrame, 0, 18);
  const outP = interpolate(localFrame, [f(scene.duration, fps) - 18, f(scene.duration, fps)], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ opacity: inP * outP, color: "#F5F0E8", fontFamily: sans, overflow: "hidden" }}>
      <SceneBackground scene={scene} localFrame={localFrame} isVertical={isVertical} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(13,13,18,0.68), rgba(13,13,18,0.1))" }} />
      <div style={{ position: "absolute", left: isVertical ? 110 : 96, top: isVertical ? 120 : 84 }}>
        <div style={{ color: "#C9A84C", letterSpacing: "0.14em", fontSize: isVertical ? 24 : 16 }}>
          [ROLE: {scene.role}]
        </div>
        <div style={{ marginTop: 24, fontFamily: serif, fontSize: isVertical ? 94 : 76, lineHeight: 0.92 }}>
          {scene.title}
        </div>
        <div style={{ marginTop: 18, color: "rgba(245,240,232,0.58)", fontSize: isVertical ? 28 : 22, letterSpacing: "0.13em" }}>
          SCENE {scene.id} - {scene.subtitle} - {scene.start}s
        </div>
      </div>
      {scene.vo ? (
        <div
          style={{
            position: "absolute",
            right: isVertical ? 110 : 100,
            top: isVertical ? 250 : 105,
            width: isVertical ? 860 : 700,
            textAlign: "right",
          }}
        >
          <div style={{ fontFamily: arabic, fontSize: isVertical ? 58 : 42, direction: "rtl", lineHeight: 1.25 }}>
            {scene.vo}
          </div>
          <div style={{ marginTop: 18, color: "rgba(245,240,232,0.58)", fontSize: isVertical ? 22 : 16 }}>
            {scene.voNote}
          </div>
        </div>
      ) : null}
      {scene.id === 8 && localFrame > 128 ? null : (
        <div
          style={{
            position: "absolute",
            left: isVertical ? 110 : 96,
            right: isVertical ? 110 : undefined,
            bottom: isVertical ? 160 : 80,
            width: isVertical ? undefined : 1180,
            background: "rgba(13,13,18,0.78)",
            border: "1px solid rgba(245,240,232,0.16)",
            padding: isVertical ? 46 : 34,
          }}
        >
          <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 22 }}>
            <div style={{ color: "#C9A84C", letterSpacing: "0.12em", fontSize: 18 }}>SHOT {shot.id} - {shot.duration}s</div>
            <div style={{ color: "rgba(245,240,232,0.5)", fontSize: 18 }}>
              {(globalStart / fps).toFixed(1)}s-{((globalStart + localFrame) / fps).toFixed(1)}s
            </div>
          </div>
          <div style={{ fontFamily: serif, fontSize: isVertical ? 58 : 44, marginBottom: 26 }}>{shot.name}</div>
          <div style={{ display: "grid", gridTemplateColumns: isVertical ? "1fr 1fr" : "repeat(4, 1fr)", gap: 26 }}>
            <Field label="Shot type">{shot.type}</Field>
            <Field label="Lens">{shot.lens}</Field>
            <Field label="Movement">{shot.movement}</Field>
            <Field label="Lighting">{shot.lighting}</Field>
          </div>
          <div style={{ marginTop: 26, borderTop: "1px solid rgba(245,240,232,0.14)", paddingTop: 20 }}>
            <Field label="Emotional intent">{shot.intent}</Field>
          </div>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: isVertical ? 110 : 96,
          right: isVertical ? 110 : 96,
          bottom: isVertical ? 70 : 36,
          color: "rgba(245,240,232,0.46)",
          fontSize: isVertical ? 18 : 14,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Grade: {scene.grade} | Music: {scene.music} | Transition: {scene.transition}
      </div>
    </AbsoluteFill>
  );
};

export const DrapeHeroFilm = ({ format }: Props) => {
  const { fps, width, height } = useVideoConfig();
  const isVertical = format === "vertical" || height > width;

  return (
    <AbsoluteFill style={{ background: "#0D0D12" }}>
      <DrapeAudio />
      {scenes.map((scene) => (
        <Sequence key={scene.id} from={f(scene.start, fps)} durationInFrames={f(scene.duration, fps)} premountFor={fps}>
          <SceneLayer scene={scene} globalStart={f(scene.start, fps)} isVertical={isVertical} />
        </Sequence>
      ))}
      <div
        style={{
          position: "absolute",
          top: isVertical ? 48 : 30,
          right: isVertical ? 56 : 46,
          color: "rgba(245,240,232,0.34)",
          fontFamily: sans,
          fontSize: isVertical ? 20 : 14,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        24fps previs - {format}
      </div>
    </AbsoluteFill>
  );
};
