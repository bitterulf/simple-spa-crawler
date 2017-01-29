const path = require('path')
const childProcess = require('child_process')
const phantomjs = require('phantomjs-prebuilt')
const CronJob = require('cron').CronJob;

const crawl = function (url, wait, cb) {
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

module.exports = {
    crawl: crawl,
    crawlJob: function (url, cronTime, wait, cb) {
        var isCrawling = false;

        var job = new CronJob({
            cronTime: cronTime,
            onTick: function (done) {
                if (!isCrawling) {
                    isCrawling = true;
                    crawl(url, wait, function (err, result) {
                        isCrawling = false;
                        done(err, result);
                    });
                } else {
                    done();
                }
            },
            runOnInit: true,
            onComplete: cb
        });

        job.start();
    }
};
