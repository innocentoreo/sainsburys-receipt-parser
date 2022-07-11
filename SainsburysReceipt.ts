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
    return new Promise<void>((resolve, reject) => {
      try {
        const pages: any[] = [];
        let currentPage: SainsburysReceiptPage | undefined;
        reader.parseFileItems(filePath, (err: any, item: any) => {
          if (item) {
            if (item.page) {
              if (currentPage) {
                pages.push(currentPage);
              }
              currentPage = new SainsburysReceiptPage();
            } else if (item.text) {
              currentPage?._texts.push(item as TextItem);
            }
          } else {
            if (currentPage) {
              pages.push(currentPage);
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
}

export default SainsburysReceipt;
