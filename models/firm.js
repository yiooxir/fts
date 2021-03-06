/**
 * Created by sergey on 06.03.15.
 */

var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    startNum: {
        type: Number,
        default: 1
    },
    created: {
        type: Date,
        default: Date.now
    }
});

exports.Firm = mongoose.model('Firm', schema);
