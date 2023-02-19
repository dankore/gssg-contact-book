const handleCSRFTokenError = (err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  res.status(403);
  res.send('<h1>Forbidden</h1>' + '<p>Error: Bad CSRF token</p>' + '<p>We are sorry but we suspected this form submission may not be genuine and have blocked it for security reasons.</p>' + '<p>This error may have occurred if you have been inactive on the page for a while, or if you tried to submit the form using an outdated version of the page. </p>' + '<p>Please go back, refresh the page, and try again. If the problem persists, please contact the site administrator for assistance.</p>');
};

module.exports = handleCSRFTokenError;
