/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
const detectAgent = require('../agent');

describe('Agent utility', () => {
  test('Detect desktop', () => {
    const macAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    expect(detectAgent(macAgent)).toEqual('desktop');
  });

  test('Detect mobile', () => {
    const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
    expect(detectAgent(iphone)).toEqual('mobile');
  });

  test('Detect tablet', () => {
    const ipad = 'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1';
    expect(detectAgent(ipad)).toEqual('tablet');
  });
});
