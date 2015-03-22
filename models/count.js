/**
 * Created by sergey on 06.03.15.
 */

/**
 * Created by sergey on 06.03.15.
 */

var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String
    },
    amount: {
        type: String,
        required: true
    },
    sysNumber: {
        type: Number
    },
    firm: {
        type: Object,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Object,
        required: true
    }
});

exports.Count = mongoose.model('Count', schema);
