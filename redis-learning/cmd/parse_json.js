#!/usr/bin/env node

const concat = require('mississippi').concat;
const readFile = require('fs').readFile;
const yargs = require('yargs');

const argv = yargs
								.usage('parse-json [options]')
								.help('h')
								.alias('h', 'help')
								.demand('f')             // 需要-f才能运行
								.nargs('f', 1)           // 告诉 yargs -f 后面 要有参数值
								.describe('f', 'JSON file to parse')
								.argv;

const file = argv.f;
function parse(str){
	const value = JSON.parse(str);
	console.log(JSON.stringify(value))
}

if (file === '-') {
	process.stdin.pipe(concat(parse));
} else {
	readFile(file, (err, dataBuffer) => {
		if (err) {
			throw err
		} else {
			console.log(dataBuffer.toString())
			parse(dataBuffer.toString())
		}
	})
}







