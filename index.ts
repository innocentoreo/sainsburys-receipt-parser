import SainsburysReceipt from "./SainsburysReceipt";
import fs from "fs";

const folder = "";

const dir = fs.readdirSync(folder);

const rct = new SainsburysReceipt();

async function main() {
  for (let index = 0; index < dir.length; index += 1) {
    await rct.loadFromFile(folder + dir[index]).then(() => {
      console.log(
        rct.orderNumber,
        rct.totalPaid,
        rct.itemCount,
        rct.totalPaid && rct.itemCount
          ? rct.totalPaid / rct.itemCount
          : undefined,
        rct.slotTime?.toLocaleString()
      );
    });
  }
}

main();
