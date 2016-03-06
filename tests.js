import expect from 'expect';
import {
  createExpect
} from 'expect-async';
import singulum from './src';

import Singulum, {
  SingulumActions,
  SingulumSnapshot,
  SingulumStore
} from './src/Singulum';

const isProduction = process.env.NODE_ENV === 'production';

console.log('Initializing tests...');

const actions = {
  async(store = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({...store});
      }, 5000);
    });
  },
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

let actionCount = 0;

const buildActionCount = (actions) => {
  for (let actionKey in actions) {
    const action = actions[actionKey];

    if (action instanceof Function) {
      actionCount++;
    } else {
      buildActionCount(action);
    }
  }
};

buildActionCount(actions);

const store = {
  counter: 0,
  list: [],
  map: {}
};

const nestedActions = {
  string: {
    addToString(string, append) {
      if (string.length) {
        return `${string} ${append}`;
      }

      return append;
    },
    resetString() {
      return '';
    }
  }
};

const nestedStore = {
  string: ''
};

const catchError = (err) => {
  setTimeout(() => {
    console.error(err.stack);
    process.exit(1);
  }, 1);
};

const IS_FROZEN = Object.isFrozen;

new Promise((resolve) => {
    // constructor
    expect(singulum).toBeA(Singulum);
    
    const branch = singulum.branch(actions, store, 'testBranch');
    const nestedBranch = branch.branch(nestedActions, nestedStore, 'nestedBranch');
  
    console.log('=> Singulum constructor and function .branch() tests were successful.');
    
    resolve({
      branch,
      nestedBranch
    });
  })
  .then(({branch, nestedBranch}) => {
    // actions creation
    const branchActions = branch.actions;
    const nestedBranchActions = nestedBranch.actions

    if (isProduction) {
      expect(branchActions).toBeA(Object);
      expect(IS_FROZEN(branchActions)).toBe(false);
      expect(nestedBranchActions).toBeA(Object);
      expect(IS_FROZEN(nestedBranchActions)).toBe(false);
    } else {
      expect(branchActions).toBeA(SingulumActions);
      expect(IS_FROZEN(branchActions)).toBe(true);
      expect(nestedBranchActions).toBeA(SingulumActions);
      expect(IS_FROZEN(branchActions)).toBe(true);
    }

    expect(actionCount).toEqual(8);

    console.log('=> Actions creation tests were successful.');
    
    return {
      branch,
      nestedBranch
    };
  })
  .then(({branch, nestedBranch}) => {
    // store creation
    const initialBranchStore = branch.store;
    const initialNestedBranchStore = nestedBranch.store;

    if (isProduction) {
      expect(initialBranchStore).toBeA(Object);
      expect(IS_FROZEN(initialBranchStore)).toBe(false);
      expect(initialNestedBranchStore).toBeA(Object);
      expect(IS_FROZEN(initialNestedBranchStore)).toBe(false);
    } else {
      expect(initialBranchStore).toBeA(SingulumStore);
      expect(IS_FROZEN(initialBranchStore)).toBe(true);
      expect(initialNestedBranchStore).toBeA(SingulumStore);
      expect(IS_FROZEN(initialNestedBranchStore)).toBe(true);
    }

    expect(initialBranchStore.counter).toBe(0);
    expect(initialBranchStore.list).toEqual([]);
    expect(initialBranchStore.map).toEqual({});

    expect(initialNestedBranchStore.string).toBe('');

    if (isProduction) {
      expect(initialBranchStore).toEqual(branch.store);
      expect(initialNestedBranchStore).toEqual(nestedBranch.store);
    } else {
      expect(initialBranchStore).toNotEqual(branch.$$store);
      expect(initialNestedBranchStore).toNotEqual(nestedBranch.$$store);
    }

    console.log('=> Store creation tests were successful.');
    
    return {
      branch,
      initialBranchStore,
      initialNestedBranchStore,
      nestedBranch
    };
  })
  .then(({branch, initialBranchStore, nestedBranch}) => {
    // store updates
    const branchActions = branch.actions;
    
    expect(branchActions.addToCounter()).toBeA(Promise);
    expect(branch.store.counter).toBe(1);
    branchActions.addToCounter();
    expect(branch.store.counter).toBe(2);
    expect(branchActions.subtractFromCounter()).toBeA(Promise);
    expect(branch.store.counter).toBe(1);

    expect(branchActions.addToList('foo')).toBeA(Promise);
    expect(branch.store.list).toEqual(['foo']);
    branchActions.addToList('bar');
    expect(branch.store.list).toEqual(['foo', 'bar']);
    expect(branchActions.removeFromList(0)).toBeA(Promise);
    expect(branch.store.list).toEqual(['bar']);

    expect(branchActions.addToMap({foo: 'bar'})).toBeA(Promise);
    expect(branch.store.map).toEqual({foo: 'bar'});
    branchActions.addToMap({test: 'me'});
    expect(branch.store.map).toEqual({foo: 'bar', test: 'me'});
    expect(branchActions.removeFromMap('foo')).toBeA(Promise);
    expect(branch.store.map).toEqual({test: 'me'});

    let branchComparator = new SingulumStore({
      counter: 1,
      list: ['bar'],
      map: {test: 'me'},
      nestedBranch: new SingulumStore({
        string: ''
      })
    });

    expect(branch.store).toEqual(branchComparator);

    console.log('=> Store update via action tests were successful.');
    
    return {
      branch,
      branchComparator,
      initialBranchStore,
      nestedBranch
    };
  })
  .then(({branch, branchComparator, initialBranchStore, nestedBranch}) => {
    // equals
    expect(branch.equals(branchComparator)).toBe(true);
    expect(branch.equals({
      counter: 1,
      list: ['bar'],
      map: {test: 'me'},
      nestedBranch: {
        string: ''
      }
    })).toBe(true);
    expect(branch.equals({})).toBe(false);

    const duplicateBranch = singulum.branch({...actions}, {...store}, 'duplicateBranch');

    duplicateBranch.branch({...nestedActions}, {...nestedStore}, 'nestedBranch');

    duplicateBranch.actions.addToCounter();
    duplicateBranch.actions.addToList('bar');
    duplicateBranch.actions.addToMap({test: 'me'});

    expect(branch.equals(duplicateBranch)).toBe(true);

    console.log('=> Function .equals() tests were successful.');
    
    return {
      branch,
      branchComparator,
      duplicateBranch,
      initialBranchStore,
      nestedBranch
    };
  })
  .then(({branch, branchComparator, duplicateBranch, initialBranchStore, nestedBranch}) => {
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

    console.log('=> Function .hashCode() tests were successful.');
    
    return {
      branch,
      branchComparator,
      initialBranchStore,
      nestedBranch
    };
  })
  .then(({branch, branchComparator, initialBranchStore, nestedBranch}) => {
    // snapshot
    const snapshot = branch.snapshot();
    const snapshotComparator = new SingulumSnapshot(branch.store, branch.$$store);

    expect(snapshot).toBeA(SingulumSnapshot);
    expect(snapshot).toEqual(snapshotComparator);
    expect(snapshot.counter).toBe(1);
    expect(snapshot.list).toEqual(['bar']);
    expect(snapshot.map).toEqual({test: 'me'});
    expect(snapshot.nestedBranch.store.string).toEqual('');

    nestedBranch.actions.addToString('test');

    const snapshotDeep = branch.snapshot(true);
    const snapshotDeepComparator = new SingulumSnapshot(branch.store, branch.$$store, true);

    expect(snapshotDeep).toBeA(SingulumSnapshot);
    expect(snapshotDeep).toEqual(snapshotDeepComparator);
    expect(snapshotDeep.nestedBranch.string).toEqual('test');

    console.log('=> Function .snapshot() tests were successful.');
    
    return {
      branch,
      branchComparator,
      initialBranchStore,
      nestedBranch,
      snapshot,
      snapshotDeep
    };
  })
  .then(({branch, branchComparator, initialBranchStore, nestedBranch, snapshot, snapshotDeep}) => {
    // resetting
    branch.reset();

    const resetComparator = new SingulumStore({
      counter: 0,
      list: [],
      map: {},
      nestedBranch: new SingulumStore({
        string: 'test'
      })
    });
    const resetDeepComparator = new SingulumStore({
      counter: 0,
      list: [],
      map: {},
      nestedBranch: new SingulumStore({
        string: ''
      })
    });

    expect(branch.store).toEqual(resetComparator);
    expect(branch.store.counter).toBe(0);
    expect(branch.store.list).toEqual([]);
    expect(branch.store.map).toEqual({});
    expect(branch.store.nestedBranch.string).toEqual('test');

    branch.reset(true);

    expect(branch.store).toEqual(resetDeepComparator);
    expect(branch.store.counter).toBe(0);
    expect(branch.store.list).toEqual([]);
    expect(branch.store.map).toEqual({});
    expect(branch.store.nestedBranch.string).toEqual('');

    console.log('=> Function .reset() tests were successful.');
    
    return {
      branch,
      branchComparator,
      nestedBranch,
      resetComparator,
      resetDeepComparator,
      snapshot,
      snapshotDeep
    }
  })
  .then(({branch, branchComparator, nestedBranch, resetComparator, resetDeepComparator, snapshot, snapshotDeep}) => {
    // restoring
    branch.restore(snapshot);

    expect(branch.store).toEqual(branchComparator);
    expect(branch.store.counter).toBe(1);
    expect(branch.store.list).toEqual(['bar']);
    expect(branch.store.map).toEqual({test: 'me'});
    expect(branch.store.nestedBranch.string).toEqual('');

    branch.reset();

    expect(branch.store).toEqual(resetDeepComparator);
    expect(branch.store.counter).toBe(0);
    expect(branch.store.list).toEqual([]);
    expect(branch.store.map).toEqual({});
    expect(branch.store.nestedBranch.string).toEqual('');

    branch.restore(snapshotDeep, true);

    const restoreDeepComparator = new SingulumStore({
      counter: 1,
      list: ['bar'],
      map: {test: 'me'},
      nestedBranch: new SingulumStore({
        string: 'test'
      })
    });

    expect(branch.store).toEqual(restoreDeepComparator);
    expect(branch.store.counter).toBe(1);
    expect(branch.store.list).toEqual(['bar']);
    expect(branch.store.map).toEqual({test: 'me'});
    expect(branch.store.nestedBranch.string).toEqual('test');

    console.log('=> Function .restore() tests were successful.');
    
    return {
      branch
    };
  })
  .then(({branch}) => {
    // watch
    const storeCheckers = {
      asyncWatch(store) {
        expect(store).toEqual(branch.store);
      },
      storeWatchSpy() {},
      storeUnwatchSpy() {}
    };

    const storeWatchSpy = expect.spyOn(storeCheckers, 'storeWatchSpy');
    const storeUnwatchSpy = expect.spyOn(storeCheckers, 'storeUnwatchSpy');

    branch.watch(storeCheckers.storeWatchSpy);
    branch.watch(storeCheckers.storeUnwatchSpy);

    branch.actions.addToCounter();

    expect(storeWatchSpy).toHaveBeenCalled();
    expect(storeWatchSpy).toHaveBeenCalledWith(branch.store);
    expect(storeUnwatchSpy).toHaveBeenCalled();
    expect(storeUnwatchSpy).toHaveBeenCalledWith(branch.store);

    console.log('=> Function .watch() tests were successful.');
    
    return {
      branch,
      storeCheckers,
      storeWatchSpy,
      storeUnwatchSpy
    };
  })
  .then(({branch, storeCheckers, storeWatchSpy, storeUnwatchSpy}) => {
    // unwatch
    branch.unwatch(storeCheckers.storeUnwatchSpy);

    branch.actions.addToCounter();

    let watchBranchComparator = new SingulumStore({
        counter: 3,
        list: ['bar'],
        map: {test: 'me'},
        nestedBranch: new SingulumStore({
          string: 'test'
        })
      }),
      unwatchBranchComparator = new SingulumStore({
        counter: 2,
        list: ['bar'],
        map: {test: 'me'},
        nestedBranch: new SingulumStore({
          string: 'test'
        })
      });

    expect(storeWatchSpy.calls.length).toBe(2);
    expect(storeWatchSpy.calls[0].arguments).toEqual([unwatchBranchComparator]);
    expect(storeWatchSpy.calls[1].arguments).toEqual([watchBranchComparator]);
    expect(storeUnwatchSpy.calls.length).toBe(1);
    expect(storeUnwatchSpy.calls[0].arguments).toEqual([unwatchBranchComparator]);

    console.log('=> Function .unwatch() tests were successful.');

    return {
      branch,
      storeCheckers
    };
  })
  .then(({branch, storeCheckers}) => {
    // async functions
    branch.watch(storeCheckers.asyncWatch);

    const asyncAction = branch.actions.async().then(() => {
      console.log('...resolved.');
    });

    expect(asyncAction).toBeA(Promise);

    console.log('=> Async action tests were successful, please wait for async action to resolve...');

    return asyncAction;
  })
  .then(() => {
    console.log(`=> All ${process.env.NODE_ENV} tests have run successfully.`);
  })
  .catch(catchError);