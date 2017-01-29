const path = require('path')
const childProcess = require('child_process')
const phantomjs = require('phantomjs-prebuilt')

module.exports = function (url, wait, cb) {
    if (!url) return cb(new Error('url is missing'));
    if (!wait) return cb(new Error('wait is missing'));

    childProcess.execFile(phantomjs.path, [
      path.join(__dirname, 'fetch.js'),
      url,
      wait
    ], function (err, stdout, stderr) {
        if (err) return cb(err);
        try {
            const result = JSON.parse(stdout);
            cb(null, result);
        } catch (err) {
            cb(new Error('phantom js output is not json conform'));
        }
    })
};
