"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabBarIndicator = TabBarIndicator;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _useAnimatedValue = require("./useAnimatedValue");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const getTranslateX = (position, routes, getTabWidth, direction, gap) => {
  const inputRange = routes.map((_, i) => i);

  // every index contains widths at all previous indices
  const outputRange = routes.reduce((acc, _, i) => {
    if (i === 0) return [0];
    return [...acc, acc[i - 1] + getTabWidth(i - 1) + (gap ?? 0)];
  }, []);
  const translateX = position.interpolate({
    inputRange,
    outputRange,
    extrapolate: 'clamp'
  });
  return _reactNative.Animated.multiply(translateX, direction === 'rtl' ? -1 : 1);
};
function TabBarIndicator(_ref) {
  let {
    getTabWidth,
    layout,
    navigationState,
    position,
    width,
    direction,
    gap,
    style,
    children
  } = _ref;
  const isIndicatorShown = React.useRef(false);
  const isWidthDynamic = width === 'auto';
  const initialWidth = _reactNative.Platform.OS === 'android' ? 70 : 1;
  const getShiftAfterScale = (modif, coef) => {
    if (modif > 0) {
      return initialWidth * (modif - 1) / (2 * modif) * coef;
    }
    return 1;
  };
  const opacity = (0, _useAnimatedValue.useAnimatedValue)(isWidthDynamic ? 0 : 1);
  const indicatorVisible = isWidthDynamic ? layout.width && navigationState.routes.slice(0, navigationState.index).every((_, r) => getTabWidth(r)) : true;
  React.useEffect(() => {
    const fadeInIndicator = () => {
      if (!isIndicatorShown.current && isWidthDynamic &&
      // We should fade-in the indicator when we have widths for all the tab items
      indicatorVisible) {
        isIndicatorShown.current = true;
        _reactNative.Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          easing: _reactNative.Easing.in(_reactNative.Easing.linear),
          useNativeDriver: true
        }).start();
      }
    };
    fadeInIndicator();
    return () => opacity.stopAnimation();
  }, [indicatorVisible, isWidthDynamic, opacity]);
  const {
    routes
  } = navigationState;
  const transform = [];
  if (layout.width) {
    const translateX = routes.length > 1 ? getTranslateX(position, routes, getTabWidth, direction, gap) : 0;
    transform.push({
      translateX
    });
  }
  if (width === 'auto') {
    const inputRange = routes.map((_, i) => i);
    const outputRange = inputRange.map(i => getTabWidth(i) / initialWidth);
    const outputShiftRange = inputRange.map(i => getShiftAfterScale(outputRange[i], direction === 'rtl' ? -1 : 1));
    transform.push({
      scaleX: routes.length > 1 ? position.interpolate({
        inputRange,
        outputRange,
        extrapolate: 'clamp'
      }) : outputRange[0]
    }, {
      translateX: routes.length > 1 ? position.interpolate({
        inputRange,
        outputRange: outputShiftRange,
        extrapolate: 'clamp'
      }) : 0
    });
  }
  return /*#__PURE__*/React.createElement(_reactNative.Animated.View, {
    style: [styles.indicator, {
      width: width === 'auto' ? initialWidth : width
    },
    // If layout is not available, use `left` property for positioning the indicator
    // This avoids rendering delay until we are able to calculate translateX
    // If platform is macos use `left` property as `transform` is broken at the moment.
    // See: https://github.com/microsoft/react-native-macos/issues/280
    layout.width && _reactNative.Platform.OS !== 'macos' ? {
      left: 0
    } : {
      left: `${100 / routes.length * navigationState.index}%`
    }, {
      transform
    }, width === 'auto' ? {
      opacity: opacity
    } : null, style]
  }, children);
}
const styles = _reactNative.StyleSheet.create({
  indicator: {
    backgroundColor: '#ffeb3b',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 2
  }
});
//# sourceMappingURL=TabBarIndicator.js.map