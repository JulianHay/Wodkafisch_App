import Matter from "matter-js"
import Fisch from "./components/Fisch";
import Floor from "./components/Floor";
import Obstacle from "./components/Kalmar";

import { Dimensions } from 'react-native'
import { getPipeSizePosPair } from "./utils/random";
import Kalmar from "./components/Kalmar";

const windowHeight = Dimensions.get('window').width
const windowWidth = Dimensions.get('window').height


export default restart => {
    let engine = Matter.Engine.create({ enableSleeping: false })

    let world = engine.world

    world.gravity.y = 0;

    const pipeSizePosA = getPipeSizePosPair()
    const pipeSizePosB = getPipeSizePosPair(windowWidth * 0.9)
    return {
        physics: { engine, world },

        Fisch: Fisch(world, 'blue', { x: windowWidth/2-20, y: windowHeight/2-20 }, { radius: 40 }),
        
        // Kalmars: [Kalmar(world,'K','red',{x:200,y:200},{width:100,height:100})],

        // KalmarTest: Kalmar(world,'K','red',{x:200,y:200},{width:100,height:100})
        // ObstacleTop1: Obstacle(world, 'ObstacleTop1', 'red', pipeSizePosA.pipeTop.pos, pipeSizePosA.pipeTop.size),
        // ObstacleBottom1: Obstacle(world, 'ObstacleBottom1', 'blue', pipeSizePosA.pipeBottom.pos, pipeSizePosA.pipeBottom.size),

        // ObstacleTop2: Obstacle(world, 'ObstacleTop2', 'red', pipeSizePosB.pipeTop.pos, pipeSizePosB.pipeTop.size),
        // ObstacleBottom2: Obstacle(world, 'ObstacleBottom2', 'blue', pipeSizePosB.pipeBottom.pos, pipeSizePosB.pipeBottom.size),

        // Floor: Floor(world, 'green', { x: windowWidth / 2, y: windowHeight }, { height: 50, width: windowWidth })
    }
}