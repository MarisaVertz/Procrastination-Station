// audio setup
var audios = {};
var volumes = {};
var DEFAULT_VOLUME = 0.8;

function isLoop(src) {
  return src.toLowerCase().includes("/loop_");
}

function getAudio(key, src) {
  if (!audios[key]) audios[key] = new Audio(src);

  var a = audios[key];
  if (a.src.indexOf(src) === -1) {
    a.src = src;
    a.load();
  }

  a.loop = isLoop(src);
  a.preload = "auto";
  a.volume = volumes[key] || DEFAULT_VOLUME;
  return a;
}

function playFromStart(key) {
  var a = audios[key];
  if (!a) return;
  a.pause();
  a.currentTime = 0;
  a.play();
}

function stopSound(key) {
  var a = audios[key];
  if (!a) return;
  a.pause();
  a.currentTime = 0;
}

function setLoopActive(key, active) {
  var btn = document.querySelector("." + key);
  if (btn) {
    if (active) btn.classList.add("playing");
    else btn.classList.remove("playing");
  }
}

function animateButton(key) {
  var btn = document.querySelector("." + key);
  if (!btn) return;
  btn.classList.add("pressed");
  setTimeout(function () {
    btn.classList.remove("pressed");
  }, 100);
}

// volume sliders
function setupSliders() {
  var sliders = document.querySelectorAll(".vol[data-key]");
  for (var i = 0; i < sliders.length; i++) {
    var slider = sliders[i];
    var key = slider.dataset.key.toLowerCase();

    var raw = slider.value || "80";
    var val = parseFloat(raw);
    if (val > 1) val = val / 100;
    volumes[key] = val;
    if (audios[key]) audios[key].volume = val;

    slider.addEventListener("input", function () {
      var keyNow = this.dataset.key.toLowerCase();
      var valNow = parseFloat(this.value);
      if (valNow > 1) valNow = valNow / 100;
      volumes[keyNow] = valNow;
      if (audios[keyNow]) audios[keyNow].volume = valNow;
    });
  }
}
setupSliders();

// key mapping
var ONE_SHOTS = ["i", "o", "p", "j", "k", "l", "v", "b", "n", "m"];
var suppressClick = {};

var pads = document.querySelectorAll(".drum");
for (var i = 0; i < pads.length; i++) {
  var btn = pads[i];
  var key = btn.innerHTML.trim().toLowerCase();

  btn.addEventListener("mousedown", function (e) {
    var keyChar = this.innerHTML.trim().toLowerCase();
    if (e.button !== 0) return;
    if (ONE_SHOTS.indexOf(keyChar) === -1) return;
    suppressClick[keyChar] = true;
    playSound(keyChar, "oneshot");
    animateButton(keyChar);
    simulateHover(keyChar);
  });

  btn.addEventListener("click", function () {
    var keyChar = this.innerHTML.trim().toLowerCase();
    if (suppressClick[keyChar]) {
      suppressClick[keyChar] = false;
      return;
    }
    playSound(keyChar, "toggle");
    animateButton(keyChar);
  });
}

document.addEventListener("keydown", function (e) {
  if (e.repeat) return;
  var key = e.key.toLowerCase();
  playSound(key, "toggle");
  animateButton(key);

  if (ONE_SHOTS.indexOf(key) !== -1) {
    simulateHover(key);
  }
});

function simulateHover(key) {
  var btn = document.querySelector("." + key);
  if (!btn) return;
  btn.classList.add("hover-sim");
  setTimeout(function () {
    btn.classList.remove("hover-sim");
  }, 200);
}

// sound logic
function playSound(key, mode) {
  var sounds = {
    w: "sounds/Loop_BassRif.wav",
    a: "sounds/Loop_Base.wav",
    s: "sounds/Loop_BoupBass.wav",
    d: "sounds/Loop_Chords.mp3",
    h: "sounds/oneShot_boop.wav",
    j: "sounds/oneShot_Snip.mp3",
    k: "sounds/oneShot_Kick.mp3",
    l: "sounds/oneShot_Snap.mp3",
    b: "sounds/oneShot_Snare.mp3",
    n: "sounds/oneShot_Clap.mp3",
  };

  var src = sounds[key];
  if (!src) return;

  var a = getAudio(key, src);
  var isLoop = a.loop;
  var isPlaying = !a.paused;

  if (!isLoop) {
    playFromStart(key);
    return;
  }

  if (isPlaying) {
    stopSound(key);
    setLoopActive(key, false);
  } else {
    playFromStart(key);
    setLoopActive(key, true);
  }
}

function simulateHover(key) {
  var btn = document.querySelector("." + key);
  if (!btn) return;
  btn.classList.add("hover-sim");
  setTimeout(function () {
    btn.classList.remove("hover-sim");
  }, 150);
}
