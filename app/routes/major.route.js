const express = require('express');
const router = express.Router();

const {
    createMajor,
    updateMajor,
    deleteMajor
} = require('../controllers/major.controller');

router.post('/', createMajor);
router.put('/:id', updateMajor);
router.delete('/:id', deleteMajor);

module.exports = router;
