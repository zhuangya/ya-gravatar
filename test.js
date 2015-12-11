'use strict';

const gravatar = require('./');
const assert = require('assert');

describe('#url()', () => {
  it('should return correct url when give email', () => {
    assert.equal(gravatar.url('zhuangya@gmail.com'), '//www.gravatar.com/avatar/28fd8a8e2c913c2d19cc2f6c2b2cbeee.jpg');
  });

  it('should return correct url when give hashed result', () => {
    assert.equal(gravatar.url('28fd8a8e2c913c2d19cc2f6c2b2cbeee'), '//www.gravatar.com/avatar/28fd8a8e2c913c2d19cc2f6c2b2cbeee.jpg');
  });

  it('should handle options properly', () => {
    assert.equal(
      gravatar.url('zhuangya@gmail.com', {
        size: 123,
        defaultImage: true,
        forceDefault: true,
        rating: 'g'
      }), '//www.gravatar.com/avatar/28fd8a8e2c913c2d19cc2f6c2b2cbeee.jpg?s=123&d=true&f=y&r=g'
    );
  });
});

describe('#profileUrl', () => {
  it('should return profile url when give email', () => {
    assert.equal(gravatar.profileUrl('zhuangya@gmail.com'), '//www.gravatar.com/28fd8a8e2c913c2d19cc2f6c2b2cbeee.json');
  });
  it('should be able to generate different size of qrcode when format set to `qr`', () => {
    assert.equal(
      gravatar.profileUrl('zhuangya@gmail.com', {
        ext: 'qr',
        size: 678
      }), '//www.gravatar.com/28fd8a8e2c913c2d19cc2f6c2b2cbeee.qr?s=678'
    );
  });
  it('should return different data format when use different `ext`', () => {
    ['json', 'xml', 'php', 'vcf', 'qr'].forEach(ext => {
      assert.equal(
        gravatar.profileUrl('zhuangya@gmail.com', {
          ext
        }), `//www.gravatar.com/28fd8a8e2c913c2d19cc2f6c2b2cbeee.${ext}`
      );
    });
  });
});
