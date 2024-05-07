const router = require('express').Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/auth');

router.get('/:username', userController.getUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.put('/update-password', authenticateToken, userController.updatePassword);
router.put('/update-username', authenticateToken, userController.updateUsername);

module.exports = router;