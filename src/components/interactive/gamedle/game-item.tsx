import { type Game } from "~/utils/gamedle/get-game-info";
import { modeToLabel, perspectiveToLabel } from "./filters.store";
import { IconList } from "./icon-list";
import {
  IconDevicesPc,
  IconBooks,
  IconBrush,
  IconBrandAppleArcade,
  IconEngine,
  IconBuildingSkyscraper,
  IconPerspective,
} from "@tabler/icons-react";

const GameItem = function ({ game }: { game: Game }) {
  const imgSrc = `https://d2c6c3qulxklrf.cloudfront.net/covers/webp/${game.s3_id}.webp`;
  const platforms = game.platforms.map((gamePlatform) => gamePlatform.name);
  const genres = game.genres.map((gameGenre) => gameGenre.name);
  const themes = game.themes.map((gameTheme) => gameTheme.name);
  const gameModes = game.game_modes.map((gameModeId) =>
    modeToLabel(gameModeId),
  );
  const gameEngines = game.game_engines.map((gameEngine) => gameEngine.name);
  const involvedCompanies = game.involved_companies.map(
    (involvedCompany) => involvedCompany.name,
  );
  const playerPerspectives = game.player_perspectives.map((perspectiveId) =>
    perspectiveToLabel(perspectiveId),
  );

  return (
    <li className="mt-2 flex w-full items-center gap-2 rounded border border-neutral-200 bg-neutral-50 px-3 py-4 dark:border-neutral-700 dark:bg-neutral-800">
      <div className="relative grid aspect-[9/12] w-full max-w-[6rem] place-items-center overflow-hidden rounded text-center">
        <img
          src={imgSrc}
          alt={game.label}
          loading="lazy"
          decoding="async"
          className="absolute h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <strong className="mr-2 text-lg font-bold">{game.label}</strong>
          <small className="font-normal text-neutral-600 dark:text-neutral-400">
            {game.releaseYear}
          </small>
        </div>
        <div className="mt-1 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          <IconList
            label="Platforms"
            icon={<IconDevicesPc stroke={1} size={18} />}
            elements={platforms}
          />
          <IconList
            label="Genres"
            icon={<IconBooks stroke={1} size={18} />}
            elements={genres}
          />
          <IconList
            label="Themes"
            icon={<IconBrush stroke={1} size={18} />}
            elements={themes}
          />
          <IconList
            label="Game Modes"
            icon={<IconBrandAppleArcade stroke={1} size={18} />}
            elements={gameModes}
          />
          <IconList
            label="Game Engines"
            icon={<IconEngine stroke={1} size={18} />}
            elements={gameEngines}
          />
          <IconList
            label="Involved Companies"
            icon={<IconBuildingSkyscraper stroke={1} size={18} />}
            elements={involvedCompanies}
          />
          <IconList
            label="Player Perspectives"
            icon={<IconPerspective stroke={1} size={18} />}
            elements={playerPerspectives}
          />
        </div>
      </div>
    </li>
  );
};

export default GameItem;
