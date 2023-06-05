"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_HOST = exports.DB_PASSWORD = exports.DB_USER = exports.DB_NAME = exports.NODE_ENV = void 0;
exports.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
exports.DB_NAME = process.env.DB_NAME ? process.env.DB_NAME : 'ww-database-prueba';
exports.DB_USER = process.env.DB_USER ? process.env.DB_USER : 'root';
exports.DB_PASSWORD = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : '';
exports.DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
//# sourceMappingURL=index.js.map