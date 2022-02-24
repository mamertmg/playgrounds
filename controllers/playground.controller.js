const Playground = require('../models/playground.model');

function preprocessInput(inputObj) {
    const location = {
        type: 'Point',
        coordinates: [inputObj.lng, inputObj.lat],
    };
    const playgroundObj = inputObj;
    delete playgroundObj.lng;
    delete playgroundObj.lat;
    playgroundObj.location = location;
    return playgroundObj;
}

module.exports.renderNewFrom = async (req, res, next) => {
    Playground.distinct('type', function (err, types) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            res.render('playgrounds/form', {
                actionType: 'Add',
                actionDest: '/playgrounds',
                types,
            });
        }
    });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findById(id);
    if (!playground) {
        req.flash('failure', 'Could not find playground.');
        return res.redirect('/');
    }
    Playground.distinct('type', function (err, types) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            res.render('playgrounds/form', {
                actionType: 'Edit',
                actionDest: `/playgrounds/${playground._id}?_method=put`,
                types,
                playground,
            });
        }
    });
};

module.exports.createPlayground = async (req, res) => {
    const values = preprocessInput(req.body.playground);
    const playground = new Playground(values);
    await playground.save();
    req.flash('success', 'Added a new playground!');
    res.redirect(`/playgrounds/${playground._id}`);
};

module.exports.showPlayground = async (req, res) => {
    const { id } = req.params;
    const { eventId } = req.query;
    const playground = await Playground.findById(id).populate('events');
    if (!playground) {
        req.flash('failure', 'Could not find playground.');
        return res.redirect('/');
    }

    // TODO: additional check if eventID valid?
    if(!eventId) {
        return res.render('detailpage', { playground, eventDetailId: '' });
    }
    res.render('detailpage', { playground, eventDetailId: eventId });
};

module.exports.updatePlayground = async (req, res) => {
    const { id } = req.params;
    const values = preprocessInput(req.body.playground);
    const playground = await Playground.findByIdAndUpdate(id, {
        ...values,
    });
    req.flash('success', 'Updated playground!');
    res.redirect(`/playgrounds/${playground._id}`);
};

module.exports.deletePlayground = async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findById(id);
    if (!playground) {
        req.flash('failure', 'Could not find playground.');
        return res.redirect('/');
    }
    await playground.deleteOne();
    res.redirect('/');
};
