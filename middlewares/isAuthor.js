const Playground = require('../models/playground.model')

module.exports = {
    isAuthor: async (req, res, next) => {
    const { id } = req.params;
    const playground = await Playground.findById(id);
    if (!playground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/playgrounds/${id}`);
    }
    next();
}}