(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sbgnviz = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(_dereq_,module,exports){
(function(){
  var chise = function(_options) {

    var param = {};

    // Access the libs
    var libs = _dereq_('./utilities/lib-utilities').getLibs();

    var optionUtilities = _dereq_('./utilities/option-utilities-factory')();
    var options = optionUtilities.extendOptions(_options); // Extends the default options with the given options

    // Create an sbgnviz instance
    var sbgnvizInstanceUtilities = _dereq_('./utilities/sbgnviz-instance-utilities-factory')();
    var sbgnvizInstance = sbgnvizInstanceUtilities(options);

    // Register undo/redo actions
    var registerUndoRedoActions = _dereq_('./utilities/register-undo-redo-actions-factory')();

    var mainUtilities = _dereq_('./utilities/main-utilities-factory')();
    var elementUtilitiesExtender = _dereq_('./utilities/element-utilities-extender-factory')();
    var undoRedoActionFunctionsExtender = _dereq_('./utilities/ur-action-functions-extender-factory')();
    var sifTopologyGrouping = _dereq_('./utilities/topology-grouping-factory')();

    var elementUtilities =  sbgnvizInstance.elementUtilities;
    var undoRedoActionFunctions = sbgnvizInstance.undoRedoActionFunctions;

    param.sbgnvizInstanceUtilities = sbgnvizInstanceUtilities;
    param.optionUtilities = optionUtilities;
    param.elementUtilities = elementUtilities;
    param.undoRedoActionFunctions = undoRedoActionFunctions;
    param.sifTopologyGrouping = sifTopologyGrouping;

    var shouldApply = function() {
      return param.elementUtilities.mapType === 'SIF';
    };

    undoRedoActionFunctionsExtender(param);
    elementUtilitiesExtender(param);
    registerUndoRedoActions(param);
    mainUtilities(param);
    sifTopologyGrouping(param, {metaEdgeIdentifier: 'sif-meta', lockGraphTopology: true, shouldApply});

    // Expose the api
    var api = {};

    // Expose the properties inherited from sbgnviz
    // then override some of these properties and expose some new properties
    for (var prop in sbgnvizInstance) {
      api[prop] = sbgnvizInstance[prop];
    }

    // Expose each main utility seperately
    for (var prop in mainUtilities) {
      api[prop] = mainUtilities[prop];
    }

    // Expose getSbgnvizInstance()
    api.getSbgnvizInstance = sbgnvizInstanceUtilities.getInstance;

    // Expose elementUtilities and undoRedoActionFunctions as is
    api.elementUtilities = elementUtilities;
    api.undoRedoActionFunctions = undoRedoActionFunctions;
    api.sifTopologyGrouping = sifTopologyGrouping;

    return api;
  };

  // Register chise with given libraries
  chise.register = function (_libs) {

    var libs = {};
    libs.jQuery = _libs.jQuery || jQuery;
    libs.cytoscape = _libs.cytoscape || cytoscape;
    libs.sbgnviz = _libs.sbgnviz || sbgnviz;
    libs.saveAs = _libs.filesaver ? _libs.filesaver.saveAs : saveAs;

    libs.sbgnviz.register(_libs); // Register sbgnviz with the given libs

    // inherit exposed static properties of sbgnviz other than register
    for (var prop in libs.sbgnviz) {
      if (prop !== 'register') {
        chise[prop] = libs.sbgnviz[prop];
      }
    }

    // Set the libraries to access them from any file
    var libUtilities = _dereq_('./utilities/lib-utilities');
    libUtilities.setLibs(libs);
  };

  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = chise;
  }
})();

},{"./utilities/element-utilities-extender-factory":3,"./utilities/lib-utilities":4,"./utilities/main-utilities-factory":5,"./utilities/option-utilities-factory":6,"./utilities/register-undo-redo-actions-factory":7,"./utilities/sbgnviz-instance-utilities-factory":8,"./utilities/topology-grouping-factory":9,"./utilities/ur-action-functions-extender-factory":10}],3:[function(_dereq_,module,exports){
// Extends sbgnviz.elementUtilities
var libs = _dereq_('./lib-utilities').getLibs();
var jQuery = $ = libs.jQuery;

module.exports = function () {
  var options, sbgnvizInstance, elementUtilities, cy;

  function elementUtilitiesExtender (param) {
    sbgnvizInstance = param.sbgnvizInstanceUtilities.getInstance();
    options = param.optionUtilities.getOptions();
    elementUtilities = sbgnvizInstance.elementUtilities;
    cy = param.sbgnvizInstanceUtilities.getCy();

    extend();

    // Return the extended elementUtilities
    return elementUtilities;
  }

  // Extends elementUtilities with chise specific facilities
  function extend () {
    // Section Start
    // Add remove utilities

    elementUtilities.addNode = function (x, y, nodeParams, id, parent, visibility) {
      if (typeof nodeParams != 'object'){
        var sbgnclass = nodeParams;
      } else {
          var sbgnclass = nodeParams.class;
          var language = nodeParams.language;
      }

      var css = {};
      // if there is no specific default width or height for
      // sbgnclass these sizes are used
      var defaultWidth = 50;
      var defaultHeight = 50;

      if (visibility) {
        css.visibility = visibility;
      }

      var data = {
        class: sbgnclass,
    	  language: language,
        bbox: {
          w: defaultWidth,
          h: defaultHeight,
          x: x,
          y: y
        },
        statesandinfos: [],
        ports: []
      };

      if(id) {
        data.id = id;
      }
      else {
        data.id = elementUtilities.generateNodeId();
      }

      if (parent) {
        data.parent = parent;
      }

      this.extendNodeDataWithClassDefaults( data, sbgnclass );

      // some defaults are not set by extendNodeDataWithClassDefaults()
      var defaults = this.getDefaultProperties( sbgnclass );

      if ( defaults[ 'multimer' ] ) {
        data.class += ' multimer';
      }

      if ( defaults[ 'clonemarker' ] ) {
        data[ 'clonemarker' ] = true;
      }

      data.bbox[ 'w' ] = defaults[ 'width' ];
      data.bbox[ 'h' ] = defaults[ 'height' ];

      var eles = cy.add({
        group: "nodes",
        data: data,
        css: css,
        position: {
          x: x,
          y: y
        }
      });

      var newNode = eles[eles.length - 1];
      // Get the default ports ordering for the nodes with given sbgnclass
      var ordering = defaults['ports-ordering'];

      // If there is a default ports ordering for the nodes with given sbgnclass and it is different than 'none' set the ports ordering to that ordering
      if (ordering && ordering !== 'none') {
        this.setPortsOrdering(newNode, ordering);
      }

      if (language == "AF" && !elementUtilities.canHaveMultipleUnitOfInformation(newNode)){
        if (sbgnclass != "BA plain") { // if AF node can have label i.e: not plain biological activity
          var uoi_obj = {
            clazz: "unit of information"
          };
          uoi_obj.label = {
            text: ""
          };

          uoi_obj.bbox = {
             w: 12,
             h: 12
          };
          elementUtilities.addStateOrInfoBox(newNode, uoi_obj);
        }
      }

      // node bg image was unexpectedly not rendered until it is clicked
      // use this dirty hack until finding a solution to the problem
      var bgImage = newNode.data('background-image');
      if ( bgImage ) {
        newNode.data( 'background-image', bgImage );
      }

      return newNode;
    };

    //Saves old aux units of given node
    elementUtilities.saveUnits = function(node) {
      var tempData = [];
      var index = 0;
      node.data('statesandinfos').forEach( function(ele) {
        tempData.push({
          x: ele.bbox.x,
          y: ele.bbox.y,
          anchorSide: ele.anchorSide,
        });
        index++;
      });
      return tempData;
    };

    //Restores from given data
    elementUtilities.restoreUnits = function(node, data) {
      var index = 0;
      node.data('statesandinfos').forEach( function(ele) {
        if (data !== undefined) {
          ele.bbox.x = data[index].x;
          ele.bbox.y = data[index].y
          var anchorSide = ele.anchorSide;
          ele.anchorSide = data[index].anchorSide;
          elementUtilities.modifyUnits(node, ele, anchorSide);
          index++;
        }
      });
    };

    //Modify aux unit layouts
    elementUtilities.modifyUnits = function (node, ele, anchorSide) {
      instance.classes.AuxUnitLayout.modifyUnits(node, ele, anchorSide, cy);
    };


    //For reversible reactions both side of the process can be input/output
    //Group ID identifies to which group of nodes the edge is going to be connected for reversible reactions(0: group 1 ID and 1:group 2 ID)
    elementUtilities.addEdge = function (source, target, edgeParams, id, visibility, groupID ) {
      if (typeof edgeParams != 'object'){
        var sbgnclass = edgeParams;
      } else {
          var sbgnclass = edgeParams.class;
          var language = edgeParams.language;
      }

      var css = {};

      if (visibility) {
        css.visibility = visibility;
      }

      var data = {
          source: source,
          target: target,
          class: sbgnclass,
          language: language,
      };

      var defaults = elementUtilities.getDefaultProperties( sbgnclass );

      // extend the data with default properties of edge style
      Object.keys( defaults ).forEach( function( prop ) {
        data[ prop ] = defaults[ prop ];
      } );

      if(id) {
        data.id = id;
      }
      else {
        data.id = elementUtilities.generateEdgeId();
      }

      if(elementUtilities.canHaveSBGNCardinality(sbgnclass)){
        data.cardinality = 0;
      }

      var sourceNode = cy.getElementById(source); // The original source node
      var targetNode = cy.getElementById(target); // The original target node
      var sourceHasPorts = sourceNode.data('ports').length === 2;
      var targetHasPorts = targetNode.data('ports').length === 2;
      // The portsource and porttarget variables
      var portsource;
      var porttarget;

      /*
       * Get input/output port id's of a node with the assumption that the node has valid ports.
       */
      var getIOPortIds = function (node) {
        var nodeInputPortId, nodeOutputPortId;
        var nodePortsOrdering = sbgnvizInstance.elementUtilities.getPortsOrdering(node);
        var nodePorts = node.data('ports');
        if ( nodePortsOrdering === 'L-to-R' || nodePortsOrdering === 'R-to-L' ) {
          var leftPortId = nodePorts[0].x < 0 ? nodePorts[0].id : nodePorts[1].id; // The x value of left port is supposed to be negative
          var rightPortId = nodePorts[0].x > 0 ? nodePorts[0].id : nodePorts[1].id; // The x value of right port is supposed to be positive
          /*
           * If the port ordering is left to right then the input port is the left port and the output port is the right port.
           * Else if it is right to left it is vice versa
           */
          nodeInputPortId = nodePortsOrdering === 'L-to-R' ? leftPortId : rightPortId;
          nodeOutputPortId = nodePortsOrdering === 'R-to-L' ? leftPortId : rightPortId;
        }
        else if ( nodePortsOrdering === 'T-to-B' || nodePortsOrdering === 'B-to-T' ){
          var topPortId = nodePorts[0].y < 0 ? nodePorts[0].id : nodePorts[1].id; // The y value of top port is supposed to be negative
          var bottomPortId = nodePorts[0].y > 0 ? nodePorts[0].id : nodePorts[1].id; // The y value of bottom port is supposed to be positive
          /*
           * If the port ordering is top to bottom then the input port is the top port and the output port is the bottom port.
           * Else if it is right to left it is vice versa
           */
          nodeInputPortId = nodePortsOrdering === 'T-to-B' ? topPortId : bottomPortId;
          nodeOutputPortId = nodePortsOrdering === 'B-to-T' ? topPortId : bottomPortId;
        }

        // Return an object containing the IO ports of the node
        return {
          inputPortId: nodeInputPortId,
          outputPortId: nodeOutputPortId
        };
      };

      // If at least one end of the edge has ports then we should determine the ports where the edge should be connected.
      if (sourceHasPorts || targetHasPorts) {
        var sourceNodeInputPortId, sourceNodeOutputPortId, targetNodeInputPortId, targetNodeOutputPortId;

        // If source node has ports set the variables dedicated for its IO ports
        if ( sourceHasPorts ) {
          var ioPorts = getIOPortIds(sourceNode);
          sourceNodeInputPortId = ioPorts.inputPortId;
          sourceNodeOutputPortId = ioPorts.outputPortId;
        }

        // If target node has ports set the variables dedicated for its IO ports
        if ( targetHasPorts ) {
          var ioPorts = getIOPortIds(targetNode);
          targetNodeInputPortId = ioPorts.inputPortId;
          targetNodeOutputPortId = ioPorts.outputPortId;
        }

        if (sbgnclass === 'consumption') {
          // A consumption edge should be connected to the input port of the target node which is supposed to be a process (any kind of)
          portsource = sourceNodeOutputPortId;
          porttarget = targetNodeInputPortId;
        }
        else if (sbgnclass === 'production') {
          // A production edge should be connected to the output port of the source node which is supposed to be a process (any kind of)
          // A modulation edge may have a logical operator as source node in this case the edge should be connected to the output port of it
          // The below assignment satisfy all of these condition
          if(groupID == 0 || groupID == undefined) { // groupID 0 for reversible reactions group 0
            portsource = sourceNodeOutputPortId;
            porttarget = targetNodeInputPortId;
          }
          else { //if reaction is reversible and edge belongs to group 1
            portsource = sourceNodeInputPortId;
          }
        }
        else if(elementUtilities.isModulationArcClass(sbgnclass) || elementUtilities.isAFArcClass(sbgnclass)){
          portsource = sourceNodeOutputPortId;
        }
        else if (sbgnclass === 'logic arc') {
          var srcClass = sourceNode.data('class');
          var tgtClass = targetNode.data('class');
          var isSourceLogicalOp = srcClass === 'and' || srcClass === 'or' || srcClass === 'not';
          var isTargetLogicalOp = tgtClass === 'and' || tgtClass === 'or' || tgtClass === 'not';

          if (isSourceLogicalOp && isTargetLogicalOp) {
            // If both end are logical operators then the edge should be connected to the input port of the target and the output port of the input
            porttarget = targetNodeInputPortId;
            portsource = sourceNodeOutputPortId;
          }// If just one end of logical operator then the edge should be connected to the input port of the logical operator
          else if (isSourceLogicalOp) {
            portsource = sourceNodeInputPortId;
            porttarget = targetNodeOutputPortId;
          }
          else if (isTargetLogicalOp) {
            portsource = sourceNodeOutputPortId;
            porttarget = targetNodeInputPortId;
          }
        }
      }

      // The default portsource/porttarget are the source/target themselves. If they are not set use these defaults.
      // The portsource and porttarget are determined set them in data object.
      data.portsource = portsource || source;
      data.porttarget = porttarget || target;

      var eles = cy.add({
        group: "edges",
        data: data,
        css: css
      });

      var newEdge = eles[eles.length - 1];

      return newEdge;
    };

    elementUtilities.addProcessWithConvenientEdges = function(_source, _target, nodeParams) {
      // If source and target IDs are given get the elements by IDs
      var source = typeof _source === 'string' ? cy.getElementById(_source) : _source;
      var target = typeof _target === 'string' ? cy.getElementById(_target) : _target;

      // Process parent should be the closest common ancestor of the source and target nodes
      var processParent = cy.collection([source[0], target[0]]).commonAncestors().first();

      // Process should be at the middle of the source and target nodes
      var x = ( source.position('x') + target.position('x') ) / 2;
      var y = ( source.position('y') + target.position('y') ) / 2;

      // Create the process with given/calculated variables
      var process = elementUtilities.addNode(x, y, nodeParams, undefined, processParent.id());
        var xdiff = source.position('x') - target.position('x');
        var ydiff = source.position('y') - target.position('y')
        if (Math.abs(xdiff) >= Math.abs(ydiff))
        {
            if (xdiff < 0)
                elementUtilities.setPortsOrdering(process, 'L-to-R');
            else
                elementUtilities.setPortsOrdering(process, 'R-to-L');
        }
        else
        {
            if (ydiff < 0)
                elementUtilities.setPortsOrdering(process, 'T-to-B');
            else
                elementUtilities.setPortsOrdering(process, 'B-to-T');
        }


      // Create the edges one is between the process and the source node (which should be a consumption),
      // the other one is between the process and the target node (which should be a production).
      // For more information please refer to SBGN-PD reference card.
      var edgeBtwSrc = elementUtilities.addEdge(source.id(), process.id(), {class : 'consumption', language : nodeParams.language});
      var edgeBtwTgt = elementUtilities.addEdge(process.id(), target.id(), {class : 'production', language : nodeParams.language});

      // Create a collection including the elements and to be returned
      var collection = cy.collection([process[0], edgeBtwSrc[0], edgeBtwTgt[0]]);
      return collection;
    };

    /*
     * This method assumes that param.nodesToMakeCompound contains at least one node
     * and all of the nodes including in it have the same parent. It creates a compound fot the given nodes an having the given type.
     */
    elementUtilities.createCompoundForGivenNodes = function (nodesToMakeCompound, compoundType) {
      var oldParentId = nodesToMakeCompound[0].data("parent");
      var language = nodesToMakeCompound[0].data("language");
      // if nodesToMakeCompound contain both PD and AF nodes, then set language of compound as Unknown
      for( var i=1; i<nodesToMakeCompound.length; i++){
        if(nodesToMakeCompound[i] != language){
          language = "Unknown";
          break;
        }
      }
      // The parent of new compound will be the old parent of the nodes to make compound. x, y and id parameters are not set.
      var newCompound = elementUtilities.addNode(undefined, undefined, {class : compoundType, language : language}, undefined, oldParentId);
      var newCompoundId = newCompound.id();
      var newEles = elementUtilities.changeParent(nodesToMakeCompound, newCompoundId);
      newEles = newEles.union(newCompound);
      return newEles;
    };

    /*
     * Creates a template reaction with given parameters. Requires cose-bilkent layout to tile the free macromolecules included
     * in the complex. Parameters are explained below.
     * templateType: The type of the template reaction. It may be 'association' or 'dissociation' for now.
     * nodeList: The list of the names and types of molecules which will involve in the reaction.
     * complexName: The name of the complex in the reaction.
     * processPosition: The modal position of the process in the reaction. The default value is the center of the canvas.
     * tilingPaddingVertical: This option will be passed to the cose-bilkent layout with the same name. The default value is 15.
     * tilingPaddingHorizontal: This option will be passed to the cose-bilkent layout with the same name. The default value is 15.
     * edgeLength: The distance between the process and the macromolecules at the both sides.
     */
    elementUtilities.createTemplateReaction = function (templateType, nodeList, complexName, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength, layoutParam) {

      var defaultMacromoleculProperties = elementUtilities.getDefaultProperties( "macromolecule" );
      var defaultSimpleChemicalProperties = elementUtilities.getDefaultProperties( "simple chemical" );
      var defaultProcessProperties = elementUtilities.getDefaultProperties( templateType );
      var processWidth = defaultProcessProperties.width || 50;
      var macromoleculeWidth = defaultMacromoleculProperties.width || 50;
      var macromoleculeHeight = defaultMacromoleculProperties.height || 50;
      var simpleChemicalWidth = defaultSimpleChemicalProperties.width || 35;
      var simpleChemicalHeight = defaultSimpleChemicalProperties.height || 35;
      var processPosition = processPosition || elementUtilities.convertToModelPosition({x: cy.width() / 2, y: cy.height() / 2});
      var nodeList = nodeList;
      var complexName = complexName;
      var numOfMolecules = nodeList.length;
      var tilingPaddingVertical = tilingPaddingVertical || 15;
      var tilingPaddingHorizontal = tilingPaddingHorizontal || 15;
      var edgeLength = edgeLength || 60;

      cy.startBatch();

      var xPositionOfFreeMacromolecules;
      var xPositionOfInputMacromolecules;
      if (!elementUtilities.getMapType()) {
        elementUtilities.setMapType("PD");
      }
      if (templateType === 'association') {
        xPositionOfFreeMacromolecules = processPosition.x - edgeLength - processWidth / 2 - macromoleculeWidth / 2;
       
      }
      else if(templateType === 'dissociation'){
        xPositionOfFreeMacromolecules = processPosition.x + edgeLength + processWidth / 2 + macromoleculeWidth / 2;
       
      }
      else{
        
        xPositionOfFreeMacromolecules = processPosition.x - edgeLength - processWidth / 2 - macromoleculeWidth / 2;
        xPositionOfInputMacromolecules = processPosition.x + edgeLength + processWidth / 2 + macromoleculeWidth / 2;
      }

      //Create the process in template type
      var process;
      if (templateType === 'reversible') {
        process = elementUtilities.addNode(processPosition.x, processPosition.y, {class : 'process', language : 'PD'});
        elementUtilities.setPortsOrdering(process, 'L-to-R');
      }
      else{
        process = elementUtilities.addNode(processPosition.x, processPosition.y, {class : templateType, language : 'PD'});
        elementUtilities.setPortsOrdering(process, 'L-to-R');
      }
      process.data('justAdded', true);

      //Define the starting y position
      var yPosition = processPosition.y - ((numOfMolecules - 1) / 2) * (macromoleculeHeight + tilingPaddingVertical);

      //Create the free molecules
      for (var i = 0; i < numOfMolecules; i++) {
        // node addition operation is determined by molecule type
        if(nodeList[i].type == "Simple Chemical"){
          var newNode = elementUtilities.addNode(xPositionOfFreeMacromolecules, yPosition, {class : 'simple chemical', language : 'PD'});
          //update the y position
          yPosition += simpleChemicalHeight + tilingPaddingVertical;
        }
        else{
          var newNode = elementUtilities.addNode(xPositionOfFreeMacromolecules, yPosition, {class : 'macromolecule', language : 'PD'});
          //update the y position
          yPosition += macromoleculeHeight + tilingPaddingVertical;
        }
        newNode.data('justAdded', true);
        newNode.data('label', nodeList[i].name);

        //create the edge connected to the new molecule
        var newEdge;
        if (templateType === 'association') {
          newEdge = elementUtilities.addEdge(newNode.id(), process.id(), {class : 'consumption', language : 'PD'});
        }
        else if(templateType === 'dissociation'){
          newEdge = elementUtilities.addEdge(process.id(), newNode.id(), {class : 'production', language : 'PD'});
        }
        else{
          //Group right or top elements in group id 1
          newEdge = elementUtilities.addEdge(process.id(), newNode.id(), {class : 'production', language : 'PD'}, undefined, undefined, 1);
        }

        newEdge.data('justAdded', true);
      }

      if(templateType === 'association' || templateType == 'dissociation'){
        //Create the complex including macromolecules inside of it
        //Temprorarily add it to the process position we will move it according to the last size of it
        var complex = elementUtilities.addNode(processPosition.x, processPosition.y, {class : 'complex', language : 'PD'});
        complex.data('justAdded', true);
        complex.data('justAddedLayoutNode', true);

        //If a name is specified for the complex set its label accordingly
        if (complexName) {
          complex.data('label', complexName);
        }

        //create the edge connnected to the complex
        var edgeOfComplex;

        if (templateType === 'association') {
          edgeOfComplex = elementUtilities.addEdge(process.id(), complex.id(), {class : 'production', language : 'PD'});
        }
        else {
          edgeOfComplex = elementUtilities.addEdge(complex.id(), process.id(), {class : 'consumption', language : 'PD'});
        }

        edgeOfComplex.data('justAdded', true);

        for (var i = 0; i < numOfMolecules; i++) {

          // Add a molecule(dependent on it's type) not having a previously defined id and having the complex created in this reaction as parent
          if(nodeList[i].type == 'Simple Chemical'){
            var newNode = elementUtilities.addNode(complex.position('x'), complex.position('y'), {class : 'simple chemical', language : 'PD'}, undefined, complex.id());
          }
          else{
            var newNode = elementUtilities.addNode(complex.position('x'), complex.position('y'), {class : 'macromolecule', language : 'PD'}, undefined, complex.id());
          }

          newNode.data('justAdded', true);
          newNode.data('label', nodeList[i].name);
          newNode.data('justAddedLayoutNode', true);
        }
      }
      else{

        //Create the input macromolecules
        var numOfInputMacromolecules = complexName.length;
        yPosition = processPosition.y - ((numOfInputMacromolecules - 1) / 2) * (macromoleculeHeight + tilingPaddingVertical);

        for (var i = 0; i < numOfInputMacromolecules; i++) {

          if(complexName[i].type == 'Simple Chemical'){
            var newNode = elementUtilities.addNode(xPositionOfInputMacromolecules, yPosition, {class : 'simple chemical', language : 'PD'});
            yPosition += simpleChemicalHeight + tilingPaddingVertical;
          }
          else{
            var newNode = elementUtilities.addNode(xPositionOfInputMacromolecules, yPosition, {class : 'macromolecule', language : 'PD'});
            yPosition += macromoleculeHeight + tilingPaddingVertical;
          }

          newNode.data('justAdded', true);
          newNode.data('label', complexName[i].name);

          //create the edge connected to the new macromolecule
          var newEdge;

          //Group the left or bottom elements in group id 0
          newEdge = elementUtilities.addEdge(process.id(), newNode.id(), {class : 'production', language : 'PD'}, undefined, undefined, 0);
          newEdge.data('justAdded', true);

        }
      }

      cy.endBatch();

      var layoutNodes = cy.nodes('[justAddedLayoutNode]');
      layoutNodes.removeData('justAddedLayoutNode');
      var layout = layoutNodes.layout({
        name: layoutParam.name,
        randomize: false,
        fit: false,
        animate: false,
        tilingPaddingVertical: tilingPaddingVertical,
        tilingPaddingHorizontal: tilingPaddingHorizontal,
        stop: function () {
          //If it is a reversible reaction no need to re-position complexes
          if(templateType === 'reversible')
            return;
          //re-position the nodes inside the complex
          var supposedXPosition;
          var supposedYPosition = processPosition.y;

          if (templateType === 'association') {
            supposedXPosition = processPosition.x + edgeLength + processWidth / 2 + complex.outerWidth() / 2;
          }
          else {
            supposedXPosition = processPosition.x - edgeLength - processWidth / 2 - complex.outerWidth() / 2;
          }

          var positionDiffX = (supposedXPosition - complex.position('x')) / 2;
          var positionDiffY = (supposedYPosition - complex.position('y')) / 2;
          elementUtilities.moveNodes({x: positionDiffX, y: positionDiffY}, complex);
        }
      });

      // Do this check for cytoscape.js backward compatibility
      if (layout && layout.run && templateType !== 'reversible') {
        layout.run();
      }

      //filter the just added elememts to return them and remove just added mark
      var eles = cy.elements('[justAdded]');
      eles.removeData('justAdded');

      cy.elements().unselect();
      eles.select();

      return eles; // Return the just added elements
    };

    /*
     * Move the nodes to a new parent and change their position if possDiff params are set.
     */
    elementUtilities.changeParent = function(nodes, newParent, posDiffX, posDiffY) {
      var newParentId = newParent == undefined || typeof newParent === 'string' ? newParent : newParent.id();
      var movedEles = nodes.move({"parent": newParentId});
      if(typeof posDiffX != 'undefined' || typeof posDiffY != 'undefined') {
        elementUtilities.moveNodes({x: posDiffX, y: posDiffY}, nodes);
      }
      elementUtilities.maintainPointer(movedEles);
      return movedEles;
    };

    elementUtilities.updateInfoboxStyle = function( node, index, newProps ) {
      var infoboxObj = node.data('statesandinfos')[index];
      $.extend( infoboxObj.style, newProps );
      cy.style().update();
    };

    elementUtilities.updateInfoboxObj = function( node, index, newProps ) {
      var infoboxObj = node.data('statesandinfos')[index];
      $.extend( infoboxObj, newProps );
    };

    // Resize given nodes if useAspectRatio is truthy one of width or height should not be set.
    elementUtilities.resizeNodes = function (nodes, width, height, useAspectRatio, preserveRelativePos) {
      for (var i = 0; i < nodes.length; i++) {

        var node = nodes[i];
        var ratio = undefined;
        var eleMustBeSquare = elementUtilities.mustBeSquare(node.data('class'));

        if (preserveRelativePos === true) {
          var oldWidth = node.data("bbox").w;
          var oldHeight = node.data("bbox").h;
        }

        // Note that both width and height should not be set if useAspectRatio is truthy
        if(!node.isParent()){
          if (width) {
            if (useAspectRatio || eleMustBeSquare) {
              ratio = width / node.width();
            }
  
            node.data("bbox").w = width;
          }
  
          if (height) {
            if (useAspectRatio || eleMustBeSquare) {
              ratio = height / node.height();
            }
  
            node.data("bbox").h = height;
          }
  
          if (ratio && !height) {
            node.data("bbox").h = node.height() * ratio;
          }
          else if (ratio && !width) {
            node.data("bbox").w = node.width() * ratio;
          }
        }else{
          node.data("minHeight" , ""+ height);
          node.data("minWidth" , ""+ width);
          node.data("minWidthBiasLeft", "50%");
          node.data("minWidthBiasRight", "50%");
          node.data("minHeightBiasTop", "50%" );
          node.data("minHeightBiasBottom", "50%");
        }
        

     /*    if (preserveRelativePos === true) {
          var statesandinfos = node.data('statesandinfos');
          var topBottom = statesandinfos.filter(box => (box.anchorSide === "top" || box.anchorSide === "bottom"));
          var rightLeft = statesandinfos.filter(box => (box.anchorSide === "right" || box.anchorSide === "left"));

          topBottom.forEach(function(box){
            if (box.bbox.x < 0) {
              box.bbox.x = 0;
            }
            else if (box.bbox.x > oldWidth) {
              box.bbox.x = oldWidth;
            }
            box.bbox.x = node.data("bbox").w * box.bbox.x / oldWidth;
          });

          rightLeft.forEach(function(box){
            if (box.bbox.y < 0) {
              box.bbox.y = 0;
            }
            else if (box.bbox.y > oldHeight) {
              box.bbox.y = oldHeight;
            }
            box.bbox.y = node.data("bbox").h * box.bbox.y / oldHeight;
          });
        } */
      }
    };

    elementUtilities.calculateMinWidth = function(node) {

        var defaultWidth = this.getDefaultProperties(node.data('class')).width;

        // Label width calculation
        var style = node.style();

        var fontFamiliy = style['font-family'];
        var fontSize = style['font-size'];
        var labelText = style['label'];

        var labelWidth = elementUtilities.getWidthByContent( labelText, fontFamiliy, fontSize );

        var statesandinfos = node.data('statesandinfos');
        //Top and bottom infoBoxes
        //var topInfoBoxes = statesandinfos.filter(box => (box.anchorSide === "top" || ((box.anchorSide === "right" || box.anchorSide === "left") && (box.bbox.y <= 12))));
        //var bottomInfoBoxes = statesandinfos.filter(box => (box.anchorSide === "bottom" || ((box.anchorSide === "right" || box.anchorSide === "left") && (box.bbox.y >= node.data('bbox').h - 12))));
        var unitGap = 5;
        var topIdealWidth = unitGap;
        var bottomIdealWidth = unitGap;        
        var rightMaxWidth = 0;
        var leftMaxWidth =0;
        statesandinfos.forEach(function(box){
          if(box.anchorSide === "top"){
            topIdealWidth += box.bbox.w + unitGap;

          }else if(box.anchorSide === "bottom"){
            bottomIdealWidth += box.bbox.w + unitGap;

          }else if(box.anchorSide === "right")
          {           
            rightMaxWidth = (box.bbox.w > rightMaxWidth) ? box.bbox.w : rightMaxWidth;
          }else{
            
            leftMaxWidth = (box.bbox.w > leftMaxWidth) ? box.bbox.w : leftMaxWidth;
          }
        });      

        var middleWidth = labelWidth + 2 * Math.max(rightMaxWidth/2, leftMaxWidth/2);

        var compoundWidth = 0;
        if(node.isParent()){
          compoundWidth = node.children().boundingBox().w;
        }
        return Math.max(middleWidth, defaultWidth/2, topIdealWidth, bottomIdealWidth, compoundWidth);
    }

    elementUtilities.calculateMinHeight = function(node) {
        var statesandinfos = node.data('statesandinfos');
        var margin = 7;
        var unitGap = 5;
        var defaultHeight = this.getDefaultProperties(node.data('class')).height;
        var leftInfoBoxes = statesandinfos.filter(box => box.anchorSide === "left");        
        var leftHeight = unitGap; 
        leftInfoBoxes.forEach(function(box){
            leftHeight += box.bbox.h + unitGap;
           
        });      
        var rightInfoBoxes = statesandinfos.filter(box => box.anchorSide === "right");
        var rightHeight = unitGap;        
        rightInfoBoxes.forEach(function(box){
            rightHeight += box.bbox.h + unitGap;           
        });       
        var style = node.style();
        var labelText = ((style['label']).split("\n")).filter( text => text !== '');
        var fontSize = parseFloat(style['font-size'].substring(0, style['font-size'].length - 2));
        var totalHeight = labelText.length * fontSize + 2 * margin;

        

        var compoundHeight = 0;
        if(node.isParent()){
          compoundHeight = node.children().boundingBox().h;
        }
        return Math.max(totalHeight, defaultHeight/2, leftHeight, rightHeight, compoundHeight);
    }

    elementUtilities.isResizedToContent = function (node) {
      if(!node || !node.isNode() || !node.data('bbox')){
        return false;
      }

      //var w = node.data('bbox').w;
      //var h = node.data('bbox').h;
      var w = node.width();
      var h = node.height();

      var minW = elementUtilities.calculateMinWidth(node);
      var minH = elementUtilities.calculateMinHeight(node);

      if(w === minW && h === minH)
        return true;
      else
        return false;
    }

    // Section End
    // Add remove utilities

    // Relocates state and info boxes. This function is expected to be called after add/remove state and info boxes
    elementUtilities.relocateStateAndInfos = function (ele) {
      var stateAndInfos = (ele.isNode && ele.isNode()) ? ele.data('statesandinfos') : ele;
      var length = stateAndInfos.length;
      if (length == 0) {
        return;
      }
      else if (length == 1) {
        stateAndInfos[0].bbox.x = 0;
        stateAndInfos[0].bbox.y = -50;
      }
      else if (length == 2) {
        stateAndInfos[0].bbox.x = 0;
        stateAndInfos[0].bbox.y = -50;

        stateAndInfos[1].bbox.x = 0;
        stateAndInfos[1].bbox.y = 50;
      }
      else if (length == 3) {
        stateAndInfos[0].bbox.x = -25;
        stateAndInfos[0].bbox.y = -50;

        stateAndInfos[1].bbox.x = 25;
        stateAndInfos[1].bbox.y = -50;

        stateAndInfos[2].bbox.x = 0;
        stateAndInfos[2].bbox.y = 50;
      }
      else {
        stateAndInfos[0].bbox.x = -25;
        stateAndInfos[0].bbox.y = -50;

        stateAndInfos[1].bbox.x = 25;
        stateAndInfos[1].bbox.y = -50;

        stateAndInfos[2].bbox.x = -25;
        stateAndInfos[2].bbox.y = 50;

        stateAndInfos[3].bbox.x = 25;
        stateAndInfos[3].bbox.y = 50;
      }
    };

    // Change state value or unit of information box of given nodes with given index.
    // Type parameter indicates whether to change value or variable, it is valid if the box at the given index is a state variable.
    // Value parameter is the new value to set.
    // This method returns the old value of the changed data (We assume that the old value of the changed data was the same for all nodes).
    // Each character assumed to occupy 8 unit
    // Each infobox can have at most 32 units of width
    elementUtilities.changeStateOrInfoBox = function (nodes, index, value, type) {
      var result;
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var sbgnclass = node.data('class');
        var stateAndInfos = node.data('statesandinfos');
        var box = stateAndInfos[index];
        var oldLength = box.bbox.w;
        var newLength = 0;

        var content = '';
        if (box.clazz == "state variable") {
          if (!result) {
            result = box.state[type];
          }

          box.state[type] = value;
          if (box.state["value"] !== undefined) {
            content += box.state["value"];
          }
          if (box.state["variable"] !== undefined && box.state["variable"].length > 0) {
            content += box.state["variable"] + "@";
          }

        }
        else if (box.clazz == "unit of information") {
          if (!result) {
            result = box.label.text;
          }
          content += value;
          box.label.text = value;
        }

        var min = ( sbgnclass === 'SIF macromolecule' || sbgnclass === 'SIF simple chemical' ) ? 15 : 12;
        var fontFamily = box.style[ 'font-family' ];
        var fontSize = box.style[ 'font-size' ];
        var borderWidth = box.style[ 'border-width' ];
        var opts = {
          min,
          max: 48,
          margin: borderWidth / 2 + 0.5
        };
        var previousWidth = box.bbox.w;
        box.bbox.w = elementUtilities.getWidthByContent( content, fontFamily, fontSize, opts );

        if(box.anchorSide == "top" || box.anchorSide == "bottom"){
          var unitLayout = node.data()["auxunitlayouts"][box.anchorSide];
          if(unitLayout.units[unitLayout.units.length-1].id == box.id){
             
            var borderWidth = node.data()['border-width'];
            var shiftAmount = (((box.bbox.w - previousWidth) / 2) * 100 )/ (node.outerWidth() - borderWidth);
           
            if(shiftAmount >= 0){
            
              if(box.bbox.x + shiftAmount <= 100){
                box.bbox.x = box.bbox.x + shiftAmount;
              }
            }
           /*  else{
              var previousInfoBbox = {x : 0, w:0};
              if(unitLayout.units.length > 1){
                previousInfoBbox= unitLayout.units[unitLayout.units.length-2].bbox;      
              }

              
              
              sbgnvizInstance.classes.AuxUnitLayout.setIdealGap(node, box.anchorSide);
              var idealGap = sbgnvizInstance.classes.AuxUnitLayout.getCurrentGap(box.anchorSide);
              var newPosition = previousInfoBbox.x + (previousInfoBbox.w/2 + idealGap + box.bbox.w/2)*100 / (node.outerWidth() - borderWidth);
              box.bbox.x = newPosition;
              
            } */
           
           
          }
        }
        
        
        /* if (box.anchorSide === "top" || box.anchorSide === "bottom") {
          box.bbox.x += (box.bbox.w - oldLength) / 2;
          var units = (node.data('auxunitlayouts')[box.anchorSide]).units;
          var shiftIndex = 0;
          for (var i = 0; i < units.length; i++) {
            if(units[i] === box){
              shiftIndex = i;
              break;
            }
          }
          for (var j = shiftIndex+1; j < units.length; j++) {
              units[j].bbox.x += (box.bbox.w - oldLength);
          }
        } */

      }

      //TODO find a way to elimate this redundancy to update info-box positions
      node.data('border-width', node.data('border-width'));

      return result;
    };

    // Add a new state or info box to given nodes.
    // The box is represented by the parameter obj.
    // This method returns the index of the just added box.
    elementUtilities.addStateOrInfoBox = function (nodes, obj) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var locationObj;

        var defaultProps = elementUtilities.getDefaultProperties( node.data('class') );
        var infoboxProps = defaultProps[ obj.clazz ];
        var bbox = obj.bbox || { w: infoboxProps.width, h: infoboxProps.height };        
        var style = elementUtilities.getDefaultInfoboxStyle( node.data('class'), obj.clazz );
        if(obj.style){
          $.extend( style, obj.style );
        }
       
        if(obj.clazz == "unit of information") {
          locationObj = sbgnvizInstance.classes.UnitOfInformation.create(node, cy, obj.label.text, bbox, obj.location, obj.position, style, obj.index, obj.id);
        }
        else if (obj.clazz == "state variable") {
          locationObj = sbgnvizInstance.classes.StateVariable.create(node, cy, obj.state.value, obj.state.variable, bbox, obj.location, obj.position, style, obj.index, obj.id);
        }
      }
      return locationObj;
    };

    // Remove the state or info boxes of the given nodes at given index.
    // Returns the removed box.
    elementUtilities.removeStateOrInfoBox = function (nodes, locationObj) {
      var obj;
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var stateAndInfos = node.data('statesandinfos');
        var unit = stateAndInfos[locationObj.index];

        var unitClass = sbgnvizInstance.classes.getAuxUnitClass(unit);

        obj = unitClass.remove(unit, cy);
      }

      return obj;
    };


    //Tiles informations boxes for given anchorSides
    elementUtilities.fitUnits = function (node, locations) {
      var obj = [];
      node.data('statesandinfos').forEach( function (ele) {
        obj.push({
          x: ele.bbox.x,
          y: ele.bbox.y,
          anchorSide: ele.anchorSide
        });
      });
      sbgnvizInstance.classes.AuxUnitLayout.fitUnits(node, cy, locations);
      return obj;
    };

    //Check which anchorsides fits
    elementUtilities.checkFit = function (node, location) { //if no location given, it checks all possible locations
      return sbgnvizInstance.classes.AuxUnitLayout.checkFit(node, cy, location);
    };

    //Modify array of aux layout units
    elementUtilities.modifyUnits = function (node, unit, anchorSide) {
      sbgnvizInstance.classes.AuxUnitLayout.modifyUnits(node, unit, anchorSide, cy);
    };

    // Set multimer status of the given nodes to the given status.
    elementUtilities.setMultimerStatus = function (nodes, status) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var sbgnclass = node.data('class');
        var isMultimer = node.data('class').endsWith(' multimer');

        if (status) { // Make multimer status true
          if (!isMultimer) {
            node.data('class', sbgnclass + ' multimer');
          }
        }
        else { // Make multimer status false
          if (isMultimer) {
            node.data('class', sbgnclass.replace(' multimer', ''));
          }
        }
      }
    };

    // Change font properties of the given elements with given font data
    elementUtilities.changeFontProperties = function (eles, data) {
      for (var prop in data) {
        eles.data(prop, data[prop]);
      }
    };

    // This function gets an edge, and ends of that edge (Optionally it may take just the classes of the edge as well) as parameters.
    // It may return 'valid' (that ends is valid for that edge), 'reverse' (that ends is not valid for that edge but they would be valid
    // if you reverse the source and target), 'invalid' (that ends are totally invalid for that edge).
    elementUtilities.validateArrowEnds = function (edge, source, target) {
      // if map type is Unknown -- no rules applied
      if (elementUtilities.getMapType() == "HybridAny" || elementUtilities.getMapType() == "HybridSbgn" || !elementUtilities.getMapType())
        return "valid";

      var edgeclass = typeof edge === 'string' ? edge : edge.data('class');
      var sourceclass = source.data('class');
      var targetclass = target.data('class');
      var mapType = elementUtilities.getMapType();
      var edgeConstraints = elementUtilities[mapType].connectivityConstraints[edgeclass];

      if (mapType == "AF"){
        if (sourceclass.startsWith("BA")) // we have separate classes for each biological activity
          sourceclass = "biological activity"; // but same rule applies to all of them

        if (targetclass.startsWith("BA")) // we have separate classes for each biological activity
          targetclass = "biological activity"; // but same rule applies to all of them
      }
      else if (mapType == "PD"){
        sourceclass = sourceclass.replace(/\s*multimer$/, '');
        targetclass = targetclass.replace(/\s*multimer$/, '');
      }

      // given a node, acting as source or target, returns boolean wether or not it has too many edges already
      function hasTooManyEdges(node, sourceOrTarget) {
        var nodeclass = node.data('class');
        nodeclass = nodeclass.replace(/\s*multimer$/, '');
        if (nodeclass.startsWith("BA"))
          nodeclass = "biological activity";

        var totalTooMany = true;
        var edgeTooMany = true;
        if (sourceOrTarget == "source") {
            var sameEdgeCountOut = node.outgoers('edge[class="'+edgeclass+'"]').size();
            var totalEdgeCountOut = node.outgoers('edge').size();
            // check that the total edge count is within the limits
            if (typeof edgeConstraints[nodeclass].asSource.maxTotal == 'undefined'
                || totalEdgeCountOut < edgeConstraints[nodeclass].asSource.maxTotal ) {
                totalTooMany = false;
            }
            // then check limits for this specific edge class
            if (typeof edgeConstraints[nodeclass].asSource.maxEdge == 'undefined'
                || sameEdgeCountOut < edgeConstraints[nodeclass].asSource.maxEdge ) {
                edgeTooMany = false;
            }
            // if only one of the limits is reached then edge is invalid
            return totalTooMany || edgeTooMany;
        }
        else { // node is used as target
            var sameEdgeCountIn = node.incomers('edge[class="'+edgeclass+'"]').size();
            var totalEdgeCountIn = node.incomers('edge').size();
            if (typeof edgeConstraints[nodeclass].asTarget.maxTotal == 'undefined'
                || totalEdgeCountIn < edgeConstraints[nodeclass].asTarget.maxTotal ) {
                totalTooMany = false;
            }
            if (typeof edgeConstraints[nodeclass].asTarget.maxEdge == 'undefined'
                || sameEdgeCountIn < edgeConstraints[nodeclass].asTarget.maxEdge ) {
                edgeTooMany = false;
            }
            return totalTooMany || edgeTooMany;
        }
        return false;
      }

      function isInComplex(node) {
        var parentClass = node.parent().data('class');
        return parentClass && parentClass.startsWith('complex');
      }

      if (isInComplex(source) || isInComplex(target)) { // subunits of a complex are no longer EPNs, no connection allowed
        return 'invalid';
      }

      // check nature of connection
      if (edgeConstraints[sourceclass].asSource.isAllowed && edgeConstraints[targetclass].asTarget.isAllowed) {
        // check amount of connections
        if (!hasTooManyEdges(source, "source") && !hasTooManyEdges(target, "target") ) {
          return 'valid';
        }
      }
      // try to reverse
      if (edgeConstraints[targetclass].asSource.isAllowed && edgeConstraints[sourceclass].asTarget.isAllowed) {
        if (!hasTooManyEdges(target, "source") && !hasTooManyEdges(source, "target") ) {
          return 'reverse';
        }
      }
      return 'invalid';
    };

    elementUtilities.deleteAndPerformLayout = function(eles, layoutparam) {
      var result = eles.remove();
      if (typeof layoutparam === 'function') {
        layoutparam(); // If layoutparam is a function execute it
      }
      else {
          var layout = cy.layout(layoutparam); // If layoutparam is layout options call layout with that options.

          // Do this check for cytoscape.js backward compatibility
          if (layout && layout.run) {
              layout.run();
          }
      }

      return result;
    };

    /*
     * Hide given eles and perform given layout afterward. Layout parameter may be layout options
     * or a function to call.
     */
    elementUtilities.hideAndPerformLayout = function(eles, layoutparam) {
        var result = cy.viewUtilities().hide(eles); // Hide given eles
        if (typeof layoutparam === 'function') {
            layoutparam(); // If layoutparam is a function execute it
        }
        else {
            var layout = cy.layout(layoutparam); // If layoutparam is layout options call layout with that options.

            // Do this check for cytoscape.js backward compatibility
            if (layout && layout.run) {
                layout.run();
            }
        }

        return result;
    };

    /*
     * Unhide given eles and perform given layout afterward. Layout parameter may be layout options
     * or a function to call.
     */
    elementUtilities.showAndPerformLayout = function(eles, layoutparam) {
      var result = cy.viewUtilities().show(eles); // Show given eles
      if (typeof layoutparam === 'function') {
        layoutparam(); // If layoutparam is a function execute it
      }
      else {
        var layout = cy.layout(layoutparam); // If layoutparam is layout options call layout with that options.

        // Do this check for cytoscape.js backward compatibility
        if (layout && layout.run) {
          layout.run();
        }
      }

      return result;
    };

    /*
     * Change style/css of given eles by setting getting property name to the given value/values (Note that valueMap parameter may be
     * a single string or an id to value map).
     */
    elementUtilities.changeCss = function(eles, name, valueMap) {
      if ( typeof valueMap === 'object' ) {
        cy.startBatch();
        for (var i = 0; i < eles.length; i++) {
          var ele = cy.getElementById(eles[i].id());
          ele.css(name, valueMap[ele.id()]); // valueMap is an id to value map use it in this way
        }
        cy.endBatch();
      }
      else {
        eles.css(name, valueMap); // valueMap is just a string set css('name') for all eles to this value
      }
    };

    /*
     * Change data of given eles by setting getting property name to the given value/values (Note that valueMap parameter may be
     * a single string or an id to value map).
     */
    elementUtilities.changeData = function(eles, name, valueMap) {
      if ( typeof valueMap === 'object' ) {
        cy.startBatch();
        for (var i = 0; i < eles.length; i++) {
          var ele = cy.getElementById(eles[i].id());
          ele.data(name, valueMap[ele.id()]); // valueMap is an id to value map use it in this way
        }
        cy.endBatch();
      }
      else {
        eles.data(name, valueMap); // valueMap is just a string set css('name') for all eles to this value
      }
    };

    elementUtilities.updateSetField = function(ele, fieldName, toDelete, toAdd, callback) {
      var set = ele.data( fieldName );
      if ( !set ) {
        return;
      }
      var updates = {};

      if ( toDelete != null && set[ toDelete ] ) {
        delete set[ toDelete ];
        updates.deleted = toDelete;
      }

      if ( toAdd != null ) {
        set[ toAdd ] = true;
        updates.added = toAdd;
      }

      if ( callback && ( updates[ 'deleted' ] != null || updates[ 'added' ] != null ) ) {
        callback();
      }

      return updates;
    };

    /*
     * Return the set of all nodes present under the given position
     * renderedPos must be a point defined relatively to cytoscape container
     * (like renderedPosition field of a node)
     */
    elementUtilities.getNodesAt = function(renderedPos) {
      var nodes = cy.nodes();
      var x = renderedPos.x;
      var y = renderedPos.y;
      var resultNodes = [];
      for(var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var renderedBbox = node.renderedBoundingBox({
          includeNodes: true,
          includeEdges: false,
          includeLabels: false,
          includeShadows: false
        });
        if (x >= renderedBbox.x1 && x <= renderedBbox.x2) {
          if (y >= renderedBbox.y1 && y <= renderedBbox.y2) {
            resultNodes.push(node);
          }
        }
      }
      return resultNodes;
    };

    elementUtilities.demultimerizeClass = function(sbgnclass) {
      return sbgnclass.replace(" multimer", "");
    };

    /**
     * @param mapType - type of the current map (PD, AF or Unknown)
     */
    elementUtilities.setMapType = function(mapType){
      elementUtilities.mapType = mapType;
      return mapType;
    }

    /**
     * return - map type
     */
    elementUtilities.getMapType = function(){
        return elementUtilities.mapType;
    }
    /**
     * Resets map type
     */
    elementUtilities.resetMapType = function(){
        elementUtilities.mapType = undefined;
    }

    /**
     * Keep consistency of links to self inside the data() structure.
     * This is needed whenever a node changes parents, for example,
     * as it is destroyed and recreated. But the data() stays identical.
     * This creates inconsistencies for the pointers stored in data(),
     * as they now point to a deleted node.
     */
    elementUtilities.maintainPointer = function (eles) {
      eles.nodes().forEach(function(ele){
        // restore background images
        ele.emit('data');

        // skip nodes without any auxiliary units
        if(!ele.data('statesandinfos') || ele.data('statesandinfos').length == 0) {
          return;
        }
        for(var side in ele.data('auxunitlayouts')) {
          ele.data('auxunitlayouts')[side].parentNode = ele.id();
        }
        for(var i=0; i < ele.data('statesandinfos').length; i++) {
          ele.data('statesandinfos')[i].parent = ele.id();
        }
      });
    }

    elementUtilities.anyHasBackgroundImage = function (eles) {
      var obj = elementUtilities.getBackgroundImageObjs(eles);
      if(obj === undefined)
        return false;
      else{
        for(var key in obj){
          var value = obj[key];
          if(value && !$.isEmptyObject(value))
            return true;
        }
        return false;
      }
    }

    elementUtilities.hasBackgroundImage = function (ele) {
      if(ele.isNode()){
        var bg = ele.data('background-image') ? ele.data('background-image') : "";
        var cloneImg = 'data:image/svg+xml;utf8,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20style%3D%22fill%3Anone%3Bstroke%3Ablack%3Bstroke-width%3A0%3B%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22100%22%20height%3D%22100%22%20style%3D%22fill%3A%23a9a9a9%22/%3E%20%3C/svg%3E';
        if(bg !== "" && !(bg.indexOf(cloneImg) > -1 && bg === cloneImg))
          return true;

      }
      return false;
    }

    elementUtilities.getBackgroundImageURL = function (eles) {
      if(!eles || eles.length < 1)
        return;

      var commonURL = "";
      for(var i = 0; i < eles.length; i++){
        var ele = eles[i];

        if(!ele.isNode() || !elementUtilities.hasBackgroundImage(ele))
          return;

        var url = ele.data('background-image').split(" ").pop();
        if(!url || url.indexOf('http') !== 0 || (commonURL !== "" && commonURL !== url))
          return;
        else if(commonURL === "")
          commonURL = url;
      }

      return commonURL;
    }

    elementUtilities.getBackgroundImageObjs = function (eles) {
      if(!eles || eles.length < 1)
        return;

      var list = {};
      for(var i = 0; i < eles.length; i++){
        var ele = eles[i];
        var obj = getBgObj(ele);
        if(obj === undefined)
          return;

        list[ele.data('id')] = obj;
      }
      return list;

      function getBgObj (ele) {
        if(ele.isNode() && elementUtilities.hasBackgroundImage(ele)){
          var keys = ['background-image', 'background-fit', 'background-image-opacity',
          'background-position-x', 'background-position-y', 'background-height', 'background-width'];

          var obj = {};
          keys.forEach(function(key){
            var arr = ele.data(key);
            obj[key] = arr ? arr : "";
          });

          return obj;
        }
        else if(ele.isNode())
          return {};
      }
    }

    elementUtilities.getBackgroundFitOptions = function (eles) {
      if(!eles || eles.length < 1)
        return;

      var commonFit = "";
      for(var i = 0; i < eles.length; i++){
        var node = eles[i];
        if(!node.isNode())
          return;

        var fit = getFitOption(node);
        if(!fit || (commonFit !== "" && fit !== commonFit))
          return;
        else if(commonFit === "")
          commonFit = fit;
      }

      var options = '<option value="none">None</option>'
                  + '<option value="fit">Fit</option>'
                  + '<option value="cover">Cover</option>'
                  + '<option value="contain">Contain</option>';
      var searchKey = 'value="' + commonFit + '"';
      var index = options.indexOf(searchKey) + searchKey.length;
      return options.substr(0, index) + ' selected' + options.substr(index);

      function getFitOption(node) {
        if(!elementUtilities.hasBackgroundImage(node))
          return;

        var f = node.data('background-fit');
        var h = node.data('background-height');

        if(!f || !h)
          return;

        f = f.split(" ");
        h = h.split(" ");
        if(f[f.length-1] === "none")
          return (h[h.length-1] === "auto" ? "none" : "fit");
        else
          return f[f.length-1];
      }
    }

    elementUtilities.updateBackgroundImage = function (nodes, bgObj) {
      if(!nodes || nodes.length == 0 || !bgObj)
        return;

      for(var i = 0; i < nodes.length; i++){
        var node = nodes[i];
        var obj = bgObj[node.data('id')];
        if(!obj || $.isEmptyObject(obj))
          continue;

        var imgs = node.data('background-image') ? node.data('background-image').split(" ") : [];
        var xPos = node.data('background-position-x') ? node.data('background-position-x').split(" ") : [];
        var yPos = node.data('background-position-y') ? node.data('background-position-y').split(" ") : [];
        var widths = node.data('background-width') ? node.data('background-width').split(" ") : [];
        var heights = node.data('background-height') ? node.data('background-height').split(" ") : [];
        var fits = node.data('background-fit') ? node.data('background-fit').split(" ") : [];
        var opacities = node.data('background-image-opacity') ? ("" + node.data('background-image-opacity')).split(" ") : [];

        var index = -1;
        if(typeof obj['background-image'] === "string")
          index = imgs.indexOf(obj['background-image']);
        else if(Array.isArray(obj['background-image']))
          index = imgs.indexOf(obj['background-image'][0]);

        if(index < 0)
          continue;

        if(obj['background-image'] && imgs.length > index){
          var tmp = imgs[index];
          imgs[index] = obj['background-image'];
          obj['background-image'] = tmp;
        }
        if(obj['background-fit'] && fits.length > index){
          var tmp = fits[index];
          fits[index] = obj['background-fit'];
          obj['background-fit'] = tmp;
        }
        if(obj['background-width'] && widths.length > index){
          var tmp = widths[index];
          widths[index] = obj['background-width'];
          obj['background-width'] = tmp;
        }
        if(obj['background-height'] && heights.length > index){
          var tmp = heights[index];
          heights[index] = obj['background-height'];
          obj['background-height'] = tmp;
        }
        if(obj['background-position-x'] && xPos.length > index){
          var tmp = xPos[index];
          xPos[index] = obj['background-position-x'];
          obj['background-position-x'] = tmp;
        }
        if(obj['background-position-y'] && yPos.length > index){
          var tmp = yPos[index];
          yPos[index] = obj['background-position-y'];
          obj['background-position-y'] = tmp;
        }
        if(obj['background-image-opacity'] && opacities.length > index){
          var tmp = opacities[index];
          opacities[index] = obj['background-image-opacity'];
          obj['background-image-opacity'] = tmp;
        }

        node.data('background-image', imgs.join(" "));
        node.data('background-position-x', xPos.join(" "));
        node.data('background-position-y', yPos.join(" "));
        node.data('background-width', widths.join(" "));
        node.data('background-height', heights.join(" "));
        node.data('background-fit', fits.join(" "));
        node.data('background-image-opacity', opacities.join(" "));
      }

      return bgObj;
    }

    elementUtilities.changeBackgroundImage = function (nodes, oldImg, newImg, firstTime, updateInfo, promptInvalidImage, validateURL) {
      if(!nodes || nodes.length == 0 || !oldImg || !newImg)
        return;

      elementUtilities.removeBackgroundImage(nodes, oldImg);
      for(var key in newImg){
        newImg[key]['firstTime'] = firstTime;
      }
      elementUtilities.addBackgroundImage(nodes, newImg, updateInfo, promptInvalidImage, validateURL);

      return {
        nodes: nodes,
        oldImg: newImg,
        newImg: oldImg,
        firstTime: false,
        promptInvalidImage: promptInvalidImage,
        validateURL: validateURL
      };
    }

    // Add a background image to given nodes.
    elementUtilities.addBackgroundImage = function (nodes, bgObj, updateInfo, promptInvalidImage, validateURL) {
      if(!nodes || nodes.length == 0 || !bgObj)
        return;

      for(var i = 0; i < nodes.length; i++){
        var node = nodes[i];
        var obj = bgObj[node.data('id')];
        if(!obj || $.isEmptyObject(obj))
          continue;

        // Load the image from local, else just put the URL
        if(obj['fromFile'])
        loadBackgroundThenApply(node, obj);
        // Validity of given URL should be checked before applying it
        else if(obj['firstTime']){
          if(typeof validateURL === 'function')
            validateURL(node, obj, applyBackground, promptInvalidImage);
          else
            checkGivenURL(node, obj);
        }
        else
          applyBackground(node, obj);
      }

      function loadBackgroundThenApply(node, bgObj) {
        var reader = new FileReader();
        var imgFile = bgObj['background-image'];

        // Check whether given file is an image file
        if(imgFile.type.indexOf("image") !== 0){
          if(promptInvalidImage)
            promptInvalidImage("Invalid image file is given!");
          return;
        }

        reader.readAsDataURL(imgFile);

        reader.onload = function (e) {
          var img = reader.result;
          if(img){
            bgObj['background-image'] = img;
            bgObj['fromFile'] = false;
            applyBackground(node, bgObj);
          }
          else{
            if(promptInvalidImage)
              promptInvalidImage("Given file could not be read!");
          }
        };
      }

      function checkGivenURL(node, bgObj){
        var url = bgObj['background-image'];
        var extension = (url.split(/[?#]/)[0]).split(".").pop();
        var validExtensions = ["png", "svg", "jpg", "jpeg"];

        if(!validExtensions.includes(extension)){
          if(typeof promptInvalidImage === 'function')
            promptInvalidImage("Invalid URL is given!");
          return;
        }

        $.ajax({
          url: url,
          type: 'GET',
          success: function(result, status, xhr){
            applyBackground(node, bgObj);
          },
          error: function(xhr, status, error){
            if(promptInvalidImage)
              promptInvalidImage("Invalid URL is given!");
          },
        });
      }

      function applyBackground(node, bgObj) {

        if(elementUtilities.hasBackgroundImage(node))
          return;

        var imgs = node.data('background-image') ? node.data('background-image').split(" ") : [];
        var xPos = node.data('background-position-x') ? node.data('background-position-x').split(" ") : [];
        var yPos = node.data('background-position-y') ? node.data('background-position-y').split(" ") : [];
        var widths = node.data('background-width') ? node.data('background-width').split(" ") : [];
        var heights = node.data('background-height') ? node.data('background-height').split(" ") : [];
        var fits = node.data('background-fit') ? node.data('background-fit').split(" ") : [];
        var opacities = node.data('background-image-opacity') ? ("" + node.data('background-image-opacity')).split(" ") : [];

        var indexToInsert = imgs.length;

        // insert to length-1
        if(hasCloneMarker(node, imgs)){
          indexToInsert--;
        }

        imgs.splice(indexToInsert, 0, bgObj['background-image']);
        fits.splice(indexToInsert, 0, bgObj['background-fit']);
        opacities.splice(indexToInsert, 0, bgObj['background-image-opacity']);
        xPos.splice(indexToInsert, 0, bgObj['background-position-x']);
        yPos.splice(indexToInsert, 0, bgObj['background-position-y']);
        widths.splice(indexToInsert, 0, bgObj['background-width']);
        heights.splice(indexToInsert, 0, bgObj['background-height']);

        node.data('background-image', imgs.join(" "));
        node.data('background-position-x', xPos.join(" "));
        node.data('background-position-y', yPos.join(" "));
        node.data('background-width', widths.join(" "));
        node.data('background-height', heights.join(" "));
        node.data('background-fit', fits.join(" "));
        node.data('background-image-opacity', opacities.join(" "));
        bgObj['firstTime'] = false;

        if(updateInfo)
          updateInfo();

      }

      function hasCloneMarker(node, imgs){
        var cloneImg = 'data:image/svg+xml;utf8,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20style%3D%22fill%3Anone%3Bstroke%3Ablack%3Bstroke-width%3A0%3B%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22100%22%20height%3D%22100%22%20style%3D%22fill%3A%23a9a9a9%22/%3E%20%3C/svg%3E';
        return (imgs.indexOf(cloneImg) > -1);
      }
    };

    // Remove a background image from given nodes.
    elementUtilities.removeBackgroundImage = function (nodes, bgObj) {
      if(!nodes || nodes.length == 0 || !bgObj)
        return;

      for(var i = 0; i < nodes.length; i++){
        var node = nodes[i];
        var obj = bgObj[node.data('id')];
        if(!obj)
          continue;

        var imgs = node.data('background-image') ? node.data('background-image').split(" ") : [];
        var xPos = node.data('background-position-x') ? node.data('background-position-x').split(" ") : [];
        var yPos = node.data('background-position-y') ? node.data('background-position-y').split(" ") : [];
        var widths = node.data('background-width') ? node.data('background-width').split(" ") : [];
        var heights = node.data('background-height') ? node.data('background-height').split(" ") : [];
        var fits = node.data('background-fit') ? node.data('background-fit').split(" ") : [];
        var opacities = node.data('background-image-opacity') ? ("" + node.data('background-image-opacity')).split(" ") : [];

        var index = -1;
        if(typeof obj['background-image'] === "string")
          index = imgs.indexOf(obj['background-image']);
        else if(Array.isArray(obj['background-image']))
          index = imgs.indexOf(obj['background-image'][0]);

        if(index > -1){
          imgs.splice(index, 1);
          fits.splice(index, 1);
          opacities.splice(index, 1);
          xPos.splice(index, 1);
          yPos.splice(index, 1);
          widths.splice(index, 1);
          heights.splice(index, 1);
        }

        node.data('background-image', imgs.join(" "));
        node.data('background-position-x', xPos.join(" "));
        node.data('background-position-y', yPos.join(" "));
        node.data('background-width', widths.join(" "));
        node.data('background-height', heights.join(" "));
        node.data('background-fit', fits.join(" "));
        node.data('background-image-opacity', opacities.join(" "));
        bgObj['firstTime'] = false;
      }
    };

    elementUtilities.reverseEdge = function(edge){
      var oldSource = edge.source().id();
      var oldTarget = edge.target().id();
      var oldPortSource = edge.data("portsource");
      var oldPortTarget = edge.data("porttarget");
      var segmentPoints = edge.segmentPoints();
      var controlPoints = edge.controlPoints();

      edge.data().source = oldTarget;
      edge.data().target = oldSource;
      edge.data().portsource = oldPortTarget;
      edge.data().porttarget = oldPortSource;
       edge = edge.move({
         target: oldSource,
         source : oldTarget        
      });

      if(Array.isArray(segmentPoints)){
        segmentPoints.reverse();
        edge.data().bendPointPositions = segmentPoints;
        if(Array.isArray(controlPoints)) {
          controlPoints.reverse();
          edge.data().controlPointPositions = controlPoints;
        }
        var edgeEditing = cy.edgeEditing('get');
        edgeEditing.initAnchorPoints(edge);
      }
    

      return edge;
    }

  }

  return elementUtilitiesExtender;
};

},{"./lib-utilities":4}],4:[function(_dereq_,module,exports){
/* 
 * Utility file to get and set the libraries to which sbgnviz is dependent from any file.
 */

var libUtilities = function(){
};

libUtilities.setLibs = function(libs) {
  this.libs = libs;
};

libUtilities.getLibs = function() {
  return this.libs;
};

module.exports = libUtilities;
},{}],5:[function(_dereq_,module,exports){
var libs = _dereq_('./lib-utilities').getLibs();

/*
 * The main utilities to be exposed directly.
 */
module.exports = function () {

  var elementUtilities, options, cy, sbgnvizInstance;

  function mainUtilities (param) {
    elementUtilities = param.elementUtilities;
    options = param.optionUtilities.getOptions();
    cy = param.sbgnvizInstanceUtilities.getCy();
    sbgnvizInstance = param.sbgnvizInstanceUtilities.getInstance();
  };

  /*
   * Adds a new node with the given class and at the given coordinates. Considers undoable option.
   */
  mainUtilities.addNode = function(x, y , nodeParams, id, parent, visibility) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    // update map type
    if (typeof nodeParams == 'object'){
/* 
      if (!elementUtilities.getMapType())
        elementUtilities.setMapType(nodeParams.language);
      else if (elementUtilities.getMapType() != nodeParams.language)
        elementUtilities.setMapType("Unknown"); */
    }

    if (!options.undoable) {
      return elementUtilities.addNode(x, y, nodeParams, id, parent, visibility);
    }
    else {
      var param = {
        newNode : {
          x: x,
          y: y,
          class: nodeParams,
          id: id,
          parent: parent,
          visibility: visibility
        }
      };

      cy.undoRedo().do("addNode", param);
    }
  };

  /*
   * Adds a new edge with the given class and having the given source and target ids. Considers undoable option.
   */
  mainUtilities.addEdge = function(source, target, edgeParams, invalidEdgeCallback, id, visibility) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    // update map type
    if (typeof edgeParams == 'object'){

     /*  if (!elementUtilities.getMapType())
        elementUtilities.setMapType(edgeParams.language);
      else if (elementUtilities.getMapType() != edgeParams.language)
        elementUtilities.setMapType("HybridAny"); */
    }
    // Get the validation result
    var edgeclass = edgeParams.class ? edgeParams.class : edgeParams;
    var validation = elementUtilities.validateArrowEnds(edgeclass, cy.getElementById(source), cy.getElementById(target));

    // If validation result is 'invalid' cancel the operation
    if (validation === 'invalid') {
      if(typeof invalidEdgeCallback === "function"){
        invalidEdgeCallback();
      }
      return;
    }

    // If validation result is 'reverse' reverse the source-target pair before creating the edge
    if (validation === 'reverse') {
      var temp = source;
      source = target;
      target = temp;
    }

    if (!options.undoable) {
      return elementUtilities.addEdge(source, target, edgeParams, id, visibility);
    }
    else {
      var param = {
        newEdge : {
          source: source,
          target: target,
          class: edgeParams,
          id: id,
          visibility: visibility
        }
      };

      var result = cy.undoRedo().do("addEdge", param);
      return result.eles;
    }
  };

  /*
   * Adds a process with convenient edges. For more information please see 'https://github.com/iVis-at-Bilkent/newt/issues/9'.
   * Considers undoable option.
   */
  mainUtilities.addProcessWithConvenientEdges = function(_source, _target, processType) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    // If source and target IDs are given get the elements by IDs
    var source = typeof _source === 'string' ? cy.getElementById(_source) : _source;
    var target = typeof _target === 'string' ? cy.getElementById(_target) : _target;

    // If source or target does not have an EPN class the operation is not valid
    if (!elementUtilities.isEPNClass(source) || !elementUtilities.isEPNClass(target)) {
      return;
    }

    if (!options.undoable) {
      return elementUtilities.addProcessWithConvenientEdges(_source, _target, processType);
    }
    else {
      var param = {
        source: _source,
        target: _target,
        processType: processType
      };

      cy.undoRedo().do("addProcessWithConvenientEdges", param);
    }
  };

  // convert collapsed compound nodes to simple nodes
  // and update port values of pasted nodes and edges
  var cloneCollapsedNodesAndPorts = function (elesBefore){
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    cy.elements().unselect();
    var elesAfter = cy.elements();
    var elesDiff = elesAfter.diff(elesBefore).left;

    // shallow copy collapsed nodes - collapsed compounds become simple nodes
    // data related to collapsed nodes are removed from generated clones
    // related issue: https://github.com/iVis-at-Bilkent/newt/issues/145
    var collapsedNodes = elesDiff.filter('node.cy-expand-collapse-collapsed-node');

    collapsedNodes.connectedEdges().remove();
    collapsedNodes.removeClass('cy-expand-collapse-collapsed-node');
    collapsedNodes.removeData('collapsedChildren');
    collapsedNodes.removeData('position-before-collapse size-before-collapse');
    collapsedNodes.removeData('expandcollapseRenderedCueSize expandcollapseRenderedStartX expandcollapseRenderedStartY');

    // cloning ports
    elesDiff.nodes().forEach(function(_node){
      if(_node.data("ports").length == 2){
          var oldPortName0 = _node.data("ports")[0].id;
          var oldPortName1 = _node.data("ports")[1].id;
          _node.data("ports")[0].id = _node.id() + ".1";
          _node.data("ports")[1].id = _node.id() + ".2";

          _node.outgoers().edges().forEach(function(_edge){
            if(_edge.data("portsource") == oldPortName0){
              _edge.data("portsource", _node.data("ports")[0].id);
            }
            else if(_edge.data("portsource") == oldPortName1){
              _edge.data("portsource", _node.data("ports")[1].id);
            }
            else{
              _edge.data("portsource", _node.id());
            }
          });
          _node.incomers().edges().forEach(function(_edge){
            if(_edge.data("porttarget") == oldPortName0){
              _edge.data("porttarget", _node.data("ports")[0].id);
            }
            else if(_edge.data("porttarget") == oldPortName1){
              _edge.data("porttarget", _node.data("ports")[1].id);
            }
            else{
              _edge.data("porttarget", _node.id());
            }
          });
      }
      else{
        _node.outgoers().edges().forEach(function(_edge){
          _edge.data("portsource", _node.id());
        });
        _node.incomers().edges().forEach(function(_edge){
          _edge.data("porttarget", _node.id());
        });
      }
    });
    elesDiff.select();
  }

  /*
   * Clone given elements. Considers undoable option. Requires cytoscape-clipboard extension.
   */
  mainUtilities.cloneElements = function (eles, pasteAtMouseLoc) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    if (eles.length === 0) {
      return;
    }

    this.copyElements(eles);

    this.pasteElements(pasteAtMouseLoc);
  };

  /*
   * Copy given elements to clipboard. Requires cytoscape-clipboard extension.
   */
  mainUtilities.copyElements = function (eles) {
    cy.clipboard().copy(eles);
  };

  /*
   * Paste the elements copied to clipboard. Considers undoable option. Requires cytoscape-clipboard extension.
   */
  mainUtilities.pasteElements = function(pasteAtMouseLoc) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    var elesBefore = cy.elements();

    if (options.undoable) {
      cy.undoRedo().do("paste",{pasteAtMouseLoc: pasteAtMouseLoc});
    }
    else {
      cy.clipboard().paste();
    }
    cloneCollapsedNodesAndPorts(elesBefore);
    cy.nodes(":selected").emit('data');
  };

  /*
   * Aligns given nodes in given horizontal and vertical order.
   * Horizontal and vertical parameters may be 'none' or undefined.
   * alignTo parameter indicates the leading node.
   * Requrires cytoscape-grid-guide extension and considers undoable option.
   */
  mainUtilities.align = function (nodes, horizontal, vertical, alignTo) {
    if (nodes.length === 0) {
      return;
    }

    if (options.undoable) {
      cy.undoRedo().do("align", {
        nodes: nodes,
        horizontal: horizontal,
        vertical: vertical,
        alignTo: alignTo
      });
    } else {
      nodes.align(horizontal, vertical, alignTo);
    }

    if(cy.edges(":selected").length == 1 ) {
      cy.edges().unselect();      
    }
    
  };

  /*
   * Create compound for given nodes. compoundType may be 'complex' or 'compartment'.
   * This method considers undoable option.
   */
  mainUtilities.createCompoundForGivenNodes = function (_nodes, compoundType) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    var nodes = _nodes;
    /*
     * Eleminate the nodes which cannot have a parent with given compound type
     */
    nodes = _nodes.filter(function (element, i) {
      if(typeof element === "number") {
        element = i;
      }

      var sbgnclass = element.data("class");
      return elementUtilities.isValidParent(sbgnclass, compoundType, element);
    });

    nodes = elementUtilities.getTopMostNodes(nodes);

    // All elements should have the same parent and the common parent should not be a 'complex'
    // if compoundType is 'compartent'
    // because the old common parent will be the parent of the new compartment after this operation and
    // 'complexes' cannot include 'compartments'
    if (nodes.length == 0 || !elementUtilities.allHaveTheSameParent(nodes)
            || ( (compoundType === 'compartment' || compoundType == 'submap') && nodes.parent().data('class')
            && nodes.parent().data('class').startsWith('complex') )) {
      return;
    }

    if (cy.undoRedo()) {
      var param = {
        compoundType: compoundType,
        nodesToMakeCompound: nodes
      };

      cy.undoRedo().do("createCompoundForGivenNodes", param);
    }
    else {
      elementUtilities.createCompoundForGivenNodes(nodes, compoundType);
    }
  };

  /*
   * Move the nodes to a new parent and change their position if possDiff params are set.
   * Considers undoable option and checks if the operation is valid.
   */
  mainUtilities.changeParent = function(nodes, _newParent, posDiffX, posDiffY) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    var newParent = typeof _newParent === 'string' ? cy.getElementById(_newParent) : _newParent;
    // New parent is supposed to be one of the root, a complex or a compartment
    if (newParent && !newParent.data("class").startsWith("complex") && newParent.data("class") != "compartment"
            && newParent.data("class") != "submap") {
      return;
    }
    /*
     * Eleminate the nodes which cannot have the newParent as their parent
     */
    nodes = nodes.filter(function (element, i) {
      if(typeof element === "number") {
        element = i;
      }

      var sbgnclass = element.data("class");
      return elementUtilities.isValidParent(sbgnclass, newParent, element);
    });

    // Discard the nodes whose parent is already newParent.
    // Discard the newParent itself if it is among the nodes
    nodes = nodes.filter(function (ele, i) {
      if(typeof ele === "number") {
        ele = i;
      }

      // Discard the newParent if it is among the nodes
      if (newParent && ele.id() === newParent.id()) {
        return false;
      }
      // Discard the nodes whose parent is already newParent
      if (!newParent) {
        return ele.data('parent') != null;
      }
      return ele.data('parent') !== newParent.id();
    });

    // If some nodes are ancestor of new parent eleminate them
    if (newParent) {
      nodes = nodes.difference(newParent.ancestors());
    }

    // If all nodes are eleminated return directly
    if (nodes.length === 0) {
      return;
    }

    // Just move the top most nodes
    nodes = elementUtilities.getTopMostNodes(nodes);

    var parentId = newParent ? newParent.id() : null;

    if (options.undoable) {
      var param = {
        firstTime: true,
        parentData: parentId, // It keeps the newParentId (Just an id for each nodes for the first time)
        nodes: nodes,
        posDiffX: posDiffX,
        posDiffY: posDiffY,
        // This is needed because the changeParent function called is not from elementUtilities
        // but from the undoRedo extension directly, so maintaining pointer is not automatically done.
        callback: elementUtilities.maintainPointer
      };

      cy.undoRedo().do("changeParent", param); // This action is registered by undoRedo extension
    }
    else {
      elementUtilities.changeParent(nodes, parentId, posDiffX, posDiffY);
    }
  };

  /*
   * Creates a template reaction with given parameters. Requires cose-bilkent layout to tile the free macromolecules included
   * in the complex. Considers undoable option. For more information see the same function in elementUtilities
   */
  mainUtilities.createTemplateReaction = function (templateType, macromoleculeList, complexName, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength, layoutParam) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.createTemplateReaction(templateType, macromoleculeList, complexName, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength, layoutParam);
    }
    else {
      var param = {
        templateType: templateType,
        macromoleculeList: macromoleculeList,
        complexName: complexName,
        processPosition: processPosition,
        tilingPaddingVertical: tilingPaddingVertical,
        tilingPaddingHorizontal: tilingPaddingHorizontal,
        edgeLength: edgeLength,
        layoutParam: layoutParam
      };

      cy.undoRedo().do("createTemplateReaction", param);
    }
  };

  /*
   * Resize given nodes if useAspectRatio is truthy one of width or height should not be set.
   * Considers undoable option.
   */
  mainUtilities.resizeNodes = function(nodes, width, height, useAspectRatio, preserveRelativePos) {
    if (nodes.length === 0) {
      return;
    }

    if (options.undoable) {
      var param = {
        nodes: nodes,
        width: width,
        height: height,
        useAspectRatio: useAspectRatio,
        performOperation: true,
        preserveRelativePos: preserveRelativePos
      };

      cy.undoRedo().do("resizeNodes", param);
    }
    else {
      elementUtilities.resizeNodes(nodes, width, height, useAspectRatio);
      cy.style().update();
    }


  };

    /*
     * Resize given nodes if useAspectRatio is truthy one of width or height should not be set.
     * Considers undoable option.
     */
    mainUtilities.resizeNodesToContent = function(nodes, useAspectRatio) {
        if (nodes.length === 0) {
            return;
        } 
        if (options.undoable) {
          var actions = [];
          nodes.forEach(function(node){
            var width = elementUtilities.calculateMinWidth(node);
            var height = elementUtilities.calculateMinHeight(node);
            actions.push({name: "resizeNodes", param: {
                nodes: node,
                width: width,
                height: height,
                useAspectRatio: useAspectRatio,
                performOperation: true,
                preserveRelativePos: true
            }});

            var stateAndInfos = node.data('statesandinfos');
            var length = stateAndInfos.length;
            if (length != 0) {
              var param = {
                node: node,
                locations: ["top","right","bottom","left"]
              };          
              actions.push({name:"fitUnits",param : param})
             }
  

          });

        
         
          cy.undoRedo().do("batch", actions);
          cy.style().update();
          return actions;
        }
        else {
            nodes.forEach(function(node){
              var width = elementUtilities.calculateMinWidth(node);
              var height = elementUtilities.calculateMinHeight(node);
              
              elementUtilities.resizeNodes(node, width, height, useAspectRatio, true);
            });
        }

        cy.style().update();
    };

  /*
   * Changes the label of the given nodes to the given label. Considers undoable option.
   */
  mainUtilities.changeNodeLabel = function(nodes, label) {
    if (nodes.length === 0) {
      return;
    }

    if (!options.undoable) {
      nodes.data('label', label);
    }
    else {
      var param = {
        nodes: nodes,
        label: label,
        firstTime: true
      };

      cy.undoRedo().do("changeNodeLabel", param);
    }

    cy.style().update();
  };

  /*
   * Change font properties for given nodes use the given font data.
   * Considers undoable option.
   */
  mainUtilities.changeFontProperties = function(eles, data) {
    if (eles.length === 0) {
      return;
    }

    if (options.undoable) {
      var param = {
        eles: eles,
        data: data,
        firstTime: true
      };

      cy.undoRedo().do("changeFontProperties", param);
    }
    else {
      elementUtilities.changeFontProperties(eles, data);
    }

    cy.style().update();
  };

  /*
   * Change state value or unit of information box of given nodes with given index.
   * Considers undoable option.
   * For more information about the parameters see elementUtilities.changeStateOrInfoBox
   */
  mainUtilities.changeStateOrInfoBox = function(nodes, index, value, type) {
    if (nodes.length === 0) {
      return;
    }
    if (options.undoable) {
      var param = {
        index: index,
        value: value,
        type: type,
        nodes: nodes
      };

      cy.undoRedo().do("changeStateOrInfoBox", param);
    }
    else {
      return elementUtilities.changeStateOrInfoBox(nodes, index, value, type);
    }

    cy.style().update();
  };

  // Add a new state or info box to given nodes.
  // The box is represented by the parameter obj.
  // Considers undoable option.
  mainUtilities.addStateOrInfoBox = function(nodes, obj) {
    if (nodes.length === 0) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.addStateOrInfoBox(nodes, obj);
    }
    else {
      var param = {
        obj: obj,
        nodes: nodes
      };

      cy.undoRedo().do("addStateOrInfoBox", param);
    }

    cy.style().update();
  };

  // Remove the state or info boxes of the given nodes at given index.
  // Considers undoable option.
  mainUtilities.removeStateOrInfoBox = function(nodes, index) {
    if (nodes.length === 0) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.removeStateOrInfoBox(nodes, {index: index});
    }
    else {
      var param = {
        locationObj: {index: index},
        nodes: nodes
      };

      cy.undoRedo().do("removeStateOrInfoBox", param);
    }

    cy.style().update();
  };


  //Arrange information boxes
  //If force check is true, it rearranges all information boxes
  mainUtilities.fitUnits = function (node, locations) {
    if (node.data('auxunitlayouts') === undefined || node.data('statesandinfos').length <= 0) {
      return;
    }
    if (locations === undefined || locations.length <= 0) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.fitUnits(node, locations);
    }
    else {
      var param = {
        node: node,
        locations: locations
      };

      cy.undoRedo().do("fitUnits", param);
    }

    cy.style().update();
  };

  /*
   * Set multimer status of the given nodes to the given status.
   * Considers undoable option.
   */
  mainUtilities.setMultimerStatus = function(nodes, status) {
    if (nodes.length === 0) {
      return;
    }

    if (options.undoable) {
      var param = {
        status: status,
        nodes: nodes,
        firstTime: true
      };

      cy.undoRedo().do("setMultimerStatus", param);
    }
    else {
      elementUtilities.setMultimerStatus(nodes, status);
    }

    cy.style().update();
  };

  /**
   * Redraw clone markers on given nodes without considering undo.
   * See https://github.com/iVis-at-Bilkent/newt/issues/574 
   */
  mainUtilities.redrawCloneMarkers = function(nodes) {
    elementUtilities.setCloneMarkerStatus(nodes, true);
  }

  /*
   * Set clone marker status of given nodes to the given status.
   * Considers undoable option.
   */
  mainUtilities.setCloneMarkerStatus = function(nodes, status) {
    if (nodes.length === 0) {
      return;
    }

    if (options.undoable) {
      var param = {
        status: status,
        nodes: nodes,
        firstTime: true
      };

      cy.undoRedo().do("setCloneMarkerStatus", param);
    }
    else {
      elementUtilities.setCloneMarkerStatus(nodes, status);
    }

    cy.style().update();
  };

  /*
   * Change style/css of given eles by setting getting property name to the given given value/values (Note that valueMap parameter may be
   * a single string or an id to value map). Considers undoable option.
   */
  mainUtilities.changeCss = function(eles, name, valueMap) {
    if (eles.length === 0) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.changeCss(eles, name, valueMap);
    }
    else {
      var param = {
        eles: eles,
        valueMap: valueMap,
        name: name
      };

      cy.undoRedo().do("changeCss", param);
    }

    cy.style().update();
  };

  /*
   * Change data of given eles by setting getting property name to the given given value/values (Note that valueMap parameter may be
   * a single string or an id to value map). Considers undoable option.
   */
  mainUtilities.changeData = function(eles, name, valueMap) {
    if (eles.length === 0) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.changeData(eles, name, valueMap);
    }
    else {
      var param = {
        eles: eles,
        valueMap: valueMap,
        name: name
      };

      cy.undoRedo().do("changeData", param);
    }

    cy.style().update();
  };

  mainUtilities.updateSetField = function(ele, fieldName, toDelete, toAdd, callback) {
    if (!options.undoable) {
      elementUtilities.changeData(ele, fieldName, toDelete, toAdd, callback);
    }
    else {
      var param = {
        ele,
        fieldName,
        toDelete,
        toAdd,
        callback
      };

      cy.undoRedo().do("updateSetField", param);
    }
  };

  mainUtilities.setDefaultProperty = function( _class, name, value ) {
    if (!options.undoable) {
      var propMap = {};
      propMap[ name ] = value;

      elementUtilities.setDefaultProperties(_class, propMap);
    }
    else {
      var param = {
        class: _class,
        name,
        value
      };

      cy.undoRedo().do("setDefaultProperty", param);
    }
  };

  mainUtilities.updateInfoboxStyle = function( node, index, newProps ) {
    if (!options.undoable) {
      elementUtilities.updateInfoboxStyle( node, index, newProps );
    }
    else {
      var param = {
        node: node,
        index: index,
        newProps: newProps
      };

      cy.undoRedo().do("updateInfoboxStyle", param);
    }

    cy.style().update();
  };

  mainUtilities.updateInfoboxObj = function( node, index, newProps ) {
    if (!options.undoable) {
      elementUtilities.updateInfoboxObj( node, index, newProps );
    }
    else {
      var param = {
        node: node,
        index: index,
        newProps: newProps
      };

      cy.undoRedo().do("updateInfoboxObj", param);
    }

    cy.style().update();
  };

  mainUtilities.deleteAndPerformLayout = function (eles, layoutparam) {
    var nodes = eles.nodes(); // Ensure that nodes list just include nodes

    var allNodes = cy.nodes(":visible");
    var nodesToKeep = elementUtilities.extendRemainingNodes(nodes, allNodes);
    var nodesToRemove = allNodes.not(nodesToKeep);

    if (nodesToRemove.length === 0) {
        return;
    }

    if (!options.undoable) {

        elementUtilities.deleteAndPerformLayout(nodesToRemove, layoutparam);
    }
    else {
        var param = {
            eles: nodesToRemove,
            layoutparam: layoutparam,
            firstTime: true
        };

        cy.undoRedo().do("deleteAndPerformLayout", param);
    }
  };

  /*
   * Hides given eles (the ones which are selected) and perform given layout afterward. Layout parameter may be layout options
   * or a function to call. Requires viewUtilities extension and considers undoable option.
   */
  mainUtilities.hideAndPerformLayout = function(eles, layoutparam) {
      var nodes = eles.nodes(); // Ensure that nodes list just include nodes

      var allNodes = cy.nodes(":visible");
      var nodesToShow = elementUtilities.extendRemainingNodes(nodes, allNodes);
      var nodesToHide = allNodes.not(nodesToShow);

      if (nodesToHide.length === 0) {
          return;
      }

      if (!options.undoable) {

          var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
          sbgnvizInstance.thinBorder(nodesWithHiddenNeighbor);
          elementUtilities.hideAndPerformLayout(nodesToHide, layoutparam);
          var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
          sbgnvizInstance.thickenBorder(nodesWithHiddenNeighbor);
      }
      else {
          var param = {
              eles: nodesToHide,
              layoutparam: layoutparam,
              firstTime: true
          };

          var ur = cy.undoRedo();
          ur.action("thickenBorder", sbgnvizInstance.thickenBorder, sbgnvizInstance.thinBorder);
          ur.action("thinBorder", sbgnvizInstance.thinBorder, sbgnvizInstance.thickenBorder);

          var actions = [];
          var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes().intersection(nodesToHide);
          actions.push({name: "thinBorder", param: nodesWithHiddenNeighbor});
          actions.push({name: "hideAndPerformLayout", param: param});
          nodesWithHiddenNeighbor = nodesToHide.neighborhood(":visible").nodes().difference(nodesToHide).difference(cy.nodes("[thickBorder]"));
          actions.push({name: "thickenBorder", param: nodesWithHiddenNeighbor});
          cy.undoRedo().do("batch", actions);
      }
  };

  /*
   * Shows all elements (the ones which are hidden if any) and perform given layout afterward. Layout parameter may be layout options
   * or a function to call. Requires viewUtilities extension and considers undoable option.
   */
  mainUtilities.showAllAndPerformLayout = function(layoutparam) {
    var hiddenEles = cy.elements(':hidden');
    if (hiddenEles.length === 0) {
      return;
    }
    if (!options.undoable) {
      var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
      sbgnvizInstance.thinBorder(nodesWithHiddenNeighbor);
      elementUtilities.showAndPerformLayout(hiddenEles, layoutparam);
    }
    else {
      var param = {
        eles: hiddenEles,
        layoutparam: layoutparam,
        firstTime: true
      };

      var ur = cy.undoRedo();
      ur.action("thickenBorder", sbgnvizInstance.thickenBorder, sbgnvizInstance.thinBorder);
      ur.action("thinBorder", sbgnvizInstance.thinBorder, sbgnvizInstance.thickenBorder);

      var actions = [];
      var nodesWithHiddenNeighbor = cy.nodes("[thickBorder]");
      actions.push({name: "thinBorder", param: nodesWithHiddenNeighbor});
      actions.push({name: "showAndPerformLayout", param: param});
      cy.undoRedo().do("batch", actions);
    }
  };

  /*
   * Unhide given eles (the ones which are hidden if any) and perform given layout afterward. Layout parameter may be layout options
   * or a function to call. Requires viewUtilities extension and considers undoable option.
   */
  mainUtilities.showAndPerformLayout = function(mainEle, eles, layoutparam) {
      var hiddenEles = eles.filter(':hidden');
      if (hiddenEles.length === 0) {
          return;
      }
      mainUtilities.closeUpElements(mainEle, hiddenEles.nodes());
      if (!options.undoable) {
          var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
          sbgnvizInstance.thinBorder(nodesWithHiddenNeighbor);
          elementUtilities.showAndPerformLayout(hiddenEles, layoutparam);
          var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes(':visible');
          sbgnvizInstance.thickenBorder(nodesWithHiddenNeighbor);
      }
      else {
          var param = {
              eles: hiddenEles,
              layoutparam: layoutparam,
              firstTime: true
          };

          var ur = cy.undoRedo();
          ur.action("thickenBorder", sbgnvizInstance.thickenBorder, sbgnvizInstance.thinBorder);
          ur.action("thinBorder", sbgnvizInstance.thinBorder, sbgnvizInstance.thickenBorder);

          var actions = [];
          var nodesToThinBorder = (hiddenEles.neighborhood(":visible").nodes("[thickBorder]"))
                  .difference(cy.edges(":hidden").difference(hiddenEles.edges().union(hiddenEles.nodes().connectedEdges())).connectedNodes());
          actions.push({name: "thinBorder", param: nodesToThinBorder});
          actions.push({name: "showAndPerformLayout", param: param});
          var nodesToThickenBorder = hiddenEles.nodes().edgesWith(cy.nodes(":hidden").difference(hiddenEles.nodes()))
  	            .connectedNodes().intersection(hiddenEles.nodes());
          actions.push({name: "thickenBorder", param: nodesToThickenBorder});
          cy.undoRedo().do("batch", actions);
      }
  };

  /*
  * Takes the hidden elements close to the nodes whose neighbors will be shown
  * */
  mainUtilities.closeUpElements = function(mainEle, hiddenEles) {
      var leftX = Number.MAX_VALUE;
      var rightX = Number.MIN_VALUE;
      var topY = Number.MAX_VALUE;
      var bottomY = Number.MIN_VALUE;
      // Check the x and y limits of all hidden elements and store them in the variables above
      hiddenEles.forEach(function( ele ){
          if (ele.data('class') != 'compartment' &&  ele.data('class') != 'complex')
          {
              var halfWidth = ele.outerWidth()/2;
              var halfHeight = ele.outerHeight()/2;
              if (ele.position("x") - halfWidth < leftX)
                  leftX = ele.position("x") - halfWidth;
              if (ele.position("x") + halfWidth > rightX)
                  rightX = ele.position("x") + halfWidth;
              if (ele.position("y") - halfHeight < topY)
                  topY = ele.position("y") - halfHeight;
              if (ele.position("y") + halfHeight > topY)
                  bottomY = ele.position("y") + halfHeight;
          }
      });

      //The coordinates of the old center containing the hidden nodes
      var oldCenterX = (leftX + rightX)/2;
      var oldCenterY = (topY + bottomY)/2;

      //Here we calculate two parameters which define the area in which the hidden elements are placed initially
      var minHorizontalParam = mainEle.outerWidth()/2 + (rightX - leftX)/2;
      var maxHorizontalParam = mainEle.outerWidth() + (rightX - leftX)/2;
      var minVerticalParam = mainEle.outerHeight()/2 + (bottomY - topY)/2;
      var maxVerticalParam = mainEle.outerHeight() + (bottomY - topY)/2;

      //Quadrants is an object of the form {first:"obtained", second:"free", third:"free", fourth:"obtained"}
      // which holds which quadrant are free (that's where hidden nodes will be brought)
      var quadrants = mainUtilities.checkOccupiedQuadrants(mainEle, hiddenEles);
      var freeQuadrants = [];
      for (var property in quadrants) {
          if (quadrants[property] === "free")
              freeQuadrants.push(property);
      }

      //Can take values 1 and -1 and are used to place the hidden nodes in the random quadrant
      var horizontalMult;
      var verticalMult;
      if (freeQuadrants.length > 0)
      {
        if (freeQuadrants.length === 3)
        {
          if (freeQuadrants.includes('first') && freeQuadrants.includes('second') && freeQuadrants.includes('third'))
          {
            horizontalMult = -1;
            verticalMult = -1;
          }
          else if (freeQuadrants.includes('first') && freeQuadrants.includes('second') && freeQuadrants.includes('fourth'))
          {
            horizontalMult = 1;
            verticalMult = -1;
          }
          else if (freeQuadrants.includes('first') && freeQuadrants.includes('third') && freeQuadrants.includes('fourth'))
          {
            horizontalMult = 1;
            verticalMult = 1;
          }
          else if (freeQuadrants.includes('second') && freeQuadrants.includes('third') && freeQuadrants.includes('fourth'))
          {
            horizontalMult = -1;
            verticalMult = 1;
          }
        }
        else
        {
          //Randomly picks one quadrant from the free quadrants
          var randomQuadrant = freeQuadrants[Math.floor(Math.random()*freeQuadrants.length)];

          if (randomQuadrant === "first") {
              horizontalMult = 1;
              verticalMult = -1;
          }
          else if (randomQuadrant === "second") {
              horizontalMult = -1;
              verticalMult = -1;
          }
          else if (randomQuadrant === "third") {
              horizontalMult = -1;
              verticalMult = 1;
          }
          else if (randomQuadrant === "fourth") {
              horizontalMult = 1;
              verticalMult = 1;
          }
        }
      }
      else
      {
          horizontalMult = 0;
          verticalMult = 0;
      }
      // If the horizontalMult is 0 it means that no quadrant is free, so we randomly choose a quadrant
      var horizontalParam = mainUtilities.generateRandom(minHorizontalParam,maxHorizontalParam,horizontalMult);
      var verticalParam = mainUtilities.generateRandom(minVerticalParam,maxVerticalParam,verticalMult);

      //The coordinates of the center where the hidden nodes will be transfered
      var newCenterX = mainEle.position("x") + horizontalParam;
      var newCenterY = mainEle.position("y") + verticalParam;

      var xdiff = newCenterX - oldCenterX;
      var ydiff = newCenterY - oldCenterY;

      //Change the position of hidden elements
      hiddenEles.forEach(function( ele ){
          var newx = ele.position("x") + xdiff;
          var newy = ele.position("y") + ydiff;
          ele.position("x", newx);
          ele.position("y",newy);
      });
  };

  /*
   * Generates a number between 2 nr and multimplies it with 1 or -1
   * */
  mainUtilities.generateRandom = function(min, max, mult) {
      var val = [-1,1];
      if (mult === 0)
          mult = val[Math.floor(Math.random()*val.length)];
      return (Math.floor(Math.random() * (max - min + 1)) + min) * mult;
  };

  /*
   * This function makes sure that the random number lies in free quadrant
   * */
  mainUtilities.checkOccupiedQuadrants = function(mainEle, hiddenEles) {
      if (elementUtilities.getMapType() == 'PD')
      {
        var visibleNeighborEles = mainEle.neighborhood().difference(hiddenEles).nodes();
        var visibleNeighborsOfNeighbors = visibleNeighborEles.neighborhood().difference(hiddenEles).difference(mainEle).nodes();
        var visibleEles = visibleNeighborEles.union(visibleNeighborsOfNeighbors);
      }
      else
        var visibleEles = mainEle.neighborhood().difference(hiddenEles).nodes();
      var occupiedQuadrants = {first:"free", second:"free", third:"free", fourth:"free"};

      visibleEles.forEach(function( ele ){
          if (ele.data('class') != 'compartment' &&  ele.data('class') != 'complex')
          {
              if (ele.position("x") < mainEle.position("x") && ele.position("y") < mainEle.position("y"))
                  occupiedQuadrants.second = "occupied";
              else if (ele.position("x") > mainEle.position("x") && ele.position("y") < mainEle.position("y"))
                  occupiedQuadrants.first = "occupied";
              else if (ele.position("x") < mainEle.position("x") && ele.position("y") > mainEle.position("y"))
                  occupiedQuadrants.third = "occupied";
              else if (ele.position("x") > mainEle.position("x") && ele.position("y") > mainEle.position("y"))
                  occupiedQuadrants.fourth = "occupied";
          }
      });
      return occupiedQuadrants;
  };

  // Overrides highlightProcesses from SBGNVIZ - do not highlight any nodes when the map type is AF
  mainUtilities.highlightProcesses = function(_nodes) {
    if (elementUtilities.getMapType() == "AF")
      return;
    sbgnvizInstance.highlightProcesses(_nodes);
  };

  /**
   * Resets map type to undefined
   */
  mainUtilities.resetMapType = function(){
    elementUtilities.resetMapType();
  };

  /**
   * return : map type
   */
  mainUtilities.getMapType = function(){
    return elementUtilities.getMapType();
  };

  mainUtilities.addBackgroundImage = function(nodes, bgObj, updateInfo, promptInvalidImage, validateURL){
    if (nodes.length === 0 || !bgObj) {
      return;
    }

    bgObj['firstTime'] = true;
    if (options.undoable) {
      var param = {
        bgObj: bgObj,
        nodes: nodes,
        updateInfo: updateInfo,
        promptInvalidImage: promptInvalidImage,
        validateURL: validateURL,
      };

      cy.undoRedo().do("addBackgroundImage", param);
    }
    else {
      elementUtilities.addBackgroundImage(nodes, bgObj, updateInfo, promptInvalidImage, validateURL);
    }

    cy.style().update();
  }

  mainUtilities.removeBackgroundImage = function(nodes, bgObj){
    if (nodes.length === 0 || !bgObj) {
      return;
    }

    bgObj['firstTime'] = true;
    if (options.undoable) {
      var param = {
        bgObj: bgObj,
        nodes: nodes
      };

      cy.undoRedo().do("removeBackgroundImage", param);
    }
    else {
      elementUtilities.removeBackgroundImage(nodes, bgObj);
    }

    cy.style().update();
  }

  mainUtilities.updateBackgroundImage = function(nodes, bgObj){
    if (nodes.length === 0 || !bgObj) {
      return;
    }

    if (options.undoable) {
      var param = {
        bgObj: bgObj,
        nodes: nodes
      };

      cy.undoRedo().do("updateBackgroundImage", param);
    }
    else {
      elementUtilities.updateBackgroundImage(nodes, bgObj);
    }

    cy.style().update();
  }

  mainUtilities.changeBackgroundImage = function(nodes, oldImg, newImg, updateInfo, promptInvalidImage, validateURL){
    if (nodes.length === 0 || !oldImg || !newImg) {
      return;
    }

    if (options.undoable) {
      var param = {
        oldImg: oldImg,
        newImg: newImg,
        nodes: nodes,
        firstTime: true,
        updateInfo: updateInfo,
        promptInvalidImage: promptInvalidImage,
        validateURL: validateURL
      };

      cy.undoRedo().do("changeBackgroundImage", param);
    }
    else {
      elementUtilities.changeBackgroundImage(nodes, oldImg, newImg, true, updateInfo, promptInvalidImage, validateURL);
    }

    cy.style().update();
  }

  return mainUtilities;
};

},{"./lib-utilities":4}],6:[function(_dereq_,module,exports){
/*
 *  Extend default options and get current options by using this file
 */

module.exports = function () {

  // default options
  var defaults = {
    // The path of core library images when sbgnviz is required from npm and the index html
    // file and node_modules are under the same folder then using the default value is fine
    imgPath: 'node_modules/sbgnviz/src/img',
    // Whether to fit labels to nodes
    fitLabelsToNodes: function () {
      return false;
    },
    fitLabelsToInfoboxes: function () {
      return false;
    },
    // dynamic label size it may be 'small', 'regular', 'large'
    dynamicLabelSize: function () {
      return 'regular';
    },
    // Whether to infer nesting on load 
    inferNestingOnLoad: function () {
      return false;
    },
    // percentage used to calculate compound paddings
    compoundPadding: function () {
      return 10;
    },
    // The selector of the component containing the sbgn network
    networkContainerSelector: '#sbgn-network-container',
    // Whether the actions are undoable, requires cytoscape-undo-redo extension
    undoable: true,
    // Whether to have undoable drag feature in undo/redo extension. This options will be passed to undo/redo extension
    undoableDrag: true
  };

  var optionUtilities = function () {
  };

  // Extend the defaults options with the user options
  optionUtilities.extendOptions = function (options) {
    var result = {};

    for (var prop in defaults) {
      result[prop] = defaults[prop];
    }

    for (var prop in options) {
      result[prop] = options[prop];
    }

    optionUtilities.options = result;

    return options;
  };

  optionUtilities.getOptions = function () {
    return optionUtilities.options;
  };

  return optionUtilities;
};

},{}],7:[function(_dereq_,module,exports){
var libs = _dereq_('./lib-utilities').getLibs();
var $ = libs.jQuery;

module.exports = function () {

  var undoRedoActionFunctions, options, cy;

  var registerUndoRedoActions = function (param) {

    undoRedoActionFunctions = param.undoRedoActionFunctions;
    options = param.optionUtilities.getOptions();
    cy = param.sbgnvizInstanceUtilities.getCy();

    if (!options.undoable) {
      return;
    }

    // create undo-redo instance
    var ur = cy.undoRedo({
      undoableDrag: options.undoableDrag
    });

    // register add remove actions
    ur.action("addNode", undoRedoActionFunctions.addNode, undoRedoActionFunctions.deleteElesSimple);
    ur.action("deleteElesSimple", undoRedoActionFunctions.deleteElesSimple, undoRedoActionFunctions.restoreEles);
    ur.action("addEdge", undoRedoActionFunctions.addEdge, undoRedoActionFunctions.deleteElesSimple);
    ur.action("addProcessWithConvenientEdges", undoRedoActionFunctions.addProcessWithConvenientEdges, undoRedoActionFunctions.deleteElesSimple);
    ur.action("deleteElesSmart", undoRedoActionFunctions.deleteElesSmart, undoRedoActionFunctions.restoreEles);
    ur.action("createCompoundForGivenNodes", undoRedoActionFunctions.createCompoundForGivenNodes, undoRedoActionFunctions.createCompoundForGivenNodes);

    // register general actions
    ur.action("resizeNodes", undoRedoActionFunctions.resizeNodes, undoRedoActionFunctions.resizeNodes);
    ur.action("changeNodeLabel", undoRedoActionFunctions.changeNodeLabel, undoRedoActionFunctions.changeNodeLabel);
    ur.action("changeData", undoRedoActionFunctions.changeData, undoRedoActionFunctions.changeData);
    ur.action("updateSetField", undoRedoActionFunctions.updateSetField, undoRedoActionFunctions.updateSetField);
    ur.action("changeCss", undoRedoActionFunctions.changeCss, undoRedoActionFunctions.changeCss);
    ur.action("changeBendPoints", undoRedoActionFunctions.changeBendPoints, undoRedoActionFunctions.changeBendPoints);
    ur.action("changeFontProperties", undoRedoActionFunctions.changeFontProperties, undoRedoActionFunctions.changeFontProperties);
    ur.action("showAndPerformLayout", undoRedoActionFunctions.showAndPerformLayout, undoRedoActionFunctions.undoShowAndPerformLayout);
    ur.action("hideAndPerformLayout", undoRedoActionFunctions.hideAndPerformLayout, undoRedoActionFunctions.undoHideAndPerformLayout);
    ur.action("deleteAndPerformLayout", undoRedoActionFunctions.deleteAndPerformLayout, undoRedoActionFunctions.undoDeleteAndPerformLayout);
    ur.action("applySIFTopologyGrouping", undoRedoActionFunctions.applySIFTopologyGrouping, undoRedoActionFunctions.applySIFTopologyGrouping);

    // register SBGN actions
    ur.action("addStateOrInfoBox", undoRedoActionFunctions.addStateOrInfoBox, undoRedoActionFunctions.removeStateOrInfoBox);
    ur.action("changeStateOrInfoBox", undoRedoActionFunctions.changeStateOrInfoBox, undoRedoActionFunctions.changeStateOrInfoBox);
    ur.action("setMultimerStatus", undoRedoActionFunctions.setMultimerStatus, undoRedoActionFunctions.setMultimerStatus);
    ur.action("setCloneMarkerStatus", undoRedoActionFunctions.setCloneMarkerStatus, undoRedoActionFunctions.setCloneMarkerStatus);
    ur.action("removeStateOrInfoBox", undoRedoActionFunctions.removeStateOrInfoBox, undoRedoActionFunctions.addStateOrInfoBox);
    ur.action("fitUnits", undoRedoActionFunctions.fitUnits, undoRedoActionFunctions.restoreUnits);
    ur.action("addBackgroundImage", undoRedoActionFunctions.addBackgroundImage, undoRedoActionFunctions.removeBackgroundImage);
    ur.action("removeBackgroundImage", undoRedoActionFunctions.removeBackgroundImage, undoRedoActionFunctions.addBackgroundImage);
    ur.action("updateBackgroundImage", undoRedoActionFunctions.updateBackgroundImage, undoRedoActionFunctions.updateBackgroundImage);
    ur.action("changeBackgroundImage", undoRedoActionFunctions.changeBackgroundImage, undoRedoActionFunctions.changeBackgroundImage);
    ur.action("updateInfoboxStyle", undoRedoActionFunctions.updateInfoboxStyle, undoRedoActionFunctions.updateInfoboxStyle);
    ur.action("updateInfoboxObj", undoRedoActionFunctions.updateInfoboxObj, undoRedoActionFunctions.updateInfoboxObj);

    // register easy creation actions
    ur.action("createTemplateReaction", undoRedoActionFunctions.createTemplateReaction, undoRedoActionFunctions.deleteElesSimple);
    ur.action("setDefaultProperty", undoRedoActionFunctions.setDefaultProperty, undoRedoActionFunctions.setDefaultProperty);
    ur.action("convertIntoReversibleReaction", undoRedoActionFunctions.convertIntoReversibleReaction, undoRedoActionFunctions.convertIntoReversibleReaction);

    ur.action("moveEdge", undoRedoActionFunctions.moveEdge, undoRedoActionFunctions.moveEdge);
    ur.action("fixError", undoRedoActionFunctions.fixError,undoRedoActionFunctions.unfixError);
    ur.action("cloneHighDegreeNode", undoRedoActionFunctions.cloneHighDegreeNode,undoRedoActionFunctions.unCloneHighDegreeNode);

    ur.action("changeMapType", undoRedoActionFunctions.changeMapType,undoRedoActionFunctions.changeMapType);
    ur.action("setCompoundPadding", undoRedoActionFunctions.setCompoundPadding, undoRedoActionFunctions.setCompoundPadding);

  };

  return registerUndoRedoActions;
};

},{"./lib-utilities":4}],8:[function(_dereq_,module,exports){
var libs = _dereq_('./lib-utilities').getLibs();

module.exports = function () {

  var instance;

  function sbgnvizInstanceUtilities (options) {

    instance = libs.sbgnviz(options);

    return instance;
  }

  sbgnvizInstanceUtilities.getInstance = function () {
    return instance;
  }

  sbgnvizInstanceUtilities.getCy = function () {
    return this.getInstance().getCy();
  }

  return sbgnvizInstanceUtilities;
};

},{"./lib-utilities":4}],9:[function(_dereq_,module,exports){
var isEqual = _dereq_('lodash.isequal');

module.exports = function() {

  var cy, elementUtilities;
  var groupCompoundType, metaEdgeIdentifier, lockGraphTopology, shouldApply;

  var DEFAULT_GROUP_COMPOUND_TYPE = 'topology group';
  var EDGE_STYLE_NAMES = [ 'line-color', 'width' ];

  function topologyGrouping( param, props ) {
    cy = param.sbgnvizInstanceUtilities.getCy()
    elementUtilities = param.elementUtilities;

    groupCompoundType = props.groupCompoundType || DEFAULT_GROUP_COMPOUND_TYPE;
    metaEdgeIdentifier = props.metaEdgeIdentifier;
    lockGraphTopology = props.lockGraphTopology;
    shouldApply = props.shouldApply || true;

    topologyGrouping.applied = false;
    initMetaStyleMap();
  }

  topologyGrouping.apply = function() {
    if ( topologyGrouping.applied || !evalOpt( shouldApply ) ) {
      return;
    }

    var list = cy.nodes().map( function( node ) {
      return [ node ];
    } );

    // determine node groups by their topology
  	var groups = getNodeGroups( list );
  	// apply grouping in cy level
  	applyGrouping( groups );

    topologyGrouping.applied = true;

    if ( lockGraphTopology ) {
      elementUtilities.lockGraphTopology();
    }

  	return groups;
  };

  topologyGrouping.unapply = function() {
    if ( !topologyGrouping.applied ) {
      return;
    }

    var metaEdges = topologyGrouping.getMetaEdges();
    metaEdges.forEach( function( edge ) {
      var toRestore = edge.data('tg-to-restore');
      edge.remove();
      toRestore.restore();

      EDGE_STYLE_NAMES.forEach( function( name ) {
        var oldVal = topologyGrouping.metaStyleMap[ name ][ edge.id() ];
        var newVal = edge.data( name );

        if ( oldVal !== newVal ) {
          toRestore.data( name, newVal );
        }
      } );
    } );

    initMetaStyleMap();

    var parents = topologyGrouping.getGroupCompounds();
    elementUtilities.changeParent( parents.children(), null );
    parents.remove();

    topologyGrouping.applied = false;

    if ( lockGraphTopology ) {
      elementUtilities.unlockGraphTopology();
    }
  };

  topologyGrouping.getMetaEdges = function() {
    var metaEdges = cy.edges('[' + metaEdgeIdentifier + ']');
    return metaEdges;
  };

  topologyGrouping.getGroupCompounds = function() {
    var className = groupCompoundType;
    return cy.nodes('[class="' + className + '"]');
  };

  topologyGrouping.clearAppliedFlag = function() {
    topologyGrouping.applied = false;
  };

  topologyGrouping.setAppliedFlag = function(applied) {
    topologyGrouping.applied = applied;
  };

  topologyGrouping.toggleAppliedFlag = function() {
    topologyGrouping.applied = !topologyGrouping.applied;
  };

  function initMetaStyleMap() {
    topologyGrouping.metaStyleMap = {};
    EDGE_STYLE_NAMES.forEach( function( name ) {
      topologyGrouping.metaStyleMap[ name ] = {};
    } );
  }

  function evalOpt( opt ) {
    if ( typeof opt === 'function' ) {
      return opt();
    }

    return opt;
  }

  function getNodeGroups( list ) {
    if ( list.length <= 1 ) {
      return list;
    }

    var halves = getHalves( list );
    var firstPart = getNodeGroups( halves[ 0 ] );
    var secondPart = getNodeGroups( halves[ 1 ] );
    // merge the halves
	  var groups = mergeGroups( firstPart, secondPart );

    return groups;
  }

  function getParentOrSelf( node ) {
    var parent = node.parent();
    return parent.size() > 0 ? parent : node;
  }

  function calcGroupingKey( edge ) {
    var srcId = getParentOrSelf( edge.source() ).id();
    var tgtId = getParentOrSelf( edge.target() ).id();
    var edgeType = getEdgeType( edge );

    return [ edgeType, srcId, tgtId ].join( '-' );
  }

  function addToMapChain( map, key, val ) {
    if ( !map[ key ] ) {
      map[ key ] = cy.collection();
    }

    map[ key ] = map[ key ].add( val );
  }

  function applyGrouping( groups ) {
    groups.forEach( function( group ) {
      createGroupCompound( group );
    } );

    var compounds = topologyGrouping.getGroupCompounds();
    var childrenEdges = compounds.children().connectedEdges();
    var edgesMap = [];

    childrenEdges.forEach( function( edge ){
      var key = calcGroupingKey( edge );
      addToMapChain( edgesMap, key, edge );
      edge.remove();
    } );

    Object.keys( edgesMap ).forEach( function( key ) {
      // make a dummy edge for all of edges that are mapped by key
  		// dummy edge should have common properties of given edges
  		// and should carry their id list in its data
  		// for source and target it should have parent of common source and target
      createMetaEdgeFor( edgesMap[ key ] );
    } );
  }

  function createGroupCompound( group ) {
    if ( group.length < 2 ) {
      return;
    }

    var collection = cy.collection();

    group.forEach( function( node ) {
      collection = collection.add( node );
    } );

    elementUtilities.createCompoundForGivenNodes( collection, groupCompoundType );
  }

  function createMetaEdgeFor( edges ) {
    var srcId = getParentOrSelf( edges.source() ).id();
    var tgtId = getParentOrSelf( edges.target() ).id();
    var type = edges.data( 'class' );
    cy.remove( edges );

    var metaEdge = elementUtilities.addEdge( srcId, tgtId, type );
    metaEdge.data( 'tg-to-restore', edges );
    metaEdge.data( metaEdgeIdentifier, true );

    EDGE_STYLE_NAMES.forEach( function( styleName ) {
      edges.forEach( function( edge ) {
        topologyGrouping.metaStyleMap[ styleName ][ edge.id() ] = edge.data( styleName );
      } );

      var commonVal = elementUtilities.getCommonProperty(edges, styleName, 'data');
      if ( commonVal ) {
        metaEdge.data( styleName, commonVal );
      }
    } );

    return metaEdge;
  }

  function mergeGroups( groups1, groups2 ) {
    // notMergedGrs will include members of groups1 that are not merged
  	// mergedGrs will include the merged members from 2 groups
  	var notMergedGrs = [], mergedGrs = [];

    groups1.forEach( function( gr1 ) {
      var merged = false;

      mergedGrs.concat( groups2 ).forEach( function( gr2, index2 ) {
        // if groups should be merged merge them, remove gr2 from where it
        // comes from and push the merge result to mergedGrs
        if ( shouldMerge( gr1, gr2 ) ) {
          var mergedGr = gr1.concat( gr2 );

          if ( index2 >= mergedGrs.length ) {
            removeAt( groups2, index2 - mergedGrs.length );
          }
          else {
            removeAt( mergedGrs, index2 );
          }

          // mark as merged and break the loop
          mergedGrs.push( mergedGr );
          merged = true;
          return;
        }
      } );

      // if gr1 is not merged push it to notMergedGrs
      if ( !merged ) {
        notMergedGrs.push( gr1 );
      }
    } );

    // the groups that comes from groups2 but not merged are still included
	  // in groups2 add them to the result together with mergedGrs and notMergedGrs
    return notMergedGrs.concat( mergedGrs, groups2 );
  }

  function shouldMerge( group1, group2 ) {
    // using first elements is enough to decide whether to merge
  	var node1 = group1[ 0 ];
  	var node2 = group2[ 0 ];

    if ( node1.edges().length !== node2.edges().length ) {
      return false;
    }

    var getUndirectedEdges = function( node ) {
      var edges = node.connectedEdges().filter( isUndirectedEdge );
      return edges;
    };
    // undirected edges of node1 and node2 respectively
    var undir1 = getUndirectedEdges( node1 );
    var undir2 = getUndirectedEdges( node2 );

    var in1 = node1.incomers().edges().not( undir1 );
    var in2 = node2.incomers().edges().not( undir2 );

    var out1 = node1.outgoers().edges().not( undir1 );
	  var out2 = node2.outgoers().edges().not( undir2 );

    return compareEdgeGroup( in1, in2, node1, node2 )
            && compareEdgeGroup( out1, out2, node1, node2 )
            && compareEdgeGroup( undir1, undir2, node1, node2 );
  }

  // decide if 2 edge groups contains set of edges with similar content (type,
  // source,target) relative to their nodes where gr1 are edges of node1 and gr2 are edges of
  // node2
  function compareEdgeGroup( gr1, gr2, node1, node2 ) {
    var id1 = node1.id();
    var id2 = node2.id();

    var map1 = fillIdToTypeSetMap( gr1, node1 );
    var map2 = fillIdToTypeSetMap( gr2, node2 );

    if ( Object.keys( map1 ).length !== Object.keys( map2 ).length ) {
      return;
    }

    var failed = false;

    Object.keys( map1 ).forEach( function( key ) {
      // if already failed just return
      if ( failed ) {
        return;
      }

      // if key is id2 use id1 instead because comparison is relative to nodes
      var otherKey = ( key == id2 ) ? id1 : key;

      // check if the sets have the same content
  		// if check fails return false
      if ( !isEqual( map1[ key ], map2[ otherKey ] ) ) {
        failed = true;
      }
    } );

    // if check passes for each key return true
    return !failed;
  }

  function fillIdToTypeSetMap( edgeGroup, node ) {
    var map = {};
    var nodeId = node.id();

    edgeGroup.forEach( function( edge ) {
      var srcId = edge.data('source');
      var tgtId = edge.data('target');
      var edgeId = edge.id();

      var otherEnd = ( nodeId === tgtId ) ? srcId : tgtId;

      function addToRelatedSet( sideStr, value ) {
        if ( !map[ sideStr ] ) {
          map[ sideStr ] = new Set();
        }

        map[ sideStr ].add( value );
      }

      var edgeType = getEdgeType( edge );

      addToRelatedSet( otherEnd, edgeType );
    } );

    return map;
  }

  function getEdgeType( edge ) {
    return edge.data( 'class' );
  }

  function isUndirectedEdge( edge ) {
    return elementUtilities.isUndirectedEdge( edge );
  }

  // get halves of a list. It is assumed that list size is at least 2.
  function getHalves( list ) {
    var s = list.length;
    var halfIndex = Math.floor( s / 2 );
    var firstHalf = list.slice( 0, halfIndex );
    var secondHalf = list.slice( halfIndex, s );

    return [ firstHalf, secondHalf ];
  }

  function removeAt( arr, index ) {
    arr.splice( index, 1 );
  }

  return topologyGrouping;
};

},{"lodash.isequal":1}],10:[function(_dereq_,module,exports){
// Extends sbgnviz.undoRedoActionFunctions
var libs = _dereq_('./lib-utilities').getLibs();

module.exports = function () {

  var sbgnvizInstance, undoRedoActionFunctions, elementUtilities, cy, topologyGrouping;

  function undoRedoActionFunctionsExtender (param) {

    sbgnvizInstance = param.sbgnvizInstanceUtilities.getInstance();
    cy = param.sbgnvizInstanceUtilities.getCy();
    undoRedoActionFunctions = sbgnvizInstance.undoRedoActionFunctions;
    elementUtilities = param.elementUtilities;
    topologyGrouping = param.sifTopologyGrouping;

    extend();
  }

  // Extends undoRedoActionFunctions with chise specific features
  function extend () {

    undoRedoActionFunctions.applySIFTopologyGrouping = function(param) {
      var oldEles, newEles;
      if ( param.firstTime ) {
        oldEles = cy.elements();

        if (param.apply) {
          topologyGrouping.apply();
        }
        else {
          topologyGrouping.unapply();
        }

        newEles = cy.elements();
      }
      else {
        oldEles = param.oldEles;
        newEles = param.newEles;

        if ( elementUtilities.isGraphTopologyLocked() ) {
          elementUtilities.unlockGraphTopology();
        }
        else {
          elementUtilities.lockGraphTopology();
        }

        oldEles.remove();
        newEles.restore();

        topologyGrouping.toggleAppliedFlag();
      }

      var result = { oldEles: newEles, newEles: oldEles };
      return result;
    };

    // Section Start
    // add/remove action functions

    undoRedoActionFunctions.addNode = function (param) {
      var result;
      if (param.firstTime) {
        var newNode = param.newNode;
        result = elementUtilities.addNode(newNode.x, newNode.y, newNode.class, newNode.id, newNode.parent, newNode.visibility);
      }
      else {
        result = elementUtilities.restoreEles(param);
      }

      return {
        eles: result
      };
    };

    undoRedoActionFunctions.addEdge = function (param) {
      var result;
      if (param.firstTime) {
        var newEdge = param.newEdge;
        result = elementUtilities.addEdge(newEdge.source, newEdge.target, newEdge.class, newEdge.id, newEdge.visibility);
      }
      else {
        result = elementUtilities.restoreEles(param);
      }

      return {
        eles: result
      };
    };

    undoRedoActionFunctions.addProcessWithConvenientEdges = function(param) {
      var result;
      if (param.firstTime) {
        result = elementUtilities.addProcessWithConvenientEdges(param.source, param.target, param.processType);
      }
      else {
        result = elementUtilities.restoreEles(param);
      }

      return {
        eles: result
      };
    };

    undoRedoActionFunctions.createCompoundForGivenNodes = function (param) {
      var result = {};

      if (param.firstTime) {
        // Nodes to make compound, their descendants and edges connected to them will be removed during createCompoundForGivenNodes operation
        // (internally by eles.move() operation), so mark them as removed eles for undo operation.
        var nodesToMakeCompound = param.nodesToMakeCompound;
        var removedEles = nodesToMakeCompound.union(nodesToMakeCompound.descendants());
        removedEles = removedEles.union(removedEles.connectedEdges());
        result.removedEles = removedEles;
        // Assume that all nodes to make compound have the same parent
        var oldParentId = nodesToMakeCompound[0].data("parent");
        // The parent of new compound will be the old parent of the nodes to make compound
        // New eles includes new compound and the moved eles and will be used in undo operation.
        result.newEles = elementUtilities.createCompoundForGivenNodes(nodesToMakeCompound, param.compoundType);
      }
      else {
        result.removedEles = param.newEles.remove();
        result.newEles = param.removedEles.restore();
        elementUtilities.maintainPointer(result.newEles);
      }

      return result;
    };

    // Section End
    // add/remove action functions

    // Section Start
    // easy creation action functions

    undoRedoActionFunctions.createTemplateReaction = function (param) {
      var firstTime = param.firstTime;
      var eles;

      if (firstTime) {
        eles = elementUtilities.createTemplateReaction(param.templateType, param.macromoleculeList, param.complexName, param.processPosition, param.tilingPaddingVertical, param.tilingPaddingHorizontal, param.edgeLength, param.layoutParam)
      }
      else {
        eles = param;
        cy.add(eles);

        cy.elements().unselect();
        eles.select();
      }

      return {
        eles: eles
      };
    };

    // Section End
    // easy creation action functions

    // Section Start
    // general action functions

    undoRedoActionFunctions.getNodePositions = function () {
      var positions = {};
      var nodes = cy.nodes();

      nodes.each(function(ele, i) {
        if(typeof ele === "number") {
          ele = i;
        }

        positions[ele.id()] = {
          x: ele.position("x"),
          y: ele.position("y")
        };
      });

      return positions;
    };

    undoRedoActionFunctions.returnToPositions = function (positions) {
      var currentPositions = {};
      cy.nodes().positions(function (ele, i) {
        if(typeof ele === "number") {
          ele = i;
        }

        currentPositions[ele.id()] = {
          x: ele.position("x"),
          y: ele.position("y")
        };

        var pos = positions[ele.id()];
        return {
          x: pos.x,
          y: pos.y
        };
      });

      return currentPositions;
    };

    undoRedoActionFunctions.resizeNodes = function (param) {
      var result = {
        performOperation: true
      };

      var nodes = param.nodes;

      result.sizeMap = {};
      result.useAspectRatio = false;
      result.preserveRelativePos = param.preserveRelativePos;

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if(node.isParent()){
          result.sizeMap[node.id()] = {
            w: node.data("minWidth") || 0,
            h: node.data("minHeight") || 0,
            biasL : node.data("minWidthBiasLeft") || 0,
            bisaR : node.data("minWidthBiasRight") || 0,
            biasT : node.data("minHeightBiasTop") || 0,
            biasB : node.data("minHeightBiasBottom") || 0
           // w: node.css("minWidth") != 0?  node.data("minWidth") : node.children().boundingBox().w,
            //h: node.css("min-height") != 0?  node.data("minHeight") : node.children().boundingBox().h
          };
        }else{
          result.sizeMap[node.id()] = {
            w: node.width(),
            h: node.height()
          };
        }
        
      }

      result.nodes = nodes;

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];

        if (param.performOperation) {
          if (param.sizeMap) {
            /* if (param.preserveRelativePos === true) {
              var oldWidth = node.data("bbox").w;
              var oldHeight = node.data("bbox").h;
            } */

            if(node.isParent()){
              
              node.data("minHeight" , param.sizeMap[node.id()].h);
              node.data("minWidth" , param.sizeMap[node.id()].w);
              node.data("minWidthBiasLeft", param.sizeMap[node.id()].biasL);
              node.data("minWidthBiasRight", param.sizeMap[node.id()].biasR);
              node.data("minHeightBiasTop", param.sizeMap[node.id()].biasT);
              node.data("minHeightBiasBottom", param.sizeMap[node.id()].biasB);

            }else{
              node.data("bbox").w = param.sizeMap[node.id()].w;
              node.data("bbox").h = param.sizeMap[node.id()].h;
            }
           

            /* if (param.preserveRelativePos === true) {
              var statesandinfos = node.data('statesandinfos');
              var topBottom = statesandinfos.filter(box => (box.anchorSide === "top" || box.anchorSide === "bottom"));
              var rightLeft = statesandinfos.filter(box => (box.anchorSide === "right" || box.anchorSide === "left"));

              topBottom.forEach(function(box){
                if (box.bbox.x < 0) {
                  box.bbox.x = 0;
                }
                else if (box.bbox.x > oldWidth) {
                  box.bbox.x = oldWidth;
                }
                box.bbox.x = node.data("bbox").w * box.bbox.x / oldWidth;
              });

              rightLeft.forEach(function(box){
                if (box.bbox.y < 0) {
                  box.bbox.y = 0;
                }
                else if (box.bbox.y > oldHeight) {
                  box.bbox.y = oldHeight;
                }
                box.bbox.y = node.data("bbox").h * box.bbox.y / oldHeight;
              });
            } */
          }
          else {
            elementUtilities.resizeNodes(param.nodes, param.width, param.height, param.useAspectRatio, param.preserveRelativePos);
          }
        }
      }
      cy.style().update();
      return result;
    };

    undoRedoActionFunctions.changeNodeLabel = function (param) {
      var result = {
      };
      var nodes = param.nodes;
      result.nodes = nodes;
      result.label = {};

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        result.label[node.id()] = node._private.data.label;
      }

      if (param.firstTime) {
        nodes.data('label', param.label);
      }
      else {
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          node._private.data.label = param.label[node.id()];
        }
      }

      return result;
    };

    undoRedoActionFunctions.updateInfoboxStyle = function (param) {
      var result = {
      };
      var style = param.node.data('statesandinfos')[param.index].style;
      result.newProps = $.extend( {}, style );
      result.node = param.node;
      result.index = param.index;

      elementUtilities.updateInfoboxStyle( param.node, param.index, param.newProps );

      return result;
    };

    undoRedoActionFunctions.updateInfoboxObj = function (param) {
      var result = {
      };
      var obj = param.node.data('statesandinfos')[param.index];
      result.newProps = $.extend( {}, obj );
      result.node = param.node;
      result.index = param.index;

      elementUtilities.updateInfoboxObj( param.node, param.index, param.newProps );

      return result;
    };

    undoRedoActionFunctions.changeData = function (param) {
      var result = {
      };
      var eles = param.eles;
      result.name = param.name;
      result.valueMap = {};
      result.eles = eles;

      for (var i = 0; i < eles.length; i++) {
        var ele = eles[i];
        result.valueMap[ele.id()] = ele.data(param.name);
      }

      elementUtilities.changeData(param.eles, param.name, param.valueMap);

      return result;
    };

    undoRedoActionFunctions.updateSetField = function( param ) {
      var updates = elementUtilities.updateSetField( param.ele, param.fieldName, param.toDelete, param.toAdd, param.callback );

      var result = {
        ele: param.ele,
        fieldName: param.fieldName,
        callback: param.callback,
        toDelete: updates.added,
        toAdd: updates.deleted
      };

      return result;
    };

    undoRedoActionFunctions.changeCss = function (param) {
      var result = {
      };
      var eles = param.eles;
      result.name = param.name;
      result.valueMap = {};
      result.eles = eles;

      for (var i = 0; i < eles.length; i++) {
        var ele = eles[i];
        result.valueMap[ele.id()] = ele.css(param.name);
      }

      elementUtilities.changeCss(param.eles, param.name, param.valueMap);

      return result;
    };

    undoRedoActionFunctions.changeFontProperties = function (param) {
      var result = {
      };

      var eles = param.eles;
      result.data = {};
      result.eles = eles;

      for (var i = 0; i < eles.length; i++) {
        var ele = eles[i];

        result.data[ele.id()] = {};

        var data = param.firstTime ? param.data : param.data[ele.id()];

        for (var prop in data) {
          result.data[ele.id()][prop] = ele.data(prop);
        }
      }

      if (param.firstTime) {
        elementUtilities.changeFontProperties(eles, data);
      }
      else {
        for (var i = 0; i < eles.length; i++) {
          var ele = eles[i];

          elementUtilities.changeFontProperties(ele, data);
        }
      }

      return result;
    };

    /*
     * Show eles and perform layout.
     */
    undoRedoActionFunctions.showAndPerformLayout = function (param) {
      var eles = param.eles;

      var result = {};
      result.positions = undoRedoActionFunctions.getNodePositions();

      if (param.firstTime) {
        result.eles = elementUtilities.showAndPerformLayout(param.eles, param.layoutparam);
      }
      else {
        result.eles = cy.viewUtilities().show(eles); // Show given eles
        undoRedoActionFunctions.returnToPositions(param.positions);
      }

      return result;
    };

    undoRedoActionFunctions.undoShowAndPerformLayout = function (param) {
      var eles = param.eles;

      var result = {};
      result.positions = undoRedoActionFunctions.getNodePositions();
      result.eles = cy.viewUtilities().hide(eles); // Hide previously unhidden eles;

      undoRedoActionFunctions.returnToPositions(param.positions);

      return result;
    };

    /*
     * Hide eles and perform layout.
     */
    undoRedoActionFunctions.hideAndPerformLayout = function (param) {
        var eles = param.eles;

        var result = {};
        result.positions = undoRedoActionFunctions.getNodePositions();

        if (param.firstTime) {
            result.eles = elementUtilities.hideAndPerformLayout(param.eles, param.layoutparam);
        }
        else {
            result.eles = cy.viewUtilities().hide(eles); // Hide given eles
            undoRedoActionFunctions.returnToPositions(param.positions);
        }

        return result;
    };

    undoRedoActionFunctions.undoHideAndPerformLayout = function (param) {
        var eles = param.eles;

        var result = {};
        result.positions = undoRedoActionFunctions.getNodePositions();
        result.eles = cy.viewUtilities().show(eles); // Show previously hidden eles

        undoRedoActionFunctions.returnToPositions(param.positions);

        return result;
    };

    /*
     * Delete eles and perform layout.
     */
    undoRedoActionFunctions.deleteAndPerformLayout = function (param) {
      var eles = param.eles;

      var result = {};
      result.positions = undoRedoActionFunctions.getNodePositions();

      if (param.firstTime) {
          result.eles = elementUtilities.deleteAndPerformLayout(param.eles, param.layoutparam);
      }
      else {
          result.eles = eles.remove();
          undoRedoActionFunctions.returnToPositions(param.positions);
      }

      return result;
  };

  undoRedoActionFunctions.undoDeleteAndPerformLayout = function (param) {
      var eles = param.eles;

      var result = {};
      result.positions = undoRedoActionFunctions.getNodePositions();
      result.eles = elementUtilities.restoreEles(eles); 

      undoRedoActionFunctions.returnToPositions(param.positions);

      return result;
  };

    // Section End
    // general action functions

    // Section Start
    // sbgn action functions

    undoRedoActionFunctions.changeStateOrInfoBox = function (param) {
      var result = {
      };
      result.type = param.type;
      result.nodes = param.nodes;
      result.index = param.index;
      var data = param.data;

      var tempData = elementUtilities.saveUnits(param.nodes);
      result.value = elementUtilities.changeStateOrInfoBox(param.nodes, param.index, param.value, param.type);
      /* var locations = elementUtilities.checkFit(param.nodes);
      if (locations !== undefined && locations.length > 0) {
        elementUtilities.fitUnits(param.nodes, locations);
      } */
      if (data !== undefined) {
        elementUtilities.restoreUnits(param.nodes, data);
      }

      cy.forceRender();
      result.data = tempData;
      return result;
    };

    undoRedoActionFunctions.addStateOrInfoBox = function (param) {
      var obj = param.obj;
      var nodes = param.nodes;
      var data = param.data;

      var tempData = elementUtilities.saveUnits(nodes);
      var locationObj = elementUtilities.addStateOrInfoBox(nodes, obj);
     /*  var locations = elementUtilities.checkFit(nodes);
      if (locations !== undefined && locations.length > 0) {
        elementUtilities.fitUnits(nodes, locations);
      } */
      if (data !== undefined) {
        elementUtilities.restoreUnits(nodes, data);
      }

      cy.forceRender();

      var result = {
        nodes: nodes,
        locationObj: locationObj,
        obj: obj,
        data: tempData
      };
      return result;
    };

    undoRedoActionFunctions.removeStateOrInfoBox = function (param) {
      var locationObj = param.locationObj;
      var nodes = param.nodes;
      var data = param.data;

      var tempData = elementUtilities.saveUnits(nodes);
      var obj = elementUtilities.removeStateOrInfoBox(nodes, locationObj);
      if (data !== undefined) {
        elementUtilities.restoreUnits(nodes, data);
      }

      cy.forceRender();

      var result = {
        nodes: nodes,
        obj: obj,
        data: tempData
      };
      return result;
    };

    undoRedoActionFunctions.fitUnits = function (param) {
      var node = param.node;
      var locations = param.locations;
      var obj = elementUtilities.fitUnits(node, locations);

      cy.forceRender();

      var result = {
        node: node,
        obj: obj,
        locations: locations
      };
      return result;
    };

    undoRedoActionFunctions.restoreUnits = function (param) {
      var node = param.node;
      var locations = param.locations;
      var obj = param.obj;
      var index = 0;
      node.data('statesandinfos').forEach( function (ele) {
        var box = obj[index++];
        ele.bbox.x = box.x;
        ele.bbox.y = box.y;
        var oldSide = ele.anchorSide;
        ele.anchorSide = box.anchorSide;
        elementUtilities.modifyUnits(node, ele, oldSide);
      });

      cy.forceRender();

      var result = {
        node: node,
        locations: locations
      };
      return result;
    };

    undoRedoActionFunctions.setMultimerStatus = function (param) {
      var firstTime = param.firstTime;
      var nodes = param.nodes;
      var status = param.status;
      var resultStatus = {};

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var isMultimer = node.data('class').endsWith(' multimer');

        resultStatus[node.id()] = isMultimer;
      }

      // If this is the first time change the status of all nodes at once.
      // If not change status of each seperately to the values mapped to their id.
      if (firstTime) {
        elementUtilities.setMultimerStatus(nodes, status);
      }
      else {
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          elementUtilities.setMultimerStatus(node, status[node.id()]);
        }
      }

    //  if (!firstTime && _.isEqual(nodes, cy.nodes(':selected'))) {
    //    $('#inspector-is-multimer').attr("checked", !$('#inspector-is-multimer').attr("checked"));
    //  }

      var result = {
        status: resultStatus,
        nodes: nodes
      };

      return result;
    };

    undoRedoActionFunctions.setCloneMarkerStatus = function (param) {
      var nodes = param.nodes;
      var status = param.status;
      var firstTime = param.firstTime;
      var resultStatus = {};

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        resultStatus[node.id()] = node.data('clonemarker');
        var currentStatus = firstTime ? status : status[node.id()];
        elementUtilities.setCloneMarkerStatus(node, currentStatus);
      }

    //  if (!firstTime && _.isEqual(nodes, cy.nodes(':selected'))) {
    //    $('#inspector-is-clone-marker').attr("checked", !$('#inspector-is-clone-marker').attr("checked"));
    //  }

      var result = {
        status: resultStatus,
        nodes: nodes
      };

      return result;
    };

    // param: {class: sbgnclass, name: propertyName, value: value}
    undoRedoActionFunctions.setDefaultProperty = function (param) {
      var sbgnclass = param.class;
      var name = param.name;
      var value = param.value;
      var classDefaults = elementUtilities.getDefaultProperties(sbgnclass);
      var result = {
        class: sbgnclass,
        name: name,
        value: classDefaults.hasOwnProperty(name) ? classDefaults[name] : undefined
      };

      var propMap = {};
      propMap[ name ] = value;

      elementUtilities.setDefaultProperties( sbgnclass, propMap );

      return result;
    };

    undoRedoActionFunctions.addBackgroundImage = function (param) {
      var bgObj = param.bgObj;
      var nodes = param.nodes;
      var updateInfo = param.updateInfo;
      var promptInvalidImage = param.promptInvalidImage;
      var validateURL = param.validateURL;

      elementUtilities.addBackgroundImage(nodes, bgObj, updateInfo, promptInvalidImage, validateURL);

      cy.forceRender();

      var result = {
        nodes: nodes,
        bgObj: bgObj,
        updateInfo: updateInfo,
        promptInvalidImage: promptInvalidImage,
        validateURL: validateURL
      };
      return result;
    };

    undoRedoActionFunctions.removeBackgroundImage = function (param) {
      var bgObj = param.bgObj;
      var nodes = param.nodes;

      elementUtilities.removeBackgroundImage(nodes, bgObj);

      cy.forceRender();

      var result = {
        nodes: nodes,
        bgObj: bgObj
      };
      return result;
    };

    undoRedoActionFunctions.updateBackgroundImage = function (param) {
      var bgObj = param.bgObj;
      var nodes = param.nodes;

      var oldBgObj = elementUtilities.updateBackgroundImage(nodes, bgObj);

      cy.forceRender();

      var result = {
        nodes: nodes,
        bgObj: oldBgObj
      };
      return result;
    };

    undoRedoActionFunctions.changeBackgroundImage = function (param) {
      var oldImg = param.oldImg;
      var newImg = param.newImg;
      var nodes = param.nodes;
      var firstTime = param.firstTime;
      var updateInfo = param.updateInfo;
      var promptInvalidImage = param.promptInvalidImage;
      var validateURL= param.validateURL;

      var result = elementUtilities.changeBackgroundImage(nodes, oldImg, newImg, firstTime, updateInfo, promptInvalidImage, validateURL);

      cy.forceRender();

      return result;
    };

    // Section End
    // sbgn action functions
    undoRedoActionFunctions.convertIntoReversibleReaction = function (param) {
      let collection = cy.collection();
      let mapType = elementUtilities.getMapType();
      elementUtilities.setMapType(param.mapType);
      $('#map-type').val(param.mapType);

      param.collection.forEach(function(edge) {
        var sourceNode = edge._private.data.source;
        var targetNode = edge._private.data.target;

        edge.move({source: targetNode, target: sourceNode});

        let convertedEdge = cy.getElementById(edge.id());

        if(convertedEdge.data("cyedgebendeditingDistances")){
          let distance = convertedEdge.data("cyedgebendeditingDistances");
          distance = distance.map(function(element) {
            return -1*element;
          });
          convertedEdge.data("cyedgebendeditingDistances", distance.reverse());

          let weight = convertedEdge.data("cyedgebendeditingWeights");
          weight = weight.map(function(element) {
            return 1-element;
          });
          convertedEdge.data("cyedgebendeditingWeights", weight.reverse());
        }

        if(convertedEdge.data("cyedgecontroleditingDistances")){
          let distance = convertedEdge.data("cyedgecontroleditingDistances");
          distance = distance.map(function(element) {
            return -1*element;
          });
          convertedEdge.data("cyedgecontroleditingDistances", distance.reverse());

          let weight = convertedEdge.data("cyedgecontroleditingWeigths");
          weight = weight.map(function(element) {
            return 1-element;
          });
          convertedEdge.data("cyedgecontroleditingWeigths", weight.reverse());
        }

        if (convertedEdge._private.data.class === "consumption") {
          convertedEdge._private.data.class = "production";
          convertedEdge._private.data.portsource = targetNode + ".1";
          convertedEdge._private.data.porttarget = sourceNode;
        }
        else if (convertedEdge._private.data.class === "production") {
          convertedEdge._private.data.class = "consumption";
          convertedEdge._private.data.portsource = targetNode;
          convertedEdge._private.data.porttarget = sourceNode + ".1";
        }

        collection = collection.add(convertedEdge);
        cy.style().update();
      });

      var result = {
        collection: collection,
        mapType: mapType,
        processId: param.processId
      };
      return result;
    }

    undoRedoActionFunctions.moveEdge = function (param) {
      var result = {
      };
      var edge = param.edge;
      result.name = param.name;      
     

      result.source = edge.source().id();
      result.target = edge.target().id();      
      result.portsource  =edge.data("portsource");
      result.porttarget = edge.data("porttarget");
      elementUtilities.changeData(edge, 'source', param.source);
      elementUtilities.changeData(edge, 'target', param.target);
      elementUtilities.changeData(edge, 'portsource', param.portsource);
      elementUtilities.changeData(edge, 'porttarget', param.porttarget); 
      edge = edge.move({
        target: param.target,
        source : param.source
    
     });

     result.edge = edge;
      return result;
    };

    undoRedoActionFunctions.fixError = function(param){
      
      var errorCode = param.errorCode;
      var result = {};
      result.errorCode = errorCode;
      if(errorCode == "pd10101" || errorCode == 'pd10102'){

        result.edge = elementUtilities.reverseEdge(param.edge);

         return result;
      }else if(errorCode == "pd10103" || errorCode == 'pd10107'){

       
        
        param.newNodes.forEach(function(newNode){
         elementUtilities.addNode(newNode.x, newNode.y, newNode.class, newNode.id, undefined);

          
        });

        param.newEdges.forEach(function(newEdge){          
          elementUtilities.addEdge(newEdge.source,newEdge.target,newEdge.class);
        });

        param.oldEdges.forEach(function(oldEdge){
          cy.elements().unselect();
          //return 
          oldEdge.remove();
        });

        param.node.remove();

        return param;

      }else if(errorCode == "pd10105" || errorCode == 'pd10106'){
   
        result.edge = elementUtilities.reverseEdge(param.edge);
        return result;
      }else if(errorCode == "pd10140"){
        param.node.remove();
        return param;
      }else if(errorCode == "pd10104") {
        
        param.edges.forEach(function(edge){
          edge.remove();
        });
        param.nodes.forEach(function(node){
          node.remove();
        });
        return param;
      }else if(errorCode == "pd10108"){
        param.edges.forEach(function(edge){
          edge.remove();
        });
        param.nodes.forEach(function(node){
          node.remove();
        });
        return param;
      }else if(errorCode == "pd10111"){
        param.edges.forEach(function(edge){
          edge.remove();
        });
        return param;
      }else if(errorCode == "pd10126"){
        param.edges.forEach(function(edge){
          edge.remove();
        });
        param.nodes.forEach(function(node){
          node.remove();
        });
        return param;
      }else if(errorCode == "pd10109" || errorCode == "pd10124") {
        
        result.newSource = param.edge.data().source;
        result.newTarget = param.edge.data().target;
        result.portsource = param.edge.data().portsource;
        var clonedEdge = param.edge.clone();
       
        var edgeParams = {class : clonedEdge.data().class, language :clonedEdge.data().language};
        clonedEdge.data().source = param.newSource;
        clonedEdge.data().target = param.newTarget;
        cy.remove(param.edge);
        result.edge = elementUtilities.addEdge(param.newSource,param.newTarget,edgeParams, clonedEdge.data().id);      
        return result;

      }else if(errorCode == "pd10112") {    
        
        param.callback = elementUtilities.maintainPointer;  
        // If this is first time we should move the node to its new parent and relocate it by given posDiff params
        // else we should remove the moved eles and restore the eles to restore
        if (param.firstTime) {
          var newParentId = param.parentData == undefined ? null : param.parentData;
          // These eles includes the nodes and their connected edges and will be removed in nodes.move().
          // They should be restored in undo
          var withDescendant = param.nodes.union(param.nodes.descendants());
          result.elesToRestore = withDescendant.union(withDescendant.connectedEdges());
          // These are the eles created by nodes.move(), they should be removed in undo.
          result.movedEles = param.nodes.move({"parent": newParentId});

          var posDiff = {
            x: param.posDiffX,
            y: param.posDiffY
          };

          elementUtilities.moveNodes(posDiff, result.movedEles);
        }
        else {
          result.elesToRestore = param.movedEles.remove();
          result.movedEles = param.elesToRestore.restore();
        }

        if (param.callback) {
          result.callback = param.callback; // keep the provided callback so it can be reused after undo/redo
          param.callback(result.movedEles); // apply the callback on newly created elements
        }

        return result;
      
      }else if(errorCode == "pd10125") {

       result.edge = param.edge.remove();       
       result.newEdge ={};
       var edgeclass = param.newEdge.edgeParams.class ? param.newEdge.edgeParams.class : param.newEdge.edgeParams;
       var validation = elementUtilities.validateArrowEnds(edgeclass, cy.getElementById(param.newEdge.source), cy.getElementById(param.newEdge.target));

       if (validation === 'reverse') {
        var temp = param.newEdge.source;
        param.newEdge.source = param.newEdge.target;
        param.newEdge.target = temp;
      }
       result.newEdge.id =elementUtilities.addEdge(param.newEdge.source,param.newEdge.target,param.newEdge.edgeParams).id();
       result.newEdge.source = param.newEdge.source;
       result.newEdge.target = param.newEdge.target;
       result.newEdge.edgeParams = param.newEdge.edgeParams;
       
       return result;

        
      }else if(errorCode == "pd10142") {
        result.edge = param.edge.remove();       
        result.newEdge ={};
        var edgeclass = param.newEdge.edgeParams.class ? param.newEdge.edgeParams.class : param.newEdge.edgeParams;
        var validation = elementUtilities.validateArrowEnds(edgeclass, cy.getElementById(param.newEdge.source), cy.getElementById(param.newEdge.target));

        if (validation === 'reverse') {
         var temp = param.newEdge.source;
         param.newEdge.source = param.newEdge.target;
         param.newEdge.target = temp;
       }
        result.newEdge.id =elementUtilities.addEdge(param.newEdge.source,param.newEdge.target,param.newEdge.edgeParams).id();
        result.newEdge.source = param.newEdge.source;
        result.newEdge.target = param.newEdge.target;
        result.newEdge.edgeParams = param.newEdge.edgeParams;
        
        return result;
      }else {

        result.newSource = param.edge.source().id();
        result.newTarget = param.edge.target().id();
        result.porttarget = param.edge.data("porttarget");
        result.edge = param.edge.move({
          target: param.newTarget,
          source : param.newSource      
        });

        elementUtilities.changeData(result.edge, 'porttarget', param.porttarget);
        return result;
        
      }
      
  }
  
  undoRedoActionFunctions.unfixError = function(param){
    var errorCode = param.errorCode;
    var result = {};
    result.errorCode = errorCode;
    if(errorCode == "pd10101" || errorCode == 'pd10102'){
     
        result.edge = elementUtilities.reverseEdge(param.edge);
      return result;
    }else if(errorCode == "pd10103" || errorCode == 'pd10107'){

      param.newNodes.forEach(function(newNode){    
        cy.remove(cy.$('#'+newNode.id))      
        
      });

      param.node.restore();

      param.oldEdges.forEach(function(oldEdge){  
        oldEdge.restore();
      });

      cy.animate({
        duration: 100,
        easing: 'ease',
        fit :{eles:{},padding:20}, 
        complete: function(){
              
        }
      });

      return param;

    }else if(errorCode == "pd10105" || errorCode == 'pd10106'){  

      result.edge = elementUtilities.reverseEdge(param.edge);
      return result;

    }else if(errorCode == "pd10140"){
      param.node.restore();
      cy.animate({
        duration: 100,
        easing: 'ease',
        fit :{eles:{},padding:20}, 
        complete: function(){
              
        }
      });
      return param;
    }else if(errorCode == "pd10104") {
      
      param.nodes.forEach(function(node){
        node.restore();
      });
      param.edges.forEach(function(edge){
        edge.restore();
      });
      return param;
    }else if(errorCode == "pd10108"){
      
      param.nodes.forEach(function(node){
        node.restore();
      });
      param.edges.forEach(function(edge){
        edge.restore();
      });
      return param;
    }else if(errorCode == "pd10111"){
      param.edges.forEach(function(edge){
        edge.restore();
      });
      return param;
    }else if(errorCode == "pd10126"){
      param.nodes.forEach(function(node){
        node.restore();
      });
      param.edges.forEach(function(edge){
        edge.restore();
      });       
      return param;
    }else if(errorCode == "pd10109" || errorCode == "pd10124") {

      result.newSource = param.edge.source().id();
      result.newTarget = param.edge.target().id();
      result.portsource = param.portsource;
      result.edge = param.edge.move({
        target: param.newTarget,
        source : param.newSource      
      });

      elementUtilities.changeData(result.edge, 'portsource', param.portsource); 
      return result;
    }else if(errorCode == "pd10112") {
     
      // If this is first time we should move the node to its new parent and relocate it by given posDiff params
      // else we should remove the moved eles and restore the eles to restore
      if (param.firstTime) {
        var newParentId = param.parentData == undefined ? null : param.parentData;
        // These eles includes the nodes and their connected edges and will be removed in nodes.move().
        // They should be restored in undo
        var withDescendant = param.nodes.union(param.nodes.descendants());
        result.elesToRestore = withDescendant.union(withDescendant.connectedEdges());
        // These are the eles created by nodes.move(), they should be removed in undo.
        result.movedEles = param.nodes.move({"parent": newParentId});

        var posDiff = {
          x: param.posDiffX,
          y: param.posDiffY
        };

        elementUtilities.moveNodes(posDiff, result.movedEles);
      }
      else {
        result.elesToRestore = param.movedEles.remove();
        result.movedEles = param.elesToRestore.restore();
      }

      if (param.callback) {
        result.callback = param.callback; // keep the provided callback so it can be reused after undo/redo
        param.callback(result.movedEles); // apply the callback on newly created elements
      }

     
      return result;
      
    }else if(errorCode == "pd10125") {

      cy.$('#'+param.newEdge.id).remove();
      param.edge = param.edge.restore();

    
      return param;
      
    }else if(errorCode == "pd10142") {
      cy.$('#'+param.newEdge.id).remove();
      param.edge = param.edge.restore();

    
      return param;
    }else {

      result.newSource = param.edge.source().id();
      result.newTarget = param.edge.target().id();
      result.porttarget = param.edge.data("porttarget");
      result.edge = param.edge.move({
        target: param.newTarget,
        source : param.newSource      
      });

      elementUtilities.changeData(result.edge, 'porttarget', param.porttarget);
      return result;

      
    }
    
  }

  undoRedoActionFunctions.cloneHighDegreeNode = function(node){

    var result = {};
    var oldX = node.position().x;
    var oldY = node.position().y;
    
    
    var claculateNewClonePosition = function(sourceEndPointX,sourceEndPointY,targetEndPointX,targetEndPointY,desiredDistance,direction){
      var distance = Math.sqrt(Math.pow(targetEndPointY-sourceEndPointY,2)+ Math.pow(targetEndPointX-sourceEndPointX,2));
      var ratio = desiredDistance/distance;
      var result = {};
      if(direction == "source"){ 
        result.cx = ((1-ratio) * sourceEndPointX)  + (ratio * targetEndPointX);
        result.cy = ((1-ratio) * sourceEndPointY)  + (ratio * targetEndPointY);
      }else{      
        result.cx = ((1-ratio) * targetEndPointX)  + (ratio * sourceEndPointX);
        result.cy = ((1-ratio) * targetEndPointY)  + (ratio * sourceEndPointY);
      }
      
      return result;
    };   
    var edges = node.connectedEdges();
    var desiredDistance = (node.height() > node.width()? node.height(): node.width())* 0.1;
    for(var i = 1 ; i < edges.length ; i++){
      var edge = edges[i];
      var index = i;
      var edgeClone = edge.clone();
      var startPosition = edge.source().id() == node.id() ? "source" : "target";    
      var newPosition = claculateNewClonePosition(edge.sourceEndpoint().x,edge.sourceEndpoint().y,edge.targetEndpoint().x,edge.targetEndpoint().y,desiredDistance,startPosition); 
      var newNodeId = node.id()+'clone-'+index;
      //edgeClone.data().id = edgeClone.data().id+ "-"+newNodeId;
      if(edge.source().id() == node.id()){        
        edgeClone.data().source = newNodeId;
        edgeClone.data().portsource = newNodeId;    
      }else{
          
        edgeClone.data().target = newNodeId;
        edgeClone.data().porttarget = newNodeId;    
      }
      var newNode = node.clone();
      newNode.data().id = newNodeId;
      cy.add(newNode);
     
      edge.remove();
      cy.add(edgeClone);
      newNode.position({
        x: newPosition.cx,
        y: newPosition.cy
      });
      elementUtilities.setCloneMarkerStatus(newNode, true);
      
    }  
    
    var newPosition = claculateNewClonePosition(
      edges[0].sourceEndpoint().x,
      edges[0].sourceEndpoint().y,
      edges[0].targetEndpoint().x,
      edges[0].targetEndpoint().y,
      desiredDistance,edges[0].source().id() == node.id() ? "source" : "target"
      );
  
    var cloneEdge = edges[0].clone();
    //cloneEdge.data().id = cloneEdge.data().id+ "-"+node.id()+'clone-0';
    
    edges[0].remove();
    cy.add(cloneEdge);
    elementUtilities.setCloneMarkerStatus(node,true);
    node.position({
      x: newPosition.cx,
      y: newPosition.cy
    });
  
    result.oldX = oldX;    
    result.oldY = oldY;
    result.node = node;
    result.numberOfEdges = edges.length;
    return result;

  }

  undoRedoActionFunctions.unCloneHighDegreeNode = function(param){

    var node = param.node;
    elementUtilities.setCloneMarkerStatus(node,false);
    node.position({
      x: param.oldX,
      y: param.oldY
    });
  
    for(var i = 1 ; i < param.numberOfEdges ; i++){
      var cloneId = node.id()+'clone-'+i;
      var clone = cy.$("#"+cloneId);
      var cloneEdge = clone.connectedEdges()[0];
      var edge = cloneEdge.clone();
      
    
      if(edge.data().source == cloneId){        
        edge.data().source = node.id();
        edge.data().portsource =  node.id();    
      }else{          
        edge.data().target =  node.id();
        edge.data().porttarget =  node.id();    
      }

      cloneEdge.remove();
      clone.remove();
      
      cy.add(edge);
    }

    return node;
  }

  undoRedoActionFunctions.changeMapType = function(param){
    var result ={};
    var currentMapType = elementUtilities.getMapType();
    elementUtilities.setMapType(param.mapType);
    result.mapType = currentMapType;
    result.callback = param.callback;
    param.callback();
    return result;
  }

  }

  return undoRedoActionFunctionsExtender;
};

},{"./lib-utilities":4}]},{},[2])(2)
});

//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzZXF1YWwvaW5kZXguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLWV4dGVuZGVyLWZhY3RvcnkuanMiLCJzcmMvdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzLWZhY3RvcnkuanMiLCJzcmMvdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvc2JnbnZpei1pbnN0YW5jZS11dGlsaXRpZXMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvdG9wb2xvZ3ktZ3JvdXBpbmctZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvdXItYWN0aW9uLWZ1bmN0aW9ucy1leHRlbmRlci1mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeHpEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbHVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIExvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IEpTIEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcy5mb3VuZGF0aW9uLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZpbHRlcmAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheUZpbHRlcihhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBcHBlbmRzIHRoZSBlbGVtZW50cyBvZiBgdmFsdWVzYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gYXBwZW5kLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5UHVzaChhcnJheSwgdmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIG9mZnNldCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W29mZnNldCArIGluZGV4XSA9IHZhbHVlc1tpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5zb21lYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTb21lKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgYGNhY2hlYCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgVGhlIGNhY2hlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGNhY2hlSGFzKGNhY2hlLCBrZXkpIHtcbiAgcmV0dXJuIGNhY2hlLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgbWFwYCB0byBpdHMga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUga2V5LXZhbHVlIHBhaXJzLlxuICovXG5mdW5jdGlvbiBtYXBUb0FycmF5KG1hcCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG1hcC5zaXplKTtcblxuICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW2tleSwgdmFsdWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLFxuICAgIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBTeW1ib2wgPSByb290LlN5bWJvbCxcbiAgICBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5LFxuICAgIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGUsXG4gICAgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2UsXG4gICAgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcbiAgICBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpLFxuICAgIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyksXG4gICAgUHJvbWlzZSA9IGdldE5hdGl2ZShyb290LCAnUHJvbWlzZScpLFxuICAgIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0JyksXG4gICAgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpLFxuICAgIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy4gKi9cbnZhciBkYXRhVmlld0N0b3JTdHJpbmcgPSB0b1NvdXJjZShEYXRhVmlldyksXG4gICAgbWFwQ3RvclN0cmluZyA9IHRvU291cmNlKE1hcCksXG4gICAgcHJvbWlzZUN0b3JTdHJpbmcgPSB0b1NvdXJjZShQcm9taXNlKSxcbiAgICBzZXRDdG9yU3RyaW5nID0gdG9Tb3VyY2UoU2V0KSxcbiAgICB3ZWFrTWFwQ3RvclN0cmluZyA9IHRvU291cmNlKFdlYWtNYXApO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuc2l6ZSA9IDA7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxuLyoqXG4gKlxuICogQ3JlYXRlcyBhbiBhcnJheSBjYWNoZSBvYmplY3QgdG8gc3RvcmUgdW5pcXVlIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTZXRDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPT0gbnVsbCA/IDAgOiB2YWx1ZXMubGVuZ3RoO1xuXG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGU7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdGhpcy5hZGQodmFsdWVzW2luZGV4XSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGRzIGB2YWx1ZWAgdG8gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBhZGRcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQGFsaWFzIHB1c2hcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNhY2hlLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlQWRkKHZhbHVlKSB7XG4gIHRoaXMuX19kYXRhX18uc2V0KHZhbHVlLCBIQVNIX1VOREVGSU5FRCk7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGluIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlSGFzKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyh2YWx1ZSk7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTZXRDYWNoZWAuXG5TZXRDYWNoZS5wcm90b3R5cGUuYWRkID0gU2V0Q2FjaGUucHJvdG90eXBlLnB1c2ggPSBzZXRDYWNoZUFkZDtcblNldENhY2hlLnByb3RvdHlwZS5oYXMgPSBzZXRDYWNoZUhhcztcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFN0YWNrYC5cblN0YWNrLnByb3RvdHlwZS5jbGVhciA9IHN0YWNrQ2xlYXI7XG5TdGFjay5wcm90b3R5cGVbJ2RlbGV0ZSddID0gc3RhY2tEZWxldGU7XG5TdGFjay5wcm90b3R5cGUuZ2V0ID0gc3RhY2tHZXQ7XG5TdGFjay5wcm90b3R5cGUuaGFzID0gc3RhY2tIYXM7XG5TdGFjay5wcm90b3R5cGUuc2V0ID0gc3RhY2tTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNFcXVhbGAgd2hpY2ggc3VwcG9ydHMgcGFydGlhbCBjb21wYXJpc29uc1xuICogYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuXG4gKiAgMSAtIFVub3JkZXJlZCBjb21wYXJpc29uXG4gKiAgMiAtIFBhcnRpYWwgY29tcGFyaXNvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKHZhbHVlID09PSBvdGhlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IG90aGVyID09IG51bGwgfHwgKCFpc09iamVjdExpa2UodmFsdWUpICYmICFpc09iamVjdExpa2Uob3RoZXIpKSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyO1xuICB9XG4gIHJldHVybiBiYXNlSXNFcXVhbERlZXAodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBiYXNlSXNFcXVhbCwgc3RhY2spO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgY29tcGFyZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsRGVlcChvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBvYmpJc0FyciA9IGlzQXJyYXkob2JqZWN0KSxcbiAgICAgIG90aElzQXJyID0gaXNBcnJheShvdGhlciksXG4gICAgICBvYmpUYWcgPSBvYmpJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG9iamVjdCksXG4gICAgICBvdGhUYWcgPSBvdGhJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG90aGVyKTtcblxuICBvYmpUYWcgPSBvYmpUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG9ialRhZztcbiAgb3RoVGFnID0gb3RoVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvdGhUYWc7XG5cbiAgdmFyIG9iaklzT2JqID0gb2JqVGFnID09IG9iamVjdFRhZyxcbiAgICAgIG90aElzT2JqID0gb3RoVGFnID09IG9iamVjdFRhZyxcbiAgICAgIGlzU2FtZVRhZyA9IG9ialRhZyA9PSBvdGhUYWc7XG5cbiAgaWYgKGlzU2FtZVRhZyAmJiBpc0J1ZmZlcihvYmplY3QpKSB7XG4gICAgaWYgKCFpc0J1ZmZlcihvdGhlcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgb2JqSXNBcnIgPSB0cnVlO1xuICAgIG9iaklzT2JqID0gZmFsc2U7XG4gIH1cbiAgaWYgKGlzU2FtZVRhZyAmJiAhb2JqSXNPYmopIHtcbiAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgIHJldHVybiAob2JqSXNBcnIgfHwgaXNUeXBlZEFycmF5KG9iamVjdCkpXG4gICAgICA/IGVxdWFsQXJyYXlzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spXG4gICAgICA6IGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgfVxuICBpZiAoIShiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcpKSB7XG4gICAgdmFyIG9iaklzV3JhcHBlZCA9IG9iaklzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgb3RoSXNXcmFwcGVkID0gb3RoSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICBpZiAob2JqSXNXcmFwcGVkIHx8IG90aElzV3JhcHBlZCkge1xuICAgICAgdmFyIG9ialVud3JhcHBlZCA9IG9iaklzV3JhcHBlZCA/IG9iamVjdC52YWx1ZSgpIDogb2JqZWN0LFxuICAgICAgICAgIG90aFVud3JhcHBlZCA9IG90aElzV3JhcHBlZCA/IG90aGVyLnZhbHVlKCkgOiBvdGhlcjtcblxuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIHJldHVybiBlcXVhbEZ1bmMob2JqVW53cmFwcGVkLCBvdGhVbndyYXBwZWQsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFpc1NhbWVUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgcmV0dXJuIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBhcnJheXMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7QXJyYXl9IG90aGVyIFRoZSBvdGhlciBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgYXJyYXlgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFycmF5cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEFycmF5cyhhcnJheSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIGFyckxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIG90aExlbmd0aCA9IG90aGVyLmxlbmd0aDtcblxuICBpZiAoYXJyTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhKGlzUGFydGlhbCAmJiBvdGhMZW5ndGggPiBhcnJMZW5ndGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQoYXJyYXkpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSB0cnVlLFxuICAgICAgc2VlbiA9IChiaXRtYXNrICYgQ09NUEFSRV9VTk9SREVSRURfRkxBRykgPyBuZXcgU2V0Q2FjaGUgOiB1bmRlZmluZWQ7XG5cbiAgc3RhY2suc2V0KGFycmF5LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgYXJyYXkpO1xuXG4gIC8vIElnbm9yZSBub24taW5kZXggcHJvcGVydGllcy5cbiAgd2hpbGUgKCsraW5kZXggPCBhcnJMZW5ndGgpIHtcbiAgICB2YXIgYXJyVmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJbaW5kZXhdO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIGFyclZhbHVlLCBpbmRleCwgb3RoZXIsIGFycmF5LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKGFyclZhbHVlLCBvdGhWYWx1ZSwgaW5kZXgsIGFycmF5LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICBpZiAoY29tcGFyZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGNvbXBhcmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoc2Vlbikge1xuICAgICAgaWYgKCFhcnJheVNvbWUob3RoZXIsIGZ1bmN0aW9uKG90aFZhbHVlLCBvdGhJbmRleCkge1xuICAgICAgICAgICAgaWYgKCFjYWNoZUhhcyhzZWVuLCBvdGhJbmRleCkgJiZcbiAgICAgICAgICAgICAgICAoYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlZW4ucHVzaChvdGhJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIShcbiAgICAgICAgICBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHxcbiAgICAgICAgICAgIGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKVxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10oYXJyYXkpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgY29tcGFyaW5nIG9iamVjdHMgb2ZcbiAqIHRoZSBzYW1lIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjb21wYXJpbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdHMgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIHRhZywgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgZGF0YVZpZXdUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgKG9iamVjdC5ieXRlT2Zmc2V0ICE9IG90aGVyLmJ5dGVPZmZzZXQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG9iamVjdCA9IG9iamVjdC5idWZmZXI7XG4gICAgICBvdGhlciA9IG90aGVyLmJ1ZmZlcjtcblxuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgIWVxdWFsRnVuYyhuZXcgVWludDhBcnJheShvYmplY3QpLCBuZXcgVWludDhBcnJheShvdGhlcikpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICAgIC8vIENvZXJjZSBib29sZWFucyB0byBgMWAgb3IgYDBgIGFuZCBkYXRlcyB0byBtaWxsaXNlY29uZHMuXG4gICAgICAvLyBJbnZhbGlkIGRhdGVzIGFyZSBjb2VyY2VkIHRvIGBOYU5gLlxuICAgICAgcmV0dXJuIGVxKCtvYmplY3QsICtvdGhlcik7XG5cbiAgICBjYXNlIGVycm9yVGFnOlxuICAgICAgcmV0dXJuIG9iamVjdC5uYW1lID09IG90aGVyLm5hbWUgJiYgb2JqZWN0Lm1lc3NhZ2UgPT0gb3RoZXIubWVzc2FnZTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgLy8gQ29lcmNlIHJlZ2V4ZXMgdG8gc3RyaW5ncyBhbmQgdHJlYXQgc3RyaW5ncywgcHJpbWl0aXZlcyBhbmQgb2JqZWN0cyxcbiAgICAgIC8vIGFzIGVxdWFsLiBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXJlZ2V4cC5wcm90b3R5cGUudG9zdHJpbmdcbiAgICAgIC8vIGZvciBtb3JlIGRldGFpbHMuXG4gICAgICByZXR1cm4gb2JqZWN0ID09IChvdGhlciArICcnKTtcblxuICAgIGNhc2UgbWFwVGFnOlxuICAgICAgdmFyIGNvbnZlcnQgPSBtYXBUb0FycmF5O1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHO1xuICAgICAgY29udmVydCB8fCAoY29udmVydCA9IHNldFRvQXJyYXkpO1xuXG4gICAgICBpZiAob2JqZWN0LnNpemUgIT0gb3RoZXIuc2l6ZSAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgICAgIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gICAgICBpZiAoc3RhY2tlZCkge1xuICAgICAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgICAgIH1cbiAgICAgIGJpdG1hc2sgfD0gQ09NUEFSRV9VTk9SREVSRURfRkxBRztcblxuICAgICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gICAgICB2YXIgcmVzdWx0ID0gZXF1YWxBcnJheXMoY29udmVydChvYmplY3QpLCBjb252ZXJ0KG90aGVyKSwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG4gICAgICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIGlmIChzeW1ib2xWYWx1ZU9mKSB7XG4gICAgICAgIHJldHVybiBzeW1ib2xWYWx1ZU9mLmNhbGwob2JqZWN0KSA9PSBzeW1ib2xWYWx1ZU9mLmNhbGwob3RoZXIpO1xuICAgICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIG9iamVjdHMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIG9ialByb3BzID0gZ2V0QWxsS2V5cyhvYmplY3QpLFxuICAgICAgb2JqTGVuZ3RoID0gb2JqUHJvcHMubGVuZ3RoLFxuICAgICAgb3RoUHJvcHMgPSBnZXRBbGxLZXlzKG90aGVyKSxcbiAgICAgIG90aExlbmd0aCA9IG90aFByb3BzLmxlbmd0aDtcblxuICBpZiAob2JqTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBpbmRleCA9IG9iakxlbmd0aDtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIGlmICghKGlzUGFydGlhbCA/IGtleSBpbiBvdGhlciA6IGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsIGtleSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciByZXN1bHQgPSB0cnVlO1xuICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgb2JqZWN0KTtcblxuICB2YXIgc2tpcEN0b3IgPSBpc1BhcnRpYWw7XG4gIHdoaWxlICgrK2luZGV4IDwgb2JqTGVuZ3RoKSB7XG4gICAga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2tleV07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgb2JqVmFsdWUsIGtleSwgb3RoZXIsIG9iamVjdCwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihvYmpWYWx1ZSwgb3RoVmFsdWUsIGtleSwgb2JqZWN0LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoIShjb21wYXJlZCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyAob2JqVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhvYmpWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSlcbiAgICAgICAgICA6IGNvbXBhcmVkXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHNraXBDdG9yIHx8IChza2lwQ3RvciA9IGtleSA9PSAnY29uc3RydWN0b3InKTtcbiAgfVxuICBpZiAocmVzdWx0ICYmICFza2lwQ3Rvcikge1xuICAgIHZhciBvYmpDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgICBvdGhDdG9yID0gb3RoZXIuY29uc3RydWN0b3I7XG5cbiAgICAvLyBOb24gYE9iamVjdGAgb2JqZWN0IGluc3RhbmNlcyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVhbC5cbiAgICBpZiAob2JqQ3RvciAhPSBvdGhDdG9yICYmXG4gICAgICAgICgnY29uc3RydWN0b3InIGluIG9iamVjdCAmJiAnY29uc3RydWN0b3InIGluIG90aGVyKSAmJlxuICAgICAgICAhKHR5cGVvZiBvYmpDdG9yID09ICdmdW5jdGlvbicgJiYgb2JqQ3RvciBpbnN0YW5jZW9mIG9iakN0b3IgJiZcbiAgICAgICAgICB0eXBlb2Ygb3RoQ3RvciA9PSAnZnVuY3Rpb24nICYmIG90aEN0b3IgaW5zdGFuY2VvZiBvdGhDdG9yKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXMob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXMsIGdldFN5bWJvbHMpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5RmlsdGVyKG5hdGl2ZUdldFN5bWJvbHMob2JqZWN0KSwgZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBzeW1ib2wpO1xuICB9KTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGRlZXAgY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlXG4gKiBlcXVpdmFsZW50LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBzdXBwb3J0cyBjb21wYXJpbmcgYXJyYXlzLCBhcnJheSBidWZmZXJzLCBib29sZWFucyxcbiAqIGRhdGUgb2JqZWN0cywgZXJyb3Igb2JqZWN0cywgbWFwcywgbnVtYmVycywgYE9iamVjdGAgb2JqZWN0cywgcmVnZXhlcyxcbiAqIHNldHMsIHN0cmluZ3MsIHN5bWJvbHMsIGFuZCB0eXBlZCBhcnJheXMuIGBPYmplY3RgIG9iamVjdHMgYXJlIGNvbXBhcmVkXG4gKiBieSB0aGVpciBvd24sIG5vdCBpbmhlcml0ZWQsIGVudW1lcmFibGUgcHJvcGVydGllcy4gRnVuY3Rpb25zIGFuZCBET01cbiAqIG5vZGVzIGFyZSBjb21wYXJlZCBieSBzdHJpY3QgZXF1YWxpdHksIGkuZS4gYD09PWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uaXNFcXVhbChvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBvYmplY3QgPT09IG90aGVyO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFcXVhbCh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYSBuZXcgZW1wdHkgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBlbXB0eSBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5cyA9IF8udGltZXMoMiwgXy5zdHViQXJyYXkpO1xuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5cyk7XG4gKiAvLyA9PiBbW10sIFtdXVxuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5c1swXSA9PT0gYXJyYXlzWzFdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN0dWJBcnJheSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFcXVhbDtcbiIsIihmdW5jdGlvbigpe1xuICB2YXIgY2hpc2UgPSBmdW5jdGlvbihfb3B0aW9ucykge1xuXG4gICAgdmFyIHBhcmFtID0ge307XG5cbiAgICAvLyBBY2Nlc3MgdGhlIGxpYnNcbiAgICB2YXIgbGlicyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG5cbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy1mYWN0b3J5JykoKTtcbiAgICB2YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zKF9vcHRpb25zKTsgLy8gRXh0ZW5kcyB0aGUgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcblxuICAgIC8vIENyZWF0ZSBhbiBzYmdudml6IGluc3RhbmNlXG4gICAgdmFyIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3NiZ252aXotaW5zdGFuY2UtdXRpbGl0aWVzLWZhY3RvcnknKSgpO1xuICAgIHZhciBzYmdudml6SW5zdGFuY2UgPSBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXMob3B0aW9ucyk7XG5cbiAgICAvLyBSZWdpc3RlciB1bmRvL3JlZG8gYWN0aW9uc1xuICAgIHZhciByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3JlZ2lzdGVyLXVuZG8tcmVkby1hY3Rpb25zLWZhY3RvcnknKSgpO1xuXG4gICAgdmFyIG1haW5VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy1mYWN0b3J5JykoKTtcbiAgICB2YXIgZWxlbWVudFV0aWxpdGllc0V4dGVuZGVyID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMtZXh0ZW5kZXItZmFjdG9yeScpKCk7XG4gICAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zRXh0ZW5kZXIgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91ci1hY3Rpb24tZnVuY3Rpb25zLWV4dGVuZGVyLWZhY3RvcnknKSgpO1xuICAgIHZhciBzaWZUb3BvbG9neUdyb3VwaW5nID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdG9wb2xvZ3ktZ3JvdXBpbmctZmFjdG9yeScpKCk7XG5cbiAgICB2YXIgZWxlbWVudFV0aWxpdGllcyA9ICBzYmdudml6SW5zdGFuY2UuZWxlbWVudFV0aWxpdGllcztcbiAgICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSBzYmdudml6SW5zdGFuY2UudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG5cbiAgICBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMgPSBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXM7XG4gICAgcGFyYW0ub3B0aW9uVXRpbGl0aWVzID0gb3B0aW9uVXRpbGl0aWVzO1xuICAgIHBhcmFtLmVsZW1lbnRVdGlsaXRpZXMgPSBlbGVtZW50VXRpbGl0aWVzO1xuICAgIHBhcmFtLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG4gICAgcGFyYW0uc2lmVG9wb2xvZ3lHcm91cGluZyA9IHNpZlRvcG9sb2d5R3JvdXBpbmc7XG5cbiAgICB2YXIgc2hvdWxkQXBwbHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwYXJhbS5lbGVtZW50VXRpbGl0aWVzLm1hcFR5cGUgPT09ICdTSUYnO1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc0V4dGVuZGVyKHBhcmFtKTtcbiAgICBlbGVtZW50VXRpbGl0aWVzRXh0ZW5kZXIocGFyYW0pO1xuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKHBhcmFtKTtcbiAgICBtYWluVXRpbGl0aWVzKHBhcmFtKTtcbiAgICBzaWZUb3BvbG9neUdyb3VwaW5nKHBhcmFtLCB7bWV0YUVkZ2VJZGVudGlmaWVyOiAnc2lmLW1ldGEnLCBsb2NrR3JhcGhUb3BvbG9neTogdHJ1ZSwgc2hvdWxkQXBwbHl9KTtcblxuICAgIC8vIEV4cG9zZSB0aGUgYXBpXG4gICAgdmFyIGFwaSA9IHt9O1xuXG4gICAgLy8gRXhwb3NlIHRoZSBwcm9wZXJ0aWVzIGluaGVyaXRlZCBmcm9tIHNiZ252aXpcbiAgICAvLyB0aGVuIG92ZXJyaWRlIHNvbWUgb2YgdGhlc2UgcHJvcGVydGllcyBhbmQgZXhwb3NlIHNvbWUgbmV3IHByb3BlcnRpZXNcbiAgICBmb3IgKHZhciBwcm9wIGluIHNiZ252aXpJbnN0YW5jZSkge1xuICAgICAgYXBpW3Byb3BdID0gc2JnbnZpekluc3RhbmNlW3Byb3BdO1xuICAgIH1cblxuICAgIC8vIEV4cG9zZSBlYWNoIG1haW4gdXRpbGl0eSBzZXBlcmF0ZWx5XG4gICAgZm9yICh2YXIgcHJvcCBpbiBtYWluVXRpbGl0aWVzKSB7XG4gICAgICBhcGlbcHJvcF0gPSBtYWluVXRpbGl0aWVzW3Byb3BdO1xuICAgIH1cblxuICAgIC8vIEV4cG9zZSBnZXRTYmdudml6SW5zdGFuY2UoKVxuICAgIGFwaS5nZXRTYmdudml6SW5zdGFuY2UgPSBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0SW5zdGFuY2U7XG5cbiAgICAvLyBFeHBvc2UgZWxlbWVudFV0aWxpdGllcyBhbmQgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgYXMgaXNcbiAgICBhcGkuZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4gICAgYXBpLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG4gICAgYXBpLnNpZlRvcG9sb2d5R3JvdXBpbmcgPSBzaWZUb3BvbG9neUdyb3VwaW5nO1xuXG4gICAgcmV0dXJuIGFwaTtcbiAgfTtcblxuICAvLyBSZWdpc3RlciBjaGlzZSB3aXRoIGdpdmVuIGxpYnJhcmllc1xuICBjaGlzZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChfbGlicykge1xuXG4gICAgdmFyIGxpYnMgPSB7fTtcbiAgICBsaWJzLmpRdWVyeSA9IF9saWJzLmpRdWVyeSB8fCBqUXVlcnk7XG4gICAgbGlicy5jeXRvc2NhcGUgPSBfbGlicy5jeXRvc2NhcGUgfHwgY3l0b3NjYXBlO1xuICAgIGxpYnMuc2JnbnZpeiA9IF9saWJzLnNiZ252aXogfHwgc2JnbnZpejtcbiAgICBsaWJzLnNhdmVBcyA9IF9saWJzLmZpbGVzYXZlciA/IF9saWJzLmZpbGVzYXZlci5zYXZlQXMgOiBzYXZlQXM7XG5cbiAgICBsaWJzLnNiZ252aXoucmVnaXN0ZXIoX2xpYnMpOyAvLyBSZWdpc3RlciBzYmdudml6IHdpdGggdGhlIGdpdmVuIGxpYnNcblxuICAgIC8vIGluaGVyaXQgZXhwb3NlZCBzdGF0aWMgcHJvcGVydGllcyBvZiBzYmdudml6IG90aGVyIHRoYW4gcmVnaXN0ZXJcbiAgICBmb3IgKHZhciBwcm9wIGluIGxpYnMuc2JnbnZpeikge1xuICAgICAgaWYgKHByb3AgIT09ICdyZWdpc3RlcicpIHtcbiAgICAgICAgY2hpc2VbcHJvcF0gPSBsaWJzLnNiZ252aXpbcHJvcF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBsaWJyYXJpZXMgdG8gYWNjZXNzIHRoZW0gZnJvbSBhbnkgZmlsZVxuICAgIHZhciBsaWJVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9saWItdXRpbGl0aWVzJyk7XG4gICAgbGliVXRpbGl0aWVzLnNldExpYnMobGlicyk7XG4gIH07XG5cbiAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGNoaXNlO1xuICB9XG59KSgpO1xuIiwiLy8gRXh0ZW5kcyBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXNcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvcHRpb25zLCBzYmdudml6SW5zdGFuY2UsIGVsZW1lbnRVdGlsaXRpZXMsIGN5O1xuXG4gIGZ1bmN0aW9uIGVsZW1lbnRVdGlsaXRpZXNFeHRlbmRlciAocGFyYW0pIHtcbiAgICBzYmdudml6SW5zdGFuY2UgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0SW5zdGFuY2UoKTtcbiAgICBvcHRpb25zID0gcGFyYW0ub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbiAgICBlbGVtZW50VXRpbGl0aWVzID0gc2JnbnZpekluc3RhbmNlLmVsZW1lbnRVdGlsaXRpZXM7XG4gICAgY3kgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0Q3koKTtcblxuICAgIGV4dGVuZCgpO1xuXG4gICAgLy8gUmV0dXJuIHRoZSBleHRlbmRlZCBlbGVtZW50VXRpbGl0aWVzXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXM7XG4gIH1cblxuICAvLyBFeHRlbmRzIGVsZW1lbnRVdGlsaXRpZXMgd2l0aCBjaGlzZSBzcGVjaWZpYyBmYWNpbGl0aWVzXG4gIGZ1bmN0aW9uIGV4dGVuZCAoKSB7XG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUgPSBmdW5jdGlvbiAoeCwgeSwgbm9kZVBhcmFtcywgaWQsIHBhcmVudCwgdmlzaWJpbGl0eSkge1xuICAgICAgaWYgKHR5cGVvZiBub2RlUGFyYW1zICE9ICdvYmplY3QnKXtcbiAgICAgICAgdmFyIHNiZ25jbGFzcyA9IG5vZGVQYXJhbXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzYmduY2xhc3MgPSBub2RlUGFyYW1zLmNsYXNzO1xuICAgICAgICAgIHZhciBsYW5ndWFnZSA9IG5vZGVQYXJhbXMubGFuZ3VhZ2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBjc3MgPSB7fTtcbiAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIHNwZWNpZmljIGRlZmF1bHQgd2lkdGggb3IgaGVpZ2h0IGZvclxuICAgICAgLy8gc2JnbmNsYXNzIHRoZXNlIHNpemVzIGFyZSB1c2VkXG4gICAgICB2YXIgZGVmYXVsdFdpZHRoID0gNTA7XG4gICAgICB2YXIgZGVmYXVsdEhlaWdodCA9IDUwO1xuXG4gICAgICBpZiAodmlzaWJpbGl0eSkge1xuICAgICAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICBjbGFzczogc2JnbmNsYXNzLFxuICAgIFx0ICBsYW5ndWFnZTogbGFuZ3VhZ2UsXG4gICAgICAgIGJib3g6IHtcbiAgICAgICAgICB3OiBkZWZhdWx0V2lkdGgsXG4gICAgICAgICAgaDogZGVmYXVsdEhlaWdodCxcbiAgICAgICAgICB4OiB4LFxuICAgICAgICAgIHk6IHlcbiAgICAgICAgfSxcbiAgICAgICAgc3RhdGVzYW5kaW5mb3M6IFtdLFxuICAgICAgICBwb3J0czogW11cbiAgICAgIH07XG5cbiAgICAgIGlmKGlkKSB7XG4gICAgICAgIGRhdGEuaWQgPSBpZDtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkYXRhLmlkID0gZWxlbWVudFV0aWxpdGllcy5nZW5lcmF0ZU5vZGVJZCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGRhdGEucGFyZW50ID0gcGFyZW50O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmV4dGVuZE5vZGVEYXRhV2l0aENsYXNzRGVmYXVsdHMoIGRhdGEsIHNiZ25jbGFzcyApO1xuXG4gICAgICAvLyBzb21lIGRlZmF1bHRzIGFyZSBub3Qgc2V0IGJ5IGV4dGVuZE5vZGVEYXRhV2l0aENsYXNzRGVmYXVsdHMoKVxuICAgICAgdmFyIGRlZmF1bHRzID0gdGhpcy5nZXREZWZhdWx0UHJvcGVydGllcyggc2JnbmNsYXNzICk7XG5cbiAgICAgIGlmICggZGVmYXVsdHNbICdtdWx0aW1lcicgXSApIHtcbiAgICAgICAgZGF0YS5jbGFzcyArPSAnIG11bHRpbWVyJztcbiAgICAgIH1cblxuICAgICAgaWYgKCBkZWZhdWx0c1sgJ2Nsb25lbWFya2VyJyBdICkge1xuICAgICAgICBkYXRhWyAnY2xvbmVtYXJrZXInIF0gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBkYXRhLmJib3hbICd3JyBdID0gZGVmYXVsdHNbICd3aWR0aCcgXTtcbiAgICAgIGRhdGEuYmJveFsgJ2gnIF0gPSBkZWZhdWx0c1sgJ2hlaWdodCcgXTtcblxuICAgICAgdmFyIGVsZXMgPSBjeS5hZGQoe1xuICAgICAgICBncm91cDogXCJub2Rlc1wiLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBjc3M6IGNzcyxcbiAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICB4OiB4LFxuICAgICAgICAgIHk6IHlcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBuZXdOb2RlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xuICAgICAgLy8gR2V0IHRoZSBkZWZhdWx0IHBvcnRzIG9yZGVyaW5nIGZvciB0aGUgbm9kZXMgd2l0aCBnaXZlbiBzYmduY2xhc3NcbiAgICAgIHZhciBvcmRlcmluZyA9IGRlZmF1bHRzWydwb3J0cy1vcmRlcmluZyddO1xuXG4gICAgICAvLyBJZiB0aGVyZSBpcyBhIGRlZmF1bHQgcG9ydHMgb3JkZXJpbmcgZm9yIHRoZSBub2RlcyB3aXRoIGdpdmVuIHNiZ25jbGFzcyBhbmQgaXQgaXMgZGlmZmVyZW50IHRoYW4gJ25vbmUnIHNldCB0aGUgcG9ydHMgb3JkZXJpbmcgdG8gdGhhdCBvcmRlcmluZ1xuICAgICAgaWYgKG9yZGVyaW5nICYmIG9yZGVyaW5nICE9PSAnbm9uZScpIHtcbiAgICAgICAgdGhpcy5zZXRQb3J0c09yZGVyaW5nKG5ld05vZGUsIG9yZGVyaW5nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxhbmd1YWdlID09IFwiQUZcIiAmJiAhZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlTXVsdGlwbGVVbml0T2ZJbmZvcm1hdGlvbihuZXdOb2RlKSl7XG4gICAgICAgIGlmIChzYmduY2xhc3MgIT0gXCJCQSBwbGFpblwiKSB7IC8vIGlmIEFGIG5vZGUgY2FuIGhhdmUgbGFiZWwgaS5lOiBub3QgcGxhaW4gYmlvbG9naWNhbCBhY3Rpdml0eVxuICAgICAgICAgIHZhciB1b2lfb2JqID0ge1xuICAgICAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICB1b2lfb2JqLmxhYmVsID0ge1xuICAgICAgICAgICAgdGV4dDogXCJcIlxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB1b2lfb2JqLmJib3ggPSB7XG4gICAgICAgICAgICAgdzogMTIsXG4gICAgICAgICAgICAgaDogMTJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobmV3Tm9kZSwgdW9pX29iaik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbm9kZSBiZyBpbWFnZSB3YXMgdW5leHBlY3RlZGx5IG5vdCByZW5kZXJlZCB1bnRpbCBpdCBpcyBjbGlja2VkXG4gICAgICAvLyB1c2UgdGhpcyBkaXJ0eSBoYWNrIHVudGlsIGZpbmRpbmcgYSBzb2x1dGlvbiB0byB0aGUgcHJvYmxlbVxuICAgICAgdmFyIGJnSW1hZ2UgPSBuZXdOb2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKTtcbiAgICAgIGlmICggYmdJbWFnZSApIHtcbiAgICAgICAgbmV3Tm9kZS5kYXRhKCAnYmFja2dyb3VuZC1pbWFnZScsIGJnSW1hZ2UgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ld05vZGU7XG4gICAgfTtcblxuICAgIC8vU2F2ZXMgb2xkIGF1eCB1bml0cyBvZiBnaXZlbiBub2RlXG4gICAgZWxlbWVudFV0aWxpdGllcy5zYXZlVW5pdHMgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICB2YXIgdGVtcERhdGEgPSBbXTtcbiAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykuZm9yRWFjaCggZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgIHRlbXBEYXRhLnB1c2goe1xuICAgICAgICAgIHg6IGVsZS5iYm94LngsXG4gICAgICAgICAgeTogZWxlLmJib3gueSxcbiAgICAgICAgICBhbmNob3JTaWRlOiBlbGUuYW5jaG9yU2lkZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGluZGV4Kys7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0ZW1wRGF0YTtcbiAgICB9O1xuXG4gICAgLy9SZXN0b3JlcyBmcm9tIGdpdmVuIGRhdGFcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVVbml0cyA9IGZ1bmN0aW9uKG5vZGUsIGRhdGEpIHtcbiAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykuZm9yRWFjaCggZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBlbGUuYmJveC54ID0gZGF0YVtpbmRleF0ueDtcbiAgICAgICAgICBlbGUuYmJveC55ID0gZGF0YVtpbmRleF0ueVxuICAgICAgICAgIHZhciBhbmNob3JTaWRlID0gZWxlLmFuY2hvclNpZGU7XG4gICAgICAgICAgZWxlLmFuY2hvclNpZGUgPSBkYXRhW2luZGV4XS5hbmNob3JTaWRlO1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW9kaWZ5VW5pdHMobm9kZSwgZWxlLCBhbmNob3JTaWRlKTtcbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy9Nb2RpZnkgYXV4IHVuaXQgbGF5b3V0c1xuICAgIGVsZW1lbnRVdGlsaXRpZXMubW9kaWZ5VW5pdHMgPSBmdW5jdGlvbiAobm9kZSwgZWxlLCBhbmNob3JTaWRlKSB7XG4gICAgICBpbnN0YW5jZS5jbGFzc2VzLkF1eFVuaXRMYXlvdXQubW9kaWZ5VW5pdHMobm9kZSwgZWxlLCBhbmNob3JTaWRlLCBjeSk7XG4gICAgfTtcblxuXG4gICAgLy9Gb3IgcmV2ZXJzaWJsZSByZWFjdGlvbnMgYm90aCBzaWRlIG9mIHRoZSBwcm9jZXNzIGNhbiBiZSBpbnB1dC9vdXRwdXRcbiAgICAvL0dyb3VwIElEIGlkZW50aWZpZXMgdG8gd2hpY2ggZ3JvdXAgb2Ygbm9kZXMgdGhlIGVkZ2UgaXMgZ29pbmcgdG8gYmUgY29ubmVjdGVkIGZvciByZXZlcnNpYmxlIHJlYWN0aW9ucygwOiBncm91cCAxIElEIGFuZCAxOmdyb3VwIDIgSUQpXG4gICAgZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlID0gZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0LCBlZGdlUGFyYW1zLCBpZCwgdmlzaWJpbGl0eSwgZ3JvdXBJRCApIHtcbiAgICAgIGlmICh0eXBlb2YgZWRnZVBhcmFtcyAhPSAnb2JqZWN0Jyl7XG4gICAgICAgIHZhciBzYmduY2xhc3MgPSBlZGdlUGFyYW1zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2JnbmNsYXNzID0gZWRnZVBhcmFtcy5jbGFzcztcbiAgICAgICAgICB2YXIgbGFuZ3VhZ2UgPSBlZGdlUGFyYW1zLmxhbmd1YWdlO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3NzID0ge307XG5cbiAgICAgIGlmICh2aXNpYmlsaXR5KSB7XG4gICAgICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgY2xhc3M6IHNiZ25jbGFzcyxcbiAgICAgICAgICBsYW5ndWFnZTogbGFuZ3VhZ2UsXG4gICAgICB9O1xuXG4gICAgICB2YXIgZGVmYXVsdHMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBzYmduY2xhc3MgKTtcblxuICAgICAgLy8gZXh0ZW5kIHRoZSBkYXRhIHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzIG9mIGVkZ2Ugc3R5bGVcbiAgICAgIE9iamVjdC5rZXlzKCBkZWZhdWx0cyApLmZvckVhY2goIGZ1bmN0aW9uKCBwcm9wICkge1xuICAgICAgICBkYXRhWyBwcm9wIF0gPSBkZWZhdWx0c1sgcHJvcCBdO1xuICAgICAgfSApO1xuXG4gICAgICBpZihpZCkge1xuICAgICAgICBkYXRhLmlkID0gaWQ7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZGF0YS5pZCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2VuZXJhdGVFZGdlSWQoKTtcbiAgICAgIH1cblxuICAgICAgaWYoZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkNhcmRpbmFsaXR5KHNiZ25jbGFzcykpe1xuICAgICAgICBkYXRhLmNhcmRpbmFsaXR5ID0gMDtcbiAgICAgIH1cblxuICAgICAgdmFyIHNvdXJjZU5vZGUgPSBjeS5nZXRFbGVtZW50QnlJZChzb3VyY2UpOyAvLyBUaGUgb3JpZ2luYWwgc291cmNlIG5vZGVcbiAgICAgIHZhciB0YXJnZXROb2RlID0gY3kuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KTsgLy8gVGhlIG9yaWdpbmFsIHRhcmdldCBub2RlXG4gICAgICB2YXIgc291cmNlSGFzUG9ydHMgPSBzb3VyY2VOb2RlLmRhdGEoJ3BvcnRzJykubGVuZ3RoID09PSAyO1xuICAgICAgdmFyIHRhcmdldEhhc1BvcnRzID0gdGFyZ2V0Tm9kZS5kYXRhKCdwb3J0cycpLmxlbmd0aCA9PT0gMjtcbiAgICAgIC8vIFRoZSBwb3J0c291cmNlIGFuZCBwb3J0dGFyZ2V0IHZhcmlhYmxlc1xuICAgICAgdmFyIHBvcnRzb3VyY2U7XG4gICAgICB2YXIgcG9ydHRhcmdldDtcblxuICAgICAgLypcbiAgICAgICAqIEdldCBpbnB1dC9vdXRwdXQgcG9ydCBpZCdzIG9mIGEgbm9kZSB3aXRoIHRoZSBhc3N1bXB0aW9uIHRoYXQgdGhlIG5vZGUgaGFzIHZhbGlkIHBvcnRzLlxuICAgICAgICovXG4gICAgICB2YXIgZ2V0SU9Qb3J0SWRzID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIG5vZGVJbnB1dFBvcnRJZCwgbm9kZU91dHB1dFBvcnRJZDtcbiAgICAgICAgdmFyIG5vZGVQb3J0c09yZGVyaW5nID0gc2JnbnZpekluc3RhbmNlLmVsZW1lbnRVdGlsaXRpZXMuZ2V0UG9ydHNPcmRlcmluZyhub2RlKTtcbiAgICAgICAgdmFyIG5vZGVQb3J0cyA9IG5vZGUuZGF0YSgncG9ydHMnKTtcbiAgICAgICAgaWYgKCBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0wtdG8tUicgfHwgbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdSLXRvLUwnICkge1xuICAgICAgICAgIHZhciBsZWZ0UG9ydElkID0gbm9kZVBvcnRzWzBdLnggPCAwID8gbm9kZVBvcnRzWzBdLmlkIDogbm9kZVBvcnRzWzFdLmlkOyAvLyBUaGUgeCB2YWx1ZSBvZiBsZWZ0IHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgbmVnYXRpdmVcbiAgICAgICAgICB2YXIgcmlnaHRQb3J0SWQgPSBub2RlUG9ydHNbMF0ueCA+IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB4IHZhbHVlIG9mIHJpZ2h0IHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgcG9zaXRpdmVcbiAgICAgICAgICAvKlxuICAgICAgICAgICAqIElmIHRoZSBwb3J0IG9yZGVyaW5nIGlzIGxlZnQgdG8gcmlnaHQgdGhlbiB0aGUgaW5wdXQgcG9ydCBpcyB0aGUgbGVmdCBwb3J0IGFuZCB0aGUgb3V0cHV0IHBvcnQgaXMgdGhlIHJpZ2h0IHBvcnQuXG4gICAgICAgICAgICogRWxzZSBpZiBpdCBpcyByaWdodCB0byBsZWZ0IGl0IGlzIHZpY2UgdmVyc2FcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBub2RlSW5wdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0wtdG8tUicgPyBsZWZ0UG9ydElkIDogcmlnaHRQb3J0SWQ7XG4gICAgICAgICAgbm9kZU91dHB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnUi10by1MJyA/IGxlZnRQb3J0SWQgOiByaWdodFBvcnRJZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICggbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdULXRvLUInIHx8IG5vZGVQb3J0c09yZGVyaW5nID09PSAnQi10by1UJyApe1xuICAgICAgICAgIHZhciB0b3BQb3J0SWQgPSBub2RlUG9ydHNbMF0ueSA8IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB5IHZhbHVlIG9mIHRvcCBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIG5lZ2F0aXZlXG4gICAgICAgICAgdmFyIGJvdHRvbVBvcnRJZCA9IG5vZGVQb3J0c1swXS55ID4gMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHkgdmFsdWUgb2YgYm90dG9tIHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgcG9zaXRpdmVcbiAgICAgICAgICAvKlxuICAgICAgICAgICAqIElmIHRoZSBwb3J0IG9yZGVyaW5nIGlzIHRvcCB0byBib3R0b20gdGhlbiB0aGUgaW5wdXQgcG9ydCBpcyB0aGUgdG9wIHBvcnQgYW5kIHRoZSBvdXRwdXQgcG9ydCBpcyB0aGUgYm90dG9tIHBvcnQuXG4gICAgICAgICAgICogRWxzZSBpZiBpdCBpcyByaWdodCB0byBsZWZ0IGl0IGlzIHZpY2UgdmVyc2FcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBub2RlSW5wdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ1QtdG8tQicgPyB0b3BQb3J0SWQgOiBib3R0b21Qb3J0SWQ7XG4gICAgICAgICAgbm9kZU91dHB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnQi10by1UJyA/IHRvcFBvcnRJZCA6IGJvdHRvbVBvcnRJZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgSU8gcG9ydHMgb2YgdGhlIG5vZGVcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpbnB1dFBvcnRJZDogbm9kZUlucHV0UG9ydElkLFxuICAgICAgICAgIG91dHB1dFBvcnRJZDogbm9kZU91dHB1dFBvcnRJZFxuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgLy8gSWYgYXQgbGVhc3Qgb25lIGVuZCBvZiB0aGUgZWRnZSBoYXMgcG9ydHMgdGhlbiB3ZSBzaG91bGQgZGV0ZXJtaW5lIHRoZSBwb3J0cyB3aGVyZSB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkLlxuICAgICAgaWYgKHNvdXJjZUhhc1BvcnRzIHx8IHRhcmdldEhhc1BvcnRzKSB7XG4gICAgICAgIHZhciBzb3VyY2VOb2RlSW5wdXRQb3J0SWQsIHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQsIHRhcmdldE5vZGVJbnB1dFBvcnRJZCwgdGFyZ2V0Tm9kZU91dHB1dFBvcnRJZDtcblxuICAgICAgICAvLyBJZiBzb3VyY2Ugbm9kZSBoYXMgcG9ydHMgc2V0IHRoZSB2YXJpYWJsZXMgZGVkaWNhdGVkIGZvciBpdHMgSU8gcG9ydHNcbiAgICAgICAgaWYgKCBzb3VyY2VIYXNQb3J0cyApIHtcbiAgICAgICAgICB2YXIgaW9Qb3J0cyA9IGdldElPUG9ydElkcyhzb3VyY2VOb2RlKTtcbiAgICAgICAgICBzb3VyY2VOb2RlSW5wdXRQb3J0SWQgPSBpb1BvcnRzLmlucHV0UG9ydElkO1xuICAgICAgICAgIHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQgPSBpb1BvcnRzLm91dHB1dFBvcnRJZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRhcmdldCBub2RlIGhhcyBwb3J0cyBzZXQgdGhlIHZhcmlhYmxlcyBkZWRpY2F0ZWQgZm9yIGl0cyBJTyBwb3J0c1xuICAgICAgICBpZiAoIHRhcmdldEhhc1BvcnRzICkge1xuICAgICAgICAgIHZhciBpb1BvcnRzID0gZ2V0SU9Qb3J0SWRzKHRhcmdldE5vZGUpO1xuICAgICAgICAgIHRhcmdldE5vZGVJbnB1dFBvcnRJZCA9IGlvUG9ydHMuaW5wdXRQb3J0SWQ7XG4gICAgICAgICAgdGFyZ2V0Tm9kZU91dHB1dFBvcnRJZCA9IGlvUG9ydHMub3V0cHV0UG9ydElkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNiZ25jbGFzcyA9PT0gJ2NvbnN1bXB0aW9uJykge1xuICAgICAgICAgIC8vIEEgY29uc3VtcHRpb24gZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSB0YXJnZXQgbm9kZSB3aGljaCBpcyBzdXBwb3NlZCB0byBiZSBhIHByb2Nlc3MgKGFueSBraW5kIG9mKVxuICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlT3V0cHV0UG9ydElkO1xuICAgICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2JnbmNsYXNzID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAvLyBBIHByb2R1Y3Rpb24gZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBvdXRwdXQgcG9ydCBvZiB0aGUgc291cmNlIG5vZGUgd2hpY2ggaXMgc3VwcG9zZWQgdG8gYmUgYSBwcm9jZXNzIChhbnkga2luZCBvZilcbiAgICAgICAgICAvLyBBIG1vZHVsYXRpb24gZWRnZSBtYXkgaGF2ZSBhIGxvZ2ljYWwgb3BlcmF0b3IgYXMgc291cmNlIG5vZGUgaW4gdGhpcyBjYXNlIHRoZSBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIG91dHB1dCBwb3J0IG9mIGl0XG4gICAgICAgICAgLy8gVGhlIGJlbG93IGFzc2lnbm1lbnQgc2F0aXNmeSBhbGwgb2YgdGhlc2UgY29uZGl0aW9uXG4gICAgICAgICAgaWYoZ3JvdXBJRCA9PSAwIHx8IGdyb3VwSUQgPT0gdW5kZWZpbmVkKSB7IC8vIGdyb3VwSUQgMCBmb3IgcmV2ZXJzaWJsZSByZWFjdGlvbnMgZ3JvdXAgMFxuICAgICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZUlucHV0UG9ydElkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHsgLy9pZiByZWFjdGlvbiBpcyByZXZlcnNpYmxlIGFuZCBlZGdlIGJlbG9uZ3MgdG8gZ3JvdXAgMVxuICAgICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVJbnB1dFBvcnRJZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihlbGVtZW50VXRpbGl0aWVzLmlzTW9kdWxhdGlvbkFyY0NsYXNzKHNiZ25jbGFzcykgfHwgZWxlbWVudFV0aWxpdGllcy5pc0FGQXJjQ2xhc3Moc2JnbmNsYXNzKSl7XG4gICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2JnbmNsYXNzID09PSAnbG9naWMgYXJjJykge1xuICAgICAgICAgIHZhciBzcmNDbGFzcyA9IHNvdXJjZU5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgICAgICB2YXIgdGd0Q2xhc3MgPSB0YXJnZXROb2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgICAgdmFyIGlzU291cmNlTG9naWNhbE9wID0gc3JjQ2xhc3MgPT09ICdhbmQnIHx8IHNyY0NsYXNzID09PSAnb3InIHx8IHNyY0NsYXNzID09PSAnbm90JztcbiAgICAgICAgICB2YXIgaXNUYXJnZXRMb2dpY2FsT3AgPSB0Z3RDbGFzcyA9PT0gJ2FuZCcgfHwgdGd0Q2xhc3MgPT09ICdvcicgfHwgdGd0Q2xhc3MgPT09ICdub3QnO1xuXG4gICAgICAgICAgaWYgKGlzU291cmNlTG9naWNhbE9wICYmIGlzVGFyZ2V0TG9naWNhbE9wKSB7XG4gICAgICAgICAgICAvLyBJZiBib3RoIGVuZCBhcmUgbG9naWNhbCBvcGVyYXRvcnMgdGhlbiB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSB0YXJnZXQgYW5kIHRoZSBvdXRwdXQgcG9ydCBvZiB0aGUgaW5wdXRcbiAgICAgICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XG4gICAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZU91dHB1dFBvcnRJZDtcbiAgICAgICAgICB9Ly8gSWYganVzdCBvbmUgZW5kIG9mIGxvZ2ljYWwgb3BlcmF0b3IgdGhlbiB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSBsb2dpY2FsIG9wZXJhdG9yXG4gICAgICAgICAgZWxzZSBpZiAoaXNTb3VyY2VMb2dpY2FsT3ApIHtcbiAgICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlSW5wdXRQb3J0SWQ7XG4gICAgICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZU91dHB1dFBvcnRJZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoaXNUYXJnZXRMb2dpY2FsT3ApIHtcbiAgICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlT3V0cHV0UG9ydElkO1xuICAgICAgICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVJbnB1dFBvcnRJZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGRlZmF1bHQgcG9ydHNvdXJjZS9wb3J0dGFyZ2V0IGFyZSB0aGUgc291cmNlL3RhcmdldCB0aGVtc2VsdmVzLiBJZiB0aGV5IGFyZSBub3Qgc2V0IHVzZSB0aGVzZSBkZWZhdWx0cy5cbiAgICAgIC8vIFRoZSBwb3J0c291cmNlIGFuZCBwb3J0dGFyZ2V0IGFyZSBkZXRlcm1pbmVkIHNldCB0aGVtIGluIGRhdGEgb2JqZWN0LlxuICAgICAgZGF0YS5wb3J0c291cmNlID0gcG9ydHNvdXJjZSB8fCBzb3VyY2U7XG4gICAgICBkYXRhLnBvcnR0YXJnZXQgPSBwb3J0dGFyZ2V0IHx8IHRhcmdldDtcblxuICAgICAgdmFyIGVsZXMgPSBjeS5hZGQoe1xuICAgICAgICBncm91cDogXCJlZGdlc1wiLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBjc3M6IGNzc1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBuZXdFZGdlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xuXG4gICAgICByZXR1cm4gbmV3RWRnZTtcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyA9IGZ1bmN0aW9uKF9zb3VyY2UsIF90YXJnZXQsIG5vZGVQYXJhbXMpIHtcbiAgICAgIC8vIElmIHNvdXJjZSBhbmQgdGFyZ2V0IElEcyBhcmUgZ2l2ZW4gZ2V0IHRoZSBlbGVtZW50cyBieSBJRHNcbiAgICAgIHZhciBzb3VyY2UgPSB0eXBlb2YgX3NvdXJjZSA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfc291cmNlKSA6IF9zb3VyY2U7XG4gICAgICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xuXG4gICAgICAvLyBQcm9jZXNzIHBhcmVudCBzaG91bGQgYmUgdGhlIGNsb3Nlc3QgY29tbW9uIGFuY2VzdG9yIG9mIHRoZSBzb3VyY2UgYW5kIHRhcmdldCBub2Rlc1xuICAgICAgdmFyIHByb2Nlc3NQYXJlbnQgPSBjeS5jb2xsZWN0aW9uKFtzb3VyY2VbMF0sIHRhcmdldFswXV0pLmNvbW1vbkFuY2VzdG9ycygpLmZpcnN0KCk7XG5cbiAgICAgIC8vIFByb2Nlc3Mgc2hvdWxkIGJlIGF0IHRoZSBtaWRkbGUgb2YgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0IG5vZGVzXG4gICAgICB2YXIgeCA9ICggc291cmNlLnBvc2l0aW9uKCd4JykgKyB0YXJnZXQucG9zaXRpb24oJ3gnKSApIC8gMjtcbiAgICAgIHZhciB5ID0gKCBzb3VyY2UucG9zaXRpb24oJ3knKSArIHRhcmdldC5wb3NpdGlvbigneScpICkgLyAyO1xuXG4gICAgICAvLyBDcmVhdGUgdGhlIHByb2Nlc3Mgd2l0aCBnaXZlbi9jYWxjdWxhdGVkIHZhcmlhYmxlc1xuICAgICAgdmFyIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgbm9kZVBhcmFtcywgdW5kZWZpbmVkLCBwcm9jZXNzUGFyZW50LmlkKCkpO1xuICAgICAgICB2YXIgeGRpZmYgPSBzb3VyY2UucG9zaXRpb24oJ3gnKSAtIHRhcmdldC5wb3NpdGlvbigneCcpO1xuICAgICAgICB2YXIgeWRpZmYgPSBzb3VyY2UucG9zaXRpb24oJ3knKSAtIHRhcmdldC5wb3NpdGlvbigneScpXG4gICAgICAgIGlmIChNYXRoLmFicyh4ZGlmZikgPj0gTWF0aC5hYnMoeWRpZmYpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoeGRpZmYgPCAwKVxuICAgICAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnTC10by1SJyk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdSLXRvLUwnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh5ZGlmZiA8IDApXG4gICAgICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdULXRvLUInKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ0ItdG8tVCcpO1xuICAgICAgICB9XG5cblxuICAgICAgLy8gQ3JlYXRlIHRoZSBlZGdlcyBvbmUgaXMgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIHNvdXJjZSBub2RlICh3aGljaCBzaG91bGQgYmUgYSBjb25zdW1wdGlvbiksXG4gICAgICAvLyB0aGUgb3RoZXIgb25lIGlzIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSB0YXJnZXQgbm9kZSAod2hpY2ggc2hvdWxkIGJlIGEgcHJvZHVjdGlvbikuXG4gICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBwbGVhc2UgcmVmZXIgdG8gU0JHTi1QRCByZWZlcmVuY2UgY2FyZC5cbiAgICAgIHZhciBlZGdlQnR3U3JjID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZS5pZCgpLCBwcm9jZXNzLmlkKCksIHtjbGFzcyA6ICdjb25zdW1wdGlvbicsIGxhbmd1YWdlIDogbm9kZVBhcmFtcy5sYW5ndWFnZX0pO1xuICAgICAgdmFyIGVkZ2VCdHdUZ3QgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCB0YXJnZXQuaWQoKSwge2NsYXNzIDogJ3Byb2R1Y3Rpb24nLCBsYW5ndWFnZSA6IG5vZGVQYXJhbXMubGFuZ3VhZ2V9KTtcblxuICAgICAgLy8gQ3JlYXRlIGEgY29sbGVjdGlvbiBpbmNsdWRpbmcgdGhlIGVsZW1lbnRzIGFuZCB0byBiZSByZXR1cm5lZFxuICAgICAgdmFyIGNvbGxlY3Rpb24gPSBjeS5jb2xsZWN0aW9uKFtwcm9jZXNzWzBdLCBlZGdlQnR3U3JjWzBdLCBlZGdlQnR3VGd0WzBdXSk7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBUaGlzIG1ldGhvZCBhc3N1bWVzIHRoYXQgcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZCBjb250YWlucyBhdCBsZWFzdCBvbmUgbm9kZVxuICAgICAqIGFuZCBhbGwgb2YgdGhlIG5vZGVzIGluY2x1ZGluZyBpbiBpdCBoYXZlIHRoZSBzYW1lIHBhcmVudC4gSXQgY3JlYXRlcyBhIGNvbXBvdW5kIGZvdCB0aGUgZ2l2ZW4gbm9kZXMgYW4gaGF2aW5nIHRoZSBnaXZlbiB0eXBlLlxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKG5vZGVzVG9NYWtlQ29tcG91bmQsIGNvbXBvdW5kVHlwZSkge1xuICAgICAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xuICAgICAgdmFyIGxhbmd1YWdlID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwibGFuZ3VhZ2VcIik7XG4gICAgICAvLyBpZiBub2Rlc1RvTWFrZUNvbXBvdW5kIGNvbnRhaW4gYm90aCBQRCBhbmQgQUYgbm9kZXMsIHRoZW4gc2V0IGxhbmd1YWdlIG9mIGNvbXBvdW5kIGFzIFVua25vd25cbiAgICAgIGZvciggdmFyIGk9MTsgaTxub2Rlc1RvTWFrZUNvbXBvdW5kLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgaWYobm9kZXNUb01ha2VDb21wb3VuZFtpXSAhPSBsYW5ndWFnZSl7XG4gICAgICAgICAgbGFuZ3VhZ2UgPSBcIlVua25vd25cIjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZC4geCwgeSBhbmQgaWQgcGFyYW1ldGVycyBhcmUgbm90IHNldC5cbiAgICAgIHZhciBuZXdDb21wb3VuZCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwge2NsYXNzIDogY29tcG91bmRUeXBlLCBsYW5ndWFnZSA6IGxhbmd1YWdlfSwgdW5kZWZpbmVkLCBvbGRQYXJlbnRJZCk7XG4gICAgICB2YXIgbmV3Q29tcG91bmRJZCA9IG5ld0NvbXBvdW5kLmlkKCk7XG4gICAgICB2YXIgbmV3RWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50KG5vZGVzVG9NYWtlQ29tcG91bmQsIG5ld0NvbXBvdW5kSWQpO1xuICAgICAgbmV3RWxlcyA9IG5ld0VsZXMudW5pb24obmV3Q29tcG91bmQpO1xuICAgICAgcmV0dXJuIG5ld0VsZXM7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogQ3JlYXRlcyBhIHRlbXBsYXRlIHJlYWN0aW9uIHdpdGggZ2l2ZW4gcGFyYW1ldGVycy4gUmVxdWlyZXMgY29zZS1iaWxrZW50IGxheW91dCB0byB0aWxlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzIGluY2x1ZGVkXG4gICAgICogaW4gdGhlIGNvbXBsZXguIFBhcmFtZXRlcnMgYXJlIGV4cGxhaW5lZCBiZWxvdy5cbiAgICAgKiB0ZW1wbGF0ZVR5cGU6IFRoZSB0eXBlIG9mIHRoZSB0ZW1wbGF0ZSByZWFjdGlvbi4gSXQgbWF5IGJlICdhc3NvY2lhdGlvbicgb3IgJ2Rpc3NvY2lhdGlvbicgZm9yIG5vdy5cbiAgICAgKiBub2RlTGlzdDogVGhlIGxpc3Qgb2YgdGhlIG5hbWVzIGFuZCB0eXBlcyBvZiBtb2xlY3VsZXMgd2hpY2ggd2lsbCBpbnZvbHZlIGluIHRoZSByZWFjdGlvbi5cbiAgICAgKiBjb21wbGV4TmFtZTogVGhlIG5hbWUgb2YgdGhlIGNvbXBsZXggaW4gdGhlIHJlYWN0aW9uLlxuICAgICAqIHByb2Nlc3NQb3NpdGlvbjogVGhlIG1vZGFsIHBvc2l0aW9uIG9mIHRoZSBwcm9jZXNzIGluIHRoZSByZWFjdGlvbi4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxuICAgICAqIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cbiAgICAgKiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cbiAgICAgKiBlZGdlTGVuZ3RoOiBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIG1hY3JvbW9sZWN1bGVzIGF0IHRoZSBib3RoIHNpZGVzLlxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG5vZGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoLCBsYXlvdXRQYXJhbSkge1xuXG4gICAgICB2YXIgZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBcIm1hY3JvbW9sZWN1bGVcIiApO1xuICAgICAgdmFyIGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBcInNpbXBsZSBjaGVtaWNhbFwiICk7XG4gICAgICB2YXIgZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyggdGVtcGxhdGVUeXBlICk7XG4gICAgICB2YXIgcHJvY2Vzc1dpZHRoID0gZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xuICAgICAgdmFyIG1hY3JvbW9sZWN1bGVXaWR0aCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xuICAgICAgdmFyIG1hY3JvbW9sZWN1bGVIZWlnaHQgPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XG4gICAgICB2YXIgc2ltcGxlQ2hlbWljYWxXaWR0aCA9IGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMud2lkdGggfHwgMzU7XG4gICAgICB2YXIgc2ltcGxlQ2hlbWljYWxIZWlnaHQgPSBkZWZhdWx0U2ltcGxlQ2hlbWljYWxQcm9wZXJ0aWVzLmhlaWdodCB8fCAzNTtcbiAgICAgIHZhciBwcm9jZXNzUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24gfHwgZWxlbWVudFV0aWxpdGllcy5jb252ZXJ0VG9Nb2RlbFBvc2l0aW9uKHt4OiBjeS53aWR0aCgpIC8gMiwgeTogY3kuaGVpZ2h0KCkgLyAyfSk7XG4gICAgICB2YXIgbm9kZUxpc3QgPSBub2RlTGlzdDtcbiAgICAgIHZhciBjb21wbGV4TmFtZSA9IGNvbXBsZXhOYW1lO1xuICAgICAgdmFyIG51bU9mTW9sZWN1bGVzID0gbm9kZUxpc3QubGVuZ3RoO1xuICAgICAgdmFyIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA9IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCB8fCAxNTtcbiAgICAgIHZhciB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA9IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsIHx8IDE1O1xuICAgICAgdmFyIGVkZ2VMZW5ndGggPSBlZGdlTGVuZ3RoIHx8IDYwO1xuXG4gICAgICBjeS5zdGFydEJhdGNoKCk7XG5cbiAgICAgIHZhciB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcztcbiAgICAgIHZhciB4UG9zaXRpb25PZklucHV0TWFjcm9tb2xlY3VsZXM7XG4gICAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShcIlBEXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICAgICAgIFxuICAgICAgfVxuICAgICAgZWxzZSBpZih0ZW1wbGF0ZVR5cGUgPT09ICdkaXNzb2NpYXRpb24nKXtcbiAgICAgICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgICAgICBcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIFxuICAgICAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICAgICAgICB4UG9zaXRpb25PZklucHV0TWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgICAgIH1cblxuICAgICAgLy9DcmVhdGUgdGhlIHByb2Nlc3MgaW4gdGVtcGxhdGUgdHlwZVxuICAgICAgdmFyIHByb2Nlc3M7XG4gICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAncmV2ZXJzaWJsZScpIHtcbiAgICAgICAgcHJvY2VzcyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHtjbGFzcyA6ICdwcm9jZXNzJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnTC10by1SJyk7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBwcm9jZXNzID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwge2NsYXNzIDogdGVtcGxhdGVUeXBlLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdMLXRvLVInKTtcbiAgICAgIH1cbiAgICAgIHByb2Nlc3MuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIC8vRGVmaW5lIHRoZSBzdGFydGluZyB5IHBvc2l0aW9uXG4gICAgICB2YXIgeVBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKG51bU9mTW9sZWN1bGVzIC0gMSkgLyAyKSAqIChtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKTtcblxuICAgICAgLy9DcmVhdGUgdGhlIGZyZWUgbW9sZWN1bGVzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTW9sZWN1bGVzOyBpKyspIHtcbiAgICAgICAgLy8gbm9kZSBhZGRpdGlvbiBvcGVyYXRpb24gaXMgZGV0ZXJtaW5lZCBieSBtb2xlY3VsZSB0eXBlXG4gICAgICAgIGlmKG5vZGVMaXN0W2ldLnR5cGUgPT0gXCJTaW1wbGUgQ2hlbWljYWxcIil7XG4gICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMsIHlQb3NpdGlvbiwge2NsYXNzIDogJ3NpbXBsZSBjaGVtaWNhbCcsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICAgIC8vdXBkYXRlIHRoZSB5IHBvc2l0aW9uXG4gICAgICAgICAgeVBvc2l0aW9uICs9IHNpbXBsZUNoZW1pY2FsSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMsIHlQb3NpdGlvbiwge2NsYXNzIDogJ21hY3JvbW9sZWN1bGUnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgICAvL3VwZGF0ZSB0aGUgeSBwb3NpdGlvblxuICAgICAgICAgIHlQb3NpdGlvbiArPSBtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xuICAgICAgICB9XG4gICAgICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBub2RlTGlzdFtpXS5uYW1lKTtcblxuICAgICAgICAvL2NyZWF0ZSB0aGUgZWRnZSBjb25uZWN0ZWQgdG8gdGhlIG5ldyBtb2xlY3VsZVxuICAgICAgICB2YXIgbmV3RWRnZTtcbiAgICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3Tm9kZS5pZCgpLCBwcm9jZXNzLmlkKCksIHtjbGFzcyA6ICdjb25zdW1wdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGVtcGxhdGVUeXBlID09PSAnZGlzc29jaWF0aW9uJyl7XG4gICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIG5ld05vZGUuaWQoKSwge2NsYXNzIDogJ3Byb2R1Y3Rpb24nLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIC8vR3JvdXAgcmlnaHQgb3IgdG9wIGVsZW1lbnRzIGluIGdyb3VwIGlkIDFcbiAgICAgICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgbmV3Tm9kZS5pZCgpLCB7Y2xhc3MgOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0VkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJyB8fCB0ZW1wbGF0ZVR5cGUgPT0gJ2Rpc3NvY2lhdGlvbicpe1xuICAgICAgICAvL0NyZWF0ZSB0aGUgY29tcGxleCBpbmNsdWRpbmcgbWFjcm9tb2xlY3VsZXMgaW5zaWRlIG9mIGl0XG4gICAgICAgIC8vVGVtcHJvcmFyaWx5IGFkZCBpdCB0byB0aGUgcHJvY2VzcyBwb3NpdGlvbiB3ZSB3aWxsIG1vdmUgaXQgYWNjb3JkaW5nIHRvIHRoZSBsYXN0IHNpemUgb2YgaXRcbiAgICAgICAgdmFyIGNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB7Y2xhc3MgOiAnY29tcGxleCcsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcblxuICAgICAgICAvL0lmIGEgbmFtZSBpcyBzcGVjaWZpZWQgZm9yIHRoZSBjb21wbGV4IHNldCBpdHMgbGFiZWwgYWNjb3JkaW5nbHlcbiAgICAgICAgaWYgKGNvbXBsZXhOYW1lKSB7XG4gICAgICAgICAgY29tcGxleC5kYXRhKCdsYWJlbCcsIGNvbXBsZXhOYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5uZWN0ZWQgdG8gdGhlIGNvbXBsZXhcbiAgICAgICAgdmFyIGVkZ2VPZkNvbXBsZXg7XG5cbiAgICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBjb21wbGV4LmlkKCksIHtjbGFzcyA6ICdwcm9kdWN0aW9uJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShjb21wbGV4LmlkKCksIHByb2Nlc3MuaWQoKSwge2NsYXNzIDogJ2NvbnN1bXB0aW9uJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgIH1cblxuICAgICAgICBlZGdlT2ZDb21wbGV4LmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZNb2xlY3VsZXM7IGkrKykge1xuXG4gICAgICAgICAgLy8gQWRkIGEgbW9sZWN1bGUoZGVwZW5kZW50IG9uIGl0J3MgdHlwZSkgbm90IGhhdmluZyBhIHByZXZpb3VzbHkgZGVmaW5lZCBpZCBhbmQgaGF2aW5nIHRoZSBjb21wbGV4IGNyZWF0ZWQgaW4gdGhpcyByZWFjdGlvbiBhcyBwYXJlbnRcbiAgICAgICAgICBpZihub2RlTGlzdFtpXS50eXBlID09ICdTaW1wbGUgQ2hlbWljYWwnKXtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKGNvbXBsZXgucG9zaXRpb24oJ3gnKSwgY29tcGxleC5wb3NpdGlvbigneScpLCB7Y2xhc3MgOiAnc2ltcGxlIGNoZW1pY2FsJywgbGFuZ3VhZ2UgOiAnUEQnfSwgdW5kZWZpbmVkLCBjb21wbGV4LmlkKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoY29tcGxleC5wb3NpdGlvbigneCcpLCBjb21wbGV4LnBvc2l0aW9uKCd5JyksIHtjbGFzcyA6ICdtYWNyb21vbGVjdWxlJywgbGFuZ3VhZ2UgOiAnUEQnfSwgdW5kZWZpbmVkLCBjb21wbGV4LmlkKCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICAgICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIG5vZGVMaXN0W2ldLm5hbWUpO1xuICAgICAgICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNle1xuXG4gICAgICAgIC8vQ3JlYXRlIHRoZSBpbnB1dCBtYWNyb21vbGVjdWxlc1xuICAgICAgICB2YXIgbnVtT2ZJbnB1dE1hY3JvbW9sZWN1bGVzID0gY29tcGxleE5hbWUubGVuZ3RoO1xuICAgICAgICB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZJbnB1dE1hY3JvbW9sZWN1bGVzIC0gMSkgLyAyKSAqIChtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mSW5wdXRNYWNyb21vbGVjdWxlczsgaSsrKSB7XG5cbiAgICAgICAgICBpZihjb21wbGV4TmFtZVtpXS50eXBlID09ICdTaW1wbGUgQ2hlbWljYWwnKXtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NpdGlvbk9mSW5wdXRNYWNyb21vbGVjdWxlcywgeVBvc2l0aW9uLCB7Y2xhc3MgOiAnc2ltcGxlIGNoZW1pY2FsJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgICAgICB5UG9zaXRpb24gKz0gc2ltcGxlQ2hlbWljYWxIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZklucHV0TWFjcm9tb2xlY3VsZXMsIHlQb3NpdGlvbiwge2NsYXNzIDogJ21hY3JvbW9sZWN1bGUnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgICAgIHlQb3NpdGlvbiArPSBtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICAgICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIGNvbXBsZXhOYW1lW2ldLm5hbWUpO1xuXG4gICAgICAgICAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubmVjdGVkIHRvIHRoZSBuZXcgbWFjcm9tb2xlY3VsZVxuICAgICAgICAgIHZhciBuZXdFZGdlO1xuXG4gICAgICAgICAgLy9Hcm91cCB0aGUgbGVmdCBvciBib3R0b20gZWxlbWVudHMgaW4gZ3JvdXAgaWQgMFxuICAgICAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBuZXdOb2RlLmlkKCksIHtjbGFzcyA6ICdwcm9kdWN0aW9uJywgbGFuZ3VhZ2UgOiAnUEQnfSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIDApO1xuICAgICAgICAgIG5ld0VkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjeS5lbmRCYXRjaCgpO1xuXG4gICAgICB2YXIgbGF5b3V0Tm9kZXMgPSBjeS5ub2RlcygnW2p1c3RBZGRlZExheW91dE5vZGVdJyk7XG4gICAgICBsYXlvdXROb2Rlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJyk7XG4gICAgICB2YXIgbGF5b3V0ID0gbGF5b3V0Tm9kZXMubGF5b3V0KHtcbiAgICAgICAgbmFtZTogbGF5b3V0UGFyYW0ubmFtZSxcbiAgICAgICAgcmFuZG9taXplOiBmYWxzZSxcbiAgICAgICAgZml0OiBmYWxzZSxcbiAgICAgICAgYW5pbWF0ZTogZmFsc2UsXG4gICAgICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLFxuICAgICAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXG4gICAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvL0lmIGl0IGlzIGEgcmV2ZXJzaWJsZSByZWFjdGlvbiBubyBuZWVkIHRvIHJlLXBvc2l0aW9uIGNvbXBsZXhlc1xuICAgICAgICAgIGlmKHRlbXBsYXRlVHlwZSA9PT0gJ3JldmVyc2libGUnKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIC8vcmUtcG9zaXRpb24gdGhlIG5vZGVzIGluc2lkZSB0aGUgY29tcGxleFxuICAgICAgICAgIHZhciBzdXBwb3NlZFhQb3NpdGlvbjtcbiAgICAgICAgICB2YXIgc3VwcG9zZWRZUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueTtcblxuICAgICAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHBvc2l0aW9uRGlmZlggPSAoc3VwcG9zZWRYUG9zaXRpb24gLSBjb21wbGV4LnBvc2l0aW9uKCd4JykpIC8gMjtcbiAgICAgICAgICB2YXIgcG9zaXRpb25EaWZmWSA9IChzdXBwb3NlZFlQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3knKSkgLyAyO1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NpdGlvbkRpZmZYLCB5OiBwb3NpdGlvbkRpZmZZfSwgY29tcGxleCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBEbyB0aGlzIGNoZWNrIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuICYmIHRlbXBsYXRlVHlwZSAhPT0gJ3JldmVyc2libGUnKSB7XG4gICAgICAgIGxheW91dC5ydW4oKTtcbiAgICAgIH1cblxuICAgICAgLy9maWx0ZXIgdGhlIGp1c3QgYWRkZWQgZWxlbWVtdHMgdG8gcmV0dXJuIHRoZW0gYW5kIHJlbW92ZSBqdXN0IGFkZGVkIG1hcmtcbiAgICAgIHZhciBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XG4gICAgICBlbGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZCcpO1xuXG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICBlbGVzLnNlbGVjdCgpO1xuXG4gICAgICByZXR1cm4gZWxlczsgLy8gUmV0dXJuIHRoZSBqdXN0IGFkZGVkIGVsZW1lbnRzXG4gICAgfTtcblxuICAgIC8qXG4gICAgICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgbmV3UGFyZW50LCBwb3NEaWZmWCwgcG9zRGlmZlkpIHtcbiAgICAgIHZhciBuZXdQYXJlbnRJZCA9IG5ld1BhcmVudCA9PSB1bmRlZmluZWQgfHwgdHlwZW9mIG5ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBuZXdQYXJlbnQgOiBuZXdQYXJlbnQuaWQoKTtcbiAgICAgIHZhciBtb3ZlZEVsZXMgPSBub2Rlcy5tb3ZlKHtcInBhcmVudFwiOiBuZXdQYXJlbnRJZH0pO1xuICAgICAgaWYodHlwZW9mIHBvc0RpZmZYICE9ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwb3NEaWZmWSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyh7eDogcG9zRGlmZlgsIHk6IHBvc0RpZmZZfSwgbm9kZXMpO1xuICAgICAgfVxuICAgICAgZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXIobW92ZWRFbGVzKTtcbiAgICAgIHJldHVybiBtb3ZlZEVsZXM7XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlSW5mb2JveFN0eWxlID0gZnVuY3Rpb24oIG5vZGUsIGluZGV4LCBuZXdQcm9wcyApIHtcbiAgICAgIHZhciBpbmZvYm94T2JqID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpW2luZGV4XTtcbiAgICAgICQuZXh0ZW5kKCBpbmZvYm94T2JqLnN0eWxlLCBuZXdQcm9wcyApO1xuICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVJbmZvYm94T2JqID0gZnVuY3Rpb24oIG5vZGUsIGluZGV4LCBuZXdQcm9wcyApIHtcbiAgICAgIHZhciBpbmZvYm94T2JqID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpW2luZGV4XTtcbiAgICAgICQuZXh0ZW5kKCBpbmZvYm94T2JqLCBuZXdQcm9wcyApO1xuICAgIH07XG5cbiAgICAvLyBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uIChub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8sIHByZXNlcnZlUmVsYXRpdmVQb3MpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgcmF0aW8gPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBlbGVNdXN0QmVTcXVhcmUgPSBlbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZShub2RlLmRhdGEoJ2NsYXNzJykpO1xuXG4gICAgICAgIGlmIChwcmVzZXJ2ZVJlbGF0aXZlUG9zID09PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIG9sZFdpZHRoID0gbm9kZS5kYXRhKFwiYmJveFwiKS53O1xuICAgICAgICAgIHZhciBvbGRIZWlnaHQgPSBub2RlLmRhdGEoXCJiYm94XCIpLmg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3RlIHRoYXQgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0IGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeVxuICAgICAgICBpZighbm9kZS5pc1BhcmVudCgpKXtcbiAgICAgICAgICBpZiAod2lkdGgpIHtcbiAgICAgICAgICAgIGlmICh1c2VBc3BlY3RSYXRpbyB8fCBlbGVNdXN0QmVTcXVhcmUpIHtcbiAgICAgICAgICAgICAgcmF0aW8gPSB3aWR0aCAvIG5vZGUud2lkdGgoKTtcbiAgICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSB3aWR0aDtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGlmIChoZWlnaHQpIHtcbiAgICAgICAgICAgIGlmICh1c2VBc3BlY3RSYXRpbyB8fCBlbGVNdXN0QmVTcXVhcmUpIHtcbiAgICAgICAgICAgICAgcmF0aW8gPSBoZWlnaHQgLyBub2RlLmhlaWdodCgpO1xuICAgICAgICAgICAgfVxuICBcbiAgICAgICAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IGhlaWdodDtcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIGlmIChyYXRpbyAmJiAhaGVpZ2h0KSB7XG4gICAgICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBub2RlLmhlaWdodCgpICogcmF0aW87XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKHJhdGlvICYmICF3aWR0aCkge1xuICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gbm9kZS53aWR0aCgpICogcmF0aW87XG4gICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBub2RlLmRhdGEoXCJtaW5IZWlnaHRcIiAsIFwiXCIrIGhlaWdodCk7XG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluV2lkdGhcIiAsIFwiXCIrIHdpZHRoKTtcbiAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aEJpYXNMZWZ0XCIsIFwiNTAlXCIpO1xuICAgICAgICAgIG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc1JpZ2h0XCIsIFwiNTAlXCIpO1xuICAgICAgICAgIG5vZGUuZGF0YShcIm1pbkhlaWdodEJpYXNUb3BcIiwgXCI1MCVcIiApO1xuICAgICAgICAgIG5vZGUuZGF0YShcIm1pbkhlaWdodEJpYXNCb3R0b21cIiwgXCI1MCVcIik7XG4gICAgICAgIH1cbiAgICAgICAgXG5cbiAgICAgLyogICAgaWYgKHByZXNlcnZlUmVsYXRpdmVQb3MgPT09IHRydWUpIHtcbiAgICAgICAgICB2YXIgc3RhdGVzYW5kaW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgICAgICAgdmFyIHRvcEJvdHRvbSA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gKGJveC5hbmNob3JTaWRlID09PSBcInRvcFwiIHx8IGJveC5hbmNob3JTaWRlID09PSBcImJvdHRvbVwiKSk7XG4gICAgICAgICAgdmFyIHJpZ2h0TGVmdCA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gKGJveC5hbmNob3JTaWRlID09PSBcInJpZ2h0XCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwibGVmdFwiKSk7XG5cbiAgICAgICAgICB0b3BCb3R0b20uZm9yRWFjaChmdW5jdGlvbihib3gpe1xuICAgICAgICAgICAgaWYgKGJveC5iYm94LnggPCAwKSB7XG4gICAgICAgICAgICAgIGJveC5iYm94LnggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYm94LmJib3gueCA+IG9sZFdpZHRoKSB7XG4gICAgICAgICAgICAgIGJveC5iYm94LnggPSBvbGRXaWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJveC5iYm94LnggPSBub2RlLmRhdGEoXCJiYm94XCIpLncgKiBib3guYmJveC54IC8gb2xkV2lkdGg7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByaWdodExlZnQuZm9yRWFjaChmdW5jdGlvbihib3gpe1xuICAgICAgICAgICAgaWYgKGJveC5iYm94LnkgPCAwKSB7XG4gICAgICAgICAgICAgIGJveC5iYm94LnkgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYm94LmJib3gueSA+IG9sZEhlaWdodCkge1xuICAgICAgICAgICAgICBib3guYmJveC55ID0gb2xkSGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYm94LmJib3gueSA9IG5vZGUuZGF0YShcImJib3hcIikuaCAqIGJveC5iYm94LnkgLyBvbGRIZWlnaHQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gKi9cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5XaWR0aCA9IGZ1bmN0aW9uKG5vZGUpIHtcblxuICAgICAgICB2YXIgZGVmYXVsdFdpZHRoID0gdGhpcy5nZXREZWZhdWx0UHJvcGVydGllcyhub2RlLmRhdGEoJ2NsYXNzJykpLndpZHRoO1xuXG4gICAgICAgIC8vIExhYmVsIHdpZHRoIGNhbGN1bGF0aW9uXG4gICAgICAgIHZhciBzdHlsZSA9IG5vZGUuc3R5bGUoKTtcblxuICAgICAgICB2YXIgZm9udEZhbWlsaXkgPSBzdHlsZVsnZm9udC1mYW1pbHknXTtcbiAgICAgICAgdmFyIGZvbnRTaXplID0gc3R5bGVbJ2ZvbnQtc2l6ZSddO1xuICAgICAgICB2YXIgbGFiZWxUZXh0ID0gc3R5bGVbJ2xhYmVsJ107XG5cbiAgICAgICAgdmFyIGxhYmVsV2lkdGggPSBlbGVtZW50VXRpbGl0aWVzLmdldFdpZHRoQnlDb250ZW50KCBsYWJlbFRleHQsIGZvbnRGYW1pbGl5LCBmb250U2l6ZSApO1xuXG4gICAgICAgIHZhciBzdGF0ZXNhbmRpbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcbiAgICAgICAgLy9Ub3AgYW5kIGJvdHRvbSBpbmZvQm94ZXNcbiAgICAgICAgLy92YXIgdG9wSW5mb0JveGVzID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiAoYm94LmFuY2hvclNpZGUgPT09IFwidG9wXCIgfHwgKChib3guYW5jaG9yU2lkZSA9PT0gXCJyaWdodFwiIHx8IGJveC5hbmNob3JTaWRlID09PSBcImxlZnRcIikgJiYgKGJveC5iYm94LnkgPD0gMTIpKSkpO1xuICAgICAgICAvL3ZhciBib3R0b21JbmZvQm94ZXMgPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IChib3guYW5jaG9yU2lkZSA9PT0gXCJib3R0b21cIiB8fCAoKGJveC5hbmNob3JTaWRlID09PSBcInJpZ2h0XCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwibGVmdFwiKSAmJiAoYm94LmJib3gueSA+PSBub2RlLmRhdGEoJ2Jib3gnKS5oIC0gMTIpKSkpO1xuICAgICAgICB2YXIgdW5pdEdhcCA9IDU7XG4gICAgICAgIHZhciB0b3BJZGVhbFdpZHRoID0gdW5pdEdhcDtcbiAgICAgICAgdmFyIGJvdHRvbUlkZWFsV2lkdGggPSB1bml0R2FwOyAgICAgICAgXG4gICAgICAgIHZhciByaWdodE1heFdpZHRoID0gMDtcbiAgICAgICAgdmFyIGxlZnRNYXhXaWR0aCA9MDtcbiAgICAgICAgc3RhdGVzYW5kaW5mb3MuZm9yRWFjaChmdW5jdGlvbihib3gpe1xuICAgICAgICAgIGlmKGJveC5hbmNob3JTaWRlID09PSBcInRvcFwiKXtcbiAgICAgICAgICAgIHRvcElkZWFsV2lkdGggKz0gYm94LmJib3gudyArIHVuaXRHYXA7XG5cbiAgICAgICAgICB9ZWxzZSBpZihib3guYW5jaG9yU2lkZSA9PT0gXCJib3R0b21cIil7XG4gICAgICAgICAgICBib3R0b21JZGVhbFdpZHRoICs9IGJveC5iYm94LncgKyB1bml0R2FwO1xuXG4gICAgICAgICAgfWVsc2UgaWYoYm94LmFuY2hvclNpZGUgPT09IFwicmlnaHRcIilcbiAgICAgICAgICB7ICAgICAgICAgICBcbiAgICAgICAgICAgIHJpZ2h0TWF4V2lkdGggPSAoYm94LmJib3gudyA+IHJpZ2h0TWF4V2lkdGgpID8gYm94LmJib3gudyA6IHJpZ2h0TWF4V2lkdGg7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxlZnRNYXhXaWR0aCA9IChib3guYmJveC53ID4gbGVmdE1heFdpZHRoKSA/IGJveC5iYm94LncgOiBsZWZ0TWF4V2lkdGg7XG4gICAgICAgICAgfVxuICAgICAgICB9KTsgICAgICBcblxuICAgICAgICB2YXIgbWlkZGxlV2lkdGggPSBsYWJlbFdpZHRoICsgMiAqIE1hdGgubWF4KHJpZ2h0TWF4V2lkdGgvMiwgbGVmdE1heFdpZHRoLzIpO1xuXG4gICAgICAgIHZhciBjb21wb3VuZFdpZHRoID0gMDtcbiAgICAgICAgaWYobm9kZS5pc1BhcmVudCgpKXtcbiAgICAgICAgICBjb21wb3VuZFdpZHRoID0gbm9kZS5jaGlsZHJlbigpLmJvdW5kaW5nQm94KCkudztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5tYXgobWlkZGxlV2lkdGgsIGRlZmF1bHRXaWR0aC8yLCB0b3BJZGVhbFdpZHRoLCBib3R0b21JZGVhbFdpZHRoLCBjb21wb3VuZFdpZHRoKTtcbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbkhlaWdodCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgICAgICB2YXIgbWFyZ2luID0gNztcbiAgICAgICAgdmFyIHVuaXRHYXAgPSA1O1xuICAgICAgICB2YXIgZGVmYXVsdEhlaWdodCA9IHRoaXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMobm9kZS5kYXRhKCdjbGFzcycpKS5oZWlnaHQ7XG4gICAgICAgIHZhciBsZWZ0SW5mb0JveGVzID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiBib3guYW5jaG9yU2lkZSA9PT0gXCJsZWZ0XCIpOyAgICAgICAgXG4gICAgICAgIHZhciBsZWZ0SGVpZ2h0ID0gdW5pdEdhcDsgXG4gICAgICAgIGxlZnRJbmZvQm94ZXMuZm9yRWFjaChmdW5jdGlvbihib3gpe1xuICAgICAgICAgICAgbGVmdEhlaWdodCArPSBib3guYmJveC5oICsgdW5pdEdhcDtcbiAgICAgICAgICAgXG4gICAgICAgIH0pOyAgICAgIFxuICAgICAgICB2YXIgcmlnaHRJbmZvQm94ZXMgPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IGJveC5hbmNob3JTaWRlID09PSBcInJpZ2h0XCIpO1xuICAgICAgICB2YXIgcmlnaHRIZWlnaHQgPSB1bml0R2FwOyAgICAgICAgXG4gICAgICAgIHJpZ2h0SW5mb0JveGVzLmZvckVhY2goZnVuY3Rpb24oYm94KXtcbiAgICAgICAgICAgIHJpZ2h0SGVpZ2h0ICs9IGJveC5iYm94LmggKyB1bml0R2FwOyAgICAgICAgICAgXG4gICAgICAgIH0pOyAgICAgICBcbiAgICAgICAgdmFyIHN0eWxlID0gbm9kZS5zdHlsZSgpO1xuICAgICAgICB2YXIgbGFiZWxUZXh0ID0gKChzdHlsZVsnbGFiZWwnXSkuc3BsaXQoXCJcXG5cIikpLmZpbHRlciggdGV4dCA9PiB0ZXh0ICE9PSAnJyk7XG4gICAgICAgIHZhciBmb250U2l6ZSA9IHBhcnNlRmxvYXQoc3R5bGVbJ2ZvbnQtc2l6ZSddLnN1YnN0cmluZygwLCBzdHlsZVsnZm9udC1zaXplJ10ubGVuZ3RoIC0gMikpO1xuICAgICAgICB2YXIgdG90YWxIZWlnaHQgPSBsYWJlbFRleHQubGVuZ3RoICogZm9udFNpemUgKyAyICogbWFyZ2luO1xuXG4gICAgICAgIFxuXG4gICAgICAgIHZhciBjb21wb3VuZEhlaWdodCA9IDA7XG4gICAgICAgIGlmKG5vZGUuaXNQYXJlbnQoKSl7XG4gICAgICAgICAgY29tcG91bmRIZWlnaHQgPSBub2RlLmNoaWxkcmVuKCkuYm91bmRpbmdCb3goKS5oO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLm1heCh0b3RhbEhlaWdodCwgZGVmYXVsdEhlaWdodC8yLCBsZWZ0SGVpZ2h0LCByaWdodEhlaWdodCwgY29tcG91bmRIZWlnaHQpO1xuICAgIH1cblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuaXNSZXNpemVkVG9Db250ZW50ID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIGlmKCFub2RlIHx8ICFub2RlLmlzTm9kZSgpIHx8ICFub2RlLmRhdGEoJ2Jib3gnKSl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy92YXIgdyA9IG5vZGUuZGF0YSgnYmJveCcpLnc7XG4gICAgICAvL3ZhciBoID0gbm9kZS5kYXRhKCdiYm94JykuaDtcbiAgICAgIHZhciB3ID0gbm9kZS53aWR0aCgpO1xuICAgICAgdmFyIGggPSBub2RlLmhlaWdodCgpO1xuXG4gICAgICB2YXIgbWluVyA9IGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluV2lkdGgobm9kZSk7XG4gICAgICB2YXIgbWluSCA9IGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluSGVpZ2h0KG5vZGUpO1xuXG4gICAgICBpZih3ID09PSBtaW5XICYmIGggPT09IG1pbkgpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gU2VjdGlvbiBFbmRcbiAgICAvLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xuXG4gICAgLy8gUmVsb2NhdGVzIHN0YXRlIGFuZCBpbmZvIGJveGVzLiBUaGlzIGZ1bmN0aW9uIGlzIGV4cGVjdGVkIHRvIGJlIGNhbGxlZCBhZnRlciBhZGQvcmVtb3ZlIHN0YXRlIGFuZCBpbmZvIGJveGVzXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZWxvY2F0ZVN0YXRlQW5kSW5mb3MgPSBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IChlbGUuaXNOb2RlICYmIGVsZS5pc05vZGUoKSkgPyBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSA6IGVsZTtcbiAgICAgIHZhciBsZW5ndGggPSBzdGF0ZUFuZEluZm9zLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChsZW5ndGggPT0gMSkge1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAobGVuZ3RoID09IDIpIHtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcblxuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDA7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gNTA7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChsZW5ndGggPT0gMykge1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IC0yNTtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG5cbiAgICAgICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAyNTtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XG5cbiAgICAgICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnggPSAwO1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcblxuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDI1O1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcblxuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IC0yNTtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnkgPSA1MDtcblxuICAgICAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueCA9IDI1O1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueSA9IDUwO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBDaGFuZ2Ugc3RhdGUgdmFsdWUgb3IgdW5pdCBvZiBpbmZvcm1hdGlvbiBib3ggb2YgZ2l2ZW4gbm9kZXMgd2l0aCBnaXZlbiBpbmRleC5cbiAgICAvLyBUeXBlIHBhcmFtZXRlciBpbmRpY2F0ZXMgd2hldGhlciB0byBjaGFuZ2UgdmFsdWUgb3IgdmFyaWFibGUsIGl0IGlzIHZhbGlkIGlmIHRoZSBib3ggYXQgdGhlIGdpdmVuIGluZGV4IGlzIGEgc3RhdGUgdmFyaWFibGUuXG4gICAgLy8gVmFsdWUgcGFyYW1ldGVyIGlzIHRoZSBuZXcgdmFsdWUgdG8gc2V0LlxuICAgIC8vIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIG9sZCB2YWx1ZSBvZiB0aGUgY2hhbmdlZCBkYXRhIChXZSBhc3N1bWUgdGhhdCB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgd2FzIHRoZSBzYW1lIGZvciBhbGwgbm9kZXMpLlxuICAgIC8vIEVhY2ggY2hhcmFjdGVyIGFzc3VtZWQgdG8gb2NjdXB5IDggdW5pdFxuICAgIC8vIEVhY2ggaW5mb2JveCBjYW4gaGF2ZSBhdCBtb3N0IDMyIHVuaXRzIG9mIHdpZHRoXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgc2JnbmNsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcbiAgICAgICAgdmFyIGJveCA9IHN0YXRlQW5kSW5mb3NbaW5kZXhdO1xuICAgICAgICB2YXIgb2xkTGVuZ3RoID0gYm94LmJib3gudztcbiAgICAgICAgdmFyIG5ld0xlbmd0aCA9IDA7XG5cbiAgICAgICAgdmFyIGNvbnRlbnQgPSAnJztcbiAgICAgICAgaWYgKGJveC5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHtcbiAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gYm94LnN0YXRlW3R5cGVdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJveC5zdGF0ZVt0eXBlXSA9IHZhbHVlO1xuICAgICAgICAgIGlmIChib3guc3RhdGVbXCJ2YWx1ZVwiXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb250ZW50ICs9IGJveC5zdGF0ZVtcInZhbHVlXCJdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYm94LnN0YXRlW1widmFyaWFibGVcIl0gIT09IHVuZGVmaW5lZCAmJiBib3guc3RhdGVbXCJ2YXJpYWJsZVwiXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb250ZW50ICs9IGJveC5zdGF0ZVtcInZhcmlhYmxlXCJdICsgXCJAXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYm94LmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7XG4gICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGJveC5sYWJlbC50ZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250ZW50ICs9IHZhbHVlO1xuICAgICAgICAgIGJveC5sYWJlbC50ZXh0ID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWluID0gKCBzYmduY2xhc3MgPT09ICdTSUYgbWFjcm9tb2xlY3VsZScgfHwgc2JnbmNsYXNzID09PSAnU0lGIHNpbXBsZSBjaGVtaWNhbCcgKSA/IDE1IDogMTI7XG4gICAgICAgIHZhciBmb250RmFtaWx5ID0gYm94LnN0eWxlWyAnZm9udC1mYW1pbHknIF07XG4gICAgICAgIHZhciBmb250U2l6ZSA9IGJveC5zdHlsZVsgJ2ZvbnQtc2l6ZScgXTtcbiAgICAgICAgdmFyIGJvcmRlcldpZHRoID0gYm94LnN0eWxlWyAnYm9yZGVyLXdpZHRoJyBdO1xuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICBtaW4sXG4gICAgICAgICAgbWF4OiA0OCxcbiAgICAgICAgICBtYXJnaW46IGJvcmRlcldpZHRoIC8gMiArIDAuNVxuICAgICAgICB9O1xuICAgICAgICB2YXIgcHJldmlvdXNXaWR0aCA9IGJveC5iYm94Lnc7XG4gICAgICAgIGJveC5iYm94LncgPSBlbGVtZW50VXRpbGl0aWVzLmdldFdpZHRoQnlDb250ZW50KCBjb250ZW50LCBmb250RmFtaWx5LCBmb250U2l6ZSwgb3B0cyApO1xuXG4gICAgICAgIGlmKGJveC5hbmNob3JTaWRlID09IFwidG9wXCIgfHwgYm94LmFuY2hvclNpZGUgPT0gXCJib3R0b21cIil7XG4gICAgICAgICAgdmFyIHVuaXRMYXlvdXQgPSBub2RlLmRhdGEoKVtcImF1eHVuaXRsYXlvdXRzXCJdW2JveC5hbmNob3JTaWRlXTtcbiAgICAgICAgICBpZih1bml0TGF5b3V0LnVuaXRzW3VuaXRMYXlvdXQudW5pdHMubGVuZ3RoLTFdLmlkID09IGJveC5pZCl7XG4gICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgYm9yZGVyV2lkdGggPSBub2RlLmRhdGEoKVsnYm9yZGVyLXdpZHRoJ107XG4gICAgICAgICAgICB2YXIgc2hpZnRBbW91bnQgPSAoKChib3guYmJveC53IC0gcHJldmlvdXNXaWR0aCkgLyAyKSAqIDEwMCApLyAobm9kZS5vdXRlcldpZHRoKCkgLSBib3JkZXJXaWR0aCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgaWYoc2hpZnRBbW91bnQgPj0gMCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYoYm94LmJib3gueCArIHNoaWZ0QW1vdW50IDw9IDEwMCl7XG4gICAgICAgICAgICAgICAgYm94LmJib3gueCA9IGJveC5iYm94LnggKyBzaGlmdEFtb3VudDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAvKiAgZWxzZXtcbiAgICAgICAgICAgICAgdmFyIHByZXZpb3VzSW5mb0Jib3ggPSB7eCA6IDAsIHc6MH07XG4gICAgICAgICAgICAgIGlmKHVuaXRMYXlvdXQudW5pdHMubGVuZ3RoID4gMSl7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNJbmZvQmJveD0gdW5pdExheW91dC51bml0c1t1bml0TGF5b3V0LnVuaXRzLmxlbmd0aC0yXS5iYm94OyAgICAgIFxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5BdXhVbml0TGF5b3V0LnNldElkZWFsR2FwKG5vZGUsIGJveC5hbmNob3JTaWRlKTtcbiAgICAgICAgICAgICAgdmFyIGlkZWFsR2FwID0gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuQXV4VW5pdExheW91dC5nZXRDdXJyZW50R2FwKGJveC5hbmNob3JTaWRlKTtcbiAgICAgICAgICAgICAgdmFyIG5ld1Bvc2l0aW9uID0gcHJldmlvdXNJbmZvQmJveC54ICsgKHByZXZpb3VzSW5mb0Jib3gudy8yICsgaWRlYWxHYXAgKyBib3guYmJveC53LzIpKjEwMCAvIChub2RlLm91dGVyV2lkdGgoKSAtIGJvcmRlcldpZHRoKTtcbiAgICAgICAgICAgICAgYm94LmJib3gueCA9IG5ld1Bvc2l0aW9uO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gKi9cbiAgICAgICAgICAgXG4gICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIC8qIGlmIChib3guYW5jaG9yU2lkZSA9PT0gXCJ0b3BcIiB8fCBib3guYW5jaG9yU2lkZSA9PT0gXCJib3R0b21cIikge1xuICAgICAgICAgIGJveC5iYm94LnggKz0gKGJveC5iYm94LncgLSBvbGRMZW5ndGgpIC8gMjtcbiAgICAgICAgICB2YXIgdW5pdHMgPSAobm9kZS5kYXRhKCdhdXh1bml0bGF5b3V0cycpW2JveC5hbmNob3JTaWRlXSkudW5pdHM7XG4gICAgICAgICAgdmFyIHNoaWZ0SW5kZXggPSAwO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5pdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmKHVuaXRzW2ldID09PSBib3gpe1xuICAgICAgICAgICAgICBzaGlmdEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAodmFyIGogPSBzaGlmdEluZGV4KzE7IGogPCB1bml0cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICB1bml0c1tqXS5iYm94LnggKz0gKGJveC5iYm94LncgLSBvbGRMZW5ndGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSAqL1xuXG4gICAgICB9XG5cbiAgICAgIC8vVE9ETyBmaW5kIGEgd2F5IHRvIGVsaW1hdGUgdGhpcyByZWR1bmRhbmN5IHRvIHVwZGF0ZSBpbmZvLWJveCBwb3NpdGlvbnNcbiAgICAgIG5vZGUuZGF0YSgnYm9yZGVyLXdpZHRoJywgbm9kZS5kYXRhKCdib3JkZXItd2lkdGgnKSk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8vIEFkZCBhIG5ldyBzdGF0ZSBvciBpbmZvIGJveCB0byBnaXZlbiBub2Rlcy5cbiAgICAvLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxuICAgIC8vIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBqdXN0IGFkZGVkIGJveC5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBvYmopIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIGxvY2F0aW9uT2JqO1xuXG4gICAgICAgIHZhciBkZWZhdWx0UHJvcHMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBub2RlLmRhdGEoJ2NsYXNzJykgKTtcbiAgICAgICAgdmFyIGluZm9ib3hQcm9wcyA9IGRlZmF1bHRQcm9wc1sgb2JqLmNsYXp6IF07XG4gICAgICAgIHZhciBiYm94ID0gb2JqLmJib3ggfHwgeyB3OiBpbmZvYm94UHJvcHMud2lkdGgsIGg6IGluZm9ib3hQcm9wcy5oZWlnaHQgfTsgICAgICAgIFxuICAgICAgICB2YXIgc3R5bGUgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRJbmZvYm94U3R5bGUoIG5vZGUuZGF0YSgnY2xhc3MnKSwgb2JqLmNsYXp6ICk7XG4gICAgICAgIGlmKG9iai5zdHlsZSl7XG4gICAgICAgICAgJC5leHRlbmQoIHN0eWxlLCBvYmouc3R5bGUgKTtcbiAgICAgICAgfVxuICAgICAgIFxuICAgICAgICBpZihvYmouY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcbiAgICAgICAgICBsb2NhdGlvbk9iaiA9IHNiZ252aXpJbnN0YW5jZS5jbGFzc2VzLlVuaXRPZkluZm9ybWF0aW9uLmNyZWF0ZShub2RlLCBjeSwgb2JqLmxhYmVsLnRleHQsIGJib3gsIG9iai5sb2NhdGlvbiwgb2JqLnBvc2l0aW9uLCBzdHlsZSwgb2JqLmluZGV4LCBvYmouaWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9iai5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHtcbiAgICAgICAgICBsb2NhdGlvbk9iaiA9IHNiZ252aXpJbnN0YW5jZS5jbGFzc2VzLlN0YXRlVmFyaWFibGUuY3JlYXRlKG5vZGUsIGN5LCBvYmouc3RhdGUudmFsdWUsIG9iai5zdGF0ZS52YXJpYWJsZSwgYmJveCwgb2JqLmxvY2F0aW9uLCBvYmoucG9zaXRpb24sIHN0eWxlLCBvYmouaW5kZXgsIG9iai5pZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsb2NhdGlvbk9iajtcbiAgICB9O1xuXG4gICAgLy8gUmVtb3ZlIHRoZSBzdGF0ZSBvciBpbmZvIGJveGVzIG9mIHRoZSBnaXZlbiBub2RlcyBhdCBnaXZlbiBpbmRleC5cbiAgICAvLyBSZXR1cm5zIHRoZSByZW1vdmVkIGJveC5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBsb2NhdGlvbk9iaikge1xuICAgICAgdmFyIG9iajtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgICAgIHZhciB1bml0ID0gc3RhdGVBbmRJbmZvc1tsb2NhdGlvbk9iai5pbmRleF07XG5cbiAgICAgICAgdmFyIHVuaXRDbGFzcyA9IHNiZ252aXpJbnN0YW5jZS5jbGFzc2VzLmdldEF1eFVuaXRDbGFzcyh1bml0KTtcblxuICAgICAgICBvYmogPSB1bml0Q2xhc3MucmVtb3ZlKHVuaXQsIGN5KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuXG5cbiAgICAvL1RpbGVzIGluZm9ybWF0aW9ucyBib3hlcyBmb3IgZ2l2ZW4gYW5jaG9yU2lkZXNcbiAgICBlbGVtZW50VXRpbGl0aWVzLmZpdFVuaXRzID0gZnVuY3Rpb24gKG5vZGUsIGxvY2F0aW9ucykge1xuICAgICAgdmFyIG9iaiA9IFtdO1xuICAgICAgbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmZvckVhY2goIGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgb2JqLnB1c2goe1xuICAgICAgICAgIHg6IGVsZS5iYm94LngsXG4gICAgICAgICAgeTogZWxlLmJib3gueSxcbiAgICAgICAgICBhbmNob3JTaWRlOiBlbGUuYW5jaG9yU2lkZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuQXV4VW5pdExheW91dC5maXRVbml0cyhub2RlLCBjeSwgbG9jYXRpb25zKTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcblxuICAgIC8vQ2hlY2sgd2hpY2ggYW5jaG9yc2lkZXMgZml0c1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hlY2tGaXQgPSBmdW5jdGlvbiAobm9kZSwgbG9jYXRpb24pIHsgLy9pZiBubyBsb2NhdGlvbiBnaXZlbiwgaXQgY2hlY2tzIGFsbCBwb3NzaWJsZSBsb2NhdGlvbnNcbiAgICAgIHJldHVybiBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5BdXhVbml0TGF5b3V0LmNoZWNrRml0KG5vZGUsIGN5LCBsb2NhdGlvbik7XG4gICAgfTtcblxuICAgIC8vTW9kaWZ5IGFycmF5IG9mIGF1eCBsYXlvdXQgdW5pdHNcbiAgICBlbGVtZW50VXRpbGl0aWVzLm1vZGlmeVVuaXRzID0gZnVuY3Rpb24gKG5vZGUsIHVuaXQsIGFuY2hvclNpZGUpIHtcbiAgICAgIHNiZ252aXpJbnN0YW5jZS5jbGFzc2VzLkF1eFVuaXRMYXlvdXQubW9kaWZ5VW5pdHMobm9kZSwgdW5pdCwgYW5jaG9yU2lkZSwgY3kpO1xuICAgIH07XG5cbiAgICAvLyBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbiAobm9kZXMsIHN0YXR1cykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgc2JnbmNsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xuICAgICAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XG5cbiAgICAgICAgaWYgKHN0YXR1cykgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyB0cnVlXG4gICAgICAgICAgaWYgKCFpc011bHRpbWVyKSB7XG4gICAgICAgICAgICBub2RlLmRhdGEoJ2NsYXNzJywgc2JnbmNsYXNzICsgJyBtdWx0aW1lcicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLy8gTWFrZSBtdWx0aW1lciBzdGF0dXMgZmFsc2VcbiAgICAgICAgICBpZiAoaXNNdWx0aW1lcikge1xuICAgICAgICAgICAgbm9kZS5kYXRhKCdjbGFzcycsIHNiZ25jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBlbGVtZW50cyB3aXRoIGdpdmVuIGZvbnQgZGF0YVxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAoZWxlcywgZGF0YSkge1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBkYXRhKSB7XG4gICAgICAgIGVsZXMuZGF0YShwcm9wLCBkYXRhW3Byb3BdKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBnZXRzIGFuIGVkZ2UsIGFuZCBlbmRzIG9mIHRoYXQgZWRnZSAoT3B0aW9uYWxseSBpdCBtYXkgdGFrZSBqdXN0IHRoZSBjbGFzc2VzIG9mIHRoZSBlZGdlIGFzIHdlbGwpIGFzIHBhcmFtZXRlcnMuXG4gICAgLy8gSXQgbWF5IHJldHVybiAndmFsaWQnICh0aGF0IGVuZHMgaXMgdmFsaWQgZm9yIHRoYXQgZWRnZSksICdyZXZlcnNlJyAodGhhdCBlbmRzIGlzIG5vdCB2YWxpZCBmb3IgdGhhdCBlZGdlIGJ1dCB0aGV5IHdvdWxkIGJlIHZhbGlkXG4gICAgLy8gaWYgeW91IHJldmVyc2UgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0KSwgJ2ludmFsaWQnICh0aGF0IGVuZHMgYXJlIHRvdGFsbHkgaW52YWxpZCBmb3IgdGhhdCBlZGdlKS5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzID0gZnVuY3Rpb24gKGVkZ2UsIHNvdXJjZSwgdGFyZ2V0KSB7XG4gICAgICAvLyBpZiBtYXAgdHlwZSBpcyBVbmtub3duIC0tIG5vIHJ1bGVzIGFwcGxpZWRcbiAgICAgIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSA9PSBcIkh5YnJpZEFueVwiIHx8IGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpID09IFwiSHlicmlkU2JnblwiIHx8ICFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSlcbiAgICAgICAgcmV0dXJuIFwidmFsaWRcIjtcblxuICAgICAgdmFyIGVkZ2VjbGFzcyA9IHR5cGVvZiBlZGdlID09PSAnc3RyaW5nJyA/IGVkZ2UgOiBlZGdlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICB2YXIgc291cmNlY2xhc3MgPSBzb3VyY2UuZGF0YSgnY2xhc3MnKTtcbiAgICAgIHZhciB0YXJnZXRjbGFzcyA9IHRhcmdldC5kYXRhKCdjbGFzcycpO1xuICAgICAgdmFyIG1hcFR5cGUgPSBlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKTtcbiAgICAgIHZhciBlZGdlQ29uc3RyYWludHMgPSBlbGVtZW50VXRpbGl0aWVzW21hcFR5cGVdLmNvbm5lY3Rpdml0eUNvbnN0cmFpbnRzW2VkZ2VjbGFzc107XG5cbiAgICAgIGlmIChtYXBUeXBlID09IFwiQUZcIil7XG4gICAgICAgIGlmIChzb3VyY2VjbGFzcy5zdGFydHNXaXRoKFwiQkFcIikpIC8vIHdlIGhhdmUgc2VwYXJhdGUgY2xhc3NlcyBmb3IgZWFjaCBiaW9sb2dpY2FsIGFjdGl2aXR5XG4gICAgICAgICAgc291cmNlY2xhc3MgPSBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjsgLy8gYnV0IHNhbWUgcnVsZSBhcHBsaWVzIHRvIGFsbCBvZiB0aGVtXG5cbiAgICAgICAgaWYgKHRhcmdldGNsYXNzLnN0YXJ0c1dpdGgoXCJCQVwiKSkgLy8gd2UgaGF2ZSBzZXBhcmF0ZSBjbGFzc2VzIGZvciBlYWNoIGJpb2xvZ2ljYWwgYWN0aXZpdHlcbiAgICAgICAgICB0YXJnZXRjbGFzcyA9IFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiOyAvLyBidXQgc2FtZSBydWxlIGFwcGxpZXMgdG8gYWxsIG9mIHRoZW1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKG1hcFR5cGUgPT0gXCJQRFwiKXtcbiAgICAgICAgc291cmNlY2xhc3MgPSBzb3VyY2VjbGFzcy5yZXBsYWNlKC9cXHMqbXVsdGltZXIkLywgJycpO1xuICAgICAgICB0YXJnZXRjbGFzcyA9IHRhcmdldGNsYXNzLnJlcGxhY2UoL1xccyptdWx0aW1lciQvLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGdpdmVuIGEgbm9kZSwgYWN0aW5nIGFzIHNvdXJjZSBvciB0YXJnZXQsIHJldHVybnMgYm9vbGVhbiB3ZXRoZXIgb3Igbm90IGl0IGhhcyB0b28gbWFueSBlZGdlcyBhbHJlYWR5XG4gICAgICBmdW5jdGlvbiBoYXNUb29NYW55RWRnZXMobm9kZSwgc291cmNlT3JUYXJnZXQpIHtcbiAgICAgICAgdmFyIG5vZGVjbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgICAgbm9kZWNsYXNzID0gbm9kZWNsYXNzLnJlcGxhY2UoL1xccyptdWx0aW1lciQvLCAnJyk7XG4gICAgICAgIGlmIChub2RlY2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKVxuICAgICAgICAgIG5vZGVjbGFzcyA9IFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiO1xuXG4gICAgICAgIHZhciB0b3RhbFRvb01hbnkgPSB0cnVlO1xuICAgICAgICB2YXIgZWRnZVRvb01hbnkgPSB0cnVlO1xuICAgICAgICBpZiAoc291cmNlT3JUYXJnZXQgPT0gXCJzb3VyY2VcIikge1xuICAgICAgICAgICAgdmFyIHNhbWVFZGdlQ291bnRPdXQgPSBub2RlLm91dGdvZXJzKCdlZGdlW2NsYXNzPVwiJytlZGdlY2xhc3MrJ1wiXScpLnNpemUoKTtcbiAgICAgICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudE91dCA9IG5vZGUub3V0Z29lcnMoJ2VkZ2UnKS5zaXplKCk7XG4gICAgICAgICAgICAvLyBjaGVjayB0aGF0IHRoZSB0b3RhbCBlZGdlIGNvdW50IGlzIHdpdGhpbiB0aGUgbGltaXRzXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzU291cmNlLm1heFRvdGFsID09ICd1bmRlZmluZWQnXG4gICAgICAgICAgICAgICAgfHwgdG90YWxFZGdlQ291bnRPdXQgPCBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhUb3RhbCApIHtcbiAgICAgICAgICAgICAgICB0b3RhbFRvb01hbnkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRoZW4gY2hlY2sgbGltaXRzIGZvciB0aGlzIHNwZWNpZmljIGVkZ2UgY2xhc3NcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4RWRnZSA9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgICAgIHx8IHNhbWVFZGdlQ291bnRPdXQgPCBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhFZGdlICkge1xuICAgICAgICAgICAgICAgIGVkZ2VUb29NYW55ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBvbmx5IG9uZSBvZiB0aGUgbGltaXRzIGlzIHJlYWNoZWQgdGhlbiBlZGdlIGlzIGludmFsaWRcbiAgICAgICAgICAgIHJldHVybiB0b3RhbFRvb01hbnkgfHwgZWRnZVRvb01hbnk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIG5vZGUgaXMgdXNlZCBhcyB0YXJnZXRcbiAgICAgICAgICAgIHZhciBzYW1lRWRnZUNvdW50SW4gPSBub2RlLmluY29tZXJzKCdlZGdlW2NsYXNzPVwiJytlZGdlY2xhc3MrJ1wiXScpLnNpemUoKTtcbiAgICAgICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudEluID0gbm9kZS5pbmNvbWVycygnZWRnZScpLnNpemUoKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNUYXJnZXQubWF4VG90YWwgPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICB8fCB0b3RhbEVkZ2VDb3VudEluIDwgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNUYXJnZXQubWF4VG90YWwgKSB7XG4gICAgICAgICAgICAgICAgdG90YWxUb29NYW55ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heEVkZ2UgPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICB8fCBzYW1lRWRnZUNvdW50SW4gPCBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1RhcmdldC5tYXhFZGdlICkge1xuICAgICAgICAgICAgICAgIGVkZ2VUb29NYW55ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdG90YWxUb29NYW55IHx8IGVkZ2VUb29NYW55O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaXNJbkNvbXBsZXgobm9kZSkge1xuICAgICAgICB2YXIgcGFyZW50Q2xhc3MgPSBub2RlLnBhcmVudCgpLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgIHJldHVybiBwYXJlbnRDbGFzcyAmJiBwYXJlbnRDbGFzcy5zdGFydHNXaXRoKCdjb21wbGV4Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0luQ29tcGxleChzb3VyY2UpIHx8IGlzSW5Db21wbGV4KHRhcmdldCkpIHsgLy8gc3VidW5pdHMgb2YgYSBjb21wbGV4IGFyZSBubyBsb25nZXIgRVBOcywgbm8gY29ubmVjdGlvbiBhbGxvd2VkXG4gICAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrIG5hdHVyZSBvZiBjb25uZWN0aW9uXG4gICAgICBpZiAoZWRnZUNvbnN0cmFpbnRzW3NvdXJjZWNsYXNzXS5hc1NvdXJjZS5pc0FsbG93ZWQgJiYgZWRnZUNvbnN0cmFpbnRzW3RhcmdldGNsYXNzXS5hc1RhcmdldC5pc0FsbG93ZWQpIHtcbiAgICAgICAgLy8gY2hlY2sgYW1vdW50IG9mIGNvbm5lY3Rpb25zXG4gICAgICAgIGlmICghaGFzVG9vTWFueUVkZ2VzKHNvdXJjZSwgXCJzb3VyY2VcIikgJiYgIWhhc1Rvb01hbnlFZGdlcyh0YXJnZXQsIFwidGFyZ2V0XCIpICkge1xuICAgICAgICAgIHJldHVybiAndmFsaWQnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyB0cnkgdG8gcmV2ZXJzZVxuICAgICAgaWYgKGVkZ2VDb25zdHJhaW50c1t0YXJnZXRjbGFzc10uYXNTb3VyY2UuaXNBbGxvd2VkICYmIGVkZ2VDb25zdHJhaW50c1tzb3VyY2VjbGFzc10uYXNUYXJnZXQuaXNBbGxvd2VkKSB7XG4gICAgICAgIGlmICghaGFzVG9vTWFueUVkZ2VzKHRhcmdldCwgXCJzb3VyY2VcIikgJiYgIWhhc1Rvb01hbnlFZGdlcyhzb3VyY2UsIFwidGFyZ2V0XCIpICkge1xuICAgICAgICAgIHJldHVybiAncmV2ZXJzZSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAnaW52YWxpZCc7XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gZWxlcy5yZW1vdmUoKTtcbiAgICAgIGlmICh0eXBlb2YgbGF5b3V0cGFyYW0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbGF5b3V0cGFyYW0oKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgYSBmdW5jdGlvbiBleGVjdXRlIGl0XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgICB2YXIgbGF5b3V0ID0gY3kubGF5b3V0KGxheW91dHBhcmFtKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgbGF5b3V0IG9wdGlvbnMgY2FsbCBsYXlvdXQgd2l0aCB0aGF0IG9wdGlvbnMuXG5cbiAgICAgICAgICAvLyBEbyB0aGlzIGNoZWNrIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgICAgICAgICAgICBsYXlvdXQucnVuKCk7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIEhpZGUgZ2l2ZW4gZWxlcyBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xuICAgICAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC5cbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmhpZGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGN5LnZpZXdVdGlsaXRpZXMoKS5oaWRlKGVsZXMpOyAvLyBIaWRlIGdpdmVuIGVsZXNcbiAgICAgICAgaWYgKHR5cGVvZiBsYXlvdXRwYXJhbSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbGF5b3V0cGFyYW0oKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgYSBmdW5jdGlvbiBleGVjdXRlIGl0XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgbGF5b3V0ID0gY3kubGF5b3V0KGxheW91dHBhcmFtKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgbGF5b3V0IG9wdGlvbnMgY2FsbCBsYXlvdXQgd2l0aCB0aGF0IG9wdGlvbnMuXG5cbiAgICAgICAgICAgIC8vIERvIHRoaXMgY2hlY2sgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4pIHtcbiAgICAgICAgICAgICAgICBsYXlvdXQucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIFVuaGlkZSBnaXZlbiBlbGVzIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXG4gICAgICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLlxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihlbGVzLCBsYXlvdXRwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IGN5LnZpZXdVdGlsaXRpZXMoKS5zaG93KGVsZXMpOyAvLyBTaG93IGdpdmVuIGVsZXNcbiAgICAgIGlmICh0eXBlb2YgbGF5b3V0cGFyYW0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbGF5b3V0cGFyYW0oKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgYSBmdW5jdGlvbiBleGVjdXRlIGl0XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIGxheW91dCA9IGN5LmxheW91dChsYXlvdXRwYXJhbSk7IC8vIElmIGxheW91dHBhcmFtIGlzIGxheW91dCBvcHRpb25zIGNhbGwgbGF5b3V0IHdpdGggdGhhdCBvcHRpb25zLlxuXG4gICAgICAgIC8vIERvIHRoaXMgY2hlY2sgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gICAgICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgICAgICAgIGxheW91dC5ydW4oKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIENoYW5nZSBzdHlsZS9jc3Mgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxuICAgICAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLlxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgICAgIGlmICggdHlwZW9mIHZhbHVlTWFwID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgZWxlID0gY3kuZ2V0RWxlbWVudEJ5SWQoZWxlc1tpXS5pZCgpKTtcbiAgICAgICAgICBlbGUuY3NzKG5hbWUsIHZhbHVlTWFwW2VsZS5pZCgpXSk7IC8vIHZhbHVlTWFwIGlzIGFuIGlkIHRvIHZhbHVlIG1hcCB1c2UgaXQgaW4gdGhpcyB3YXlcbiAgICAgICAgfVxuICAgICAgICBjeS5lbmRCYXRjaCgpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGVsZXMuY3NzKG5hbWUsIHZhbHVlTWFwKTsgLy8gdmFsdWVNYXAgaXMganVzdCBhIHN0cmluZyBzZXQgY3NzKCduYW1lJykgZm9yIGFsbCBlbGVzIHRvIHRoaXMgdmFsdWVcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gICAgICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgICAgIGlmICggdHlwZW9mIHZhbHVlTWFwID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgZWxlID0gY3kuZ2V0RWxlbWVudEJ5SWQoZWxlc1tpXS5pZCgpKTtcbiAgICAgICAgICBlbGUuZGF0YShuYW1lLCB2YWx1ZU1hcFtlbGUuaWQoKV0pOyAvLyB2YWx1ZU1hcCBpcyBhbiBpZCB0byB2YWx1ZSBtYXAgdXNlIGl0IGluIHRoaXMgd2F5XG4gICAgICAgIH1cbiAgICAgICAgY3kuZW5kQmF0Y2goKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVzLmRhdGEobmFtZSwgdmFsdWVNYXApOyAvLyB2YWx1ZU1hcCBpcyBqdXN0IGEgc3RyaW5nIHNldCBjc3MoJ25hbWUnKSBmb3IgYWxsIGVsZXMgdG8gdGhpcyB2YWx1ZVxuICAgICAgfVxuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZVNldEZpZWxkID0gZnVuY3Rpb24oZWxlLCBmaWVsZE5hbWUsIHRvRGVsZXRlLCB0b0FkZCwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBzZXQgPSBlbGUuZGF0YSggZmllbGROYW1lICk7XG4gICAgICBpZiAoICFzZXQgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciB1cGRhdGVzID0ge307XG5cbiAgICAgIGlmICggdG9EZWxldGUgIT0gbnVsbCAmJiBzZXRbIHRvRGVsZXRlIF0gKSB7XG4gICAgICAgIGRlbGV0ZSBzZXRbIHRvRGVsZXRlIF07XG4gICAgICAgIHVwZGF0ZXMuZGVsZXRlZCA9IHRvRGVsZXRlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIHRvQWRkICE9IG51bGwgKSB7XG4gICAgICAgIHNldFsgdG9BZGQgXSA9IHRydWU7XG4gICAgICAgIHVwZGF0ZXMuYWRkZWQgPSB0b0FkZDtcbiAgICAgIH1cblxuICAgICAgaWYgKCBjYWxsYmFjayAmJiAoIHVwZGF0ZXNbICdkZWxldGVkJyBdICE9IG51bGwgfHwgdXBkYXRlc1sgJ2FkZGVkJyBdICE9IG51bGwgKSApIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHVwZGF0ZXM7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogUmV0dXJuIHRoZSBzZXQgb2YgYWxsIG5vZGVzIHByZXNlbnQgdW5kZXIgdGhlIGdpdmVuIHBvc2l0aW9uXG4gICAgICogcmVuZGVyZWRQb3MgbXVzdCBiZSBhIHBvaW50IGRlZmluZWQgcmVsYXRpdmVseSB0byBjeXRvc2NhcGUgY29udGFpbmVyXG4gICAgICogKGxpa2UgcmVuZGVyZWRQb3NpdGlvbiBmaWVsZCBvZiBhIG5vZGUpXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5nZXROb2Rlc0F0ID0gZnVuY3Rpb24ocmVuZGVyZWRQb3MpIHtcbiAgICAgIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XG4gICAgICB2YXIgeCA9IHJlbmRlcmVkUG9zLng7XG4gICAgICB2YXIgeSA9IHJlbmRlcmVkUG9zLnk7XG4gICAgICB2YXIgcmVzdWx0Tm9kZXMgPSBbXTtcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgcmVuZGVyZWRCYm94ID0gbm9kZS5yZW5kZXJlZEJvdW5kaW5nQm94KHtcbiAgICAgICAgICBpbmNsdWRlTm9kZXM6IHRydWUsXG4gICAgICAgICAgaW5jbHVkZUVkZ2VzOiBmYWxzZSxcbiAgICAgICAgICBpbmNsdWRlTGFiZWxzOiBmYWxzZSxcbiAgICAgICAgICBpbmNsdWRlU2hhZG93czogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh4ID49IHJlbmRlcmVkQmJveC54MSAmJiB4IDw9IHJlbmRlcmVkQmJveC54Mikge1xuICAgICAgICAgIGlmICh5ID49IHJlbmRlcmVkQmJveC55MSAmJiB5IDw9IHJlbmRlcmVkQmJveC55Mikge1xuICAgICAgICAgICAgcmVzdWx0Tm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHROb2RlcztcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5kZW11bHRpbWVyaXplQ2xhc3MgPSBmdW5jdGlvbihzYmduY2xhc3MpIHtcbiAgICAgIHJldHVybiBzYmduY2xhc3MucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG1hcFR5cGUgLSB0eXBlIG9mIHRoZSBjdXJyZW50IG1hcCAoUEQsIEFGIG9yIFVua25vd24pXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlID0gZnVuY3Rpb24obWFwVHlwZSl7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLm1hcFR5cGUgPSBtYXBUeXBlO1xuICAgICAgcmV0dXJuIG1hcFR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIC0gbWFwIHR5cGVcbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5tYXBUeXBlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXNldHMgbWFwIHR5cGVcbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZSA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBLZWVwIGNvbnNpc3RlbmN5IG9mIGxpbmtzIHRvIHNlbGYgaW5zaWRlIHRoZSBkYXRhKCkgc3RydWN0dXJlLlxuICAgICAqIFRoaXMgaXMgbmVlZGVkIHdoZW5ldmVyIGEgbm9kZSBjaGFuZ2VzIHBhcmVudHMsIGZvciBleGFtcGxlLFxuICAgICAqIGFzIGl0IGlzIGRlc3Ryb3llZCBhbmQgcmVjcmVhdGVkLiBCdXQgdGhlIGRhdGEoKSBzdGF5cyBpZGVudGljYWwuXG4gICAgICogVGhpcyBjcmVhdGVzIGluY29uc2lzdGVuY2llcyBmb3IgdGhlIHBvaW50ZXJzIHN0b3JlZCBpbiBkYXRhKCksXG4gICAgICogYXMgdGhleSBub3cgcG9pbnQgdG8gYSBkZWxldGVkIG5vZGUuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXIgPSBmdW5jdGlvbiAoZWxlcykge1xuICAgICAgZWxlcy5ub2RlcygpLmZvckVhY2goZnVuY3Rpb24oZWxlKXtcbiAgICAgICAgLy8gcmVzdG9yZSBiYWNrZ3JvdW5kIGltYWdlc1xuICAgICAgICBlbGUuZW1pdCgnZGF0YScpO1xuXG4gICAgICAgIC8vIHNraXAgbm9kZXMgd2l0aG91dCBhbnkgYXV4aWxpYXJ5IHVuaXRzXG4gICAgICAgIGlmKCFlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSB8fCBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IodmFyIHNpZGUgaW4gZWxlLmRhdGEoJ2F1eHVuaXRsYXlvdXRzJykpIHtcbiAgICAgICAgICBlbGUuZGF0YSgnYXV4dW5pdGxheW91dHMnKVtzaWRlXS5wYXJlbnROb2RlID0gZWxlLmlkKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpW2ldLnBhcmVudCA9IGVsZS5pZCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmFueUhhc0JhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5nZXRCYWNrZ3JvdW5kSW1hZ2VPYmpzKGVsZXMpO1xuICAgICAgaWYob2JqID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGVsc2V7XG4gICAgICAgIGZvcih2YXIga2V5IGluIG9iail7XG4gICAgICAgICAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gICAgICAgICAgaWYodmFsdWUgJiYgISQuaXNFbXB0eU9iamVjdCh2YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5oYXNCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICBpZihlbGUuaXNOb2RlKCkpe1xuICAgICAgICB2YXIgYmcgPSBlbGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpID8gZWxlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKSA6IFwiXCI7XG4gICAgICAgIHZhciBjbG9uZUltZyA9ICdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCwlM0NzdmclMjB3aWR0aCUzRCUyMjEwMCUyMiUyMGhlaWdodCUzRCUyMjEwMCUyMiUyMHZpZXdCb3glM0QlMjIwJTIwMCUyMDEwMCUyMDEwMCUyMiUyMHN0eWxlJTNEJTIyZmlsbCUzQW5vbmUlM0JzdHJva2UlM0FibGFjayUzQnN0cm9rZS13aWR0aCUzQTAlM0IlMjIlMjB4bWxucyUzRCUyMmh0dHAlM0EvL3d3dy53My5vcmcvMjAwMC9zdmclMjIlMjAlM0UlM0NyZWN0JTIweCUzRCUyMjAlMjIlMjB5JTNEJTIyMCUyMiUyMHdpZHRoJTNEJTIyMTAwJTIyJTIwaGVpZ2h0JTNEJTIyMTAwJTIyJTIwc3R5bGUlM0QlMjJmaWxsJTNBJTIzYTlhOWE5JTIyLyUzRSUyMCUzQy9zdmclM0UnO1xuICAgICAgICBpZihiZyAhPT0gXCJcIiAmJiAhKGJnLmluZGV4T2YoY2xvbmVJbWcpID4gLTEgJiYgYmcgPT09IGNsb25lSW1nKSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuZ2V0QmFja2dyb3VuZEltYWdlVVJMID0gZnVuY3Rpb24gKGVsZXMpIHtcbiAgICAgIGlmKCFlbGVzIHx8IGVsZXMubGVuZ3RoIDwgMSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICB2YXIgY29tbW9uVVJMID0gXCJcIjtcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG5cbiAgICAgICAgaWYoIWVsZS5pc05vZGUoKSB8fCAhZWxlbWVudFV0aWxpdGllcy5oYXNCYWNrZ3JvdW5kSW1hZ2UoZWxlKSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIHVybCA9IGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykuc3BsaXQoXCIgXCIpLnBvcCgpO1xuICAgICAgICBpZighdXJsIHx8IHVybC5pbmRleE9mKCdodHRwJykgIT09IDAgfHwgKGNvbW1vblVSTCAhPT0gXCJcIiAmJiBjb21tb25VUkwgIT09IHVybCkpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBlbHNlIGlmKGNvbW1vblVSTCA9PT0gXCJcIilcbiAgICAgICAgICBjb21tb25VUkwgPSB1cmw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb21tb25VUkw7XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5nZXRCYWNrZ3JvdW5kSW1hZ2VPYmpzID0gZnVuY3Rpb24gKGVsZXMpIHtcbiAgICAgIGlmKCFlbGVzIHx8IGVsZXMubGVuZ3RoIDwgMSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICB2YXIgbGlzdCA9IHt9O1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgICAgdmFyIG9iaiA9IGdldEJnT2JqKGVsZSk7XG4gICAgICAgIGlmKG9iaiA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBsaXN0W2VsZS5kYXRhKCdpZCcpXSA9IG9iajtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsaXN0O1xuXG4gICAgICBmdW5jdGlvbiBnZXRCZ09iaiAoZWxlKSB7XG4gICAgICAgIGlmKGVsZS5pc05vZGUoKSAmJiBlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShlbGUpKXtcbiAgICAgICAgICB2YXIga2V5cyA9IFsnYmFja2dyb3VuZC1pbWFnZScsICdiYWNrZ3JvdW5kLWZpdCcsICdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknLFxuICAgICAgICAgICdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnLCAnYmFja2dyb3VuZC1wb3NpdGlvbi15JywgJ2JhY2tncm91bmQtaGVpZ2h0JywgJ2JhY2tncm91bmQtd2lkdGgnXTtcblxuICAgICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICAgIHZhciBhcnIgPSBlbGUuZGF0YShrZXkpO1xuICAgICAgICAgICAgb2JqW2tleV0gPSBhcnIgPyBhcnIgOiBcIlwiO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGVsZS5pc05vZGUoKSlcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5nZXRCYWNrZ3JvdW5kRml0T3B0aW9ucyA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgICBpZighZWxlcyB8fCBlbGVzLmxlbmd0aCA8IDEpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgdmFyIGNvbW1vbkZpdCA9IFwiXCI7XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBub2RlID0gZWxlc1tpXTtcbiAgICAgICAgaWYoIW5vZGUuaXNOb2RlKCkpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHZhciBmaXQgPSBnZXRGaXRPcHRpb24obm9kZSk7XG4gICAgICAgIGlmKCFmaXQgfHwgKGNvbW1vbkZpdCAhPT0gXCJcIiAmJiBmaXQgIT09IGNvbW1vbkZpdCkpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBlbHNlIGlmKGNvbW1vbkZpdCA9PT0gXCJcIilcbiAgICAgICAgICBjb21tb25GaXQgPSBmaXQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcHRpb25zID0gJzxvcHRpb24gdmFsdWU9XCJub25lXCI+Tm9uZTwvb3B0aW9uPidcbiAgICAgICAgICAgICAgICAgICsgJzxvcHRpb24gdmFsdWU9XCJmaXRcIj5GaXQ8L29wdGlvbj4nXG4gICAgICAgICAgICAgICAgICArICc8b3B0aW9uIHZhbHVlPVwiY292ZXJcIj5Db3Zlcjwvb3B0aW9uPidcbiAgICAgICAgICAgICAgICAgICsgJzxvcHRpb24gdmFsdWU9XCJjb250YWluXCI+Q29udGFpbjwvb3B0aW9uPic7XG4gICAgICB2YXIgc2VhcmNoS2V5ID0gJ3ZhbHVlPVwiJyArIGNvbW1vbkZpdCArICdcIic7XG4gICAgICB2YXIgaW5kZXggPSBvcHRpb25zLmluZGV4T2Yoc2VhcmNoS2V5KSArIHNlYXJjaEtleS5sZW5ndGg7XG4gICAgICByZXR1cm4gb3B0aW9ucy5zdWJzdHIoMCwgaW5kZXgpICsgJyBzZWxlY3RlZCcgKyBvcHRpb25zLnN1YnN0cihpbmRleCk7XG5cbiAgICAgIGZ1bmN0aW9uIGdldEZpdE9wdGlvbihub2RlKSB7XG4gICAgICAgIGlmKCFlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShub2RlKSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGYgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0Jyk7XG4gICAgICAgIHZhciBoID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWhlaWdodCcpO1xuXG4gICAgICAgIGlmKCFmIHx8ICFoKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBmID0gZi5zcGxpdChcIiBcIik7XG4gICAgICAgIGggPSBoLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgaWYoZltmLmxlbmd0aC0xXSA9PT0gXCJub25lXCIpXG4gICAgICAgICAgcmV0dXJuIChoW2gubGVuZ3RoLTFdID09PSBcImF1dG9cIiA/IFwibm9uZVwiIDogXCJmaXRcIik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gZltmLmxlbmd0aC0xXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChub2RlcywgYmdPYmopIHtcbiAgICAgIGlmKCFub2RlcyB8fCBub2Rlcy5sZW5ndGggPT0gMCB8fCAhYmdPYmopXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIG9iaiA9IGJnT2JqW25vZGUuZGF0YSgnaWQnKV07XG4gICAgICAgIGlmKCFvYmogfHwgJC5pc0VtcHR5T2JqZWN0KG9iaikpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgdmFyIGltZ3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeFBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeVBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgd2lkdGhzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKS5zcGxpdChcIiBcIikgOiBbXTtcbiAgICAgICAgdmFyIGhlaWdodHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciBmaXRzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgb3BhY2l0aWVzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSA/IChcIlwiICsgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSkuc3BsaXQoXCIgXCIpIDogW107XG5cbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XG4gICAgICAgIGlmKHR5cGVvZiBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgICBpbmRleCA9IGltZ3MuaW5kZXhPZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSk7XG4gICAgICAgIGVsc2UgaWYoQXJyYXkuaXNBcnJheShvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSkpXG4gICAgICAgICAgaW5kZXggPSBpbWdzLmluZGV4T2Yob2JqWydiYWNrZ3JvdW5kLWltYWdlJ11bMF0pO1xuXG4gICAgICAgIGlmKGluZGV4IDwgMClcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSAmJiBpbWdzLmxlbmd0aCA+IGluZGV4KXtcbiAgICAgICAgICB2YXIgdG1wID0gaW1nc1tpbmRleF07XG4gICAgICAgICAgaW1nc1tpbmRleF0gPSBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXTtcbiAgICAgICAgICBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtZml0J10gJiYgZml0cy5sZW5ndGggPiBpbmRleCl7XG4gICAgICAgICAgdmFyIHRtcCA9IGZpdHNbaW5kZXhdO1xuICAgICAgICAgIGZpdHNbaW5kZXhdID0gb2JqWydiYWNrZ3JvdW5kLWZpdCddO1xuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC1maXQnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtd2lkdGgnXSAmJiB3aWR0aHMubGVuZ3RoID4gaW5kZXgpe1xuICAgICAgICAgIHZhciB0bXAgPSB3aWR0aHNbaW5kZXhdO1xuICAgICAgICAgIHdpZHRoc1tpbmRleF0gPSBvYmpbJ2JhY2tncm91bmQtd2lkdGgnXTtcbiAgICAgICAgICBvYmpbJ2JhY2tncm91bmQtd2lkdGgnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtaGVpZ2h0J10gJiYgaGVpZ2h0cy5sZW5ndGggPiBpbmRleCl7XG4gICAgICAgICAgdmFyIHRtcCA9IGhlaWdodHNbaW5kZXhdO1xuICAgICAgICAgIGhlaWdodHNbaW5kZXhdID0gb2JqWydiYWNrZ3JvdW5kLWhlaWdodCddO1xuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC1oZWlnaHQnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teCddICYmIHhQb3MubGVuZ3RoID4gaW5kZXgpe1xuICAgICAgICAgIHZhciB0bXAgPSB4UG9zW2luZGV4XTtcbiAgICAgICAgICB4UG9zW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1wb3NpdGlvbi14J107XG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teSddICYmIHlQb3MubGVuZ3RoID4gaW5kZXgpe1xuICAgICAgICAgIHZhciB0bXAgPSB5UG9zW2luZGV4XTtcbiAgICAgICAgICB5UG9zW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1wb3NpdGlvbi15J107XG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXknXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eSddICYmIG9wYWNpdGllcy5sZW5ndGggPiBpbmRleCl7XG4gICAgICAgICAgdmFyIHRtcCA9IG9wYWNpdGllc1tpbmRleF07XG4gICAgICAgICAgb3BhY2l0aWVzW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5J107XG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknXSA9IHRtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScsIGltZ3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcsIHhQb3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScsIHlQb3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnLCB3aWR0aHMuam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JywgaGVpZ2h0cy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1maXQnLCBmaXRzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknLCBvcGFjaXRpZXMuam9pbihcIiBcIikpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYmdPYmo7XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAobm9kZXMsIG9sZEltZywgbmV3SW1nLCBmaXJzdFRpbWUsIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpIHtcbiAgICAgIGlmKCFub2RlcyB8fCBub2Rlcy5sZW5ndGggPT0gMCB8fCAhb2xkSW1nIHx8ICFuZXdJbWcpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIG9sZEltZyk7XG4gICAgICBmb3IodmFyIGtleSBpbiBuZXdJbWcpe1xuICAgICAgICBuZXdJbWdba2V5XVsnZmlyc3RUaW1lJ10gPSBmaXJzdFRpbWU7XG4gICAgICB9XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEJhY2tncm91bmRJbWFnZShub2RlcywgbmV3SW1nLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBvbGRJbWc6IG5ld0ltZyxcbiAgICAgICAgbmV3SW1nOiBvbGRJbWcsXG4gICAgICAgIGZpcnN0VGltZTogZmFsc2UsXG4gICAgICAgIHByb21wdEludmFsaWRJbWFnZTogcHJvbXB0SW52YWxpZEltYWdlLFxuICAgICAgICB2YWxpZGF0ZVVSTDogdmFsaWRhdGVVUkxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQWRkIGEgYmFja2dyb3VuZCBpbWFnZSB0byBnaXZlbiBub2Rlcy5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChub2RlcywgYmdPYmosIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpIHtcbiAgICAgIGlmKCFub2RlcyB8fCBub2Rlcy5sZW5ndGggPT0gMCB8fCAhYmdPYmopXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIG9iaiA9IGJnT2JqW25vZGUuZGF0YSgnaWQnKV07XG4gICAgICAgIGlmKCFvYmogfHwgJC5pc0VtcHR5T2JqZWN0KG9iaikpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgLy8gTG9hZCB0aGUgaW1hZ2UgZnJvbSBsb2NhbCwgZWxzZSBqdXN0IHB1dCB0aGUgVVJMXG4gICAgICAgIGlmKG9ialsnZnJvbUZpbGUnXSlcbiAgICAgICAgbG9hZEJhY2tncm91bmRUaGVuQXBwbHkobm9kZSwgb2JqKTtcbiAgICAgICAgLy8gVmFsaWRpdHkgb2YgZ2l2ZW4gVVJMIHNob3VsZCBiZSBjaGVja2VkIGJlZm9yZSBhcHBseWluZyBpdFxuICAgICAgICBlbHNlIGlmKG9ialsnZmlyc3RUaW1lJ10pe1xuICAgICAgICAgIGlmKHR5cGVvZiB2YWxpZGF0ZVVSTCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIHZhbGlkYXRlVVJMKG5vZGUsIG9iaiwgYXBwbHlCYWNrZ3JvdW5kLCBwcm9tcHRJbnZhbGlkSW1hZ2UpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNoZWNrR2l2ZW5VUkwobm9kZSwgb2JqKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXBwbHlCYWNrZ3JvdW5kKG5vZGUsIG9iaik7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGxvYWRCYWNrZ3JvdW5kVGhlbkFwcGx5KG5vZGUsIGJnT2JqKSB7XG4gICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICB2YXIgaW1nRmlsZSA9IGJnT2JqWydiYWNrZ3JvdW5kLWltYWdlJ107XG5cbiAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBnaXZlbiBmaWxlIGlzIGFuIGltYWdlIGZpbGVcbiAgICAgICAgaWYoaW1nRmlsZS50eXBlLmluZGV4T2YoXCJpbWFnZVwiKSAhPT0gMCl7XG4gICAgICAgICAgaWYocHJvbXB0SW52YWxpZEltYWdlKVxuICAgICAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlKFwiSW52YWxpZCBpbWFnZSBmaWxlIGlzIGdpdmVuIVwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbWdGaWxlKTtcblxuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgaW1nID0gcmVhZGVyLnJlc3VsdDtcbiAgICAgICAgICBpZihpbWcpe1xuICAgICAgICAgICAgYmdPYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSA9IGltZztcbiAgICAgICAgICAgIGJnT2JqWydmcm9tRmlsZSddID0gZmFsc2U7XG4gICAgICAgICAgICBhcHBseUJhY2tncm91bmQobm9kZSwgYmdPYmopO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgaWYocHJvbXB0SW52YWxpZEltYWdlKVxuICAgICAgICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2UoXCJHaXZlbiBmaWxlIGNvdWxkIG5vdCBiZSByZWFkIVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNoZWNrR2l2ZW5VUkwobm9kZSwgYmdPYmope1xuICAgICAgICB2YXIgdXJsID0gYmdPYmpbJ2JhY2tncm91bmQtaW1hZ2UnXTtcbiAgICAgICAgdmFyIGV4dGVuc2lvbiA9ICh1cmwuc3BsaXQoL1s/I10vKVswXSkuc3BsaXQoXCIuXCIpLnBvcCgpO1xuICAgICAgICB2YXIgdmFsaWRFeHRlbnNpb25zID0gW1wicG5nXCIsIFwic3ZnXCIsIFwianBnXCIsIFwianBlZ1wiXTtcblxuICAgICAgICBpZighdmFsaWRFeHRlbnNpb25zLmluY2x1ZGVzKGV4dGVuc2lvbikpe1xuICAgICAgICAgIGlmKHR5cGVvZiBwcm9tcHRJbnZhbGlkSW1hZ2UgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2UoXCJJbnZhbGlkIFVSTCBpcyBnaXZlbiFcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXN1bHQsIHN0YXR1cywgeGhyKXtcbiAgICAgICAgICAgIGFwcGx5QmFja2dyb3VuZChub2RlLCBiZ09iaik7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycm9yKXtcbiAgICAgICAgICAgIGlmKHByb21wdEludmFsaWRJbWFnZSlcbiAgICAgICAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlKFwiSW52YWxpZCBVUkwgaXMgZ2l2ZW4hXCIpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcHBseUJhY2tncm91bmQobm9kZSwgYmdPYmopIHtcblxuICAgICAgICBpZihlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShub2RlKSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGltZ3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeFBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeVBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgd2lkdGhzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKS5zcGxpdChcIiBcIikgOiBbXTtcbiAgICAgICAgdmFyIGhlaWdodHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciBmaXRzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgb3BhY2l0aWVzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSA/IChcIlwiICsgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSkuc3BsaXQoXCIgXCIpIDogW107XG5cbiAgICAgICAgdmFyIGluZGV4VG9JbnNlcnQgPSBpbWdzLmxlbmd0aDtcblxuICAgICAgICAvLyBpbnNlcnQgdG8gbGVuZ3RoLTFcbiAgICAgICAgaWYoaGFzQ2xvbmVNYXJrZXIobm9kZSwgaW1ncykpe1xuICAgICAgICAgIGluZGV4VG9JbnNlcnQtLTtcbiAgICAgICAgfVxuXG4gICAgICAgIGltZ3Muc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLWltYWdlJ10pO1xuICAgICAgICBmaXRzLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1maXQnXSk7XG4gICAgICAgIG9wYWNpdGllcy5zcGxpY2UoaW5kZXhUb0luc2VydCwgMCwgYmdPYmpbJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eSddKTtcbiAgICAgICAgeFBvcy5zcGxpY2UoaW5kZXhUb0luc2VydCwgMCwgYmdPYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teCddKTtcbiAgICAgICAgeVBvcy5zcGxpY2UoaW5kZXhUb0luc2VydCwgMCwgYmdPYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teSddKTtcbiAgICAgICAgd2lkdGhzLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC13aWR0aCddKTtcbiAgICAgICAgaGVpZ2h0cy5zcGxpY2UoaW5kZXhUb0luc2VydCwgMCwgYmdPYmpbJ2JhY2tncm91bmQtaGVpZ2h0J10pO1xuXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScsIGltZ3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcsIHhQb3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScsIHlQb3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnLCB3aWR0aHMuam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JywgaGVpZ2h0cy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1maXQnLCBmaXRzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknLCBvcGFjaXRpZXMuam9pbihcIiBcIikpO1xuICAgICAgICBiZ09ialsnZmlyc3RUaW1lJ10gPSBmYWxzZTtcblxuICAgICAgICBpZih1cGRhdGVJbmZvKVxuICAgICAgICAgIHVwZGF0ZUluZm8oKTtcblxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYXNDbG9uZU1hcmtlcihub2RlLCBpbWdzKXtcbiAgICAgICAgdmFyIGNsb25lSW1nID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LCUzQ3N2ZyUyMHdpZHRoJTNEJTIyMTAwJTIyJTIwaGVpZ2h0JTNEJTIyMTAwJTIyJTIwdmlld0JveCUzRCUyMjAlMjAwJTIwMTAwJTIwMTAwJTIyJTIwc3R5bGUlM0QlMjJmaWxsJTNBbm9uZSUzQnN0cm9rZSUzQWJsYWNrJTNCc3Ryb2tlLXdpZHRoJTNBMCUzQiUyMiUyMHhtbG5zJTNEJTIyaHR0cCUzQS8vd3d3LnczLm9yZy8yMDAwL3N2ZyUyMiUyMCUzRSUzQ3JlY3QlMjB4JTNEJTIyMCUyMiUyMHklM0QlMjIwJTIyJTIwd2lkdGglM0QlMjIxMDAlMjIlMjBoZWlnaHQlM0QlMjIxMDAlMjIlMjBzdHlsZSUzRCUyMmZpbGwlM0ElMjNhOWE5YTklMjIvJTNFJTIwJTNDL3N2ZyUzRSc7XG4gICAgICAgIHJldHVybiAoaW1ncy5pbmRleE9mKGNsb25lSW1nKSA+IC0xKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gUmVtb3ZlIGEgYmFja2dyb3VuZCBpbWFnZSBmcm9tIGdpdmVuIG5vZGVzLlxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKG5vZGVzLCBiZ09iaikge1xuICAgICAgaWYoIW5vZGVzIHx8IG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFiZ09iailcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgb2JqID0gYmdPYmpbbm9kZS5kYXRhKCdpZCcpXTtcbiAgICAgICAgaWYoIW9iailcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICB2YXIgaW1ncyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciB4UG9zID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciB5UG9zID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciB3aWR0aHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgaGVpZ2h0cyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnKS5zcGxpdChcIiBcIikgOiBbXTtcbiAgICAgICAgdmFyIGZpdHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciBvcGFjaXRpZXMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScpID8gKFwiXCIgKyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScpKS5zcGxpdChcIiBcIikgOiBbXTtcblxuICAgICAgICB2YXIgaW5kZXggPSAtMTtcbiAgICAgICAgaWYodHlwZW9mIG9ialsnYmFja2dyb3VuZC1pbWFnZSddID09PSBcInN0cmluZ1wiKVxuICAgICAgICAgIGluZGV4ID0gaW1ncy5pbmRleE9mKG9ialsnYmFja2dyb3VuZC1pbWFnZSddKTtcbiAgICAgICAgZWxzZSBpZihBcnJheS5pc0FycmF5KG9ialsnYmFja2dyb3VuZC1pbWFnZSddKSlcbiAgICAgICAgICBpbmRleCA9IGltZ3MuaW5kZXhPZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXVswXSk7XG5cbiAgICAgICAgaWYoaW5kZXggPiAtMSl7XG4gICAgICAgICAgaW1ncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIGZpdHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICBvcGFjaXRpZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICB4UG9zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgeVBvcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIHdpZHRocy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIGhlaWdodHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScsIGltZ3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcsIHhQb3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScsIHlQb3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnLCB3aWR0aHMuam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JywgaGVpZ2h0cy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1maXQnLCBmaXRzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknLCBvcGFjaXRpZXMuam9pbihcIiBcIikpO1xuICAgICAgICBiZ09ialsnZmlyc3RUaW1lJ10gPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZXZlcnNlRWRnZSA9IGZ1bmN0aW9uKGVkZ2Upe1xuICAgICAgdmFyIG9sZFNvdXJjZSA9IGVkZ2Uuc291cmNlKCkuaWQoKTtcbiAgICAgIHZhciBvbGRUYXJnZXQgPSBlZGdlLnRhcmdldCgpLmlkKCk7XG4gICAgICB2YXIgb2xkUG9ydFNvdXJjZSA9IGVkZ2UuZGF0YShcInBvcnRzb3VyY2VcIik7XG4gICAgICB2YXIgb2xkUG9ydFRhcmdldCA9IGVkZ2UuZGF0YShcInBvcnR0YXJnZXRcIik7XG4gICAgICB2YXIgc2VnbWVudFBvaW50cyA9IGVkZ2Uuc2VnbWVudFBvaW50cygpO1xuICAgICAgdmFyIGNvbnRyb2xQb2ludHMgPSBlZGdlLmNvbnRyb2xQb2ludHMoKTtcblxuICAgICAgZWRnZS5kYXRhKCkuc291cmNlID0gb2xkVGFyZ2V0O1xuICAgICAgZWRnZS5kYXRhKCkudGFyZ2V0ID0gb2xkU291cmNlO1xuICAgICAgZWRnZS5kYXRhKCkucG9ydHNvdXJjZSA9IG9sZFBvcnRUYXJnZXQ7XG4gICAgICBlZGdlLmRhdGEoKS5wb3J0dGFyZ2V0ID0gb2xkUG9ydFNvdXJjZTtcbiAgICAgICBlZGdlID0gZWRnZS5tb3ZlKHtcbiAgICAgICAgIHRhcmdldDogb2xkU291cmNlLFxuICAgICAgICAgc291cmNlIDogb2xkVGFyZ2V0ICAgICAgICBcbiAgICAgIH0pO1xuXG4gICAgICBpZihBcnJheS5pc0FycmF5KHNlZ21lbnRQb2ludHMpKXtcbiAgICAgICAgc2VnbWVudFBvaW50cy5yZXZlcnNlKCk7XG4gICAgICAgIGVkZ2UuZGF0YSgpLmJlbmRQb2ludFBvc2l0aW9ucyA9IHNlZ21lbnRQb2ludHM7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoY29udHJvbFBvaW50cykpIHtcbiAgICAgICAgICBjb250cm9sUG9pbnRzLnJldmVyc2UoKTtcbiAgICAgICAgICBlZGdlLmRhdGEoKS5jb250cm9sUG9pbnRQb3NpdGlvbnMgPSBjb250cm9sUG9pbnRzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlZGdlRWRpdGluZyA9IGN5LmVkZ2VFZGl0aW5nKCdnZXQnKTtcbiAgICAgICAgZWRnZUVkaXRpbmcuaW5pdEFuY2hvclBvaW50cyhlZGdlKTtcbiAgICAgIH1cbiAgICBcblxuICAgICAgcmV0dXJuIGVkZ2U7XG4gICAgfVxuXG4gIH1cblxuICByZXR1cm4gZWxlbWVudFV0aWxpdGllc0V4dGVuZGVyO1xufTtcbiIsIi8qIFxuICogVXRpbGl0eSBmaWxlIHRvIGdldCBhbmQgc2V0IHRoZSBsaWJyYXJpZXMgdG8gd2hpY2ggc2JnbnZpeiBpcyBkZXBlbmRlbnQgZnJvbSBhbnkgZmlsZS5cbiAqL1xuXG52YXIgbGliVXRpbGl0aWVzID0gZnVuY3Rpb24oKXtcbn07XG5cbmxpYlV0aWxpdGllcy5zZXRMaWJzID0gZnVuY3Rpb24obGlicykge1xuICB0aGlzLmxpYnMgPSBsaWJzO1xufTtcblxubGliVXRpbGl0aWVzLmdldExpYnMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMubGlicztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbGliVXRpbGl0aWVzOyIsInZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xuXG4vKlxuICogVGhlIG1haW4gdXRpbGl0aWVzIHRvIGJlIGV4cG9zZWQgZGlyZWN0bHkuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBlbGVtZW50VXRpbGl0aWVzLCBvcHRpb25zLCBjeSwgc2JnbnZpekluc3RhbmNlO1xuXG4gIGZ1bmN0aW9uIG1haW5VdGlsaXRpZXMgKHBhcmFtKSB7XG4gICAgZWxlbWVudFV0aWxpdGllcyA9IHBhcmFtLmVsZW1lbnRVdGlsaXRpZXM7XG4gICAgb3B0aW9ucyA9IHBhcmFtLm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XG4gICAgY3kgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0Q3koKTtcbiAgICBzYmdudml6SW5zdGFuY2UgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0SW5zdGFuY2UoKTtcbiAgfTtcblxuICAvKlxuICAgKiBBZGRzIGEgbmV3IG5vZGUgd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlcy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uKHgsIHkgLCBub2RlUGFyYW1zLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBtYXAgdHlwZVxuICAgIGlmICh0eXBlb2Ygbm9kZVBhcmFtcyA9PSAnb2JqZWN0Jyl7XG4vKiBcbiAgICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkpXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShub2RlUGFyYW1zLmxhbmd1YWdlKTtcbiAgICAgIGVsc2UgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpICE9IG5vZGVQYXJhbXMubGFuZ3VhZ2UpXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShcIlVua25vd25cIik7ICovXG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHgsIHksIG5vZGVQYXJhbXMsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgbmV3Tm9kZSA6IHtcbiAgICAgICAgICB4OiB4LFxuICAgICAgICAgIHk6IHksXG4gICAgICAgICAgY2xhc3M6IG5vZGVQYXJhbXMsXG4gICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgIHBhcmVudDogcGFyZW50LFxuICAgICAgICAgIHZpc2liaWxpdHk6IHZpc2liaWxpdHlcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZE5vZGVcIiwgcGFyYW0pO1xuICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBBZGRzIGEgbmV3IGVkZ2Ugd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGhhdmluZyB0aGUgZ2l2ZW4gc291cmNlIGFuZCB0YXJnZXQgaWRzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5hZGRFZGdlID0gZnVuY3Rpb24oc291cmNlLCB0YXJnZXQsIGVkZ2VQYXJhbXMsIGludmFsaWRFZGdlQ2FsbGJhY2ssIGlkLCB2aXNpYmlsaXR5KSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBtYXAgdHlwZVxuICAgIGlmICh0eXBlb2YgZWRnZVBhcmFtcyA9PSAnb2JqZWN0Jyl7XG5cbiAgICAgLyogIGlmICghZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkpXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShlZGdlUGFyYW1zLmxhbmd1YWdlKTtcbiAgICAgIGVsc2UgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpICE9IGVkZ2VQYXJhbXMubGFuZ3VhZ2UpXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShcIkh5YnJpZEFueVwiKTsgKi9cbiAgICB9XG4gICAgLy8gR2V0IHRoZSB2YWxpZGF0aW9uIHJlc3VsdFxuICAgIHZhciBlZGdlY2xhc3MgPSBlZGdlUGFyYW1zLmNsYXNzID8gZWRnZVBhcmFtcy5jbGFzcyA6IGVkZ2VQYXJhbXM7XG4gICAgdmFyIHZhbGlkYXRpb24gPSBlbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzKGVkZ2VjbGFzcywgY3kuZ2V0RWxlbWVudEJ5SWQoc291cmNlKSwgY3kuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KSk7XG5cbiAgICAvLyBJZiB2YWxpZGF0aW9uIHJlc3VsdCBpcyAnaW52YWxpZCcgY2FuY2VsIHRoZSBvcGVyYXRpb25cbiAgICBpZiAodmFsaWRhdGlvbiA9PT0gJ2ludmFsaWQnKSB7XG4gICAgICBpZih0eXBlb2YgaW52YWxpZEVkZ2VDYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgaW52YWxpZEVkZ2VDYWxsYmFjaygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdyZXZlcnNlJyByZXZlcnNlIHRoZSBzb3VyY2UtdGFyZ2V0IHBhaXIgYmVmb3JlIGNyZWF0aW5nIHRoZSBlZGdlXG4gICAgaWYgKHZhbGlkYXRpb24gPT09ICdyZXZlcnNlJykge1xuICAgICAgdmFyIHRlbXAgPSBzb3VyY2U7XG4gICAgICBzb3VyY2UgPSB0YXJnZXQ7XG4gICAgICB0YXJnZXQgPSB0ZW1wO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2UsIHRhcmdldCwgZWRnZVBhcmFtcywgaWQsIHZpc2liaWxpdHkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgbmV3RWRnZSA6IHtcbiAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICBjbGFzczogZWRnZVBhcmFtcyxcbiAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJpbGl0eVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgcmVzdWx0ID0gY3kudW5kb1JlZG8oKS5kbyhcImFkZEVkZ2VcIiwgcGFyYW0pO1xuICAgICAgcmV0dXJuIHJlc3VsdC5lbGVzO1xuICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBBZGRzIGEgcHJvY2VzcyB3aXRoIGNvbnZlbmllbnQgZWRnZXMuIEZvciBtb3JlIGluZm9ybWF0aW9uIHBsZWFzZSBzZWUgJ2h0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvbmV3dC9pc3N1ZXMvOScuXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24oX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgc291cmNlIGFuZCB0YXJnZXQgSURzIGFyZSBnaXZlbiBnZXQgdGhlIGVsZW1lbnRzIGJ5IElEc1xuICAgIHZhciBzb3VyY2UgPSB0eXBlb2YgX3NvdXJjZSA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfc291cmNlKSA6IF9zb3VyY2U7XG4gICAgdmFyIHRhcmdldCA9IHR5cGVvZiBfdGFyZ2V0ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF90YXJnZXQpIDogX3RhcmdldDtcblxuICAgIC8vIElmIHNvdXJjZSBvciB0YXJnZXQgZG9lcyBub3QgaGF2ZSBhbiBFUE4gY2xhc3MgdGhlIG9wZXJhdGlvbiBpcyBub3QgdmFsaWRcbiAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyhzb3VyY2UpIHx8ICFlbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3ModGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMoX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgc291cmNlOiBfc291cmNlLFxuICAgICAgICB0YXJnZXQ6IF90YXJnZXQsXG4gICAgICAgIHByb2Nlc3NUeXBlOiBwcm9jZXNzVHlwZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzXCIsIHBhcmFtKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gY29udmVydCBjb2xsYXBzZWQgY29tcG91bmQgbm9kZXMgdG8gc2ltcGxlIG5vZGVzXG4gIC8vIGFuZCB1cGRhdGUgcG9ydCB2YWx1ZXMgb2YgcGFzdGVkIG5vZGVzIGFuZCBlZGdlc1xuICB2YXIgY2xvbmVDb2xsYXBzZWROb2Rlc0FuZFBvcnRzID0gZnVuY3Rpb24gKGVsZXNCZWZvcmUpe1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgdmFyIGVsZXNBZnRlciA9IGN5LmVsZW1lbnRzKCk7XG4gICAgdmFyIGVsZXNEaWZmID0gZWxlc0FmdGVyLmRpZmYoZWxlc0JlZm9yZSkubGVmdDtcblxuICAgIC8vIHNoYWxsb3cgY29weSBjb2xsYXBzZWQgbm9kZXMgLSBjb2xsYXBzZWQgY29tcG91bmRzIGJlY29tZSBzaW1wbGUgbm9kZXNcbiAgICAvLyBkYXRhIHJlbGF0ZWQgdG8gY29sbGFwc2VkIG5vZGVzIGFyZSByZW1vdmVkIGZyb20gZ2VuZXJhdGVkIGNsb25lc1xuICAgIC8vIHJlbGF0ZWQgaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvbmV3dC9pc3N1ZXMvMTQ1XG4gICAgdmFyIGNvbGxhcHNlZE5vZGVzID0gZWxlc0RpZmYuZmlsdGVyKCdub2RlLmN5LWV4cGFuZC1jb2xsYXBzZS1jb2xsYXBzZWQtbm9kZScpO1xuXG4gICAgY29sbGFwc2VkTm9kZXMuY29ubmVjdGVkRWRnZXMoKS5yZW1vdmUoKTtcbiAgICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVDbGFzcygnY3ktZXhwYW5kLWNvbGxhcHNlLWNvbGxhcHNlZC1ub2RlJyk7XG4gICAgY29sbGFwc2VkTm9kZXMucmVtb3ZlRGF0YSgnY29sbGFwc2VkQ2hpbGRyZW4nKTtcbiAgICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVEYXRhKCdwb3NpdGlvbi1iZWZvcmUtY29sbGFwc2Ugc2l6ZS1iZWZvcmUtY29sbGFwc2UnKTtcbiAgICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVEYXRhKCdleHBhbmRjb2xsYXBzZVJlbmRlcmVkQ3VlU2l6ZSBleHBhbmRjb2xsYXBzZVJlbmRlcmVkU3RhcnRYIGV4cGFuZGNvbGxhcHNlUmVuZGVyZWRTdGFydFknKTtcblxuICAgIC8vIGNsb25pbmcgcG9ydHNcbiAgICBlbGVzRGlmZi5ub2RlcygpLmZvckVhY2goZnVuY3Rpb24oX25vZGUpe1xuICAgICAgaWYoX25vZGUuZGF0YShcInBvcnRzXCIpLmxlbmd0aCA9PSAyKXtcbiAgICAgICAgICB2YXIgb2xkUG9ydE5hbWUwID0gX25vZGUuZGF0YShcInBvcnRzXCIpWzBdLmlkO1xuICAgICAgICAgIHZhciBvbGRQb3J0TmFtZTEgPSBfbm9kZS5kYXRhKFwicG9ydHNcIilbMV0uaWQ7XG4gICAgICAgICAgX25vZGUuZGF0YShcInBvcnRzXCIpWzBdLmlkID0gX25vZGUuaWQoKSArIFwiLjFcIjtcbiAgICAgICAgICBfbm9kZS5kYXRhKFwicG9ydHNcIilbMV0uaWQgPSBfbm9kZS5pZCgpICsgXCIuMlwiO1xuXG4gICAgICAgICAgX25vZGUub3V0Z29lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xuICAgICAgICAgICAgaWYoX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIikgPT0gb2xkUG9ydE5hbWUwKXtcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIiwgX25vZGUuZGF0YShcInBvcnRzXCIpWzBdLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIikgPT0gb2xkUG9ydE5hbWUxKXtcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIiwgX25vZGUuZGF0YShcInBvcnRzXCIpWzFdLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIsIF9ub2RlLmlkKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIF9ub2RlLmluY29tZXJzKCkuZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKF9lZGdlKXtcbiAgICAgICAgICAgIGlmKF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpID09IG9sZFBvcnROYW1lMCl7XG4gICAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIF9ub2RlLmRhdGEoXCJwb3J0c1wiKVswXS5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpID09IG9sZFBvcnROYW1lMSl7XG4gICAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIF9ub2RlLmRhdGEoXCJwb3J0c1wiKVsxXS5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiLCBfbm9kZS5pZCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIF9ub2RlLm91dGdvZXJzKCkuZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKF9lZGdlKXtcbiAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiLCBfbm9kZS5pZCgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIF9ub2RlLmluY29tZXJzKCkuZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKF9lZGdlKXtcbiAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiLCBfbm9kZS5pZCgpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZWxlc0RpZmYuc2VsZWN0KCk7XG4gIH1cblxuICAvKlxuICAgKiBDbG9uZSBnaXZlbiBlbGVtZW50cy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNsb25lRWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlcywgcGFzdGVBdE1vdXNlTG9jKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29weUVsZW1lbnRzKGVsZXMpO1xuXG4gICAgdGhpcy5wYXN0ZUVsZW1lbnRzKHBhc3RlQXRNb3VzZUxvYyk7XG4gIH07XG5cbiAgLypcbiAgICogQ29weSBnaXZlbiBlbGVtZW50cyB0byBjbGlwYm9hcmQuIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jb3B5RWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlcykge1xuICAgIGN5LmNsaXBib2FyZCgpLmNvcHkoZWxlcyk7XG4gIH07XG5cbiAgLypcbiAgICogUGFzdGUgdGhlIGVsZW1lbnRzIGNvcGllZCB0byBjbGlwYm9hcmQuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5wYXN0ZUVsZW1lbnRzID0gZnVuY3Rpb24ocGFzdGVBdE1vdXNlTG9jKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBlbGVzQmVmb3JlID0gY3kuZWxlbWVudHMoKTtcblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwicGFzdGVcIix7cGFzdGVBdE1vdXNlTG9jOiBwYXN0ZUF0TW91c2VMb2N9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjeS5jbGlwYm9hcmQoKS5wYXN0ZSgpO1xuICAgIH1cbiAgICBjbG9uZUNvbGxhcHNlZE5vZGVzQW5kUG9ydHMoZWxlc0JlZm9yZSk7XG4gICAgY3kubm9kZXMoXCI6c2VsZWN0ZWRcIikuZW1pdCgnZGF0YScpO1xuICB9O1xuXG4gIC8qXG4gICAqIEFsaWducyBnaXZlbiBub2RlcyBpbiBnaXZlbiBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBvcmRlci5cbiAgICogSG9yaXpvbnRhbCBhbmQgdmVydGljYWwgcGFyYW1ldGVycyBtYXkgYmUgJ25vbmUnIG9yIHVuZGVmaW5lZC5cbiAgICogYWxpZ25UbyBwYXJhbWV0ZXIgaW5kaWNhdGVzIHRoZSBsZWFkaW5nIG5vZGUuXG4gICAqIFJlcXVyaXJlcyBjeXRvc2NhcGUtZ3JpZC1ndWlkZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmFsaWduID0gZnVuY3Rpb24gKG5vZGVzLCBob3Jpem9udGFsLCB2ZXJ0aWNhbCwgYWxpZ25Ubykge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImFsaWduXCIsIHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBob3Jpem9udGFsOiBob3Jpem9udGFsLFxuICAgICAgICB2ZXJ0aWNhbDogdmVydGljYWwsXG4gICAgICAgIGFsaWduVG86IGFsaWduVG9cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2Rlcy5hbGlnbihob3Jpem9udGFsLCB2ZXJ0aWNhbCwgYWxpZ25Ubyk7XG4gICAgfVxuXG4gICAgaWYoY3kuZWRnZXMoXCI6c2VsZWN0ZWRcIikubGVuZ3RoID09IDEgKSB7XG4gICAgICBjeS5lZGdlcygpLnVuc2VsZWN0KCk7ICAgICAgXG4gICAgfVxuICAgIFxuICB9O1xuXG4gIC8qXG4gICAqIENyZWF0ZSBjb21wb3VuZCBmb3IgZ2l2ZW4gbm9kZXMuIGNvbXBvdW5kVHlwZSBtYXkgYmUgJ2NvbXBsZXgnIG9yICdjb21wYXJ0bWVudCcuXG4gICAqIFRoaXMgbWV0aG9kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChfbm9kZXMsIGNvbXBvdW5kVHlwZSkge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbm9kZXMgPSBfbm9kZXM7XG4gICAgLypcbiAgICAgKiBFbGVtaW5hdGUgdGhlIG5vZGVzIHdoaWNoIGNhbm5vdCBoYXZlIGEgcGFyZW50IHdpdGggZ2l2ZW4gY29tcG91bmQgdHlwZVxuICAgICAqL1xuICAgIG5vZGVzID0gX25vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCwgaSkge1xuICAgICAgaWYodHlwZW9mIGVsZW1lbnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgZWxlbWVudCA9IGk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzYmduY2xhc3MgPSBlbGVtZW50LmRhdGEoXCJjbGFzc1wiKTtcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmlzVmFsaWRQYXJlbnQoc2JnbmNsYXNzLCBjb21wb3VuZFR5cGUsIGVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XG5cbiAgICAvLyBBbGwgZWxlbWVudHMgc2hvdWxkIGhhdmUgdGhlIHNhbWUgcGFyZW50IGFuZCB0aGUgY29tbW9uIHBhcmVudCBzaG91bGQgbm90IGJlIGEgJ2NvbXBsZXgnXG4gICAgLy8gaWYgY29tcG91bmRUeXBlIGlzICdjb21wYXJ0ZW50J1xuICAgIC8vIGJlY2F1c2UgdGhlIG9sZCBjb21tb24gcGFyZW50IHdpbGwgYmUgdGhlIHBhcmVudCBvZiB0aGUgbmV3IGNvbXBhcnRtZW50IGFmdGVyIHRoaXMgb3BlcmF0aW9uIGFuZFxuICAgIC8vICdjb21wbGV4ZXMnIGNhbm5vdCBpbmNsdWRlICdjb21wYXJ0bWVudHMnXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFlbGVtZW50VXRpbGl0aWVzLmFsbEhhdmVUaGVTYW1lUGFyZW50KG5vZGVzKVxuICAgICAgICAgICAgfHwgKCAoY29tcG91bmRUeXBlID09PSAnY29tcGFydG1lbnQnIHx8IGNvbXBvdW5kVHlwZSA9PSAnc3VibWFwJykgJiYgbm9kZXMucGFyZW50KCkuZGF0YSgnY2xhc3MnKVxuICAgICAgICAgICAgJiYgbm9kZXMucGFyZW50KCkuZGF0YSgnY2xhc3MnKS5zdGFydHNXaXRoKCdjb21wbGV4JykgKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjeS51bmRvUmVkbygpKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGNvbXBvdW5kVHlwZTogY29tcG91bmRUeXBlLFxuICAgICAgICBub2Rlc1RvTWFrZUNvbXBvdW5kOiBub2Rlc1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlc1wiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMobm9kZXMsIGNvbXBvdW5kVHlwZSk7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIE1vdmUgdGhlIG5vZGVzIHRvIGEgbmV3IHBhcmVudCBhbmQgY2hhbmdlIHRoZWlyIHBvc2l0aW9uIGlmIHBvc3NEaWZmIHBhcmFtcyBhcmUgc2V0LlxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uIGFuZCBjaGVja3MgaWYgdGhlIG9wZXJhdGlvbiBpcyB2YWxpZC5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlUGFyZW50ID0gZnVuY3Rpb24obm9kZXMsIF9uZXdQYXJlbnQsIHBvc0RpZmZYLCBwb3NEaWZmWSkge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV3UGFyZW50ID0gdHlwZW9mIF9uZXdQYXJlbnQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX25ld1BhcmVudCkgOiBfbmV3UGFyZW50O1xuICAgIC8vIE5ldyBwYXJlbnQgaXMgc3VwcG9zZWQgdG8gYmUgb25lIG9mIHRoZSByb290LCBhIGNvbXBsZXggb3IgYSBjb21wYXJ0bWVudFxuICAgIGlmIChuZXdQYXJlbnQgJiYgIW5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikuc3RhcnRzV2l0aChcImNvbXBsZXhcIikgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcImNvbXBhcnRtZW50XCJcbiAgICAgICAgICAgICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgIT0gXCJzdWJtYXBcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvKlxuICAgICAqIEVsZW1pbmF0ZSB0aGUgbm9kZXMgd2hpY2ggY2Fubm90IGhhdmUgdGhlIG5ld1BhcmVudCBhcyB0aGVpciBwYXJlbnRcbiAgICAgKi9cbiAgICBub2RlcyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCwgaSkge1xuICAgICAgaWYodHlwZW9mIGVsZW1lbnQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgZWxlbWVudCA9IGk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzYmduY2xhc3MgPSBlbGVtZW50LmRhdGEoXCJjbGFzc1wiKTtcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmlzVmFsaWRQYXJlbnQoc2JnbmNsYXNzLCBuZXdQYXJlbnQsIGVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgLy8gRGlzY2FyZCB0aGUgbm9kZXMgd2hvc2UgcGFyZW50IGlzIGFscmVhZHkgbmV3UGFyZW50LlxuICAgIC8vIERpc2NhcmQgdGhlIG5ld1BhcmVudCBpdHNlbGYgaWYgaXQgaXMgYW1vbmcgdGhlIG5vZGVzXG4gICAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZSwgaSkge1xuICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBlbGUgPSBpO1xuICAgICAgfVxuXG4gICAgICAvLyBEaXNjYXJkIHRoZSBuZXdQYXJlbnQgaWYgaXQgaXMgYW1vbmcgdGhlIG5vZGVzXG4gICAgICBpZiAobmV3UGFyZW50ICYmIGVsZS5pZCgpID09PSBuZXdQYXJlbnQuaWQoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBEaXNjYXJkIHRoZSBub2RlcyB3aG9zZSBwYXJlbnQgaXMgYWxyZWFkeSBuZXdQYXJlbnRcbiAgICAgIGlmICghbmV3UGFyZW50KSB7XG4gICAgICAgIHJldHVybiBlbGUuZGF0YSgncGFyZW50JykgIT0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbGUuZGF0YSgncGFyZW50JykgIT09IG5ld1BhcmVudC5pZCgpO1xuICAgIH0pO1xuXG4gICAgLy8gSWYgc29tZSBub2RlcyBhcmUgYW5jZXN0b3Igb2YgbmV3IHBhcmVudCBlbGVtaW5hdGUgdGhlbVxuICAgIGlmIChuZXdQYXJlbnQpIHtcbiAgICAgIG5vZGVzID0gbm9kZXMuZGlmZmVyZW5jZShuZXdQYXJlbnQuYW5jZXN0b3JzKCkpO1xuICAgIH1cblxuICAgIC8vIElmIGFsbCBub2RlcyBhcmUgZWxlbWluYXRlZCByZXR1cm4gZGlyZWN0bHlcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSnVzdCBtb3ZlIHRoZSB0b3AgbW9zdCBub2Rlc1xuICAgIG5vZGVzID0gZWxlbWVudFV0aWxpdGllcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xuXG4gICAgdmFyIHBhcmVudElkID0gbmV3UGFyZW50ID8gbmV3UGFyZW50LmlkKCkgOiBudWxsO1xuXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlLFxuICAgICAgICBwYXJlbnREYXRhOiBwYXJlbnRJZCwgLy8gSXQga2VlcHMgdGhlIG5ld1BhcmVudElkIChKdXN0IGFuIGlkIGZvciBlYWNoIG5vZGVzIGZvciB0aGUgZmlyc3QgdGltZSlcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBwb3NEaWZmWDogcG9zRGlmZlgsXG4gICAgICAgIHBvc0RpZmZZOiBwb3NEaWZmWSxcbiAgICAgICAgLy8gVGhpcyBpcyBuZWVkZWQgYmVjYXVzZSB0aGUgY2hhbmdlUGFyZW50IGZ1bmN0aW9uIGNhbGxlZCBpcyBub3QgZnJvbSBlbGVtZW50VXRpbGl0aWVzXG4gICAgICAgIC8vIGJ1dCBmcm9tIHRoZSB1bmRvUmVkbyBleHRlbnNpb24gZGlyZWN0bHksIHNvIG1haW50YWluaW5nIHBvaW50ZXIgaXMgbm90IGF1dG9tYXRpY2FsbHkgZG9uZS5cbiAgICAgICAgY2FsbGJhY2s6IGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlUGFyZW50XCIsIHBhcmFtKTsgLy8gVGhpcyBhY3Rpb24gaXMgcmVnaXN0ZXJlZCBieSB1bmRvUmVkbyBleHRlbnNpb25cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudChub2RlcywgcGFyZW50SWQsIHBvc0RpZmZYLCBwb3NEaWZmWSk7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxuICAgKiBpbiB0aGUgY29tcGxleC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIHRoZSBzYW1lIGZ1bmN0aW9uIGluIGVsZW1lbnRVdGlsaXRpZXNcbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoLCBsYXlvdXRQYXJhbSkge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbih0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoLCBsYXlvdXRQYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICB0ZW1wbGF0ZVR5cGU6IHRlbXBsYXRlVHlwZSxcbiAgICAgICAgbWFjcm9tb2xlY3VsZUxpc3Q6IG1hY3JvbW9sZWN1bGVMaXN0LFxuICAgICAgICBjb21wbGV4TmFtZTogY29tcGxleE5hbWUsXG4gICAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxuICAgICAgICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCxcbiAgICAgICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxuICAgICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoLFxuICAgICAgICBsYXlvdXRQYXJhbTogbGF5b3V0UGFyYW1cbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVUZW1wbGF0ZVJlYWN0aW9uXCIsIHBhcmFtKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LlxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbywgcHJlc2VydmVSZWxhdGl2ZVBvcykge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgIHVzZUFzcGVjdFJhdGlvOiB1c2VBc3BlY3RSYXRpbyxcbiAgICAgICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZSxcbiAgICAgICAgcHJlc2VydmVSZWxhdGl2ZVBvczogcHJlc2VydmVSZWxhdGl2ZVBvc1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInJlc2l6ZU5vZGVzXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbyk7XG4gICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICAgIH1cblxuXG4gIH07XG5cbiAgICAvKlxuICAgICAqIFJlc2l6ZSBnaXZlbiBub2RlcyBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHkgb25lIG9mIHdpZHRoIG9yIGhlaWdodCBzaG91bGQgbm90IGJlIHNldC5cbiAgICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgICAqL1xuICAgIG1haW5VdGlsaXRpZXMucmVzaXplTm9kZXNUb0NvbnRlbnQgPSBmdW5jdGlvbihub2RlcywgdXNlQXNwZWN0UmF0aW8pIHtcbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IFxuICAgICAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluV2lkdGgobm9kZSk7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5IZWlnaHQobm9kZSk7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwicmVzaXplTm9kZXNcIiwgcGFyYW06IHtcbiAgICAgICAgICAgICAgICBub2Rlczogbm9kZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgdXNlQXNwZWN0UmF0aW86IHVzZUFzcGVjdFJhdGlvLFxuICAgICAgICAgICAgICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlc2VydmVSZWxhdGl2ZVBvczogdHJ1ZVxuICAgICAgICAgICAgfX0pO1xuXG4gICAgICAgICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBzdGF0ZUFuZEluZm9zLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChsZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgICAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgICAgICAgICBsb2NhdGlvbnM6IFtcInRvcFwiLFwicmlnaHRcIixcImJvdHRvbVwiLFwibGVmdFwiXVxuICAgICAgICAgICAgICB9OyAgICAgICAgICBcbiAgICAgICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOlwiZml0VW5pdHNcIixwYXJhbSA6IHBhcmFtfSlcbiAgICAgICAgICAgICB9XG4gIFxuXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgXG4gICAgICAgICBcbiAgICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiYmF0Y2hcIiwgYWN0aW9ucyk7XG4gICAgICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgICAgICAgICByZXR1cm4gYWN0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgICAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluV2lkdGgobm9kZSk7XG4gICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbkhlaWdodChub2RlKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMobm9kZSwgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8sIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICAgIH07XG5cbiAgLypcbiAgICogQ2hhbmdlcyB0aGUgbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBsYWJlbC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlTm9kZUxhYmVsID0gZnVuY3Rpb24obm9kZXMsIGxhYmVsKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBsYWJlbCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIENoYW5nZSBmb250IHByb3BlcnRpZXMgZm9yIGdpdmVuIG5vZGVzIHVzZSB0aGUgZ2l2ZW4gZm9udCBkYXRhLlxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uKGVsZXMsIGRhdGEpIHtcbiAgICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBlbGVzOiBlbGVzLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VGb250UHJvcGVydGllc1wiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGVzLCBkYXRhKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgcGFyYW1ldGVycyBzZWUgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveFxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpIHtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gobm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICAvLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4gIC8vIFRoZSBib3ggaXMgcmVwcmVzZW50ZWQgYnkgdGhlIHBhcmFtZXRlciBvYmouXG4gIC8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gIG1haW5VdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2Rlcywgb2JqKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChub2Rlcywgb2JqKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG9iajogb2JqLFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICAvLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxuICAvLyBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICBtYWluVXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIGluZGV4KSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2Rlcywge2luZGV4OiBpbmRleH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgbG9jYXRpb25PYmo6IHtpbmRleDogaW5kZXh9LFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuXG4gIC8vQXJyYW5nZSBpbmZvcm1hdGlvbiBib3hlc1xuICAvL0lmIGZvcmNlIGNoZWNrIGlzIHRydWUsIGl0IHJlYXJyYW5nZXMgYWxsIGluZm9ybWF0aW9uIGJveGVzXG4gIG1haW5VdGlsaXRpZXMuZml0VW5pdHMgPSBmdW5jdGlvbiAobm9kZSwgbG9jYXRpb25zKSB7XG4gICAgaWYgKG5vZGUuZGF0YSgnYXV4dW5pdGxheW91dHMnKSA9PT0gdW5kZWZpbmVkIHx8IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobG9jYXRpb25zID09PSB1bmRlZmluZWQgfHwgbG9jYXRpb25zLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmZpdFVuaXRzKG5vZGUsIGxvY2F0aW9ucyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICBsb2NhdGlvbnM6IGxvY2F0aW9uc1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImZpdFVuaXRzXCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZWRyYXcgY2xvbmUgbWFya2VycyBvbiBnaXZlbiBub2RlcyB3aXRob3V0IGNvbnNpZGVyaW5nIHVuZG8uXG4gICAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L25ld3QvaXNzdWVzLzU3NCBcbiAgICovXG4gIG1haW5VdGlsaXRpZXMucmVkcmF3Q2xvbmVNYXJrZXJzID0gZnVuY3Rpb24obm9kZXMpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCB0cnVlKTtcbiAgfVxuXG4gIC8qXG4gICAqIFNldCBjbG9uZSBtYXJrZXIgc3RhdHVzIG9mIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRDbG9uZU1hcmtlclN0YXR1c1wiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIENoYW5nZSBzdHlsZS9jc3Mgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxuICAgKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlQ3NzID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzKGVsZXMsIG5hbWUsIHZhbHVlTWFwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGVsZXM6IGVsZXMsXG4gICAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcbiAgICAgICAgbmFtZTogbmFtZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUNzc1wiLCBwYXJhbSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICAvKlxuICAgKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gICAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBlbGVzOiBlbGVzLFxuICAgICAgICB2YWx1ZU1hcDogdmFsdWVNYXAsXG4gICAgICAgIG5hbWU6IG5hbWVcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VEYXRhXCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIG1haW5VdGlsaXRpZXMudXBkYXRlU2V0RmllbGQgPSBmdW5jdGlvbihlbGUsIGZpZWxkTmFtZSwgdG9EZWxldGUsIHRvQWRkLCBjYWxsYmFjaykge1xuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVsZSwgZmllbGROYW1lLCB0b0RlbGV0ZSwgdG9BZGQsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGVsZSxcbiAgICAgICAgZmllbGROYW1lLFxuICAgICAgICB0b0RlbGV0ZSxcbiAgICAgICAgdG9BZGQsXG4gICAgICAgIGNhbGxiYWNrXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwidXBkYXRlU2V0RmllbGRcIiwgcGFyYW0pO1xuICAgIH1cbiAgfTtcblxuICBtYWluVXRpbGl0aWVzLnNldERlZmF1bHRQcm9wZXJ0eSA9IGZ1bmN0aW9uKCBfY2xhc3MsIG5hbWUsIHZhbHVlICkge1xuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHByb3BNYXAgPSB7fTtcbiAgICAgIHByb3BNYXBbIG5hbWUgXSA9IHZhbHVlO1xuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldERlZmF1bHRQcm9wZXJ0aWVzKF9jbGFzcywgcHJvcE1hcCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBjbGFzczogX2NsYXNzLFxuICAgICAgICBuYW1lLFxuICAgICAgICB2YWx1ZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInNldERlZmF1bHRQcm9wZXJ0eVwiLCBwYXJhbSk7XG4gICAgfVxuICB9O1xuXG4gIG1haW5VdGlsaXRpZXMudXBkYXRlSW5mb2JveFN0eWxlID0gZnVuY3Rpb24oIG5vZGUsIGluZGV4LCBuZXdQcm9wcyApIHtcbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlSW5mb2JveFN0eWxlKCBub2RlLCBpbmRleCwgbmV3UHJvcHMgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgbmV3UHJvcHM6IG5ld1Byb3BzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwidXBkYXRlSW5mb2JveFN0eWxlXCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIG1haW5VdGlsaXRpZXMudXBkYXRlSW5mb2JveE9iaiA9IGZ1bmN0aW9uKCBub2RlLCBpbmRleCwgbmV3UHJvcHMgKSB7XG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hPYmooIG5vZGUsIGluZGV4LCBuZXdQcm9wcyApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBuZXdQcm9wczogbmV3UHJvcHNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJ1cGRhdGVJbmZvYm94T2JqXCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIG1haW5VdGlsaXRpZXMuZGVsZXRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChlbGVzLCBsYXlvdXRwYXJhbSkge1xuICAgIHZhciBub2RlcyA9IGVsZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcblxuICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIik7XG4gICAgdmFyIG5vZGVzVG9LZWVwID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmRSZW1haW5pbmdOb2Rlcyhub2RlcywgYWxsTm9kZXMpO1xuICAgIHZhciBub2Rlc1RvUmVtb3ZlID0gYWxsTm9kZXMubm90KG5vZGVzVG9LZWVwKTtcblxuICAgIGlmIChub2Rlc1RvUmVtb3ZlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG5cbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5kZWxldGVBbmRQZXJmb3JtTGF5b3V0KG5vZGVzVG9SZW1vdmUsIGxheW91dHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgICAgIGVsZXM6IG5vZGVzVG9SZW1vdmUsXG4gICAgICAgICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXG4gICAgICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiZGVsZXRlQW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbSk7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIEhpZGVzIGdpdmVuIGVsZXMgKHRoZSBvbmVzIHdoaWNoIGFyZSBzZWxlY3RlZCkgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAgICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuaGlkZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihlbGVzLCBsYXlvdXRwYXJhbSkge1xuICAgICAgdmFyIG5vZGVzID0gZWxlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xuXG4gICAgICB2YXIgYWxsTm9kZXMgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpO1xuICAgICAgdmFyIG5vZGVzVG9TaG93ID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmRSZW1haW5pbmdOb2Rlcyhub2RlcywgYWxsTm9kZXMpO1xuICAgICAgdmFyIG5vZGVzVG9IaWRlID0gYWxsTm9kZXMubm90KG5vZGVzVG9TaG93KTtcblxuICAgICAgaWYgKG5vZGVzVG9IaWRlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG5cbiAgICAgICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XG4gICAgICAgICAgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuaGlkZUFuZFBlcmZvcm1MYXlvdXQobm9kZXNUb0hpZGUsIGxheW91dHBhcmFtKTtcbiAgICAgICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XG4gICAgICAgICAgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICAgICAgICBlbGVzOiBub2Rlc1RvSGlkZSxcbiAgICAgICAgICAgICAgbGF5b3V0cGFyYW06IGxheW91dHBhcmFtLFxuICAgICAgICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIHVyID0gY3kudW5kb1JlZG8oKTtcbiAgICAgICAgICB1ci5hY3Rpb24oXCJ0aGlja2VuQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcik7XG4gICAgICAgICAgdXIuYWN0aW9uKFwidGhpbkJvcmRlclwiLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlciwgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIpO1xuXG4gICAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoKS5pbnRlcnNlY3Rpb24obm9kZXNUb0hpZGUpO1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGluQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcn0pO1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJoaWRlQW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbTogcGFyYW19KTtcbiAgICAgICAgICBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IG5vZGVzVG9IaWRlLm5laWdoYm9yaG9vZChcIjp2aXNpYmxlXCIpLm5vZGVzKCkuZGlmZmVyZW5jZShub2Rlc1RvSGlkZSkuZGlmZmVyZW5jZShjeS5ub2RlcyhcIlt0aGlja0JvcmRlcl1cIikpO1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGlja2VuQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcn0pO1xuICAgICAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJiYXRjaFwiLCBhY3Rpb25zKTtcbiAgICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBTaG93cyBhbGwgZWxlbWVudHMgKHRoZSBvbmVzIHdoaWNoIGFyZSBoaWRkZW4gaWYgYW55KSBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xuICAgKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5zaG93QWxsQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGxheW91dHBhcmFtKSB7XG4gICAgdmFyIGhpZGRlbkVsZXMgPSBjeS5lbGVtZW50cygnOmhpZGRlbicpO1xuICAgIGlmIChoaWRkZW5FbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcbiAgICAgIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQoaGlkZGVuRWxlcywgbGF5b3V0cGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgZWxlczogaGlkZGVuRWxlcyxcbiAgICAgICAgbGF5b3V0cGFyYW06IGxheW91dHBhcmFtLFxuICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgIH07XG5cbiAgICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKCk7XG4gICAgICB1ci5hY3Rpb24oXCJ0aGlja2VuQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcik7XG4gICAgICB1ci5hY3Rpb24oXCJ0aGluQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlcik7XG5cbiAgICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5ub2RlcyhcIlt0aGlja0JvcmRlcl1cIik7XG4gICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpbkJvcmRlclwiLCBwYXJhbTogbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3J9KTtcbiAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbTogcGFyYW19KTtcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJiYXRjaFwiLCBhY3Rpb25zKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogVW5oaWRlIGdpdmVuIGVsZXMgKHRoZSBvbmVzIHdoaWNoIGFyZSBoaWRkZW4gaWYgYW55KSBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xuICAgKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKG1haW5FbGUsIGVsZXMsIGxheW91dHBhcmFtKSB7XG4gICAgICB2YXIgaGlkZGVuRWxlcyA9IGVsZXMuZmlsdGVyKCc6aGlkZGVuJyk7XG4gICAgICBpZiAoaGlkZGVuRWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBtYWluVXRpbGl0aWVzLmNsb3NlVXBFbGVtZW50cyhtYWluRWxlLCBoaWRkZW5FbGVzLm5vZGVzKCkpO1xuICAgICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xuICAgICAgICAgIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KGhpZGRlbkVsZXMsIGxheW91dHBhcmFtKTtcbiAgICAgICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XG4gICAgICAgICAgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICAgICAgICBlbGVzOiBoaWRkZW5FbGVzLFxuICAgICAgICAgICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXG4gICAgICAgICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB2YXIgdXIgPSBjeS51bmRvUmVkbygpO1xuICAgICAgICAgIHVyLmFjdGlvbihcInRoaWNrZW5Cb3JkZXJcIiwgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKTtcbiAgICAgICAgICB1ci5hY3Rpb24oXCJ0aGluQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlcik7XG5cbiAgICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgICAgIHZhciBub2Rlc1RvVGhpbkJvcmRlciA9IChoaWRkZW5FbGVzLm5laWdoYm9yaG9vZChcIjp2aXNpYmxlXCIpLm5vZGVzKFwiW3RoaWNrQm9yZGVyXVwiKSlcbiAgICAgICAgICAgICAgICAgIC5kaWZmZXJlbmNlKGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5kaWZmZXJlbmNlKGhpZGRlbkVsZXMuZWRnZXMoKS51bmlvbihoaWRkZW5FbGVzLm5vZGVzKCkuY29ubmVjdGVkRWRnZXMoKSkpLmNvbm5lY3RlZE5vZGVzKCkpO1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGluQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1RvVGhpbkJvcmRlcn0pO1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbTogcGFyYW19KTtcbiAgICAgICAgICB2YXIgbm9kZXNUb1RoaWNrZW5Cb3JkZXIgPSBoaWRkZW5FbGVzLm5vZGVzKCkuZWRnZXNXaXRoKGN5Lm5vZGVzKFwiOmhpZGRlblwiKS5kaWZmZXJlbmNlKGhpZGRlbkVsZXMubm9kZXMoKSkpXG4gIFx0ICAgICAgICAgICAgLmNvbm5lY3RlZE5vZGVzKCkuaW50ZXJzZWN0aW9uKGhpZGRlbkVsZXMubm9kZXMoKSk7XG4gICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInRoaWNrZW5Cb3JkZXJcIiwgcGFyYW06IG5vZGVzVG9UaGlja2VuQm9yZGVyfSk7XG4gICAgICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImJhdGNoXCIsIGFjdGlvbnMpO1xuICAgICAgfVxuICB9O1xuXG4gIC8qXG4gICogVGFrZXMgdGhlIGhpZGRlbiBlbGVtZW50cyBjbG9zZSB0byB0aGUgbm9kZXMgd2hvc2UgbmVpZ2hib3JzIHdpbGwgYmUgc2hvd25cbiAgKiAqL1xuICBtYWluVXRpbGl0aWVzLmNsb3NlVXBFbGVtZW50cyA9IGZ1bmN0aW9uKG1haW5FbGUsIGhpZGRlbkVsZXMpIHtcbiAgICAgIHZhciBsZWZ0WCA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICB2YXIgcmlnaHRYID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgICAgIHZhciB0b3BZID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgIHZhciBib3R0b21ZID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgICAgIC8vIENoZWNrIHRoZSB4IGFuZCB5IGxpbWl0cyBvZiBhbGwgaGlkZGVuIGVsZW1lbnRzIGFuZCBzdG9yZSB0aGVtIGluIHRoZSB2YXJpYWJsZXMgYWJvdmVcbiAgICAgIGhpZGRlbkVsZXMuZm9yRWFjaChmdW5jdGlvbiggZWxlICl7XG4gICAgICAgICAgaWYgKGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wYXJ0bWVudCcgJiYgIGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wbGV4JylcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIHZhciBoYWxmV2lkdGggPSBlbGUub3V0ZXJXaWR0aCgpLzI7XG4gICAgICAgICAgICAgIHZhciBoYWxmSGVpZ2h0ID0gZWxlLm91dGVySGVpZ2h0KCkvMjtcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgLSBoYWxmV2lkdGggPCBsZWZ0WClcbiAgICAgICAgICAgICAgICAgIGxlZnRYID0gZWxlLnBvc2l0aW9uKFwieFwiKSAtIGhhbGZXaWR0aDtcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgKyBoYWxmV2lkdGggPiByaWdodFgpXG4gICAgICAgICAgICAgICAgICByaWdodFggPSBlbGUucG9zaXRpb24oXCJ4XCIpICsgaGFsZldpZHRoO1xuICAgICAgICAgICAgICBpZiAoZWxlLnBvc2l0aW9uKFwieVwiKSAtIGhhbGZIZWlnaHQgPCB0b3BZKVxuICAgICAgICAgICAgICAgICAgdG9wWSA9IGVsZS5wb3NpdGlvbihcInlcIikgLSBoYWxmSGVpZ2h0O1xuICAgICAgICAgICAgICBpZiAoZWxlLnBvc2l0aW9uKFwieVwiKSArIGhhbGZIZWlnaHQgPiB0b3BZKVxuICAgICAgICAgICAgICAgICAgYm90dG9tWSA9IGVsZS5wb3NpdGlvbihcInlcIikgKyBoYWxmSGVpZ2h0O1xuICAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvL1RoZSBjb29yZGluYXRlcyBvZiB0aGUgb2xkIGNlbnRlciBjb250YWluaW5nIHRoZSBoaWRkZW4gbm9kZXNcbiAgICAgIHZhciBvbGRDZW50ZXJYID0gKGxlZnRYICsgcmlnaHRYKS8yO1xuICAgICAgdmFyIG9sZENlbnRlclkgPSAodG9wWSArIGJvdHRvbVkpLzI7XG5cbiAgICAgIC8vSGVyZSB3ZSBjYWxjdWxhdGUgdHdvIHBhcmFtZXRlcnMgd2hpY2ggZGVmaW5lIHRoZSBhcmVhIGluIHdoaWNoIHRoZSBoaWRkZW4gZWxlbWVudHMgYXJlIHBsYWNlZCBpbml0aWFsbHlcbiAgICAgIHZhciBtaW5Ib3Jpem9udGFsUGFyYW0gPSBtYWluRWxlLm91dGVyV2lkdGgoKS8yICsgKHJpZ2h0WCAtIGxlZnRYKS8yO1xuICAgICAgdmFyIG1heEhvcml6b250YWxQYXJhbSA9IG1haW5FbGUub3V0ZXJXaWR0aCgpICsgKHJpZ2h0WCAtIGxlZnRYKS8yO1xuICAgICAgdmFyIG1pblZlcnRpY2FsUGFyYW0gPSBtYWluRWxlLm91dGVySGVpZ2h0KCkvMiArIChib3R0b21ZIC0gdG9wWSkvMjtcbiAgICAgIHZhciBtYXhWZXJ0aWNhbFBhcmFtID0gbWFpbkVsZS5vdXRlckhlaWdodCgpICsgKGJvdHRvbVkgLSB0b3BZKS8yO1xuXG4gICAgICAvL1F1YWRyYW50cyBpcyBhbiBvYmplY3Qgb2YgdGhlIGZvcm0ge2ZpcnN0Olwib2J0YWluZWRcIiwgc2Vjb25kOlwiZnJlZVwiLCB0aGlyZDpcImZyZWVcIiwgZm91cnRoOlwib2J0YWluZWRcIn1cbiAgICAgIC8vIHdoaWNoIGhvbGRzIHdoaWNoIHF1YWRyYW50IGFyZSBmcmVlICh0aGF0J3Mgd2hlcmUgaGlkZGVuIG5vZGVzIHdpbGwgYmUgYnJvdWdodClcbiAgICAgIHZhciBxdWFkcmFudHMgPSBtYWluVXRpbGl0aWVzLmNoZWNrT2NjdXBpZWRRdWFkcmFudHMobWFpbkVsZSwgaGlkZGVuRWxlcyk7XG4gICAgICB2YXIgZnJlZVF1YWRyYW50cyA9IFtdO1xuICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcXVhZHJhbnRzKSB7XG4gICAgICAgICAgaWYgKHF1YWRyYW50c1twcm9wZXJ0eV0gPT09IFwiZnJlZVwiKVxuICAgICAgICAgICAgICBmcmVlUXVhZHJhbnRzLnB1c2gocHJvcGVydHkpO1xuICAgICAgfVxuXG4gICAgICAvL0NhbiB0YWtlIHZhbHVlcyAxIGFuZCAtMSBhbmQgYXJlIHVzZWQgdG8gcGxhY2UgdGhlIGhpZGRlbiBub2RlcyBpbiB0aGUgcmFuZG9tIHF1YWRyYW50XG4gICAgICB2YXIgaG9yaXpvbnRhbE11bHQ7XG4gICAgICB2YXIgdmVydGljYWxNdWx0O1xuICAgICAgaWYgKGZyZWVRdWFkcmFudHMubGVuZ3RoID4gMClcbiAgICAgIHtcbiAgICAgICAgaWYgKGZyZWVRdWFkcmFudHMubGVuZ3RoID09PSAzKVxuICAgICAgICB7XG4gICAgICAgICAgaWYgKGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZpcnN0JykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnc2Vjb25kJykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygndGhpcmQnKSlcbiAgICAgICAgICB7XG4gICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IC0xO1xuICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gLTE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZpcnN0JykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnc2Vjb25kJykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnZm91cnRoJykpXG4gICAgICAgICAge1xuICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAxO1xuICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gLTE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZpcnN0JykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygndGhpcmQnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmb3VydGgnKSlcbiAgICAgICAgICB7XG4gICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XG4gICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdzZWNvbmQnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCd0aGlyZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZvdXJ0aCcpKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gLTE7XG4gICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAvL1JhbmRvbWx5IHBpY2tzIG9uZSBxdWFkcmFudCBmcm9tIHRoZSBmcmVlIHF1YWRyYW50c1xuICAgICAgICAgIHZhciByYW5kb21RdWFkcmFudCA9IGZyZWVRdWFkcmFudHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmZyZWVRdWFkcmFudHMubGVuZ3RoKV07XG5cbiAgICAgICAgICBpZiAocmFuZG9tUXVhZHJhbnQgPT09IFwiZmlyc3RcIikge1xuICAgICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XG4gICAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IC0xO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChyYW5kb21RdWFkcmFudCA9PT0gXCJzZWNvbmRcIikge1xuICAgICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IC0xO1xuICAgICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAtMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAocmFuZG9tUXVhZHJhbnQgPT09IFwidGhpcmRcIikge1xuICAgICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IC0xO1xuICAgICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChyYW5kb21RdWFkcmFudCA9PT0gXCJmb3VydGhcIikge1xuICAgICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XG4gICAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAwO1xuICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IDA7XG4gICAgICB9XG4gICAgICAvLyBJZiB0aGUgaG9yaXpvbnRhbE11bHQgaXMgMCBpdCBtZWFucyB0aGF0IG5vIHF1YWRyYW50IGlzIGZyZWUsIHNvIHdlIHJhbmRvbWx5IGNob29zZSBhIHF1YWRyYW50XG4gICAgICB2YXIgaG9yaXpvbnRhbFBhcmFtID0gbWFpblV0aWxpdGllcy5nZW5lcmF0ZVJhbmRvbShtaW5Ib3Jpem9udGFsUGFyYW0sbWF4SG9yaXpvbnRhbFBhcmFtLGhvcml6b250YWxNdWx0KTtcbiAgICAgIHZhciB2ZXJ0aWNhbFBhcmFtID0gbWFpblV0aWxpdGllcy5nZW5lcmF0ZVJhbmRvbShtaW5WZXJ0aWNhbFBhcmFtLG1heFZlcnRpY2FsUGFyYW0sdmVydGljYWxNdWx0KTtcblxuICAgICAgLy9UaGUgY29vcmRpbmF0ZXMgb2YgdGhlIGNlbnRlciB3aGVyZSB0aGUgaGlkZGVuIG5vZGVzIHdpbGwgYmUgdHJhbnNmZXJlZFxuICAgICAgdmFyIG5ld0NlbnRlclggPSBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSArIGhvcml6b250YWxQYXJhbTtcbiAgICAgIHZhciBuZXdDZW50ZXJZID0gbWFpbkVsZS5wb3NpdGlvbihcInlcIikgKyB2ZXJ0aWNhbFBhcmFtO1xuXG4gICAgICB2YXIgeGRpZmYgPSBuZXdDZW50ZXJYIC0gb2xkQ2VudGVyWDtcbiAgICAgIHZhciB5ZGlmZiA9IG5ld0NlbnRlclkgLSBvbGRDZW50ZXJZO1xuXG4gICAgICAvL0NoYW5nZSB0aGUgcG9zaXRpb24gb2YgaGlkZGVuIGVsZW1lbnRzXG4gICAgICBoaWRkZW5FbGVzLmZvckVhY2goZnVuY3Rpb24oIGVsZSApe1xuICAgICAgICAgIHZhciBuZXd4ID0gZWxlLnBvc2l0aW9uKFwieFwiKSArIHhkaWZmO1xuICAgICAgICAgIHZhciBuZXd5ID0gZWxlLnBvc2l0aW9uKFwieVwiKSArIHlkaWZmO1xuICAgICAgICAgIGVsZS5wb3NpdGlvbihcInhcIiwgbmV3eCk7XG4gICAgICAgICAgZWxlLnBvc2l0aW9uKFwieVwiLG5ld3kpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgLypcbiAgICogR2VuZXJhdGVzIGEgbnVtYmVyIGJldHdlZW4gMiBuciBhbmQgbXVsdGltcGxpZXMgaXQgd2l0aCAxIG9yIC0xXG4gICAqICovXG4gIG1haW5VdGlsaXRpZXMuZ2VuZXJhdGVSYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCwgbXVsdCkge1xuICAgICAgdmFyIHZhbCA9IFstMSwxXTtcbiAgICAgIGlmIChtdWx0ID09PSAwKVxuICAgICAgICAgIG11bHQgPSB2YWxbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnZhbC5sZW5ndGgpXTtcbiAgICAgIHJldHVybiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbikgKiBtdWx0O1xuICB9O1xuXG4gIC8qXG4gICAqIFRoaXMgZnVuY3Rpb24gbWFrZXMgc3VyZSB0aGF0IHRoZSByYW5kb20gbnVtYmVyIGxpZXMgaW4gZnJlZSBxdWFkcmFudFxuICAgKiAqL1xuICBtYWluVXRpbGl0aWVzLmNoZWNrT2NjdXBpZWRRdWFkcmFudHMgPSBmdW5jdGlvbihtYWluRWxlLCBoaWRkZW5FbGVzKSB7XG4gICAgICBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gJ1BEJylcbiAgICAgIHtcbiAgICAgICAgdmFyIHZpc2libGVOZWlnaGJvckVsZXMgPSBtYWluRWxlLm5laWdoYm9yaG9vZCgpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcykubm9kZXMoKTtcbiAgICAgICAgdmFyIHZpc2libGVOZWlnaGJvcnNPZk5laWdoYm9ycyA9IHZpc2libGVOZWlnaGJvckVsZXMubmVpZ2hib3Job29kKCkuZGlmZmVyZW5jZShoaWRkZW5FbGVzKS5kaWZmZXJlbmNlKG1haW5FbGUpLm5vZGVzKCk7XG4gICAgICAgIHZhciB2aXNpYmxlRWxlcyA9IHZpc2libGVOZWlnaGJvckVsZXMudW5pb24odmlzaWJsZU5laWdoYm9yc09mTmVpZ2hib3JzKTtcbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgICAgdmFyIHZpc2libGVFbGVzID0gbWFpbkVsZS5uZWlnaGJvcmhvb2QoKS5kaWZmZXJlbmNlKGhpZGRlbkVsZXMpLm5vZGVzKCk7XG4gICAgICB2YXIgb2NjdXBpZWRRdWFkcmFudHMgPSB7Zmlyc3Q6XCJmcmVlXCIsIHNlY29uZDpcImZyZWVcIiwgdGhpcmQ6XCJmcmVlXCIsIGZvdXJ0aDpcImZyZWVcIn07XG5cbiAgICAgIHZpc2libGVFbGVzLmZvckVhY2goZnVuY3Rpb24oIGVsZSApe1xuICAgICAgICAgIGlmIChlbGUuZGF0YSgnY2xhc3MnKSAhPSAnY29tcGFydG1lbnQnICYmICBlbGUuZGF0YSgnY2xhc3MnKSAhPSAnY29tcGxleCcpXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBpZiAoZWxlLnBvc2l0aW9uKFwieFwiKSA8IG1haW5FbGUucG9zaXRpb24oXCJ4XCIpICYmIGVsZS5wb3NpdGlvbihcInlcIikgPCBtYWluRWxlLnBvc2l0aW9uKFwieVwiKSlcbiAgICAgICAgICAgICAgICAgIG9jY3VwaWVkUXVhZHJhbnRzLnNlY29uZCA9IFwib2NjdXBpZWRcIjtcbiAgICAgICAgICAgICAgZWxzZSBpZiAoZWxlLnBvc2l0aW9uKFwieFwiKSA+IG1haW5FbGUucG9zaXRpb24oXCJ4XCIpICYmIGVsZS5wb3NpdGlvbihcInlcIikgPCBtYWluRWxlLnBvc2l0aW9uKFwieVwiKSlcbiAgICAgICAgICAgICAgICAgIG9jY3VwaWVkUXVhZHJhbnRzLmZpcnN0ID0gXCJvY2N1cGllZFwiO1xuICAgICAgICAgICAgICBlbHNlIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpIDwgbWFpbkVsZS5wb3NpdGlvbihcInhcIikgJiYgZWxlLnBvc2l0aW9uKFwieVwiKSA+IG1haW5FbGUucG9zaXRpb24oXCJ5XCIpKVxuICAgICAgICAgICAgICAgICAgb2NjdXBpZWRRdWFkcmFudHMudGhpcmQgPSBcIm9jY3VwaWVkXCI7XG4gICAgICAgICAgICAgIGVsc2UgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgPiBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSAmJiBlbGUucG9zaXRpb24oXCJ5XCIpID4gbWFpbkVsZS5wb3NpdGlvbihcInlcIikpXG4gICAgICAgICAgICAgICAgICBvY2N1cGllZFF1YWRyYW50cy5mb3VydGggPSBcIm9jY3VwaWVkXCI7XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2NjdXBpZWRRdWFkcmFudHM7XG4gIH07XG5cbiAgLy8gT3ZlcnJpZGVzIGhpZ2hsaWdodFByb2Nlc3NlcyBmcm9tIFNCR05WSVogLSBkbyBub3QgaGlnaGxpZ2h0IGFueSBub2RlcyB3aGVuIHRoZSBtYXAgdHlwZSBpcyBBRlxuICBtYWluVXRpbGl0aWVzLmhpZ2hsaWdodFByb2Nlc3NlcyA9IGZ1bmN0aW9uKF9ub2Rlcykge1xuICAgIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSA9PSBcIkFGXCIpXG4gICAgICByZXR1cm47XG4gICAgc2JnbnZpekluc3RhbmNlLmhpZ2hsaWdodFByb2Nlc3Nlcyhfbm9kZXMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXNldHMgbWFwIHR5cGUgdG8gdW5kZWZpbmVkXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLnJlc2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XG4gICAgZWxlbWVudFV0aWxpdGllcy5yZXNldE1hcFR5cGUoKTtcbiAgfTtcblxuICAvKipcbiAgICogcmV0dXJuIDogbWFwIHR5cGVcbiAgICovXG4gIG1haW5VdGlsaXRpZXMuZ2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpO1xuICB9O1xuXG4gIG1haW5VdGlsaXRpZXMuYWRkQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24obm9kZXMsIGJnT2JqLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKXtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwIHx8ICFiZ09iaikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGJnT2JqWydmaXJzdFRpbWUnXSA9IHRydWU7XG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgYmdPYmo6IGJnT2JqLFxuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIHVwZGF0ZUluZm86IHVwZGF0ZUluZm8sXG4gICAgICAgIHByb21wdEludmFsaWRJbWFnZTogcHJvbXB0SW52YWxpZEltYWdlLFxuICAgICAgICB2YWxpZGF0ZVVSTDogdmFsaWRhdGVVUkwsXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkQmFja2dyb3VuZEltYWdlXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEJhY2tncm91bmRJbWFnZShub2RlcywgYmdPYmosIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH1cblxuICBtYWluVXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uKG5vZGVzLCBiZ09iail7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCB8fCAhYmdPYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBiZ09ialsnZmlyc3RUaW1lJ10gPSB0cnVlO1xuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGJnT2JqOiBiZ09iaixcbiAgICAgICAgbm9kZXM6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlQmFja2dyb3VuZEltYWdlXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZShub2RlcywgYmdPYmopO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH1cblxuICBtYWluVXRpbGl0aWVzLnVwZGF0ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uKG5vZGVzLCBiZ09iail7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCB8fCAhYmdPYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBiZ09iajogYmdPYmosXG4gICAgICAgIG5vZGVzOiBub2Rlc1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInVwZGF0ZUJhY2tncm91bmRJbWFnZVwiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIGJnT2JqKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9XG5cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbihub2Rlcywgb2xkSW1nLCBuZXdJbWcsIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpe1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDAgfHwgIW9sZEltZyB8fCAhbmV3SW1nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgb2xkSW1nOiBvbGRJbWcsXG4gICAgICAgIG5ld0ltZzogbmV3SW1nLFxuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZSxcbiAgICAgICAgdXBkYXRlSW5mbzogdXBkYXRlSW5mbyxcbiAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlOiBwcm9tcHRJbnZhbGlkSW1hZ2UsXG4gICAgICAgIHZhbGlkYXRlVVJMOiB2YWxpZGF0ZVVSTFxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUJhY2tncm91bmRJbWFnZVwiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIG9sZEltZywgbmV3SW1nLCB0cnVlLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9XG5cbiAgcmV0dXJuIG1haW5VdGlsaXRpZXM7XG59O1xuIiwiLypcbiAqICBFeHRlbmQgZGVmYXVsdCBvcHRpb25zIGFuZCBnZXQgY3VycmVudCBvcHRpb25zIGJ5IHVzaW5nIHRoaXMgZmlsZVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgLy8gVGhlIHBhdGggb2YgY29yZSBsaWJyYXJ5IGltYWdlcyB3aGVuIHNiZ252aXogaXMgcmVxdWlyZWQgZnJvbSBucG0gYW5kIHRoZSBpbmRleCBodG1sXG4gICAgLy8gZmlsZSBhbmQgbm9kZV9tb2R1bGVzIGFyZSB1bmRlciB0aGUgc2FtZSBmb2xkZXIgdGhlbiB1c2luZyB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBmaW5lXG4gICAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxuICAgIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xuICAgIGZpdExhYmVsc1RvTm9kZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIGZpdExhYmVsc1RvSW5mb2JveGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvLyBkeW5hbWljIGxhYmVsIHNpemUgaXQgbWF5IGJlICdzbWFsbCcsICdyZWd1bGFyJywgJ2xhcmdlJ1xuICAgIGR5bmFtaWNMYWJlbFNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAncmVndWxhcic7XG4gICAgfSxcbiAgICAvLyBXaGV0aGVyIHRvIGluZmVyIG5lc3Rpbmcgb24gbG9hZCBcbiAgICBpbmZlck5lc3RpbmdPbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcbiAgICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAxMDtcbiAgICB9LFxuICAgIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xuICAgIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcbiAgICAvLyBXaGV0aGVyIHRoZSBhY3Rpb25zIGFyZSB1bmRvYWJsZSwgcmVxdWlyZXMgY3l0b3NjYXBlLXVuZG8tcmVkbyBleHRlbnNpb25cbiAgICB1bmRvYWJsZTogdHJ1ZSxcbiAgICAvLyBXaGV0aGVyIHRvIGhhdmUgdW5kb2FibGUgZHJhZyBmZWF0dXJlIGluIHVuZG8vcmVkbyBleHRlbnNpb24uIFRoaXMgb3B0aW9ucyB3aWxsIGJlIHBhc3NlZCB0byB1bmRvL3JlZG8gZXh0ZW5zaW9uXG4gICAgdW5kb2FibGVEcmFnOiB0cnVlXG4gIH07XG5cbiAgdmFyIG9wdGlvblV0aWxpdGllcyA9IGZ1bmN0aW9uICgpIHtcbiAgfTtcblxuICAvLyBFeHRlbmQgdGhlIGRlZmF1bHRzIG9wdGlvbnMgd2l0aCB0aGUgdXNlciBvcHRpb25zXG4gIG9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICBmb3IgKHZhciBwcm9wIGluIGRlZmF1bHRzKSB7XG4gICAgICByZXN1bHRbcHJvcF0gPSBkZWZhdWx0c1twcm9wXTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBwcm9wIGluIG9wdGlvbnMpIHtcbiAgICAgIHJlc3VsdFtwcm9wXSA9IG9wdGlvbnNbcHJvcF07XG4gICAgfVxuXG4gICAgb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnMgPSByZXN1bHQ7XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfTtcblxuICBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnM7XG4gIH07XG5cbiAgcmV0dXJuIG9wdGlvblV0aWxpdGllcztcbn07XG4iLCJ2YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciAkID0gbGlicy5qUXVlcnk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucywgb3B0aW9ucywgY3k7XG5cbiAgdmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gZnVuY3Rpb24gKHBhcmFtKSB7XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHBhcmFtLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xuICAgIG9wdGlvbnMgPSBwYXJhbS5vcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KCk7XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgdW5kby1yZWRvIGluc3RhbmNlXG4gICAgdmFyIHVyID0gY3kudW5kb1JlZG8oe1xuICAgICAgdW5kb2FibGVEcmFnOiBvcHRpb25zLnVuZG9hYmxlRHJhZ1xuICAgIH0pO1xuXG4gICAgLy8gcmVnaXN0ZXIgYWRkIHJlbW92ZSBhY3Rpb25zXG4gICAgdXIuYWN0aW9uKFwiYWRkTm9kZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGROb2RlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU2ltcGxlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcbiAgICB1ci5hY3Rpb24oXCJhZGRFZGdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEVkZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICAgIHVyLmFjdGlvbihcImFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU21hcnRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NtYXJ0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XG4gICAgdXIuYWN0aW9uKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKTtcblxuICAgIC8vIHJlZ2lzdGVyIGdlbmVyYWwgYWN0aW9uc1xuICAgIHVyLmFjdGlvbihcInJlc2l6ZU5vZGVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2Rlcyk7XG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsKTtcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VEYXRhXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEpO1xuICAgIHVyLmFjdGlvbihcInVwZGF0ZVNldEZpZWxkXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZVNldEZpZWxkLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVTZXRGaWVsZCk7XG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlQ3NzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzKTtcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VCZW5kUG9pbnRzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMpO1xuICAgIHVyLmFjdGlvbihcImNoYW5nZUZvbnRQcm9wZXJ0aWVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcyk7XG4gICAgdXIuYWN0aW9uKFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1MYXlvdXQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUxheW91dCk7XG4gICAgdXIuYWN0aW9uKFwiaGlkZUFuZFBlcmZvcm1MYXlvdXRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuaGlkZUFuZFBlcmZvcm1MYXlvdXQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9IaWRlQW5kUGVyZm9ybUxheW91dCk7XG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlQW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVBbmRQZXJmb3JtTGF5b3V0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvRGVsZXRlQW5kUGVyZm9ybUxheW91dCk7XG4gICAgdXIuYWN0aW9uKFwiYXBwbHlTSUZUb3BvbG9neUdyb3VwaW5nXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFwcGx5U0lGVG9wb2xvZ3lHcm91cGluZywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYXBwbHlTSUZUb3BvbG9neUdyb3VwaW5nKTtcblxuICAgIC8vIHJlZ2lzdGVyIFNCR04gYWN0aW9uc1xuICAgIHVyLmFjdGlvbihcImFkZFN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCk7XG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94KTtcbiAgICB1ci5hY3Rpb24oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMpO1xuICAgIHVyLmFjdGlvbihcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cyk7XG4gICAgdXIuYWN0aW9uKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94KTtcbiAgICB1ci5hY3Rpb24oXCJmaXRVbml0c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5maXRVbml0cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZVVuaXRzKTtcbiAgICB1ci5hY3Rpb24oXCJhZGRCYWNrZ3JvdW5kSW1hZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkQmFja2dyb3VuZEltYWdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVCYWNrZ3JvdW5kSW1hZ2UpO1xuICAgIHVyLmFjdGlvbihcInJlbW92ZUJhY2tncm91bmRJbWFnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVCYWNrZ3JvdW5kSW1hZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEJhY2tncm91bmRJbWFnZSk7XG4gICAgdXIuYWN0aW9uKFwidXBkYXRlQmFja2dyb3VuZEltYWdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUJhY2tncm91bmRJbWFnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlQmFja2dyb3VuZEltYWdlKTtcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VCYWNrZ3JvdW5kSW1hZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmFja2dyb3VuZEltYWdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UpO1xuICAgIHVyLmFjdGlvbihcInVwZGF0ZUluZm9ib3hTdHlsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94U3R5bGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUluZm9ib3hTdHlsZSk7XG4gICAgdXIuYWN0aW9uKFwidXBkYXRlSW5mb2JveE9ialwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94T2JqLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94T2JqKTtcblxuICAgIC8vIHJlZ2lzdGVyIGVhc3kgY3JlYXRpb24gYWN0aW9uc1xuICAgIHVyLmFjdGlvbihcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gICAgdXIuYWN0aW9uKFwic2V0RGVmYXVsdFByb3BlcnR5XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5KTtcbiAgICB1ci5hY3Rpb24oXCJjb252ZXJ0SW50b1JldmVyc2libGVSZWFjdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jb252ZXJ0SW50b1JldmVyc2libGVSZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY29udmVydEludG9SZXZlcnNpYmxlUmVhY3Rpb24pO1xuXG4gICAgdXIuYWN0aW9uKFwibW92ZUVkZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMubW92ZUVkZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLm1vdmVFZGdlKTtcbiAgICB1ci5hY3Rpb24oXCJmaXhFcnJvclwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5maXhFcnJvcix1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmZpeEVycm9yKTtcbiAgICB1ci5hY3Rpb24oXCJjbG9uZUhpZ2hEZWdyZWVOb2RlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNsb25lSGlnaERlZ3JlZU5vZGUsdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5DbG9uZUhpZ2hEZWdyZWVOb2RlKTtcblxuICAgIHVyLmFjdGlvbihcImNoYW5nZU1hcFR5cGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTWFwVHlwZSx1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VNYXBUeXBlKTtcbiAgICB1ci5hY3Rpb24oXCJzZXRDb21wb3VuZFBhZGRpbmdcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q29tcG91bmRQYWRkaW5nLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDb21wb3VuZFBhZGRpbmcpO1xuXG4gIH07XG5cbiAgcmV0dXJuIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zO1xufTtcbiIsInZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgaW5zdGFuY2U7XG5cbiAgZnVuY3Rpb24gc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzIChvcHRpb25zKSB7XG5cbiAgICBpbnN0YW5jZSA9IGxpYnMuc2JnbnZpeihvcHRpb25zKTtcblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0Q3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5nZXRDeSgpO1xuICB9XG5cbiAgcmV0dXJuIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcztcbn07XG4iLCJ2YXIgaXNFcXVhbCA9IHJlcXVpcmUoJ2xvZGFzaC5pc2VxdWFsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgdmFyIGN5LCBlbGVtZW50VXRpbGl0aWVzO1xuICB2YXIgZ3JvdXBDb21wb3VuZFR5cGUsIG1ldGFFZGdlSWRlbnRpZmllciwgbG9ja0dyYXBoVG9wb2xvZ3ksIHNob3VsZEFwcGx5O1xuXG4gIHZhciBERUZBVUxUX0dST1VQX0NPTVBPVU5EX1RZUEUgPSAndG9wb2xvZ3kgZ3JvdXAnO1xuICB2YXIgRURHRV9TVFlMRV9OQU1FUyA9IFsgJ2xpbmUtY29sb3InLCAnd2lkdGgnIF07XG5cbiAgZnVuY3Rpb24gdG9wb2xvZ3lHcm91cGluZyggcGFyYW0sIHByb3BzICkge1xuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KClcbiAgICBlbGVtZW50VXRpbGl0aWVzID0gcGFyYW0uZWxlbWVudFV0aWxpdGllcztcblxuICAgIGdyb3VwQ29tcG91bmRUeXBlID0gcHJvcHMuZ3JvdXBDb21wb3VuZFR5cGUgfHwgREVGQVVMVF9HUk9VUF9DT01QT1VORF9UWVBFO1xuICAgIG1ldGFFZGdlSWRlbnRpZmllciA9IHByb3BzLm1ldGFFZGdlSWRlbnRpZmllcjtcbiAgICBsb2NrR3JhcGhUb3BvbG9neSA9IHByb3BzLmxvY2tHcmFwaFRvcG9sb2d5O1xuICAgIHNob3VsZEFwcGx5ID0gcHJvcHMuc2hvdWxkQXBwbHkgfHwgdHJ1ZTtcblxuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9IGZhbHNlO1xuICAgIGluaXRNZXRhU3R5bGVNYXAoKTtcbiAgfVxuXG4gIHRvcG9sb2d5R3JvdXBpbmcuYXBwbHkgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCB8fCAhZXZhbE9wdCggc2hvdWxkQXBwbHkgKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbGlzdCA9IGN5Lm5vZGVzKCkubWFwKCBmdW5jdGlvbiggbm9kZSApIHtcbiAgICAgIHJldHVybiBbIG5vZGUgXTtcbiAgICB9ICk7XG5cbiAgICAvLyBkZXRlcm1pbmUgbm9kZSBncm91cHMgYnkgdGhlaXIgdG9wb2xvZ3lcbiAgXHR2YXIgZ3JvdXBzID0gZ2V0Tm9kZUdyb3VwcyggbGlzdCApO1xuICBcdC8vIGFwcGx5IGdyb3VwaW5nIGluIGN5IGxldmVsXG4gIFx0YXBwbHlHcm91cGluZyggZ3JvdXBzICk7XG5cbiAgICB0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgPSB0cnVlO1xuXG4gICAgaWYgKCBsb2NrR3JhcGhUb3BvbG9neSApIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMubG9ja0dyYXBoVG9wb2xvZ3koKTtcbiAgICB9XG5cbiAgXHRyZXR1cm4gZ3JvdXBzO1xuICB9O1xuXG4gIHRvcG9sb2d5R3JvdXBpbmcudW5hcHBseSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICggIXRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbWV0YUVkZ2VzID0gdG9wb2xvZ3lHcm91cGluZy5nZXRNZXRhRWRnZXMoKTtcbiAgICBtZXRhRWRnZXMuZm9yRWFjaCggZnVuY3Rpb24oIGVkZ2UgKSB7XG4gICAgICB2YXIgdG9SZXN0b3JlID0gZWRnZS5kYXRhKCd0Zy10by1yZXN0b3JlJyk7XG4gICAgICBlZGdlLnJlbW92ZSgpO1xuICAgICAgdG9SZXN0b3JlLnJlc3RvcmUoKTtcblxuICAgICAgRURHRV9TVFlMRV9OQU1FUy5mb3JFYWNoKCBmdW5jdGlvbiggbmFtZSApIHtcbiAgICAgICAgdmFyIG9sZFZhbCA9IHRvcG9sb2d5R3JvdXBpbmcubWV0YVN0eWxlTWFwWyBuYW1lIF1bIGVkZ2UuaWQoKSBdO1xuICAgICAgICB2YXIgbmV3VmFsID0gZWRnZS5kYXRhKCBuYW1lICk7XG5cbiAgICAgICAgaWYgKCBvbGRWYWwgIT09IG5ld1ZhbCApIHtcbiAgICAgICAgICB0b1Jlc3RvcmUuZGF0YSggbmFtZSwgbmV3VmFsICk7XG4gICAgICAgIH1cbiAgICAgIH0gKTtcbiAgICB9ICk7XG5cbiAgICBpbml0TWV0YVN0eWxlTWFwKCk7XG5cbiAgICB2YXIgcGFyZW50cyA9IHRvcG9sb2d5R3JvdXBpbmcuZ2V0R3JvdXBDb21wb3VuZHMoKTtcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudCggcGFyZW50cy5jaGlsZHJlbigpLCBudWxsICk7XG4gICAgcGFyZW50cy5yZW1vdmUoKTtcblxuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9IGZhbHNlO1xuXG4gICAgaWYgKCBsb2NrR3JhcGhUb3BvbG9neSApIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudW5sb2NrR3JhcGhUb3BvbG9neSgpO1xuICAgIH1cbiAgfTtcblxuICB0b3BvbG9neUdyb3VwaW5nLmdldE1ldGFFZGdlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBtZXRhRWRnZXMgPSBjeS5lZGdlcygnWycgKyBtZXRhRWRnZUlkZW50aWZpZXIgKyAnXScpO1xuICAgIHJldHVybiBtZXRhRWRnZXM7XG4gIH07XG5cbiAgdG9wb2xvZ3lHcm91cGluZy5nZXRHcm91cENvbXBvdW5kcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjbGFzc05hbWUgPSBncm91cENvbXBvdW5kVHlwZTtcbiAgICByZXR1cm4gY3kubm9kZXMoJ1tjbGFzcz1cIicgKyBjbGFzc05hbWUgKyAnXCJdJyk7XG4gIH07XG5cbiAgdG9wb2xvZ3lHcm91cGluZy5jbGVhckFwcGxpZWRGbGFnID0gZnVuY3Rpb24oKSB7XG4gICAgdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkID0gZmFsc2U7XG4gIH07XG5cbiAgdG9wb2xvZ3lHcm91cGluZy5zZXRBcHBsaWVkRmxhZyA9IGZ1bmN0aW9uKGFwcGxpZWQpIHtcbiAgICB0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgPSBhcHBsaWVkO1xuICB9O1xuXG4gIHRvcG9sb2d5R3JvdXBpbmcudG9nZ2xlQXBwbGllZEZsYWcgPSBmdW5jdGlvbigpIHtcbiAgICB0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgPSAhdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGluaXRNZXRhU3R5bGVNYXAoKSB7XG4gICAgdG9wb2xvZ3lHcm91cGluZy5tZXRhU3R5bGVNYXAgPSB7fTtcbiAgICBFREdFX1NUWUxFX05BTUVTLmZvckVhY2goIGZ1bmN0aW9uKCBuYW1lICkge1xuICAgICAgdG9wb2xvZ3lHcm91cGluZy5tZXRhU3R5bGVNYXBbIG5hbWUgXSA9IHt9O1xuICAgIH0gKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGV2YWxPcHQoIG9wdCApIHtcbiAgICBpZiAoIHR5cGVvZiBvcHQgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICByZXR1cm4gb3B0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5vZGVHcm91cHMoIGxpc3QgKSB7XG4gICAgaWYgKCBsaXN0Lmxlbmd0aCA8PSAxICkge1xuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgdmFyIGhhbHZlcyA9IGdldEhhbHZlcyggbGlzdCApO1xuICAgIHZhciBmaXJzdFBhcnQgPSBnZXROb2RlR3JvdXBzKCBoYWx2ZXNbIDAgXSApO1xuICAgIHZhciBzZWNvbmRQYXJ0ID0gZ2V0Tm9kZUdyb3VwcyggaGFsdmVzWyAxIF0gKTtcbiAgICAvLyBtZXJnZSB0aGUgaGFsdmVzXG5cdCAgdmFyIGdyb3VwcyA9IG1lcmdlR3JvdXBzKCBmaXJzdFBhcnQsIHNlY29uZFBhcnQgKTtcblxuICAgIHJldHVybiBncm91cHM7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQYXJlbnRPclNlbGYoIG5vZGUgKSB7XG4gICAgdmFyIHBhcmVudCA9IG5vZGUucGFyZW50KCk7XG4gICAgcmV0dXJuIHBhcmVudC5zaXplKCkgPiAwID8gcGFyZW50IDogbm9kZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbGNHcm91cGluZ0tleSggZWRnZSApIHtcbiAgICB2YXIgc3JjSWQgPSBnZXRQYXJlbnRPclNlbGYoIGVkZ2Uuc291cmNlKCkgKS5pZCgpO1xuICAgIHZhciB0Z3RJZCA9IGdldFBhcmVudE9yU2VsZiggZWRnZS50YXJnZXQoKSApLmlkKCk7XG4gICAgdmFyIGVkZ2VUeXBlID0gZ2V0RWRnZVR5cGUoIGVkZ2UgKTtcblxuICAgIHJldHVybiBbIGVkZ2VUeXBlLCBzcmNJZCwgdGd0SWQgXS5qb2luKCAnLScgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRvTWFwQ2hhaW4oIG1hcCwga2V5LCB2YWwgKSB7XG4gICAgaWYgKCAhbWFwWyBrZXkgXSApIHtcbiAgICAgIG1hcFsga2V5IF0gPSBjeS5jb2xsZWN0aW9uKCk7XG4gICAgfVxuXG4gICAgbWFwWyBrZXkgXSA9IG1hcFsga2V5IF0uYWRkKCB2YWwgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGx5R3JvdXBpbmcoIGdyb3VwcyApIHtcbiAgICBncm91cHMuZm9yRWFjaCggZnVuY3Rpb24oIGdyb3VwICkge1xuICAgICAgY3JlYXRlR3JvdXBDb21wb3VuZCggZ3JvdXAgKTtcbiAgICB9ICk7XG5cbiAgICB2YXIgY29tcG91bmRzID0gdG9wb2xvZ3lHcm91cGluZy5nZXRHcm91cENvbXBvdW5kcygpO1xuICAgIHZhciBjaGlsZHJlbkVkZ2VzID0gY29tcG91bmRzLmNoaWxkcmVuKCkuY29ubmVjdGVkRWRnZXMoKTtcbiAgICB2YXIgZWRnZXNNYXAgPSBbXTtcblxuICAgIGNoaWxkcmVuRWRnZXMuZm9yRWFjaCggZnVuY3Rpb24oIGVkZ2UgKXtcbiAgICAgIHZhciBrZXkgPSBjYWxjR3JvdXBpbmdLZXkoIGVkZ2UgKTtcbiAgICAgIGFkZFRvTWFwQ2hhaW4oIGVkZ2VzTWFwLCBrZXksIGVkZ2UgKTtcbiAgICAgIGVkZ2UucmVtb3ZlKCk7XG4gICAgfSApO1xuXG4gICAgT2JqZWN0LmtleXMoIGVkZ2VzTWFwICkuZm9yRWFjaCggZnVuY3Rpb24oIGtleSApIHtcbiAgICAgIC8vIG1ha2UgYSBkdW1teSBlZGdlIGZvciBhbGwgb2YgZWRnZXMgdGhhdCBhcmUgbWFwcGVkIGJ5IGtleVxuICBcdFx0Ly8gZHVtbXkgZWRnZSBzaG91bGQgaGF2ZSBjb21tb24gcHJvcGVydGllcyBvZiBnaXZlbiBlZGdlc1xuICBcdFx0Ly8gYW5kIHNob3VsZCBjYXJyeSB0aGVpciBpZCBsaXN0IGluIGl0cyBkYXRhXG4gIFx0XHQvLyBmb3Igc291cmNlIGFuZCB0YXJnZXQgaXQgc2hvdWxkIGhhdmUgcGFyZW50IG9mIGNvbW1vbiBzb3VyY2UgYW5kIHRhcmdldFxuICAgICAgY3JlYXRlTWV0YUVkZ2VGb3IoIGVkZ2VzTWFwWyBrZXkgXSApO1xuICAgIH0gKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUdyb3VwQ29tcG91bmQoIGdyb3VwICkge1xuICAgIGlmICggZ3JvdXAubGVuZ3RoIDwgMiApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY29sbGVjdGlvbiA9IGN5LmNvbGxlY3Rpb24oKTtcblxuICAgIGdyb3VwLmZvckVhY2goIGZ1bmN0aW9uKCBub2RlICkge1xuICAgICAgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb24uYWRkKCBub2RlICk7XG4gICAgfSApO1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMoIGNvbGxlY3Rpb24sIGdyb3VwQ29tcG91bmRUeXBlICk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVNZXRhRWRnZUZvciggZWRnZXMgKSB7XG4gICAgdmFyIHNyY0lkID0gZ2V0UGFyZW50T3JTZWxmKCBlZGdlcy5zb3VyY2UoKSApLmlkKCk7XG4gICAgdmFyIHRndElkID0gZ2V0UGFyZW50T3JTZWxmKCBlZGdlcy50YXJnZXQoKSApLmlkKCk7XG4gICAgdmFyIHR5cGUgPSBlZGdlcy5kYXRhKCAnY2xhc3MnICk7XG4gICAgY3kucmVtb3ZlKCBlZGdlcyApO1xuXG4gICAgdmFyIG1ldGFFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKCBzcmNJZCwgdGd0SWQsIHR5cGUgKTtcbiAgICBtZXRhRWRnZS5kYXRhKCAndGctdG8tcmVzdG9yZScsIGVkZ2VzICk7XG4gICAgbWV0YUVkZ2UuZGF0YSggbWV0YUVkZ2VJZGVudGlmaWVyLCB0cnVlICk7XG5cbiAgICBFREdFX1NUWUxFX05BTUVTLmZvckVhY2goIGZ1bmN0aW9uKCBzdHlsZU5hbWUgKSB7XG4gICAgICBlZGdlcy5mb3JFYWNoKCBmdW5jdGlvbiggZWRnZSApIHtcbiAgICAgICAgdG9wb2xvZ3lHcm91cGluZy5tZXRhU3R5bGVNYXBbIHN0eWxlTmFtZSBdWyBlZGdlLmlkKCkgXSA9IGVkZ2UuZGF0YSggc3R5bGVOYW1lICk7XG4gICAgICB9ICk7XG5cbiAgICAgIHZhciBjb21tb25WYWwgPSBlbGVtZW50VXRpbGl0aWVzLmdldENvbW1vblByb3BlcnR5KGVkZ2VzLCBzdHlsZU5hbWUsICdkYXRhJyk7XG4gICAgICBpZiAoIGNvbW1vblZhbCApIHtcbiAgICAgICAgbWV0YUVkZ2UuZGF0YSggc3R5bGVOYW1lLCBjb21tb25WYWwgKTtcbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgICByZXR1cm4gbWV0YUVkZ2U7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZUdyb3VwcyggZ3JvdXBzMSwgZ3JvdXBzMiApIHtcbiAgICAvLyBub3RNZXJnZWRHcnMgd2lsbCBpbmNsdWRlIG1lbWJlcnMgb2YgZ3JvdXBzMSB0aGF0IGFyZSBub3QgbWVyZ2VkXG4gIFx0Ly8gbWVyZ2VkR3JzIHdpbGwgaW5jbHVkZSB0aGUgbWVyZ2VkIG1lbWJlcnMgZnJvbSAyIGdyb3Vwc1xuICBcdHZhciBub3RNZXJnZWRHcnMgPSBbXSwgbWVyZ2VkR3JzID0gW107XG5cbiAgICBncm91cHMxLmZvckVhY2goIGZ1bmN0aW9uKCBncjEgKSB7XG4gICAgICB2YXIgbWVyZ2VkID0gZmFsc2U7XG5cbiAgICAgIG1lcmdlZEdycy5jb25jYXQoIGdyb3VwczIgKS5mb3JFYWNoKCBmdW5jdGlvbiggZ3IyLCBpbmRleDIgKSB7XG4gICAgICAgIC8vIGlmIGdyb3VwcyBzaG91bGQgYmUgbWVyZ2VkIG1lcmdlIHRoZW0sIHJlbW92ZSBncjIgZnJvbSB3aGVyZSBpdFxuICAgICAgICAvLyBjb21lcyBmcm9tIGFuZCBwdXNoIHRoZSBtZXJnZSByZXN1bHQgdG8gbWVyZ2VkR3JzXG4gICAgICAgIGlmICggc2hvdWxkTWVyZ2UoIGdyMSwgZ3IyICkgKSB7XG4gICAgICAgICAgdmFyIG1lcmdlZEdyID0gZ3IxLmNvbmNhdCggZ3IyICk7XG5cbiAgICAgICAgICBpZiAoIGluZGV4MiA+PSBtZXJnZWRHcnMubGVuZ3RoICkge1xuICAgICAgICAgICAgcmVtb3ZlQXQoIGdyb3VwczIsIGluZGV4MiAtIG1lcmdlZEdycy5sZW5ndGggKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZW1vdmVBdCggbWVyZ2VkR3JzLCBpbmRleDIgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBtYXJrIGFzIG1lcmdlZCBhbmQgYnJlYWsgdGhlIGxvb3BcbiAgICAgICAgICBtZXJnZWRHcnMucHVzaCggbWVyZ2VkR3IgKTtcbiAgICAgICAgICBtZXJnZWQgPSB0cnVlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSApO1xuXG4gICAgICAvLyBpZiBncjEgaXMgbm90IG1lcmdlZCBwdXNoIGl0IHRvIG5vdE1lcmdlZEdyc1xuICAgICAgaWYgKCAhbWVyZ2VkICkge1xuICAgICAgICBub3RNZXJnZWRHcnMucHVzaCggZ3IxICk7XG4gICAgICB9XG4gICAgfSApO1xuXG4gICAgLy8gdGhlIGdyb3VwcyB0aGF0IGNvbWVzIGZyb20gZ3JvdXBzMiBidXQgbm90IG1lcmdlZCBhcmUgc3RpbGwgaW5jbHVkZWRcblx0ICAvLyBpbiBncm91cHMyIGFkZCB0aGVtIHRvIHRoZSByZXN1bHQgdG9nZXRoZXIgd2l0aCBtZXJnZWRHcnMgYW5kIG5vdE1lcmdlZEdyc1xuICAgIHJldHVybiBub3RNZXJnZWRHcnMuY29uY2F0KCBtZXJnZWRHcnMsIGdyb3VwczIgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZE1lcmdlKCBncm91cDEsIGdyb3VwMiApIHtcbiAgICAvLyB1c2luZyBmaXJzdCBlbGVtZW50cyBpcyBlbm91Z2ggdG8gZGVjaWRlIHdoZXRoZXIgdG8gbWVyZ2VcbiAgXHR2YXIgbm9kZTEgPSBncm91cDFbIDAgXTtcbiAgXHR2YXIgbm9kZTIgPSBncm91cDJbIDAgXTtcblxuICAgIGlmICggbm9kZTEuZWRnZXMoKS5sZW5ndGggIT09IG5vZGUyLmVkZ2VzKCkubGVuZ3RoICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBnZXRVbmRpcmVjdGVkRWRnZXMgPSBmdW5jdGlvbiggbm9kZSApIHtcbiAgICAgIHZhciBlZGdlcyA9IG5vZGUuY29ubmVjdGVkRWRnZXMoKS5maWx0ZXIoIGlzVW5kaXJlY3RlZEVkZ2UgKTtcbiAgICAgIHJldHVybiBlZGdlcztcbiAgICB9O1xuICAgIC8vIHVuZGlyZWN0ZWQgZWRnZXMgb2Ygbm9kZTEgYW5kIG5vZGUyIHJlc3BlY3RpdmVseVxuICAgIHZhciB1bmRpcjEgPSBnZXRVbmRpcmVjdGVkRWRnZXMoIG5vZGUxICk7XG4gICAgdmFyIHVuZGlyMiA9IGdldFVuZGlyZWN0ZWRFZGdlcyggbm9kZTIgKTtcblxuICAgIHZhciBpbjEgPSBub2RlMS5pbmNvbWVycygpLmVkZ2VzKCkubm90KCB1bmRpcjEgKTtcbiAgICB2YXIgaW4yID0gbm9kZTIuaW5jb21lcnMoKS5lZGdlcygpLm5vdCggdW5kaXIyICk7XG5cbiAgICB2YXIgb3V0MSA9IG5vZGUxLm91dGdvZXJzKCkuZWRnZXMoKS5ub3QoIHVuZGlyMSApO1xuXHQgIHZhciBvdXQyID0gbm9kZTIub3V0Z29lcnMoKS5lZGdlcygpLm5vdCggdW5kaXIyICk7XG5cbiAgICByZXR1cm4gY29tcGFyZUVkZ2VHcm91cCggaW4xLCBpbjIsIG5vZGUxLCBub2RlMiApXG4gICAgICAgICAgICAmJiBjb21wYXJlRWRnZUdyb3VwKCBvdXQxLCBvdXQyLCBub2RlMSwgbm9kZTIgKVxuICAgICAgICAgICAgJiYgY29tcGFyZUVkZ2VHcm91cCggdW5kaXIxLCB1bmRpcjIsIG5vZGUxLCBub2RlMiApO1xuICB9XG5cbiAgLy8gZGVjaWRlIGlmIDIgZWRnZSBncm91cHMgY29udGFpbnMgc2V0IG9mIGVkZ2VzIHdpdGggc2ltaWxhciBjb250ZW50ICh0eXBlLFxuICAvLyBzb3VyY2UsdGFyZ2V0KSByZWxhdGl2ZSB0byB0aGVpciBub2RlcyB3aGVyZSBncjEgYXJlIGVkZ2VzIG9mIG5vZGUxIGFuZCBncjIgYXJlIGVkZ2VzIG9mXG4gIC8vIG5vZGUyXG4gIGZ1bmN0aW9uIGNvbXBhcmVFZGdlR3JvdXAoIGdyMSwgZ3IyLCBub2RlMSwgbm9kZTIgKSB7XG4gICAgdmFyIGlkMSA9IG5vZGUxLmlkKCk7XG4gICAgdmFyIGlkMiA9IG5vZGUyLmlkKCk7XG5cbiAgICB2YXIgbWFwMSA9IGZpbGxJZFRvVHlwZVNldE1hcCggZ3IxLCBub2RlMSApO1xuICAgIHZhciBtYXAyID0gZmlsbElkVG9UeXBlU2V0TWFwKCBncjIsIG5vZGUyICk7XG5cbiAgICBpZiAoIE9iamVjdC5rZXlzKCBtYXAxICkubGVuZ3RoICE9PSBPYmplY3Qua2V5cyggbWFwMiApLmxlbmd0aCApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZmFpbGVkID0gZmFsc2U7XG5cbiAgICBPYmplY3Qua2V5cyggbWFwMSApLmZvckVhY2goIGZ1bmN0aW9uKCBrZXkgKSB7XG4gICAgICAvLyBpZiBhbHJlYWR5IGZhaWxlZCBqdXN0IHJldHVyblxuICAgICAgaWYgKCBmYWlsZWQgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gaWYga2V5IGlzIGlkMiB1c2UgaWQxIGluc3RlYWQgYmVjYXVzZSBjb21wYXJpc29uIGlzIHJlbGF0aXZlIHRvIG5vZGVzXG4gICAgICB2YXIgb3RoZXJLZXkgPSAoIGtleSA9PSBpZDIgKSA/IGlkMSA6IGtleTtcblxuICAgICAgLy8gY2hlY2sgaWYgdGhlIHNldHMgaGF2ZSB0aGUgc2FtZSBjb250ZW50XG4gIFx0XHQvLyBpZiBjaGVjayBmYWlscyByZXR1cm4gZmFsc2VcbiAgICAgIGlmICggIWlzRXF1YWwoIG1hcDFbIGtleSBdLCBtYXAyWyBvdGhlcktleSBdICkgKSB7XG4gICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSApO1xuXG4gICAgLy8gaWYgY2hlY2sgcGFzc2VzIGZvciBlYWNoIGtleSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiAhZmFpbGVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmlsbElkVG9UeXBlU2V0TWFwKCBlZGdlR3JvdXAsIG5vZGUgKSB7XG4gICAgdmFyIG1hcCA9IHt9O1xuICAgIHZhciBub2RlSWQgPSBub2RlLmlkKCk7XG5cbiAgICBlZGdlR3JvdXAuZm9yRWFjaCggZnVuY3Rpb24oIGVkZ2UgKSB7XG4gICAgICB2YXIgc3JjSWQgPSBlZGdlLmRhdGEoJ3NvdXJjZScpO1xuICAgICAgdmFyIHRndElkID0gZWRnZS5kYXRhKCd0YXJnZXQnKTtcbiAgICAgIHZhciBlZGdlSWQgPSBlZGdlLmlkKCk7XG5cbiAgICAgIHZhciBvdGhlckVuZCA9ICggbm9kZUlkID09PSB0Z3RJZCApID8gc3JjSWQgOiB0Z3RJZDtcblxuICAgICAgZnVuY3Rpb24gYWRkVG9SZWxhdGVkU2V0KCBzaWRlU3RyLCB2YWx1ZSApIHtcbiAgICAgICAgaWYgKCAhbWFwWyBzaWRlU3RyIF0gKSB7XG4gICAgICAgICAgbWFwWyBzaWRlU3RyIF0gPSBuZXcgU2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBtYXBbIHNpZGVTdHIgXS5hZGQoIHZhbHVlICk7XG4gICAgICB9XG5cbiAgICAgIHZhciBlZGdlVHlwZSA9IGdldEVkZ2VUeXBlKCBlZGdlICk7XG5cbiAgICAgIGFkZFRvUmVsYXRlZFNldCggb3RoZXJFbmQsIGVkZ2VUeXBlICk7XG4gICAgfSApO1xuXG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEVkZ2VUeXBlKCBlZGdlICkge1xuICAgIHJldHVybiBlZGdlLmRhdGEoICdjbGFzcycgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVW5kaXJlY3RlZEVkZ2UoIGVkZ2UgKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNVbmRpcmVjdGVkRWRnZSggZWRnZSApO1xuICB9XG5cbiAgLy8gZ2V0IGhhbHZlcyBvZiBhIGxpc3QuIEl0IGlzIGFzc3VtZWQgdGhhdCBsaXN0IHNpemUgaXMgYXQgbGVhc3QgMi5cbiAgZnVuY3Rpb24gZ2V0SGFsdmVzKCBsaXN0ICkge1xuICAgIHZhciBzID0gbGlzdC5sZW5ndGg7XG4gICAgdmFyIGhhbGZJbmRleCA9IE1hdGguZmxvb3IoIHMgLyAyICk7XG4gICAgdmFyIGZpcnN0SGFsZiA9IGxpc3Quc2xpY2UoIDAsIGhhbGZJbmRleCApO1xuICAgIHZhciBzZWNvbmRIYWxmID0gbGlzdC5zbGljZSggaGFsZkluZGV4LCBzICk7XG5cbiAgICByZXR1cm4gWyBmaXJzdEhhbGYsIHNlY29uZEhhbGYgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUF0KCBhcnIsIGluZGV4ICkge1xuICAgIGFyci5zcGxpY2UoIGluZGV4LCAxICk7XG4gIH1cblxuICByZXR1cm4gdG9wb2xvZ3lHcm91cGluZztcbn07XG4iLCIvLyBFeHRlbmRzIHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgc2JnbnZpekluc3RhbmNlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucywgZWxlbWVudFV0aWxpdGllcywgY3ksIHRvcG9sb2d5R3JvdXBpbmc7XG5cbiAgZnVuY3Rpb24gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNFeHRlbmRlciAocGFyYW0pIHtcblxuICAgIHNiZ252aXpJbnN0YW5jZSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRJbnN0YW5jZSgpO1xuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KCk7XG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSBzYmdudml6SW5zdGFuY2UudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG4gICAgZWxlbWVudFV0aWxpdGllcyA9IHBhcmFtLmVsZW1lbnRVdGlsaXRpZXM7XG4gICAgdG9wb2xvZ3lHcm91cGluZyA9IHBhcmFtLnNpZlRvcG9sb2d5R3JvdXBpbmc7XG5cbiAgICBleHRlbmQoKTtcbiAgfVxuXG4gIC8vIEV4dGVuZHMgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgd2l0aCBjaGlzZSBzcGVjaWZpYyBmZWF0dXJlc1xuICBmdW5jdGlvbiBleHRlbmQgKCkge1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYXBwbHlTSUZUb3BvbG9neUdyb3VwaW5nID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgIHZhciBvbGRFbGVzLCBuZXdFbGVzO1xuICAgICAgaWYgKCBwYXJhbS5maXJzdFRpbWUgKSB7XG4gICAgICAgIG9sZEVsZXMgPSBjeS5lbGVtZW50cygpO1xuXG4gICAgICAgIGlmIChwYXJhbS5hcHBseSkge1xuICAgICAgICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbHkoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0b3BvbG9neUdyb3VwaW5nLnVuYXBwbHkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0VsZXMgPSBjeS5lbGVtZW50cygpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG9sZEVsZXMgPSBwYXJhbS5vbGRFbGVzO1xuICAgICAgICBuZXdFbGVzID0gcGFyYW0ubmV3RWxlcztcblxuICAgICAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy51bmxvY2tHcmFwaFRvcG9sb2d5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5sb2NrR3JhcGhUb3BvbG9neSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgb2xkRWxlcy5yZW1vdmUoKTtcbiAgICAgICAgbmV3RWxlcy5yZXN0b3JlKCk7XG5cbiAgICAgICAgdG9wb2xvZ3lHcm91cGluZy50b2dnbGVBcHBsaWVkRmxhZygpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVzdWx0ID0geyBvbGRFbGVzOiBuZXdFbGVzLCBuZXdFbGVzOiBvbGRFbGVzIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gYWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGROb2RlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICB2YXIgbmV3Tm9kZSA9IHBhcmFtLm5ld05vZGU7XG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShuZXdOb2RlLngsIG5ld05vZGUueSwgbmV3Tm9kZS5jbGFzcywgbmV3Tm9kZS5pZCwgbmV3Tm9kZS5wYXJlbnQsIG5ld05vZGUudmlzaWJpbGl0eSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IHJlc3VsdFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgdmFyIG5ld0VkZ2UgPSBwYXJhbS5uZXdFZGdlO1xuICAgICAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3RWRnZS5zb3VyY2UsIG5ld0VkZ2UudGFyZ2V0LCBuZXdFZGdlLmNsYXNzLCBuZXdFZGdlLmlkLCBuZXdFZGdlLnZpc2liaWxpdHkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiByZXN1bHRcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMocGFyYW0uc291cmNlLCBwYXJhbS50YXJnZXQsIHBhcmFtLnByb2Nlc3NUeXBlKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZWxlczogcmVzdWx0XG4gICAgICB9O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICAvLyBOb2RlcyB0byBtYWtlIGNvbXBvdW5kLCB0aGVpciBkZXNjZW5kYW50cyBhbmQgZWRnZXMgY29ubmVjdGVkIHRvIHRoZW0gd2lsbCBiZSByZW1vdmVkIGR1cmluZyBjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgb3BlcmF0aW9uXG4gICAgICAgIC8vIChpbnRlcm5hbGx5IGJ5IGVsZXMubW92ZSgpIG9wZXJhdGlvbiksIHNvIG1hcmsgdGhlbSBhcyByZW1vdmVkIGVsZXMgZm9yIHVuZG8gb3BlcmF0aW9uLlxuICAgICAgICB2YXIgbm9kZXNUb01ha2VDb21wb3VuZCA9IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQ7XG4gICAgICAgIHZhciByZW1vdmVkRWxlcyA9IG5vZGVzVG9NYWtlQ29tcG91bmQudW5pb24obm9kZXNUb01ha2VDb21wb3VuZC5kZXNjZW5kYW50cygpKTtcbiAgICAgICAgcmVtb3ZlZEVsZXMgPSByZW1vdmVkRWxlcy51bmlvbihyZW1vdmVkRWxlcy5jb25uZWN0ZWRFZGdlcygpKTtcbiAgICAgICAgcmVzdWx0LnJlbW92ZWRFbGVzID0gcmVtb3ZlZEVsZXM7XG4gICAgICAgIC8vIEFzc3VtZSB0aGF0IGFsbCBub2RlcyB0byBtYWtlIGNvbXBvdW5kIGhhdmUgdGhlIHNhbWUgcGFyZW50XG4gICAgICAgIHZhciBvbGRQYXJlbnRJZCA9IG5vZGVzVG9NYWtlQ29tcG91bmRbMF0uZGF0YShcInBhcmVudFwiKTtcbiAgICAgICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZFxuICAgICAgICAvLyBOZXcgZWxlcyBpbmNsdWRlcyBuZXcgY29tcG91bmQgYW5kIHRoZSBtb3ZlZCBlbGVzIGFuZCB3aWxsIGJlIHVzZWQgaW4gdW5kbyBvcGVyYXRpb24uXG4gICAgICAgIHJlc3VsdC5uZXdFbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMobm9kZXNUb01ha2VDb21wb3VuZCwgcGFyYW0uY29tcG91bmRUeXBlKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQucmVtb3ZlZEVsZXMgPSBwYXJhbS5uZXdFbGVzLnJlbW92ZSgpO1xuICAgICAgICByZXN1bHQubmV3RWxlcyA9IHBhcmFtLnJlbW92ZWRFbGVzLnJlc3RvcmUoKTtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXIocmVzdWx0Lm5ld0VsZXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvLyBTZWN0aW9uIEVuZFxuICAgIC8vIGFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xuXG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgICAgIHZhciBlbGVzO1xuXG4gICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgIGVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24ocGFyYW0udGVtcGxhdGVUeXBlLCBwYXJhbS5tYWNyb21vbGVjdWxlTGlzdCwgcGFyYW0uY29tcGxleE5hbWUsIHBhcmFtLnByb2Nlc3NQb3NpdGlvbiwgcGFyYW0udGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCBwYXJhbS50aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgcGFyYW0uZWRnZUxlbmd0aCwgcGFyYW0ubGF5b3V0UGFyYW0pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcyA9IHBhcmFtO1xuICAgICAgICBjeS5hZGQoZWxlcyk7XG5cbiAgICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgICBlbGVzLnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiBlbGVzXG4gICAgICB9O1xuICAgIH07XG5cbiAgICAvLyBTZWN0aW9uIEVuZFxuICAgIC8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xuXG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIGdlbmVyYWwgYWN0aW9uIGZ1bmN0aW9uc1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwb3NpdGlvbnMgPSB7fTtcbiAgICAgIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XG5cbiAgICAgIG5vZGVzLmVhY2goZnVuY3Rpb24oZWxlLCBpKSB7XG4gICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zaXRpb25zW2VsZS5pZCgpXSA9IHtcbiAgICAgICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxuICAgICAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcG9zaXRpb25zO1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyA9IGZ1bmN0aW9uIChwb3NpdGlvbnMpIHtcbiAgICAgIHZhciBjdXJyZW50UG9zaXRpb25zID0ge307XG4gICAgICBjeS5ub2RlcygpLnBvc2l0aW9ucyhmdW5jdGlvbiAoZWxlLCBpKSB7XG4gICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudFBvc2l0aW9uc1tlbGUuaWQoKV0gPSB7XG4gICAgICAgICAgeDogZWxlLnBvc2l0aW9uKFwieFwiKSxcbiAgICAgICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHBvcyA9IHBvc2l0aW9uc1tlbGUuaWQoKV07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgeDogcG9zLngsXG4gICAgICAgICAgeTogcG9zLnlcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gY3VycmVudFBvc2l0aW9ucztcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWVcbiAgICAgIH07XG5cbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gICAgICByZXN1bHQuc2l6ZU1hcCA9IHt9O1xuICAgICAgcmVzdWx0LnVzZUFzcGVjdFJhdGlvID0gZmFsc2U7XG4gICAgICByZXN1bHQucHJlc2VydmVSZWxhdGl2ZVBvcyA9IHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3M7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYobm9kZS5pc1BhcmVudCgpKXtcbiAgICAgICAgICByZXN1bHQuc2l6ZU1hcFtub2RlLmlkKCldID0ge1xuICAgICAgICAgICAgdzogbm9kZS5kYXRhKFwibWluV2lkdGhcIikgfHwgMCxcbiAgICAgICAgICAgIGg6IG5vZGUuZGF0YShcIm1pbkhlaWdodFwiKSB8fCAwLFxuICAgICAgICAgICAgYmlhc0wgOiBub2RlLmRhdGEoXCJtaW5XaWR0aEJpYXNMZWZ0XCIpIHx8IDAsXG4gICAgICAgICAgICBiaXNhUiA6IG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc1JpZ2h0XCIpIHx8IDAsXG4gICAgICAgICAgICBiaWFzVCA6IG5vZGUuZGF0YShcIm1pbkhlaWdodEJpYXNUb3BcIikgfHwgMCxcbiAgICAgICAgICAgIGJpYXNCIDogbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc0JvdHRvbVwiKSB8fCAwXG4gICAgICAgICAgIC8vIHc6IG5vZGUuY3NzKFwibWluV2lkdGhcIikgIT0gMD8gIG5vZGUuZGF0YShcIm1pbldpZHRoXCIpIDogbm9kZS5jaGlsZHJlbigpLmJvdW5kaW5nQm94KCkudyxcbiAgICAgICAgICAgIC8vaDogbm9kZS5jc3MoXCJtaW4taGVpZ2h0XCIpICE9IDA/ICBub2RlLmRhdGEoXCJtaW5IZWlnaHRcIikgOiBub2RlLmNoaWxkcmVuKCkuYm91bmRpbmdCb3goKS5oXG4gICAgICAgICAgfTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgcmVzdWx0LnNpemVNYXBbbm9kZS5pZCgpXSA9IHtcbiAgICAgICAgICAgIHc6IG5vZGUud2lkdGgoKSxcbiAgICAgICAgICAgIGg6IG5vZGUuaGVpZ2h0KClcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgfVxuXG4gICAgICByZXN1bHQubm9kZXMgPSBub2RlcztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuXG4gICAgICAgIGlmIChwYXJhbS5wZXJmb3JtT3BlcmF0aW9uKSB7XG4gICAgICAgICAgaWYgKHBhcmFtLnNpemVNYXApIHtcbiAgICAgICAgICAgIC8qIGlmIChwYXJhbS5wcmVzZXJ2ZVJlbGF0aXZlUG9zID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIHZhciBvbGRXaWR0aCA9IG5vZGUuZGF0YShcImJib3hcIikudztcbiAgICAgICAgICAgICAgdmFyIG9sZEhlaWdodCA9IG5vZGUuZGF0YShcImJib3hcIikuaDtcbiAgICAgICAgICAgIH0gKi9cblxuICAgICAgICAgICAgaWYobm9kZS5pc1BhcmVudCgpKXtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcIm1pbkhlaWdodFwiICwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmgpO1xuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aFwiICwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLncpO1xuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aEJpYXNMZWZ0XCIsIHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5iaWFzTCk7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc1JpZ2h0XCIsIHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5iaWFzUik7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcIm1pbkhlaWdodEJpYXNUb3BcIiwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmJpYXNUKTtcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc0JvdHRvbVwiLCBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uYmlhc0IpO1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLnc7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5oO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICBcblxuICAgICAgICAgICAgLyogaWYgKHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3MgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgICAgICAgICAgICB2YXIgdG9wQm90dG9tID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiAoYm94LmFuY2hvclNpZGUgPT09IFwidG9wXCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwiYm90dG9tXCIpKTtcbiAgICAgICAgICAgICAgdmFyIHJpZ2h0TGVmdCA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gKGJveC5hbmNob3JTaWRlID09PSBcInJpZ2h0XCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwibGVmdFwiKSk7XG5cbiAgICAgICAgICAgICAgdG9wQm90dG9tLmZvckVhY2goZnVuY3Rpb24oYm94KXtcbiAgICAgICAgICAgICAgICBpZiAoYm94LmJib3gueCA8IDApIHtcbiAgICAgICAgICAgICAgICAgIGJveC5iYm94LnggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChib3guYmJveC54ID4gb2xkV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgIGJveC5iYm94LnggPSBvbGRXaWR0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYm94LmJib3gueCA9IG5vZGUuZGF0YShcImJib3hcIikudyAqIGJveC5iYm94LnggLyBvbGRXaWR0aDtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgcmlnaHRMZWZ0LmZvckVhY2goZnVuY3Rpb24oYm94KXtcbiAgICAgICAgICAgICAgICBpZiAoYm94LmJib3gueSA8IDApIHtcbiAgICAgICAgICAgICAgICAgIGJveC5iYm94LnkgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChib3guYmJveC55ID4gb2xkSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICBib3guYmJveC55ID0gb2xkSGVpZ2h0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBib3guYmJveC55ID0gbm9kZS5kYXRhKFwiYmJveFwiKS5oICogYm94LmJib3gueSAvIG9sZEhlaWdodDtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9ICovXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2RlcyhwYXJhbS5ub2RlcywgcGFyYW0ud2lkdGgsIHBhcmFtLmhlaWdodCwgcGFyYW0udXNlQXNwZWN0UmF0aW8sIHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIH07XG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgICAgIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xuICAgICAgcmVzdWx0LmxhYmVsID0ge307XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgcmVzdWx0LmxhYmVsW25vZGUuaWQoKV0gPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBwYXJhbS5sYWJlbCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsID0gcGFyYW0ubGFiZWxbbm9kZS5pZCgpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94U3R5bGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuICAgICAgdmFyIHN0eWxlID0gcGFyYW0ubm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpW3BhcmFtLmluZGV4XS5zdHlsZTtcbiAgICAgIHJlc3VsdC5uZXdQcm9wcyA9ICQuZXh0ZW5kKCB7fSwgc3R5bGUgKTtcbiAgICAgIHJlc3VsdC5ub2RlID0gcGFyYW0ubm9kZTtcbiAgICAgIHJlc3VsdC5pbmRleCA9IHBhcmFtLmluZGV4O1xuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hTdHlsZSggcGFyYW0ubm9kZSwgcGFyYW0uaW5kZXgsIHBhcmFtLm5ld1Byb3BzICk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUluZm9ib3hPYmogPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuICAgICAgdmFyIG9iaiA9IHBhcmFtLm5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKVtwYXJhbS5pbmRleF07XG4gICAgICByZXN1bHQubmV3UHJvcHMgPSAkLmV4dGVuZCgge30sIG9iaiApO1xuICAgICAgcmVzdWx0Lm5vZGUgPSBwYXJhbS5ub2RlO1xuICAgICAgcmVzdWx0LmluZGV4ID0gcGFyYW0uaW5kZXg7XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlSW5mb2JveE9iaiggcGFyYW0ubm9kZSwgcGFyYW0uaW5kZXgsIHBhcmFtLm5ld1Byb3BzICk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuICAgICAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xuICAgICAgcmVzdWx0LnZhbHVlTWFwID0ge307XG4gICAgICByZXN1bHQuZWxlcyA9IGVsZXM7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5kYXRhKHBhcmFtLm5hbWUpO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEocGFyYW0uZWxlcywgcGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXApO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVTZXRGaWVsZCA9IGZ1bmN0aW9uKCBwYXJhbSApIHtcbiAgICAgIHZhciB1cGRhdGVzID0gZWxlbWVudFV0aWxpdGllcy51cGRhdGVTZXRGaWVsZCggcGFyYW0uZWxlLCBwYXJhbS5maWVsZE5hbWUsIHBhcmFtLnRvRGVsZXRlLCBwYXJhbS50b0FkZCwgcGFyYW0uY2FsbGJhY2sgKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgZWxlOiBwYXJhbS5lbGUsXG4gICAgICAgIGZpZWxkTmFtZTogcGFyYW0uZmllbGROYW1lLFxuICAgICAgICBjYWxsYmFjazogcGFyYW0uY2FsbGJhY2ssXG4gICAgICAgIHRvRGVsZXRlOiB1cGRhdGVzLmFkZGVkLFxuICAgICAgICB0b0FkZDogdXBkYXRlcy5kZWxldGVkXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuICAgICAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xuICAgICAgcmVzdWx0LnZhbHVlTWFwID0ge307XG4gICAgICByZXN1bHQuZWxlcyA9IGVsZXM7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5jc3MocGFyYW0ubmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzKHBhcmFtLmVsZXMsIHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlTWFwKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuXG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG4gICAgICByZXN1bHQuZGF0YSA9IHt9O1xuICAgICAgcmVzdWx0LmVsZXMgPSBlbGVzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG5cbiAgICAgICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldID0ge307XG5cbiAgICAgICAgdmFyIGRhdGEgPSBwYXJhbS5maXJzdFRpbWUgPyBwYXJhbS5kYXRhIDogcGFyYW0uZGF0YVtlbGUuaWQoKV07XG5cbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBkYXRhKSB7XG4gICAgICAgICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldW3Byb3BdID0gZWxlLmRhdGEocHJvcCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIGRhdGEpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuXG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGUsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogU2hvdyBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cbiAgICAgKi9cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuXG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICAgIHJlc3VsdC5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChwYXJhbS5lbGVzLCBwYXJhbS5sYXlvdXRwYXJhbSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuc2hvdyhlbGVzKTsgLy8gU2hvdyBnaXZlbiBlbGVzXG4gICAgICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuaGlkZShlbGVzKTsgLy8gSGlkZSBwcmV2aW91c2x5IHVuaGlkZGVuIGVsZXM7XG5cbiAgICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogSGlkZSBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cbiAgICAgKi9cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5oaWRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuXG4gICAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgICAgIHJlc3VsdC5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5oaWRlQW5kUGVyZm9ybUxheW91dChwYXJhbS5lbGVzLCBwYXJhbS5sYXlvdXRwYXJhbSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQuZWxlcyA9IGN5LnZpZXdVdGlsaXRpZXMoKS5oaWRlKGVsZXMpOyAvLyBIaWRlIGdpdmVuIGVsZXNcbiAgICAgICAgICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvSGlkZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcbiAgICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuc2hvdyhlbGVzKTsgLy8gU2hvdyBwcmV2aW91c2x5IGhpZGRlbiBlbGVzXG5cbiAgICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIERlbGV0ZSBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cbiAgICAgKi9cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XG5cbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlQW5kUGVyZm9ybUxheW91dChwYXJhbS5lbGVzLCBwYXJhbS5sYXlvdXRwYXJhbSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgICByZXN1bHQuZWxlcyA9IGVsZXMucmVtb3ZlKCk7XG4gICAgICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvRGVsZXRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuICAgICAgcmVzdWx0LmVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKGVsZXMpOyBcblxuICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIH07XG4gICAgICByZXN1bHQudHlwZSA9IHBhcmFtLnR5cGU7XG4gICAgICByZXN1bHQubm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgICAgIHJlc3VsdC5pbmRleCA9IHBhcmFtLmluZGV4O1xuICAgICAgdmFyIGRhdGEgPSBwYXJhbS5kYXRhO1xuXG4gICAgICB2YXIgdGVtcERhdGEgPSBlbGVtZW50VXRpbGl0aWVzLnNhdmVVbml0cyhwYXJhbS5ub2Rlcyk7XG4gICAgICByZXN1bHQudmFsdWUgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KHBhcmFtLm5vZGVzLCBwYXJhbS5pbmRleCwgcGFyYW0udmFsdWUsIHBhcmFtLnR5cGUpO1xuICAgICAgLyogdmFyIGxvY2F0aW9ucyA9IGVsZW1lbnRVdGlsaXRpZXMuY2hlY2tGaXQocGFyYW0ubm9kZXMpO1xuICAgICAgaWYgKGxvY2F0aW9ucyAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuZml0VW5pdHMocGFyYW0ubm9kZXMsIGxvY2F0aW9ucyk7XG4gICAgICB9ICovXG4gICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZVVuaXRzKHBhcmFtLm5vZGVzLCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcbiAgICAgIHJlc3VsdC5kYXRhID0gdGVtcERhdGE7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIG9iaiA9IHBhcmFtLm9iajtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICAgICAgdmFyIGRhdGEgPSBwYXJhbS5kYXRhO1xuXG4gICAgICB2YXIgdGVtcERhdGEgPSBlbGVtZW50VXRpbGl0aWVzLnNhdmVVbml0cyhub2Rlcyk7XG4gICAgICB2YXIgbG9jYXRpb25PYmogPSBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xuICAgICAvKiAgdmFyIGxvY2F0aW9ucyA9IGVsZW1lbnRVdGlsaXRpZXMuY2hlY2tGaXQobm9kZXMpO1xuICAgICAgaWYgKGxvY2F0aW9ucyAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuZml0VW5pdHMobm9kZXMsIGxvY2F0aW9ucyk7XG4gICAgICB9ICovXG4gICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZVVuaXRzKG5vZGVzLCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBsb2NhdGlvbk9iajogbG9jYXRpb25PYmosXG4gICAgICAgIG9iajogb2JqLFxuICAgICAgICBkYXRhOiB0ZW1wRGF0YVxuICAgICAgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgbG9jYXRpb25PYmogPSBwYXJhbS5sb2NhdGlvbk9iajtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICAgICAgdmFyIGRhdGEgPSBwYXJhbS5kYXRhO1xuXG4gICAgICB2YXIgdGVtcERhdGEgPSBlbGVtZW50VXRpbGl0aWVzLnNhdmVVbml0cyhub2Rlcyk7XG4gICAgICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgbG9jYXRpb25PYmopO1xuICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVVbml0cyhub2RlcywgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgb2JqOiBvYmosXG4gICAgICAgIGRhdGE6IHRlbXBEYXRhXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZml0VW5pdHMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBub2RlID0gcGFyYW0ubm9kZTtcbiAgICAgIHZhciBsb2NhdGlvbnMgPSBwYXJhbS5sb2NhdGlvbnM7XG4gICAgICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5maXRVbml0cyhub2RlLCBsb2NhdGlvbnMpO1xuXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICBvYmo6IG9iaixcbiAgICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnNcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlVW5pdHMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBub2RlID0gcGFyYW0ubm9kZTtcbiAgICAgIHZhciBsb2NhdGlvbnMgPSBwYXJhbS5sb2NhdGlvbnM7XG4gICAgICB2YXIgb2JqID0gcGFyYW0ub2JqO1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5mb3JFYWNoKCBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHZhciBib3ggPSBvYmpbaW5kZXgrK107XG4gICAgICAgIGVsZS5iYm94LnggPSBib3gueDtcbiAgICAgICAgZWxlLmJib3gueSA9IGJveC55O1xuICAgICAgICB2YXIgb2xkU2lkZSA9IGVsZS5hbmNob3JTaWRlO1xuICAgICAgICBlbGUuYW5jaG9yU2lkZSA9IGJveC5hbmNob3JTaWRlO1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1vZGlmeVVuaXRzKG5vZGUsIGVsZSwgb2xkU2lkZSk7XG4gICAgICB9KTtcblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnNcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICAgICAgdmFyIHN0YXR1cyA9IHBhcmFtLnN0YXR1cztcbiAgICAgIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XG5cbiAgICAgICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBpc011bHRpbWVyO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIGNoYW5nZSB0aGUgc3RhdHVzIG9mIGFsbCBub2RlcyBhdCBvbmNlLlxuICAgICAgLy8gSWYgbm90IGNoYW5nZSBzdGF0dXMgb2YgZWFjaCBzZXBlcmF0ZWx5IHRvIHRoZSB2YWx1ZXMgbWFwcGVkIHRvIHRoZWlyIGlkLlxuICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZSwgc3RhdHVzW25vZGUuaWQoKV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAvLyAgaWYgKCFmaXJzdFRpbWUgJiYgXy5pc0VxdWFsKG5vZGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XG4gICAgLy8gICAgJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIikpO1xuICAgIC8vICB9XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHN0YXR1czogcmVzdWx0U3RhdHVzLFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgICAgIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIHJlc3VsdFN0YXR1cyA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHJlc3VsdFN0YXR1c1tub2RlLmlkKCldID0gbm9kZS5kYXRhKCdjbG9uZW1hcmtlcicpO1xuICAgICAgICB2YXIgY3VycmVudFN0YXR1cyA9IGZpcnN0VGltZSA/IHN0YXR1cyA6IHN0YXR1c1tub2RlLmlkKCldO1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGUsIGN1cnJlbnRTdGF0dXMpO1xuICAgICAgfVxuXG4gICAgLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xuICAgIC8vICAgICQoJyNpbnNwZWN0b3ItaXMtY2xvbmUtbWFya2VyJykuYXR0cihcImNoZWNrZWRcIiwgISQoJyNpbnNwZWN0b3ItaXMtY2xvbmUtbWFya2VyJykuYXR0cihcImNoZWNrZWRcIikpO1xuICAgIC8vICB9XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHN0YXR1czogcmVzdWx0U3RhdHVzLFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8vIHBhcmFtOiB7Y2xhc3M6IHNiZ25jbGFzcywgbmFtZTogcHJvcGVydHlOYW1lLCB2YWx1ZTogdmFsdWV9XG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgc2JnbmNsYXNzID0gcGFyYW0uY2xhc3M7XG4gICAgICB2YXIgbmFtZSA9IHBhcmFtLm5hbWU7XG4gICAgICB2YXIgdmFsdWUgPSBwYXJhbS52YWx1ZTtcbiAgICAgIHZhciBjbGFzc0RlZmF1bHRzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhzYmduY2xhc3MpO1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgY2xhc3M6IHNiZ25jbGFzcyxcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgdmFsdWU6IGNsYXNzRGVmYXVsdHMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBjbGFzc0RlZmF1bHRzW25hbWVdIDogdW5kZWZpbmVkXG4gICAgICB9O1xuXG4gICAgICB2YXIgcHJvcE1hcCA9IHt9O1xuICAgICAgcHJvcE1hcFsgbmFtZSBdID0gdmFsdWU7XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0RGVmYXVsdFByb3BlcnRpZXMoIHNiZ25jbGFzcywgcHJvcE1hcCApO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBiZ09iaiA9IHBhcmFtLmJnT2JqO1xuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gICAgICB2YXIgdXBkYXRlSW5mbyA9IHBhcmFtLnVwZGF0ZUluZm87XG4gICAgICB2YXIgcHJvbXB0SW52YWxpZEltYWdlID0gcGFyYW0ucHJvbXB0SW52YWxpZEltYWdlO1xuICAgICAgdmFyIHZhbGlkYXRlVVJMID0gcGFyYW0udmFsaWRhdGVVUkw7XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkQmFja2dyb3VuZEltYWdlKG5vZGVzLCBiZ09iaiwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCk7XG5cbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgYmdPYmo6IGJnT2JqLFxuICAgICAgICB1cGRhdGVJbmZvOiB1cGRhdGVJbmZvLFxuICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2U6IHByb21wdEludmFsaWRJbWFnZSxcbiAgICAgICAgdmFsaWRhdGVVUkw6IHZhbGlkYXRlVVJMXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgYmdPYmogPSBwYXJhbS5iZ09iajtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZShub2RlcywgYmdPYmopO1xuXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGJnT2JqOiBiZ09ialxuICAgICAgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGJnT2JqID0gcGFyYW0uYmdPYmo7XG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcblxuICAgICAgdmFyIG9sZEJnT2JqID0gZWxlbWVudFV0aWxpdGllcy51cGRhdGVCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIGJnT2JqKTtcblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBiZ09iajogb2xkQmdPYmpcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBvbGRJbWcgPSBwYXJhbS5vbGRJbWc7XG4gICAgICB2YXIgbmV3SW1nID0gcGFyYW0ubmV3SW1nO1xuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIHVwZGF0ZUluZm8gPSBwYXJhbS51cGRhdGVJbmZvO1xuICAgICAgdmFyIHByb21wdEludmFsaWRJbWFnZSA9IHBhcmFtLnByb21wdEludmFsaWRJbWFnZTtcbiAgICAgIHZhciB2YWxpZGF0ZVVSTD0gcGFyYW0udmFsaWRhdGVVUkw7XG5cbiAgICAgIHZhciByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUJhY2tncm91bmRJbWFnZShub2Rlcywgb2xkSW1nLCBuZXdJbWcsIGZpcnN0VGltZSwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCk7XG5cbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY29udmVydEludG9SZXZlcnNpYmxlUmVhY3Rpb24gPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIGxldCBjb2xsZWN0aW9uID0gY3kuY29sbGVjdGlvbigpO1xuICAgICAgbGV0IG1hcFR5cGUgPSBlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShwYXJhbS5tYXBUeXBlKTtcbiAgICAgICQoJyNtYXAtdHlwZScpLnZhbChwYXJhbS5tYXBUeXBlKTtcblxuICAgICAgcGFyYW0uY29sbGVjdGlvbi5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2UpIHtcbiAgICAgICAgdmFyIHNvdXJjZU5vZGUgPSBlZGdlLl9wcml2YXRlLmRhdGEuc291cmNlO1xuICAgICAgICB2YXIgdGFyZ2V0Tm9kZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS50YXJnZXQ7XG5cbiAgICAgICAgZWRnZS5tb3ZlKHtzb3VyY2U6IHRhcmdldE5vZGUsIHRhcmdldDogc291cmNlTm9kZX0pO1xuXG4gICAgICAgIGxldCBjb252ZXJ0ZWRFZGdlID0gY3kuZ2V0RWxlbWVudEJ5SWQoZWRnZS5pZCgpKTtcblxuICAgICAgICBpZihjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlc1wiKSl7XG4gICAgICAgICAgbGV0IGRpc3RhbmNlID0gY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXNcIik7XG4gICAgICAgICAgZGlzdGFuY2UgPSBkaXN0YW5jZS5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIC0xKmVsZW1lbnQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXNcIiwgZGlzdGFuY2UucmV2ZXJzZSgpKTtcblxuICAgICAgICAgIGxldCB3ZWlnaHQgPSBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHNcIik7XG4gICAgICAgICAgd2VpZ2h0ID0gd2VpZ2h0Lm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gMS1lbGVtZW50O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWJlbmRlZGl0aW5nV2VpZ2h0c1wiLCB3ZWlnaHQucmV2ZXJzZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWNvbnRyb2xlZGl0aW5nRGlzdGFuY2VzXCIpKXtcbiAgICAgICAgICBsZXQgZGlzdGFuY2UgPSBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2Vjb250cm9sZWRpdGluZ0Rpc3RhbmNlc1wiKTtcbiAgICAgICAgICBkaXN0YW5jZSA9IGRpc3RhbmNlLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gLTEqZWxlbWVudDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2Vjb250cm9sZWRpdGluZ0Rpc3RhbmNlc1wiLCBkaXN0YW5jZS5yZXZlcnNlKCkpO1xuXG4gICAgICAgICAgbGV0IHdlaWdodCA9IGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWNvbnRyb2xlZGl0aW5nV2VpZ3Roc1wiKTtcbiAgICAgICAgICB3ZWlnaHQgPSB3ZWlnaHQubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAxLWVsZW1lbnQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlY29udHJvbGVkaXRpbmdXZWlndGhzXCIsIHdlaWdodC5yZXZlcnNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PT0gXCJjb25zdW1wdGlvblwiKSB7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID0gXCJwcm9kdWN0aW9uXCI7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnRzb3VyY2UgPSB0YXJnZXROb2RlICsgXCIuMVwiO1xuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0dGFyZ2V0ID0gc291cmNlTm9kZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb252ZXJ0ZWRFZGdlLl9wcml2YXRlLmRhdGEuY2xhc3MgPT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID0gXCJjb25zdW1wdGlvblwiO1xuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0c291cmNlID0gdGFyZ2V0Tm9kZTtcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLl9wcml2YXRlLmRhdGEucG9ydHRhcmdldCA9IHNvdXJjZU5vZGUgKyBcIi4xXCI7XG4gICAgICAgIH1cblxuICAgICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbi5hZGQoY29udmVydGVkRWRnZSk7XG4gICAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvbixcbiAgICAgICAgbWFwVHlwZTogbWFwVHlwZSxcbiAgICAgICAgcHJvY2Vzc0lkOiBwYXJhbS5wcm9jZXNzSWRcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLm1vdmVFZGdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgfTtcbiAgICAgIHZhciBlZGdlID0gcGFyYW0uZWRnZTtcbiAgICAgIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTsgICAgICBcbiAgICAgXG5cbiAgICAgIHJlc3VsdC5zb3VyY2UgPSBlZGdlLnNvdXJjZSgpLmlkKCk7XG4gICAgICByZXN1bHQudGFyZ2V0ID0gZWRnZS50YXJnZXQoKS5pZCgpOyAgICAgIFxuICAgICAgcmVzdWx0LnBvcnRzb3VyY2UgID1lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIpO1xuICAgICAgcmVzdWx0LnBvcnR0YXJnZXQgPSBlZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVkZ2UsICdzb3VyY2UnLCBwYXJhbS5zb3VyY2UpO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVkZ2UsICd0YXJnZXQnLCBwYXJhbS50YXJnZXQpO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVkZ2UsICdwb3J0c291cmNlJywgcGFyYW0ucG9ydHNvdXJjZSk7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWRnZSwgJ3BvcnR0YXJnZXQnLCBwYXJhbS5wb3J0dGFyZ2V0KTsgXG4gICAgICBlZGdlID0gZWRnZS5tb3ZlKHtcbiAgICAgICAgdGFyZ2V0OiBwYXJhbS50YXJnZXQsXG4gICAgICAgIHNvdXJjZSA6IHBhcmFtLnNvdXJjZVxuICAgIFxuICAgICB9KTtcblxuICAgICByZXN1bHQuZWRnZSA9IGVkZ2U7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5maXhFcnJvciA9IGZ1bmN0aW9uKHBhcmFtKXtcbiAgICAgIFxuICAgICAgdmFyIGVycm9yQ29kZSA9IHBhcmFtLmVycm9yQ29kZTtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIHJlc3VsdC5lcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gICAgICBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTAxXCIgfHwgZXJyb3JDb2RlID09ICdwZDEwMTAyJyl7XG5cbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLnJldmVyc2VFZGdlKHBhcmFtLmVkZ2UpO1xuXG4gICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwM1wiIHx8IGVycm9yQ29kZSA9PSAncGQxMDEwNycpe1xuXG4gICAgICAgXG4gICAgICAgIFxuICAgICAgICBwYXJhbS5uZXdOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5ld05vZGUpe1xuICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5ld05vZGUueCwgbmV3Tm9kZS55LCBuZXdOb2RlLmNsYXNzLCBuZXdOb2RlLmlkLCB1bmRlZmluZWQpO1xuXG4gICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBhcmFtLm5ld0VkZ2VzLmZvckVhY2goZnVuY3Rpb24obmV3RWRnZSl7ICAgICAgICAgIFxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdFZGdlLnNvdXJjZSxuZXdFZGdlLnRhcmdldCxuZXdFZGdlLmNsYXNzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGFyYW0ub2xkRWRnZXMuZm9yRWFjaChmdW5jdGlvbihvbGRFZGdlKXtcbiAgICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICAgICAgLy9yZXR1cm4gXG4gICAgICAgICAgb2xkRWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGFyYW0ubm9kZS5yZW1vdmUoKTtcblxuICAgICAgICByZXR1cm4gcGFyYW07XG5cbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDVcIiB8fCBlcnJvckNvZGUgPT0gJ3BkMTAxMDYnKXtcbiAgIFxuICAgICAgICByZXN1bHQuZWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMucmV2ZXJzZUVkZ2UocGFyYW0uZWRnZSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTQwXCIpe1xuICAgICAgICBwYXJhbS5ub2RlLnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA0XCIpIHtcbiAgICAgICAgXG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDhcIil7XG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMTFcIil7XG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMjZcIil7XG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDlcIiB8fCBlcnJvckNvZGUgPT0gXCJwZDEwMTI0XCIpIHtcbiAgICAgICAgXG4gICAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLmRhdGEoKS5zb3VyY2U7XG4gICAgICAgIHJlc3VsdC5uZXdUYXJnZXQgPSBwYXJhbS5lZGdlLmRhdGEoKS50YXJnZXQ7XG4gICAgICAgIHJlc3VsdC5wb3J0c291cmNlID0gcGFyYW0uZWRnZS5kYXRhKCkucG9ydHNvdXJjZTtcbiAgICAgICAgdmFyIGNsb25lZEVkZ2UgPSBwYXJhbS5lZGdlLmNsb25lKCk7XG4gICAgICAgXG4gICAgICAgIHZhciBlZGdlUGFyYW1zID0ge2NsYXNzIDogY2xvbmVkRWRnZS5kYXRhKCkuY2xhc3MsIGxhbmd1YWdlIDpjbG9uZWRFZGdlLmRhdGEoKS5sYW5ndWFnZX07XG4gICAgICAgIGNsb25lZEVkZ2UuZGF0YSgpLnNvdXJjZSA9IHBhcmFtLm5ld1NvdXJjZTtcbiAgICAgICAgY2xvbmVkRWRnZS5kYXRhKCkudGFyZ2V0ID0gcGFyYW0ubmV3VGFyZ2V0O1xuICAgICAgICBjeS5yZW1vdmUocGFyYW0uZWRnZSk7XG4gICAgICAgIHJlc3VsdC5lZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHBhcmFtLm5ld1NvdXJjZSxwYXJhbS5uZXdUYXJnZXQsZWRnZVBhcmFtcywgY2xvbmVkRWRnZS5kYXRhKCkuaWQpOyAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTEyXCIpIHsgICAgXG4gICAgICAgIFxuICAgICAgICBwYXJhbS5jYWxsYmFjayA9IGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyOyAgXG4gICAgICAgIC8vIElmIHRoaXMgaXMgZmlyc3QgdGltZSB3ZSBzaG91bGQgbW92ZSB0aGUgbm9kZSB0byBpdHMgbmV3IHBhcmVudCBhbmQgcmVsb2NhdGUgaXQgYnkgZ2l2ZW4gcG9zRGlmZiBwYXJhbXNcbiAgICAgICAgLy8gZWxzZSB3ZSBzaG91bGQgcmVtb3ZlIHRoZSBtb3ZlZCBlbGVzIGFuZCByZXN0b3JlIHRoZSBlbGVzIHRvIHJlc3RvcmVcbiAgICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICAgIHZhciBuZXdQYXJlbnRJZCA9IHBhcmFtLnBhcmVudERhdGEgPT0gdW5kZWZpbmVkID8gbnVsbCA6IHBhcmFtLnBhcmVudERhdGE7XG4gICAgICAgICAgLy8gVGhlc2UgZWxlcyBpbmNsdWRlcyB0aGUgbm9kZXMgYW5kIHRoZWlyIGNvbm5lY3RlZCBlZGdlcyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIG5vZGVzLm1vdmUoKS5cbiAgICAgICAgICAvLyBUaGV5IHNob3VsZCBiZSByZXN0b3JlZCBpbiB1bmRvXG4gICAgICAgICAgdmFyIHdpdGhEZXNjZW5kYW50ID0gcGFyYW0ubm9kZXMudW5pb24ocGFyYW0ubm9kZXMuZGVzY2VuZGFudHMoKSk7XG4gICAgICAgICAgcmVzdWx0LmVsZXNUb1Jlc3RvcmUgPSB3aXRoRGVzY2VuZGFudC51bmlvbih3aXRoRGVzY2VuZGFudC5jb25uZWN0ZWRFZGdlcygpKTtcbiAgICAgICAgICAvLyBUaGVzZSBhcmUgdGhlIGVsZXMgY3JlYXRlZCBieSBub2Rlcy5tb3ZlKCksIHRoZXkgc2hvdWxkIGJlIHJlbW92ZWQgaW4gdW5kby5cbiAgICAgICAgICByZXN1bHQubW92ZWRFbGVzID0gcGFyYW0ubm9kZXMubW92ZSh7XCJwYXJlbnRcIjogbmV3UGFyZW50SWR9KTtcblxuICAgICAgICAgIHZhciBwb3NEaWZmID0ge1xuICAgICAgICAgICAgeDogcGFyYW0ucG9zRGlmZlgsXG4gICAgICAgICAgICB5OiBwYXJhbS5wb3NEaWZmWVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyhwb3NEaWZmLCByZXN1bHQubW92ZWRFbGVzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXN1bHQuZWxlc1RvUmVzdG9yZSA9IHBhcmFtLm1vdmVkRWxlcy5yZW1vdmUoKTtcbiAgICAgICAgICByZXN1bHQubW92ZWRFbGVzID0gcGFyYW0uZWxlc1RvUmVzdG9yZS5yZXN0b3JlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW0uY2FsbGJhY2spIHtcbiAgICAgICAgICByZXN1bHQuY2FsbGJhY2sgPSBwYXJhbS5jYWxsYmFjazsgLy8ga2VlcCB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgc28gaXQgY2FuIGJlIHJldXNlZCBhZnRlciB1bmRvL3JlZG9cbiAgICAgICAgICBwYXJhbS5jYWxsYmFjayhyZXN1bHQubW92ZWRFbGVzKTsgLy8gYXBwbHkgdGhlIGNhbGxiYWNrIG9uIG5ld2x5IGNyZWF0ZWQgZWxlbWVudHNcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMjVcIikge1xuXG4gICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLnJlbW92ZSgpOyAgICAgICBcbiAgICAgICByZXN1bHQubmV3RWRnZSA9e307XG4gICAgICAgdmFyIGVkZ2VjbGFzcyA9IHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcy5jbGFzcyA/IHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcy5jbGFzcyA6IHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcztcbiAgICAgICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChwYXJhbS5uZXdFZGdlLnNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHBhcmFtLm5ld0VkZ2UudGFyZ2V0KSk7XG5cbiAgICAgICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XG4gICAgICAgIHZhciB0ZW1wID0gcGFyYW0ubmV3RWRnZS5zb3VyY2U7XG4gICAgICAgIHBhcmFtLm5ld0VkZ2Uuc291cmNlID0gcGFyYW0ubmV3RWRnZS50YXJnZXQ7XG4gICAgICAgIHBhcmFtLm5ld0VkZ2UudGFyZ2V0ID0gdGVtcDtcbiAgICAgIH1cbiAgICAgICByZXN1bHQubmV3RWRnZS5pZCA9ZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHBhcmFtLm5ld0VkZ2Uuc291cmNlLHBhcmFtLm5ld0VkZ2UudGFyZ2V0LHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcykuaWQoKTtcbiAgICAgICByZXN1bHQubmV3RWRnZS5zb3VyY2UgPSBwYXJhbS5uZXdFZGdlLnNvdXJjZTtcbiAgICAgICByZXN1bHQubmV3RWRnZS50YXJnZXQgPSBwYXJhbS5uZXdFZGdlLnRhcmdldDtcbiAgICAgICByZXN1bHQubmV3RWRnZS5lZGdlUGFyYW1zID0gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zO1xuICAgICAgIFxuICAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICAgICAgXG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTQyXCIpIHtcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLnJlbW92ZSgpOyAgICAgICBcbiAgICAgICAgcmVzdWx0Lm5ld0VkZ2UgPXt9O1xuICAgICAgICB2YXIgZWRnZWNsYXNzID0gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zLmNsYXNzID8gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zLmNsYXNzIDogcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zO1xuICAgICAgICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChwYXJhbS5uZXdFZGdlLnNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHBhcmFtLm5ld0VkZ2UudGFyZ2V0KSk7XG5cbiAgICAgICAgaWYgKHZhbGlkYXRpb24gPT09ICdyZXZlcnNlJykge1xuICAgICAgICAgdmFyIHRlbXAgPSBwYXJhbS5uZXdFZGdlLnNvdXJjZTtcbiAgICAgICAgIHBhcmFtLm5ld0VkZ2Uuc291cmNlID0gcGFyYW0ubmV3RWRnZS50YXJnZXQ7XG4gICAgICAgICBwYXJhbS5uZXdFZGdlLnRhcmdldCA9IHRlbXA7XG4gICAgICAgfVxuICAgICAgICByZXN1bHQubmV3RWRnZS5pZCA9ZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHBhcmFtLm5ld0VkZ2Uuc291cmNlLHBhcmFtLm5ld0VkZ2UudGFyZ2V0LHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcykuaWQoKTtcbiAgICAgICAgcmVzdWx0Lm5ld0VkZ2Uuc291cmNlID0gcGFyYW0ubmV3RWRnZS5zb3VyY2U7XG4gICAgICAgIHJlc3VsdC5uZXdFZGdlLnRhcmdldCA9IHBhcmFtLm5ld0VkZ2UudGFyZ2V0O1xuICAgICAgICByZXN1bHQubmV3RWRnZS5lZGdlUGFyYW1zID0gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1lbHNlIHtcblxuICAgICAgICByZXN1bHQubmV3U291cmNlID0gcGFyYW0uZWRnZS5zb3VyY2UoKS5pZCgpO1xuICAgICAgICByZXN1bHQubmV3VGFyZ2V0ID0gcGFyYW0uZWRnZS50YXJnZXQoKS5pZCgpO1xuICAgICAgICByZXN1bHQucG9ydHRhcmdldCA9IHBhcmFtLmVkZ2UuZGF0YShcInBvcnR0YXJnZXRcIik7XG4gICAgICAgIHJlc3VsdC5lZGdlID0gcGFyYW0uZWRnZS5tb3ZlKHtcbiAgICAgICAgICB0YXJnZXQ6IHBhcmFtLm5ld1RhcmdldCxcbiAgICAgICAgICBzb3VyY2UgOiBwYXJhbS5uZXdTb3VyY2UgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHJlc3VsdC5lZGdlLCAncG9ydHRhcmdldCcsIHBhcmFtLnBvcnR0YXJnZXQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICBcbiAgICAgIH1cbiAgICAgIFxuICB9XG4gIFxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmZpeEVycm9yID0gZnVuY3Rpb24ocGFyYW0pe1xuICAgIHZhciBlcnJvckNvZGUgPSBwYXJhbS5lcnJvckNvZGU7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5lcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gICAgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwMVwiIHx8IGVycm9yQ29kZSA9PSAncGQxMDEwMicpe1xuICAgICBcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLnJldmVyc2VFZGdlKHBhcmFtLmVkZ2UpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTAzXCIgfHwgZXJyb3JDb2RlID09ICdwZDEwMTA3Jyl7XG5cbiAgICAgIHBhcmFtLm5ld05vZGVzLmZvckVhY2goZnVuY3Rpb24obmV3Tm9kZSl7ICAgIFxuICAgICAgICBjeS5yZW1vdmUoY3kuJCgnIycrbmV3Tm9kZS5pZCkpICAgICAgXG4gICAgICAgIFxuICAgICAgfSk7XG5cbiAgICAgIHBhcmFtLm5vZGUucmVzdG9yZSgpO1xuXG4gICAgICBwYXJhbS5vbGRFZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKG9sZEVkZ2UpeyAgXG4gICAgICAgIG9sZEVkZ2UucmVzdG9yZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIGN5LmFuaW1hdGUoe1xuICAgICAgICBkdXJhdGlvbjogMTAwLFxuICAgICAgICBlYXNpbmc6ICdlYXNlJyxcbiAgICAgICAgZml0IDp7ZWxlczp7fSxwYWRkaW5nOjIwfSwgXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBwYXJhbTtcblxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDVcIiB8fCBlcnJvckNvZGUgPT0gJ3BkMTAxMDYnKXsgIFxuXG4gICAgICByZXN1bHQuZWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMucmV2ZXJzZUVkZ2UocGFyYW0uZWRnZSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDE0MFwiKXtcbiAgICAgIHBhcmFtLm5vZGUucmVzdG9yZSgpO1xuICAgICAgY3kuYW5pbWF0ZSh7XG4gICAgICAgIGR1cmF0aW9uOiAxMDAsXG4gICAgICAgIGVhc2luZzogJ2Vhc2UnLFxuICAgICAgICBmaXQgOntlbGVzOnt9LHBhZGRpbmc6MjB9LCBcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA0XCIpIHtcbiAgICAgIFxuICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgbm9kZS5yZXN0b3JlKCk7XG4gICAgICB9KTtcbiAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGFyYW07XG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwOFwiKXtcbiAgICAgIFxuICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgbm9kZS5yZXN0b3JlKCk7XG4gICAgICB9KTtcbiAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGFyYW07XG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDExMVwiKXtcbiAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGFyYW07XG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEyNlwiKXtcbiAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgIG5vZGUucmVzdG9yZSgpO1xuICAgICAgfSk7XG4gICAgICBwYXJhbS5lZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2Upe1xuICAgICAgICBlZGdlLnJlc3RvcmUoKTtcbiAgICAgIH0pOyAgICAgICBcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA5XCIgfHwgZXJyb3JDb2RlID09IFwicGQxMDEyNFwiKSB7XG5cbiAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLnNvdXJjZSgpLmlkKCk7XG4gICAgICByZXN1bHQubmV3VGFyZ2V0ID0gcGFyYW0uZWRnZS50YXJnZXQoKS5pZCgpO1xuICAgICAgcmVzdWx0LnBvcnRzb3VyY2UgPSBwYXJhbS5wb3J0c291cmNlO1xuICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLm1vdmUoe1xuICAgICAgICB0YXJnZXQ6IHBhcmFtLm5ld1RhcmdldCxcbiAgICAgICAgc291cmNlIDogcGFyYW0ubmV3U291cmNlICAgICAgXG4gICAgICB9KTtcblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHJlc3VsdC5lZGdlLCAncG9ydHNvdXJjZScsIHBhcmFtLnBvcnRzb3VyY2UpOyBcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDExMlwiKSB7XG4gICAgIFxuICAgICAgLy8gSWYgdGhpcyBpcyBmaXJzdCB0aW1lIHdlIHNob3VsZCBtb3ZlIHRoZSBub2RlIHRvIGl0cyBuZXcgcGFyZW50IGFuZCByZWxvY2F0ZSBpdCBieSBnaXZlbiBwb3NEaWZmIHBhcmFtc1xuICAgICAgLy8gZWxzZSB3ZSBzaG91bGQgcmVtb3ZlIHRoZSBtb3ZlZCBlbGVzIGFuZCByZXN0b3JlIHRoZSBlbGVzIHRvIHJlc3RvcmVcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgdmFyIG5ld1BhcmVudElkID0gcGFyYW0ucGFyZW50RGF0YSA9PSB1bmRlZmluZWQgPyBudWxsIDogcGFyYW0ucGFyZW50RGF0YTtcbiAgICAgICAgLy8gVGhlc2UgZWxlcyBpbmNsdWRlcyB0aGUgbm9kZXMgYW5kIHRoZWlyIGNvbm5lY3RlZCBlZGdlcyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIG5vZGVzLm1vdmUoKS5cbiAgICAgICAgLy8gVGhleSBzaG91bGQgYmUgcmVzdG9yZWQgaW4gdW5kb1xuICAgICAgICB2YXIgd2l0aERlc2NlbmRhbnQgPSBwYXJhbS5ub2Rlcy51bmlvbihwYXJhbS5ub2Rlcy5kZXNjZW5kYW50cygpKTtcbiAgICAgICAgcmVzdWx0LmVsZXNUb1Jlc3RvcmUgPSB3aXRoRGVzY2VuZGFudC51bmlvbih3aXRoRGVzY2VuZGFudC5jb25uZWN0ZWRFZGdlcygpKTtcbiAgICAgICAgLy8gVGhlc2UgYXJlIHRoZSBlbGVzIGNyZWF0ZWQgYnkgbm9kZXMubW92ZSgpLCB0aGV5IHNob3VsZCBiZSByZW1vdmVkIGluIHVuZG8uXG4gICAgICAgIHJlc3VsdC5tb3ZlZEVsZXMgPSBwYXJhbS5ub2Rlcy5tb3ZlKHtcInBhcmVudFwiOiBuZXdQYXJlbnRJZH0pO1xuXG4gICAgICAgIHZhciBwb3NEaWZmID0ge1xuICAgICAgICAgIHg6IHBhcmFtLnBvc0RpZmZYLFxuICAgICAgICAgIHk6IHBhcmFtLnBvc0RpZmZZXG4gICAgICAgIH07XG5cbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tb3ZlTm9kZXMocG9zRGlmZiwgcmVzdWx0Lm1vdmVkRWxlcyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0LmVsZXNUb1Jlc3RvcmUgPSBwYXJhbS5tb3ZlZEVsZXMucmVtb3ZlKCk7XG4gICAgICAgIHJlc3VsdC5tb3ZlZEVsZXMgPSBwYXJhbS5lbGVzVG9SZXN0b3JlLnJlc3RvcmUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhcmFtLmNhbGxiYWNrKSB7XG4gICAgICAgIHJlc3VsdC5jYWxsYmFjayA9IHBhcmFtLmNhbGxiYWNrOyAvLyBrZWVwIHRoZSBwcm92aWRlZCBjYWxsYmFjayBzbyBpdCBjYW4gYmUgcmV1c2VkIGFmdGVyIHVuZG8vcmVkb1xuICAgICAgICBwYXJhbS5jYWxsYmFjayhyZXN1bHQubW92ZWRFbGVzKTsgLy8gYXBwbHkgdGhlIGNhbGxiYWNrIG9uIG5ld2x5IGNyZWF0ZWQgZWxlbWVudHNcbiAgICAgIH1cblxuICAgICBcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTI1XCIpIHtcblxuICAgICAgY3kuJCgnIycrcGFyYW0ubmV3RWRnZS5pZCkucmVtb3ZlKCk7XG4gICAgICBwYXJhbS5lZGdlID0gcGFyYW0uZWRnZS5yZXN0b3JlKCk7XG5cbiAgICBcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIFxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxNDJcIikge1xuICAgICAgY3kuJCgnIycrcGFyYW0ubmV3RWRnZS5pZCkucmVtb3ZlKCk7XG4gICAgICBwYXJhbS5lZGdlID0gcGFyYW0uZWRnZS5yZXN0b3JlKCk7XG5cbiAgICBcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICB9ZWxzZSB7XG5cbiAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLnNvdXJjZSgpLmlkKCk7XG4gICAgICByZXN1bHQubmV3VGFyZ2V0ID0gcGFyYW0uZWRnZS50YXJnZXQoKS5pZCgpO1xuICAgICAgcmVzdWx0LnBvcnR0YXJnZXQgPSBwYXJhbS5lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpO1xuICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLm1vdmUoe1xuICAgICAgICB0YXJnZXQ6IHBhcmFtLm5ld1RhcmdldCxcbiAgICAgICAgc291cmNlIDogcGFyYW0ubmV3U291cmNlICAgICAgXG4gICAgICB9KTtcblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHJlc3VsdC5lZGdlLCAncG9ydHRhcmdldCcsIHBhcmFtLnBvcnR0YXJnZXQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgICAgXG4gICAgfVxuICAgIFxuICB9XG5cbiAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2xvbmVIaWdoRGVncmVlTm9kZSA9IGZ1bmN0aW9uKG5vZGUpe1xuXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBvbGRYID0gbm9kZS5wb3NpdGlvbigpLng7XG4gICAgdmFyIG9sZFkgPSBub2RlLnBvc2l0aW9uKCkueTtcbiAgICBcbiAgICBcbiAgICB2YXIgY2xhY3VsYXRlTmV3Q2xvbmVQb3NpdGlvbiA9IGZ1bmN0aW9uKHNvdXJjZUVuZFBvaW50WCxzb3VyY2VFbmRQb2ludFksdGFyZ2V0RW5kUG9pbnRYLHRhcmdldEVuZFBvaW50WSxkZXNpcmVkRGlzdGFuY2UsZGlyZWN0aW9uKXtcbiAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh0YXJnZXRFbmRQb2ludFktc291cmNlRW5kUG9pbnRZLDIpKyBNYXRoLnBvdyh0YXJnZXRFbmRQb2ludFgtc291cmNlRW5kUG9pbnRYLDIpKTtcbiAgICAgIHZhciByYXRpbyA9IGRlc2lyZWREaXN0YW5jZS9kaXN0YW5jZTtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGlmKGRpcmVjdGlvbiA9PSBcInNvdXJjZVwiKXsgXG4gICAgICAgIHJlc3VsdC5jeCA9ICgoMS1yYXRpbykgKiBzb3VyY2VFbmRQb2ludFgpICArIChyYXRpbyAqIHRhcmdldEVuZFBvaW50WCk7XG4gICAgICAgIHJlc3VsdC5jeSA9ICgoMS1yYXRpbykgKiBzb3VyY2VFbmRQb2ludFkpICArIChyYXRpbyAqIHRhcmdldEVuZFBvaW50WSk7XG4gICAgICB9ZWxzZXsgICAgICBcbiAgICAgICAgcmVzdWx0LmN4ID0gKCgxLXJhdGlvKSAqIHRhcmdldEVuZFBvaW50WCkgICsgKHJhdGlvICogc291cmNlRW5kUG9pbnRYKTtcbiAgICAgICAgcmVzdWx0LmN5ID0gKCgxLXJhdGlvKSAqIHRhcmdldEVuZFBvaW50WSkgICsgKHJhdGlvICogc291cmNlRW5kUG9pbnRZKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9OyAgIFxuICAgIHZhciBlZGdlcyA9IG5vZGUuY29ubmVjdGVkRWRnZXMoKTtcbiAgICB2YXIgZGVzaXJlZERpc3RhbmNlID0gKG5vZGUuaGVpZ2h0KCkgPiBub2RlLndpZHRoKCk/IG5vZGUuaGVpZ2h0KCk6IG5vZGUud2lkdGgoKSkqIDAuMTtcbiAgICBmb3IodmFyIGkgPSAxIDsgaSA8IGVkZ2VzLmxlbmd0aCA7IGkrKyl7XG4gICAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gaTtcbiAgICAgIHZhciBlZGdlQ2xvbmUgPSBlZGdlLmNsb25lKCk7XG4gICAgICB2YXIgc3RhcnRQb3NpdGlvbiA9IGVkZ2Uuc291cmNlKCkuaWQoKSA9PSBub2RlLmlkKCkgPyBcInNvdXJjZVwiIDogXCJ0YXJnZXRcIjsgICAgXG4gICAgICB2YXIgbmV3UG9zaXRpb24gPSBjbGFjdWxhdGVOZXdDbG9uZVBvc2l0aW9uKGVkZ2Uuc291cmNlRW5kcG9pbnQoKS54LGVkZ2Uuc291cmNlRW5kcG9pbnQoKS55LGVkZ2UudGFyZ2V0RW5kcG9pbnQoKS54LGVkZ2UudGFyZ2V0RW5kcG9pbnQoKS55LGRlc2lyZWREaXN0YW5jZSxzdGFydFBvc2l0aW9uKTsgXG4gICAgICB2YXIgbmV3Tm9kZUlkID0gbm9kZS5pZCgpKydjbG9uZS0nK2luZGV4O1xuICAgICAgLy9lZGdlQ2xvbmUuZGF0YSgpLmlkID0gZWRnZUNsb25lLmRhdGEoKS5pZCsgXCItXCIrbmV3Tm9kZUlkO1xuICAgICAgaWYoZWRnZS5zb3VyY2UoKS5pZCgpID09IG5vZGUuaWQoKSl7ICAgICAgICBcbiAgICAgICAgZWRnZUNsb25lLmRhdGEoKS5zb3VyY2UgPSBuZXdOb2RlSWQ7XG4gICAgICAgIGVkZ2VDbG9uZS5kYXRhKCkucG9ydHNvdXJjZSA9IG5ld05vZGVJZDsgICAgXG4gICAgICB9ZWxzZXtcbiAgICAgICAgICBcbiAgICAgICAgZWRnZUNsb25lLmRhdGEoKS50YXJnZXQgPSBuZXdOb2RlSWQ7XG4gICAgICAgIGVkZ2VDbG9uZS5kYXRhKCkucG9ydHRhcmdldCA9IG5ld05vZGVJZDsgICAgXG4gICAgICB9XG4gICAgICB2YXIgbmV3Tm9kZSA9IG5vZGUuY2xvbmUoKTtcbiAgICAgIG5ld05vZGUuZGF0YSgpLmlkID0gbmV3Tm9kZUlkO1xuICAgICAgY3kuYWRkKG5ld05vZGUpO1xuICAgICBcbiAgICAgIGVkZ2UucmVtb3ZlKCk7XG4gICAgICBjeS5hZGQoZWRnZUNsb25lKTtcbiAgICAgIG5ld05vZGUucG9zaXRpb24oe1xuICAgICAgICB4OiBuZXdQb3NpdGlvbi5jeCxcbiAgICAgICAgeTogbmV3UG9zaXRpb24uY3lcbiAgICAgIH0pO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhuZXdOb2RlLCB0cnVlKTtcbiAgICAgIFxuICAgIH0gIFxuICAgIFxuICAgIHZhciBuZXdQb3NpdGlvbiA9IGNsYWN1bGF0ZU5ld0Nsb25lUG9zaXRpb24oXG4gICAgICBlZGdlc1swXS5zb3VyY2VFbmRwb2ludCgpLngsXG4gICAgICBlZGdlc1swXS5zb3VyY2VFbmRwb2ludCgpLnksXG4gICAgICBlZGdlc1swXS50YXJnZXRFbmRwb2ludCgpLngsXG4gICAgICBlZGdlc1swXS50YXJnZXRFbmRwb2ludCgpLnksXG4gICAgICBkZXNpcmVkRGlzdGFuY2UsZWRnZXNbMF0uc291cmNlKCkuaWQoKSA9PSBub2RlLmlkKCkgPyBcInNvdXJjZVwiIDogXCJ0YXJnZXRcIlxuICAgICAgKTtcbiAgXG4gICAgdmFyIGNsb25lRWRnZSA9IGVkZ2VzWzBdLmNsb25lKCk7XG4gICAgLy9jbG9uZUVkZ2UuZGF0YSgpLmlkID0gY2xvbmVFZGdlLmRhdGEoKS5pZCsgXCItXCIrbm9kZS5pZCgpKydjbG9uZS0wJztcbiAgICBcbiAgICBlZGdlc1swXS5yZW1vdmUoKTtcbiAgICBjeS5hZGQoY2xvbmVFZGdlKTtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGUsdHJ1ZSk7XG4gICAgbm9kZS5wb3NpdGlvbih7XG4gICAgICB4OiBuZXdQb3NpdGlvbi5jeCxcbiAgICAgIHk6IG5ld1Bvc2l0aW9uLmN5XG4gICAgfSk7XG4gIFxuICAgIHJlc3VsdC5vbGRYID0gb2xkWDsgICAgXG4gICAgcmVzdWx0Lm9sZFkgPSBvbGRZO1xuICAgIHJlc3VsdC5ub2RlID0gbm9kZTtcbiAgICByZXN1bHQubnVtYmVyT2ZFZGdlcyA9IGVkZ2VzLmxlbmd0aDtcbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIH1cblxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bkNsb25lSGlnaERlZ3JlZU5vZGUgPSBmdW5jdGlvbihwYXJhbSl7XG5cbiAgICB2YXIgbm9kZSA9IHBhcmFtLm5vZGU7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2RlLGZhbHNlKTtcbiAgICBub2RlLnBvc2l0aW9uKHtcbiAgICAgIHg6IHBhcmFtLm9sZFgsXG4gICAgICB5OiBwYXJhbS5vbGRZXG4gICAgfSk7XG4gIFxuICAgIGZvcih2YXIgaSA9IDEgOyBpIDwgcGFyYW0ubnVtYmVyT2ZFZGdlcyA7IGkrKyl7XG4gICAgICB2YXIgY2xvbmVJZCA9IG5vZGUuaWQoKSsnY2xvbmUtJytpO1xuICAgICAgdmFyIGNsb25lID0gY3kuJChcIiNcIitjbG9uZUlkKTtcbiAgICAgIHZhciBjbG9uZUVkZ2UgPSBjbG9uZS5jb25uZWN0ZWRFZGdlcygpWzBdO1xuICAgICAgdmFyIGVkZ2UgPSBjbG9uZUVkZ2UuY2xvbmUoKTtcbiAgICAgIFxuICAgIFxuICAgICAgaWYoZWRnZS5kYXRhKCkuc291cmNlID09IGNsb25lSWQpeyAgICAgICAgXG4gICAgICAgIGVkZ2UuZGF0YSgpLnNvdXJjZSA9IG5vZGUuaWQoKTtcbiAgICAgICAgZWRnZS5kYXRhKCkucG9ydHNvdXJjZSA9ICBub2RlLmlkKCk7ICAgIFxuICAgICAgfWVsc2V7ICAgICAgICAgIFxuICAgICAgICBlZGdlLmRhdGEoKS50YXJnZXQgPSAgbm9kZS5pZCgpO1xuICAgICAgICBlZGdlLmRhdGEoKS5wb3J0dGFyZ2V0ID0gIG5vZGUuaWQoKTsgICAgXG4gICAgICB9XG5cbiAgICAgIGNsb25lRWRnZS5yZW1vdmUoKTtcbiAgICAgIGNsb25lLnJlbW92ZSgpO1xuICAgICAgXG4gICAgICBjeS5hZGQoZWRnZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VNYXBUeXBlID0gZnVuY3Rpb24ocGFyYW0pe1xuICAgIHZhciByZXN1bHQgPXt9O1xuICAgIHZhciBjdXJyZW50TWFwVHlwZSA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpO1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShwYXJhbS5tYXBUeXBlKTtcbiAgICByZXN1bHQubWFwVHlwZSA9IGN1cnJlbnRNYXBUeXBlO1xuICAgIHJlc3VsdC5jYWxsYmFjayA9IHBhcmFtLmNhbGxiYWNrO1xuICAgIHBhcmFtLmNhbGxiYWNrKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIH1cblxuICByZXR1cm4gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNFeHRlbmRlcjtcbn07XG4iXX0=
