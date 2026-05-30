import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
    ...nextVitals,
    {
        ignores: ['.next/**', 'node_modules/**', 'coverage/**', 'out/**', 'hardhat.config.js'],
    },
]

export default eslintConfig
