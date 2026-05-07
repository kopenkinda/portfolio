import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawn } from "node:child_process";
import sharp from "sharp";

interface CliArgs {
  seed?: number;
  text?: string;
  out?: string;
}

interface GeneratorConfig {
  seed: number;
  text: string;
  out: string;
}

interface RunResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const DEFAULT_OUT = "public/generated-background.png";
const WIDTH = 1920;
const HEIGHT = 1080;
const CAPTURE_HEIGHT = HEIGHT + 120;

const config = parseConfig(process.argv.slice(2));

const outputPath = resolve(ROOT, config.out);
const tmpDir = await mkdtemp(resolve(tmpdir(), "portfolio-bg-"));
const htmlPath = resolve(tmpDir, "background.html");
const screenshotPath = resolve(tmpDir, "background.png");

try {
  await writeFile(htmlPath, makeHtml(config.seed, config.text), "utf8");

  const chrome = chromePath();
  const result = await run(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--window-size=${WIDTH},${CAPTURE_HEIGHT}`,
    `--screenshot=${screenshotPath}`,
    `--virtual-time-budget=${Math.max(1000, config.seed * 20 + 500)}`,
    pathToFileURL(htmlPath).href,
  ]);

  if (result.code !== 0) {
    fail(result.stderr || `Chrome exited with code ${result.code}`);
  }

  await mkdir(resolve(outputPath, ".."), { recursive: true });
  await writeFile(
    outputPath,
    await sharp(await readFile(screenshotPath))
      .extract({ left: 0, top: 0, width: WIDTH, height: HEIGHT })
      .png()
      .toBuffer(),
  );
  console.log(`Generated ${outputPath}`);
} finally {
  await rm(tmpDir, { recursive: true, force: true });
}

function makeHtml(seed: number, text: string): string {
  const p5Url = pathToFileURL(resolve(ROOT, "node_modules/p5/lib/p5.min.js")).href;
  const fontUrl = pathToFileURL(
    resolve(ROOT, ".astro/fonts/font-doto-100-900-normal-latin-eae8a2c8b642d469.woff2"),
  ).href;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {
        font-family: "DotoGenerated";
        src: url("${fontUrl}") format("woff2");
        font-weight: 100 900;
        font-style: normal;
      }

      html,
      body {
        margin: 0;
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        overflow: hidden;
        background: #111;
        position: relative;
      }

      canvas {
        display: block;
      }

      #label {
        position: absolute;
        top: 50%;
        left: 130px;
        z-index: 1;
        margin: 0;
        transform: translateY(-50%);
      }

      #label .line {
        display: block;
        width: fit-content;
        padding: 10px 18px 8px;
        background: #fff;
        color: #111827;
        font-family: "DotoGenerated", sans-serif;
        font-size: 112px;
        font-weight: 900;
        line-height: 0.96;
        text-align: left;
        white-space: pre;
        font-variation-settings: "ROND" 100;
      }

      #label .line + .line {
        margin-top: -1px;
      }
    </style>
  </head>
  <body>
    <div id="label">${renderLabelHtml(text)}</div>
    <script src="${p5Url}"></script>
    <script>
      const requestedFrames = ${JSON.stringify(seed)};
      const palette = ["#111827", "#164e63", "#be123c", "#f59e0b", "#84cc16", "#f8fafc"];
      const fontFamily = "DotoGenerated";
      let fontReady = false;
      let renderedFrames = 0;

      function setup() {
        pixelDensity(1);
        createCanvas(window.innerWidth, window.innerHeight);
        randomSeed(requestedFrames || 1);
        noiseSeed(requestedFrames || 1);
        frameRate(60);

        document.fonts.load('900 112px "' + fontFamily + '"').then(() => {
          fontReady = true;
        });
      }

      function draw() {
        renderBackground();
        renderedFrames += 1;

        if (fontReady && renderedFrames >= Math.max(1, requestedFrames)) {
          noLoop();
        }
      }

      function renderBackground() {
        background("#0f172a");
        noStroke();

        for (let y = 0; y < height; y += 14) {
          for (let x = 0; x < width; x += 14) {
            const n = noise(x * 0.006, y * 0.006, renderedFrames * 0.012);
            const c = color(palette[floor(n * palette.length) % palette.length]);
            c.setAlpha(70 + n * 120);
            fill(c);
            rect(x, y, 16, 16);
          }
        }

        for (let i = 0; i < 140; i++) {
          const n = noise(i * 0.08, renderedFrames * 0.018);
          fill(palette[i % palette.length] + "99");
          circle(
            (random(width) + renderedFrames * (0.6 + n)) % width,
            random(height),
            random(6, 42)
          );
        }
      }
    </script>
  </body>
</html>`;
}

function parseArgs(argv: string[]): CliArgs {
  const parsed: CliArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--seed") {
      parsed.seed = Number(argv[++index]);
    } else if (arg === "--text") {
      parsed.text = decodeCliText(argv[++index] ?? "");
    } else if (arg === "--out") {
      parsed.out = argv[++index];
    }
  }

  return parsed;
}

function parseConfig(argv: string[]): GeneratorConfig {
  const args = parseArgs(argv);

  const seed = args.seed;

  if (seed === undefined || !Number.isInteger(seed) || seed < 0) {
    fail("Usage: pnpm generate:background -- --seed <int> --text <text> [--out <path>]");
  }

  if (!args.text) {
    fail("Usage: pnpm generate:background -- --seed <int> --text <text> [--out <path>]");
  }

  return {
    seed,
    text: args.text,
    out: args.out ?? DEFAULT_OUT,
  };
}

function decodeCliText(value: string): string {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderLabelHtml(value: string): string {
  return value
    .split("\n")
    .map((line) => `<span class="line">${escapeHtml(line)}</span>`)
    .join("");
}

function chromePath(): string {
  if (process.platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }

  return process.env.CHROME_BIN ?? "google-chrome";
}

function run(command: string, args: string[]): Promise<RunResult> {
  return new Promise((resolveRun) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk;
    });
    child.on("close", (code) => resolveRun({ code, stdout, stderr }));
  });
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}
