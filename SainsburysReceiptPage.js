"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SainsburysReceiptEntry_1 = require("./SainsburysReceiptEntry");
var SainsburysReceiptRow_1 = require("./SainsburysReceiptRow");
function sortByX(items) {
    return items.sort(function (a, b) { return a.x - b.x; });
}
function monthAsNumber(monthAsString) {
    var monthNums = [];
    for (var index = 0; index < 12; index += 1) {
        monthNums.push(index);
    }
    var months = monthNums.map(function (monthNum) {
        var date = new Date(0);
        date.setMonth(monthNum);
        return date.toLocaleString("default", { month: "long" });
    });
    return months.indexOf(monthAsString);
}
function parseSainsburysTime(timeAsString) {
    var regExp = /([0-9]+):([0-9]+)([apm]+)/g;
    var match = regExp.exec(timeAsString);
    if (match !== null) {
        var isPM = match[3] === "pm";
        return {
            hours: parseInt(match[1], 10) + (isPM ? 12 : 0),
            minutes: parseInt(match[2], 10),
        };
    }
    return undefined;
}
var SainsburysReceiptPage = /** @class */ (function () {
    function SainsburysReceiptPage(params) {
        this._entriesStarted = false;
        this._entriesEnded = false;
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
    Object.defineProperty(SainsburysReceiptPage.prototype, "yVals", {
        get: function () {
            return this._texts.reduce(function (yVals, text) {
                if (!yVals.includes(text.y)) {
                    yVals.push(text.y);
                }
                return yVals;
            }, []);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceiptPage.prototype, "rows", {
        get: function () {
            var _this = this;
            var texts = this.yVals.map(function (yVal) {
                return _this._texts.filter(function (text) { return text.y === yVal; });
            });
            return texts.map(function (text) {
                return sortByX(text);
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceiptPage.prototype, "rowsAsStringArray", {
        get: function () {
            var rows = this.rows;
            return rows.map(function (row) {
                return row.reduce(function (text, el) {
                    text += el.text;
                    return text;
                }, "");
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceiptPage.prototype, "orderNumber", {
        get: function () {
            var strings = this.rowsAsStringArray;
            var regExp = /Yourreceiptfororder:([0-9]+)/g;
            var goodString = strings.find(function (string) { return string.match(regExp); });
            if (goodString) {
                var match = regExp.exec(goodString);
                if (match === null) {
                    return undefined;
                }
                return parseInt(match[1], 10);
            }
            return undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceiptPage.prototype, "totalPaid", {
        get: function () {
            var strings = this.rowsAsStringArray;
            var regExp = /Totalpaid£([0-9.]+)/g;
            var goodString = strings.find(function (string) { return string.match(regExp); });
            if (goodString) {
                var match = regExp.exec(goodString);
                if (match === null) {
                    return undefined;
                }
                return parseFloat(match[1]);
            }
            return undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceiptPage.prototype, "itemCount", {
        get: function () {
            var strings = this.rowsAsStringArray;
            var regExp = /Deliverysummary\(([0-9]+)items\)/g;
            var goodString = strings.find(function (string) { return string.match(regExp); });
            if (goodString) {
                var match = regExp.exec(goodString);
                if (match === null) {
                    return undefined;
                }
                return parseInt(match[1], 10);
            }
            return undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceiptPage.prototype, "slotTime", {
        get: function () {
            var strings = this.rowsAsStringArray;
            var regExp = /Slottime:([A-z]+)([0-9]+[^A-Z]+)([A-z]+)([^,]+),([0-9\:apm]+)-([0-9\:apm]+)/g;
            var goodString = strings.find(function (string) { return string.match(regExp); });
            if (goodString) {
                var match = regExp.exec(goodString);
                if (match === null) {
                    return undefined;
                }
                var resultDate = new Date(0);
                resultDate.setFullYear(parseInt(match[4], 10), monthAsNumber(match[3]), parseInt(match[2], 10));
                var slotHoursAndMinutes = parseSainsburysTime(match[5]);
                if (slotHoursAndMinutes) {
                    resultDate.setHours(slotHoursAndMinutes.hours);
                    resultDate.setMinutes(slotHoursAndMinutes.minutes);
                }
                return resultDate;
            }
            return undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceiptPage.prototype, "entries", {
        get: function () {
            var rows = this.rows;
            var result = [];
            var firstRowReached = this._entriesStarted;
            var lastRowReached = this._entriesEnded;
            for (var index = 0; index < rows.length; index += 1) {
                var row = new SainsburysReceiptRow_1.default({ textItems: rows[index] });
                if (row.concatenatedText.trim() === "Ordersummary") {
                    lastRowReached = true;
                }
                if (firstRowReached && !lastRowReached) {
                    result.push(new SainsburysReceiptEntry_1.default({ textItems: rows[index] }));
                }
                if (row.concatenatedText.trim().includes("Deliverysummary")) {
                    firstRowReached = true;
                }
            }
            return result;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceiptPage.prototype, "entriesStart", {
        get: function () {
            var rows = this.rows;
            var firstRowReached = false;
            for (var index = 0; index < rows.length; index += 1) {
                var row = new SainsburysReceiptRow_1.default({ textItems: rows[index] });
                if (row.concatenatedText.trim().includes("Deliverysummary")) {
                    firstRowReached = true;
                }
            }
            return firstRowReached;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SainsburysReceiptPage.prototype, "entriesEnd", {
        get: function () {
            var rows = this.rows;
            var lastRowReached = false;
            for (var index = 0; index < rows.length; index += 1) {
                var row = new SainsburysReceiptRow_1.default({ textItems: rows[index] });
                if (row.concatenatedText.trim() === "Ordersummary") {
                    lastRowReached = true;
                }
            }
            return lastRowReached;
        },
        enumerable: false,
        configurable: true
    });
    return SainsburysReceiptPage;
}());
exports.default = SainsburysReceiptPage;
