import { yandexSpeech } from "../lib/Audio/yandex";
import Axios from "axios";

const weather_key = '745eb050-839c-4645-b2be-ae515409ff35'

export class Smart {

  constructor() {
    this.every8am(() => {
      this.goodMorning()
    })
  }
  async goodMorning() {
    const d = new Date();
    let stringOfD = '';
    stringOfD += d.getDate() + '.';
    stringOfD += d.getMonth() + '.'
    stringOfD += d.getFullYear() + ' ';
    const { data: weather } = await Axios.get('https://api.weather.yandex.ru/v1/forecast?lat=59.9878763&lon=30.3672925&extra=true', {
      headers: {
        'X-Yandex-API-Key': weather_key
      }
    })
    await yandexSpeech("Доброе утро! Иван Александрович! Сегодня " + stringOfD + ", время " + d.toLocaleTimeString() + ". Сейчас за окном " + weather.fact.temp + " градусов по цельсию. Днем температура воздуха прогреется до " + weather.forecasts[0].parts.day.temp_avg + ". Не забудьте сходить на прогулку. Удачного вам дня и новых побед", "jane");

    console.log(weather);
  }
  every8am(callback:Function) {
    let now = new Date(),
      start,
      wait:number; 

    if (now.getHours() < 7) {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 30, 0, 0);
    } else {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 38, 0, 0, 0);
    }

    wait = start.getTime() - now.getTime();
    console.log(wait);
    
    if (wait <= 0) { //If missed 8am before going into the setTimeout
      console.log('Oops, missed the hour');
      this.every8am(callback); //Retry
    } else {
      setTimeout(function () { //Wait 8am
        setInterval(function () {
          callback();
        }, wait);
      }, 86400000); //Every day
    }
  }

}
