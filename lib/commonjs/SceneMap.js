"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SceneMap = SceneMap;
var React = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const SceneComponent = /*#__PURE__*/React.memo(_ref => {
  let {
    component,
    ...rest
  } = _ref;
  return /*#__PURE__*/React.createElement(component, rest);
});
function SceneMap(scenes) {
  return _ref2 => {
    let {
      route,
      jumpTo,
      position
    } = _ref2;
    return /*#__PURE__*/React.createElement(SceneComponent, {
      key: route.key,
      component: scenes[route.key],
      route: route,
      jumpTo: jumpTo,
      position: position
    });
  };
}
//# sourceMappingURL=SceneMap.js.map