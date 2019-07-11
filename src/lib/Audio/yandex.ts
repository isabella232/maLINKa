import querystring from 'querystring';
import Axios from "axios";
import { spawn } from 'child_process';
// import Speaker from 'speaker';

// const speaker = new Speaker({
//   channels: 1,          // 1 channel
//   bitDepth: 16,         // 32-bit samples
//   sampleRate: 48000,     // 48,000 Hz sample rate

// });
const aplay = spawn('aplay', ['-i', '--file-type=raw', '--rate=4800', '-c 1'])
aplay.stderr.pipe(process.stderr)


export function yandexSpeech(text: string, voice: string) {
  return new Promise(async (resolve, reject) => {

    let res;
    try {
      res = await Axios.post('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize', querystring.stringify({
        text,
        voice,

        'format': 'lpcm',
        'sampleRateHertz': 4800

      }), {
          headers: {
            Authorization: 'Api-Key AQVNzwBLoHj5BlmKA8_al4cGxCKonMnlhGJorvWD'
          },
          responseType: "stream"
        });
      res.data.on('data', (chunk: Buffer) => {
        // speaker.write(chunk)
        aplay.stdin.write(chunk);
      })
      res.data.on('end', (chunk: Buffer | null) => {
        if (chunk != null) {
          aplay.stdin.write(chunk)
          // speaker.write(chunk)
        }

        resolve()
      })
    } catch (e) {
      console.error(e);
      reject(e)
    }
  })


}
