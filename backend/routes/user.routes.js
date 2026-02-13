const router = require('express').Router();
const { getProfile, updateProfile, getStats } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // all routes below require auth

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/stats',   getStats);

module.exports = router;
