import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  container:{
    width: 600,
  },
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 'auto',
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  options: {
    padding: theme.spacing(1),
    textAlign: 'left',
    height:40,
    color: theme.palette.text.secondary,
  },
}));

const App = () => {
  const classes = useStyles();

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }

  const getRandomMove = (min, max) => {
    let rnd = 1;
    while (buttonState[rnd] !== 0) {
      rnd = getRandomInt(1, 9);
    }
    return (rnd);
  }

  // Default button state for a new game
  const newGameButtonState  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const newMoveState        = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const [buttonState, setButtonState] = useState(newGameButtonState);
  const [playerMoves, setPlayerMoves] = useState([0, 0, 0]);
  const [winningRows, setWinningRows] = useState([0, 0, 0]);
  const [possibleMoves, setPossibleMoves] = useState(newMoveState);
  const [player1As, setPlayer1As] = useState(0);
  const [player2As, setPlayer2As] = useState(0);
  const [status, setStatus] = useState('');
  const [gameEnabled, setGameEnabled] = useState(true);


  useEffect(() => {
    NewGame();
  }, []);

  useEffect(() => {
    setPlayer2As(player1As === 1? 2 : 1);
  }, [player1As]);

  const PlayMove = (button, player) =>{
    let currentState = buttonState;
    currentState[button] = player;
    setButtonState([...currentState]);

    let playerMoveState = playerMoves;
    playerMoveState[player] = (playerMoveState[player] + 1);
    setPlayerMoves([...playerMoveState]);

    let isWinner = CalculateWinner(player);
    if (isWinner)
    {
      setStatus(`Player ${player} is the winner!`);
      setGameEnabled(false);
      return;
    }

    if ((playerMoves[1] + playerMoves[2]) === 9){
      // We're all played out, nobody's won :(
      setStatus(`All played out, nobody won :(`);
      setGameEnabled(false);
      return;
    }
  
    if (player === player1As)
    {
      ComputerPlayMove();
    }
  }

  const ComputerPlayMove = () =>{

    setPossibleMoves(newMoveState);
    if (playerMoves[2] === 0)
    {
      console.log('Player 2 playing the first move');
      let firstMove = getRandomMove();
      PlayMove(firstMove, 2);
    }
    else{
      let move = CalculateMove();
      PlayMove(move, 2);
    }
  }

  const NewGame = () =>{
    console.log('Starting a new game');
    setStatus('');
    setButtonState(newGameButtonState);
    setPlayer1As(getRandomInt(1,3));
    setPlayerMoves([0, 0, 0]);
    setWinningRows([0, 0, 0]);
    setGameEnabled(true);
  }

  const renderIsWinningButton = (button) =>{
    return (winningRows.includes(button) ? 'secondary' : 'primary');
  }

  const CalculateMove = () =>{

    // Work out any risks, so cells where we need to play in order not to lose
    CalculateRisks();

    // Work out if there are any opportunities
    CalculateOpportunities();
    console.log(`here are the possible moves ${possibleMoves}`);

    // Pick of the last (most possible) move
    let move = 0; // The Mov we decide to make
    let max = 0;  // The running maximum amount of opportunities
    let pos;      // The button position we're testing
    for (pos = 0; pos < possibleMoves.length; pos++) {
      if ((buttonState[pos] === 0) && (possibleMoves[pos] > max))
      {
        max = possibleMoves[pos];
        move = pos;
      }
    }

    // If there aren't any possible moves, we'll pick one at random
    if (move === 0){
      move = getRandomMove();
      console.log(`Choosing Random Move ${move}`);  
    }

    console.log(`Choosing move ${move}`);
    return(move);
  }

  const CalculateRisks = () =>{
    CalculateRowRisk(1, 2, 3);
    CalculateRowRisk(4, 5, 6);
    CalculateRowRisk(7, 8, 9);
    CalculateRowRisk(1, 4, 7);
    CalculateRowRisk(2, 5, 8);
    CalculateRowRisk(3, 6, 9);            
    CalculateRowRisk(7, 5, 3);
    CalculateRowRisk(9, 5, 1);    
  }

  const CalculateRowRisk = (n1, n2, n3) =>{
      let newMoveState = possibleMoves;
      let row = `${buttonState[n1]}${buttonState[n2]}${buttonState[n3]}`;
      if (row === "110")
      {
        console.log(`Found Risk at ${row} buttons ${n1} ${n2} ${n3}`);
        newMoveState[n3] = newMoveState[n3] + 1;
      }
      if (row === "101")
      {
        console.log(`Found Risk at ${row} buttons ${n1} ${n2} ${n3}`);
        newMoveState[n2] = newMoveState[n2] + 1;
      }
      if (row === "011")
      {
        console.log(`Found Risk at ${row} buttons ${n1} ${n2} ${n3}`);
        newMoveState[n1] = newMoveState[n1] + 1;
      }
      setPossibleMoves([...newMoveState]);
      return;
  }

  const CalculateRowOpportunity = (n1, n2, n3) =>{
    let newMoveState = possibleMoves;
    let row = `${buttonState[n1]}${buttonState[n2]}${buttonState[n3]}`;
    
    if (row === "220")
    {
      console.log(`Found Opportunity at ${row} buttons ${n1} ${n2} ${n3}`);
      newMoveState[n3] = newMoveState[n3] + 1;
    }
    if (row === "202")
    {
      console.log(`Found Opportunity at ${row} buttons ${n1} ${n2} ${n3}`);
      newMoveState[n2] = newMoveState[n2] + 1;
    }
    if (row === "022")
    {
      console.log(`Found Opportunity at ${row} buttons ${n1} ${n2} ${n3}`);
      newMoveState[n1] = newMoveState[n1] + 1;
    }
    setPossibleMoves([...newMoveState]);
    return;
  }
  
  const CalculateOpportunities = () =>{
    CalculateRowOpportunity(1, 2, 3);
    CalculateRowOpportunity(4, 5, 6);
    CalculateRowOpportunity(7, 8, 9);
    CalculateRowOpportunity(1, 4, 7);
    CalculateRowOpportunity(2, 5, 8);
    CalculateRowOpportunity(3, 6, 9);
    CalculateRowOpportunity(7, 5, 3);
    CalculateRowOpportunity(9, 5, 1);    
  }

  const CalculateWinner = (player) => {
      let isWinner = false;

      isWinner |= CalculateRowWinner(player, 1, 2, 3);
      isWinner |= CalculateRowWinner(player, 4, 5, 6);
      isWinner |= CalculateRowWinner(player, 7, 8, 9);
      isWinner |= CalculateRowWinner(player, 1, 4, 7);
      isWinner |= CalculateRowWinner(player, 2, 5, 8);
      isWinner |= CalculateRowWinner(player, 3, 6, 9);
      isWinner |= CalculateRowWinner(player, 7, 5, 3);
      isWinner |= CalculateRowWinner(player, 9, 5, 1);

      return (isWinner);
  }

  const CalculateRowWinner = (player, n1, n2, n3) =>{
    
    const row = `${buttonState[n1]}${buttonState[n2]}${buttonState[n3]}`;
    const win = `${player}${player}${player}`;

    const isWinningRows = win === row;
    if (isWinningRows){
      console.log('We found a winner!');
      setWinningRows([n1, n2, n3]);
    }

    return (isWinningRows);
  }

  const renderButton = (button) =>{
    switch (buttonState[button])
    {
      case 1:
        return 'O';
      case 2:
        return 'X';
      default:
        return '-';
    }
  }

  const renderStatus = () =>{
    let narrative = '';
    if (status !== ''){
      narrative = status;
    } else {
      narrative+= 'Player 1 playing as ' + (player1As ===1? 'O' : 'X');
      narrative+= ' - Player 2 playing as ' + (player2As ===1? 'O' : 'X');
    }
    return (narrative);
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1} className={classes.container}>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
            <Button variant="contained" color={renderIsWinningButton(1)} onClick={()=>PlayMove(1, 1)}>
            {renderButton(1)}
            </Button>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color={renderIsWinningButton(2)} onClick={()=>PlayMove(2, 1)}>
              {renderButton(2)}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color={renderIsWinningButton(3)} onClick={()=>PlayMove(3, 1)}>
              {renderButton(3)}
              </Button>
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color={renderIsWinningButton(4)} onClick={()=>PlayMove(4, 1)}>
              {renderButton(4)}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color={renderIsWinningButton(5)} onClick={()=>PlayMove(5, 1)}>
              {renderButton(5)}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color={renderIsWinningButton(6)} onClick={()=>PlayMove(6, 1)}>
              {renderButton(6)}
              </Button>
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color={renderIsWinningButton(7)} onClick={()=>PlayMove(7, 1)}>
              {renderButton(7)}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color={renderIsWinningButton(8)} onClick={()=>PlayMove(8, 1)}>
              {renderButton(8)}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Button variant="contained" color={renderIsWinningButton(9)} onClick={()=>PlayMove(9, 1)}>
              {renderButton(9)}
              </Button>
            </Paper>
          </Grid>
        </Grid>
          <Grid item xs={3}>
          <Paper className={classes.options}>
              <Button variant="contained" color={renderIsWinningButton()} onClick={()=>NewGame()}>New Game</Button>
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <Paper className={classes.options}>
              {renderStatus()}   
            </Paper>
          </Grid>
      </Grid>
    </div>
  );
}

export default App;