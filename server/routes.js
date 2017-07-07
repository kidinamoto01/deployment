var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var fs = require('fs');
var http = require("http");
var https = require("https");

var TERRAFORMAPPLY_CMD = 'terraform apply > tera.log';
var TERRAFORMAMI = "ami-5ec8cf48";
var DATAPATH = __dirname + "/data";

//do catch all getnodesstatus


/**
 * Return config for a given project
 */
function getConfig(project) {
    var data = fs.readFileSync(getPath(project) + "/config", "utf8");
    return JSON.parse(data);
}

/**
 * Return path for a given project
 */
function getPath(project) {
    return DATAPATH + "/" + project;
}

function projectExists(project) {
    return fs.existsSync(getPath(project));
}
/**
 * Return nodes status retrieved from terraform for a given project
 */
function getNodesStatus(project, cb) {
    // Call terraform output to retrieve JSON, process it and return result

    console.log("getNodesStatus():", "cd " + getPath(project) + "; terraform output -json");
    exec("cd " + getPath(project) + "; terraform output -json", function(error, stdout, stderr) {
        var nodeData, output = { nodes: {} };

        try {
            console.log("Terraform output", stdout);
            nodeData = JSON.parse(stdout);
        } catch (e) {
            console.log("Unable to process Terraform return", e);
            //res.send({ error: "Unable to process Terraform return" });
            output.error = "Unable to process Terraform return";
            cb(output);
            return;
        }

        for (var i in nodeData) {
            output.nodes[i.replace("node", "")] = nodeData[i].value;
        }

        cb(output);
    });
}

/*
 * Create new project
 */
router.get('/create', function(req, res) {
    console.log("Running route /create");

    if (!validate(req, res, { nodes: { type: 'JSON', required: true }, project: { required: true }, git: { required: true }, app: { required: true } })) return;

    var nodes = JSON.parse(req.query.nodes),
        project = req.query.project,
        git = req.query.git,
        app = req.query.app,
        path = getPath(project),
        projExists = projectExists(project);

    if (!projExists) {
        fs.mkdirSync(path);
        fs.writeFile(path + "/config", JSON.stringify({ count: nodes.length, keys: [], nodes: nodes }));
        execSync("cp " + DATAPATH + "/aws_* " + path);
    }

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
            //+ '        "touch testfile"\n' //
            // +'      "./deployment/docker/init -g=' + git + ' -a=' + app + ' -p=' + project + ' -n=' + node + ' --tendermintPort=46656 --proxyPort=46658 --appPort=46659"\n' //
            + '    ]\n' //
            + '    connection= {\n' //
            + '      user ="ec2-user"\n' //
            + '      private_key="${file("/home/ec2-user/.ssh/Multiverseterraform.pem")}"\n' //
            + '    }\n' //
            + '  }\n' //
            + '}\n\n' //
            + 'output "' + node + '" {\n' //
            + '  value = {' //
            + '    public_dns = "${aws_instance.' + node + '.public_dns }"\n' //
            + '    ip = "${aws_instance.' + node + '.public_ip}"\n' //
            + '    state = "${aws_instance.' + node + '.instance_state}"\n' //
            + '    availability_zone = "${aws_instance.' + node + '.availability_zone}"\n' //
            + '  }\n' //
            + '}\n\n';

        var filepath = getPath(project) + "/" + node + ".tf";
        fs.writeFile(filepath, cfg, function(err) {
            if (err) {
                return console.log(err);
            }
        });
    }

    exec("cd " + getPath(project) + ";" + TERRAFORMAPPLY_CMD, function(err, stdout, stderr) {
        if (err) {
            return console.log("Error applying terraform:120", err);
            //return console.log(err);
        }

        getNodesStatus(project, function(data) {
            var ips = object_values(data.nodes).map(function(o) {
                return o.ip;
            }).join(',');
            for (var i in nodes) {
                var id = nodes[i],
                    node = data.nodes[id];

                var cmd = 'cd deployment/docker;sleep 20 && ./init -g=' + git + ' -a=' + app + ' -p=' + project + ' -n=' + id + ' -i=' + ips + " --tendermintPort=46656 --proxyPort=46658 --appPort=46659 > init.log";
                //var cmd = "touch testfile";
                console.log("Running ssh on:", node, "cmd: ", cmd);
                exec("ssh -oStrictHostKeyChecking=no ec2-user@" + node.ip + ' "' + cmd + '"', function(e, stdout, stderr) {
                    if (e) console.log("Error running ssh", e);
                });
            }
        });
    });

    res.send({});
});


