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
exports.getTranscriptionStringArray = exports.getAudioFilePath = void 0;
const fs = __importStar(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const startServer_1 = require("../startServer");
const transcribe_1 = require("./transcribe");
let isDownloading = false;
/**
 * Download
 * @description Will auto save to disk
 * @param url Like `'https://av.voanews.com/clips/VEN/2023/10/03/20231003-010000-VEN119-program.mp3'`
 * @returns FilePath Like `'${Root}/assets/newscasts/audios/${fileName}'`
 */
const download = (url) => __awaiter(void 0, void 0, void 0, function* () {
    if (isDownloading) {
        yield new Promise(r => setTimeout(r, 100));
        return download(url);
    }
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    const filePath = `${startServer_1.Root}/assets/newscasts/audios/${fileName}`;
    if (fs.existsSync(filePath)) {
        console.log('return filePath');
        return filePath;
    }
    else {
        console.log('fetch');
        isDownloading = true;
        const fileBuffer = yield (yield (0, node_fetch_1.default)(url)).buffer();
        fs.writeFileSync(filePath, fileBuffer, { encoding: 'binary' });
        isDownloading = false;
        return filePath;
    }
});
const getAudioFilePath = (url) => __awaiter(void 0, void 0, void 0, function* () {
    if (!url.match(/^https:\/\/av\.voanews\.com\/clips\/VEN\/\d{4}\/\d{2}\/\d{2}\/\d{8}-\d{6}-VEN119-program\.mp3$/))
        return null;
    return yield download(url);
});
exports.getAudioFilePath = getAudioFilePath;
const getTranscriptionStringArray = (url) => __awaiter(void 0, void 0, void 0, function* () {
    if (!url.match(/^https:\/\/av\.voanews\.com\/clips\/VEN\/\d{4}\/\d{2}\/\d{2}\/\d{8}-\d{6}-VEN119-program\.mp3$/))
        return ['<em>Found "Cross Site Scripting (XSS)", stop parsing.</em>'];
    return yield (0, transcribe_1.transcribe)(yield download(url));
});
exports.getTranscriptionStringArray = getTranscriptionStringArray;
