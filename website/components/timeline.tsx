'use client';
import React from 'react'
import { Chrono } from 'react-chrono';

interface TimelineItem {
    title: string;
    cardTitle: string;
    cardSubtitle: string;
    cardDetailedText: string;
}

interface Timeline {
    items: Array<TimelineItem>;
}

const Timeline = ({items}:Timeline) => {
    return (
            <Chrono 
            items={items} 
            mode="VERTICAL_ALTERNATING" 
            activeItemIndex={null}
            theme={{
                primary: '#555',
                secondary: '#BBB',
                titleColor: '#BBB',
                cardBgColor: '#333',
                cardTitleColor: '#3498DB',
                cardSubtitleColor: 'white',
                cardDetailsColor: '#EEE',
            }}
            fontSizes={{
                title: '1rem',
                cardTitle: '1rem',
                cardSubtitle: '0.85rem',
                cardText: '0.8rem',
            }}
            hideControls={true}
            />
    );
  };
  export {Timeline};