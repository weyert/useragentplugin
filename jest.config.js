module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': '@swc/jest',
    },
    testRegex: '(/__test__/.*|(\\.|/)(test|spec))\\.tsx?$',
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/types/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
