import fetch from 'node-fetch'
import * as crypto from 'crypto'
import { YoudaoApi } from './YoudaoApi'

/**
 * Translate
 * @param q word(s) to translate
 * @returns `[string, string, string?]`
 */
export const translate = async (q: string) => {

    const { id, secret } = YoudaoApi
    const salt = crypto.randomUUID()
    const curtime = String(Math.round(new Date().getTime() / 1000))

    const result = await (await fetch('https://openapi.youdao.com/api',
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: Object.entries({
                q,
                from: 'en',
                to: 'zh-CHS',
                appKey: id,
                salt,
                sign: crypto.createHash('sha256').update(id +
                    (q.length <= 20 ? q : q.substring(0, 10) + q.length + q.substring(q.length - 10, q.length)) +
                    salt + curtime + secret).digest('hex'),
                signType: 'v3',
                curtime,
            }).map(([key, value]) => `${key}=${value}`).join('&'),
        })).json()

    if (result.isWord)
        return [result.returnPhrase.join(' / '), result.translation.join(' / '), result.basic.explains.join('\n')]
    else
        return [result.query, result.translation.join(' / ')]
}

// console.log(await translate('hello'))
