"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlatformPressable = PlatformPressable;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_SUPPORTS_RIPPLE = _reactNative.Platform.OS === 'android' && _reactNative.Platform.Version >= ANDROID_VERSION_LOLLIPOP;

/**
 * PlatformPressable provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity to handle platform differences.
 *
 * On Android, you can pass the props of TouchableNativeFeedback.
 * On other platforms, you can pass the props of TouchableOpacity.
 */
function PlatformPressable(_ref) {
  let {
    android_ripple,
    pressColor = 'rgba(0, 0, 0, .32)',
    pressOpacity,
    style,
    ...rest
  } = _ref;
  return /*#__PURE__*/React.createElement(_reactNative.Pressable, _extends({
    android_ripple: ANDROID_SUPPORTS_RIPPLE ? {
      color: pressColor,
      ...android_ripple
    } : undefined,
    style: _ref2 => {
      let {
        pressed
      } = _ref2;
      return [{
        opacity: pressed && !ANDROID_SUPPORTS_RIPPLE ? pressOpacity : 1
      }, typeof style === 'function' ? style({
        pressed
      }) : style];
    }
  }, rest));
}
//# sourceMappingURL=PlatformPressable.js.map