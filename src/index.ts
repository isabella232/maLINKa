import keyboard from './keyboard'
import player from './lib/player';
import { homedir } from 'os';

keyboard.on('key', (key,date)=>{
  if(key=='a'){
  player.playFile(homedir()+ '/hello.wav')
  .catch(console.error)
  } else{
    player.stop()
  }
});

keyboard.on('connected', ()=>{
  console.log('connected');
  
})