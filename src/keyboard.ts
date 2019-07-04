import * as HID from "node-hid";
import { EventEmitter } from "events";
import { execSync } from "child_process";


const SERIAL = "54:46:6b:00:bd:31"
const APLHABET = "abcdefghijklmnopqrstuvwxyz1234567890";

let logged = false;

interface KeyMap {
  [id: number]: string
}

const keymap: KeyMap = {
  75: 'pageup',
  78: 'pagedown',
  40: 'enter',
  44: 'space',
  82: 'up',
  81: 'down',
  80: 'left',
  79: 'right',
  43: 'tab',
  41:'esc',
  76:'del'
  
}


const emitter = new EventEmitter;



function main() {


  const keyboard = HID.devices().find((device) => device.serialNumber == SERIAL);


  if (keyboard) {
    try {
      execSync('sudo chmod 777 '+keyboard.path)
      const hid = new HID.HID(keyboard.path);
      logged = true
      emitter.emit('connected')
      hid.on('error', (e) => { emitter.emit('error', e); main() })
      hid.on("data", (buffer: Buffer) => {
        const type = buffer[0];

        if (type === 1 || type === 2) {
          const key = buffer[3];
          if (key === 0) {
            return;
          }

          if (keymap[key] != null) {
            emitter.emit(keymap[key])
          }
          if (key > 3 && key < 40) {
            const symbolid = key - 4;
            const symbol = APLHABET[symbolid]
            emitter.emit('key', symbol, new Date);

          }

          return;
        }
      })
    } catch (error) {
      console.error(error);

      main()
    }


  } else {
    if (!logged) console.error('keyboard doesnt found, find again');
    logged = true;
    emitter.emit('finding')
    setTimeout(() => {
      main()
    }, 3000);
  }
}

setTimeout(() => {
  main()

}, 1);


export default emitter;