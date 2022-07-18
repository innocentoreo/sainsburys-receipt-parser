import { EntryField, ParseTextItemsResult, TextItem } from "./types";

function charWidth(char: string) {
  switch (char) {
    case "C":
    case "ﬀ":
    case "m":
      return 1;
    case "w":
      return 0.7;
    case "l":
      return 0.3;
    default:
      break;
  }
  return 0.5;
}

function parseTextItems(items: TextItem[]): ParseTextItemsResult {
  let field: EntryField = "Quantity";
  let lastItemPosition = -1;
  let fieldText = "";
  let result: ParseTextItemsResult = {
    quantityString: undefined,
    massString: undefined,
    descriptionString: undefined,
    priceString: undefined,
  };

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];

    if (lastItemPosition > -1) {
      switch (field) {
        case "Quantity":
          if (item.x - lastItemPosition > 0.8) {
            field = "Description";
            result.quantityString = fieldText;
            fieldText = "";
          }
          break;
        case "Description":
          if (item.x - lastItemPosition > 0.8) {
            field = "Price";
            result.descriptionString = fieldText;
            fieldText = "";
          }
          if (items[index - 1].text !== items[index - 1].text.toUpperCase()) {
            if (item.x - lastItemPosition > charWidth(items[index - 1].text)) {
              fieldText += " ";
            }
          }
          break;
        case "Price":
          if (index === items.length - 1) {
            fieldText += item.text;
            result.priceString = fieldText;
            fieldText = "";
          }
          break;
        default:
          break;
      }
    }

    lastItemPosition = item.x;
    fieldText += item.text.trim();
    fieldText = fieldText.trim();
  }
  return result;
}

class SainsburysReceiptEntry {
  _textItems: TextItem[] = [];

  _quantity: number | undefined;

  _mass_in_kg: number | undefined;

  _description: string | undefined;

  _price: number | undefined;

  constructor(params?: { textItems?: TextItem[] }) {
    this._quantity = -1;

    if (params) {
      if (params.textItems) {
        this._textItems = params.textItems;
        const parsedResult = parseTextItems(params.textItems);
        if (parsedResult.quantityString?.includes("kg")) {
          this._mass_in_kg = parseFloat(
            parsedResult.quantityString.replace("kg", "") || ""
          );
        } else {
          this._quantity = parseInt(parsedResult.quantityString || "", 10);
        }
        this._description = parsedResult.descriptionString;
        this._price =
          parseFloat((parsedResult.priceString || "").replace("£", "")) /
          this._quantity;
      }
    }
  }
}

export default SainsburysReceiptEntry;
