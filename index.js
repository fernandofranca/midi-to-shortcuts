const midi = require('midi');
const robot = require('@jitsi/robotjs');

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
    case KEY_A_CUE_1:
      robot.keyTap('down', 'shift');
      break;
    case KEY_A_CUE_2:
      robot.keyTap('up', 'shift');
      break;
    case KEY_A_PITCH_TURN_LEFT:
      robot.keyTap('down');
      break;
    case KEY_A_PITCH_TURN_RIGHT:
      robot.keyTap('up');
      break;
    case KEY_A_SYNC:
      robot.keyTap('0');
      break;
    case KEY_A_SAMPLE_1:
      robot.keyTap('left', 'command');
      break;
    case KEY_A_SAMPLE_2:
      robot.keyTap('right', 'command');
      break;
    case KEY_A_SAMPLE_3:
      robot.keyTap('delete', 'alt');
      robot.keyTap('right', 'command');
      break;
    case KEY_A_SAMPLE_4:
      robot.keyTap('0');
      robot.keyTap('right', 'command');
      break;
    case KEY_A_ASSIGN_A:
      robot.keyTap('tab', 'shift');
      break;
    case KEY_A_ASSIGN_B:
      robot.keyTap('tab');
      break;
  }
});

const KEY_A_ASSIGN_A = '144 8 127';
const KEY_A_ASSIGN_B = '144 9 127';
const KEY_A_PITCH_TURN_LEFT = '176 5 63';
const KEY_A_PITCH_TURN_RIGHT = '176 5 65';
const KEY_A_PITCH_MINUS = '144 6 127';
const KEY_A_PITCH_PLUS = '144 7 127';
const KEY_A_CUE_1 = '144 10 127';
const KEY_A_CUE_2 = '144 11 127';
const KEY_A_CUE_3 = '144 12 127';
const KEY_A_CUE_4 = '144 13 127';
const KEY_A_SAMPLE_1 = '144 14 127';
const KEY_A_SAMPLE_2 = '144 15 127';
const KEY_A_SAMPLE_3 = '144 17 127';
const KEY_A_SAMPLE_4 = '144 18 127';
const KEY_A_SYNC = '144 4 127';