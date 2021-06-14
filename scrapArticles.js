const got = require('got');
const cheerio = require('cheerio');
let Parser = require('rss-parser');
let parser = new Parser();

var fullElem = []

async function degrees() {
    return (new Promise(async (resolve, reject) => {
        try {
            const response = await got("https://2degrees-investing.org/resources");
            const $ = cheerio.load(response.body);
            $('div[class="work-item"]').find('div').each(function (index, element) {
                var elem = {}
                if (element.children[0].children && element.children[0].children[1]) {
                    //console.log(element.children[0].children[1].children[0].data) // title
                    //console.log(element.children[0].children[3].children[0].data) // description
                    if (element.children[0].children[1].children[0].data.indexOf('screen and') === -1) {
                        elem.title = element.children[0].children[1].children[0].data
                        elem.description = element.children[0].children[3].children[0].data
                    }
                }
                if (element.children[1]) {
                    for (var i of element.children[1].children) {
                        var tag = $(i).text().replace(/\n/g, "").replace(/       /g, "")
                        if (tag.length > 5 && tag.indexOf('\t') === -1) {
                            if (!elem.tags)
                                elem.tags = []
                            elem.tags.push(tag.replace('   ', ''))
                        }
                    }
                }
                if (elem.title)
                    fullElem.push(elem)
            });
            resolve()
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
            resolve('2')
        }
    }))
}

async function bpce() {
    return (new Promise(async (resolve, reject) => {
        try {
            const response = await got("https://groupebpce.com/toute-l-actualite");
            const $ = cheerio.load(response.body);

            $('.News-link').each(function (index, element) {
                if (element.children[0]) {
                    var elem = {}
                    var link = element.attribs.href
                    if (element.attribs.title) {
                        elem.description = element.attribs.title
                    } else {
                        elem.description = element.attribs["data-tracking-click-libelle"]
                    }
                    if (link.indexOf('\/\/') !== -1) {
                        elem.url = "https:" + element.attribs.href
                    } else {
                        elem.url = "https://groupebpce.com" + element.attribs.href
                    }
                    elem.title = $(element.children[3].children[1]).text().trim().replace(/\t/g, " ").replace(/  /g, " ").replace(/  /g, " ").replace(/  /g, " ").replace(/  /g, " ").replace(/\n/g, " ")
                    fullElem.push(elem)
                }
            })
            resolve()
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}

async function bnp() {
    return (new Promise(async (resolve, reject) => {
        try {

            let feed = await parser.parseURL('https://group.bnpparibas/rss/news/economie');
            console.log(feed.title);

            feed.items.forEach(item => {
                var elem = {}
                if (item.link) {
                    elem.title = "BNP PARIBAS"
                    elem.description = item.title
                    elem.url = item.link
                    fullElem.push(elem)
                }
            });
            resolve()
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}


async function scrapArticles(e) {
    return (new Promise(async (resolve, reject) => {
        try {
            //await degrees()
            await bnp()
            await bpce()
            console.log(fullElem.length)
            resolve(fullElem)
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
        }
    }))
}

exports.scrapArticles = scrapArticles