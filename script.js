const tiers = [
  { id: "SS", color: "#f75959" },
  { id: "S", color: "#ffbe7f" },
  { id: "A", color: "#ffde7f" },
  { id: "B", color: "#ffff7f" },
  { id: "C", color: "#c0ff7f" },
  { id: "FREE", label: "🤷", color: "#7ff9ff", emoji: true },
];

const tierSoundProfiles = {
  SS: { wave: "triangle", base: 523.25, notes: [0, 4, 7, 12, 16, 19], gain: 0.34, step: 0.14, duration: 0.52, filter: 4600, sparkle: 0.38 },
  S: { wave: "triangle", base: 493.88, notes: [0, 4, 7, 11, 14, 16], gain: 0.31, step: 0.15, duration: 0.48, filter: 4200, sparkle: 0.34 },
  A: { wave: "sine", base: 440, notes: [0, 4, 7, 9, 12], gain: 0.27, step: 0.16, duration: 0.44, filter: 3650, sparkle: 0.28 },
  B: { wave: "triangle", base: 392, notes: [0, 4, 7, 9, 12], gain: 0.23, step: 0.17, duration: 0.42, filter: 3200, sparkle: 0.22 },
  C: { wave: "triangle", base: 349.23, notes: [0, 2, 5, 7, 9], gain: 0.19, step: 0.18, duration: 0.4, filter: 2750, sparkle: 0.16 },
  FREE: { wave: "triangle", base: 293.66, notes: [0, -2, 0, 2, 5], gain: 0.15, step: 0.19, duration: 0.38, filter: 2200, sparkle: 0.1 },
};

const albums = [
  {
    id: "jay",
    shortTitle: "Jay",
    title: "Jay",
    year: "2000",
    song: "可爱女人",
    wave: "triangle",
    base: 392,
    notes: [0, 4, 7, 9, 7, 4, 2, 0],
    coverImage: "./assets/covers/jay.webp",
  },
  {
    id: "eight-dimensions",
    shortTitle: "The Eight Dimensions",
    title: "The Eight Dimensions",
    year: "2002",
    song: "半兽人",
    wave: "sawtooth",
    base: 294,
    notes: [0, 0, 3, 5, 3, 7, 5, 3],
    coverImage: "./assets/covers/eight-dimensions.webp",
  },
  {
    id: "november-chopin",
    shortTitle: "November's Chopin",
    title: "November's Chopin",
    year: "2005",
    song: "夜曲",
    wave: "triangle",
    base: 349,
    notes: [0, 4, 7, 11, 9, 7, 4, 0],
    coverImage: "./assets/covers/november-chopin.webp",
  },
  {
    id: "still-fantasy",
    shortTitle: "Still Fantasy",
    title: "Still Fantasy",
    year: "2006",
    song: "千里之外",
    wave: "sine",
    base: 262,
    notes: [0, 3, 7, 8, 7, 3, 2, 0],
    coverImage: "./assets/covers/still-fantasy.webp",
  },
  {
    id: "on-the-run",
    shortTitle: "On the Run",
    title: "On the Run",
    year: "2007",
    song: "牛仔很忙",
    wave: "square",
    base: 370,
    notes: [0, 7, 9, 7, 4, 7, 9, 12],
    coverImage: "./assets/covers/on-the-run.webp",
  },
  {
    id: "capricorn",
    shortTitle: "Capricorn",
    title: "Capricorn",
    year: "2008",
    song: "稻香",
    wave: "triangle",
    base: 294,
    notes: [0, 2, 4, 7, 4, 2, 0, -3],
    coverImage: "./assets/covers/capricorn.webp",
  },
  {
    id: "the-era",
    shortTitle: "The Era",
    title: "The Era",
    year: "2010",
    song: "超人不会飞",
    wave: "sawtooth",
    base: 311,
    notes: [0, 5, 7, 10, 7, 5, 3, 0],
    coverImage: "./assets/covers/the-era.webp",
  },
  {
    id: "bedtime-stories",
    shortTitle: "Bedtime Stories",
    title: "Bedtime Stories",
    year: "2016",
    song: "告白气球",
    wave: "sine",
    base: 349,
    notes: [0, 2, 4, 7, 9, 7, 4, 2],
    coverImage: "./assets/covers/bedtime-stories.webp",
  },
  {
    id: "children-of-the-sun",
    shortTitle: "Children of the Sun",
    title: "Children of the Sun",
    year: "2026",
    song: "太阳之子",
    wave: "triangle",
    base: 392,
    notes: [0, 4, 7, 12, 11, 7, 4, 0],
    coverImage: "./assets/covers/children-of-the-sun.jpg",
  },
  {
    id: "greatest-works",
    shortTitle: "Greatest Works of Art",
    title: "Greatest Works of Art",
    year: "2022",
    song: "最伟大的作品",
    wave: "triangle",
    base: 330,
    notes: [0, 7, 11, 12, 11, 7, 4, 0],
    coverImage: "./assets/covers/greatest-works.webp",
  },
];

