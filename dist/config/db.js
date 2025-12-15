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
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Grab the URI
        const rawURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blablaclone';
        // 2. DEBUG LOG: Print which one is being used
        // (This hides your password so it's safe to view)
        const maskedURI = rawURI.replace(/:([^:@]{1,})@/, ':****@');
        console.log(`🔌 Attempting to connect to: ${maskedURI}`);
        // 3. Connect
        const conn = yield mongoose_1.default.connect(rawURI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('❌ DB Connection Error:', error);
        process.exit(1);
    }
});
exports.default = connectDB;
