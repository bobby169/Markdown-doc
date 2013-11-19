var marked = require('marked');
var Util = require('../libs/util');

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  codeClass: 'prettyprint',
  langPrefix: 'lan-'
});

exports.markdown = function (text) {
  return '<div class="markdown-text">' + marked(text || '') + '</div>';
};

exports.formatDate = function (date, friendly) {
  return Util.format_date(date, friendly);
};