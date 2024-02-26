export type OscillatorConfig = {
  volume: number;
  detune: number;
  active: boolean;
  octave: number;
  type: string;
  pan?: number;
  phase?: number;
}

export type FilterConfig = {
  type: "lowpass" | "highpass" |  "bandpass" |  "lowshelf" |  "highshelf" |  "notch" |  "allpass" |  "peaking"
  detune: number;
  frequency: number;
  gain: number;
  Q: number;
  rolloff: number;
}

export type ADSREnvelopeConfig = {
  attack: number;
  attackCurve?: 'linear' | 'exponential';
  decay: number;
  decayCurve?: 'linear' | 'exponential';
  sustain: number;
  release: number;
  releaseCurve?: 'linear' | 'exponential';
}

export type FilterEnvelopeConfig = {
  attack: number;
  attackCurve?: 'linear' | 'exponential';
  decay: number;
  decayCurve?: 'linear' | 'exponential';
  sustain: number;
  release: number;
  releaseCurve?: 'linear' | 'exponential';
  baseFrequency?: number;
  octaves?: number;
  exponent?: number;
}
