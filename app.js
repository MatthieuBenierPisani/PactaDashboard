var express = require('express')
var app = express()
var scrapArticles = require('./scrapArticles.js').scrapArticles


app.use(express.static('www'));

var server = app.listen(8000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Express app listening at http://%s:%s', host, port)

})
scrapArticles()
app.get('/askArticles', async function (req, res) {
    var articles = await scrapArticles()
    console.log(articles)
    res.send(articles)
})
