import { sleep } from 'delounce';
import pumpRequests from '../src/index';

test('pumpRequests should create resolve single calls with correct reply', async () => {
  const checkFavourite = pumpRequests(async (ids) => {
    await sleep(10);
    return {
      5: 'some',
      10: 'another'
    };
  });
  await sleep(2);

  const x = await checkFavourite(5);
  expect(x).toBe('some');
});

test('pumpRequests should collect all ids with which fn was invoked', async () => {
  let args;
  const checkFavourite = pumpRequests(async (ids) => {
    args = ids;
    await sleep(10);
    return {
      5: 'some',
      10: 'another'
    };
  });
  await sleep(2);

  await Promise.all([
    checkFavourite(5),
    checkFavourite(10)
  ]);

  expect(args).toEqual([5, 10]);
});
