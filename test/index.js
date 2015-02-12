var alphabot = require('../index');
var chai = require('chai');
var dest = 'test/cmp-a';
var fs = require('fs');
var path = require('path');
var dir = require('node-dir');

describe('alphabot', function () {

    it('should get the application distribution module paths', function (done) {
        alphabot('component', dest, { overwrite: true }, function (err, result) {
            if (err) {
                throw err;
            }

            chai.expect(fs.existsSync(path.join(dest, 'src'))).to.be.true;

            var contents = [];
            dir.readFiles(dest, function (err, content, next) {
                if (err) {
                    throw err;
                }
                contents.push(content);
                next();
            }, function (err, files) {
                if (err) {
                    throw err;
                }

                chai.expect(files.length).to.be.equal(6);
                files.forEach(function (file, i) {
                    if (file.indexOf('package.json') !== -1) {
                        var packageJSON = contents[i];
                        try {
                            packageJSON = JSON.parse(packageJSON);
                        } catch (e) {
                            throw e;
                        }

                        chai.expect(packageJSON.name).to.be.equal('cmp-a');
                    }
                });
                done();
            });
        });
    });

});