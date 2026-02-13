const router = require('express').Router();
const { getReportCard } = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getReportCard);

module.exports = router;
