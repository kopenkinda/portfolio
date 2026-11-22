// A quiet tick when a pointer moves onto a link, and a click when one is pressed.
// The tick is a few milliseconds of noise through a band filter, synthesised with Web Audio. The
// click is the toggle sound from SND01 by SND (https://snd.dev), credited in the README.
//
// Sound is off until the visitor turns it on with the speaker button in the top bar; the choice
// is saved, and the inline script in Layout.astro marks <html data-sound="on"> before paint.
// Browsers also keep audio off until the visitor clicks or presses a key on the page. Chrome
// carries that over to the next same-site page; until then hovers stay silent, since queuing their
// ticks would play them all at once when audio turns on.

const root = document.documentElement;
let audio: AudioContext | undefined;
let noise: AudioBuffer | undefined;
let clickFile: Promise<ArrayBuffer> | undefined;
let click: Promise<AudioBuffer> | undefined;

export const isSoundOn = () => root.dataset.sound === "on";

// The browser caches the file across pages; it's only fetched once sound is on.
const loadClick = () => (clickFile ??= fetch("/sounds/snd01-toggle.wav").then((response) => response.arrayBuffer()));
if (isSoundOn()) void loadClick();

function start() {
  audio ??= new AudioContext();
  click ??= loadClick().then((data) => audio!.decodeAudioData(data));
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

/** Turn sound on or off. Called from a click, so audio can start right away; turning it on plays
    the click once, so the visitor hears what they turned on. */
export function setSound(on: boolean) {
  if (on) root.dataset.sound = "on";
  else delete root.dataset.sound;
  try {
    if (on) localStorage.setItem("sound", "on");
    else localStorage.removeItem("sound");
  } catch {
    // Storage blocked: sound stays on for this page only.
  }
  if (on) {
    void start().resume();
    void playClick();
  }
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

document.addEventListener("pointerdown", (event) => {
  // Any press lets audio start on this page; a press on a link also clicks. Pressing, not the
  // click, gives the sound a head start before the page navigates away.
  if (!isSoundOn()) return;
  void start().resume();
  if (linkAt(event.target)) void playClick();
});

document.addEventListener("keydown", (event) => {
  if (!isSoundOn()) return;
  void start().resume();
  if (event.key === "Enter" && linkAt(event.target)) void playClick();
});
