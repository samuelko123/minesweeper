// Create 2D array with prefilled values
exports.create = (rows, cols, prefill_val) => {
	const arr = Array(rows)
	for (let i = 0; i < rows; i++) {
		arr[i] = Array(cols).fill(prefill_val)
	}

	return arr
}

// Assign val to {n} cells of the array in place
exports.populate = (arr, val, n) => {
	const rows = arr.length
	const cols = arr[0].length
	let count = n

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			arr[i][j] = val
			count--

			if (count === 0)
			{return}
		}
	}
}

// Randomise the array in place
exports.shuffle = (arr) => {
	const rows = arr.length
	const cols = arr[0].length

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			const x = Math.floor(Math.random() * rows)
			const y = Math.floor(Math.random() * cols)
			const temp = arr[i][j]
			arr[i][j] = arr[x][y]
			arr[x][y] = temp
		}
	}
}

// Fill array with adjacent count of val
exports.fillAdjCount = (arr, val) => {
	for (let row = 0; row < arr.length; row++) {
		for (let col = 0; col < arr[0].length; col++) {
			if (arr[row][col] === val) {
				this.callFnOnAdj(arr, row, col, (i, j) => {
					if (arr[i][j] !== val) {
						arr[i][j]++
					}
				})
			}
		}
	}
}

// Get adjacent count of val for arr[row][col]
exports.getAdjCount = (arr, row, col, val) => {
	let count = 0
	this.callFnOnAdj(arr, row, col, (i, j) => {
		if (arr[i][j] === val) {
			count++
		}
	})

	return count
}

// Execute function on arr[row][col] and its adjacent cells
exports.callFnOnAdj = (arr, row, col, fn) => {
	const rows = arr.length
	const cols = arr[0].length

	const row_min = Math.max(row - 1, 0)
	const row_max = Math.min(row + 1, rows - 1)
	const col_min = Math.max(col - 1, 0)
	const col_max = Math.min(col + 1, cols - 1)

	for (let i = row_min; i <= row_max; i++) {
		for (let j = col_min; j <= col_max; j++) {
			fn(i, j)
		}
	}
}

// Get count of val in arr
exports.getCount = (arr, val) => {
	let count = 0

	arr.forEach((row) => {
		row.forEach((cell) => {
			count += (cell === val ? 1 : 0)
		})
	})

	return count
}

// Call function on each cell in 2D array
exports.map = (arr, fn) => {
	const rows = arr.length
	const cols = arr[0].length

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			fn(arr, i, j)
		}
	}

	return arr
}