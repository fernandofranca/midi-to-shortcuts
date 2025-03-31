const midi = require('midi');
const robot = require('@jitsi/robotjs');
const fs = require('fs');
const yaml = require('js-yaml');
const { exec } = require('child_process');

function runAppleScript(script) {
  exec(`osascript -e '${script}'`, (error) => {
    if (error) {
      console.error(`Error running script:`, error.message);
    }
  });
}

function switchToApp(appName) {
  const script = `tell application "${appName}" to activate`;
  runAppleScript(script);
}

function setVolume(direction) {
  const increment = direction === 'UP' ? '+2' : '-2';
  runAppleScript(`set volume output volume (output volume of (get volume settings) ${increment})`);
}

const commandFunctionMap = {
  'setVolume': setVolume,
  'switchToApp': switchToApp,
}

const config = yaml.load(fs.readFileSync('./midi-config.yml', 'utf-8'));

// Set up a new input.
const input = new midi.Input();
// const output = new midi.Output();

// Get the name of a specified input port.
const inputPortName = input.getPortName(0);
console.log('inputPortName:', inputPortName);

// Open the first available input port.
input.openPort(0);
// output.openPort(0);

// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// input.ignoreTypes(true, false, true)
input.ignoreTypes(false, false, false);

const listenOnly = false; // true;

// Configure a callback.
input.on('message', (deltaTime, message) => {
  // The message is an array of numbers corresponding to the MIDI bytes:
  // [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  const [midiMessage, note, velocity] = message;

  if (listenOnly) {
    console.log('👉 midiMessage, note, velocity:', midiMessage, note, velocity);
    return;
  }

  const messageAsString = message.join(' ');

  // Find in the config any control that matches this MIDI message.
  const control = config.controls.find(c => c.message === messageAsString);

  if (control) {
    if (control.command) {
      const fn = commandFunctionMap[control.command]
      if (fn) fn(control.params);
      return;
    }

    // is key?
    if (control.key) {
      robot.keyTap(control.key, control.modifiers);
      return;
    }    
  }
});


// These are only for cheat sheet 
// robot.keyTap('.', 'command');
// robot.keyTap('down', 'shift');
// robot.keyTap('right', 'command');
// robot.keyTap('tab', 'shift');
