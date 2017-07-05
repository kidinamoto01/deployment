var express = require('express');
var router = express.Router();

var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var fs = require('fs');

var TERRAFORMAPPLY_CMD = 'nohup terraform apply ./instance_tfs > tera.log';
var TERRAFORMAMI = "ami-a4c7edb2";

/**
 * List state  for given nodes
 */
router.get('/list', function(req, res) {
    // Get nodes, init cfg var
    //console.log("Entering /list route");

    if (!validate(req, res, { nodes: { type: "JSON", required: false }, project: { required: false } })) return;

    var nodes,
        terraformOutputCfg = "";

    if (req.query.nodes) {
        nodes = JSON.parse(req.query.nodes);
    } else if (req.query.project) {
        try {
            var data = fs.readFileSync(__dirname + "/genesis/" + req.query.project, "utf8");
            nodes = JSON.parse(data).nodes;
        } catch (e) {
            console.error("Error reading project data", e);
            return res.status(500).send("Error reading project data:" + e);
        }
    } else {
        return res.status(500).send("Parameter 'nodes' or 'project' is required.");
    }

    // Apply terraform output config using refresh
    try {
        var stdout = execSync("terraform refresh ./instance_tfs");
    } catch (e) {
        console.log("'terraform refresh' failed");
        console.log(e);
        res.send('{error: "Terraform is not able to perform the requested operation"}');
        return;
    }
    //console.log("Terraform configuration refreshed");

    // Call terraform output to retrieve JSON, process it and return result
    exec("terraform output -json", function(error, stdout, stderr) {
        try {
            console.log("Terraform output", stdout);
            var nodeData = JSON.parse(stdout);
        } catch (e) {
            res.send('{error: "Unable to process Terraform return"}');
            return;
        }
        var output = { error: null, nodes: {} };
        for (var i = 0; i < nodes.length; i++) {
            var node = 'node' + nodes[i]
            if (typeof nodeData[node + '_ip'] !== 'undefined' && nodeData[node + '_ip']) {
                output.nodes[node] = {
                    state: nodeData[node + '_state'].value[0],
                    IP: nodeData[node + '_ip'].value[0]
                };
            } else { //output error
                output.nodes[node] = {
                    error: "unknown_node",
                    state: "",
                    IP: ""
                };
            }
        }
        res.send(JSON.stringify(output));
    });
});

/*
 * Create new project
 */
router.get('/create', function(req, res) {

    if (!validate(req, res, { nodes: { type: 'JSON', required: true }, project: { required: true }, git: { required: true }, app: { required: true } })) return;

    var nodes = JSON.parse(req.query.nodes),
        project = req.query.project,
        git = req.query.git,
        app = req.query.app;

    if (fs.existsSync(__dirname + "/genesis/" + project)) return res.status(500).write("Project already exists");

    var r = "";

    for (var i = 0; i < nodes.length; i++) {
        var node = 'node' + nodes[i];
        var cfg = 'resource "aws_instance" "' + node + '" {\n' //
            + '  ami           = "' + TERRAFORMAMI + '"\n' // 
            + '  instance_type = "t2.micro"\n' //
            + '  key_name      = "Multiverse terraform"\n' //
            //+'  provisioner "local-exec" {'
            //+'    command = "touch testfile"'
            //+'  }'
            + '  provisioner "remote-exec" {\n' //
            + '    inline = [\n' //
            + '        "touch testfile"\n' //
            + '      "./deployment/docker/init -g=' + git + ' -e=' + app + ' -p=' + project + ' -n=' + node + ' --tendermintPort=46656 --proxyPort=46658 --appPort=46659"\n' //
            + '    ]\n' //
            + '    connection= {\n' //
            + '      user ="ec2-user"\n' //
            + '      private_key="${file("/home/ec2-user/.ssh/Multiverseterraform.pem")}"\n' //
            + '    }\n' //
            + '  }\n' //
            + '}\n\n' + 'output "' + node + '_ip" {\n' //
            + '  value = ["${aws_instance.' + node + '.public_ip}"]\n' //
            + '}\n\n' //
            + 'output "' + node + '_state" {\n' //
            + '  value = ["${aws_instance.' + node + '.instance_state}"]\n' //
            + '}\n\n';

        r += cfg;

        var filepath = __dirname + "/instance_tfs/" + node + ".tf";
        //fs.closeSync(fs.openSync(filepath, 'w'));
        fs.writeFile(filepath, cfg, function(err) {
            if (err) {
                return console.log(err);
            }
        });
    }

    fs.writeFile(__dirname + "/genesis/" + project, JSON.stringify({ count: nodes.length, keys: [], nodes: nodes }));

    exec(TERRAFORMAPPLY_CMD, function(err, stdout, stderr) {
        if (err) {
            return console.log(err);
        }
        //console.log("Terraform output", stdout, err, stdout);
    });

    res.send("Done");
});

