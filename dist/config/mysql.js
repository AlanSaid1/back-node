"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const connectionOptions = {
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'ww-database-prueba',
};
function getConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield promise_1.default.createConnection(connectionOptions);
        return connection;
    });
}
exports.getConnection = getConnection;
//# sourceMappingURL=mysql.js.map