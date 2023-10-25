import fetch from 'node-fetch'
import xml2js from 'xml2js';

export const getRss = () => {
    return new Promise(async (resolve, reject) => {
        xml2js.parseString(
            await (await fetch('https://www.voanews.com/api/zmjuqteb_kqo')).text(),
            (error, result) => {
                if (error === null) {
                    console.log(result)
                    resolve(result)
                } else reject(error)
            })
    })
}
