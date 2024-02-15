import React from 'react'
interface Range {
    min: number,
    max: number
}
interface plotlyLayout {
    title?: string,
    xlabel?: string,
    ylabel?: string,
    width?: number,
    height?: number,
    type?: 'light' | 'dark',
    xrange?: Range,
    yrange?: Range
}
export const plotlyLayout = ({title='',xlabel='',ylabel='',width=500,height=400,type='light',xrange,yrange}:plotlyLayout) => {
    return({
        width: width,
        height: height,
        title: title,
        xaxis: {
            title: xlabel,
            tickfont: { size: 14, color: 'white' },
            linecolor: 'white',
            gridcolor: 'white',
            range: xrange ? [xrange.min, xrange.max] : 'None',
            zerolinecolor: 'white'
        },
        yaxis: {
            title: ylabel,
            tickfont: { size: 14, color: 'white' },
            linecolor: 'white',
            gridcolor: 'white',
            range: yrange ? [yrange.min, yrange.max] : 'None',
            zerolinecolor: 'white'
        },
        plot_bgcolor: type==='light' ? '#374151' : '#1f2937',
        paper_bgcolor: type==='light' ? '#374151' : '#1f2937',
        colorway: ['#3288bd','#99d594','#e6f598','#fee08b','#fc8d59','#d53e4f',], 
        font: {
            family: 'Arial, sans-serif',
            size: 16,
            color: 'white',
        },
})}