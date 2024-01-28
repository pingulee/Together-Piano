import { synth } from './tone-config';

export default function changeVol(vol) {
    synth.volume.value = vol;
}