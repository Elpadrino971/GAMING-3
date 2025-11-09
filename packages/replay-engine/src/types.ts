export interface VideoClip {
  handId: string;
  duration: number; // secondes
  frames: Frame[];
  commentary: string;
  highlight: boolean;
}

export interface Frame {
  timestamp: number; // ms
  cards: any[];
  pot: number;
  action?: string;
  effect?: VideoEffect;
}

export enum VideoEffect {
  GOOD_PLAY = 'good_play',
  MISTAKE = 'mistake',
  CRITICAL_ERROR = 'critical_error',
  EPIC_BLUFF = 'epic_bluff',
  BAD_BEAT = 'bad_beat'
}

export interface VideoConfig {
  resolution: '720p' | '1080p' | '4k';
  fps: number;
  format: 'mp4' | 'mov' | 'gif';
  style: 'minimal' | 'pro' | 'flashy';
}
