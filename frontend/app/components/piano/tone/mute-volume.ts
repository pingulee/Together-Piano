import Tone from 'tone';

export default function muteVol(bool) {
    Tone.Master.mute = bool;
}