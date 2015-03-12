/**
 * Created by sergey on 13.03.15.
 */

module.exports = function(req, res, next) {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        //"Access-Control-Allow-Methods": "GET, POST, DELETE, PUT",
    });
    next();
};
