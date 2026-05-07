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
    `--virtual-time-budget=${Math.max(5000, config.seed * 40 + 1000)}`,
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
  const p5Url = pathToFileURL(
    resolve(ROOT, "node_modules/p5/lib/p5.min.js"),
  ).href;
  const fontUrl = pathToFileURL(
    resolve(
      ROOT,
      ".astro/fonts/font-doto-100-900-normal-latin-eae8a2c8b642d469.woff2",
    ),
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

      #label .accent {
        color: oklch(70.4% 0.14 182.503);
      }

      #label .line + .line {
        margin-top: -1px;
      }

      #attribution {
        position: absolute;
        right: 28px;
        bottom: 24px;
        z-index: 1;
        padding: 6px 8px;
        background: rgb(0 0 0 / 0.62);
        color: rgb(255 255 255 / 0.86);
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 16px;
        font-weight: 500;
        line-height: 1;
        letter-spacing: 0;
        white-space: nowrap;
      }

    </style>
  </head>
  <body>
    <div id="label">${renderLabelHtml(text)}</div>
    <div id="attribution">bg generated with script by Shunsuke TAKAWO @takawo</div>
    <script src="${p5Url}"></script>
    <script>
      new p5((p) => {
        const requestedFrames = ${JSON.stringify(seed)};
        const fontFamily = "DotoGenerated";
        const seedValue = Math.max(1, requestedFrames);
        const colorScheme = [
          ["#F27EA9", "#366CD9", "#5EADF2", "#636E73", "#F2E6D8"],
          ["#D962AF", "#58A6A6", "#8AA66F", "#F29F05", "#F26D6D"],
          ["#222940", "#D98E04", "#F2A950", "#BF3E21", "#F2F2F2"],
          ["#1B618C", "#55CCD9", "#F2BC57", "#F2DAAC", "#F24949"],
          ["#074A59", "#F2C166", "#F28241", "#F26B5E", "#F2F2F2"],
          ["#023059", "#459DBF", "#87BF60", "#D9D16A", "#F2F2F2"],
          ["#632973", "#02734A", "#F25C05", "#F29188", "#F2E0DF"],
          ["#8D95A6", "#0A7360", "#F28705", "#D98825", "#F2F2F2"],
          ["#4146A6", "#063573", "#5EC8F2", "#8C4E03", "#D98A29"],
          ["#034AA6", "#72B6F2", "#73BFB1", "#F2A30F", "#F26F63"],
          ["#303E8C", "#F2AE2E", "#F28705", "#D91414", "#F2F2F2"],
          ["#424D8C", "#84A9BF", "#C1D9CE", "#F2B705", "#F25C05"],
          ["#D9D7D8", "#3B5159", "#5D848C", "#7CA2A6", "#262321"],
          ["#906FA6", "#025951", "#252625", "#D99191", "#F2F2F2"],
        ];
        let fontReady = false;
        let renderedFrames = 0;
        let texture;
        let palette;

        p.setup = () => {
          p.pixelDensity(1);
          p.createCanvas(window.innerWidth, window.innerHeight);
          p.colorMode(p.HSB, 360, 100, 100, 100);
          p.randomSeed(seedValue);
          p.noiseSeed(seedValue);
          palette = colorScheme[Math.floor(p.random(colorScheme.length))].slice();
          shufflePalette();
          texture = p.createGraphics(p.width, p.height);
          texture.clear();
          texture.stroke(255, 75);
          for (let i = 0; i < p.width * p.height * 0.015; i++) {
            const r = (1 - p.random(p.random())) * (Math.sqrt(2) * p.width) / 2;
            const a = p.random(Math.PI * 2);
            texture.point(p.width / 2 + Math.cos(a) * r, p.height / 2 + Math.sin(a) * r);
          }
          document.fonts.load('900 112px "' + fontFamily + '"').then(() => {
            fontReady = true;
          });
        };

        p.draw = () => {
          p.blendMode(p.BLEND);
          p.background(0);
          p.randomSeed(seedValue + renderedFrames);
          drawPattern();
          p.blendMode(p.ADD);
          p.image(texture, 0, 0);
          renderedFrames += 1;
          if (fontReady && renderedFrames >= Math.max(1, requestedFrames)) {
            p.noLoop();
          }
        };

        function drawPattern() {
          const cells = 50;
          const offset = (p.width * (Math.sqrt(2) - 1)) / 2;
          const d = (p.width + offset * 2) / cells;
          let jStep = 1;
          for (let j = 0; j < cells; j += jStep) {
            jStep = Math.max(1, Math.floor(p.random(1, cells / 10)));
            if (j + jStep > cells || Math.abs(cells - (j + jStep)) < 3) jStep = cells - j;
            let iStep = jStep;
            for (let i = 0; i < cells; i += iStep) {
              iStep = jStep;
              if (i + iStep > cells || Math.abs(cells - (i + iStep)) <= cells / 15) iStep = cells - i;
              const x = -offset + i * d + (d / 2) * iStep;
              const y = -offset + j * d + (d / 2) * jStep;
              const distance = p.dist(x, y, p.width / 2, p.height / 2) / (Math.sqrt(2) * (p.width / 2 - offset));
              const t = easeInOutCirc(1 - ((renderedFrames / 100 + distance) % 1));
              drawLinePattern(x, y, d * iStep, d * jStep, t);
            }
          }
        }

        function drawLinePattern(centerX, centerY, patternW, patternH, t) {
          const ctx = p.drawingContext;
          const angle = Math.floor(p.random(4)) * Math.PI / 2;
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.rect(-patternW / 2, -patternH / 2, patternW, patternH);
          ctx.clip();

          const layers = Math.floor(p.random(1, 4));
          for (let layer = 0; layer < layers; layer++) {
            ctx.save();
            ctx.rotate(layer * Math.PI / 2);
            const skewX = Math.tan((t * 46 * (p.random() > 0.5 ? -1 : 1) * Math.PI) / 180);
            const skewY = Math.tan(((1 - t) * 46 * (p.random() > 0.5 ? -1 : 1) * Math.PI) / 180);
            ctx.transform(1, skewY, skewX, 1, -patternW / 2, -patternH / 2);
            const vertical = p.random() > 0.5;
            const steps = Math.floor(p.random(1, 6));
            const segment = patternW / steps;
            const dash = vertical ? patternH : segment;
            for (let i = 0; i < steps; i++) {
              const x = (i / steps) * patternW;
              ctx.setLineDash([dash / 2]);
              ctx.lineDashOffset = (renderedFrames + t * dash * 2) % (dash * 2);
              ctx.strokeStyle = palette[Math.floor(p.random(palette.length))];
              ctx.lineCap = "butt";
              ctx.beginPath();
              if (vertical) {
                ctx.lineWidth = segment / 2;
                const shifted = (x + segment / 2 + renderedFrames / 3) % patternW;
                ctx.moveTo(shifted, 0);
                ctx.lineTo(shifted, patternH);
              } else {
                ctx.lineWidth = patternH;
                ctx.moveTo(x + segment / 2 - segment / 4, patternH / 2);
                ctx.lineTo(x + segment / 2 + segment / 4, patternH / 2);
              }
              ctx.stroke();
            }
            ctx.restore();
          }
          ctx.setLineDash([]);
          ctx.restore();
        }

        function easeInOutCirc(x) {
          return x < 0.5
            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
        }

        function shufflePalette() {
          for (let i = palette.length - 1; i > 0; i--) {
            const j = Math.floor(p.random(i + 1));
            const tmp = palette[i];
            palette[i] = palette[j];
            palette[j] = tmp;
          }
        }
      });
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
    fail(
      "Usage: pnpm generate:background -- --seed <int> --text <text> [--out <path>]",
    );
  }

  if (!args.text) {
    fail(
      "Usage: pnpm generate:background -- --seed <int> --text <text> [--out <path>]",
    );
  }

  return {
    seed,
    text: args.text,
    out: args.out ?? DEFAULT_OUT,
  };
}

function decodeCliText(value: string): string {
  return value
    .replace(/\\\[/g, "\u0000")
    .replace(/\\\]/g, "\u0001")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .replace(/\u0000/g, "\\[")
    .replace(/\u0001/g, "\\]");
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
    .map((line) => `<span class="line">${renderFormattedText(line)}</span>`)
    .join("");
}

function renderFormattedText(value: string): string {
  let html = "";
  let buffer = "";
  let accented = false;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const next = value[index + 1];

    if (char === "\\" && (next === "[" || next === "]")) {
      buffer += next;
      index += 1;
      continue;
    }

    if (char === "[" && !accented) {
      html += escapeHtml(buffer);
      buffer = "";
      accented = true;
      continue;
    }

    if (char === "]" && accented) {
      html += `<span class="accent">${escapeHtml(buffer)}</span>`;
      buffer = "";
      accented = false;
      continue;
    }

    buffer += char;
  }

  if (accented) {
    html += escapeHtml("[");
  }

  return html + escapeHtml(buffer);
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
