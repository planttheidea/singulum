import expect from 'expect';
import singulum from './src';

import Singulum, {
  SingulumActions,
  SingulumSnapshot,
  SingulumStore
} from './src/Singulum';

const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

const actions = {
  counter: {
    addToCounter(counter) {
      counter++;

      return counter;
    },
    subtractFromCounter(counter) {
      counter--;

      return counter;
    }
  },
  list: {
    addToList(list, value) {
      return [
        ...list,
        value
      ];
    },
    removeFromList(list, index) {
      return [
        ...list.slice(0, index),
        ...list.slice(index + 1, index.length)
      ];
    }
  },
  map: {
    addToMap(map, objectToMerge) {
      return {
        ...map,
        ...objectToMerge
      };
    },
    removeFromMap(map, key) {
      const cleanMap = {...map};

      delete cleanMap[key];

      return cleanMap;
    }
  },
  wholeStore(store = {}, action) {
    let func;

    switch (action.item) {
      case 'counter':
        if (action.type === 'add') {
          func = this.counter.addToCounter;
        } else if (action.type === 'subtract') {
          func = this.counter.subtractFromCounter;
        }

        if (!func) {
          return store;
        }

        return {
          ...store,
          counter: func(store.counter)
        };

      case 'list':
        if (action.type === 'add') {
          func = this.list.addToList;
        } else if (action.type === 'remove') {
          func = this.list.removeFromList;
        }

        if (!func) {
          return store;
        }

        return {
          ...store,
          list: func(store.list)
        };

      case 'map':
        if (action.type === 'add') {
          func = this.map.addToMap;
        } else if (action.type === 'remove') {
          func = this.map.removeFromMap;
        }

        if (!func) {
          return store;
        }

        return {
          ...store,
          map: func(store.map)
        };

      default:
        return store;
    }
  }
};

const store = {
  counter: 0,
  list: [],
  map: {}
};

// constructor
expect(singulum).toBeA(Singulum);

const branch = singulum.branch(actions, store, 'testBranch');
const branchActions = branch.actions;
const initialBranchStore = branch.store;

// actions creation
if (isProduction()) {
  expect(branchActions).toBeA(Object);
} else {
  expect(branchActions).toBeA(SingulumActions);
}

let actionCount = 0;

for (let key in branchActions) {
  expect(branchActions[key]).toBeA(Function);
  actionCount++;
}

expect(actionCount).toEqual(7);

// store creation
if (isProduction()) {
  expect(initialBranchStore).toBeA(Object);
} else {
  expect(initialBranchStore).toBeA(SingulumStore);
}

expect(initialBranchStore.counter).toBe(0);
expect(initialBranchStore.list).toEqual([]);
expect(initialBranchStore.map).toEqual({});

if (isProduction()) {
  expect(initialBranchStore).toEqual(branch.$$store);
} else {
  expect(initialBranchStore).toNotEqual(branch.$$store);
}

// store updates
branchActions.addToCounter();
expect(branch.store.counter).toBe(1);
branchActions.addToCounter();
expect(branch.store.counter).toBe(2);
branchActions.subtractFromCounter();
expect(branch.store.counter).toBe(1);

branchActions.addToList('foo');
expect(branch.store.list).toEqual(['foo']);
branchActions.addToList('bar');
expect(branch.store.list).toEqual(['foo', 'bar']);
branchActions.removeFromList(0);
expect(branch.store.list).toEqual(['bar']);

branchActions.addToMap({foo: 'bar'});
expect(branch.store.map).toEqual({foo: 'bar'});
branchActions.addToMap({test: 'me'});
expect(branch.store.map).toEqual({foo: 'bar', test: 'me'});
branchActions.removeFromMap('foo');
expect(branch.store.map).toEqual({test: 'me'});

let branchComparator = {
  counter: 1,
  list: ['bar'],
  map: {test: 'me'}
};

if (!isProduction()) {
  branchComparator = new SingulumStore(branchComparator);
}

expect(branch.store).toEqual(branchComparator);

// equals
expect(branch.equals(branchComparator)).toBe(true);
expect(branch.equals({
  counter: 1,
  list: ['bar'],
  map: {test: 'me'}
})).toBe(true);
expect(branch.equals({})).toBe(false);

