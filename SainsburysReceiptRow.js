"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SainsburysReceiptRow = /** @class */ (function () {
    function SainsburysReceiptRow(params) {
        this._textItems = [];
        if (params) {
            if (params.textItems) {
                this._textItems = params.textItems;
            }
        }
    }
    Object.defineProperty(SainsburysReceiptRow.prototype, "concatenatedText", {
        get: function () {
            return this._textItems.reduce(function (acc, el) { return acc + el.text; }, "");
        },
        enumerable: false,
        configurable: true
    });
    return SainsburysReceiptRow;
}());
exports.default = SainsburysReceiptRow;
