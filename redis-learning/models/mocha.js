const memdb = require('..');
const assert = require('assert');

// 描述 memdb 功能
describe('memdb', () => {
	// 描述.saveSync() 方法的功能
	describe('./saveSync(doc)', () => {
		// 描述期望值
		it('should save the document', () => {
			const pet = { name: 'Tobi' };
			memdb.saveSync(pet);
			const ret = memdb.first({ name: 'Tobi' });
			// 确保找到了pet
			assert(ret == pet);
		})
	})
})