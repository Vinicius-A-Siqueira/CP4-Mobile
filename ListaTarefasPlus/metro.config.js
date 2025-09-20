const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    "@react-native-vector-icons": require.resolve("react-native-vector-icons"),
  };

  return config;
})();

