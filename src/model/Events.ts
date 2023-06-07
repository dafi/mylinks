export interface MyLinksEvent {
  target: string;
  data?: unknown;
}

export type MyLinkAction = (data: MyLinksEvent) => void;
