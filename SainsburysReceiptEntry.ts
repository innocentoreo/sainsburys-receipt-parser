import {
  EntryField,
  ParseTextItemsResult,
  SerialisableReceiptEntry,
  TextItem,
} from "./types";

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

  quantity: number | undefined;

  mass_in_kg: number | undefined;

  description: string | undefined;

  price: number | undefined;

  constructor(params?: { textItems?: TextItem[] }) {
    this.quantity = -1;

    if (params) {
      if (params.textItems) {
        this._textItems = params.textItems;
        const parsedResult = parseTextItems(params.textItems);
        if (parsedResult.quantityString?.includes("kg")) {
          this.mass_in_kg = parseFloat(
            parsedResult.quantityString.replace("kg", "") || ""
          );
        } else {
          this.quantity = parseInt(parsedResult.quantityString || "", 10);
        }
        this.description = parsedResult.descriptionString;
        this.price =
          parseFloat((parsedResult.priceString || "").replace("£", "")) /
          this.quantity;
      }
    }
  }

  get serialisable(): SerialisableReceiptEntry {
    return {
      quantity: this.quantity,
      mass_in_kg: this.mass_in_kg,
      description: this.description,
      price: this.price,
    };
  }
}

export default SainsburysReceiptEntry;
