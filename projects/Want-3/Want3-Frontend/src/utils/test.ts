import { addWant, donateFund } from './index';

describe('Your File Tests', () => {
  test('addWant should add a wish', async () => {
    // 测试代码
    const who = '0x1234567890abcdef1234567890abcdef12345678'; // 替换为有效的地址
    const targetGoods = '0xabcdef1234567890abcdef1234567890abcdef12'; // 替换为有效的地址

    await addWant(who, targetGoods);
  });

  test('donateFund should donate funds and return success', async () => {
    // 测试代码
    // new addWant()
  });
});
