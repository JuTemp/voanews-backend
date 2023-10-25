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
const ws_1 = require("ws");
const sendAudioAndTranscription_1 = require("../util/sendAudioAndTranscription");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const wss = new ws_1.Server({ noServer: true });
const Limiter10per1hr = new rate_limiter_flexible_1.RateLimiterMemory({ duration: 60 * 60, points: 10 });
const Limiter20per1d = new rate_limiter_flexible_1.RateLimiterMemory({ duration: 24 * 60 * 60, points: 20 });
app.get('/api/transcribe/audio', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await Limiter10per1hr.consume(request.ip, 1)
        // await Limiter20per1d.consume(request.ip, 1)
    }
    catch (rejected) {
        return response.status(429).end();
    }
    const url = atob(String(request.query.url));
    const audioFilePath = yield (0, sendAudioAndTranscription_1.getAudioFilePath)(url);
    if (audioFilePath)
        response.sendFile(audioFilePath);
    else
        response.end();
}));
app.get('/api/transcribe/transcription', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // await Limiter10per1hr.consume(request.ip, 1)
        // await Limiter20per1d.consume(request.ip, 1)
    }
    catch (rejected) {
        return response.status(429).send(JSON.stringify(['p', '<em>Too many requests, stop parsing.</em>']));
    }
    const url = atob(String(request.query.url));
    const transcriptionStringArray = yield (0, sendAudioAndTranscription_1.getTranscriptionStringArray)(url);
    response.send(JSON.stringify(transcriptionStringArray));
}));
exports.default = app;
