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
exports.transcribe = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs = __importStar(require("fs"));
const crypto = __importStar(require("crypto"));
const form_data_1 = __importDefault(require("form-data"));
const YoudaoApi_1 = require("../util/YoudaoApi");
const startServer_1 = require("../startServer");
const Wait = (delayMs) => {
    return new Promise(resolve => setTimeout(resolve, delayMs));
};
const prepare = ({ salt, curtime, id, secret, fileName, stats }) => __awaiter(void 0, void 0, void 0, function* () {
    const body = {
        salt,
        type: '1',
        appKey: id,
        sliceNum: String(Math.ceil(stats.size / 10485760)),
        name: fileName,
        fileSize: String(stats.size),
        curtime,
        langType: 'en',
        sign: crypto.createHash('sha256').update(id + salt + curtime + secret).digest('hex'),
        signType: 'v4',
        format: fileName.substring(fileName.lastIndexOf('.') + 1),
    };
    const formData = new form_data_1.default();
    Object.entries(body).map(([key, value]) => formData.append(key, value));
    const result = yield (yield (0, node_fetch_1.default)('http://openapi.youdao.com/api/audio/prepare', {
        method: 'POST',
        body: formData
    })).json();
    return result;
});
const upload = ({ taskid, salt, curtime, id, secret, filePath }) => __awaiter(void 0, void 0, void 0, function* () {
    const body = {
        q: taskid,
        appKey: id,
        salt,
        curtime,
        sign: crypto.createHash('sha256').update(id + salt + curtime + secret).digest('hex'),
        signType: 'v4',
        sliceId: '1',
    };
    const formData = new form_data_1.default();
    Object.entries(body).map(([key, value]) => formData.append(key, value));
    formData.append('file', fs.createReadStream(filePath));
    const result = yield (yield (0, node_fetch_1.default)('http://openapi.youdao.com/api/audio/upload', {
        method: 'POST',
        body: formData
    })).json();
    return result;
});
const merge = ({ taskid, salt, curtime, id, secret }) => __awaiter(void 0, void 0, void 0, function* () {
    const body = {
        q: taskid,
        appKey: id,
        salt,
        curtime,
        sign: crypto.createHash('sha256').update(id + salt + curtime + secret).digest('hex'),
        signType: 'v4',
    };
    const formData = new form_data_1.default();
    Object.entries(body).map(([key, value]) => formData.append(key, value));
    const result = yield (yield (0, node_fetch_1.default)('http://openapi.youdao.com/api/audio/merge', {
        method: 'POST',
        body: formData
    })).json();
    return result;
});
const getProgress = ({ taskid, salt, curtime, id, secret }) => __awaiter(void 0, void 0, void 0, function* () {
    const body = {
        q: taskid,
        appKey: id,
        salt,
        curtime,
        sign: crypto.createHash('sha256').update(id + salt + curtime + secret).digest('hex'),
        signType: 'v4',
    };
    const formData = new form_data_1.default();
    Object.entries(body).map(([key, value]) => formData.append(key, value));
    const result = yield (yield (0, node_fetch_1.default)('http://openapi.youdao.com/api/audio/get_progress', {
        method: 'POST',
        body: formData
    })).json();
    return result;
});
const getResult = ({ taskid, salt, curtime, id, secret }) => __awaiter(void 0, void 0, void 0, function* () {
    const body = {
        q: taskid,
        appKey: id,
        salt,
        curtime,
        sign: crypto.createHash('sha256').update(id + salt + curtime + secret).digest('hex'),
        signType: 'v4',
    };
    const formData = new form_data_1.default();
    Object.entries(body).map(([key, value]) => formData.append(key, value));
    const result = yield (yield (0, node_fetch_1.default)('http://openapi.youdao.com/api/audio/get_result', {
        method: 'POST',
        body: formData
    })).json();
    return result;
});
/**
 * Transcribe
 * @description Will auto save to disk
 * @param filePath Like `'${Root}/assets/newscasts/audios/${fileName}'`
 * @returns `string[]`
 */
