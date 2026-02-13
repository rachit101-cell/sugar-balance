const router   = require('express').Router();
const { body } = require('express-validator');
const {
  getAllProducts,
  logFood,
  completeCorrectiveAction,
  getHistory,
} = require('../controllers/food.controller');
const { protect }  = require('../middleware/auth.middleware');
const validate     = require('../middleware/validate.middleware');

router.get('/products', getAllProducts); // public — no auth needed

router.use(protect);

// GET  /api/food/history
router.get('/history', getHistory);

// POST /api/food/log
router.post(
  '/log',
  [
    body('item').notEmpty().withMessage('Item name required'),
    body('brix').isNumeric().withMessage('Brix must be a number'),
    body('sugarLevel').isIn(['Low', 'Medium', 'High']).withMessage('Invalid sugar level'),
  ],
  validate,
  logFood
);

// POST /api/food/log/:id/corrective
router.post(
  '/log/:id/corrective',
  [body('type').isIn(['Walk', 'Exercise', 'Hydration']).withMessage('Invalid action type')],
  validate,
  completeCorrectiveAction
);

module.exports = router;
