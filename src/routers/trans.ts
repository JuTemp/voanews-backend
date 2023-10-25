import express from 'express'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { translate } from '../util/translate';
const app = express()
app.use(express.json())

const Limiter20per1min = new RateLimiterMemory({ duration: 60, points: 20 });
const Limiter100per1hr = new RateLimiterMemory({ duration: 60 * 60, points: 100 });
const Limiter200per1d = new RateLimiterMemory({ duration: 24 * 60 * 60, points: 200 });
app.post('/api/trans',
    async (request, response) => {
        try {
            // await Limiter20per1min.consume(request.ip, 1)
            // await Limiter100per1hr.consume(request.ip, 1)
            // await Limiter200per1d.consume(request.ip, 1)
        } catch (rejected) {
            return response.status(429).send(JSON.stringify(['p', '<em>Too many requests, stop parsing.</em>']))
        }
        const words = request.body['words']
        if (words) response.send(JSON.stringify({ result: await translate(words) }))
    })

export default app;
