const nextJest = require('next/jest')

const createJestConfig = nextJest({
	dir: './',
})

const customJestConfig = {
	collectCoverage: true,
	maxWorkers: '50%',
	restoreMocks: true,
	testEnvironment: 'node',
	testMatch: ['<rootDir>/src/**/*.test.js'],
}

module.exports = createJestConfig(customJestConfig)