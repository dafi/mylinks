import { EditDataType } from '../../model/EditData-interface';
import { MyLinksLookup } from '../../model/MyLinksLookup';

export type AppToolbarAddWidgetData = {
  onEdit?: (editData: EditDataType) => void;
  myLinksLookup?: MyLinksLookup;
};

