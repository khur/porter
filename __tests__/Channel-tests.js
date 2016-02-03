jest.dontMock('../src/Channel.js');

const Channel     = require("../src/Channel").default;

describe('Channel', function(){

    let testChannel = new Channel('testchannel');
    // beforeEach(function(){
    //   testChannel.add()
    // })

    // afterEach(function(){
    //   testChannel.clear()
    // })

    xit('should have publish function', function(){
      console.warn('pending publish test');

    }); // gets message

    xit('should have grab function', function(){
      console.warn('pending grab function test');
    });


  describe('subscribing', function(){
    
    it('should be able to be subscribed to', function(){

      testChannel.subscribe("testaction", function(data){
        let details = data.detail;
        expect(details.blah).toEqual(true);
      });

      testChannel.publish("testaction", {blah: true});

    }); // check subscribers here

    xit('should clear subscribers', function(){
      console.warn('pending clear subscribers test');
    

    });
    xit('should be able to be unsubscribed to', function(){
      console.warn('pending unsubscribing test')
    }); // check subscribers here

  });
 

  describe('Formatting action', function(){

    xit('should format action with ::', function(){
      expect(testChannel.formatAction('formatted')).toEqual('testchannel::formatted');
    });

    
  });










}); // End Channel Describe




