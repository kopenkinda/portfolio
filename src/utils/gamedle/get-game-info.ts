import fetch from "isomorphic-fetch";
import { defaultBody } from "./constants";
import fs from "fs";

export type GameMeta = {
  value: number;
  label: string;
  collection: number;
};

export namespace Gamedle {
  const path = "./public/gamedle-games.json";
  export const getGames = async () => {
    try {
      const cached = fs.readFileSync(path, "utf-8");
      const parsed = JSON.parse(cached);
      return parsed as Game[];
    } catch (e) {}
    const initialList = await fetch("https://www.gamedle.wtf/search2").then(
      (data) => data.json() as Promise<GameMeta[]>,
    );
    const results = [] as Game[];
    const toFetch = initialList.map((meta) =>
      fetch("https://www.gamedle.wtf/giveItATryWrittenUnlimited", {
        headers: {
          accept: "application/json",
          "accept-language": "en-US,en;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/json",
          pragma: "no-cache",
          "sec-ch-ua":
            '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "x-requested-with": "XMLHttpRequest",
          Referer: "https://www.gamedle.wtf/guessunlimited",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: JSON.stringify({
          ...defaultBody,
          attemps: [{ value: "" + meta.value, label: meta.label }],
        }),
        method: "POST",
      })
        .then((data) => data.json() as Promise<Try>)
        .then((_try) => _try.attemps.at(0)),
    );
    for await (const gamePromise of toFetch) {
      results.push(gamePromise!);
    }
    fs.writeFileSync(path, JSON.stringify(results));
    return results;
  };
}

export interface Try {
  gameLegendAC: GameLegendAC;
  attemps: Game[];
  gameStatus: string;
  legendBoardAC: LegendBoardAC;
  index: number;
  statistics: Statistics;
  originalWritten: null;
}

export interface Game {
  value: number;
  label: string;
  base64: null;
  platforms: GameEngine[];
  genres: GameEngine[];
  collection: number;
  releaseYear: string;
  involved_companies: InvolvedCompany[];
  game_engines: GameEngine[];
  game_modes: number[];
  player_perspectives: number[];
  s3_id: string;
  s3_artwork_id: null;
  summary: null;
  themes: GameEngine[];
  platformsCoincidence: number;
  genresCoincidence: number;
  collectionCoincidence: boolean;
  releaseYearCoincidence: number;
  involved_companiesCoincidence: number;
  game_enginesCoincidence: number;
  game_modesCoincidence: number;
  player_perspectiveCoincidence: number;
  themesCoincidence: number;
}

export interface GameEngine {
  _id: ID;
  id: number;
  name: string;
}

export interface ID {
  timestamp: number;
  date: string;
}

export interface InvolvedCompany {
  _id: ID | null;
  id: number;
  name: string;
  developer: boolean;
  publisher: boolean;
  company: number;
}

export interface GameLegendAC {
  value: number;
  label: string;
  platforms: GameEngine[];
  genres: GameEngine[];
  themes: GameEngine[];
  involved_companies: InvolvedCompany[];
  game_engines: GameEngine[];
  game_modes: number[];
  player_perspectives: number[];
  s3_id: string;
  collection: number;
  releaseYear: string;
  enc: boolean;
  summary: string;
  clueyear: boolean;
  cluegenres: boolean;
  clueplatforms: boolean;
  usedClue: boolean;
}

export interface LegendBoardAC {
  _id: null;
  id: string;
  shuffledorder: number[];
  creation: null;
}

export interface Statistics {
  current_streaks: number;
  played: number;
  max_streaks: number;
  current_attemps_number: number;
  dayid: null;
}
