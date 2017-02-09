const system = require('system');
const args = system.args;
const page = require('webpage').create();
const HTML = require('html');
const _ = require('lodash');

const url = args[1];
const wait = args[2];

const fetchPage = function (base, path, visited, unvisited, cb) {
    page.open(base + path, function (status) {
        setTimeout(function () {
            const html = HTML.prettyPrint(page.evaluate(function () {
                return document.getElementsByTagName('html')[0].innerHTML;
            }));

            visited[path] = html;

            const links = page.evaluate(function () {
                return [].map.call(document.querySelectorAll('a'), function (link) {
                    return link.getAttribute('href');
                });
            });

            cb(null, {
                base: base,
                path: path,
                visited: visited,
                unvisited: _.difference(_.uniq(unvisited.concat(links)), _.keys(visited))
            });
        }, wait);
    });
};

const doFetch = function (base, path, visited, unvisited, cb) {
    fetchPage(base, path, visited, unvisited, function (err, result) {
        if (result.unvisited.length) {
            const path = result.unvisited.pop();
            doFetch(result.base, path, result.visited, result.unvisited, cb);
        } else {
            cb(visited);
        }
    });
}

doFetch(url, '/?/', {}, [], function (visited) {
    console.log(JSON.stringify(visited));
    phantom.exit();
});
