module.exports = {
  dependencies: {
    'react-native-svg': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-svg/android',
          packageImportPath: 'import com.horcrux.svg.SvgPackage;',
        },
      },
    },
    'react-native-linear-gradient': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-linear-gradient/android',
          packageImportPath: 'import com.BV.LinearGradient.LinearGradientPackage;',
        },
      },
    },
  },
};
