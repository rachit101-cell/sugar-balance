const router = require('express').Router();
const { getPoints, getPointsHistory, awardPoints } = require('../controllers/points.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/',        getPoints);
router.get('/history', getPointsHistory);
router.post('/award',  awardPoints);

module.exports = router;
