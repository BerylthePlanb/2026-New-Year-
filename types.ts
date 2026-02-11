
export interface GreetingOption {
  id: number;
  text: string;
}

export interface TextState {
  id: number;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  EDITING = 'EDITING',
  ERROR = 'ERROR'
}
