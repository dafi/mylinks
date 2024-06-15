import { Config, MyLinks } from '../model/MyLinks-interface';
import { MyLinksLookup } from '../model/MyLinksLookup';

export type AppConfig = {
  myLinksLookup: MyLinksLookup;
} & Config & Pick<MyLinks, 'theme'>;
