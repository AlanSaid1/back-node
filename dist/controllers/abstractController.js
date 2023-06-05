"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class AbstractController {
    get prefix() {
        return this._prefix;
    }
    get router() {
        return this._router;
    }
    constructor(prefix) {
        this._router = (0, express_1.Router)();
        this._prefix = prefix;
        this.initRoutes();
    }
}
exports.default = AbstractController;
//# sourceMappingURL=abstractController.js.map