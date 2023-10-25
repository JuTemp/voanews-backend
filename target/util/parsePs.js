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
exports.parsePs = void 0;
const jsdom_1 = require("jsdom");
const node_fetch_1 = __importDefault(require("node-fetch"));
const YoudaoApi_1 = require("./YoudaoApi");
/**
 * @returns `[tagName, innerHTML][]`
 * @description return such as `[['p', 'content'], ['p', '<strong>strong</strong>']]`
 */
const parsePs = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!id.match(/^\d+$/))
        return [['p', '<em>Found "Cross Site Scripting (XSS)", stop parsing.</em>']];
    if (YoudaoApi_1.DEBUG)
        return [['h1', 'title'], ['div', 'time'],
            ['video', '<source src="http://localhost:4000/api/transcribe/audio?url=aHR0cHM6Ly9hdi52b2FuZXdzLmNvbS9jbGlwcy9WRU4vMjAyMy8xMC8wNC8yMDIzMTAwMi0xNDAwMDAtVkVOMTE5LXByb2dyYW0ubXAz" type="audio/mpeg">'],
            // ['p', '<strong>strong</strong>'],
            // ['p', 'In a development Thursday that few predicted just two days ago, the central bank kept its main interest rate unchanged at a 15-year high of 5.25%. It comes to the relief of millions of homeowners who are facing higher mortgage rates.'],
            // ['p', 'In a development Thursday that few predicted just two days ago, the central bank kept its main interest rate unchanged at a 15-year high of 5.25%. It comes to the relief of millions of homeowners who are facing higher mortgage rates.'],
            // ['p', 'In a development Thursday that few predicted just two days ago, the central bank kept its main interest rate unchanged at a 15-year high of 5.25%. It comes to the relief of millions of homeowners who are facing higher mortgage rates.'],
            // ['p', 'In a development Thursday that few predicted just two days ago, the central bank kept its main interest rate unchanged at a 15-year high of 5.25%. It comes to the relief of millions of homeowners who are facing higher mortgage rates.'],
            // ['p', 'In a development Thursday that few predicted just two days ago, the central bank kept its main interest rate unchanged at a 15-year high of 5.25%. It comes to the relief of millions of homeowners who are facing higher mortgage rates.'],
            // ['p', 'In a development Thursday that few predicted just two days ago, the central bank kept its main interest rate unchanged at a 15-year high of 5.25%. It comes to the relief of millions of homeowners who are facing higher mortgage rates.'],
        ];
    const htmlGet = yield (yield (0, node_fetch_1.default)(`https://www.voanews.com/a/${id}.html`)).text();
    const dom = new jsdom_1.JSDOM(htmlGet);
    try {
        const title = (_a = dom.window.document.querySelector('h1')) === null || _a === void 0 ? void 0 : _a.innerHTML.trim();
        if (title === 'VOA Newscasts') {
            return [
                ['h1', title],
                ['div', (_b = dom.window.document.querySelector('time')) === null || _b === void 0 ? void 0 : _b.innerHTML.trim()]
            ].concat([['video', `<source src="https://voanews.jtp0415.top/api/transcribe/audio?url=${btoa(dom.window.document.querySelector('.c-mmp').querySelector('a').href)}" type="audio/mpeg">`]]);
        }
        else
            return [
                ['h1', title],
                ['div', (_c = dom.window.document.querySelector('time')) === null || _c === void 0 ? void 0 : _c.innerHTML.trim()]
            ].concat([...dom.window.document.querySelector('#article-content').querySelectorAll('p')]
                .map((item) => [item.tagName, item.innerHTML]));
    }
    catch (error) {
        return [['h1', 'Error Content.']];
    }
});
exports.parsePs = parsePs;
