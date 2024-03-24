export type noteOnEvent = {
  duration: string;
  velocity: number
  notes: string[];
  pitch?: number;
}

export type NoteOffEvent = {
  notes: string[];
}
