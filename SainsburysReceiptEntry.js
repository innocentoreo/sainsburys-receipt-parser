"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function charWidth(char) {
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
function parseTextItems(items) {
    var field = "Quantity";
    var lastItemPosition = -1;
    var fieldText = "";
    var result = {
        quantityString: undefined,
        massString: undefined,
        descriptionString: undefined,
        priceString: undefined,
    };
    for (var index = 0; index < items.length; index += 1) {
        var item = items[index];
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
var SainsburysReceiptEntry = /** @class */ (function () {
    function SainsburysReceiptEntry(params) {
        var _a;
        this._textItems = [];
        this.quantity = -1;
        if (params) {
            if (params.textItems) {
                this._textItems = params.textItems;
                var parsedResult = parseTextItems(params.textItems);
                if ((_a = parsedResult.quantityString) === null || _a === void 0 ? void 0 : _a.includes("kg")) {
                    this.mass_in_kg = parseFloat(parsedResult.quantityString.replace("kg", "") || "");
                }
                else {
                    this.quantity = parseInt(parsedResult.quantityString || "", 10);
                }
                this.description = parsedResult.descriptionString;
                this.price =
                    parseFloat((parsedResult.priceString || "").replace("£", "")) /
                        this.quantity;
            }
        }
    }
    Object.defineProperty(SainsburysReceiptEntry.prototype, "serialisable", {
        get: function () {
            return {
                quantity: this.quantity,
                mass_in_kg: this.mass_in_kg,
                description: this.description,
                price: this.price,
            };
        },
        enumerable: false,
        configurable: true
    });
    return SainsburysReceiptEntry;
}());
exports.default = SainsburysReceiptEntry;
