
var File = require('../lib/file').File;

;(function() {
  'use strict';

  describe('file package', function() {
    describe('File class', function() {
      it('exists', function() {
        expect(File).toEqual(jasmine.any(Function));
      });

      it('throws an error when called without the `new` keyword', function() {
        expect(function() { File(); }).toThrow();
      });

      it('sets the `.ext` given { format: ... }', function() {
        var fakeOption = { format: "test format" },
            testFile = new File(fakeOption);
        expect(testFile.ext).toEqual(fakeOption.format);
      });

      it('sets the `.responseDirPath` given { path: ... }', function() {
        var fakeOption = { path: "test path" },
            testFile = new File(fakeOption);
        expect(testFile.responseDirPath).toEqual(fakeOption.path);
      });

      it('sets the default `.responseDirPath` as `responses` if not set in options', function() {
        var testFile = new File();
        expect(testFile.responseDirPath).toEqual('responses');
      });

      it('sets the default `.ext` as `json` if not set in options', function() {
        var testFile = new File();
        expect(testFile.ext).toEqual('json');
      });

      describe('.getResponseDirPath()', function() {
        var testFile;
        beforeEach(function() {
          testFile = new File();
        });

        it('exists', function() {
          expect(testFile.getResponseDirPath).toEqual(jasmine.any(Function));
        });

        it('returns the process\'s absolute path with `responses` appended when `.responseDirPath` is not initialized', function() {
          expect(testFile.getResponseDirPath()).toEqual(process.cwd() + '/responses');
        });

        it('returns the absolute directory of the current process with the `.responseDirPath` appended', function() {
          testFile.responseDirPath = 'testFilePath';
          expect(testFile.getResponseDirPath()).toEqual(process.cwd() + '/testFilePath');
        });

        it('returns the absolute directory of the current process with the `.responseDirPath` appended, removing the trailing slashes', function() {
          testFile.responseDirPath = 'testFilePath/';
          expect(testFile.getResponseDirPath()).toEqual(process.cwd() + '/testFilePath');
        });

        it('returns the absolute directory of the current process with the `.responseDirPath` appended, removing the leading slashes', function() {
          testFile.responseDirPath = '/testFilePath';
          expect(testFile.getResponseDirPath()).toEqual(process.cwd() + '/testFilePath');
        });
      });

      describe('.getExt()', function() {
        var testFile;
        beforeEach(function() {
          testFile = new File();
        });

        it('exists', function() {
          expect(testFile.getExt).toEqual(jasmine.any(Function));
        });

        it('returns `json` when `.ext` is not initialized', function() {
          expect(testFile.getExt()).toEqual('json');
        });

        it('returns the value stored in `.ext` when set', function() {
          testFile.ext = 'fakeExt';
          expect(testFile.getExt()).toEqual('fakeExt');
        });
      });

      describe('.getResponseFilename()', function() {
        var testFile;
        beforeEach(function() {
          testFile = new File();
        });

        it('exists', function() {
          expect(testFile.getResponseFilename).toEqual(jasmine.any(Function));
        });

        it('returns a the `method` and the `extension` for the root URL', function() {
          expect(testFile.getResponseFilename('GET', '/')).toEqual('get.json');
        });

        it('returns a the `method` and the `extension` for the empty URL', function() {
          expect(testFile.getResponseFilename('GET', '')).toEqual('get.json');
        });

        it('returns a filename that prepends the `method` and the `url` with the forward slashes replaced with periods', function() {
          expect(testFile.getResponseFilename('GET', '/hello/world')).toEqual('get.hello.world.json');
        });
      });
    });
  });
})();