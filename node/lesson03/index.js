var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var xlsx = require('node-xlsx');
var async = require('async');
var url = require('url');
var fs = require('fs');

var ep = new eventproxy();

var map_uid_url = "http://map.baidu.com/detail?qt=ninf&detail=scope&uid=";

var args = process.argv.splice(2);

var source_file_url = args[0] || 'source.xlsx';
	result_file_url = args[1] || 'result.xlsx';

var uid_list = xlsx.parse(source_file_url),
	uid_list = uid_list[0]['data'].slice(1).map(function (uid_pair) {
		return uid_pair[0];
	})

// test 测试代码,正常运行时需要注释
// uid_list = uid_list.slice(0, 10);

var xlsx_rs = [['uid', '景点名称']];

ep.after('poiContentReady', uid_list.length, function (contentList) {
	contentList = contentList.map(function (contentPair) {
		var $ = contentPair['$'];
		if ($) {
			xlsx_rs.push([contentPair['uid'], $('.basci_title h1').text()]);
		} else {
			xlsx_rs.push([contentPair['uid'], 'match failed']);
		}
	})
	var rs_buffer = xlsx.build([{name: 'sheet01', data: xlsx_rs}]);
	fs.writeFile(result_file_url, rs_buffer, function(err) {
		if (err) {
			throw err;
		}
		console.log('done');
	})
});

async.mapLimit(uid_list, 5, function (uid, callback) {
	var url = map_uid_url + uid;
	superagent.get(url)
		.end(function (err, res) {
			if (err) {
				return console.error(err);
			}
			if (res) {
				console.log('fetch ' + url + ' successful');
				ep.emit('poiContentReady', {'uid': uid, '$': cheerio.load(res.text)});
				callback(null, url + 'html content');
			} else {
				console.log('fetch ' + url + ' fail');
				ep.emit('poiContentReady', {'uid': uid, '$': ''});
			}
		});
});


