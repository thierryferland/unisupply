exports.asyncAction = (action) => (req, res, next) => action(req, res, next).catch(next)
