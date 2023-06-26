import stringTools from '@/utils/base/string-tools.js';

test('string-tools test trim', () => {
  // Trim
  let dealedStr = stringTools.Trim('$$abcd$', '$');
  expect(dealedStr).toEqual('abcd');

  dealedStr = stringTools.Trim('\\\\abcd\\\\', '\\');
  expect(dealedStr).toEqual('abcd');

  dealedStr = stringTools.Trim('?abcd???', '?');
  expect(dealedStr).toEqual('abcd');

  dealedStr = stringTools.Trim('bcabcdbcbc', 'bc');
  expect(dealedStr).toEqual('abcd');

  // lTrim
  dealedStr = stringTools.lTrim('$$abcd$', '$');
  expect(dealedStr).toEqual('abcd$');

  dealedStr = stringTools.lTrim('\\\\abcd\\\\', '\\');
  expect(dealedStr).toEqual('abcd\\\\');

  dealedStr = stringTools.lTrim('?abcd???', '?');
  expect(dealedStr).toEqual('abcd???');

  dealedStr = stringTools.lTrim('bcabcdbcbc', 'bc');
  expect(dealedStr).toEqual('abcdbcbc');

  // rTrim
  dealedStr = stringTools.rTrim('$$abcd$', '$');
  expect(dealedStr).toEqual('$$abcd');

  dealedStr = stringTools.rTrim('\\\\abcd\\\\', '\\');
  expect(dealedStr).toEqual('\\\\abcd');

  dealedStr = stringTools.rTrim('?abcd???', '?');
  expect(dealedStr).toEqual('?abcd');

  dealedStr = stringTools.rTrim('bcabcdbcbc', 'bc');
  expect(dealedStr).toEqual('bcabcd');
});
