/**
 * ES6 Map compatible Wrapper for megahash
 */

const MegaHash = require('./main.js');

class MegaMap extends MegaHash {
	get size() {
		return this.length();
	}

	set(key, value) {
		if (super.set(key, value) === 0) {
			throw new Error('MegaMap: Out of Memory');
		}
		return this;
	}

	*keys() {
		let key;
		while (1) {
			key = this.nextKey(key);
			if (key === undefined) break;
			yield key;
		}
		return key;
	}

	*values() {
		let key;
		let value;
		while (1) {
			key = this.nextKey(key);
			if (key === undefined) break;
			value = this.get(key);
			yield value;
		}
		return value;
	}

	*entries() {
		let key;
		let value;
		while (1) {
			key = this.nextKey(key);
			if (key === undefined) break;
			value = this.get(key);
			yield [key, value];
		}
		return [key, value];
	}

	forEach(cb) {
		for (const [key, value] of this.entries()) {
			cb(value, key, this);
		}
	}

	[Symbol.iterator]() {
		return this.entries();
	}
}

module.exports = MegaMap;
