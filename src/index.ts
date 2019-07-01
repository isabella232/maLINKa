import keyboard from './keyboard'
import player from './lib/player';

keyboard.on('key', (key,date)=>{
  if(key=='a'){
  player.playFile('~/hello.wav')
  } else{
    player.stop()
  }
});