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

const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

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

const catchError = (err) => {
  setTimeout(() => {
    console.error(err.stack);
    process.exit(1);
  }, 1);
};

new Promise((resolve) => {
    // constructor
    expect(singulum).toBeA(Singulum);
    
    const branch = singulum.branch(actions, store, 'testBranch');
  
    console.log('Singulum constructor and function .branch() tests were successful.');
    
    resolve(branch);
  })
  .then((branch) => {
    // actions creation
    const branchActions = branch.actions;

    if (isProduction()) {
      expect(branchActions).toBeA(Object);
    } else {
      expect(branchActions).toBeA(SingulumActions);
    }

    expect(actionCount).toEqual(8);

    console.log('Actions creation tests were successful.');
    
    return branch;
  })
  .then((branch) => {
    // store creation
    const initialBranchStore = branch.store;
    
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

    console.log('Store creation tests were successful.');
    
    return {
      branch,
      initialBranchStore
    };
  })
  .then(({branch, initialBranchStore}) => {
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

    let branchComparator = {
      counter: 1,
      list: ['bar'],
      map: {test: 'me'}
    };

    if (!isProduction()) {
      branchComparator = new SingulumStore(branchComparator);
    }

    expect(branch.store).toEqual(branchComparator);

    console.log('Store update via action tests were successful.');
    
    return {
      branch,
      branchComparator,
      initialBranchStore
    };
  })
  .then(({branch, branchComparator, initialBranchStore}) => {
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

    console.log('Function .equals() tests were successful.');
    
    return {
      branch,
      branchComparator,
      duplicateBranch,
      initialBranchStore
    };
  })
  .then(({branch, branchComparator, duplicateBranch, initialBranchStore}) => {
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

    console.log('Function .hashCode() tests were successful.');
    
    return {
      branch,
      branchComparator,
      initialBranchStore
    };
  })
  .then(({branch, branchComparator, initialBranchStore}) => {
    // snapshotting
    const snapshot = branch.snapshot();
    const snapshotComparator = new SingulumSnapshot(branch.store, branch.$$store);

    expect(snapshot).toBeA(SingulumSnapshot);
    expect(snapshot).toEqual(snapshotComparator);
    expect(snapshot.counter).toBe(1);
    expect(snapshot.list).toEqual(['bar']);
    expect(snapshot.map).toEqual({test: 'me'});

    console.log('Function .snapshot() tests were successful.');
    
    return {
      branch,
      branchComparator,
      initialBranchStore,
      snapshot
    };
  })
  .then(({branch, branchComparator, initialBranchStore, snapshot}) => {
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

    console.log('Function .reset() tests were successful.');
    
    return {
      branch,
      branchComparator,
      snapshot
    }
  })
  .then(({branch, branchComparator, snapshot}) => {
    // restoring
    branch.restore(snapshot);

    expect(branch.store).toEqual(branchComparator);
    expect(branch.store.counter).toBe(1);
    expect(branch.store.list).toEqual(['bar']);
    expect(branch.store.map).toEqual({test: 'me'});

    console.log('Function .restore() tests were successful.');
    
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

    console.log('Function .watch() tests were successful.');
    
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

    expect(storeWatchSpy.calls.length).toBe(2);
    expect(storeWatchSpy.calls[0].arguments).toEqual([unwatchBranchComparator]);
    expect(storeWatchSpy.calls[1].arguments).toEqual([watchBranchComparator]);
    expect(storeUnwatchSpy.calls.length).toBe(1);
    expect(storeUnwatchSpy.calls[0].arguments).toEqual([unwatchBranchComparator]);

    console.log('Function .unwatch() tests were successful.');

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

    console.log('Async action tests were successful, please wait for async action to resolve...');

    return asyncAction;
  })
  .then(() => {
    console.log(`All ${process.env.NODE_ENV} tests have run successfully.`);
  })
  .catch(catchError);