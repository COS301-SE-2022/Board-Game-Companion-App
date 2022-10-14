module.exports = {
  displayName: 'api-lib',
  preset: '../../jest.preset.js',
 // setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  moduleNameMapper: {
    "uuid": require.resolve('uuid'),
  },
  coverageDirectory: '../../coverage/libs/api-lib',
};
