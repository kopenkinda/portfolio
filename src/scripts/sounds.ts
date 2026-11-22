// A quiet tick when a pointer moves onto a link, and a click when one is pressed; plus the sounds
// of the home page scene. The tick and the glint chime are synthesised with Web Audio. The rest
// are short recordings in public/sounds, credited in the README: the click is the toggle sound
// from SND01 by SND (https://snd.dev), the splashes and wings are CC0 recordings from Freesound.
//
// Sound is on by default, but browsers keep audio off until the visitor clicks or presses a key.
// So the speaker icon shows muted until that first interaction, which turns sound on for real
// (<html data-sound="on">). Only pressing the speaker button saves a choice ("sound" in
// localStorage); a saved "off" keeps sound off on every visit. Chrome carries the first
// interaction over to the next same-site page, so the head script in Layout.astro shows sound as
// on straight away once it has been unlocked in this tab. Until audio actually runs, hovers stay
// silent, since queuing their ticks would play them all at once when it starts.

const root = document.documentElement;
let audio: AudioContext | undefined;
let noise: AudioBuffer | undefined;
const files = new Map<string, Promise<ArrayBuffer>>();
const decoded = new Map<string, Promise<AudioBuffer>>();

const CLICK = "/sounds/snd01-toggle.wav";
const SPLASHES = ["/sounds/splash-1.m4a", "/sounds/splash-2.m4a", "/sounds/splash-3.m4a", "/sounds/splash-4.m4a"];
const WINGS = "/sounds/wings.m4a";
const SWOOSH = "/sounds/swoosh.m4a";
const RIP = "/sounds/rip.m4a";

/** Whether sound is on right now: wanted, and unlocked by an interaction. */
export const isSoundOn = () => root.dataset.sound === "on";

/** Whether the visitor wants sound: true unless they turned it off with the speaker button. */
function wanted() {
  try {
    return localStorage.getItem("sound") !== "off";
  } catch {
    return true;
  }
}

/** Fetch recordings ahead of time, so the first press doesn't wait for the network. The browser
    caches them across pages. Skipped when the visitor has turned sound off. */
export function preload(urls: string[]) {
  if (!wanted()) return;
  for (const url of urls) if (!files.has(url)) files.set(url, fetch(url).then((response) => response.arrayBuffer()));
}
preload([CLICK, SWOOSH, RIP]);

function start() {
  audio ??= new AudioContext();
  void audio.resume();
  return audio;
}

/** Play a recording. Only called from a press, so it may start audio. */
async function playFile(url: string, volume: number) {
  if (!isSoundOn()) return;
  const context = start();
  preload([url]);
  if (!decoded.has(url)) decoded.set(url, files.get(url)!.then((data) => context.decodeAudioData(data.slice(0))));
  const source = context.createBufferSource();
  const level = context.createGain();
  source.buffer = await decoded.get(url)!;
  level.gain.value = volume;
  source.connect(level).connect(context.destination);
  source.start();
}
const playClick = () => playFile(CLICK, 0.5);

function show(on: boolean) {
  if (on) root.dataset.sound = "on";
  else delete root.dataset.sound;
  try {
    if (on) sessionStorage.setItem("sound-unlocked", "1");
  } catch {
    // Storage blocked: the next page starts muted until its first interaction.
  }
  document.dispatchEvent(new CustomEvent("soundchange"));
}

/** The speaker button. Saves the choice; turning sound on plays the click once, so the visitor
    hears what they turned on. */
export function setSound(on: boolean) {
  try {
    localStorage.setItem("sound", on ? "on" : "off");
  } catch {
    // Storage blocked: the choice holds for this page only.
  }
  show(on);
  if (on) void playClick();
}

/** Audio, but only when sound is on and the browser lets it play; otherwise nothing sounds. */
const playable = () => (isSoundOn() && audio?.state === "running" ? audio : undefined);

