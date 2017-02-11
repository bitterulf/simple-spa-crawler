const system = require('system');
const args = system.args;
const page = require('webpage').create();
const HTML = require('html');
const _ = require('lodash');

const url = args[1];
const wait = args[2];

page.open(url, function (status) {
    setTimeout(function () {
        const html = HTML.prettyPrint(page.evaluate(function () {
            return document.getElementsByTagName('html')[0].innerHTML;
        }));

        const links = page.evaluate(function () {
            return [].map.call(document.querySelectorAll('a'), function (link) {
                return link.getAttribute('href');
            });
        });
        console.log(JSON.stringify({
            html: html,
            links: links
        }));
        phantom.exit();
    }, wait);
});
