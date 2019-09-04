// 并行流程控制

const fs = require('fs');
const tasks = [];
const wordCounts = {};
const fileDir = './public_modules/async/lib/'
let completedTasks = 0;



const checkIfComplete = () => {
	completedTasks++
	if (completedTasks === tasks.length) {
		for (let x in wordCounts) {
			console.log(`${x} : ${wordCounts[x]}`)
		}
	}
}

const addWordCount = (word) => {
	wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1
}

// 对文本中出现的 单词计数
const countWordsInText = (text) => {
	const words = text
		.toString()
		.toLowerCase()
		.split(/\W+/)
		.sort()

	words
		.filter(word => word) // 过滤空字符串
		.forEach(word => addWordCount(word))
}

fs.readdir(fileDir, (err, files) => {
	if (err) throw err
	files.forEach(file => {
		parseFile(file, fileDir)
	})
})

// 定义处理每个文件的任务。 每个任务中都会调用一个异 步读取文件的函数并对文件 中使用的单词计数
function parseFile(file, fileDir) {
	const task = (file => {
		return () => {
			fs.readFile(file, (err, text) => {
				// console.log(text.toString())
				if (err) throw err
				countWordsInText(text);
				checkIfComplete()
			})
		}
	})(`${fileDir}/${file}`)
	tasks.push(task)

	// 开始并行执行 所有任务
	tasks.forEach(task => task())
}