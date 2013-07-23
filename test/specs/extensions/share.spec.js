'use strict';

describe("Hoodie.Share", function() {

  beforeEach(function() {
    this.hoodie = new Mocks.Hoodie();
    this.share = new Hoodie.Share(this.hoodie);

    this.sandbox = sinon.sandbox.create();
    this.sandbox.spy(this.share, "instance");
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  describe("constructor", function() {

    it("should extend hoodie.store API with share / unshare methods", function() {
      var share, shareAt, unshare, unshareAt, _ref;

      this.sandbox.spy(this.hoodie.store, "decoratePromises");

      new Hoodie.Share(this.hoodie);

      expect(this.hoodie.store.decoratePromises.called).to.be.ok();

      _ref = this.hoodie.store.decoratePromises.args[0][0],
      share = _ref.share,
      shareAt = _ref.shareAt,
      unshareAt = _ref.unshareAt,
      unshare = _ref.unshare;

      expect(typeof share).to.eql('function');
      expect(typeof shareAt).to.eql('function');
      expect(typeof unshareAt).to.eql('function');
      expect(typeof unshare).to.eql('function');
    });

  });

  describe("direct call", function() {

    beforeEach(function() {
      this.sandbox.spy(this.hoodie, "open");
    });

    afterEach(function() {
      this.sandbox.restore();
    });

    it("should init a new share instance", function() {
      var instance, share;

      this.sandbox.spy(Hoodie, "ShareInstance");

      share = new Hoodie.Share(this.hoodie);

      instance = share('funk123', {
        option: 'value'
      });
      expect(share.instance.called).to.be.ok();
    });

  });

  describe("#instance", function() {

    it("should point to Hoodie.ShareInstance", function() {
      var share = new Hoodie.Share(this.hoodie);
      expect(share.instance).to.eql(Hoodie.ShareInstance);
    });

  });

  //describe("#add(attributes)", function() {

    //beforeEach(function() {
      //this.instance = sinon.spy();
      //this.sandbox.stub(this.share, 'instance').returns(this.instance);

      //this.addDefer = this.hoodie.defer();
      //this.sandbox.stub(this.hoodie.store, "add").returns(this.addDefer.promise());
    //});

    //it("should add new object in hoodie.store", function() {
      //this.share.add({
        //id: '123'
      //});
      //expect(this.hoodie.store.add.calledWith('$share', {
        //id: '123'
      //})).to.be.ok();
    //});

    //_when("store.add successful", function() {

      //it("should resolve with a share instance", function() {
        //var self = this;

        //this.addDefer.resolve({
          //hell: 'yeah'
        //});

        //var promise = this.share.add({
          //funky: 'fresh'
        //});

        //promise.then(function (res) {
          //expect(res).to.eql(self.instance);
        //});

      //});

      //_and("user has no account yet", function() {

        //beforeEach(function() {
          //this.sandbox.stub(this.hoodie.account, "hasAccount").returns(false);
          //this.sandbox.spy(this.hoodie.account, "anonymousSignUp");
        //});

        //it("should sign up anonymously", function() {
          //this.share.add({
            //id: '123'
          //});
          //this.addDefer.resolve({
            //hell: 'yeah'
          //});
          //expect(this.hoodie.account.anonymousSignUp.called).to.be.ok();
        //});

      //});

    //});

  //});

  //describe("#find(share_id)", function() {

    beforeEach(function() {

      var promise = this.hoodie.defer().resolve({
        funky: 'fresh'
      }).promise();

      this.sandbox.stub(this.hoodie.store, "find").returns(promise);
      this.share.instance.andCallFake(function() {
        return this.foo = 'bar';
      });
    });

    it("should proxy to store.find('$share', share_id)", function() {
      var promise = this.share.find('123');
      expect(this.hoodie.store.find.calledWith('$share', '123')).to.be.ok()
    });

    it("should resolve with a Share Instance", function() {
      var promise;
      this.hoodie.store.find.andReturn(this.hoodie.defer().resolve({}).promise());
      this.share.instance.andCallFake(function() {
        return this.foo = 'bar';
      });
      promise = this.share.find('123');
      expect(promise).toBeResolvedWith({
        foo: 'bar'
      });
    });
  });
  describe("#findOrAdd(id, share_attributes)", function() {
    beforeEach(function() {
      this.findOrAddDefer = this.hoodie.defer();
      return spyOn(this.hoodie.store, "findOrAdd").andReturn(this.findOrAddDefer.promise());
    });
    it("should proxy to hoodie.store.findOrAdd with type set to '$share'", function() {
      this.share.findOrAdd('id123', {});
      return expect(this.hoodie.store.findOrAdd).wasCalledWith('$share', 'id123', {});
    });
    it("should not filter out createdBy property", function() {
      this.share.findOrAdd('id123', {
        createdBy: 'me'
      });
      return expect(this.hoodie.store.findOrAdd).wasCalledWith('$share', 'id123', {
        createdBy: 'me'
      });
    });
    return _when("store.findOrAdd successful", function() {
      it("should resolve with a Share Instance", function() {
        var promise;
        this.findOrAddDefer.resolve({});
        this.share.instance.andCallFake(function() {
          return this.foo = 'bar';
        });
        promise = this.share.findOrAdd('id123', {});
        return expect(promise).toBeResolvedWith({
          foo: 'bar'
        });
      });
      return _and("user has no account yet", function() {
        beforeEach(function() {
          spyOn(this.hoodie.account, "hasAccount").andReturn(false);
          return spyOn(this.hoodie.account, "anonymousSignUp");
        });
        return it("should sign up anonymously", function() {
          this.share.findOrAdd({
            id: '123'
          }, {});
          this.findOrAddDefer.resolve({});
          return expect(this.hoodie.account.anonymousSignUp).wasCalled();
        });
      });
    });
  //});

  describe("#findAll()", function() {
    //beforeEach(function() {
      //return spyOn(this.hoodie.store, "findAll").andCallThrough();
    //});
    //it("should proxy to hoodie.store.findAll('$share')", function() {
      //this.hoodie.store.findAll.andCallThrough();
      //this.share.findAll();
      //return expect(this.hoodie.store.findAll).wasCalledWith('$share');
    //});
    //return it("should resolve with an array of Share instances", function() {
      //var promise;
      //this.hoodie.store.findAll.andReturn(this.hoodie.defer().resolve([{}, {}]).promise());
      //this.share.instance.andCallFake(function() {
        //return this.foo = 'bar';
      //});
      //promise = this.share.findAll();
      //return expect(promise).toBeResolvedWith([
        //{
          //foo: 'bar'
        //}, {
          //foo: 'bar'
        //}
      //]);
    //});
  //});
  //describe("#save('share_id', attributes)", function() {
    //beforeEach(function() {
      //return spyOn(this.hoodie.store, "save").andCallThrough();
    //});
    //it("should proxy to hoodie.store.save('$share', 'share_id', attributes)", function() {
      //this.share.save('abc4567', {
        //access: true
      //});
      //return expect(this.hoodie.store.save).wasCalledWith('$share', 'abc4567', {
        //access: true
      //});
    //});
    //return it("should resolve with a Share Instance", function() {
      //var promise;
      //this.hoodie.store.save.andReturn(this.hoodie.defer().resolve({}).promise());
      //this.share.instance.andCallFake(function() {
        //return this.foo = 'bar';
      //});
      //promise = this.share.save({});
      //return expect(promise).toBeResolvedWith({
        //foo: 'bar'
      //});
    //});
  //});
  //describe("#update('share_id', changed_attributes)", function() {
    //beforeEach(function() {
      //return spyOn(this.hoodie.store, "update").andCallThrough();
    //});
    //it("should proxy to hoodie.store.update('$share', 'share_id', attributes)", function() {
      //this.share.update('abc4567', {
        //access: true
      //});
      //return expect(this.hoodie.store.update).wasCalledWith('$share', 'abc4567', {
        //access: true
      //});
    //});
    //return it("should resolve with a Share Instance", function() {
      //var promise;
      //this.hoodie.store.update.andReturn(this.hoodie.defer().resolve({}).promise());
      //this.share.instance.andCallFake(function() {
        //return this.foo = 'bar';
      //});
      //promise = this.share.update({});
      //return expect(promise).toBeResolvedWith({
        //foo: 'bar'
      //});
    //});
  //});
  //describe("#updateAll(changed_attributes)", function() {
    //beforeEach(function() {
      //return spyOn(this.hoodie.store, "updateAll").andCallThrough();
    //});
    //it("should proxy to hoodie.store.updateAll('$share', changed_attributes)", function() {
      //this.hoodie.store.updateAll.andCallThrough();
      //this.share.updateAll({
        //access: true
      //});
      //return expect(this.hoodie.store.updateAll).wasCalledWith('$share', {
        //access: true
      //});
    //});
    //return it("should resolve with an array of Share instances", function() {
      //var promise;
      //this.hoodie.store.updateAll.andReturn(this.hoodie.defer().resolve([{}, {}]).promise());
      //this.share.instance.andCallFake(function() {
        //return this.foo = 'bar';
      //});
      //promise = this.share.updateAll({
        //access: true
      //});
      //return expect(promise).toBeResolvedWith([
        //{
          //foo: 'bar'
        //}, {
          //foo: 'bar'
        //}
      //]);
    //});
  //});
  //describe("#remove(share_id)", function() {
    //beforeEach(function() {
      //spyOn(this.hoodie.store, "findAll").andReturn({
        //unshareAt: function() {}
      //});
      //return spyOn(this.hoodie.store, "remove").andReturn('remove_promise');
    //});
    //return it("should init the share instance and remove it", function() {
      //var promise;
      //promise = this.share.remove('123');
      //return expect(promise).toBe('remove_promise');
    //});
  //});
  //describe("#removeAll()", function() {
    //beforeEach(function() {
      //spyOn(this.hoodie.store, "findAll").andReturn({
        //unshare: function() {}
      //});
      //return spyOn(this.hoodie.store, "removeAll").andReturn('remove_promise');
    //});
    //return it("should init the share instance and remove it", function() {
      //var promise;
      //promise = this.share.removeAll();
      //return expect(promise).toBe('remove_promise');
    //});
  //});
  //return describe("hoodie.store promise decorations", function() {
    //beforeEach(function() {
      //this.storeDefer = this.hoodie.defer();
      //return spyOn(this.hoodie.store, "update");
    //});
    //describe("#shareAt(shareId, properties)", function() {
      //_when("promise returns one object", function() {
        //beforeEach(function() {
          //this.promise = this.storeDefer.resolve({
            //type: 'task',
            //id: '123',
            //title: 'milk'
          //});
          //return this.promise.hoodie = this.hoodie;
        //});
        //return it("should save object returned by promise with {$sharedAt: 'shareId'}", function() {
          //Hoodie.Share.prototype._storeShareAt.apply(this.promise, ['shareId']);
          //return expect(this.hoodie.store.update).wasCalledWith('task', '123', {
            //$sharedAt: 'shareId'
          //});
        //});
      //});
      //return _when("promise returns multiple objects", function() {
        //beforeEach(function() {
          //this.promise = this.storeDefer.resolve([
            //{
              //type: 'task',
              //id: '123',
              //title: 'milk'
            //}, {
              //type: 'task',
              //id: '456',
              //title: 'milk'
            //}
          //]);
          //return this.promise.hoodie = this.hoodie;
        //});
        //return it("should update object returned by promise with $public: true", function() {
          //Hoodie.Share.prototype._storeShareAt.apply(this.promise, ['shareId']);
          //expect(this.hoodie.store.update).wasCalledWith('task', '123', {
            //$sharedAt: 'shareId'
          //});
          //return expect(this.hoodie.store.update).wasCalledWith('task', '456', {
            //$sharedAt: 'shareId'
          //});
        //});
      //});
    //});
    //describe("#unshareAt(shareId)", function() {
      //_when("object is currently shared at 'shareId'", function() {
        //beforeEach(function() {
          //this.promise = this.storeDefer.resolve({
            //type: 'task',
            //id: '123',
            //title: 'milk',
            //$sharedAt: 'shareId'
          //});
          //return this.promise.hoodie = this.hoodie;
        //});
        //return it("should save object returned by promise with {$unshared: true}", function() {
          //Hoodie.Share.prototype._storeUnshareAt.apply(this.promise, ['shareId']);
          //return expect(this.hoodie.store.update).wasCalledWith('task', '123', {
            //$unshared: true
          //});
        //});
      //});
      //return _when("promise returns multiple objects, of which some are shared at 'shareId'", function() {
        //beforeEach(function() {
          //this.promise = this.storeDefer.resolve([
            //{
              //type: 'task',
              //id: '123',
              //title: 'milk'
            //}, {
              //type: 'task',
              //id: '456',
              //title: 'milk',
              //$sharedAt: 'shareId'
            //}
          //]);
          //return this.promise.hoodie = this.hoodie;
        //});
        //return it("should update objects returned by promise with {$unshared: true}", function() {
          //Hoodie.Share.prototype._storeUnshareAt.apply(this.promise, ['shareId']);
          //expect(this.hoodie.store.update).wasNotCalledWith('task', '123', {
            //$unshared: true
          //});
          //return expect(this.hoodie.store.update).wasCalledWith('task', '456', {
            //$unshared: true
          //});
        //});
      //});
    //});
    //describe("#unshare()", function() {
      //_when("promise returns one object", function() {
        //beforeEach(function() {
          //this.promise = this.storeDefer.resolve({
            //type: 'task',
            //id: '123',
            //title: 'milk',
            //$sharedAt: 'shareId'
          //});
          //return this.promise.hoodie = this.hoodie;
        //});
        //return it("should save object returned by promise with {$unshared: true}", function() {
          //Hoodie.Share.prototype._storeUnshare.apply(this.promise, []);
          //return expect(this.hoodie.store.update).wasCalledWith('task', '123', {
            //$unshared: true
          //});
        //});
      //});
      //return _when("promise returns multiple objects, of which some are shared at 'shareId'", function() {
        //beforeEach(function() {
          //this.promise = this.storeDefer.resolve([
            //{
              //type: 'task',
              //id: '123',
              //title: 'milk'
            //}, {
              //type: 'task',
              //id: '456',
              //title: 'milk',
              //$sharedAt: 'shareId'
            //}
          //]);
          //return this.promise.hoodie = this.hoodie;
        //});
        //return it("should update objects returned by promise with {$unshared: true}", function() {
          //Hoodie.Share.prototype._storeUnshare.apply(this.promise, []);
          //expect(this.hoodie.store.update).wasNotCalledWith('task', '123', {
            //$unshared: true
          //});
          //return expect(this.hoodie.store.update).wasCalledWith('task', '456', {
            //$unshared: true
          //});
        //});
      //});
    //});
    describe("#share(shareId, properties)", function() {

      _when("promise returns one object", function() {

        beforeEach(function() {
          this.promise = this.storeDefer.resolve({
            type: 'task',
            id: '123',
            title: 'milk'
          });

          this.promise.hoodie = this.hoodie;
          this.sandbox.stub(this.hoodie.share, "add").returns(this.hoodie.defer().resolve({
            id: 'newShareId'
          }));

        });

        it("should save object returned by promise with {$sharedAt: 'shareId'}", function() {
          Hoodie.Share.prototype._storeShare.apply(this.promise);
          expect(this.hoodie.store.update.calledWith('task', '123', {
            $sharedAt: 'newShareId'
          })).to.be.ok();
        });

      });

    });

  });

});
