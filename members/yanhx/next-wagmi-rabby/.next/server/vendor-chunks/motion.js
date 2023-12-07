"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/motion";
exports.ids = ["vendor-chunks/motion"];
exports.modules = {

/***/ "(ssr)/./node_modules/motion/dist/animate.cjs.js":
/*!*************************************************!*\
  !*** ./node_modules/motion/dist/animate.cjs.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n\nvar dom = __webpack_require__(/*! @motionone/dom */ \"(ssr)/./node_modules/@motionone/dom/dist/index.cjs.js\");\nvar utils = __webpack_require__(/*! @motionone/utils */ \"(ssr)/./node_modules/@motionone/utils/dist/index.cjs.js\");\nvar animation = __webpack_require__(/*! @motionone/animation */ \"(ssr)/./node_modules/@motionone/animation/dist/index.cjs.js\");\n\nfunction animateProgress(target, options = {}) {\n    return dom.withControls([\n        () => {\n            const animation$1 = new animation.Animation(target, [0, 1], options);\n            animation$1.finished.catch(() => { });\n            return animation$1;\n        },\n    ], options, options.duration);\n}\nfunction animate(target, keyframesOrOptions, options) {\n    const factory = utils.isFunction(target) ? animateProgress : dom.animate;\n    return factory(target, keyframesOrOptions, options);\n}\n\nexports.animate = animate;\nexports.animateProgress = animateProgress;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbW90aW9uL2Rpc3QvYW5pbWF0ZS5janMuanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIsOENBQTZDLEVBQUUsYUFBYSxFQUFDOztBQUU3RCxVQUFVLG1CQUFPLENBQUMsNkVBQWdCO0FBQ2xDLFlBQVksbUJBQU8sQ0FBQyxpRkFBa0I7QUFDdEMsZ0JBQWdCLG1CQUFPLENBQUMseUZBQXNCOztBQUU5Qyw2Q0FBNkM7QUFDN0M7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxlQUFlO0FBQ2YsdUJBQXVCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dC13YWdtaS8uL25vZGVfbW9kdWxlcy9tb3Rpb24vZGlzdC9hbmltYXRlLmNqcy5qcz8xMDI4Il0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIGRvbSA9IHJlcXVpcmUoJ0Btb3Rpb25vbmUvZG9tJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCdAbW90aW9ub25lL3V0aWxzJyk7XG52YXIgYW5pbWF0aW9uID0gcmVxdWlyZSgnQG1vdGlvbm9uZS9hbmltYXRpb24nKTtcblxuZnVuY3Rpb24gYW5pbWF0ZVByb2dyZXNzKHRhcmdldCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIGRvbS53aXRoQ29udHJvbHMoW1xuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhbmltYXRpb24kMSA9IG5ldyBhbmltYXRpb24uQW5pbWF0aW9uKHRhcmdldCwgWzAsIDFdLCBvcHRpb25zKTtcbiAgICAgICAgICAgIGFuaW1hdGlvbiQxLmZpbmlzaGVkLmNhdGNoKCgpID0+IHsgfSk7XG4gICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uJDE7XG4gICAgICAgIH0sXG4gICAgXSwgb3B0aW9ucywgb3B0aW9ucy5kdXJhdGlvbik7XG59XG5mdW5jdGlvbiBhbmltYXRlKHRhcmdldCwga2V5ZnJhbWVzT3JPcHRpb25zLCBvcHRpb25zKSB7XG4gICAgY29uc3QgZmFjdG9yeSA9IHV0aWxzLmlzRnVuY3Rpb24odGFyZ2V0KSA/IGFuaW1hdGVQcm9ncmVzcyA6IGRvbS5hbmltYXRlO1xuICAgIHJldHVybiBmYWN0b3J5KHRhcmdldCwga2V5ZnJhbWVzT3JPcHRpb25zLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0cy5hbmltYXRlID0gYW5pbWF0ZTtcbmV4cG9ydHMuYW5pbWF0ZVByb2dyZXNzID0gYW5pbWF0ZVByb2dyZXNzO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/motion/dist/animate.cjs.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/motion/dist/main.cjs.js":
/*!**********************************************!*\
  !*** ./node_modules/motion/dist/main.cjs.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n\nvar dom = __webpack_require__(/*! @motionone/dom */ \"(ssr)/./node_modules/@motionone/dom/dist/index.cjs.js\");\nvar types = __webpack_require__(/*! @motionone/types */ \"(ssr)/./node_modules/@motionone/types/dist/index.cjs.js\");\nvar animate = __webpack_require__(/*! ./animate.cjs.js */ \"(ssr)/./node_modules/motion/dist/animate.cjs.js\");\n\n\n\nexports.animate = animate.animate;\nObject.keys(dom).forEach(function (k) {\n\tif (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {\n\t\tenumerable: true,\n\t\tget: function () { return dom[k]; }\n\t});\n});\nObject.keys(types).forEach(function (k) {\n\tif (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {\n\t\tenumerable: true,\n\t\tget: function () { return types[k]; }\n\t});\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbW90aW9uL2Rpc3QvbWFpbi5janMuanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIsOENBQTZDLEVBQUUsYUFBYSxFQUFDOztBQUU3RCxVQUFVLG1CQUFPLENBQUMsNkVBQWdCO0FBQ2xDLFlBQVksbUJBQU8sQ0FBQyxpRkFBa0I7QUFDdEMsY0FBYyxtQkFBTyxDQUFDLHlFQUFrQjs7OztBQUl4QyxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLEVBQUU7QUFDRixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLEVBQUU7QUFDRixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dC13YWdtaS8uL25vZGVfbW9kdWxlcy9tb3Rpb24vZGlzdC9tYWluLmNqcy5qcz9iNmYyIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIGRvbSA9IHJlcXVpcmUoJ0Btb3Rpb25vbmUvZG9tJyk7XG52YXIgdHlwZXMgPSByZXF1aXJlKCdAbW90aW9ub25lL3R5cGVzJyk7XG52YXIgYW5pbWF0ZSA9IHJlcXVpcmUoJy4vYW5pbWF0ZS5janMuanMnKTtcblxuXG5cbmV4cG9ydHMuYW5pbWF0ZSA9IGFuaW1hdGUuYW5pbWF0ZTtcbk9iamVjdC5rZXlzKGRvbSkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuXHRpZiAoayAhPT0gJ2RlZmF1bHQnICYmICFleHBvcnRzLmhhc093blByb3BlcnR5KGspKSBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgaywge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBkb21ba107IH1cblx0fSk7XG59KTtcbk9iamVjdC5rZXlzKHR5cGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG5cdGlmIChrICE9PSAnZGVmYXVsdCcgJiYgIWV4cG9ydHMuaGFzT3duUHJvcGVydHkoaykpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrLCB7XG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHR5cGVzW2tdOyB9XG5cdH0pO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/motion/dist/main.cjs.js\n");

/***/ })

};
;