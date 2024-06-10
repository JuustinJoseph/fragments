const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
} = require('../../src/model/data/memory/index');

describe('WriteFragment Test', () => {
  const fragment = {
    ownerId: 'user',
    id: 'id',
    data: 'Fragment data',
  };
  test('writeFragment() should return UNDEFINED', async () => {
    const result = await writeFragment(fragment);
    expect(result).toBeUndefined();
  });

  test('writeFragment() should update the metadata if already exists', async () => {
    const changedFragment = { ...fragment, data: 'changed fragment data' };

    await writeFragment(fragment);
    await writeFragment(changedFragment);
    const result = await readFragment(fragment.ownerId, fragment.id);
    expect(result).toEqual(changedFragment);
  });

  test('writeFragment() throws on empty or non-string param keys', () => {
    expect(async () => await writeFragment()).rejects.toThrow();
    expect(
      async () => await writeFragment({ ownerId: 1, id: 2, content: 'temp-data' })
    ).rejects.toThrow();
    expect(
      async () => await writeFragment({ ownerId: 1, id: 'id', content: 'temp-data' })
    ).rejects.toThrow();
  });
});

describe('ReadFragment() Test', () => {
  test('readFragment() should return UNDEFINED if metadata does not exist', async () => {
    const result = await readFragment('testing', 'test1');
    expect(result).toBeUndefined();
  });

  test('readFragment() returns expected value when existing key is given', async () => {
    const fragment = {
      ownerId: 'user',
      id: 'id',
      data: 'Fragment data',
    };
    writeFragment(fragment);
    const result = await readFragment(fragment.ownerId, fragment.id);
    expect(result).toEqual({ ...fragment, data: 'Fragment data' });
  });

  test('readFragment() throws on empty or non-string param keys', async () => {
    expect(async () => await readFragment()).rejects.toThrow();
    expect(async () => await readFragment(1)).rejects.toThrow();
    expect(async () => await readFragment(1, 1)).rejects.toThrow();
  });
});

describe('writeFragmentData() Test', () => {
  test('writeFragmentData() throws on non-string keys', async () => {
    expect(async () => await writeFragmentData()).rejects.toThrow();
    expect(async () => await writeFragmentData(1)).rejects.toThrow();
    expect(async () => await writeFragmentData(1, 1)).rejects.toThrow();
  });

  test('writeFragmentData() should return UNDEFINED', async () => {
    const result = await writeFragmentData('user', 'id', 'Fragment data');
    expect(result).toBeUndefined();
  });

  test('writeFragment() should update the data if already exists', async () => {
    await writeFragmentData('user', 'id', 'Fragment data');
    await writeFragmentData('user', 'id', 'test data');
    const result = await readFragmentData('user', 'id');
    expect(result).toEqual('test data');
  });
});

describe('readFragmentData() Test', () => {
  test('readFragmentData() throws on empty or non-string param keys', async () => {
    expect(async () => await readFragmentData()).rejects.toThrow();
    expect(async () => await readFragmentData(1)).rejects.toThrow();
    expect(async () => await readFragmentData(1, 1)).rejects.toThrow();
  });

  test('readFragmentData() should return UNDEFINED if metadata does not exist', async () => {
    const result = await readFragmentData('testing', 'test1');
    expect(result).toBeUndefined();
  });

  test('readFragment() returns expected value when existing key is given', async () => {
    await writeFragmentData('user', 'id', 'Fragment data');
    const result = await readFragmentData('user', 'id');
    expect(result).toEqual('Fragment data');
  });
});
