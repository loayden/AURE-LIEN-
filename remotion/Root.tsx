import { Composition, Folder } from "remotion";
import { DrapeHeroFilm, drapeDurationInFrames, drapeFps } from "./DrapeHeroFilm";

export const RemotionRoot = () => {
  return (
    <Folder name="DRAPE">
      <Composition
        id="DrapeHeroFilmVertical"
        component={DrapeHeroFilm}
        durationInFrames={drapeDurationInFrames}
        fps={drapeFps}
        width={2160}
        height={3840}
        defaultProps={{ format: "vertical" }}
      />
      <Composition
        id="DrapeHeroFilmLandscape"
        component={DrapeHeroFilm}
        durationInFrames={drapeDurationInFrames}
        fps={drapeFps}
        width={3840}
        height={2160}
        defaultProps={{ format: "landscape" }}
      />
      <Composition
        id="DrapeHeroFilmSquare"
        component={DrapeHeroFilm}
        durationInFrames={drapeDurationInFrames}
        fps={drapeFps}
        width={2160}
        height={2160}
        defaultProps={{ format: "square" }}
      />
    </Folder>
  );
};
