var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');
var defaults = {
    overwrite: false
};

function packageName(name, dest, callback) {
    var packagePath = path.join(dest, 'package.json');

    fs.readJson(packagePath, function (err, json) {
        if (err) {
            return callback(err, null);
        }

        json.name = name;
        fs.writeFile(packagePath, JSON.stringify(json, null, 2), function (err) {
            if (err) {
                return callback(err, null);
            }

            callback(null, true);
        });
    });
}

function readme(name, dest, callback) {
    var fileName = 'README.md';

    function template(str, name) {
        _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
        return _.template(str)({ name: name });
    }

    function write(fileName, readme, name, dest, callback) {
        fs.writeFile(path.join(dest, fileName), template(readme, name), function (err) {
            if (err) {
                return callback(err, null);
            }

            callback(null, true);
        });
    }

    fs.readFile(path.join(dest, fileName), function (err, readme) {
        if (err) {
            fileName = 'readme.md';
            return fs.readFile(path.join(dest, fileName), function (err, readme) {
                write(fileName, readme, name, dest, function (err, results) {
                    if (err) {
                        return callback(err, null);
                    }

                    callback(null, true);
                });
            });
        }

        write(fileName, readme, name, dest, function (err, results) {
            if (err) {
                return callback(err, null);
            }

            callback(null, true);
        });
    });
}

module.exports = function (type, dest, options, callback) {
    options = _.defaults(options || {}, defaults.type);
    var template = options.template || 'alphabot-' + type;
    var name = dest.split(path.sep).pop();
    template = require.resolve(template);
    template = path.join(template.substr(0, template.lastIndexOf(path.sep)), 'template');

    dest = path.resolve(dest);
    fs.exists(dest, function (exists) {
        if (exists && !options.overwrite) {
            return callback(new Error ('alphabot: ' + dest + ' already exists.'), null);
        }

        fs.ensureDir(dest, function (err) {
            if (err) {
                return callback(err, null);
            }

            fs.copy(template, dest, function (err) {
                if (err) {
                    return callback(err, null);
                }

                readme(name, dest, function (err, results) {
                    if (err) {
                        return callback(err, null);
                    }

                    packageName(name, dest, function (err, results) {
                        if (err) {
                            return callback(err, null);
                        }
                        callback(null, 'alphabot: ' + type + ' created at ' + dest + ' based on ' + (options.template || 'alphabot-' + type));
                    });
                });
            });
        });
    });
};