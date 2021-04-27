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

    elementUtilities.createMetabolicReaction = function (inputs, outputs, reversible, regulator, regulatorMultimer, orientation) {
      // initialize some constants that need to be known to draw the brick
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

//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzZXF1YWwvaW5kZXguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLWV4dGVuZGVyLWZhY3RvcnkuanMiLCJzcmMvdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzLWZhY3RvcnkuanMiLCJzcmMvdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvc2JnbnZpei1pbnN0YW5jZS11dGlsaXRpZXMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvdG9wb2xvZ3ktZ3JvdXBpbmctZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvdXItYWN0aW9uLWZ1bmN0aW9ucy1leHRlbmRlci1mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeHpEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcndFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbjJDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcllBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIExvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IEpTIEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcy5mb3VuZGF0aW9uLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZpbHRlcmAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheUZpbHRlcihhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBcHBlbmRzIHRoZSBlbGVtZW50cyBvZiBgdmFsdWVzYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gYXBwZW5kLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5UHVzaChhcnJheSwgdmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIG9mZnNldCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W29mZnNldCArIGluZGV4XSA9IHZhbHVlc1tpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5zb21lYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTb21lKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgYGNhY2hlYCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgVGhlIGNhY2hlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGNhY2hlSGFzKGNhY2hlLCBrZXkpIHtcbiAgcmV0dXJuIGNhY2hlLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgbWFwYCB0byBpdHMga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUga2V5LXZhbHVlIHBhaXJzLlxuICovXG5mdW5jdGlvbiBtYXBUb0FycmF5KG1hcCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG1hcC5zaXplKTtcblxuICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW2tleSwgdmFsdWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLFxuICAgIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBTeW1ib2wgPSByb290LlN5bWJvbCxcbiAgICBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5LFxuICAgIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGUsXG4gICAgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2UsXG4gICAgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcbiAgICBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpLFxuICAgIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyksXG4gICAgUHJvbWlzZSA9IGdldE5hdGl2ZShyb290LCAnUHJvbWlzZScpLFxuICAgIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0JyksXG4gICAgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpLFxuICAgIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy4gKi9cbnZhciBkYXRhVmlld0N0b3JTdHJpbmcgPSB0b1NvdXJjZShEYXRhVmlldyksXG4gICAgbWFwQ3RvclN0cmluZyA9IHRvU291cmNlKE1hcCksXG4gICAgcHJvbWlzZUN0b3JTdHJpbmcgPSB0b1NvdXJjZShQcm9taXNlKSxcbiAgICBzZXRDdG9yU3RyaW5nID0gdG9Tb3VyY2UoU2V0KSxcbiAgICB3ZWFrTWFwQ3RvclN0cmluZyA9IHRvU291cmNlKFdlYWtNYXApO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuc2l6ZSA9IDA7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxuLyoqXG4gKlxuICogQ3JlYXRlcyBhbiBhcnJheSBjYWNoZSBvYmplY3QgdG8gc3RvcmUgdW5pcXVlIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTZXRDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPT0gbnVsbCA/IDAgOiB2YWx1ZXMubGVuZ3RoO1xuXG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGU7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdGhpcy5hZGQodmFsdWVzW2luZGV4XSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGRzIGB2YWx1ZWAgdG8gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBhZGRcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQGFsaWFzIHB1c2hcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNhY2hlLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlQWRkKHZhbHVlKSB7XG4gIHRoaXMuX19kYXRhX18uc2V0KHZhbHVlLCBIQVNIX1VOREVGSU5FRCk7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGluIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlSGFzKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyh2YWx1ZSk7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTZXRDYWNoZWAuXG5TZXRDYWNoZS5wcm90b3R5cGUuYWRkID0gU2V0Q2FjaGUucHJvdG90eXBlLnB1c2ggPSBzZXRDYWNoZUFkZDtcblNldENhY2hlLnByb3RvdHlwZS5oYXMgPSBzZXRDYWNoZUhhcztcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFN0YWNrYC5cblN0YWNrLnByb3RvdHlwZS5jbGVhciA9IHN0YWNrQ2xlYXI7XG5TdGFjay5wcm90b3R5cGVbJ2RlbGV0ZSddID0gc3RhY2tEZWxldGU7XG5TdGFjay5wcm90b3R5cGUuZ2V0ID0gc3RhY2tHZXQ7XG5TdGFjay5wcm90b3R5cGUuaGFzID0gc3RhY2tIYXM7XG5TdGFjay5wcm90b3R5cGUuc2V0ID0gc3RhY2tTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNFcXVhbGAgd2hpY2ggc3VwcG9ydHMgcGFydGlhbCBjb21wYXJpc29uc1xuICogYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuXG4gKiAgMSAtIFVub3JkZXJlZCBjb21wYXJpc29uXG4gKiAgMiAtIFBhcnRpYWwgY29tcGFyaXNvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKHZhbHVlID09PSBvdGhlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IG90aGVyID09IG51bGwgfHwgKCFpc09iamVjdExpa2UodmFsdWUpICYmICFpc09iamVjdExpa2Uob3RoZXIpKSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyO1xuICB9XG4gIHJldHVybiBiYXNlSXNFcXVhbERlZXAodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBiYXNlSXNFcXVhbCwgc3RhY2spO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgY29tcGFyZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsRGVlcChvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBvYmpJc0FyciA9IGlzQXJyYXkob2JqZWN0KSxcbiAgICAgIG90aElzQXJyID0gaXNBcnJheShvdGhlciksXG4gICAgICBvYmpUYWcgPSBvYmpJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG9iamVjdCksXG4gICAgICBvdGhUYWcgPSBvdGhJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG90aGVyKTtcblxuICBvYmpUYWcgPSBvYmpUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG9ialRhZztcbiAgb3RoVGFnID0gb3RoVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvdGhUYWc7XG5cbiAgdmFyIG9iaklzT2JqID0gb2JqVGFnID09IG9iamVjdFRhZyxcbiAgICAgIG90aElzT2JqID0gb3RoVGFnID09IG9iamVjdFRhZyxcbiAgICAgIGlzU2FtZVRhZyA9IG9ialRhZyA9PSBvdGhUYWc7XG5cbiAgaWYgKGlzU2FtZVRhZyAmJiBpc0J1ZmZlcihvYmplY3QpKSB7XG4gICAgaWYgKCFpc0J1ZmZlcihvdGhlcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgb2JqSXNBcnIgPSB0cnVlO1xuICAgIG9iaklzT2JqID0gZmFsc2U7XG4gIH1cbiAgaWYgKGlzU2FtZVRhZyAmJiAhb2JqSXNPYmopIHtcbiAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgIHJldHVybiAob2JqSXNBcnIgfHwgaXNUeXBlZEFycmF5KG9iamVjdCkpXG4gICAgICA/IGVxdWFsQXJyYXlzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spXG4gICAgICA6IGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgfVxuICBpZiAoIShiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcpKSB7XG4gICAgdmFyIG9iaklzV3JhcHBlZCA9IG9iaklzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgb3RoSXNXcmFwcGVkID0gb3RoSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICBpZiAob2JqSXNXcmFwcGVkIHx8IG90aElzV3JhcHBlZCkge1xuICAgICAgdmFyIG9ialVud3JhcHBlZCA9IG9iaklzV3JhcHBlZCA/IG9iamVjdC52YWx1ZSgpIDogb2JqZWN0LFxuICAgICAgICAgIG90aFVud3JhcHBlZCA9IG90aElzV3JhcHBlZCA/IG90aGVyLnZhbHVlKCkgOiBvdGhlcjtcblxuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIHJldHVybiBlcXVhbEZ1bmMob2JqVW53cmFwcGVkLCBvdGhVbndyYXBwZWQsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFpc1NhbWVUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgcmV0dXJuIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBhcnJheXMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7QXJyYXl9IG90aGVyIFRoZSBvdGhlciBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgYXJyYXlgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFycmF5cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEFycmF5cyhhcnJheSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIGFyckxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIG90aExlbmd0aCA9IG90aGVyLmxlbmd0aDtcblxuICBpZiAoYXJyTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhKGlzUGFydGlhbCAmJiBvdGhMZW5ndGggPiBhcnJMZW5ndGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQoYXJyYXkpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSB0cnVlLFxuICAgICAgc2VlbiA9IChiaXRtYXNrICYgQ09NUEFSRV9VTk9SREVSRURfRkxBRykgPyBuZXcgU2V0Q2FjaGUgOiB1bmRlZmluZWQ7XG5cbiAgc3RhY2suc2V0KGFycmF5LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgYXJyYXkpO1xuXG4gIC8vIElnbm9yZSBub24taW5kZXggcHJvcGVydGllcy5cbiAgd2hpbGUgKCsraW5kZXggPCBhcnJMZW5ndGgpIHtcbiAgICB2YXIgYXJyVmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJbaW5kZXhdO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIGFyclZhbHVlLCBpbmRleCwgb3RoZXIsIGFycmF5LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKGFyclZhbHVlLCBvdGhWYWx1ZSwgaW5kZXgsIGFycmF5LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICBpZiAoY29tcGFyZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGNvbXBhcmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoc2Vlbikge1xuICAgICAgaWYgKCFhcnJheVNvbWUob3RoZXIsIGZ1bmN0aW9uKG90aFZhbHVlLCBvdGhJbmRleCkge1xuICAgICAgICAgICAgaWYgKCFjYWNoZUhhcyhzZWVuLCBvdGhJbmRleCkgJiZcbiAgICAgICAgICAgICAgICAoYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlZW4ucHVzaChvdGhJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIShcbiAgICAgICAgICBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHxcbiAgICAgICAgICAgIGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKVxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10oYXJyYXkpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgY29tcGFyaW5nIG9iamVjdHMgb2ZcbiAqIHRoZSBzYW1lIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjb21wYXJpbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdHMgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIHRhZywgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgZGF0YVZpZXdUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgKG9iamVjdC5ieXRlT2Zmc2V0ICE9IG90aGVyLmJ5dGVPZmZzZXQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG9iamVjdCA9IG9iamVjdC5idWZmZXI7XG4gICAgICBvdGhlciA9IG90aGVyLmJ1ZmZlcjtcblxuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgIWVxdWFsRnVuYyhuZXcgVWludDhBcnJheShvYmplY3QpLCBuZXcgVWludDhBcnJheShvdGhlcikpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICAgIC8vIENvZXJjZSBib29sZWFucyB0byBgMWAgb3IgYDBgIGFuZCBkYXRlcyB0byBtaWxsaXNlY29uZHMuXG4gICAgICAvLyBJbnZhbGlkIGRhdGVzIGFyZSBjb2VyY2VkIHRvIGBOYU5gLlxuICAgICAgcmV0dXJuIGVxKCtvYmplY3QsICtvdGhlcik7XG5cbiAgICBjYXNlIGVycm9yVGFnOlxuICAgICAgcmV0dXJuIG9iamVjdC5uYW1lID09IG90aGVyLm5hbWUgJiYgb2JqZWN0Lm1lc3NhZ2UgPT0gb3RoZXIubWVzc2FnZTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgLy8gQ29lcmNlIHJlZ2V4ZXMgdG8gc3RyaW5ncyBhbmQgdHJlYXQgc3RyaW5ncywgcHJpbWl0aXZlcyBhbmQgb2JqZWN0cyxcbiAgICAgIC8vIGFzIGVxdWFsLiBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXJlZ2V4cC5wcm90b3R5cGUudG9zdHJpbmdcbiAgICAgIC8vIGZvciBtb3JlIGRldGFpbHMuXG4gICAgICByZXR1cm4gb2JqZWN0ID09IChvdGhlciArICcnKTtcblxuICAgIGNhc2UgbWFwVGFnOlxuICAgICAgdmFyIGNvbnZlcnQgPSBtYXBUb0FycmF5O1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHO1xuICAgICAgY29udmVydCB8fCAoY29udmVydCA9IHNldFRvQXJyYXkpO1xuXG4gICAgICBpZiAob2JqZWN0LnNpemUgIT0gb3RoZXIuc2l6ZSAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgICAgIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gICAgICBpZiAoc3RhY2tlZCkge1xuICAgICAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgICAgIH1cbiAgICAgIGJpdG1hc2sgfD0gQ09NUEFSRV9VTk9SREVSRURfRkxBRztcblxuICAgICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gICAgICB2YXIgcmVzdWx0ID0gZXF1YWxBcnJheXMoY29udmVydChvYmplY3QpLCBjb252ZXJ0KG90aGVyKSwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG4gICAgICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIGlmIChzeW1ib2xWYWx1ZU9mKSB7XG4gICAgICAgIHJldHVybiBzeW1ib2xWYWx1ZU9mLmNhbGwob2JqZWN0KSA9PSBzeW1ib2xWYWx1ZU9mLmNhbGwob3RoZXIpO1xuICAgICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIG9iamVjdHMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIG9ialByb3BzID0gZ2V0QWxsS2V5cyhvYmplY3QpLFxuICAgICAgb2JqTGVuZ3RoID0gb2JqUHJvcHMubGVuZ3RoLFxuICAgICAgb3RoUHJvcHMgPSBnZXRBbGxLZXlzKG90aGVyKSxcbiAgICAgIG90aExlbmd0aCA9IG90aFByb3BzLmxlbmd0aDtcblxuICBpZiAob2JqTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBpbmRleCA9IG9iakxlbmd0aDtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIGlmICghKGlzUGFydGlhbCA/IGtleSBpbiBvdGhlciA6IGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsIGtleSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciByZXN1bHQgPSB0cnVlO1xuICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgb2JqZWN0KTtcblxuICB2YXIgc2tpcEN0b3IgPSBpc1BhcnRpYWw7XG4gIHdoaWxlICgrK2luZGV4IDwgb2JqTGVuZ3RoKSB7XG4gICAga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2tleV07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgb2JqVmFsdWUsIGtleSwgb3RoZXIsIG9iamVjdCwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihvYmpWYWx1ZSwgb3RoVmFsdWUsIGtleSwgb2JqZWN0LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoIShjb21wYXJlZCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyAob2JqVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhvYmpWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSlcbiAgICAgICAgICA6IGNvbXBhcmVkXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHNraXBDdG9yIHx8IChza2lwQ3RvciA9IGtleSA9PSAnY29uc3RydWN0b3InKTtcbiAgfVxuICBpZiAocmVzdWx0ICYmICFza2lwQ3Rvcikge1xuICAgIHZhciBvYmpDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgICBvdGhDdG9yID0gb3RoZXIuY29uc3RydWN0b3I7XG5cbiAgICAvLyBOb24gYE9iamVjdGAgb2JqZWN0IGluc3RhbmNlcyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVhbC5cbiAgICBpZiAob2JqQ3RvciAhPSBvdGhDdG9yICYmXG4gICAgICAgICgnY29uc3RydWN0b3InIGluIG9iamVjdCAmJiAnY29uc3RydWN0b3InIGluIG90aGVyKSAmJlxuICAgICAgICAhKHR5cGVvZiBvYmpDdG9yID09ICdmdW5jdGlvbicgJiYgb2JqQ3RvciBpbnN0YW5jZW9mIG9iakN0b3IgJiZcbiAgICAgICAgICB0eXBlb2Ygb3RoQ3RvciA9PSAnZnVuY3Rpb24nICYmIG90aEN0b3IgaW5zdGFuY2VvZiBvdGhDdG9yKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXMob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXMsIGdldFN5bWJvbHMpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5RmlsdGVyKG5hdGl2ZUdldFN5bWJvbHMob2JqZWN0KSwgZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBzeW1ib2wpO1xuICB9KTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGRlZXAgY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlXG4gKiBlcXVpdmFsZW50LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBzdXBwb3J0cyBjb21wYXJpbmcgYXJyYXlzLCBhcnJheSBidWZmZXJzLCBib29sZWFucyxcbiAqIGRhdGUgb2JqZWN0cywgZXJyb3Igb2JqZWN0cywgbWFwcywgbnVtYmVycywgYE9iamVjdGAgb2JqZWN0cywgcmVnZXhlcyxcbiAqIHNldHMsIHN0cmluZ3MsIHN5bWJvbHMsIGFuZCB0eXBlZCBhcnJheXMuIGBPYmplY3RgIG9iamVjdHMgYXJlIGNvbXBhcmVkXG4gKiBieSB0aGVpciBvd24sIG5vdCBpbmhlcml0ZWQsIGVudW1lcmFibGUgcHJvcGVydGllcy4gRnVuY3Rpb25zIGFuZCBET01cbiAqIG5vZGVzIGFyZSBjb21wYXJlZCBieSBzdHJpY3QgZXF1YWxpdHksIGkuZS4gYD09PWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uaXNFcXVhbChvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBvYmplY3QgPT09IG90aGVyO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFcXVhbCh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYSBuZXcgZW1wdHkgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBlbXB0eSBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5cyA9IF8udGltZXMoMiwgXy5zdHViQXJyYXkpO1xuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5cyk7XG4gKiAvLyA9PiBbW10sIFtdXVxuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5c1swXSA9PT0gYXJyYXlzWzFdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN0dWJBcnJheSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFcXVhbDtcbiIsIihmdW5jdGlvbigpe1xuICB2YXIgY2hpc2UgPSBmdW5jdGlvbihfb3B0aW9ucykge1xuXG4gICAgdmFyIHBhcmFtID0ge307XG5cbiAgICAvLyBBY2Nlc3MgdGhlIGxpYnNcbiAgICB2YXIgbGlicyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG5cbiAgICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvb3B0aW9uLXV0aWxpdGllcy1mYWN0b3J5JykoKTtcbiAgICB2YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zKF9vcHRpb25zKTsgLy8gRXh0ZW5kcyB0aGUgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcblxuICAgIC8vIENyZWF0ZSBhbiBzYmdudml6IGluc3RhbmNlXG4gICAgdmFyIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3NiZ252aXotaW5zdGFuY2UtdXRpbGl0aWVzLWZhY3RvcnknKSgpO1xuICAgIHZhciBzYmdudml6SW5zdGFuY2UgPSBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXMob3B0aW9ucyk7XG5cbiAgICAvLyBSZWdpc3RlciB1bmRvL3JlZG8gYWN0aW9uc1xuICAgIHZhciByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3JlZ2lzdGVyLXVuZG8tcmVkby1hY3Rpb25zLWZhY3RvcnknKSgpO1xuXG4gICAgdmFyIG1haW5VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy1mYWN0b3J5JykoKTtcbiAgICB2YXIgZWxlbWVudFV0aWxpdGllc0V4dGVuZGVyID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvZWxlbWVudC11dGlsaXRpZXMtZXh0ZW5kZXItZmFjdG9yeScpKCk7XG4gICAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zRXh0ZW5kZXIgPSByZXF1aXJlKCcuL3V0aWxpdGllcy91ci1hY3Rpb24tZnVuY3Rpb25zLWV4dGVuZGVyLWZhY3RvcnknKSgpO1xuICAgIHZhciBzaWZUb3BvbG9neUdyb3VwaW5nID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdG9wb2xvZ3ktZ3JvdXBpbmctZmFjdG9yeScpKCk7XG5cbiAgICB2YXIgZWxlbWVudFV0aWxpdGllcyA9ICBzYmdudml6SW5zdGFuY2UuZWxlbWVudFV0aWxpdGllcztcbiAgICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSBzYmdudml6SW5zdGFuY2UudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG5cbiAgICBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMgPSBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXM7XG4gICAgcGFyYW0ub3B0aW9uVXRpbGl0aWVzID0gb3B0aW9uVXRpbGl0aWVzO1xuICAgIHBhcmFtLmVsZW1lbnRVdGlsaXRpZXMgPSBlbGVtZW50VXRpbGl0aWVzO1xuICAgIHBhcmFtLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG4gICAgcGFyYW0uc2lmVG9wb2xvZ3lHcm91cGluZyA9IHNpZlRvcG9sb2d5R3JvdXBpbmc7XG5cbiAgICB2YXIgc2hvdWxkQXBwbHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwYXJhbS5lbGVtZW50VXRpbGl0aWVzLm1hcFR5cGUgPT09ICdTSUYnO1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc0V4dGVuZGVyKHBhcmFtKTtcbiAgICBlbGVtZW50VXRpbGl0aWVzRXh0ZW5kZXIocGFyYW0pO1xuICAgIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zKHBhcmFtKTtcbiAgICBtYWluVXRpbGl0aWVzKHBhcmFtKTtcbiAgICBzaWZUb3BvbG9neUdyb3VwaW5nKHBhcmFtLCB7bWV0YUVkZ2VJZGVudGlmaWVyOiAnc2lmLW1ldGEnLCBsb2NrR3JhcGhUb3BvbG9neTogdHJ1ZSwgc2hvdWxkQXBwbHl9KTtcblxuICAgIC8vIEV4cG9zZSB0aGUgYXBpXG4gICAgdmFyIGFwaSA9IHt9O1xuXG4gICAgLy8gRXhwb3NlIHRoZSBwcm9wZXJ0aWVzIGluaGVyaXRlZCBmcm9tIHNiZ252aXpcbiAgICAvLyB0aGVuIG92ZXJyaWRlIHNvbWUgb2YgdGhlc2UgcHJvcGVydGllcyBhbmQgZXhwb3NlIHNvbWUgbmV3IHByb3BlcnRpZXNcbiAgICBmb3IgKHZhciBwcm9wIGluIHNiZ252aXpJbnN0YW5jZSkge1xuICAgICAgYXBpW3Byb3BdID0gc2JnbnZpekluc3RhbmNlW3Byb3BdO1xuICAgIH1cblxuICAgIC8vIEV4cG9zZSBlYWNoIG1haW4gdXRpbGl0eSBzZXBlcmF0ZWx5XG4gICAgZm9yICh2YXIgcHJvcCBpbiBtYWluVXRpbGl0aWVzKSB7XG4gICAgICBhcGlbcHJvcF0gPSBtYWluVXRpbGl0aWVzW3Byb3BdO1xuICAgIH1cblxuICAgIC8vIEV4cG9zZSBnZXRTYmdudml6SW5zdGFuY2UoKVxuICAgIGFwaS5nZXRTYmdudml6SW5zdGFuY2UgPSBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0SW5zdGFuY2U7XG5cbiAgICAvLyBFeHBvc2UgZWxlbWVudFV0aWxpdGllcyBhbmQgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgYXMgaXNcbiAgICBhcGkuZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XG4gICAgYXBpLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG4gICAgYXBpLnNpZlRvcG9sb2d5R3JvdXBpbmcgPSBzaWZUb3BvbG9neUdyb3VwaW5nO1xuXG4gICAgcmV0dXJuIGFwaTtcbiAgfTtcblxuICAvLyBSZWdpc3RlciBjaGlzZSB3aXRoIGdpdmVuIGxpYnJhcmllc1xuICBjaGlzZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChfbGlicykge1xuXG4gICAgdmFyIGxpYnMgPSB7fTtcbiAgICBsaWJzLmpRdWVyeSA9IF9saWJzLmpRdWVyeSB8fCBqUXVlcnk7XG4gICAgbGlicy5jeXRvc2NhcGUgPSBfbGlicy5jeXRvc2NhcGUgfHwgY3l0b3NjYXBlO1xuICAgIGxpYnMuc2JnbnZpeiA9IF9saWJzLnNiZ252aXogfHwgc2JnbnZpejtcbiAgICBsaWJzLnNhdmVBcyA9IF9saWJzLmZpbGVzYXZlciA/IF9saWJzLmZpbGVzYXZlci5zYXZlQXMgOiBzYXZlQXM7XG5cbiAgICBsaWJzLnNiZ252aXoucmVnaXN0ZXIoX2xpYnMpOyAvLyBSZWdpc3RlciBzYmdudml6IHdpdGggdGhlIGdpdmVuIGxpYnNcblxuICAgIC8vIGluaGVyaXQgZXhwb3NlZCBzdGF0aWMgcHJvcGVydGllcyBvZiBzYmdudml6IG90aGVyIHRoYW4gcmVnaXN0ZXJcbiAgICBmb3IgKHZhciBwcm9wIGluIGxpYnMuc2JnbnZpeikge1xuICAgICAgaWYgKHByb3AgIT09ICdyZWdpc3RlcicpIHtcbiAgICAgICAgY2hpc2VbcHJvcF0gPSBsaWJzLnNiZ252aXpbcHJvcF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBsaWJyYXJpZXMgdG8gYWNjZXNzIHRoZW0gZnJvbSBhbnkgZmlsZVxuICAgIHZhciBsaWJVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9saWItdXRpbGl0aWVzJyk7XG4gICAgbGliVXRpbGl0aWVzLnNldExpYnMobGlicyk7XG4gIH07XG5cbiAgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGNoaXNlO1xuICB9XG59KSgpO1xuIiwiLy8gRXh0ZW5kcyBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXNcbnZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyIGpRdWVyeSA9ICQgPSBsaWJzLmpRdWVyeTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvcHRpb25zLCBzYmdudml6SW5zdGFuY2UsIGVsZW1lbnRVdGlsaXRpZXMsIGN5O1xuXG4gIGZ1bmN0aW9uIGVsZW1lbnRVdGlsaXRpZXNFeHRlbmRlciAocGFyYW0pIHtcbiAgICBzYmdudml6SW5zdGFuY2UgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0SW5zdGFuY2UoKTtcbiAgICBvcHRpb25zID0gcGFyYW0ub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcbiAgICBlbGVtZW50VXRpbGl0aWVzID0gc2JnbnZpekluc3RhbmNlLmVsZW1lbnRVdGlsaXRpZXM7XG4gICAgY3kgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0Q3koKTtcblxuICAgIGV4dGVuZCgpO1xuXG4gICAgLy8gUmV0dXJuIHRoZSBleHRlbmRlZCBlbGVtZW50VXRpbGl0aWVzXG4gICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXM7XG4gIH1cblxuICAvLyBFeHRlbmRzIGVsZW1lbnRVdGlsaXRpZXMgd2l0aCBjaGlzZSBzcGVjaWZpYyBmYWNpbGl0aWVzXG4gIGZ1bmN0aW9uIGV4dGVuZCAoKSB7XG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIEFkZCByZW1vdmUgdXRpbGl0aWVzXG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUgPSBmdW5jdGlvbiAoeCwgeSwgbm9kZVBhcmFtcywgaWQsIHBhcmVudCwgdmlzaWJpbGl0eSkge1xuICAgICAgaWYgKHR5cGVvZiBub2RlUGFyYW1zICE9ICdvYmplY3QnKXtcbiAgICAgICAgdmFyIHNiZ25jbGFzcyA9IG5vZGVQYXJhbXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzYmduY2xhc3MgPSBub2RlUGFyYW1zLmNsYXNzO1xuICAgICAgICAgIHZhciBsYW5ndWFnZSA9IG5vZGVQYXJhbXMubGFuZ3VhZ2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBjc3MgPSB7fTtcbiAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIHNwZWNpZmljIGRlZmF1bHQgd2lkdGggb3IgaGVpZ2h0IGZvclxuICAgICAgLy8gc2JnbmNsYXNzIHRoZXNlIHNpemVzIGFyZSB1c2VkXG4gICAgICB2YXIgZGVmYXVsdFdpZHRoID0gNTA7XG4gICAgICB2YXIgZGVmYXVsdEhlaWdodCA9IDUwO1xuXG4gICAgICBpZiAodmlzaWJpbGl0eSkge1xuICAgICAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICBjbGFzczogc2JnbmNsYXNzLFxuICAgIFx0ICBsYW5ndWFnZTogbGFuZ3VhZ2UsXG4gICAgICAgIGJib3g6IHtcbiAgICAgICAgICB3OiBkZWZhdWx0V2lkdGgsXG4gICAgICAgICAgaDogZGVmYXVsdEhlaWdodCxcbiAgICAgICAgICB4OiB4LFxuICAgICAgICAgIHk6IHlcbiAgICAgICAgfSxcbiAgICAgICAgc3RhdGVzYW5kaW5mb3M6IFtdLFxuICAgICAgICBwb3J0czogW11cbiAgICAgIH07XG5cbiAgICAgIGlmKGlkKSB7XG4gICAgICAgIGRhdGEuaWQgPSBpZDtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkYXRhLmlkID0gZWxlbWVudFV0aWxpdGllcy5nZW5lcmF0ZU5vZGVJZCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGRhdGEucGFyZW50ID0gcGFyZW50O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmV4dGVuZE5vZGVEYXRhV2l0aENsYXNzRGVmYXVsdHMoIGRhdGEsIHNiZ25jbGFzcyApO1xuXG4gICAgICAvLyBzb21lIGRlZmF1bHRzIGFyZSBub3Qgc2V0IGJ5IGV4dGVuZE5vZGVEYXRhV2l0aENsYXNzRGVmYXVsdHMoKVxuICAgICAgdmFyIGRlZmF1bHRzID0gdGhpcy5nZXREZWZhdWx0UHJvcGVydGllcyggc2JnbmNsYXNzICk7XG5cbiAgICAgIGlmICggZGVmYXVsdHNbICdtdWx0aW1lcicgXSApIHtcbiAgICAgICAgZGF0YS5jbGFzcyArPSAnIG11bHRpbWVyJztcbiAgICAgIH1cblxuICAgICAgaWYgKCBkZWZhdWx0c1sgJ2Nsb25lbWFya2VyJyBdICkge1xuICAgICAgICBkYXRhWyAnY2xvbmVtYXJrZXInIF0gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBkYXRhLmJib3hbICd3JyBdID0gZGVmYXVsdHNbICd3aWR0aCcgXTtcbiAgICAgIGRhdGEuYmJveFsgJ2gnIF0gPSBkZWZhdWx0c1sgJ2hlaWdodCcgXTtcblxuICAgICAgdmFyIGVsZXMgPSBjeS5hZGQoe1xuICAgICAgICBncm91cDogXCJub2Rlc1wiLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBjc3M6IGNzcyxcbiAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICB4OiB4LFxuICAgICAgICAgIHk6IHlcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBuZXdOb2RlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xuICAgICAgLy8gR2V0IHRoZSBkZWZhdWx0IHBvcnRzIG9yZGVyaW5nIGZvciB0aGUgbm9kZXMgd2l0aCBnaXZlbiBzYmduY2xhc3NcbiAgICAgIHZhciBvcmRlcmluZyA9IGRlZmF1bHRzWydwb3J0cy1vcmRlcmluZyddO1xuXG4gICAgICAvLyBJZiB0aGVyZSBpcyBhIGRlZmF1bHQgcG9ydHMgb3JkZXJpbmcgZm9yIHRoZSBub2RlcyB3aXRoIGdpdmVuIHNiZ25jbGFzcyBhbmQgaXQgaXMgZGlmZmVyZW50IHRoYW4gJ25vbmUnIHNldCB0aGUgcG9ydHMgb3JkZXJpbmcgdG8gdGhhdCBvcmRlcmluZ1xuICAgICAgaWYgKG9yZGVyaW5nICYmIG9yZGVyaW5nICE9PSAnbm9uZScpIHtcbiAgICAgICAgdGhpcy5zZXRQb3J0c09yZGVyaW5nKG5ld05vZGUsIG9yZGVyaW5nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxhbmd1YWdlID09IFwiQUZcIiAmJiAhZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlTXVsdGlwbGVVbml0T2ZJbmZvcm1hdGlvbihuZXdOb2RlKSl7XG4gICAgICAgIGlmIChzYmduY2xhc3MgIT0gXCJCQSBwbGFpblwiKSB7IC8vIGlmIEFGIG5vZGUgY2FuIGhhdmUgbGFiZWwgaS5lOiBub3QgcGxhaW4gYmlvbG9naWNhbCBhY3Rpdml0eVxuICAgICAgICAgIHZhciB1b2lfb2JqID0ge1xuICAgICAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICB1b2lfb2JqLmxhYmVsID0ge1xuICAgICAgICAgICAgdGV4dDogXCJcIlxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB1b2lfb2JqLmJib3ggPSB7XG4gICAgICAgICAgICAgdzogMTIsXG4gICAgICAgICAgICAgaDogMTJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobmV3Tm9kZSwgdW9pX29iaik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbm9kZSBiZyBpbWFnZSB3YXMgdW5leHBlY3RlZGx5IG5vdCByZW5kZXJlZCB1bnRpbCBpdCBpcyBjbGlja2VkXG4gICAgICAvLyB1c2UgdGhpcyBkaXJ0eSBoYWNrIHVudGlsIGZpbmRpbmcgYSBzb2x1dGlvbiB0byB0aGUgcHJvYmxlbVxuICAgICAgdmFyIGJnSW1hZ2UgPSBuZXdOb2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKTtcbiAgICAgIGlmICggYmdJbWFnZSApIHtcbiAgICAgICAgbmV3Tm9kZS5kYXRhKCAnYmFja2dyb3VuZC1pbWFnZScsIGJnSW1hZ2UgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ld05vZGU7XG4gICAgfTtcblxuICAgIC8vU2F2ZXMgb2xkIGF1eCB1bml0cyBvZiBnaXZlbiBub2RlXG4gICAgZWxlbWVudFV0aWxpdGllcy5zYXZlVW5pdHMgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICB2YXIgdGVtcERhdGEgPSBbXTtcbiAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykuZm9yRWFjaCggZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgIHRlbXBEYXRhLnB1c2goe1xuICAgICAgICAgIHg6IGVsZS5iYm94LngsXG4gICAgICAgICAgeTogZWxlLmJib3gueSxcbiAgICAgICAgICBhbmNob3JTaWRlOiBlbGUuYW5jaG9yU2lkZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGluZGV4Kys7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0ZW1wRGF0YTtcbiAgICB9O1xuXG4gICAgLy9SZXN0b3JlcyBmcm9tIGdpdmVuIGRhdGFcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVVbml0cyA9IGZ1bmN0aW9uKG5vZGUsIGRhdGEpIHtcbiAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykuZm9yRWFjaCggZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBlbGUuYmJveC54ID0gZGF0YVtpbmRleF0ueDtcbiAgICAgICAgICBlbGUuYmJveC55ID0gZGF0YVtpbmRleF0ueVxuICAgICAgICAgIHZhciBhbmNob3JTaWRlID0gZWxlLmFuY2hvclNpZGU7XG4gICAgICAgICAgZWxlLmFuY2hvclNpZGUgPSBkYXRhW2luZGV4XS5hbmNob3JTaWRlO1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW9kaWZ5VW5pdHMobm9kZSwgZWxlLCBhbmNob3JTaWRlKTtcbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy9Nb2RpZnkgYXV4IHVuaXQgbGF5b3V0c1xuICAgIGVsZW1lbnRVdGlsaXRpZXMubW9kaWZ5VW5pdHMgPSBmdW5jdGlvbiAobm9kZSwgZWxlLCBhbmNob3JTaWRlKSB7XG4gICAgICBpbnN0YW5jZS5jbGFzc2VzLkF1eFVuaXRMYXlvdXQubW9kaWZ5VW5pdHMobm9kZSwgZWxlLCBhbmNob3JTaWRlLCBjeSk7XG4gICAgfTtcblxuXG4gICAgLy9Gb3IgcmV2ZXJzaWJsZSByZWFjdGlvbnMgYm90aCBzaWRlIG9mIHRoZSBwcm9jZXNzIGNhbiBiZSBpbnB1dC9vdXRwdXRcbiAgICAvL0dyb3VwIElEIGlkZW50aWZpZXMgdG8gd2hpY2ggZ3JvdXAgb2Ygbm9kZXMgdGhlIGVkZ2UgaXMgZ29pbmcgdG8gYmUgY29ubmVjdGVkIGZvciByZXZlcnNpYmxlIHJlYWN0aW9ucygwOiBncm91cCAxIElEIGFuZCAxOmdyb3VwIDIgSUQpXG4gICAgZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlID0gZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0LCBlZGdlUGFyYW1zLCBpZCwgdmlzaWJpbGl0eSwgZ3JvdXBJRCApIHtcbiAgICAgIGlmICh0eXBlb2YgZWRnZVBhcmFtcyAhPSAnb2JqZWN0Jyl7XG4gICAgICAgIHZhciBzYmduY2xhc3MgPSBlZGdlUGFyYW1zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2JnbmNsYXNzID0gZWRnZVBhcmFtcy5jbGFzcztcbiAgICAgICAgICB2YXIgbGFuZ3VhZ2UgPSBlZGdlUGFyYW1zLmxhbmd1YWdlO1xuICAgICAgfVxuXG4gICAgICB2YXIgY3NzID0ge307XG5cbiAgICAgIGlmICh2aXNpYmlsaXR5KSB7XG4gICAgICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgY2xhc3M6IHNiZ25jbGFzcyxcbiAgICAgICAgICBsYW5ndWFnZTogbGFuZ3VhZ2UsXG4gICAgICB9O1xuXG4gICAgICB2YXIgZGVmYXVsdHMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBzYmduY2xhc3MgKTtcblxuICAgICAgLy8gZXh0ZW5kIHRoZSBkYXRhIHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzIG9mIGVkZ2Ugc3R5bGVcbiAgICAgIE9iamVjdC5rZXlzKCBkZWZhdWx0cyApLmZvckVhY2goIGZ1bmN0aW9uKCBwcm9wICkge1xuICAgICAgICBkYXRhWyBwcm9wIF0gPSBkZWZhdWx0c1sgcHJvcCBdO1xuICAgICAgfSApO1xuXG4gICAgICBpZihpZCkge1xuICAgICAgICBkYXRhLmlkID0gaWQ7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZGF0YS5pZCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2VuZXJhdGVFZGdlSWQoKTtcbiAgICAgIH1cblxuICAgICAgaWYoZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkNhcmRpbmFsaXR5KHNiZ25jbGFzcykpe1xuICAgICAgICBkYXRhLmNhcmRpbmFsaXR5ID0gMDtcbiAgICAgIH1cblxuICAgICAgdmFyIHNvdXJjZU5vZGUgPSBjeS5nZXRFbGVtZW50QnlJZChzb3VyY2UpOyAvLyBUaGUgb3JpZ2luYWwgc291cmNlIG5vZGVcbiAgICAgIHZhciB0YXJnZXROb2RlID0gY3kuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KTsgLy8gVGhlIG9yaWdpbmFsIHRhcmdldCBub2RlXG4gICAgICB2YXIgc291cmNlSGFzUG9ydHMgPSBzb3VyY2VOb2RlLmRhdGEoJ3BvcnRzJykubGVuZ3RoID09PSAyO1xuICAgICAgdmFyIHRhcmdldEhhc1BvcnRzID0gdGFyZ2V0Tm9kZS5kYXRhKCdwb3J0cycpLmxlbmd0aCA9PT0gMjtcbiAgICAgIC8vIFRoZSBwb3J0c291cmNlIGFuZCBwb3J0dGFyZ2V0IHZhcmlhYmxlc1xuICAgICAgdmFyIHBvcnRzb3VyY2U7XG4gICAgICB2YXIgcG9ydHRhcmdldDtcblxuICAgICAgLypcbiAgICAgICAqIEdldCBpbnB1dC9vdXRwdXQgcG9ydCBpZCdzIG9mIGEgbm9kZSB3aXRoIHRoZSBhc3N1bXB0aW9uIHRoYXQgdGhlIG5vZGUgaGFzIHZhbGlkIHBvcnRzLlxuICAgICAgICovXG4gICAgICB2YXIgZ2V0SU9Qb3J0SWRzID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIG5vZGVJbnB1dFBvcnRJZCwgbm9kZU91dHB1dFBvcnRJZDtcbiAgICAgICAgdmFyIG5vZGVQb3J0c09yZGVyaW5nID0gc2JnbnZpekluc3RhbmNlLmVsZW1lbnRVdGlsaXRpZXMuZ2V0UG9ydHNPcmRlcmluZyhub2RlKTtcbiAgICAgICAgdmFyIG5vZGVQb3J0cyA9IG5vZGUuZGF0YSgncG9ydHMnKTtcbiAgICAgICAgaWYgKCBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0wtdG8tUicgfHwgbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdSLXRvLUwnICkge1xuICAgICAgICAgIHZhciBsZWZ0UG9ydElkID0gbm9kZVBvcnRzWzBdLnggPCAwID8gbm9kZVBvcnRzWzBdLmlkIDogbm9kZVBvcnRzWzFdLmlkOyAvLyBUaGUgeCB2YWx1ZSBvZiBsZWZ0IHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgbmVnYXRpdmVcbiAgICAgICAgICB2YXIgcmlnaHRQb3J0SWQgPSBub2RlUG9ydHNbMF0ueCA+IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB4IHZhbHVlIG9mIHJpZ2h0IHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgcG9zaXRpdmVcbiAgICAgICAgICAvKlxuICAgICAgICAgICAqIElmIHRoZSBwb3J0IG9yZGVyaW5nIGlzIGxlZnQgdG8gcmlnaHQgdGhlbiB0aGUgaW5wdXQgcG9ydCBpcyB0aGUgbGVmdCBwb3J0IGFuZCB0aGUgb3V0cHV0IHBvcnQgaXMgdGhlIHJpZ2h0IHBvcnQuXG4gICAgICAgICAgICogRWxzZSBpZiBpdCBpcyByaWdodCB0byBsZWZ0IGl0IGlzIHZpY2UgdmVyc2FcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBub2RlSW5wdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0wtdG8tUicgPyBsZWZ0UG9ydElkIDogcmlnaHRQb3J0SWQ7XG4gICAgICAgICAgbm9kZU91dHB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnUi10by1MJyA/IGxlZnRQb3J0SWQgOiByaWdodFBvcnRJZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICggbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdULXRvLUInIHx8IG5vZGVQb3J0c09yZGVyaW5nID09PSAnQi10by1UJyApe1xuICAgICAgICAgIHZhciB0b3BQb3J0SWQgPSBub2RlUG9ydHNbMF0ueSA8IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB5IHZhbHVlIG9mIHRvcCBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIG5lZ2F0aXZlXG4gICAgICAgICAgdmFyIGJvdHRvbVBvcnRJZCA9IG5vZGVQb3J0c1swXS55ID4gMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHkgdmFsdWUgb2YgYm90dG9tIHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgcG9zaXRpdmVcbiAgICAgICAgICAvKlxuICAgICAgICAgICAqIElmIHRoZSBwb3J0IG9yZGVyaW5nIGlzIHRvcCB0byBib3R0b20gdGhlbiB0aGUgaW5wdXQgcG9ydCBpcyB0aGUgdG9wIHBvcnQgYW5kIHRoZSBvdXRwdXQgcG9ydCBpcyB0aGUgYm90dG9tIHBvcnQuXG4gICAgICAgICAgICogRWxzZSBpZiBpdCBpcyByaWdodCB0byBsZWZ0IGl0IGlzIHZpY2UgdmVyc2FcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBub2RlSW5wdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ1QtdG8tQicgPyB0b3BQb3J0SWQgOiBib3R0b21Qb3J0SWQ7XG4gICAgICAgICAgbm9kZU91dHB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnQi10by1UJyA/IHRvcFBvcnRJZCA6IGJvdHRvbVBvcnRJZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgSU8gcG9ydHMgb2YgdGhlIG5vZGVcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpbnB1dFBvcnRJZDogbm9kZUlucHV0UG9ydElkLFxuICAgICAgICAgIG91dHB1dFBvcnRJZDogbm9kZU91dHB1dFBvcnRJZFxuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgLy8gSWYgYXQgbGVhc3Qgb25lIGVuZCBvZiB0aGUgZWRnZSBoYXMgcG9ydHMgdGhlbiB3ZSBzaG91bGQgZGV0ZXJtaW5lIHRoZSBwb3J0cyB3aGVyZSB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkLlxuICAgICAgaWYgKHNvdXJjZUhhc1BvcnRzIHx8IHRhcmdldEhhc1BvcnRzKSB7XG4gICAgICAgIHZhciBzb3VyY2VOb2RlSW5wdXRQb3J0SWQsIHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQsIHRhcmdldE5vZGVJbnB1dFBvcnRJZCwgdGFyZ2V0Tm9kZU91dHB1dFBvcnRJZDtcblxuICAgICAgICAvLyBJZiBzb3VyY2Ugbm9kZSBoYXMgcG9ydHMgc2V0IHRoZSB2YXJpYWJsZXMgZGVkaWNhdGVkIGZvciBpdHMgSU8gcG9ydHNcbiAgICAgICAgaWYgKCBzb3VyY2VIYXNQb3J0cyApIHtcbiAgICAgICAgICB2YXIgaW9Qb3J0cyA9IGdldElPUG9ydElkcyhzb3VyY2VOb2RlKTtcbiAgICAgICAgICBzb3VyY2VOb2RlSW5wdXRQb3J0SWQgPSBpb1BvcnRzLmlucHV0UG9ydElkO1xuICAgICAgICAgIHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQgPSBpb1BvcnRzLm91dHB1dFBvcnRJZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRhcmdldCBub2RlIGhhcyBwb3J0cyBzZXQgdGhlIHZhcmlhYmxlcyBkZWRpY2F0ZWQgZm9yIGl0cyBJTyBwb3J0c1xuICAgICAgICBpZiAoIHRhcmdldEhhc1BvcnRzICkge1xuICAgICAgICAgIHZhciBpb1BvcnRzID0gZ2V0SU9Qb3J0SWRzKHRhcmdldE5vZGUpO1xuICAgICAgICAgIHRhcmdldE5vZGVJbnB1dFBvcnRJZCA9IGlvUG9ydHMuaW5wdXRQb3J0SWQ7XG4gICAgICAgICAgdGFyZ2V0Tm9kZU91dHB1dFBvcnRJZCA9IGlvUG9ydHMub3V0cHV0UG9ydElkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNiZ25jbGFzcyA9PT0gJ2NvbnN1bXB0aW9uJykge1xuICAgICAgICAgIC8vIEEgY29uc3VtcHRpb24gZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSB0YXJnZXQgbm9kZSB3aGljaCBpcyBzdXBwb3NlZCB0byBiZSBhIHByb2Nlc3MgKGFueSBraW5kIG9mKVxuICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlT3V0cHV0UG9ydElkO1xuICAgICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2JnbmNsYXNzID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAvLyBBIHByb2R1Y3Rpb24gZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBvdXRwdXQgcG9ydCBvZiB0aGUgc291cmNlIG5vZGUgd2hpY2ggaXMgc3VwcG9zZWQgdG8gYmUgYSBwcm9jZXNzIChhbnkga2luZCBvZilcbiAgICAgICAgICAvLyBBIG1vZHVsYXRpb24gZWRnZSBtYXkgaGF2ZSBhIGxvZ2ljYWwgb3BlcmF0b3IgYXMgc291cmNlIG5vZGUgaW4gdGhpcyBjYXNlIHRoZSBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIG91dHB1dCBwb3J0IG9mIGl0XG4gICAgICAgICAgLy8gVGhlIGJlbG93IGFzc2lnbm1lbnQgc2F0aXNmeSBhbGwgb2YgdGhlc2UgY29uZGl0aW9uXG4gICAgICAgICAgaWYoZ3JvdXBJRCA9PSAwIHx8IGdyb3VwSUQgPT0gdW5kZWZpbmVkKSB7IC8vIGdyb3VwSUQgMCBmb3IgcmV2ZXJzaWJsZSByZWFjdGlvbnMgZ3JvdXAgMFxuICAgICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZUlucHV0UG9ydElkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHsgLy9pZiByZWFjdGlvbiBpcyByZXZlcnNpYmxlIGFuZCBlZGdlIGJlbG9uZ3MgdG8gZ3JvdXAgMVxuICAgICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVJbnB1dFBvcnRJZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihlbGVtZW50VXRpbGl0aWVzLmlzTW9kdWxhdGlvbkFyY0NsYXNzKHNiZ25jbGFzcykgfHwgZWxlbWVudFV0aWxpdGllcy5pc0FGQXJjQ2xhc3Moc2JnbmNsYXNzKSl7XG4gICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2JnbmNsYXNzID09PSAnbG9naWMgYXJjJykge1xuICAgICAgICAgIHZhciBzcmNDbGFzcyA9IHNvdXJjZU5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgICAgICB2YXIgdGd0Q2xhc3MgPSB0YXJnZXROb2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgICAgdmFyIGlzU291cmNlTG9naWNhbE9wID0gc3JjQ2xhc3MgPT09ICdhbmQnIHx8IHNyY0NsYXNzID09PSAnb3InIHx8IHNyY0NsYXNzID09PSAnbm90JztcbiAgICAgICAgICB2YXIgaXNUYXJnZXRMb2dpY2FsT3AgPSB0Z3RDbGFzcyA9PT0gJ2FuZCcgfHwgdGd0Q2xhc3MgPT09ICdvcicgfHwgdGd0Q2xhc3MgPT09ICdub3QnO1xuXG4gICAgICAgICAgaWYgKGlzU291cmNlTG9naWNhbE9wICYmIGlzVGFyZ2V0TG9naWNhbE9wKSB7XG4gICAgICAgICAgICAvLyBJZiBib3RoIGVuZCBhcmUgbG9naWNhbCBvcGVyYXRvcnMgdGhlbiB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSB0YXJnZXQgYW5kIHRoZSBvdXRwdXQgcG9ydCBvZiB0aGUgaW5wdXRcbiAgICAgICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XG4gICAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZU91dHB1dFBvcnRJZDtcbiAgICAgICAgICB9Ly8gSWYganVzdCBvbmUgZW5kIG9mIGxvZ2ljYWwgb3BlcmF0b3IgdGhlbiB0aGUgZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSBsb2dpY2FsIG9wZXJhdG9yXG4gICAgICAgICAgZWxzZSBpZiAoaXNTb3VyY2VMb2dpY2FsT3ApIHtcbiAgICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlSW5wdXRQb3J0SWQ7XG4gICAgICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZU91dHB1dFBvcnRJZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoaXNUYXJnZXRMb2dpY2FsT3ApIHtcbiAgICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlT3V0cHV0UG9ydElkO1xuICAgICAgICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVJbnB1dFBvcnRJZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGRlZmF1bHQgcG9ydHNvdXJjZS9wb3J0dGFyZ2V0IGFyZSB0aGUgc291cmNlL3RhcmdldCB0aGVtc2VsdmVzLiBJZiB0aGV5IGFyZSBub3Qgc2V0IHVzZSB0aGVzZSBkZWZhdWx0cy5cbiAgICAgIC8vIFRoZSBwb3J0c291cmNlIGFuZCBwb3J0dGFyZ2V0IGFyZSBkZXRlcm1pbmVkIHNldCB0aGVtIGluIGRhdGEgb2JqZWN0LlxuICAgICAgZGF0YS5wb3J0c291cmNlID0gcG9ydHNvdXJjZSB8fCBzb3VyY2U7XG4gICAgICBkYXRhLnBvcnR0YXJnZXQgPSBwb3J0dGFyZ2V0IHx8IHRhcmdldDtcblxuICAgICAgdmFyIGVsZXMgPSBjeS5hZGQoe1xuICAgICAgICBncm91cDogXCJlZGdlc1wiLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBjc3M6IGNzc1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBuZXdFZGdlID0gZWxlc1tlbGVzLmxlbmd0aCAtIDFdO1xuXG4gICAgICByZXR1cm4gbmV3RWRnZTtcbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyA9IGZ1bmN0aW9uKF9zb3VyY2UsIF90YXJnZXQsIG5vZGVQYXJhbXMpIHtcbiAgICAgIC8vIElmIHNvdXJjZSBhbmQgdGFyZ2V0IElEcyBhcmUgZ2l2ZW4gZ2V0IHRoZSBlbGVtZW50cyBieSBJRHNcbiAgICAgIHZhciBzb3VyY2UgPSB0eXBlb2YgX3NvdXJjZSA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfc291cmNlKSA6IF9zb3VyY2U7XG4gICAgICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xuXG4gICAgICAvLyBQcm9jZXNzIHBhcmVudCBzaG91bGQgYmUgdGhlIGNsb3Nlc3QgY29tbW9uIGFuY2VzdG9yIG9mIHRoZSBzb3VyY2UgYW5kIHRhcmdldCBub2Rlc1xuICAgICAgdmFyIHByb2Nlc3NQYXJlbnQgPSBjeS5jb2xsZWN0aW9uKFtzb3VyY2VbMF0sIHRhcmdldFswXV0pLmNvbW1vbkFuY2VzdG9ycygpLmZpcnN0KCk7XG5cbiAgICAgIC8vIFByb2Nlc3Mgc2hvdWxkIGJlIGF0IHRoZSBtaWRkbGUgb2YgdGhlIHNvdXJjZSBhbmQgdGFyZ2V0IG5vZGVzXG4gICAgICB2YXIgeCA9ICggc291cmNlLnBvc2l0aW9uKCd4JykgKyB0YXJnZXQucG9zaXRpb24oJ3gnKSApIC8gMjtcbiAgICAgIHZhciB5ID0gKCBzb3VyY2UucG9zaXRpb24oJ3knKSArIHRhcmdldC5wb3NpdGlvbigneScpICkgLyAyO1xuXG4gICAgICAvLyBDcmVhdGUgdGhlIHByb2Nlc3Mgd2l0aCBnaXZlbi9jYWxjdWxhdGVkIHZhcmlhYmxlc1xuICAgICAgdmFyIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeCwgeSwgbm9kZVBhcmFtcywgdW5kZWZpbmVkLCBwcm9jZXNzUGFyZW50LmlkKCkpO1xuICAgICAgICB2YXIgeGRpZmYgPSBzb3VyY2UucG9zaXRpb24oJ3gnKSAtIHRhcmdldC5wb3NpdGlvbigneCcpO1xuICAgICAgICB2YXIgeWRpZmYgPSBzb3VyY2UucG9zaXRpb24oJ3knKSAtIHRhcmdldC5wb3NpdGlvbigneScpXG4gICAgICAgIGlmIChNYXRoLmFicyh4ZGlmZikgPj0gTWF0aC5hYnMoeWRpZmYpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoeGRpZmYgPCAwKVxuICAgICAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnTC10by1SJyk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdSLXRvLUwnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh5ZGlmZiA8IDApXG4gICAgICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdULXRvLUInKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ0ItdG8tVCcpO1xuICAgICAgICB9XG5cblxuICAgICAgLy8gQ3JlYXRlIHRoZSBlZGdlcyBvbmUgaXMgYmV0d2VlbiB0aGUgcHJvY2VzcyBhbmQgdGhlIHNvdXJjZSBub2RlICh3aGljaCBzaG91bGQgYmUgYSBjb25zdW1wdGlvbiksXG4gICAgICAvLyB0aGUgb3RoZXIgb25lIGlzIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSB0YXJnZXQgbm9kZSAod2hpY2ggc2hvdWxkIGJlIGEgcHJvZHVjdGlvbikuXG4gICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBwbGVhc2UgcmVmZXIgdG8gU0JHTi1QRCByZWZlcmVuY2UgY2FyZC5cbiAgICAgIHZhciBlZGdlQnR3U3JjID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZS5pZCgpLCBwcm9jZXNzLmlkKCksIHtjbGFzcyA6ICdjb25zdW1wdGlvbicsIGxhbmd1YWdlIDogbm9kZVBhcmFtcy5sYW5ndWFnZX0pO1xuICAgICAgdmFyIGVkZ2VCdHdUZ3QgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCB0YXJnZXQuaWQoKSwge2NsYXNzIDogJ3Byb2R1Y3Rpb24nLCBsYW5ndWFnZSA6IG5vZGVQYXJhbXMubGFuZ3VhZ2V9KTtcblxuICAgICAgLy8gQ3JlYXRlIGEgY29sbGVjdGlvbiBpbmNsdWRpbmcgdGhlIGVsZW1lbnRzIGFuZCB0byBiZSByZXR1cm5lZFxuICAgICAgdmFyIGNvbGxlY3Rpb24gPSBjeS5jb2xsZWN0aW9uKFtwcm9jZXNzWzBdLCBlZGdlQnR3U3JjWzBdLCBlZGdlQnR3VGd0WzBdXSk7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBUaGlzIG1ldGhvZCBhc3N1bWVzIHRoYXQgcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZCBjb250YWlucyBhdCBsZWFzdCBvbmUgbm9kZVxuICAgICAqIGFuZCBhbGwgb2YgdGhlIG5vZGVzIGluY2x1ZGluZyBpbiBpdCBoYXZlIHRoZSBzYW1lIHBhcmVudC4gSXQgY3JlYXRlcyBhIGNvbXBvdW5kIGZvdCB0aGUgZ2l2ZW4gbm9kZXMgYW4gaGF2aW5nIHRoZSBnaXZlbiB0eXBlLlxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzID0gZnVuY3Rpb24gKG5vZGVzVG9NYWtlQ29tcG91bmQsIGNvbXBvdW5kVHlwZSkge1xuICAgICAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xuICAgICAgdmFyIGxhbmd1YWdlID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwibGFuZ3VhZ2VcIik7XG4gICAgICAvLyBpZiBub2Rlc1RvTWFrZUNvbXBvdW5kIGNvbnRhaW4gYm90aCBQRCBhbmQgQUYgbm9kZXMsIHRoZW4gc2V0IGxhbmd1YWdlIG9mIGNvbXBvdW5kIGFzIFVua25vd25cbiAgICAgIGZvciggdmFyIGk9MTsgaTxub2Rlc1RvTWFrZUNvbXBvdW5kLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgaWYobm9kZXNUb01ha2VDb21wb3VuZFtpXSAhPSBsYW5ndWFnZSl7XG4gICAgICAgICAgbGFuZ3VhZ2UgPSBcIlVua25vd25cIjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZC4geCwgeSBhbmQgaWQgcGFyYW1ldGVycyBhcmUgbm90IHNldC5cbiAgICAgIHZhciBuZXdDb21wb3VuZCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwge2NsYXNzIDogY29tcG91bmRUeXBlLCBsYW5ndWFnZSA6IGxhbmd1YWdlfSwgdW5kZWZpbmVkLCBvbGRQYXJlbnRJZCk7XG4gICAgICB2YXIgbmV3Q29tcG91bmRJZCA9IG5ld0NvbXBvdW5kLmlkKCk7XG4gICAgICB2YXIgbmV3RWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50KG5vZGVzVG9NYWtlQ29tcG91bmQsIG5ld0NvbXBvdW5kSWQpO1xuICAgICAgbmV3RWxlcyA9IG5ld0VsZXMudW5pb24obmV3Q29tcG91bmQpO1xuICAgICAgcmV0dXJuIG5ld0VsZXM7XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVHJhbnNsYXRpb25SZWFjdGlvbiA9IGZ1bmN0aW9uKG1SbmFOYW1lLCBwcm90ZWluTmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCBlZGdlTGVuZ3RoKSB7XG4gICAgICBjb25zdCBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKFwidHJhbnNsYXRpb25cIik7XG4gICAgICBjb25zdCBkZWZhdWx0U291cmNlQW5kU2lua1Byb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKFwic291cmNlIGFuZCBzaW5rXCIpO1xuICAgICAgY29uc3QgZGVmYXVsdE51Y2xlaWNBY2lkRmVhdHVyZVByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKFwibnVjbGVpYyBhY2lkIGZlYXR1cmVcIik7XG4gICAgICBjb25zdCBkZWZhdWx0TWFjcm9tb2xlY3VsZVByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKFwibWFjcm9tb2xlY3VsZVwiKTtcbiAgICAgIGNvbnN0IG1hY3JvbW9sZWN1bGVXaWR0aCA9IGRlZmF1bHRNYWNyb21vbGVjdWxlUHJvcGVydGllcy53aWR0aCB8fCA1MDtcbiAgICAgIGNvbnN0IHNvdXJjZUFuZFNpbmtXaWR0aCA9IGRlZmF1bHRTb3VyY2VBbmRTaW5rUHJvcGVydGllcy53aWR0aCAgfHwgNTA7XG4gICAgICBjb25zdCBudWNsZWljQWNpZEZlYXR1cmVIZWlnaHQgPSBkZWZhdWx0TnVjbGVpY0FjaWRGZWF0dXJlUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XG4gICAgICBjb25zdCBwcm9jZXNzV2lkdGggPSBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICBjb25zdCBwcm9jZXNzSGVpZ2h0ID0gZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzLmhlaWdodCB8fCA1MDtcbiAgICAgIHZhciBwcm9jZXNzUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24gfHwgZWxlbWVudFV0aWxpdGllcy5jb252ZXJ0VG9Nb2RlbFBvc2l0aW9uKHt4OiBjeS53aWR0aCgpIC8gMiwgeTogY3kuaGVpZ2h0KCkgLyAyfSk7XG4gICAgICB2YXIgZWRnZUxlbmd0aCA9IGVkZ2VMZW5ndGggfHwgNjA7XG5cbiAgICAgIGN5LnN0YXJ0QmF0Y2goKTtcbiAgICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkpIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiUERcIik7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcm9jZXNzTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHtjbGFzczogXCJwcm9jZXNzXCIsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzTm9kZSwgXCJMLXRvLVJcIik7XG4gICAgICBwcm9jZXNzTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgY29uc3QgeFBvc09mU291cmNlQW5kU2lua05vZGUgPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gc291cmNlQW5kU2lua1dpZHRoIC8gMjtcbiAgICAgIGNvbnN0IHlQb3NPZlNvdXJjZUFuZFNpbmtOb2RlID0gcHJvY2Vzc1Bvc2l0aW9uLnk7XG4gICAgICB2YXIgc291cmNlQW5kU2lua05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc09mU291cmNlQW5kU2lua05vZGUsIHlQb3NPZlNvdXJjZUFuZFNpbmtOb2RlLCB7Y2xhc3M6ICdzb3VyY2UgYW5kIHNpbmsnLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgc291cmNlQW5kU2lua05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIHZhciBjb25zdW1wdGlvbkVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2Uoc291cmNlQW5kU2lua05vZGUuaWQoKSwgcHJvY2Vzc05vZGUuaWQoKSwge2NsYXNzOiAnY29uc3VtcHRpb24nLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgY29uc3VtcHRpb25FZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICBjb25zdCB4UG9zT2ZtUm5hTm9kZSA9IHByb2Nlc3NQb3NpdGlvbi54O1xuICAgICAgY29uc3QgeVBvc09mbVJuYU5vZGUgPSBwcm9jZXNzUG9zaXRpb24ueSAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzSGVpZ2h0IC8gMiAtIG51Y2xlaWNBY2lkRmVhdHVyZUhlaWdodCAvIDI7XG4gICAgICB2YXIgbVJuYU5vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc09mbVJuYU5vZGUsIHlQb3NPZm1SbmFOb2RlLCB7Y2xhc3M6ICdudWNsZWljIGFjaWQgZmVhdHVyZScsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBtUm5hTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgIG1SbmFOb2RlLmRhdGEoJ2xhYmVsJywgbVJuYU5hbWUpO1xuICAgICAgY29uc3QgaW5mb2JveE9iamVjdE9mR2VuZSA9IHtcbiAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiLFxuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgIHRleHQ6ICdjdDptUk5BJ1xuICAgICAgICB9LFxuICAgICAgICBiYm94OiB7XG4gICAgICAgICAgdzogNDUsXG4gICAgICAgICAgaDogMTVcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobVJuYU5vZGUsIGluZm9ib3hPYmplY3RPZkdlbmUpO1xuXG4gICAgICB2YXIgbmVjZXNzYXJ5U3RpbXVsYXRpb25FZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG1SbmFOb2RlLmlkKCksIHByb2Nlc3NOb2RlLmlkKCksIHtjbGFzczogJ25lY2Vzc2FyeSBzdGltdWxhdGlvbicsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBuZWNlc3NhcnlTdGltdWxhdGlvbkVkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIGNvbnN0IHhQb3NPZlByb3RlaW5Ob2RlID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gICAgICBjb25zdCB5UG9zdE9mUHJvdGVpbk5vZGUgPSBwcm9jZXNzUG9zaXRpb24ueTtcbiAgICAgIHZhciBwcm90ZWluTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zT2ZQcm90ZWluTm9kZSwgeVBvc3RPZlByb3RlaW5Ob2RlLCB7Y2xhc3M6ICdtYWNyb21vbGVjdWxlJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIHByb3RlaW5Ob2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgcHJvdGVpbk5vZGUuZGF0YSgnbGFiZWwnLCBwcm90ZWluTmFtZSk7XG4gIFxuICAgICAgdmFyIHByb2R1Y3Rpb25FZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3NOb2RlLmlkKCksIHByb3RlaW5Ob2RlLmlkKCksIHtjbGFzczogJ3Byb2R1Y3Rpb24nLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgcHJvZHVjdGlvbkVkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIGN5LmVuZEJhdGNoKCk7XG5cbiAgICAgIC8vZmlsdGVyIHRoZSBqdXN0IGFkZGVkIGVsZW1lbXRzIHRvIHJldHVybiB0aGVtIGFuZCByZW1vdmUganVzdCBhZGRlZCBtYXJrXG4gICAgICB2YXIgZWxlcyA9IGN5LmVsZW1lbnRzKCdbanVzdEFkZGVkXScpO1xuICAgICAgZWxlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWQnKTtcblxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgZWxlcy5zZWxlY3QoKTtcblxuICAgICAgcmV0dXJuIGVsZXM7IC8vIFJldHVybiB0aGUganVzdCBhZGRlZCBlbGVtZW50c1xuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRyYW5zY3JpcHRpb25SZWFjdGlvbiA9IGZ1bmN0aW9uKGdlbmVOYW1lLCBtUm5hTmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCBlZGdlTGVuZ3RoKSB7XG4gICAgICBjb25zdCBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKFwidHJhbnNjcmlwdGlvblwiKTtcbiAgICAgIGNvbnN0IGRlZmF1bHRTb3VyY2VBbmRTaW5rUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoXCJzb3VyY2UgYW5kIHNpbmtcIik7XG4gICAgICBjb25zdCBkZWZhdWx0TnVjbGVpY0FjaWRGZWF0dXJlUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoXCJudWNsZWljIGFjaWQgZmVhdHVyZVwiKTtcbiAgICAgIGNvbnN0IHNvdXJjZUFuZFNpbmtXaWR0aCA9IGRlZmF1bHRTb3VyY2VBbmRTaW5rUHJvcGVydGllcy53aWR0aCAgfHwgNTA7XG4gICAgICBjb25zdCBudWNsZWljQWNpZEZlYXR1cmVIZWlnaHQgPSBkZWZhdWx0TnVjbGVpY0FjaWRGZWF0dXJlUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XG4gICAgICBjb25zdCBudWNsZWljQWNpZEZlYXR1cmVXaWR0aCA9IGRlZmF1bHROdWNsZWljQWNpZEZlYXR1cmVQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xuICAgICAgY29uc3QgcHJvY2Vzc1dpZHRoID0gZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xuICAgICAgY29uc3QgcHJvY2Vzc0hlaWdodCA9IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XG4gICAgICB2YXIgcHJvY2Vzc1Bvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uIHx8IGVsZW1lbnRVdGlsaXRpZXMuY29udmVydFRvTW9kZWxQb3NpdGlvbih7eDogY3kud2lkdGgoKSAvIDIsIHk6IGN5LmhlaWdodCgpIC8gMn0pO1xuICAgICAgdmFyIGVkZ2VMZW5ndGggPSBlZGdlTGVuZ3RoIHx8IDYwO1xuXG4gICAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShcIlBEXCIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvY2Vzc05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB7Y2xhc3M6IFwicHJvY2Vzc1wiLCBsYW5ndWFnZTogXCJQRFwifSk7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2Vzc05vZGUsIFwiTC10by1SXCIpO1xuICAgICAgcHJvY2Vzc05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG5cbiAgICAgIGNvbnN0IHhQb3NPZlNvdXJjZUFuZFNpbmtOb2RlID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIHNvdXJjZUFuZFNpbmtXaWR0aCAvIDI7XG4gICAgICBjb25zdCB5UG9zT2ZTb3VyY2VBbmRTaW5rTm9kZSA9IHByb2Nlc3NQb3NpdGlvbi55O1xuICAgICAgdmFyIHNvdXJjZUFuZFNpbmtOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZlNvdXJjZUFuZFNpbmtOb2RlLCB5UG9zT2ZTb3VyY2VBbmRTaW5rTm9kZSwge2NsYXNzOiAnc291cmNlIGFuZCBzaW5rJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIHNvdXJjZUFuZFNpbmtOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICB2YXIgY29uc3VtcHRpb25FZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHNvdXJjZUFuZFNpbmtOb2RlLmlkKCksIHByb2Nlc3NOb2RlLmlkKCksIHtjbGFzczogJ2NvbnN1bXB0aW9uJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIGNvbnN1bXB0aW9uRWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgY29uc3QgeFBvc09mR2VuZU5vZGUgPSBwcm9jZXNzUG9zaXRpb24ueDtcbiAgICAgIGNvbnN0IHlQb3NPZkdlbmVOb2RlID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc0hlaWdodCAvIDIgLSBudWNsZWljQWNpZEZlYXR1cmVIZWlnaHQgLyAyO1xuICAgICAgdmFyIGdlbmVOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZkdlbmVOb2RlLCB5UG9zT2ZHZW5lTm9kZSwge2NsYXNzOiAnbnVjbGVpYyBhY2lkIGZlYXR1cmUnLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgZ2VuZU5vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICBnZW5lTm9kZS5kYXRhKCdsYWJlbCcsIGdlbmVOYW1lKTtcbiAgICAgIGNvbnN0IGluZm9ib3hPYmplY3RPZkdlbmUgPSB7XG4gICAgICAgIGNsYXp6OiBcInVuaXQgb2YgaW5mb3JtYXRpb25cIixcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICB0ZXh0OiAnY3Q6Z2VuZSdcbiAgICAgICAgfSxcbiAgICAgICAgYmJveDoge1xuICAgICAgICAgIHc6IDM2LFxuICAgICAgICAgIGg6IDE1XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KGdlbmVOb2RlLCBpbmZvYm94T2JqZWN0T2ZHZW5lKTtcblxuICAgICAgdmFyIG5lY2Vzc2FyeVN0aW11bGF0aW9uRWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShnZW5lTm9kZS5pZCgpLCBwcm9jZXNzTm9kZS5pZCgpLCB7Y2xhc3M6ICduZWNlc3Nhcnkgc3RpbXVsYXRpb24nLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgbmVjZXNzYXJ5U3RpbXVsYXRpb25FZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICBjb25zdCB4UG9zT2ZtUm5hTm9kZSA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBudWNsZWljQWNpZEZlYXR1cmVXaWR0aCAvIDI7XG4gICAgICBjb25zdCB5UG9zdE9mbVJuYU5vZGUgPSBwcm9jZXNzUG9zaXRpb24ueTtcbiAgICAgIHZhciBtUm5hTm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zT2ZtUm5hTm9kZSwgeVBvc3RPZm1SbmFOb2RlLCB7Y2xhc3M6ICdudWNsZWljIGFjaWQgZmVhdHVyZScsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBtUm5hTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgIG1SbmFOb2RlLmRhdGEoJ2xhYmVsJywgbVJuYU5hbWUpO1xuICAgICAgY29uc3QgaW5mb2JveE9iamVjdE9mbVJuYSA9IHtcbiAgICAgICAgY2xheno6IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiLFxuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgIHRleHQ6ICdjdDptUk5BJ1xuICAgICAgICB9LFxuICAgICAgICBiYm94OiB7XG4gICAgICAgICAgdzogNDUsXG4gICAgICAgICAgaDogMTVcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobVJuYU5vZGUsIGluZm9ib3hPYmplY3RPZm1SbmEpO1xuXG4gICAgICB2YXIgcHJvZHVjdGlvbkVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzc05vZGUuaWQoKSwgbVJuYU5vZGUuaWQoKSwge2NsYXNzOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICBwcm9kdWN0aW9uRWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgY3kuZW5kQmF0Y2goKTtcblxuICAgICAgLy9maWx0ZXIgdGhlIGp1c3QgYWRkZWQgZWxlbWVtdHMgdG8gcmV0dXJuIHRoZW0gYW5kIHJlbW92ZSBqdXN0IGFkZGVkIG1hcmtcbiAgICAgIHZhciBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XG4gICAgICBlbGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZCcpO1xuXG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICBlbGVzLnNlbGVjdCgpO1xuXG4gICAgICByZXR1cm4gZWxlczsgLy8gUmV0dXJuIHRoZSBqdXN0IGFkZGVkIGVsZW1lbnRzXG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlTWV0YWJvbGljUmVhY3Rpb24gPSBmdW5jdGlvbiAoaW5wdXRzLCBvdXRwdXRzLCByZXZlcnNpYmxlLCByZWd1bGF0b3IsIHJlZ3VsYXRvck11bHRpbWVyLCBvcmllbnRhdGlvbikge1xuICAgICAgLy8gaW5pdGlhbGl6ZSBzb21lIGNvbnN0YW50cyB0aGF0IG5lZWQgdG8gYmUga25vd24gdG8gZHJhdyB0aGUgYnJpY2tcbiAgICAgIGxldCByb3RhdGU5MCA9IGZ1bmN0aW9uKHBvaW50LCBjZW50ZXIpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpdmVYID0gY2VudGVyLnggLSBwb2ludC54O1xuICAgICAgICBjb25zdCByZWxhdGl2ZVkgPSBjZW50ZXIueSAtIHBvaW50Lnk7XG5cbiAgICAgICAgY29uc3QgcmVsYXRpdmVSb3RhdGVkWCA9IHJlbGF0aXZlWTtcbiAgICAgICAgY29uc3QgcmVsYXRpdmVSb3RhdGVkWSA9IC0xICogcmVsYXRpdmVYO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdFggPSByZWxhdGl2ZVJvdGF0ZWRYICsgY2VudGVyLng7XG4gICAgICAgIGNvbnN0IHJlc3VsdFkgPSByZWxhdGl2ZVJvdGF0ZWRZICsgY2VudGVyLnk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB4OiByZXN1bHRYLFxuICAgICAgICAgIHk6IHJlc3VsdFlcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IGhhc1JlZ3VsYXRvciA9IHJlZ3VsYXRvci5uYW1lICE9PSB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBkZWZhdWx0U2ltcGxlQ2hlbWljYWxQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyggXCJzaW1wbGUgY2hlbWljYWxcIiApO1xuICAgICAgY29uc3QgZGVmYXVsdFJlZ3VsYXRvclByb3BlcnRpZXMgPSBoYXNSZWd1bGF0b3IgPyBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKHJlZ3VsYXRvci50eXBlKSA6IHt9O1xuICAgICAgY29uc3QgZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhcImNhdGFseXRpY1wiKTtcbiAgICAgIGNvbnN0IHByb2Nlc3NXaWR0aCA9IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcy53aWR0aCB8fCA1MDtcbiAgICAgIGNvbnN0IHByb2Nlc3NIZWlnaHQgPSBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMuaGVpZ2h0IHx8IDUwO1xuICAgICAgY29uc3Qgc2ltcGxlQ2hlbWljYWxIZWlnaHQgPSBkZWZhdWx0U2ltcGxlQ2hlbWljYWxQcm9wZXJ0aWVzLmhlaWdodCB8fCAzNTtcbiAgICAgIGNvbnN0IHNpbXBsZUNoZW1pY2FsV2lkdGggPSBkZWZhdWx0U2ltcGxlQ2hlbWljYWxQcm9wZXJ0aWVzLndpZHRoIHx8IDM1O1xuICAgICAgY29uc3QgcmVndWxhdG9ySGVpZ2h0ID0gZGVmYXVsdFJlZ3VsYXRvclByb3BlcnRpZXMuaGVpZ2h0IHx8IDUwO1xuICAgICAgY29uc3QgcHJvY2Vzc1Bvc2l0aW9uID0gZWxlbWVudFV0aWxpdGllcy5jb252ZXJ0VG9Nb2RlbFBvc2l0aW9uKHt4OiBjeS53aWR0aCgpIC8gMiwgeTogY3kuaGVpZ2h0KCkgLyAyfSk7XG4gICAgICBjb25zdCB0aWxpbmdQYWRkaW5nVmVydGljYWwgPSAxNTtcbiAgICAgIGNvbnN0IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gMTU7XG4gICAgICBjb25zdCBlZGdlTGVuZ3RoID0gMzA7XG4gICAgICBjb25zdCBwcm9jZXNzTGVmdFNpZGVFZGdlVHlwZSA9IHJldmVyc2libGUgPyBcInByb2R1Y3Rpb25cIiA6IFwiY29uc3VtcHRpb25cIjtcbiAgICAgIGNvbnN0IHByb2Nlc3NSaWdodFNpZGVFZGdlVHlwZSA9IFwicHJvZHVjdGlvblwiO1xuICAgICAgY29uc3QgcHJvY2Vzc1BvcnRzT3JkZXJpbmcgPSBvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiID8gXCJULXRvLUJcIiA6IFwiTC10by1SXCI7XG5cbiAgICAgIGN5LnN0YXJ0QmF0Y2goKTtcbiAgICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkpIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiUERcIik7XG4gICAgICB9XG5cbiAgICAgIGxldCB4UG9zT2ZJbnB1dCA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBzaW1wbGVDaGVtaWNhbFdpZHRoIC8gMjtcbiAgICAgIGxldCB4UG9zT2ZPdXRwdXQgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgc2ltcGxlQ2hlbWljYWxXaWR0aCAvIDI7XG5cblxuICAgICAgbGV0IHByb2Nlc3NOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwge2NsYXNzOiBcInByb2Nlc3NcIiwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3NOb2RlLCBwcm9jZXNzUG9ydHNPcmRlcmluZyk7XG4gICAgICBwcm9jZXNzTm9kZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgY29uc3QgbnVtT2ZJbnB1dE5vZGVzID0gaW5wdXRzLmxlbmd0aDtcbiAgICAgIGNvbnN0IG51bU9mT3V0cHV0Tm9kZXMgPSBvdXRwdXRzLmxlbmd0aDtcblxuICAgICAgbGV0IHlQb3NPZklucHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKG51bU9mSW5wdXROb2RlcyAtIDEpIC8gMikgKiAoc2ltcGxlQ2hlbWljYWxIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpO1xuXG4gICAgICBpbnB1dHMuZm9yRWFjaChmdW5jdGlvbihkYXRhLCBpbmRleCkge1xuICAgICAgICBjb25zdCBub2RlTmFtZSA9IGRhdGEubmFtZTtcbiAgICAgICAgY29uc3Qgbm9kZVR5cGUgPSBkYXRhLnR5cGU7XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgeVBvc09mSW5wdXQgPSBwcm9jZXNzUG9zaXRpb24ueTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbmRleCAlIDIgPT09IDEpIHtcbiAgICAgICAgICB5UG9zT2ZJbnB1dCA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKChzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCkgKiBNYXRoLmNlaWwoaW5kZXggLyAyKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgeVBvc09mSW5wdXQgPSBwcm9jZXNzUG9zaXRpb24ueSArICgoc2ltcGxlQ2hlbWljYWxIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpICogKGluZGV4IC8gMikpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5vZGVQb3NpdGlvbiA9IHtcbiAgICAgICAgICB4OiB4UG9zT2ZJbnB1dCxcbiAgICAgICAgICB5OiB5UG9zT2ZJbnB1dFxuICAgICAgICB9XG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICAgICAgbm9kZVBvc2l0aW9uID0gcm90YXRlOTAobm9kZVBvc2l0aW9uLCBwcm9jZXNzUG9zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUobm9kZVBvc2l0aW9uLngsIG5vZGVQb3NpdGlvbi55LCB7Y2xhc3M6IG5vZGVUeXBlLnRvTG93ZXJDYXNlKCksIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgICAgbmV3Tm9kZS5kYXRhKFwianVzdEFkZGVkXCIsIHRydWUpO1xuICAgICAgICBuZXdOb2RlLmRhdGEoXCJsYWJlbFwiLCBub2RlTmFtZSk7XG5cbiAgICAgICAgbGV0IG5ld0VkZ2U7XG4gICAgICAgIGlmIChyZXZlcnNpYmxlKSB7XG4gICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzTm9kZS5pZCgpLCBuZXdOb2RlLmlkKCksIHtjbGFzczogcHJvY2Vzc0xlZnRTaWRlRWRnZVR5cGUsIGxhbmd1YWdlOiBcIlBEXCJ9LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdOb2RlLmlkKCksIHByb2Nlc3NOb2RlLmlkKCksIHtjbGFzczogcHJvY2Vzc0xlZnRTaWRlRWRnZVR5cGUsIGxhbmd1YWdlOiBcIlBEXCJ9KTtcbiAgICAgICAgfVxuICAgICAgICBuZXdFZGdlLmRhdGEoXCJqdXN0QWRkZWRcIiwgdHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICAgbGV0IHlQb3NPZk91dHB1dCA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKChudW1PZk91dHB1dE5vZGVzIC0gMSkgLyAyKSAqIChzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XG5cbiAgICAgIG91dHB1dHMuZm9yRWFjaChmdW5jdGlvbihkYXRhLCBpbmRleCkge1xuICAgICAgICBjb25zdCBub2RlTmFtZSA9IGRhdGEubmFtZTtcbiAgICAgICAgY29uc3Qgbm9kZVR5cGUgPSBkYXRhLnR5cGU7XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgeVBvc09mT3V0cHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaW5kZXggJSAyID09PSAxKSB7XG4gICAgICAgICAgeVBvc09mT3V0cHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKHNpbXBsZUNoZW1pY2FsSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKSAqIE1hdGguY2VpbChpbmRleCAvIDIpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB5UG9zT2ZPdXRwdXQgPSBwcm9jZXNzUG9zaXRpb24ueSArICgoc2ltcGxlQ2hlbWljYWxIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpICogKGluZGV4IC8gMikpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5vZGVQb3NpdGlvbiA9IHtcbiAgICAgICAgICB4OiB4UG9zT2ZPdXRwdXQsXG4gICAgICAgICAgeTogeVBvc09mT3V0cHV0XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgICAgICBub2RlUG9zaXRpb24gPSByb3RhdGU5MChub2RlUG9zaXRpb24sIHByb2Nlc3NQb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShub2RlUG9zaXRpb24ueCwgbm9kZVBvc2l0aW9uLnksIHtjbGFzczogbm9kZVR5cGUudG9Mb3dlckNhc2UoKSwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgICBuZXdOb2RlLmRhdGEoXCJqdXN0QWRkZWRcIiwgdHJ1ZSk7XG4gICAgICAgIG5ld05vZGUuZGF0YShcImxhYmVsXCIsIG5vZGVOYW1lKTtcblxuICAgICAgICBsZXQgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzTm9kZS5pZCgpLCBuZXdOb2RlLmlkKCksIHtjbGFzczogcHJvY2Vzc1JpZ2h0U2lkZUVkZ2VUeXBlLCBsYW5ndWFnZTogXCJQRFwifSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIDApO1xuICAgICAgICBuZXdFZGdlLmRhdGEoXCJqdXN0QWRkZWRcIiwgdHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gYWRkIHJlZ3VsYXRvciBub2RlXG4gICAgICBpZiAoaGFzUmVndWxhdG9yKSB7XG4gICAgICAgIGNvbnN0IHJlZ3VsYXRvck5hbWUgPSByZWd1bGF0b3IubmFtZTtcbiAgICAgICAgY29uc3QgcmVndWxhdG9yVHlwZSA9IHJlZ3VsYXRvci50eXBlO1xuICAgICAgICBsZXQgeFBvc09mUmVndWxhdG9yID0gcHJvY2Vzc1Bvc2l0aW9uLng7XG4gICAgICAgIGxldCB5UG9zT2ZSZWd1bGF0b3IgPSBwcm9jZXNzUG9zaXRpb24ueSAtICgocHJvY2Vzc0hlaWdodCAvIDIpICsgKHJlZ3VsYXRvckhlaWdodCAvIDIpICsgZWRnZUxlbmd0aCk7IFxuXG4gICAgICAgIGxldCBub2RlUG9zaXRpb24gPSB7XG4gICAgICAgICAgeDogeFBvc09mUmVndWxhdG9yLFxuICAgICAgICAgIHk6IHlQb3NPZlJlZ3VsYXRvclxuICAgICAgICB9XG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICAgICAgbm9kZVBvc2l0aW9uID0gcm90YXRlOTAobm9kZVBvc2l0aW9uLCBwcm9jZXNzUG9zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlZ3VsYXRvck5vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUobm9kZVBvc2l0aW9uLngsIG5vZGVQb3NpdGlvbi55LCB7Y2xhc3M6IHJlZ3VsYXRvclR5cGUsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICAgIHJlZ3VsYXRvck5vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICAgIHJlZ3VsYXRvck5vZGUuZGF0YSgnbGFiZWwnLCByZWd1bGF0b3JOYW1lKTtcblxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKHJlZ3VsYXRvck5vZGUsIHJlZ3VsYXRvck11bHRpbWVyKTtcblxuICAgICAgICBsZXQgcmVndWxhdG9yRWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShyZWd1bGF0b3JOb2RlLmlkKCksIHByb2Nlc3NOb2RlLmlkKCksIHtjbGFzczogJ2NhdGFseXNpcycsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICAgIHJlZ3VsYXRvckVkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGN5LmVuZEJhdGNoKCk7XG5cbiAgICAgIGNvbnN0IGVsZXMgPSBjeS5lbGVtZW50cygnW2p1c3RBZGRlZF0nKTtcbiAgICAgIGVsZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkJyk7XG5cbiAgICAgIGN5LmVsZW1lbnRzKCkudW5zZWxlY3QoKTtcbiAgICAgIGVsZXMuc2VsZWN0KCk7XG5cbiAgICAgIHJldHVybiBlbGVzO1xuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZU1ldGFib2xpY0NhdGFseXRpY0FjdGl2aXR5ID0gZnVuY3Rpb24oaW5wdXROb2RlTGlzdCwgb3V0cHV0Tm9kZUxpc3QsIGNhdGFseXN0TmFtZSwgY2F0YWx5c3RUeXBlLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgpIHtcbiAgICAgIHZhciBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIFwibWFjcm9tb2xlY3VsZVwiICk7XG4gICAgICB2YXIgZGVmYXVsdFNpbXBsZUNoZW1pY2FsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIFwic2ltcGxlIGNoZW1pY2FsXCIgKTtcbiAgICAgIHZhciBkZWZhdWx0Q2F0YWx5c3RUeXBlUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoY2F0YWx5c3RUeXBlKTtcbiAgICAgIHZhciBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKFwiY2F0YWx5dGljXCIpO1xuICAgICAgdmFyIHByb2Nlc3NXaWR0aCA9IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcy53aWR0aCB8fCA1MDtcbiAgICAgIHZhciBwcm9jZXNzSGVpZ2h0ID0gZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzLmhlaWdodCB8fCA1MDtcbiAgICAgIHZhciBzaW1wbGVDaGVtaWNhbEhlaWdodCA9IGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMuaGVpZ2h0IHx8IDM1O1xuICAgICAgdmFyIG1hY3JvbW9sZWN1bGVXaWR0aCA9IGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xuICAgICAgdmFyIG1hY3JvbW9sZWN1bGVIZWlnaHQgPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XG4gICAgICB2YXIgY2F0YWx5c3RIZWlnaHQgPSBkZWZhdWx0Q2F0YWx5c3RUeXBlUHJvcGVydGllcy5oZWlnaHQgfHwgNTA7XG4gICAgICB2YXIgcHJvY2Vzc1Bvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uIHx8IGVsZW1lbnRVdGlsaXRpZXMuY29udmVydFRvTW9kZWxQb3NpdGlvbih7eDogY3kud2lkdGgoKSAvIDIsIHk6IGN5LmhlaWdodCgpIC8gMn0pO1xuICAgICAgdmFyIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA9IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCB8fCAxNTtcbiAgICAgIHZhciB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCA9IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsIHx8IDE1O1xuICAgICAgdmFyIGVkZ2VMZW5ndGggPSBlZGdlTGVuZ3RoIHx8IDYwO1xuXG4gICAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShcIlBEXCIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgeFBvc09mSW5wdXQgPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgICAgIHZhciB4UG9zT2ZPdXRwdXQgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcblxuICAgICAgdmFyIHByb2Nlc3NOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwge2NsYXNzOiBcInByb2Nlc3NcIiwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3NOb2RlLCBcIkwtdG8tUlwiKTtcbiAgICAgIHByb2Nlc3NOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICBjb25zdCBudW1PZklucHV0Tm9kZXMgPSBpbnB1dE5vZGVMaXN0Lmxlbmd0aDtcbiAgICAgIGNvbnN0IG51bU9mT3V0cHV0Tm9kZXMgPSBvdXRwdXROb2RlTGlzdC5sZW5ndGg7XG4gICAgICB2YXIgeVBvc09mSW5wdXQgPSBwcm9jZXNzUG9zaXRpb24ueSAtICgobnVtT2ZJbnB1dE5vZGVzIC0gMSkgLyAyKSAqIChtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKTtcblxuICAgICAgLy8gYWRkIGlucHV0IHNpZGUgbm9kZXNcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZJbnB1dE5vZGVzOyBpKyspIHtcbiAgICAgICAgaWYoaW5wdXROb2RlTGlzdFtpXS50eXBlID09IFwiU2ltcGxlIENoZW1pY2FsXCIpe1xuICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZklucHV0LCB5UG9zT2ZJbnB1dCwge2NsYXNzIDogJ3NpbXBsZSBjaGVtaWNhbCcsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICAgIHlQb3NPZklucHV0ICs9IHNpbXBsZUNoZW1pY2FsSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc09mSW5wdXQsIHlQb3NPZklucHV0LCB7Y2xhc3MgOiAnbWFjcm9tb2xlY3VsZScsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICAgIC8vdXBkYXRlIHRoZSB5IHBvc2l0aW9uXG4gICAgICAgICAgeVBvc09mSW5wdXQgKz0gbWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcbiAgICAgICAgfVxuICAgICAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgaW5wdXROb2RlTGlzdFtpXS5uYW1lKTtcblxuICAgICAgICB2YXIgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdOb2RlLmlkKCksIHByb2Nlc3NOb2RlLmlkKCksIHtjbGFzcyA6ICdjb25zdW1wdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICBuZXdFZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgeVBvc09mT3V0cHV0ID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKG51bU9mT3V0cHV0Tm9kZXMgLSAxKSAvIDIpICogKG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWwpO1xuXG4gICAgICAvLyBhZGQgb3V0cHV0IHNpZGUgbm9kZXNcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZPdXRwdXROb2RlczsgaSsrKSB7XG4gICAgICAgIGlmKG91dHB1dE5vZGVMaXN0W2ldLnR5cGUgPT0gXCJTaW1wbGUgQ2hlbWljYWxcIil7XG4gICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc09mT3V0cHV0LCB5UG9zT2ZPdXRwdXQsIHtjbGFzcyA6ICdzaW1wbGUgY2hlbWljYWwnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgICB5UG9zT2ZPdXRwdXQgKz0gc2ltcGxlQ2hlbWljYWxIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zT2ZPdXRwdXQsIHlQb3NPZk91dHB1dCwge2NsYXNzIDogJ21hY3JvbW9sZWN1bGUnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgICAvL3VwZGF0ZSB0aGUgeSBwb3NpdGlvblxuICAgICAgICAgIHlQb3NPZk91dHB1dCArPSBtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xuICAgICAgICB9XG4gICAgICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBvdXRwdXROb2RlTGlzdFtpXS5uYW1lKTtcblxuICAgICAgICB2YXIgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzTm9kZS5pZCgpLCBuZXdOb2RlLmlkKCksIHtjbGFzcyA6ICdwcm9kdWN0aW9uJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgIG5ld0VkZ2UuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBjYXRhbHlzdCBub2RlXG4gICAgICB2YXIgeFBvc09mQ2F0YWx5c3QgPSBwcm9jZXNzUG9zaXRpb24ueDtcbiAgICAgIHZhciB5UG9zT2ZDYXRhbHlzdCA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKHByb2Nlc3NIZWlnaHQgKyBjYXRhbHlzdEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7IFxuICAgICAgdmFyIGNhdGFseXN0Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zT2ZDYXRhbHlzdCwgeVBvc09mQ2F0YWx5c3QsIHtjbGFzczogY2F0YWx5c3RUeXBlLCBsYW5ndWFnZTogJ1BEJ30pO1xuICAgICAgY2F0YWx5c3ROb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgY2F0YWx5c3ROb2RlLmRhdGEoJ2xhYmVsJywgY2F0YWx5c3ROYW1lKTtcblxuICAgICAgdmFyIGNhdGFseXN0RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShjYXRhbHlzdE5vZGUuaWQoKSwgcHJvY2Vzc05vZGUuaWQoKSwge2NsYXNzOiAnY2F0YWx5c2lzJywgbGFuZ3VhZ2U6ICdQRCd9KTtcbiAgICAgIGNhdGFseXN0RWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgY3kuZW5kQmF0Y2goKTtcblxuICAgICAgLy9maWx0ZXIgdGhlIGp1c3QgYWRkZWQgZWxlbWVtdHMgdG8gcmV0dXJuIHRoZW0gYW5kIHJlbW92ZSBqdXN0IGFkZGVkIG1hcmtcbiAgICAgIHZhciBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XG4gICAgICBlbGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZCcpO1xuXG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICBlbGVzLnNlbGVjdCgpO1xuXG4gICAgICByZXR1cm4gZWxlczsgLy8gUmV0dXJuIHRoZSBqdXN0IGFkZGVkIGVsZW1lbnRzXG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVBY3RpdmF0aW9uUmVhY3Rpb24gPSBmdW5jdGlvbiAocHJvdGVpbk5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgZWRnZUxlbmd0aCwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyggXCJtYWNyb21vbGVjdWxlXCIgKTtcbiAgICAgIHZhciBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKFwiYWN0aXZhdGlvblwiKTtcbiAgICAgIHZhciBwcm9jZXNzV2lkdGggPSBkZWZhdWx0UHJvY2Vzc1Byb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICB2YXIgbWFjcm9tb2xlY3VsZVdpZHRoID0gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMud2lkdGggfHwgNTA7XG4gICAgICB2YXIgcHJvY2Vzc1Bvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uIHx8IGVsZW1lbnRVdGlsaXRpZXMuY29udmVydFRvTW9kZWxQb3NpdGlvbih7eDogY3kud2lkdGgoKSAvIDIsIHk6IGN5LmhlaWdodCgpIC8gMn0pO1xuICAgICAgdmFyIGVkZ2VMZW5ndGggPSBlZGdlTGVuZ3RoIHx8IDYwO1xuXG4gICAgICBjeS5zdGFydEJhdGNoKCk7XG4gICAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShcIlBEXCIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgeFBvc09mSW5wdXQgPSBwcm9jZXNzUG9zaXRpb24ueCAtIGVkZ2VMZW5ndGggLSBwcm9jZXNzV2lkdGggLyAyIC0gbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcbiAgICAgIHZhciB4UG9zT2ZPdXRwdXQgPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgbWFjcm9tb2xlY3VsZVdpZHRoIC8gMjtcblxuICAgICAgdmFyIHByb2Nlc3NOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwge2NsYXNzOiBcInByb2Nlc3NcIiwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3NOb2RlLCBcIkwtdG8tUlwiKTtcbiAgICAgIHByb2Nlc3NOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICB2YXIgeVBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnk7XG5cbiAgICAgIHZhciBpbnB1dE5vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc09mSW5wdXQsIHlQb3NpdGlvbiwge2NsYXNzOiBcIm1hY3JvbW9sZWN1bGVcIiwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgaW5wdXROb2RlLmRhdGEoXCJqdXN0QWRkZWRcIiwgdHJ1ZSk7XG4gICAgICBpbnB1dE5vZGUuZGF0YShcImxhYmVsXCIsIHByb3RlaW5OYW1lKTtcbiAgICAgIHZhciBpbmZvYm94T2JqZWN0ID0ge1xuICAgICAgICBjbGF6ejogXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIsXG4gICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgdGV4dDogcmV2ZXJzZSA/IFwiYWN0aXZlXCIgOiBcImluYWN0aXZlXCJcbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBcInNoYXBlLW5hbWVcIjogXCJlbGxpcHNlXCJcbiAgICAgICAgfSxcbiAgICAgICAgYmJveDoge1xuICAgICAgICAgIHc6IDM2LFxuICAgICAgICAgIGg6IDE1XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KGlucHV0Tm9kZSwgaW5mb2JveE9iamVjdCk7XG5cbiAgICAgIHZhciBvdXRwdXROb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NPZk91dHB1dCwgeVBvc2l0aW9uLCB7Y2xhc3M6IFwibWFjcm9tb2xlY3VsZVwiLCBsYW5ndWFnZTogXCJQRFwifSk7XG4gICAgICBvdXRwdXROb2RlLmRhdGEoXCJqdXN0QWRkZWRcIiwgdHJ1ZSk7XG4gICAgICBvdXRwdXROb2RlLmRhdGEoXCJsYWJlbFwiLCBwcm90ZWluTmFtZSk7XG4gICAgICBpbmZvYm94T2JqZWN0ID0ge1xuICAgICAgICBjbGF6ejogXCJ1bml0IG9mIGluZm9ybWF0aW9uXCIsXG4gICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgdGV4dDogcmV2ZXJzZSA/IFwiaW5hY3RpdmVcIiA6IFwiYWN0aXZlXCJcbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBcInNoYXBlLW5hbWVcIjogXCJlbGxpcHNlXCJcbiAgICAgICAgfSxcbiAgICAgICAgYmJveDoge1xuICAgICAgICAgIHc6IDM2LFxuICAgICAgICAgIGg6IDE1XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gob3V0cHV0Tm9kZSwgaW5mb2JveE9iamVjdCk7XG5cbiAgICAgIHZhciBpbnB1dFNpZGVFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKGlucHV0Tm9kZS5pZCgpLCBwcm9jZXNzTm9kZS5pZCgpLCB7Y2xhc3M6IFwiY29uc3VtcHRpb25cIiwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgaW5wdXRTaWRlRWRnZS5kYXRhKFwianVzdEFkZGVkXCIsIHRydWUpO1xuICAgICAgdmFyIG91dHB1dFNpZGVFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3NOb2RlLmlkKCksIG91dHB1dE5vZGUuaWQoKSwge2NsYXNzOiBcInByb2R1Y3Rpb25cIiwgbGFuZ3VhZ2U6IFwiUERcIn0pO1xuICAgICAgb3V0cHV0U2lkZUVkZ2UuZGF0YShcImp1c3RBZGRlZFwiLCB0cnVlKTtcbiAgICAgIGN5LmVuZEJhdGNoKCk7XG5cbiAgICAgIC8vZmlsdGVyIHRoZSBqdXN0IGFkZGVkIGVsZW1lbXRzIHRvIHJldHVybiB0aGVtIGFuZCByZW1vdmUganVzdCBhZGRlZCBtYXJrXG4gICAgICB2YXIgZWxlcyA9IGN5LmVsZW1lbnRzKCdbanVzdEFkZGVkXScpO1xuICAgICAgZWxlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWQnKTtcblxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgZWxlcy5zZWxlY3QoKTtcblxuICAgICAgcmV0dXJuIGVsZXM7IC8vIFJldHVybiB0aGUganVzdCBhZGRlZCBlbGVtZW50c1xuICAgIH1cblxuICAgIC8qXG4gICAgICogQ3JlYXRlcyBhIHRlbXBsYXRlIHJlYWN0aW9uIHdpdGggZ2l2ZW4gcGFyYW1ldGVycy4gUmVxdWlyZXMgY29zZS1iaWxrZW50IGxheW91dCB0byB0aWxlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzIGluY2x1ZGVkXG4gICAgICogaW4gdGhlIGNvbXBsZXguIFBhcmFtZXRlcnMgYXJlIGV4cGxhaW5lZCBiZWxvdy5cbiAgICAgKiB0ZW1wbGF0ZVR5cGU6IFRoZSB0eXBlIG9mIHRoZSB0ZW1wbGF0ZSByZWFjdGlvbi4gSXQgbWF5IGJlICdhc3NvY2lhdGlvbicsICdkaXNzb2NpYXRpb24nLCAncmV2ZXJzaWJsZScgb3IgJ2lycmV2ZXJzaWJsZScuXG4gICAgICogbm9kZUxpc3Q6IFRoZSBsaXN0IG9mIHRoZSBuYW1lcyBhbmQgdHlwZXMgb2YgbW9sZWN1bGVzIHdoaWNoIHdpbGwgaW52b2x2ZSBpbiB0aGUgcmVhY3Rpb24uXG4gICAgICogY29tcGxleE5hbWU6IFRoZSBuYW1lIG9mIHRoZSBjb21wbGV4IGluIHRoZSByZWFjdGlvbi5cbiAgICAgKiBwcm9jZXNzUG9zaXRpb246IFRoZSBtb2RhbCBwb3NpdGlvbiBvZiB0aGUgcHJvY2VzcyBpbiB0aGUgcmVhY3Rpb24uIFRoZSBkZWZhdWx0IHZhbHVlIGlzIHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhcy5cbiAgICAgKiB0aWxpbmdQYWRkaW5nVmVydGljYWw6IFRoaXMgb3B0aW9uIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBjb3NlLWJpbGtlbnQgbGF5b3V0IHdpdGggdGhlIHNhbWUgbmFtZS4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgMTUuXG4gICAgICogdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IFRoaXMgb3B0aW9uIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBjb3NlLWJpbGtlbnQgbGF5b3V0IHdpdGggdGhlIHNhbWUgbmFtZS4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgMTUuXG4gICAgICogZWRnZUxlbmd0aDogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBtYWNyb21vbGVjdWxlcyBhdCB0aGUgYm90aCBzaWRlcy5cbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAodGVtcGxhdGVUeXBlLCBub2RlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCwgbGF5b3V0UGFyYW0pIHtcblxuICAgICAgdmFyIGRlZmF1bHRNYWNyb21vbGVjdWxQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyggXCJtYWNyb21vbGVjdWxlXCIgKTtcbiAgICAgIHZhciBkZWZhdWx0U2ltcGxlQ2hlbWljYWxQcm9wZXJ0aWVzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyggXCJzaW1wbGUgY2hlbWljYWxcIiApO1xuICAgICAgdmFyIGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIHRlbXBsYXRlVHlwZSApO1xuICAgICAgdmFyIHByb2Nlc3NXaWR0aCA9IGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcy53aWR0aCB8fCA1MDtcbiAgICAgIHZhciBtYWNyb21vbGVjdWxlV2lkdGggPSBkZWZhdWx0TWFjcm9tb2xlY3VsUHJvcGVydGllcy53aWR0aCB8fCA1MDtcbiAgICAgIHZhciBtYWNyb21vbGVjdWxlSGVpZ2h0ID0gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMuaGVpZ2h0IHx8IDUwO1xuICAgICAgdmFyIHNpbXBsZUNoZW1pY2FsV2lkdGggPSBkZWZhdWx0U2ltcGxlQ2hlbWljYWxQcm9wZXJ0aWVzLndpZHRoIHx8IDM1O1xuICAgICAgdmFyIHNpbXBsZUNoZW1pY2FsSGVpZ2h0ID0gZGVmYXVsdFNpbXBsZUNoZW1pY2FsUHJvcGVydGllcy5oZWlnaHQgfHwgMzU7XG4gICAgICB2YXIgcHJvY2Vzc1Bvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uIHx8IGVsZW1lbnRVdGlsaXRpZXMuY29udmVydFRvTW9kZWxQb3NpdGlvbih7eDogY3kud2lkdGgoKSAvIDIsIHk6IGN5LmhlaWdodCgpIC8gMn0pO1xuICAgICAgdmFyIG5vZGVMaXN0ID0gbm9kZUxpc3Q7XG4gICAgICB2YXIgY29tcGxleE5hbWUgPSBjb21wbGV4TmFtZTtcbiAgICAgIHZhciBudW1PZk1vbGVjdWxlcyA9IG5vZGVMaXN0Lmxlbmd0aDtcbiAgICAgIHZhciB0aWxpbmdQYWRkaW5nVmVydGljYWwgPSB0aWxpbmdQYWRkaW5nVmVydGljYWwgfHwgMTU7XG4gICAgICB2YXIgdGlsaW5nUGFkZGluZ0hvcml6b250YWwgPSB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCB8fCAxNTtcbiAgICAgIHZhciBlZGdlTGVuZ3RoID0gZWRnZUxlbmd0aCB8fCA2MDtcblxuICAgICAgY3kuc3RhcnRCYXRjaCgpO1xuXG4gICAgICBcbiAgICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkpIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiUERcIik7XG4gICAgICB9XG5cbiAgICAgIHZhciB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcztcbiAgICAgIHZhciB4UG9zaXRpb25PZklucHV0TWFjcm9tb2xlY3VsZXM7XG4gICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XG4gICAgICAgIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gICAgICAgXG4gICAgICB9XG4gICAgICBlbHNlIGlmKHRlbXBsYXRlVHlwZSA9PT0gJ2Rpc3NvY2lhdGlvbicpe1xuICAgICAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICAgICAgIFxuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgXG4gICAgICAgIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XG4gICAgICAgIHhQb3NpdGlvbk9mSW5wdXRNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54ICsgZWRnZUxlbmd0aCArIHByb2Nlc3NXaWR0aCAvIDIgKyBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xuICAgICAgfVxuXG4gICAgICAvL0NyZWF0ZSB0aGUgcHJvY2VzcyBpbiB0ZW1wbGF0ZSB0eXBlXG4gICAgICB2YXIgcHJvY2VzcztcbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdyZXZlcnNpYmxlJyB8fCB0ZW1wbGF0ZVR5cGUgPT09ICdpcnJldmVyc2libGUnKSB7XG4gICAgICAgIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB7Y2xhc3MgOiAncHJvY2VzcycsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ0wtdG8tUicpO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgcHJvY2VzcyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHtjbGFzcyA6IHRlbXBsYXRlVHlwZSwgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnTC10by1SJyk7XG4gICAgICB9XG4gICAgICBwcm9jZXNzLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuXG4gICAgICAvL0RlZmluZSB0aGUgc3RhcnRpbmcgeSBwb3NpdGlvblxuICAgICAgdmFyIHlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55IC0gKChudW1PZk1vbGVjdWxlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XG5cbiAgICAgIC8vQ3JlYXRlIHRoZSBmcmVlIG1vbGVjdWxlc1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1vbGVjdWxlczsgaSsrKSB7XG4gICAgICAgIC8vIG5vZGUgYWRkaXRpb24gb3BlcmF0aW9uIGlzIGRldGVybWluZWQgYnkgbW9sZWN1bGUgdHlwZVxuICAgICAgICBpZihub2RlTGlzdFtpXS50eXBlID09IFwiU2ltcGxlIENoZW1pY2FsXCIpe1xuICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIHtjbGFzcyA6ICdzaW1wbGUgY2hlbWljYWwnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgICAvL3VwZGF0ZSB0aGUgeSBwb3NpdGlvblxuICAgICAgICAgIHlQb3NpdGlvbiArPSBzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIHtjbGFzcyA6ICdtYWNyb21vbGVjdWxlJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgICAgLy91cGRhdGUgdGhlIHkgcG9zaXRpb25cbiAgICAgICAgICB5UG9zaXRpb24gKz0gbWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcbiAgICAgICAgfVxuICAgICAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgbm9kZUxpc3RbaV0ubmFtZSk7XG5cbiAgICAgICAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubmVjdGVkIHRvIHRoZSBuZXcgbW9sZWN1bGVcbiAgICAgICAgdmFyIG5ld0VkZ2U7XG4gICAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgICAgICBuZXdFZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKG5ld05vZGUuaWQoKSwgcHJvY2Vzcy5pZCgpLCB7Y2xhc3MgOiAnY29uc3VtcHRpb24nLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHRlbXBsYXRlVHlwZSA9PT0gJ2Rpc3NvY2lhdGlvbicpe1xuICAgICAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBuZXdOb2RlLmlkKCksIHtjbGFzcyA6ICdwcm9kdWN0aW9uJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAvL0dyb3VwIHJpZ2h0IG9yIHRvcCBlbGVtZW50cyBpbiBncm91cCBpZCAxXG4gICAgICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gXCJpcnJldmVyc2libGVcIikge1xuICAgICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdOb2RlLmlkKCksIHByb2Nlc3MuaWQoKSwge2NsYXNzOiBcImNvbnN1bXB0aW9uXCIsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIG5ld05vZGUuaWQoKSwge2NsYXNzIDogXCJwcm9kdWN0aW9uXCIsIGxhbmd1YWdlIDogJ1BEJ30sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBuZXdFZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBpZih0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicgfHwgdGVtcGxhdGVUeXBlID09ICdkaXNzb2NpYXRpb24nKXtcbiAgICAgICAgLy9DcmVhdGUgdGhlIGNvbXBsZXggaW5jbHVkaW5nIG1hY3JvbW9sZWN1bGVzIGluc2lkZSBvZiBpdFxuICAgICAgICAvL1RlbXByb3JhcmlseSBhZGQgaXQgdG8gdGhlIHByb2Nlc3MgcG9zaXRpb24gd2Ugd2lsbCBtb3ZlIGl0IGFjY29yZGluZyB0byB0aGUgbGFzdCBzaXplIG9mIGl0XG4gICAgICAgIHZhciBjb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwge2NsYXNzIDogJ2NvbXBsZXgnLCBsYW5ndWFnZSA6ICdQRCd9KTtcbiAgICAgICAgY29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcbiAgICAgICAgY29tcGxleC5kYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJywgdHJ1ZSk7XG5cbiAgICAgICAgLy9JZiBhIG5hbWUgaXMgc3BlY2lmaWVkIGZvciB0aGUgY29tcGxleCBzZXQgaXRzIGxhYmVsIGFjY29yZGluZ2x5XG4gICAgICAgIGlmIChjb21wbGV4TmFtZSkge1xuICAgICAgICAgIGNvbXBsZXguZGF0YSgnbGFiZWwnLCBjb21wbGV4TmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2NyZWF0ZSB0aGUgZWRnZSBjb25ubmVjdGVkIHRvIHRoZSBjb21wbGV4XG4gICAgICAgIHZhciBlZGdlT2ZDb21wbGV4O1xuXG4gICAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcbiAgICAgICAgICBlZGdlT2ZDb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgY29tcGxleC5pZCgpLCB7Y2xhc3MgOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UoY29tcGxleC5pZCgpLCBwcm9jZXNzLmlkKCksIHtjbGFzcyA6ICdjb25zdW1wdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgZWRnZU9mQ29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTW9sZWN1bGVzOyBpKyspIHtcblxuICAgICAgICAgIC8vIEFkZCBhIG1vbGVjdWxlKGRlcGVuZGVudCBvbiBpdCdzIHR5cGUpIG5vdCBoYXZpbmcgYSBwcmV2aW91c2x5IGRlZmluZWQgaWQgYW5kIGhhdmluZyB0aGUgY29tcGxleCBjcmVhdGVkIGluIHRoaXMgcmVhY3Rpb24gYXMgcGFyZW50XG4gICAgICAgICAgaWYobm9kZUxpc3RbaV0udHlwZSA9PSAnU2ltcGxlIENoZW1pY2FsJyl7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShjb21wbGV4LnBvc2l0aW9uKCd4JyksIGNvbXBsZXgucG9zaXRpb24oJ3knKSwge2NsYXNzIDogJ3NpbXBsZSBjaGVtaWNhbCcsIGxhbmd1YWdlIDogJ1BEJ30sIHVuZGVmaW5lZCwgY29tcGxleC5pZCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKGNvbXBsZXgucG9zaXRpb24oJ3gnKSwgY29tcGxleC5wb3NpdGlvbigneScpLCB7Y2xhc3MgOiAnbWFjcm9tb2xlY3VsZScsIGxhbmd1YWdlIDogJ1BEJ30sIHVuZGVmaW5lZCwgY29tcGxleC5pZCgpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBub2RlTGlzdFtpXS5uYW1lKTtcbiAgICAgICAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZXtcblxuICAgICAgICAvL0NyZWF0ZSB0aGUgaW5wdXQgbWFjcm9tb2xlY3VsZXNcbiAgICAgICAgdmFyIG51bU9mSW5wdXRNYWNyb21vbGVjdWxlcyA9IGNvbXBsZXhOYW1lLmxlbmd0aDtcbiAgICAgICAgeVBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKG51bU9mSW5wdXRNYWNyb21vbGVjdWxlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZklucHV0TWFjcm9tb2xlY3VsZXM7IGkrKykge1xuXG4gICAgICAgICAgaWYoY29tcGxleE5hbWVbaV0udHlwZSA9PSAnU2ltcGxlIENoZW1pY2FsJyl7XG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4UG9zaXRpb25PZklucHV0TWFjcm9tb2xlY3VsZXMsIHlQb3NpdGlvbiwge2NsYXNzIDogJ3NpbXBsZSBjaGVtaWNhbCcsIGxhbmd1YWdlIDogJ1BEJ30pO1xuICAgICAgICAgICAgeVBvc2l0aW9uICs9IHNpbXBsZUNoZW1pY2FsSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc2l0aW9uT2ZJbnB1dE1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIHtjbGFzcyA6ICdtYWNyb21vbGVjdWxlJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XG4gICAgICAgICAgICB5UG9zaXRpb24gKz0gbWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xuICAgICAgICAgIG5ld05vZGUuZGF0YSgnbGFiZWwnLCBjb21wbGV4TmFtZVtpXS5uYW1lKTtcblxuICAgICAgICAgIC8vY3JlYXRlIHRoZSBlZGdlIGNvbm5lY3RlZCB0byB0aGUgbmV3IG1hY3JvbW9sZWN1bGVcbiAgICAgICAgICB2YXIgbmV3RWRnZTtcblxuICAgICAgICAgIC8vR3JvdXAgdGhlIGxlZnQgb3IgYm90dG9tIGVsZW1lbnRzIGluIGdyb3VwIGlkIDAgaWYgcmV2ZXJzaWJsZVxuICAgICAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09IFwiaXJyZXZlcnNpYmxlXCIpIHtcbiAgICAgICAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBuZXdOb2RlLmlkKCksIHtjbGFzczogXCJwcm9kdWN0aW9uXCIsIGxhbmd1YWdlOiAnUEQnfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIG5ld05vZGUuaWQoKSwge2NsYXNzIDogXCJwcm9kdWN0aW9uXCIsIGxhbmd1YWdlIDogJ1BEJ30sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV3RWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcblxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN5LmVuZEJhdGNoKCk7XG5cbiAgICAgIHZhciBsYXlvdXROb2RlcyA9IGN5Lm5vZGVzKCdbanVzdEFkZGVkTGF5b3V0Tm9kZV0nKTtcbiAgICAgIGxheW91dE5vZGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnKTtcbiAgICAgIHZhciBsYXlvdXQgPSBsYXlvdXROb2Rlcy5sYXlvdXQoe1xuICAgICAgICBuYW1lOiBsYXlvdXRQYXJhbS5uYW1lLFxuICAgICAgICByYW5kb21pemU6IGZhbHNlLFxuICAgICAgICBmaXQ6IGZhbHNlLFxuICAgICAgICBhbmltYXRlOiBmYWxzZSxcbiAgICAgICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXG4gICAgICAgIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCxcbiAgICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vSWYgaXQgaXMgYSByZXZlcnNpYmxlIHJlYWN0aW9uIG5vIG5lZWQgdG8gcmUtcG9zaXRpb24gY29tcGxleGVzXG4gICAgICAgICAgaWYodGVtcGxhdGVUeXBlID09PSAncmV2ZXJzaWJsZScpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgLy9yZS1wb3NpdGlvbiB0aGUgbm9kZXMgaW5zaWRlIHRoZSBjb21wbGV4XG4gICAgICAgICAgdmFyIHN1cHBvc2VkWFBvc2l0aW9uO1xuICAgICAgICAgIHZhciBzdXBwb3NlZFlQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi55O1xuXG4gICAgICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gJ2Fzc29jaWF0aW9uJykge1xuICAgICAgICAgICAgc3VwcG9zZWRYUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueCArIGVkZ2VMZW5ndGggKyBwcm9jZXNzV2lkdGggLyAyICsgY29tcGxleC5vdXRlcldpZHRoKCkgLyAyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgcG9zaXRpb25EaWZmWCA9IChzdXBwb3NlZFhQb3NpdGlvbiAtIGNvbXBsZXgucG9zaXRpb24oJ3gnKSkgLyAyO1xuICAgICAgICAgIHZhciBwb3NpdGlvbkRpZmZZID0gKHN1cHBvc2VkWVBvc2l0aW9uIC0gY29tcGxleC5wb3NpdGlvbigneScpKSAvIDI7XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tb3ZlTm9kZXMoe3g6IHBvc2l0aW9uRGlmZlgsIHk6IHBvc2l0aW9uRGlmZll9LCBjb21wbGV4KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIERvIHRoaXMgY2hlY2sgZm9yIGN5dG9zY2FwZS5qcyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gICAgICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4gJiYgdGVtcGxhdGVUeXBlICE9PSAncmV2ZXJzaWJsZScgJiYgdGVtcGxhdGVUeXBlICE9PSAnaXJyZXZlcnNpYmxlJykge1xuICAgICAgICBsYXlvdXQucnVuKCk7XG4gICAgICB9XG5cbiAgICAgIC8vZmlsdGVyIHRoZSBqdXN0IGFkZGVkIGVsZW1lbXRzIHRvIHJldHVybiB0aGVtIGFuZCByZW1vdmUganVzdCBhZGRlZCBtYXJrXG4gICAgICB2YXIgZWxlcyA9IGN5LmVsZW1lbnRzKCdbanVzdEFkZGVkXScpO1xuICAgICAgZWxlcy5yZW1vdmVEYXRhKCdqdXN0QWRkZWQnKTtcblxuICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgZWxlcy5zZWxlY3QoKTtcblxuICAgICAgcmV0dXJuIGVsZXM7IC8vIFJldHVybiB0aGUganVzdCBhZGRlZCBlbGVtZW50c1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIE1vdmUgdGhlIG5vZGVzIHRvIGEgbmV3IHBhcmVudCBhbmQgY2hhbmdlIHRoZWlyIHBvc2l0aW9uIGlmIHBvc3NEaWZmIHBhcmFtcyBhcmUgc2V0LlxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50ID0gZnVuY3Rpb24obm9kZXMsIG5ld1BhcmVudCwgcG9zRGlmZlgsIHBvc0RpZmZZKSB7XG4gICAgICB2YXIgbmV3UGFyZW50SWQgPSBuZXdQYXJlbnQgPT0gdW5kZWZpbmVkIHx8IHR5cGVvZiBuZXdQYXJlbnQgPT09ICdzdHJpbmcnID8gbmV3UGFyZW50IDogbmV3UGFyZW50LmlkKCk7XG4gICAgICB2YXIgbW92ZWRFbGVzID0gbm9kZXMubW92ZSh7XCJwYXJlbnRcIjogbmV3UGFyZW50SWR9KTtcbiAgICAgIGlmKHR5cGVvZiBwb3NEaWZmWCAhPSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcG9zRGlmZlkgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tb3ZlTm9kZXMoe3g6IHBvc0RpZmZYLCB5OiBwb3NEaWZmWX0sIG5vZGVzKTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyKG1vdmVkRWxlcyk7XG4gICAgICByZXR1cm4gbW92ZWRFbGVzO1xuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hTdHlsZSA9IGZ1bmN0aW9uKCBub2RlLCBpbmRleCwgbmV3UHJvcHMgKSB7XG4gICAgICB2YXIgaW5mb2JveE9iaiA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKVtpbmRleF07XG4gICAgICAkLmV4dGVuZCggaW5mb2JveE9iai5zdHlsZSwgbmV3UHJvcHMgKTtcbiAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlSW5mb2JveE9iaiA9IGZ1bmN0aW9uKCBub2RlLCBpbmRleCwgbmV3UHJvcHMgKSB7XG4gICAgICB2YXIgaW5mb2JveE9iaiA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKVtpbmRleF07XG4gICAgICAkLmV4dGVuZCggaW5mb2JveE9iaiwgbmV3UHJvcHMgKTtcbiAgICB9O1xuXG4gICAgLy8gUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LlxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMgPSBmdW5jdGlvbiAobm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvLCBwcmVzZXJ2ZVJlbGF0aXZlUG9zKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIHJhdGlvID0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgZWxlTXVzdEJlU3F1YXJlID0gZWxlbWVudFV0aWxpdGllcy5tdXN0QmVTcXVhcmUobm9kZS5kYXRhKCdjbGFzcycpKTtcblxuICAgICAgICBpZiAocHJlc2VydmVSZWxhdGl2ZVBvcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBvbGRXaWR0aCA9IG5vZGUuZGF0YShcImJib3hcIikudztcbiAgICAgICAgICB2YXIgb2xkSGVpZ2h0ID0gbm9kZS5kYXRhKFwiYmJveFwiKS5oO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm90ZSB0aGF0IGJvdGggd2lkdGggYW5kIGhlaWdodCBzaG91bGQgbm90IGJlIHNldCBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHlcbiAgICAgICAgaWYoIW5vZGUuaXNQYXJlbnQoKSl7XG4gICAgICAgICAgaWYgKHdpZHRoKSB7XG4gICAgICAgICAgICBpZiAodXNlQXNwZWN0UmF0aW8gfHwgZWxlTXVzdEJlU3F1YXJlKSB7XG4gICAgICAgICAgICAgIHJhdGlvID0gd2lkdGggLyBub2RlLndpZHRoKCk7XG4gICAgICAgICAgICB9XG4gIFxuICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gd2lkdGg7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBpZiAoaGVpZ2h0KSB7XG4gICAgICAgICAgICBpZiAodXNlQXNwZWN0UmF0aW8gfHwgZWxlTXVzdEJlU3F1YXJlKSB7XG4gICAgICAgICAgICAgIHJhdGlvID0gaGVpZ2h0IC8gbm9kZS5oZWlnaHQoKTtcbiAgICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgICBub2RlLmRhdGEoXCJiYm94XCIpLmggPSBoZWlnaHQ7XG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICBpZiAocmF0aW8gJiYgIWhlaWdodCkge1xuICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gbm9kZS5oZWlnaHQoKSAqIHJhdGlvO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChyYXRpbyAmJiAhd2lkdGgpIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IG5vZGUud2lkdGgoKSAqIHJhdGlvO1xuICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0XCIgLCBcIlwiKyBoZWlnaHQpO1xuICAgICAgICAgIG5vZGUuZGF0YShcIm1pbldpZHRoXCIgLCBcIlwiKyB3aWR0aCk7XG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluV2lkdGhCaWFzTGVmdFwiLCBcIjUwJVwiKTtcbiAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aEJpYXNSaWdodFwiLCBcIjUwJVwiKTtcbiAgICAgICAgICBub2RlLmRhdGEoXCJtaW5IZWlnaHRCaWFzVG9wXCIsIFwiNTAlXCIgKTtcbiAgICAgICAgICBub2RlLmRhdGEoXCJtaW5IZWlnaHRCaWFzQm90dG9tXCIsIFwiNTAlXCIpO1xuICAgICAgICB9XG4gICAgICAgIFxuXG4gICAgIC8qICAgIGlmIChwcmVzZXJ2ZVJlbGF0aXZlUG9zID09PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgICAgICAgIHZhciB0b3BCb3R0b20gPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IChib3guYW5jaG9yU2lkZSA9PT0gXCJ0b3BcIiB8fCBib3guYW5jaG9yU2lkZSA9PT0gXCJib3R0b21cIikpO1xuICAgICAgICAgIHZhciByaWdodExlZnQgPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IChib3guYW5jaG9yU2lkZSA9PT0gXCJyaWdodFwiIHx8IGJveC5hbmNob3JTaWRlID09PSBcImxlZnRcIikpO1xuXG4gICAgICAgICAgdG9wQm90dG9tLmZvckVhY2goZnVuY3Rpb24oYm94KXtcbiAgICAgICAgICAgIGlmIChib3guYmJveC54IDwgMCkge1xuICAgICAgICAgICAgICBib3guYmJveC54ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJveC5iYm94LnggPiBvbGRXaWR0aCkge1xuICAgICAgICAgICAgICBib3guYmJveC54ID0gb2xkV2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBib3guYmJveC54ID0gbm9kZS5kYXRhKFwiYmJveFwiKS53ICogYm94LmJib3gueCAvIG9sZFdpZHRoO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmlnaHRMZWZ0LmZvckVhY2goZnVuY3Rpb24oYm94KXtcbiAgICAgICAgICAgIGlmIChib3guYmJveC55IDwgMCkge1xuICAgICAgICAgICAgICBib3guYmJveC55ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJveC5iYm94LnkgPiBvbGRIZWlnaHQpIHtcbiAgICAgICAgICAgICAgYm94LmJib3gueSA9IG9sZEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJveC5iYm94LnkgPSBub2RlLmRhdGEoXCJiYm94XCIpLmggKiBib3guYmJveC55IC8gb2xkSGVpZ2h0O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9ICovXG4gICAgICB9XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluV2lkdGggPSBmdW5jdGlvbihub2RlKSB7XG5cbiAgICAgICAgdmFyIGRlZmF1bHRXaWR0aCA9IHRoaXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMobm9kZS5kYXRhKCdjbGFzcycpKS53aWR0aDtcblxuICAgICAgICAvLyBMYWJlbCB3aWR0aCBjYWxjdWxhdGlvblxuICAgICAgICB2YXIgc3R5bGUgPSBub2RlLnN0eWxlKCk7XG5cbiAgICAgICAgdmFyIGZvbnRGYW1pbGl5ID0gc3R5bGVbJ2ZvbnQtZmFtaWx5J107XG4gICAgICAgIHZhciBmb250U2l6ZSA9IHN0eWxlWydmb250LXNpemUnXTtcbiAgICAgICAgdmFyIGxhYmVsVGV4dCA9IHN0eWxlWydsYWJlbCddO1xuXG4gICAgICAgIHZhciBsYWJlbFdpZHRoID0gZWxlbWVudFV0aWxpdGllcy5nZXRXaWR0aEJ5Q29udGVudCggbGFiZWxUZXh0LCBmb250RmFtaWxpeSwgZm9udFNpemUgKTtcblxuICAgICAgICB2YXIgc3RhdGVzYW5kaW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgICAgIC8vVG9wIGFuZCBib3R0b20gaW5mb0JveGVzXG4gICAgICAgIC8vdmFyIHRvcEluZm9Cb3hlcyA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gKGJveC5hbmNob3JTaWRlID09PSBcInRvcFwiIHx8ICgoYm94LmFuY2hvclNpZGUgPT09IFwicmlnaHRcIiB8fCBib3guYW5jaG9yU2lkZSA9PT0gXCJsZWZ0XCIpICYmIChib3guYmJveC55IDw9IDEyKSkpKTtcbiAgICAgICAgLy92YXIgYm90dG9tSW5mb0JveGVzID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiAoYm94LmFuY2hvclNpZGUgPT09IFwiYm90dG9tXCIgfHwgKChib3guYW5jaG9yU2lkZSA9PT0gXCJyaWdodFwiIHx8IGJveC5hbmNob3JTaWRlID09PSBcImxlZnRcIikgJiYgKGJveC5iYm94LnkgPj0gbm9kZS5kYXRhKCdiYm94JykuaCAtIDEyKSkpKTtcbiAgICAgICAgdmFyIHVuaXRHYXAgPSA1O1xuICAgICAgICB2YXIgdG9wSWRlYWxXaWR0aCA9IHVuaXRHYXA7XG4gICAgICAgIHZhciBib3R0b21JZGVhbFdpZHRoID0gdW5pdEdhcDsgICAgICAgIFxuICAgICAgICB2YXIgcmlnaHRNYXhXaWR0aCA9IDA7XG4gICAgICAgIHZhciBsZWZ0TWF4V2lkdGggPTA7XG4gICAgICAgIHN0YXRlc2FuZGluZm9zLmZvckVhY2goZnVuY3Rpb24oYm94KXtcbiAgICAgICAgICBpZihib3guYW5jaG9yU2lkZSA9PT0gXCJ0b3BcIil7XG4gICAgICAgICAgICB0b3BJZGVhbFdpZHRoICs9IGJveC5iYm94LncgKyB1bml0R2FwO1xuXG4gICAgICAgICAgfWVsc2UgaWYoYm94LmFuY2hvclNpZGUgPT09IFwiYm90dG9tXCIpe1xuICAgICAgICAgICAgYm90dG9tSWRlYWxXaWR0aCArPSBib3guYmJveC53ICsgdW5pdEdhcDtcblxuICAgICAgICAgIH1lbHNlIGlmKGJveC5hbmNob3JTaWRlID09PSBcInJpZ2h0XCIpXG4gICAgICAgICAgeyAgICAgICAgICAgXG4gICAgICAgICAgICByaWdodE1heFdpZHRoID0gKGJveC5iYm94LncgPiByaWdodE1heFdpZHRoKSA/IGJveC5iYm94LncgOiByaWdodE1heFdpZHRoO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZWZ0TWF4V2lkdGggPSAoYm94LmJib3gudyA+IGxlZnRNYXhXaWR0aCkgPyBib3guYmJveC53IDogbGVmdE1heFdpZHRoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7ICAgICAgXG5cbiAgICAgICAgdmFyIG1pZGRsZVdpZHRoID0gbGFiZWxXaWR0aCArIDIgKiBNYXRoLm1heChyaWdodE1heFdpZHRoLzIsIGxlZnRNYXhXaWR0aC8yKTtcblxuICAgICAgICB2YXIgY29tcG91bmRXaWR0aCA9IDA7XG4gICAgICAgIGlmKG5vZGUuaXNQYXJlbnQoKSl7XG4gICAgICAgICAgY29tcG91bmRXaWR0aCA9IG5vZGUuY2hpbGRyZW4oKS5ib3VuZGluZ0JveCgpLnc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KG1pZGRsZVdpZHRoLCBkZWZhdWx0V2lkdGgvMiwgdG9wSWRlYWxXaWR0aCwgYm90dG9tSWRlYWxXaWR0aCwgY29tcG91bmRXaWR0aCk7XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5IZWlnaHQgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHZhciBzdGF0ZXNhbmRpbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcbiAgICAgICAgdmFyIG1hcmdpbiA9IDc7XG4gICAgICAgIHZhciB1bml0R2FwID0gNTtcbiAgICAgICAgdmFyIGRlZmF1bHRIZWlnaHQgPSB0aGlzLmdldERlZmF1bHRQcm9wZXJ0aWVzKG5vZGUuZGF0YSgnY2xhc3MnKSkuaGVpZ2h0O1xuICAgICAgICB2YXIgbGVmdEluZm9Cb3hlcyA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gYm94LmFuY2hvclNpZGUgPT09IFwibGVmdFwiKTsgICAgICAgIFxuICAgICAgICB2YXIgbGVmdEhlaWdodCA9IHVuaXRHYXA7IFxuICAgICAgICBsZWZ0SW5mb0JveGVzLmZvckVhY2goZnVuY3Rpb24oYm94KXtcbiAgICAgICAgICAgIGxlZnRIZWlnaHQgKz0gYm94LmJib3guaCArIHVuaXRHYXA7XG4gICAgICAgICAgIFxuICAgICAgICB9KTsgICAgICBcbiAgICAgICAgdmFyIHJpZ2h0SW5mb0JveGVzID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiBib3guYW5jaG9yU2lkZSA9PT0gXCJyaWdodFwiKTtcbiAgICAgICAgdmFyIHJpZ2h0SGVpZ2h0ID0gdW5pdEdhcDsgICAgICAgIFxuICAgICAgICByaWdodEluZm9Cb3hlcy5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XG4gICAgICAgICAgICByaWdodEhlaWdodCArPSBib3guYmJveC5oICsgdW5pdEdhcDsgICAgICAgICAgIFxuICAgICAgICB9KTsgICAgICAgXG4gICAgICAgIHZhciBzdHlsZSA9IG5vZGUuc3R5bGUoKTtcbiAgICAgICAgdmFyIGxhYmVsVGV4dCA9ICgoc3R5bGVbJ2xhYmVsJ10pLnNwbGl0KFwiXFxuXCIpKS5maWx0ZXIoIHRleHQgPT4gdGV4dCAhPT0gJycpO1xuICAgICAgICB2YXIgZm9udFNpemUgPSBwYXJzZUZsb2F0KHN0eWxlWydmb250LXNpemUnXS5zdWJzdHJpbmcoMCwgc3R5bGVbJ2ZvbnQtc2l6ZSddLmxlbmd0aCAtIDIpKTtcbiAgICAgICAgdmFyIHRvdGFsSGVpZ2h0ID0gbGFiZWxUZXh0Lmxlbmd0aCAqIGZvbnRTaXplICsgMiAqIG1hcmdpbjtcblxuICAgICAgICBcblxuICAgICAgICB2YXIgY29tcG91bmRIZWlnaHQgPSAwO1xuICAgICAgICBpZihub2RlLmlzUGFyZW50KCkpe1xuICAgICAgICAgIGNvbXBvdW5kSGVpZ2h0ID0gbm9kZS5jaGlsZHJlbigpLmJvdW5kaW5nQm94KCkuaDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5tYXgodG90YWxIZWlnaHQsIGRlZmF1bHRIZWlnaHQvMiwgbGVmdEhlaWdodCwgcmlnaHRIZWlnaHQsIGNvbXBvdW5kSGVpZ2h0KTtcbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmlzUmVzaXplZFRvQ29udGVudCA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICBpZighbm9kZSB8fCAhbm9kZS5pc05vZGUoKSB8fCAhbm9kZS5kYXRhKCdiYm94Jykpe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8vdmFyIHcgPSBub2RlLmRhdGEoJ2Jib3gnKS53O1xuICAgICAgLy92YXIgaCA9IG5vZGUuZGF0YSgnYmJveCcpLmg7XG4gICAgICB2YXIgdyA9IG5vZGUud2lkdGgoKTtcbiAgICAgIHZhciBoID0gbm9kZS5oZWlnaHQoKTtcblxuICAgICAgdmFyIG1pblcgPSBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbldpZHRoKG5vZGUpO1xuICAgICAgdmFyIG1pbkggPSBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbkhlaWdodChub2RlKTtcblxuICAgICAgaWYodyA9PT0gbWluVyAmJiBoID09PSBtaW5IKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcblxuICAgIC8vIFJlbG9jYXRlcyBzdGF0ZSBhbmQgaW5mbyBib3hlcy4gVGhpcyBmdW5jdGlvbiBpcyBleHBlY3RlZCB0byBiZSBjYWxsZWQgYWZ0ZXIgYWRkL3JlbW92ZSBzdGF0ZSBhbmQgaW5mbyBib3hlc1xuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zID0gZnVuY3Rpb24gKGVsZSkge1xuICAgICAgdmFyIHN0YXRlQW5kSW5mb3MgPSAoZWxlLmlzTm9kZSAmJiBlbGUuaXNOb2RlKCkpID8gZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykgOiBlbGU7XG4gICAgICB2YXIgbGVuZ3RoID0gc3RhdGVBbmRJbmZvcy5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoID09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAobGVuZ3RoID09IDEpIHtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAwO1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueSA9IC01MDtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGxlbmd0aCA9PSAyKSB7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gMDtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG5cbiAgICAgICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAwO1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IDUwO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAobGVuZ3RoID09IDMpIHtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAtMjU7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gLTUwO1xuXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gMDtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnkgPSA1MDtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IC0yNTtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XG5cbiAgICAgICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnggPSAyNTtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XG5cbiAgICAgICAgc3RhdGVBbmRJbmZvc1syXS5iYm94LnggPSAtMjU7XG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC55ID0gNTA7XG5cbiAgICAgICAgc3RhdGVBbmRJbmZvc1szXS5iYm94LnggPSAyNTtcbiAgICAgICAgc3RhdGVBbmRJbmZvc1szXS5iYm94LnkgPSA1MDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQ2hhbmdlIHN0YXRlIHZhbHVlIG9yIHVuaXQgb2YgaW5mb3JtYXRpb24gYm94IG9mIGdpdmVuIG5vZGVzIHdpdGggZ2l2ZW4gaW5kZXguXG4gICAgLy8gVHlwZSBwYXJhbWV0ZXIgaW5kaWNhdGVzIHdoZXRoZXIgdG8gY2hhbmdlIHZhbHVlIG9yIHZhcmlhYmxlLCBpdCBpcyB2YWxpZCBpZiB0aGUgYm94IGF0IHRoZSBnaXZlbiBpbmRleCBpcyBhIHN0YXRlIHZhcmlhYmxlLlxuICAgIC8vIFZhbHVlIHBhcmFtZXRlciBpcyB0aGUgbmV3IHZhbHVlIHRvIHNldC5cbiAgICAvLyBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBvbGQgdmFsdWUgb2YgdGhlIGNoYW5nZWQgZGF0YSAoV2UgYXNzdW1lIHRoYXQgdGhlIG9sZCB2YWx1ZSBvZiB0aGUgY2hhbmdlZCBkYXRhIHdhcyB0aGUgc2FtZSBmb3IgYWxsIG5vZGVzKS5cbiAgICAvLyBFYWNoIGNoYXJhY3RlciBhc3N1bWVkIHRvIG9jY3VweSA4IHVuaXRcbiAgICAvLyBFYWNoIGluZm9ib3ggY2FuIGhhdmUgYXQgbW9zdCAzMiB1bml0cyBvZiB3aWR0aFxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSkge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIHNiZ25jbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgICAgdmFyIHN0YXRlQW5kSW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XG4gICAgICAgIHZhciBib3ggPSBzdGF0ZUFuZEluZm9zW2luZGV4XTtcbiAgICAgICAgdmFyIG9sZExlbmd0aCA9IGJveC5iYm94Lnc7XG4gICAgICAgIHZhciBuZXdMZW5ndGggPSAwO1xuXG4gICAgICAgIHZhciBjb250ZW50ID0gJyc7XG4gICAgICAgIGlmIChib3guY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XG4gICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGJveC5zdGF0ZVt0eXBlXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBib3guc3RhdGVbdHlwZV0gPSB2YWx1ZTtcbiAgICAgICAgICBpZiAoYm94LnN0YXRlW1widmFsdWVcIl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29udGVudCArPSBib3guc3RhdGVbXCJ2YWx1ZVwiXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGJveC5zdGF0ZVtcInZhcmlhYmxlXCJdICE9PSB1bmRlZmluZWQgJiYgYm94LnN0YXRlW1widmFyaWFibGVcIl0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29udGVudCArPSBib3guc3RhdGVbXCJ2YXJpYWJsZVwiXSArIFwiQFwiO1xuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGJveC5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xuICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICByZXN1bHQgPSBib3gubGFiZWwudGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGVudCArPSB2YWx1ZTtcbiAgICAgICAgICBib3gubGFiZWwudGV4dCA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1pbiA9ICggc2JnbmNsYXNzID09PSAnU0lGIG1hY3JvbW9sZWN1bGUnIHx8IHNiZ25jbGFzcyA9PT0gJ1NJRiBzaW1wbGUgY2hlbWljYWwnICkgPyAxNSA6IDEyO1xuICAgICAgICB2YXIgZm9udEZhbWlseSA9IGJveC5zdHlsZVsgJ2ZvbnQtZmFtaWx5JyBdO1xuICAgICAgICB2YXIgZm9udFNpemUgPSBib3guc3R5bGVbICdmb250LXNpemUnIF07XG4gICAgICAgIHZhciBib3JkZXJXaWR0aCA9IGJveC5zdHlsZVsgJ2JvcmRlci13aWR0aCcgXTtcbiAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgbWluLFxuICAgICAgICAgIG1heDogNDgsXG4gICAgICAgICAgbWFyZ2luOiBib3JkZXJXaWR0aCAvIDIgKyAwLjVcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHByZXZpb3VzV2lkdGggPSBib3guYmJveC53O1xuICAgICAgICBib3guYmJveC53ID0gZWxlbWVudFV0aWxpdGllcy5nZXRXaWR0aEJ5Q29udGVudCggY29udGVudCwgZm9udEZhbWlseSwgZm9udFNpemUsIG9wdHMgKTtcblxuICAgICAgICBpZihib3guYW5jaG9yU2lkZSA9PSBcInRvcFwiIHx8IGJveC5hbmNob3JTaWRlID09IFwiYm90dG9tXCIpe1xuICAgICAgICAgIHZhciB1bml0TGF5b3V0ID0gbm9kZS5kYXRhKClbXCJhdXh1bml0bGF5b3V0c1wiXVtib3guYW5jaG9yU2lkZV07XG4gICAgICAgICAgaWYodW5pdExheW91dC51bml0c1t1bml0TGF5b3V0LnVuaXRzLmxlbmd0aC0xXS5pZCA9PSBib3guaWQpe1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGJvcmRlcldpZHRoID0gbm9kZS5kYXRhKClbJ2JvcmRlci13aWR0aCddO1xuICAgICAgICAgICAgdmFyIHNoaWZ0QW1vdW50ID0gKCgoYm94LmJib3gudyAtIHByZXZpb3VzV2lkdGgpIC8gMikgKiAxMDAgKS8gKG5vZGUub3V0ZXJXaWR0aCgpIC0gYm9yZGVyV2lkdGgpO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKHNoaWZ0QW1vdW50ID49IDApe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGlmKGJveC5iYm94LnggKyBzaGlmdEFtb3VudCA8PSAxMDApe1xuICAgICAgICAgICAgICAgIGJveC5iYm94LnggPSBib3guYmJveC54ICsgc2hpZnRBbW91bnQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgLyogIGVsc2V7XG4gICAgICAgICAgICAgIHZhciBwcmV2aW91c0luZm9CYm94ID0ge3ggOiAwLCB3OjB9O1xuICAgICAgICAgICAgICBpZih1bml0TGF5b3V0LnVuaXRzLmxlbmd0aCA+IDEpe1xuICAgICAgICAgICAgICAgIHByZXZpb3VzSW5mb0Jib3g9IHVuaXRMYXlvdXQudW5pdHNbdW5pdExheW91dC51bml0cy5sZW5ndGgtMl0uYmJveDsgICAgICBcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuQXV4VW5pdExheW91dC5zZXRJZGVhbEdhcChub2RlLCBib3guYW5jaG9yU2lkZSk7XG4gICAgICAgICAgICAgIHZhciBpZGVhbEdhcCA9IHNiZ252aXpJbnN0YW5jZS5jbGFzc2VzLkF1eFVuaXRMYXlvdXQuZ2V0Q3VycmVudEdhcChib3guYW5jaG9yU2lkZSk7XG4gICAgICAgICAgICAgIHZhciBuZXdQb3NpdGlvbiA9IHByZXZpb3VzSW5mb0Jib3gueCArIChwcmV2aW91c0luZm9CYm94LncvMiArIGlkZWFsR2FwICsgYm94LmJib3gudy8yKSoxMDAgLyAobm9kZS5vdXRlcldpZHRoKCkgLSBib3JkZXJXaWR0aCk7XG4gICAgICAgICAgICAgIGJveC5iYm94LnggPSBuZXdQb3NpdGlvbjtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9ICovXG4gICAgICAgICAgIFxuICAgICAgICAgICBcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAvKiBpZiAoYm94LmFuY2hvclNpZGUgPT09IFwidG9wXCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwiYm90dG9tXCIpIHtcbiAgICAgICAgICBib3guYmJveC54ICs9IChib3guYmJveC53IC0gb2xkTGVuZ3RoKSAvIDI7XG4gICAgICAgICAgdmFyIHVuaXRzID0gKG5vZGUuZGF0YSgnYXV4dW5pdGxheW91dHMnKVtib3guYW5jaG9yU2lkZV0pLnVuaXRzO1xuICAgICAgICAgIHZhciBzaGlmdEluZGV4ID0gMDtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVuaXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZih1bml0c1tpXSA9PT0gYm94KXtcbiAgICAgICAgICAgICAgc2hpZnRJbmRleCA9IGk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKHZhciBqID0gc2hpZnRJbmRleCsxOyBqIDwgdW5pdHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgdW5pdHNbal0uYmJveC54ICs9IChib3guYmJveC53IC0gb2xkTGVuZ3RoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gKi9cblxuICAgICAgfVxuXG4gICAgICAvL1RPRE8gZmluZCBhIHdheSB0byBlbGltYXRlIHRoaXMgcmVkdW5kYW5jeSB0byB1cGRhdGUgaW5mby1ib3ggcG9zaXRpb25zXG4gICAgICBub2RlLmRhdGEoJ2JvcmRlci13aWR0aCcsIG5vZGUuZGF0YSgnYm9yZGVyLXdpZHRoJykpO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXG4gICAgLy8gVGhlIGJveCBpcyByZXByZXNlbnRlZCBieSB0aGUgcGFyYW1ldGVyIG9iai5cbiAgICAvLyBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUganVzdCBhZGRlZCBib3guXG4gICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2Rlcywgb2JqKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHZhciBsb2NhdGlvbk9iajtcblxuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyggbm9kZS5kYXRhKCdjbGFzcycpICk7XG4gICAgICAgIHZhciBpbmZvYm94UHJvcHMgPSBkZWZhdWx0UHJvcHNbIG9iai5jbGF6eiBdO1xuICAgICAgICB2YXIgYmJveCA9IG9iai5iYm94IHx8IHsgdzogaW5mb2JveFByb3BzLndpZHRoLCBoOiBpbmZvYm94UHJvcHMuaGVpZ2h0IH07ICAgICAgICBcbiAgICAgICAgdmFyIHN0eWxlID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0SW5mb2JveFN0eWxlKCBub2RlLmRhdGEoJ2NsYXNzJyksIG9iai5jbGF6eiApO1xuICAgICAgICBpZihvYmouc3R5bGUpe1xuICAgICAgICAgICQuZXh0ZW5kKCBzdHlsZSwgb2JqLnN0eWxlICk7XG4gICAgICAgIH1cbiAgICAgICBcbiAgICAgICAgaWYob2JqLmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7XG4gICAgICAgICAgbG9jYXRpb25PYmogPSBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5Vbml0T2ZJbmZvcm1hdGlvbi5jcmVhdGUobm9kZSwgY3ksIG9iai5sYWJlbC50ZXh0LCBiYm94LCBvYmoubG9jYXRpb24sIG9iai5wb3NpdGlvbiwgc3R5bGUsIG9iai5pbmRleCwgb2JqLmlkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvYmouY2xhenogPT0gXCJzdGF0ZSB2YXJpYWJsZVwiKSB7XG4gICAgICAgICAgbG9jYXRpb25PYmogPSBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5TdGF0ZVZhcmlhYmxlLmNyZWF0ZShub2RlLCBjeSwgb2JqLnN0YXRlLnZhbHVlLCBvYmouc3RhdGUudmFyaWFibGUsIGJib3gsIG9iai5sb2NhdGlvbiwgb2JqLnBvc2l0aW9uLCBzdHlsZSwgb2JqLmluZGV4LCBvYmouaWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbG9jYXRpb25PYmo7XG4gICAgfTtcblxuICAgIC8vIFJlbW92ZSB0aGUgc3RhdGUgb3IgaW5mbyBib3hlcyBvZiB0aGUgZ2l2ZW4gbm9kZXMgYXQgZ2l2ZW4gaW5kZXguXG4gICAgLy8gUmV0dXJucyB0aGUgcmVtb3ZlZCBib3guXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2RlcywgbG9jYXRpb25PYmopIHtcbiAgICAgIHZhciBvYmo7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgICAgICB2YXIgdW5pdCA9IHN0YXRlQW5kSW5mb3NbbG9jYXRpb25PYmouaW5kZXhdO1xuXG4gICAgICAgIHZhciB1bml0Q2xhc3MgPSBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5nZXRBdXhVbml0Q2xhc3ModW5pdCk7XG5cbiAgICAgICAgb2JqID0gdW5pdENsYXNzLnJlbW92ZSh1bml0LCBjeSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcblxuXG4gICAgLy9UaWxlcyBpbmZvcm1hdGlvbnMgYm94ZXMgZm9yIGdpdmVuIGFuY2hvclNpZGVzXG4gICAgZWxlbWVudFV0aWxpdGllcy5maXRVbml0cyA9IGZ1bmN0aW9uIChub2RlLCBsb2NhdGlvbnMpIHtcbiAgICAgIHZhciBvYmogPSBbXTtcbiAgICAgIG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5mb3JFYWNoKCBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIG9iai5wdXNoKHtcbiAgICAgICAgICB4OiBlbGUuYmJveC54LFxuICAgICAgICAgIHk6IGVsZS5iYm94LnksXG4gICAgICAgICAgYW5jaG9yU2lkZTogZWxlLmFuY2hvclNpZGVcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHNiZ252aXpJbnN0YW5jZS5jbGFzc2VzLkF1eFVuaXRMYXlvdXQuZml0VW5pdHMobm9kZSwgY3ksIGxvY2F0aW9ucyk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG5cbiAgICAvL0NoZWNrIHdoaWNoIGFuY2hvcnNpZGVzIGZpdHNcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoZWNrRml0ID0gZnVuY3Rpb24gKG5vZGUsIGxvY2F0aW9uKSB7IC8vaWYgbm8gbG9jYXRpb24gZ2l2ZW4sIGl0IGNoZWNrcyBhbGwgcG9zc2libGUgbG9jYXRpb25zXG4gICAgICByZXR1cm4gc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuQXV4VW5pdExheW91dC5jaGVja0ZpdChub2RlLCBjeSwgbG9jYXRpb24pO1xuICAgIH07XG5cbiAgICAvL01vZGlmeSBhcnJheSBvZiBhdXggbGF5b3V0IHVuaXRzXG4gICAgZWxlbWVudFV0aWxpdGllcy5tb2RpZnlVbml0cyA9IGZ1bmN0aW9uIChub2RlLCB1bml0LCBhbmNob3JTaWRlKSB7XG4gICAgICBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5BdXhVbml0TGF5b3V0Lm1vZGlmeVVuaXRzKG5vZGUsIHVuaXQsIGFuY2hvclNpZGUsIGN5KTtcbiAgICB9O1xuXG4gICAgLy8gU2V0IG11bHRpbWVyIHN0YXR1cyBvZiB0aGUgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKG5vZGVzLCBzdGF0dXMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIHNiZ25jbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcbiAgICAgICAgdmFyIGlzTXVsdGltZXIgPSBub2RlLmRhdGEoJ2NsYXNzJykuZW5kc1dpdGgoJyBtdWx0aW1lcicpO1xuXG4gICAgICAgIGlmIChzdGF0dXMpIHsgLy8gTWFrZSBtdWx0aW1lciBzdGF0dXMgdHJ1ZVxuICAgICAgICAgIGlmICghaXNNdWx0aW1lcikge1xuICAgICAgICAgICAgbm9kZS5kYXRhKCdjbGFzcycsIHNiZ25jbGFzcyArICcgbXVsdGltZXInKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIGZhbHNlXG4gICAgICAgICAgaWYgKGlzTXVsdGltZXIpIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YSgnY2xhc3MnLCBzYmduY2xhc3MucmVwbGFjZSgnIG11bHRpbWVyJywgJycpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gZWxlbWVudHMgd2l0aCBnaXZlbiBmb250IGRhdGFcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGVsZXMsIGRhdGEpIHtcbiAgICAgIGZvciAodmFyIHByb3AgaW4gZGF0YSkge1xuICAgICAgICBlbGVzLmRhdGEocHJvcCwgZGF0YVtwcm9wXSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gZ2V0cyBhbiBlZGdlLCBhbmQgZW5kcyBvZiB0aGF0IGVkZ2UgKE9wdGlvbmFsbHkgaXQgbWF5IHRha2UganVzdCB0aGUgY2xhc3NlcyBvZiB0aGUgZWRnZSBhcyB3ZWxsKSBhcyBwYXJhbWV0ZXJzLlxuICAgIC8vIEl0IG1heSByZXR1cm4gJ3ZhbGlkJyAodGhhdCBlbmRzIGlzIHZhbGlkIGZvciB0aGF0IGVkZ2UpLCAncmV2ZXJzZScgKHRoYXQgZW5kcyBpcyBub3QgdmFsaWQgZm9yIHRoYXQgZWRnZSBidXQgdGhleSB3b3VsZCBiZSB2YWxpZFxuICAgIC8vIGlmIHlvdSByZXZlcnNlIHRoZSBzb3VyY2UgYW5kIHRhcmdldCksICdpbnZhbGlkJyAodGhhdCBlbmRzIGFyZSB0b3RhbGx5IGludmFsaWQgZm9yIHRoYXQgZWRnZSkuXG4gICAgZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyA9IGZ1bmN0aW9uIChlZGdlLCBzb3VyY2UsIHRhcmdldCwgaXNSZXBsYWNlbWVudCkge1xuICAgICAgLy8gaWYgbWFwIHR5cGUgaXMgVW5rbm93biAtLSBubyBydWxlcyBhcHBsaWVkXG4gICAgICBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gXCJIeWJyaWRBbnlcIiB8fCBlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSA9PSBcIkh5YnJpZFNiZ25cIiB8fCAhZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkpXG4gICAgICAgIHJldHVybiBcInZhbGlkXCI7XG5cbiAgICAgIHZhciBlZGdlY2xhc3MgPSB0eXBlb2YgZWRnZSA9PT0gJ3N0cmluZycgPyBlZGdlIDogZWRnZS5kYXRhKCdjbGFzcycpO1xuICAgICAgdmFyIHNvdXJjZWNsYXNzID0gc291cmNlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICB2YXIgdGFyZ2V0Y2xhc3MgPSB0YXJnZXQuZGF0YSgnY2xhc3MnKTtcbiAgICAgIHZhciBtYXBUeXBlID0gZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCk7XG4gICAgICB2YXIgZWRnZUNvbnN0cmFpbnRzID0gZWxlbWVudFV0aWxpdGllc1ttYXBUeXBlXS5jb25uZWN0aXZpdHlDb25zdHJhaW50c1tlZGdlY2xhc3NdO1xuXG4gICAgICBpZiAobWFwVHlwZSA9PSBcIkFGXCIpe1xuICAgICAgICBpZiAoc291cmNlY2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKSAvLyB3ZSBoYXZlIHNlcGFyYXRlIGNsYXNzZXMgZm9yIGVhY2ggYmlvbG9naWNhbCBhY3Rpdml0eVxuICAgICAgICAgIHNvdXJjZWNsYXNzID0gXCJiaW9sb2dpY2FsIGFjdGl2aXR5XCI7IC8vIGJ1dCBzYW1lIHJ1bGUgYXBwbGllcyB0byBhbGwgb2YgdGhlbVxuXG4gICAgICAgIGlmICh0YXJnZXRjbGFzcy5zdGFydHNXaXRoKFwiQkFcIikpIC8vIHdlIGhhdmUgc2VwYXJhdGUgY2xhc3NlcyBmb3IgZWFjaCBiaW9sb2dpY2FsIGFjdGl2aXR5XG4gICAgICAgICAgdGFyZ2V0Y2xhc3MgPSBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjsgLy8gYnV0IHNhbWUgcnVsZSBhcHBsaWVzIHRvIGFsbCBvZiB0aGVtXG4gICAgICB9XG4gICAgICBlbHNlIGlmIChtYXBUeXBlID09IFwiUERcIil7XG4gICAgICAgIHNvdXJjZWNsYXNzID0gc291cmNlY2xhc3MucmVwbGFjZSgvXFxzKm11bHRpbWVyJC8sICcnKTtcbiAgICAgICAgdGFyZ2V0Y2xhc3MgPSB0YXJnZXRjbGFzcy5yZXBsYWNlKC9cXHMqbXVsdGltZXIkLywgJycpO1xuICAgICAgfVxuXG4gICAgICAvLyBnaXZlbiBhIG5vZGUsIGFjdGluZyBhcyBzb3VyY2Ugb3IgdGFyZ2V0LCByZXR1cm5zIGJvb2xlYW4gd2V0aGVyIG9yIG5vdCBpdCBoYXMgdG9vIG1hbnkgZWRnZXMgYWxyZWFkeVxuICAgICAgZnVuY3Rpb24gaGFzVG9vTWFueUVkZ2VzKG5vZGUsIHNvdXJjZU9yVGFyZ2V0KSB7XG4gICAgICAgIHZhciBub2RlY2xhc3MgPSBub2RlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgIG5vZGVjbGFzcyA9IG5vZGVjbGFzcy5yZXBsYWNlKC9cXHMqbXVsdGltZXIkLywgJycpO1xuICAgICAgICBpZiAobm9kZWNsYXNzLnN0YXJ0c1dpdGgoXCJCQVwiKSlcbiAgICAgICAgICBub2RlY2xhc3MgPSBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjtcblxuICAgICAgICAvKlxuICAgICAgICAgIE9uIHRoZSBsb2dpYyBiZWxvdzpcblxuICAgICAgICAgIEN1cnJlbnQgZWRnZSBjb3VudCAoaW5jb21pbmcgb3Igb3V0Z29pbmcpIG9mIG5vZGVzIHNob3VsZCBiZSBzdHJpY3RseSBsZXNzIFxuICAgICAgICAgIHRoYW4gdGhlIG1heGltdW0gYWxsb3dlZCBpZiB3ZSBhcmUgYWRkaW5nIGFuIGVkZ2UgdG8gdGhlIG5vZGUuIFRoaXMgd2F5XG4gICAgICAgICAgaXQgd2lsbCBuZXZlciBleGNlZWQgdGhlIG1heCBjb3VudC5cbiAgICAgICAgICBcbiAgICAgICAgICBFZGdlcyBjYW4gYmUgYWRkZWQgaW4gdHdvIGRpZmZlcmVudCB3YXlzLiBFaXRoZXIgdGhleSBhcmUgYWRkZWQgZGlyZWN0bHkgb3JcbiAgICAgICAgICB0aGV5IGFyZSBhZGRlZCBieSBiZWluZyByZXBsYWNlZCBmcm9tIGFub3RoZXIgbm9kZSwgaS5lIGRpc2Nvbm5lY3RlZCBmcm9tXG4gICAgICAgICAgb25lIGFuZCBjb25uZWN0ZWQgdG8gYW5vdGhlci5cblxuICAgICAgICAgIFdlIGNhbiBkZXRlY3QgaWYgdGhlIGVkZ2UgYmVpbmcgYWRkZWQgaXMgYWRkZWQgZnJvbSBhIHJlcGxhY2VtZW50IGJ5IGNoZWNraW5nXG4gICAgICAgICAgd2hldGhlciB0aGUgc291cmNlIHN0YXllZCB0aGUgc2FtZSB3aGVuIGNoZWNraW5nIGVkZ2UgY291bnRzIG9mIHRoZSBzb3VyY2Ugbm9kZSxcbiAgICAgICAgICBhbmQgd2hldGhlciB0aGUgdGFyZ2V0IHN0YXllZCB0aGUgc2FtZSB3aGVuIGNoZWNraW5nIGVkZ2UgY291bnRzIG9mIHRoZVxuICAgICAgICAgIHRhcmdldCBub2RlLlxuXG4gICAgICAgICAgQ3VycmVudCBlZGdlIGNvdW50IG9mIG5vZGVzIGNhbiBiZSBhbGxvd2VkIHRvIGJlIGVxdWFsIHRvIHRoZSBtYXhpbXVtIGluIFxuICAgICAgICAgIGNhc2VzIHdoZXJlIGEgcmVwbGFjZW1lbnQgaXMgbWFkZS4gQnV0IHdlIHNob3VsZCBiZSBjYXJlZnVsIHRoYXQgdGhpc1xuICAgICAgICAgIHJlcGxhY2VtZW50IG9wZXJhdGlvbiBpcyBub3QgYWxzbyBhbiBhZGRpdGlvbiBvcGVyYXRpb24gYXMgZGVzY3JpYmVkIGFib3ZlLlxuICAgICAgICAqL1xuXG4gICAgICAgIHZhciB0b3RhbFRvb01hbnkgPSB0cnVlO1xuICAgICAgICB2YXIgZWRnZVRvb01hbnkgPSB0cnVlO1xuICAgICAgICBpZiAoc291cmNlT3JUYXJnZXQgPT0gXCJzb3VyY2VcIikge1xuICAgICAgICAgICAgdmFyIHNhbWVFZGdlQ291bnRPdXQgPSBub2RlLm91dGdvZXJzKCdlZGdlW2NsYXNzPVwiJytlZGdlY2xhc3MrJ1wiXScpLnNpemUoKTtcbiAgICAgICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudE91dCA9IG5vZGUub3V0Z29lcnMoJ2VkZ2UnKS5zaXplKCk7XG4gICAgICAgICAgICB2YXIgbWF4VG90YWwgPSBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhUb3RhbDsgXG4gICAgICAgICAgICB2YXIgbWF4RWRnZSA9IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzU291cmNlLm1heEVkZ2U7XG5cbiAgICAgICAgICAgIHZhciBjb21wYXJlU3RyaWN0ID0gIShpc1JlcGxhY2VtZW50ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVkZ2Uuc291cmNlKCkgPT09IHNvdXJjZSkpO1xuXG4gICAgICAgICAgICB2YXIgd2l0aGluTGltaXRzID0gIW1heFRvdGFsIHx8IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbXBhcmVTdHJpY3QgJiYgKHRvdGFsRWRnZUNvdW50T3V0IDwgbWF4VG90YWwpKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCFjb21wYXJlU3RyaWN0ICYmICh0b3RhbEVkZ2VDb3VudE91dCA8PSBtYXhUb3RhbCkpO1xuXG4gICAgICAgICAgICBpZiAod2l0aGluTGltaXRzKSB7XG4gICAgICAgICAgICAgICAgdG90YWxUb29NYW55ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0aGVuIGNoZWNrIGxpbWl0cyBmb3IgdGhpcyBzcGVjaWZpYyBlZGdlIGNsYXNzXG5cbiAgICAgICAgICAgIHdpdGhpbkxpbWl0cyA9ICFtYXhFZGdlIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbXBhcmVTdHJpY3QgJiYgKHNhbWVFZGdlQ291bnRPdXQgPCBtYXhFZGdlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICghY29tcGFyZVN0cmljdCAmJiAoc2FtZUVkZ2VDb3VudE91dCA8PSBtYXhFZGdlKSkpOyBcblxuICAgICAgICAgICAgaWYgKHdpdGhpbkxpbWl0cykge1xuICAgICAgICAgICAgICAgIGVkZ2VUb29NYW55ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIG9ubHkgb25lIG9mIHRoZSBsaW1pdHMgaXMgcmVhY2hlZCB0aGVuIGVkZ2UgaXMgaW52YWxpZFxuICAgICAgICAgICAgcmV0dXJuIHRvdGFsVG9vTWFueSB8fCBlZGdlVG9vTWFueTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLy8gbm9kZSBpcyB1c2VkIGFzIHRhcmdldFxuICAgICAgICAgICAgdmFyIHNhbWVFZGdlQ291bnRJbiA9IG5vZGUuaW5jb21lcnMoJ2VkZ2VbY2xhc3M9XCInK2VkZ2VjbGFzcysnXCJdJykuc2l6ZSgpO1xuICAgICAgICAgICAgdmFyIHRvdGFsRWRnZUNvdW50SW4gPSBub2RlLmluY29tZXJzKCdlZGdlJykuc2l6ZSgpO1xuICAgICAgICAgICAgdmFyIG1heFRvdGFsID0gZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNUYXJnZXQubWF4VG90YWw7IFxuICAgICAgICAgICAgdmFyIG1heEVkZ2UgPSBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1RhcmdldC5tYXhFZGdlO1xuXG4gICAgICAgICAgICB2YXIgY29tcGFyZVN0cmljdCA9ICEoaXNSZXBsYWNlbWVudCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZWRnZS50YXJnZXQoKSA9PT0gdGFyZ2V0KSk7XG5cbiAgICAgICAgICAgIHZhciB3aXRoaW5MaW1pdHMgPSAhbWF4VG90YWwgfHwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29tcGFyZVN0cmljdCAmJiAodG90YWxFZGdlQ291bnRJbiA8IG1heFRvdGFsKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICghY29tcGFyZVN0cmljdCAmJiAodG90YWxFZGdlQ291bnRJbiA8PSBtYXhUb3RhbCkpO1xuXG4gICAgICAgICAgICBpZiAod2l0aGluTGltaXRzKSB7XG4gICAgICAgICAgICAgICAgdG90YWxUb29NYW55ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpdGhpbkxpbWl0cyA9ICFtYXhFZGdlIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChjb21wYXJlU3RyaWN0ICYmIChzYW1lRWRnZUNvdW50SW4gPCBtYXhFZGdlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAoIWNvbXBhcmVTdHJpY3QgJiYgKHNhbWVFZGdlQ291bnRJbiA8PSBtYXhFZGdlKSkpOyBcblxuICAgICAgICAgICAgaWYgKHdpdGhpbkxpbWl0cykge1xuICAgICAgICAgICAgICAgIGVkZ2VUb29NYW55ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdG90YWxUb29NYW55IHx8IGVkZ2VUb29NYW55O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGlzSW5Db21wbGV4KG5vZGUpIHtcbiAgICAgICAgdmFyIHBhcmVudENsYXNzID0gbm9kZS5wYXJlbnQoKS5kYXRhKCdjbGFzcycpO1xuICAgICAgICByZXR1cm4gcGFyZW50Q2xhc3MgJiYgcGFyZW50Q2xhc3Muc3RhcnRzV2l0aCgnY29tcGxleCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNJbkNvbXBsZXgoc291cmNlKSB8fCBpc0luQ29tcGxleCh0YXJnZXQpKSB7IC8vIHN1YnVuaXRzIG9mIGEgY29tcGxleCBhcmUgbm8gbG9uZ2VyIEVQTnMsIG5vIGNvbm5lY3Rpb24gYWxsb3dlZFxuICAgICAgICByZXR1cm4gJ2ludmFsaWQnO1xuICAgICAgfVxuXG4gICAgICAvLyBjaGVjayBuYXR1cmUgb2YgY29ubmVjdGlvblxuICAgICAgaWYgKGVkZ2VDb25zdHJhaW50c1tzb3VyY2VjbGFzc10uYXNTb3VyY2UuaXNBbGxvd2VkICYmIGVkZ2VDb25zdHJhaW50c1t0YXJnZXRjbGFzc10uYXNUYXJnZXQuaXNBbGxvd2VkKSB7XG4gICAgICAgIC8vIGNoZWNrIGFtb3VudCBvZiBjb25uZWN0aW9uc1xuICAgICAgICBpZiAoIWhhc1Rvb01hbnlFZGdlcyhzb3VyY2UsIFwic291cmNlXCIpICYmICFoYXNUb29NYW55RWRnZXModGFyZ2V0LCBcInRhcmdldFwiKSApIHtcbiAgICAgICAgICByZXR1cm4gJ3ZhbGlkJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gdHJ5IHRvIHJldmVyc2VcbiAgICAgIGlmIChlZGdlQ29uc3RyYWludHNbdGFyZ2V0Y2xhc3NdLmFzU291cmNlLmlzQWxsb3dlZCAmJiBlZGdlQ29uc3RyYWludHNbc291cmNlY2xhc3NdLmFzVGFyZ2V0LmlzQWxsb3dlZCkge1xuICAgICAgICBpZiAoIWhhc1Rvb01hbnlFZGdlcyh0YXJnZXQsIFwic291cmNlXCIpICYmICFoYXNUb29NYW55RWRnZXMoc291cmNlLCBcInRhcmdldFwiKSApIHtcbiAgICAgICAgICByZXR1cm4gJ3JldmVyc2UnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gJ2ludmFsaWQnO1xuICAgIH07XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihlbGVzLCBsYXlvdXRwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IGVsZXMucmVtb3ZlKCk7XG4gICAgICBpZiAodHlwZW9mIGxheW91dHBhcmFtID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGxheW91dHBhcmFtKCk7IC8vIElmIGxheW91dHBhcmFtIGlzIGEgZnVuY3Rpb24gZXhlY3V0ZSBpdFxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIGxheW91dCA9IGN5LmxheW91dChsYXlvdXRwYXJhbSk7IC8vIElmIGxheW91dHBhcmFtIGlzIGxheW91dCBvcHRpb25zIGNhbGwgbGF5b3V0IHdpdGggdGhhdCBvcHRpb25zLlxuXG4gICAgICAgICAgLy8gRG8gdGhpcyBjaGVjayBmb3IgY3l0b3NjYXBlLmpzIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4pIHtcbiAgICAgICAgICAgICAgbGF5b3V0LnJ1bigpO1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBIaWRlIGdpdmVuIGVsZXMgYW5kIHBlcmZvcm0gZ2l2ZW4gbGF5b3V0IGFmdGVyd2FyZC4gTGF5b3V0IHBhcmFtZXRlciBtYXkgYmUgbGF5b3V0IG9wdGlvbnNcbiAgICAgKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5oaWRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBjeS52aWV3VXRpbGl0aWVzKCkuaGlkZShlbGVzKTsgLy8gSGlkZSBnaXZlbiBlbGVzXG4gICAgICAgIGlmICh0eXBlb2YgbGF5b3V0cGFyYW0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGxheW91dHBhcmFtKCk7IC8vIElmIGxheW91dHBhcmFtIGlzIGEgZnVuY3Rpb24gZXhlY3V0ZSBpdFxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGxheW91dCA9IGN5LmxheW91dChsYXlvdXRwYXJhbSk7IC8vIElmIGxheW91dHBhcmFtIGlzIGxheW91dCBvcHRpb25zIGNhbGwgbGF5b3V0IHdpdGggdGhhdCBvcHRpb25zLlxuXG4gICAgICAgICAgICAvLyBEbyB0aGlzIGNoZWNrIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgaWYgKGxheW91dCAmJiBsYXlvdXQucnVuKSB7XG4gICAgICAgICAgICAgICAgbGF5b3V0LnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBVbmhpZGUgZ2l2ZW4gZWxlcyBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xuICAgICAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC5cbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSBjeS52aWV3VXRpbGl0aWVzKCkuc2hvdyhlbGVzKTsgLy8gU2hvdyBnaXZlbiBlbGVzXG4gICAgICBpZiAodHlwZW9mIGxheW91dHBhcmFtID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGxheW91dHBhcmFtKCk7IC8vIElmIGxheW91dHBhcmFtIGlzIGEgZnVuY3Rpb24gZXhlY3V0ZSBpdFxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBsYXlvdXQgPSBjeS5sYXlvdXQobGF5b3V0cGFyYW0pOyAvLyBJZiBsYXlvdXRwYXJhbSBpcyBsYXlvdXQgb3B0aW9ucyBjYWxsIGxheW91dCB3aXRoIHRoYXQgb3B0aW9ucy5cblxuICAgICAgICAvLyBEbyB0aGlzIGNoZWNrIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4pIHtcbiAgICAgICAgICBsYXlvdXQucnVuKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBDaGFuZ2Ugc3R5bGUvY3NzIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAgICAgKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS5cbiAgICAgKi9cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUNzcyA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XG4gICAgICBpZiAoIHR5cGVvZiB2YWx1ZU1hcCA9PT0gJ29iamVjdCcgKSB7XG4gICAgICAgIGN5LnN0YXJ0QmF0Y2goKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGVsZSA9IGN5LmdldEVsZW1lbnRCeUlkKGVsZXNbaV0uaWQoKSk7XG4gICAgICAgICAgZWxlLmNzcyhuYW1lLCB2YWx1ZU1hcFtlbGUuaWQoKV0pOyAvLyB2YWx1ZU1hcCBpcyBhbiBpZCB0byB2YWx1ZSBtYXAgdXNlIGl0IGluIHRoaXMgd2F5XG4gICAgICAgIH1cbiAgICAgICAgY3kuZW5kQmF0Y2goKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVzLmNzcyhuYW1lLCB2YWx1ZU1hcCk7IC8vIHZhbHVlTWFwIGlzIGp1c3QgYSBzdHJpbmcgc2V0IGNzcygnbmFtZScpIGZvciBhbGwgZWxlcyB0byB0aGlzIHZhbHVlXG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogQ2hhbmdlIGRhdGEgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxuICAgICAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLlxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YSA9IGZ1bmN0aW9uKGVsZXMsIG5hbWUsIHZhbHVlTWFwKSB7XG4gICAgICBpZiAoIHR5cGVvZiB2YWx1ZU1hcCA9PT0gJ29iamVjdCcgKSB7XG4gICAgICAgIGN5LnN0YXJ0QmF0Y2goKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGVsZSA9IGN5LmdldEVsZW1lbnRCeUlkKGVsZXNbaV0uaWQoKSk7XG4gICAgICAgICAgZWxlLmRhdGEobmFtZSwgdmFsdWVNYXBbZWxlLmlkKCldKTsgLy8gdmFsdWVNYXAgaXMgYW4gaWQgdG8gdmFsdWUgbWFwIHVzZSBpdCBpbiB0aGlzIHdheVxuICAgICAgICB9XG4gICAgICAgIGN5LmVuZEJhdGNoKCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcy5kYXRhKG5hbWUsIHZhbHVlTWFwKTsgLy8gdmFsdWVNYXAgaXMganVzdCBhIHN0cmluZyBzZXQgY3NzKCduYW1lJykgZm9yIGFsbCBlbGVzIHRvIHRoaXMgdmFsdWVcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVTZXRGaWVsZCA9IGZ1bmN0aW9uKGVsZSwgZmllbGROYW1lLCB0b0RlbGV0ZSwgdG9BZGQsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgc2V0ID0gZWxlLmRhdGEoIGZpZWxkTmFtZSApO1xuICAgICAgaWYgKCAhc2V0ICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgdXBkYXRlcyA9IHt9O1xuXG4gICAgICBpZiAoIHRvRGVsZXRlICE9IG51bGwgJiYgc2V0WyB0b0RlbGV0ZSBdICkge1xuICAgICAgICBkZWxldGUgc2V0WyB0b0RlbGV0ZSBdO1xuICAgICAgICB1cGRhdGVzLmRlbGV0ZWQgPSB0b0RlbGV0ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCB0b0FkZCAhPSBudWxsICkge1xuICAgICAgICBzZXRbIHRvQWRkIF0gPSB0cnVlO1xuICAgICAgICB1cGRhdGVzLmFkZGVkID0gdG9BZGQ7XG4gICAgICB9XG5cbiAgICAgIGlmICggY2FsbGJhY2sgJiYgKCB1cGRhdGVzWyAnZGVsZXRlZCcgXSAhPSBudWxsIHx8IHVwZGF0ZXNbICdhZGRlZCcgXSAhPSBudWxsICkgKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB1cGRhdGVzO1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIFJldHVybiB0aGUgc2V0IG9mIGFsbCBub2RlcyBwcmVzZW50IHVuZGVyIHRoZSBnaXZlbiBwb3NpdGlvblxuICAgICAqIHJlbmRlcmVkUG9zIG11c3QgYmUgYSBwb2ludCBkZWZpbmVkIHJlbGF0aXZlbHkgdG8gY3l0b3NjYXBlIGNvbnRhaW5lclxuICAgICAqIChsaWtlIHJlbmRlcmVkUG9zaXRpb24gZmllbGQgb2YgYSBub2RlKVxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuZ2V0Tm9kZXNBdCA9IGZ1bmN0aW9uKHJlbmRlcmVkUG9zKSB7XG4gICAgICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xuICAgICAgdmFyIHggPSByZW5kZXJlZFBvcy54O1xuICAgICAgdmFyIHkgPSByZW5kZXJlZFBvcy55O1xuICAgICAgdmFyIHJlc3VsdE5vZGVzID0gW107XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgdmFyIHJlbmRlcmVkQmJveCA9IG5vZGUucmVuZGVyZWRCb3VuZGluZ0JveCh7XG4gICAgICAgICAgaW5jbHVkZU5vZGVzOiB0cnVlLFxuICAgICAgICAgIGluY2x1ZGVFZGdlczogZmFsc2UsXG4gICAgICAgICAgaW5jbHVkZUxhYmVsczogZmFsc2UsXG4gICAgICAgICAgaW5jbHVkZVNoYWRvd3M6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoeCA+PSByZW5kZXJlZEJib3gueDEgJiYgeCA8PSByZW5kZXJlZEJib3gueDIpIHtcbiAgICAgICAgICBpZiAoeSA+PSByZW5kZXJlZEJib3gueTEgJiYgeSA8PSByZW5kZXJlZEJib3gueTIpIHtcbiAgICAgICAgICAgIHJlc3VsdE5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0Tm9kZXM7XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuZGVtdWx0aW1lcml6ZUNsYXNzID0gZnVuY3Rpb24oc2JnbmNsYXNzKSB7XG4gICAgICByZXR1cm4gc2JnbmNsYXNzLnJlcGxhY2UoXCIgbXVsdGltZXJcIiwgXCJcIik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBtYXBUeXBlIC0gdHlwZSBvZiB0aGUgY3VycmVudCBtYXAgKFBELCBBRiBvciBVbmtub3duKVxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZSA9IGZ1bmN0aW9uKG1hcFR5cGUpe1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5tYXBUeXBlID0gbWFwVHlwZTtcbiAgICAgIHJldHVybiBtYXBUeXBlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiAtIG1hcCB0eXBlXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVzZXRzIG1hcCB0eXBlXG4gICAgICovXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZXNldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1hcFR5cGUgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogS2VlcCBjb25zaXN0ZW5jeSBvZiBsaW5rcyB0byBzZWxmIGluc2lkZSB0aGUgZGF0YSgpIHN0cnVjdHVyZS5cbiAgICAgKiBUaGlzIGlzIG5lZWRlZCB3aGVuZXZlciBhIG5vZGUgY2hhbmdlcyBwYXJlbnRzLCBmb3IgZXhhbXBsZSxcbiAgICAgKiBhcyBpdCBpcyBkZXN0cm95ZWQgYW5kIHJlY3JlYXRlZC4gQnV0IHRoZSBkYXRhKCkgc3RheXMgaWRlbnRpY2FsLlxuICAgICAqIFRoaXMgY3JlYXRlcyBpbmNvbnNpc3RlbmNpZXMgZm9yIHRoZSBwb2ludGVycyBzdG9yZWQgaW4gZGF0YSgpLFxuICAgICAqIGFzIHRoZXkgbm93IHBvaW50IHRvIGEgZGVsZXRlZCBub2RlLlxuICAgICAqL1xuICAgIGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyID0gZnVuY3Rpb24gKGVsZXMpIHtcbiAgICAgIGVsZXMubm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGVsZSl7XG4gICAgICAgIC8vIHJlc3RvcmUgYmFja2dyb3VuZCBpbWFnZXNcbiAgICAgICAgZWxlLmVtaXQoJ2RhdGEnKTtcblxuICAgICAgICAvLyBza2lwIG5vZGVzIHdpdGhvdXQgYW55IGF1eGlsaWFyeSB1bml0c1xuICAgICAgICBpZighZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykgfHwgZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykubGVuZ3RoID09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciBzaWRlIGluIGVsZS5kYXRhKCdhdXh1bml0bGF5b3V0cycpKSB7XG4gICAgICAgICAgZWxlLmRhdGEoJ2F1eHVuaXRsYXlvdXRzJylbc2lkZV0ucGFyZW50Tm9kZSA9IGVsZS5pZCgpO1xuICAgICAgICB9XG4gICAgICAgIGZvcih2YXIgaT0wOyBpIDwgZWxlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKVtpXS5wYXJlbnQgPSBlbGUuaWQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZWxlbWVudFV0aWxpdGllcy5hbnlIYXNCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAoZWxlcykge1xuICAgICAgdmFyIG9iaiA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0QmFja2dyb3VuZEltYWdlT2JqcyhlbGVzKTtcbiAgICAgIGlmKG9iaiA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBlbHNle1xuICAgICAgICBmb3IodmFyIGtleSBpbiBvYmope1xuICAgICAgICAgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgICAgIGlmKHZhbHVlICYmICEkLmlzRW1wdHlPYmplY3QodmFsdWUpKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuaGFzQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKGVsZSkge1xuICAgICAgaWYgKCFlbGUuaXNOb2RlKCkgfHwgIWVsZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIGJnO1xuICAgICAgXG4gICAgICBpZih0eXBlb2YgZWxlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBiZyA9IGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykuc3BsaXQoXCIgXCIpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZihBcnJheS5pc0FycmF5KG9ialsnYmFja2dyb3VuZC1pbWFnZSddKSkge1xuICAgICAgICBiZyA9IGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghYmcpIHJldHVybiBmYWxzZTtcblxuICAgICAgdmFyIGNsb25lSW1nID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LCUzQ3N2ZyUyMHdpZHRoJTNEJTIyMTAwJTIyJTIwaGVpZ2h0JTNEJTIyMTAwJTIyJTIwdmlld0JveCUzRCUyMjAlMjAwJTIwMTAwJTIwMTAwJTIyJTIwc3R5bGUlM0QlMjJmaWxsJTNBbm9uZSUzQnN0cm9rZSUzQWJsYWNrJTNCc3Ryb2tlLXdpZHRoJTNBMCUzQiUyMiUyMHhtbG5zJTNEJTIyaHR0cCUzQS8vd3d3LnczLm9yZy8yMDAwL3N2ZyUyMiUyMCUzRSUzQ3JlY3QlMjB4JTNEJTIyMCUyMiUyMHklM0QlMjIwJTIyJTIwd2lkdGglM0QlMjIxMDAlMjIlMjBoZWlnaHQlM0QlMjIxMDAlMjIlMjBzdHlsZSUzRCUyMmZpbGwlM0ElMjM4MzgzODMlMjIvJTNFJTIwJTNDL3N2ZyUzRSc7XG4gICAgICAvLyBJZiBjbG9uZUltZyBpcyBub3QgdGhlIG9ubHkgaW1hZ2Ugb3IgdGhlcmUgYXJlIG11bHRpcGxlIGltYWdlcyB0aGVyZSBpcyBhIGJhY2tncm91bmQgaW1hZ2VcbiAgICAgIHZhciBvbmx5SGFzQ2xvbmVNYXJrZXJBc0JnSW1hZ2UgPSAoYmcubGVuZ3RoID09PSAxKSAmJiAoYmcuaW5kZXhPZihjbG9uZUltZykgPT09IDApO1xuXG4gICAgICBpZihiZy5sZW5ndGggPiAxIHx8ICEob25seUhhc0Nsb25lTWFya2VyQXNCZ0ltYWdlKSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmdldEJhY2tncm91bmRJbWFnZVVSTCA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgICBpZighZWxlcyB8fCBlbGVzLmxlbmd0aCA8IDEpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgdmFyIGNvbW1vblVSTCA9IFwiXCI7XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuXG4gICAgICAgIGlmKCFlbGUuaXNOb2RlKCkgfHwgIWVsZW1lbnRVdGlsaXRpZXMuaGFzQmFja2dyb3VuZEltYWdlKGVsZSkpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHZhciB1cmwgPSBlbGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KFwiIFwiKS5wb3AoKTtcbiAgICAgICAgaWYoIXVybCB8fCB1cmwuaW5kZXhPZignaHR0cCcpICE9PSAwIHx8IChjb21tb25VUkwgIT09IFwiXCIgJiYgY29tbW9uVVJMICE9PSB1cmwpKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgZWxzZSBpZihjb21tb25VUkwgPT09IFwiXCIpXG4gICAgICAgICAgY29tbW9uVVJMID0gdXJsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29tbW9uVVJMO1xuICAgIH1cblxuICAgIGVsZW1lbnRVdGlsaXRpZXMuZ2V0QmFja2dyb3VuZEltYWdlT2JqcyA9IGZ1bmN0aW9uIChlbGVzKSB7XG4gICAgICBpZighZWxlcyB8fCBlbGVzLmxlbmd0aCA8IDEpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgdmFyIGxpc3QgPSB7fTtcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG4gICAgICAgIHZhciBvYmogPSBnZXRCZ09iaihlbGUpO1xuICAgICAgICBpZihPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA8IDEpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGxpc3RbZWxlLmRhdGEoJ2lkJyldID0gb2JqO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpc3Q7XG5cbiAgICAgIGZ1bmN0aW9uIGdldEJnT2JqIChlbGUpIHtcbiAgICAgICAgaWYoZWxlLmlzTm9kZSgpICYmIGVsZW1lbnRVdGlsaXRpZXMuaGFzQmFja2dyb3VuZEltYWdlKGVsZSkpe1xuICAgICAgICAgIHZhciBrZXlzID0gWydiYWNrZ3JvdW5kLWltYWdlJywgJ2JhY2tncm91bmQtZml0JywgJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScsXG4gICAgICAgICAgJ2JhY2tncm91bmQtcG9zaXRpb24teCcsICdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknLCAnYmFja2dyb3VuZC1oZWlnaHQnLCAnYmFja2dyb3VuZC13aWR0aCddO1xuXG4gICAgICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgICAgIGlmIChlbGUuZGF0YShrZXkpICYmICh0eXBlb2YgZWxlLmRhdGEoa2V5KSA9PT0gXCJzdHJpbmdcIikpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSBlbGUuZGF0YShrZXkpLnNwbGl0KFwiIFwiKVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICB2YWx1ZSA9IGVsZS5kYXRhKGtleSk7XG4gICAgICAgICAgICB9ICAgICAgICAgICBcbiAgICAgICAgICAgIG9ialtrZXldID0gdmFsdWU7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoZWxlLmlzTm9kZSgpKVxuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmdldEJhY2tncm91bmRGaXRPcHRpb25zID0gZnVuY3Rpb24gKGVsZXMpIHtcbiAgICAgIGlmKCFlbGVzIHx8IGVsZXMubGVuZ3RoIDwgMSlcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICB2YXIgY29tbW9uRml0ID0gXCJcIjtcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIG5vZGUgPSBlbGVzW2ldO1xuICAgICAgICBpZighbm9kZS5pc05vZGUoKSlcbiAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGZpdCA9IGdldEZpdE9wdGlvbihub2RlKTtcbiAgICAgICAgaWYoIWZpdCB8fCAoY29tbW9uRml0ICE9PSBcIlwiICYmIGZpdCAhPT0gY29tbW9uRml0KSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGVsc2UgaWYoY29tbW9uRml0ID09PSBcIlwiKVxuICAgICAgICAgIGNvbW1vbkZpdCA9IGZpdDtcbiAgICAgIH1cblxuICAgICAgdmFyIG9wdGlvbnMgPSAnPG9wdGlvbiB2YWx1ZT1cIm5vbmVcIj5Ob25lPC9vcHRpb24+J1xuICAgICAgICAgICAgICAgICAgKyAnPG9wdGlvbiB2YWx1ZT1cImZpdFwiPkZpdDwvb3B0aW9uPidcbiAgICAgICAgICAgICAgICAgICsgJzxvcHRpb24gdmFsdWU9XCJjb3ZlclwiPkNvdmVyPC9vcHRpb24+J1xuICAgICAgICAgICAgICAgICAgKyAnPG9wdGlvbiB2YWx1ZT1cImNvbnRhaW5cIj5Db250YWluPC9vcHRpb24+JztcbiAgICAgIHZhciBzZWFyY2hLZXkgPSAndmFsdWU9XCInICsgY29tbW9uRml0ICsgJ1wiJztcbiAgICAgIHZhciBpbmRleCA9IG9wdGlvbnMuaW5kZXhPZihzZWFyY2hLZXkpICsgc2VhcmNoS2V5Lmxlbmd0aDtcbiAgICAgIHJldHVybiBvcHRpb25zLnN1YnN0cigwLCBpbmRleCkgKyAnIHNlbGVjdGVkJyArIG9wdGlvbnMuc3Vic3RyKGluZGV4KTtcblxuICAgICAgZnVuY3Rpb24gZ2V0Rml0T3B0aW9uKG5vZGUpIHtcbiAgICAgICAgaWYoIWVsZW1lbnRVdGlsaXRpZXMuaGFzQmFja2dyb3VuZEltYWdlKG5vZGUpKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB2YXIgZiA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1maXQnKTtcbiAgICAgICAgdmFyIGggPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0Jyk7XG5cbiAgICAgICAgaWYoIWYgfHwgIWgpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGYgPSBmLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgaCA9IGguc3BsaXQoXCIgXCIpO1xuICAgICAgICBpZihmW2YubGVuZ3RoLTFdID09PSBcIm5vbmVcIilcbiAgICAgICAgICByZXR1cm4gKGhbaC5sZW5ndGgtMV0gPT09IFwiYXV0b1wiID8gXCJub25lXCIgOiBcImZpdFwiKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBmW2YubGVuZ3RoLTFdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKG5vZGVzLCBiZ09iaikge1xuICAgICAgaWYoIW5vZGVzIHx8IG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFiZ09iailcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgb2JqID0gYmdPYmpbbm9kZS5kYXRhKCdpZCcpXTtcbiAgICAgICAgaWYoIW9iaiB8fCAkLmlzRW1wdHlPYmplY3Qob2JqKSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICB2YXIgaW1ncyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciB4UG9zID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciB5UG9zID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciB3aWR0aHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgaGVpZ2h0cyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnKS5zcGxpdChcIiBcIikgOiBbXTtcbiAgICAgICAgdmFyIGZpdHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciBvcGFjaXRpZXMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScpID8gKFwiXCIgKyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScpKS5zcGxpdChcIiBcIikgOiBbXTtcblxuICAgICAgICB2YXIgaW5kZXggPSAtMTtcbiAgICAgICAgaWYodHlwZW9mIG9ialsnYmFja2dyb3VuZC1pbWFnZSddID09PSBcInN0cmluZ1wiKVxuICAgICAgICAgIGluZGV4ID0gaW1ncy5pbmRleE9mKG9ialsnYmFja2dyb3VuZC1pbWFnZSddKTtcbiAgICAgICAgZWxzZSBpZihBcnJheS5pc0FycmF5KG9ialsnYmFja2dyb3VuZC1pbWFnZSddKSlcbiAgICAgICAgICBpbmRleCA9IGltZ3MuaW5kZXhPZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXVswXSk7XG5cbiAgICAgICAgaWYoaW5kZXggPCAwKVxuICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmKG9ialsnYmFja2dyb3VuZC1pbWFnZSddICYmIGltZ3MubGVuZ3RoID4gaW5kZXgpe1xuICAgICAgICAgIHZhciB0bXAgPSBpbWdzW2luZGV4XTtcbiAgICAgICAgICBpbWdzW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1pbWFnZSddO1xuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC1pbWFnZSddID0gdG1wO1xuICAgICAgICB9XG4gICAgICAgIGlmKG9ialsnYmFja2dyb3VuZC1maXQnXSAmJiBmaXRzLmxlbmd0aCA+IGluZGV4KXtcbiAgICAgICAgICB2YXIgdG1wID0gZml0c1tpbmRleF07XG4gICAgICAgICAgZml0c1tpbmRleF0gPSBvYmpbJ2JhY2tncm91bmQtZml0J107XG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLWZpdCddID0gdG1wO1xuICAgICAgICB9XG4gICAgICAgIGlmKG9ialsnYmFja2dyb3VuZC13aWR0aCddICYmIHdpZHRocy5sZW5ndGggPiBpbmRleCl7XG4gICAgICAgICAgdmFyIHRtcCA9IHdpZHRoc1tpbmRleF07XG4gICAgICAgICAgd2lkdGhzW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC13aWR0aCddO1xuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC13aWR0aCddID0gdG1wO1xuICAgICAgICB9XG4gICAgICAgIGlmKG9ialsnYmFja2dyb3VuZC1oZWlnaHQnXSAmJiBoZWlnaHRzLmxlbmd0aCA+IGluZGV4KXtcbiAgICAgICAgICB2YXIgdG1wID0gaGVpZ2h0c1tpbmRleF07XG4gICAgICAgICAgaGVpZ2h0c1tpbmRleF0gPSBvYmpbJ2JhY2tncm91bmQtaGVpZ2h0J107XG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLWhlaWdodCddID0gdG1wO1xuICAgICAgICB9XG4gICAgICAgIGlmKG9ialsnYmFja2dyb3VuZC1wb3NpdGlvbi14J10gJiYgeFBvcy5sZW5ndGggPiBpbmRleCl7XG4gICAgICAgICAgdmFyIHRtcCA9IHhQb3NbaW5kZXhdO1xuICAgICAgICAgIHhQb3NbaW5kZXhdID0gb2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnXTtcbiAgICAgICAgICBvYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teCddID0gdG1wO1xuICAgICAgICB9XG4gICAgICAgIGlmKG9ialsnYmFja2dyb3VuZC1wb3NpdGlvbi15J10gJiYgeVBvcy5sZW5ndGggPiBpbmRleCl7XG4gICAgICAgICAgdmFyIHRtcCA9IHlQb3NbaW5kZXhdO1xuICAgICAgICAgIHlQb3NbaW5kZXhdID0gb2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXknXTtcbiAgICAgICAgICBvYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teSddID0gdG1wO1xuICAgICAgICB9XG4gICAgICAgIGlmKG9ialsnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5J10gJiYgb3BhY2l0aWVzLmxlbmd0aCA+IGluZGV4KXtcbiAgICAgICAgICB2YXIgdG1wID0gb3BhY2l0aWVzW2luZGV4XTtcbiAgICAgICAgICBvcGFjaXRpZXNbaW5kZXhdID0gb2JqWydiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknXTtcbiAgICAgICAgICBvYmpbJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eSddID0gdG1wO1xuICAgICAgICB9XG5cbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJywgaW1ncy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JywgeFBvcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JywgeVBvcy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcsIHdpZHRocy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnLCBoZWlnaHRzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcsIGZpdHMuam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScsIG9wYWNpdGllcy5qb2luKFwiIFwiKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBiZ09iajtcbiAgICB9XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChub2Rlcywgb2xkSW1nLCBuZXdJbWcsIGZpcnN0VGltZSwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCkge1xuICAgICAgaWYoIW5vZGVzIHx8IG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFvbGRJbWcgfHwgIW5ld0ltZylcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZShub2Rlcywgb2xkSW1nKTtcbiAgICAgIGZvcih2YXIga2V5IGluIG5ld0ltZyl7XG4gICAgICAgIG5ld0ltZ1trZXldWydmaXJzdFRpbWUnXSA9IGZpcnN0VGltZTtcbiAgICAgIH1cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkQmFja2dyb3VuZEltYWdlKG5vZGVzLCBuZXdJbWcsIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIG9sZEltZzogbmV3SW1nLFxuICAgICAgICBuZXdJbWc6IG9sZEltZyxcbiAgICAgICAgZmlyc3RUaW1lOiBmYWxzZSxcbiAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlOiBwcm9tcHRJbnZhbGlkSW1hZ2UsXG4gICAgICAgIHZhbGlkYXRlVVJMOiB2YWxpZGF0ZVVSTFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBBZGQgYSBiYWNrZ3JvdW5kIGltYWdlIHRvIGdpdmVuIG5vZGVzLlxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKG5vZGVzLCBiZ09iaiwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCkge1xuICAgICAgaWYoIW5vZGVzIHx8IG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFiZ09iailcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgb2JqID0gYmdPYmpbbm9kZS5kYXRhKCdpZCcpXTtcbiAgICAgICAgaWYoIW9iaiB8fCAkLmlzRW1wdHlPYmplY3Qob2JqKSlcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAvLyBMb2FkIHRoZSBpbWFnZSBmcm9tIGxvY2FsLCBlbHNlIGp1c3QgcHV0IHRoZSBVUkxcbiAgICAgICAgaWYob2JqWydmcm9tRmlsZSddKVxuICAgICAgICBsb2FkQmFja2dyb3VuZFRoZW5BcHBseShub2RlLCBvYmopO1xuICAgICAgICAvLyBWYWxpZGl0eSBvZiBnaXZlbiBVUkwgc2hvdWxkIGJlIGNoZWNrZWQgYmVmb3JlIGFwcGx5aW5nIGl0XG4gICAgICAgIGVsc2UgaWYob2JqWydmaXJzdFRpbWUnXSl7XG4gICAgICAgICAgaWYodHlwZW9mIHZhbGlkYXRlVVJMID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgdmFsaWRhdGVVUkwobm9kZSwgb2JqLCBhcHBseUJhY2tncm91bmQsIHByb21wdEludmFsaWRJbWFnZSk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgY2hlY2tHaXZlblVSTChub2RlLCBvYmopO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhcHBseUJhY2tncm91bmQobm9kZSwgb2JqKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbG9hZEJhY2tncm91bmRUaGVuQXBwbHkobm9kZSwgYmdPYmopIHtcbiAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgIHZhciBpbWdGaWxlID0gYmdPYmpbJ2JhY2tncm91bmQtaW1hZ2UnXTtcblxuICAgICAgICAvLyBDaGVjayB3aGV0aGVyIGdpdmVuIGZpbGUgaXMgYW4gaW1hZ2UgZmlsZVxuICAgICAgICBpZihpbWdGaWxlLnR5cGUuaW5kZXhPZihcImltYWdlXCIpICE9PSAwKXtcbiAgICAgICAgICBpZihwcm9tcHRJbnZhbGlkSW1hZ2UpXG4gICAgICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2UoXCJJbnZhbGlkIGltYWdlIGZpbGUgaXMgZ2l2ZW4hXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGltZ0ZpbGUpO1xuXG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHZhciBpbWcgPSByZWFkZXIucmVzdWx0O1xuICAgICAgICAgIGlmKGltZyl7XG4gICAgICAgICAgICBiZ09ialsnYmFja2dyb3VuZC1pbWFnZSddID0gaW1nO1xuICAgICAgICAgICAgYmdPYmpbJ2Zyb21GaWxlJ10gPSBmYWxzZTtcbiAgICAgICAgICAgIGFwcGx5QmFja2dyb3VuZChub2RlLCBiZ09iaik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICBpZihwcm9tcHRJbnZhbGlkSW1hZ2UpXG4gICAgICAgICAgICAgIHByb21wdEludmFsaWRJbWFnZShcIkdpdmVuIGZpbGUgY291bGQgbm90IGJlIHJlYWQhXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY2hlY2tHaXZlblVSTChub2RlLCBiZ09iail7XG4gICAgICAgIHZhciB1cmwgPSBiZ09ialsnYmFja2dyb3VuZC1pbWFnZSddO1xuICAgICAgICB2YXIgZXh0ZW5zaW9uID0gKHVybC5zcGxpdCgvWz8jXS8pWzBdKS5zcGxpdChcIi5cIikucG9wKCk7XG4gICAgICAgIHZhciB2YWxpZEV4dGVuc2lvbnMgPSBbXCJwbmdcIiwgXCJzdmdcIiwgXCJqcGdcIiwgXCJqcGVnXCJdO1xuXG4gICAgICAgIGlmKCF2YWxpZEV4dGVuc2lvbnMuaW5jbHVkZXMoZXh0ZW5zaW9uKSl7XG4gICAgICAgICAgaWYodHlwZW9mIHByb21wdEludmFsaWRJbWFnZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIHByb21wdEludmFsaWRJbWFnZShcIkludmFsaWQgVVJMIGlzIGdpdmVuIVwiKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3VsdCwgc3RhdHVzLCB4aHIpe1xuICAgICAgICAgICAgYXBwbHlCYWNrZ3JvdW5kKG5vZGUsIGJnT2JqKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyb3Ipe1xuICAgICAgICAgICAgaWYocHJvbXB0SW52YWxpZEltYWdlKVxuICAgICAgICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2UoXCJJbnZhbGlkIFVSTCBpcyBnaXZlbiFcIik7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5QmFja2dyb3VuZChub2RlLCBiZ09iaikge1xuXG4gICAgICAgIGlmKGVsZW1lbnRVdGlsaXRpZXMuaGFzQmFja2dyb3VuZEltYWdlKG5vZGUpKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB2YXIgaW1ncyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciB4UG9zID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciB5UG9zID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciB3aWR0aHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgaGVpZ2h0cyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnKS5zcGxpdChcIiBcIikgOiBbXTtcbiAgICAgICAgdmFyIGZpdHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciBvcGFjaXRpZXMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScpID8gKFwiXCIgKyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScpKS5zcGxpdChcIiBcIikgOiBbXTtcblxuICAgICAgICB2YXIgaW5kZXhUb0luc2VydCA9IGltZ3MubGVuZ3RoO1xuXG4gICAgICAgIC8vIGluc2VydCB0byBsZW5ndGgtMVxuICAgICAgICBpZihlbGVtZW50VXRpbGl0aWVzLmhhc0Nsb25lTWFya2VyKGltZ3MpKXtcbiAgICAgICAgICBpbmRleFRvSW5zZXJ0LS07XG4gICAgICAgIH1cblxuICAgICAgICBpbWdzLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1pbWFnZSddKTtcbiAgICAgICAgZml0cy5zcGxpY2UoaW5kZXhUb0luc2VydCwgMCwgYmdPYmpbJ2JhY2tncm91bmQtZml0J10pO1xuICAgICAgICBvcGFjaXRpZXMuc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknXSk7XG4gICAgICAgIHhQb3Muc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnXSk7XG4gICAgICAgIHlQb3Muc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXknXSk7XG4gICAgICAgIHdpZHRocy5zcGxpY2UoaW5kZXhUb0luc2VydCwgMCwgYmdPYmpbJ2JhY2tncm91bmQtd2lkdGgnXSk7XG4gICAgICAgIGhlaWdodHMuc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLWhlaWdodCddKTtcblxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnLCBpbWdzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnLCB4UG9zLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknLCB5UG9zLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJywgd2lkdGhzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWhlaWdodCcsIGhlaWdodHMuam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0JywgZml0cy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5Jywgb3BhY2l0aWVzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgYmdPYmpbJ2ZpcnN0VGltZSddID0gZmFsc2U7XG5cbiAgICAgICAgaWYodXBkYXRlSW5mbylcbiAgICAgICAgICB1cGRhdGVJbmZvKCk7XG5cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZWxlbWVudFV0aWxpdGllcy5oYXNDbG9uZU1hcmtlciA9IGZ1bmN0aW9uIChpbWdzKSB7XG4gICAgICB2YXIgY2xvbmVJbWcgPSAnZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsJTNDc3ZnJTIwd2lkdGglM0QlMjIxMDAlMjIlMjBoZWlnaHQlM0QlMjIxMDAlMjIlMjB2aWV3Qm94JTNEJTIyMCUyMDAlMjAxMDAlMjAxMDAlMjIlMjBzdHlsZSUzRCUyMmZpbGwlM0Fub25lJTNCc3Ryb2tlJTNBYmxhY2slM0JzdHJva2Utd2lkdGglM0EwJTNCJTIyJTIweG1sbnMlM0QlMjJodHRwJTNBLy93d3cudzMub3JnLzIwMDAvc3ZnJTIyJTIwJTNFJTNDcmVjdCUyMHglM0QlMjIwJTIyJTIweSUzRCUyMjAlMjIlMjB3aWR0aCUzRCUyMjEwMCUyMiUyMGhlaWdodCUzRCUyMjEwMCUyMiUyMHN0eWxlJTNEJTIyZmlsbCUzQSUyMzgzODM4MyUyMi8lM0UlMjAlM0Mvc3ZnJTNFJztcbiAgICAgIHJldHVybiAoaW1ncy5pbmRleE9mKGNsb25lSW1nKSA+IC0xKTtcbiAgICB9O1xuXG4gICAgLy8gUmVtb3ZlIGEgYmFja2dyb3VuZCBpbWFnZSBmcm9tIGdpdmVuIG5vZGVzLlxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKG5vZGVzLCBiZ09iaikge1xuICAgICAgaWYoIW5vZGVzIHx8IG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFiZ09iailcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgb2JqID0gYmdPYmpbbm9kZS5kYXRhKCdpZCcpXTtcbiAgICAgICAgaWYoIW9iailcbiAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICB2YXIgaW1ncyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciB4UG9zID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciB5UG9zID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciB3aWR0aHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICB2YXIgaGVpZ2h0cyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnKS5zcGxpdChcIiBcIikgOiBbXTtcbiAgICAgICAgdmFyIGZpdHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0Jykuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgIHZhciBvcGFjaXRpZXMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScpID8gKFwiXCIgKyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScpKS5zcGxpdChcIiBcIikgOiBbXTtcblxuICAgICAgICB2YXIgaW5kZXggPSAtMTtcbiAgICAgICAgaWYodHlwZW9mIG9ialsnYmFja2dyb3VuZC1pbWFnZSddID09PSBcInN0cmluZ1wiKVxuICAgICAgICAgIGluZGV4ID0gaW1ncy5pbmRleE9mKG9ialsnYmFja2dyb3VuZC1pbWFnZSddLnNwbGl0KFwiIFwiKVswXSk7XG4gICAgICAgIGVsc2UgaWYoQXJyYXkuaXNBcnJheShvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSkpXG4gICAgICAgICAgaW5kZXggPSBpbWdzLmluZGV4T2Yob2JqWydiYWNrZ3JvdW5kLWltYWdlJ11bMF0pO1xuXG4gICAgICAgIGlmKGluZGV4ID4gLTEpe1xuICAgICAgICAgIGltZ3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICBmaXRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgb3BhY2l0aWVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgeFBvcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIHlQb3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICB3aWR0aHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICBoZWlnaHRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnLCBpbWdzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnLCB4UG9zLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknLCB5UG9zLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJywgd2lkdGhzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWhlaWdodCcsIGhlaWdodHMuam9pbihcIiBcIikpO1xuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0JywgZml0cy5qb2luKFwiIFwiKSk7XG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5Jywgb3BhY2l0aWVzLmpvaW4oXCIgXCIpKTtcbiAgICAgICAgYmdPYmpbJ2ZpcnN0VGltZSddID0gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmV2ZXJzZUVkZ2UgPSBmdW5jdGlvbihlZGdlKXtcbiAgICAgIHZhciBvbGRTb3VyY2UgPSBlZGdlLnNvdXJjZSgpLmlkKCk7XG4gICAgICB2YXIgb2xkVGFyZ2V0ID0gZWRnZS50YXJnZXQoKS5pZCgpO1xuICAgICAgdmFyIG9sZFBvcnRTb3VyY2UgPSBlZGdlLmRhdGEoXCJwb3J0c291cmNlXCIpO1xuICAgICAgdmFyIG9sZFBvcnRUYXJnZXQgPSBlZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpO1xuICAgICAgdmFyIHNlZ21lbnRQb2ludHMgPSBlZGdlLnNlZ21lbnRQb2ludHMoKTtcbiAgICAgIHZhciBjb250cm9sUG9pbnRzID0gZWRnZS5jb250cm9sUG9pbnRzKCk7XG5cbiAgICAgIGVkZ2UuZGF0YSgpLnNvdXJjZSA9IG9sZFRhcmdldDtcbiAgICAgIGVkZ2UuZGF0YSgpLnRhcmdldCA9IG9sZFNvdXJjZTtcbiAgICAgIGVkZ2UuZGF0YSgpLnBvcnRzb3VyY2UgPSBvbGRQb3J0VGFyZ2V0O1xuICAgICAgZWRnZS5kYXRhKCkucG9ydHRhcmdldCA9IG9sZFBvcnRTb3VyY2U7XG4gICAgICAgZWRnZSA9IGVkZ2UubW92ZSh7XG4gICAgICAgICB0YXJnZXQ6IG9sZFNvdXJjZSxcbiAgICAgICAgIHNvdXJjZSA6IG9sZFRhcmdldCAgICAgICAgXG4gICAgICB9KTtcblxuICAgICAgaWYoQXJyYXkuaXNBcnJheShzZWdtZW50UG9pbnRzKSl7XG4gICAgICAgIHNlZ21lbnRQb2ludHMucmV2ZXJzZSgpO1xuICAgICAgICBlZGdlLmRhdGEoKS5iZW5kUG9pbnRQb3NpdGlvbnMgPSBzZWdtZW50UG9pbnRzO1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KGNvbnRyb2xQb2ludHMpKSB7XG4gICAgICAgICAgY29udHJvbFBvaW50cy5yZXZlcnNlKCk7XG4gICAgICAgICAgZWRnZS5kYXRhKCkuY29udHJvbFBvaW50UG9zaXRpb25zID0gY29udHJvbFBvaW50cztcbiAgICAgICAgfVxuICAgICAgICB2YXIgZWRnZUVkaXRpbmcgPSBjeS5lZGdlRWRpdGluZygnZ2V0Jyk7XG4gICAgICAgIGVkZ2VFZGl0aW5nLmluaXRBbmNob3JQb2ludHMoZWRnZSk7XG4gICAgICB9XG4gICAgXG5cbiAgICAgIHJldHVybiBlZGdlO1xuICAgIH1cblxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXNFeHRlbmRlcjtcbn07XG4iLCIvKiBcbiAqIFV0aWxpdHkgZmlsZSB0byBnZXQgYW5kIHNldCB0aGUgbGlicmFyaWVzIHRvIHdoaWNoIHNiZ252aXogaXMgZGVwZW5kZW50IGZyb20gYW55IGZpbGUuXG4gKi9cblxudmFyIGxpYlV0aWxpdGllcyA9IGZ1bmN0aW9uKCl7XG59O1xuXG5saWJVdGlsaXRpZXMuc2V0TGlicyA9IGZ1bmN0aW9uKGxpYnMpIHtcbiAgdGhpcy5saWJzID0gbGlicztcbn07XG5cbmxpYlV0aWxpdGllcy5nZXRMaWJzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmxpYnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxpYlV0aWxpdGllczsiLCJ2YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcblxuLypcbiAqIFRoZSBtYWluIHV0aWxpdGllcyB0byBiZSBleHBvc2VkIGRpcmVjdGx5LlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgZWxlbWVudFV0aWxpdGllcywgb3B0aW9ucywgY3ksIHNiZ252aXpJbnN0YW5jZTtcblxuICBmdW5jdGlvbiBtYWluVXRpbGl0aWVzIChwYXJhbSkge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMgPSBwYXJhbS5lbGVtZW50VXRpbGl0aWVzO1xuICAgIG9wdGlvbnMgPSBwYXJhbS5vcHRpb25VdGlsaXRpZXMuZ2V0T3B0aW9ucygpO1xuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KCk7XG4gICAgc2JnbnZpekluc3RhbmNlID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEluc3RhbmNlKCk7XG4gIH07XG5cbiAgLypcbiAgICogQWRkcyBhIG5ldyBub2RlIHdpdGggdGhlIGdpdmVuIGNsYXNzIGFuZCBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmFkZE5vZGUgPSBmdW5jdGlvbih4LCB5ICwgbm9kZVBhcmFtcywgaWQsIHBhcmVudCwgdmlzaWJpbGl0eSkge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgbWFwIHR5cGVcbiAgICBpZiAodHlwZW9mIG5vZGVQYXJhbXMgPT0gJ29iamVjdCcpe1xuLyogXG4gICAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKVxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUobm9kZVBhcmFtcy5sYW5ndWFnZSk7XG4gICAgICBlbHNlIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSAhPSBub2RlUGFyYW1zLmxhbmd1YWdlKVxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJVbmtub3duXCIpOyAqL1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4LCB5LCBub2RlUGFyYW1zLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG5ld05vZGUgOiB7XG4gICAgICAgICAgeDogeCxcbiAgICAgICAgICB5OiB5LFxuICAgICAgICAgIGNsYXNzOiBub2RlUGFyYW1zLFxuICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmlsaXR5XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGROb2RlXCIsIHBhcmFtKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogQWRkcyBhIG5ldyBlZGdlIHdpdGggdGhlIGdpdmVuIGNsYXNzIGFuZCBoYXZpbmcgdGhlIGdpdmVuIHNvdXJjZSBhbmQgdGFyZ2V0IGlkcy4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuYWRkRWRnZSA9IGZ1bmN0aW9uKHNvdXJjZSwgdGFyZ2V0LCBlZGdlUGFyYW1zLCBpbnZhbGlkRWRnZUNhbGxiYWNrLCBpZCwgdmlzaWJpbGl0eSkge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgbWFwIHR5cGVcbiAgICBpZiAodHlwZW9mIGVkZ2VQYXJhbXMgPT0gJ29iamVjdCcpe1xuXG4gICAgIC8qICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKVxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoZWRnZVBhcmFtcy5sYW5ndWFnZSk7XG4gICAgICBlbHNlIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSAhPSBlZGdlUGFyYW1zLmxhbmd1YWdlKVxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJIeWJyaWRBbnlcIik7ICovXG4gICAgfVxuICAgIC8vIEdldCB0aGUgdmFsaWRhdGlvbiByZXN1bHRcbiAgICB2YXIgZWRnZWNsYXNzID0gZWRnZVBhcmFtcy5jbGFzcyA/IGVkZ2VQYXJhbXMuY2xhc3MgOiBlZGdlUGFyYW1zO1xuICAgIHZhciB2YWxpZGF0aW9uID0gZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyhlZGdlY2xhc3MsIGN5LmdldEVsZW1lbnRCeUlkKHNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHRhcmdldCkpO1xuXG4gICAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ2ludmFsaWQnIGNhbmNlbCB0aGUgb3BlcmF0aW9uXG4gICAgaWYgKHZhbGlkYXRpb24gPT09ICdpbnZhbGlkJykge1xuICAgICAgaWYodHlwZW9mIGludmFsaWRFZGdlQ2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIil7XG4gICAgICAgIGludmFsaWRFZGdlQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiB2YWxpZGF0aW9uIHJlc3VsdCBpcyAncmV2ZXJzZScgcmV2ZXJzZSB0aGUgc291cmNlLXRhcmdldCBwYWlyIGJlZm9yZSBjcmVhdGluZyB0aGUgZWRnZVxuICAgIGlmICh2YWxpZGF0aW9uID09PSAncmV2ZXJzZScpIHtcbiAgICAgIHZhciB0ZW1wID0gc291cmNlO1xuICAgICAgc291cmNlID0gdGFyZ2V0O1xuICAgICAgdGFyZ2V0ID0gdGVtcDtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2Uoc291cmNlLCB0YXJnZXQsIGVkZ2VQYXJhbXMsIGlkLCB2aXNpYmlsaXR5KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG5ld0VkZ2UgOiB7XG4gICAgICAgICAgc291cmNlOiBzb3VyY2UsXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgY2xhc3M6IGVkZ2VQYXJhbXMsXG4gICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgIHZpc2liaWxpdHk6IHZpc2liaWxpdHlcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIHJlc3VsdCA9IGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRFZGdlXCIsIHBhcmFtKTtcbiAgICAgIHJldHVybiByZXN1bHQuZWxlcztcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogQWRkcyBhIHByb2Nlc3Mgd2l0aCBjb252ZW5pZW50IGVkZ2VzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBwbGVhc2Ugc2VlICdodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L25ld3QvaXNzdWVzLzknLlxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyA9IGZ1bmN0aW9uKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIHNvdXJjZSBhbmQgdGFyZ2V0IElEcyBhcmUgZ2l2ZW4gZ2V0IHRoZSBlbGVtZW50cyBieSBJRHNcbiAgICB2YXIgc291cmNlID0gdHlwZW9mIF9zb3VyY2UgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3NvdXJjZSkgOiBfc291cmNlO1xuICAgIHZhciB0YXJnZXQgPSB0eXBlb2YgX3RhcmdldCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfdGFyZ2V0KSA6IF90YXJnZXQ7XG5cbiAgICAvLyBJZiBzb3VyY2Ugb3IgdGFyZ2V0IGRvZXMgbm90IGhhdmUgYW4gRVBOIGNsYXNzIHRoZSBvcGVyYXRpb24gaXMgbm90IHZhbGlkXG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3Moc291cmNlKSB8fCAhZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKHRhcmdldCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzKF9zb3VyY2UsIF90YXJnZXQsIHByb2Nlc3NUeXBlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIHNvdXJjZTogX3NvdXJjZSxcbiAgICAgICAgdGFyZ2V0OiBfdGFyZ2V0LFxuICAgICAgICBwcm9jZXNzVHlwZTogcHJvY2Vzc1R5cGVcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlc1wiLCBwYXJhbSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIGNvbnZlcnQgY29sbGFwc2VkIGNvbXBvdW5kIG5vZGVzIHRvIHNpbXBsZSBub2Rlc1xuICAvLyBhbmQgdXBkYXRlIHBvcnQgdmFsdWVzIG9mIHBhc3RlZCBub2RlcyBhbmQgZWRnZXNcbiAgdmFyIGNsb25lQ29sbGFwc2VkTm9kZXNBbmRQb3J0cyA9IGZ1bmN0aW9uIChlbGVzQmVmb3JlKXtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgIHZhciBlbGVzQWZ0ZXIgPSBjeS5lbGVtZW50cygpO1xuICAgIHZhciBlbGVzRGlmZiA9IGVsZXNBZnRlci5kaWZmKGVsZXNCZWZvcmUpLmxlZnQ7XG5cbiAgICAvLyBzaGFsbG93IGNvcHkgY29sbGFwc2VkIG5vZGVzIC0gY29sbGFwc2VkIGNvbXBvdW5kcyBiZWNvbWUgc2ltcGxlIG5vZGVzXG4gICAgLy8gZGF0YSByZWxhdGVkIHRvIGNvbGxhcHNlZCBub2RlcyBhcmUgcmVtb3ZlZCBmcm9tIGdlbmVyYXRlZCBjbG9uZXNcbiAgICAvLyByZWxhdGVkIGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vaVZpcy1hdC1CaWxrZW50L25ld3QvaXNzdWVzLzE0NVxuICAgIHZhciBjb2xsYXBzZWROb2RlcyA9IGVsZXNEaWZmLmZpbHRlcignbm9kZS5jeS1leHBhbmQtY29sbGFwc2UtY29sbGFwc2VkLW5vZGUnKTtcblxuICAgIGNvbGxhcHNlZE5vZGVzLmNvbm5lY3RlZEVkZ2VzKCkucmVtb3ZlKCk7XG4gICAgY29sbGFwc2VkTm9kZXMucmVtb3ZlQ2xhc3MoJ2N5LWV4cGFuZC1jb2xsYXBzZS1jb2xsYXBzZWQtbm9kZScpO1xuICAgIGNvbGxhcHNlZE5vZGVzLnJlbW92ZURhdGEoJ2NvbGxhcHNlZENoaWxkcmVuJyk7XG4gICAgY29sbGFwc2VkTm9kZXMucmVtb3ZlRGF0YSgncG9zaXRpb24tYmVmb3JlLWNvbGxhcHNlIHNpemUtYmVmb3JlLWNvbGxhcHNlJyk7XG4gICAgY29sbGFwc2VkTm9kZXMucmVtb3ZlRGF0YSgnZXhwYW5kY29sbGFwc2VSZW5kZXJlZEN1ZVNpemUgZXhwYW5kY29sbGFwc2VSZW5kZXJlZFN0YXJ0WCBleHBhbmRjb2xsYXBzZVJlbmRlcmVkU3RhcnRZJyk7XG5cbiAgICAvLyBjbG9uaW5nIHBvcnRzXG4gICAgZWxlc0RpZmYubm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKF9ub2RlKXtcbiAgICAgIGlmKF9ub2RlLmRhdGEoXCJwb3J0c1wiKS5sZW5ndGggPT0gMil7XG4gICAgICAgICAgdmFyIG9sZFBvcnROYW1lMCA9IF9ub2RlLmRhdGEoXCJwb3J0c1wiKVswXS5pZDtcbiAgICAgICAgICB2YXIgb2xkUG9ydE5hbWUxID0gX25vZGUuZGF0YShcInBvcnRzXCIpWzFdLmlkO1xuICAgICAgICAgIF9ub2RlLmRhdGEoXCJwb3J0c1wiKVswXS5pZCA9IF9ub2RlLmlkKCkgKyBcIi4xXCI7XG4gICAgICAgICAgX25vZGUuZGF0YShcInBvcnRzXCIpWzFdLmlkID0gX25vZGUuaWQoKSArIFwiLjJcIjtcblxuICAgICAgICAgIF9ub2RlLm91dGdvZXJzKCkuZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKF9lZGdlKXtcbiAgICAgICAgICAgIGlmKF9lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIpID09IG9sZFBvcnROYW1lMCl7XG4gICAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIsIF9ub2RlLmRhdGEoXCJwb3J0c1wiKVswXS5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKF9lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIpID09IG9sZFBvcnROYW1lMSl7XG4gICAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIsIF9ub2RlLmRhdGEoXCJwb3J0c1wiKVsxXS5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiLCBfbm9kZS5pZCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBfbm9kZS5pbmNvbWVycygpLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbihfZWRnZSl7XG4gICAgICAgICAgICBpZihfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiKSA9PSBvbGRQb3J0TmFtZTApe1xuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiLCBfbm9kZS5kYXRhKFwicG9ydHNcIilbMF0uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiKSA9PSBvbGRQb3J0TmFtZTEpe1xuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiLCBfbm9kZS5kYXRhKFwicG9ydHNcIilbMV0uaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIiwgX25vZGUuaWQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBfbm9kZS5vdXRnb2VycygpLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbihfZWRnZSl7XG4gICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIiwgX25vZGUuaWQoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBfbm9kZS5pbmNvbWVycygpLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbihfZWRnZSl7XG4gICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnR0YXJnZXRcIiwgX25vZGUuaWQoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGVsZXNEaWZmLnNlbGVjdCgpO1xuICB9XG5cbiAgLypcbiAgICogQ2xvbmUgZ2l2ZW4gZWxlbWVudHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jbG9uZUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMsIHBhc3RlQXRNb3VzZUxvYykge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvcHlFbGVtZW50cyhlbGVzKTtcblxuICAgIHRoaXMucGFzdGVFbGVtZW50cyhwYXN0ZUF0TW91c2VMb2MpO1xuICB9O1xuXG4gIC8qXG4gICAqIENvcHkgZ2l2ZW4gZWxlbWVudHMgdG8gY2xpcGJvYXJkLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY29weUVsZW1lbnRzID0gZnVuY3Rpb24gKGVsZXMpIHtcbiAgICBjeS5jbGlwYm9hcmQoKS5jb3B5KGVsZXMpO1xuICB9O1xuXG4gIC8qXG4gICAqIFBhc3RlIHRoZSBlbGVtZW50cyBjb3BpZWQgdG8gY2xpcGJvYXJkLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMucGFzdGVFbGVtZW50cyA9IGZ1bmN0aW9uKHBhc3RlQXRNb3VzZUxvYykge1xuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZWxlc0JlZm9yZSA9IGN5LmVsZW1lbnRzKCk7XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInBhc3RlXCIse3Bhc3RlQXRNb3VzZUxvYzogcGFzdGVBdE1vdXNlTG9jfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY3kuY2xpcGJvYXJkKCkucGFzdGUoKTtcbiAgICB9XG4gICAgY2xvbmVDb2xsYXBzZWROb2Rlc0FuZFBvcnRzKGVsZXNCZWZvcmUpO1xuICAgIGN5Lm5vZGVzKFwiOnNlbGVjdGVkXCIpLmVtaXQoJ2RhdGEnKTtcbiAgfTtcblxuICAvKlxuICAgKiBBbGlnbnMgZ2l2ZW4gbm9kZXMgaW4gZ2l2ZW4gaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgb3JkZXIuXG4gICAqIEhvcml6b250YWwgYW5kIHZlcnRpY2FsIHBhcmFtZXRlcnMgbWF5IGJlICdub25lJyBvciB1bmRlZmluZWQuXG4gICAqIGFsaWduVG8gcGFyYW1ldGVyIGluZGljYXRlcyB0aGUgbGVhZGluZyBub2RlLlxuICAgKiBSZXF1cmlyZXMgY3l0b3NjYXBlLWdyaWQtZ3VpZGUgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5hbGlnbiA9IGZ1bmN0aW9uIChub2RlcywgaG9yaXpvbnRhbCwgdmVydGljYWwsIGFsaWduVG8pIHtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhbGlnblwiLCB7XG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgaG9yaXpvbnRhbDogaG9yaXpvbnRhbCxcbiAgICAgICAgdmVydGljYWw6IHZlcnRpY2FsLFxuICAgICAgICBhbGlnblRvOiBhbGlnblRvXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZXMuYWxpZ24oaG9yaXpvbnRhbCwgdmVydGljYWwsIGFsaWduVG8pO1xuICAgIH1cblxuICAgIGlmKGN5LmVkZ2VzKFwiOnNlbGVjdGVkXCIpLmxlbmd0aCA9PSAxICkge1xuICAgICAgY3kuZWRnZXMoKS51bnNlbGVjdCgpOyAgICAgIFxuICAgIH1cbiAgICBcbiAgfTtcblxuICAvKlxuICAgKiBDcmVhdGUgY29tcG91bmQgZm9yIGdpdmVuIG5vZGVzLiBjb21wb3VuZFR5cGUgbWF5IGJlICdjb21wbGV4JyBvciAnY29tcGFydG1lbnQnLlxuICAgKiBUaGlzIG1ldGhvZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMgPSBmdW5jdGlvbiAoX25vZGVzLCBjb21wb3VuZFR5cGUpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5vZGVzID0gX25vZGVzO1xuICAgIC8qXG4gICAgICogRWxlbWluYXRlIHRoZSBub2RlcyB3aGljaCBjYW5ub3QgaGF2ZSBhIHBhcmVudCB3aXRoIGdpdmVuIGNvbXBvdW5kIHR5cGVcbiAgICAgKi9cbiAgICBub2RlcyA9IF9ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZW1lbnQsIGkpIHtcbiAgICAgIGlmKHR5cGVvZiBlbGVtZW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGVsZW1lbnQgPSBpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc1ZhbGlkUGFyZW50KHNiZ25jbGFzcywgY29tcG91bmRUeXBlLCBlbGVtZW50KTtcbiAgICB9KTtcblxuICAgIG5vZGVzID0gZWxlbWVudFV0aWxpdGllcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xuXG4gICAgLy8gQWxsIGVsZW1lbnRzIHNob3VsZCBoYXZlIHRoZSBzYW1lIHBhcmVudCBhbmQgdGhlIGNvbW1vbiBwYXJlbnQgc2hvdWxkIG5vdCBiZSBhICdjb21wbGV4J1xuICAgIC8vIGlmIGNvbXBvdW5kVHlwZSBpcyAnY29tcGFydGVudCdcbiAgICAvLyBiZWNhdXNlIHRoZSBvbGQgY29tbW9uIHBhcmVudCB3aWxsIGJlIHRoZSBwYXJlbnQgb2YgdGhlIG5ldyBjb21wYXJ0bWVudCBhZnRlciB0aGlzIG9wZXJhdGlvbiBhbmRcbiAgICAvLyAnY29tcGxleGVzJyBjYW5ub3QgaW5jbHVkZSAnY29tcGFydG1lbnRzJ1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT0gMCB8fCAhZWxlbWVudFV0aWxpdGllcy5hbGxIYXZlVGhlU2FtZVBhcmVudChub2RlcylcbiAgICAgICAgICAgIHx8ICggKGNvbXBvdW5kVHlwZSA9PT0gJ2NvbXBhcnRtZW50JyB8fCBjb21wb3VuZFR5cGUgPT0gJ3N1Ym1hcCcpICYmIG5vZGVzLnBhcmVudCgpLmRhdGEoJ2NsYXNzJylcbiAgICAgICAgICAgICYmIG5vZGVzLnBhcmVudCgpLmRhdGEoJ2NsYXNzJykuc3RhcnRzV2l0aCgnY29tcGxleCcpICkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY3kudW5kb1JlZG8oKSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBjb21wb3VuZFR5cGU6IGNvbXBvdW5kVHlwZSxcbiAgICAgICAgbm9kZXNUb01ha2VDb21wb3VuZDogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXNcIiwgcGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKG5vZGVzLCBjb21wb3VuZFR5cGUpO1xuICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBNb3ZlIHRoZSBub2RlcyB0byBhIG5ldyBwYXJlbnQgYW5kIGNoYW5nZSB0aGVpciBwb3NpdGlvbiBpZiBwb3NzRGlmZiBwYXJhbXMgYXJlIHNldC5cbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbiBhbmQgY2hlY2tzIGlmIHRoZSBvcGVyYXRpb24gaXMgdmFsaWQuXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNoYW5nZVBhcmVudCA9IGZ1bmN0aW9uKG5vZGVzLCBfbmV3UGFyZW50LCBwb3NEaWZmWCwgcG9zRGlmZlkpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5ld1BhcmVudCA9IHR5cGVvZiBfbmV3UGFyZW50ID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9uZXdQYXJlbnQpIDogX25ld1BhcmVudDtcbiAgICAvLyBOZXcgcGFyZW50IGlzIHN1cHBvc2VkIHRvIGJlIG9uZSBvZiB0aGUgcm9vdCwgYSBjb21wbGV4IG9yIGEgY29tcGFydG1lbnRcbiAgICBpZiAobmV3UGFyZW50ICYmICFuZXdQYXJlbnQuZGF0YShcImNsYXNzXCIpLnN0YXJ0c1dpdGgoXCJjb21wbGV4XCIpICYmIG5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikgIT0gXCJjb21wYXJ0bWVudFwiXG4gICAgICAgICAgICAmJiBuZXdQYXJlbnQuZGF0YShcImNsYXNzXCIpICE9IFwic3VibWFwXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLypcbiAgICAgKiBFbGVtaW5hdGUgdGhlIG5vZGVzIHdoaWNoIGNhbm5vdCBoYXZlIHRoZSBuZXdQYXJlbnQgYXMgdGhlaXIgcGFyZW50XG4gICAgICovXG4gICAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZW1lbnQsIGkpIHtcbiAgICAgIGlmKHR5cGVvZiBlbGVtZW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGVsZW1lbnQgPSBpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc1ZhbGlkUGFyZW50KHNiZ25jbGFzcywgbmV3UGFyZW50LCBlbGVtZW50KTtcbiAgICB9KTtcblxuICAgIC8vIERpc2NhcmQgdGhlIG5vZGVzIHdob3NlIHBhcmVudCBpcyBhbHJlYWR5IG5ld1BhcmVudC5cbiAgICAvLyBEaXNjYXJkIHRoZSBuZXdQYXJlbnQgaXRzZWxmIGlmIGl0IGlzIGFtb25nIHRoZSBub2Rlc1xuICAgIG5vZGVzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGUsIGkpIHtcbiAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgZWxlID0gaTtcbiAgICAgIH1cblxuICAgICAgLy8gRGlzY2FyZCB0aGUgbmV3UGFyZW50IGlmIGl0IGlzIGFtb25nIHRoZSBub2Rlc1xuICAgICAgaWYgKG5ld1BhcmVudCAmJiBlbGUuaWQoKSA9PT0gbmV3UGFyZW50LmlkKCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gRGlzY2FyZCB0aGUgbm9kZXMgd2hvc2UgcGFyZW50IGlzIGFscmVhZHkgbmV3UGFyZW50XG4gICAgICBpZiAoIW5ld1BhcmVudCkge1xuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9PSBuZXdQYXJlbnQuaWQoKTtcbiAgICB9KTtcblxuICAgIC8vIElmIHNvbWUgbm9kZXMgYXJlIGFuY2VzdG9yIG9mIG5ldyBwYXJlbnQgZWxlbWluYXRlIHRoZW1cbiAgICBpZiAobmV3UGFyZW50KSB7XG4gICAgICBub2RlcyA9IG5vZGVzLmRpZmZlcmVuY2UobmV3UGFyZW50LmFuY2VzdG9ycygpKTtcbiAgICB9XG5cbiAgICAvLyBJZiBhbGwgbm9kZXMgYXJlIGVsZW1pbmF0ZWQgcmV0dXJuIGRpcmVjdGx5XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEp1c3QgbW92ZSB0aGUgdG9wIG1vc3Qgbm9kZXNcbiAgICBub2RlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0VG9wTW9zdE5vZGVzKG5vZGVzKTtcblxuICAgIHZhciBwYXJlbnRJZCA9IG5ld1BhcmVudCA/IG5ld1BhcmVudC5pZCgpIDogbnVsbDtcblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZSxcbiAgICAgICAgcGFyZW50RGF0YTogcGFyZW50SWQsIC8vIEl0IGtlZXBzIHRoZSBuZXdQYXJlbnRJZCAoSnVzdCBhbiBpZCBmb3IgZWFjaCBub2RlcyBmb3IgdGhlIGZpcnN0IHRpbWUpXG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgcG9zRGlmZlg6IHBvc0RpZmZYLFxuICAgICAgICBwb3NEaWZmWTogcG9zRGlmZlksXG4gICAgICAgIC8vIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2UgdGhlIGNoYW5nZVBhcmVudCBmdW5jdGlvbiBjYWxsZWQgaXMgbm90IGZyb20gZWxlbWVudFV0aWxpdGllc1xuICAgICAgICAvLyBidXQgZnJvbSB0aGUgdW5kb1JlZG8gZXh0ZW5zaW9uIGRpcmVjdGx5LCBzbyBtYWludGFpbmluZyBwb2ludGVyIGlzIG5vdCBhdXRvbWF0aWNhbGx5IGRvbmUuXG4gICAgICAgIGNhbGxiYWNrOiBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlclxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZVBhcmVudFwiLCBwYXJhbSk7IC8vIFRoaXMgYWN0aW9uIGlzIHJlZ2lzdGVyZWQgYnkgdW5kb1JlZG8gZXh0ZW5zaW9uXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQobm9kZXMsIHBhcmVudElkLCBwb3NEaWZmWCwgcG9zRGlmZlkpO1xuICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBDcmVhdGVzIGFuIGFjdGl2YXRpb24gcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAgICogaW4gdGhlIGNvbXBsZXguIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSB0aGUgc2FtZSBmdW5jdGlvbiBpbiBlbGVtZW50VXRpbGl0aWVzXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNyZWF0ZVRyYW5zbGF0aW9uUmVhY3Rpb24gPSBmdW5jdGlvbiAobVJuYU5hbWUsIHByb3RlaW5OYW1lLCBwcm9jZXNzUG9zaXRpb24sIGVkZ2VMZW5ndGgpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRyYW5zbGF0aW9uUmVhY3Rpb24obVJuYU5hbWUsIHByb3RlaW5OYW1lLCBwcm9jZXNzUG9zaXRpb24sIGVkZ2VMZW5ndGgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgbVJuYU5hbWU6IG1SbmFOYW1lLFxuICAgICAgICBwcm90ZWluTmFtZTogcHJvdGVpbk5hbWUsXG4gICAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxuICAgICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlVHJhbnNsYXRpb25SZWFjdGlvblwiLCBwYXJhbSk7XG4gIH19O1xuXG4gIC8qXG4gICAqIENyZWF0ZXMgYW4gYWN0aXZhdGlvbiByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxuICAgKiBpbiB0aGUgY29tcGxleC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIHRoZSBzYW1lIGZ1bmN0aW9uIGluIGVsZW1lbnRVdGlsaXRpZXNcbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY3JlYXRlVHJhbnNjcmlwdGlvblJlYWN0aW9uID0gZnVuY3Rpb24gKGdlbmVOYW1lLCBtUm5hTmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCBlZGdlTGVuZ3RoKSB7XG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUcmFuc2NyaXB0aW9uUmVhY3Rpb24oZ2VuZU5hbWUsIG1SbmFOYW1lLCBwcm9jZXNzUG9zaXRpb24sIGVkZ2VMZW5ndGgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgZ2VuZU5hbWU6IGdlbmVOYW1lLFxuICAgICAgICBtUm5hTmFtZTogbVJuYU5hbWUsXG4gICAgICAgIHByb2Nlc3NQb3NpdGlvbjogcHJvY2Vzc1Bvc2l0aW9uLFxuICAgICAgICBlZGdlTGVuZ3RoOiBlZGdlTGVuZ3RoXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlVHJhbnNjcmlwdGlvblJlYWN0aW9uXCIsIHBhcmFtKTtcbiAgfX07XG5cbiAgbWFpblV0aWxpdGllcy5jcmVhdGVNZXRhYm9saWNSZWFjdGlvbiA9IGZ1bmN0aW9uKGlucHV0cywgb3V0cHV0cywgcmV2ZXJzaWJsZSwgcmVndWxhdG9yLCByZWd1bGF0b3JNdWx0aW1lciwgb3JpZW50YXRpb24pIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZU1ldGFib2xpY1JlYWN0aW9uKGlucHV0cywgb3V0cHV0cywgcmV2ZXJzaWJsZSwgcmVndWxhdG9yLCByZWd1bGF0b3JNdWx0aW1lciwgb3JpZW50YXRpb24pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbnN0IHBhcmFtID0ge1xuICAgICAgICBpbnB1dHM6IGlucHV0cyxcbiAgICAgICAgb3V0cHV0czogb3V0cHV0cyxcbiAgICAgICAgcmV2ZXJzaWJsZTogcmV2ZXJzaWJsZSxcbiAgICAgICAgcmVndWxhdG9yOiByZWd1bGF0b3IsXG4gICAgICAgIHJlZ3VsYXRvck11bHRpbWVyOiByZWd1bGF0b3JNdWx0aW1lcixcbiAgICAgICAgb3JpZW50YXRpb246IG9yaWVudGF0aW9uXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlTWV0YWJvbGljUmVhY3Rpb25cIiwgcGFyYW0pO1xuICAgIH0gIFxuICB9O1xuXG4gIC8qXG4gICAqIENyZWF0ZXMgYW4gYWN0aXZhdGlvbiByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxuICAgKiBpbiB0aGUgY29tcGxleC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIHRoZSBzYW1lIGZ1bmN0aW9uIGluIGVsZW1lbnRVdGlsaXRpZXNcbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY3JlYXRlTWV0YWJvbGljQ2F0YWx5dGljQWN0aXZpdHkgPSBmdW5jdGlvbiAoaW5wdXROb2RlTGlzdCwgb3V0cHV0Tm9kZUxpc3QsIGNhdGFseXN0TmFtZSwgY2F0YWx5c3RUeXBlLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZU1ldGFib2xpY0NhdGFseXRpY0FjdGl2aXR5KGlucHV0Tm9kZUxpc3QsIG91dHB1dE5vZGVMaXN0LCBjYXRhbHlzdE5hbWUsIGNhdGFseXN0VHlwZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGlucHV0Tm9kZUxpc3Q6IGlucHV0Tm9kZUxpc3QsXG4gICAgICAgIG91dHB1dE5vZGVMaXN0OiBvdXRwdXROb2RlTGlzdCxcbiAgICAgICAgY2F0YWx5c3ROYW1lOiBjYXRhbHlzdE5hbWUsXG4gICAgICAgIGNhdGFseXN0VHlwZTogY2F0YWx5c3RUeXBlLFxuICAgICAgICBwcm9jZXNzUG9zaXRpb246IHByb2Nlc3NQb3NpdGlvbixcbiAgICAgICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXG4gICAgICAgIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCxcbiAgICAgICAgZWRnZUxlbmd0aDogZWRnZUxlbmd0aCxcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVNZXRhYm9saWNDYXRhbHl0aWNBY3Rpdml0eVwiLCBwYXJhbSk7XG4gICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIENyZWF0ZXMgYW4gYWN0aXZhdGlvbiByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxuICAgKiBpbiB0aGUgY29tcGxleC4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi4gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIHRoZSBzYW1lIGZ1bmN0aW9uIGluIGVsZW1lbnRVdGlsaXRpZXNcbiAgICovXG4gIG1haW5VdGlsaXRpZXMuY3JlYXRlQWN0aXZhdGlvblJlYWN0aW9uID0gZnVuY3Rpb24gKHByb3RlaW5OYW1lLCBwcm9jZXNzUG9zaXRpb24sIGVkZ2VMZW5ndGgsIHJldmVyc2UpIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUFjdGl2YXRpb25SZWFjdGlvbihwcm90ZWluTmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCBlZGdlTGVuZ3RoLCByZXZlcnNlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIHByb3RlaW5OYW1lOiBwcm90ZWluTmFtZSxcbiAgICAgICAgcHJvY2Vzc1Bvc2l0aW9uOiBwcm9jZXNzUG9zaXRpb24sXG4gICAgICAgIGVkZ2VMZW5ndGg6IGVkZ2VMZW5ndGgsXG4gICAgICAgIHJldmVyc2U6IHJldmVyc2VcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjcmVhdGVBY3RpdmF0aW9uUmVhY3Rpb25cIiwgcGFyYW0pO1xuICB9fTtcblxuICAvKlxuICAgKiBDcmVhdGVzIGEgdGVtcGxhdGUgcmVhY3Rpb24gd2l0aCBnaXZlbiBwYXJhbWV0ZXJzLiBSZXF1aXJlcyBjb3NlLWJpbGtlbnQgbGF5b3V0IHRvIHRpbGUgdGhlIGZyZWUgbWFjcm9tb2xlY3VsZXMgaW5jbHVkZWRcbiAgICogaW4gdGhlIGNvbXBsZXguIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSB0aGUgc2FtZSBmdW5jdGlvbiBpbiBlbGVtZW50VXRpbGl0aWVzXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAodGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCwgbGF5b3V0UGFyYW0pIHtcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBpZiAodGVtcGxhdGVUeXBlID09PSBcInJldmVyc2libGVcIikge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJIeWJyaWRBbnlcIik7XG4gICAgICB9XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24odGVtcGxhdGVUeXBlLCBtYWNyb21vbGVjdWxlTGlzdCwgY29tcGxleE5hbWUsIHByb2Nlc3NQb3NpdGlvbiwgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsLCB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCwgZWRnZUxlbmd0aCwgbGF5b3V0UGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgdGVtcGxhdGVUeXBlOiB0ZW1wbGF0ZVR5cGUsXG4gICAgICAgIG1hY3JvbW9sZWN1bGVMaXN0OiBtYWNyb21vbGVjdWxlTGlzdCxcbiAgICAgICAgY29tcGxleE5hbWU6IGNvbXBsZXhOYW1lLFxuICAgICAgICBwcm9jZXNzUG9zaXRpb246IHByb2Nlc3NQb3NpdGlvbixcbiAgICAgICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXG4gICAgICAgIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiB0aWxpbmdQYWRkaW5nSG9yaXpvbnRhbCxcbiAgICAgICAgZWRnZUxlbmd0aDogZWRnZUxlbmd0aCxcbiAgICAgICAgbGF5b3V0UGFyYW06IGxheW91dFBhcmFtXG4gICAgICB9O1xuICAgICAgaWYgKHRlbXBsYXRlVHlwZSA9PT0gXCJyZXZlcnNpYmxlXCIpIHtcbiAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOlwiY2hhbmdlTWFwVHlwZVwiLCBwYXJhbToge21hcFR5cGU6IFwiSHlicmlkQW55XCIsIGNhbGxiYWNrOiBmdW5jdGlvbigpe30gfX0pO1xuICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6XCJjcmVhdGVUZW1wbGF0ZVJlYWN0aW9uXCIsIHBhcmFtOiBwYXJhbX0pO1xuICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiYmF0Y2hcIiwgYWN0aW9ucyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZVRlbXBsYXRlUmVhY3Rpb25cIiwgcGFyYW0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24obm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvLCBwcmVzZXJ2ZVJlbGF0aXZlUG9zKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgdXNlQXNwZWN0UmF0aW86IHVzZUFzcGVjdFJhdGlvLFxuICAgICAgICBwZXJmb3JtT3BlcmF0aW9uOiB0cnVlLFxuICAgICAgICBwcmVzZXJ2ZVJlbGF0aXZlUG9zOiBwcmVzZXJ2ZVJlbGF0aXZlUG9zXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwicmVzaXplTm9kZXNcIiwgcGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMobm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvKTtcbiAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gICAgfVxuXG5cbiAgfTtcblxuICAgIC8qXG4gICAgICogUmVzaXplIGdpdmVuIG5vZGVzIGlmIHVzZUFzcGVjdFJhdGlvIGlzIHRydXRoeSBvbmUgb2Ygd2lkdGggb3IgaGVpZ2h0IHNob3VsZCBub3QgYmUgc2V0LlxuICAgICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAgICovXG4gICAgbWFpblV0aWxpdGllcy5yZXNpemVOb2Rlc1RvQ29udGVudCA9IGZ1bmN0aW9uKG5vZGVzLCB1c2VBc3BlY3RSYXRpbykge1xuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gXG4gICAgICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5XaWR0aChub2RlKTtcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbkhlaWdodChub2RlKTtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJyZXNpemVOb2Rlc1wiLCBwYXJhbToge1xuICAgICAgICAgICAgICAgIG5vZGVzOiBub2RlLFxuICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICB1c2VBc3BlY3RSYXRpbzogdXNlQXNwZWN0UmF0aW8sXG4gICAgICAgICAgICAgICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwcmVzZXJ2ZVJlbGF0aXZlUG9zOiB0cnVlXG4gICAgICAgICAgICB9fSk7XG5cbiAgICAgICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICAgICAgICAgIGxvY2F0aW9uczogW1widG9wXCIsXCJyaWdodFwiLFwiYm90dG9tXCIsXCJsZWZ0XCJdXG4gICAgICAgICAgICAgIH07ICAgICAgICAgIFxuICAgICAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6XCJmaXRVbml0c1wiLHBhcmFtIDogcGFyYW19KVxuICAgICAgICAgICAgIH1cbiAgXG5cbiAgICAgICAgICB9KTtcblxuICAgICAgICBcbiAgICAgICAgIFxuICAgICAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJiYXRjaFwiLCBhY3Rpb25zKTtcbiAgICAgICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICAgICAgICAgIHJldHVybiBhY3Rpb25zO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgICAgICAgdmFyIHdpZHRoID0gZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5XaWR0aChub2RlKTtcbiAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluSGVpZ2h0KG5vZGUpO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2Rlcyhub2RlLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbywgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gICAgfTtcblxuICAvKlxuICAgKiBDaGFuZ2VzIHRoZSBsYWJlbCBvZiB0aGUgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIGxhYmVsLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VOb2RlTGFiZWwgPSBmdW5jdGlvbihub2RlcywgbGFiZWwpIHtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBub2Rlcy5kYXRhKCdsYWJlbCcsIGxhYmVsKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgICBmaXJzdFRpbWU6IHRydWVcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VOb2RlTGFiZWxcIiwgcGFyYW0pO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgLypcbiAgICogQ2hhbmdlIGZvbnQgcHJvcGVydGllcyBmb3IgZ2l2ZW4gbm9kZXMgdXNlIHRoZSBnaXZlbiBmb250IGRhdGEuXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24oZWxlcywgZGF0YSkge1xuICAgIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGVsZXM6IGVsZXMsXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUZvbnRQcm9wZXJ0aWVzXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIGRhdGEpO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgLypcbiAgICogQ2hhbmdlIHN0YXRlIHZhbHVlIG9yIHVuaXQgb2YgaW5mb3JtYXRpb24gYm94IG9mIGdpdmVuIG5vZGVzIHdpdGggZ2l2ZW4gaW5kZXguXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBwYXJhbWV0ZXJzIHNlZSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94XG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSkge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIG5vZGVzOiBub2Rlc1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZVN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8vIEFkZCBhIG5ldyBzdGF0ZSBvciBpbmZvIGJveCB0byBnaXZlbiBub2Rlcy5cbiAgLy8gVGhlIGJveCBpcyByZXByZXNlbnRlZCBieSB0aGUgcGFyYW1ldGVyIG9iai5cbiAgLy8gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgbWFpblV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBvYmopIHtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgb2JqOiBvYmosXG4gICAgICAgIG5vZGVzOiBub2Rlc1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImFkZFN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8vIFJlbW92ZSB0aGUgc3RhdGUgb3IgaW5mbyBib3hlcyBvZiB0aGUgZ2l2ZW4gbm9kZXMgYXQgZ2l2ZW4gaW5kZXguXG4gIC8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gIG1haW5VdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbihub2RlcywgaW5kZXgpIHtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZVN0YXRlT3JJbmZvQm94KG5vZGVzLCB7aW5kZXg6IGluZGV4fSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBsb2NhdGlvbk9iajoge2luZGV4OiBpbmRleH0sXG4gICAgICAgIG5vZGVzOiBub2Rlc1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInJlbW92ZVN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG5cbiAgLy9BcnJhbmdlIGluZm9ybWF0aW9uIGJveGVzXG4gIC8vSWYgZm9yY2UgY2hlY2sgaXMgdHJ1ZSwgaXQgcmVhcnJhbmdlcyBhbGwgaW5mb3JtYXRpb24gYm94ZXNcbiAgbWFpblV0aWxpdGllcy5maXRVbml0cyA9IGZ1bmN0aW9uIChub2RlLCBsb2NhdGlvbnMpIHtcbiAgICBpZiAobm9kZS5kYXRhKCdhdXh1bml0bGF5b3V0cycpID09PSB1bmRlZmluZWQgfHwgbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmxlbmd0aCA8PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChsb2NhdGlvbnMgPT09IHVuZGVmaW5lZCB8fCBsb2NhdGlvbnMubGVuZ3RoIDw9IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuZml0VW5pdHMobm9kZSwgbG9jYXRpb25zKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgIGxvY2F0aW9uczogbG9jYXRpb25zXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiZml0VW5pdHNcIiwgcGFyYW0pO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgLypcbiAgICogU2V0IG11bHRpbWVyIHN0YXR1cyBvZiB0aGUgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbihub2Rlcywgc3RhdHVzKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInNldE11bHRpbWVyU3RhdHVzXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlZHJhdyBjbG9uZSBtYXJrZXJzIG9uIGdpdmVuIG5vZGVzIHdpdGhvdXQgY29uc2lkZXJpbmcgdW5kby5cbiAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvbmV3dC9pc3N1ZXMvNTc0IFxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5yZWRyYXdDbG9uZU1hcmtlcnMgPSBmdW5jdGlvbihub2Rlcykge1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZXMsIHRydWUpO1xuICB9XG5cbiAgLypcbiAgICogU2V0IGNsb25lIG1hcmtlciBzdGF0dXMgb2YgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cbiAgICovXG4gIG1haW5VdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMgPSBmdW5jdGlvbihub2Rlcywgc3RhdHVzKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInNldENsb25lTWFya2VyU3RhdHVzXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgLypcbiAgICogQ2hhbmdlIHN0eWxlL2NzcyBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXG4gICAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VDc3MgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICAgIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MoZWxlcywgbmFtZSwgdmFsdWVNYXApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgZWxlczogZWxlcyxcbiAgICAgICAgdmFsdWVNYXA6IHZhbHVlTWFwLFxuICAgICAgICBuYW1lOiBuYW1lXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlQ3NzXCIsIHBhcmFtKTtcbiAgICB9XG5cbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xuICB9O1xuXG4gIC8qXG4gICAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcbiAgICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xuICAgIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVsZXMsIG5hbWUsIHZhbHVlTWFwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGVsZXM6IGVsZXMsXG4gICAgICAgIHZhbHVlTWFwOiB2YWx1ZU1hcCxcbiAgICAgICAgbmFtZTogbmFtZVxuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZURhdGFcIiwgcGFyYW0pO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgbWFpblV0aWxpdGllcy51cGRhdGVTZXRGaWVsZCA9IGZ1bmN0aW9uKGVsZSwgZmllbGROYW1lLCB0b0RlbGV0ZSwgdG9BZGQsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWxlLCBmaWVsZE5hbWUsIHRvRGVsZXRlLCB0b0FkZCwgY2FsbGJhY2spO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgZWxlLFxuICAgICAgICBmaWVsZE5hbWUsXG4gICAgICAgIHRvRGVsZXRlLFxuICAgICAgICB0b0FkZCxcbiAgICAgICAgY2FsbGJhY2tcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJ1cGRhdGVTZXRGaWVsZFwiLCBwYXJhbSk7XG4gICAgfVxuICB9O1xuXG4gIG1haW5VdGlsaXRpZXMuc2V0RGVmYXVsdFByb3BlcnR5ID0gZnVuY3Rpb24oIF9jbGFzcywgbmFtZSwgdmFsdWUgKSB7XG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcHJvcE1hcCA9IHt9O1xuICAgICAgcHJvcE1hcFsgbmFtZSBdID0gdmFsdWU7XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0RGVmYXVsdFByb3BlcnRpZXMoX2NsYXNzLCBwcm9wTWFwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGNsYXNzOiBfY2xhc3MsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHZhbHVlXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwic2V0RGVmYXVsdFByb3BlcnR5XCIsIHBhcmFtKTtcbiAgICB9XG4gIH07XG5cbiAgbWFpblV0aWxpdGllcy51cGRhdGVJbmZvYm94U3R5bGUgPSBmdW5jdGlvbiggbm9kZSwgaW5kZXgsIG5ld1Byb3BzICkge1xuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVJbmZvYm94U3R5bGUoIG5vZGUsIGluZGV4LCBuZXdQcm9wcyApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBuZXdQcm9wczogbmV3UHJvcHNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJ1cGRhdGVJbmZvYm94U3R5bGVcIiwgcGFyYW0pO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgbWFpblV0aWxpdGllcy51cGRhdGVJbmZvYm94T2JqID0gZnVuY3Rpb24oIG5vZGUsIGluZGV4LCBuZXdQcm9wcyApIHtcbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlSW5mb2JveE9iaiggbm9kZSwgaW5kZXgsIG5ld1Byb3BzICk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIG5ld1Byb3BzOiBuZXdQcm9wc1xuICAgICAgfTtcblxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInVwZGF0ZUluZm9ib3hPYmpcIiwgcGFyYW0pO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH07XG5cbiAgbWFpblV0aWxpdGllcy5kZWxldGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKGVsZXMsIGxheW91dHBhcmFtKSB7XG4gICAgdmFyIG5vZGVzID0gZWxlcy5ub2RlcygpOyAvLyBFbnN1cmUgdGhhdCBub2RlcyBsaXN0IGp1c3QgaW5jbHVkZSBub2Rlc1xuXG4gICAgdmFyIGFsbE5vZGVzID0gY3kubm9kZXMoXCI6dmlzaWJsZVwiKTtcbiAgICB2YXIgbm9kZXNUb0tlZXAgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZFJlbWFpbmluZ05vZGVzKG5vZGVzLCBhbGxOb2Rlcyk7XG4gICAgdmFyIG5vZGVzVG9SZW1vdmUgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb0tlZXApO1xuXG4gICAgaWYgKG5vZGVzVG9SZW1vdmUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcblxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmRlbGV0ZUFuZFBlcmZvcm1MYXlvdXQobm9kZXNUb1JlbW92ZSwgbGF5b3V0cGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICAgICAgZWxlczogbm9kZXNUb1JlbW92ZSxcbiAgICAgICAgICAgIGxheW91dHBhcmFtOiBsYXlvdXRwYXJhbSxcbiAgICAgICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJkZWxldGVBbmRQZXJmb3JtTGF5b3V0XCIsIHBhcmFtKTtcbiAgICB9XG4gIH07XG5cbiAgLypcbiAgICogSGlkZXMgZ2l2ZW4gZWxlcyAodGhlIG9uZXMgd2hpY2ggYXJlIHNlbGVjdGVkKSBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xuICAgKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuIFJlcXVpcmVzIHZpZXdVdGlsaXRpZXMgZXh0ZW5zaW9uIGFuZCBjb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5oaWRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XG4gICAgICB2YXIgbm9kZXMgPSBlbGVzLm5vZGVzKCk7IC8vIEVuc3VyZSB0aGF0IG5vZGVzIGxpc3QganVzdCBpbmNsdWRlIG5vZGVzXG5cbiAgICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIik7XG4gICAgICB2YXIgbm9kZXNUb1Nob3cgPSBlbGVtZW50VXRpbGl0aWVzLmV4dGVuZFJlbWFpbmluZ05vZGVzKG5vZGVzLCBhbGxOb2Rlcyk7XG4gICAgICB2YXIgbm9kZXNUb0hpZGUgPSBhbGxOb2Rlcy5ub3Qobm9kZXNUb1Nob3cpO1xuXG4gICAgICBpZiAobm9kZXNUb0hpZGUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcblxuICAgICAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcbiAgICAgICAgICBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcihub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcik7XG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5oaWRlQW5kUGVyZm9ybUxheW91dChub2Rlc1RvSGlkZSwgbGF5b3V0cGFyYW0pO1xuICAgICAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcbiAgICAgICAgICBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlcihub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgICAgICAgIGVsZXM6IG5vZGVzVG9IaWRlLFxuICAgICAgICAgICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXG4gICAgICAgICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB2YXIgdXIgPSBjeS51bmRvUmVkbygpO1xuICAgICAgICAgIHVyLmFjdGlvbihcInRoaWNrZW5Cb3JkZXJcIiwgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKTtcbiAgICAgICAgICB1ci5hY3Rpb24oXCJ0aGluQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlcik7XG5cbiAgICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygpLmludGVyc2VjdGlvbihub2Rlc1RvSGlkZSk7XG4gICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInRoaW5Cb3JkZXJcIiwgcGFyYW06IG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yfSk7XG4gICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcImhpZGVBbmRQZXJmb3JtTGF5b3V0XCIsIHBhcmFtOiBwYXJhbX0pO1xuICAgICAgICAgIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gbm9kZXNUb0hpZGUubmVpZ2hib3Job29kKFwiOnZpc2libGVcIikubm9kZXMoKS5kaWZmZXJlbmNlKG5vZGVzVG9IaWRlKS5kaWZmZXJlbmNlKGN5Lm5vZGVzKFwiW3RoaWNrQm9yZGVyXVwiKSk7XG4gICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInRoaWNrZW5Cb3JkZXJcIiwgcGFyYW06IG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yfSk7XG4gICAgICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImJhdGNoXCIsIGFjdGlvbnMpO1xuICAgICAgfVxuICB9O1xuXG4gIC8qXG4gICAqIFNob3dzIGFsbCBlbGVtZW50cyAodGhlIG9uZXMgd2hpY2ggYXJlIGhpZGRlbiBpZiBhbnkpIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXG4gICAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLnNob3dBbGxBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24obGF5b3V0cGFyYW0pIHtcbiAgICB2YXIgaGlkZGVuRWxlcyA9IGN5LmVsZW1lbnRzKCc6aGlkZGVuJyk7XG4gICAgaWYgKGhpZGRlbkVsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xuICAgICAgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChoaWRkZW5FbGVzLCBsYXlvdXRwYXJhbSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBlbGVzOiBoaWRkZW5FbGVzLFxuICAgICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZVxuICAgICAgfTtcblxuICAgICAgdmFyIHVyID0gY3kudW5kb1JlZG8oKTtcbiAgICAgIHVyLmFjdGlvbihcInRoaWNrZW5Cb3JkZXJcIiwgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKTtcbiAgICAgIHVyLmFjdGlvbihcInRoaW5Cb3JkZXJcIiwgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyKTtcblxuICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5Lm5vZGVzKFwiW3RoaWNrQm9yZGVyXVwiKTtcbiAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGluQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcn0pO1xuICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInNob3dBbmRQZXJmb3JtTGF5b3V0XCIsIHBhcmFtOiBwYXJhbX0pO1xuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImJhdGNoXCIsIGFjdGlvbnMpO1xuICAgIH1cbiAgfTtcblxuICAvKlxuICAgKiBVbmhpZGUgZ2l2ZW4gZWxlcyAodGhlIG9uZXMgd2hpY2ggYXJlIGhpZGRlbiBpZiBhbnkpIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXG4gICAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXG4gICAqL1xuICBtYWluVXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24obWFpbkVsZSwgZWxlcywgbGF5b3V0cGFyYW0pIHtcbiAgICAgIHZhciBoaWRkZW5FbGVzID0gZWxlcy5maWx0ZXIoJzpoaWRkZW4nKTtcbiAgICAgIGlmIChoaWRkZW5FbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG1haW5VdGlsaXRpZXMuY2xvc2VVcEVsZW1lbnRzKG1haW5FbGUsIGhpZGRlbkVsZXMubm9kZXMoKSk7XG4gICAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XG4gICAgICAgICAgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQoaGlkZGVuRWxlcywgbGF5b3V0cGFyYW0pO1xuICAgICAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcbiAgICAgICAgICBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlcihub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgICAgICAgIGVsZXM6IGhpZGRlbkVsZXMsXG4gICAgICAgICAgICAgIGxheW91dHBhcmFtOiBsYXlvdXRwYXJhbSxcbiAgICAgICAgICAgICAgZmlyc3RUaW1lOiB0cnVlXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHZhciB1ciA9IGN5LnVuZG9SZWRvKCk7XG4gICAgICAgICAgdXIuYWN0aW9uKFwidGhpY2tlbkJvcmRlclwiLCBzYmdudml6SW5zdGFuY2UudGhpY2tlbkJvcmRlciwgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIpO1xuICAgICAgICAgIHVyLmFjdGlvbihcInRoaW5Cb3JkZXJcIiwgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyKTtcblxuICAgICAgICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgICAgICAgdmFyIG5vZGVzVG9UaGluQm9yZGVyID0gKGhpZGRlbkVsZXMubmVpZ2hib3Job29kKFwiOnZpc2libGVcIikubm9kZXMoXCJbdGhpY2tCb3JkZXJdXCIpKVxuICAgICAgICAgICAgICAgICAgLmRpZmZlcmVuY2UoY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcy5lZGdlcygpLnVuaW9uKGhpZGRlbkVsZXMubm9kZXMoKS5jb25uZWN0ZWRFZGdlcygpKSkuY29ubmVjdGVkTm9kZXMoKSk7XG4gICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInRoaW5Cb3JkZXJcIiwgcGFyYW06IG5vZGVzVG9UaGluQm9yZGVyfSk7XG4gICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInNob3dBbmRQZXJmb3JtTGF5b3V0XCIsIHBhcmFtOiBwYXJhbX0pO1xuICAgICAgICAgIHZhciBub2Rlc1RvVGhpY2tlbkJvcmRlciA9IGhpZGRlbkVsZXMubm9kZXMoKS5lZGdlc1dpdGgoY3kubm9kZXMoXCI6aGlkZGVuXCIpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcy5ub2RlcygpKSlcbiAgXHQgICAgICAgICAgICAuY29ubmVjdGVkTm9kZXMoKS5pbnRlcnNlY3Rpb24oaGlkZGVuRWxlcy5ub2RlcygpKTtcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpY2tlbkJvcmRlclwiLCBwYXJhbTogbm9kZXNUb1RoaWNrZW5Cb3JkZXJ9KTtcbiAgICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiYmF0Y2hcIiwgYWN0aW9ucyk7XG4gICAgICB9XG4gIH07XG5cbiAgLypcbiAgKiBUYWtlcyB0aGUgaGlkZGVuIGVsZW1lbnRzIGNsb3NlIHRvIHRoZSBub2RlcyB3aG9zZSBuZWlnaGJvcnMgd2lsbCBiZSBzaG93blxuICAqICovXG4gIG1haW5VdGlsaXRpZXMuY2xvc2VVcEVsZW1lbnRzID0gZnVuY3Rpb24obWFpbkVsZSwgaGlkZGVuRWxlcykge1xuICAgICAgdmFyIGxlZnRYID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAgIHZhciByaWdodFggPSBOdW1iZXIuTUlOX1ZBTFVFO1xuICAgICAgdmFyIHRvcFkgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgdmFyIGJvdHRvbVkgPSBOdW1iZXIuTUlOX1ZBTFVFO1xuICAgICAgLy8gQ2hlY2sgdGhlIHggYW5kIHkgbGltaXRzIG9mIGFsbCBoaWRkZW4gZWxlbWVudHMgYW5kIHN0b3JlIHRoZW0gaW4gdGhlIHZhcmlhYmxlcyBhYm92ZVxuICAgICAgaGlkZGVuRWxlcy5mb3JFYWNoKGZ1bmN0aW9uKCBlbGUgKXtcbiAgICAgICAgICBpZiAoZWxlLmRhdGEoJ2NsYXNzJykgIT0gJ2NvbXBhcnRtZW50JyAmJiAgZWxlLmRhdGEoJ2NsYXNzJykgIT0gJ2NvbXBsZXgnKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdmFyIGhhbGZXaWR0aCA9IGVsZS5vdXRlcldpZHRoKCkvMjtcbiAgICAgICAgICAgICAgdmFyIGhhbGZIZWlnaHQgPSBlbGUub3V0ZXJIZWlnaHQoKS8yO1xuICAgICAgICAgICAgICBpZiAoZWxlLnBvc2l0aW9uKFwieFwiKSAtIGhhbGZXaWR0aCA8IGxlZnRYKVxuICAgICAgICAgICAgICAgICAgbGVmdFggPSBlbGUucG9zaXRpb24oXCJ4XCIpIC0gaGFsZldpZHRoO1xuICAgICAgICAgICAgICBpZiAoZWxlLnBvc2l0aW9uKFwieFwiKSArIGhhbGZXaWR0aCA+IHJpZ2h0WClcbiAgICAgICAgICAgICAgICAgIHJpZ2h0WCA9IGVsZS5wb3NpdGlvbihcInhcIikgKyBoYWxmV2lkdGg7XG4gICAgICAgICAgICAgIGlmIChlbGUucG9zaXRpb24oXCJ5XCIpIC0gaGFsZkhlaWdodCA8IHRvcFkpXG4gICAgICAgICAgICAgICAgICB0b3BZID0gZWxlLnBvc2l0aW9uKFwieVwiKSAtIGhhbGZIZWlnaHQ7XG4gICAgICAgICAgICAgIGlmIChlbGUucG9zaXRpb24oXCJ5XCIpICsgaGFsZkhlaWdodCA+IHRvcFkpXG4gICAgICAgICAgICAgICAgICBib3R0b21ZID0gZWxlLnBvc2l0aW9uKFwieVwiKSArIGhhbGZIZWlnaHQ7XG4gICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vVGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBvbGQgY2VudGVyIGNvbnRhaW5pbmcgdGhlIGhpZGRlbiBub2Rlc1xuICAgICAgdmFyIG9sZENlbnRlclggPSAobGVmdFggKyByaWdodFgpLzI7XG4gICAgICB2YXIgb2xkQ2VudGVyWSA9ICh0b3BZICsgYm90dG9tWSkvMjtcblxuICAgICAgLy9IZXJlIHdlIGNhbGN1bGF0ZSB0d28gcGFyYW1ldGVycyB3aGljaCBkZWZpbmUgdGhlIGFyZWEgaW4gd2hpY2ggdGhlIGhpZGRlbiBlbGVtZW50cyBhcmUgcGxhY2VkIGluaXRpYWxseVxuICAgICAgdmFyIG1pbkhvcml6b250YWxQYXJhbSA9IG1haW5FbGUub3V0ZXJXaWR0aCgpLzIgKyAocmlnaHRYIC0gbGVmdFgpLzI7XG4gICAgICB2YXIgbWF4SG9yaXpvbnRhbFBhcmFtID0gbWFpbkVsZS5vdXRlcldpZHRoKCkgKyAocmlnaHRYIC0gbGVmdFgpLzI7XG4gICAgICB2YXIgbWluVmVydGljYWxQYXJhbSA9IG1haW5FbGUub3V0ZXJIZWlnaHQoKS8yICsgKGJvdHRvbVkgLSB0b3BZKS8yO1xuICAgICAgdmFyIG1heFZlcnRpY2FsUGFyYW0gPSBtYWluRWxlLm91dGVySGVpZ2h0KCkgKyAoYm90dG9tWSAtIHRvcFkpLzI7XG5cbiAgICAgIC8vUXVhZHJhbnRzIGlzIGFuIG9iamVjdCBvZiB0aGUgZm9ybSB7Zmlyc3Q6XCJvYnRhaW5lZFwiLCBzZWNvbmQ6XCJmcmVlXCIsIHRoaXJkOlwiZnJlZVwiLCBmb3VydGg6XCJvYnRhaW5lZFwifVxuICAgICAgLy8gd2hpY2ggaG9sZHMgd2hpY2ggcXVhZHJhbnQgYXJlIGZyZWUgKHRoYXQncyB3aGVyZSBoaWRkZW4gbm9kZXMgd2lsbCBiZSBicm91Z2h0KVxuICAgICAgdmFyIHF1YWRyYW50cyA9IG1haW5VdGlsaXRpZXMuY2hlY2tPY2N1cGllZFF1YWRyYW50cyhtYWluRWxlLCBoaWRkZW5FbGVzKTtcbiAgICAgIHZhciBmcmVlUXVhZHJhbnRzID0gW107XG4gICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBxdWFkcmFudHMpIHtcbiAgICAgICAgICBpZiAocXVhZHJhbnRzW3Byb3BlcnR5XSA9PT0gXCJmcmVlXCIpXG4gICAgICAgICAgICAgIGZyZWVRdWFkcmFudHMucHVzaChwcm9wZXJ0eSk7XG4gICAgICB9XG5cbiAgICAgIC8vQ2FuIHRha2UgdmFsdWVzIDEgYW5kIC0xIGFuZCBhcmUgdXNlZCB0byBwbGFjZSB0aGUgaGlkZGVuIG5vZGVzIGluIHRoZSByYW5kb20gcXVhZHJhbnRcbiAgICAgIHZhciBob3Jpem9udGFsTXVsdDtcbiAgICAgIHZhciB2ZXJ0aWNhbE11bHQ7XG4gICAgICBpZiAoZnJlZVF1YWRyYW50cy5sZW5ndGggPiAwKVxuICAgICAge1xuICAgICAgICBpZiAoZnJlZVF1YWRyYW50cy5sZW5ndGggPT09IDMpXG4gICAgICAgIHtcbiAgICAgICAgICBpZiAoZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnZmlyc3QnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdzZWNvbmQnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCd0aGlyZCcpKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gLTE7XG4gICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAtMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnZmlyc3QnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdzZWNvbmQnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmb3VydGgnKSlcbiAgICAgICAgICB7XG4gICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XG4gICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAtMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnZmlyc3QnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCd0aGlyZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZvdXJ0aCcpKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gMTtcbiAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3NlY29uZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3RoaXJkJykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnZm91cnRoJykpXG4gICAgICAgICAge1xuICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAtMTtcbiAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgIC8vUmFuZG9tbHkgcGlja3Mgb25lIHF1YWRyYW50IGZyb20gdGhlIGZyZWUgcXVhZHJhbnRzXG4gICAgICAgICAgdmFyIHJhbmRvbVF1YWRyYW50ID0gZnJlZVF1YWRyYW50c1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqZnJlZVF1YWRyYW50cy5sZW5ndGgpXTtcblxuICAgICAgICAgIGlmIChyYW5kb21RdWFkcmFudCA9PT0gXCJmaXJzdFwiKSB7XG4gICAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gMTtcbiAgICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gLTE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKHJhbmRvbVF1YWRyYW50ID09PSBcInNlY29uZFwiKSB7XG4gICAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gLTE7XG4gICAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IC0xO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChyYW5kb21RdWFkcmFudCA9PT0gXCJ0aGlyZFwiKSB7XG4gICAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gLTE7XG4gICAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKHJhbmRvbVF1YWRyYW50ID09PSBcImZvdXJ0aFwiKSB7XG4gICAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gMTtcbiAgICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgIHtcbiAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDA7XG4gICAgICAgICAgdmVydGljYWxNdWx0ID0gMDtcbiAgICAgIH1cbiAgICAgIC8vIElmIHRoZSBob3Jpem9udGFsTXVsdCBpcyAwIGl0IG1lYW5zIHRoYXQgbm8gcXVhZHJhbnQgaXMgZnJlZSwgc28gd2UgcmFuZG9tbHkgY2hvb3NlIGEgcXVhZHJhbnRcbiAgICAgIHZhciBob3Jpem9udGFsUGFyYW0gPSBtYWluVXRpbGl0aWVzLmdlbmVyYXRlUmFuZG9tKG1pbkhvcml6b250YWxQYXJhbSxtYXhIb3Jpem9udGFsUGFyYW0saG9yaXpvbnRhbE11bHQpO1xuICAgICAgdmFyIHZlcnRpY2FsUGFyYW0gPSBtYWluVXRpbGl0aWVzLmdlbmVyYXRlUmFuZG9tKG1pblZlcnRpY2FsUGFyYW0sbWF4VmVydGljYWxQYXJhbSx2ZXJ0aWNhbE11bHQpO1xuXG4gICAgICAvL1RoZSBjb29yZGluYXRlcyBvZiB0aGUgY2VudGVyIHdoZXJlIHRoZSBoaWRkZW4gbm9kZXMgd2lsbCBiZSB0cmFuc2ZlcmVkXG4gICAgICB2YXIgbmV3Q2VudGVyWCA9IG1haW5FbGUucG9zaXRpb24oXCJ4XCIpICsgaG9yaXpvbnRhbFBhcmFtO1xuICAgICAgdmFyIG5ld0NlbnRlclkgPSBtYWluRWxlLnBvc2l0aW9uKFwieVwiKSArIHZlcnRpY2FsUGFyYW07XG5cbiAgICAgIHZhciB4ZGlmZiA9IG5ld0NlbnRlclggLSBvbGRDZW50ZXJYO1xuICAgICAgdmFyIHlkaWZmID0gbmV3Q2VudGVyWSAtIG9sZENlbnRlclk7XG5cbiAgICAgIC8vQ2hhbmdlIHRoZSBwb3NpdGlvbiBvZiBoaWRkZW4gZWxlbWVudHNcbiAgICAgIGhpZGRlbkVsZXMuZm9yRWFjaChmdW5jdGlvbiggZWxlICl7XG4gICAgICAgICAgdmFyIG5ld3ggPSBlbGUucG9zaXRpb24oXCJ4XCIpICsgeGRpZmY7XG4gICAgICAgICAgdmFyIG5ld3kgPSBlbGUucG9zaXRpb24oXCJ5XCIpICsgeWRpZmY7XG4gICAgICAgICAgZWxlLnBvc2l0aW9uKFwieFwiLCBuZXd4KTtcbiAgICAgICAgICBlbGUucG9zaXRpb24oXCJ5XCIsbmV3eSk7XG4gICAgICB9KTtcbiAgfTtcblxuICAvKlxuICAgKiBHZW5lcmF0ZXMgYSBudW1iZXIgYmV0d2VlbiAyIG5yIGFuZCBtdWx0aW1wbGllcyBpdCB3aXRoIDEgb3IgLTFcbiAgICogKi9cbiAgbWFpblV0aWxpdGllcy5nZW5lcmF0ZVJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4LCBtdWx0KSB7XG4gICAgICB2YXIgdmFsID0gWy0xLDFdO1xuICAgICAgaWYgKG11bHQgPT09IDApXG4gICAgICAgICAgbXVsdCA9IHZhbFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqdmFsLmxlbmd0aCldO1xuICAgICAgcmV0dXJuIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluKSAqIG11bHQ7XG4gIH07XG5cbiAgLypcbiAgICogVGhpcyBmdW5jdGlvbiBtYWtlcyBzdXJlIHRoYXQgdGhlIHJhbmRvbSBudW1iZXIgbGllcyBpbiBmcmVlIHF1YWRyYW50XG4gICAqICovXG4gIG1haW5VdGlsaXRpZXMuY2hlY2tPY2N1cGllZFF1YWRyYW50cyA9IGZ1bmN0aW9uKG1haW5FbGUsIGhpZGRlbkVsZXMpIHtcbiAgICAgIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSA9PSAnUEQnKVxuICAgICAge1xuICAgICAgICB2YXIgdmlzaWJsZU5laWdoYm9yRWxlcyA9IG1haW5FbGUubmVpZ2hib3Job29kKCkuZGlmZmVyZW5jZShoaWRkZW5FbGVzKS5ub2RlcygpO1xuICAgICAgICB2YXIgdmlzaWJsZU5laWdoYm9yc09mTmVpZ2hib3JzID0gdmlzaWJsZU5laWdoYm9yRWxlcy5uZWlnaGJvcmhvb2QoKS5kaWZmZXJlbmNlKGhpZGRlbkVsZXMpLmRpZmZlcmVuY2UobWFpbkVsZSkubm9kZXMoKTtcbiAgICAgICAgdmFyIHZpc2libGVFbGVzID0gdmlzaWJsZU5laWdoYm9yRWxlcy51bmlvbih2aXNpYmxlTmVpZ2hib3JzT2ZOZWlnaGJvcnMpO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAgICB2YXIgdmlzaWJsZUVsZXMgPSBtYWluRWxlLm5laWdoYm9yaG9vZCgpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcykubm9kZXMoKTtcbiAgICAgIHZhciBvY2N1cGllZFF1YWRyYW50cyA9IHtmaXJzdDpcImZyZWVcIiwgc2Vjb25kOlwiZnJlZVwiLCB0aGlyZDpcImZyZWVcIiwgZm91cnRoOlwiZnJlZVwifTtcblxuICAgICAgdmlzaWJsZUVsZXMuZm9yRWFjaChmdW5jdGlvbiggZWxlICl7XG4gICAgICAgICAgaWYgKGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wYXJ0bWVudCcgJiYgIGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wbGV4JylcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpIDwgbWFpbkVsZS5wb3NpdGlvbihcInhcIikgJiYgZWxlLnBvc2l0aW9uKFwieVwiKSA8IG1haW5FbGUucG9zaXRpb24oXCJ5XCIpKVxuICAgICAgICAgICAgICAgICAgb2NjdXBpZWRRdWFkcmFudHMuc2Vjb25kID0gXCJvY2N1cGllZFwiO1xuICAgICAgICAgICAgICBlbHNlIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpID4gbWFpbkVsZS5wb3NpdGlvbihcInhcIikgJiYgZWxlLnBvc2l0aW9uKFwieVwiKSA8IG1haW5FbGUucG9zaXRpb24oXCJ5XCIpKVxuICAgICAgICAgICAgICAgICAgb2NjdXBpZWRRdWFkcmFudHMuZmlyc3QgPSBcIm9jY3VwaWVkXCI7XG4gICAgICAgICAgICAgIGVsc2UgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgPCBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSAmJiBlbGUucG9zaXRpb24oXCJ5XCIpID4gbWFpbkVsZS5wb3NpdGlvbihcInlcIikpXG4gICAgICAgICAgICAgICAgICBvY2N1cGllZFF1YWRyYW50cy50aGlyZCA9IFwib2NjdXBpZWRcIjtcbiAgICAgICAgICAgICAgZWxzZSBpZiAoZWxlLnBvc2l0aW9uKFwieFwiKSA+IG1haW5FbGUucG9zaXRpb24oXCJ4XCIpICYmIGVsZS5wb3NpdGlvbihcInlcIikgPiBtYWluRWxlLnBvc2l0aW9uKFwieVwiKSlcbiAgICAgICAgICAgICAgICAgIG9jY3VwaWVkUXVhZHJhbnRzLmZvdXJ0aCA9IFwib2NjdXBpZWRcIjtcbiAgICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvY2N1cGllZFF1YWRyYW50cztcbiAgfTtcblxuICAvLyBPdmVycmlkZXMgaGlnaGxpZ2h0UHJvY2Vzc2VzIGZyb20gU0JHTlZJWiAtIGRvIG5vdCBoaWdobGlnaHQgYW55IG5vZGVzIHdoZW4gdGhlIG1hcCB0eXBlIGlzIEFGXG4gIG1haW5VdGlsaXRpZXMuaGlnaGxpZ2h0UHJvY2Vzc2VzID0gZnVuY3Rpb24oX25vZGVzKSB7XG4gICAgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpID09IFwiQUZcIilcbiAgICAgIHJldHVybjtcbiAgICBzYmdudml6SW5zdGFuY2UuaGlnaGxpZ2h0UHJvY2Vzc2VzKF9ub2Rlcyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlc2V0cyBtYXAgdHlwZSB0byB1bmRlZmluZWRcbiAgICovXG4gIG1haW5VdGlsaXRpZXMucmVzZXRNYXBUeXBlID0gZnVuY3Rpb24oKXtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2V0TWFwVHlwZSgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiByZXR1cm4gOiBtYXAgdHlwZVxuICAgKi9cbiAgbWFpblV0aWxpdGllcy5nZXRNYXBUeXBlID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCk7XG4gIH07XG5cbiAgbWFpblV0aWxpdGllcy5hZGRCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbihub2RlcywgYmdPYmosIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpe1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDAgfHwgIWJnT2JqKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYmdPYmpbJ2ZpcnN0VGltZSddID0gdHJ1ZTtcbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBiZ09iajogYmdPYmosXG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgdXBkYXRlSW5mbzogdXBkYXRlSW5mbyxcbiAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlOiBwcm9tcHRJbnZhbGlkSW1hZ2UsXG4gICAgICAgIHZhbGlkYXRlVVJMOiB2YWxpZGF0ZVVSTCxcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRCYWNrZ3JvdW5kSW1hZ2VcIiwgcGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkQmFja2dyb3VuZEltYWdlKG5vZGVzLCBiZ09iaiwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCk7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfVxuXG4gIG1haW5VdGlsaXRpZXMucmVtb3ZlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24obm9kZXMsIGJnT2JqKXtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwIHx8ICFiZ09iaikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGJnT2JqWydmaXJzdFRpbWUnXSA9IHRydWU7XG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcbiAgICAgIHZhciBwYXJhbSA9IHtcbiAgICAgICAgYmdPYmo6IGJnT2JqLFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVCYWNrZ3JvdW5kSW1hZ2VcIiwgcGFyYW0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlQmFja2dyb3VuZEltYWdlKG5vZGVzLCBiZ09iaik7XG4gICAgfVxuXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgfVxuXG4gIG1haW5VdGlsaXRpZXMudXBkYXRlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24obm9kZXMsIGJnT2JqKXtcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwIHx8ICFiZ09iaikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XG4gICAgICB2YXIgcGFyYW0gPSB7XG4gICAgICAgIGJnT2JqOiBiZ09iaixcbiAgICAgICAgbm9kZXM6IG5vZGVzXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwidXBkYXRlQmFja2dyb3VuZEltYWdlXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUJhY2tncm91bmRJbWFnZShub2RlcywgYmdPYmopO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH1cblxuICBtYWluVXRpbGl0aWVzLmNoYW5nZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uKG5vZGVzLCBvbGRJbWcsIG5ld0ltZywgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCl7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCB8fCAhb2xkSW1nIHx8ICFuZXdJbWcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgdmFyIHBhcmFtID0ge1xuICAgICAgICBvbGRJbWc6IG9sZEltZyxcbiAgICAgICAgbmV3SW1nOiBuZXdJbWcsXG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlLFxuICAgICAgICB1cGRhdGVJbmZvOiB1cGRhdGVJbmZvLFxuICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2U6IHByb21wdEludmFsaWRJbWFnZSxcbiAgICAgICAgdmFsaWRhdGVVUkw6IHZhbGlkYXRlVVJMXG4gICAgICB9O1xuXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlQmFja2dyb3VuZEltYWdlXCIsIHBhcmFtKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUJhY2tncm91bmRJbWFnZShub2Rlcywgb2xkSW1nLCBuZXdJbWcsIHRydWUsIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpO1xuICAgIH1cblxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gIH1cblxuICByZXR1cm4gbWFpblV0aWxpdGllcztcbn07XG4iLCIvKlxuICogIEV4dGVuZCBkZWZhdWx0IG9wdGlvbnMgYW5kIGdldCBjdXJyZW50IG9wdGlvbnMgYnkgdXNpbmcgdGhpcyBmaWxlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBkZWZhdWx0cyA9IHtcbiAgICAvLyBUaGUgcGF0aCBvZiBjb3JlIGxpYnJhcnkgaW1hZ2VzIHdoZW4gc2JnbnZpeiBpcyByZXF1aXJlZCBmcm9tIG5wbSBhbmQgdGhlIGluZGV4IGh0bWxcbiAgICAvLyBmaWxlIGFuZCBub2RlX21vZHVsZXMgYXJlIHVuZGVyIHRoZSBzYW1lIGZvbGRlciB0aGVuIHVzaW5nIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGZpbmVcbiAgICBpbWdQYXRoOiAnbm9kZV9tb2R1bGVzL3NiZ252aXovc3JjL2ltZycsXG4gICAgLy8gV2hldGhlciB0byBmaXQgbGFiZWxzIHRvIG5vZGVzXG4gICAgZml0TGFiZWxzVG9Ob2RlczogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgZml0TGFiZWxzVG9JbmZvYm94ZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIC8vIGR5bmFtaWMgbGFiZWwgc2l6ZSBpdCBtYXkgYmUgJ3NtYWxsJywgJ3JlZ3VsYXInLCAnbGFyZ2UnXG4gICAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICdyZWd1bGFyJztcbiAgICB9LFxuICAgIC8vIFdoZXRoZXIgdG8gaW5mZXIgbmVzdGluZyBvbiBsb2FkIFxuICAgIGluZmVyTmVzdGluZ09uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgLy8gcGVyY2VudGFnZSB1c2VkIHRvIGNhbGN1bGF0ZSBjb21wb3VuZCBwYWRkaW5nc1xuICAgIGNvbXBvdW5kUGFkZGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIDEwO1xuICAgIH0sXG4gICAgLy8gVGhlIHNlbGVjdG9yIG9mIHRoZSBjb21wb25lbnQgY29udGFpbmluZyB0aGUgc2JnbiBuZXR3b3JrXG4gICAgbmV0d29ya0NvbnRhaW5lclNlbGVjdG9yOiAnI3NiZ24tbmV0d29yay1jb250YWluZXInLFxuICAgIC8vIFdoZXRoZXIgdGhlIGFjdGlvbnMgYXJlIHVuZG9hYmxlLCByZXF1aXJlcyBjeXRvc2NhcGUtdW5kby1yZWRvIGV4dGVuc2lvblxuICAgIHVuZG9hYmxlOiB0cnVlLFxuICAgIC8vIFdoZXRoZXIgdG8gaGF2ZSB1bmRvYWJsZSBkcmFnIGZlYXR1cmUgaW4gdW5kby9yZWRvIGV4dGVuc2lvbi4gVGhpcyBvcHRpb25zIHdpbGwgYmUgcGFzc2VkIHRvIHVuZG8vcmVkbyBleHRlbnNpb25cbiAgICB1bmRvYWJsZURyYWc6IHRydWVcbiAgfTtcblxuICB2YXIgb3B0aW9uVXRpbGl0aWVzID0gZnVuY3Rpb24gKCkge1xuICB9O1xuXG4gIC8vIEV4dGVuZCB0aGUgZGVmYXVsdHMgb3B0aW9ucyB3aXRoIHRoZSB1c2VyIG9wdGlvbnNcbiAgb3B0aW9uVXRpbGl0aWVzLmV4dGVuZE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgIGZvciAodmFyIHByb3AgaW4gZGVmYXVsdHMpIHtcbiAgICAgIHJlc3VsdFtwcm9wXSA9IGRlZmF1bHRzW3Byb3BdO1xuICAgIH1cblxuICAgIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xuICAgICAgcmVzdWx0W3Byb3BdID0gb3B0aW9uc1twcm9wXTtcbiAgICB9XG5cbiAgICBvcHRpb25VdGlsaXRpZXMub3B0aW9ucyA9IHJlc3VsdDtcblxuICAgIHJldHVybiBvcHRpb25zO1xuICB9O1xuXG4gIG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBvcHRpb25VdGlsaXRpZXMub3B0aW9ucztcbiAgfTtcblxuICByZXR1cm4gb3B0aW9uVXRpbGl0aWVzO1xufTtcbiIsInZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xudmFyICQgPSBsaWJzLmpRdWVyeTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLCBvcHRpb25zLCBjeTtcblxuICB2YXIgcmVnaXN0ZXJVbmRvUmVkb0FjdGlvbnMgPSBmdW5jdGlvbiAocGFyYW0pIHtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcGFyYW0udW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XG4gICAgb3B0aW9ucyA9IHBhcmFtLm9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zKCk7XG4gICAgY3kgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0Q3koKTtcblxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSB1bmRvLXJlZG8gaW5zdGFuY2VcbiAgICB2YXIgdXIgPSBjeS51bmRvUmVkbyh7XG4gICAgICB1bmRvYWJsZURyYWc6IG9wdGlvbnMudW5kb2FibGVEcmFnXG4gICAgfSk7XG5cbiAgICAvLyByZWdpc3RlciBhZGQgcmVtb3ZlIGFjdGlvbnNcbiAgICB1ci5hY3Rpb24oXCJhZGROb2RlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZE5vZGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICAgIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTaW1wbGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xuICAgIHVyLmFjdGlvbihcImFkZEVkZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkRWRnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gICAgdXIuYWN0aW9uKFwiYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICAgIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU21hcnQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcbiAgICB1ci5hY3Rpb24oXCJjcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMpO1xuXG4gICAgLy8gcmVnaXN0ZXIgZ2VuZXJhbCBhY3Rpb25zXG4gICAgdXIuYWN0aW9uKFwicmVzaXplTm9kZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzKTtcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VOb2RlTGFiZWxcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VOb2RlTGFiZWwpO1xuICAgIHVyLmFjdGlvbihcImNoYW5nZURhdGFcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRGF0YSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRGF0YSk7XG4gICAgdXIuYWN0aW9uKFwidXBkYXRlU2V0RmllbGRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlU2V0RmllbGQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZVNldEZpZWxkKTtcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VDc3NcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MpO1xuICAgIHVyLmFjdGlvbihcImNoYW5nZUJlbmRQb2ludHNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmVuZFBvaW50cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmVuZFBvaW50cyk7XG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKTtcbiAgICB1ci5hY3Rpb24oXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb1Nob3dBbmRQZXJmb3JtTGF5b3V0KTtcbiAgICB1ci5hY3Rpb24oXCJoaWRlQW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5oaWRlQW5kUGVyZm9ybUxheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb0hpZGVBbmRQZXJmb3JtTGF5b3V0KTtcbiAgICB1ci5hY3Rpb24oXCJkZWxldGVBbmRQZXJmb3JtTGF5b3V0XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUFuZFBlcmZvcm1MYXlvdXQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9EZWxldGVBbmRQZXJmb3JtTGF5b3V0KTtcbiAgICB1ci5hY3Rpb24oXCJhcHBseVNJRlRvcG9sb2d5R3JvdXBpbmdcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYXBwbHlTSUZUb3BvbG9neUdyb3VwaW5nLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hcHBseVNJRlRvcG9sb2d5R3JvdXBpbmcpO1xuXG4gICAgLy8gcmVnaXN0ZXIgU0JHTiBhY3Rpb25zXG4gICAgdXIuYWN0aW9uKFwiYWRkU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94KTtcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gpO1xuICAgIHVyLmFjdGlvbihcInNldE11bHRpbWVyU3RhdHVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyk7XG4gICAgdXIuYWN0aW9uKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzKTtcbiAgICB1ci5hY3Rpb24oXCJyZW1vdmVTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkU3RhdGVPckluZm9Cb3gpO1xuICAgIHVyLmFjdGlvbihcImZpdFVuaXRzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmZpdFVuaXRzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlVW5pdHMpO1xuICAgIHVyLmFjdGlvbihcImFkZEJhY2tncm91bmRJbWFnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRCYWNrZ3JvdW5kSW1hZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZUJhY2tncm91bmRJbWFnZSk7XG4gICAgdXIuYWN0aW9uKFwicmVtb3ZlQmFja2dyb3VuZEltYWdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZUJhY2tncm91bmRJbWFnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkQmFja2dyb3VuZEltYWdlKTtcbiAgICB1ci5hY3Rpb24oXCJ1cGRhdGVCYWNrZ3JvdW5kSW1hZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlQmFja2dyb3VuZEltYWdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVCYWNrZ3JvdW5kSW1hZ2UpO1xuICAgIHVyLmFjdGlvbihcImNoYW5nZUJhY2tncm91bmRJbWFnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJhY2tncm91bmRJbWFnZSk7XG4gICAgdXIuYWN0aW9uKFwidXBkYXRlSW5mb2JveFN0eWxlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUluZm9ib3hTdHlsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlSW5mb2JveFN0eWxlKTtcbiAgICB1ci5hY3Rpb24oXCJ1cGRhdGVJbmZvYm94T2JqXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUluZm9ib3hPYmosIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUluZm9ib3hPYmopO1xuXG4gICAgLy8gcmVnaXN0ZXIgZWFzeSBjcmVhdGlvbiBhY3Rpb25zXG4gICAgdXIuYWN0aW9uKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgICB1ci5hY3Rpb24oXCJjcmVhdGVBY3RpdmF0aW9uUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlQWN0aXZhdGlvblJlYWN0aW9uLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcbiAgICB1ci5hY3Rpb24oXCJjcmVhdGVNZXRhYm9saWNDYXRhbHl0aWNBY3Rpdml0eVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVNZXRhYm9saWNDYXRhbHl0aWNBY3Rpdml0eSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gICAgdXIuYWN0aW9uKFwiY3JlYXRlTWV0YWJvbGljUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlTWV0YWJvbGljUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICAgIHVyLmFjdGlvbihcImNyZWF0ZVRyYW5zY3JpcHRpb25SZWFjdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUcmFuc2NyaXB0aW9uUmVhY3Rpb24sIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmRlbGV0ZUVsZXNTaW1wbGUpO1xuICAgIHVyLmFjdGlvbihcImNyZWF0ZVRyYW5zbGF0aW9uUmVhY3Rpb25cIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY3JlYXRlVHJhbnNsYXRpb25SZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSk7XG4gICAgdXIuYWN0aW9uKFwic2V0RGVmYXVsdFByb3BlcnR5XCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5KTtcbiAgICB1ci5hY3Rpb24oXCJjb252ZXJ0SW50b1JldmVyc2libGVSZWFjdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jb252ZXJ0SW50b1JldmVyc2libGVSZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY29udmVydEludG9SZXZlcnNpYmxlUmVhY3Rpb24pO1xuXG4gICAgdXIuYWN0aW9uKFwibW92ZUVkZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMubW92ZUVkZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLm1vdmVFZGdlKTtcbiAgICB1ci5hY3Rpb24oXCJmaXhFcnJvclwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5maXhFcnJvcix1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmZpeEVycm9yKTtcbiAgICB1ci5hY3Rpb24oXCJjbG9uZUhpZ2hEZWdyZWVOb2RlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNsb25lSGlnaERlZ3JlZU5vZGUsdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5DbG9uZUhpZ2hEZWdyZWVOb2RlKTtcblxuICAgIHVyLmFjdGlvbihcImNoYW5nZU1hcFR5cGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTWFwVHlwZSx1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VNYXBUeXBlKTtcbiAgICB1ci5hY3Rpb24oXCJzZXRDb21wb3VuZFBhZGRpbmdcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q29tcG91bmRQYWRkaW5nLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDb21wb3VuZFBhZGRpbmcpO1xuXG4gIH07XG5cbiAgcmV0dXJuIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zO1xufTtcbiIsInZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblxuICB2YXIgaW5zdGFuY2U7XG5cbiAgZnVuY3Rpb24gc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzIChvcHRpb25zKSB7XG5cbiAgICBpbnN0YW5jZSA9IGxpYnMuc2JnbnZpeihvcHRpb25zKTtcblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0Q3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5nZXRDeSgpO1xuICB9XG5cbiAgcmV0dXJuIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcztcbn07XG4iLCJ2YXIgaXNFcXVhbCA9IHJlcXVpcmUoJ2xvZGFzaC5pc2VxdWFsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgdmFyIGN5LCBlbGVtZW50VXRpbGl0aWVzO1xuICB2YXIgZ3JvdXBDb21wb3VuZFR5cGUsIG1ldGFFZGdlSWRlbnRpZmllciwgbG9ja0dyYXBoVG9wb2xvZ3ksIHNob3VsZEFwcGx5O1xuXG4gIHZhciBERUZBVUxUX0dST1VQX0NPTVBPVU5EX1RZUEUgPSAndG9wb2xvZ3kgZ3JvdXAnO1xuICB2YXIgRURHRV9TVFlMRV9OQU1FUyA9IFsgJ2xpbmUtY29sb3InLCAnd2lkdGgnIF07XG5cbiAgZnVuY3Rpb24gdG9wb2xvZ3lHcm91cGluZyggcGFyYW0sIHByb3BzICkge1xuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KClcbiAgICBlbGVtZW50VXRpbGl0aWVzID0gcGFyYW0uZWxlbWVudFV0aWxpdGllcztcblxuICAgIGdyb3VwQ29tcG91bmRUeXBlID0gcHJvcHMuZ3JvdXBDb21wb3VuZFR5cGUgfHwgREVGQVVMVF9HUk9VUF9DT01QT1VORF9UWVBFO1xuICAgIG1ldGFFZGdlSWRlbnRpZmllciA9IHByb3BzLm1ldGFFZGdlSWRlbnRpZmllcjtcbiAgICBsb2NrR3JhcGhUb3BvbG9neSA9IHByb3BzLmxvY2tHcmFwaFRvcG9sb2d5O1xuICAgIHNob3VsZEFwcGx5ID0gcHJvcHMuc2hvdWxkQXBwbHkgfHwgdHJ1ZTtcblxuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9IGZhbHNlO1xuICAgIGluaXRNZXRhU3R5bGVNYXAoKTtcbiAgfVxuXG4gIHRvcG9sb2d5R3JvdXBpbmcuYXBwbHkgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCB8fCAhZXZhbE9wdCggc2hvdWxkQXBwbHkgKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbGlzdCA9IGN5Lm5vZGVzKCkubWFwKCBmdW5jdGlvbiggbm9kZSApIHtcbiAgICAgIHJldHVybiBbIG5vZGUgXTtcbiAgICB9ICk7XG5cbiAgICAvLyBkZXRlcm1pbmUgbm9kZSBncm91cHMgYnkgdGhlaXIgdG9wb2xvZ3lcbiAgICB2YXIgZ3JvdXBzID0gZ2V0Tm9kZUdyb3VwcyggbGlzdCApO1xuICAgIFxuICAgIC8vIGFwcGx5IGdyb3VwaW5nIGluIGN5IGxldmVsXG4gICAgdmFyIG1ldGFFZGdlcyA9IHRvcG9sb2d5R3JvdXBpbmcuZ2V0TWV0YUVkZ2VzKCk7XG4gICAgdmFyIGNvbXBvdW5kcyA9IHRvcG9sb2d5R3JvdXBpbmcuZ2V0R3JvdXBDb21wb3VuZHMoKTtcbiAgXHRhcHBseUdyb3VwaW5nKGdyb3VwcywgbWV0YUVkZ2VzLCBjb21wb3VuZHMpO1xuXG4gICAgdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkID0gdHJ1ZTtcblxuICAgIGlmICggbG9ja0dyYXBoVG9wb2xvZ3kgKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmxvY2tHcmFwaFRvcG9sb2d5KCk7XG4gICAgfVxuXG4gIFx0cmV0dXJuIGdyb3VwcztcbiAgfTtcblxuICB0b3BvbG9neUdyb3VwaW5nLnVuYXBwbHkgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoICF0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG1ldGFFZGdlcyA9IHRvcG9sb2d5R3JvdXBpbmcuZ2V0TWV0YUVkZ2VzKCk7XG4gICAgbWV0YUVkZ2VzLmZvckVhY2goIGZ1bmN0aW9uKCBlZGdlICkge1xuICAgICAgdmFyIHRvUmVzdG9yZSA9IGVkZ2UuZGF0YSgndGctdG8tcmVzdG9yZScpO1xuICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgIHRvUmVzdG9yZS5yZXN0b3JlKCk7XG5cbiAgICAgIEVER0VfU1RZTEVfTkFNRVMuZm9yRWFjaCggZnVuY3Rpb24oIG5hbWUgKSB7XG4gICAgICAgIHZhciBvbGRWYWwgPSB0b3BvbG9neUdyb3VwaW5nLm1ldGFTdHlsZU1hcFsgbmFtZSBdWyBlZGdlLmlkKCkgXTtcbiAgICAgICAgdmFyIG5ld1ZhbCA9IGVkZ2UuZGF0YSggbmFtZSApO1xuXG4gICAgICAgIGlmICggb2xkVmFsICE9PSBuZXdWYWwgKSB7XG4gICAgICAgICAgdG9SZXN0b3JlLmRhdGEoIG5hbWUsIG5ld1ZhbCApO1xuICAgICAgICB9XG4gICAgICB9ICk7XG4gICAgfSApO1xuXG4gICAgaW5pdE1ldGFTdHlsZU1hcCgpO1xuXG4gICAgdmFyIHBhcmVudHMgPSB0b3BvbG9neUdyb3VwaW5nLmdldEdyb3VwQ29tcG91bmRzKCk7XG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQoIHBhcmVudHMuY2hpbGRyZW4oKSwgbnVsbCApO1xuICAgIHBhcmVudHMucmVtb3ZlKCk7XG5cbiAgICB0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgPSBmYWxzZTtcblxuICAgIGlmICggbG9ja0dyYXBoVG9wb2xvZ3kgKSB7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnVubG9ja0dyYXBoVG9wb2xvZ3koKTtcbiAgICB9XG4gIH07XG5cbiAgdG9wb2xvZ3lHcm91cGluZy5nZXRNZXRhRWRnZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWV0YUVkZ2VzID0gY3kuZWRnZXMoJ1snICsgbWV0YUVkZ2VJZGVudGlmaWVyICsgJ10nKTtcbiAgICByZXR1cm4gbWV0YUVkZ2VzO1xuICB9O1xuXG4gIHRvcG9sb2d5R3JvdXBpbmcuZ2V0R3JvdXBDb21wb3VuZHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2xhc3NOYW1lID0gZ3JvdXBDb21wb3VuZFR5cGU7XG4gICAgcmV0dXJuIGN5Lm5vZGVzKCdbY2xhc3M9XCInICsgY2xhc3NOYW1lICsgJ1wiXScpO1xuICB9O1xuXG4gIHRvcG9sb2d5R3JvdXBpbmcuY2xlYXJBcHBsaWVkRmxhZyA9IGZ1bmN0aW9uKCkge1xuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9IGZhbHNlO1xuICB9O1xuXG4gIHRvcG9sb2d5R3JvdXBpbmcuc2V0QXBwbGllZEZsYWcgPSBmdW5jdGlvbihhcHBsaWVkKSB7XG4gICAgdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkID0gYXBwbGllZDtcbiAgfTtcblxuICB0b3BvbG9neUdyb3VwaW5nLnRvZ2dsZUFwcGxpZWRGbGFnID0gZnVuY3Rpb24oKSB7XG4gICAgdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkID0gIXRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZDtcbiAgfTtcblxuICBmdW5jdGlvbiBpbml0TWV0YVN0eWxlTWFwKCkge1xuICAgIHRvcG9sb2d5R3JvdXBpbmcubWV0YVN0eWxlTWFwID0ge307XG4gICAgRURHRV9TVFlMRV9OQU1FUy5mb3JFYWNoKCBmdW5jdGlvbiggbmFtZSApIHtcbiAgICAgIHRvcG9sb2d5R3JvdXBpbmcubWV0YVN0eWxlTWFwWyBuYW1lIF0gPSB7fTtcbiAgICB9ICk7XG4gIH1cblxuICBmdW5jdGlvbiBldmFsT3B0KCBvcHQgKSB7XG4gICAgaWYgKCB0eXBlb2Ygb3B0ID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgcmV0dXJuIG9wdCgpO1xuICAgIH1cblxuICAgIHJldHVybiBvcHQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXROb2RlR3JvdXBzKCBsaXN0ICkge1xuICAgIGlmICggbGlzdC5sZW5ndGggPD0gMSApIHtcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIHZhciBoYWx2ZXMgPSBnZXRIYWx2ZXMoIGxpc3QgKTtcbiAgICB2YXIgZmlyc3RQYXJ0ID0gZ2V0Tm9kZUdyb3VwcyggaGFsdmVzWyAwIF0gKTtcbiAgICB2YXIgc2Vjb25kUGFydCA9IGdldE5vZGVHcm91cHMoIGhhbHZlc1sgMSBdICk7XG4gICAgLy8gbWVyZ2UgdGhlIGhhbHZlc1xuXHQgIHZhciBncm91cHMgPSBtZXJnZUdyb3VwcyggZmlyc3RQYXJ0LCBzZWNvbmRQYXJ0ICk7XG5cbiAgICByZXR1cm4gZ3JvdXBzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGFyZW50T3JTZWxmKCBub2RlICkge1xuICAgIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudCgpO1xuICAgIHJldHVybiBwYXJlbnQuc2l6ZSgpID4gMCA/IHBhcmVudCA6IG5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBjYWxjR3JvdXBpbmdLZXkoIGVkZ2UgKSB7XG4gICAgdmFyIHNyY0lkID0gZ2V0UGFyZW50T3JTZWxmKCBlZGdlLnNvdXJjZSgpICkuaWQoKTtcbiAgICB2YXIgdGd0SWQgPSBnZXRQYXJlbnRPclNlbGYoIGVkZ2UudGFyZ2V0KCkgKS5pZCgpO1xuICAgIHZhciBlZGdlVHlwZSA9IGdldEVkZ2VUeXBlKCBlZGdlICk7XG5cbiAgICByZXR1cm4gWyBlZGdlVHlwZSwgc3JjSWQsIHRndElkIF0uam9pbiggJy0nICk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRUb01hcENoYWluKCBtYXAsIGtleSwgdmFsICkge1xuICAgIGlmICggIW1hcFsga2V5IF0gKSB7XG4gICAgICBtYXBbIGtleSBdID0gY3kuY29sbGVjdGlvbigpO1xuICAgIH1cblxuICAgIG1hcFsga2V5IF0gPSBtYXBbIGtleSBdLmFkZCggdmFsICk7XG4gIH1cblxuICBmdW5jdGlvbiBhcHBseUdyb3VwaW5nKGdyb3VwcywgbWV0YUVkZ2VzLCBncm91cENvbXBvdW5kcykge1xuICAgIHZhciBjb21wb3VuZHM7XG5cbiAgICBpZiAoZ3JvdXBDb21wb3VuZHMubGVuZ3RoID4gMCkge1xuICAgICAgY29tcG91bmRzID0gZ3JvdXBDb21wb3VuZHM7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZ3JvdXBzLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cCApIHtcbiAgICAgICAgY3JlYXRlR3JvdXBDb21wb3VuZCggZ3JvdXAgKTtcbiAgICAgIH0gKTtcbiAgXG4gICAgICBjb21wb3VuZHMgPSB0b3BvbG9neUdyb3VwaW5nLmdldEdyb3VwQ29tcG91bmRzKCk7XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkcmVuRWRnZXMgPSBjb21wb3VuZHMuY2hpbGRyZW4oKS5jb25uZWN0ZWRFZGdlcygpO1xuICAgIHZhciBlZGdlc01hcCA9IFtdO1xuXG4gICAgY2hpbGRyZW5FZGdlcy5mb3JFYWNoKCBmdW5jdGlvbiggZWRnZSApe1xuICAgICAgdmFyIGtleSA9IGNhbGNHcm91cGluZ0tleSggZWRnZSApO1xuICAgICAgYWRkVG9NYXBDaGFpbiggZWRnZXNNYXAsIGtleSwgZWRnZSApO1xuICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICB9ICk7XG5cbiAgICBpZiAobWV0YUVkZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIE9iamVjdC5rZXlzKCBlZGdlc01hcCApLmZvckVhY2goIGZ1bmN0aW9uKCBrZXkgKSB7XG4gICAgICAgIHZhciBlZGdlcyA9IGVkZ2VzTWFwW2tleV07XG4gICAgICAgIHZhciB0ZW1wID0gZWRnZXNbMF07XG4gICAgICAgIHZhciBtZXRhRWRnZSA9IG1ldGFFZGdlcy5maWx0ZXIoZWRnZSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGVkZ2Uuc291cmNlKCkuaWQoKSA9PT0gZ2V0UGFyZW50T3JTZWxmKCB0ZW1wLnNvdXJjZSgpICkuaWQoKSAmJlxuICAgICAgICAgICAgICAgICAgZWRnZS50YXJnZXQoKS5pZCgpID09PSBnZXRQYXJlbnRPclNlbGYoIHRlbXAudGFyZ2V0KCkgKS5pZCgpO1xuICAgICAgICB9KVswXTtcbiAgICAgICAgbWV0YUVkZ2UuZGF0YSggJ3RnLXRvLXJlc3RvcmUnLCBlZGdlcyApO1xuICAgICAgICBlZGdlcy5yZW1vdmUoKTtcbiAgICAgIH0gKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBPYmplY3Qua2V5cyggZWRnZXNNYXAgKS5mb3JFYWNoKCBmdW5jdGlvbigga2V5ICkge1xuICAgICAgICBjcmVhdGVNZXRhRWRnZUZvciggZWRnZXNNYXBbIGtleSBdICk7XG4gICAgICB9ICk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlR3JvdXBDb21wb3VuZCggZ3JvdXAgKSB7XG4gICAgaWYgKCBncm91cC5sZW5ndGggPCAyICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBjb2xsZWN0aW9uID0gY3kuY29sbGVjdGlvbigpO1xuXG4gICAgZ3JvdXAuZm9yRWFjaCggZnVuY3Rpb24oIG5vZGUgKSB7XG4gICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbi5hZGQoIG5vZGUgKTtcbiAgICB9ICk7XG5cbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyggY29sbGVjdGlvbiwgZ3JvdXBDb21wb3VuZFR5cGUgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU1ldGFFZGdlRm9yKCBlZGdlcyApIHtcbiAgICB2YXIgc3JjSWQgPSBnZXRQYXJlbnRPclNlbGYoIGVkZ2VzLnNvdXJjZSgpICkuaWQoKTtcbiAgICB2YXIgdGd0SWQgPSBnZXRQYXJlbnRPclNlbGYoIGVkZ2VzLnRhcmdldCgpICkuaWQoKTtcbiAgICB2YXIgdHlwZSA9IGVkZ2VzLmRhdGEoICdjbGFzcycgKTtcbiAgICBjeS5yZW1vdmUoIGVkZ2VzICk7XG5cbiAgICB2YXIgbWV0YUVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UoIHNyY0lkLCB0Z3RJZCwgdHlwZSApO1xuICAgIG1ldGFFZGdlLmRhdGEoICd0Zy10by1yZXN0b3JlJywgZWRnZXMgKTtcbiAgICBtZXRhRWRnZS5kYXRhKCBtZXRhRWRnZUlkZW50aWZpZXIsIHRydWUgKTtcblxuICAgIEVER0VfU1RZTEVfTkFNRVMuZm9yRWFjaCggZnVuY3Rpb24oIHN0eWxlTmFtZSApIHtcbiAgICAgIGVkZ2VzLmZvckVhY2goIGZ1bmN0aW9uKCBlZGdlICkge1xuICAgICAgICB0b3BvbG9neUdyb3VwaW5nLm1ldGFTdHlsZU1hcFsgc3R5bGVOYW1lIF1bIGVkZ2UuaWQoKSBdID0gZWRnZS5kYXRhKCBzdHlsZU5hbWUgKTtcbiAgICAgIH0gKTtcblxuICAgICAgdmFyIGNvbW1vblZhbCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0Q29tbW9uUHJvcGVydHkoZWRnZXMsIHN0eWxlTmFtZSwgJ2RhdGEnKTtcbiAgICAgIGlmICggY29tbW9uVmFsICkge1xuICAgICAgICBtZXRhRWRnZS5kYXRhKCBzdHlsZU5hbWUsIGNvbW1vblZhbCApO1xuICAgICAgfVxuICAgIH0gKTtcblxuICAgIHJldHVybiBtZXRhRWRnZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlR3JvdXBzKCBncm91cHMxLCBncm91cHMyICkge1xuICAgIC8vIG5vdE1lcmdlZEdycyB3aWxsIGluY2x1ZGUgbWVtYmVycyBvZiBncm91cHMxIHRoYXQgYXJlIG5vdCBtZXJnZWRcbiAgXHQvLyBtZXJnZWRHcnMgd2lsbCBpbmNsdWRlIHRoZSBtZXJnZWQgbWVtYmVycyBmcm9tIDIgZ3JvdXBzXG4gIFx0dmFyIG5vdE1lcmdlZEdycyA9IFtdLCBtZXJnZWRHcnMgPSBbXTtcblxuICAgIGdyb3VwczEuZm9yRWFjaCggZnVuY3Rpb24oIGdyMSApIHtcbiAgICAgIHZhciBtZXJnZWQgPSBmYWxzZTtcblxuICAgICAgbWVyZ2VkR3JzLmNvbmNhdCggZ3JvdXBzMiApLmZvckVhY2goIGZ1bmN0aW9uKCBncjIsIGluZGV4MiApIHtcbiAgICAgICAgLy8gaWYgZ3JvdXBzIHNob3VsZCBiZSBtZXJnZWQgbWVyZ2UgdGhlbSwgcmVtb3ZlIGdyMiBmcm9tIHdoZXJlIGl0XG4gICAgICAgIC8vIGNvbWVzIGZyb20gYW5kIHB1c2ggdGhlIG1lcmdlIHJlc3VsdCB0byBtZXJnZWRHcnNcbiAgICAgICAgaWYgKCBzaG91bGRNZXJnZSggZ3IxLCBncjIgKSApIHtcbiAgICAgICAgICB2YXIgbWVyZ2VkR3IgPSBncjEuY29uY2F0KCBncjIgKTtcblxuICAgICAgICAgIGlmICggaW5kZXgyID49IG1lcmdlZEdycy5sZW5ndGggKSB7XG4gICAgICAgICAgICByZW1vdmVBdCggZ3JvdXBzMiwgaW5kZXgyIC0gbWVyZ2VkR3JzLmxlbmd0aCApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlbW92ZUF0KCBtZXJnZWRHcnMsIGluZGV4MiApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIG1hcmsgYXMgbWVyZ2VkIGFuZCBicmVhayB0aGUgbG9vcFxuICAgICAgICAgIG1lcmdlZEdycy5wdXNoKCBtZXJnZWRHciApO1xuICAgICAgICAgIG1lcmdlZCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9ICk7XG5cbiAgICAgIC8vIGlmIGdyMSBpcyBub3QgbWVyZ2VkIHB1c2ggaXQgdG8gbm90TWVyZ2VkR3JzXG4gICAgICBpZiAoICFtZXJnZWQgKSB7XG4gICAgICAgIG5vdE1lcmdlZEdycy5wdXNoKCBncjEgKTtcbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAvLyB0aGUgZ3JvdXBzIHRoYXQgY29tZXMgZnJvbSBncm91cHMyIGJ1dCBub3QgbWVyZ2VkIGFyZSBzdGlsbCBpbmNsdWRlZFxuXHQgIC8vIGluIGdyb3VwczIgYWRkIHRoZW0gdG8gdGhlIHJlc3VsdCB0b2dldGhlciB3aXRoIG1lcmdlZEdycyBhbmQgbm90TWVyZ2VkR3JzXG4gICAgcmV0dXJuIG5vdE1lcmdlZEdycy5jb25jYXQoIG1lcmdlZEdycywgZ3JvdXBzMiApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkTWVyZ2UoIGdyb3VwMSwgZ3JvdXAyICkge1xuICAgIC8vIHVzaW5nIGZpcnN0IGVsZW1lbnRzIGlzIGVub3VnaCB0byBkZWNpZGUgd2hldGhlciB0byBtZXJnZVxuICBcdHZhciBub2RlMSA9IGdyb3VwMVsgMCBdO1xuICBcdHZhciBub2RlMiA9IGdyb3VwMlsgMCBdO1xuXG4gICAgaWYgKCBub2RlMS5lZGdlcygpLmxlbmd0aCAhPT0gbm9kZTIuZWRnZXMoKS5sZW5ndGggKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGdldFVuZGlyZWN0ZWRFZGdlcyA9IGZ1bmN0aW9uKCBub2RlICkge1xuICAgICAgdmFyIGVkZ2VzID0gbm9kZS5jb25uZWN0ZWRFZGdlcygpLmZpbHRlciggaXNVbmRpcmVjdGVkRWRnZSApO1xuICAgICAgcmV0dXJuIGVkZ2VzO1xuICAgIH07XG4gICAgLy8gdW5kaXJlY3RlZCBlZGdlcyBvZiBub2RlMSBhbmQgbm9kZTIgcmVzcGVjdGl2ZWx5XG4gICAgdmFyIHVuZGlyMSA9IGdldFVuZGlyZWN0ZWRFZGdlcyggbm9kZTEgKTtcbiAgICB2YXIgdW5kaXIyID0gZ2V0VW5kaXJlY3RlZEVkZ2VzKCBub2RlMiApO1xuXG4gICAgdmFyIGluMSA9IG5vZGUxLmluY29tZXJzKCkuZWRnZXMoKS5ub3QoIHVuZGlyMSApO1xuICAgIHZhciBpbjIgPSBub2RlMi5pbmNvbWVycygpLmVkZ2VzKCkubm90KCB1bmRpcjIgKTtcblxuICAgIHZhciBvdXQxID0gbm9kZTEub3V0Z29lcnMoKS5lZGdlcygpLm5vdCggdW5kaXIxICk7XG5cdCAgdmFyIG91dDIgPSBub2RlMi5vdXRnb2VycygpLmVkZ2VzKCkubm90KCB1bmRpcjIgKTtcblxuICAgIHJldHVybiBjb21wYXJlRWRnZUdyb3VwKCBpbjEsIGluMiwgbm9kZTEsIG5vZGUyIClcbiAgICAgICAgICAgICYmIGNvbXBhcmVFZGdlR3JvdXAoIG91dDEsIG91dDIsIG5vZGUxLCBub2RlMiApXG4gICAgICAgICAgICAmJiBjb21wYXJlRWRnZUdyb3VwKCB1bmRpcjEsIHVuZGlyMiwgbm9kZTEsIG5vZGUyICk7XG4gIH1cblxuICAvLyBkZWNpZGUgaWYgMiBlZGdlIGdyb3VwcyBjb250YWlucyBzZXQgb2YgZWRnZXMgd2l0aCBzaW1pbGFyIGNvbnRlbnQgKHR5cGUsXG4gIC8vIHNvdXJjZSx0YXJnZXQpIHJlbGF0aXZlIHRvIHRoZWlyIG5vZGVzIHdoZXJlIGdyMSBhcmUgZWRnZXMgb2Ygbm9kZTEgYW5kIGdyMiBhcmUgZWRnZXMgb2ZcbiAgLy8gbm9kZTJcbiAgZnVuY3Rpb24gY29tcGFyZUVkZ2VHcm91cCggZ3IxLCBncjIsIG5vZGUxLCBub2RlMiApIHtcbiAgICB2YXIgaWQxID0gbm9kZTEuaWQoKTtcbiAgICB2YXIgaWQyID0gbm9kZTIuaWQoKTtcblxuICAgIHZhciBtYXAxID0gZmlsbElkVG9UeXBlU2V0TWFwKCBncjEsIG5vZGUxICk7XG4gICAgdmFyIG1hcDIgPSBmaWxsSWRUb1R5cGVTZXRNYXAoIGdyMiwgbm9kZTIgKTtcblxuICAgIGlmICggT2JqZWN0LmtleXMoIG1hcDEgKS5sZW5ndGggIT09IE9iamVjdC5rZXlzKCBtYXAyICkubGVuZ3RoICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBmYWlsZWQgPSBmYWxzZTtcblxuICAgIE9iamVjdC5rZXlzKCBtYXAxICkuZm9yRWFjaCggZnVuY3Rpb24oIGtleSApIHtcbiAgICAgIC8vIGlmIGFscmVhZHkgZmFpbGVkIGp1c3QgcmV0dXJuXG4gICAgICBpZiAoIGZhaWxlZCApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiBrZXkgaXMgaWQyIHVzZSBpZDEgaW5zdGVhZCBiZWNhdXNlIGNvbXBhcmlzb24gaXMgcmVsYXRpdmUgdG8gbm9kZXNcbiAgICAgIHZhciBvdGhlcktleSA9ICgga2V5ID09IGlkMiApID8gaWQxIDoga2V5O1xuXG4gICAgICAvLyBjaGVjayBpZiB0aGUgc2V0cyBoYXZlIHRoZSBzYW1lIGNvbnRlbnRcbiAgXHRcdC8vIGlmIGNoZWNrIGZhaWxzIHJldHVybiBmYWxzZVxuICAgICAgaWYgKCAhaXNFcXVhbCggbWFwMVsga2V5IF0sIG1hcDJbIG90aGVyS2V5IF0gKSApIHtcbiAgICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9ICk7XG5cbiAgICAvLyBpZiBjaGVjayBwYXNzZXMgZm9yIGVhY2gga2V5IHJldHVybiB0cnVlXG4gICAgcmV0dXJuICFmYWlsZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBmaWxsSWRUb1R5cGVTZXRNYXAoIGVkZ2VHcm91cCwgbm9kZSApIHtcbiAgICB2YXIgbWFwID0ge307XG4gICAgdmFyIG5vZGVJZCA9IG5vZGUuaWQoKTtcblxuICAgIGVkZ2VHcm91cC5mb3JFYWNoKCBmdW5jdGlvbiggZWRnZSApIHtcbiAgICAgIHZhciBzcmNJZCA9IGVkZ2UuZGF0YSgnc291cmNlJyk7XG4gICAgICB2YXIgdGd0SWQgPSBlZGdlLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgdmFyIGVkZ2VJZCA9IGVkZ2UuaWQoKTtcblxuICAgICAgdmFyIG90aGVyRW5kID0gKCBub2RlSWQgPT09IHRndElkICkgPyBzcmNJZCA6IHRndElkO1xuXG4gICAgICBmdW5jdGlvbiBhZGRUb1JlbGF0ZWRTZXQoIHNpZGVTdHIsIHZhbHVlICkge1xuICAgICAgICBpZiAoICFtYXBbIHNpZGVTdHIgXSApIHtcbiAgICAgICAgICBtYXBbIHNpZGVTdHIgXSA9IG5ldyBTZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hcFsgc2lkZVN0ciBdLmFkZCggdmFsdWUgKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGVkZ2VUeXBlID0gZ2V0RWRnZVR5cGUoIGVkZ2UgKTtcblxuICAgICAgYWRkVG9SZWxhdGVkU2V0KCBvdGhlckVuZCwgZWRnZVR5cGUgKTtcbiAgICB9ICk7XG5cbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RWRnZVR5cGUoIGVkZ2UgKSB7XG4gICAgcmV0dXJuIGVkZ2UuZGF0YSggJ2NsYXNzJyApO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNVbmRpcmVjdGVkRWRnZSggZWRnZSApIHtcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5pc1VuZGlyZWN0ZWRFZGdlKCBlZGdlICk7XG4gIH1cblxuICAvLyBnZXQgaGFsdmVzIG9mIGEgbGlzdC4gSXQgaXMgYXNzdW1lZCB0aGF0IGxpc3Qgc2l6ZSBpcyBhdCBsZWFzdCAyLlxuICBmdW5jdGlvbiBnZXRIYWx2ZXMoIGxpc3QgKSB7XG4gICAgdmFyIHMgPSBsaXN0Lmxlbmd0aDtcbiAgICB2YXIgaGFsZkluZGV4ID0gTWF0aC5mbG9vciggcyAvIDIgKTtcbiAgICB2YXIgZmlyc3RIYWxmID0gbGlzdC5zbGljZSggMCwgaGFsZkluZGV4ICk7XG4gICAgdmFyIHNlY29uZEhhbGYgPSBsaXN0LnNsaWNlKCBoYWxmSW5kZXgsIHMgKTtcblxuICAgIHJldHVybiBbIGZpcnN0SGFsZiwgc2Vjb25kSGFsZiBdO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQXQoIGFyciwgaW5kZXggKSB7XG4gICAgYXJyLnNwbGljZSggaW5kZXgsIDEgKTtcbiAgfVxuXG4gIHJldHVybiB0b3BvbG9neUdyb3VwaW5nO1xufTtcbiIsIi8vIEV4dGVuZHMgc2JnbnZpei51bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc1xudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBzYmdudml6SW5zdGFuY2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLCBlbGVtZW50VXRpbGl0aWVzLCBjeSwgdG9wb2xvZ3lHcm91cGluZztcblxuICBmdW5jdGlvbiB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc0V4dGVuZGVyIChwYXJhbSkge1xuXG4gICAgc2JnbnZpekluc3RhbmNlID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEluc3RhbmNlKCk7XG4gICAgY3kgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0Q3koKTtcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHNiZ252aXpJbnN0YW5jZS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcbiAgICBlbGVtZW50VXRpbGl0aWVzID0gcGFyYW0uZWxlbWVudFV0aWxpdGllcztcbiAgICB0b3BvbG9neUdyb3VwaW5nID0gcGFyYW0uc2lmVG9wb2xvZ3lHcm91cGluZztcblxuICAgIGV4dGVuZCgpO1xuICB9XG5cbiAgLy8gRXh0ZW5kcyB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyB3aXRoIGNoaXNlIHNwZWNpZmljIGZlYXR1cmVzXG4gIGZ1bmN0aW9uIGV4dGVuZCAoKSB7XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hcHBseVNJRlRvcG9sb2d5R3JvdXBpbmcgPSBmdW5jdGlvbihwYXJhbSkge1xuICAgICAgdmFyIG9sZEVsZXMsIG5ld0VsZXM7XG4gICAgICBpZiAoIHBhcmFtLmZpcnN0VGltZSApIHtcbiAgICAgICAgb2xkRWxlcyA9IGN5LmVsZW1lbnRzKCk7XG5cbiAgICAgICAgaWYgKHBhcmFtLmFwcGx5KSB7XG4gICAgICAgICAgdG9wb2xvZ3lHcm91cGluZy5hcHBseSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRvcG9sb2d5R3JvdXBpbmcudW5hcHBseSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3RWxlcyA9IGN5LmVsZW1lbnRzKCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgb2xkRWxlcyA9IHBhcmFtLm9sZEVsZXM7XG4gICAgICAgIG5ld0VsZXMgPSBwYXJhbS5uZXdFbGVzO1xuXG4gICAgICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnVubG9ja0dyYXBoVG9wb2xvZ3koKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmxvY2tHcmFwaFRvcG9sb2d5KCk7XG4gICAgICAgIH1cblxuICAgICAgICBvbGRFbGVzLnJlbW92ZSgpO1xuICAgICAgICBuZXdFbGVzLnJlc3RvcmUoKTtcblxuICAgICAgICB0b3BvbG9neUdyb3VwaW5nLnRvZ2dsZUFwcGxpZWRGbGFnKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXN1bHQgPSB7IG9sZEVsZXM6IG5ld0VsZXMsIG5ld0VsZXM6IG9sZEVsZXMgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8vIFNlY3Rpb24gU3RhcnRcbiAgICAvLyBhZGQvcmVtb3ZlIGFjdGlvbiBmdW5jdGlvbnNcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZE5vZGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICAgIHZhciBuZXdOb2RlID0gcGFyYW0ubmV3Tm9kZTtcbiAgICAgICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5ld05vZGUueCwgbmV3Tm9kZS55LCBuZXdOb2RlLmNsYXNzLCBuZXdOb2RlLmlkLCBuZXdOb2RlLnBhcmVudCwgbmV3Tm9kZS52aXNpYmlsaXR5KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKHBhcmFtKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZWxlczogcmVzdWx0XG4gICAgICB9O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRFZGdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICB2YXIgbmV3RWRnZSA9IHBhcmFtLm5ld0VkZ2U7XG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdFZGdlLnNvdXJjZSwgbmV3RWRnZS50YXJnZXQsIG5ld0VkZ2UuY2xhc3MsIG5ld0VkZ2UuaWQsIG5ld0VkZ2UudmlzaWJpbGl0eSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IHJlc3VsdFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMgPSBmdW5jdGlvbihwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyhwYXJhbS5zb3VyY2UsIHBhcmFtLnRhcmdldCwgcGFyYW0ucHJvY2Vzc1R5cGUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiByZXN1bHRcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICAgIC8vIE5vZGVzIHRvIG1ha2UgY29tcG91bmQsIHRoZWlyIGRlc2NlbmRhbnRzIGFuZCBlZGdlcyBjb25uZWN0ZWQgdG8gdGhlbSB3aWxsIGJlIHJlbW92ZWQgZHVyaW5nIGNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyBvcGVyYXRpb25cbiAgICAgICAgLy8gKGludGVybmFsbHkgYnkgZWxlcy5tb3ZlKCkgb3BlcmF0aW9uKSwgc28gbWFyayB0aGVtIGFzIHJlbW92ZWQgZWxlcyBmb3IgdW5kbyBvcGVyYXRpb24uXG4gICAgICAgIHZhciBub2Rlc1RvTWFrZUNvbXBvdW5kID0gcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZDtcbiAgICAgICAgdmFyIHJlbW92ZWRFbGVzID0gbm9kZXNUb01ha2VDb21wb3VuZC51bmlvbihub2Rlc1RvTWFrZUNvbXBvdW5kLmRlc2NlbmRhbnRzKCkpO1xuICAgICAgICByZW1vdmVkRWxlcyA9IHJlbW92ZWRFbGVzLnVuaW9uKHJlbW92ZWRFbGVzLmNvbm5lY3RlZEVkZ2VzKCkpO1xuICAgICAgICByZXN1bHQucmVtb3ZlZEVsZXMgPSByZW1vdmVkRWxlcztcbiAgICAgICAgLy8gQXNzdW1lIHRoYXQgYWxsIG5vZGVzIHRvIG1ha2UgY29tcG91bmQgaGF2ZSB0aGUgc2FtZSBwYXJlbnRcbiAgICAgICAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xuICAgICAgICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kXG4gICAgICAgIC8vIE5ldyBlbGVzIGluY2x1ZGVzIG5ldyBjb21wb3VuZCBhbmQgdGhlIG1vdmVkIGVsZXMgYW5kIHdpbGwgYmUgdXNlZCBpbiB1bmRvIG9wZXJhdGlvbi5cbiAgICAgICAgcmVzdWx0Lm5ld0VsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyhub2Rlc1RvTWFrZUNvbXBvdW5kLCBwYXJhbS5jb21wb3VuZFR5cGUpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdC5yZW1vdmVkRWxlcyA9IHBhcmFtLm5ld0VsZXMucmVtb3ZlKCk7XG4gICAgICAgIHJlc3VsdC5uZXdFbGVzID0gcGFyYW0ucmVtb3ZlZEVsZXMucmVzdG9yZSgpO1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlcihyZXN1bHQubmV3RWxlcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gYWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gZWFzeSBjcmVhdGlvbiBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIGVsZXM7XG5cbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbihwYXJhbS50ZW1wbGF0ZVR5cGUsIHBhcmFtLm1hY3JvbW9sZWN1bGVMaXN0LCBwYXJhbS5jb21wbGV4TmFtZSwgcGFyYW0ucHJvY2Vzc1Bvc2l0aW9uLCBwYXJhbS50aWxpbmdQYWRkaW5nVmVydGljYWwsIHBhcmFtLnRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBwYXJhbS5lZGdlTGVuZ3RoLCBwYXJhbS5sYXlvdXRQYXJhbSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVzID0gcGFyYW07XG4gICAgICAgIGN5LmFkZChlbGVzKTtcblxuICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICAgIGVsZXMuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IGVsZXNcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUFjdGl2YXRpb25SZWFjdGlvbiA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIGVsZXM7XG5cbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQWN0aXZhdGlvblJlYWN0aW9uKHBhcmFtLnByb3RlaW5OYW1lLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLmVkZ2VMZW5ndGgsIHBhcmFtLnJldmVyc2UpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcyA9IHBhcmFtO1xuICAgICAgICBjeS5hZGQoZWxlcyk7XG5cbiAgICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgICBlbGVzLnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiBlbGVzXG4gICAgICB9O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVNZXRhYm9saWNSZWFjdGlvbiA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICBsZXQgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgbGV0IGVsZXM7XG5cbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlTWV0YWJvbGljUmVhY3Rpb24ocGFyYW0uaW5wdXRzLCBwYXJhbS5vdXRwdXRzLCBwYXJhbS5yZXZlcnNpYmxlLCBwYXJhbS5yZWd1bGF0b3IsIHBhcmFtLnJlZ3VsYXRvck11bHRpbWVyLCBwYXJhbS5vcmllbnRhdGlvbik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcyA9IHBhcmFtO1xuICAgICAgICBjeS5hZGQoZWxlcyk7XG5cbiAgICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgICBlbGVzLnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiBlbGVzXG4gICAgICB9O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVNZXRhYm9saWNDYXRhbHl0aWNBY3Rpdml0eSA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIGVsZXM7XG5cbiAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlTWV0YWJvbGljQ2F0YWx5dGljQWN0aXZpdHkocGFyYW0uaW5wdXROb2RlTGlzdCwgcGFyYW0ub3V0cHV0Tm9kZUxpc3QsIHBhcmFtLmNhdGFseXN0TmFtZSwgcGFyYW0uY2F0YWx5c3RUeXBlLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLnRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgcGFyYW0udGlsaW5nUGFkZGluZ0hvcml6b250YWwsIHBhcmFtLmVkZ2VMZW5ndGgpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcyA9IHBhcmFtO1xuICAgICAgICBjeS5hZGQoZWxlcyk7XG5cbiAgICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgICBlbGVzLnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiBlbGVzXG4gICAgICB9O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUcmFuc2NyaXB0aW9uUmVhY3Rpb24gPSBmdW5jdGlvbihwYXJhbSkge1xuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgICAgIHZhciBlbGVzO1xuXG4gICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgIGVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRyYW5zY3JpcHRpb25SZWFjdGlvbihwYXJhbS5nZW5lTmFtZSwgcGFyYW0ubVJuYU5hbWUsIHBhcmFtLnByb2Nlc3NQb3NpdGlvbiwgcGFyYW0uZWRnZUxlbmd0aClcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVzID0gcGFyYW07XG4gICAgICAgIGN5LmFkZChlbGVzKTtcblxuICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICAgIGVsZXMuc2VsZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVsZXM6IGVsZXNcbiAgICAgIH07XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRyYW5zbGF0aW9uUmVhY3Rpb24gPSBmdW5jdGlvbihwYXJhbSkge1xuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgICAgIHZhciBlbGVzO1xuXG4gICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgIGVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZVRyYW5zbGF0aW9uUmVhY3Rpb24ocGFyYW0ubVJuYU5hbWUsIHBhcmFtLnByb3RlaW5OYW1lLCBwYXJhbS5wcm9jZXNzUG9zaXRpb24sIHBhcmFtLmVkZ2VMZW5ndGgpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlcyA9IHBhcmFtO1xuICAgICAgICBjeS5hZGQoZWxlcyk7XG5cbiAgICAgICAgY3kuZWxlbWVudHMoKS51bnNlbGVjdCgpO1xuICAgICAgICBlbGVzLnNlbGVjdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbGVzOiBlbGVzXG4gICAgICB9O1xuICAgIH07XG5cbiAgICAvLyBTZWN0aW9uIEVuZFxuICAgIC8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xuXG4gICAgLy8gU2VjdGlvbiBTdGFydFxuICAgIC8vIGdlbmVyYWwgYWN0aW9uIGZ1bmN0aW9uc1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwb3NpdGlvbnMgPSB7fTtcbiAgICAgIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XG5cbiAgICAgIG5vZGVzLmVhY2goZnVuY3Rpb24oZWxlLCBpKSB7XG4gICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zaXRpb25zW2VsZS5pZCgpXSA9IHtcbiAgICAgICAgICB4OiBlbGUucG9zaXRpb24oXCJ4XCIpLFxuICAgICAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcG9zaXRpb25zO1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyA9IGZ1bmN0aW9uIChwb3NpdGlvbnMpIHtcbiAgICAgIHZhciBjdXJyZW50UG9zaXRpb25zID0ge307XG4gICAgICBjeS5ub2RlcygpLnBvc2l0aW9ucyhmdW5jdGlvbiAoZWxlLCBpKSB7XG4gICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICBlbGUgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudFBvc2l0aW9uc1tlbGUuaWQoKV0gPSB7XG4gICAgICAgICAgeDogZWxlLnBvc2l0aW9uKFwieFwiKSxcbiAgICAgICAgICB5OiBlbGUucG9zaXRpb24oXCJ5XCIpXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHBvcyA9IHBvc2l0aW9uc1tlbGUuaWQoKV07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgeDogcG9zLngsXG4gICAgICAgICAgeTogcG9zLnlcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gY3VycmVudFBvc2l0aW9ucztcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHBlcmZvcm1PcGVyYXRpb246IHRydWVcbiAgICAgIH07XG5cbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gICAgICByZXN1bHQuc2l6ZU1hcCA9IHt9O1xuICAgICAgcmVzdWx0LnVzZUFzcGVjdFJhdGlvID0gZmFsc2U7XG4gICAgICByZXN1bHQucHJlc2VydmVSZWxhdGl2ZVBvcyA9IHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3M7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYobm9kZS5pc1BhcmVudCgpKXtcbiAgICAgICAgICByZXN1bHQuc2l6ZU1hcFtub2RlLmlkKCldID0ge1xuICAgICAgICAgICAgdzogbm9kZS5kYXRhKFwibWluV2lkdGhcIikgfHwgMCxcbiAgICAgICAgICAgIGg6IG5vZGUuZGF0YShcIm1pbkhlaWdodFwiKSB8fCAwLFxuICAgICAgICAgICAgYmlhc0wgOiBub2RlLmRhdGEoXCJtaW5XaWR0aEJpYXNMZWZ0XCIpIHx8IDAsXG4gICAgICAgICAgICBiaWFzUiA6IG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc1JpZ2h0XCIpIHx8IDAsXG4gICAgICAgICAgICBiaWFzVCA6IG5vZGUuZGF0YShcIm1pbkhlaWdodEJpYXNUb3BcIikgfHwgMCxcbiAgICAgICAgICAgIGJpYXNCIDogbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc0JvdHRvbVwiKSB8fCAwXG4gICAgICAgICAgIC8vIHc6IG5vZGUuY3NzKFwibWluV2lkdGhcIikgIT0gMD8gIG5vZGUuZGF0YShcIm1pbldpZHRoXCIpIDogbm9kZS5jaGlsZHJlbigpLmJvdW5kaW5nQm94KCkudyxcbiAgICAgICAgICAgIC8vaDogbm9kZS5jc3MoXCJtaW4taGVpZ2h0XCIpICE9IDA/ICBub2RlLmRhdGEoXCJtaW5IZWlnaHRcIikgOiBub2RlLmNoaWxkcmVuKCkuYm91bmRpbmdCb3goKS5oXG4gICAgICAgICAgfTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgcmVzdWx0LnNpemVNYXBbbm9kZS5pZCgpXSA9IHtcbiAgICAgICAgICAgIHc6IG5vZGUud2lkdGgoKSxcbiAgICAgICAgICAgIGg6IG5vZGUuaGVpZ2h0KClcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgfVxuXG4gICAgICByZXN1bHQubm9kZXMgPSBub2RlcztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuXG4gICAgICAgIGlmIChwYXJhbS5wZXJmb3JtT3BlcmF0aW9uKSB7XG4gICAgICAgICAgaWYgKHBhcmFtLnNpemVNYXApIHtcbiAgICAgICAgICAgIC8qIGlmIChwYXJhbS5wcmVzZXJ2ZVJlbGF0aXZlUG9zID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIHZhciBvbGRXaWR0aCA9IG5vZGUuZGF0YShcImJib3hcIikudztcbiAgICAgICAgICAgICAgdmFyIG9sZEhlaWdodCA9IG5vZGUuZGF0YShcImJib3hcIikuaDtcbiAgICAgICAgICAgIH0gKi9cblxuICAgICAgICAgICAgaWYobm9kZS5pc1BhcmVudCgpKXtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcIm1pbkhlaWdodFwiICwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmgpO1xuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aFwiICwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLncpO1xuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aEJpYXNMZWZ0XCIsIHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5iaWFzTCk7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc1JpZ2h0XCIsIHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5iaWFzUik7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcIm1pbkhlaWdodEJpYXNUb3BcIiwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmJpYXNUKTtcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc0JvdHRvbVwiLCBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uYmlhc0IpO1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLnc7XG4gICAgICAgICAgICAgIG5vZGUuZGF0YShcImJib3hcIikuaCA9IHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5oO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICBcblxuICAgICAgICAgICAgLyogaWYgKHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3MgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xuICAgICAgICAgICAgICB2YXIgdG9wQm90dG9tID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiAoYm94LmFuY2hvclNpZGUgPT09IFwidG9wXCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwiYm90dG9tXCIpKTtcbiAgICAgICAgICAgICAgdmFyIHJpZ2h0TGVmdCA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gKGJveC5hbmNob3JTaWRlID09PSBcInJpZ2h0XCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwibGVmdFwiKSk7XG5cbiAgICAgICAgICAgICAgdG9wQm90dG9tLmZvckVhY2goZnVuY3Rpb24oYm94KXtcbiAgICAgICAgICAgICAgICBpZiAoYm94LmJib3gueCA8IDApIHtcbiAgICAgICAgICAgICAgICAgIGJveC5iYm94LnggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChib3guYmJveC54ID4gb2xkV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgIGJveC5iYm94LnggPSBvbGRXaWR0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYm94LmJib3gueCA9IG5vZGUuZGF0YShcImJib3hcIikudyAqIGJveC5iYm94LnggLyBvbGRXaWR0aDtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgcmlnaHRMZWZ0LmZvckVhY2goZnVuY3Rpb24oYm94KXtcbiAgICAgICAgICAgICAgICBpZiAoYm94LmJib3gueSA8IDApIHtcbiAgICAgICAgICAgICAgICAgIGJveC5iYm94LnkgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChib3guYmJveC55ID4gb2xkSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICBib3guYmJveC55ID0gb2xkSGVpZ2h0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBib3guYmJveC55ID0gbm9kZS5kYXRhKFwiYmJveFwiKS5oICogYm94LmJib3gueSAvIG9sZEhlaWdodDtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9ICovXG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXNpemVOb2RlcyhwYXJhbS5ub2RlcywgcGFyYW0ud2lkdGgsIHBhcmFtLmhlaWdodCwgcGFyYW0udXNlQXNwZWN0UmF0aW8sIHBhcmFtLnByZXNlcnZlUmVsYXRpdmVQb3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIH07XG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgICAgIHJlc3VsdC5ub2RlcyA9IG5vZGVzO1xuICAgICAgcmVzdWx0LmxhYmVsID0ge307XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgcmVzdWx0LmxhYmVsW25vZGUuaWQoKV0gPSBub2RlLl9wcml2YXRlLmRhdGEubGFiZWw7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgbm9kZXMuZGF0YSgnbGFiZWwnLCBwYXJhbS5sYWJlbCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgICAgbm9kZS5fcHJpdmF0ZS5kYXRhLmxhYmVsID0gcGFyYW0ubGFiZWxbbm9kZS5pZCgpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94U3R5bGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuICAgICAgdmFyIHN0eWxlID0gcGFyYW0ubm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpW3BhcmFtLmluZGV4XS5zdHlsZTtcbiAgICAgIHJlc3VsdC5uZXdQcm9wcyA9ICQuZXh0ZW5kKCB7fSwgc3R5bGUgKTtcbiAgICAgIHJlc3VsdC5ub2RlID0gcGFyYW0ubm9kZTtcbiAgICAgIHJlc3VsdC5pbmRleCA9IHBhcmFtLmluZGV4O1xuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hTdHlsZSggcGFyYW0ubm9kZSwgcGFyYW0uaW5kZXgsIHBhcmFtLm5ld1Byb3BzICk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUluZm9ib3hPYmogPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuICAgICAgdmFyIG9iaiA9IHBhcmFtLm5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKVtwYXJhbS5pbmRleF07XG4gICAgICByZXN1bHQubmV3UHJvcHMgPSAkLmV4dGVuZCgge30sIG9iaiApO1xuICAgICAgcmVzdWx0Lm5vZGUgPSBwYXJhbS5ub2RlO1xuICAgICAgcmVzdWx0LmluZGV4ID0gcGFyYW0uaW5kZXg7XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlSW5mb2JveE9iaiggcGFyYW0ubm9kZSwgcGFyYW0uaW5kZXgsIHBhcmFtLm5ld1Byb3BzICk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZURhdGEgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuICAgICAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xuICAgICAgcmVzdWx0LnZhbHVlTWFwID0ge307XG4gICAgICByZXN1bHQuZWxlcyA9IGVsZXM7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5kYXRhKHBhcmFtLm5hbWUpO1xuICAgICAgfVxuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEocGFyYW0uZWxlcywgcGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXApO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVTZXRGaWVsZCA9IGZ1bmN0aW9uKCBwYXJhbSApIHtcbiAgICAgIHZhciB1cGRhdGVzID0gZWxlbWVudFV0aWxpdGllcy51cGRhdGVTZXRGaWVsZCggcGFyYW0uZWxlLCBwYXJhbS5maWVsZE5hbWUsIHBhcmFtLnRvRGVsZXRlLCBwYXJhbS50b0FkZCwgcGFyYW0uY2FsbGJhY2sgKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgZWxlOiBwYXJhbS5lbGUsXG4gICAgICAgIGZpZWxkTmFtZTogcGFyYW0uZmllbGROYW1lLFxuICAgICAgICBjYWxsYmFjazogcGFyYW0uY2FsbGJhY2ssXG4gICAgICAgIHRvRGVsZXRlOiB1cGRhdGVzLmFkZGVkLFxuICAgICAgICB0b0FkZDogdXBkYXRlcy5kZWxldGVkXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuICAgICAgcmVzdWx0Lm5hbWUgPSBwYXJhbS5uYW1lO1xuICAgICAgcmVzdWx0LnZhbHVlTWFwID0ge307XG4gICAgICByZXN1bHQuZWxlcyA9IGVsZXM7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcbiAgICAgICAgcmVzdWx0LnZhbHVlTWFwW2VsZS5pZCgpXSA9IGVsZS5jc3MocGFyYW0ubmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzKHBhcmFtLmVsZXMsIHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlTWFwKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICB9O1xuXG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG4gICAgICByZXN1bHQuZGF0YSA9IHt9O1xuICAgICAgcmVzdWx0LmVsZXMgPSBlbGVzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XG5cbiAgICAgICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldID0ge307XG5cbiAgICAgICAgdmFyIGRhdGEgPSBwYXJhbS5maXJzdFRpbWUgPyBwYXJhbS5kYXRhIDogcGFyYW0uZGF0YVtlbGUuaWQoKV07XG5cbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBkYXRhKSB7XG4gICAgICAgICAgcmVzdWx0LmRhdGFbZWxlLmlkKCldW3Byb3BdID0gZWxlLmRhdGEocHJvcCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIGRhdGEpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xuXG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGUsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogU2hvdyBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cbiAgICAgKi9cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuXG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XG4gICAgICAgIHJlc3VsdC5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dChwYXJhbS5lbGVzLCBwYXJhbS5sYXlvdXRwYXJhbSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuc2hvdyhlbGVzKTsgLy8gU2hvdyBnaXZlbiBlbGVzXG4gICAgICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuaGlkZShlbGVzKTsgLy8gSGlkZSBwcmV2aW91c2x5IHVuaGlkZGVuIGVsZXM7XG5cbiAgICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogSGlkZSBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cbiAgICAgKi9cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5oaWRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuXG4gICAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgICAgIHJlc3VsdC5lbGVzID0gZWxlbWVudFV0aWxpdGllcy5oaWRlQW5kUGVyZm9ybUxheW91dChwYXJhbS5lbGVzLCBwYXJhbS5sYXlvdXRwYXJhbSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQuZWxlcyA9IGN5LnZpZXdVdGlsaXRpZXMoKS5oaWRlKGVsZXMpOyAvLyBIaWRlIGdpdmVuIGVsZXNcbiAgICAgICAgICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvSGlkZUFuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcbiAgICAgICAgcmVzdWx0LmVsZXMgPSBjeS52aWV3VXRpbGl0aWVzKCkuc2hvdyhlbGVzKTsgLy8gU2hvdyBwcmV2aW91c2x5IGhpZGRlbiBlbGVzXG5cbiAgICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIERlbGV0ZSBlbGVzIGFuZCBwZXJmb3JtIGxheW91dC5cbiAgICAgKi9cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XG5cbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuZGVsZXRlQW5kUGVyZm9ybUxheW91dChwYXJhbS5lbGVzLCBwYXJhbS5sYXlvdXRwYXJhbSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgICByZXN1bHQuZWxlcyA9IGVsZXMucmVtb3ZlKCk7XG4gICAgICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmRvRGVsZXRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICByZXN1bHQucG9zaXRpb25zID0gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZ2V0Tm9kZVBvc2l0aW9ucygpO1xuICAgICAgcmVzdWx0LmVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVFbGVzKGVsZXMpOyBcblxuICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gZ2VuZXJhbCBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICAvLyBTZWN0aW9uIFN0YXJ0XG4gICAgLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIH07XG4gICAgICByZXN1bHQudHlwZSA9IHBhcmFtLnR5cGU7XG4gICAgICByZXN1bHQubm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgICAgIHJlc3VsdC5pbmRleCA9IHBhcmFtLmluZGV4O1xuICAgICAgdmFyIGRhdGEgPSBwYXJhbS5kYXRhO1xuXG4gICAgICB2YXIgdGVtcERhdGEgPSBlbGVtZW50VXRpbGl0aWVzLnNhdmVVbml0cyhwYXJhbS5ub2Rlcyk7XG4gICAgICByZXN1bHQudmFsdWUgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94KHBhcmFtLm5vZGVzLCBwYXJhbS5pbmRleCwgcGFyYW0udmFsdWUsIHBhcmFtLnR5cGUpO1xuICAgICAgLyogdmFyIGxvY2F0aW9ucyA9IGVsZW1lbnRVdGlsaXRpZXMuY2hlY2tGaXQocGFyYW0ubm9kZXMpO1xuICAgICAgaWYgKGxvY2F0aW9ucyAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuZml0VW5pdHMocGFyYW0ubm9kZXMsIGxvY2F0aW9ucyk7XG4gICAgICB9ICovXG4gICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZVVuaXRzKHBhcmFtLm5vZGVzLCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcbiAgICAgIHJlc3VsdC5kYXRhID0gdGVtcERhdGE7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIG9iaiA9IHBhcmFtLm9iajtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICAgICAgdmFyIGRhdGEgPSBwYXJhbS5kYXRhO1xuXG4gICAgICB2YXIgdGVtcERhdGEgPSBlbGVtZW50VXRpbGl0aWVzLnNhdmVVbml0cyhub2Rlcyk7XG4gICAgICB2YXIgbG9jYXRpb25PYmogPSBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xuICAgICAvKiAgdmFyIGxvY2F0aW9ucyA9IGVsZW1lbnRVdGlsaXRpZXMuY2hlY2tGaXQobm9kZXMpO1xuICAgICAgaWYgKGxvY2F0aW9ucyAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuZml0VW5pdHMobm9kZXMsIGxvY2F0aW9ucyk7XG4gICAgICB9ICovXG4gICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZVVuaXRzKG5vZGVzLCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBsb2NhdGlvbk9iajogbG9jYXRpb25PYmosXG4gICAgICAgIG9iajogb2JqLFxuICAgICAgICBkYXRhOiB0ZW1wRGF0YVxuICAgICAgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgbG9jYXRpb25PYmogPSBwYXJhbS5sb2NhdGlvbk9iajtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICAgICAgdmFyIGRhdGEgPSBwYXJhbS5kYXRhO1xuXG4gICAgICB2YXIgdGVtcERhdGEgPSBlbGVtZW50VXRpbGl0aWVzLnNhdmVVbml0cyhub2Rlcyk7XG4gICAgICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveChub2RlcywgbG9jYXRpb25PYmopO1xuICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVVbml0cyhub2RlcywgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgb2JqOiBvYmosXG4gICAgICAgIGRhdGE6IHRlbXBEYXRhXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZml0VW5pdHMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBub2RlID0gcGFyYW0ubm9kZTtcbiAgICAgIHZhciBsb2NhdGlvbnMgPSBwYXJhbS5sb2NhdGlvbnM7XG4gICAgICB2YXIgb2JqID0gZWxlbWVudFV0aWxpdGllcy5maXRVbml0cyhub2RlLCBsb2NhdGlvbnMpO1xuXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICBvYmo6IG9iaixcbiAgICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnNcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlVW5pdHMgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBub2RlID0gcGFyYW0ubm9kZTtcbiAgICAgIHZhciBsb2NhdGlvbnMgPSBwYXJhbS5sb2NhdGlvbnM7XG4gICAgICB2YXIgb2JqID0gcGFyYW0ub2JqO1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5mb3JFYWNoKCBmdW5jdGlvbiAoZWxlKSB7XG4gICAgICAgIHZhciBib3ggPSBvYmpbaW5kZXgrK107XG4gICAgICAgIGVsZS5iYm94LnggPSBib3gueDtcbiAgICAgICAgZWxlLmJib3gueSA9IGJveC55O1xuICAgICAgICB2YXIgb2xkU2lkZSA9IGVsZS5hbmNob3JTaWRlO1xuICAgICAgICBlbGUuYW5jaG9yU2lkZSA9IGJveC5hbmNob3JTaWRlO1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1vZGlmeVVuaXRzKG5vZGUsIGVsZSwgb2xkU2lkZSk7XG4gICAgICB9KTtcblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnNcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuICAgICAgdmFyIHN0YXR1cyA9IHBhcmFtLnN0YXR1cztcbiAgICAgIHZhciByZXN1bHRTdGF0dXMgPSB7fTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XG5cbiAgICAgICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBpc011bHRpbWVyO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIGNoYW5nZSB0aGUgc3RhdHVzIG9mIGFsbCBub2RlcyBhdCBvbmNlLlxuICAgICAgLy8gSWYgbm90IGNoYW5nZSBzdGF0dXMgb2YgZWFjaCBzZXBlcmF0ZWx5IHRvIHRoZSB2YWx1ZXMgbWFwcGVkIHRvIHRoZWlyIGlkLlxuICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMobm9kZSwgc3RhdHVzW25vZGUuaWQoKV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAvLyAgaWYgKCFmaXJzdFRpbWUgJiYgXy5pc0VxdWFsKG5vZGVzLCBjeS5ub2RlcygnOnNlbGVjdGVkJykpKSB7XG4gICAgLy8gICAgJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIikpO1xuICAgIC8vICB9XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHN0YXR1czogcmVzdWx0U3RhdHVzLFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldENsb25lTWFya2VyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcbiAgICAgIHZhciBzdGF0dXMgPSBwYXJhbS5zdGF0dXM7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIHJlc3VsdFN0YXR1cyA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIHJlc3VsdFN0YXR1c1tub2RlLmlkKCldID0gbm9kZS5kYXRhKCdjbG9uZW1hcmtlcicpO1xuICAgICAgICB2YXIgY3VycmVudFN0YXR1cyA9IGZpcnN0VGltZSA/IHN0YXR1cyA6IHN0YXR1c1tub2RlLmlkKCldO1xuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGUsIGN1cnJlbnRTdGF0dXMpO1xuICAgICAgfVxuXG4gICAgLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xuICAgIC8vICAgICQoJyNpbnNwZWN0b3ItaXMtY2xvbmUtbWFya2VyJykuYXR0cihcImNoZWNrZWRcIiwgISQoJyNpbnNwZWN0b3ItaXMtY2xvbmUtbWFya2VyJykuYXR0cihcImNoZWNrZWRcIikpO1xuICAgIC8vICB9XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIHN0YXR1czogcmVzdWx0U3RhdHVzLFxuICAgICAgICBub2Rlczogbm9kZXNcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8vIHBhcmFtOiB7Y2xhc3M6IHNiZ25jbGFzcywgbmFtZTogcHJvcGVydHlOYW1lLCB2YWx1ZTogdmFsdWV9XG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0RGVmYXVsdFByb3BlcnR5ID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgc2JnbmNsYXNzID0gcGFyYW0uY2xhc3M7XG4gICAgICB2YXIgbmFtZSA9IHBhcmFtLm5hbWU7XG4gICAgICB2YXIgdmFsdWUgPSBwYXJhbS52YWx1ZTtcbiAgICAgIHZhciBjbGFzc0RlZmF1bHRzID0gZWxlbWVudFV0aWxpdGllcy5nZXREZWZhdWx0UHJvcGVydGllcyhzYmduY2xhc3MpO1xuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgY2xhc3M6IHNiZ25jbGFzcyxcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgdmFsdWU6IGNsYXNzRGVmYXVsdHMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBjbGFzc0RlZmF1bHRzW25hbWVdIDogdW5kZWZpbmVkXG4gICAgICB9O1xuXG4gICAgICB2YXIgcHJvcE1hcCA9IHt9O1xuICAgICAgcHJvcE1hcFsgbmFtZSBdID0gdmFsdWU7XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0RGVmYXVsdFByb3BlcnRpZXMoIHNiZ25jbGFzcywgcHJvcE1hcCApO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBiZ09iaiA9IHBhcmFtLmJnT2JqO1xuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gICAgICB2YXIgdXBkYXRlSW5mbyA9IHBhcmFtLnVwZGF0ZUluZm87XG4gICAgICB2YXIgcHJvbXB0SW52YWxpZEltYWdlID0gcGFyYW0ucHJvbXB0SW52YWxpZEltYWdlO1xuICAgICAgdmFyIHZhbGlkYXRlVVJMID0gcGFyYW0udmFsaWRhdGVVUkw7XG5cbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkQmFja2dyb3VuZEltYWdlKG5vZGVzLCBiZ09iaiwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCk7XG5cbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIG5vZGVzOiBub2RlcyxcbiAgICAgICAgYmdPYmo6IGJnT2JqLFxuICAgICAgICB1cGRhdGVJbmZvOiB1cGRhdGVJbmZvLFxuICAgICAgICBwcm9tcHRJbnZhbGlkSW1hZ2U6IHByb21wdEludmFsaWRJbWFnZSxcbiAgICAgICAgdmFsaWRhdGVVUkw6IHZhbGlkYXRlVVJMXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgYmdPYmogPSBwYXJhbS5iZ09iajtcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xuXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZShub2RlcywgYmdPYmopO1xuXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xuXG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBub2Rlczogbm9kZXMsXG4gICAgICAgIGJnT2JqOiBiZ09ialxuICAgICAgfTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgdmFyIGJnT2JqID0gcGFyYW0uYmdPYmo7XG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcblxuICAgICAgdmFyIG9sZEJnT2JqID0gZWxlbWVudFV0aWxpdGllcy51cGRhdGVCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIGJnT2JqKTtcblxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxuICAgICAgICBiZ09iajogb2xkQmdPYmpcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIHZhciBvbGRJbWcgPSBwYXJhbS5vbGRJbWc7XG4gICAgICB2YXIgbmV3SW1nID0gcGFyYW0ubmV3SW1nO1xuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xuICAgICAgdmFyIHVwZGF0ZUluZm8gPSBwYXJhbS51cGRhdGVJbmZvO1xuICAgICAgdmFyIHByb21wdEludmFsaWRJbWFnZSA9IHBhcmFtLnByb21wdEludmFsaWRJbWFnZTtcbiAgICAgIHZhciB2YWxpZGF0ZVVSTD0gcGFyYW0udmFsaWRhdGVVUkw7XG5cbiAgICAgIHZhciByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUJhY2tncm91bmRJbWFnZShub2Rlcywgb2xkSW1nLCBuZXdJbWcsIGZpcnN0VGltZSwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCk7XG5cbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8vIFNlY3Rpb24gRW5kXG4gICAgLy8gc2JnbiBhY3Rpb24gZnVuY3Rpb25zXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY29udmVydEludG9SZXZlcnNpYmxlUmVhY3Rpb24gPSBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIGxldCBjb2xsZWN0aW9uID0gY3kuY29sbGVjdGlvbigpO1xuICAgICAgbGV0IG1hcFR5cGUgPSBlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKTtcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShwYXJhbS5tYXBUeXBlKTtcbiAgICAgICQoJyNtYXAtdHlwZScpLnZhbChwYXJhbS5tYXBUeXBlKTtcblxuICAgICAgcGFyYW0uY29sbGVjdGlvbi5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2UpIHtcbiAgICAgICAgdmFyIHNvdXJjZU5vZGUgPSBlZGdlLl9wcml2YXRlLmRhdGEuc291cmNlO1xuICAgICAgICB2YXIgdGFyZ2V0Tm9kZSA9IGVkZ2UuX3ByaXZhdGUuZGF0YS50YXJnZXQ7XG5cbiAgICAgICAgZWRnZS5tb3ZlKHtzb3VyY2U6IHRhcmdldE5vZGUsIHRhcmdldDogc291cmNlTm9kZX0pO1xuXG4gICAgICAgIGxldCBjb252ZXJ0ZWRFZGdlID0gY3kuZ2V0RWxlbWVudEJ5SWQoZWRnZS5pZCgpKTtcblxuICAgICAgICBpZihjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2ViZW5kZWRpdGluZ0Rpc3RhbmNlc1wiKSl7XG4gICAgICAgICAgbGV0IGRpc3RhbmNlID0gY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXNcIik7XG4gICAgICAgICAgZGlzdGFuY2UgPSBkaXN0YW5jZS5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIC0xKmVsZW1lbnQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXNcIiwgZGlzdGFuY2UucmV2ZXJzZSgpKTtcblxuICAgICAgICAgIGxldCB3ZWlnaHQgPSBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2ViZW5kZWRpdGluZ1dlaWdodHNcIik7XG4gICAgICAgICAgd2VpZ2h0ID0gd2VpZ2h0Lm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gMS1lbGVtZW50O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWJlbmRlZGl0aW5nV2VpZ2h0c1wiLCB3ZWlnaHQucmV2ZXJzZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWNvbnRyb2xlZGl0aW5nRGlzdGFuY2VzXCIpKXtcbiAgICAgICAgICBsZXQgZGlzdGFuY2UgPSBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2Vjb250cm9sZWRpdGluZ0Rpc3RhbmNlc1wiKTtcbiAgICAgICAgICBkaXN0YW5jZSA9IGRpc3RhbmNlLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gLTEqZWxlbWVudDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLmRhdGEoXCJjeWVkZ2Vjb250cm9sZWRpdGluZ0Rpc3RhbmNlc1wiLCBkaXN0YW5jZS5yZXZlcnNlKCkpO1xuXG4gICAgICAgICAgbGV0IHdlaWdodCA9IGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWNvbnRyb2xlZGl0aW5nV2VpZ3Roc1wiKTtcbiAgICAgICAgICB3ZWlnaHQgPSB3ZWlnaHQubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAxLWVsZW1lbnQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlY29udHJvbGVkaXRpbmdXZWlndGhzXCIsIHdlaWdodC5yZXZlcnNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PT0gXCJjb25zdW1wdGlvblwiKSB7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID0gXCJwcm9kdWN0aW9uXCI7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLnBvcnRzb3VyY2UgPSB0YXJnZXROb2RlICsgXCIuMVwiO1xuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0dGFyZ2V0ID0gc291cmNlTm9kZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb252ZXJ0ZWRFZGdlLl9wcml2YXRlLmRhdGEuY2xhc3MgPT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID0gXCJjb25zdW1wdGlvblwiO1xuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0c291cmNlID0gdGFyZ2V0Tm9kZTtcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLl9wcml2YXRlLmRhdGEucG9ydHRhcmdldCA9IHNvdXJjZU5vZGUgKyBcIi4xXCI7XG4gICAgICAgIH1cblxuICAgICAgICBjb2xsZWN0aW9uID0gY29sbGVjdGlvbi5hZGQoY29udmVydGVkRWRnZSk7XG4gICAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvbixcbiAgICAgICAgbWFwVHlwZTogbWFwVHlwZSxcbiAgICAgICAgcHJvY2Vzc0lkOiBwYXJhbS5wcm9jZXNzSWRcbiAgICAgIH07XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLm1vdmVFZGdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgfTtcbiAgICAgIHZhciBlZGdlID0gcGFyYW0uZWRnZTtcbiAgICAgIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTsgICAgICBcbiAgICAgXG5cbiAgICAgIHJlc3VsdC5zb3VyY2UgPSBlZGdlLnNvdXJjZSgpLmlkKCk7XG4gICAgICByZXN1bHQudGFyZ2V0ID0gZWRnZS50YXJnZXQoKS5pZCgpOyAgICAgIFxuICAgICAgcmVzdWx0LnBvcnRzb3VyY2UgID1lZGdlLmRhdGEoXCJwb3J0c291cmNlXCIpO1xuICAgICAgcmVzdWx0LnBvcnR0YXJnZXQgPSBlZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVkZ2UsICdzb3VyY2UnLCBwYXJhbS5zb3VyY2UpO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVkZ2UsICd0YXJnZXQnLCBwYXJhbS50YXJnZXQpO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVkZ2UsICdwb3J0c291cmNlJywgcGFyYW0ucG9ydHNvdXJjZSk7XG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWRnZSwgJ3BvcnR0YXJnZXQnLCBwYXJhbS5wb3J0dGFyZ2V0KTsgXG4gICAgICBlZGdlID0gZWRnZS5tb3ZlKHtcbiAgICAgICAgdGFyZ2V0OiBwYXJhbS50YXJnZXQsXG4gICAgICAgIHNvdXJjZSA6IHBhcmFtLnNvdXJjZVxuICAgIFxuICAgICB9KTtcblxuICAgICByZXN1bHQuZWRnZSA9IGVkZ2U7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5maXhFcnJvciA9IGZ1bmN0aW9uKHBhcmFtKXtcbiAgICAgIFxuICAgICAgdmFyIGVycm9yQ29kZSA9IHBhcmFtLmVycm9yQ29kZTtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIHJlc3VsdC5lcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gICAgICBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTAxXCIgfHwgZXJyb3JDb2RlID09ICdwZDEwMTAyJyl7XG5cbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLnJldmVyc2VFZGdlKHBhcmFtLmVkZ2UpO1xuXG4gICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwM1wiIHx8IGVycm9yQ29kZSA9PSAncGQxMDEwNycpe1xuXG4gICAgICAgXG4gICAgICAgIFxuICAgICAgICBwYXJhbS5uZXdOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5ld05vZGUpe1xuICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKG5ld05vZGUueCwgbmV3Tm9kZS55LCBuZXdOb2RlLmNsYXNzLCBuZXdOb2RlLmlkLCB1bmRlZmluZWQpO1xuXG4gICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBhcmFtLm5ld0VkZ2VzLmZvckVhY2goZnVuY3Rpb24obmV3RWRnZSl7ICAgICAgICAgIFxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShuZXdFZGdlLnNvdXJjZSxuZXdFZGdlLnRhcmdldCxuZXdFZGdlLmNsYXNzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGFyYW0ub2xkRWRnZXMuZm9yRWFjaChmdW5jdGlvbihvbGRFZGdlKXtcbiAgICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XG4gICAgICAgICAgLy9yZXR1cm4gXG4gICAgICAgICAgb2xkRWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGFyYW0ubm9kZS5yZW1vdmUoKTtcblxuICAgICAgICByZXR1cm4gcGFyYW07XG5cbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDVcIiB8fCBlcnJvckNvZGUgPT0gJ3BkMTAxMDYnKXtcbiAgIFxuICAgICAgICByZXN1bHQuZWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMucmV2ZXJzZUVkZ2UocGFyYW0uZWRnZSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTQwXCIpe1xuICAgICAgICBwYXJhbS5ub2RlLnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA0XCIpIHtcbiAgICAgICAgXG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDhcIil7XG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMTFcIil7XG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMjZcIil7XG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDlcIiB8fCBlcnJvckNvZGUgPT0gXCJwZDEwMTI0XCIpIHtcbiAgICAgICAgXG4gICAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLmRhdGEoKS5zb3VyY2U7XG4gICAgICAgIHJlc3VsdC5uZXdUYXJnZXQgPSBwYXJhbS5lZGdlLmRhdGEoKS50YXJnZXQ7XG4gICAgICAgIHJlc3VsdC5wb3J0c291cmNlID0gcGFyYW0uZWRnZS5kYXRhKCkucG9ydHNvdXJjZTtcbiAgICAgICAgdmFyIGNsb25lZEVkZ2UgPSBwYXJhbS5lZGdlLmNsb25lKCk7XG4gICAgICAgXG4gICAgICAgIHZhciBlZGdlUGFyYW1zID0ge2NsYXNzIDogY2xvbmVkRWRnZS5kYXRhKCkuY2xhc3MsIGxhbmd1YWdlIDpjbG9uZWRFZGdlLmRhdGEoKS5sYW5ndWFnZX07XG4gICAgICAgIGNsb25lZEVkZ2UuZGF0YSgpLnNvdXJjZSA9IHBhcmFtLm5ld1NvdXJjZTtcbiAgICAgICAgY2xvbmVkRWRnZS5kYXRhKCkudGFyZ2V0ID0gcGFyYW0ubmV3VGFyZ2V0O1xuICAgICAgICBjeS5yZW1vdmUocGFyYW0uZWRnZSk7XG4gICAgICAgIHJlc3VsdC5lZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHBhcmFtLm5ld1NvdXJjZSxwYXJhbS5uZXdUYXJnZXQsZWRnZVBhcmFtcywgY2xvbmVkRWRnZS5kYXRhKCkuaWQpOyAgICAgIFxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTEyXCIpIHsgICAgXG4gICAgICAgIFxuICAgICAgICBwYXJhbS5jYWxsYmFjayA9IGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyOyAgXG4gICAgICAgIC8vIElmIHRoaXMgaXMgZmlyc3QgdGltZSB3ZSBzaG91bGQgbW92ZSB0aGUgbm9kZSB0byBpdHMgbmV3IHBhcmVudCBhbmQgcmVsb2NhdGUgaXQgYnkgZ2l2ZW4gcG9zRGlmZiBwYXJhbXNcbiAgICAgICAgLy8gZWxzZSB3ZSBzaG91bGQgcmVtb3ZlIHRoZSBtb3ZlZCBlbGVzIGFuZCByZXN0b3JlIHRoZSBlbGVzIHRvIHJlc3RvcmVcbiAgICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xuICAgICAgICAgIHZhciBuZXdQYXJlbnRJZCA9IHBhcmFtLnBhcmVudERhdGEgPT0gdW5kZWZpbmVkID8gbnVsbCA6IHBhcmFtLnBhcmVudERhdGE7XG4gICAgICAgICAgLy8gVGhlc2UgZWxlcyBpbmNsdWRlcyB0aGUgbm9kZXMgYW5kIHRoZWlyIGNvbm5lY3RlZCBlZGdlcyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIG5vZGVzLm1vdmUoKS5cbiAgICAgICAgICAvLyBUaGV5IHNob3VsZCBiZSByZXN0b3JlZCBpbiB1bmRvXG4gICAgICAgICAgdmFyIHdpdGhEZXNjZW5kYW50ID0gcGFyYW0ubm9kZXMudW5pb24ocGFyYW0ubm9kZXMuZGVzY2VuZGFudHMoKSk7XG4gICAgICAgICAgcmVzdWx0LmVsZXNUb1Jlc3RvcmUgPSB3aXRoRGVzY2VuZGFudC51bmlvbih3aXRoRGVzY2VuZGFudC5jb25uZWN0ZWRFZGdlcygpKTtcbiAgICAgICAgICAvLyBUaGVzZSBhcmUgdGhlIGVsZXMgY3JlYXRlZCBieSBub2Rlcy5tb3ZlKCksIHRoZXkgc2hvdWxkIGJlIHJlbW92ZWQgaW4gdW5kby5cbiAgICAgICAgICByZXN1bHQubW92ZWRFbGVzID0gcGFyYW0ubm9kZXMubW92ZSh7XCJwYXJlbnRcIjogbmV3UGFyZW50SWR9KTtcblxuICAgICAgICAgIHZhciBwb3NEaWZmID0ge1xuICAgICAgICAgICAgeDogcGFyYW0ucG9zRGlmZlgsXG4gICAgICAgICAgICB5OiBwYXJhbS5wb3NEaWZmWVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyhwb3NEaWZmLCByZXN1bHQubW92ZWRFbGVzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXN1bHQuZWxlc1RvUmVzdG9yZSA9IHBhcmFtLm1vdmVkRWxlcy5yZW1vdmUoKTtcbiAgICAgICAgICByZXN1bHQubW92ZWRFbGVzID0gcGFyYW0uZWxlc1RvUmVzdG9yZS5yZXN0b3JlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyYW0uY2FsbGJhY2spIHtcbiAgICAgICAgICByZXN1bHQuY2FsbGJhY2sgPSBwYXJhbS5jYWxsYmFjazsgLy8ga2VlcCB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgc28gaXQgY2FuIGJlIHJldXNlZCBhZnRlciB1bmRvL3JlZG9cbiAgICAgICAgICBwYXJhbS5jYWxsYmFjayhyZXN1bHQubW92ZWRFbGVzKTsgLy8gYXBwbHkgdGhlIGNhbGxiYWNrIG9uIG5ld2x5IGNyZWF0ZWQgZWxlbWVudHNcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMjVcIikge1xuXG4gICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLnJlbW92ZSgpOyAgICAgICBcbiAgICAgICByZXN1bHQubmV3RWRnZSA9e307XG4gICAgICAgdmFyIGVkZ2VjbGFzcyA9IHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcy5jbGFzcyA/IHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcy5jbGFzcyA6IHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcztcbiAgICAgICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChwYXJhbS5uZXdFZGdlLnNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHBhcmFtLm5ld0VkZ2UudGFyZ2V0KSk7XG5cbiAgICAgICBpZiAodmFsaWRhdGlvbiA9PT0gJ3JldmVyc2UnKSB7XG4gICAgICAgIHZhciB0ZW1wID0gcGFyYW0ubmV3RWRnZS5zb3VyY2U7XG4gICAgICAgIHBhcmFtLm5ld0VkZ2Uuc291cmNlID0gcGFyYW0ubmV3RWRnZS50YXJnZXQ7XG4gICAgICAgIHBhcmFtLm5ld0VkZ2UudGFyZ2V0ID0gdGVtcDtcbiAgICAgIH1cbiAgICAgICByZXN1bHQubmV3RWRnZS5pZCA9ZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHBhcmFtLm5ld0VkZ2Uuc291cmNlLHBhcmFtLm5ld0VkZ2UudGFyZ2V0LHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcykuaWQoKTtcbiAgICAgICByZXN1bHQubmV3RWRnZS5zb3VyY2UgPSBwYXJhbS5uZXdFZGdlLnNvdXJjZTtcbiAgICAgICByZXN1bHQubmV3RWRnZS50YXJnZXQgPSBwYXJhbS5uZXdFZGdlLnRhcmdldDtcbiAgICAgICByZXN1bHQubmV3RWRnZS5lZGdlUGFyYW1zID0gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zO1xuICAgICAgIFxuICAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICAgICAgXG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTQyXCIpIHtcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLnJlbW92ZSgpOyAgICAgICBcbiAgICAgICAgcmVzdWx0Lm5ld0VkZ2UgPXt9O1xuICAgICAgICB2YXIgZWRnZWNsYXNzID0gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zLmNsYXNzID8gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zLmNsYXNzIDogcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zO1xuICAgICAgICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChwYXJhbS5uZXdFZGdlLnNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHBhcmFtLm5ld0VkZ2UudGFyZ2V0KSk7XG5cbiAgICAgICAgaWYgKHZhbGlkYXRpb24gPT09ICdyZXZlcnNlJykge1xuICAgICAgICAgdmFyIHRlbXAgPSBwYXJhbS5uZXdFZGdlLnNvdXJjZTtcbiAgICAgICAgIHBhcmFtLm5ld0VkZ2Uuc291cmNlID0gcGFyYW0ubmV3RWRnZS50YXJnZXQ7XG4gICAgICAgICBwYXJhbS5uZXdFZGdlLnRhcmdldCA9IHRlbXA7XG4gICAgICAgfVxuICAgICAgICByZXN1bHQubmV3RWRnZS5pZCA9ZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHBhcmFtLm5ld0VkZ2Uuc291cmNlLHBhcmFtLm5ld0VkZ2UudGFyZ2V0LHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcykuaWQoKTtcbiAgICAgICAgcmVzdWx0Lm5ld0VkZ2Uuc291cmNlID0gcGFyYW0ubmV3RWRnZS5zb3VyY2U7XG4gICAgICAgIHJlc3VsdC5uZXdFZGdlLnRhcmdldCA9IHBhcmFtLm5ld0VkZ2UudGFyZ2V0O1xuICAgICAgICByZXN1bHQubmV3RWRnZS5lZGdlUGFyYW1zID0gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1lbHNlIHtcblxuICAgICAgICByZXN1bHQubmV3U291cmNlID0gcGFyYW0uZWRnZS5zb3VyY2UoKS5pZCgpO1xuICAgICAgICByZXN1bHQubmV3VGFyZ2V0ID0gcGFyYW0uZWRnZS50YXJnZXQoKS5pZCgpO1xuICAgICAgICByZXN1bHQucG9ydHRhcmdldCA9IHBhcmFtLmVkZ2UuZGF0YShcInBvcnR0YXJnZXRcIik7XG4gICAgICAgIHJlc3VsdC5lZGdlID0gcGFyYW0uZWRnZS5tb3ZlKHtcbiAgICAgICAgICB0YXJnZXQ6IHBhcmFtLm5ld1RhcmdldCxcbiAgICAgICAgICBzb3VyY2UgOiBwYXJhbS5uZXdTb3VyY2UgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHJlc3VsdC5lZGdlLCAncG9ydHRhcmdldCcsIHBhcmFtLnBvcnR0YXJnZXQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICBcbiAgICAgIH1cbiAgICAgIFxuICB9XG4gIFxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmZpeEVycm9yID0gZnVuY3Rpb24ocGFyYW0pe1xuICAgIHZhciBlcnJvckNvZGUgPSBwYXJhbS5lcnJvckNvZGU7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5lcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gICAgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwMVwiIHx8IGVycm9yQ29kZSA9PSAncGQxMDEwMicpe1xuICAgICBcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLnJldmVyc2VFZGdlKHBhcmFtLmVkZ2UpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTAzXCIgfHwgZXJyb3JDb2RlID09ICdwZDEwMTA3Jyl7XG5cbiAgICAgIHBhcmFtLm5ld05vZGVzLmZvckVhY2goZnVuY3Rpb24obmV3Tm9kZSl7ICAgIFxuICAgICAgICBjeS5yZW1vdmUoY3kuJCgnIycrbmV3Tm9kZS5pZCkpICAgICAgXG4gICAgICAgIFxuICAgICAgfSk7XG5cbiAgICAgIHBhcmFtLm5vZGUucmVzdG9yZSgpO1xuXG4gICAgICBwYXJhbS5vbGRFZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKG9sZEVkZ2UpeyAgXG4gICAgICAgIG9sZEVkZ2UucmVzdG9yZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIGN5LmFuaW1hdGUoe1xuICAgICAgICBkdXJhdGlvbjogMTAwLFxuICAgICAgICBlYXNpbmc6ICdlYXNlJyxcbiAgICAgICAgZml0IDp7ZWxlczp7fSxwYWRkaW5nOjIwfSwgXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBwYXJhbTtcblxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDVcIiB8fCBlcnJvckNvZGUgPT0gJ3BkMTAxMDYnKXsgIFxuXG4gICAgICByZXN1bHQuZWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMucmV2ZXJzZUVkZ2UocGFyYW0uZWRnZSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDE0MFwiKXtcbiAgICAgIHBhcmFtLm5vZGUucmVzdG9yZSgpO1xuICAgICAgY3kuYW5pbWF0ZSh7XG4gICAgICAgIGR1cmF0aW9uOiAxMDAsXG4gICAgICAgIGVhc2luZzogJ2Vhc2UnLFxuICAgICAgICBmaXQgOntlbGVzOnt9LHBhZGRpbmc6MjB9LCBcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA0XCIpIHtcbiAgICAgIFxuICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgbm9kZS5yZXN0b3JlKCk7XG4gICAgICB9KTtcbiAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGFyYW07XG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwOFwiKXtcbiAgICAgIFxuICAgICAgcGFyYW0ubm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgbm9kZS5yZXN0b3JlKCk7XG4gICAgICB9KTtcbiAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGFyYW07XG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDExMVwiKXtcbiAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGFyYW07XG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEyNlwiKXtcbiAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XG4gICAgICAgIG5vZGUucmVzdG9yZSgpO1xuICAgICAgfSk7XG4gICAgICBwYXJhbS5lZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2Upe1xuICAgICAgICBlZGdlLnJlc3RvcmUoKTtcbiAgICAgIH0pOyAgICAgICBcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA5XCIgfHwgZXJyb3JDb2RlID09IFwicGQxMDEyNFwiKSB7XG5cbiAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLnNvdXJjZSgpLmlkKCk7XG4gICAgICByZXN1bHQubmV3VGFyZ2V0ID0gcGFyYW0uZWRnZS50YXJnZXQoKS5pZCgpO1xuICAgICAgcmVzdWx0LnBvcnRzb3VyY2UgPSBwYXJhbS5wb3J0c291cmNlO1xuICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLm1vdmUoe1xuICAgICAgICB0YXJnZXQ6IHBhcmFtLm5ld1RhcmdldCxcbiAgICAgICAgc291cmNlIDogcGFyYW0ubmV3U291cmNlICAgICAgXG4gICAgICB9KTtcblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHJlc3VsdC5lZGdlLCAncG9ydHNvdXJjZScsIHBhcmFtLnBvcnRzb3VyY2UpOyBcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDExMlwiKSB7XG4gICAgIFxuICAgICAgLy8gSWYgdGhpcyBpcyBmaXJzdCB0aW1lIHdlIHNob3VsZCBtb3ZlIHRoZSBub2RlIHRvIGl0cyBuZXcgcGFyZW50IGFuZCByZWxvY2F0ZSBpdCBieSBnaXZlbiBwb3NEaWZmIHBhcmFtc1xuICAgICAgLy8gZWxzZSB3ZSBzaG91bGQgcmVtb3ZlIHRoZSBtb3ZlZCBlbGVzIGFuZCByZXN0b3JlIHRoZSBlbGVzIHRvIHJlc3RvcmVcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcbiAgICAgICAgdmFyIG5ld1BhcmVudElkID0gcGFyYW0ucGFyZW50RGF0YSA9PSB1bmRlZmluZWQgPyBudWxsIDogcGFyYW0ucGFyZW50RGF0YTtcbiAgICAgICAgLy8gVGhlc2UgZWxlcyBpbmNsdWRlcyB0aGUgbm9kZXMgYW5kIHRoZWlyIGNvbm5lY3RlZCBlZGdlcyBhbmQgd2lsbCBiZSByZW1vdmVkIGluIG5vZGVzLm1vdmUoKS5cbiAgICAgICAgLy8gVGhleSBzaG91bGQgYmUgcmVzdG9yZWQgaW4gdW5kb1xuICAgICAgICB2YXIgd2l0aERlc2NlbmRhbnQgPSBwYXJhbS5ub2Rlcy51bmlvbihwYXJhbS5ub2Rlcy5kZXNjZW5kYW50cygpKTtcbiAgICAgICAgcmVzdWx0LmVsZXNUb1Jlc3RvcmUgPSB3aXRoRGVzY2VuZGFudC51bmlvbih3aXRoRGVzY2VuZGFudC5jb25uZWN0ZWRFZGdlcygpKTtcbiAgICAgICAgLy8gVGhlc2UgYXJlIHRoZSBlbGVzIGNyZWF0ZWQgYnkgbm9kZXMubW92ZSgpLCB0aGV5IHNob3VsZCBiZSByZW1vdmVkIGluIHVuZG8uXG4gICAgICAgIHJlc3VsdC5tb3ZlZEVsZXMgPSBwYXJhbS5ub2Rlcy5tb3ZlKHtcInBhcmVudFwiOiBuZXdQYXJlbnRJZH0pO1xuXG4gICAgICAgIHZhciBwb3NEaWZmID0ge1xuICAgICAgICAgIHg6IHBhcmFtLnBvc0RpZmZYLFxuICAgICAgICAgIHk6IHBhcmFtLnBvc0RpZmZZXG4gICAgICAgIH07XG5cbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5tb3ZlTm9kZXMocG9zRGlmZiwgcmVzdWx0Lm1vdmVkRWxlcyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0LmVsZXNUb1Jlc3RvcmUgPSBwYXJhbS5tb3ZlZEVsZXMucmVtb3ZlKCk7XG4gICAgICAgIHJlc3VsdC5tb3ZlZEVsZXMgPSBwYXJhbS5lbGVzVG9SZXN0b3JlLnJlc3RvcmUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhcmFtLmNhbGxiYWNrKSB7XG4gICAgICAgIHJlc3VsdC5jYWxsYmFjayA9IHBhcmFtLmNhbGxiYWNrOyAvLyBrZWVwIHRoZSBwcm92aWRlZCBjYWxsYmFjayBzbyBpdCBjYW4gYmUgcmV1c2VkIGFmdGVyIHVuZG8vcmVkb1xuICAgICAgICBwYXJhbS5jYWxsYmFjayhyZXN1bHQubW92ZWRFbGVzKTsgLy8gYXBwbHkgdGhlIGNhbGxiYWNrIG9uIG5ld2x5IGNyZWF0ZWQgZWxlbWVudHNcbiAgICAgIH1cblxuICAgICBcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTI1XCIpIHtcblxuICAgICAgY3kuJCgnIycrcGFyYW0ubmV3RWRnZS5pZCkucmVtb3ZlKCk7XG4gICAgICBwYXJhbS5lZGdlID0gcGFyYW0uZWRnZS5yZXN0b3JlKCk7XG5cbiAgICBcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgIFxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxNDJcIikge1xuICAgICAgY3kuJCgnIycrcGFyYW0ubmV3RWRnZS5pZCkucmVtb3ZlKCk7XG4gICAgICBwYXJhbS5lZGdlID0gcGFyYW0uZWRnZS5yZXN0b3JlKCk7XG5cbiAgICBcbiAgICAgIHJldHVybiBwYXJhbTtcbiAgICB9ZWxzZSB7XG5cbiAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLnNvdXJjZSgpLmlkKCk7XG4gICAgICByZXN1bHQubmV3VGFyZ2V0ID0gcGFyYW0uZWRnZS50YXJnZXQoKS5pZCgpO1xuICAgICAgcmVzdWx0LnBvcnR0YXJnZXQgPSBwYXJhbS5lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpO1xuICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLm1vdmUoe1xuICAgICAgICB0YXJnZXQ6IHBhcmFtLm5ld1RhcmdldCxcbiAgICAgICAgc291cmNlIDogcGFyYW0ubmV3U291cmNlICAgICAgXG4gICAgICB9KTtcblxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHJlc3VsdC5lZGdlLCAncG9ydHRhcmdldCcsIHBhcmFtLnBvcnR0YXJnZXQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgICAgXG4gICAgfVxuICAgIFxuICB9XG5cbiAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2xvbmVIaWdoRGVncmVlTm9kZSA9IGZ1bmN0aW9uKG5vZGUpe1xuXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBvbGRYID0gbm9kZS5wb3NpdGlvbigpLng7XG4gICAgdmFyIG9sZFkgPSBub2RlLnBvc2l0aW9uKCkueTtcbiAgICBcbiAgICBcbiAgICB2YXIgY2xhY3VsYXRlTmV3Q2xvbmVQb3NpdGlvbiA9IGZ1bmN0aW9uKHNvdXJjZUVuZFBvaW50WCxzb3VyY2VFbmRQb2ludFksdGFyZ2V0RW5kUG9pbnRYLHRhcmdldEVuZFBvaW50WSxkZXNpcmVkRGlzdGFuY2UsZGlyZWN0aW9uKXtcbiAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh0YXJnZXRFbmRQb2ludFktc291cmNlRW5kUG9pbnRZLDIpKyBNYXRoLnBvdyh0YXJnZXRFbmRQb2ludFgtc291cmNlRW5kUG9pbnRYLDIpKTtcbiAgICAgIHZhciByYXRpbyA9IGRlc2lyZWREaXN0YW5jZS9kaXN0YW5jZTtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGlmKGRpcmVjdGlvbiA9PSBcInNvdXJjZVwiKXsgXG4gICAgICAgIHJlc3VsdC5jeCA9ICgoMS1yYXRpbykgKiBzb3VyY2VFbmRQb2ludFgpICArIChyYXRpbyAqIHRhcmdldEVuZFBvaW50WCk7XG4gICAgICAgIHJlc3VsdC5jeSA9ICgoMS1yYXRpbykgKiBzb3VyY2VFbmRQb2ludFkpICArIChyYXRpbyAqIHRhcmdldEVuZFBvaW50WSk7XG4gICAgICB9ZWxzZXsgICAgICBcbiAgICAgICAgcmVzdWx0LmN4ID0gKCgxLXJhdGlvKSAqIHRhcmdldEVuZFBvaW50WCkgICsgKHJhdGlvICogc291cmNlRW5kUG9pbnRYKTtcbiAgICAgICAgcmVzdWx0LmN5ID0gKCgxLXJhdGlvKSAqIHRhcmdldEVuZFBvaW50WSkgICsgKHJhdGlvICogc291cmNlRW5kUG9pbnRZKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9OyAgIFxuICAgIHZhciBlZGdlcyA9IG5vZGUuY29ubmVjdGVkRWRnZXMoKTtcbiAgICB2YXIgZGVzaXJlZERpc3RhbmNlID0gKG5vZGUuaGVpZ2h0KCkgPiBub2RlLndpZHRoKCk/IG5vZGUuaGVpZ2h0KCk6IG5vZGUud2lkdGgoKSkqIDAuMTtcbiAgICBmb3IodmFyIGkgPSAxIDsgaSA8IGVkZ2VzLmxlbmd0aCA7IGkrKyl7XG4gICAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gaTtcbiAgICAgIHZhciBlZGdlQ2xvbmUgPSBlZGdlLmNsb25lKCk7XG4gICAgICB2YXIgc3RhcnRQb3NpdGlvbiA9IGVkZ2Uuc291cmNlKCkuaWQoKSA9PSBub2RlLmlkKCkgPyBcInNvdXJjZVwiIDogXCJ0YXJnZXRcIjsgICAgXG4gICAgICB2YXIgbmV3UG9zaXRpb24gPSBjbGFjdWxhdGVOZXdDbG9uZVBvc2l0aW9uKGVkZ2Uuc291cmNlRW5kcG9pbnQoKS54LGVkZ2Uuc291cmNlRW5kcG9pbnQoKS55LGVkZ2UudGFyZ2V0RW5kcG9pbnQoKS54LGVkZ2UudGFyZ2V0RW5kcG9pbnQoKS55LGRlc2lyZWREaXN0YW5jZSxzdGFydFBvc2l0aW9uKTsgXG4gICAgICB2YXIgbmV3Tm9kZUlkID0gbm9kZS5pZCgpKydjbG9uZS0nK2luZGV4O1xuICAgICAgLy9lZGdlQ2xvbmUuZGF0YSgpLmlkID0gZWRnZUNsb25lLmRhdGEoKS5pZCsgXCItXCIrbmV3Tm9kZUlkO1xuICAgICAgaWYoZWRnZS5zb3VyY2UoKS5pZCgpID09IG5vZGUuaWQoKSl7ICAgICAgICBcbiAgICAgICAgZWRnZUNsb25lLmRhdGEoKS5zb3VyY2UgPSBuZXdOb2RlSWQ7XG4gICAgICAgIGVkZ2VDbG9uZS5kYXRhKCkucG9ydHNvdXJjZSA9IG5ld05vZGVJZDsgICAgXG4gICAgICB9ZWxzZXtcbiAgICAgICAgICBcbiAgICAgICAgZWRnZUNsb25lLmRhdGEoKS50YXJnZXQgPSBuZXdOb2RlSWQ7XG4gICAgICAgIGVkZ2VDbG9uZS5kYXRhKCkucG9ydHRhcmdldCA9IG5ld05vZGVJZDsgICAgXG4gICAgICB9XG4gICAgICB2YXIgbmV3Tm9kZSA9IG5vZGUuY2xvbmUoKTtcbiAgICAgIG5ld05vZGUuZGF0YSgpLmlkID0gbmV3Tm9kZUlkO1xuICAgICAgY3kuYWRkKG5ld05vZGUpO1xuICAgICBcbiAgICAgIGVkZ2UucmVtb3ZlKCk7XG4gICAgICBjeS5hZGQoZWRnZUNsb25lKTtcbiAgICAgIG5ld05vZGUucG9zaXRpb24oe1xuICAgICAgICB4OiBuZXdQb3NpdGlvbi5jeCxcbiAgICAgICAgeTogbmV3UG9zaXRpb24uY3lcbiAgICAgIH0pO1xuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhuZXdOb2RlLCB0cnVlKTtcbiAgICAgIFxuICAgIH0gIFxuICAgIFxuICAgIHZhciBuZXdQb3NpdGlvbiA9IGNsYWN1bGF0ZU5ld0Nsb25lUG9zaXRpb24oXG4gICAgICBlZGdlc1swXS5zb3VyY2VFbmRwb2ludCgpLngsXG4gICAgICBlZGdlc1swXS5zb3VyY2VFbmRwb2ludCgpLnksXG4gICAgICBlZGdlc1swXS50YXJnZXRFbmRwb2ludCgpLngsXG4gICAgICBlZGdlc1swXS50YXJnZXRFbmRwb2ludCgpLnksXG4gICAgICBkZXNpcmVkRGlzdGFuY2UsZWRnZXNbMF0uc291cmNlKCkuaWQoKSA9PSBub2RlLmlkKCkgPyBcInNvdXJjZVwiIDogXCJ0YXJnZXRcIlxuICAgICAgKTtcbiAgXG4gICAgdmFyIGNsb25lRWRnZSA9IGVkZ2VzWzBdLmNsb25lKCk7XG4gICAgLy9jbG9uZUVkZ2UuZGF0YSgpLmlkID0gY2xvbmVFZGdlLmRhdGEoKS5pZCsgXCItXCIrbm9kZS5pZCgpKydjbG9uZS0wJztcbiAgICBcbiAgICBlZGdlc1swXS5yZW1vdmUoKTtcbiAgICBjeS5hZGQoY2xvbmVFZGdlKTtcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGUsdHJ1ZSk7XG4gICAgbm9kZS5wb3NpdGlvbih7XG4gICAgICB4OiBuZXdQb3NpdGlvbi5jeCxcbiAgICAgIHk6IG5ld1Bvc2l0aW9uLmN5XG4gICAgfSk7XG4gIFxuICAgIHJlc3VsdC5vbGRYID0gb2xkWDsgICAgXG4gICAgcmVzdWx0Lm9sZFkgPSBvbGRZO1xuICAgIHJlc3VsdC5ub2RlID0gbm9kZTtcbiAgICByZXN1bHQubnVtYmVyT2ZFZGdlcyA9IGVkZ2VzLmxlbmd0aDtcbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIH1cblxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bkNsb25lSGlnaERlZ3JlZU5vZGUgPSBmdW5jdGlvbihwYXJhbSl7XG5cbiAgICB2YXIgbm9kZSA9IHBhcmFtLm5vZGU7XG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyhub2RlLGZhbHNlKTtcbiAgICBub2RlLnBvc2l0aW9uKHtcbiAgICAgIHg6IHBhcmFtLm9sZFgsXG4gICAgICB5OiBwYXJhbS5vbGRZXG4gICAgfSk7XG4gIFxuICAgIGZvcih2YXIgaSA9IDEgOyBpIDwgcGFyYW0ubnVtYmVyT2ZFZGdlcyA7IGkrKyl7XG4gICAgICB2YXIgY2xvbmVJZCA9IG5vZGUuaWQoKSsnY2xvbmUtJytpO1xuICAgICAgdmFyIGNsb25lID0gY3kuJChcIiNcIitjbG9uZUlkKTtcbiAgICAgIHZhciBjbG9uZUVkZ2UgPSBjbG9uZS5jb25uZWN0ZWRFZGdlcygpWzBdO1xuICAgICAgdmFyIGVkZ2UgPSBjbG9uZUVkZ2UuY2xvbmUoKTtcbiAgICAgIFxuICAgIFxuICAgICAgaWYoZWRnZS5kYXRhKCkuc291cmNlID09IGNsb25lSWQpeyAgICAgICAgXG4gICAgICAgIGVkZ2UuZGF0YSgpLnNvdXJjZSA9IG5vZGUuaWQoKTtcbiAgICAgICAgZWRnZS5kYXRhKCkucG9ydHNvdXJjZSA9ICBub2RlLmlkKCk7ICAgIFxuICAgICAgfWVsc2V7ICAgICAgICAgIFxuICAgICAgICBlZGdlLmRhdGEoKS50YXJnZXQgPSAgbm9kZS5pZCgpO1xuICAgICAgICBlZGdlLmRhdGEoKS5wb3J0dGFyZ2V0ID0gIG5vZGUuaWQoKTsgICAgXG4gICAgICB9XG5cbiAgICAgIGNsb25lRWRnZS5yZW1vdmUoKTtcbiAgICAgIGNsb25lLnJlbW92ZSgpO1xuICAgICAgXG4gICAgICBjeS5hZGQoZWRnZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VNYXBUeXBlID0gZnVuY3Rpb24ocGFyYW0pe1xuICAgIHZhciByZXN1bHQgPXt9O1xuICAgIHZhciBjdXJyZW50TWFwVHlwZSA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpO1xuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShwYXJhbS5tYXBUeXBlKTtcbiAgICByZXN1bHQubWFwVHlwZSA9IGN1cnJlbnRNYXBUeXBlO1xuICAgIHJlc3VsdC5jYWxsYmFjayA9IHBhcmFtLmNhbGxiYWNrO1xuICAgIHBhcmFtLmNhbGxiYWNrKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIH1cblxuICByZXR1cm4gdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNFeHRlbmRlcjtcbn07XG4iXX0=
