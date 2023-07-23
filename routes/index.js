const router = require('express').Router();
const apiRoutes = require('./api');

route.use('/api', apiRoutes);

route.use((req, res) => {
    return res.send('Wrong route!')
});

module.exports = router;