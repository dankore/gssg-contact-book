// error-handlers.js
module.exports = function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  res.status(403);
  res.send(`
    <p>Error: Bad CSRF token</p>
    <p>
      We are so sorry but we suspected this form...
  `);
};
