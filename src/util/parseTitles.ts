import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import { DEBUG } from './YoudaoApi'

/**
 * @returns `[{title: string, id: string}]`
 * @description `title` The article title
 * @description `id` The article id, matching `/^\d+$/`
 */
export const parseTitles = async (url: string): Promise<[...{ title: string | undefined, id: string | undefined }[]]> => {

    if (!url.match(/^https:\/\/www\.voanews\.com\/(?:[a-z-]+|p\/\d+\.html|z\/\d+)$/)) return [{
        title: 'Found "Cross Site Scripting (XSS)", stop parsing.',
        id: undefined
    }]

    if (DEBUG) return [{ title: 'Title', id: '456' }, { title: url, id: '578' }]

    const htmlGet = await (await fetch(url)).text()
    const dom = new JSDOM(htmlGet)

    if (url.startsWith('https://www.voanews.com/z/') || url === 'https://www.voanews.com/voa1-the-hits')
        return [...dom.window.document.querySelector('.media-block-wrap')!!.querySelectorAll('.media-block')]
            .filter((item) => !item.querySelector('.ico-video'))
            .map((item) => {
                let a = item.querySelector('a')
                return {
                    title: a?.getAttribute('title')?.trim(),
                    id: a?.getAttribute('href')?.replace(/^.*?\/(\d+)\.html$/, '$1')
                }
            })
    else
        return [...dom.window.document.querySelectorAll('.media-block')]
            .filter((item) => !item.querySelector('.ico-video'))
            .map((item) => {
                let a = item.querySelector('a')
                return {
                    title: a?.getAttribute('title')?.trim(),
                    id: a?.getAttribute('href')?.replace(/^.*?\/(\d+)\.html$/, '$1')
                }
            })
}