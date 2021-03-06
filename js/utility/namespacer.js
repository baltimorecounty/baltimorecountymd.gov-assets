/*
 * Creates namespaces safely and conveniently, reusing 
 * existing objects instead of overwriting them.
 */
function namespacer(ns) {
  var nsArr = ns.split('.');
  var parent = window;

  if (!nsArr.length) {
    return;
  }

  for (var i = 0, len = nsArr.length; i < len; i++) {
    var nsPart = nsArr[i];

    if (typeof parent[nsPart] === 'undefined') {
      parent[nsPart] = {};
    }

    parent = parent[nsPart];
  }
}