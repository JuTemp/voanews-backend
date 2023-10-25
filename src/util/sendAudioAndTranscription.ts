import * as fs from 'fs'
import fetch from 'node-fetch'
import { Root } from '../startServer'
import { transcribe } from './transcribe'

let isDownloading: boolean = false;
/**
 * Download
 * @description Will auto save to disk
 * @param url Like `'https://av.voanews.com/clips/VEN/2023/10/03/20231003-010000-VEN119-program.mp3'`
 * @returns FilePath Like `'${Root}/assets/newscasts/audios/${fileName}'`
 */
const download = async (url: string): Promise<string> => {

    if (isDownloading) {
        await new Promise(r => setTimeout(r, 100))
        return download(url)
    }

    const fileName = url.substring(url.lastIndexOf('/') + 1)
    const filePath = `${Root}/assets/newscasts/audios/${fileName}`
    if (fs.existsSync(filePath)) {
        return filePath
    } else {
        isDownloading = true
        const fileBuffer = await (await fetch(url)).buffer()
        fs.writeFileSync(filePath, fileBuffer, { encoding: 'binary' })
        isDownloading = false
        return filePath
    }

}

export const getAudioFilePath = async (url: string): Promise<string | null> => {

    if (!url.match(/^https:\/\/av\.voanews\.com\/clips\/VEN\/\d{4}\/\d{2}\/\d{2}\/\d{8}-\d{6}-VEN119-program\.mp3$/))
        return null

    return await download(url)

}

export const getTranscriptionStringArray = async (url: string): Promise<string[]> => {

    if (!url.match(/^https:\/\/av\.voanews\.com\/clips\/VEN\/\d{4}\/\d{2}\/\d{2}\/\d{8}-\d{6}-VEN119-program\.mp3$/))
        return ['<em>Found "Cross Site Scripting (XSS)", stop parsing.</em>']

    return await transcribe(await download(url))
}
