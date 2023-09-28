import { Dimensions } from "react-native";
import Matter from "matter-js";
import Kalmar from "./components/Kalmar";
import { getRandom } from "./utils/random";

const windowHeight = Dimensions.get('window').width
const windowWidth = Dimensions.get('window').height

let touchX
let touchY
let gameTime = 0
let kalmarSpawnTime = 2000
let kalmarID = 1
let visibleKalmarIDs = []
let devouredKalmars
const Physics = (entities, { touches, time, dispatch }) => {
    let engine = entities.physics.engine
    gameTime += time.delta

    // handle touch events
    touches.filter(t => t.type === 'press' || t.type === 'move')
        .forEach(t => {
            touchY = t.event.pageX
            touchX = (windowWidth-t.event.pageY)
        })
    
    // update Fisch position 
    const fischX = entities.Fisch.body.position.x
    const fischY = entities.Fisch.body.position.y
    touchX = !touchX ? fischX : touchX
    touchY = !touchY ? fischY : touchY
    const positionX = fischX + (touchX - fischX) / 10
    const positionY = fischY + (touchY - fischY) / 10
    
    Matter.Body.setPosition(entities.Fisch.body, {
        x: positionX,
        y: positionY
    })
    
    // add new Kalmar
    if (gameTime>kalmarSpawnTime) {
        const position = getRandom(10,windowWidth-10)
        const velocity = getRandom(1,5)
        entities['Kalmar'+ kalmarID] = Kalmar(entities.physics.world, 'Kalmar'+kalmarID, 'green', {x:position,y:0}, {width:30,height:50});
        Matter.Body.setVelocity(entities['Kalmar'+kalmarID].body, {
            x: 0,
            y: velocity
        })
        visibleKalmarIDs.push(kalmarID)
        kalmarSpawnTime += 2000
        kalmarID += 1
    }

    // remove Kalmar after leaving screen
    for (let i = 0; i < visibleKalmarIDs.length; i++){
        const id = visibleKalmarIDs[i]
        const body = entities['Kalmar'+ id]
        if (body.body.position.y > windowHeight + body.body.bounds.max.y - body.body.bounds.min.y){
            Matter.World.remove(entities.physics.world, body);
            delete entities['Kalmar'+ id];
            visibleKalmarIDs = visibleKalmarIDs.filter(i => (i!=id))
        }
    }

    
    
    Matter.Events.on(engine, 'collisionStart', (event) => {
        console.log('collision')
        console.log({'a':event.pairs[0].bodyA.label,'b':event.pairs[0].bodyB.label})
        const label = event.pairs[0].bodyB.label
        if (label.includes('Kalmar')) {
            // console.log('label')
            if (label!=devouredKalmars){
                devouredKalmars = label
                entities[label].body.collisionFilter.category = -1
                entities[label].body.collisionFilter.mask = -1
                entities[label].body.position.y = windowHeight + 2 * (entities[label].body.bounds.max.y-entities[label].body.bounds.min.y)
                dispatch({ type: 'add_point' })
            }
            // console.log(visibleKalmarIDs)
        } else if (label.includes('Shark')) {
            dispatch({ type: 'game_over' })
        }
    })
    
    // Matter.Events.on(engine, 'afterUpdate', (event) => {
        
    //     if (devouredKalmars){
    //         if (entities.hasOwnProperty(devouredKalmars)){
    //             console.log('update')
    //             console.log(devouredKalmars)
    //             const label = devouredKalmars
    //             console.log(entities[label])
    //             entities[label].body.collisionFilter.category = -1
    //             entities[label].body.collisionFilter.mask = -1
    //             console.log('remove')
    //             Matter.World.remove(engine.world, entities[label]);
    //             console.log('delete')
    //             delete entities[label];
    //             console.log('visible')
    //             visibleKalmarIDs = visibleKalmarIDs.filter(i => (i!=parseInt(label.split('Kalmar')[0])))
    //             devouredKalmars = null
    //             dispatch({ type: 'add_point' })
    //         }
    //     }
    // })

    Matter.Engine.update(engine, time.delta)
    
    return entities;
}

export default Physics