/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts'],
    setupFiles: ['<rootDir>/__tests__/setup.ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/server.ts',
        '!src/constants/**',
        '!src/interfaces/**',
    ],
    silent: true,
};
