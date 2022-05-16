module.exports = (req, res, next) => {
    if (!req.session.account.firsttime) {
        return next();
    }
    return res.redirect('/changePassword');
    // Account.findOne(req.session.account.username).then(account => {
    //     if (account.firsttime) {
    //         return res.redirect('/changePassword');
    //     } else {
    //         next();
    //     }
    // })
}