const albumMap = Object.fromEntries(albums.map((album) => [album.id, album]));

const state = {
  pool: albums.map((album) => album.id),
  tiers: Object.fromEntries(tiers.map((tier) => [tier.id, []])),
  selectedAlbumId: albums[2].id,
  muted: false,
  audioUnlocked: false,
  drag: null,
  hoverZoneKey: null,
  dropEffect: null,
};

const app = document.querySelector("#app");
let audioEngine = null;
let dropEffectTimer = null;

render();

function render() {
  app.innerHTML = "";
  app.append(buildLayout());
}

function buildLayout() {
  const inner = createNode("div", "stage-inner");
  inner.append(buildHeader(), buildBoard(), buildPool());
  return inner;
}

function buildHeader() {
  const header = createNode("header", "stage-header");
  const title = createNode("h1", "stage-title");
  title.innerHTML = "JAY CHOU ALBUMS<br />TIER LIST";

  const button = createNode("button", "sound-toggle");
  button.type = "button";
  button.id = "muteToggle";
  button.setAttribute("aria-pressed", String(state.muted));
  button.setAttribute("aria-label", state.muted ? "开启声音" : "关闭声音");
  button.classList.toggle("is-muted", state.muted);
  button.textContent = state.muted ? "🔇" : "🔊";
  button.addEventListener("click", () => {
    state.audioUnlocked = true;
    state.muted = !state.muted;
    if (state.muted) {
      stopPreview();
    } else {
      ensureBackgroundAudio();
    }
    render();
  });

  header.append(title, button);
  return header;
}

function buildBoard() {
  const board = createNode("section", "tier-board");

  tiers.forEach((tier) => {
    const row = createNode("div", "tier-row");
    row.dataset.tierRow = tier.id;

    const label = createNode("div", "tier-label");
    label.textContent = tier.label || tier.id;
    label.style.background = tier.color;
    if (tier.emoji) {
      label.classList.add("is-emoji");
    }

    const drop = createNode("div", "tier-drop");
    drop.dataset.dropZone = "tier";
    drop.dataset.zoneKey = tier.id;
    if (state.hoverZoneKey === tier.id) {
      drop.classList.add("is-active");
    }
    if (state.dropEffect?.zoneKey === tier.id) {
      drop.classList.add("is-celebrating");
    }

    const list = createNode("div", "album-list");
    const ids = state.tiers[tier.id];

    ids.forEach((albumId, index) => {
      list.append(buildAlbumCard(albumMap[albumId], { zoneKey: tier.id, index }));
    });

    if (!ids.length) {
      const empty = createNode("div", "tier-row-empty");
      empty.textContent = "Drop here";
      list.append(empty);
    }

    drop.append(list);
    row.append(label, drop);
    board.append(row);
  });

  return board;
}

function buildPool() {
  const panel = createNode("section", "pool-panel");
  const title = createNode("h2", "pool-title");
  title.textContent = "Drag Album";

  const hint = createNode("p", "pool-hint");
  hint.textContent = "Drag to rank.";

  const scroll = createNode("div", "pool-scroll");
  scroll.dataset.dropZone = "pool";
  scroll.dataset.zoneKey = "pool";
  if (state.hoverZoneKey === "pool") {
    scroll.classList.add("is-active");
  }

  state.pool.forEach((albumId, index) => {
    scroll.append(buildPoolItem(albumMap[albumId], index));
  });

  panel.append(title, hint, scroll);
  return panel;
}

