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

    elementUtilities.createTranslationReaction = function(mRnaName, proteinName, processPosition, edgeLength) {
      const defaultProcessProperties = elementUtilities.getDefaultProperties("translation");
      const defaultSourceAndSinkProperties = elementUtilities.getDefaultProperties("source and sink");
      const defaultNucleicAcidFeatureProperties = elementUtilities.getDefaultProperties("nucleic acid feature");
      const defaultMacromoleculeProperties = elementUtilities.getDefaultProperties("macromolecule");
      const macromoleculeWidth = defaultMacromoleculeProperties.width || 50;
      const sourceAndSinkWidth = defaultSourceAndSinkProperties.width  || 50;
      const nucleicAcidFeatureHeight = defaultNucleicAcidFeatureProperties.height || 50;
      const processWidth = defaultProcessProperties.width || 50;
      const processHeight = defaultProcessProperties.height || 50;
      var processPosition = processPosition || elementUtilities.convertToModelPosition({x: cy.width() / 2, y: cy.height() / 2});
      var edgeLength = edgeLength || 60;

      cy.startBatch();
      if (!elementUtilities.getMapType()) {
        elementUtilities.setMapType("PD");
      }

      var processNode = elementUtilities.addNode(processPosition.x, processPosition.y, {class: "process", language: "PD"});
      elementUtilities.setPortsOrdering(processNode, "L-to-R");
      processNode.data('justAdded', true);

      const xPosOfSourceAndSinkNode = processPosition.x - edgeLength - processWidth / 2 - sourceAndSinkWidth / 2;
      const yPosOfSourceAndSinkNode = processPosition.y;
      var sourceAndSinkNode = elementUtilities.addNode(xPosOfSourceAndSinkNode, yPosOfSourceAndSinkNode, {class: 'source and sink', language: 'PD'});
      sourceAndSinkNode.data('justAdded', true);

      var consumptionEdge = elementUtilities.addEdge(sourceAndSinkNode.id(), processNode.id(), {class: 'consumption', language: 'PD'});
      consumptionEdge.data('justAdded', true);

      const xPosOfmRnaNode = processPosition.x;
      const yPosOfmRnaNode = processPosition.y - edgeLength - processHeight / 2 - nucleicAcidFeatureHeight / 2;
      var mRnaNode = elementUtilities.addNode(xPosOfmRnaNode, yPosOfmRnaNode, {class: 'nucleic acid feature', language: 'PD'});
      mRnaNode.data('justAdded', true);
      mRnaNode.data('label', mRnaName);
      const infoboxObjectOfGene = {
        clazz: "unit of information",
        label: {
          text: 'ct:mRNA'
        },
        bbox: {
          w: 45,
          h: 15
        }
      };
      elementUtilities.addStateOrInfoBox(mRnaNode, infoboxObjectOfGene);

      var necessaryStimulationEdge = elementUtilities.addEdge(mRnaNode.id(), processNode.id(), {class: 'necessary stimulation', language: 'PD'});
      necessaryStimulationEdge.data('justAdded', true);

      const xPosOfProteinNode = processPosition.x + edgeLength + processWidth / 2 + macromoleculeWidth / 2;
      const yPostOfProteinNode = processPosition.y;
      var proteinNode = elementUtilities.addNode(xPosOfProteinNode, yPostOfProteinNode, {class: 'macromolecule', language: 'PD'});
      proteinNode.data('justAdded', true);
      proteinNode.data('label', proteinName);
  
      var productionEdge = elementUtilities.addEdge(processNode.id(), proteinNode.id(), {class: 'production', language: 'PD'});
      productionEdge.data('justAdded', true);

      cy.endBatch();

      //filter the just added elememts to return them and remove just added mark
      var eles = cy.elements('[justAdded]');
      eles.removeData('justAdded');

      cy.elements().unselect();
      eles.select();

      return eles; // Return the just added elements
    };

    elementUtilities.createTranscriptionReaction = function(geneName, mRnaName, processPosition, edgeLength) {
      const defaultProcessProperties = elementUtilities.getDefaultProperties("transcription");
      const defaultSourceAndSinkProperties = elementUtilities.getDefaultProperties("source and sink");
      const defaultNucleicAcidFeatureProperties = elementUtilities.getDefaultProperties("nucleic acid feature");
      const sourceAndSinkWidth = defaultSourceAndSinkProperties.width  || 50;
      const nucleicAcidFeatureHeight = defaultNucleicAcidFeatureProperties.height || 50;
      const nucleicAcidFeatureWidth = defaultNucleicAcidFeatureProperties.width || 50;
      const processWidth = defaultProcessProperties.width || 50;
      const processHeight = defaultProcessProperties.height || 50;
      var processPosition = processPosition || elementUtilities.convertToModelPosition({x: cy.width() / 2, y: cy.height() / 2});
      var edgeLength = edgeLength || 60;

      cy.startBatch();
      if (!elementUtilities.getMapType()) {
        elementUtilities.setMapType("PD");
      }

      var processNode = elementUtilities.addNode(processPosition.x, processPosition.y, {class: "process", language: "PD"});
      elementUtilities.setPortsOrdering(processNode, "L-to-R");
      processNode.data('justAdded', true);

      const xPosOfSourceAndSinkNode = processPosition.x - edgeLength - processWidth / 2 - sourceAndSinkWidth / 2;
      const yPosOfSourceAndSinkNode = processPosition.y;
      var sourceAndSinkNode = elementUtilities.addNode(xPosOfSourceAndSinkNode, yPosOfSourceAndSinkNode, {class: 'source and sink', language: 'PD'});
      sourceAndSinkNode.data('justAdded', true);

      var consumptionEdge = elementUtilities.addEdge(sourceAndSinkNode.id(), processNode.id(), {class: 'consumption', language: 'PD'});
      consumptionEdge.data('justAdded', true);

      const xPosOfGeneNode = processPosition.x;
      const yPosOfGeneNode = processPosition.y - edgeLength - processHeight / 2 - nucleicAcidFeatureHeight / 2;
      var geneNode = elementUtilities.addNode(xPosOfGeneNode, yPosOfGeneNode, {class: 'nucleic acid feature', language: 'PD'});
      geneNode.data('justAdded', true);
      geneNode.data('label', geneName);
      const infoboxObjectOfGene = {
        clazz: "unit of information",
        label: {
          text: 'ct:gene'
        },
        bbox: {
          w: 36,
          h: 15
        }
      };
      elementUtilities.addStateOrInfoBox(geneNode, infoboxObjectOfGene);

      var necessaryStimulationEdge = elementUtilities.addEdge(geneNode.id(), processNode.id(), {class: 'necessary stimulation', language: 'PD'});
      necessaryStimulationEdge.data('justAdded', true);

      const xPosOfmRnaNode = processPosition.x + edgeLength + processWidth / 2 + nucleicAcidFeatureWidth / 2;
      const yPostOfmRnaNode = processPosition.y;
      var mRnaNode = elementUtilities.addNode(xPosOfmRnaNode, yPostOfmRnaNode, {class: 'nucleic acid feature', language: 'PD'});
      mRnaNode.data('justAdded', true);
      mRnaNode.data('label', mRnaName);
      const infoboxObjectOfmRna = {
        clazz: "unit of information",
        label: {
          text: 'ct:mRNA'
        },
        bbox: {
          w: 45,
          h: 15
        }
      };
      elementUtilities.addStateOrInfoBox(mRnaNode, infoboxObjectOfmRna);

      var productionEdge = elementUtilities.addEdge(processNode.id(), mRnaNode.id(), {class: 'production', language: 'PD'});
      productionEdge.data('justAdded', true);

      cy.endBatch();

      //filter the just added elememts to return them and remove just added mark
      var eles = cy.elements('[justAdded]');
      eles.removeData('justAdded');

      cy.elements().unselect();
      eles.select();

      return eles; // Return the just added elements
    };

    elementUtilities.rotate90 = function(point, center) {
      const relativeX = center.x - point.x;
      const relativeY = center.y - point.y;

      const relativeRotatedX = relativeY;
      const relativeRotatedY = -1 * relativeX;

      const resultX = relativeRotatedX + center.x;
      const resultY = relativeRotatedY + center.y;

      return {
        x: resultX,
        y: resultY
      }
    }

    elementUtilities.createConversion = function (macromolecule, regulator, regulatorMultimer, orientation, inputInfoboxLabels, outputInfoboxLabels) {
      const hasRegulator = regulator.name !== undefined;
      const macromoleculeName = macromolecule.name;
      const macromoleculeIsMultimer = macromolecule.multimer.enabled;
      const macromoleculeMultimerCardinality = macromolecule.multimer.cardinality;
      const defaultMacromoleculeProperties = elementUtilities.getDefaultProperties("macromolecule");
      const defaultRegulatorProperties = hasRegulator ? elementUtilities.getDefaultProperties(regulator.type) : {};
      const defaultProcessProperties = elementUtilities.getDefaultProperties("catalytic");
      const processWidth = defaultProcessProperties.width || 50;
      const macromoleculeWidth = defaultMacromoleculeProperties.width || 50;
      const macromoleculeHeight = defaultMacromoleculeProperties.height || 50; 
      const processHeight = defaultProcessProperties.height || 50;
      const regulatorHeight = defaultRegulatorProperties.height || 50;
      const processPosition = elementUtilities.convertToModelPosition({x: cy.width() / 2, y: cy.height() / 2});
      const edgeLength = 30;
      const processPortsOrdering = orientation === "vertical" ? "T-to-B" : "L-to-R";
      const minInfoboxDimension = 20;
      const widthPerChar = 6;

      cy.startBatch();

      if (!elementUtilities.getMapType()) {
        elementUtilities.setMapType("PD");
      }

      let xPosOfInput = processPosition.x - edgeLength - processWidth / 2 - macromoleculeWidth / 2;
      let xPosOfOutput = processPosition.x + edgeLength + processWidth / 2 + macromoleculeWidth / 2;
      let yPosOfInput = processPosition.y;
      let yPosOfOutput = processPosition.y;

      let processNode = elementUtilities.addNode(processPosition.x, processPosition.y, {class: "process", language: "PD"});
      elementUtilities.setPortsOrdering(processNode, processPortsOrdering);
      processNode.data('justAdded', true);

      let nodePosition = {
        x: xPosOfInput,
        y: yPosOfInput
      }
      if (orientation === "vertical") {
        nodePosition = elementUtilities.rotate90(nodePosition, processPosition);
      }

      let inputNode = elementUtilities.addNode(nodePosition.x, nodePosition.y, {class: 'macromolecule', language: 'PD'});
      inputNode.data("justAdded", true);
      inputNode.data("label", macromoleculeName);
      if (macromoleculeIsMultimer) {
        
        elementUtilities.setMultimerStatus(inputNode, true);

        const cardinality = macromoleculeMultimerCardinality;
        if (cardinality != '') {
          const infoboxLabel = "N:" + cardinality;
          infoboxObject = {
            clazz: "unit of information",
            label: {
              text: infoboxLabel
            },
            bbox: {
              w: infoboxLabel.length * widthPerChar,
              h: minInfoboxDimension
            }
          };
          elementUtilities.addStateOrInfoBox(inputNode, infoboxObject);
        }
      }

      inputInfoboxLabels.forEach(function(label) {
        const inputInfoboxWidth = label.length > 0 ? 
                                Math.max(widthPerChar * label.length, minInfoboxDimension) : 
                                minInfoboxDimension; 
        let infoboxObject = {
          clazz: "unit of information",
          label: {
            text: label
          },
          bbox: {
            w: inputInfoboxWidth,
            h: minInfoboxDimension
          },
          style: {
            "shape-name": "ellipse"
          }
        };
        elementUtilities.addStateOrInfoBox(inputNode, infoboxObject);
      });

      let inputEdge = elementUtilities.addEdge(inputNode.id(), processNode.id(), {class: 'consumption', language: 'PD'})
      inputEdge.data("justAdded", true);

      nodePosition = {
        x: xPosOfOutput,
        y: yPosOfOutput
      }

      if (orientation === "vertical") {
        nodePosition = elementUtilities.rotate90(nodePosition, processPosition);
      }

      let outputNode = elementUtilities.addNode(nodePosition.x, nodePosition.y, {class: 'macromolecule', language: 'PD'});
      outputNode.data("justAdded", true);
      outputNode.data("label", macromoleculeName);
      if (macromoleculeIsMultimer) {
        
        elementUtilities.setMultimerStatus(outputNode, true);

        const cardinality = macromoleculeMultimerCardinality;
        if (cardinality != '') {
          const infoboxLabel = "N:" + cardinality;
          infoboxObject = {
            clazz: "unit of information",
            label: {
              text: infoboxLabel
            },
            bbox: {
              w: infoboxLabel.length * widthPerChar,
              h: minInfoboxDimension
            }
          };
          elementUtilities.addStateOrInfoBox(outputNode, infoboxObject);
        }
      }

      outputInfoboxLabels.forEach(function(label) {
        const outputInfoboxWidth = label.length > 0 ? 
                                Math.max(widthPerChar * label.length, minInfoboxDimension) : 
                                minInfoboxDimension;
        infoboxObject = {
          clazz: "unit of information",
          label: {
            text: label
          },
          bbox: {
            w: outputInfoboxWidth,
            h: minInfoboxDimension
          },
          style: {
            "shape-name": "ellipse"
          }
        };
        elementUtilities.addStateOrInfoBox(outputNode, infoboxObject);
      });

      
      [inputNode, outputNode].forEach(function(node){
        const width = elementUtilities.calculateMinWidth(node);
        
        elementUtilities.resizeNodes(node, width, macromoleculeHeight, false, true);
      });
      
      if (orientation === "horizontal") {
        let newInputXPos = processPosition.x - edgeLength - processWidth / 2 - inputNode.data('bbox').w / 2;
        inputNode.position('x', newInputXPos);
      
        let newOutputXPos = processPosition.x + edgeLength + processWidth / 2 + outputNode.data('bbox').w / 2;
        outputNode.position('x', newOutputXPos);
      } 
      else {
        let newInputYPos = processPosition.y - edgeLength - processWidth / 2 - inputNode.data('bbox').h / 2;
        inputNode.position('y', newInputYPos);
      
        let newOutputYPos = processPosition.y + edgeLength + processWidth / 2 + outputNode.data('bbox').h / 2;
        outputNode.position('y', newOutputYPos);
      }

      let outputEdge = elementUtilities.addEdge(processNode.id(), outputNode.id(), {class: 'production', language: 'PD'})
      outputEdge.data("justAdded", true);

      if (hasRegulator) {
        const regulatorName = regulator.name;
        const regulatorType = regulator.type;
        let xPosOfRegulator = processPosition.x;
        let yPosOfRegulator = processPosition.y - ((processHeight / 2) + (regulatorHeight / 2) + edgeLength); 

        nodePosition = {
          x: xPosOfRegulator,
          y: yPosOfRegulator
        }
        if (orientation === "vertical") {
          nodePosition = elementUtilities.rotate90(nodePosition, processPosition);
        }

        let regulatorNode = elementUtilities.addNode(nodePosition.x, nodePosition.y, {class: regulatorType, language: 'PD'});
        regulatorNode.data('justAdded', true);
        regulatorNode.data('label', regulatorName);

        if (regulatorMultimer.enabled) {
          elementUtilities.setMultimerStatus(regulatorNode, true);

          const cardinality = regulatorMultimer.cardinality;
          if (cardinality != '') {
            const infoboxLabel = "N:" + cardinality;
            infoboxObject = {
              clazz: "unit of information",
              label: {
                text: infoboxLabel
              },
              bbox: {
                w: infoboxLabel.length * widthPerChar,
                h: minInfoboxDimension
              }
            };
            elementUtilities.addStateOrInfoBox(regulatorNode, infoboxObject);
          }
        }

        let regulatorEdge = elementUtilities.addEdge(regulatorNode.id(), processNode.id(), {class: 'catalysis', language: 'PD'});
        regulatorEdge.data('justAdded', true);
      }

      cy.endBatch();

      const eles = cy.elements('[justAdded]');
      eles.removeData('justAdded');

      cy.elements().unselect();
      eles.select();

      return eles;
    };

    elementUtilities.createMetabolicReaction = function (inputs, outputs, reversible, regulator, regulatorMultimer, orientation) {
      let rotate90 = function(point, center) {
        const relativeX = center.x - point.x;
        const relativeY = center.y - point.y;

        const relativeRotatedX = relativeY;
        const relativeRotatedY = -1 * relativeX;

        const resultX = relativeRotatedX + center.x;
        const resultY = relativeRotatedY + center.y;

        return {
          x: resultX,
          y: resultY
        }
      };
      const hasRegulator = regulator.name !== undefined;
      const defaultSimpleChemicalProperties = elementUtilities.getDefaultProperties( "simple chemical" );
      const defaultRegulatorProperties = hasRegulator ? elementUtilities.getDefaultProperties(regulator.type) : {};
      const defaultProcessProperties = elementUtilities.getDefaultProperties("catalytic");
      const processWidth = defaultProcessProperties.width || 50;
      const processHeight = defaultProcessProperties.height || 50;
      const simpleChemicalHeight = defaultSimpleChemicalProperties.height || 35;
      const simpleChemicalWidth = defaultSimpleChemicalProperties.width || 35;
      const regulatorHeight = defaultRegulatorProperties.height || 50;
      const processPosition = elementUtilities.convertToModelPosition({x: cy.width() / 2, y: cy.height() / 2});
      const tilingPaddingVertical = 15;
      const tilingPaddingHorizontal = 15;
      const edgeLength = 30;
      const processLeftSideEdgeType = reversible ? "production" : "consumption";
      const processRightSideEdgeType = "production";
      const processPortsOrdering = orientation === "vertical" ? "T-to-B" : "L-to-R";

      cy.startBatch();
      if (!elementUtilities.getMapType()) {
        elementUtilities.setMapType("PD");
      }

      let xPosOfInput = processPosition.x - edgeLength - processWidth / 2 - simpleChemicalWidth / 2;
      let xPosOfOutput = processPosition.x + edgeLength + processWidth / 2 + simpleChemicalWidth / 2;


      let processNode = elementUtilities.addNode(processPosition.x, processPosition.y, {class: "process", language: "PD"});
      elementUtilities.setPortsOrdering(processNode, processPortsOrdering);
      processNode.data('justAdded', true);

      const numOfInputNodes = inputs.length;
      const numOfOutputNodes = outputs.length;

      let yPosOfInput = processPosition.y - ((numOfInputNodes - 1) / 2) * (simpleChemicalHeight + tilingPaddingVertical);

      inputs.forEach(function(data, index) {
        const nodeName = data.name;
        const nodeType = data.type;

        if (index === 0) {
          yPosOfInput = processPosition.y;
        }
        else if (index % 2 === 1) {
          yPosOfInput = processPosition.y - ((simpleChemicalHeight + tilingPaddingVertical) * Math.ceil(index / 2));
        }
        else {
          yPosOfInput = processPosition.y + ((simpleChemicalHeight + tilingPaddingVertical) * (index / 2));
        }

        let nodePosition = {
          x: xPosOfInput,
          y: yPosOfInput
        }
        if (orientation === "vertical") {
          nodePosition = rotate90(nodePosition, processPosition);
        }

        let newNode = elementUtilities.addNode(nodePosition.x, nodePosition.y, {class: nodeType.toLowerCase(), language: "PD"});
        newNode.data("justAdded", true);
        newNode.data("label", nodeName);

        let newEdge;
        if (reversible) {
          newEdge = elementUtilities.addEdge(processNode.id(), newNode.id(), {class: processLeftSideEdgeType, language: "PD"}, undefined, undefined, 1);
        }
        else {
          newEdge = elementUtilities.addEdge(newNode.id(), processNode.id(), {class: processLeftSideEdgeType, language: "PD"});
        }
        newEdge.data("justAdded", true);
      });

      let yPosOfOutput = processPosition.y - ((numOfOutputNodes - 1) / 2) * (simpleChemicalHeight + tilingPaddingVertical);

      outputs.forEach(function(data, index) {
        const nodeName = data.name;
        const nodeType = data.type;

        if (index === 0) {
          yPosOfOutput = processPosition.y;
        }
        else if (index % 2 === 1) {
          yPosOfOutput = processPosition.y - ((simpleChemicalHeight + tilingPaddingVertical) * Math.ceil(index / 2));
        }
        else {
          yPosOfOutput = processPosition.y + ((simpleChemicalHeight + tilingPaddingVertical) * (index / 2));
        }

        let nodePosition = {
          x: xPosOfOutput,
          y: yPosOfOutput
        }
        if (orientation === "vertical") {
          nodePosition = rotate90(nodePosition, processPosition);
        }

        let newNode = elementUtilities.addNode(nodePosition.x, nodePosition.y, {class: nodeType.toLowerCase(), language: "PD"});
        newNode.data("justAdded", true);
        newNode.data("label", nodeName);

        let newEdge = elementUtilities.addEdge(processNode.id(), newNode.id(), {class: processRightSideEdgeType, language: "PD"}, undefined, undefined, 0);
        newEdge.data("justAdded", true);
      });

      // add regulator node
      if (hasRegulator) {
        const regulatorName = regulator.name;
        const regulatorType = regulator.type;
        let xPosOfRegulator = processPosition.x;
        let yPosOfRegulator = processPosition.y - ((processHeight / 2) + (regulatorHeight / 2) + edgeLength); 

        let nodePosition = {
          x: xPosOfRegulator,
          y: yPosOfRegulator
        }
        if (orientation === "vertical") {
          nodePosition = rotate90(nodePosition, processPosition);
        }

        let regulatorNode = elementUtilities.addNode(nodePosition.x, nodePosition.y, {class: regulatorType, language: 'PD'});
        regulatorNode.data('justAdded', true);
        regulatorNode.data('label', regulatorName);

        if (regulatorMultimer.enabled) {
          elementUtilities.setMultimerStatus(regulatorNode, true);

          const cardinality = regulatorMultimer.cardinality;
          if (cardinality != '') {
            const infoboxLabel = "N:" + cardinality;
            infoboxObject = {
              clazz: "unit of information",
              label: {
                text: infoboxLabel
              },
              bbox: {
                w: infoboxLabel.length * 6,
                h: 15
              }
            };
            
            elementUtilities.addStateOrInfoBox(regulatorNode, infoboxObject);
          }
        }

        let regulatorEdge = elementUtilities.addEdge(regulatorNode.id(), processNode.id(), {class: 'catalysis', language: 'PD'});
        regulatorEdge.data('justAdded', true);
      }

      cy.endBatch();

      const eles = cy.elements('[justAdded]');
      eles.removeData('justAdded');

      cy.elements().unselect();
      eles.select();

      return eles;
    };

    elementUtilities.createMetabolicCatalyticActivity = function(inputNodeList, outputNodeList, catalystName, catalystType, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength) {
      var defaultMacromoleculProperties = elementUtilities.getDefaultProperties( "macromolecule" );
      var defaultSimpleChemicalProperties = elementUtilities.getDefaultProperties( "simple chemical" );
      var defaultCatalystTypeProperties = elementUtilities.getDefaultProperties(catalystType);
      var defaultProcessProperties = elementUtilities.getDefaultProperties("catalytic");
      var processWidth = defaultProcessProperties.width || 50;
      var processHeight = defaultProcessProperties.height || 50;
      var simpleChemicalHeight = defaultSimpleChemicalProperties.height || 35;
      var macromoleculeWidth = defaultMacromoleculProperties.width || 50;
      var macromoleculeHeight = defaultMacromoleculProperties.height || 50;
      var catalystHeight = defaultCatalystTypeProperties.height || 50;
      var processPosition = processPosition || elementUtilities.convertToModelPosition({x: cy.width() / 2, y: cy.height() / 2});
      var tilingPaddingVertical = tilingPaddingVertical || 15;
      var tilingPaddingHorizontal = tilingPaddingHorizontal || 15;
      var edgeLength = edgeLength || 60;

      cy.startBatch();
      if (!elementUtilities.getMapType()) {
        elementUtilities.setMapType("PD");
      }

      var xPosOfInput = processPosition.x - edgeLength - processWidth / 2 - macromoleculeWidth / 2;
      var xPosOfOutput = processPosition.x + edgeLength + processWidth / 2 + macromoleculeWidth / 2;

      var processNode = elementUtilities.addNode(processPosition.x, processPosition.y, {class: "process", language: "PD"});
      elementUtilities.setPortsOrdering(processNode, "L-to-R");
      processNode.data('justAdded', true);

      const numOfInputNodes = inputNodeList.length;
      const numOfOutputNodes = outputNodeList.length;
      var yPosOfInput = processPosition.y - ((numOfInputNodes - 1) / 2) * (macromoleculeHeight + tilingPaddingVertical);

      // add input side nodes
      for (var i = 0; i < numOfInputNodes; i++) {
        if(inputNodeList[i].type == "Simple Chemical"){
          var newNode = elementUtilities.addNode(xPosOfInput, yPosOfInput, {class : 'simple chemical', language : 'PD'});
          yPosOfInput += simpleChemicalHeight + tilingPaddingVertical;
        }
        else{
          var newNode = elementUtilities.addNode(xPosOfInput, yPosOfInput, {class : 'macromolecule', language : 'PD'});
          //update the y position
          yPosOfInput += macromoleculeHeight + tilingPaddingVertical;
        }
        newNode.data('justAdded', true);
        newNode.data('label', inputNodeList[i].name);

        var newEdge = elementUtilities.addEdge(newNode.id(), processNode.id(), {class : 'consumption', language : 'PD'});
        newEdge.data('justAdded', true);
      }
      
      var yPosOfOutput = processPosition.y - ((numOfOutputNodes - 1) / 2) * (macromoleculeHeight + tilingPaddingVertical);

      // add output side nodes
      for (var i = 0; i < numOfOutputNodes; i++) {
        if(outputNodeList[i].type == "Simple Chemical"){
          var newNode = elementUtilities.addNode(xPosOfOutput, yPosOfOutput, {class : 'simple chemical', language : 'PD'});
          yPosOfOutput += simpleChemicalHeight + tilingPaddingVertical;
        }
        else{
          var newNode = elementUtilities.addNode(xPosOfOutput, yPosOfOutput, {class : 'macromolecule', language : 'PD'});
          //update the y position
          yPosOfOutput += macromoleculeHeight + tilingPaddingVertical;
        }
        newNode.data('justAdded', true);
        newNode.data('label', outputNodeList[i].name);

        var newEdge = elementUtilities.addEdge(processNode.id(), newNode.id(), {class : 'production', language : 'PD'});
        newEdge.data('justAdded', true);
      }

      // add catalyst node
      var xPosOfCatalyst = processPosition.x;
      var yPosOfCatalyst = processPosition.y - (processHeight + catalystHeight + tilingPaddingVertical); 
      var catalystNode = elementUtilities.addNode(xPosOfCatalyst, yPosOfCatalyst, {class: catalystType, language: 'PD'});
      catalystNode.data('justAdded', true);
      catalystNode.data('label', catalystName);

      var catalystEdge = elementUtilities.addEdge(catalystNode.id(), processNode.id(), {class: 'catalysis', language: 'PD'});
      catalystEdge.data('justAdded', true);

      cy.endBatch();

      //filter the just added elememts to return them and remove just added mark
      var eles = cy.elements('[justAdded]');
      eles.removeData('justAdded');

      cy.elements().unselect();
      eles.select();

      return eles; // Return the just added elements
    }

    elementUtilities.createActivationReaction = function (proteinName, processPosition, edgeLength, reverse) {
      var defaultMacromoleculProperties = elementUtilities.getDefaultProperties( "macromolecule" );
      var defaultProcessProperties = elementUtilities.getDefaultProperties("activation");
      var processWidth = defaultProcessProperties.width || 50;
      var macromoleculeWidth = defaultMacromoleculProperties.width || 50;
      var processPosition = processPosition || elementUtilities.convertToModelPosition({x: cy.width() / 2, y: cy.height() / 2});
      var edgeLength = edgeLength || 60;

      cy.startBatch();
      if (!elementUtilities.getMapType()) {
        elementUtilities.setMapType("PD");
      }

      var xPosOfInput = processPosition.x - edgeLength - processWidth / 2 - macromoleculeWidth / 2;
      var xPosOfOutput = processPosition.x + edgeLength + processWidth / 2 + macromoleculeWidth / 2;

      var processNode = elementUtilities.addNode(processPosition.x, processPosition.y, {class: "process", language: "PD"});
      elementUtilities.setPortsOrdering(processNode, "L-to-R");
      processNode.data('justAdded', true);

      var yPosition = processPosition.y;

      var inputNode = elementUtilities.addNode(xPosOfInput, yPosition, {class: "macromolecule", language: "PD"});
      inputNode.data("justAdded", true);
      inputNode.data("label", proteinName);
      var infoboxObject = {
        clazz: "unit of information",
        label: {
          text: reverse ? "active" : "inactive"
        },
        style: {
          "shape-name": "ellipse"
        },
        bbox: {
          w: 36,
          h: 15
        }
      };
      elementUtilities.addStateOrInfoBox(inputNode, infoboxObject);

      var outputNode = elementUtilities.addNode(xPosOfOutput, yPosition, {class: "macromolecule", language: "PD"});
      outputNode.data("justAdded", true);
      outputNode.data("label", proteinName);
      infoboxObject = {
        clazz: "unit of information",
        label: {
          text: reverse ? "inactive" : "active"
        },
        style: {
          "shape-name": "ellipse"
        },
        bbox: {
          w: 36,
          h: 15
        }
      }
      elementUtilities.addStateOrInfoBox(outputNode, infoboxObject);

      var inputSideEdge = elementUtilities.addEdge(inputNode.id(), processNode.id(), {class: "consumption", language: "PD"});
      inputSideEdge.data("justAdded", true);
      var outputSideEdge = elementUtilities.addEdge(processNode.id(), outputNode.id(), {class: "production", language: "PD"});
      outputSideEdge.data("justAdded", true);
      cy.endBatch();

      //filter the just added elememts to return them and remove just added mark
      var eles = cy.elements('[justAdded]');
      eles.removeData('justAdded');

      cy.elements().unselect();
      eles.select();

      return eles; // Return the just added elements
    }

    /*
     * Creates a template reaction with given parameters. Requires cose-bilkent layout to tile the free macromolecules included
     * in the complex. Parameters are explained below.
     * templateType: The type of the template reaction. It may be 'association', 'dissociation', 'reversible' or 'irreversible'.
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

      
      if (!elementUtilities.getMapType()) {
        elementUtilities.setMapType("PD");
      }

      var xPositionOfFreeMacromolecules;
      var xPositionOfInputMacromolecules;
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
      if (templateType === 'reversible' || templateType === 'irreversible') {
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
          if (templateType === "irreversible") {
            newEdge = elementUtilities.addEdge(newNode.id(), process.id(), {class: "consumption", language: 'PD'});
          }
          else {
            newEdge = elementUtilities.addEdge(process.id(), newNode.id(), {class : "production", language : 'PD'}, undefined, undefined, 1);
          }
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

          //Group the left or bottom elements in group id 0 if reversible
          if (templateType === "irreversible") {
            newEdge = elementUtilities.addEdge(process.id(), newNode.id(), {class: "production", language: 'PD'});
          }
          else {
            newEdge = elementUtilities.addEdge(process.id(), newNode.id(), {class : "production", language : 'PD'}, undefined, undefined, 0);
          }
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
      if (layout && layout.run && templateType !== 'reversible' && templateType !== 'irreversible') {
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

        if (labelText === "" && node.data('label') && node.data('label') !== "") {
          labelText = node.data('label');
        }

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
    elementUtilities.validateArrowEnds = function (edge, source, target, isReplacement) {
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

        /*
          On the logic below:

          Current edge count (incoming or outgoing) of nodes should be strictly less 
          than the maximum allowed if we are adding an edge to the node. This way
          it will never exceed the max count.
          
          Edges can be added in two different ways. Either they are added directly or
          they are added by being replaced from another node, i.e disconnected from
          one and connected to another.

          We can detect if the edge being added is added from a replacement by checking
          whether the source stayed the same when checking edge counts of the source node,
          and whether the target stayed the same when checking edge counts of the
          target node.

          Current edge count of nodes can be allowed to be equal to the maximum in 
          cases where a replacement is made. But we should be careful that this
          replacement operation is not also an addition operation as described above.
        */

        var totalTooMany = true;
        var edgeTooMany = true;
        if (sourceOrTarget == "source") {
            var sameEdgeCountOut = node.outgoers('edge[class="'+edgeclass+'"]').size();
            var totalEdgeCountOut = node.outgoers('edge').size();
            var maxTotal = edgeConstraints[nodeclass].asSource.maxTotal; 
            var maxEdge = edgeConstraints[nodeclass].asSource.maxEdge;

            var compareStrict = !(isReplacement &&
                                  (edge.source() === source));

            var withinLimits = !maxTotal || 
                              (compareStrict && (totalEdgeCountOut < maxTotal)) ||
                              (!compareStrict && (totalEdgeCountOut <= maxTotal));

            if (withinLimits) {
                totalTooMany = false;
            }
            // then check limits for this specific edge class

            withinLimits = !maxEdge ||
                            (compareStrict && (sameEdgeCountOut < maxEdge) ||
                            (!compareStrict && (sameEdgeCountOut <= maxEdge))); 

            if (withinLimits) {
                edgeTooMany = false;
            }

            // if only one of the limits is reached then edge is invalid
            return totalTooMany || edgeTooMany;
        }
        else { // node is used as target
            var sameEdgeCountIn = node.incomers('edge[class="'+edgeclass+'"]').size();
            var totalEdgeCountIn = node.incomers('edge').size();
            var maxTotal = edgeConstraints[nodeclass].asTarget.maxTotal; 
            var maxEdge = edgeConstraints[nodeclass].asTarget.maxEdge;

            var compareStrict = !(isReplacement &&
                                (edge.target() === target));

            var withinLimits = !maxTotal || 
                              (compareStrict && (totalEdgeCountIn < maxTotal)) ||
                              (!compareStrict && (totalEdgeCountIn <= maxTotal));

            if (withinLimits) {
                totalTooMany = false;
            }

            withinLimits = !maxEdge ||
                          (compareStrict && (sameEdgeCountIn < maxEdge) ||
                          (!compareStrict && (sameEdgeCountIn <= maxEdge))); 

            if (withinLimits) {
                edgeTooMany = false;
            }
            return totalTooMany || edgeTooMany;
        }
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
      if (!ele.isNode() || !ele.data('background-image')) {
        return false;
      }
      var bg;
      
      if(typeof ele.data('background-image') === "string") {
        bg = ele.data('background-image').split(" ");
      }
      else if(Array.isArray(obj['background-image'])) {
        bg = ele.data('background-image');
      }

      if (!bg) return false;

      var cloneImg = 'data:image/svg+xml;utf8,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20style%3D%22fill%3Anone%3Bstroke%3Ablack%3Bstroke-width%3A0%3B%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22100%22%20height%3D%22100%22%20style%3D%22fill%3A%23838383%22/%3E%20%3C/svg%3E';
      // If cloneImg is not the only image or there are multiple images there is a background image
      var onlyHasCloneMarkerAsBgImage = (bg.length === 1) && (bg.indexOf(cloneImg) === 0);

      if(bg.length > 1 || !(onlyHasCloneMarkerAsBgImage))
        return true;

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
        if(Object.keys(obj).length < 1)
          return;

        list[ele.data('id')] = obj;
      }
      return list;

      function getBgObj (ele) {
        if(ele.isNode() && elementUtilities.hasBackgroundImage(ele)){
          var keys = ['background-image', 'background-fit', 'background-image-opacity',
          'background-position-x', 'background-position-y', 'background-height', 'background-width'];

          var obj = {};
          keys.forEach(function(key) {
            var value;
            if (ele.data(key) && (typeof ele.data(key) === "string")) {
              value = ele.data(key).split(" ")[0];
            }
            else {
              value = ele.data(key);
            }           
            obj[key] = value;
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
        if(elementUtilities.hasCloneMarker(imgs)){
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
    };

    elementUtilities.hasCloneMarker = function (imgs) {
      var cloneImg = 'data:image/svg+xml;utf8,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20style%3D%22fill%3Anone%3Bstroke%3Ablack%3Bstroke-width%3A0%3B%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22100%22%20height%3D%22100%22%20style%3D%22fill%3A%23838383%22/%3E%20%3C/svg%3E';
      return (imgs.indexOf(cloneImg) > -1);
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
          index = imgs.indexOf(obj['background-image'].split(" ")[0]);
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
   * Creates an activation reaction with given parameters. Requires cose-bilkent layout to tile the free macromolecules included
   * in the complex. Considers undoable option. For more information see the same function in elementUtilities
   */
  mainUtilities.createTranslationReaction = function (mRnaName, proteinName, processPosition, edgeLength) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.createTranslationReaction(mRnaName, proteinName, processPosition, edgeLength);
    }
    else {
      var param = {
        mRnaName: mRnaName,
        proteinName: proteinName,
        processPosition: processPosition,
        edgeLength: edgeLength
      };

      cy.undoRedo().do("createTranslationReaction", param);
  }};

  /*
   * Creates an activation reaction with given parameters. Requires cose-bilkent layout to tile the free macromolecules included
   * in the complex. Considers undoable option. For more information see the same function in elementUtilities
   */
  mainUtilities.createTranscriptionReaction = function (geneName, mRnaName, processPosition, edgeLength) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.createTranscriptionReaction(geneName, mRnaName, processPosition, edgeLength);
    }
    else {
      var param = {
        geneName: geneName,
        mRnaName: mRnaName,
        processPosition: processPosition,
        edgeLength: edgeLength
      };

      cy.undoRedo().do("createTranscriptionReaction", param);
  }};

  mainUtilities.createConversion = function(macromolecule, regulator, regulatorMultimer, orientation, inputInfoboxLabels, outputInfoboxLabels) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.createConversion(macromolecule, regulator, regulatorMultimer, orientation, inputInfoboxLabels, outputInfoboxLabels);
    }
    else {
      const param = {
        macromolecule: macromolecule,
        regulator: regulator,
        regulatorMultimer: regulatorMultimer,
        orientation: orientation,
        inputInfoboxLabels: inputInfoboxLabels,
        outputInfoboxLabels: outputInfoboxLabels
      };

      cy.undoRedo().do("createConversion", param);
    }  
  };

  mainUtilities.createMetabolicReaction = function(inputs, outputs, reversible, regulator, regulatorMultimer, orientation) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.createMetabolicReaction(inputs, outputs, reversible, regulator, regulatorMultimer, orientation);
    }
    else {
      const param = {
        inputs: inputs,
        outputs: outputs,
        reversible: reversible,
        regulator: regulator,
        regulatorMultimer: regulatorMultimer,
        orientation: orientation
      };

      cy.undoRedo().do("createMetabolicReaction", param);
    }  
  };

  /*
   * Creates an activation reaction with given parameters. Requires cose-bilkent layout to tile the free macromolecules included
   * in the complex. Considers undoable option. For more information see the same function in elementUtilities
   */
  mainUtilities.createMetabolicCatalyticActivity = function (inputNodeList, outputNodeList, catalystName, catalystType, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.createMetabolicCatalyticActivity(inputNodeList, outputNodeList, catalystName, catalystType, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength);
    }
    else {
      var param = {
        inputNodeList: inputNodeList,
        outputNodeList: outputNodeList,
        catalystName: catalystName,
        catalystType: catalystType,
        processPosition: processPosition,
        tilingPaddingVertical: tilingPaddingVertical,
        tilingPaddingHorizontal: tilingPaddingHorizontal,
        edgeLength: edgeLength,
      };

      cy.undoRedo().do("createMetabolicCatalyticActivity", param);
    }
  };

  /*
   * Creates an activation reaction with given parameters. Requires cose-bilkent layout to tile the free macromolecules included
   * in the complex. Considers undoable option. For more information see the same function in elementUtilities
   */
  mainUtilities.createActivationReaction = function (proteinName, processPosition, edgeLength, reverse) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.createActivationReaction(proteinName, processPosition, edgeLength, reverse);
    }
    else {
      var param = {
        proteinName: proteinName,
        processPosition: processPosition,
        edgeLength: edgeLength,
        reverse: reverse
      };

      cy.undoRedo().do("createActivationReaction", param);
  }};

  /*
   * Creates a template reaction with given parameters. Requires cose-bilkent layout to tile the free macromolecules included
   * in the complex. Considers undoable option. For more information see the same function in elementUtilities
   */
  mainUtilities.createTemplateReaction = function (templateType, macromoleculeList, complexName, processPosition, tilingPaddingVertical, tilingPaddingHorizontal, edgeLength, layoutParam) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    if (!options.undoable) {
      if (templateType === "reversible") {
        elementUtilities.setMapType("HybridAny");
      }
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
      if (templateType === "reversible") {
        var actions = [];
        actions.push({name:"changeMapType", param: {mapType: "HybridAny", callback: function(){} }});
        actions.push({name:"createTemplateReaction", param: param});
        cy.undoRedo().do("batch", actions);
      }
      else {
        cy.undoRedo().do("createTemplateReaction", param);
      }
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
    ur.action("createActivationReaction", undoRedoActionFunctions.createActivationReaction, undoRedoActionFunctions.deleteElesSimple);
    ur.action("createMetabolicCatalyticActivity", undoRedoActionFunctions.createMetabolicCatalyticActivity, undoRedoActionFunctions.deleteElesSimple);
    ur.action("createMetabolicReaction", undoRedoActionFunctions.createMetabolicReaction, undoRedoActionFunctions.deleteElesSimple);
    ur.action("createConversion", undoRedoActionFunctions.createConversion, undoRedoActionFunctions.deleteElesSimple);
    ur.action("createTranscriptionReaction", undoRedoActionFunctions.createTranscriptionReaction, undoRedoActionFunctions.deleteElesSimple);
    ur.action("createTranslationReaction", undoRedoActionFunctions.createTranslationReaction, undoRedoActionFunctions.deleteElesSimple);
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
    var metaEdges = topologyGrouping.getMetaEdges();
    var compounds = topologyGrouping.getGroupCompounds();
  	applyGrouping(groups, metaEdges, compounds);

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

  function applyGrouping(groups, metaEdges, groupCompounds) {
    var compounds;

    if (groupCompounds.length > 0) {
      compounds = groupCompounds;
    }
    else {
      groups.forEach( function( group ) {
        createGroupCompound( group );
      } );
  
      compounds = topologyGrouping.getGroupCompounds();
    }

    var childrenEdges = compounds.children().connectedEdges();
    var edgesMap = [];

    childrenEdges.forEach( function( edge ){
      var key = calcGroupingKey( edge );
      addToMapChain( edgesMap, key, edge );
      edge.remove();
    } );

    if (metaEdges.length > 0) {
      Object.keys( edgesMap ).forEach( function( key ) {
        var edges = edgesMap[key];
        var temp = edges[0];
        var metaEdge = metaEdges.filter(edge => {
          return edge.source().id() === getParentOrSelf( temp.source() ).id() &&
                  edge.target().id() === getParentOrSelf( temp.target() ).id();
        })[0];
        metaEdge.data( 'tg-to-restore', edges );
        edges.remove();
      } );
    }
    else {
      Object.keys( edgesMap ).forEach( function( key ) {
        createMetaEdgeFor( edgesMap[ key ] );
      } );
    }
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

    undoRedoActionFunctions.createActivationReaction = function(param) {
      var firstTime = param.firstTime;
      var eles;

      if (firstTime) {
        eles = elementUtilities.createActivationReaction(param.proteinName, param.processPosition, param.edgeLength, param.reverse)
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

    undoRedoActionFunctions.createConversion = function(param) {
      let firstTime = param.firstTime;
      let eles;

      if (firstTime) {
        eles = elementUtilities.createConversion(param.macromolecule, param.regulator, param.regulatorMultimer, param.orientation, param.inputInfoboxLabels, param.outputInfoboxLabels);
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

    undoRedoActionFunctions.createMetabolicReaction = function(param) {
      let firstTime = param.firstTime;
      let eles;

      if (firstTime) {
        eles = elementUtilities.createMetabolicReaction(param.inputs, param.outputs, param.reversible, param.regulator, param.regulatorMultimer, param.orientation);
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

    undoRedoActionFunctions.createMetabolicCatalyticActivity = function(param) {
      var firstTime = param.firstTime;
      var eles;

      if (firstTime) {
        eles = elementUtilities.createMetabolicCatalyticActivity(param.inputNodeList, param.outputNodeList, param.catalystName, param.catalystType, param.processPosition, param.tilingPaddingVertical, param.tilingPaddingHorizontal, param.edgeLength)
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

    undoRedoActionFunctions.createTranscriptionReaction = function(param) {
      var firstTime = param.firstTime;
      var eles;

      if (firstTime) {
        eles = elementUtilities.createTranscriptionReaction(param.geneName, param.mRnaName, param.processPosition, param.edgeLength)
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

    undoRedoActionFunctions.createTranslationReaction = function(param) {
      var firstTime = param.firstTime;
      var eles;

      if (firstTime) {
        eles = elementUtilities.createTranslationReaction(param.mRnaName, param.proteinName, param.processPosition, param.edgeLength)
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
            biasR : node.data("minWidthBiasRight") || 0,
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

//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzZXF1YWwvaW5kZXguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLWV4dGVuZGVyLWZhY3RvcnkuanMiLCJzcmMvdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzLWZhY3RvcnkuanMiLCJzcmMvdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvc2JnbnZpei1pbnN0YW5jZS11dGlsaXRpZXMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvdG9wb2xvZ3ktZ3JvdXBpbmctZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvdXItYWN0aW9uLWZ1bmN0aW9ucy1leHRlbmRlci1mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeHpEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6M0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogTG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgSlMgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pzLmZvdW5kYXRpb24vPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZmlsdGVyYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RmlsdGVyKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc0luZGV4ID0gMCxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJlc3VsdFtyZXNJbmRleCsrXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLnNvbWVgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW55IGVsZW1lbnQgcGFzc2VzIHRoZSBwcmVkaWNhdGUgY2hlY2ssXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheVNvbWUoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBgY2FjaGVgIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjYWNoZSBUaGUgY2FjaGUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gY2FjaGVIYXMoY2FjaGUsIGtleSkge1xuICByZXR1cm4gY2FjaGUuaGFzKGtleSk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBtYXBgIHRvIGl0cyBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBrZXktdmFsdWUgcGFpcnMuXG4gKi9cbmZ1bmN0aW9uIG1hcFRvQXJyYXkobWFwKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobWFwLnNpemUpO1xuXG4gIG1hcC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSBba2V5LCB2YWx1ZV07XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgc2V0YCB0byBhbiBhcnJheSBvZiBpdHMgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0IFRoZSBzZXQgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBzZXRUb0FycmF5KHNldCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KHNldC5zaXplKTtcblxuICBzZXQuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IHZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsXG4gICAgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIFN5bWJvbCA9IHJvb3QuU3ltYm9sLFxuICAgIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXksXG4gICAgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZSxcbiAgICBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZSxcbiAgICBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUdldFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICAgIG5hdGl2ZUlzQnVmZmVyID0gQnVmZmVyID8gQnVmZmVyLmlzQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgRGF0YVZpZXcgPSBnZXROYXRpdmUocm9vdCwgJ0RhdGFWaWV3JyksXG4gICAgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKSxcbiAgICBQcm9taXNlID0gZ2V0TmF0aXZlKHJvb3QsICdQcm9taXNlJyksXG4gICAgU2V0ID0gZ2V0TmF0aXZlKHJvb3QsICdTZXQnKSxcbiAgICBXZWFrTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdXZWFrTWFwJyksXG4gICAgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xWYWx1ZU9mID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by52YWx1ZU9mIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IChkYXRhW2tleV0gIT09IHVuZGVmaW5lZCkgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGFzc29jSW5kZXhPZih0aGlzLl9fZGF0YV9fLCBrZXkpID4gLTE7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYExpc3RDYWNoZWAuXG5MaXN0Q2FjaGUucHJvdG90eXBlLmNsZWFyID0gbGlzdENhY2hlQ2xlYXI7XG5MaXN0Q2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IGxpc3RDYWNoZURlbGV0ZTtcbkxpc3RDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbGlzdENhY2hlR2V0O1xuTGlzdENhY2hlLnByb3RvdHlwZS5oYXMgPSBsaXN0Q2FjaGVIYXM7XG5MaXN0Q2FjaGUucHJvdG90eXBlLnNldCA9IGxpc3RDYWNoZVNldDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5zaXplID0gMDtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlR2V0KGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmdldChrZXkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIG1hcCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG4vKipcbiAqXG4gKiBDcmVhdGVzIGFuIGFycmF5IGNhY2hlIG9iamVjdCB0byBzdG9yZSB1bmlxdWUgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFNldENhY2hlKHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcyA9PSBudWxsID8gMCA6IHZhbHVlcy5sZW5ndGg7XG5cbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB0aGlzLmFkZCh2YWx1ZXNbaW5kZXhdKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZHMgYHZhbHVlYCB0byB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGFkZFxuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAYWxpYXMgcHVzaFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2FjaGUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVBZGQodmFsdWUpIHtcbiAgdGhpcy5fX2RhdGFfXy5zZXQodmFsdWUsIEhBU0hfVU5ERUZJTkVEKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgaW4gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVIYXModmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKHZhbHVlKTtcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFNldENhY2hlYC5cblNldENhY2hlLnByb3RvdHlwZS5hZGQgPSBTZXRDYWNoZS5wcm90b3R5cGUucHVzaCA9IHNldENhY2hlQWRkO1xuU2V0Q2FjaGUucHJvdG90eXBlLmhhcyA9IHNldENhY2hlSGFzO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzdGFjayBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTdGFjayhlbnRyaWVzKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGUoZW50cmllcyk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBTdGFja1xuICovXG5mdW5jdGlvbiBzdGFja0NsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIHJlc3VsdCA9IGRhdGFbJ2RlbGV0ZSddKGtleSk7XG5cbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHN0YWNrIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzdGFja0dldChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KGtleSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGRhdGEuX19kYXRhX187XG4gICAgaWYgKCFNYXAgfHwgKHBhaXJzLmxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgLSAxKSkge1xuICAgICAgcGFpcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgdGhpcy5zaXplID0gKytkYXRhLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU3RhY2tgLlxuU3RhY2sucHJvdG90eXBlLmNsZWFyID0gc3RhY2tDbGVhcjtcblN0YWNrLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBzdGFja0RlbGV0ZTtcblN0YWNrLnByb3RvdHlwZS5nZXQgPSBzdGFja0dldDtcblN0YWNrLnByb3RvdHlwZS5oYXMgPSBzdGFja0hhcztcblN0YWNrLnByb3RvdHlwZS5zZXQgPSBzdGFja1NldDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIHRoZSBhcnJheS1saWtlIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtib29sZWFufSBpbmhlcml0ZWQgU3BlY2lmeSByZXR1cm5pbmcgaW5oZXJpdGVkIHByb3BlcnR5IG5hbWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlMaWtlS2V5cyh2YWx1ZSwgaW5oZXJpdGVkKSB7XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpLFxuICAgICAgaXNBcmcgPSAhaXNBcnIgJiYgaXNBcmd1bWVudHModmFsdWUpLFxuICAgICAgaXNCdWZmID0gIWlzQXJyICYmICFpc0FyZyAmJiBpc0J1ZmZlcih2YWx1ZSksXG4gICAgICBpc1R5cGUgPSAhaXNBcnIgJiYgIWlzQXJnICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHZhbHVlKSxcbiAgICAgIHNraXBJbmRleGVzID0gaXNBcnIgfHwgaXNBcmcgfHwgaXNCdWZmIHx8IGlzVHlwZSxcbiAgICAgIHJlc3VsdCA9IHNraXBJbmRleGVzID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKSA6IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChcbiAgICAgICAgICAgLy8gU2FmYXJpIDkgaGFzIGVudW1lcmFibGUgYGFyZ3VtZW50cy5sZW5ndGhgIGluIHN0cmljdCBtb2RlLlxuICAgICAgICAgICBrZXkgPT0gJ2xlbmd0aCcgfHxcbiAgICAgICAgICAgLy8gTm9kZS5qcyAwLjEwIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIGJ1ZmZlcnMuXG4gICAgICAgICAgIChpc0J1ZmYgJiYgKGtleSA9PSAnb2Zmc2V0JyB8fCBrZXkgPT0gJ3BhcmVudCcpKSB8fFxuICAgICAgICAgICAvLyBQaGFudG9tSlMgMiBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiB0eXBlZCBhcnJheXMuXG4gICAgICAgICAgIChpc1R5cGUgJiYgKGtleSA9PSAnYnVmZmVyJyB8fCBrZXkgPT0gJ2J5dGVMZW5ndGgnIHx8IGtleSA9PSAnYnl0ZU9mZnNldCcpKSB8fFxuICAgICAgICAgICAvLyBTa2lwIGluZGV4IHByb3BlcnRpZXMuXG4gICAgICAgICAgIGlzSW5kZXgoa2V5LCBsZW5ndGgpXG4gICAgICAgICkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRBbGxLZXlzYCBhbmQgYGdldEFsbEtleXNJbmAgd2hpY2ggdXNlc1xuICogYGtleXNGdW5jYCBhbmQgYHN5bWJvbHNGdW5jYCB0byBnZXQgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kXG4gKiBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3ltYm9sc0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5c0Z1bmMsIHN5bWJvbHNGdW5jKSB7XG4gIHZhciByZXN1bHQgPSBrZXlzRnVuYyhvYmplY3QpO1xuICByZXR1cm4gaXNBcnJheShvYmplY3QpID8gcmVzdWx0IDogYXJyYXlQdXNoKHJlc3VsdCwgc3ltYm9sc0Z1bmMob2JqZWN0KSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0VxdWFsYCB3aGljaCBzdXBwb3J0cyBwYXJ0aWFsIGNvbXBhcmlzb25zXG4gKiBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy5cbiAqICAxIC0gVW5vcmRlcmVkIGNvbXBhcmlzb25cbiAqICAyIC0gUGFydGlhbCBjb21wYXJpc29uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykge1xuICBpZiAodmFsdWUgPT09IG90aGVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwgfHwgb3RoZXIgPT0gbnVsbCB8fCAoIWlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgIWlzT2JqZWN0TGlrZShvdGhlcikpKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7XG4gIH1cbiAgcmV0dXJuIGJhc2VJc0VxdWFsRGVlcCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGJhc2VJc0VxdWFsLCBzdGFjayk7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbGAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBjb21wYXJpc29ucyBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGVuYWJsaW5nIG9iamVjdHMgd2l0aCBjaXJjdWxhclxuICogcmVmZXJlbmNlcyB0byBiZSBjb21wYXJlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWxEZWVwKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIG9iaklzQXJyID0gaXNBcnJheShvYmplY3QpLFxuICAgICAgb3RoSXNBcnIgPSBpc0FycmF5KG90aGVyKSxcbiAgICAgIG9ialRhZyA9IG9iaklzQXJyID8gYXJyYXlUYWcgOiBnZXRUYWcob2JqZWN0KSxcbiAgICAgIG90aFRhZyA9IG90aElzQXJyID8gYXJyYXlUYWcgOiBnZXRUYWcob3RoZXIpO1xuXG4gIG9ialRhZyA9IG9ialRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb2JqVGFnO1xuICBvdGhUYWcgPSBvdGhUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG90aFRhZztcblxuICB2YXIgb2JqSXNPYmogPSBvYmpUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgb3RoSXNPYmogPSBvdGhUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgaXNTYW1lVGFnID0gb2JqVGFnID09IG90aFRhZztcblxuICBpZiAoaXNTYW1lVGFnICYmIGlzQnVmZmVyKG9iamVjdCkpIHtcbiAgICBpZiAoIWlzQnVmZmVyKG90aGVyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBvYmpJc0FyciA9IHRydWU7XG4gICAgb2JqSXNPYmogPSBmYWxzZTtcbiAgfVxuICBpZiAoaXNTYW1lVGFnICYmICFvYmpJc09iaikge1xuICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgcmV0dXJuIChvYmpJc0FyciB8fCBpc1R5cGVkQXJyYXkob2JqZWN0KSlcbiAgICAgID8gZXF1YWxBcnJheXMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaylcbiAgICAgIDogZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCBvYmpUYWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICB9XG4gIGlmICghKGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRykpIHtcbiAgICB2YXIgb2JqSXNXcmFwcGVkID0gb2JqSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsICdfX3dyYXBwZWRfXycpLFxuICAgICAgICBvdGhJc1dyYXBwZWQgPSBvdGhJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCAnX193cmFwcGVkX18nKTtcblxuICAgIGlmIChvYmpJc1dyYXBwZWQgfHwgb3RoSXNXcmFwcGVkKSB7XG4gICAgICB2YXIgb2JqVW53cmFwcGVkID0gb2JqSXNXcmFwcGVkID8gb2JqZWN0LnZhbHVlKCkgOiBvYmplY3QsXG4gICAgICAgICAgb3RoVW53cmFwcGVkID0gb3RoSXNXcmFwcGVkID8gb3RoZXIudmFsdWUoKSA6IG90aGVyO1xuXG4gICAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgICAgcmV0dXJuIGVxdWFsRnVuYyhvYmpVbndyYXBwZWQsIG90aFVud3JhcHBlZCwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spO1xuICAgIH1cbiAgfVxuICBpZiAoIWlzU2FtZVRhZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICByZXR1cm4gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGFycmF5cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtBcnJheX0gb3RoZXIgVGhlIG90aGVyIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBhcnJheWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJyYXlzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQXJyYXlzKGFycmF5LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgYXJyTGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoZXIubGVuZ3RoO1xuXG4gIGlmIChhcnJMZW5ndGggIT0gb3RoTGVuZ3RoICYmICEoaXNQYXJ0aWFsICYmIG90aExlbmd0aCA+IGFyckxlbmd0aCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChhcnJheSk7XG4gIGlmIChzdGFja2VkICYmIHN0YWNrLmdldChvdGhlcikpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IHRydWUsXG4gICAgICBzZWVuID0gKGJpdG1hc2sgJiBDT01QQVJFX1VOT1JERVJFRF9GTEFHKSA/IG5ldyBTZXRDYWNoZSA6IHVuZGVmaW5lZDtcblxuICBzdGFjay5zZXQoYXJyYXksIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBhcnJheSk7XG5cbiAgLy8gSWdub3JlIG5vbi1pbmRleCBwcm9wZXJ0aWVzLlxuICB3aGlsZSAoKytpbmRleCA8IGFyckxlbmd0aCkge1xuICAgIHZhciBhcnJWYWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltpbmRleF07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgYXJyVmFsdWUsIGluZGV4LCBvdGhlciwgYXJyYXksIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIoYXJyVmFsdWUsIG90aFZhbHVlLCBpbmRleCwgYXJyYXksIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIGlmIChjb21wYXJlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoY29tcGFyZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmIChzZWVuKSB7XG4gICAgICBpZiAoIWFycmF5U29tZShvdGhlciwgZnVuY3Rpb24ob3RoVmFsdWUsIG90aEluZGV4KSB7XG4gICAgICAgICAgICBpZiAoIWNhY2hlSGFzKHNlZW4sIG90aEluZGV4KSAmJlxuICAgICAgICAgICAgICAgIChhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2Vlbi5wdXNoKG90aEluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghKFxuICAgICAgICAgIGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fFxuICAgICAgICAgICAgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShhcnJheSk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBjb21wYXJpbmcgb2JqZWN0cyBvZlxuICogdGhlIHNhbWUgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNvbXBhcmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0cyB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgdGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAob2JqZWN0LmJ5dGVPZmZzZXQgIT0gb3RoZXIuYnl0ZU9mZnNldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgb2JqZWN0ID0gb2JqZWN0LmJ1ZmZlcjtcbiAgICAgIG90aGVyID0gb3RoZXIuYnVmZmVyO1xuXG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAhZXF1YWxGdW5jKG5ldyBVaW50OEFycmF5KG9iamVjdCksIG5ldyBVaW50OEFycmF5KG90aGVyKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgICAgLy8gQ29lcmNlIGJvb2xlYW5zIHRvIGAxYCBvciBgMGAgYW5kIGRhdGVzIHRvIG1pbGxpc2Vjb25kcy5cbiAgICAgIC8vIEludmFsaWQgZGF0ZXMgYXJlIGNvZXJjZWQgdG8gYE5hTmAuXG4gICAgICByZXR1cm4gZXEoK29iamVjdCwgK290aGVyKTtcblxuICAgIGNhc2UgZXJyb3JUYWc6XG4gICAgICByZXR1cm4gb2JqZWN0Lm5hbWUgPT0gb3RoZXIubmFtZSAmJiBvYmplY3QubWVzc2FnZSA9PSBvdGhlci5tZXNzYWdlO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICAvLyBDb2VyY2UgcmVnZXhlcyB0byBzdHJpbmdzIGFuZCB0cmVhdCBzdHJpbmdzLCBwcmltaXRpdmVzIGFuZCBvYmplY3RzLFxuICAgICAgLy8gYXMgZXF1YWwuIFNlZSBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcmVnZXhwLnByb3RvdHlwZS50b3N0cmluZ1xuICAgICAgLy8gZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgIHJldHVybiBvYmplY3QgPT0gKG90aGVyICsgJycpO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICB2YXIgY29udmVydCA9IG1hcFRvQXJyYXk7XG5cbiAgICBjYXNlIHNldFRhZzpcbiAgICAgIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUc7XG4gICAgICBjb252ZXJ0IHx8IChjb252ZXJ0ID0gc2V0VG9BcnJheSk7XG5cbiAgICAgIGlmIChvYmplY3Quc2l6ZSAhPSBvdGhlci5zaXplICYmICFpc1BhcnRpYWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICAgICAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgICAgIGlmIChzdGFja2VkKSB7XG4gICAgICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICAgICAgfVxuICAgICAgYml0bWFzayB8PSBDT01QQVJFX1VOT1JERVJFRF9GTEFHO1xuXG4gICAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgICAgIHZhciByZXN1bHQgPSBlcXVhbEFycmF5cyhjb252ZXJ0KG9iamVjdCksIGNvbnZlcnQob3RoZXIpLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgICAgIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgaWYgKHN5bWJvbFZhbHVlT2YpIHtcbiAgICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlT2YuY2FsbChvYmplY3QpID09IHN5bWJvbFZhbHVlT2YuY2FsbChvdGhlcik7XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3Igb2JqZWN0cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgb2JqUHJvcHMgPSBnZXRBbGxLZXlzKG9iamVjdCksXG4gICAgICBvYmpMZW5ndGggPSBvYmpQcm9wcy5sZW5ndGgsXG4gICAgICBvdGhQcm9wcyA9IGdldEFsbEtleXMob3RoZXIpLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoUHJvcHMubGVuZ3RoO1xuXG4gIGlmIChvYmpMZW5ndGggIT0gb3RoTGVuZ3RoICYmICFpc1BhcnRpYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGluZGV4ID0gb2JqTGVuZ3RoO1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgaWYgKCEoaXNQYXJ0aWFsID8ga2V5IGluIG90aGVyIDogaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwga2V5KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHRydWU7XG4gIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBvYmplY3QpO1xuXG4gIHZhciBza2lwQ3RvciA9IGlzUGFydGlhbDtcbiAgd2hpbGUgKCsraW5kZXggPCBvYmpMZW5ndGgpIHtcbiAgICBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJba2V5XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBvYmpWYWx1ZSwga2V5LCBvdGhlciwgb2JqZWN0LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKG9ialZhbHVlLCBvdGhWYWx1ZSwga2V5LCBvYmplY3QsIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmICghKGNvbXBhcmVkID09PSB1bmRlZmluZWRcbiAgICAgICAgICA/IChvYmpWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKG9ialZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKVxuICAgICAgICAgIDogY29tcGFyZWRcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc2tpcEN0b3IgfHwgKHNraXBDdG9yID0ga2V5ID09ICdjb25zdHJ1Y3RvcicpO1xuICB9XG4gIGlmIChyZXN1bHQgJiYgIXNraXBDdG9yKSB7XG4gICAgdmFyIG9iakN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgIG90aEN0b3IgPSBvdGhlci5jb25zdHJ1Y3RvcjtcblxuICAgIC8vIE5vbiBgT2JqZWN0YCBvYmplY3QgaW5zdGFuY2VzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWFsLlxuICAgIGlmIChvYmpDdG9yICE9IG90aEN0b3IgJiZcbiAgICAgICAgKCdjb25zdHJ1Y3RvcicgaW4gb2JqZWN0ICYmICdjb25zdHJ1Y3RvcicgaW4gb3RoZXIpICYmXG4gICAgICAgICEodHlwZW9mIG9iakN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvYmpDdG9yIGluc3RhbmNlb2Ygb2JqQ3RvciAmJlxuICAgICAgICAgIHR5cGVvZiBvdGhDdG9yID09ICdmdW5jdGlvbicgJiYgb3RoQ3RvciBpbnN0YW5jZW9mIG90aEN0b3IpKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5cywgZ2V0U3ltYm9scyk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0YSBmb3IgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHJlZmVyZW5jZSBrZXkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGdldE1hcERhdGEobWFwLCBrZXkpIHtcbiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187XG4gIHJldHVybiBpc0tleWFibGUoa2V5KVxuICAgID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddXG4gICAgOiBkYXRhLm1hcDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHN5bWJvbHMuXG4gKi9cbnZhciBnZXRTeW1ib2xzID0gIW5hdGl2ZUdldFN5bWJvbHMgPyBzdHViQXJyYXkgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICByZXR1cm4gYXJyYXlGaWx0ZXIobmF0aXZlR2V0U3ltYm9scyhvYmplY3QpLCBmdW5jdGlvbihzeW1ib2wpIHtcbiAgICByZXR1cm4gcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChvYmplY3QsIHN5bWJvbCk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VHZXRUYWcodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmVcbiAqIGVxdWl2YWxlbnQuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIHN1cHBvcnRzIGNvbXBhcmluZyBhcnJheXMsIGFycmF5IGJ1ZmZlcnMsIGJvb2xlYW5zLFxuICogZGF0ZSBvYmplY3RzLCBlcnJvciBvYmplY3RzLCBtYXBzLCBudW1iZXJzLCBgT2JqZWN0YCBvYmplY3RzLCByZWdleGVzLFxuICogc2V0cywgc3RyaW5ncywgc3ltYm9scywgYW5kIHR5cGVkIGFycmF5cy4gYE9iamVjdGAgb2JqZWN0cyBhcmUgY29tcGFyZWRcbiAqIGJ5IHRoZWlyIG93biwgbm90IGluaGVyaXRlZCwgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLiBGdW5jdGlvbnMgYW5kIERPTVxuICogbm9kZXMgYXJlIGNvbXBhcmVkIGJ5IHN0cmljdCBlcXVhbGl0eSwgaS5lLiBgPT09YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5pc0VxdWFsKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIG9iamVjdCA9PT0gb3RoZXI7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0VxdWFsKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBlbXB0eSBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGVtcHR5IGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXlzID0gXy50aW1lcygyLCBfLnN0dWJBcnJheSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzKTtcbiAqIC8vID0+IFtbXSwgW11dXG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzWzBdID09PSBhcnJheXNbMV0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3R1YkFycmF5KCkge1xuICByZXR1cm4gW107XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VxdWFsO1xuIiwiKGZ1bmN0aW9uKCl7XG4gIHZhciBjaGlzZSA9IGZ1bmN0aW9uKF9vcHRpb25zKSB7XG5cbiAgICB2YXIgcGFyYW0gPSB7fTtcblxuICAgIC8vIEFjY2VzcyB0aGUgbGlic1xuICAgIHZhciBsaWJzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcblxuICAgIHZhciBvcHRpb25VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9vcHRpb24tdXRpbGl0aWVzLWZhY3RvcnknKSgpO1xuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpOyAvLyBFeHRlbmRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9uc1xuXG4gICAgLy8gQ3JlYXRlIGFuIHNiZ252aXogaW5zdGFuY2VcbiAgICB2YXIgc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvc2JnbnZpei1pbnN0YW5jZS11dGlsaXRpZXMtZmFjdG9yeScpKCk7XG4gICAgdmFyIHNiZ252aXpJbnN0YW5jZSA9IHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcyhvcHRpb25zKTtcblxuICAgIC8vIFJlZ2lzdGVyIHVuZG8vcmVkbyBhY3Rpb25zXG4gICAgdmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMtZmFjdG9yeScpKCk7XG5cbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzLWZhY3RvcnknKSgpO1xuICAgIHZhciBlbGVtZW50VXRpbGl0aWVzRXh0ZW5kZXIgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcy1leHRlbmRlci1mYWN0b3J5JykoKTtcbiAgICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNFeHRlbmRlciA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3VyLWFjdGlvbi1mdW5jdGlvbnMtZXh0ZW5kZXItZmFjdG9yeScpKCk7XG4gICAgdmFyIHNpZlRvcG9sb2d5R3JvdXBpbmcgPSByZXF1aXJlKCcuL3V0aWxpdGllcy90b3BvbG9neS1ncm91cGluZy1mYWN0b3J5JykoKTtcblxuICAgIHZhciBlbGVtZW50VXRpbGl0aWVzID0gIHNiZ252aXpJbnN0YW5jZS5lbGVtZW50VXRpbGl0aWVzO1xuICAgIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHNiZ252aXpJbnN0YW5jZS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcblxuICAgIHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcyA9IHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcztcbiAgICBwYXJhbS5vcHRpb25VdGlsaXRpZXMgPSBvcHRpb25VdGlsaXRpZXM7XG4gICAgcGFyYW0uZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4gICAgcGFyYW0udW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbiAgICBwYXJhbS5zaWZUb3BvbG9neUdyb3VwaW5nID0gc2lmVG9wb2xvZ3lHcm91cGluZztcblxuICAgIHZhciBzaG91bGRBcHBseSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBhcmFtLmVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZSA9PT0gJ1NJRic7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zRXh0ZW5kZXIocGFyYW0pO1xuICAgIGVsZW1lbnRVdGlsaXRpZXNFeHRlbmRlcihwYXJhbSk7XG4gICAgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMocGFyYW0pO1xuICAgIG1haW5VdGlsaXRpZXMocGFyYW0pO1xuICAgIHNpZlRvcG9sb2d5R3JvdXBpbmcocGFyYW0sIHttZXRhRWRnZUlkZW50aWZpZXI6ICdzaWYtbWV0YScsIGxvY2tHcmFwaFRvcG9sb2d5OiB0cnVlLCBzaG91bGRBcHBseX0pO1xuXG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcbiAgICB2YXIgYXBpID0ge307XG5cbiAgICAvLyBFeHBvc2UgdGhlIHByb3BlcnRpZXMgaW5oZXJpdGVkIGZyb20gc2JnbnZpelxuICAgIC8vIHRoZW4gb3ZlcnJpZGUgc29tZSBvZiB0aGVzZSBwcm9wZXJ0aWVzIGFuZCBleHBvc2Ugc29tZSBuZXcgcHJvcGVydGllc1xuICAgIGZvciAodmFyIHByb3AgaW4gc2JnbnZpekluc3RhbmNlKSB7XG4gICAgICBhcGlbcHJvcF0gPSBzYmdudml6SW5zdGFuY2VbcHJvcF07XG4gICAgfVxuXG4gICAgLy8gRXhwb3NlIGVhY2ggbWFpbiB1dGlsaXR5IHNlcGVyYXRlbHlcbiAgICBmb3IgKHZhciBwcm9wIGluIG1haW5VdGlsaXRpZXMpIHtcbiAgICAgIGFwaVtwcm9wXSA9IG1haW5VdGlsaXRpZXNbcHJvcF07XG4gICAgfVxuXG4gICAgLy8gRXhwb3NlIGdldFNiZ252aXpJbnN0YW5jZSgpXG4gICAgYXBpLmdldFNiZ252aXpJbnN0YW5jZSA9IHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRJbnN0YW5jZTtcblxuICAgIC8vIEV4cG9zZSBlbGVtZW50VXRpbGl0aWVzIGFuZCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyBhcyBpc1xuICAgIGFwaS5lbGVtZW50VXRpbGl0aWVzID0gZWxlbWVudFV0aWxpdGllcztcbiAgICBhcGkudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbiAgICBhcGkuc2lmVG9wb2xvZ3lHcm91cGluZyA9IHNpZlRvcG9sb2d5R3JvdXBpbmc7XG5cbiAgICByZXR1cm4gYXBpO1xuICB9O1xuXG4gIC8vIFJlZ2lzdGVyIGNoaXNlIHdpdGggZ2l2ZW4gbGlicmFyaWVzXG4gIGNoaXNlLnJlZ2lzdGVyID0gZnVuY3Rpb24gKF9saWJzKSB7XG5cbiAgICB2YXIgbGlicyA9IHt9O1xuICAgIGxpYnMualF1ZXJ5ID0gX2xpYnMualF1ZXJ5IHx8IGpRdWVyeTtcbiAgICBsaWJzLmN5dG9zY2FwZSA9IF9saWJzLmN5dG9zY2FwZSB8fCBjeXRvc2NhcGU7XG4gICAgbGlicy5zYmdudml6ID0gX2xpYnMuc2JnbnZpeiB8fCBzYmdudml6O1xuICAgIGxpYnMuc2F2ZUFzID0gX2xpYnMuZmlsZXNhdmVyID8gX2xpYnMuZmlsZXNhdmVyLnNhdmVBcyA6IHNhdmVBcztcblxuICAgIGxpYnMuc2JnbnZpei5yZWdpc3RlcihfbGlicyk7IC8vIFJlZ2lzdGVyIHNiZ252aXogd2l0aCB0aGUgZ2l2ZW4gbGlic1xuXG4gICAgLy8gaW5oZXJpdCBleHBvc2VkIHN0YXRpYyBwcm9wZXJ0aWVzIG9mIHNiZ252aXogb3RoZXIgdGhhbiByZWdpc3RlclxuICAgIGZvciAodmFyIHByb3AgaW4gbGlicy5zYmdudml6KSB7XG4gICAgICBpZiAocHJvcCAhPT0gJ3JlZ2lzdGVyJykge1xuICAgICAgICBjaGlzZVtwcm9wXSA9IGxpYnMuc2JnbnZpeltwcm9wXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcbiAgICBsaWJVdGlsaXRpZXMuc2V0TGlicyhsaWJzKTtcbiAgfTtcblxuICBpZiAoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gY2hpc2U7XG4gIH1cbn0pKCk7XG4iLCIvLyBFeHRlbmRzIHNiZ252aXouZWxlbWVudFV0aWxpdGllc1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgalF1ZXJ5ID0gJCA9IGxpYnMualF1ZXJ5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG9wdGlvbnMsIHNiZ252aXpJbnN0YW5jZSwgZWxlbWVudFV0aWxpdGllcywgY3k7XG5cbiAgZnVuY3Rpb24gZWxlbWVudFV0aWxpdGllc0V4dGVuZGVyIChwYXJhbSkge1xuICAgIHNiZ252aXpJbnN0YW5jZSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRJbnN0YW5jZSgpO1xuICAgIG9wdGlvbnMgPSBwYXJhbS5vcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xuICAgIGVsZW1lbnRVdGlsaXRpZXMgPSBzYmdudml6SW5zdGFuY2UuZWxlbWVudFV0aWxpdGllcztcbiAgICBjeSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRDeSgpO1xuXG4gICAgZXh0ZW5kKCk7XG5cbiAgICAvLyBSZXR1cm4gdGhlIGV4dGVuZGVkIGVsZW1lbnRVdGlsaXRpZXNcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcztcbiAgfVxuXG4gIC8vIEV4dGVuZHMgZWxlbWVudFV0aWxpdGllcyB3aXRoIGNoaXNlIHNwZWNpZmljIGZhY2lsaXRpZXNcbiAgZnVuY3Rpb24gZXh0ZW5kICgpIHtcbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uICh4LCB5LCBub2RlUGFyYW1zLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KSB7XG4gICAgICBpZiAodHlwZW9mIG5vZGVQYXJhbXMgIT0gJ29iamVjdCcpe1xuICAgICAgICB2YXIgc2JnbmNsYXNzID0gbm9kZVBhcmFtcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHNiZ25jbGFzcyA9IG5vZGVQYXJhbXMuY2xhc3M7XG4gICAgICAgICAgdmFyIGxhbmd1YWdlID0gbm9kZVBhcmFtcy5sYW5ndWFnZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNzcyA9IHt9O1xuICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gc3BlY2lmaWMgZGVmYXVsdCB3aWR0aCBvciBoZWlnaHQgZm9yXG4gICAgICAvLyBzYmduY2xhc3MgdGhlc2Ugc2l6ZXMgYXJlIHVzZWRcbiAgICAgIHZhciBkZWZhdWx0V2lkdGggPSA1MDtcbiAgICAgIHZhciBkZWZhdWx0SGVpZ2h0ID0gNTA7XG5cbiAgICAgIGlmICh2aXNpYmlsaXR5KSB7XG4gICAgICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGNsYXNzOiBzYmduY2xhc3MsXG4gICAgXHQgIGxhbmd1YWdlOiBsYW5ndWFnZSxcbiAgICAgICAgYmJveDoge1xuICAgICAgICAgIHc6IGRlZmF1bHRXaWR0aCxcbiAgICAgICAgICBoOiBkZWZhdWx0SGVpZ2h0LFxuICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgeTogeVxuICAgICAgICB9LFxuICAgICAgICBzdGF0ZXNhbmRpbmZvczogW10sXG4gICAgICAgIHBvcnRzOiBbXVxuICAgICAgfTtcblxuICAgICAgaWYoaWQpIHtcbiAgICAgICAgZGF0YS5pZCA9IGlkO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRhdGEuaWQgPSBlbGVtZW50VXRpbGl0aWVzLmdlbmVyYXRlTm9kZUlkKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgZGF0YS5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZXh0ZW5kTm9kZURhdGFXaXRoQ2xhc3NEZWZhdWx0cyggZGF0YSwgc2JnbmNsYXNzICk7XG5cbiAgICAgIC8vIHNvbWUgZGVmYXVsdHMgYXJlIG5vdCBzZXQgYnkgZXh0ZW5kTm9kZURhdGFXaXRoQ2xhc3NEZWZhdWx0cygpXG4gICAgICB2YXIgZGVmYXVsdHMgPSB0aGlzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBzYmduY2xhc3MgKTtcblxuICAgICAgaWYgKCBkZWZhdWx0c1sgJ211bHRpbWVyJyBdICkge1xuICAgICAgICBkYXRhLmNsYXNzICs9ICcgbXVsdGltZXInO1xuICAgICAgfVxuXG4gICAgICBpZiAoIGRlZmF1bHRzWyAnY2xvbmVtYXJrZXInIF0gKSB7XG4gICAgICAgIGRhdGFbICdjbG9uZW1hcmtlcicgXSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGRhdGEuYmJveFsgJ3cnIF0gPSBkZWZhdWx0c1sgJ3dpZHRoJyBdO1xuICAgICAgZGF0YS5iYm94WyAnaCcgXSA9IGRlZmF1bHRzWyAnaGVpZ2h0JyBdO1xuXG4gICAgICB2YXIgZWxlcyA9IGN5LmFkZCh7XG4gICAgICAgIGdyb3VwOiBcIm5vZGVzXCIsXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGNzczogY3NzLFxuICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgeTogeVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdmFyIG5ld05vZGUgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XG4gICAgICAvLyBHZXQgdGhlIGRlZmF1bHQgcG9ydHMgb3JkZXJpbmcgZm9yIHRoZSBub2RlcyB3aXRoIGdpdmVuIHNiZ25jbGFzc1xuICAgICAgdmFyIG9yZGVyaW5nID0gZGVmYXVsdHNbJ3BvcnRzLW9yZGVyaW5nJ107XG5cbiAgICAgIC8vIElmIHRoZXJlIGlzIGEgZGVmYXVsdCBwb3J0cyBvcmRlcmluZyBmb3IgdGhlIG5vZGVzIHdpdGggZ2l2ZW4gc2JnbmNsYXNzIGFuZCBpdCBpcyBkaWZmZXJlbnQgdGhhbiAnbm9uZScgc2V0IHRoZSBwb3J0cyBvcmRlcmluZyB0byB0aGF0IG9yZGVyaW5nXG4gICAgICBpZiAob3JkZXJpbmcgJiYgb3JkZXJpbmcgIT09ICdub25lJykge1xuICAgICAgICB0aGlzLnNldFBvcnRzT3JkZXJpbmcobmV3Tm9kZSwgb3JkZXJpbmcpO1xuICAgICAgfVxuXG4gICAgICBpZiAobGFuZ3VhZ2UgPT0gXCJBRlwiICYmICFlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVNdWx0aXBsZVVuaXRPZkluZm9ybWF0aW9uKG5ld05vZGUpKXtcbiAgICAgICAgaWYgKHNiZ25jbGFzcyAhPSBcIkJBIHBsYWluXCIpIHsgLy8gaWYgQUYgbm9kZSBjYW4gaGF2ZSBsYWJlbCBpLmU6IG5vdCBwbGFpbiBiaW9sb2dpY2FsIGFjdGl2aXR5XG4gICAgICAgICAgdmFyIHVvaV9vYmogPSB7XG4gICAgICAgICAgICBjbGF6ejogXCJ1bml0IG9mIGluZm9ybWF0aW9uXCJcbiAgICAgICAgICB9O1xuICAgICAgICAgIHVvaV9vYmoubGFiZWwgPSB7XG4gICAgICAgICAgICB0ZXh0OiBcIlwiXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHVvaV9vYmouYmJveCA9IHtcbiAgICAgICAgICAgICB3OiAxMixcbiAgICAgICAgICAgICBoOiAxMlxuICAgICAgICAgIH07XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChuZXdOb2RlLCB1b2lfb2JqKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBub2RlIGJnIGltYWdlIHdhcyB1bmV4cGVjdGVkbHkgbm90IHJlbmRlcmVkIHVudGlsIGl0IGlzIGNsaWNrZWRcbiAgICAgIC8vIHVzZSB0aGlzIGRpcnR5IGhhY2sgdW50aWwgZmluZGluZyBhIHNvbHV0aW9uIHRvIHRoZSBwcm9ibGVtXG4gICAgICB2YXIgYmdJbWFnZSA9IG5ld05vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpO1xuICAgICAgaWYgKCBiZ0ltYWdlICkge1xuICAgICAgICBuZXdOb2RlLmRhdGEoICdiYWNrZ3JvdW5kLWltYWdlJywgYmdJbWFnZSApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3Tm9kZTtcbiAgICB9O1xuXG4gICAgLy9TYXZlcyBvbGQgYXV4IHVuaXRzIG9mIGdpdmVuIG5vZGVcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNhdmVVbml0cyA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIHZhciB0ZW1wRGF0YSA9IFtdO1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5mb3JFYWNoKCBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgdGVtcERhdGEucHVzaCh7XG4gICAgICAgICAgeDogZWxlLmJib3gueCxcbiAgICAgICAgICB5OiBlbGUuYmJveC55LFxuICAgICAgICAgIGFuY2hvclNpZGU6IGVsZS5hbmNob3JTaWRlLFxuICAgICAgICB9KTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRlbXBEYXRhO1xuICAgIH07XG5cbiAgICAvL1Jlc3RvcmVzIGZyb20gZ2l2ZW4gZGF0YVxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZVVuaXRzID0gZnVuY3Rpb24obm9kZSwgZGF0YSkge1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5mb3JFYWNoKCBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGVsZS5iYm94LnggPSBkYXRhW2luZGV4XS54O1xuICAgICAgICAgIGVsZS5iYm94LnkgPSBkYXRhW2luZGV4XS55XG4gICAgICAgICAgdmFyIGFuY2hvclNpZGUgPSBlbGUuYW5jaG9yU2lkZTtcbiAgICAgICAgICBlbGUuYW5jaG9yU2lkZSA9IGRhdGFbaW5kZXhdLmFuY2hvclNpZGU7XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tb2RpZnlVbml0cyhub2RlLCBlbGUsIGFuY2hvclNpZGUpO1xuICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvL01vZGlmeSBhdXggdW5pdCBsYXlvdXRzXG4gICAgZWxlbWVudFV0aWxpdGllcy5tb2RpZnlVbml0cyA9IGZ1bmN0aW9uIChub2RlLCBlbGUsIGFuY2hvclNpZGUpIHtcbiAgICAgIGluc3RhbmNlLmNsYXNzZXMuQXV4VW5pdExheW91dC5tb2RpZnlVbml0cyhub2RlLCBlbGUsIGFuY2hvclNpZGUsIGN5KTtcbiAgICB9O1xuXG5cbiAgICAvL0ZvciByZXZlcnNpYmxlIHJlYWN0aW9ucyBib3RoIHNpZGUgb2YgdGhlIHByb2Nlc3MgY2FuIGJlIGlucHV0L291dHB1dFxuICAgIC8vR3JvdXAgSUQgaWRlbnRpZmllcyB0byB3aGljaCBncm91cCBvZiBub2RlcyB0aGUgZWRnZSBpcyBnb2luZyB0byBiZSBjb25uZWN0ZWQgZm9yIHJldmVyc2libGUgcmVhY3Rpb25zKDA6IGdyb3VwIDEgSUQgYW5kIDE6Z3JvdXAgMiBJRClcbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQsIGVkZ2VQYXJhbXMsIGlkLCB2aXNpYmlsaXR5LCBncm91cElEICkge1xuICAgICAgaWYgKHR5cGVvZiBlZGdlUGFyYW1zICE9ICdvYmplY3QnKXtcbiAgICAgICAgdmFyIHNiZ25jbGFzcyA9IGVkZ2VQYXJhbXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzYmduY2xhc3MgPSBlZGdlUGFyYW1zLmNsYXNzO1xuICAgICAgICAgIHZhciBsYW5ndWFnZSA9IGVkZ2VQYXJhbXMubGFuZ3VhZ2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBjc3MgPSB7fTtcblxuICAgICAgaWYgKHZpc2liaWxpdHkpIHtcbiAgICAgICAgY3NzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xuICAgICAgfVxuXG4gICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICBjbGFzczogc2JnbmNsYXNzLFxuICAgICAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZSxcbiAgICAgIH07XG5cbiAgICAgIHZhciBkZWZhdWx0cyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIHNiZ25jbGFzcyApO1xuXG4gICAgICAvLyBleHRlbmQgdGhlIGRhdGEgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMgb2YgZWRnZSBzdHlsZVxuICAgICAgT2JqZWN0LmtleXMoIGRlZmF1bHRzICkuZm9yRWFjaCggZnVuY3Rpb24oIHByb3AgKSB7XG4gICAgICAgIGRhdGFbIHByb3AgXSA9IGRlZmF1bHRzWyBwcm9wIF07XG4gICAgICB9ICk7XG5cbiAgICAgIGlmKGlkKSB7XG4gICAgICAgIGRhdGEuaWQgPSBpZDtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkYXRhLmlkID0gZWxlbWVudFV0aWxpdGllcy5nZW5lcmF0ZUVkZ2VJZCgpO1xuICAgICAgfVxuXG4gICAgICBpZihlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOQ2FyZGluYWxpdHkoc2JnbmNsYXNzKSl7XG4gICAgICAgIGRhdGEuY2FyZGluYWxpdHkgPSAwO1xuICAgICAgfVxuXG4gICAgICB2YXIgc291cmNlTm9kZSA9IGN5LmdldEVsZW1lbnRCeUlkKHNvdXJjZSk7IC8vIFRoZSBvcmlnaW5hbCBzb3VyY2Ugbm9kZVxuICAgICAgdmFyIHRhcmdldE5vZGUgPSBjeS5nZXRFbGVtZW50QnlJZCh0YXJnZXQpOyAvLyBUaGUgb3JpZ2luYWwgdGFyZ2V0IG5vZGVcbiAgICAgIHZhciBzb3VyY2VIYXNQb3J0cyA9IHNvdXJjZU5vZGUuZGF0YSgncG9ydHMnKS5sZW5ndGggPT09IDI7XG4gICAgICB2YXIgdGFyZ2V0SGFzUG9ydHMgPSB0YXJnZXROb2RlLmRhdGEoJ3BvcnRzJykubGVuZ3RoID09PSAyO1xuICAgICAgLy8gVGhlIHBvcnRzb3VyY2UgYW5kIHBvcnR0YXJnZXQgdmFyaWFibGVzXG4gICAgICB2YXIgcG9ydHNvdXJjZTtcbiAgICAgIHZhciBwb3J0dGFyZ2V0O1xuXG4gICAgICAvKlxuICAgICAgICogR2V0IGlucHV0L291dHB1dCBwb3J0IGlkJ3Mgb2YgYSBub2RlIHdpdGggdGhlIGFzc3VtcHRpb24gdGhhdCB0aGUgbm9kZSBoYXMgdmFsaWQgcG9ydHMuXG4gICAgICAgKi9cbiAgICAgIHZhciBnZXRJT1BvcnRJZHMgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICB2YXIgbm9kZUlucHV0UG9ydElkLCBub2RlT3V0cHV0UG9ydElkO1xuICAgICAgICB2YXIgbm9kZVBvcnRzT3JkZXJpbmcgPSBzYmdudml6SW5zdGFuY2UuZWxlbWVudFV0aWxpdGllcy5nZXRQb3J0c09yZGVyaW5nKG5vZGUpO1xuICAgICAgICB2YXIgbm9kZVBvcnRzID0gbm9kZS5kYXRhKCdwb3J0cycpO1xuICAgICAgICBpZiAoIG5vZGVQb3J0c09yZGVyaW5nID09PSAnTC10by1SJyB8fCBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ1ItdG8tTCcgKSB7XG4gICAgICAgICAgdmFyIGxlZnRQb3J0SWQgPSBub2RlUG9ydHNbMF0ueCA8IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB4IHZhbHVlIG9mIGxlZnQgcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBuZWdhdGl2ZVxuICAgICAgICAgIHZhciByaWdodFBvcnRJZCA9IG5vZGVQb3J0c1swXS54ID4gMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHggdmFsdWUgb2YgcmlnaHQgcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBwb3NpdGl2ZVxuICAgICAgICAgIC8qXG4gICAgICAgICAgICogSWYgdGhlIHBvcnQgb3JkZXJpbmcgaXMgbGVmdCB0byByaWdodCB0aGVuIHRoZSBpbnB1dCBwb3J0IGlzIHRoZSBsZWZ0IHBvcnQgYW5kIHRoZSBvdXRwdXQgcG9ydCBpcyB0aGUgcmlnaHQgcG9ydC5cbiAgICAgICAgICAgKiBFbHNlIGlmIGl0IGlzIHJpZ2h0IHRvIGxlZnQgaXQgaXMgdmljZSB2ZXJzYVxuICAgICAgICAgICAqL1xuICAgICAgICAgIG5vZGVJbnB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnTC10by1SJyA/IGxlZnRQb3J0SWQgOiByaWdodFBvcnRJZDtcbiAgICAgICAgICBub2RlT3V0cHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdSLXRvLUwnID8gbGVmdFBvcnRJZCA6IHJpZ2h0UG9ydElkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ1QtdG8tQicgfHwgbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdCLXRvLVQnICl7XG4gICAgICAgICAgdmFyIHRvcFBvcnRJZCA9IG5vZGVQb3J0c1swXS55IDwgMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHkgdmFsdWUgb2YgdG9wIHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgbmVnYXRpdmVcbiAgICAgICAgICB2YXIgYm90dG9tUG9ydElkID0gbm9kZVBvcnRzWzBdLnkgPiAwID8gbm9kZVBvcnRzWzBdLmlkIDogbm9kZVBvcnRzWzFdLmlkOyAvLyBUaGUgeSB2YWx1ZSBvZiBib3R0b20gcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBwb3NpdGl2ZVxuICAgICAgICAgIC8qXG4gICAgICAgICAgICogSWYgdGhlIHBvcnQgb3JkZXJpbmcgaXMgdG9wIHRvIGJvdHRvbSB0aGVuIHRoZSBpbnB1dCBwb3J0IGlzIHRoZSB0b3AgcG9ydCBhbmQgdGhlIG91dHB1dCBwb3J0IGlzIHRoZSBib3R0b20gcG9ydC5cbiAgICAgICAgICAgKiBFbHNlIGlmIGl0IGlzIHJpZ2h0IHRvIGxlZnQgaXQgaXMgdmljZSB2ZXJzYVxuICAgICAgICAgICAqL1xuICAgICAgICAgIG5vZGVJbnB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnVC10by1CJyA/IHRvcFBvcnRJZCA6IGJvdHRvbVBvcnRJZDtcbiAgICAgICAgICBub2RlT3V0cHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdCLXRvLVQnID8gdG9wUG9ydElkIDogYm90dG9tUG9ydElkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBJTyBwb3J0cyBvZiB0aGUgbm9kZVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlucHV0UG9ydElkOiBub2RlSW5wdXRQb3J0SWQsXG4gICAgICAgICAgb3V0cHV0UG9ydElkOiBub2RlT3V0cHV0UG9ydElkXG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICAvLyBJZiBhdCBsZWFzdCBvbmUgZW5kIG9mIHRoZSBlZGdlIGhhcyBwb3J0cyB0aGVuIHdlIHNob3VsZCBkZXRlcm1pbmUgdGhlIHBvcnRzIHdoZXJlIHRoZSBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQuXG4gICAgICBpZiAoc291cmNlSGFzUG9ydHMgfHwgdGFyZ2V0SGFzUG9ydHMpIHtcbiAgICAgICAgdmFyIHNvdXJjZU5vZGVJbnB1dFBvcnRJZCwgc291cmNlTm9kZU91dHB1dFBvcnRJZCwgdGFyZ2V0Tm9kZUlucHV0UG9ydElkLCB0YXJnZXROb2RlT3V0cHV0UG9ydElkO1xuXG4gICAgICAgIC8vIElmIHNvdXJjZSBub2RlIGhhcyBwb3J0cyBzZXQgdGhlIHZhcmlhYmxlcyBkZWRpY2F0ZWQgZm9yIGl0cyBJTyBwb3J0c1xuICAgICAgICBpZiAoIHNvdXJjZUhhc1BvcnRzICkge1xuICAgICAgICAgIHZhciBpb1BvcnRzID0gZ2V0SU9Qb3J0SWRzKHNvdXJjZU5vZGUpO1xuICAgICAgICAgIHNvdXJjZU5vZGVJbnB1dFBvcnRJZCA9IGlvUG9ydHMuaW5wdXRQb3J0SWQ7XG4gICAgICAgICAgc291cmNlTm9kZU91dHB1dFBvcnRJZCA9IGlvUG9ydHMub3V0cHV0UG9ydElkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGFyZ2V0IG5vZGUgaGFzIHBvcnRzIHNldCB0aGUgdmFyaWFibGVzIGRlZGljYXRlZCBmb3IgaXRzIElPIHBvcnRzXG4gICAgICAgIGlmICggdGFyZ2V0SGFzUG9ydHMgKSB7XG4gICAgICAgICAgdmFyIGlvUG9ydHMgPSBnZXRJT1BvcnRJZHModGFyZ2V0Tm9kZSk7XG4gICAgICAgICAgdGFyZ2V0Tm9kZUlucHV0UG9ydElkID0gaW9Qb3J0cy5pbnB1dFBvcnRJZDtcbiAgICAgICAgICB0YXJnZXROb2RlT3V0cHV0UG9ydElkID0gaW9Qb3J0cy5vdXRwdXRQb3J0SWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2JnbmNsYXNzID09PSAnY29uc3VtcHRpb24nKSB7XG4gICAgICAgICAgLy8gQSBjb25zdW1wdGlvbiBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIGlucHV0IHBvcnQgb2YgdGhlIHRhcmdldCBub2RlIHdoaWNoIGlzIHN1cHBvc2VkIHRvIGJlIGEgcHJvY2VzcyAoYW55IGtpbmQgb2YpXG4gICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVJbnB1dFBvcnRJZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzYmduY2xhc3MgPT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIC8vIEEgcHJvZHVjdGlvbiBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIG91dHB1dCBwb3J0IG9mIHRoZSBzb3VyY2Ugbm9kZSB3aGljaCBpcyBzdXBwb3NlZCB0byBiZSBhIHByb2Nlc3MgKGFueSBraW5kIG9mKVxuICAgICAgICAgIC8vIEEgbW9kdWxhdGlvbiBlZGdlIG1heSBoYXZlIGEgbG9naWNhbCBvcGVyYXRvciBhcyBzb3VyY2Ugbm9kZSBpbiB0aGlzIGNhc2UgdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgb3V0cHV0IHBvcnQgb2YgaXRcbiAgICAgICAgICAvLyBUaGUgYmVsb3cgYXNzaWdubWVudCBzYXRpc2Z5IGFsbCBvZiB0aGVzZSBjb25kaXRpb25cbiAgICAgICAgICBpZihncm91cElEID09IDAgfHwgZ3JvdXBJRCA9PSB1bmRlZmluZWQpIHsgLy8gZ3JvdXBJRCAwIGZvciByZXZlcnNpYmxlIHJlYWN0aW9ucyBncm91cCAwXG4gICAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZU91dHB1dFBvcnRJZDtcbiAgICAgICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgeyAvL2lmIHJlYWN0aW9uIGlzIHJldmVyc2libGUgYW5kIGVkZ2UgYmVsb25ncyB0byBncm91cCAxXG4gICAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZUlucHV0UG9ydElkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGVsZW1lbnRVdGlsaXRpZXMuaXNNb2R1bGF0aW9uQXJjQ2xhc3Moc2JnbmNsYXNzKSB8fCBlbGVtZW50VXRpbGl0aWVzLmlzQUZBcmNDbGFzcyhzYmduY2xhc3MpKXtcbiAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZU91dHB1dFBvcnRJZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzYmduY2xhc3MgPT09ICdsb2dpYyBhcmMnKSB7XG4gICAgICAgICAgdmFyIHNyY0NsYXNzID0gc291cmNlTm9kZS5kYXRhKCdjbGFzcycpO1xuICAgICAgICAgIHZhciB0Z3RDbGFzcyA9IHRhcmdldE5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgICAgICB2YXIgaXNTb3VyY2VMb2dpY2FsT3AgPSBzcmNDbGFzcyA9PT0gJ2FuZCcgfHwgc3JjQ2xhc3MgPT09ICdvcicgfHwgc3JjQ2xhc3MgPT09ICdub3QnO1xuICAgICAgICAgIHZhciBpc1RhcmdldExvZ2ljYWxPcCA9IHRndENsYXNzID09PSAnYW5kJyB8fCB0Z3RDbGFzcyA9PT0gJ29yJyB8fCB0Z3RDbGFzcyA9PT0gJ25vdCc7XG5cbiAgICAgICAgICBpZiAoaXNTb3VyY2VMb2dpY2FsT3AgJiYgaXNUYXJnZXRMb2dpY2FsT3ApIHtcbiAgICAgICAgICAgIC8vIElmIGJvdGggZW5kIGFyZSBsb2dpY2FsIG9wZXJhdG9ycyB0aGVuIHRoZSBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIGlucHV0IHBvcnQgb2YgdGhlIHRhcmdldCBhbmQgdGhlIG91dHB1dCBwb3J0IG9mIHRoZSBpbnB1dFxuICAgICAgICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVJbnB1dFBvcnRJZDtcbiAgICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlT3V0cHV0UG9ydElkO1xuICAgICAgICAgIH0vLyBJZiBqdXN0IG9uZSBlbmQgb2YgbG9naWNhbCBvcGVyYXRvciB0aGVuIHRoZSBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIGlucHV0IHBvcnQgb2YgdGhlIGxvZ2ljYWwgb3BlcmF0b3JcbiAgICAgICAgICBlbHNlIGlmIChpc1NvdXJjZUxvZ2ljYWxPcCkge1xuICAgICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVJbnB1dFBvcnRJZDtcbiAgICAgICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlT3V0cHV0UG9ydElkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChpc1RhcmdldExvZ2ljYWxPcCkge1xuICAgICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZUlucHV0UG9ydElkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgZGVmYXVsdCBwb3J0c291cmNlL3BvcnR0YXJnZXQgYXJlIHRoZSBzb3VyY2UvdGFyZ2V0IHRoZW1zZWx2ZXMuIElmIHRoZXkgYXJlIG5vdCBzZXQgdXNlIHRoZXNlIGRlZmF1bHRzLlxuICAgICAgLy8gVGhlIHBvcnRzb3VyY2UgYW5kIHBvcnR0YXJnZXQgYXJlIGRldGVybWluZWQgc2V0IHRoZW0gaW4gZGF0YSBvYmplY3QuXG4gICAgICBkYXRhLnBvcnRzb3VyY2UgPSBwb3J0c291cmNlIHx8IHNvdXJjZTtcbiAgICAgIGRhdGEucG9ydHRhcmdldCA9IHBvcnR0YXJnZXQgfHwgdGFyZ2V0O1xuXG4gICAgICB2YXIgZWxlcyA9IGN5LmFkZCh7XG4gICAgICAgIGdyb3VwOiBcImVkZ2VzXCIsXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGNzczogY3NzXG4gICAgICB9KTtcblxuICAgICAgdmFyIG5ld0VkZ2UgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XG5cbiAgICAgIHJldHVybiBuZXdFZGdlO1xuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24oX3NvdXJjZSwgX3RhcmdldCwgbm9kZVBhcmFtcykge1xuICAgICAgLy8gSWYgc291cmNlIGFuZCB0YXJnZXQgSURzIGFyZSBnaXZlbiBnZXQgdGhlIGVsZW1lbnRzIGJ5IElEc1xuICAgICAgdmFyIHNvdXJjZSA9IHR5cGVvZiBfc291cmNlID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9zb3VyY2UpIDogX3NvdXJjZTtcbiAgICAgIHZhciB0YXJnZXQgPSB0eXBlb2YgX3RhcmdldCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfdGFyZ2V0KSA6IF90YXJnZXQ7XG5cbiAgICAgIC8vIFByb2Nlc3MgcGFyZW50IHNob3VsZCBiZSB0aGUgY2xvc2VzdCBjb21tb24gYW5jZXN0b3Igb2YgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0IG5vZGVzXG4gICAgICB2YXIgcHJvY2Vzc1BhcmVudCA9IGN5LmNvbGxlY3Rpb24oW3NvdXJjZVswXSwgdGFyZ2V0WzBdXSkuY29tbW9uQW5jZXN0b3JzKCkuZmlyc3QoKTtcblxuICAgICAgLy8gUHJvY2VzcyBzaG91bGQgYmUgYXQgdGhlIG1pZGRsZSBvZiB0aGUgc291cmNlIGFuZCB0YXJnZXQgbm9kZXNcbiAgICAgIHZhciB4ID0gKCBzb3VyY2UucG9zaXRpb24oJ3gnKSArIHRhcmdldC5wb3NpdGlvbigneCcpICkgLyAyO1xuICAgICAgdmFyIHkgPSAoIHNvdXJjZS5wb3NpdGlvbigneScpICsgdGFyZ2V0LnBvc2l0aW9uKCd5JykgKSAvIDI7XG5cbiAgICAgIC8vIENyZWF0ZSB0aGUgcHJvY2VzcyB3aXRoIGdpdmVuL2NhbGN1bGF0ZWQgdmFyaWFibGVzXG4gICAgICB2YXIgcHJvY2VzcyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4LCB5LCBub2RlUGFyYW1zLCB1bmRlZmluZWQsIHByb2Nlc3NQYXJlbnQuaWQoKSk7XG4gICAgICAgIHZhciB4ZGlmZiA9IHNvdXJjZS5wb3NpdGlvbigneCcpIC0gdGFyZ2V0LnBvc2l0aW9uKCd4Jyk7XG4gICAgICAgIHZhciB5ZGlmZiA9IHNvdXJjZS5wb3NpdGlvbigneScpIC0gdGFyZ2V0LnBvc2l0aW9uKCd5JylcbiAgICAgICAgaWYgKE1hdGguYWJzKHhkaWZmKSA+PSBNYXRoLmFicyh5ZGlmZikpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh4ZGlmZiA8IDApXG4gICAgICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdMLXRvLVInKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ1ItdG8tTCcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHlkaWZmIDwgMClcbiAgICAgICAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ1QtdG8tQicpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnQi10by1UJyk7XG4gICAgICAgIH1cblxuXG4gICAgICAvLyBDcmVhdGUgdGhlIGVkZ2VzIG9uZSBpcyBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgc291cmNlIG5vZGUgKHdoaWNoIHNob3VsZCBiZSBhIGNvbnN1bXB0aW9uKSxcbiAgICAgIC8vIHRoZSBvdGhlciBvbmUgaXMgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIHRhcmdldCBub2RlICh3aGljaCBzaG91bGQgYmUgYSBwcm9kdWN0aW9uKS5cbiAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uIHBsZWFzZSByZWZlciB0byBTQkdOLVBEIHJlZmVyZW5jZSBjYXJkLlxuICAgICAgdmFyIGVkZ2VCdHdTcmMgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2Uoc291cmNlLmlkKCksIHByb2Nlc3MuaWQoKSwge2NsYXNzIDogJ2NvbnN1bXB0aW9uJywgbGFuZ3VhZ2UgOiBub2RlUGFyYW1zLmxhbmd1YWdlfSk7XG4gICAgICB2YXIgZWRnZUJ0d1RndCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIHRhcmdldC5pZCgpLCB7Y2xhc3MgOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlIDogbm9kZVBhcmFtcy5sYW5ndWFnZX0pO1xuXG4gICAgICAvLyBDcmVhdGUgYSBjb2xsZWN0aW9uIGluY2x1ZGluZyB0aGUgZWxlbWVudHMgYW5kIHRvIGJlIHJldHVybmVkXG4gICAgICB2YXIgY29sbGVjdGlvbiA9IGN5LmNvbGxlY3Rpb24oW3Byb2Nlc3NbMF0sIGVkZ2VCdHdTcmNbMF0sIGVkZ2VCdHdUZ3RbMF1dKTtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIFRoaXMgbWV0aG9kIGFzc3VtZXMgdGhhdCBwYXJhbS5ub2Rlc1RvTWFrZUNvbXBvdW5kIGNvbnRhaW5zIGF0IGxlYXN0IG9uZSBub2RlXG4gICAgICogYW5kIGFsbCBvZiB0aGUgbm9kZXMgaW5jbHVkaW5nIGluIGl0IGhhdmUgdGhlIHNhbWUgcGFyZW50LiBJdCBjcmVhdGVzIGEgY29tcG91bmQgZm90IHRoZSBnaXZlbiBub2RlcyBhbiBoYXZpbmcgdGhlIGdpdmVuIHR5cGUuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAobm9kZXNUb01ha2VDb21wb3VuZCwgY29tcG91bmRUeXBlKSB7XG4gICAgICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XG4gICAgICB2YXIgbGFuZ3VhZ2UgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJsYW5ndWFnZVwiKTtcbiAgICAgIC8vIGlmIG5vZGVzVG9NYWtlQ29tcG91bmQgY29udGFpbiBib3RoIFBEIGFuZCBBRiBub2RlcywgdGhlbiBzZXQgbGFuZ3VhZ2Ugb2YgY29tcG91bmQgYXMgVW5rbm93blxuICAgICAgZm9yKCB2YXIgaT0xOyBpPG5vZGVzVG9NYWtlQ29tcG91bmQubGVuZ3RoOyBpKyspe1xuICAgICAgICBpZihub2Rlc1RvTWFrZUNvbXBvdW5kW2ldICE9IGxhbmd1YWdlKXtcbiAgICAgICAgICBsYW5ndWFnZSA9IFwiVW5rbm93blwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kLiB4LCB5IGFuZCBpZCBwYXJhbWV0ZXJzIGFyZSBub3Qgc2V0LlxuICAgICAgdmFyIG5ld0NvbXBvdW5kID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7Y2xhc3MgOiBjb21wb3VuZFR5cGUsIGxhbmd1YWdlIDogbGFuZ3VhZ2V9LCB1bmRlZmluZWQsIG9sZFBhcmVudElkKTtcbiAgICAgIHZhciBuZXdDb21wb3VuZElkID0gbmV3Q29tcG91bmQuaWQoKTtcbiAgICAgIHZhciBuZXdFbGVzID0gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQobm9kZXNUb01ha2VDb21wb3VuZCwgbmV3Q29tcG91bmRJZCk7XG4gICAgICBuZXdFbGVzID0gbmV3RWxlcy51bmlvbihuZXdDb21wb3VuZCk7XG4gICAgICByZXR1cm4gbmV3RWxlcztcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUcmFuc2xhdGlvblJlYWN0aW9uID0gZnVuY3Rpb24obVJuYU5hbWUsIHByb3RlaW5OYW1lLCBwcm9jZXNzUG9zaXRpb24sIGVkZ2VMZW5ndGgpIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoXCJ0cmFuc2xhdGlvblwiKTtcbiAgICAgIGNvbnN0IGRlZmF1bHRTb3VyY2VBbmRTaW5rUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoXCJzb3VyY2UgYW5kIHNpbmtcIik7XG4gICAgICBjb25zdCBkZWZhdWx0TnVjbGVpY0FjaWRGZWF0dXJlUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiKTtcbiAgICAgIGNvbnN0IGRlZmF1bHRNYWNyb21vbGVjdWxlUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoXCJtYWNyb21vbGVjdWxlXCIpO1xuICAgICAgY29uc3QgbWFjcm9tb2xlY3VsZVdpZHRoID0gZGVmYXVsdE1hY3JvbW9sZWN1bGVQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xuICAgICAgY29uc3Qgc291cmNlQW5kU2lua1dpZHRoID0gZGVmYXVsdFNvdXJjZUFuZFNpbmtQcm9wZXJ0aWVzLndpZHRoICB8fCA1MDtcbiAgICAgIGNvbnN0IG51Y2xlaWNBY2lkRmVhdHVyZUhlaWdodCA9IGRlZmF1bHROdWNsZWljQWNpZEZlYXR1cmVQcm9wZXJ0aWVzLmhlaWdodCB8fCA1MDtcbiAgICAgIGNvbnN0IHByb2Nlc3NXaWR0aCA9IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcy53aWR0aCB8fCA1MDtcbiAgICAgIGNvbnN0IHByb2Nlc3NIZWlnaHQgPSBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMuaGVpZ2h0IHx8IDUwO1xuICAgICAgdmFyIHByb2Nlc3NQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbiB8fCBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcbiAgICAgIHZhciBlZGdlTGVuZ3RoID0gZWRnZUxlbmd0aCB8fCA2MDtcblxuICAgICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJQRFwiKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHByb2Nlc3NOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwge2NsYXNzOiBcInByb2Nlc3NcIiwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3NOb2RlLCBcIkwtdG8tUlwiKTtcbiAgICAgIHByb2Nlc3NOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICBjb25zdCB4UG9zT2ZTb3VyY2VBbmRTaW5rTm9kZSA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBzb3VyY2VBbmRTaW5rV2lkdGggLyAyO1xuICAgICAgY29uc3QgeVBvc09mU291cmNlQW5kU2lua05vZGUgPSBwcm9jZXNzUG9zaXRpb24ueTtcbiAgICAgIHZhciBzb3VyY2VBbmRTaW5rTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zT2ZTb3VyY2VBbmRTaW5rTm9kZSwgeVBvc09mU291cmNlQW5kU2lua05vZGUsIHtjbGFzczogJ3NvdXJjZSBhbmQgc2luaycsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBzb3VyY2VBbmRTaW5rTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgdmFyIGNvbnN1bXB0aW9uRWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2VBbmRTaW5rTm9kZS5pZCgpLCBwcm9jZXNzTm9kZS5pZCgpLCB7Y2xhc3M6ICdjb25zdW1wdGlvbicsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBjb25zdW1wdGlvbkVkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIGNvbnN0IHhQb3NPZm1SbmFOb2RlID0gcHJvY2Vzc1Bvc2l0aW9uLng7XG4gICAgICBjb25zdCB5UG9zT2ZtUm5hTm9kZSA9IHByb2Nlc3NQb3NpdGlvbi55IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NIZWlnaHQgLyAyIC0gbnVjbGVpY0FjaWRGZWF0dXJlSGVpZ2h0IC8gMjtcbiAgICAgIHZhciBtUm5hTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zT2ZtUm5hTm9kZSwgeVBvc09mbVJuYU5vZGUsIHtjbGFzczogJ251Y2xlaWMgYWNpZCBmZWF0dXJlJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIG1SbmFOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgbVJuYU5vZGUuZGF0YSgnbGFiZWwnLCBtUm5hTmFtZSk7XG4gICAgICBjb25zdCBpbmZvYm94T2JqZWN0T2ZHZW5lID0ge1xuICAgICAgICBjbGF6ejogXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIsXG4gICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgdGV4dDogJ2N0Om1STkEnXG4gICAgICAgIH0sXG4gICAgICAgIGJib3g6IHtcbiAgICAgICAgICB3OiA0NSxcbiAgICAgICAgICBoOiAxNVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChtUm5hTm9kZSwgaW5mb2JveE9iamVjdE9mR2VuZSk7XG5cbiAgICAgIHZhciBuZWNlc3NhcnlTdGltdWxhdGlvbkVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobVJuYU5vZGUuaWQoKSwgcHJvY2Vzc05vZGUuaWQoKSwge2NsYXNzOiAnbmVjZXNzYXJ5IHN0aW11bGF0aW9uJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIG5lY2Vzc2FyeVN0aW11bGF0aW9uRWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgY29uc3QgeFBvc09mUHJvdGVpbk5vZGUgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgICAgIGNvbnN0IHlQb3N0T2ZQcm90ZWluTm9kZSA9IHByb2Nlc3NQb3NpdGlvbi55O1xuICAgICAgdmFyIHByb3RlaW5Ob2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZlByb3RlaW5Ob2RlLCB5UG9zdE9mUHJvdGVpbk5vZGUsIHtjbGFzczogJ21hY3JvbW9sZWN1bGUnLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgcHJvdGVpbk5vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICBwcm90ZWluTm9kZS5kYXRhKCdsYWJlbCcsIHByb3RlaW5OYW1lKTtcbiAgXG4gICAgICB2YXIgcHJvZHVjdGlvbkVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzc05vZGUuaWQoKSwgcHJvdGVpbk5vZGUuaWQoKSwge2NsYXNzOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBwcm9kdWN0aW9uRWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgY3kuZW5kQmF0Y2goKTtcblxuICAgICAgLy9maWx0ZXIgdGhlIGp1c3QgYWRkZWQgZWxlbWVtdHMgdG8gcmV0dXJuIHRoZW0gYW5kIHJlbW92ZSBqdXN0IGFkZGVkIG1hcmtcbiAgICAgIHZhciBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XG4gICAgICBlbGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZCcpO1xuXG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICBlbGVzLnNlbGVjdCgpO1xuXG4gICAgICByZXR1cm4gZWxlczsgLy8gUmV0dXJuIHRoZSBqdXN0IGFkZGVkIGVsZW1lbnRzXG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVHJhbnNjcmlwdGlvblJlYWN0aW9uID0gZnVuY3Rpb24oZ2VuZU5hbWUsIG1SbmFOYW1lLCBwcm9jZXNzUG9zaXRpb24sIGVkZ2VMZW5ndGgpIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoXCJ0cmFuc2NyaXB0aW9uXCIpO1xuICAgICAgY29uc3QgZGVmYXVsdFNvdXJjZUFuZFNpbmtQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhcInNvdXJjZSBhbmQgc2lua1wiKTtcbiAgICAgIGNvbnN0IGRlZmF1bHROdWNsZWljQWNpZEZlYXR1cmVQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCIpO1xuICAgICAgY29uc3Qgc291cmNlQW5kU2lua1dpZHRoID0gZGVmYXVsdFNvdXJjZUFuZFNpbmtQcm9wZXJ0aWVzLndpZHRoICB8fCA1MDtcbiAgICAgIGNvbnN0IG51Y2xlaWNBY2lkRmVhdHVyZUhlaWdodCA9IGRlZmF1bHROdWNsZWljQWNpZEZlYXR1cmVQcm9wZXJ0aWVzLmhlaWdodCB8fCA1MDtcbiAgICAgIGNvbnN0IG51Y2xlaWNBY2lkRmVhdHVyZVdpZHRoID0gZGVmYXVsdE51Y2xlaWNBY2lkRmVhdHVyZVByb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICBjb25zdCBwcm9jZXNzV2lkdGggPSBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICBjb25zdCBwcm9jZXNzSGVpZ2h0ID0gZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzLmhlaWdodCB8fCA1MDtcbiAgICAgIHZhciBwcm9jZXNzUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24gfHwgZWxlbWVudFV0aWxpdGllcy5jb252ZXJ0VG9Nb2RlbFBvc2l0aW9uKHt4OiBjeS53aWR0aCgpIC8gMiwgeTogY3kuaGVpZ2h0KCkgLyAyfSk7XG4gICAgICB2YXIgZWRnZUxlbmd0aCA9IGVkZ2VMZW5ndGggfHwgNjA7XG5cbiAgICAgIGN5LnN0YXJ0QmF0Y2goKTtcbiAgICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkpIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiUERcIik7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9jZXNzTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHtjbGFzczogXCJwcm9jZXNzXCIsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzTm9kZSwgXCJMLXRvLVJcIik7XG4gICAgICBwcm9jZXNzTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgY29uc3QgeFBvc09mU291cmNlQW5kU2lua05vZGUgPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gc291cmNlQW5kU2lua1dpZHRoIC8gMjtcbiAgICAgIGNvbnN0IHlQb3NPZlNvdXJjZUFuZFNpbmtOb2RlID0gcHJvY2Vzc1Bvc2l0aW9uLnk7XG4gICAgICB2YXIgc291cmNlQW5kU2lua05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc09mU291cmNlQW5kU2lua05vZGUsIHlQb3NPZlNvdXJjZUFuZFNpbmtOb2RlLCB7Y2xhc3M6ICdzb3VyY2UgYW5kIHNpbmsnLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgc291cmNlQW5kU2lua05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIHZhciBjb25zdW1wdGlvbkVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2Uoc291cmNlQW5kU2lua05vZGUuaWQoKSwgcHJvY2Vzc05vZGUuaWQoKSwge2NsYXNzOiAnY29uc3VtcHRpb24nLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgY29uc3VtcHRpb25FZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICBjb25zdCB4UG9zT2ZHZW5lTm9kZSA9IHByb2Nlc3NQb3NpdGlvbi54O1xuICAgICAgY29uc3QgeVBvc09mR2VuZU5vZGUgPSBwcm9jZXNzUG9zaXRpb24ueSAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzSGVpZ2h0IC8gMiAtIG51Y2xlaWNBY2lkRmVhdHVyZUhlaWdodCAvIDI7XG4gICAgICB2YXIgZ2VuZU5vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc09mR2VuZU5vZGUsIHlQb3NPZkdlbmVOb2RlLCB7Y2xhc3M6ICdudWNsZWljIGFjaWQgZmVhdHVyZScsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBnZW5lTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgIGdlbmVOb2RlLmRhdGEoJ2xhYmVsJywgZ2VuZU5hbWUpO1xuICAgICAgY29uc3QgaW5mb2JveE9iamVjdE9mR2VuZSA9IHtcbiAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiLFxuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgIHRleHQ6ICdjdDpnZW5lJ1xuICAgICAgICB9LFxuICAgICAgICBiYm94OiB7XG4gICAgICAgICAgdzogMzYsXG4gICAgICAgICAgaDogMTVcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3goZ2VuZU5vZGUsIGluZm9ib3hPYmplY3RPZkdlbmUpO1xuXG4gICAgICB2YXIgbmVjZXNzYXJ5U3RpbXVsYXRpb25FZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKGdlbmVOb2RlLmlkKCksIHByb2Nlc3NOb2RlLmlkKCksIHtjbGFzczogJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBuZWNlc3NhcnlTdGltdWxhdGlvbkVkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIGNvbnN0IHhQb3NPZm1SbmFOb2RlID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIG51Y2xlaWNBY2lkRmVhdHVyZVdpZHRoIC8gMjtcbiAgICAgIGNvbnN0IHlQb3N0T2ZtUm5hTm9kZSA9IHByb2Nlc3NQb3NpdGlvbi55O1xuICAgICAgdmFyIG1SbmFOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZm1SbmFOb2RlLCB5UG9zdE9mbVJuYU5vZGUsIHtjbGFzczogJ251Y2xlaWMgYWNpZCBmZWF0dXJlJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIG1SbmFOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgbVJuYU5vZGUuZGF0YSgnbGFiZWwnLCBtUm5hTmFtZSk7XG4gICAgICBjb25zdCBpbmZvYm94T2JqZWN0T2ZtUm5hID0ge1xuICAgICAgICBjbGF6ejogXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIsXG4gICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgdGV4dDogJ2N0Om1STkEnXG4gICAgICAgIH0sXG4gICAgICAgIGJib3g6IHtcbiAgICAgICAgICB3OiA0NSxcbiAgICAgICAgICBoOiAxNVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChtUm5hTm9kZSwgaW5mb2JveE9iamVjdE9mbVJuYSk7XG5cbiAgICAgIHZhciBwcm9kdWN0aW9uRWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzTm9kZS5pZCgpLCBtUm5hTm9kZS5pZCgpLCB7Y2xhc3M6ICdwcm9kdWN0aW9uJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIHByb2R1Y3Rpb25FZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICBjeS5lbmRCYXRjaCgpO1xuXG4gICAgICAvL2ZpbHRlciB0aGUganVzdCBhZGRlZCBlbGVtZW10cyB0byByZXR1cm4gdGhlbSBhbmQgcmVtb3ZlIGp1c3QgYWRkZWQgbWFya1xuICAgICAgdmFyIGVsZXMgPSBjeS5lbGVtZW50cygnW2p1c3RBZGRlZF0nKTtcbiAgICAgIGVsZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkJyk7XG5cbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICAgIGVsZXMuc2VsZWN0KCk7XG5cbiAgICAgIHJldHVybiBlbGVzOyAvLyBSZXR1cm4gdGhlIGp1c3QgYWRkZWQgZWxlbWVudHNcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5yb3RhdGU5MCA9IGZ1bmN0aW9uKHBvaW50LCBjZW50ZXIpIHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlWCA9IGNlbnRlci54IC0gcG9pbnQueDtcbiAgICAgIGNvbnN0IHJlbGF0aXZlWSA9IGNlbnRlci55IC0gcG9pbnQueTtcblxuICAgICAgY29uc3QgcmVsYXRpdmVSb3RhdGVkWCA9IHJlbGF0aXZlWTtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUm90YXRlZFkgPSAtMSAqIHJlbGF0aXZlWDtcblxuICAgICAgY29uc3QgcmVzdWx0WCA9IHJlbGF0aXZlUm90YXRlZFggKyBjZW50ZXIueDtcbiAgICAgIGNvbnN0IHJlc3VsdFkgPSByZWxhdGl2ZVJvdGF0ZWRZICsgY2VudGVyLnk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHJlc3VsdFgsXG4gICAgICAgIHk6IHJlc3VsdFlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbnZlcnNpb24gPSBmdW5jdGlvbiAobWFjcm9tb2xlY3VsZSwgcmVndWxhdG9yLCByZWd1bGF0b3JNdWx0aW1lciwgb3JpZW50YXRpb24sIGlucHV0SW5mb2JveExhYmVscywgb3V0cHV0SW5mb2JveExhYmVscykge1xuICAgICAgY29uc3QgaGFzUmVndWxhdG9yID0gcmVndWxhdG9yLm5hbWUgIT09IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IG1hY3JvbW9sZWN1bGVOYW1lID0gbWFjcm9tb2xlY3VsZS5uYW1lO1xuICAgICAgY29uc3QgbWFjcm9tb2xlY3VsZUlzTXVsdGltZXIgPSBtYWNyb21vbGVjdWxlLm11bHRpbWVyLmVuYWJsZWQ7XG4gICAgICBjb25zdCBtYWNyb21vbGVjdWxlTXVsdGltZXJDYXJkaW5hbGl0eSA9IG1hY3JvbW9sZWN1bGUubXVsdGltZXIuY2FyZGluYWxpdHk7XG4gICAgICBjb25zdCBkZWZhdWx0TWFjcm9tb2xlY3VsZVByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKFwibWFjcm9tb2xlY3VsZVwiKTtcbiAgICAgIGNvbnN0IGRlZmF1bHRSZWd1bGF0b3JQcm9wZXJ0aWVzID0gaGFzUmVndWxhdG9yID8gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhyZWd1bGF0b3IudHlwZSkgOiB7fTtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoXCJjYXRhbHl0aWNcIik7XG4gICAgICBjb25zdCBwcm9jZXNzV2lkdGggPSBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICBjb25zdCBtYWNyb21vbGVjdWxlV2lkdGggPSBkZWZhdWx0TWFjcm9tb2xlY3VsZVByb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICBjb25zdCBtYWNyb21vbGVjdWxlSGVpZ2h0ID0gZGVmYXVsdE1hY3JvbW9sZWN1bGVQcm9wZXJ0aWVzLmhlaWdodCB8fCA1MDsgXG4gICAgICBjb25zdCBwcm9jZXNzSGVpZ2h0ID0gZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzLmhlaWdodCB8fCA1MDtcbiAgICAgIGNvbnN0IHJlZ3VsYXRvckhlaWdodCA9IGRlZmF1bHRSZWd1bGF0b3JQcm9wZXJ0aWVzLmhlaWdodCB8fCA1MDtcbiAgICAgIGNvbnN0IHByb2Nlc3NQb3NpdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMuY29udmVydFRvTW9kZWxQb3NpdGlvbih7eDogY3kud2lkdGgoKSAvIDIsIHk6IGN5LmhlaWdodCgpIC8gMn0pO1xuICAgICAgY29uc3QgZWRnZUxlbmd0aCA9IDMwO1xuICAgICAgY29uc3QgcHJvY2Vzc1BvcnRzT3JkZXJpbmcgPSBvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiID8gXCJULXRvLUJcIiA6IFwiTC10by1SXCI7XG4gICAgICBjb25zdCBtaW5JbmZvYm94RGltZW5zaW9uID0gMjA7XG4gICAgICBjb25zdCB3aWR0aFBlckNoYXIgPSA2O1xuXG4gICAgICBjeS5zdGFydEJhdGNoKCk7XG5cbiAgICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkpIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiUERcIik7XG4gICAgICB9XG5cbiAgICAgIGxldCB4UG9zT2ZJbnB1dCA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICAgICAgbGV0IHhQb3NPZk91dHB1dCA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICAgICAgbGV0IHlQb3NPZklucHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnk7XG4gICAgICBsZXQgeVBvc09mT3V0cHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnk7XG5cbiAgICAgIGxldCBwcm9jZXNzTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHtjbGFzczogXCJwcm9jZXNzXCIsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzTm9kZSwgcHJvY2Vzc1BvcnRzT3JkZXJpbmcpO1xuICAgICAgcHJvY2Vzc05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIGxldCBub2RlUG9zaXRpb24gPSB7XG4gICAgICAgIHg6IHhQb3NPZklucHV0LFxuICAgICAgICB5OiB5UG9zT2ZJbnB1dFxuICAgICAgfVxuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgICAgbm9kZVBvc2l0aW9uID0gZWxlbWVudFV0aWxpdGllcy5yb3RhdGU5MChub2RlUG9zaXRpb24sIHByb2Nlc3NQb3NpdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGxldCBpbnB1dE5vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUobm9kZVBvc2l0aW9uLngsIG5vZGVQb3NpdGlvbi55LCB7Y2xhc3M6ICdtYWNyb21vbGVjdWxlJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIGlucHV0Tm9kZS5kYXRhKFwianVzdEFkZGVkXCIsIHRydWUpO1xuICAgICAgaW5wdXROb2RlLmRhdGEoXCJsYWJlbFwiLCBtYWNyb21vbGVjdWxlTmFtZSk7XG4gICAgICBpZiAobWFjcm9tb2xlY3VsZUlzTXVsdGltZXIpIHtcbiAgICAgICAgXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMoaW5wdXROb2RlLCB0cnVlKTtcblxuICAgICAgICBjb25zdCBjYXJkaW5hbGl0eSA9IG1hY3JvbW9sZWN1bGVNdWx0aW1lckNhcmRpbmFsaXR5O1xuICAgICAgICBpZiAoY2FyZGluYWxpdHkgIT0gJycpIHtcbiAgICAgICAgICBjb25zdCBpbmZvYm94TGFiZWwgPSBcIk46XCIgKyBjYXJkaW5hbGl0eTtcbiAgICAgICAgICBpbmZvYm94T2JqZWN0ID0ge1xuICAgICAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiLFxuICAgICAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICAgdGV4dDogaW5mb2JveExhYmVsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmJveDoge1xuICAgICAgICAgICAgICB3OiBpbmZvYm94TGFiZWwubGVuZ3RoICogd2lkdGhQZXJDaGFyLFxuICAgICAgICAgICAgICBoOiBtaW5JbmZvYm94RGltZW5zaW9uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KGlucHV0Tm9kZSwgaW5mb2JveE9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaW5wdXRJbmZvYm94TGFiZWxzLmZvckVhY2goZnVuY3Rpb24obGFiZWwpIHtcbiAgICAgICAgY29uc3QgaW5wdXRJbmZvYm94V2lkdGggPSBsYWJlbC5sZW5ndGggPiAwID8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KHdpZHRoUGVyQ2hhciAqIGxhYmVsLmxlbmd0aCwgbWluSW5mb2JveERpbWVuc2lvbikgOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluSW5mb2JveERpbWVuc2lvbjsgXG4gICAgICAgIGxldCBpbmZvYm94T2JqZWN0ID0ge1xuICAgICAgICAgIGNsYXp6OiBcInVuaXQgb2YgaW5mb3JtYXRpb25cIixcbiAgICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgdGV4dDogbGFiZWxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJib3g6IHtcbiAgICAgICAgICAgIHc6IGlucHV0SW5mb2JveFdpZHRoLFxuICAgICAgICAgICAgaDogbWluSW5mb2JveERpbWVuc2lvblxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIFwic2hhcGUtbmFtZVwiOiBcImVsbGlwc2VcIlxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChpbnB1dE5vZGUsIGluZm9ib3hPYmplY3QpO1xuICAgICAgfSk7XG5cbiAgICAgIGxldCBpbnB1dEVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UoaW5wdXROb2RlLmlkKCksIHByb2Nlc3NOb2RlLmlkKCksIHtjbGFzczogJ2NvbnN1bXB0aW9uJywgbGFuZ3VhZ2U6ICdQRCd9KVxuICAgICAgaW5wdXRFZGdlLmRhdGEoXCJqdXN0QWRkZWRcIiwgdHJ1ZSk7XG5cbiAgICAgIG5vZGVQb3NpdGlvbiA9IHtcbiAgICAgICAgeDogeFBvc09mT3V0cHV0LFxuICAgICAgICB5OiB5UG9zT2ZPdXRwdXRcbiAgICAgIH1cblxuICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgICAgbm9kZVBvc2l0aW9uID0gZWxlbWVudFV0aWxpdGllcy5yb3RhdGU5MChub2RlUG9zaXRpb24sIHByb2Nlc3NQb3NpdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGxldCBvdXRwdXROb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5vZGVQb3NpdGlvbi54LCBub2RlUG9zaXRpb24ueSwge2NsYXNzOiAnbWFjcm9tb2xlY3VsZScsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBvdXRwdXROb2RlLmRhdGEoXCJqdXN0QWRkZWRcIiwgdHJ1ZSk7XG4gICAgICBvdXRwdXROb2RlLmRhdGEoXCJsYWJlbFwiLCBtYWNyb21vbGVjdWxlTmFtZSk7XG4gICAgICBpZiAobWFjcm9tb2xlY3VsZUlzTXVsdGltZXIpIHtcbiAgICAgICAgXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMob3V0cHV0Tm9kZSwgdHJ1ZSk7XG5cbiAgICAgICAgY29uc3QgY2FyZGluYWxpdHkgPSBtYWNyb21vbGVjdWxlTXVsdGltZXJDYXJkaW5hbGl0eTtcbiAgICAgICAgaWYgKGNhcmRpbmFsaXR5ICE9ICcnKSB7XG4gICAgICAgICAgY29uc3QgaW5mb2JveExhYmVsID0gXCJOOlwiICsgY2FyZGluYWxpdHk7XG4gICAgICAgICAgaW5mb2JveE9iamVjdCA9IHtcbiAgICAgICAgICAgIGNsYXp6OiBcInVuaXQgb2YgaW5mb3JtYXRpb25cIixcbiAgICAgICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgICAgIHRleHQ6IGluZm9ib3hMYWJlbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJib3g6IHtcbiAgICAgICAgICAgICAgdzogaW5mb2JveExhYmVsLmxlbmd0aCAqIHdpZHRoUGVyQ2hhcixcbiAgICAgICAgICAgICAgaDogbWluSW5mb2JveERpbWVuc2lvblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChvdXRwdXROb2RlLCBpbmZvYm94T2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBvdXRwdXRJbmZvYm94TGFiZWxzLmZvckVhY2goZnVuY3Rpb24obGFiZWwpIHtcbiAgICAgICAgY29uc3Qgb3V0cHV0SW5mb2JveFdpZHRoID0gbGFiZWwubGVuZ3RoID4gMCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1heCh3aWR0aFBlckNoYXIgKiBsYWJlbC5sZW5ndGgsIG1pbkluZm9ib3hEaW1lbnNpb24pIDogXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbkluZm9ib3hEaW1lbnNpb247XG4gICAgICAgIGluZm9ib3hPYmplY3QgPSB7XG4gICAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiLFxuICAgICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgICB0ZXh0OiBsYWJlbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYmJveDoge1xuICAgICAgICAgICAgdzogb3V0cHV0SW5mb2JveFdpZHRoLFxuICAgICAgICAgICAgaDogbWluSW5mb2JveERpbWVuc2lvblxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIFwic2hhcGUtbmFtZVwiOiBcImVsbGlwc2VcIlxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChvdXRwdXROb2RlLCBpbmZvYm94T2JqZWN0KTtcbiAgICAgIH0pO1xuXG4gICAgICBcbiAgICAgIFtpbnB1dE5vZGUsIG91dHB1dE5vZGVdLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5XaWR0aChub2RlKTtcbiAgICAgICAgXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMobm9kZSwgd2lkdGgsIG1hY3JvbW9sZWN1bGVIZWlnaHQsIGZhbHNlLCB0cnVlKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgIGxldCBuZXdJbnB1dFhQb3MgPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gaW5wdXROb2RlLmRhdGEoJ2Jib3gnKS53IC8gMjtcbiAgICAgICAgaW5wdXROb2RlLnBvc2l0aW9uKCd4JywgbmV3SW5wdXRYUG9zKTtcbiAgICAgIFxuICAgICAgICBsZXQgbmV3T3V0cHV0WFBvcyA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBvdXRwdXROb2RlLmRhdGEoJ2Jib3gnKS53IC8gMjtcbiAgICAgICAgb3V0cHV0Tm9kZS5wb3NpdGlvbigneCcsIG5ld091dHB1dFhQb3MpO1xuICAgICAgfSBcbiAgICAgIGVsc2Uge1xuICAgICAgICBsZXQgbmV3SW5wdXRZUG9zID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIGlucHV0Tm9kZS5kYXRhKCdiYm94JykuaCAvIDI7XG4gICAgICAgIGlucHV0Tm9kZS5wb3NpdGlvbigneScsIG5ld0lucHV0WVBvcyk7XG4gICAgICBcbiAgICAgICAgbGV0IG5ld091dHB1dFlQb3MgPSBwcm9jZXNzUG9zaXRpb24ueSArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgb3V0cHV0Tm9kZS5kYXRhKCdiYm94JykuaCAvIDI7XG4gICAgICAgIG91dHB1dE5vZGUucG9zaXRpb24oJ3knLCBuZXdPdXRwdXRZUG9zKTtcbiAgICAgIH1cblxuICAgICAgbGV0IG91dHB1dEVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzc05vZGUuaWQoKSwgb3V0cHV0Tm9kZS5pZCgpLCB7Y2xhc3M6ICdwcm9kdWN0aW9uJywgbGFuZ3VhZ2U6ICdQRCd9KVxuICAgICAgb3V0cHV0RWRnZS5kYXRhKFwianVzdEFkZGVkXCIsIHRydWUpO1xuXG4gICAgICBpZiAoaGFzUmVndWxhdG9yKSB7XG4gICAgICAgIGNvbnN0IHJlZ3VsYXRvck5hbWUgPSByZWd1bGF0b3IubmFtZTtcbiAgICAgICAgY29uc3QgcmVndWxhdG9yVHlwZSA9IHJlZ3VsYXRvci50eXBlO1xuICAgICAgICBsZXQgeFBvc09mUmVndWxhdG9yID0gcHJvY2Vzc1Bvc2l0aW9uLng7XG4gICAgICAgIGxldCB5UG9zT2ZSZWd1bGF0b3IgPSBwcm9jZXNzUG9zaXRpb24ueSAtICgocHJvY2Vzc0hlaWdodCAvIDIpICsgKHJlZ3VsYXRvckhlaWdodCAvIDIpICsgZWRnZUxlbmd0aCk7IFxuXG4gICAgICAgIG5vZGVQb3NpdGlvbiA9IHtcbiAgICAgICAgICB4OiB4UG9zT2ZSZWd1bGF0b3IsXG4gICAgICAgICAgeTogeVBvc09mUmVndWxhdG9yXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgICAgICBub2RlUG9zaXRpb24gPSBlbGVtZW50VXRpbGl0aWVzLnJvdGF0ZTkwKG5vZGVQb3NpdGlvbiwgcHJvY2Vzc1Bvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZWd1bGF0b3JOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5vZGVQb3NpdGlvbi54LCBub2RlUG9zaXRpb24ueSwge2NsYXNzOiByZWd1bGF0b3JUeXBlLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgICByZWd1bGF0b3JOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgICByZWd1bGF0b3JOb2RlLmRhdGEoJ2xhYmVsJywgcmVndWxhdG9yTmFtZSk7XG5cbiAgICAgICAgaWYgKHJlZ3VsYXRvck11bHRpbWVyLmVuYWJsZWQpIHtcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKHJlZ3VsYXRvck5vZGUsIHRydWUpO1xuXG4gICAgICAgICAgY29uc3QgY2FyZGluYWxpdHkgPSByZWd1bGF0b3JNdWx0aW1lci5jYXJkaW5hbGl0eTtcbiAgICAgICAgICBpZiAoY2FyZGluYWxpdHkgIT0gJycpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZm9ib3hMYWJlbCA9IFwiTjpcIiArIGNhcmRpbmFsaXR5O1xuICAgICAgICAgICAgaW5mb2JveE9iamVjdCA9IHtcbiAgICAgICAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiLFxuICAgICAgICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgICAgIHRleHQ6IGluZm9ib3hMYWJlbFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBiYm94OiB7XG4gICAgICAgICAgICAgICAgdzogaW5mb2JveExhYmVsLmxlbmd0aCAqIHdpZHRoUGVyQ2hhcixcbiAgICAgICAgICAgICAgICBoOiBtaW5JbmZvYm94RGltZW5zaW9uXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KHJlZ3VsYXRvck5vZGUsIGluZm9ib3hPYmplY3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZWd1bGF0b3JFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHJlZ3VsYXRvck5vZGUuaWQoKSwgcHJvY2Vzc05vZGUuaWQoKSwge2NsYXNzOiAnY2F0YWx5c2lzJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgICAgcmVndWxhdG9yRWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgY3kuZW5kQmF0Y2goKTtcblxuICAgICAgY29uc3QgZWxlcyA9IGN5LmVsZW1lbnRzKCdbanVzdEFkZGVkXScpO1xuICAgICAgZWxlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWQnKTtcblxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgZWxlcy5zZWxlY3QoKTtcblxuICAgICAgcmV0dXJuIGVsZXM7XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlTWV0YWJvbGljUmVhY3Rpb24gPSBmdW5jdGlvbiAoaW5wdXRzLCBvdXRwdXRzLCByZXZlcnNpYmxlLCByZWd1bGF0b3IsIHJlZ3VsYXRvck11bHRpbWVyLCBvcmllbnRhdGlvbikge1xuICAgICAgbGV0IHJvdGF0ZTkwID0gZnVuY3Rpb24ocG9pbnQsIGNlbnRlcikge1xuICAgICAgICBjb25zdCByZWxhdGl2ZVggPSBjZW50ZXIueCAtIHBvaW50Lng7XG4gICAgICAgIGNvbnN0IHJlbGF0aXZlWSA9IGNlbnRlci55IC0gcG9pbnQueTtcblxuICAgICAgICBjb25zdCByZWxhdGl2ZVJvdGF0ZWRYID0gcmVsYXRpdmVZO1xuICAgICAgICBjb25zdCByZWxhdGl2ZVJvdGF0ZWRZID0gLTEgKiByZWxhdGl2ZVg7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0WCA9IHJlbGF0aXZlUm90YXRlZFggKyBjZW50ZXIueDtcbiAgICAgICAgY29uc3QgcmVzdWx0WSA9IHJlbGF0aXZlUm90YXRlZFkgKyBjZW50ZXIueTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHg6IHJlc3VsdFgsXG4gICAgICAgICAgeTogcmVzdWx0WVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3QgaGFzUmVndWxhdG9yID0gcmVndWxhdG9yLm5hbWUgIT09IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBcInNpbXBsZSBjaGVtaWNhbFwiICk7XG4gICAgICBjb25zdCBkZWZhdWx0UmVndWxhdG9yUHJvcGVydGllcyA9IGhhc1JlZ3VsYXRvciA/IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMocmVndWxhdG9yLnR5cGUpIDoge307XG4gICAgICBjb25zdCBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKFwiY2F0YWx5dGljXCIpO1xuICAgICAgY29uc3QgcHJvY2Vzc1dpZHRoID0gZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xuICAgICAgY29uc3QgcHJvY2Vzc0hlaWdodCA9IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XG4gICAgICBjb25zdCBzaW1wbGVDaGVtaWNhbEhlaWdodCA9IGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMuaGVpZ2h0IHx8IDM1O1xuICAgICAgY29uc3Qgc2ltcGxlQ2hlbWljYWxXaWR0aCA9IGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMud2lkdGggfHwgMzU7XG4gICAgICBjb25zdCByZWd1bGF0b3JIZWlnaHQgPSBkZWZhdWx0UmVndWxhdG9yUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XG4gICAgICBjb25zdCBwcm9jZXNzUG9zaXRpb24gPSBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcbiAgICAgIGNvbnN0IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA9IDE1O1xuICAgICAgY29uc3QgdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPSAxNTtcbiAgICAgIGNvbnN0IGVkZ2VMZW5ndGggPSAzMDtcbiAgICAgIGNvbnN0IHByb2Nlc3NMZWZ0U2lkZUVkZ2VUeXBlID0gcmV2ZXJzaWJsZSA/IFwicHJvZHVjdGlvblwiIDogXCJjb25zdW1wdGlvblwiO1xuICAgICAgY29uc3QgcHJvY2Vzc1JpZ2h0U2lkZUVkZ2VUeXBlID0gXCJwcm9kdWN0aW9uXCI7XG4gICAgICBjb25zdCBwcm9jZXNzUG9ydHNPcmRlcmluZyA9IG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIgPyBcIlQtdG8tQlwiIDogXCJMLXRvLVJcIjtcblxuICAgICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJQRFwiKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHhQb3NPZklucHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIHNpbXBsZUNoZW1pY2FsV2lkdGggLyAyO1xuICAgICAgbGV0IHhQb3NPZk91dHB1dCA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBzaW1wbGVDaGVtaWNhbFdpZHRoIC8gMjtcblxuXG4gICAgICBsZXQgcHJvY2Vzc05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB7Y2xhc3M6IFwicHJvY2Vzc1wiLCBsYW5ndWFnZTogXCJQRFwifSk7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2Vzc05vZGUsIHByb2Nlc3NQb3J0c09yZGVyaW5nKTtcbiAgICAgIHByb2Nlc3NOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICBjb25zdCBudW1PZklucHV0Tm9kZXMgPSBpbnB1dHMubGVuZ3RoO1xuICAgICAgY29uc3QgbnVtT2ZPdXRwdXROb2RlcyA9IG91dHB1dHMubGVuZ3RoO1xuXG4gICAgICBsZXQgeVBvc09mSW5wdXQgPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZJbnB1dE5vZGVzIC0gMSkgLyAyKSAqIChzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XG5cbiAgICAgIGlucHV0cy5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEsIGluZGV4KSB7XG4gICAgICAgIGNvbnN0IG5vZGVOYW1lID0gZGF0YS5uYW1lO1xuICAgICAgICBjb25zdCBub2RlVHlwZSA9IGRhdGEudHlwZTtcblxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICB5UG9zT2ZJbnB1dCA9IHByb2Nlc3NQb3NpdGlvbi55O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGluZGV4ICUgMiA9PT0gMSkge1xuICAgICAgICAgIHlQb3NPZklucHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKHNpbXBsZUNoZW1pY2FsSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKSAqIE1hdGguY2VpbChpbmRleCAvIDIpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB5UG9zT2ZJbnB1dCA9IHByb2Nlc3NQb3NpdGlvbi55ICsgKChzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCkgKiAoaW5kZXggLyAyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbm9kZVBvc2l0aW9uID0ge1xuICAgICAgICAgIHg6IHhQb3NPZklucHV0LFxuICAgICAgICAgIHk6IHlQb3NPZklucHV0XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgICAgICBub2RlUG9zaXRpb24gPSByb3RhdGU5MChub2RlUG9zaXRpb24sIHByb2Nlc3NQb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShub2RlUG9zaXRpb24ueCwgbm9kZVBvc2l0aW9uLnksIHtjbGFzczogbm9kZVR5cGUudG9Mb3dlckNhc2UoKSwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgICBuZXdOb2RlLmRhdGEoXCJqdXN0QWRkZWRcIiwgdHJ1ZSk7XG4gICAgICAgIG5ld05vZGUuZGF0YShcImxhYmVsXCIsIG5vZGVOYW1lKTtcblxuICAgICAgICBsZXQgbmV3RWRnZTtcbiAgICAgICAgaWYgKHJldmVyc2libGUpIHtcbiAgICAgICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3NOb2RlLmlkKCksIG5ld05vZGUuaWQoKSwge2NsYXNzOiBwcm9jZXNzTGVmdFNpZGVFZGdlVHlwZSwgbGFuZ3VhZ2U6IFwiUERcIn0sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG5ld05vZGUuaWQoKSwgcHJvY2Vzc05vZGUuaWQoKSwge2NsYXNzOiBwcm9jZXNzTGVmdFNpZGVFZGdlVHlwZSwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgICB9XG4gICAgICAgIG5ld0VkZ2UuZGF0YShcImp1c3RBZGRlZFwiLCB0cnVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgeVBvc09mT3V0cHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKG51bU9mT3V0cHV0Tm9kZXMgLSAxKSAvIDIpICogKHNpbXBsZUNoZW1pY2FsSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKTtcblxuICAgICAgb3V0cHV0cy5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEsIGluZGV4KSB7XG4gICAgICAgIGNvbnN0IG5vZGVOYW1lID0gZGF0YS5uYW1lO1xuICAgICAgICBjb25zdCBub2RlVHlwZSA9IGRhdGEudHlwZTtcblxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICB5UG9zT2ZPdXRwdXQgPSBwcm9jZXNzUG9zaXRpb24ueTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbmRleCAlIDIgPT09IDEpIHtcbiAgICAgICAgICB5UG9zT2ZPdXRwdXQgPSBwcm9jZXNzUG9zaXRpb24ueSAtICgoc2ltcGxlQ2hlbWljYWxIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpICogTWF0aC5jZWlsKGluZGV4IC8gMikpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHlQb3NPZk91dHB1dCA9IHByb2Nlc3NQb3NpdGlvbi55ICsgKChzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCkgKiAoaW5kZXggLyAyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbm9kZVBvc2l0aW9uID0ge1xuICAgICAgICAgIHg6IHhQb3NPZk91dHB1dCxcbiAgICAgICAgICB5OiB5UG9zT2ZPdXRwdXRcbiAgICAgICAgfVxuICAgICAgICBpZiAob3JpZW50YXRpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgICAgIG5vZGVQb3NpdGlvbiA9IHJvdGF0ZTkwKG5vZGVQb3NpdGlvbiwgcHJvY2Vzc1Bvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5vZGVQb3NpdGlvbi54LCBub2RlUG9zaXRpb24ueSwge2NsYXNzOiBub2RlVHlwZS50b0xvd2VyQ2FzZSgpLCBsYW5ndWFnZTogXCJQRFwifSk7XG4gICAgICAgIG5ld05vZGUuZGF0YShcImp1c3RBZGRlZFwiLCB0cnVlKTtcbiAgICAgICAgbmV3Tm9kZS5kYXRhKFwibGFiZWxcIiwgbm9kZU5hbWUpO1xuXG4gICAgICAgIGxldCBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3NOb2RlLmlkKCksIG5ld05vZGUuaWQoKSwge2NsYXNzOiBwcm9jZXNzUmlnaHRTaWRlRWRnZVR5cGUsIGxhbmd1YWdlOiBcIlBEXCJ9LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgMCk7XG4gICAgICAgIG5ld0VkZ2UuZGF0YShcImp1c3RBZGRlZFwiLCB0cnVlKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBhZGQgcmVndWxhdG9yIG5vZGVcbiAgICAgIGlmIChoYXNSZWd1bGF0b3IpIHtcbiAgICAgICAgY29uc3QgcmVndWxhdG9yTmFtZSA9IHJlZ3VsYXRvci5uYW1lO1xuICAgICAgICBjb25zdCByZWd1bGF0b3JUeXBlID0gcmVndWxhdG9yLnR5cGU7XG4gICAgICAgIGxldCB4UG9zT2ZSZWd1bGF0b3IgPSBwcm9jZXNzUG9zaXRpb24ueDtcbiAgICAgICAgbGV0IHlQb3NPZlJlZ3VsYXRvciA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKChwcm9jZXNzSGVpZ2h0IC8gMikgKyAocmVndWxhdG9ySGVpZ2h0IC8gMikgKyBlZGdlTGVuZ3RoKTsgXG5cbiAgICAgICAgbGV0IG5vZGVQb3NpdGlvbiA9IHtcbiAgICAgICAgICB4OiB4UG9zT2ZSZWd1bGF0b3IsXG4gICAgICAgICAgeTogeVBvc09mUmVndWxhdG9yXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgICAgICBub2RlUG9zaXRpb24gPSByb3RhdGU5MChub2RlUG9zaXRpb24sIHByb2Nlc3NQb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVndWxhdG9yTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShub2RlUG9zaXRpb24ueCwgbm9kZVBvc2l0aW9uLnksIHtjbGFzczogcmVndWxhdG9yVHlwZSwgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgICAgcmVndWxhdG9yTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgICAgcmVndWxhdG9yTm9kZS5kYXRhKCdsYWJlbCcsIHJlZ3VsYXRvck5hbWUpO1xuXG4gICAgICAgIGlmIChyZWd1bGF0b3JNdWx0aW1lci5lbmFibGVkKSB7XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhyZWd1bGF0b3JOb2RlLCB0cnVlKTtcblxuICAgICAgICAgIGNvbnN0IGNhcmRpbmFsaXR5ID0gcmVndWxhdG9yTXVsdGltZXIuY2FyZGluYWxpdHk7XG4gICAgICAgICAgaWYgKGNhcmRpbmFsaXR5ICE9ICcnKSB7XG4gICAgICAgICAgICBjb25zdCBpbmZvYm94TGFiZWwgPSBcIk46XCIgKyBjYXJkaW5hbGl0eTtcbiAgICAgICAgICAgIGluZm9ib3hPYmplY3QgPSB7XG4gICAgICAgICAgICAgIGNsYXp6OiBcInVuaXQgb2YgaW5mb3JtYXRpb25cIixcbiAgICAgICAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBpbmZvYm94TGFiZWxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgYmJveDoge1xuICAgICAgICAgICAgICAgIHc6IGluZm9ib3hMYWJlbC5sZW5ndGggKiA2LFxuICAgICAgICAgICAgICAgIGg6IDE1XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gocmVndWxhdG9yTm9kZSwgaW5mb2JveE9iamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlZ3VsYXRvckVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocmVndWxhdG9yTm9kZS5pZCgpLCBwcm9jZXNzTm9kZS5pZCgpLCB7Y2xhc3M6ICdjYXRhbHlzaXMnLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgICByZWd1bGF0b3JFZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBjeS5lbmRCYXRjaCgpO1xuXG4gICAgICBjb25zdCBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XG4gICAgICBlbGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZCcpO1xuXG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICBlbGVzLnNlbGVjdCgpO1xuXG4gICAgICByZXR1cm4gZWxlcztcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVNZXRhYm9saWNDYXRhbHl0aWNBY3Rpdml0eSA9IGZ1bmN0aW9uKGlucHV0Tm9kZUxpc3QsIG91dHB1dE5vZGVMaXN0LCBjYXRhbHlzdE5hbWUsIGNhdGFseXN0VHlwZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XG4gICAgICB2YXIgZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBcIm1hY3JvbW9sZWN1bGVcIiApO1xuICAgICAgdmFyIGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBcInNpbXBsZSBjaGVtaWNhbFwiICk7XG4gICAgICB2YXIgZGVmYXVsdENhdGFseXN0VHlwZVByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKGNhdGFseXN0VHlwZSk7XG4gICAgICB2YXIgZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhcImNhdGFseXRpY1wiKTtcbiAgICAgIHZhciBwcm9jZXNzV2lkdGggPSBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICB2YXIgcHJvY2Vzc0hlaWdodCA9IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XG4gICAgICB2YXIgc2ltcGxlQ2hlbWljYWxIZWlnaHQgPSBkZWZhdWx0U2ltcGxlQ2hlbWljYWxQcm9wZXJ0aWVzLmhlaWdodCB8fCAzNTtcbiAgICAgIHZhciBtYWNyb21vbGVjdWxlV2lkdGggPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcy53aWR0aCB8fCA1MDtcbiAgICAgIHZhciBtYWNyb21vbGVjdWxlSGVpZ2h0ID0gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMuaGVpZ2h0IHx8IDUwO1xuICAgICAgdmFyIGNhdGFseXN0SGVpZ2h0ID0gZGVmYXVsdENhdGFseXN0VHlwZVByb3BlcnRpZXMuaGVpZ2h0IHx8IDUwO1xuICAgICAgdmFyIHByb2Nlc3NQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbiB8fCBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcbiAgICAgIHZhciB0aWxpbmdQYWRkaW5nVmVydGljYWwgPSB0aWxpbmdQYWRkaW5nVmVydGljYWwgfHwgMTU7XG4gICAgICB2YXIgdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPSB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCB8fCAxNTtcbiAgICAgIHZhciBlZGdlTGVuZ3RoID0gZWRnZUxlbmd0aCB8fCA2MDtcblxuICAgICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJQRFwiKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHhQb3NPZklucHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gICAgICB2YXIgeFBvc09mT3V0cHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG5cbiAgICAgIHZhciBwcm9jZXNzTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHtjbGFzczogXCJwcm9jZXNzXCIsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzTm9kZSwgXCJMLXRvLVJcIik7XG4gICAgICBwcm9jZXNzTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgY29uc3QgbnVtT2ZJbnB1dE5vZGVzID0gaW5wdXROb2RlTGlzdC5sZW5ndGg7XG4gICAgICBjb25zdCBudW1PZk91dHB1dE5vZGVzID0gb3V0cHV0Tm9kZUxpc3QubGVuZ3RoO1xuICAgICAgdmFyIHlQb3NPZklucHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKG51bU9mSW5wdXROb2RlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XG5cbiAgICAgIC8vIGFkZCBpbnB1dCBzaWRlIG5vZGVzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mSW5wdXROb2RlczsgaSsrKSB7XG4gICAgICAgIGlmKGlucHV0Tm9kZUxpc3RbaV0udHlwZSA9PSBcIlNpbXBsZSBDaGVtaWNhbFwiKXtcbiAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zT2ZJbnB1dCwgeVBvc09mSW5wdXQsIHtjbGFzcyA6ICdzaW1wbGUgY2hlbWljYWwnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgICB5UG9zT2ZJbnB1dCArPSBzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZklucHV0LCB5UG9zT2ZJbnB1dCwge2NsYXNzIDogJ21hY3JvbW9sZWN1bGUnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgICAvL3VwZGF0ZSB0aGUgeSBwb3NpdGlvblxuICAgICAgICAgIHlQb3NPZklucHV0ICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gICAgICAgIH1cbiAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIGlucHV0Tm9kZUxpc3RbaV0ubmFtZSk7XG5cbiAgICAgICAgdmFyIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3Tm9kZS5pZCgpLCBwcm9jZXNzTm9kZS5pZCgpLCB7Y2xhc3MgOiAnY29uc3VtcHRpb24nLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgbmV3RWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdmFyIHlQb3NPZk91dHB1dCA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKChudW1PZk91dHB1dE5vZGVzIC0gMSkgLyAyKSAqIChtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKTtcblxuICAgICAgLy8gYWRkIG91dHB1dCBzaWRlIG5vZGVzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mT3V0cHV0Tm9kZXM7IGkrKykge1xuICAgICAgICBpZihvdXRwdXROb2RlTGlzdFtpXS50eXBlID09IFwiU2ltcGxlIENoZW1pY2FsXCIpe1xuICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZk91dHB1dCwgeVBvc09mT3V0cHV0LCB7Y2xhc3MgOiAnc2ltcGxlIGNoZW1pY2FsJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgICAgeVBvc09mT3V0cHV0ICs9IHNpbXBsZUNoZW1pY2FsSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc09mT3V0cHV0LCB5UG9zT2ZPdXRwdXQsIHtjbGFzcyA6ICdtYWNyb21vbGVjdWxlJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgICAgLy91cGRhdGUgdGhlIHkgcG9zaXRpb25cbiAgICAgICAgICB5UG9zT2ZPdXRwdXQgKz0gbWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcbiAgICAgICAgfVxuICAgICAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgb3V0cHV0Tm9kZUxpc3RbaV0ubmFtZSk7XG5cbiAgICAgICAgdmFyIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzc05vZGUuaWQoKSwgbmV3Tm9kZS5pZCgpLCB7Y2xhc3MgOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICBuZXdFZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBhZGQgY2F0YWx5c3Qgbm9kZVxuICAgICAgdmFyIHhQb3NPZkNhdGFseXN0ID0gcHJvY2Vzc1Bvc2l0aW9uLng7XG4gICAgICB2YXIgeVBvc09mQ2F0YWx5c3QgPSBwcm9jZXNzUG9zaXRpb24ueSAtIChwcm9jZXNzSGVpZ2h0ICsgY2F0YWx5c3RIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpOyBcbiAgICAgIHZhciBjYXRhbHlzdE5vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc09mQ2F0YWx5c3QsIHlQb3NPZkNhdGFseXN0LCB7Y2xhc3M6IGNhdGFseXN0VHlwZSwgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIGNhdGFseXN0Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgIGNhdGFseXN0Tm9kZS5kYXRhKCdsYWJlbCcsIGNhdGFseXN0TmFtZSk7XG5cbiAgICAgIHZhciBjYXRhbHlzdEVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UoY2F0YWx5c3ROb2RlLmlkKCksIHByb2Nlc3NOb2RlLmlkKCksIHtjbGFzczogJ2NhdGFseXNpcycsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBjYXRhbHlzdEVkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIGN5LmVuZEJhdGNoKCk7XG5cbiAgICAgIC8vZmlsdGVyIHRoZSBqdXN0IGFkZGVkIGVsZW1lbXRzIHRvIHJldHVybiB0aGVtIGFuZCByZW1vdmUganVzdCBhZGRlZCBtYXJrXG4gICAgICB2YXIgZWxlcyA9IGN5LmVsZW1lbnRzKCdbanVzdEFkZGVkXScpO1xuICAgICAgZWxlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWQnKTtcblxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgZWxlcy5zZWxlY3QoKTtcblxuICAgICAgcmV0dXJuIGVsZXM7IC8vIFJldHVybiB0aGUganVzdCBhZGRlZCBlbGVtZW50c1xuICAgIH1cblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQWN0aXZhdGlvblJlYWN0aW9uID0gZnVuY3Rpb24gKHByb3RlaW5OYW1lLCBwcm9jZXNzUG9zaXRpb24sIGVkZ2VMZW5ndGgsIHJldmVyc2UpIHtcbiAgICAgIHZhciBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIFwibWFjcm9tb2xlY3VsZVwiICk7XG4gICAgICB2YXIgZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhcImFjdGl2YXRpb25cIik7XG4gICAgICB2YXIgcHJvY2Vzc1dpZHRoID0gZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xuICAgICAgdmFyIG1hY3JvbW9sZWN1bGVXaWR0aCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xuICAgICAgdmFyIHByb2Nlc3NQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbiB8fCBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcbiAgICAgIHZhciBlZGdlTGVuZ3RoID0gZWRnZUxlbmd0aCB8fCA2MDtcblxuICAgICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJQRFwiKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHhQb3NPZklucHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gICAgICB2YXIgeFBvc09mT3V0cHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG5cbiAgICAgIHZhciBwcm9jZXNzTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHtjbGFzczogXCJwcm9jZXNzXCIsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzTm9kZSwgXCJMLXRvLVJcIik7XG4gICAgICBwcm9jZXNzTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgdmFyIHlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55O1xuXG4gICAgICB2YXIgaW5wdXROb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZklucHV0LCB5UG9zaXRpb24sIHtjbGFzczogXCJtYWNyb21vbGVjdWxlXCIsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgIGlucHV0Tm9kZS5kYXRhKFwianVzdEFkZGVkXCIsIHRydWUpO1xuICAgICAgaW5wdXROb2RlLmRhdGEoXCJsYWJlbFwiLCBwcm90ZWluTmFtZSk7XG4gICAgICB2YXIgaW5mb2JveE9iamVjdCA9IHtcbiAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiLFxuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgIHRleHQ6IHJldmVyc2UgPyBcImFjdGl2ZVwiIDogXCJpbmFjdGl2ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgXCJzaGFwZS1uYW1lXCI6IFwiZWxsaXBzZVwiXG4gICAgICAgIH0sXG4gICAgICAgIGJib3g6IHtcbiAgICAgICAgICB3OiAzNixcbiAgICAgICAgICBoOiAxNVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChpbnB1dE5vZGUsIGluZm9ib3hPYmplY3QpO1xuXG4gICAgICB2YXIgb3V0cHV0Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zT2ZPdXRwdXQsIHlQb3NpdGlvbiwge2NsYXNzOiBcIm1hY3JvbW9sZWN1bGVcIiwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgb3V0cHV0Tm9kZS5kYXRhKFwianVzdEFkZGVkXCIsIHRydWUpO1xuICAgICAgb3V0cHV0Tm9kZS5kYXRhKFwibGFiZWxcIiwgcHJvdGVpbk5hbWUpO1xuICAgICAgaW5mb2JveE9iamVjdCA9IHtcbiAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiLFxuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgIHRleHQ6IHJldmVyc2UgPyBcImluYWN0aXZlXCIgOiBcImFjdGl2ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgXCJzaGFwZS1uYW1lXCI6IFwiZWxsaXBzZVwiXG4gICAgICAgIH0sXG4gICAgICAgIGJib3g6IHtcbiAgICAgICAgICB3OiAzNixcbiAgICAgICAgICBoOiAxNVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG91dHB1dE5vZGUsIGluZm9ib3hPYmplY3QpO1xuXG4gICAgICB2YXIgaW5wdXRTaWRlRWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShpbnB1dE5vZGUuaWQoKSwgcHJvY2Vzc05vZGUuaWQoKSwge2NsYXNzOiBcImNvbnN1bXB0aW9uXCIsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgIGlucHV0U2lkZUVkZ2UuZGF0YShcImp1c3RBZGRlZFwiLCB0cnVlKTtcbiAgICAgIHZhciBvdXRwdXRTaWRlRWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzTm9kZS5pZCgpLCBvdXRwdXROb2RlLmlkKCksIHtjbGFzczogXCJwcm9kdWN0aW9uXCIsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgIG91dHB1dFNpZGVFZGdlLmRhdGEoXCJqdXN0QWRkZWRcIiwgdHJ1ZSk7XG4gICAgICBjeS5lbmRCYXRjaCgpO1xuXG4gICAgICAvL2ZpbHRlciB0aGUganVzdCBhZGRlZCBlbGVtZW10cyB0byByZXR1cm4gdGhlbSBhbmQgcmVtb3ZlIGp1c3QgYWRkZWQgbWFya1xuICAgICAgdmFyIGVsZXMgPSBjeS5lbGVtZW50cygnW2p1c3RBZGRlZF0nKTtcbiAgICAgIGVsZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkJyk7XG5cbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICAgIGVsZXMuc2VsZWN0KCk7XG5cbiAgICAgIHJldHVybiBlbGVzOyAvLyBSZXR1cm4gdGhlIGp1c3QgYWRkZWQgZWxlbWVudHNcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxuICAgICAqIGluIHRoZSBjb21wbGV4LiBQYXJhbWV0ZXJzIGFyZSBleHBsYWluZWQgYmVsb3cuXG4gICAgICogdGVtcGxhdGVUeXBlOiBUaGUgdHlwZSBvZiB0aGUgdGVtcGxhdGUgcmVhY3Rpb24uIEl0IG1heSBiZSAnYXNzb2NpYXRpb24nLCAnZGlzc29jaWF0aW9uJywgJ3JldmVyc2libGUnIG9yICdpcnJldmVyc2libGUnLlxuICAgICAqIG5vZGVMaXN0OiBUaGUgbGlzdCBvZiB0aGUgbmFtZXMgYW5kIHR5cGVzIG9mIG1vbGVjdWxlcyB3aGljaCB3aWxsIGludm9sdmUgaW4gdGhlIHJlYWN0aW9uLlxuICAgICAqIGNvbXBsZXhOYW1lOiBUaGUgbmFtZSBvZiB0aGUgY29tcGxleCBpbiB0aGUgcmVhY3Rpb24uXG4gICAgICogcHJvY2Vzc1Bvc2l0aW9uOiBUaGUgbW9kYWwgcG9zaXRpb24gb2YgdGhlIHByb2Nlc3MgaW4gdGhlIHJlYWN0aW9uLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyB0aGUgY2VudGVyIG9mIHRoZSBjYW52YXMuXG4gICAgICogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxuICAgICAqIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxuICAgICAqIGVkZ2VMZW5ndGg6IFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgbWFjcm9tb2xlY3VsZXMgYXQgdGhlIGJvdGggc2lkZXMuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHRlbXBsYXRlVHlwZSwgbm9kZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgsIGxheW91dFBhcmFtKSB7XG5cbiAgICAgIHZhciBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIFwibWFjcm9tb2xlY3VsZVwiICk7XG4gICAgICB2YXIgZGVmYXVsdFNpbXBsZUNoZW1pY2FsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIFwic2ltcGxlIGNoZW1pY2FsXCIgKTtcbiAgICAgIHZhciBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCB0ZW1wbGF0ZVR5cGUgKTtcbiAgICAgIHZhciBwcm9jZXNzV2lkdGggPSBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICB2YXIgbWFjcm9tb2xlY3VsZVdpZHRoID0gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICB2YXIgbWFjcm9tb2xlY3VsZUhlaWdodCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLmhlaWdodCB8fCA1MDtcbiAgICAgIHZhciBzaW1wbGVDaGVtaWNhbFdpZHRoID0gZGVmYXVsdFNpbXBsZUNoZW1pY2FsUHJvcGVydGllcy53aWR0aCB8fCAzNTtcbiAgICAgIHZhciBzaW1wbGVDaGVtaWNhbEhlaWdodCA9IGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMuaGVpZ2h0IHx8IDM1O1xuICAgICAgdmFyIHByb2Nlc3NQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbiB8fCBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcbiAgICAgIHZhciBub2RlTGlzdCA9IG5vZGVMaXN0O1xuICAgICAgdmFyIGNvbXBsZXhOYW1lID0gY29tcGxleE5hbWU7XG4gICAgICB2YXIgbnVtT2ZNb2xlY3VsZXMgPSBub2RlTGlzdC5sZW5ndGg7XG4gICAgICB2YXIgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsID0gdGlsaW5nUGFkZGluZ1ZlcnRpY2FsIHx8IDE1O1xuICAgICAgdmFyIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgfHwgMTU7XG4gICAgICB2YXIgZWRnZUxlbmd0aCA9IGVkZ2VMZW5ndGggfHwgNjA7XG5cbiAgICAgIGN5LnN0YXJ0QmF0Y2goKTtcblxuICAgICAgXG4gICAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShcIlBEXCIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXM7XG4gICAgICB2YXIgeFBvc2l0aW9uT2ZJbnB1dE1hY3JvbW9sZWN1bGVzO1xuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICAgICAgIFxuICAgICAgfVxuICAgICAgZWxzZSBpZih0ZW1wbGF0ZVR5cGUgPT09ICdkaXNzb2NpYXRpb24nKXtcbiAgICAgICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgICAgICBcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIFxuICAgICAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICAgICAgICB4UG9zaXRpb25PZklucHV0TWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgICAgIH1cblxuICAgICAgLy9DcmVhdGUgdGhlIHByb2Nlc3MgaW4gdGVtcGxhdGUgdHlwZVxuICAgICAgdmFyIHByb2Nlc3M7XG4gICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAncmV2ZXJzaWJsZScgfHwgdGVtcGxhdGVUeXBlID09PSAnaXJyZXZlcnNpYmxlJykge1xuICAgICAgICBwcm9jZXNzID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwge2NsYXNzIDogJ3Byb2Nlc3MnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdMLXRvLVInKTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB7Y2xhc3MgOiB0ZW1wbGF0ZVR5cGUsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ0wtdG8tUicpO1xuICAgICAgfVxuICAgICAgcHJvY2Vzcy5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgLy9EZWZpbmUgdGhlIHN0YXJ0aW5nIHkgcG9zaXRpb25cbiAgICAgIHZhciB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZNb2xlY3VsZXMgLSAxKSAvIDIpICogKG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpO1xuXG4gICAgICAvL0NyZWF0ZSB0aGUgZnJlZSBtb2xlY3VsZXNcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZNb2xlY3VsZXM7IGkrKykge1xuICAgICAgICAvLyBub2RlIGFkZGl0aW9uIG9wZXJhdGlvbiBpcyBkZXRlcm1pbmVkIGJ5IG1vbGVjdWxlIHR5cGVcbiAgICAgICAgaWYobm9kZUxpc3RbaV0udHlwZSA9PSBcIlNpbXBsZSBDaGVtaWNhbFwiKXtcbiAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcywgeVBvc2l0aW9uLCB7Y2xhc3MgOiAnc2ltcGxlIGNoZW1pY2FsJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgICAgLy91cGRhdGUgdGhlIHkgcG9zaXRpb25cbiAgICAgICAgICB5UG9zaXRpb24gKz0gc2ltcGxlQ2hlbWljYWxIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcywgeVBvc2l0aW9uLCB7Y2xhc3MgOiAnbWFjcm9tb2xlY3VsZScsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICAgIC8vdXBkYXRlIHRoZSB5IHBvc2l0aW9uXG4gICAgICAgICAgeVBvc2l0aW9uICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gICAgICAgIH1cbiAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIG5vZGVMaXN0W2ldLm5hbWUpO1xuXG4gICAgICAgIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5lY3RlZCB0byB0aGUgbmV3IG1vbGVjdWxlXG4gICAgICAgIHZhciBuZXdFZGdlO1xuICAgICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdOb2RlLmlkKCksIHByb2Nlc3MuaWQoKSwge2NsYXNzIDogJ2NvbnN1bXB0aW9uJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0ZW1wbGF0ZVR5cGUgPT09ICdkaXNzb2NpYXRpb24nKXtcbiAgICAgICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgbmV3Tm9kZS5pZCgpLCB7Y2xhc3MgOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgLy9Hcm91cCByaWdodCBvciB0b3AgZWxlbWVudHMgaW4gZ3JvdXAgaWQgMVxuICAgICAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09IFwiaXJyZXZlcnNpYmxlXCIpIHtcbiAgICAgICAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3Tm9kZS5pZCgpLCBwcm9jZXNzLmlkKCksIHtjbGFzczogXCJjb25zdW1wdGlvblwiLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBuZXdOb2RlLmlkKCksIHtjbGFzcyA6IFwicHJvZHVjdGlvblwiLCBsYW5ndWFnZSA6ICdQRCd9LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV3RWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgaWYodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nIHx8IHRlbXBsYXRlVHlwZSA9PSAnZGlzc29jaWF0aW9uJyl7XG4gICAgICAgIC8vQ3JlYXRlIHRoZSBjb21wbGV4IGluY2x1ZGluZyBtYWNyb21vbGVjdWxlcyBpbnNpZGUgb2YgaXRcbiAgICAgICAgLy9UZW1wcm9yYXJpbHkgYWRkIGl0IHRvIHRoZSBwcm9jZXNzIHBvc2l0aW9uIHdlIHdpbGwgbW92ZSBpdCBhY2NvcmRpbmcgdG8gdGhlIGxhc3Qgc2l6ZSBvZiBpdFxuICAgICAgICB2YXIgY29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHtjbGFzcyA6ICdjb21wbGV4JywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgIGNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICAgIGNvbXBsZXguZGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScsIHRydWUpO1xuXG4gICAgICAgIC8vSWYgYSBuYW1lIGlzIHNwZWNpZmllZCBmb3IgdGhlIGNvbXBsZXggc2V0IGl0cyBsYWJlbCBhY2NvcmRpbmdseVxuICAgICAgICBpZiAoY29tcGxleE5hbWUpIHtcbiAgICAgICAgICBjb21wbGV4LmRhdGEoJ2xhYmVsJywgY29tcGxleE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubm5lY3RlZCB0byB0aGUgY29tcGxleFxuICAgICAgICB2YXIgZWRnZU9mQ29tcGxleDtcblxuICAgICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgICAgICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIGNvbXBsZXguaWQoKSwge2NsYXNzIDogJ3Byb2R1Y3Rpb24nLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBlZGdlT2ZDb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKGNvbXBsZXguaWQoKSwgcHJvY2Vzcy5pZCgpLCB7Y2xhc3MgOiAnY29uc3VtcHRpb24nLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVkZ2VPZkNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1vbGVjdWxlczsgaSsrKSB7XG5cbiAgICAgICAgICAvLyBBZGQgYSBtb2xlY3VsZShkZXBlbmRlbnQgb24gaXQncyB0eXBlKSBub3QgaGF2aW5nIGEgcHJldmlvdXNseSBkZWZpbmVkIGlkIGFuZCBoYXZpbmcgdGhlIGNvbXBsZXggY3JlYXRlZCBpbiB0aGlzIHJlYWN0aW9uIGFzIHBhcmVudFxuICAgICAgICAgIGlmKG5vZGVMaXN0W2ldLnR5cGUgPT0gJ1NpbXBsZSBDaGVtaWNhbCcpe1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoY29tcGxleC5wb3NpdGlvbigneCcpLCBjb21wbGV4LnBvc2l0aW9uKCd5JyksIHtjbGFzcyA6ICdzaW1wbGUgY2hlbWljYWwnLCBsYW5ndWFnZSA6ICdQRCd9LCB1bmRlZmluZWQsIGNvbXBsZXguaWQoKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShjb21wbGV4LnBvc2l0aW9uKCd4JyksIGNvbXBsZXgucG9zaXRpb24oJ3knKSwge2NsYXNzIDogJ21hY3JvbW9sZWN1bGUnLCBsYW5ndWFnZSA6ICdQRCd9LCB1bmRlZmluZWQsIGNvbXBsZXguaWQoKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgICAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbm9kZUxpc3RbaV0ubmFtZSk7XG4gICAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2V7XG5cbiAgICAgICAgLy9DcmVhdGUgdGhlIGlucHV0IG1hY3JvbW9sZWN1bGVzXG4gICAgICAgIHZhciBudW1PZklucHV0TWFjcm9tb2xlY3VsZXMgPSBjb21wbGV4TmFtZS5sZW5ndGg7XG4gICAgICAgIHlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKChudW1PZklucHV0TWFjcm9tb2xlY3VsZXMgLSAxKSAvIDIpICogKG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZJbnB1dE1hY3JvbW9sZWN1bGVzOyBpKyspIHtcblxuICAgICAgICAgIGlmKGNvbXBsZXhOYW1lW2ldLnR5cGUgPT0gJ1NpbXBsZSBDaGVtaWNhbCcpe1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc2l0aW9uT2ZJbnB1dE1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIHtjbGFzcyA6ICdzaW1wbGUgY2hlbWljYWwnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgICAgIHlQb3NpdGlvbiArPSBzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NpdGlvbk9mSW5wdXRNYWNyb21vbGVjdWxlcywgeVBvc2l0aW9uLCB7Y2xhc3MgOiAnbWFjcm9tb2xlY3VsZScsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICAgICAgeVBvc2l0aW9uICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgICAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgY29tcGxleE5hbWVbaV0ubmFtZSk7XG5cbiAgICAgICAgICAvL2NyZWF0ZSB0aGUgZWRnZSBjb25uZWN0ZWQgdG8gdGhlIG5ldyBtYWNyb21vbGVjdWxlXG4gICAgICAgICAgdmFyIG5ld0VkZ2U7XG5cbiAgICAgICAgICAvL0dyb3VwIHRoZSBsZWZ0IG9yIGJvdHRvbSBlbGVtZW50cyBpbiBncm91cCBpZCAwIGlmIHJldmVyc2libGVcbiAgICAgICAgICBpZiAodGVtcGxhdGVUeXBlID09PSBcImlycmV2ZXJzaWJsZVwiKSB7XG4gICAgICAgICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgbmV3Tm9kZS5pZCgpLCB7Y2xhc3M6IFwicHJvZHVjdGlvblwiLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBuZXdOb2RlLmlkKCksIHtjbGFzcyA6IFwicHJvZHVjdGlvblwiLCBsYW5ndWFnZSA6ICdQRCd9LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgMCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5ld0VkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjeS5lbmRCYXRjaCgpO1xuXG4gICAgICB2YXIgbGF5b3V0Tm9kZXMgPSBjeS5ub2RlcygnW2p1c3RBZGRlZExheW91dE5vZGVdJyk7XG4gICAgICBsYXlvdXROb2Rlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJyk7XG4gICAgICB2YXIgbGF5b3V0ID0gbGF5b3V0Tm9kZXMubGF5b3V0KHtcbiAgICAgICAgbmFtZTogbGF5b3V0UGFyYW0ubmFtZSxcbiAgICAgICAgcmFuZG9taXplOiBmYWxzZSxcbiAgICAgICAgZml0OiBmYWxzZSxcbiAgICAgICAgYW5pbWF0ZTogZmFsc2UsXG4gICAgICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLFxuICAgICAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXG4gICAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvL0lmIGl0IGlzIGEgcmV2ZXJzaWJsZSByZWFjdGlvbiBubyBuZWVkIHRvIHJlLXBvc2l0aW9uIGNvbXBsZXhlc1xuICAgICAgICAgIGlmKHRlbXBsYXRlVHlwZSA9PT0gJ3JldmVyc2libGUnKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIC8vcmUtcG9zaXRpb24gdGhlIG5vZGVzIGluc2lkZSB0aGUgY29tcGxleFxuICAgICAgICAgIHZhciBzdXBwb3NlZFhQb3NpdGlvbjtcbiAgICAgICAgICB2YXIgc3VwcG9zZWRZUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueTtcblxuICAgICAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHBvc2l0aW9uRGlmZlggPSAoc3VwcG9zZWRYUG9zaXRpb24gLSBjb21wbGV4LnBvc2l0aW9uKCd4JykpIC8gMjtcbiAgICAgICAgICB2YXIgcG9zaXRpb25EaWZmWSA9IChzdXBwb3NlZFlQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3knKSkgLyAyO1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NpdGlvbkRpZmZYLCB5OiBwb3NpdGlvbkRpZmZZfSwgY29tcGxleCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBEbyB0aGlzIGNoZWNrIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuICYmIHRlbXBsYXRlVHlwZSAhPT0gJ3JldmVyc2libGUnICYmIHRlbXBsYXRlVHlwZSAhPT0gJ2lycmV2ZXJzaWJsZScpIHtcbiAgICAgICAgbGF5b3V0LnJ1bigpO1xuICAgICAgfVxuXG4gICAgICAvL2ZpbHRlciB0aGUganVzdCBhZGRlZCBlbGVtZW10cyB0byByZXR1cm4gdGhlbSBhbmQgcmVtb3ZlIGp1c3QgYWRkZWQgbWFya1xuICAgICAgdmFyIGVsZXMgPSBjeS5lbGVtZW50cygnW2p1c3RBZGRlZF0nKTtcbiAgICAgIGVsZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkJyk7XG5cbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICAgIGVsZXMuc2VsZWN0KCk7XG5cbiAgICAgIHJldHVybiBlbGVzOyAvLyBSZXR1cm4gdGhlIGp1c3QgYWRkZWQgZWxlbWVudHNcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBNb3ZlIHRoZSBub2RlcyB0byBhIG5ldyBwYXJlbnQgYW5kIGNoYW5nZSB0aGVpciBwb3NpdGlvbiBpZiBwb3NzRGlmZiBwYXJhbXMgYXJlIHNldC5cbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudCA9IGZ1bmN0aW9uKG5vZGVzLCBuZXdQYXJlbnQsIHBvc0RpZmZYLCBwb3NEaWZmWSkge1xuICAgICAgdmFyIG5ld1BhcmVudElkID0gbmV3UGFyZW50ID09IHVuZGVmaW5lZCB8fCB0eXBlb2YgbmV3UGFyZW50ID09PSAnc3RyaW5nJyA/IG5ld1BhcmVudCA6IG5ld1BhcmVudC5pZCgpO1xuICAgICAgdmFyIG1vdmVkRWxlcyA9IG5vZGVzLm1vdmUoe1wicGFyZW50XCI6IG5ld1BhcmVudElkfSk7XG4gICAgICBpZih0eXBlb2YgcG9zRGlmZlggIT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHBvc0RpZmZZICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NEaWZmWCwgeTogcG9zRGlmZll9LCBub2Rlcyk7XG4gICAgICB9XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlcihtb3ZlZEVsZXMpO1xuICAgICAgcmV0dXJuIG1vdmVkRWxlcztcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVJbmZvYm94U3R5bGUgPSBmdW5jdGlvbiggbm9kZSwgaW5kZXgsIG5ld1Byb3BzICkge1xuICAgICAgdmFyIGluZm9ib3hPYmogPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJylbaW5kZXhdO1xuICAgICAgJC5leHRlbmQoIGluZm9ib3hPYmouc3R5bGUsIG5ld1Byb3BzICk7XG4gICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hPYmogPSBmdW5jdGlvbiggbm9kZSwgaW5kZXgsIG5ld1Byb3BzICkge1xuICAgICAgdmFyIGluZm9ib3hPYmogPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJylbaW5kZXhdO1xuICAgICAgJC5leHRlbmQoIGluZm9ib3hPYmosIG5ld1Byb3BzICk7XG4gICAgfTtcblxuICAgIC8vIFJlc2l6ZSBnaXZlbiBub2RlcyBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHkgb25lIG9mIHdpZHRoIG9yIGhlaWdodCBzaG91bGQgbm90IGJlIHNldC5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbywgcHJlc2VydmVSZWxhdGl2ZVBvcykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHZhciByYXRpbyA9IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGVsZU11c3RCZVNxdWFyZSA9IGVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSk7XG5cbiAgICAgICAgaWYgKHByZXNlcnZlUmVsYXRpdmVQb3MgPT09IHRydWUpIHtcbiAgICAgICAgICB2YXIgb2xkV2lkdGggPSBub2RlLmRhdGEoXCJiYm94XCIpLnc7XG4gICAgICAgICAgdmFyIG9sZEhlaWdodCA9IG5vZGUuZGF0YShcImJib3hcIikuaDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdGUgdGhhdCBib3RoIHdpZHRoIGFuZCBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5XG4gICAgICAgIGlmKCFub2RlLmlzUGFyZW50KCkpe1xuICAgICAgICAgIGlmICh3aWR0aCkge1xuICAgICAgICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xuICAgICAgICAgICAgICByYXRpbyA9IHdpZHRoIC8gbm9kZS53aWR0aCgpO1xuICAgICAgICAgICAgfVxuICBcbiAgICAgICAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IHdpZHRoO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgaWYgKGhlaWdodCkge1xuICAgICAgICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xuICAgICAgICAgICAgICByYXRpbyA9IGhlaWdodCAvIG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgICAgICB9XG4gIFxuICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gaGVpZ2h0O1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgaWYgKHJhdGlvICYmICFoZWlnaHQpIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IG5vZGUuaGVpZ2h0KCkgKiByYXRpbztcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAocmF0aW8gJiYgIXdpZHRoKSB7XG4gICAgICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSBub2RlLndpZHRoKCkgKiByYXRpbztcbiAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIG5vZGUuZGF0YShcIm1pbkhlaWdodFwiICwgXCJcIisgaGVpZ2h0KTtcbiAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aFwiICwgXCJcIisgd2lkdGgpO1xuICAgICAgICAgIG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc0xlZnRcIiwgXCI1MCVcIik7XG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluV2lkdGhCaWFzUmlnaHRcIiwgXCI1MCVcIik7XG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc1RvcFwiLCBcIjUwJVwiICk7XG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc0JvdHRvbVwiLCBcIjUwJVwiKTtcbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAvKiAgICBpZiAocHJlc2VydmVSZWxhdGl2ZVBvcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBzdGF0ZXNhbmRpbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcbiAgICAgICAgICB2YXIgdG9wQm90dG9tID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiAoYm94LmFuY2hvclNpZGUgPT09IFwidG9wXCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwiYm90dG9tXCIpKTtcbiAgICAgICAgICB2YXIgcmlnaHRMZWZ0ID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiAoYm94LmFuY2hvclNpZGUgPT09IFwicmlnaHRcIiB8fCBib3guYW5jaG9yU2lkZSA9PT0gXCJsZWZ0XCIpKTtcblxuICAgICAgICAgIHRvcEJvdHRvbS5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XG4gICAgICAgICAgICBpZiAoYm94LmJib3gueCA8IDApIHtcbiAgICAgICAgICAgICAgYm94LmJib3gueCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChib3guYmJveC54ID4gb2xkV2lkdGgpIHtcbiAgICAgICAgICAgICAgYm94LmJib3gueCA9IG9sZFdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYm94LmJib3gueCA9IG5vZGUuZGF0YShcImJib3hcIikudyAqIGJveC5iYm94LnggLyBvbGRXaWR0aDtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJpZ2h0TGVmdC5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XG4gICAgICAgICAgICBpZiAoYm94LmJib3gueSA8IDApIHtcbiAgICAgICAgICAgICAgYm94LmJib3gueSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChib3guYmJveC55ID4gb2xkSGVpZ2h0KSB7XG4gICAgICAgICAgICAgIGJveC5iYm94LnkgPSBvbGRIZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBib3guYmJveC55ID0gbm9kZS5kYXRhKFwiYmJveFwiKS5oICogYm94LmJib3gueSAvIG9sZEhlaWdodDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSAqL1xuICAgICAgfVxuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbldpZHRoID0gZnVuY3Rpb24obm9kZSkge1xuXG4gICAgICAgIHZhciBkZWZhdWx0V2lkdGggPSB0aGlzLmdldERlZmF1bHRQcm9wZXJ0aWVzKG5vZGUuZGF0YSgnY2xhc3MnKSkud2lkdGg7XG5cbiAgICAgICAgLy8gTGFiZWwgd2lkdGggY2FsY3VsYXRpb25cbiAgICAgICAgdmFyIHN0eWxlID0gbm9kZS5zdHlsZSgpO1xuXG4gICAgICAgIHZhciBmb250RmFtaWxpeSA9IHN0eWxlWydmb250LWZhbWlseSddO1xuICAgICAgICB2YXIgZm9udFNpemUgPSBzdHlsZVsnZm9udC1zaXplJ107XG4gICAgICAgIHZhciBsYWJlbFRleHQgPSBzdHlsZVsnbGFiZWwnXTtcblxuICAgICAgICBpZiAobGFiZWxUZXh0ID09PSBcIlwiICYmIG5vZGUuZGF0YSgnbGFiZWwnKSAmJiBub2RlLmRhdGEoJ2xhYmVsJykgIT09IFwiXCIpIHtcbiAgICAgICAgICBsYWJlbFRleHQgPSBub2RlLmRhdGEoJ2xhYmVsJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGFiZWxXaWR0aCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0V2lkdGhCeUNvbnRlbnQoIGxhYmVsVGV4dCwgZm9udEZhbWlsaXksIGZvbnRTaXplICk7XG5cbiAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgICAgICAvL1RvcCBhbmQgYm90dG9tIGluZm9Cb3hlc1xuICAgICAgICAvL3ZhciB0b3BJbmZvQm94ZXMgPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IChib3guYW5jaG9yU2lkZSA9PT0gXCJ0b3BcIiB8fCAoKGJveC5hbmNob3JTaWRlID09PSBcInJpZ2h0XCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwibGVmdFwiKSAmJiAoYm94LmJib3gueSA8PSAxMikpKSk7XG4gICAgICAgIC8vdmFyIGJvdHRvbUluZm9Cb3hlcyA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gKGJveC5hbmNob3JTaWRlID09PSBcImJvdHRvbVwiIHx8ICgoYm94LmFuY2hvclNpZGUgPT09IFwicmlnaHRcIiB8fCBib3guYW5jaG9yU2lkZSA9PT0gXCJsZWZ0XCIpICYmIChib3guYmJveC55ID49IG5vZGUuZGF0YSgnYmJveCcpLmggLSAxMikpKSk7XG4gICAgICAgIHZhciB1bml0R2FwID0gNTtcbiAgICAgICAgdmFyIHRvcElkZWFsV2lkdGggPSB1bml0R2FwO1xuICAgICAgICB2YXIgYm90dG9tSWRlYWxXaWR0aCA9IHVuaXRHYXA7ICAgICAgICBcbiAgICAgICAgdmFyIHJpZ2h0TWF4V2lkdGggPSAwO1xuICAgICAgICB2YXIgbGVmdE1heFdpZHRoID0wO1xuICAgICAgICBzdGF0ZXNhbmRpbmZvcy5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XG4gICAgICAgICAgaWYoYm94LmFuY2hvclNpZGUgPT09IFwidG9wXCIpe1xuICAgICAgICAgICAgdG9wSWRlYWxXaWR0aCArPSBib3guYmJveC53ICsgdW5pdEdhcDtcblxuICAgICAgICAgIH1lbHNlIGlmKGJveC5hbmNob3JTaWRlID09PSBcImJvdHRvbVwiKXtcbiAgICAgICAgICAgIGJvdHRvbUlkZWFsV2lkdGggKz0gYm94LmJib3gudyArIHVuaXRHYXA7XG5cbiAgICAgICAgICB9ZWxzZSBpZihib3guYW5jaG9yU2lkZSA9PT0gXCJyaWdodFwiKVxuICAgICAgICAgIHsgICAgICAgICAgIFxuICAgICAgICAgICAgcmlnaHRNYXhXaWR0aCA9IChib3guYmJveC53ID4gcmlnaHRNYXhXaWR0aCkgPyBib3guYmJveC53IDogcmlnaHRNYXhXaWR0aDtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGVmdE1heFdpZHRoID0gKGJveC5iYm94LncgPiBsZWZ0TWF4V2lkdGgpID8gYm94LmJib3gudyA6IGxlZnRNYXhXaWR0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pOyAgICAgIFxuXG4gICAgICAgIHZhciBtaWRkbGVXaWR0aCA9IGxhYmVsV2lkdGggKyAyICogTWF0aC5tYXgocmlnaHRNYXhXaWR0aC8yLCBsZWZ0TWF4V2lkdGgvMik7XG5cbiAgICAgICAgdmFyIGNvbXBvdW5kV2lkdGggPSAwO1xuICAgICAgICBpZihub2RlLmlzUGFyZW50KCkpe1xuICAgICAgICAgIGNvbXBvdW5kV2lkdGggPSBub2RlLmNoaWxkcmVuKCkuYm91bmRpbmdCb3goKS53O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLm1heChtaWRkbGVXaWR0aCwgZGVmYXVsdFdpZHRoLzIsIHRvcElkZWFsV2lkdGgsIGJvdHRvbUlkZWFsV2lkdGgsIGNvbXBvdW5kV2lkdGgpO1xuICAgIH1cblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluSGVpZ2h0ID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICB2YXIgc3RhdGVzYW5kaW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgICAgIHZhciBtYXJnaW4gPSA3O1xuICAgICAgICB2YXIgdW5pdEdhcCA9IDU7XG4gICAgICAgIHZhciBkZWZhdWx0SGVpZ2h0ID0gdGhpcy5nZXREZWZhdWx0UHJvcGVydGllcyhub2RlLmRhdGEoJ2NsYXNzJykpLmhlaWdodDtcbiAgICAgICAgdmFyIGxlZnRJbmZvQm94ZXMgPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IGJveC5hbmNob3JTaWRlID09PSBcImxlZnRcIik7ICAgICAgICBcbiAgICAgICAgdmFyIGxlZnRIZWlnaHQgPSB1bml0R2FwOyBcbiAgICAgICAgbGVmdEluZm9Cb3hlcy5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XG4gICAgICAgICAgICBsZWZ0SGVpZ2h0ICs9IGJveC5iYm94LmggKyB1bml0R2FwO1xuICAgICAgICAgICBcbiAgICAgICAgfSk7ICAgICAgXG4gICAgICAgIHZhciByaWdodEluZm9Cb3hlcyA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gYm94LmFuY2hvclNpZGUgPT09IFwicmlnaHRcIik7XG4gICAgICAgIHZhciByaWdodEhlaWdodCA9IHVuaXRHYXA7ICAgICAgICBcbiAgICAgICAgcmlnaHRJbmZvQm94ZXMuZm9yRWFjaChmdW5jdGlvbihib3gpe1xuICAgICAgICAgICAgcmlnaHRIZWlnaHQgKz0gYm94LmJib3guaCArIHVuaXRHYXA7ICAgICAgICAgICBcbiAgICAgICAgfSk7ICAgICAgIFxuICAgICAgICB2YXIgc3R5bGUgPSBub2RlLnN0eWxlKCk7XG4gICAgICAgIHZhciBsYWJlbFRleHQgPSAoKHN0eWxlWydsYWJlbCddKS5zcGxpdChcIlxcblwiKSkuZmlsdGVyKCB0ZXh0ID0+IHRleHQgIT09ICcnKTtcbiAgICAgICAgdmFyIGZvbnRTaXplID0gcGFyc2VGbG9hdChzdHlsZVsnZm9udC1zaXplJ10uc3Vic3RyaW5nKDAsIHN0eWxlWydmb250LXNpemUnXS5sZW5ndGggLSAyKSk7XG4gICAgICAgIHZhciB0b3RhbEhlaWdodCA9IGxhYmVsVGV4dC5sZW5ndGggKiBmb250U2l6ZSArIDIgKiBtYXJnaW47XG5cbiAgICAgICAgXG5cbiAgICAgICAgdmFyIGNvbXBvdW5kSGVpZ2h0ID0gMDtcbiAgICAgICAgaWYobm9kZS5pc1BhcmVudCgpKXtcbiAgICAgICAgICBjb21wb3VuZEhlaWdodCA9IG5vZGUuY2hpbGRyZW4oKS5ib3VuZGluZ0JveCgpLmg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRvdGFsSGVpZ2h0LCBkZWZhdWx0SGVpZ2h0LzIsIGxlZnRIZWlnaHQsIHJpZ2h0SGVpZ2h0LCBjb21wb3VuZEhlaWdodCk7XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5pc1Jlc2l6ZWRUb0NvbnRlbnQgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgaWYoIW5vZGUgfHwgIW5vZGUuaXNOb2RlKCkgfHwgIW5vZGUuZGF0YSgnYmJveCcpKXtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvL3ZhciB3ID0gbm9kZS5kYXRhKCdiYm94JykudztcbiAgICAgIC8vdmFyIGggPSBub2RlLmRhdGEoJ2Jib3gnKS5oO1xuICAgICAgdmFyIHcgPSBub2RlLndpZHRoKCk7XG4gICAgICB2YXIgaCA9IG5vZGUuaGVpZ2h0KCk7XG5cbiAgICAgIHZhciBtaW5XID0gZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5XaWR0aChub2RlKTtcbiAgICAgIHZhciBtaW5IID0gZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5IZWlnaHQobm9kZSk7XG5cbiAgICAgIGlmKHcgPT09IG1pblcgJiYgaCA9PT0gbWluSClcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBTZWN0aW9uIEVuZFxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXG5cbiAgICAvLyBSZWxvY2F0ZXMgc3RhdGUgYW5kIGluZm8gYm94ZXMuIFRoaXMgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkIGFmdGVyIGFkZC9yZW1vdmUgc3RhdGUgYW5kIGluZm8gYm94ZXNcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gKGVsZS5pc05vZGUgJiYgZWxlLmlzTm9kZSgpKSA/IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpIDogZWxlO1xuICAgICAgdmFyIGxlbmd0aCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGxlbmd0aCA9PSAxKSB7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gMDtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChsZW5ndGggPT0gMikge1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMDtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSA1MDtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGxlbmd0aCA9PSAzKSB7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcblxuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDI1O1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcblxuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IDA7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC55ID0gNTA7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAtMjU7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gLTUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gLTI1O1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC54ID0gMjU7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC55ID0gNTA7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxuICAgIC8vIFR5cGUgcGFyYW1ldGVyIGluZGljYXRlcyB3aGV0aGVyIHRvIGNoYW5nZSB2YWx1ZSBvciB2YXJpYWJsZSwgaXQgaXMgdmFsaWQgaWYgdGhlIGJveCBhdCB0aGUgZ2l2ZW4gaW5kZXggaXMgYSBzdGF0ZSB2YXJpYWJsZS5cbiAgICAvLyBWYWx1ZSBwYXJhbWV0ZXIgaXMgdGhlIG5ldyB2YWx1ZSB0byBzZXQuXG4gICAgLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgKFdlIGFzc3VtZSB0aGF0IHRoZSBvbGQgdmFsdWUgb2YgdGhlIGNoYW5nZWQgZGF0YSB3YXMgdGhlIHNhbWUgZm9yIGFsbCBub2RlcykuXG4gICAgLy8gRWFjaCBjaGFyYWN0ZXIgYXNzdW1lZCB0byBvY2N1cHkgOCB1bml0XG4gICAgLy8gRWFjaCBpbmZvYm94IGNhbiBoYXZlIGF0IG1vc3QgMzIgdW5pdHMgb2Ygd2lkdGhcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHZhciBzYmduY2xhc3MgPSBub2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgICAgICB2YXIgYm94ID0gc3RhdGVBbmRJbmZvc1tpbmRleF07XG4gICAgICAgIHZhciBvbGRMZW5ndGggPSBib3guYmJveC53O1xuICAgICAgICB2YXIgbmV3TGVuZ3RoID0gMDtcblxuICAgICAgICB2YXIgY29udGVudCA9ICcnO1xuICAgICAgICBpZiAoYm94LmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xuICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICByZXN1bHQgPSBib3guc3RhdGVbdHlwZV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYm94LnN0YXRlW3R5cGVdID0gdmFsdWU7XG4gICAgICAgICAgaWYgKGJveC5zdGF0ZVtcInZhbHVlXCJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gYm94LnN0YXRlW1widmFsdWVcIl07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChib3guc3RhdGVbXCJ2YXJpYWJsZVwiXSAhPT0gdW5kZWZpbmVkICYmIGJveC5zdGF0ZVtcInZhcmlhYmxlXCJdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gYm94LnN0YXRlW1widmFyaWFibGVcIl0gKyBcIkBcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChib3guY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcbiAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gYm94LmxhYmVsLnRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRlbnQgKz0gdmFsdWU7XG4gICAgICAgICAgYm94LmxhYmVsLnRleHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtaW4gPSAoIHNiZ25jbGFzcyA9PT0gJ1NJRiBtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT09ICdTSUYgc2ltcGxlIGNoZW1pY2FsJyApID8gMTUgOiAxMjtcbiAgICAgICAgdmFyIGZvbnRGYW1pbHkgPSBib3guc3R5bGVbICdmb250LWZhbWlseScgXTtcbiAgICAgICAgdmFyIGZvbnRTaXplID0gYm94LnN0eWxlWyAnZm9udC1zaXplJyBdO1xuICAgICAgICB2YXIgYm9yZGVyV2lkdGggPSBib3guc3R5bGVbICdib3JkZXItd2lkdGgnIF07XG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgIG1pbixcbiAgICAgICAgICBtYXg6IDQ4LFxuICAgICAgICAgIG1hcmdpbjogYm9yZGVyV2lkdGggLyAyICsgMC41XG4gICAgICAgIH07XG4gICAgICAgIHZhciBwcmV2aW91c1dpZHRoID0gYm94LmJib3gudztcbiAgICAgICAgYm94LmJib3gudyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0V2lkdGhCeUNvbnRlbnQoIGNvbnRlbnQsIGZvbnRGYW1pbHksIGZvbnRTaXplLCBvcHRzICk7XG5cbiAgICAgICAgaWYoYm94LmFuY2hvclNpZGUgPT0gXCJ0b3BcIiB8fCBib3guYW5jaG9yU2lkZSA9PSBcImJvdHRvbVwiKXtcbiAgICAgICAgICB2YXIgdW5pdExheW91dCA9IG5vZGUuZGF0YSgpW1wiYXV4dW5pdGxheW91dHNcIl1bYm94LmFuY2hvclNpZGVdO1xuICAgICAgICAgIGlmKHVuaXRMYXlvdXQudW5pdHNbdW5pdExheW91dC51bml0cy5sZW5ndGgtMV0uaWQgPT0gYm94LmlkKXtcbiAgICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBib3JkZXJXaWR0aCA9IG5vZGUuZGF0YSgpWydib3JkZXItd2lkdGgnXTtcbiAgICAgICAgICAgIHZhciBzaGlmdEFtb3VudCA9ICgoKGJveC5iYm94LncgLSBwcmV2aW91c1dpZHRoKSAvIDIpICogMTAwICkvIChub2RlLm91dGVyV2lkdGgoKSAtIGJvcmRlcldpZHRoKTtcbiAgICAgICAgICAgXG4gICAgICAgICAgICBpZihzaGlmdEFtb3VudCA+PSAwKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICBpZihib3guYmJveC54ICsgc2hpZnRBbW91bnQgPD0gMTAwKXtcbiAgICAgICAgICAgICAgICBib3guYmJveC54ID0gYm94LmJib3gueCArIHNoaWZ0QW1vdW50O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgIC8qICBlbHNle1xuICAgICAgICAgICAgICB2YXIgcHJldmlvdXNJbmZvQmJveCA9IHt4IDogMCwgdzowfTtcbiAgICAgICAgICAgICAgaWYodW5pdExheW91dC51bml0cy5sZW5ndGggPiAxKXtcbiAgICAgICAgICAgICAgICBwcmV2aW91c0luZm9CYm94PSB1bml0TGF5b3V0LnVuaXRzW3VuaXRMYXlvdXQudW5pdHMubGVuZ3RoLTJdLmJib3g7ICAgICAgXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIHNiZ252aXpJbnN0YW5jZS5jbGFzc2VzLkF1eFVuaXRMYXlvdXQuc2V0SWRlYWxHYXAobm9kZSwgYm94LmFuY2hvclNpZGUpO1xuICAgICAgICAgICAgICB2YXIgaWRlYWxHYXAgPSBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5BdXhVbml0TGF5b3V0LmdldEN1cnJlbnRHYXAoYm94LmFuY2hvclNpZGUpO1xuICAgICAgICAgICAgICB2YXIgbmV3UG9zaXRpb24gPSBwcmV2aW91c0luZm9CYm94LnggKyAocHJldmlvdXNJbmZvQmJveC53LzIgKyBpZGVhbEdhcCArIGJveC5iYm94LncvMikqMTAwIC8gKG5vZGUub3V0ZXJXaWR0aCgpIC0gYm9yZGVyV2lkdGgpO1xuICAgICAgICAgICAgICBib3guYmJveC54ID0gbmV3UG9zaXRpb247XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSAqL1xuICAgICAgICAgICBcbiAgICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgLyogaWYgKGJveC5hbmNob3JTaWRlID09PSBcInRvcFwiIHx8IGJveC5hbmNob3JTaWRlID09PSBcImJvdHRvbVwiKSB7XG4gICAgICAgICAgYm94LmJib3gueCArPSAoYm94LmJib3gudyAtIG9sZExlbmd0aCkgLyAyO1xuICAgICAgICAgIHZhciB1bml0cyA9IChub2RlLmRhdGEoJ2F1eHVuaXRsYXlvdXRzJylbYm94LmFuY2hvclNpZGVdKS51bml0cztcbiAgICAgICAgICB2YXIgc2hpZnRJbmRleCA9IDA7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bml0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYodW5pdHNbaV0gPT09IGJveCl7XG4gICAgICAgICAgICAgIHNoaWZ0SW5kZXggPSBpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yICh2YXIgaiA9IHNoaWZ0SW5kZXgrMTsgaiA8IHVuaXRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgIHVuaXRzW2pdLmJib3gueCArPSAoYm94LmJib3gudyAtIG9sZExlbmd0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9ICovXG5cbiAgICAgIH1cblxuICAgICAgLy9UT0RPIGZpbmQgYSB3YXkgdG8gZWxpbWF0ZSB0aGlzIHJlZHVuZGFuY3kgdG8gdXBkYXRlIGluZm8tYm94IHBvc2l0aW9uc1xuICAgICAgbm9kZS5kYXRhKCdib3JkZXItd2lkdGgnLCBub2RlLmRhdGEoJ2JvcmRlci13aWR0aCcpKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgLy8gQWRkIGEgbmV3IHN0YXRlIG9yIGluZm8gYm94IHRvIGdpdmVuIG5vZGVzLlxuICAgIC8vIFRoZSBib3ggaXMgcmVwcmVzZW50ZWQgYnkgdGhlIHBhcmFtZXRlciBvYmouXG4gICAgLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGp1c3QgYWRkZWQgYm94LlxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIG9iaikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgbG9jYXRpb25PYmo7XG5cbiAgICAgICAgdmFyIGRlZmF1bHRQcm9wcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIG5vZGUuZGF0YSgnY2xhc3MnKSApO1xuICAgICAgICB2YXIgaW5mb2JveFByb3BzID0gZGVmYXVsdFByb3BzWyBvYmouY2xhenogXTtcbiAgICAgICAgdmFyIGJib3ggPSBvYmouYmJveCB8fCB7IHc6IGluZm9ib3hQcm9wcy53aWR0aCwgaDogaW5mb2JveFByb3BzLmhlaWdodCB9OyAgICAgICAgXG4gICAgICAgIHZhciBzdHlsZSA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdEluZm9ib3hTdHlsZSggbm9kZS5kYXRhKCdjbGFzcycpLCBvYmouY2xhenogKTtcbiAgICAgICAgaWYob2JqLnN0eWxlKXtcbiAgICAgICAgICAkLmV4dGVuZCggc3R5bGUsIG9iai5zdHlsZSApO1xuICAgICAgICB9XG4gICAgICAgXG4gICAgICAgIGlmKG9iai5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xuICAgICAgICAgIGxvY2F0aW9uT2JqID0gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuVW5pdE9mSW5mb3JtYXRpb24uY3JlYXRlKG5vZGUsIGN5LCBvYmoubGFiZWwudGV4dCwgYmJveCwgb2JqLmxvY2F0aW9uLCBvYmoucG9zaXRpb24sIHN0eWxlLCBvYmouaW5kZXgsIG9iai5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob2JqLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xuICAgICAgICAgIGxvY2F0aW9uT2JqID0gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuU3RhdGVWYXJpYWJsZS5jcmVhdGUobm9kZSwgY3ksIG9iai5zdGF0ZS52YWx1ZSwgb2JqLnN0YXRlLnZhcmlhYmxlLCBiYm94LCBvYmoubG9jYXRpb24sIG9iai5wb3NpdGlvbiwgc3R5bGUsIG9iai5pbmRleCwgb2JqLmlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxvY2F0aW9uT2JqO1xuICAgIH07XG5cbiAgICAvLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxuICAgIC8vIFJldHVybnMgdGhlIHJlbW92ZWQgYm94LlxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIGxvY2F0aW9uT2JqKSB7XG4gICAgICB2YXIgb2JqO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcbiAgICAgICAgdmFyIHVuaXQgPSBzdGF0ZUFuZEluZm9zW2xvY2F0aW9uT2JqLmluZGV4XTtcblxuICAgICAgICB2YXIgdW5pdENsYXNzID0gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuZ2V0QXV4VW5pdENsYXNzKHVuaXQpO1xuXG4gICAgICAgIG9iaiA9IHVuaXRDbGFzcy5yZW1vdmUodW5pdCwgY3kpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG5cblxuICAgIC8vVGlsZXMgaW5mb3JtYXRpb25zIGJveGVzIGZvciBnaXZlbiBhbmNob3JTaWRlc1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuZml0VW5pdHMgPSBmdW5jdGlvbiAobm9kZSwgbG9jYXRpb25zKSB7XG4gICAgICB2YXIgb2JqID0gW107XG4gICAgICBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykuZm9yRWFjaCggZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICBvYmoucHVzaCh7XG4gICAgICAgICAgeDogZWxlLmJib3gueCxcbiAgICAgICAgICB5OiBlbGUuYmJveC55LFxuICAgICAgICAgIGFuY2hvclNpZGU6IGVsZS5hbmNob3JTaWRlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5BdXhVbml0TGF5b3V0LmZpdFVuaXRzKG5vZGUsIGN5LCBsb2NhdGlvbnMpO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuXG4gICAgLy9DaGVjayB3aGljaCBhbmNob3JzaWRlcyBmaXRzXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGVja0ZpdCA9IGZ1bmN0aW9uIChub2RlLCBsb2NhdGlvbikgeyAvL2lmIG5vIGxvY2F0aW9uIGdpdmVuLCBpdCBjaGVja3MgYWxsIHBvc3NpYmxlIGxvY2F0aW9uc1xuICAgICAgcmV0dXJuIHNiZ252aXpJbnN0YW5jZS5jbGFzc2VzLkF1eFVuaXRMYXlvdXQuY2hlY2tGaXQobm9kZSwgY3ksIGxvY2F0aW9uKTtcbiAgICB9O1xuXG4gICAgLy9Nb2RpZnkgYXJyYXkgb2YgYXV4IGxheW91dCB1bml0c1xuICAgIGVsZW1lbnRVdGlsaXRpZXMubW9kaWZ5VW5pdHMgPSBmdW5jdGlvbiAobm9kZSwgdW5pdCwgYW5jaG9yU2lkZSkge1xuICAgICAgc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuQXV4VW5pdExheW91dC5tb2RpZnlVbml0cyhub2RlLCB1bml0LCBhbmNob3JTaWRlLCBjeSk7XG4gICAgfTtcblxuICAgIC8vIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChub2Rlcywgc3RhdHVzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHZhciBzYmduY2xhc3MgPSBub2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcblxuICAgICAgICBpZiAoc3RhdHVzKSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIHRydWVcbiAgICAgICAgICBpZiAoIWlzTXVsdGltZXIpIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MgKyAnIG11bHRpbWVyJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyBmYWxzZVxuICAgICAgICAgIGlmIChpc011bHRpbWVyKSB7XG4gICAgICAgICAgICBub2RlLmRhdGEoJ2NsYXNzJywgc2JnbmNsYXNzLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIENoYW5nZSBmb250IHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIGVsZW1lbnRzIHdpdGggZ2l2ZW4gZm9udCBkYXRhXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChlbGVzLCBkYXRhKSB7XG4gICAgICBmb3IgKHZhciBwcm9wIGluIGRhdGEpIHtcbiAgICAgICAgZWxlcy5kYXRhKHByb3AsIGRhdGFbcHJvcF0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGdldHMgYW4gZWRnZSwgYW5kIGVuZHMgb2YgdGhhdCBlZGdlIChPcHRpb25hbGx5IGl0IG1heSB0YWtlIGp1c3QgdGhlIGNsYXNzZXMgb2YgdGhlIGVkZ2UgYXMgd2VsbCkgYXMgcGFyYW1ldGVycy5cbiAgICAvLyBJdCBtYXkgcmV0dXJuICd2YWxpZCcgKHRoYXQgZW5kcyBpcyB2YWxpZCBmb3IgdGhhdCBlZGdlKSwgJ3JldmVyc2UnICh0aGF0IGVuZHMgaXMgbm90IHZhbGlkIGZvciB0aGF0IGVkZ2UgYnV0IHRoZXkgd291bGQgYmUgdmFsaWRcbiAgICAvLyBpZiB5b3UgcmV2ZXJzZSB0aGUgc291cmNlIGFuZCB0YXJnZXQpLCAnaW52YWxpZCcgKHRoYXQgZW5kcyBhcmUgdG90YWxseSBpbnZhbGlkIGZvciB0aGF0IGVkZ2UpLlxuICAgIGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMgPSBmdW5jdGlvbiAoZWRnZSwgc291cmNlLCB0YXJnZXQsIGlzUmVwbGFjZW1lbnQpIHtcbiAgICAgIC8vIGlmIG1hcCB0eXBlIGlzIFVua25vd24gLS0gbm8gcnVsZXMgYXBwbGllZFxuICAgICAgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpID09IFwiSHlicmlkQW55XCIgfHwgZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gXCJIeWJyaWRTYmduXCIgfHwgIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKVxuICAgICAgICByZXR1cm4gXCJ2YWxpZFwiO1xuXG4gICAgICB2YXIgZWRnZWNsYXNzID0gdHlwZW9mIGVkZ2UgPT09ICdzdHJpbmcnID8gZWRnZSA6IGVkZ2UuZGF0YSgnY2xhc3MnKTtcbiAgICAgIHZhciBzb3VyY2VjbGFzcyA9IHNvdXJjZS5kYXRhKCdjbGFzcycpO1xuICAgICAgdmFyIHRhcmdldGNsYXNzID0gdGFyZ2V0LmRhdGEoJ2NsYXNzJyk7XG4gICAgICB2YXIgbWFwVHlwZSA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpO1xuICAgICAgdmFyIGVkZ2VDb25zdHJhaW50cyA9IGVsZW1lbnRVdGlsaXRpZXNbbWFwVHlwZV0uY29ubmVjdGl2aXR5Q29uc3RyYWludHNbZWRnZWNsYXNzXTtcblxuICAgICAgaWYgKG1hcFR5cGUgPT0gXCJBRlwiKXtcbiAgICAgICAgaWYgKHNvdXJjZWNsYXNzLnN0YXJ0c1dpdGgoXCJCQVwiKSkgLy8gd2UgaGF2ZSBzZXBhcmF0ZSBjbGFzc2VzIGZvciBlYWNoIGJpb2xvZ2ljYWwgYWN0aXZpdHlcbiAgICAgICAgICBzb3VyY2VjbGFzcyA9IFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiOyAvLyBidXQgc2FtZSBydWxlIGFwcGxpZXMgdG8gYWxsIG9mIHRoZW1cblxuICAgICAgICBpZiAodGFyZ2V0Y2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKSAvLyB3ZSBoYXZlIHNlcGFyYXRlIGNsYXNzZXMgZm9yIGVhY2ggYmlvbG9naWNhbCBhY3Rpdml0eVxuICAgICAgICAgIHRhcmdldGNsYXNzID0gXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI7IC8vIGJ1dCBzYW1lIHJ1bGUgYXBwbGllcyB0byBhbGwgb2YgdGhlbVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAobWFwVHlwZSA9PSBcIlBEXCIpe1xuICAgICAgICBzb3VyY2VjbGFzcyA9IHNvdXJjZWNsYXNzLnJlcGxhY2UoL1xccyptdWx0aW1lciQvLCAnJyk7XG4gICAgICAgIHRhcmdldGNsYXNzID0gdGFyZ2V0Y2xhc3MucmVwbGFjZSgvXFxzKm11bHRpbWVyJC8sICcnKTtcbiAgICAgIH1cblxuICAgICAgLy8gZ2l2ZW4gYSBub2RlLCBhY3RpbmcgYXMgc291cmNlIG9yIHRhcmdldCwgcmV0dXJucyBib29sZWFuIHdldGhlciBvciBub3QgaXQgaGFzIHRvbyBtYW55IGVkZ2VzIGFscmVhZHlcbiAgICAgIGZ1bmN0aW9uIGhhc1Rvb01hbnlFZGdlcyhub2RlLCBzb3VyY2VPclRhcmdldCkge1xuICAgICAgICB2YXIgbm9kZWNsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xuICAgICAgICBub2RlY2xhc3MgPSBub2RlY2xhc3MucmVwbGFjZSgvXFxzKm11bHRpbWVyJC8sICcnKTtcbiAgICAgICAgaWYgKG5vZGVjbGFzcy5zdGFydHNXaXRoKFwiQkFcIikpXG4gICAgICAgICAgbm9kZWNsYXNzID0gXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI7XG5cbiAgICAgICAgLypcbiAgICAgICAgICBPbiB0aGUgbG9naWMgYmVsb3c6XG5cbiAgICAgICAgICBDdXJyZW50IGVkZ2UgY291bnQgKGluY29taW5nIG9yIG91dGdvaW5nKSBvZiBub2RlcyBzaG91bGQgYmUgc3RyaWN0bHkgbGVzcyBcbiAgICAgICAgICB0aGFuIHRoZSBtYXhpbXVtIGFsbG93ZWQgaWYgd2UgYXJlIGFkZGluZyBhbiBlZGdlIHRvIHRoZSBub2RlLiBUaGlzIHdheVxuICAgICAgICAgIGl0IHdpbGwgbmV2ZXIgZXhjZWVkIHRoZSBtYXggY291bnQuXG4gICAgICAgICAgXG4gICAgICAgICAgRWRnZXMgY2FuIGJlIGFkZGVkIGluIHR3byBkaWZmZXJlbnQgd2F5cy4gRWl0aGVyIHRoZXkgYXJlIGFkZGVkIGRpcmVjdGx5IG9yXG4gICAgICAgICAgdGhleSBhcmUgYWRkZWQgYnkgYmVpbmcgcmVwbGFjZWQgZnJvbSBhbm90aGVyIG5vZGUsIGkuZSBkaXNjb25uZWN0ZWQgZnJvbVxuICAgICAgICAgIG9uZSBhbmQgY29ubmVjdGVkIHRvIGFub3RoZXIuXG5cbiAgICAgICAgICBXZSBjYW4gZGV0ZWN0IGlmIHRoZSBlZGdlIGJlaW5nIGFkZGVkIGlzIGFkZGVkIGZyb20gYSByZXBsYWNlbWVudCBieSBjaGVja2luZ1xuICAgICAgICAgIHdoZXRoZXIgdGhlIHNvdXJjZSBzdGF5ZWQgdGhlIHNhbWUgd2hlbiBjaGVja2luZyBlZGdlIGNvdW50cyBvZiB0aGUgc291cmNlIG5vZGUsXG4gICAgICAgICAgYW5kIHdoZXRoZXIgdGhlIHRhcmdldCBzdGF5ZWQgdGhlIHNhbWUgd2hlbiBjaGVja2luZyBlZGdlIGNvdW50cyBvZiB0aGVcbiAgICAgICAgICB0YXJnZXQgbm9kZS5cblxuICAgICAgICAgIEN1cnJlbnQgZWRnZSBjb3VudCBvZiBub2RlcyBjYW4gYmUgYWxsb3dlZCB0byBiZSBlcXVhbCB0byB0aGUgbWF4aW11bSBpbiBcbiAgICAgICAgICBjYXNlcyB3aGVyZSBhIHJlcGxhY2VtZW50IGlzIG1hZGUuIEJ1dCB3ZSBzaG91bGQgYmUgY2FyZWZ1bCB0aGF0IHRoaXNcbiAgICAgICAgICByZXBsYWNlbWVudCBvcGVyYXRpb24gaXMgbm90IGFsc28gYW4gYWRkaXRpb24gb3BlcmF0aW9uIGFzIGRlc2NyaWJlZCBhYm92ZS5cbiAgICAgICAgKi9cblxuICAgICAgICB2YXIgdG90YWxUb29NYW55ID0gdHJ1ZTtcbiAgICAgICAgdmFyIGVkZ2VUb29NYW55ID0gdHJ1ZTtcbiAgICAgICAgaWYgKHNvdXJjZU9yVGFyZ2V0ID09IFwic291cmNlXCIpIHtcbiAgICAgICAgICAgIHZhciBzYW1lRWRnZUNvdW50T3V0ID0gbm9kZS5vdXRnb2VycygnZWRnZVtjbGFzcz1cIicrZWRnZWNsYXNzKydcIl0nKS5zaXplKCk7XG4gICAgICAgICAgICB2YXIgdG90YWxFZGdlQ291bnRPdXQgPSBub2RlLm91dGdvZXJzKCdlZGdlJykuc2l6ZSgpO1xuICAgICAgICAgICAgdmFyIG1heFRvdGFsID0gZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4VG90YWw7IFxuICAgICAgICAgICAgdmFyIG1heEVkZ2UgPSBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhFZGdlO1xuXG4gICAgICAgICAgICB2YXIgY29tcGFyZVN0cmljdCA9ICEoaXNSZXBsYWNlbWVudCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlZGdlLnNvdXJjZSgpID09PSBzb3VyY2UpKTtcblxuICAgICAgICAgICAgdmFyIHdpdGhpbkxpbWl0cyA9ICFtYXhUb3RhbCB8fCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb21wYXJlU3RyaWN0ICYmICh0b3RhbEVkZ2VDb3VudE91dCA8IG1heFRvdGFsKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICghY29tcGFyZVN0cmljdCAmJiAodG90YWxFZGdlQ291bnRPdXQgPD0gbWF4VG90YWwpKTtcblxuICAgICAgICAgICAgaWYgKHdpdGhpbkxpbWl0cykge1xuICAgICAgICAgICAgICAgIHRvdGFsVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhlbiBjaGVjayBsaW1pdHMgZm9yIHRoaXMgc3BlY2lmaWMgZWRnZSBjbGFzc1xuXG4gICAgICAgICAgICB3aXRoaW5MaW1pdHMgPSAhbWF4RWRnZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb21wYXJlU3RyaWN0ICYmIChzYW1lRWRnZUNvdW50T3V0IDwgbWF4RWRnZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIWNvbXBhcmVTdHJpY3QgJiYgKHNhbWVFZGdlQ291bnRPdXQgPD0gbWF4RWRnZSkpKTsgXG5cbiAgICAgICAgICAgIGlmICh3aXRoaW5MaW1pdHMpIHtcbiAgICAgICAgICAgICAgICBlZGdlVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBvbmx5IG9uZSBvZiB0aGUgbGltaXRzIGlzIHJlYWNoZWQgdGhlbiBlZGdlIGlzIGludmFsaWRcbiAgICAgICAgICAgIHJldHVybiB0b3RhbFRvb01hbnkgfHwgZWRnZVRvb01hbnk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIG5vZGUgaXMgdXNlZCBhcyB0YXJnZXRcbiAgICAgICAgICAgIHZhciBzYW1lRWRnZUNvdW50SW4gPSBub2RlLmluY29tZXJzKCdlZGdlW2NsYXNzPVwiJytlZGdlY2xhc3MrJ1wiXScpLnNpemUoKTtcbiAgICAgICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudEluID0gbm9kZS5pbmNvbWVycygnZWRnZScpLnNpemUoKTtcbiAgICAgICAgICAgIHZhciBtYXhUb3RhbCA9IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heFRvdGFsOyBcbiAgICAgICAgICAgIHZhciBtYXhFZGdlID0gZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNUYXJnZXQubWF4RWRnZTtcblxuICAgICAgICAgICAgdmFyIGNvbXBhcmVTdHJpY3QgPSAhKGlzUmVwbGFjZW1lbnQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVkZ2UudGFyZ2V0KCkgPT09IHRhcmdldCkpO1xuXG4gICAgICAgICAgICB2YXIgd2l0aGluTGltaXRzID0gIW1heFRvdGFsIHx8IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbXBhcmVTdHJpY3QgJiYgKHRvdGFsRWRnZUNvdW50SW4gPCBtYXhUb3RhbCkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIWNvbXBhcmVTdHJpY3QgJiYgKHRvdGFsRWRnZUNvdW50SW4gPD0gbWF4VG90YWwpKTtcblxuICAgICAgICAgICAgaWYgKHdpdGhpbkxpbWl0cykge1xuICAgICAgICAgICAgICAgIHRvdGFsVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aXRoaW5MaW1pdHMgPSAhbWF4RWRnZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAoY29tcGFyZVN0cmljdCAmJiAoc2FtZUVkZ2VDb3VudEluIDwgbWF4RWRnZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKCFjb21wYXJlU3RyaWN0ICYmIChzYW1lRWRnZUNvdW50SW4gPD0gbWF4RWRnZSkpKTsgXG5cbiAgICAgICAgICAgIGlmICh3aXRoaW5MaW1pdHMpIHtcbiAgICAgICAgICAgICAgICBlZGdlVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRvdGFsVG9vTWFueSB8fCBlZGdlVG9vTWFueTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpc0luQ29tcGxleChub2RlKSB7XG4gICAgICAgIHZhciBwYXJlbnRDbGFzcyA9IG5vZGUucGFyZW50KCkuZGF0YSgnY2xhc3MnKTtcbiAgICAgICAgcmV0dXJuIHBhcmVudENsYXNzICYmIHBhcmVudENsYXNzLnN0YXJ0c1dpdGgoJ2NvbXBsZXgnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzSW5Db21wbGV4KHNvdXJjZSkgfHwgaXNJbkNvbXBsZXgodGFyZ2V0KSkgeyAvLyBzdWJ1bml0cyBvZiBhIGNvbXBsZXggYXJlIG5vIGxvbmdlciBFUE5zLCBubyBjb25uZWN0aW9uIGFsbG93ZWRcbiAgICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICAgIH1cblxuICAgICAgLy8gY2hlY2sgbmF0dXJlIG9mIGNvbm5lY3Rpb25cbiAgICAgIGlmIChlZGdlQ29uc3RyYWludHNbc291cmNlY2xhc3NdLmFzU291cmNlLmlzQWxsb3dlZCAmJiBlZGdlQ29uc3RyYWludHNbdGFyZ2V0Y2xhc3NdLmFzVGFyZ2V0LmlzQWxsb3dlZCkge1xuICAgICAgICAvLyBjaGVjayBhbW91bnQgb2YgY29ubmVjdGlvbnNcbiAgICAgICAgaWYgKCFoYXNUb29NYW55RWRnZXMoc291cmNlLCBcInNvdXJjZVwiKSAmJiAhaGFzVG9vTWFueUVkZ2VzKHRhcmdldCwgXCJ0YXJnZXRcIikgKSB7XG4gICAgICAgICAgcmV0dXJuICd2YWxpZCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIHRyeSB0byByZXZlcnNlXG4gICAgICBpZiAoZWRnZUNvbnN0cmFpbnRzW3RhcmdldGNsYXNzXS5hc1NvdXJjZS5pc0FsbG93ZWQgJiYgZWRnZUNvbnN0cmFpbnRzW3NvdXJjZWNsYXNzXS5hc1RhcmdldC5pc0FsbG93ZWQpIHtcbiAgICAgICAgaWYgKCFoYXNUb29NYW55RWRnZXModGFyZ2V0LCBcInNvdXJjZVwiKSAmJiAhaGFzVG9vTWFueUVkZ2VzKHNvdXJjZSwgXCJ0YXJnZXRcIikgKSB7XG4gICAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5kZWxldGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSBlbGVzLnJlbW92ZSgpO1xuICAgICAgaWYgKHR5cGVvZiBsYXlvdXRwYXJhbSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsYXlvdXRwYXJhbSgpOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBhIGZ1bmN0aW9uIGV4ZWN1dGUgaXRcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhciBsYXlvdXQgPSBjeS5sYXlvdXQobGF5b3V0cGFyYW0pOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBsYXlvdXQgb3B0aW9ucyBjYWxsIGxheW91dCB3aXRoIHRoYXQgb3B0aW9ucy5cblxuICAgICAgICAgIC8vIERvIHRoaXMgY2hlY2sgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuKSB7XG4gICAgICAgICAgICAgIGxheW91dC5ydW4oKTtcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogSGlkZSBnaXZlbiBlbGVzIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXG4gICAgICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLlxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuaGlkZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihlbGVzLCBsYXlvdXRwYXJhbSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gY3kudmlld1V0aWxpdGllcygpLmhpZGUoZWxlcyk7IC8vIEhpZGUgZ2l2ZW4gZWxlc1xuICAgICAgICBpZiAodHlwZW9mIGxheW91dHBhcmFtID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBsYXlvdXRwYXJhbSgpOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBhIGZ1bmN0aW9uIGV4ZWN1dGUgaXRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBsYXlvdXQgPSBjeS5sYXlvdXQobGF5b3V0cGFyYW0pOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBsYXlvdXQgb3B0aW9ucyBjYWxsIGxheW91dCB3aXRoIHRoYXQgb3B0aW9ucy5cblxuICAgICAgICAgICAgLy8gRG8gdGhpcyBjaGVjayBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgICAgICAgICAgICAgIGxheW91dC5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogVW5oaWRlIGdpdmVuIGVsZXMgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAgICAgKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xuICAgICAgaWYgKHR5cGVvZiBsYXlvdXRwYXJhbSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsYXlvdXRwYXJhbSgpOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBhIGZ1bmN0aW9uIGV4ZWN1dGUgaXRcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgbGF5b3V0ID0gY3kubGF5b3V0KGxheW91dHBhcmFtKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgbGF5b3V0IG9wdGlvbnMgY2FsbCBsYXlvdXQgd2l0aCB0aGF0IG9wdGlvbnMuXG5cbiAgICAgICAgLy8gRG8gdGhpcyBjaGVjayBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICAgICAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuKSB7XG4gICAgICAgICAgbGF5b3V0LnJ1bigpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogQ2hhbmdlIHN0eWxlL2NzcyBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gICAgICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICAgICAgaWYgKCB0eXBlb2YgdmFsdWVNYXAgPT09ICdvYmplY3QnICkge1xuICAgICAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBlbGUgPSBjeS5nZXRFbGVtZW50QnlJZChlbGVzW2ldLmlkKCkpO1xuICAgICAgICAgIGVsZS5jc3MobmFtZSwgdmFsdWVNYXBbZWxlLmlkKCldKTsgLy8gdmFsdWVNYXAgaXMgYW4gaWQgdG8gdmFsdWUgbWFwIHVzZSBpdCBpbiB0aGlzIHdheVxuICAgICAgICB9XG4gICAgICAgIGN5LmVuZEJhdGNoKCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcy5jc3MobmFtZSwgdmFsdWVNYXApOyAvLyB2YWx1ZU1hcCBpcyBqdXN0IGEgc3RyaW5nIHNldCBjc3MoJ25hbWUnKSBmb3IgYWxsIGVsZXMgdG8gdGhpcyB2YWx1ZVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKlxuICAgICAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAgICAgKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS5cbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICAgICAgaWYgKCB0eXBlb2YgdmFsdWVNYXAgPT09ICdvYmplY3QnICkge1xuICAgICAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBlbGUgPSBjeS5nZXRFbGVtZW50QnlJZChlbGVzW2ldLmlkKCkpO1xuICAgICAgICAgIGVsZS5kYXRhKG5hbWUsIHZhbHVlTWFwW2VsZS5pZCgpXSk7IC8vIHZhbHVlTWFwIGlzIGFuIGlkIHRvIHZhbHVlIG1hcCB1c2UgaXQgaW4gdGhpcyB3YXlcbiAgICAgICAgfVxuICAgICAgICBjeS5lbmRCYXRjaCgpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGVsZXMuZGF0YShuYW1lLCB2YWx1ZU1hcCk7IC8vIHZhbHVlTWFwIGlzIGp1c3QgYSBzdHJpbmcgc2V0IGNzcygnbmFtZScpIGZvciBhbGwgZWxlcyB0byB0aGlzIHZhbHVlXG4gICAgICB9XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlU2V0RmllbGQgPSBmdW5jdGlvbihlbGUsIGZpZWxkTmFtZSwgdG9EZWxldGUsIHRvQWRkLCBjYWxsYmFjaykge1xuICAgICAgdmFyIHNldCA9IGVsZS5kYXRhKCBmaWVsZE5hbWUgKTtcbiAgICAgIGlmICggIXNldCApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHVwZGF0ZXMgPSB7fTtcblxuICAgICAgaWYgKCB0b0RlbGV0ZSAhPSBudWxsICYmIHNldFsgdG9EZWxldGUgXSApIHtcbiAgICAgICAgZGVsZXRlIHNldFsgdG9EZWxldGUgXTtcbiAgICAgICAgdXBkYXRlcy5kZWxldGVkID0gdG9EZWxldGU7XG4gICAgICB9XG5cbiAgICAgIGlmICggdG9BZGQgIT0gbnVsbCApIHtcbiAgICAgICAgc2V0WyB0b0FkZCBdID0gdHJ1ZTtcbiAgICAgICAgdXBkYXRlcy5hZGRlZCA9IHRvQWRkO1xuICAgICAgfVxuXG4gICAgICBpZiAoIGNhbGxiYWNrICYmICggdXBkYXRlc1sgJ2RlbGV0ZWQnIF0gIT0gbnVsbCB8fCB1cGRhdGVzWyAnYWRkZWQnIF0gIT0gbnVsbCApICkge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdXBkYXRlcztcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBSZXR1cm4gdGhlIHNldCBvZiBhbGwgbm9kZXMgcHJlc2VudCB1bmRlciB0aGUgZ2l2ZW4gcG9zaXRpb25cbiAgICAgKiByZW5kZXJlZFBvcyBtdXN0IGJlIGEgcG9pbnQgZGVmaW5lZCByZWxhdGl2ZWx5IHRvIGN5dG9zY2FwZSBjb250YWluZXJcbiAgICAgKiAobGlrZSByZW5kZXJlZFBvc2l0aW9uIGZpZWxkIG9mIGEgbm9kZSlcbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmdldE5vZGVzQXQgPSBmdW5jdGlvbihyZW5kZXJlZFBvcykge1xuICAgICAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcbiAgICAgIHZhciB4ID0gcmVuZGVyZWRQb3MueDtcbiAgICAgIHZhciB5ID0gcmVuZGVyZWRQb3MueTtcbiAgICAgIHZhciByZXN1bHROb2RlcyA9IFtdO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHZhciByZW5kZXJlZEJib3ggPSBub2RlLnJlbmRlcmVkQm91bmRpbmdCb3goe1xuICAgICAgICAgIGluY2x1ZGVOb2RlczogdHJ1ZSxcbiAgICAgICAgICBpbmNsdWRlRWRnZXM6IGZhbHNlLFxuICAgICAgICAgIGluY2x1ZGVMYWJlbHM6IGZhbHNlLFxuICAgICAgICAgIGluY2x1ZGVTaGFkb3dzOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHggPj0gcmVuZGVyZWRCYm94LngxICYmIHggPD0gcmVuZGVyZWRCYm94LngyKSB7XG4gICAgICAgICAgaWYgKHkgPj0gcmVuZGVyZWRCYm94LnkxICYmIHkgPD0gcmVuZGVyZWRCYm94LnkyKSB7XG4gICAgICAgICAgICByZXN1bHROb2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdE5vZGVzO1xuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmRlbXVsdGltZXJpemVDbGFzcyA9IGZ1bmN0aW9uKHNiZ25jbGFzcykge1xuICAgICAgcmV0dXJuIHNiZ25jbGFzcy5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbWFwVHlwZSAtIHR5cGUgb2YgdGhlIGN1cnJlbnQgbWFwIChQRCwgQUYgb3IgVW5rbm93bilcbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUgPSBmdW5jdGlvbihtYXBUeXBlKXtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZSA9IG1hcFR5cGU7XG4gICAgICByZXR1cm4gbWFwVHlwZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gLSBtYXAgdHlwZVxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLm1hcFR5cGU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlc2V0cyBtYXAgdHlwZVxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzZXRNYXBUeXBlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tYXBUeXBlID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEtlZXAgY29uc2lzdGVuY3kgb2YgbGlua3MgdG8gc2VsZiBpbnNpZGUgdGhlIGRhdGEoKSBzdHJ1Y3R1cmUuXG4gICAgICogVGhpcyBpcyBuZWVkZWQgd2hlbmV2ZXIgYSBub2RlIGNoYW5nZXMgcGFyZW50cywgZm9yIGV4YW1wbGUsXG4gICAgICogYXMgaXQgaXMgZGVzdHJveWVkIGFuZCByZWNyZWF0ZWQuIEJ1dCB0aGUgZGF0YSgpIHN0YXlzIGlkZW50aWNhbC5cbiAgICAgKiBUaGlzIGNyZWF0ZXMgaW5jb25zaXN0ZW5jaWVzIGZvciB0aGUgcG9pbnRlcnMgc3RvcmVkIGluIGRhdGEoKSxcbiAgICAgKiBhcyB0aGV5IG5vdyBwb2ludCB0byBhIGRlbGV0ZWQgbm9kZS5cbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlciA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgICBlbGVzLm5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbihlbGUpe1xuICAgICAgICAvLyByZXN0b3JlIGJhY2tncm91bmQgaW1hZ2VzXG4gICAgICAgIGVsZS5lbWl0KCdkYXRhJyk7XG5cbiAgICAgICAgLy8gc2tpcCBub2RlcyB3aXRob3V0IGFueSBhdXhpbGlhcnkgdW5pdHNcbiAgICAgICAgaWYoIWVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpIHx8IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvcih2YXIgc2lkZSBpbiBlbGUuZGF0YSgnYXV4dW5pdGxheW91dHMnKSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdhdXh1bml0bGF5b3V0cycpW3NpZGVdLnBhcmVudE5vZGUgPSBlbGUuaWQoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IodmFyIGk9MDsgaSA8IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJylbaV0ucGFyZW50ID0gZWxlLmlkKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYW55SGFzQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKGVsZXMpIHtcbiAgICAgIHZhciBvYmogPSBlbGVtZW50VXRpbGl0aWVzLmdldEJhY2tncm91bmRJbWFnZU9ianMoZWxlcyk7XG4gICAgICBpZihvYmogPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgZWxzZXtcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqKXtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgICAgICBpZih2YWx1ZSAmJiAhJC5pc0VtcHR5T2JqZWN0KHZhbHVlKSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIGlmICghZWxlLmlzTm9kZSgpIHx8ICFlbGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciBiZztcbiAgICAgIFxuICAgICAgaWYodHlwZW9mIGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgYmcgPSBlbGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KFwiIFwiKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoQXJyYXkuaXNBcnJheShvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSkpIHtcbiAgICAgICAgYmcgPSBlbGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWJnKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHZhciBjbG9uZUltZyA9ICdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCwlM0NzdmclMjB3aWR0aCUzRCUyMjEwMCUyMiUyMGhlaWdodCUzRCUyMjEwMCUyMiUyMHZpZXdCb3glM0QlMjIwJTIwMCUyMDEwMCUyMDEwMCUyMiUyMHN0eWxlJTNEJTIyZmlsbCUzQW5vbmUlM0JzdHJva2UlM0FibGFjayUzQnN0cm9rZS13aWR0aCUzQTAlM0IlMjIlMjB4bWxucyUzRCUyMmh0dHAlM0EvL3d3dy53My5vcmcvMjAwMC9zdmclMjIlMjAlM0UlM0NyZWN0JTIweCUzRCUyMjAlMjIlMjB5JTNEJTIyMCUyMiUyMHdpZHRoJTNEJTIyMTAwJTIyJTIwaGVpZ2h0JTNEJTIyMTAwJTIyJTIwc3R5bGUlM0QlMjJmaWxsJTNBJTIzODM4MzgzJTIyLyUzRSUyMCUzQy9zdmclM0UnO1xuICAgICAgLy8gSWYgY2xvbmVJbWcgaXMgbm90IHRoZSBvbmx5IGltYWdlIG9yIHRoZXJlIGFyZSBtdWx0aXBsZSBpbWFnZXMgdGhlcmUgaXMgYSBiYWNrZ3JvdW5kIGltYWdlXG4gICAgICB2YXIgb25seUhhc0Nsb25lTWFya2VyQXNCZ0ltYWdlID0gKGJnLmxlbmd0aCA9PT0gMSkgJiYgKGJnLmluZGV4T2YoY2xvbmVJbWcpID09PSAwKTtcblxuICAgICAgaWYoYmcubGVuZ3RoID4gMSB8fCAhKG9ubHlIYXNDbG9uZU1hcmtlckFzQmdJbWFnZSkpXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5nZXRCYWNrZ3JvdW5kSW1hZ2VVUkwgPSBmdW5jdGlvbiAoZWxlcykge1xuICAgICAgaWYoIWVsZXMgfHwgZWxlcy5sZW5ndGggPCAxKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHZhciBjb21tb25VUkwgPSBcIlwiO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcblxuICAgICAgICBpZighZWxlLmlzTm9kZSgpIHx8ICFlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShlbGUpKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB2YXIgdXJsID0gZWxlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKS5zcGxpdChcIiBcIikucG9wKCk7XG4gICAgICAgIGlmKCF1cmwgfHwgdXJsLmluZGV4T2YoJ2h0dHAnKSAhPT0gMCB8fCAoY29tbW9uVVJMICE9PSBcIlwiICYmIGNvbW1vblVSTCAhPT0gdXJsKSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGVsc2UgaWYoY29tbW9uVVJMID09PSBcIlwiKVxuICAgICAgICAgIGNvbW1vblVSTCA9IHVybDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbW1vblVSTDtcbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmdldEJhY2tncm91bmRJbWFnZU9ianMgPSBmdW5jdGlvbiAoZWxlcykge1xuICAgICAgaWYoIWVsZXMgfHwgZWxlcy5sZW5ndGggPCAxKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHZhciBsaXN0ID0ge307XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgICAgICB2YXIgb2JqID0gZ2V0QmdPYmooZWxlKTtcbiAgICAgICAgaWYoT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPCAxKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBsaXN0W2VsZS5kYXRhKCdpZCcpXSA9IG9iajtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsaXN0O1xuXG4gICAgICBmdW5jdGlvbiBnZXRCZ09iaiAoZWxlKSB7XG4gICAgICAgIGlmKGVsZS5pc05vZGUoKSAmJiBlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShlbGUpKXtcbiAgICAgICAgICB2YXIga2V5cyA9IFsnYmFja2dyb3VuZC1pbWFnZScsICdiYWNrZ3JvdW5kLWZpdCcsICdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknLFxuICAgICAgICAgICdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnLCAnYmFja2dyb3VuZC1wb3NpdGlvbi15JywgJ2JhY2tncm91bmQtaGVpZ2h0JywgJ2JhY2tncm91bmQtd2lkdGgnXTtcblxuICAgICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgICAgICBpZiAoZWxlLmRhdGEoa2V5KSAmJiAodHlwZW9mIGVsZS5kYXRhKGtleSkgPT09IFwic3RyaW5nXCIpKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gZWxlLmRhdGEoa2V5KS5zcGxpdChcIiBcIilbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSBlbGUuZGF0YShrZXkpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgXG4gICAgICAgICAgICBvYmpba2V5XSA9IHZhbHVlO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGVsZS5pc05vZGUoKSlcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5nZXRCYWNrZ3JvdW5kRml0T3B0aW9ucyA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgICBpZighZWxlcyB8fCBlbGVzLmxlbmd0aCA8IDEpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgdmFyIGNvbW1vbkZpdCA9IFwiXCI7XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBub2RlID0gZWxlc1tpXTtcbiAgICAgICAgaWYoIW5vZGUuaXNOb2RlKCkpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHZhciBmaXQgPSBnZXRGaXRPcHRpb24obm9kZSk7XG4gICAgICAgIGlmKCFmaXQgfHwgKGNvbW1vbkZpdCAhPT0gXCJcIiAmJiBmaXQgIT09IGNvbW1vbkZpdCkpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBlbHNlIGlmKGNvbW1vbkZpdCA9PT0gXCJcIilcbiAgICAgICAgICBjb21tb25GaXQgPSBmaXQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcHRpb25zID0gJzxvcHRpb24gdmFsdWU9XCJub25lXCI+Tm9uZTwvb3B0aW9uPidcbiAgICAgICAgICAgICAgICAgICsgJzxvcHRpb24gdmFsdWU9XCJmaXRcIj5GaXQ8L29wdGlvbj4nXG4gICAgICAgICAgICAgICAgICArICc8b3B0aW9uIHZhbHVlPVwiY292ZXJcIj5Db3Zlcjwvb3B0aW9uPidcbiAgICAgICAgICAgICAgICAgICsgJzxvcHRpb24gdmFsdWU9XCJjb250YWluXCI+Q29udGFpbjwvb3B0aW9uPic7XG4gICAgICB2YXIgc2VhcmNoS2V5ID0gJ3ZhbHVlPVwiJyArIGNvbW1vbkZpdCArICdcIic7XG4gICAgICB2YXIgaW5kZXggPSBvcHRpb25zLmluZGV4T2Yoc2VhcmNoS2V5KSArIHNlYXJjaEtleS5sZW5ndGg7XG4gICAgICByZXR1cm4gb3B0aW9ucy5zdWJzdHIoMCwgaW5kZXgpICsgJyBzZWxlY3RlZCcgKyBvcHRpb25zLnN1YnN0cihpbmRleCk7XG5cbiAgICAgIGZ1bmN0aW9uIGdldEZpdE9wdGlvbihub2RlKSB7XG4gICAgICAgIGlmKCFlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShub2RlKSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGYgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0Jyk7XG4gICAgICAgIHZhciBoID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWhlaWdodCcpO1xuXG4gICAgICAgIGlmKCFmIHx8ICFoKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBmID0gZi5zcGxpdChcIiBcIik7XG4gICAgICAgIGggPSBoLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgaWYoZltmLmxlbmd0aC0xXSA9PT0gXCJub25lXCIpXG4gICAgICAgICAgcmV0dXJuIChoW2gubGVuZ3RoLTFdID09PSBcImF1dG9cIiA/IFwibm9uZVwiIDogXCJmaXRcIik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gZltmLmxlbmd0aC0xXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChub2RlcywgYmdPYmopIHtcbiAgICAgIGlmKCFub2RlcyB8fCBub2Rlcy5sZW5ndGggPT0gMCB8fCAhYmdPYmopXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIG9iaiA9IGJnT2JqW25vZGUuZGF0YSgnaWQnKV07XG4gICAgICAgIGlmKCFvYmogfHwgJC5pc0VtcHR5T2JqZWN0KG9iaikpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgdmFyIGltZ3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeFBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeVBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgd2lkdGhzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKS5zcGxpdChcIiBcIikgOiBbXTtcbiAgICAgICAgdmFyIGhlaWdodHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciBmaXRzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgb3BhY2l0aWVzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSA/IChcIlwiICsgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSkuc3BsaXQoXCIgXCIpIDogW107XG5cbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XG4gICAgICAgIGlmKHR5cGVvZiBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgICBpbmRleCA9IGltZ3MuaW5kZXhPZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSk7XG4gICAgICAgIGVsc2UgaWYoQXJyYXkuaXNBcnJheShvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSkpXG4gICAgICAgICAgaW5kZXggPSBpbWdzLmluZGV4T2Yob2JqWydiYWNrZ3JvdW5kLWltYWdlJ11bMF0pO1xuXG4gICAgICAgIGlmKGluZGV4IDwgMClcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSAmJiBpbWdzLmxlbmd0aCA+IGluZGV4KXtcbiAgICAgICAgICB2YXIgdG1wID0gaW1nc1tpbmRleF07XG4gICAgICAgICAgaW1nc1tpbmRleF0gPSBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXTtcbiAgICAgICAgICBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtZml0J10gJiYgZml0cy5sZW5ndGggPiBpbmRleCl7XG4gICAgICAgICAgdmFyIHRtcCA9IGZpdHNbaW5kZXhdO1xuICAgICAgICAgIGZpdHNbaW5kZXhdID0gb2JqWydiYWNrZ3JvdW5kLWZpdCddO1xuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC1maXQnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtd2lkdGgnXSAmJiB3aWR0aHMubGVuZ3RoID4gaW5kZXgpe1xuICAgICAgICAgIHZhciB0bXAgPSB3aWR0aHNbaW5kZXhdO1xuICAgICAgICAgIHdpZHRoc1tpbmRleF0gPSBvYmpbJ2JhY2tncm91bmQtd2lkdGgnXTtcbiAgICAgICAgICBvYmpbJ2JhY2tncm91bmQtd2lkdGgnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtaGVpZ2h0J10gJiYgaGVpZ2h0cy5sZW5ndGggPiBpbmRleCl7XG4gICAgICAgICAgdmFyIHRtcCA9IGhlaWdodHNbaW5kZXhdO1xuICAgICAgICAgIGhlaWdodHNbaW5kZXhdID0gb2JqWydiYWNrZ3JvdW5kLWhlaWdodCddO1xuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC1oZWlnaHQnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teCddICYmIHhQb3MubGVuZ3RoID4gaW5kZXgpe1xuICAgICAgICAgIHZhciB0bXAgPSB4UG9zW2luZGV4XTtcbiAgICAgICAgICB4UG9zW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1wb3NpdGlvbi14J107XG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teSddICYmIHlQb3MubGVuZ3RoID4gaW5kZXgpe1xuICAgICAgICAgIHZhciB0bXAgPSB5UG9zW2luZGV4XTtcbiAgICAgICAgICB5UG9zW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1wb3NpdGlvbi15J107XG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXknXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eSddICYmIG9wYWNpdGllcy5sZW5ndGggPiBpbmRleCl7XG4gICAgICAgICAgdmFyIHRtcCA9IG9wYWNpdGllc1tpbmRleF07XG4gICAgICAgICAgb3BhY2l0aWVzW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5J107XG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknXSA9IHRtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScsIGltZ3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcsIHhQb3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScsIHlQb3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnLCB3aWR0aHMuam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JywgaGVpZ2h0cy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1maXQnLCBmaXRzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknLCBvcGFjaXRpZXMuam9pbihcIiBcIikpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYmdPYmo7XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAobm9kZXMsIG9sZEltZywgbmV3SW1nLCBmaXJzdFRpbWUsIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpIHtcbiAgICAgIGlmKCFub2RlcyB8fCBub2Rlcy5sZW5ndGggPT0gMCB8fCAhb2xkSW1nIHx8ICFuZXdJbWcpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIG9sZEltZyk7XG4gICAgICBmb3IodmFyIGtleSBpbiBuZXdJbWcpe1xuICAgICAgICBuZXdJbWdba2V5XVsnZmlyc3RUaW1lJ10gPSBmaXJzdFRpbWU7XG4gICAgICB9XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEJhY2tncm91bmRJbWFnZShub2RlcywgbmV3SW1nLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBvbGRJbWc6IG5ld0ltZyxcbiAgICAgICAgbmV3SW1nOiBvbGRJbWcsXG4gICAgICAgIGZpcnN0VGltZTogZmFsc2UsXG4gICAgICAgIHByb21wdEludmFsaWRJbWFnZTogcHJvbXB0SW52YWxpZEltYWdlLFxuICAgICAgICB2YWxpZGF0ZVVSTDogdmFsaWRhdGVVUkxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQWRkIGEgYmFja2dyb3VuZCBpbWFnZSB0byBnaXZlbiBub2Rlcy5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChub2RlcywgYmdPYmosIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpIHtcbiAgICAgIGlmKCFub2RlcyB8fCBub2Rlcy5sZW5ndGggPT0gMCB8fCAhYmdPYmopXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIG9iaiA9IGJnT2JqW25vZGUuZGF0YSgnaWQnKV07XG4gICAgICAgIGlmKCFvYmogfHwgJC5pc0VtcHR5T2JqZWN0KG9iaikpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgLy8gTG9hZCB0aGUgaW1hZ2UgZnJvbSBsb2NhbCwgZWxzZSBqdXN0IHB1dCB0aGUgVVJMXG4gICAgICAgIGlmKG9ialsnZnJvbUZpbGUnXSlcbiAgICAgICAgbG9hZEJhY2tncm91bmRUaGVuQXBwbHkobm9kZSwgb2JqKTtcbiAgICAgICAgLy8gVmFsaWRpdHkgb2YgZ2l2ZW4gVVJMIHNob3VsZCBiZSBjaGVja2VkIGJlZm9yZSBhcHBseWluZyBpdFxuICAgICAgICBlbHNlIGlmKG9ialsnZmlyc3RUaW1lJ10pe1xuICAgICAgICAgIGlmKHR5cGVvZiB2YWxpZGF0ZVVSTCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIHZhbGlkYXRlVVJMKG5vZGUsIG9iaiwgYXBwbHlCYWNrZ3JvdW5kLCBwcm9tcHRJbnZhbGlkSW1hZ2UpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNoZWNrR2l2ZW5VUkwobm9kZSwgb2JqKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXBwbHlCYWNrZ3JvdW5kKG5vZGUsIG9iaik7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGxvYWRCYWNrZ3JvdW5kVGhlbkFwcGx5KG5vZGUsIGJnT2JqKSB7XG4gICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICB2YXIgaW1nRmlsZSA9IGJnT2JqWydiYWNrZ3JvdW5kLWltYWdlJ107XG5cbiAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBnaXZlbiBmaWxlIGlzIGFuIGltYWdlIGZpbGVcbiAgICAgICAgaWYoaW1nRmlsZS50eXBlLmluZGV4T2YoXCJpbWFnZVwiKSAhPT0gMCl7XG4gICAgICAgICAgaWYocHJvbXB0SW52YWxpZEltYWdlKVxuICAgICAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlKFwiSW52YWxpZCBpbWFnZSBmaWxlIGlzIGdpdmVuIVwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbWdGaWxlKTtcblxuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgaW1nID0gcmVhZGVyLnJlc3VsdDtcbiAgICAgICAgICBpZihpbWcpe1xuICAgICAgICAgICAgYmdPYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSA9IGltZztcbiAgICAgICAgICAgIGJnT2JqWydmcm9tRmlsZSddID0gZmFsc2U7XG4gICAgICAgICAgICBhcHBseUJhY2tncm91bmQobm9kZSwgYmdPYmopO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgaWYocHJvbXB0SW52YWxpZEltYWdlKVxuICAgICAgICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2UoXCJHaXZlbiBmaWxlIGNvdWxkIG5vdCBiZSByZWFkIVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNoZWNrR2l2ZW5VUkwobm9kZSwgYmdPYmope1xuICAgICAgICB2YXIgdXJsID0gYmdPYmpbJ2JhY2tncm91bmQtaW1hZ2UnXTtcbiAgICAgICAgdmFyIGV4dGVuc2lvbiA9ICh1cmwuc3BsaXQoL1s/I10vKVswXSkuc3BsaXQoXCIuXCIpLnBvcCgpO1xuICAgICAgICB2YXIgdmFsaWRFeHRlbnNpb25zID0gW1wicG5nXCIsIFwic3ZnXCIsIFwianBnXCIsIFwianBlZ1wiXTtcblxuICAgICAgICBpZighdmFsaWRFeHRlbnNpb25zLmluY2x1ZGVzKGV4dGVuc2lvbikpe1xuICAgICAgICAgIGlmKHR5cGVvZiBwcm9tcHRJbnZhbGlkSW1hZ2UgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2UoXCJJbnZhbGlkIFVSTCBpcyBnaXZlbiFcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXN1bHQsIHN0YXR1cywgeGhyKXtcbiAgICAgICAgICAgIGFwcGx5QmFja2dyb3VuZChub2RlLCBiZ09iaik7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycm9yKXtcbiAgICAgICAgICAgIGlmKHByb21wdEludmFsaWRJbWFnZSlcbiAgICAgICAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlKFwiSW52YWxpZCBVUkwgaXMgZ2l2ZW4hXCIpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcHBseUJhY2tncm91bmQobm9kZSwgYmdPYmopIHtcblxuICAgICAgICBpZihlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShub2RlKSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGltZ3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeFBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeVBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgd2lkdGhzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKS5zcGxpdChcIiBcIikgOiBbXTtcbiAgICAgICAgdmFyIGhlaWdodHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciBmaXRzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgb3BhY2l0aWVzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSA/IChcIlwiICsgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSkuc3BsaXQoXCIgXCIpIDogW107XG5cbiAgICAgICAgdmFyIGluZGV4VG9JbnNlcnQgPSBpbWdzLmxlbmd0aDtcblxuICAgICAgICAvLyBpbnNlcnQgdG8gbGVuZ3RoLTFcbiAgICAgICAgaWYoZWxlbWVudFV0aWxpdGllcy5oYXNDbG9uZU1hcmtlcihpbWdzKSl7XG4gICAgICAgICAgaW5kZXhUb0luc2VydC0tO1xuICAgICAgICB9XG5cbiAgICAgICAgaW1ncy5zcGxpY2UoaW5kZXhUb0luc2VydCwgMCwgYmdPYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSk7XG4gICAgICAgIGZpdHMuc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLWZpdCddKTtcbiAgICAgICAgb3BhY2l0aWVzLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5J10pO1xuICAgICAgICB4UG9zLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1wb3NpdGlvbi14J10pO1xuICAgICAgICB5UG9zLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1wb3NpdGlvbi15J10pO1xuICAgICAgICB3aWR0aHMuc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLXdpZHRoJ10pO1xuICAgICAgICBoZWlnaHRzLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1oZWlnaHQnXSk7XG5cbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJywgaW1ncy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JywgeFBvcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JywgeVBvcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcsIHdpZHRocy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnLCBoZWlnaHRzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcsIGZpdHMuam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScsIG9wYWNpdGllcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIGJnT2JqWydmaXJzdFRpbWUnXSA9IGZhbHNlO1xuXG4gICAgICAgIGlmKHVwZGF0ZUluZm8pXG4gICAgICAgICAgdXBkYXRlSW5mbygpO1xuXG4gICAgICB9XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuaGFzQ2xvbmVNYXJrZXIgPSBmdW5jdGlvbiAoaW1ncykge1xuICAgICAgdmFyIGNsb25lSW1nID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LCUzQ3N2ZyUyMHdpZHRoJTNEJTIyMTAwJTIyJTIwaGVpZ2h0JTNEJTIyMTAwJTIyJTIwdmlld0JveCUzRCUyMjAlMjAwJTIwMTAwJTIwMTAwJTIyJTIwc3R5bGUlM0QlMjJmaWxsJTNBbm9uZSUzQnN0cm9rZSUzQWJsYWNrJTNCc3Ryb2tlLXdpZHRoJTNBMCUzQiUyMiUyMHhtbG5zJTNEJTIyaHR0cCUzQS8vd3d3LnczLm9yZy8yMDAwL3N2ZyUyMiUyMCUzRSUzQ3JlY3QlMjB4JTNEJTIyMCUyMiUyMHklM0QlMjIwJTIyJTIwd2lkdGglM0QlMjIxMDAlMjIlMjBoZWlnaHQlM0QlMjIxMDAlMjIlMjBzdHlsZSUzRCUyMmZpbGwlM0ElMjM4MzgzODMlMjIvJTNFJTIwJTNDL3N2ZyUzRSc7XG4gICAgICByZXR1cm4gKGltZ3MuaW5kZXhPZihjbG9uZUltZykgPiAtMSk7XG4gICAgfTtcblxuICAgIC8vIFJlbW92ZSBhIGJhY2tncm91bmQgaW1hZ2UgZnJvbSBnaXZlbiBub2Rlcy5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChub2RlcywgYmdPYmopIHtcbiAgICAgIGlmKCFub2RlcyB8fCBub2Rlcy5sZW5ndGggPT0gMCB8fCAhYmdPYmopXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIG9iaiA9IGJnT2JqW25vZGUuZGF0YSgnaWQnKV07XG4gICAgICAgIGlmKCFvYmopXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgdmFyIGltZ3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeFBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeVBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgd2lkdGhzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKS5zcGxpdChcIiBcIikgOiBbXTtcbiAgICAgICAgdmFyIGhlaWdodHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciBmaXRzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgb3BhY2l0aWVzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSA/IChcIlwiICsgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSkuc3BsaXQoXCIgXCIpIDogW107XG5cbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XG4gICAgICAgIGlmKHR5cGVvZiBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgICBpbmRleCA9IGltZ3MuaW5kZXhPZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXS5zcGxpdChcIiBcIilbMF0pO1xuICAgICAgICBlbHNlIGlmKEFycmF5LmlzQXJyYXkob2JqWydiYWNrZ3JvdW5kLWltYWdlJ10pKVxuICAgICAgICAgIGluZGV4ID0gaW1ncy5pbmRleE9mKG9ialsnYmFja2dyb3VuZC1pbWFnZSddWzBdKTtcblxuICAgICAgICBpZihpbmRleCA+IC0xKXtcbiAgICAgICAgICBpbWdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgZml0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIG9wYWNpdGllcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIHhQb3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICB5UG9zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgd2lkdGhzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgaGVpZ2h0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJywgaW1ncy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JywgeFBvcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JywgeVBvcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcsIHdpZHRocy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnLCBoZWlnaHRzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcsIGZpdHMuam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScsIG9wYWNpdGllcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIGJnT2JqWydmaXJzdFRpbWUnXSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnJldmVyc2VFZGdlID0gZnVuY3Rpb24oZWRnZSl7XG4gICAgICB2YXIgb2xkU291cmNlID0gZWRnZS5zb3VyY2UoKS5pZCgpO1xuICAgICAgdmFyIG9sZFRhcmdldCA9IGVkZ2UudGFyZ2V0KCkuaWQoKTtcbiAgICAgIHZhciBvbGRQb3J0U291cmNlID0gZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiKTtcbiAgICAgIHZhciBvbGRQb3J0VGFyZ2V0ID0gZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiKTtcbiAgICAgIHZhciBzZWdtZW50UG9pbnRzID0gZWRnZS5zZWdtZW50UG9pbnRzKCk7XG4gICAgICB2YXIgY29udHJvbFBvaW50cyA9IGVkZ2UuY29udHJvbFBvaW50cygpO1xuXG4gICAgICBlZGdlLmRhdGEoKS5zb3VyY2UgPSBvbGRUYXJnZXQ7XG4gICAgICBlZGdlLmRhdGEoKS50YXJnZXQgPSBvbGRTb3VyY2U7XG4gICAgICBlZGdlLmRhdGEoKS5wb3J0c291cmNlID0gb2xkUG9ydFRhcmdldDtcbiAgICAgIGVkZ2UuZGF0YSgpLnBvcnR0YXJnZXQgPSBvbGRQb3J0U291cmNlO1xuICAgICAgIGVkZ2UgPSBlZGdlLm1vdmUoe1xuICAgICAgICAgdGFyZ2V0OiBvbGRTb3VyY2UsXG4gICAgICAgICBzb3VyY2UgOiBvbGRUYXJnZXQgICAgICAgIFxuICAgICAgfSk7XG5cbiAgICAgIGlmKEFycmF5LmlzQXJyYXkoc2VnbWVudFBvaW50cykpe1xuICAgICAgICBzZWdtZW50UG9pbnRzLnJldmVyc2UoKTtcbiAgICAgICAgZWRnZS5kYXRhKCkuYmVuZFBvaW50UG9zaXRpb25zID0gc2VnbWVudFBvaW50cztcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShjb250cm9sUG9pbnRzKSkge1xuICAgICAgICAgIGNvbnRyb2xQb2ludHMucmV2ZXJzZSgpO1xuICAgICAgICAgIGVkZ2UuZGF0YSgpLmNvbnRyb2xQb2ludFBvc2l0aW9ucyA9IGNvbnRyb2xQb2ludHM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVkZ2VFZGl0aW5nID0gY3kuZWRnZUVkaXRpbmcoJ2dldCcpO1xuICAgICAgICBlZGdlRWRpdGluZy5pbml0QW5jaG9yUG9pbnRzKGVkZ2UpO1xuICAgICAgfVxuICAgIFxuXG4gICAgICByZXR1cm4gZWRnZTtcbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50VXRpbGl0aWVzRXh0ZW5kZXI7XG59O1xuIiwiLyogXG4gKiBVdGlsaXR5IGZpbGUgdG8gZ2V0IGFuZCBzZXQgdGhlIGxpYnJhcmllcyB0byB3aGljaCBzYmdudml6IGlzIGRlcGVuZGVudCBmcm9tIGFueSBmaWxlLlxuICovXG5cbnZhciBsaWJVdGlsaXRpZXMgPSBmdW5jdGlvbigpe1xufTtcblxubGliVXRpbGl0aWVzLnNldExpYnMgPSBmdW5jdGlvbihsaWJzKSB7XG4gIHRoaXMubGlicyA9IGxpYnM7XG59O1xuXG5saWJVdGlsaXRpZXMuZ2V0TGlicyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5saWJzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBsaWJVdGlsaXRpZXM7IiwidmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG5cbi8qXG4gKiBUaGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBkaXJlY3RseS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGVsZW1lbnRVdGlsaXRpZXMsIG9wdGlvbnMsIGN5LCBzYmdudml6SW5zdGFuY2U7XG5cbiAgZnVuY3Rpb24gbWFpblV0aWxpdGllcyAocGFyYW0pIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzID0gcGFyYW0uZWxlbWVudFV0aWxpdGllcztcbiAgICBvcHRpb25zID0gcGFyYW0ub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbiAgICBjeSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRDeSgpO1xuICAgIHNiZ252aXpJbnN0YW5jZSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRJbnN0YW5jZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIEFkZHMgYSBuZXcgbm9kZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24oeCwgeSAsIG5vZGVQYXJhbXMsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIG1hcCB0eXBlXG4gICAgaWYgKHR5cGVvZiBub2RlUGFyYW1zID09ICdvYmplY3QnKXtcbi8qIFxuICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSlcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKG5vZGVQYXJhbXMubGFuZ3VhZ2UpO1xuICAgICAgZWxzZSBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgIT0gbm9kZVBhcmFtcy5sYW5ndWFnZSlcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiVW5rbm93blwiKTsgKi9cbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgbm9kZVBhcmFtcywgaWQsIHBhcmVudCwgdmlzaWJpbGl0eSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBuZXdOb2RlIDoge1xuICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgeTogeSxcbiAgICAgICAgICBjbGFzczogbm9kZVBhcmFtcyxcbiAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgcGFyZW50OiBwYXJlbnQsXG4gICAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJpbGl0eVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkTm9kZVwiLCBwYXJhbSk7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIEFkZHMgYSBuZXcgZWRnZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgaGF2aW5nIHRoZSBnaXZlbiBzb3VyY2UgYW5kIHRhcmdldCBpZHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbihzb3VyY2UsIHRhcmdldCwgZWRnZVBhcmFtcywgaW52YWxpZEVkZ2VDYWxsYmFjaywgaWQsIHZpc2liaWxpdHkpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIG1hcCB0eXBlXG4gICAgaWYgKHR5cGVvZiBlZGdlUGFyYW1zID09ICdvYmplY3QnKXtcblxuICAgICAvKiAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSlcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKGVkZ2VQYXJhbXMubGFuZ3VhZ2UpO1xuICAgICAgZWxzZSBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgIT0gZWRnZVBhcmFtcy5sYW5ndWFnZSlcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiSHlicmlkQW55XCIpOyAqL1xuICAgIH1cbiAgICAvLyBHZXQgdGhlIHZhbGlkYXRpb24gcmVzdWx0XG4gICAgdmFyIGVkZ2VjbGFzcyA9IGVkZ2VQYXJhbXMuY2xhc3MgPyBlZGdlUGFyYW1zLmNsYXNzIDogZWRnZVBhcmFtcztcbiAgICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChzb3VyY2UpLCBjeS5nZXRFbGVtZW50QnlJZCh0YXJnZXQpKTtcblxuICAgIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdpbnZhbGlkJyBjYW5jZWwgdGhlIG9wZXJhdGlvblxuICAgIGlmICh2YWxpZGF0aW9uID09PSAnaW52YWxpZCcpIHtcbiAgICAgIGlmKHR5cGVvZiBpbnZhbGlkRWRnZUNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICBpbnZhbGlkRWRnZUNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ3JldmVyc2UnIHJldmVyc2UgdGhlIHNvdXJjZS10YXJnZXQgcGFpciBiZWZvcmUgY3JlYXRpbmcgdGhlIGVkZ2VcbiAgICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XG4gICAgICB2YXIgdGVtcCA9IHNvdXJjZTtcbiAgICAgIHNvdXJjZSA9IHRhcmdldDtcbiAgICAgIHRhcmdldCA9IHRlbXA7XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZSwgdGFyZ2V0LCBlZGdlUGFyYW1zLCBpZCwgdmlzaWJpbGl0eSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBuZXdFZGdlIDoge1xuICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgIGNsYXNzOiBlZGdlUGFyYW1zLFxuICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmlsaXR5XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciByZXN1bHQgPSBjeS51bmRvUmVkbygpLmRvKFwiYWRkRWRnZVwiLCBwYXJhbSk7XG4gICAgICByZXR1cm4gcmVzdWx0LmVsZXM7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIEFkZHMgYSBwcm9jZXNzIHdpdGggY29udmVuaWVudCBlZGdlcy4gRm9yIG1vcmUgaW5mb3JtYXRpb24gcGxlYXNlIHNlZSAnaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9uZXd0L2lzc3Vlcy85Jy5cbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMgPSBmdW5jdGlvbihfc291cmNlLCBfdGFyZ2V0LCBwcm9jZXNzVHlwZSkge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBzb3VyY2UgYW5kIHRhcmdldCBJRHMgYXJlIGdpdmVuIGdldCB0aGUgZWxlbWVudHMgYnkgSURzXG4gICAgdmFyIHNvdXJjZSA9IHR5cGVvZiBfc291cmNlID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9zb3VyY2UpIDogX3NvdXJjZTtcbiAgICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xuXG4gICAgLy8gSWYgc291cmNlIG9yIHRhcmdldCBkb2VzIG5vdCBoYXZlIGFuIEVQTiBjbGFzcyB0aGUgb3BlcmF0aW9uIGlzIG5vdCB2YWxpZFxuICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKHNvdXJjZSkgfHwgIWVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyh0YXJnZXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyhfc291cmNlLCBfdGFyZ2V0LCBwcm9jZXNzVHlwZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBzb3VyY2U6IF9zb3VyY2UsXG4gICAgICAgIHRhcmdldDogX3RhcmdldCxcbiAgICAgICAgcHJvY2Vzc1R5cGU6IHByb2Nlc3NUeXBlXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXNcIiwgcGFyYW0pO1xuICAgIH1cbiAgfTtcblxuICAvLyBjb252ZXJ0IGNvbGxhcHNlZCBjb21wb3VuZCBub2RlcyB0byBzaW1wbGUgbm9kZXNcbiAgLy8gYW5kIHVwZGF0ZSBwb3J0IHZhbHVlcyBvZiBwYXN0ZWQgbm9kZXMgYW5kIGVkZ2VzXG4gIHZhciBjbG9uZUNvbGxhcHNlZE5vZGVzQW5kUG9ydHMgPSBmdW5jdGlvbiAoZWxlc0JlZm9yZSl7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICB2YXIgZWxlc0FmdGVyID0gY3kuZWxlbWVudHMoKTtcbiAgICB2YXIgZWxlc0RpZmYgPSBlbGVzQWZ0ZXIuZGlmZihlbGVzQmVmb3JlKS5sZWZ0O1xuXG4gICAgLy8gc2hhbGxvdyBjb3B5IGNvbGxhcHNlZCBub2RlcyAtIGNvbGxhcHNlZCBjb21wb3VuZHMgYmVjb21lIHNpbXBsZSBub2Rlc1xuICAgIC8vIGRhdGEgcmVsYXRlZCB0byBjb2xsYXBzZWQgbm9kZXMgYXJlIHJlbW92ZWQgZnJvbSBnZW5lcmF0ZWQgY2xvbmVzXG4gICAgLy8gcmVsYXRlZCBpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9uZXd0L2lzc3Vlcy8xNDVcbiAgICB2YXIgY29sbGFwc2VkTm9kZXMgPSBlbGVzRGlmZi5maWx0ZXIoJ25vZGUuY3ktZXhwYW5kLWNvbGxhcHNlLWNvbGxhcHNlZC1ub2RlJyk7XG5cbiAgICBjb2xsYXBzZWROb2Rlcy5jb25uZWN0ZWRFZGdlcygpLnJlbW92ZSgpO1xuICAgIGNvbGxhcHNlZE5vZGVzLnJlbW92ZUNsYXNzKCdjeS1leHBhbmQtY29sbGFwc2UtY29sbGFwc2VkLW5vZGUnKTtcbiAgICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVEYXRhKCdjb2xsYXBzZWRDaGlsZHJlbicpO1xuICAgIGNvbGxhcHNlZE5vZGVzLnJlbW92ZURhdGEoJ3Bvc2l0aW9uLWJlZm9yZS1jb2xsYXBzZSBzaXplLWJlZm9yZS1jb2xsYXBzZScpO1xuICAgIGNvbGxhcHNlZE5vZGVzLnJlbW92ZURhdGEoJ2V4cGFuZGNvbGxhcHNlUmVuZGVyZWRDdWVTaXplIGV4cGFuZGNvbGxhcHNlUmVuZGVyZWRTdGFydFggZXhwYW5kY29sbGFwc2VSZW5kZXJlZFN0YXJ0WScpO1xuXG4gICAgLy8gY2xvbmluZyBwb3J0c1xuICAgIGVsZXNEaWZmLm5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbihfbm9kZSl7XG4gICAgICBpZihfbm9kZS5kYXRhKFwicG9ydHNcIikubGVuZ3RoID09IDIpe1xuICAgICAgICAgIHZhciBvbGRQb3J0TmFtZTAgPSBfbm9kZS5kYXRhKFwicG9ydHNcIilbMF0uaWQ7XG4gICAgICAgICAgdmFyIG9sZFBvcnROYW1lMSA9IF9ub2RlLmRhdGEoXCJwb3J0c1wiKVsxXS5pZDtcbiAgICAgICAgICBfbm9kZS5kYXRhKFwicG9ydHNcIilbMF0uaWQgPSBfbm9kZS5pZCgpICsgXCIuMVwiO1xuICAgICAgICAgIF9ub2RlLmRhdGEoXCJwb3J0c1wiKVsxXS5pZCA9IF9ub2RlLmlkKCkgKyBcIi4yXCI7XG5cbiAgICAgICAgICBfbm9kZS5vdXRnb2VycygpLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbihfZWRnZSl7XG4gICAgICAgICAgICBpZihfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiKSA9PSBvbGRQb3J0TmFtZTApe1xuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiLCBfbm9kZS5kYXRhKFwicG9ydHNcIilbMF0uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiKSA9PSBvbGRQb3J0TmFtZTEpe1xuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiLCBfbm9kZS5kYXRhKFwicG9ydHNcIilbMV0uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIiwgX25vZGUuaWQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgX25vZGUuaW5jb21lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xuICAgICAgICAgICAgaWYoX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIikgPT0gb2xkUG9ydE5hbWUwKXtcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIiwgX25vZGUuZGF0YShcInBvcnRzXCIpWzBdLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIikgPT0gb2xkUG9ydE5hbWUxKXtcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIiwgX25vZGUuZGF0YShcInBvcnRzXCIpWzFdLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIF9ub2RlLmlkKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgX25vZGUub3V0Z29lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xuICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIsIF9ub2RlLmlkKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgX25vZGUuaW5jb21lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xuICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIF9ub2RlLmlkKCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBlbGVzRGlmZi5zZWxlY3QoKTtcbiAgfVxuXG4gIC8qXG4gICAqIENsb25lIGdpdmVuIGVsZW1lbnRzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY2xvbmVFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVzLCBwYXN0ZUF0TW91c2VMb2MpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb3B5RWxlbWVudHMoZWxlcyk7XG5cbiAgICB0aGlzLnBhc3RlRWxlbWVudHMocGFzdGVBdE1vdXNlTG9jKTtcbiAgfTtcblxuICAvKlxuICAgKiBDb3B5IGdpdmVuIGVsZW1lbnRzIHRvIGNsaXBib2FyZC4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNvcHlFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgY3kuY2xpcGJvYXJkKCkuY29weShlbGVzKTtcbiAgfTtcblxuICAvKlxuICAgKiBQYXN0ZSB0aGUgZWxlbWVudHMgY29waWVkIHRvIGNsaXBib2FyZC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLnBhc3RlRWxlbWVudHMgPSBmdW5jdGlvbihwYXN0ZUF0TW91c2VMb2MpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGVsZXNCZWZvcmUgPSBjeS5lbGVtZW50cygpO1xuXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJwYXN0ZVwiLHtwYXN0ZUF0TW91c2VMb2M6IHBhc3RlQXRNb3VzZUxvY30pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGN5LmNsaXBib2FyZCgpLnBhc3RlKCk7XG4gICAgfVxuICAgIGNsb25lQ29sbGFwc2VkTm9kZXNBbmRQb3J0cyhlbGVzQmVmb3JlKTtcbiAgICBjeS5ub2RlcyhcIjpzZWxlY3RlZFwiKS5lbWl0KCdkYXRhJyk7XG4gIH07XG5cbiAgLypcbiAgICogQWxpZ25zIGdpdmVuIG5vZGVzIGluIGdpdmVuIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIG9yZGVyLlxuICAgKiBIb3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBwYXJhbWV0ZXJzIG1heSBiZSAnbm9uZScgb3IgdW5kZWZpbmVkLlxuICAgKiBhbGlnblRvIHBhcmFtZXRlciBpbmRpY2F0ZXMgdGhlIGxlYWRpbmcgbm9kZS5cbiAgICogUmVxdXJpcmVzIGN5dG9zY2FwZS1ncmlkLWd1aWRlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuYWxpZ24gPSBmdW5jdGlvbiAobm9kZXMsIGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWxpZ25cIiwge1xuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGhvcml6b250YWw6IGhvcml6b250YWwsXG4gICAgICAgIHZlcnRpY2FsOiB2ZXJ0aWNhbCxcbiAgICAgICAgYWxpZ25UbzogYWxpZ25Ub1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGVzLmFsaWduKGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKTtcbiAgICB9XG5cbiAgICBpZihjeS5lZGdlcyhcIjpzZWxlY3RlZFwiKS5sZW5ndGggPT0gMSApIHtcbiAgICAgIGN5LmVkZ2VzKCkudW5zZWxlY3QoKTsgICAgICBcbiAgICB9XG4gICAgXG4gIH07XG5cbiAgLypcbiAgICogQ3JlYXRlIGNvbXBvdW5kIGZvciBnaXZlbiBub2Rlcy4gY29tcG91bmRUeXBlIG1heSBiZSAnY29tcGxleCcgb3IgJ2NvbXBhcnRtZW50Jy5cbiAgICogVGhpcyBtZXRob2QgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKF9ub2RlcywgY29tcG91bmRUeXBlKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBub2RlcyA9IF9ub2RlcztcbiAgICAvKlxuICAgICAqIEVsZW1pbmF0ZSB0aGUgbm9kZXMgd2hpY2ggY2Fubm90IGhhdmUgYSBwYXJlbnQgd2l0aCBnaXZlbiBjb21wb3VuZCB0eXBlXG4gICAgICovXG4gICAgbm9kZXMgPSBfbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgICBpZih0eXBlb2YgZWxlbWVudCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBlbGVtZW50ID0gaTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNiZ25jbGFzcyA9IGVsZW1lbnQuZGF0YShcImNsYXNzXCIpO1xuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIGNvbXBvdW5kVHlwZSwgZWxlbWVudCk7XG4gICAgfSk7XG5cbiAgICBub2RlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcblxuICAgIC8vIEFsbCBlbGVtZW50cyBzaG91bGQgaGF2ZSB0aGUgc2FtZSBwYXJlbnQgYW5kIHRoZSBjb21tb24gcGFyZW50IHNob3VsZCBub3QgYmUgYSAnY29tcGxleCdcbiAgICAvLyBpZiBjb21wb3VuZFR5cGUgaXMgJ2NvbXBhcnRlbnQnXG4gICAgLy8gYmVjYXVzZSB0aGUgb2xkIGNvbW1vbiBwYXJlbnQgd2lsbCBiZSB0aGUgcGFyZW50IG9mIHRoZSBuZXcgY29tcGFydG1lbnQgYWZ0ZXIgdGhpcyBvcGVyYXRpb24gYW5kXG4gICAgLy8gJ2NvbXBsZXhlcycgY2Fubm90IGluY2x1ZGUgJ2NvbXBhcnRtZW50cydcbiAgICBpZiAobm9kZXMubGVuZ3RoID09IDAgfHwgIWVsZW1lbnRVdGlsaXRpZXMuYWxsSGF2ZVRoZVNhbWVQYXJlbnQobm9kZXMpXG4gICAgICAgICAgICB8fCAoIChjb21wb3VuZFR5cGUgPT09ICdjb21wYXJ0bWVudCcgfHwgY29tcG91bmRUeXBlID09ICdzdWJtYXAnKSAmJiBub2Rlcy5wYXJlbnQoKS5kYXRhKCdjbGFzcycpXG4gICAgICAgICAgICAmJiBub2Rlcy5wYXJlbnQoKS5kYXRhKCdjbGFzcycpLnN0YXJ0c1dpdGgoJ2NvbXBsZXgnKSApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGN5LnVuZG9SZWRvKCkpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgY29tcG91bmRUeXBlOiBjb21wb3VuZFR5cGUsXG4gICAgICAgIG5vZGVzVG9NYWtlQ29tcG91bmQ6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2RlcywgY29tcG91bmRUeXBlKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24gYW5kIGNoZWNrcyBpZiB0aGUgb3BlcmF0aW9uIGlzIHZhbGlkLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgX25ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXdQYXJlbnQgPSB0eXBlb2YgX25ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfbmV3UGFyZW50KSA6IF9uZXdQYXJlbnQ7XG4gICAgLy8gTmV3IHBhcmVudCBpcyBzdXBwb3NlZCB0byBiZSBvbmUgb2YgdGhlIHJvb3QsIGEgY29tcGxleCBvciBhIGNvbXBhcnRtZW50XG4gICAgaWYgKG5ld1BhcmVudCAmJiAhbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKS5zdGFydHNXaXRoKFwiY29tcGxleFwiKSAmJiBuZXdQYXJlbnQuZGF0YShcImNsYXNzXCIpICE9IFwiY29tcGFydG1lbnRcIlxuICAgICAgICAgICAgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcInN1Ym1hcFwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8qXG4gICAgICogRWxlbWluYXRlIHRoZSBub2RlcyB3aGljaCBjYW5ub3QgaGF2ZSB0aGUgbmV3UGFyZW50IGFzIHRoZWlyIHBhcmVudFxuICAgICAqL1xuICAgIG5vZGVzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgICBpZih0eXBlb2YgZWxlbWVudCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBlbGVtZW50ID0gaTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNiZ25jbGFzcyA9IGVsZW1lbnQuZGF0YShcImNsYXNzXCIpO1xuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIG5ld1BhcmVudCwgZWxlbWVudCk7XG4gICAgfSk7XG5cbiAgICAvLyBEaXNjYXJkIHRoZSBub2RlcyB3aG9zZSBwYXJlbnQgaXMgYWxyZWFkeSBuZXdQYXJlbnQuXG4gICAgLy8gRGlzY2FyZCB0aGUgbmV3UGFyZW50IGl0c2VsZiBpZiBpdCBpcyBhbW9uZyB0aGUgbm9kZXNcbiAgICBub2RlcyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlLCBpKSB7XG4gICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGVsZSA9IGk7XG4gICAgICB9XG5cbiAgICAgIC8vIERpc2NhcmQgdGhlIG5ld1BhcmVudCBpZiBpdCBpcyBhbW9uZyB0aGUgbm9kZXNcbiAgICAgIGlmIChuZXdQYXJlbnQgJiYgZWxlLmlkKCkgPT09IG5ld1BhcmVudC5pZCgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIERpc2NhcmQgdGhlIG5vZGVzIHdob3NlIHBhcmVudCBpcyBhbHJlYWR5IG5ld1BhcmVudFxuICAgICAgaWYgKCFuZXdQYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPSBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPT0gbmV3UGFyZW50LmlkKCk7XG4gICAgfSk7XG5cbiAgICAvLyBJZiBzb21lIG5vZGVzIGFyZSBhbmNlc3RvciBvZiBuZXcgcGFyZW50IGVsZW1pbmF0ZSB0aGVtXG4gICAgaWYgKG5ld1BhcmVudCkge1xuICAgICAgbm9kZXMgPSBub2Rlcy5kaWZmZXJlbmNlKG5ld1BhcmVudC5hbmNlc3RvcnMoKSk7XG4gICAgfVxuXG4gICAgLy8gSWYgYWxsIG5vZGVzIGFyZSBlbGVtaW5hdGVkIHJldHVybiBkaXJlY3RseVxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBKdXN0IG1vdmUgdGhlIHRvcCBtb3N0IG5vZGVzXG4gICAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XG5cbiAgICB2YXIgcGFyZW50SWQgPSBuZXdQYXJlbnQgPyBuZXdQYXJlbnQuaWQoKSA6IG51bGw7XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBmaXJzdFRpbWU6IHRydWUsXG4gICAgICAgIHBhcmVudERhdGE6IHBhcmVudElkLCAvLyBJdCBrZWVwcyB0aGUgbmV3UGFyZW50SWQgKEp1c3QgYW4gaWQgZm9yIGVhY2ggbm9kZXMgZm9yIHRoZSBmaXJzdCB0aW1lKVxuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIHBvc0RpZmZYOiBwb3NEaWZmWCxcbiAgICAgICAgcG9zRGlmZlk6IHBvc0RpZmZZLFxuICAgICAgICAvLyBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBjaGFuZ2VQYXJlbnQgZnVuY3Rpb24gY2FsbGVkIGlzIG5vdCBmcm9tIGVsZW1lbnRVdGlsaXRpZXNcbiAgICAgICAgLy8gYnV0IGZyb20gdGhlIHVuZG9SZWRvIGV4dGVuc2lvbiBkaXJlY3RseSwgc28gbWFpbnRhaW5pbmcgcG9pbnRlciBpcyBub3QgYXV0b21hdGljYWxseSBkb25lLlxuICAgICAgICBjYWxsYmFjazogZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXJcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VQYXJlbnRcIiwgcGFyYW0pOyAvLyBUaGlzIGFjdGlvbiBpcyByZWdpc3RlcmVkIGJ5IHVuZG9SZWRvIGV4dGVuc2lvblxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50KG5vZGVzLCBwYXJlbnRJZCwgcG9zRGlmZlgsIHBvc0RpZmZZKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogQ3JlYXRlcyBhbiBhY3RpdmF0aW9uIHJlYWN0aW9uIHdpdGggZ2l2ZW4gcGFyYW1ldGVycy4gUmVxdWlyZXMgY29zZS1iaWxrZW50IGxheW91dCB0byB0aWxlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzIGluY2x1ZGVkXG4gICAqIGluIHRoZSBjb21wbGV4LiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgdGhlIHNhbWUgZnVuY3Rpb24gaW4gZWxlbWVudFV0aWxpdGllc1xuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jcmVhdGVUcmFuc2xhdGlvblJlYWN0aW9uID0gZnVuY3Rpb24gKG1SbmFOYW1lLCBwcm90ZWluTmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCBlZGdlTGVuZ3RoKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUcmFuc2xhdGlvblJlYWN0aW9uKG1SbmFOYW1lLCBwcm90ZWluTmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCBlZGdlTGVuZ3RoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG1SbmFOYW1lOiBtUm5hTmFtZSxcbiAgICAgICAgcHJvdGVpbk5hbWU6IHByb3RlaW5OYW1lLFxuICAgICAgICBwcm9jZXNzUG9zaXRpb246IHByb2Nlc3NQb3NpdGlvbixcbiAgICAgICAgZWRnZUxlbmd0aDogZWRnZUxlbmd0aFxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZVRyYW5zbGF0aW9uUmVhY3Rpb25cIiwgcGFyYW0pO1xuICB9fTtcblxuICAvKlxuICAgKiBDcmVhdGVzIGFuIGFjdGl2YXRpb24gcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAgICogaW4gdGhlIGNvbXBsZXguIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSB0aGUgc2FtZSBmdW5jdGlvbiBpbiBlbGVtZW50VXRpbGl0aWVzXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNyZWF0ZVRyYW5zY3JpcHRpb25SZWFjdGlvbiA9IGZ1bmN0aW9uIChnZW5lTmFtZSwgbVJuYU5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgZWRnZUxlbmd0aCkge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVHJhbnNjcmlwdGlvblJlYWN0aW9uKGdlbmVOYW1lLCBtUm5hTmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCBlZGdlTGVuZ3RoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGdlbmVOYW1lOiBnZW5lTmFtZSxcbiAgICAgICAgbVJuYU5hbWU6IG1SbmFOYW1lLFxuICAgICAgICBwcm9jZXNzUG9zaXRpb246IHByb2Nlc3NQb3NpdGlvbixcbiAgICAgICAgZWRnZUxlbmd0aDogZWRnZUxlbmd0aFxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZVRyYW5zY3JpcHRpb25SZWFjdGlvblwiLCBwYXJhbSk7XG4gIH19O1xuXG4gIG1haW5VdGlsaXRpZXMuY3JlYXRlQ29udmVyc2lvbiA9IGZ1bmN0aW9uKG1hY3JvbW9sZWN1bGUsIHJlZ3VsYXRvciwgcmVndWxhdG9yTXVsdGltZXIsIG9yaWVudGF0aW9uLCBpbnB1dEluZm9ib3hMYWJlbHMsIG91dHB1dEluZm9ib3hMYWJlbHMpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbnZlcnNpb24obWFjcm9tb2xlY3VsZSwgcmVndWxhdG9yLCByZWd1bGF0b3JNdWx0aW1lciwgb3JpZW50YXRpb24sIGlucHV0SW5mb2JveExhYmVscywgb3V0cHV0SW5mb2JveExhYmVscyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29uc3QgcGFyYW0gPSB7XG4gICAgICAgIG1hY3JvbW9sZWN1bGU6IG1hY3JvbW9sZWN1bGUsXG4gICAgICAgIHJlZ3VsYXRvcjogcmVndWxhdG9yLFxuICAgICAgICByZWd1bGF0b3JNdWx0aW1lcjogcmVndWxhdG9yTXVsdGltZXIsXG4gICAgICAgIG9yaWVudGF0aW9uOiBvcmllbnRhdGlvbixcbiAgICAgICAgaW5wdXRJbmZvYm94TGFiZWxzOiBpbnB1dEluZm9ib3hMYWJlbHMsXG4gICAgICAgIG91dHB1dEluZm9ib3hMYWJlbHM6IG91dHB1dEluZm9ib3hMYWJlbHNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVDb252ZXJzaW9uXCIsIHBhcmFtKTtcbiAgICB9ICBcbiAgfTtcblxuICBtYWluVXRpbGl0aWVzLmNyZWF0ZU1ldGFib2xpY1JlYWN0aW9uID0gZnVuY3Rpb24oaW5wdXRzLCBvdXRwdXRzLCByZXZlcnNpYmxlLCByZWd1bGF0b3IsIHJlZ3VsYXRvck11bHRpbWVyLCBvcmllbnRhdGlvbikge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlTWV0YWJvbGljUmVhY3Rpb24oaW5wdXRzLCBvdXRwdXRzLCByZXZlcnNpYmxlLCByZWd1bGF0b3IsIHJlZ3VsYXRvck11bHRpbWVyLCBvcmllbnRhdGlvbik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29uc3QgcGFyYW0gPSB7XG4gICAgICAgIGlucHV0czogaW5wdXRzLFxuICAgICAgICBvdXRwdXRzOiBvdXRwdXRzLFxuICAgICAgICByZXZlcnNpYmxlOiByZXZlcnNpYmxlLFxuICAgICAgICByZWd1bGF0b3I6IHJlZ3VsYXRvcixcbiAgICAgICAgcmVndWxhdG9yTXVsdGltZXI6IHJlZ3VsYXRvck11bHRpbWVyLFxuICAgICAgICBvcmllbnRhdGlvbjogb3JpZW50YXRpb25cbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVNZXRhYm9saWNSZWFjdGlvblwiLCBwYXJhbSk7XG4gICAgfSAgXG4gIH07XG5cbiAgLypcbiAgICogQ3JlYXRlcyBhbiBhY3RpdmF0aW9uIHJlYWN0aW9uIHdpdGggZ2l2ZW4gcGFyYW1ldGVycy4gUmVxdWlyZXMgY29zZS1iaWxrZW50IGxheW91dCB0byB0aWxlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzIGluY2x1ZGVkXG4gICAqIGluIHRoZSBjb21wbGV4LiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgdGhlIHNhbWUgZnVuY3Rpb24gaW4gZWxlbWVudFV0aWxpdGllc1xuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jcmVhdGVNZXRhYm9saWNDYXRhbHl0aWNBY3Rpdml0eSA9IGZ1bmN0aW9uIChpbnB1dE5vZGVMaXN0LCBvdXRwdXROb2RlTGlzdCwgY2F0YWx5c3ROYW1lLCBjYXRhbHlzdFR5cGUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCkge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlTWV0YWJvbGljQ2F0YWx5dGljQWN0aXZpdHkoaW5wdXROb2RlTGlzdCwgb3V0cHV0Tm9kZUxpc3QsIGNhdGFseXN0TmFtZSwgY2F0YWx5c3RUeXBlLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgaW5wdXROb2RlTGlzdDogaW5wdXROb2RlTGlzdCxcbiAgICAgICAgb3V0cHV0Tm9kZUxpc3Q6IG91dHB1dE5vZGVMaXN0LFxuICAgICAgICBjYXRhbHlzdE5hbWU6IGNhdGFseXN0TmFtZSxcbiAgICAgICAgY2F0YWx5c3RUeXBlOiBjYXRhbHlzdFR5cGUsXG4gICAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxuICAgICAgICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCxcbiAgICAgICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxuICAgICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoLFxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZU1ldGFib2xpY0NhdGFseXRpY0FjdGl2aXR5XCIsIHBhcmFtKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogQ3JlYXRlcyBhbiBhY3RpdmF0aW9uIHJlYWN0aW9uIHdpdGggZ2l2ZW4gcGFyYW1ldGVycy4gUmVxdWlyZXMgY29zZS1iaWxrZW50IGxheW91dCB0byB0aWxlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzIGluY2x1ZGVkXG4gICAqIGluIHRoZSBjb21wbGV4LiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgdGhlIHNhbWUgZnVuY3Rpb24gaW4gZWxlbWVudFV0aWxpdGllc1xuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jcmVhdGVBY3RpdmF0aW9uUmVhY3Rpb24gPSBmdW5jdGlvbiAocHJvdGVpbk5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgZWRnZUxlbmd0aCwgcmV2ZXJzZSkge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQWN0aXZhdGlvblJlYWN0aW9uKHByb3RlaW5OYW1lLCBwcm9jZXNzUG9zaXRpb24sIGVkZ2VMZW5ndGgsIHJldmVyc2UpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgcHJvdGVpbk5hbWU6IHByb3RlaW5OYW1lLFxuICAgICAgICBwcm9jZXNzUG9zaXRpb246IHByb2Nlc3NQb3NpdGlvbixcbiAgICAgICAgZWRnZUxlbmd0aDogZWRnZUxlbmd0aCxcbiAgICAgICAgcmV2ZXJzZTogcmV2ZXJzZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZUFjdGl2YXRpb25SZWFjdGlvblwiLCBwYXJhbSk7XG4gIH19O1xuXG4gIC8qXG4gICAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxuICAgKiBpbiB0aGUgY29tcGxleC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIHRoZSBzYW1lIGZ1bmN0aW9uIGluIGVsZW1lbnRVdGlsaXRpZXNcbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoLCBsYXlvdXRQYXJhbSkge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09IFwicmV2ZXJzaWJsZVwiKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShcIkh5YnJpZEFueVwiKTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbih0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoLCBsYXlvdXRQYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICB0ZW1wbGF0ZVR5cGU6IHRlbXBsYXRlVHlwZSxcbiAgICAgICAgbWFjcm9tb2xlY3VsZUxpc3Q6IG1hY3JvbW9sZWN1bGVMaXN0LFxuICAgICAgICBjb21wbGV4TmFtZTogY29tcGxleE5hbWUsXG4gICAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxuICAgICAgICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCxcbiAgICAgICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxuICAgICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoLFxuICAgICAgICBsYXlvdXRQYXJhbTogbGF5b3V0UGFyYW1cbiAgICAgIH07XG4gICAgICBpZiAodGVtcGxhdGVUeXBlID09PSBcInJldmVyc2libGVcIikge1xuICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6XCJjaGFuZ2VNYXBUeXBlXCIsIHBhcmFtOiB7bWFwVHlwZTogXCJIeWJyaWRBbnlcIiwgY2FsbGJhY2s6IGZ1bmN0aW9uKCl7fSB9fSk7XG4gICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTpcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgcGFyYW06IHBhcmFtfSk7XG4gICAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJiYXRjaFwiLCBhY3Rpb25zKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCBwYXJhbSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIFJlc2l6ZSBnaXZlbiBub2RlcyBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHkgb25lIG9mIHdpZHRoIG9yIGhlaWdodCBzaG91bGQgbm90IGJlIHNldC5cbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMucmVzaXplTm9kZXMgPSBmdW5jdGlvbihub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8sIHByZXNlcnZlUmVsYXRpdmVQb3MpIHtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICB1c2VBc3BlY3RSYXRpbzogdXNlQXNwZWN0UmF0aW8sXG4gICAgICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWUsXG4gICAgICAgIHByZXNlcnZlUmVsYXRpdmVQb3M6IHByZXNlcnZlUmVsYXRpdmVQb3NcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZXNpemVOb2Rlc1wiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2Rlcyhub2Rlcywgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8pO1xuICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgICB9XG5cblxuICB9O1xuXG4gICAgLypcbiAgICAgKiBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuXG4gICAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICAgKi9cbiAgICBtYWluVXRpbGl0aWVzLnJlc2l6ZU5vZGVzVG9Db250ZW50ID0gZnVuY3Rpb24obm9kZXMsIHVzZUFzcGVjdFJhdGlvKSB7XG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBcbiAgICAgICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgICAgICB2YXIgd2lkdGggPSBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbldpZHRoKG5vZGUpO1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluSGVpZ2h0KG5vZGUpO1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInJlc2l6ZU5vZGVzXCIsIHBhcmFtOiB7XG4gICAgICAgICAgICAgICAgbm9kZXM6IG5vZGUsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHVzZUFzcGVjdFJhdGlvOiB1c2VBc3BlY3RSYXRpbyxcbiAgICAgICAgICAgICAgICBwZXJmb3JtT3BlcmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgICAgIHByZXNlcnZlUmVsYXRpdmVQb3M6IHRydWVcbiAgICAgICAgICAgIH19KTtcblxuICAgICAgICAgICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gc3RhdGVBbmRJbmZvcy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICAgICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgICAgICAgICAgbG9jYXRpb25zOiBbXCJ0b3BcIixcInJpZ2h0XCIsXCJib3R0b21cIixcImxlZnRcIl1cbiAgICAgICAgICAgICAgfTsgICAgICAgICAgXG4gICAgICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTpcImZpdFVuaXRzXCIscGFyYW0gOiBwYXJhbX0pXG4gICAgICAgICAgICAgfVxuICBcblxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIFxuICAgICAgICAgXG4gICAgICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImJhdGNoXCIsIGFjdGlvbnMpO1xuICAgICAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gICAgICAgICAgcmV0dXJuIGFjdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgICAgICAgICB2YXIgd2lkdGggPSBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbldpZHRoKG5vZGUpO1xuICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5IZWlnaHQobm9kZSk7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKG5vZGUsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvLCB0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgICB9O1xuXG4gIC8qXG4gICAqIENoYW5nZXMgdGhlIGxhYmVsIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gbGFiZWwuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uKG5vZGVzLCBsYWJlbCkge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIG5vZGVzLmRhdGEoJ2xhYmVsJywgbGFiZWwpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZU5vZGVMYWJlbFwiLCBwYXJhbSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICAvKlxuICAgKiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIGZvciBnaXZlbiBub2RlcyB1c2UgdGhlIGdpdmVuIGZvbnQgZGF0YS5cbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbihlbGVzLCBkYXRhKSB7XG4gICAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgZWxlczogZWxlcyxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgcGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICAvKlxuICAgKiBDaGFuZ2Ugc3RhdGUgdmFsdWUgb3IgdW5pdCBvZiBpbmZvcm1hdGlvbiBib3ggb2YgZ2l2ZW4gbm9kZXMgd2l0aCBnaXZlbiBpbmRleC5cbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHBhcmFtZXRlcnMgc2VlIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3hcbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgbm9kZXM6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgLy8gQWRkIGEgbmV3IHN0YXRlIG9yIGluZm8gYm94IHRvIGdpdmVuIG5vZGVzLlxuICAvLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxuICAvLyBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICBtYWluVXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIG9iaikge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBvYmo6IG9iaixcbiAgICAgICAgbm9kZXM6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgLy8gUmVtb3ZlIHRoZSBzdGF0ZSBvciBpbmZvIGJveGVzIG9mIHRoZSBnaXZlbiBub2RlcyBhdCBnaXZlbiBpbmRleC5cbiAgLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgbWFpblV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBpbmRleCkge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3gobm9kZXMsIHtpbmRleDogaW5kZXh9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGxvY2F0aW9uT2JqOiB7aW5kZXg6IGluZGV4fSxcbiAgICAgICAgbm9kZXM6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cblxuICAvL0FycmFuZ2UgaW5mb3JtYXRpb24gYm94ZXNcbiAgLy9JZiBmb3JjZSBjaGVjayBpcyB0cnVlLCBpdCByZWFycmFuZ2VzIGFsbCBpbmZvcm1hdGlvbiBib3hlc1xuICBtYWluVXRpbGl0aWVzLmZpdFVuaXRzID0gZnVuY3Rpb24gKG5vZGUsIGxvY2F0aW9ucykge1xuICAgIGlmIChub2RlLmRhdGEoJ2F1eHVuaXRsYXlvdXRzJykgPT09IHVuZGVmaW5lZCB8fCBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykubGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGxvY2F0aW9ucyA9PT0gdW5kZWZpbmVkIHx8IGxvY2F0aW9ucy5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5maXRVbml0cyhub2RlLCBsb2NhdGlvbnMpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJmaXRVbml0c1wiLCBwYXJhbSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICAvKlxuICAgKiBTZXQgbXVsdGltZXIgc3RhdHVzIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uKG5vZGVzLCBzdGF0dXMpIHtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwic2V0TXVsdGltZXJTdGF0dXNcIiwgcGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICAvKipcbiAgICogUmVkcmF3IGNsb25lIG1hcmtlcnMgb24gZ2l2ZW4gbm9kZXMgd2l0aG91dCBjb25zaWRlcmluZyB1bmRvLlxuICAgKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9uZXd0L2lzc3Vlcy81NzQgXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLnJlZHJhd0Nsb25lTWFya2VycyA9IGZ1bmN0aW9uKG5vZGVzKSB7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2RlcywgdHJ1ZSk7XG4gIH1cblxuICAvKlxuICAgKiBTZXQgY2xvbmUgbWFya2VyIHN0YXR1cyBvZiBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uKG5vZGVzLCBzdGF0dXMpIHtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgcGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICAvKlxuICAgKiBDaGFuZ2Ugc3R5bGUvY3NzIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAgICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNoYW5nZUNzcyA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XG4gICAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyhlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBlbGVzOiBlbGVzLFxuICAgICAgICB2YWx1ZU1hcDogdmFsdWVNYXAsXG4gICAgICAgIG5hbWU6IG5hbWVcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VDc3NcIiwgcGFyYW0pO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgLypcbiAgICogQ2hhbmdlIGRhdGEgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxuICAgKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlRGF0YSA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XG4gICAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWxlcywgbmFtZSwgdmFsdWVNYXApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgZWxlczogZWxlcyxcbiAgICAgICAgdmFsdWVNYXA6IHZhbHVlTWFwLFxuICAgICAgICBuYW1lOiBuYW1lXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRGF0YVwiLCBwYXJhbSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICBtYWluVXRpbGl0aWVzLnVwZGF0ZVNldEZpZWxkID0gZnVuY3Rpb24oZWxlLCBmaWVsZE5hbWUsIHRvRGVsZXRlLCB0b0FkZCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlbGUsIGZpZWxkTmFtZSwgdG9EZWxldGUsIHRvQWRkLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBlbGUsXG4gICAgICAgIGZpZWxkTmFtZSxcbiAgICAgICAgdG9EZWxldGUsXG4gICAgICAgIHRvQWRkLFxuICAgICAgICBjYWxsYmFja1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInVwZGF0ZVNldEZpZWxkXCIsIHBhcmFtKTtcbiAgICB9XG4gIH07XG5cbiAgbWFpblV0aWxpdGllcy5zZXREZWZhdWx0UHJvcGVydHkgPSBmdW5jdGlvbiggX2NsYXNzLCBuYW1lLCB2YWx1ZSApIHtcbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwcm9wTWFwID0ge307XG4gICAgICBwcm9wTWFwWyBuYW1lIF0gPSB2YWx1ZTtcblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXREZWZhdWx0UHJvcGVydGllcyhfY2xhc3MsIHByb3BNYXApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgY2xhc3M6IF9jbGFzcyxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdmFsdWVcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXREZWZhdWx0UHJvcGVydHlcIiwgcGFyYW0pO1xuICAgIH1cbiAgfTtcblxuICBtYWluVXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hTdHlsZSA9IGZ1bmN0aW9uKCBub2RlLCBpbmRleCwgbmV3UHJvcHMgKSB7XG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hTdHlsZSggbm9kZSwgaW5kZXgsIG5ld1Byb3BzICk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIG5ld1Byb3BzOiBuZXdQcm9wc1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInVwZGF0ZUluZm9ib3hTdHlsZVwiLCBwYXJhbSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICBtYWluVXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hPYmogPSBmdW5jdGlvbiggbm9kZSwgaW5kZXgsIG5ld1Byb3BzICkge1xuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVJbmZvYm94T2JqKCBub2RlLCBpbmRleCwgbmV3UHJvcHMgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgbmV3UHJvcHM6IG5ld1Byb3BzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwidXBkYXRlSW5mb2JveE9ialwiLCBwYXJhbSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICBtYWluVXRpbGl0aWVzLmRlbGV0ZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAoZWxlcywgbGF5b3V0cGFyYW0pIHtcbiAgICB2YXIgbm9kZXMgPSBlbGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG5cbiAgICB2YXIgYWxsTm9kZXMgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpO1xuICAgIHZhciBub2Rlc1RvS2VlcCA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kUmVtYWluaW5nTm9kZXMobm9kZXMsIGFsbE5vZGVzKTtcbiAgICB2YXIgbm9kZXNUb1JlbW92ZSA9IGFsbE5vZGVzLm5vdChub2Rlc1RvS2VlcCk7XG5cbiAgICBpZiAobm9kZXNUb1JlbW92ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlQW5kUGVyZm9ybUxheW91dChub2Rlc1RvUmVtb3ZlLCBsYXlvdXRwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgICAgICBlbGVzOiBub2Rlc1RvUmVtb3ZlLFxuICAgICAgICAgICAgbGF5b3V0cGFyYW06IGxheW91dHBhcmFtLFxuICAgICAgICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgICAgIH07XG5cbiAgICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImRlbGV0ZUFuZFBlcmZvcm1MYXlvdXRcIiwgcGFyYW0pO1xuICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBIaWRlcyBnaXZlbiBlbGVzICh0aGUgb25lcyB3aGljaCBhcmUgc2VsZWN0ZWQpIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXG4gICAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmhpZGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcbiAgICAgIHZhciBub2RlcyA9IGVsZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcblxuICAgICAgdmFyIGFsbE5vZGVzID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKTtcbiAgICAgIHZhciBub2Rlc1RvU2hvdyA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kUmVtYWluaW5nTm9kZXMobm9kZXMsIGFsbE5vZGVzKTtcbiAgICAgIHZhciBub2Rlc1RvSGlkZSA9IGFsbE5vZGVzLm5vdChub2Rlc1RvU2hvdyk7XG5cbiAgICAgIGlmIChub2Rlc1RvSGlkZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuXG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xuICAgICAgICAgIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmhpZGVBbmRQZXJmb3JtTGF5b3V0KG5vZGVzVG9IaWRlLCBsYXlvdXRwYXJhbSk7XG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xuICAgICAgICAgIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgICAgICAgZWxlczogbm9kZXNUb0hpZGUsXG4gICAgICAgICAgICAgIGxheW91dHBhcmFtOiBsYXlvdXRwYXJhbSxcbiAgICAgICAgICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKCk7XG4gICAgICAgICAgdXIuYWN0aW9uKFwidGhpY2tlbkJvcmRlclwiLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlciwgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIpO1xuICAgICAgICAgIHVyLmFjdGlvbihcInRoaW5Cb3JkZXJcIiwgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyKTtcblxuICAgICAgICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCkuaW50ZXJzZWN0aW9uKG5vZGVzVG9IaWRlKTtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpbkJvcmRlclwiLCBwYXJhbTogbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3J9KTtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwiaGlkZUFuZFBlcmZvcm1MYXlvdXRcIiwgcGFyYW06IHBhcmFtfSk7XG4gICAgICAgICAgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBub2Rlc1RvSGlkZS5uZWlnaGJvcmhvb2QoXCI6dmlzaWJsZVwiKS5ub2RlcygpLmRpZmZlcmVuY2Uobm9kZXNUb0hpZGUpLmRpZmZlcmVuY2UoY3kubm9kZXMoXCJbdGhpY2tCb3JkZXJdXCIpKTtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpY2tlbkJvcmRlclwiLCBwYXJhbTogbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3J9KTtcbiAgICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiYmF0Y2hcIiwgYWN0aW9ucyk7XG4gICAgICB9XG4gIH07XG5cbiAgLypcbiAgICogU2hvd3MgYWxsIGVsZW1lbnRzICh0aGUgb25lcyB3aGljaCBhcmUgaGlkZGVuIGlmIGFueSkgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAgICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuc2hvd0FsbEFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihsYXlvdXRwYXJhbSkge1xuICAgIHZhciBoaWRkZW5FbGVzID0gY3kuZWxlbWVudHMoJzpoaWRkZW4nKTtcbiAgICBpZiAoaGlkZGVuRWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XG4gICAgICBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcihub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcik7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KGhpZGRlbkVsZXMsIGxheW91dHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGVsZXM6IGhpZGRlbkVsZXMsXG4gICAgICAgIGxheW91dHBhcmFtOiBsYXlvdXRwYXJhbSxcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgICB9O1xuXG4gICAgICB2YXIgdXIgPSBjeS51bmRvUmVkbygpO1xuICAgICAgdXIuYWN0aW9uKFwidGhpY2tlbkJvcmRlclwiLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlciwgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIpO1xuICAgICAgdXIuYWN0aW9uKFwidGhpbkJvcmRlclwiLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlciwgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIpO1xuXG4gICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kubm9kZXMoXCJbdGhpY2tCb3JkZXJdXCIpO1xuICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInRoaW5Cb3JkZXJcIiwgcGFyYW06IG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yfSk7XG4gICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgcGFyYW06IHBhcmFtfSk7XG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYmF0Y2hcIiwgYWN0aW9ucyk7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIFVuaGlkZSBnaXZlbiBlbGVzICh0aGUgb25lcyB3aGljaCBhcmUgaGlkZGVuIGlmIGFueSkgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAgICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihtYWluRWxlLCBlbGVzLCBsYXlvdXRwYXJhbSkge1xuICAgICAgdmFyIGhpZGRlbkVsZXMgPSBlbGVzLmZpbHRlcignOmhpZGRlbicpO1xuICAgICAgaWYgKGhpZGRlbkVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbWFpblV0aWxpdGllcy5jbG9zZVVwRWxlbWVudHMobWFpbkVsZSwgaGlkZGVuRWxlcy5ub2RlcygpKTtcbiAgICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcbiAgICAgICAgICBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcihub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcik7XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChoaWRkZW5FbGVzLCBsYXlvdXRwYXJhbSk7XG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xuICAgICAgICAgIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgICAgICAgZWxlczogaGlkZGVuRWxlcyxcbiAgICAgICAgICAgICAgbGF5b3V0cGFyYW06IGxheW91dHBhcmFtLFxuICAgICAgICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIHVyID0gY3kudW5kb1JlZG8oKTtcbiAgICAgICAgICB1ci5hY3Rpb24oXCJ0aGlja2VuQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcik7XG4gICAgICAgICAgdXIuYWN0aW9uKFwidGhpbkJvcmRlclwiLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlciwgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIpO1xuXG4gICAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgICB2YXIgbm9kZXNUb1RoaW5Cb3JkZXIgPSAoaGlkZGVuRWxlcy5uZWlnaGJvcmhvb2QoXCI6dmlzaWJsZVwiKS5ub2RlcyhcIlt0aGlja0JvcmRlcl1cIikpXG4gICAgICAgICAgICAgICAgICAuZGlmZmVyZW5jZShjeS5lZGdlcyhcIjpoaWRkZW5cIikuZGlmZmVyZW5jZShoaWRkZW5FbGVzLmVkZ2VzKCkudW5pb24oaGlkZGVuRWxlcy5ub2RlcygpLmNvbm5lY3RlZEVkZ2VzKCkpKS5jb25uZWN0ZWROb2RlcygpKTtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpbkJvcmRlclwiLCBwYXJhbTogbm9kZXNUb1RoaW5Cb3JkZXJ9KTtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgcGFyYW06IHBhcmFtfSk7XG4gICAgICAgICAgdmFyIG5vZGVzVG9UaGlja2VuQm9yZGVyID0gaGlkZGVuRWxlcy5ub2RlcygpLmVkZ2VzV2l0aChjeS5ub2RlcyhcIjpoaWRkZW5cIikuZGlmZmVyZW5jZShoaWRkZW5FbGVzLm5vZGVzKCkpKVxuICBcdCAgICAgICAgICAgIC5jb25uZWN0ZWROb2RlcygpLmludGVyc2VjdGlvbihoaWRkZW5FbGVzLm5vZGVzKCkpO1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGlja2VuQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1RvVGhpY2tlbkJvcmRlcn0pO1xuICAgICAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJiYXRjaFwiLCBhY3Rpb25zKTtcbiAgICAgIH1cbiAgfTtcblxuICAvKlxuICAqIFRha2VzIHRoZSBoaWRkZW4gZWxlbWVudHMgY2xvc2UgdG8gdGhlIG5vZGVzIHdob3NlIG5laWdoYm9ycyB3aWxsIGJlIHNob3duXG4gICogKi9cbiAgbWFpblV0aWxpdGllcy5jbG9zZVVwRWxlbWVudHMgPSBmdW5jdGlvbihtYWluRWxlLCBoaWRkZW5FbGVzKSB7XG4gICAgICB2YXIgbGVmdFggPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgdmFyIHJpZ2h0WCA9IE51bWJlci5NSU5fVkFMVUU7XG4gICAgICB2YXIgdG9wWSA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICB2YXIgYm90dG9tWSA9IE51bWJlci5NSU5fVkFMVUU7XG4gICAgICAvLyBDaGVjayB0aGUgeCBhbmQgeSBsaW1pdHMgb2YgYWxsIGhpZGRlbiBlbGVtZW50cyBhbmQgc3RvcmUgdGhlbSBpbiB0aGUgdmFyaWFibGVzIGFib3ZlXG4gICAgICBoaWRkZW5FbGVzLmZvckVhY2goZnVuY3Rpb24oIGVsZSApe1xuICAgICAgICAgIGlmIChlbGUuZGF0YSgnY2xhc3MnKSAhPSAnY29tcGFydG1lbnQnICYmICBlbGUuZGF0YSgnY2xhc3MnKSAhPSAnY29tcGxleCcpXG4gICAgICAgICAge1xuICAgICAgICAgICAgICB2YXIgaGFsZldpZHRoID0gZWxlLm91dGVyV2lkdGgoKS8yO1xuICAgICAgICAgICAgICB2YXIgaGFsZkhlaWdodCA9IGVsZS5vdXRlckhlaWdodCgpLzI7XG4gICAgICAgICAgICAgIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpIC0gaGFsZldpZHRoIDwgbGVmdFgpXG4gICAgICAgICAgICAgICAgICBsZWZ0WCA9IGVsZS5wb3NpdGlvbihcInhcIikgLSBoYWxmV2lkdGg7XG4gICAgICAgICAgICAgIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpICsgaGFsZldpZHRoID4gcmlnaHRYKVxuICAgICAgICAgICAgICAgICAgcmlnaHRYID0gZWxlLnBvc2l0aW9uKFwieFwiKSArIGhhbGZXaWR0aDtcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInlcIikgLSBoYWxmSGVpZ2h0IDwgdG9wWSlcbiAgICAgICAgICAgICAgICAgIHRvcFkgPSBlbGUucG9zaXRpb24oXCJ5XCIpIC0gaGFsZkhlaWdodDtcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInlcIikgKyBoYWxmSGVpZ2h0ID4gdG9wWSlcbiAgICAgICAgICAgICAgICAgIGJvdHRvbVkgPSBlbGUucG9zaXRpb24oXCJ5XCIpICsgaGFsZkhlaWdodDtcbiAgICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy9UaGUgY29vcmRpbmF0ZXMgb2YgdGhlIG9sZCBjZW50ZXIgY29udGFpbmluZyB0aGUgaGlkZGVuIG5vZGVzXG4gICAgICB2YXIgb2xkQ2VudGVyWCA9IChsZWZ0WCArIHJpZ2h0WCkvMjtcbiAgICAgIHZhciBvbGRDZW50ZXJZID0gKHRvcFkgKyBib3R0b21ZKS8yO1xuXG4gICAgICAvL0hlcmUgd2UgY2FsY3VsYXRlIHR3byBwYXJhbWV0ZXJzIHdoaWNoIGRlZmluZSB0aGUgYXJlYSBpbiB3aGljaCB0aGUgaGlkZGVuIGVsZW1lbnRzIGFyZSBwbGFjZWQgaW5pdGlhbGx5XG4gICAgICB2YXIgbWluSG9yaXpvbnRhbFBhcmFtID0gbWFpbkVsZS5vdXRlcldpZHRoKCkvMiArIChyaWdodFggLSBsZWZ0WCkvMjtcbiAgICAgIHZhciBtYXhIb3Jpem9udGFsUGFyYW0gPSBtYWluRWxlLm91dGVyV2lkdGgoKSArIChyaWdodFggLSBsZWZ0WCkvMjtcbiAgICAgIHZhciBtaW5WZXJ0aWNhbFBhcmFtID0gbWFpbkVsZS5vdXRlckhlaWdodCgpLzIgKyAoYm90dG9tWSAtIHRvcFkpLzI7XG4gICAgICB2YXIgbWF4VmVydGljYWxQYXJhbSA9IG1haW5FbGUub3V0ZXJIZWlnaHQoKSArIChib3R0b21ZIC0gdG9wWSkvMjtcblxuICAgICAgLy9RdWFkcmFudHMgaXMgYW4gb2JqZWN0IG9mIHRoZSBmb3JtIHtmaXJzdDpcIm9idGFpbmVkXCIsIHNlY29uZDpcImZyZWVcIiwgdGhpcmQ6XCJmcmVlXCIsIGZvdXJ0aDpcIm9idGFpbmVkXCJ9XG4gICAgICAvLyB3aGljaCBob2xkcyB3aGljaCBxdWFkcmFudCBhcmUgZnJlZSAodGhhdCdzIHdoZXJlIGhpZGRlbiBub2RlcyB3aWxsIGJlIGJyb3VnaHQpXG4gICAgICB2YXIgcXVhZHJhbnRzID0gbWFpblV0aWxpdGllcy5jaGVja09jY3VwaWVkUXVhZHJhbnRzKG1haW5FbGUsIGhpZGRlbkVsZXMpO1xuICAgICAgdmFyIGZyZWVRdWFkcmFudHMgPSBbXTtcbiAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHF1YWRyYW50cykge1xuICAgICAgICAgIGlmIChxdWFkcmFudHNbcHJvcGVydHldID09PSBcImZyZWVcIilcbiAgICAgICAgICAgICAgZnJlZVF1YWRyYW50cy5wdXNoKHByb3BlcnR5KTtcbiAgICAgIH1cblxuICAgICAgLy9DYW4gdGFrZSB2YWx1ZXMgMSBhbmQgLTEgYW5kIGFyZSB1c2VkIHRvIHBsYWNlIHRoZSBoaWRkZW4gbm9kZXMgaW4gdGhlIHJhbmRvbSBxdWFkcmFudFxuICAgICAgdmFyIGhvcml6b250YWxNdWx0O1xuICAgICAgdmFyIHZlcnRpY2FsTXVsdDtcbiAgICAgIGlmIChmcmVlUXVhZHJhbnRzLmxlbmd0aCA+IDApXG4gICAgICB7XG4gICAgICAgIGlmIChmcmVlUXVhZHJhbnRzLmxlbmd0aCA9PT0gMylcbiAgICAgICAge1xuICAgICAgICAgIGlmIChmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmaXJzdCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3NlY29uZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3RoaXJkJykpXG4gICAgICAgICAge1xuICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAtMTtcbiAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IC0xO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmaXJzdCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3NlY29uZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZvdXJ0aCcpKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gMTtcbiAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IC0xO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmaXJzdCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3RoaXJkJykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnZm91cnRoJykpXG4gICAgICAgICAge1xuICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAxO1xuICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnc2Vjb25kJykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygndGhpcmQnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmb3VydGgnKSlcbiAgICAgICAgICB7XG4gICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IC0xO1xuICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgLy9SYW5kb21seSBwaWNrcyBvbmUgcXVhZHJhbnQgZnJvbSB0aGUgZnJlZSBxdWFkcmFudHNcbiAgICAgICAgICB2YXIgcmFuZG9tUXVhZHJhbnQgPSBmcmVlUXVhZHJhbnRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpmcmVlUXVhZHJhbnRzLmxlbmd0aCldO1xuXG4gICAgICAgICAgaWYgKHJhbmRvbVF1YWRyYW50ID09PSBcImZpcnN0XCIpIHtcbiAgICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAxO1xuICAgICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAtMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAocmFuZG9tUXVhZHJhbnQgPT09IFwic2Vjb25kXCIpIHtcbiAgICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAtMTtcbiAgICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gLTE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKHJhbmRvbVF1YWRyYW50ID09PSBcInRoaXJkXCIpIHtcbiAgICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAtMTtcbiAgICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAocmFuZG9tUXVhZHJhbnQgPT09IFwiZm91cnRoXCIpIHtcbiAgICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAxO1xuICAgICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAge1xuICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gMDtcbiAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAwO1xuICAgICAgfVxuICAgICAgLy8gSWYgdGhlIGhvcml6b250YWxNdWx0IGlzIDAgaXQgbWVhbnMgdGhhdCBubyBxdWFkcmFudCBpcyBmcmVlLCBzbyB3ZSByYW5kb21seSBjaG9vc2UgYSBxdWFkcmFudFxuICAgICAgdmFyIGhvcml6b250YWxQYXJhbSA9IG1haW5VdGlsaXRpZXMuZ2VuZXJhdGVSYW5kb20obWluSG9yaXpvbnRhbFBhcmFtLG1heEhvcml6b250YWxQYXJhbSxob3Jpem9udGFsTXVsdCk7XG4gICAgICB2YXIgdmVydGljYWxQYXJhbSA9IG1haW5VdGlsaXRpZXMuZ2VuZXJhdGVSYW5kb20obWluVmVydGljYWxQYXJhbSxtYXhWZXJ0aWNhbFBhcmFtLHZlcnRpY2FsTXVsdCk7XG5cbiAgICAgIC8vVGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBjZW50ZXIgd2hlcmUgdGhlIGhpZGRlbiBub2RlcyB3aWxsIGJlIHRyYW5zZmVyZWRcbiAgICAgIHZhciBuZXdDZW50ZXJYID0gbWFpbkVsZS5wb3NpdGlvbihcInhcIikgKyBob3Jpem9udGFsUGFyYW07XG4gICAgICB2YXIgbmV3Q2VudGVyWSA9IG1haW5FbGUucG9zaXRpb24oXCJ5XCIpICsgdmVydGljYWxQYXJhbTtcblxuICAgICAgdmFyIHhkaWZmID0gbmV3Q2VudGVyWCAtIG9sZENlbnRlclg7XG4gICAgICB2YXIgeWRpZmYgPSBuZXdDZW50ZXJZIC0gb2xkQ2VudGVyWTtcblxuICAgICAgLy9DaGFuZ2UgdGhlIHBvc2l0aW9uIG9mIGhpZGRlbiBlbGVtZW50c1xuICAgICAgaGlkZGVuRWxlcy5mb3JFYWNoKGZ1bmN0aW9uKCBlbGUgKXtcbiAgICAgICAgICB2YXIgbmV3eCA9IGVsZS5wb3NpdGlvbihcInhcIikgKyB4ZGlmZjtcbiAgICAgICAgICB2YXIgbmV3eSA9IGVsZS5wb3NpdGlvbihcInlcIikgKyB5ZGlmZjtcbiAgICAgICAgICBlbGUucG9zaXRpb24oXCJ4XCIsIG5ld3gpO1xuICAgICAgICAgIGVsZS5wb3NpdGlvbihcInlcIixuZXd5KTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIC8qXG4gICAqIEdlbmVyYXRlcyBhIG51bWJlciBiZXR3ZWVuIDIgbnIgYW5kIG11bHRpbXBsaWVzIGl0IHdpdGggMSBvciAtMVxuICAgKiAqL1xuICBtYWluVXRpbGl0aWVzLmdlbmVyYXRlUmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgsIG11bHQpIHtcbiAgICAgIHZhciB2YWwgPSBbLTEsMV07XG4gICAgICBpZiAobXVsdCA9PT0gMClcbiAgICAgICAgICBtdWx0ID0gdmFsW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSp2YWwubGVuZ3RoKV07XG4gICAgICByZXR1cm4gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW4pICogbXVsdDtcbiAgfTtcblxuICAvKlxuICAgKiBUaGlzIGZ1bmN0aW9uIG1ha2VzIHN1cmUgdGhhdCB0aGUgcmFuZG9tIG51bWJlciBsaWVzIGluIGZyZWUgcXVhZHJhbnRcbiAgICogKi9cbiAgbWFpblV0aWxpdGllcy5jaGVja09jY3VwaWVkUXVhZHJhbnRzID0gZnVuY3Rpb24obWFpbkVsZSwgaGlkZGVuRWxlcykge1xuICAgICAgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpID09ICdQRCcpXG4gICAgICB7XG4gICAgICAgIHZhciB2aXNpYmxlTmVpZ2hib3JFbGVzID0gbWFpbkVsZS5uZWlnaGJvcmhvb2QoKS5kaWZmZXJlbmNlKGhpZGRlbkVsZXMpLm5vZGVzKCk7XG4gICAgICAgIHZhciB2aXNpYmxlTmVpZ2hib3JzT2ZOZWlnaGJvcnMgPSB2aXNpYmxlTmVpZ2hib3JFbGVzLm5laWdoYm9yaG9vZCgpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcykuZGlmZmVyZW5jZShtYWluRWxlKS5ub2RlcygpO1xuICAgICAgICB2YXIgdmlzaWJsZUVsZXMgPSB2aXNpYmxlTmVpZ2hib3JFbGVzLnVuaW9uKHZpc2libGVOZWlnaGJvcnNPZk5laWdoYm9ycyk7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICAgIHZhciB2aXNpYmxlRWxlcyA9IG1haW5FbGUubmVpZ2hib3Job29kKCkuZGlmZmVyZW5jZShoaWRkZW5FbGVzKS5ub2RlcygpO1xuICAgICAgdmFyIG9jY3VwaWVkUXVhZHJhbnRzID0ge2ZpcnN0OlwiZnJlZVwiLCBzZWNvbmQ6XCJmcmVlXCIsIHRoaXJkOlwiZnJlZVwiLCBmb3VydGg6XCJmcmVlXCJ9O1xuXG4gICAgICB2aXNpYmxlRWxlcy5mb3JFYWNoKGZ1bmN0aW9uKCBlbGUgKXtcbiAgICAgICAgICBpZiAoZWxlLmRhdGEoJ2NsYXNzJykgIT0gJ2NvbXBhcnRtZW50JyAmJiAgZWxlLmRhdGEoJ2NsYXNzJykgIT0gJ2NvbXBsZXgnKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgPCBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSAmJiBlbGUucG9zaXRpb24oXCJ5XCIpIDwgbWFpbkVsZS5wb3NpdGlvbihcInlcIikpXG4gICAgICAgICAgICAgICAgICBvY2N1cGllZFF1YWRyYW50cy5zZWNvbmQgPSBcIm9jY3VwaWVkXCI7XG4gICAgICAgICAgICAgIGVsc2UgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgPiBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSAmJiBlbGUucG9zaXRpb24oXCJ5XCIpIDwgbWFpbkVsZS5wb3NpdGlvbihcInlcIikpXG4gICAgICAgICAgICAgICAgICBvY2N1cGllZFF1YWRyYW50cy5maXJzdCA9IFwib2NjdXBpZWRcIjtcbiAgICAgICAgICAgICAgZWxzZSBpZiAoZWxlLnBvc2l0aW9uKFwieFwiKSA8IG1haW5FbGUucG9zaXRpb24oXCJ4XCIpICYmIGVsZS5wb3NpdGlvbihcInlcIikgPiBtYWluRWxlLnBvc2l0aW9uKFwieVwiKSlcbiAgICAgICAgICAgICAgICAgIG9jY3VwaWVkUXVhZHJhbnRzLnRoaXJkID0gXCJvY2N1cGllZFwiO1xuICAgICAgICAgICAgICBlbHNlIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpID4gbWFpbkVsZS5wb3NpdGlvbihcInhcIikgJiYgZWxlLnBvc2l0aW9uKFwieVwiKSA+IG1haW5FbGUucG9zaXRpb24oXCJ5XCIpKVxuICAgICAgICAgICAgICAgICAgb2NjdXBpZWRRdWFkcmFudHMuZm91cnRoID0gXCJvY2N1cGllZFwiO1xuICAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9jY3VwaWVkUXVhZHJhbnRzO1xuICB9O1xuXG4gIC8vIE92ZXJyaWRlcyBoaWdobGlnaHRQcm9jZXNzZXMgZnJvbSBTQkdOVklaIC0gZG8gbm90IGhpZ2hsaWdodCBhbnkgbm9kZXMgd2hlbiB0aGUgbWFwIHR5cGUgaXMgQUZcbiAgbWFpblV0aWxpdGllcy5oaWdobGlnaHRQcm9jZXNzZXMgPSBmdW5jdGlvbihfbm9kZXMpIHtcbiAgICBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gXCJBRlwiKVxuICAgICAgcmV0dXJuO1xuICAgIHNiZ252aXpJbnN0YW5jZS5oaWdobGlnaHRQcm9jZXNzZXMoX25vZGVzKTtcbiAgfTtcblxuICAvKipcbiAgICogUmVzZXRzIG1hcCB0eXBlIHRvIHVuZGVmaW5lZFxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5yZXNldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzZXRNYXBUeXBlKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIHJldHVybiA6IG1hcCB0eXBlXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmdldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKTtcbiAgfTtcblxuICBtYWluVXRpbGl0aWVzLmFkZEJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uKG5vZGVzLCBiZ09iaiwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCl7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCB8fCAhYmdPYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBiZ09ialsnZmlyc3RUaW1lJ10gPSB0cnVlO1xuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGJnT2JqOiBiZ09iaixcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICB1cGRhdGVJbmZvOiB1cGRhdGVJbmZvLFxuICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2U6IHByb21wdEludmFsaWRJbWFnZSxcbiAgICAgICAgdmFsaWRhdGVVUkw6IHZhbGlkYXRlVVJMLFxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZEJhY2tncm91bmRJbWFnZVwiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIGJnT2JqLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9XG5cbiAgbWFpblV0aWxpdGllcy5yZW1vdmVCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbihub2RlcywgYmdPYmope1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDAgfHwgIWJnT2JqKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYmdPYmpbJ2ZpcnN0VGltZSddID0gdHJ1ZTtcbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBiZ09iajogYmdPYmosXG4gICAgICAgIG5vZGVzOiBub2Rlc1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInJlbW92ZUJhY2tncm91bmRJbWFnZVwiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIGJnT2JqKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9XG5cbiAgbWFpblV0aWxpdGllcy51cGRhdGVCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbihub2RlcywgYmdPYmope1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDAgfHwgIWJnT2JqKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgYmdPYmo6IGJnT2JqLFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJ1cGRhdGVCYWNrZ3JvdW5kSW1hZ2VcIiwgcGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlQmFja2dyb3VuZEltYWdlKG5vZGVzLCBiZ09iaik7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfVxuXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24obm9kZXMsIG9sZEltZywgbmV3SW1nLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKXtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwIHx8ICFvbGRJbWcgfHwgIW5ld0ltZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG9sZEltZzogb2xkSW1nLFxuICAgICAgICBuZXdJbWc6IG5ld0ltZyxcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBmaXJzdFRpbWU6IHRydWUsXG4gICAgICAgIHVwZGF0ZUluZm86IHVwZGF0ZUluZm8sXG4gICAgICAgIHByb21wdEludmFsaWRJbWFnZTogcHJvbXB0SW52YWxpZEltYWdlLFxuICAgICAgICB2YWxpZGF0ZVVSTDogdmFsaWRhdGVVUkxcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VCYWNrZ3JvdW5kSW1hZ2VcIiwgcGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQmFja2dyb3VuZEltYWdlKG5vZGVzLCBvbGRJbWcsIG5ld0ltZywgdHJ1ZSwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfVxuXG4gIHJldHVybiBtYWluVXRpbGl0aWVzO1xufTtcbiIsIi8qXG4gKiAgRXh0ZW5kIGRlZmF1bHQgb3B0aW9ucyBhbmQgZ2V0IGN1cnJlbnQgb3B0aW9ucyBieSB1c2luZyB0aGlzIGZpbGVcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGRlZmF1bHRzID0ge1xuICAgIC8vIFRoZSBwYXRoIG9mIGNvcmUgbGlicmFyeSBpbWFnZXMgd2hlbiBzYmdudml6IGlzIHJlcXVpcmVkIGZyb20gbnBtIGFuZCB0aGUgaW5kZXggaHRtbFxuICAgIC8vIGZpbGUgYW5kIG5vZGVfbW9kdWxlcyBhcmUgdW5kZXIgdGhlIHNhbWUgZm9sZGVyIHRoZW4gdXNpbmcgdGhlIGRlZmF1bHQgdmFsdWUgaXMgZmluZVxuICAgIGltZ1BhdGg6ICdub2RlX21vZHVsZXMvc2JnbnZpei9zcmMvaW1nJyxcbiAgICAvLyBXaGV0aGVyIHRvIGZpdCBsYWJlbHMgdG8gbm9kZXNcbiAgICBmaXRMYWJlbHNUb05vZGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICBmaXRMYWJlbHNUb0luZm9ib3hlczogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgLy8gZHluYW1pYyBsYWJlbCBzaXplIGl0IG1heSBiZSAnc21hbGwnLCAncmVndWxhcicsICdsYXJnZSdcbiAgICBkeW5hbWljTGFiZWxTaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJ3JlZ3VsYXInO1xuICAgIH0sXG4gICAgLy8gV2hldGhlciB0byBpbmZlciBuZXN0aW5nIG9uIGxvYWQgXG4gICAgaW5mZXJOZXN0aW5nT25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvLyBwZXJjZW50YWdlIHVzZWQgdG8gY2FsY3VsYXRlIGNvbXBvdW5kIHBhZGRpbmdzXG4gICAgY29tcG91bmRQYWRkaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gMTA7XG4gICAgfSxcbiAgICAvLyBUaGUgc2VsZWN0b3Igb2YgdGhlIGNvbXBvbmVudCBjb250YWluaW5nIHRoZSBzYmduIG5ldHdvcmtcbiAgICBuZXR3b3JrQ29udGFpbmVyU2VsZWN0b3I6ICcjc2Jnbi1uZXR3b3JrLWNvbnRhaW5lcicsXG4gICAgLy8gV2hldGhlciB0aGUgYWN0aW9ucyBhcmUgdW5kb2FibGUsIHJlcXVpcmVzIGN5dG9zY2FwZS11bmRvLXJlZG8gZXh0ZW5zaW9uXG4gICAgdW5kb2FibGU6IHRydWUsXG4gICAgLy8gV2hldGhlciB0byBoYXZlIHVuZG9hYmxlIGRyYWcgZmVhdHVyZSBpbiB1bmRvL3JlZG8gZXh0ZW5zaW9uLiBUaGlzIG9wdGlvbnMgd2lsbCBiZSBwYXNzZWQgdG8gdW5kby9yZWRvIGV4dGVuc2lvblxuICAgIHVuZG9hYmxlRHJhZzogdHJ1ZVxuICB9O1xuXG4gIHZhciBvcHRpb25VdGlsaXRpZXMgPSBmdW5jdGlvbiAoKSB7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIHRoZSBkZWZhdWx0cyBvcHRpb25zIHdpdGggdGhlIHVzZXIgb3B0aW9uc1xuICBvcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xuICAgICAgcmVzdWx0W3Byb3BdID0gZGVmYXVsdHNbcHJvcF07XG4gICAgfVxuXG4gICAgZm9yICh2YXIgcHJvcCBpbiBvcHRpb25zKSB7XG4gICAgICByZXN1bHRbcHJvcF0gPSBvcHRpb25zW3Byb3BdO1xuICAgIH1cblxuICAgIG9wdGlvblV0aWxpdGllcy5vcHRpb25zID0gcmVzdWx0O1xuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH07XG5cbiAgb3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG9wdGlvblV0aWxpdGllcy5vcHRpb25zO1xuICB9O1xuXG4gIHJldHVybiBvcHRpb25VdGlsaXRpZXM7XG59O1xuIiwidmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG52YXIgJCA9IGxpYnMualF1ZXJ5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMsIG9wdGlvbnMsIGN5O1xuXG4gIHZhciByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSBwYXJhbS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbiAgICBvcHRpb25zID0gcGFyYW0ub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbiAgICBjeSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRDeSgpO1xuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIHVuZG8tcmVkbyBpbnN0YW5jZVxuICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKHtcbiAgICAgIHVuZG9hYmxlRHJhZzogb3B0aW9ucy51bmRvYWJsZURyYWdcbiAgICB9KTtcblxuICAgIC8vIHJlZ2lzdGVyIGFkZCByZW1vdmUgYWN0aW9uc1xuICAgIHVyLmFjdGlvbihcImFkZE5vZGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NpbXBsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XG4gICAgdXIuYWN0aW9uKFwiYWRkRWRnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRFZGdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgICB1ci5hY3Rpb24oXCJhZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlRWxlc1NtYXJ0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTbWFydCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xuICAgIHVyLmFjdGlvbihcImNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyk7XG5cbiAgICAvLyByZWdpc3RlciBnZW5lcmFsIGFjdGlvbnNcbiAgICB1ci5hY3Rpb24oXCJyZXNpemVOb2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMpO1xuICAgIHVyLmFjdGlvbihcImNoYW5nZU5vZGVMYWJlbFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCk7XG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlRGF0YVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhKTtcbiAgICB1ci5hY3Rpb24oXCJ1cGRhdGVTZXRGaWVsZFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVTZXRGaWVsZCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlU2V0RmllbGQpO1xuICAgIHVyLmFjdGlvbihcImNoYW5nZUNzc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcyk7XG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlQmVuZFBvaW50c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCZW5kUG9pbnRzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCZW5kUG9pbnRzKTtcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VGb250UHJvcGVydGllc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMpO1xuICAgIHVyLmFjdGlvbihcInNob3dBbmRQZXJmb3JtTGF5b3V0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNob3dBbmRQZXJmb3JtTGF5b3V0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvU2hvd0FuZFBlcmZvcm1MYXlvdXQpO1xuICAgIHVyLmFjdGlvbihcImhpZGVBbmRQZXJmb3JtTGF5b3V0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmhpZGVBbmRQZXJmb3JtTGF5b3V0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvSGlkZUFuZFBlcmZvcm1MYXlvdXQpO1xuICAgIHVyLmFjdGlvbihcImRlbGV0ZUFuZFBlcmZvcm1MYXlvdXRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlQW5kUGVyZm9ybUxheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb0RlbGV0ZUFuZFBlcmZvcm1MYXlvdXQpO1xuICAgIHVyLmFjdGlvbihcImFwcGx5U0lGVG9wb2xvZ3lHcm91cGluZ1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hcHBseVNJRlRvcG9sb2d5R3JvdXBpbmcsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFwcGx5U0lGVG9wb2xvZ3lHcm91cGluZyk7XG5cbiAgICAvLyByZWdpc3RlciBTQkdOIGFjdGlvbnNcbiAgICB1ci5hY3Rpb24oXCJhZGRTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3gpO1xuICAgIHVyLmFjdGlvbihcImNoYW5nZVN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCk7XG4gICAgdXIuYWN0aW9uKFwic2V0TXVsdGltZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzKTtcbiAgICB1ci5hY3Rpb24oXCJzZXRDbG9uZU1hcmtlclN0YXR1c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMpO1xuICAgIHVyLmFjdGlvbihcInJlbW92ZVN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCk7XG4gICAgdXIuYWN0aW9uKFwiZml0VW5pdHNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZml0VW5pdHMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVVbml0cyk7XG4gICAgdXIuYWN0aW9uKFwiYWRkQmFja2dyb3VuZEltYWdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEJhY2tncm91bmRJbWFnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlQmFja2dyb3VuZEltYWdlKTtcbiAgICB1ci5hY3Rpb24oXCJyZW1vdmVCYWNrZ3JvdW5kSW1hZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlQmFja2dyb3VuZEltYWdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRCYWNrZ3JvdW5kSW1hZ2UpO1xuICAgIHVyLmFjdGlvbihcInVwZGF0ZUJhY2tncm91bmRJbWFnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVCYWNrZ3JvdW5kSW1hZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUJhY2tncm91bmRJbWFnZSk7XG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlQmFja2dyb3VuZEltYWdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJhY2tncm91bmRJbWFnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmFja2dyb3VuZEltYWdlKTtcbiAgICB1ci5hY3Rpb24oXCJ1cGRhdGVJbmZvYm94U3R5bGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlSW5mb2JveFN0eWxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94U3R5bGUpO1xuICAgIHVyLmFjdGlvbihcInVwZGF0ZUluZm9ib3hPYmpcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlSW5mb2JveE9iaiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlSW5mb2JveE9iaik7XG5cbiAgICAvLyByZWdpc3RlciBlYXN5IGNyZWF0aW9uIGFjdGlvbnNcbiAgICB1ci5hY3Rpb24oXCJjcmVhdGVUZW1wbGF0ZVJlYWN0aW9uXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICAgIHVyLmFjdGlvbihcImNyZWF0ZUFjdGl2YXRpb25SZWFjdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVBY3RpdmF0aW9uUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICAgIHVyLmFjdGlvbihcImNyZWF0ZU1ldGFib2xpY0NhdGFseXRpY0FjdGl2aXR5XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZU1ldGFib2xpY0NhdGFseXRpY0FjdGl2aXR5LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgICB1ci5hY3Rpb24oXCJjcmVhdGVNZXRhYm9saWNSZWFjdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVNZXRhYm9saWNSZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gICAgdXIuYWN0aW9uKFwiY3JlYXRlQ29udmVyc2lvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb252ZXJzaW9uLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgICB1ci5hY3Rpb24oXCJjcmVhdGVUcmFuc2NyaXB0aW9uUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVHJhbnNjcmlwdGlvblJlYWN0aW9uLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgICB1ci5hY3Rpb24oXCJjcmVhdGVUcmFuc2xhdGlvblJlYWN0aW9uXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRyYW5zbGF0aW9uUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICAgIHVyLmFjdGlvbihcInNldERlZmF1bHRQcm9wZXJ0eVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHksIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSk7XG4gICAgdXIuYWN0aW9uKFwiY29udmVydEludG9SZXZlcnNpYmxlUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY29udmVydEludG9SZXZlcnNpYmxlUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNvbnZlcnRJbnRvUmV2ZXJzaWJsZVJlYWN0aW9uKTtcblxuICAgIHVyLmFjdGlvbihcIm1vdmVFZGdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLm1vdmVFZGdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5tb3ZlRWRnZSk7XG4gICAgdXIuYWN0aW9uKFwiZml4RXJyb3JcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZml4RXJyb3IsdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5maXhFcnJvcik7XG4gICAgdXIuYWN0aW9uKFwiY2xvbmVIaWdoRGVncmVlTm9kZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jbG9uZUhpZ2hEZWdyZWVOb2RlLHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuQ2xvbmVIaWdoRGVncmVlTm9kZSk7XG5cbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VNYXBUeXBlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU1hcFR5cGUsdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTWFwVHlwZSk7XG4gICAgdXIuYWN0aW9uKFwic2V0Q29tcG91bmRQYWRkaW5nXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENvbXBvdW5kUGFkZGluZywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q29tcG91bmRQYWRkaW5nKTtcblxuICB9O1xuXG4gIHJldHVybiByZWdpc3RlclVuZG9SZWRvQWN0aW9ucztcbn07XG4iLCJ2YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGluc3RhbmNlO1xuXG4gIGZ1bmN0aW9uIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcyAob3B0aW9ucykge1xuXG4gICAgaW5zdGFuY2UgPSBsaWJzLnNiZ252aXoob3B0aW9ucyk7XG5cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKCkuZ2V0Q3koKTtcbiAgfVxuXG4gIHJldHVybiBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXM7XG59O1xuIiwidmFyIGlzRXF1YWwgPSByZXF1aXJlKCdsb2Rhc2guaXNlcXVhbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXG4gIHZhciBjeSwgZWxlbWVudFV0aWxpdGllcztcbiAgdmFyIGdyb3VwQ29tcG91bmRUeXBlLCBtZXRhRWRnZUlkZW50aWZpZXIsIGxvY2tHcmFwaFRvcG9sb2d5LCBzaG91bGRBcHBseTtcblxuICB2YXIgREVGQVVMVF9HUk9VUF9DT01QT1VORF9UWVBFID0gJ3RvcG9sb2d5IGdyb3VwJztcbiAgdmFyIEVER0VfU1RZTEVfTkFNRVMgPSBbICdsaW5lLWNvbG9yJywgJ3dpZHRoJyBdO1xuXG4gIGZ1bmN0aW9uIHRvcG9sb2d5R3JvdXBpbmcoIHBhcmFtLCBwcm9wcyApIHtcbiAgICBjeSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRDeSgpXG4gICAgZWxlbWVudFV0aWxpdGllcyA9IHBhcmFtLmVsZW1lbnRVdGlsaXRpZXM7XG5cbiAgICBncm91cENvbXBvdW5kVHlwZSA9IHByb3BzLmdyb3VwQ29tcG91bmRUeXBlIHx8IERFRkFVTFRfR1JPVVBfQ09NUE9VTkRfVFlQRTtcbiAgICBtZXRhRWRnZUlkZW50aWZpZXIgPSBwcm9wcy5tZXRhRWRnZUlkZW50aWZpZXI7XG4gICAgbG9ja0dyYXBoVG9wb2xvZ3kgPSBwcm9wcy5sb2NrR3JhcGhUb3BvbG9neTtcbiAgICBzaG91bGRBcHBseSA9IHByb3BzLnNob3VsZEFwcGx5IHx8IHRydWU7XG5cbiAgICB0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgPSBmYWxzZTtcbiAgICBpbml0TWV0YVN0eWxlTWFwKCk7XG4gIH1cblxuICB0b3BvbG9neUdyb3VwaW5nLmFwcGx5ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCB0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgfHwgIWV2YWxPcHQoIHNob3VsZEFwcGx5ICkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGxpc3QgPSBjeS5ub2RlcygpLm1hcCggZnVuY3Rpb24oIG5vZGUgKSB7XG4gICAgICByZXR1cm4gWyBub2RlIF07XG4gICAgfSApO1xuXG4gICAgLy8gZGV0ZXJtaW5lIG5vZGUgZ3JvdXBzIGJ5IHRoZWlyIHRvcG9sb2d5XG4gICAgdmFyIGdyb3VwcyA9IGdldE5vZGVHcm91cHMoIGxpc3QgKTtcbiAgICBcbiAgICAvLyBhcHBseSBncm91cGluZyBpbiBjeSBsZXZlbFxuICAgIHZhciBtZXRhRWRnZXMgPSB0b3BvbG9neUdyb3VwaW5nLmdldE1ldGFFZGdlcygpO1xuICAgIHZhciBjb21wb3VuZHMgPSB0b3BvbG9neUdyb3VwaW5nLmdldEdyb3VwQ29tcG91bmRzKCk7XG4gIFx0YXBwbHlHcm91cGluZyhncm91cHMsIG1ldGFFZGdlcywgY29tcG91bmRzKTtcblxuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9IHRydWU7XG5cbiAgICBpZiAoIGxvY2tHcmFwaFRvcG9sb2d5ICkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5sb2NrR3JhcGhUb3BvbG9neSgpO1xuICAgIH1cblxuICBcdHJldHVybiBncm91cHM7XG4gIH07XG5cbiAgdG9wb2xvZ3lHcm91cGluZy51bmFwcGx5ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCAhdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBtZXRhRWRnZXMgPSB0b3BvbG9neUdyb3VwaW5nLmdldE1ldGFFZGdlcygpO1xuICAgIG1ldGFFZGdlcy5mb3JFYWNoKCBmdW5jdGlvbiggZWRnZSApIHtcbiAgICAgIHZhciB0b1Jlc3RvcmUgPSBlZGdlLmRhdGEoJ3RnLXRvLXJlc3RvcmUnKTtcbiAgICAgIGVkZ2UucmVtb3ZlKCk7XG4gICAgICB0b1Jlc3RvcmUucmVzdG9yZSgpO1xuXG4gICAgICBFREdFX1NUWUxFX05BTUVTLmZvckVhY2goIGZ1bmN0aW9uKCBuYW1lICkge1xuICAgICAgICB2YXIgb2xkVmFsID0gdG9wb2xvZ3lHcm91cGluZy5tZXRhU3R5bGVNYXBbIG5hbWUgXVsgZWRnZS5pZCgpIF07XG4gICAgICAgIHZhciBuZXdWYWwgPSBlZGdlLmRhdGEoIG5hbWUgKTtcblxuICAgICAgICBpZiAoIG9sZFZhbCAhPT0gbmV3VmFsICkge1xuICAgICAgICAgIHRvUmVzdG9yZS5kYXRhKCBuYW1lLCBuZXdWYWwgKTtcbiAgICAgICAgfVxuICAgICAgfSApO1xuICAgIH0gKTtcblxuICAgIGluaXRNZXRhU3R5bGVNYXAoKTtcblxuICAgIHZhciBwYXJlbnRzID0gdG9wb2xvZ3lHcm91cGluZy5nZXRHcm91cENvbXBvdW5kcygpO1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50KCBwYXJlbnRzLmNoaWxkcmVuKCksIG51bGwgKTtcbiAgICBwYXJlbnRzLnJlbW92ZSgpO1xuXG4gICAgdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkID0gZmFsc2U7XG5cbiAgICBpZiAoIGxvY2tHcmFwaFRvcG9sb2d5ICkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy51bmxvY2tHcmFwaFRvcG9sb2d5KCk7XG4gICAgfVxuICB9O1xuXG4gIHRvcG9sb2d5R3JvdXBpbmcuZ2V0TWV0YUVkZ2VzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1ldGFFZGdlcyA9IGN5LmVkZ2VzKCdbJyArIG1ldGFFZGdlSWRlbnRpZmllciArICddJyk7XG4gICAgcmV0dXJuIG1ldGFFZGdlcztcbiAgfTtcblxuICB0b3BvbG9neUdyb3VwaW5nLmdldEdyb3VwQ29tcG91bmRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNsYXNzTmFtZSA9IGdyb3VwQ29tcG91bmRUeXBlO1xuICAgIHJldHVybiBjeS5ub2RlcygnW2NsYXNzPVwiJyArIGNsYXNzTmFtZSArICdcIl0nKTtcbiAgfTtcblxuICB0b3BvbG9neUdyb3VwaW5nLmNsZWFyQXBwbGllZEZsYWcgPSBmdW5jdGlvbigpIHtcbiAgICB0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgPSBmYWxzZTtcbiAgfTtcblxuICB0b3BvbG9neUdyb3VwaW5nLnNldEFwcGxpZWRGbGFnID0gZnVuY3Rpb24oYXBwbGllZCkge1xuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9IGFwcGxpZWQ7XG4gIH07XG5cbiAgdG9wb2xvZ3lHcm91cGluZy50b2dnbGVBcHBsaWVkRmxhZyA9IGZ1bmN0aW9uKCkge1xuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9ICF0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQ7XG4gIH07XG5cbiAgZnVuY3Rpb24gaW5pdE1ldGFTdHlsZU1hcCgpIHtcbiAgICB0b3BvbG9neUdyb3VwaW5nLm1ldGFTdHlsZU1hcCA9IHt9O1xuICAgIEVER0VfU1RZTEVfTkFNRVMuZm9yRWFjaCggZnVuY3Rpb24oIG5hbWUgKSB7XG4gICAgICB0b3BvbG9neUdyb3VwaW5nLm1ldGFTdHlsZU1hcFsgbmFtZSBdID0ge307XG4gICAgfSApO1xuICB9XG5cbiAgZnVuY3Rpb24gZXZhbE9wdCggb3B0ICkge1xuICAgIGlmICggdHlwZW9mIG9wdCA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHJldHVybiBvcHQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Tm9kZUdyb3VwcyggbGlzdCApIHtcbiAgICBpZiAoIGxpc3QubGVuZ3RoIDw9IDEgKSB7XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICB2YXIgaGFsdmVzID0gZ2V0SGFsdmVzKCBsaXN0ICk7XG4gICAgdmFyIGZpcnN0UGFydCA9IGdldE5vZGVHcm91cHMoIGhhbHZlc1sgMCBdICk7XG4gICAgdmFyIHNlY29uZFBhcnQgPSBnZXROb2RlR3JvdXBzKCBoYWx2ZXNbIDEgXSApO1xuICAgIC8vIG1lcmdlIHRoZSBoYWx2ZXNcblx0ICB2YXIgZ3JvdXBzID0gbWVyZ2VHcm91cHMoIGZpcnN0UGFydCwgc2Vjb25kUGFydCApO1xuXG4gICAgcmV0dXJuIGdyb3VwcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBhcmVudE9yU2VsZiggbm9kZSApIHtcbiAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKTtcbiAgICByZXR1cm4gcGFyZW50LnNpemUoKSA+IDAgPyBwYXJlbnQgOiBub2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FsY0dyb3VwaW5nS2V5KCBlZGdlICkge1xuICAgIHZhciBzcmNJZCA9IGdldFBhcmVudE9yU2VsZiggZWRnZS5zb3VyY2UoKSApLmlkKCk7XG4gICAgdmFyIHRndElkID0gZ2V0UGFyZW50T3JTZWxmKCBlZGdlLnRhcmdldCgpICkuaWQoKTtcbiAgICB2YXIgZWRnZVR5cGUgPSBnZXRFZGdlVHlwZSggZWRnZSApO1xuXG4gICAgcmV0dXJuIFsgZWRnZVR5cGUsIHNyY0lkLCB0Z3RJZCBdLmpvaW4oICctJyApO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkVG9NYXBDaGFpbiggbWFwLCBrZXksIHZhbCApIHtcbiAgICBpZiAoICFtYXBbIGtleSBdICkge1xuICAgICAgbWFwWyBrZXkgXSA9IGN5LmNvbGxlY3Rpb24oKTtcbiAgICB9XG5cbiAgICBtYXBbIGtleSBdID0gbWFwWyBrZXkgXS5hZGQoIHZhbCApO1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwbHlHcm91cGluZyhncm91cHMsIG1ldGFFZGdlcywgZ3JvdXBDb21wb3VuZHMpIHtcbiAgICB2YXIgY29tcG91bmRzO1xuXG4gICAgaWYgKGdyb3VwQ29tcG91bmRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbXBvdW5kcyA9IGdyb3VwQ29tcG91bmRzO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGdyb3Vwcy5mb3JFYWNoKCBmdW5jdGlvbiggZ3JvdXAgKSB7XG4gICAgICAgIGNyZWF0ZUdyb3VwQ29tcG91bmQoIGdyb3VwICk7XG4gICAgICB9ICk7XG4gIFxuICAgICAgY29tcG91bmRzID0gdG9wb2xvZ3lHcm91cGluZy5nZXRHcm91cENvbXBvdW5kcygpO1xuICAgIH1cblxuICAgIHZhciBjaGlsZHJlbkVkZ2VzID0gY29tcG91bmRzLmNoaWxkcmVuKCkuY29ubmVjdGVkRWRnZXMoKTtcbiAgICB2YXIgZWRnZXNNYXAgPSBbXTtcblxuICAgIGNoaWxkcmVuRWRnZXMuZm9yRWFjaCggZnVuY3Rpb24oIGVkZ2UgKXtcbiAgICAgIHZhciBrZXkgPSBjYWxjR3JvdXBpbmdLZXkoIGVkZ2UgKTtcbiAgICAgIGFkZFRvTWFwQ2hhaW4oIGVkZ2VzTWFwLCBrZXksIGVkZ2UgKTtcbiAgICAgIGVkZ2UucmVtb3ZlKCk7XG4gICAgfSApO1xuXG4gICAgaWYgKG1ldGFFZGdlcy5sZW5ndGggPiAwKSB7XG4gICAgICBPYmplY3Qua2V5cyggZWRnZXNNYXAgKS5mb3JFYWNoKCBmdW5jdGlvbigga2V5ICkge1xuICAgICAgICB2YXIgZWRnZXMgPSBlZGdlc01hcFtrZXldO1xuICAgICAgICB2YXIgdGVtcCA9IGVkZ2VzWzBdO1xuICAgICAgICB2YXIgbWV0YUVkZ2UgPSBtZXRhRWRnZXMuZmlsdGVyKGVkZ2UgPT4ge1xuICAgICAgICAgIHJldHVybiBlZGdlLnNvdXJjZSgpLmlkKCkgPT09IGdldFBhcmVudE9yU2VsZiggdGVtcC5zb3VyY2UoKSApLmlkKCkgJiZcbiAgICAgICAgICAgICAgICAgIGVkZ2UudGFyZ2V0KCkuaWQoKSA9PT0gZ2V0UGFyZW50T3JTZWxmKCB0ZW1wLnRhcmdldCgpICkuaWQoKTtcbiAgICAgICAgfSlbMF07XG4gICAgICAgIG1ldGFFZGdlLmRhdGEoICd0Zy10by1yZXN0b3JlJywgZWRnZXMgKTtcbiAgICAgICAgZWRnZXMucmVtb3ZlKCk7XG4gICAgICB9ICk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgT2JqZWN0LmtleXMoIGVkZ2VzTWFwICkuZm9yRWFjaCggZnVuY3Rpb24oIGtleSApIHtcbiAgICAgICAgY3JlYXRlTWV0YUVkZ2VGb3IoIGVkZ2VzTWFwWyBrZXkgXSApO1xuICAgICAgfSApO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUdyb3VwQ29tcG91bmQoIGdyb3VwICkge1xuICAgIGlmICggZ3JvdXAubGVuZ3RoIDwgMiApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY29sbGVjdGlvbiA9IGN5LmNvbGxlY3Rpb24oKTtcblxuICAgIGdyb3VwLmZvckVhY2goIGZ1bmN0aW9uKCBub2RlICkge1xuICAgICAgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb24uYWRkKCBub2RlICk7XG4gICAgfSApO1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMoIGNvbGxlY3Rpb24sIGdyb3VwQ29tcG91bmRUeXBlICk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVNZXRhRWRnZUZvciggZWRnZXMgKSB7XG4gICAgdmFyIHNyY0lkID0gZ2V0UGFyZW50T3JTZWxmKCBlZGdlcy5zb3VyY2UoKSApLmlkKCk7XG4gICAgdmFyIHRndElkID0gZ2V0UGFyZW50T3JTZWxmKCBlZGdlcy50YXJnZXQoKSApLmlkKCk7XG4gICAgdmFyIHR5cGUgPSBlZGdlcy5kYXRhKCAnY2xhc3MnICk7XG4gICAgY3kucmVtb3ZlKCBlZGdlcyApO1xuXG4gICAgdmFyIG1ldGFFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKCBzcmNJZCwgdGd0SWQsIHR5cGUgKTtcbiAgICBtZXRhRWRnZS5kYXRhKCAndGctdG8tcmVzdG9yZScsIGVkZ2VzICk7XG4gICAgbWV0YUVkZ2UuZGF0YSggbWV0YUVkZ2VJZGVudGlmaWVyLCB0cnVlICk7XG5cbiAgICBFREdFX1NUWUxFX05BTUVTLmZvckVhY2goIGZ1bmN0aW9uKCBzdHlsZU5hbWUgKSB7XG4gICAgICBlZGdlcy5mb3JFYWNoKCBmdW5jdGlvbiggZWRnZSApIHtcbiAgICAgICAgdG9wb2xvZ3lHcm91cGluZy5tZXRhU3R5bGVNYXBbIHN0eWxlTmFtZSBdWyBlZGdlLmlkKCkgXSA9IGVkZ2UuZGF0YSggc3R5bGVOYW1lICk7XG4gICAgICB9ICk7XG5cbiAgICAgIHZhciBjb21tb25WYWwgPSBlbGVtZW50VXRpbGl0aWVzLmdldENvbW1vblByb3BlcnR5KGVkZ2VzLCBzdHlsZU5hbWUsICdkYXRhJyk7XG4gICAgICBpZiAoIGNvbW1vblZhbCApIHtcbiAgICAgICAgbWV0YUVkZ2UuZGF0YSggc3R5bGVOYW1lLCBjb21tb25WYWwgKTtcbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgICByZXR1cm4gbWV0YUVkZ2U7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZUdyb3VwcyggZ3JvdXBzMSwgZ3JvdXBzMiApIHtcbiAgICAvLyBub3RNZXJnZWRHcnMgd2lsbCBpbmNsdWRlIG1lbWJlcnMgb2YgZ3JvdXBzMSB0aGF0IGFyZSBub3QgbWVyZ2VkXG4gIFx0Ly8gbWVyZ2VkR3JzIHdpbGwgaW5jbHVkZSB0aGUgbWVyZ2VkIG1lbWJlcnMgZnJvbSAyIGdyb3Vwc1xuICBcdHZhciBub3RNZXJnZWRHcnMgPSBbXSwgbWVyZ2VkR3JzID0gW107XG5cbiAgICBncm91cHMxLmZvckVhY2goIGZ1bmN0aW9uKCBncjEgKSB7XG4gICAgICB2YXIgbWVyZ2VkID0gZmFsc2U7XG5cbiAgICAgIG1lcmdlZEdycy5jb25jYXQoIGdyb3VwczIgKS5mb3JFYWNoKCBmdW5jdGlvbiggZ3IyLCBpbmRleDIgKSB7XG4gICAgICAgIC8vIGlmIGdyb3VwcyBzaG91bGQgYmUgbWVyZ2VkIG1lcmdlIHRoZW0sIHJlbW92ZSBncjIgZnJvbSB3aGVyZSBpdFxuICAgICAgICAvLyBjb21lcyBmcm9tIGFuZCBwdXNoIHRoZSBtZXJnZSByZXN1bHQgdG8gbWVyZ2VkR3JzXG4gICAgICAgIGlmICggc2hvdWxkTWVyZ2UoIGdyMSwgZ3IyICkgKSB7XG4gICAgICAgICAgdmFyIG1lcmdlZEdyID0gZ3IxLmNvbmNhdCggZ3IyICk7XG5cbiAgICAgICAgICBpZiAoIGluZGV4MiA+PSBtZXJnZWRHcnMubGVuZ3RoICkge1xuICAgICAgICAgICAgcmVtb3ZlQXQoIGdyb3VwczIsIGluZGV4MiAtIG1lcmdlZEdycy5sZW5ndGggKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZW1vdmVBdCggbWVyZ2VkR3JzLCBpbmRleDIgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBtYXJrIGFzIG1lcmdlZCBhbmQgYnJlYWsgdGhlIGxvb3BcbiAgICAgICAgICBtZXJnZWRHcnMucHVzaCggbWVyZ2VkR3IgKTtcbiAgICAgICAgICBtZXJnZWQgPSB0cnVlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSApO1xuXG4gICAgICAvLyBpZiBncjEgaXMgbm90IG1lcmdlZCBwdXNoIGl0IHRvIG5vdE1lcmdlZEdyc1xuICAgICAgaWYgKCAhbWVyZ2VkICkge1xuICAgICAgICBub3RNZXJnZWRHcnMucHVzaCggZ3IxICk7XG4gICAgICB9XG4gICAgfSApO1xuXG4gICAgLy8gdGhlIGdyb3VwcyB0aGF0IGNvbWVzIGZyb20gZ3JvdXBzMiBidXQgbm90IG1lcmdlZCBhcmUgc3RpbGwgaW5jbHVkZWRcblx0ICAvLyBpbiBncm91cHMyIGFkZCB0aGVtIHRvIHRoZSByZXN1bHQgdG9nZXRoZXIgd2l0aCBtZXJnZWRHcnMgYW5kIG5vdE1lcmdlZEdyc1xuICAgIHJldHVybiBub3RNZXJnZWRHcnMuY29uY2F0KCBtZXJnZWRHcnMsIGdyb3VwczIgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZE1lcmdlKCBncm91cDEsIGdyb3VwMiApIHtcbiAgICAvLyB1c2luZyBmaXJzdCBlbGVtZW50cyBpcyBlbm91Z2ggdG8gZGVjaWRlIHdoZXRoZXIgdG8gbWVyZ2VcbiAgXHR2YXIgbm9kZTEgPSBncm91cDFbIDAgXTtcbiAgXHR2YXIgbm9kZTIgPSBncm91cDJbIDAgXTtcblxuICAgIGlmICggbm9kZTEuZWRnZXMoKS5sZW5ndGggIT09IG5vZGUyLmVkZ2VzKCkubGVuZ3RoICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBnZXRVbmRpcmVjdGVkRWRnZXMgPSBmdW5jdGlvbiggbm9kZSApIHtcbiAgICAgIHZhciBlZGdlcyA9IG5vZGUuY29ubmVjdGVkRWRnZXMoKS5maWx0ZXIoIGlzVW5kaXJlY3RlZEVkZ2UgKTtcbiAgICAgIHJldHVybiBlZGdlcztcbiAgICB9O1xuICAgIC8vIHVuZGlyZWN0ZWQgZWRnZXMgb2Ygbm9kZTEgYW5kIG5vZGUyIHJlc3BlY3RpdmVseVxuICAgIHZhciB1bmRpcjEgPSBnZXRVbmRpcmVjdGVkRWRnZXMoIG5vZGUxICk7XG4gICAgdmFyIHVuZGlyMiA9IGdldFVuZGlyZWN0ZWRFZGdlcyggbm9kZTIgKTtcblxuICAgIHZhciBpbjEgPSBub2RlMS5pbmNvbWVycygpLmVkZ2VzKCkubm90KCB1bmRpcjEgKTtcbiAgICB2YXIgaW4yID0gbm9kZTIuaW5jb21lcnMoKS5lZGdlcygpLm5vdCggdW5kaXIyICk7XG5cbiAgICB2YXIgb3V0MSA9IG5vZGUxLm91dGdvZXJzKCkuZWRnZXMoKS5ub3QoIHVuZGlyMSApO1xuXHQgIHZhciBvdXQyID0gbm9kZTIub3V0Z29lcnMoKS5lZGdlcygpLm5vdCggdW5kaXIyICk7XG5cbiAgICByZXR1cm4gY29tcGFyZUVkZ2VHcm91cCggaW4xLCBpbjIsIG5vZGUxLCBub2RlMiApXG4gICAgICAgICAgICAmJiBjb21wYXJlRWRnZUdyb3VwKCBvdXQxLCBvdXQyLCBub2RlMSwgbm9kZTIgKVxuICAgICAgICAgICAgJiYgY29tcGFyZUVkZ2VHcm91cCggdW5kaXIxLCB1bmRpcjIsIG5vZGUxLCBub2RlMiApO1xuICB9XG5cbiAgLy8gZGVjaWRlIGlmIDIgZWRnZSBncm91cHMgY29udGFpbnMgc2V0IG9mIGVkZ2VzIHdpdGggc2ltaWxhciBjb250ZW50ICh0eXBlLFxuICAvLyBzb3VyY2UsdGFyZ2V0KSByZWxhdGl2ZSB0byB0aGVpciBub2RlcyB3aGVyZSBncjEgYXJlIGVkZ2VzIG9mIG5vZGUxIGFuZCBncjIgYXJlIGVkZ2VzIG9mXG4gIC8vIG5vZGUyXG4gIGZ1bmN0aW9uIGNvbXBhcmVFZGdlR3JvdXAoIGdyMSwgZ3IyLCBub2RlMSwgbm9kZTIgKSB7XG4gICAgdmFyIGlkMSA9IG5vZGUxLmlkKCk7XG4gICAgdmFyIGlkMiA9IG5vZGUyLmlkKCk7XG5cbiAgICB2YXIgbWFwMSA9IGZpbGxJZFRvVHlwZVNldE1hcCggZ3IxLCBub2RlMSApO1xuICAgIHZhciBtYXAyID0gZmlsbElkVG9UeXBlU2V0TWFwKCBncjIsIG5vZGUyICk7XG5cbiAgICBpZiAoIE9iamVjdC5rZXlzKCBtYXAxICkubGVuZ3RoICE9PSBPYmplY3Qua2V5cyggbWFwMiApLmxlbmd0aCApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZmFpbGVkID0gZmFsc2U7XG5cbiAgICBPYmplY3Qua2V5cyggbWFwMSApLmZvckVhY2goIGZ1bmN0aW9uKCBrZXkgKSB7XG4gICAgICAvLyBpZiBhbHJlYWR5IGZhaWxlZCBqdXN0IHJldHVyblxuICAgICAgaWYgKCBmYWlsZWQgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gaWYga2V5IGlzIGlkMiB1c2UgaWQxIGluc3RlYWQgYmVjYXVzZSBjb21wYXJpc29uIGlzIHJlbGF0aXZlIHRvIG5vZGVzXG4gICAgICB2YXIgb3RoZXJLZXkgPSAoIGtleSA9PSBpZDIgKSA/IGlkMSA6IGtleTtcblxuICAgICAgLy8gY2hlY2sgaWYgdGhlIHNldHMgaGF2ZSB0aGUgc2FtZSBjb250ZW50XG4gIFx0XHQvLyBpZiBjaGVjayBmYWlscyByZXR1cm4gZmFsc2VcbiAgICAgIGlmICggIWlzRXF1YWwoIG1hcDFbIGtleSBdLCBtYXAyWyBvdGhlcktleSBdICkgKSB7XG4gICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSApO1xuXG4gICAgLy8gaWYgY2hlY2sgcGFzc2VzIGZvciBlYWNoIGtleSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiAhZmFpbGVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmlsbElkVG9UeXBlU2V0TWFwKCBlZGdlR3JvdXAsIG5vZGUgKSB7XG4gICAgdmFyIG1hcCA9IHt9O1xuICAgIHZhciBub2RlSWQgPSBub2RlLmlkKCk7XG5cbiAgICBlZGdlR3JvdXAuZm9yRWFjaCggZnVuY3Rpb24oIGVkZ2UgKSB7XG4gICAgICB2YXIgc3JjSWQgPSBlZGdlLmRhdGEoJ3NvdXJjZScpO1xuICAgICAgdmFyIHRndElkID0gZWRnZS5kYXRhKCd0YXJnZXQnKTtcbiAgICAgIHZhciBlZGdlSWQgPSBlZGdlLmlkKCk7XG5cbiAgICAgIHZhciBvdGhlckVuZCA9ICggbm9kZUlkID09PSB0Z3RJZCApID8gc3JjSWQgOiB0Z3RJZDtcblxuICAgICAgZnVuY3Rpb24gYWRkVG9SZWxhdGVkU2V0KCBzaWRlU3RyLCB2YWx1ZSApIHtcbiAgICAgICAgaWYgKCAhbWFwWyBzaWRlU3RyIF0gKSB7XG4gICAgICAgICAgbWFwWyBzaWRlU3RyIF0gPSBuZXcgU2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBtYXBbIHNpZGVTdHIgXS5hZGQoIHZhbHVlICk7XG4gICAgICB9XG5cbiAgICAgIHZhciBlZGdlVHlwZSA9IGdldEVkZ2VUeXBlKCBlZGdlICk7XG5cbiAgICAgIGFkZFRvUmVsYXRlZFNldCggb3RoZXJFbmQsIGVkZ2VUeXBlICk7XG4gICAgfSApO1xuXG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEVkZ2VUeXBlKCBlZGdlICkge1xuICAgIHJldHVybiBlZGdlLmRhdGEoICdjbGFzcycgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVW5kaXJlY3RlZEVkZ2UoIGVkZ2UgKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNVbmRpcmVjdGVkRWRnZSggZWRnZSApO1xuICB9XG5cbiAgLy8gZ2V0IGhhbHZlcyBvZiBhIGxpc3QuIEl0IGlzIGFzc3VtZWQgdGhhdCBsaXN0IHNpemUgaXMgYXQgbGVhc3QgMi5cbiAgZnVuY3Rpb24gZ2V0SGFsdmVzKCBsaXN0ICkge1xuICAgIHZhciBzID0gbGlzdC5sZW5ndGg7XG4gICAgdmFyIGhhbGZJbmRleCA9IE1hdGguZmxvb3IoIHMgLyAyICk7XG4gICAgdmFyIGZpcnN0SGFsZiA9IGxpc3Quc2xpY2UoIDAsIGhhbGZJbmRleCApO1xuICAgIHZhciBzZWNvbmRIYWxmID0gbGlzdC5zbGljZSggaGFsZkluZGV4LCBzICk7XG5cbiAgICByZXR1cm4gWyBmaXJzdEhhbGYsIHNlY29uZEhhbGYgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUF0KCBhcnIsIGluZGV4ICkge1xuICAgIGFyci5zcGxpY2UoIGluZGV4LCAxICk7XG4gIH1cblxuICByZXR1cm4gdG9wb2xvZ3lHcm91cGluZztcbn07XG4iLCIvLyBFeHRlbmRzIHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgc2JnbnZpekluc3RhbmNlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucywgZWxlbWVudFV0aWxpdGllcywgY3ksIHRvcG9sb2d5R3JvdXBpbmc7XG5cbiAgZnVuY3Rpb24gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNFeHRlbmRlciAocGFyYW0pIHtcblxuICAgIHNiZ252aXpJbnN0YW5jZSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRJbnN0YW5jZSgpO1xuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KCk7XG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSBzYmdudml6SW5zdGFuY2UudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG4gICAgZWxlbWVudFV0aWxpdGllcyA9IHBhcmFtLmVsZW1lbnRVdGlsaXRpZXM7XG4gICAgdG9wb2xvZ3lHcm91cGluZyA9IHBhcmFtLnNpZlRvcG9sb2d5R3JvdXBpbmc7XG5cbiAgICBleHRlbmQoKTtcbiAgfVxuXG4gIC8vIEV4dGVuZHMgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgd2l0aCBjaGlzZSBzcGVjaWZpYyBmZWF0dXJlc1xuICBmdW5jdGlvbiBleHRlbmQgKCkge1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYXBwbHlTSUZUb3BvbG9neUdyb3VwaW5nID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgIHZhciBvbGRFbGVzLCBuZXdFbGVzO1xuICAgICAgaWYgKCBwYXJhbS5maXJzdFRpbWUgKSB7XG4gICAgICAgIG9sZEVsZXMgPSBjeS5lbGVtZW50cygpO1xuXG4gICAgICAgIGlmIChwYXJhbS5hcHBseSkge1xuICAgICAgICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbHkoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0b3BvbG9neUdyb3VwaW5nLnVuYXBwbHkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0VsZXMgPSBjeS5lbGVtZW50cygpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG9sZEVsZXMgPSBwYXJhbS5vbGRFbGVzO1xuICAgICAgICBuZXdFbGVzID0gcGFyYW0ubmV3RWxlcztcblxuICAgICAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy51bmxvY2tHcmFwaFRvcG9sb2d5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5sb2NrR3JhcGhUb3BvbG9neSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgb2xkRWxlcy5yZW1vdmUoKTtcbiAgICAgICAgbmV3RWxlcy5yZXN0b3JlKCk7XG5cbiAgICAgICAgdG9wb2xvZ3lHcm91cGluZy50b2dnbGVBcHBsaWVkRmxhZygpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVzdWx0ID0geyBvbGRFbGVzOiBuZXdFbGVzLCBuZXdFbGVzOiBvbGRFbGVzIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gYWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGROb2RlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICB2YXIgbmV3Tm9kZSA9IHBhcmFtLm5ld05vZGU7XG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShuZXdOb2RlLngsIG5ld05vZGUueSwgbmV3Tm9kZS5jbGFzcywgbmV3Tm9kZS5pZCwgbmV3Tm9kZS5wYXJlbnQsIG5ld05vZGUudmlzaWJpbGl0eSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IHJlc3VsdFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgdmFyIG5ld0VkZ2UgPSBwYXJhbS5uZXdFZGdlO1xuICAgICAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3RWRnZS5zb3VyY2UsIG5ld0VkZ2UudGFyZ2V0LCBuZXdFZGdlLmNsYXNzLCBuZXdFZGdlLmlkLCBuZXdFZGdlLnZpc2liaWxpdHkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiByZXN1bHRcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMocGFyYW0uc291cmNlLCBwYXJhbS50YXJnZXQsIHBhcmFtLnByb2Nlc3NUeXBlKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZWxlczogcmVzdWx0XG4gICAgICB9O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICAvLyBOb2RlcyB0byBtYWtlIGNvbXBvdW5kLCB0aGVpciBkZXNjZW5kYW50cyBhbmQgZWRnZXMgY29ubmVjdGVkIHRvIHRoZW0gd2lsbCBiZSByZW1vdmVkIGR1cmluZyBjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgb3BlcmF0aW9uXG4gICAgICAgIC8vIChpbnRlcm5hbGx5IGJ5IGVsZXMubW92ZSgpIG9wZXJhdGlvbiksIHNvIG1hcmsgdGhlbSBhcyByZW1vdmVkIGVsZXMgZm9yIHVuZG8gb3BlcmF0aW9uLlxuICAgICAgICB2YXIgbm9kZXNUb01ha2VDb21wb3VuZCA9IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQ7XG4gICAgICAgIHZhciByZW1vdmVkRWxlcyA9IG5vZGVzVG9NYWtlQ29tcG91bmQudW5pb24obm9kZXNUb01ha2VDb21wb3VuZC5kZXNjZW5kYW50cygpKTtcbiAgICAgICAgcmVtb3ZlZEVsZXMgPSByZW1vdmVkRWxlcy51bmlvbihyZW1vdmVkRWxlcy5jb25uZWN0ZWRFZGdlcygpKTtcbiAgICAgICAgcmVzdWx0LnJlbW92ZWRFbGVzID0gcmVtb3ZlZEVsZXM7XG4gICAgICAgIC8vIEFzc3VtZSB0aGF0IGFsbCBub2RlcyB0byBtYWtlIGNvbXBvdW5kIGhhdmUgdGhlIHNhbWUgcGFyZW50XG4gICAgICAgIHZhciBvbGRQYXJlbnRJZCA9IG5vZGVzVG9NYWtlQ29tcG91bmRbMF0uZGF0YShcInBhcmVudFwiKTtcbiAgICAgICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZFxuICAgICAgICAvLyBOZXcgZWxlcyBpbmNsdWRlcyBuZXcgY29tcG91bmQgYW5kIHRoZSBtb3ZlZCBlbGVzIGFuZCB3aWxsIGJlIHVzZWQgaW4gdW5kbyBvcGVyYXRpb24uXG4gICAgICAgIHJlc3VsdC5uZXdFbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMobm9kZXNUb01ha2VDb21wb3VuZCwgcGFyYW0uY29tcG91bmRUeXBlKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQucmVtb3ZlZEVsZXMgPSBwYXJhbS5uZXdFbGVzLnJlbW92ZSgpO1xuICAgICAgICByZXN1bHQubmV3RWxlcyA9IHBhcmFtLnJlbW92ZWRFbGVzLnJlc3RvcmUoKTtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXIocmVzdWx0Lm5ld0VsZXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvLyBTZWN0aW9uIEVuZFxuICAgIC8vIGFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xuXG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgICAgIHZhciBlbGVzO1xuXG4gICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgIGVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24ocGFyYW0udGVtcGxhdGVUeXBlLCBwYXJhbS5tYWNyb21vbGVjdWxlTGlzdCwgcGFyYW0uY29tcGxleE5hbWUsIHBhcmFtLnByb2Nlc3NQb3NpdGlvbiwgcGFyYW0udGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCBwYXJhbS50aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgcGFyYW0uZWRnZUxlbmd0aCwgcGFyYW0ubGF5b3V0UGFyYW0pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcyA9IHBhcmFtO1xuICAgICAgICBjeS5hZGQoZWxlcyk7XG5cbiAgICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgICBlbGVzLnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiBlbGVzXG4gICAgICB9O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVBY3RpdmF0aW9uUmVhY3Rpb24gPSBmdW5jdGlvbihwYXJhbSkge1xuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgICAgIHZhciBlbGVzO1xuXG4gICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgIGVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUFjdGl2YXRpb25SZWFjdGlvbihwYXJhbS5wcm90ZWluTmFtZSwgcGFyYW0ucHJvY2Vzc1Bvc2l0aW9uLCBwYXJhbS5lZGdlTGVuZ3RoLCBwYXJhbS5yZXZlcnNlKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGVsZXMgPSBwYXJhbTtcbiAgICAgICAgY3kuYWRkKGVsZXMpO1xuXG4gICAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICAgICAgZWxlcy5zZWxlY3QoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZWxlczogZWxlc1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29udmVyc2lvbiA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICBsZXQgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgbGV0IGVsZXM7XG5cbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29udmVyc2lvbihwYXJhbS5tYWNyb21vbGVjdWxlLCBwYXJhbS5yZWd1bGF0b3IsIHBhcmFtLnJlZ3VsYXRvck11bHRpbWVyLCBwYXJhbS5vcmllbnRhdGlvbiwgcGFyYW0uaW5wdXRJbmZvYm94TGFiZWxzLCBwYXJhbS5vdXRwdXRJbmZvYm94TGFiZWxzKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVzID0gcGFyYW07XG4gICAgICAgIGN5LmFkZChlbGVzKTtcblxuICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICAgIGVsZXMuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IGVsZXNcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZU1ldGFib2xpY1JlYWN0aW9uID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgIGxldCBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gICAgICBsZXQgZWxlcztcblxuICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICBlbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVNZXRhYm9saWNSZWFjdGlvbihwYXJhbS5pbnB1dHMsIHBhcmFtLm91dHB1dHMsIHBhcmFtLnJldmVyc2libGUsIHBhcmFtLnJlZ3VsYXRvciwgcGFyYW0ucmVndWxhdG9yTXVsdGltZXIsIHBhcmFtLm9yaWVudGF0aW9uKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVzID0gcGFyYW07XG4gICAgICAgIGN5LmFkZChlbGVzKTtcblxuICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICAgIGVsZXMuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IGVsZXNcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZU1ldGFib2xpY0NhdGFseXRpY0FjdGl2aXR5ID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gICAgICB2YXIgZWxlcztcblxuICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICBlbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVNZXRhYm9saWNDYXRhbHl0aWNBY3Rpdml0eShwYXJhbS5pbnB1dE5vZGVMaXN0LCBwYXJhbS5vdXRwdXROb2RlTGlzdCwgcGFyYW0uY2F0YWx5c3ROYW1lLCBwYXJhbS5jYXRhbHlzdFR5cGUsIHBhcmFtLnByb2Nlc3NQb3NpdGlvbiwgcGFyYW0udGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCBwYXJhbS50aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgcGFyYW0uZWRnZUxlbmd0aClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVzID0gcGFyYW07XG4gICAgICAgIGN5LmFkZChlbGVzKTtcblxuICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICAgIGVsZXMuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IGVsZXNcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRyYW5zY3JpcHRpb25SZWFjdGlvbiA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIGVsZXM7XG5cbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVHJhbnNjcmlwdGlvblJlYWN0aW9uKHBhcmFtLmdlbmVOYW1lLCBwYXJhbS5tUm5hTmFtZSwgcGFyYW0ucHJvY2Vzc1Bvc2l0aW9uLCBwYXJhbS5lZGdlTGVuZ3RoKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGVsZXMgPSBwYXJhbTtcbiAgICAgICAgY3kuYWRkKGVsZXMpO1xuXG4gICAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICAgICAgZWxlcy5zZWxlY3QoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZWxlczogZWxlc1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVHJhbnNsYXRpb25SZWFjdGlvbiA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIGVsZXM7XG5cbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVHJhbnNsYXRpb25SZWFjdGlvbihwYXJhbS5tUm5hTmFtZSwgcGFyYW0ucHJvdGVpbk5hbWUsIHBhcmFtLnByb2Nlc3NQb3NpdGlvbiwgcGFyYW0uZWRnZUxlbmd0aClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVzID0gcGFyYW07XG4gICAgICAgIGN5LmFkZChlbGVzKTtcblxuICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICAgIGVsZXMuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IGVsZXNcbiAgICAgIH07XG4gICAgfTtcblxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHBvc2l0aW9ucyA9IHt9O1xuICAgICAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcblxuICAgICAgbm9kZXMuZWFjaChmdW5jdGlvbihlbGUsIGkpIHtcbiAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgIGVsZSA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICBwb3NpdGlvbnNbZWxlLmlkKCldID0ge1xuICAgICAgICAgIHg6IGVsZS5wb3NpdGlvbihcInhcIiksXG4gICAgICAgICAgeTogZWxlLnBvc2l0aW9uKFwieVwiKVxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBwb3NpdGlvbnM7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zID0gZnVuY3Rpb24gKHBvc2l0aW9ucykge1xuICAgICAgdmFyIGN1cnJlbnRQb3NpdGlvbnMgPSB7fTtcbiAgICAgIGN5Lm5vZGVzKCkucG9zaXRpb25zKGZ1bmN0aW9uIChlbGUsIGkpIHtcbiAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgIGVsZSA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50UG9zaXRpb25zW2VsZS5pZCgpXSA9IHtcbiAgICAgICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxuICAgICAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcG9zID0gcG9zaXRpb25zW2VsZS5pZCgpXTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB4OiBwb3MueCxcbiAgICAgICAgICB5OiBwb3MueVxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBjdXJyZW50UG9zaXRpb25zO1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG5cbiAgICAgIHJlc3VsdC5zaXplTWFwID0ge307XG4gICAgICByZXN1bHQudXNlQXNwZWN0UmF0aW8gPSBmYWxzZTtcbiAgICAgIHJlc3VsdC5wcmVzZXJ2ZVJlbGF0aXZlUG9zID0gcGFyYW0ucHJlc2VydmVSZWxhdGl2ZVBvcztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBpZihub2RlLmlzUGFyZW50KCkpe1xuICAgICAgICAgIHJlc3VsdC5zaXplTWFwW25vZGUuaWQoKV0gPSB7XG4gICAgICAgICAgICB3OiBub2RlLmRhdGEoXCJtaW5XaWR0aFwiKSB8fCAwLFxuICAgICAgICAgICAgaDogbm9kZS5kYXRhKFwibWluSGVpZ2h0XCIpIHx8IDAsXG4gICAgICAgICAgICBiaWFzTCA6IG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc0xlZnRcIikgfHwgMCxcbiAgICAgICAgICAgIGJpYXNSIDogbm9kZS5kYXRhKFwibWluV2lkdGhCaWFzUmlnaHRcIikgfHwgMCxcbiAgICAgICAgICAgIGJpYXNUIDogbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc1RvcFwiKSB8fCAwLFxuICAgICAgICAgICAgYmlhc0IgOiBub2RlLmRhdGEoXCJtaW5IZWlnaHRCaWFzQm90dG9tXCIpIHx8IDBcbiAgICAgICAgICAgLy8gdzogbm9kZS5jc3MoXCJtaW5XaWR0aFwiKSAhPSAwPyAgbm9kZS5kYXRhKFwibWluV2lkdGhcIikgOiBub2RlLmNoaWxkcmVuKCkuYm91bmRpbmdCb3goKS53LFxuICAgICAgICAgICAgLy9oOiBub2RlLmNzcyhcIm1pbi1oZWlnaHRcIikgIT0gMD8gIG5vZGUuZGF0YShcIm1pbkhlaWdodFwiKSA6IG5vZGUuY2hpbGRyZW4oKS5ib3VuZGluZ0JveCgpLmhcbiAgICAgICAgICB9O1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICByZXN1bHQuc2l6ZU1hcFtub2RlLmlkKCldID0ge1xuICAgICAgICAgICAgdzogbm9kZS53aWR0aCgpLFxuICAgICAgICAgICAgaDogbm9kZS5oZWlnaHQoKVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG5cbiAgICAgICAgaWYgKHBhcmFtLnBlcmZvcm1PcGVyYXRpb24pIHtcbiAgICAgICAgICBpZiAocGFyYW0uc2l6ZU1hcCkge1xuICAgICAgICAgICAgLyogaWYgKHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3MgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgdmFyIG9sZFdpZHRoID0gbm9kZS5kYXRhKFwiYmJveFwiKS53O1xuICAgICAgICAgICAgICB2YXIgb2xkSGVpZ2h0ID0gbm9kZS5kYXRhKFwiYmJveFwiKS5oO1xuICAgICAgICAgICAgfSAqL1xuXG4gICAgICAgICAgICBpZihub2RlLmlzUGFyZW50KCkpe1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0XCIgLCBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uaCk7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcIm1pbldpZHRoXCIgLCBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0udyk7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc0xlZnRcIiwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmJpYXNMKTtcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwibWluV2lkdGhCaWFzUmlnaHRcIiwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmJpYXNSKTtcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc1RvcFwiLCBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uYmlhc1QpO1xuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJtaW5IZWlnaHRCaWFzQm90dG9tXCIsIHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5iaWFzQik7XG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0udztcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgIFxuXG4gICAgICAgICAgICAvKiBpZiAocGFyYW0ucHJlc2VydmVSZWxhdGl2ZVBvcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICB2YXIgc3RhdGVzYW5kaW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgICAgICAgICAgIHZhciB0b3BCb3R0b20gPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IChib3guYW5jaG9yU2lkZSA9PT0gXCJ0b3BcIiB8fCBib3guYW5jaG9yU2lkZSA9PT0gXCJib3R0b21cIikpO1xuICAgICAgICAgICAgICB2YXIgcmlnaHRMZWZ0ID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiAoYm94LmFuY2hvclNpZGUgPT09IFwicmlnaHRcIiB8fCBib3guYW5jaG9yU2lkZSA9PT0gXCJsZWZ0XCIpKTtcblxuICAgICAgICAgICAgICB0b3BCb3R0b20uZm9yRWFjaChmdW5jdGlvbihib3gpe1xuICAgICAgICAgICAgICAgIGlmIChib3guYmJveC54IDwgMCkge1xuICAgICAgICAgICAgICAgICAgYm94LmJib3gueCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJveC5iYm94LnggPiBvbGRXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgYm94LmJib3gueCA9IG9sZFdpZHRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBib3guYmJveC54ID0gbm9kZS5kYXRhKFwiYmJveFwiKS53ICogYm94LmJib3gueCAvIG9sZFdpZHRoO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICByaWdodExlZnQuZm9yRWFjaChmdW5jdGlvbihib3gpe1xuICAgICAgICAgICAgICAgIGlmIChib3guYmJveC55IDwgMCkge1xuICAgICAgICAgICAgICAgICAgYm94LmJib3gueSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJveC5iYm94LnkgPiBvbGRIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgIGJveC5iYm94LnkgPSBvbGRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJveC5iYm94LnkgPSBub2RlLmRhdGEoXCJiYm94XCIpLmggKiBib3guYmJveC55IC8gb2xkSGVpZ2h0O1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gKi9cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKHBhcmFtLm5vZGVzLCBwYXJhbS53aWR0aCwgcGFyYW0uaGVpZ2h0LCBwYXJhbS51c2VBc3BlY3RSYXRpbywgcGFyYW0ucHJlc2VydmVSZWxhdGl2ZVBvcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgfTtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICAgICAgcmVzdWx0Lm5vZGVzID0gbm9kZXM7XG4gICAgICByZXN1bHQubGFiZWwgPSB7fTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICByZXN1bHQubGFiZWxbbm9kZS5pZCgpXSA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICBub2Rlcy5kYXRhKCdsYWJlbCcsIHBhcmFtLmxhYmVsKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgICBub2RlLl9wcml2YXRlLmRhdGEubGFiZWwgPSBwYXJhbS5sYWJlbFtub2RlLmlkKCldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUluZm9ib3hTdHlsZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIH07XG4gICAgICB2YXIgc3R5bGUgPSBwYXJhbS5ub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJylbcGFyYW0uaW5kZXhdLnN0eWxlO1xuICAgICAgcmVzdWx0Lm5ld1Byb3BzID0gJC5leHRlbmQoIHt9LCBzdHlsZSApO1xuICAgICAgcmVzdWx0Lm5vZGUgPSBwYXJhbS5ub2RlO1xuICAgICAgcmVzdWx0LmluZGV4ID0gcGFyYW0uaW5kZXg7XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlSW5mb2JveFN0eWxlKCBwYXJhbS5ub2RlLCBwYXJhbS5pbmRleCwgcGFyYW0ubmV3UHJvcHMgKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlSW5mb2JveE9iaiA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIH07XG4gICAgICB2YXIgb2JqID0gcGFyYW0ubm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpW3BhcmFtLmluZGV4XTtcbiAgICAgIHJlc3VsdC5uZXdQcm9wcyA9ICQuZXh0ZW5kKCB7fSwgb2JqICk7XG4gICAgICByZXN1bHQubm9kZSA9IHBhcmFtLm5vZGU7XG4gICAgICByZXN1bHQuaW5kZXggPSBwYXJhbS5pbmRleDtcblxuICAgICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVJbmZvYm94T2JqKCBwYXJhbS5ub2RlLCBwYXJhbS5pbmRleCwgcGFyYW0ubmV3UHJvcHMgKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRGF0YSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIH07XG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG4gICAgICByZXN1bHQubmFtZSA9IHBhcmFtLm5hbWU7XG4gICAgICByZXN1bHQudmFsdWVNYXAgPSB7fTtcbiAgICAgIHJlc3VsdC5lbGVzID0gZWxlcztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgICAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmRhdGEocGFyYW0ubmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShwYXJhbS5lbGVzLCBwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZU1hcCk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZVNldEZpZWxkID0gZnVuY3Rpb24oIHBhcmFtICkge1xuICAgICAgdmFyIHVwZGF0ZXMgPSBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZVNldEZpZWxkKCBwYXJhbS5lbGUsIHBhcmFtLmZpZWxkTmFtZSwgcGFyYW0udG9EZWxldGUsIHBhcmFtLnRvQWRkLCBwYXJhbS5jYWxsYmFjayApO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBlbGU6IHBhcmFtLmVsZSxcbiAgICAgICAgZmllbGROYW1lOiBwYXJhbS5maWVsZE5hbWUsXG4gICAgICAgIGNhbGxiYWNrOiBwYXJhbS5jYWxsYmFjayxcbiAgICAgICAgdG9EZWxldGU6IHVwZGF0ZXMuYWRkZWQsXG4gICAgICAgIHRvQWRkOiB1cGRhdGVzLmRlbGV0ZWRcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIH07XG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG4gICAgICByZXN1bHQubmFtZSA9IHBhcmFtLm5hbWU7XG4gICAgICByZXN1bHQudmFsdWVNYXAgPSB7fTtcbiAgICAgIHJlc3VsdC5lbGVzID0gZWxlcztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgICAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmNzcyhwYXJhbS5uYW1lKTtcbiAgICAgIH1cblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MocGFyYW0uZWxlcywgcGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXApO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIH07XG5cbiAgICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcbiAgICAgIHJlc3VsdC5kYXRhID0ge307XG4gICAgICByZXN1bHQuZWxlcyA9IGVsZXM7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcblxuICAgICAgICByZXN1bHQuZGF0YVtlbGUuaWQoKV0gPSB7fTtcblxuICAgICAgICB2YXIgZGF0YSA9IHBhcmFtLmZpcnN0VGltZSA/IHBhcmFtLmRhdGEgOiBwYXJhbS5kYXRhW2VsZS5pZCgpXTtcblxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIGRhdGEpIHtcbiAgICAgICAgICByZXN1bHQuZGF0YVtlbGUuaWQoKV1bcHJvcF0gPSBlbGUuZGF0YShwcm9wKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG5cbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZSwgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBTaG93IGVsZXMgYW5kIHBlcmZvcm0gbGF5b3V0LlxuICAgICAqL1xuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XG5cbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgcmVzdWx0LmVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KHBhcmFtLmVsZXMsIHBhcmFtLmxheW91dHBhcmFtKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQuZWxlcyA9IGN5LnZpZXdVdGlsaXRpZXMoKS5zaG93KGVsZXMpOyAvLyBTaG93IGdpdmVuIGVsZXNcbiAgICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XG4gICAgICByZXN1bHQuZWxlcyA9IGN5LnZpZXdVdGlsaXRpZXMoKS5oaWRlKGVsZXMpOyAvLyBIaWRlIHByZXZpb3VzbHkgdW5oaWRkZW4gZWxlcztcblxuICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBIaWRlIGVsZXMgYW5kIHBlcmZvcm0gbGF5b3V0LlxuICAgICAqL1xuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmhpZGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcblxuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XG5cbiAgICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICAgICAgcmVzdWx0LmVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmhpZGVBbmRQZXJmb3JtTGF5b3V0KHBhcmFtLmVsZXMsIHBhcmFtLmxheW91dHBhcmFtKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLmhpZGUoZWxlcyk7IC8vIEhpZGUgZ2l2ZW4gZWxlc1xuICAgICAgICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9IaWRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuICAgICAgICByZXN1bHQuZWxlcyA9IGN5LnZpZXdVdGlsaXRpZXMoKS5zaG93KGVsZXMpOyAvLyBTaG93IHByZXZpb3VzbHkgaGlkZGVuIGVsZXNcblxuICAgICAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogRGVsZXRlIGVsZXMgYW5kIHBlcmZvcm0gbGF5b3V0LlxuICAgICAqL1xuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcblxuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcblxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICAgIHJlc3VsdC5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5kZWxldGVBbmRQZXJmb3JtTGF5b3V0KHBhcmFtLmVsZXMsIHBhcmFtLmxheW91dHBhcmFtKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAgIHJlc3VsdC5lbGVzID0gZWxlcy5yZW1vdmUoKTtcbiAgICAgICAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9EZWxldGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XG4gICAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMoZWxlcyk7IFxuXG4gICAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gICAgLy8gU2VjdGlvbiBFbmRcbiAgICAvLyBnZW5lcmFsIGFjdGlvbiBmdW5jdGlvbnNcblxuICAgIC8vIFNlY3Rpb24gU3RhcnRcbiAgICAvLyBzYmduIGFjdGlvbiBmdW5jdGlvbnNcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgfTtcbiAgICAgIHJlc3VsdC50eXBlID0gcGFyYW0udHlwZTtcbiAgICAgIHJlc3VsdC5ub2RlcyA9IHBhcmFtLm5vZGVzO1xuICAgICAgcmVzdWx0LmluZGV4ID0gcGFyYW0uaW5kZXg7XG4gICAgICB2YXIgZGF0YSA9IHBhcmFtLmRhdGE7XG5cbiAgICAgIHZhciB0ZW1wRGF0YSA9IGVsZW1lbnRVdGlsaXRpZXMuc2F2ZVVuaXRzKHBhcmFtLm5vZGVzKTtcbiAgICAgIHJlc3VsdC52YWx1ZSA9IGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gocGFyYW0ubm9kZXMsIHBhcmFtLmluZGV4LCBwYXJhbS52YWx1ZSwgcGFyYW0udHlwZSk7XG4gICAgICAvKiB2YXIgbG9jYXRpb25zID0gZWxlbWVudFV0aWxpdGllcy5jaGVja0ZpdChwYXJhbS5ub2Rlcyk7XG4gICAgICBpZiAobG9jYXRpb25zICE9PSB1bmRlZmluZWQgJiYgbG9jYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5maXRVbml0cyhwYXJhbS5ub2RlcywgbG9jYXRpb25zKTtcbiAgICAgIH0gKi9cbiAgICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlVW5pdHMocGFyYW0ubm9kZXMsIGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xuICAgICAgcmVzdWx0LmRhdGEgPSB0ZW1wRGF0YTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgb2JqID0gcGFyYW0ub2JqO1xuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gICAgICB2YXIgZGF0YSA9IHBhcmFtLmRhdGE7XG5cbiAgICAgIHZhciB0ZW1wRGF0YSA9IGVsZW1lbnRVdGlsaXRpZXMuc2F2ZVVuaXRzKG5vZGVzKTtcbiAgICAgIHZhciBsb2NhdGlvbk9iaiA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XG4gICAgIC8qICB2YXIgbG9jYXRpb25zID0gZWxlbWVudFV0aWxpdGllcy5jaGVja0ZpdChub2Rlcyk7XG4gICAgICBpZiAobG9jYXRpb25zICE9PSB1bmRlZmluZWQgJiYgbG9jYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5maXRVbml0cyhub2RlcywgbG9jYXRpb25zKTtcbiAgICAgIH0gKi9cbiAgICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlVW5pdHMobm9kZXMsIGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGxvY2F0aW9uT2JqOiBsb2NhdGlvbk9iaixcbiAgICAgICAgb2JqOiBvYmosXG4gICAgICAgIGRhdGE6IHRlbXBEYXRhXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBsb2NhdGlvbk9iaiA9IHBhcmFtLmxvY2F0aW9uT2JqO1xuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gICAgICB2YXIgZGF0YSA9IHBhcmFtLmRhdGE7XG5cbiAgICAgIHZhciB0ZW1wRGF0YSA9IGVsZW1lbnRVdGlsaXRpZXMuc2F2ZVVuaXRzKG5vZGVzKTtcbiAgICAgIHZhciBvYmogPSBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94KG5vZGVzLCBsb2NhdGlvbk9iaik7XG4gICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZVVuaXRzKG5vZGVzLCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBvYmo6IG9iaixcbiAgICAgICAgZGF0YTogdGVtcERhdGFcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5maXRVbml0cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIG5vZGUgPSBwYXJhbS5ub2RlO1xuICAgICAgdmFyIGxvY2F0aW9ucyA9IHBhcmFtLmxvY2F0aW9ucztcbiAgICAgIHZhciBvYmogPSBlbGVtZW50VXRpbGl0aWVzLmZpdFVuaXRzKG5vZGUsIGxvY2F0aW9ucyk7XG5cbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgIG9iajogb2JqLFxuICAgICAgICBsb2NhdGlvbnM6IGxvY2F0aW9uc1xuICAgICAgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVVbml0cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIG5vZGUgPSBwYXJhbS5ub2RlO1xuICAgICAgdmFyIGxvY2F0aW9ucyA9IHBhcmFtLmxvY2F0aW9ucztcbiAgICAgIHZhciBvYmogPSBwYXJhbS5vYmo7XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmZvckVhY2goIGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgICAgdmFyIGJveCA9IG9ialtpbmRleCsrXTtcbiAgICAgICAgZWxlLmJib3gueCA9IGJveC54O1xuICAgICAgICBlbGUuYmJveC55ID0gYm94Lnk7XG4gICAgICAgIHZhciBvbGRTaWRlID0gZWxlLmFuY2hvclNpZGU7XG4gICAgICAgIGVsZS5hbmNob3JTaWRlID0gYm94LmFuY2hvclNpZGU7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW9kaWZ5VW5pdHMobm9kZSwgZWxlLCBvbGRTaWRlKTtcbiAgICAgIH0pO1xuXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICBsb2NhdGlvbnM6IGxvY2F0aW9uc1xuICAgICAgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gICAgICB2YXIgc3RhdHVzID0gcGFyYW0uc3RhdHVzO1xuICAgICAgdmFyIHJlc3VsdFN0YXR1cyA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcblxuICAgICAgICByZXN1bHRTdGF0dXNbbm9kZS5pZCgpXSA9IGlzTXVsdGltZXI7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IHRpbWUgY2hhbmdlIHRoZSBzdGF0dXMgb2YgYWxsIG5vZGVzIGF0IG9uY2UuXG4gICAgICAvLyBJZiBub3QgY2hhbmdlIHN0YXR1cyBvZiBlYWNoIHNlcGVyYXRlbHkgdG8gdGhlIHZhbHVlcyBtYXBwZWQgdG8gdGhlaXIgaWQuXG4gICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2RlLCBzdGF0dXNbbm9kZS5pZCgpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIC8vICBpZiAoIWZpcnN0VGltZSAmJiBfLmlzRXF1YWwobm9kZXMsIGN5Lm5vZGVzKCc6c2VsZWN0ZWQnKSkpIHtcbiAgICAvLyAgICAkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIiwgISQoJyNpbnNwZWN0b3ItaXMtbXVsdGltZXInKS5hdHRyKFwiY2hlY2tlZFwiKSk7XG4gICAgLy8gIH1cblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgc3RhdHVzOiByZXN1bHRTdGF0dXMsXG4gICAgICAgIG5vZGVzOiBub2Rlc1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICAgICAgdmFyIHN0YXR1cyA9IHBhcmFtLnN0YXR1cztcbiAgICAgIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gICAgICB2YXIgcmVzdWx0U3RhdHVzID0ge307XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBub2RlLmRhdGEoJ2Nsb25lbWFya2VyJyk7XG4gICAgICAgIHZhciBjdXJyZW50U3RhdHVzID0gZmlyc3RUaW1lID8gc3RhdHVzIDogc3RhdHVzW25vZGUuaWQoKV07XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZSwgY3VycmVudFN0YXR1cyk7XG4gICAgICB9XG5cbiAgICAvLyAgaWYgKCFmaXJzdFRpbWUgJiYgXy5pc0VxdWFsKG5vZGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XG4gICAgLy8gICAgJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiKSk7XG4gICAgLy8gIH1cblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgc3RhdHVzOiByZXN1bHRTdGF0dXMsXG4gICAgICAgIG5vZGVzOiBub2Rlc1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgLy8gcGFyYW06IHtjbGFzczogc2JnbmNsYXNzLCBuYW1lOiBwcm9wZXJ0eU5hbWUsIHZhbHVlOiB2YWx1ZX1cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHkgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBzYmduY2xhc3MgPSBwYXJhbS5jbGFzcztcbiAgICAgIHZhciBuYW1lID0gcGFyYW0ubmFtZTtcbiAgICAgIHZhciB2YWx1ZSA9IHBhcmFtLnZhbHVlO1xuICAgICAgdmFyIGNsYXNzRGVmYXVsdHMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKHNiZ25jbGFzcyk7XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBjbGFzczogc2JnbmNsYXNzLFxuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICB2YWx1ZTogY2xhc3NEZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA/IGNsYXNzRGVmYXVsdHNbbmFtZV0gOiB1bmRlZmluZWRcbiAgICAgIH07XG5cbiAgICAgIHZhciBwcm9wTWFwID0ge307XG4gICAgICBwcm9wTWFwWyBuYW1lIF0gPSB2YWx1ZTtcblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXREZWZhdWx0UHJvcGVydGllcyggc2JnbmNsYXNzLCBwcm9wTWFwICk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGJnT2JqID0gcGFyYW0uYmdPYmo7XG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgICAgIHZhciB1cGRhdGVJbmZvID0gcGFyYW0udXBkYXRlSW5mbztcbiAgICAgIHZhciBwcm9tcHRJbnZhbGlkSW1hZ2UgPSBwYXJhbS5wcm9tcHRJbnZhbGlkSW1hZ2U7XG4gICAgICB2YXIgdmFsaWRhdGVVUkwgPSBwYXJhbS52YWxpZGF0ZVVSTDtcblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIGJnT2JqLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKTtcblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBiZ09iajogYmdPYmosXG4gICAgICAgIHVwZGF0ZUluZm86IHVwZGF0ZUluZm8sXG4gICAgICAgIHByb21wdEludmFsaWRJbWFnZTogcHJvbXB0SW52YWxpZEltYWdlLFxuICAgICAgICB2YWxpZGF0ZVVSTDogdmFsaWRhdGVVUkxcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBiZ09iaiA9IHBhcmFtLmJnT2JqO1xuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlQmFja2dyb3VuZEltYWdlKG5vZGVzLCBiZ09iaik7XG5cbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgYmdPYmo6IGJnT2JqXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgYmdPYmogPSBwYXJhbS5iZ09iajtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gICAgICB2YXIgb2xkQmdPYmogPSBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUJhY2tncm91bmRJbWFnZShub2RlcywgYmdPYmopO1xuXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGJnT2JqOiBvbGRCZ09ialxuICAgICAgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIG9sZEltZyA9IHBhcmFtLm9sZEltZztcbiAgICAgIHZhciBuZXdJbWcgPSBwYXJhbS5uZXdJbWc7XG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgICAgIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gICAgICB2YXIgdXBkYXRlSW5mbyA9IHBhcmFtLnVwZGF0ZUluZm87XG4gICAgICB2YXIgcHJvbXB0SW52YWxpZEltYWdlID0gcGFyYW0ucHJvbXB0SW52YWxpZEltYWdlO1xuICAgICAgdmFyIHZhbGlkYXRlVVJMPSBwYXJhbS52YWxpZGF0ZVVSTDtcblxuICAgICAgdmFyIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQmFja2dyb3VuZEltYWdlKG5vZGVzLCBvbGRJbWcsIG5ld0ltZywgZmlyc3RUaW1lLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKTtcblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgLy8gU2VjdGlvbiBFbmRcbiAgICAvLyBzYmduIGFjdGlvbiBmdW5jdGlvbnNcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jb252ZXJ0SW50b1JldmVyc2libGVSZWFjdGlvbiA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgbGV0IGNvbGxlY3Rpb24gPSBjeS5jb2xsZWN0aW9uKCk7XG4gICAgICBsZXQgbWFwVHlwZSA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKHBhcmFtLm1hcFR5cGUpO1xuICAgICAgJCgnI21hcC10eXBlJykudmFsKHBhcmFtLm1hcFR5cGUpO1xuXG4gICAgICBwYXJhbS5jb2xsZWN0aW9uLmZvckVhY2goZnVuY3Rpb24oZWRnZSkge1xuICAgICAgICB2YXIgc291cmNlTm9kZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zb3VyY2U7XG4gICAgICAgIHZhciB0YXJnZXROb2RlID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnRhcmdldDtcblxuICAgICAgICBlZGdlLm1vdmUoe3NvdXJjZTogdGFyZ2V0Tm9kZSwgdGFyZ2V0OiBzb3VyY2VOb2RlfSk7XG5cbiAgICAgICAgbGV0IGNvbnZlcnRlZEVkZ2UgPSBjeS5nZXRFbGVtZW50QnlJZChlZGdlLmlkKCkpO1xuXG4gICAgICAgIGlmKGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWJlbmRlZGl0aW5nRGlzdGFuY2VzXCIpKXtcbiAgICAgICAgICBsZXQgZGlzdGFuY2UgPSBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlc1wiKTtcbiAgICAgICAgICBkaXN0YW5jZSA9IGRpc3RhbmNlLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gLTEqZWxlbWVudDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlc1wiLCBkaXN0YW5jZS5yZXZlcnNlKCkpO1xuXG4gICAgICAgICAgbGV0IHdlaWdodCA9IGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWJlbmRlZGl0aW5nV2VpZ2h0c1wiKTtcbiAgICAgICAgICB3ZWlnaHQgPSB3ZWlnaHQubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAxLWVsZW1lbnQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlYmVuZGVkaXRpbmdXZWlnaHRzXCIsIHdlaWdodC5yZXZlcnNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlY29udHJvbGVkaXRpbmdEaXN0YW5jZXNcIikpe1xuICAgICAgICAgIGxldCBkaXN0YW5jZSA9IGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWNvbnRyb2xlZGl0aW5nRGlzdGFuY2VzXCIpO1xuICAgICAgICAgIGRpc3RhbmNlID0gZGlzdGFuY2UubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAtMSplbGVtZW50O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWNvbnRyb2xlZGl0aW5nRGlzdGFuY2VzXCIsIGRpc3RhbmNlLnJldmVyc2UoKSk7XG5cbiAgICAgICAgICBsZXQgd2VpZ2h0ID0gY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlY29udHJvbGVkaXRpbmdXZWlndGhzXCIpO1xuICAgICAgICAgIHdlaWdodCA9IHdlaWdodC5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIDEtZWxlbWVudDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2Vjb250cm9sZWRpdGluZ1dlaWd0aHNcIiwgd2VpZ2h0LnJldmVyc2UoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID09PSBcImNvbnN1bXB0aW9uXCIpIHtcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLl9wcml2YXRlLmRhdGEuY2xhc3MgPSBcInByb2R1Y3Rpb25cIjtcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLl9wcml2YXRlLmRhdGEucG9ydHNvdXJjZSA9IHRhcmdldE5vZGUgKyBcIi4xXCI7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnR0YXJnZXQgPSBzb3VyY2VOb2RlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLl9wcml2YXRlLmRhdGEuY2xhc3MgPSBcImNvbnN1bXB0aW9uXCI7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnRzb3VyY2UgPSB0YXJnZXROb2RlO1xuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0dGFyZ2V0ID0gc291cmNlTm9kZSArIFwiLjFcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uLmFkZChjb252ZXJ0ZWRFZGdlKTtcbiAgICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLFxuICAgICAgICBtYXBUeXBlOiBtYXBUeXBlLFxuICAgICAgICBwcm9jZXNzSWQ6IHBhcmFtLnByb2Nlc3NJZFxuICAgICAgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMubW92ZUVkZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuICAgICAgdmFyIGVkZ2UgPSBwYXJhbS5lZGdlO1xuICAgICAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lOyAgICAgIFxuICAgICBcblxuICAgICAgcmVzdWx0LnNvdXJjZSA9IGVkZ2Uuc291cmNlKCkuaWQoKTtcbiAgICAgIHJlc3VsdC50YXJnZXQgPSBlZGdlLnRhcmdldCgpLmlkKCk7ICAgICAgXG4gICAgICByZXN1bHQucG9ydHNvdXJjZSAgPWVkZ2UuZGF0YShcInBvcnRzb3VyY2VcIik7XG4gICAgICByZXN1bHQucG9ydHRhcmdldCA9IGVkZ2UuZGF0YShcInBvcnR0YXJnZXRcIik7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWRnZSwgJ3NvdXJjZScsIHBhcmFtLnNvdXJjZSk7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWRnZSwgJ3RhcmdldCcsIHBhcmFtLnRhcmdldCk7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWRnZSwgJ3BvcnRzb3VyY2UnLCBwYXJhbS5wb3J0c291cmNlKTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlZGdlLCAncG9ydHRhcmdldCcsIHBhcmFtLnBvcnR0YXJnZXQpOyBcbiAgICAgIGVkZ2UgPSBlZGdlLm1vdmUoe1xuICAgICAgICB0YXJnZXQ6IHBhcmFtLnRhcmdldCxcbiAgICAgICAgc291cmNlIDogcGFyYW0uc291cmNlXG4gICAgXG4gICAgIH0pO1xuXG4gICAgIHJlc3VsdC5lZGdlID0gZWRnZTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmZpeEVycm9yID0gZnVuY3Rpb24ocGFyYW0pe1xuICAgICAgXG4gICAgICB2YXIgZXJyb3JDb2RlID0gcGFyYW0uZXJyb3JDb2RlO1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IGVycm9yQ29kZTtcbiAgICAgIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDFcIiB8fCBlcnJvckNvZGUgPT0gJ3BkMTAxMDInKXtcblxuICAgICAgICByZXN1bHQuZWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMucmV2ZXJzZUVkZ2UocGFyYW0uZWRnZSk7XG5cbiAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTAzXCIgfHwgZXJyb3JDb2RlID09ICdwZDEwMTA3Jyl7XG5cbiAgICAgICBcbiAgICAgICAgXG4gICAgICAgIHBhcmFtLm5ld05vZGVzLmZvckVhY2goZnVuY3Rpb24obmV3Tm9kZSl7XG4gICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUobmV3Tm9kZS54LCBuZXdOb2RlLnksIG5ld05vZGUuY2xhc3MsIG5ld05vZGUuaWQsIHVuZGVmaW5lZCk7XG5cbiAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGFyYW0ubmV3RWRnZXMuZm9yRWFjaChmdW5jdGlvbihuZXdFZGdlKXsgICAgICAgICAgXG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG5ld0VkZ2Uuc291cmNlLG5ld0VkZ2UudGFyZ2V0LG5ld0VkZ2UuY2xhc3MpO1xuICAgICAgICB9KTtcblxuICAgICAgICBwYXJhbS5vbGRFZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKG9sZEVkZ2Upe1xuICAgICAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICAgICAgICAvL3JldHVybiBcbiAgICAgICAgICBvbGRFZGdlLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBwYXJhbS5ub2RlLnJlbW92ZSgpO1xuXG4gICAgICAgIHJldHVybiBwYXJhbTtcblxuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwNVwiIHx8IGVycm9yQ29kZSA9PSAncGQxMDEwNicpe1xuICAgXG4gICAgICAgIHJlc3VsdC5lZGdlID0gZWxlbWVudFV0aWxpdGllcy5yZXZlcnNlRWRnZShwYXJhbS5lZGdlKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxNDBcIil7XG4gICAgICAgIHBhcmFtLm5vZGUucmVtb3ZlKCk7XG4gICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDRcIikge1xuICAgICAgICBcbiAgICAgICAgcGFyYW0uZWRnZXMuZm9yRWFjaChmdW5jdGlvbihlZGdlKXtcbiAgICAgICAgICBlZGdlLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgICBub2RlLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBhcmFtO1xuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwOFwiKXtcbiAgICAgICAgcGFyYW0uZWRnZXMuZm9yRWFjaChmdW5jdGlvbihlZGdlKXtcbiAgICAgICAgICBlZGdlLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgICBub2RlLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBhcmFtO1xuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDExMVwiKXtcbiAgICAgICAgcGFyYW0uZWRnZXMuZm9yRWFjaChmdW5jdGlvbihlZGdlKXtcbiAgICAgICAgICBlZGdlLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBhcmFtO1xuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEyNlwiKXtcbiAgICAgICAgcGFyYW0uZWRnZXMuZm9yRWFjaChmdW5jdGlvbihlZGdlKXtcbiAgICAgICAgICBlZGdlLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgICBub2RlLnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBhcmFtO1xuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwOVwiIHx8IGVycm9yQ29kZSA9PSBcInBkMTAxMjRcIikge1xuICAgICAgICBcbiAgICAgICAgcmVzdWx0Lm5ld1NvdXJjZSA9IHBhcmFtLmVkZ2UuZGF0YSgpLnNvdXJjZTtcbiAgICAgICAgcmVzdWx0Lm5ld1RhcmdldCA9IHBhcmFtLmVkZ2UuZGF0YSgpLnRhcmdldDtcbiAgICAgICAgcmVzdWx0LnBvcnRzb3VyY2UgPSBwYXJhbS5lZGdlLmRhdGEoKS5wb3J0c291cmNlO1xuICAgICAgICB2YXIgY2xvbmVkRWRnZSA9IHBhcmFtLmVkZ2UuY2xvbmUoKTtcbiAgICAgICBcbiAgICAgICAgdmFyIGVkZ2VQYXJhbXMgPSB7Y2xhc3MgOiBjbG9uZWRFZGdlLmRhdGEoKS5jbGFzcywgbGFuZ3VhZ2UgOmNsb25lZEVkZ2UuZGF0YSgpLmxhbmd1YWdlfTtcbiAgICAgICAgY2xvbmVkRWRnZS5kYXRhKCkuc291cmNlID0gcGFyYW0ubmV3U291cmNlO1xuICAgICAgICBjbG9uZWRFZGdlLmRhdGEoKS50YXJnZXQgPSBwYXJhbS5uZXdUYXJnZXQ7XG4gICAgICAgIGN5LnJlbW92ZShwYXJhbS5lZGdlKTtcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocGFyYW0ubmV3U291cmNlLHBhcmFtLm5ld1RhcmdldCxlZGdlUGFyYW1zLCBjbG9uZWRFZGdlLmRhdGEoKS5pZCk7ICAgICAgXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMTJcIikgeyAgICBcbiAgICAgICAgXG4gICAgICAgIHBhcmFtLmNhbGxiYWNrID0gZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXI7ICBcbiAgICAgICAgLy8gSWYgdGhpcyBpcyBmaXJzdCB0aW1lIHdlIHNob3VsZCBtb3ZlIHRoZSBub2RlIHRvIGl0cyBuZXcgcGFyZW50IGFuZCByZWxvY2F0ZSBpdCBieSBnaXZlbiBwb3NEaWZmIHBhcmFtc1xuICAgICAgICAvLyBlbHNlIHdlIHNob3VsZCByZW1vdmUgdGhlIG1vdmVkIGVsZXMgYW5kIHJlc3RvcmUgdGhlIGVsZXMgdG8gcmVzdG9yZVxuICAgICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICAgICAgdmFyIG5ld1BhcmVudElkID0gcGFyYW0ucGFyZW50RGF0YSA9PSB1bmRlZmluZWQgPyBudWxsIDogcGFyYW0ucGFyZW50RGF0YTtcbiAgICAgICAgICAvLyBUaGVzZSBlbGVzIGluY2x1ZGVzIHRoZSBub2RlcyBhbmQgdGhlaXIgY29ubmVjdGVkIGVkZ2VzIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZXMubW92ZSgpLlxuICAgICAgICAgIC8vIFRoZXkgc2hvdWxkIGJlIHJlc3RvcmVkIGluIHVuZG9cbiAgICAgICAgICB2YXIgd2l0aERlc2NlbmRhbnQgPSBwYXJhbS5ub2Rlcy51bmlvbihwYXJhbS5ub2Rlcy5kZXNjZW5kYW50cygpKTtcbiAgICAgICAgICByZXN1bHQuZWxlc1RvUmVzdG9yZSA9IHdpdGhEZXNjZW5kYW50LnVuaW9uKHdpdGhEZXNjZW5kYW50LmNvbm5lY3RlZEVkZ2VzKCkpO1xuICAgICAgICAgIC8vIFRoZXNlIGFyZSB0aGUgZWxlcyBjcmVhdGVkIGJ5IG5vZGVzLm1vdmUoKSwgdGhleSBzaG91bGQgYmUgcmVtb3ZlZCBpbiB1bmRvLlxuICAgICAgICAgIHJlc3VsdC5tb3ZlZEVsZXMgPSBwYXJhbS5ub2Rlcy5tb3ZlKHtcInBhcmVudFwiOiBuZXdQYXJlbnRJZH0pO1xuXG4gICAgICAgICAgdmFyIHBvc0RpZmYgPSB7XG4gICAgICAgICAgICB4OiBwYXJhbS5wb3NEaWZmWCxcbiAgICAgICAgICAgIHk6IHBhcmFtLnBvc0RpZmZZXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHBvc0RpZmYsIHJlc3VsdC5tb3ZlZEVsZXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJlc3VsdC5lbGVzVG9SZXN0b3JlID0gcGFyYW0ubW92ZWRFbGVzLnJlbW92ZSgpO1xuICAgICAgICAgIHJlc3VsdC5tb3ZlZEVsZXMgPSBwYXJhbS5lbGVzVG9SZXN0b3JlLnJlc3RvcmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJhbS5jYWxsYmFjaykge1xuICAgICAgICAgIHJlc3VsdC5jYWxsYmFjayA9IHBhcmFtLmNhbGxiYWNrOyAvLyBrZWVwIHRoZSBwcm92aWRlZCBjYWxsYmFjayBzbyBpdCBjYW4gYmUgcmV1c2VkIGFmdGVyIHVuZG8vcmVkb1xuICAgICAgICAgIHBhcmFtLmNhbGxiYWNrKHJlc3VsdC5tb3ZlZEVsZXMpOyAvLyBhcHBseSB0aGUgY2FsbGJhY2sgb24gbmV3bHkgY3JlYXRlZCBlbGVtZW50c1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIFxuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEyNVwiKSB7XG5cbiAgICAgICByZXN1bHQuZWRnZSA9IHBhcmFtLmVkZ2UucmVtb3ZlKCk7ICAgICAgIFxuICAgICAgIHJlc3VsdC5uZXdFZGdlID17fTtcbiAgICAgICB2YXIgZWRnZWNsYXNzID0gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zLmNsYXNzID8gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zLmNsYXNzIDogcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zO1xuICAgICAgIHZhciB2YWxpZGF0aW9uID0gZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyhlZGdlY2xhc3MsIGN5LmdldEVsZW1lbnRCeUlkKHBhcmFtLm5ld0VkZ2Uuc291cmNlKSwgY3kuZ2V0RWxlbWVudEJ5SWQocGFyYW0ubmV3RWRnZS50YXJnZXQpKTtcblxuICAgICAgIGlmICh2YWxpZGF0aW9uID09PSAncmV2ZXJzZScpIHtcbiAgICAgICAgdmFyIHRlbXAgPSBwYXJhbS5uZXdFZGdlLnNvdXJjZTtcbiAgICAgICAgcGFyYW0ubmV3RWRnZS5zb3VyY2UgPSBwYXJhbS5uZXdFZGdlLnRhcmdldDtcbiAgICAgICAgcGFyYW0ubmV3RWRnZS50YXJnZXQgPSB0ZW1wO1xuICAgICAgfVxuICAgICAgIHJlc3VsdC5uZXdFZGdlLmlkID1lbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocGFyYW0ubmV3RWRnZS5zb3VyY2UscGFyYW0ubmV3RWRnZS50YXJnZXQscGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zKS5pZCgpO1xuICAgICAgIHJlc3VsdC5uZXdFZGdlLnNvdXJjZSA9IHBhcmFtLm5ld0VkZ2Uuc291cmNlO1xuICAgICAgIHJlc3VsdC5uZXdFZGdlLnRhcmdldCA9IHBhcmFtLm5ld0VkZ2UudGFyZ2V0O1xuICAgICAgIHJlc3VsdC5uZXdFZGdlLmVkZ2VQYXJhbXMgPSBwYXJhbS5uZXdFZGdlLmVkZ2VQYXJhbXM7XG4gICAgICAgXG4gICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgICAgICBcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxNDJcIikge1xuICAgICAgICByZXN1bHQuZWRnZSA9IHBhcmFtLmVkZ2UucmVtb3ZlKCk7ICAgICAgIFxuICAgICAgICByZXN1bHQubmV3RWRnZSA9e307XG4gICAgICAgIHZhciBlZGdlY2xhc3MgPSBwYXJhbS5uZXdFZGdlLmVkZ2VQYXJhbXMuY2xhc3MgPyBwYXJhbS5uZXdFZGdlLmVkZ2VQYXJhbXMuY2xhc3MgOiBwYXJhbS5uZXdFZGdlLmVkZ2VQYXJhbXM7XG4gICAgICAgIHZhciB2YWxpZGF0aW9uID0gZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyhlZGdlY2xhc3MsIGN5LmdldEVsZW1lbnRCeUlkKHBhcmFtLm5ld0VkZ2Uuc291cmNlKSwgY3kuZ2V0RWxlbWVudEJ5SWQocGFyYW0ubmV3RWRnZS50YXJnZXQpKTtcblxuICAgICAgICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XG4gICAgICAgICB2YXIgdGVtcCA9IHBhcmFtLm5ld0VkZ2Uuc291cmNlO1xuICAgICAgICAgcGFyYW0ubmV3RWRnZS5zb3VyY2UgPSBwYXJhbS5uZXdFZGdlLnRhcmdldDtcbiAgICAgICAgIHBhcmFtLm5ld0VkZ2UudGFyZ2V0ID0gdGVtcDtcbiAgICAgICB9XG4gICAgICAgIHJlc3VsdC5uZXdFZGdlLmlkID1lbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocGFyYW0ubmV3RWRnZS5zb3VyY2UscGFyYW0ubmV3RWRnZS50YXJnZXQscGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zKS5pZCgpO1xuICAgICAgICByZXN1bHQubmV3RWRnZS5zb3VyY2UgPSBwYXJhbS5uZXdFZGdlLnNvdXJjZTtcbiAgICAgICAgcmVzdWx0Lm5ld0VkZ2UudGFyZ2V0ID0gcGFyYW0ubmV3RWRnZS50YXJnZXQ7XG4gICAgICAgIHJlc3VsdC5uZXdFZGdlLmVkZ2VQYXJhbXMgPSBwYXJhbS5uZXdFZGdlLmVkZ2VQYXJhbXM7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfWVsc2Uge1xuXG4gICAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLnNvdXJjZSgpLmlkKCk7XG4gICAgICAgIHJlc3VsdC5uZXdUYXJnZXQgPSBwYXJhbS5lZGdlLnRhcmdldCgpLmlkKCk7XG4gICAgICAgIHJlc3VsdC5wb3J0dGFyZ2V0ID0gcGFyYW0uZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiKTtcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLm1vdmUoe1xuICAgICAgICAgIHRhcmdldDogcGFyYW0ubmV3VGFyZ2V0LFxuICAgICAgICAgIHNvdXJjZSA6IHBhcmFtLm5ld1NvdXJjZSAgICAgIFxuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEocmVzdWx0LmVkZ2UsICdwb3J0dGFyZ2V0JywgcGFyYW0ucG9ydHRhcmdldCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIFxuICAgICAgfVxuICAgICAgXG4gIH1cbiAgXG4gIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZml4RXJyb3IgPSBmdW5jdGlvbihwYXJhbSl7XG4gICAgdmFyIGVycm9yQ29kZSA9IHBhcmFtLmVycm9yQ29kZTtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgcmVzdWx0LmVycm9yQ29kZSA9IGVycm9yQ29kZTtcbiAgICBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTAxXCIgfHwgZXJyb3JDb2RlID09ICdwZDEwMTAyJyl7XG4gICAgIFxuICAgICAgICByZXN1bHQuZWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMucmV2ZXJzZUVkZ2UocGFyYW0uZWRnZSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDNcIiB8fCBlcnJvckNvZGUgPT0gJ3BkMTAxMDcnKXtcblxuICAgICAgcGFyYW0ubmV3Tm9kZXMuZm9yRWFjaChmdW5jdGlvbihuZXdOb2RlKXsgICAgXG4gICAgICAgIGN5LnJlbW92ZShjeS4kKCcjJytuZXdOb2RlLmlkKSkgICAgICBcbiAgICAgICAgXG4gICAgICB9KTtcblxuICAgICAgcGFyYW0ubm9kZS5yZXN0b3JlKCk7XG5cbiAgICAgIHBhcmFtLm9sZEVkZ2VzLmZvckVhY2goZnVuY3Rpb24ob2xkRWRnZSl7ICBcbiAgICAgICAgb2xkRWRnZS5yZXN0b3JlKCk7XG4gICAgICB9KTtcblxuICAgICAgY3kuYW5pbWF0ZSh7XG4gICAgICAgIGR1cmF0aW9uOiAxMDAsXG4gICAgICAgIGVhc2luZzogJ2Vhc2UnLFxuICAgICAgICBmaXQgOntlbGVzOnt9LHBhZGRpbmc6MjB9LCBcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHBhcmFtO1xuXG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwNVwiIHx8IGVycm9yQ29kZSA9PSAncGQxMDEwNicpeyAgXG5cbiAgICAgIHJlc3VsdC5lZGdlID0gZWxlbWVudFV0aWxpdGllcy5yZXZlcnNlRWRnZShwYXJhbS5lZGdlKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTQwXCIpe1xuICAgICAgcGFyYW0ubm9kZS5yZXN0b3JlKCk7XG4gICAgICBjeS5hbmltYXRlKHtcbiAgICAgICAgZHVyYXRpb246IDEwMCxcbiAgICAgICAgZWFzaW5nOiAnZWFzZScsXG4gICAgICAgIGZpdCA6e2VsZXM6e30scGFkZGluZzoyMH0sIFxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBhcmFtO1xuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDRcIikge1xuICAgICAgXG4gICAgICBwYXJhbS5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgICBub2RlLnJlc3RvcmUoKTtcbiAgICAgIH0pO1xuICAgICAgcGFyYW0uZWRnZXMuZm9yRWFjaChmdW5jdGlvbihlZGdlKXtcbiAgICAgICAgZWRnZS5yZXN0b3JlKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA4XCIpe1xuICAgICAgXG4gICAgICBwYXJhbS5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgICBub2RlLnJlc3RvcmUoKTtcbiAgICAgIH0pO1xuICAgICAgcGFyYW0uZWRnZXMuZm9yRWFjaChmdW5jdGlvbihlZGdlKXtcbiAgICAgICAgZWRnZS5yZXN0b3JlKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTExXCIpe1xuICAgICAgcGFyYW0uZWRnZXMuZm9yRWFjaChmdW5jdGlvbihlZGdlKXtcbiAgICAgICAgZWRnZS5yZXN0b3JlKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTI2XCIpe1xuICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgbm9kZS5yZXN0b3JlKCk7XG4gICAgICB9KTtcbiAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xuICAgICAgfSk7ICAgICAgIFxuICAgICAgcmV0dXJuIHBhcmFtO1xuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDlcIiB8fCBlcnJvckNvZGUgPT0gXCJwZDEwMTI0XCIpIHtcblxuICAgICAgcmVzdWx0Lm5ld1NvdXJjZSA9IHBhcmFtLmVkZ2Uuc291cmNlKCkuaWQoKTtcbiAgICAgIHJlc3VsdC5uZXdUYXJnZXQgPSBwYXJhbS5lZGdlLnRhcmdldCgpLmlkKCk7XG4gICAgICByZXN1bHQucG9ydHNvdXJjZSA9IHBhcmFtLnBvcnRzb3VyY2U7XG4gICAgICByZXN1bHQuZWRnZSA9IHBhcmFtLmVkZ2UubW92ZSh7XG4gICAgICAgIHRhcmdldDogcGFyYW0ubmV3VGFyZ2V0LFxuICAgICAgICBzb3VyY2UgOiBwYXJhbS5uZXdTb3VyY2UgICAgICBcbiAgICAgIH0pO1xuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEocmVzdWx0LmVkZ2UsICdwb3J0c291cmNlJywgcGFyYW0ucG9ydHNvdXJjZSk7IFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTEyXCIpIHtcbiAgICAgXG4gICAgICAvLyBJZiB0aGlzIGlzIGZpcnN0IHRpbWUgd2Ugc2hvdWxkIG1vdmUgdGhlIG5vZGUgdG8gaXRzIG5ldyBwYXJlbnQgYW5kIHJlbG9jYXRlIGl0IGJ5IGdpdmVuIHBvc0RpZmYgcGFyYW1zXG4gICAgICAvLyBlbHNlIHdlIHNob3VsZCByZW1vdmUgdGhlIG1vdmVkIGVsZXMgYW5kIHJlc3RvcmUgdGhlIGVsZXMgdG8gcmVzdG9yZVxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICB2YXIgbmV3UGFyZW50SWQgPSBwYXJhbS5wYXJlbnREYXRhID09IHVuZGVmaW5lZCA/IG51bGwgOiBwYXJhbS5wYXJlbnREYXRhO1xuICAgICAgICAvLyBUaGVzZSBlbGVzIGluY2x1ZGVzIHRoZSBub2RlcyBhbmQgdGhlaXIgY29ubmVjdGVkIGVkZ2VzIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZXMubW92ZSgpLlxuICAgICAgICAvLyBUaGV5IHNob3VsZCBiZSByZXN0b3JlZCBpbiB1bmRvXG4gICAgICAgIHZhciB3aXRoRGVzY2VuZGFudCA9IHBhcmFtLm5vZGVzLnVuaW9uKHBhcmFtLm5vZGVzLmRlc2NlbmRhbnRzKCkpO1xuICAgICAgICByZXN1bHQuZWxlc1RvUmVzdG9yZSA9IHdpdGhEZXNjZW5kYW50LnVuaW9uKHdpdGhEZXNjZW5kYW50LmNvbm5lY3RlZEVkZ2VzKCkpO1xuICAgICAgICAvLyBUaGVzZSBhcmUgdGhlIGVsZXMgY3JlYXRlZCBieSBub2Rlcy5tb3ZlKCksIHRoZXkgc2hvdWxkIGJlIHJlbW92ZWQgaW4gdW5kby5cbiAgICAgICAgcmVzdWx0Lm1vdmVkRWxlcyA9IHBhcmFtLm5vZGVzLm1vdmUoe1wicGFyZW50XCI6IG5ld1BhcmVudElkfSk7XG5cbiAgICAgICAgdmFyIHBvc0RpZmYgPSB7XG4gICAgICAgICAgeDogcGFyYW0ucG9zRGlmZlgsXG4gICAgICAgICAgeTogcGFyYW0ucG9zRGlmZllcbiAgICAgICAgfTtcblxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyhwb3NEaWZmLCByZXN1bHQubW92ZWRFbGVzKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQuZWxlc1RvUmVzdG9yZSA9IHBhcmFtLm1vdmVkRWxlcy5yZW1vdmUoKTtcbiAgICAgICAgcmVzdWx0Lm1vdmVkRWxlcyA9IHBhcmFtLmVsZXNUb1Jlc3RvcmUucmVzdG9yZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyYW0uY2FsbGJhY2spIHtcbiAgICAgICAgcmVzdWx0LmNhbGxiYWNrID0gcGFyYW0uY2FsbGJhY2s7IC8vIGtlZXAgdGhlIHByb3ZpZGVkIGNhbGxiYWNrIHNvIGl0IGNhbiBiZSByZXVzZWQgYWZ0ZXIgdW5kby9yZWRvXG4gICAgICAgIHBhcmFtLmNhbGxiYWNrKHJlc3VsdC5tb3ZlZEVsZXMpOyAvLyBhcHBseSB0aGUgY2FsbGJhY2sgb24gbmV3bHkgY3JlYXRlZCBlbGVtZW50c1xuICAgICAgfVxuXG4gICAgIFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIFxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMjVcIikge1xuXG4gICAgICBjeS4kKCcjJytwYXJhbS5uZXdFZGdlLmlkKS5yZW1vdmUoKTtcbiAgICAgIHBhcmFtLmVkZ2UgPSBwYXJhbS5lZGdlLnJlc3RvcmUoKTtcblxuICAgIFxuICAgICAgcmV0dXJuIHBhcmFtO1xuICAgICAgXG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDE0MlwiKSB7XG4gICAgICBjeS4kKCcjJytwYXJhbS5uZXdFZGdlLmlkKS5yZW1vdmUoKTtcbiAgICAgIHBhcmFtLmVkZ2UgPSBwYXJhbS5lZGdlLnJlc3RvcmUoKTtcblxuICAgIFxuICAgICAgcmV0dXJuIHBhcmFtO1xuICAgIH1lbHNlIHtcblxuICAgICAgcmVzdWx0Lm5ld1NvdXJjZSA9IHBhcmFtLmVkZ2Uuc291cmNlKCkuaWQoKTtcbiAgICAgIHJlc3VsdC5uZXdUYXJnZXQgPSBwYXJhbS5lZGdlLnRhcmdldCgpLmlkKCk7XG4gICAgICByZXN1bHQucG9ydHRhcmdldCA9IHBhcmFtLmVkZ2UuZGF0YShcInBvcnR0YXJnZXRcIik7XG4gICAgICByZXN1bHQuZWRnZSA9IHBhcmFtLmVkZ2UubW92ZSh7XG4gICAgICAgIHRhcmdldDogcGFyYW0ubmV3VGFyZ2V0LFxuICAgICAgICBzb3VyY2UgOiBwYXJhbS5uZXdTb3VyY2UgICAgICBcbiAgICAgIH0pO1xuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEocmVzdWx0LmVkZ2UsICdwb3J0dGFyZ2V0JywgcGFyYW0ucG9ydHRhcmdldCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgICBcbiAgICB9XG4gICAgXG4gIH1cblxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jbG9uZUhpZ2hEZWdyZWVOb2RlID0gZnVuY3Rpb24obm9kZSl7XG5cbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIG9sZFggPSBub2RlLnBvc2l0aW9uKCkueDtcbiAgICB2YXIgb2xkWSA9IG5vZGUucG9zaXRpb24oKS55O1xuICAgIFxuICAgIFxuICAgIHZhciBjbGFjdWxhdGVOZXdDbG9uZVBvc2l0aW9uID0gZnVuY3Rpb24oc291cmNlRW5kUG9pbnRYLHNvdXJjZUVuZFBvaW50WSx0YXJnZXRFbmRQb2ludFgsdGFyZ2V0RW5kUG9pbnRZLGRlc2lyZWREaXN0YW5jZSxkaXJlY3Rpb24pe1xuICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHRhcmdldEVuZFBvaW50WS1zb3VyY2VFbmRQb2ludFksMikrIE1hdGgucG93KHRhcmdldEVuZFBvaW50WC1zb3VyY2VFbmRQb2ludFgsMikpO1xuICAgICAgdmFyIHJhdGlvID0gZGVzaXJlZERpc3RhbmNlL2Rpc3RhbmNlO1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgaWYoZGlyZWN0aW9uID09IFwic291cmNlXCIpeyBcbiAgICAgICAgcmVzdWx0LmN4ID0gKCgxLXJhdGlvKSAqIHNvdXJjZUVuZFBvaW50WCkgICsgKHJhdGlvICogdGFyZ2V0RW5kUG9pbnRYKTtcbiAgICAgICAgcmVzdWx0LmN5ID0gKCgxLXJhdGlvKSAqIHNvdXJjZUVuZFBvaW50WSkgICsgKHJhdGlvICogdGFyZ2V0RW5kUG9pbnRZKTtcbiAgICAgIH1lbHNleyAgICAgIFxuICAgICAgICByZXN1bHQuY3ggPSAoKDEtcmF0aW8pICogdGFyZ2V0RW5kUG9pbnRYKSAgKyAocmF0aW8gKiBzb3VyY2VFbmRQb2ludFgpO1xuICAgICAgICByZXN1bHQuY3kgPSAoKDEtcmF0aW8pICogdGFyZ2V0RW5kUG9pbnRZKSAgKyAocmF0aW8gKiBzb3VyY2VFbmRQb2ludFkpO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07ICAgXG4gICAgdmFyIGVkZ2VzID0gbm9kZS5jb25uZWN0ZWRFZGdlcygpO1xuICAgIHZhciBkZXNpcmVkRGlzdGFuY2UgPSAobm9kZS5oZWlnaHQoKSA+IG5vZGUud2lkdGgoKT8gbm9kZS5oZWlnaHQoKTogbm9kZS53aWR0aCgpKSogMC4xO1xuICAgIGZvcih2YXIgaSA9IDEgOyBpIDwgZWRnZXMubGVuZ3RoIDsgaSsrKXtcbiAgICAgIHZhciBlZGdlID0gZWRnZXNbaV07XG4gICAgICB2YXIgaW5kZXggPSBpO1xuICAgICAgdmFyIGVkZ2VDbG9uZSA9IGVkZ2UuY2xvbmUoKTtcbiAgICAgIHZhciBzdGFydFBvc2l0aW9uID0gZWRnZS5zb3VyY2UoKS5pZCgpID09IG5vZGUuaWQoKSA/IFwic291cmNlXCIgOiBcInRhcmdldFwiOyAgICBcbiAgICAgIHZhciBuZXdQb3NpdGlvbiA9IGNsYWN1bGF0ZU5ld0Nsb25lUG9zaXRpb24oZWRnZS5zb3VyY2VFbmRwb2ludCgpLngsZWRnZS5zb3VyY2VFbmRwb2ludCgpLnksZWRnZS50YXJnZXRFbmRwb2ludCgpLngsZWRnZS50YXJnZXRFbmRwb2ludCgpLnksZGVzaXJlZERpc3RhbmNlLHN0YXJ0UG9zaXRpb24pOyBcbiAgICAgIHZhciBuZXdOb2RlSWQgPSBub2RlLmlkKCkrJ2Nsb25lLScraW5kZXg7XG4gICAgICAvL2VkZ2VDbG9uZS5kYXRhKCkuaWQgPSBlZGdlQ2xvbmUuZGF0YSgpLmlkKyBcIi1cIituZXdOb2RlSWQ7XG4gICAgICBpZihlZGdlLnNvdXJjZSgpLmlkKCkgPT0gbm9kZS5pZCgpKXsgICAgICAgIFxuICAgICAgICBlZGdlQ2xvbmUuZGF0YSgpLnNvdXJjZSA9IG5ld05vZGVJZDtcbiAgICAgICAgZWRnZUNsb25lLmRhdGEoKS5wb3J0c291cmNlID0gbmV3Tm9kZUlkOyAgICBcbiAgICAgIH1lbHNle1xuICAgICAgICAgIFxuICAgICAgICBlZGdlQ2xvbmUuZGF0YSgpLnRhcmdldCA9IG5ld05vZGVJZDtcbiAgICAgICAgZWRnZUNsb25lLmRhdGEoKS5wb3J0dGFyZ2V0ID0gbmV3Tm9kZUlkOyAgICBcbiAgICAgIH1cbiAgICAgIHZhciBuZXdOb2RlID0gbm9kZS5jbG9uZSgpO1xuICAgICAgbmV3Tm9kZS5kYXRhKCkuaWQgPSBuZXdOb2RlSWQ7XG4gICAgICBjeS5hZGQobmV3Tm9kZSk7XG4gICAgIFxuICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgIGN5LmFkZChlZGdlQ2xvbmUpO1xuICAgICAgbmV3Tm9kZS5wb3NpdGlvbih7XG4gICAgICAgIHg6IG5ld1Bvc2l0aW9uLmN4LFxuICAgICAgICB5OiBuZXdQb3NpdGlvbi5jeVxuICAgICAgfSk7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5ld05vZGUsIHRydWUpO1xuICAgICAgXG4gICAgfSAgXG4gICAgXG4gICAgdmFyIG5ld1Bvc2l0aW9uID0gY2xhY3VsYXRlTmV3Q2xvbmVQb3NpdGlvbihcbiAgICAgIGVkZ2VzWzBdLnNvdXJjZUVuZHBvaW50KCkueCxcbiAgICAgIGVkZ2VzWzBdLnNvdXJjZUVuZHBvaW50KCkueSxcbiAgICAgIGVkZ2VzWzBdLnRhcmdldEVuZHBvaW50KCkueCxcbiAgICAgIGVkZ2VzWzBdLnRhcmdldEVuZHBvaW50KCkueSxcbiAgICAgIGRlc2lyZWREaXN0YW5jZSxlZGdlc1swXS5zb3VyY2UoKS5pZCgpID09IG5vZGUuaWQoKSA/IFwic291cmNlXCIgOiBcInRhcmdldFwiXG4gICAgICApO1xuICBcbiAgICB2YXIgY2xvbmVFZGdlID0gZWRnZXNbMF0uY2xvbmUoKTtcbiAgICAvL2Nsb25lRWRnZS5kYXRhKCkuaWQgPSBjbG9uZUVkZ2UuZGF0YSgpLmlkKyBcIi1cIitub2RlLmlkKCkrJ2Nsb25lLTAnO1xuICAgIFxuICAgIGVkZ2VzWzBdLnJlbW92ZSgpO1xuICAgIGN5LmFkZChjbG9uZUVkZ2UpO1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZSx0cnVlKTtcbiAgICBub2RlLnBvc2l0aW9uKHtcbiAgICAgIHg6IG5ld1Bvc2l0aW9uLmN4LFxuICAgICAgeTogbmV3UG9zaXRpb24uY3lcbiAgICB9KTtcbiAgXG4gICAgcmVzdWx0Lm9sZFggPSBvbGRYOyAgICBcbiAgICByZXN1bHQub2xkWSA9IG9sZFk7XG4gICAgcmVzdWx0Lm5vZGUgPSBub2RlO1xuICAgIHJlc3VsdC5udW1iZXJPZkVkZ2VzID0gZWRnZXMubGVuZ3RoO1xuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgfVxuXG4gIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuQ2xvbmVIaWdoRGVncmVlTm9kZSA9IGZ1bmN0aW9uKHBhcmFtKXtcblxuICAgIHZhciBub2RlID0gcGFyYW0ubm9kZTtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGUsZmFsc2UpO1xuICAgIG5vZGUucG9zaXRpb24oe1xuICAgICAgeDogcGFyYW0ub2xkWCxcbiAgICAgIHk6IHBhcmFtLm9sZFlcbiAgICB9KTtcbiAgXG4gICAgZm9yKHZhciBpID0gMSA7IGkgPCBwYXJhbS5udW1iZXJPZkVkZ2VzIDsgaSsrKXtcbiAgICAgIHZhciBjbG9uZUlkID0gbm9kZS5pZCgpKydjbG9uZS0nK2k7XG4gICAgICB2YXIgY2xvbmUgPSBjeS4kKFwiI1wiK2Nsb25lSWQpO1xuICAgICAgdmFyIGNsb25lRWRnZSA9IGNsb25lLmNvbm5lY3RlZEVkZ2VzKClbMF07XG4gICAgICB2YXIgZWRnZSA9IGNsb25lRWRnZS5jbG9uZSgpO1xuICAgICAgXG4gICAgXG4gICAgICBpZihlZGdlLmRhdGEoKS5zb3VyY2UgPT0gY2xvbmVJZCl7ICAgICAgICBcbiAgICAgICAgZWRnZS5kYXRhKCkuc291cmNlID0gbm9kZS5pZCgpO1xuICAgICAgICBlZGdlLmRhdGEoKS5wb3J0c291cmNlID0gIG5vZGUuaWQoKTsgICAgXG4gICAgICB9ZWxzZXsgICAgICAgICAgXG4gICAgICAgIGVkZ2UuZGF0YSgpLnRhcmdldCA9ICBub2RlLmlkKCk7XG4gICAgICAgIGVkZ2UuZGF0YSgpLnBvcnR0YXJnZXQgPSAgbm9kZS5pZCgpOyAgICBcbiAgICAgIH1cblxuICAgICAgY2xvbmVFZGdlLnJlbW92ZSgpO1xuICAgICAgY2xvbmUucmVtb3ZlKCk7XG4gICAgICBcbiAgICAgIGN5LmFkZChlZGdlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU1hcFR5cGUgPSBmdW5jdGlvbihwYXJhbSl7XG4gICAgdmFyIHJlc3VsdCA9e307XG4gICAgdmFyIGN1cnJlbnRNYXBUeXBlID0gZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCk7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKHBhcmFtLm1hcFR5cGUpO1xuICAgIHJlc3VsdC5tYXBUeXBlID0gY3VycmVudE1hcFR5cGU7XG4gICAgcmVzdWx0LmNhbGxiYWNrID0gcGFyYW0uY2FsbGJhY2s7XG4gICAgcGFyYW0uY2FsbGJhY2soKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgfVxuXG4gIHJldHVybiB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc0V4dGVuZGVyO1xufTtcbiJdfQ==
