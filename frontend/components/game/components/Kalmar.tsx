import Matter from 'matter-js'
import React from 'react'
import { View } from 'react-native'

const Kalmar = props => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y

    const xBody = props.body.position.x - widthBody / 2
    const yBody = props.body.position.y - heightBody / 2

    const color = props.color;

    return (
        <View style={{
            borderWidth: 3,
            borderColor: color,
            borderStyle: 'solid',
            position: 'absolute',
            left: xBody,
            top: yBody,
            width: widthBody,
            height: heightBody,
        }} />
    )
}

export default (world, label, color, pos, size) => {
    const initialObstacle = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        size.width,
        size.height,
        {
            label,
            restitution: 0, 
            friction: 0, 
            frictionAir: 0, 
            frictionStatic: 0,
            inertia: 'Infinity',
            collisionFilter: {
                group: -1,
                category: 1,
                mask: 2,
            }

        }
    )
    Matter.World.add(world, initialObstacle)

    return {
        body: initialObstacle,
        color,
        pos,
        renderer: <Kalmar />
    }
}