function buildAlbumCard(album, source) {
  const shell = createNode("div", "album-card-shell");
  const card = createNode("button", "album-card");
  card.type = "button";
  card.dataset.albumId = album.id;
  card.dataset.sourceZone = source.zoneKey;
  card.dataset.sourceIndex = String(source.index);
  card.classList.toggle("is-pool-card", source.zoneKey === "pool");
  card.style.setProperty("--cover-image", `url("${album.coverImage}")`);
  card.title = `${album.title} · ${album.song}`;
  card.setAttribute("aria-label", `${album.title}，代表曲 ${album.song}`);
  card.classList.toggle("is-selected", state.selectedAlbumId === album.id);
  if (state.drag?.albumId === album.id) {
    card.classList.add("is-drag-source");
  }
  if (state.dropEffect?.albumId === album.id && state.dropEffect?.zoneKey === source.zoneKey) {
    card.classList.add("is-settled");
    shell.classList.add("is-bursting");
  }

  const cover = createNode("img", "album-card-cover");
  cover.src = album.coverImage;
  cover.alt = `${album.title} cover`;
  cover.draggable = false;

  const year = createNode("span", "album-card-year");
  year.textContent = album.year;

  const subtitle = createNode("span", "album-card-subtitle");
  subtitle.textContent = album.song;

  const title = createNode("span", "album-card-title");
  title.textContent = album.shortTitle;

  card.append(cover, year, subtitle, title);
  card.addEventListener("pointerdown", (event) => handlePointerDown(event, album.id, source));

  shell.append(card);
  if (state.dropEffect?.albumId === album.id && state.dropEffect?.zoneKey === source.zoneKey) {
    shell.append(buildCardBurst());
  }

  return shell;
}

function buildPoolItem(album, index) {
  const item = createNode("div", "pool-item");
  item.append(
    buildAlbumCard(album, { zoneKey: "pool", index }),
    Object.assign(createNode("div", "pool-album-name"), {
      textContent: album.title,
    }),
  );
  return item;
}

function buildCardBurst() {
  const burst = createNode("span", "album-card-burst");
  const sparks = [
    { x: "-22px", y: "-18px", size: "8px", delay: "0ms", rotate: "18deg" },
    { x: "24px", y: "-14px", size: "7px", delay: "70ms", rotate: "-10deg" },
    { x: "28px", y: "10px", size: "9px", delay: "120ms", rotate: "24deg" },
    { x: "6px", y: "26px", size: "7px", delay: "90ms", rotate: "-18deg" },
    { x: "-24px", y: "18px", size: "8px", delay: "150ms", rotate: "12deg" },
    { x: "0px", y: "-28px", size: "6px", delay: "40ms", rotate: "0deg" },
  ];

  sparks.forEach((spark, index) => {
    const node = createNode("span", "album-card-spark");
    node.style.setProperty("--spark-x", spark.x);
    node.style.setProperty("--spark-y", spark.y);
    node.style.setProperty("--spark-size", spark.size);
    node.style.setProperty("--spark-delay", spark.delay);
    node.style.setProperty("--spark-rotate", spark.rotate);
    if (index % 2 === 1) {
      node.classList.add("is-diamond");
    }
    burst.append(node);
  });

  return burst;
}

function handlePointerDown(event, albumId, source) {
  if (event.button !== 0) {
    return;
  }

  event.preventDefault();
  state.audioUnlocked = true;
  ensureBackgroundAudio();

  const origin = event.currentTarget;
  const rect = origin.getBoundingClientRect();
  const ghost = origin.cloneNode(true);
  ghost.className = "album-card card-ghost";
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;

  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  state.drag = {
    albumId,
    sourceZone: source.zoneKey,
    sourceIndex: source.index,
    ghost,
    offsetX,
    offsetY,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
  };
  state.selectedAlbumId = albumId;

  document.body.append(ghost);
  positionGhost(event.clientX, event.clientY);
  origin.classList.add("is-drag-source");
  document.body.style.cursor = "grabbing";

  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);
  window.addEventListener("pointercancel", handlePointerUp);
}

function handlePointerMove(event) {
  if (!state.drag || event.pointerId !== state.drag.pointerId) {
    return;
  }

  if (!state.drag.moved) {
    const deltaX = Math.abs(event.clientX - state.drag.startX);
    const deltaY = Math.abs(event.clientY - state.drag.startY);
    state.drag.moved = deltaX > 4 || deltaY > 4;
  }

  positionGhost(event.clientX, event.clientY);

  const nextZone = findDropZone(event.clientX, event.clientY);
  const nextKey = nextZone?.dataset.zoneKey || null;
  if (state.hoverZoneKey !== nextKey) {
    state.hoverZoneKey = nextKey;
    refreshActiveZones();
  }
}

