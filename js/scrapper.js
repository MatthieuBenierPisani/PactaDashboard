const puppeteer = require('puppeteer');

console.log('coucou');

async function scrapeProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [el] = await page.$x('/html/body/div[6]/div[3]/div/div[1]/div[1]/div/div/div[1]/a/img');
    const src = await el.getProperty('src');
    const srcTxt = await src.jsonValue();

    const [el2] = await page.$x('/html/body/div[6]/div[3]/div/div[1]/div[1]/div/div/div[2]/div/a/h3');
    const txt = await el2.getProperty('textContent');
    const rawTxt = await txt.jsonValue();

    const [el3] = await page.$x('/html/body/div[6]/div[3]/div/div[1]/div[1]/div/div/div[2]/div/div');
    const txt2 = await el3.getProperty('textContent');
    const tags = await txt2.jsonValue();

    console.log({srcTxt, rawTxt, tags});
    browser.close();
}