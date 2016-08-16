var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var xlsx = require('node-xlsx');
var url = require('url');

var ep = new eventproxy();

var map_uid_url = "http://map.baidu.com/detail?qt=ninf&detail=scope&uid=";

// var uid_list = [
// 	"b7021bf8f67e3cfaf4e73b45",
// 	"a4218287631046e192114c40"
// ];

var uid_list = xlsx.parse('./sku_list.xlsx'),
	uid_list = uid_list[0]['data'].slice(1).map(function (uid_pair) {
		return uid_pair[0];
	})

uid_list = uid_list.slice(0, 10);

ep.after('poiContentReady', uid_list.length, function (contentList) {
	contentList = contentList.map(function (contentPair) {
		console.log(contentPair['uid']);
		var $ = contentPair['$'];
		console.log($('.basci_title h1').text());
	})
})

uid_list.forEach(function (uid) {
	var url = map_uid_url + uid;
	superagent.get(url)
		.end(function (err, res) {
			if (err) {
				return console.error(err);
			}
			if (res) {
				console.log('fetch ' + url + ' successful');
				ep.emit('poiContentReady', {'uid': uid, '$': cheerio.load(res.text)});
			} else {
				console.log('fetch ' + url + ' fail');
			}
		})
});