import querystring from 'querystring';
import Axios from "axios";
import Speaker from 'speaker';

const speaker = new Speaker({
  channels: 1,          // 1 channel
  bitDepth: 16,         // 32-bit samples
  sampleRate: 48000,     // 48,000 Hz sample rate

});

export function yandexSpeech(text: string, voice: string) {
  return new Promise(async (resolve, reject) => {

    let res;
    try {
      res = await Axios.post('https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize', querystring.stringify({
        text,
        voice,

        'format': 'lpcm',
        'sampleRateHertz': 48000

      }), {
          headers: {
            Authorization: 'Api-Key AQVNzwBLoHj5BlmKA8_al4cGxCKonMnlhGJorvWD'
          },
          responseType: "stream"
        });
      res.data.on('data', (chunk: Buffer) => {
        speaker.write(chunk)
      })
      res.data.on('end', (chunk: Buffer | null) => {
        if (chunk != null) {
          speaker.write(chunk)
        }
        resolve()
      })
    } catch (e) {
      console.error(e);
      reject(e)
    }
  })


}
