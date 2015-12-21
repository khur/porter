// implicitly import Channel from Porter

var Producer = function(channel) {
  this.channels = [];
  if (channel) this.addChannel(channel);
};

Producer.prototype.publish = function(action, data){
  for(var channel in this.channels){
    channel.publish(action);
  }
};

Producer.prototype.addChannel = function(channel) {
  if (channel instanceof Channel) {
    this.channels.push(channel);
  } else {
    console.error("Producer cannot addChannel: invalid channel", channel);
  }
};

Producer.prototype.removeChannel = function(channel) {
  var index = this.channels.indexOf(channel);
  if (index > -1) {
    this.channels.splice(index, 1);
  }
};

var module = module || null;
module.exports = Producer;
