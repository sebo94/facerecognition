import React from 'react';
import Tilt from 'react-tilt';
import brain from './brain.png';

const Logo = () => {
    return(
        <div className='ma4 mt0'>
            <Tilt 
            className="Tilt" 
            options={{ max : 55 }} 
            style={{ height: 150, width: 150, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                <div className="Tilt-inner"> 
                    <img src={brain} alt='brain logo'/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;