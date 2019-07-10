import querystring from 'querystring';
import Axios from "axios";

async function request(text: string, voice: string) {
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
        responseType: "arraybuffer"
      });
  } catch (e) {
    console.error(e);

  }
  process.stdout.write(res.data);

}

request('Я занимаюсь разработкой программ для  неговорящих людей. ', 'zahar')