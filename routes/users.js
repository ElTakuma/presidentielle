let express = require('express');
let router = express.Router();
const user = require('../controllers/user.controller')

/* GET users listing. */
router.get('/', user.findAll);
router.post('/add', user.create);
router.get('/edit/:id', user.edit);
router.post('/update/:id', user.update);
router.get('/show/:id', user.show);
router.post('/upload/:id', user.upload);
router.get('/exitcourse/:id', user.removeCandidate);
router.get('/confirm/:id', user.confirmCandidate);

module.exports = router;
