// A quiet tick when a pointer moves onto a link, and a click when one is pressed.
// The tick is a few milliseconds of noise through a band filter, synthesised with Web Audio. The
// click is the toggle sound from SND01 by SND (https://snd.dev), credited in the README.
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
let clickFile: Promise<ArrayBuffer> | undefined;
let click: Promise<AudioBuffer> | undefined;

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

// The browser caches the file across pages; it's fetched early so the first press can play it.
const loadClick = () => (clickFile ??= fetch("/sounds/snd01-toggle.wav").then((response) => response.arrayBuffer()));
if (wanted()) void loadClick();

function start() {
  audio ??= new AudioContext();
  click ??= loadClick().then((data) => audio!.decodeAudioData(data));
  void audio.resume();
  return audio;
}

async function playClick() {
  const context = start();
  const source = context.createBufferSource();
  const level = context.createGain();
  source.buffer = await click!;
  level.gain.value = 0.5;
  source.connect(level).connect(context.destination);
  source.start();
}

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

/** `band` is where the tick's energy sits (higher is lighter), `length` its decay in seconds. */
function tick(band: number, volume: number, length: number) {
  if (!audio) return;
  if (!noise) {
    noise = audio.createBuffer(1, audio.sampleRate * 0.05, audio.sampleRate);
    const samples = noise.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  }
  const at = audio.currentTime;
  const source = audio.createBufferSource();
  const filter = audio.createBiquadFilter();
  const level = audio.createGain();
  source.buffer = noise;
  filter.type = "bandpass";
  filter.frequency.value = band;
  filter.Q.value = 1.2;
  level.gain.setValueAtTime(volume, at);
  level.gain.exponentialRampToValueAtTime(0.0001, at + length);
  source.connect(filter).connect(level).connect(audio.destination);
  source.start(at);
  source.stop(at + length);
}

const linkAt = (target: EventTarget | null) => (target instanceof Element ? target.closest("a[href]") : null);

document.addEventListener("pointerover", (event) => {
  const link = linkAt(event.target);
  // Only on entering a link (not moving between its children), and only for a mouse or pen:
  // a tap also fires pointerover, and would click twice.
  if (!isSoundOn() || !link || link === linkAt(event.relatedTarget) || event.pointerType === "touch") return;
  if (start().state === "running") tick(5000, 0.1, 0.012);
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
