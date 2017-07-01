var express = require('express');
var router = express.Router();

var exec = require('child_process').exec;

//var mongo = require('mongoskin');
/*
 * POST to levels.
 */
router.get('/list', function(req, res) {

      var cmd = '';

	exec(cmd, function(error, stdout, stderr) {
  	// command output is in stdout
	res.send('mm'+stdout+error);
	});

});

module.exports = router;

