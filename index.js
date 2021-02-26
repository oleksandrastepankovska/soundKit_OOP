const SOUND_KEYS = [
  {
    code: "KeyA",
    label: "A",
    name: "boom",
  },
  {
    code: "KeyS",
    label: "S",
    name: "clap",
  },
  {
    code: "KeyD",
    label: "D",
    name: "hihat",
  },
  {
    code: "KeyF",
    label: "F",
    name: "kick",
  },
  {
    code: "KeyG",
    label: "G",
    name: "openhat",
  },
  {
    code: "KeyH",
    label: "H",
    name: "ride",
  },
  {
    code: "KeyJ",
    label: "J",
    name: "snare",
  },
  {
    code: "KeyK",
    label: "K",
    name: "tink",
  },
  {
    code: "KeyL",
    label: "L",
    name: "tom",
  },
];

const rootDiv = document.getElementById("root");

const channel1 = [];
const channel2 = [];
const channel3 = [];
const channel4 = [];

const channels = { channel1, channel2, channel3, channel4 };

let recordStartTime;
let recOptions = {
  channel: channel1,
  isRec: false,
};

const audioHtml = `${SOUND_KEYS.map(
  (sound) =>
    `
      <audio src="sounds/${sound.name}.wav" style="display:none" controls id="${sound.name}"></audio>
      <div class="soundBtn ${sound.name}">${sound.label}</div>
    `
).join("")}`;

rootDiv.innerHTML = audioHtml;
const recBtn = document.querySelector("#record");
const playBtns = document.querySelectorAll(".play");
const channelSellect = document.querySelector("#channelSellect");

class Effects {
  constructor(soundDiv) {
    this.soundDiv = soundDiv;
  }

  onKeyPress() {
    this.soundDiv.classList.add("active");
    setTimeout(() => this.soundDiv.classList.remove("active"), 500);
  }
}

class Sound {
  constructor(soundName) {
    this.soundName = soundName;
  }

  play() {
    const sound = document.querySelector(`#${this.soundName}`);
    const soundDiv = document.querySelector(`.${this.soundName}`);
    const effects = new Effects(soundDiv);
    effects.onKeyPress();
    sound.play();
  }

  record() {
    const soundTime = Date.now() - recordStartTime;
    const sound = SOUND_KEYS.find((sound) => sound.name === this.soundName);
    recOptions.channel.push({ ...sound, time: soundTime });
  }
}
class Actions {
  onKeyDown(event) {
    const sound = SOUND_KEYS.find((sound) => event.code === sound.code);
    if (sound) {
      const soundClass = new Sound(sound.name);
      soundClass.play();
      soundClass.record();
    }
  }

  onPlayClick(event) {
    channels[event.target.name].forEach((sound) =>
      setTimeout(() => {
        const soundClass = new Sound(sound.name);
        soundClass.play();
      }, sound.time)
    );
  }

  onChannelSellect(event) {
    recOptions = { ...recOptions, channel: channels[event.target.value] };
  }

  onRecClick() {
    recordStartTime = recOptions.isRec ? 0 : Date.now();
    recOptions = { ...recOptions, isRec: !recOptions.isRec };
  }

  onRecordStop() {
    recBtn.classList.contains("active")
      ? recBtn.classList.remove("active")
      : recBtn.classList.add("active");
  }
}

const actions = new Actions();

document.body.addEventListener("keydown", function (e) {
  actions.onKeyDown(e);
});
playBtns.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    actions.onPlayClick(e);
  })
);
recBtn.addEventListener("click", actions.onRecClick);
recBtn.addEventListener("click", actions.onRecordStop);
channelSellect.addEventListener("change", function (e) {
  actions.onChannelSellect(e);
});
