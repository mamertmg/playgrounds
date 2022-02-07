const express = require('express');
const router = express.Router();
const asyncWrapper = require('../utils/asyncWrapper');
const { validatePlayground } = require('../middlewares/validation');
const playgroundController = require('../controllers/playground.controller');

router
    .route('/')
    .get((req, res) => {
        res.render('base/playgrounds');
    })
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
