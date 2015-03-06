/**
 * Created by sergey on 06.03.15.
 */

var mongoose = require('mongoose');
var config = require('config');

mongoose.connect(config.get('mongoose.uri'), config.get('mongoose.options'));

module.exports = mongoose;