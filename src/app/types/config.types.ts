export type OscillatorConfig = {
  volume: number;
  detune: number;
  active: boolean;
  octave: number;
  type: string;
  pan?: number;
}

export type FilterConfig = {
  type: "lowpass" | "highpass" |  "bandpass" |  "lowshelf" |  "highshelf" |  "notch" |  "allpass" |  "peaking"
  detune: number;
  frequency: number;
  gain: number;
  input: number;
  q: number;
}

export type ADSREnvelopeConfig = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}
