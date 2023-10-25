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
const parsePs_1 = require("../util/parsePs");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const Limiter10per1d = new rate_limiter_flexible_1.RateLimiterMemory({ duration: 24 * 60 * 60, points: 10 });
app.get('/api/desc', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await Limiter10per1d.consume(request.ip, 1)
    }
    catch (rejected) {
        return response.status(429).send(JSON.stringify(['p', '<em>Too many requests, stop parsing.</em>']));
    }
    const id = request.query['id'];
    if (id && typeof id === 'string' && id.match(/\d+/))
        response.send(JSON.stringify(yield (0, parsePs_1.parsePs)(id)));
    else
        response.send(JSON.stringify(['p', '<em>The query param "id" is wrong.</em>']));
})); /* desc页面的接口 */
exports.default = app;
