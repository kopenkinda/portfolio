// A quiet tick when a pointer moves onto a link, and a click when one is pressed.
// The tick is a few milliseconds of noise through a band filter, synthesised with Web Audio. The
// click is the toggle sound from SND01 by SND (https://snd.dev), credited in the README.
//
// Browsers keep audio off until the visitor clicks or presses a key. Chrome carries that over
// to the next same-site page, so after the first click hovers can tick straight away. Until audio
// is on, hovers stay silent: queuing their ticks would play them all at once when it turns on.

let audio: AudioContext | undefined;
let noise: AudioBuffer | undefined;

// Fetched right away (the browser caches it across pages), decoded once audio exists.
const clickFile = fetch("/sounds/snd01-toggle.wav").then((response) => response.arrayBuffer());
let click: Promise<AudioBuffer> | undefined;

function start() {
  audio ??= new AudioContext();
  click ??= clickFile.then((data) => audio!.decodeAudioData(data));
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
  if (!link || link === linkAt(event.relatedTarget) || event.pointerType === "touch") return;
  if (start().state === "running") tick(5000, 0.1, 0.012);
});

document.addEventListener("pointerdown", (event) => {
  // Any press turns audio on for this page; a press on a link also clicks. Pressing, not the click,
  // gives the sound a head start before the page navigates away.
  void start().resume();
  if (linkAt(event.target)) void playClick();
});

document.addEventListener("keydown", (event) => {
  void start().resume();
  if (event.key === "Enter" && linkAt(event.target)) void playClick();
});