function handlePointerUp(event) {
  if (!state.drag || event.pointerId !== state.drag.pointerId) {
    return;
  }

  const zone = state.drag.moved ? findDropZone(event.clientX, event.clientY) : null;
  if (zone) {
    const destination = resolveDestination(zone, event.clientX);
    moveAlbum(state.drag.albumId, state.drag.sourceZone, state.drag.sourceIndex, destination);
  }

  cleanupDrag();
  render();
}

function moveAlbum(albumId, sourceZone, sourceIndex, destination) {
  const sourceList = getZoneList(sourceZone);
  const destinationList = getZoneList(destination.zoneKey);
  const currentIndex = sourceList.indexOf(albumId);

  if (currentIndex === -1) {
    return;
  }

  sourceList.splice(currentIndex, 1);

  let insertIndex = destination.index;
  if (sourceZone === destination.zoneKey && currentIndex < insertIndex) {
    insertIndex -= 1;
  }

  destinationList.splice(insertIndex, 0, albumId);

  if (destination.zoneKey !== "pool") {
    triggerDropEffect(destination.zoneKey, albumId);
    playTierCue(destination.zoneKey);
  }
}

function resolveDestination(zone, clientX) {
  const zoneKey = zone.dataset.zoneKey;
  const items = [...zone.querySelectorAll(".album-card:not(.card-ghost)")];
  let index = items.length;

  for (let pointer = 0; pointer < items.length; pointer += 1) {
    const rect = items[pointer].getBoundingClientRect();
    if (clientX < rect.left + rect.width / 2) {
      index = pointer;
      break;
    }
  }

  return { zoneKey, index };
}

function findDropZone(clientX, clientY) {
  const target = document.elementFromPoint(clientX, clientY);
  return target?.closest("[data-drop-zone]") || null;
}

function refreshActiveZones() {
  document.querySelectorAll("[data-drop-zone]").forEach((node) => {
    const active = node.dataset.zoneKey === state.hoverZoneKey;
    node.classList.toggle("is-active", active);
  });
}

function cleanupDrag() {
  if (state.drag?.ghost?.isConnected) {
    state.drag.ghost.remove();
  }

  state.drag = null;
  state.hoverZoneKey = null;
  document.body.style.cursor = "";
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerup", handlePointerUp);
  window.removeEventListener("pointercancel", handlePointerUp);
}

function getZoneList(zoneKey) {
  if (zoneKey === "pool") {
    return state.pool;
  }

  return state.tiers[zoneKey];
}

function positionGhost(clientX, clientY) {
  if (!state.drag?.ghost) {
    return;
  }

  const x = clientX - state.drag.offsetX;
  const y = clientY - state.drag.offsetY;
  state.drag.ghost.style.transform = `translate(${x}px, ${y}px) rotate(-6deg) scale(1.04)`;
}

function stopPreview() {
  if (audioEngine) {
    audioEngine.stop();
    audioEngine = null;
  }
}

function triggerDropEffect(zoneKey, albumId) {
  if (dropEffectTimer) {
    window.clearTimeout(dropEffectTimer);
  }

  const nonce = Date.now();
  state.dropEffect = { zoneKey, albumId, nonce };
  dropEffectTimer = window.setTimeout(() => {
    if (state.dropEffect?.nonce === nonce) {
      state.dropEffect = null;
      render();
    }
  }, 720);
}

function playTierCue(tierId) {
  if (state.muted) {
    return;
  }

  const profile = tierSoundProfiles[tierId];
  if (!profile) {
    return;
  }

  const AudioContextRef = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextRef) {
    return;
  }

  const context = new AudioContextRef();
  const master = context.createGain();
  const filter = context.createBiquadFilter();

  filter.type = "lowpass";
  filter.frequency.value = profile.filter;
  master.gain.value = 0.0001;
  filter.connect(master);
  master.connect(context.destination);

  const startAt = context.currentTime + 0.01;
  const totalCueTime = profile.notes.length * profile.step + profile.duration;
  master.gain.exponentialRampToValueAtTime(profile.gain, startAt + 0.03);
  master.gain.exponentialRampToValueAtTime(0.0001, startAt + totalCueTime);

  profile.notes.forEach((offset, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const noteTime = startAt + index * profile.step;
    const duration = profile.duration;

    oscillator.type = profile.wave;
    oscillator.frequency.value = profile.base * Math.pow(2, offset / 12);

    gain.gain.setValueAtTime(0.0001, noteTime);
    gain.gain.exponentialRampToValueAtTime(profile.gain, noteTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(profile.gain * 0.54, noteTime + duration * 0.45);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

    oscillator.connect(gain);
    gain.connect(filter);
    oscillator.start(noteTime);
    oscillator.stop(noteTime + duration + 0.02);

    if (profile.sparkle && (index === 0 || index === profile.notes.length - 1)) {
      const sparkle = context.createOscillator();
      const sparkleGain = context.createGain();

      sparkle.type = "sine";
      sparkle.frequency.value = oscillator.frequency.value * 2;
      sparkleGain.gain.setValueAtTime(0.0001, noteTime);
      sparkleGain.gain.exponentialRampToValueAtTime(profile.gain * profile.sparkle, noteTime + 0.02);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration * 0.6);

      sparkle.connect(sparkleGain);
      sparkleGain.connect(filter);
      sparkle.start(noteTime);
      sparkle.stop(noteTime + duration * 0.65);
    }
  });

  context.resume().catch(() => {});
  window.setTimeout(() => {
    master.disconnect();
    filter.disconnect();
    context.close().catch(() => {});
  }, Math.ceil((totalCueTime + 0.35) * 1000));
}

