import SainsburysReceiptEntry from "./SainsburysReceiptEntry";
import SainsburysReceiptRow from "./SainsburysReceiptRow";
import { PdfFileItem, TextItem } from "./types";

function sortByX<T extends PdfFileItem>(items: T[]) {
  return items.sort((a, b) => a.x - b.x);
}

function monthAsNumber(monthAsString: string) {
  let monthNums = [];
  for (let index = 0; index < 12; index += 1) {
    monthNums.push(index);
  }
  const months = monthNums.map((monthNum) => {
    const date = new Date(0);
    date.setMonth(monthNum);
    return date.toLocaleString("default", { month: "long" });
  });
  return months.indexOf(monthAsString);
}

function parseSainsburysTime(timeAsString: string) {
  const regExp = /([0-9]+):([0-9]+)([apm]+)/g;
  const match = regExp.exec(timeAsString);
  if (match !== null) {
    const isPM = match[3] === "pm";
    return {
      hours: parseInt(match[1], 10) + (isPM ? 12 : 0),
      minutes: parseInt(match[2], 10),
    };
  }
  return undefined;
}

class SainsburysReceiptPage {
  _texts: TextItem[];

  _entriesStarted: boolean = false;

  _entriesEnded: boolean = false;

  constructor(params?: { entriesStarted?: boolean; entriesEnded?: boolean }) {
    this._texts = [];
    if (params) {
      if (params.entriesStarted) {
        this._entriesStarted = params.entriesStarted;
      }
      if (params.entriesEnded) {
        this._entriesEnded = params.entriesEnded;
      }
    }
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

  get rowsAsStringArray() {
    const rows = this.rows;
    return rows.map((row) =>
      row.reduce((text, el) => {
        text += el.text;
        return text;
      }, "")
    );
  }

  get orderNumber() {
    const strings = this.rowsAsStringArray;
    let regExp = /Yourreceiptfororder:([0-9]+)/g;
    const goodString = strings.find((string) => string.match(regExp));
    if (goodString) {
      let match = regExp.exec(goodString);
      if (match === null) {
        return undefined;
      }
      return parseInt(match[1], 10);
    }
    return undefined;
  }

  get slotTime() {
    const strings = this.rowsAsStringArray;
    let regExp =
      /Slottime:([A-z]+)([0-9]+[^A-Z]+)([A-z]+)([^,]+),([0-9\:apm]+)-([0-9\:apm]+)/g;
    const goodString = strings.find((string) => string.match(regExp));
    if (goodString) {
      let match = regExp.exec(goodString);
      if (match === null) {
        return undefined;
      }
      const resultDate = new Date(0);
      resultDate.setFullYear(
        parseInt(match[4], 10),
        monthAsNumber(match[3]),
        parseInt(match[2], 10)
      );
      const slotHoursAndMinutes = parseSainsburysTime(match[5]);
      if (slotHoursAndMinutes) {
        resultDate.setHours(slotHoursAndMinutes.hours);
        resultDate.setMinutes(slotHoursAndMinutes.minutes);
      }
      return resultDate;
    }
    return undefined;
  }

  get entries() {
    const rows = this.rows;
    const result: SainsburysReceiptEntry[] = [];
    let firstRowReached = this._entriesStarted;
    let lastRowReached = this._entriesEnded;
    for (let index = 0; index < rows.length; index += 1) {
      const row = new SainsburysReceiptRow({ textItems: rows[index] });
      if (row.concatenatedText.trim() === "Ordersummary") {
        lastRowReached = true;
      }
      if (firstRowReached && !lastRowReached) {
        result.push(new SainsburysReceiptEntry({ textItems: rows[index] }));
      }
      if (row.concatenatedText.trim().includes("Deliverysummary")) {
        firstRowReached = true;
      }
    }
    return result;
  }

  get entriesStart() {
    const rows = this.rows;
    let firstRowReached = false;
    for (let index = 0; index < rows.length; index += 1) {
      const row = new SainsburysReceiptRow({ textItems: rows[index] });
      if (row.concatenatedText.trim().includes("Deliverysummary")) {
        firstRowReached = true;
      }
    }
    return firstRowReached;
  }

  get entriesEnd() {
    const rows = this.rows;
    let lastRowReached = false;
    for (let index = 0; index < rows.length; index += 1) {
      const row = new SainsburysReceiptRow({ textItems: rows[index] });
      if (row.concatenatedText.trim() === "Ordersummary") {
        lastRowReached = true;
      }
    }
    return lastRowReached;
  }
}

export default SainsburysReceiptPage;
