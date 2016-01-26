var express = require('express');
var router = express.Router();
var config = require('../config/config');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

router.get('/', function(req, res, next) {
	var url = 'http://www.skyscrapercity.com/showthread.php?t=1660101&page=';

	var page = 665;

	var result = [];

	async.until(function() {
		return page < 1;
	}, function(callback) {
		console.log("Page", page);
		request(url + page, function(err, response, html){
			if(err) {
				return callback(err);
			}

			var $ = cheerio.load(html);

			$('td.alt1[id]').each(function() {
				var match = $(this).attr('id').match(/^dbtech_thanks_entries_([0-9]+)$/);
				if(!match) {
					return;
				}

				var post = {id: match[1]};

				post.likes = 0;

				$(this).find('a').each(function() {
					if($(this).attr('href').match(/^member/)) {
						//console.log(post.id, $(this).text());
						post.likes++;
					} else {
						var numlikes = $(this).text().match(/^([0-9]+) other/);
						if(Array.isArray(numlikes)) {
							//console.log(post.id, numlikes[1] + " others");
							post.likes += parseInt(numlikes[1], 10);
						}
					}
				});

				result.push(post);
			});

			page--;
			callback();
		});
	}, function(err) {
		if(err) {
			return next(err);
		}

		result.sort(function(a, b) {
			return b.likes - a.likes;
		});

		res.render('index', {result: result.slice(0,100)});
	});
});



module.exports = router;