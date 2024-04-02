module.exports = function (url) {
  // verify if the URL is valid
  const urlPattern = /^(http|https):\/\/[^ "]+$/;
  return urlPattern.test(url);
};
