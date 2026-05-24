import { Composition } from "remotion";
import { BoutiqueReelAd, DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./BoutiqueReelAd";

export const RemotionRoot = () => {
  return (
    <Composition
      id="BoutiqueReelAd"
      component={BoutiqueReelAd}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