const transcribe = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    if (YoudaoApi_1.DEBUG) {
        return [
            "This is Voa news. I'm Scott Walterman.",
            'The 1st Nobel Prize of the Year has been awarded.',
            "The Nobel Assembly at carolin's Institute, it has today decided to award the 2023 Nobel",
            'Prize in Physiology or Medicine, jointly to Cataline Caraco and Drew wise Man for their discoveries concerning nuclear side base modifications that enabled the development of effective MRNA vaccines against covit 19, the Nobel Prize for Medicine kicks off the years awards, with the remaining five to be unveiled in the coming days.',
            'Armenia urged the European Union on Monday a sanction Azerbaijan for its military operation in the Groom Corno Keribok Enclave, and warn the Paku could soon attack Armenia itself unless the West takes firm action.',
            "It's not only the opinion of the army and government, but also of many experts, also the some of the in member states, that the attack on Armenias proper is imminent.",
            'That is a Tegarian Belan, whose Armenias envoy to the EU listed possible measures such as a price cap on Azerbaijani oil and gas, and urged the West to deliver bold security assistance to Armenia.',
            'Former President of the United States, donald Trump goes on trial for fraud.',
            "Monday morning New York City. Here's AP correspondent Julie Walker.",
            "It's a rare voluntary appearance for the start of a civil trial in a lawsuit that has already resulted in a judge ruling Trump committed fraud in his business dealings.",
            'Trump could lose control of his New York properties and be banned from doing business in New York State as well.',
            "This is Voa news. It's been a year since FTX, the crypto currency exchange, collapsed and declared bankruptcy.",
            'On Tuesday. Sam Bankman Freed, the indicted founder of the company, also goes to trial.',
            'Reuters correspondent Luke Cohen says federal prosecutors have culted one of the biggest financial frauds in you have history.',
            'The 31 year old is accused of stealing billions of dollars in FTX customer funds.',
            'Federal prosecutors say he used the money to plug losses at Alometer Research, which was a crypto focused hedge fund that he also owned, and to buy luxury real estate and donate tens of millions of dollars to U-S political campaigns.',
            'Now, the former billionaire has pleaded not guilty.',
            'He has acknowledged risk management failures at his companies, but says he never intended to steal any funds.',
            "Reider's correspondent, luke Cohen, who says his lawyers are expected to argue a trial that bankman Freed thought FTX was allowed to make investments with customer funds, like banks used deposits to make loans.",
            'Indonesian President Joko Widodo as inaugurated South East Asia 1st high speed Railway, which begins its commercial operations on Monday.',
            "A key project under china's Belt and Road Infrastructure Initiative that will drastically cut the travel time between two key cities.",
            "Here's voa's Tommy mcneil. This 7.3 billion dollar project an extra carter with Bangdong, the heavily populated capital of West Java province.",
            'It will cut travel time between the cities from the current 3 h to about 40 min Its use of electrical energy is expected to reduce carbon emissions.',
            "Widodo and his opening remarks officially named indonesia's 1st high speed railway, the fastest in Southeast Asia, with speeds of up to 217 mi for hour, as wush an, acronym from the Indonesian word for time saving and reliability.",
            'Tommy mcneil Voa News Earlier this year, pope Francis agreed to let women and lay people vote alongside Bishops at the General Assembly synod in the future of the Church.',
            "Sheila Peres, secretary of the Commission for Information of the Senate of Bishops, says in an associated press interview that women's voices and votes will loom large at this important meeting.",
            'They want to be giving better positions of leadership.',
            'They want their voices to be heard, not just towards decision making, but also during decision making.',
            'Women want to be part of that.',
            'Supporters say The involvement of women, another lay people, is a watershed moment for the Catholic Church.',
            'Scott Walterman Voa News Washington.'
        ];
    }
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    if (fs.existsSync(`${startServer_1.Root}/assets/newscasts/transcriptions/${fileName}`)) {
        return JSON.parse(String(fs.readFileSync(`${startServer_1.Root}/assets/newscasts/transcriptions/${fileName}`)));
    }
    const { id, secret } = YoudaoApi_1.YoudaoApi;
    const stats = fs.statSync(filePath);
    let result = yield prepare({
        salt: crypto.randomUUID(), curtime: String(Math.round(new Date().getTime() / 1000)),
        id, secret, fileName, stats,
    });
    if (result.errorCode !== '0')
        throw new Error('Prepare error');
    const taskid = result.result;
    result = yield upload({
        salt: crypto.randomUUID(), curtime: String(Math.round(new Date().getTime() / 1000)),
        taskid, id, secret, filePath,
    });
    if (result.errorCode !== '0')
        throw new Error('Upload error');
    result = yield merge({
        salt: crypto.randomUUID(), curtime: String(Math.round(new Date().getTime() / 1000)),
        taskid, id, secret,
    });
    if (result.errorCode !== '0')
        throw new Error('Merge error');
    let count = 0;
    while (true) {
        result = yield getProgress({
            salt: crypto.randomUUID(), curtime: String(Math.round(new Date().getTime() / 1000)),
            taskid, id, secret,
        });
        if (result.errorCode !== '0')
            throw new Error('Get Progress error');
        if (result.result[0]['status'] === '9')
            break;
        yield Wait(2000);
        count += 1;
        if (count > 150) {
            return ['transcribe Failed. Please retry.'];
        }
    }
    result = yield getResult({
        salt: crypto.randomUUID(), curtime: String(Math.round(new Date().getTime() / 1000)),
        taskid, id, secret,
    });
    if (result.errorCode !== '0')
        throw new Error('Get Result error');
    const sentences = result.result.map((item, index) => item.sentence);
    fs.writeFileSync(`${startServer_1.Root}/assets/newscasts/transcriptions/${fileName}`, JSON.stringify(sentences));
    return sentences;
});
exports.transcribe = transcribe;
// transcribe('./files/20231002-140000-VEN119-program.mp3')
//     .then((res) => console.log(res))
