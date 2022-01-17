let express = require('express');
let router = express.Router();
const user = require('../controllers/user.controller')

/* GET users listing. */
router.get('/', user.findAll);
router.post('/add', user.create);
router.get('/edit/:id', user.edit);
router.post('/update/:id', user.update);

module.exports = router;
