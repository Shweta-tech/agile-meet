import { Card, CardContent, CardHeader, IconButton, Typography } from '@material-ui/core';
import React, {useEffect, useState } from 'react';
import { Game, GameType } from '../../../types/game';
import { Player } from '../../../types/player';
import { Status } from '../../../types/status';
import { getCards } from '../CardPicker/CardConfigs';
import './PlayerCard.css';
import DeleteForeverIcon from '@material-ui/icons/DeleteForeverTwoTone';
import { red } from '@material-ui/core/colors';
import { removePlayer } from '../../../service/players';
import { isModerator } from '../../../utils/isModerator';


interface PlayerCardProps {
  game: Game;
  player: Player;
  currentPlayerId: string;
}
interface EmojiObj {
  emoji: string;
  side: 'top-left' | 'top-right';
}
export const PlayerCard: React.FC<PlayerCardProps> = ({ game, player, currentPlayerId }) => {
  const removeUser = (gameId: string, playerId: string) => {
    removePlayer(gameId, playerId);
  };
  const [showPicker, setShowPicker] = useState(false);
  const [emojis, setEmojis] = useState<EmojiObj[]>([]);

  const handleEmojiClick = (emoji: string, side: 'top-left' | 'top-right') => {
    setEmojis([...emojis, { emoji, side }]);
  };


  
  const  handleHover = (event: { pageX: number; pageY: number; }) => {
    setShowPicker(true);

} 

const  leaveHover = (event: { pageX: number; pageY: number; }) => {
  setShowPicker(false);

} 
return (
    <div>
        {emojis.map((emojiObj, index) => (
      <div
        key={index}
        className={`emoji ${emojiObj.side}`}
        onAnimationEnd={() => setEmojis(emojis.filter((_, i) => i !== index))}
      >
        {emojiObj.emoji}
      </div>
   ))}
  
   { showPicker && player.id != currentPlayerId &&
  
  
    <div className="emoji-buttons" onMouseLeave={leaveHover}>
      <button onClick={() => handleEmojiClick('💩', 'top-left')}>💩</button>
      <button onClick={() => handleEmojiClick('🏹', 'top-right')}>🏹</button>
      <button onClick={() => handleEmojiClick('👁️', 'top-left')}>👁️</button>
    </div>
      
      }
    
    <Card
      variant='outlined'
      className='PlayerCard'
      onMouseEnter={handleHover} 
      style={{
        backgroundColor: '#edf9fc',
      }}
    >
     
      <CardHeader
        className='PlayerCardTitle'
        title={player.name}
        titleTypographyProps={{ variant: 'subtitle2', noWrap: true, title: player.name }}
        action={
          isModerator(game.createdById, currentPlayerId) &&
          player.id !== currentPlayerId && (
            <IconButton
              title='Remove'
              className='RemoveButton'
              onClick={() => removeUser(game.id, player.id)}
              data-testid='remove-button'
              color='primary'
            >
              <DeleteForeverIcon fontSize='small' style={{ color: red[300] }} />
            </IconButton>
           
          )
        }
      />
      
      
      <CardContent className='PlayerCardContent'>
        <Typography variant='h2' className='PlayerCardContentMiddle'>
          {getCardValue(player, game)}
        </Typography>
      </CardContent>
      
    </Card>
    </div>
  );
};



const getCardValue = (player: Player, game: Game) => {
  if (game.gameStatus !== Status.Finished) {
    return player.status === Status.Finished ? '👍' : '🤔';
  }

  if (game.gameStatus === Status.Finished) {
    if (player.status === Status.Finished) {
      if (player.value && player.value === -1) {
        return player.emoji || '☕'; // coffee emoji
      }
      return getCardDisplayValue(game.gameType, player.value);
    }
    return '🤔';
  }
};

const getCardDisplayValue = (
  gameType: GameType | undefined,
  cardValue: number | undefined
): string | number | undefined => {
  return getCards(gameType).find((card) => card.value === cardValue)?.displayValue || cardValue;
};
