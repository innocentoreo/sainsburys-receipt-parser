import SainsburysReceipt from "./SainsburysReceipt";

const rct = new SainsburysReceipt();
rct.loadFromFile("").then(() => console.log(rct.entries));
