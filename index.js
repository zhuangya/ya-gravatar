'use strict';

const debug = require('debug')('ya-gravatar');
const QS = require('qs');
const md5 = require('md5');

module.exports = {
  url: (email, options) => {
    options = options || {};
    debug('#url():', email, options);
    const defaultParams = ['size', 'defaultImage', 'forceDefault', 'rating'];
    const qs = buildQueryString(options, defaultParams);
    debug('#url() qs: %s', qs);

    return buildUrl(hashEmail(email), qs, {
      type: 'avatar',
      ext: options.ext || 'jpg',
      protocol: options.protocol,
      size: options.size
    });
  },

  profileUrl: (email, options) => {
    options = options || {};
    debug('#profileUrl():', email, options);
    let qs = '';
    if (options.ext === 'qr') {
      qs = buildQueryString(options, ['size']);
    }

    debug('#profileUrl() qs: %s', qs);

    return buildUrl(hashEmail(email), qs, {
      type: 'profile',
      ext: options.ext || 'json',
      protocol: options.protocol,
      size: options.size || 80
    });
  }
};

function hashEmail(email) {
  const MD5_REGEXP = /^[0-9a-f]{32}$/;
  email = email.toString().trim().toLowerCase();
  const result = email.match(MD5_REGEXP) ? email : md5(email);
  debug('#hashEmail(): %s => %s', email, result);
  return result;
}

function buildQueryString(options, fields) {
  return QS.stringify(Object.keys(options).filter(key =>
    fields.indexOf(key) > -1
  ).reduce((qsObj, qsItem) => {
    let key = '';
    let value = '';

    switch (qsItem) {
      case 'size':
        key = 's';
        value = Number(options[qsItem]);
        break;
      case 'defaultImage':
        key = 'd';
        value = encodeURIComponent(options[qsItem]);
        break;
      case 'forceDefault':
        if (options[qsItem]) {
          key = 'f';
          value = 'y';
        }
        break;
      case 'rating':
        key = 'r';
        value = options[qsItem];
        break;
      default:
        key = '';
        value = '';
    }

    qsObj[key] = value;
    return qsObj;
  }, {}));
}

function buildUrl(hash, qs, options) {
  let ext = '';
  let type = '';
  let base = '//www.gravatar.com';

  if (options.ext) {
    ext = `.${options.ext}`;
  }

  if (options.protocol === 'http') {
    base = 'http://www.gravatar.com';
  }

  if (options.protocol === 'https') {
    base = 'https://secure.gravatar.com';
  }

  if (options.type === 'avatar') {
    type = '/avatar';
  }

  return `${base}${type}/${hash}${ext}${qs.length ? '?' : ''}${qs}`;
}
