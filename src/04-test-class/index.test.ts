import _ from 'lodash';
import {
  BankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  getBankAccount,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initBalance = 999;
    const account = getBankAccount(initBalance);

    expect(account).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toBe(initBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initBalance = 999;
    const account = getBankAccount(initBalance);

    expect(() => account.withdraw(initBalance + 1)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const initBalance = 999;
    const account = getBankAccount(initBalance);
    const toAccount = getBankAccount(0);

    expect(() => account.transfer(initBalance + 1, toAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const initBalance = 999;
    const account = getBankAccount(initBalance);

    expect(() => account.transfer(initBalance, account)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const initBalance = 999;
    const depositAmount = 1;
    const account = getBankAccount(initBalance);

    account.deposit(depositAmount);

    expect(account.getBalance()).toBe(initBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const initBalance = 999;
    const withdrawAmount = 1;
    const account = getBankAccount(initBalance);

    account.withdraw(withdrawAmount);

    expect(account.getBalance()).toBe(initBalance - withdrawAmount);
  });

  test('should transfer money', () => {
    const initBalance = 999;
    const account = getBankAccount(initBalance);
    const toAccount = getBankAccount(0);

    account.transfer(initBalance, toAccount);

    expect(account.getBalance()).toBe(0);
    expect(toAccount.getBalance()).toBe(initBalance);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const initBalance = 999;
    const account = getBankAccount(initBalance);

    const mock = jest.spyOn(_, 'random').mockReturnValue(1);

    const balance = await account.fetchBalance();

    expect(balance).toBe(1);

    mock.mockRestore();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initBalance = 999;
    const account = getBankAccount(initBalance);

    const mock = jest.spyOn(_, 'random').mockReturnValue(1);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(1);

    mock.mockRestore();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const initBalance = 999;
    const account = getBankAccount(initBalance);

    const mock = jest.spyOn(_, 'random').mockReturnValue(0);

    expect(() => account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );

    mock.mockRestore();
  });
});
