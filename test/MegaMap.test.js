const assert = require('assert');
const { MegaMap } = require('../index.js');
const { strictEqual, deepStrictEqual } = assert;

const tests = [];
module.exports = { tests };

// helper functions to map mocha-style tests to pixl-unit tests
let suiteName;
function describe(name, suiteFn) {
	suiteName = name;
	suiteFn();
}
function it(name, fn) {
	function testFn(test) {
		try {
			fn();
			test.ok(true, name);
		} catch (e) {
			test.ok(false, name);
			console.error(e.message);
		}
		test.done();
	}
	Object.defineProperty(testFn, 'name', { writable: true });
	testFn.name = `${suiteName} - ${name}`;

	tests.push(testFn);
}

// start of tests
describe('MegaMap', function () {
	let hash = new MegaMap();

	it('set', function () {
		for (let i = 0; i < 8; i++) {
			hash.set('' + i, 'v' + i);
		}
	});
	it('chained set', function () {
		hash.set('8', 'v8').set('9', 'v9');
	});
	it('get', function () {
		const arr = [];
		for (let i = 0; i < 10; i++) {
			arr.push(hash.get('' + i));
		}
		deepStrictEqual(arr, [
			'v0',
			'v1',
			'v2',
			'v3',
			'v4',
			'v5',
			'v6',
			'v7',
			'v8',
			'v9',
		]);
	});
	it('has', function () {
		strictEqual(hash.has('5'), true);
		strictEqual(hash.has('a'), false);
	});
	it('size', function () {
		strictEqual(hash.size, 10);
	});
	it('keys', function () {
		deepStrictEqual(
			[...hash.keys()],
			['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
		);
	});
	it('keys iterator', function () {
		const arr = [];
		const iterator = hash.keys();
		while (true) {
			const { done, value } = iterator.next();
			if (done) break;
			arr.push(value);
		}
		deepStrictEqual(arr, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
	});
	it('values', function () {
		deepStrictEqual(
			[...hash.values()],
			['v0', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9']
		);
	});
	it('values iterator', function () {
		const arr = [];
		const iterator = hash.values();
		while (true) {
			const { done, value } = iterator.next();
			if (done) break;
			arr.push(value);
		}
		deepStrictEqual(arr, [
			'v0',
			'v1',
			'v2',
			'v3',
			'v4',
			'v5',
			'v6',
			'v7',
			'v8',
			'v9',
		]);
	});
	it('delete', function () {
		strictEqual(hash.delete('5'), true);
		strictEqual(hash.has(5), false);
		strictEqual(hash.delete('a'), false);
	});
	it('for loop', function () {
		const arr = [];
		for (const kv of hash) {
			arr.push(kv);
		}
		deepStrictEqual(arr, [
			['0', 'v0'],
			['1', 'v1'],
			['2', 'v2'],
			['3', 'v3'],
			['4', 'v4'],
			['6', 'v6'],
			['7', 'v7'],
			['8', 'v8'],
			['9', 'v9'],
		]);
	});
	it('forEach iterator', function () {
		const arr = [];
		hash.forEach((value, key) => {
			arr.push([key, value]);
		});
		deepStrictEqual(arr, [
			['0', 'v0'],
			['1', 'v1'],
			['2', 'v2'],
			['3', 'v3'],
			['4', 'v4'],
			['6', 'v6'],
			['7', 'v7'],
			['8', 'v8'],
			['9', 'v9'],
		]);
	});
	it('iterator.next', function () {
		const arr = [];
		const iterator = hash[Symbol.iterator]();
		while (true) {
			const { done, value } = iterator.next();
			if (done) break;
			arr.push(value);
		}
		deepStrictEqual(arr, [
			['0', 'v0'],
			['1', 'v1'],
			['2', 'v2'],
			['3', 'v3'],
			['4', 'v4'],
			['6', 'v6'],
			['7', 'v7'],
			['8', 'v8'],
			['9', 'v9'],
		]);
	});
	it('clear', function () {
		strictEqual(hash.size, 9);
		hash.clear();
		strictEqual(hash.size, 0);
	});
	it('set with object as key fails', function () {
		const hash = new MegaMap();
		const key = { a: 1 }; // gives '[object Object]'
		const val = { b: 2 };
		const key2 = { c: 3 }; // give '[object Object]' as well
		const val2 = { d: 4 };
		hash.set(key, val).set(key2, val2);
		assert.notDeepStrictEqual(hash.get(key), val);
		assert.deepStrictEqual(hash.get(key2), val2);
		hash.clear();
	});
	it('set with function as key fails', function () {
		const hash = new MegaMap();
		const key = () => 'a';
		const val = { b: 2 };
		const key2 = () => 'c';
		const val2 = { d: 4 };
		hash.set(key, val).set(key2, val2);
		deepStrictEqual(hash.get(key), val);
		deepStrictEqual(hash.get(key2), val2);
		deepStrictEqual([...hash.keys()], ["() => 'a'", "() => 'c'"]); // ES6 Map would return typeof `function`
		hash.clear();
	});
	it('set with number as key is same as string', function () {
		const hash = new MegaMap();
		const key = 10;
		const val = { b: 2 };
		hash.set(key, val);
		deepStrictEqual(hash.get(key), val);
		deepStrictEqual(hash.get('' + key), val);
		hash.clear();
	});
});
