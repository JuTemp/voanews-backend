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
exports.Dir = exports.Root = void 0;
const express_1 = __importDefault(require("express"));
const main_1 = __importDefault(require("./routers/main"));
const desc_1 = __importDefault(require("./routers/desc"));
const trans_1 = __importDefault(require("./routers/trans"));
const transcribe_1 = __importDefault(require("./routers/transcribe"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
exports.Root = '/home/jtp/Documents/Langs/Express/voanews_backend';
exports.Dir = `${exports.Root}/src/staticHtml`;
/**
 * / -> /main
 */
app.get('/', (req, res) => {
    res.redirect('/main');
});
/**
 * /(\d+) -> /desc?id=(\d+)
 */
app.get(/^\/(\d+)$/, (req, res) => {
    res.redirect(`/desc?id=${req.params[0]}`);
});
/**
 * /main
 * /desc
 */
app.get(/^\/(main|desc)$/, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    response.sendFile(exports.Dir + '/index.html');
    /* const rss = await getRss()
    app.set('items', rss) */
})); /* 返回HTML的接口 */
app.use(express_1.default.static(exports.Dir)); /* 一些HTML需要的文件 */
app.get(/^\/static\/media\/Ubuntu-Regular\..*?\.ttf$/, (request, response) => {
    response.set('Cache-Control', 'max-age=31536000');
    response.sendFile(exports.Dir + request.path);
}); /* 一些HTML需要的文件 */
app.use('/', main_1.default);
app.use('/', desc_1.default);
app.use('/', trans_1.default);
app.use('/', transcribe_1.default);
app.listen(26890, () => console.log('listening on localhost:26890'));
