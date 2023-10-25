import express from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible'
import WebSocket, { Server } from 'ws';
import * as fs from 'fs'
import { transcribe } from '../util/transcribe';
import { Dir, Root } from '../startServer';
import { getAudioFilePath, getTranscriptionStringArray } from '../util/sendAudioAndTranscription';
const app = express()
app.use(express.json())
const wss = new Server({ noServer: true });

const Limiter10per1hr = new RateLimiterMemory({ duration: 60 * 60, points: 10 });
const Limiter20per1d = new RateLimiterMemory({ duration: 24 * 60 * 60, points: 20 });

app.get('/api/transcribe/audio', async (request, response) => {

    try {
        // await Limiter10per1hr.consume(request.ip, 1)
        // await Limiter20per1d.consume(request.ip, 1)
    } catch (rejected) {
        return response.status(429).end()
    }

    const url = atob(String(request.query.url))
    const audioFilePath = await getAudioFilePath(url)
    if (audioFilePath) response.sendFile(audioFilePath)
    else response.end()

})

app.get('/api/transcribe/transcription', async (request, response) => {
    try {
        // await Limiter10per1hr.consume(request.ip, 1)
        // await Limiter20per1d.consume(request.ip, 1)
    } catch (rejected) {
        return response.status(429).send(JSON.stringify(['p', '<em>Too many requests, stop parsing.</em>']))
    }

    const url = atob(String(request.query.url))
    const transcriptionStringArray = await getTranscriptionStringArray(url)
    response.send(JSON.stringify(transcriptionStringArray))
})

export default app;
