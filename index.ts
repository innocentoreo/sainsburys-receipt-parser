import SainsburysReceipt from "./SainsburysReceipt";
import fs from "fs";

const folder = "";

const dir = fs.readdirSync(folder);

const rct = new SainsburysReceipt();

rct.loadFromFile(folder + dir[0]).then(() => {
  for (let index = 0; index < rct.entries.length; index += 1) {
    const element = rct.rowsAsConcatenatedStrings;
    console.log(element);
  }
});
