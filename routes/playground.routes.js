const express = require('express');
const router = express.Router();
const asyncWrapper = require('../utils/asyncWrapper');
const { validatePlayground } = require('../middlewares/validation');
const playgroundController = require('../controllers/playground.controller');
const Playground = require('../models/playground.model');

router
    .route('/')
    .get(
        asyncWrapper(async (req, res) => {
            const playgrounds = await Playground.find({});
            res.render('base/playgrounds', { playgrounds });
        })
    )
    .post(asyncWrapper(playgroundController.createPlayground));

router.get('/new', playgroundController.renderNewFrom);

router
    .route('/:id')
    .get(asyncWrapper(playgroundController.showPlayground))
    .put(
        validatePlayground,
        asyncWrapper(playgroundController.updatePlayground)
    )
    .delete(asyncWrapper(playgroundController.deletePlayground));

router.get('/:id/edit', asyncWrapper(playgroundController.renderEditForm));

module.exports = router;
