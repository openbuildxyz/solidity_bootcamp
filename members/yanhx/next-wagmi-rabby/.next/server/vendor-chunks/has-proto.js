"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/has-proto";
exports.ids = ["vendor-chunks/has-proto"];
exports.modules = {

/***/ "(ssr)/./node_modules/has-proto/index.js":
/*!*****************************************!*\
  !*** ./node_modules/has-proto/index.js ***!
  \*****************************************/
/***/ ((module) => {

eval("\n\nvar test = {\n\tfoo: {}\n};\n\nvar $Object = Object;\n\nmodule.exports = function hasProto() {\n\treturn { __proto__: test }.foo === test.foo && !({ __proto__: null } instanceof $Object);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaGFzLXByb3RvL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFVBQVUsaUJBQWlCLHlCQUF5QixrQkFBa0I7QUFDdEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0LXdhZ21pLy4vbm9kZV9tb2R1bGVzL2hhcy1wcm90by9pbmRleC5qcz80YmUwIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHRlc3QgPSB7XG5cdGZvbzoge31cbn07XG5cbnZhciAkT2JqZWN0ID0gT2JqZWN0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhhc1Byb3RvKCkge1xuXHRyZXR1cm4geyBfX3Byb3RvX186IHRlc3QgfS5mb28gPT09IHRlc3QuZm9vICYmICEoeyBfX3Byb3RvX186IG51bGwgfSBpbnN0YW5jZW9mICRPYmplY3QpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/has-proto/index.js\n");

/***/ })

};
;