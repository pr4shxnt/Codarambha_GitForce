// This file is used to configure the Metro bundler for React Native.
// It is responsible for bundling all your JavaScript code and assets.

// Import necessary functions from @react-native/metro-config.
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// Import the NativeWind plugin.
const { withNativeWind } = require('nativewind/metro');

// Get the default Metro configuration.
const defaultConfig = getDefaultConfig(__dirname);

// Create your custom configuration. You can add more settings here if needed.
const config = {};

// Merge the default configuration with your custom configuration.
const mergedConfig = mergeConfig(defaultConfig, config);

// Wrap the merged configuration with the NativeWind plugin.
// The `input` option specifies the location of your global stylesheet.
module.exports = withNativeWind(mergedConfig, { input: './global.css' });
