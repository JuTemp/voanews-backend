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
const express_1 = __importDefault(require("express"));
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const translate_1 = require("../util/translate");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const Limiter20per1min = new rate_limiter_flexible_1.RateLimiterMemory({ duration: 60, points: 20 });
const Limiter100per1hr = new rate_limiter_flexible_1.RateLimiterMemory({ duration: 60 * 60, points: 100 });
const Limiter200per1d = new rate_limiter_flexible_1.RateLimiterMemory({ duration: 24 * 60 * 60, points: 200 });
app.post('/api/trans', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await Limiter20per1min.consume(request.ip, 1)
        // await Limiter100per1hr.consume(request.ip, 1)
        // await Limiter200per1d.consume(request.ip, 1)
    }
    catch (rejected) {
        return response.status(429).send(JSON.stringify(['p', '<em>Too many requests, stop parsing.</em>']));
    }
    const words = request.body['words'];
    if (words)
        response.send(JSON.stringify({ result: yield (0, translate_1.translate)(words) }));
}));
exports.default = app;
