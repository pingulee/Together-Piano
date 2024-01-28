import React from 'react';
import { playNote, releaseNote } from './tone/play-note'

export default function Key(props) {
    return (
        (props.sustain)
            ?
            <li className={props.className} onMouseDown={() => playNote(props.note, '3n')} />
            :
            <li className={props.className} onMouseDown={() => playNote(props.note, null)} onMouseUp={() => releaseNote()} />
    )
}