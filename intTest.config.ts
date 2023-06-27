import type { Config } from '@jest/types'

const baseDir =  '<rootDir>/src/app/server_app'
const baseTestDir =  '<rootDir>/src/tests/integration_tests'


const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        `${baseDir}/**/*.ts`
    ],
    testMatch: [
        `${baseTestDir}/**/*test.ts`
    ],
    setupFiles: [
        '<rootDir>/src/tests/integration_tests/utils/config.ts'
    ]
}

export default config;