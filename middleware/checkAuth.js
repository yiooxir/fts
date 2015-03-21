/**
 * Created by sergey on 20.03.15.
 */

var HttpError = require('../error').HttpError;

module.exports = {
    isSuperUser : function(req, res, next) {
        if (res.locals.user && !res.locals.user.isSuperUser) {
            return next(new HttpError(401, " Вы не суперюзер "));
        }
        next();
    },

    isLoggedIn: function(req, res, next) {
        if (!res.locals.user) {
            return next(new HttpError(401, " Вы не авторизованы "));
        }
        next();
    }
};

