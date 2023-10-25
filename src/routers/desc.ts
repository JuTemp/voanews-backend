import express from 'express'
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { parsePs } from '../util/parsePs';
const app = express()
app.use(express.json())

const Limiter10per1d = new RateLimiterMemory({ duration: 24 * 60 * 60, points: 10 });
app.get('/api/desc', async (request, response) => {
    try {
        // await Limiter10per1d.consume(request.ip, 1)
    } catch (rejected) {
        return response.status(429).send(JSON.stringify(['p', '<em>Too many requests, stop parsing.</em>']))
    }
    const id = request.query['id']
    if (id && typeof id === 'string' && id.match(/\d+/)) response.send(JSON.stringify(await parsePs(id)))
    else response.send(JSON.stringify(['p', '<em>The query param "id" is wrong.</em>']))
}) /* desc页面的接口 */

export default app;
