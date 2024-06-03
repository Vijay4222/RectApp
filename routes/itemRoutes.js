const express = require('express');
const itemController = require('../controllers/itemController');
const { authenticate, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.post('/', authenticate, upload.single('image'), itemController.createItem);
router.put('/:id', authenticate, authorize(['admin', 'user']), itemController.updateItem);
router.delete('/:id', authenticate, authorize(['admin', 'user']), itemController.deleteItem);

module.exports = router;
