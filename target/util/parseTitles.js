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
exports.parseTitles = void 0;
const jsdom_1 = require("jsdom");
const node_fetch_1 = __importDefault(require("node-fetch"));
const YoudaoApi_1 = require("./YoudaoApi");
/**
 * @returns `[{title: string, id: string}]`
 * @description `title` The article title
 * @description `id` The article id, matching `/^\d+$/`
 */
const parseTitles = (url) => __awaiter(void 0, void 0, void 0, function* () {
    if (!url.match(/^https:\/\/www\.voanews\.com\/(?:[a-z-]+|p\/\d+\.html|z\/\d+)$/))
        return [{
                title: 'Found "Cross Site Scripting (XSS)", stop parsing.',
                id: undefined
            }];
    if (YoudaoApi_1.DEBUG)
        return [{ title: 'Title', id: '456' }, { title: url, id: '578' }];
    const htmlGet = yield (yield (0, node_fetch_1.default)(url)).text();
    const dom = new jsdom_1.JSDOM(htmlGet);
    if (url.startsWith('https://www.voanews.com/z/') || url === 'https://www.voanews.com/voa1-the-hits')
        return [...dom.window.document.querySelector('.media-block-wrap').querySelectorAll('.media-block')]
            .filter((item) => !item.querySelector('.ico-video'))
            .map((item) => {
            var _a, _b;
            let a = item.querySelector('a');
            return {
                title: (_a = a === null || a === void 0 ? void 0 : a.getAttribute('title')) === null || _a === void 0 ? void 0 : _a.trim(),
                id: (_b = a === null || a === void 0 ? void 0 : a.getAttribute('href')) === null || _b === void 0 ? void 0 : _b.replace(/^.*?\/(\d+)\.html$/, '$1')
            };
        });
    else
        return [...dom.window.document.querySelectorAll('.media-block')]
            .filter((item) => !item.querySelector('.ico-video'))
            .map((item) => {
            var _a, _b;
            let a = item.querySelector('a');
            return {
                title: (_a = a === null || a === void 0 ? void 0 : a.getAttribute('title')) === null || _a === void 0 ? void 0 : _a.trim(),
                id: (_b = a === null || a === void 0 ? void 0 : a.getAttribute('href')) === null || _b === void 0 ? void 0 : _b.replace(/^.*?\/(\d+)\.html$/, '$1')
            };
        });
});
exports.parseTitles = parseTitles;
