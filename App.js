/*
Comment: In this game, the user's goal is to avoid the red obstacles on the screen for as long as possible. The game starts out easy, with only one obstacle moving across the screen at a time. However, as the user continues playing, the difficulty will increase. At the maximum difficulty, up to 3 obstacles will be on the screen at once, and each obstacle will have a different base behavior. The first obstacle can change sizes, the second obstacle moves at an increased speed, and the third obstacle oscillates horizontally. As the time increases, the speed of these obstacles will also increase. The user can gain extra points by picking up the green "Score Block", which gives them a 100 point bonus. Otherwise, points are earned based on how long the user can survive. 

I chose to use gyroscope data becuase I thought it was annoying for the user to have to move their phone around. Since the gryoscope measures rotational velocity, the user is able to keep their phone in one place and tilt it to move. While the accelerometer data would have worked fine for this app, using the gryoscope simply makes it easier for the user.

Capabilities:
-Fully functioning leaderboard with async storage
-Multiple ways for user to score points
-Movement based on gyroscope data
-Functional hitboxes for each obstacle
-Various obstacle behaviors to add game variety
-Extensive use of randomization
-Increasing difficulty as game progresses
-Clear start and endpoint

Limitations:
-Easier to play on larger screens because user has more space in between obstacles, though not significantly since player size scales with device size
-Occasionally, quotation marks appear on leaderboard numbers which looks ugly
-Hitbox on the bottom of the screen is slightly off because the coordinate system is stupid
-A lot of functions happening at once, so can lag on slower devices

*/
import { StyleSheet, Dimensions, View, Text, Alert } from "react-native";
import { GameLoop } from "react-native-game-engine";
import { Gyroscope } from 'expo-sensors';
import { RFValue } from 'react-native-responsive-fontsize';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const playerRadius = (windowWidth/12);

  const [{ x, y }, setData] = useState({
    x: 0,
    y: 0,
  });
  const [gameOn, setGameOn] = useState(true);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [highScore1, setHighScore1] = useState(0);
  const [highScore2, setHighScore2] = useState(0);
  const [highScore3, setHighScore3] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [xPos, setXPos] = useState(windowWidth / 2 - playerRadius);
  const [yPos, setYPos] = useState(windowHeight / 2 - playerRadius);
  const [obsX, setObsX] = useState(windowWidth / 2 - playerRadius);
  const [obsY, setObsY] = useState(windowHeight + 100);
  const [obsVel, setObsVel] = useState(0);
  const [obsRad, setObsRad] = useState(25);
  const [obs2X, setObs2X] = useState(windowWidth / 2 - playerRadius);
  const [obs2Y, setObs2Y] = useState(windowHeight + 100);
  const [obs2Vel, setObs2Vel] = useState(0);
  const [obs3X, setObs3X] = useState(windowWidth / 2 - playerRadius);
  const [obs3Y, setObs3Y] = useState(windowHeight + 100);
  const [obs3Vel, setObs3Vel] = useState(0);
  const [obs3XVel, setObs3XVel] = useState(-18);
  const [obs3XAccmag, setObs3XAccmag] = useState(0);
  const [obs3XAccdir, setObs3XAccdir] = useState(1);
  const [scoreBlockX, setScoreBlockX] = useState(windowWidth / 2 - playerRadius);
  const [scoreBlockY, setScoreBlockY] = useState(windowHeight + 100);
  const [scoreBlockSpawned, setScoreBlockSpawned] = useState(false);

  const updateHandler = () => {
    if (gameOn) {
    let poweruphandler = Math.random() * 100000;
      if (xPos >= 0 && xPos <= (windowWidth - (2*playerRadius))){
      setXPos(xPos + (4*y));
      }
      else gameOver();
      if (yPos >= 0 && yPos <= (windowHeight - (2*playerRadius))) {
      setYPos(yPos + (6*x));
      }
      else gameOver();
      if (time % 10 == 0)
      {
        setScore(score + 1);
      }
      setTime(time + 1);
      setObsY(obsY+obsVel);
      if (time >= 2000)
      {
        setObs2Y(obs2Y+obs2Vel);
      }
      if (time >= 4000)
      {
        setObs3X(obs3X+obs3XVel);
        setObs3Y(obs3Y+obs3Vel);
        setObs3XVel(obs3XVel + obs3XAccmag);
        setObs3XAccmag(obs3XAccmag + obs3XAccdir);
        if (obs3XAccmag > 4 && obs3XAccdir == 1)
        {
          setObs3XAccdir(-1);
        }
        else if (obs3XAccmag < -4 && obs3XAccdir == -1)
        {
          setObs3XAccdir(1);
        }
      }
      if (obsY >= windowHeight + 100)
      {
        let temp = (Math.random()*25)+25;
        setObsRad(2 * temp)
        setObsVel((Math.random()*5)+3+(time/1000))
        setObsY(-windowHeight - 100)
        setObsX((Math.random()*(windowWidth-(2 * temp))))
      }
      if (obs2Y >= windowHeight + 100)
      {
        setObs2Vel((Math.random()*5)+6+(time/500))
        setObs2Y(-windowHeight - 100)
        setObs2X((Math.random()*(windowWidth-50)))
      }
      if (obs3Y >= windowHeight + 100)
      {
        setObs3Vel((Math.random()*5)+3+(time/1000))
        setObs3Y(-windowHeight - 100)
        setObs3X((Math.random()*(windowWidth-60)))
      }
      if (poweruphandler >= 99820 && !scoreBlockSpawned)
      {
        setScoreBlockSpawned(true);
        setScoreBlockY(-windowHeight - 100)
        setScoreBlockX((Math.random()*(windowWidth-50)))
      }
      if (scoreBlockSpawned)
      {
        if (scoreBlockY >=windowHeight + 100)
        {
          setScoreBlockSpawned(false);
        }
        else setScoreBlockY(scoreBlockY + 2);
      }
      if ((xPos + (2 * playerRadius)) >= obsX && xPos <= (obsX + (2 * obsRad)) && (yPos + (2 * playerRadius)) >= obsY && yPos <= (obsY + (obsRad / 2)))
      {
        gameOver();
      }
      if ((xPos + (2 * playerRadius)) >= obs2X && xPos <= (obs2X + 50) && (yPos + (2 * playerRadius)) >= obs2Y && yPos <= (obs2Y + 50))
      {
        gameOver();
      }
      if ((xPos + (2 * playerRadius)) >= obs3X && xPos <= (obs3X + 60) && (yPos + (2 * playerRadius)) >= obs3Y && yPos <= (obs3Y + 60))
      {
        gameOver();
      }
      if ((xPos + (2 * playerRadius)) >= scoreBlockX && xPos <= (scoreBlockX + 50) && (yPos + (2 * playerRadius)) >= scoreBlockY && yPos <= (scoreBlockY + 50))
      {
        setScore(score + 100);
        setScoreBlockY(windowHeight + 100);
        setScoreBlockSpawned(false);
      }
    }
  };

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setData(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    showData();
  }, []);

  const gameOver = () => {

    setGameOn(false);
    setScore(0);
    setTime(0);
    setHighScore(score);
    showAlert();
  }

  const restart = () => {
    setObsY(windowHeight + 100);
    setObs2Y(windowHeight + 100);
    setObs3Y(windowHeight + 100);
    setScoreBlockY(windowHeight + 100);
    showData();
    setXPos(windowWidth / 2 - playerRadius);
    setYPos(windowHeight / 2 - playerRadius);
    setGameOn(true);
  }

  const showAlert = () =>
  Alert.alert(
    'Game Over',
    'Your Score: ' + score,
    [
      {
        text: 'New Game',
        onPress: () => restart(),
        style: 'cancel',
      },
    ],
    
  );


  const setHighScore = async (score) => {
    let x = highScore1;
    let y = highScore2;
    if (score > highScore1 ) {
      try {
        await AsyncStorage.setItem('score1', JSON.stringify(score));
        await AsyncStorage.setItem('score2', JSON.stringify(x));
        await AsyncStorage.setItem('score3', JSON.stringify(y));
      } catch (e) {}
    }
    else if (score > highScore2 ) {
      try {
        await AsyncStorage.setItem('score2', JSON.stringify(score));
        await AsyncStorage.setItem('score3', JSON.stringify(y));
      } catch (e) {}
    }
    else if (score > highScore3 ) {
      try {
        await AsyncStorage.setItem('score3', JSON.stringify(score));
      } catch (e) {}
    }
  };

  const showData = async () => {
    const x = await AsyncStorage.getItem('score1');
    const y = await AsyncStorage.getItem('score2');
    const z = await AsyncStorage.getItem('score3');
    if (x !== null) {
      setHighScore1(x);
    }
    if (y !== null) {
      setHighScore2(y);
    }
    if (z !== null) {
      setHighScore3(z);
    }
  };

    return (
          <GameLoop style={styles.container} onUpdate={updateHandler}>
        <View style={[styles.player, { left: xPos, top: yPos, width: playerRadius * 2, height: playerRadius * 2, borderRadius: playerRadius * 2 }]} />
        <View style={[styles.obstacle, { left: obsX, top: obsY, width: obsRad * 2, height: obsRad / 2}]} />
        <View style={[styles.obstacle, { left: obs2X, top: obs2Y, width: 50, height: 50 }]} />
        <View style={[styles.obstacle, { left: obs3X, top: obs3Y, width: 60, height: 60 }]} />
        <View style={[styles.obstacle, { left: scoreBlockX, top: scoreBlockY, width: 50, height: 50, backgroundColor: 'green' }]} />
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.highScoreText}>Leaderboard</Text>
        <Text style={styles.highScoreText}>1. {highScore1}</Text>
        <Text style={styles.highScoreText}>2. {highScore2}</Text>
        <Text style={styles.highScoreText}>3. {highScore3}</Text>
      </GameLoop>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: 'pink',
    
  },
  player: {
    position: "absolute",
    backgroundColor: "yellow",
  },
  obstacle: {
    backgroundColor: "pink",
    position: "absolute",
  },
  scoreText: {
    fontSize: RFValue(46),
    color: 'gray',
    fontWeight: 200,
  },
  highScoreText: {
    fontSize: RFValue(30),
    color: 'gray',
    fontWeight: 200,
  },
  
});