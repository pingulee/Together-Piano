import { synth } from './tone-config';

export function playNote(note, duration) {
    if (duration === null) {
        synth.triggerAttack(note);
    } else {
        synth.triggerAttackRelease(note, duration);
    }
}

export function releaseNote() {
    synth.triggerRelease();
}