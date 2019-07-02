import keyboard from './keyboard'
import player from './lib/Audio/player';
import { homedir } from 'os';
import { tables } from './lib/DB';
import { Server } from './server';

const server = new Server();
server.listen();

keyboard.on('key', async (key,date)=>{
  if(key=='a'){
    console.log(await tables.statementsTable.getAllStatements());
  } else{
 
  }
});

keyboard.on('connected', ()=>{
  console.log('connected');
  
})