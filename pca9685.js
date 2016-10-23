
module.exports = function(RED) {

    "use strict";
    var exec = require('child_process').exec;
    var spawn = require('child_process').spawn;
    var fs = require('fs');

    var pca9685Command = __dirname+'/nrpca9685';

    // Check that the executable is executable
    if ( !(1 & parseInt((fs.statSync(pca9685Command).mode & parseInt("777", 8)).toString(8)[0]) )) {
        RED.log.error(RED._("pca9685.errors.needtobeexecutable",{command:pca9685Command}));
        throw "Error : "+RED._("pca9685.errors.mustbeexecutable");
}

    var child = spawn(pca9685Command);

    child.stderr.on('data', function (data) {
        RED.log.error("err: "+data+" :");
    });


    function PCA9685Node(config) {
        RED.nodes.createNode(this, config);

        // For debugging
        // config.channel = 0

        this.channel = config.channel

        var node = this;

        node.on('input', function(msg) {
            msg.pca9685 = {channel: node.channel,
                           position: msg.payload}
            console.log(msg)
            if (child !== null) {
                // Use the channel defined in the node
                var c = node.channel
                // If the channel has been overridden in the message, use that one
                if (msg.channel !== undefined) {
                    c = msg.channel
                }
                if (c >= 0 && c <= 15) {
                    child.stdin.write(c + " " + msg.payload+"\n");
                }
            }

            node.send(msg);
        });


    }
    RED.nodes.registerType("pca9685", PCA9685Node);
}