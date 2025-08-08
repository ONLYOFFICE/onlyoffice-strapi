/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import jwt from '../jwt';
import jsonwebtoken from 'jsonwebtoken';

const storeSet = jest.fn();
global.strapi = {
  dirs: {
    public: 'publicDir',
  },
  config: {
    get: () => ({ provider: 'local' }),
  },
  plugin: () => ({
    service: () => ({
      getSettings: (key) => global.strapi.store().get().editor[key]
    }),
  }),
  store: () => ({
    get: () => ({
      editor: {
        dsURL: 'https://example.com',
        dsSecret: 'secret',
      },
    }),
    set: storeSet,
  }),
};

describe('JWT service', () => {
  const service = jwt({ strapi: global.strapi });
  test('Generate a new JWT with dsSecret', () => {
    const secret = global.strapi.plugin().service().getSettings('dsSecret');
    const token = jsonwebtoken.sign({ ok: true }, secret, { expiresIn: '1h' });
    expect(token).toBeDefined();
  });
  test('Validate a document server signed token', async () => {
    const secret = global.strapi.plugin().service().getSettings('dsSecret');
    const token = jsonwebtoken.sign({ ok: true }, secret, { expiresIn: '1h' });
    expect(await service.verifyDocumentServerToken(token)).toBeDefined();
  });
  test('Validate an invalid document server jwt', async () => {
    const token = jsonwebtoken.sign({ ok: true }, 'invalid', { expiresIn: '1h' });
    try {
      expect(await service.verifyDocumentServerToken(token)).toThrow();
    } catch (e) {
      expect(e.message).toBe('invalid signature');
    }
  });
});