/** A few milliseconds of noise through a band filter: the hover tick. `band` is where its
    energy sits (higher is lighter), `length` its decay in seconds. */
function tick(band: number, volume: number, length: number) {
  const context = playable();
  if (!context) return;
  if (!noise) {
    noise = context.createBuffer(1, context.sampleRate * 0.05, context.sampleRate);
    const samples = noise.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  }
  const at = context.currentTime;
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const level = context.createGain();
  source.buffer = noise;
  filter.type = "bandpass";
  filter.frequency.value = band;
  filter.Q.value = 1.2;
  level.gain.setValueAtTime(volume, at);
  level.gain.exponentialRampToValueAtTime(0.0001, at + length);
  source.connect(filter).connect(level).connect(context.destination);
  source.start(at);
  source.stop(at + length);
}

/** A short sine note with a quick attack and a ringing decay: the glint chime. */
function note(pitch: number, volume: number, length: number, delay = 0) {
  const context = playable();
  if (!context) return;
  const at = context.currentTime + delay;
  const tone = context.createOscillator();
  const level = context.createGain();
  tone.frequency.value = pitch;
  level.gain.setValueAtTime(0.0001, at);
  level.gain.exponentialRampToValueAtTime(volume, at + 0.005);
  level.gain.exponentialRampToValueAtTime(0.0001, at + length);
  tone.connect(level).connect(context.destination);
  tone.start(at);
  tone.stop(at + length + 0.02);
}

// Sounds for the home page scene (src/components/andorra/AndorraScene.astro).

/** The scene's recordings, for it to preload. */
export const sceneSounds = [...SPLASHES, WINGS];

let lastSplash = -1;
/** A stone into the river: one of four recordings, never the same one twice in a row. */
export function splash() {
  let pick = Math.floor(Math.random() * SPLASHES.length);
  if (pick === lastSplash) pick = (pick + 1) % SPLASHES.length;
  lastSplash = pick;
  void playFile(SPLASHES[pick], 0.18);
}

/** Pigeons taking off. The recording is much denser than the splashes, so it plays quieter. */
export function flutter() {
  void playFile(WINGS, 0.07);
}

/** Sun catching Caldea's glass: two high, quiet chimes. */
export function sparkle() {
  note(2637, 0.018, 0.5);
  note(3951, 0.012, 0.45, 0.07);
}

/** The colours changing: the light or dark mode, or a wall theme put on or taken off. */
export const swoosh = () => void playFile(SWOOSH, 0.15);

/** The dots valley breaking into jigsaw pieces: a quick paper rip. */
export const rip = () => void playFile(RIP, 0.2);

/** A jigsaw piece of the dots valley going into place: the click, quieter. */
export const snap = () => void playFile(CLICK, 0.3);

const linkAt = (target: EventTarget | null) => (target instanceof Element ? target.closest("a[href]") : null);

document.addEventListener("pointerover", (event) => {
  const link = linkAt(event.target);
  // Only on entering a link (not moving between its children), and only for a mouse or pen:
  // a tap also fires pointerover, and would click twice.
  if (!isSoundOn() || !link || link === linkAt(event.relatedTarget) || event.pointerType === "touch") return;
  start();
  tick(5000, 0.1, 0.012);
});

// The first press or key on a page unlocks audio. The speaker button is left to its own handler,
// or a first press on it would turn sound on and straight back off.
function interact(target: EventTarget | null, pressesLink: boolean) {
  if (!wanted() || (target instanceof Element && target.closest("[data-control=sound]"))) return;
  start();
  if (!isSoundOn()) show(true);
  if (pressesLink) void playClick();
}

// Pressing, not the click, gives the sound a head start before the page navigates away.
document.addEventListener("pointerdown", (event) => interact(event.target, Boolean(linkAt(event.target))));
document.addEventListener("keydown", (event) =>
  interact(event.target, event.key === "Enter" && Boolean(linkAt(event.target))),
);
