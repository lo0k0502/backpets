const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('png', 'glb', 'gltf', 'bin', 'obj', 'ttf', 'json', 'mtl');

module.exports = config;