function ensureBackgroundAudio() {
  if (state.muted || !state.audioUnlocked) {
    return;
  }

  if (!audioEngine) {
    audioEngine = createAudioEngine();
  }

  audioEngine.start();
}

function createAudioEngine() {
  const AudioContextRef = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextRef) {
    return { start() {}, stop() {} };
  }

  const context = new AudioContextRef();
  const master = context.createGain();
  const lowpass = context.createBiquadFilter();
  const padGain = context.createGain();
  const shimmerGain = context.createGain();
  const bounceGain = context.createGain();
  const lfo = context.createOscillator();
  const lfoDepth = context.createGain();
  const activeNodes = [];

  lowpass.type = "lowpass";
  lowpass.frequency.value = 3600;
  master.gain.value = 0.0001;
  padGain.gain.value = 0.014;
  shimmerGain.gain.value = 0.011;
  bounceGain.gain.value = 0.009;
  padGain.connect(lowpass);
  shimmerGain.connect(lowpass);
  bounceGain.connect(lowpass);
  master.connect(context.destination);
  lowpass.connect(master);

  [220, 277.18, 329.63].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = index === 0 ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = [0.24, 0.11, 0.07][index];
    oscillator.connect(gain);
    gain.connect(padGain);
    oscillator.start();
    activeNodes.push(oscillator, gain);
  });

  lfo.type = "sine";
  lfo.frequency.value = 0.34;
  lfoDepth.gain.value = 0.0052;
  lfo.connect(lfoDepth);
  lfoDepth.connect(master.gain);
  lfo.start();
  activeNodes.push(lfo, lfoDepth);

  function queueShimmer(frequency, when, duration, gainAmount) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(gainAmount, when + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    oscillator.connect(gain);
    gain.connect(shimmerGain);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.02);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }

  function triggerShimmer(offset = 0) {
    const now = context.currentTime;
    [523.25, 659.25, 783.99, 880].forEach((frequency, index) => {
      queueShimmer(frequency, now + offset + index * 0.12, 0.48, index >= 2 ? 0.019 : 0.013);
    });
  }

  function queueBounce(offset = 0) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime + offset;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(392, now);
    oscillator.frequency.exponentialRampToValueAtTime(523.25, now + 0.18);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.012, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

    oscillator.connect(gain);
    gain.connect(bounceGain);
    oscillator.start(now);
    oscillator.stop(now + 0.36);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }

  triggerShimmer(0.08);
  queueBounce(0.18);
  let pulseTimer = window.setInterval(() => {
    triggerShimmer(0);
    queueBounce(0.2);
  }, 1600);

  return {
    start() {
      context.resume().catch(() => {});
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(0.03, now + 0.5);
    },
    stop() {
      if (pulseTimer) {
        window.clearInterval(pulseTimer);
        pulseTimer = null;
      }

      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

      activeNodes.forEach((node) => {
        if ("disconnect" in node) {
          node.disconnect();
        }
      });
      window.setTimeout(() => {
        master.disconnect();
        padGain.disconnect();
        shimmerGain.disconnect();
        bounceGain.disconnect();
        lowpass.disconnect();
        context.close().catch(() => {});
      }, 320);
    },
  };
}

function createNode(tagName, className) {
  const node = document.createElement(tagName);
  if (className) {
    node.className = className;
  }
  return node;
}
