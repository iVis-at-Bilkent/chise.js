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
    libs.saveAs = _libs.filesaverjs ? _libs.filesaverjs.saveAs : saveAs;

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

      if (templateType === 'association') {
        xPositionOfFreeMacromolecules = processPosition.x - edgeLength - processWidth / 2 - macromoleculeWidth / 2;
        if (!elementUtilities.getMapType()) {
          elementUtilities.setMapType("PD");
        }
      }
      else if(templateType === 'dissociation'){
        xPositionOfFreeMacromolecules = processPosition.x + edgeLength + processWidth / 2 + macromoleculeWidth / 2;
        if (!elementUtilities.getMapType()) {
          elementUtilities.setMapType("PD");
        }
      }
      else{
        elementUtilities.setMapType("HybridAny");
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
        var edgeEditing = cy.edgeEditing('get');
        edgeEditing.initBendPoints(edge);
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
            w: node.data("minWidth"),
            h: node.data("minHeight"),
            biasL : node.data("minWidthBiasLeft"),
            bisaR : node.data("minWidthBiasRight"),
            biasT : node.data("minHeightBiasTop"),
            biasB : node.data("minHeightBiasBottom")
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

//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzZXF1YWwvaW5kZXguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLWV4dGVuZGVyLWZhY3RvcnkuanMiLCJzcmMvdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzLWZhY3RvcnkuanMiLCJzcmMvdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvc2JnbnZpei1pbnN0YW5jZS11dGlsaXRpZXMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvdG9wb2xvZ3ktZ3JvdXBpbmctZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvdXItYWN0aW9uLWZ1bmN0aW9ucy1leHRlbmRlci1mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeHpEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXJDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogTG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgSlMgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pzLmZvdW5kYXRpb24vPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZmlsdGVyYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RmlsdGVyKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc0luZGV4ID0gMCxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJlc3VsdFtyZXNJbmRleCsrXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLnNvbWVgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW55IGVsZW1lbnQgcGFzc2VzIHRoZSBwcmVkaWNhdGUgY2hlY2ssXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheVNvbWUoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBgY2FjaGVgIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjYWNoZSBUaGUgY2FjaGUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gY2FjaGVIYXMoY2FjaGUsIGtleSkge1xuICByZXR1cm4gY2FjaGUuaGFzKGtleSk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBtYXBgIHRvIGl0cyBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBrZXktdmFsdWUgcGFpcnMuXG4gKi9cbmZ1bmN0aW9uIG1hcFRvQXJyYXkobWFwKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobWFwLnNpemUpO1xuXG4gIG1hcC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSBba2V5LCB2YWx1ZV07XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgc2V0YCB0byBhbiBhcnJheSBvZiBpdHMgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0IFRoZSBzZXQgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBzZXRUb0FycmF5KHNldCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KHNldC5zaXplKTtcblxuICBzZXQuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IHZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsXG4gICAgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIFN5bWJvbCA9IHJvb3QuU3ltYm9sLFxuICAgIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXksXG4gICAgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZSxcbiAgICBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZSxcbiAgICBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUdldFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICAgIG5hdGl2ZUlzQnVmZmVyID0gQnVmZmVyID8gQnVmZmVyLmlzQnVmZmVyIDogdW5kZWZpbmVkLFxuICAgIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgRGF0YVZpZXcgPSBnZXROYXRpdmUocm9vdCwgJ0RhdGFWaWV3JyksXG4gICAgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKSxcbiAgICBQcm9taXNlID0gZ2V0TmF0aXZlKHJvb3QsICdQcm9taXNlJyksXG4gICAgU2V0ID0gZ2V0TmF0aXZlKHJvb3QsICdTZXQnKSxcbiAgICBXZWFrTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdXZWFrTWFwJyksXG4gICAgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xWYWx1ZU9mID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by52YWx1ZU9mIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IChkYXRhW2tleV0gIT09IHVuZGVmaW5lZCkgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGFzc29jSW5kZXhPZih0aGlzLl9fZGF0YV9fLCBrZXkpID4gLTE7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYExpc3RDYWNoZWAuXG5MaXN0Q2FjaGUucHJvdG90eXBlLmNsZWFyID0gbGlzdENhY2hlQ2xlYXI7XG5MaXN0Q2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IGxpc3RDYWNoZURlbGV0ZTtcbkxpc3RDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbGlzdENhY2hlR2V0O1xuTGlzdENhY2hlLnByb3RvdHlwZS5oYXMgPSBsaXN0Q2FjaGVIYXM7XG5MaXN0Q2FjaGUucHJvdG90eXBlLnNldCA9IGxpc3RDYWNoZVNldDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5zaXplID0gMDtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlR2V0KGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmdldChrZXkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIG1hcCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG4vKipcbiAqXG4gKiBDcmVhdGVzIGFuIGFycmF5IGNhY2hlIG9iamVjdCB0byBzdG9yZSB1bmlxdWUgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFNldENhY2hlKHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcyA9PSBudWxsID8gMCA6IHZhbHVlcy5sZW5ndGg7XG5cbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB0aGlzLmFkZCh2YWx1ZXNbaW5kZXhdKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZHMgYHZhbHVlYCB0byB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGFkZFxuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAYWxpYXMgcHVzaFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2FjaGUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVBZGQodmFsdWUpIHtcbiAgdGhpcy5fX2RhdGFfXy5zZXQodmFsdWUsIEhBU0hfVU5ERUZJTkVEKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgaW4gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVIYXModmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKHZhbHVlKTtcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFNldENhY2hlYC5cblNldENhY2hlLnByb3RvdHlwZS5hZGQgPSBTZXRDYWNoZS5wcm90b3R5cGUucHVzaCA9IHNldENhY2hlQWRkO1xuU2V0Q2FjaGUucHJvdG90eXBlLmhhcyA9IHNldENhY2hlSGFzO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzdGFjayBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTdGFjayhlbnRyaWVzKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGUoZW50cmllcyk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBTdGFja1xuICovXG5mdW5jdGlvbiBzdGFja0NsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIHJlc3VsdCA9IGRhdGFbJ2RlbGV0ZSddKGtleSk7XG5cbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHN0YWNrIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzdGFja0dldChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KGtleSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGRhdGEuX19kYXRhX187XG4gICAgaWYgKCFNYXAgfHwgKHBhaXJzLmxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgLSAxKSkge1xuICAgICAgcGFpcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgdGhpcy5zaXplID0gKytkYXRhLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU3RhY2tgLlxuU3RhY2sucHJvdG90eXBlLmNsZWFyID0gc3RhY2tDbGVhcjtcblN0YWNrLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBzdGFja0RlbGV0ZTtcblN0YWNrLnByb3RvdHlwZS5nZXQgPSBzdGFja0dldDtcblN0YWNrLnByb3RvdHlwZS5oYXMgPSBzdGFja0hhcztcblN0YWNrLnByb3RvdHlwZS5zZXQgPSBzdGFja1NldDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIHRoZSBhcnJheS1saWtlIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtib29sZWFufSBpbmhlcml0ZWQgU3BlY2lmeSByZXR1cm5pbmcgaW5oZXJpdGVkIHByb3BlcnR5IG5hbWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlMaWtlS2V5cyh2YWx1ZSwgaW5oZXJpdGVkKSB7XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpLFxuICAgICAgaXNBcmcgPSAhaXNBcnIgJiYgaXNBcmd1bWVudHModmFsdWUpLFxuICAgICAgaXNCdWZmID0gIWlzQXJyICYmICFpc0FyZyAmJiBpc0J1ZmZlcih2YWx1ZSksXG4gICAgICBpc1R5cGUgPSAhaXNBcnIgJiYgIWlzQXJnICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHZhbHVlKSxcbiAgICAgIHNraXBJbmRleGVzID0gaXNBcnIgfHwgaXNBcmcgfHwgaXNCdWZmIHx8IGlzVHlwZSxcbiAgICAgIHJlc3VsdCA9IHNraXBJbmRleGVzID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKSA6IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChcbiAgICAgICAgICAgLy8gU2FmYXJpIDkgaGFzIGVudW1lcmFibGUgYGFyZ3VtZW50cy5sZW5ndGhgIGluIHN0cmljdCBtb2RlLlxuICAgICAgICAgICBrZXkgPT0gJ2xlbmd0aCcgfHxcbiAgICAgICAgICAgLy8gTm9kZS5qcyAwLjEwIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIGJ1ZmZlcnMuXG4gICAgICAgICAgIChpc0J1ZmYgJiYgKGtleSA9PSAnb2Zmc2V0JyB8fCBrZXkgPT0gJ3BhcmVudCcpKSB8fFxuICAgICAgICAgICAvLyBQaGFudG9tSlMgMiBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiB0eXBlZCBhcnJheXMuXG4gICAgICAgICAgIChpc1R5cGUgJiYgKGtleSA9PSAnYnVmZmVyJyB8fCBrZXkgPT0gJ2J5dGVMZW5ndGgnIHx8IGtleSA9PSAnYnl0ZU9mZnNldCcpKSB8fFxuICAgICAgICAgICAvLyBTa2lwIGluZGV4IHByb3BlcnRpZXMuXG4gICAgICAgICAgIGlzSW5kZXgoa2V5LCBsZW5ndGgpXG4gICAgICAgICkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRBbGxLZXlzYCBhbmQgYGdldEFsbEtleXNJbmAgd2hpY2ggdXNlc1xuICogYGtleXNGdW5jYCBhbmQgYHN5bWJvbHNGdW5jYCB0byBnZXQgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kXG4gKiBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3ltYm9sc0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5c0Z1bmMsIHN5bWJvbHNGdW5jKSB7XG4gIHZhciByZXN1bHQgPSBrZXlzRnVuYyhvYmplY3QpO1xuICByZXR1cm4gaXNBcnJheShvYmplY3QpID8gcmVzdWx0IDogYXJyYXlQdXNoKHJlc3VsdCwgc3ltYm9sc0Z1bmMob2JqZWN0KSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0VxdWFsYCB3aGljaCBzdXBwb3J0cyBwYXJ0aWFsIGNvbXBhcmlzb25zXG4gKiBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy5cbiAqICAxIC0gVW5vcmRlcmVkIGNvbXBhcmlzb25cbiAqICAyIC0gUGFydGlhbCBjb21wYXJpc29uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykge1xuICBpZiAodmFsdWUgPT09IG90aGVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwgfHwgb3RoZXIgPT0gbnVsbCB8fCAoIWlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgIWlzT2JqZWN0TGlrZShvdGhlcikpKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7XG4gIH1cbiAgcmV0dXJuIGJhc2VJc0VxdWFsRGVlcCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGJhc2VJc0VxdWFsLCBzdGFjayk7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbGAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBjb21wYXJpc29ucyBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGVuYWJsaW5nIG9iamVjdHMgd2l0aCBjaXJjdWxhclxuICogcmVmZXJlbmNlcyB0byBiZSBjb21wYXJlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWxEZWVwKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIG9iaklzQXJyID0gaXNBcnJheShvYmplY3QpLFxuICAgICAgb3RoSXNBcnIgPSBpc0FycmF5KG90aGVyKSxcbiAgICAgIG9ialRhZyA9IG9iaklzQXJyID8gYXJyYXlUYWcgOiBnZXRUYWcob2JqZWN0KSxcbiAgICAgIG90aFRhZyA9IG90aElzQXJyID8gYXJyYXlUYWcgOiBnZXRUYWcob3RoZXIpO1xuXG4gIG9ialRhZyA9IG9ialRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb2JqVGFnO1xuICBvdGhUYWcgPSBvdGhUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG90aFRhZztcblxuICB2YXIgb2JqSXNPYmogPSBvYmpUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgb3RoSXNPYmogPSBvdGhUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgaXNTYW1lVGFnID0gb2JqVGFnID09IG90aFRhZztcblxuICBpZiAoaXNTYW1lVGFnICYmIGlzQnVmZmVyKG9iamVjdCkpIHtcbiAgICBpZiAoIWlzQnVmZmVyKG90aGVyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBvYmpJc0FyciA9IHRydWU7XG4gICAgb2JqSXNPYmogPSBmYWxzZTtcbiAgfVxuICBpZiAoaXNTYW1lVGFnICYmICFvYmpJc09iaikge1xuICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgcmV0dXJuIChvYmpJc0FyciB8fCBpc1R5cGVkQXJyYXkob2JqZWN0KSlcbiAgICAgID8gZXF1YWxBcnJheXMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaylcbiAgICAgIDogZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCBvYmpUYWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICB9XG4gIGlmICghKGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRykpIHtcbiAgICB2YXIgb2JqSXNXcmFwcGVkID0gb2JqSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsICdfX3dyYXBwZWRfXycpLFxuICAgICAgICBvdGhJc1dyYXBwZWQgPSBvdGhJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCAnX193cmFwcGVkX18nKTtcblxuICAgIGlmIChvYmpJc1dyYXBwZWQgfHwgb3RoSXNXcmFwcGVkKSB7XG4gICAgICB2YXIgb2JqVW53cmFwcGVkID0gb2JqSXNXcmFwcGVkID8gb2JqZWN0LnZhbHVlKCkgOiBvYmplY3QsXG4gICAgICAgICAgb3RoVW53cmFwcGVkID0gb3RoSXNXcmFwcGVkID8gb3RoZXIudmFsdWUoKSA6IG90aGVyO1xuXG4gICAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgICAgcmV0dXJuIGVxdWFsRnVuYyhvYmpVbndyYXBwZWQsIG90aFVud3JhcHBlZCwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spO1xuICAgIH1cbiAgfVxuICBpZiAoIWlzU2FtZVRhZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICByZXR1cm4gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGFycmF5cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtBcnJheX0gb3RoZXIgVGhlIG90aGVyIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBhcnJheWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJyYXlzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQXJyYXlzKGFycmF5LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgYXJyTGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoZXIubGVuZ3RoO1xuXG4gIGlmIChhcnJMZW5ndGggIT0gb3RoTGVuZ3RoICYmICEoaXNQYXJ0aWFsICYmIG90aExlbmd0aCA+IGFyckxlbmd0aCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChhcnJheSk7XG4gIGlmIChzdGFja2VkICYmIHN0YWNrLmdldChvdGhlcikpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IHRydWUsXG4gICAgICBzZWVuID0gKGJpdG1hc2sgJiBDT01QQVJFX1VOT1JERVJFRF9GTEFHKSA/IG5ldyBTZXRDYWNoZSA6IHVuZGVmaW5lZDtcblxuICBzdGFjay5zZXQoYXJyYXksIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBhcnJheSk7XG5cbiAgLy8gSWdub3JlIG5vbi1pbmRleCBwcm9wZXJ0aWVzLlxuICB3aGlsZSAoKytpbmRleCA8IGFyckxlbmd0aCkge1xuICAgIHZhciBhcnJWYWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltpbmRleF07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgYXJyVmFsdWUsIGluZGV4LCBvdGhlciwgYXJyYXksIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIoYXJyVmFsdWUsIG90aFZhbHVlLCBpbmRleCwgYXJyYXksIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIGlmIChjb21wYXJlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoY29tcGFyZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmIChzZWVuKSB7XG4gICAgICBpZiAoIWFycmF5U29tZShvdGhlciwgZnVuY3Rpb24ob3RoVmFsdWUsIG90aEluZGV4KSB7XG4gICAgICAgICAgICBpZiAoIWNhY2hlSGFzKHNlZW4sIG90aEluZGV4KSAmJlxuICAgICAgICAgICAgICAgIChhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2Vlbi5wdXNoKG90aEluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghKFxuICAgICAgICAgIGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fFxuICAgICAgICAgICAgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShhcnJheSk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBjb21wYXJpbmcgb2JqZWN0cyBvZlxuICogdGhlIHNhbWUgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNvbXBhcmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0cyB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgdGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAob2JqZWN0LmJ5dGVPZmZzZXQgIT0gb3RoZXIuYnl0ZU9mZnNldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgb2JqZWN0ID0gb2JqZWN0LmJ1ZmZlcjtcbiAgICAgIG90aGVyID0gb3RoZXIuYnVmZmVyO1xuXG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAhZXF1YWxGdW5jKG5ldyBVaW50OEFycmF5KG9iamVjdCksIG5ldyBVaW50OEFycmF5KG90aGVyKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgICAgLy8gQ29lcmNlIGJvb2xlYW5zIHRvIGAxYCBvciBgMGAgYW5kIGRhdGVzIHRvIG1pbGxpc2Vjb25kcy5cbiAgICAgIC8vIEludmFsaWQgZGF0ZXMgYXJlIGNvZXJjZWQgdG8gYE5hTmAuXG4gICAgICByZXR1cm4gZXEoK29iamVjdCwgK290aGVyKTtcblxuICAgIGNhc2UgZXJyb3JUYWc6XG4gICAgICByZXR1cm4gb2JqZWN0Lm5hbWUgPT0gb3RoZXIubmFtZSAmJiBvYmplY3QubWVzc2FnZSA9PSBvdGhlci5tZXNzYWdlO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICAvLyBDb2VyY2UgcmVnZXhlcyB0byBzdHJpbmdzIGFuZCB0cmVhdCBzdHJpbmdzLCBwcmltaXRpdmVzIGFuZCBvYmplY3RzLFxuICAgICAgLy8gYXMgZXF1YWwuIFNlZSBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcmVnZXhwLnByb3RvdHlwZS50b3N0cmluZ1xuICAgICAgLy8gZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgIHJldHVybiBvYmplY3QgPT0gKG90aGVyICsgJycpO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICB2YXIgY29udmVydCA9IG1hcFRvQXJyYXk7XG5cbiAgICBjYXNlIHNldFRhZzpcbiAgICAgIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUc7XG4gICAgICBjb252ZXJ0IHx8IChjb252ZXJ0ID0gc2V0VG9BcnJheSk7XG5cbiAgICAgIGlmIChvYmplY3Quc2l6ZSAhPSBvdGhlci5zaXplICYmICFpc1BhcnRpYWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICAgICAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgICAgIGlmIChzdGFja2VkKSB7XG4gICAgICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICAgICAgfVxuICAgICAgYml0bWFzayB8PSBDT01QQVJFX1VOT1JERVJFRF9GTEFHO1xuXG4gICAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgICAgIHZhciByZXN1bHQgPSBlcXVhbEFycmF5cyhjb252ZXJ0KG9iamVjdCksIGNvbnZlcnQob3RoZXIpLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgICAgIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgaWYgKHN5bWJvbFZhbHVlT2YpIHtcbiAgICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlT2YuY2FsbChvYmplY3QpID09IHN5bWJvbFZhbHVlT2YuY2FsbChvdGhlcik7XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3Igb2JqZWN0cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgb2JqUHJvcHMgPSBnZXRBbGxLZXlzKG9iamVjdCksXG4gICAgICBvYmpMZW5ndGggPSBvYmpQcm9wcy5sZW5ndGgsXG4gICAgICBvdGhQcm9wcyA9IGdldEFsbEtleXMob3RoZXIpLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoUHJvcHMubGVuZ3RoO1xuXG4gIGlmIChvYmpMZW5ndGggIT0gb3RoTGVuZ3RoICYmICFpc1BhcnRpYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGluZGV4ID0gb2JqTGVuZ3RoO1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgaWYgKCEoaXNQYXJ0aWFsID8ga2V5IGluIG90aGVyIDogaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwga2V5KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHRydWU7XG4gIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBvYmplY3QpO1xuXG4gIHZhciBza2lwQ3RvciA9IGlzUGFydGlhbDtcbiAgd2hpbGUgKCsraW5kZXggPCBvYmpMZW5ndGgpIHtcbiAgICBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJba2V5XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBvYmpWYWx1ZSwga2V5LCBvdGhlciwgb2JqZWN0LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKG9ialZhbHVlLCBvdGhWYWx1ZSwga2V5LCBvYmplY3QsIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmICghKGNvbXBhcmVkID09PSB1bmRlZmluZWRcbiAgICAgICAgICA/IChvYmpWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKG9ialZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKVxuICAgICAgICAgIDogY29tcGFyZWRcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc2tpcEN0b3IgfHwgKHNraXBDdG9yID0ga2V5ID09ICdjb25zdHJ1Y3RvcicpO1xuICB9XG4gIGlmIChyZXN1bHQgJiYgIXNraXBDdG9yKSB7XG4gICAgdmFyIG9iakN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgIG90aEN0b3IgPSBvdGhlci5jb25zdHJ1Y3RvcjtcblxuICAgIC8vIE5vbiBgT2JqZWN0YCBvYmplY3QgaW5zdGFuY2VzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWFsLlxuICAgIGlmIChvYmpDdG9yICE9IG90aEN0b3IgJiZcbiAgICAgICAgKCdjb25zdHJ1Y3RvcicgaW4gb2JqZWN0ICYmICdjb25zdHJ1Y3RvcicgaW4gb3RoZXIpICYmXG4gICAgICAgICEodHlwZW9mIG9iakN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvYmpDdG9yIGluc3RhbmNlb2Ygb2JqQ3RvciAmJlxuICAgICAgICAgIHR5cGVvZiBvdGhDdG9yID09ICdmdW5jdGlvbicgJiYgb3RoQ3RvciBpbnN0YW5jZW9mIG90aEN0b3IpKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5cywgZ2V0U3ltYm9scyk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0YSBmb3IgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHJlZmVyZW5jZSBrZXkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGdldE1hcERhdGEobWFwLCBrZXkpIHtcbiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187XG4gIHJldHVybiBpc0tleWFibGUoa2V5KVxuICAgID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddXG4gICAgOiBkYXRhLm1hcDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHN5bWJvbHMuXG4gKi9cbnZhciBnZXRTeW1ib2xzID0gIW5hdGl2ZUdldFN5bWJvbHMgPyBzdHViQXJyYXkgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICByZXR1cm4gYXJyYXlGaWx0ZXIobmF0aXZlR2V0U3ltYm9scyhvYmplY3QpLCBmdW5jdGlvbihzeW1ib2wpIHtcbiAgICByZXR1cm4gcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChvYmplY3QsIHN5bWJvbCk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VHZXRUYWcodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmVcbiAqIGVxdWl2YWxlbnQuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIHN1cHBvcnRzIGNvbXBhcmluZyBhcnJheXMsIGFycmF5IGJ1ZmZlcnMsIGJvb2xlYW5zLFxuICogZGF0ZSBvYmplY3RzLCBlcnJvciBvYmplY3RzLCBtYXBzLCBudW1iZXJzLCBgT2JqZWN0YCBvYmplY3RzLCByZWdleGVzLFxuICogc2V0cywgc3RyaW5ncywgc3ltYm9scywgYW5kIHR5cGVkIGFycmF5cy4gYE9iamVjdGAgb2JqZWN0cyBhcmUgY29tcGFyZWRcbiAqIGJ5IHRoZWlyIG93biwgbm90IGluaGVyaXRlZCwgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLiBGdW5jdGlvbnMgYW5kIERPTVxuICogbm9kZXMgYXJlIGNvbXBhcmVkIGJ5IHN0cmljdCBlcXVhbGl0eSwgaS5lLiBgPT09YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5pc0VxdWFsKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIG9iamVjdCA9PT0gb3RoZXI7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0VxdWFsKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBlbXB0eSBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGVtcHR5IGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXlzID0gXy50aW1lcygyLCBfLnN0dWJBcnJheSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzKTtcbiAqIC8vID0+IFtbXSwgW11dXG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzWzBdID09PSBhcnJheXNbMV0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3R1YkFycmF5KCkge1xuICByZXR1cm4gW107XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VxdWFsO1xuIiwiKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNoaXNlID0gZnVuY3Rpb24oX29wdGlvbnMpIHtcclxuXHJcbiAgICB2YXIgcGFyYW0gPSB7fTtcclxuXHJcbiAgICAvLyBBY2Nlc3MgdGhlIGxpYnNcclxuICAgIHZhciBsaWJzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxuXHJcbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy1mYWN0b3J5JykoKTtcclxuICAgIHZhciBvcHRpb25zID0gb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMoX29wdGlvbnMpOyAvLyBFeHRlbmRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9uc1xyXG5cclxuICAgIC8vIENyZWF0ZSBhbiBzYmdudml6IGluc3RhbmNlXHJcbiAgICB2YXIgc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvc2JnbnZpei1pbnN0YW5jZS11dGlsaXRpZXMtZmFjdG9yeScpKCk7XHJcbiAgICB2YXIgc2JnbnZpekluc3RhbmNlID0gc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzKG9wdGlvbnMpO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIHVuZG8vcmVkbyBhY3Rpb25zXHJcbiAgICB2YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9yZWdpc3Rlci11bmRvLXJlZG8tYWN0aW9ucy1mYWN0b3J5JykoKTtcclxuXHJcbiAgICB2YXIgbWFpblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzLWZhY3RvcnknKSgpO1xyXG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXNFeHRlbmRlciA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLWV4dGVuZGVyLWZhY3RvcnknKSgpO1xyXG4gICAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zRXh0ZW5kZXIgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91ci1hY3Rpb24tZnVuY3Rpb25zLWV4dGVuZGVyLWZhY3RvcnknKSgpO1xyXG4gICAgdmFyIHNpZlRvcG9sb2d5R3JvdXBpbmcgPSByZXF1aXJlKCcuL3V0aWxpdGllcy90b3BvbG9neS1ncm91cGluZy1mYWN0b3J5JykoKTtcclxuXHJcbiAgICB2YXIgZWxlbWVudFV0aWxpdGllcyA9ICBzYmdudml6SW5zdGFuY2UuZWxlbWVudFV0aWxpdGllcztcclxuICAgIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHNiZ252aXpJbnN0YW5jZS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcclxuXHJcbiAgICBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMgPSBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXM7XHJcbiAgICBwYXJhbS5vcHRpb25VdGlsaXRpZXMgPSBvcHRpb25VdGlsaXRpZXM7XHJcbiAgICBwYXJhbS5lbGVtZW50VXRpbGl0aWVzID0gZWxlbWVudFV0aWxpdGllcztcclxuICAgIHBhcmFtLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XHJcbiAgICBwYXJhbS5zaWZUb3BvbG9neUdyb3VwaW5nID0gc2lmVG9wb2xvZ3lHcm91cGluZztcclxuXHJcbiAgICB2YXIgc2hvdWxkQXBwbHkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIHBhcmFtLmVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZSA9PT0gJ1NJRic7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zRXh0ZW5kZXIocGFyYW0pO1xyXG4gICAgZWxlbWVudFV0aWxpdGllc0V4dGVuZGVyKHBhcmFtKTtcclxuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKHBhcmFtKTtcclxuICAgIG1haW5VdGlsaXRpZXMocGFyYW0pO1xyXG4gICAgc2lmVG9wb2xvZ3lHcm91cGluZyhwYXJhbSwge21ldGFFZGdlSWRlbnRpZmllcjogJ3NpZi1tZXRhJywgbG9ja0dyYXBoVG9wb2xvZ3k6IHRydWUsIHNob3VsZEFwcGx5fSk7XHJcblxyXG4gICAgLy8gRXhwb3NlIHRoZSBhcGlcclxuICAgIHZhciBhcGkgPSB7fTtcclxuXHJcbiAgICAvLyBFeHBvc2UgdGhlIHByb3BlcnRpZXMgaW5oZXJpdGVkIGZyb20gc2JnbnZpelxyXG4gICAgLy8gdGhlbiBvdmVycmlkZSBzb21lIG9mIHRoZXNlIHByb3BlcnRpZXMgYW5kIGV4cG9zZSBzb21lIG5ldyBwcm9wZXJ0aWVzXHJcbiAgICBmb3IgKHZhciBwcm9wIGluIHNiZ252aXpJbnN0YW5jZSkge1xyXG4gICAgICBhcGlbcHJvcF0gPSBzYmdudml6SW5zdGFuY2VbcHJvcF07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRXhwb3NlIGVhY2ggbWFpbiB1dGlsaXR5IHNlcGVyYXRlbHlcclxuICAgIGZvciAodmFyIHByb3AgaW4gbWFpblV0aWxpdGllcykge1xyXG4gICAgICBhcGlbcHJvcF0gPSBtYWluVXRpbGl0aWVzW3Byb3BdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEV4cG9zZSBnZXRTYmdudml6SW5zdGFuY2UoKVxyXG4gICAgYXBpLmdldFNiZ252aXpJbnN0YW5jZSA9IHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRJbnN0YW5jZTtcclxuXHJcbiAgICAvLyBFeHBvc2UgZWxlbWVudFV0aWxpdGllcyBhbmQgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgYXMgaXNcclxuICAgIGFwaS5lbGVtZW50VXRpbGl0aWVzID0gZWxlbWVudFV0aWxpdGllcztcclxuICAgIGFwaS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xyXG4gICAgYXBpLnNpZlRvcG9sb2d5R3JvdXBpbmcgPSBzaWZUb3BvbG9neUdyb3VwaW5nO1xyXG5cclxuICAgIHJldHVybiBhcGk7XHJcbiAgfTtcclxuXHJcbiAgLy8gUmVnaXN0ZXIgY2hpc2Ugd2l0aCBnaXZlbiBsaWJyYXJpZXNcclxuICBjaGlzZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChfbGlicykge1xyXG5cclxuICAgIHZhciBsaWJzID0ge307XHJcbiAgICBsaWJzLmpRdWVyeSA9IF9saWJzLmpRdWVyeSB8fCBqUXVlcnk7XHJcbiAgICBsaWJzLmN5dG9zY2FwZSA9IF9saWJzLmN5dG9zY2FwZSB8fCBjeXRvc2NhcGU7XHJcbiAgICBsaWJzLnNiZ252aXogPSBfbGlicy5zYmdudml6IHx8IHNiZ252aXo7XHJcbiAgICBsaWJzLnNhdmVBcyA9IF9saWJzLmZpbGVzYXZlcmpzID8gX2xpYnMuZmlsZXNhdmVyanMuc2F2ZUFzIDogc2F2ZUFzO1xyXG5cclxuICAgIGxpYnMuc2JnbnZpei5yZWdpc3RlcihfbGlicyk7IC8vIFJlZ2lzdGVyIHNiZ252aXogd2l0aCB0aGUgZ2l2ZW4gbGlic1xyXG5cclxuICAgIC8vIGluaGVyaXQgZXhwb3NlZCBzdGF0aWMgcHJvcGVydGllcyBvZiBzYmdudml6IG90aGVyIHRoYW4gcmVnaXN0ZXJcclxuICAgIGZvciAodmFyIHByb3AgaW4gbGlicy5zYmdudml6KSB7XHJcbiAgICAgIGlmIChwcm9wICE9PSAncmVnaXN0ZXInKSB7XHJcbiAgICAgICAgY2hpc2VbcHJvcF0gPSBsaWJzLnNiZ252aXpbcHJvcF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBTZXQgdGhlIGxpYnJhcmllcyB0byBhY2Nlc3MgdGhlbSBmcm9tIGFueSBmaWxlXHJcbiAgICB2YXIgbGliVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvbGliLXV0aWxpdGllcycpO1xyXG4gICAgbGliVXRpbGl0aWVzLnNldExpYnMobGlicyk7XHJcbiAgfTtcclxuXHJcbiAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gY2hpc2U7XHJcbiAgfVxyXG59KSgpO1xyXG4iLCIvLyBFeHRlbmRzIHNiZ252aXouZWxlbWVudFV0aWxpdGllc1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBvcHRpb25zLCBzYmdudml6SW5zdGFuY2UsIGVsZW1lbnRVdGlsaXRpZXMsIGN5O1xyXG5cclxuICBmdW5jdGlvbiBlbGVtZW50VXRpbGl0aWVzRXh0ZW5kZXIgKHBhcmFtKSB7XHJcbiAgICBzYmdudml6SW5zdGFuY2UgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0SW5zdGFuY2UoKTtcclxuICAgIG9wdGlvbnMgPSBwYXJhbS5vcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xyXG4gICAgZWxlbWVudFV0aWxpdGllcyA9IHNiZ252aXpJbnN0YW5jZS5lbGVtZW50VXRpbGl0aWVzO1xyXG4gICAgY3kgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0Q3koKTtcclxuXHJcbiAgICBleHRlbmQoKTtcclxuXHJcbiAgICAvLyBSZXR1cm4gdGhlIGV4dGVuZGVkIGVsZW1lbnRVdGlsaXRpZXNcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzO1xyXG4gIH1cclxuXHJcbiAgLy8gRXh0ZW5kcyBlbGVtZW50VXRpbGl0aWVzIHdpdGggY2hpc2Ugc3BlY2lmaWMgZmFjaWxpdGllc1xyXG4gIGZ1bmN0aW9uIGV4dGVuZCAoKSB7XHJcbiAgICAvLyBTZWN0aW9uIFN0YXJ0XHJcbiAgICAvLyBBZGQgcmVtb3ZlIHV0aWxpdGllc1xyXG5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uICh4LCB5LCBub2RlUGFyYW1zLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KSB7XHJcbiAgICAgIGlmICh0eXBlb2Ygbm9kZVBhcmFtcyAhPSAnb2JqZWN0Jyl7XHJcbiAgICAgICAgdmFyIHNiZ25jbGFzcyA9IG5vZGVQYXJhbXM7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YXIgc2JnbmNsYXNzID0gbm9kZVBhcmFtcy5jbGFzcztcclxuICAgICAgICAgIHZhciBsYW5ndWFnZSA9IG5vZGVQYXJhbXMubGFuZ3VhZ2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjc3MgPSB7fTtcclxuICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gc3BlY2lmaWMgZGVmYXVsdCB3aWR0aCBvciBoZWlnaHQgZm9yXHJcbiAgICAgIC8vIHNiZ25jbGFzcyB0aGVzZSBzaXplcyBhcmUgdXNlZFxyXG4gICAgICB2YXIgZGVmYXVsdFdpZHRoID0gNTA7XHJcbiAgICAgIHZhciBkZWZhdWx0SGVpZ2h0ID0gNTA7XHJcblxyXG4gICAgICBpZiAodmlzaWJpbGl0eSkge1xyXG4gICAgICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgY2xhc3M6IHNiZ25jbGFzcyxcclxuICAgIFx0ICBsYW5ndWFnZTogbGFuZ3VhZ2UsXHJcbiAgICAgICAgYmJveDoge1xyXG4gICAgICAgICAgdzogZGVmYXVsdFdpZHRoLFxyXG4gICAgICAgICAgaDogZGVmYXVsdEhlaWdodCxcclxuICAgICAgICAgIHg6IHgsXHJcbiAgICAgICAgICB5OiB5XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdGF0ZXNhbmRpbmZvczogW10sXHJcbiAgICAgICAgcG9ydHM6IFtdXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZihpZCkge1xyXG4gICAgICAgIGRhdGEuaWQgPSBpZDtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBkYXRhLmlkID0gZWxlbWVudFV0aWxpdGllcy5nZW5lcmF0ZU5vZGVJZCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgICAgZGF0YS5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZXh0ZW5kTm9kZURhdGFXaXRoQ2xhc3NEZWZhdWx0cyggZGF0YSwgc2JnbmNsYXNzICk7XHJcblxyXG4gICAgICAvLyBzb21lIGRlZmF1bHRzIGFyZSBub3Qgc2V0IGJ5IGV4dGVuZE5vZGVEYXRhV2l0aENsYXNzRGVmYXVsdHMoKVxyXG4gICAgICB2YXIgZGVmYXVsdHMgPSB0aGlzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBzYmduY2xhc3MgKTtcclxuXHJcbiAgICAgIGlmICggZGVmYXVsdHNbICdtdWx0aW1lcicgXSApIHtcclxuICAgICAgICBkYXRhLmNsYXNzICs9ICcgbXVsdGltZXInO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIGRlZmF1bHRzWyAnY2xvbmVtYXJrZXInIF0gKSB7XHJcbiAgICAgICAgZGF0YVsgJ2Nsb25lbWFya2VyJyBdID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YS5iYm94WyAndycgXSA9IGRlZmF1bHRzWyAnd2lkdGgnIF07XHJcbiAgICAgIGRhdGEuYmJveFsgJ2gnIF0gPSBkZWZhdWx0c1sgJ2hlaWdodCcgXTtcclxuXHJcbiAgICAgIHZhciBlbGVzID0gY3kuYWRkKHtcclxuICAgICAgICBncm91cDogXCJub2Rlc1wiLFxyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgY3NzOiBjc3MsXHJcbiAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgIHg6IHgsXHJcbiAgICAgICAgICB5OiB5XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhciBuZXdOb2RlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAvLyBHZXQgdGhlIGRlZmF1bHQgcG9ydHMgb3JkZXJpbmcgZm9yIHRoZSBub2RlcyB3aXRoIGdpdmVuIHNiZ25jbGFzc1xyXG4gICAgICB2YXIgb3JkZXJpbmcgPSBkZWZhdWx0c1sncG9ydHMtb3JkZXJpbmcnXTtcclxuXHJcbiAgICAgIC8vIElmIHRoZXJlIGlzIGEgZGVmYXVsdCBwb3J0cyBvcmRlcmluZyBmb3IgdGhlIG5vZGVzIHdpdGggZ2l2ZW4gc2JnbmNsYXNzIGFuZCBpdCBpcyBkaWZmZXJlbnQgdGhhbiAnbm9uZScgc2V0IHRoZSBwb3J0cyBvcmRlcmluZyB0byB0aGF0IG9yZGVyaW5nXHJcbiAgICAgIGlmIChvcmRlcmluZyAmJiBvcmRlcmluZyAhPT0gJ25vbmUnKSB7XHJcbiAgICAgICAgdGhpcy5zZXRQb3J0c09yZGVyaW5nKG5ld05vZGUsIG9yZGVyaW5nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGxhbmd1YWdlID09IFwiQUZcIiAmJiAhZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlTXVsdGlwbGVVbml0T2ZJbmZvcm1hdGlvbihuZXdOb2RlKSl7XHJcbiAgICAgICAgaWYgKHNiZ25jbGFzcyAhPSBcIkJBIHBsYWluXCIpIHsgLy8gaWYgQUYgbm9kZSBjYW4gaGF2ZSBsYWJlbCBpLmU6IG5vdCBwbGFpbiBiaW9sb2dpY2FsIGFjdGl2aXR5XHJcbiAgICAgICAgICB2YXIgdW9pX29iaiA9IHtcclxuICAgICAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgdW9pX29iai5sYWJlbCA9IHtcclxuICAgICAgICAgICAgdGV4dDogXCJcIlxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICB1b2lfb2JqLmJib3ggPSB7XHJcbiAgICAgICAgICAgICB3OiAxMixcclxuICAgICAgICAgICAgIGg6IDEyXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChuZXdOb2RlLCB1b2lfb2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIG5vZGUgYmcgaW1hZ2Ugd2FzIHVuZXhwZWN0ZWRseSBub3QgcmVuZGVyZWQgdW50aWwgaXQgaXMgY2xpY2tlZFxyXG4gICAgICAvLyB1c2UgdGhpcyBkaXJ0eSBoYWNrIHVudGlsIGZpbmRpbmcgYSBzb2x1dGlvbiB0byB0aGUgcHJvYmxlbVxyXG4gICAgICB2YXIgYmdJbWFnZSA9IG5ld05vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpO1xyXG4gICAgICBpZiAoIGJnSW1hZ2UgKSB7XHJcbiAgICAgICAgbmV3Tm9kZS5kYXRhKCAnYmFja2dyb3VuZC1pbWFnZScsIGJnSW1hZ2UgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG5ld05vZGU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vU2F2ZXMgb2xkIGF1eCB1bml0cyBvZiBnaXZlbiBub2RlXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNhdmVVbml0cyA9IGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgdmFyIHRlbXBEYXRhID0gW107XHJcbiAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgIG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5mb3JFYWNoKCBmdW5jdGlvbihlbGUpIHtcclxuICAgICAgICB0ZW1wRGF0YS5wdXNoKHtcclxuICAgICAgICAgIHg6IGVsZS5iYm94LngsXHJcbiAgICAgICAgICB5OiBlbGUuYmJveC55LFxyXG4gICAgICAgICAgYW5jaG9yU2lkZTogZWxlLmFuY2hvclNpZGUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaW5kZXgrKztcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiB0ZW1wRGF0YTtcclxuICAgIH07XHJcblxyXG4gICAgLy9SZXN0b3JlcyBmcm9tIGdpdmVuIGRhdGFcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZVVuaXRzID0gZnVuY3Rpb24obm9kZSwgZGF0YSkge1xyXG4gICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykuZm9yRWFjaCggZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgZWxlLmJib3gueCA9IGRhdGFbaW5kZXhdLng7XHJcbiAgICAgICAgICBlbGUuYmJveC55ID0gZGF0YVtpbmRleF0ueVxyXG4gICAgICAgICAgdmFyIGFuY2hvclNpZGUgPSBlbGUuYW5jaG9yU2lkZTtcclxuICAgICAgICAgIGVsZS5hbmNob3JTaWRlID0gZGF0YVtpbmRleF0uYW5jaG9yU2lkZTtcclxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW9kaWZ5VW5pdHMobm9kZSwgZWxlLCBhbmNob3JTaWRlKTtcclxuICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLy9Nb2RpZnkgYXV4IHVuaXQgbGF5b3V0c1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5tb2RpZnlVbml0cyA9IGZ1bmN0aW9uIChub2RlLCBlbGUsIGFuY2hvclNpZGUpIHtcclxuICAgICAgaW5zdGFuY2UuY2xhc3Nlcy5BdXhVbml0TGF5b3V0Lm1vZGlmeVVuaXRzKG5vZGUsIGVsZSwgYW5jaG9yU2lkZSwgY3kpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy9Gb3IgcmV2ZXJzaWJsZSByZWFjdGlvbnMgYm90aCBzaWRlIG9mIHRoZSBwcm9jZXNzIGNhbiBiZSBpbnB1dC9vdXRwdXRcclxuICAgIC8vR3JvdXAgSUQgaWRlbnRpZmllcyB0byB3aGljaCBncm91cCBvZiBub2RlcyB0aGUgZWRnZSBpcyBnb2luZyB0byBiZSBjb25uZWN0ZWQgZm9yIHJldmVyc2libGUgcmVhY3Rpb25zKDA6IGdyb3VwIDEgSUQgYW5kIDE6Z3JvdXAgMiBJRClcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHRhcmdldCwgZWRnZVBhcmFtcywgaWQsIHZpc2liaWxpdHksIGdyb3VwSUQgKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgZWRnZVBhcmFtcyAhPSAnb2JqZWN0Jyl7XHJcbiAgICAgICAgdmFyIHNiZ25jbGFzcyA9IGVkZ2VQYXJhbXM7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YXIgc2JnbmNsYXNzID0gZWRnZVBhcmFtcy5jbGFzcztcclxuICAgICAgICAgIHZhciBsYW5ndWFnZSA9IGVkZ2VQYXJhbXMubGFuZ3VhZ2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjc3MgPSB7fTtcclxuXHJcbiAgICAgIGlmICh2aXNpYmlsaXR5KSB7XHJcbiAgICAgICAgY3NzLnZpc2liaWxpdHkgPSB2aXNpYmlsaXR5O1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgIHNvdXJjZTogc291cmNlLFxyXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXHJcbiAgICAgICAgICBjbGFzczogc2JnbmNsYXNzLFxyXG4gICAgICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyIGRlZmF1bHRzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyggc2JnbmNsYXNzICk7XHJcblxyXG4gICAgICAvLyBleHRlbmQgdGhlIGRhdGEgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMgb2YgZWRnZSBzdHlsZVxyXG4gICAgICBPYmplY3Qua2V5cyggZGVmYXVsdHMgKS5mb3JFYWNoKCBmdW5jdGlvbiggcHJvcCApIHtcclxuICAgICAgICBkYXRhWyBwcm9wIF0gPSBkZWZhdWx0c1sgcHJvcCBdO1xyXG4gICAgICB9ICk7XHJcblxyXG4gICAgICBpZihpZCkge1xyXG4gICAgICAgIGRhdGEuaWQgPSBpZDtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBkYXRhLmlkID0gZWxlbWVudFV0aWxpdGllcy5nZW5lcmF0ZUVkZ2VJZCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZihlbGVtZW50VXRpbGl0aWVzLmNhbkhhdmVTQkdOQ2FyZGluYWxpdHkoc2JnbmNsYXNzKSl7XHJcbiAgICAgICAgZGF0YS5jYXJkaW5hbGl0eSA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBzb3VyY2VOb2RlID0gY3kuZ2V0RWxlbWVudEJ5SWQoc291cmNlKTsgLy8gVGhlIG9yaWdpbmFsIHNvdXJjZSBub2RlXHJcbiAgICAgIHZhciB0YXJnZXROb2RlID0gY3kuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KTsgLy8gVGhlIG9yaWdpbmFsIHRhcmdldCBub2RlXHJcbiAgICAgIHZhciBzb3VyY2VIYXNQb3J0cyA9IHNvdXJjZU5vZGUuZGF0YSgncG9ydHMnKS5sZW5ndGggPT09IDI7XHJcbiAgICAgIHZhciB0YXJnZXRIYXNQb3J0cyA9IHRhcmdldE5vZGUuZGF0YSgncG9ydHMnKS5sZW5ndGggPT09IDI7XHJcbiAgICAgIC8vIFRoZSBwb3J0c291cmNlIGFuZCBwb3J0dGFyZ2V0IHZhcmlhYmxlc1xyXG4gICAgICB2YXIgcG9ydHNvdXJjZTtcclxuICAgICAgdmFyIHBvcnR0YXJnZXQ7XHJcblxyXG4gICAgICAvKlxyXG4gICAgICAgKiBHZXQgaW5wdXQvb3V0cHV0IHBvcnQgaWQncyBvZiBhIG5vZGUgd2l0aCB0aGUgYXNzdW1wdGlvbiB0aGF0IHRoZSBub2RlIGhhcyB2YWxpZCBwb3J0cy5cclxuICAgICAgICovXHJcbiAgICAgIHZhciBnZXRJT1BvcnRJZHMgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgIHZhciBub2RlSW5wdXRQb3J0SWQsIG5vZGVPdXRwdXRQb3J0SWQ7XHJcbiAgICAgICAgdmFyIG5vZGVQb3J0c09yZGVyaW5nID0gc2JnbnZpekluc3RhbmNlLmVsZW1lbnRVdGlsaXRpZXMuZ2V0UG9ydHNPcmRlcmluZyhub2RlKTtcclxuICAgICAgICB2YXIgbm9kZVBvcnRzID0gbm9kZS5kYXRhKCdwb3J0cycpO1xyXG4gICAgICAgIGlmICggbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdMLXRvLVInIHx8IG5vZGVQb3J0c09yZGVyaW5nID09PSAnUi10by1MJyApIHtcclxuICAgICAgICAgIHZhciBsZWZ0UG9ydElkID0gbm9kZVBvcnRzWzBdLnggPCAwID8gbm9kZVBvcnRzWzBdLmlkIDogbm9kZVBvcnRzWzFdLmlkOyAvLyBUaGUgeCB2YWx1ZSBvZiBsZWZ0IHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgbmVnYXRpdmVcclxuICAgICAgICAgIHZhciByaWdodFBvcnRJZCA9IG5vZGVQb3J0c1swXS54ID4gMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHggdmFsdWUgb2YgcmlnaHQgcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBwb3NpdGl2ZVxyXG4gICAgICAgICAgLypcclxuICAgICAgICAgICAqIElmIHRoZSBwb3J0IG9yZGVyaW5nIGlzIGxlZnQgdG8gcmlnaHQgdGhlbiB0aGUgaW5wdXQgcG9ydCBpcyB0aGUgbGVmdCBwb3J0IGFuZCB0aGUgb3V0cHV0IHBvcnQgaXMgdGhlIHJpZ2h0IHBvcnQuXHJcbiAgICAgICAgICAgKiBFbHNlIGlmIGl0IGlzIHJpZ2h0IHRvIGxlZnQgaXQgaXMgdmljZSB2ZXJzYVxyXG4gICAgICAgICAgICovXHJcbiAgICAgICAgICBub2RlSW5wdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0wtdG8tUicgPyBsZWZ0UG9ydElkIDogcmlnaHRQb3J0SWQ7XHJcbiAgICAgICAgICBub2RlT3V0cHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdSLXRvLUwnID8gbGVmdFBvcnRJZCA6IHJpZ2h0UG9ydElkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICggbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdULXRvLUInIHx8IG5vZGVQb3J0c09yZGVyaW5nID09PSAnQi10by1UJyApe1xyXG4gICAgICAgICAgdmFyIHRvcFBvcnRJZCA9IG5vZGVQb3J0c1swXS55IDwgMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHkgdmFsdWUgb2YgdG9wIHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgbmVnYXRpdmVcclxuICAgICAgICAgIHZhciBib3R0b21Qb3J0SWQgPSBub2RlUG9ydHNbMF0ueSA+IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB5IHZhbHVlIG9mIGJvdHRvbSBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIHBvc2l0aXZlXHJcbiAgICAgICAgICAvKlxyXG4gICAgICAgICAgICogSWYgdGhlIHBvcnQgb3JkZXJpbmcgaXMgdG9wIHRvIGJvdHRvbSB0aGVuIHRoZSBpbnB1dCBwb3J0IGlzIHRoZSB0b3AgcG9ydCBhbmQgdGhlIG91dHB1dCBwb3J0IGlzIHRoZSBib3R0b20gcG9ydC5cclxuICAgICAgICAgICAqIEVsc2UgaWYgaXQgaXMgcmlnaHQgdG8gbGVmdCBpdCBpcyB2aWNlIHZlcnNhXHJcbiAgICAgICAgICAgKi9cclxuICAgICAgICAgIG5vZGVJbnB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnVC10by1CJyA/IHRvcFBvcnRJZCA6IGJvdHRvbVBvcnRJZDtcclxuICAgICAgICAgIG5vZGVPdXRwdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0ItdG8tVCcgPyB0b3BQb3J0SWQgOiBib3R0b21Qb3J0SWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZXR1cm4gYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIElPIHBvcnRzIG9mIHRoZSBub2RlXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGlucHV0UG9ydElkOiBub2RlSW5wdXRQb3J0SWQsXHJcbiAgICAgICAgICBvdXRwdXRQb3J0SWQ6IG5vZGVPdXRwdXRQb3J0SWRcclxuICAgICAgICB9O1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gSWYgYXQgbGVhc3Qgb25lIGVuZCBvZiB0aGUgZWRnZSBoYXMgcG9ydHMgdGhlbiB3ZSBzaG91bGQgZGV0ZXJtaW5lIHRoZSBwb3J0cyB3aGVyZSB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkLlxyXG4gICAgICBpZiAoc291cmNlSGFzUG9ydHMgfHwgdGFyZ2V0SGFzUG9ydHMpIHtcclxuICAgICAgICB2YXIgc291cmNlTm9kZUlucHV0UG9ydElkLCBzb3VyY2VOb2RlT3V0cHV0UG9ydElkLCB0YXJnZXROb2RlSW5wdXRQb3J0SWQsIHRhcmdldE5vZGVPdXRwdXRQb3J0SWQ7XHJcblxyXG4gICAgICAgIC8vIElmIHNvdXJjZSBub2RlIGhhcyBwb3J0cyBzZXQgdGhlIHZhcmlhYmxlcyBkZWRpY2F0ZWQgZm9yIGl0cyBJTyBwb3J0c1xyXG4gICAgICAgIGlmICggc291cmNlSGFzUG9ydHMgKSB7XHJcbiAgICAgICAgICB2YXIgaW9Qb3J0cyA9IGdldElPUG9ydElkcyhzb3VyY2VOb2RlKTtcclxuICAgICAgICAgIHNvdXJjZU5vZGVJbnB1dFBvcnRJZCA9IGlvUG9ydHMuaW5wdXRQb3J0SWQ7XHJcbiAgICAgICAgICBzb3VyY2VOb2RlT3V0cHV0UG9ydElkID0gaW9Qb3J0cy5vdXRwdXRQb3J0SWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB0YXJnZXQgbm9kZSBoYXMgcG9ydHMgc2V0IHRoZSB2YXJpYWJsZXMgZGVkaWNhdGVkIGZvciBpdHMgSU8gcG9ydHNcclxuICAgICAgICBpZiAoIHRhcmdldEhhc1BvcnRzICkge1xyXG4gICAgICAgICAgdmFyIGlvUG9ydHMgPSBnZXRJT1BvcnRJZHModGFyZ2V0Tm9kZSk7XHJcbiAgICAgICAgICB0YXJnZXROb2RlSW5wdXRQb3J0SWQgPSBpb1BvcnRzLmlucHV0UG9ydElkO1xyXG4gICAgICAgICAgdGFyZ2V0Tm9kZU91dHB1dFBvcnRJZCA9IGlvUG9ydHMub3V0cHV0UG9ydElkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNiZ25jbGFzcyA9PT0gJ2NvbnN1bXB0aW9uJykge1xyXG4gICAgICAgICAgLy8gQSBjb25zdW1wdGlvbiBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIGlucHV0IHBvcnQgb2YgdGhlIHRhcmdldCBub2RlIHdoaWNoIGlzIHN1cHBvc2VkIHRvIGJlIGEgcHJvY2VzcyAoYW55IGtpbmQgb2YpXHJcbiAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZU91dHB1dFBvcnRJZDtcclxuICAgICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PT0gJ3Byb2R1Y3Rpb24nKSB7XHJcbiAgICAgICAgICAvLyBBIHByb2R1Y3Rpb24gZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBvdXRwdXQgcG9ydCBvZiB0aGUgc291cmNlIG5vZGUgd2hpY2ggaXMgc3VwcG9zZWQgdG8gYmUgYSBwcm9jZXNzIChhbnkga2luZCBvZilcclxuICAgICAgICAgIC8vIEEgbW9kdWxhdGlvbiBlZGdlIG1heSBoYXZlIGEgbG9naWNhbCBvcGVyYXRvciBhcyBzb3VyY2Ugbm9kZSBpbiB0aGlzIGNhc2UgdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgb3V0cHV0IHBvcnQgb2YgaXRcclxuICAgICAgICAgIC8vIFRoZSBiZWxvdyBhc3NpZ25tZW50IHNhdGlzZnkgYWxsIG9mIHRoZXNlIGNvbmRpdGlvblxyXG4gICAgICAgICAgaWYoZ3JvdXBJRCA9PSAwIHx8IGdyb3VwSUQgPT0gdW5kZWZpbmVkKSB7IC8vIGdyb3VwSUQgMCBmb3IgcmV2ZXJzaWJsZSByZWFjdGlvbnMgZ3JvdXAgMFxyXG4gICAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZU91dHB1dFBvcnRJZDtcclxuICAgICAgICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVJbnB1dFBvcnRJZDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgeyAvL2lmIHJlYWN0aW9uIGlzIHJldmVyc2libGUgYW5kIGVkZ2UgYmVsb25ncyB0byBncm91cCAxXHJcbiAgICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlSW5wdXRQb3J0SWQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoZWxlbWVudFV0aWxpdGllcy5pc01vZHVsYXRpb25BcmNDbGFzcyhzYmduY2xhc3MpIHx8IGVsZW1lbnRVdGlsaXRpZXMuaXNBRkFyY0NsYXNzKHNiZ25jbGFzcykpe1xyXG4gICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNiZ25jbGFzcyA9PT0gJ2xvZ2ljIGFyYycpIHtcclxuICAgICAgICAgIHZhciBzcmNDbGFzcyA9IHNvdXJjZU5vZGUuZGF0YSgnY2xhc3MnKTtcclxuICAgICAgICAgIHZhciB0Z3RDbGFzcyA9IHRhcmdldE5vZGUuZGF0YSgnY2xhc3MnKTtcclxuICAgICAgICAgIHZhciBpc1NvdXJjZUxvZ2ljYWxPcCA9IHNyY0NsYXNzID09PSAnYW5kJyB8fCBzcmNDbGFzcyA9PT0gJ29yJyB8fCBzcmNDbGFzcyA9PT0gJ25vdCc7XHJcbiAgICAgICAgICB2YXIgaXNUYXJnZXRMb2dpY2FsT3AgPSB0Z3RDbGFzcyA9PT0gJ2FuZCcgfHwgdGd0Q2xhc3MgPT09ICdvcicgfHwgdGd0Q2xhc3MgPT09ICdub3QnO1xyXG5cclxuICAgICAgICAgIGlmIChpc1NvdXJjZUxvZ2ljYWxPcCAmJiBpc1RhcmdldExvZ2ljYWxPcCkge1xyXG4gICAgICAgICAgICAvLyBJZiBib3RoIGVuZCBhcmUgbG9naWNhbCBvcGVyYXRvcnMgdGhlbiB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSB0YXJnZXQgYW5kIHRoZSBvdXRwdXQgcG9ydCBvZiB0aGUgaW5wdXRcclxuICAgICAgICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVJbnB1dFBvcnRJZDtcclxuICAgICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XHJcbiAgICAgICAgICB9Ly8gSWYganVzdCBvbmUgZW5kIG9mIGxvZ2ljYWwgb3BlcmF0b3IgdGhlbiB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSBsb2dpY2FsIG9wZXJhdG9yXHJcbiAgICAgICAgICBlbHNlIGlmIChpc1NvdXJjZUxvZ2ljYWxPcCkge1xyXG4gICAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZUlucHV0UG9ydElkO1xyXG4gICAgICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZU91dHB1dFBvcnRJZDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYgKGlzVGFyZ2V0TG9naWNhbE9wKSB7XHJcbiAgICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlT3V0cHV0UG9ydElkO1xyXG4gICAgICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZUlucHV0UG9ydElkO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gVGhlIGRlZmF1bHQgcG9ydHNvdXJjZS9wb3J0dGFyZ2V0IGFyZSB0aGUgc291cmNlL3RhcmdldCB0aGVtc2VsdmVzLiBJZiB0aGV5IGFyZSBub3Qgc2V0IHVzZSB0aGVzZSBkZWZhdWx0cy5cclxuICAgICAgLy8gVGhlIHBvcnRzb3VyY2UgYW5kIHBvcnR0YXJnZXQgYXJlIGRldGVybWluZWQgc2V0IHRoZW0gaW4gZGF0YSBvYmplY3QuXHJcbiAgICAgIGRhdGEucG9ydHNvdXJjZSA9IHBvcnRzb3VyY2UgfHwgc291cmNlO1xyXG4gICAgICBkYXRhLnBvcnR0YXJnZXQgPSBwb3J0dGFyZ2V0IHx8IHRhcmdldDtcclxuXHJcbiAgICAgIHZhciBlbGVzID0gY3kuYWRkKHtcclxuICAgICAgICBncm91cDogXCJlZGdlc1wiLFxyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgY3NzOiBjc3NcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB2YXIgbmV3RWRnZSA9IGVsZXNbZWxlcy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgIHJldHVybiBuZXdFZGdlO1xyXG4gICAgfTtcclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24oX3NvdXJjZSwgX3RhcmdldCwgbm9kZVBhcmFtcykge1xyXG4gICAgICAvLyBJZiBzb3VyY2UgYW5kIHRhcmdldCBJRHMgYXJlIGdpdmVuIGdldCB0aGUgZWxlbWVudHMgYnkgSURzXHJcbiAgICAgIHZhciBzb3VyY2UgPSB0eXBlb2YgX3NvdXJjZSA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfc291cmNlKSA6IF9zb3VyY2U7XHJcbiAgICAgIHZhciB0YXJnZXQgPSB0eXBlb2YgX3RhcmdldCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfdGFyZ2V0KSA6IF90YXJnZXQ7XHJcblxyXG4gICAgICAvLyBQcm9jZXNzIHBhcmVudCBzaG91bGQgYmUgdGhlIGNsb3Nlc3QgY29tbW9uIGFuY2VzdG9yIG9mIHRoZSBzb3VyY2UgYW5kIHRhcmdldCBub2Rlc1xyXG4gICAgICB2YXIgcHJvY2Vzc1BhcmVudCA9IGN5LmNvbGxlY3Rpb24oW3NvdXJjZVswXSwgdGFyZ2V0WzBdXSkuY29tbW9uQW5jZXN0b3JzKCkuZmlyc3QoKTtcclxuXHJcbiAgICAgIC8vIFByb2Nlc3Mgc2hvdWxkIGJlIGF0IHRoZSBtaWRkbGUgb2YgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0IG5vZGVzXHJcbiAgICAgIHZhciB4ID0gKCBzb3VyY2UucG9zaXRpb24oJ3gnKSArIHRhcmdldC5wb3NpdGlvbigneCcpICkgLyAyO1xyXG4gICAgICB2YXIgeSA9ICggc291cmNlLnBvc2l0aW9uKCd5JykgKyB0YXJnZXQucG9zaXRpb24oJ3knKSApIC8gMjtcclxuXHJcbiAgICAgIC8vIENyZWF0ZSB0aGUgcHJvY2VzcyB3aXRoIGdpdmVuL2NhbGN1bGF0ZWQgdmFyaWFibGVzXHJcbiAgICAgIHZhciBwcm9jZXNzID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHgsIHksIG5vZGVQYXJhbXMsIHVuZGVmaW5lZCwgcHJvY2Vzc1BhcmVudC5pZCgpKTtcclxuICAgICAgICB2YXIgeGRpZmYgPSBzb3VyY2UucG9zaXRpb24oJ3gnKSAtIHRhcmdldC5wb3NpdGlvbigneCcpO1xyXG4gICAgICAgIHZhciB5ZGlmZiA9IHNvdXJjZS5wb3NpdGlvbigneScpIC0gdGFyZ2V0LnBvc2l0aW9uKCd5JylcclxuICAgICAgICBpZiAoTWF0aC5hYnMoeGRpZmYpID49IE1hdGguYWJzKHlkaWZmKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh4ZGlmZiA8IDApXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ0wtdG8tUicpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ1ItdG8tTCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoeWRpZmYgPCAwKVxyXG4gICAgICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdULXRvLUInKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdCLXRvLVQnKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgLy8gQ3JlYXRlIHRoZSBlZGdlcyBvbmUgaXMgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIHNvdXJjZSBub2RlICh3aGljaCBzaG91bGQgYmUgYSBjb25zdW1wdGlvbiksXHJcbiAgICAgIC8vIHRoZSBvdGhlciBvbmUgaXMgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIHRhcmdldCBub2RlICh3aGljaCBzaG91bGQgYmUgYSBwcm9kdWN0aW9uKS5cclxuICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gcGxlYXNlIHJlZmVyIHRvIFNCR04tUEQgcmVmZXJlbmNlIGNhcmQuXHJcbiAgICAgIHZhciBlZGdlQnR3U3JjID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZS5pZCgpLCBwcm9jZXNzLmlkKCksIHtjbGFzcyA6ICdjb25zdW1wdGlvbicsIGxhbmd1YWdlIDogbm9kZVBhcmFtcy5sYW5ndWFnZX0pO1xyXG4gICAgICB2YXIgZWRnZUJ0d1RndCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIHRhcmdldC5pZCgpLCB7Y2xhc3MgOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlIDogbm9kZVBhcmFtcy5sYW5ndWFnZX0pO1xyXG5cclxuICAgICAgLy8gQ3JlYXRlIGEgY29sbGVjdGlvbiBpbmNsdWRpbmcgdGhlIGVsZW1lbnRzIGFuZCB0byBiZSByZXR1cm5lZFxyXG4gICAgICB2YXIgY29sbGVjdGlvbiA9IGN5LmNvbGxlY3Rpb24oW3Byb2Nlc3NbMF0sIGVkZ2VCdHdTcmNbMF0sIGVkZ2VCdHdUZ3RbMF1dKTtcclxuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGlzIG1ldGhvZCBhc3N1bWVzIHRoYXQgcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZCBjb250YWlucyBhdCBsZWFzdCBvbmUgbm9kZVxyXG4gICAgICogYW5kIGFsbCBvZiB0aGUgbm9kZXMgaW5jbHVkaW5nIGluIGl0IGhhdmUgdGhlIHNhbWUgcGFyZW50LiBJdCBjcmVhdGVzIGEgY29tcG91bmQgZm90IHRoZSBnaXZlbiBub2RlcyBhbiBoYXZpbmcgdGhlIGdpdmVuIHR5cGUuXHJcbiAgICAgKi9cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKG5vZGVzVG9NYWtlQ29tcG91bmQsIGNvbXBvdW5kVHlwZSkge1xyXG4gICAgICB2YXIgb2xkUGFyZW50SWQgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJwYXJlbnRcIik7XHJcbiAgICAgIHZhciBsYW5ndWFnZSA9IG5vZGVzVG9NYWtlQ29tcG91bmRbMF0uZGF0YShcImxhbmd1YWdlXCIpO1xyXG4gICAgICAvLyBpZiBub2Rlc1RvTWFrZUNvbXBvdW5kIGNvbnRhaW4gYm90aCBQRCBhbmQgQUYgbm9kZXMsIHRoZW4gc2V0IGxhbmd1YWdlIG9mIGNvbXBvdW5kIGFzIFVua25vd25cclxuICAgICAgZm9yKCB2YXIgaT0xOyBpPG5vZGVzVG9NYWtlQ29tcG91bmQubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIGlmKG5vZGVzVG9NYWtlQ29tcG91bmRbaV0gIT0gbGFuZ3VhZ2Upe1xyXG4gICAgICAgICAgbGFuZ3VhZ2UgPSBcIlVua25vd25cIjtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kLiB4LCB5IGFuZCBpZCBwYXJhbWV0ZXJzIGFyZSBub3Qgc2V0LlxyXG4gICAgICB2YXIgbmV3Q29tcG91bmQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHtjbGFzcyA6IGNvbXBvdW5kVHlwZSwgbGFuZ3VhZ2UgOiBsYW5ndWFnZX0sIHVuZGVmaW5lZCwgb2xkUGFyZW50SWQpO1xyXG4gICAgICB2YXIgbmV3Q29tcG91bmRJZCA9IG5ld0NvbXBvdW5kLmlkKCk7XHJcbiAgICAgIHZhciBuZXdFbGVzID0gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQobm9kZXNUb01ha2VDb21wb3VuZCwgbmV3Q29tcG91bmRJZCk7XHJcbiAgICAgIG5ld0VsZXMgPSBuZXdFbGVzLnVuaW9uKG5ld0NvbXBvdW5kKTtcclxuICAgICAgcmV0dXJuIG5ld0VsZXM7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcclxuICAgICAqIGluIHRoZSBjb21wbGV4LiBQYXJhbWV0ZXJzIGFyZSBleHBsYWluZWQgYmVsb3cuXHJcbiAgICAgKiB0ZW1wbGF0ZVR5cGU6IFRoZSB0eXBlIG9mIHRoZSB0ZW1wbGF0ZSByZWFjdGlvbi4gSXQgbWF5IGJlICdhc3NvY2lhdGlvbicgb3IgJ2Rpc3NvY2lhdGlvbicgZm9yIG5vdy5cclxuICAgICAqIG5vZGVMaXN0OiBUaGUgbGlzdCBvZiB0aGUgbmFtZXMgYW5kIHR5cGVzIG9mIG1vbGVjdWxlcyB3aGljaCB3aWxsIGludm9sdmUgaW4gdGhlIHJlYWN0aW9uLlxyXG4gICAgICogY29tcGxleE5hbWU6IFRoZSBuYW1lIG9mIHRoZSBjb21wbGV4IGluIHRoZSByZWFjdGlvbi5cclxuICAgICAqIHByb2Nlc3NQb3NpdGlvbjogVGhlIG1vZGFsIHBvc2l0aW9uIG9mIHRoZSBwcm9jZXNzIGluIHRoZSByZWFjdGlvbi4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgdGhlIGNlbnRlciBvZiB0aGUgY2FudmFzLlxyXG4gICAgICogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxyXG4gICAgICogdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IFRoaXMgb3B0aW9uIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBjb3NlLWJpbGtlbnQgbGF5b3V0IHdpdGggdGhlIHNhbWUgbmFtZS4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgMTUuXHJcbiAgICAgKiBlZGdlTGVuZ3RoOiBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIG1hY3JvbW9sZWN1bGVzIGF0IHRoZSBib3RoIHNpZGVzLlxyXG4gICAgICovXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAodGVtcGxhdGVUeXBlLCBub2RlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCwgbGF5b3V0UGFyYW0pIHtcclxuXHJcbiAgICAgIHZhciBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIFwibWFjcm9tb2xlY3VsZVwiICk7XHJcbiAgICAgIHZhciBkZWZhdWx0U2ltcGxlQ2hlbWljYWxQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyggXCJzaW1wbGUgY2hlbWljYWxcIiApO1xyXG4gICAgICB2YXIgZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyggdGVtcGxhdGVUeXBlICk7XHJcbiAgICAgIHZhciBwcm9jZXNzV2lkdGggPSBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMud2lkdGggfHwgNTA7XHJcbiAgICAgIHZhciBtYWNyb21vbGVjdWxlV2lkdGggPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcy53aWR0aCB8fCA1MDtcclxuICAgICAgdmFyIG1hY3JvbW9sZWN1bGVIZWlnaHQgPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XHJcbiAgICAgIHZhciBzaW1wbGVDaGVtaWNhbFdpZHRoID0gZGVmYXVsdFNpbXBsZUNoZW1pY2FsUHJvcGVydGllcy53aWR0aCB8fCAzNTtcclxuICAgICAgdmFyIHNpbXBsZUNoZW1pY2FsSGVpZ2h0ID0gZGVmYXVsdFNpbXBsZUNoZW1pY2FsUHJvcGVydGllcy5oZWlnaHQgfHwgMzU7XHJcbiAgICAgIHZhciBwcm9jZXNzUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24gfHwgZWxlbWVudFV0aWxpdGllcy5jb252ZXJ0VG9Nb2RlbFBvc2l0aW9uKHt4OiBjeS53aWR0aCgpIC8gMiwgeTogY3kuaGVpZ2h0KCkgLyAyfSk7XHJcbiAgICAgIHZhciBub2RlTGlzdCA9IG5vZGVMaXN0O1xyXG4gICAgICB2YXIgY29tcGxleE5hbWUgPSBjb21wbGV4TmFtZTtcclxuICAgICAgdmFyIG51bU9mTW9sZWN1bGVzID0gbm9kZUxpc3QubGVuZ3RoO1xyXG4gICAgICB2YXIgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsID0gdGlsaW5nUGFkZGluZ1ZlcnRpY2FsIHx8IDE1O1xyXG4gICAgICB2YXIgdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPSB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCB8fCAxNTtcclxuICAgICAgdmFyIGVkZ2VMZW5ndGggPSBlZGdlTGVuZ3RoIHx8IDYwO1xyXG5cclxuICAgICAgY3kuc3RhcnRCYXRjaCgpO1xyXG5cclxuICAgICAgdmFyIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzO1xyXG4gICAgICB2YXIgeFBvc2l0aW9uT2ZJbnB1dE1hY3JvbW9sZWN1bGVzO1xyXG5cclxuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgICAgIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSkge1xyXG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiUERcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYodGVtcGxhdGVUeXBlID09PSAnZGlzc29jaWF0aW9uJyl7XHJcbiAgICAgICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcclxuICAgICAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKSB7XHJcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJQRFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJIeWJyaWRBbnlcIik7XHJcbiAgICAgICAgeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcclxuICAgICAgICB4UG9zaXRpb25PZklucHV0TWFjcm9tb2xlY3VsZXMgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy9DcmVhdGUgdGhlIHByb2Nlc3MgaW4gdGVtcGxhdGUgdHlwZVxyXG4gICAgICB2YXIgcHJvY2VzcztcclxuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ3JldmVyc2libGUnKSB7XHJcbiAgICAgICAgcHJvY2VzcyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHtjbGFzcyA6ICdwcm9jZXNzJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdMLXRvLVInKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB7Y2xhc3MgOiB0ZW1wbGF0ZVR5cGUsIGxhbmd1YWdlIDogJ1BEJ30pO1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnTC10by1SJyk7XHJcbiAgICAgIH1cclxuICAgICAgcHJvY2Vzcy5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgIC8vRGVmaW5lIHRoZSBzdGFydGluZyB5IHBvc2l0aW9uXHJcbiAgICAgIHZhciB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZNb2xlY3VsZXMgLSAxKSAvIDIpICogKG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpO1xyXG5cclxuICAgICAgLy9DcmVhdGUgdGhlIGZyZWUgbW9sZWN1bGVzXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZNb2xlY3VsZXM7IGkrKykge1xyXG4gICAgICAgIC8vIG5vZGUgYWRkaXRpb24gb3BlcmF0aW9uIGlzIGRldGVybWluZWQgYnkgbW9sZWN1bGUgdHlwZVxyXG4gICAgICAgIGlmKG5vZGVMaXN0W2ldLnR5cGUgPT0gXCJTaW1wbGUgQ2hlbWljYWxcIil7XHJcbiAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcywgeVBvc2l0aW9uLCB7Y2xhc3MgOiAnc2ltcGxlIGNoZW1pY2FsJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XHJcbiAgICAgICAgICAvL3VwZGF0ZSB0aGUgeSBwb3NpdGlvblxyXG4gICAgICAgICAgeVBvc2l0aW9uICs9IHNpbXBsZUNoZW1pY2FsSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMsIHlQb3NpdGlvbiwge2NsYXNzIDogJ21hY3JvbW9sZWN1bGUnLCBsYW5ndWFnZSA6ICdQRCd9KTtcclxuICAgICAgICAgIC8vdXBkYXRlIHRoZSB5IHBvc2l0aW9uXHJcbiAgICAgICAgICB5UG9zaXRpb24gKz0gbWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuICAgICAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbm9kZUxpc3RbaV0ubmFtZSk7XHJcblxyXG4gICAgICAgIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5lY3RlZCB0byB0aGUgbmV3IG1vbGVjdWxlXHJcbiAgICAgICAgdmFyIG5ld0VkZ2U7XHJcbiAgICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xyXG4gICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdOb2RlLmlkKCksIHByb2Nlc3MuaWQoKSwge2NsYXNzIDogJ2NvbnN1bXB0aW9uJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGVtcGxhdGVUeXBlID09PSAnZGlzc29jaWF0aW9uJyl7XHJcbiAgICAgICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgbmV3Tm9kZS5pZCgpLCB7Y2xhc3MgOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgLy9Hcm91cCByaWdodCBvciB0b3AgZWxlbWVudHMgaW4gZ3JvdXAgaWQgMVxyXG4gICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIG5ld05vZGUuaWQoKSwge2NsYXNzIDogJ3Byb2R1Y3Rpb24nLCBsYW5ndWFnZSA6ICdQRCd9LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXdFZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZih0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicgfHwgdGVtcGxhdGVUeXBlID09ICdkaXNzb2NpYXRpb24nKXtcclxuICAgICAgICAvL0NyZWF0ZSB0aGUgY29tcGxleCBpbmNsdWRpbmcgbWFjcm9tb2xlY3VsZXMgaW5zaWRlIG9mIGl0XHJcbiAgICAgICAgLy9UZW1wcm9yYXJpbHkgYWRkIGl0IHRvIHRoZSBwcm9jZXNzIHBvc2l0aW9uIHdlIHdpbGwgbW92ZSBpdCBhY2NvcmRpbmcgdG8gdGhlIGxhc3Qgc2l6ZSBvZiBpdFxyXG4gICAgICAgIHZhciBjb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwge2NsYXNzIDogJ2NvbXBsZXgnLCBsYW5ndWFnZSA6ICdQRCd9KTtcclxuICAgICAgICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xyXG4gICAgICAgIGNvbXBsZXguZGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScsIHRydWUpO1xyXG5cclxuICAgICAgICAvL0lmIGEgbmFtZSBpcyBzcGVjaWZpZWQgZm9yIHRoZSBjb21wbGV4IHNldCBpdHMgbGFiZWwgYWNjb3JkaW5nbHlcclxuICAgICAgICBpZiAoY29tcGxleE5hbWUpIHtcclxuICAgICAgICAgIGNvbXBsZXguZGF0YSgnbGFiZWwnLCBjb21wbGV4TmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2NyZWF0ZSB0aGUgZWRnZSBjb25ubmVjdGVkIHRvIHRoZSBjb21wbGV4XHJcbiAgICAgICAgdmFyIGVkZ2VPZkNvbXBsZXg7XHJcblxyXG4gICAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgICAgICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBjb21wbGV4LmlkKCksIHtjbGFzcyA6ICdwcm9kdWN0aW9uJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgZWRnZU9mQ29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShjb21wbGV4LmlkKCksIHByb2Nlc3MuaWQoKSwge2NsYXNzIDogJ2NvbnN1bXB0aW9uJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlZGdlT2ZDb21wbGV4LmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTW9sZWN1bGVzOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAvLyBBZGQgYSBtb2xlY3VsZShkZXBlbmRlbnQgb24gaXQncyB0eXBlKSBub3QgaGF2aW5nIGEgcHJldmlvdXNseSBkZWZpbmVkIGlkIGFuZCBoYXZpbmcgdGhlIGNvbXBsZXggY3JlYXRlZCBpbiB0aGlzIHJlYWN0aW9uIGFzIHBhcmVudFxyXG4gICAgICAgICAgaWYobm9kZUxpc3RbaV0udHlwZSA9PSAnU2ltcGxlIENoZW1pY2FsJyl7XHJcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKGNvbXBsZXgucG9zaXRpb24oJ3gnKSwgY29tcGxleC5wb3NpdGlvbigneScpLCB7Y2xhc3MgOiAnc2ltcGxlIGNoZW1pY2FsJywgbGFuZ3VhZ2UgOiAnUEQnfSwgdW5kZWZpbmVkLCBjb21wbGV4LmlkKCkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoY29tcGxleC5wb3NpdGlvbigneCcpLCBjb21wbGV4LnBvc2l0aW9uKCd5JyksIHtjbGFzcyA6ICdtYWNyb21vbGVjdWxlJywgbGFuZ3VhZ2UgOiAnUEQnfSwgdW5kZWZpbmVkLCBjb21wbGV4LmlkKCkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbm9kZUxpc3RbaV0ubmFtZSk7XHJcbiAgICAgICAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgdGhlIGlucHV0IG1hY3JvbW9sZWN1bGVzXHJcbiAgICAgICAgdmFyIG51bU9mSW5wdXRNYWNyb21vbGVjdWxlcyA9IGNvbXBsZXhOYW1lLmxlbmd0aDtcclxuICAgICAgICB5UG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZJbnB1dE1hY3JvbW9sZWN1bGVzIC0gMSkgLyAyKSAqIChtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZklucHV0TWFjcm9tb2xlY3VsZXM7IGkrKykge1xyXG5cclxuICAgICAgICAgIGlmKGNvbXBsZXhOYW1lW2ldLnR5cGUgPT0gJ1NpbXBsZSBDaGVtaWNhbCcpe1xyXG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZklucHV0TWFjcm9tb2xlY3VsZXMsIHlQb3NpdGlvbiwge2NsYXNzIDogJ3NpbXBsZSBjaGVtaWNhbCcsIGxhbmd1YWdlIDogJ1BEJ30pO1xyXG4gICAgICAgICAgICB5UG9zaXRpb24gKz0gc2ltcGxlQ2hlbWljYWxIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZklucHV0TWFjcm9tb2xlY3VsZXMsIHlQb3NpdGlvbiwge2NsYXNzIDogJ21hY3JvbW9sZWN1bGUnLCBsYW5ndWFnZSA6ICdQRCd9KTtcclxuICAgICAgICAgICAgeVBvc2l0aW9uICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuICAgICAgICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBjb21wbGV4TmFtZVtpXS5uYW1lKTtcclxuXHJcbiAgICAgICAgICAvL2NyZWF0ZSB0aGUgZWRnZSBjb25uZWN0ZWQgdG8gdGhlIG5ldyBtYWNyb21vbGVjdWxlXHJcbiAgICAgICAgICB2YXIgbmV3RWRnZTtcclxuXHJcbiAgICAgICAgICAvL0dyb3VwIHRoZSBsZWZ0IG9yIGJvdHRvbSBlbGVtZW50cyBpbiBncm91cCBpZCAwXHJcbiAgICAgICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgbmV3Tm9kZS5pZCgpLCB7Y2xhc3MgOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAwKTtcclxuICAgICAgICAgIG5ld0VkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY3kuZW5kQmF0Y2goKTtcclxuXHJcbiAgICAgIHZhciBsYXlvdXROb2RlcyA9IGN5Lm5vZGVzKCdbanVzdEFkZGVkTGF5b3V0Tm9kZV0nKTtcclxuICAgICAgbGF5b3V0Tm9kZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkTGF5b3V0Tm9kZScpO1xyXG4gICAgICB2YXIgbGF5b3V0ID0gbGF5b3V0Tm9kZXMubGF5b3V0KHtcclxuICAgICAgICBuYW1lOiBsYXlvdXRQYXJhbS5uYW1lLFxyXG4gICAgICAgIHJhbmRvbWl6ZTogZmFsc2UsXHJcbiAgICAgICAgZml0OiBmYWxzZSxcclxuICAgICAgICBhbmltYXRlOiBmYWxzZSxcclxuICAgICAgICB0aWxpbmdQYWRkaW5nVmVydGljYWw6IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCxcclxuICAgICAgICB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbDogdGlsaW5nUGFkZGluZ0hvcml6b250YWwsXHJcbiAgICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgLy9JZiBpdCBpcyBhIHJldmVyc2libGUgcmVhY3Rpb24gbm8gbmVlZCB0byByZS1wb3NpdGlvbiBjb21wbGV4ZXNcclxuICAgICAgICAgIGlmKHRlbXBsYXRlVHlwZSA9PT0gJ3JldmVyc2libGUnKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAvL3JlLXBvc2l0aW9uIHRoZSBub2RlcyBpbnNpZGUgdGhlIGNvbXBsZXhcclxuICAgICAgICAgIHZhciBzdXBwb3NlZFhQb3NpdGlvbjtcclxuICAgICAgICAgIHZhciBzdXBwb3NlZFlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55O1xyXG5cclxuICAgICAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgICAgICAgICAgc3VwcG9zZWRYUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgY29tcGxleC5vdXRlcldpZHRoKCkgLyAyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB2YXIgcG9zaXRpb25EaWZmWCA9IChzdXBwb3NlZFhQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3gnKSkgLyAyO1xyXG4gICAgICAgICAgdmFyIHBvc2l0aW9uRGlmZlkgPSAoc3VwcG9zZWRZUG9zaXRpb24gLSBjb21wbGV4LnBvc2l0aW9uKCd5JykpIC8gMjtcclxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NpdGlvbkRpZmZYLCB5OiBwb3NpdGlvbkRpZmZZfSwgY29tcGxleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIERvIHRoaXMgY2hlY2sgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XHJcbiAgICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1biAmJiB0ZW1wbGF0ZVR5cGUgIT09ICdyZXZlcnNpYmxlJykge1xyXG4gICAgICAgIGxheW91dC5ydW4oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy9maWx0ZXIgdGhlIGp1c3QgYWRkZWQgZWxlbWVtdHMgdG8gcmV0dXJuIHRoZW0gYW5kIHJlbW92ZSBqdXN0IGFkZGVkIG1hcmtcclxuICAgICAgdmFyIGVsZXMgPSBjeS5lbGVtZW50cygnW2p1c3RBZGRlZF0nKTtcclxuICAgICAgZWxlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWQnKTtcclxuXHJcbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcclxuICAgICAgZWxlcy5zZWxlY3QoKTtcclxuXHJcbiAgICAgIHJldHVybiBlbGVzOyAvLyBSZXR1cm4gdGhlIGp1c3QgYWRkZWQgZWxlbWVudHNcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICAqIE1vdmUgdGhlIG5vZGVzIHRvIGEgbmV3IHBhcmVudCBhbmQgY2hhbmdlIHRoZWlyIHBvc2l0aW9uIGlmIHBvc3NEaWZmIHBhcmFtcyBhcmUgc2V0LlxyXG4gICAgICovXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudCA9IGZ1bmN0aW9uKG5vZGVzLCBuZXdQYXJlbnQsIHBvc0RpZmZYLCBwb3NEaWZmWSkge1xyXG4gICAgICB2YXIgbmV3UGFyZW50SWQgPSBuZXdQYXJlbnQgPT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBuZXdQYXJlbnQgPT09ICdzdHJpbmcnID8gbmV3UGFyZW50IDogbmV3UGFyZW50LmlkKCk7XHJcbiAgICAgIHZhciBtb3ZlZEVsZXMgPSBub2Rlcy5tb3ZlKHtcInBhcmVudFwiOiBuZXdQYXJlbnRJZH0pO1xyXG4gICAgICBpZih0eXBlb2YgcG9zRGlmZlggIT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHBvc0RpZmZZICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tb3ZlTm9kZXMoe3g6IHBvc0RpZmZYLCB5OiBwb3NEaWZmWX0sIG5vZGVzKTtcclxuICAgICAgfVxyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlcihtb3ZlZEVsZXMpO1xyXG4gICAgICByZXR1cm4gbW92ZWRFbGVzO1xyXG4gICAgfTtcclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hTdHlsZSA9IGZ1bmN0aW9uKCBub2RlLCBpbmRleCwgbmV3UHJvcHMgKSB7XHJcbiAgICAgIHZhciBpbmZvYm94T2JqID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpW2luZGV4XTtcclxuICAgICAgJC5leHRlbmQoIGluZm9ib3hPYmouc3R5bGUsIG5ld1Byb3BzICk7XHJcbiAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlSW5mb2JveE9iaiA9IGZ1bmN0aW9uKCBub2RlLCBpbmRleCwgbmV3UHJvcHMgKSB7XHJcbiAgICAgIHZhciBpbmZvYm94T2JqID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpW2luZGV4XTtcclxuICAgICAgJC5leHRlbmQoIGluZm9ib3hPYmosIG5ld1Byb3BzICk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFJlc2l6ZSBnaXZlbiBub2RlcyBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHkgb25lIG9mIHdpZHRoIG9yIGhlaWdodCBzaG91bGQgbm90IGJlIHNldC5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMgPSBmdW5jdGlvbiAobm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvLCBwcmVzZXJ2ZVJlbGF0aXZlUG9zKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICB2YXIgcmF0aW8gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIGVsZU11c3RCZVNxdWFyZSA9IGVsZW1lbnRVdGlsaXRpZXMubXVzdEJlU3F1YXJlKG5vZGUuZGF0YSgnY2xhc3MnKSk7XHJcblxyXG4gICAgICAgIGlmIChwcmVzZXJ2ZVJlbGF0aXZlUG9zID09PSB0cnVlKSB7XHJcbiAgICAgICAgICB2YXIgb2xkV2lkdGggPSBub2RlLmRhdGEoXCJiYm94XCIpLnc7XHJcbiAgICAgICAgICB2YXIgb2xkSGVpZ2h0ID0gbm9kZS5kYXRhKFwiYmJveFwiKS5oO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTm90ZSB0aGF0IGJvdGggd2lkdGggYW5kIGhlaWdodCBzaG91bGQgbm90IGJlIHNldCBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHlcclxuICAgICAgICBpZighbm9kZS5pc1BhcmVudCgpKXtcclxuICAgICAgICAgIGlmICh3aWR0aCkge1xyXG4gICAgICAgICAgICBpZiAodXNlQXNwZWN0UmF0aW8gfHwgZWxlTXVzdEJlU3F1YXJlKSB7XHJcbiAgICAgICAgICAgICAgcmF0aW8gPSB3aWR0aCAvIG5vZGUud2lkdGgoKTtcclxuICAgICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSB3aWR0aDtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIGlmIChoZWlnaHQpIHtcclxuICAgICAgICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xyXG4gICAgICAgICAgICAgIHJhdGlvID0gaGVpZ2h0IC8gbm9kZS5oZWlnaHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBoZWlnaHQ7XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICBpZiAocmF0aW8gJiYgIWhlaWdodCkge1xyXG4gICAgICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBub2RlLmhlaWdodCgpICogcmF0aW87XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmIChyYXRpbyAmJiAhd2lkdGgpIHtcclxuICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gbm9kZS53aWR0aCgpICogcmF0aW87XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBub2RlLmRhdGEoXCJtaW5IZWlnaHRcIiAsIFwiXCIrIGhlaWdodCk7XHJcbiAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aFwiICwgXCJcIisgd2lkdGgpO1xyXG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluV2lkdGhCaWFzTGVmdFwiLCBcIjUwJVwiKTtcclxuICAgICAgICAgIG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc1JpZ2h0XCIsIFwiNTAlXCIpO1xyXG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc1RvcFwiLCBcIjUwJVwiICk7XHJcbiAgICAgICAgICBub2RlLmRhdGEoXCJtaW5IZWlnaHRCaWFzQm90dG9tXCIsIFwiNTAlXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuXHJcbiAgICAgLyogICAgaWYgKHByZXNlcnZlUmVsYXRpdmVQb3MgPT09IHRydWUpIHtcclxuICAgICAgICAgIHZhciBzdGF0ZXNhbmRpbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcclxuICAgICAgICAgIHZhciB0b3BCb3R0b20gPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IChib3guYW5jaG9yU2lkZSA9PT0gXCJ0b3BcIiB8fCBib3guYW5jaG9yU2lkZSA9PT0gXCJib3R0b21cIikpO1xyXG4gICAgICAgICAgdmFyIHJpZ2h0TGVmdCA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gKGJveC5hbmNob3JTaWRlID09PSBcInJpZ2h0XCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwibGVmdFwiKSk7XHJcblxyXG4gICAgICAgICAgdG9wQm90dG9tLmZvckVhY2goZnVuY3Rpb24oYm94KXtcclxuICAgICAgICAgICAgaWYgKGJveC5iYm94LnggPCAwKSB7XHJcbiAgICAgICAgICAgICAgYm94LmJib3gueCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYm94LmJib3gueCA+IG9sZFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgYm94LmJib3gueCA9IG9sZFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJveC5iYm94LnggPSBub2RlLmRhdGEoXCJiYm94XCIpLncgKiBib3guYmJveC54IC8gb2xkV2lkdGg7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICByaWdodExlZnQuZm9yRWFjaChmdW5jdGlvbihib3gpe1xyXG4gICAgICAgICAgICBpZiAoYm94LmJib3gueSA8IDApIHtcclxuICAgICAgICAgICAgICBib3guYmJveC55ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChib3guYmJveC55ID4gb2xkSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgYm94LmJib3gueSA9IG9sZEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBib3guYmJveC55ID0gbm9kZS5kYXRhKFwiYmJveFwiKS5oICogYm94LmJib3gueSAvIG9sZEhlaWdodDtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gKi9cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbldpZHRoID0gZnVuY3Rpb24obm9kZSkge1xyXG5cclxuICAgICAgICB2YXIgZGVmYXVsdFdpZHRoID0gdGhpcy5nZXREZWZhdWx0UHJvcGVydGllcyhub2RlLmRhdGEoJ2NsYXNzJykpLndpZHRoO1xyXG5cclxuICAgICAgICAvLyBMYWJlbCB3aWR0aCBjYWxjdWxhdGlvblxyXG4gICAgICAgIHZhciBzdHlsZSA9IG5vZGUuc3R5bGUoKTtcclxuXHJcbiAgICAgICAgdmFyIGZvbnRGYW1pbGl5ID0gc3R5bGVbJ2ZvbnQtZmFtaWx5J107XHJcbiAgICAgICAgdmFyIGZvbnRTaXplID0gc3R5bGVbJ2ZvbnQtc2l6ZSddO1xyXG4gICAgICAgIHZhciBsYWJlbFRleHQgPSBzdHlsZVsnbGFiZWwnXTtcclxuXHJcbiAgICAgICAgdmFyIGxhYmVsV2lkdGggPSBlbGVtZW50VXRpbGl0aWVzLmdldFdpZHRoQnlDb250ZW50KCBsYWJlbFRleHQsIGZvbnRGYW1pbGl5LCBmb250U2l6ZSApO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVzYW5kaW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XHJcbiAgICAgICAgLy9Ub3AgYW5kIGJvdHRvbSBpbmZvQm94ZXNcclxuICAgICAgICAvL3ZhciB0b3BJbmZvQm94ZXMgPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IChib3guYW5jaG9yU2lkZSA9PT0gXCJ0b3BcIiB8fCAoKGJveC5hbmNob3JTaWRlID09PSBcInJpZ2h0XCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwibGVmdFwiKSAmJiAoYm94LmJib3gueSA8PSAxMikpKSk7XHJcbiAgICAgICAgLy92YXIgYm90dG9tSW5mb0JveGVzID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiAoYm94LmFuY2hvclNpZGUgPT09IFwiYm90dG9tXCIgfHwgKChib3guYW5jaG9yU2lkZSA9PT0gXCJyaWdodFwiIHx8IGJveC5hbmNob3JTaWRlID09PSBcImxlZnRcIikgJiYgKGJveC5iYm94LnkgPj0gbm9kZS5kYXRhKCdiYm94JykuaCAtIDEyKSkpKTtcclxuICAgICAgICB2YXIgdW5pdEdhcCA9IDU7XHJcbiAgICAgICAgdmFyIHRvcElkZWFsV2lkdGggPSB1bml0R2FwO1xyXG4gICAgICAgIHZhciBib3R0b21JZGVhbFdpZHRoID0gdW5pdEdhcDsgICAgICAgIFxyXG4gICAgICAgIHZhciByaWdodE1heFdpZHRoID0gMDtcclxuICAgICAgICB2YXIgbGVmdE1heFdpZHRoID0wO1xyXG4gICAgICAgIHN0YXRlc2FuZGluZm9zLmZvckVhY2goZnVuY3Rpb24oYm94KXtcclxuICAgICAgICAgIGlmKGJveC5hbmNob3JTaWRlID09PSBcInRvcFwiKXtcclxuICAgICAgICAgICAgdG9wSWRlYWxXaWR0aCArPSBib3guYmJveC53ICsgdW5pdEdhcDtcclxuXHJcbiAgICAgICAgICB9ZWxzZSBpZihib3guYW5jaG9yU2lkZSA9PT0gXCJib3R0b21cIil7XHJcbiAgICAgICAgICAgIGJvdHRvbUlkZWFsV2lkdGggKz0gYm94LmJib3gudyArIHVuaXRHYXA7XHJcblxyXG4gICAgICAgICAgfWVsc2UgaWYoYm94LmFuY2hvclNpZGUgPT09IFwicmlnaHRcIilcclxuICAgICAgICAgIHsgICAgICAgICAgIFxyXG4gICAgICAgICAgICByaWdodE1heFdpZHRoID0gKGJveC5iYm94LncgPiByaWdodE1heFdpZHRoKSA/IGJveC5iYm94LncgOiByaWdodE1heFdpZHRoO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZWZ0TWF4V2lkdGggPSAoYm94LmJib3gudyA+IGxlZnRNYXhXaWR0aCkgPyBib3guYmJveC53IDogbGVmdE1heFdpZHRoO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pOyAgICAgIFxyXG5cclxuICAgICAgICB2YXIgbWlkZGxlV2lkdGggPSBsYWJlbFdpZHRoICsgMiAqIE1hdGgubWF4KHJpZ2h0TWF4V2lkdGgvMiwgbGVmdE1heFdpZHRoLzIpO1xyXG5cclxuICAgICAgICB2YXIgY29tcG91bmRXaWR0aCA9IDA7XHJcbiAgICAgICAgaWYobm9kZS5pc1BhcmVudCgpKXtcclxuICAgICAgICAgIGNvbXBvdW5kV2lkdGggPSBub2RlLmNoaWxkcmVuKCkuYm91bmRpbmdCb3goKS53O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgobWlkZGxlV2lkdGgsIGRlZmF1bHRXaWR0aC8yLCB0b3BJZGVhbFdpZHRoLCBib3R0b21JZGVhbFdpZHRoLCBjb21wb3VuZFdpZHRoKTtcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbkhlaWdodCA9IGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICB2YXIgc3RhdGVzYW5kaW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IDc7XHJcbiAgICAgICAgdmFyIHVuaXRHYXAgPSA1O1xyXG4gICAgICAgIHZhciBkZWZhdWx0SGVpZ2h0ID0gdGhpcy5nZXREZWZhdWx0UHJvcGVydGllcyhub2RlLmRhdGEoJ2NsYXNzJykpLmhlaWdodDtcclxuICAgICAgICB2YXIgbGVmdEluZm9Cb3hlcyA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gYm94LmFuY2hvclNpZGUgPT09IFwibGVmdFwiKTsgICAgICAgIFxyXG4gICAgICAgIHZhciBsZWZ0SGVpZ2h0ID0gdW5pdEdhcDsgXHJcbiAgICAgICAgbGVmdEluZm9Cb3hlcy5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XHJcbiAgICAgICAgICAgIGxlZnRIZWlnaHQgKz0gYm94LmJib3guaCArIHVuaXRHYXA7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgfSk7ICAgICAgXHJcbiAgICAgICAgdmFyIHJpZ2h0SW5mb0JveGVzID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiBib3guYW5jaG9yU2lkZSA9PT0gXCJyaWdodFwiKTtcclxuICAgICAgICB2YXIgcmlnaHRIZWlnaHQgPSB1bml0R2FwOyAgICAgICAgXHJcbiAgICAgICAgcmlnaHRJbmZvQm94ZXMuZm9yRWFjaChmdW5jdGlvbihib3gpe1xyXG4gICAgICAgICAgICByaWdodEhlaWdodCArPSBib3guYmJveC5oICsgdW5pdEdhcDsgICAgICAgICAgIFxyXG4gICAgICAgIH0pOyAgICAgICBcclxuICAgICAgICB2YXIgc3R5bGUgPSBub2RlLnN0eWxlKCk7XHJcbiAgICAgICAgdmFyIGxhYmVsVGV4dCA9ICgoc3R5bGVbJ2xhYmVsJ10pLnNwbGl0KFwiXFxuXCIpKS5maWx0ZXIoIHRleHQgPT4gdGV4dCAhPT0gJycpO1xyXG4gICAgICAgIHZhciBmb250U2l6ZSA9IHBhcnNlRmxvYXQoc3R5bGVbJ2ZvbnQtc2l6ZSddLnN1YnN0cmluZygwLCBzdHlsZVsnZm9udC1zaXplJ10ubGVuZ3RoIC0gMikpO1xyXG4gICAgICAgIHZhciB0b3RhbEhlaWdodCA9IGxhYmVsVGV4dC5sZW5ndGggKiBmb250U2l6ZSArIDIgKiBtYXJnaW47XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB2YXIgY29tcG91bmRIZWlnaHQgPSAwO1xyXG4gICAgICAgIGlmKG5vZGUuaXNQYXJlbnQoKSl7XHJcbiAgICAgICAgICBjb21wb3VuZEhlaWdodCA9IG5vZGUuY2hpbGRyZW4oKS5ib3VuZGluZ0JveCgpLmg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBNYXRoLm1heCh0b3RhbEhlaWdodCwgZGVmYXVsdEhlaWdodC8yLCBsZWZ0SGVpZ2h0LCByaWdodEhlaWdodCwgY29tcG91bmRIZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuaXNSZXNpemVkVG9Db250ZW50ID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgaWYoIW5vZGUgfHwgIW5vZGUuaXNOb2RlKCkgfHwgIW5vZGUuZGF0YSgnYmJveCcpKXtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vdmFyIHcgPSBub2RlLmRhdGEoJ2Jib3gnKS53O1xyXG4gICAgICAvL3ZhciBoID0gbm9kZS5kYXRhKCdiYm94JykuaDtcclxuICAgICAgdmFyIHcgPSBub2RlLndpZHRoKCk7XHJcbiAgICAgIHZhciBoID0gbm9kZS5oZWlnaHQoKTtcclxuXHJcbiAgICAgIHZhciBtaW5XID0gZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5XaWR0aChub2RlKTtcclxuICAgICAgdmFyIG1pbkggPSBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbkhlaWdodChub2RlKTtcclxuXHJcbiAgICAgIGlmKHcgPT09IG1pblcgJiYgaCA9PT0gbWluSClcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTZWN0aW9uIEVuZFxyXG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcclxuXHJcbiAgICAvLyBSZWxvY2F0ZXMgc3RhdGUgYW5kIGluZm8gYm94ZXMuIFRoaXMgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkIGFmdGVyIGFkZC9yZW1vdmUgc3RhdGUgYW5kIGluZm8gYm94ZXNcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IChlbGUuaXNOb2RlICYmIGVsZS5pc05vZGUoKSkgPyBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSA6IGVsZTtcclxuICAgICAgdmFyIGxlbmd0aCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoO1xyXG4gICAgICBpZiAobGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAobGVuZ3RoID09IDEpIHtcclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAobGVuZ3RoID09IDIpIHtcclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMDtcclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IDUwO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGxlbmd0aCA9PSAzKSB7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAtMjU7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gMDtcclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xyXG5cclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDI1O1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gLTUwO1xyXG5cclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IC0yNTtcclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xyXG5cclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueCA9IDI1O1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC55ID0gNTA7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gQ2hhbmdlIHN0YXRlIHZhbHVlIG9yIHVuaXQgb2YgaW5mb3JtYXRpb24gYm94IG9mIGdpdmVuIG5vZGVzIHdpdGggZ2l2ZW4gaW5kZXguXHJcbiAgICAvLyBUeXBlIHBhcmFtZXRlciBpbmRpY2F0ZXMgd2hldGhlciB0byBjaGFuZ2UgdmFsdWUgb3IgdmFyaWFibGUsIGl0IGlzIHZhbGlkIGlmIHRoZSBib3ggYXQgdGhlIGdpdmVuIGluZGV4IGlzIGEgc3RhdGUgdmFyaWFibGUuXHJcbiAgICAvLyBWYWx1ZSBwYXJhbWV0ZXIgaXMgdGhlIG5ldyB2YWx1ZSB0byBzZXQuXHJcbiAgICAvLyBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBvbGQgdmFsdWUgb2YgdGhlIGNoYW5nZWQgZGF0YSAoV2UgYXNzdW1lIHRoYXQgdGhlIG9sZCB2YWx1ZSBvZiB0aGUgY2hhbmdlZCBkYXRhIHdhcyB0aGUgc2FtZSBmb3IgYWxsIG5vZGVzKS5cclxuICAgIC8vIEVhY2ggY2hhcmFjdGVyIGFzc3VtZWQgdG8gb2NjdXB5IDggdW5pdFxyXG4gICAgLy8gRWFjaCBpbmZvYm94IGNhbiBoYXZlIGF0IG1vc3QgMzIgdW5pdHMgb2Ygd2lkdGhcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSkge1xyXG4gICAgICB2YXIgcmVzdWx0O1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICB2YXIgc2JnbmNsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xyXG4gICAgICAgIHZhciBib3ggPSBzdGF0ZUFuZEluZm9zW2luZGV4XTtcclxuICAgICAgICB2YXIgb2xkTGVuZ3RoID0gYm94LmJib3gudztcclxuICAgICAgICB2YXIgbmV3TGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSAnJztcclxuICAgICAgICBpZiAoYm94LmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xyXG4gICAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gYm94LnN0YXRlW3R5cGVdO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJveC5zdGF0ZVt0eXBlXSA9IHZhbHVlO1xyXG4gICAgICAgICAgaWYgKGJveC5zdGF0ZVtcInZhbHVlXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29udGVudCArPSBib3guc3RhdGVbXCJ2YWx1ZVwiXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChib3guc3RhdGVbXCJ2YXJpYWJsZVwiXSAhPT0gdW5kZWZpbmVkICYmIGJveC5zdGF0ZVtcInZhcmlhYmxlXCJdLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29udGVudCArPSBib3guc3RhdGVbXCJ2YXJpYWJsZVwiXSArIFwiQFwiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYm94LmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7XHJcbiAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBib3gubGFiZWwudGV4dDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRlbnQgKz0gdmFsdWU7XHJcbiAgICAgICAgICBib3gubGFiZWwudGV4dCA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG1pbiA9ICggc2JnbmNsYXNzID09PSAnU0lGIG1hY3JvbW9sZWN1bGUnIHx8IHNiZ25jbGFzcyA9PT0gJ1NJRiBzaW1wbGUgY2hlbWljYWwnICkgPyAxNSA6IDEyO1xyXG4gICAgICAgIHZhciBmb250RmFtaWx5ID0gYm94LnN0eWxlWyAnZm9udC1mYW1pbHknIF07XHJcbiAgICAgICAgdmFyIGZvbnRTaXplID0gYm94LnN0eWxlWyAnZm9udC1zaXplJyBdO1xyXG4gICAgICAgIHZhciBib3JkZXJXaWR0aCA9IGJveC5zdHlsZVsgJ2JvcmRlci13aWR0aCcgXTtcclxuICAgICAgICB2YXIgb3B0cyA9IHtcclxuICAgICAgICAgIG1pbixcclxuICAgICAgICAgIG1heDogNDgsXHJcbiAgICAgICAgICBtYXJnaW46IGJvcmRlcldpZHRoIC8gMiArIDAuNVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHByZXZpb3VzV2lkdGggPSBib3guYmJveC53O1xyXG4gICAgICAgIGJveC5iYm94LncgPSBlbGVtZW50VXRpbGl0aWVzLmdldFdpZHRoQnlDb250ZW50KCBjb250ZW50LCBmb250RmFtaWx5LCBmb250U2l6ZSwgb3B0cyApO1xyXG5cclxuICAgICAgICBpZihib3guYW5jaG9yU2lkZSA9PSBcInRvcFwiIHx8IGJveC5hbmNob3JTaWRlID09IFwiYm90dG9tXCIpe1xyXG4gICAgICAgICAgdmFyIHVuaXRMYXlvdXQgPSBub2RlLmRhdGEoKVtcImF1eHVuaXRsYXlvdXRzXCJdW2JveC5hbmNob3JTaWRlXTtcclxuICAgICAgICAgIGlmKHVuaXRMYXlvdXQudW5pdHNbdW5pdExheW91dC51bml0cy5sZW5ndGgtMV0uaWQgPT0gYm94LmlkKXtcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgYm9yZGVyV2lkdGggPSBub2RlLmRhdGEoKVsnYm9yZGVyLXdpZHRoJ107XHJcbiAgICAgICAgICAgIHZhciBzaGlmdEFtb3VudCA9ICgoKGJveC5iYm94LncgLSBwcmV2aW91c1dpZHRoKSAvIDIpICogMTAwICkvIChub2RlLm91dGVyV2lkdGgoKSAtIGJvcmRlcldpZHRoKTtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoc2hpZnRBbW91bnQgPj0gMCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGlmKGJveC5iYm94LnggKyBzaGlmdEFtb3VudCA8PSAxMDApe1xyXG4gICAgICAgICAgICAgICAgYm94LmJib3gueCA9IGJveC5iYm94LnggKyBzaGlmdEFtb3VudDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAvKiAgZWxzZXtcclxuICAgICAgICAgICAgICB2YXIgcHJldmlvdXNJbmZvQmJveCA9IHt4IDogMCwgdzowfTtcclxuICAgICAgICAgICAgICBpZih1bml0TGF5b3V0LnVuaXRzLmxlbmd0aCA+IDEpe1xyXG4gICAgICAgICAgICAgICAgcHJldmlvdXNJbmZvQmJveD0gdW5pdExheW91dC51bml0c1t1bml0TGF5b3V0LnVuaXRzLmxlbmd0aC0yXS5iYm94OyAgICAgIFxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuQXV4VW5pdExheW91dC5zZXRJZGVhbEdhcChub2RlLCBib3guYW5jaG9yU2lkZSk7XHJcbiAgICAgICAgICAgICAgdmFyIGlkZWFsR2FwID0gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuQXV4VW5pdExheW91dC5nZXRDdXJyZW50R2FwKGJveC5hbmNob3JTaWRlKTtcclxuICAgICAgICAgICAgICB2YXIgbmV3UG9zaXRpb24gPSBwcmV2aW91c0luZm9CYm94LnggKyAocHJldmlvdXNJbmZvQmJveC53LzIgKyBpZGVhbEdhcCArIGJveC5iYm94LncvMikqMTAwIC8gKG5vZGUub3V0ZXJXaWR0aCgpIC0gYm9yZGVyV2lkdGgpO1xyXG4gICAgICAgICAgICAgIGJveC5iYm94LnggPSBuZXdQb3NpdGlvbjtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSAqL1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAvKiBpZiAoYm94LmFuY2hvclNpZGUgPT09IFwidG9wXCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwiYm90dG9tXCIpIHtcclxuICAgICAgICAgIGJveC5iYm94LnggKz0gKGJveC5iYm94LncgLSBvbGRMZW5ndGgpIC8gMjtcclxuICAgICAgICAgIHZhciB1bml0cyA9IChub2RlLmRhdGEoJ2F1eHVuaXRsYXlvdXRzJylbYm94LmFuY2hvclNpZGVdKS51bml0cztcclxuICAgICAgICAgIHZhciBzaGlmdEluZGV4ID0gMDtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5pdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYodW5pdHNbaV0gPT09IGJveCl7XHJcbiAgICAgICAgICAgICAgc2hpZnRJbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGZvciAodmFyIGogPSBzaGlmdEluZGV4KzE7IGogPCB1bml0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgIHVuaXRzW2pdLmJib3gueCArPSAoYm94LmJib3gudyAtIG9sZExlbmd0aCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSAqL1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgLy9UT0RPIGZpbmQgYSB3YXkgdG8gZWxpbWF0ZSB0aGlzIHJlZHVuZGFuY3kgdG8gdXBkYXRlIGluZm8tYm94IHBvc2l0aW9uc1xyXG4gICAgICBub2RlLmRhdGEoJ2JvcmRlci13aWR0aCcsIG5vZGUuZGF0YSgnYm9yZGVyLXdpZHRoJykpO1xyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLy8gQWRkIGEgbmV3IHN0YXRlIG9yIGluZm8gYm94IHRvIGdpdmVuIG5vZGVzLlxyXG4gICAgLy8gVGhlIGJveCBpcyByZXByZXNlbnRlZCBieSB0aGUgcGFyYW1ldGVyIG9iai5cclxuICAgIC8vIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBqdXN0IGFkZGVkIGJveC5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIG9iaikge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICB2YXIgbG9jYXRpb25PYmo7XHJcblxyXG4gICAgICAgIHZhciBkZWZhdWx0UHJvcHMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBub2RlLmRhdGEoJ2NsYXNzJykgKTtcclxuICAgICAgICB2YXIgaW5mb2JveFByb3BzID0gZGVmYXVsdFByb3BzWyBvYmouY2xhenogXTtcclxuICAgICAgICB2YXIgYmJveCA9IG9iai5iYm94IHx8IHsgdzogaW5mb2JveFByb3BzLndpZHRoLCBoOiBpbmZvYm94UHJvcHMuaGVpZ2h0IH07XHJcbiAgICAgICAgdmFyIHN0eWxlID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0SW5mb2JveFN0eWxlKCBub2RlLmRhdGEoJ2NsYXNzJyksIG9iai5jbGF6eiApO1xyXG5cclxuICAgICAgICBpZihvYmouY2xhenogPT0gXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIpIHtcclxuICAgICAgICAgIGxvY2F0aW9uT2JqID0gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuVW5pdE9mSW5mb3JtYXRpb24uY3JlYXRlKG5vZGUsIGN5LCBvYmoubGFiZWwudGV4dCwgYmJveCwgb2JqLmxvY2F0aW9uLCBvYmoucG9zaXRpb24sIHN0eWxlLCBvYmouaW5kZXgsIG9iai5pZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG9iai5jbGF6eiA9PSBcInN0YXRlIHZhcmlhYmxlXCIpIHtcclxuICAgICAgICAgIGxvY2F0aW9uT2JqID0gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuU3RhdGVWYXJpYWJsZS5jcmVhdGUobm9kZSwgY3ksIG9iai5zdGF0ZS52YWx1ZSwgb2JqLnN0YXRlLnZhcmlhYmxlLCBiYm94LCBvYmoubG9jYXRpb24sIG9iai5wb3NpdGlvbiwgc3R5bGUsIG9iai5pbmRleCwgb2JqLmlkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGxvY2F0aW9uT2JqO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxyXG4gICAgLy8gUmV0dXJucyB0aGUgcmVtb3ZlZCBib3guXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKG5vZGVzLCBsb2NhdGlvbk9iaikge1xyXG4gICAgICB2YXIgb2JqO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcclxuICAgICAgICB2YXIgdW5pdCA9IHN0YXRlQW5kSW5mb3NbbG9jYXRpb25PYmouaW5kZXhdO1xyXG5cclxuICAgICAgICB2YXIgdW5pdENsYXNzID0gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuZ2V0QXV4VW5pdENsYXNzKHVuaXQpO1xyXG5cclxuICAgICAgICBvYmogPSB1bml0Q2xhc3MucmVtb3ZlKHVuaXQsIGN5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG9iajtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vVGlsZXMgaW5mb3JtYXRpb25zIGJveGVzIGZvciBnaXZlbiBhbmNob3JTaWRlc1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5maXRVbml0cyA9IGZ1bmN0aW9uIChub2RlLCBsb2NhdGlvbnMpIHtcclxuICAgICAgdmFyIG9iaiA9IFtdO1xyXG4gICAgICBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykuZm9yRWFjaCggZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgIG9iai5wdXNoKHtcclxuICAgICAgICAgIHg6IGVsZS5iYm94LngsXHJcbiAgICAgICAgICB5OiBlbGUuYmJveC55LFxyXG4gICAgICAgICAgYW5jaG9yU2lkZTogZWxlLmFuY2hvclNpZGVcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIHNiZ252aXpJbnN0YW5jZS5jbGFzc2VzLkF1eFVuaXRMYXlvdXQuZml0VW5pdHMobm9kZSwgY3ksIGxvY2F0aW9ucyk7XHJcbiAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vQ2hlY2sgd2hpY2ggYW5jaG9yc2lkZXMgZml0c1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGVja0ZpdCA9IGZ1bmN0aW9uIChub2RlLCBsb2NhdGlvbikgeyAvL2lmIG5vIGxvY2F0aW9uIGdpdmVuLCBpdCBjaGVja3MgYWxsIHBvc3NpYmxlIGxvY2F0aW9uc1xyXG4gICAgICByZXR1cm4gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuQXV4VW5pdExheW91dC5jaGVja0ZpdChub2RlLCBjeSwgbG9jYXRpb24pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvL01vZGlmeSBhcnJheSBvZiBhdXggbGF5b3V0IHVuaXRzXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLm1vZGlmeVVuaXRzID0gZnVuY3Rpb24gKG5vZGUsIHVuaXQsIGFuY2hvclNpZGUpIHtcclxuICAgICAgc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuQXV4VW5pdExheW91dC5tb2RpZnlVbml0cyhub2RlLCB1bml0LCBhbmNob3JTaWRlLCBjeSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKG5vZGVzLCBzdGF0dXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgICAgdmFyIHNiZ25jbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcclxuICAgICAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XHJcblxyXG4gICAgICAgIGlmIChzdGF0dXMpIHsgLy8gTWFrZSBtdWx0aW1lciBzdGF0dXMgdHJ1ZVxyXG4gICAgICAgICAgaWYgKCFpc011bHRpbWVyKSB7XHJcbiAgICAgICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MgKyAnIG11bHRpbWVyJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyBmYWxzZVxyXG4gICAgICAgICAgaWYgKGlzTXVsdGltZXIpIHtcclxuICAgICAgICAgICAgbm9kZS5kYXRhKCdjbGFzcycsIHNiZ25jbGFzcy5yZXBsYWNlKCcgbXVsdGltZXInLCAnJykpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBlbGVtZW50cyB3aXRoIGdpdmVuIGZvbnQgZGF0YVxyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChlbGVzLCBkYXRhKSB7XHJcbiAgICAgIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xyXG4gICAgICAgIGVsZXMuZGF0YShwcm9wLCBkYXRhW3Byb3BdKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGdldHMgYW4gZWRnZSwgYW5kIGVuZHMgb2YgdGhhdCBlZGdlIChPcHRpb25hbGx5IGl0IG1heSB0YWtlIGp1c3QgdGhlIGNsYXNzZXMgb2YgdGhlIGVkZ2UgYXMgd2VsbCkgYXMgcGFyYW1ldGVycy5cclxuICAgIC8vIEl0IG1heSByZXR1cm4gJ3ZhbGlkJyAodGhhdCBlbmRzIGlzIHZhbGlkIGZvciB0aGF0IGVkZ2UpLCAncmV2ZXJzZScgKHRoYXQgZW5kcyBpcyBub3QgdmFsaWQgZm9yIHRoYXQgZWRnZSBidXQgdGhleSB3b3VsZCBiZSB2YWxpZFxyXG4gICAgLy8gaWYgeW91IHJldmVyc2UgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0KSwgJ2ludmFsaWQnICh0aGF0IGVuZHMgYXJlIHRvdGFsbHkgaW52YWxpZCBmb3IgdGhhdCBlZGdlKS5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMgPSBmdW5jdGlvbiAoZWRnZSwgc291cmNlLCB0YXJnZXQpIHtcclxuICAgICAgLy8gaWYgbWFwIHR5cGUgaXMgVW5rbm93biAtLSBubyBydWxlcyBhcHBsaWVkXHJcbiAgICAgIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSA9PSBcIkh5YnJpZEFueVwiIHx8IGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpID09IFwiSHlicmlkU2JnblwiIHx8ICFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSlcclxuICAgICAgICByZXR1cm4gXCJ2YWxpZFwiO1xyXG5cclxuICAgICAgdmFyIGVkZ2VjbGFzcyA9IHR5cGVvZiBlZGdlID09PSAnc3RyaW5nJyA/IGVkZ2UgOiBlZGdlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICAgIHZhciBzb3VyY2VjbGFzcyA9IHNvdXJjZS5kYXRhKCdjbGFzcycpO1xyXG4gICAgICB2YXIgdGFyZ2V0Y2xhc3MgPSB0YXJnZXQuZGF0YSgnY2xhc3MnKTtcclxuICAgICAgdmFyIG1hcFR5cGUgPSBlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKTtcclxuICAgICAgdmFyIGVkZ2VDb25zdHJhaW50cyA9IGVsZW1lbnRVdGlsaXRpZXNbbWFwVHlwZV0uY29ubmVjdGl2aXR5Q29uc3RyYWludHNbZWRnZWNsYXNzXTtcclxuXHJcbiAgICAgIGlmIChtYXBUeXBlID09IFwiQUZcIil7XHJcbiAgICAgICAgaWYgKHNvdXJjZWNsYXNzLnN0YXJ0c1dpdGgoXCJCQVwiKSkgLy8gd2UgaGF2ZSBzZXBhcmF0ZSBjbGFzc2VzIGZvciBlYWNoIGJpb2xvZ2ljYWwgYWN0aXZpdHlcclxuICAgICAgICAgIHNvdXJjZWNsYXNzID0gXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI7IC8vIGJ1dCBzYW1lIHJ1bGUgYXBwbGllcyB0byBhbGwgb2YgdGhlbVxyXG5cclxuICAgICAgICBpZiAodGFyZ2V0Y2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKSAvLyB3ZSBoYXZlIHNlcGFyYXRlIGNsYXNzZXMgZm9yIGVhY2ggYmlvbG9naWNhbCBhY3Rpdml0eVxyXG4gICAgICAgICAgdGFyZ2V0Y2xhc3MgPSBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjsgLy8gYnV0IHNhbWUgcnVsZSBhcHBsaWVzIHRvIGFsbCBvZiB0aGVtXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAobWFwVHlwZSA9PSBcIlBEXCIpe1xyXG4gICAgICAgIHNvdXJjZWNsYXNzID0gc291cmNlY2xhc3MucmVwbGFjZSgvXFxzKm11bHRpbWVyJC8sICcnKTtcclxuICAgICAgICB0YXJnZXRjbGFzcyA9IHRhcmdldGNsYXNzLnJlcGxhY2UoL1xccyptdWx0aW1lciQvLCAnJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGdpdmVuIGEgbm9kZSwgYWN0aW5nIGFzIHNvdXJjZSBvciB0YXJnZXQsIHJldHVybnMgYm9vbGVhbiB3ZXRoZXIgb3Igbm90IGl0IGhhcyB0b28gbWFueSBlZGdlcyBhbHJlYWR5XHJcbiAgICAgIGZ1bmN0aW9uIGhhc1Rvb01hbnlFZGdlcyhub2RlLCBzb3VyY2VPclRhcmdldCkge1xyXG4gICAgICAgIHZhciBub2RlY2xhc3MgPSBub2RlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICAgICAgbm9kZWNsYXNzID0gbm9kZWNsYXNzLnJlcGxhY2UoL1xccyptdWx0aW1lciQvLCAnJyk7XHJcbiAgICAgICAgaWYgKG5vZGVjbGFzcy5zdGFydHNXaXRoKFwiQkFcIikpXHJcbiAgICAgICAgICBub2RlY2xhc3MgPSBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjtcclxuXHJcbiAgICAgICAgdmFyIHRvdGFsVG9vTWFueSA9IHRydWU7XHJcbiAgICAgICAgdmFyIGVkZ2VUb29NYW55ID0gdHJ1ZTtcclxuICAgICAgICBpZiAoc291cmNlT3JUYXJnZXQgPT0gXCJzb3VyY2VcIikge1xyXG4gICAgICAgICAgICB2YXIgc2FtZUVkZ2VDb3VudE91dCA9IG5vZGUub3V0Z29lcnMoJ2VkZ2VbY2xhc3M9XCInK2VkZ2VjbGFzcysnXCJdJykuc2l6ZSgpO1xyXG4gICAgICAgICAgICB2YXIgdG90YWxFZGdlQ291bnRPdXQgPSBub2RlLm91dGdvZXJzKCdlZGdlJykuc2l6ZSgpO1xyXG4gICAgICAgICAgICAvLyBjaGVjayB0aGF0IHRoZSB0b3RhbCBlZGdlIGNvdW50IGlzIHdpdGhpbiB0aGUgbGltaXRzXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4VG90YWwgPT0gJ3VuZGVmaW5lZCdcclxuICAgICAgICAgICAgICAgIHx8IHRvdGFsRWRnZUNvdW50T3V0IDwgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4VG90YWwgKSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbFRvb01hbnkgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyB0aGVuIGNoZWNrIGxpbWl0cyBmb3IgdGhpcyBzcGVjaWZpYyBlZGdlIGNsYXNzXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4RWRnZSA9PSAndW5kZWZpbmVkJ1xyXG4gICAgICAgICAgICAgICAgfHwgc2FtZUVkZ2VDb3VudE91dCA8IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzU291cmNlLm1heEVkZ2UgKSB7XHJcbiAgICAgICAgICAgICAgICBlZGdlVG9vTWFueSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGlmIG9ubHkgb25lIG9mIHRoZSBsaW1pdHMgaXMgcmVhY2hlZCB0aGVuIGVkZ2UgaXMgaW52YWxpZFxyXG4gICAgICAgICAgICByZXR1cm4gdG90YWxUb29NYW55IHx8IGVkZ2VUb29NYW55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgLy8gbm9kZSBpcyB1c2VkIGFzIHRhcmdldFxyXG4gICAgICAgICAgICB2YXIgc2FtZUVkZ2VDb3VudEluID0gbm9kZS5pbmNvbWVycygnZWRnZVtjbGFzcz1cIicrZWRnZWNsYXNzKydcIl0nKS5zaXplKCk7XHJcbiAgICAgICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudEluID0gbm9kZS5pbmNvbWVycygnZWRnZScpLnNpemUoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1RhcmdldC5tYXhUb3RhbCA9PSAndW5kZWZpbmVkJ1xyXG4gICAgICAgICAgICAgICAgfHwgdG90YWxFZGdlQ291bnRJbiA8IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heFRvdGFsICkge1xyXG4gICAgICAgICAgICAgICAgdG90YWxUb29NYW55ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1RhcmdldC5tYXhFZGdlID09ICd1bmRlZmluZWQnXHJcbiAgICAgICAgICAgICAgICB8fCBzYW1lRWRnZUNvdW50SW4gPCBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1RhcmdldC5tYXhFZGdlICkge1xyXG4gICAgICAgICAgICAgICAgZWRnZVRvb01hbnkgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdG90YWxUb29NYW55IHx8IGVkZ2VUb29NYW55O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGlzSW5Db21wbGV4KG5vZGUpIHtcclxuICAgICAgICB2YXIgcGFyZW50Q2xhc3MgPSBub2RlLnBhcmVudCgpLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICAgICAgcmV0dXJuIHBhcmVudENsYXNzICYmIHBhcmVudENsYXNzLnN0YXJ0c1dpdGgoJ2NvbXBsZXgnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGlzSW5Db21wbGV4KHNvdXJjZSkgfHwgaXNJbkNvbXBsZXgodGFyZ2V0KSkgeyAvLyBzdWJ1bml0cyBvZiBhIGNvbXBsZXggYXJlIG5vIGxvbmdlciBFUE5zLCBubyBjb25uZWN0aW9uIGFsbG93ZWRcclxuICAgICAgICByZXR1cm4gJ2ludmFsaWQnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBjaGVjayBuYXR1cmUgb2YgY29ubmVjdGlvblxyXG4gICAgICBpZiAoZWRnZUNvbnN0cmFpbnRzW3NvdXJjZWNsYXNzXS5hc1NvdXJjZS5pc0FsbG93ZWQgJiYgZWRnZUNvbnN0cmFpbnRzW3RhcmdldGNsYXNzXS5hc1RhcmdldC5pc0FsbG93ZWQpIHtcclxuICAgICAgICAvLyBjaGVjayBhbW91bnQgb2YgY29ubmVjdGlvbnNcclxuICAgICAgICBpZiAoIWhhc1Rvb01hbnlFZGdlcyhzb3VyY2UsIFwic291cmNlXCIpICYmICFoYXNUb29NYW55RWRnZXModGFyZ2V0LCBcInRhcmdldFwiKSApIHtcclxuICAgICAgICAgIHJldHVybiAndmFsaWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyB0cnkgdG8gcmV2ZXJzZVxyXG4gICAgICBpZiAoZWRnZUNvbnN0cmFpbnRzW3RhcmdldGNsYXNzXS5hc1NvdXJjZS5pc0FsbG93ZWQgJiYgZWRnZUNvbnN0cmFpbnRzW3NvdXJjZWNsYXNzXS5hc1RhcmdldC5pc0FsbG93ZWQpIHtcclxuICAgICAgICBpZiAoIWhhc1Rvb01hbnlFZGdlcyh0YXJnZXQsIFwic291cmNlXCIpICYmICFoYXNUb29NYW55RWRnZXMoc291cmNlLCBcInRhcmdldFwiKSApIHtcclxuICAgICAgICAgIHJldHVybiAncmV2ZXJzZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAnaW52YWxpZCc7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBIaWRlIGdpdmVuIGVsZXMgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcclxuICAgICAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC5cclxuICAgICAqL1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5oaWRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGN5LnZpZXdVdGlsaXRpZXMoKS5oaWRlKGVsZXMpOyAvLyBIaWRlIGdpdmVuIGVsZXNcclxuICAgICAgICBpZiAodHlwZW9mIGxheW91dHBhcmFtID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGxheW91dHBhcmFtKCk7IC8vIElmIGxheW91dHBhcmFtIGlzIGEgZnVuY3Rpb24gZXhlY3V0ZSBpdFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGxheW91dCA9IGN5LmxheW91dChsYXlvdXRwYXJhbSk7IC8vIElmIGxheW91dHBhcmFtIGlzIGxheW91dCBvcHRpb25zIGNhbGwgbGF5b3V0IHdpdGggdGhhdCBvcHRpb25zLlxyXG5cclxuICAgICAgICAgICAgLy8gRG8gdGhpcyBjaGVjayBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcclxuICAgICAgICAgICAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuKSB7XHJcbiAgICAgICAgICAgICAgICBsYXlvdXQucnVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBVbmhpZGUgZ2l2ZW4gZWxlcyBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xyXG4gICAgICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLlxyXG4gICAgICovXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IGN5LnZpZXdVdGlsaXRpZXMoKS5zaG93KGVsZXMpOyAvLyBTaG93IGdpdmVuIGVsZXNcclxuICAgICAgaWYgKHR5cGVvZiBsYXlvdXRwYXJhbSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGxheW91dHBhcmFtKCk7IC8vIElmIGxheW91dHBhcmFtIGlzIGEgZnVuY3Rpb24gZXhlY3V0ZSBpdFxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciBsYXlvdXQgPSBjeS5sYXlvdXQobGF5b3V0cGFyYW0pOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBsYXlvdXQgb3B0aW9ucyBjYWxsIGxheW91dCB3aXRoIHRoYXQgb3B0aW9ucy5cclxuXHJcbiAgICAgICAgLy8gRG8gdGhpcyBjaGVjayBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcclxuICAgICAgICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4pIHtcclxuICAgICAgICAgIGxheW91dC5ydW4oKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBDaGFuZ2Ugc3R5bGUvY3NzIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcclxuICAgICAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLlxyXG4gICAgICovXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XHJcbiAgICAgIGlmICggdHlwZW9mIHZhbHVlTWFwID09PSAnb2JqZWN0JyApIHtcclxuICAgICAgICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB2YXIgZWxlID0gY3kuZ2V0RWxlbWVudEJ5SWQoZWxlc1tpXS5pZCgpKTtcclxuICAgICAgICAgIGVsZS5jc3MobmFtZSwgdmFsdWVNYXBbZWxlLmlkKCldKTsgLy8gdmFsdWVNYXAgaXMgYW4gaWQgdG8gdmFsdWUgbWFwIHVzZSBpdCBpbiB0aGlzIHdheVxyXG4gICAgICAgIH1cclxuICAgICAgICBjeS5lbmRCYXRjaCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGVsZXMuY3NzKG5hbWUsIHZhbHVlTWFwKTsgLy8gdmFsdWVNYXAgaXMganVzdCBhIHN0cmluZyBzZXQgY3NzKCduYW1lJykgZm9yIGFsbCBlbGVzIHRvIHRoaXMgdmFsdWVcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogQ2hhbmdlIGRhdGEgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxyXG4gICAgICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuXHJcbiAgICAgKi9cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YSA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XHJcbiAgICAgIGlmICggdHlwZW9mIHZhbHVlTWFwID09PSAnb2JqZWN0JyApIHtcclxuICAgICAgICBjeS5zdGFydEJhdGNoKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB2YXIgZWxlID0gY3kuZ2V0RWxlbWVudEJ5SWQoZWxlc1tpXS5pZCgpKTtcclxuICAgICAgICAgIGVsZS5kYXRhKG5hbWUsIHZhbHVlTWFwW2VsZS5pZCgpXSk7IC8vIHZhbHVlTWFwIGlzIGFuIGlkIHRvIHZhbHVlIG1hcCB1c2UgaXQgaW4gdGhpcyB3YXlcclxuICAgICAgICB9XHJcbiAgICAgICAgY3kuZW5kQmF0Y2goKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBlbGVzLmRhdGEobmFtZSwgdmFsdWVNYXApOyAvLyB2YWx1ZU1hcCBpcyBqdXN0IGEgc3RyaW5nIHNldCBjc3MoJ25hbWUnKSBmb3IgYWxsIGVsZXMgdG8gdGhpcyB2YWx1ZVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlU2V0RmllbGQgPSBmdW5jdGlvbihlbGUsIGZpZWxkTmFtZSwgdG9EZWxldGUsIHRvQWRkLCBjYWxsYmFjaykge1xyXG4gICAgICB2YXIgc2V0ID0gZWxlLmRhdGEoIGZpZWxkTmFtZSApO1xyXG4gICAgICBpZiAoICFzZXQgKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciB1cGRhdGVzID0ge307XHJcblxyXG4gICAgICBpZiAoIHRvRGVsZXRlICE9IG51bGwgJiYgc2V0WyB0b0RlbGV0ZSBdICkge1xyXG4gICAgICAgIGRlbGV0ZSBzZXRbIHRvRGVsZXRlIF07XHJcbiAgICAgICAgdXBkYXRlcy5kZWxldGVkID0gdG9EZWxldGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICggdG9BZGQgIT0gbnVsbCApIHtcclxuICAgICAgICBzZXRbIHRvQWRkIF0gPSB0cnVlO1xyXG4gICAgICAgIHVwZGF0ZXMuYWRkZWQgPSB0b0FkZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCBjYWxsYmFjayAmJiAoIHVwZGF0ZXNbICdkZWxldGVkJyBdICE9IG51bGwgfHwgdXBkYXRlc1sgJ2FkZGVkJyBdICE9IG51bGwgKSApIHtcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdXBkYXRlcztcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiB0aGUgc2V0IG9mIGFsbCBub2RlcyBwcmVzZW50IHVuZGVyIHRoZSBnaXZlbiBwb3NpdGlvblxyXG4gICAgICogcmVuZGVyZWRQb3MgbXVzdCBiZSBhIHBvaW50IGRlZmluZWQgcmVsYXRpdmVseSB0byBjeXRvc2NhcGUgY29udGFpbmVyXHJcbiAgICAgKiAobGlrZSByZW5kZXJlZFBvc2l0aW9uIGZpZWxkIG9mIGEgbm9kZSlcclxuICAgICAqL1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5nZXROb2Rlc0F0ID0gZnVuY3Rpb24ocmVuZGVyZWRQb3MpIHtcclxuICAgICAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcclxuICAgICAgdmFyIHggPSByZW5kZXJlZFBvcy54O1xyXG4gICAgICB2YXIgeSA9IHJlbmRlcmVkUG9zLnk7XHJcbiAgICAgIHZhciByZXN1bHROb2RlcyA9IFtdO1xyXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICAgIHZhciByZW5kZXJlZEJib3ggPSBub2RlLnJlbmRlcmVkQm91bmRpbmdCb3goe1xyXG4gICAgICAgICAgaW5jbHVkZU5vZGVzOiB0cnVlLFxyXG4gICAgICAgICAgaW5jbHVkZUVkZ2VzOiBmYWxzZSxcclxuICAgICAgICAgIGluY2x1ZGVMYWJlbHM6IGZhbHNlLFxyXG4gICAgICAgICAgaW5jbHVkZVNoYWRvd3M6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHggPj0gcmVuZGVyZWRCYm94LngxICYmIHggPD0gcmVuZGVyZWRCYm94LngyKSB7XHJcbiAgICAgICAgICBpZiAoeSA+PSByZW5kZXJlZEJib3gueTEgJiYgeSA8PSByZW5kZXJlZEJib3gueTIpIHtcclxuICAgICAgICAgICAgcmVzdWx0Tm9kZXMucHVzaChub2RlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc3VsdE5vZGVzO1xyXG4gICAgfTtcclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmRlbXVsdGltZXJpemVDbGFzcyA9IGZ1bmN0aW9uKHNiZ25jbGFzcykge1xyXG4gICAgICByZXR1cm4gc2JnbmNsYXNzLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIG1hcFR5cGUgLSB0eXBlIG9mIHRoZSBjdXJyZW50IG1hcCAoUEQsIEFGIG9yIFVua25vd24pXHJcbiAgICAgKi9cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZSA9IGZ1bmN0aW9uKG1hcFR5cGUpe1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLm1hcFR5cGUgPSBtYXBUeXBlO1xyXG4gICAgICByZXR1cm4gbWFwVHlwZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJldHVybiAtIG1hcCB0eXBlXHJcbiAgICAgKi9cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVzZXRzIG1hcCB0eXBlXHJcbiAgICAgKi9cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzZXRNYXBUeXBlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1hcFR5cGUgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBLZWVwIGNvbnNpc3RlbmN5IG9mIGxpbmtzIHRvIHNlbGYgaW5zaWRlIHRoZSBkYXRhKCkgc3RydWN0dXJlLlxyXG4gICAgICogVGhpcyBpcyBuZWVkZWQgd2hlbmV2ZXIgYSBub2RlIGNoYW5nZXMgcGFyZW50cywgZm9yIGV4YW1wbGUsXHJcbiAgICAgKiBhcyBpdCBpcyBkZXN0cm95ZWQgYW5kIHJlY3JlYXRlZC4gQnV0IHRoZSBkYXRhKCkgc3RheXMgaWRlbnRpY2FsLlxyXG4gICAgICogVGhpcyBjcmVhdGVzIGluY29uc2lzdGVuY2llcyBmb3IgdGhlIHBvaW50ZXJzIHN0b3JlZCBpbiBkYXRhKCksXHJcbiAgICAgKiBhcyB0aGV5IG5vdyBwb2ludCB0byBhIGRlbGV0ZWQgbm9kZS5cclxuICAgICAqL1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXIgPSBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgICBlbGVzLm5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbihlbGUpe1xyXG4gICAgICAgIC8vIHJlc3RvcmUgYmFja2dyb3VuZCBpbWFnZXNcclxuICAgICAgICBlbGUuZW1pdCgnZGF0YScpO1xyXG5cclxuICAgICAgICAvLyBza2lwIG5vZGVzIHdpdGhvdXQgYW55IGF1eGlsaWFyeSB1bml0c1xyXG4gICAgICAgIGlmKCFlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSB8fCBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IodmFyIHNpZGUgaW4gZWxlLmRhdGEoJ2F1eHVuaXRsYXlvdXRzJykpIHtcclxuICAgICAgICAgIGVsZS5kYXRhKCdhdXh1bml0bGF5b3V0cycpW3NpZGVdLnBhcmVudE5vZGUgPSBlbGUuaWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJylbaV0ucGFyZW50ID0gZWxlLmlkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmFueUhhc0JhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChlbGVzKSB7XHJcbiAgICAgIHZhciBvYmogPSBlbGVtZW50VXRpbGl0aWVzLmdldEJhY2tncm91bmRJbWFnZU9ianMoZWxlcyk7XHJcbiAgICAgIGlmKG9iaiA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgZWxzZXtcclxuICAgICAgICBmb3IodmFyIGtleSBpbiBvYmope1xyXG4gICAgICAgICAgdmFyIHZhbHVlID0gb2JqW2tleV07XHJcbiAgICAgICAgICBpZih2YWx1ZSAmJiAhJC5pc0VtcHR5T2JqZWN0KHZhbHVlKSlcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuaGFzQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICBpZihlbGUuaXNOb2RlKCkpe1xyXG4gICAgICAgIHZhciBiZyA9IGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykgPyBlbGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpIDogXCJcIjtcclxuICAgICAgICB2YXIgY2xvbmVJbWcgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsJTNDc3ZnJTIwd2lkdGglM0QlMjIxMDAlMjIlMjBoZWlnaHQlM0QlMjIxMDAlMjIlMjB2aWV3Qm94JTNEJTIyMCUyMDAlMjAxMDAlMjAxMDAlMjIlMjBzdHlsZSUzRCUyMmZpbGwlM0Fub25lJTNCc3Ryb2tlJTNBYmxhY2slM0JzdHJva2Utd2lkdGglM0EwJTNCJTIyJTIweG1sbnMlM0QlMjJodHRwJTNBLy93d3cudzMub3JnLzIwMDAvc3ZnJTIyJTIwJTNFJTNDcmVjdCUyMHglM0QlMjIwJTIyJTIweSUzRCUyMjAlMjIlMjB3aWR0aCUzRCUyMjEwMCUyMiUyMGhlaWdodCUzRCUyMjEwMCUyMiUyMHN0eWxlJTNEJTIyZmlsbCUzQSUyM2E5YTlhOSUyMi8lM0UlMjAlM0Mvc3ZnJTNFJztcclxuICAgICAgICBpZihiZyAhPT0gXCJcIiAmJiAhKGJnLmluZGV4T2YoY2xvbmVJbWcpID4gLTEgJiYgYmcgPT09IGNsb25lSW1nKSlcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudFV0aWxpdGllcy5nZXRCYWNrZ3JvdW5kSW1hZ2VVUkwgPSBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgICBpZighZWxlcyB8fCBlbGVzLmxlbmd0aCA8IDEpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdmFyIGNvbW1vblVSTCA9IFwiXCI7XHJcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuXHJcbiAgICAgICAgaWYoIWVsZS5pc05vZGUoKSB8fCAhZWxlbWVudFV0aWxpdGllcy5oYXNCYWNrZ3JvdW5kSW1hZ2UoZWxlKSlcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIHVybCA9IGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykuc3BsaXQoXCIgXCIpLnBvcCgpO1xyXG4gICAgICAgIGlmKCF1cmwgfHwgdXJsLmluZGV4T2YoJ2h0dHAnKSAhPT0gMCB8fCAoY29tbW9uVVJMICE9PSBcIlwiICYmIGNvbW1vblVSTCAhPT0gdXJsKSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBlbHNlIGlmKGNvbW1vblVSTCA9PT0gXCJcIilcclxuICAgICAgICAgIGNvbW1vblVSTCA9IHVybDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNvbW1vblVSTDtcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmdldEJhY2tncm91bmRJbWFnZU9ianMgPSBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgICBpZighZWxlcyB8fCBlbGVzLmxlbmd0aCA8IDEpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdmFyIGxpc3QgPSB7fTtcclxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG4gICAgICAgIHZhciBvYmogPSBnZXRCZ09iaihlbGUpO1xyXG4gICAgICAgIGlmKG9iaiA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsaXN0W2VsZS5kYXRhKCdpZCcpXSA9IG9iajtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbGlzdDtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldEJnT2JqIChlbGUpIHtcclxuICAgICAgICBpZihlbGUuaXNOb2RlKCkgJiYgZWxlbWVudFV0aWxpdGllcy5oYXNCYWNrZ3JvdW5kSW1hZ2UoZWxlKSl7XHJcbiAgICAgICAgICB2YXIga2V5cyA9IFsnYmFja2dyb3VuZC1pbWFnZScsICdiYWNrZ3JvdW5kLWZpdCcsICdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknLFxyXG4gICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24teCcsICdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknLCAnYmFja2dyb3VuZC1oZWlnaHQnLCAnYmFja2dyb3VuZC13aWR0aCddO1xyXG5cclxuICAgICAgICAgIHZhciBvYmogPSB7fTtcclxuICAgICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgICAgICB2YXIgYXJyID0gZWxlLmRhdGEoa2V5KTtcclxuICAgICAgICAgICAgb2JqW2tleV0gPSBhcnIgPyBhcnIgOiBcIlwiO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihlbGUuaXNOb2RlKCkpXHJcbiAgICAgICAgICByZXR1cm4ge307XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmdldEJhY2tncm91bmRGaXRPcHRpb25zID0gZnVuY3Rpb24gKGVsZXMpIHtcclxuICAgICAgaWYoIWVsZXMgfHwgZWxlcy5sZW5ndGggPCAxKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHZhciBjb21tb25GaXQgPSBcIlwiO1xyXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBlbGVzW2ldO1xyXG4gICAgICAgIGlmKCFub2RlLmlzTm9kZSgpKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgZml0ID0gZ2V0Rml0T3B0aW9uKG5vZGUpO1xyXG4gICAgICAgIGlmKCFmaXQgfHwgKGNvbW1vbkZpdCAhPT0gXCJcIiAmJiBmaXQgIT09IGNvbW1vbkZpdCkpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgZWxzZSBpZihjb21tb25GaXQgPT09IFwiXCIpXHJcbiAgICAgICAgICBjb21tb25GaXQgPSBmaXQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBvcHRpb25zID0gJzxvcHRpb24gdmFsdWU9XCJub25lXCI+Tm9uZTwvb3B0aW9uPidcclxuICAgICAgICAgICAgICAgICAgKyAnPG9wdGlvbiB2YWx1ZT1cImZpdFwiPkZpdDwvb3B0aW9uPidcclxuICAgICAgICAgICAgICAgICAgKyAnPG9wdGlvbiB2YWx1ZT1cImNvdmVyXCI+Q292ZXI8L29wdGlvbj4nXHJcbiAgICAgICAgICAgICAgICAgICsgJzxvcHRpb24gdmFsdWU9XCJjb250YWluXCI+Q29udGFpbjwvb3B0aW9uPic7XHJcbiAgICAgIHZhciBzZWFyY2hLZXkgPSAndmFsdWU9XCInICsgY29tbW9uRml0ICsgJ1wiJztcclxuICAgICAgdmFyIGluZGV4ID0gb3B0aW9ucy5pbmRleE9mKHNlYXJjaEtleSkgKyBzZWFyY2hLZXkubGVuZ3RoO1xyXG4gICAgICByZXR1cm4gb3B0aW9ucy5zdWJzdHIoMCwgaW5kZXgpICsgJyBzZWxlY3RlZCcgKyBvcHRpb25zLnN1YnN0cihpbmRleCk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXRGaXRPcHRpb24obm9kZSkge1xyXG4gICAgICAgIGlmKCFlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShub2RlKSlcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIGYgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0Jyk7XHJcbiAgICAgICAgdmFyIGggPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0Jyk7XHJcblxyXG4gICAgICAgIGlmKCFmIHx8ICFoKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBmID0gZi5zcGxpdChcIiBcIik7XHJcbiAgICAgICAgaCA9IGguc3BsaXQoXCIgXCIpO1xyXG4gICAgICAgIGlmKGZbZi5sZW5ndGgtMV0gPT09IFwibm9uZVwiKVxyXG4gICAgICAgICAgcmV0dXJuIChoW2gubGVuZ3RoLTFdID09PSBcImF1dG9cIiA/IFwibm9uZVwiIDogXCJmaXRcIik7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgcmV0dXJuIGZbZi5sZW5ndGgtMV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChub2RlcywgYmdPYmopIHtcclxuICAgICAgaWYoIW5vZGVzIHx8IG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFiZ09iailcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgICAgdmFyIG9iaiA9IGJnT2JqW25vZGUuZGF0YSgnaWQnKV07XHJcbiAgICAgICAgaWYoIW9iaiB8fCAkLmlzRW1wdHlPYmplY3Qob2JqKSlcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICB2YXIgaW1ncyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykuc3BsaXQoXCIgXCIpIDogW107XHJcbiAgICAgICAgdmFyIHhQb3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnKS5zcGxpdChcIiBcIikgOiBbXTtcclxuICAgICAgICB2YXIgeVBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG4gICAgICAgIHZhciB3aWR0aHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG4gICAgICAgIHZhciBoZWlnaHRzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWhlaWdodCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWhlaWdodCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG4gICAgICAgIHZhciBmaXRzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG4gICAgICAgIHZhciBvcGFjaXRpZXMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScpID8gKFwiXCIgKyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScpKS5zcGxpdChcIiBcIikgOiBbXTtcclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgaWYodHlwZW9mIG9ialsnYmFja2dyb3VuZC1pbWFnZSddID09PSBcInN0cmluZ1wiKVxyXG4gICAgICAgICAgaW5kZXggPSBpbWdzLmluZGV4T2Yob2JqWydiYWNrZ3JvdW5kLWltYWdlJ10pO1xyXG4gICAgICAgIGVsc2UgaWYoQXJyYXkuaXNBcnJheShvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSkpXHJcbiAgICAgICAgICBpbmRleCA9IGltZ3MuaW5kZXhPZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXVswXSk7XHJcblxyXG4gICAgICAgIGlmKGluZGV4IDwgMClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSAmJiBpbWdzLmxlbmd0aCA+IGluZGV4KXtcclxuICAgICAgICAgIHZhciB0bXAgPSBpbWdzW2luZGV4XTtcclxuICAgICAgICAgIGltZ3NbaW5kZXhdID0gb2JqWydiYWNrZ3JvdW5kLWltYWdlJ107XHJcbiAgICAgICAgICBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSA9IHRtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqWydiYWNrZ3JvdW5kLWZpdCddICYmIGZpdHMubGVuZ3RoID4gaW5kZXgpe1xyXG4gICAgICAgICAgdmFyIHRtcCA9IGZpdHNbaW5kZXhdO1xyXG4gICAgICAgICAgZml0c1tpbmRleF0gPSBvYmpbJ2JhY2tncm91bmQtZml0J107XHJcbiAgICAgICAgICBvYmpbJ2JhY2tncm91bmQtZml0J10gPSB0bXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9ialsnYmFja2dyb3VuZC13aWR0aCddICYmIHdpZHRocy5sZW5ndGggPiBpbmRleCl7XHJcbiAgICAgICAgICB2YXIgdG1wID0gd2lkdGhzW2luZGV4XTtcclxuICAgICAgICAgIHdpZHRoc1tpbmRleF0gPSBvYmpbJ2JhY2tncm91bmQtd2lkdGgnXTtcclxuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC13aWR0aCddID0gdG1wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtaGVpZ2h0J10gJiYgaGVpZ2h0cy5sZW5ndGggPiBpbmRleCl7XHJcbiAgICAgICAgICB2YXIgdG1wID0gaGVpZ2h0c1tpbmRleF07XHJcbiAgICAgICAgICBoZWlnaHRzW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1oZWlnaHQnXTtcclxuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC1oZWlnaHQnXSA9IHRtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnXSAmJiB4UG9zLmxlbmd0aCA+IGluZGV4KXtcclxuICAgICAgICAgIHZhciB0bXAgPSB4UG9zW2luZGV4XTtcclxuICAgICAgICAgIHhQb3NbaW5kZXhdID0gb2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnXTtcclxuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC1wb3NpdGlvbi14J10gPSB0bXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9ialsnYmFja2dyb3VuZC1wb3NpdGlvbi15J10gJiYgeVBvcy5sZW5ndGggPiBpbmRleCl7XHJcbiAgICAgICAgICB2YXIgdG1wID0geVBvc1tpbmRleF07XHJcbiAgICAgICAgICB5UG9zW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1wb3NpdGlvbi15J107XHJcbiAgICAgICAgICBvYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teSddID0gdG1wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eSddICYmIG9wYWNpdGllcy5sZW5ndGggPiBpbmRleCl7XHJcbiAgICAgICAgICB2YXIgdG1wID0gb3BhY2l0aWVzW2luZGV4XTtcclxuICAgICAgICAgIG9wYWNpdGllc1tpbmRleF0gPSBvYmpbJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eSddO1xyXG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknXSA9IHRtcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScsIGltZ3Muam9pbihcIiBcIikpO1xyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JywgeFBvcy5qb2luKFwiIFwiKSk7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknLCB5UG9zLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnLCB3aWR0aHMuam9pbihcIiBcIikpO1xyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnLCBoZWlnaHRzLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0JywgZml0cy5qb2luKFwiIFwiKSk7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknLCBvcGFjaXRpZXMuam9pbihcIiBcIikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gYmdPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAobm9kZXMsIG9sZEltZywgbmV3SW1nLCBmaXJzdFRpbWUsIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpIHtcclxuICAgICAgaWYoIW5vZGVzIHx8IG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFvbGRJbWcgfHwgIW5ld0ltZylcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZShub2Rlcywgb2xkSW1nKTtcclxuICAgICAgZm9yKHZhciBrZXkgaW4gbmV3SW1nKXtcclxuICAgICAgICBuZXdJbWdba2V5XVsnZmlyc3RUaW1lJ10gPSBmaXJzdFRpbWU7XHJcbiAgICAgIH1cclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIG5ld0ltZywgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCk7XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgICBvbGRJbWc6IG5ld0ltZyxcclxuICAgICAgICBuZXdJbWc6IG9sZEltZyxcclxuICAgICAgICBmaXJzdFRpbWU6IGZhbHNlLFxyXG4gICAgICAgIHByb21wdEludmFsaWRJbWFnZTogcHJvbXB0SW52YWxpZEltYWdlLFxyXG4gICAgICAgIHZhbGlkYXRlVVJMOiB2YWxpZGF0ZVVSTFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCBhIGJhY2tncm91bmQgaW1hZ2UgdG8gZ2l2ZW4gbm9kZXMuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChub2RlcywgYmdPYmosIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpIHtcclxuICAgICAgaWYoIW5vZGVzIHx8IG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFiZ09iailcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgICAgdmFyIG9iaiA9IGJnT2JqW25vZGUuZGF0YSgnaWQnKV07XHJcbiAgICAgICAgaWYoIW9iaiB8fCAkLmlzRW1wdHlPYmplY3Qob2JqKSlcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAvLyBMb2FkIHRoZSBpbWFnZSBmcm9tIGxvY2FsLCBlbHNlIGp1c3QgcHV0IHRoZSBVUkxcclxuICAgICAgICBpZihvYmpbJ2Zyb21GaWxlJ10pXHJcbiAgICAgICAgbG9hZEJhY2tncm91bmRUaGVuQXBwbHkobm9kZSwgb2JqKTtcclxuICAgICAgICAvLyBWYWxpZGl0eSBvZiBnaXZlbiBVUkwgc2hvdWxkIGJlIGNoZWNrZWQgYmVmb3JlIGFwcGx5aW5nIGl0XHJcbiAgICAgICAgZWxzZSBpZihvYmpbJ2ZpcnN0VGltZSddKXtcclxuICAgICAgICAgIGlmKHR5cGVvZiB2YWxpZGF0ZVVSTCA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgdmFsaWRhdGVVUkwobm9kZSwgb2JqLCBhcHBseUJhY2tncm91bmQsIHByb21wdEludmFsaWRJbWFnZSk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGNoZWNrR2l2ZW5VUkwobm9kZSwgb2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgYXBwbHlCYWNrZ3JvdW5kKG5vZGUsIG9iaik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGxvYWRCYWNrZ3JvdW5kVGhlbkFwcGx5KG5vZGUsIGJnT2JqKSB7XHJcbiAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgdmFyIGltZ0ZpbGUgPSBiZ09ialsnYmFja2dyb3VuZC1pbWFnZSddO1xyXG5cclxuICAgICAgICAvLyBDaGVjayB3aGV0aGVyIGdpdmVuIGZpbGUgaXMgYW4gaW1hZ2UgZmlsZVxyXG4gICAgICAgIGlmKGltZ0ZpbGUudHlwZS5pbmRleE9mKFwiaW1hZ2VcIikgIT09IDApe1xyXG4gICAgICAgICAgaWYocHJvbXB0SW52YWxpZEltYWdlKVxyXG4gICAgICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2UoXCJJbnZhbGlkIGltYWdlIGZpbGUgaXMgZ2l2ZW4hXCIpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW1nRmlsZSk7XHJcblxyXG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgdmFyIGltZyA9IHJlYWRlci5yZXN1bHQ7XHJcbiAgICAgICAgICBpZihpbWcpe1xyXG4gICAgICAgICAgICBiZ09ialsnYmFja2dyb3VuZC1pbWFnZSddID0gaW1nO1xyXG4gICAgICAgICAgICBiZ09ialsnZnJvbUZpbGUnXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBhcHBseUJhY2tncm91bmQobm9kZSwgYmdPYmopO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgaWYocHJvbXB0SW52YWxpZEltYWdlKVxyXG4gICAgICAgICAgICAgIHByb21wdEludmFsaWRJbWFnZShcIkdpdmVuIGZpbGUgY291bGQgbm90IGJlIHJlYWQhXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNoZWNrR2l2ZW5VUkwobm9kZSwgYmdPYmope1xyXG4gICAgICAgIHZhciB1cmwgPSBiZ09ialsnYmFja2dyb3VuZC1pbWFnZSddO1xyXG4gICAgICAgIHZhciBleHRlbnNpb24gPSAodXJsLnNwbGl0KC9bPyNdLylbMF0pLnNwbGl0KFwiLlwiKS5wb3AoKTtcclxuICAgICAgICB2YXIgdmFsaWRFeHRlbnNpb25zID0gW1wicG5nXCIsIFwic3ZnXCIsIFwianBnXCIsIFwianBlZ1wiXTtcclxuXHJcbiAgICAgICAgaWYoIXZhbGlkRXh0ZW5zaW9ucy5pbmNsdWRlcyhleHRlbnNpb24pKXtcclxuICAgICAgICAgIGlmKHR5cGVvZiBwcm9tcHRJbnZhbGlkSW1hZ2UgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgIHByb21wdEludmFsaWRJbWFnZShcIkludmFsaWQgVVJMIGlzIGdpdmVuIVwiKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzdWx0LCBzdGF0dXMsIHhocil7XHJcbiAgICAgICAgICAgIGFwcGx5QmFja2dyb3VuZChub2RlLCBiZ09iaik7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnJvcil7XHJcbiAgICAgICAgICAgIGlmKHByb21wdEludmFsaWRJbWFnZSlcclxuICAgICAgICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2UoXCJJbnZhbGlkIFVSTCBpcyBnaXZlbiFcIik7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBhcHBseUJhY2tncm91bmQobm9kZSwgYmdPYmopIHtcclxuXHJcbiAgICAgICAgaWYoZWxlbWVudFV0aWxpdGllcy5oYXNCYWNrZ3JvdW5kSW1hZ2Uobm9kZSkpXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHZhciBpbWdzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKS5zcGxpdChcIiBcIikgOiBbXTtcclxuICAgICAgICB2YXIgeFBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG4gICAgICAgIHZhciB5UG9zID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15Jykuc3BsaXQoXCIgXCIpIDogW107XHJcbiAgICAgICAgdmFyIHdpZHRocyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJykuc3BsaXQoXCIgXCIpIDogW107XHJcbiAgICAgICAgdmFyIGhlaWdodHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0Jykuc3BsaXQoXCIgXCIpIDogW107XHJcbiAgICAgICAgdmFyIGZpdHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0Jykuc3BsaXQoXCIgXCIpIDogW107XHJcbiAgICAgICAgdmFyIG9wYWNpdGllcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5JykgPyAoXCJcIiArIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5JykpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG5cclxuICAgICAgICB2YXIgaW5kZXhUb0luc2VydCA9IGltZ3MubGVuZ3RoO1xyXG5cclxuICAgICAgICAvLyBpbnNlcnQgdG8gbGVuZ3RoLTFcclxuICAgICAgICBpZihoYXNDbG9uZU1hcmtlcihub2RlLCBpbWdzKSl7XHJcbiAgICAgICAgICBpbmRleFRvSW5zZXJ0LS07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbWdzLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1pbWFnZSddKTtcclxuICAgICAgICBmaXRzLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1maXQnXSk7XHJcbiAgICAgICAgb3BhY2l0aWVzLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5J10pO1xyXG4gICAgICAgIHhQb3Muc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnXSk7XHJcbiAgICAgICAgeVBvcy5zcGxpY2UoaW5kZXhUb0luc2VydCwgMCwgYmdPYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teSddKTtcclxuICAgICAgICB3aWR0aHMuc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLXdpZHRoJ10pO1xyXG4gICAgICAgIGhlaWdodHMuc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLWhlaWdodCddKTtcclxuXHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJywgaW1ncy5qb2luKFwiIFwiKSk7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnLCB4UG9zLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScsIHlQb3Muam9pbihcIiBcIikpO1xyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcsIHdpZHRocy5qb2luKFwiIFwiKSk7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWhlaWdodCcsIGhlaWdodHMuam9pbihcIiBcIikpO1xyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1maXQnLCBmaXRzLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScsIG9wYWNpdGllcy5qb2luKFwiIFwiKSk7XHJcbiAgICAgICAgYmdPYmpbJ2ZpcnN0VGltZSddID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmKHVwZGF0ZUluZm8pXHJcbiAgICAgICAgICB1cGRhdGVJbmZvKCk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBoYXNDbG9uZU1hcmtlcihub2RlLCBpbWdzKXtcclxuICAgICAgICB2YXIgY2xvbmVJbWcgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsJTNDc3ZnJTIwd2lkdGglM0QlMjIxMDAlMjIlMjBoZWlnaHQlM0QlMjIxMDAlMjIlMjB2aWV3Qm94JTNEJTIyMCUyMDAlMjAxMDAlMjAxMDAlMjIlMjBzdHlsZSUzRCUyMmZpbGwlM0Fub25lJTNCc3Ryb2tlJTNBYmxhY2slM0JzdHJva2Utd2lkdGglM0EwJTNCJTIyJTIweG1sbnMlM0QlMjJodHRwJTNBLy93d3cudzMub3JnLzIwMDAvc3ZnJTIyJTIwJTNFJTNDcmVjdCUyMHglM0QlMjIwJTIyJTIweSUzRCUyMjAlMjIlMjB3aWR0aCUzRCUyMjEwMCUyMiUyMGhlaWdodCUzRCUyMjEwMCUyMiUyMHN0eWxlJTNEJTIyZmlsbCUzQSUyM2E5YTlhOSUyMi8lM0UlMjAlM0Mvc3ZnJTNFJztcclxuICAgICAgICByZXR1cm4gKGltZ3MuaW5kZXhPZihjbG9uZUltZykgPiAtMSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gUmVtb3ZlIGEgYmFja2dyb3VuZCBpbWFnZSBmcm9tIGdpdmVuIG5vZGVzLlxyXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAobm9kZXMsIGJnT2JqKSB7XHJcbiAgICAgIGlmKCFub2RlcyB8fCBub2Rlcy5sZW5ndGggPT0gMCB8fCAhYmdPYmopXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICAgIHZhciBvYmogPSBiZ09ialtub2RlLmRhdGEoJ2lkJyldO1xyXG4gICAgICAgIGlmKCFvYmopXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgdmFyIGltZ3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG4gICAgICAgIHZhciB4UG9zID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14Jykuc3BsaXQoXCIgXCIpIDogW107XHJcbiAgICAgICAgdmFyIHlQb3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknKS5zcGxpdChcIiBcIikgOiBbXTtcclxuICAgICAgICB2YXIgd2lkdGhzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKS5zcGxpdChcIiBcIikgOiBbXTtcclxuICAgICAgICB2YXIgaGVpZ2h0cyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnKS5zcGxpdChcIiBcIikgOiBbXTtcclxuICAgICAgICB2YXIgZml0cyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1maXQnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1maXQnKS5zcGxpdChcIiBcIikgOiBbXTtcclxuICAgICAgICB2YXIgb3BhY2l0aWVzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSA/IChcIlwiICsgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSkuc3BsaXQoXCIgXCIpIDogW107XHJcblxyXG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgIGlmKHR5cGVvZiBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSA9PT0gXCJzdHJpbmdcIilcclxuICAgICAgICAgIGluZGV4ID0gaW1ncy5pbmRleE9mKG9ialsnYmFja2dyb3VuZC1pbWFnZSddKTtcclxuICAgICAgICBlbHNlIGlmKEFycmF5LmlzQXJyYXkob2JqWydiYWNrZ3JvdW5kLWltYWdlJ10pKVxyXG4gICAgICAgICAgaW5kZXggPSBpbWdzLmluZGV4T2Yob2JqWydiYWNrZ3JvdW5kLWltYWdlJ11bMF0pO1xyXG5cclxuICAgICAgICBpZihpbmRleCA+IC0xKXtcclxuICAgICAgICAgIGltZ3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgIGZpdHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgIG9wYWNpdGllcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgeFBvcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgeVBvcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgd2lkdGhzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICBoZWlnaHRzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnLCBpbWdzLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcsIHhQb3Muam9pbihcIiBcIikpO1xyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JywgeVBvcy5qb2luKFwiIFwiKSk7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJywgd2lkdGhzLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JywgaGVpZ2h0cy5qb2luKFwiIFwiKSk7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcsIGZpdHMuam9pbihcIiBcIikpO1xyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5Jywgb3BhY2l0aWVzLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBiZ09ialsnZmlyc3RUaW1lJ10gPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJldmVyc2VFZGdlID0gZnVuY3Rpb24oZWRnZSl7XHJcbiAgICAgIHZhciBvbGRTb3VyY2UgPSBlZGdlLnNvdXJjZSgpLmlkKCk7XHJcbiAgICAgIHZhciBvbGRUYXJnZXQgPSBlZGdlLnRhcmdldCgpLmlkKCk7XHJcbiAgICAgIHZhciBvbGRQb3J0U291cmNlID0gZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiKTtcclxuICAgICAgdmFyIG9sZFBvcnRUYXJnZXQgPSBlZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpO1xyXG4gICAgICB2YXIgc2VnbWVudFBvaW50cyA9IGVkZ2Uuc2VnbWVudFBvaW50cygpO1xyXG5cclxuXHJcbiAgICAgIGVkZ2UuZGF0YSgpLnNvdXJjZSA9IG9sZFRhcmdldDtcclxuICAgICAgZWRnZS5kYXRhKCkudGFyZ2V0ID0gb2xkU291cmNlO1xyXG4gICAgICBlZGdlLmRhdGEoKS5wb3J0c291cmNlID0gb2xkUG9ydFRhcmdldDtcclxuICAgICAgZWRnZS5kYXRhKCkucG9ydHRhcmdldCA9IG9sZFBvcnRTb3VyY2U7XHJcbiAgICAgICBlZGdlID0gZWRnZS5tb3ZlKHtcclxuICAgICAgICAgdGFyZ2V0OiBvbGRTb3VyY2UsXHJcbiAgICAgICAgIHNvdXJjZSA6IG9sZFRhcmdldCAgICAgICAgXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYoQXJyYXkuaXNBcnJheShzZWdtZW50UG9pbnRzKSl7XHJcbiAgICAgICAgc2VnbWVudFBvaW50cy5yZXZlcnNlKCk7XHJcbiAgICAgICAgZWRnZS5kYXRhKCkuYmVuZFBvaW50UG9zaXRpb25zID0gc2VnbWVudFBvaW50cztcclxuICAgICAgICB2YXIgZWRnZUVkaXRpbmcgPSBjeS5lZGdlRWRpdGluZygnZ2V0Jyk7XHJcbiAgICAgICAgZWRnZUVkaXRpbmcuaW5pdEJlbmRQb2ludHMoZWRnZSk7XHJcbiAgICAgIH1cclxuICAgIFxyXG5cclxuICAgICAgcmV0dXJuIGVkZ2U7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXNFeHRlbmRlcjtcclxufTtcclxuIiwiLyogXHJcbiAqIFV0aWxpdHkgZmlsZSB0byBnZXQgYW5kIHNldCB0aGUgbGlicmFyaWVzIHRvIHdoaWNoIHNiZ252aXogaXMgZGVwZW5kZW50IGZyb20gYW55IGZpbGUuXHJcbiAqL1xyXG5cclxudmFyIGxpYlV0aWxpdGllcyA9IGZ1bmN0aW9uKCl7XHJcbn07XHJcblxyXG5saWJVdGlsaXRpZXMuc2V0TGlicyA9IGZ1bmN0aW9uKGxpYnMpIHtcclxuICB0aGlzLmxpYnMgPSBsaWJzO1xyXG59O1xyXG5cclxubGliVXRpbGl0aWVzLmdldExpYnMgPSBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gdGhpcy5saWJzO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsaWJVdGlsaXRpZXM7IiwidmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcblxyXG4vKlxyXG4gKiBUaGUgbWFpbiB1dGlsaXRpZXMgdG8gYmUgZXhwb3NlZCBkaXJlY3RseS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICB2YXIgZWxlbWVudFV0aWxpdGllcywgb3B0aW9ucywgY3ksIHNiZ252aXpJbnN0YW5jZTtcclxuXHJcbiAgZnVuY3Rpb24gbWFpblV0aWxpdGllcyAocGFyYW0pIHtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMgPSBwYXJhbS5lbGVtZW50VXRpbGl0aWVzO1xyXG4gICAgb3B0aW9ucyA9IHBhcmFtLm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcbiAgICBjeSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRDeSgpO1xyXG4gICAgc2JnbnZpekluc3RhbmNlID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEluc3RhbmNlKCk7XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBBZGRzIGEgbmV3IG5vZGUgd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlcy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLmFkZE5vZGUgPSBmdW5jdGlvbih4LCB5ICwgbm9kZVBhcmFtcywgaWQsIHBhcmVudCwgdmlzaWJpbGl0eSkge1xyXG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIG1hcCB0eXBlXHJcbiAgICBpZiAodHlwZW9mIG5vZGVQYXJhbXMgPT0gJ29iamVjdCcpe1xyXG4vKiBcclxuICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSlcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUobm9kZVBhcmFtcy5sYW5ndWFnZSk7XHJcbiAgICAgIGVsc2UgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpICE9IG5vZGVQYXJhbXMubGFuZ3VhZ2UpXHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiVW5rbm93blwiKTsgKi9cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4LCB5LCBub2RlUGFyYW1zLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgbmV3Tm9kZSA6IHtcclxuICAgICAgICAgIHg6IHgsXHJcbiAgICAgICAgICB5OiB5LFxyXG4gICAgICAgICAgY2xhc3M6IG5vZGVQYXJhbXMsXHJcbiAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICBwYXJlbnQ6IHBhcmVudCxcclxuICAgICAgICAgIHZpc2liaWxpdHk6IHZpc2liaWxpdHlcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkTm9kZVwiLCBwYXJhbSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBBZGRzIGEgbmV3IGVkZ2Ugd2l0aCB0aGUgZ2l2ZW4gY2xhc3MgYW5kIGhhdmluZyB0aGUgZ2l2ZW4gc291cmNlIGFuZCB0YXJnZXQgaWRzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuYWRkRWRnZSA9IGZ1bmN0aW9uKHNvdXJjZSwgdGFyZ2V0LCBlZGdlUGFyYW1zLCBpbnZhbGlkRWRnZUNhbGxiYWNrLCBpZCwgdmlzaWJpbGl0eSkge1xyXG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIG1hcCB0eXBlXHJcbiAgICBpZiAodHlwZW9mIGVkZ2VQYXJhbXMgPT0gJ29iamVjdCcpe1xyXG5cclxuICAgICAvKiAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSlcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoZWRnZVBhcmFtcy5sYW5ndWFnZSk7XHJcbiAgICAgIGVsc2UgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpICE9IGVkZ2VQYXJhbXMubGFuZ3VhZ2UpXHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiSHlicmlkQW55XCIpOyAqL1xyXG4gICAgfVxyXG4gICAgLy8gR2V0IHRoZSB2YWxpZGF0aW9uIHJlc3VsdFxyXG4gICAgdmFyIGVkZ2VjbGFzcyA9IGVkZ2VQYXJhbXMuY2xhc3MgPyBlZGdlUGFyYW1zLmNsYXNzIDogZWRnZVBhcmFtcztcclxuICAgIHZhciB2YWxpZGF0aW9uID0gZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyhlZGdlY2xhc3MsIGN5LmdldEVsZW1lbnRCeUlkKHNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHRhcmdldCkpO1xyXG5cclxuICAgIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdpbnZhbGlkJyBjYW5jZWwgdGhlIG9wZXJhdGlvblxyXG4gICAgaWYgKHZhbGlkYXRpb24gPT09ICdpbnZhbGlkJykge1xyXG4gICAgICBpZih0eXBlb2YgaW52YWxpZEVkZ2VDYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKXtcclxuICAgICAgICBpbnZhbGlkRWRnZUNhbGxiYWNrKCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIHZhbGlkYXRpb24gcmVzdWx0IGlzICdyZXZlcnNlJyByZXZlcnNlIHRoZSBzb3VyY2UtdGFyZ2V0IHBhaXIgYmVmb3JlIGNyZWF0aW5nIHRoZSBlZGdlXHJcbiAgICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XHJcbiAgICAgIHZhciB0ZW1wID0gc291cmNlO1xyXG4gICAgICBzb3VyY2UgPSB0YXJnZXQ7XHJcbiAgICAgIHRhcmdldCA9IHRlbXA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2Uoc291cmNlLCB0YXJnZXQsIGVkZ2VQYXJhbXMsIGlkLCB2aXNpYmlsaXR5KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgbmV3RWRnZSA6IHtcclxuICAgICAgICAgIHNvdXJjZTogc291cmNlLFxyXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXHJcbiAgICAgICAgICBjbGFzczogZWRnZVBhcmFtcyxcclxuICAgICAgICAgIGlkOiBpZCxcclxuICAgICAgICAgIHZpc2liaWxpdHk6IHZpc2liaWxpdHlcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB2YXIgcmVzdWx0ID0gY3kudW5kb1JlZG8oKS5kbyhcImFkZEVkZ2VcIiwgcGFyYW0pO1xyXG4gICAgICByZXR1cm4gcmVzdWx0LmVsZXM7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBBZGRzIGEgcHJvY2VzcyB3aXRoIGNvbnZlbmllbnQgZWRnZXMuIEZvciBtb3JlIGluZm9ybWF0aW9uIHBsZWFzZSBzZWUgJ2h0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvbmV3dC9pc3N1ZXMvOScuXHJcbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24oX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpIHtcclxuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIHNvdXJjZSBhbmQgdGFyZ2V0IElEcyBhcmUgZ2l2ZW4gZ2V0IHRoZSBlbGVtZW50cyBieSBJRHNcclxuICAgIHZhciBzb3VyY2UgPSB0eXBlb2YgX3NvdXJjZSA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfc291cmNlKSA6IF9zb3VyY2U7XHJcbiAgICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xyXG5cclxuICAgIC8vIElmIHNvdXJjZSBvciB0YXJnZXQgZG9lcyBub3QgaGF2ZSBhbiBFUE4gY2xhc3MgdGhlIG9wZXJhdGlvbiBpcyBub3QgdmFsaWRcclxuICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKHNvdXJjZSkgfHwgIWVsZW1lbnRVdGlsaXRpZXMuaXNFUE5DbGFzcyh0YXJnZXQpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMoX3NvdXJjZSwgX3RhcmdldCwgcHJvY2Vzc1R5cGUpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICBzb3VyY2U6IF9zb3VyY2UsXHJcbiAgICAgICAgdGFyZ2V0OiBfdGFyZ2V0LFxyXG4gICAgICAgIHByb2Nlc3NUeXBlOiBwcm9jZXNzVHlwZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzXCIsIHBhcmFtKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvLyBjb252ZXJ0IGNvbGxhcHNlZCBjb21wb3VuZCBub2RlcyB0byBzaW1wbGUgbm9kZXNcclxuICAvLyBhbmQgdXBkYXRlIHBvcnQgdmFsdWVzIG9mIHBhc3RlZCBub2RlcyBhbmQgZWRnZXNcclxuICB2YXIgY2xvbmVDb2xsYXBzZWROb2Rlc0FuZFBvcnRzID0gZnVuY3Rpb24gKGVsZXNCZWZvcmUpe1xyXG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xyXG4gICAgdmFyIGVsZXNBZnRlciA9IGN5LmVsZW1lbnRzKCk7XHJcbiAgICB2YXIgZWxlc0RpZmYgPSBlbGVzQWZ0ZXIuZGlmZihlbGVzQmVmb3JlKS5sZWZ0O1xyXG5cclxuICAgIC8vIHNoYWxsb3cgY29weSBjb2xsYXBzZWQgbm9kZXMgLSBjb2xsYXBzZWQgY29tcG91bmRzIGJlY29tZSBzaW1wbGUgbm9kZXNcclxuICAgIC8vIGRhdGEgcmVsYXRlZCB0byBjb2xsYXBzZWQgbm9kZXMgYXJlIHJlbW92ZWQgZnJvbSBnZW5lcmF0ZWQgY2xvbmVzXHJcbiAgICAvLyByZWxhdGVkIGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L25ld3QvaXNzdWVzLzE0NVxyXG4gICAgdmFyIGNvbGxhcHNlZE5vZGVzID0gZWxlc0RpZmYuZmlsdGVyKCdub2RlLmN5LWV4cGFuZC1jb2xsYXBzZS1jb2xsYXBzZWQtbm9kZScpO1xyXG5cclxuICAgIGNvbGxhcHNlZE5vZGVzLmNvbm5lY3RlZEVkZ2VzKCkucmVtb3ZlKCk7XHJcbiAgICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVDbGFzcygnY3ktZXhwYW5kLWNvbGxhcHNlLWNvbGxhcHNlZC1ub2RlJyk7XHJcbiAgICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVEYXRhKCdjb2xsYXBzZWRDaGlsZHJlbicpO1xyXG4gICAgY29sbGFwc2VkTm9kZXMucmVtb3ZlRGF0YSgncG9zaXRpb24tYmVmb3JlLWNvbGxhcHNlIHNpemUtYmVmb3JlLWNvbGxhcHNlJyk7XHJcbiAgICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVEYXRhKCdleHBhbmRjb2xsYXBzZVJlbmRlcmVkQ3VlU2l6ZSBleHBhbmRjb2xsYXBzZVJlbmRlcmVkU3RhcnRYIGV4cGFuZGNvbGxhcHNlUmVuZGVyZWRTdGFydFknKTtcclxuXHJcbiAgICAvLyBjbG9uaW5nIHBvcnRzXHJcbiAgICBlbGVzRGlmZi5ub2RlcygpLmZvckVhY2goZnVuY3Rpb24oX25vZGUpe1xyXG4gICAgICBpZihfbm9kZS5kYXRhKFwicG9ydHNcIikubGVuZ3RoID09IDIpe1xyXG4gICAgICAgICAgdmFyIG9sZFBvcnROYW1lMCA9IF9ub2RlLmRhdGEoXCJwb3J0c1wiKVswXS5pZDtcclxuICAgICAgICAgIHZhciBvbGRQb3J0TmFtZTEgPSBfbm9kZS5kYXRhKFwicG9ydHNcIilbMV0uaWQ7XHJcbiAgICAgICAgICBfbm9kZS5kYXRhKFwicG9ydHNcIilbMF0uaWQgPSBfbm9kZS5pZCgpICsgXCIuMVwiO1xyXG4gICAgICAgICAgX25vZGUuZGF0YShcInBvcnRzXCIpWzFdLmlkID0gX25vZGUuaWQoKSArIFwiLjJcIjtcclxuXHJcbiAgICAgICAgICBfbm9kZS5vdXRnb2VycygpLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbihfZWRnZSl7XHJcbiAgICAgICAgICAgIGlmKF9lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIpID09IG9sZFBvcnROYW1lMCl7XHJcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIiwgX25vZGUuZGF0YShcInBvcnRzXCIpWzBdLmlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKF9lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIpID09IG9sZFBvcnROYW1lMSl7XHJcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIiwgX25vZGUuZGF0YShcInBvcnRzXCIpWzFdLmlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIsIF9ub2RlLmlkKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIF9ub2RlLmluY29tZXJzKCkuZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKF9lZGdlKXtcclxuICAgICAgICAgICAgaWYoX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIikgPT0gb2xkUG9ydE5hbWUwKXtcclxuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiLCBfbm9kZS5kYXRhKFwicG9ydHNcIilbMF0uaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIikgPT0gb2xkUG9ydE5hbWUxKXtcclxuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiLCBfbm9kZS5kYXRhKFwicG9ydHNcIilbMV0uaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIiwgX25vZGUuaWQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgX25vZGUub3V0Z29lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xyXG4gICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIiwgX25vZGUuaWQoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgX25vZGUuaW5jb21lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xyXG4gICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIiwgX25vZGUuaWQoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgZWxlc0RpZmYuc2VsZWN0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAqIENsb25lIGdpdmVuIGVsZW1lbnRzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLmNsb25lRWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlcywgcGFzdGVBdE1vdXNlTG9jKSB7XHJcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29weUVsZW1lbnRzKGVsZXMpO1xyXG5cclxuICAgIHRoaXMucGFzdGVFbGVtZW50cyhwYXN0ZUF0TW91c2VMb2MpO1xyXG4gIH07XHJcblxyXG4gIC8qXHJcbiAgICogQ29weSBnaXZlbiBlbGVtZW50cyB0byBjbGlwYm9hcmQuIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuY29weUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcclxuICAgIGN5LmNsaXBib2FyZCgpLmNvcHkoZWxlcyk7XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBQYXN0ZSB0aGUgZWxlbWVudHMgY29waWVkIHRvIGNsaXBib2FyZC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5wYXN0ZUVsZW1lbnRzID0gZnVuY3Rpb24ocGFzdGVBdE1vdXNlTG9jKSB7XHJcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZWxlc0JlZm9yZSA9IGN5LmVsZW1lbnRzKCk7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInBhc3RlXCIse3Bhc3RlQXRNb3VzZUxvYzogcGFzdGVBdE1vdXNlTG9jfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY3kuY2xpcGJvYXJkKCkucGFzdGUoKTtcclxuICAgIH1cclxuICAgIGNsb25lQ29sbGFwc2VkTm9kZXNBbmRQb3J0cyhlbGVzQmVmb3JlKTtcclxuICAgIGN5Lm5vZGVzKFwiOnNlbGVjdGVkXCIpLmVtaXQoJ2RhdGEnKTtcclxuICB9O1xyXG5cclxuICAvKlxyXG4gICAqIEFsaWducyBnaXZlbiBub2RlcyBpbiBnaXZlbiBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBvcmRlci5cclxuICAgKiBIb3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBwYXJhbWV0ZXJzIG1heSBiZSAnbm9uZScgb3IgdW5kZWZpbmVkLlxyXG4gICAqIGFsaWduVG8gcGFyYW1ldGVyIGluZGljYXRlcyB0aGUgbGVhZGluZyBub2RlLlxyXG4gICAqIFJlcXVyaXJlcyBjeXRvc2NhcGUtZ3JpZC1ndWlkZSBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5hbGlnbiA9IGZ1bmN0aW9uIChub2RlcywgaG9yaXpvbnRhbCwgdmVydGljYWwsIGFsaWduVG8pIHtcclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhbGlnblwiLCB7XHJcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICAgIGhvcml6b250YWw6IGhvcml6b250YWwsXHJcbiAgICAgICAgdmVydGljYWw6IHZlcnRpY2FsLFxyXG4gICAgICAgIGFsaWduVG86IGFsaWduVG9cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBub2Rlcy5hbGlnbihob3Jpem9udGFsLCB2ZXJ0aWNhbCwgYWxpZ25Ubyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBDcmVhdGUgY29tcG91bmQgZm9yIGdpdmVuIG5vZGVzLiBjb21wb3VuZFR5cGUgbWF5IGJlICdjb21wbGV4JyBvciAnY29tcGFydG1lbnQnLlxyXG4gICAqIFRoaXMgbWV0aG9kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAoX25vZGVzLCBjb21wb3VuZFR5cGUpIHtcclxuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBub2RlcyA9IF9ub2RlcztcclxuICAgIC8qXHJcbiAgICAgKiBFbGVtaW5hdGUgdGhlIG5vZGVzIHdoaWNoIGNhbm5vdCBoYXZlIGEgcGFyZW50IHdpdGggZ2l2ZW4gY29tcG91bmQgdHlwZVxyXG4gICAgICovXHJcbiAgICBub2RlcyA9IF9ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZW1lbnQsIGkpIHtcclxuICAgICAgaWYodHlwZW9mIGVsZW1lbnQgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICBlbGVtZW50ID0gaTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHNiZ25jbGFzcyA9IGVsZW1lbnQuZGF0YShcImNsYXNzXCIpO1xyXG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc1ZhbGlkUGFyZW50KHNiZ25jbGFzcywgY29tcG91bmRUeXBlLCBlbGVtZW50KTtcclxuICAgIH0pO1xyXG5cclxuICAgIG5vZGVzID0gZWxlbWVudFV0aWxpdGllcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xyXG5cclxuICAgIC8vIEFsbCBlbGVtZW50cyBzaG91bGQgaGF2ZSB0aGUgc2FtZSBwYXJlbnQgYW5kIHRoZSBjb21tb24gcGFyZW50IHNob3VsZCBub3QgYmUgYSAnY29tcGxleCdcclxuICAgIC8vIGlmIGNvbXBvdW5kVHlwZSBpcyAnY29tcGFydGVudCdcclxuICAgIC8vIGJlY2F1c2UgdGhlIG9sZCBjb21tb24gcGFyZW50IHdpbGwgYmUgdGhlIHBhcmVudCBvZiB0aGUgbmV3IGNvbXBhcnRtZW50IGFmdGVyIHRoaXMgb3BlcmF0aW9uIGFuZFxyXG4gICAgLy8gJ2NvbXBsZXhlcycgY2Fubm90IGluY2x1ZGUgJ2NvbXBhcnRtZW50cydcclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT0gMCB8fCAhZWxlbWVudFV0aWxpdGllcy5hbGxIYXZlVGhlU2FtZVBhcmVudChub2RlcylcclxuICAgICAgICAgICAgfHwgKCAoY29tcG91bmRUeXBlID09PSAnY29tcGFydG1lbnQnIHx8IGNvbXBvdW5kVHlwZSA9PSAnc3VibWFwJykgJiYgbm9kZXMucGFyZW50KCkuZGF0YSgnY2xhc3MnKVxyXG4gICAgICAgICAgICAmJiBub2Rlcy5wYXJlbnQoKS5kYXRhKCdjbGFzcycpLnN0YXJ0c1dpdGgoJ2NvbXBsZXgnKSApKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY3kudW5kb1JlZG8oKSkge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgY29tcG91bmRUeXBlOiBjb21wb3VuZFR5cGUsXHJcbiAgICAgICAgbm9kZXNUb01ha2VDb21wb3VuZDogbm9kZXNcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXNcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKG5vZGVzLCBjb21wb3VuZFR5cGUpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qXHJcbiAgICogTW92ZSB0aGUgbm9kZXMgdG8gYSBuZXcgcGFyZW50IGFuZCBjaGFuZ2UgdGhlaXIgcG9zaXRpb24gaWYgcG9zc0RpZmYgcGFyYW1zIGFyZSBzZXQuXHJcbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbiBhbmQgY2hlY2tzIGlmIHRoZSBvcGVyYXRpb24gaXMgdmFsaWQuXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgX25ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XHJcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbmV3UGFyZW50ID0gdHlwZW9mIF9uZXdQYXJlbnQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX25ld1BhcmVudCkgOiBfbmV3UGFyZW50O1xyXG4gICAgLy8gTmV3IHBhcmVudCBpcyBzdXBwb3NlZCB0byBiZSBvbmUgb2YgdGhlIHJvb3QsIGEgY29tcGxleCBvciBhIGNvbXBhcnRtZW50XHJcbiAgICBpZiAobmV3UGFyZW50ICYmICFuZXdQYXJlbnQuZGF0YShcImNsYXNzXCIpLnN0YXJ0c1dpdGgoXCJjb21wbGV4XCIpICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgIT0gXCJjb21wYXJ0bWVudFwiXHJcbiAgICAgICAgICAgICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgIT0gXCJzdWJtYXBcIikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvKlxyXG4gICAgICogRWxlbWluYXRlIHRoZSBub2RlcyB3aGljaCBjYW5ub3QgaGF2ZSB0aGUgbmV3UGFyZW50IGFzIHRoZWlyIHBhcmVudFxyXG4gICAgICovXHJcbiAgICBub2RlcyA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCwgaSkge1xyXG4gICAgICBpZih0eXBlb2YgZWxlbWVudCA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgIGVsZW1lbnQgPSBpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XHJcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmlzVmFsaWRQYXJlbnQoc2JnbmNsYXNzLCBuZXdQYXJlbnQsIGVsZW1lbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRGlzY2FyZCB0aGUgbm9kZXMgd2hvc2UgcGFyZW50IGlzIGFscmVhZHkgbmV3UGFyZW50LlxyXG4gICAgLy8gRGlzY2FyZCB0aGUgbmV3UGFyZW50IGl0c2VsZiBpZiBpdCBpcyBhbW9uZyB0aGUgbm9kZXNcclxuICAgIG5vZGVzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGUsIGkpIHtcclxuICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgIGVsZSA9IGk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIERpc2NhcmQgdGhlIG5ld1BhcmVudCBpZiBpdCBpcyBhbW9uZyB0aGUgbm9kZXNcclxuICAgICAgaWYgKG5ld1BhcmVudCAmJiBlbGUuaWQoKSA9PT0gbmV3UGFyZW50LmlkKCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgLy8gRGlzY2FyZCB0aGUgbm9kZXMgd2hvc2UgcGFyZW50IGlzIGFscmVhZHkgbmV3UGFyZW50XHJcbiAgICAgIGlmICghbmV3UGFyZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBlbGUuZGF0YSgncGFyZW50JykgIT09IG5ld1BhcmVudC5pZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gSWYgc29tZSBub2RlcyBhcmUgYW5jZXN0b3Igb2YgbmV3IHBhcmVudCBlbGVtaW5hdGUgdGhlbVxyXG4gICAgaWYgKG5ld1BhcmVudCkge1xyXG4gICAgICBub2RlcyA9IG5vZGVzLmRpZmZlcmVuY2UobmV3UGFyZW50LmFuY2VzdG9ycygpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJZiBhbGwgbm9kZXMgYXJlIGVsZW1pbmF0ZWQgcmV0dXJuIGRpcmVjdGx5XHJcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBKdXN0IG1vdmUgdGhlIHRvcCBtb3N0IG5vZGVzXHJcbiAgICBub2RlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcclxuXHJcbiAgICB2YXIgcGFyZW50SWQgPSBuZXdQYXJlbnQgPyBuZXdQYXJlbnQuaWQoKSA6IG51bGw7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZSxcclxuICAgICAgICBwYXJlbnREYXRhOiBwYXJlbnRJZCwgLy8gSXQga2VlcHMgdGhlIG5ld1BhcmVudElkIChKdXN0IGFuIGlkIGZvciBlYWNoIG5vZGVzIGZvciB0aGUgZmlyc3QgdGltZSlcclxuICAgICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgICAgcG9zRGlmZlg6IHBvc0RpZmZYLFxyXG4gICAgICAgIHBvc0RpZmZZOiBwb3NEaWZmWSxcclxuICAgICAgICAvLyBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBjaGFuZ2VQYXJlbnQgZnVuY3Rpb24gY2FsbGVkIGlzIG5vdCBmcm9tIGVsZW1lbnRVdGlsaXRpZXNcclxuICAgICAgICAvLyBidXQgZnJvbSB0aGUgdW5kb1JlZG8gZXh0ZW5zaW9uIGRpcmVjdGx5LCBzbyBtYWludGFpbmluZyBwb2ludGVyIGlzIG5vdCBhdXRvbWF0aWNhbGx5IGRvbmUuXHJcbiAgICAgICAgY2FsbGJhY2s6IGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlUGFyZW50XCIsIHBhcmFtKTsgLy8gVGhpcyBhY3Rpb24gaXMgcmVnaXN0ZXJlZCBieSB1bmRvUmVkbyBleHRlbnNpb25cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudChub2RlcywgcGFyZW50SWQsIHBvc0RpZmZYLCBwb3NEaWZmWSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcclxuICAgKiBpbiB0aGUgY29tcGxleC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIHRoZSBzYW1lIGZ1bmN0aW9uIGluIGVsZW1lbnRVdGlsaXRpZXNcclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAodGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCwgbGF5b3V0UGFyYW0pIHtcclxuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24odGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCwgbGF5b3V0UGFyYW0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICB0ZW1wbGF0ZVR5cGU6IHRlbXBsYXRlVHlwZSxcclxuICAgICAgICBtYWNyb21vbGVjdWxlTGlzdDogbWFjcm9tb2xlY3VsZUxpc3QsXHJcbiAgICAgICAgY29tcGxleE5hbWU6IGNvbXBsZXhOYW1lLFxyXG4gICAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxyXG4gICAgICAgIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLFxyXG4gICAgICAgIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCxcclxuICAgICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoLFxyXG4gICAgICAgIGxheW91dFBhcmFtOiBsYXlvdXRQYXJhbVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgcGFyYW0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qXHJcbiAgICogUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LlxyXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5yZXNpemVOb2RlcyA9IGZ1bmN0aW9uKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbywgcHJlc2VydmVSZWxhdGl2ZVBvcykge1xyXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgICB3aWR0aDogd2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXHJcbiAgICAgICAgdXNlQXNwZWN0UmF0aW86IHVzZUFzcGVjdFJhdGlvLFxyXG4gICAgICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWUsXHJcbiAgICAgICAgcHJlc2VydmVSZWxhdGl2ZVBvczogcHJlc2VydmVSZWxhdGl2ZVBvc1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInJlc2l6ZU5vZGVzXCIsIHBhcmFtKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbyk7XHJcbiAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuXHJcbiAgICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gICAgICovXHJcbiAgICBtYWluVXRpbGl0aWVzLnJlc2l6ZU5vZGVzVG9Db250ZW50ID0gZnVuY3Rpb24obm9kZXMsIHVzZUFzcGVjdFJhdGlvKSB7XHJcbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBcclxuICAgICAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcclxuICAgICAgICAgIG5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluV2lkdGgobm9kZSk7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbkhlaWdodChub2RlKTtcclxuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInJlc2l6ZU5vZGVzXCIsIHBhcmFtOiB7XHJcbiAgICAgICAgICAgICAgICBub2Rlczogbm9kZSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgdXNlQXNwZWN0UmF0aW86IHVzZUFzcGVjdFJhdGlvLFxyXG4gICAgICAgICAgICAgICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHByZXNlcnZlUmVsYXRpdmVQb3M6IHRydWVcclxuICAgICAgICAgICAgfX0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XHJcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBzdGF0ZUFuZEluZm9zLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKGxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgICAgICAgICAgbm9kZTogbm9kZSxcclxuICAgICAgICAgICAgICAgIGxvY2F0aW9uczogW1widG9wXCIsXCJyaWdodFwiLFwiYm90dG9tXCIsXCJsZWZ0XCJdXHJcbiAgICAgICAgICAgICAgfTsgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOlwiZml0VW5pdHNcIixwYXJhbSA6IHBhcmFtfSlcclxuICAgICAgICAgICAgIH1cclxuICBcclxuXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImJhdGNoXCIsIGFjdGlvbnMpO1xyXG4gICAgICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICAgICAgICAgIHJldHVybiBhY3Rpb25zO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcclxuICAgICAgICAgICAgICB2YXIgd2lkdGggPSBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbldpZHRoKG5vZGUpO1xyXG4gICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbkhlaWdodChub2RlKTtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzKG5vZGUsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvLCB0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgLypcclxuICAgKiBDaGFuZ2VzIHRoZSBsYWJlbCBvZiB0aGUgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIGxhYmVsLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlTm9kZUxhYmVsID0gZnVuY3Rpb24obm9kZXMsIGxhYmVsKSB7XHJcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBsYWJlbCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgICBsYWJlbDogbGFiZWwsXHJcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHBhcmFtKTtcclxuICAgIH1cclxuXHJcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gIH07XHJcblxyXG4gIC8qXHJcbiAgICogQ2hhbmdlIGZvbnQgcHJvcGVydGllcyBmb3IgZ2l2ZW4gbm9kZXMgdXNlIHRoZSBnaXZlbiBmb250IGRhdGEuXHJcbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24oZWxlcywgZGF0YSkge1xyXG4gICAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgZWxlczogZWxlcyxcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUZvbnRQcm9wZXJ0aWVzXCIsIHBhcmFtKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBDaGFuZ2Ugc3RhdGUgdmFsdWUgb3IgdW5pdCBvZiBpbmZvcm1hdGlvbiBib3ggb2YgZ2l2ZW4gbm9kZXMgd2l0aCBnaXZlbiBpbmRleC5cclxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBwYXJhbWV0ZXJzIHNlZSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94XHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBpbmRleCwgdmFsdWUsIHR5cGUpIHtcclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIGluZGV4OiBpbmRleCxcclxuICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICBub2Rlczogbm9kZXNcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gobm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICB9O1xyXG5cclxuICAvLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXHJcbiAgLy8gVGhlIGJveCBpcyByZXByZXNlbnRlZCBieSB0aGUgcGFyYW1ldGVyIG9iai5cclxuICAvLyBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gIG1haW5VdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2Rlcywgb2JqKSB7XHJcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveChub2Rlcywgb2JqKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgb2JqOiBvYmosXHJcbiAgICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG5cclxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gUmVtb3ZlIHRoZSBzdGF0ZSBvciBpbmZvIGJveGVzIG9mIHRoZSBnaXZlbiBub2RlcyBhdCBnaXZlbiBpbmRleC5cclxuICAvLyBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gIG1haW5VdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgpIHtcclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94KG5vZGVzLCB7aW5kZXg6IGluZGV4fSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIGxvY2F0aW9uT2JqOiB7aW5kZXg6IGluZGV4fSxcclxuICAgICAgICBub2Rlczogbm9kZXNcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICB9O1xyXG5cclxuXHJcbiAgLy9BcnJhbmdlIGluZm9ybWF0aW9uIGJveGVzXHJcbiAgLy9JZiBmb3JjZSBjaGVjayBpcyB0cnVlLCBpdCByZWFycmFuZ2VzIGFsbCBpbmZvcm1hdGlvbiBib3hlc1xyXG4gIG1haW5VdGlsaXRpZXMuZml0VW5pdHMgPSBmdW5jdGlvbiAobm9kZSwgbG9jYXRpb25zKSB7XHJcbiAgICBpZiAobm9kZS5kYXRhKCdhdXh1bml0bGF5b3V0cycpID09PSB1bmRlZmluZWQgfHwgbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChsb2NhdGlvbnMgPT09IHVuZGVmaW5lZCB8fCBsb2NhdGlvbnMubGVuZ3RoIDw9IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmZpdFVuaXRzKG5vZGUsIGxvY2F0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIG5vZGU6IG5vZGUsXHJcbiAgICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnNcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJmaXRVbml0c1wiLCBwYXJhbSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICB9O1xyXG5cclxuICAvKlxyXG4gICAqIFNldCBtdWx0aW1lciBzdGF0dXMgb2YgdGhlIGdpdmVuIG5vZGVzIHRvIHRoZSBnaXZlbiBzdGF0dXMuXHJcbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24obm9kZXMsIHN0YXR1cykge1xyXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIHN0YXR1czogc3RhdHVzLFxyXG4gICAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCBwYXJhbSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcclxuICAgIH1cclxuXHJcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gIH07XHJcblxyXG4gIC8qXHJcbiAgICogU2V0IGNsb25lIG1hcmtlciBzdGF0dXMgb2YgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cclxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbihub2Rlcywgc3RhdHVzKSB7XHJcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgc3RhdHVzOiBzdGF0dXMsXHJcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHBhcmFtKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBDaGFuZ2Ugc3R5bGUvY3NzIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcclxuICAgKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLmNoYW5nZUNzcyA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XHJcbiAgICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyhlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIGVsZXM6IGVsZXMsXHJcbiAgICAgICAgdmFsdWVNYXA6IHZhbHVlTWFwLFxyXG4gICAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VDc3NcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG5cclxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXHJcbiAgICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcclxuICAgIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlbGVzLCBuYW1lLCB2YWx1ZU1hcCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIGVsZXM6IGVsZXMsXHJcbiAgICAgICAgdmFsdWVNYXA6IHZhbHVlTWFwLFxyXG4gICAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VEYXRhXCIsIHBhcmFtKTtcclxuICAgIH1cclxuXHJcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gIH07XHJcblxyXG4gIG1haW5VdGlsaXRpZXMudXBkYXRlU2V0RmllbGQgPSBmdW5jdGlvbihlbGUsIGZpZWxkTmFtZSwgdG9EZWxldGUsIHRvQWRkLCBjYWxsYmFjaykge1xyXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlbGUsIGZpZWxkTmFtZSwgdG9EZWxldGUsIHRvQWRkLCBjYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIGVsZSxcclxuICAgICAgICBmaWVsZE5hbWUsXHJcbiAgICAgICAgdG9EZWxldGUsXHJcbiAgICAgICAgdG9BZGQsXHJcbiAgICAgICAgY2FsbGJhY2tcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJ1cGRhdGVTZXRGaWVsZFwiLCBwYXJhbSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgbWFpblV0aWxpdGllcy5zZXREZWZhdWx0UHJvcGVydHkgPSBmdW5jdGlvbiggX2NsYXNzLCBuYW1lLCB2YWx1ZSApIHtcclxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICB2YXIgcHJvcE1hcCA9IHt9O1xyXG4gICAgICBwcm9wTWFwWyBuYW1lIF0gPSB2YWx1ZTtcclxuXHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0RGVmYXVsdFByb3BlcnRpZXMoX2NsYXNzLCBwcm9wTWFwKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgY2xhc3M6IF9jbGFzcyxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIHZhbHVlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwic2V0RGVmYXVsdFByb3BlcnR5XCIsIHBhcmFtKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBtYWluVXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hTdHlsZSA9IGZ1bmN0aW9uKCBub2RlLCBpbmRleCwgbmV3UHJvcHMgKSB7XHJcbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVJbmZvYm94U3R5bGUoIG5vZGUsIGluZGV4LCBuZXdQcm9wcyApO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICBub2RlOiBub2RlLFxyXG4gICAgICAgIGluZGV4OiBpbmRleCxcclxuICAgICAgICBuZXdQcm9wczogbmV3UHJvcHNcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJ1cGRhdGVJbmZvYm94U3R5bGVcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG5cclxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgfTtcclxuXHJcbiAgbWFpblV0aWxpdGllcy51cGRhdGVJbmZvYm94T2JqID0gZnVuY3Rpb24oIG5vZGUsIGluZGV4LCBuZXdQcm9wcyApIHtcclxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hPYmooIG5vZGUsIGluZGV4LCBuZXdQcm9wcyApO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICBub2RlOiBub2RlLFxyXG4gICAgICAgIGluZGV4OiBpbmRleCxcclxuICAgICAgICBuZXdQcm9wczogbmV3UHJvcHNcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJ1cGRhdGVJbmZvYm94T2JqXCIsIHBhcmFtKTtcclxuICAgIH1cclxuXHJcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gIH07XHJcblxyXG5cclxuICAvKlxyXG4gICAqIEhpZGVzIGdpdmVuIGVsZXMgKHRoZSBvbmVzIHdoaWNoIGFyZSBzZWxlY3RlZCkgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcclxuICAgKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuaGlkZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihlbGVzLCBsYXlvdXRwYXJhbSkge1xyXG4gICAgICB2YXIgbm9kZXMgPSBlbGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXHJcblxyXG4gICAgICB2YXIgYWxsTm9kZXMgPSBjeS5ub2RlcyhcIjp2aXNpYmxlXCIpO1xyXG4gICAgICB2YXIgbm9kZXNUb1Nob3cgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZFJlbWFpbmluZ05vZGVzKG5vZGVzLCBhbGxOb2Rlcyk7XHJcbiAgICAgIHZhciBub2Rlc1RvSGlkZSA9IGFsbE5vZGVzLm5vdChub2Rlc1RvU2hvdyk7XHJcblxyXG4gICAgICBpZiAobm9kZXNUb0hpZGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG5cclxuICAgICAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcclxuICAgICAgICAgIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcclxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuaGlkZUFuZFBlcmZvcm1MYXlvdXQobm9kZXNUb0hpZGUsIGxheW91dHBhcmFtKTtcclxuICAgICAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcclxuICAgICAgICAgIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICAgICAgICBlbGVzOiBub2Rlc1RvSGlkZSxcclxuICAgICAgICAgICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXHJcbiAgICAgICAgICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKCk7XHJcbiAgICAgICAgICB1ci5hY3Rpb24oXCJ0aGlja2VuQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcik7XHJcbiAgICAgICAgICB1ci5hY3Rpb24oXCJ0aGluQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlcik7XHJcblxyXG4gICAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcclxuICAgICAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygpLmludGVyc2VjdGlvbihub2Rlc1RvSGlkZSk7XHJcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpbkJvcmRlclwiLCBwYXJhbTogbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3J9KTtcclxuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJoaWRlQW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbTogcGFyYW19KTtcclxuICAgICAgICAgIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gbm9kZXNUb0hpZGUubmVpZ2hib3Job29kKFwiOnZpc2libGVcIikubm9kZXMoKS5kaWZmZXJlbmNlKG5vZGVzVG9IaWRlKS5kaWZmZXJlbmNlKGN5Lm5vZGVzKFwiW3RoaWNrQm9yZGVyXVwiKSk7XHJcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpY2tlbkJvcmRlclwiLCBwYXJhbTogbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3J9KTtcclxuICAgICAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJiYXRjaFwiLCBhY3Rpb25zKTtcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIC8qXHJcbiAgICogU2hvd3MgYWxsIGVsZW1lbnRzICh0aGUgb25lcyB3aGljaCBhcmUgaGlkZGVuIGlmIGFueSkgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcclxuICAgKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuc2hvd0FsbEFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihsYXlvdXRwYXJhbSkge1xyXG4gICAgdmFyIGhpZGRlbkVsZXMgPSBjeS5lbGVtZW50cygnOmhpZGRlbicpO1xyXG4gICAgaWYgKGhpZGRlbkVsZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XHJcbiAgICAgIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChoaWRkZW5FbGVzLCBsYXlvdXRwYXJhbSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIGVsZXM6IGhpZGRlbkVsZXMsXHJcbiAgICAgICAgbGF5b3V0cGFyYW06IGxheW91dHBhcmFtLFxyXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyIHVyID0gY3kudW5kb1JlZG8oKTtcclxuICAgICAgdXIuYWN0aW9uKFwidGhpY2tlbkJvcmRlclwiLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlciwgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIpO1xyXG4gICAgICB1ci5hY3Rpb24oXCJ0aGluQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlcik7XHJcblxyXG4gICAgICB2YXIgYWN0aW9ucyA9IFtdO1xyXG4gICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5ub2RlcyhcIlt0aGlja0JvcmRlcl1cIik7XHJcbiAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGluQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcn0pO1xyXG4gICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgcGFyYW06IHBhcmFtfSk7XHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJiYXRjaFwiLCBhY3Rpb25zKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKlxyXG4gICAqIFVuaGlkZSBnaXZlbiBlbGVzICh0aGUgb25lcyB3aGljaCBhcmUgaGlkZGVuIGlmIGFueSkgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcclxuICAgKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihtYWluRWxlLCBlbGVzLCBsYXlvdXRwYXJhbSkge1xyXG4gICAgICB2YXIgaGlkZGVuRWxlcyA9IGVsZXMuZmlsdGVyKCc6aGlkZGVuJyk7XHJcbiAgICAgIGlmIChoaWRkZW5FbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIG1haW5VdGlsaXRpZXMuY2xvc2VVcEVsZW1lbnRzKG1haW5FbGUsIGhpZGRlbkVsZXMubm9kZXMoKSk7XHJcbiAgICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xyXG4gICAgICAgICAgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xyXG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChoaWRkZW5FbGVzLCBsYXlvdXRwYXJhbSk7XHJcbiAgICAgICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XHJcbiAgICAgICAgICBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlcihub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgICAgICAgZWxlczogaGlkZGVuRWxlcyxcclxuICAgICAgICAgICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXHJcbiAgICAgICAgICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKCk7XHJcbiAgICAgICAgICB1ci5hY3Rpb24oXCJ0aGlja2VuQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcik7XHJcbiAgICAgICAgICB1ci5hY3Rpb24oXCJ0aGluQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlcik7XHJcblxyXG4gICAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcclxuICAgICAgICAgIHZhciBub2Rlc1RvVGhpbkJvcmRlciA9IChoaWRkZW5FbGVzLm5laWdoYm9yaG9vZChcIjp2aXNpYmxlXCIpLm5vZGVzKFwiW3RoaWNrQm9yZGVyXVwiKSlcclxuICAgICAgICAgICAgICAgICAgLmRpZmZlcmVuY2UoY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcy5lZGdlcygpLnVuaW9uKGhpZGRlbkVsZXMubm9kZXMoKS5jb25uZWN0ZWRFZGdlcygpKSkuY29ubmVjdGVkTm9kZXMoKSk7XHJcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpbkJvcmRlclwiLCBwYXJhbTogbm9kZXNUb1RoaW5Cb3JkZXJ9KTtcclxuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbTogcGFyYW19KTtcclxuICAgICAgICAgIHZhciBub2Rlc1RvVGhpY2tlbkJvcmRlciA9IGhpZGRlbkVsZXMubm9kZXMoKS5lZGdlc1dpdGgoY3kubm9kZXMoXCI6aGlkZGVuXCIpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcy5ub2RlcygpKSlcclxuICBcdCAgICAgICAgICAgIC5jb25uZWN0ZWROb2RlcygpLmludGVyc2VjdGlvbihoaWRkZW5FbGVzLm5vZGVzKCkpO1xyXG4gICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInRoaWNrZW5Cb3JkZXJcIiwgcGFyYW06IG5vZGVzVG9UaGlja2VuQm9yZGVyfSk7XHJcbiAgICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiYmF0Y2hcIiwgYWN0aW9ucyk7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICAvKlxyXG4gICogVGFrZXMgdGhlIGhpZGRlbiBlbGVtZW50cyBjbG9zZSB0byB0aGUgbm9kZXMgd2hvc2UgbmVpZ2hib3JzIHdpbGwgYmUgc2hvd25cclxuICAqICovXHJcbiAgbWFpblV0aWxpdGllcy5jbG9zZVVwRWxlbWVudHMgPSBmdW5jdGlvbihtYWluRWxlLCBoaWRkZW5FbGVzKSB7XHJcbiAgICAgIHZhciBsZWZ0WCA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgIHZhciByaWdodFggPSBOdW1iZXIuTUlOX1ZBTFVFO1xyXG4gICAgICB2YXIgdG9wWSA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICAgIHZhciBib3R0b21ZID0gTnVtYmVyLk1JTl9WQUxVRTtcclxuICAgICAgLy8gQ2hlY2sgdGhlIHggYW5kIHkgbGltaXRzIG9mIGFsbCBoaWRkZW4gZWxlbWVudHMgYW5kIHN0b3JlIHRoZW0gaW4gdGhlIHZhcmlhYmxlcyBhYm92ZVxyXG4gICAgICBoaWRkZW5FbGVzLmZvckVhY2goZnVuY3Rpb24oIGVsZSApe1xyXG4gICAgICAgICAgaWYgKGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wYXJ0bWVudCcgJiYgIGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wbGV4JylcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB2YXIgaGFsZldpZHRoID0gZWxlLm91dGVyV2lkdGgoKS8yO1xyXG4gICAgICAgICAgICAgIHZhciBoYWxmSGVpZ2h0ID0gZWxlLm91dGVySGVpZ2h0KCkvMjtcclxuICAgICAgICAgICAgICBpZiAoZWxlLnBvc2l0aW9uKFwieFwiKSAtIGhhbGZXaWR0aCA8IGxlZnRYKVxyXG4gICAgICAgICAgICAgICAgICBsZWZ0WCA9IGVsZS5wb3NpdGlvbihcInhcIikgLSBoYWxmV2lkdGg7XHJcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgKyBoYWxmV2lkdGggPiByaWdodFgpXHJcbiAgICAgICAgICAgICAgICAgIHJpZ2h0WCA9IGVsZS5wb3NpdGlvbihcInhcIikgKyBoYWxmV2lkdGg7XHJcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInlcIikgLSBoYWxmSGVpZ2h0IDwgdG9wWSlcclxuICAgICAgICAgICAgICAgICAgdG9wWSA9IGVsZS5wb3NpdGlvbihcInlcIikgLSBoYWxmSGVpZ2h0O1xyXG4gICAgICAgICAgICAgIGlmIChlbGUucG9zaXRpb24oXCJ5XCIpICsgaGFsZkhlaWdodCA+IHRvcFkpXHJcbiAgICAgICAgICAgICAgICAgIGJvdHRvbVkgPSBlbGUucG9zaXRpb24oXCJ5XCIpICsgaGFsZkhlaWdodDtcclxuICAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvL1RoZSBjb29yZGluYXRlcyBvZiB0aGUgb2xkIGNlbnRlciBjb250YWluaW5nIHRoZSBoaWRkZW4gbm9kZXNcclxuICAgICAgdmFyIG9sZENlbnRlclggPSAobGVmdFggKyByaWdodFgpLzI7XHJcbiAgICAgIHZhciBvbGRDZW50ZXJZID0gKHRvcFkgKyBib3R0b21ZKS8yO1xyXG5cclxuICAgICAgLy9IZXJlIHdlIGNhbGN1bGF0ZSB0d28gcGFyYW1ldGVycyB3aGljaCBkZWZpbmUgdGhlIGFyZWEgaW4gd2hpY2ggdGhlIGhpZGRlbiBlbGVtZW50cyBhcmUgcGxhY2VkIGluaXRpYWxseVxyXG4gICAgICB2YXIgbWluSG9yaXpvbnRhbFBhcmFtID0gbWFpbkVsZS5vdXRlcldpZHRoKCkvMiArIChyaWdodFggLSBsZWZ0WCkvMjtcclxuICAgICAgdmFyIG1heEhvcml6b250YWxQYXJhbSA9IG1haW5FbGUub3V0ZXJXaWR0aCgpICsgKHJpZ2h0WCAtIGxlZnRYKS8yO1xyXG4gICAgICB2YXIgbWluVmVydGljYWxQYXJhbSA9IG1haW5FbGUub3V0ZXJIZWlnaHQoKS8yICsgKGJvdHRvbVkgLSB0b3BZKS8yO1xyXG4gICAgICB2YXIgbWF4VmVydGljYWxQYXJhbSA9IG1haW5FbGUub3V0ZXJIZWlnaHQoKSArIChib3R0b21ZIC0gdG9wWSkvMjtcclxuXHJcbiAgICAgIC8vUXVhZHJhbnRzIGlzIGFuIG9iamVjdCBvZiB0aGUgZm9ybSB7Zmlyc3Q6XCJvYnRhaW5lZFwiLCBzZWNvbmQ6XCJmcmVlXCIsIHRoaXJkOlwiZnJlZVwiLCBmb3VydGg6XCJvYnRhaW5lZFwifVxyXG4gICAgICAvLyB3aGljaCBob2xkcyB3aGljaCBxdWFkcmFudCBhcmUgZnJlZSAodGhhdCdzIHdoZXJlIGhpZGRlbiBub2RlcyB3aWxsIGJlIGJyb3VnaHQpXHJcbiAgICAgIHZhciBxdWFkcmFudHMgPSBtYWluVXRpbGl0aWVzLmNoZWNrT2NjdXBpZWRRdWFkcmFudHMobWFpbkVsZSwgaGlkZGVuRWxlcyk7XHJcbiAgICAgIHZhciBmcmVlUXVhZHJhbnRzID0gW107XHJcbiAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHF1YWRyYW50cykge1xyXG4gICAgICAgICAgaWYgKHF1YWRyYW50c1twcm9wZXJ0eV0gPT09IFwiZnJlZVwiKVxyXG4gICAgICAgICAgICAgIGZyZWVRdWFkcmFudHMucHVzaChwcm9wZXJ0eSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vQ2FuIHRha2UgdmFsdWVzIDEgYW5kIC0xIGFuZCBhcmUgdXNlZCB0byBwbGFjZSB0aGUgaGlkZGVuIG5vZGVzIGluIHRoZSByYW5kb20gcXVhZHJhbnRcclxuICAgICAgdmFyIGhvcml6b250YWxNdWx0O1xyXG4gICAgICB2YXIgdmVydGljYWxNdWx0O1xyXG4gICAgICBpZiAoZnJlZVF1YWRyYW50cy5sZW5ndGggPiAwKVxyXG4gICAgICB7XHJcbiAgICAgICAgaWYgKGZyZWVRdWFkcmFudHMubGVuZ3RoID09PSAzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlmIChmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmaXJzdCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3NlY29uZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3RoaXJkJykpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gLTE7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IC0xO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAoZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnZmlyc3QnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdzZWNvbmQnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmb3VydGgnKSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAxO1xyXG4gICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAtMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYgKGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZpcnN0JykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygndGhpcmQnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmb3VydGgnKSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAxO1xyXG4gICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAoZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnc2Vjb25kJykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygndGhpcmQnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmb3VydGgnKSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAtMTtcclxuICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIC8vUmFuZG9tbHkgcGlja3Mgb25lIHF1YWRyYW50IGZyb20gdGhlIGZyZWUgcXVhZHJhbnRzXHJcbiAgICAgICAgICB2YXIgcmFuZG9tUXVhZHJhbnQgPSBmcmVlUXVhZHJhbnRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpmcmVlUXVhZHJhbnRzLmxlbmd0aCldO1xyXG5cclxuICAgICAgICAgIGlmIChyYW5kb21RdWFkcmFudCA9PT0gXCJmaXJzdFwiKSB7XHJcbiAgICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAxO1xyXG4gICAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IC0xO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAocmFuZG9tUXVhZHJhbnQgPT09IFwic2Vjb25kXCIpIHtcclxuICAgICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IC0xO1xyXG4gICAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IC0xO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAocmFuZG9tUXVhZHJhbnQgPT09IFwidGhpcmRcIikge1xyXG4gICAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gLTE7XHJcbiAgICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYgKHJhbmRvbVF1YWRyYW50ID09PSBcImZvdXJ0aFwiKSB7XHJcbiAgICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAxO1xyXG4gICAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IDE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAge1xyXG4gICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAwO1xyXG4gICAgICAgICAgdmVydGljYWxNdWx0ID0gMDtcclxuICAgICAgfVxyXG4gICAgICAvLyBJZiB0aGUgaG9yaXpvbnRhbE11bHQgaXMgMCBpdCBtZWFucyB0aGF0IG5vIHF1YWRyYW50IGlzIGZyZWUsIHNvIHdlIHJhbmRvbWx5IGNob29zZSBhIHF1YWRyYW50XHJcbiAgICAgIHZhciBob3Jpem9udGFsUGFyYW0gPSBtYWluVXRpbGl0aWVzLmdlbmVyYXRlUmFuZG9tKG1pbkhvcml6b250YWxQYXJhbSxtYXhIb3Jpem9udGFsUGFyYW0saG9yaXpvbnRhbE11bHQpO1xyXG4gICAgICB2YXIgdmVydGljYWxQYXJhbSA9IG1haW5VdGlsaXRpZXMuZ2VuZXJhdGVSYW5kb20obWluVmVydGljYWxQYXJhbSxtYXhWZXJ0aWNhbFBhcmFtLHZlcnRpY2FsTXVsdCk7XHJcblxyXG4gICAgICAvL1RoZSBjb29yZGluYXRlcyBvZiB0aGUgY2VudGVyIHdoZXJlIHRoZSBoaWRkZW4gbm9kZXMgd2lsbCBiZSB0cmFuc2ZlcmVkXHJcbiAgICAgIHZhciBuZXdDZW50ZXJYID0gbWFpbkVsZS5wb3NpdGlvbihcInhcIikgKyBob3Jpem9udGFsUGFyYW07XHJcbiAgICAgIHZhciBuZXdDZW50ZXJZID0gbWFpbkVsZS5wb3NpdGlvbihcInlcIikgKyB2ZXJ0aWNhbFBhcmFtO1xyXG5cclxuICAgICAgdmFyIHhkaWZmID0gbmV3Q2VudGVyWCAtIG9sZENlbnRlclg7XHJcbiAgICAgIHZhciB5ZGlmZiA9IG5ld0NlbnRlclkgLSBvbGRDZW50ZXJZO1xyXG5cclxuICAgICAgLy9DaGFuZ2UgdGhlIHBvc2l0aW9uIG9mIGhpZGRlbiBlbGVtZW50c1xyXG4gICAgICBoaWRkZW5FbGVzLmZvckVhY2goZnVuY3Rpb24oIGVsZSApe1xyXG4gICAgICAgICAgdmFyIG5ld3ggPSBlbGUucG9zaXRpb24oXCJ4XCIpICsgeGRpZmY7XHJcbiAgICAgICAgICB2YXIgbmV3eSA9IGVsZS5wb3NpdGlvbihcInlcIikgKyB5ZGlmZjtcclxuICAgICAgICAgIGVsZS5wb3NpdGlvbihcInhcIiwgbmV3eCk7XHJcbiAgICAgICAgICBlbGUucG9zaXRpb24oXCJ5XCIsbmV3eSk7XHJcbiAgICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIC8qXHJcbiAgICogR2VuZXJhdGVzIGEgbnVtYmVyIGJldHdlZW4gMiBuciBhbmQgbXVsdGltcGxpZXMgaXQgd2l0aCAxIG9yIC0xXHJcbiAgICogKi9cclxuICBtYWluVXRpbGl0aWVzLmdlbmVyYXRlUmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgsIG11bHQpIHtcclxuICAgICAgdmFyIHZhbCA9IFstMSwxXTtcclxuICAgICAgaWYgKG11bHQgPT09IDApXHJcbiAgICAgICAgICBtdWx0ID0gdmFsW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSp2YWwubGVuZ3RoKV07XHJcbiAgICAgIHJldHVybiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbikgKiBtdWx0O1xyXG4gIH07XHJcblxyXG4gIC8qXHJcbiAgICogVGhpcyBmdW5jdGlvbiBtYWtlcyBzdXJlIHRoYXQgdGhlIHJhbmRvbSBudW1iZXIgbGllcyBpbiBmcmVlIHF1YWRyYW50XHJcbiAgICogKi9cclxuICBtYWluVXRpbGl0aWVzLmNoZWNrT2NjdXBpZWRRdWFkcmFudHMgPSBmdW5jdGlvbihtYWluRWxlLCBoaWRkZW5FbGVzKSB7XHJcbiAgICAgIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSA9PSAnUEQnKVxyXG4gICAgICB7XHJcbiAgICAgICAgdmFyIHZpc2libGVOZWlnaGJvckVsZXMgPSBtYWluRWxlLm5laWdoYm9yaG9vZCgpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcykubm9kZXMoKTtcclxuICAgICAgICB2YXIgdmlzaWJsZU5laWdoYm9yc09mTmVpZ2hib3JzID0gdmlzaWJsZU5laWdoYm9yRWxlcy5uZWlnaGJvcmhvb2QoKS5kaWZmZXJlbmNlKGhpZGRlbkVsZXMpLmRpZmZlcmVuY2UobWFpbkVsZSkubm9kZXMoKTtcclxuICAgICAgICB2YXIgdmlzaWJsZUVsZXMgPSB2aXNpYmxlTmVpZ2hib3JFbGVzLnVuaW9uKHZpc2libGVOZWlnaGJvcnNPZk5laWdoYm9ycyk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICAgIHZhciB2aXNpYmxlRWxlcyA9IG1haW5FbGUubmVpZ2hib3Job29kKCkuZGlmZmVyZW5jZShoaWRkZW5FbGVzKS5ub2RlcygpO1xyXG4gICAgICB2YXIgb2NjdXBpZWRRdWFkcmFudHMgPSB7Zmlyc3Q6XCJmcmVlXCIsIHNlY29uZDpcImZyZWVcIiwgdGhpcmQ6XCJmcmVlXCIsIGZvdXJ0aDpcImZyZWVcIn07XHJcblxyXG4gICAgICB2aXNpYmxlRWxlcy5mb3JFYWNoKGZ1bmN0aW9uKCBlbGUgKXtcclxuICAgICAgICAgIGlmIChlbGUuZGF0YSgnY2xhc3MnKSAhPSAnY29tcGFydG1lbnQnICYmICBlbGUuZGF0YSgnY2xhc3MnKSAhPSAnY29tcGxleCcpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgPCBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSAmJiBlbGUucG9zaXRpb24oXCJ5XCIpIDwgbWFpbkVsZS5wb3NpdGlvbihcInlcIikpXHJcbiAgICAgICAgICAgICAgICAgIG9jY3VwaWVkUXVhZHJhbnRzLnNlY29uZCA9IFwib2NjdXBpZWRcIjtcclxuICAgICAgICAgICAgICBlbHNlIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpID4gbWFpbkVsZS5wb3NpdGlvbihcInhcIikgJiYgZWxlLnBvc2l0aW9uKFwieVwiKSA8IG1haW5FbGUucG9zaXRpb24oXCJ5XCIpKVxyXG4gICAgICAgICAgICAgICAgICBvY2N1cGllZFF1YWRyYW50cy5maXJzdCA9IFwib2NjdXBpZWRcIjtcclxuICAgICAgICAgICAgICBlbHNlIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpIDwgbWFpbkVsZS5wb3NpdGlvbihcInhcIikgJiYgZWxlLnBvc2l0aW9uKFwieVwiKSA+IG1haW5FbGUucG9zaXRpb24oXCJ5XCIpKVxyXG4gICAgICAgICAgICAgICAgICBvY2N1cGllZFF1YWRyYW50cy50aGlyZCA9IFwib2NjdXBpZWRcIjtcclxuICAgICAgICAgICAgICBlbHNlIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpID4gbWFpbkVsZS5wb3NpdGlvbihcInhcIikgJiYgZWxlLnBvc2l0aW9uKFwieVwiKSA+IG1haW5FbGUucG9zaXRpb24oXCJ5XCIpKVxyXG4gICAgICAgICAgICAgICAgICBvY2N1cGllZFF1YWRyYW50cy5mb3VydGggPSBcIm9jY3VwaWVkXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gb2NjdXBpZWRRdWFkcmFudHM7XHJcbiAgfTtcclxuXHJcbiAgLy8gT3ZlcnJpZGVzIGhpZ2hsaWdodFByb2Nlc3NlcyBmcm9tIFNCR05WSVogLSBkbyBub3QgaGlnaGxpZ2h0IGFueSBub2RlcyB3aGVuIHRoZSBtYXAgdHlwZSBpcyBBRlxyXG4gIG1haW5VdGlsaXRpZXMuaGlnaGxpZ2h0UHJvY2Vzc2VzID0gZnVuY3Rpb24oX25vZGVzKSB7XHJcbiAgICBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gXCJBRlwiKVxyXG4gICAgICByZXR1cm47XHJcbiAgICBzYmdudml6SW5zdGFuY2UuaGlnaGxpZ2h0UHJvY2Vzc2VzKF9ub2Rlcyk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVzZXRzIG1hcCB0eXBlIHRvIHVuZGVmaW5lZFxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMucmVzZXRNYXBUeXBlID0gZnVuY3Rpb24oKXtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzZXRNYXBUeXBlKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogcmV0dXJuIDogbWFwIHR5cGVcclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLmdldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpO1xyXG4gIH07XHJcblxyXG4gIG1haW5VdGlsaXRpZXMuYWRkQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24obm9kZXMsIGJnT2JqLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKXtcclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDAgfHwgIWJnT2JqKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBiZ09ialsnZmlyc3RUaW1lJ10gPSB0cnVlO1xyXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIGJnT2JqOiBiZ09iaixcclxuICAgICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgICAgdXBkYXRlSW5mbzogdXBkYXRlSW5mbyxcclxuICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2U6IHByb21wdEludmFsaWRJbWFnZSxcclxuICAgICAgICB2YWxpZGF0ZVVSTDogdmFsaWRhdGVVUkwsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkQmFja2dyb3VuZEltYWdlXCIsIHBhcmFtKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEJhY2tncm91bmRJbWFnZShub2RlcywgYmdPYmosIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpO1xyXG4gICAgfVxyXG5cclxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICBtYWluVXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uKG5vZGVzLCBiZ09iail7XHJcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwIHx8ICFiZ09iaikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgYmdPYmpbJ2ZpcnN0VGltZSddID0gdHJ1ZTtcclxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICBiZ09iajogYmdPYmosXHJcbiAgICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwicmVtb3ZlQmFja2dyb3VuZEltYWdlXCIsIHBhcmFtKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZShub2RlcywgYmdPYmopO1xyXG4gICAgfVxyXG5cclxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICBtYWluVXRpbGl0aWVzLnVwZGF0ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uKG5vZGVzLCBiZ09iail7XHJcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwIHx8ICFiZ09iaikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIGJnT2JqOiBiZ09iaixcclxuICAgICAgICBub2Rlczogbm9kZXNcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJ1cGRhdGVCYWNrZ3JvdW5kSW1hZ2VcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlQmFja2dyb3VuZEltYWdlKG5vZGVzLCBiZ09iaik7XHJcbiAgICB9XHJcblxyXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICB9XHJcblxyXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24obm9kZXMsIG9sZEltZywgbmV3SW1nLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKXtcclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDAgfHwgIW9sZEltZyB8fCAhbmV3SW1nKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgb2xkSW1nOiBvbGRJbWcsXHJcbiAgICAgICAgbmV3SW1nOiBuZXdJbWcsXHJcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZSxcclxuICAgICAgICB1cGRhdGVJbmZvOiB1cGRhdGVJbmZvLFxyXG4gICAgICAgIHByb21wdEludmFsaWRJbWFnZTogcHJvbXB0SW52YWxpZEltYWdlLFxyXG4gICAgICAgIHZhbGlkYXRlVVJMOiB2YWxpZGF0ZVVSTFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUJhY2tncm91bmRJbWFnZVwiLCBwYXJhbSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIG9sZEltZywgbmV3SW1nLCB0cnVlLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKTtcclxuICAgIH1cclxuXHJcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG1haW5VdGlsaXRpZXM7XHJcbn07XHJcbiIsIi8qXHJcbiAqICBFeHRlbmQgZGVmYXVsdCBvcHRpb25zIGFuZCBnZXQgY3VycmVudCBvcHRpb25zIGJ5IHVzaW5nIHRoaXMgZmlsZVxyXG4gKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAvLyBkZWZhdWx0IG9wdGlvbnNcclxuICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWxcclxuICAgIC8vIGZpbGUgYW5kIG5vZGVfbW9kdWxlcyBhcmUgdW5kZXIgdGhlIHNhbWUgZm9sZGVyIHRoZW4gdXNpbmcgdGhlIGRlZmF1bHQgdmFsdWUgaXMgZmluZVxyXG4gICAgaW1nUGF0aDogJ25vZGVfbW9kdWxlcy9zYmdudml6L3NyYy9pbWcnLFxyXG4gICAgLy8gV2hldGhlciB0byBmaXQgbGFiZWxzIHRvIG5vZGVzXHJcbiAgICBmaXRMYWJlbHNUb05vZGVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBmaXRMYWJlbHNUb0luZm9ib3hlczogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgLy8gZHluYW1pYyBsYWJlbCBzaXplIGl0IG1heSBiZSAnc21hbGwnLCAncmVndWxhcicsICdsYXJnZSdcclxuICAgIGR5bmFtaWNMYWJlbFNpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuICdyZWd1bGFyJztcclxuICAgIH0sXHJcbiAgICAvLyBXaGV0aGVyIHRvIGluZmVyIG5lc3Rpbmcgb24gbG9hZCBcclxuICAgIGluZmVyTmVzdGluZ09uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgLy8gcGVyY2VudGFnZSB1c2VkIHRvIGNhbGN1bGF0ZSBjb21wb3VuZCBwYWRkaW5nc1xyXG4gICAgY29tcG91bmRQYWRkaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiAxMDtcclxuICAgIH0sXHJcbiAgICAvLyBUaGUgc2VsZWN0b3Igb2YgdGhlIGNvbXBvbmVudCBjb250YWluaW5nIHRoZSBzYmduIG5ldHdvcmtcclxuICAgIG5ldHdvcmtDb250YWluZXJTZWxlY3RvcjogJyNzYmduLW5ldHdvcmstY29udGFpbmVyJyxcclxuICAgIC8vIFdoZXRoZXIgdGhlIGFjdGlvbnMgYXJlIHVuZG9hYmxlLCByZXF1aXJlcyBjeXRvc2NhcGUtdW5kby1yZWRvIGV4dGVuc2lvblxyXG4gICAgdW5kb2FibGU6IHRydWUsXHJcbiAgICAvLyBXaGV0aGVyIHRvIGhhdmUgdW5kb2FibGUgZHJhZyBmZWF0dXJlIGluIHVuZG8vcmVkbyBleHRlbnNpb24uIFRoaXMgb3B0aW9ucyB3aWxsIGJlIHBhc3NlZCB0byB1bmRvL3JlZG8gZXh0ZW5zaW9uXHJcbiAgICB1bmRvYWJsZURyYWc6IHRydWVcclxuICB9O1xyXG5cclxuICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gZnVuY3Rpb24gKCkge1xyXG4gIH07XHJcblxyXG4gIC8vIEV4dGVuZCB0aGUgZGVmYXVsdHMgb3B0aW9ucyB3aXRoIHRoZSB1c2VyIG9wdGlvbnNcclxuICBvcHRpb25VdGlsaXRpZXMuZXh0ZW5kT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcblxyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xyXG4gICAgICByZXN1bHRbcHJvcF0gPSBkZWZhdWx0c1twcm9wXTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBwcm9wIGluIG9wdGlvbnMpIHtcclxuICAgICAgcmVzdWx0W3Byb3BdID0gb3B0aW9uc1twcm9wXTtcclxuICAgIH1cclxuXHJcbiAgICBvcHRpb25VdGlsaXRpZXMub3B0aW9ucyA9IHJlc3VsdDtcclxuXHJcbiAgICByZXR1cm4gb3B0aW9ucztcclxuICB9O1xyXG5cclxuICBvcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBvcHRpb25VdGlsaXRpZXMub3B0aW9ucztcclxuICB9O1xyXG5cclxuICByZXR1cm4gb3B0aW9uVXRpbGl0aWVzO1xyXG59O1xyXG4iLCJ2YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxudmFyICQgPSBsaWJzLmpRdWVyeTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMsIG9wdGlvbnMsIGN5O1xyXG5cclxuICB2YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHBhcmFtLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xyXG4gICAgb3B0aW9ucyA9IHBhcmFtLm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XHJcbiAgICBjeSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRDeSgpO1xyXG5cclxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY3JlYXRlIHVuZG8tcmVkbyBpbnN0YW5jZVxyXG4gICAgdmFyIHVyID0gY3kudW5kb1JlZG8oe1xyXG4gICAgICB1bmRvYWJsZURyYWc6IG9wdGlvbnMudW5kb2FibGVEcmFnXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyByZWdpc3RlciBhZGQgcmVtb3ZlIGFjdGlvbnNcclxuICAgIHVyLmFjdGlvbihcImFkZE5vZGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XHJcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU2ltcGxlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcclxuICAgIHVyLmFjdGlvbihcImFkZEVkZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XHJcbiAgICB1ci5hY3Rpb24oXCJhZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XHJcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVFbGVzU21hcnRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NtYXJ0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlRWxlcyk7XHJcbiAgICB1ci5hY3Rpb24oXCJjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMpO1xyXG5cclxuICAgIC8vIHJlZ2lzdGVyIGdlbmVyYWwgYWN0aW9uc1xyXG4gICAgdXIuYWN0aW9uKFwicmVzaXplTm9kZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzKTtcclxuICAgIHVyLmFjdGlvbihcImNoYW5nZU5vZGVMYWJlbFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCk7XHJcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VEYXRhXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEpO1xyXG4gICAgdXIuYWN0aW9uKFwidXBkYXRlU2V0RmllbGRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlU2V0RmllbGQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZVNldEZpZWxkKTtcclxuICAgIHVyLmFjdGlvbihcImNoYW5nZUNzc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcyk7XHJcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VCZW5kUG9pbnRzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJlbmRQb2ludHMpO1xyXG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKTtcclxuICAgIHVyLmFjdGlvbihcInNob3dBbmRQZXJmb3JtTGF5b3V0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNob3dBbmRQZXJmb3JtTGF5b3V0LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvU2hvd0FuZFBlcmZvcm1MYXlvdXQpO1xyXG4gICAgdXIuYWN0aW9uKFwiaGlkZUFuZFBlcmZvcm1MYXlvdXRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuaGlkZUFuZFBlcmZvcm1MYXlvdXQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9IaWRlQW5kUGVyZm9ybUxheW91dCk7XHJcbiAgICB1ci5hY3Rpb24oXCJhcHBseVNJRlRvcG9sb2d5R3JvdXBpbmdcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYXBwbHlTSUZUb3BvbG9neUdyb3VwaW5nLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hcHBseVNJRlRvcG9sb2d5R3JvdXBpbmcpO1xyXG5cclxuICAgIC8vIHJlZ2lzdGVyIFNCR04gYWN0aW9uc1xyXG4gICAgdXIuYWN0aW9uKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94KTtcclxuICAgIHVyLmFjdGlvbihcImNoYW5nZVN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCk7XHJcbiAgICB1ci5hY3Rpb24oXCJzZXRNdWx0aW1lclN0YXR1c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMpO1xyXG4gICAgdXIuYWN0aW9uKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzKTtcclxuICAgIHVyLmFjdGlvbihcInJlbW92ZVN0YXRlT3JJbmZvQm94XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCk7XHJcbiAgICB1ci5hY3Rpb24oXCJmaXRVbml0c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5maXRVbml0cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZVVuaXRzKTtcclxuICAgIHVyLmFjdGlvbihcImFkZEJhY2tncm91bmRJbWFnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRCYWNrZ3JvdW5kSW1hZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZUJhY2tncm91bmRJbWFnZSk7XHJcbiAgICB1ci5hY3Rpb24oXCJyZW1vdmVCYWNrZ3JvdW5kSW1hZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlQmFja2dyb3VuZEltYWdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRCYWNrZ3JvdW5kSW1hZ2UpO1xyXG4gICAgdXIuYWN0aW9uKFwidXBkYXRlQmFja2dyb3VuZEltYWdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUJhY2tncm91bmRJbWFnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlQmFja2dyb3VuZEltYWdlKTtcclxuICAgIHVyLmFjdGlvbihcImNoYW5nZUJhY2tncm91bmRJbWFnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJhY2tncm91bmRJbWFnZSk7XHJcbiAgICB1ci5hY3Rpb24oXCJ1cGRhdGVJbmZvYm94U3R5bGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlSW5mb2JveFN0eWxlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94U3R5bGUpO1xyXG4gICAgdXIuYWN0aW9uKFwidXBkYXRlSW5mb2JveE9ialwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94T2JqLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94T2JqKTtcclxuXHJcbiAgICAvLyByZWdpc3RlciBlYXN5IGNyZWF0aW9uIGFjdGlvbnNcclxuICAgIHVyLmFjdGlvbihcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XHJcbiAgICB1ci5hY3Rpb24oXCJzZXREZWZhdWx0UHJvcGVydHlcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5LCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHkpO1xyXG4gICAgdXIuYWN0aW9uKFwiY29udmVydEludG9SZXZlcnNpYmxlUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY29udmVydEludG9SZXZlcnNpYmxlUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNvbnZlcnRJbnRvUmV2ZXJzaWJsZVJlYWN0aW9uKTtcclxuXHJcbiAgICB1ci5hY3Rpb24oXCJtb3ZlRWRnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5tb3ZlRWRnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMubW92ZUVkZ2UpO1xyXG4gICAgdXIuYWN0aW9uKFwiZml4RXJyb3JcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZml4RXJyb3IsdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5maXhFcnJvcik7XHJcbiAgICB1ci5hY3Rpb24oXCJjbG9uZUhpZ2hEZWdyZWVOb2RlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNsb25lSGlnaERlZ3JlZU5vZGUsdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5DbG9uZUhpZ2hEZWdyZWVOb2RlKTtcclxuXHJcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VNYXBUeXBlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU1hcFR5cGUsdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTWFwVHlwZSk7XHJcbiAgICB1ci5hY3Rpb24oXCJzZXRDb21wb3VuZFBhZGRpbmdcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q29tcG91bmRQYWRkaW5nLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDb21wb3VuZFBhZGRpbmcpO1xyXG5cclxuICB9O1xyXG5cclxuICByZXR1cm4gcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnM7XHJcbn07XHJcbiIsInZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gIHZhciBpbnN0YW5jZTtcclxuXHJcbiAgZnVuY3Rpb24gc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzIChvcHRpb25zKSB7XHJcblxyXG4gICAgaW5zdGFuY2UgPSBsaWJzLnNiZ252aXoob3B0aW9ucyk7XHJcblxyXG4gICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gIH1cclxuXHJcbiAgc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5nZXRDeSgpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcztcclxufTtcclxuIiwidmFyIGlzRXF1YWwgPSByZXF1aXJlKCdsb2Rhc2guaXNlcXVhbCcpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgdmFyIGN5LCBlbGVtZW50VXRpbGl0aWVzO1xyXG4gIHZhciBncm91cENvbXBvdW5kVHlwZSwgbWV0YUVkZ2VJZGVudGlmaWVyLCBsb2NrR3JhcGhUb3BvbG9neSwgc2hvdWxkQXBwbHk7XHJcblxyXG4gIHZhciBERUZBVUxUX0dST1VQX0NPTVBPVU5EX1RZUEUgPSAndG9wb2xvZ3kgZ3JvdXAnO1xyXG4gIHZhciBFREdFX1NUWUxFX05BTUVTID0gWyAnbGluZS1jb2xvcicsICd3aWR0aCcgXTtcclxuXHJcbiAgZnVuY3Rpb24gdG9wb2xvZ3lHcm91cGluZyggcGFyYW0sIHByb3BzICkge1xyXG4gICAgY3kgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0Q3koKVxyXG4gICAgZWxlbWVudFV0aWxpdGllcyA9IHBhcmFtLmVsZW1lbnRVdGlsaXRpZXM7XHJcblxyXG4gICAgZ3JvdXBDb21wb3VuZFR5cGUgPSBwcm9wcy5ncm91cENvbXBvdW5kVHlwZSB8fCBERUZBVUxUX0dST1VQX0NPTVBPVU5EX1RZUEU7XHJcbiAgICBtZXRhRWRnZUlkZW50aWZpZXIgPSBwcm9wcy5tZXRhRWRnZUlkZW50aWZpZXI7XHJcbiAgICBsb2NrR3JhcGhUb3BvbG9neSA9IHByb3BzLmxvY2tHcmFwaFRvcG9sb2d5O1xyXG4gICAgc2hvdWxkQXBwbHkgPSBwcm9wcy5zaG91bGRBcHBseSB8fCB0cnVlO1xyXG5cclxuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9IGZhbHNlO1xyXG4gICAgaW5pdE1ldGFTdHlsZU1hcCgpO1xyXG4gIH1cclxuXHJcbiAgdG9wb2xvZ3lHcm91cGluZy5hcHBseSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCB0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgfHwgIWV2YWxPcHQoIHNob3VsZEFwcGx5ICkgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGlzdCA9IGN5Lm5vZGVzKCkubWFwKCBmdW5jdGlvbiggbm9kZSApIHtcclxuICAgICAgcmV0dXJuIFsgbm9kZSBdO1xyXG4gICAgfSApO1xyXG5cclxuICAgIC8vIGRldGVybWluZSBub2RlIGdyb3VwcyBieSB0aGVpciB0b3BvbG9neVxyXG4gIFx0dmFyIGdyb3VwcyA9IGdldE5vZGVHcm91cHMoIGxpc3QgKTtcclxuICBcdC8vIGFwcGx5IGdyb3VwaW5nIGluIGN5IGxldmVsXHJcbiAgXHRhcHBseUdyb3VwaW5nKCBncm91cHMgKTtcclxuXHJcbiAgICB0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgPSB0cnVlO1xyXG5cclxuICAgIGlmICggbG9ja0dyYXBoVG9wb2xvZ3kgKSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMubG9ja0dyYXBoVG9wb2xvZ3koKTtcclxuICAgIH1cclxuXHJcbiAgXHRyZXR1cm4gZ3JvdXBzO1xyXG4gIH07XHJcblxyXG4gIHRvcG9sb2d5R3JvdXBpbmcudW5hcHBseSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCAhdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG1ldGFFZGdlcyA9IHRvcG9sb2d5R3JvdXBpbmcuZ2V0TWV0YUVkZ2VzKCk7XHJcbiAgICBtZXRhRWRnZXMuZm9yRWFjaCggZnVuY3Rpb24oIGVkZ2UgKSB7XHJcbiAgICAgIHZhciB0b1Jlc3RvcmUgPSBlZGdlLmRhdGEoJ3RnLXRvLXJlc3RvcmUnKTtcclxuICAgICAgZWRnZS5yZW1vdmUoKTtcclxuICAgICAgdG9SZXN0b3JlLnJlc3RvcmUoKTtcclxuXHJcbiAgICAgIEVER0VfU1RZTEVfTkFNRVMuZm9yRWFjaCggZnVuY3Rpb24oIG5hbWUgKSB7XHJcbiAgICAgICAgdmFyIG9sZFZhbCA9IHRvcG9sb2d5R3JvdXBpbmcubWV0YVN0eWxlTWFwWyBuYW1lIF1bIGVkZ2UuaWQoKSBdO1xyXG4gICAgICAgIHZhciBuZXdWYWwgPSBlZGdlLmRhdGEoIG5hbWUgKTtcclxuXHJcbiAgICAgICAgaWYgKCBvbGRWYWwgIT09IG5ld1ZhbCApIHtcclxuICAgICAgICAgIHRvUmVzdG9yZS5kYXRhKCBuYW1lLCBuZXdWYWwgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gKTtcclxuICAgIH0gKTtcclxuXHJcbiAgICBpbml0TWV0YVN0eWxlTWFwKCk7XHJcblxyXG4gICAgdmFyIHBhcmVudHMgPSB0b3BvbG9neUdyb3VwaW5nLmdldEdyb3VwQ29tcG91bmRzKCk7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVBhcmVudCggcGFyZW50cy5jaGlsZHJlbigpLCBudWxsICk7XHJcbiAgICBwYXJlbnRzLnJlbW92ZSgpO1xyXG5cclxuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9IGZhbHNlO1xyXG5cclxuICAgIGlmICggbG9ja0dyYXBoVG9wb2xvZ3kgKSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudW5sb2NrR3JhcGhUb3BvbG9neSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRvcG9sb2d5R3JvdXBpbmcuZ2V0TWV0YUVkZ2VzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgbWV0YUVkZ2VzID0gY3kuZWRnZXMoJ1snICsgbWV0YUVkZ2VJZGVudGlmaWVyICsgJ10nKTtcclxuICAgIHJldHVybiBtZXRhRWRnZXM7XHJcbiAgfTtcclxuXHJcbiAgdG9wb2xvZ3lHcm91cGluZy5nZXRHcm91cENvbXBvdW5kcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGNsYXNzTmFtZSA9IGdyb3VwQ29tcG91bmRUeXBlO1xyXG4gICAgcmV0dXJuIGN5Lm5vZGVzKCdbY2xhc3M9XCInICsgY2xhc3NOYW1lICsgJ1wiXScpO1xyXG4gIH07XHJcblxyXG4gIHRvcG9sb2d5R3JvdXBpbmcuY2xlYXJBcHBsaWVkRmxhZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgdG9wb2xvZ3lHcm91cGluZy5zZXRBcHBsaWVkRmxhZyA9IGZ1bmN0aW9uKGFwcGxpZWQpIHtcclxuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9IGFwcGxpZWQ7XHJcbiAgfTtcclxuXHJcbiAgdG9wb2xvZ3lHcm91cGluZy50b2dnbGVBcHBsaWVkRmxhZyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkID0gIXRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZDtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBpbml0TWV0YVN0eWxlTWFwKCkge1xyXG4gICAgdG9wb2xvZ3lHcm91cGluZy5tZXRhU3R5bGVNYXAgPSB7fTtcclxuICAgIEVER0VfU1RZTEVfTkFNRVMuZm9yRWFjaCggZnVuY3Rpb24oIG5hbWUgKSB7XHJcbiAgICAgIHRvcG9sb2d5R3JvdXBpbmcubWV0YVN0eWxlTWFwWyBuYW1lIF0gPSB7fTtcclxuICAgIH0gKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGV2YWxPcHQoIG9wdCApIHtcclxuICAgIGlmICggdHlwZW9mIG9wdCA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuICAgICAgcmV0dXJuIG9wdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcHQ7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZXROb2RlR3JvdXBzKCBsaXN0ICkge1xyXG4gICAgaWYgKCBsaXN0Lmxlbmd0aCA8PSAxICkge1xyXG4gICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaGFsdmVzID0gZ2V0SGFsdmVzKCBsaXN0ICk7XHJcbiAgICB2YXIgZmlyc3RQYXJ0ID0gZ2V0Tm9kZUdyb3VwcyggaGFsdmVzWyAwIF0gKTtcclxuICAgIHZhciBzZWNvbmRQYXJ0ID0gZ2V0Tm9kZUdyb3VwcyggaGFsdmVzWyAxIF0gKTtcclxuICAgIC8vIG1lcmdlIHRoZSBoYWx2ZXNcclxuXHQgIHZhciBncm91cHMgPSBtZXJnZUdyb3VwcyggZmlyc3RQYXJ0LCBzZWNvbmRQYXJ0ICk7XHJcblxyXG4gICAgcmV0dXJuIGdyb3VwcztcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFBhcmVudE9yU2VsZiggbm9kZSApIHtcclxuICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpO1xyXG4gICAgcmV0dXJuIHBhcmVudC5zaXplKCkgPiAwID8gcGFyZW50IDogbm9kZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNhbGNHcm91cGluZ0tleSggZWRnZSApIHtcclxuICAgIHZhciBzcmNJZCA9IGdldFBhcmVudE9yU2VsZiggZWRnZS5zb3VyY2UoKSApLmlkKCk7XHJcbiAgICB2YXIgdGd0SWQgPSBnZXRQYXJlbnRPclNlbGYoIGVkZ2UudGFyZ2V0KCkgKS5pZCgpO1xyXG4gICAgdmFyIGVkZ2VUeXBlID0gZ2V0RWRnZVR5cGUoIGVkZ2UgKTtcclxuXHJcbiAgICByZXR1cm4gWyBlZGdlVHlwZSwgc3JjSWQsIHRndElkIF0uam9pbiggJy0nICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRUb01hcENoYWluKCBtYXAsIGtleSwgdmFsICkge1xyXG4gICAgaWYgKCAhbWFwWyBrZXkgXSApIHtcclxuICAgICAgbWFwWyBrZXkgXSA9IGN5LmNvbGxlY3Rpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBtYXBbIGtleSBdID0gbWFwWyBrZXkgXS5hZGQoIHZhbCApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXBwbHlHcm91cGluZyggZ3JvdXBzICkge1xyXG4gICAgZ3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cCApIHtcclxuICAgICAgY3JlYXRlR3JvdXBDb21wb3VuZCggZ3JvdXAgKTtcclxuICAgIH0gKTtcclxuXHJcbiAgICB2YXIgY29tcG91bmRzID0gdG9wb2xvZ3lHcm91cGluZy5nZXRHcm91cENvbXBvdW5kcygpO1xyXG4gICAgdmFyIGNoaWxkcmVuRWRnZXMgPSBjb21wb3VuZHMuY2hpbGRyZW4oKS5jb25uZWN0ZWRFZGdlcygpO1xyXG4gICAgdmFyIGVkZ2VzTWFwID0gW107XHJcblxyXG4gICAgY2hpbGRyZW5FZGdlcy5mb3JFYWNoKCBmdW5jdGlvbiggZWRnZSApe1xyXG4gICAgICB2YXIga2V5ID0gY2FsY0dyb3VwaW5nS2V5KCBlZGdlICk7XHJcbiAgICAgIGFkZFRvTWFwQ2hhaW4oIGVkZ2VzTWFwLCBrZXksIGVkZ2UgKTtcclxuICAgICAgZWRnZS5yZW1vdmUoKTtcclxuICAgIH0gKTtcclxuXHJcbiAgICBPYmplY3Qua2V5cyggZWRnZXNNYXAgKS5mb3JFYWNoKCBmdW5jdGlvbigga2V5ICkge1xyXG4gICAgICAvLyBtYWtlIGEgZHVtbXkgZWRnZSBmb3IgYWxsIG9mIGVkZ2VzIHRoYXQgYXJlIG1hcHBlZCBieSBrZXlcclxuICBcdFx0Ly8gZHVtbXkgZWRnZSBzaG91bGQgaGF2ZSBjb21tb24gcHJvcGVydGllcyBvZiBnaXZlbiBlZGdlc1xyXG4gIFx0XHQvLyBhbmQgc2hvdWxkIGNhcnJ5IHRoZWlyIGlkIGxpc3QgaW4gaXRzIGRhdGFcclxuICBcdFx0Ly8gZm9yIHNvdXJjZSBhbmQgdGFyZ2V0IGl0IHNob3VsZCBoYXZlIHBhcmVudCBvZiBjb21tb24gc291cmNlIGFuZCB0YXJnZXRcclxuICAgICAgY3JlYXRlTWV0YUVkZ2VGb3IoIGVkZ2VzTWFwWyBrZXkgXSApO1xyXG4gICAgfSApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlR3JvdXBDb21wb3VuZCggZ3JvdXAgKSB7XHJcbiAgICBpZiAoIGdyb3VwLmxlbmd0aCA8IDIgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY29sbGVjdGlvbiA9IGN5LmNvbGxlY3Rpb24oKTtcclxuXHJcbiAgICBncm91cC5mb3JFYWNoKCBmdW5jdGlvbiggbm9kZSApIHtcclxuICAgICAgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb24uYWRkKCBub2RlICk7XHJcbiAgICB9ICk7XHJcblxyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMoIGNvbGxlY3Rpb24sIGdyb3VwQ29tcG91bmRUeXBlICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVNZXRhRWRnZUZvciggZWRnZXMgKSB7XHJcbiAgICB2YXIgc3JjSWQgPSBnZXRQYXJlbnRPclNlbGYoIGVkZ2VzLnNvdXJjZSgpICkuaWQoKTtcclxuICAgIHZhciB0Z3RJZCA9IGdldFBhcmVudE9yU2VsZiggZWRnZXMudGFyZ2V0KCkgKS5pZCgpO1xyXG4gICAgdmFyIHR5cGUgPSBlZGdlcy5kYXRhKCAnY2xhc3MnICk7XHJcbiAgICBjeS5yZW1vdmUoIGVkZ2VzICk7XHJcblxyXG4gICAgdmFyIG1ldGFFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKCBzcmNJZCwgdGd0SWQsIHR5cGUgKTtcclxuICAgIG1ldGFFZGdlLmRhdGEoICd0Zy10by1yZXN0b3JlJywgZWRnZXMgKTtcclxuICAgIG1ldGFFZGdlLmRhdGEoIG1ldGFFZGdlSWRlbnRpZmllciwgdHJ1ZSApO1xyXG5cclxuICAgIEVER0VfU1RZTEVfTkFNRVMuZm9yRWFjaCggZnVuY3Rpb24oIHN0eWxlTmFtZSApIHtcclxuICAgICAgZWRnZXMuZm9yRWFjaCggZnVuY3Rpb24oIGVkZ2UgKSB7XHJcbiAgICAgICAgdG9wb2xvZ3lHcm91cGluZy5tZXRhU3R5bGVNYXBbIHN0eWxlTmFtZSBdWyBlZGdlLmlkKCkgXSA9IGVkZ2UuZGF0YSggc3R5bGVOYW1lICk7XHJcbiAgICAgIH0gKTtcclxuXHJcbiAgICAgIHZhciBjb21tb25WYWwgPSBlbGVtZW50VXRpbGl0aWVzLmdldENvbW1vblByb3BlcnR5KGVkZ2VzLCBzdHlsZU5hbWUsICdkYXRhJyk7XHJcbiAgICAgIGlmICggY29tbW9uVmFsICkge1xyXG4gICAgICAgIG1ldGFFZGdlLmRhdGEoIHN0eWxlTmFtZSwgY29tbW9uVmFsICk7XHJcbiAgICAgIH1cclxuICAgIH0gKTtcclxuXHJcbiAgICByZXR1cm4gbWV0YUVkZ2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtZXJnZUdyb3VwcyggZ3JvdXBzMSwgZ3JvdXBzMiApIHtcclxuICAgIC8vIG5vdE1lcmdlZEdycyB3aWxsIGluY2x1ZGUgbWVtYmVycyBvZiBncm91cHMxIHRoYXQgYXJlIG5vdCBtZXJnZWRcclxuICBcdC8vIG1lcmdlZEdycyB3aWxsIGluY2x1ZGUgdGhlIG1lcmdlZCBtZW1iZXJzIGZyb20gMiBncm91cHNcclxuICBcdHZhciBub3RNZXJnZWRHcnMgPSBbXSwgbWVyZ2VkR3JzID0gW107XHJcblxyXG4gICAgZ3JvdXBzMS5mb3JFYWNoKCBmdW5jdGlvbiggZ3IxICkge1xyXG4gICAgICB2YXIgbWVyZ2VkID0gZmFsc2U7XHJcblxyXG4gICAgICBtZXJnZWRHcnMuY29uY2F0KCBncm91cHMyICkuZm9yRWFjaCggZnVuY3Rpb24oIGdyMiwgaW5kZXgyICkge1xyXG4gICAgICAgIC8vIGlmIGdyb3VwcyBzaG91bGQgYmUgbWVyZ2VkIG1lcmdlIHRoZW0sIHJlbW92ZSBncjIgZnJvbSB3aGVyZSBpdFxyXG4gICAgICAgIC8vIGNvbWVzIGZyb20gYW5kIHB1c2ggdGhlIG1lcmdlIHJlc3VsdCB0byBtZXJnZWRHcnNcclxuICAgICAgICBpZiAoIHNob3VsZE1lcmdlKCBncjEsIGdyMiApICkge1xyXG4gICAgICAgICAgdmFyIG1lcmdlZEdyID0gZ3IxLmNvbmNhdCggZ3IyICk7XHJcblxyXG4gICAgICAgICAgaWYgKCBpbmRleDIgPj0gbWVyZ2VkR3JzLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgcmVtb3ZlQXQoIGdyb3VwczIsIGluZGV4MiAtIG1lcmdlZEdycy5sZW5ndGggKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZW1vdmVBdCggbWVyZ2VkR3JzLCBpbmRleDIgKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBtYXJrIGFzIG1lcmdlZCBhbmQgYnJlYWsgdGhlIGxvb3BcclxuICAgICAgICAgIG1lcmdlZEdycy5wdXNoKCBtZXJnZWRHciApO1xyXG4gICAgICAgICAgbWVyZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH0gKTtcclxuXHJcbiAgICAgIC8vIGlmIGdyMSBpcyBub3QgbWVyZ2VkIHB1c2ggaXQgdG8gbm90TWVyZ2VkR3JzXHJcbiAgICAgIGlmICggIW1lcmdlZCApIHtcclxuICAgICAgICBub3RNZXJnZWRHcnMucHVzaCggZ3IxICk7XHJcbiAgICAgIH1cclxuICAgIH0gKTtcclxuXHJcbiAgICAvLyB0aGUgZ3JvdXBzIHRoYXQgY29tZXMgZnJvbSBncm91cHMyIGJ1dCBub3QgbWVyZ2VkIGFyZSBzdGlsbCBpbmNsdWRlZFxyXG5cdCAgLy8gaW4gZ3JvdXBzMiBhZGQgdGhlbSB0byB0aGUgcmVzdWx0IHRvZ2V0aGVyIHdpdGggbWVyZ2VkR3JzIGFuZCBub3RNZXJnZWRHcnNcclxuICAgIHJldHVybiBub3RNZXJnZWRHcnMuY29uY2F0KCBtZXJnZWRHcnMsIGdyb3VwczIgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNob3VsZE1lcmdlKCBncm91cDEsIGdyb3VwMiApIHtcclxuICAgIC8vIHVzaW5nIGZpcnN0IGVsZW1lbnRzIGlzIGVub3VnaCB0byBkZWNpZGUgd2hldGhlciB0byBtZXJnZVxyXG4gIFx0dmFyIG5vZGUxID0gZ3JvdXAxWyAwIF07XHJcbiAgXHR2YXIgbm9kZTIgPSBncm91cDJbIDAgXTtcclxuXHJcbiAgICBpZiAoIG5vZGUxLmVkZ2VzKCkubGVuZ3RoICE9PSBub2RlMi5lZGdlcygpLmxlbmd0aCApIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBnZXRVbmRpcmVjdGVkRWRnZXMgPSBmdW5jdGlvbiggbm9kZSApIHtcclxuICAgICAgdmFyIGVkZ2VzID0gbm9kZS5jb25uZWN0ZWRFZGdlcygpLmZpbHRlciggaXNVbmRpcmVjdGVkRWRnZSApO1xyXG4gICAgICByZXR1cm4gZWRnZXM7XHJcbiAgICB9O1xyXG4gICAgLy8gdW5kaXJlY3RlZCBlZGdlcyBvZiBub2RlMSBhbmQgbm9kZTIgcmVzcGVjdGl2ZWx5XHJcbiAgICB2YXIgdW5kaXIxID0gZ2V0VW5kaXJlY3RlZEVkZ2VzKCBub2RlMSApO1xyXG4gICAgdmFyIHVuZGlyMiA9IGdldFVuZGlyZWN0ZWRFZGdlcyggbm9kZTIgKTtcclxuXHJcbiAgICB2YXIgaW4xID0gbm9kZTEuaW5jb21lcnMoKS5lZGdlcygpLm5vdCggdW5kaXIxICk7XHJcbiAgICB2YXIgaW4yID0gbm9kZTIuaW5jb21lcnMoKS5lZGdlcygpLm5vdCggdW5kaXIyICk7XHJcblxyXG4gICAgdmFyIG91dDEgPSBub2RlMS5vdXRnb2VycygpLmVkZ2VzKCkubm90KCB1bmRpcjEgKTtcclxuXHQgIHZhciBvdXQyID0gbm9kZTIub3V0Z29lcnMoKS5lZGdlcygpLm5vdCggdW5kaXIyICk7XHJcblxyXG4gICAgcmV0dXJuIGNvbXBhcmVFZGdlR3JvdXAoIGluMSwgaW4yLCBub2RlMSwgbm9kZTIgKVxyXG4gICAgICAgICAgICAmJiBjb21wYXJlRWRnZUdyb3VwKCBvdXQxLCBvdXQyLCBub2RlMSwgbm9kZTIgKVxyXG4gICAgICAgICAgICAmJiBjb21wYXJlRWRnZUdyb3VwKCB1bmRpcjEsIHVuZGlyMiwgbm9kZTEsIG5vZGUyICk7XHJcbiAgfVxyXG5cclxuICAvLyBkZWNpZGUgaWYgMiBlZGdlIGdyb3VwcyBjb250YWlucyBzZXQgb2YgZWRnZXMgd2l0aCBzaW1pbGFyIGNvbnRlbnQgKHR5cGUsXHJcbiAgLy8gc291cmNlLHRhcmdldCkgcmVsYXRpdmUgdG8gdGhlaXIgbm9kZXMgd2hlcmUgZ3IxIGFyZSBlZGdlcyBvZiBub2RlMSBhbmQgZ3IyIGFyZSBlZGdlcyBvZlxyXG4gIC8vIG5vZGUyXHJcbiAgZnVuY3Rpb24gY29tcGFyZUVkZ2VHcm91cCggZ3IxLCBncjIsIG5vZGUxLCBub2RlMiApIHtcclxuICAgIHZhciBpZDEgPSBub2RlMS5pZCgpO1xyXG4gICAgdmFyIGlkMiA9IG5vZGUyLmlkKCk7XHJcblxyXG4gICAgdmFyIG1hcDEgPSBmaWxsSWRUb1R5cGVTZXRNYXAoIGdyMSwgbm9kZTEgKTtcclxuICAgIHZhciBtYXAyID0gZmlsbElkVG9UeXBlU2V0TWFwKCBncjIsIG5vZGUyICk7XHJcblxyXG4gICAgaWYgKCBPYmplY3Qua2V5cyggbWFwMSApLmxlbmd0aCAhPT0gT2JqZWN0LmtleXMoIG1hcDIgKS5sZW5ndGggKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZmFpbGVkID0gZmFsc2U7XHJcblxyXG4gICAgT2JqZWN0LmtleXMoIG1hcDEgKS5mb3JFYWNoKCBmdW5jdGlvbigga2V5ICkge1xyXG4gICAgICAvLyBpZiBhbHJlYWR5IGZhaWxlZCBqdXN0IHJldHVyblxyXG4gICAgICBpZiAoIGZhaWxlZCApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGlmIGtleSBpcyBpZDIgdXNlIGlkMSBpbnN0ZWFkIGJlY2F1c2UgY29tcGFyaXNvbiBpcyByZWxhdGl2ZSB0byBub2Rlc1xyXG4gICAgICB2YXIgb3RoZXJLZXkgPSAoIGtleSA9PSBpZDIgKSA/IGlkMSA6IGtleTtcclxuXHJcbiAgICAgIC8vIGNoZWNrIGlmIHRoZSBzZXRzIGhhdmUgdGhlIHNhbWUgY29udGVudFxyXG4gIFx0XHQvLyBpZiBjaGVjayBmYWlscyByZXR1cm4gZmFsc2VcclxuICAgICAgaWYgKCAhaXNFcXVhbCggbWFwMVsga2V5IF0sIG1hcDJbIG90aGVyS2V5IF0gKSApIHtcclxuICAgICAgICBmYWlsZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9ICk7XHJcblxyXG4gICAgLy8gaWYgY2hlY2sgcGFzc2VzIGZvciBlYWNoIGtleSByZXR1cm4gdHJ1ZVxyXG4gICAgcmV0dXJuICFmYWlsZWQ7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBmaWxsSWRUb1R5cGVTZXRNYXAoIGVkZ2VHcm91cCwgbm9kZSApIHtcclxuICAgIHZhciBtYXAgPSB7fTtcclxuICAgIHZhciBub2RlSWQgPSBub2RlLmlkKCk7XHJcblxyXG4gICAgZWRnZUdyb3VwLmZvckVhY2goIGZ1bmN0aW9uKCBlZGdlICkge1xyXG4gICAgICB2YXIgc3JjSWQgPSBlZGdlLmRhdGEoJ3NvdXJjZScpO1xyXG4gICAgICB2YXIgdGd0SWQgPSBlZGdlLmRhdGEoJ3RhcmdldCcpO1xyXG4gICAgICB2YXIgZWRnZUlkID0gZWRnZS5pZCgpO1xyXG5cclxuICAgICAgdmFyIG90aGVyRW5kID0gKCBub2RlSWQgPT09IHRndElkICkgPyBzcmNJZCA6IHRndElkO1xyXG5cclxuICAgICAgZnVuY3Rpb24gYWRkVG9SZWxhdGVkU2V0KCBzaWRlU3RyLCB2YWx1ZSApIHtcclxuICAgICAgICBpZiAoICFtYXBbIHNpZGVTdHIgXSApIHtcclxuICAgICAgICAgIG1hcFsgc2lkZVN0ciBdID0gbmV3IFNldCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbWFwWyBzaWRlU3RyIF0uYWRkKCB2YWx1ZSApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZWRnZVR5cGUgPSBnZXRFZGdlVHlwZSggZWRnZSApO1xyXG5cclxuICAgICAgYWRkVG9SZWxhdGVkU2V0KCBvdGhlckVuZCwgZWRnZVR5cGUgKTtcclxuICAgIH0gKTtcclxuXHJcbiAgICByZXR1cm4gbWFwO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0RWRnZVR5cGUoIGVkZ2UgKSB7XHJcbiAgICByZXR1cm4gZWRnZS5kYXRhKCAnY2xhc3MnICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc1VuZGlyZWN0ZWRFZGdlKCBlZGdlICkge1xyXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNVbmRpcmVjdGVkRWRnZSggZWRnZSApO1xyXG4gIH1cclxuXHJcbiAgLy8gZ2V0IGhhbHZlcyBvZiBhIGxpc3QuIEl0IGlzIGFzc3VtZWQgdGhhdCBsaXN0IHNpemUgaXMgYXQgbGVhc3QgMi5cclxuICBmdW5jdGlvbiBnZXRIYWx2ZXMoIGxpc3QgKSB7XHJcbiAgICB2YXIgcyA9IGxpc3QubGVuZ3RoO1xyXG4gICAgdmFyIGhhbGZJbmRleCA9IE1hdGguZmxvb3IoIHMgLyAyICk7XHJcbiAgICB2YXIgZmlyc3RIYWxmID0gbGlzdC5zbGljZSggMCwgaGFsZkluZGV4ICk7XHJcbiAgICB2YXIgc2Vjb25kSGFsZiA9IGxpc3Quc2xpY2UoIGhhbGZJbmRleCwgcyApO1xyXG5cclxuICAgIHJldHVybiBbIGZpcnN0SGFsZiwgc2Vjb25kSGFsZiBdO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVtb3ZlQXQoIGFyciwgaW5kZXggKSB7XHJcbiAgICBhcnIuc3BsaWNlKCBpbmRleCwgMSApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRvcG9sb2d5R3JvdXBpbmc7XHJcbn07XHJcbiIsIi8vIEV4dGVuZHMgc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc1xyXG52YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICB2YXIgc2JnbnZpekluc3RhbmNlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucywgZWxlbWVudFV0aWxpdGllcywgY3ksIHRvcG9sb2d5R3JvdXBpbmc7XHJcblxyXG4gIGZ1bmN0aW9uIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zRXh0ZW5kZXIgKHBhcmFtKSB7XHJcblxyXG4gICAgc2JnbnZpekluc3RhbmNlID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEluc3RhbmNlKCk7XHJcbiAgICBjeSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRDeSgpO1xyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSBzYmdudml6SW5zdGFuY2UudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzID0gcGFyYW0uZWxlbWVudFV0aWxpdGllcztcclxuICAgIHRvcG9sb2d5R3JvdXBpbmcgPSBwYXJhbS5zaWZUb3BvbG9neUdyb3VwaW5nO1xyXG5cclxuICAgIGV4dGVuZCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gRXh0ZW5kcyB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyB3aXRoIGNoaXNlIHNwZWNpZmljIGZlYXR1cmVzXHJcbiAgZnVuY3Rpb24gZXh0ZW5kICgpIHtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hcHBseVNJRlRvcG9sb2d5R3JvdXBpbmcgPSBmdW5jdGlvbihwYXJhbSkge1xyXG4gICAgICB2YXIgb2xkRWxlcywgbmV3RWxlcztcclxuICAgICAgaWYgKCBwYXJhbS5maXJzdFRpbWUgKSB7XHJcbiAgICAgICAgb2xkRWxlcyA9IGN5LmVsZW1lbnRzKCk7XHJcblxyXG4gICAgICAgIGlmIChwYXJhbS5hcHBseSkge1xyXG4gICAgICAgICAgdG9wb2xvZ3lHcm91cGluZy5hcHBseSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHRvcG9sb2d5R3JvdXBpbmcudW5hcHBseSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmV3RWxlcyA9IGN5LmVsZW1lbnRzKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgb2xkRWxlcyA9IHBhcmFtLm9sZEVsZXM7XHJcbiAgICAgICAgbmV3RWxlcyA9IHBhcmFtLm5ld0VsZXM7XHJcblxyXG4gICAgICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcclxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMudW5sb2NrR3JhcGhUb3BvbG9neSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubG9ja0dyYXBoVG9wb2xvZ3koKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9sZEVsZXMucmVtb3ZlKCk7XHJcbiAgICAgICAgbmV3RWxlcy5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIHRvcG9sb2d5R3JvdXBpbmcudG9nZ2xlQXBwbGllZEZsYWcoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHJlc3VsdCA9IHsgb2xkRWxlczogbmV3RWxlcywgbmV3RWxlczogb2xkRWxlcyB9O1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBTZWN0aW9uIFN0YXJ0XHJcbiAgICAvLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGROb2RlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciByZXN1bHQ7XHJcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgICAgICB2YXIgbmV3Tm9kZSA9IHBhcmFtLm5ld05vZGU7XHJcbiAgICAgICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5ld05vZGUueCwgbmV3Tm9kZS55LCBuZXdOb2RlLmNsYXNzLCBuZXdOb2RlLmlkLCBuZXdOb2RlLnBhcmVudCwgbmV3Tm9kZS52aXNpYmlsaXR5KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBlbGVzOiByZXN1bHRcclxuICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgcmVzdWx0O1xyXG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICAgICAgdmFyIG5ld0VkZ2UgPSBwYXJhbS5uZXdFZGdlO1xyXG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdFZGdlLnNvdXJjZSwgbmV3RWRnZS50YXJnZXQsIG5ld0VkZ2UuY2xhc3MsIG5ld0VkZ2UuaWQsIG5ld0VkZ2UudmlzaWJpbGl0eSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZWxlczogcmVzdWx0XHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzID0gZnVuY3Rpb24ocGFyYW0pIHtcclxuICAgICAgdmFyIHJlc3VsdDtcclxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMocGFyYW0uc291cmNlLCBwYXJhbS50YXJnZXQsIHBhcmFtLnByb2Nlc3NUeXBlKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBlbGVzOiByZXN1bHRcclxuICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuXHJcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgICAgICAvLyBOb2RlcyB0byBtYWtlIGNvbXBvdW5kLCB0aGVpciBkZXNjZW5kYW50cyBhbmQgZWRnZXMgY29ubmVjdGVkIHRvIHRoZW0gd2lsbCBiZSByZW1vdmVkIGR1cmluZyBjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgb3BlcmF0aW9uXHJcbiAgICAgICAgLy8gKGludGVybmFsbHkgYnkgZWxlcy5tb3ZlKCkgb3BlcmF0aW9uKSwgc28gbWFyayB0aGVtIGFzIHJlbW92ZWQgZWxlcyBmb3IgdW5kbyBvcGVyYXRpb24uXHJcbiAgICAgICAgdmFyIG5vZGVzVG9NYWtlQ29tcG91bmQgPSBwYXJhbS5ub2Rlc1RvTWFrZUNvbXBvdW5kO1xyXG4gICAgICAgIHZhciByZW1vdmVkRWxlcyA9IG5vZGVzVG9NYWtlQ29tcG91bmQudW5pb24obm9kZXNUb01ha2VDb21wb3VuZC5kZXNjZW5kYW50cygpKTtcclxuICAgICAgICByZW1vdmVkRWxlcyA9IHJlbW92ZWRFbGVzLnVuaW9uKHJlbW92ZWRFbGVzLmNvbm5lY3RlZEVkZ2VzKCkpO1xyXG4gICAgICAgIHJlc3VsdC5yZW1vdmVkRWxlcyA9IHJlbW92ZWRFbGVzO1xyXG4gICAgICAgIC8vIEFzc3VtZSB0aGF0IGFsbCBub2RlcyB0byBtYWtlIGNvbXBvdW5kIGhhdmUgdGhlIHNhbWUgcGFyZW50XHJcbiAgICAgICAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xyXG4gICAgICAgIC8vIFRoZSBwYXJlbnQgb2YgbmV3IGNvbXBvdW5kIHdpbGwgYmUgdGhlIG9sZCBwYXJlbnQgb2YgdGhlIG5vZGVzIHRvIG1ha2UgY29tcG91bmRcclxuICAgICAgICAvLyBOZXcgZWxlcyBpbmNsdWRlcyBuZXcgY29tcG91bmQgYW5kIHRoZSBtb3ZlZCBlbGVzIGFuZCB3aWxsIGJlIHVzZWQgaW4gdW5kbyBvcGVyYXRpb24uXHJcbiAgICAgICAgcmVzdWx0Lm5ld0VsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2Rlc1RvTWFrZUNvbXBvdW5kLCBwYXJhbS5jb21wb3VuZFR5cGUpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdC5yZW1vdmVkRWxlcyA9IHBhcmFtLm5ld0VsZXMucmVtb3ZlKCk7XHJcbiAgICAgICAgcmVzdWx0Lm5ld0VsZXMgPSBwYXJhbS5yZW1vdmVkRWxlcy5yZXN0b3JlKCk7XHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXIocmVzdWx0Lm5ld0VsZXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBTZWN0aW9uIEVuZFxyXG4gICAgLy8gYWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xyXG4gICAgICB2YXIgZWxlcztcclxuXHJcbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcclxuICAgICAgICBlbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uKHBhcmFtLnRlbXBsYXRlVHlwZSwgcGFyYW0ubWFjcm9tb2xlY3VsZUxpc3QsIHBhcmFtLmNvbXBsZXhOYW1lLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgcGFyYW0udGlsaW5nUGFkZGluZ0hvcml6b250YWwsIHBhcmFtLmVkZ2VMZW5ndGgsIHBhcmFtLmxheW91dFBhcmFtKVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGVsZXMgPSBwYXJhbTtcclxuICAgICAgICBjeS5hZGQoZWxlcyk7XHJcblxyXG4gICAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcclxuICAgICAgICBlbGVzLnNlbGVjdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGVsZXM6IGVsZXNcclxuICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIGdlbmVyYWwgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBwb3NpdGlvbnMgPSB7fTtcclxuICAgICAgdmFyIG5vZGVzID0gY3kubm9kZXMoKTtcclxuXHJcbiAgICAgIG5vZGVzLmVhY2goZnVuY3Rpb24oZWxlLCBpKSB7XHJcbiAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgZWxlID0gaTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBvc2l0aW9uc1tlbGUuaWQoKV0gPSB7XHJcbiAgICAgICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxyXG4gICAgICAgICAgeTogZWxlLnBvc2l0aW9uKFwieVwiKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIHBvc2l0aW9ucztcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMgPSBmdW5jdGlvbiAocG9zaXRpb25zKSB7XHJcbiAgICAgIHZhciBjdXJyZW50UG9zaXRpb25zID0ge307XHJcbiAgICAgIGN5Lm5vZGVzKCkucG9zaXRpb25zKGZ1bmN0aW9uIChlbGUsIGkpIHtcclxuICAgICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICBlbGUgPSBpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3VycmVudFBvc2l0aW9uc1tlbGUuaWQoKV0gPSB7XHJcbiAgICAgICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxyXG4gICAgICAgICAgeTogZWxlLnBvc2l0aW9uKFwieVwiKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBwb3MgPSBwb3NpdGlvbnNbZWxlLmlkKCldO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB4OiBwb3MueCxcclxuICAgICAgICAgIHk6IHBvcy55XHJcbiAgICAgICAgfTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gY3VycmVudFBvc2l0aW9ucztcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICBwZXJmb3JtT3BlcmF0aW9uOiB0cnVlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuXHJcbiAgICAgIHJlc3VsdC5zaXplTWFwID0ge307XHJcbiAgICAgIHJlc3VsdC51c2VBc3BlY3RSYXRpbyA9IGZhbHNlO1xyXG4gICAgICByZXN1bHQucHJlc2VydmVSZWxhdGl2ZVBvcyA9IHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3M7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICBpZihub2RlLmlzUGFyZW50KCkpe1xyXG4gICAgICAgICAgcmVzdWx0LnNpemVNYXBbbm9kZS5pZCgpXSA9IHtcclxuICAgICAgICAgICAgdzogbm9kZS5kYXRhKFwibWluV2lkdGhcIiksXHJcbiAgICAgICAgICAgIGg6IG5vZGUuZGF0YShcIm1pbkhlaWdodFwiKSxcclxuICAgICAgICAgICAgYmlhc0wgOiBub2RlLmRhdGEoXCJtaW5XaWR0aEJpYXNMZWZ0XCIpLFxyXG4gICAgICAgICAgICBiaXNhUiA6IG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc1JpZ2h0XCIpLFxyXG4gICAgICAgICAgICBiaWFzVCA6IG5vZGUuZGF0YShcIm1pbkhlaWdodEJpYXNUb3BcIiksXHJcbiAgICAgICAgICAgIGJpYXNCIDogbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc0JvdHRvbVwiKVxyXG4gICAgICAgICAgIC8vIHc6IG5vZGUuY3NzKFwibWluV2lkdGhcIikgIT0gMD8gIG5vZGUuZGF0YShcIm1pbldpZHRoXCIpIDogbm9kZS5jaGlsZHJlbigpLmJvdW5kaW5nQm94KCkudyxcclxuICAgICAgICAgICAgLy9oOiBub2RlLmNzcyhcIm1pbi1oZWlnaHRcIikgIT0gMD8gIG5vZGUuZGF0YShcIm1pbkhlaWdodFwiKSA6IG5vZGUuY2hpbGRyZW4oKS5ib3VuZGluZ0JveCgpLmhcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICByZXN1bHQuc2l6ZU1hcFtub2RlLmlkKCldID0ge1xyXG4gICAgICAgICAgICB3OiBub2RlLndpZHRoKCksXHJcbiAgICAgICAgICAgIGg6IG5vZGUuaGVpZ2h0KClcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXN1bHQubm9kZXMgPSBub2RlcztcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG5cclxuICAgICAgICBpZiAocGFyYW0ucGVyZm9ybU9wZXJhdGlvbikge1xyXG4gICAgICAgICAgaWYgKHBhcmFtLnNpemVNYXApIHtcclxuICAgICAgICAgICAgLyogaWYgKHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3MgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICB2YXIgb2xkV2lkdGggPSBub2RlLmRhdGEoXCJiYm94XCIpLnc7XHJcbiAgICAgICAgICAgICAgdmFyIG9sZEhlaWdodCA9IG5vZGUuZGF0YShcImJib3hcIikuaDtcclxuICAgICAgICAgICAgfSAqL1xyXG5cclxuICAgICAgICAgICAgaWYobm9kZS5pc1BhcmVudCgpKXtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJtaW5IZWlnaHRcIiAsIHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5oKTtcclxuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aFwiICwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLncpO1xyXG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc0xlZnRcIiwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmJpYXNMKTtcclxuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aEJpYXNSaWdodFwiLCBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uYmlhc1IpO1xyXG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcIm1pbkhlaWdodEJpYXNUb3BcIiwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmJpYXNUKTtcclxuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJtaW5IZWlnaHRCaWFzQm90dG9tXCIsIHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5iaWFzQik7XHJcblxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLncgPSBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0udztcclxuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uaDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgLyogaWYgKHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3MgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICB2YXIgc3RhdGVzYW5kaW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XHJcbiAgICAgICAgICAgICAgdmFyIHRvcEJvdHRvbSA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gKGJveC5hbmNob3JTaWRlID09PSBcInRvcFwiIHx8IGJveC5hbmNob3JTaWRlID09PSBcImJvdHRvbVwiKSk7XHJcbiAgICAgICAgICAgICAgdmFyIHJpZ2h0TGVmdCA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gKGJveC5hbmNob3JTaWRlID09PSBcInJpZ2h0XCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwibGVmdFwiKSk7XHJcblxyXG4gICAgICAgICAgICAgIHRvcEJvdHRvbS5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XHJcbiAgICAgICAgICAgICAgICBpZiAoYm94LmJib3gueCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgYm94LmJib3gueCA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChib3guYmJveC54ID4gb2xkV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgYm94LmJib3gueCA9IG9sZFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYm94LmJib3gueCA9IG5vZGUuZGF0YShcImJib3hcIikudyAqIGJveC5iYm94LnggLyBvbGRXaWR0aDtcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgcmlnaHRMZWZ0LmZvckVhY2goZnVuY3Rpb24oYm94KXtcclxuICAgICAgICAgICAgICAgIGlmIChib3guYmJveC55IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICBib3guYmJveC55ID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJveC5iYm94LnkgPiBvbGRIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgYm94LmJib3gueSA9IG9sZEhlaWdodDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJveC5iYm94LnkgPSBub2RlLmRhdGEoXCJiYm94XCIpLmggKiBib3guYmJveC55IC8gb2xkSGVpZ2h0O1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9ICovXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2RlcyhwYXJhbS5ub2RlcywgcGFyYW0ud2lkdGgsIHBhcmFtLmhlaWdodCwgcGFyYW0udXNlQXNwZWN0UmF0aW8sIHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3MpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgfTtcclxuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgICAgIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xyXG4gICAgICByZXN1bHQubGFiZWwgPSB7fTtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICAgIHJlc3VsdC5sYWJlbFtub2RlLmlkKCldID0gbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICAgICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBwYXJhbS5sYWJlbCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICAgIG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbCA9IHBhcmFtLmxhYmVsW25vZGUuaWQoKV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94U3R5bGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgfTtcclxuICAgICAgdmFyIHN0eWxlID0gcGFyYW0ubm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpW3BhcmFtLmluZGV4XS5zdHlsZTtcclxuICAgICAgcmVzdWx0Lm5ld1Byb3BzID0gJC5leHRlbmQoIHt9LCBzdHlsZSApO1xyXG4gICAgICByZXN1bHQubm9kZSA9IHBhcmFtLm5vZGU7XHJcbiAgICAgIHJlc3VsdC5pbmRleCA9IHBhcmFtLmluZGV4O1xyXG5cclxuICAgICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVJbmZvYm94U3R5bGUoIHBhcmFtLm5vZGUsIHBhcmFtLmluZGV4LCBwYXJhbS5uZXdQcm9wcyApO1xyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlSW5mb2JveE9iaiA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICB9O1xyXG4gICAgICB2YXIgb2JqID0gcGFyYW0ubm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpW3BhcmFtLmluZGV4XTtcclxuICAgICAgcmVzdWx0Lm5ld1Byb3BzID0gJC5leHRlbmQoIHt9LCBvYmogKTtcclxuICAgICAgcmVzdWx0Lm5vZGUgPSBwYXJhbS5ub2RlO1xyXG4gICAgICByZXN1bHQuaW5kZXggPSBwYXJhbS5pbmRleDtcclxuXHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlSW5mb2JveE9iaiggcGFyYW0ubm9kZSwgcGFyYW0uaW5kZXgsIHBhcmFtLm5ld1Byb3BzICk7XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgIH07XHJcbiAgICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuICAgICAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xyXG4gICAgICByZXN1bHQudmFsdWVNYXAgPSB7fTtcclxuICAgICAgcmVzdWx0LmVsZXMgPSBlbGVzO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICAgICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5kYXRhKHBhcmFtLm5hbWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEocGFyYW0uZWxlcywgcGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXApO1xyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlU2V0RmllbGQgPSBmdW5jdGlvbiggcGFyYW0gKSB7XHJcbiAgICAgIHZhciB1cGRhdGVzID0gZWxlbWVudFV0aWxpdGllcy51cGRhdGVTZXRGaWVsZCggcGFyYW0uZWxlLCBwYXJhbS5maWVsZE5hbWUsIHBhcmFtLnRvRGVsZXRlLCBwYXJhbS50b0FkZCwgcGFyYW0uY2FsbGJhY2sgKTtcclxuXHJcbiAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgZWxlOiBwYXJhbS5lbGUsXHJcbiAgICAgICAgZmllbGROYW1lOiBwYXJhbS5maWVsZE5hbWUsXHJcbiAgICAgICAgY2FsbGJhY2s6IHBhcmFtLmNhbGxiYWNrLFxyXG4gICAgICAgIHRvRGVsZXRlOiB1cGRhdGVzLmFkZGVkLFxyXG4gICAgICAgIHRvQWRkOiB1cGRhdGVzLmRlbGV0ZWRcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICB9O1xyXG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XHJcbiAgICAgIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcclxuICAgICAgcmVzdWx0LnZhbHVlTWFwID0ge307XHJcbiAgICAgIHJlc3VsdC5lbGVzID0gZWxlcztcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG4gICAgICAgIHJlc3VsdC52YWx1ZU1hcFtlbGUuaWQoKV0gPSBlbGUuY3NzKHBhcmFtLm5hbWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyhwYXJhbS5lbGVzLCBwYXJhbS5uYW1lLCBwYXJhbS52YWx1ZU1hcCk7XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG4gICAgICByZXN1bHQuZGF0YSA9IHt9O1xyXG4gICAgICByZXN1bHQuZWxlcyA9IGVsZXM7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuXHJcbiAgICAgICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldID0ge307XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gcGFyYW0uZmlyc3RUaW1lID8gcGFyYW0uZGF0YSA6IHBhcmFtLmRhdGFbZWxlLmlkKCldO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIGRhdGEpIHtcclxuICAgICAgICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXVtwcm9wXSA9IGVsZS5kYXRhKHByb3ApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuXHJcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZSwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogU2hvdyBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cclxuICAgICAqL1xyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG5cclxuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xyXG5cclxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgICAgIHJlc3VsdC5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChwYXJhbS5lbGVzLCBwYXJhbS5sYXlvdXRwYXJhbSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuc2hvdyhlbGVzKTsgLy8gU2hvdyBnaXZlbiBlbGVzXHJcbiAgICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuXHJcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcclxuICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuaGlkZShlbGVzKTsgLy8gSGlkZSBwcmV2aW91c2x5IHVuaGlkZGVuIGVsZXM7XHJcblxyXG4gICAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICAqIEhpZGUgZWxlcyBhbmQgcGVyZm9ybSBsYXlvdXQuXHJcbiAgICAgKi9cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmhpZGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG5cclxuICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgICAgICAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuaGlkZUFuZFBlcmZvcm1MYXlvdXQocGFyYW0uZWxlcywgcGFyYW0ubGF5b3V0cGFyYW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuaGlkZShlbGVzKTsgLy8gSGlkZSBnaXZlbiBlbGVzXHJcbiAgICAgICAgICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvSGlkZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XHJcblxyXG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xyXG4gICAgICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgcHJldmlvdXNseSBoaWRkZW4gZWxlc1xyXG5cclxuICAgICAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBTZWN0aW9uIEVuZFxyXG4gICAgLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgfTtcclxuICAgICAgcmVzdWx0LnR5cGUgPSBwYXJhbS50eXBlO1xyXG4gICAgICByZXN1bHQubm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICAgICAgcmVzdWx0LmluZGV4ID0gcGFyYW0uaW5kZXg7XHJcbiAgICAgIHZhciBkYXRhID0gcGFyYW0uZGF0YTtcclxuXHJcbiAgICAgIHZhciB0ZW1wRGF0YSA9IGVsZW1lbnRVdGlsaXRpZXMuc2F2ZVVuaXRzKHBhcmFtLm5vZGVzKTtcclxuICAgICAgcmVzdWx0LnZhbHVlID0gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveChwYXJhbS5ub2RlcywgcGFyYW0uaW5kZXgsIHBhcmFtLnZhbHVlLCBwYXJhbS50eXBlKTtcclxuICAgICAgLyogdmFyIGxvY2F0aW9ucyA9IGVsZW1lbnRVdGlsaXRpZXMuY2hlY2tGaXQocGFyYW0ubm9kZXMpO1xyXG4gICAgICBpZiAobG9jYXRpb25zICE9PSB1bmRlZmluZWQgJiYgbG9jYXRpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmZpdFVuaXRzKHBhcmFtLm5vZGVzLCBsb2NhdGlvbnMpO1xyXG4gICAgICB9ICovXHJcbiAgICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVVbml0cyhwYXJhbS5ub2RlcywgZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XHJcbiAgICAgIHJlc3VsdC5kYXRhID0gdGVtcERhdGE7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciBvYmogPSBwYXJhbS5vYmo7XHJcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gICAgICB2YXIgZGF0YSA9IHBhcmFtLmRhdGE7XHJcblxyXG4gICAgICB2YXIgdGVtcERhdGEgPSBlbGVtZW50VXRpbGl0aWVzLnNhdmVVbml0cyhub2Rlcyk7XHJcbiAgICAgIHZhciBsb2NhdGlvbk9iaiA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobm9kZXMsIG9iaik7XHJcbiAgICAgLyogIHZhciBsb2NhdGlvbnMgPSBlbGVtZW50VXRpbGl0aWVzLmNoZWNrRml0KG5vZGVzKTtcclxuICAgICAgaWYgKGxvY2F0aW9ucyAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5maXRVbml0cyhub2RlcywgbG9jYXRpb25zKTtcclxuICAgICAgfSAqL1xyXG4gICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlVW5pdHMobm9kZXMsIGRhdGEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgICAgbG9jYXRpb25PYmo6IGxvY2F0aW9uT2JqLFxyXG4gICAgICAgIG9iajogb2JqLFxyXG4gICAgICAgIGRhdGE6IHRlbXBEYXRhXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciBsb2NhdGlvbk9iaiA9IHBhcmFtLmxvY2F0aW9uT2JqO1xyXG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICAgICAgdmFyIGRhdGEgPSBwYXJhbS5kYXRhO1xyXG5cclxuICAgICAgdmFyIHRlbXBEYXRhID0gZWxlbWVudFV0aWxpdGllcy5zYXZlVW5pdHMobm9kZXMpO1xyXG4gICAgICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgbG9jYXRpb25PYmopO1xyXG4gICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlVW5pdHMobm9kZXMsIGRhdGEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgICAgb2JqOiBvYmosXHJcbiAgICAgICAgZGF0YTogdGVtcERhdGFcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZml0VW5pdHMgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIG5vZGUgPSBwYXJhbS5ub2RlO1xyXG4gICAgICB2YXIgbG9jYXRpb25zID0gcGFyYW0ubG9jYXRpb25zO1xyXG4gICAgICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5maXRVbml0cyhub2RlLCBsb2NhdGlvbnMpO1xyXG5cclxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcclxuXHJcbiAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgbm9kZTogbm9kZSxcclxuICAgICAgICBvYmo6IG9iaixcclxuICAgICAgICBsb2NhdGlvbnM6IGxvY2F0aW9uc1xyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlVW5pdHMgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIG5vZGUgPSBwYXJhbS5ub2RlO1xyXG4gICAgICB2YXIgbG9jYXRpb25zID0gcGFyYW0ubG9jYXRpb25zO1xyXG4gICAgICB2YXIgb2JqID0gcGFyYW0ub2JqO1xyXG4gICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykuZm9yRWFjaCggZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgIHZhciBib3ggPSBvYmpbaW5kZXgrK107XHJcbiAgICAgICAgZWxlLmJib3gueCA9IGJveC54O1xyXG4gICAgICAgIGVsZS5iYm94LnkgPSBib3gueTtcclxuICAgICAgICB2YXIgb2xkU2lkZSA9IGVsZS5hbmNob3JTaWRlO1xyXG4gICAgICAgIGVsZS5hbmNob3JTaWRlID0gYm94LmFuY2hvclNpZGU7XHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tb2RpZnlVbml0cyhub2RlLCBlbGUsIG9sZFNpZGUpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XHJcblxyXG4gICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICAgIG5vZGU6IG5vZGUsXHJcbiAgICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnNcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcclxuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgICAgIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XHJcbiAgICAgIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcclxuXHJcbiAgICAgICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBpc011bHRpbWVyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIGNoYW5nZSB0aGUgc3RhdHVzIG9mIGFsbCBub2RlcyBhdCBvbmNlLlxyXG4gICAgICAvLyBJZiBub3QgY2hhbmdlIHN0YXR1cyBvZiBlYWNoIHNlcGVyYXRlbHkgdG8gdGhlIHZhbHVlcyBtYXBwZWQgdG8gdGhlaXIgaWQuXHJcbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGUsIHN0YXR1c1tub2RlLmlkKCldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAvLyAgaWYgKCFmaXJzdFRpbWUgJiYgXy5pc0VxdWFsKG5vZGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XHJcbiAgICAvLyAgICAkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIiwgISQoJyNpbnNwZWN0b3ItaXMtbXVsdGltZXInKS5hdHRyKFwiY2hlY2tlZFwiKSk7XHJcbiAgICAvLyAgfVxyXG5cclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcclxuICAgICAgICBub2Rlczogbm9kZXNcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gICAgICB2YXIgc3RhdHVzID0gcGFyYW0uc3RhdHVzO1xyXG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xyXG4gICAgICB2YXIgcmVzdWx0U3RhdHVzID0ge307XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICByZXN1bHRTdGF0dXNbbm9kZS5pZCgpXSA9IG5vZGUuZGF0YSgnY2xvbmVtYXJrZXInKTtcclxuICAgICAgICB2YXIgY3VycmVudFN0YXR1cyA9IGZpcnN0VGltZSA/IHN0YXR1cyA6IHN0YXR1c1tub2RlLmlkKCldO1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZSwgY3VycmVudFN0YXR1cyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAvLyAgaWYgKCFmaXJzdFRpbWUgJiYgXy5pc0VxdWFsKG5vZGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XHJcbiAgICAvLyAgICAkKCcjaW5zcGVjdG9yLWlzLWNsb25lLW1hcmtlcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLWNsb25lLW1hcmtlcicpLmF0dHIoXCJjaGVja2VkXCIpKTtcclxuICAgIC8vICB9XHJcblxyXG4gICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICAgIHN0YXR1czogcmVzdWx0U3RhdHVzLFxyXG4gICAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLy8gcGFyYW06IHtjbGFzczogc2JnbmNsYXNzLCBuYW1lOiBwcm9wZXJ0eU5hbWUsIHZhbHVlOiB2YWx1ZX1cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgc2JnbmNsYXNzID0gcGFyYW0uY2xhc3M7XHJcbiAgICAgIHZhciBuYW1lID0gcGFyYW0ubmFtZTtcclxuICAgICAgdmFyIHZhbHVlID0gcGFyYW0udmFsdWU7XHJcbiAgICAgIHZhciBjbGFzc0RlZmF1bHRzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhzYmduY2xhc3MpO1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICAgIGNsYXNzOiBzYmduY2xhc3MsXHJcbiAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICB2YWx1ZTogY2xhc3NEZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA/IGNsYXNzRGVmYXVsdHNbbmFtZV0gOiB1bmRlZmluZWRcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHZhciBwcm9wTWFwID0ge307XHJcbiAgICAgIHByb3BNYXBbIG5hbWUgXSA9IHZhbHVlO1xyXG5cclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXREZWZhdWx0UHJvcGVydGllcyggc2JnbmNsYXNzLCBwcm9wTWFwICk7XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIGJnT2JqID0gcGFyYW0uYmdPYmo7XHJcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gICAgICB2YXIgdXBkYXRlSW5mbyA9IHBhcmFtLnVwZGF0ZUluZm87XHJcbiAgICAgIHZhciBwcm9tcHRJbnZhbGlkSW1hZ2UgPSBwYXJhbS5wcm9tcHRJbnZhbGlkSW1hZ2U7XHJcbiAgICAgIHZhciB2YWxpZGF0ZVVSTCA9IHBhcmFtLnZhbGlkYXRlVVJMO1xyXG5cclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGRCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIGJnT2JqLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKTtcclxuXHJcbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XHJcblxyXG4gICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgICBiZ09iajogYmdPYmosXHJcbiAgICAgICAgdXBkYXRlSW5mbzogdXBkYXRlSW5mbyxcclxuICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2U6IHByb21wdEludmFsaWRJbWFnZSxcclxuICAgICAgICB2YWxpZGF0ZVVSTDogdmFsaWRhdGVVUkxcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciBiZ09iaiA9IHBhcmFtLmJnT2JqO1xyXG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuXHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlQmFja2dyb3VuZEltYWdlKG5vZGVzLCBiZ09iaik7XHJcblxyXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgICAgYmdPYmo6IGJnT2JqXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgYmdPYmogPSBwYXJhbS5iZ09iajtcclxuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcblxyXG4gICAgICB2YXIgb2xkQmdPYmogPSBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUJhY2tncm91bmRJbWFnZShub2RlcywgYmdPYmopO1xyXG5cclxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcclxuXHJcbiAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICAgIGJnT2JqOiBvbGRCZ09ialxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIG9sZEltZyA9IHBhcmFtLm9sZEltZztcclxuICAgICAgdmFyIG5ld0ltZyA9IHBhcmFtLm5ld0ltZztcclxuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgICAgIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XHJcbiAgICAgIHZhciB1cGRhdGVJbmZvID0gcGFyYW0udXBkYXRlSW5mbztcclxuICAgICAgdmFyIHByb21wdEludmFsaWRJbWFnZSA9IHBhcmFtLnByb21wdEludmFsaWRJbWFnZTtcclxuICAgICAgdmFyIHZhbGlkYXRlVVJMPSBwYXJhbS52YWxpZGF0ZVVSTDtcclxuXHJcbiAgICAgIHZhciByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUJhY2tncm91bmRJbWFnZShub2Rlcywgb2xkSW1nLCBuZXdJbWcsIGZpcnN0VGltZSwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCk7XHJcblxyXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIHNiZ24gYWN0aW9uIGZ1bmN0aW9uc1xyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY29udmVydEludG9SZXZlcnNpYmxlUmVhY3Rpb24gPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgbGV0IGNvbGxlY3Rpb24gPSBjeS5jb2xsZWN0aW9uKCk7XHJcbiAgICAgIGxldCBtYXBUeXBlID0gZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCk7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShwYXJhbS5tYXBUeXBlKTtcclxuICAgICAgJCgnI21hcC10eXBlJykudmFsKHBhcmFtLm1hcFR5cGUpO1xyXG5cclxuICAgICAgcGFyYW0uY29sbGVjdGlvbi5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2UpIHtcclxuICAgICAgICB2YXIgc291cmNlTm9kZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS5zb3VyY2U7XHJcbiAgICAgICAgdmFyIHRhcmdldE5vZGUgPSBlZGdlLl9wcml2YXRlLmRhdGEudGFyZ2V0O1xyXG5cclxuICAgICAgICBlZGdlLm1vdmUoe3NvdXJjZTogdGFyZ2V0Tm9kZSwgdGFyZ2V0OiBzb3VyY2VOb2RlfSk7XHJcblxyXG4gICAgICAgIGxldCBjb252ZXJ0ZWRFZGdlID0gY3kuZ2V0RWxlbWVudEJ5SWQoZWRnZS5pZCgpKTtcclxuXHJcbiAgICAgICAgaWYoY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXNcIikpe1xyXG4gICAgICAgICAgbGV0IGRpc3RhbmNlID0gY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXNcIik7XHJcbiAgICAgICAgICBkaXN0YW5jZSA9IGRpc3RhbmNlLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMSplbGVtZW50O1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlc1wiLCBkaXN0YW5jZS5yZXZlcnNlKCkpO1xyXG5cclxuICAgICAgICAgIGxldCB3ZWlnaHQgPSBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHNcIik7XHJcbiAgICAgICAgICB3ZWlnaHQgPSB3ZWlnaHQubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDEtZWxlbWVudDtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlYmVuZGVkaXRpbmdXZWlnaHRzXCIsIHdlaWdodC5yZXZlcnNlKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PT0gXCJjb25zdW1wdGlvblwiKSB7XHJcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLl9wcml2YXRlLmRhdGEuY2xhc3MgPSBcInByb2R1Y3Rpb25cIjtcclxuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0c291cmNlID0gdGFyZ2V0Tm9kZSArIFwiLjFcIjtcclxuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0dGFyZ2V0ID0gc291cmNlTm9kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID09PSBcInByb2R1Y3Rpb25cIikge1xyXG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID0gXCJjb25zdW1wdGlvblwiO1xyXG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnRzb3VyY2UgPSB0YXJnZXROb2RlO1xyXG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnR0YXJnZXQgPSBzb3VyY2VOb2RlICsgXCIuMVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb24uYWRkKGNvbnZlcnRlZEVkZ2UpO1xyXG4gICAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLFxyXG4gICAgICAgIG1hcFR5cGU6IG1hcFR5cGUsXHJcbiAgICAgICAgcHJvY2Vzc0lkOiBwYXJhbS5wcm9jZXNzSWRcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5tb3ZlRWRnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICB9O1xyXG4gICAgICB2YXIgZWRnZSA9IHBhcmFtLmVkZ2U7XHJcbiAgICAgIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTsgICAgICBcclxuICAgICBcclxuXHJcbiAgICAgIHJlc3VsdC5zb3VyY2UgPSBlZGdlLnNvdXJjZSgpLmlkKCk7XHJcbiAgICAgIHJlc3VsdC50YXJnZXQgPSBlZGdlLnRhcmdldCgpLmlkKCk7ICAgICAgXHJcbiAgICAgIHJlc3VsdC5wb3J0c291cmNlICA9ZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiKTtcclxuICAgICAgcmVzdWx0LnBvcnR0YXJnZXQgPSBlZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpO1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWRnZSwgJ3NvdXJjZScsIHBhcmFtLnNvdXJjZSk7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlZGdlLCAndGFyZ2V0JywgcGFyYW0udGFyZ2V0KTtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVkZ2UsICdwb3J0c291cmNlJywgcGFyYW0ucG9ydHNvdXJjZSk7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlZGdlLCAncG9ydHRhcmdldCcsIHBhcmFtLnBvcnR0YXJnZXQpOyBcclxuICAgICAgZWRnZSA9IGVkZ2UubW92ZSh7XHJcbiAgICAgICAgdGFyZ2V0OiBwYXJhbS50YXJnZXQsXHJcbiAgICAgICAgc291cmNlIDogcGFyYW0uc291cmNlXHJcbiAgICBcclxuICAgICB9KTtcclxuXHJcbiAgICAgcmVzdWx0LmVkZ2UgPSBlZGdlO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5maXhFcnJvciA9IGZ1bmN0aW9uKHBhcmFtKXtcclxuICAgICAgXHJcbiAgICAgIHZhciBlcnJvckNvZGUgPSBwYXJhbS5lcnJvckNvZGU7XHJcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IGVycm9yQ29kZTtcclxuICAgICAgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwMVwiIHx8IGVycm9yQ29kZSA9PSAncGQxMDEwMicpe1xyXG5cclxuICAgICAgICByZXN1bHQuZWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMucmV2ZXJzZUVkZ2UocGFyYW0uZWRnZSk7XHJcblxyXG4gICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTAzXCIgfHwgZXJyb3JDb2RlID09ICdwZDEwMTA3Jyl7XHJcblxyXG4gICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgcGFyYW0ubmV3Tm9kZXMuZm9yRWFjaChmdW5jdGlvbihuZXdOb2RlKXtcclxuICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5ld05vZGUueCwgbmV3Tm9kZS55LCBuZXdOb2RlLmNsYXNzLCBuZXdOb2RlLmlkLCB1bmRlZmluZWQpO1xyXG5cclxuICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwYXJhbS5uZXdFZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKG5ld0VkZ2UpeyAgICAgICAgICBcclxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdFZGdlLnNvdXJjZSxuZXdFZGdlLnRhcmdldCxuZXdFZGdlLmNsYXNzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcGFyYW0ub2xkRWRnZXMuZm9yRWFjaChmdW5jdGlvbihvbGRFZGdlKXtcclxuICAgICAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcclxuICAgICAgICAgIC8vcmV0dXJuIFxyXG4gICAgICAgICAgb2xkRWRnZS5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcGFyYW0ubm9kZS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcmFtO1xyXG5cclxuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwNVwiIHx8IGVycm9yQ29kZSA9PSAncGQxMDEwNicpe1xyXG4gICBcclxuICAgICAgICByZXN1bHQuZWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMucmV2ZXJzZUVkZ2UocGFyYW0uZWRnZSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDE0MFwiKXtcclxuICAgICAgICBwYXJhbS5ub2RlLnJlbW92ZSgpO1xyXG4gICAgICAgIHJldHVybiBwYXJhbTtcclxuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwNFwiKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcGFyYW0uZWRnZXMuZm9yRWFjaChmdW5jdGlvbihlZGdlKXtcclxuICAgICAgICAgIGVkZ2UucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcclxuICAgICAgICAgIG5vZGUucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcmFtO1xyXG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA4XCIpe1xyXG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XHJcbiAgICAgICAgICBlZGdlLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgICBub2RlLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBwYXJhbTtcclxuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDExMVwiKXtcclxuICAgICAgICBwYXJhbS5lZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2Upe1xyXG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcGFyYW07XHJcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMjZcIil7XHJcbiAgICAgICAgcGFyYW0uZWRnZXMuZm9yRWFjaChmdW5jdGlvbihlZGdlKXtcclxuICAgICAgICAgIGVkZ2UucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcclxuICAgICAgICAgIG5vZGUucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcmFtO1xyXG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA5XCIgfHwgZXJyb3JDb2RlID09IFwicGQxMDEyNFwiKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmVzdWx0Lm5ld1NvdXJjZSA9IHBhcmFtLmVkZ2UuZGF0YSgpLnNvdXJjZTtcclxuICAgICAgICByZXN1bHQubmV3VGFyZ2V0ID0gcGFyYW0uZWRnZS5kYXRhKCkudGFyZ2V0O1xyXG4gICAgICAgIHJlc3VsdC5wb3J0c291cmNlID0gcGFyYW0uZWRnZS5kYXRhKCkucG9ydHNvdXJjZTtcclxuICAgICAgICB2YXIgY2xvbmVkRWRnZSA9IHBhcmFtLmVkZ2UuY2xvbmUoKTtcclxuICAgICAgIFxyXG4gICAgICAgIHZhciBlZGdlUGFyYW1zID0ge2NsYXNzIDogY2xvbmVkRWRnZS5kYXRhKCkuY2xhc3MsIGxhbmd1YWdlIDpjbG9uZWRFZGdlLmRhdGEoKS5sYW5ndWFnZX07XHJcbiAgICAgICAgY2xvbmVkRWRnZS5kYXRhKCkuc291cmNlID0gcGFyYW0ubmV3U291cmNlO1xyXG4gICAgICAgIGNsb25lZEVkZ2UuZGF0YSgpLnRhcmdldCA9IHBhcmFtLm5ld1RhcmdldDtcclxuICAgICAgICBjeS5yZW1vdmUocGFyYW0uZWRnZSk7XHJcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocGFyYW0ubmV3U291cmNlLHBhcmFtLm5ld1RhcmdldCxlZGdlUGFyYW1zLCBjbG9uZWRFZGdlLmRhdGEoKS5pZCk7ICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMTJcIikgeyAgICBcclxuICAgICAgICBcclxuICAgICAgICBwYXJhbS5jYWxsYmFjayA9IGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyOyAgXHJcbiAgICAgICAgLy8gSWYgdGhpcyBpcyBmaXJzdCB0aW1lIHdlIHNob3VsZCBtb3ZlIHRoZSBub2RlIHRvIGl0cyBuZXcgcGFyZW50IGFuZCByZWxvY2F0ZSBpdCBieSBnaXZlbiBwb3NEaWZmIHBhcmFtc1xyXG4gICAgICAgIC8vIGVsc2Ugd2Ugc2hvdWxkIHJlbW92ZSB0aGUgbW92ZWQgZWxlcyBhbmQgcmVzdG9yZSB0aGUgZWxlcyB0byByZXN0b3JlXHJcbiAgICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgICAgICAgdmFyIG5ld1BhcmVudElkID0gcGFyYW0ucGFyZW50RGF0YSA9PSB1bmRlZmluZWQgPyBudWxsIDogcGFyYW0ucGFyZW50RGF0YTtcclxuICAgICAgICAgIC8vIFRoZXNlIGVsZXMgaW5jbHVkZXMgdGhlIG5vZGVzIGFuZCB0aGVpciBjb25uZWN0ZWQgZWRnZXMgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2Rlcy5tb3ZlKCkuXHJcbiAgICAgICAgICAvLyBUaGV5IHNob3VsZCBiZSByZXN0b3JlZCBpbiB1bmRvXHJcbiAgICAgICAgICB2YXIgd2l0aERlc2NlbmRhbnQgPSBwYXJhbS5ub2Rlcy51bmlvbihwYXJhbS5ub2Rlcy5kZXNjZW5kYW50cygpKTtcclxuICAgICAgICAgIHJlc3VsdC5lbGVzVG9SZXN0b3JlID0gd2l0aERlc2NlbmRhbnQudW5pb24od2l0aERlc2NlbmRhbnQuY29ubmVjdGVkRWRnZXMoKSk7XHJcbiAgICAgICAgICAvLyBUaGVzZSBhcmUgdGhlIGVsZXMgY3JlYXRlZCBieSBub2Rlcy5tb3ZlKCksIHRoZXkgc2hvdWxkIGJlIHJlbW92ZWQgaW4gdW5kby5cclxuICAgICAgICAgIHJlc3VsdC5tb3ZlZEVsZXMgPSBwYXJhbS5ub2Rlcy5tb3ZlKHtcInBhcmVudFwiOiBuZXdQYXJlbnRJZH0pO1xyXG5cclxuICAgICAgICAgIHZhciBwb3NEaWZmID0ge1xyXG4gICAgICAgICAgICB4OiBwYXJhbS5wb3NEaWZmWCxcclxuICAgICAgICAgICAgeTogcGFyYW0ucG9zRGlmZllcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tb3ZlTm9kZXMocG9zRGlmZiwgcmVzdWx0Lm1vdmVkRWxlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcmVzdWx0LmVsZXNUb1Jlc3RvcmUgPSBwYXJhbS5tb3ZlZEVsZXMucmVtb3ZlKCk7XHJcbiAgICAgICAgICByZXN1bHQubW92ZWRFbGVzID0gcGFyYW0uZWxlc1RvUmVzdG9yZS5yZXN0b3JlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFyYW0uY2FsbGJhY2spIHtcclxuICAgICAgICAgIHJlc3VsdC5jYWxsYmFjayA9IHBhcmFtLmNhbGxiYWNrOyAvLyBrZWVwIHRoZSBwcm92aWRlZCBjYWxsYmFjayBzbyBpdCBjYW4gYmUgcmV1c2VkIGFmdGVyIHVuZG8vcmVkb1xyXG4gICAgICAgICAgcGFyYW0uY2FsbGJhY2socmVzdWx0Lm1vdmVkRWxlcyk7IC8vIGFwcGx5IHRoZSBjYWxsYmFjayBvbiBuZXdseSBjcmVhdGVkIGVsZW1lbnRzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICBcclxuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEyNVwiKSB7XHJcblxyXG4gICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLnJlbW92ZSgpOyAgICAgICBcclxuICAgICAgIHJlc3VsdC5uZXdFZGdlID17fTtcclxuICAgICAgIHZhciBlZGdlY2xhc3MgPSBwYXJhbS5uZXdFZGdlLmVkZ2VQYXJhbXMuY2xhc3MgPyBwYXJhbS5uZXdFZGdlLmVkZ2VQYXJhbXMuY2xhc3MgOiBwYXJhbS5uZXdFZGdlLmVkZ2VQYXJhbXM7XHJcbiAgICAgICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChwYXJhbS5uZXdFZGdlLnNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHBhcmFtLm5ld0VkZ2UudGFyZ2V0KSk7XHJcblxyXG4gICAgICAgaWYgKHZhbGlkYXRpb24gPT09ICdyZXZlcnNlJykge1xyXG4gICAgICAgIHZhciB0ZW1wID0gcGFyYW0ubmV3RWRnZS5zb3VyY2U7XHJcbiAgICAgICAgcGFyYW0ubmV3RWRnZS5zb3VyY2UgPSBwYXJhbS5uZXdFZGdlLnRhcmdldDtcclxuICAgICAgICBwYXJhbS5uZXdFZGdlLnRhcmdldCA9IHRlbXA7XHJcbiAgICAgIH1cclxuICAgICAgIHJlc3VsdC5uZXdFZGdlLmlkID1lbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocGFyYW0ubmV3RWRnZS5zb3VyY2UscGFyYW0ubmV3RWRnZS50YXJnZXQscGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zKS5pZCgpO1xyXG4gICAgICAgcmVzdWx0Lm5ld0VkZ2Uuc291cmNlID0gcGFyYW0ubmV3RWRnZS5zb3VyY2U7XHJcbiAgICAgICByZXN1bHQubmV3RWRnZS50YXJnZXQgPSBwYXJhbS5uZXdFZGdlLnRhcmdldDtcclxuICAgICAgIHJlc3VsdC5uZXdFZGdlLmVkZ2VQYXJhbXMgPSBwYXJhbS5uZXdFZGdlLmVkZ2VQYXJhbXM7XHJcbiAgICAgICBcclxuICAgICAgIHJldHVybiByZXN1bHQ7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTQyXCIpIHtcclxuICAgICAgICByZXN1bHQuZWRnZSA9IHBhcmFtLmVkZ2UucmVtb3ZlKCk7ICAgICAgIFxyXG4gICAgICAgIHJlc3VsdC5uZXdFZGdlID17fTtcclxuICAgICAgICB2YXIgZWRnZWNsYXNzID0gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zLmNsYXNzID8gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zLmNsYXNzIDogcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zO1xyXG4gICAgICAgIHZhciB2YWxpZGF0aW9uID0gZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyhlZGdlY2xhc3MsIGN5LmdldEVsZW1lbnRCeUlkKHBhcmFtLm5ld0VkZ2Uuc291cmNlKSwgY3kuZ2V0RWxlbWVudEJ5SWQocGFyYW0ubmV3RWRnZS50YXJnZXQpKTtcclxuXHJcbiAgICAgICAgaWYgKHZhbGlkYXRpb24gPT09ICdyZXZlcnNlJykge1xyXG4gICAgICAgICB2YXIgdGVtcCA9IHBhcmFtLm5ld0VkZ2Uuc291cmNlO1xyXG4gICAgICAgICBwYXJhbS5uZXdFZGdlLnNvdXJjZSA9IHBhcmFtLm5ld0VkZ2UudGFyZ2V0O1xyXG4gICAgICAgICBwYXJhbS5uZXdFZGdlLnRhcmdldCA9IHRlbXA7XHJcbiAgICAgICB9XHJcbiAgICAgICAgcmVzdWx0Lm5ld0VkZ2UuaWQgPWVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwYXJhbS5uZXdFZGdlLnNvdXJjZSxwYXJhbS5uZXdFZGdlLnRhcmdldCxwYXJhbS5uZXdFZGdlLmVkZ2VQYXJhbXMpLmlkKCk7XHJcbiAgICAgICAgcmVzdWx0Lm5ld0VkZ2Uuc291cmNlID0gcGFyYW0ubmV3RWRnZS5zb3VyY2U7XHJcbiAgICAgICAgcmVzdWx0Lm5ld0VkZ2UudGFyZ2V0ID0gcGFyYW0ubmV3RWRnZS50YXJnZXQ7XHJcbiAgICAgICAgcmVzdWx0Lm5ld0VkZ2UuZWRnZVBhcmFtcyA9IHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcztcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9ZWxzZSB7XHJcblxyXG4gICAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLnNvdXJjZSgpLmlkKCk7XHJcbiAgICAgICAgcmVzdWx0Lm5ld1RhcmdldCA9IHBhcmFtLmVkZ2UudGFyZ2V0KCkuaWQoKTtcclxuICAgICAgICByZXN1bHQucG9ydHRhcmdldCA9IHBhcmFtLmVkZ2UuZGF0YShcInBvcnR0YXJnZXRcIik7XHJcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLm1vdmUoe1xyXG4gICAgICAgICAgdGFyZ2V0OiBwYXJhbS5uZXdUYXJnZXQsXHJcbiAgICAgICAgICBzb3VyY2UgOiBwYXJhbS5uZXdTb3VyY2UgICAgICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHJlc3VsdC5lZGdlLCAncG9ydHRhcmdldCcsIHBhcmFtLnBvcnR0YXJnZXQpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgXHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgfVxyXG4gIFxyXG4gIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZml4RXJyb3IgPSBmdW5jdGlvbihwYXJhbSl7XHJcbiAgICB2YXIgZXJyb3JDb2RlID0gcGFyYW0uZXJyb3JDb2RlO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgcmVzdWx0LmVycm9yQ29kZSA9IGVycm9yQ29kZTtcclxuICAgIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDFcIiB8fCBlcnJvckNvZGUgPT0gJ3BkMTAxMDInKXtcclxuICAgICBcclxuICAgICAgICByZXN1bHQuZWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMucmV2ZXJzZUVkZ2UocGFyYW0uZWRnZSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTAzXCIgfHwgZXJyb3JDb2RlID09ICdwZDEwMTA3Jyl7XHJcblxyXG4gICAgICBwYXJhbS5uZXdOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5ld05vZGUpeyAgICBcclxuICAgICAgICBjeS5yZW1vdmUoY3kuJCgnIycrbmV3Tm9kZS5pZCkpICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcGFyYW0ubm9kZS5yZXN0b3JlKCk7XHJcblxyXG4gICAgICBwYXJhbS5vbGRFZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKG9sZEVkZ2UpeyAgXHJcbiAgICAgICAgb2xkRWRnZS5yZXN0b3JlKCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY3kuYW5pbWF0ZSh7XHJcbiAgICAgICAgZHVyYXRpb246IDEwMCxcclxuICAgICAgICBlYXNpbmc6ICdlYXNlJyxcclxuICAgICAgICBmaXQgOntlbGVzOnt9LHBhZGRpbmc6MjB9LCBcclxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIHBhcmFtO1xyXG5cclxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDVcIiB8fCBlcnJvckNvZGUgPT0gJ3BkMTAxMDYnKXsgIFxyXG5cclxuICAgICAgcmVzdWx0LmVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLnJldmVyc2VFZGdlKHBhcmFtLmVkZ2UpO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG5cclxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxNDBcIil7XHJcbiAgICAgIHBhcmFtLm5vZGUucmVzdG9yZSgpO1xyXG4gICAgICBjeS5hbmltYXRlKHtcclxuICAgICAgICBkdXJhdGlvbjogMTAwLFxyXG4gICAgICAgIGVhc2luZzogJ2Vhc2UnLFxyXG4gICAgICAgIGZpdCA6e2VsZXM6e30scGFkZGluZzoyMH0sIFxyXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBwYXJhbTtcclxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDRcIikge1xyXG4gICAgICBcclxuICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcclxuICAgICAgICBub2RlLnJlc3RvcmUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XHJcbiAgICAgICAgZWRnZS5yZXN0b3JlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gcGFyYW07XHJcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA4XCIpe1xyXG4gICAgICBcclxuICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcclxuICAgICAgICBub2RlLnJlc3RvcmUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XHJcbiAgICAgICAgZWRnZS5yZXN0b3JlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gcGFyYW07XHJcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTExXCIpe1xyXG4gICAgICBwYXJhbS5lZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2Upe1xyXG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHBhcmFtO1xyXG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEyNlwiKXtcclxuICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcclxuICAgICAgICBub2RlLnJlc3RvcmUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XHJcbiAgICAgICAgZWRnZS5yZXN0b3JlKCk7XHJcbiAgICAgIH0pOyAgICAgICBcclxuICAgICAgcmV0dXJuIHBhcmFtO1xyXG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwOVwiIHx8IGVycm9yQ29kZSA9PSBcInBkMTAxMjRcIikge1xyXG5cclxuICAgICAgcmVzdWx0Lm5ld1NvdXJjZSA9IHBhcmFtLmVkZ2Uuc291cmNlKCkuaWQoKTtcclxuICAgICAgcmVzdWx0Lm5ld1RhcmdldCA9IHBhcmFtLmVkZ2UudGFyZ2V0KCkuaWQoKTtcclxuICAgICAgcmVzdWx0LnBvcnRzb3VyY2UgPSBwYXJhbS5wb3J0c291cmNlO1xyXG4gICAgICByZXN1bHQuZWRnZSA9IHBhcmFtLmVkZ2UubW92ZSh7XHJcbiAgICAgICAgdGFyZ2V0OiBwYXJhbS5uZXdUYXJnZXQsXHJcbiAgICAgICAgc291cmNlIDogcGFyYW0ubmV3U291cmNlICAgICAgXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHJlc3VsdC5lZGdlLCAncG9ydHNvdXJjZScsIHBhcmFtLnBvcnRzb3VyY2UpOyBcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMTJcIikge1xyXG4gICAgIFxyXG4gICAgICAvLyBJZiB0aGlzIGlzIGZpcnN0IHRpbWUgd2Ugc2hvdWxkIG1vdmUgdGhlIG5vZGUgdG8gaXRzIG5ldyBwYXJlbnQgYW5kIHJlbG9jYXRlIGl0IGJ5IGdpdmVuIHBvc0RpZmYgcGFyYW1zXHJcbiAgICAgIC8vIGVsc2Ugd2Ugc2hvdWxkIHJlbW92ZSB0aGUgbW92ZWQgZWxlcyBhbmQgcmVzdG9yZSB0aGUgZWxlcyB0byByZXN0b3JlXHJcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgICAgICB2YXIgbmV3UGFyZW50SWQgPSBwYXJhbS5wYXJlbnREYXRhID09IHVuZGVmaW5lZCA/IG51bGwgOiBwYXJhbS5wYXJlbnREYXRhO1xyXG4gICAgICAgIC8vIFRoZXNlIGVsZXMgaW5jbHVkZXMgdGhlIG5vZGVzIGFuZCB0aGVpciBjb25uZWN0ZWQgZWRnZXMgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2Rlcy5tb3ZlKCkuXHJcbiAgICAgICAgLy8gVGhleSBzaG91bGQgYmUgcmVzdG9yZWQgaW4gdW5kb1xyXG4gICAgICAgIHZhciB3aXRoRGVzY2VuZGFudCA9IHBhcmFtLm5vZGVzLnVuaW9uKHBhcmFtLm5vZGVzLmRlc2NlbmRhbnRzKCkpO1xyXG4gICAgICAgIHJlc3VsdC5lbGVzVG9SZXN0b3JlID0gd2l0aERlc2NlbmRhbnQudW5pb24od2l0aERlc2NlbmRhbnQuY29ubmVjdGVkRWRnZXMoKSk7XHJcbiAgICAgICAgLy8gVGhlc2UgYXJlIHRoZSBlbGVzIGNyZWF0ZWQgYnkgbm9kZXMubW92ZSgpLCB0aGV5IHNob3VsZCBiZSByZW1vdmVkIGluIHVuZG8uXHJcbiAgICAgICAgcmVzdWx0Lm1vdmVkRWxlcyA9IHBhcmFtLm5vZGVzLm1vdmUoe1wicGFyZW50XCI6IG5ld1BhcmVudElkfSk7XHJcblxyXG4gICAgICAgIHZhciBwb3NEaWZmID0ge1xyXG4gICAgICAgICAgeDogcGFyYW0ucG9zRGlmZlgsXHJcbiAgICAgICAgICB5OiBwYXJhbS5wb3NEaWZmWVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHBvc0RpZmYsIHJlc3VsdC5tb3ZlZEVsZXMpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdC5lbGVzVG9SZXN0b3JlID0gcGFyYW0ubW92ZWRFbGVzLnJlbW92ZSgpO1xyXG4gICAgICAgIHJlc3VsdC5tb3ZlZEVsZXMgPSBwYXJhbS5lbGVzVG9SZXN0b3JlLnJlc3RvcmUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmFtLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmVzdWx0LmNhbGxiYWNrID0gcGFyYW0uY2FsbGJhY2s7IC8vIGtlZXAgdGhlIHByb3ZpZGVkIGNhbGxiYWNrIHNvIGl0IGNhbiBiZSByZXVzZWQgYWZ0ZXIgdW5kby9yZWRvXHJcbiAgICAgICAgcGFyYW0uY2FsbGJhY2socmVzdWx0Lm1vdmVkRWxlcyk7IC8vIGFwcGx5IHRoZSBjYWxsYmFjayBvbiBuZXdseSBjcmVhdGVkIGVsZW1lbnRzXHJcbiAgICAgIH1cclxuXHJcbiAgICAgXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgIFxyXG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEyNVwiKSB7XHJcblxyXG4gICAgICBjeS4kKCcjJytwYXJhbS5uZXdFZGdlLmlkKS5yZW1vdmUoKTtcclxuICAgICAgcGFyYW0uZWRnZSA9IHBhcmFtLmVkZ2UucmVzdG9yZSgpO1xyXG5cclxuICAgIFxyXG4gICAgICByZXR1cm4gcGFyYW07XHJcbiAgICAgIFxyXG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDE0MlwiKSB7XHJcbiAgICAgIGN5LiQoJyMnK3BhcmFtLm5ld0VkZ2UuaWQpLnJlbW92ZSgpO1xyXG4gICAgICBwYXJhbS5lZGdlID0gcGFyYW0uZWRnZS5yZXN0b3JlKCk7XHJcblxyXG4gICAgXHJcbiAgICAgIHJldHVybiBwYXJhbTtcclxuICAgIH1lbHNlIHtcclxuXHJcbiAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLnNvdXJjZSgpLmlkKCk7XHJcbiAgICAgIHJlc3VsdC5uZXdUYXJnZXQgPSBwYXJhbS5lZGdlLnRhcmdldCgpLmlkKCk7XHJcbiAgICAgIHJlc3VsdC5wb3J0dGFyZ2V0ID0gcGFyYW0uZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiKTtcclxuICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLm1vdmUoe1xyXG4gICAgICAgIHRhcmdldDogcGFyYW0ubmV3VGFyZ2V0LFxyXG4gICAgICAgIHNvdXJjZSA6IHBhcmFtLm5ld1NvdXJjZSAgICAgIFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShyZXN1bHQuZWRnZSwgJ3BvcnR0YXJnZXQnLCBwYXJhbS5wb3J0dGFyZ2V0KTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgfVxyXG5cclxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jbG9uZUhpZ2hEZWdyZWVOb2RlID0gZnVuY3Rpb24obm9kZSl7XHJcblxyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgdmFyIG9sZFggPSBub2RlLnBvc2l0aW9uKCkueDtcclxuICAgIHZhciBvbGRZID0gbm9kZS5wb3NpdGlvbigpLnk7XHJcbiAgICBcclxuICAgIFxyXG4gICAgdmFyIGNsYWN1bGF0ZU5ld0Nsb25lUG9zaXRpb24gPSBmdW5jdGlvbihzb3VyY2VFbmRQb2ludFgsc291cmNlRW5kUG9pbnRZLHRhcmdldEVuZFBvaW50WCx0YXJnZXRFbmRQb2ludFksZGVzaXJlZERpc3RhbmNlLGRpcmVjdGlvbil7XHJcbiAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh0YXJnZXRFbmRQb2ludFktc291cmNlRW5kUG9pbnRZLDIpKyBNYXRoLnBvdyh0YXJnZXRFbmRQb2ludFgtc291cmNlRW5kUG9pbnRYLDIpKTtcclxuICAgICAgdmFyIHJhdGlvID0gZGVzaXJlZERpc3RhbmNlL2Rpc3RhbmNlO1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgIGlmKGRpcmVjdGlvbiA9PSBcInNvdXJjZVwiKXsgXHJcbiAgICAgICAgcmVzdWx0LmN4ID0gKCgxLXJhdGlvKSAqIHNvdXJjZUVuZFBvaW50WCkgICsgKHJhdGlvICogdGFyZ2V0RW5kUG9pbnRYKTtcclxuICAgICAgICByZXN1bHQuY3kgPSAoKDEtcmF0aW8pICogc291cmNlRW5kUG9pbnRZKSAgKyAocmF0aW8gKiB0YXJnZXRFbmRQb2ludFkpO1xyXG4gICAgICB9ZWxzZXsgICAgICBcclxuICAgICAgICByZXN1bHQuY3ggPSAoKDEtcmF0aW8pICogdGFyZ2V0RW5kUG9pbnRYKSAgKyAocmF0aW8gKiBzb3VyY2VFbmRQb2ludFgpO1xyXG4gICAgICAgIHJlc3VsdC5jeSA9ICgoMS1yYXRpbykgKiB0YXJnZXRFbmRQb2ludFkpICArIChyYXRpbyAqIHNvdXJjZUVuZFBvaW50WSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9OyAgIFxyXG4gICAgdmFyIGVkZ2VzID0gbm9kZS5jb25uZWN0ZWRFZGdlcygpO1xyXG4gICAgdmFyIGRlc2lyZWREaXN0YW5jZSA9IChub2RlLmhlaWdodCgpID4gbm9kZS53aWR0aCgpPyBub2RlLmhlaWdodCgpOiBub2RlLndpZHRoKCkpKiAwLjE7XHJcbiAgICBmb3IodmFyIGkgPSAxIDsgaSA8IGVkZ2VzLmxlbmd0aCA7IGkrKyl7XHJcbiAgICAgIHZhciBlZGdlID0gZWRnZXNbaV07XHJcbiAgICAgIHZhciBpbmRleCA9IGk7XHJcbiAgICAgIHZhciBlZGdlQ2xvbmUgPSBlZGdlLmNsb25lKCk7XHJcbiAgICAgIHZhciBzdGFydFBvc2l0aW9uID0gZWRnZS5zb3VyY2UoKS5pZCgpID09IG5vZGUuaWQoKSA/IFwic291cmNlXCIgOiBcInRhcmdldFwiOyAgICBcclxuICAgICAgdmFyIG5ld1Bvc2l0aW9uID0gY2xhY3VsYXRlTmV3Q2xvbmVQb3NpdGlvbihlZGdlLnNvdXJjZUVuZHBvaW50KCkueCxlZGdlLnNvdXJjZUVuZHBvaW50KCkueSxlZGdlLnRhcmdldEVuZHBvaW50KCkueCxlZGdlLnRhcmdldEVuZHBvaW50KCkueSxkZXNpcmVkRGlzdGFuY2Usc3RhcnRQb3NpdGlvbik7IFxyXG4gICAgICB2YXIgbmV3Tm9kZUlkID0gbm9kZS5pZCgpKydjbG9uZS0nK2luZGV4O1xyXG4gICAgICAvL2VkZ2VDbG9uZS5kYXRhKCkuaWQgPSBlZGdlQ2xvbmUuZGF0YSgpLmlkKyBcIi1cIituZXdOb2RlSWQ7XHJcbiAgICAgIGlmKGVkZ2Uuc291cmNlKCkuaWQoKSA9PSBub2RlLmlkKCkpeyAgICAgICAgXHJcbiAgICAgICAgZWRnZUNsb25lLmRhdGEoKS5zb3VyY2UgPSBuZXdOb2RlSWQ7XHJcbiAgICAgICAgZWRnZUNsb25lLmRhdGEoKS5wb3J0c291cmNlID0gbmV3Tm9kZUlkOyAgICBcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBcclxuICAgICAgICBlZGdlQ2xvbmUuZGF0YSgpLnRhcmdldCA9IG5ld05vZGVJZDtcclxuICAgICAgICBlZGdlQ2xvbmUuZGF0YSgpLnBvcnR0YXJnZXQgPSBuZXdOb2RlSWQ7ICAgIFxyXG4gICAgICB9XHJcbiAgICAgIHZhciBuZXdOb2RlID0gbm9kZS5jbG9uZSgpO1xyXG4gICAgICBuZXdOb2RlLmRhdGEoKS5pZCA9IG5ld05vZGVJZDtcclxuICAgICAgY3kuYWRkKG5ld05vZGUpO1xyXG4gICAgIFxyXG4gICAgICBlZGdlLnJlbW92ZSgpO1xyXG4gICAgICBjeS5hZGQoZWRnZUNsb25lKTtcclxuICAgICAgbmV3Tm9kZS5wb3NpdGlvbih7XHJcbiAgICAgICAgeDogbmV3UG9zaXRpb24uY3gsXHJcbiAgICAgICAgeTogbmV3UG9zaXRpb24uY3lcclxuICAgICAgfSk7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobmV3Tm9kZSwgdHJ1ZSk7XHJcbiAgICAgIFxyXG4gICAgfSAgXHJcbiAgICBcclxuICAgIHZhciBuZXdQb3NpdGlvbiA9IGNsYWN1bGF0ZU5ld0Nsb25lUG9zaXRpb24oXHJcbiAgICAgIGVkZ2VzWzBdLnNvdXJjZUVuZHBvaW50KCkueCxcclxuICAgICAgZWRnZXNbMF0uc291cmNlRW5kcG9pbnQoKS55LFxyXG4gICAgICBlZGdlc1swXS50YXJnZXRFbmRwb2ludCgpLngsXHJcbiAgICAgIGVkZ2VzWzBdLnRhcmdldEVuZHBvaW50KCkueSxcclxuICAgICAgZGVzaXJlZERpc3RhbmNlLGVkZ2VzWzBdLnNvdXJjZSgpLmlkKCkgPT0gbm9kZS5pZCgpID8gXCJzb3VyY2VcIiA6IFwidGFyZ2V0XCJcclxuICAgICAgKTtcclxuICBcclxuICAgIHZhciBjbG9uZUVkZ2UgPSBlZGdlc1swXS5jbG9uZSgpO1xyXG4gICAgLy9jbG9uZUVkZ2UuZGF0YSgpLmlkID0gY2xvbmVFZGdlLmRhdGEoKS5pZCsgXCItXCIrbm9kZS5pZCgpKydjbG9uZS0wJztcclxuICAgIFxyXG4gICAgZWRnZXNbMF0ucmVtb3ZlKCk7XHJcbiAgICBjeS5hZGQoY2xvbmVFZGdlKTtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZSx0cnVlKTtcclxuICAgIG5vZGUucG9zaXRpb24oe1xyXG4gICAgICB4OiBuZXdQb3NpdGlvbi5jeCxcclxuICAgICAgeTogbmV3UG9zaXRpb24uY3lcclxuICAgIH0pO1xyXG4gIFxyXG4gICAgcmVzdWx0Lm9sZFggPSBvbGRYOyAgICBcclxuICAgIHJlc3VsdC5vbGRZID0gb2xkWTtcclxuICAgIHJlc3VsdC5ub2RlID0gbm9kZTtcclxuICAgIHJlc3VsdC5udW1iZXJPZkVkZ2VzID0gZWRnZXMubGVuZ3RoO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgfVxyXG5cclxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bkNsb25lSGlnaERlZ3JlZU5vZGUgPSBmdW5jdGlvbihwYXJhbSl7XHJcblxyXG4gICAgdmFyIG5vZGUgPSBwYXJhbS5ub2RlO1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2RlLGZhbHNlKTtcclxuICAgIG5vZGUucG9zaXRpb24oe1xyXG4gICAgICB4OiBwYXJhbS5vbGRYLFxyXG4gICAgICB5OiBwYXJhbS5vbGRZXHJcbiAgICB9KTtcclxuICBcclxuICAgIGZvcih2YXIgaSA9IDEgOyBpIDwgcGFyYW0ubnVtYmVyT2ZFZGdlcyA7IGkrKyl7XHJcbiAgICAgIHZhciBjbG9uZUlkID0gbm9kZS5pZCgpKydjbG9uZS0nK2k7XHJcbiAgICAgIHZhciBjbG9uZSA9IGN5LiQoXCIjXCIrY2xvbmVJZCk7XHJcbiAgICAgIHZhciBjbG9uZUVkZ2UgPSBjbG9uZS5jb25uZWN0ZWRFZGdlcygpWzBdO1xyXG4gICAgICB2YXIgZWRnZSA9IGNsb25lRWRnZS5jbG9uZSgpO1xyXG4gICAgICBcclxuICAgIFxyXG4gICAgICBpZihlZGdlLmRhdGEoKS5zb3VyY2UgPT0gY2xvbmVJZCl7ICAgICAgICBcclxuICAgICAgICBlZGdlLmRhdGEoKS5zb3VyY2UgPSBub2RlLmlkKCk7XHJcbiAgICAgICAgZWRnZS5kYXRhKCkucG9ydHNvdXJjZSA9ICBub2RlLmlkKCk7ICAgIFxyXG4gICAgICB9ZWxzZXsgICAgICAgICAgXHJcbiAgICAgICAgZWRnZS5kYXRhKCkudGFyZ2V0ID0gIG5vZGUuaWQoKTtcclxuICAgICAgICBlZGdlLmRhdGEoKS5wb3J0dGFyZ2V0ID0gIG5vZGUuaWQoKTsgICAgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNsb25lRWRnZS5yZW1vdmUoKTtcclxuICAgICAgY2xvbmUucmVtb3ZlKCk7XHJcbiAgICAgIFxyXG4gICAgICBjeS5hZGQoZWRnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5vZGU7XHJcbiAgfVxyXG5cclxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VNYXBUeXBlID0gZnVuY3Rpb24ocGFyYW0pe1xyXG4gICAgdmFyIHJlc3VsdCA9e307XHJcbiAgICB2YXIgY3VycmVudE1hcFR5cGUgPSBlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKTtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShwYXJhbS5tYXBUeXBlKTtcclxuICAgIHJlc3VsdC5tYXBUeXBlID0gY3VycmVudE1hcFR5cGU7XHJcbiAgICByZXN1bHQuY2FsbGJhY2sgPSBwYXJhbS5jYWxsYmFjaztcclxuICAgIHBhcmFtLmNhbGxiYWNrKCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNFeHRlbmRlcjtcclxufTtcclxuIl19
