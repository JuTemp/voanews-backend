"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.translate = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const crypto = __importStar(require("crypto"));
const translate = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const id = '11b812e487c780bb';
    const secret = 'e6VCDie7E0bBmoPm7yyhGVrXu8YaQB5Q';
    const salt = crypto.randomUUID();
    const q = 'hello';
    const curtime = String(Math.round(new Date().getTime() / 1000));
    const result = yield (yield (0, node_fetch_1.default)('https://openapi.youdao.com/api', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: Object.entries({
            q,
            from: 'en',
            to: 'zh-CHS',
            appKey: id,
            salt,
            sign: crypto.createHash('sha256').update(id +
                (q.length <= 20 ? q : q.substring(0, 10) + q.length + q.substring(q.length - 10, q.length)) +
                salt + curtime + secret).digest('hex'),
            signType: 'v3',
            curtime,
        }).map(([key, value]) => `${key}=${value}`).join('&'),
    })).json();
    return [result.returnPhrase.join(' / '), result.translation.join(' / '), result.basic.explains.join('\n')];
});
exports.translate = translate;
// console.log(await translate('hello'))
