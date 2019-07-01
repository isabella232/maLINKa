import keyboard from './keyboard'
import player from './lib/player';

keyboard.on('key', (key,date)=>{
  console.log(key);
  player.playFile('~/hello.wav')
});