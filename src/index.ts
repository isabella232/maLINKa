import keyboard from './keyboard'
import player from './lib/player';
import { homedir } from 'os';
import { tables } from './lib/DB';

keyboard.on('key', async (key,date)=>{
  if(key=='a'){
    console.log(await tables.statementsTable.getAllRows());
  } else{
 
  }
});

keyboard.on('connected', ()=>{
  console.log('connected');
  
})