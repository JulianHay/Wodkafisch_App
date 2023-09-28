import Matter from 'matter-js'
import React from 'react'
import { View } from 'react-native'

const Fisch = props => {
    const radius = (props.body.bounds.max.x - props.body.bounds.min.x)/2

    const xBody = props.body.position.x - radius
    const yBody = props.body.position.y - radius

    const color = props.color;

    return(
        <View style={{
            borderWidth: 2,
            borderRadius: 50,
            borderColor: color,
            borderStyle: 'solid',
            position: 'absolute',
            left: xBody,
            top: yBody,
            width: 2*radius,
            height: 2*radius,
        }}/>
    )
}

export default (world, color, pos, size) => {
   const initialFisch = Matter.Bodies.circle(
       pos.x,
       pos.y,
       size.radius,
       {label: 'Fisch',
        collisionFilter: {
        group: 0,
        category: 2,
        mask: 1,
    }
        }
   )
   Matter.World.add(world, initialFisch)

   return {
       body: initialFisch,
       color,
       pos,
       renderer: <Fisch/>
   }
}