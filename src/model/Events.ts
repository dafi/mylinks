export interface MyLinksEvent<Actions> {
  target: Actions;
  data?: unknown;
}

export type MyLinkActionCallback<A> = (data: MyLinksEvent<A>) => void;