/**
 * List state  for given nodes
 */
router.get('/list', function(req, res) {
    // Get nodes, init cfg var
    //console.log("Entering /list route");

    if (!validate(req, res, { project: { required: true } })) return;

    if (!projectExists(req.query.project)) return res.status(500).send({ error: "Project does not exist" });

    // Apply terraform output config using refresh
    try {
        var stdout = execSync("cd " + getPath(req.query.project) + "; terraform refresh");
    } catch (e) {
        console.log("'terraform refresh' failed", e);
        return res.send({ error: "Terraform is not able to perform the requested operation" });
    }
    //console.log("Terraform configuration refreshed");

    getNodesStatus(req.query.project, function(data) {
        res.send(data);
    });
});


/**
 * List state  for given nodes
 */
router.get('/listValidators', function(req, res) {
    // Get nodes, init cfg var
    console.log("Entering /listValidators route");

    if (!validate(req, res, { project: { required: true } })) return;

    if (!projectExists(req.query.project)) return res.status(500).send({ error: "Project does not exist" });

    // Apply terraform output config using refresh
    try {
        var stdout = execSync("cd " + getPath(req.query.project) + "; terraform refresh");
    } catch (e) {
        console.log("'terraform refresh' failed", e);
        return res.send({ error: "Terraform is not able to perform the requested operation" });
    }
    //console.log("Terraform configuration refreshed");

    getNodesStatus(req.query.project, function(data) {
        //console.log("got nodes status", data);
        var validators, counter = 1,
            onRequest = function() {
                counter--;
                if (counter === 0) {

                    for (var i in data.nodes) {
                        var n = data.nodes[i]
                        var v = object_find(validators, function(v) {
                            return n.pub_key && v.pub_key.data === n.pub_key.data;
                        });

                        if (v) n.voting_power = v.voting_power;
                    }
                    res.send(data);
                    counter--;
                    if (counter === 0) {
                        res.send(data);
                    }
                }
            };
        // console.log("data.nodes,", data.nodes);
        getJSON({ host: object_values(data.nodes)[0].ip, port: 46657, path: '/validators', method: 'GET' },
            function(status, data) {
                validators = data.result.validators;
                //console.log("validators", validators);
                onRequest();
            }, onRequest);

        for (var i in data.nodes) {
            var node = data.nodes[i];
            counter++;
            getJSON({ host: node.ip, port: 46657, path: '/status', method: 'GET' },
                function(node, status, data) {
                    node.latest_block_height = data.result.latest_block_height;
                    node.latest_block_time = data.result.latest_block_time;
                    node.latest_block_hash = data.result.latest_block_hash;
                    node.pub_key = data.result.pub_key;
                    onRequest();
                }.bind(null, node), onRequest);
        }
    });
});


/**
 *
 */
router.get("/test", function(req, res) {

    if (!validate(req, res, { nodes: { type: 'JSON', required: true }, project: { required: true }, git: { required: true }, app: { required: true } })) return;

    var project = req.query.project,
        git = req.query.git,
        app = req.query.app;

    getNodesStatus(project, function(data) {
        var ips = object_values(data.nodes).map(function(o) {
            return o.ip;
        }).join(',');

        for (var i in data.nodes) {
            var node = data.nodes[i],
                cmd = 'cd deployment/docker;./init -g=' + git + ' -a=' + app + ' -p=' + project + ' -n=' + i + ' -i=' + ips + " --tendermintPort=46656 --proxyPort=46658 --appPort=46659";
            //var cmd = "touch testfile";

            console.log("Running ssh on:", node, "cmd: ", cmd);
            //exec("ssh ec2-user@" + data.nodes[i].IP + '  "init -g=' + git + ' -e=' + app + ' -p=' + project + ' -n=' + node + ' -ips=' + ips + '"');
            exec("ssh -oStrictHostKeyChecking=no ec2-user@" + data.nodes[i].ip + ' "' + cmd + '"', function(e, stdout, stderr) {
                if (e) console.log("Error running ssh", e);
            });
            // exec("ssh ec2-user@" + data.nodes[i].IP + ' -m ' //
            //     + '"./deployment/docker/init -g=' + git + ' -a=' + app + ' -p=' + project + ' -n=' + node + ' --tendermintPort=46656 --proxyPort=46658 --appPort=46659 -i=' + ips + '"')
        }
    });
    res.send("done");
});

