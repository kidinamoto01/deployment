var express = require('express');
var router = express.Router();

var exec = require('child_process').exec;
var fs = require('fs');

//var mongo = require('mongoskin');
/*
 * POST to levels.
 */
router.get('/list', function(req, res) {

    var cmd = '';


    res.send("mm"+req.get("param"));

    /*
	cmd = "terraform apply -var 'key_name=terraform' -var 'public_key_path=/Users/jsmith/.ssh/terraform.pub'";
	exec(cmd, function(error, stdout, stderr) {
  	// command output is in stdout
	res.send('mm'+stdout+error);
	});
	*/
});

router.get('/create', function(req, res) {

    var cmd = '';

	var nodes = JSON.parse(req.param('nodes')),
		project = req.param('project'),
		git = req.param('git'),
		app = req.param('app')

	var r = "";

	for (var i = 0; i < nodes.length; i++) {
		var nodeName = 'node' + nodes[i];
		var cfg = 'resource "aws_instance" "' + nodeName + '" {\n'
		  +'  ami           = "ami-2757f631"\n'
		  +'  instance_type = "t2.micro"\n'
		  +'  key_name      = "Multiverse terraform"\n'
		  //+'  provisioner "local-exec" {'
		  //+'    command = "touch testfile"'
		  //+'  }'
		  +'  provisioner "remote-exec" {\n'
		  +'    inline = [\n'
		  +'      "./deployment/docker/init.sh -git=' + git+' -app=' + app +' -project=' + project + '"\n'
		  +'    ]\n'
		  +'    connection= {\n'
		  +'      user ="ec2-user"\n'
		  +'    }\n'
		  +'  }\n'
		  +'}\n';

		r += cfg;
		
	    var filepath = __dirname + "/instance_tfs/" + nodeName + ".tf";
	    //fs.closeSync(fs.openSync(filepath, 'w'));
	    fs.writeFile(filepath, cfg, function(err) {
		    if(err) {
		        return console.log(err);
		    }
		}); 
	}

	fs.writeFile(__dirname + "/genesis/" + project, JSON.stringify({count: nodes.length, keys: [], nodes: nodes}));

	/*exec('nohup terraform apply ./instance_tfs > tera.log', function (err, stdout) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log(stdout);
	});*/

    res.send("Tout bon");
});

router.get('/addPublicKey', function(req, res) {

	var project = req.param('project'),
		key = req.param('key'),
		filepath = __dirname + "/genesis/" + project;

	fs.readFile(filepath, function (err, data) {
		var data = JSON.parse(data);
		data.keys.push(key);
		fs.writeFile(filepath, JSON.stringify(data));
		res.send("OK");
	});

	//var t = 
});

router.get('/getGenesis', function (req, res) {
	var project = req.param('project'),
		filepath = __dirname + "/genesis/" + project;

	fs.readFile(filepath, function (err, data) {
		var data = JSON.parse(data);

		if (data.keys.length < data.nodes.length) {
			res.send("Not ready yet");
		} else {
			var ret = {
				"genesis_time": "0001-01-01T00:00:00Z",
				"chain_id": "test-chain" + project, 
				"app_hash": "",
				validators: data.keys.map(function (o) {
					return { 
						"pub_key": {"type":"ed25519","data":"FB4C36BF7BB1DD17368B170CC9369DABF561B757ECFC2CB9BF2A3A6D631E4F39"},
						"amount":10,
						"name":""
					};
				})
			};
			res.send(JSON.stringify(ret));
		}
	});
});

module.exports = router;