/**
 * Removes a project or a node
 */
router.get('/remove', function(req, res) {

    if (!validate(req, res, { nodes: { type: 'JSON' } })) return;

    var nodes;

    if (req.query.nodes) {
        nodes = JSON.parse(req.query.nodes);
    } else if (req.query.project) {
        try {
            var data = fs.readFileSync(__dirname + "/genesis/" + req.query.project, "utf8");
            nodes = JSON.parse(data).nodes;
        } catch (e) {
            console.error("Error reading project data", e);
            return res.status(500).send("Error reading project data:" + e);
        }
    } else {
        return res.status(500).send("Parameter 'nodes' or 'project' is required.");
    }

    for (var i in nodes) {
        try {
            execSync('unlink instance_tfs/node' + nodes[i] + ".tf");
        } catch (e) {
            console.error('Unlink error: ', e)
        }
    }

    exec(TERRAFORMAPPLY_CMD, function(err, stdout, stderr) {
        if (err) {
            return console.log(err);
        }
        //console.log("Terraform output", stdout, err, stdout);
    });

    res.send("DONE");
});

/**
 * Add a public key to the cluster of public keys
 */
router.get('/addPublicKey', function(req, res) {

    if (!validate(req, res, { project: { required: true }, key: { required: true } })) return;

    var project = req.query.prject,
        key = req.query.key,
        filepath = __dirname + "/genesis/" + project;

    fs.readFile(filepath, function(err, data) {
        var data = JSON.parse(data);
        data.keys.push(key);
        fs.writeFile(filepath, JSON.stringify(data));
        res.send("OK");
    });
});


/**
 * Returns completed genesis file
 */
router.get('/getGenesis', function(req, res) {

    if (!validate(req, res, { project: { required: true } })) return;

    var project = req.query.project,
        filepath = __dirname + "/genesis/" + project;

    fs.readFile(filepath, function(err, data) {
        var data = JSON.parse(data);

        if (data.keys.length < data.nodes.length) {
            res.send("Not ready yet");
        } else {
            var ret = {
                genesis_time: "0001-01-01T00:00:00Z",
                chain_id: "test-chain" + project,
                app_hash: "",
                validators: data.keys.map(function(o) {
                    return {
                        pub_key: { "type": "ed25519", "data": o },
                        //"pub_key": { "type": "ed25519", "data": "FB4C36BF7BB1DD17368B170CC9369DABF561B757ECFC2CB9BF2A3A6D631E4F39" },
                        amount: 10,
                        name: ""
                    };
                })
            };
            res.send(JSON.stringify(ret));
        }
    });
});

/**
 * Minimal input validation
 */
function validate(req, res, cfg) {
    for (var i in cfg) {
        var val = req.query[i];

        if (!val) {
            if (cfg[i].required) {
                res.status(500).send("Parameter '" + i + "' is required.");
                return false;
            }
        } else if (cfg[i].type == "JSON") {
            try {
                JSON.parse(val)
            } catch (e) {
                res.status(500).send("Parameter '" + i + "' is not valid json.");
                return false;
            }
        }
    }
    return true;
}

module.exports = router;
