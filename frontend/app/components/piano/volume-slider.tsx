import React from 'react';

export default function VolumeSlider({ onChange }) {
    return (
        <div className='volumeController'>
            <label>Volume</label>
            <input
                className='volumeSlider'
                type="range"
                min="-35" max="15"
                defaultValue='0'
                onChange={onChange}
                step="1"
            />
        </div>
    );
}