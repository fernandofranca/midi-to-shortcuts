const midi = require('midi');
const robot = require('@jitsi/robotjs');
const MPD = require('./mpd218');

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

  switch (messageAsString) {
    case MPD.PAD_A1:
      robot.keyTap('g');
      break;
    case MPD.PAD_A5:
      robot.keyTap('space');
      break;
    case MPD.PAD_A9:
      robot.keyTap('tab');
      break;
    case MPD.PAD_A13:
      robot.keyTap('2', ['command', 'alt']);
      break;
    case MPD.PAD_A4:
      robot.keyTap('left');
      break;
    case MPD.PAD_A8:
      robot.keyTap('right');
      break;
    case MPD.PAD_A12:
      robot.keyTap('down', 'command');
      break;
    case MPD.PAD_A16:
      robot.keyTap('up', 'command');
      break;
  }

});

// These are only for cheat sheet 
// robot.keyTap('.', 'command');
// robot.keyTap('down', 'shift');
// robot.keyTap('right', 'command');
// robot.keyTap('tab', 'shift');
