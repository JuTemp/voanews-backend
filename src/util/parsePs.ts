import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import { DEBUG } from './YoudaoApi'

/**
 * @returns `[tagName, innerHTML][]`
 * @description return such as `[['p', 'content'], ['p', '<strong>strong</strong>']]`
 */
export const parsePs = async (id: string) => {

    if (!id.match(/^\d+$/)) return [['p', '<em>Found "Cross Site Scripting (XSS)", stop parsing.</em>']]

    if (DEBUG) return [['h1', 'title'], ['div', 'time'],
    ['video', '<source src="http://localhost:4000/api/transcribe/audio?url=aHR0cHM6Ly9hdi52b2FuZXdzLmNvbS9jbGlwcy9WRU4vMjAyMy8xMC8wNC8yMDIzMTAwMi0xNDAwMDAtVkVOMTE5LXByb2dyYW0ubXAz" type="audio/mpeg">'],
        // ['p', '<strong>strong</strong>'],
        // ['p', 'In a development Thursday that few predicted just two days ago, the central bank kept its main interest rate unchanged at a 15-year high of 5.25%. It comes to the relief of millions of homeowners who are facing higher mortgage rates.'],
        // ['p', 'In a development Thursday that few predicted just two days ago, the central bank kept its main interest rate unchanged at a 15-year high of 5.25%. It comes to the relief of millions of homeowners who are facing higher mortgage rates.'],
        // ['p', 'In a development Thursday that few predicted just two days ago, the central bank kept its main interest rate unchanged at a 15-year high of 5.25%. It comes to the relief of millions of homeowners who are facing higher mortgage rates.'],
        // ['p', 'In a development Thursday that few predicted just two days ago, the central bank kept its main interest rate unchanged at a 15-year high of 5.25%. It comes to the relief of millions of homeowners who are facing higher mortgage rates.'],
        // ['p', 'In a development Thursday that few predicted just two days ago, the central bank kept its main interest rate unchanged at a 15-year high of 5.25%. It comes to the relief of millions of homeowners who are facing higher mortgage rates.'],
        // ['p', 'In a development Thursday that few predicted just two days ago, the central bank kept its main interest rate unchanged at a 15-year high of 5.25%. It comes to the relief of millions of homeowners who are facing higher mortgage rates.'],
    ]

    const htmlGet = await (await fetch(`https://www.voanews.com/a/${id}.html`)).text()
    const dom = new JSDOM(htmlGet)

    try {
        const title = dom.window.document.querySelector('h1')?.innerHTML!!.trim()!!
        if (title === 'VOA Newscasts') {
            return [
                ['h1', title],
                ['div', dom.window.document.querySelector('time')?.innerHTML!!.trim()!!]
            ].concat([['video', `<source src="https://voanews.jtp0415.top/api/transcribe/audio?url=${btoa(dom.window.document.querySelector('.c-mmp')!!.querySelector('a')!!.href)}" type="audio/mpeg">`]])
        }
        else
            return [
                ['h1', title],
                ['div', dom.window.document.querySelector('time')?.innerHTML!!.trim()!!]
            ].concat([...dom.window.document.querySelector('#article-content')!!.querySelectorAll('p')]
                .map((item) => [item.tagName, item.innerHTML]))
    } catch (error) {
        return [['h1', 'Error Content.']]
    }
}