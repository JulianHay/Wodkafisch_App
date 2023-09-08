import React, { useEffect, useRef } from 'react';
import chestOpenImage from '../assets/chest_open.png';

const BattlePass = (props) => {
    const { season, items, unlockItems, seasonScore } = props;

    const itemLockedRef = useRef(null);
    const itemUnlockedRef = useRef(null);

    const unlockItemsArray = [];
    for (let i = 0; i < unlockItems.length; i++) {
        unlockItemsArray.push(unlockItems[i]);
    }

    const animateItems = new Array(items.length).fill(true);

    const progressAudio = new Audio("../assets/bubbles.mp3");
    const unlockAudio = new Audio("../assets/hölkynkölkyn.mp3");

    const progress = (percent, elementRef) => {
        const totalWidth = elementRef.current.offsetWidth;
        const progressBarWidth = (percent * totalWidth) / 100;

        const progressElement = elementRef.current.querySelector('#progress');
        const spanElement = progressElement.querySelector('span');

        let score = (progressBarWidth / totalWidth) * season.max_donation;
        score = Math.round(score);
        if (score > 1400) {
            spanElement.style.position = 'absolute';
            spanElement.style.left = '5px';
        }
        spanElement.textContent = score;

        items.forEach((item, index) => {
            if (progressBarWidth >= item.percent && animateItems[index]) {
                animateItems[index] = false;
                if (unlockItemsArray[index]) {
                    unlockItemsArray[index] = false;
                    const itemElement = elementRef.current.querySelector(`.item:nth-child(${index + 1})`);
                    itemElement.style.transform = 'scale(1.5)';
                    elementRef.current.style.marginBottom = '75px';
                    const itemLockedImage = itemLockedRef.current;
                    itemLockedImage.src = require("../assets/chest_open.png");
                    unlockAudio.play();
                }

                const itemElement = elementRef.current.querySelector(`.item:nth-child(${index + 1})`);
                const itemProgress = itemElement.querySelector('.itemProgress');
                itemProgress.style.width = '30px';

                const animationDuration = (5000 / progressBarWidth) * 30;
                itemProgress.style.transition = `width ${animationDuration}ms linear`;
            }
        });

        progressElement.style.width = `${progressBarWidth}px`;

        progressAudio.pause();
    };

    useEffect(() => {
        progressAudio.play();
        progress(seasonScore, progressBarRef);
    }, []);

    const progressBarRef = useRef();

    return (
        <div id='battlepass' className="battlepass" style={styles.battlepass}>
            <div className="row">
                <div id="season" className="season" style={styles.season}>
                    <div id="seasonTitle" className="seasonTitle" style={styles.seasonTitle}>
                        <p><span className="seasonTitleSpan" style={styles.seasonTitleSpan}>Season {season.id}</span> {season.title}</p>
                    </div>
                    <div id="seasonImage">
                        <a><img src={`../../backend/media/${season.image}`} alt="Season Image" /></a>
                    </div>
                </div>
            </div>
            <div className="row">
                <div id="progressBar" className="progressBar" style={styles.progressBar} ref={progressBarRef}>
                    <div id="progress" className="progress" style={styles.progress}>
                        <span className="progressSpan" style={styles.progressSpan}>0</span>
                        <a><img src="../assets/fisch.svg" style={styles.progressIcon} alt="Progress Icon" /></a>
                    </div>
                    <div>
                        {items.map((item, index) => (
                            <div className="item" key={index+1} style={{ ...styles.item, left: `${item.percent}%` }}>
                                <div id="itemPrice" className="itemPrice" style={styles.itemPrice}>{item.price} <img src="../assets/fish_flakes.svg" style={styles.itemPriceIcon} alt="Item Price Icon" /></div>
                                <div id="itemProgress" className="itemProgress" style={styles.itemProgress}></div>
                                {index >= unlockItemsArray.length || (!unlockItemsArray[index] && unlockItemsArray[index]) ? (
                                    <img ref={itemLockedRef} src="../assets/ChestClosed.png" style={styles.itemLocked} alt="Locked Item" />
                                ) : (
                                    <img ref={itemUnlockedRef} src="../assets/chest_open.png" style={styles.itemUnlocked} alt="Unlocked Item" />
                                )}
                                <div id="itemImage" className="itemImage" style={styles.itemImage}><img src={`../../backend/media/${item.image}`} alt="Item Image" /></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
const styles = {
    battlepass: {
        width: '100%',
        borderRadius: '20px',
        border: '1px solid #111',
        background: 'linear-gradient(to bottom, #007ae6, #000ddd)',
        boxShadow: '0 -1px 1px #c0bfbc inset',
    },
    season: {
        width: '90%',
        height: '65px',
        borderRadius: '20px',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '30px',
        marginBottom: '30px',
        background: 'linear-gradient(to bottom, #323232, #000)',
        boxShadow: '0 -1px 1px #c0bfbc inset',
    },
    seasonTitle: {
        width: '100%',
        height: '65px',
        borderRadius: '20px',
        border: '1px solid #fff',
        fontWeight: 'bold',
        background: 'linear-gradient(to bottom, #E0AA3E, #845800)',
    },
    seasonTitleSpan: {
        display: 'block',
        float: 'left',
        paddingLeft: '20px',
        height: '65px',
        textTransform: 'uppercase',
    },
    'seasonTitle p': {
        height: '65px',
        width: '100%',
        textAlign: 'right',
        paddingRight: '20px',
        fontSize: '28px',
        lineHeight: '65px',
    },
    '@media (max-width: 990px)': {
        'seasonTitle p': {
            fontSize: '13px',
        },
    },
    '@media (max-width: 440px)': {
        'seasonTitle p': {
            fontSize: '8px',
        },
    },
    'seasonImage img': {
        height: '100px',
        top: '-50%',
        position: 'absolute',
        marginTop: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
    },
    progressBar: {
        textAlign: 'center',
        width: '85%',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        height: '22px',
        borderRadius: '10px',
        border: '1px solid #111',
        backgroundColor: '#292929',
        boxShadow: '0 -1px 1px #c0bfbc inset',
        marginTop: '30px',
        marginBottom: '50px',
    },
    progress: {
        height: '100%',
        color: '#fff',
        textAlign: 'right',
        paddingRight: '10px',
        lineHeight: '22px',
        width: '0',
        borderRadius: '9px',
        backgroundColor: '#0099ff',
        boxShadow: '0 2px 2px #333',
        background: 'linear-gradient(to bottom, #0099ff, #000888)',
    },
    item: {
        textAlign: 'center',
        position: 'absolute',
        top: '-5px',
        width: '30px',
        height: '30px',
        marginLeft: '-15px',
        transformOrigin: 'center',
        borderRadius: '4px',
        border: '1px solid #111',
        backgroundColor: '#292929',
        boxShadow: '0 -1px 1px #c0bfbc inset',
    },
    itemPrice: {
        top: '-25px',
        position: 'absolute',
        display: 'flex',
        transform: 'translateX(-50%)',
        left: '50%',
        marginLeft: '1.2px',
    },
    itemPriceIcon: {
        width: '3mm',
        marginLeft: '5px',
    },
    itemProgress: {
        height: '100%',
        width: '0',
        borderRadius: '4px',
        backgroundColor: '#0099ff',
        boxShadow: '0 2px 2px #333',
        background: 'linear-gradient(to bottom, #0099ff, #000888)',
    },
    itemImage: {
        top: '35px',
        position: 'absolute',
        width: '30px',
    },
    'itemImage img': {
        maxWidth: '30px',
        maxHeight: '30px',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
    },
    itemLocked: {
        width: '25px',
        position: 'relative',
        top: '-26.5px',
        left: '-1.5px',
    },
    itemUnlocked: {
        width: '25px',
        position: 'relative',
        top: '-26.5px',
        left: '-0.5px',
    },
};


export default BattlePass;
