const res = require('express/lib/response');

const index = (req, res) => {
  res.render('index', { title: 'Travlr Getaways' });
};

module.exports = {
  index,
};