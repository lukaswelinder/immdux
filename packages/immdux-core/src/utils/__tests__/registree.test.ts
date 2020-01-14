import { RegisTree } from '../registree';

describe('RegisTree', () => {
  it('is an empty array-like iterable by default', () => {
    const registry = new RegisTree();
    const iterable = [...registry];
    expect(iterable).toEqual([]);
  });

  it('supports adding values at any level (including root) w/ `.register()` method', () => {
    const registry = new RegisTree();
    registry.register([], 'hello world');
    registry.register(['hello world'], 'test1');
    registry.register(['hello world', 2], 'test1');
    registry.register(['hello', 'world'], 'test2');
  });

  it('is an iterable that yields `(keyPath: KeyPath, value: any)` for each entry', () => {
    const registry = new RegisTree();
    registry.register([], 'hello world');
    registry.register(['hello world'], 'test1');
    registry.register(['hello world', 2], 'test1');
    registry.register(['hello', 'world'], 'test2');
    const expected = [
      [['hello', 'world'], 'test2'],
      [['hello world', 2], 'test1'],
      [['hello world'], 'test1'],
      [[], 'hello world'],
    ];
    const result = [...registry];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  it('supports adding multiple values per call at any level w/ `.register()` method', () => {
    const registry = new RegisTree();
    registry.register([], 'hello', 'world');
    registry.register(['hello world'], 'test1', 'test2');
    const expected = [
      [['hello world'], 'test1'],
      [['hello world'], 'test2'],
      [[], 'world'],
      [[], 'hello'],
    ];
    const result = [...registry];
    expect(result).toEqual(expect.arrayContaining(expected));
  });

  it('supports removing values at any level (including root) w/ `.remove()` method', () => {
    const registry = new RegisTree();
    registry.register([], 'hello world');
    registry.register(['hello world'], 'test1');
    registry.register(['hello world', 2], 'test1');
    registry.register(['hello', 'world'], 'test2');
    registry.remove(['hello', 'world'], 'test2');
    const expected = [
      [[], 'hello world'],
      [['hello world'], 'test1'],
      [['hello world', 2], 'test1'],
    ];
    expect([...registry]).toEqual(expect.arrayContaining(expected));
  });

  it('supports removing multiple values per call at any level w/ `.remove()` method', () => {
    const registry = new RegisTree();
    registry.register([], 'hello', 'world');
    registry.register(['hello world'], 'test1', 'test2');
    registry.remove([], 'hello', 'world');
    registry.remove(['hello world'], 'test1', 'test2');
    const result = [...registry];
    expect(result).toEqual([]);
  });

  it('returns a scoped instance of the same registry from `.scope()` method', () => {
    const registry = new RegisTree();
    registry.register([], 'hello world');
    registry.register(['hello world'], 'test1');
    registry.register(['hello world', 2], 'test1');
    registry.register(['hello', 'world'], 'test2');
    const scopedRegistry = registry.scope(['hello world']);
    // WARNING: references private member
    expect((scopedRegistry as any).registry).toBe(
      (registry as any).registry.getIn(['hello world']),
    );
  });

  it('iterates scoped instance up to root', () => {
    const registry = new RegisTree();
    registry.register([], 'hello world');
    registry.register(['hello world'], 'test1');
    registry.register(['hello world', 2], 'test1');
    registry.register(['hello'], 'test1');
    registry.register(['hello', 'world'], 'test2');
    const scopedRegistry = registry.scope(['hello', 'world']);
    // WARNING: references private member
    const iteratedScope = [...scopedRegistry];
    expect(iteratedScope[0][0]).toEqual(['hello', 'world']);
    expect(iteratedScope[1][0]).toEqual(['hello']);
  });

  it('supports skipping paths in iteration when constructed w/ `skipPath()` prop', () => {
    const registry = new RegisTree({
      skipPath(path) {
        return path[path.length - 1] === 'hello world';
      },
    });
    registry.register([], 'hello world');
    registry.register(['hello world'], 'test1');
    registry.register(['hello world', 2], 'test1');
    registry.register(['hello', 'world'], 'test2');
    const expected = [
      [['hello', 'world'], 'test2'],
      [[], 'hello world'],
    ];
    const result = [...registry];
    expect(result).toEqual(expected);
  });

  it('supports skipping paths in scoped iteration when constructed w/ `skipPath()` prop', () => {
    const registry = new RegisTree({
      skipPath(path) {
        return path[0] === 'hello' && path[1] === 0 && path[2] === 'world';
      },
    });
    registry.register([], 'root');
    registry.register(['hello'], 'hello');
    registry.register(['hello', 0], 'hello[0]');
    registry.register(['hello', 0, 'world'], 'hello[0].world');
    registry.register(['hello', 0, 'world', 'peace'], 'hello[0].world.peace');
    registry.register(['hello', 0, 'mars'], 'hello[0].mars');
    registry.register(['hello', 0, 'mars', 'bars'], 'hello[0].mars.bars');
    const expected = [
      [['hello', 0, 'mars', 'bars'], 'hello[0].mars.bars'],
      [['hello', 0, 'mars'], 'hello[0].mars'],
      [['hello', 0], 'hello[0]'],
      [['hello'], 'hello'],
      [[], 'root'],
    ];
    const result = [...registry.scope(['hello', 0])];
    expect(result).toEqual(expected);
  });

  it('supports skipping at ancestor paths when constructed w/ `skipPath()` prop', () => {
    const registry = new RegisTree({
      skipPath(path) {
        return path[0] === 'hello' && path[1] === 0; // && path[2] === 'world';
      },
    });
    registry.register([], 'root');
    registry.register(['hello'], 'hello');
    registry.register(['hello', 0], 'hello[0]');
    registry.register(['hello', 0, 'world'], 'hello[0].world');
    registry.register(['hello', 0, 'world', 'peace'], 'hello[0].world.peace');
    registry.register(['hello', 0, 'mars'], 'hello[0].mars');
    registry.register(['hello', 0, 'mars', 'bars'], 'hello[0].mars.bars');
    const expected = [
      // [['hello', 0, 'mars', 'bars'], 'hello[0].mars.bars'],
      // [['hello', 0, 'mars'], 'hello[0].mars'],
      // [['hello', 0], 'hello[0]'],
      [['hello'], 'hello'],
      [[], 'root'],
    ];
    const result = [...registry.scope(['hello', 0, 'world'])];
    expect(result).toEqual(expected);
  });

  it('supports grouping entries at each path w/ `groupPath()` prop', () => {
    const registry = new RegisTree({
      groupPath(path, pathSet) {
        return pathSet.join('');
      },
    });
    registry.register([], 'hello world');
    registry.register(['hello world'], 'test1', 'test2');
    registry.register(['hello', 'world'], 'test2');
    const expected = [
      [['hello', 'world'], 'test2'],
      [['hello world'], 'test1test2'],
      [[], 'hello world'],
    ];
    const result = [...registry];
    expect(result).toEqual(expected);
  });

  it('supports grouping ancestor entries at each path w/ `groupPath()` prop', () => {
    const registry = new RegisTree({
      groupPath(path, pathSet) {
        return pathSet.join('');
      },
    });
    registry.register([], 'root');
    registry.register(['hello'], 'hello', 'world');
    registry.register(['hello', 0, 'world'], 'hello');
    registry.register(['hello', 0, 'world'], 'friend');

    const expected = [
      [['hello', 0, 'world'], 'hellofriend'],
      [['hello'], 'helloworld'],
      [[], 'root'],
    ];
    const result = [...registry.scope(['hello'])];
    expect(result).toEqual(expected);
  });
});
