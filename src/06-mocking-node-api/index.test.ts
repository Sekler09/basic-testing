import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';

const cb = jest.fn();
const timeout = 1000;
const pathToFile = 'example.txt';
const fileContent = 'Hello world!';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const spy = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(cb, timeout);

    expect(spy).toHaveBeenCalledWith(cb, timeout);
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(cb, timeout);

    expect(cb).toHaveBeenCalledTimes(0);
    jest.advanceTimersToNextTimer();
    expect(cb).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const spy = jest.spyOn(global, 'setInterval');
    doStuffByInterval(cb, timeout);

    expect(spy).toHaveBeenCalledWith(cb, timeout);
  });

  test('should call callback multiple times after multiple intervals', () => {
    doStuffByInterval(cb, timeout);

    expect(cb).toHaveBeenCalledTimes(0);
    jest.advanceTimersToNextTimer();
    expect(cb).toHaveBeenCalled();
    jest.advanceTimersToNextTimer();
    expect(cb).toHaveBeenCalled();
    jest.advanceTimersToNextTimer();
    expect(cb).toHaveBeenCalled();
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const spy = jest.spyOn(path, 'join');

    await readFileAsynchronously(pathToFile);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const mock = jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    await expect(readFileAsynchronously(pathToFile)).resolves.toBeNull();

    mock.mockRestore();
  });

  test('should return file content if file exists', async () => {
    const mockExist = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const mockRead = jest
      .spyOn(fsPromises, 'readFile')
      .mockReturnValue(Promise.resolve(fileContent));

    await expect(readFileAsynchronously(pathToFile)).resolves.toBe(fileContent);

    mockExist.mockRestore();
    mockRead.mockRestore();
  });
});