/**
 * Removes a project or a node
 */
router.get('/remove', function(req, res) {

    if (!validate(req, res, { nodes: { type: 'JSON' }, project: { required: true } })) return;

    var project = req.query.project;

    if (!projectExists(project)) return res.status(500).send({ error: "Project does not exist" });

    if (req.query.nodes) {
        var nodes = JSON.parse(req.query.nodes);

        for (var i in nodes) {
            try {
                execSync("unlink " + getPath(project) + "/node" + i + ".tf");
            } catch (e) {
                console.log('Unlink error: ', e);
            }
        }
    } else {
        try {
            execSync("unlink " + getPath(project) + "/node*.tf");
        } catch (e) {
            console.log('Unlink error: ', e);
        }
    }

    exec("cd " + getPath(project) + ";terraform apply", function(err, stdout, stderr) {
        if (err) {
            return console.log("Remove apply error:", err);
        }
        console.log("Deleting folder");
        exec("rm -rf " + getPath(project));
        //console.log("Terraform output", stdout, err, stdout);
    });

    res.send({});
});

/**
 * Add a public key to the cluster of public keys
 */
router.get('/addPublicKey', function(req, res) {
    console.log("Entering addPublicKey")

    if (!validate(req, res, { project: { required: true }, key: { required: true } })) return;

    var project = req.query.project,
        key = req.query.key,
        data;

    if (!projectExists(project)) return res.status(500).send({ error: "Project does not exist" });

    try {
        data = getConfig(project);
    } catch (e) {
        console.log("error retrieving project data.", e);
        return res.status(500).send({ error: "Unable to retrieve project data" });
    }

    if (data.keys.indexOf(key) == -1 && data.keys.length < data.nodes.length) { // Do not add keys already present
        data.keys.push(key);
        fs.writeFile(getPath(project) + "/config", JSON.stringify(data));
    }
    res.send({});
});


/**
 * Returns completed genesis file
 */
router.get('/getGenesis', function(req, res) {
    if (!validate(req, res, { project: { required: true } })) return;

    var project = req.query.project,
        data;

    if (!projectExists(project)) return res.status(500).send({ error: "Project does not exist" });

    try {
        data = getConfig(project);
    } catch (e) {
        return res.status(500).send({ error: "Unable to retrieve project data" });
    }

    if (data.keys.length < data.nodes.length) {
        res.send({ error: "Not ready yet" });
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
        res.send(ret);
    }
});

/**
 * Minimal input validation
 */
function validate(req, res, cfg) {
    for (var i in cfg) {
        var val = req.query[i];

        if (!val) {
            if (cfg[i].required) {
                res.status(500).send({ error: "Parameter '" + i + "' is required." });
                return false;
            }
        } else if (cfg[i].type == "JSON") {
            try {
                JSON.parse(val);
            } catch (e) {
                res.status(500).send({ error: "Parameter '" + i + "' is not valid json." });
                return false;
            }
        }
    }
    return true;
}

/**
 * Utils
 */
function object_values(o) {
    var ret = [];
    for (var i in o) {
        ret.push(o[i]);
    }
    return ret;
}

function object_find(o, fn) {
    for (var i in o) {
        if (fn(o[i], i)) return o[i];
    }
}

/**
 *
 */
getJSON = function(options, onResult, onError) {
    //console.log("rest::getJSON");

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res) {
        var output = '';
        //console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function(chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('socket', function(socket) {
        socket.setTimeout(5000);
        socket.on('timeout', function() {
            req.abort();
            onError();
        });
    });
    //req.setTimeout(3000, function(err) {
    //    onError(err);
    //});

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
        onError(err);
    });

    req.end();
};

module.exports = router;
