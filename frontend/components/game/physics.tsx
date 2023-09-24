import { Dimensions } from "react-native";
import Matter from "matter-js";

const windowHeight = Dimensions.get('window').width
const windowWidth = Dimensions.get('window').height

const Physics = (entities, { touches, time, dispatch }) => {
    let engine = entities.physics.engine

    touches.filter(t => t.type === 'press')
        .forEach(t => {
            console.log(t.pos.x - entities.Fisch.body.position.x)
            Matter.Body.setVelocity(entities.Fisch.body, {
                x: 0,
                y: -8
            })
        })

    Matter.Engine.update(engine, time.delta)

    // for (let index = 1; index <= 2; index++) {

    //     if (entities[`ObstacleTop${index}`].body.bounds.max.x <= 50 && !entities[`ObstacleTop${index}`].point) {
    //         entities[`ObstacleTop${index}`].point = true
    //         dispatch({ type: 'add_point' })

    //     }


    //     if (entities[`ObstacleTop${index}`].body.bounds.max.x <= 0) {
    //         const pipeSizePos = getPipeSizePosPair(windowWidth * 0.9);

    //         Matter.Body.setPosition(entities[`ObstacleTop${index}`].body, pipeSizePos.pipeTop.pos)
    //         Matter.Body.setPosition(entities[`ObstacleBottom${index}`].body, pipeSizePos.pipeBottom.pos)

    //         entities[`ObstacleTop${index}`].point = false
    //     }

    //     Matter.Body.translate(entities[`ObstacleTop${index}`].body, { x: -3, y: 0 })
    //     Matter.Body.translate(entities[`ObstacleBottom${index}`].body, { x: -3, y: 0 })
    // }


    // Matter.Events.on(engine, 'collisionStart', (event) => {
    //     dispatch({ type: 'game_over' })
    // })
    return entities;
}

export default Physics