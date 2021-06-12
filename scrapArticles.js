const got = require('got');
const cheerio = require('cheerio');

var urlToScrap = "https://2degrees-investing.org/resources"

async function scrapArticles() {
    return (new Promise(async (resolve, reject) => {
        try {
            const response = await got(urlToScrap);
            const $ = cheerio.load(response.body);
            var fullElem = []
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
                //console.log()
            });
            resolve(fullElem)
        } catch (e) {
            console.log('Error in function', arguments.callee.name, e)
            resolve('2')
        }
    }))
}

exports.scrapArticles = scrapArticles