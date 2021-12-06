export interface COMMENT {
  id: string;
  comment: string;
  uid: string;
  username: string;
  timestamp: any;
  avatar: string;
  cstate: string;
  ecount: number;
}

export interface Broadcast {
  id: string;
  title: string;
  bdate: string;
  timestamp: any;
  bstate: string;
  url?: string;
}
