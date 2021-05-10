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

    elementUtilities.createConversion = function (macromoleculeName, regulator, regulatorMultimer, orientation, inputInfoboxLabel, outputInfoboxLabel) {
      const hasRegulator = regulator.name !== undefined;
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

      const minInfoboxDimension = 20;
      const widthPerChar = 6;
      const inputInfoboxWidth = inputInfoboxLabel.length > 0 ? 
                                Math.max(widthPerChar * inputInfoboxLabel.length, minInfoboxDimension) : 
                                minInfoboxDimension; 
      let infoboxObject = {
        clazz: "unit of information",
        label: {
          text: inputInfoboxLabel
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

      const outputInfoboxWidth = outputInfoboxLabel.length > 0 ? 
                                Math.max(widthPerChar * outputInfoboxLabel.length, minInfoboxDimension) : 
                                minInfoboxDimension;
      infoboxObject = {
        clazz: "unit of information",
        label: {
          text: outputInfoboxLabel
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

        elementUtilities.setMultimerStatus(regulatorNode, regulatorMultimer);

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
          const infoboxLabel = "N:" + cardinality;
          infoboxObject = {
            clazz: "unit of information",
            label: {
              text: infoboxLabel
            },
            bbox: {
              w: infoboxLabel.length * 6,
              h: 15
            },
            style: {
              "shape-name": "ellipse"
            }
          };
          if (cardinality != '') {
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

  mainUtilities.createConversion = function(macromoleculeName, regulator, regulatorMultimer, orientation, inputInfoboxLabel, outputInfoboxLabel) {
    if ( elementUtilities.isGraphTopologyLocked() ) {
      return;
    }

    if (!options.undoable) {
      elementUtilities.createConversion(macromoleculeName, regulator, regulatorMultimer, orientation, inputInfoboxLabel, outputInfoboxLabel);
    }
    else {
      const param = {
        macromoleculeName: macromoleculeName,
        regulator: regulator,
        regulatorMultimer: regulatorMultimer,
        orientation: orientation,
        inputInfoboxLabel: inputInfoboxLabel,
        outputInfoboxLabel: outputInfoboxLabel
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
        eles = elementUtilities.createConversion(param.macromoleculeName, param.regulator, param.regulatorMultimer, param.orientation, param.inputInfoboxLabel, param.outputInfoboxLabel);
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

//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzZXF1YWwvaW5kZXguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLWV4dGVuZGVyLWZhY3RvcnkuanMiLCJzcmMvdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzLWZhY3RvcnkuanMiLCJzcmMvdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvc2JnbnZpei1pbnN0YW5jZS11dGlsaXRpZXMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvdG9wb2xvZ3ktZ3JvdXBpbmctZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvdXItYWN0aW9uLWZ1bmN0aW9ucy1leHRlbmRlci1mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeHpEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5NkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ozQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcllBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBMb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBKUyBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanMuZm91bmRhdGlvbi8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5maWx0ZXJgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlGaWx0ZXIoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uc29tZWAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbnkgZWxlbWVudCBwYXNzZXMgdGhlIHByZWRpY2F0ZSBjaGVjayxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5U29tZShhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGBjYWNoZWAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGNhY2hlIFRoZSBjYWNoZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBjYWNoZUhhcyhjYWNoZSwga2V5KSB7XG4gIHJldHVybiBjYWNoZS5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbi8qKlxuICogQ29udmVydHMgYG1hcGAgdG8gaXRzIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGtleS12YWx1ZSBwYWlycy5cbiAqL1xuZnVuY3Rpb24gbWFwVG9BcnJheShtYXApIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShtYXAuc2l6ZSk7XG5cbiAgbWFwLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IFtrZXksIHZhbHVlXTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBzZXRgIHRvIGFuIGFycmF5IG9mIGl0cyB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHNldFRvQXJyYXkoc2V0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoc2V0LnNpemUpO1xuXG4gIHNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSxcbiAgICBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgU3ltYm9sID0gcm9vdC5TeW1ib2wsXG4gICAgVWludDhBcnJheSA9IHJvb3QuVWludDhBcnJheSxcbiAgICBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlLFxuICAgIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlLFxuICAgIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMsXG4gICAgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBEYXRhVmlldyA9IGdldE5hdGl2ZShyb290LCAnRGF0YVZpZXcnKSxcbiAgICBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpLFxuICAgIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKSxcbiAgICBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpLFxuICAgIFdlYWtNYXAgPSBnZXROYXRpdmUocm9vdCwgJ1dlYWtNYXAnKSxcbiAgICBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBsaXN0IGNhY2hlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTGlzdENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IFtdO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbi8qKlxuICpcbiAqIENyZWF0ZXMgYW4gYXJyYXkgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIHVuaXF1ZSB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU2V0Q2FjaGUodmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzID09IG51bGwgPyAwIDogdmFsdWVzLmxlbmd0aDtcblxuICB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHRoaXMuYWRkKHZhbHVlc1tpbmRleF0pO1xuICB9XG59XG5cbi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgYWRkXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBhbGlhcyBwdXNoXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjYWNoZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUFkZCh2YWx1ZSkge1xuICB0aGlzLl9fZGF0YV9fLnNldCh2YWx1ZSwgSEFTSF9VTkRFRklORUQpO1xuICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBpbiB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUhhcyh2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXModmFsdWUpO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU2V0Q2FjaGVgLlxuU2V0Q2FjaGUucHJvdG90eXBlLmFkZCA9IFNldENhY2hlLnByb3RvdHlwZS5wdXNoID0gc2V0Q2FjaGVBZGQ7XG5TZXRDYWNoZS5wcm90b3R5cGUuaGFzID0gc2V0Q2FjaGVIYXM7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgcmVzdWx0ID0gZGF0YVsnZGVsZXRlJ10oa2V5KTtcblxuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBzdGFjayB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrSGFzKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgTGlzdENhY2hlKSB7XG4gICAgdmFyIHBhaXJzID0gZGF0YS5fX2RhdGFfXztcbiAgICBpZiAoIU1hcCB8fCAocGFpcnMubGVuZ3RoIDwgTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB0aGlzLnNpemUgPSArK2RhdGEuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZShwYWlycyk7XG4gIH1cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldEFsbEtleXNgIGFuZCBgZ2V0QWxsS2V5c0luYCB3aGljaCB1c2VzXG4gKiBga2V5c0Z1bmNgIGFuZCBgc3ltYm9sc0Z1bmNgIHRvIGdldCB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzeW1ib2xzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzRnVuYywgc3ltYm9sc0Z1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXNGdW5jKG9iamVjdCk7XG4gIHJldHVybiBpc0FycmF5KG9iamVjdCkgPyByZXN1bHQgOiBhcnJheVB1c2gocmVzdWx0LCBzeW1ib2xzRnVuYyhvYmplY3QpKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzRXF1YWxgIHdoaWNoIHN1cHBvcnRzIHBhcnRpYWwgY29tcGFyaXNvbnNcbiAqIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBVbm9yZGVyZWQgY29tcGFyaXNvblxuICogIDIgLSBQYXJ0aWFsIGNvbXBhcmlzb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgdmFsdWVgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIGlmICh2YWx1ZSA9PT0gb3RoZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBvdGhlciA9PSBudWxsIHx8ICghaXNPYmplY3RMaWtlKHZhbHVlKSAmJiAhaXNPYmplY3RMaWtlKG90aGVyKSkpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcjtcbiAgfVxuICByZXR1cm4gYmFzZUlzRXF1YWxEZWVwKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgYmFzZUlzRXF1YWwsIHN0YWNrKTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gKiBkZWVwIGNvbXBhcmlzb25zIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIGNvbXBhcmVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbERlZXAob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgb2JqSXNBcnIgPSBpc0FycmF5KG9iamVjdCksXG4gICAgICBvdGhJc0FyciA9IGlzQXJyYXkob3RoZXIpLFxuICAgICAgb2JqVGFnID0gb2JqSXNBcnIgPyBhcnJheVRhZyA6IGdldFRhZyhvYmplY3QpLFxuICAgICAgb3RoVGFnID0gb3RoSXNBcnIgPyBhcnJheVRhZyA6IGdldFRhZyhvdGhlcik7XG5cbiAgb2JqVGFnID0gb2JqVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvYmpUYWc7XG4gIG90aFRhZyA9IG90aFRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb3RoVGFnO1xuXG4gIHZhciBvYmpJc09iaiA9IG9ialRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBvdGhJc09iaiA9IG90aFRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBpc1NhbWVUYWcgPSBvYmpUYWcgPT0gb3RoVGFnO1xuXG4gIGlmIChpc1NhbWVUYWcgJiYgaXNCdWZmZXIob2JqZWN0KSkge1xuICAgIGlmICghaXNCdWZmZXIob3RoZXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIG9iaklzQXJyID0gdHJ1ZTtcbiAgICBvYmpJc09iaiA9IGZhbHNlO1xuICB9XG4gIGlmIChpc1NhbWVUYWcgJiYgIW9iaklzT2JqKSB7XG4gICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICByZXR1cm4gKG9iaklzQXJyIHx8IGlzVHlwZWRBcnJheShvYmplY3QpKVxuICAgICAgPyBlcXVhbEFycmF5cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKVxuICAgICAgOiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIG9ialRhZywgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG4gIH1cbiAgaWYgKCEoYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHKSkge1xuICAgIHZhciBvYmpJc1dyYXBwZWQgPSBvYmpJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgJ19fd3JhcHBlZF9fJyksXG4gICAgICAgIG90aElzV3JhcHBlZCA9IG90aElzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsICdfX3dyYXBwZWRfXycpO1xuXG4gICAgaWYgKG9iaklzV3JhcHBlZCB8fCBvdGhJc1dyYXBwZWQpIHtcbiAgICAgIHZhciBvYmpVbndyYXBwZWQgPSBvYmpJc1dyYXBwZWQgPyBvYmplY3QudmFsdWUoKSA6IG9iamVjdCxcbiAgICAgICAgICBvdGhVbndyYXBwZWQgPSBvdGhJc1dyYXBwZWQgPyBvdGhlci52YWx1ZSgpIDogb3RoZXI7XG5cbiAgICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgICByZXR1cm4gZXF1YWxGdW5jKG9ialVud3JhcHBlZCwgb3RoVW53cmFwcGVkLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgfVxuICB9XG4gIGlmICghaXNTYW1lVGFnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gIHJldHVybiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IGlzRnVuY3Rpb24odmFsdWUpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgYXJyYXlzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0FycmF5fSBvdGhlciBUaGUgb3RoZXIgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYGFycmF5YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcnJheXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxBcnJheXMoYXJyYXksIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGg7XG5cbiAgaWYgKGFyckxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIShpc1BhcnRpYWwgJiYgb3RoTGVuZ3RoID4gYXJyTGVuZ3RoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KGFycmF5KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gdHJ1ZSxcbiAgICAgIHNlZW4gPSAoYml0bWFzayAmIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcpID8gbmV3IFNldENhY2hlIDogdW5kZWZpbmVkO1xuXG4gIHN0YWNrLnNldChhcnJheSwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIGFycmF5KTtcblxuICAvLyBJZ25vcmUgbm9uLWluZGV4IHByb3BlcnRpZXMuXG4gIHdoaWxlICgrK2luZGV4IDwgYXJyTGVuZ3RoKSB7XG4gICAgdmFyIGFyclZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2luZGV4XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBhcnJWYWx1ZSwgaW5kZXgsIG90aGVyLCBhcnJheSwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihhcnJWYWx1ZSwgb3RoVmFsdWUsIGluZGV4LCBhcnJheSwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgaWYgKGNvbXBhcmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChjb21wYXJlZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKHNlZW4pIHtcbiAgICAgIGlmICghYXJyYXlTb21lKG90aGVyLCBmdW5jdGlvbihvdGhWYWx1ZSwgb3RoSW5kZXgpIHtcbiAgICAgICAgICAgIGlmICghY2FjaGVIYXMoc2Vlbiwgb3RoSW5kZXgpICYmXG4gICAgICAgICAgICAgICAgKGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWVuLnB1c2gob3RoSW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCEoXG4gICAgICAgICAgYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8XG4gICAgICAgICAgICBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaylcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKGFycmF5KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGNvbXBhcmluZyBvYmplY3RzIG9mXG4gKiB0aGUgc2FtZSBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY29tcGFyaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3RzIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCB0YWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgIChvYmplY3QuYnl0ZU9mZnNldCAhPSBvdGhlci5ieXRlT2Zmc2V0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBvYmplY3QuYnVmZmVyO1xuICAgICAgb3RoZXIgPSBvdGhlci5idWZmZXI7XG5cbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgICFlcXVhbEZ1bmMobmV3IFVpbnQ4QXJyYXkob2JqZWN0KSwgbmV3IFVpbnQ4QXJyYXkob3RoZXIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgICAvLyBDb2VyY2UgYm9vbGVhbnMgdG8gYDFgIG9yIGAwYCBhbmQgZGF0ZXMgdG8gbWlsbGlzZWNvbmRzLlxuICAgICAgLy8gSW52YWxpZCBkYXRlcyBhcmUgY29lcmNlZCB0byBgTmFOYC5cbiAgICAgIHJldHVybiBlcSgrb2JqZWN0LCArb3RoZXIpO1xuXG4gICAgY2FzZSBlcnJvclRhZzpcbiAgICAgIHJldHVybiBvYmplY3QubmFtZSA9PSBvdGhlci5uYW1lICYmIG9iamVjdC5tZXNzYWdlID09IG90aGVyLm1lc3NhZ2U7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIC8vIENvZXJjZSByZWdleGVzIHRvIHN0cmluZ3MgYW5kIHRyZWF0IHN0cmluZ3MsIHByaW1pdGl2ZXMgYW5kIG9iamVjdHMsXG4gICAgICAvLyBhcyBlcXVhbC4gU2VlIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1yZWdleHAucHJvdG90eXBlLnRvc3RyaW5nXG4gICAgICAvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgcmV0dXJuIG9iamVjdCA9PSAob3RoZXIgKyAnJyk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHZhciBjb252ZXJ0ID0gbWFwVG9BcnJheTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRztcbiAgICAgIGNvbnZlcnQgfHwgKGNvbnZlcnQgPSBzZXRUb0FycmF5KTtcblxuICAgICAgaWYgKG9iamVjdC5zaXplICE9IG90aGVyLnNpemUgJiYgIWlzUGFydGlhbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gICAgICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICAgICAgaWYgKHN0YWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gICAgICB9XG4gICAgICBiaXRtYXNrIHw9IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUc7XG5cbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICAgICAgdmFyIHJlc3VsdCA9IGVxdWFsQXJyYXlzKGNvbnZlcnQob2JqZWN0KSwgY29udmVydChvdGhlciksIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICAgICAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICBpZiAoc3ltYm9sVmFsdWVPZikge1xuICAgICAgICByZXR1cm4gc3ltYm9sVmFsdWVPZi5jYWxsKG9iamVjdCkgPT0gc3ltYm9sVmFsdWVPZi5jYWxsKG90aGVyKTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBvYmplY3RzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBvYmpQcm9wcyA9IGdldEFsbEtleXMob2JqZWN0KSxcbiAgICAgIG9iakxlbmd0aCA9IG9ialByb3BzLmxlbmd0aCxcbiAgICAgIG90aFByb3BzID0gZ2V0QWxsS2V5cyhvdGhlciksXG4gICAgICBvdGhMZW5ndGggPSBvdGhQcm9wcy5sZW5ndGg7XG5cbiAgaWYgKG9iakxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIWlzUGFydGlhbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgaW5kZXggPSBvYmpMZW5ndGg7XG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgdmFyIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICBpZiAoIShpc1BhcnRpYWwgPyBrZXkgaW4gb3RoZXIgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCBrZXkpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gIGlmIChzdGFja2VkICYmIHN0YWNrLmdldChvdGhlcikpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIG9iamVjdCk7XG5cbiAgdmFyIHNraXBDdG9yID0gaXNQYXJ0aWFsO1xuICB3aGlsZSAoKytpbmRleCA8IG9iakxlbmd0aCkge1xuICAgIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltrZXldO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIG9ialZhbHVlLCBrZXksIG90aGVyLCBvYmplY3QsIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIob2JqVmFsdWUsIG90aFZhbHVlLCBrZXksIG9iamVjdCwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKCEoY29tcGFyZWQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gKG9ialZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMob2JqVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpXG4gICAgICAgICAgOiBjb21wYXJlZFxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBza2lwQ3RvciB8fCAoc2tpcEN0b3IgPSBrZXkgPT0gJ2NvbnN0cnVjdG9yJyk7XG4gIH1cbiAgaWYgKHJlc3VsdCAmJiAhc2tpcEN0b3IpIHtcbiAgICB2YXIgb2JqQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgICAgb3RoQ3RvciA9IG90aGVyLmNvbnN0cnVjdG9yO1xuXG4gICAgLy8gTm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWwuXG4gICAgaWYgKG9iakN0b3IgIT0gb3RoQ3RvciAmJlxuICAgICAgICAoJ2NvbnN0cnVjdG9yJyBpbiBvYmplY3QgJiYgJ2NvbnN0cnVjdG9yJyBpbiBvdGhlcikgJiZcbiAgICAgICAgISh0eXBlb2Ygb2JqQ3RvciA9PSAnZnVuY3Rpb24nICYmIG9iakN0b3IgaW5zdGFuY2VvZiBvYmpDdG9yICYmXG4gICAgICAgICAgdHlwZW9mIG90aEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvdGhDdG9yIGluc3RhbmNlb2Ygb3RoQ3RvcikpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzLCBnZXRTeW1ib2xzKTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHMgPSAhbmF0aXZlR2V0U3ltYm9scyA/IHN0dWJBcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIHJldHVybiBhcnJheUZpbHRlcihuYXRpdmVHZXRTeW1ib2xzKG9iamVjdCksIGZ1bmN0aW9uKHN5bWJvbCkge1xuICAgIHJldHVybiBwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKG9iamVjdCwgc3ltYm9sKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEdldHMgdGhlIGB0b1N0cmluZ1RhZ2Agb2YgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG52YXIgZ2V0VGFnID0gYmFzZUdldFRhZztcblxuLy8gRmFsbGJhY2sgZm9yIGRhdGEgdmlld3MsIG1hcHMsIHNldHMsIGFuZCB3ZWFrIG1hcHMgaW4gSUUgMTEgYW5kIHByb21pc2VzIGluIE5vZGUuanMgPCA2LlxuaWYgKChEYXRhVmlldyAmJiBnZXRUYWcobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcigxKSkpICE9IGRhdGFWaWV3VGFnKSB8fFxuICAgIChNYXAgJiYgZ2V0VGFnKG5ldyBNYXApICE9IG1hcFRhZykgfHxcbiAgICAoUHJvbWlzZSAmJiBnZXRUYWcoUHJvbWlzZS5yZXNvbHZlKCkpICE9IHByb21pc2VUYWcpIHx8XG4gICAgKFNldCAmJiBnZXRUYWcobmV3IFNldCkgIT0gc2V0VGFnKSB8fFxuICAgIChXZWFrTWFwICYmIGdldFRhZyhuZXcgV2Vha01hcCkgIT0gd2Vha01hcFRhZykpIHtcbiAgZ2V0VGFnID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUdldFRhZyh2YWx1ZSksXG4gICAgICAgIEN0b3IgPSByZXN1bHQgPT0gb2JqZWN0VGFnID8gdmFsdWUuY29uc3RydWN0b3IgOiB1bmRlZmluZWQsXG4gICAgICAgIGN0b3JTdHJpbmcgPSBDdG9yID8gdG9Tb3VyY2UoQ3RvcikgOiAnJztcblxuICAgIGlmIChjdG9yU3RyaW5nKSB7XG4gICAgICBzd2l0Y2ggKGN0b3JTdHJpbmcpIHtcbiAgICAgICAgY2FzZSBkYXRhVmlld0N0b3JTdHJpbmc6IHJldHVybiBkYXRhVmlld1RhZztcbiAgICAgICAgY2FzZSBtYXBDdG9yU3RyaW5nOiByZXR1cm4gbWFwVGFnO1xuICAgICAgICBjYXNlIHByb21pc2VDdG9yU3RyaW5nOiByZXR1cm4gcHJvbWlzZVRhZztcbiAgICAgICAgY2FzZSBzZXRDdG9yU3RyaW5nOiByZXR1cm4gc2V0VGFnO1xuICAgICAgICBjYXNlIHdlYWtNYXBDdG9yU3RyaW5nOiByZXR1cm4gd2Vha01hcFRhZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSAmJlxuICAgICh2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IEJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgVWludDhBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNCdWZmZXIgPSBuYXRpdmVJc0J1ZmZlciB8fCBzdHViRmFsc2U7XG5cbi8qKlxuICogUGVyZm9ybXMgYSBkZWVwIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZVxuICogZXF1aXZhbGVudC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2Qgc3VwcG9ydHMgY29tcGFyaW5nIGFycmF5cywgYXJyYXkgYnVmZmVycywgYm9vbGVhbnMsXG4gKiBkYXRlIG9iamVjdHMsIGVycm9yIG9iamVjdHMsIG1hcHMsIG51bWJlcnMsIGBPYmplY3RgIG9iamVjdHMsIHJlZ2V4ZXMsXG4gKiBzZXRzLCBzdHJpbmdzLCBzeW1ib2xzLCBhbmQgdHlwZWQgYXJyYXlzLiBgT2JqZWN0YCBvYmplY3RzIGFyZSBjb21wYXJlZFxuICogYnkgdGhlaXIgb3duLCBub3QgaW5oZXJpdGVkLCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuIEZ1bmN0aW9ucyBhbmQgRE9NXG4gKiBub2RlcyBhcmUgY29tcGFyZWQgYnkgc3RyaWN0IGVxdWFsaXR5LCBpLmUuIGA9PT1gLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmlzRXF1YWwob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogb2JqZWN0ID09PSBvdGhlcjtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRXF1YWwodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QpIDogYmFzZUtleXMob2JqZWN0KTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGEgbmV3IGVtcHR5IGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZW1wdHkgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheXMgPSBfLnRpbWVzKDIsIF8uc3R1YkFycmF5KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXMpO1xuICogLy8gPT4gW1tdLCBbXV1cbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXNbMF0gPT09IGFycmF5c1sxXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBzdHViQXJyYXkoKSB7XG4gIHJldHVybiBbXTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRXF1YWw7XG4iLCIoZnVuY3Rpb24oKXtcbiAgdmFyIGNoaXNlID0gZnVuY3Rpb24oX29wdGlvbnMpIHtcblxuICAgIHZhciBwYXJhbSA9IHt9O1xuXG4gICAgLy8gQWNjZXNzIHRoZSBsaWJzXG4gICAgdmFyIGxpYnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xuXG4gICAgdmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMtZmFjdG9yeScpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSBvcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyhfb3B0aW9ucyk7IC8vIEV4dGVuZHMgdGhlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHRoZSBnaXZlbiBvcHRpb25zXG5cbiAgICAvLyBDcmVhdGUgYW4gc2JnbnZpeiBpbnN0YW5jZVxuICAgIHZhciBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9zYmdudml6LWluc3RhbmNlLXV0aWxpdGllcy1mYWN0b3J5JykoKTtcbiAgICB2YXIgc2JnbnZpekluc3RhbmNlID0gc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzKG9wdGlvbnMpO1xuXG4gICAgLy8gUmVnaXN0ZXIgdW5kby9yZWRvIGFjdGlvbnNcbiAgICB2YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9yZWdpc3Rlci11bmRvLXJlZG8tYWN0aW9ucy1mYWN0b3J5JykoKTtcblxuICAgIHZhciBtYWluVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbWFpbi11dGlsaXRpZXMtZmFjdG9yeScpKCk7XG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXNFeHRlbmRlciA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLWV4dGVuZGVyLWZhY3RvcnknKSgpO1xuICAgIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc0V4dGVuZGVyID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdXItYWN0aW9uLWZ1bmN0aW9ucy1leHRlbmRlci1mYWN0b3J5JykoKTtcbiAgICB2YXIgc2lmVG9wb2xvZ3lHcm91cGluZyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3RvcG9sb2d5LWdyb3VwaW5nLWZhY3RvcnknKSgpO1xuXG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSAgc2JnbnZpekluc3RhbmNlLmVsZW1lbnRVdGlsaXRpZXM7XG4gICAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gc2JnbnZpekluc3RhbmNlLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xuXG4gICAgcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzID0gc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzO1xuICAgIHBhcmFtLm9wdGlvblV0aWxpdGllcyA9IG9wdGlvblV0aWxpdGllcztcbiAgICBwYXJhbS5lbGVtZW50VXRpbGl0aWVzID0gZWxlbWVudFV0aWxpdGllcztcbiAgICBwYXJhbS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xuICAgIHBhcmFtLnNpZlRvcG9sb2d5R3JvdXBpbmcgPSBzaWZUb3BvbG9neUdyb3VwaW5nO1xuXG4gICAgdmFyIHNob3VsZEFwcGx5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcGFyYW0uZWxlbWVudFV0aWxpdGllcy5tYXBUeXBlID09PSAnU0lGJztcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNFeHRlbmRlcihwYXJhbSk7XG4gICAgZWxlbWVudFV0aWxpdGllc0V4dGVuZGVyKHBhcmFtKTtcbiAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyhwYXJhbSk7XG4gICAgbWFpblV0aWxpdGllcyhwYXJhbSk7XG4gICAgc2lmVG9wb2xvZ3lHcm91cGluZyhwYXJhbSwge21ldGFFZGdlSWRlbnRpZmllcjogJ3NpZi1tZXRhJywgbG9ja0dyYXBoVG9wb2xvZ3k6IHRydWUsIHNob3VsZEFwcGx5fSk7XG5cbiAgICAvLyBFeHBvc2UgdGhlIGFwaVxuICAgIHZhciBhcGkgPSB7fTtcblxuICAgIC8vIEV4cG9zZSB0aGUgcHJvcGVydGllcyBpbmhlcml0ZWQgZnJvbSBzYmdudml6XG4gICAgLy8gdGhlbiBvdmVycmlkZSBzb21lIG9mIHRoZXNlIHByb3BlcnRpZXMgYW5kIGV4cG9zZSBzb21lIG5ldyBwcm9wZXJ0aWVzXG4gICAgZm9yICh2YXIgcHJvcCBpbiBzYmdudml6SW5zdGFuY2UpIHtcbiAgICAgIGFwaVtwcm9wXSA9IHNiZ252aXpJbnN0YW5jZVtwcm9wXTtcbiAgICB9XG5cbiAgICAvLyBFeHBvc2UgZWFjaCBtYWluIHV0aWxpdHkgc2VwZXJhdGVseVxuICAgIGZvciAodmFyIHByb3AgaW4gbWFpblV0aWxpdGllcykge1xuICAgICAgYXBpW3Byb3BdID0gbWFpblV0aWxpdGllc1twcm9wXTtcbiAgICB9XG5cbiAgICAvLyBFeHBvc2UgZ2V0U2JnbnZpekluc3RhbmNlKClcbiAgICBhcGkuZ2V0U2JnbnZpekluc3RhbmNlID0gc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEluc3RhbmNlO1xuXG4gICAgLy8gRXhwb3NlIGVsZW1lbnRVdGlsaXRpZXMgYW5kIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIGFzIGlzXG4gICAgYXBpLmVsZW1lbnRVdGlsaXRpZXMgPSBlbGVtZW50VXRpbGl0aWVzO1xuICAgIGFwaS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xuICAgIGFwaS5zaWZUb3BvbG9neUdyb3VwaW5nID0gc2lmVG9wb2xvZ3lHcm91cGluZztcblxuICAgIHJldHVybiBhcGk7XG4gIH07XG5cbiAgLy8gUmVnaXN0ZXIgY2hpc2Ugd2l0aCBnaXZlbiBsaWJyYXJpZXNcbiAgY2hpc2UucmVnaXN0ZXIgPSBmdW5jdGlvbiAoX2xpYnMpIHtcblxuICAgIHZhciBsaWJzID0ge307XG4gICAgbGlicy5qUXVlcnkgPSBfbGlicy5qUXVlcnkgfHwgalF1ZXJ5O1xuICAgIGxpYnMuY3l0b3NjYXBlID0gX2xpYnMuY3l0b3NjYXBlIHx8IGN5dG9zY2FwZTtcbiAgICBsaWJzLnNiZ252aXogPSBfbGlicy5zYmdudml6IHx8IHNiZ252aXo7XG4gICAgbGlicy5zYXZlQXMgPSBfbGlicy5maWxlc2F2ZXIgPyBfbGlicy5maWxlc2F2ZXIuc2F2ZUFzIDogc2F2ZUFzO1xuXG4gICAgbGlicy5zYmdudml6LnJlZ2lzdGVyKF9saWJzKTsgLy8gUmVnaXN0ZXIgc2JnbnZpeiB3aXRoIHRoZSBnaXZlbiBsaWJzXG5cbiAgICAvLyBpbmhlcml0IGV4cG9zZWQgc3RhdGljIHByb3BlcnRpZXMgb2Ygc2JnbnZpeiBvdGhlciB0aGFuIHJlZ2lzdGVyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBsaWJzLnNiZ252aXopIHtcbiAgICAgIGlmIChwcm9wICE9PSAncmVnaXN0ZXInKSB7XG4gICAgICAgIGNoaXNlW3Byb3BdID0gbGlicy5zYmdudml6W3Byb3BdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNldCB0aGUgbGlicmFyaWVzIHRvIGFjY2VzcyB0aGVtIGZyb20gYW55IGZpbGVcbiAgICB2YXIgbGliVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpO1xuICAgIGxpYlV0aWxpdGllcy5zZXRMaWJzKGxpYnMpO1xuICB9O1xuXG4gIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjaGlzZTtcbiAgfVxufSkoKTtcbiIsIi8vIEV4dGVuZHMgc2JnbnZpei5lbGVtZW50VXRpbGl0aWVzXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3B0aW9ucywgc2JnbnZpekluc3RhbmNlLCBlbGVtZW50VXRpbGl0aWVzLCBjeTtcblxuICBmdW5jdGlvbiBlbGVtZW50VXRpbGl0aWVzRXh0ZW5kZXIgKHBhcmFtKSB7XG4gICAgc2JnbnZpekluc3RhbmNlID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEluc3RhbmNlKCk7XG4gICAgb3B0aW9ucyA9IHBhcmFtLm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XG4gICAgZWxlbWVudFV0aWxpdGllcyA9IHNiZ252aXpJbnN0YW5jZS5lbGVtZW50VXRpbGl0aWVzO1xuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KCk7XG5cbiAgICBleHRlbmQoKTtcblxuICAgIC8vIFJldHVybiB0aGUgZXh0ZW5kZWQgZWxlbWVudFV0aWxpdGllc1xuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzO1xuICB9XG5cbiAgLy8gRXh0ZW5kcyBlbGVtZW50VXRpbGl0aWVzIHdpdGggY2hpc2Ugc3BlY2lmaWMgZmFjaWxpdGllc1xuICBmdW5jdGlvbiBleHRlbmQgKCkge1xuICAgIC8vIFNlY3Rpb24gU3RhcnRcbiAgICAvLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24gKHgsIHksIG5vZGVQYXJhbXMsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcbiAgICAgIGlmICh0eXBlb2Ygbm9kZVBhcmFtcyAhPSAnb2JqZWN0Jyl7XG4gICAgICAgIHZhciBzYmduY2xhc3MgPSBub2RlUGFyYW1zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2JnbmNsYXNzID0gbm9kZVBhcmFtcy5jbGFzcztcbiAgICAgICAgICB2YXIgbGFuZ3VhZ2UgPSBub2RlUGFyYW1zLmxhbmd1YWdlO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3NzID0ge307XG4gICAgICAvLyBpZiB0aGVyZSBpcyBubyBzcGVjaWZpYyBkZWZhdWx0IHdpZHRoIG9yIGhlaWdodCBmb3JcbiAgICAgIC8vIHNiZ25jbGFzcyB0aGVzZSBzaXplcyBhcmUgdXNlZFxuICAgICAgdmFyIGRlZmF1bHRXaWR0aCA9IDUwO1xuICAgICAgdmFyIGRlZmF1bHRIZWlnaHQgPSA1MDtcblxuICAgICAgaWYgKHZpc2liaWxpdHkpIHtcbiAgICAgICAgY3NzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xuICAgICAgfVxuXG4gICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgY2xhc3M6IHNiZ25jbGFzcyxcbiAgICBcdCAgbGFuZ3VhZ2U6IGxhbmd1YWdlLFxuICAgICAgICBiYm94OiB7XG4gICAgICAgICAgdzogZGVmYXVsdFdpZHRoLFxuICAgICAgICAgIGg6IGRlZmF1bHRIZWlnaHQsXG4gICAgICAgICAgeDogeCxcbiAgICAgICAgICB5OiB5XG4gICAgICAgIH0sXG4gICAgICAgIHN0YXRlc2FuZGluZm9zOiBbXSxcbiAgICAgICAgcG9ydHM6IFtdXG4gICAgICB9O1xuXG4gICAgICBpZihpZCkge1xuICAgICAgICBkYXRhLmlkID0gaWQ7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZGF0YS5pZCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2VuZXJhdGVOb2RlSWQoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICBkYXRhLnBhcmVudCA9IHBhcmVudDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5leHRlbmROb2RlRGF0YVdpdGhDbGFzc0RlZmF1bHRzKCBkYXRhLCBzYmduY2xhc3MgKTtcblxuICAgICAgLy8gc29tZSBkZWZhdWx0cyBhcmUgbm90IHNldCBieSBleHRlbmROb2RlRGF0YVdpdGhDbGFzc0RlZmF1bHRzKClcbiAgICAgIHZhciBkZWZhdWx0cyA9IHRoaXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIHNiZ25jbGFzcyApO1xuXG4gICAgICBpZiAoIGRlZmF1bHRzWyAnbXVsdGltZXInIF0gKSB7XG4gICAgICAgIGRhdGEuY2xhc3MgKz0gJyBtdWx0aW1lcic7XG4gICAgICB9XG5cbiAgICAgIGlmICggZGVmYXVsdHNbICdjbG9uZW1hcmtlcicgXSApIHtcbiAgICAgICAgZGF0YVsgJ2Nsb25lbWFya2VyJyBdID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgZGF0YS5iYm94WyAndycgXSA9IGRlZmF1bHRzWyAnd2lkdGgnIF07XG4gICAgICBkYXRhLmJib3hbICdoJyBdID0gZGVmYXVsdHNbICdoZWlnaHQnIF07XG5cbiAgICAgIHZhciBlbGVzID0gY3kuYWRkKHtcbiAgICAgICAgZ3JvdXA6IFwibm9kZXNcIixcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgY3NzOiBjc3MsXG4gICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgeDogeCxcbiAgICAgICAgICB5OiB5XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbmV3Tm9kZSA9IGVsZXNbZWxlcy5sZW5ndGggLSAxXTtcbiAgICAgIC8vIEdldCB0aGUgZGVmYXVsdCBwb3J0cyBvcmRlcmluZyBmb3IgdGhlIG5vZGVzIHdpdGggZ2l2ZW4gc2JnbmNsYXNzXG4gICAgICB2YXIgb3JkZXJpbmcgPSBkZWZhdWx0c1sncG9ydHMtb3JkZXJpbmcnXTtcblxuICAgICAgLy8gSWYgdGhlcmUgaXMgYSBkZWZhdWx0IHBvcnRzIG9yZGVyaW5nIGZvciB0aGUgbm9kZXMgd2l0aCBnaXZlbiBzYmduY2xhc3MgYW5kIGl0IGlzIGRpZmZlcmVudCB0aGFuICdub25lJyBzZXQgdGhlIHBvcnRzIG9yZGVyaW5nIHRvIHRoYXQgb3JkZXJpbmdcbiAgICAgIGlmIChvcmRlcmluZyAmJiBvcmRlcmluZyAhPT0gJ25vbmUnKSB7XG4gICAgICAgIHRoaXMuc2V0UG9ydHNPcmRlcmluZyhuZXdOb2RlLCBvcmRlcmluZyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChsYW5ndWFnZSA9PSBcIkFGXCIgJiYgIWVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZU11bHRpcGxlVW5pdE9mSW5mb3JtYXRpb24obmV3Tm9kZSkpe1xuICAgICAgICBpZiAoc2JnbmNsYXNzICE9IFwiQkEgcGxhaW5cIikgeyAvLyBpZiBBRiBub2RlIGNhbiBoYXZlIGxhYmVsIGkuZTogbm90IHBsYWluIGJpb2xvZ2ljYWwgYWN0aXZpdHlcbiAgICAgICAgICB2YXIgdW9pX29iaiA9IHtcbiAgICAgICAgICAgIGNsYXp6OiBcInVuaXQgb2YgaW5mb3JtYXRpb25cIlxuICAgICAgICAgIH07XG4gICAgICAgICAgdW9pX29iai5sYWJlbCA9IHtcbiAgICAgICAgICAgIHRleHQ6IFwiXCJcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdW9pX29iai5iYm94ID0ge1xuICAgICAgICAgICAgIHc6IDEyLFxuICAgICAgICAgICAgIGg6IDEyXG4gICAgICAgICAgfTtcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5ld05vZGUsIHVvaV9vYmopO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIG5vZGUgYmcgaW1hZ2Ugd2FzIHVuZXhwZWN0ZWRseSBub3QgcmVuZGVyZWQgdW50aWwgaXQgaXMgY2xpY2tlZFxuICAgICAgLy8gdXNlIHRoaXMgZGlydHkgaGFjayB1bnRpbCBmaW5kaW5nIGEgc29sdXRpb24gdG8gdGhlIHByb2JsZW1cbiAgICAgIHZhciBiZ0ltYWdlID0gbmV3Tm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJyk7XG4gICAgICBpZiAoIGJnSW1hZ2UgKSB7XG4gICAgICAgIG5ld05vZGUuZGF0YSggJ2JhY2tncm91bmQtaW1hZ2UnLCBiZ0ltYWdlICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXdOb2RlO1xuICAgIH07XG5cbiAgICAvL1NhdmVzIG9sZCBhdXggdW5pdHMgb2YgZ2l2ZW4gbm9kZVxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2F2ZVVuaXRzID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgdmFyIHRlbXBEYXRhID0gW107XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmZvckVhY2goIGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICB0ZW1wRGF0YS5wdXNoKHtcbiAgICAgICAgICB4OiBlbGUuYmJveC54LFxuICAgICAgICAgIHk6IGVsZS5iYm94LnksXG4gICAgICAgICAgYW5jaG9yU2lkZTogZWxlLmFuY2hvclNpZGUsXG4gICAgICAgIH0pO1xuICAgICAgICBpbmRleCsrO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGVtcERhdGE7XG4gICAgfTtcblxuICAgIC8vUmVzdG9yZXMgZnJvbSBnaXZlbiBkYXRhXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlVW5pdHMgPSBmdW5jdGlvbihub2RlLCBkYXRhKSB7XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmZvckVhY2goIGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZWxlLmJib3gueCA9IGRhdGFbaW5kZXhdLng7XG4gICAgICAgICAgZWxlLmJib3gueSA9IGRhdGFbaW5kZXhdLnlcbiAgICAgICAgICB2YXIgYW5jaG9yU2lkZSA9IGVsZS5hbmNob3JTaWRlO1xuICAgICAgICAgIGVsZS5hbmNob3JTaWRlID0gZGF0YVtpbmRleF0uYW5jaG9yU2lkZTtcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1vZGlmeVVuaXRzKG5vZGUsIGVsZSwgYW5jaG9yU2lkZSk7XG4gICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vTW9kaWZ5IGF1eCB1bml0IGxheW91dHNcbiAgICBlbGVtZW50VXRpbGl0aWVzLm1vZGlmeVVuaXRzID0gZnVuY3Rpb24gKG5vZGUsIGVsZSwgYW5jaG9yU2lkZSkge1xuICAgICAgaW5zdGFuY2UuY2xhc3Nlcy5BdXhVbml0TGF5b3V0Lm1vZGlmeVVuaXRzKG5vZGUsIGVsZSwgYW5jaG9yU2lkZSwgY3kpO1xuICAgIH07XG5cblxuICAgIC8vRm9yIHJldmVyc2libGUgcmVhY3Rpb25zIGJvdGggc2lkZSBvZiB0aGUgcHJvY2VzcyBjYW4gYmUgaW5wdXQvb3V0cHV0XG4gICAgLy9Hcm91cCBJRCBpZGVudGlmaWVzIHRvIHdoaWNoIGdyb3VwIG9mIG5vZGVzIHRoZSBlZGdlIGlzIGdvaW5nIHRvIGJlIGNvbm5lY3RlZCBmb3IgcmV2ZXJzaWJsZSByZWFjdGlvbnMoMDogZ3JvdXAgMSBJRCBhbmQgMTpncm91cCAyIElEKVxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHRhcmdldCwgZWRnZVBhcmFtcywgaWQsIHZpc2liaWxpdHksIGdyb3VwSUQgKSB7XG4gICAgICBpZiAodHlwZW9mIGVkZ2VQYXJhbXMgIT0gJ29iamVjdCcpe1xuICAgICAgICB2YXIgc2JnbmNsYXNzID0gZWRnZVBhcmFtcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHNiZ25jbGFzcyA9IGVkZ2VQYXJhbXMuY2xhc3M7XG4gICAgICAgICAgdmFyIGxhbmd1YWdlID0gZWRnZVBhcmFtcy5sYW5ndWFnZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNzcyA9IHt9O1xuXG4gICAgICBpZiAodmlzaWJpbGl0eSkge1xuICAgICAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgIGNsYXNzOiBzYmduY2xhc3MsXG4gICAgICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlLFxuICAgICAgfTtcblxuICAgICAgdmFyIGRlZmF1bHRzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyggc2JnbmNsYXNzICk7XG5cbiAgICAgIC8vIGV4dGVuZCB0aGUgZGF0YSB3aXRoIGRlZmF1bHQgcHJvcGVydGllcyBvZiBlZGdlIHN0eWxlXG4gICAgICBPYmplY3Qua2V5cyggZGVmYXVsdHMgKS5mb3JFYWNoKCBmdW5jdGlvbiggcHJvcCApIHtcbiAgICAgICAgZGF0YVsgcHJvcCBdID0gZGVmYXVsdHNbIHByb3AgXTtcbiAgICAgIH0gKTtcblxuICAgICAgaWYoaWQpIHtcbiAgICAgICAgZGF0YS5pZCA9IGlkO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRhdGEuaWQgPSBlbGVtZW50VXRpbGl0aWVzLmdlbmVyYXRlRWRnZUlkKCk7XG4gICAgICB9XG5cbiAgICAgIGlmKGVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZVNCR05DYXJkaW5hbGl0eShzYmduY2xhc3MpKXtcbiAgICAgICAgZGF0YS5jYXJkaW5hbGl0eSA9IDA7XG4gICAgICB9XG5cbiAgICAgIHZhciBzb3VyY2VOb2RlID0gY3kuZ2V0RWxlbWVudEJ5SWQoc291cmNlKTsgLy8gVGhlIG9yaWdpbmFsIHNvdXJjZSBub2RlXG4gICAgICB2YXIgdGFyZ2V0Tm9kZSA9IGN5LmdldEVsZW1lbnRCeUlkKHRhcmdldCk7IC8vIFRoZSBvcmlnaW5hbCB0YXJnZXQgbm9kZVxuICAgICAgdmFyIHNvdXJjZUhhc1BvcnRzID0gc291cmNlTm9kZS5kYXRhKCdwb3J0cycpLmxlbmd0aCA9PT0gMjtcbiAgICAgIHZhciB0YXJnZXRIYXNQb3J0cyA9IHRhcmdldE5vZGUuZGF0YSgncG9ydHMnKS5sZW5ndGggPT09IDI7XG4gICAgICAvLyBUaGUgcG9ydHNvdXJjZSBhbmQgcG9ydHRhcmdldCB2YXJpYWJsZXNcbiAgICAgIHZhciBwb3J0c291cmNlO1xuICAgICAgdmFyIHBvcnR0YXJnZXQ7XG5cbiAgICAgIC8qXG4gICAgICAgKiBHZXQgaW5wdXQvb3V0cHV0IHBvcnQgaWQncyBvZiBhIG5vZGUgd2l0aCB0aGUgYXNzdW1wdGlvbiB0aGF0IHRoZSBub2RlIGhhcyB2YWxpZCBwb3J0cy5cbiAgICAgICAqL1xuICAgICAgdmFyIGdldElPUG9ydElkcyA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHZhciBub2RlSW5wdXRQb3J0SWQsIG5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgICAgIHZhciBub2RlUG9ydHNPcmRlcmluZyA9IHNiZ252aXpJbnN0YW5jZS5lbGVtZW50VXRpbGl0aWVzLmdldFBvcnRzT3JkZXJpbmcobm9kZSk7XG4gICAgICAgIHZhciBub2RlUG9ydHMgPSBub2RlLmRhdGEoJ3BvcnRzJyk7XG4gICAgICAgIGlmICggbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdMLXRvLVInIHx8IG5vZGVQb3J0c09yZGVyaW5nID09PSAnUi10by1MJyApIHtcbiAgICAgICAgICB2YXIgbGVmdFBvcnRJZCA9IG5vZGVQb3J0c1swXS54IDwgMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHggdmFsdWUgb2YgbGVmdCBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIG5lZ2F0aXZlXG4gICAgICAgICAgdmFyIHJpZ2h0UG9ydElkID0gbm9kZVBvcnRzWzBdLnggPiAwID8gbm9kZVBvcnRzWzBdLmlkIDogbm9kZVBvcnRzWzFdLmlkOyAvLyBUaGUgeCB2YWx1ZSBvZiByaWdodCBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIHBvc2l0aXZlXG4gICAgICAgICAgLypcbiAgICAgICAgICAgKiBJZiB0aGUgcG9ydCBvcmRlcmluZyBpcyBsZWZ0IHRvIHJpZ2h0IHRoZW4gdGhlIGlucHV0IHBvcnQgaXMgdGhlIGxlZnQgcG9ydCBhbmQgdGhlIG91dHB1dCBwb3J0IGlzIHRoZSByaWdodCBwb3J0LlxuICAgICAgICAgICAqIEVsc2UgaWYgaXQgaXMgcmlnaHQgdG8gbGVmdCBpdCBpcyB2aWNlIHZlcnNhXG4gICAgICAgICAgICovXG4gICAgICAgICAgbm9kZUlucHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdMLXRvLVInID8gbGVmdFBvcnRJZCA6IHJpZ2h0UG9ydElkO1xuICAgICAgICAgIG5vZGVPdXRwdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ1ItdG8tTCcgPyBsZWZ0UG9ydElkIDogcmlnaHRQb3J0SWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIG5vZGVQb3J0c09yZGVyaW5nID09PSAnVC10by1CJyB8fCBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0ItdG8tVCcgKXtcbiAgICAgICAgICB2YXIgdG9wUG9ydElkID0gbm9kZVBvcnRzWzBdLnkgPCAwID8gbm9kZVBvcnRzWzBdLmlkIDogbm9kZVBvcnRzWzFdLmlkOyAvLyBUaGUgeSB2YWx1ZSBvZiB0b3AgcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBuZWdhdGl2ZVxuICAgICAgICAgIHZhciBib3R0b21Qb3J0SWQgPSBub2RlUG9ydHNbMF0ueSA+IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB5IHZhbHVlIG9mIGJvdHRvbSBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIHBvc2l0aXZlXG4gICAgICAgICAgLypcbiAgICAgICAgICAgKiBJZiB0aGUgcG9ydCBvcmRlcmluZyBpcyB0b3AgdG8gYm90dG9tIHRoZW4gdGhlIGlucHV0IHBvcnQgaXMgdGhlIHRvcCBwb3J0IGFuZCB0aGUgb3V0cHV0IHBvcnQgaXMgdGhlIGJvdHRvbSBwb3J0LlxuICAgICAgICAgICAqIEVsc2UgaWYgaXQgaXMgcmlnaHQgdG8gbGVmdCBpdCBpcyB2aWNlIHZlcnNhXG4gICAgICAgICAgICovXG4gICAgICAgICAgbm9kZUlucHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdULXRvLUInID8gdG9wUG9ydElkIDogYm90dG9tUG9ydElkO1xuICAgICAgICAgIG5vZGVPdXRwdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0ItdG8tVCcgPyB0b3BQb3J0SWQgOiBib3R0b21Qb3J0SWQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIElPIHBvcnRzIG9mIHRoZSBub2RlXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaW5wdXRQb3J0SWQ6IG5vZGVJbnB1dFBvcnRJZCxcbiAgICAgICAgICBvdXRwdXRQb3J0SWQ6IG5vZGVPdXRwdXRQb3J0SWRcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIC8vIElmIGF0IGxlYXN0IG9uZSBlbmQgb2YgdGhlIGVkZ2UgaGFzIHBvcnRzIHRoZW4gd2Ugc2hvdWxkIGRldGVybWluZSB0aGUgcG9ydHMgd2hlcmUgdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZC5cbiAgICAgIGlmIChzb3VyY2VIYXNQb3J0cyB8fCB0YXJnZXRIYXNQb3J0cykge1xuICAgICAgICB2YXIgc291cmNlTm9kZUlucHV0UG9ydElkLCBzb3VyY2VOb2RlT3V0cHV0UG9ydElkLCB0YXJnZXROb2RlSW5wdXRQb3J0SWQsIHRhcmdldE5vZGVPdXRwdXRQb3J0SWQ7XG5cbiAgICAgICAgLy8gSWYgc291cmNlIG5vZGUgaGFzIHBvcnRzIHNldCB0aGUgdmFyaWFibGVzIGRlZGljYXRlZCBmb3IgaXRzIElPIHBvcnRzXG4gICAgICAgIGlmICggc291cmNlSGFzUG9ydHMgKSB7XG4gICAgICAgICAgdmFyIGlvUG9ydHMgPSBnZXRJT1BvcnRJZHMoc291cmNlTm9kZSk7XG4gICAgICAgICAgc291cmNlTm9kZUlucHV0UG9ydElkID0gaW9Qb3J0cy5pbnB1dFBvcnRJZDtcbiAgICAgICAgICBzb3VyY2VOb2RlT3V0cHV0UG9ydElkID0gaW9Qb3J0cy5vdXRwdXRQb3J0SWQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0YXJnZXQgbm9kZSBoYXMgcG9ydHMgc2V0IHRoZSB2YXJpYWJsZXMgZGVkaWNhdGVkIGZvciBpdHMgSU8gcG9ydHNcbiAgICAgICAgaWYgKCB0YXJnZXRIYXNQb3J0cyApIHtcbiAgICAgICAgICB2YXIgaW9Qb3J0cyA9IGdldElPUG9ydElkcyh0YXJnZXROb2RlKTtcbiAgICAgICAgICB0YXJnZXROb2RlSW5wdXRQb3J0SWQgPSBpb1BvcnRzLmlucHV0UG9ydElkO1xuICAgICAgICAgIHRhcmdldE5vZGVPdXRwdXRQb3J0SWQgPSBpb1BvcnRzLm91dHB1dFBvcnRJZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzYmduY2xhc3MgPT09ICdjb25zdW1wdGlvbicpIHtcbiAgICAgICAgICAvLyBBIGNvbnN1bXB0aW9uIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgaW5wdXQgcG9ydCBvZiB0aGUgdGFyZ2V0IG5vZGUgd2hpY2ggaXMgc3VwcG9zZWQgdG8gYmUgYSBwcm9jZXNzIChhbnkga2luZCBvZilcbiAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZU91dHB1dFBvcnRJZDtcbiAgICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZUlucHV0UG9ydElkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgLy8gQSBwcm9kdWN0aW9uIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgb3V0cHV0IHBvcnQgb2YgdGhlIHNvdXJjZSBub2RlIHdoaWNoIGlzIHN1cHBvc2VkIHRvIGJlIGEgcHJvY2VzcyAoYW55IGtpbmQgb2YpXG4gICAgICAgICAgLy8gQSBtb2R1bGF0aW9uIGVkZ2UgbWF5IGhhdmUgYSBsb2dpY2FsIG9wZXJhdG9yIGFzIHNvdXJjZSBub2RlIGluIHRoaXMgY2FzZSB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBvdXRwdXQgcG9ydCBvZiBpdFxuICAgICAgICAgIC8vIFRoZSBiZWxvdyBhc3NpZ25tZW50IHNhdGlzZnkgYWxsIG9mIHRoZXNlIGNvbmRpdGlvblxuICAgICAgICAgIGlmKGdyb3VwSUQgPT0gMCB8fCBncm91cElEID09IHVuZGVmaW5lZCkgeyAvLyBncm91cElEIDAgZm9yIHJldmVyc2libGUgcmVhY3Rpb25zIGdyb3VwIDBcbiAgICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlT3V0cHV0UG9ydElkO1xuICAgICAgICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVJbnB1dFBvcnRJZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7IC8vaWYgcmVhY3Rpb24gaXMgcmV2ZXJzaWJsZSBhbmQgZWRnZSBiZWxvbmdzIHRvIGdyb3VwIDFcbiAgICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlSW5wdXRQb3J0SWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoZWxlbWVudFV0aWxpdGllcy5pc01vZHVsYXRpb25BcmNDbGFzcyhzYmduY2xhc3MpIHx8IGVsZW1lbnRVdGlsaXRpZXMuaXNBRkFyY0NsYXNzKHNiZ25jbGFzcykpe1xuICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlT3V0cHV0UG9ydElkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PT0gJ2xvZ2ljIGFyYycpIHtcbiAgICAgICAgICB2YXIgc3JjQ2xhc3MgPSBzb3VyY2VOb2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgICAgdmFyIHRndENsYXNzID0gdGFyZ2V0Tm9kZS5kYXRhKCdjbGFzcycpO1xuICAgICAgICAgIHZhciBpc1NvdXJjZUxvZ2ljYWxPcCA9IHNyY0NsYXNzID09PSAnYW5kJyB8fCBzcmNDbGFzcyA9PT0gJ29yJyB8fCBzcmNDbGFzcyA9PT0gJ25vdCc7XG4gICAgICAgICAgdmFyIGlzVGFyZ2V0TG9naWNhbE9wID0gdGd0Q2xhc3MgPT09ICdhbmQnIHx8IHRndENsYXNzID09PSAnb3InIHx8IHRndENsYXNzID09PSAnbm90JztcblxuICAgICAgICAgIGlmIChpc1NvdXJjZUxvZ2ljYWxPcCAmJiBpc1RhcmdldExvZ2ljYWxPcCkge1xuICAgICAgICAgICAgLy8gSWYgYm90aCBlbmQgYXJlIGxvZ2ljYWwgb3BlcmF0b3JzIHRoZW4gdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgaW5wdXQgcG9ydCBvZiB0aGUgdGFyZ2V0IGFuZCB0aGUgb3V0cHV0IHBvcnQgb2YgdGhlIGlucHV0XG4gICAgICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZUlucHV0UG9ydElkO1xuICAgICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgICAgICAgfS8vIElmIGp1c3Qgb25lIGVuZCBvZiBsb2dpY2FsIG9wZXJhdG9yIHRoZW4gdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgaW5wdXQgcG9ydCBvZiB0aGUgbG9naWNhbCBvcGVyYXRvclxuICAgICAgICAgIGVsc2UgaWYgKGlzU291cmNlTG9naWNhbE9wKSB7XG4gICAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZUlucHV0UG9ydElkO1xuICAgICAgICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGlzVGFyZ2V0TG9naWNhbE9wKSB7XG4gICAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZU91dHB1dFBvcnRJZDtcbiAgICAgICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBkZWZhdWx0IHBvcnRzb3VyY2UvcG9ydHRhcmdldCBhcmUgdGhlIHNvdXJjZS90YXJnZXQgdGhlbXNlbHZlcy4gSWYgdGhleSBhcmUgbm90IHNldCB1c2UgdGhlc2UgZGVmYXVsdHMuXG4gICAgICAvLyBUaGUgcG9ydHNvdXJjZSBhbmQgcG9ydHRhcmdldCBhcmUgZGV0ZXJtaW5lZCBzZXQgdGhlbSBpbiBkYXRhIG9iamVjdC5cbiAgICAgIGRhdGEucG9ydHNvdXJjZSA9IHBvcnRzb3VyY2UgfHwgc291cmNlO1xuICAgICAgZGF0YS5wb3J0dGFyZ2V0ID0gcG9ydHRhcmdldCB8fCB0YXJnZXQ7XG5cbiAgICAgIHZhciBlbGVzID0gY3kuYWRkKHtcbiAgICAgICAgZ3JvdXA6IFwiZWRnZXNcIixcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgY3NzOiBjc3NcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbmV3RWRnZSA9IGVsZXNbZWxlcy5sZW5ndGggLSAxXTtcblxuICAgICAgcmV0dXJuIG5ld0VkZ2U7XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMgPSBmdW5jdGlvbihfc291cmNlLCBfdGFyZ2V0LCBub2RlUGFyYW1zKSB7XG4gICAgICAvLyBJZiBzb3VyY2UgYW5kIHRhcmdldCBJRHMgYXJlIGdpdmVuIGdldCB0aGUgZWxlbWVudHMgYnkgSURzXG4gICAgICB2YXIgc291cmNlID0gdHlwZW9mIF9zb3VyY2UgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3NvdXJjZSkgOiBfc291cmNlO1xuICAgICAgdmFyIHRhcmdldCA9IHR5cGVvZiBfdGFyZ2V0ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF90YXJnZXQpIDogX3RhcmdldDtcblxuICAgICAgLy8gUHJvY2VzcyBwYXJlbnQgc2hvdWxkIGJlIHRoZSBjbG9zZXN0IGNvbW1vbiBhbmNlc3RvciBvZiB0aGUgc291cmNlIGFuZCB0YXJnZXQgbm9kZXNcbiAgICAgIHZhciBwcm9jZXNzUGFyZW50ID0gY3kuY29sbGVjdGlvbihbc291cmNlWzBdLCB0YXJnZXRbMF1dKS5jb21tb25BbmNlc3RvcnMoKS5maXJzdCgpO1xuXG4gICAgICAvLyBQcm9jZXNzIHNob3VsZCBiZSBhdCB0aGUgbWlkZGxlIG9mIHRoZSBzb3VyY2UgYW5kIHRhcmdldCBub2Rlc1xuICAgICAgdmFyIHggPSAoIHNvdXJjZS5wb3NpdGlvbigneCcpICsgdGFyZ2V0LnBvc2l0aW9uKCd4JykgKSAvIDI7XG4gICAgICB2YXIgeSA9ICggc291cmNlLnBvc2l0aW9uKCd5JykgKyB0YXJnZXQucG9zaXRpb24oJ3knKSApIC8gMjtcblxuICAgICAgLy8gQ3JlYXRlIHRoZSBwcm9jZXNzIHdpdGggZ2l2ZW4vY2FsY3VsYXRlZCB2YXJpYWJsZXNcbiAgICAgIHZhciBwcm9jZXNzID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHgsIHksIG5vZGVQYXJhbXMsIHVuZGVmaW5lZCwgcHJvY2Vzc1BhcmVudC5pZCgpKTtcbiAgICAgICAgdmFyIHhkaWZmID0gc291cmNlLnBvc2l0aW9uKCd4JykgLSB0YXJnZXQucG9zaXRpb24oJ3gnKTtcbiAgICAgICAgdmFyIHlkaWZmID0gc291cmNlLnBvc2l0aW9uKCd5JykgLSB0YXJnZXQucG9zaXRpb24oJ3knKVxuICAgICAgICBpZiAoTWF0aC5hYnMoeGRpZmYpID49IE1hdGguYWJzKHlkaWZmKSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHhkaWZmIDwgMClcbiAgICAgICAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ0wtdG8tUicpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnUi10by1MJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoeWRpZmYgPCAwKVxuICAgICAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnVC10by1CJyk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdCLXRvLVQnKTtcbiAgICAgICAgfVxuXG5cbiAgICAgIC8vIENyZWF0ZSB0aGUgZWRnZXMgb25lIGlzIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBzb3VyY2Ugbm9kZSAod2hpY2ggc2hvdWxkIGJlIGEgY29uc3VtcHRpb24pLFxuICAgICAgLy8gdGhlIG90aGVyIG9uZSBpcyBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgdGFyZ2V0IG5vZGUgKHdoaWNoIHNob3VsZCBiZSBhIHByb2R1Y3Rpb24pLlxuICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gcGxlYXNlIHJlZmVyIHRvIFNCR04tUEQgcmVmZXJlbmNlIGNhcmQuXG4gICAgICB2YXIgZWRnZUJ0d1NyYyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2UuaWQoKSwgcHJvY2Vzcy5pZCgpLCB7Y2xhc3MgOiAnY29uc3VtcHRpb24nLCBsYW5ndWFnZSA6IG5vZGVQYXJhbXMubGFuZ3VhZ2V9KTtcbiAgICAgIHZhciBlZGdlQnR3VGd0ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgdGFyZ2V0LmlkKCksIHtjbGFzcyA6ICdwcm9kdWN0aW9uJywgbGFuZ3VhZ2UgOiBub2RlUGFyYW1zLmxhbmd1YWdlfSk7XG5cbiAgICAgIC8vIENyZWF0ZSBhIGNvbGxlY3Rpb24gaW5jbHVkaW5nIHRoZSBlbGVtZW50cyBhbmQgdG8gYmUgcmV0dXJuZWRcbiAgICAgIHZhciBjb2xsZWN0aW9uID0gY3kuY29sbGVjdGlvbihbcHJvY2Vzc1swXSwgZWRnZUJ0d1NyY1swXSwgZWRnZUJ0d1RndFswXV0pO1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogVGhpcyBtZXRob2QgYXNzdW1lcyB0aGF0IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQgY29udGFpbnMgYXQgbGVhc3Qgb25lIG5vZGVcbiAgICAgKiBhbmQgYWxsIG9mIHRoZSBub2RlcyBpbmNsdWRpbmcgaW4gaXQgaGF2ZSB0aGUgc2FtZSBwYXJlbnQuIEl0IGNyZWF0ZXMgYSBjb21wb3VuZCBmb3QgdGhlIGdpdmVuIG5vZGVzIGFuIGhhdmluZyB0aGUgZ2l2ZW4gdHlwZS5cbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChub2Rlc1RvTWFrZUNvbXBvdW5kLCBjb21wb3VuZFR5cGUpIHtcbiAgICAgIHZhciBvbGRQYXJlbnRJZCA9IG5vZGVzVG9NYWtlQ29tcG91bmRbMF0uZGF0YShcInBhcmVudFwiKTtcbiAgICAgIHZhciBsYW5ndWFnZSA9IG5vZGVzVG9NYWtlQ29tcG91bmRbMF0uZGF0YShcImxhbmd1YWdlXCIpO1xuICAgICAgLy8gaWYgbm9kZXNUb01ha2VDb21wb3VuZCBjb250YWluIGJvdGggUEQgYW5kIEFGIG5vZGVzLCB0aGVuIHNldCBsYW5ndWFnZSBvZiBjb21wb3VuZCBhcyBVbmtub3duXG4gICAgICBmb3IoIHZhciBpPTE7IGk8bm9kZXNUb01ha2VDb21wb3VuZC5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGlmKG5vZGVzVG9NYWtlQ29tcG91bmRbaV0gIT0gbGFuZ3VhZ2Upe1xuICAgICAgICAgIGxhbmd1YWdlID0gXCJVbmtub3duXCI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIFRoZSBwYXJlbnQgb2YgbmV3IGNvbXBvdW5kIHdpbGwgYmUgdGhlIG9sZCBwYXJlbnQgb2YgdGhlIG5vZGVzIHRvIG1ha2UgY29tcG91bmQuIHgsIHkgYW5kIGlkIHBhcmFtZXRlcnMgYXJlIG5vdCBzZXQuXG4gICAgICB2YXIgbmV3Q29tcG91bmQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHtjbGFzcyA6IGNvbXBvdW5kVHlwZSwgbGFuZ3VhZ2UgOiBsYW5ndWFnZX0sIHVuZGVmaW5lZCwgb2xkUGFyZW50SWQpO1xuICAgICAgdmFyIG5ld0NvbXBvdW5kSWQgPSBuZXdDb21wb3VuZC5pZCgpO1xuICAgICAgdmFyIG5ld0VsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudChub2Rlc1RvTWFrZUNvbXBvdW5kLCBuZXdDb21wb3VuZElkKTtcbiAgICAgIG5ld0VsZXMgPSBuZXdFbGVzLnVuaW9uKG5ld0NvbXBvdW5kKTtcbiAgICAgIHJldHVybiBuZXdFbGVzO1xuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRyYW5zbGF0aW9uUmVhY3Rpb24gPSBmdW5jdGlvbihtUm5hTmFtZSwgcHJvdGVpbk5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgZWRnZUxlbmd0aCkge1xuICAgICAgY29uc3QgZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhcInRyYW5zbGF0aW9uXCIpO1xuICAgICAgY29uc3QgZGVmYXVsdFNvdXJjZUFuZFNpbmtQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhcInNvdXJjZSBhbmQgc2lua1wiKTtcbiAgICAgIGNvbnN0IGRlZmF1bHROdWNsZWljQWNpZEZlYXR1cmVQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhcIm51Y2xlaWMgYWNpZCBmZWF0dXJlXCIpO1xuICAgICAgY29uc3QgZGVmYXVsdE1hY3JvbW9sZWN1bGVQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhcIm1hY3JvbW9sZWN1bGVcIik7XG4gICAgICBjb25zdCBtYWNyb21vbGVjdWxlV2lkdGggPSBkZWZhdWx0TWFjcm9tb2xlY3VsZVByb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICBjb25zdCBzb3VyY2VBbmRTaW5rV2lkdGggPSBkZWZhdWx0U291cmNlQW5kU2lua1Byb3BlcnRpZXMud2lkdGggIHx8IDUwO1xuICAgICAgY29uc3QgbnVjbGVpY0FjaWRGZWF0dXJlSGVpZ2h0ID0gZGVmYXVsdE51Y2xlaWNBY2lkRmVhdHVyZVByb3BlcnRpZXMuaGVpZ2h0IHx8IDUwO1xuICAgICAgY29uc3QgcHJvY2Vzc1dpZHRoID0gZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xuICAgICAgY29uc3QgcHJvY2Vzc0hlaWdodCA9IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XG4gICAgICB2YXIgcHJvY2Vzc1Bvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uIHx8IGVsZW1lbnRVdGlsaXRpZXMuY29udmVydFRvTW9kZWxQb3NpdGlvbih7eDogY3kud2lkdGgoKSAvIDIsIHk6IGN5LmhlaWdodCgpIC8gMn0pO1xuICAgICAgdmFyIGVkZ2VMZW5ndGggPSBlZGdlTGVuZ3RoIHx8IDYwO1xuXG4gICAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShcIlBEXCIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvY2Vzc05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB7Y2xhc3M6IFwicHJvY2Vzc1wiLCBsYW5ndWFnZTogXCJQRFwifSk7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2Vzc05vZGUsIFwiTC10by1SXCIpO1xuICAgICAgcHJvY2Vzc05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIGNvbnN0IHhQb3NPZlNvdXJjZUFuZFNpbmtOb2RlID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIHNvdXJjZUFuZFNpbmtXaWR0aCAvIDI7XG4gICAgICBjb25zdCB5UG9zT2ZTb3VyY2VBbmRTaW5rTm9kZSA9IHByb2Nlc3NQb3NpdGlvbi55O1xuICAgICAgdmFyIHNvdXJjZUFuZFNpbmtOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZlNvdXJjZUFuZFNpbmtOb2RlLCB5UG9zT2ZTb3VyY2VBbmRTaW5rTm9kZSwge2NsYXNzOiAnc291cmNlIGFuZCBzaW5rJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIHNvdXJjZUFuZFNpbmtOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICB2YXIgY29uc3VtcHRpb25FZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZUFuZFNpbmtOb2RlLmlkKCksIHByb2Nlc3NOb2RlLmlkKCksIHtjbGFzczogJ2NvbnN1bXB0aW9uJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIGNvbnN1bXB0aW9uRWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgY29uc3QgeFBvc09mbVJuYU5vZGUgPSBwcm9jZXNzUG9zaXRpb24ueDtcbiAgICAgIGNvbnN0IHlQb3NPZm1SbmFOb2RlID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc0hlaWdodCAvIDIgLSBudWNsZWljQWNpZEZlYXR1cmVIZWlnaHQgLyAyO1xuICAgICAgdmFyIG1SbmFOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZm1SbmFOb2RlLCB5UG9zT2ZtUm5hTm9kZSwge2NsYXNzOiAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgbVJuYU5vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICBtUm5hTm9kZS5kYXRhKCdsYWJlbCcsIG1SbmFOYW1lKTtcbiAgICAgIGNvbnN0IGluZm9ib3hPYmplY3RPZkdlbmUgPSB7XG4gICAgICAgIGNsYXp6OiBcInVuaXQgb2YgaW5mb3JtYXRpb25cIixcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICB0ZXh0OiAnY3Q6bVJOQSdcbiAgICAgICAgfSxcbiAgICAgICAgYmJveDoge1xuICAgICAgICAgIHc6IDQ1LFxuICAgICAgICAgIGg6IDE1XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG1SbmFOb2RlLCBpbmZvYm94T2JqZWN0T2ZHZW5lKTtcblxuICAgICAgdmFyIG5lY2Vzc2FyeVN0aW11bGF0aW9uRWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShtUm5hTm9kZS5pZCgpLCBwcm9jZXNzTm9kZS5pZCgpLCB7Y2xhc3M6ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgbmVjZXNzYXJ5U3RpbXVsYXRpb25FZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICBjb25zdCB4UG9zT2ZQcm90ZWluTm9kZSA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICAgICAgY29uc3QgeVBvc3RPZlByb3RlaW5Ob2RlID0gcHJvY2Vzc1Bvc2l0aW9uLnk7XG4gICAgICB2YXIgcHJvdGVpbk5vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc09mUHJvdGVpbk5vZGUsIHlQb3N0T2ZQcm90ZWluTm9kZSwge2NsYXNzOiAnbWFjcm9tb2xlY3VsZScsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBwcm90ZWluTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgIHByb3RlaW5Ob2RlLmRhdGEoJ2xhYmVsJywgcHJvdGVpbk5hbWUpO1xuICBcbiAgICAgIHZhciBwcm9kdWN0aW9uRWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzTm9kZS5pZCgpLCBwcm90ZWluTm9kZS5pZCgpLCB7Y2xhc3M6ICdwcm9kdWN0aW9uJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIHByb2R1Y3Rpb25FZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICBjeS5lbmRCYXRjaCgpO1xuXG4gICAgICAvL2ZpbHRlciB0aGUganVzdCBhZGRlZCBlbGVtZW10cyB0byByZXR1cm4gdGhlbSBhbmQgcmVtb3ZlIGp1c3QgYWRkZWQgbWFya1xuICAgICAgdmFyIGVsZXMgPSBjeS5lbGVtZW50cygnW2p1c3RBZGRlZF0nKTtcbiAgICAgIGVsZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkJyk7XG5cbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICAgIGVsZXMuc2VsZWN0KCk7XG5cbiAgICAgIHJldHVybiBlbGVzOyAvLyBSZXR1cm4gdGhlIGp1c3QgYWRkZWQgZWxlbWVudHNcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUcmFuc2NyaXB0aW9uUmVhY3Rpb24gPSBmdW5jdGlvbihnZW5lTmFtZSwgbVJuYU5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgZWRnZUxlbmd0aCkge1xuICAgICAgY29uc3QgZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhcInRyYW5zY3JpcHRpb25cIik7XG4gICAgICBjb25zdCBkZWZhdWx0U291cmNlQW5kU2lua1Byb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKFwic291cmNlIGFuZCBzaW5rXCIpO1xuICAgICAgY29uc3QgZGVmYXVsdE51Y2xlaWNBY2lkRmVhdHVyZVByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIik7XG4gICAgICBjb25zdCBzb3VyY2VBbmRTaW5rV2lkdGggPSBkZWZhdWx0U291cmNlQW5kU2lua1Byb3BlcnRpZXMud2lkdGggIHx8IDUwO1xuICAgICAgY29uc3QgbnVjbGVpY0FjaWRGZWF0dXJlSGVpZ2h0ID0gZGVmYXVsdE51Y2xlaWNBY2lkRmVhdHVyZVByb3BlcnRpZXMuaGVpZ2h0IHx8IDUwO1xuICAgICAgY29uc3QgbnVjbGVpY0FjaWRGZWF0dXJlV2lkdGggPSBkZWZhdWx0TnVjbGVpY0FjaWRGZWF0dXJlUHJvcGVydGllcy53aWR0aCB8fCA1MDtcbiAgICAgIGNvbnN0IHByb2Nlc3NXaWR0aCA9IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcy53aWR0aCB8fCA1MDtcbiAgICAgIGNvbnN0IHByb2Nlc3NIZWlnaHQgPSBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMuaGVpZ2h0IHx8IDUwO1xuICAgICAgdmFyIHByb2Nlc3NQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbiB8fCBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcbiAgICAgIHZhciBlZGdlTGVuZ3RoID0gZWRnZUxlbmd0aCB8fCA2MDtcblxuICAgICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJQRFwiKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHByb2Nlc3NOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwge2NsYXNzOiBcInByb2Nlc3NcIiwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3NOb2RlLCBcIkwtdG8tUlwiKTtcbiAgICAgIHByb2Nlc3NOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICBjb25zdCB4UG9zT2ZTb3VyY2VBbmRTaW5rTm9kZSA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBzb3VyY2VBbmRTaW5rV2lkdGggLyAyO1xuICAgICAgY29uc3QgeVBvc09mU291cmNlQW5kU2lua05vZGUgPSBwcm9jZXNzUG9zaXRpb24ueTtcbiAgICAgIHZhciBzb3VyY2VBbmRTaW5rTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zT2ZTb3VyY2VBbmRTaW5rTm9kZSwgeVBvc09mU291cmNlQW5kU2lua05vZGUsIHtjbGFzczogJ3NvdXJjZSBhbmQgc2luaycsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBzb3VyY2VBbmRTaW5rTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgdmFyIGNvbnN1bXB0aW9uRWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2VBbmRTaW5rTm9kZS5pZCgpLCBwcm9jZXNzTm9kZS5pZCgpLCB7Y2xhc3M6ICdjb25zdW1wdGlvbicsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBjb25zdW1wdGlvbkVkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIGNvbnN0IHhQb3NPZkdlbmVOb2RlID0gcHJvY2Vzc1Bvc2l0aW9uLng7XG4gICAgICBjb25zdCB5UG9zT2ZHZW5lTm9kZSA9IHByb2Nlc3NQb3NpdGlvbi55IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NIZWlnaHQgLyAyIC0gbnVjbGVpY0FjaWRGZWF0dXJlSGVpZ2h0IC8gMjtcbiAgICAgIHZhciBnZW5lTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zT2ZHZW5lTm9kZSwgeVBvc09mR2VuZU5vZGUsIHtjbGFzczogJ251Y2xlaWMgYWNpZCBmZWF0dXJlJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIGdlbmVOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgZ2VuZU5vZGUuZGF0YSgnbGFiZWwnLCBnZW5lTmFtZSk7XG4gICAgICBjb25zdCBpbmZvYm94T2JqZWN0T2ZHZW5lID0ge1xuICAgICAgICBjbGF6ejogXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIsXG4gICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgdGV4dDogJ2N0OmdlbmUnXG4gICAgICAgIH0sXG4gICAgICAgIGJib3g6IHtcbiAgICAgICAgICB3OiAzNixcbiAgICAgICAgICBoOiAxNVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChnZW5lTm9kZSwgaW5mb2JveE9iamVjdE9mR2VuZSk7XG5cbiAgICAgIHZhciBuZWNlc3NhcnlTdGltdWxhdGlvbkVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UoZ2VuZU5vZGUuaWQoKSwgcHJvY2Vzc05vZGUuaWQoKSwge2NsYXNzOiAnbmVjZXNzYXJ5IHN0aW11bGF0aW9uJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIG5lY2Vzc2FyeVN0aW11bGF0aW9uRWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgY29uc3QgeFBvc09mbVJuYU5vZGUgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbnVjbGVpY0FjaWRGZWF0dXJlV2lkdGggLyAyO1xuICAgICAgY29uc3QgeVBvc3RPZm1SbmFOb2RlID0gcHJvY2Vzc1Bvc2l0aW9uLnk7XG4gICAgICB2YXIgbVJuYU5vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc09mbVJuYU5vZGUsIHlQb3N0T2ZtUm5hTm9kZSwge2NsYXNzOiAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgbVJuYU5vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICBtUm5hTm9kZS5kYXRhKCdsYWJlbCcsIG1SbmFOYW1lKTtcbiAgICAgIGNvbnN0IGluZm9ib3hPYmplY3RPZm1SbmEgPSB7XG4gICAgICAgIGNsYXp6OiBcInVuaXQgb2YgaW5mb3JtYXRpb25cIixcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICB0ZXh0OiAnY3Q6bVJOQSdcbiAgICAgICAgfSxcbiAgICAgICAgYmJveDoge1xuICAgICAgICAgIHc6IDQ1LFxuICAgICAgICAgIGg6IDE1XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG1SbmFOb2RlLCBpbmZvYm94T2JqZWN0T2ZtUm5hKTtcblxuICAgICAgdmFyIHByb2R1Y3Rpb25FZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3NOb2RlLmlkKCksIG1SbmFOb2RlLmlkKCksIHtjbGFzczogJ3Byb2R1Y3Rpb24nLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgcHJvZHVjdGlvbkVkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIGN5LmVuZEJhdGNoKCk7XG5cbiAgICAgIC8vZmlsdGVyIHRoZSBqdXN0IGFkZGVkIGVsZW1lbXRzIHRvIHJldHVybiB0aGVtIGFuZCByZW1vdmUganVzdCBhZGRlZCBtYXJrXG4gICAgICB2YXIgZWxlcyA9IGN5LmVsZW1lbnRzKCdbanVzdEFkZGVkXScpO1xuICAgICAgZWxlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWQnKTtcblxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgZWxlcy5zZWxlY3QoKTtcblxuICAgICAgcmV0dXJuIGVsZXM7IC8vIFJldHVybiB0aGUganVzdCBhZGRlZCBlbGVtZW50c1xuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnJvdGF0ZTkwID0gZnVuY3Rpb24ocG9pbnQsIGNlbnRlcikge1xuICAgICAgY29uc3QgcmVsYXRpdmVYID0gY2VudGVyLnggLSBwb2ludC54O1xuICAgICAgY29uc3QgcmVsYXRpdmVZID0gY2VudGVyLnkgLSBwb2ludC55O1xuXG4gICAgICBjb25zdCByZWxhdGl2ZVJvdGF0ZWRYID0gcmVsYXRpdmVZO1xuICAgICAgY29uc3QgcmVsYXRpdmVSb3RhdGVkWSA9IC0xICogcmVsYXRpdmVYO1xuXG4gICAgICBjb25zdCByZXN1bHRYID0gcmVsYXRpdmVSb3RhdGVkWCArIGNlbnRlci54O1xuICAgICAgY29uc3QgcmVzdWx0WSA9IHJlbGF0aXZlUm90YXRlZFkgKyBjZW50ZXIueTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogcmVzdWx0WCxcbiAgICAgICAgeTogcmVzdWx0WVxuICAgICAgfVxuICAgIH1cblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29udmVyc2lvbiA9IGZ1bmN0aW9uIChtYWNyb21vbGVjdWxlTmFtZSwgcmVndWxhdG9yLCByZWd1bGF0b3JNdWx0aW1lciwgb3JpZW50YXRpb24sIGlucHV0SW5mb2JveExhYmVsLCBvdXRwdXRJbmZvYm94TGFiZWwpIHtcbiAgICAgIGNvbnN0IGhhc1JlZ3VsYXRvciA9IHJlZ3VsYXRvci5uYW1lICE9PSB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBkZWZhdWx0TWFjcm9tb2xlY3VsZVByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKFwibWFjcm9tb2xlY3VsZVwiKTtcbiAgICAgIGNvbnN0IGRlZmF1bHRSZWd1bGF0b3JQcm9wZXJ0aWVzID0gaGFzUmVndWxhdG9yID8gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhyZWd1bGF0b3IudHlwZSkgOiB7fTtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoXCJjYXRhbHl0aWNcIik7XG4gICAgICBjb25zdCBwcm9jZXNzV2lkdGggPSBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICBjb25zdCBtYWNyb21vbGVjdWxlV2lkdGggPSBkZWZhdWx0TWFjcm9tb2xlY3VsZVByb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICBjb25zdCBtYWNyb21vbGVjdWxlSGVpZ2h0ID0gZGVmYXVsdE1hY3JvbW9sZWN1bGVQcm9wZXJ0aWVzLmhlaWdodCB8fCA1MDsgXG4gICAgICBjb25zdCBwcm9jZXNzSGVpZ2h0ID0gZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzLmhlaWdodCB8fCA1MDtcbiAgICAgIGNvbnN0IHJlZ3VsYXRvckhlaWdodCA9IGRlZmF1bHRSZWd1bGF0b3JQcm9wZXJ0aWVzLmhlaWdodCB8fCA1MDtcbiAgICAgIGNvbnN0IHByb2Nlc3NQb3NpdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMuY29udmVydFRvTW9kZWxQb3NpdGlvbih7eDogY3kud2lkdGgoKSAvIDIsIHk6IGN5LmhlaWdodCgpIC8gMn0pO1xuICAgICAgY29uc3QgZWRnZUxlbmd0aCA9IDMwO1xuICAgICAgY29uc3QgcHJvY2Vzc1BvcnRzT3JkZXJpbmcgPSBvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiID8gXCJULXRvLUJcIiA6IFwiTC10by1SXCI7XG5cbiAgICAgIGN5LnN0YXJ0QmF0Y2goKTtcblxuICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJQRFwiKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHhQb3NPZklucHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gICAgICBsZXQgeFBvc09mT3V0cHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gICAgICBsZXQgeVBvc09mSW5wdXQgPSBwcm9jZXNzUG9zaXRpb24ueTtcbiAgICAgIGxldCB5UG9zT2ZPdXRwdXQgPSBwcm9jZXNzUG9zaXRpb24ueTtcblxuICAgICAgbGV0IHByb2Nlc3NOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwge2NsYXNzOiBcInByb2Nlc3NcIiwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3NOb2RlLCBwcm9jZXNzUG9ydHNPcmRlcmluZyk7XG4gICAgICBwcm9jZXNzTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgbGV0IG5vZGVQb3NpdGlvbiA9IHtcbiAgICAgICAgeDogeFBvc09mSW5wdXQsXG4gICAgICAgIHk6IHlQb3NPZklucHV0XG4gICAgICB9XG4gICAgICBpZiAob3JpZW50YXRpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgICBub2RlUG9zaXRpb24gPSBlbGVtZW50VXRpbGl0aWVzLnJvdGF0ZTkwKG5vZGVQb3NpdGlvbiwgcHJvY2Vzc1Bvc2l0aW9uKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGlucHV0Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShub2RlUG9zaXRpb24ueCwgbm9kZVBvc2l0aW9uLnksIHtjbGFzczogJ21hY3JvbW9sZWN1bGUnLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgaW5wdXROb2RlLmRhdGEoXCJqdXN0QWRkZWRcIiwgdHJ1ZSk7XG4gICAgICBpbnB1dE5vZGUuZGF0YShcImxhYmVsXCIsIG1hY3JvbW9sZWN1bGVOYW1lKTtcblxuICAgICAgY29uc3QgbWluSW5mb2JveERpbWVuc2lvbiA9IDIwO1xuICAgICAgY29uc3Qgd2lkdGhQZXJDaGFyID0gNjtcbiAgICAgIGNvbnN0IGlucHV0SW5mb2JveFdpZHRoID0gaW5wdXRJbmZvYm94TGFiZWwubGVuZ3RoID4gMCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1heCh3aWR0aFBlckNoYXIgKiBpbnB1dEluZm9ib3hMYWJlbC5sZW5ndGgsIG1pbkluZm9ib3hEaW1lbnNpb24pIDogXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbkluZm9ib3hEaW1lbnNpb247IFxuICAgICAgbGV0IGluZm9ib3hPYmplY3QgPSB7XG4gICAgICAgIGNsYXp6OiBcInVuaXQgb2YgaW5mb3JtYXRpb25cIixcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICB0ZXh0OiBpbnB1dEluZm9ib3hMYWJlbFxuICAgICAgICB9LFxuICAgICAgICBiYm94OiB7XG4gICAgICAgICAgdzogaW5wdXRJbmZvYm94V2lkdGgsXG4gICAgICAgICAgaDogbWluSW5mb2JveERpbWVuc2lvblxuICAgICAgICB9LFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIFwic2hhcGUtbmFtZVwiOiBcImVsbGlwc2VcIlxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChpbnB1dE5vZGUsIGluZm9ib3hPYmplY3QpO1xuXG4gICAgICBsZXQgaW5wdXRFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKGlucHV0Tm9kZS5pZCgpLCBwcm9jZXNzTm9kZS5pZCgpLCB7Y2xhc3M6ICdjb25zdW1wdGlvbicsIGxhbmd1YWdlOiAnUEQnfSlcbiAgICAgIGlucHV0RWRnZS5kYXRhKFwianVzdEFkZGVkXCIsIHRydWUpO1xuXG4gICAgICBub2RlUG9zaXRpb24gPSB7XG4gICAgICAgIHg6IHhQb3NPZk91dHB1dCxcbiAgICAgICAgeTogeVBvc09mT3V0cHV0XG4gICAgICB9XG5cbiAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICAgIG5vZGVQb3NpdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMucm90YXRlOTAobm9kZVBvc2l0aW9uLCBwcm9jZXNzUG9zaXRpb24pO1xuICAgICAgfVxuXG4gICAgICBsZXQgb3V0cHV0Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShub2RlUG9zaXRpb24ueCwgbm9kZVBvc2l0aW9uLnksIHtjbGFzczogJ21hY3JvbW9sZWN1bGUnLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgb3V0cHV0Tm9kZS5kYXRhKFwianVzdEFkZGVkXCIsIHRydWUpO1xuICAgICAgb3V0cHV0Tm9kZS5kYXRhKFwibGFiZWxcIiwgbWFjcm9tb2xlY3VsZU5hbWUpO1xuXG4gICAgICBjb25zdCBvdXRwdXRJbmZvYm94V2lkdGggPSBvdXRwdXRJbmZvYm94TGFiZWwubGVuZ3RoID4gMCA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1heCh3aWR0aFBlckNoYXIgKiBvdXRwdXRJbmZvYm94TGFiZWwubGVuZ3RoLCBtaW5JbmZvYm94RGltZW5zaW9uKSA6IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5JbmZvYm94RGltZW5zaW9uO1xuICAgICAgaW5mb2JveE9iamVjdCA9IHtcbiAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiLFxuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgIHRleHQ6IG91dHB1dEluZm9ib3hMYWJlbFxuICAgICAgICB9LFxuICAgICAgICBiYm94OiB7XG4gICAgICAgICAgdzogb3V0cHV0SW5mb2JveFdpZHRoLFxuICAgICAgICAgIGg6IG1pbkluZm9ib3hEaW1lbnNpb25cbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBcInNoYXBlLW5hbWVcIjogXCJlbGxpcHNlXCJcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gob3V0cHV0Tm9kZSwgaW5mb2JveE9iamVjdCk7XG5cbiAgICAgIGxldCBvdXRwdXRFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3NOb2RlLmlkKCksIG91dHB1dE5vZGUuaWQoKSwge2NsYXNzOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlOiAnUEQnfSlcbiAgICAgIG91dHB1dEVkZ2UuZGF0YShcImp1c3RBZGRlZFwiLCB0cnVlKTtcblxuICAgICAgaWYgKGhhc1JlZ3VsYXRvcikge1xuICAgICAgICBjb25zdCByZWd1bGF0b3JOYW1lID0gcmVndWxhdG9yLm5hbWU7XG4gICAgICAgIGNvbnN0IHJlZ3VsYXRvclR5cGUgPSByZWd1bGF0b3IudHlwZTtcbiAgICAgICAgbGV0IHhQb3NPZlJlZ3VsYXRvciA9IHByb2Nlc3NQb3NpdGlvbi54O1xuICAgICAgICBsZXQgeVBvc09mUmVndWxhdG9yID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKHByb2Nlc3NIZWlnaHQgLyAyKSArIChyZWd1bGF0b3JIZWlnaHQgLyAyKSArIGVkZ2VMZW5ndGgpOyBcblxuICAgICAgICBub2RlUG9zaXRpb24gPSB7XG4gICAgICAgICAgeDogeFBvc09mUmVndWxhdG9yLFxuICAgICAgICAgIHk6IHlQb3NPZlJlZ3VsYXRvclxuICAgICAgICB9XG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICAgICAgbm9kZVBvc2l0aW9uID0gZWxlbWVudFV0aWxpdGllcy5yb3RhdGU5MChub2RlUG9zaXRpb24sIHByb2Nlc3NQb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVndWxhdG9yTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShub2RlUG9zaXRpb24ueCwgbm9kZVBvc2l0aW9uLnksIHtjbGFzczogcmVndWxhdG9yVHlwZSwgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgICAgcmVndWxhdG9yTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgICAgcmVndWxhdG9yTm9kZS5kYXRhKCdsYWJlbCcsIHJlZ3VsYXRvck5hbWUpO1xuXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMocmVndWxhdG9yTm9kZSwgcmVndWxhdG9yTXVsdGltZXIpO1xuXG4gICAgICAgIGxldCByZWd1bGF0b3JFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHJlZ3VsYXRvck5vZGUuaWQoKSwgcHJvY2Vzc05vZGUuaWQoKSwge2NsYXNzOiAnY2F0YWx5c2lzJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgICAgcmVndWxhdG9yRWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgY3kuZW5kQmF0Y2goKTtcblxuICAgICAgY29uc3QgZWxlcyA9IGN5LmVsZW1lbnRzKCdbanVzdEFkZGVkXScpO1xuICAgICAgZWxlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWQnKTtcblxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgZWxlcy5zZWxlY3QoKTtcblxuICAgICAgcmV0dXJuIGVsZXM7XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlTWV0YWJvbGljUmVhY3Rpb24gPSBmdW5jdGlvbiAoaW5wdXRzLCBvdXRwdXRzLCByZXZlcnNpYmxlLCByZWd1bGF0b3IsIHJlZ3VsYXRvck11bHRpbWVyLCBvcmllbnRhdGlvbikge1xuICAgICAgbGV0IHJvdGF0ZTkwID0gZnVuY3Rpb24ocG9pbnQsIGNlbnRlcikge1xuICAgICAgICBjb25zdCByZWxhdGl2ZVggPSBjZW50ZXIueCAtIHBvaW50Lng7XG4gICAgICAgIGNvbnN0IHJlbGF0aXZlWSA9IGNlbnRlci55IC0gcG9pbnQueTtcblxuICAgICAgICBjb25zdCByZWxhdGl2ZVJvdGF0ZWRYID0gcmVsYXRpdmVZO1xuICAgICAgICBjb25zdCByZWxhdGl2ZVJvdGF0ZWRZID0gLTEgKiByZWxhdGl2ZVg7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0WCA9IHJlbGF0aXZlUm90YXRlZFggKyBjZW50ZXIueDtcbiAgICAgICAgY29uc3QgcmVzdWx0WSA9IHJlbGF0aXZlUm90YXRlZFkgKyBjZW50ZXIueTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHg6IHJlc3VsdFgsXG4gICAgICAgICAgeTogcmVzdWx0WVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3QgaGFzUmVndWxhdG9yID0gcmVndWxhdG9yLm5hbWUgIT09IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBcInNpbXBsZSBjaGVtaWNhbFwiICk7XG4gICAgICBjb25zdCBkZWZhdWx0UmVndWxhdG9yUHJvcGVydGllcyA9IGhhc1JlZ3VsYXRvciA/IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMocmVndWxhdG9yLnR5cGUpIDoge307XG4gICAgICBjb25zdCBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKFwiY2F0YWx5dGljXCIpO1xuICAgICAgY29uc3QgcHJvY2Vzc1dpZHRoID0gZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xuICAgICAgY29uc3QgcHJvY2Vzc0hlaWdodCA9IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XG4gICAgICBjb25zdCBzaW1wbGVDaGVtaWNhbEhlaWdodCA9IGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMuaGVpZ2h0IHx8IDM1O1xuICAgICAgY29uc3Qgc2ltcGxlQ2hlbWljYWxXaWR0aCA9IGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMud2lkdGggfHwgMzU7XG4gICAgICBjb25zdCByZWd1bGF0b3JIZWlnaHQgPSBkZWZhdWx0UmVndWxhdG9yUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XG4gICAgICBjb25zdCBwcm9jZXNzUG9zaXRpb24gPSBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcbiAgICAgIGNvbnN0IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA9IDE1O1xuICAgICAgY29uc3QgdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPSAxNTtcbiAgICAgIGNvbnN0IGVkZ2VMZW5ndGggPSAzMDtcbiAgICAgIGNvbnN0IHByb2Nlc3NMZWZ0U2lkZUVkZ2VUeXBlID0gcmV2ZXJzaWJsZSA/IFwicHJvZHVjdGlvblwiIDogXCJjb25zdW1wdGlvblwiO1xuICAgICAgY29uc3QgcHJvY2Vzc1JpZ2h0U2lkZUVkZ2VUeXBlID0gXCJwcm9kdWN0aW9uXCI7XG4gICAgICBjb25zdCBwcm9jZXNzUG9ydHNPcmRlcmluZyA9IG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIgPyBcIlQtdG8tQlwiIDogXCJMLXRvLVJcIjtcblxuICAgICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJQRFwiKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHhQb3NPZklucHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIHNpbXBsZUNoZW1pY2FsV2lkdGggLyAyO1xuICAgICAgbGV0IHhQb3NPZk91dHB1dCA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBzaW1wbGVDaGVtaWNhbFdpZHRoIC8gMjtcblxuXG4gICAgICBsZXQgcHJvY2Vzc05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB7Y2xhc3M6IFwicHJvY2Vzc1wiLCBsYW5ndWFnZTogXCJQRFwifSk7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2Vzc05vZGUsIHByb2Nlc3NQb3J0c09yZGVyaW5nKTtcbiAgICAgIHByb2Nlc3NOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICBjb25zdCBudW1PZklucHV0Tm9kZXMgPSBpbnB1dHMubGVuZ3RoO1xuICAgICAgY29uc3QgbnVtT2ZPdXRwdXROb2RlcyA9IG91dHB1dHMubGVuZ3RoO1xuXG4gICAgICBsZXQgeVBvc09mSW5wdXQgPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZJbnB1dE5vZGVzIC0gMSkgLyAyKSAqIChzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XG5cbiAgICAgIGlucHV0cy5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEsIGluZGV4KSB7XG4gICAgICAgIGNvbnN0IG5vZGVOYW1lID0gZGF0YS5uYW1lO1xuICAgICAgICBjb25zdCBub2RlVHlwZSA9IGRhdGEudHlwZTtcblxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICB5UG9zT2ZJbnB1dCA9IHByb2Nlc3NQb3NpdGlvbi55O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGluZGV4ICUgMiA9PT0gMSkge1xuICAgICAgICAgIHlQb3NPZklucHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKHNpbXBsZUNoZW1pY2FsSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKSAqIE1hdGguY2VpbChpbmRleCAvIDIpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB5UG9zT2ZJbnB1dCA9IHByb2Nlc3NQb3NpdGlvbi55ICsgKChzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCkgKiAoaW5kZXggLyAyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbm9kZVBvc2l0aW9uID0ge1xuICAgICAgICAgIHg6IHhQb3NPZklucHV0LFxuICAgICAgICAgIHk6IHlQb3NPZklucHV0XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgICAgICBub2RlUG9zaXRpb24gPSByb3RhdGU5MChub2RlUG9zaXRpb24sIHByb2Nlc3NQb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShub2RlUG9zaXRpb24ueCwgbm9kZVBvc2l0aW9uLnksIHtjbGFzczogbm9kZVR5cGUudG9Mb3dlckNhc2UoKSwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgICBuZXdOb2RlLmRhdGEoXCJqdXN0QWRkZWRcIiwgdHJ1ZSk7XG4gICAgICAgIG5ld05vZGUuZGF0YShcImxhYmVsXCIsIG5vZGVOYW1lKTtcblxuICAgICAgICBsZXQgbmV3RWRnZTtcbiAgICAgICAgaWYgKHJldmVyc2libGUpIHtcbiAgICAgICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3NOb2RlLmlkKCksIG5ld05vZGUuaWQoKSwge2NsYXNzOiBwcm9jZXNzTGVmdFNpZGVFZGdlVHlwZSwgbGFuZ3VhZ2U6IFwiUERcIn0sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG5ld05vZGUuaWQoKSwgcHJvY2Vzc05vZGUuaWQoKSwge2NsYXNzOiBwcm9jZXNzTGVmdFNpZGVFZGdlVHlwZSwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgICB9XG4gICAgICAgIG5ld0VkZ2UuZGF0YShcImp1c3RBZGRlZFwiLCB0cnVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgeVBvc09mT3V0cHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKG51bU9mT3V0cHV0Tm9kZXMgLSAxKSAvIDIpICogKHNpbXBsZUNoZW1pY2FsSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKTtcblxuICAgICAgb3V0cHV0cy5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEsIGluZGV4KSB7XG4gICAgICAgIGNvbnN0IG5vZGVOYW1lID0gZGF0YS5uYW1lO1xuICAgICAgICBjb25zdCBub2RlVHlwZSA9IGRhdGEudHlwZTtcblxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICB5UG9zT2ZPdXRwdXQgPSBwcm9jZXNzUG9zaXRpb24ueTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbmRleCAlIDIgPT09IDEpIHtcbiAgICAgICAgICB5UG9zT2ZPdXRwdXQgPSBwcm9jZXNzUG9zaXRpb24ueSAtICgoc2ltcGxlQ2hlbWljYWxIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpICogTWF0aC5jZWlsKGluZGV4IC8gMikpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHlQb3NPZk91dHB1dCA9IHByb2Nlc3NQb3NpdGlvbi55ICsgKChzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCkgKiAoaW5kZXggLyAyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbm9kZVBvc2l0aW9uID0ge1xuICAgICAgICAgIHg6IHhQb3NPZk91dHB1dCxcbiAgICAgICAgICB5OiB5UG9zT2ZPdXRwdXRcbiAgICAgICAgfVxuICAgICAgICBpZiAob3JpZW50YXRpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgICAgIG5vZGVQb3NpdGlvbiA9IHJvdGF0ZTkwKG5vZGVQb3NpdGlvbiwgcHJvY2Vzc1Bvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5vZGVQb3NpdGlvbi54LCBub2RlUG9zaXRpb24ueSwge2NsYXNzOiBub2RlVHlwZS50b0xvd2VyQ2FzZSgpLCBsYW5ndWFnZTogXCJQRFwifSk7XG4gICAgICAgIG5ld05vZGUuZGF0YShcImp1c3RBZGRlZFwiLCB0cnVlKTtcbiAgICAgICAgbmV3Tm9kZS5kYXRhKFwibGFiZWxcIiwgbm9kZU5hbWUpO1xuXG4gICAgICAgIGxldCBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3NOb2RlLmlkKCksIG5ld05vZGUuaWQoKSwge2NsYXNzOiBwcm9jZXNzUmlnaHRTaWRlRWRnZVR5cGUsIGxhbmd1YWdlOiBcIlBEXCJ9LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgMCk7XG4gICAgICAgIG5ld0VkZ2UuZGF0YShcImp1c3RBZGRlZFwiLCB0cnVlKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBhZGQgcmVndWxhdG9yIG5vZGVcbiAgICAgIGlmIChoYXNSZWd1bGF0b3IpIHtcbiAgICAgICAgY29uc3QgcmVndWxhdG9yTmFtZSA9IHJlZ3VsYXRvci5uYW1lO1xuICAgICAgICBjb25zdCByZWd1bGF0b3JUeXBlID0gcmVndWxhdG9yLnR5cGU7XG4gICAgICAgIGxldCB4UG9zT2ZSZWd1bGF0b3IgPSBwcm9jZXNzUG9zaXRpb24ueDtcbiAgICAgICAgbGV0IHlQb3NPZlJlZ3VsYXRvciA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKChwcm9jZXNzSGVpZ2h0IC8gMikgKyAocmVndWxhdG9ySGVpZ2h0IC8gMikgKyBlZGdlTGVuZ3RoKTsgXG5cbiAgICAgICAgbGV0IG5vZGVQb3NpdGlvbiA9IHtcbiAgICAgICAgICB4OiB4UG9zT2ZSZWd1bGF0b3IsXG4gICAgICAgICAgeTogeVBvc09mUmVndWxhdG9yXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgICAgICBub2RlUG9zaXRpb24gPSByb3RhdGU5MChub2RlUG9zaXRpb24sIHByb2Nlc3NQb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVndWxhdG9yTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShub2RlUG9zaXRpb24ueCwgbm9kZVBvc2l0aW9uLnksIHtjbGFzczogcmVndWxhdG9yVHlwZSwgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgICAgcmVndWxhdG9yTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgICAgcmVndWxhdG9yTm9kZS5kYXRhKCdsYWJlbCcsIHJlZ3VsYXRvck5hbWUpO1xuXG4gICAgICAgIGlmIChyZWd1bGF0b3JNdWx0aW1lci5lbmFibGVkKSB7XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhyZWd1bGF0b3JOb2RlLCB0cnVlKTtcblxuICAgICAgICAgIGNvbnN0IGNhcmRpbmFsaXR5ID0gcmVndWxhdG9yTXVsdGltZXIuY2FyZGluYWxpdHk7XG4gICAgICAgICAgY29uc3QgaW5mb2JveExhYmVsID0gXCJOOlwiICsgY2FyZGluYWxpdHk7XG4gICAgICAgICAgaW5mb2JveE9iamVjdCA9IHtcbiAgICAgICAgICAgIGNsYXp6OiBcInVuaXQgb2YgaW5mb3JtYXRpb25cIixcbiAgICAgICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgICAgIHRleHQ6IGluZm9ib3hMYWJlbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJib3g6IHtcbiAgICAgICAgICAgICAgdzogaW5mb2JveExhYmVsLmxlbmd0aCAqIDYsXG4gICAgICAgICAgICAgIGg6IDE1XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgXCJzaGFwZS1uYW1lXCI6IFwiZWxsaXBzZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoY2FyZGluYWxpdHkgIT0gJycpIHtcbiAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gocmVndWxhdG9yTm9kZSwgaW5mb2JveE9iamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlZ3VsYXRvckVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocmVndWxhdG9yTm9kZS5pZCgpLCBwcm9jZXNzTm9kZS5pZCgpLCB7Y2xhc3M6ICdjYXRhbHlzaXMnLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgICByZWd1bGF0b3JFZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBjeS5lbmRCYXRjaCgpO1xuXG4gICAgICBjb25zdCBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XG4gICAgICBlbGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZCcpO1xuXG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICBlbGVzLnNlbGVjdCgpO1xuXG4gICAgICByZXR1cm4gZWxlcztcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVNZXRhYm9saWNDYXRhbHl0aWNBY3Rpdml0eSA9IGZ1bmN0aW9uKGlucHV0Tm9kZUxpc3QsIG91dHB1dE5vZGVMaXN0LCBjYXRhbHlzdE5hbWUsIGNhdGFseXN0VHlwZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XG4gICAgICB2YXIgZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBcIm1hY3JvbW9sZWN1bGVcIiApO1xuICAgICAgdmFyIGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBcInNpbXBsZSBjaGVtaWNhbFwiICk7XG4gICAgICB2YXIgZGVmYXVsdENhdGFseXN0VHlwZVByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKGNhdGFseXN0VHlwZSk7XG4gICAgICB2YXIgZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhcImNhdGFseXRpY1wiKTtcbiAgICAgIHZhciBwcm9jZXNzV2lkdGggPSBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICB2YXIgcHJvY2Vzc0hlaWdodCA9IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XG4gICAgICB2YXIgc2ltcGxlQ2hlbWljYWxIZWlnaHQgPSBkZWZhdWx0U2ltcGxlQ2hlbWljYWxQcm9wZXJ0aWVzLmhlaWdodCB8fCAzNTtcbiAgICAgIHZhciBtYWNyb21vbGVjdWxlV2lkdGggPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcy53aWR0aCB8fCA1MDtcbiAgICAgIHZhciBtYWNyb21vbGVjdWxlSGVpZ2h0ID0gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMuaGVpZ2h0IHx8IDUwO1xuICAgICAgdmFyIGNhdGFseXN0SGVpZ2h0ID0gZGVmYXVsdENhdGFseXN0VHlwZVByb3BlcnRpZXMuaGVpZ2h0IHx8IDUwO1xuICAgICAgdmFyIHByb2Nlc3NQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbiB8fCBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcbiAgICAgIHZhciB0aWxpbmdQYWRkaW5nVmVydGljYWwgPSB0aWxpbmdQYWRkaW5nVmVydGljYWwgfHwgMTU7XG4gICAgICB2YXIgdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPSB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCB8fCAxNTtcbiAgICAgIHZhciBlZGdlTGVuZ3RoID0gZWRnZUxlbmd0aCB8fCA2MDtcblxuICAgICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJQRFwiKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHhQb3NPZklucHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gICAgICB2YXIgeFBvc09mT3V0cHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG5cbiAgICAgIHZhciBwcm9jZXNzTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHtjbGFzczogXCJwcm9jZXNzXCIsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzTm9kZSwgXCJMLXRvLVJcIik7XG4gICAgICBwcm9jZXNzTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgY29uc3QgbnVtT2ZJbnB1dE5vZGVzID0gaW5wdXROb2RlTGlzdC5sZW5ndGg7XG4gICAgICBjb25zdCBudW1PZk91dHB1dE5vZGVzID0gb3V0cHV0Tm9kZUxpc3QubGVuZ3RoO1xuICAgICAgdmFyIHlQb3NPZklucHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKG51bU9mSW5wdXROb2RlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XG5cbiAgICAgIC8vIGFkZCBpbnB1dCBzaWRlIG5vZGVzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mSW5wdXROb2RlczsgaSsrKSB7XG4gICAgICAgIGlmKGlucHV0Tm9kZUxpc3RbaV0udHlwZSA9PSBcIlNpbXBsZSBDaGVtaWNhbFwiKXtcbiAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zT2ZJbnB1dCwgeVBvc09mSW5wdXQsIHtjbGFzcyA6ICdzaW1wbGUgY2hlbWljYWwnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgICB5UG9zT2ZJbnB1dCArPSBzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZklucHV0LCB5UG9zT2ZJbnB1dCwge2NsYXNzIDogJ21hY3JvbW9sZWN1bGUnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgICAvL3VwZGF0ZSB0aGUgeSBwb3NpdGlvblxuICAgICAgICAgIHlQb3NPZklucHV0ICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gICAgICAgIH1cbiAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIGlucHV0Tm9kZUxpc3RbaV0ubmFtZSk7XG5cbiAgICAgICAgdmFyIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3Tm9kZS5pZCgpLCBwcm9jZXNzTm9kZS5pZCgpLCB7Y2xhc3MgOiAnY29uc3VtcHRpb24nLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgbmV3RWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdmFyIHlQb3NPZk91dHB1dCA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKChudW1PZk91dHB1dE5vZGVzIC0gMSkgLyAyKSAqIChtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKTtcblxuICAgICAgLy8gYWRkIG91dHB1dCBzaWRlIG5vZGVzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mT3V0cHV0Tm9kZXM7IGkrKykge1xuICAgICAgICBpZihvdXRwdXROb2RlTGlzdFtpXS50eXBlID09IFwiU2ltcGxlIENoZW1pY2FsXCIpe1xuICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZk91dHB1dCwgeVBvc09mT3V0cHV0LCB7Y2xhc3MgOiAnc2ltcGxlIGNoZW1pY2FsJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgICAgeVBvc09mT3V0cHV0ICs9IHNpbXBsZUNoZW1pY2FsSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc09mT3V0cHV0LCB5UG9zT2ZPdXRwdXQsIHtjbGFzcyA6ICdtYWNyb21vbGVjdWxlJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgICAgLy91cGRhdGUgdGhlIHkgcG9zaXRpb25cbiAgICAgICAgICB5UG9zT2ZPdXRwdXQgKz0gbWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcbiAgICAgICAgfVxuICAgICAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgb3V0cHV0Tm9kZUxpc3RbaV0ubmFtZSk7XG5cbiAgICAgICAgdmFyIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzc05vZGUuaWQoKSwgbmV3Tm9kZS5pZCgpLCB7Y2xhc3MgOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICBuZXdFZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBhZGQgY2F0YWx5c3Qgbm9kZVxuICAgICAgdmFyIHhQb3NPZkNhdGFseXN0ID0gcHJvY2Vzc1Bvc2l0aW9uLng7XG4gICAgICB2YXIgeVBvc09mQ2F0YWx5c3QgPSBwcm9jZXNzUG9zaXRpb24ueSAtIChwcm9jZXNzSGVpZ2h0ICsgY2F0YWx5c3RIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpOyBcbiAgICAgIHZhciBjYXRhbHlzdE5vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc09mQ2F0YWx5c3QsIHlQb3NPZkNhdGFseXN0LCB7Y2xhc3M6IGNhdGFseXN0VHlwZSwgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIGNhdGFseXN0Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgIGNhdGFseXN0Tm9kZS5kYXRhKCdsYWJlbCcsIGNhdGFseXN0TmFtZSk7XG5cbiAgICAgIHZhciBjYXRhbHlzdEVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UoY2F0YWx5c3ROb2RlLmlkKCksIHByb2Nlc3NOb2RlLmlkKCksIHtjbGFzczogJ2NhdGFseXNpcycsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBjYXRhbHlzdEVkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIGN5LmVuZEJhdGNoKCk7XG5cbiAgICAgIC8vZmlsdGVyIHRoZSBqdXN0IGFkZGVkIGVsZW1lbXRzIHRvIHJldHVybiB0aGVtIGFuZCByZW1vdmUganVzdCBhZGRlZCBtYXJrXG4gICAgICB2YXIgZWxlcyA9IGN5LmVsZW1lbnRzKCdbanVzdEFkZGVkXScpO1xuICAgICAgZWxlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWQnKTtcblxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgZWxlcy5zZWxlY3QoKTtcblxuICAgICAgcmV0dXJuIGVsZXM7IC8vIFJldHVybiB0aGUganVzdCBhZGRlZCBlbGVtZW50c1xuICAgIH1cblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQWN0aXZhdGlvblJlYWN0aW9uID0gZnVuY3Rpb24gKHByb3RlaW5OYW1lLCBwcm9jZXNzUG9zaXRpb24sIGVkZ2VMZW5ndGgsIHJldmVyc2UpIHtcbiAgICAgIHZhciBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIFwibWFjcm9tb2xlY3VsZVwiICk7XG4gICAgICB2YXIgZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhcImFjdGl2YXRpb25cIik7XG4gICAgICB2YXIgcHJvY2Vzc1dpZHRoID0gZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xuICAgICAgdmFyIG1hY3JvbW9sZWN1bGVXaWR0aCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xuICAgICAgdmFyIHByb2Nlc3NQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbiB8fCBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcbiAgICAgIHZhciBlZGdlTGVuZ3RoID0gZWRnZUxlbmd0aCB8fCA2MDtcblxuICAgICAgY3kuc3RhcnRCYXRjaCgpO1xuICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJQRFwiKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHhQb3NPZklucHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gICAgICB2YXIgeFBvc09mT3V0cHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG5cbiAgICAgIHZhciBwcm9jZXNzTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHtjbGFzczogXCJwcm9jZXNzXCIsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzTm9kZSwgXCJMLXRvLVJcIik7XG4gICAgICBwcm9jZXNzTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgdmFyIHlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55O1xuXG4gICAgICB2YXIgaW5wdXROb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZklucHV0LCB5UG9zaXRpb24sIHtjbGFzczogXCJtYWNyb21vbGVjdWxlXCIsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgIGlucHV0Tm9kZS5kYXRhKFwianVzdEFkZGVkXCIsIHRydWUpO1xuICAgICAgaW5wdXROb2RlLmRhdGEoXCJsYWJlbFwiLCBwcm90ZWluTmFtZSk7XG4gICAgICB2YXIgaW5mb2JveE9iamVjdCA9IHtcbiAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiLFxuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgIHRleHQ6IHJldmVyc2UgPyBcImFjdGl2ZVwiIDogXCJpbmFjdGl2ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgXCJzaGFwZS1uYW1lXCI6IFwiZWxsaXBzZVwiXG4gICAgICAgIH0sXG4gICAgICAgIGJib3g6IHtcbiAgICAgICAgICB3OiAzNixcbiAgICAgICAgICBoOiAxNVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChpbnB1dE5vZGUsIGluZm9ib3hPYmplY3QpO1xuXG4gICAgICB2YXIgb3V0cHV0Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zT2ZPdXRwdXQsIHlQb3NpdGlvbiwge2NsYXNzOiBcIm1hY3JvbW9sZWN1bGVcIiwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgb3V0cHV0Tm9kZS5kYXRhKFwianVzdEFkZGVkXCIsIHRydWUpO1xuICAgICAgb3V0cHV0Tm9kZS5kYXRhKFwibGFiZWxcIiwgcHJvdGVpbk5hbWUpO1xuICAgICAgaW5mb2JveE9iamVjdCA9IHtcbiAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiLFxuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgIHRleHQ6IHJldmVyc2UgPyBcImluYWN0aXZlXCIgOiBcImFjdGl2ZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgXCJzaGFwZS1uYW1lXCI6IFwiZWxsaXBzZVwiXG4gICAgICAgIH0sXG4gICAgICAgIGJib3g6IHtcbiAgICAgICAgICB3OiAzNixcbiAgICAgICAgICBoOiAxNVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG91dHB1dE5vZGUsIGluZm9ib3hPYmplY3QpO1xuXG4gICAgICB2YXIgaW5wdXRTaWRlRWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShpbnB1dE5vZGUuaWQoKSwgcHJvY2Vzc05vZGUuaWQoKSwge2NsYXNzOiBcImNvbnN1bXB0aW9uXCIsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgIGlucHV0U2lkZUVkZ2UuZGF0YShcImp1c3RBZGRlZFwiLCB0cnVlKTtcbiAgICAgIHZhciBvdXRwdXRTaWRlRWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzTm9kZS5pZCgpLCBvdXRwdXROb2RlLmlkKCksIHtjbGFzczogXCJwcm9kdWN0aW9uXCIsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgIG91dHB1dFNpZGVFZGdlLmRhdGEoXCJqdXN0QWRkZWRcIiwgdHJ1ZSk7XG4gICAgICBjeS5lbmRCYXRjaCgpO1xuXG4gICAgICAvL2ZpbHRlciB0aGUganVzdCBhZGRlZCBlbGVtZW10cyB0byByZXR1cm4gdGhlbSBhbmQgcmVtb3ZlIGp1c3QgYWRkZWQgbWFya1xuICAgICAgdmFyIGVsZXMgPSBjeS5lbGVtZW50cygnW2p1c3RBZGRlZF0nKTtcbiAgICAgIGVsZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkJyk7XG5cbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICAgIGVsZXMuc2VsZWN0KCk7XG5cbiAgICAgIHJldHVybiBlbGVzOyAvLyBSZXR1cm4gdGhlIGp1c3QgYWRkZWQgZWxlbWVudHNcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxuICAgICAqIGluIHRoZSBjb21wbGV4LiBQYXJhbWV0ZXJzIGFyZSBleHBsYWluZWQgYmVsb3cuXG4gICAgICogdGVtcGxhdGVUeXBlOiBUaGUgdHlwZSBvZiB0aGUgdGVtcGxhdGUgcmVhY3Rpb24uIEl0IG1heSBiZSAnYXNzb2NpYXRpb24nLCAnZGlzc29jaWF0aW9uJywgJ3JldmVyc2libGUnIG9yICdpcnJldmVyc2libGUnLlxuICAgICAqIG5vZGVMaXN0OiBUaGUgbGlzdCBvZiB0aGUgbmFtZXMgYW5kIHR5cGVzIG9mIG1vbGVjdWxlcyB3aGljaCB3aWxsIGludm9sdmUgaW4gdGhlIHJlYWN0aW9uLlxuICAgICAqIGNvbXBsZXhOYW1lOiBUaGUgbmFtZSBvZiB0aGUgY29tcGxleCBpbiB0aGUgcmVhY3Rpb24uXG4gICAgICogcHJvY2Vzc1Bvc2l0aW9uOiBUaGUgbW9kYWwgcG9zaXRpb24gb2YgdGhlIHByb2Nlc3MgaW4gdGhlIHJlYWN0aW9uLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyB0aGUgY2VudGVyIG9mIHRoZSBjYW52YXMuXG4gICAgICogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxuICAgICAqIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxuICAgICAqIGVkZ2VMZW5ndGg6IFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBwcm9jZXNzIGFuZCB0aGUgbWFjcm9tb2xlY3VsZXMgYXQgdGhlIGJvdGggc2lkZXMuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHRlbXBsYXRlVHlwZSwgbm9kZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgsIGxheW91dFBhcmFtKSB7XG5cbiAgICAgIHZhciBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIFwibWFjcm9tb2xlY3VsZVwiICk7XG4gICAgICB2YXIgZGVmYXVsdFNpbXBsZUNoZW1pY2FsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIFwic2ltcGxlIGNoZW1pY2FsXCIgKTtcbiAgICAgIHZhciBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCB0ZW1wbGF0ZVR5cGUgKTtcbiAgICAgIHZhciBwcm9jZXNzV2lkdGggPSBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICB2YXIgbWFjcm9tb2xlY3VsZVdpZHRoID0gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICB2YXIgbWFjcm9tb2xlY3VsZUhlaWdodCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLmhlaWdodCB8fCA1MDtcbiAgICAgIHZhciBzaW1wbGVDaGVtaWNhbFdpZHRoID0gZGVmYXVsdFNpbXBsZUNoZW1pY2FsUHJvcGVydGllcy53aWR0aCB8fCAzNTtcbiAgICAgIHZhciBzaW1wbGVDaGVtaWNhbEhlaWdodCA9IGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMuaGVpZ2h0IHx8IDM1O1xuICAgICAgdmFyIHByb2Nlc3NQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbiB8fCBlbGVtZW50VXRpbGl0aWVzLmNvbnZlcnRUb01vZGVsUG9zaXRpb24oe3g6IGN5LndpZHRoKCkgLyAyLCB5OiBjeS5oZWlnaHQoKSAvIDJ9KTtcbiAgICAgIHZhciBub2RlTGlzdCA9IG5vZGVMaXN0O1xuICAgICAgdmFyIGNvbXBsZXhOYW1lID0gY29tcGxleE5hbWU7XG4gICAgICB2YXIgbnVtT2ZNb2xlY3VsZXMgPSBub2RlTGlzdC5sZW5ndGg7XG4gICAgICB2YXIgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsID0gdGlsaW5nUGFkZGluZ1ZlcnRpY2FsIHx8IDE1O1xuICAgICAgdmFyIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgfHwgMTU7XG4gICAgICB2YXIgZWRnZUxlbmd0aCA9IGVkZ2VMZW5ndGggfHwgNjA7XG5cbiAgICAgIGN5LnN0YXJ0QmF0Y2goKTtcblxuICAgICAgXG4gICAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShcIlBEXCIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXM7XG4gICAgICB2YXIgeFBvc2l0aW9uT2ZJbnB1dE1hY3JvbW9sZWN1bGVzO1xuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICAgICAgIFxuICAgICAgfVxuICAgICAgZWxzZSBpZih0ZW1wbGF0ZVR5cGUgPT09ICdkaXNzb2NpYXRpb24nKXtcbiAgICAgICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgICAgICBcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIFxuICAgICAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICAgICAgICB4UG9zaXRpb25PZklucHV0TWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgICAgIH1cblxuICAgICAgLy9DcmVhdGUgdGhlIHByb2Nlc3MgaW4gdGVtcGxhdGUgdHlwZVxuICAgICAgdmFyIHByb2Nlc3M7XG4gICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAncmV2ZXJzaWJsZScgfHwgdGVtcGxhdGVUeXBlID09PSAnaXJyZXZlcnNpYmxlJykge1xuICAgICAgICBwcm9jZXNzID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwge2NsYXNzIDogJ3Byb2Nlc3MnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdMLXRvLVInKTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB7Y2xhc3MgOiB0ZW1wbGF0ZVR5cGUsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ0wtdG8tUicpO1xuICAgICAgfVxuICAgICAgcHJvY2Vzcy5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgLy9EZWZpbmUgdGhlIHN0YXJ0aW5nIHkgcG9zaXRpb25cbiAgICAgIHZhciB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZNb2xlY3VsZXMgLSAxKSAvIDIpICogKG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpO1xuXG4gICAgICAvL0NyZWF0ZSB0aGUgZnJlZSBtb2xlY3VsZXNcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZNb2xlY3VsZXM7IGkrKykge1xuICAgICAgICAvLyBub2RlIGFkZGl0aW9uIG9wZXJhdGlvbiBpcyBkZXRlcm1pbmVkIGJ5IG1vbGVjdWxlIHR5cGVcbiAgICAgICAgaWYobm9kZUxpc3RbaV0udHlwZSA9PSBcIlNpbXBsZSBDaGVtaWNhbFwiKXtcbiAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcywgeVBvc2l0aW9uLCB7Y2xhc3MgOiAnc2ltcGxlIGNoZW1pY2FsJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgICAgLy91cGRhdGUgdGhlIHkgcG9zaXRpb25cbiAgICAgICAgICB5UG9zaXRpb24gKz0gc2ltcGxlQ2hlbWljYWxIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcywgeVBvc2l0aW9uLCB7Y2xhc3MgOiAnbWFjcm9tb2xlY3VsZScsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICAgIC8vdXBkYXRlIHRoZSB5IHBvc2l0aW9uXG4gICAgICAgICAgeVBvc2l0aW9uICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gICAgICAgIH1cbiAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIG5vZGVMaXN0W2ldLm5hbWUpO1xuXG4gICAgICAgIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5lY3RlZCB0byB0aGUgbmV3IG1vbGVjdWxlXG4gICAgICAgIHZhciBuZXdFZGdlO1xuICAgICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdOb2RlLmlkKCksIHByb2Nlc3MuaWQoKSwge2NsYXNzIDogJ2NvbnN1bXB0aW9uJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZih0ZW1wbGF0ZVR5cGUgPT09ICdkaXNzb2NpYXRpb24nKXtcbiAgICAgICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgbmV3Tm9kZS5pZCgpLCB7Y2xhc3MgOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgLy9Hcm91cCByaWdodCBvciB0b3AgZWxlbWVudHMgaW4gZ3JvdXAgaWQgMVxuICAgICAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09IFwiaXJyZXZlcnNpYmxlXCIpIHtcbiAgICAgICAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3Tm9kZS5pZCgpLCBwcm9jZXNzLmlkKCksIHtjbGFzczogXCJjb25zdW1wdGlvblwiLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBuZXdOb2RlLmlkKCksIHtjbGFzcyA6IFwicHJvZHVjdGlvblwiLCBsYW5ndWFnZSA6ICdQRCd9LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbmV3RWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgaWYodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nIHx8IHRlbXBsYXRlVHlwZSA9PSAnZGlzc29jaWF0aW9uJyl7XG4gICAgICAgIC8vQ3JlYXRlIHRoZSBjb21wbGV4IGluY2x1ZGluZyBtYWNyb21vbGVjdWxlcyBpbnNpZGUgb2YgaXRcbiAgICAgICAgLy9UZW1wcm9yYXJpbHkgYWRkIGl0IHRvIHRoZSBwcm9jZXNzIHBvc2l0aW9uIHdlIHdpbGwgbW92ZSBpdCBhY2NvcmRpbmcgdG8gdGhlIGxhc3Qgc2l6ZSBvZiBpdFxuICAgICAgICB2YXIgY29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHtjbGFzcyA6ICdjb21wbGV4JywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgIGNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICAgIGNvbXBsZXguZGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScsIHRydWUpO1xuXG4gICAgICAgIC8vSWYgYSBuYW1lIGlzIHNwZWNpZmllZCBmb3IgdGhlIGNvbXBsZXggc2V0IGl0cyBsYWJlbCBhY2NvcmRpbmdseVxuICAgICAgICBpZiAoY29tcGxleE5hbWUpIHtcbiAgICAgICAgICBjb21wbGV4LmRhdGEoJ2xhYmVsJywgY29tcGxleE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubm5lY3RlZCB0byB0aGUgY29tcGxleFxuICAgICAgICB2YXIgZWRnZU9mQ29tcGxleDtcblxuICAgICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgICAgICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIGNvbXBsZXguaWQoKSwge2NsYXNzIDogJ3Byb2R1Y3Rpb24nLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBlZGdlT2ZDb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKGNvbXBsZXguaWQoKSwgcHJvY2Vzcy5pZCgpLCB7Y2xhc3MgOiAnY29uc3VtcHRpb24nLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVkZ2VPZkNvbXBsZXguZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1vbGVjdWxlczsgaSsrKSB7XG5cbiAgICAgICAgICAvLyBBZGQgYSBtb2xlY3VsZShkZXBlbmRlbnQgb24gaXQncyB0eXBlKSBub3QgaGF2aW5nIGEgcHJldmlvdXNseSBkZWZpbmVkIGlkIGFuZCBoYXZpbmcgdGhlIGNvbXBsZXggY3JlYXRlZCBpbiB0aGlzIHJlYWN0aW9uIGFzIHBhcmVudFxuICAgICAgICAgIGlmKG5vZGVMaXN0W2ldLnR5cGUgPT0gJ1NpbXBsZSBDaGVtaWNhbCcpe1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoY29tcGxleC5wb3NpdGlvbigneCcpLCBjb21wbGV4LnBvc2l0aW9uKCd5JyksIHtjbGFzcyA6ICdzaW1wbGUgY2hlbWljYWwnLCBsYW5ndWFnZSA6ICdQRCd9LCB1bmRlZmluZWQsIGNvbXBsZXguaWQoKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShjb21wbGV4LnBvc2l0aW9uKCd4JyksIGNvbXBsZXgucG9zaXRpb24oJ3knKSwge2NsYXNzIDogJ21hY3JvbW9sZWN1bGUnLCBsYW5ndWFnZSA6ICdQRCd9LCB1bmRlZmluZWQsIGNvbXBsZXguaWQoKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgICAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbm9kZUxpc3RbaV0ubmFtZSk7XG4gICAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2V7XG5cbiAgICAgICAgLy9DcmVhdGUgdGhlIGlucHV0IG1hY3JvbW9sZWN1bGVzXG4gICAgICAgIHZhciBudW1PZklucHV0TWFjcm9tb2xlY3VsZXMgPSBjb21wbGV4TmFtZS5sZW5ndGg7XG4gICAgICAgIHlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKChudW1PZklucHV0TWFjcm9tb2xlY3VsZXMgLSAxKSAvIDIpICogKG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZJbnB1dE1hY3JvbW9sZWN1bGVzOyBpKyspIHtcblxuICAgICAgICAgIGlmKGNvbXBsZXhOYW1lW2ldLnR5cGUgPT0gJ1NpbXBsZSBDaGVtaWNhbCcpe1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc2l0aW9uT2ZJbnB1dE1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIHtjbGFzcyA6ICdzaW1wbGUgY2hlbWljYWwnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgICAgIHlQb3NpdGlvbiArPSBzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NpdGlvbk9mSW5wdXRNYWNyb21vbGVjdWxlcywgeVBvc2l0aW9uLCB7Y2xhc3MgOiAnbWFjcm9tb2xlY3VsZScsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICAgICAgeVBvc2l0aW9uICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgICAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgY29tcGxleE5hbWVbaV0ubmFtZSk7XG5cbiAgICAgICAgICAvL2NyZWF0ZSB0aGUgZWRnZSBjb25uZWN0ZWQgdG8gdGhlIG5ldyBtYWNyb21vbGVjdWxlXG4gICAgICAgICAgdmFyIG5ld0VkZ2U7XG5cbiAgICAgICAgICAvL0dyb3VwIHRoZSBsZWZ0IG9yIGJvdHRvbSBlbGVtZW50cyBpbiBncm91cCBpZCAwIGlmIHJldmVyc2libGVcbiAgICAgICAgICBpZiAodGVtcGxhdGVUeXBlID09PSBcImlycmV2ZXJzaWJsZVwiKSB7XG4gICAgICAgICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgbmV3Tm9kZS5pZCgpLCB7Y2xhc3M6IFwicHJvZHVjdGlvblwiLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBuZXdOb2RlLmlkKCksIHtjbGFzcyA6IFwicHJvZHVjdGlvblwiLCBsYW5ndWFnZSA6ICdQRCd9LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgMCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5ld0VkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjeS5lbmRCYXRjaCgpO1xuXG4gICAgICB2YXIgbGF5b3V0Tm9kZXMgPSBjeS5ub2RlcygnW2p1c3RBZGRlZExheW91dE5vZGVdJyk7XG4gICAgICBsYXlvdXROb2Rlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJyk7XG4gICAgICB2YXIgbGF5b3V0ID0gbGF5b3V0Tm9kZXMubGF5b3V0KHtcbiAgICAgICAgbmFtZTogbGF5b3V0UGFyYW0ubmFtZSxcbiAgICAgICAgcmFuZG9taXplOiBmYWxzZSxcbiAgICAgICAgZml0OiBmYWxzZSxcbiAgICAgICAgYW5pbWF0ZTogZmFsc2UsXG4gICAgICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLFxuICAgICAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXG4gICAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvL0lmIGl0IGlzIGEgcmV2ZXJzaWJsZSByZWFjdGlvbiBubyBuZWVkIHRvIHJlLXBvc2l0aW9uIGNvbXBsZXhlc1xuICAgICAgICAgIGlmKHRlbXBsYXRlVHlwZSA9PT0gJ3JldmVyc2libGUnKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIC8vcmUtcG9zaXRpb24gdGhlIG5vZGVzIGluc2lkZSB0aGUgY29tcGxleFxuICAgICAgICAgIHZhciBzdXBwb3NlZFhQb3NpdGlvbjtcbiAgICAgICAgICB2YXIgc3VwcG9zZWRZUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueTtcblxuICAgICAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHBvc2l0aW9uRGlmZlggPSAoc3VwcG9zZWRYUG9zaXRpb24gLSBjb21wbGV4LnBvc2l0aW9uKCd4JykpIC8gMjtcbiAgICAgICAgICB2YXIgcG9zaXRpb25EaWZmWSA9IChzdXBwb3NlZFlQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3knKSkgLyAyO1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NpdGlvbkRpZmZYLCB5OiBwb3NpdGlvbkRpZmZZfSwgY29tcGxleCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBEbyB0aGlzIGNoZWNrIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuICYmIHRlbXBsYXRlVHlwZSAhPT0gJ3JldmVyc2libGUnICYmIHRlbXBsYXRlVHlwZSAhPT0gJ2lycmV2ZXJzaWJsZScpIHtcbiAgICAgICAgbGF5b3V0LnJ1bigpO1xuICAgICAgfVxuXG4gICAgICAvL2ZpbHRlciB0aGUganVzdCBhZGRlZCBlbGVtZW10cyB0byByZXR1cm4gdGhlbSBhbmQgcmVtb3ZlIGp1c3QgYWRkZWQgbWFya1xuICAgICAgdmFyIGVsZXMgPSBjeS5lbGVtZW50cygnW2p1c3RBZGRlZF0nKTtcbiAgICAgIGVsZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkJyk7XG5cbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICAgIGVsZXMuc2VsZWN0KCk7XG5cbiAgICAgIHJldHVybiBlbGVzOyAvLyBSZXR1cm4gdGhlIGp1c3QgYWRkZWQgZWxlbWVudHNcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBNb3ZlIHRoZSBub2RlcyB0byBhIG5ldyBwYXJlbnQgYW5kIGNoYW5nZSB0aGVpciBwb3NpdGlvbiBpZiBwb3NzRGlmZiBwYXJhbXMgYXJlIHNldC5cbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudCA9IGZ1bmN0aW9uKG5vZGVzLCBuZXdQYXJlbnQsIHBvc0RpZmZYLCBwb3NEaWZmWSkge1xuICAgICAgdmFyIG5ld1BhcmVudElkID0gbmV3UGFyZW50ID09IHVuZGVmaW5lZCB8fCB0eXBlb2YgbmV3UGFyZW50ID09PSAnc3RyaW5nJyA/IG5ld1BhcmVudCA6IG5ld1BhcmVudC5pZCgpO1xuICAgICAgdmFyIG1vdmVkRWxlcyA9IG5vZGVzLm1vdmUoe1wicGFyZW50XCI6IG5ld1BhcmVudElkfSk7XG4gICAgICBpZih0eXBlb2YgcG9zRGlmZlggIT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHBvc0RpZmZZICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NEaWZmWCwgeTogcG9zRGlmZll9LCBub2Rlcyk7XG4gICAgICB9XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlcihtb3ZlZEVsZXMpO1xuICAgICAgcmV0dXJuIG1vdmVkRWxlcztcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVJbmZvYm94U3R5bGUgPSBmdW5jdGlvbiggbm9kZSwgaW5kZXgsIG5ld1Byb3BzICkge1xuICAgICAgdmFyIGluZm9ib3hPYmogPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJylbaW5kZXhdO1xuICAgICAgJC5leHRlbmQoIGluZm9ib3hPYmouc3R5bGUsIG5ld1Byb3BzICk7XG4gICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hPYmogPSBmdW5jdGlvbiggbm9kZSwgaW5kZXgsIG5ld1Byb3BzICkge1xuICAgICAgdmFyIGluZm9ib3hPYmogPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJylbaW5kZXhdO1xuICAgICAgJC5leHRlbmQoIGluZm9ib3hPYmosIG5ld1Byb3BzICk7XG4gICAgfTtcblxuICAgIC8vIFJlc2l6ZSBnaXZlbiBub2RlcyBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHkgb25lIG9mIHdpZHRoIG9yIGhlaWdodCBzaG91bGQgbm90IGJlIHNldC5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbywgcHJlc2VydmVSZWxhdGl2ZVBvcykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHZhciByYXRpbyA9IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGVsZU11c3RCZVNxdWFyZSA9IGVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSk7XG5cbiAgICAgICAgaWYgKHByZXNlcnZlUmVsYXRpdmVQb3MgPT09IHRydWUpIHtcbiAgICAgICAgICB2YXIgb2xkV2lkdGggPSBub2RlLmRhdGEoXCJiYm94XCIpLnc7XG4gICAgICAgICAgdmFyIG9sZEhlaWdodCA9IG5vZGUuZGF0YShcImJib3hcIikuaDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdGUgdGhhdCBib3RoIHdpZHRoIGFuZCBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5XG4gICAgICAgIGlmKCFub2RlLmlzUGFyZW50KCkpe1xuICAgICAgICAgIGlmICh3aWR0aCkge1xuICAgICAgICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xuICAgICAgICAgICAgICByYXRpbyA9IHdpZHRoIC8gbm9kZS53aWR0aCgpO1xuICAgICAgICAgICAgfVxuICBcbiAgICAgICAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IHdpZHRoO1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgaWYgKGhlaWdodCkge1xuICAgICAgICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xuICAgICAgICAgICAgICByYXRpbyA9IGhlaWdodCAvIG5vZGUuaGVpZ2h0KCk7XG4gICAgICAgICAgICB9XG4gIFxuICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gaGVpZ2h0O1xuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgaWYgKHJhdGlvICYmICFoZWlnaHQpIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IG5vZGUuaGVpZ2h0KCkgKiByYXRpbztcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAocmF0aW8gJiYgIXdpZHRoKSB7XG4gICAgICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSBub2RlLndpZHRoKCkgKiByYXRpbztcbiAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIG5vZGUuZGF0YShcIm1pbkhlaWdodFwiICwgXCJcIisgaGVpZ2h0KTtcbiAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aFwiICwgXCJcIisgd2lkdGgpO1xuICAgICAgICAgIG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc0xlZnRcIiwgXCI1MCVcIik7XG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluV2lkdGhCaWFzUmlnaHRcIiwgXCI1MCVcIik7XG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc1RvcFwiLCBcIjUwJVwiICk7XG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc0JvdHRvbVwiLCBcIjUwJVwiKTtcbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAvKiAgICBpZiAocHJlc2VydmVSZWxhdGl2ZVBvcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBzdGF0ZXNhbmRpbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcbiAgICAgICAgICB2YXIgdG9wQm90dG9tID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiAoYm94LmFuY2hvclNpZGUgPT09IFwidG9wXCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwiYm90dG9tXCIpKTtcbiAgICAgICAgICB2YXIgcmlnaHRMZWZ0ID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiAoYm94LmFuY2hvclNpZGUgPT09IFwicmlnaHRcIiB8fCBib3guYW5jaG9yU2lkZSA9PT0gXCJsZWZ0XCIpKTtcblxuICAgICAgICAgIHRvcEJvdHRvbS5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XG4gICAgICAgICAgICBpZiAoYm94LmJib3gueCA8IDApIHtcbiAgICAgICAgICAgICAgYm94LmJib3gueCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChib3guYmJveC54ID4gb2xkV2lkdGgpIHtcbiAgICAgICAgICAgICAgYm94LmJib3gueCA9IG9sZFdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYm94LmJib3gueCA9IG5vZGUuZGF0YShcImJib3hcIikudyAqIGJveC5iYm94LnggLyBvbGRXaWR0aDtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJpZ2h0TGVmdC5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XG4gICAgICAgICAgICBpZiAoYm94LmJib3gueSA8IDApIHtcbiAgICAgICAgICAgICAgYm94LmJib3gueSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChib3guYmJveC55ID4gb2xkSGVpZ2h0KSB7XG4gICAgICAgICAgICAgIGJveC5iYm94LnkgPSBvbGRIZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBib3guYmJveC55ID0gbm9kZS5kYXRhKFwiYmJveFwiKS5oICogYm94LmJib3gueSAvIG9sZEhlaWdodDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSAqL1xuICAgICAgfVxuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbldpZHRoID0gZnVuY3Rpb24obm9kZSkge1xuXG4gICAgICAgIHZhciBkZWZhdWx0V2lkdGggPSB0aGlzLmdldERlZmF1bHRQcm9wZXJ0aWVzKG5vZGUuZGF0YSgnY2xhc3MnKSkud2lkdGg7XG5cbiAgICAgICAgLy8gTGFiZWwgd2lkdGggY2FsY3VsYXRpb25cbiAgICAgICAgdmFyIHN0eWxlID0gbm9kZS5zdHlsZSgpO1xuXG4gICAgICAgIHZhciBmb250RmFtaWxpeSA9IHN0eWxlWydmb250LWZhbWlseSddO1xuICAgICAgICB2YXIgZm9udFNpemUgPSBzdHlsZVsnZm9udC1zaXplJ107XG4gICAgICAgIHZhciBsYWJlbFRleHQgPSBzdHlsZVsnbGFiZWwnXTtcblxuICAgICAgICB2YXIgbGFiZWxXaWR0aCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0V2lkdGhCeUNvbnRlbnQoIGxhYmVsVGV4dCwgZm9udEZhbWlsaXksIGZvbnRTaXplICk7XG5cbiAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgICAgICAvL1RvcCBhbmQgYm90dG9tIGluZm9Cb3hlc1xuICAgICAgICAvL3ZhciB0b3BJbmZvQm94ZXMgPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IChib3guYW5jaG9yU2lkZSA9PT0gXCJ0b3BcIiB8fCAoKGJveC5hbmNob3JTaWRlID09PSBcInJpZ2h0XCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwibGVmdFwiKSAmJiAoYm94LmJib3gueSA8PSAxMikpKSk7XG4gICAgICAgIC8vdmFyIGJvdHRvbUluZm9Cb3hlcyA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gKGJveC5hbmNob3JTaWRlID09PSBcImJvdHRvbVwiIHx8ICgoYm94LmFuY2hvclNpZGUgPT09IFwicmlnaHRcIiB8fCBib3guYW5jaG9yU2lkZSA9PT0gXCJsZWZ0XCIpICYmIChib3guYmJveC55ID49IG5vZGUuZGF0YSgnYmJveCcpLmggLSAxMikpKSk7XG4gICAgICAgIHZhciB1bml0R2FwID0gNTtcbiAgICAgICAgdmFyIHRvcElkZWFsV2lkdGggPSB1bml0R2FwO1xuICAgICAgICB2YXIgYm90dG9tSWRlYWxXaWR0aCA9IHVuaXRHYXA7ICAgICAgICBcbiAgICAgICAgdmFyIHJpZ2h0TWF4V2lkdGggPSAwO1xuICAgICAgICB2YXIgbGVmdE1heFdpZHRoID0wO1xuICAgICAgICBzdGF0ZXNhbmRpbmZvcy5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XG4gICAgICAgICAgaWYoYm94LmFuY2hvclNpZGUgPT09IFwidG9wXCIpe1xuICAgICAgICAgICAgdG9wSWRlYWxXaWR0aCArPSBib3guYmJveC53ICsgdW5pdEdhcDtcblxuICAgICAgICAgIH1lbHNlIGlmKGJveC5hbmNob3JTaWRlID09PSBcImJvdHRvbVwiKXtcbiAgICAgICAgICAgIGJvdHRvbUlkZWFsV2lkdGggKz0gYm94LmJib3gudyArIHVuaXRHYXA7XG5cbiAgICAgICAgICB9ZWxzZSBpZihib3guYW5jaG9yU2lkZSA9PT0gXCJyaWdodFwiKVxuICAgICAgICAgIHsgICAgICAgICAgIFxuICAgICAgICAgICAgcmlnaHRNYXhXaWR0aCA9IChib3guYmJveC53ID4gcmlnaHRNYXhXaWR0aCkgPyBib3guYmJveC53IDogcmlnaHRNYXhXaWR0aDtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGVmdE1heFdpZHRoID0gKGJveC5iYm94LncgPiBsZWZ0TWF4V2lkdGgpID8gYm94LmJib3gudyA6IGxlZnRNYXhXaWR0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pOyAgICAgIFxuXG4gICAgICAgIHZhciBtaWRkbGVXaWR0aCA9IGxhYmVsV2lkdGggKyAyICogTWF0aC5tYXgocmlnaHRNYXhXaWR0aC8yLCBsZWZ0TWF4V2lkdGgvMik7XG5cbiAgICAgICAgdmFyIGNvbXBvdW5kV2lkdGggPSAwO1xuICAgICAgICBpZihub2RlLmlzUGFyZW50KCkpe1xuICAgICAgICAgIGNvbXBvdW5kV2lkdGggPSBub2RlLmNoaWxkcmVuKCkuYm91bmRpbmdCb3goKS53O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLm1heChtaWRkbGVXaWR0aCwgZGVmYXVsdFdpZHRoLzIsIHRvcElkZWFsV2lkdGgsIGJvdHRvbUlkZWFsV2lkdGgsIGNvbXBvdW5kV2lkdGgpO1xuICAgIH1cblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluSGVpZ2h0ID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgICB2YXIgc3RhdGVzYW5kaW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgICAgIHZhciBtYXJnaW4gPSA3O1xuICAgICAgICB2YXIgdW5pdEdhcCA9IDU7XG4gICAgICAgIHZhciBkZWZhdWx0SGVpZ2h0ID0gdGhpcy5nZXREZWZhdWx0UHJvcGVydGllcyhub2RlLmRhdGEoJ2NsYXNzJykpLmhlaWdodDtcbiAgICAgICAgdmFyIGxlZnRJbmZvQm94ZXMgPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IGJveC5hbmNob3JTaWRlID09PSBcImxlZnRcIik7ICAgICAgICBcbiAgICAgICAgdmFyIGxlZnRIZWlnaHQgPSB1bml0R2FwOyBcbiAgICAgICAgbGVmdEluZm9Cb3hlcy5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XG4gICAgICAgICAgICBsZWZ0SGVpZ2h0ICs9IGJveC5iYm94LmggKyB1bml0R2FwO1xuICAgICAgICAgICBcbiAgICAgICAgfSk7ICAgICAgXG4gICAgICAgIHZhciByaWdodEluZm9Cb3hlcyA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gYm94LmFuY2hvclNpZGUgPT09IFwicmlnaHRcIik7XG4gICAgICAgIHZhciByaWdodEhlaWdodCA9IHVuaXRHYXA7ICAgICAgICBcbiAgICAgICAgcmlnaHRJbmZvQm94ZXMuZm9yRWFjaChmdW5jdGlvbihib3gpe1xuICAgICAgICAgICAgcmlnaHRIZWlnaHQgKz0gYm94LmJib3guaCArIHVuaXRHYXA7ICAgICAgICAgICBcbiAgICAgICAgfSk7ICAgICAgIFxuICAgICAgICB2YXIgc3R5bGUgPSBub2RlLnN0eWxlKCk7XG4gICAgICAgIHZhciBsYWJlbFRleHQgPSAoKHN0eWxlWydsYWJlbCddKS5zcGxpdChcIlxcblwiKSkuZmlsdGVyKCB0ZXh0ID0+IHRleHQgIT09ICcnKTtcbiAgICAgICAgdmFyIGZvbnRTaXplID0gcGFyc2VGbG9hdChzdHlsZVsnZm9udC1zaXplJ10uc3Vic3RyaW5nKDAsIHN0eWxlWydmb250LXNpemUnXS5sZW5ndGggLSAyKSk7XG4gICAgICAgIHZhciB0b3RhbEhlaWdodCA9IGxhYmVsVGV4dC5sZW5ndGggKiBmb250U2l6ZSArIDIgKiBtYXJnaW47XG5cbiAgICAgICAgXG5cbiAgICAgICAgdmFyIGNvbXBvdW5kSGVpZ2h0ID0gMDtcbiAgICAgICAgaWYobm9kZS5pc1BhcmVudCgpKXtcbiAgICAgICAgICBjb21wb3VuZEhlaWdodCA9IG5vZGUuY2hpbGRyZW4oKS5ib3VuZGluZ0JveCgpLmg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRvdGFsSGVpZ2h0LCBkZWZhdWx0SGVpZ2h0LzIsIGxlZnRIZWlnaHQsIHJpZ2h0SGVpZ2h0LCBjb21wb3VuZEhlaWdodCk7XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5pc1Jlc2l6ZWRUb0NvbnRlbnQgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgaWYoIW5vZGUgfHwgIW5vZGUuaXNOb2RlKCkgfHwgIW5vZGUuZGF0YSgnYmJveCcpKXtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvL3ZhciB3ID0gbm9kZS5kYXRhKCdiYm94JykudztcbiAgICAgIC8vdmFyIGggPSBub2RlLmRhdGEoJ2Jib3gnKS5oO1xuICAgICAgdmFyIHcgPSBub2RlLndpZHRoKCk7XG4gICAgICB2YXIgaCA9IG5vZGUuaGVpZ2h0KCk7XG5cbiAgICAgIHZhciBtaW5XID0gZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5XaWR0aChub2RlKTtcbiAgICAgIHZhciBtaW5IID0gZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5IZWlnaHQobm9kZSk7XG5cbiAgICAgIGlmKHcgPT09IG1pblcgJiYgaCA9PT0gbWluSClcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBTZWN0aW9uIEVuZFxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXG5cbiAgICAvLyBSZWxvY2F0ZXMgc3RhdGUgYW5kIGluZm8gYm94ZXMuIFRoaXMgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkIGFmdGVyIGFkZC9yZW1vdmUgc3RhdGUgYW5kIGluZm8gYm94ZXNcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlbG9jYXRlU3RhdGVBbmRJbmZvcyA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gKGVsZS5pc05vZGUgJiYgZWxlLmlzTm9kZSgpKSA/IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpIDogZWxlO1xuICAgICAgdmFyIGxlbmd0aCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGxlbmd0aCA9PSAxKSB7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gMDtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChsZW5ndGggPT0gMikge1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMDtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSA1MDtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGxlbmd0aCA9PSAzKSB7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcblxuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDI1O1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IC01MDtcblxuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IDA7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC55ID0gNTA7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAtMjU7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gLTUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gLTI1O1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC54ID0gMjU7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC55ID0gNTA7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxuICAgIC8vIFR5cGUgcGFyYW1ldGVyIGluZGljYXRlcyB3aGV0aGVyIHRvIGNoYW5nZSB2YWx1ZSBvciB2YXJpYWJsZSwgaXQgaXMgdmFsaWQgaWYgdGhlIGJveCBhdCB0aGUgZ2l2ZW4gaW5kZXggaXMgYSBzdGF0ZSB2YXJpYWJsZS5cbiAgICAvLyBWYWx1ZSBwYXJhbWV0ZXIgaXMgdGhlIG5ldyB2YWx1ZSB0byBzZXQuXG4gICAgLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgb2xkIHZhbHVlIG9mIHRoZSBjaGFuZ2VkIGRhdGEgKFdlIGFzc3VtZSB0aGF0IHRoZSBvbGQgdmFsdWUgb2YgdGhlIGNoYW5nZWQgZGF0YSB3YXMgdGhlIHNhbWUgZm9yIGFsbCBub2RlcykuXG4gICAgLy8gRWFjaCBjaGFyYWN0ZXIgYXNzdW1lZCB0byBvY2N1cHkgOCB1bml0XG4gICAgLy8gRWFjaCBpbmZvYm94IGNhbiBoYXZlIGF0IG1vc3QgMzIgdW5pdHMgb2Ygd2lkdGhcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHZhciBzYmduY2xhc3MgPSBub2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgICAgICB2YXIgYm94ID0gc3RhdGVBbmRJbmZvc1tpbmRleF07XG4gICAgICAgIHZhciBvbGRMZW5ndGggPSBib3guYmJveC53O1xuICAgICAgICB2YXIgbmV3TGVuZ3RoID0gMDtcblxuICAgICAgICB2YXIgY29udGVudCA9ICcnO1xuICAgICAgICBpZiAoYm94LmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xuICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICByZXN1bHQgPSBib3guc3RhdGVbdHlwZV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYm94LnN0YXRlW3R5cGVdID0gdmFsdWU7XG4gICAgICAgICAgaWYgKGJveC5zdGF0ZVtcInZhbHVlXCJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gYm94LnN0YXRlW1widmFsdWVcIl07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChib3guc3RhdGVbXCJ2YXJpYWJsZVwiXSAhPT0gdW5kZWZpbmVkICYmIGJveC5zdGF0ZVtcInZhcmlhYmxlXCJdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gYm94LnN0YXRlW1widmFyaWFibGVcIl0gKyBcIkBcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChib3guY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcbiAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gYm94LmxhYmVsLnRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRlbnQgKz0gdmFsdWU7XG4gICAgICAgICAgYm94LmxhYmVsLnRleHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtaW4gPSAoIHNiZ25jbGFzcyA9PT0gJ1NJRiBtYWNyb21vbGVjdWxlJyB8fCBzYmduY2xhc3MgPT09ICdTSUYgc2ltcGxlIGNoZW1pY2FsJyApID8gMTUgOiAxMjtcbiAgICAgICAgdmFyIGZvbnRGYW1pbHkgPSBib3guc3R5bGVbICdmb250LWZhbWlseScgXTtcbiAgICAgICAgdmFyIGZvbnRTaXplID0gYm94LnN0eWxlWyAnZm9udC1zaXplJyBdO1xuICAgICAgICB2YXIgYm9yZGVyV2lkdGggPSBib3guc3R5bGVbICdib3JkZXItd2lkdGgnIF07XG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgIG1pbixcbiAgICAgICAgICBtYXg6IDQ4LFxuICAgICAgICAgIG1hcmdpbjogYm9yZGVyV2lkdGggLyAyICsgMC41XG4gICAgICAgIH07XG4gICAgICAgIHZhciBwcmV2aW91c1dpZHRoID0gYm94LmJib3gudztcbiAgICAgICAgYm94LmJib3gudyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0V2lkdGhCeUNvbnRlbnQoIGNvbnRlbnQsIGZvbnRGYW1pbHksIGZvbnRTaXplLCBvcHRzICk7XG5cbiAgICAgICAgaWYoYm94LmFuY2hvclNpZGUgPT0gXCJ0b3BcIiB8fCBib3guYW5jaG9yU2lkZSA9PSBcImJvdHRvbVwiKXtcbiAgICAgICAgICB2YXIgdW5pdExheW91dCA9IG5vZGUuZGF0YSgpW1wiYXV4dW5pdGxheW91dHNcIl1bYm94LmFuY2hvclNpZGVdO1xuICAgICAgICAgIGlmKHVuaXRMYXlvdXQudW5pdHNbdW5pdExheW91dC51bml0cy5sZW5ndGgtMV0uaWQgPT0gYm94LmlkKXtcbiAgICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBib3JkZXJXaWR0aCA9IG5vZGUuZGF0YSgpWydib3JkZXItd2lkdGgnXTtcbiAgICAgICAgICAgIHZhciBzaGlmdEFtb3VudCA9ICgoKGJveC5iYm94LncgLSBwcmV2aW91c1dpZHRoKSAvIDIpICogMTAwICkvIChub2RlLm91dGVyV2lkdGgoKSAtIGJvcmRlcldpZHRoKTtcbiAgICAgICAgICAgXG4gICAgICAgICAgICBpZihzaGlmdEFtb3VudCA+PSAwKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICBpZihib3guYmJveC54ICsgc2hpZnRBbW91bnQgPD0gMTAwKXtcbiAgICAgICAgICAgICAgICBib3guYmJveC54ID0gYm94LmJib3gueCArIHNoaWZ0QW1vdW50O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgIC8qICBlbHNle1xuICAgICAgICAgICAgICB2YXIgcHJldmlvdXNJbmZvQmJveCA9IHt4IDogMCwgdzowfTtcbiAgICAgICAgICAgICAgaWYodW5pdExheW91dC51bml0cy5sZW5ndGggPiAxKXtcbiAgICAgICAgICAgICAgICBwcmV2aW91c0luZm9CYm94PSB1bml0TGF5b3V0LnVuaXRzW3VuaXRMYXlvdXQudW5pdHMubGVuZ3RoLTJdLmJib3g7ICAgICAgXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIHNiZ252aXpJbnN0YW5jZS5jbGFzc2VzLkF1eFVuaXRMYXlvdXQuc2V0SWRlYWxHYXAobm9kZSwgYm94LmFuY2hvclNpZGUpO1xuICAgICAgICAgICAgICB2YXIgaWRlYWxHYXAgPSBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5BdXhVbml0TGF5b3V0LmdldEN1cnJlbnRHYXAoYm94LmFuY2hvclNpZGUpO1xuICAgICAgICAgICAgICB2YXIgbmV3UG9zaXRpb24gPSBwcmV2aW91c0luZm9CYm94LnggKyAocHJldmlvdXNJbmZvQmJveC53LzIgKyBpZGVhbEdhcCArIGJveC5iYm94LncvMikqMTAwIC8gKG5vZGUub3V0ZXJXaWR0aCgpIC0gYm9yZGVyV2lkdGgpO1xuICAgICAgICAgICAgICBib3guYmJveC54ID0gbmV3UG9zaXRpb247XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSAqL1xuICAgICAgICAgICBcbiAgICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgLyogaWYgKGJveC5hbmNob3JTaWRlID09PSBcInRvcFwiIHx8IGJveC5hbmNob3JTaWRlID09PSBcImJvdHRvbVwiKSB7XG4gICAgICAgICAgYm94LmJib3gueCArPSAoYm94LmJib3gudyAtIG9sZExlbmd0aCkgLyAyO1xuICAgICAgICAgIHZhciB1bml0cyA9IChub2RlLmRhdGEoJ2F1eHVuaXRsYXlvdXRzJylbYm94LmFuY2hvclNpZGVdKS51bml0cztcbiAgICAgICAgICB2YXIgc2hpZnRJbmRleCA9IDA7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bml0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYodW5pdHNbaV0gPT09IGJveCl7XG4gICAgICAgICAgICAgIHNoaWZ0SW5kZXggPSBpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yICh2YXIgaiA9IHNoaWZ0SW5kZXgrMTsgaiA8IHVuaXRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgIHVuaXRzW2pdLmJib3gueCArPSAoYm94LmJib3gudyAtIG9sZExlbmd0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9ICovXG5cbiAgICAgIH1cblxuICAgICAgLy9UT0RPIGZpbmQgYSB3YXkgdG8gZWxpbWF0ZSB0aGlzIHJlZHVuZGFuY3kgdG8gdXBkYXRlIGluZm8tYm94IHBvc2l0aW9uc1xuICAgICAgbm9kZS5kYXRhKCdib3JkZXItd2lkdGgnLCBub2RlLmRhdGEoJ2JvcmRlci13aWR0aCcpKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgLy8gQWRkIGEgbmV3IHN0YXRlIG9yIGluZm8gYm94IHRvIGdpdmVuIG5vZGVzLlxuICAgIC8vIFRoZSBib3ggaXMgcmVwcmVzZW50ZWQgYnkgdGhlIHBhcmFtZXRlciBvYmouXG4gICAgLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGp1c3QgYWRkZWQgYm94LlxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIG9iaikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgbG9jYXRpb25PYmo7XG5cbiAgICAgICAgdmFyIGRlZmF1bHRQcm9wcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIG5vZGUuZGF0YSgnY2xhc3MnKSApO1xuICAgICAgICB2YXIgaW5mb2JveFByb3BzID0gZGVmYXVsdFByb3BzWyBvYmouY2xhenogXTtcbiAgICAgICAgdmFyIGJib3ggPSBvYmouYmJveCB8fCB7IHc6IGluZm9ib3hQcm9wcy53aWR0aCwgaDogaW5mb2JveFByb3BzLmhlaWdodCB9OyAgICAgICAgXG4gICAgICAgIHZhciBzdHlsZSA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdEluZm9ib3hTdHlsZSggbm9kZS5kYXRhKCdjbGFzcycpLCBvYmouY2xhenogKTtcbiAgICAgICAgaWYob2JqLnN0eWxlKXtcbiAgICAgICAgICAkLmV4dGVuZCggc3R5bGUsIG9iai5zdHlsZSApO1xuICAgICAgICB9XG4gICAgICAgXG4gICAgICAgIGlmKG9iai5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xuICAgICAgICAgIGxvY2F0aW9uT2JqID0gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuVW5pdE9mSW5mb3JtYXRpb24uY3JlYXRlKG5vZGUsIGN5LCBvYmoubGFiZWwudGV4dCwgYmJveCwgb2JqLmxvY2F0aW9uLCBvYmoucG9zaXRpb24sIHN0eWxlLCBvYmouaW5kZXgsIG9iai5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob2JqLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xuICAgICAgICAgIGxvY2F0aW9uT2JqID0gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuU3RhdGVWYXJpYWJsZS5jcmVhdGUobm9kZSwgY3ksIG9iai5zdGF0ZS52YWx1ZSwgb2JqLnN0YXRlLnZhcmlhYmxlLCBiYm94LCBvYmoubG9jYXRpb24sIG9iai5wb3NpdGlvbiwgc3R5bGUsIG9iai5pbmRleCwgb2JqLmlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxvY2F0aW9uT2JqO1xuICAgIH07XG5cbiAgICAvLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxuICAgIC8vIFJldHVybnMgdGhlIHJlbW92ZWQgYm94LlxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIGxvY2F0aW9uT2JqKSB7XG4gICAgICB2YXIgb2JqO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcbiAgICAgICAgdmFyIHVuaXQgPSBzdGF0ZUFuZEluZm9zW2xvY2F0aW9uT2JqLmluZGV4XTtcblxuICAgICAgICB2YXIgdW5pdENsYXNzID0gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuZ2V0QXV4VW5pdENsYXNzKHVuaXQpO1xuXG4gICAgICAgIG9iaiA9IHVuaXRDbGFzcy5yZW1vdmUodW5pdCwgY3kpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG5cblxuICAgIC8vVGlsZXMgaW5mb3JtYXRpb25zIGJveGVzIGZvciBnaXZlbiBhbmNob3JTaWRlc1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuZml0VW5pdHMgPSBmdW5jdGlvbiAobm9kZSwgbG9jYXRpb25zKSB7XG4gICAgICB2YXIgb2JqID0gW107XG4gICAgICBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykuZm9yRWFjaCggZnVuY3Rpb24gKGVsZSkge1xuICAgICAgICBvYmoucHVzaCh7XG4gICAgICAgICAgeDogZWxlLmJib3gueCxcbiAgICAgICAgICB5OiBlbGUuYmJveC55LFxuICAgICAgICAgIGFuY2hvclNpZGU6IGVsZS5hbmNob3JTaWRlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5BdXhVbml0TGF5b3V0LmZpdFVuaXRzKG5vZGUsIGN5LCBsb2NhdGlvbnMpO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuXG4gICAgLy9DaGVjayB3aGljaCBhbmNob3JzaWRlcyBmaXRzXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGVja0ZpdCA9IGZ1bmN0aW9uIChub2RlLCBsb2NhdGlvbikgeyAvL2lmIG5vIGxvY2F0aW9uIGdpdmVuLCBpdCBjaGVja3MgYWxsIHBvc3NpYmxlIGxvY2F0aW9uc1xuICAgICAgcmV0dXJuIHNiZ252aXpJbnN0YW5jZS5jbGFzc2VzLkF1eFVuaXRMYXlvdXQuY2hlY2tGaXQobm9kZSwgY3ksIGxvY2F0aW9uKTtcbiAgICB9O1xuXG4gICAgLy9Nb2RpZnkgYXJyYXkgb2YgYXV4IGxheW91dCB1bml0c1xuICAgIGVsZW1lbnRVdGlsaXRpZXMubW9kaWZ5VW5pdHMgPSBmdW5jdGlvbiAobm9kZSwgdW5pdCwgYW5jaG9yU2lkZSkge1xuICAgICAgc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuQXV4VW5pdExheW91dC5tb2RpZnlVbml0cyhub2RlLCB1bml0LCBhbmNob3JTaWRlLCBjeSk7XG4gICAgfTtcblxuICAgIC8vIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChub2Rlcywgc3RhdHVzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHZhciBzYmduY2xhc3MgPSBub2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcblxuICAgICAgICBpZiAoc3RhdHVzKSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIHRydWVcbiAgICAgICAgICBpZiAoIWlzTXVsdGltZXIpIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MgKyAnIG11bHRpbWVyJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyBmYWxzZVxuICAgICAgICAgIGlmIChpc011bHRpbWVyKSB7XG4gICAgICAgICAgICBub2RlLmRhdGEoJ2NsYXNzJywgc2JnbmNsYXNzLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIENoYW5nZSBmb250IHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIGVsZW1lbnRzIHdpdGggZ2l2ZW4gZm9udCBkYXRhXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChlbGVzLCBkYXRhKSB7XG4gICAgICBmb3IgKHZhciBwcm9wIGluIGRhdGEpIHtcbiAgICAgICAgZWxlcy5kYXRhKHByb3AsIGRhdGFbcHJvcF0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGdldHMgYW4gZWRnZSwgYW5kIGVuZHMgb2YgdGhhdCBlZGdlIChPcHRpb25hbGx5IGl0IG1heSB0YWtlIGp1c3QgdGhlIGNsYXNzZXMgb2YgdGhlIGVkZ2UgYXMgd2VsbCkgYXMgcGFyYW1ldGVycy5cbiAgICAvLyBJdCBtYXkgcmV0dXJuICd2YWxpZCcgKHRoYXQgZW5kcyBpcyB2YWxpZCBmb3IgdGhhdCBlZGdlKSwgJ3JldmVyc2UnICh0aGF0IGVuZHMgaXMgbm90IHZhbGlkIGZvciB0aGF0IGVkZ2UgYnV0IHRoZXkgd291bGQgYmUgdmFsaWRcbiAgICAvLyBpZiB5b3UgcmV2ZXJzZSB0aGUgc291cmNlIGFuZCB0YXJnZXQpLCAnaW52YWxpZCcgKHRoYXQgZW5kcyBhcmUgdG90YWxseSBpbnZhbGlkIGZvciB0aGF0IGVkZ2UpLlxuICAgIGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMgPSBmdW5jdGlvbiAoZWRnZSwgc291cmNlLCB0YXJnZXQsIGlzUmVwbGFjZW1lbnQpIHtcbiAgICAgIC8vIGlmIG1hcCB0eXBlIGlzIFVua25vd24gLS0gbm8gcnVsZXMgYXBwbGllZFxuICAgICAgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpID09IFwiSHlicmlkQW55XCIgfHwgZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gXCJIeWJyaWRTYmduXCIgfHwgIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKVxuICAgICAgICByZXR1cm4gXCJ2YWxpZFwiO1xuXG4gICAgICB2YXIgZWRnZWNsYXNzID0gdHlwZW9mIGVkZ2UgPT09ICdzdHJpbmcnID8gZWRnZSA6IGVkZ2UuZGF0YSgnY2xhc3MnKTtcbiAgICAgIHZhciBzb3VyY2VjbGFzcyA9IHNvdXJjZS5kYXRhKCdjbGFzcycpO1xuICAgICAgdmFyIHRhcmdldGNsYXNzID0gdGFyZ2V0LmRhdGEoJ2NsYXNzJyk7XG4gICAgICB2YXIgbWFwVHlwZSA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpO1xuICAgICAgdmFyIGVkZ2VDb25zdHJhaW50cyA9IGVsZW1lbnRVdGlsaXRpZXNbbWFwVHlwZV0uY29ubmVjdGl2aXR5Q29uc3RyYWludHNbZWRnZWNsYXNzXTtcblxuICAgICAgaWYgKG1hcFR5cGUgPT0gXCJBRlwiKXtcbiAgICAgICAgaWYgKHNvdXJjZWNsYXNzLnN0YXJ0c1dpdGgoXCJCQVwiKSkgLy8gd2UgaGF2ZSBzZXBhcmF0ZSBjbGFzc2VzIGZvciBlYWNoIGJpb2xvZ2ljYWwgYWN0aXZpdHlcbiAgICAgICAgICBzb3VyY2VjbGFzcyA9IFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiOyAvLyBidXQgc2FtZSBydWxlIGFwcGxpZXMgdG8gYWxsIG9mIHRoZW1cblxuICAgICAgICBpZiAodGFyZ2V0Y2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKSAvLyB3ZSBoYXZlIHNlcGFyYXRlIGNsYXNzZXMgZm9yIGVhY2ggYmlvbG9naWNhbCBhY3Rpdml0eVxuICAgICAgICAgIHRhcmdldGNsYXNzID0gXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI7IC8vIGJ1dCBzYW1lIHJ1bGUgYXBwbGllcyB0byBhbGwgb2YgdGhlbVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAobWFwVHlwZSA9PSBcIlBEXCIpe1xuICAgICAgICBzb3VyY2VjbGFzcyA9IHNvdXJjZWNsYXNzLnJlcGxhY2UoL1xccyptdWx0aW1lciQvLCAnJyk7XG4gICAgICAgIHRhcmdldGNsYXNzID0gdGFyZ2V0Y2xhc3MucmVwbGFjZSgvXFxzKm11bHRpbWVyJC8sICcnKTtcbiAgICAgIH1cblxuICAgICAgLy8gZ2l2ZW4gYSBub2RlLCBhY3RpbmcgYXMgc291cmNlIG9yIHRhcmdldCwgcmV0dXJucyBib29sZWFuIHdldGhlciBvciBub3QgaXQgaGFzIHRvbyBtYW55IGVkZ2VzIGFscmVhZHlcbiAgICAgIGZ1bmN0aW9uIGhhc1Rvb01hbnlFZGdlcyhub2RlLCBzb3VyY2VPclRhcmdldCkge1xuICAgICAgICB2YXIgbm9kZWNsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xuICAgICAgICBub2RlY2xhc3MgPSBub2RlY2xhc3MucmVwbGFjZSgvXFxzKm11bHRpbWVyJC8sICcnKTtcbiAgICAgICAgaWYgKG5vZGVjbGFzcy5zdGFydHNXaXRoKFwiQkFcIikpXG4gICAgICAgICAgbm9kZWNsYXNzID0gXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI7XG5cbiAgICAgICAgLypcbiAgICAgICAgICBPbiB0aGUgbG9naWMgYmVsb3c6XG5cbiAgICAgICAgICBDdXJyZW50IGVkZ2UgY291bnQgKGluY29taW5nIG9yIG91dGdvaW5nKSBvZiBub2RlcyBzaG91bGQgYmUgc3RyaWN0bHkgbGVzcyBcbiAgICAgICAgICB0aGFuIHRoZSBtYXhpbXVtIGFsbG93ZWQgaWYgd2UgYXJlIGFkZGluZyBhbiBlZGdlIHRvIHRoZSBub2RlLiBUaGlzIHdheVxuICAgICAgICAgIGl0IHdpbGwgbmV2ZXIgZXhjZWVkIHRoZSBtYXggY291bnQuXG4gICAgICAgICAgXG4gICAgICAgICAgRWRnZXMgY2FuIGJlIGFkZGVkIGluIHR3byBkaWZmZXJlbnQgd2F5cy4gRWl0aGVyIHRoZXkgYXJlIGFkZGVkIGRpcmVjdGx5IG9yXG4gICAgICAgICAgdGhleSBhcmUgYWRkZWQgYnkgYmVpbmcgcmVwbGFjZWQgZnJvbSBhbm90aGVyIG5vZGUsIGkuZSBkaXNjb25uZWN0ZWQgZnJvbVxuICAgICAgICAgIG9uZSBhbmQgY29ubmVjdGVkIHRvIGFub3RoZXIuXG5cbiAgICAgICAgICBXZSBjYW4gZGV0ZWN0IGlmIHRoZSBlZGdlIGJlaW5nIGFkZGVkIGlzIGFkZGVkIGZyb20gYSByZXBsYWNlbWVudCBieSBjaGVja2luZ1xuICAgICAgICAgIHdoZXRoZXIgdGhlIHNvdXJjZSBzdGF5ZWQgdGhlIHNhbWUgd2hlbiBjaGVja2luZyBlZGdlIGNvdW50cyBvZiB0aGUgc291cmNlIG5vZGUsXG4gICAgICAgICAgYW5kIHdoZXRoZXIgdGhlIHRhcmdldCBzdGF5ZWQgdGhlIHNhbWUgd2hlbiBjaGVja2luZyBlZGdlIGNvdW50cyBvZiB0aGVcbiAgICAgICAgICB0YXJnZXQgbm9kZS5cblxuICAgICAgICAgIEN1cnJlbnQgZWRnZSBjb3VudCBvZiBub2RlcyBjYW4gYmUgYWxsb3dlZCB0byBiZSBlcXVhbCB0byB0aGUgbWF4aW11bSBpbiBcbiAgICAgICAgICBjYXNlcyB3aGVyZSBhIHJlcGxhY2VtZW50IGlzIG1hZGUuIEJ1dCB3ZSBzaG91bGQgYmUgY2FyZWZ1bCB0aGF0IHRoaXNcbiAgICAgICAgICByZXBsYWNlbWVudCBvcGVyYXRpb24gaXMgbm90IGFsc28gYW4gYWRkaXRpb24gb3BlcmF0aW9uIGFzIGRlc2NyaWJlZCBhYm92ZS5cbiAgICAgICAgKi9cblxuICAgICAgICB2YXIgdG90YWxUb29NYW55ID0gdHJ1ZTtcbiAgICAgICAgdmFyIGVkZ2VUb29NYW55ID0gdHJ1ZTtcbiAgICAgICAgaWYgKHNvdXJjZU9yVGFyZ2V0ID09IFwic291cmNlXCIpIHtcbiAgICAgICAgICAgIHZhciBzYW1lRWRnZUNvdW50T3V0ID0gbm9kZS5vdXRnb2VycygnZWRnZVtjbGFzcz1cIicrZWRnZWNsYXNzKydcIl0nKS5zaXplKCk7XG4gICAgICAgICAgICB2YXIgdG90YWxFZGdlQ291bnRPdXQgPSBub2RlLm91dGdvZXJzKCdlZGdlJykuc2l6ZSgpO1xuICAgICAgICAgICAgdmFyIG1heFRvdGFsID0gZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4VG90YWw7IFxuICAgICAgICAgICAgdmFyIG1heEVkZ2UgPSBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhFZGdlO1xuXG4gICAgICAgICAgICB2YXIgY29tcGFyZVN0cmljdCA9ICEoaXNSZXBsYWNlbWVudCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlZGdlLnNvdXJjZSgpID09PSBzb3VyY2UpKTtcblxuICAgICAgICAgICAgdmFyIHdpdGhpbkxpbWl0cyA9ICFtYXhUb3RhbCB8fCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb21wYXJlU3RyaWN0ICYmICh0b3RhbEVkZ2VDb3VudE91dCA8IG1heFRvdGFsKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICghY29tcGFyZVN0cmljdCAmJiAodG90YWxFZGdlQ291bnRPdXQgPD0gbWF4VG90YWwpKTtcblxuICAgICAgICAgICAgaWYgKHdpdGhpbkxpbWl0cykge1xuICAgICAgICAgICAgICAgIHRvdGFsVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhlbiBjaGVjayBsaW1pdHMgZm9yIHRoaXMgc3BlY2lmaWMgZWRnZSBjbGFzc1xuXG4gICAgICAgICAgICB3aXRoaW5MaW1pdHMgPSAhbWF4RWRnZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjb21wYXJlU3RyaWN0ICYmIChzYW1lRWRnZUNvdW50T3V0IDwgbWF4RWRnZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIWNvbXBhcmVTdHJpY3QgJiYgKHNhbWVFZGdlQ291bnRPdXQgPD0gbWF4RWRnZSkpKTsgXG5cbiAgICAgICAgICAgIGlmICh3aXRoaW5MaW1pdHMpIHtcbiAgICAgICAgICAgICAgICBlZGdlVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBvbmx5IG9uZSBvZiB0aGUgbGltaXRzIGlzIHJlYWNoZWQgdGhlbiBlZGdlIGlzIGludmFsaWRcbiAgICAgICAgICAgIHJldHVybiB0b3RhbFRvb01hbnkgfHwgZWRnZVRvb01hbnk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIG5vZGUgaXMgdXNlZCBhcyB0YXJnZXRcbiAgICAgICAgICAgIHZhciBzYW1lRWRnZUNvdW50SW4gPSBub2RlLmluY29tZXJzKCdlZGdlW2NsYXNzPVwiJytlZGdlY2xhc3MrJ1wiXScpLnNpemUoKTtcbiAgICAgICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudEluID0gbm9kZS5pbmNvbWVycygnZWRnZScpLnNpemUoKTtcbiAgICAgICAgICAgIHZhciBtYXhUb3RhbCA9IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heFRvdGFsOyBcbiAgICAgICAgICAgIHZhciBtYXhFZGdlID0gZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNUYXJnZXQubWF4RWRnZTtcblxuICAgICAgICAgICAgdmFyIGNvbXBhcmVTdHJpY3QgPSAhKGlzUmVwbGFjZW1lbnQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVkZ2UudGFyZ2V0KCkgPT09IHRhcmdldCkpO1xuXG4gICAgICAgICAgICB2YXIgd2l0aGluTGltaXRzID0gIW1heFRvdGFsIHx8IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbXBhcmVTdHJpY3QgJiYgKHRvdGFsRWRnZUNvdW50SW4gPCBtYXhUb3RhbCkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIWNvbXBhcmVTdHJpY3QgJiYgKHRvdGFsRWRnZUNvdW50SW4gPD0gbWF4VG90YWwpKTtcblxuICAgICAgICAgICAgaWYgKHdpdGhpbkxpbWl0cykge1xuICAgICAgICAgICAgICAgIHRvdGFsVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aXRoaW5MaW1pdHMgPSAhbWF4RWRnZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAoY29tcGFyZVN0cmljdCAmJiAoc2FtZUVkZ2VDb3VudEluIDwgbWF4RWRnZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKCFjb21wYXJlU3RyaWN0ICYmIChzYW1lRWRnZUNvdW50SW4gPD0gbWF4RWRnZSkpKTsgXG5cbiAgICAgICAgICAgIGlmICh3aXRoaW5MaW1pdHMpIHtcbiAgICAgICAgICAgICAgICBlZGdlVG9vTWFueSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRvdGFsVG9vTWFueSB8fCBlZGdlVG9vTWFueTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpc0luQ29tcGxleChub2RlKSB7XG4gICAgICAgIHZhciBwYXJlbnRDbGFzcyA9IG5vZGUucGFyZW50KCkuZGF0YSgnY2xhc3MnKTtcbiAgICAgICAgcmV0dXJuIHBhcmVudENsYXNzICYmIHBhcmVudENsYXNzLnN0YXJ0c1dpdGgoJ2NvbXBsZXgnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzSW5Db21wbGV4KHNvdXJjZSkgfHwgaXNJbkNvbXBsZXgodGFyZ2V0KSkgeyAvLyBzdWJ1bml0cyBvZiBhIGNvbXBsZXggYXJlIG5vIGxvbmdlciBFUE5zLCBubyBjb25uZWN0aW9uIGFsbG93ZWRcbiAgICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICAgIH1cblxuICAgICAgLy8gY2hlY2sgbmF0dXJlIG9mIGNvbm5lY3Rpb25cbiAgICAgIGlmIChlZGdlQ29uc3RyYWludHNbc291cmNlY2xhc3NdLmFzU291cmNlLmlzQWxsb3dlZCAmJiBlZGdlQ29uc3RyYWludHNbdGFyZ2V0Y2xhc3NdLmFzVGFyZ2V0LmlzQWxsb3dlZCkge1xuICAgICAgICAvLyBjaGVjayBhbW91bnQgb2YgY29ubmVjdGlvbnNcbiAgICAgICAgaWYgKCFoYXNUb29NYW55RWRnZXMoc291cmNlLCBcInNvdXJjZVwiKSAmJiAhaGFzVG9vTWFueUVkZ2VzKHRhcmdldCwgXCJ0YXJnZXRcIikgKSB7XG4gICAgICAgICAgcmV0dXJuICd2YWxpZCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIHRyeSB0byByZXZlcnNlXG4gICAgICBpZiAoZWRnZUNvbnN0cmFpbnRzW3RhcmdldGNsYXNzXS5hc1NvdXJjZS5pc0FsbG93ZWQgJiYgZWRnZUNvbnN0cmFpbnRzW3NvdXJjZWNsYXNzXS5hc1RhcmdldC5pc0FsbG93ZWQpIHtcbiAgICAgICAgaWYgKCFoYXNUb29NYW55RWRnZXModGFyZ2V0LCBcInNvdXJjZVwiKSAmJiAhaGFzVG9vTWFueUVkZ2VzKHNvdXJjZSwgXCJ0YXJnZXRcIikgKSB7XG4gICAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuICdpbnZhbGlkJztcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5kZWxldGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSBlbGVzLnJlbW92ZSgpO1xuICAgICAgaWYgKHR5cGVvZiBsYXlvdXRwYXJhbSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsYXlvdXRwYXJhbSgpOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBhIGZ1bmN0aW9uIGV4ZWN1dGUgaXRcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhciBsYXlvdXQgPSBjeS5sYXlvdXQobGF5b3V0cGFyYW0pOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBsYXlvdXQgb3B0aW9ucyBjYWxsIGxheW91dCB3aXRoIHRoYXQgb3B0aW9ucy5cblxuICAgICAgICAgIC8vIERvIHRoaXMgY2hlY2sgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuKSB7XG4gICAgICAgICAgICAgIGxheW91dC5ydW4oKTtcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogSGlkZSBnaXZlbiBlbGVzIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXG4gICAgICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLlxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuaGlkZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihlbGVzLCBsYXlvdXRwYXJhbSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gY3kudmlld1V0aWxpdGllcygpLmhpZGUoZWxlcyk7IC8vIEhpZGUgZ2l2ZW4gZWxlc1xuICAgICAgICBpZiAodHlwZW9mIGxheW91dHBhcmFtID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBsYXlvdXRwYXJhbSgpOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBhIGZ1bmN0aW9uIGV4ZWN1dGUgaXRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBsYXlvdXQgPSBjeS5sYXlvdXQobGF5b3V0cGFyYW0pOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBsYXlvdXQgb3B0aW9ucyBjYWxsIGxheW91dCB3aXRoIHRoYXQgb3B0aW9ucy5cblxuICAgICAgICAgICAgLy8gRG8gdGhpcyBjaGVjayBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xuICAgICAgICAgICAgICAgIGxheW91dC5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogVW5oaWRlIGdpdmVuIGVsZXMgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAgICAgKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xuICAgICAgaWYgKHR5cGVvZiBsYXlvdXRwYXJhbSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsYXlvdXRwYXJhbSgpOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBhIGZ1bmN0aW9uIGV4ZWN1dGUgaXRcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgbGF5b3V0ID0gY3kubGF5b3V0KGxheW91dHBhcmFtKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgbGF5b3V0IG9wdGlvbnMgY2FsbCBsYXlvdXQgd2l0aCB0aGF0IG9wdGlvbnMuXG5cbiAgICAgICAgLy8gRG8gdGhpcyBjaGVjayBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICAgICAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuKSB7XG4gICAgICAgICAgbGF5b3V0LnJ1bigpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogQ2hhbmdlIHN0eWxlL2NzcyBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gICAgICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICAgICAgaWYgKCB0eXBlb2YgdmFsdWVNYXAgPT09ICdvYmplY3QnICkge1xuICAgICAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBlbGUgPSBjeS5nZXRFbGVtZW50QnlJZChlbGVzW2ldLmlkKCkpO1xuICAgICAgICAgIGVsZS5jc3MobmFtZSwgdmFsdWVNYXBbZWxlLmlkKCldKTsgLy8gdmFsdWVNYXAgaXMgYW4gaWQgdG8gdmFsdWUgbWFwIHVzZSBpdCBpbiB0aGlzIHdheVxuICAgICAgICB9XG4gICAgICAgIGN5LmVuZEJhdGNoKCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcy5jc3MobmFtZSwgdmFsdWVNYXApOyAvLyB2YWx1ZU1hcCBpcyBqdXN0IGEgc3RyaW5nIHNldCBjc3MoJ25hbWUnKSBmb3IgYWxsIGVsZXMgdG8gdGhpcyB2YWx1ZVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKlxuICAgICAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAgICAgKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS5cbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICAgICAgaWYgKCB0eXBlb2YgdmFsdWVNYXAgPT09ICdvYmplY3QnICkge1xuICAgICAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBlbGUgPSBjeS5nZXRFbGVtZW50QnlJZChlbGVzW2ldLmlkKCkpO1xuICAgICAgICAgIGVsZS5kYXRhKG5hbWUsIHZhbHVlTWFwW2VsZS5pZCgpXSk7IC8vIHZhbHVlTWFwIGlzIGFuIGlkIHRvIHZhbHVlIG1hcCB1c2UgaXQgaW4gdGhpcyB3YXlcbiAgICAgICAgfVxuICAgICAgICBjeS5lbmRCYXRjaCgpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGVsZXMuZGF0YShuYW1lLCB2YWx1ZU1hcCk7IC8vIHZhbHVlTWFwIGlzIGp1c3QgYSBzdHJpbmcgc2V0IGNzcygnbmFtZScpIGZvciBhbGwgZWxlcyB0byB0aGlzIHZhbHVlXG4gICAgICB9XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlU2V0RmllbGQgPSBmdW5jdGlvbihlbGUsIGZpZWxkTmFtZSwgdG9EZWxldGUsIHRvQWRkLCBjYWxsYmFjaykge1xuICAgICAgdmFyIHNldCA9IGVsZS5kYXRhKCBmaWVsZE5hbWUgKTtcbiAgICAgIGlmICggIXNldCApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIHVwZGF0ZXMgPSB7fTtcblxuICAgICAgaWYgKCB0b0RlbGV0ZSAhPSBudWxsICYmIHNldFsgdG9EZWxldGUgXSApIHtcbiAgICAgICAgZGVsZXRlIHNldFsgdG9EZWxldGUgXTtcbiAgICAgICAgdXBkYXRlcy5kZWxldGVkID0gdG9EZWxldGU7XG4gICAgICB9XG5cbiAgICAgIGlmICggdG9BZGQgIT0gbnVsbCApIHtcbiAgICAgICAgc2V0WyB0b0FkZCBdID0gdHJ1ZTtcbiAgICAgICAgdXBkYXRlcy5hZGRlZCA9IHRvQWRkO1xuICAgICAgfVxuXG4gICAgICBpZiAoIGNhbGxiYWNrICYmICggdXBkYXRlc1sgJ2RlbGV0ZWQnIF0gIT0gbnVsbCB8fCB1cGRhdGVzWyAnYWRkZWQnIF0gIT0gbnVsbCApICkge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdXBkYXRlcztcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBSZXR1cm4gdGhlIHNldCBvZiBhbGwgbm9kZXMgcHJlc2VudCB1bmRlciB0aGUgZ2l2ZW4gcG9zaXRpb25cbiAgICAgKiByZW5kZXJlZFBvcyBtdXN0IGJlIGEgcG9pbnQgZGVmaW5lZCByZWxhdGl2ZWx5IHRvIGN5dG9zY2FwZSBjb250YWluZXJcbiAgICAgKiAobGlrZSByZW5kZXJlZFBvc2l0aW9uIGZpZWxkIG9mIGEgbm9kZSlcbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmdldE5vZGVzQXQgPSBmdW5jdGlvbihyZW5kZXJlZFBvcykge1xuICAgICAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcbiAgICAgIHZhciB4ID0gcmVuZGVyZWRQb3MueDtcbiAgICAgIHZhciB5ID0gcmVuZGVyZWRQb3MueTtcbiAgICAgIHZhciByZXN1bHROb2RlcyA9IFtdO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHZhciByZW5kZXJlZEJib3ggPSBub2RlLnJlbmRlcmVkQm91bmRpbmdCb3goe1xuICAgICAgICAgIGluY2x1ZGVOb2RlczogdHJ1ZSxcbiAgICAgICAgICBpbmNsdWRlRWRnZXM6IGZhbHNlLFxuICAgICAgICAgIGluY2x1ZGVMYWJlbHM6IGZhbHNlLFxuICAgICAgICAgIGluY2x1ZGVTaGFkb3dzOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHggPj0gcmVuZGVyZWRCYm94LngxICYmIHggPD0gcmVuZGVyZWRCYm94LngyKSB7XG4gICAgICAgICAgaWYgKHkgPj0gcmVuZGVyZWRCYm94LnkxICYmIHkgPD0gcmVuZGVyZWRCYm94LnkyKSB7XG4gICAgICAgICAgICByZXN1bHROb2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdE5vZGVzO1xuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmRlbXVsdGltZXJpemVDbGFzcyA9IGZ1bmN0aW9uKHNiZ25jbGFzcykge1xuICAgICAgcmV0dXJuIHNiZ25jbGFzcy5yZXBsYWNlKFwiIG11bHRpbWVyXCIsIFwiXCIpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbWFwVHlwZSAtIHR5cGUgb2YgdGhlIGN1cnJlbnQgbWFwIChQRCwgQUYgb3IgVW5rbm93bilcbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUgPSBmdW5jdGlvbihtYXBUeXBlKXtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZSA9IG1hcFR5cGU7XG4gICAgICByZXR1cm4gbWFwVHlwZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gLSBtYXAgdHlwZVxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLm1hcFR5cGU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlc2V0cyBtYXAgdHlwZVxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzZXRNYXBUeXBlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tYXBUeXBlID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEtlZXAgY29uc2lzdGVuY3kgb2YgbGlua3MgdG8gc2VsZiBpbnNpZGUgdGhlIGRhdGEoKSBzdHJ1Y3R1cmUuXG4gICAgICogVGhpcyBpcyBuZWVkZWQgd2hlbmV2ZXIgYSBub2RlIGNoYW5nZXMgcGFyZW50cywgZm9yIGV4YW1wbGUsXG4gICAgICogYXMgaXQgaXMgZGVzdHJveWVkIGFuZCByZWNyZWF0ZWQuIEJ1dCB0aGUgZGF0YSgpIHN0YXlzIGlkZW50aWNhbC5cbiAgICAgKiBUaGlzIGNyZWF0ZXMgaW5jb25zaXN0ZW5jaWVzIGZvciB0aGUgcG9pbnRlcnMgc3RvcmVkIGluIGRhdGEoKSxcbiAgICAgKiBhcyB0aGV5IG5vdyBwb2ludCB0byBhIGRlbGV0ZWQgbm9kZS5cbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlciA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgICBlbGVzLm5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbihlbGUpe1xuICAgICAgICAvLyByZXN0b3JlIGJhY2tncm91bmQgaW1hZ2VzXG4gICAgICAgIGVsZS5lbWl0KCdkYXRhJyk7XG5cbiAgICAgICAgLy8gc2tpcCBub2RlcyB3aXRob3V0IGFueSBhdXhpbGlhcnkgdW5pdHNcbiAgICAgICAgaWYoIWVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpIHx8IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvcih2YXIgc2lkZSBpbiBlbGUuZGF0YSgnYXV4dW5pdGxheW91dHMnKSkge1xuICAgICAgICAgIGVsZS5kYXRhKCdhdXh1bml0bGF5b3V0cycpW3NpZGVdLnBhcmVudE5vZGUgPSBlbGUuaWQoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IodmFyIGk9MDsgaSA8IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJylbaV0ucGFyZW50ID0gZWxlLmlkKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYW55SGFzQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKGVsZXMpIHtcbiAgICAgIHZhciBvYmogPSBlbGVtZW50VXRpbGl0aWVzLmdldEJhY2tncm91bmRJbWFnZU9ianMoZWxlcyk7XG4gICAgICBpZihvYmogPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgZWxzZXtcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqKXtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgICAgICBpZih2YWx1ZSAmJiAhJC5pc0VtcHR5T2JqZWN0KHZhbHVlKSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChlbGUpIHtcbiAgICAgIGlmICghZWxlLmlzTm9kZSgpIHx8ICFlbGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciBiZztcbiAgICAgIFxuICAgICAgaWYodHlwZW9mIGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgYmcgPSBlbGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KFwiIFwiKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYoQXJyYXkuaXNBcnJheShvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSkpIHtcbiAgICAgICAgYmcgPSBlbGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWJnKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHZhciBjbG9uZUltZyA9ICdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCwlM0NzdmclMjB3aWR0aCUzRCUyMjEwMCUyMiUyMGhlaWdodCUzRCUyMjEwMCUyMiUyMHZpZXdCb3glM0QlMjIwJTIwMCUyMDEwMCUyMDEwMCUyMiUyMHN0eWxlJTNEJTIyZmlsbCUzQW5vbmUlM0JzdHJva2UlM0FibGFjayUzQnN0cm9rZS13aWR0aCUzQTAlM0IlMjIlMjB4bWxucyUzRCUyMmh0dHAlM0EvL3d3dy53My5vcmcvMjAwMC9zdmclMjIlMjAlM0UlM0NyZWN0JTIweCUzRCUyMjAlMjIlMjB5JTNEJTIyMCUyMiUyMHdpZHRoJTNEJTIyMTAwJTIyJTIwaGVpZ2h0JTNEJTIyMTAwJTIyJTIwc3R5bGUlM0QlMjJmaWxsJTNBJTIzODM4MzgzJTIyLyUzRSUyMCUzQy9zdmclM0UnO1xuICAgICAgLy8gSWYgY2xvbmVJbWcgaXMgbm90IHRoZSBvbmx5IGltYWdlIG9yIHRoZXJlIGFyZSBtdWx0aXBsZSBpbWFnZXMgdGhlcmUgaXMgYSBiYWNrZ3JvdW5kIGltYWdlXG4gICAgICB2YXIgb25seUhhc0Nsb25lTWFya2VyQXNCZ0ltYWdlID0gKGJnLmxlbmd0aCA9PT0gMSkgJiYgKGJnLmluZGV4T2YoY2xvbmVJbWcpID09PSAwKTtcblxuICAgICAgaWYoYmcubGVuZ3RoID4gMSB8fCAhKG9ubHlIYXNDbG9uZU1hcmtlckFzQmdJbWFnZSkpXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5nZXRCYWNrZ3JvdW5kSW1hZ2VVUkwgPSBmdW5jdGlvbiAoZWxlcykge1xuICAgICAgaWYoIWVsZXMgfHwgZWxlcy5sZW5ndGggPCAxKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHZhciBjb21tb25VUkwgPSBcIlwiO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcblxuICAgICAgICBpZighZWxlLmlzTm9kZSgpIHx8ICFlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShlbGUpKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB2YXIgdXJsID0gZWxlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKS5zcGxpdChcIiBcIikucG9wKCk7XG4gICAgICAgIGlmKCF1cmwgfHwgdXJsLmluZGV4T2YoJ2h0dHAnKSAhPT0gMCB8fCAoY29tbW9uVVJMICE9PSBcIlwiICYmIGNvbW1vblVSTCAhPT0gdXJsKSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGVsc2UgaWYoY29tbW9uVVJMID09PSBcIlwiKVxuICAgICAgICAgIGNvbW1vblVSTCA9IHVybDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbW1vblVSTDtcbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmdldEJhY2tncm91bmRJbWFnZU9ianMgPSBmdW5jdGlvbiAoZWxlcykge1xuICAgICAgaWYoIWVsZXMgfHwgZWxlcy5sZW5ndGggPCAxKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHZhciBsaXN0ID0ge307XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuICAgICAgICB2YXIgb2JqID0gZ2V0QmdPYmooZWxlKTtcbiAgICAgICAgaWYoT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPCAxKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBsaXN0W2VsZS5kYXRhKCdpZCcpXSA9IG9iajtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsaXN0O1xuXG4gICAgICBmdW5jdGlvbiBnZXRCZ09iaiAoZWxlKSB7XG4gICAgICAgIGlmKGVsZS5pc05vZGUoKSAmJiBlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShlbGUpKXtcbiAgICAgICAgICB2YXIga2V5cyA9IFsnYmFja2dyb3VuZC1pbWFnZScsICdiYWNrZ3JvdW5kLWZpdCcsICdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknLFxuICAgICAgICAgICdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnLCAnYmFja2dyb3VuZC1wb3NpdGlvbi15JywgJ2JhY2tncm91bmQtaGVpZ2h0JywgJ2JhY2tncm91bmQtd2lkdGgnXTtcblxuICAgICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgICAgICBpZiAoZWxlLmRhdGEoa2V5KSAmJiAodHlwZW9mIGVsZS5kYXRhKGtleSkgPT09IFwic3RyaW5nXCIpKSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gZWxlLmRhdGEoa2V5KS5zcGxpdChcIiBcIilbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSBlbGUuZGF0YShrZXkpO1xuICAgICAgICAgICAgfSAgICAgICAgICAgXG4gICAgICAgICAgICBvYmpba2V5XSA9IHZhbHVlO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGVsZS5pc05vZGUoKSlcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5nZXRCYWNrZ3JvdW5kRml0T3B0aW9ucyA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgICBpZighZWxlcyB8fCBlbGVzLmxlbmd0aCA8IDEpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgdmFyIGNvbW1vbkZpdCA9IFwiXCI7XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBub2RlID0gZWxlc1tpXTtcbiAgICAgICAgaWYoIW5vZGUuaXNOb2RlKCkpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHZhciBmaXQgPSBnZXRGaXRPcHRpb24obm9kZSk7XG4gICAgICAgIGlmKCFmaXQgfHwgKGNvbW1vbkZpdCAhPT0gXCJcIiAmJiBmaXQgIT09IGNvbW1vbkZpdCkpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBlbHNlIGlmKGNvbW1vbkZpdCA9PT0gXCJcIilcbiAgICAgICAgICBjb21tb25GaXQgPSBmaXQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcHRpb25zID0gJzxvcHRpb24gdmFsdWU9XCJub25lXCI+Tm9uZTwvb3B0aW9uPidcbiAgICAgICAgICAgICAgICAgICsgJzxvcHRpb24gdmFsdWU9XCJmaXRcIj5GaXQ8L29wdGlvbj4nXG4gICAgICAgICAgICAgICAgICArICc8b3B0aW9uIHZhbHVlPVwiY292ZXJcIj5Db3Zlcjwvb3B0aW9uPidcbiAgICAgICAgICAgICAgICAgICsgJzxvcHRpb24gdmFsdWU9XCJjb250YWluXCI+Q29udGFpbjwvb3B0aW9uPic7XG4gICAgICB2YXIgc2VhcmNoS2V5ID0gJ3ZhbHVlPVwiJyArIGNvbW1vbkZpdCArICdcIic7XG4gICAgICB2YXIgaW5kZXggPSBvcHRpb25zLmluZGV4T2Yoc2VhcmNoS2V5KSArIHNlYXJjaEtleS5sZW5ndGg7XG4gICAgICByZXR1cm4gb3B0aW9ucy5zdWJzdHIoMCwgaW5kZXgpICsgJyBzZWxlY3RlZCcgKyBvcHRpb25zLnN1YnN0cihpbmRleCk7XG5cbiAgICAgIGZ1bmN0aW9uIGdldEZpdE9wdGlvbihub2RlKSB7XG4gICAgICAgIGlmKCFlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShub2RlKSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGYgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0Jyk7XG4gICAgICAgIHZhciBoID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWhlaWdodCcpO1xuXG4gICAgICAgIGlmKCFmIHx8ICFoKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBmID0gZi5zcGxpdChcIiBcIik7XG4gICAgICAgIGggPSBoLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgaWYoZltmLmxlbmd0aC0xXSA9PT0gXCJub25lXCIpXG4gICAgICAgICAgcmV0dXJuIChoW2gubGVuZ3RoLTFdID09PSBcImF1dG9cIiA/IFwibm9uZVwiIDogXCJmaXRcIik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gZltmLmxlbmd0aC0xXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChub2RlcywgYmdPYmopIHtcbiAgICAgIGlmKCFub2RlcyB8fCBub2Rlcy5sZW5ndGggPT0gMCB8fCAhYmdPYmopXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIG9iaiA9IGJnT2JqW25vZGUuZGF0YSgnaWQnKV07XG4gICAgICAgIGlmKCFvYmogfHwgJC5pc0VtcHR5T2JqZWN0KG9iaikpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgdmFyIGltZ3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeFBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeVBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgd2lkdGhzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKS5zcGxpdChcIiBcIikgOiBbXTtcbiAgICAgICAgdmFyIGhlaWdodHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciBmaXRzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgb3BhY2l0aWVzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSA/IChcIlwiICsgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSkuc3BsaXQoXCIgXCIpIDogW107XG5cbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XG4gICAgICAgIGlmKHR5cGVvZiBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgICBpbmRleCA9IGltZ3MuaW5kZXhPZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSk7XG4gICAgICAgIGVsc2UgaWYoQXJyYXkuaXNBcnJheShvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSkpXG4gICAgICAgICAgaW5kZXggPSBpbWdzLmluZGV4T2Yob2JqWydiYWNrZ3JvdW5kLWltYWdlJ11bMF0pO1xuXG4gICAgICAgIGlmKGluZGV4IDwgMClcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSAmJiBpbWdzLmxlbmd0aCA+IGluZGV4KXtcbiAgICAgICAgICB2YXIgdG1wID0gaW1nc1tpbmRleF07XG4gICAgICAgICAgaW1nc1tpbmRleF0gPSBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXTtcbiAgICAgICAgICBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtZml0J10gJiYgZml0cy5sZW5ndGggPiBpbmRleCl7XG4gICAgICAgICAgdmFyIHRtcCA9IGZpdHNbaW5kZXhdO1xuICAgICAgICAgIGZpdHNbaW5kZXhdID0gb2JqWydiYWNrZ3JvdW5kLWZpdCddO1xuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC1maXQnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtd2lkdGgnXSAmJiB3aWR0aHMubGVuZ3RoID4gaW5kZXgpe1xuICAgICAgICAgIHZhciB0bXAgPSB3aWR0aHNbaW5kZXhdO1xuICAgICAgICAgIHdpZHRoc1tpbmRleF0gPSBvYmpbJ2JhY2tncm91bmQtd2lkdGgnXTtcbiAgICAgICAgICBvYmpbJ2JhY2tncm91bmQtd2lkdGgnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtaGVpZ2h0J10gJiYgaGVpZ2h0cy5sZW5ndGggPiBpbmRleCl7XG4gICAgICAgICAgdmFyIHRtcCA9IGhlaWdodHNbaW5kZXhdO1xuICAgICAgICAgIGhlaWdodHNbaW5kZXhdID0gb2JqWydiYWNrZ3JvdW5kLWhlaWdodCddO1xuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC1oZWlnaHQnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teCddICYmIHhQb3MubGVuZ3RoID4gaW5kZXgpe1xuICAgICAgICAgIHZhciB0bXAgPSB4UG9zW2luZGV4XTtcbiAgICAgICAgICB4UG9zW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1wb3NpdGlvbi14J107XG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teSddICYmIHlQb3MubGVuZ3RoID4gaW5kZXgpe1xuICAgICAgICAgIHZhciB0bXAgPSB5UG9zW2luZGV4XTtcbiAgICAgICAgICB5UG9zW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1wb3NpdGlvbi15J107XG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXknXSA9IHRtcDtcbiAgICAgICAgfVxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eSddICYmIG9wYWNpdGllcy5sZW5ndGggPiBpbmRleCl7XG4gICAgICAgICAgdmFyIHRtcCA9IG9wYWNpdGllc1tpbmRleF07XG4gICAgICAgICAgb3BhY2l0aWVzW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5J107XG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknXSA9IHRtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScsIGltZ3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcsIHhQb3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScsIHlQb3Muam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnLCB3aWR0aHMuam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JywgaGVpZ2h0cy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1maXQnLCBmaXRzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknLCBvcGFjaXRpZXMuam9pbihcIiBcIikpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYmdPYmo7XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAobm9kZXMsIG9sZEltZywgbmV3SW1nLCBmaXJzdFRpbWUsIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpIHtcbiAgICAgIGlmKCFub2RlcyB8fCBub2Rlcy5sZW5ndGggPT0gMCB8fCAhb2xkSW1nIHx8ICFuZXdJbWcpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIG9sZEltZyk7XG4gICAgICBmb3IodmFyIGtleSBpbiBuZXdJbWcpe1xuICAgICAgICBuZXdJbWdba2V5XVsnZmlyc3RUaW1lJ10gPSBmaXJzdFRpbWU7XG4gICAgICB9XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEJhY2tncm91bmRJbWFnZShub2RlcywgbmV3SW1nLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBvbGRJbWc6IG5ld0ltZyxcbiAgICAgICAgbmV3SW1nOiBvbGRJbWcsXG4gICAgICAgIGZpcnN0VGltZTogZmFsc2UsXG4gICAgICAgIHByb21wdEludmFsaWRJbWFnZTogcHJvbXB0SW52YWxpZEltYWdlLFxuICAgICAgICB2YWxpZGF0ZVVSTDogdmFsaWRhdGVVUkxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQWRkIGEgYmFja2dyb3VuZCBpbWFnZSB0byBnaXZlbiBub2Rlcy5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChub2RlcywgYmdPYmosIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpIHtcbiAgICAgIGlmKCFub2RlcyB8fCBub2Rlcy5sZW5ndGggPT0gMCB8fCAhYmdPYmopXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIG9iaiA9IGJnT2JqW25vZGUuZGF0YSgnaWQnKV07XG4gICAgICAgIGlmKCFvYmogfHwgJC5pc0VtcHR5T2JqZWN0KG9iaikpXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgLy8gTG9hZCB0aGUgaW1hZ2UgZnJvbSBsb2NhbCwgZWxzZSBqdXN0IHB1dCB0aGUgVVJMXG4gICAgICAgIGlmKG9ialsnZnJvbUZpbGUnXSlcbiAgICAgICAgbG9hZEJhY2tncm91bmRUaGVuQXBwbHkobm9kZSwgb2JqKTtcbiAgICAgICAgLy8gVmFsaWRpdHkgb2YgZ2l2ZW4gVVJMIHNob3VsZCBiZSBjaGVja2VkIGJlZm9yZSBhcHBseWluZyBpdFxuICAgICAgICBlbHNlIGlmKG9ialsnZmlyc3RUaW1lJ10pe1xuICAgICAgICAgIGlmKHR5cGVvZiB2YWxpZGF0ZVVSTCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIHZhbGlkYXRlVVJMKG5vZGUsIG9iaiwgYXBwbHlCYWNrZ3JvdW5kLCBwcm9tcHRJbnZhbGlkSW1hZ2UpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNoZWNrR2l2ZW5VUkwobm9kZSwgb2JqKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXBwbHlCYWNrZ3JvdW5kKG5vZGUsIG9iaik7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGxvYWRCYWNrZ3JvdW5kVGhlbkFwcGx5KG5vZGUsIGJnT2JqKSB7XG4gICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICB2YXIgaW1nRmlsZSA9IGJnT2JqWydiYWNrZ3JvdW5kLWltYWdlJ107XG5cbiAgICAgICAgLy8gQ2hlY2sgd2hldGhlciBnaXZlbiBmaWxlIGlzIGFuIGltYWdlIGZpbGVcbiAgICAgICAgaWYoaW1nRmlsZS50eXBlLmluZGV4T2YoXCJpbWFnZVwiKSAhPT0gMCl7XG4gICAgICAgICAgaWYocHJvbXB0SW52YWxpZEltYWdlKVxuICAgICAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlKFwiSW52YWxpZCBpbWFnZSBmaWxlIGlzIGdpdmVuIVwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbWdGaWxlKTtcblxuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgaW1nID0gcmVhZGVyLnJlc3VsdDtcbiAgICAgICAgICBpZihpbWcpe1xuICAgICAgICAgICAgYmdPYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSA9IGltZztcbiAgICAgICAgICAgIGJnT2JqWydmcm9tRmlsZSddID0gZmFsc2U7XG4gICAgICAgICAgICBhcHBseUJhY2tncm91bmQobm9kZSwgYmdPYmopO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgaWYocHJvbXB0SW52YWxpZEltYWdlKVxuICAgICAgICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2UoXCJHaXZlbiBmaWxlIGNvdWxkIG5vdCBiZSByZWFkIVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNoZWNrR2l2ZW5VUkwobm9kZSwgYmdPYmope1xuICAgICAgICB2YXIgdXJsID0gYmdPYmpbJ2JhY2tncm91bmQtaW1hZ2UnXTtcbiAgICAgICAgdmFyIGV4dGVuc2lvbiA9ICh1cmwuc3BsaXQoL1s/I10vKVswXSkuc3BsaXQoXCIuXCIpLnBvcCgpO1xuICAgICAgICB2YXIgdmFsaWRFeHRlbnNpb25zID0gW1wicG5nXCIsIFwic3ZnXCIsIFwianBnXCIsIFwianBlZ1wiXTtcblxuICAgICAgICBpZighdmFsaWRFeHRlbnNpb25zLmluY2x1ZGVzKGV4dGVuc2lvbikpe1xuICAgICAgICAgIGlmKHR5cGVvZiBwcm9tcHRJbnZhbGlkSW1hZ2UgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2UoXCJJbnZhbGlkIFVSTCBpcyBnaXZlbiFcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXN1bHQsIHN0YXR1cywgeGhyKXtcbiAgICAgICAgICAgIGFwcGx5QmFja2dyb3VuZChub2RlLCBiZ09iaik7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycm9yKXtcbiAgICAgICAgICAgIGlmKHByb21wdEludmFsaWRJbWFnZSlcbiAgICAgICAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlKFwiSW52YWxpZCBVUkwgaXMgZ2l2ZW4hXCIpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhcHBseUJhY2tncm91bmQobm9kZSwgYmdPYmopIHtcblxuICAgICAgICBpZihlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShub2RlKSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGltZ3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeFBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeVBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgd2lkdGhzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKS5zcGxpdChcIiBcIikgOiBbXTtcbiAgICAgICAgdmFyIGhlaWdodHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciBmaXRzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgb3BhY2l0aWVzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSA/IChcIlwiICsgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSkuc3BsaXQoXCIgXCIpIDogW107XG5cbiAgICAgICAgdmFyIGluZGV4VG9JbnNlcnQgPSBpbWdzLmxlbmd0aDtcblxuICAgICAgICAvLyBpbnNlcnQgdG8gbGVuZ3RoLTFcbiAgICAgICAgaWYoZWxlbWVudFV0aWxpdGllcy5oYXNDbG9uZU1hcmtlcihpbWdzKSl7XG4gICAgICAgICAgaW5kZXhUb0luc2VydC0tO1xuICAgICAgICB9XG5cbiAgICAgICAgaW1ncy5zcGxpY2UoaW5kZXhUb0luc2VydCwgMCwgYmdPYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSk7XG4gICAgICAgIGZpdHMuc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLWZpdCddKTtcbiAgICAgICAgb3BhY2l0aWVzLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5J10pO1xuICAgICAgICB4UG9zLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1wb3NpdGlvbi14J10pO1xuICAgICAgICB5UG9zLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1wb3NpdGlvbi15J10pO1xuICAgICAgICB3aWR0aHMuc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLXdpZHRoJ10pO1xuICAgICAgICBoZWlnaHRzLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1oZWlnaHQnXSk7XG5cbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJywgaW1ncy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JywgeFBvcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JywgeVBvcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcsIHdpZHRocy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnLCBoZWlnaHRzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcsIGZpdHMuam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScsIG9wYWNpdGllcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIGJnT2JqWydmaXJzdFRpbWUnXSA9IGZhbHNlO1xuXG4gICAgICAgIGlmKHVwZGF0ZUluZm8pXG4gICAgICAgICAgdXBkYXRlSW5mbygpO1xuXG4gICAgICB9XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuaGFzQ2xvbmVNYXJrZXIgPSBmdW5jdGlvbiAoaW1ncykge1xuICAgICAgdmFyIGNsb25lSW1nID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LCUzQ3N2ZyUyMHdpZHRoJTNEJTIyMTAwJTIyJTIwaGVpZ2h0JTNEJTIyMTAwJTIyJTIwdmlld0JveCUzRCUyMjAlMjAwJTIwMTAwJTIwMTAwJTIyJTIwc3R5bGUlM0QlMjJmaWxsJTNBbm9uZSUzQnN0cm9rZSUzQWJsYWNrJTNCc3Ryb2tlLXdpZHRoJTNBMCUzQiUyMiUyMHhtbG5zJTNEJTIyaHR0cCUzQS8vd3d3LnczLm9yZy8yMDAwL3N2ZyUyMiUyMCUzRSUzQ3JlY3QlMjB4JTNEJTIyMCUyMiUyMHklM0QlMjIwJTIyJTIwd2lkdGglM0QlMjIxMDAlMjIlMjBoZWlnaHQlM0QlMjIxMDAlMjIlMjBzdHlsZSUzRCUyMmZpbGwlM0ElMjM4MzgzODMlMjIvJTNFJTIwJTNDL3N2ZyUzRSc7XG4gICAgICByZXR1cm4gKGltZ3MuaW5kZXhPZihjbG9uZUltZykgPiAtMSk7XG4gICAgfTtcblxuICAgIC8vIFJlbW92ZSBhIGJhY2tncm91bmQgaW1hZ2UgZnJvbSBnaXZlbiBub2Rlcy5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChub2RlcywgYmdPYmopIHtcbiAgICAgIGlmKCFub2RlcyB8fCBub2Rlcy5sZW5ndGggPT0gMCB8fCAhYmdPYmopXG4gICAgICAgIHJldHVybjtcblxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIG9iaiA9IGJnT2JqW25vZGUuZGF0YSgnaWQnKV07XG4gICAgICAgIGlmKCFvYmopXG4gICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgdmFyIGltZ3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeFBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgeVBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgd2lkdGhzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKS5zcGxpdChcIiBcIikgOiBbXTtcbiAgICAgICAgdmFyIGhlaWdodHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciBmaXRzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgb3BhY2l0aWVzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSA/IChcIlwiICsgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSkuc3BsaXQoXCIgXCIpIDogW107XG5cbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XG4gICAgICAgIGlmKHR5cGVvZiBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgICBpbmRleCA9IGltZ3MuaW5kZXhPZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXS5zcGxpdChcIiBcIilbMF0pO1xuICAgICAgICBlbHNlIGlmKEFycmF5LmlzQXJyYXkob2JqWydiYWNrZ3JvdW5kLWltYWdlJ10pKVxuICAgICAgICAgIGluZGV4ID0gaW1ncy5pbmRleE9mKG9ialsnYmFja2dyb3VuZC1pbWFnZSddWzBdKTtcblxuICAgICAgICBpZihpbmRleCA+IC0xKXtcbiAgICAgICAgICBpbWdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgZml0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIG9wYWNpdGllcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIHhQb3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICB5UG9zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgd2lkdGhzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgaGVpZ2h0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJywgaW1ncy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JywgeFBvcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JywgeVBvcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcsIHdpZHRocy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnLCBoZWlnaHRzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcsIGZpdHMuam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScsIG9wYWNpdGllcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIGJnT2JqWydmaXJzdFRpbWUnXSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnJldmVyc2VFZGdlID0gZnVuY3Rpb24oZWRnZSl7XG4gICAgICB2YXIgb2xkU291cmNlID0gZWRnZS5zb3VyY2UoKS5pZCgpO1xuICAgICAgdmFyIG9sZFRhcmdldCA9IGVkZ2UudGFyZ2V0KCkuaWQoKTtcbiAgICAgIHZhciBvbGRQb3J0U291cmNlID0gZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiKTtcbiAgICAgIHZhciBvbGRQb3J0VGFyZ2V0ID0gZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiKTtcbiAgICAgIHZhciBzZWdtZW50UG9pbnRzID0gZWRnZS5zZWdtZW50UG9pbnRzKCk7XG4gICAgICB2YXIgY29udHJvbFBvaW50cyA9IGVkZ2UuY29udHJvbFBvaW50cygpO1xuXG4gICAgICBlZGdlLmRhdGEoKS5zb3VyY2UgPSBvbGRUYXJnZXQ7XG4gICAgICBlZGdlLmRhdGEoKS50YXJnZXQgPSBvbGRTb3VyY2U7XG4gICAgICBlZGdlLmRhdGEoKS5wb3J0c291cmNlID0gb2xkUG9ydFRhcmdldDtcbiAgICAgIGVkZ2UuZGF0YSgpLnBvcnR0YXJnZXQgPSBvbGRQb3J0U291cmNlO1xuICAgICAgIGVkZ2UgPSBlZGdlLm1vdmUoe1xuICAgICAgICAgdGFyZ2V0OiBvbGRTb3VyY2UsXG4gICAgICAgICBzb3VyY2UgOiBvbGRUYXJnZXQgICAgICAgIFxuICAgICAgfSk7XG5cbiAgICAgIGlmKEFycmF5LmlzQXJyYXkoc2VnbWVudFBvaW50cykpe1xuICAgICAgICBzZWdtZW50UG9pbnRzLnJldmVyc2UoKTtcbiAgICAgICAgZWRnZS5kYXRhKCkuYmVuZFBvaW50UG9zaXRpb25zID0gc2VnbWVudFBvaW50cztcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShjb250cm9sUG9pbnRzKSkge1xuICAgICAgICAgIGNvbnRyb2xQb2ludHMucmV2ZXJzZSgpO1xuICAgICAgICAgIGVkZ2UuZGF0YSgpLmNvbnRyb2xQb2ludFBvc2l0aW9ucyA9IGNvbnRyb2xQb2ludHM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVkZ2VFZGl0aW5nID0gY3kuZWRnZUVkaXRpbmcoJ2dldCcpO1xuICAgICAgICBlZGdlRWRpdGluZy5pbml0QW5jaG9yUG9pbnRzKGVkZ2UpO1xuICAgICAgfVxuICAgIFxuXG4gICAgICByZXR1cm4gZWRnZTtcbiAgICB9XG5cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50VXRpbGl0aWVzRXh0ZW5kZXI7XG59O1xuIiwiLyogXG4gKiBVdGlsaXR5IGZpbGUgdG8gZ2V0IGFuZCBzZXQgdGhlIGxpYnJhcmllcyB0byB3aGljaCBzYmdudml6IGlzIGRlcGVuZGVudCBmcm9tIGFueSBmaWxlLlxuICovXG5cbnZhciBsaWJVdGlsaXRpZXMgPSBmdW5jdGlvbigpe1xufTtcblxubGliVXRpbGl0aWVzLnNldExpYnMgPSBmdW5jdGlvbihsaWJzKSB7XG4gIHRoaXMubGlicyA9IGxpYnM7XG59O1xuXG5saWJVdGlsaXRpZXMuZ2V0TGlicyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5saWJzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBsaWJVdGlsaXRpZXM7IiwidmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG5cbi8qXG4gKiBUaGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBkaXJlY3RseS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGVsZW1lbnRVdGlsaXRpZXMsIG9wdGlvbnMsIGN5LCBzYmdudml6SW5zdGFuY2U7XG5cbiAgZnVuY3Rpb24gbWFpblV0aWxpdGllcyAocGFyYW0pIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzID0gcGFyYW0uZWxlbWVudFV0aWxpdGllcztcbiAgICBvcHRpb25zID0gcGFyYW0ub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbiAgICBjeSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRDeSgpO1xuICAgIHNiZ252aXpJbnN0YW5jZSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRJbnN0YW5jZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIEFkZHMgYSBuZXcgbm9kZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5hZGROb2RlID0gZnVuY3Rpb24oeCwgeSAsIG5vZGVQYXJhbXMsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIG1hcCB0eXBlXG4gICAgaWYgKHR5cGVvZiBub2RlUGFyYW1zID09ICdvYmplY3QnKXtcbi8qIFxuICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSlcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKG5vZGVQYXJhbXMubGFuZ3VhZ2UpO1xuICAgICAgZWxzZSBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgIT0gbm9kZVBhcmFtcy5sYW5ndWFnZSlcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiVW5rbm93blwiKTsgKi9cbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgbm9kZVBhcmFtcywgaWQsIHBhcmVudCwgdmlzaWJpbGl0eSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBuZXdOb2RlIDoge1xuICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgeTogeSxcbiAgICAgICAgICBjbGFzczogbm9kZVBhcmFtcyxcbiAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgcGFyZW50OiBwYXJlbnQsXG4gICAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJpbGl0eVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkTm9kZVwiLCBwYXJhbSk7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIEFkZHMgYSBuZXcgZWRnZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgaGF2aW5nIHRoZSBnaXZlbiBzb3VyY2UgYW5kIHRhcmdldCBpZHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbihzb3VyY2UsIHRhcmdldCwgZWRnZVBhcmFtcywgaW52YWxpZEVkZ2VDYWxsYmFjaywgaWQsIHZpc2liaWxpdHkpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIG1hcCB0eXBlXG4gICAgaWYgKHR5cGVvZiBlZGdlUGFyYW1zID09ICdvYmplY3QnKXtcblxuICAgICAvKiAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSlcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKGVkZ2VQYXJhbXMubGFuZ3VhZ2UpO1xuICAgICAgZWxzZSBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgIT0gZWRnZVBhcmFtcy5sYW5ndWFnZSlcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiSHlicmlkQW55XCIpOyAqL1xuICAgIH1cbiAgICAvLyBHZXQgdGhlIHZhbGlkYXRpb24gcmVzdWx0XG4gICAgdmFyIGVkZ2VjbGFzcyA9IGVkZ2VQYXJhbXMuY2xhc3MgPyBlZGdlUGFyYW1zLmNsYXNzIDogZWRnZVBhcmFtcztcbiAgICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChzb3VyY2UpLCBjeS5nZXRFbGVtZW50QnlJZCh0YXJnZXQpKTtcblxuICAgIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdpbnZhbGlkJyBjYW5jZWwgdGhlIG9wZXJhdGlvblxuICAgIGlmICh2YWxpZGF0aW9uID09PSAnaW52YWxpZCcpIHtcbiAgICAgIGlmKHR5cGVvZiBpbnZhbGlkRWRnZUNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpe1xuICAgICAgICBpbnZhbGlkRWRnZUNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ3JldmVyc2UnIHJldmVyc2UgdGhlIHNvdXJjZS10YXJnZXQgcGFpciBiZWZvcmUgY3JlYXRpbmcgdGhlIGVkZ2VcbiAgICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XG4gICAgICB2YXIgdGVtcCA9IHNvdXJjZTtcbiAgICAgIHNvdXJjZSA9IHRhcmdldDtcbiAgICAgIHRhcmdldCA9IHRlbXA7XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZSwgdGFyZ2V0LCBlZGdlUGFyYW1zLCBpZCwgdmlzaWJpbGl0eSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBuZXdFZGdlIDoge1xuICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgIGNsYXNzOiBlZGdlUGFyYW1zLFxuICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmlsaXR5XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciByZXN1bHQgPSBjeS51bmRvUmVkbygpLmRvKFwiYWRkRWRnZVwiLCBwYXJhbSk7XG4gICAgICByZXR1cm4gcmVzdWx0LmVsZXM7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIEFkZHMgYSBwcm9jZXNzIHdpdGggY29udmVuaWVudCBlZGdlcy4gRm9yIG1vcmUgaW5mb3JtYXRpb24gcGxlYXNlIHNlZSAnaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9uZXd0L2lzc3Vlcy85Jy5cbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMgPSBmdW5jdGlvbihfc291cmNlLCBfdGFyZ2V0LCBwcm9jZXNzVHlwZSkge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBzb3VyY2UgYW5kIHRhcmdldCBJRHMgYXJlIGdpdmVuIGdldCB0aGUgZWxlbWVudHMgYnkgSURzXG4gICAgdmFyIHNvdXJjZSA9IHR5cGVvZiBfc291cmNlID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9zb3VyY2UpIDogX3NvdXJjZTtcbiAgICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xuXG4gICAgLy8gSWYgc291cmNlIG9yIHRhcmdldCBkb2VzIG5vdCBoYXZlIGFuIEVQTiBjbGFzcyB0aGUgb3BlcmF0aW9uIGlzIG5vdCB2YWxpZFxuICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKHNvdXJjZSkgfHwgIWVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyh0YXJnZXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyhfc291cmNlLCBfdGFyZ2V0LCBwcm9jZXNzVHlwZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBzb3VyY2U6IF9zb3VyY2UsXG4gICAgICAgIHRhcmdldDogX3RhcmdldCxcbiAgICAgICAgcHJvY2Vzc1R5cGU6IHByb2Nlc3NUeXBlXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXNcIiwgcGFyYW0pO1xuICAgIH1cbiAgfTtcblxuICAvLyBjb252ZXJ0IGNvbGxhcHNlZCBjb21wb3VuZCBub2RlcyB0byBzaW1wbGUgbm9kZXNcbiAgLy8gYW5kIHVwZGF0ZSBwb3J0IHZhbHVlcyBvZiBwYXN0ZWQgbm9kZXMgYW5kIGVkZ2VzXG4gIHZhciBjbG9uZUNvbGxhcHNlZE5vZGVzQW5kUG9ydHMgPSBmdW5jdGlvbiAoZWxlc0JlZm9yZSl7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICB2YXIgZWxlc0FmdGVyID0gY3kuZWxlbWVudHMoKTtcbiAgICB2YXIgZWxlc0RpZmYgPSBlbGVzQWZ0ZXIuZGlmZihlbGVzQmVmb3JlKS5sZWZ0O1xuXG4gICAgLy8gc2hhbGxvdyBjb3B5IGNvbGxhcHNlZCBub2RlcyAtIGNvbGxhcHNlZCBjb21wb3VuZHMgYmVjb21lIHNpbXBsZSBub2Rlc1xuICAgIC8vIGRhdGEgcmVsYXRlZCB0byBjb2xsYXBzZWQgbm9kZXMgYXJlIHJlbW92ZWQgZnJvbSBnZW5lcmF0ZWQgY2xvbmVzXG4gICAgLy8gcmVsYXRlZCBpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9uZXd0L2lzc3Vlcy8xNDVcbiAgICB2YXIgY29sbGFwc2VkTm9kZXMgPSBlbGVzRGlmZi5maWx0ZXIoJ25vZGUuY3ktZXhwYW5kLWNvbGxhcHNlLWNvbGxhcHNlZC1ub2RlJyk7XG5cbiAgICBjb2xsYXBzZWROb2Rlcy5jb25uZWN0ZWRFZGdlcygpLnJlbW92ZSgpO1xuICAgIGNvbGxhcHNlZE5vZGVzLnJlbW92ZUNsYXNzKCdjeS1leHBhbmQtY29sbGFwc2UtY29sbGFwc2VkLW5vZGUnKTtcbiAgICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVEYXRhKCdjb2xsYXBzZWRDaGlsZHJlbicpO1xuICAgIGNvbGxhcHNlZE5vZGVzLnJlbW92ZURhdGEoJ3Bvc2l0aW9uLWJlZm9yZS1jb2xsYXBzZSBzaXplLWJlZm9yZS1jb2xsYXBzZScpO1xuICAgIGNvbGxhcHNlZE5vZGVzLnJlbW92ZURhdGEoJ2V4cGFuZGNvbGxhcHNlUmVuZGVyZWRDdWVTaXplIGV4cGFuZGNvbGxhcHNlUmVuZGVyZWRTdGFydFggZXhwYW5kY29sbGFwc2VSZW5kZXJlZFN0YXJ0WScpO1xuXG4gICAgLy8gY2xvbmluZyBwb3J0c1xuICAgIGVsZXNEaWZmLm5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbihfbm9kZSl7XG4gICAgICBpZihfbm9kZS5kYXRhKFwicG9ydHNcIikubGVuZ3RoID09IDIpe1xuICAgICAgICAgIHZhciBvbGRQb3J0TmFtZTAgPSBfbm9kZS5kYXRhKFwicG9ydHNcIilbMF0uaWQ7XG4gICAgICAgICAgdmFyIG9sZFBvcnROYW1lMSA9IF9ub2RlLmRhdGEoXCJwb3J0c1wiKVsxXS5pZDtcbiAgICAgICAgICBfbm9kZS5kYXRhKFwicG9ydHNcIilbMF0uaWQgPSBfbm9kZS5pZCgpICsgXCIuMVwiO1xuICAgICAgICAgIF9ub2RlLmRhdGEoXCJwb3J0c1wiKVsxXS5pZCA9IF9ub2RlLmlkKCkgKyBcIi4yXCI7XG5cbiAgICAgICAgICBfbm9kZS5vdXRnb2VycygpLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbihfZWRnZSl7XG4gICAgICAgICAgICBpZihfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiKSA9PSBvbGRQb3J0TmFtZTApe1xuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiLCBfbm9kZS5kYXRhKFwicG9ydHNcIilbMF0uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiKSA9PSBvbGRQb3J0TmFtZTEpe1xuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiLCBfbm9kZS5kYXRhKFwicG9ydHNcIilbMV0uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIiwgX25vZGUuaWQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgX25vZGUuaW5jb21lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xuICAgICAgICAgICAgaWYoX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIikgPT0gb2xkUG9ydE5hbWUwKXtcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIiwgX25vZGUuZGF0YShcInBvcnRzXCIpWzBdLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIikgPT0gb2xkUG9ydE5hbWUxKXtcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIiwgX25vZGUuZGF0YShcInBvcnRzXCIpWzFdLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIF9ub2RlLmlkKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgX25vZGUub3V0Z29lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xuICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIsIF9ub2RlLmlkKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgX25vZGUuaW5jb21lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xuICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIF9ub2RlLmlkKCkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBlbGVzRGlmZi5zZWxlY3QoKTtcbiAgfVxuXG4gIC8qXG4gICAqIENsb25lIGdpdmVuIGVsZW1lbnRzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY2xvbmVFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVzLCBwYXN0ZUF0TW91c2VMb2MpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb3B5RWxlbWVudHMoZWxlcyk7XG5cbiAgICB0aGlzLnBhc3RlRWxlbWVudHMocGFzdGVBdE1vdXNlTG9jKTtcbiAgfTtcblxuICAvKlxuICAgKiBDb3B5IGdpdmVuIGVsZW1lbnRzIHRvIGNsaXBib2FyZC4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNvcHlFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgY3kuY2xpcGJvYXJkKCkuY29weShlbGVzKTtcbiAgfTtcblxuICAvKlxuICAgKiBQYXN0ZSB0aGUgZWxlbWVudHMgY29waWVkIHRvIGNsaXBib2FyZC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLnBhc3RlRWxlbWVudHMgPSBmdW5jdGlvbihwYXN0ZUF0TW91c2VMb2MpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGVsZXNCZWZvcmUgPSBjeS5lbGVtZW50cygpO1xuXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJwYXN0ZVwiLHtwYXN0ZUF0TW91c2VMb2M6IHBhc3RlQXRNb3VzZUxvY30pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGN5LmNsaXBib2FyZCgpLnBhc3RlKCk7XG4gICAgfVxuICAgIGNsb25lQ29sbGFwc2VkTm9kZXNBbmRQb3J0cyhlbGVzQmVmb3JlKTtcbiAgICBjeS5ub2RlcyhcIjpzZWxlY3RlZFwiKS5lbWl0KCdkYXRhJyk7XG4gIH07XG5cbiAgLypcbiAgICogQWxpZ25zIGdpdmVuIG5vZGVzIGluIGdpdmVuIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIG9yZGVyLlxuICAgKiBIb3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBwYXJhbWV0ZXJzIG1heSBiZSAnbm9uZScgb3IgdW5kZWZpbmVkLlxuICAgKiBhbGlnblRvIHBhcmFtZXRlciBpbmRpY2F0ZXMgdGhlIGxlYWRpbmcgbm9kZS5cbiAgICogUmVxdXJpcmVzIGN5dG9zY2FwZS1ncmlkLWd1aWRlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuYWxpZ24gPSBmdW5jdGlvbiAobm9kZXMsIGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWxpZ25cIiwge1xuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGhvcml6b250YWw6IGhvcml6b250YWwsXG4gICAgICAgIHZlcnRpY2FsOiB2ZXJ0aWNhbCxcbiAgICAgICAgYWxpZ25UbzogYWxpZ25Ub1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGVzLmFsaWduKGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKTtcbiAgICB9XG5cbiAgICBpZihjeS5lZGdlcyhcIjpzZWxlY3RlZFwiKS5sZW5ndGggPT0gMSApIHtcbiAgICAgIGN5LmVkZ2VzKCkudW5zZWxlY3QoKTsgICAgICBcbiAgICB9XG4gICAgXG4gIH07XG5cbiAgLypcbiAgICogQ3JlYXRlIGNvbXBvdW5kIGZvciBnaXZlbiBub2Rlcy4gY29tcG91bmRUeXBlIG1heSBiZSAnY29tcGxleCcgb3IgJ2NvbXBhcnRtZW50Jy5cbiAgICogVGhpcyBtZXRob2QgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKF9ub2RlcywgY29tcG91bmRUeXBlKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBub2RlcyA9IF9ub2RlcztcbiAgICAvKlxuICAgICAqIEVsZW1pbmF0ZSB0aGUgbm9kZXMgd2hpY2ggY2Fubm90IGhhdmUgYSBwYXJlbnQgd2l0aCBnaXZlbiBjb21wb3VuZCB0eXBlXG4gICAgICovXG4gICAgbm9kZXMgPSBfbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgICBpZih0eXBlb2YgZWxlbWVudCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBlbGVtZW50ID0gaTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNiZ25jbGFzcyA9IGVsZW1lbnQuZGF0YShcImNsYXNzXCIpO1xuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIGNvbXBvdW5kVHlwZSwgZWxlbWVudCk7XG4gICAgfSk7XG5cbiAgICBub2RlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcblxuICAgIC8vIEFsbCBlbGVtZW50cyBzaG91bGQgaGF2ZSB0aGUgc2FtZSBwYXJlbnQgYW5kIHRoZSBjb21tb24gcGFyZW50IHNob3VsZCBub3QgYmUgYSAnY29tcGxleCdcbiAgICAvLyBpZiBjb21wb3VuZFR5cGUgaXMgJ2NvbXBhcnRlbnQnXG4gICAgLy8gYmVjYXVzZSB0aGUgb2xkIGNvbW1vbiBwYXJlbnQgd2lsbCBiZSB0aGUgcGFyZW50IG9mIHRoZSBuZXcgY29tcGFydG1lbnQgYWZ0ZXIgdGhpcyBvcGVyYXRpb24gYW5kXG4gICAgLy8gJ2NvbXBsZXhlcycgY2Fubm90IGluY2x1ZGUgJ2NvbXBhcnRtZW50cydcbiAgICBpZiAobm9kZXMubGVuZ3RoID09IDAgfHwgIWVsZW1lbnRVdGlsaXRpZXMuYWxsSGF2ZVRoZVNhbWVQYXJlbnQobm9kZXMpXG4gICAgICAgICAgICB8fCAoIChjb21wb3VuZFR5cGUgPT09ICdjb21wYXJ0bWVudCcgfHwgY29tcG91bmRUeXBlID09ICdzdWJtYXAnKSAmJiBub2Rlcy5wYXJlbnQoKS5kYXRhKCdjbGFzcycpXG4gICAgICAgICAgICAmJiBub2Rlcy5wYXJlbnQoKS5kYXRhKCdjbGFzcycpLnN0YXJ0c1dpdGgoJ2NvbXBsZXgnKSApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGN5LnVuZG9SZWRvKCkpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgY29tcG91bmRUeXBlOiBjb21wb3VuZFR5cGUsXG4gICAgICAgIG5vZGVzVG9NYWtlQ29tcG91bmQ6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2RlcywgY29tcG91bmRUeXBlKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24gYW5kIGNoZWNrcyBpZiB0aGUgb3BlcmF0aW9uIGlzIHZhbGlkLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgX25ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXdQYXJlbnQgPSB0eXBlb2YgX25ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfbmV3UGFyZW50KSA6IF9uZXdQYXJlbnQ7XG4gICAgLy8gTmV3IHBhcmVudCBpcyBzdXBwb3NlZCB0byBiZSBvbmUgb2YgdGhlIHJvb3QsIGEgY29tcGxleCBvciBhIGNvbXBhcnRtZW50XG4gICAgaWYgKG5ld1BhcmVudCAmJiAhbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKS5zdGFydHNXaXRoKFwiY29tcGxleFwiKSAmJiBuZXdQYXJlbnQuZGF0YShcImNsYXNzXCIpICE9IFwiY29tcGFydG1lbnRcIlxuICAgICAgICAgICAgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcInN1Ym1hcFwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8qXG4gICAgICogRWxlbWluYXRlIHRoZSBub2RlcyB3aGljaCBjYW5ub3QgaGF2ZSB0aGUgbmV3UGFyZW50IGFzIHRoZWlyIHBhcmVudFxuICAgICAqL1xuICAgIG5vZGVzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgICBpZih0eXBlb2YgZWxlbWVudCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBlbGVtZW50ID0gaTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNiZ25jbGFzcyA9IGVsZW1lbnQuZGF0YShcImNsYXNzXCIpO1xuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIG5ld1BhcmVudCwgZWxlbWVudCk7XG4gICAgfSk7XG5cbiAgICAvLyBEaXNjYXJkIHRoZSBub2RlcyB3aG9zZSBwYXJlbnQgaXMgYWxyZWFkeSBuZXdQYXJlbnQuXG4gICAgLy8gRGlzY2FyZCB0aGUgbmV3UGFyZW50IGl0c2VsZiBpZiBpdCBpcyBhbW9uZyB0aGUgbm9kZXNcbiAgICBub2RlcyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlLCBpKSB7XG4gICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGVsZSA9IGk7XG4gICAgICB9XG5cbiAgICAgIC8vIERpc2NhcmQgdGhlIG5ld1BhcmVudCBpZiBpdCBpcyBhbW9uZyB0aGUgbm9kZXNcbiAgICAgIGlmIChuZXdQYXJlbnQgJiYgZWxlLmlkKCkgPT09IG5ld1BhcmVudC5pZCgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIERpc2NhcmQgdGhlIG5vZGVzIHdob3NlIHBhcmVudCBpcyBhbHJlYWR5IG5ld1BhcmVudFxuICAgICAgaWYgKCFuZXdQYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPSBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPT0gbmV3UGFyZW50LmlkKCk7XG4gICAgfSk7XG5cbiAgICAvLyBJZiBzb21lIG5vZGVzIGFyZSBhbmNlc3RvciBvZiBuZXcgcGFyZW50IGVsZW1pbmF0ZSB0aGVtXG4gICAgaWYgKG5ld1BhcmVudCkge1xuICAgICAgbm9kZXMgPSBub2Rlcy5kaWZmZXJlbmNlKG5ld1BhcmVudC5hbmNlc3RvcnMoKSk7XG4gICAgfVxuXG4gICAgLy8gSWYgYWxsIG5vZGVzIGFyZSBlbGVtaW5hdGVkIHJldHVybiBkaXJlY3RseVxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBKdXN0IG1vdmUgdGhlIHRvcCBtb3N0IG5vZGVzXG4gICAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XG5cbiAgICB2YXIgcGFyZW50SWQgPSBuZXdQYXJlbnQgPyBuZXdQYXJlbnQuaWQoKSA6IG51bGw7XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBmaXJzdFRpbWU6IHRydWUsXG4gICAgICAgIHBhcmVudERhdGE6IHBhcmVudElkLCAvLyBJdCBrZWVwcyB0aGUgbmV3UGFyZW50SWQgKEp1c3QgYW4gaWQgZm9yIGVhY2ggbm9kZXMgZm9yIHRoZSBmaXJzdCB0aW1lKVxuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIHBvc0RpZmZYOiBwb3NEaWZmWCxcbiAgICAgICAgcG9zRGlmZlk6IHBvc0RpZmZZLFxuICAgICAgICAvLyBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBjaGFuZ2VQYXJlbnQgZnVuY3Rpb24gY2FsbGVkIGlzIG5vdCBmcm9tIGVsZW1lbnRVdGlsaXRpZXNcbiAgICAgICAgLy8gYnV0IGZyb20gdGhlIHVuZG9SZWRvIGV4dGVuc2lvbiBkaXJlY3RseSwgc28gbWFpbnRhaW5pbmcgcG9pbnRlciBpcyBub3QgYXV0b21hdGljYWxseSBkb25lLlxuICAgICAgICBjYWxsYmFjazogZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXJcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VQYXJlbnRcIiwgcGFyYW0pOyAvLyBUaGlzIGFjdGlvbiBpcyByZWdpc3RlcmVkIGJ5IHVuZG9SZWRvIGV4dGVuc2lvblxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50KG5vZGVzLCBwYXJlbnRJZCwgcG9zRGlmZlgsIHBvc0RpZmZZKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogQ3JlYXRlcyBhbiBhY3RpdmF0aW9uIHJlYWN0aW9uIHdpdGggZ2l2ZW4gcGFyYW1ldGVycy4gUmVxdWlyZXMgY29zZS1iaWxrZW50IGxheW91dCB0byB0aWxlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzIGluY2x1ZGVkXG4gICAqIGluIHRoZSBjb21wbGV4LiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgdGhlIHNhbWUgZnVuY3Rpb24gaW4gZWxlbWVudFV0aWxpdGllc1xuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jcmVhdGVUcmFuc2xhdGlvblJlYWN0aW9uID0gZnVuY3Rpb24gKG1SbmFOYW1lLCBwcm90ZWluTmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCBlZGdlTGVuZ3RoKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUcmFuc2xhdGlvblJlYWN0aW9uKG1SbmFOYW1lLCBwcm90ZWluTmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCBlZGdlTGVuZ3RoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG1SbmFOYW1lOiBtUm5hTmFtZSxcbiAgICAgICAgcHJvdGVpbk5hbWU6IHByb3RlaW5OYW1lLFxuICAgICAgICBwcm9jZXNzUG9zaXRpb246IHByb2Nlc3NQb3NpdGlvbixcbiAgICAgICAgZWRnZUxlbmd0aDogZWRnZUxlbmd0aFxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZVRyYW5zbGF0aW9uUmVhY3Rpb25cIiwgcGFyYW0pO1xuICB9fTtcblxuICAvKlxuICAgKiBDcmVhdGVzIGFuIGFjdGl2YXRpb24gcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAgICogaW4gdGhlIGNvbXBsZXguIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSB0aGUgc2FtZSBmdW5jdGlvbiBpbiBlbGVtZW50VXRpbGl0aWVzXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNyZWF0ZVRyYW5zY3JpcHRpb25SZWFjdGlvbiA9IGZ1bmN0aW9uIChnZW5lTmFtZSwgbVJuYU5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgZWRnZUxlbmd0aCkge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVHJhbnNjcmlwdGlvblJlYWN0aW9uKGdlbmVOYW1lLCBtUm5hTmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCBlZGdlTGVuZ3RoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGdlbmVOYW1lOiBnZW5lTmFtZSxcbiAgICAgICAgbVJuYU5hbWU6IG1SbmFOYW1lLFxuICAgICAgICBwcm9jZXNzUG9zaXRpb246IHByb2Nlc3NQb3NpdGlvbixcbiAgICAgICAgZWRnZUxlbmd0aDogZWRnZUxlbmd0aFxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZVRyYW5zY3JpcHRpb25SZWFjdGlvblwiLCBwYXJhbSk7XG4gIH19O1xuXG4gIG1haW5VdGlsaXRpZXMuY3JlYXRlQ29udmVyc2lvbiA9IGZ1bmN0aW9uKG1hY3JvbW9sZWN1bGVOYW1lLCByZWd1bGF0b3IsIHJlZ3VsYXRvck11bHRpbWVyLCBvcmllbnRhdGlvbiwgaW5wdXRJbmZvYm94TGFiZWwsIG91dHB1dEluZm9ib3hMYWJlbCkge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29udmVyc2lvbihtYWNyb21vbGVjdWxlTmFtZSwgcmVndWxhdG9yLCByZWd1bGF0b3JNdWx0aW1lciwgb3JpZW50YXRpb24sIGlucHV0SW5mb2JveExhYmVsLCBvdXRwdXRJbmZvYm94TGFiZWwpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbnN0IHBhcmFtID0ge1xuICAgICAgICBtYWNyb21vbGVjdWxlTmFtZTogbWFjcm9tb2xlY3VsZU5hbWUsXG4gICAgICAgIHJlZ3VsYXRvcjogcmVndWxhdG9yLFxuICAgICAgICByZWd1bGF0b3JNdWx0aW1lcjogcmVndWxhdG9yTXVsdGltZXIsXG4gICAgICAgIG9yaWVudGF0aW9uOiBvcmllbnRhdGlvbixcbiAgICAgICAgaW5wdXRJbmZvYm94TGFiZWw6IGlucHV0SW5mb2JveExhYmVsLFxuICAgICAgICBvdXRwdXRJbmZvYm94TGFiZWw6IG91dHB1dEluZm9ib3hMYWJlbFxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZUNvbnZlcnNpb25cIiwgcGFyYW0pO1xuICAgIH0gIFxuICB9O1xuXG4gIG1haW5VdGlsaXRpZXMuY3JlYXRlTWV0YWJvbGljUmVhY3Rpb24gPSBmdW5jdGlvbihpbnB1dHMsIG91dHB1dHMsIHJldmVyc2libGUsIHJlZ3VsYXRvciwgcmVndWxhdG9yTXVsdGltZXIsIG9yaWVudGF0aW9uKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVNZXRhYm9saWNSZWFjdGlvbihpbnB1dHMsIG91dHB1dHMsIHJldmVyc2libGUsIHJlZ3VsYXRvciwgcmVndWxhdG9yTXVsdGltZXIsIG9yaWVudGF0aW9uKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zdCBwYXJhbSA9IHtcbiAgICAgICAgaW5wdXRzOiBpbnB1dHMsXG4gICAgICAgIG91dHB1dHM6IG91dHB1dHMsXG4gICAgICAgIHJldmVyc2libGU6IHJldmVyc2libGUsXG4gICAgICAgIHJlZ3VsYXRvcjogcmVndWxhdG9yLFxuICAgICAgICByZWd1bGF0b3JNdWx0aW1lcjogcmVndWxhdG9yTXVsdGltZXIsXG4gICAgICAgIG9yaWVudGF0aW9uOiBvcmllbnRhdGlvblxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZU1ldGFib2xpY1JlYWN0aW9uXCIsIHBhcmFtKTtcbiAgICB9ICBcbiAgfTtcblxuICAvKlxuICAgKiBDcmVhdGVzIGFuIGFjdGl2YXRpb24gcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAgICogaW4gdGhlIGNvbXBsZXguIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSB0aGUgc2FtZSBmdW5jdGlvbiBpbiBlbGVtZW50VXRpbGl0aWVzXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNyZWF0ZU1ldGFib2xpY0NhdGFseXRpY0FjdGl2aXR5ID0gZnVuY3Rpb24gKGlucHV0Tm9kZUxpc3QsIG91dHB1dE5vZGVMaXN0LCBjYXRhbHlzdE5hbWUsIGNhdGFseXN0VHlwZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVNZXRhYm9saWNDYXRhbHl0aWNBY3Rpdml0eShpbnB1dE5vZGVMaXN0LCBvdXRwdXROb2RlTGlzdCwgY2F0YWx5c3ROYW1lLCBjYXRhbHlzdFR5cGUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBpbnB1dE5vZGVMaXN0OiBpbnB1dE5vZGVMaXN0LFxuICAgICAgICBvdXRwdXROb2RlTGlzdDogb3V0cHV0Tm9kZUxpc3QsXG4gICAgICAgIGNhdGFseXN0TmFtZTogY2F0YWx5c3ROYW1lLFxuICAgICAgICBjYXRhbHlzdFR5cGU6IGNhdGFseXN0VHlwZSxcbiAgICAgICAgcHJvY2Vzc1Bvc2l0aW9uOiBwcm9jZXNzUG9zaXRpb24sXG4gICAgICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLFxuICAgICAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXG4gICAgICAgIGVkZ2VMZW5ndGg6IGVkZ2VMZW5ndGgsXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlTWV0YWJvbGljQ2F0YWx5dGljQWN0aXZpdHlcIiwgcGFyYW0pO1xuICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBDcmVhdGVzIGFuIGFjdGl2YXRpb24gcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAgICogaW4gdGhlIGNvbXBsZXguIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSB0aGUgc2FtZSBmdW5jdGlvbiBpbiBlbGVtZW50VXRpbGl0aWVzXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNyZWF0ZUFjdGl2YXRpb25SZWFjdGlvbiA9IGZ1bmN0aW9uIChwcm90ZWluTmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCBlZGdlTGVuZ3RoLCByZXZlcnNlKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVBY3RpdmF0aW9uUmVhY3Rpb24ocHJvdGVpbk5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgZWRnZUxlbmd0aCwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBwcm90ZWluTmFtZTogcHJvdGVpbk5hbWUsXG4gICAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxuICAgICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoLFxuICAgICAgICByZXZlcnNlOiByZXZlcnNlXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlQWN0aXZhdGlvblJlYWN0aW9uXCIsIHBhcmFtKTtcbiAgfX07XG5cbiAgLypcbiAgICogQ3JlYXRlcyBhIHRlbXBsYXRlIHJlYWN0aW9uIHdpdGggZ2l2ZW4gcGFyYW1ldGVycy4gUmVxdWlyZXMgY29zZS1iaWxrZW50IGxheW91dCB0byB0aWxlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzIGluY2x1ZGVkXG4gICAqIGluIHRoZSBjb21wbGV4LiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgdGhlIHNhbWUgZnVuY3Rpb24gaW4gZWxlbWVudFV0aWxpdGllc1xuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHRlbXBsYXRlVHlwZSwgbWFjcm9tb2xlY3VsZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgsIGxheW91dFBhcmFtKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gXCJyZXZlcnNpYmxlXCIpIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiSHlicmlkQW55XCIpO1xuICAgICAgfVxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uKHRlbXBsYXRlVHlwZSwgbWFjcm9tb2xlY3VsZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgsIGxheW91dFBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIHRlbXBsYXRlVHlwZTogdGVtcGxhdGVUeXBlLFxuICAgICAgICBtYWNyb21vbGVjdWxlTGlzdDogbWFjcm9tb2xlY3VsZUxpc3QsXG4gICAgICAgIGNvbXBsZXhOYW1lOiBjb21wbGV4TmFtZSxcbiAgICAgICAgcHJvY2Vzc1Bvc2l0aW9uOiBwcm9jZXNzUG9zaXRpb24sXG4gICAgICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLFxuICAgICAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXG4gICAgICAgIGVkZ2VMZW5ndGg6IGVkZ2VMZW5ndGgsXG4gICAgICAgIGxheW91dFBhcmFtOiBsYXlvdXRQYXJhbVxuICAgICAgfTtcbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09IFwicmV2ZXJzaWJsZVwiKSB7XG4gICAgICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTpcImNoYW5nZU1hcFR5cGVcIiwgcGFyYW06IHttYXBUeXBlOiBcIkh5YnJpZEFueVwiLCBjYWxsYmFjazogZnVuY3Rpb24oKXt9IH19KTtcbiAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOlwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCBwYXJhbTogcGFyYW19KTtcbiAgICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImJhdGNoXCIsIGFjdGlvbnMpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVUZW1wbGF0ZVJlYWN0aW9uXCIsIHBhcmFtKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LlxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbywgcHJlc2VydmVSZWxhdGl2ZVBvcykge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgIHVzZUFzcGVjdFJhdGlvOiB1c2VBc3BlY3RSYXRpbyxcbiAgICAgICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZSxcbiAgICAgICAgcHJlc2VydmVSZWxhdGl2ZVBvczogcHJlc2VydmVSZWxhdGl2ZVBvc1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInJlc2l6ZU5vZGVzXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbyk7XG4gICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICAgIH1cblxuXG4gIH07XG5cbiAgICAvKlxuICAgICAqIFJlc2l6ZSBnaXZlbiBub2RlcyBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHkgb25lIG9mIHdpZHRoIG9yIGhlaWdodCBzaG91bGQgbm90IGJlIHNldC5cbiAgICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgICAqL1xuICAgIG1haW5VdGlsaXRpZXMucmVzaXplTm9kZXNUb0NvbnRlbnQgPSBmdW5jdGlvbihub2RlcywgdXNlQXNwZWN0UmF0aW8pIHtcbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IFxuICAgICAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluV2lkdGgobm9kZSk7XG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5IZWlnaHQobm9kZSk7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwicmVzaXplTm9kZXNcIiwgcGFyYW06IHtcbiAgICAgICAgICAgICAgICBub2Rlczogbm9kZSxcbiAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgdXNlQXNwZWN0UmF0aW86IHVzZUFzcGVjdFJhdGlvLFxuICAgICAgICAgICAgICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWUsXG4gICAgICAgICAgICAgICAgcHJlc2VydmVSZWxhdGl2ZVBvczogdHJ1ZVxuICAgICAgICAgICAgfX0pO1xuXG4gICAgICAgICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBzdGF0ZUFuZEluZm9zLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChsZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgICAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgICAgICAgICBsb2NhdGlvbnM6IFtcInRvcFwiLFwicmlnaHRcIixcImJvdHRvbVwiLFwibGVmdFwiXVxuICAgICAgICAgICAgICB9OyAgICAgICAgICBcbiAgICAgICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOlwiZml0VW5pdHNcIixwYXJhbSA6IHBhcmFtfSlcbiAgICAgICAgICAgICB9XG4gIFxuXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgXG4gICAgICAgICBcbiAgICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiYmF0Y2hcIiwgYWN0aW9ucyk7XG4gICAgICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgICAgICAgICByZXR1cm4gYWN0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgICAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluV2lkdGgobm9kZSk7XG4gICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbkhlaWdodChub2RlKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMobm9kZSwgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8sIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICAgIH07XG5cbiAgLypcbiAgICogQ2hhbmdlcyB0aGUgbGFiZWwgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBsYWJlbC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlTm9kZUxhYmVsID0gZnVuY3Rpb24obm9kZXMsIGxhYmVsKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBsYWJlbCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIENoYW5nZSBmb250IHByb3BlcnRpZXMgZm9yIGdpdmVuIG5vZGVzIHVzZSB0aGUgZ2l2ZW4gZm9udCBkYXRhLlxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uKGVsZXMsIGRhdGEpIHtcbiAgICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBlbGVzOiBlbGVzLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VGb250UHJvcGVydGllc1wiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGVzLCBkYXRhKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgcGFyYW1ldGVycyBzZWUgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveFxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpIHtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gobm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICAvLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4gIC8vIFRoZSBib3ggaXMgcmVwcmVzZW50ZWQgYnkgdGhlIHBhcmFtZXRlciBvYmouXG4gIC8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gIG1haW5VdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2Rlcywgb2JqKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChub2Rlcywgb2JqKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG9iajogb2JqLFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICAvLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxuICAvLyBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICBtYWluVXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIGluZGV4KSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2Rlcywge2luZGV4OiBpbmRleH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgbG9jYXRpb25PYmo6IHtpbmRleDogaW5kZXh9LFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuXG4gIC8vQXJyYW5nZSBpbmZvcm1hdGlvbiBib3hlc1xuICAvL0lmIGZvcmNlIGNoZWNrIGlzIHRydWUsIGl0IHJlYXJyYW5nZXMgYWxsIGluZm9ybWF0aW9uIGJveGVzXG4gIG1haW5VdGlsaXRpZXMuZml0VW5pdHMgPSBmdW5jdGlvbiAobm9kZSwgbG9jYXRpb25zKSB7XG4gICAgaWYgKG5vZGUuZGF0YSgnYXV4dW5pdGxheW91dHMnKSA9PT0gdW5kZWZpbmVkIHx8IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5sZW5ndGggPD0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAobG9jYXRpb25zID09PSB1bmRlZmluZWQgfHwgbG9jYXRpb25zLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmZpdFVuaXRzKG5vZGUsIGxvY2F0aW9ucyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICBsb2NhdGlvbnM6IGxvY2F0aW9uc1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImZpdFVuaXRzXCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZWRyYXcgY2xvbmUgbWFya2VycyBvbiBnaXZlbiBub2RlcyB3aXRob3V0IGNvbnNpZGVyaW5nIHVuZG8uXG4gICAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L25ld3QvaXNzdWVzLzU3NCBcbiAgICovXG4gIG1haW5VdGlsaXRpZXMucmVkcmF3Q2xvbmVNYXJrZXJzID0gZnVuY3Rpb24obm9kZXMpIHtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCB0cnVlKTtcbiAgfVxuXG4gIC8qXG4gICAqIFNldCBjbG9uZSBtYXJrZXIgc3RhdHVzIG9mIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRDbG9uZU1hcmtlclN0YXR1c1wiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIENoYW5nZSBzdHlsZS9jc3Mgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxuICAgKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlQ3NzID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzKGVsZXMsIG5hbWUsIHZhbHVlTWFwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGVsZXM6IGVsZXMsXG4gICAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcbiAgICAgICAgbmFtZTogbmFtZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUNzc1wiLCBwYXJhbSk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfTtcblxuICAvKlxuICAgKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gICAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcbiAgICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBlbGVzOiBlbGVzLFxuICAgICAgICB2YWx1ZU1hcDogdmFsdWVNYXAsXG4gICAgICAgIG5hbWU6IG5hbWVcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VEYXRhXCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIG1haW5VdGlsaXRpZXMudXBkYXRlU2V0RmllbGQgPSBmdW5jdGlvbihlbGUsIGZpZWxkTmFtZSwgdG9EZWxldGUsIHRvQWRkLCBjYWxsYmFjaykge1xuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVsZSwgZmllbGROYW1lLCB0b0RlbGV0ZSwgdG9BZGQsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGVsZSxcbiAgICAgICAgZmllbGROYW1lLFxuICAgICAgICB0b0RlbGV0ZSxcbiAgICAgICAgdG9BZGQsXG4gICAgICAgIGNhbGxiYWNrXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwidXBkYXRlU2V0RmllbGRcIiwgcGFyYW0pO1xuICAgIH1cbiAgfTtcblxuICBtYWluVXRpbGl0aWVzLnNldERlZmF1bHRQcm9wZXJ0eSA9IGZ1bmN0aW9uKCBfY2xhc3MsIG5hbWUsIHZhbHVlICkge1xuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHByb3BNYXAgPSB7fTtcbiAgICAgIHByb3BNYXBbIG5hbWUgXSA9IHZhbHVlO1xuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldERlZmF1bHRQcm9wZXJ0aWVzKF9jbGFzcywgcHJvcE1hcCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBjbGFzczogX2NsYXNzLFxuICAgICAgICBuYW1lLFxuICAgICAgICB2YWx1ZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInNldERlZmF1bHRQcm9wZXJ0eVwiLCBwYXJhbSk7XG4gICAgfVxuICB9O1xuXG4gIG1haW5VdGlsaXRpZXMudXBkYXRlSW5mb2JveFN0eWxlID0gZnVuY3Rpb24oIG5vZGUsIGluZGV4LCBuZXdQcm9wcyApIHtcbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlSW5mb2JveFN0eWxlKCBub2RlLCBpbmRleCwgbmV3UHJvcHMgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgbmV3UHJvcHM6IG5ld1Byb3BzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwidXBkYXRlSW5mb2JveFN0eWxlXCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIG1haW5VdGlsaXRpZXMudXBkYXRlSW5mb2JveE9iaiA9IGZ1bmN0aW9uKCBub2RlLCBpbmRleCwgbmV3UHJvcHMgKSB7XG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hPYmooIG5vZGUsIGluZGV4LCBuZXdQcm9wcyApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBuZXdQcm9wczogbmV3UHJvcHNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJ1cGRhdGVJbmZvYm94T2JqXCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIG1haW5VdGlsaXRpZXMuZGVsZXRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChlbGVzLCBsYXlvdXRwYXJhbSkge1xuICAgIHZhciBub2RlcyA9IGVsZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcblxuICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIik7XG4gICAgdmFyIG5vZGVzVG9LZWVwID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmRSZW1haW5pbmdOb2Rlcyhub2RlcywgYWxsTm9kZXMpO1xuICAgIHZhciBub2Rlc1RvUmVtb3ZlID0gYWxsTm9kZXMubm90KG5vZGVzVG9LZWVwKTtcblxuICAgIGlmIChub2Rlc1RvUmVtb3ZlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG5cbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5kZWxldGVBbmRQZXJmb3JtTGF5b3V0KG5vZGVzVG9SZW1vdmUsIGxheW91dHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgICAgIGVsZXM6IG5vZGVzVG9SZW1vdmUsXG4gICAgICAgICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXG4gICAgICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiZGVsZXRlQW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbSk7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIEhpZGVzIGdpdmVuIGVsZXMgKHRoZSBvbmVzIHdoaWNoIGFyZSBzZWxlY3RlZCkgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAgICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLiBSZXF1aXJlcyB2aWV3VXRpbGl0aWVzIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuaGlkZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihlbGVzLCBsYXlvdXRwYXJhbSkge1xuICAgICAgdmFyIG5vZGVzID0gZWxlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xuXG4gICAgICB2YXIgYWxsTm9kZXMgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpO1xuICAgICAgdmFyIG5vZGVzVG9TaG93ID0gZWxlbWVudFV0aWxpdGllcy5leHRlbmRSZW1haW5pbmdOb2Rlcyhub2RlcywgYWxsTm9kZXMpO1xuICAgICAgdmFyIG5vZGVzVG9IaWRlID0gYWxsTm9kZXMubm90KG5vZGVzVG9TaG93KTtcblxuICAgICAgaWYgKG5vZGVzVG9IaWRlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG5cbiAgICAgICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XG4gICAgICAgICAgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuaGlkZUFuZFBlcmZvcm1MYXlvdXQobm9kZXNUb0hpZGUsIGxheW91dHBhcmFtKTtcbiAgICAgICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XG4gICAgICAgICAgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICAgICAgICBlbGVzOiBub2Rlc1RvSGlkZSxcbiAgICAgICAgICAgICAgbGF5b3V0cGFyYW06IGxheW91dHBhcmFtLFxuICAgICAgICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdmFyIHVyID0gY3kudW5kb1JlZG8oKTtcbiAgICAgICAgICB1ci5hY3Rpb24oXCJ0aGlja2VuQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcik7XG4gICAgICAgICAgdXIuYWN0aW9uKFwidGhpbkJvcmRlclwiLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlciwgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIpO1xuXG4gICAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoKS5pbnRlcnNlY3Rpb24obm9kZXNUb0hpZGUpO1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGluQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcn0pO1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJoaWRlQW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbTogcGFyYW19KTtcbiAgICAgICAgICBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IG5vZGVzVG9IaWRlLm5laWdoYm9yaG9vZChcIjp2aXNpYmxlXCIpLm5vZGVzKCkuZGlmZmVyZW5jZShub2Rlc1RvSGlkZSkuZGlmZmVyZW5jZShjeS5ub2RlcyhcIlt0aGlja0JvcmRlcl1cIikpO1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGlja2VuQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcn0pO1xuICAgICAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJiYXRjaFwiLCBhY3Rpb25zKTtcbiAgICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBTaG93cyBhbGwgZWxlbWVudHMgKHRoZSBvbmVzIHdoaWNoIGFyZSBoaWRkZW4gaWYgYW55KSBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xuICAgKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5zaG93QWxsQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGxheW91dHBhcmFtKSB7XG4gICAgdmFyIGhpZGRlbkVsZXMgPSBjeS5lbGVtZW50cygnOmhpZGRlbicpO1xuICAgIGlmIChoaWRkZW5FbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcbiAgICAgIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQoaGlkZGVuRWxlcywgbGF5b3V0cGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgZWxlczogaGlkZGVuRWxlcyxcbiAgICAgICAgbGF5b3V0cGFyYW06IGxheW91dHBhcmFtLFxuICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgIH07XG5cbiAgICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKCk7XG4gICAgICB1ci5hY3Rpb24oXCJ0aGlja2VuQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcik7XG4gICAgICB1ci5hY3Rpb24oXCJ0aGluQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlcik7XG5cbiAgICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5ub2RlcyhcIlt0aGlja0JvcmRlcl1cIik7XG4gICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpbkJvcmRlclwiLCBwYXJhbTogbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3J9KTtcbiAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbTogcGFyYW19KTtcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJiYXRjaFwiLCBhY3Rpb25zKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogVW5oaWRlIGdpdmVuIGVsZXMgKHRoZSBvbmVzIHdoaWNoIGFyZSBoaWRkZW4gaWYgYW55KSBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xuICAgKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKG1haW5FbGUsIGVsZXMsIGxheW91dHBhcmFtKSB7XG4gICAgICB2YXIgaGlkZGVuRWxlcyA9IGVsZXMuZmlsdGVyKCc6aGlkZGVuJyk7XG4gICAgICBpZiAoaGlkZGVuRWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBtYWluVXRpbGl0aWVzLmNsb3NlVXBFbGVtZW50cyhtYWluRWxlLCBoaWRkZW5FbGVzLm5vZGVzKCkpO1xuICAgICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xuICAgICAgICAgIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KGhpZGRlbkVsZXMsIGxheW91dHBhcmFtKTtcbiAgICAgICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XG4gICAgICAgICAgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICAgICAgICBlbGVzOiBoaWRkZW5FbGVzLFxuICAgICAgICAgICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXG4gICAgICAgICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB2YXIgdXIgPSBjeS51bmRvUmVkbygpO1xuICAgICAgICAgIHVyLmFjdGlvbihcInRoaWNrZW5Cb3JkZXJcIiwgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKTtcbiAgICAgICAgICB1ci5hY3Rpb24oXCJ0aGluQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlcik7XG5cbiAgICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgICAgIHZhciBub2Rlc1RvVGhpbkJvcmRlciA9IChoaWRkZW5FbGVzLm5laWdoYm9yaG9vZChcIjp2aXNpYmxlXCIpLm5vZGVzKFwiW3RoaWNrQm9yZGVyXVwiKSlcbiAgICAgICAgICAgICAgICAgIC5kaWZmZXJlbmNlKGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5kaWZmZXJlbmNlKGhpZGRlbkVsZXMuZWRnZXMoKS51bmlvbihoaWRkZW5FbGVzLm5vZGVzKCkuY29ubmVjdGVkRWRnZXMoKSkpLmNvbm5lY3RlZE5vZGVzKCkpO1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGluQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1RvVGhpbkJvcmRlcn0pO1xuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbTogcGFyYW19KTtcbiAgICAgICAgICB2YXIgbm9kZXNUb1RoaWNrZW5Cb3JkZXIgPSBoaWRkZW5FbGVzLm5vZGVzKCkuZWRnZXNXaXRoKGN5Lm5vZGVzKFwiOmhpZGRlblwiKS5kaWZmZXJlbmNlKGhpZGRlbkVsZXMubm9kZXMoKSkpXG4gIFx0ICAgICAgICAgICAgLmNvbm5lY3RlZE5vZGVzKCkuaW50ZXJzZWN0aW9uKGhpZGRlbkVsZXMubm9kZXMoKSk7XG4gICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInRoaWNrZW5Cb3JkZXJcIiwgcGFyYW06IG5vZGVzVG9UaGlja2VuQm9yZGVyfSk7XG4gICAgICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImJhdGNoXCIsIGFjdGlvbnMpO1xuICAgICAgfVxuICB9O1xuXG4gIC8qXG4gICogVGFrZXMgdGhlIGhpZGRlbiBlbGVtZW50cyBjbG9zZSB0byB0aGUgbm9kZXMgd2hvc2UgbmVpZ2hib3JzIHdpbGwgYmUgc2hvd25cbiAgKiAqL1xuICBtYWluVXRpbGl0aWVzLmNsb3NlVXBFbGVtZW50cyA9IGZ1bmN0aW9uKG1haW5FbGUsIGhpZGRlbkVsZXMpIHtcbiAgICAgIHZhciBsZWZ0WCA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgICB2YXIgcmlnaHRYID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgICAgIHZhciB0b3BZID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgIHZhciBib3R0b21ZID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgICAgIC8vIENoZWNrIHRoZSB4IGFuZCB5IGxpbWl0cyBvZiBhbGwgaGlkZGVuIGVsZW1lbnRzIGFuZCBzdG9yZSB0aGVtIGluIHRoZSB2YXJpYWJsZXMgYWJvdmVcbiAgICAgIGhpZGRlbkVsZXMuZm9yRWFjaChmdW5jdGlvbiggZWxlICl7XG4gICAgICAgICAgaWYgKGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wYXJ0bWVudCcgJiYgIGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wbGV4JylcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIHZhciBoYWxmV2lkdGggPSBlbGUub3V0ZXJXaWR0aCgpLzI7XG4gICAgICAgICAgICAgIHZhciBoYWxmSGVpZ2h0ID0gZWxlLm91dGVySGVpZ2h0KCkvMjtcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgLSBoYWxmV2lkdGggPCBsZWZ0WClcbiAgICAgICAgICAgICAgICAgIGxlZnRYID0gZWxlLnBvc2l0aW9uKFwieFwiKSAtIGhhbGZXaWR0aDtcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgKyBoYWxmV2lkdGggPiByaWdodFgpXG4gICAgICAgICAgICAgICAgICByaWdodFggPSBlbGUucG9zaXRpb24oXCJ4XCIpICsgaGFsZldpZHRoO1xuICAgICAgICAgICAgICBpZiAoZWxlLnBvc2l0aW9uKFwieVwiKSAtIGhhbGZIZWlnaHQgPCB0b3BZKVxuICAgICAgICAgICAgICAgICAgdG9wWSA9IGVsZS5wb3NpdGlvbihcInlcIikgLSBoYWxmSGVpZ2h0O1xuICAgICAgICAgICAgICBpZiAoZWxlLnBvc2l0aW9uKFwieVwiKSArIGhhbGZIZWlnaHQgPiB0b3BZKVxuICAgICAgICAgICAgICAgICAgYm90dG9tWSA9IGVsZS5wb3NpdGlvbihcInlcIikgKyBoYWxmSGVpZ2h0O1xuICAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvL1RoZSBjb29yZGluYXRlcyBvZiB0aGUgb2xkIGNlbnRlciBjb250YWluaW5nIHRoZSBoaWRkZW4gbm9kZXNcbiAgICAgIHZhciBvbGRDZW50ZXJYID0gKGxlZnRYICsgcmlnaHRYKS8yO1xuICAgICAgdmFyIG9sZENlbnRlclkgPSAodG9wWSArIGJvdHRvbVkpLzI7XG5cbiAgICAgIC8vSGVyZSB3ZSBjYWxjdWxhdGUgdHdvIHBhcmFtZXRlcnMgd2hpY2ggZGVmaW5lIHRoZSBhcmVhIGluIHdoaWNoIHRoZSBoaWRkZW4gZWxlbWVudHMgYXJlIHBsYWNlZCBpbml0aWFsbHlcbiAgICAgIHZhciBtaW5Ib3Jpem9udGFsUGFyYW0gPSBtYWluRWxlLm91dGVyV2lkdGgoKS8yICsgKHJpZ2h0WCAtIGxlZnRYKS8yO1xuICAgICAgdmFyIG1heEhvcml6b250YWxQYXJhbSA9IG1haW5FbGUub3V0ZXJXaWR0aCgpICsgKHJpZ2h0WCAtIGxlZnRYKS8yO1xuICAgICAgdmFyIG1pblZlcnRpY2FsUGFyYW0gPSBtYWluRWxlLm91dGVySGVpZ2h0KCkvMiArIChib3R0b21ZIC0gdG9wWSkvMjtcbiAgICAgIHZhciBtYXhWZXJ0aWNhbFBhcmFtID0gbWFpbkVsZS5vdXRlckhlaWdodCgpICsgKGJvdHRvbVkgLSB0b3BZKS8yO1xuXG4gICAgICAvL1F1YWRyYW50cyBpcyBhbiBvYmplY3Qgb2YgdGhlIGZvcm0ge2ZpcnN0Olwib2J0YWluZWRcIiwgc2Vjb25kOlwiZnJlZVwiLCB0aGlyZDpcImZyZWVcIiwgZm91cnRoOlwib2J0YWluZWRcIn1cbiAgICAgIC8vIHdoaWNoIGhvbGRzIHdoaWNoIHF1YWRyYW50IGFyZSBmcmVlICh0aGF0J3Mgd2hlcmUgaGlkZGVuIG5vZGVzIHdpbGwgYmUgYnJvdWdodClcbiAgICAgIHZhciBxdWFkcmFudHMgPSBtYWluVXRpbGl0aWVzLmNoZWNrT2NjdXBpZWRRdWFkcmFudHMobWFpbkVsZSwgaGlkZGVuRWxlcyk7XG4gICAgICB2YXIgZnJlZVF1YWRyYW50cyA9IFtdO1xuICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcXVhZHJhbnRzKSB7XG4gICAgICAgICAgaWYgKHF1YWRyYW50c1twcm9wZXJ0eV0gPT09IFwiZnJlZVwiKVxuICAgICAgICAgICAgICBmcmVlUXVhZHJhbnRzLnB1c2gocHJvcGVydHkpO1xuICAgICAgfVxuXG4gICAgICAvL0NhbiB0YWtlIHZhbHVlcyAxIGFuZCAtMSBhbmQgYXJlIHVzZWQgdG8gcGxhY2UgdGhlIGhpZGRlbiBub2RlcyBpbiB0aGUgcmFuZG9tIHF1YWRyYW50XG4gICAgICB2YXIgaG9yaXpvbnRhbE11bHQ7XG4gICAgICB2YXIgdmVydGljYWxNdWx0O1xuICAgICAgaWYgKGZyZWVRdWFkcmFudHMubGVuZ3RoID4gMClcbiAgICAgIHtcbiAgICAgICAgaWYgKGZyZWVRdWFkcmFudHMubGVuZ3RoID09PSAzKVxuICAgICAgICB7XG4gICAgICAgICAgaWYgKGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZpcnN0JykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnc2Vjb25kJykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygndGhpcmQnKSlcbiAgICAgICAgICB7XG4gICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IC0xO1xuICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gLTE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZpcnN0JykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnc2Vjb25kJykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnZm91cnRoJykpXG4gICAgICAgICAge1xuICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAxO1xuICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gLTE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZpcnN0JykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygndGhpcmQnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmb3VydGgnKSlcbiAgICAgICAgICB7XG4gICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XG4gICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdzZWNvbmQnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCd0aGlyZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZvdXJ0aCcpKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gLTE7XG4gICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAvL1JhbmRvbWx5IHBpY2tzIG9uZSBxdWFkcmFudCBmcm9tIHRoZSBmcmVlIHF1YWRyYW50c1xuICAgICAgICAgIHZhciByYW5kb21RdWFkcmFudCA9IGZyZWVRdWFkcmFudHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmZyZWVRdWFkcmFudHMubGVuZ3RoKV07XG5cbiAgICAgICAgICBpZiAocmFuZG9tUXVhZHJhbnQgPT09IFwiZmlyc3RcIikge1xuICAgICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XG4gICAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IC0xO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChyYW5kb21RdWFkcmFudCA9PT0gXCJzZWNvbmRcIikge1xuICAgICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IC0xO1xuICAgICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAtMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAocmFuZG9tUXVhZHJhbnQgPT09IFwidGhpcmRcIikge1xuICAgICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IC0xO1xuICAgICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChyYW5kb21RdWFkcmFudCA9PT0gXCJmb3VydGhcIikge1xuICAgICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XG4gICAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICB7XG4gICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAwO1xuICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IDA7XG4gICAgICB9XG4gICAgICAvLyBJZiB0aGUgaG9yaXpvbnRhbE11bHQgaXMgMCBpdCBtZWFucyB0aGF0IG5vIHF1YWRyYW50IGlzIGZyZWUsIHNvIHdlIHJhbmRvbWx5IGNob29zZSBhIHF1YWRyYW50XG4gICAgICB2YXIgaG9yaXpvbnRhbFBhcmFtID0gbWFpblV0aWxpdGllcy5nZW5lcmF0ZVJhbmRvbShtaW5Ib3Jpem9udGFsUGFyYW0sbWF4SG9yaXpvbnRhbFBhcmFtLGhvcml6b250YWxNdWx0KTtcbiAgICAgIHZhciB2ZXJ0aWNhbFBhcmFtID0gbWFpblV0aWxpdGllcy5nZW5lcmF0ZVJhbmRvbShtaW5WZXJ0aWNhbFBhcmFtLG1heFZlcnRpY2FsUGFyYW0sdmVydGljYWxNdWx0KTtcblxuICAgICAgLy9UaGUgY29vcmRpbmF0ZXMgb2YgdGhlIGNlbnRlciB3aGVyZSB0aGUgaGlkZGVuIG5vZGVzIHdpbGwgYmUgdHJhbnNmZXJlZFxuICAgICAgdmFyIG5ld0NlbnRlclggPSBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSArIGhvcml6b250YWxQYXJhbTtcbiAgICAgIHZhciBuZXdDZW50ZXJZID0gbWFpbkVsZS5wb3NpdGlvbihcInlcIikgKyB2ZXJ0aWNhbFBhcmFtO1xuXG4gICAgICB2YXIgeGRpZmYgPSBuZXdDZW50ZXJYIC0gb2xkQ2VudGVyWDtcbiAgICAgIHZhciB5ZGlmZiA9IG5ld0NlbnRlclkgLSBvbGRDZW50ZXJZO1xuXG4gICAgICAvL0NoYW5nZSB0aGUgcG9zaXRpb24gb2YgaGlkZGVuIGVsZW1lbnRzXG4gICAgICBoaWRkZW5FbGVzLmZvckVhY2goZnVuY3Rpb24oIGVsZSApe1xuICAgICAgICAgIHZhciBuZXd4ID0gZWxlLnBvc2l0aW9uKFwieFwiKSArIHhkaWZmO1xuICAgICAgICAgIHZhciBuZXd5ID0gZWxlLnBvc2l0aW9uKFwieVwiKSArIHlkaWZmO1xuICAgICAgICAgIGVsZS5wb3NpdGlvbihcInhcIiwgbmV3eCk7XG4gICAgICAgICAgZWxlLnBvc2l0aW9uKFwieVwiLG5ld3kpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgLypcbiAgICogR2VuZXJhdGVzIGEgbnVtYmVyIGJldHdlZW4gMiBuciBhbmQgbXVsdGltcGxpZXMgaXQgd2l0aCAxIG9yIC0xXG4gICAqICovXG4gIG1haW5VdGlsaXRpZXMuZ2VuZXJhdGVSYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCwgbXVsdCkge1xuICAgICAgdmFyIHZhbCA9IFstMSwxXTtcbiAgICAgIGlmIChtdWx0ID09PSAwKVxuICAgICAgICAgIG11bHQgPSB2YWxbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnZhbC5sZW5ndGgpXTtcbiAgICAgIHJldHVybiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbikgKiBtdWx0O1xuICB9O1xuXG4gIC8qXG4gICAqIFRoaXMgZnVuY3Rpb24gbWFrZXMgc3VyZSB0aGF0IHRoZSByYW5kb20gbnVtYmVyIGxpZXMgaW4gZnJlZSBxdWFkcmFudFxuICAgKiAqL1xuICBtYWluVXRpbGl0aWVzLmNoZWNrT2NjdXBpZWRRdWFkcmFudHMgPSBmdW5jdGlvbihtYWluRWxlLCBoaWRkZW5FbGVzKSB7XG4gICAgICBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gJ1BEJylcbiAgICAgIHtcbiAgICAgICAgdmFyIHZpc2libGVOZWlnaGJvckVsZXMgPSBtYWluRWxlLm5laWdoYm9yaG9vZCgpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcykubm9kZXMoKTtcbiAgICAgICAgdmFyIHZpc2libGVOZWlnaGJvcnNPZk5laWdoYm9ycyA9IHZpc2libGVOZWlnaGJvckVsZXMubmVpZ2hib3Job29kKCkuZGlmZmVyZW5jZShoaWRkZW5FbGVzKS5kaWZmZXJlbmNlKG1haW5FbGUpLm5vZGVzKCk7XG4gICAgICAgIHZhciB2aXNpYmxlRWxlcyA9IHZpc2libGVOZWlnaGJvckVsZXMudW5pb24odmlzaWJsZU5laWdoYm9yc09mTmVpZ2hib3JzKTtcbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgICAgdmFyIHZpc2libGVFbGVzID0gbWFpbkVsZS5uZWlnaGJvcmhvb2QoKS5kaWZmZXJlbmNlKGhpZGRlbkVsZXMpLm5vZGVzKCk7XG4gICAgICB2YXIgb2NjdXBpZWRRdWFkcmFudHMgPSB7Zmlyc3Q6XCJmcmVlXCIsIHNlY29uZDpcImZyZWVcIiwgdGhpcmQ6XCJmcmVlXCIsIGZvdXJ0aDpcImZyZWVcIn07XG5cbiAgICAgIHZpc2libGVFbGVzLmZvckVhY2goZnVuY3Rpb24oIGVsZSApe1xuICAgICAgICAgIGlmIChlbGUuZGF0YSgnY2xhc3MnKSAhPSAnY29tcGFydG1lbnQnICYmICBlbGUuZGF0YSgnY2xhc3MnKSAhPSAnY29tcGxleCcpXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBpZiAoZWxlLnBvc2l0aW9uKFwieFwiKSA8IG1haW5FbGUucG9zaXRpb24oXCJ4XCIpICYmIGVsZS5wb3NpdGlvbihcInlcIikgPCBtYWluRWxlLnBvc2l0aW9uKFwieVwiKSlcbiAgICAgICAgICAgICAgICAgIG9jY3VwaWVkUXVhZHJhbnRzLnNlY29uZCA9IFwib2NjdXBpZWRcIjtcbiAgICAgICAgICAgICAgZWxzZSBpZiAoZWxlLnBvc2l0aW9uKFwieFwiKSA+IG1haW5FbGUucG9zaXRpb24oXCJ4XCIpICYmIGVsZS5wb3NpdGlvbihcInlcIikgPCBtYWluRWxlLnBvc2l0aW9uKFwieVwiKSlcbiAgICAgICAgICAgICAgICAgIG9jY3VwaWVkUXVhZHJhbnRzLmZpcnN0ID0gXCJvY2N1cGllZFwiO1xuICAgICAgICAgICAgICBlbHNlIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpIDwgbWFpbkVsZS5wb3NpdGlvbihcInhcIikgJiYgZWxlLnBvc2l0aW9uKFwieVwiKSA+IG1haW5FbGUucG9zaXRpb24oXCJ5XCIpKVxuICAgICAgICAgICAgICAgICAgb2NjdXBpZWRRdWFkcmFudHMudGhpcmQgPSBcIm9jY3VwaWVkXCI7XG4gICAgICAgICAgICAgIGVsc2UgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgPiBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSAmJiBlbGUucG9zaXRpb24oXCJ5XCIpID4gbWFpbkVsZS5wb3NpdGlvbihcInlcIikpXG4gICAgICAgICAgICAgICAgICBvY2N1cGllZFF1YWRyYW50cy5mb3VydGggPSBcIm9jY3VwaWVkXCI7XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2NjdXBpZWRRdWFkcmFudHM7XG4gIH07XG5cbiAgLy8gT3ZlcnJpZGVzIGhpZ2hsaWdodFByb2Nlc3NlcyBmcm9tIFNCR05WSVogLSBkbyBub3QgaGlnaGxpZ2h0IGFueSBub2RlcyB3aGVuIHRoZSBtYXAgdHlwZSBpcyBBRlxuICBtYWluVXRpbGl0aWVzLmhpZ2hsaWdodFByb2Nlc3NlcyA9IGZ1bmN0aW9uKF9ub2Rlcykge1xuICAgIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSA9PSBcIkFGXCIpXG4gICAgICByZXR1cm47XG4gICAgc2JnbnZpekluc3RhbmNlLmhpZ2hsaWdodFByb2Nlc3Nlcyhfbm9kZXMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXNldHMgbWFwIHR5cGUgdG8gdW5kZWZpbmVkXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLnJlc2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XG4gICAgZWxlbWVudFV0aWxpdGllcy5yZXNldE1hcFR5cGUoKTtcbiAgfTtcblxuICAvKipcbiAgICogcmV0dXJuIDogbWFwIHR5cGVcbiAgICovXG4gIG1haW5VdGlsaXRpZXMuZ2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpO1xuICB9O1xuXG4gIG1haW5VdGlsaXRpZXMuYWRkQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24obm9kZXMsIGJnT2JqLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKXtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwIHx8ICFiZ09iaikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGJnT2JqWydmaXJzdFRpbWUnXSA9IHRydWU7XG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgYmdPYmo6IGJnT2JqLFxuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIHVwZGF0ZUluZm86IHVwZGF0ZUluZm8sXG4gICAgICAgIHByb21wdEludmFsaWRJbWFnZTogcHJvbXB0SW52YWxpZEltYWdlLFxuICAgICAgICB2YWxpZGF0ZVVSTDogdmFsaWRhdGVVUkwsXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkQmFja2dyb3VuZEltYWdlXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEJhY2tncm91bmRJbWFnZShub2RlcywgYmdPYmosIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH1cblxuICBtYWluVXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uKG5vZGVzLCBiZ09iail7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCB8fCAhYmdPYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBiZ09ialsnZmlyc3RUaW1lJ10gPSB0cnVlO1xuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGJnT2JqOiBiZ09iaixcbiAgICAgICAgbm9kZXM6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlQmFja2dyb3VuZEltYWdlXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZShub2RlcywgYmdPYmopO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH1cblxuICBtYWluVXRpbGl0aWVzLnVwZGF0ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uKG5vZGVzLCBiZ09iail7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCB8fCAhYmdPYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBiZ09iajogYmdPYmosXG4gICAgICAgIG5vZGVzOiBub2Rlc1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInVwZGF0ZUJhY2tncm91bmRJbWFnZVwiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIGJnT2JqKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9XG5cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbihub2Rlcywgb2xkSW1nLCBuZXdJbWcsIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpe1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDAgfHwgIW9sZEltZyB8fCAhbmV3SW1nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgb2xkSW1nOiBvbGRJbWcsXG4gICAgICAgIG5ld0ltZzogbmV3SW1nLFxuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZSxcbiAgICAgICAgdXBkYXRlSW5mbzogdXBkYXRlSW5mbyxcbiAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlOiBwcm9tcHRJbnZhbGlkSW1hZ2UsXG4gICAgICAgIHZhbGlkYXRlVVJMOiB2YWxpZGF0ZVVSTFxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUJhY2tncm91bmRJbWFnZVwiLCBwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIG9sZEltZywgbmV3SW1nLCB0cnVlLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9XG5cbiAgcmV0dXJuIG1haW5VdGlsaXRpZXM7XG59O1xuIiwiLypcbiAqICBFeHRlbmQgZGVmYXVsdCBvcHRpb25zIGFuZCBnZXQgY3VycmVudCBvcHRpb25zIGJ5IHVzaW5nIHRoaXMgZmlsZVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgLy8gVGhlIHBhdGggb2YgY29yZSBsaWJyYXJ5IGltYWdlcyB3aGVuIHNiZ252aXogaXMgcmVxdWlyZWQgZnJvbSBucG0gYW5kIHRoZSBpbmRleCBodG1sXG4gICAgLy8gZmlsZSBhbmQgbm9kZV9tb2R1bGVzIGFyZSB1bmRlciB0aGUgc2FtZSBmb2xkZXIgdGhlbiB1c2luZyB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBmaW5lXG4gICAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxuICAgIC8vIFdoZXRoZXIgdG8gZml0IGxhYmVscyB0byBub2Rlc1xuICAgIGZpdExhYmVsc1RvTm9kZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIGZpdExhYmVsc1RvSW5mb2JveGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvLyBkeW5hbWljIGxhYmVsIHNpemUgaXQgbWF5IGJlICdzbWFsbCcsICdyZWd1bGFyJywgJ2xhcmdlJ1xuICAgIGR5bmFtaWNMYWJlbFNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAncmVndWxhcic7XG4gICAgfSxcbiAgICAvLyBXaGV0aGVyIHRvIGluZmVyIG5lc3Rpbmcgb24gbG9hZCBcbiAgICBpbmZlck5lc3RpbmdPbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIC8vIHBlcmNlbnRhZ2UgdXNlZCB0byBjYWxjdWxhdGUgY29tcG91bmQgcGFkZGluZ3NcbiAgICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAxMDtcbiAgICB9LFxuICAgIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xuICAgIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcbiAgICAvLyBXaGV0aGVyIHRoZSBhY3Rpb25zIGFyZSB1bmRvYWJsZSwgcmVxdWlyZXMgY3l0b3NjYXBlLXVuZG8tcmVkbyBleHRlbnNpb25cbiAgICB1bmRvYWJsZTogdHJ1ZSxcbiAgICAvLyBXaGV0aGVyIHRvIGhhdmUgdW5kb2FibGUgZHJhZyBmZWF0dXJlIGluIHVuZG8vcmVkbyBleHRlbnNpb24uIFRoaXMgb3B0aW9ucyB3aWxsIGJlIHBhc3NlZCB0byB1bmRvL3JlZG8gZXh0ZW5zaW9uXG4gICAgdW5kb2FibGVEcmFnOiB0cnVlXG4gIH07XG5cbiAgdmFyIG9wdGlvblV0aWxpdGllcyA9IGZ1bmN0aW9uICgpIHtcbiAgfTtcblxuICAvLyBFeHRlbmQgdGhlIGRlZmF1bHRzIG9wdGlvbnMgd2l0aCB0aGUgdXNlciBvcHRpb25zXG4gIG9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICBmb3IgKHZhciBwcm9wIGluIGRlZmF1bHRzKSB7XG4gICAgICByZXN1bHRbcHJvcF0gPSBkZWZhdWx0c1twcm9wXTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBwcm9wIGluIG9wdGlvbnMpIHtcbiAgICAgIHJlc3VsdFtwcm9wXSA9IG9wdGlvbnNbcHJvcF07XG4gICAgfVxuXG4gICAgb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnMgPSByZXN1bHQ7XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfTtcblxuICBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gb3B0aW9uVXRpbGl0aWVzLm9wdGlvbnM7XG4gIH07XG5cbiAgcmV0dXJuIG9wdGlvblV0aWxpdGllcztcbn07XG4iLCJ2YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcbnZhciAkID0gbGlicy5qUXVlcnk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucywgb3B0aW9ucywgY3k7XG5cbiAgdmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gZnVuY3Rpb24gKHBhcmFtKSB7XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHBhcmFtLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xuICAgIG9wdGlvbnMgPSBwYXJhbS5vcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KCk7XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgdW5kby1yZWRvIGluc3RhbmNlXG4gICAgdmFyIHVyID0gY3kudW5kb1JlZG8oe1xuICAgICAgdW5kb2FibGVEcmFnOiBvcHRpb25zLnVuZG9hYmxlRHJhZ1xuICAgIH0pO1xuXG4gICAgLy8gcmVnaXN0ZXIgYWRkIHJlbW92ZSBhY3Rpb25zXG4gICAgdXIuYWN0aW9uKFwiYWRkTm9kZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGROb2RlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU2ltcGxlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcbiAgICB1ci5hY3Rpb24oXCJhZGRFZGdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEVkZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICAgIHVyLmFjdGlvbihcImFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU21hcnRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NtYXJ0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XG4gICAgdXIuYWN0aW9uKFwiY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKTtcblxuICAgIC8vIHJlZ2lzdGVyIGdlbmVyYWwgYWN0aW9uc1xuICAgIHVyLmFjdGlvbihcInJlc2l6ZU5vZGVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2Rlcyk7XG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsKTtcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VEYXRhXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEpO1xuICAgIHVyLmFjdGlvbihcInVwZGF0ZVNldEZpZWxkXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZVNldEZpZWxkLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVTZXRGaWVsZCk7XG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlQ3NzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzKTtcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VCZW5kUG9pbnRzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMpO1xuICAgIHVyLmFjdGlvbihcImNoYW5nZUZvbnRQcm9wZXJ0aWVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcyk7XG4gICAgdXIuYWN0aW9uKFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1MYXlvdXQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUxheW91dCk7XG4gICAgdXIuYWN0aW9uKFwiaGlkZUFuZFBlcmZvcm1MYXlvdXRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuaGlkZUFuZFBlcmZvcm1MYXlvdXQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9IaWRlQW5kUGVyZm9ybUxheW91dCk7XG4gICAgdXIuYWN0aW9uKFwiZGVsZXRlQW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVBbmRQZXJmb3JtTGF5b3V0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvRGVsZXRlQW5kUGVyZm9ybUxheW91dCk7XG4gICAgdXIuYWN0aW9uKFwiYXBwbHlTSUZUb3BvbG9neUdyb3VwaW5nXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFwcGx5U0lGVG9wb2xvZ3lHcm91cGluZywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYXBwbHlTSUZUb3BvbG9neUdyb3VwaW5nKTtcblxuICAgIC8vIHJlZ2lzdGVyIFNCR04gYWN0aW9uc1xuICAgIHVyLmFjdGlvbihcImFkZFN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCk7XG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94KTtcbiAgICB1ci5hY3Rpb24oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMpO1xuICAgIHVyLmFjdGlvbihcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cyk7XG4gICAgdXIuYWN0aW9uKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94KTtcbiAgICB1ci5hY3Rpb24oXCJmaXRVbml0c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5maXRVbml0cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZVVuaXRzKTtcbiAgICB1ci5hY3Rpb24oXCJhZGRCYWNrZ3JvdW5kSW1hZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkQmFja2dyb3VuZEltYWdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVCYWNrZ3JvdW5kSW1hZ2UpO1xuICAgIHVyLmFjdGlvbihcInJlbW92ZUJhY2tncm91bmRJbWFnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVCYWNrZ3JvdW5kSW1hZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEJhY2tncm91bmRJbWFnZSk7XG4gICAgdXIuYWN0aW9uKFwidXBkYXRlQmFja2dyb3VuZEltYWdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUJhY2tncm91bmRJbWFnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlQmFja2dyb3VuZEltYWdlKTtcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VCYWNrZ3JvdW5kSW1hZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmFja2dyb3VuZEltYWdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UpO1xuICAgIHVyLmFjdGlvbihcInVwZGF0ZUluZm9ib3hTdHlsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94U3R5bGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUluZm9ib3hTdHlsZSk7XG4gICAgdXIuYWN0aW9uKFwidXBkYXRlSW5mb2JveE9ialwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94T2JqLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94T2JqKTtcblxuICAgIC8vIHJlZ2lzdGVyIGVhc3kgY3JlYXRpb24gYWN0aW9uc1xuICAgIHVyLmFjdGlvbihcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gICAgdXIuYWN0aW9uKFwiY3JlYXRlQWN0aXZhdGlvblJlYWN0aW9uXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUFjdGl2YXRpb25SZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gICAgdXIuYWN0aW9uKFwiY3JlYXRlTWV0YWJvbGljQ2F0YWx5dGljQWN0aXZpdHlcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlTWV0YWJvbGljQ2F0YWx5dGljQWN0aXZpdHksIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICAgIHVyLmFjdGlvbihcImNyZWF0ZU1ldGFib2xpY1JlYWN0aW9uXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZU1ldGFib2xpY1JlYWN0aW9uLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgICB1ci5hY3Rpb24oXCJjcmVhdGVDb252ZXJzaW9uXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbnZlcnNpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICAgIHVyLmFjdGlvbihcImNyZWF0ZVRyYW5zY3JpcHRpb25SZWFjdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUcmFuc2NyaXB0aW9uUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICAgIHVyLmFjdGlvbihcImNyZWF0ZVRyYW5zbGF0aW9uUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVHJhbnNsYXRpb25SZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gICAgdXIuYWN0aW9uKFwic2V0RGVmYXVsdFByb3BlcnR5XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5KTtcbiAgICB1ci5hY3Rpb24oXCJjb252ZXJ0SW50b1JldmVyc2libGVSZWFjdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jb252ZXJ0SW50b1JldmVyc2libGVSZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY29udmVydEludG9SZXZlcnNpYmxlUmVhY3Rpb24pO1xuXG4gICAgdXIuYWN0aW9uKFwibW92ZUVkZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMubW92ZUVkZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLm1vdmVFZGdlKTtcbiAgICB1ci5hY3Rpb24oXCJmaXhFcnJvclwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5maXhFcnJvcix1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmZpeEVycm9yKTtcbiAgICB1ci5hY3Rpb24oXCJjbG9uZUhpZ2hEZWdyZWVOb2RlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNsb25lSGlnaERlZ3JlZU5vZGUsdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5DbG9uZUhpZ2hEZWdyZWVOb2RlKTtcblxuICAgIHVyLmFjdGlvbihcImNoYW5nZU1hcFR5cGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTWFwVHlwZSx1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VNYXBUeXBlKTtcbiAgICB1ci5hY3Rpb24oXCJzZXRDb21wb3VuZFBhZGRpbmdcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q29tcG91bmRQYWRkaW5nLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDb21wb3VuZFBhZGRpbmcpO1xuXG4gIH07XG5cbiAgcmV0dXJuIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zO1xufTtcbiIsInZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgaW5zdGFuY2U7XG5cbiAgZnVuY3Rpb24gc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzIChvcHRpb25zKSB7XG5cbiAgICBpbnN0YW5jZSA9IGxpYnMuc2JnbnZpeihvcHRpb25zKTtcblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0Q3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5nZXRDeSgpO1xuICB9XG5cbiAgcmV0dXJuIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcztcbn07XG4iLCJ2YXIgaXNFcXVhbCA9IHJlcXVpcmUoJ2xvZGFzaC5pc2VxdWFsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgdmFyIGN5LCBlbGVtZW50VXRpbGl0aWVzO1xuICB2YXIgZ3JvdXBDb21wb3VuZFR5cGUsIG1ldGFFZGdlSWRlbnRpZmllciwgbG9ja0dyYXBoVG9wb2xvZ3ksIHNob3VsZEFwcGx5O1xuXG4gIHZhciBERUZBVUxUX0dST1VQX0NPTVBPVU5EX1RZUEUgPSAndG9wb2xvZ3kgZ3JvdXAnO1xuICB2YXIgRURHRV9TVFlMRV9OQU1FUyA9IFsgJ2xpbmUtY29sb3InLCAnd2lkdGgnIF07XG5cbiAgZnVuY3Rpb24gdG9wb2xvZ3lHcm91cGluZyggcGFyYW0sIHByb3BzICkge1xuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KClcbiAgICBlbGVtZW50VXRpbGl0aWVzID0gcGFyYW0uZWxlbWVudFV0aWxpdGllcztcblxuICAgIGdyb3VwQ29tcG91bmRUeXBlID0gcHJvcHMuZ3JvdXBDb21wb3VuZFR5cGUgfHwgREVGQVVMVF9HUk9VUF9DT01QT1VORF9UWVBFO1xuICAgIG1ldGFFZGdlSWRlbnRpZmllciA9IHByb3BzLm1ldGFFZGdlSWRlbnRpZmllcjtcbiAgICBsb2NrR3JhcGhUb3BvbG9neSA9IHByb3BzLmxvY2tHcmFwaFRvcG9sb2d5O1xuICAgIHNob3VsZEFwcGx5ID0gcHJvcHMuc2hvdWxkQXBwbHkgfHwgdHJ1ZTtcblxuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9IGZhbHNlO1xuICAgIGluaXRNZXRhU3R5bGVNYXAoKTtcbiAgfVxuXG4gIHRvcG9sb2d5R3JvdXBpbmcuYXBwbHkgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCB8fCAhZXZhbE9wdCggc2hvdWxkQXBwbHkgKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbGlzdCA9IGN5Lm5vZGVzKCkubWFwKCBmdW5jdGlvbiggbm9kZSApIHtcbiAgICAgIHJldHVybiBbIG5vZGUgXTtcbiAgICB9ICk7XG5cbiAgICAvLyBkZXRlcm1pbmUgbm9kZSBncm91cHMgYnkgdGhlaXIgdG9wb2xvZ3lcbiAgICB2YXIgZ3JvdXBzID0gZ2V0Tm9kZUdyb3VwcyggbGlzdCApO1xuICAgIFxuICAgIC8vIGFwcGx5IGdyb3VwaW5nIGluIGN5IGxldmVsXG4gICAgdmFyIG1ldGFFZGdlcyA9IHRvcG9sb2d5R3JvdXBpbmcuZ2V0TWV0YUVkZ2VzKCk7XG4gICAgdmFyIGNvbXBvdW5kcyA9IHRvcG9sb2d5R3JvdXBpbmcuZ2V0R3JvdXBDb21wb3VuZHMoKTtcbiAgXHRhcHBseUdyb3VwaW5nKGdyb3VwcywgbWV0YUVkZ2VzLCBjb21wb3VuZHMpO1xuXG4gICAgdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkID0gdHJ1ZTtcblxuICAgIGlmICggbG9ja0dyYXBoVG9wb2xvZ3kgKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmxvY2tHcmFwaFRvcG9sb2d5KCk7XG4gICAgfVxuXG4gIFx0cmV0dXJuIGdyb3VwcztcbiAgfTtcblxuICB0b3BvbG9neUdyb3VwaW5nLnVuYXBwbHkgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoICF0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG1ldGFFZGdlcyA9IHRvcG9sb2d5R3JvdXBpbmcuZ2V0TWV0YUVkZ2VzKCk7XG4gICAgbWV0YUVkZ2VzLmZvckVhY2goIGZ1bmN0aW9uKCBlZGdlICkge1xuICAgICAgdmFyIHRvUmVzdG9yZSA9IGVkZ2UuZGF0YSgndGctdG8tcmVzdG9yZScpO1xuICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgIHRvUmVzdG9yZS5yZXN0b3JlKCk7XG5cbiAgICAgIEVER0VfU1RZTEVfTkFNRVMuZm9yRWFjaCggZnVuY3Rpb24oIG5hbWUgKSB7XG4gICAgICAgIHZhciBvbGRWYWwgPSB0b3BvbG9neUdyb3VwaW5nLm1ldGFTdHlsZU1hcFsgbmFtZSBdWyBlZGdlLmlkKCkgXTtcbiAgICAgICAgdmFyIG5ld1ZhbCA9IGVkZ2UuZGF0YSggbmFtZSApO1xuXG4gICAgICAgIGlmICggb2xkVmFsICE9PSBuZXdWYWwgKSB7XG4gICAgICAgICAgdG9SZXN0b3JlLmRhdGEoIG5hbWUsIG5ld1ZhbCApO1xuICAgICAgICB9XG4gICAgICB9ICk7XG4gICAgfSApO1xuXG4gICAgaW5pdE1ldGFTdHlsZU1hcCgpO1xuXG4gICAgdmFyIHBhcmVudHMgPSB0b3BvbG9neUdyb3VwaW5nLmdldEdyb3VwQ29tcG91bmRzKCk7XG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQoIHBhcmVudHMuY2hpbGRyZW4oKSwgbnVsbCApO1xuICAgIHBhcmVudHMucmVtb3ZlKCk7XG5cbiAgICB0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgPSBmYWxzZTtcblxuICAgIGlmICggbG9ja0dyYXBoVG9wb2xvZ3kgKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnVubG9ja0dyYXBoVG9wb2xvZ3koKTtcbiAgICB9XG4gIH07XG5cbiAgdG9wb2xvZ3lHcm91cGluZy5nZXRNZXRhRWRnZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWV0YUVkZ2VzID0gY3kuZWRnZXMoJ1snICsgbWV0YUVkZ2VJZGVudGlmaWVyICsgJ10nKTtcbiAgICByZXR1cm4gbWV0YUVkZ2VzO1xuICB9O1xuXG4gIHRvcG9sb2d5R3JvdXBpbmcuZ2V0R3JvdXBDb21wb3VuZHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2xhc3NOYW1lID0gZ3JvdXBDb21wb3VuZFR5cGU7XG4gICAgcmV0dXJuIGN5Lm5vZGVzKCdbY2xhc3M9XCInICsgY2xhc3NOYW1lICsgJ1wiXScpO1xuICB9O1xuXG4gIHRvcG9sb2d5R3JvdXBpbmcuY2xlYXJBcHBsaWVkRmxhZyA9IGZ1bmN0aW9uKCkge1xuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9IGZhbHNlO1xuICB9O1xuXG4gIHRvcG9sb2d5R3JvdXBpbmcuc2V0QXBwbGllZEZsYWcgPSBmdW5jdGlvbihhcHBsaWVkKSB7XG4gICAgdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkID0gYXBwbGllZDtcbiAgfTtcblxuICB0b3BvbG9neUdyb3VwaW5nLnRvZ2dsZUFwcGxpZWRGbGFnID0gZnVuY3Rpb24oKSB7XG4gICAgdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkID0gIXRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZDtcbiAgfTtcblxuICBmdW5jdGlvbiBpbml0TWV0YVN0eWxlTWFwKCkge1xuICAgIHRvcG9sb2d5R3JvdXBpbmcubWV0YVN0eWxlTWFwID0ge307XG4gICAgRURHRV9TVFlMRV9OQU1FUy5mb3JFYWNoKCBmdW5jdGlvbiggbmFtZSApIHtcbiAgICAgIHRvcG9sb2d5R3JvdXBpbmcubWV0YVN0eWxlTWFwWyBuYW1lIF0gPSB7fTtcbiAgICB9ICk7XG4gIH1cblxuICBmdW5jdGlvbiBldmFsT3B0KCBvcHQgKSB7XG4gICAgaWYgKCB0eXBlb2Ygb3B0ID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgcmV0dXJuIG9wdCgpO1xuICAgIH1cblxuICAgIHJldHVybiBvcHQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXROb2RlR3JvdXBzKCBsaXN0ICkge1xuICAgIGlmICggbGlzdC5sZW5ndGggPD0gMSApIHtcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIHZhciBoYWx2ZXMgPSBnZXRIYWx2ZXMoIGxpc3QgKTtcbiAgICB2YXIgZmlyc3RQYXJ0ID0gZ2V0Tm9kZUdyb3VwcyggaGFsdmVzWyAwIF0gKTtcbiAgICB2YXIgc2Vjb25kUGFydCA9IGdldE5vZGVHcm91cHMoIGhhbHZlc1sgMSBdICk7XG4gICAgLy8gbWVyZ2UgdGhlIGhhbHZlc1xuXHQgIHZhciBncm91cHMgPSBtZXJnZUdyb3VwcyggZmlyc3RQYXJ0LCBzZWNvbmRQYXJ0ICk7XG5cbiAgICByZXR1cm4gZ3JvdXBzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGFyZW50T3JTZWxmKCBub2RlICkge1xuICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpO1xuICAgIHJldHVybiBwYXJlbnQuc2l6ZSgpID4gMCA/IHBhcmVudCA6IG5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBjYWxjR3JvdXBpbmdLZXkoIGVkZ2UgKSB7XG4gICAgdmFyIHNyY0lkID0gZ2V0UGFyZW50T3JTZWxmKCBlZGdlLnNvdXJjZSgpICkuaWQoKTtcbiAgICB2YXIgdGd0SWQgPSBnZXRQYXJlbnRPclNlbGYoIGVkZ2UudGFyZ2V0KCkgKS5pZCgpO1xuICAgIHZhciBlZGdlVHlwZSA9IGdldEVkZ2VUeXBlKCBlZGdlICk7XG5cbiAgICByZXR1cm4gWyBlZGdlVHlwZSwgc3JjSWQsIHRndElkIF0uam9pbiggJy0nICk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRUb01hcENoYWluKCBtYXAsIGtleSwgdmFsICkge1xuICAgIGlmICggIW1hcFsga2V5IF0gKSB7XG4gICAgICBtYXBbIGtleSBdID0gY3kuY29sbGVjdGlvbigpO1xuICAgIH1cblxuICAgIG1hcFsga2V5IF0gPSBtYXBbIGtleSBdLmFkZCggdmFsICk7XG4gIH1cblxuICBmdW5jdGlvbiBhcHBseUdyb3VwaW5nKGdyb3VwcywgbWV0YUVkZ2VzLCBncm91cENvbXBvdW5kcykge1xuICAgIHZhciBjb21wb3VuZHM7XG5cbiAgICBpZiAoZ3JvdXBDb21wb3VuZHMubGVuZ3RoID4gMCkge1xuICAgICAgY29tcG91bmRzID0gZ3JvdXBDb21wb3VuZHM7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cCApIHtcbiAgICAgICAgY3JlYXRlR3JvdXBDb21wb3VuZCggZ3JvdXAgKTtcbiAgICAgIH0gKTtcbiAgXG4gICAgICBjb21wb3VuZHMgPSB0b3BvbG9neUdyb3VwaW5nLmdldEdyb3VwQ29tcG91bmRzKCk7XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkcmVuRWRnZXMgPSBjb21wb3VuZHMuY2hpbGRyZW4oKS5jb25uZWN0ZWRFZGdlcygpO1xuICAgIHZhciBlZGdlc01hcCA9IFtdO1xuXG4gICAgY2hpbGRyZW5FZGdlcy5mb3JFYWNoKCBmdW5jdGlvbiggZWRnZSApe1xuICAgICAgdmFyIGtleSA9IGNhbGNHcm91cGluZ0tleSggZWRnZSApO1xuICAgICAgYWRkVG9NYXBDaGFpbiggZWRnZXNNYXAsIGtleSwgZWRnZSApO1xuICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICB9ICk7XG5cbiAgICBpZiAobWV0YUVkZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIE9iamVjdC5rZXlzKCBlZGdlc01hcCApLmZvckVhY2goIGZ1bmN0aW9uKCBrZXkgKSB7XG4gICAgICAgIHZhciBlZGdlcyA9IGVkZ2VzTWFwW2tleV07XG4gICAgICAgIHZhciB0ZW1wID0gZWRnZXNbMF07XG4gICAgICAgIHZhciBtZXRhRWRnZSA9IG1ldGFFZGdlcy5maWx0ZXIoZWRnZSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGVkZ2Uuc291cmNlKCkuaWQoKSA9PT0gZ2V0UGFyZW50T3JTZWxmKCB0ZW1wLnNvdXJjZSgpICkuaWQoKSAmJlxuICAgICAgICAgICAgICAgICAgZWRnZS50YXJnZXQoKS5pZCgpID09PSBnZXRQYXJlbnRPclNlbGYoIHRlbXAudGFyZ2V0KCkgKS5pZCgpO1xuICAgICAgICB9KVswXTtcbiAgICAgICAgbWV0YUVkZ2UuZGF0YSggJ3RnLXRvLXJlc3RvcmUnLCBlZGdlcyApO1xuICAgICAgICBlZGdlcy5yZW1vdmUoKTtcbiAgICAgIH0gKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBPYmplY3Qua2V5cyggZWRnZXNNYXAgKS5mb3JFYWNoKCBmdW5jdGlvbigga2V5ICkge1xuICAgICAgICBjcmVhdGVNZXRhRWRnZUZvciggZWRnZXNNYXBbIGtleSBdICk7XG4gICAgICB9ICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlR3JvdXBDb21wb3VuZCggZ3JvdXAgKSB7XG4gICAgaWYgKCBncm91cC5sZW5ndGggPCAyICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBjb2xsZWN0aW9uID0gY3kuY29sbGVjdGlvbigpO1xuXG4gICAgZ3JvdXAuZm9yRWFjaCggZnVuY3Rpb24oIG5vZGUgKSB7XG4gICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbi5hZGQoIG5vZGUgKTtcbiAgICB9ICk7XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyggY29sbGVjdGlvbiwgZ3JvdXBDb21wb3VuZFR5cGUgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU1ldGFFZGdlRm9yKCBlZGdlcyApIHtcbiAgICB2YXIgc3JjSWQgPSBnZXRQYXJlbnRPclNlbGYoIGVkZ2VzLnNvdXJjZSgpICkuaWQoKTtcbiAgICB2YXIgdGd0SWQgPSBnZXRQYXJlbnRPclNlbGYoIGVkZ2VzLnRhcmdldCgpICkuaWQoKTtcbiAgICB2YXIgdHlwZSA9IGVkZ2VzLmRhdGEoICdjbGFzcycgKTtcbiAgICBjeS5yZW1vdmUoIGVkZ2VzICk7XG5cbiAgICB2YXIgbWV0YUVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UoIHNyY0lkLCB0Z3RJZCwgdHlwZSApO1xuICAgIG1ldGFFZGdlLmRhdGEoICd0Zy10by1yZXN0b3JlJywgZWRnZXMgKTtcbiAgICBtZXRhRWRnZS5kYXRhKCBtZXRhRWRnZUlkZW50aWZpZXIsIHRydWUgKTtcblxuICAgIEVER0VfU1RZTEVfTkFNRVMuZm9yRWFjaCggZnVuY3Rpb24oIHN0eWxlTmFtZSApIHtcbiAgICAgIGVkZ2VzLmZvckVhY2goIGZ1bmN0aW9uKCBlZGdlICkge1xuICAgICAgICB0b3BvbG9neUdyb3VwaW5nLm1ldGFTdHlsZU1hcFsgc3R5bGVOYW1lIF1bIGVkZ2UuaWQoKSBdID0gZWRnZS5kYXRhKCBzdHlsZU5hbWUgKTtcbiAgICAgIH0gKTtcblxuICAgICAgdmFyIGNvbW1vblZhbCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q29tbW9uUHJvcGVydHkoZWRnZXMsIHN0eWxlTmFtZSwgJ2RhdGEnKTtcbiAgICAgIGlmICggY29tbW9uVmFsICkge1xuICAgICAgICBtZXRhRWRnZS5kYXRhKCBzdHlsZU5hbWUsIGNvbW1vblZhbCApO1xuICAgICAgfVxuICAgIH0gKTtcblxuICAgIHJldHVybiBtZXRhRWRnZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlR3JvdXBzKCBncm91cHMxLCBncm91cHMyICkge1xuICAgIC8vIG5vdE1lcmdlZEdycyB3aWxsIGluY2x1ZGUgbWVtYmVycyBvZiBncm91cHMxIHRoYXQgYXJlIG5vdCBtZXJnZWRcbiAgXHQvLyBtZXJnZWRHcnMgd2lsbCBpbmNsdWRlIHRoZSBtZXJnZWQgbWVtYmVycyBmcm9tIDIgZ3JvdXBzXG4gIFx0dmFyIG5vdE1lcmdlZEdycyA9IFtdLCBtZXJnZWRHcnMgPSBbXTtcblxuICAgIGdyb3VwczEuZm9yRWFjaCggZnVuY3Rpb24oIGdyMSApIHtcbiAgICAgIHZhciBtZXJnZWQgPSBmYWxzZTtcblxuICAgICAgbWVyZ2VkR3JzLmNvbmNhdCggZ3JvdXBzMiApLmZvckVhY2goIGZ1bmN0aW9uKCBncjIsIGluZGV4MiApIHtcbiAgICAgICAgLy8gaWYgZ3JvdXBzIHNob3VsZCBiZSBtZXJnZWQgbWVyZ2UgdGhlbSwgcmVtb3ZlIGdyMiBmcm9tIHdoZXJlIGl0XG4gICAgICAgIC8vIGNvbWVzIGZyb20gYW5kIHB1c2ggdGhlIG1lcmdlIHJlc3VsdCB0byBtZXJnZWRHcnNcbiAgICAgICAgaWYgKCBzaG91bGRNZXJnZSggZ3IxLCBncjIgKSApIHtcbiAgICAgICAgICB2YXIgbWVyZ2VkR3IgPSBncjEuY29uY2F0KCBncjIgKTtcblxuICAgICAgICAgIGlmICggaW5kZXgyID49IG1lcmdlZEdycy5sZW5ndGggKSB7XG4gICAgICAgICAgICByZW1vdmVBdCggZ3JvdXBzMiwgaW5kZXgyIC0gbWVyZ2VkR3JzLmxlbmd0aCApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlbW92ZUF0KCBtZXJnZWRHcnMsIGluZGV4MiApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIG1hcmsgYXMgbWVyZ2VkIGFuZCBicmVhayB0aGUgbG9vcFxuICAgICAgICAgIG1lcmdlZEdycy5wdXNoKCBtZXJnZWRHciApO1xuICAgICAgICAgIG1lcmdlZCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9ICk7XG5cbiAgICAgIC8vIGlmIGdyMSBpcyBub3QgbWVyZ2VkIHB1c2ggaXQgdG8gbm90TWVyZ2VkR3JzXG4gICAgICBpZiAoICFtZXJnZWQgKSB7XG4gICAgICAgIG5vdE1lcmdlZEdycy5wdXNoKCBncjEgKTtcbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAvLyB0aGUgZ3JvdXBzIHRoYXQgY29tZXMgZnJvbSBncm91cHMyIGJ1dCBub3QgbWVyZ2VkIGFyZSBzdGlsbCBpbmNsdWRlZFxuXHQgIC8vIGluIGdyb3VwczIgYWRkIHRoZW0gdG8gdGhlIHJlc3VsdCB0b2dldGhlciB3aXRoIG1lcmdlZEdycyBhbmQgbm90TWVyZ2VkR3JzXG4gICAgcmV0dXJuIG5vdE1lcmdlZEdycy5jb25jYXQoIG1lcmdlZEdycywgZ3JvdXBzMiApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkTWVyZ2UoIGdyb3VwMSwgZ3JvdXAyICkge1xuICAgIC8vIHVzaW5nIGZpcnN0IGVsZW1lbnRzIGlzIGVub3VnaCB0byBkZWNpZGUgd2hldGhlciB0byBtZXJnZVxuICBcdHZhciBub2RlMSA9IGdyb3VwMVsgMCBdO1xuICBcdHZhciBub2RlMiA9IGdyb3VwMlsgMCBdO1xuXG4gICAgaWYgKCBub2RlMS5lZGdlcygpLmxlbmd0aCAhPT0gbm9kZTIuZWRnZXMoKS5sZW5ndGggKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGdldFVuZGlyZWN0ZWRFZGdlcyA9IGZ1bmN0aW9uKCBub2RlICkge1xuICAgICAgdmFyIGVkZ2VzID0gbm9kZS5jb25uZWN0ZWRFZGdlcygpLmZpbHRlciggaXNVbmRpcmVjdGVkRWRnZSApO1xuICAgICAgcmV0dXJuIGVkZ2VzO1xuICAgIH07XG4gICAgLy8gdW5kaXJlY3RlZCBlZGdlcyBvZiBub2RlMSBhbmQgbm9kZTIgcmVzcGVjdGl2ZWx5XG4gICAgdmFyIHVuZGlyMSA9IGdldFVuZGlyZWN0ZWRFZGdlcyggbm9kZTEgKTtcbiAgICB2YXIgdW5kaXIyID0gZ2V0VW5kaXJlY3RlZEVkZ2VzKCBub2RlMiApO1xuXG4gICAgdmFyIGluMSA9IG5vZGUxLmluY29tZXJzKCkuZWRnZXMoKS5ub3QoIHVuZGlyMSApO1xuICAgIHZhciBpbjIgPSBub2RlMi5pbmNvbWVycygpLmVkZ2VzKCkubm90KCB1bmRpcjIgKTtcblxuICAgIHZhciBvdXQxID0gbm9kZTEub3V0Z29lcnMoKS5lZGdlcygpLm5vdCggdW5kaXIxICk7XG5cdCAgdmFyIG91dDIgPSBub2RlMi5vdXRnb2VycygpLmVkZ2VzKCkubm90KCB1bmRpcjIgKTtcblxuICAgIHJldHVybiBjb21wYXJlRWRnZUdyb3VwKCBpbjEsIGluMiwgbm9kZTEsIG5vZGUyIClcbiAgICAgICAgICAgICYmIGNvbXBhcmVFZGdlR3JvdXAoIG91dDEsIG91dDIsIG5vZGUxLCBub2RlMiApXG4gICAgICAgICAgICAmJiBjb21wYXJlRWRnZUdyb3VwKCB1bmRpcjEsIHVuZGlyMiwgbm9kZTEsIG5vZGUyICk7XG4gIH1cblxuICAvLyBkZWNpZGUgaWYgMiBlZGdlIGdyb3VwcyBjb250YWlucyBzZXQgb2YgZWRnZXMgd2l0aCBzaW1pbGFyIGNvbnRlbnQgKHR5cGUsXG4gIC8vIHNvdXJjZSx0YXJnZXQpIHJlbGF0aXZlIHRvIHRoZWlyIG5vZGVzIHdoZXJlIGdyMSBhcmUgZWRnZXMgb2Ygbm9kZTEgYW5kIGdyMiBhcmUgZWRnZXMgb2ZcbiAgLy8gbm9kZTJcbiAgZnVuY3Rpb24gY29tcGFyZUVkZ2VHcm91cCggZ3IxLCBncjIsIG5vZGUxLCBub2RlMiApIHtcbiAgICB2YXIgaWQxID0gbm9kZTEuaWQoKTtcbiAgICB2YXIgaWQyID0gbm9kZTIuaWQoKTtcblxuICAgIHZhciBtYXAxID0gZmlsbElkVG9UeXBlU2V0TWFwKCBncjEsIG5vZGUxICk7XG4gICAgdmFyIG1hcDIgPSBmaWxsSWRUb1R5cGVTZXRNYXAoIGdyMiwgbm9kZTIgKTtcblxuICAgIGlmICggT2JqZWN0LmtleXMoIG1hcDEgKS5sZW5ndGggIT09IE9iamVjdC5rZXlzKCBtYXAyICkubGVuZ3RoICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBmYWlsZWQgPSBmYWxzZTtcblxuICAgIE9iamVjdC5rZXlzKCBtYXAxICkuZm9yRWFjaCggZnVuY3Rpb24oIGtleSApIHtcbiAgICAgIC8vIGlmIGFscmVhZHkgZmFpbGVkIGp1c3QgcmV0dXJuXG4gICAgICBpZiAoIGZhaWxlZCApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiBrZXkgaXMgaWQyIHVzZSBpZDEgaW5zdGVhZCBiZWNhdXNlIGNvbXBhcmlzb24gaXMgcmVsYXRpdmUgdG8gbm9kZXNcbiAgICAgIHZhciBvdGhlcktleSA9ICgga2V5ID09IGlkMiApID8gaWQxIDoga2V5O1xuXG4gICAgICAvLyBjaGVjayBpZiB0aGUgc2V0cyBoYXZlIHRoZSBzYW1lIGNvbnRlbnRcbiAgXHRcdC8vIGlmIGNoZWNrIGZhaWxzIHJldHVybiBmYWxzZVxuICAgICAgaWYgKCAhaXNFcXVhbCggbWFwMVsga2V5IF0sIG1hcDJbIG90aGVyS2V5IF0gKSApIHtcbiAgICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAvLyBpZiBjaGVjayBwYXNzZXMgZm9yIGVhY2gga2V5IHJldHVybiB0cnVlXG4gICAgcmV0dXJuICFmYWlsZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBmaWxsSWRUb1R5cGVTZXRNYXAoIGVkZ2VHcm91cCwgbm9kZSApIHtcbiAgICB2YXIgbWFwID0ge307XG4gICAgdmFyIG5vZGVJZCA9IG5vZGUuaWQoKTtcblxuICAgIGVkZ2VHcm91cC5mb3JFYWNoKCBmdW5jdGlvbiggZWRnZSApIHtcbiAgICAgIHZhciBzcmNJZCA9IGVkZ2UuZGF0YSgnc291cmNlJyk7XG4gICAgICB2YXIgdGd0SWQgPSBlZGdlLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgdmFyIGVkZ2VJZCA9IGVkZ2UuaWQoKTtcblxuICAgICAgdmFyIG90aGVyRW5kID0gKCBub2RlSWQgPT09IHRndElkICkgPyBzcmNJZCA6IHRndElkO1xuXG4gICAgICBmdW5jdGlvbiBhZGRUb1JlbGF0ZWRTZXQoIHNpZGVTdHIsIHZhbHVlICkge1xuICAgICAgICBpZiAoICFtYXBbIHNpZGVTdHIgXSApIHtcbiAgICAgICAgICBtYXBbIHNpZGVTdHIgXSA9IG5ldyBTZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hcFsgc2lkZVN0ciBdLmFkZCggdmFsdWUgKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGVkZ2VUeXBlID0gZ2V0RWRnZVR5cGUoIGVkZ2UgKTtcblxuICAgICAgYWRkVG9SZWxhdGVkU2V0KCBvdGhlckVuZCwgZWRnZVR5cGUgKTtcbiAgICB9ICk7XG5cbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RWRnZVR5cGUoIGVkZ2UgKSB7XG4gICAgcmV0dXJuIGVkZ2UuZGF0YSggJ2NsYXNzJyApO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNVbmRpcmVjdGVkRWRnZSggZWRnZSApIHtcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc1VuZGlyZWN0ZWRFZGdlKCBlZGdlICk7XG4gIH1cblxuICAvLyBnZXQgaGFsdmVzIG9mIGEgbGlzdC4gSXQgaXMgYXNzdW1lZCB0aGF0IGxpc3Qgc2l6ZSBpcyBhdCBsZWFzdCAyLlxuICBmdW5jdGlvbiBnZXRIYWx2ZXMoIGxpc3QgKSB7XG4gICAgdmFyIHMgPSBsaXN0Lmxlbmd0aDtcbiAgICB2YXIgaGFsZkluZGV4ID0gTWF0aC5mbG9vciggcyAvIDIgKTtcbiAgICB2YXIgZmlyc3RIYWxmID0gbGlzdC5zbGljZSggMCwgaGFsZkluZGV4ICk7XG4gICAgdmFyIHNlY29uZEhhbGYgPSBsaXN0LnNsaWNlKCBoYWxmSW5kZXgsIHMgKTtcblxuICAgIHJldHVybiBbIGZpcnN0SGFsZiwgc2Vjb25kSGFsZiBdO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQXQoIGFyciwgaW5kZXggKSB7XG4gICAgYXJyLnNwbGljZSggaW5kZXgsIDEgKTtcbiAgfVxuXG4gIHJldHVybiB0b3BvbG9neUdyb3VwaW5nO1xufTtcbiIsIi8vIEV4dGVuZHMgc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBzYmdudml6SW5zdGFuY2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLCBlbGVtZW50VXRpbGl0aWVzLCBjeSwgdG9wb2xvZ3lHcm91cGluZztcblxuICBmdW5jdGlvbiB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc0V4dGVuZGVyIChwYXJhbSkge1xuXG4gICAgc2JnbnZpekluc3RhbmNlID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEluc3RhbmNlKCk7XG4gICAgY3kgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0Q3koKTtcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHNiZ252aXpJbnN0YW5jZS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbiAgICBlbGVtZW50VXRpbGl0aWVzID0gcGFyYW0uZWxlbWVudFV0aWxpdGllcztcbiAgICB0b3BvbG9neUdyb3VwaW5nID0gcGFyYW0uc2lmVG9wb2xvZ3lHcm91cGluZztcblxuICAgIGV4dGVuZCgpO1xuICB9XG5cbiAgLy8gRXh0ZW5kcyB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyB3aXRoIGNoaXNlIHNwZWNpZmljIGZlYXR1cmVzXG4gIGZ1bmN0aW9uIGV4dGVuZCAoKSB7XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hcHBseVNJRlRvcG9sb2d5R3JvdXBpbmcgPSBmdW5jdGlvbihwYXJhbSkge1xuICAgICAgdmFyIG9sZEVsZXMsIG5ld0VsZXM7XG4gICAgICBpZiAoIHBhcmFtLmZpcnN0VGltZSApIHtcbiAgICAgICAgb2xkRWxlcyA9IGN5LmVsZW1lbnRzKCk7XG5cbiAgICAgICAgaWYgKHBhcmFtLmFwcGx5KSB7XG4gICAgICAgICAgdG9wb2xvZ3lHcm91cGluZy5hcHBseSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRvcG9sb2d5R3JvdXBpbmcudW5hcHBseSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3RWxlcyA9IGN5LmVsZW1lbnRzKCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgb2xkRWxlcyA9IHBhcmFtLm9sZEVsZXM7XG4gICAgICAgIG5ld0VsZXMgPSBwYXJhbS5uZXdFbGVzO1xuXG4gICAgICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnVubG9ja0dyYXBoVG9wb2xvZ3koKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmxvY2tHcmFwaFRvcG9sb2d5KCk7XG4gICAgICAgIH1cblxuICAgICAgICBvbGRFbGVzLnJlbW92ZSgpO1xuICAgICAgICBuZXdFbGVzLnJlc3RvcmUoKTtcblxuICAgICAgICB0b3BvbG9neUdyb3VwaW5nLnRvZ2dsZUFwcGxpZWRGbGFnKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXN1bHQgPSB7IG9sZEVsZXM6IG5ld0VsZXMsIG5ld0VsZXM6IG9sZEVsZXMgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8vIFNlY3Rpb24gU3RhcnRcbiAgICAvLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZE5vZGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICAgIHZhciBuZXdOb2RlID0gcGFyYW0ubmV3Tm9kZTtcbiAgICAgICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5ld05vZGUueCwgbmV3Tm9kZS55LCBuZXdOb2RlLmNsYXNzLCBuZXdOb2RlLmlkLCBuZXdOb2RlLnBhcmVudCwgbmV3Tm9kZS52aXNpYmlsaXR5KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZWxlczogcmVzdWx0XG4gICAgICB9O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRFZGdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICB2YXIgbmV3RWRnZSA9IHBhcmFtLm5ld0VkZ2U7XG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdFZGdlLnNvdXJjZSwgbmV3RWRnZS50YXJnZXQsIG5ld0VkZ2UuY2xhc3MsIG5ld0VkZ2UuaWQsIG5ld0VkZ2UudmlzaWJpbGl0eSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IHJlc3VsdFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMgPSBmdW5jdGlvbihwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyhwYXJhbS5zb3VyY2UsIHBhcmFtLnRhcmdldCwgcGFyYW0ucHJvY2Vzc1R5cGUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiByZXN1bHRcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICAgIC8vIE5vZGVzIHRvIG1ha2UgY29tcG91bmQsIHRoZWlyIGRlc2NlbmRhbnRzIGFuZCBlZGdlcyBjb25uZWN0ZWQgdG8gdGhlbSB3aWxsIGJlIHJlbW92ZWQgZHVyaW5nIGNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyBvcGVyYXRpb25cbiAgICAgICAgLy8gKGludGVybmFsbHkgYnkgZWxlcy5tb3ZlKCkgb3BlcmF0aW9uKSwgc28gbWFyayB0aGVtIGFzIHJlbW92ZWQgZWxlcyBmb3IgdW5kbyBvcGVyYXRpb24uXG4gICAgICAgIHZhciBub2Rlc1RvTWFrZUNvbXBvdW5kID0gcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZDtcbiAgICAgICAgdmFyIHJlbW92ZWRFbGVzID0gbm9kZXNUb01ha2VDb21wb3VuZC51bmlvbihub2Rlc1RvTWFrZUNvbXBvdW5kLmRlc2NlbmRhbnRzKCkpO1xuICAgICAgICByZW1vdmVkRWxlcyA9IHJlbW92ZWRFbGVzLnVuaW9uKHJlbW92ZWRFbGVzLmNvbm5lY3RlZEVkZ2VzKCkpO1xuICAgICAgICByZXN1bHQucmVtb3ZlZEVsZXMgPSByZW1vdmVkRWxlcztcbiAgICAgICAgLy8gQXNzdW1lIHRoYXQgYWxsIG5vZGVzIHRvIG1ha2UgY29tcG91bmQgaGF2ZSB0aGUgc2FtZSBwYXJlbnRcbiAgICAgICAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xuICAgICAgICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kXG4gICAgICAgIC8vIE5ldyBlbGVzIGluY2x1ZGVzIG5ldyBjb21wb3VuZCBhbmQgdGhlIG1vdmVkIGVsZXMgYW5kIHdpbGwgYmUgdXNlZCBpbiB1bmRvIG9wZXJhdGlvbi5cbiAgICAgICAgcmVzdWx0Lm5ld0VsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2Rlc1RvTWFrZUNvbXBvdW5kLCBwYXJhbS5jb21wb3VuZFR5cGUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdC5yZW1vdmVkRWxlcyA9IHBhcmFtLm5ld0VsZXMucmVtb3ZlKCk7XG4gICAgICAgIHJlc3VsdC5uZXdFbGVzID0gcGFyYW0ucmVtb3ZlZEVsZXMucmVzdG9yZSgpO1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlcihyZXN1bHQubmV3RWxlcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gYWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIGVsZXM7XG5cbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbihwYXJhbS50ZW1wbGF0ZVR5cGUsIHBhcmFtLm1hY3JvbW9sZWN1bGVMaXN0LCBwYXJhbS5jb21wbGV4TmFtZSwgcGFyYW0ucHJvY2Vzc1Bvc2l0aW9uLCBwYXJhbS50aWxpbmdQYWRkaW5nVmVydGljYWwsIHBhcmFtLnRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBwYXJhbS5lZGdlTGVuZ3RoLCBwYXJhbS5sYXlvdXRQYXJhbSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVzID0gcGFyYW07XG4gICAgICAgIGN5LmFkZChlbGVzKTtcblxuICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICAgIGVsZXMuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IGVsZXNcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUFjdGl2YXRpb25SZWFjdGlvbiA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIGVsZXM7XG5cbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQWN0aXZhdGlvblJlYWN0aW9uKHBhcmFtLnByb3RlaW5OYW1lLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLmVkZ2VMZW5ndGgsIHBhcmFtLnJldmVyc2UpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcyA9IHBhcmFtO1xuICAgICAgICBjeS5hZGQoZWxlcyk7XG5cbiAgICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgICBlbGVzLnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiBlbGVzXG4gICAgICB9O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb252ZXJzaW9uID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgIGxldCBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XG4gICAgICBsZXQgZWxlcztcblxuICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICBlbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb252ZXJzaW9uKHBhcmFtLm1hY3JvbW9sZWN1bGVOYW1lLCBwYXJhbS5yZWd1bGF0b3IsIHBhcmFtLnJlZ3VsYXRvck11bHRpbWVyLCBwYXJhbS5vcmllbnRhdGlvbiwgcGFyYW0uaW5wdXRJbmZvYm94TGFiZWwsIHBhcmFtLm91dHB1dEluZm9ib3hMYWJlbCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcyA9IHBhcmFtO1xuICAgICAgICBjeS5hZGQoZWxlcyk7XG5cbiAgICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgICBlbGVzLnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiBlbGVzXG4gICAgICB9O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVNZXRhYm9saWNSZWFjdGlvbiA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICBsZXQgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgbGV0IGVsZXM7XG5cbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlTWV0YWJvbGljUmVhY3Rpb24ocGFyYW0uaW5wdXRzLCBwYXJhbS5vdXRwdXRzLCBwYXJhbS5yZXZlcnNpYmxlLCBwYXJhbS5yZWd1bGF0b3IsIHBhcmFtLnJlZ3VsYXRvck11bHRpbWVyLCBwYXJhbS5vcmllbnRhdGlvbik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcyA9IHBhcmFtO1xuICAgICAgICBjeS5hZGQoZWxlcyk7XG5cbiAgICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgICBlbGVzLnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiBlbGVzXG4gICAgICB9O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVNZXRhYm9saWNDYXRhbHl0aWNBY3Rpdml0eSA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIGVsZXM7XG5cbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlTWV0YWJvbGljQ2F0YWx5dGljQWN0aXZpdHkocGFyYW0uaW5wdXROb2RlTGlzdCwgcGFyYW0ub3V0cHV0Tm9kZUxpc3QsIHBhcmFtLmNhdGFseXN0TmFtZSwgcGFyYW0uY2F0YWx5c3RUeXBlLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgcGFyYW0udGlsaW5nUGFkZGluZ0hvcml6b250YWwsIHBhcmFtLmVkZ2VMZW5ndGgpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcyA9IHBhcmFtO1xuICAgICAgICBjeS5hZGQoZWxlcyk7XG5cbiAgICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgICBlbGVzLnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiBlbGVzXG4gICAgICB9O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUcmFuc2NyaXB0aW9uUmVhY3Rpb24gPSBmdW5jdGlvbihwYXJhbSkge1xuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgICAgIHZhciBlbGVzO1xuXG4gICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgIGVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRyYW5zY3JpcHRpb25SZWFjdGlvbihwYXJhbS5nZW5lTmFtZSwgcGFyYW0ubVJuYU5hbWUsIHBhcmFtLnByb2Nlc3NQb3NpdGlvbiwgcGFyYW0uZWRnZUxlbmd0aClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVzID0gcGFyYW07XG4gICAgICAgIGN5LmFkZChlbGVzKTtcblxuICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICAgIGVsZXMuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IGVsZXNcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRyYW5zbGF0aW9uUmVhY3Rpb24gPSBmdW5jdGlvbihwYXJhbSkge1xuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgICAgIHZhciBlbGVzO1xuXG4gICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgIGVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRyYW5zbGF0aW9uUmVhY3Rpb24ocGFyYW0ubVJuYU5hbWUsIHBhcmFtLnByb3RlaW5OYW1lLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLmVkZ2VMZW5ndGgpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcyA9IHBhcmFtO1xuICAgICAgICBjeS5hZGQoZWxlcyk7XG5cbiAgICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgICBlbGVzLnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiBlbGVzXG4gICAgICB9O1xuICAgIH07XG5cbiAgICAvLyBTZWN0aW9uIEVuZFxuICAgIC8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xuXG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIGdlbmVyYWwgYWN0aW9uIGZ1bmN0aW9uc1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwb3NpdGlvbnMgPSB7fTtcbiAgICAgIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XG5cbiAgICAgIG5vZGVzLmVhY2goZnVuY3Rpb24oZWxlLCBpKSB7XG4gICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zaXRpb25zW2VsZS5pZCgpXSA9IHtcbiAgICAgICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxuICAgICAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcG9zaXRpb25zO1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyA9IGZ1bmN0aW9uIChwb3NpdGlvbnMpIHtcbiAgICAgIHZhciBjdXJyZW50UG9zaXRpb25zID0ge307XG4gICAgICBjeS5ub2RlcygpLnBvc2l0aW9ucyhmdW5jdGlvbiAoZWxlLCBpKSB7XG4gICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudFBvc2l0aW9uc1tlbGUuaWQoKV0gPSB7XG4gICAgICAgICAgeDogZWxlLnBvc2l0aW9uKFwieFwiKSxcbiAgICAgICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHBvcyA9IHBvc2l0aW9uc1tlbGUuaWQoKV07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgeDogcG9zLngsXG4gICAgICAgICAgeTogcG9zLnlcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gY3VycmVudFBvc2l0aW9ucztcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWVcbiAgICAgIH07XG5cbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gICAgICByZXN1bHQuc2l6ZU1hcCA9IHt9O1xuICAgICAgcmVzdWx0LnVzZUFzcGVjdFJhdGlvID0gZmFsc2U7XG4gICAgICByZXN1bHQucHJlc2VydmVSZWxhdGl2ZVBvcyA9IHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3M7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYobm9kZS5pc1BhcmVudCgpKXtcbiAgICAgICAgICByZXN1bHQuc2l6ZU1hcFtub2RlLmlkKCldID0ge1xuICAgICAgICAgICAgdzogbm9kZS5kYXRhKFwibWluV2lkdGhcIikgfHwgMCxcbiAgICAgICAgICAgIGg6IG5vZGUuZGF0YShcIm1pbkhlaWdodFwiKSB8fCAwLFxuICAgICAgICAgICAgYmlhc0wgOiBub2RlLmRhdGEoXCJtaW5XaWR0aEJpYXNMZWZ0XCIpIHx8IDAsXG4gICAgICAgICAgICBiaWFzUiA6IG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc1JpZ2h0XCIpIHx8IDAsXG4gICAgICAgICAgICBiaWFzVCA6IG5vZGUuZGF0YShcIm1pbkhlaWdodEJpYXNUb3BcIikgfHwgMCxcbiAgICAgICAgICAgIGJpYXNCIDogbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc0JvdHRvbVwiKSB8fCAwXG4gICAgICAgICAgIC8vIHc6IG5vZGUuY3NzKFwibWluV2lkdGhcIikgIT0gMD8gIG5vZGUuZGF0YShcIm1pbldpZHRoXCIpIDogbm9kZS5jaGlsZHJlbigpLmJvdW5kaW5nQm94KCkudyxcbiAgICAgICAgICAgIC8vaDogbm9kZS5jc3MoXCJtaW4taGVpZ2h0XCIpICE9IDA/ICBub2RlLmRhdGEoXCJtaW5IZWlnaHRcIikgOiBub2RlLmNoaWxkcmVuKCkuYm91bmRpbmdCb3goKS5oXG4gICAgICAgICAgfTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgcmVzdWx0LnNpemVNYXBbbm9kZS5pZCgpXSA9IHtcbiAgICAgICAgICAgIHc6IG5vZGUud2lkdGgoKSxcbiAgICAgICAgICAgIGg6IG5vZGUuaGVpZ2h0KClcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgfVxuXG4gICAgICByZXN1bHQubm9kZXMgPSBub2RlcztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuXG4gICAgICAgIGlmIChwYXJhbS5wZXJmb3JtT3BlcmF0aW9uKSB7XG4gICAgICAgICAgaWYgKHBhcmFtLnNpemVNYXApIHtcbiAgICAgICAgICAgIC8qIGlmIChwYXJhbS5wcmVzZXJ2ZVJlbGF0aXZlUG9zID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIHZhciBvbGRXaWR0aCA9IG5vZGUuZGF0YShcImJib3hcIikudztcbiAgICAgICAgICAgICAgdmFyIG9sZEhlaWdodCA9IG5vZGUuZGF0YShcImJib3hcIikuaDtcbiAgICAgICAgICAgIH0gKi9cblxuICAgICAgICAgICAgaWYobm9kZS5pc1BhcmVudCgpKXtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcIm1pbkhlaWdodFwiICwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmgpO1xuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aFwiICwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLncpO1xuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aEJpYXNMZWZ0XCIsIHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5iaWFzTCk7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc1JpZ2h0XCIsIHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5iaWFzUik7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcIm1pbkhlaWdodEJpYXNUb3BcIiwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmJpYXNUKTtcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc0JvdHRvbVwiLCBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uYmlhc0IpO1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLnc7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5oO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICBcblxuICAgICAgICAgICAgLyogaWYgKHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3MgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgICAgICAgICAgICB2YXIgdG9wQm90dG9tID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiAoYm94LmFuY2hvclNpZGUgPT09IFwidG9wXCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwiYm90dG9tXCIpKTtcbiAgICAgICAgICAgICAgdmFyIHJpZ2h0TGVmdCA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gKGJveC5hbmNob3JTaWRlID09PSBcInJpZ2h0XCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwibGVmdFwiKSk7XG5cbiAgICAgICAgICAgICAgdG9wQm90dG9tLmZvckVhY2goZnVuY3Rpb24oYm94KXtcbiAgICAgICAgICAgICAgICBpZiAoYm94LmJib3gueCA8IDApIHtcbiAgICAgICAgICAgICAgICAgIGJveC5iYm94LnggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChib3guYmJveC54ID4gb2xkV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgIGJveC5iYm94LnggPSBvbGRXaWR0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYm94LmJib3gueCA9IG5vZGUuZGF0YShcImJib3hcIikudyAqIGJveC5iYm94LnggLyBvbGRXaWR0aDtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgcmlnaHRMZWZ0LmZvckVhY2goZnVuY3Rpb24oYm94KXtcbiAgICAgICAgICAgICAgICBpZiAoYm94LmJib3gueSA8IDApIHtcbiAgICAgICAgICAgICAgICAgIGJveC5iYm94LnkgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChib3guYmJveC55ID4gb2xkSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICBib3guYmJveC55ID0gb2xkSGVpZ2h0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBib3guYmJveC55ID0gbm9kZS5kYXRhKFwiYmJveFwiKS5oICogYm94LmJib3gueSAvIG9sZEhlaWdodDtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9ICovXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2RlcyhwYXJhbS5ub2RlcywgcGFyYW0ud2lkdGgsIHBhcmFtLmhlaWdodCwgcGFyYW0udXNlQXNwZWN0UmF0aW8sIHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIH07XG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgICAgIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xuICAgICAgcmVzdWx0LmxhYmVsID0ge307XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgcmVzdWx0LmxhYmVsW25vZGUuaWQoKV0gPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBwYXJhbS5sYWJlbCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsID0gcGFyYW0ubGFiZWxbbm9kZS5pZCgpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94U3R5bGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuICAgICAgdmFyIHN0eWxlID0gcGFyYW0ubm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpW3BhcmFtLmluZGV4XS5zdHlsZTtcbiAgICAgIHJlc3VsdC5uZXdQcm9wcyA9ICQuZXh0ZW5kKCB7fSwgc3R5bGUgKTtcbiAgICAgIHJlc3VsdC5ub2RlID0gcGFyYW0ubm9kZTtcbiAgICAgIHJlc3VsdC5pbmRleCA9IHBhcmFtLmluZGV4O1xuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hTdHlsZSggcGFyYW0ubm9kZSwgcGFyYW0uaW5kZXgsIHBhcmFtLm5ld1Byb3BzICk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUluZm9ib3hPYmogPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuICAgICAgdmFyIG9iaiA9IHBhcmFtLm5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKVtwYXJhbS5pbmRleF07XG4gICAgICByZXN1bHQubmV3UHJvcHMgPSAkLmV4dGVuZCgge30sIG9iaiApO1xuICAgICAgcmVzdWx0Lm5vZGUgPSBwYXJhbS5ub2RlO1xuICAgICAgcmVzdWx0LmluZGV4ID0gcGFyYW0uaW5kZXg7XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlSW5mb2JveE9iaiggcGFyYW0ubm9kZSwgcGFyYW0uaW5kZXgsIHBhcmFtLm5ld1Byb3BzICk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuICAgICAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xuICAgICAgcmVzdWx0LnZhbHVlTWFwID0ge307XG4gICAgICByZXN1bHQuZWxlcyA9IGVsZXM7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5kYXRhKHBhcmFtLm5hbWUpO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEocGFyYW0uZWxlcywgcGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXApO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVTZXRGaWVsZCA9IGZ1bmN0aW9uKCBwYXJhbSApIHtcbiAgICAgIHZhciB1cGRhdGVzID0gZWxlbWVudFV0aWxpdGllcy51cGRhdGVTZXRGaWVsZCggcGFyYW0uZWxlLCBwYXJhbS5maWVsZE5hbWUsIHBhcmFtLnRvRGVsZXRlLCBwYXJhbS50b0FkZCwgcGFyYW0uY2FsbGJhY2sgKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgZWxlOiBwYXJhbS5lbGUsXG4gICAgICAgIGZpZWxkTmFtZTogcGFyYW0uZmllbGROYW1lLFxuICAgICAgICBjYWxsYmFjazogcGFyYW0uY2FsbGJhY2ssXG4gICAgICAgIHRvRGVsZXRlOiB1cGRhdGVzLmFkZGVkLFxuICAgICAgICB0b0FkZDogdXBkYXRlcy5kZWxldGVkXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuICAgICAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xuICAgICAgcmVzdWx0LnZhbHVlTWFwID0ge307XG4gICAgICByZXN1bHQuZWxlcyA9IGVsZXM7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5jc3MocGFyYW0ubmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzKHBhcmFtLmVsZXMsIHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlTWFwKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuXG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG4gICAgICByZXN1bHQuZGF0YSA9IHt9O1xuICAgICAgcmVzdWx0LmVsZXMgPSBlbGVzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG5cbiAgICAgICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldID0ge307XG5cbiAgICAgICAgdmFyIGRhdGEgPSBwYXJhbS5maXJzdFRpbWUgPyBwYXJhbS5kYXRhIDogcGFyYW0uZGF0YVtlbGUuaWQoKV07XG5cbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBkYXRhKSB7XG4gICAgICAgICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldW3Byb3BdID0gZWxlLmRhdGEocHJvcCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIGRhdGEpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuXG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGUsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogU2hvdyBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cbiAgICAgKi9cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuXG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICAgIHJlc3VsdC5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChwYXJhbS5lbGVzLCBwYXJhbS5sYXlvdXRwYXJhbSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuc2hvdyhlbGVzKTsgLy8gU2hvdyBnaXZlbiBlbGVzXG4gICAgICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuaGlkZShlbGVzKTsgLy8gSGlkZSBwcmV2aW91c2x5IHVuaGlkZGVuIGVsZXM7XG5cbiAgICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogSGlkZSBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cbiAgICAgKi9cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5oaWRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuXG4gICAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgICAgIHJlc3VsdC5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5oaWRlQW5kUGVyZm9ybUxheW91dChwYXJhbS5lbGVzLCBwYXJhbS5sYXlvdXRwYXJhbSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQuZWxlcyA9IGN5LnZpZXdVdGlsaXRpZXMoKS5oaWRlKGVsZXMpOyAvLyBIaWRlIGdpdmVuIGVsZXNcbiAgICAgICAgICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvSGlkZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcbiAgICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuc2hvdyhlbGVzKTsgLy8gU2hvdyBwcmV2aW91c2x5IGhpZGRlbiBlbGVzXG5cbiAgICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIERlbGV0ZSBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cbiAgICAgKi9cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XG5cbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlQW5kUGVyZm9ybUxheW91dChwYXJhbS5lbGVzLCBwYXJhbS5sYXlvdXRwYXJhbSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgICByZXN1bHQuZWxlcyA9IGVsZXMucmVtb3ZlKCk7XG4gICAgICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvRGVsZXRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuICAgICAgcmVzdWx0LmVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKGVsZXMpOyBcblxuICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIH07XG4gICAgICByZXN1bHQudHlwZSA9IHBhcmFtLnR5cGU7XG4gICAgICByZXN1bHQubm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgICAgIHJlc3VsdC5pbmRleCA9IHBhcmFtLmluZGV4O1xuICAgICAgdmFyIGRhdGEgPSBwYXJhbS5kYXRhO1xuXG4gICAgICB2YXIgdGVtcERhdGEgPSBlbGVtZW50VXRpbGl0aWVzLnNhdmVVbml0cyhwYXJhbS5ub2Rlcyk7XG4gICAgICByZXN1bHQudmFsdWUgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KHBhcmFtLm5vZGVzLCBwYXJhbS5pbmRleCwgcGFyYW0udmFsdWUsIHBhcmFtLnR5cGUpO1xuICAgICAgLyogdmFyIGxvY2F0aW9ucyA9IGVsZW1lbnRVdGlsaXRpZXMuY2hlY2tGaXQocGFyYW0ubm9kZXMpO1xuICAgICAgaWYgKGxvY2F0aW9ucyAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuZml0VW5pdHMocGFyYW0ubm9kZXMsIGxvY2F0aW9ucyk7XG4gICAgICB9ICovXG4gICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZVVuaXRzKHBhcmFtLm5vZGVzLCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcbiAgICAgIHJlc3VsdC5kYXRhID0gdGVtcERhdGE7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIG9iaiA9IHBhcmFtLm9iajtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICAgICAgdmFyIGRhdGEgPSBwYXJhbS5kYXRhO1xuXG4gICAgICB2YXIgdGVtcERhdGEgPSBlbGVtZW50VXRpbGl0aWVzLnNhdmVVbml0cyhub2Rlcyk7XG4gICAgICB2YXIgbG9jYXRpb25PYmogPSBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xuICAgICAvKiAgdmFyIGxvY2F0aW9ucyA9IGVsZW1lbnRVdGlsaXRpZXMuY2hlY2tGaXQobm9kZXMpO1xuICAgICAgaWYgKGxvY2F0aW9ucyAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuZml0VW5pdHMobm9kZXMsIGxvY2F0aW9ucyk7XG4gICAgICB9ICovXG4gICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZVVuaXRzKG5vZGVzLCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBsb2NhdGlvbk9iajogbG9jYXRpb25PYmosXG4gICAgICAgIG9iajogb2JqLFxuICAgICAgICBkYXRhOiB0ZW1wRGF0YVxuICAgICAgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgbG9jYXRpb25PYmogPSBwYXJhbS5sb2NhdGlvbk9iajtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICAgICAgdmFyIGRhdGEgPSBwYXJhbS5kYXRhO1xuXG4gICAgICB2YXIgdGVtcERhdGEgPSBlbGVtZW50VXRpbGl0aWVzLnNhdmVVbml0cyhub2Rlcyk7XG4gICAgICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgbG9jYXRpb25PYmopO1xuICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVVbml0cyhub2RlcywgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgb2JqOiBvYmosXG4gICAgICAgIGRhdGE6IHRlbXBEYXRhXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZml0VW5pdHMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBub2RlID0gcGFyYW0ubm9kZTtcbiAgICAgIHZhciBsb2NhdGlvbnMgPSBwYXJhbS5sb2NhdGlvbnM7XG4gICAgICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5maXRVbml0cyhub2RlLCBsb2NhdGlvbnMpO1xuXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICBvYmo6IG9iaixcbiAgICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnNcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlVW5pdHMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBub2RlID0gcGFyYW0ubm9kZTtcbiAgICAgIHZhciBsb2NhdGlvbnMgPSBwYXJhbS5sb2NhdGlvbnM7XG4gICAgICB2YXIgb2JqID0gcGFyYW0ub2JqO1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5mb3JFYWNoKCBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHZhciBib3ggPSBvYmpbaW5kZXgrK107XG4gICAgICAgIGVsZS5iYm94LnggPSBib3gueDtcbiAgICAgICAgZWxlLmJib3gueSA9IGJveC55O1xuICAgICAgICB2YXIgb2xkU2lkZSA9IGVsZS5hbmNob3JTaWRlO1xuICAgICAgICBlbGUuYW5jaG9yU2lkZSA9IGJveC5hbmNob3JTaWRlO1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1vZGlmeVVuaXRzKG5vZGUsIGVsZSwgb2xkU2lkZSk7XG4gICAgICB9KTtcblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnNcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICAgICAgdmFyIHN0YXR1cyA9IHBhcmFtLnN0YXR1cztcbiAgICAgIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XG5cbiAgICAgICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBpc011bHRpbWVyO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIGNoYW5nZSB0aGUgc3RhdHVzIG9mIGFsbCBub2RlcyBhdCBvbmNlLlxuICAgICAgLy8gSWYgbm90IGNoYW5nZSBzdGF0dXMgb2YgZWFjaCBzZXBlcmF0ZWx5IHRvIHRoZSB2YWx1ZXMgbWFwcGVkIHRvIHRoZWlyIGlkLlxuICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZSwgc3RhdHVzW25vZGUuaWQoKV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAvLyAgaWYgKCFmaXJzdFRpbWUgJiYgXy5pc0VxdWFsKG5vZGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XG4gICAgLy8gICAgJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIikpO1xuICAgIC8vICB9XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHN0YXR1czogcmVzdWx0U3RhdHVzLFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgICAgIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIHJlc3VsdFN0YXR1cyA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHJlc3VsdFN0YXR1c1tub2RlLmlkKCldID0gbm9kZS5kYXRhKCdjbG9uZW1hcmtlcicpO1xuICAgICAgICB2YXIgY3VycmVudFN0YXR1cyA9IGZpcnN0VGltZSA/IHN0YXR1cyA6IHN0YXR1c1tub2RlLmlkKCldO1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGUsIGN1cnJlbnRTdGF0dXMpO1xuICAgICAgfVxuXG4gICAgLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xuICAgIC8vICAgICQoJyNpbnNwZWN0b3ItaXMtY2xvbmUtbWFya2VyJykuYXR0cihcImNoZWNrZWRcIiwgISQoJyNpbnNwZWN0b3ItaXMtY2xvbmUtbWFya2VyJykuYXR0cihcImNoZWNrZWRcIikpO1xuICAgIC8vICB9XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHN0YXR1czogcmVzdWx0U3RhdHVzLFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8vIHBhcmFtOiB7Y2xhc3M6IHNiZ25jbGFzcywgbmFtZTogcHJvcGVydHlOYW1lLCB2YWx1ZTogdmFsdWV9XG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgc2JnbmNsYXNzID0gcGFyYW0uY2xhc3M7XG4gICAgICB2YXIgbmFtZSA9IHBhcmFtLm5hbWU7XG4gICAgICB2YXIgdmFsdWUgPSBwYXJhbS52YWx1ZTtcbiAgICAgIHZhciBjbGFzc0RlZmF1bHRzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhzYmduY2xhc3MpO1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgY2xhc3M6IHNiZ25jbGFzcyxcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgdmFsdWU6IGNsYXNzRGVmYXVsdHMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBjbGFzc0RlZmF1bHRzW25hbWVdIDogdW5kZWZpbmVkXG4gICAgICB9O1xuXG4gICAgICB2YXIgcHJvcE1hcCA9IHt9O1xuICAgICAgcHJvcE1hcFsgbmFtZSBdID0gdmFsdWU7XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0RGVmYXVsdFByb3BlcnRpZXMoIHNiZ25jbGFzcywgcHJvcE1hcCApO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBiZ09iaiA9IHBhcmFtLmJnT2JqO1xuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gICAgICB2YXIgdXBkYXRlSW5mbyA9IHBhcmFtLnVwZGF0ZUluZm87XG4gICAgICB2YXIgcHJvbXB0SW52YWxpZEltYWdlID0gcGFyYW0ucHJvbXB0SW52YWxpZEltYWdlO1xuICAgICAgdmFyIHZhbGlkYXRlVVJMID0gcGFyYW0udmFsaWRhdGVVUkw7XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkQmFja2dyb3VuZEltYWdlKG5vZGVzLCBiZ09iaiwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCk7XG5cbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgYmdPYmo6IGJnT2JqLFxuICAgICAgICB1cGRhdGVJbmZvOiB1cGRhdGVJbmZvLFxuICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2U6IHByb21wdEludmFsaWRJbWFnZSxcbiAgICAgICAgdmFsaWRhdGVVUkw6IHZhbGlkYXRlVVJMXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgYmdPYmogPSBwYXJhbS5iZ09iajtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZShub2RlcywgYmdPYmopO1xuXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGJnT2JqOiBiZ09ialxuICAgICAgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGJnT2JqID0gcGFyYW0uYmdPYmo7XG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcblxuICAgICAgdmFyIG9sZEJnT2JqID0gZWxlbWVudFV0aWxpdGllcy51cGRhdGVCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIGJnT2JqKTtcblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBiZ09iajogb2xkQmdPYmpcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBvbGRJbWcgPSBwYXJhbS5vbGRJbWc7XG4gICAgICB2YXIgbmV3SW1nID0gcGFyYW0ubmV3SW1nO1xuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIHVwZGF0ZUluZm8gPSBwYXJhbS51cGRhdGVJbmZvO1xuICAgICAgdmFyIHByb21wdEludmFsaWRJbWFnZSA9IHBhcmFtLnByb21wdEludmFsaWRJbWFnZTtcbiAgICAgIHZhciB2YWxpZGF0ZVVSTD0gcGFyYW0udmFsaWRhdGVVUkw7XG5cbiAgICAgIHZhciByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUJhY2tncm91bmRJbWFnZShub2Rlcywgb2xkSW1nLCBuZXdJbWcsIGZpcnN0VGltZSwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCk7XG5cbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY29udmVydEludG9SZXZlcnNpYmxlUmVhY3Rpb24gPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIGxldCBjb2xsZWN0aW9uID0gY3kuY29sbGVjdGlvbigpO1xuICAgICAgbGV0IG1hcFR5cGUgPSBlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShwYXJhbS5tYXBUeXBlKTtcbiAgICAgICQoJyNtYXAtdHlwZScpLnZhbChwYXJhbS5tYXBUeXBlKTtcblxuICAgICAgcGFyYW0uY29sbGVjdGlvbi5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2UpIHtcbiAgICAgICAgdmFyIHNvdXJjZU5vZGUgPSBlZGdlLl9wcml2YXRlLmRhdGEuc291cmNlO1xuICAgICAgICB2YXIgdGFyZ2V0Tm9kZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS50YXJnZXQ7XG5cbiAgICAgICAgZWRnZS5tb3ZlKHtzb3VyY2U6IHRhcmdldE5vZGUsIHRhcmdldDogc291cmNlTm9kZX0pO1xuXG4gICAgICAgIGxldCBjb252ZXJ0ZWRFZGdlID0gY3kuZ2V0RWxlbWVudEJ5SWQoZWRnZS5pZCgpKTtcblxuICAgICAgICBpZihjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlc1wiKSl7XG4gICAgICAgICAgbGV0IGRpc3RhbmNlID0gY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXNcIik7XG4gICAgICAgICAgZGlzdGFuY2UgPSBkaXN0YW5jZS5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIC0xKmVsZW1lbnQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXNcIiwgZGlzdGFuY2UucmV2ZXJzZSgpKTtcblxuICAgICAgICAgIGxldCB3ZWlnaHQgPSBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHNcIik7XG4gICAgICAgICAgd2VpZ2h0ID0gd2VpZ2h0Lm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gMS1lbGVtZW50O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWJlbmRlZGl0aW5nV2VpZ2h0c1wiLCB3ZWlnaHQucmV2ZXJzZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWNvbnRyb2xlZGl0aW5nRGlzdGFuY2VzXCIpKXtcbiAgICAgICAgICBsZXQgZGlzdGFuY2UgPSBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2Vjb250cm9sZWRpdGluZ0Rpc3RhbmNlc1wiKTtcbiAgICAgICAgICBkaXN0YW5jZSA9IGRpc3RhbmNlLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gLTEqZWxlbWVudDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2Vjb250cm9sZWRpdGluZ0Rpc3RhbmNlc1wiLCBkaXN0YW5jZS5yZXZlcnNlKCkpO1xuXG4gICAgICAgICAgbGV0IHdlaWdodCA9IGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWNvbnRyb2xlZGl0aW5nV2VpZ3Roc1wiKTtcbiAgICAgICAgICB3ZWlnaHQgPSB3ZWlnaHQubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAxLWVsZW1lbnQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlY29udHJvbGVkaXRpbmdXZWlndGhzXCIsIHdlaWdodC5yZXZlcnNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PT0gXCJjb25zdW1wdGlvblwiKSB7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID0gXCJwcm9kdWN0aW9uXCI7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnRzb3VyY2UgPSB0YXJnZXROb2RlICsgXCIuMVwiO1xuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0dGFyZ2V0ID0gc291cmNlTm9kZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb252ZXJ0ZWRFZGdlLl9wcml2YXRlLmRhdGEuY2xhc3MgPT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID0gXCJjb25zdW1wdGlvblwiO1xuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0c291cmNlID0gdGFyZ2V0Tm9kZTtcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLl9wcml2YXRlLmRhdGEucG9ydHRhcmdldCA9IHNvdXJjZU5vZGUgKyBcIi4xXCI7XG4gICAgICAgIH1cblxuICAgICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbi5hZGQoY29udmVydGVkRWRnZSk7XG4gICAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvbixcbiAgICAgICAgbWFwVHlwZTogbWFwVHlwZSxcbiAgICAgICAgcHJvY2Vzc0lkOiBwYXJhbS5wcm9jZXNzSWRcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLm1vdmVFZGdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgfTtcbiAgICAgIHZhciBlZGdlID0gcGFyYW0uZWRnZTtcbiAgICAgIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTsgICAgICBcbiAgICAgXG5cbiAgICAgIHJlc3VsdC5zb3VyY2UgPSBlZGdlLnNvdXJjZSgpLmlkKCk7XG4gICAgICByZXN1bHQudGFyZ2V0ID0gZWRnZS50YXJnZXQoKS5pZCgpOyAgICAgIFxuICAgICAgcmVzdWx0LnBvcnRzb3VyY2UgID1lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIpO1xuICAgICAgcmVzdWx0LnBvcnR0YXJnZXQgPSBlZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVkZ2UsICdzb3VyY2UnLCBwYXJhbS5zb3VyY2UpO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVkZ2UsICd0YXJnZXQnLCBwYXJhbS50YXJnZXQpO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVkZ2UsICdwb3J0c291cmNlJywgcGFyYW0ucG9ydHNvdXJjZSk7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWRnZSwgJ3BvcnR0YXJnZXQnLCBwYXJhbS5wb3J0dGFyZ2V0KTsgXG4gICAgICBlZGdlID0gZWRnZS5tb3ZlKHtcbiAgICAgICAgdGFyZ2V0OiBwYXJhbS50YXJnZXQsXG4gICAgICAgIHNvdXJjZSA6IHBhcmFtLnNvdXJjZVxuICAgIFxuICAgICB9KTtcblxuICAgICByZXN1bHQuZWRnZSA9IGVkZ2U7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5maXhFcnJvciA9IGZ1bmN0aW9uKHBhcmFtKXtcbiAgICAgIFxuICAgICAgdmFyIGVycm9yQ29kZSA9IHBhcmFtLmVycm9yQ29kZTtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIHJlc3VsdC5lcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gICAgICBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTAxXCIgfHwgZXJyb3JDb2RlID09ICdwZDEwMTAyJyl7XG5cbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLnJldmVyc2VFZGdlKHBhcmFtLmVkZ2UpO1xuXG4gICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwM1wiIHx8IGVycm9yQ29kZSA9PSAncGQxMDEwNycpe1xuXG4gICAgICAgXG4gICAgICAgIFxuICAgICAgICBwYXJhbS5uZXdOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5ld05vZGUpe1xuICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5ld05vZGUueCwgbmV3Tm9kZS55LCBuZXdOb2RlLmNsYXNzLCBuZXdOb2RlLmlkLCB1bmRlZmluZWQpO1xuXG4gICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBhcmFtLm5ld0VkZ2VzLmZvckVhY2goZnVuY3Rpb24obmV3RWRnZSl7ICAgICAgICAgIFxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdFZGdlLnNvdXJjZSxuZXdFZGdlLnRhcmdldCxuZXdFZGdlLmNsYXNzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGFyYW0ub2xkRWRnZXMuZm9yRWFjaChmdW5jdGlvbihvbGRFZGdlKXtcbiAgICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICAgICAgLy9yZXR1cm4gXG4gICAgICAgICAgb2xkRWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGFyYW0ubm9kZS5yZW1vdmUoKTtcblxuICAgICAgICByZXR1cm4gcGFyYW07XG5cbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDVcIiB8fCBlcnJvckNvZGUgPT0gJ3BkMTAxMDYnKXtcbiAgIFxuICAgICAgICByZXN1bHQuZWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMucmV2ZXJzZUVkZ2UocGFyYW0uZWRnZSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTQwXCIpe1xuICAgICAgICBwYXJhbS5ub2RlLnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA0XCIpIHtcbiAgICAgICAgXG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDhcIil7XG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMTFcIil7XG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMjZcIil7XG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDlcIiB8fCBlcnJvckNvZGUgPT0gXCJwZDEwMTI0XCIpIHtcbiAgICAgICAgXG4gICAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLmRhdGEoKS5zb3VyY2U7XG4gICAgICAgIHJlc3VsdC5uZXdUYXJnZXQgPSBwYXJhbS5lZGdlLmRhdGEoKS50YXJnZXQ7XG4gICAgICAgIHJlc3VsdC5wb3J0c291cmNlID0gcGFyYW0uZWRnZS5kYXRhKCkucG9ydHNvdXJjZTtcbiAgICAgICAgdmFyIGNsb25lZEVkZ2UgPSBwYXJhbS5lZGdlLmNsb25lKCk7XG4gICAgICAgXG4gICAgICAgIHZhciBlZGdlUGFyYW1zID0ge2NsYXNzIDogY2xvbmVkRWRnZS5kYXRhKCkuY2xhc3MsIGxhbmd1YWdlIDpjbG9uZWRFZGdlLmRhdGEoKS5sYW5ndWFnZX07XG4gICAgICAgIGNsb25lZEVkZ2UuZGF0YSgpLnNvdXJjZSA9IHBhcmFtLm5ld1NvdXJjZTtcbiAgICAgICAgY2xvbmVkRWRnZS5kYXRhKCkudGFyZ2V0ID0gcGFyYW0ubmV3VGFyZ2V0O1xuICAgICAgICBjeS5yZW1vdmUocGFyYW0uZWRnZSk7XG4gICAgICAgIHJlc3VsdC5lZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHBhcmFtLm5ld1NvdXJjZSxwYXJhbS5uZXdUYXJnZXQsZWRnZVBhcmFtcywgY2xvbmVkRWRnZS5kYXRhKCkuaWQpOyAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTEyXCIpIHsgICAgXG4gICAgICAgIFxuICAgICAgICBwYXJhbS5jYWxsYmFjayA9IGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyOyAgXG4gICAgICAgIC8vIElmIHRoaXMgaXMgZmlyc3QgdGltZSB3ZSBzaG91bGQgbW92ZSB0aGUgbm9kZSB0byBpdHMgbmV3IHBhcmVudCBhbmQgcmVsb2NhdGUgaXQgYnkgZ2l2ZW4gcG9zRGlmZiBwYXJhbXNcbiAgICAgICAgLy8gZWxzZSB3ZSBzaG91bGQgcmVtb3ZlIHRoZSBtb3ZlZCBlbGVzIGFuZCByZXN0b3JlIHRoZSBlbGVzIHRvIHJlc3RvcmVcbiAgICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICAgIHZhciBuZXdQYXJlbnRJZCA9IHBhcmFtLnBhcmVudERhdGEgPT0gdW5kZWZpbmVkID8gbnVsbCA6IHBhcmFtLnBhcmVudERhdGE7XG4gICAgICAgICAgLy8gVGhlc2UgZWxlcyBpbmNsdWRlcyB0aGUgbm9kZXMgYW5kIHRoZWlyIGNvbm5lY3RlZCBlZGdlcyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIG5vZGVzLm1vdmUoKS5cbiAgICAgICAgICAvLyBUaGV5IHNob3VsZCBiZSByZXN0b3JlZCBpbiB1bmRvXG4gICAgICAgICAgdmFyIHdpdGhEZXNjZW5kYW50ID0gcGFyYW0ubm9kZXMudW5pb24ocGFyYW0ubm9kZXMuZGVzY2VuZGFudHMoKSk7XG4gICAgICAgICAgcmVzdWx0LmVsZXNUb1Jlc3RvcmUgPSB3aXRoRGVzY2VuZGFudC51bmlvbih3aXRoRGVzY2VuZGFudC5jb25uZWN0ZWRFZGdlcygpKTtcbiAgICAgICAgICAvLyBUaGVzZSBhcmUgdGhlIGVsZXMgY3JlYXRlZCBieSBub2Rlcy5tb3ZlKCksIHRoZXkgc2hvdWxkIGJlIHJlbW92ZWQgaW4gdW5kby5cbiAgICAgICAgICByZXN1bHQubW92ZWRFbGVzID0gcGFyYW0ubm9kZXMubW92ZSh7XCJwYXJlbnRcIjogbmV3UGFyZW50SWR9KTtcblxuICAgICAgICAgIHZhciBwb3NEaWZmID0ge1xuICAgICAgICAgICAgeDogcGFyYW0ucG9zRGlmZlgsXG4gICAgICAgICAgICB5OiBwYXJhbS5wb3NEaWZmWVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyhwb3NEaWZmLCByZXN1bHQubW92ZWRFbGVzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXN1bHQuZWxlc1RvUmVzdG9yZSA9IHBhcmFtLm1vdmVkRWxlcy5yZW1vdmUoKTtcbiAgICAgICAgICByZXN1bHQubW92ZWRFbGVzID0gcGFyYW0uZWxlc1RvUmVzdG9yZS5yZXN0b3JlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW0uY2FsbGJhY2spIHtcbiAgICAgICAgICByZXN1bHQuY2FsbGJhY2sgPSBwYXJhbS5jYWxsYmFjazsgLy8ga2VlcCB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgc28gaXQgY2FuIGJlIHJldXNlZCBhZnRlciB1bmRvL3JlZG9cbiAgICAgICAgICBwYXJhbS5jYWxsYmFjayhyZXN1bHQubW92ZWRFbGVzKTsgLy8gYXBwbHkgdGhlIGNhbGxiYWNrIG9uIG5ld2x5IGNyZWF0ZWQgZWxlbWVudHNcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMjVcIikge1xuXG4gICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLnJlbW92ZSgpOyAgICAgICBcbiAgICAgICByZXN1bHQubmV3RWRnZSA9e307XG4gICAgICAgdmFyIGVkZ2VjbGFzcyA9IHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcy5jbGFzcyA/IHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcy5jbGFzcyA6IHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcztcbiAgICAgICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChwYXJhbS5uZXdFZGdlLnNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHBhcmFtLm5ld0VkZ2UudGFyZ2V0KSk7XG5cbiAgICAgICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XG4gICAgICAgIHZhciB0ZW1wID0gcGFyYW0ubmV3RWRnZS5zb3VyY2U7XG4gICAgICAgIHBhcmFtLm5ld0VkZ2Uuc291cmNlID0gcGFyYW0ubmV3RWRnZS50YXJnZXQ7XG4gICAgICAgIHBhcmFtLm5ld0VkZ2UudGFyZ2V0ID0gdGVtcDtcbiAgICAgIH1cbiAgICAgICByZXN1bHQubmV3RWRnZS5pZCA9ZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHBhcmFtLm5ld0VkZ2Uuc291cmNlLHBhcmFtLm5ld0VkZ2UudGFyZ2V0LHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcykuaWQoKTtcbiAgICAgICByZXN1bHQubmV3RWRnZS5zb3VyY2UgPSBwYXJhbS5uZXdFZGdlLnNvdXJjZTtcbiAgICAgICByZXN1bHQubmV3RWRnZS50YXJnZXQgPSBwYXJhbS5uZXdFZGdlLnRhcmdldDtcbiAgICAgICByZXN1bHQubmV3RWRnZS5lZGdlUGFyYW1zID0gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zO1xuICAgICAgIFxuICAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICAgICAgXG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTQyXCIpIHtcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLnJlbW92ZSgpOyAgICAgICBcbiAgICAgICAgcmVzdWx0Lm5ld0VkZ2UgPXt9O1xuICAgICAgICB2YXIgZWRnZWNsYXNzID0gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zLmNsYXNzID8gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zLmNsYXNzIDogcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zO1xuICAgICAgICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChwYXJhbS5uZXdFZGdlLnNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHBhcmFtLm5ld0VkZ2UudGFyZ2V0KSk7XG5cbiAgICAgICAgaWYgKHZhbGlkYXRpb24gPT09ICdyZXZlcnNlJykge1xuICAgICAgICAgdmFyIHRlbXAgPSBwYXJhbS5uZXdFZGdlLnNvdXJjZTtcbiAgICAgICAgIHBhcmFtLm5ld0VkZ2Uuc291cmNlID0gcGFyYW0ubmV3RWRnZS50YXJnZXQ7XG4gICAgICAgICBwYXJhbS5uZXdFZGdlLnRhcmdldCA9IHRlbXA7XG4gICAgICAgfVxuICAgICAgICByZXN1bHQubmV3RWRnZS5pZCA9ZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHBhcmFtLm5ld0VkZ2Uuc291cmNlLHBhcmFtLm5ld0VkZ2UudGFyZ2V0LHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcykuaWQoKTtcbiAgICAgICAgcmVzdWx0Lm5ld0VkZ2Uuc291cmNlID0gcGFyYW0ubmV3RWRnZS5zb3VyY2U7XG4gICAgICAgIHJlc3VsdC5uZXdFZGdlLnRhcmdldCA9IHBhcmFtLm5ld0VkZ2UudGFyZ2V0O1xuICAgICAgICByZXN1bHQubmV3RWRnZS5lZGdlUGFyYW1zID0gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1lbHNlIHtcblxuICAgICAgICByZXN1bHQubmV3U291cmNlID0gcGFyYW0uZWRnZS5zb3VyY2UoKS5pZCgpO1xuICAgICAgICByZXN1bHQubmV3VGFyZ2V0ID0gcGFyYW0uZWRnZS50YXJnZXQoKS5pZCgpO1xuICAgICAgICByZXN1bHQucG9ydHRhcmdldCA9IHBhcmFtLmVkZ2UuZGF0YShcInBvcnR0YXJnZXRcIik7XG4gICAgICAgIHJlc3VsdC5lZGdlID0gcGFyYW0uZWRnZS5tb3ZlKHtcbiAgICAgICAgICB0YXJnZXQ6IHBhcmFtLm5ld1RhcmdldCxcbiAgICAgICAgICBzb3VyY2UgOiBwYXJhbS5uZXdTb3VyY2UgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHJlc3VsdC5lZGdlLCAncG9ydHRhcmdldCcsIHBhcmFtLnBvcnR0YXJnZXQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICBcbiAgICAgIH1cbiAgICAgIFxuICB9XG4gIFxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmZpeEVycm9yID0gZnVuY3Rpb24ocGFyYW0pe1xuICAgIHZhciBlcnJvckNvZGUgPSBwYXJhbS5lcnJvckNvZGU7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5lcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gICAgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwMVwiIHx8IGVycm9yQ29kZSA9PSAncGQxMDEwMicpe1xuICAgICBcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLnJldmVyc2VFZGdlKHBhcmFtLmVkZ2UpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTAzXCIgfHwgZXJyb3JDb2RlID09ICdwZDEwMTA3Jyl7XG5cbiAgICAgIHBhcmFtLm5ld05vZGVzLmZvckVhY2goZnVuY3Rpb24obmV3Tm9kZSl7ICAgIFxuICAgICAgICBjeS5yZW1vdmUoY3kuJCgnIycrbmV3Tm9kZS5pZCkpICAgICAgXG4gICAgICAgIFxuICAgICAgfSk7XG5cbiAgICAgIHBhcmFtLm5vZGUucmVzdG9yZSgpO1xuXG4gICAgICBwYXJhbS5vbGRFZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKG9sZEVkZ2UpeyAgXG4gICAgICAgIG9sZEVkZ2UucmVzdG9yZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIGN5LmFuaW1hdGUoe1xuICAgICAgICBkdXJhdGlvbjogMTAwLFxuICAgICAgICBlYXNpbmc6ICdlYXNlJyxcbiAgICAgICAgZml0IDp7ZWxlczp7fSxwYWRkaW5nOjIwfSwgXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBwYXJhbTtcblxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDVcIiB8fCBlcnJvckNvZGUgPT0gJ3BkMTAxMDYnKXsgIFxuXG4gICAgICByZXN1bHQuZWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMucmV2ZXJzZUVkZ2UocGFyYW0uZWRnZSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDE0MFwiKXtcbiAgICAgIHBhcmFtLm5vZGUucmVzdG9yZSgpO1xuICAgICAgY3kuYW5pbWF0ZSh7XG4gICAgICAgIGR1cmF0aW9uOiAxMDAsXG4gICAgICAgIGVhc2luZzogJ2Vhc2UnLFxuICAgICAgICBmaXQgOntlbGVzOnt9LHBhZGRpbmc6MjB9LCBcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA0XCIpIHtcbiAgICAgIFxuICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgbm9kZS5yZXN0b3JlKCk7XG4gICAgICB9KTtcbiAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGFyYW07XG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwOFwiKXtcbiAgICAgIFxuICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgbm9kZS5yZXN0b3JlKCk7XG4gICAgICB9KTtcbiAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGFyYW07XG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDExMVwiKXtcbiAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGFyYW07XG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEyNlwiKXtcbiAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgIG5vZGUucmVzdG9yZSgpO1xuICAgICAgfSk7XG4gICAgICBwYXJhbS5lZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2Upe1xuICAgICAgICBlZGdlLnJlc3RvcmUoKTtcbiAgICAgIH0pOyAgICAgICBcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA5XCIgfHwgZXJyb3JDb2RlID09IFwicGQxMDEyNFwiKSB7XG5cbiAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLnNvdXJjZSgpLmlkKCk7XG4gICAgICByZXN1bHQubmV3VGFyZ2V0ID0gcGFyYW0uZWRnZS50YXJnZXQoKS5pZCgpO1xuICAgICAgcmVzdWx0LnBvcnRzb3VyY2UgPSBwYXJhbS5wb3J0c291cmNlO1xuICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLm1vdmUoe1xuICAgICAgICB0YXJnZXQ6IHBhcmFtLm5ld1RhcmdldCxcbiAgICAgICAgc291cmNlIDogcGFyYW0ubmV3U291cmNlICAgICAgXG4gICAgICB9KTtcblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHJlc3VsdC5lZGdlLCAncG9ydHNvdXJjZScsIHBhcmFtLnBvcnRzb3VyY2UpOyBcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDExMlwiKSB7XG4gICAgIFxuICAgICAgLy8gSWYgdGhpcyBpcyBmaXJzdCB0aW1lIHdlIHNob3VsZCBtb3ZlIHRoZSBub2RlIHRvIGl0cyBuZXcgcGFyZW50IGFuZCByZWxvY2F0ZSBpdCBieSBnaXZlbiBwb3NEaWZmIHBhcmFtc1xuICAgICAgLy8gZWxzZSB3ZSBzaG91bGQgcmVtb3ZlIHRoZSBtb3ZlZCBlbGVzIGFuZCByZXN0b3JlIHRoZSBlbGVzIHRvIHJlc3RvcmVcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgdmFyIG5ld1BhcmVudElkID0gcGFyYW0ucGFyZW50RGF0YSA9PSB1bmRlZmluZWQgPyBudWxsIDogcGFyYW0ucGFyZW50RGF0YTtcbiAgICAgICAgLy8gVGhlc2UgZWxlcyBpbmNsdWRlcyB0aGUgbm9kZXMgYW5kIHRoZWlyIGNvbm5lY3RlZCBlZGdlcyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIG5vZGVzLm1vdmUoKS5cbiAgICAgICAgLy8gVGhleSBzaG91bGQgYmUgcmVzdG9yZWQgaW4gdW5kb1xuICAgICAgICB2YXIgd2l0aERlc2NlbmRhbnQgPSBwYXJhbS5ub2Rlcy51bmlvbihwYXJhbS5ub2Rlcy5kZXNjZW5kYW50cygpKTtcbiAgICAgICAgcmVzdWx0LmVsZXNUb1Jlc3RvcmUgPSB3aXRoRGVzY2VuZGFudC51bmlvbih3aXRoRGVzY2VuZGFudC5jb25uZWN0ZWRFZGdlcygpKTtcbiAgICAgICAgLy8gVGhlc2UgYXJlIHRoZSBlbGVzIGNyZWF0ZWQgYnkgbm9kZXMubW92ZSgpLCB0aGV5IHNob3VsZCBiZSByZW1vdmVkIGluIHVuZG8uXG4gICAgICAgIHJlc3VsdC5tb3ZlZEVsZXMgPSBwYXJhbS5ub2Rlcy5tb3ZlKHtcInBhcmVudFwiOiBuZXdQYXJlbnRJZH0pO1xuXG4gICAgICAgIHZhciBwb3NEaWZmID0ge1xuICAgICAgICAgIHg6IHBhcmFtLnBvc0RpZmZYLFxuICAgICAgICAgIHk6IHBhcmFtLnBvc0RpZmZZXG4gICAgICAgIH07XG5cbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tb3ZlTm9kZXMocG9zRGlmZiwgcmVzdWx0Lm1vdmVkRWxlcyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0LmVsZXNUb1Jlc3RvcmUgPSBwYXJhbS5tb3ZlZEVsZXMucmVtb3ZlKCk7XG4gICAgICAgIHJlc3VsdC5tb3ZlZEVsZXMgPSBwYXJhbS5lbGVzVG9SZXN0b3JlLnJlc3RvcmUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhcmFtLmNhbGxiYWNrKSB7XG4gICAgICAgIHJlc3VsdC5jYWxsYmFjayA9IHBhcmFtLmNhbGxiYWNrOyAvLyBrZWVwIHRoZSBwcm92aWRlZCBjYWxsYmFjayBzbyBpdCBjYW4gYmUgcmV1c2VkIGFmdGVyIHVuZG8vcmVkb1xuICAgICAgICBwYXJhbS5jYWxsYmFjayhyZXN1bHQubW92ZWRFbGVzKTsgLy8gYXBwbHkgdGhlIGNhbGxiYWNrIG9uIG5ld2x5IGNyZWF0ZWQgZWxlbWVudHNcbiAgICAgIH1cblxuICAgICBcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTI1XCIpIHtcblxuICAgICAgY3kuJCgnIycrcGFyYW0ubmV3RWRnZS5pZCkucmVtb3ZlKCk7XG4gICAgICBwYXJhbS5lZGdlID0gcGFyYW0uZWRnZS5yZXN0b3JlKCk7XG5cbiAgICBcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIFxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxNDJcIikge1xuICAgICAgY3kuJCgnIycrcGFyYW0ubmV3RWRnZS5pZCkucmVtb3ZlKCk7XG4gICAgICBwYXJhbS5lZGdlID0gcGFyYW0uZWRnZS5yZXN0b3JlKCk7XG5cbiAgICBcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICB9ZWxzZSB7XG5cbiAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLnNvdXJjZSgpLmlkKCk7XG4gICAgICByZXN1bHQubmV3VGFyZ2V0ID0gcGFyYW0uZWRnZS50YXJnZXQoKS5pZCgpO1xuICAgICAgcmVzdWx0LnBvcnR0YXJnZXQgPSBwYXJhbS5lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpO1xuICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLm1vdmUoe1xuICAgICAgICB0YXJnZXQ6IHBhcmFtLm5ld1RhcmdldCxcbiAgICAgICAgc291cmNlIDogcGFyYW0ubmV3U291cmNlICAgICAgXG4gICAgICB9KTtcblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHJlc3VsdC5lZGdlLCAncG9ydHRhcmdldCcsIHBhcmFtLnBvcnR0YXJnZXQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgICAgXG4gICAgfVxuICAgIFxuICB9XG5cbiAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2xvbmVIaWdoRGVncmVlTm9kZSA9IGZ1bmN0aW9uKG5vZGUpe1xuXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBvbGRYID0gbm9kZS5wb3NpdGlvbigpLng7XG4gICAgdmFyIG9sZFkgPSBub2RlLnBvc2l0aW9uKCkueTtcbiAgICBcbiAgICBcbiAgICB2YXIgY2xhY3VsYXRlTmV3Q2xvbmVQb3NpdGlvbiA9IGZ1bmN0aW9uKHNvdXJjZUVuZFBvaW50WCxzb3VyY2VFbmRQb2ludFksdGFyZ2V0RW5kUG9pbnRYLHRhcmdldEVuZFBvaW50WSxkZXNpcmVkRGlzdGFuY2UsZGlyZWN0aW9uKXtcbiAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh0YXJnZXRFbmRQb2ludFktc291cmNlRW5kUG9pbnRZLDIpKyBNYXRoLnBvdyh0YXJnZXRFbmRQb2ludFgtc291cmNlRW5kUG9pbnRYLDIpKTtcbiAgICAgIHZhciByYXRpbyA9IGRlc2lyZWREaXN0YW5jZS9kaXN0YW5jZTtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGlmKGRpcmVjdGlvbiA9PSBcInNvdXJjZVwiKXsgXG4gICAgICAgIHJlc3VsdC5jeCA9ICgoMS1yYXRpbykgKiBzb3VyY2VFbmRQb2ludFgpICArIChyYXRpbyAqIHRhcmdldEVuZFBvaW50WCk7XG4gICAgICAgIHJlc3VsdC5jeSA9ICgoMS1yYXRpbykgKiBzb3VyY2VFbmRQb2ludFkpICArIChyYXRpbyAqIHRhcmdldEVuZFBvaW50WSk7XG4gICAgICB9ZWxzZXsgICAgICBcbiAgICAgICAgcmVzdWx0LmN4ID0gKCgxLXJhdGlvKSAqIHRhcmdldEVuZFBvaW50WCkgICsgKHJhdGlvICogc291cmNlRW5kUG9pbnRYKTtcbiAgICAgICAgcmVzdWx0LmN5ID0gKCgxLXJhdGlvKSAqIHRhcmdldEVuZFBvaW50WSkgICsgKHJhdGlvICogc291cmNlRW5kUG9pbnRZKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9OyAgIFxuICAgIHZhciBlZGdlcyA9IG5vZGUuY29ubmVjdGVkRWRnZXMoKTtcbiAgICB2YXIgZGVzaXJlZERpc3RhbmNlID0gKG5vZGUuaGVpZ2h0KCkgPiBub2RlLndpZHRoKCk/IG5vZGUuaGVpZ2h0KCk6IG5vZGUud2lkdGgoKSkqIDAuMTtcbiAgICBmb3IodmFyIGkgPSAxIDsgaSA8IGVkZ2VzLmxlbmd0aCA7IGkrKyl7XG4gICAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gaTtcbiAgICAgIHZhciBlZGdlQ2xvbmUgPSBlZGdlLmNsb25lKCk7XG4gICAgICB2YXIgc3RhcnRQb3NpdGlvbiA9IGVkZ2Uuc291cmNlKCkuaWQoKSA9PSBub2RlLmlkKCkgPyBcInNvdXJjZVwiIDogXCJ0YXJnZXRcIjsgICAgXG4gICAgICB2YXIgbmV3UG9zaXRpb24gPSBjbGFjdWxhdGVOZXdDbG9uZVBvc2l0aW9uKGVkZ2Uuc291cmNlRW5kcG9pbnQoKS54LGVkZ2Uuc291cmNlRW5kcG9pbnQoKS55LGVkZ2UudGFyZ2V0RW5kcG9pbnQoKS54LGVkZ2UudGFyZ2V0RW5kcG9pbnQoKS55LGRlc2lyZWREaXN0YW5jZSxzdGFydFBvc2l0aW9uKTsgXG4gICAgICB2YXIgbmV3Tm9kZUlkID0gbm9kZS5pZCgpKydjbG9uZS0nK2luZGV4O1xuICAgICAgLy9lZGdlQ2xvbmUuZGF0YSgpLmlkID0gZWRnZUNsb25lLmRhdGEoKS5pZCsgXCItXCIrbmV3Tm9kZUlkO1xuICAgICAgaWYoZWRnZS5zb3VyY2UoKS5pZCgpID09IG5vZGUuaWQoKSl7ICAgICAgICBcbiAgICAgICAgZWRnZUNsb25lLmRhdGEoKS5zb3VyY2UgPSBuZXdOb2RlSWQ7XG4gICAgICAgIGVkZ2VDbG9uZS5kYXRhKCkucG9ydHNvdXJjZSA9IG5ld05vZGVJZDsgICAgXG4gICAgICB9ZWxzZXtcbiAgICAgICAgICBcbiAgICAgICAgZWRnZUNsb25lLmRhdGEoKS50YXJnZXQgPSBuZXdOb2RlSWQ7XG4gICAgICAgIGVkZ2VDbG9uZS5kYXRhKCkucG9ydHRhcmdldCA9IG5ld05vZGVJZDsgICAgXG4gICAgICB9XG4gICAgICB2YXIgbmV3Tm9kZSA9IG5vZGUuY2xvbmUoKTtcbiAgICAgIG5ld05vZGUuZGF0YSgpLmlkID0gbmV3Tm9kZUlkO1xuICAgICAgY3kuYWRkKG5ld05vZGUpO1xuICAgICBcbiAgICAgIGVkZ2UucmVtb3ZlKCk7XG4gICAgICBjeS5hZGQoZWRnZUNsb25lKTtcbiAgICAgIG5ld05vZGUucG9zaXRpb24oe1xuICAgICAgICB4OiBuZXdQb3NpdGlvbi5jeCxcbiAgICAgICAgeTogbmV3UG9zaXRpb24uY3lcbiAgICAgIH0pO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhuZXdOb2RlLCB0cnVlKTtcbiAgICAgIFxuICAgIH0gIFxuICAgIFxuICAgIHZhciBuZXdQb3NpdGlvbiA9IGNsYWN1bGF0ZU5ld0Nsb25lUG9zaXRpb24oXG4gICAgICBlZGdlc1swXS5zb3VyY2VFbmRwb2ludCgpLngsXG4gICAgICBlZGdlc1swXS5zb3VyY2VFbmRwb2ludCgpLnksXG4gICAgICBlZGdlc1swXS50YXJnZXRFbmRwb2ludCgpLngsXG4gICAgICBlZGdlc1swXS50YXJnZXRFbmRwb2ludCgpLnksXG4gICAgICBkZXNpcmVkRGlzdGFuY2UsZWRnZXNbMF0uc291cmNlKCkuaWQoKSA9PSBub2RlLmlkKCkgPyBcInNvdXJjZVwiIDogXCJ0YXJnZXRcIlxuICAgICAgKTtcbiAgXG4gICAgdmFyIGNsb25lRWRnZSA9IGVkZ2VzWzBdLmNsb25lKCk7XG4gICAgLy9jbG9uZUVkZ2UuZGF0YSgpLmlkID0gY2xvbmVFZGdlLmRhdGEoKS5pZCsgXCItXCIrbm9kZS5pZCgpKydjbG9uZS0wJztcbiAgICBcbiAgICBlZGdlc1swXS5yZW1vdmUoKTtcbiAgICBjeS5hZGQoY2xvbmVFZGdlKTtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGUsdHJ1ZSk7XG4gICAgbm9kZS5wb3NpdGlvbih7XG4gICAgICB4OiBuZXdQb3NpdGlvbi5jeCxcbiAgICAgIHk6IG5ld1Bvc2l0aW9uLmN5XG4gICAgfSk7XG4gIFxuICAgIHJlc3VsdC5vbGRYID0gb2xkWDsgICAgXG4gICAgcmVzdWx0Lm9sZFkgPSBvbGRZO1xuICAgIHJlc3VsdC5ub2RlID0gbm9kZTtcbiAgICByZXN1bHQubnVtYmVyT2ZFZGdlcyA9IGVkZ2VzLmxlbmd0aDtcbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIH1cblxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bkNsb25lSGlnaERlZ3JlZU5vZGUgPSBmdW5jdGlvbihwYXJhbSl7XG5cbiAgICB2YXIgbm9kZSA9IHBhcmFtLm5vZGU7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2RlLGZhbHNlKTtcbiAgICBub2RlLnBvc2l0aW9uKHtcbiAgICAgIHg6IHBhcmFtLm9sZFgsXG4gICAgICB5OiBwYXJhbS5vbGRZXG4gICAgfSk7XG4gIFxuICAgIGZvcih2YXIgaSA9IDEgOyBpIDwgcGFyYW0ubnVtYmVyT2ZFZGdlcyA7IGkrKyl7XG4gICAgICB2YXIgY2xvbmVJZCA9IG5vZGUuaWQoKSsnY2xvbmUtJytpO1xuICAgICAgdmFyIGNsb25lID0gY3kuJChcIiNcIitjbG9uZUlkKTtcbiAgICAgIHZhciBjbG9uZUVkZ2UgPSBjbG9uZS5jb25uZWN0ZWRFZGdlcygpWzBdO1xuICAgICAgdmFyIGVkZ2UgPSBjbG9uZUVkZ2UuY2xvbmUoKTtcbiAgICAgIFxuICAgIFxuICAgICAgaWYoZWRnZS5kYXRhKCkuc291cmNlID09IGNsb25lSWQpeyAgICAgICAgXG4gICAgICAgIGVkZ2UuZGF0YSgpLnNvdXJjZSA9IG5vZGUuaWQoKTtcbiAgICAgICAgZWRnZS5kYXRhKCkucG9ydHNvdXJjZSA9ICBub2RlLmlkKCk7ICAgIFxuICAgICAgfWVsc2V7ICAgICAgICAgIFxuICAgICAgICBlZGdlLmRhdGEoKS50YXJnZXQgPSAgbm9kZS5pZCgpO1xuICAgICAgICBlZGdlLmRhdGEoKS5wb3J0dGFyZ2V0ID0gIG5vZGUuaWQoKTsgICAgXG4gICAgICB9XG5cbiAgICAgIGNsb25lRWRnZS5yZW1vdmUoKTtcbiAgICAgIGNsb25lLnJlbW92ZSgpO1xuICAgICAgXG4gICAgICBjeS5hZGQoZWRnZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VNYXBUeXBlID0gZnVuY3Rpb24ocGFyYW0pe1xuICAgIHZhciByZXN1bHQgPXt9O1xuICAgIHZhciBjdXJyZW50TWFwVHlwZSA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpO1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShwYXJhbS5tYXBUeXBlKTtcbiAgICByZXN1bHQubWFwVHlwZSA9IGN1cnJlbnRNYXBUeXBlO1xuICAgIHJlc3VsdC5jYWxsYmFjayA9IHBhcmFtLmNhbGxiYWNrO1xuICAgIHBhcmFtLmNhbGxiYWNrKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIH1cblxuICByZXR1cm4gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNFeHRlbmRlcjtcbn07XG4iXX0=
