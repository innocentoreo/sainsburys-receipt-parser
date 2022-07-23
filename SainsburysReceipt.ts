import SainsburysReceiptEntry from "./SainsburysReceiptEntry";
import { PdfReader } from "pdfreader";
import SainsburysReceiptPage from "./SainsburysReceiptPage";
import { TextItem } from "./types";

class SainsburysReceipt {
  _pages: SainsburysReceiptPage[];

  constructor() {
    this._pages = [];
  }

  loadFromFile(filePath: string) {
    const reader = new PdfReader();
    let entriesStarted = false;
    let entriesEnded = false;
    return new Promise<void>((resolve, reject) => {
      try {
        const pages: any[] = [];
        let currentPage: SainsburysReceiptPage | undefined;
        reader.parseFileItems(filePath, (err: any, item: any) => {
          if (item) {
            // not end of file
            if (item.page) {
              // new page
              if (currentPage) {
                // not first page
                pages.push(currentPage);
                // check if entries started or ended here
                if (!entriesStarted) {
                  entriesStarted = currentPage.entriesStart;
                }
                if (!entriesEnded) {
                  entriesEnded = currentPage.entriesEnd;
                }
              }
              // start new page with info on last page (have entries started, have they finished)
              currentPage = new SainsburysReceiptPage({
                entriesStarted,
                entriesEnded,
              });
            } else if (item.text) {
              currentPage?._texts.push(item as TextItem);
            }
          } else {
            // end of file
            if (currentPage) {
              pages.push(currentPage);
              if (!entriesStarted) {
                entriesStarted = currentPage.entriesStart;
              }
              if (!entriesEnded) {
                entriesEnded = currentPage.entriesEnd;
              }
            }
            this._pages = pages;
            resolve();
          }
        });
      } catch (err) {
        reject();
      }
    });
  }

  get entries() {
    return this._pages.reduce<SainsburysReceiptEntry[]>(
      (entries, page) => entries.concat(page.entries),
      []
    );
  }

  get orderNumber() {
    return this._pages.find((page) => page.orderNumber)?.orderNumber;
  }

  get slotTime() {
    return this._pages.find((page) => page.slotTime)?.slotTime;
  }

  get rowsAsConcatenatedStrings() {
    return this._pages.map((pg) => pg.rowsAsStringArray);
  }
}

export default SainsburysReceipt;
