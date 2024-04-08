export interface Notification {
  msg_id: string;
  msg: string;
  time: number;
  displayed: boolean;
  hover: boolean;
}

export interface Settings {
  count: number,
  position: string,
  time: number;
}