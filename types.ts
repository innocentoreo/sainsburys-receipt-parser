export interface PdfFileItem {
  x: number;
  y: number;
  w: number;
  sw: number;
}

export interface TextItem extends PdfFileItem {
  A: "left" | "right";
  text: string;
  R: any;
}

export type EntryField = "Quantity" | "Mass" | "Description" | "Price";

export interface ParseTextItemsResult {
  quantityString: undefined | string;
  massString: undefined | string;
  descriptionString: undefined | string;
  priceString: undefined | string;
}

export interface SerialisableReceiptEntry {
  quantity: number | undefined;
  mass_in_kg: number | undefined;
  description: string | undefined;
  price: number | undefined;
}

export interface SerialisableReceipt {
  entries: SerialisableReceiptEntry[];
  orderNumber: number | undefined;
  slotTime: Date | undefined;
  totalPaid: number | undefined;
  itemCount: number | undefined;
  rowsAsConcatenatedStrings: string[][];
}
