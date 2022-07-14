import SainsburysReceipt from "./SainsburysReceipt";
import fs from "fs";

const folder = "";

const dir = fs.readdirSync(folder);

const rct = new SainsburysReceipt();

interface Entry {
  description: string;
  qty: number;
  prices: number[];
}

const names: Entry[] = [];

async function loadFiles() {
  for (let index = 0; index < dir.length; index++) {
    const fileName = folder + dir[index];
    console.log(fileName);
    await rct.loadFromFile(fileName);

    for (let jdx = 0; jdx < rct.entries.length; jdx++) {
      const el = rct.entries[jdx];
      const match = names.find((el2) => el2.description === el._description);
      if (match) {
        match.qty += 1;
        match.prices.push(el._price || -1);
      } else {
        names.push({
          description: el._description || "",
          qty: 1,
          prices: [el._price || -1],
        });
      }
    }
  }
}

loadFiles().then(() => console.log(names.filter((el) => el.qty > 1)));
