import {  Grow , TextField
} from '@material-ui/core';
import React, {ChangeEvent,useEffect, useState } from 'react';
import { Game } from '../../types/game';
import { Player } from '../../types/player';

import { PlayerCard } from './PlayerCard/PlayerCard';
import './Players.css';
import './../Poker/CreateGame/CreateGame.css';
import { updateTaskNameInFirebase } from '../../repository/firebase'
import { getGame } from '../../service/games';
interface PlayersProps {
  game: Game;
  players: Player[];
  currentPlayerId: string;
}



export const Players: React.FC<PlayersProps> = ({ game, players, currentPlayerId }) => {
  let [taskName, setTaskName] = useState<string>('');

  
  useEffect(() => {
    let isMounted = true;               // note mutable flag
   
    async function fetchData() {
    await getGame(game.id).then((response) => {
        if (isMounted) {
          setTaskName(response?.taskName || '');
        }
      }
      )
    }
    fetchData();
    return () => { isMounted = false };
  }, [taskName,game]);



  function handleTaskNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    updateTaskNameInFirebase(game.id, event.target.value);
    setTaskName(event.target.value);
  }

  return (

  
    <Grow  in={true} timeout={800}> 
    <div>
      <div style={{ width:500, margin: 'auto', paddingTop:10}}>
    <TextField
            required
              className='CreateGameTextField'
              id='filled-session-required'
              label='Task Name'
              placeholder='Enter a Task name'
              value={taskName}
              style={{ width:500}}
              variant='outlined'
              onChange={(event: ChangeEvent<HTMLInputElement>) =>{ handleTaskNameChange(event)}
            }
            />
            </div>
            
      <div className='PlayersContainer' >
        {players.map((player: Player) => (
        
          <PlayerCard  key={player.id} game={game} player={player} currentPlayerId={currentPlayerId}  />
        ))}
        </div>
        </div>
     
    </Grow>

  );
};
