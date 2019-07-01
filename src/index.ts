import keyboard from './keyboard'
import player from './lib/player';

keyboard.on('key', (key,date)=>{
  if(key=='a'){
  player.playFile('~/hello.wav')
  .catch(console.error)
  } else{
    player.stop()
  }
});

keyboard.on('connected', ()=>{
  console.log('connected');
  
})