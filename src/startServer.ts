import express from 'express'
import MainApp from './routers/main'
import DescApp from './routers/desc'
import TransApp from './routers/trans'
import TranscribeApp from './routers/transcribe'
const app = express()
app.use(express.json())

export const Root = '/home/jtp/Documents/Langs/Express/voanews_backend'
export const Dir = `${Root}/src/staticHtml`
/**
 * / -> /main
 */
app.get('/', (req, res) => {
    res.redirect('/main')
})

/**
 * /(\d+) -> /desc?id=(\d+)
 */
app.get(/^\/(\d+)$/, (req, res) => {
    res.redirect(`/desc?id=${req.params[0]}`)
})

/**
 * /main
 * /desc
 */
app.get(/^\/(main|desc)$/, async (request, response) => {
    response.sendFile(Dir + '/index.html')
    /* const rss = await getRss()
    app.set('items', rss) */
}) /* 返回HTML的接口 */


app.use(express.static(Dir)) /* 一些HTML需要的文件 */
app.get(/^\/static\/media\/Ubuntu-Regular\..*?\.ttf$/, (request, response) => {
    response.set('Cache-Control', 'max-age=31536000')
    response.sendFile(Dir + request.path)
}) /* 一些HTML需要的文件 */

app.use('/', MainApp)
app.use('/', DescApp)
app.use('/', TransApp)
app.use('/', TranscribeApp)

app.listen(26890, () => console.log('listening on localhost:26890'))
