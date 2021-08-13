//authentication middleware
function isAuthenticated(req, res, next) {

    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/sign-in')
}

module.exports = isAuthenticated