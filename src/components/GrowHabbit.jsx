import React from 'react';
import imgRabbit from "../assets/growingHabbit.png"
import sunglassRabbit from "../assets/growingHabbitSunGlasses.png"

function GrowHabbit({ amount }) {
    // Calculate the size based on the 'amount' prop (from 0 to 100)
    const size = Math.min(100 + amount, 500); // Maximum size limit
     console.log(size)
    return (
        <div>
            { amount < 100 ? <img 
                src={imgRabbit} 
                alt="Growing Image" 
                style={{ width: `${size}px`, height: `${size}px` }} 
            /> : 
            <img 
                src={sunglassRabbit} 
                alt="Sunglass Image" 
                style={{ width: `${size}px`, height: `${size}px` }} 
            />
        }
        </div>
    );
}

export default GrowHabbit;