import React from 'react'

interface ProgressBar {
    value: number;
    max: number;
    type?: 'primary' | 'secondary' | 'accent' | 'success' | 'info';
}

const ProgressBar = ({value,max,type='primary'}:ProgressBar) => {
  return (
    <div>
      <progress className={
        type==='primary' ? 'progress progress-primary' : 
        type==='secondary' ? 'progress progress-secondary':
        type==='accent' ? 'progress progress-accent' : 
        type==='success' ? 'progress progress-success':
        'progress progress-info'
        } value={value} max={max}></progress>
    </div>
  )
}

export {ProgressBar}