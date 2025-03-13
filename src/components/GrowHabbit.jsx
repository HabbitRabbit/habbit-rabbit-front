import React from 'react';
import 

function GrowHabbit({ amount }) {
    // Calculate the size based on the 'amount' prop (from 0 to 100)
    const size = Math.min(100 + amount, 200); // Maximum size limit of 200px for example

    return (
        <div>
            <img 
                src="../assets/growingHabbit.png" 
                alt="Growing Image" 
                style={{ width: `${size}px`, height: `${size}px` }} 
            />
        </div>
    );
}

//<GrowHabbit amount={amount}/>

export default GrowHabbit;