const duplicateBranch = singulum.branch({...actions}, {...store}, 'duplicateBranch');

duplicateBranch.actions.addToCounter();
duplicateBranch.actions.addToList('bar');
duplicateBranch.actions.addToMap({test: 'me'});

expect(branch.equals(duplicateBranch)).toBe(true);

// hashCode
expect(branch.hashCode()).toEqual(duplicateBranch.hashCode());

duplicateBranch.actions.addToCounter();
expect(branch.hashCode()).toNotEqual(duplicateBranch.hashCode());
duplicateBranch.actions.subtractFromCounter();
expect(branch.hashCode()).toEqual(duplicateBranch.hashCode());

duplicateBranch.actions.addToList('foo');
expect(branch.hashCode()).toNotEqual(duplicateBranch.hashCode());
duplicateBranch.actions.removeFromList(1);
expect(branch.hashCode()).toEqual(duplicateBranch.hashCode());

duplicateBranch.actions.addToMap({foo: 'bar'});
expect(branch.hashCode()).toNotEqual(duplicateBranch.hashCode());
duplicateBranch.actions.removeFromMap('foo');
expect(branch.hashCode()).toEqual(duplicateBranch.hashCode());

// snapshotting
const snapshot = branch.snapshot();
const snapshotComparator = new SingulumSnapshot(branch.store, branch.$$store);

expect(snapshot).toBeA(SingulumSnapshot);
expect(snapshot).toEqual(snapshotComparator);
expect(snapshot.counter).toBe(1);
expect(snapshot.list).toEqual(['bar']);
expect(snapshot.map).toEqual({test: 'me'});

// resetting
branch.reset();

const resetComparator = isProduction() ? {
  counter: 0,
  list: [],
  map: {}
} : initialBranchStore;

expect(branch.store).toEqual(resetComparator);
expect(branch.store.counter).toBe(0);
expect(branch.store.list).toEqual([]);
expect(branch.store.map).toEqual({});

// restoring
branch.restore(snapshot);

expect(branch.store).toEqual(branchComparator);
expect(branch.store.counter).toBe(1);
expect(branch.store.list).toEqual(['bar']);
expect(branch.store.map).toEqual({test: 'me'});

// watch
const storeCheckers = {
  counterStoreWatchSpy(store) {},
  counterStoreUnwatchSpy(store) {}
};

const counterUpdateWatchSpy = expect.spyOn(storeCheckers, 'counterStoreWatchSpy');
const counterUpdateUnwatchSpy = expect.spyOn(storeCheckers, 'counterStoreUnwatchSpy');

branch.watch(storeCheckers.counterStoreWatchSpy);
branch.watch(storeCheckers.counterStoreUnwatchSpy);

branch.actions.addToCounter();

expect(counterUpdateWatchSpy).toHaveBeenCalled();
expect(counterUpdateWatchSpy).toHaveBeenCalledWith(branch.store);
expect(counterUpdateUnwatchSpy).toHaveBeenCalled();
expect(counterUpdateUnwatchSpy).toHaveBeenCalledWith(branch.store);

// unwatch
branch.unwatch(storeCheckers.counterStoreUnwatchSpy);

branch.actions.addToCounter();

let watchBranchComparator = {
      counter: 3,
      list: ['bar'],
      map: {test: 'me'}
    },
    unwatchBranchComparator = {
      counter: 2,
      list: ['bar'],
      map: {test: 'me'}
    };

if (!isProduction()) {
  watchBranchComparator = new SingulumStore(watchBranchComparator);
  unwatchBranchComparator = new SingulumStore(unwatchBranchComparator);
}

expect(counterUpdateWatchSpy.calls.length).toBe(2);
expect(counterUpdateWatchSpy.calls[0].arguments).toEqual([unwatchBranchComparator]);
expect(counterUpdateWatchSpy.calls[1].arguments).toEqual([watchBranchComparator]);
expect(counterUpdateUnwatchSpy.calls.length).toBe(1);
expect(counterUpdateUnwatchSpy.calls[0].arguments).toEqual([unwatchBranchComparator]);

console.log(`All ${process.env.NODE_ENV} tests have run successfully.`);