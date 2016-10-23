
module.exports = function(RED) {
    function PCA9685Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function(msg) {
            msg.pca9685 = {debug: 'hi'}
            node.send(msg);
        });
    }
    RED.nodes.registerType("pca9685", PCA9685Node);
}