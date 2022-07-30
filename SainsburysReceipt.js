"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pdfreader_1 = require("pdfreader");
var SainsburysReceiptPage_1 = require("./SainsburysReceiptPage");
var SainsburysReceipt = /** @class */ (function () {
    function SainsburysReceipt() {
        this._pages = [];
    }
    SainsburysReceipt.prototype.loadFromFile = function (filePath) {
        var _this = this;
        var reader = new pdfreader_1.PdfReader();
        var entriesStarted = false;
        var entriesEnded = false;
        return new Promise(function (resolve, reject) {
            try {
                var pages_1 = [];
                var currentPage_1;
                reader.parseFileItems(filePath, function (err, item) {
                    if (item) {
                        // not end of file
                        if (item.page) {
                            // new page
                            if (currentPage_1) {
                                // not first page
                                pages_1.push(currentPage_1);
                                // check if entries started or ended here
                                if (!entriesStarted) {
                                    entriesStarted = currentPage_1.entriesStart;
                                }
                                if (!entriesEnded) {
                                    entriesEnded = currentPage_1.entriesEnd;
                                }
                            }
                            // start new page with info on last page (have entries started, have they finished)
                            currentPage_1 = new SainsburysReceiptPage_1.default({
                                entriesStarted: entriesStarted,
                                entriesEnded: entriesEnded,
                            });
                        }
                        else if (item.text) {
                            currentPage_1 === null || currentPage_1 === void 0 ? void 0 : currentPage_1._texts.push(item);
                        }
                    }
                    else {
                        // end of file
                        if (currentPage_1) {
                            pages_1.push(currentPage_1);
                            if (!entriesStarted) {
                                entriesStarted = currentPage_1.entriesStart;
                            }
                            if (!entriesEnded) {
                                entriesEnded = currentPage_1.entriesEnd;
                            }
                        }
                        _this._pages = pages_1;
                        resolve();
                    }
                });
            }
            catch (err) {
                reject();
            }
        });
    };
    Object.defineProperty(SainsburysReceipt.prototype, "entries", {
        get: function () {
            return this._pages.reduce(function (entries, page) { return entries.concat(page.entries); }, []);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceipt.prototype, "orderNumber", {
        get: function () {
            var _a;
            return (_a = this._pages.find(function (page) { return page.orderNumber; })) === null || _a === void 0 ? void 0 : _a.orderNumber;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceipt.prototype, "slotTime", {
        get: function () {
            var _a;
            return (_a = this._pages.find(function (page) { return page.slotTime; })) === null || _a === void 0 ? void 0 : _a.slotTime;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceipt.prototype, "totalPaid", {
        get: function () {
            var _a;
            return (_a = this._pages.find(function (page) { return page.totalPaid; })) === null || _a === void 0 ? void 0 : _a.totalPaid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceipt.prototype, "itemCount", {
        get: function () {
            var _a;
            return (_a = this._pages.find(function (page) { return page.itemCount; })) === null || _a === void 0 ? void 0 : _a.itemCount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceipt.prototype, "rowsAsConcatenatedStrings", {
        get: function () {
            return this._pages.map(function (pg) { return pg.rowsAsStringArray; });
        },
        enumerable: false,
        configurable: true
    });
    return SainsburysReceipt;
}());
exports.default = SainsburysReceipt;
