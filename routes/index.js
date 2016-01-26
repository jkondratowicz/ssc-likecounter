var express = require('express');
var router = express.Router();
var config = require('../config/config');
var request = require('request');
var cheerio = require('cheerio');

router.get('/likes.json', function(req, res, next) {
	var url = 'http://www.skyscrapercity.com/showthread.php?t={{TOPIC}}&page={{PAGE}}';

	var page = req.query.page || 1;
	var topic = req.query.topic || 1660101;

	var result = [];

	request(url.replace('{{TOPIC}}', topic).replace('{{PAGE}}', page), function(err, response, html){
		if(err) {
			return next(err);
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
						//console.log(post.id, numlikes[1] + ' others');
						post.likes += parseInt(numlikes[1], 10);
					}
				}
			});

			result.push(post);
		});

		res.json(result);
	});
});

module.exports = router;