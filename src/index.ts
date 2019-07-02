import keyboard from './keyboard'
import player from './lib/Audio/player';
import { homedir } from 'os';
import { tables } from './lib/DB';
import { Server } from './server';

const server = new Server();
server.listen();

keyboard.on('key', async (key,date)=>{

    const statement =  (await tables.statementsTable.getStatementByKey(key, 1));
    player.playById(statement.id)
});

keyboard.on('connected', ()=>{
  console.log('connected');
  
})