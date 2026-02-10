// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            // Three.js properties
            'position',
            'args',
            'transparent',
            'opacity',
            'color',
            'attach',
            'intensity',
            'wireframe',
            'rotation',
            'scale',
            'geometry',
            'material',
            'castShadow',
            'receiveShadow',
            // Other Three.js specific props
            'frustumCulled',
            'matrixAutoUpdate',
            'quaternion',
            'visible',
            'uuid',
            'layers',
            'up',
            'type',
            'id',
            'name',
            'parent',
            'modelViewMatrix',
            'normalMatrix',
            'matrixWorld',
            'matrixWorldNeedsUpdate',
            'children',
          ],
        },
      ],
    },
  },
]);