import express from 'express'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { parseTitles } from '../util/parseTitles';
const app = express()
app.use(express.json())

const Limiter25per1d = new RateLimiterMemory({ duration: 24 * 60 * 60, points: 25 });
app.post('/api/today',
    async (request, response) => {
        try {
            // await Limiter25per1d.consume(request.ip, 1)
        } catch (rejected) {
            return response.status(429).send(JSON.stringify(['p', '<em>Too many requests, stop parsing.</em>']))
        }
        // https://www.voanews.com/api/zmjuqteb_kqo
        const url = request.body['url']
        if (url) response.send(JSON.stringify(await parseTitles(request.body['url'])))
    }) /* main页面的接口 */

export default app;
