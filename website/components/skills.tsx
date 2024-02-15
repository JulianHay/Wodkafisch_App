import React from 'react'
import { ProgressBar } from './progress'
import { ColumnContainer } from './containers';

interface Skill {
    title: string;
    description: string;
    value: number;
}

interface Skillbars {
    items: Array<Skill>
}

interface SkillTitle {
    title: string;
    description: string;
}

interface SkillContainer {
    children: React.ReactNode;
}

const SkillContainer = ({children}:SkillContainer) => {
  return (
    <div>{children}</div>
  )
}

const SkillTitle = ({title,description}:SkillTitle) => {
  return (
    <div className='p-1 flex justify-between text-white -mb-3'>
        <span>
            {title}
        </span>
        <span>
            {description}
        </span>
    </div>
  )
}


const Skillbars = ({items}:Skillbars) => {
  return (
      items.map((item) => {
          return(
              <SkillContainer>
                  <SkillTitle title={item.title} description={item.description}/>
                  <ProgressBar value={item.value} max={100} type='primary'/>
              </SkillContainer>
          )
      })
  )
}

export {Skillbars}