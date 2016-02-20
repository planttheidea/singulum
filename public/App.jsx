import singulum from '../src';

const onCounterStoreChange = (store) => {
    counterStore = store;

    console.log(counterStore);
};

const onTestStoreChange = (store) => {
    testStore = store;

    console.log(testStore);
};

const onMultipleTestStoreChange = (store) => {
    multipleTestStore = store;

    console.log(multipleTestStore);
};

const setCount = (count = 0, action) => {
    switch (action) {
        case 'add':
            count++;
            return count;
        case 'subtract':
            count--;
            return count;
        default:
            return count;
    }
};

const counter = singulum.branch('countStore', {
    count: {
        addCount(count = 0) {
            return setCount(count, 'add');
        },
        setCount,
        subtractCount(count = 0) {
            return setCount(count, 'subtract');
        },
        initialValue: 0
    },
    test: {
        setTest(test = {}, mergeObj) {
            return {
                ...test,
                ...mergeObj
            };
        },
        initialValue: {}
    }
});

const multipleBranches = singulum.branches({
    testStore: {
        array: {
            setArray(array = [], value) {
                return [
                    ...array,
                    value
                ];
            },
            initialValue: (() => {
                let array = [];

                for (let i = 100; i--;) {
                    array[i] = {
                        item: i,
                        itemAdded: i + 1,
                        itemSubtracted: i - 1
                    };
                }

                return array;
            })()
        },
        object: {
            setObject(object = {}, mergeObject) {
                return {
                    ...object,
                    ...mergeObject
                };
            },
            initialValue: {}
        }
    },
    multipleTestStore: {
        string: {
            setString(string = '', value) {
                return value;
            },
            initialValue: ''
        }
    }
});

const test = multipleBranches[0];
const multipleTest = multipleBranches[1];

counter.watch(onCounterStoreChange);
test.watch(onTestStoreChange);
multipleTest.watch(onMultipleTestStoreChange);

const counterActions = counter.actions;
const testActions = test.actions;
const multipleTestActions = multipleTest.actions;

let counterStore = counter.store,
    testStore = test.store,
    multipleTestStore = multipleTest.store;

console.log(counterStore);
console.log(testStore);
console.log(multipleTestStore);

console.log('adding to count in countStore');
counterActions.setCount('add');

console.log('adding to array in testStore');
testActions.setArray('test');

console.log('adding to object in testStore');
testActions.setObject({
    foo: 'bar'
});

console.log('getting singulum store');
console.log(singulum.store);

console.log('getting counter singulum');
console.log(counter);

console.log('adding to count in countStore');
counterActions.addCount();

console.log('subtracting from count in countStore');
counterActions.subtractCount();

console.log('adding to count in countStore');
counterActions.addCount();

console.log('adding to count in countStore');
counterActions.addCount();

console.log('resetting countStore');
counter.reset();

console.log('getting snapshot of singulum');
const singulumSnapshot = singulum.snapshot('beforeTest');

console.log(singulumSnapshot);

console.log('setting string in multipleTestStore');
multipleTestActions.setString('test');

console.log('getting singulum store');
console.log(singulum.store);

const counterChild = counter.branch('childCountStore', {
    count: {
        setCount,
        initialValue: 10
    }
});

console.log('getting childCountStore');
console.log(counterChild.store);

console.log('adding to count in childCountStore');
counterChild.actions.setCount('add');

console.log('getting childCountStore');
console.log(counterChild.store);

console.log('getting singulum store');
console.log(singulum.store);

console.log('setting test in countStore');
counterActions.setTest({
    some: 'thing'
});

console.log('getting countStore');
console.log(counter.store);

console.log('getting snapshot of singulum');
const secondSnapshot = singulum.snapshot('afterChildCounter');

console.log(secondSnapshot);

const asyncTest = test.branch('asyncTestStore', {
    count: {
        setCount(count = 0) {
            return new Promise((resolve) => {
                window.setTimeout(() => {
                    count++;

                    resolve(count);
                }, 2500);
            });
        },
        initialValue: 0
    }
});

console.log(test.$$store.asyncTestStore);

asyncTest.watch((store) => {
    console.log(store);
});

console.log('setting count in asyncTestStore');
asyncTest.actions.setCount()
    .then(() => {
        console.log('getting snapshot of test');
        const testSnapshot = test.snapshot(true);

        test.reset(true);

        console.log('getting testStore');
        console.log(test.store.asyncTestStore);

        console.log('restoring snapshot of test');
        test.restore(testSnapshot, true);

        console.log('getting testStore');
        console.log(test.store.asyncTestStore);
    });

console.log('getting singulum store');
console.log(singulum.store);

console.log('getting testStore');
console.log(test.store);