const Playground = require('../models/playground.model');
const {
    playgroundLabels,
    playgroundEquipment,
    labelToIcon,
} = require('../utils/labels');
const { numToMonth, numToDay } = require('../utils/utils');
const { cloudinary } = require('../config/cloudinaryStorage');

function preprocessInput(inputObj) {
    // convert coordinates to GEOJSON format
    const location = {
        type: 'Point',
        coordinates: [inputObj.lng, inputObj.lat],
    };
    const playgroundObj = inputObj;
    delete playgroundObj.lng;
    delete playgroundObj.lat;
    playgroundObj.location = location;

    // field 'labels' does not exist if user deselected all tags
    if (!inputObj.labels) {
        playgroundObj.labels = [];
    }
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
                playgroundLabels,
                playgroundEquipment,
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
                playgroundLabels,
                playgroundEquipment,
            });
        }
    });
};

module.exports.createPlayground = async (req, res) => {
    const values = preprocessInput(req.body.playground);
    const playground = new Playground(values);
    playground.author = req.user._id;
    await playground.save();
    req.flash('success', 'Added a new playground!');
    res.redirect(`/playgrounds/${playground._id}`);
};

module.exports.showPlayground = async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findById(id)
        .populate({
            path: 'events',
            options: { sort: [{ date: 'asc' }] },
        })
        .populate({
            path: 'reviews',
            options: { sort: [{ createdAt: 'desc' }] },
        })
        .populate({
            path: 'lost_found',
            options: { sort: [{ date: 'desc' }] },
        });
    if (!playground) {
        req.flash('failure', 'Could not find playground.');
        return res.redirect('/');
    }

    res.render('detailpage', {
        playground,
        labelToIcon,
        numToDay,
        numToMonth,
    });
};

module.exports.updatePlayground = async (req, res) => {
    const { id } = req.params;
    const values = preprocessInput(req.body.playground);
    const playground = await Playground.findByIdAndUpdate(id, {
        ...values,
    });
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await playground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    req.flash('success', 'Updated playground!');
    res.redirect(`/playgrounds/${playground._id}`);
};

module.exports.deletePlayground = async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findByIdAndDelete(id);
    if (!playground) {
        req.flash('failure', 'Could not find playground.');
        return res.redirect('/');
    }
    res.redirect('/');
};
