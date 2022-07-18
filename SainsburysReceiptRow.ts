import { TextItem } from "./types";

class SainsburysReceiptRow {
  _textItems: TextItem[] = [];

  constructor(params?: { textItems?: TextItem[] }) {
    if (params) {
      if (params.textItems) {
        this._textItems = params.textItems;
      }
    }
  }

  get concatenatedText() {
    return this._textItems.reduce((acc, el) => acc + el.text, "");
  }
}

export default SainsburysReceiptRow;
