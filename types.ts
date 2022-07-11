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
