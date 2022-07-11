import SainsburysReceiptEntry from "./SainsburysReceiptEntry";
import { PdfFileItem, TextItem } from "./types";

function sortByX<T extends PdfFileItem>(items: T[]) {
  return items.sort((a, b) => a.x - b.x);
}

class SainsburysReceiptPage {
  _texts: TextItem[];

  constructor() {
    this._texts = [];
  }

  get yVals() {
    return this._texts.reduce<number[]>((yVals, text) => {
      if (!yVals.includes(text.y)) {
        yVals.push(text.y);
      }
      return yVals;
    }, []);
  }

  get rows() {
    const texts = this.yVals.map((yVal) => {
      return this._texts.filter((text) => text.y === yVal);
    });
    return texts.map((text) => {
      return sortByX(text);
    });
  }

  get rowsAsString() {
    const rows = this.rows;
    return rows.map((row) =>
      row.reduce((text, el) => {
        text += el.text;
        return text;
      }, "")
    );
  }

  get entries() {
    const rows = this.rows;
    return rows.map((row) => new SainsburysReceiptEntry({ textItems: row }));
  }
}

export default SainsburysReceiptPage;
