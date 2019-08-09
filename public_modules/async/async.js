const async = require('async')

// // 串行
// async.series([
// 	callback => {
// 		setTimeout(() => {
// 			console.log('I execute first1')
// 			callback()
// 		}, 200)
// 	},
// 	callback => {
// 		setTimeout(() => {
// 			console.log('I execute first2')
// 			callback()
// 		}, 200)
// 	},
// 	callback => {
// 		setTimeout(() => {
// 			console.log('I execute first3')
// 		}, 200)
// 	},
// ])


const exec = require('child_process').exec

console.log(exec)

function downloadNodeVersion(version, destination, callback) {
	const url = `http://nodejs.org/dist/v${version}/node-v${version}.tar.gz`; 
	const filepath = `${destination}/${version}.tgz`; 

	exec(`curl ${url} > ${filepath}`, callback)
}

async.series([
	callback => {
		async.parallel([
			callback => {
				console.log('Downloading Node v4.4.7...')
				downloadNodeVersion('4.4.7', '/tmp', callback)
			},
			callback => {
				console.log('Downloading Node v6.3.0...')
				downloadNodeVersion('6.3.0', '/tmp', callback)
			}
		], callback)
	},
	callback => {
		console.log('Creating archive of downloaded files...');
		exec(
			'tar cvf node_distros.tar /tmp/4.4.7.tgz /tmp/6.3.0.tgz',
			err => {
				if (err) throw err
				console.log('all done')
				callback()
			}
		)
	}
])