import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import entities from './entities';
import Physics from './physics';
import { CustomText } from '../text';

const FischGame = () => {
    const [running, setRunning] = useState(false)
    const [gameEngine, setGameEngine] = useState(null)
    const [currentPoints, setCurrentPoints] = useState(0)
    useEffect(() => {
      setRunning(false)
    }, [])
    return (
      <View style={{ backgroundColor:'black',width:Dimensions.get('window').height,height:Dimensions.get('window').width, transform: [{rotate:'-90deg'}],alignItems:'center' }}>
        <CustomText fontSize={40} fontWeight='bold' color='white'>{currentPoints}</CustomText>
        <GameEngine
          ref={(ref) => { setGameEngine(ref) }}
          systems={[Physics]}
          entities={entities()}
          running={running}
          onEvent={(e) => {
            switch (e.type) {
              case 'game_over':
                setRunning(false)
                gameEngine.stop()
                break;
              case 'add_point':
                setCurrentPoints(currentPoints + 1)
                break;
            }
          }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* <StatusBar style="dark" hidden={true}/> */}
  
        </GameEngine>
  
        {!running ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setCurrentPoints(0)
                setRunning(true)
                gameEngine.swap(entities())
              }}>
              <CustomText fontWeight='bold' color='white' fontSize={30}>
                START GAME
              </CustomText>
            </TouchableOpacity>
  
          </View> : null}
      </View>
    );
  }

  export default FischGame