const express = require('express');
const router = express.Router();
// List videos belonging to current logged in user
router.get('/listProducts', (req, res) => {
    res.render('product/listProducts', { // pass object to listVideos.handlebar
        product: 'List of products'
    });
});
module.exports = router;


//route for the addProduct
router.get('/addProducts', (req, res) => {
    res.render('product/addProducts')
})

// Adds new products from /product/addProducts
router.post('/addProducts', (req, res) => {
    let title = req.body.title;
    let story = req.body.story.slice(0, 1999);
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language.toString();
    let subtitles = req.body.subtitles === undefined ? '' :req.body.subtitles.toString();
    let classification = req.body.classification;
    let userId = req.user.id;

    // Multi-value components return array of strings or undefined
    Video.create({
        title,
        story,
        classification,
        language,
        subtitles,
        dateRelease,
        userId
    }) .then(video => {
        res.redirect('/product/listProducts');
    })
    .catch(err => console.log(err))
});