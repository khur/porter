jest.dontMock('../src/Channel.js');

const Channel     = require("../src/Channel").default;

describe('Channel', function(){

    let testChannel = new Channel('testchannel');
    
    it('should have publish function', function(){
      console.warn('pending publish test');

    }); // gets message

    it('should have grab function', function(){
      console.warn('pending grab function test');
    });


  describe('subscribing', function(){
    
    it('should be able to be subscribed to', function(){

      testChannel.subscribe("testSubscribe", function(data){
        let details = data.detail;
        expect(details).toBeDefined();
        expect(details.blah).toEqual(true);
      });

      expect(Object.keys(testChannel.subscribers).length).toEqual(1);

      testChannel.publish("testSubscribe", {blah: true});

    }); // check subscribers here

    it('should clear subscribers', function(){
      console.warn('pending clear subscribers test');
    });

    it('should be able to be unsubscribed to', function(){

      testChannel.subscribe("testUnsubscribe", function(data){
        let details = data.detail;
        expect(details).toBeDefined();
        expect(details.subscribedTo).toEqual(true);
      });

      testChannel.unsubscribe("testUnsubscribe", function(data){
        console.warn("unsubscribe", data);
      });

      // expect(Object.keys(testChannel.subscribers).length).toEqual(1);
      console.warn('num of subscribers', Object.keys(testChannel.subscribers).length);

      testChannel.publish("testUnsubscribe", {subscribedTo: true});



    }); // check subscribers here

  });


  describe('Formatting action', function(){

    it('should format action with ::', function(){
      expect(testChannel.formatAction('formatted')).toEqual('testchannel::formatted');
    });

  });










}); // End Channel Describe




