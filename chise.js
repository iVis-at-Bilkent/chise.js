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

      var w = node.data('bbox').w;
      var h = node.data('bbox').h;

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
            }else{
              var previousInfoBbox = {x : 0, w:0};
              if(unitLayout.units.length > 1){
                previousInfoBbox= unitLayout.units[unitLayout.units.length-2].bbox;      
              }

              
              
              sbgnvizInstance.classes.AuxUnitLayout.setIdealGap(node, box.anchorSide);
              var idealGap = sbgnvizInstance.classes.AuxUnitLayout.getCurrentGap(box.anchorSide);
              var newPosition = previousInfoBbox.x + (previousInfoBbox.w/2 + idealGap + box.bbox.w/2)*100 / (node.outerWidth() - borderWidth);
              box.bbox.x = newPosition;
              
            }
           
           
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

//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzZXF1YWwvaW5kZXguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdXRpbGl0aWVzL2VsZW1lbnQtdXRpbGl0aWVzLWV4dGVuZGVyLWZhY3RvcnkuanMiLCJzcmMvdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMuanMiLCJzcmMvdXRpbGl0aWVzL21haW4tdXRpbGl0aWVzLWZhY3RvcnkuanMiLCJzcmMvdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvc2JnbnZpei1pbnN0YW5jZS11dGlsaXRpZXMtZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvdG9wb2xvZ3ktZ3JvdXBpbmctZmFjdG9yeS5qcyIsInNyYy91dGlsaXRpZXMvdXItYWN0aW9uLWZ1bmN0aW9ucy1leHRlbmRlci1mYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeHpEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXJDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIExvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IEpTIEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcy5mb3VuZGF0aW9uLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZpbHRlcmAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheUZpbHRlcihhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBcHBlbmRzIHRoZSBlbGVtZW50cyBvZiBgdmFsdWVzYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gYXBwZW5kLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5UHVzaChhcnJheSwgdmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIG9mZnNldCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W29mZnNldCArIGluZGV4XSA9IHZhbHVlc1tpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5zb21lYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTb21lKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgYGNhY2hlYCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgVGhlIGNhY2hlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGNhY2hlSGFzKGNhY2hlLCBrZXkpIHtcbiAgcmV0dXJuIGNhY2hlLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgbWFwYCB0byBpdHMga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUga2V5LXZhbHVlIHBhaXJzLlxuICovXG5mdW5jdGlvbiBtYXBUb0FycmF5KG1hcCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG1hcC5zaXplKTtcblxuICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW2tleSwgdmFsdWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLFxuICAgIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBTeW1ib2wgPSByb290LlN5bWJvbCxcbiAgICBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5LFxuICAgIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGUsXG4gICAgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2UsXG4gICAgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcbiAgICBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZCxcbiAgICBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpLFxuICAgIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyksXG4gICAgUHJvbWlzZSA9IGdldE5hdGl2ZShyb290LCAnUHJvbWlzZScpLFxuICAgIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0JyksXG4gICAgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpLFxuICAgIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy4gKi9cbnZhciBkYXRhVmlld0N0b3JTdHJpbmcgPSB0b1NvdXJjZShEYXRhVmlldyksXG4gICAgbWFwQ3RvclN0cmluZyA9IHRvU291cmNlKE1hcCksXG4gICAgcHJvbWlzZUN0b3JTdHJpbmcgPSB0b1NvdXJjZShQcm9taXNlKSxcbiAgICBzZXRDdG9yU3RyaW5nID0gdG9Tb3VyY2UoU2V0KSxcbiAgICB3ZWFrTWFwQ3RvclN0cmluZyA9IHRvU291cmNlKFdlYWtNYXApO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuc2l6ZSA9IDA7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxuLyoqXG4gKlxuICogQ3JlYXRlcyBhbiBhcnJheSBjYWNoZSBvYmplY3QgdG8gc3RvcmUgdW5pcXVlIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTZXRDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPT0gbnVsbCA/IDAgOiB2YWx1ZXMubGVuZ3RoO1xuXG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGU7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdGhpcy5hZGQodmFsdWVzW2luZGV4XSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBZGRzIGB2YWx1ZWAgdG8gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBhZGRcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQGFsaWFzIHB1c2hcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNhY2hlLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlQWRkKHZhbHVlKSB7XG4gIHRoaXMuX19kYXRhX18uc2V0KHZhbHVlLCBIQVNIX1VOREVGSU5FRCk7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGluIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlSGFzKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyh2YWx1ZSk7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTZXRDYWNoZWAuXG5TZXRDYWNoZS5wcm90b3R5cGUuYWRkID0gU2V0Q2FjaGUucHJvdG90eXBlLnB1c2ggPSBzZXRDYWNoZUFkZDtcblNldENhY2hlLnByb3RvdHlwZS5oYXMgPSBzZXRDYWNoZUhhcztcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFN0YWNrYC5cblN0YWNrLnByb3RvdHlwZS5jbGVhciA9IHN0YWNrQ2xlYXI7XG5TdGFjay5wcm90b3R5cGVbJ2RlbGV0ZSddID0gc3RhY2tEZWxldGU7XG5TdGFjay5wcm90b3R5cGUuZ2V0ID0gc3RhY2tHZXQ7XG5TdGFjay5wcm90b3R5cGUuaGFzID0gc3RhY2tIYXM7XG5TdGFjay5wcm90b3R5cGUuc2V0ID0gc3RhY2tTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNFcXVhbGAgd2hpY2ggc3VwcG9ydHMgcGFydGlhbCBjb21wYXJpc29uc1xuICogYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuXG4gKiAgMSAtIFVub3JkZXJlZCBjb21wYXJpc29uXG4gKiAgMiAtIFBhcnRpYWwgY29tcGFyaXNvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKHZhbHVlID09PSBvdGhlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IG90aGVyID09IG51bGwgfHwgKCFpc09iamVjdExpa2UodmFsdWUpICYmICFpc09iamVjdExpa2Uob3RoZXIpKSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyO1xuICB9XG4gIHJldHVybiBiYXNlSXNFcXVhbERlZXAodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBiYXNlSXNFcXVhbCwgc3RhY2spO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgY29tcGFyZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsRGVlcChvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBvYmpJc0FyciA9IGlzQXJyYXkob2JqZWN0KSxcbiAgICAgIG90aElzQXJyID0gaXNBcnJheShvdGhlciksXG4gICAgICBvYmpUYWcgPSBvYmpJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG9iamVjdCksXG4gICAgICBvdGhUYWcgPSBvdGhJc0FyciA/IGFycmF5VGFnIDogZ2V0VGFnKG90aGVyKTtcblxuICBvYmpUYWcgPSBvYmpUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG9ialRhZztcbiAgb3RoVGFnID0gb3RoVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvdGhUYWc7XG5cbiAgdmFyIG9iaklzT2JqID0gb2JqVGFnID09IG9iamVjdFRhZyxcbiAgICAgIG90aElzT2JqID0gb3RoVGFnID09IG9iamVjdFRhZyxcbiAgICAgIGlzU2FtZVRhZyA9IG9ialRhZyA9PSBvdGhUYWc7XG5cbiAgaWYgKGlzU2FtZVRhZyAmJiBpc0J1ZmZlcihvYmplY3QpKSB7XG4gICAgaWYgKCFpc0J1ZmZlcihvdGhlcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgb2JqSXNBcnIgPSB0cnVlO1xuICAgIG9iaklzT2JqID0gZmFsc2U7XG4gIH1cbiAgaWYgKGlzU2FtZVRhZyAmJiAhb2JqSXNPYmopIHtcbiAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgIHJldHVybiAob2JqSXNBcnIgfHwgaXNUeXBlZEFycmF5KG9iamVjdCkpXG4gICAgICA/IGVxdWFsQXJyYXlzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spXG4gICAgICA6IGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgfVxuICBpZiAoIShiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcpKSB7XG4gICAgdmFyIG9iaklzV3JhcHBlZCA9IG9iaklzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgb3RoSXNXcmFwcGVkID0gb3RoSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICBpZiAob2JqSXNXcmFwcGVkIHx8IG90aElzV3JhcHBlZCkge1xuICAgICAgdmFyIG9ialVud3JhcHBlZCA9IG9iaklzV3JhcHBlZCA/IG9iamVjdC52YWx1ZSgpIDogb2JqZWN0LFxuICAgICAgICAgIG90aFVud3JhcHBlZCA9IG90aElzV3JhcHBlZCA/IG90aGVyLnZhbHVlKCkgOiBvdGhlcjtcblxuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIHJldHVybiBlcXVhbEZ1bmMob2JqVW53cmFwcGVkLCBvdGhVbndyYXBwZWQsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFpc1NhbWVUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgcmV0dXJuIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBhcnJheXMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7QXJyYXl9IG90aGVyIFRoZSBvdGhlciBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgYXJyYXlgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFycmF5cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEFycmF5cyhhcnJheSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIGFyckxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIG90aExlbmd0aCA9IG90aGVyLmxlbmd0aDtcblxuICBpZiAoYXJyTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhKGlzUGFydGlhbCAmJiBvdGhMZW5ndGggPiBhcnJMZW5ndGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQoYXJyYXkpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSB0cnVlLFxuICAgICAgc2VlbiA9IChiaXRtYXNrICYgQ09NUEFSRV9VTk9SREVSRURfRkxBRykgPyBuZXcgU2V0Q2FjaGUgOiB1bmRlZmluZWQ7XG5cbiAgc3RhY2suc2V0KGFycmF5LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgYXJyYXkpO1xuXG4gIC8vIElnbm9yZSBub24taW5kZXggcHJvcGVydGllcy5cbiAgd2hpbGUgKCsraW5kZXggPCBhcnJMZW5ndGgpIHtcbiAgICB2YXIgYXJyVmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJbaW5kZXhdO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIGFyclZhbHVlLCBpbmRleCwgb3RoZXIsIGFycmF5LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKGFyclZhbHVlLCBvdGhWYWx1ZSwgaW5kZXgsIGFycmF5LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICBpZiAoY29tcGFyZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGNvbXBhcmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoc2Vlbikge1xuICAgICAgaWYgKCFhcnJheVNvbWUob3RoZXIsIGZ1bmN0aW9uKG90aFZhbHVlLCBvdGhJbmRleCkge1xuICAgICAgICAgICAgaWYgKCFjYWNoZUhhcyhzZWVuLCBvdGhJbmRleCkgJiZcbiAgICAgICAgICAgICAgICAoYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlZW4ucHVzaChvdGhJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIShcbiAgICAgICAgICBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHxcbiAgICAgICAgICAgIGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKVxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10oYXJyYXkpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgY29tcGFyaW5nIG9iamVjdHMgb2ZcbiAqIHRoZSBzYW1lIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjb21wYXJpbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdHMgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIHRhZywgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgZGF0YVZpZXdUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgKG9iamVjdC5ieXRlT2Zmc2V0ICE9IG90aGVyLmJ5dGVPZmZzZXQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG9iamVjdCA9IG9iamVjdC5idWZmZXI7XG4gICAgICBvdGhlciA9IG90aGVyLmJ1ZmZlcjtcblxuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgIWVxdWFsRnVuYyhuZXcgVWludDhBcnJheShvYmplY3QpLCBuZXcgVWludDhBcnJheShvdGhlcikpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICAgIC8vIENvZXJjZSBib29sZWFucyB0byBgMWAgb3IgYDBgIGFuZCBkYXRlcyB0byBtaWxsaXNlY29uZHMuXG4gICAgICAvLyBJbnZhbGlkIGRhdGVzIGFyZSBjb2VyY2VkIHRvIGBOYU5gLlxuICAgICAgcmV0dXJuIGVxKCtvYmplY3QsICtvdGhlcik7XG5cbiAgICBjYXNlIGVycm9yVGFnOlxuICAgICAgcmV0dXJuIG9iamVjdC5uYW1lID09IG90aGVyLm5hbWUgJiYgb2JqZWN0Lm1lc3NhZ2UgPT0gb3RoZXIubWVzc2FnZTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgLy8gQ29lcmNlIHJlZ2V4ZXMgdG8gc3RyaW5ncyBhbmQgdHJlYXQgc3RyaW5ncywgcHJpbWl0aXZlcyBhbmQgb2JqZWN0cyxcbiAgICAgIC8vIGFzIGVxdWFsLiBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXJlZ2V4cC5wcm90b3R5cGUudG9zdHJpbmdcbiAgICAgIC8vIGZvciBtb3JlIGRldGFpbHMuXG4gICAgICByZXR1cm4gb2JqZWN0ID09IChvdGhlciArICcnKTtcblxuICAgIGNhc2UgbWFwVGFnOlxuICAgICAgdmFyIGNvbnZlcnQgPSBtYXBUb0FycmF5O1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHO1xuICAgICAgY29udmVydCB8fCAoY29udmVydCA9IHNldFRvQXJyYXkpO1xuXG4gICAgICBpZiAob2JqZWN0LnNpemUgIT0gb3RoZXIuc2l6ZSAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgICAgIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gICAgICBpZiAoc3RhY2tlZCkge1xuICAgICAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgICAgIH1cbiAgICAgIGJpdG1hc2sgfD0gQ09NUEFSRV9VTk9SREVSRURfRkxBRztcblxuICAgICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gICAgICB2YXIgcmVzdWx0ID0gZXF1YWxBcnJheXMoY29udmVydChvYmplY3QpLCBjb252ZXJ0KG90aGVyKSwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG4gICAgICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIGlmIChzeW1ib2xWYWx1ZU9mKSB7XG4gICAgICAgIHJldHVybiBzeW1ib2xWYWx1ZU9mLmNhbGwob2JqZWN0KSA9PSBzeW1ib2xWYWx1ZU9mLmNhbGwob3RoZXIpO1xuICAgICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIG9iamVjdHMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIG9ialByb3BzID0gZ2V0QWxsS2V5cyhvYmplY3QpLFxuICAgICAgb2JqTGVuZ3RoID0gb2JqUHJvcHMubGVuZ3RoLFxuICAgICAgb3RoUHJvcHMgPSBnZXRBbGxLZXlzKG90aGVyKSxcbiAgICAgIG90aExlbmd0aCA9IG90aFByb3BzLmxlbmd0aDtcblxuICBpZiAob2JqTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBpbmRleCA9IG9iakxlbmd0aDtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIGlmICghKGlzUGFydGlhbCA/IGtleSBpbiBvdGhlciA6IGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsIGtleSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciByZXN1bHQgPSB0cnVlO1xuICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgb2JqZWN0KTtcblxuICB2YXIgc2tpcEN0b3IgPSBpc1BhcnRpYWw7XG4gIHdoaWxlICgrK2luZGV4IDwgb2JqTGVuZ3RoKSB7XG4gICAga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2tleV07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgb2JqVmFsdWUsIGtleSwgb3RoZXIsIG9iamVjdCwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihvYmpWYWx1ZSwgb3RoVmFsdWUsIGtleSwgb2JqZWN0LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoIShjb21wYXJlZCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyAob2JqVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhvYmpWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSlcbiAgICAgICAgICA6IGNvbXBhcmVkXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHNraXBDdG9yIHx8IChza2lwQ3RvciA9IGtleSA9PSAnY29uc3RydWN0b3InKTtcbiAgfVxuICBpZiAocmVzdWx0ICYmICFza2lwQ3Rvcikge1xuICAgIHZhciBvYmpDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgICBvdGhDdG9yID0gb3RoZXIuY29uc3RydWN0b3I7XG5cbiAgICAvLyBOb24gYE9iamVjdGAgb2JqZWN0IGluc3RhbmNlcyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVhbC5cbiAgICBpZiAob2JqQ3RvciAhPSBvdGhDdG9yICYmXG4gICAgICAgICgnY29uc3RydWN0b3InIGluIG9iamVjdCAmJiAnY29uc3RydWN0b3InIGluIG90aGVyKSAmJlxuICAgICAgICAhKHR5cGVvZiBvYmpDdG9yID09ICdmdW5jdGlvbicgJiYgb2JqQ3RvciBpbnN0YW5jZW9mIG9iakN0b3IgJiZcbiAgICAgICAgICB0eXBlb2Ygb3RoQ3RvciA9PSAnZnVuY3Rpb24nICYmIG90aEN0b3IgaW5zdGFuY2VvZiBvdGhDdG9yKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXMob2JqZWN0KSB7XG4gIHJldHVybiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXMsIGdldFN5bWJvbHMpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGFycmF5RmlsdGVyKG5hdGl2ZUdldFN5bWJvbHMob2JqZWN0KSwgZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgcmV0dXJuIHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBzeW1ib2wpO1xuICB9KTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGRlZXAgY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlXG4gKiBlcXVpdmFsZW50LlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBzdXBwb3J0cyBjb21wYXJpbmcgYXJyYXlzLCBhcnJheSBidWZmZXJzLCBib29sZWFucyxcbiAqIGRhdGUgb2JqZWN0cywgZXJyb3Igb2JqZWN0cywgbWFwcywgbnVtYmVycywgYE9iamVjdGAgb2JqZWN0cywgcmVnZXhlcyxcbiAqIHNldHMsIHN0cmluZ3MsIHN5bWJvbHMsIGFuZCB0eXBlZCBhcnJheXMuIGBPYmplY3RgIG9iamVjdHMgYXJlIGNvbXBhcmVkXG4gKiBieSB0aGVpciBvd24sIG5vdCBpbmhlcml0ZWQsIGVudW1lcmFibGUgcHJvcGVydGllcy4gRnVuY3Rpb25zIGFuZCBET01cbiAqIG5vZGVzIGFyZSBjb21wYXJlZCBieSBzdHJpY3QgZXF1YWxpdHksIGkuZS4gYD09PWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uaXNFcXVhbChvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBvYmplY3QgPT09IG90aGVyO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFcXVhbCh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlcik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYSBuZXcgZW1wdHkgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBlbXB0eSBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIGFycmF5cyA9IF8udGltZXMoMiwgXy5zdHViQXJyYXkpO1xuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5cyk7XG4gKiAvLyA9PiBbW10sIFtdXVxuICpcbiAqIGNvbnNvbGUubG9nKGFycmF5c1swXSA9PT0gYXJyYXlzWzFdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIHN0dWJBcnJheSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFcXVhbDtcbiIsIihmdW5jdGlvbigpe1xyXG4gIHZhciBjaGlzZSA9IGZ1bmN0aW9uKF9vcHRpb25zKSB7XHJcblxyXG4gICAgdmFyIHBhcmFtID0ge307XHJcblxyXG4gICAgLy8gQWNjZXNzIHRoZSBsaWJzXHJcbiAgICB2YXIgbGlicyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcblxyXG4gICAgdmFyIG9wdGlvblV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL29wdGlvbi11dGlsaXRpZXMtZmFjdG9yeScpKCk7XHJcbiAgICB2YXIgb3B0aW9ucyA9IG9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zKF9vcHRpb25zKTsgLy8gRXh0ZW5kcyB0aGUgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIGdpdmVuIG9wdGlvbnNcclxuXHJcbiAgICAvLyBDcmVhdGUgYW4gc2JnbnZpeiBpbnN0YW5jZVxyXG4gICAgdmFyIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL3NiZ252aXotaW5zdGFuY2UtdXRpbGl0aWVzLWZhY3RvcnknKSgpO1xyXG4gICAgdmFyIHNiZ252aXpJbnN0YW5jZSA9IHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcyhvcHRpb25zKTtcclxuXHJcbiAgICAvLyBSZWdpc3RlciB1bmRvL3JlZG8gYWN0aW9uc1xyXG4gICAgdmFyIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvcmVnaXN0ZXItdW5kby1yZWRvLWFjdGlvbnMtZmFjdG9yeScpKCk7XHJcblxyXG4gICAgdmFyIG1haW5VdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9tYWluLXV0aWxpdGllcy1mYWN0b3J5JykoKTtcclxuICAgIHZhciBlbGVtZW50VXRpbGl0aWVzRXh0ZW5kZXIgPSByZXF1aXJlKCcuL3V0aWxpdGllcy9lbGVtZW50LXV0aWxpdGllcy1leHRlbmRlci1mYWN0b3J5JykoKTtcclxuICAgIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc0V4dGVuZGVyID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdXItYWN0aW9uLWZ1bmN0aW9ucy1leHRlbmRlci1mYWN0b3J5JykoKTtcclxuICAgIHZhciBzaWZUb3BvbG9neUdyb3VwaW5nID0gcmVxdWlyZSgnLi91dGlsaXRpZXMvdG9wb2xvZ3ktZ3JvdXBpbmctZmFjdG9yeScpKCk7XHJcblxyXG4gICAgdmFyIGVsZW1lbnRVdGlsaXRpZXMgPSAgc2JnbnZpekluc3RhbmNlLmVsZW1lbnRVdGlsaXRpZXM7XHJcbiAgICB2YXIgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSBzYmdudml6SW5zdGFuY2UudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XHJcblxyXG4gICAgcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzID0gc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzO1xyXG4gICAgcGFyYW0ub3B0aW9uVXRpbGl0aWVzID0gb3B0aW9uVXRpbGl0aWVzO1xyXG4gICAgcGFyYW0uZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XHJcbiAgICBwYXJhbS51bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xyXG4gICAgcGFyYW0uc2lmVG9wb2xvZ3lHcm91cGluZyA9IHNpZlRvcG9sb2d5R3JvdXBpbmc7XHJcblxyXG4gICAgdmFyIHNob3VsZEFwcGx5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBwYXJhbS5lbGVtZW50VXRpbGl0aWVzLm1hcFR5cGUgPT09ICdTSUYnO1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc0V4dGVuZGVyKHBhcmFtKTtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXNFeHRlbmRlcihwYXJhbSk7XHJcbiAgICByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyhwYXJhbSk7XHJcbiAgICBtYWluVXRpbGl0aWVzKHBhcmFtKTtcclxuICAgIHNpZlRvcG9sb2d5R3JvdXBpbmcocGFyYW0sIHttZXRhRWRnZUlkZW50aWZpZXI6ICdzaWYtbWV0YScsIGxvY2tHcmFwaFRvcG9sb2d5OiB0cnVlLCBzaG91bGRBcHBseX0pO1xyXG5cclxuICAgIC8vIEV4cG9zZSB0aGUgYXBpXHJcbiAgICB2YXIgYXBpID0ge307XHJcblxyXG4gICAgLy8gRXhwb3NlIHRoZSBwcm9wZXJ0aWVzIGluaGVyaXRlZCBmcm9tIHNiZ252aXpcclxuICAgIC8vIHRoZW4gb3ZlcnJpZGUgc29tZSBvZiB0aGVzZSBwcm9wZXJ0aWVzIGFuZCBleHBvc2Ugc29tZSBuZXcgcHJvcGVydGllc1xyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBzYmdudml6SW5zdGFuY2UpIHtcclxuICAgICAgYXBpW3Byb3BdID0gc2JnbnZpekluc3RhbmNlW3Byb3BdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEV4cG9zZSBlYWNoIG1haW4gdXRpbGl0eSBzZXBlcmF0ZWx5XHJcbiAgICBmb3IgKHZhciBwcm9wIGluIG1haW5VdGlsaXRpZXMpIHtcclxuICAgICAgYXBpW3Byb3BdID0gbWFpblV0aWxpdGllc1twcm9wXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBFeHBvc2UgZ2V0U2JnbnZpekluc3RhbmNlKClcclxuICAgIGFwaS5nZXRTYmdudml6SW5zdGFuY2UgPSBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0SW5zdGFuY2U7XHJcblxyXG4gICAgLy8gRXhwb3NlIGVsZW1lbnRVdGlsaXRpZXMgYW5kIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zIGFzIGlzXHJcbiAgICBhcGkuZWxlbWVudFV0aWxpdGllcyA9IGVsZW1lbnRVdGlsaXRpZXM7XHJcbiAgICBhcGkudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucztcclxuICAgIGFwaS5zaWZUb3BvbG9neUdyb3VwaW5nID0gc2lmVG9wb2xvZ3lHcm91cGluZztcclxuXHJcbiAgICByZXR1cm4gYXBpO1xyXG4gIH07XHJcblxyXG4gIC8vIFJlZ2lzdGVyIGNoaXNlIHdpdGggZ2l2ZW4gbGlicmFyaWVzXHJcbiAgY2hpc2UucmVnaXN0ZXIgPSBmdW5jdGlvbiAoX2xpYnMpIHtcclxuXHJcbiAgICB2YXIgbGlicyA9IHt9O1xyXG4gICAgbGlicy5qUXVlcnkgPSBfbGlicy5qUXVlcnkgfHwgalF1ZXJ5O1xyXG4gICAgbGlicy5jeXRvc2NhcGUgPSBfbGlicy5jeXRvc2NhcGUgfHwgY3l0b3NjYXBlO1xyXG4gICAgbGlicy5zYmdudml6ID0gX2xpYnMuc2JnbnZpeiB8fCBzYmdudml6O1xyXG4gICAgbGlicy5zYXZlQXMgPSBfbGlicy5maWxlc2F2ZXJqcyA/IF9saWJzLmZpbGVzYXZlcmpzLnNhdmVBcyA6IHNhdmVBcztcclxuXHJcbiAgICBsaWJzLnNiZ252aXoucmVnaXN0ZXIoX2xpYnMpOyAvLyBSZWdpc3RlciBzYmdudml6IHdpdGggdGhlIGdpdmVuIGxpYnNcclxuXHJcbiAgICAvLyBpbmhlcml0IGV4cG9zZWQgc3RhdGljIHByb3BlcnRpZXMgb2Ygc2JnbnZpeiBvdGhlciB0aGFuIHJlZ2lzdGVyXHJcbiAgICBmb3IgKHZhciBwcm9wIGluIGxpYnMuc2JnbnZpeikge1xyXG4gICAgICBpZiAocHJvcCAhPT0gJ3JlZ2lzdGVyJykge1xyXG4gICAgICAgIGNoaXNlW3Byb3BdID0gbGlicy5zYmdudml6W3Byb3BdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2V0IHRoZSBsaWJyYXJpZXMgdG8gYWNjZXNzIHRoZW0gZnJvbSBhbnkgZmlsZVxyXG4gICAgdmFyIGxpYlV0aWxpdGllcyA9IHJlcXVpcmUoJy4vdXRpbGl0aWVzL2xpYi11dGlsaXRpZXMnKTtcclxuICAgIGxpYlV0aWxpdGllcy5zZXRMaWJzKGxpYnMpO1xyXG4gIH07XHJcblxyXG4gIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGNoaXNlO1xyXG4gIH1cclxufSkoKTtcclxuIiwiLy8gRXh0ZW5kcyBzYmdudml6LmVsZW1lbnRVdGlsaXRpZXNcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcbnZhciBqUXVlcnkgPSAkID0gbGlicy5qUXVlcnk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgb3B0aW9ucywgc2JnbnZpekluc3RhbmNlLCBlbGVtZW50VXRpbGl0aWVzLCBjeTtcclxuXHJcbiAgZnVuY3Rpb24gZWxlbWVudFV0aWxpdGllc0V4dGVuZGVyIChwYXJhbSkge1xyXG4gICAgc2JnbnZpekluc3RhbmNlID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEluc3RhbmNlKCk7XHJcbiAgICBvcHRpb25zID0gcGFyYW0ub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMgPSBzYmdudml6SW5zdGFuY2UuZWxlbWVudFV0aWxpdGllcztcclxuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KCk7XHJcblxyXG4gICAgZXh0ZW5kKCk7XHJcblxyXG4gICAgLy8gUmV0dXJuIHRoZSBleHRlbmRlZCBlbGVtZW50VXRpbGl0aWVzXHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcztcclxuICB9XHJcblxyXG4gIC8vIEV4dGVuZHMgZWxlbWVudFV0aWxpdGllcyB3aXRoIGNoaXNlIHNwZWNpZmljIGZhY2lsaXRpZXNcclxuICBmdW5jdGlvbiBleHRlbmQgKCkge1xyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUgPSBmdW5jdGlvbiAoeCwgeSwgbm9kZVBhcmFtcywgaWQsIHBhcmVudCwgdmlzaWJpbGl0eSkge1xyXG4gICAgICBpZiAodHlwZW9mIG5vZGVQYXJhbXMgIT0gJ29iamVjdCcpe1xyXG4gICAgICAgIHZhciBzYmduY2xhc3MgPSBub2RlUGFyYW1zO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFyIHNiZ25jbGFzcyA9IG5vZGVQYXJhbXMuY2xhc3M7XHJcbiAgICAgICAgICB2YXIgbGFuZ3VhZ2UgPSBub2RlUGFyYW1zLmxhbmd1YWdlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY3NzID0ge307XHJcbiAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIHNwZWNpZmljIGRlZmF1bHQgd2lkdGggb3IgaGVpZ2h0IGZvclxyXG4gICAgICAvLyBzYmduY2xhc3MgdGhlc2Ugc2l6ZXMgYXJlIHVzZWRcclxuICAgICAgdmFyIGRlZmF1bHRXaWR0aCA9IDUwO1xyXG4gICAgICB2YXIgZGVmYXVsdEhlaWdodCA9IDUwO1xyXG5cclxuICAgICAgaWYgKHZpc2liaWxpdHkpIHtcclxuICAgICAgICBjc3MudmlzaWJpbGl0eSA9IHZpc2liaWxpdHk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgIGNsYXNzOiBzYmduY2xhc3MsXHJcbiAgICBcdCAgbGFuZ3VhZ2U6IGxhbmd1YWdlLFxyXG4gICAgICAgIGJib3g6IHtcclxuICAgICAgICAgIHc6IGRlZmF1bHRXaWR0aCxcclxuICAgICAgICAgIGg6IGRlZmF1bHRIZWlnaHQsXHJcbiAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgeTogeVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3RhdGVzYW5kaW5mb3M6IFtdLFxyXG4gICAgICAgIHBvcnRzOiBbXVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWYoaWQpIHtcclxuICAgICAgICBkYXRhLmlkID0gaWQ7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgZGF0YS5pZCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2VuZXJhdGVOb2RlSWQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmVudCkge1xyXG4gICAgICAgIGRhdGEucGFyZW50ID0gcGFyZW50O1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmV4dGVuZE5vZGVEYXRhV2l0aENsYXNzRGVmYXVsdHMoIGRhdGEsIHNiZ25jbGFzcyApO1xyXG5cclxuICAgICAgLy8gc29tZSBkZWZhdWx0cyBhcmUgbm90IHNldCBieSBleHRlbmROb2RlRGF0YVdpdGhDbGFzc0RlZmF1bHRzKClcclxuICAgICAgdmFyIGRlZmF1bHRzID0gdGhpcy5nZXREZWZhdWx0UHJvcGVydGllcyggc2JnbmNsYXNzICk7XHJcblxyXG4gICAgICBpZiAoIGRlZmF1bHRzWyAnbXVsdGltZXInIF0gKSB7XHJcbiAgICAgICAgZGF0YS5jbGFzcyArPSAnIG11bHRpbWVyJztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCBkZWZhdWx0c1sgJ2Nsb25lbWFya2VyJyBdICkge1xyXG4gICAgICAgIGRhdGFbICdjbG9uZW1hcmtlcicgXSA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGEuYmJveFsgJ3cnIF0gPSBkZWZhdWx0c1sgJ3dpZHRoJyBdO1xyXG4gICAgICBkYXRhLmJib3hbICdoJyBdID0gZGVmYXVsdHNbICdoZWlnaHQnIF07XHJcblxyXG4gICAgICB2YXIgZWxlcyA9IGN5LmFkZCh7XHJcbiAgICAgICAgZ3JvdXA6IFwibm9kZXNcIixcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIGNzczogY3NzLFxyXG4gICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgeTogeVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB2YXIgbmV3Tm9kZSA9IGVsZXNbZWxlcy5sZW5ndGggLSAxXTtcclxuICAgICAgLy8gR2V0IHRoZSBkZWZhdWx0IHBvcnRzIG9yZGVyaW5nIGZvciB0aGUgbm9kZXMgd2l0aCBnaXZlbiBzYmduY2xhc3NcclxuICAgICAgdmFyIG9yZGVyaW5nID0gZGVmYXVsdHNbJ3BvcnRzLW9yZGVyaW5nJ107XHJcblxyXG4gICAgICAvLyBJZiB0aGVyZSBpcyBhIGRlZmF1bHQgcG9ydHMgb3JkZXJpbmcgZm9yIHRoZSBub2RlcyB3aXRoIGdpdmVuIHNiZ25jbGFzcyBhbmQgaXQgaXMgZGlmZmVyZW50IHRoYW4gJ25vbmUnIHNldCB0aGUgcG9ydHMgb3JkZXJpbmcgdG8gdGhhdCBvcmRlcmluZ1xyXG4gICAgICBpZiAob3JkZXJpbmcgJiYgb3JkZXJpbmcgIT09ICdub25lJykge1xyXG4gICAgICAgIHRoaXMuc2V0UG9ydHNPcmRlcmluZyhuZXdOb2RlLCBvcmRlcmluZyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChsYW5ndWFnZSA9PSBcIkFGXCIgJiYgIWVsZW1lbnRVdGlsaXRpZXMuY2FuSGF2ZU11bHRpcGxlVW5pdE9mSW5mb3JtYXRpb24obmV3Tm9kZSkpe1xyXG4gICAgICAgIGlmIChzYmduY2xhc3MgIT0gXCJCQSBwbGFpblwiKSB7IC8vIGlmIEFGIG5vZGUgY2FuIGhhdmUgbGFiZWwgaS5lOiBub3QgcGxhaW4gYmlvbG9naWNhbCBhY3Rpdml0eVxyXG4gICAgICAgICAgdmFyIHVvaV9vYmogPSB7XHJcbiAgICAgICAgICAgIGNsYXp6OiBcInVuaXQgb2YgaW5mb3JtYXRpb25cIlxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHVvaV9vYmoubGFiZWwgPSB7XHJcbiAgICAgICAgICAgIHRleHQ6IFwiXCJcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdW9pX29iai5iYm94ID0ge1xyXG4gICAgICAgICAgICAgdzogMTIsXHJcbiAgICAgICAgICAgICBoOiAxMlxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkU3RhdGVPckluZm9Cb3gobmV3Tm9kZSwgdW9pX29iaik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBub2RlIGJnIGltYWdlIHdhcyB1bmV4cGVjdGVkbHkgbm90IHJlbmRlcmVkIHVudGlsIGl0IGlzIGNsaWNrZWRcclxuICAgICAgLy8gdXNlIHRoaXMgZGlydHkgaGFjayB1bnRpbCBmaW5kaW5nIGEgc29sdXRpb24gdG8gdGhlIHByb2JsZW1cclxuICAgICAgdmFyIGJnSW1hZ2UgPSBuZXdOb2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKTtcclxuICAgICAgaWYgKCBiZ0ltYWdlICkge1xyXG4gICAgICAgIG5ld05vZGUuZGF0YSggJ2JhY2tncm91bmQtaW1hZ2UnLCBiZ0ltYWdlICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBuZXdOb2RlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvL1NhdmVzIG9sZCBhdXggdW5pdHMgb2YgZ2l2ZW4gbm9kZVxyXG4gICAgZWxlbWVudFV0aWxpdGllcy5zYXZlVW5pdHMgPSBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgIHZhciB0ZW1wRGF0YSA9IFtdO1xyXG4gICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykuZm9yRWFjaCggZnVuY3Rpb24oZWxlKSB7XHJcbiAgICAgICAgdGVtcERhdGEucHVzaCh7XHJcbiAgICAgICAgICB4OiBlbGUuYmJveC54LFxyXG4gICAgICAgICAgeTogZWxlLmJib3gueSxcclxuICAgICAgICAgIGFuY2hvclNpZGU6IGVsZS5hbmNob3JTaWRlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGluZGV4Kys7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gdGVtcERhdGE7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vUmVzdG9yZXMgZnJvbSBnaXZlbiBkYXRhXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc3RvcmVVbml0cyA9IGZ1bmN0aW9uKG5vZGUsIGRhdGEpIHtcclxuICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmZvckVhY2goIGZ1bmN0aW9uKGVsZSkge1xyXG4gICAgICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGVsZS5iYm94LnggPSBkYXRhW2luZGV4XS54O1xyXG4gICAgICAgICAgZWxlLmJib3gueSA9IGRhdGFbaW5kZXhdLnlcclxuICAgICAgICAgIHZhciBhbmNob3JTaWRlID0gZWxlLmFuY2hvclNpZGU7XHJcbiAgICAgICAgICBlbGUuYW5jaG9yU2lkZSA9IGRhdGFbaW5kZXhdLmFuY2hvclNpZGU7XHJcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1vZGlmeVVuaXRzKG5vZGUsIGVsZSwgYW5jaG9yU2lkZSk7XHJcbiAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vTW9kaWZ5IGF1eCB1bml0IGxheW91dHNcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMubW9kaWZ5VW5pdHMgPSBmdW5jdGlvbiAobm9kZSwgZWxlLCBhbmNob3JTaWRlKSB7XHJcbiAgICAgIGluc3RhbmNlLmNsYXNzZXMuQXV4VW5pdExheW91dC5tb2RpZnlVbml0cyhub2RlLCBlbGUsIGFuY2hvclNpZGUsIGN5KTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vRm9yIHJldmVyc2libGUgcmVhY3Rpb25zIGJvdGggc2lkZSBvZiB0aGUgcHJvY2VzcyBjYW4gYmUgaW5wdXQvb3V0cHV0XHJcbiAgICAvL0dyb3VwIElEIGlkZW50aWZpZXMgdG8gd2hpY2ggZ3JvdXAgb2Ygbm9kZXMgdGhlIGVkZ2UgaXMgZ29pbmcgdG8gYmUgY29ubmVjdGVkIGZvciByZXZlcnNpYmxlIHJlYWN0aW9ucygwOiBncm91cCAxIElEIGFuZCAxOmdyb3VwIDIgSUQpXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UgPSBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQsIGVkZ2VQYXJhbXMsIGlkLCB2aXNpYmlsaXR5LCBncm91cElEICkge1xyXG4gICAgICBpZiAodHlwZW9mIGVkZ2VQYXJhbXMgIT0gJ29iamVjdCcpe1xyXG4gICAgICAgIHZhciBzYmduY2xhc3MgPSBlZGdlUGFyYW1zO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFyIHNiZ25jbGFzcyA9IGVkZ2VQYXJhbXMuY2xhc3M7XHJcbiAgICAgICAgICB2YXIgbGFuZ3VhZ2UgPSBlZGdlUGFyYW1zLmxhbmd1YWdlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY3NzID0ge307XHJcblxyXG4gICAgICBpZiAodmlzaWJpbGl0eSkge1xyXG4gICAgICAgIGNzcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcclxuICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxyXG4gICAgICAgICAgY2xhc3M6IHNiZ25jbGFzcyxcclxuICAgICAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHZhciBkZWZhdWx0cyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIHNiZ25jbGFzcyApO1xyXG5cclxuICAgICAgLy8gZXh0ZW5kIHRoZSBkYXRhIHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzIG9mIGVkZ2Ugc3R5bGVcclxuICAgICAgT2JqZWN0LmtleXMoIGRlZmF1bHRzICkuZm9yRWFjaCggZnVuY3Rpb24oIHByb3AgKSB7XHJcbiAgICAgICAgZGF0YVsgcHJvcCBdID0gZGVmYXVsdHNbIHByb3AgXTtcclxuICAgICAgfSApO1xyXG5cclxuICAgICAgaWYoaWQpIHtcclxuICAgICAgICBkYXRhLmlkID0gaWQ7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgZGF0YS5pZCA9IGVsZW1lbnRVdGlsaXRpZXMuZ2VuZXJhdGVFZGdlSWQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoZWxlbWVudFV0aWxpdGllcy5jYW5IYXZlU0JHTkNhcmRpbmFsaXR5KHNiZ25jbGFzcykpe1xyXG4gICAgICAgIGRhdGEuY2FyZGluYWxpdHkgPSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgc291cmNlTm9kZSA9IGN5LmdldEVsZW1lbnRCeUlkKHNvdXJjZSk7IC8vIFRoZSBvcmlnaW5hbCBzb3VyY2Ugbm9kZVxyXG4gICAgICB2YXIgdGFyZ2V0Tm9kZSA9IGN5LmdldEVsZW1lbnRCeUlkKHRhcmdldCk7IC8vIFRoZSBvcmlnaW5hbCB0YXJnZXQgbm9kZVxyXG4gICAgICB2YXIgc291cmNlSGFzUG9ydHMgPSBzb3VyY2VOb2RlLmRhdGEoJ3BvcnRzJykubGVuZ3RoID09PSAyO1xyXG4gICAgICB2YXIgdGFyZ2V0SGFzUG9ydHMgPSB0YXJnZXROb2RlLmRhdGEoJ3BvcnRzJykubGVuZ3RoID09PSAyO1xyXG4gICAgICAvLyBUaGUgcG9ydHNvdXJjZSBhbmQgcG9ydHRhcmdldCB2YXJpYWJsZXNcclxuICAgICAgdmFyIHBvcnRzb3VyY2U7XHJcbiAgICAgIHZhciBwb3J0dGFyZ2V0O1xyXG5cclxuICAgICAgLypcclxuICAgICAgICogR2V0IGlucHV0L291dHB1dCBwb3J0IGlkJ3Mgb2YgYSBub2RlIHdpdGggdGhlIGFzc3VtcHRpb24gdGhhdCB0aGUgbm9kZSBoYXMgdmFsaWQgcG9ydHMuXHJcbiAgICAgICAqL1xyXG4gICAgICB2YXIgZ2V0SU9Qb3J0SWRzID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgICAgICB2YXIgbm9kZUlucHV0UG9ydElkLCBub2RlT3V0cHV0UG9ydElkO1xyXG4gICAgICAgIHZhciBub2RlUG9ydHNPcmRlcmluZyA9IHNiZ252aXpJbnN0YW5jZS5lbGVtZW50VXRpbGl0aWVzLmdldFBvcnRzT3JkZXJpbmcobm9kZSk7XHJcbiAgICAgICAgdmFyIG5vZGVQb3J0cyA9IG5vZGUuZGF0YSgncG9ydHMnKTtcclxuICAgICAgICBpZiAoIG5vZGVQb3J0c09yZGVyaW5nID09PSAnTC10by1SJyB8fCBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ1ItdG8tTCcgKSB7XHJcbiAgICAgICAgICB2YXIgbGVmdFBvcnRJZCA9IG5vZGVQb3J0c1swXS54IDwgMCA/IG5vZGVQb3J0c1swXS5pZCA6IG5vZGVQb3J0c1sxXS5pZDsgLy8gVGhlIHggdmFsdWUgb2YgbGVmdCBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIG5lZ2F0aXZlXHJcbiAgICAgICAgICB2YXIgcmlnaHRQb3J0SWQgPSBub2RlUG9ydHNbMF0ueCA+IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB4IHZhbHVlIG9mIHJpZ2h0IHBvcnQgaXMgc3VwcG9zZWQgdG8gYmUgcG9zaXRpdmVcclxuICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgKiBJZiB0aGUgcG9ydCBvcmRlcmluZyBpcyBsZWZ0IHRvIHJpZ2h0IHRoZW4gdGhlIGlucHV0IHBvcnQgaXMgdGhlIGxlZnQgcG9ydCBhbmQgdGhlIG91dHB1dCBwb3J0IGlzIHRoZSByaWdodCBwb3J0LlxyXG4gICAgICAgICAgICogRWxzZSBpZiBpdCBpcyByaWdodCB0byBsZWZ0IGl0IGlzIHZpY2UgdmVyc2FcclxuICAgICAgICAgICAqL1xyXG4gICAgICAgICAgbm9kZUlucHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdMLXRvLVInID8gbGVmdFBvcnRJZCA6IHJpZ2h0UG9ydElkO1xyXG4gICAgICAgICAgbm9kZU91dHB1dFBvcnRJZCA9IG5vZGVQb3J0c09yZGVyaW5nID09PSAnUi10by1MJyA/IGxlZnRQb3J0SWQgOiByaWdodFBvcnRJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoIG5vZGVQb3J0c09yZGVyaW5nID09PSAnVC10by1CJyB8fCBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ0ItdG8tVCcgKXtcclxuICAgICAgICAgIHZhciB0b3BQb3J0SWQgPSBub2RlUG9ydHNbMF0ueSA8IDAgPyBub2RlUG9ydHNbMF0uaWQgOiBub2RlUG9ydHNbMV0uaWQ7IC8vIFRoZSB5IHZhbHVlIG9mIHRvcCBwb3J0IGlzIHN1cHBvc2VkIHRvIGJlIG5lZ2F0aXZlXHJcbiAgICAgICAgICB2YXIgYm90dG9tUG9ydElkID0gbm9kZVBvcnRzWzBdLnkgPiAwID8gbm9kZVBvcnRzWzBdLmlkIDogbm9kZVBvcnRzWzFdLmlkOyAvLyBUaGUgeSB2YWx1ZSBvZiBib3R0b20gcG9ydCBpcyBzdXBwb3NlZCB0byBiZSBwb3NpdGl2ZVxyXG4gICAgICAgICAgLypcclxuICAgICAgICAgICAqIElmIHRoZSBwb3J0IG9yZGVyaW5nIGlzIHRvcCB0byBib3R0b20gdGhlbiB0aGUgaW5wdXQgcG9ydCBpcyB0aGUgdG9wIHBvcnQgYW5kIHRoZSBvdXRwdXQgcG9ydCBpcyB0aGUgYm90dG9tIHBvcnQuXHJcbiAgICAgICAgICAgKiBFbHNlIGlmIGl0IGlzIHJpZ2h0IHRvIGxlZnQgaXQgaXMgdmljZSB2ZXJzYVxyXG4gICAgICAgICAgICovXHJcbiAgICAgICAgICBub2RlSW5wdXRQb3J0SWQgPSBub2RlUG9ydHNPcmRlcmluZyA9PT0gJ1QtdG8tQicgPyB0b3BQb3J0SWQgOiBib3R0b21Qb3J0SWQ7XHJcbiAgICAgICAgICBub2RlT3V0cHV0UG9ydElkID0gbm9kZVBvcnRzT3JkZXJpbmcgPT09ICdCLXRvLVQnID8gdG9wUG9ydElkIDogYm90dG9tUG9ydElkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBJTyBwb3J0cyBvZiB0aGUgbm9kZVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBpbnB1dFBvcnRJZDogbm9kZUlucHV0UG9ydElkLFxyXG4gICAgICAgICAgb3V0cHV0UG9ydElkOiBub2RlT3V0cHV0UG9ydElkXHJcbiAgICAgICAgfTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIElmIGF0IGxlYXN0IG9uZSBlbmQgb2YgdGhlIGVkZ2UgaGFzIHBvcnRzIHRoZW4gd2Ugc2hvdWxkIGRldGVybWluZSB0aGUgcG9ydHMgd2hlcmUgdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZC5cclxuICAgICAgaWYgKHNvdXJjZUhhc1BvcnRzIHx8IHRhcmdldEhhc1BvcnRzKSB7XHJcbiAgICAgICAgdmFyIHNvdXJjZU5vZGVJbnB1dFBvcnRJZCwgc291cmNlTm9kZU91dHB1dFBvcnRJZCwgdGFyZ2V0Tm9kZUlucHV0UG9ydElkLCB0YXJnZXROb2RlT3V0cHV0UG9ydElkO1xyXG5cclxuICAgICAgICAvLyBJZiBzb3VyY2Ugbm9kZSBoYXMgcG9ydHMgc2V0IHRoZSB2YXJpYWJsZXMgZGVkaWNhdGVkIGZvciBpdHMgSU8gcG9ydHNcclxuICAgICAgICBpZiAoIHNvdXJjZUhhc1BvcnRzICkge1xyXG4gICAgICAgICAgdmFyIGlvUG9ydHMgPSBnZXRJT1BvcnRJZHMoc291cmNlTm9kZSk7XHJcbiAgICAgICAgICBzb3VyY2VOb2RlSW5wdXRQb3J0SWQgPSBpb1BvcnRzLmlucHV0UG9ydElkO1xyXG4gICAgICAgICAgc291cmNlTm9kZU91dHB1dFBvcnRJZCA9IGlvUG9ydHMub3V0cHV0UG9ydElkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgdGFyZ2V0IG5vZGUgaGFzIHBvcnRzIHNldCB0aGUgdmFyaWFibGVzIGRlZGljYXRlZCBmb3IgaXRzIElPIHBvcnRzXHJcbiAgICAgICAgaWYgKCB0YXJnZXRIYXNQb3J0cyApIHtcclxuICAgICAgICAgIHZhciBpb1BvcnRzID0gZ2V0SU9Qb3J0SWRzKHRhcmdldE5vZGUpO1xyXG4gICAgICAgICAgdGFyZ2V0Tm9kZUlucHV0UG9ydElkID0gaW9Qb3J0cy5pbnB1dFBvcnRJZDtcclxuICAgICAgICAgIHRhcmdldE5vZGVPdXRwdXRQb3J0SWQgPSBpb1BvcnRzLm91dHB1dFBvcnRJZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzYmduY2xhc3MgPT09ICdjb25zdW1wdGlvbicpIHtcclxuICAgICAgICAgIC8vIEEgY29uc3VtcHRpb24gZWRnZSBzaG91bGQgYmUgY29ubmVjdGVkIHRvIHRoZSBpbnB1dCBwb3J0IG9mIHRoZSB0YXJnZXQgbm9kZSB3aGljaCBpcyBzdXBwb3NlZCB0byBiZSBhIHByb2Nlc3MgKGFueSBraW5kIG9mKVxyXG4gICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XHJcbiAgICAgICAgICBwb3J0dGFyZ2V0ID0gdGFyZ2V0Tm9kZUlucHV0UG9ydElkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzYmduY2xhc3MgPT09ICdwcm9kdWN0aW9uJykge1xyXG4gICAgICAgICAgLy8gQSBwcm9kdWN0aW9uIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgb3V0cHV0IHBvcnQgb2YgdGhlIHNvdXJjZSBub2RlIHdoaWNoIGlzIHN1cHBvc2VkIHRvIGJlIGEgcHJvY2VzcyAoYW55IGtpbmQgb2YpXHJcbiAgICAgICAgICAvLyBBIG1vZHVsYXRpb24gZWRnZSBtYXkgaGF2ZSBhIGxvZ2ljYWwgb3BlcmF0b3IgYXMgc291cmNlIG5vZGUgaW4gdGhpcyBjYXNlIHRoZSBlZGdlIHNob3VsZCBiZSBjb25uZWN0ZWQgdG8gdGhlIG91dHB1dCBwb3J0IG9mIGl0XHJcbiAgICAgICAgICAvLyBUaGUgYmVsb3cgYXNzaWdubWVudCBzYXRpc2Z5IGFsbCBvZiB0aGVzZSBjb25kaXRpb25cclxuICAgICAgICAgIGlmKGdyb3VwSUQgPT0gMCB8fCBncm91cElEID09IHVuZGVmaW5lZCkgeyAvLyBncm91cElEIDAgZm9yIHJldmVyc2libGUgcmVhY3Rpb25zIGdyb3VwIDBcclxuICAgICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVPdXRwdXRQb3J0SWQ7XHJcbiAgICAgICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHsgLy9pZiByZWFjdGlvbiBpcyByZXZlcnNpYmxlIGFuZCBlZGdlIGJlbG9uZ3MgdG8gZ3JvdXAgMVxyXG4gICAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZUlucHV0UG9ydElkO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGVsZW1lbnRVdGlsaXRpZXMuaXNNb2R1bGF0aW9uQXJjQ2xhc3Moc2JnbmNsYXNzKSB8fCBlbGVtZW50VXRpbGl0aWVzLmlzQUZBcmNDbGFzcyhzYmduY2xhc3MpKXtcclxuICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlT3V0cHV0UG9ydElkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzYmduY2xhc3MgPT09ICdsb2dpYyBhcmMnKSB7XHJcbiAgICAgICAgICB2YXIgc3JjQ2xhc3MgPSBzb3VyY2VOb2RlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICAgICAgICB2YXIgdGd0Q2xhc3MgPSB0YXJnZXROb2RlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICAgICAgICB2YXIgaXNTb3VyY2VMb2dpY2FsT3AgPSBzcmNDbGFzcyA9PT0gJ2FuZCcgfHwgc3JjQ2xhc3MgPT09ICdvcicgfHwgc3JjQ2xhc3MgPT09ICdub3QnO1xyXG4gICAgICAgICAgdmFyIGlzVGFyZ2V0TG9naWNhbE9wID0gdGd0Q2xhc3MgPT09ICdhbmQnIHx8IHRndENsYXNzID09PSAnb3InIHx8IHRndENsYXNzID09PSAnbm90JztcclxuXHJcbiAgICAgICAgICBpZiAoaXNTb3VyY2VMb2dpY2FsT3AgJiYgaXNUYXJnZXRMb2dpY2FsT3ApIHtcclxuICAgICAgICAgICAgLy8gSWYgYm90aCBlbmQgYXJlIGxvZ2ljYWwgb3BlcmF0b3JzIHRoZW4gdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgaW5wdXQgcG9ydCBvZiB0aGUgdGFyZ2V0IGFuZCB0aGUgb3V0cHV0IHBvcnQgb2YgdGhlIGlucHV0XHJcbiAgICAgICAgICAgIHBvcnR0YXJnZXQgPSB0YXJnZXROb2RlSW5wdXRQb3J0SWQ7XHJcbiAgICAgICAgICAgIHBvcnRzb3VyY2UgPSBzb3VyY2VOb2RlT3V0cHV0UG9ydElkO1xyXG4gICAgICAgICAgfS8vIElmIGp1c3Qgb25lIGVuZCBvZiBsb2dpY2FsIG9wZXJhdG9yIHRoZW4gdGhlIGVkZ2Ugc2hvdWxkIGJlIGNvbm5lY3RlZCB0byB0aGUgaW5wdXQgcG9ydCBvZiB0aGUgbG9naWNhbCBvcGVyYXRvclxyXG4gICAgICAgICAgZWxzZSBpZiAoaXNTb3VyY2VMb2dpY2FsT3ApIHtcclxuICAgICAgICAgICAgcG9ydHNvdXJjZSA9IHNvdXJjZU5vZGVJbnB1dFBvcnRJZDtcclxuICAgICAgICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVPdXRwdXRQb3J0SWQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmIChpc1RhcmdldExvZ2ljYWxPcCkge1xyXG4gICAgICAgICAgICBwb3J0c291cmNlID0gc291cmNlTm9kZU91dHB1dFBvcnRJZDtcclxuICAgICAgICAgICAgcG9ydHRhcmdldCA9IHRhcmdldE5vZGVJbnB1dFBvcnRJZDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoZSBkZWZhdWx0IHBvcnRzb3VyY2UvcG9ydHRhcmdldCBhcmUgdGhlIHNvdXJjZS90YXJnZXQgdGhlbXNlbHZlcy4gSWYgdGhleSBhcmUgbm90IHNldCB1c2UgdGhlc2UgZGVmYXVsdHMuXHJcbiAgICAgIC8vIFRoZSBwb3J0c291cmNlIGFuZCBwb3J0dGFyZ2V0IGFyZSBkZXRlcm1pbmVkIHNldCB0aGVtIGluIGRhdGEgb2JqZWN0LlxyXG4gICAgICBkYXRhLnBvcnRzb3VyY2UgPSBwb3J0c291cmNlIHx8IHNvdXJjZTtcclxuICAgICAgZGF0YS5wb3J0dGFyZ2V0ID0gcG9ydHRhcmdldCB8fCB0YXJnZXQ7XHJcblxyXG4gICAgICB2YXIgZWxlcyA9IGN5LmFkZCh7XHJcbiAgICAgICAgZ3JvdXA6IFwiZWRnZXNcIixcclxuICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgIGNzczogY3NzXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyIG5ld0VkZ2UgPSBlbGVzW2VsZXMubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICByZXR1cm4gbmV3RWRnZTtcclxuICAgIH07XHJcblxyXG4gICAgZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyA9IGZ1bmN0aW9uKF9zb3VyY2UsIF90YXJnZXQsIG5vZGVQYXJhbXMpIHtcclxuICAgICAgLy8gSWYgc291cmNlIGFuZCB0YXJnZXQgSURzIGFyZSBnaXZlbiBnZXQgdGhlIGVsZW1lbnRzIGJ5IElEc1xyXG4gICAgICB2YXIgc291cmNlID0gdHlwZW9mIF9zb3VyY2UgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3NvdXJjZSkgOiBfc291cmNlO1xyXG4gICAgICB2YXIgdGFyZ2V0ID0gdHlwZW9mIF90YXJnZXQgPT09ICdzdHJpbmcnID8gY3kuZ2V0RWxlbWVudEJ5SWQoX3RhcmdldCkgOiBfdGFyZ2V0O1xyXG5cclxuICAgICAgLy8gUHJvY2VzcyBwYXJlbnQgc2hvdWxkIGJlIHRoZSBjbG9zZXN0IGNvbW1vbiBhbmNlc3RvciBvZiB0aGUgc291cmNlIGFuZCB0YXJnZXQgbm9kZXNcclxuICAgICAgdmFyIHByb2Nlc3NQYXJlbnQgPSBjeS5jb2xsZWN0aW9uKFtzb3VyY2VbMF0sIHRhcmdldFswXV0pLmNvbW1vbkFuY2VzdG9ycygpLmZpcnN0KCk7XHJcblxyXG4gICAgICAvLyBQcm9jZXNzIHNob3VsZCBiZSBhdCB0aGUgbWlkZGxlIG9mIHRoZSBzb3VyY2UgYW5kIHRhcmdldCBub2Rlc1xyXG4gICAgICB2YXIgeCA9ICggc291cmNlLnBvc2l0aW9uKCd4JykgKyB0YXJnZXQucG9zaXRpb24oJ3gnKSApIC8gMjtcclxuICAgICAgdmFyIHkgPSAoIHNvdXJjZS5wb3NpdGlvbigneScpICsgdGFyZ2V0LnBvc2l0aW9uKCd5JykgKSAvIDI7XHJcblxyXG4gICAgICAvLyBDcmVhdGUgdGhlIHByb2Nlc3Mgd2l0aCBnaXZlbi9jYWxjdWxhdGVkIHZhcmlhYmxlc1xyXG4gICAgICB2YXIgcHJvY2VzcyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZSh4LCB5LCBub2RlUGFyYW1zLCB1bmRlZmluZWQsIHByb2Nlc3NQYXJlbnQuaWQoKSk7XHJcbiAgICAgICAgdmFyIHhkaWZmID0gc291cmNlLnBvc2l0aW9uKCd4JykgLSB0YXJnZXQucG9zaXRpb24oJ3gnKTtcclxuICAgICAgICB2YXIgeWRpZmYgPSBzb3VyY2UucG9zaXRpb24oJ3knKSAtIHRhcmdldC5wb3NpdGlvbigneScpXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHhkaWZmKSA+PSBNYXRoLmFicyh5ZGlmZikpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoeGRpZmYgPCAwKVxyXG4gICAgICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdMLXRvLVInKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRQb3J0c09yZGVyaW5nKHByb2Nlc3MsICdSLXRvLUwnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHlkaWZmIDwgMClcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnVC10by1CJyk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnQi10by1UJyk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgIC8vIENyZWF0ZSB0aGUgZWRnZXMgb25lIGlzIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBzb3VyY2Ugbm9kZSAod2hpY2ggc2hvdWxkIGJlIGEgY29uc3VtcHRpb24pLFxyXG4gICAgICAvLyB0aGUgb3RoZXIgb25lIGlzIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSB0YXJnZXQgbm9kZSAod2hpY2ggc2hvdWxkIGJlIGEgcHJvZHVjdGlvbikuXHJcbiAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uIHBsZWFzZSByZWZlciB0byBTQkdOLVBEIHJlZmVyZW5jZSBjYXJkLlxyXG4gICAgICB2YXIgZWRnZUJ0d1NyYyA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2UuaWQoKSwgcHJvY2Vzcy5pZCgpLCB7Y2xhc3MgOiAnY29uc3VtcHRpb24nLCBsYW5ndWFnZSA6IG5vZGVQYXJhbXMubGFuZ3VhZ2V9KTtcclxuICAgICAgdmFyIGVkZ2VCdHdUZ3QgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCB0YXJnZXQuaWQoKSwge2NsYXNzIDogJ3Byb2R1Y3Rpb24nLCBsYW5ndWFnZSA6IG5vZGVQYXJhbXMubGFuZ3VhZ2V9KTtcclxuXHJcbiAgICAgIC8vIENyZWF0ZSBhIGNvbGxlY3Rpb24gaW5jbHVkaW5nIHRoZSBlbGVtZW50cyBhbmQgdG8gYmUgcmV0dXJuZWRcclxuICAgICAgdmFyIGNvbGxlY3Rpb24gPSBjeS5jb2xsZWN0aW9uKFtwcm9jZXNzWzBdLCBlZGdlQnR3U3JjWzBdLCBlZGdlQnR3VGd0WzBdXSk7XHJcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogVGhpcyBtZXRob2QgYXNzdW1lcyB0aGF0IHBhcmFtLm5vZGVzVG9NYWtlQ29tcG91bmQgY29udGFpbnMgYXQgbGVhc3Qgb25lIG5vZGVcclxuICAgICAqIGFuZCBhbGwgb2YgdGhlIG5vZGVzIGluY2x1ZGluZyBpbiBpdCBoYXZlIHRoZSBzYW1lIHBhcmVudC4gSXQgY3JlYXRlcyBhIGNvbXBvdW5kIGZvdCB0aGUgZ2l2ZW4gbm9kZXMgYW4gaGF2aW5nIHRoZSBnaXZlbiB0eXBlLlxyXG4gICAgICovXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChub2Rlc1RvTWFrZUNvbXBvdW5kLCBjb21wb3VuZFR5cGUpIHtcclxuICAgICAgdmFyIG9sZFBhcmVudElkID0gbm9kZXNUb01ha2VDb21wb3VuZFswXS5kYXRhKFwicGFyZW50XCIpO1xyXG4gICAgICB2YXIgbGFuZ3VhZ2UgPSBub2Rlc1RvTWFrZUNvbXBvdW5kWzBdLmRhdGEoXCJsYW5ndWFnZVwiKTtcclxuICAgICAgLy8gaWYgbm9kZXNUb01ha2VDb21wb3VuZCBjb250YWluIGJvdGggUEQgYW5kIEFGIG5vZGVzLCB0aGVuIHNldCBsYW5ndWFnZSBvZiBjb21wb3VuZCBhcyBVbmtub3duXHJcbiAgICAgIGZvciggdmFyIGk9MTsgaTxub2Rlc1RvTWFrZUNvbXBvdW5kLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICBpZihub2Rlc1RvTWFrZUNvbXBvdW5kW2ldICE9IGxhbmd1YWdlKXtcclxuICAgICAgICAgIGxhbmd1YWdlID0gXCJVbmtub3duXCI7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgLy8gVGhlIHBhcmVudCBvZiBuZXcgY29tcG91bmQgd2lsbCBiZSB0aGUgb2xkIHBhcmVudCBvZiB0aGUgbm9kZXMgdG8gbWFrZSBjb21wb3VuZC4geCwgeSBhbmQgaWQgcGFyYW1ldGVycyBhcmUgbm90IHNldC5cclxuICAgICAgdmFyIG5ld0NvbXBvdW5kID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7Y2xhc3MgOiBjb21wb3VuZFR5cGUsIGxhbmd1YWdlIDogbGFuZ3VhZ2V9LCB1bmRlZmluZWQsIG9sZFBhcmVudElkKTtcclxuICAgICAgdmFyIG5ld0NvbXBvdW5kSWQgPSBuZXdDb21wb3VuZC5pZCgpO1xyXG4gICAgICB2YXIgbmV3RWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50KG5vZGVzVG9NYWtlQ29tcG91bmQsIG5ld0NvbXBvdW5kSWQpO1xyXG4gICAgICBuZXdFbGVzID0gbmV3RWxlcy51bmlvbihuZXdDb21wb3VuZCk7XHJcbiAgICAgIHJldHVybiBuZXdFbGVzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogQ3JlYXRlcyBhIHRlbXBsYXRlIHJlYWN0aW9uIHdpdGggZ2l2ZW4gcGFyYW1ldGVycy4gUmVxdWlyZXMgY29zZS1iaWxrZW50IGxheW91dCB0byB0aWxlIHRoZSBmcmVlIG1hY3JvbW9sZWN1bGVzIGluY2x1ZGVkXHJcbiAgICAgKiBpbiB0aGUgY29tcGxleC4gUGFyYW1ldGVycyBhcmUgZXhwbGFpbmVkIGJlbG93LlxyXG4gICAgICogdGVtcGxhdGVUeXBlOiBUaGUgdHlwZSBvZiB0aGUgdGVtcGxhdGUgcmVhY3Rpb24uIEl0IG1heSBiZSAnYXNzb2NpYXRpb24nIG9yICdkaXNzb2NpYXRpb24nIGZvciBub3cuXHJcbiAgICAgKiBub2RlTGlzdDogVGhlIGxpc3Qgb2YgdGhlIG5hbWVzIGFuZCB0eXBlcyBvZiBtb2xlY3VsZXMgd2hpY2ggd2lsbCBpbnZvbHZlIGluIHRoZSByZWFjdGlvbi5cclxuICAgICAqIGNvbXBsZXhOYW1lOiBUaGUgbmFtZSBvZiB0aGUgY29tcGxleCBpbiB0aGUgcmVhY3Rpb24uXHJcbiAgICAgKiBwcm9jZXNzUG9zaXRpb246IFRoZSBtb2RhbCBwb3NpdGlvbiBvZiB0aGUgcHJvY2VzcyBpbiB0aGUgcmVhY3Rpb24uIFRoZSBkZWZhdWx0IHZhbHVlIGlzIHRoZSBjZW50ZXIgb2YgdGhlIGNhbnZhcy5cclxuICAgICAqIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDogVGhpcyBvcHRpb24gd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNvc2UtYmlsa2VudCBsYXlvdXQgd2l0aCB0aGUgc2FtZSBuYW1lLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyAxNS5cclxuICAgICAqIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsOiBUaGlzIG9wdGlvbiB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY29zZS1iaWxrZW50IGxheW91dCB3aXRoIHRoZSBzYW1lIG5hbWUuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDE1LlxyXG4gICAgICogZWRnZUxlbmd0aDogVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHByb2Nlc3MgYW5kIHRoZSBtYWNyb21vbGVjdWxlcyBhdCB0aGUgYm90aCBzaWRlcy5cclxuICAgICAqL1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uID0gZnVuY3Rpb24gKHRlbXBsYXRlVHlwZSwgbm9kZUxpc3QsIGNvbXBsZXhOYW1lLCBwcm9jZXNzUG9zaXRpb24sIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCwgdGlsaW5nUGFkZGluZ0hvcml6b250YWwsIGVkZ2VMZW5ndGgsIGxheW91dFBhcmFtKSB7XHJcblxyXG4gICAgICB2YXIgZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRQcm9wZXJ0aWVzKCBcIm1hY3JvbW9sZWN1bGVcIiApO1xyXG4gICAgICB2YXIgZGVmYXVsdFNpbXBsZUNoZW1pY2FsUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIFwic2ltcGxlIGNoZW1pY2FsXCIgKTtcclxuICAgICAgdmFyIGRlZmF1bHRQcm9jZXNzUHJvcGVydGllcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIHRlbXBsYXRlVHlwZSApO1xyXG4gICAgICB2YXIgcHJvY2Vzc1dpZHRoID0gZGVmYXVsdFByb2Nlc3NQcm9wZXJ0aWVzLndpZHRoIHx8IDUwO1xyXG4gICAgICB2YXIgbWFjcm9tb2xlY3VsZVdpZHRoID0gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMud2lkdGggfHwgNTA7XHJcbiAgICAgIHZhciBtYWNyb21vbGVjdWxlSGVpZ2h0ID0gZGVmYXVsdE1hY3JvbW9sZWN1bFByb3BlcnRpZXMuaGVpZ2h0IHx8IDUwO1xyXG4gICAgICB2YXIgc2ltcGxlQ2hlbWljYWxXaWR0aCA9IGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMud2lkdGggfHwgMzU7XHJcbiAgICAgIHZhciBzaW1wbGVDaGVtaWNhbEhlaWdodCA9IGRlZmF1bHRTaW1wbGVDaGVtaWNhbFByb3BlcnRpZXMuaGVpZ2h0IHx8IDM1O1xyXG4gICAgICB2YXIgcHJvY2Vzc1Bvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uIHx8IGVsZW1lbnRVdGlsaXRpZXMuY29udmVydFRvTW9kZWxQb3NpdGlvbih7eDogY3kud2lkdGgoKSAvIDIsIHk6IGN5LmhlaWdodCgpIC8gMn0pO1xyXG4gICAgICB2YXIgbm9kZUxpc3QgPSBub2RlTGlzdDtcclxuICAgICAgdmFyIGNvbXBsZXhOYW1lID0gY29tcGxleE5hbWU7XHJcbiAgICAgIHZhciBudW1PZk1vbGVjdWxlcyA9IG5vZGVMaXN0Lmxlbmd0aDtcclxuICAgICAgdmFyIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCA9IHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCB8fCAxNTtcclxuICAgICAgdmFyIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsID0gdGlsaW5nUGFkZGluZ0hvcml6b250YWwgfHwgMTU7XHJcbiAgICAgIHZhciBlZGdlTGVuZ3RoID0gZWRnZUxlbmd0aCB8fCA2MDtcclxuXHJcbiAgICAgIGN5LnN0YXJ0QmF0Y2goKTtcclxuXHJcbiAgICAgIHZhciB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcztcclxuICAgICAgdmFyIHhQb3NpdGlvbk9mSW5wdXRNYWNyb21vbGVjdWxlcztcclxuXHJcbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgICAgICB4UG9zaXRpb25PZkZyZWVNYWNyb21vbGVjdWxlcyA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBtYWNyb21vbGVjdWxlV2lkdGggLyAyO1xyXG4gICAgICAgIGlmICghZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkpIHtcclxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShcIlBEXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKHRlbXBsYXRlVHlwZSA9PT0gJ2Rpc3NvY2lhdGlvbicpe1xyXG4gICAgICAgIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSkge1xyXG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiUERcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlKFwiSHlicmlkQW55XCIpO1xyXG4gICAgICAgIHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzID0gcHJvY2Vzc1Bvc2l0aW9uLnggLSBlZGdlTGVuZ3RoIC0gcHJvY2Vzc1dpZHRoIC8gMiAtIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XHJcbiAgICAgICAgeFBvc2l0aW9uT2ZJbnB1dE1hY3JvbW9sZWN1bGVzID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIG1hY3JvbW9sZWN1bGVXaWR0aCAvIDI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vQ3JlYXRlIHRoZSBwcm9jZXNzIGluIHRlbXBsYXRlIHR5cGVcclxuICAgICAgdmFyIHByb2Nlc3M7XHJcbiAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdyZXZlcnNpYmxlJykge1xyXG4gICAgICAgIHByb2Nlc3MgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUocHJvY2Vzc1Bvc2l0aW9uLngsIHByb2Nlc3NQb3NpdGlvbi55LCB7Y2xhc3MgOiAncHJvY2VzcycsIGxhbmd1YWdlIDogJ1BEJ30pO1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0UG9ydHNPcmRlcmluZyhwcm9jZXNzLCAnTC10by1SJyk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBwcm9jZXNzID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHByb2Nlc3NQb3NpdGlvbi54LCBwcm9jZXNzUG9zaXRpb24ueSwge2NsYXNzIDogdGVtcGxhdGVUeXBlLCBsYW5ndWFnZSA6ICdQRCd9KTtcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldFBvcnRzT3JkZXJpbmcocHJvY2VzcywgJ0wtdG8tUicpO1xyXG4gICAgICB9XHJcbiAgICAgIHByb2Nlc3MuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcblxyXG4gICAgICAvL0RlZmluZSB0aGUgc3RhcnRpbmcgeSBwb3NpdGlvblxyXG4gICAgICB2YXIgeVBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKG51bU9mTW9sZWN1bGVzIC0gMSkgLyAyKSAqIChtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsKTtcclxuXHJcbiAgICAgIC8vQ3JlYXRlIHRoZSBmcmVlIG1vbGVjdWxlc1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bU9mTW9sZWN1bGVzOyBpKyspIHtcclxuICAgICAgICAvLyBub2RlIGFkZGl0aW9uIG9wZXJhdGlvbiBpcyBkZXRlcm1pbmVkIGJ5IG1vbGVjdWxlIHR5cGVcclxuICAgICAgICBpZihub2RlTGlzdFtpXS50eXBlID09IFwiU2ltcGxlIENoZW1pY2FsXCIpe1xyXG4gICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc2l0aW9uT2ZGcmVlTWFjcm9tb2xlY3VsZXMsIHlQb3NpdGlvbiwge2NsYXNzIDogJ3NpbXBsZSBjaGVtaWNhbCcsIGxhbmd1YWdlIDogJ1BEJ30pO1xyXG4gICAgICAgICAgLy91cGRhdGUgdGhlIHkgcG9zaXRpb25cclxuICAgICAgICAgIHlQb3NpdGlvbiArPSBzaW1wbGVDaGVtaWNhbEhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHhQb3NpdGlvbk9mRnJlZU1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIHtjbGFzcyA6ICdtYWNyb21vbGVjdWxlJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XHJcbiAgICAgICAgICAvL3VwZGF0ZSB0aGUgeSBwb3NpdGlvblxyXG4gICAgICAgICAgeVBvc2l0aW9uICs9IG1hY3JvbW9sZWN1bGVIZWlnaHQgKyB0aWxpbmdQYWRkaW5nVmVydGljYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIG5vZGVMaXN0W2ldLm5hbWUpO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSB0aGUgZWRnZSBjb25uZWN0ZWQgdG8gdGhlIG5ldyBtb2xlY3VsZVxyXG4gICAgICAgIHZhciBuZXdFZGdlO1xyXG4gICAgICAgIGlmICh0ZW1wbGF0ZVR5cGUgPT09ICdhc3NvY2lhdGlvbicpIHtcclxuICAgICAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3Tm9kZS5pZCgpLCBwcm9jZXNzLmlkKCksIHtjbGFzcyA6ICdjb25zdW1wdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRlbXBsYXRlVHlwZSA9PT0gJ2Rpc3NvY2lhdGlvbicpe1xyXG4gICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIG5ld05vZGUuaWQoKSwge2NsYXNzIDogJ3Byb2R1Y3Rpb24nLCBsYW5ndWFnZSA6ICdQRCd9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIC8vR3JvdXAgcmlnaHQgb3IgdG9wIGVsZW1lbnRzIGluIGdyb3VwIGlkIDFcclxuICAgICAgICAgIG5ld0VkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocHJvY2Vzcy5pZCgpLCBuZXdOb2RlLmlkKCksIHtjbGFzcyA6ICdwcm9kdWN0aW9uJywgbGFuZ3VhZ2UgOiAnUEQnfSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmV3RWRnZS5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nIHx8IHRlbXBsYXRlVHlwZSA9PSAnZGlzc29jaWF0aW9uJyl7XHJcbiAgICAgICAgLy9DcmVhdGUgdGhlIGNvbXBsZXggaW5jbHVkaW5nIG1hY3JvbW9sZWN1bGVzIGluc2lkZSBvZiBpdFxyXG4gICAgICAgIC8vVGVtcHJvcmFyaWx5IGFkZCBpdCB0byB0aGUgcHJvY2VzcyBwb3NpdGlvbiB3ZSB3aWxsIG1vdmUgaXQgYWNjb3JkaW5nIHRvIHRoZSBsYXN0IHNpemUgb2YgaXRcclxuICAgICAgICB2YXIgY29tcGxleCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShwcm9jZXNzUG9zaXRpb24ueCwgcHJvY2Vzc1Bvc2l0aW9uLnksIHtjbGFzcyA6ICdjb21wbGV4JywgbGFuZ3VhZ2UgOiAnUEQnfSk7XHJcbiAgICAgICAgY29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuICAgICAgICBjb21wbGV4LmRhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgLy9JZiBhIG5hbWUgaXMgc3BlY2lmaWVkIGZvciB0aGUgY29tcGxleCBzZXQgaXRzIGxhYmVsIGFjY29yZGluZ2x5XHJcbiAgICAgICAgaWYgKGNvbXBsZXhOYW1lKSB7XHJcbiAgICAgICAgICBjb21wbGV4LmRhdGEoJ2xhYmVsJywgY29tcGxleE5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubm5lY3RlZCB0byB0aGUgY29tcGxleFxyXG4gICAgICAgIHZhciBlZGdlT2ZDb21wbGV4O1xyXG5cclxuICAgICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XHJcbiAgICAgICAgICBlZGdlT2ZDb21wbGV4ID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHByb2Nlc3MuaWQoKSwgY29tcGxleC5pZCgpLCB7Y2xhc3MgOiAncHJvZHVjdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGVkZ2VPZkNvbXBsZXggPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UoY29tcGxleC5pZCgpLCBwcm9jZXNzLmlkKCksIHtjbGFzcyA6ICdjb25zdW1wdGlvbicsIGxhbmd1YWdlIDogJ1BEJ30pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWRnZU9mQ29tcGxleC5kYXRhKCdqdXN0QWRkZWQnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1PZk1vbGVjdWxlczsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgLy8gQWRkIGEgbW9sZWN1bGUoZGVwZW5kZW50IG9uIGl0J3MgdHlwZSkgbm90IGhhdmluZyBhIHByZXZpb3VzbHkgZGVmaW5lZCBpZCBhbmQgaGF2aW5nIHRoZSBjb21wbGV4IGNyZWF0ZWQgaW4gdGhpcyByZWFjdGlvbiBhcyBwYXJlbnRcclxuICAgICAgICAgIGlmKG5vZGVMaXN0W2ldLnR5cGUgPT0gJ1NpbXBsZSBDaGVtaWNhbCcpe1xyXG4gICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShjb21wbGV4LnBvc2l0aW9uKCd4JyksIGNvbXBsZXgucG9zaXRpb24oJ3knKSwge2NsYXNzIDogJ3NpbXBsZSBjaGVtaWNhbCcsIGxhbmd1YWdlIDogJ1BEJ30sIHVuZGVmaW5lZCwgY29tcGxleC5pZCgpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHZhciBuZXdOb2RlID0gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKGNvbXBsZXgucG9zaXRpb24oJ3gnKSwgY29tcGxleC5wb3NpdGlvbigneScpLCB7Y2xhc3MgOiAnbWFjcm9tb2xlY3VsZScsIGxhbmd1YWdlIDogJ1BEJ30sIHVuZGVmaW5lZCwgY29tcGxleC5pZCgpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBuZXdOb2RlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xyXG4gICAgICAgICAgbmV3Tm9kZS5kYXRhKCdsYWJlbCcsIG5vZGVMaXN0W2ldLm5hbWUpO1xyXG4gICAgICAgICAgbmV3Tm9kZS5kYXRhKCdqdXN0QWRkZWRMYXlvdXROb2RlJywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIHRoZSBpbnB1dCBtYWNyb21vbGVjdWxlc1xyXG4gICAgICAgIHZhciBudW1PZklucHV0TWFjcm9tb2xlY3VsZXMgPSBjb21wbGV4TmFtZS5sZW5ndGg7XHJcbiAgICAgICAgeVBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnkgLSAoKG51bU9mSW5wdXRNYWNyb21vbGVjdWxlcyAtIDEpIC8gMikgKiAobWFjcm9tb2xlY3VsZUhlaWdodCArIHRpbGluZ1BhZGRpbmdWZXJ0aWNhbCk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtT2ZJbnB1dE1hY3JvbW9sZWN1bGVzOyBpKyspIHtcclxuXHJcbiAgICAgICAgICBpZihjb21wbGV4TmFtZVtpXS50eXBlID09ICdTaW1wbGUgQ2hlbWljYWwnKXtcclxuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc2l0aW9uT2ZJbnB1dE1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIHtjbGFzcyA6ICdzaW1wbGUgY2hlbWljYWwnLCBsYW5ndWFnZSA6ICdQRCd9KTtcclxuICAgICAgICAgICAgeVBvc2l0aW9uICs9IHNpbXBsZUNoZW1pY2FsSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBlbGVtZW50VXRpbGl0aWVzLmFkZE5vZGUoeFBvc2l0aW9uT2ZJbnB1dE1hY3JvbW9sZWN1bGVzLCB5UG9zaXRpb24sIHtjbGFzcyA6ICdtYWNyb21vbGVjdWxlJywgbGFuZ3VhZ2UgOiAnUEQnfSk7XHJcbiAgICAgICAgICAgIHlQb3NpdGlvbiArPSBtYWNyb21vbGVjdWxlSGVpZ2h0ICsgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIG5ld05vZGUuZGF0YSgnanVzdEFkZGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICBuZXdOb2RlLmRhdGEoJ2xhYmVsJywgY29tcGxleE5hbWVbaV0ubmFtZSk7XHJcblxyXG4gICAgICAgICAgLy9jcmVhdGUgdGhlIGVkZ2UgY29ubmVjdGVkIHRvIHRoZSBuZXcgbWFjcm9tb2xlY3VsZVxyXG4gICAgICAgICAgdmFyIG5ld0VkZ2U7XHJcblxyXG4gICAgICAgICAgLy9Hcm91cCB0aGUgbGVmdCBvciBib3R0b20gZWxlbWVudHMgaW4gZ3JvdXAgaWQgMFxyXG4gICAgICAgICAgbmV3RWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShwcm9jZXNzLmlkKCksIG5ld05vZGUuaWQoKSwge2NsYXNzIDogJ3Byb2R1Y3Rpb24nLCBsYW5ndWFnZSA6ICdQRCd9LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgMCk7XHJcbiAgICAgICAgICBuZXdFZGdlLmRhdGEoJ2p1c3RBZGRlZCcsIHRydWUpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGN5LmVuZEJhdGNoKCk7XHJcblxyXG4gICAgICB2YXIgbGF5b3V0Tm9kZXMgPSBjeS5ub2RlcygnW2p1c3RBZGRlZExheW91dE5vZGVdJyk7XHJcbiAgICAgIGxheW91dE5vZGVzLnJlbW92ZURhdGEoJ2p1c3RBZGRlZExheW91dE5vZGUnKTtcclxuICAgICAgdmFyIGxheW91dCA9IGxheW91dE5vZGVzLmxheW91dCh7XHJcbiAgICAgICAgbmFtZTogbGF5b3V0UGFyYW0ubmFtZSxcclxuICAgICAgICByYW5kb21pemU6IGZhbHNlLFxyXG4gICAgICAgIGZpdDogZmFsc2UsXHJcbiAgICAgICAgYW5pbWF0ZTogZmFsc2UsXHJcbiAgICAgICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXHJcbiAgICAgICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxyXG4gICAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIC8vSWYgaXQgaXMgYSByZXZlcnNpYmxlIHJlYWN0aW9uIG5vIG5lZWQgdG8gcmUtcG9zaXRpb24gY29tcGxleGVzXHJcbiAgICAgICAgICBpZih0ZW1wbGF0ZVR5cGUgPT09ICdyZXZlcnNpYmxlJylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgLy9yZS1wb3NpdGlvbiB0aGUgbm9kZXMgaW5zaWRlIHRoZSBjb21wbGV4XHJcbiAgICAgICAgICB2YXIgc3VwcG9zZWRYUG9zaXRpb247XHJcbiAgICAgICAgICB2YXIgc3VwcG9zZWRZUG9zaXRpb24gPSBwcm9jZXNzUG9zaXRpb24ueTtcclxuXHJcbiAgICAgICAgICBpZiAodGVtcGxhdGVUeXBlID09PSAnYXNzb2NpYXRpb24nKSB7XHJcbiAgICAgICAgICAgIHN1cHBvc2VkWFBvc2l0aW9uID0gcHJvY2Vzc1Bvc2l0aW9uLnggKyBlZGdlTGVuZ3RoICsgcHJvY2Vzc1dpZHRoIC8gMiArIGNvbXBsZXgub3V0ZXJXaWR0aCgpIC8gMjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzdXBwb3NlZFhQb3NpdGlvbiA9IHByb2Nlc3NQb3NpdGlvbi54IC0gZWRnZUxlbmd0aCAtIHByb2Nlc3NXaWR0aCAvIDIgLSBjb21wbGV4Lm91dGVyV2lkdGgoKSAvIDI7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdmFyIHBvc2l0aW9uRGlmZlggPSAoc3VwcG9zZWRYUG9zaXRpb24gLSBjb21wbGV4LnBvc2l0aW9uKCd4JykpIC8gMjtcclxuICAgICAgICAgIHZhciBwb3NpdGlvbkRpZmZZID0gKHN1cHBvc2VkWVBvc2l0aW9uIC0gY29tcGxleC5wb3NpdGlvbigneScpKSAvIDI7XHJcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyh7eDogcG9zaXRpb25EaWZmWCwgeTogcG9zaXRpb25EaWZmWX0sIGNvbXBsZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBEbyB0aGlzIGNoZWNrIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxyXG4gICAgICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4gJiYgdGVtcGxhdGVUeXBlICE9PSAncmV2ZXJzaWJsZScpIHtcclxuICAgICAgICBsYXlvdXQucnVuKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vZmlsdGVyIHRoZSBqdXN0IGFkZGVkIGVsZW1lbXRzIHRvIHJldHVybiB0aGVtIGFuZCByZW1vdmUganVzdCBhZGRlZCBtYXJrXHJcbiAgICAgIHZhciBlbGVzID0gY3kuZWxlbWVudHMoJ1tqdXN0QWRkZWRdJyk7XHJcbiAgICAgIGVsZXMucmVtb3ZlRGF0YSgnanVzdEFkZGVkJyk7XHJcblxyXG4gICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgICAgIGVsZXMuc2VsZWN0KCk7XHJcblxyXG4gICAgICByZXR1cm4gZWxlczsgLy8gUmV0dXJuIHRoZSBqdXN0IGFkZGVkIGVsZW1lbnRzXHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBNb3ZlIHRoZSBub2RlcyB0byBhIG5ldyBwYXJlbnQgYW5kIGNoYW5nZSB0aGVpciBwb3NpdGlvbiBpZiBwb3NzRGlmZiBwYXJhbXMgYXJlIHNldC5cclxuICAgICAqL1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQgPSBmdW5jdGlvbihub2RlcywgbmV3UGFyZW50LCBwb3NEaWZmWCwgcG9zRGlmZlkpIHtcclxuICAgICAgdmFyIG5ld1BhcmVudElkID0gbmV3UGFyZW50ID09IHVuZGVmaW5lZCB8fCB0eXBlb2YgbmV3UGFyZW50ID09PSAnc3RyaW5nJyA/IG5ld1BhcmVudCA6IG5ld1BhcmVudC5pZCgpO1xyXG4gICAgICB2YXIgbW92ZWRFbGVzID0gbm9kZXMubW92ZSh7XCJwYXJlbnRcIjogbmV3UGFyZW50SWR9KTtcclxuICAgICAgaWYodHlwZW9mIHBvc0RpZmZYICE9ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwb3NEaWZmWSAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHt4OiBwb3NEaWZmWCwgeTogcG9zRGlmZll9LCBub2Rlcyk7XHJcbiAgICAgIH1cclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXIobW92ZWRFbGVzKTtcclxuICAgICAgcmV0dXJuIG1vdmVkRWxlcztcclxuICAgIH07XHJcblxyXG4gICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVJbmZvYm94U3R5bGUgPSBmdW5jdGlvbiggbm9kZSwgaW5kZXgsIG5ld1Byb3BzICkge1xyXG4gICAgICB2YXIgaW5mb2JveE9iaiA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKVtpbmRleF07XHJcbiAgICAgICQuZXh0ZW5kKCBpbmZvYm94T2JqLnN0eWxlLCBuZXdQcm9wcyApO1xyXG4gICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hPYmogPSBmdW5jdGlvbiggbm9kZSwgaW5kZXgsIG5ld1Byb3BzICkge1xyXG4gICAgICB2YXIgaW5mb2JveE9iaiA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKVtpbmRleF07XHJcbiAgICAgICQuZXh0ZW5kKCBpbmZvYm94T2JqLCBuZXdQcm9wcyApO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKG5vZGVzLCB3aWR0aCwgaGVpZ2h0LCB1c2VBc3BlY3RSYXRpbywgcHJlc2VydmVSZWxhdGl2ZVBvcykge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgICAgdmFyIHJhdGlvID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBlbGVNdXN0QmVTcXVhcmUgPSBlbGVtZW50VXRpbGl0aWVzLm11c3RCZVNxdWFyZShub2RlLmRhdGEoJ2NsYXNzJykpO1xyXG5cclxuICAgICAgICBpZiAocHJlc2VydmVSZWxhdGl2ZVBvcyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgdmFyIG9sZFdpZHRoID0gbm9kZS5kYXRhKFwiYmJveFwiKS53O1xyXG4gICAgICAgICAgdmFyIG9sZEhlaWdodCA9IG5vZGUuZGF0YShcImJib3hcIikuaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5vdGUgdGhhdCBib3RoIHdpZHRoIGFuZCBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5XHJcbiAgICAgICAgaWYoIW5vZGUuaXNQYXJlbnQoKSl7XHJcbiAgICAgICAgICBpZiAod2lkdGgpIHtcclxuICAgICAgICAgICAgaWYgKHVzZUFzcGVjdFJhdGlvIHx8IGVsZU11c3RCZVNxdWFyZSkge1xyXG4gICAgICAgICAgICAgIHJhdGlvID0gd2lkdGggLyBub2RlLndpZHRoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gd2lkdGg7XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICBpZiAoaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGlmICh1c2VBc3BlY3RSYXRpbyB8fCBlbGVNdXN0QmVTcXVhcmUpIHtcclxuICAgICAgICAgICAgICByYXRpbyA9IGhlaWdodCAvIG5vZGUuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gaGVpZ2h0O1xyXG4gICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgaWYgKHJhdGlvICYmICFoZWlnaHQpIHtcclxuICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gbm9kZS5oZWlnaHQoKSAqIHJhdGlvO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAocmF0aW8gJiYgIXdpZHRoKSB7XHJcbiAgICAgICAgICAgIG5vZGUuZGF0YShcImJib3hcIikudyA9IG5vZGUud2lkdGgoKSAqIHJhdGlvO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0XCIgLCBcIlwiKyBoZWlnaHQpO1xyXG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluV2lkdGhcIiAsIFwiXCIrIHdpZHRoKTtcclxuICAgICAgICAgIG5vZGUuZGF0YShcIm1pbldpZHRoQmlhc0xlZnRcIiwgXCI1MCVcIik7XHJcbiAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aEJpYXNSaWdodFwiLCBcIjUwJVwiKTtcclxuICAgICAgICAgIG5vZGUuZGF0YShcIm1pbkhlaWdodEJpYXNUb3BcIiwgXCI1MCVcIiApO1xyXG4gICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc0JvdHRvbVwiLCBcIjUwJVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgIC8qICAgIGlmIChwcmVzZXJ2ZVJlbGF0aXZlUG9zID09PSB0cnVlKSB7XHJcbiAgICAgICAgICB2YXIgc3RhdGVzYW5kaW5mb3MgPSBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJyk7XHJcbiAgICAgICAgICB2YXIgdG9wQm90dG9tID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiAoYm94LmFuY2hvclNpZGUgPT09IFwidG9wXCIgfHwgYm94LmFuY2hvclNpZGUgPT09IFwiYm90dG9tXCIpKTtcclxuICAgICAgICAgIHZhciByaWdodExlZnQgPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IChib3guYW5jaG9yU2lkZSA9PT0gXCJyaWdodFwiIHx8IGJveC5hbmNob3JTaWRlID09PSBcImxlZnRcIikpO1xyXG5cclxuICAgICAgICAgIHRvcEJvdHRvbS5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XHJcbiAgICAgICAgICAgIGlmIChib3guYmJveC54IDwgMCkge1xyXG4gICAgICAgICAgICAgIGJveC5iYm94LnggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGJveC5iYm94LnggPiBvbGRXaWR0aCkge1xyXG4gICAgICAgICAgICAgIGJveC5iYm94LnggPSBvbGRXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBib3guYmJveC54ID0gbm9kZS5kYXRhKFwiYmJveFwiKS53ICogYm94LmJib3gueCAvIG9sZFdpZHRoO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgcmlnaHRMZWZ0LmZvckVhY2goZnVuY3Rpb24oYm94KXtcclxuICAgICAgICAgICAgaWYgKGJveC5iYm94LnkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgYm94LmJib3gueSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoYm94LmJib3gueSA+IG9sZEhlaWdodCkge1xyXG4gICAgICAgICAgICAgIGJveC5iYm94LnkgPSBvbGRIZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYm94LmJib3gueSA9IG5vZGUuZGF0YShcImJib3hcIikuaCAqIGJveC5iYm94LnkgLyBvbGRIZWlnaHQ7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9ICovXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5XaWR0aCA9IGZ1bmN0aW9uKG5vZGUpIHtcclxuXHJcbiAgICAgICAgdmFyIGRlZmF1bHRXaWR0aCA9IHRoaXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMobm9kZS5kYXRhKCdjbGFzcycpKS53aWR0aDtcclxuXHJcbiAgICAgICAgLy8gTGFiZWwgd2lkdGggY2FsY3VsYXRpb25cclxuICAgICAgICB2YXIgc3R5bGUgPSBub2RlLnN0eWxlKCk7XHJcblxyXG4gICAgICAgIHZhciBmb250RmFtaWxpeSA9IHN0eWxlWydmb250LWZhbWlseSddO1xyXG4gICAgICAgIHZhciBmb250U2l6ZSA9IHN0eWxlWydmb250LXNpemUnXTtcclxuICAgICAgICB2YXIgbGFiZWxUZXh0ID0gc3R5bGVbJ2xhYmVsJ107XHJcblxyXG4gICAgICAgIHZhciBsYWJlbFdpZHRoID0gZWxlbWVudFV0aWxpdGllcy5nZXRXaWR0aEJ5Q29udGVudCggbGFiZWxUZXh0LCBmb250RmFtaWxpeSwgZm9udFNpemUgKTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xyXG4gICAgICAgIC8vVG9wIGFuZCBib3R0b20gaW5mb0JveGVzXHJcbiAgICAgICAgLy92YXIgdG9wSW5mb0JveGVzID0gc3RhdGVzYW5kaW5mb3MuZmlsdGVyKGJveCA9PiAoYm94LmFuY2hvclNpZGUgPT09IFwidG9wXCIgfHwgKChib3guYW5jaG9yU2lkZSA9PT0gXCJyaWdodFwiIHx8IGJveC5hbmNob3JTaWRlID09PSBcImxlZnRcIikgJiYgKGJveC5iYm94LnkgPD0gMTIpKSkpO1xyXG4gICAgICAgIC8vdmFyIGJvdHRvbUluZm9Cb3hlcyA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gKGJveC5hbmNob3JTaWRlID09PSBcImJvdHRvbVwiIHx8ICgoYm94LmFuY2hvclNpZGUgPT09IFwicmlnaHRcIiB8fCBib3guYW5jaG9yU2lkZSA9PT0gXCJsZWZ0XCIpICYmIChib3guYmJveC55ID49IG5vZGUuZGF0YSgnYmJveCcpLmggLSAxMikpKSk7XHJcbiAgICAgICAgdmFyIHVuaXRHYXAgPSA1O1xyXG4gICAgICAgIHZhciB0b3BJZGVhbFdpZHRoID0gdW5pdEdhcDtcclxuICAgICAgICB2YXIgYm90dG9tSWRlYWxXaWR0aCA9IHVuaXRHYXA7ICAgICAgICBcclxuICAgICAgICB2YXIgcmlnaHRNYXhXaWR0aCA9IDA7XHJcbiAgICAgICAgdmFyIGxlZnRNYXhXaWR0aCA9MDtcclxuICAgICAgICBzdGF0ZXNhbmRpbmZvcy5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XHJcbiAgICAgICAgICBpZihib3guYW5jaG9yU2lkZSA9PT0gXCJ0b3BcIil7XHJcbiAgICAgICAgICAgIHRvcElkZWFsV2lkdGggKz0gYm94LmJib3gudyArIHVuaXRHYXA7XHJcblxyXG4gICAgICAgICAgfWVsc2UgaWYoYm94LmFuY2hvclNpZGUgPT09IFwiYm90dG9tXCIpe1xyXG4gICAgICAgICAgICBib3R0b21JZGVhbFdpZHRoICs9IGJveC5iYm94LncgKyB1bml0R2FwO1xyXG5cclxuICAgICAgICAgIH1lbHNlIGlmKGJveC5hbmNob3JTaWRlID09PSBcInJpZ2h0XCIpXHJcbiAgICAgICAgICB7ICAgICAgICAgICBcclxuICAgICAgICAgICAgcmlnaHRNYXhXaWR0aCA9IChib3guYmJveC53ID4gcmlnaHRNYXhXaWR0aCkgPyBib3guYmJveC53IDogcmlnaHRNYXhXaWR0aDtcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGVmdE1heFdpZHRoID0gKGJveC5iYm94LncgPiBsZWZ0TWF4V2lkdGgpID8gYm94LmJib3gudyA6IGxlZnRNYXhXaWR0aDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTsgICAgICBcclxuXHJcbiAgICAgICAgdmFyIG1pZGRsZVdpZHRoID0gbGFiZWxXaWR0aCArIDIgKiBNYXRoLm1heChyaWdodE1heFdpZHRoLzIsIGxlZnRNYXhXaWR0aC8yKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbXBvdW5kV2lkdGggPSAwO1xyXG4gICAgICAgIGlmKG5vZGUuaXNQYXJlbnQoKSl7XHJcbiAgICAgICAgICBjb21wb3VuZFdpZHRoID0gbm9kZS5jaGlsZHJlbigpLmJvdW5kaW5nQm94KCkudztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KG1pZGRsZVdpZHRoLCBkZWZhdWx0V2lkdGgvMiwgdG9wSWRlYWxXaWR0aCwgYm90dG9tSWRlYWxXaWR0aCwgY29tcG91bmRXaWR0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5IZWlnaHQgPSBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xyXG4gICAgICAgIHZhciBtYXJnaW4gPSA3O1xyXG4gICAgICAgIHZhciB1bml0R2FwID0gNTtcclxuICAgICAgICB2YXIgZGVmYXVsdEhlaWdodCA9IHRoaXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMobm9kZS5kYXRhKCdjbGFzcycpKS5oZWlnaHQ7XHJcbiAgICAgICAgdmFyIGxlZnRJbmZvQm94ZXMgPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IGJveC5hbmNob3JTaWRlID09PSBcImxlZnRcIik7ICAgICAgICBcclxuICAgICAgICB2YXIgbGVmdEhlaWdodCA9IHVuaXRHYXA7IFxyXG4gICAgICAgIGxlZnRJbmZvQm94ZXMuZm9yRWFjaChmdW5jdGlvbihib3gpe1xyXG4gICAgICAgICAgICBsZWZ0SGVpZ2h0ICs9IGJveC5iYm94LmggKyB1bml0R2FwO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgIH0pOyAgICAgIFxyXG4gICAgICAgIHZhciByaWdodEluZm9Cb3hlcyA9IHN0YXRlc2FuZGluZm9zLmZpbHRlcihib3ggPT4gYm94LmFuY2hvclNpZGUgPT09IFwicmlnaHRcIik7XHJcbiAgICAgICAgdmFyIHJpZ2h0SGVpZ2h0ID0gdW5pdEdhcDsgICAgICAgIFxyXG4gICAgICAgIHJpZ2h0SW5mb0JveGVzLmZvckVhY2goZnVuY3Rpb24oYm94KXtcclxuICAgICAgICAgICAgcmlnaHRIZWlnaHQgKz0gYm94LmJib3guaCArIHVuaXRHYXA7ICAgICAgICAgICBcclxuICAgICAgICB9KTsgICAgICAgXHJcbiAgICAgICAgdmFyIHN0eWxlID0gbm9kZS5zdHlsZSgpO1xyXG4gICAgICAgIHZhciBsYWJlbFRleHQgPSAoKHN0eWxlWydsYWJlbCddKS5zcGxpdChcIlxcblwiKSkuZmlsdGVyKCB0ZXh0ID0+IHRleHQgIT09ICcnKTtcclxuICAgICAgICB2YXIgZm9udFNpemUgPSBwYXJzZUZsb2F0KHN0eWxlWydmb250LXNpemUnXS5zdWJzdHJpbmcoMCwgc3R5bGVbJ2ZvbnQtc2l6ZSddLmxlbmd0aCAtIDIpKTtcclxuICAgICAgICB2YXIgdG90YWxIZWlnaHQgPSBsYWJlbFRleHQubGVuZ3RoICogZm9udFNpemUgKyAyICogbWFyZ2luO1xyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgdmFyIGNvbXBvdW5kSGVpZ2h0ID0gMDtcclxuICAgICAgICBpZihub2RlLmlzUGFyZW50KCkpe1xyXG4gICAgICAgICAgY29tcG91bmRIZWlnaHQgPSBub2RlLmNoaWxkcmVuKCkuYm91bmRpbmdCb3goKS5oO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgodG90YWxIZWlnaHQsIGRlZmF1bHRIZWlnaHQvMiwgbGVmdEhlaWdodCwgcmlnaHRIZWlnaHQsIGNvbXBvdW5kSGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmlzUmVzaXplZFRvQ29udGVudCA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgIGlmKCFub2RlIHx8ICFub2RlLmlzTm9kZSgpIHx8ICFub2RlLmRhdGEoJ2Jib3gnKSl7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgdyA9IG5vZGUuZGF0YSgnYmJveCcpLnc7XHJcbiAgICAgIHZhciBoID0gbm9kZS5kYXRhKCdiYm94JykuaDtcclxuXHJcbiAgICAgIHZhciBtaW5XID0gZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5XaWR0aChub2RlKTtcclxuICAgICAgdmFyIG1pbkggPSBlbGVtZW50VXRpbGl0aWVzLmNhbGN1bGF0ZU1pbkhlaWdodChub2RlKTtcclxuXHJcbiAgICAgIGlmKHcgPT09IG1pblcgJiYgaCA9PT0gbWluSClcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTZWN0aW9uIEVuZFxyXG4gICAgLy8gQWRkIHJlbW92ZSB1dGlsaXRpZXNcclxuXHJcbiAgICAvLyBSZWxvY2F0ZXMgc3RhdGUgYW5kIGluZm8gYm94ZXMuIFRoaXMgZnVuY3Rpb24gaXMgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkIGFmdGVyIGFkZC9yZW1vdmUgc3RhdGUgYW5kIGluZm8gYm94ZXNcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVsb2NhdGVTdGF0ZUFuZEluZm9zID0gZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IChlbGUuaXNOb2RlICYmIGVsZS5pc05vZGUoKSkgPyBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKSA6IGVsZTtcclxuICAgICAgdmFyIGxlbmd0aCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoO1xyXG4gICAgICBpZiAobGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAobGVuZ3RoID09IDEpIHtcclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAobGVuZ3RoID09IDIpIHtcclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzBdLmJib3gueCA9IDA7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMDtcclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueSA9IDUwO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGxlbmd0aCA9PSAzKSB7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnggPSAtMjU7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvc1swXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC54ID0gMjU7XHJcbiAgICAgICAgc3RhdGVBbmRJbmZvc1sxXS5iYm94LnkgPSAtNTA7XHJcblxyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMl0uYmJveC54ID0gMDtcclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC54ID0gLTI1O1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMF0uYmJveC55ID0gLTUwO1xyXG5cclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzFdLmJib3gueCA9IDI1O1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbMV0uYmJveC55ID0gLTUwO1xyXG5cclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueCA9IC0yNTtcclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzJdLmJib3gueSA9IDUwO1xyXG5cclxuICAgICAgICBzdGF0ZUFuZEluZm9zWzNdLmJib3gueCA9IDI1O1xyXG4gICAgICAgIHN0YXRlQW5kSW5mb3NbM10uYmJveC55ID0gNTA7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gQ2hhbmdlIHN0YXRlIHZhbHVlIG9yIHVuaXQgb2YgaW5mb3JtYXRpb24gYm94IG9mIGdpdmVuIG5vZGVzIHdpdGggZ2l2ZW4gaW5kZXguXHJcbiAgICAvLyBUeXBlIHBhcmFtZXRlciBpbmRpY2F0ZXMgd2hldGhlciB0byBjaGFuZ2UgdmFsdWUgb3IgdmFyaWFibGUsIGl0IGlzIHZhbGlkIGlmIHRoZSBib3ggYXQgdGhlIGdpdmVuIGluZGV4IGlzIGEgc3RhdGUgdmFyaWFibGUuXHJcbiAgICAvLyBWYWx1ZSBwYXJhbWV0ZXIgaXMgdGhlIG5ldyB2YWx1ZSB0byBzZXQuXHJcbiAgICAvLyBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBvbGQgdmFsdWUgb2YgdGhlIGNoYW5nZWQgZGF0YSAoV2UgYXNzdW1lIHRoYXQgdGhlIG9sZCB2YWx1ZSBvZiB0aGUgY2hhbmdlZCBkYXRhIHdhcyB0aGUgc2FtZSBmb3IgYWxsIG5vZGVzKS5cclxuICAgIC8vIEVhY2ggY2hhcmFjdGVyIGFzc3VtZWQgdG8gb2NjdXB5IDggdW5pdFxyXG4gICAgLy8gRWFjaCBpbmZvYm94IGNhbiBoYXZlIGF0IG1vc3QgMzIgdW5pdHMgb2Ygd2lkdGhcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSkge1xyXG4gICAgICB2YXIgcmVzdWx0O1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICB2YXIgc2JnbmNsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xyXG4gICAgICAgIHZhciBib3ggPSBzdGF0ZUFuZEluZm9zW2luZGV4XTtcclxuICAgICAgICB2YXIgb2xkTGVuZ3RoID0gYm94LmJib3gudztcclxuICAgICAgICB2YXIgbmV3TGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRlbnQgPSAnJztcclxuICAgICAgICBpZiAoYm94LmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xyXG4gICAgICAgICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gYm94LnN0YXRlW3R5cGVdO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJveC5zdGF0ZVt0eXBlXSA9IHZhbHVlO1xyXG4gICAgICAgICAgaWYgKGJveC5zdGF0ZVtcInZhbHVlXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29udGVudCArPSBib3guc3RhdGVbXCJ2YWx1ZVwiXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChib3guc3RhdGVbXCJ2YXJpYWJsZVwiXSAhPT0gdW5kZWZpbmVkICYmIGJveC5zdGF0ZVtcInZhcmlhYmxlXCJdLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29udGVudCArPSBib3guc3RhdGVbXCJ2YXJpYWJsZVwiXSArIFwiQFwiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYm94LmNsYXp6ID09IFwidW5pdCBvZiBpbmZvcm1hdGlvblwiKSB7XHJcbiAgICAgICAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBib3gubGFiZWwudGV4dDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRlbnQgKz0gdmFsdWU7XHJcbiAgICAgICAgICBib3gubGFiZWwudGV4dCA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG1pbiA9ICggc2JnbmNsYXNzID09PSAnU0lGIG1hY3JvbW9sZWN1bGUnIHx8IHNiZ25jbGFzcyA9PT0gJ1NJRiBzaW1wbGUgY2hlbWljYWwnICkgPyAxNSA6IDEyO1xyXG4gICAgICAgIHZhciBmb250RmFtaWx5ID0gYm94LnN0eWxlWyAnZm9udC1mYW1pbHknIF07XHJcbiAgICAgICAgdmFyIGZvbnRTaXplID0gYm94LnN0eWxlWyAnZm9udC1zaXplJyBdO1xyXG4gICAgICAgIHZhciBib3JkZXJXaWR0aCA9IGJveC5zdHlsZVsgJ2JvcmRlci13aWR0aCcgXTtcclxuICAgICAgICB2YXIgb3B0cyA9IHtcclxuICAgICAgICAgIG1pbixcclxuICAgICAgICAgIG1heDogNDgsXHJcbiAgICAgICAgICBtYXJnaW46IGJvcmRlcldpZHRoIC8gMiArIDAuNVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHByZXZpb3VzV2lkdGggPSBib3guYmJveC53O1xyXG4gICAgICAgIGJveC5iYm94LncgPSBlbGVtZW50VXRpbGl0aWVzLmdldFdpZHRoQnlDb250ZW50KCBjb250ZW50LCBmb250RmFtaWx5LCBmb250U2l6ZSwgb3B0cyApO1xyXG5cclxuICAgICAgICBpZihib3guYW5jaG9yU2lkZSA9PSBcInRvcFwiIHx8IGJveC5hbmNob3JTaWRlID09IFwiYm90dG9tXCIpe1xyXG4gICAgICAgICAgdmFyIHVuaXRMYXlvdXQgPSBub2RlLmRhdGEoKVtcImF1eHVuaXRsYXlvdXRzXCJdW2JveC5hbmNob3JTaWRlXTtcclxuICAgICAgICAgIGlmKHVuaXRMYXlvdXQudW5pdHNbdW5pdExheW91dC51bml0cy5sZW5ndGgtMV0uaWQgPT0gYm94LmlkKXtcclxuICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgYm9yZGVyV2lkdGggPSBub2RlLmRhdGEoKVsnYm9yZGVyLXdpZHRoJ107XHJcbiAgICAgICAgICAgIHZhciBzaGlmdEFtb3VudCA9ICgoKGJveC5iYm94LncgLSBwcmV2aW91c1dpZHRoKSAvIDIpICogMTAwICkvIChub2RlLm91dGVyV2lkdGgoKSAtIGJvcmRlcldpZHRoKTtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoc2hpZnRBbW91bnQgPj0gMCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGlmKGJveC5iYm94LnggKyBzaGlmdEFtb3VudCA8PSAxMDApe1xyXG4gICAgICAgICAgICAgICAgYm94LmJib3gueCA9IGJveC5iYm94LnggKyBzaGlmdEFtb3VudDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgIHZhciBwcmV2aW91c0luZm9CYm94ID0ge3ggOiAwLCB3OjB9O1xyXG4gICAgICAgICAgICAgIGlmKHVuaXRMYXlvdXQudW5pdHMubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgICAgICBwcmV2aW91c0luZm9CYm94PSB1bml0TGF5b3V0LnVuaXRzW3VuaXRMYXlvdXQudW5pdHMubGVuZ3RoLTJdLmJib3g7ICAgICAgXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5BdXhVbml0TGF5b3V0LnNldElkZWFsR2FwKG5vZGUsIGJveC5hbmNob3JTaWRlKTtcclxuICAgICAgICAgICAgICB2YXIgaWRlYWxHYXAgPSBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5BdXhVbml0TGF5b3V0LmdldEN1cnJlbnRHYXAoYm94LmFuY2hvclNpZGUpO1xyXG4gICAgICAgICAgICAgIHZhciBuZXdQb3NpdGlvbiA9IHByZXZpb3VzSW5mb0Jib3gueCArIChwcmV2aW91c0luZm9CYm94LncvMiArIGlkZWFsR2FwICsgYm94LmJib3gudy8yKSoxMDAgLyAobm9kZS5vdXRlcldpZHRoKCkgLSBib3JkZXJXaWR0aCk7XHJcbiAgICAgICAgICAgICAgYm94LmJib3gueCA9IG5ld1Bvc2l0aW9uO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8qIGlmIChib3guYW5jaG9yU2lkZSA9PT0gXCJ0b3BcIiB8fCBib3guYW5jaG9yU2lkZSA9PT0gXCJib3R0b21cIikge1xyXG4gICAgICAgICAgYm94LmJib3gueCArPSAoYm94LmJib3gudyAtIG9sZExlbmd0aCkgLyAyO1xyXG4gICAgICAgICAgdmFyIHVuaXRzID0gKG5vZGUuZGF0YSgnYXV4dW5pdGxheW91dHMnKVtib3guYW5jaG9yU2lkZV0pLnVuaXRzO1xyXG4gICAgICAgICAgdmFyIHNoaWZ0SW5kZXggPSAwO1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bml0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZih1bml0c1tpXSA9PT0gYm94KXtcclxuICAgICAgICAgICAgICBzaGlmdEluZGV4ID0gaTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZm9yICh2YXIgaiA9IHNoaWZ0SW5kZXgrMTsgaiA8IHVuaXRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgdW5pdHNbal0uYmJveC54ICs9IChib3guYmJveC53IC0gb2xkTGVuZ3RoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9ICovXHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICAvL1RPRE8gZmluZCBhIHdheSB0byBlbGltYXRlIHRoaXMgcmVkdW5kYW5jeSB0byB1cGRhdGUgaW5mby1ib3ggcG9zaXRpb25zXHJcbiAgICAgIG5vZGUuZGF0YSgnYm9yZGVyLXdpZHRoJywgbm9kZS5kYXRhKCdib3JkZXItd2lkdGgnKSk7XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBBZGQgYSBuZXcgc3RhdGUgb3IgaW5mbyBib3ggdG8gZ2l2ZW4gbm9kZXMuXHJcbiAgICAvLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxyXG4gICAgLy8gVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGp1c3QgYWRkZWQgYm94LlxyXG4gICAgZWxlbWVudFV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChub2Rlcywgb2JqKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICAgIHZhciBsb2NhdGlvbk9iajtcclxuXHJcbiAgICAgICAgdmFyIGRlZmF1bHRQcm9wcyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoIG5vZGUuZGF0YSgnY2xhc3MnKSApO1xyXG4gICAgICAgIHZhciBpbmZvYm94UHJvcHMgPSBkZWZhdWx0UHJvcHNbIG9iai5jbGF6eiBdO1xyXG4gICAgICAgIHZhciBiYm94ID0gb2JqLmJib3ggfHwgeyB3OiBpbmZvYm94UHJvcHMud2lkdGgsIGg6IGluZm9ib3hQcm9wcy5oZWlnaHQgfTtcclxuICAgICAgICB2YXIgc3R5bGUgPSBlbGVtZW50VXRpbGl0aWVzLmdldERlZmF1bHRJbmZvYm94U3R5bGUoIG5vZGUuZGF0YSgnY2xhc3MnKSwgb2JqLmNsYXp6ICk7XHJcblxyXG4gICAgICAgIGlmKG9iai5jbGF6eiA9PSBcInVuaXQgb2YgaW5mb3JtYXRpb25cIikge1xyXG4gICAgICAgICAgbG9jYXRpb25PYmogPSBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5Vbml0T2ZJbmZvcm1hdGlvbi5jcmVhdGUobm9kZSwgY3ksIG9iai5sYWJlbC50ZXh0LCBiYm94LCBvYmoubG9jYXRpb24sIG9iai5wb3NpdGlvbiwgc3R5bGUsIG9iai5pbmRleCwgb2JqLmlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAob2JqLmNsYXp6ID09IFwic3RhdGUgdmFyaWFibGVcIikge1xyXG4gICAgICAgICAgbG9jYXRpb25PYmogPSBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5TdGF0ZVZhcmlhYmxlLmNyZWF0ZShub2RlLCBjeSwgb2JqLnN0YXRlLnZhbHVlLCBvYmouc3RhdGUudmFyaWFibGUsIGJib3gsIG9iai5sb2NhdGlvbiwgb2JqLnBvc2l0aW9uLCBzdHlsZSwgb2JqLmluZGV4LCBvYmouaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbG9jYXRpb25PYmo7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFJlbW92ZSB0aGUgc3RhdGUgb3IgaW5mbyBib3hlcyBvZiB0aGUgZ2l2ZW4gbm9kZXMgYXQgZ2l2ZW4gaW5kZXguXHJcbiAgICAvLyBSZXR1cm5zIHRoZSByZW1vdmVkIGJveC5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3ggPSBmdW5jdGlvbiAobm9kZXMsIGxvY2F0aW9uT2JqKSB7XHJcbiAgICAgIHZhciBvYmo7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICAgIHZhciBzdGF0ZUFuZEluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xyXG4gICAgICAgIHZhciB1bml0ID0gc3RhdGVBbmRJbmZvc1tsb2NhdGlvbk9iai5pbmRleF07XHJcblxyXG4gICAgICAgIHZhciB1bml0Q2xhc3MgPSBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5nZXRBdXhVbml0Q2xhc3ModW5pdCk7XHJcblxyXG4gICAgICAgIG9iaiA9IHVuaXRDbGFzcy5yZW1vdmUodW5pdCwgY3kpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gb2JqO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy9UaWxlcyBpbmZvcm1hdGlvbnMgYm94ZXMgZm9yIGdpdmVuIGFuY2hvclNpZGVzXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmZpdFVuaXRzID0gZnVuY3Rpb24gKG5vZGUsIGxvY2F0aW9ucykge1xyXG4gICAgICB2YXIgb2JqID0gW107XHJcbiAgICAgIG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKS5mb3JFYWNoKCBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgICAgb2JqLnB1c2goe1xyXG4gICAgICAgICAgeDogZWxlLmJib3gueCxcclxuICAgICAgICAgIHk6IGVsZS5iYm94LnksXHJcbiAgICAgICAgICBhbmNob3JTaWRlOiBlbGUuYW5jaG9yU2lkZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgc2JnbnZpekluc3RhbmNlLmNsYXNzZXMuQXV4VW5pdExheW91dC5maXRVbml0cyhub2RlLCBjeSwgbG9jYXRpb25zKTtcclxuICAgICAgcmV0dXJuIG9iajtcclxuICAgIH07XHJcblxyXG4gICAgLy9DaGVjayB3aGljaCBhbmNob3JzaWRlcyBmaXRzXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoZWNrRml0ID0gZnVuY3Rpb24gKG5vZGUsIGxvY2F0aW9uKSB7IC8vaWYgbm8gbG9jYXRpb24gZ2l2ZW4sIGl0IGNoZWNrcyBhbGwgcG9zc2libGUgbG9jYXRpb25zXHJcbiAgICAgIHJldHVybiBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5BdXhVbml0TGF5b3V0LmNoZWNrRml0KG5vZGUsIGN5LCBsb2NhdGlvbik7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vTW9kaWZ5IGFycmF5IG9mIGF1eCBsYXlvdXQgdW5pdHNcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMubW9kaWZ5VW5pdHMgPSBmdW5jdGlvbiAobm9kZSwgdW5pdCwgYW5jaG9yU2lkZSkge1xyXG4gICAgICBzYmdudml6SW5zdGFuY2UuY2xhc3Nlcy5BdXhVbml0TGF5b3V0Lm1vZGlmeVVuaXRzKG5vZGUsIHVuaXQsIGFuY2hvclNpZGUsIGN5KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gU2V0IG11bHRpbWVyIHN0YXR1cyBvZiB0aGUgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbiAobm9kZXMsIHN0YXR1cykge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICB2YXIgc2JnbmNsYXNzID0gbm9kZS5kYXRhKCdjbGFzcycpO1xyXG4gICAgICAgIHZhciBpc011bHRpbWVyID0gbm9kZS5kYXRhKCdjbGFzcycpLmVuZHNXaXRoKCcgbXVsdGltZXInKTtcclxuXHJcbiAgICAgICAgaWYgKHN0YXR1cykgeyAvLyBNYWtlIG11bHRpbWVyIHN0YXR1cyB0cnVlXHJcbiAgICAgICAgICBpZiAoIWlzTXVsdGltZXIpIHtcclxuICAgICAgICAgICAgbm9kZS5kYXRhKCdjbGFzcycsIHNiZ25jbGFzcyArICcgbXVsdGltZXInKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7IC8vIE1ha2UgbXVsdGltZXIgc3RhdHVzIGZhbHNlXHJcbiAgICAgICAgICBpZiAoaXNNdWx0aW1lcikge1xyXG4gICAgICAgICAgICBub2RlLmRhdGEoJ2NsYXNzJywgc2JnbmNsYXNzLnJlcGxhY2UoJyBtdWx0aW1lcicsICcnKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIENoYW5nZSBmb250IHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIGVsZW1lbnRzIHdpdGggZ2l2ZW4gZm9udCBkYXRhXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGVsZXMsIGRhdGEpIHtcclxuICAgICAgZm9yICh2YXIgcHJvcCBpbiBkYXRhKSB7XHJcbiAgICAgICAgZWxlcy5kYXRhKHByb3AsIGRhdGFbcHJvcF0pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFRoaXMgZnVuY3Rpb24gZ2V0cyBhbiBlZGdlLCBhbmQgZW5kcyBvZiB0aGF0IGVkZ2UgKE9wdGlvbmFsbHkgaXQgbWF5IHRha2UganVzdCB0aGUgY2xhc3NlcyBvZiB0aGUgZWRnZSBhcyB3ZWxsKSBhcyBwYXJhbWV0ZXJzLlxyXG4gICAgLy8gSXQgbWF5IHJldHVybiAndmFsaWQnICh0aGF0IGVuZHMgaXMgdmFsaWQgZm9yIHRoYXQgZWRnZSksICdyZXZlcnNlJyAodGhhdCBlbmRzIGlzIG5vdCB2YWxpZCBmb3IgdGhhdCBlZGdlIGJ1dCB0aGV5IHdvdWxkIGJlIHZhbGlkXHJcbiAgICAvLyBpZiB5b3UgcmV2ZXJzZSB0aGUgc291cmNlIGFuZCB0YXJnZXQpLCAnaW52YWxpZCcgKHRoYXQgZW5kcyBhcmUgdG90YWxseSBpbnZhbGlkIGZvciB0aGF0IGVkZ2UpLlxyXG4gICAgZWxlbWVudFV0aWxpdGllcy52YWxpZGF0ZUFycm93RW5kcyA9IGZ1bmN0aW9uIChlZGdlLCBzb3VyY2UsIHRhcmdldCkge1xyXG4gICAgICAvLyBpZiBtYXAgdHlwZSBpcyBVbmtub3duIC0tIG5vIHJ1bGVzIGFwcGxpZWRcclxuICAgICAgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpID09IFwiSHlicmlkQW55XCIgfHwgZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgPT0gXCJIeWJyaWRTYmduXCIgfHwgIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKVxyXG4gICAgICAgIHJldHVybiBcInZhbGlkXCI7XHJcblxyXG4gICAgICB2YXIgZWRnZWNsYXNzID0gdHlwZW9mIGVkZ2UgPT09ICdzdHJpbmcnID8gZWRnZSA6IGVkZ2UuZGF0YSgnY2xhc3MnKTtcclxuICAgICAgdmFyIHNvdXJjZWNsYXNzID0gc291cmNlLmRhdGEoJ2NsYXNzJyk7XHJcbiAgICAgIHZhciB0YXJnZXRjbGFzcyA9IHRhcmdldC5kYXRhKCdjbGFzcycpO1xyXG4gICAgICB2YXIgbWFwVHlwZSA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpO1xyXG4gICAgICB2YXIgZWRnZUNvbnN0cmFpbnRzID0gZWxlbWVudFV0aWxpdGllc1ttYXBUeXBlXS5jb25uZWN0aXZpdHlDb25zdHJhaW50c1tlZGdlY2xhc3NdO1xyXG5cclxuICAgICAgaWYgKG1hcFR5cGUgPT0gXCJBRlwiKXtcclxuICAgICAgICBpZiAoc291cmNlY2xhc3Muc3RhcnRzV2l0aChcIkJBXCIpKSAvLyB3ZSBoYXZlIHNlcGFyYXRlIGNsYXNzZXMgZm9yIGVhY2ggYmlvbG9naWNhbCBhY3Rpdml0eVxyXG4gICAgICAgICAgc291cmNlY2xhc3MgPSBcImJpb2xvZ2ljYWwgYWN0aXZpdHlcIjsgLy8gYnV0IHNhbWUgcnVsZSBhcHBsaWVzIHRvIGFsbCBvZiB0aGVtXHJcblxyXG4gICAgICAgIGlmICh0YXJnZXRjbGFzcy5zdGFydHNXaXRoKFwiQkFcIikpIC8vIHdlIGhhdmUgc2VwYXJhdGUgY2xhc3NlcyBmb3IgZWFjaCBiaW9sb2dpY2FsIGFjdGl2aXR5XHJcbiAgICAgICAgICB0YXJnZXRjbGFzcyA9IFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiOyAvLyBidXQgc2FtZSBydWxlIGFwcGxpZXMgdG8gYWxsIG9mIHRoZW1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChtYXBUeXBlID09IFwiUERcIil7XHJcbiAgICAgICAgc291cmNlY2xhc3MgPSBzb3VyY2VjbGFzcy5yZXBsYWNlKC9cXHMqbXVsdGltZXIkLywgJycpO1xyXG4gICAgICAgIHRhcmdldGNsYXNzID0gdGFyZ2V0Y2xhc3MucmVwbGFjZSgvXFxzKm11bHRpbWVyJC8sICcnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gZ2l2ZW4gYSBub2RlLCBhY3RpbmcgYXMgc291cmNlIG9yIHRhcmdldCwgcmV0dXJucyBib29sZWFuIHdldGhlciBvciBub3QgaXQgaGFzIHRvbyBtYW55IGVkZ2VzIGFscmVhZHlcclxuICAgICAgZnVuY3Rpb24gaGFzVG9vTWFueUVkZ2VzKG5vZGUsIHNvdXJjZU9yVGFyZ2V0KSB7XHJcbiAgICAgICAgdmFyIG5vZGVjbGFzcyA9IG5vZGUuZGF0YSgnY2xhc3MnKTtcclxuICAgICAgICBub2RlY2xhc3MgPSBub2RlY2xhc3MucmVwbGFjZSgvXFxzKm11bHRpbWVyJC8sICcnKTtcclxuICAgICAgICBpZiAobm9kZWNsYXNzLnN0YXJ0c1dpdGgoXCJCQVwiKSlcclxuICAgICAgICAgIG5vZGVjbGFzcyA9IFwiYmlvbG9naWNhbCBhY3Rpdml0eVwiO1xyXG5cclxuICAgICAgICB2YXIgdG90YWxUb29NYW55ID0gdHJ1ZTtcclxuICAgICAgICB2YXIgZWRnZVRvb01hbnkgPSB0cnVlO1xyXG4gICAgICAgIGlmIChzb3VyY2VPclRhcmdldCA9PSBcInNvdXJjZVwiKSB7XHJcbiAgICAgICAgICAgIHZhciBzYW1lRWRnZUNvdW50T3V0ID0gbm9kZS5vdXRnb2VycygnZWRnZVtjbGFzcz1cIicrZWRnZWNsYXNzKydcIl0nKS5zaXplKCk7XHJcbiAgICAgICAgICAgIHZhciB0b3RhbEVkZ2VDb3VudE91dCA9IG5vZGUub3V0Z29lcnMoJ2VkZ2UnKS5zaXplKCk7XHJcbiAgICAgICAgICAgIC8vIGNoZWNrIHRoYXQgdGhlIHRvdGFsIGVkZ2UgY291bnQgaXMgd2l0aGluIHRoZSBsaW1pdHNcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhUb3RhbCA9PSAndW5kZWZpbmVkJ1xyXG4gICAgICAgICAgICAgICAgfHwgdG90YWxFZGdlQ291bnRPdXQgPCBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhUb3RhbCApIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsVG9vTWFueSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHRoZW4gY2hlY2sgbGltaXRzIGZvciB0aGlzIHNwZWNpZmljIGVkZ2UgY2xhc3NcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBlZGdlQ29uc3RyYWludHNbbm9kZWNsYXNzXS5hc1NvdXJjZS5tYXhFZGdlID09ICd1bmRlZmluZWQnXHJcbiAgICAgICAgICAgICAgICB8fCBzYW1lRWRnZUNvdW50T3V0IDwgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNTb3VyY2UubWF4RWRnZSApIHtcclxuICAgICAgICAgICAgICAgIGVkZ2VUb29NYW55ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaWYgb25seSBvbmUgb2YgdGhlIGxpbWl0cyBpcyByZWFjaGVkIHRoZW4gZWRnZSBpcyBpbnZhbGlkXHJcbiAgICAgICAgICAgIHJldHVybiB0b3RhbFRvb01hbnkgfHwgZWRnZVRvb01hbnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgeyAvLyBub2RlIGlzIHVzZWQgYXMgdGFyZ2V0XHJcbiAgICAgICAgICAgIHZhciBzYW1lRWRnZUNvdW50SW4gPSBub2RlLmluY29tZXJzKCdlZGdlW2NsYXNzPVwiJytlZGdlY2xhc3MrJ1wiXScpLnNpemUoKTtcclxuICAgICAgICAgICAgdmFyIHRvdGFsRWRnZUNvdW50SW4gPSBub2RlLmluY29tZXJzKCdlZGdlJykuc2l6ZSgpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heFRvdGFsID09ICd1bmRlZmluZWQnXHJcbiAgICAgICAgICAgICAgICB8fCB0b3RhbEVkZ2VDb3VudEluIDwgZWRnZUNvbnN0cmFpbnRzW25vZGVjbGFzc10uYXNUYXJnZXQubWF4VG90YWwgKSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbFRvb01hbnkgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heEVkZ2UgPT0gJ3VuZGVmaW5lZCdcclxuICAgICAgICAgICAgICAgIHx8IHNhbWVFZGdlQ291bnRJbiA8IGVkZ2VDb25zdHJhaW50c1tub2RlY2xhc3NdLmFzVGFyZ2V0Lm1heEVkZ2UgKSB7XHJcbiAgICAgICAgICAgICAgICBlZGdlVG9vTWFueSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0b3RhbFRvb01hbnkgfHwgZWRnZVRvb01hbnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaXNJbkNvbXBsZXgobm9kZSkge1xyXG4gICAgICAgIHZhciBwYXJlbnRDbGFzcyA9IG5vZGUucGFyZW50KCkuZGF0YSgnY2xhc3MnKTtcclxuICAgICAgICByZXR1cm4gcGFyZW50Q2xhc3MgJiYgcGFyZW50Q2xhc3Muc3RhcnRzV2l0aCgnY29tcGxleCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNJbkNvbXBsZXgoc291cmNlKSB8fCBpc0luQ29tcGxleCh0YXJnZXQpKSB7IC8vIHN1YnVuaXRzIG9mIGEgY29tcGxleCBhcmUgbm8gbG9uZ2VyIEVQTnMsIG5vIGNvbm5lY3Rpb24gYWxsb3dlZFxyXG4gICAgICAgIHJldHVybiAnaW52YWxpZCc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGNoZWNrIG5hdHVyZSBvZiBjb25uZWN0aW9uXHJcbiAgICAgIGlmIChlZGdlQ29uc3RyYWludHNbc291cmNlY2xhc3NdLmFzU291cmNlLmlzQWxsb3dlZCAmJiBlZGdlQ29uc3RyYWludHNbdGFyZ2V0Y2xhc3NdLmFzVGFyZ2V0LmlzQWxsb3dlZCkge1xyXG4gICAgICAgIC8vIGNoZWNrIGFtb3VudCBvZiBjb25uZWN0aW9uc1xyXG4gICAgICAgIGlmICghaGFzVG9vTWFueUVkZ2VzKHNvdXJjZSwgXCJzb3VyY2VcIikgJiYgIWhhc1Rvb01hbnlFZGdlcyh0YXJnZXQsIFwidGFyZ2V0XCIpICkge1xyXG4gICAgICAgICAgcmV0dXJuICd2YWxpZCc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIHRyeSB0byByZXZlcnNlXHJcbiAgICAgIGlmIChlZGdlQ29uc3RyYWludHNbdGFyZ2V0Y2xhc3NdLmFzU291cmNlLmlzQWxsb3dlZCAmJiBlZGdlQ29uc3RyYWludHNbc291cmNlY2xhc3NdLmFzVGFyZ2V0LmlzQWxsb3dlZCkge1xyXG4gICAgICAgIGlmICghaGFzVG9vTWFueUVkZ2VzKHRhcmdldCwgXCJzb3VyY2VcIikgJiYgIWhhc1Rvb01hbnlFZGdlcyhzb3VyY2UsIFwidGFyZ2V0XCIpICkge1xyXG4gICAgICAgICAgcmV0dXJuICdyZXZlcnNlJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuICdpbnZhbGlkJztcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICAqIEhpZGUgZ2l2ZW4gZWxlcyBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xyXG4gICAgICogb3IgYSBmdW5jdGlvbiB0byBjYWxsLlxyXG4gICAgICovXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmhpZGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24oZWxlcywgbGF5b3V0cGFyYW0pIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gY3kudmlld1V0aWxpdGllcygpLmhpZGUoZWxlcyk7IC8vIEhpZGUgZ2l2ZW4gZWxlc1xyXG4gICAgICAgIGlmICh0eXBlb2YgbGF5b3V0cGFyYW0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGF5b3V0cGFyYW0oKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgYSBmdW5jdGlvbiBleGVjdXRlIGl0XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgbGF5b3V0ID0gY3kubGF5b3V0KGxheW91dHBhcmFtKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgbGF5b3V0IG9wdGlvbnMgY2FsbCBsYXlvdXQgd2l0aCB0aGF0IG9wdGlvbnMuXHJcblxyXG4gICAgICAgICAgICAvLyBEbyB0aGlzIGNoZWNrIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxyXG4gICAgICAgICAgICBpZiAobGF5b3V0ICYmIGxheW91dC5ydW4pIHtcclxuICAgICAgICAgICAgICAgIGxheW91dC5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICAqIFVuaGlkZSBnaXZlbiBlbGVzIGFuZCBwZXJmb3JtIGdpdmVuIGxheW91dCBhZnRlcndhcmQuIExheW91dCBwYXJhbWV0ZXIgbWF5IGJlIGxheW91dCBvcHRpb25zXHJcbiAgICAgKiBvciBhIGZ1bmN0aW9uIHRvIGNhbGwuXHJcbiAgICAgKi9cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQgPSBmdW5jdGlvbihlbGVzLCBsYXlvdXRwYXJhbSkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xyXG4gICAgICBpZiAodHlwZW9mIGxheW91dHBhcmFtID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgbGF5b3V0cGFyYW0oKTsgLy8gSWYgbGF5b3V0cGFyYW0gaXMgYSBmdW5jdGlvbiBleGVjdXRlIGl0XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGxheW91dCA9IGN5LmxheW91dChsYXlvdXRwYXJhbSk7IC8vIElmIGxheW91dHBhcmFtIGlzIGxheW91dCBvcHRpb25zIGNhbGwgbGF5b3V0IHdpdGggdGhhdCBvcHRpb25zLlxyXG5cclxuICAgICAgICAvLyBEbyB0aGlzIGNoZWNrIGZvciBjeXRvc2NhcGUuanMgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxyXG4gICAgICAgIGlmIChsYXlvdXQgJiYgbGF5b3V0LnJ1bikge1xyXG4gICAgICAgICAgbGF5b3V0LnJ1bigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICAqIENoYW5nZSBzdHlsZS9jc3Mgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxyXG4gICAgICogYSBzaW5nbGUgc3RyaW5nIG9yIGFuIGlkIHRvIHZhbHVlIG1hcCkuXHJcbiAgICAgKi9cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcclxuICAgICAgaWYgKCB0eXBlb2YgdmFsdWVNYXAgPT09ICdvYmplY3QnICkge1xyXG4gICAgICAgIGN5LnN0YXJ0QmF0Y2goKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBlbGUgPSBjeS5nZXRFbGVtZW50QnlJZChlbGVzW2ldLmlkKCkpO1xyXG4gICAgICAgICAgZWxlLmNzcyhuYW1lLCB2YWx1ZU1hcFtlbGUuaWQoKV0pOyAvLyB2YWx1ZU1hcCBpcyBhbiBpZCB0byB2YWx1ZSBtYXAgdXNlIGl0IGluIHRoaXMgd2F5XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN5LmVuZEJhdGNoKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgZWxlcy5jc3MobmFtZSwgdmFsdWVNYXApOyAvLyB2YWx1ZU1hcCBpcyBqdXN0IGEgc3RyaW5nIHNldCBjc3MoJ25hbWUnKSBmb3IgYWxsIGVsZXMgdG8gdGhpcyB2YWx1ZVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBDaGFuZ2UgZGF0YSBvZiBnaXZlbiBlbGVzIGJ5IHNldHRpbmcgZ2V0dGluZyBwcm9wZXJ0eSBuYW1lIHRvIHRoZSBnaXZlbiB2YWx1ZS92YWx1ZXMgKE5vdGUgdGhhdCB2YWx1ZU1hcCBwYXJhbWV0ZXIgbWF5IGJlXHJcbiAgICAgKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS5cclxuICAgICAqL1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcclxuICAgICAgaWYgKCB0eXBlb2YgdmFsdWVNYXAgPT09ICdvYmplY3QnICkge1xyXG4gICAgICAgIGN5LnN0YXJ0QmF0Y2goKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBlbGUgPSBjeS5nZXRFbGVtZW50QnlJZChlbGVzW2ldLmlkKCkpO1xyXG4gICAgICAgICAgZWxlLmRhdGEobmFtZSwgdmFsdWVNYXBbZWxlLmlkKCldKTsgLy8gdmFsdWVNYXAgaXMgYW4gaWQgdG8gdmFsdWUgbWFwIHVzZSBpdCBpbiB0aGlzIHdheVxyXG4gICAgICAgIH1cclxuICAgICAgICBjeS5lbmRCYXRjaCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGVsZXMuZGF0YShuYW1lLCB2YWx1ZU1hcCk7IC8vIHZhbHVlTWFwIGlzIGp1c3QgYSBzdHJpbmcgc2V0IGNzcygnbmFtZScpIGZvciBhbGwgZWxlcyB0byB0aGlzIHZhbHVlXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVTZXRGaWVsZCA9IGZ1bmN0aW9uKGVsZSwgZmllbGROYW1lLCB0b0RlbGV0ZSwgdG9BZGQsIGNhbGxiYWNrKSB7XHJcbiAgICAgIHZhciBzZXQgPSBlbGUuZGF0YSggZmllbGROYW1lICk7XHJcbiAgICAgIGlmICggIXNldCApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHVwZGF0ZXMgPSB7fTtcclxuXHJcbiAgICAgIGlmICggdG9EZWxldGUgIT0gbnVsbCAmJiBzZXRbIHRvRGVsZXRlIF0gKSB7XHJcbiAgICAgICAgZGVsZXRlIHNldFsgdG9EZWxldGUgXTtcclxuICAgICAgICB1cGRhdGVzLmRlbGV0ZWQgPSB0b0RlbGV0ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCB0b0FkZCAhPSBudWxsICkge1xyXG4gICAgICAgIHNldFsgdG9BZGQgXSA9IHRydWU7XHJcbiAgICAgICAgdXBkYXRlcy5hZGRlZCA9IHRvQWRkO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIGNhbGxiYWNrICYmICggdXBkYXRlc1sgJ2RlbGV0ZWQnIF0gIT0gbnVsbCB8fCB1cGRhdGVzWyAnYWRkZWQnIF0gIT0gbnVsbCApICkge1xyXG4gICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB1cGRhdGVzO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIHRoZSBzZXQgb2YgYWxsIG5vZGVzIHByZXNlbnQgdW5kZXIgdGhlIGdpdmVuIHBvc2l0aW9uXHJcbiAgICAgKiByZW5kZXJlZFBvcyBtdXN0IGJlIGEgcG9pbnQgZGVmaW5lZCByZWxhdGl2ZWx5IHRvIGN5dG9zY2FwZSBjb250YWluZXJcclxuICAgICAqIChsaWtlIHJlbmRlcmVkUG9zaXRpb24gZmllbGQgb2YgYSBub2RlKVxyXG4gICAgICovXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmdldE5vZGVzQXQgPSBmdW5jdGlvbihyZW5kZXJlZFBvcykge1xyXG4gICAgICB2YXIgbm9kZXMgPSBjeS5ub2RlcygpO1xyXG4gICAgICB2YXIgeCA9IHJlbmRlcmVkUG9zLng7XHJcbiAgICAgIHZhciB5ID0gcmVuZGVyZWRQb3MueTtcclxuICAgICAgdmFyIHJlc3VsdE5vZGVzID0gW107XHJcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgICAgdmFyIHJlbmRlcmVkQmJveCA9IG5vZGUucmVuZGVyZWRCb3VuZGluZ0JveCh7XHJcbiAgICAgICAgICBpbmNsdWRlTm9kZXM6IHRydWUsXHJcbiAgICAgICAgICBpbmNsdWRlRWRnZXM6IGZhbHNlLFxyXG4gICAgICAgICAgaW5jbHVkZUxhYmVsczogZmFsc2UsXHJcbiAgICAgICAgICBpbmNsdWRlU2hhZG93czogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoeCA+PSByZW5kZXJlZEJib3gueDEgJiYgeCA8PSByZW5kZXJlZEJib3gueDIpIHtcclxuICAgICAgICAgIGlmICh5ID49IHJlbmRlcmVkQmJveC55MSAmJiB5IDw9IHJlbmRlcmVkQmJveC55Mikge1xyXG4gICAgICAgICAgICByZXN1bHROb2Rlcy5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0Tm9kZXM7XHJcbiAgICB9O1xyXG5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuZGVtdWx0aW1lcml6ZUNsYXNzID0gZnVuY3Rpb24oc2JnbmNsYXNzKSB7XHJcbiAgICAgIHJldHVybiBzYmduY2xhc3MucmVwbGFjZShcIiBtdWx0aW1lclwiLCBcIlwiKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gbWFwVHlwZSAtIHR5cGUgb2YgdGhlIGN1cnJlbnQgbWFwIChQRCwgQUYgb3IgVW5rbm93bilcclxuICAgICAqL1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5zZXRNYXBUeXBlID0gZnVuY3Rpb24obWFwVHlwZSl7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZSA9IG1hcFR5cGU7XHJcbiAgICAgIHJldHVybiBtYXBUeXBlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmV0dXJuIC0gbWFwIHR5cGVcclxuICAgICAqL1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5tYXBUeXBlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldHMgbWFwIHR5cGVcclxuICAgICAqL1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZXNldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubWFwVHlwZSA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEtlZXAgY29uc2lzdGVuY3kgb2YgbGlua3MgdG8gc2VsZiBpbnNpZGUgdGhlIGRhdGEoKSBzdHJ1Y3R1cmUuXHJcbiAgICAgKiBUaGlzIGlzIG5lZWRlZCB3aGVuZXZlciBhIG5vZGUgY2hhbmdlcyBwYXJlbnRzLCBmb3IgZXhhbXBsZSxcclxuICAgICAqIGFzIGl0IGlzIGRlc3Ryb3llZCBhbmQgcmVjcmVhdGVkLiBCdXQgdGhlIGRhdGEoKSBzdGF5cyBpZGVudGljYWwuXHJcbiAgICAgKiBUaGlzIGNyZWF0ZXMgaW5jb25zaXN0ZW5jaWVzIGZvciB0aGUgcG9pbnRlcnMgc3RvcmVkIGluIGRhdGEoKSxcclxuICAgICAqIGFzIHRoZXkgbm93IHBvaW50IHRvIGEgZGVsZXRlZCBub2RlLlxyXG4gICAgICovXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlciA9IGZ1bmN0aW9uIChlbGVzKSB7XHJcbiAgICAgIGVsZXMubm9kZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGVsZSl7XHJcbiAgICAgICAgLy8gcmVzdG9yZSBiYWNrZ3JvdW5kIGltYWdlc1xyXG4gICAgICAgIGVsZS5lbWl0KCdkYXRhJyk7XHJcblxyXG4gICAgICAgIC8vIHNraXAgbm9kZXMgd2l0aG91dCBhbnkgYXV4aWxpYXJ5IHVuaXRzXHJcbiAgICAgICAgaWYoIWVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpIHx8IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcih2YXIgc2lkZSBpbiBlbGUuZGF0YSgnYXV4dW5pdGxheW91dHMnKSkge1xyXG4gICAgICAgICAgZWxlLmRhdGEoJ2F1eHVuaXRsYXlvdXRzJylbc2lkZV0ucGFyZW50Tm9kZSA9IGVsZS5pZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IodmFyIGk9MDsgaSA8IGVsZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBlbGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKVtpXS5wYXJlbnQgPSBlbGUuaWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYW55SGFzQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKGVsZXMpIHtcclxuICAgICAgdmFyIG9iaiA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0QmFja2dyb3VuZEltYWdlT2JqcyhlbGVzKTtcclxuICAgICAgaWYob2JqID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBlbHNle1xyXG4gICAgICAgIGZvcih2YXIga2V5IGluIG9iail7XHJcbiAgICAgICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcclxuICAgICAgICAgIGlmKHZhbHVlICYmICEkLmlzRW1wdHlPYmplY3QodmFsdWUpKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudFV0aWxpdGllcy5oYXNCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAoZWxlKSB7XHJcbiAgICAgIGlmKGVsZS5pc05vZGUoKSl7XHJcbiAgICAgICAgdmFyIGJnID0gZWxlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKSA/IGVsZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykgOiBcIlwiO1xyXG4gICAgICAgIHZhciBjbG9uZUltZyA9ICdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCwlM0NzdmclMjB3aWR0aCUzRCUyMjEwMCUyMiUyMGhlaWdodCUzRCUyMjEwMCUyMiUyMHZpZXdCb3glM0QlMjIwJTIwMCUyMDEwMCUyMDEwMCUyMiUyMHN0eWxlJTNEJTIyZmlsbCUzQW5vbmUlM0JzdHJva2UlM0FibGFjayUzQnN0cm9rZS13aWR0aCUzQTAlM0IlMjIlMjB4bWxucyUzRCUyMmh0dHAlM0EvL3d3dy53My5vcmcvMjAwMC9zdmclMjIlMjAlM0UlM0NyZWN0JTIweCUzRCUyMjAlMjIlMjB5JTNEJTIyMCUyMiUyMHdpZHRoJTNEJTIyMTAwJTIyJTIwaGVpZ2h0JTNEJTIyMTAwJTIyJTIwc3R5bGUlM0QlMjJmaWxsJTNBJTIzYTlhOWE5JTIyLyUzRSUyMCUzQy9zdmclM0UnO1xyXG4gICAgICAgIGlmKGJnICE9PSBcIlwiICYmICEoYmcuaW5kZXhPZihjbG9uZUltZykgPiAtMSAmJiBiZyA9PT0gY2xvbmVJbWcpKVxyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmdldEJhY2tncm91bmRJbWFnZVVSTCA9IGZ1bmN0aW9uIChlbGVzKSB7XHJcbiAgICAgIGlmKCFlbGVzIHx8IGVsZXMubGVuZ3RoIDwgMSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB2YXIgY29tbW9uVVJMID0gXCJcIjtcclxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG5cclxuICAgICAgICBpZighZWxlLmlzTm9kZSgpIHx8ICFlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShlbGUpKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgdXJsID0gZWxlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKS5zcGxpdChcIiBcIikucG9wKCk7XHJcbiAgICAgICAgaWYoIXVybCB8fCB1cmwuaW5kZXhPZignaHR0cCcpICE9PSAwIHx8IChjb21tb25VUkwgIT09IFwiXCIgJiYgY29tbW9uVVJMICE9PSB1cmwpKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGVsc2UgaWYoY29tbW9uVVJMID09PSBcIlwiKVxyXG4gICAgICAgICAgY29tbW9uVVJMID0gdXJsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY29tbW9uVVJMO1xyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuZ2V0QmFja2dyb3VuZEltYWdlT2JqcyA9IGZ1bmN0aW9uIChlbGVzKSB7XHJcbiAgICAgIGlmKCFlbGVzIHx8IGVsZXMubGVuZ3RoIDwgMSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB2YXIgbGlzdCA9IHt9O1xyXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcbiAgICAgICAgdmFyIG9iaiA9IGdldEJnT2JqKGVsZSk7XHJcbiAgICAgICAgaWYob2JqID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxpc3RbZWxlLmRhdGEoJ2lkJyldID0gb2JqO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBsaXN0O1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0QmdPYmogKGVsZSkge1xyXG4gICAgICAgIGlmKGVsZS5pc05vZGUoKSAmJiBlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShlbGUpKXtcclxuICAgICAgICAgIHZhciBrZXlzID0gWydiYWNrZ3JvdW5kLWltYWdlJywgJ2JhY2tncm91bmQtZml0JywgJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScsXHJcbiAgICAgICAgICAnYmFja2dyb3VuZC1wb3NpdGlvbi14JywgJ2JhY2tncm91bmQtcG9zaXRpb24teScsICdiYWNrZ3JvdW5kLWhlaWdodCcsICdiYWNrZ3JvdW5kLXdpZHRoJ107XHJcblxyXG4gICAgICAgICAgdmFyIG9iaiA9IHt9O1xyXG4gICAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgICAgICAgIHZhciBhcnIgPSBlbGUuZGF0YShrZXkpO1xyXG4gICAgICAgICAgICBvYmpba2V5XSA9IGFyciA/IGFyciA6IFwiXCI7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKGVsZS5pc05vZGUoKSlcclxuICAgICAgICAgIHJldHVybiB7fTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuZ2V0QmFja2dyb3VuZEZpdE9wdGlvbnMgPSBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgICBpZighZWxlcyB8fCBlbGVzLmxlbmd0aCA8IDEpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdmFyIGNvbW1vbkZpdCA9IFwiXCI7XHJcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICB2YXIgbm9kZSA9IGVsZXNbaV07XHJcbiAgICAgICAgaWYoIW5vZGUuaXNOb2RlKCkpXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHZhciBmaXQgPSBnZXRGaXRPcHRpb24obm9kZSk7XHJcbiAgICAgICAgaWYoIWZpdCB8fCAoY29tbW9uRml0ICE9PSBcIlwiICYmIGZpdCAhPT0gY29tbW9uRml0KSlcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBlbHNlIGlmKGNvbW1vbkZpdCA9PT0gXCJcIilcclxuICAgICAgICAgIGNvbW1vbkZpdCA9IGZpdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIG9wdGlvbnMgPSAnPG9wdGlvbiB2YWx1ZT1cIm5vbmVcIj5Ob25lPC9vcHRpb24+J1xyXG4gICAgICAgICAgICAgICAgICArICc8b3B0aW9uIHZhbHVlPVwiZml0XCI+Rml0PC9vcHRpb24+J1xyXG4gICAgICAgICAgICAgICAgICArICc8b3B0aW9uIHZhbHVlPVwiY292ZXJcIj5Db3Zlcjwvb3B0aW9uPidcclxuICAgICAgICAgICAgICAgICAgKyAnPG9wdGlvbiB2YWx1ZT1cImNvbnRhaW5cIj5Db250YWluPC9vcHRpb24+JztcclxuICAgICAgdmFyIHNlYXJjaEtleSA9ICd2YWx1ZT1cIicgKyBjb21tb25GaXQgKyAnXCInO1xyXG4gICAgICB2YXIgaW5kZXggPSBvcHRpb25zLmluZGV4T2Yoc2VhcmNoS2V5KSArIHNlYXJjaEtleS5sZW5ndGg7XHJcbiAgICAgIHJldHVybiBvcHRpb25zLnN1YnN0cigwLCBpbmRleCkgKyAnIHNlbGVjdGVkJyArIG9wdGlvbnMuc3Vic3RyKGluZGV4KTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldEZpdE9wdGlvbihub2RlKSB7XHJcbiAgICAgICAgaWYoIWVsZW1lbnRVdGlsaXRpZXMuaGFzQmFja2dyb3VuZEltYWdlKG5vZGUpKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgZiA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1maXQnKTtcclxuICAgICAgICB2YXIgaCA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnKTtcclxuXHJcbiAgICAgICAgaWYoIWYgfHwgIWgpXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGYgPSBmLnNwbGl0KFwiIFwiKTtcclxuICAgICAgICBoID0gaC5zcGxpdChcIiBcIik7XHJcbiAgICAgICAgaWYoZltmLmxlbmd0aC0xXSA9PT0gXCJub25lXCIpXHJcbiAgICAgICAgICByZXR1cm4gKGhbaC5sZW5ndGgtMV0gPT09IFwiYXV0b1wiID8gXCJub25lXCIgOiBcImZpdFwiKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICByZXR1cm4gZltmLmxlbmd0aC0xXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKG5vZGVzLCBiZ09iaikge1xyXG4gICAgICBpZighbm9kZXMgfHwgbm9kZXMubGVuZ3RoID09IDAgfHwgIWJnT2JqKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICB2YXIgb2JqID0gYmdPYmpbbm9kZS5kYXRhKCdpZCcpXTtcclxuICAgICAgICBpZighb2JqIHx8ICQuaXNFbXB0eU9iamVjdChvYmopKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIHZhciBpbWdzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKS5zcGxpdChcIiBcIikgOiBbXTtcclxuICAgICAgICB2YXIgeFBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG4gICAgICAgIHZhciB5UG9zID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15Jykuc3BsaXQoXCIgXCIpIDogW107XHJcbiAgICAgICAgdmFyIHdpZHRocyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJykuc3BsaXQoXCIgXCIpIDogW107XHJcbiAgICAgICAgdmFyIGhlaWdodHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0Jykuc3BsaXQoXCIgXCIpIDogW107XHJcbiAgICAgICAgdmFyIGZpdHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0Jykuc3BsaXQoXCIgXCIpIDogW107XHJcbiAgICAgICAgdmFyIG9wYWNpdGllcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5JykgPyAoXCJcIiArIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5JykpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG5cclxuICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICBpZih0eXBlb2Ygb2JqWydiYWNrZ3JvdW5kLWltYWdlJ10gPT09IFwic3RyaW5nXCIpXHJcbiAgICAgICAgICBpbmRleCA9IGltZ3MuaW5kZXhPZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSk7XHJcbiAgICAgICAgZWxzZSBpZihBcnJheS5pc0FycmF5KG9ialsnYmFja2dyb3VuZC1pbWFnZSddKSlcclxuICAgICAgICAgIGluZGV4ID0gaW1ncy5pbmRleE9mKG9ialsnYmFja2dyb3VuZC1pbWFnZSddWzBdKTtcclxuXHJcbiAgICAgICAgaWYoaW5kZXggPCAwKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGlmKG9ialsnYmFja2dyb3VuZC1pbWFnZSddICYmIGltZ3MubGVuZ3RoID4gaW5kZXgpe1xyXG4gICAgICAgICAgdmFyIHRtcCA9IGltZ3NbaW5kZXhdO1xyXG4gICAgICAgICAgaW1nc1tpbmRleF0gPSBvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXTtcclxuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC1pbWFnZSddID0gdG1wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtZml0J10gJiYgZml0cy5sZW5ndGggPiBpbmRleCl7XHJcbiAgICAgICAgICB2YXIgdG1wID0gZml0c1tpbmRleF07XHJcbiAgICAgICAgICBmaXRzW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1maXQnXTtcclxuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC1maXQnXSA9IHRtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqWydiYWNrZ3JvdW5kLXdpZHRoJ10gJiYgd2lkdGhzLmxlbmd0aCA+IGluZGV4KXtcclxuICAgICAgICAgIHZhciB0bXAgPSB3aWR0aHNbaW5kZXhdO1xyXG4gICAgICAgICAgd2lkdGhzW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC13aWR0aCddO1xyXG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLXdpZHRoJ10gPSB0bXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9ialsnYmFja2dyb3VuZC1oZWlnaHQnXSAmJiBoZWlnaHRzLmxlbmd0aCA+IGluZGV4KXtcclxuICAgICAgICAgIHZhciB0bXAgPSBoZWlnaHRzW2luZGV4XTtcclxuICAgICAgICAgIGhlaWdodHNbaW5kZXhdID0gb2JqWydiYWNrZ3JvdW5kLWhlaWdodCddO1xyXG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLWhlaWdodCddID0gdG1wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihvYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teCddICYmIHhQb3MubGVuZ3RoID4gaW5kZXgpe1xyXG4gICAgICAgICAgdmFyIHRtcCA9IHhQb3NbaW5kZXhdO1xyXG4gICAgICAgICAgeFBvc1tpbmRleF0gPSBvYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teCddO1xyXG4gICAgICAgICAgb2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnXSA9IHRtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYob2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXknXSAmJiB5UG9zLmxlbmd0aCA+IGluZGV4KXtcclxuICAgICAgICAgIHZhciB0bXAgPSB5UG9zW2luZGV4XTtcclxuICAgICAgICAgIHlQb3NbaW5kZXhdID0gb2JqWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXknXTtcclxuICAgICAgICAgIG9ialsnYmFja2dyb3VuZC1wb3NpdGlvbi15J10gPSB0bXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG9ialsnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5J10gJiYgb3BhY2l0aWVzLmxlbmd0aCA+IGluZGV4KXtcclxuICAgICAgICAgIHZhciB0bXAgPSBvcGFjaXRpZXNbaW5kZXhdO1xyXG4gICAgICAgICAgb3BhY2l0aWVzW2luZGV4XSA9IG9ialsnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5J107XHJcbiAgICAgICAgICBvYmpbJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eSddID0gdG1wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJywgaW1ncy5qb2luKFwiIFwiKSk7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnLCB4UG9zLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScsIHlQb3Muam9pbihcIiBcIikpO1xyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcsIHdpZHRocy5qb2luKFwiIFwiKSk7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWhlaWdodCcsIGhlaWdodHMuam9pbihcIiBcIikpO1xyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1maXQnLCBmaXRzLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScsIG9wYWNpdGllcy5qb2luKFwiIFwiKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBiZ09iajtcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChub2Rlcywgb2xkSW1nLCBuZXdJbWcsIGZpcnN0VGltZSwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCkge1xyXG4gICAgICBpZighbm9kZXMgfHwgbm9kZXMubGVuZ3RoID09IDAgfHwgIW9sZEltZyB8fCAhbmV3SW1nKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlQmFja2dyb3VuZEltYWdlKG5vZGVzLCBvbGRJbWcpO1xyXG4gICAgICBmb3IodmFyIGtleSBpbiBuZXdJbWcpe1xyXG4gICAgICAgIG5ld0ltZ1trZXldWydmaXJzdFRpbWUnXSA9IGZpcnN0VGltZTtcclxuICAgICAgfVxyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEJhY2tncm91bmRJbWFnZShub2RlcywgbmV3SW1nLCB1cGRhdGVJbmZvLCBwcm9tcHRJbnZhbGlkSW1hZ2UsIHZhbGlkYXRlVVJMKTtcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICAgIG9sZEltZzogbmV3SW1nLFxyXG4gICAgICAgIG5ld0ltZzogb2xkSW1nLFxyXG4gICAgICAgIGZpcnN0VGltZTogZmFsc2UsXHJcbiAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlOiBwcm9tcHRJbnZhbGlkSW1hZ2UsXHJcbiAgICAgICAgdmFsaWRhdGVVUkw6IHZhbGlkYXRlVVJMXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGEgYmFja2dyb3VuZCBpbWFnZSB0byBnaXZlbiBub2Rlcy5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKG5vZGVzLCBiZ09iaiwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCkge1xyXG4gICAgICBpZighbm9kZXMgfHwgbm9kZXMubGVuZ3RoID09IDAgfHwgIWJnT2JqKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICB2YXIgb2JqID0gYmdPYmpbbm9kZS5kYXRhKCdpZCcpXTtcclxuICAgICAgICBpZighb2JqIHx8ICQuaXNFbXB0eU9iamVjdChvYmopKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIC8vIExvYWQgdGhlIGltYWdlIGZyb20gbG9jYWwsIGVsc2UganVzdCBwdXQgdGhlIFVSTFxyXG4gICAgICAgIGlmKG9ialsnZnJvbUZpbGUnXSlcclxuICAgICAgICBsb2FkQmFja2dyb3VuZFRoZW5BcHBseShub2RlLCBvYmopO1xyXG4gICAgICAgIC8vIFZhbGlkaXR5IG9mIGdpdmVuIFVSTCBzaG91bGQgYmUgY2hlY2tlZCBiZWZvcmUgYXBwbHlpbmcgaXRcclxuICAgICAgICBlbHNlIGlmKG9ialsnZmlyc3RUaW1lJ10pe1xyXG4gICAgICAgICAgaWYodHlwZW9mIHZhbGlkYXRlVVJMID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgICB2YWxpZGF0ZVVSTChub2RlLCBvYmosIGFwcGx5QmFja2dyb3VuZCwgcHJvbXB0SW52YWxpZEltYWdlKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgY2hlY2tHaXZlblVSTChub2RlLCBvYmopO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBhcHBseUJhY2tncm91bmQobm9kZSwgb2JqKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gbG9hZEJhY2tncm91bmRUaGVuQXBwbHkobm9kZSwgYmdPYmopIHtcclxuICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICB2YXIgaW1nRmlsZSA9IGJnT2JqWydiYWNrZ3JvdW5kLWltYWdlJ107XHJcblxyXG4gICAgICAgIC8vIENoZWNrIHdoZXRoZXIgZ2l2ZW4gZmlsZSBpcyBhbiBpbWFnZSBmaWxlXHJcbiAgICAgICAgaWYoaW1nRmlsZS50eXBlLmluZGV4T2YoXCJpbWFnZVwiKSAhPT0gMCl7XHJcbiAgICAgICAgICBpZihwcm9tcHRJbnZhbGlkSW1hZ2UpXHJcbiAgICAgICAgICAgIHByb21wdEludmFsaWRJbWFnZShcIkludmFsaWQgaW1hZ2UgZmlsZSBpcyBnaXZlbiFcIik7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChpbWdGaWxlKTtcclxuXHJcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICB2YXIgaW1nID0gcmVhZGVyLnJlc3VsdDtcclxuICAgICAgICAgIGlmKGltZyl7XHJcbiAgICAgICAgICAgIGJnT2JqWydiYWNrZ3JvdW5kLWltYWdlJ10gPSBpbWc7XHJcbiAgICAgICAgICAgIGJnT2JqWydmcm9tRmlsZSddID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGFwcGx5QmFja2dyb3VuZChub2RlLCBiZ09iaik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICBpZihwcm9tcHRJbnZhbGlkSW1hZ2UpXHJcbiAgICAgICAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlKFwiR2l2ZW4gZmlsZSBjb3VsZCBub3QgYmUgcmVhZCFcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gY2hlY2tHaXZlblVSTChub2RlLCBiZ09iail7XHJcbiAgICAgICAgdmFyIHVybCA9IGJnT2JqWydiYWNrZ3JvdW5kLWltYWdlJ107XHJcbiAgICAgICAgdmFyIGV4dGVuc2lvbiA9ICh1cmwuc3BsaXQoL1s/I10vKVswXSkuc3BsaXQoXCIuXCIpLnBvcCgpO1xyXG4gICAgICAgIHZhciB2YWxpZEV4dGVuc2lvbnMgPSBbXCJwbmdcIiwgXCJzdmdcIiwgXCJqcGdcIiwgXCJqcGVnXCJdO1xyXG5cclxuICAgICAgICBpZighdmFsaWRFeHRlbnNpb25zLmluY2x1ZGVzKGV4dGVuc2lvbikpe1xyXG4gICAgICAgICAgaWYodHlwZW9mIHByb21wdEludmFsaWRJbWFnZSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlKFwiSW52YWxpZCBVUkwgaXMgZ2l2ZW4hXCIpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXN1bHQsIHN0YXR1cywgeGhyKXtcclxuICAgICAgICAgICAgYXBwbHlCYWNrZ3JvdW5kKG5vZGUsIGJnT2JqKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycm9yKXtcclxuICAgICAgICAgICAgaWYocHJvbXB0SW52YWxpZEltYWdlKVxyXG4gICAgICAgICAgICAgIHByb21wdEludmFsaWRJbWFnZShcIkludmFsaWQgVVJMIGlzIGdpdmVuIVwiKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGFwcGx5QmFja2dyb3VuZChub2RlLCBiZ09iaikge1xyXG5cclxuICAgICAgICBpZihlbGVtZW50VXRpbGl0aWVzLmhhc0JhY2tncm91bmRJbWFnZShub2RlKSlcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIGltZ3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG4gICAgICAgIHZhciB4UG9zID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14Jykuc3BsaXQoXCIgXCIpIDogW107XHJcbiAgICAgICAgdmFyIHlQb3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknKS5zcGxpdChcIiBcIikgOiBbXTtcclxuICAgICAgICB2YXIgd2lkdGhzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKS5zcGxpdChcIiBcIikgOiBbXTtcclxuICAgICAgICB2YXIgaGVpZ2h0cyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnKS5zcGxpdChcIiBcIikgOiBbXTtcclxuICAgICAgICB2YXIgZml0cyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1maXQnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1maXQnKS5zcGxpdChcIiBcIikgOiBbXTtcclxuICAgICAgICB2YXIgb3BhY2l0aWVzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSA/IChcIlwiICsgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknKSkuc3BsaXQoXCIgXCIpIDogW107XHJcblxyXG4gICAgICAgIHZhciBpbmRleFRvSW5zZXJ0ID0gaW1ncy5sZW5ndGg7XHJcblxyXG4gICAgICAgIC8vIGluc2VydCB0byBsZW5ndGgtMVxyXG4gICAgICAgIGlmKGhhc0Nsb25lTWFya2VyKG5vZGUsIGltZ3MpKXtcclxuICAgICAgICAgIGluZGV4VG9JbnNlcnQtLTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGltZ3Muc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLWltYWdlJ10pO1xyXG4gICAgICAgIGZpdHMuc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLWZpdCddKTtcclxuICAgICAgICBvcGFjaXRpZXMuc3BsaWNlKGluZGV4VG9JbnNlcnQsIDAsIGJnT2JqWydiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknXSk7XHJcbiAgICAgICAgeFBvcy5zcGxpY2UoaW5kZXhUb0luc2VydCwgMCwgYmdPYmpbJ2JhY2tncm91bmQtcG9zaXRpb24teCddKTtcclxuICAgICAgICB5UG9zLnNwbGljZShpbmRleFRvSW5zZXJ0LCAwLCBiZ09ialsnYmFja2dyb3VuZC1wb3NpdGlvbi15J10pO1xyXG4gICAgICAgIHdpZHRocy5zcGxpY2UoaW5kZXhUb0luc2VydCwgMCwgYmdPYmpbJ2JhY2tncm91bmQtd2lkdGgnXSk7XHJcbiAgICAgICAgaGVpZ2h0cy5zcGxpY2UoaW5kZXhUb0luc2VydCwgMCwgYmdPYmpbJ2JhY2tncm91bmQtaGVpZ2h0J10pO1xyXG5cclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2UnLCBpbWdzLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcsIHhQb3Muam9pbihcIiBcIikpO1xyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JywgeVBvcy5qb2luKFwiIFwiKSk7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXdpZHRoJywgd2lkdGhzLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtaGVpZ2h0JywgaGVpZ2h0cy5qb2luKFwiIFwiKSk7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcsIGZpdHMuam9pbihcIiBcIikpO1xyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZS1vcGFjaXR5Jywgb3BhY2l0aWVzLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBiZ09ialsnZmlyc3RUaW1lJ10gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYodXBkYXRlSW5mbylcclxuICAgICAgICAgIHVwZGF0ZUluZm8oKTtcclxuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGhhc0Nsb25lTWFya2VyKG5vZGUsIGltZ3Mpe1xyXG4gICAgICAgIHZhciBjbG9uZUltZyA9ICdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCwlM0NzdmclMjB3aWR0aCUzRCUyMjEwMCUyMiUyMGhlaWdodCUzRCUyMjEwMCUyMiUyMHZpZXdCb3glM0QlMjIwJTIwMCUyMDEwMCUyMDEwMCUyMiUyMHN0eWxlJTNEJTIyZmlsbCUzQW5vbmUlM0JzdHJva2UlM0FibGFjayUzQnN0cm9rZS13aWR0aCUzQTAlM0IlMjIlMjB4bWxucyUzRCUyMmh0dHAlM0EvL3d3dy53My5vcmcvMjAwMC9zdmclMjIlMjAlM0UlM0NyZWN0JTIweCUzRCUyMjAlMjIlMjB5JTNEJTIyMCUyMiUyMHdpZHRoJTNEJTIyMTAwJTIyJTIwaGVpZ2h0JTNEJTIyMTAwJTIyJTIwc3R5bGUlM0QlMjJmaWxsJTNBJTIzYTlhOWE5JTIyLyUzRSUyMCUzQy9zdmclM0UnO1xyXG4gICAgICAgIHJldHVybiAoaW1ncy5pbmRleE9mKGNsb25lSW1nKSA+IC0xKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBSZW1vdmUgYSBiYWNrZ3JvdW5kIGltYWdlIGZyb20gZ2l2ZW4gbm9kZXMuXHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChub2RlcywgYmdPYmopIHtcclxuICAgICAgaWYoIW5vZGVzIHx8IG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFiZ09iailcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgICAgdmFyIG9iaiA9IGJnT2JqW25vZGUuZGF0YSgnaWQnKV07XHJcbiAgICAgICAgaWYoIW9iailcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICB2YXIgaW1ncyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlJykuc3BsaXQoXCIgXCIpIDogW107XHJcbiAgICAgICAgdmFyIHhQb3MgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnKS5zcGxpdChcIiBcIikgOiBbXTtcclxuICAgICAgICB2YXIgeVBvcyA9IG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi15JykgPyBub2RlLmRhdGEoJ2JhY2tncm91bmQtcG9zaXRpb24teScpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG4gICAgICAgIHZhciB3aWR0aHMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnKSA/IG5vZGUuZGF0YSgnYmFja2dyb3VuZC13aWR0aCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG4gICAgICAgIHZhciBoZWlnaHRzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWhlaWdodCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWhlaWdodCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG4gICAgICAgIHZhciBmaXRzID0gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpID8gbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWZpdCcpLnNwbGl0KFwiIFwiKSA6IFtdO1xyXG4gICAgICAgIHZhciBvcGFjaXRpZXMgPSBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScpID8gKFwiXCIgKyBub2RlLmRhdGEoJ2JhY2tncm91bmQtaW1hZ2Utb3BhY2l0eScpKS5zcGxpdChcIiBcIikgOiBbXTtcclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgaWYodHlwZW9mIG9ialsnYmFja2dyb3VuZC1pbWFnZSddID09PSBcInN0cmluZ1wiKVxyXG4gICAgICAgICAgaW5kZXggPSBpbWdzLmluZGV4T2Yob2JqWydiYWNrZ3JvdW5kLWltYWdlJ10pO1xyXG4gICAgICAgIGVsc2UgaWYoQXJyYXkuaXNBcnJheShvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXSkpXHJcbiAgICAgICAgICBpbmRleCA9IGltZ3MuaW5kZXhPZihvYmpbJ2JhY2tncm91bmQtaW1hZ2UnXVswXSk7XHJcblxyXG4gICAgICAgIGlmKGluZGV4ID4gLTEpe1xyXG4gICAgICAgICAgaW1ncy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgZml0cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgb3BhY2l0aWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICB4UG9zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICB5UG9zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICB3aWR0aHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgIGhlaWdodHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1pbWFnZScsIGltZ3Muam9pbihcIiBcIikpO1xyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1wb3NpdGlvbi14JywgeFBvcy5qb2luKFwiIFwiKSk7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLXBvc2l0aW9uLXknLCB5UG9zLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtd2lkdGgnLCB3aWR0aHMuam9pbihcIiBcIikpO1xyXG4gICAgICAgIG5vZGUuZGF0YSgnYmFja2dyb3VuZC1oZWlnaHQnLCBoZWlnaHRzLmpvaW4oXCIgXCIpKTtcclxuICAgICAgICBub2RlLmRhdGEoJ2JhY2tncm91bmQtZml0JywgZml0cy5qb2luKFwiIFwiKSk7XHJcbiAgICAgICAgbm9kZS5kYXRhKCdiYWNrZ3JvdW5kLWltYWdlLW9wYWNpdHknLCBvcGFjaXRpZXMuam9pbihcIiBcIikpO1xyXG4gICAgICAgIGJnT2JqWydmaXJzdFRpbWUnXSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMucmV2ZXJzZUVkZ2UgPSBmdW5jdGlvbihlZGdlKXtcclxuICAgICAgdmFyIG9sZFNvdXJjZSA9IGVkZ2Uuc291cmNlKCkuaWQoKTtcclxuICAgICAgdmFyIG9sZFRhcmdldCA9IGVkZ2UudGFyZ2V0KCkuaWQoKTtcclxuICAgICAgdmFyIG9sZFBvcnRTb3VyY2UgPSBlZGdlLmRhdGEoXCJwb3J0c291cmNlXCIpO1xyXG4gICAgICB2YXIgb2xkUG9ydFRhcmdldCA9IGVkZ2UuZGF0YShcInBvcnR0YXJnZXRcIik7XHJcbiAgICAgIHZhciBzZWdtZW50UG9pbnRzID0gZWRnZS5zZWdtZW50UG9pbnRzKCk7XHJcblxyXG5cclxuICAgICAgZWRnZS5kYXRhKCkuc291cmNlID0gb2xkVGFyZ2V0O1xyXG4gICAgICBlZGdlLmRhdGEoKS50YXJnZXQgPSBvbGRTb3VyY2U7XHJcbiAgICAgIGVkZ2UuZGF0YSgpLnBvcnRzb3VyY2UgPSBvbGRQb3J0VGFyZ2V0O1xyXG4gICAgICBlZGdlLmRhdGEoKS5wb3J0dGFyZ2V0ID0gb2xkUG9ydFNvdXJjZTtcclxuICAgICAgIGVkZ2UgPSBlZGdlLm1vdmUoe1xyXG4gICAgICAgICB0YXJnZXQ6IG9sZFNvdXJjZSxcclxuICAgICAgICAgc291cmNlIDogb2xkVGFyZ2V0ICAgICAgICBcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZihBcnJheS5pc0FycmF5KHNlZ21lbnRQb2ludHMpKXtcclxuICAgICAgICBzZWdtZW50UG9pbnRzLnJldmVyc2UoKTtcclxuICAgICAgICBlZGdlLmRhdGEoKS5iZW5kUG9pbnRQb3NpdGlvbnMgPSBzZWdtZW50UG9pbnRzO1xyXG4gICAgICAgIHZhciBlZGdlRWRpdGluZyA9IGN5LmVkZ2VFZGl0aW5nKCdnZXQnKTtcclxuICAgICAgICBlZGdlRWRpdGluZy5pbml0QmVuZFBvaW50cyhlZGdlKTtcclxuICAgICAgfVxyXG4gICAgXHJcblxyXG4gICAgICByZXR1cm4gZWRnZTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICByZXR1cm4gZWxlbWVudFV0aWxpdGllc0V4dGVuZGVyO1xyXG59O1xyXG4iLCIvKiBcclxuICogVXRpbGl0eSBmaWxlIHRvIGdldCBhbmQgc2V0IHRoZSBsaWJyYXJpZXMgdG8gd2hpY2ggc2JnbnZpeiBpcyBkZXBlbmRlbnQgZnJvbSBhbnkgZmlsZS5cclxuICovXHJcblxyXG52YXIgbGliVXRpbGl0aWVzID0gZnVuY3Rpb24oKXtcclxufTtcclxuXHJcbmxpYlV0aWxpdGllcy5zZXRMaWJzID0gZnVuY3Rpb24obGlicykge1xyXG4gIHRoaXMubGlicyA9IGxpYnM7XHJcbn07XHJcblxyXG5saWJVdGlsaXRpZXMuZ2V0TGlicyA9IGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB0aGlzLmxpYnM7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpYlV0aWxpdGllczsiLCJ2YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxuXHJcbi8qXHJcbiAqIFRoZSBtYWluIHV0aWxpdGllcyB0byBiZSBleHBvc2VkIGRpcmVjdGx5LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gIHZhciBlbGVtZW50VXRpbGl0aWVzLCBvcHRpb25zLCBjeSwgc2JnbnZpekluc3RhbmNlO1xyXG5cclxuICBmdW5jdGlvbiBtYWluVXRpbGl0aWVzIChwYXJhbSkge1xyXG4gICAgZWxlbWVudFV0aWxpdGllcyA9IHBhcmFtLmVsZW1lbnRVdGlsaXRpZXM7XHJcbiAgICBvcHRpb25zID0gcGFyYW0ub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KCk7XHJcbiAgICBzYmdudml6SW5zdGFuY2UgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0SW5zdGFuY2UoKTtcclxuICB9O1xyXG5cclxuICAvKlxyXG4gICAqIEFkZHMgYSBuZXcgbm9kZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgYXQgdGhlIGdpdmVuIGNvb3JkaW5hdGVzLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuYWRkTm9kZSA9IGZ1bmN0aW9uKHgsIHkgLCBub2RlUGFyYW1zLCBpZCwgcGFyZW50LCB2aXNpYmlsaXR5KSB7XHJcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgbWFwIHR5cGVcclxuICAgIGlmICh0eXBlb2Ygbm9kZVBhcmFtcyA9PSAnb2JqZWN0Jyl7XHJcbi8qIFxyXG4gICAgICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKVxyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShub2RlUGFyYW1zLmxhbmd1YWdlKTtcclxuICAgICAgZWxzZSBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgIT0gbm9kZVBhcmFtcy5sYW5ndWFnZSlcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJVbmtub3duXCIpOyAqL1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGROb2RlKHgsIHksIG5vZGVQYXJhbXMsIGlkLCBwYXJlbnQsIHZpc2liaWxpdHkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICBuZXdOb2RlIDoge1xyXG4gICAgICAgICAgeDogeCxcclxuICAgICAgICAgIHk6IHksXHJcbiAgICAgICAgICBjbGFzczogbm9kZVBhcmFtcyxcclxuICAgICAgICAgIGlkOiBpZCxcclxuICAgICAgICAgIHBhcmVudDogcGFyZW50LFxyXG4gICAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJpbGl0eVxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGROb2RlXCIsIHBhcmFtKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKlxyXG4gICAqIEFkZHMgYSBuZXcgZWRnZSB3aXRoIHRoZSBnaXZlbiBjbGFzcyBhbmQgaGF2aW5nIHRoZSBnaXZlbiBzb3VyY2UgYW5kIHRhcmdldCBpZHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5hZGRFZGdlID0gZnVuY3Rpb24oc291cmNlLCB0YXJnZXQsIGVkZ2VQYXJhbXMsIGludmFsaWRFZGdlQ2FsbGJhY2ssIGlkLCB2aXNpYmlsaXR5KSB7XHJcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1cGRhdGUgbWFwIHR5cGVcclxuICAgIGlmICh0eXBlb2YgZWRnZVBhcmFtcyA9PSAnb2JqZWN0Jyl7XHJcblxyXG4gICAgIC8qICBpZiAoIWVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpKVxyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0TWFwVHlwZShlZGdlUGFyYW1zLmxhbmd1YWdlKTtcclxuICAgICAgZWxzZSBpZiAoZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCkgIT0gZWRnZVBhcmFtcy5sYW5ndWFnZSlcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUoXCJIeWJyaWRBbnlcIik7ICovXHJcbiAgICB9XHJcbiAgICAvLyBHZXQgdGhlIHZhbGlkYXRpb24gcmVzdWx0XHJcbiAgICB2YXIgZWRnZWNsYXNzID0gZWRnZVBhcmFtcy5jbGFzcyA/IGVkZ2VQYXJhbXMuY2xhc3MgOiBlZGdlUGFyYW1zO1xyXG4gICAgdmFyIHZhbGlkYXRpb24gPSBlbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzKGVkZ2VjbGFzcywgY3kuZ2V0RWxlbWVudEJ5SWQoc291cmNlKSwgY3kuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0KSk7XHJcblxyXG4gICAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ2ludmFsaWQnIGNhbmNlbCB0aGUgb3BlcmF0aW9uXHJcbiAgICBpZiAodmFsaWRhdGlvbiA9PT0gJ2ludmFsaWQnKSB7XHJcbiAgICAgIGlmKHR5cGVvZiBpbnZhbGlkRWRnZUNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpe1xyXG4gICAgICAgIGludmFsaWRFZGdlQ2FsbGJhY2soKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgdmFsaWRhdGlvbiByZXN1bHQgaXMgJ3JldmVyc2UnIHJldmVyc2UgdGhlIHNvdXJjZS10YXJnZXQgcGFpciBiZWZvcmUgY3JlYXRpbmcgdGhlIGVkZ2VcclxuICAgIGlmICh2YWxpZGF0aW9uID09PSAncmV2ZXJzZScpIHtcclxuICAgICAgdmFyIHRlbXAgPSBzb3VyY2U7XHJcbiAgICAgIHNvdXJjZSA9IHRhcmdldDtcclxuICAgICAgdGFyZ2V0ID0gdGVtcDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZShzb3VyY2UsIHRhcmdldCwgZWRnZVBhcmFtcywgaWQsIHZpc2liaWxpdHkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICBuZXdFZGdlIDoge1xyXG4gICAgICAgICAgc291cmNlOiBzb3VyY2UsXHJcbiAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcclxuICAgICAgICAgIGNsYXNzOiBlZGdlUGFyYW1zLFxyXG4gICAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJpbGl0eVxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHZhciByZXN1bHQgPSBjeS51bmRvUmVkbygpLmRvKFwiYWRkRWRnZVwiLCBwYXJhbSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQuZWxlcztcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKlxyXG4gICAqIEFkZHMgYSBwcm9jZXNzIHdpdGggY29udmVuaWVudCBlZGdlcy4gRm9yIG1vcmUgaW5mb3JtYXRpb24gcGxlYXNlIHNlZSAnaHR0cHM6Ly9naXRodWIuY29tL2lWaXMtYXQtQmlsa2VudC9uZXd0L2lzc3Vlcy85Jy5cclxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXMgPSBmdW5jdGlvbihfc291cmNlLCBfdGFyZ2V0LCBwcm9jZXNzVHlwZSkge1xyXG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgc291cmNlIGFuZCB0YXJnZXQgSURzIGFyZSBnaXZlbiBnZXQgdGhlIGVsZW1lbnRzIGJ5IElEc1xyXG4gICAgdmFyIHNvdXJjZSA9IHR5cGVvZiBfc291cmNlID09PSAnc3RyaW5nJyA/IGN5LmdldEVsZW1lbnRCeUlkKF9zb3VyY2UpIDogX3NvdXJjZTtcclxuICAgIHZhciB0YXJnZXQgPSB0eXBlb2YgX3RhcmdldCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfdGFyZ2V0KSA6IF90YXJnZXQ7XHJcblxyXG4gICAgLy8gSWYgc291cmNlIG9yIHRhcmdldCBkb2VzIG5vdCBoYXZlIGFuIEVQTiBjbGFzcyB0aGUgb3BlcmF0aW9uIGlzIG5vdCB2YWxpZFxyXG4gICAgaWYgKCFlbGVtZW50VXRpbGl0aWVzLmlzRVBOQ2xhc3Moc291cmNlKSB8fCAhZWxlbWVudFV0aWxpdGllcy5pc0VQTkNsYXNzKHRhcmdldCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyhfc291cmNlLCBfdGFyZ2V0LCBwcm9jZXNzVHlwZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIHNvdXJjZTogX3NvdXJjZSxcclxuICAgICAgICB0YXJnZXQ6IF90YXJnZXQsXHJcbiAgICAgICAgcHJvY2Vzc1R5cGU6IHByb2Nlc3NUeXBlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiYWRkUHJvY2Vzc1dpdGhDb252ZW5pZW50RWRnZXNcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8vIGNvbnZlcnQgY29sbGFwc2VkIGNvbXBvdW5kIG5vZGVzIHRvIHNpbXBsZSBub2Rlc1xyXG4gIC8vIGFuZCB1cGRhdGUgcG9ydCB2YWx1ZXMgb2YgcGFzdGVkIG5vZGVzIGFuZCBlZGdlc1xyXG4gIHZhciBjbG9uZUNvbGxhcHNlZE5vZGVzQW5kUG9ydHMgPSBmdW5jdGlvbiAoZWxlc0JlZm9yZSl7XHJcbiAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgICB2YXIgZWxlc0FmdGVyID0gY3kuZWxlbWVudHMoKTtcclxuICAgIHZhciBlbGVzRGlmZiA9IGVsZXNBZnRlci5kaWZmKGVsZXNCZWZvcmUpLmxlZnQ7XHJcblxyXG4gICAgLy8gc2hhbGxvdyBjb3B5IGNvbGxhcHNlZCBub2RlcyAtIGNvbGxhcHNlZCBjb21wb3VuZHMgYmVjb21lIHNpbXBsZSBub2Rlc1xyXG4gICAgLy8gZGF0YSByZWxhdGVkIHRvIGNvbGxhcHNlZCBub2RlcyBhcmUgcmVtb3ZlZCBmcm9tIGdlbmVyYXRlZCBjbG9uZXNcclxuICAgIC8vIHJlbGF0ZWQgaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9pVmlzLWF0LUJpbGtlbnQvbmV3dC9pc3N1ZXMvMTQ1XHJcbiAgICB2YXIgY29sbGFwc2VkTm9kZXMgPSBlbGVzRGlmZi5maWx0ZXIoJ25vZGUuY3ktZXhwYW5kLWNvbGxhcHNlLWNvbGxhcHNlZC1ub2RlJyk7XHJcblxyXG4gICAgY29sbGFwc2VkTm9kZXMuY29ubmVjdGVkRWRnZXMoKS5yZW1vdmUoKTtcclxuICAgIGNvbGxhcHNlZE5vZGVzLnJlbW92ZUNsYXNzKCdjeS1leHBhbmQtY29sbGFwc2UtY29sbGFwc2VkLW5vZGUnKTtcclxuICAgIGNvbGxhcHNlZE5vZGVzLnJlbW92ZURhdGEoJ2NvbGxhcHNlZENoaWxkcmVuJyk7XHJcbiAgICBjb2xsYXBzZWROb2Rlcy5yZW1vdmVEYXRhKCdwb3NpdGlvbi1iZWZvcmUtY29sbGFwc2Ugc2l6ZS1iZWZvcmUtY29sbGFwc2UnKTtcclxuICAgIGNvbGxhcHNlZE5vZGVzLnJlbW92ZURhdGEoJ2V4cGFuZGNvbGxhcHNlUmVuZGVyZWRDdWVTaXplIGV4cGFuZGNvbGxhcHNlUmVuZGVyZWRTdGFydFggZXhwYW5kY29sbGFwc2VSZW5kZXJlZFN0YXJ0WScpO1xyXG5cclxuICAgIC8vIGNsb25pbmcgcG9ydHNcclxuICAgIGVsZXNEaWZmLm5vZGVzKCkuZm9yRWFjaChmdW5jdGlvbihfbm9kZSl7XHJcbiAgICAgIGlmKF9ub2RlLmRhdGEoXCJwb3J0c1wiKS5sZW5ndGggPT0gMil7XHJcbiAgICAgICAgICB2YXIgb2xkUG9ydE5hbWUwID0gX25vZGUuZGF0YShcInBvcnRzXCIpWzBdLmlkO1xyXG4gICAgICAgICAgdmFyIG9sZFBvcnROYW1lMSA9IF9ub2RlLmRhdGEoXCJwb3J0c1wiKVsxXS5pZDtcclxuICAgICAgICAgIF9ub2RlLmRhdGEoXCJwb3J0c1wiKVswXS5pZCA9IF9ub2RlLmlkKCkgKyBcIi4xXCI7XHJcbiAgICAgICAgICBfbm9kZS5kYXRhKFwicG9ydHNcIilbMV0uaWQgPSBfbm9kZS5pZCgpICsgXCIuMlwiO1xyXG5cclxuICAgICAgICAgIF9ub2RlLm91dGdvZXJzKCkuZWRnZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKF9lZGdlKXtcclxuICAgICAgICAgICAgaWYoX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIikgPT0gb2xkUG9ydE5hbWUwKXtcclxuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiLCBfbm9kZS5kYXRhKFwicG9ydHNcIilbMF0uaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIikgPT0gb2xkUG9ydE5hbWUxKXtcclxuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiLCBfbm9kZS5kYXRhKFwicG9ydHNcIilbMV0uaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgX2VkZ2UuZGF0YShcInBvcnRzb3VyY2VcIiwgX25vZGUuaWQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgX25vZGUuaW5jb21lcnMoKS5lZGdlcygpLmZvckVhY2goZnVuY3Rpb24oX2VkZ2Upe1xyXG4gICAgICAgICAgICBpZihfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiKSA9PSBvbGRQb3J0TmFtZTApe1xyXG4gICAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIF9ub2RlLmRhdGEoXCJwb3J0c1wiKVswXS5pZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiKSA9PSBvbGRQb3J0TmFtZTEpe1xyXG4gICAgICAgICAgICAgIF9lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIsIF9ub2RlLmRhdGEoXCJwb3J0c1wiKVsxXS5pZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiLCBfbm9kZS5pZCgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBfbm9kZS5vdXRnb2VycygpLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbihfZWRnZSl7XHJcbiAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHNvdXJjZVwiLCBfbm9kZS5pZCgpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBfbm9kZS5pbmNvbWVycygpLmVkZ2VzKCkuZm9yRWFjaChmdW5jdGlvbihfZWRnZSl7XHJcbiAgICAgICAgICBfZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiLCBfbm9kZS5pZCgpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBlbGVzRGlmZi5zZWxlY3QoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgICogQ2xvbmUgZ2l2ZW4gZWxlbWVudHMuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uIFJlcXVpcmVzIGN5dG9zY2FwZS1jbGlwYm9hcmQgZXh0ZW5zaW9uLlxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuY2xvbmVFbGVtZW50cyA9IGZ1bmN0aW9uIChlbGVzLCBwYXN0ZUF0TW91c2VMb2MpIHtcclxuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb3B5RWxlbWVudHMoZWxlcyk7XHJcblxyXG4gICAgdGhpcy5wYXN0ZUVsZW1lbnRzKHBhc3RlQXRNb3VzZUxvYyk7XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBDb3B5IGdpdmVuIGVsZW1lbnRzIHRvIGNsaXBib2FyZC4gUmVxdWlyZXMgY3l0b3NjYXBlLWNsaXBib2FyZCBleHRlbnNpb24uXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5jb3B5RWxlbWVudHMgPSBmdW5jdGlvbiAoZWxlcykge1xyXG4gICAgY3kuY2xpcGJvYXJkKCkuY29weShlbGVzKTtcclxuICB9O1xyXG5cclxuICAvKlxyXG4gICAqIFBhc3RlIHRoZSBlbGVtZW50cyBjb3BpZWQgdG8gY2xpcGJvYXJkLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBSZXF1aXJlcyBjeXRvc2NhcGUtY2xpcGJvYXJkIGV4dGVuc2lvbi5cclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLnBhc3RlRWxlbWVudHMgPSBmdW5jdGlvbihwYXN0ZUF0TW91c2VMb2MpIHtcclxuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBlbGVzQmVmb3JlID0gY3kuZWxlbWVudHMoKTtcclxuXHJcbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwicGFzdGVcIix7cGFzdGVBdE1vdXNlTG9jOiBwYXN0ZUF0TW91c2VMb2N9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBjeS5jbGlwYm9hcmQoKS5wYXN0ZSgpO1xyXG4gICAgfVxyXG4gICAgY2xvbmVDb2xsYXBzZWROb2Rlc0FuZFBvcnRzKGVsZXNCZWZvcmUpO1xyXG4gICAgY3kubm9kZXMoXCI6c2VsZWN0ZWRcIikuZW1pdCgnZGF0YScpO1xyXG4gIH07XHJcblxyXG4gIC8qXHJcbiAgICogQWxpZ25zIGdpdmVuIG5vZGVzIGluIGdpdmVuIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIG9yZGVyLlxyXG4gICAqIEhvcml6b250YWwgYW5kIHZlcnRpY2FsIHBhcmFtZXRlcnMgbWF5IGJlICdub25lJyBvciB1bmRlZmluZWQuXHJcbiAgICogYWxpZ25UbyBwYXJhbWV0ZXIgaW5kaWNhdGVzIHRoZSBsZWFkaW5nIG5vZGUuXHJcbiAgICogUmVxdXJpcmVzIGN5dG9zY2FwZS1ncmlkLWd1aWRlIGV4dGVuc2lvbiBhbmQgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLmFsaWduID0gZnVuY3Rpb24gKG5vZGVzLCBob3Jpem9udGFsLCB2ZXJ0aWNhbCwgYWxpZ25Ubykge1xyXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImFsaWduXCIsIHtcclxuICAgICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgICAgaG9yaXpvbnRhbDogaG9yaXpvbnRhbCxcclxuICAgICAgICB2ZXJ0aWNhbDogdmVydGljYWwsXHJcbiAgICAgICAgYWxpZ25UbzogYWxpZ25Ub1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5vZGVzLmFsaWduKGhvcml6b250YWwsIHZlcnRpY2FsLCBhbGlnblRvKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKlxyXG4gICAqIENyZWF0ZSBjb21wb3VuZCBmb3IgZ2l2ZW4gbm9kZXMuIGNvbXBvdW5kVHlwZSBtYXkgYmUgJ2NvbXBsZXgnIG9yICdjb21wYXJ0bWVudCcuXHJcbiAgICogVGhpcyBtZXRob2QgY29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChfbm9kZXMsIGNvbXBvdW5kVHlwZSkge1xyXG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG5vZGVzID0gX25vZGVzO1xyXG4gICAgLypcclxuICAgICAqIEVsZW1pbmF0ZSB0aGUgbm9kZXMgd2hpY2ggY2Fubm90IGhhdmUgYSBwYXJlbnQgd2l0aCBnaXZlbiBjb21wb3VuZCB0eXBlXHJcbiAgICAgKi9cclxuICAgIG5vZGVzID0gX25vZGVzLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCwgaSkge1xyXG4gICAgICBpZih0eXBlb2YgZWxlbWVudCA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgIGVsZW1lbnQgPSBpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgc2JnbmNsYXNzID0gZWxlbWVudC5kYXRhKFwiY2xhc3NcIik7XHJcbiAgICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmlzVmFsaWRQYXJlbnQoc2JnbmNsYXNzLCBjb21wb3VuZFR5cGUsIGVsZW1lbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbm9kZXMgPSBlbGVtZW50VXRpbGl0aWVzLmdldFRvcE1vc3ROb2Rlcyhub2Rlcyk7XHJcblxyXG4gICAgLy8gQWxsIGVsZW1lbnRzIHNob3VsZCBoYXZlIHRoZSBzYW1lIHBhcmVudCBhbmQgdGhlIGNvbW1vbiBwYXJlbnQgc2hvdWxkIG5vdCBiZSBhICdjb21wbGV4J1xyXG4gICAgLy8gaWYgY29tcG91bmRUeXBlIGlzICdjb21wYXJ0ZW50J1xyXG4gICAgLy8gYmVjYXVzZSB0aGUgb2xkIGNvbW1vbiBwYXJlbnQgd2lsbCBiZSB0aGUgcGFyZW50IG9mIHRoZSBuZXcgY29tcGFydG1lbnQgYWZ0ZXIgdGhpcyBvcGVyYXRpb24gYW5kXHJcbiAgICAvLyAnY29tcGxleGVzJyBjYW5ub3QgaW5jbHVkZSAnY29tcGFydG1lbnRzJ1xyXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwIHx8ICFlbGVtZW50VXRpbGl0aWVzLmFsbEhhdmVUaGVTYW1lUGFyZW50KG5vZGVzKVxyXG4gICAgICAgICAgICB8fCAoIChjb21wb3VuZFR5cGUgPT09ICdjb21wYXJ0bWVudCcgfHwgY29tcG91bmRUeXBlID09ICdzdWJtYXAnKSAmJiBub2Rlcy5wYXJlbnQoKS5kYXRhKCdjbGFzcycpXHJcbiAgICAgICAgICAgICYmIG5vZGVzLnBhcmVudCgpLmRhdGEoJ2NsYXNzJykuc3RhcnRzV2l0aCgnY29tcGxleCcpICkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjeS51bmRvUmVkbygpKSB7XHJcbiAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICBjb21wb3VuZFR5cGU6IGNvbXBvdW5kVHlwZSxcclxuICAgICAgICBub2Rlc1RvTWFrZUNvbXBvdW5kOiBub2Rlc1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlc1wiLCBwYXJhbSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMobm9kZXMsIGNvbXBvdW5kVHlwZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBNb3ZlIHRoZSBub2RlcyB0byBhIG5ldyBwYXJlbnQgYW5kIGNoYW5nZSB0aGVpciBwb3NpdGlvbiBpZiBwb3NzRGlmZiBwYXJhbXMgYXJlIHNldC5cclxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uIGFuZCBjaGVja3MgaWYgdGhlIG9wZXJhdGlvbiBpcyB2YWxpZC5cclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLmNoYW5nZVBhcmVudCA9IGZ1bmN0aW9uKG5vZGVzLCBfbmV3UGFyZW50LCBwb3NEaWZmWCwgcG9zRGlmZlkpIHtcclxuICAgIGlmICggZWxlbWVudFV0aWxpdGllcy5pc0dyYXBoVG9wb2xvZ3lMb2NrZWQoKSApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBuZXdQYXJlbnQgPSB0eXBlb2YgX25ld1BhcmVudCA9PT0gJ3N0cmluZycgPyBjeS5nZXRFbGVtZW50QnlJZChfbmV3UGFyZW50KSA6IF9uZXdQYXJlbnQ7XHJcbiAgICAvLyBOZXcgcGFyZW50IGlzIHN1cHBvc2VkIHRvIGJlIG9uZSBvZiB0aGUgcm9vdCwgYSBjb21wbGV4IG9yIGEgY29tcGFydG1lbnRcclxuICAgIGlmIChuZXdQYXJlbnQgJiYgIW5ld1BhcmVudC5kYXRhKFwiY2xhc3NcIikuc3RhcnRzV2l0aChcImNvbXBsZXhcIikgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcImNvbXBhcnRtZW50XCJcclxuICAgICAgICAgICAgJiYgbmV3UGFyZW50LmRhdGEoXCJjbGFzc1wiKSAhPSBcInN1Ym1hcFwiKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8qXHJcbiAgICAgKiBFbGVtaW5hdGUgdGhlIG5vZGVzIHdoaWNoIGNhbm5vdCBoYXZlIHRoZSBuZXdQYXJlbnQgYXMgdGhlaXIgcGFyZW50XHJcbiAgICAgKi9cclxuICAgIG5vZGVzID0gbm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XHJcbiAgICAgIGlmKHR5cGVvZiBlbGVtZW50ID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgZWxlbWVudCA9IGk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBzYmduY2xhc3MgPSBlbGVtZW50LmRhdGEoXCJjbGFzc1wiKTtcclxuICAgICAgcmV0dXJuIGVsZW1lbnRVdGlsaXRpZXMuaXNWYWxpZFBhcmVudChzYmduY2xhc3MsIG5ld1BhcmVudCwgZWxlbWVudCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBEaXNjYXJkIHRoZSBub2RlcyB3aG9zZSBwYXJlbnQgaXMgYWxyZWFkeSBuZXdQYXJlbnQuXHJcbiAgICAvLyBEaXNjYXJkIHRoZSBuZXdQYXJlbnQgaXRzZWxmIGlmIGl0IGlzIGFtb25nIHRoZSBub2Rlc1xyXG4gICAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGVsZSwgaSkge1xyXG4gICAgICBpZih0eXBlb2YgZWxlID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgZWxlID0gaTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRGlzY2FyZCB0aGUgbmV3UGFyZW50IGlmIGl0IGlzIGFtb25nIHRoZSBub2Rlc1xyXG4gICAgICBpZiAobmV3UGFyZW50ICYmIGVsZS5pZCgpID09PSBuZXdQYXJlbnQuaWQoKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICAvLyBEaXNjYXJkIHRoZSBub2RlcyB3aG9zZSBwYXJlbnQgaXMgYWxyZWFkeSBuZXdQYXJlbnRcclxuICAgICAgaWYgKCFuZXdQYXJlbnQpIHtcclxuICAgICAgICByZXR1cm4gZWxlLmRhdGEoJ3BhcmVudCcpICE9IG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGVsZS5kYXRhKCdwYXJlbnQnKSAhPT0gbmV3UGFyZW50LmlkKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBJZiBzb21lIG5vZGVzIGFyZSBhbmNlc3RvciBvZiBuZXcgcGFyZW50IGVsZW1pbmF0ZSB0aGVtXHJcbiAgICBpZiAobmV3UGFyZW50KSB7XHJcbiAgICAgIG5vZGVzID0gbm9kZXMuZGlmZmVyZW5jZShuZXdQYXJlbnQuYW5jZXN0b3JzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGFsbCBub2RlcyBhcmUgZWxlbWluYXRlZCByZXR1cm4gZGlyZWN0bHlcclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEp1c3QgbW92ZSB0aGUgdG9wIG1vc3Qgbm9kZXNcclxuICAgIG5vZGVzID0gZWxlbWVudFV0aWxpdGllcy5nZXRUb3BNb3N0Tm9kZXMobm9kZXMpO1xyXG5cclxuICAgIHZhciBwYXJlbnRJZCA9IG5ld1BhcmVudCA/IG5ld1BhcmVudC5pZCgpIDogbnVsbDtcclxuXHJcbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlLFxyXG4gICAgICAgIHBhcmVudERhdGE6IHBhcmVudElkLCAvLyBJdCBrZWVwcyB0aGUgbmV3UGFyZW50SWQgKEp1c3QgYW4gaWQgZm9yIGVhY2ggbm9kZXMgZm9yIHRoZSBmaXJzdCB0aW1lKVxyXG4gICAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgICBwb3NEaWZmWDogcG9zRGlmZlgsXHJcbiAgICAgICAgcG9zRGlmZlk6IHBvc0RpZmZZLFxyXG4gICAgICAgIC8vIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2UgdGhlIGNoYW5nZVBhcmVudCBmdW5jdGlvbiBjYWxsZWQgaXMgbm90IGZyb20gZWxlbWVudFV0aWxpdGllc1xyXG4gICAgICAgIC8vIGJ1dCBmcm9tIHRoZSB1bmRvUmVkbyBleHRlbnNpb24gZGlyZWN0bHksIHNvIG1haW50YWluaW5nIHBvaW50ZXIgaXMgbm90IGF1dG9tYXRpY2FsbHkgZG9uZS5cclxuICAgICAgICBjYWxsYmFjazogZWxlbWVudFV0aWxpdGllcy5tYWludGFpblBvaW50ZXJcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VQYXJlbnRcIiwgcGFyYW0pOyAvLyBUaGlzIGFjdGlvbiBpcyByZWdpc3RlcmVkIGJ5IHVuZG9SZWRvIGV4dGVuc2lvblxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlUGFyZW50KG5vZGVzLCBwYXJlbnRJZCwgcG9zRGlmZlgsIHBvc0RpZmZZKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKlxyXG4gICAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSByZWFjdGlvbiB3aXRoIGdpdmVuIHBhcmFtZXRlcnMuIFJlcXVpcmVzIGNvc2UtYmlsa2VudCBsYXlvdXQgdG8gdGlsZSB0aGUgZnJlZSBtYWNyb21vbGVjdWxlcyBpbmNsdWRlZFxyXG4gICAqIGluIHRoZSBjb21wbGV4LiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgdGhlIHNhbWUgZnVuY3Rpb24gaW4gZWxlbWVudFV0aWxpdGllc1xyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbiA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoLCBsYXlvdXRQYXJhbSkge1xyXG4gICAgaWYgKCBlbGVtZW50VXRpbGl0aWVzLmlzR3JhcGhUb3BvbG9neUxvY2tlZCgpICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbih0ZW1wbGF0ZVR5cGUsIG1hY3JvbW9sZWN1bGVMaXN0LCBjb21wbGV4TmFtZSwgcHJvY2Vzc1Bvc2l0aW9uLCB0aWxpbmdQYWRkaW5nVmVydGljYWwsIHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBlZGdlTGVuZ3RoLCBsYXlvdXRQYXJhbSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIHRlbXBsYXRlVHlwZTogdGVtcGxhdGVUeXBlLFxyXG4gICAgICAgIG1hY3JvbW9sZWN1bGVMaXN0OiBtYWNyb21vbGVjdWxlTGlzdCxcclxuICAgICAgICBjb21wbGV4TmFtZTogY29tcGxleE5hbWUsXHJcbiAgICAgICAgcHJvY2Vzc1Bvc2l0aW9uOiBwcm9jZXNzUG9zaXRpb24sXHJcbiAgICAgICAgdGlsaW5nUGFkZGluZ1ZlcnRpY2FsOiB0aWxpbmdQYWRkaW5nVmVydGljYWwsXHJcbiAgICAgICAgdGlsaW5nUGFkZGluZ0hvcml6b250YWw6IHRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLFxyXG4gICAgICAgIGVkZ2VMZW5ndGg6IGVkZ2VMZW5ndGgsXHJcbiAgICAgICAgbGF5b3V0UGFyYW06IGxheW91dFBhcmFtXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCBwYXJhbSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBSZXNpemUgZ2l2ZW4gbm9kZXMgaWYgdXNlQXNwZWN0UmF0aW8gaXMgdHJ1dGh5IG9uZSBvZiB3aWR0aCBvciBoZWlnaHQgc2hvdWxkIG5vdCBiZSBzZXQuXHJcbiAgICogQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24obm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvLCBwcmVzZXJ2ZVJlbGF0aXZlUG9zKSB7XHJcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICAgIHdpZHRoOiB3aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IGhlaWdodCxcclxuICAgICAgICB1c2VBc3BlY3RSYXRpbzogdXNlQXNwZWN0UmF0aW8sXHJcbiAgICAgICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZSxcclxuICAgICAgICBwcmVzZXJ2ZVJlbGF0aXZlUG9zOiBwcmVzZXJ2ZVJlbGF0aXZlUG9zXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwicmVzaXplTm9kZXNcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMobm9kZXMsIHdpZHRoLCBoZWlnaHQsIHVzZUFzcGVjdFJhdGlvKTtcclxuICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICAgIH1cclxuXHJcblxyXG4gIH07XHJcblxyXG4gICAgLypcclxuICAgICAqIFJlc2l6ZSBnaXZlbiBub2RlcyBpZiB1c2VBc3BlY3RSYXRpbyBpcyB0cnV0aHkgb25lIG9mIHdpZHRoIG9yIGhlaWdodCBzaG91bGQgbm90IGJlIHNldC5cclxuICAgICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgICAgKi9cclxuICAgIG1haW5VdGlsaXRpZXMucmVzaXplTm9kZXNUb0NvbnRlbnQgPSBmdW5jdGlvbihub2RlcywgdXNlQXNwZWN0UmF0aW8pIHtcclxuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcclxuICAgICAgICAgICAgdmFyIHdpZHRoID0gZWxlbWVudFV0aWxpdGllcy5jYWxjdWxhdGVNaW5XaWR0aChub2RlKTtcclxuICAgICAgICAgICAgdmFyIGhlaWdodCA9IGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluSGVpZ2h0KG5vZGUpO1xyXG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwicmVzaXplTm9kZXNcIiwgcGFyYW06IHtcclxuICAgICAgICAgICAgICAgIG5vZGVzOiBub2RlLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB1c2VBc3BlY3RSYXRpbzogdXNlQXNwZWN0UmF0aW8sXHJcbiAgICAgICAgICAgICAgICBwZXJmb3JtT3BlcmF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcHJlc2VydmVSZWxhdGl2ZVBvczogdHJ1ZVxyXG4gICAgICAgICAgICB9fSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc3RhdGVBbmRJbmZvcyA9IG5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKTtcclxuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IHN0YXRlQW5kSW5mb3MubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAobGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgICAgICAgICBub2RlOiBub2RlLFxyXG4gICAgICAgICAgICAgICAgbG9jYXRpb25zOiBbXCJ0b3BcIixcInJpZ2h0XCIsXCJib3R0b21cIixcImxlZnRcIl1cclxuICAgICAgICAgICAgICB9OyAgICAgICAgICBcclxuICAgICAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6XCJmaXRVbml0c1wiLHBhcmFtIDogcGFyYW19KVxyXG4gICAgICAgICAgICAgfVxyXG4gIFxyXG5cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICAgXHJcbiAgICAgICAgICBjeS51bmRvUmVkbygpLmRvKFwiYmF0Y2hcIiwgYWN0aW9ucyk7XHJcbiAgICAgICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgcmV0dXJuIGFjdGlvbnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgICAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluV2lkdGgobm9kZSk7XHJcbiAgICAgICAgICAgICAgdmFyIGhlaWdodCA9IGVsZW1lbnRVdGlsaXRpZXMuY2FsY3VsYXRlTWluSGVpZ2h0KG5vZGUpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMobm9kZSwgd2lkdGgsIGhlaWdodCwgdXNlQXNwZWN0UmF0aW8sIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgICB9O1xyXG5cclxuICAvKlxyXG4gICAqIENoYW5nZXMgdGhlIGxhYmVsIG9mIHRoZSBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gbGFiZWwuIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VOb2RlTGFiZWwgPSBmdW5jdGlvbihub2RlcywgbGFiZWwpIHtcclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICBub2Rlcy5kYXRhKCdsYWJlbCcsIGxhYmVsKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICAgIGxhYmVsOiBsYWJlbCxcclxuICAgICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJjaGFuZ2VOb2RlTGFiZWxcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG5cclxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIGZvciBnaXZlbiBub2RlcyB1c2UgdGhlIGdpdmVuIGZvbnQgZGF0YS5cclxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbihlbGVzLCBkYXRhKSB7XHJcbiAgICBpZiAoZWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICBlbGVzOiBlbGVzLFxyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlRm9udFByb3BlcnRpZXNcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRm9udFByb3BlcnRpZXMoZWxlcywgZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICB9O1xyXG5cclxuICAvKlxyXG4gICAqIENoYW5nZSBzdGF0ZSB2YWx1ZSBvciB1bml0IG9mIGluZm9ybWF0aW9uIGJveCBvZiBnaXZlbiBub2RlcyB3aXRoIGdpdmVuIGluZGV4LlxyXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHBhcmFtZXRlcnMgc2VlIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3hcclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24obm9kZXMsIGluZGV4LCB2YWx1ZSwgdHlwZSkge1xyXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgaW5kZXg6IGluZGV4LFxyXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZVN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VTdGF0ZU9ySW5mb0JveChub2RlcywgaW5kZXgsIHZhbHVlLCB0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gIH07XHJcblxyXG4gIC8vIEFkZCBhIG5ldyBzdGF0ZSBvciBpbmZvIGJveCB0byBnaXZlbiBub2Rlcy5cclxuICAvLyBUaGUgYm94IGlzIHJlcHJlc2VudGVkIGJ5IHRoZSBwYXJhbWV0ZXIgb2JqLlxyXG4gIC8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgbWFpblV0aWxpdGllcy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBvYmopIHtcclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICBvYmo6IG9iaixcclxuICAgICAgICBub2Rlczogbm9kZXNcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRTdGF0ZU9ySW5mb0JveFwiLCBwYXJhbSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICB9O1xyXG5cclxuICAvLyBSZW1vdmUgdGhlIHN0YXRlIG9yIGluZm8gYm94ZXMgb2YgdGhlIGdpdmVuIG5vZGVzIGF0IGdpdmVuIGluZGV4LlxyXG4gIC8vIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgbWFpblV0aWxpdGllcy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uKG5vZGVzLCBpbmRleCkge1xyXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3gobm9kZXMsIHtpbmRleDogaW5kZXh9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgbG9jYXRpb25PYmo6IHtpbmRleDogaW5kZXh9LFxyXG4gICAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInJlbW92ZVN0YXRlT3JJbmZvQm94XCIsIHBhcmFtKTtcclxuICAgIH1cclxuXHJcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gIH07XHJcblxyXG5cclxuICAvL0FycmFuZ2UgaW5mb3JtYXRpb24gYm94ZXNcclxuICAvL0lmIGZvcmNlIGNoZWNrIGlzIHRydWUsIGl0IHJlYXJyYW5nZXMgYWxsIGluZm9ybWF0aW9uIGJveGVzXHJcbiAgbWFpblV0aWxpdGllcy5maXRVbml0cyA9IGZ1bmN0aW9uIChub2RlLCBsb2NhdGlvbnMpIHtcclxuICAgIGlmIChub2RlLmRhdGEoJ2F1eHVuaXRsYXlvdXRzJykgPT09IHVuZGVmaW5lZCB8fCBub2RlLmRhdGEoJ3N0YXRlc2FuZGluZm9zJykubGVuZ3RoIDw9IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKGxvY2F0aW9ucyA9PT0gdW5kZWZpbmVkIHx8IGxvY2F0aW9ucy5sZW5ndGggPD0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuZml0VW5pdHMobm9kZSwgbG9jYXRpb25zKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgbm9kZTogbm9kZSxcclxuICAgICAgICBsb2NhdGlvbnM6IGxvY2F0aW9uc1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImZpdFVuaXRzXCIsIHBhcmFtKTtcclxuICAgIH1cclxuXHJcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gIH07XHJcblxyXG4gIC8qXHJcbiAgICogU2V0IG11bHRpbWVyIHN0YXR1cyBvZiB0aGUgZ2l2ZW4gbm9kZXMgdG8gdGhlIGdpdmVuIHN0YXR1cy5cclxuICAgKiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuc2V0TXVsdGltZXJTdGF0dXMgPSBmdW5jdGlvbihub2Rlcywgc3RhdHVzKSB7XHJcbiAgICBpZiAobm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgc3RhdHVzOiBzdGF0dXMsXHJcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICAgIGZpcnN0VGltZTogdHJ1ZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInNldE11bHRpbWVyU3RhdHVzXCIsIHBhcmFtKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE11bHRpbWVyU3RhdHVzKG5vZGVzLCBzdGF0dXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBTZXQgY2xvbmUgbWFya2VyIHN0YXR1cyBvZiBnaXZlbiBub2RlcyB0byB0aGUgZ2l2ZW4gc3RhdHVzLlxyXG4gICAqIENvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uKG5vZGVzLCBzdGF0dXMpIHtcclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICBzdGF0dXM6IHN0YXR1cyxcclxuICAgICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwic2V0Q2xvbmVNYXJrZXJTdGF0dXNcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZXMsIHN0YXR1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICB9O1xyXG5cclxuICAvKlxyXG4gICAqIENoYW5nZSBzdHlsZS9jc3Mgb2YgZ2l2ZW4gZWxlcyBieSBzZXR0aW5nIGdldHRpbmcgcHJvcGVydHkgbmFtZSB0byB0aGUgZ2l2ZW4gZ2l2ZW4gdmFsdWUvdmFsdWVzIChOb3RlIHRoYXQgdmFsdWVNYXAgcGFyYW1ldGVyIG1heSBiZVxyXG4gICAqIGEgc2luZ2xlIHN0cmluZyBvciBhbiBpZCB0byB2YWx1ZSBtYXApLiBDb25zaWRlcnMgdW5kb2FibGUgb3B0aW9uLlxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuY2hhbmdlQ3NzID0gZnVuY3Rpb24oZWxlcywgbmFtZSwgdmFsdWVNYXApIHtcclxuICAgIGlmIChlbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlQ3NzKGVsZXMsIG5hbWUsIHZhbHVlTWFwKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgZWxlczogZWxlcyxcclxuICAgICAgICB2YWx1ZU1hcDogdmFsdWVNYXAsXHJcbiAgICAgICAgbmFtZTogbmFtZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZUNzc1wiLCBwYXJhbSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICB9O1xyXG5cclxuICAvKlxyXG4gICAqIENoYW5nZSBkYXRhIG9mIGdpdmVuIGVsZXMgYnkgc2V0dGluZyBnZXR0aW5nIHByb3BlcnR5IG5hbWUgdG8gdGhlIGdpdmVuIGdpdmVuIHZhbHVlL3ZhbHVlcyAoTm90ZSB0aGF0IHZhbHVlTWFwIHBhcmFtZXRlciBtYXkgYmVcclxuICAgKiBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gaWQgdG8gdmFsdWUgbWFwKS4gQ29uc2lkZXJzIHVuZG9hYmxlIG9wdGlvbi5cclxuICAgKi9cclxuICBtYWluVXRpbGl0aWVzLmNoYW5nZURhdGEgPSBmdW5jdGlvbihlbGVzLCBuYW1lLCB2YWx1ZU1hcCkge1xyXG4gICAgaWYgKGVsZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVsZXMsIG5hbWUsIHZhbHVlTWFwKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgZWxlczogZWxlcyxcclxuICAgICAgICB2YWx1ZU1hcDogdmFsdWVNYXAsXHJcbiAgICAgICAgbmFtZTogbmFtZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImNoYW5nZURhdGFcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG5cclxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgfTtcclxuXHJcbiAgbWFpblV0aWxpdGllcy51cGRhdGVTZXRGaWVsZCA9IGZ1bmN0aW9uKGVsZSwgZmllbGROYW1lLCB0b0RlbGV0ZSwgdG9BZGQsIGNhbGxiYWNrKSB7XHJcbiAgICBpZiAoIW9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVsZSwgZmllbGROYW1lLCB0b0RlbGV0ZSwgdG9BZGQsIGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgZWxlLFxyXG4gICAgICAgIGZpZWxkTmFtZSxcclxuICAgICAgICB0b0RlbGV0ZSxcclxuICAgICAgICB0b0FkZCxcclxuICAgICAgICBjYWxsYmFja1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInVwZGF0ZVNldEZpZWxkXCIsIHBhcmFtKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBtYWluVXRpbGl0aWVzLnNldERlZmF1bHRQcm9wZXJ0eSA9IGZ1bmN0aW9uKCBfY2xhc3MsIG5hbWUsIHZhbHVlICkge1xyXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIHZhciBwcm9wTWFwID0ge307XHJcbiAgICAgIHByb3BNYXBbIG5hbWUgXSA9IHZhbHVlO1xyXG5cclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXREZWZhdWx0UHJvcGVydGllcyhfY2xhc3MsIHByb3BNYXApO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICBjbGFzczogX2NsYXNzLFxyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgdmFsdWVcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJzZXREZWZhdWx0UHJvcGVydHlcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG1haW5VdGlsaXRpZXMudXBkYXRlSW5mb2JveFN0eWxlID0gZnVuY3Rpb24oIG5vZGUsIGluZGV4LCBuZXdQcm9wcyApIHtcclxuICAgIGlmICghb3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hTdHlsZSggbm9kZSwgaW5kZXgsIG5ld1Byb3BzICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIG5vZGU6IG5vZGUsXHJcbiAgICAgICAgaW5kZXg6IGluZGV4LFxyXG4gICAgICAgIG5ld1Byb3BzOiBuZXdQcm9wc1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInVwZGF0ZUluZm9ib3hTdHlsZVwiLCBwYXJhbSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICB9O1xyXG5cclxuICBtYWluVXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hPYmogPSBmdW5jdGlvbiggbm9kZSwgaW5kZXgsIG5ld1Byb3BzICkge1xyXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlSW5mb2JveE9iaiggbm9kZSwgaW5kZXgsIG5ld1Byb3BzICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIG5vZGU6IG5vZGUsXHJcbiAgICAgICAgaW5kZXg6IGluZGV4LFxyXG4gICAgICAgIG5ld1Byb3BzOiBuZXdQcm9wc1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInVwZGF0ZUluZm9ib3hPYmpcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG5cclxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICogSGlkZXMgZ2l2ZW4gZWxlcyAodGhlIG9uZXMgd2hpY2ggYXJlIHNlbGVjdGVkKSBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xyXG4gICAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5oaWRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGVsZXMsIGxheW91dHBhcmFtKSB7XHJcbiAgICAgIHZhciBub2RlcyA9IGVsZXMubm9kZXMoKTsgLy8gRW5zdXJlIHRoYXQgbm9kZXMgbGlzdCBqdXN0IGluY2x1ZGUgbm9kZXNcclxuXHJcbiAgICAgIHZhciBhbGxOb2RlcyA9IGN5Lm5vZGVzKFwiOnZpc2libGVcIik7XHJcbiAgICAgIHZhciBub2Rlc1RvU2hvdyA9IGVsZW1lbnRVdGlsaXRpZXMuZXh0ZW5kUmVtYWluaW5nTm9kZXMobm9kZXMsIGFsbE5vZGVzKTtcclxuICAgICAgdmFyIG5vZGVzVG9IaWRlID0gYWxsTm9kZXMubm90KG5vZGVzVG9TaG93KTtcclxuXHJcbiAgICAgIGlmIChub2Rlc1RvSGlkZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcblxyXG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xyXG4gICAgICAgICAgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xyXG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5oaWRlQW5kUGVyZm9ybUxheW91dChub2Rlc1RvSGlkZSwgbGF5b3V0cGFyYW0pO1xyXG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCc6dmlzaWJsZScpO1xyXG4gICAgICAgICAgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgICAgICAgIGVsZXM6IG5vZGVzVG9IaWRlLFxyXG4gICAgICAgICAgICAgIGxheW91dHBhcmFtOiBsYXlvdXRwYXJhbSxcclxuICAgICAgICAgICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdmFyIHVyID0gY3kudW5kb1JlZG8oKTtcclxuICAgICAgICAgIHVyLmFjdGlvbihcInRoaWNrZW5Cb3JkZXJcIiwgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKTtcclxuICAgICAgICAgIHVyLmFjdGlvbihcInRoaW5Cb3JkZXJcIiwgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyKTtcclxuXHJcbiAgICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgdmFyIG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yID0gY3kuZWRnZXMoXCI6aGlkZGVuXCIpLmNvbm5lY3RlZE5vZGVzKCkuaW50ZXJzZWN0aW9uKG5vZGVzVG9IaWRlKTtcclxuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGluQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcn0pO1xyXG4gICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcImhpZGVBbmRQZXJmb3JtTGF5b3V0XCIsIHBhcmFtOiBwYXJhbX0pO1xyXG4gICAgICAgICAgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBub2Rlc1RvSGlkZS5uZWlnaGJvcmhvb2QoXCI6dmlzaWJsZVwiKS5ub2RlcygpLmRpZmZlcmVuY2Uobm9kZXNUb0hpZGUpLmRpZmZlcmVuY2UoY3kubm9kZXMoXCJbdGhpY2tCb3JkZXJdXCIpKTtcclxuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGlja2VuQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcn0pO1xyXG4gICAgICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImJhdGNoXCIsIGFjdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBTaG93cyBhbGwgZWxlbWVudHMgKHRoZSBvbmVzIHdoaWNoIGFyZSBoaWRkZW4gaWYgYW55KSBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xyXG4gICAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5zaG93QWxsQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKGxheW91dHBhcmFtKSB7XHJcbiAgICB2YXIgaGlkZGVuRWxlcyA9IGN5LmVsZW1lbnRzKCc6aGlkZGVuJyk7XHJcbiAgICBpZiAoaGlkZGVuRWxlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcclxuICAgICAgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIobm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IpO1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KGhpZGRlbkVsZXMsIGxheW91dHBhcmFtKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgZWxlczogaGlkZGVuRWxlcyxcclxuICAgICAgICBsYXlvdXRwYXJhbTogbGF5b3V0cGFyYW0sXHJcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB2YXIgdXIgPSBjeS51bmRvUmVkbygpO1xyXG4gICAgICB1ci5hY3Rpb24oXCJ0aGlja2VuQm9yZGVyXCIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyLCBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcik7XHJcbiAgICAgIHVyLmFjdGlvbihcInRoaW5Cb3JkZXJcIiwgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyKTtcclxuXHJcbiAgICAgIHZhciBhY3Rpb25zID0gW107XHJcbiAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5Lm5vZGVzKFwiW3RoaWNrQm9yZGVyXVwiKTtcclxuICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInRoaW5Cb3JkZXJcIiwgcGFyYW06IG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yfSk7XHJcbiAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJzaG93QW5kUGVyZm9ybUxheW91dFwiLCBwYXJhbTogcGFyYW19KTtcclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcImJhdGNoXCIsIGFjdGlvbnMpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qXHJcbiAgICogVW5oaWRlIGdpdmVuIGVsZXMgKHRoZSBvbmVzIHdoaWNoIGFyZSBoaWRkZW4gaWYgYW55KSBhbmQgcGVyZm9ybSBnaXZlbiBsYXlvdXQgYWZ0ZXJ3YXJkLiBMYXlvdXQgcGFyYW1ldGVyIG1heSBiZSBsYXlvdXQgb3B0aW9uc1xyXG4gICAqIG9yIGEgZnVuY3Rpb24gdG8gY2FsbC4gUmVxdWlyZXMgdmlld1V0aWxpdGllcyBleHRlbnNpb24gYW5kIGNvbnNpZGVycyB1bmRvYWJsZSBvcHRpb24uXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5zaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uKG1haW5FbGUsIGVsZXMsIGxheW91dHBhcmFtKSB7XHJcbiAgICAgIHZhciBoaWRkZW5FbGVzID0gZWxlcy5maWx0ZXIoJzpoaWRkZW4nKTtcclxuICAgICAgaWYgKGhpZGRlbkVsZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgbWFpblV0aWxpdGllcy5jbG9zZVVwRWxlbWVudHMobWFpbkVsZSwgaGlkZGVuRWxlcy5ub2RlcygpKTtcclxuICAgICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgICAgICB2YXIgbm9kZXNXaXRoSGlkZGVuTmVpZ2hib3IgPSBjeS5lZGdlcyhcIjpoaWRkZW5cIikuY29ubmVjdGVkTm9kZXMoJzp2aXNpYmxlJyk7XHJcbiAgICAgICAgICBzYmdudml6SW5zdGFuY2UudGhpbkJvcmRlcihub2Rlc1dpdGhIaWRkZW5OZWlnaGJvcik7XHJcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNob3dBbmRQZXJmb3JtTGF5b3V0KGhpZGRlbkVsZXMsIGxheW91dHBhcmFtKTtcclxuICAgICAgICAgIHZhciBub2Rlc1dpdGhIaWRkZW5OZWlnaGJvciA9IGN5LmVkZ2VzKFwiOmhpZGRlblwiKS5jb25uZWN0ZWROb2RlcygnOnZpc2libGUnKTtcclxuICAgICAgICAgIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyKG5vZGVzV2l0aEhpZGRlbk5laWdoYm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICAgICAgICBlbGVzOiBoaWRkZW5FbGVzLFxyXG4gICAgICAgICAgICAgIGxheW91dHBhcmFtOiBsYXlvdXRwYXJhbSxcclxuICAgICAgICAgICAgICBmaXJzdFRpbWU6IHRydWVcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdmFyIHVyID0gY3kudW5kb1JlZG8oKTtcclxuICAgICAgICAgIHVyLmFjdGlvbihcInRoaWNrZW5Cb3JkZXJcIiwgc2JnbnZpekluc3RhbmNlLnRoaWNrZW5Cb3JkZXIsIHNiZ252aXpJbnN0YW5jZS50aGluQm9yZGVyKTtcclxuICAgICAgICAgIHVyLmFjdGlvbihcInRoaW5Cb3JkZXJcIiwgc2JnbnZpekluc3RhbmNlLnRoaW5Cb3JkZXIsIHNiZ252aXpJbnN0YW5jZS50aGlja2VuQm9yZGVyKTtcclxuXHJcbiAgICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgdmFyIG5vZGVzVG9UaGluQm9yZGVyID0gKGhpZGRlbkVsZXMubmVpZ2hib3Job29kKFwiOnZpc2libGVcIikubm9kZXMoXCJbdGhpY2tCb3JkZXJdXCIpKVxyXG4gICAgICAgICAgICAgICAgICAuZGlmZmVyZW5jZShjeS5lZGdlcyhcIjpoaWRkZW5cIikuZGlmZmVyZW5jZShoaWRkZW5FbGVzLmVkZ2VzKCkudW5pb24oaGlkZGVuRWxlcy5ub2RlcygpLmNvbm5lY3RlZEVkZ2VzKCkpKS5jb25uZWN0ZWROb2RlcygpKTtcclxuICAgICAgICAgIGFjdGlvbnMucHVzaCh7bmFtZTogXCJ0aGluQm9yZGVyXCIsIHBhcmFtOiBub2Rlc1RvVGhpbkJvcmRlcn0pO1xyXG4gICAgICAgICAgYWN0aW9ucy5wdXNoKHtuYW1lOiBcInNob3dBbmRQZXJmb3JtTGF5b3V0XCIsIHBhcmFtOiBwYXJhbX0pO1xyXG4gICAgICAgICAgdmFyIG5vZGVzVG9UaGlja2VuQm9yZGVyID0gaGlkZGVuRWxlcy5ub2RlcygpLmVkZ2VzV2l0aChjeS5ub2RlcyhcIjpoaWRkZW5cIikuZGlmZmVyZW5jZShoaWRkZW5FbGVzLm5vZGVzKCkpKVxyXG4gIFx0ICAgICAgICAgICAgLmNvbm5lY3RlZE5vZGVzKCkuaW50ZXJzZWN0aW9uKGhpZGRlbkVsZXMubm9kZXMoKSk7XHJcbiAgICAgICAgICBhY3Rpb25zLnB1c2goe25hbWU6IFwidGhpY2tlbkJvcmRlclwiLCBwYXJhbTogbm9kZXNUb1RoaWNrZW5Cb3JkZXJ9KTtcclxuICAgICAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJiYXRjaFwiLCBhY3Rpb25zKTtcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIC8qXHJcbiAgKiBUYWtlcyB0aGUgaGlkZGVuIGVsZW1lbnRzIGNsb3NlIHRvIHRoZSBub2RlcyB3aG9zZSBuZWlnaGJvcnMgd2lsbCBiZSBzaG93blxyXG4gICogKi9cclxuICBtYWluVXRpbGl0aWVzLmNsb3NlVXBFbGVtZW50cyA9IGZ1bmN0aW9uKG1haW5FbGUsIGhpZGRlbkVsZXMpIHtcclxuICAgICAgdmFyIGxlZnRYID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgdmFyIHJpZ2h0WCA9IE51bWJlci5NSU5fVkFMVUU7XHJcbiAgICAgIHZhciB0b3BZID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgICAgdmFyIGJvdHRvbVkgPSBOdW1iZXIuTUlOX1ZBTFVFO1xyXG4gICAgICAvLyBDaGVjayB0aGUgeCBhbmQgeSBsaW1pdHMgb2YgYWxsIGhpZGRlbiBlbGVtZW50cyBhbmQgc3RvcmUgdGhlbSBpbiB0aGUgdmFyaWFibGVzIGFib3ZlXHJcbiAgICAgIGhpZGRlbkVsZXMuZm9yRWFjaChmdW5jdGlvbiggZWxlICl7XHJcbiAgICAgICAgICBpZiAoZWxlLmRhdGEoJ2NsYXNzJykgIT0gJ2NvbXBhcnRtZW50JyAmJiAgZWxlLmRhdGEoJ2NsYXNzJykgIT0gJ2NvbXBsZXgnKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHZhciBoYWxmV2lkdGggPSBlbGUub3V0ZXJXaWR0aCgpLzI7XHJcbiAgICAgICAgICAgICAgdmFyIGhhbGZIZWlnaHQgPSBlbGUub3V0ZXJIZWlnaHQoKS8yO1xyXG4gICAgICAgICAgICAgIGlmIChlbGUucG9zaXRpb24oXCJ4XCIpIC0gaGFsZldpZHRoIDwgbGVmdFgpXHJcbiAgICAgICAgICAgICAgICAgIGxlZnRYID0gZWxlLnBvc2l0aW9uKFwieFwiKSAtIGhhbGZXaWR0aDtcclxuICAgICAgICAgICAgICBpZiAoZWxlLnBvc2l0aW9uKFwieFwiKSArIGhhbGZXaWR0aCA+IHJpZ2h0WClcclxuICAgICAgICAgICAgICAgICAgcmlnaHRYID0gZWxlLnBvc2l0aW9uKFwieFwiKSArIGhhbGZXaWR0aDtcclxuICAgICAgICAgICAgICBpZiAoZWxlLnBvc2l0aW9uKFwieVwiKSAtIGhhbGZIZWlnaHQgPCB0b3BZKVxyXG4gICAgICAgICAgICAgICAgICB0b3BZID0gZWxlLnBvc2l0aW9uKFwieVwiKSAtIGhhbGZIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgaWYgKGVsZS5wb3NpdGlvbihcInlcIikgKyBoYWxmSGVpZ2h0ID4gdG9wWSlcclxuICAgICAgICAgICAgICAgICAgYm90dG9tWSA9IGVsZS5wb3NpdGlvbihcInlcIikgKyBoYWxmSGVpZ2h0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vVGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBvbGQgY2VudGVyIGNvbnRhaW5pbmcgdGhlIGhpZGRlbiBub2Rlc1xyXG4gICAgICB2YXIgb2xkQ2VudGVyWCA9IChsZWZ0WCArIHJpZ2h0WCkvMjtcclxuICAgICAgdmFyIG9sZENlbnRlclkgPSAodG9wWSArIGJvdHRvbVkpLzI7XHJcblxyXG4gICAgICAvL0hlcmUgd2UgY2FsY3VsYXRlIHR3byBwYXJhbWV0ZXJzIHdoaWNoIGRlZmluZSB0aGUgYXJlYSBpbiB3aGljaCB0aGUgaGlkZGVuIGVsZW1lbnRzIGFyZSBwbGFjZWQgaW5pdGlhbGx5XHJcbiAgICAgIHZhciBtaW5Ib3Jpem9udGFsUGFyYW0gPSBtYWluRWxlLm91dGVyV2lkdGgoKS8yICsgKHJpZ2h0WCAtIGxlZnRYKS8yO1xyXG4gICAgICB2YXIgbWF4SG9yaXpvbnRhbFBhcmFtID0gbWFpbkVsZS5vdXRlcldpZHRoKCkgKyAocmlnaHRYIC0gbGVmdFgpLzI7XHJcbiAgICAgIHZhciBtaW5WZXJ0aWNhbFBhcmFtID0gbWFpbkVsZS5vdXRlckhlaWdodCgpLzIgKyAoYm90dG9tWSAtIHRvcFkpLzI7XHJcbiAgICAgIHZhciBtYXhWZXJ0aWNhbFBhcmFtID0gbWFpbkVsZS5vdXRlckhlaWdodCgpICsgKGJvdHRvbVkgLSB0b3BZKS8yO1xyXG5cclxuICAgICAgLy9RdWFkcmFudHMgaXMgYW4gb2JqZWN0IG9mIHRoZSBmb3JtIHtmaXJzdDpcIm9idGFpbmVkXCIsIHNlY29uZDpcImZyZWVcIiwgdGhpcmQ6XCJmcmVlXCIsIGZvdXJ0aDpcIm9idGFpbmVkXCJ9XHJcbiAgICAgIC8vIHdoaWNoIGhvbGRzIHdoaWNoIHF1YWRyYW50IGFyZSBmcmVlICh0aGF0J3Mgd2hlcmUgaGlkZGVuIG5vZGVzIHdpbGwgYmUgYnJvdWdodClcclxuICAgICAgdmFyIHF1YWRyYW50cyA9IG1haW5VdGlsaXRpZXMuY2hlY2tPY2N1cGllZFF1YWRyYW50cyhtYWluRWxlLCBoaWRkZW5FbGVzKTtcclxuICAgICAgdmFyIGZyZWVRdWFkcmFudHMgPSBbXTtcclxuICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcXVhZHJhbnRzKSB7XHJcbiAgICAgICAgICBpZiAocXVhZHJhbnRzW3Byb3BlcnR5XSA9PT0gXCJmcmVlXCIpXHJcbiAgICAgICAgICAgICAgZnJlZVF1YWRyYW50cy5wdXNoKHByb3BlcnR5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy9DYW4gdGFrZSB2YWx1ZXMgMSBhbmQgLTEgYW5kIGFyZSB1c2VkIHRvIHBsYWNlIHRoZSBoaWRkZW4gbm9kZXMgaW4gdGhlIHJhbmRvbSBxdWFkcmFudFxyXG4gICAgICB2YXIgaG9yaXpvbnRhbE11bHQ7XHJcbiAgICAgIHZhciB2ZXJ0aWNhbE11bHQ7XHJcbiAgICAgIGlmIChmcmVlUXVhZHJhbnRzLmxlbmd0aCA+IDApXHJcbiAgICAgIHtcclxuICAgICAgICBpZiAoZnJlZVF1YWRyYW50cy5sZW5ndGggPT09IDMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWYgKGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZpcnN0JykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnc2Vjb25kJykgJiYgZnJlZVF1YWRyYW50cy5pbmNsdWRlcygndGhpcmQnKSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAtMTtcclxuICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gLTE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmIChmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdmaXJzdCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ3NlY29uZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZvdXJ0aCcpKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IC0xO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAoZnJlZVF1YWRyYW50cy5pbmNsdWRlcygnZmlyc3QnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCd0aGlyZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZvdXJ0aCcpKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsTXVsdCA9IDE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmIChmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCdzZWNvbmQnKSAmJiBmcmVlUXVhZHJhbnRzLmluY2x1ZGVzKCd0aGlyZCcpICYmIGZyZWVRdWFkcmFudHMuaW5jbHVkZXMoJ2ZvdXJ0aCcpKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IC0xO1xyXG4gICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgLy9SYW5kb21seSBwaWNrcyBvbmUgcXVhZHJhbnQgZnJvbSB0aGUgZnJlZSBxdWFkcmFudHNcclxuICAgICAgICAgIHZhciByYW5kb21RdWFkcmFudCA9IGZyZWVRdWFkcmFudHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmZyZWVRdWFkcmFudHMubGVuZ3RoKV07XHJcblxyXG4gICAgICAgICAgaWYgKHJhbmRvbVF1YWRyYW50ID09PSBcImZpcnN0XCIpIHtcclxuICAgICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XHJcbiAgICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gLTE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmIChyYW5kb21RdWFkcmFudCA9PT0gXCJzZWNvbmRcIikge1xyXG4gICAgICAgICAgICAgIGhvcml6b250YWxNdWx0ID0gLTE7XHJcbiAgICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gLTE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmIChyYW5kb21RdWFkcmFudCA9PT0gXCJ0aGlyZFwiKSB7XHJcbiAgICAgICAgICAgICAgaG9yaXpvbnRhbE11bHQgPSAtMTtcclxuICAgICAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAocmFuZG9tUXVhZHJhbnQgPT09IFwiZm91cnRoXCIpIHtcclxuICAgICAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDE7XHJcbiAgICAgICAgICAgICAgdmVydGljYWxNdWx0ID0gMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICB7XHJcbiAgICAgICAgICBob3Jpem9udGFsTXVsdCA9IDA7XHJcbiAgICAgICAgICB2ZXJ0aWNhbE11bHQgPSAwO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIElmIHRoZSBob3Jpem9udGFsTXVsdCBpcyAwIGl0IG1lYW5zIHRoYXQgbm8gcXVhZHJhbnQgaXMgZnJlZSwgc28gd2UgcmFuZG9tbHkgY2hvb3NlIGEgcXVhZHJhbnRcclxuICAgICAgdmFyIGhvcml6b250YWxQYXJhbSA9IG1haW5VdGlsaXRpZXMuZ2VuZXJhdGVSYW5kb20obWluSG9yaXpvbnRhbFBhcmFtLG1heEhvcml6b250YWxQYXJhbSxob3Jpem9udGFsTXVsdCk7XHJcbiAgICAgIHZhciB2ZXJ0aWNhbFBhcmFtID0gbWFpblV0aWxpdGllcy5nZW5lcmF0ZVJhbmRvbShtaW5WZXJ0aWNhbFBhcmFtLG1heFZlcnRpY2FsUGFyYW0sdmVydGljYWxNdWx0KTtcclxuXHJcbiAgICAgIC8vVGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBjZW50ZXIgd2hlcmUgdGhlIGhpZGRlbiBub2RlcyB3aWxsIGJlIHRyYW5zZmVyZWRcclxuICAgICAgdmFyIG5ld0NlbnRlclggPSBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSArIGhvcml6b250YWxQYXJhbTtcclxuICAgICAgdmFyIG5ld0NlbnRlclkgPSBtYWluRWxlLnBvc2l0aW9uKFwieVwiKSArIHZlcnRpY2FsUGFyYW07XHJcblxyXG4gICAgICB2YXIgeGRpZmYgPSBuZXdDZW50ZXJYIC0gb2xkQ2VudGVyWDtcclxuICAgICAgdmFyIHlkaWZmID0gbmV3Q2VudGVyWSAtIG9sZENlbnRlclk7XHJcblxyXG4gICAgICAvL0NoYW5nZSB0aGUgcG9zaXRpb24gb2YgaGlkZGVuIGVsZW1lbnRzXHJcbiAgICAgIGhpZGRlbkVsZXMuZm9yRWFjaChmdW5jdGlvbiggZWxlICl7XHJcbiAgICAgICAgICB2YXIgbmV3eCA9IGVsZS5wb3NpdGlvbihcInhcIikgKyB4ZGlmZjtcclxuICAgICAgICAgIHZhciBuZXd5ID0gZWxlLnBvc2l0aW9uKFwieVwiKSArIHlkaWZmO1xyXG4gICAgICAgICAgZWxlLnBvc2l0aW9uKFwieFwiLCBuZXd4KTtcclxuICAgICAgICAgIGVsZS5wb3NpdGlvbihcInlcIixuZXd5KTtcclxuICAgICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBHZW5lcmF0ZXMgYSBudW1iZXIgYmV0d2VlbiAyIG5yIGFuZCBtdWx0aW1wbGllcyBpdCB3aXRoIDEgb3IgLTFcclxuICAgKiAqL1xyXG4gIG1haW5VdGlsaXRpZXMuZ2VuZXJhdGVSYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCwgbXVsdCkge1xyXG4gICAgICB2YXIgdmFsID0gWy0xLDFdO1xyXG4gICAgICBpZiAobXVsdCA9PT0gMClcclxuICAgICAgICAgIG11bHQgPSB2YWxbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKnZhbC5sZW5ndGgpXTtcclxuICAgICAgcmV0dXJuIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluKSAqIG11bHQ7XHJcbiAgfTtcclxuXHJcbiAgLypcclxuICAgKiBUaGlzIGZ1bmN0aW9uIG1ha2VzIHN1cmUgdGhhdCB0aGUgcmFuZG9tIG51bWJlciBsaWVzIGluIGZyZWUgcXVhZHJhbnRcclxuICAgKiAqL1xyXG4gIG1haW5VdGlsaXRpZXMuY2hlY2tPY2N1cGllZFF1YWRyYW50cyA9IGZ1bmN0aW9uKG1haW5FbGUsIGhpZGRlbkVsZXMpIHtcclxuICAgICAgaWYgKGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpID09ICdQRCcpXHJcbiAgICAgIHtcclxuICAgICAgICB2YXIgdmlzaWJsZU5laWdoYm9yRWxlcyA9IG1haW5FbGUubmVpZ2hib3Job29kKCkuZGlmZmVyZW5jZShoaWRkZW5FbGVzKS5ub2RlcygpO1xyXG4gICAgICAgIHZhciB2aXNpYmxlTmVpZ2hib3JzT2ZOZWlnaGJvcnMgPSB2aXNpYmxlTmVpZ2hib3JFbGVzLm5laWdoYm9yaG9vZCgpLmRpZmZlcmVuY2UoaGlkZGVuRWxlcykuZGlmZmVyZW5jZShtYWluRWxlKS5ub2RlcygpO1xyXG4gICAgICAgIHZhciB2aXNpYmxlRWxlcyA9IHZpc2libGVOZWlnaGJvckVsZXMudW5pb24odmlzaWJsZU5laWdoYm9yc09mTmVpZ2hib3JzKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdmFyIHZpc2libGVFbGVzID0gbWFpbkVsZS5uZWlnaGJvcmhvb2QoKS5kaWZmZXJlbmNlKGhpZGRlbkVsZXMpLm5vZGVzKCk7XHJcbiAgICAgIHZhciBvY2N1cGllZFF1YWRyYW50cyA9IHtmaXJzdDpcImZyZWVcIiwgc2Vjb25kOlwiZnJlZVwiLCB0aGlyZDpcImZyZWVcIiwgZm91cnRoOlwiZnJlZVwifTtcclxuXHJcbiAgICAgIHZpc2libGVFbGVzLmZvckVhY2goZnVuY3Rpb24oIGVsZSApe1xyXG4gICAgICAgICAgaWYgKGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wYXJ0bWVudCcgJiYgIGVsZS5kYXRhKCdjbGFzcycpICE9ICdjb21wbGV4JylcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBpZiAoZWxlLnBvc2l0aW9uKFwieFwiKSA8IG1haW5FbGUucG9zaXRpb24oXCJ4XCIpICYmIGVsZS5wb3NpdGlvbihcInlcIikgPCBtYWluRWxlLnBvc2l0aW9uKFwieVwiKSlcclxuICAgICAgICAgICAgICAgICAgb2NjdXBpZWRRdWFkcmFudHMuc2Vjb25kID0gXCJvY2N1cGllZFwiO1xyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgPiBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSAmJiBlbGUucG9zaXRpb24oXCJ5XCIpIDwgbWFpbkVsZS5wb3NpdGlvbihcInlcIikpXHJcbiAgICAgICAgICAgICAgICAgIG9jY3VwaWVkUXVhZHJhbnRzLmZpcnN0ID0gXCJvY2N1cGllZFwiO1xyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgPCBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSAmJiBlbGUucG9zaXRpb24oXCJ5XCIpID4gbWFpbkVsZS5wb3NpdGlvbihcInlcIikpXHJcbiAgICAgICAgICAgICAgICAgIG9jY3VwaWVkUXVhZHJhbnRzLnRoaXJkID0gXCJvY2N1cGllZFwiO1xyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKGVsZS5wb3NpdGlvbihcInhcIikgPiBtYWluRWxlLnBvc2l0aW9uKFwieFwiKSAmJiBlbGUucG9zaXRpb24oXCJ5XCIpID4gbWFpbkVsZS5wb3NpdGlvbihcInlcIikpXHJcbiAgICAgICAgICAgICAgICAgIG9jY3VwaWVkUXVhZHJhbnRzLmZvdXJ0aCA9IFwib2NjdXBpZWRcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBvY2N1cGllZFF1YWRyYW50cztcclxuICB9O1xyXG5cclxuICAvLyBPdmVycmlkZXMgaGlnaGxpZ2h0UHJvY2Vzc2VzIGZyb20gU0JHTlZJWiAtIGRvIG5vdCBoaWdobGlnaHQgYW55IG5vZGVzIHdoZW4gdGhlIG1hcCB0eXBlIGlzIEFGXHJcbiAgbWFpblV0aWxpdGllcy5oaWdobGlnaHRQcm9jZXNzZXMgPSBmdW5jdGlvbihfbm9kZXMpIHtcclxuICAgIGlmIChlbGVtZW50VXRpbGl0aWVzLmdldE1hcFR5cGUoKSA9PSBcIkFGXCIpXHJcbiAgICAgIHJldHVybjtcclxuICAgIHNiZ252aXpJbnN0YW5jZS5oaWdobGlnaHRQcm9jZXNzZXMoX25vZGVzKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBSZXNldHMgbWFwIHR5cGUgdG8gdW5kZWZpbmVkXHJcbiAgICovXHJcbiAgbWFpblV0aWxpdGllcy5yZXNldE1hcFR5cGUgPSBmdW5jdGlvbigpe1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5yZXNldE1hcFR5cGUoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiByZXR1cm4gOiBtYXAgdHlwZVxyXG4gICAqL1xyXG4gIG1haW5VdGlsaXRpZXMuZ2V0TWFwVHlwZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCk7XHJcbiAgfTtcclxuXHJcbiAgbWFpblV0aWxpdGllcy5hZGRCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbihub2RlcywgYmdPYmosIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpe1xyXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCB8fCAhYmdPYmopIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGJnT2JqWydmaXJzdFRpbWUnXSA9IHRydWU7XHJcbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgYmdPYmo6IGJnT2JqLFxyXG4gICAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgICB1cGRhdGVJbmZvOiB1cGRhdGVJbmZvLFxyXG4gICAgICAgIHByb21wdEludmFsaWRJbWFnZTogcHJvbXB0SW52YWxpZEltYWdlLFxyXG4gICAgICAgIHZhbGlkYXRlVVJMOiB2YWxpZGF0ZVVSTCxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJhZGRCYWNrZ3JvdW5kSW1hZ2VcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkQmFja2dyb3VuZEltYWdlKG5vZGVzLCBiZ09iaiwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICB9XHJcblxyXG4gIG1haW5VdGlsaXRpZXMucmVtb3ZlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24obm9kZXMsIGJnT2JqKXtcclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDAgfHwgIWJnT2JqKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBiZ09ialsnZmlyc3RUaW1lJ10gPSB0cnVlO1xyXG4gICAgaWYgKG9wdGlvbnMudW5kb2FibGUpIHtcclxuICAgICAgdmFyIHBhcmFtID0ge1xyXG4gICAgICAgIGJnT2JqOiBiZ09iaixcclxuICAgICAgICBub2Rlczogbm9kZXNcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGN5LnVuZG9SZWRvKCkuZG8oXCJyZW1vdmVCYWNrZ3JvdW5kSW1hZ2VcIiwgcGFyYW0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlQmFja2dyb3VuZEltYWdlKG5vZGVzLCBiZ09iaik7XHJcbiAgICB9XHJcblxyXG4gICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICB9XHJcblxyXG4gIG1haW5VdGlsaXRpZXMudXBkYXRlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24obm9kZXMsIGJnT2JqKXtcclxuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDAgfHwgIWJnT2JqKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy51bmRvYWJsZSkge1xyXG4gICAgICB2YXIgcGFyYW0gPSB7XHJcbiAgICAgICAgYmdPYmo6IGJnT2JqLFxyXG4gICAgICAgIG5vZGVzOiBub2Rlc1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY3kudW5kb1JlZG8oKS5kbyhcInVwZGF0ZUJhY2tncm91bmRJbWFnZVwiLCBwYXJhbSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy51cGRhdGVCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIGJnT2JqKTtcclxuICAgIH1cclxuXHJcbiAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgbWFpblV0aWxpdGllcy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbihub2Rlcywgb2xkSW1nLCBuZXdJbWcsIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpe1xyXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCB8fCAhb2xkSW1nIHx8ICFuZXdJbWcpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIHZhciBwYXJhbSA9IHtcclxuICAgICAgICBvbGRJbWc6IG9sZEltZyxcclxuICAgICAgICBuZXdJbWc6IG5ld0ltZyxcclxuICAgICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgICAgZmlyc3RUaW1lOiB0cnVlLFxyXG4gICAgICAgIHVwZGF0ZUluZm86IHVwZGF0ZUluZm8sXHJcbiAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlOiBwcm9tcHRJbnZhbGlkSW1hZ2UsXHJcbiAgICAgICAgdmFsaWRhdGVVUkw6IHZhbGlkYXRlVVJMXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjeS51bmRvUmVkbygpLmRvKFwiY2hhbmdlQmFja2dyb3VuZEltYWdlXCIsIHBhcmFtKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUJhY2tncm91bmRJbWFnZShub2Rlcywgb2xkSW1nLCBuZXdJbWcsIHRydWUsIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpO1xyXG4gICAgfVxyXG5cclxuICAgIGN5LnN0eWxlKCkudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbWFpblV0aWxpdGllcztcclxufTtcclxuIiwiLypcclxuICogIEV4dGVuZCBkZWZhdWx0IG9wdGlvbnMgYW5kIGdldCBjdXJyZW50IG9wdGlvbnMgYnkgdXNpbmcgdGhpcyBmaWxlXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xyXG4gIHZhciBkZWZhdWx0cyA9IHtcclxuICAgIC8vIFRoZSBwYXRoIG9mIGNvcmUgbGlicmFyeSBpbWFnZXMgd2hlbiBzYmdudml6IGlzIHJlcXVpcmVkIGZyb20gbnBtIGFuZCB0aGUgaW5kZXggaHRtbFxyXG4gICAgLy8gZmlsZSBhbmQgbm9kZV9tb2R1bGVzIGFyZSB1bmRlciB0aGUgc2FtZSBmb2xkZXIgdGhlbiB1c2luZyB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBmaW5lXHJcbiAgICBpbWdQYXRoOiAnbm9kZV9tb2R1bGVzL3NiZ252aXovc3JjL2ltZycsXHJcbiAgICAvLyBXaGV0aGVyIHRvIGZpdCBsYWJlbHMgdG8gbm9kZXNcclxuICAgIGZpdExhYmVsc1RvTm9kZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuICAgIGZpdExhYmVsc1RvSW5mb2JveGVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcbiAgICAvLyBkeW5hbWljIGxhYmVsIHNpemUgaXQgbWF5IGJlICdzbWFsbCcsICdyZWd1bGFyJywgJ2xhcmdlJ1xyXG4gICAgZHluYW1pY0xhYmVsU2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gJ3JlZ3VsYXInO1xyXG4gICAgfSxcclxuICAgIC8vIFdoZXRoZXIgdG8gaW5mZXIgbmVzdGluZyBvbiBsb2FkIFxyXG4gICAgaW5mZXJOZXN0aW5nT25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcbiAgICAvLyBwZXJjZW50YWdlIHVzZWQgdG8gY2FsY3VsYXRlIGNvbXBvdW5kIHBhZGRpbmdzXHJcbiAgICBjb21wb3VuZFBhZGRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIDEwO1xyXG4gICAgfSxcclxuICAgIC8vIFRoZSBzZWxlY3RvciBvZiB0aGUgY29tcG9uZW50IGNvbnRhaW5pbmcgdGhlIHNiZ24gbmV0d29ya1xyXG4gICAgbmV0d29ya0NvbnRhaW5lclNlbGVjdG9yOiAnI3NiZ24tbmV0d29yay1jb250YWluZXInLFxyXG4gICAgLy8gV2hldGhlciB0aGUgYWN0aW9ucyBhcmUgdW5kb2FibGUsIHJlcXVpcmVzIGN5dG9zY2FwZS11bmRvLXJlZG8gZXh0ZW5zaW9uXHJcbiAgICB1bmRvYWJsZTogdHJ1ZSxcclxuICAgIC8vIFdoZXRoZXIgdG8gaGF2ZSB1bmRvYWJsZSBkcmFnIGZlYXR1cmUgaW4gdW5kby9yZWRvIGV4dGVuc2lvbi4gVGhpcyBvcHRpb25zIHdpbGwgYmUgcGFzc2VkIHRvIHVuZG8vcmVkbyBleHRlbnNpb25cclxuICAgIHVuZG9hYmxlRHJhZzogdHJ1ZVxyXG4gIH07XHJcblxyXG4gIHZhciBvcHRpb25VdGlsaXRpZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgfTtcclxuXHJcbiAgLy8gRXh0ZW5kIHRoZSBkZWZhdWx0cyBvcHRpb25zIHdpdGggdGhlIHVzZXIgb3B0aW9uc1xyXG4gIG9wdGlvblV0aWxpdGllcy5leHRlbmRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuXHJcbiAgICBmb3IgKHZhciBwcm9wIGluIGRlZmF1bHRzKSB7XHJcbiAgICAgIHJlc3VsdFtwcm9wXSA9IGRlZmF1bHRzW3Byb3BdO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIHByb3AgaW4gb3B0aW9ucykge1xyXG4gICAgICByZXN1bHRbcHJvcF0gPSBvcHRpb25zW3Byb3BdO1xyXG4gICAgfVxyXG5cclxuICAgIG9wdGlvblV0aWxpdGllcy5vcHRpb25zID0gcmVzdWx0O1xyXG5cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG4gIH07XHJcblxyXG4gIG9wdGlvblV0aWxpdGllcy5nZXRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIG9wdGlvblV0aWxpdGllcy5vcHRpb25zO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBvcHRpb25VdGlsaXRpZXM7XHJcbn07XHJcbiIsInZhciBsaWJzID0gcmVxdWlyZSgnLi9saWItdXRpbGl0aWVzJykuZ2V0TGlicygpO1xyXG52YXIgJCA9IGxpYnMualF1ZXJ5O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gIHZhciB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucywgb3B0aW9ucywgY3k7XHJcblxyXG4gIHZhciByZWdpc3RlclVuZG9SZWRvQWN0aW9ucyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gcGFyYW0udW5kb1JlZG9BY3Rpb25GdW5jdGlvbnM7XHJcbiAgICBvcHRpb25zID0gcGFyYW0ub3B0aW9uVXRpbGl0aWVzLmdldE9wdGlvbnMoKTtcclxuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KCk7XHJcblxyXG4gICAgaWYgKCFvcHRpb25zLnVuZG9hYmxlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjcmVhdGUgdW5kby1yZWRvIGluc3RhbmNlXHJcbiAgICB2YXIgdXIgPSBjeS51bmRvUmVkbyh7XHJcbiAgICAgIHVuZG9hYmxlRHJhZzogb3B0aW9ucy51bmRvYWJsZURyYWdcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHJlZ2lzdGVyIGFkZCByZW1vdmUgYWN0aW9uc1xyXG4gICAgdXIuYWN0aW9uKFwiYWRkTm9kZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGROb2RlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcclxuICAgIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTaW1wbGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZGVsZXRlRWxlc1NpbXBsZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZUVsZXMpO1xyXG4gICAgdXIuYWN0aW9uKFwiYWRkRWRnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRFZGdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcclxuICAgIHVyLmFjdGlvbihcImFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcclxuICAgIHVyLmFjdGlvbihcImRlbGV0ZUVsZXNTbWFydFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU21hcnQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc3RvcmVFbGVzKTtcclxuICAgIHVyLmFjdGlvbihcImNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2Rlcyk7XHJcblxyXG4gICAgLy8gcmVnaXN0ZXIgZ2VuZXJhbCBhY3Rpb25zXHJcbiAgICB1ci5hY3Rpb24oXCJyZXNpemVOb2Rlc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXNpemVOb2RlcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzaXplTm9kZXMpO1xyXG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlTm9kZUxhYmVsXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZU5vZGVMYWJlbCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsKTtcclxuICAgIHVyLmFjdGlvbihcImNoYW5nZURhdGFcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRGF0YSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRGF0YSk7XHJcbiAgICB1ci5hY3Rpb24oXCJ1cGRhdGVTZXRGaWVsZFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVTZXRGaWVsZCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlU2V0RmllbGQpO1xyXG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlQ3NzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUNzcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQ3NzKTtcclxuICAgIHVyLmFjdGlvbihcImNoYW5nZUJlbmRQb2ludHNcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmVuZFBvaW50cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmVuZFBvaW50cyk7XHJcbiAgICB1ci5hY3Rpb24oXCJjaGFuZ2VGb250UHJvcGVydGllc1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VGb250UHJvcGVydGllcywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMpO1xyXG4gICAgdXIuYWN0aW9uKFwic2hvd0FuZFBlcmZvcm1MYXlvdXRcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2hvd0FuZFBlcmZvcm1MYXlvdXQsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUxheW91dCk7XHJcbiAgICB1ci5hY3Rpb24oXCJoaWRlQW5kUGVyZm9ybUxheW91dFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5oaWRlQW5kUGVyZm9ybUxheW91dCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb0hpZGVBbmRQZXJmb3JtTGF5b3V0KTtcclxuICAgIHVyLmFjdGlvbihcImFwcGx5U0lGVG9wb2xvZ3lHcm91cGluZ1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hcHBseVNJRlRvcG9sb2d5R3JvdXBpbmcsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFwcGx5U0lGVG9wb2xvZ3lHcm91cGluZyk7XHJcblxyXG4gICAgLy8gcmVnaXN0ZXIgU0JHTiBhY3Rpb25zXHJcbiAgICB1ci5hY3Rpb24oXCJhZGRTdGF0ZU9ySW5mb0JveFwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3gpO1xyXG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94KTtcclxuICAgIHVyLmFjdGlvbihcInNldE11bHRpbWVyU3RhdHVzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRNdWx0aW1lclN0YXR1cyk7XHJcbiAgICB1ci5hY3Rpb24oXCJzZXRDbG9uZU1hcmtlclN0YXR1c1wiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cywgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMpO1xyXG4gICAgdXIuYWN0aW9uKFwicmVtb3ZlU3RhdGVPckluZm9Cb3hcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlU3RhdGVPckluZm9Cb3gsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZFN0YXRlT3JJbmZvQm94KTtcclxuICAgIHVyLmFjdGlvbihcImZpdFVuaXRzXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmZpdFVuaXRzLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXN0b3JlVW5pdHMpO1xyXG4gICAgdXIuYWN0aW9uKFwiYWRkQmFja2dyb3VuZEltYWdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEJhY2tncm91bmRJbWFnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVtb3ZlQmFja2dyb3VuZEltYWdlKTtcclxuICAgIHVyLmFjdGlvbihcInJlbW92ZUJhY2tncm91bmRJbWFnZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVCYWNrZ3JvdW5kSW1hZ2UsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEJhY2tncm91bmRJbWFnZSk7XHJcbiAgICB1ci5hY3Rpb24oXCJ1cGRhdGVCYWNrZ3JvdW5kSW1hZ2VcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlQmFja2dyb3VuZEltYWdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVCYWNrZ3JvdW5kSW1hZ2UpO1xyXG4gICAgdXIuYWN0aW9uKFwiY2hhbmdlQmFja2dyb3VuZEltYWdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZUJhY2tncm91bmRJbWFnZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmFja2dyb3VuZEltYWdlKTtcclxuICAgIHVyLmFjdGlvbihcInVwZGF0ZUluZm9ib3hTdHlsZVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVJbmZvYm94U3R5bGUsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUluZm9ib3hTdHlsZSk7XHJcbiAgICB1ci5hY3Rpb24oXCJ1cGRhdGVJbmZvYm94T2JqXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUluZm9ib3hPYmosIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUluZm9ib3hPYmopO1xyXG5cclxuICAgIC8vIHJlZ2lzdGVyIGVhc3kgY3JlYXRpb24gYWN0aW9uc1xyXG4gICAgdXIuYWN0aW9uKFwiY3JlYXRlVGVtcGxhdGVSZWFjdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jcmVhdGVUZW1wbGF0ZVJlYWN0aW9uLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5kZWxldGVFbGVzU2ltcGxlKTtcclxuICAgIHVyLmFjdGlvbihcInNldERlZmF1bHRQcm9wZXJ0eVwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHksIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldERlZmF1bHRQcm9wZXJ0eSk7XHJcbiAgICB1ci5hY3Rpb24oXCJjb252ZXJ0SW50b1JldmVyc2libGVSZWFjdGlvblwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jb252ZXJ0SW50b1JldmVyc2libGVSZWFjdGlvbiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY29udmVydEludG9SZXZlcnNpYmxlUmVhY3Rpb24pO1xyXG5cclxuICAgIHVyLmFjdGlvbihcIm1vdmVFZGdlXCIsIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLm1vdmVFZGdlLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5tb3ZlRWRnZSk7XHJcbiAgICB1ci5hY3Rpb24oXCJmaXhFcnJvclwiLCB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5maXhFcnJvcix1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmZpeEVycm9yKTtcclxuICAgIHVyLmFjdGlvbihcImNsb25lSGlnaERlZ3JlZU5vZGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2xvbmVIaWdoRGVncmVlTm9kZSx1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bkNsb25lSGlnaERlZ3JlZU5vZGUpO1xyXG5cclxuICAgIHVyLmFjdGlvbihcImNoYW5nZU1hcFR5cGVcIiwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTWFwVHlwZSx1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VNYXBUeXBlKTtcclxuXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHJlZ2lzdGVyVW5kb1JlZG9BY3Rpb25zO1xyXG59O1xyXG4iLCJ2YXIgbGlicyA9IHJlcXVpcmUoJy4vbGliLXV0aWxpdGllcycpLmdldExpYnMoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICB2YXIgaW5zdGFuY2U7XHJcblxyXG4gIGZ1bmN0aW9uIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcyAob3B0aW9ucykge1xyXG5cclxuICAgIGluc3RhbmNlID0gbGlicy5zYmdudml6KG9wdGlvbnMpO1xyXG5cclxuICAgIHJldHVybiBpbnN0YW5jZTtcclxuICB9XHJcblxyXG4gIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBpbnN0YW5jZTtcclxuICB9XHJcblxyXG4gIHNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRDeSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKCkuZ2V0Q3koKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzYmdudml6SW5zdGFuY2VVdGlsaXRpZXM7XHJcbn07XHJcbiIsInZhciBpc0VxdWFsID0gcmVxdWlyZSgnbG9kYXNoLmlzZXF1YWwnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gIHZhciBjeSwgZWxlbWVudFV0aWxpdGllcztcclxuICB2YXIgZ3JvdXBDb21wb3VuZFR5cGUsIG1ldGFFZGdlSWRlbnRpZmllciwgbG9ja0dyYXBoVG9wb2xvZ3ksIHNob3VsZEFwcGx5O1xyXG5cclxuICB2YXIgREVGQVVMVF9HUk9VUF9DT01QT1VORF9UWVBFID0gJ3RvcG9sb2d5IGdyb3VwJztcclxuICB2YXIgRURHRV9TVFlMRV9OQU1FUyA9IFsgJ2xpbmUtY29sb3InLCAnd2lkdGgnIF07XHJcblxyXG4gIGZ1bmN0aW9uIHRvcG9sb2d5R3JvdXBpbmcoIHBhcmFtLCBwcm9wcyApIHtcclxuICAgIGN5ID0gcGFyYW0uc2JnbnZpekluc3RhbmNlVXRpbGl0aWVzLmdldEN5KClcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMgPSBwYXJhbS5lbGVtZW50VXRpbGl0aWVzO1xyXG5cclxuICAgIGdyb3VwQ29tcG91bmRUeXBlID0gcHJvcHMuZ3JvdXBDb21wb3VuZFR5cGUgfHwgREVGQVVMVF9HUk9VUF9DT01QT1VORF9UWVBFO1xyXG4gICAgbWV0YUVkZ2VJZGVudGlmaWVyID0gcHJvcHMubWV0YUVkZ2VJZGVudGlmaWVyO1xyXG4gICAgbG9ja0dyYXBoVG9wb2xvZ3kgPSBwcm9wcy5sb2NrR3JhcGhUb3BvbG9neTtcclxuICAgIHNob3VsZEFwcGx5ID0gcHJvcHMuc2hvdWxkQXBwbHkgfHwgdHJ1ZTtcclxuXHJcbiAgICB0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgPSBmYWxzZTtcclxuICAgIGluaXRNZXRhU3R5bGVNYXAoKTtcclxuICB9XHJcblxyXG4gIHRvcG9sb2d5R3JvdXBpbmcuYXBwbHkgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICggdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkIHx8ICFldmFsT3B0KCBzaG91bGRBcHBseSApICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxpc3QgPSBjeS5ub2RlcygpLm1hcCggZnVuY3Rpb24oIG5vZGUgKSB7XHJcbiAgICAgIHJldHVybiBbIG5vZGUgXTtcclxuICAgIH0gKTtcclxuXHJcbiAgICAvLyBkZXRlcm1pbmUgbm9kZSBncm91cHMgYnkgdGhlaXIgdG9wb2xvZ3lcclxuICBcdHZhciBncm91cHMgPSBnZXROb2RlR3JvdXBzKCBsaXN0ICk7XHJcbiAgXHQvLyBhcHBseSBncm91cGluZyBpbiBjeSBsZXZlbFxyXG4gIFx0YXBwbHlHcm91cGluZyggZ3JvdXBzICk7XHJcblxyXG4gICAgdG9wb2xvZ3lHcm91cGluZy5hcHBsaWVkID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoIGxvY2tHcmFwaFRvcG9sb2d5ICkge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmxvY2tHcmFwaFRvcG9sb2d5KCk7XHJcbiAgICB9XHJcblxyXG4gIFx0cmV0dXJuIGdyb3VwcztcclxuICB9O1xyXG5cclxuICB0b3BvbG9neUdyb3VwaW5nLnVuYXBwbHkgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICggIXRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBtZXRhRWRnZXMgPSB0b3BvbG9neUdyb3VwaW5nLmdldE1ldGFFZGdlcygpO1xyXG4gICAgbWV0YUVkZ2VzLmZvckVhY2goIGZ1bmN0aW9uKCBlZGdlICkge1xyXG4gICAgICB2YXIgdG9SZXN0b3JlID0gZWRnZS5kYXRhKCd0Zy10by1yZXN0b3JlJyk7XHJcbiAgICAgIGVkZ2UucmVtb3ZlKCk7XHJcbiAgICAgIHRvUmVzdG9yZS5yZXN0b3JlKCk7XHJcblxyXG4gICAgICBFREdFX1NUWUxFX05BTUVTLmZvckVhY2goIGZ1bmN0aW9uKCBuYW1lICkge1xyXG4gICAgICAgIHZhciBvbGRWYWwgPSB0b3BvbG9neUdyb3VwaW5nLm1ldGFTdHlsZU1hcFsgbmFtZSBdWyBlZGdlLmlkKCkgXTtcclxuICAgICAgICB2YXIgbmV3VmFsID0gZWRnZS5kYXRhKCBuYW1lICk7XHJcblxyXG4gICAgICAgIGlmICggb2xkVmFsICE9PSBuZXdWYWwgKSB7XHJcbiAgICAgICAgICB0b1Jlc3RvcmUuZGF0YSggbmFtZSwgbmV3VmFsICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9ICk7XHJcbiAgICB9ICk7XHJcblxyXG4gICAgaW5pdE1ldGFTdHlsZU1hcCgpO1xyXG5cclxuICAgIHZhciBwYXJlbnRzID0gdG9wb2xvZ3lHcm91cGluZy5nZXRHcm91cENvbXBvdW5kcygpO1xyXG4gICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VQYXJlbnQoIHBhcmVudHMuY2hpbGRyZW4oKSwgbnVsbCApO1xyXG4gICAgcGFyZW50cy5yZW1vdmUoKTtcclxuXHJcbiAgICB0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgPSBmYWxzZTtcclxuXHJcbiAgICBpZiAoIGxvY2tHcmFwaFRvcG9sb2d5ICkge1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnVubG9ja0dyYXBoVG9wb2xvZ3koKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB0b3BvbG9neUdyb3VwaW5nLmdldE1ldGFFZGdlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIG1ldGFFZGdlcyA9IGN5LmVkZ2VzKCdbJyArIG1ldGFFZGdlSWRlbnRpZmllciArICddJyk7XHJcbiAgICByZXR1cm4gbWV0YUVkZ2VzO1xyXG4gIH07XHJcblxyXG4gIHRvcG9sb2d5R3JvdXBpbmcuZ2V0R3JvdXBDb21wb3VuZHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBjbGFzc05hbWUgPSBncm91cENvbXBvdW5kVHlwZTtcclxuICAgIHJldHVybiBjeS5ub2RlcygnW2NsYXNzPVwiJyArIGNsYXNzTmFtZSArICdcIl0nKTtcclxuICB9O1xyXG5cclxuICB0b3BvbG9neUdyb3VwaW5nLmNsZWFyQXBwbGllZEZsYWcgPSBmdW5jdGlvbigpIHtcclxuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9IGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIHRvcG9sb2d5R3JvdXBpbmcuc2V0QXBwbGllZEZsYWcgPSBmdW5jdGlvbihhcHBsaWVkKSB7XHJcbiAgICB0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQgPSBhcHBsaWVkO1xyXG4gIH07XHJcblxyXG4gIHRvcG9sb2d5R3JvdXBpbmcudG9nZ2xlQXBwbGllZEZsYWcgPSBmdW5jdGlvbigpIHtcclxuICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbGllZCA9ICF0b3BvbG9neUdyb3VwaW5nLmFwcGxpZWQ7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gaW5pdE1ldGFTdHlsZU1hcCgpIHtcclxuICAgIHRvcG9sb2d5R3JvdXBpbmcubWV0YVN0eWxlTWFwID0ge307XHJcbiAgICBFREdFX1NUWUxFX05BTUVTLmZvckVhY2goIGZ1bmN0aW9uKCBuYW1lICkge1xyXG4gICAgICB0b3BvbG9neUdyb3VwaW5nLm1ldGFTdHlsZU1hcFsgbmFtZSBdID0ge307XHJcbiAgICB9ICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBldmFsT3B0KCBvcHQgKSB7XHJcbiAgICBpZiAoIHR5cGVvZiBvcHQgPT09ICdmdW5jdGlvbicgKSB7XHJcbiAgICAgIHJldHVybiBvcHQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3B0O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0Tm9kZUdyb3VwcyggbGlzdCApIHtcclxuICAgIGlmICggbGlzdC5sZW5ndGggPD0gMSApIHtcclxuICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGhhbHZlcyA9IGdldEhhbHZlcyggbGlzdCApO1xyXG4gICAgdmFyIGZpcnN0UGFydCA9IGdldE5vZGVHcm91cHMoIGhhbHZlc1sgMCBdICk7XHJcbiAgICB2YXIgc2Vjb25kUGFydCA9IGdldE5vZGVHcm91cHMoIGhhbHZlc1sgMSBdICk7XHJcbiAgICAvLyBtZXJnZSB0aGUgaGFsdmVzXHJcblx0ICB2YXIgZ3JvdXBzID0gbWVyZ2VHcm91cHMoIGZpcnN0UGFydCwgc2Vjb25kUGFydCApO1xyXG5cclxuICAgIHJldHVybiBncm91cHM7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZXRQYXJlbnRPclNlbGYoIG5vZGUgKSB7XHJcbiAgICB2YXIgcGFyZW50ID0gbm9kZS5wYXJlbnQoKTtcclxuICAgIHJldHVybiBwYXJlbnQuc2l6ZSgpID4gMCA/IHBhcmVudCA6IG5vZGU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjYWxjR3JvdXBpbmdLZXkoIGVkZ2UgKSB7XHJcbiAgICB2YXIgc3JjSWQgPSBnZXRQYXJlbnRPclNlbGYoIGVkZ2Uuc291cmNlKCkgKS5pZCgpO1xyXG4gICAgdmFyIHRndElkID0gZ2V0UGFyZW50T3JTZWxmKCBlZGdlLnRhcmdldCgpICkuaWQoKTtcclxuICAgIHZhciBlZGdlVHlwZSA9IGdldEVkZ2VUeXBlKCBlZGdlICk7XHJcblxyXG4gICAgcmV0dXJuIFsgZWRnZVR5cGUsIHNyY0lkLCB0Z3RJZCBdLmpvaW4oICctJyApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkVG9NYXBDaGFpbiggbWFwLCBrZXksIHZhbCApIHtcclxuICAgIGlmICggIW1hcFsga2V5IF0gKSB7XHJcbiAgICAgIG1hcFsga2V5IF0gPSBjeS5jb2xsZWN0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbWFwWyBrZXkgXSA9IG1hcFsga2V5IF0uYWRkKCB2YWwgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFwcGx5R3JvdXBpbmcoIGdyb3VwcyApIHtcclxuICAgIGdyb3Vwcy5mb3JFYWNoKCBmdW5jdGlvbiggZ3JvdXAgKSB7XHJcbiAgICAgIGNyZWF0ZUdyb3VwQ29tcG91bmQoIGdyb3VwICk7XHJcbiAgICB9ICk7XHJcblxyXG4gICAgdmFyIGNvbXBvdW5kcyA9IHRvcG9sb2d5R3JvdXBpbmcuZ2V0R3JvdXBDb21wb3VuZHMoKTtcclxuICAgIHZhciBjaGlsZHJlbkVkZ2VzID0gY29tcG91bmRzLmNoaWxkcmVuKCkuY29ubmVjdGVkRWRnZXMoKTtcclxuICAgIHZhciBlZGdlc01hcCA9IFtdO1xyXG5cclxuICAgIGNoaWxkcmVuRWRnZXMuZm9yRWFjaCggZnVuY3Rpb24oIGVkZ2UgKXtcclxuICAgICAgdmFyIGtleSA9IGNhbGNHcm91cGluZ0tleSggZWRnZSApO1xyXG4gICAgICBhZGRUb01hcENoYWluKCBlZGdlc01hcCwga2V5LCBlZGdlICk7XHJcbiAgICAgIGVkZ2UucmVtb3ZlKCk7XHJcbiAgICB9ICk7XHJcblxyXG4gICAgT2JqZWN0LmtleXMoIGVkZ2VzTWFwICkuZm9yRWFjaCggZnVuY3Rpb24oIGtleSApIHtcclxuICAgICAgLy8gbWFrZSBhIGR1bW15IGVkZ2UgZm9yIGFsbCBvZiBlZGdlcyB0aGF0IGFyZSBtYXBwZWQgYnkga2V5XHJcbiAgXHRcdC8vIGR1bW15IGVkZ2Ugc2hvdWxkIGhhdmUgY29tbW9uIHByb3BlcnRpZXMgb2YgZ2l2ZW4gZWRnZXNcclxuICBcdFx0Ly8gYW5kIHNob3VsZCBjYXJyeSB0aGVpciBpZCBsaXN0IGluIGl0cyBkYXRhXHJcbiAgXHRcdC8vIGZvciBzb3VyY2UgYW5kIHRhcmdldCBpdCBzaG91bGQgaGF2ZSBwYXJlbnQgb2YgY29tbW9uIHNvdXJjZSBhbmQgdGFyZ2V0XHJcbiAgICAgIGNyZWF0ZU1ldGFFZGdlRm9yKCBlZGdlc01hcFsga2V5IF0gKTtcclxuICAgIH0gKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZUdyb3VwQ29tcG91bmQoIGdyb3VwICkge1xyXG4gICAgaWYgKCBncm91cC5sZW5ndGggPCAyICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNvbGxlY3Rpb24gPSBjeS5jb2xsZWN0aW9uKCk7XHJcblxyXG4gICAgZ3JvdXAuZm9yRWFjaCggZnVuY3Rpb24oIG5vZGUgKSB7XHJcbiAgICAgIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uLmFkZCggbm9kZSApO1xyXG4gICAgfSApO1xyXG5cclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzKCBjb2xsZWN0aW9uLCBncm91cENvbXBvdW5kVHlwZSApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlTWV0YUVkZ2VGb3IoIGVkZ2VzICkge1xyXG4gICAgdmFyIHNyY0lkID0gZ2V0UGFyZW50T3JTZWxmKCBlZGdlcy5zb3VyY2UoKSApLmlkKCk7XHJcbiAgICB2YXIgdGd0SWQgPSBnZXRQYXJlbnRPclNlbGYoIGVkZ2VzLnRhcmdldCgpICkuaWQoKTtcclxuICAgIHZhciB0eXBlID0gZWRnZXMuZGF0YSggJ2NsYXNzJyApO1xyXG4gICAgY3kucmVtb3ZlKCBlZGdlcyApO1xyXG5cclxuICAgIHZhciBtZXRhRWRnZSA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkRWRnZSggc3JjSWQsIHRndElkLCB0eXBlICk7XHJcbiAgICBtZXRhRWRnZS5kYXRhKCAndGctdG8tcmVzdG9yZScsIGVkZ2VzICk7XHJcbiAgICBtZXRhRWRnZS5kYXRhKCBtZXRhRWRnZUlkZW50aWZpZXIsIHRydWUgKTtcclxuXHJcbiAgICBFREdFX1NUWUxFX05BTUVTLmZvckVhY2goIGZ1bmN0aW9uKCBzdHlsZU5hbWUgKSB7XHJcbiAgICAgIGVkZ2VzLmZvckVhY2goIGZ1bmN0aW9uKCBlZGdlICkge1xyXG4gICAgICAgIHRvcG9sb2d5R3JvdXBpbmcubWV0YVN0eWxlTWFwWyBzdHlsZU5hbWUgXVsgZWRnZS5pZCgpIF0gPSBlZGdlLmRhdGEoIHN0eWxlTmFtZSApO1xyXG4gICAgICB9ICk7XHJcblxyXG4gICAgICB2YXIgY29tbW9uVmFsID0gZWxlbWVudFV0aWxpdGllcy5nZXRDb21tb25Qcm9wZXJ0eShlZGdlcywgc3R5bGVOYW1lLCAnZGF0YScpO1xyXG4gICAgICBpZiAoIGNvbW1vblZhbCApIHtcclxuICAgICAgICBtZXRhRWRnZS5kYXRhKCBzdHlsZU5hbWUsIGNvbW1vblZhbCApO1xyXG4gICAgICB9XHJcbiAgICB9ICk7XHJcblxyXG4gICAgcmV0dXJuIG1ldGFFZGdlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbWVyZ2VHcm91cHMoIGdyb3VwczEsIGdyb3VwczIgKSB7XHJcbiAgICAvLyBub3RNZXJnZWRHcnMgd2lsbCBpbmNsdWRlIG1lbWJlcnMgb2YgZ3JvdXBzMSB0aGF0IGFyZSBub3QgbWVyZ2VkXHJcbiAgXHQvLyBtZXJnZWRHcnMgd2lsbCBpbmNsdWRlIHRoZSBtZXJnZWQgbWVtYmVycyBmcm9tIDIgZ3JvdXBzXHJcbiAgXHR2YXIgbm90TWVyZ2VkR3JzID0gW10sIG1lcmdlZEdycyA9IFtdO1xyXG5cclxuICAgIGdyb3VwczEuZm9yRWFjaCggZnVuY3Rpb24oIGdyMSApIHtcclxuICAgICAgdmFyIG1lcmdlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgbWVyZ2VkR3JzLmNvbmNhdCggZ3JvdXBzMiApLmZvckVhY2goIGZ1bmN0aW9uKCBncjIsIGluZGV4MiApIHtcclxuICAgICAgICAvLyBpZiBncm91cHMgc2hvdWxkIGJlIG1lcmdlZCBtZXJnZSB0aGVtLCByZW1vdmUgZ3IyIGZyb20gd2hlcmUgaXRcclxuICAgICAgICAvLyBjb21lcyBmcm9tIGFuZCBwdXNoIHRoZSBtZXJnZSByZXN1bHQgdG8gbWVyZ2VkR3JzXHJcbiAgICAgICAgaWYgKCBzaG91bGRNZXJnZSggZ3IxLCBncjIgKSApIHtcclxuICAgICAgICAgIHZhciBtZXJnZWRHciA9IGdyMS5jb25jYXQoIGdyMiApO1xyXG5cclxuICAgICAgICAgIGlmICggaW5kZXgyID49IG1lcmdlZEdycy5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZUF0KCBncm91cHMyLCBpbmRleDIgLSBtZXJnZWRHcnMubGVuZ3RoICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVtb3ZlQXQoIG1lcmdlZEdycywgaW5kZXgyICk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gbWFyayBhcyBtZXJnZWQgYW5kIGJyZWFrIHRoZSBsb29wXHJcbiAgICAgICAgICBtZXJnZWRHcnMucHVzaCggbWVyZ2VkR3IgKTtcclxuICAgICAgICAgIG1lcmdlZCA9IHRydWU7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9ICk7XHJcblxyXG4gICAgICAvLyBpZiBncjEgaXMgbm90IG1lcmdlZCBwdXNoIGl0IHRvIG5vdE1lcmdlZEdyc1xyXG4gICAgICBpZiAoICFtZXJnZWQgKSB7XHJcbiAgICAgICAgbm90TWVyZ2VkR3JzLnB1c2goIGdyMSApO1xyXG4gICAgICB9XHJcbiAgICB9ICk7XHJcblxyXG4gICAgLy8gdGhlIGdyb3VwcyB0aGF0IGNvbWVzIGZyb20gZ3JvdXBzMiBidXQgbm90IG1lcmdlZCBhcmUgc3RpbGwgaW5jbHVkZWRcclxuXHQgIC8vIGluIGdyb3VwczIgYWRkIHRoZW0gdG8gdGhlIHJlc3VsdCB0b2dldGhlciB3aXRoIG1lcmdlZEdycyBhbmQgbm90TWVyZ2VkR3JzXHJcbiAgICByZXR1cm4gbm90TWVyZ2VkR3JzLmNvbmNhdCggbWVyZ2VkR3JzLCBncm91cHMyICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzaG91bGRNZXJnZSggZ3JvdXAxLCBncm91cDIgKSB7XHJcbiAgICAvLyB1c2luZyBmaXJzdCBlbGVtZW50cyBpcyBlbm91Z2ggdG8gZGVjaWRlIHdoZXRoZXIgdG8gbWVyZ2VcclxuICBcdHZhciBub2RlMSA9IGdyb3VwMVsgMCBdO1xyXG4gIFx0dmFyIG5vZGUyID0gZ3JvdXAyWyAwIF07XHJcblxyXG4gICAgaWYgKCBub2RlMS5lZGdlcygpLmxlbmd0aCAhPT0gbm9kZTIuZWRnZXMoKS5sZW5ndGggKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZ2V0VW5kaXJlY3RlZEVkZ2VzID0gZnVuY3Rpb24oIG5vZGUgKSB7XHJcbiAgICAgIHZhciBlZGdlcyA9IG5vZGUuY29ubmVjdGVkRWRnZXMoKS5maWx0ZXIoIGlzVW5kaXJlY3RlZEVkZ2UgKTtcclxuICAgICAgcmV0dXJuIGVkZ2VzO1xyXG4gICAgfTtcclxuICAgIC8vIHVuZGlyZWN0ZWQgZWRnZXMgb2Ygbm9kZTEgYW5kIG5vZGUyIHJlc3BlY3RpdmVseVxyXG4gICAgdmFyIHVuZGlyMSA9IGdldFVuZGlyZWN0ZWRFZGdlcyggbm9kZTEgKTtcclxuICAgIHZhciB1bmRpcjIgPSBnZXRVbmRpcmVjdGVkRWRnZXMoIG5vZGUyICk7XHJcblxyXG4gICAgdmFyIGluMSA9IG5vZGUxLmluY29tZXJzKCkuZWRnZXMoKS5ub3QoIHVuZGlyMSApO1xyXG4gICAgdmFyIGluMiA9IG5vZGUyLmluY29tZXJzKCkuZWRnZXMoKS5ub3QoIHVuZGlyMiApO1xyXG5cclxuICAgIHZhciBvdXQxID0gbm9kZTEub3V0Z29lcnMoKS5lZGdlcygpLm5vdCggdW5kaXIxICk7XHJcblx0ICB2YXIgb3V0MiA9IG5vZGUyLm91dGdvZXJzKCkuZWRnZXMoKS5ub3QoIHVuZGlyMiApO1xyXG5cclxuICAgIHJldHVybiBjb21wYXJlRWRnZUdyb3VwKCBpbjEsIGluMiwgbm9kZTEsIG5vZGUyIClcclxuICAgICAgICAgICAgJiYgY29tcGFyZUVkZ2VHcm91cCggb3V0MSwgb3V0Miwgbm9kZTEsIG5vZGUyIClcclxuICAgICAgICAgICAgJiYgY29tcGFyZUVkZ2VHcm91cCggdW5kaXIxLCB1bmRpcjIsIG5vZGUxLCBub2RlMiApO1xyXG4gIH1cclxuXHJcbiAgLy8gZGVjaWRlIGlmIDIgZWRnZSBncm91cHMgY29udGFpbnMgc2V0IG9mIGVkZ2VzIHdpdGggc2ltaWxhciBjb250ZW50ICh0eXBlLFxyXG4gIC8vIHNvdXJjZSx0YXJnZXQpIHJlbGF0aXZlIHRvIHRoZWlyIG5vZGVzIHdoZXJlIGdyMSBhcmUgZWRnZXMgb2Ygbm9kZTEgYW5kIGdyMiBhcmUgZWRnZXMgb2ZcclxuICAvLyBub2RlMlxyXG4gIGZ1bmN0aW9uIGNvbXBhcmVFZGdlR3JvdXAoIGdyMSwgZ3IyLCBub2RlMSwgbm9kZTIgKSB7XHJcbiAgICB2YXIgaWQxID0gbm9kZTEuaWQoKTtcclxuICAgIHZhciBpZDIgPSBub2RlMi5pZCgpO1xyXG5cclxuICAgIHZhciBtYXAxID0gZmlsbElkVG9UeXBlU2V0TWFwKCBncjEsIG5vZGUxICk7XHJcbiAgICB2YXIgbWFwMiA9IGZpbGxJZFRvVHlwZVNldE1hcCggZ3IyLCBub2RlMiApO1xyXG5cclxuICAgIGlmICggT2JqZWN0LmtleXMoIG1hcDEgKS5sZW5ndGggIT09IE9iamVjdC5rZXlzKCBtYXAyICkubGVuZ3RoICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGZhaWxlZCA9IGZhbHNlO1xyXG5cclxuICAgIE9iamVjdC5rZXlzKCBtYXAxICkuZm9yRWFjaCggZnVuY3Rpb24oIGtleSApIHtcclxuICAgICAgLy8gaWYgYWxyZWFkeSBmYWlsZWQganVzdCByZXR1cm5cclxuICAgICAgaWYgKCBmYWlsZWQgKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBpZiBrZXkgaXMgaWQyIHVzZSBpZDEgaW5zdGVhZCBiZWNhdXNlIGNvbXBhcmlzb24gaXMgcmVsYXRpdmUgdG8gbm9kZXNcclxuICAgICAgdmFyIG90aGVyS2V5ID0gKCBrZXkgPT0gaWQyICkgPyBpZDEgOiBrZXk7XHJcblxyXG4gICAgICAvLyBjaGVjayBpZiB0aGUgc2V0cyBoYXZlIHRoZSBzYW1lIGNvbnRlbnRcclxuICBcdFx0Ly8gaWYgY2hlY2sgZmFpbHMgcmV0dXJuIGZhbHNlXHJcbiAgICAgIGlmICggIWlzRXF1YWwoIG1hcDFbIGtleSBdLCBtYXAyWyBvdGhlcktleSBdICkgKSB7XHJcbiAgICAgICAgZmFpbGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSApO1xyXG5cclxuICAgIC8vIGlmIGNoZWNrIHBhc3NlcyBmb3IgZWFjaCBrZXkgcmV0dXJuIHRydWVcclxuICAgIHJldHVybiAhZmFpbGVkO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZmlsbElkVG9UeXBlU2V0TWFwKCBlZGdlR3JvdXAsIG5vZGUgKSB7XHJcbiAgICB2YXIgbWFwID0ge307XHJcbiAgICB2YXIgbm9kZUlkID0gbm9kZS5pZCgpO1xyXG5cclxuICAgIGVkZ2VHcm91cC5mb3JFYWNoKCBmdW5jdGlvbiggZWRnZSApIHtcclxuICAgICAgdmFyIHNyY0lkID0gZWRnZS5kYXRhKCdzb3VyY2UnKTtcclxuICAgICAgdmFyIHRndElkID0gZWRnZS5kYXRhKCd0YXJnZXQnKTtcclxuICAgICAgdmFyIGVkZ2VJZCA9IGVkZ2UuaWQoKTtcclxuXHJcbiAgICAgIHZhciBvdGhlckVuZCA9ICggbm9kZUlkID09PSB0Z3RJZCApID8gc3JjSWQgOiB0Z3RJZDtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGFkZFRvUmVsYXRlZFNldCggc2lkZVN0ciwgdmFsdWUgKSB7XHJcbiAgICAgICAgaWYgKCAhbWFwWyBzaWRlU3RyIF0gKSB7XHJcbiAgICAgICAgICBtYXBbIHNpZGVTdHIgXSA9IG5ldyBTZXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1hcFsgc2lkZVN0ciBdLmFkZCggdmFsdWUgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGVkZ2VUeXBlID0gZ2V0RWRnZVR5cGUoIGVkZ2UgKTtcclxuXHJcbiAgICAgIGFkZFRvUmVsYXRlZFNldCggb3RoZXJFbmQsIGVkZ2VUeXBlICk7XHJcbiAgICB9ICk7XHJcblxyXG4gICAgcmV0dXJuIG1hcDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldEVkZ2VUeXBlKCBlZGdlICkge1xyXG4gICAgcmV0dXJuIGVkZ2UuZGF0YSggJ2NsYXNzJyApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaXNVbmRpcmVjdGVkRWRnZSggZWRnZSApIHtcclxuICAgIHJldHVybiBlbGVtZW50VXRpbGl0aWVzLmlzVW5kaXJlY3RlZEVkZ2UoIGVkZ2UgKTtcclxuICB9XHJcblxyXG4gIC8vIGdldCBoYWx2ZXMgb2YgYSBsaXN0LiBJdCBpcyBhc3N1bWVkIHRoYXQgbGlzdCBzaXplIGlzIGF0IGxlYXN0IDIuXHJcbiAgZnVuY3Rpb24gZ2V0SGFsdmVzKCBsaXN0ICkge1xyXG4gICAgdmFyIHMgPSBsaXN0Lmxlbmd0aDtcclxuICAgIHZhciBoYWxmSW5kZXggPSBNYXRoLmZsb29yKCBzIC8gMiApO1xyXG4gICAgdmFyIGZpcnN0SGFsZiA9IGxpc3Quc2xpY2UoIDAsIGhhbGZJbmRleCApO1xyXG4gICAgdmFyIHNlY29uZEhhbGYgPSBsaXN0LnNsaWNlKCBoYWxmSW5kZXgsIHMgKTtcclxuXHJcbiAgICByZXR1cm4gWyBmaXJzdEhhbGYsIHNlY29uZEhhbGYgXTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbW92ZUF0KCBhcnIsIGluZGV4ICkge1xyXG4gICAgYXJyLnNwbGljZSggaW5kZXgsIDEgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0b3BvbG9neUdyb3VwaW5nO1xyXG59O1xyXG4iLCIvLyBFeHRlbmRzIHNiZ252aXoudW5kb1JlZG9BY3Rpb25GdW5jdGlvbnNcclxudmFyIGxpYnMgPSByZXF1aXJlKCcuL2xpYi11dGlsaXRpZXMnKS5nZXRMaWJzKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgdmFyIHNiZ252aXpJbnN0YW5jZSwgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMsIGVsZW1lbnRVdGlsaXRpZXMsIGN5LCB0b3BvbG9neUdyb3VwaW5nO1xyXG5cclxuICBmdW5jdGlvbiB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9uc0V4dGVuZGVyIChwYXJhbSkge1xyXG5cclxuICAgIHNiZ252aXpJbnN0YW5jZSA9IHBhcmFtLnNiZ252aXpJbnN0YW5jZVV0aWxpdGllcy5nZXRJbnN0YW5jZSgpO1xyXG4gICAgY3kgPSBwYXJhbS5zYmdudml6SW5zdGFuY2VVdGlsaXRpZXMuZ2V0Q3koKTtcclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zID0gc2JnbnZpekluc3RhbmNlLnVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zO1xyXG4gICAgZWxlbWVudFV0aWxpdGllcyA9IHBhcmFtLmVsZW1lbnRVdGlsaXRpZXM7XHJcbiAgICB0b3BvbG9neUdyb3VwaW5nID0gcGFyYW0uc2lmVG9wb2xvZ3lHcm91cGluZztcclxuXHJcbiAgICBleHRlbmQoKTtcclxuICB9XHJcblxyXG4gIC8vIEV4dGVuZHMgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMgd2l0aCBjaGlzZSBzcGVjaWZpYyBmZWF0dXJlc1xyXG4gIGZ1bmN0aW9uIGV4dGVuZCAoKSB7XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYXBwbHlTSUZUb3BvbG9neUdyb3VwaW5nID0gZnVuY3Rpb24ocGFyYW0pIHtcclxuICAgICAgdmFyIG9sZEVsZXMsIG5ld0VsZXM7XHJcbiAgICAgIGlmICggcGFyYW0uZmlyc3RUaW1lICkge1xyXG4gICAgICAgIG9sZEVsZXMgPSBjeS5lbGVtZW50cygpO1xyXG5cclxuICAgICAgICBpZiAocGFyYW0uYXBwbHkpIHtcclxuICAgICAgICAgIHRvcG9sb2d5R3JvdXBpbmcuYXBwbHkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB0b3BvbG9neUdyb3VwaW5nLnVuYXBwbHkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5ld0VsZXMgPSBjeS5lbGVtZW50cygpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIG9sZEVsZXMgPSBwYXJhbS5vbGRFbGVzO1xyXG4gICAgICAgIG5ld0VsZXMgPSBwYXJhbS5uZXdFbGVzO1xyXG5cclxuICAgICAgICBpZiAoIGVsZW1lbnRVdGlsaXRpZXMuaXNHcmFwaFRvcG9sb2d5TG9ja2VkKCkgKSB7XHJcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnVubG9ja0dyYXBoVG9wb2xvZ3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmxvY2tHcmFwaFRvcG9sb2d5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBvbGRFbGVzLnJlbW92ZSgpO1xyXG4gICAgICAgIG5ld0VsZXMucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICB0b3BvbG9neUdyb3VwaW5nLnRvZ2dsZUFwcGxpZWRGbGFnKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciByZXN1bHQgPSB7IG9sZEVsZXM6IG5ld0VsZXMsIG5ld0VsZXM6IG9sZEVsZXMgfTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLy8gU2VjdGlvbiBTdGFydFxyXG4gICAgLy8gYWRkL3JlbW92ZSBhY3Rpb24gZnVuY3Rpb25zXHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkTm9kZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgcmVzdWx0O1xyXG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICAgICAgdmFyIG5ld05vZGUgPSBwYXJhbS5uZXdOb2RlO1xyXG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShuZXdOb2RlLngsIG5ld05vZGUueSwgbmV3Tm9kZS5jbGFzcywgbmV3Tm9kZS5pZCwgbmV3Tm9kZS5wYXJlbnQsIG5ld05vZGUudmlzaWJpbGl0eSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZWxlczogcmVzdWx0XHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmFkZEVkZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIHJlc3VsdDtcclxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgICAgIHZhciBuZXdFZGdlID0gcGFyYW0ubmV3RWRnZTtcclxuICAgICAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3RWRnZS5zb3VyY2UsIG5ld0VkZ2UudGFyZ2V0LCBuZXdFZGdlLmNsYXNzLCBuZXdFZGdlLmlkLCBuZXdFZGdlLnZpc2liaWxpdHkpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZUVsZXMocGFyYW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGVsZXM6IHJlc3VsdFxyXG4gICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRQcm9jZXNzV2l0aENvbnZlbmllbnRFZGdlcyA9IGZ1bmN0aW9uKHBhcmFtKSB7XHJcbiAgICAgIHZhciByZXN1bHQ7XHJcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgICAgICByZXN1bHQgPSBlbGVtZW50VXRpbGl0aWVzLmFkZFByb2Nlc3NXaXRoQ29udmVuaWVudEVkZ2VzKHBhcmFtLnNvdXJjZSwgcGFyYW0udGFyZ2V0LCBwYXJhbS5wcm9jZXNzVHlwZSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlRWxlcyhwYXJhbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZWxlczogcmVzdWx0XHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZUNvbXBvdW5kRm9yR2l2ZW5Ob2RlcyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge307XHJcblxyXG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICAgICAgLy8gTm9kZXMgdG8gbWFrZSBjb21wb3VuZCwgdGhlaXIgZGVzY2VuZGFudHMgYW5kIGVkZ2VzIGNvbm5lY3RlZCB0byB0aGVtIHdpbGwgYmUgcmVtb3ZlZCBkdXJpbmcgY3JlYXRlQ29tcG91bmRGb3JHaXZlbk5vZGVzIG9wZXJhdGlvblxyXG4gICAgICAgIC8vIChpbnRlcm5hbGx5IGJ5IGVsZXMubW92ZSgpIG9wZXJhdGlvbiksIHNvIG1hcmsgdGhlbSBhcyByZW1vdmVkIGVsZXMgZm9yIHVuZG8gb3BlcmF0aW9uLlxyXG4gICAgICAgIHZhciBub2Rlc1RvTWFrZUNvbXBvdW5kID0gcGFyYW0ubm9kZXNUb01ha2VDb21wb3VuZDtcclxuICAgICAgICB2YXIgcmVtb3ZlZEVsZXMgPSBub2Rlc1RvTWFrZUNvbXBvdW5kLnVuaW9uKG5vZGVzVG9NYWtlQ29tcG91bmQuZGVzY2VuZGFudHMoKSk7XHJcbiAgICAgICAgcmVtb3ZlZEVsZXMgPSByZW1vdmVkRWxlcy51bmlvbihyZW1vdmVkRWxlcy5jb25uZWN0ZWRFZGdlcygpKTtcclxuICAgICAgICByZXN1bHQucmVtb3ZlZEVsZXMgPSByZW1vdmVkRWxlcztcclxuICAgICAgICAvLyBBc3N1bWUgdGhhdCBhbGwgbm9kZXMgdG8gbWFrZSBjb21wb3VuZCBoYXZlIHRoZSBzYW1lIHBhcmVudFxyXG4gICAgICAgIHZhciBvbGRQYXJlbnRJZCA9IG5vZGVzVG9NYWtlQ29tcG91bmRbMF0uZGF0YShcInBhcmVudFwiKTtcclxuICAgICAgICAvLyBUaGUgcGFyZW50IG9mIG5ldyBjb21wb3VuZCB3aWxsIGJlIHRoZSBvbGQgcGFyZW50IG9mIHRoZSBub2RlcyB0byBtYWtlIGNvbXBvdW5kXHJcbiAgICAgICAgLy8gTmV3IGVsZXMgaW5jbHVkZXMgbmV3IGNvbXBvdW5kIGFuZCB0aGUgbW92ZWQgZWxlcyBhbmQgd2lsbCBiZSB1c2VkIGluIHVuZG8gb3BlcmF0aW9uLlxyXG4gICAgICAgIHJlc3VsdC5uZXdFbGVzID0gZWxlbWVudFV0aWxpdGllcy5jcmVhdGVDb21wb3VuZEZvckdpdmVuTm9kZXMobm9kZXNUb01ha2VDb21wb3VuZCwgcGFyYW0uY29tcG91bmRUeXBlKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXN1bHQucmVtb3ZlZEVsZXMgPSBwYXJhbS5uZXdFbGVzLnJlbW92ZSgpO1xyXG4gICAgICAgIHJlc3VsdC5uZXdFbGVzID0gcGFyYW0ucmVtb3ZlZEVsZXMucmVzdG9yZSgpO1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubWFpbnRhaW5Qb2ludGVyKHJlc3VsdC5uZXdFbGVzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIGFkZC9yZW1vdmUgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIGVhc3kgY3JlYXRpb24gYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNyZWF0ZVRlbXBsYXRlUmVhY3Rpb24gPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcclxuICAgICAgdmFyIGVsZXM7XHJcblxyXG4gICAgICBpZiAoZmlyc3RUaW1lKSB7XHJcbiAgICAgICAgZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuY3JlYXRlVGVtcGxhdGVSZWFjdGlvbihwYXJhbS50ZW1wbGF0ZVR5cGUsIHBhcmFtLm1hY3JvbW9sZWN1bGVMaXN0LCBwYXJhbS5jb21wbGV4TmFtZSwgcGFyYW0ucHJvY2Vzc1Bvc2l0aW9uLCBwYXJhbS50aWxpbmdQYWRkaW5nVmVydGljYWwsIHBhcmFtLnRpbGluZ1BhZGRpbmdIb3Jpem9udGFsLCBwYXJhbS5lZGdlTGVuZ3RoLCBwYXJhbS5sYXlvdXRQYXJhbSlcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBlbGVzID0gcGFyYW07XHJcbiAgICAgICAgY3kuYWRkKGVsZXMpO1xyXG5cclxuICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgICAgICAgZWxlcy5zZWxlY3QoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBlbGVzOiBlbGVzXHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBlYXN5IGNyZWF0aW9uIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbiAgICAvLyBTZWN0aW9uIFN0YXJ0XHJcbiAgICAvLyBnZW5lcmFsIGFjdGlvbiBmdW5jdGlvbnNcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgcG9zaXRpb25zID0ge307XHJcbiAgICAgIHZhciBub2RlcyA9IGN5Lm5vZGVzKCk7XHJcblxyXG4gICAgICBub2Rlcy5lYWNoKGZ1bmN0aW9uKGVsZSwgaSkge1xyXG4gICAgICAgIGlmKHR5cGVvZiBlbGUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgIGVsZSA9IGk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwb3NpdGlvbnNbZWxlLmlkKCldID0ge1xyXG4gICAgICAgICAgeDogZWxlLnBvc2l0aW9uKFwieFwiKSxcclxuICAgICAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcclxuICAgICAgICB9O1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBwb3NpdGlvbnM7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zID0gZnVuY3Rpb24gKHBvc2l0aW9ucykge1xyXG4gICAgICB2YXIgY3VycmVudFBvc2l0aW9ucyA9IHt9O1xyXG4gICAgICBjeS5ub2RlcygpLnBvc2l0aW9ucyhmdW5jdGlvbiAoZWxlLCBpKSB7XHJcbiAgICAgICAgaWYodHlwZW9mIGVsZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgZWxlID0gaTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN1cnJlbnRQb3NpdGlvbnNbZWxlLmlkKCldID0ge1xyXG4gICAgICAgICAgeDogZWxlLnBvc2l0aW9uKFwieFwiKSxcclxuICAgICAgICAgIHk6IGVsZS5wb3NpdGlvbihcInlcIilcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgcG9zID0gcG9zaXRpb25zW2VsZS5pZCgpXTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgeDogcG9zLngsXHJcbiAgICAgICAgICB5OiBwb3MueVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIGN1cnJlbnRQb3NpdGlvbnM7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlc2l6ZU5vZGVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgcGVyZm9ybU9wZXJhdGlvbjogdHJ1ZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcblxyXG4gICAgICByZXN1bHQuc2l6ZU1hcCA9IHt9O1xyXG4gICAgICByZXN1bHQudXNlQXNwZWN0UmF0aW8gPSBmYWxzZTtcclxuICAgICAgcmVzdWx0LnByZXNlcnZlUmVsYXRpdmVQb3MgPSBwYXJhbS5wcmVzZXJ2ZVJlbGF0aXZlUG9zO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgICAgaWYobm9kZS5pc1BhcmVudCgpKXtcclxuICAgICAgICAgIHJlc3VsdC5zaXplTWFwW25vZGUuaWQoKV0gPSB7XHJcbiAgICAgICAgICAgIHc6IG5vZGUuZGF0YShcIm1pbldpZHRoXCIpLFxyXG4gICAgICAgICAgICBoOiBub2RlLmRhdGEoXCJtaW5IZWlnaHRcIiksXHJcbiAgICAgICAgICAgIGJpYXNMIDogbm9kZS5kYXRhKFwibWluV2lkdGhCaWFzTGVmdFwiKSxcclxuICAgICAgICAgICAgYmlzYVIgOiBub2RlLmRhdGEoXCJtaW5XaWR0aEJpYXNSaWdodFwiKSxcclxuICAgICAgICAgICAgYmlhc1QgOiBub2RlLmRhdGEoXCJtaW5IZWlnaHRCaWFzVG9wXCIpLFxyXG4gICAgICAgICAgICBiaWFzQiA6IG5vZGUuZGF0YShcIm1pbkhlaWdodEJpYXNCb3R0b21cIilcclxuICAgICAgICAgICAvLyB3OiBub2RlLmNzcyhcIm1pbldpZHRoXCIpICE9IDA/ICBub2RlLmRhdGEoXCJtaW5XaWR0aFwiKSA6IG5vZGUuY2hpbGRyZW4oKS5ib3VuZGluZ0JveCgpLncsXHJcbiAgICAgICAgICAgIC8vaDogbm9kZS5jc3MoXCJtaW4taGVpZ2h0XCIpICE9IDA/ICBub2RlLmRhdGEoXCJtaW5IZWlnaHRcIikgOiBub2RlLmNoaWxkcmVuKCkuYm91bmRpbmdCb3goKS5oXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgcmVzdWx0LnNpemVNYXBbbm9kZS5pZCgpXSA9IHtcclxuICAgICAgICAgICAgdzogbm9kZS53aWR0aCgpLFxyXG4gICAgICAgICAgICBoOiBub2RlLmhlaWdodCgpXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVzdWx0Lm5vZGVzID0gbm9kZXM7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtLnBlcmZvcm1PcGVyYXRpb24pIHtcclxuICAgICAgICAgIGlmIChwYXJhbS5zaXplTWFwKSB7XHJcbiAgICAgICAgICAgIC8qIGlmIChwYXJhbS5wcmVzZXJ2ZVJlbGF0aXZlUG9zID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgdmFyIG9sZFdpZHRoID0gbm9kZS5kYXRhKFwiYmJveFwiKS53O1xyXG4gICAgICAgICAgICAgIHZhciBvbGRIZWlnaHQgPSBub2RlLmRhdGEoXCJiYm94XCIpLmg7XHJcbiAgICAgICAgICAgIH0gKi9cclxuXHJcbiAgICAgICAgICAgIGlmKG5vZGUuaXNQYXJlbnQoKSl7XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0XCIgLCBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uaCk7XHJcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwibWluV2lkdGhcIiAsIHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS53KTtcclxuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJtaW5XaWR0aEJpYXNMZWZ0XCIsIHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5iaWFzTCk7XHJcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwibWluV2lkdGhCaWFzUmlnaHRcIiwgcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmJpYXNSKTtcclxuICAgICAgICAgICAgICBub2RlLmRhdGEoXCJtaW5IZWlnaHRCaWFzVG9wXCIsIHBhcmFtLnNpemVNYXBbbm9kZS5pZCgpXS5iaWFzVCk7XHJcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwibWluSGVpZ2h0Qmlhc0JvdHRvbVwiLCBwYXJhbS5zaXplTWFwW25vZGUuaWQoKV0uYmlhc0IpO1xyXG5cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS53ID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLnc7XHJcbiAgICAgICAgICAgICAgbm9kZS5kYXRhKFwiYmJveFwiKS5oID0gcGFyYW0uc2l6ZU1hcFtub2RlLmlkKCldLmg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIC8qIGlmIChwYXJhbS5wcmVzZXJ2ZVJlbGF0aXZlUG9zID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHN0YXRlc2FuZGluZm9zID0gbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpO1xyXG4gICAgICAgICAgICAgIHZhciB0b3BCb3R0b20gPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IChib3guYW5jaG9yU2lkZSA9PT0gXCJ0b3BcIiB8fCBib3guYW5jaG9yU2lkZSA9PT0gXCJib3R0b21cIikpO1xyXG4gICAgICAgICAgICAgIHZhciByaWdodExlZnQgPSBzdGF0ZXNhbmRpbmZvcy5maWx0ZXIoYm94ID0+IChib3guYW5jaG9yU2lkZSA9PT0gXCJyaWdodFwiIHx8IGJveC5hbmNob3JTaWRlID09PSBcImxlZnRcIikpO1xyXG5cclxuICAgICAgICAgICAgICB0b3BCb3R0b20uZm9yRWFjaChmdW5jdGlvbihib3gpe1xyXG4gICAgICAgICAgICAgICAgaWYgKGJveC5iYm94LnggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIGJveC5iYm94LnggPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYm94LmJib3gueCA+IG9sZFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgIGJveC5iYm94LnggPSBvbGRXaWR0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJveC5iYm94LnggPSBub2RlLmRhdGEoXCJiYm94XCIpLncgKiBib3guYmJveC54IC8gb2xkV2lkdGg7XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgIHJpZ2h0TGVmdC5mb3JFYWNoKGZ1bmN0aW9uKGJveCl7XHJcbiAgICAgICAgICAgICAgICBpZiAoYm94LmJib3gueSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgYm94LmJib3gueSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChib3guYmJveC55ID4gb2xkSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgIGJveC5iYm94LnkgPSBvbGRIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBib3guYmJveC55ID0gbm9kZS5kYXRhKFwiYmJveFwiKS5oICogYm94LmJib3gueSAvIG9sZEhlaWdodDtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSAqL1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzaXplTm9kZXMocGFyYW0ubm9kZXMsIHBhcmFtLndpZHRoLCBwYXJhbS5oZWlnaHQsIHBhcmFtLnVzZUFzcGVjdFJhdGlvLCBwYXJhbS5wcmVzZXJ2ZVJlbGF0aXZlUG9zKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY3kuc3R5bGUoKS51cGRhdGUoKTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTm9kZUxhYmVsID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgIH07XHJcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gICAgICByZXN1bHQubm9kZXMgPSBub2RlcztcclxuICAgICAgcmVzdWx0LmxhYmVsID0ge307XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICByZXN1bHQubGFiZWxbbm9kZS5pZCgpXSA9IG5vZGUuX3ByaXZhdGUuZGF0YS5sYWJlbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmFtLmZpcnN0VGltZSkge1xyXG4gICAgICAgIG5vZGVzLmRhdGEoJ2xhYmVsJywgcGFyYW0ubGFiZWwpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgICAgICBub2RlLl9wcml2YXRlLmRhdGEubGFiZWwgPSBwYXJhbS5sYWJlbFtub2RlLmlkKCldO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudXBkYXRlSW5mb2JveFN0eWxlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgIH07XHJcbiAgICAgIHZhciBzdHlsZSA9IHBhcmFtLm5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKVtwYXJhbS5pbmRleF0uc3R5bGU7XHJcbiAgICAgIHJlc3VsdC5uZXdQcm9wcyA9ICQuZXh0ZW5kKCB7fSwgc3R5bGUgKTtcclxuICAgICAgcmVzdWx0Lm5vZGUgPSBwYXJhbS5ub2RlO1xyXG4gICAgICByZXN1bHQuaW5kZXggPSBwYXJhbS5pbmRleDtcclxuXHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlSW5mb2JveFN0eWxlKCBwYXJhbS5ub2RlLCBwYXJhbS5pbmRleCwgcGFyYW0ubmV3UHJvcHMgKTtcclxuXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZUluZm9ib3hPYmogPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgfTtcclxuICAgICAgdmFyIG9iaiA9IHBhcmFtLm5vZGUuZGF0YSgnc3RhdGVzYW5kaW5mb3MnKVtwYXJhbS5pbmRleF07XHJcbiAgICAgIHJlc3VsdC5uZXdQcm9wcyA9ICQuZXh0ZW5kKCB7fSwgb2JqICk7XHJcbiAgICAgIHJlc3VsdC5ub2RlID0gcGFyYW0ubm9kZTtcclxuICAgICAgcmVzdWx0LmluZGV4ID0gcGFyYW0uaW5kZXg7XHJcblxyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnVwZGF0ZUluZm9ib3hPYmooIHBhcmFtLm5vZGUsIHBhcmFtLmluZGV4LCBwYXJhbS5uZXdQcm9wcyApO1xyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRGF0YSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICB9O1xyXG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XHJcbiAgICAgIHJlc3VsdC5uYW1lID0gcGFyYW0ubmFtZTtcclxuICAgICAgcmVzdWx0LnZhbHVlTWFwID0ge307XHJcbiAgICAgIHJlc3VsdC5lbGVzID0gZWxlcztcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBlbGUgPSBlbGVzW2ldO1xyXG4gICAgICAgIHJlc3VsdC52YWx1ZU1hcFtlbGUuaWQoKV0gPSBlbGUuZGF0YShwYXJhbS5uYW1lKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKHBhcmFtLmVsZXMsIHBhcmFtLm5hbWUsIHBhcmFtLnZhbHVlTWFwKTtcclxuXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVwZGF0ZVNldEZpZWxkID0gZnVuY3Rpb24oIHBhcmFtICkge1xyXG4gICAgICB2YXIgdXBkYXRlcyA9IGVsZW1lbnRVdGlsaXRpZXMudXBkYXRlU2V0RmllbGQoIHBhcmFtLmVsZSwgcGFyYW0uZmllbGROYW1lLCBwYXJhbS50b0RlbGV0ZSwgcGFyYW0udG9BZGQsIHBhcmFtLmNhbGxiYWNrICk7XHJcblxyXG4gICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICAgIGVsZTogcGFyYW0uZWxlLFxyXG4gICAgICAgIGZpZWxkTmFtZTogcGFyYW0uZmllbGROYW1lLFxyXG4gICAgICAgIGNhbGxiYWNrOiBwYXJhbS5jYWxsYmFjayxcclxuICAgICAgICB0b0RlbGV0ZTogdXBkYXRlcy5hZGRlZCxcclxuICAgICAgICB0b0FkZDogdXBkYXRlcy5kZWxldGVkXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5jaGFuZ2VDc3MgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgfTtcclxuICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG4gICAgICByZXN1bHQubmFtZSA9IHBhcmFtLm5hbWU7XHJcbiAgICAgIHJlc3VsdC52YWx1ZU1hcCA9IHt9O1xyXG4gICAgICByZXN1bHQuZWxlcyA9IGVsZXM7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgZWxlID0gZWxlc1tpXTtcclxuICAgICAgICByZXN1bHQudmFsdWVNYXBbZWxlLmlkKCldID0gZWxlLmNzcyhwYXJhbS5uYW1lKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VDc3MocGFyYW0uZWxlcywgcGFyYW0ubmFtZSwgcGFyYW0udmFsdWVNYXApO1xyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlRm9udFByb3BlcnRpZXMgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuICAgICAgcmVzdWx0LmRhdGEgPSB7fTtcclxuICAgICAgcmVzdWx0LmVsZXMgPSBlbGVzO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcblxyXG4gICAgICAgIHJlc3VsdC5kYXRhW2VsZS5pZCgpXSA9IHt9O1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IHBhcmFtLmZpcnN0VGltZSA/IHBhcmFtLmRhdGEgOiBwYXJhbS5kYXRhW2VsZS5pZCgpXTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBkYXRhKSB7XHJcbiAgICAgICAgICByZXN1bHQuZGF0YVtlbGUuaWQoKV1bcHJvcF0gPSBlbGUuZGF0YShwcm9wKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZUZvbnRQcm9wZXJ0aWVzKGVsZXMsIGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgdmFyIGVsZSA9IGVsZXNbaV07XHJcblxyXG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VGb250UHJvcGVydGllcyhlbGUsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgICAqIFNob3cgZWxlcyBhbmQgcGVyZm9ybSBsYXlvdXQuXHJcbiAgICAgKi9cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNob3dBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuXHJcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcclxuXHJcbiAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgICAgICByZXN1bHQuZWxlcyA9IGVsZW1lbnRVdGlsaXRpZXMuc2hvd0FuZFBlcmZvcm1MYXlvdXQocGFyYW0uZWxlcywgcGFyYW0ubGF5b3V0cGFyYW0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLnNob3coZWxlcyk7IC8vIFNob3cgZ2l2ZW4gZWxlc1xyXG4gICAgICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJldHVyblRvUG9zaXRpb25zKHBhcmFtLnBvc2l0aW9ucyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnVuZG9TaG93QW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgZWxlcyA9IHBhcmFtLmVsZXM7XHJcblxyXG4gICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XHJcbiAgICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLmhpZGUoZWxlcyk7IC8vIEhpZGUgcHJldmlvdXNseSB1bmhpZGRlbiBlbGVzO1xyXG5cclxuICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcclxuXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBIaWRlIGVsZXMgYW5kIHBlcmZvcm0gbGF5b3V0LlxyXG4gICAgICovXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5oaWRlQW5kUGVyZm9ybUxheW91dCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgIHZhciBlbGVzID0gcGFyYW0uZWxlcztcclxuXHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgIHJlc3VsdC5wb3NpdGlvbnMgPSB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5nZXROb2RlUG9zaXRpb25zKCk7XHJcblxyXG4gICAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgICAgICAgICAgcmVzdWx0LmVsZXMgPSBlbGVtZW50VXRpbGl0aWVzLmhpZGVBbmRQZXJmb3JtTGF5b3V0KHBhcmFtLmVsZXMsIHBhcmFtLmxheW91dHBhcmFtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5lbGVzID0gY3kudmlld1V0aWxpdGllcygpLmhpZGUoZWxlcyk7IC8vIEhpZGUgZ2l2ZW4gZWxlc1xyXG4gICAgICAgICAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZXR1cm5Ub1Bvc2l0aW9ucyhwYXJhbS5wb3NpdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5kb0hpZGVBbmRQZXJmb3JtTGF5b3V0ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgdmFyIGVsZXMgPSBwYXJhbS5lbGVzO1xyXG5cclxuICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgcmVzdWx0LnBvc2l0aW9ucyA9IHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmdldE5vZGVQb3NpdGlvbnMoKTtcclxuICAgICAgICByZXN1bHQuZWxlcyA9IGN5LnZpZXdVdGlsaXRpZXMoKS5zaG93KGVsZXMpOyAvLyBTaG93IHByZXZpb3VzbHkgaGlkZGVuIGVsZXNcclxuXHJcbiAgICAgICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmV0dXJuVG9Qb3NpdGlvbnMocGFyYW0ucG9zaXRpb25zKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgLy8gU2VjdGlvbiBFbmRcclxuICAgIC8vIGdlbmVyYWwgYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuICAgIC8vIFNlY3Rpb24gU3RhcnRcclxuICAgIC8vIHNiZ24gYWN0aW9uIGZ1bmN0aW9uc1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNoYW5nZVN0YXRlT3JJbmZvQm94ID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgIH07XHJcbiAgICAgIHJlc3VsdC50eXBlID0gcGFyYW0udHlwZTtcclxuICAgICAgcmVzdWx0Lm5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgICAgIHJlc3VsdC5pbmRleCA9IHBhcmFtLmluZGV4O1xyXG4gICAgICB2YXIgZGF0YSA9IHBhcmFtLmRhdGE7XHJcblxyXG4gICAgICB2YXIgdGVtcERhdGEgPSBlbGVtZW50VXRpbGl0aWVzLnNhdmVVbml0cyhwYXJhbS5ub2Rlcyk7XHJcbiAgICAgIHJlc3VsdC52YWx1ZSA9IGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlU3RhdGVPckluZm9Cb3gocGFyYW0ubm9kZXMsIHBhcmFtLmluZGV4LCBwYXJhbS52YWx1ZSwgcGFyYW0udHlwZSk7XHJcbiAgICAgIC8qIHZhciBsb2NhdGlvbnMgPSBlbGVtZW50VXRpbGl0aWVzLmNoZWNrRml0KHBhcmFtLm5vZGVzKTtcclxuICAgICAgaWYgKGxvY2F0aW9ucyAhPT0gdW5kZWZpbmVkICYmIGxvY2F0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5maXRVbml0cyhwYXJhbS5ub2RlcywgbG9jYXRpb25zKTtcclxuICAgICAgfSAqL1xyXG4gICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5yZXN0b3JlVW5pdHMocGFyYW0ubm9kZXMsIGRhdGEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xyXG4gICAgICByZXN1bHQuZGF0YSA9IHRlbXBEYXRhO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5hZGRTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgb2JqID0gcGFyYW0ub2JqO1xyXG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICAgICAgdmFyIGRhdGEgPSBwYXJhbS5kYXRhO1xyXG5cclxuICAgICAgdmFyIHRlbXBEYXRhID0gZWxlbWVudFV0aWxpdGllcy5zYXZlVW5pdHMobm9kZXMpO1xyXG4gICAgICB2YXIgbG9jYXRpb25PYmogPSBlbGVtZW50VXRpbGl0aWVzLmFkZFN0YXRlT3JJbmZvQm94KG5vZGVzLCBvYmopO1xyXG4gICAgIC8qICB2YXIgbG9jYXRpb25zID0gZWxlbWVudFV0aWxpdGllcy5jaGVja0ZpdChub2Rlcyk7XHJcbiAgICAgIGlmIChsb2NhdGlvbnMgIT09IHVuZGVmaW5lZCAmJiBsb2NhdGlvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuZml0VW5pdHMobm9kZXMsIGxvY2F0aW9ucyk7XHJcbiAgICAgIH0gKi9cclxuICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZVVuaXRzKG5vZGVzLCBkYXRhKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcclxuXHJcbiAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICAgIGxvY2F0aW9uT2JqOiBsb2NhdGlvbk9iaixcclxuICAgICAgICBvYmo6IG9iaixcclxuICAgICAgICBkYXRhOiB0ZW1wRGF0YVxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5yZW1vdmVTdGF0ZU9ySW5mb0JveCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgbG9jYXRpb25PYmogPSBwYXJhbS5sb2NhdGlvbk9iajtcclxuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcbiAgICAgIHZhciBkYXRhID0gcGFyYW0uZGF0YTtcclxuXHJcbiAgICAgIHZhciB0ZW1wRGF0YSA9IGVsZW1lbnRVdGlsaXRpZXMuc2F2ZVVuaXRzKG5vZGVzKTtcclxuICAgICAgdmFyIG9iaiA9IGVsZW1lbnRVdGlsaXRpZXMucmVtb3ZlU3RhdGVPckluZm9Cb3gobm9kZXMsIGxvY2F0aW9uT2JqKTtcclxuICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMucmVzdG9yZVVuaXRzKG5vZGVzLCBkYXRhKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcclxuXHJcbiAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICAgIG9iajogb2JqLFxyXG4gICAgICAgIGRhdGE6IHRlbXBEYXRhXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmZpdFVuaXRzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciBub2RlID0gcGFyYW0ubm9kZTtcclxuICAgICAgdmFyIGxvY2F0aW9ucyA9IHBhcmFtLmxvY2F0aW9ucztcclxuICAgICAgdmFyIG9iaiA9IGVsZW1lbnRVdGlsaXRpZXMuZml0VW5pdHMobm9kZSwgbG9jYXRpb25zKTtcclxuXHJcbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XHJcblxyXG4gICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICAgIG5vZGU6IG5vZGUsXHJcbiAgICAgICAgb2JqOiBvYmosXHJcbiAgICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnNcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMucmVzdG9yZVVuaXRzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciBub2RlID0gcGFyYW0ubm9kZTtcclxuICAgICAgdmFyIGxvY2F0aW9ucyA9IHBhcmFtLmxvY2F0aW9ucztcclxuICAgICAgdmFyIG9iaiA9IHBhcmFtLm9iajtcclxuICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgbm9kZS5kYXRhKCdzdGF0ZXNhbmRpbmZvcycpLmZvckVhY2goIGZ1bmN0aW9uIChlbGUpIHtcclxuICAgICAgICB2YXIgYm94ID0gb2JqW2luZGV4KytdO1xyXG4gICAgICAgIGVsZS5iYm94LnggPSBib3gueDtcclxuICAgICAgICBlbGUuYmJveC55ID0gYm94Lnk7XHJcbiAgICAgICAgdmFyIG9sZFNpZGUgPSBlbGUuYW5jaG9yU2lkZTtcclxuICAgICAgICBlbGUuYW5jaG9yU2lkZSA9IGJveC5hbmNob3JTaWRlO1xyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW9kaWZ5VW5pdHMobm9kZSwgZWxlLCBvbGRTaWRlKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICBub2RlOiBub2RlLFxyXG4gICAgICAgIGxvY2F0aW9uczogbG9jYXRpb25zXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnNldE11bHRpbWVyU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciBmaXJzdFRpbWUgPSBwYXJhbS5maXJzdFRpbWU7XHJcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gICAgICB2YXIgc3RhdHVzID0gcGFyYW0uc3RhdHVzO1xyXG4gICAgICB2YXIgcmVzdWx0U3RhdHVzID0ge307XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcclxuICAgICAgICB2YXIgaXNNdWx0aW1lciA9IG5vZGUuZGF0YSgnY2xhc3MnKS5lbmRzV2l0aCgnIG11bHRpbWVyJyk7XHJcblxyXG4gICAgICAgIHJlc3VsdFN0YXR1c1tub2RlLmlkKCldID0gaXNNdWx0aW1lcjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSBjaGFuZ2UgdGhlIHN0YXR1cyBvZiBhbGwgbm9kZXMgYXQgb25jZS5cclxuICAgICAgLy8gSWYgbm90IGNoYW5nZSBzdGF0dXMgb2YgZWFjaCBzZXBlcmF0ZWx5IHRvIHRoZSB2YWx1ZXMgbWFwcGVkIHRvIHRoZWlyIGlkLlxyXG4gICAgICBpZiAoZmlyc3RUaW1lKSB7XHJcbiAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2Rlcywgc3RhdHVzKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xyXG4gICAgICAgICAgZWxlbWVudFV0aWxpdGllcy5zZXRNdWx0aW1lclN0YXR1cyhub2RlLCBzdGF0dXNbbm9kZS5pZCgpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xyXG4gICAgLy8gICAgJCgnI2luc3BlY3Rvci1pcy1tdWx0aW1lcicpLmF0dHIoXCJjaGVja2VkXCIsICEkKCcjaW5zcGVjdG9yLWlzLW11bHRpbWVyJykuYXR0cihcImNoZWNrZWRcIikpO1xyXG4gICAgLy8gIH1cclxuXHJcbiAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgc3RhdHVzOiByZXN1bHRTdGF0dXMsXHJcbiAgICAgICAgbm9kZXM6IG5vZGVzXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXRDbG9uZU1hcmtlclN0YXR1cyA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICAgICAgdmFyIHN0YXR1cyA9IHBhcmFtLnN0YXR1cztcclxuICAgICAgdmFyIGZpcnN0VGltZSA9IHBhcmFtLmZpcnN0VGltZTtcclxuICAgICAgdmFyIHJlc3VsdFN0YXR1cyA9IHt9O1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBub2RlID0gbm9kZXNbaV07XHJcbiAgICAgICAgcmVzdWx0U3RhdHVzW25vZGUuaWQoKV0gPSBub2RlLmRhdGEoJ2Nsb25lbWFya2VyJyk7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRTdGF0dXMgPSBmaXJzdFRpbWUgPyBzdGF0dXMgOiBzdGF0dXNbbm9kZS5pZCgpXTtcclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGUsIGN1cnJlbnRTdGF0dXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgLy8gIGlmICghZmlyc3RUaW1lICYmIF8uaXNFcXVhbChub2RlcywgY3kubm9kZXMoJzpzZWxlY3RlZCcpKSkge1xyXG4gICAgLy8gICAgJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiLCAhJCgnI2luc3BlY3Rvci1pcy1jbG9uZS1tYXJrZXInKS5hdHRyKFwiY2hlY2tlZFwiKSk7XHJcbiAgICAvLyAgfVxyXG5cclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICBzdGF0dXM6IHJlc3VsdFN0YXR1cyxcclxuICAgICAgICBub2Rlczogbm9kZXNcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHBhcmFtOiB7Y2xhc3M6IHNiZ25jbGFzcywgbmFtZTogcHJvcGVydHlOYW1lLCB2YWx1ZTogdmFsdWV9XHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy5zZXREZWZhdWx0UHJvcGVydHkgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIHNiZ25jbGFzcyA9IHBhcmFtLmNsYXNzO1xyXG4gICAgICB2YXIgbmFtZSA9IHBhcmFtLm5hbWU7XHJcbiAgICAgIHZhciB2YWx1ZSA9IHBhcmFtLnZhbHVlO1xyXG4gICAgICB2YXIgY2xhc3NEZWZhdWx0cyA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0RGVmYXVsdFByb3BlcnRpZXMoc2JnbmNsYXNzKTtcclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICBjbGFzczogc2JnbmNsYXNzLFxyXG4gICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgdmFsdWU6IGNsYXNzRGVmYXVsdHMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBjbGFzc0RlZmF1bHRzW25hbWVdIDogdW5kZWZpbmVkXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB2YXIgcHJvcE1hcCA9IHt9O1xyXG4gICAgICBwcm9wTWFwWyBuYW1lIF0gPSB2YWx1ZTtcclxuXHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0RGVmYXVsdFByb3BlcnRpZXMoIHNiZ25jbGFzcywgcHJvcE1hcCApO1xyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuYWRkQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciBiZ09iaiA9IHBhcmFtLmJnT2JqO1xyXG4gICAgICB2YXIgbm9kZXMgPSBwYXJhbS5ub2RlcztcclxuICAgICAgdmFyIHVwZGF0ZUluZm8gPSBwYXJhbS51cGRhdGVJbmZvO1xyXG4gICAgICB2YXIgcHJvbXB0SW52YWxpZEltYWdlID0gcGFyYW0ucHJvbXB0SW52YWxpZEltYWdlO1xyXG4gICAgICB2YXIgdmFsaWRhdGVVUkwgPSBwYXJhbS52YWxpZGF0ZVVSTDtcclxuXHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkQmFja2dyb3VuZEltYWdlKG5vZGVzLCBiZ09iaiwgdXBkYXRlSW5mbywgcHJvbXB0SW52YWxpZEltYWdlLCB2YWxpZGF0ZVVSTCk7XHJcblxyXG4gICAgICBjeS5mb3JjZVJlbmRlcigpO1xyXG5cclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICBub2Rlczogbm9kZXMsXHJcbiAgICAgICAgYmdPYmo6IGJnT2JqLFxyXG4gICAgICAgIHVwZGF0ZUluZm86IHVwZGF0ZUluZm8sXHJcbiAgICAgICAgcHJvbXB0SW52YWxpZEltYWdlOiBwcm9tcHRJbnZhbGlkSW1hZ2UsXHJcbiAgICAgICAgdmFsaWRhdGVVUkw6IHZhbGlkYXRlVVJMXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLnJlbW92ZUJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICB2YXIgYmdPYmogPSBwYXJhbS5iZ09iajtcclxuICAgICAgdmFyIG5vZGVzID0gcGFyYW0ubm9kZXM7XHJcblxyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnJlbW92ZUJhY2tncm91bmRJbWFnZShub2RlcywgYmdPYmopO1xyXG5cclxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcclxuXHJcbiAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgbm9kZXM6IG5vZGVzLFxyXG4gICAgICAgIGJnT2JqOiBiZ09ialxyXG4gICAgICB9O1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51cGRhdGVCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIGJnT2JqID0gcGFyYW0uYmdPYmo7XHJcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG5cclxuICAgICAgdmFyIG9sZEJnT2JqID0gZWxlbWVudFV0aWxpdGllcy51cGRhdGVCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIGJnT2JqKTtcclxuXHJcbiAgICAgIGN5LmZvcmNlUmVuZGVyKCk7XHJcblxyXG4gICAgICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgICAgIG5vZGVzOiBub2RlcyxcclxuICAgICAgICBiZ09iajogb2xkQmdPYmpcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIHZhciBvbGRJbWcgPSBwYXJhbS5vbGRJbWc7XHJcbiAgICAgIHZhciBuZXdJbWcgPSBwYXJhbS5uZXdJbWc7XHJcbiAgICAgIHZhciBub2RlcyA9IHBhcmFtLm5vZGVzO1xyXG4gICAgICB2YXIgZmlyc3RUaW1lID0gcGFyYW0uZmlyc3RUaW1lO1xyXG4gICAgICB2YXIgdXBkYXRlSW5mbyA9IHBhcmFtLnVwZGF0ZUluZm87XHJcbiAgICAgIHZhciBwcm9tcHRJbnZhbGlkSW1hZ2UgPSBwYXJhbS5wcm9tcHRJbnZhbGlkSW1hZ2U7XHJcbiAgICAgIHZhciB2YWxpZGF0ZVVSTD0gcGFyYW0udmFsaWRhdGVVUkw7XHJcblxyXG4gICAgICB2YXIgcmVzdWx0ID0gZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VCYWNrZ3JvdW5kSW1hZ2Uobm9kZXMsIG9sZEltZywgbmV3SW1nLCBmaXJzdFRpbWUsIHVwZGF0ZUluZm8sIHByb21wdEludmFsaWRJbWFnZSwgdmFsaWRhdGVVUkwpO1xyXG5cclxuICAgICAgY3kuZm9yY2VSZW5kZXIoKTtcclxuXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFNlY3Rpb24gRW5kXHJcbiAgICAvLyBzYmduIGFjdGlvbiBmdW5jdGlvbnNcclxuICAgIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zLmNvbnZlcnRJbnRvUmV2ZXJzaWJsZVJlYWN0aW9uID0gZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgIGxldCBjb2xsZWN0aW9uID0gY3kuY29sbGVjdGlvbigpO1xyXG4gICAgICBsZXQgbWFwVHlwZSA9IGVsZW1lbnRVdGlsaXRpZXMuZ2V0TWFwVHlwZSgpO1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUocGFyYW0ubWFwVHlwZSk7XHJcbiAgICAgICQoJyNtYXAtdHlwZScpLnZhbChwYXJhbS5tYXBUeXBlKTtcclxuXHJcbiAgICAgIHBhcmFtLmNvbGxlY3Rpb24uZm9yRWFjaChmdW5jdGlvbihlZGdlKSB7XHJcbiAgICAgICAgdmFyIHNvdXJjZU5vZGUgPSBlZGdlLl9wcml2YXRlLmRhdGEuc291cmNlO1xyXG4gICAgICAgIHZhciB0YXJnZXROb2RlID0gZWRnZS5fcHJpdmF0ZS5kYXRhLnRhcmdldDtcclxuXHJcbiAgICAgICAgZWRnZS5tb3ZlKHtzb3VyY2U6IHRhcmdldE5vZGUsIHRhcmdldDogc291cmNlTm9kZX0pO1xyXG5cclxuICAgICAgICBsZXQgY29udmVydGVkRWRnZSA9IGN5LmdldEVsZW1lbnRCeUlkKGVkZ2UuaWQoKSk7XHJcblxyXG4gICAgICAgIGlmKGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWJlbmRlZGl0aW5nRGlzdGFuY2VzXCIpKXtcclxuICAgICAgICAgIGxldCBkaXN0YW5jZSA9IGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWJlbmRlZGl0aW5nRGlzdGFuY2VzXCIpO1xyXG4gICAgICAgICAgZGlzdGFuY2UgPSBkaXN0YW5jZS5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gLTEqZWxlbWVudDtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlYmVuZGVkaXRpbmdEaXN0YW5jZXNcIiwgZGlzdGFuY2UucmV2ZXJzZSgpKTtcclxuXHJcbiAgICAgICAgICBsZXQgd2VpZ2h0ID0gY29udmVydGVkRWRnZS5kYXRhKFwiY3llZGdlYmVuZGVkaXRpbmdXZWlnaHRzXCIpO1xyXG4gICAgICAgICAgd2VpZ2h0ID0gd2VpZ2h0Lm1hcChmdW5jdGlvbihlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxLWVsZW1lbnQ7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuZGF0YShcImN5ZWRnZWJlbmRlZGl0aW5nV2VpZ2h0c1wiLCB3ZWlnaHQucmV2ZXJzZSgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb252ZXJ0ZWRFZGdlLl9wcml2YXRlLmRhdGEuY2xhc3MgPT09IFwiY29uc3VtcHRpb25cIikge1xyXG4gICAgICAgICAgY29udmVydGVkRWRnZS5fcHJpdmF0ZS5kYXRhLmNsYXNzID0gXCJwcm9kdWN0aW9uXCI7XHJcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLl9wcml2YXRlLmRhdGEucG9ydHNvdXJjZSA9IHRhcmdldE5vZGUgKyBcIi4xXCI7XHJcbiAgICAgICAgICBjb252ZXJ0ZWRFZGdlLl9wcml2YXRlLmRhdGEucG9ydHRhcmdldCA9IHNvdXJjZU5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5jbGFzcyA9PT0gXCJwcm9kdWN0aW9uXCIpIHtcclxuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5jbGFzcyA9IFwiY29uc3VtcHRpb25cIjtcclxuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0c291cmNlID0gdGFyZ2V0Tm9kZTtcclxuICAgICAgICAgIGNvbnZlcnRlZEVkZ2UuX3ByaXZhdGUuZGF0YS5wb3J0dGFyZ2V0ID0gc291cmNlTm9kZSArIFwiLjFcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uLmFkZChjb252ZXJ0ZWRFZGdlKTtcclxuICAgICAgICBjeS5zdHlsZSgpLnVwZGF0ZSgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhciByZXN1bHQgPSB7XHJcbiAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvbixcclxuICAgICAgICBtYXBUeXBlOiBtYXBUeXBlLFxyXG4gICAgICAgIHByb2Nlc3NJZDogcGFyYW0ucHJvY2Vzc0lkXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMubW92ZUVkZ2UgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgfTtcclxuICAgICAgdmFyIGVkZ2UgPSBwYXJhbS5lZGdlO1xyXG4gICAgICByZXN1bHQubmFtZSA9IHBhcmFtLm5hbWU7ICAgICAgXHJcbiAgICAgXHJcblxyXG4gICAgICByZXN1bHQuc291cmNlID0gZWRnZS5zb3VyY2UoKS5pZCgpO1xyXG4gICAgICByZXN1bHQudGFyZ2V0ID0gZWRnZS50YXJnZXQoKS5pZCgpOyAgICAgIFxyXG4gICAgICByZXN1bHQucG9ydHNvdXJjZSAgPWVkZ2UuZGF0YShcInBvcnRzb3VyY2VcIik7XHJcbiAgICAgIHJlc3VsdC5wb3J0dGFyZ2V0ID0gZWRnZS5kYXRhKFwicG9ydHRhcmdldFwiKTtcclxuICAgICAgZWxlbWVudFV0aWxpdGllcy5jaGFuZ2VEYXRhKGVkZ2UsICdzb3VyY2UnLCBwYXJhbS5zb3VyY2UpO1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWRnZSwgJ3RhcmdldCcsIHBhcmFtLnRhcmdldCk7XHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShlZGdlLCAncG9ydHNvdXJjZScsIHBhcmFtLnBvcnRzb3VyY2UpO1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEoZWRnZSwgJ3BvcnR0YXJnZXQnLCBwYXJhbS5wb3J0dGFyZ2V0KTsgXHJcbiAgICAgIGVkZ2UgPSBlZGdlLm1vdmUoe1xyXG4gICAgICAgIHRhcmdldDogcGFyYW0udGFyZ2V0LFxyXG4gICAgICAgIHNvdXJjZSA6IHBhcmFtLnNvdXJjZVxyXG4gICAgXHJcbiAgICAgfSk7XHJcblxyXG4gICAgIHJlc3VsdC5lZGdlID0gZWRnZTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuZml4RXJyb3IgPSBmdW5jdGlvbihwYXJhbSl7XHJcbiAgICAgIFxyXG4gICAgICB2YXIgZXJyb3JDb2RlID0gcGFyYW0uZXJyb3JDb2RlO1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgIHJlc3VsdC5lcnJvckNvZGUgPSBlcnJvckNvZGU7XHJcbiAgICAgIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDFcIiB8fCBlcnJvckNvZGUgPT0gJ3BkMTAxMDInKXtcclxuXHJcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLnJldmVyc2VFZGdlKHBhcmFtLmVkZ2UpO1xyXG5cclxuICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwM1wiIHx8IGVycm9yQ29kZSA9PSAncGQxMDEwNycpe1xyXG5cclxuICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHBhcmFtLm5ld05vZGVzLmZvckVhY2goZnVuY3Rpb24obmV3Tm9kZSl7XHJcbiAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuYWRkTm9kZShuZXdOb2RlLngsIG5ld05vZGUueSwgbmV3Tm9kZS5jbGFzcywgbmV3Tm9kZS5pZCwgdW5kZWZpbmVkKTtcclxuXHJcbiAgICAgICAgICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcGFyYW0ubmV3RWRnZXMuZm9yRWFjaChmdW5jdGlvbihuZXdFZGdlKXsgICAgICAgICAgXHJcbiAgICAgICAgICBlbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UobmV3RWRnZS5zb3VyY2UsbmV3RWRnZS50YXJnZXQsbmV3RWRnZS5jbGFzcyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHBhcmFtLm9sZEVkZ2VzLmZvckVhY2goZnVuY3Rpb24ob2xkRWRnZSl7XHJcbiAgICAgICAgICBjeS5lbGVtZW50cygpLnVuc2VsZWN0KCk7XHJcbiAgICAgICAgICAvL3JldHVybiBcclxuICAgICAgICAgIG9sZEVkZ2UucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHBhcmFtLm5vZGUucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJhbTtcclxuXHJcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDVcIiB8fCBlcnJvckNvZGUgPT0gJ3BkMTAxMDYnKXtcclxuICAgXHJcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLnJldmVyc2VFZGdlKHBhcmFtLmVkZ2UpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxNDBcIil7XHJcbiAgICAgICAgcGFyYW0ubm9kZS5yZW1vdmUoKTtcclxuICAgICAgICByZXR1cm4gcGFyYW07XHJcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDRcIikge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XHJcbiAgICAgICAgICBlZGdlLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgICBub2RlLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBwYXJhbTtcclxuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwOFwiKXtcclxuICAgICAgICBwYXJhbS5lZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2Upe1xyXG4gICAgICAgICAgZWRnZS5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBwYXJhbS5ub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgICAgbm9kZS5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcGFyYW07XHJcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMTFcIil7XHJcbiAgICAgICAgcGFyYW0uZWRnZXMuZm9yRWFjaChmdW5jdGlvbihlZGdlKXtcclxuICAgICAgICAgIGVkZ2UucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcmFtO1xyXG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTI2XCIpe1xyXG4gICAgICAgIHBhcmFtLmVkZ2VzLmZvckVhY2goZnVuY3Rpb24oZWRnZSl7XHJcbiAgICAgICAgICBlZGdlLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgICBub2RlLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBwYXJhbTtcclxuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwOVwiIHx8IGVycm9yQ29kZSA9PSBcInBkMTAxMjRcIikge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLmRhdGEoKS5zb3VyY2U7XHJcbiAgICAgICAgcmVzdWx0Lm5ld1RhcmdldCA9IHBhcmFtLmVkZ2UuZGF0YSgpLnRhcmdldDtcclxuICAgICAgICByZXN1bHQucG9ydHNvdXJjZSA9IHBhcmFtLmVkZ2UuZGF0YSgpLnBvcnRzb3VyY2U7XHJcbiAgICAgICAgdmFyIGNsb25lZEVkZ2UgPSBwYXJhbS5lZGdlLmNsb25lKCk7XHJcbiAgICAgICBcclxuICAgICAgICB2YXIgZWRnZVBhcmFtcyA9IHtjbGFzcyA6IGNsb25lZEVkZ2UuZGF0YSgpLmNsYXNzLCBsYW5ndWFnZSA6Y2xvbmVkRWRnZS5kYXRhKCkubGFuZ3VhZ2V9O1xyXG4gICAgICAgIGNsb25lZEVkZ2UuZGF0YSgpLnNvdXJjZSA9IHBhcmFtLm5ld1NvdXJjZTtcclxuICAgICAgICBjbG9uZWRFZGdlLmRhdGEoKS50YXJnZXQgPSBwYXJhbS5uZXdUYXJnZXQ7XHJcbiAgICAgICAgY3kucmVtb3ZlKHBhcmFtLmVkZ2UpO1xyXG4gICAgICAgIHJlc3VsdC5lZGdlID0gZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHBhcmFtLm5ld1NvdXJjZSxwYXJhbS5uZXdUYXJnZXQsZWRnZVBhcmFtcywgY2xvbmVkRWRnZS5kYXRhKCkuaWQpOyAgICAgIFxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcblxyXG4gICAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTEyXCIpIHsgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgcGFyYW0uY2FsbGJhY2sgPSBlbGVtZW50VXRpbGl0aWVzLm1haW50YWluUG9pbnRlcjsgIFxyXG4gICAgICAgIC8vIElmIHRoaXMgaXMgZmlyc3QgdGltZSB3ZSBzaG91bGQgbW92ZSB0aGUgbm9kZSB0byBpdHMgbmV3IHBhcmVudCBhbmQgcmVsb2NhdGUgaXQgYnkgZ2l2ZW4gcG9zRGlmZiBwYXJhbXNcclxuICAgICAgICAvLyBlbHNlIHdlIHNob3VsZCByZW1vdmUgdGhlIG1vdmVkIGVsZXMgYW5kIHJlc3RvcmUgdGhlIGVsZXMgdG8gcmVzdG9yZVxyXG4gICAgICAgIGlmIChwYXJhbS5maXJzdFRpbWUpIHtcclxuICAgICAgICAgIHZhciBuZXdQYXJlbnRJZCA9IHBhcmFtLnBhcmVudERhdGEgPT0gdW5kZWZpbmVkID8gbnVsbCA6IHBhcmFtLnBhcmVudERhdGE7XHJcbiAgICAgICAgICAvLyBUaGVzZSBlbGVzIGluY2x1ZGVzIHRoZSBub2RlcyBhbmQgdGhlaXIgY29ubmVjdGVkIGVkZ2VzIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZXMubW92ZSgpLlxyXG4gICAgICAgICAgLy8gVGhleSBzaG91bGQgYmUgcmVzdG9yZWQgaW4gdW5kb1xyXG4gICAgICAgICAgdmFyIHdpdGhEZXNjZW5kYW50ID0gcGFyYW0ubm9kZXMudW5pb24ocGFyYW0ubm9kZXMuZGVzY2VuZGFudHMoKSk7XHJcbiAgICAgICAgICByZXN1bHQuZWxlc1RvUmVzdG9yZSA9IHdpdGhEZXNjZW5kYW50LnVuaW9uKHdpdGhEZXNjZW5kYW50LmNvbm5lY3RlZEVkZ2VzKCkpO1xyXG4gICAgICAgICAgLy8gVGhlc2UgYXJlIHRoZSBlbGVzIGNyZWF0ZWQgYnkgbm9kZXMubW92ZSgpLCB0aGV5IHNob3VsZCBiZSByZW1vdmVkIGluIHVuZG8uXHJcbiAgICAgICAgICByZXN1bHQubW92ZWRFbGVzID0gcGFyYW0ubm9kZXMubW92ZSh7XCJwYXJlbnRcIjogbmV3UGFyZW50SWR9KTtcclxuXHJcbiAgICAgICAgICB2YXIgcG9zRGlmZiA9IHtcclxuICAgICAgICAgICAgeDogcGFyYW0ucG9zRGlmZlgsXHJcbiAgICAgICAgICAgIHk6IHBhcmFtLnBvc0RpZmZZXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGVsZW1lbnRVdGlsaXRpZXMubW92ZU5vZGVzKHBvc0RpZmYsIHJlc3VsdC5tb3ZlZEVsZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHJlc3VsdC5lbGVzVG9SZXN0b3JlID0gcGFyYW0ubW92ZWRFbGVzLnJlbW92ZSgpO1xyXG4gICAgICAgICAgcmVzdWx0Lm1vdmVkRWxlcyA9IHBhcmFtLmVsZXNUb1Jlc3RvcmUucmVzdG9yZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcmFtLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgICByZXN1bHQuY2FsbGJhY2sgPSBwYXJhbS5jYWxsYmFjazsgLy8ga2VlcCB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgc28gaXQgY2FuIGJlIHJldXNlZCBhZnRlciB1bmRvL3JlZG9cclxuICAgICAgICAgIHBhcmFtLmNhbGxiYWNrKHJlc3VsdC5tb3ZlZEVsZXMpOyAvLyBhcHBseSB0aGUgY2FsbGJhY2sgb24gbmV3bHkgY3JlYXRlZCBlbGVtZW50c1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgXHJcbiAgICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMjVcIikge1xyXG5cclxuICAgICAgIHJlc3VsdC5lZGdlID0gcGFyYW0uZWRnZS5yZW1vdmUoKTsgICAgICAgXHJcbiAgICAgICByZXN1bHQubmV3RWRnZSA9e307XHJcbiAgICAgICB2YXIgZWRnZWNsYXNzID0gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zLmNsYXNzID8gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zLmNsYXNzIDogcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zO1xyXG4gICAgICAgdmFyIHZhbGlkYXRpb24gPSBlbGVtZW50VXRpbGl0aWVzLnZhbGlkYXRlQXJyb3dFbmRzKGVkZ2VjbGFzcywgY3kuZ2V0RWxlbWVudEJ5SWQocGFyYW0ubmV3RWRnZS5zb3VyY2UpLCBjeS5nZXRFbGVtZW50QnlJZChwYXJhbS5uZXdFZGdlLnRhcmdldCkpO1xyXG5cclxuICAgICAgIGlmICh2YWxpZGF0aW9uID09PSAncmV2ZXJzZScpIHtcclxuICAgICAgICB2YXIgdGVtcCA9IHBhcmFtLm5ld0VkZ2Uuc291cmNlO1xyXG4gICAgICAgIHBhcmFtLm5ld0VkZ2Uuc291cmNlID0gcGFyYW0ubmV3RWRnZS50YXJnZXQ7XHJcbiAgICAgICAgcGFyYW0ubmV3RWRnZS50YXJnZXQgPSB0ZW1wO1xyXG4gICAgICB9XHJcbiAgICAgICByZXN1bHQubmV3RWRnZS5pZCA9ZWxlbWVudFV0aWxpdGllcy5hZGRFZGdlKHBhcmFtLm5ld0VkZ2Uuc291cmNlLHBhcmFtLm5ld0VkZ2UudGFyZ2V0LHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcykuaWQoKTtcclxuICAgICAgIHJlc3VsdC5uZXdFZGdlLnNvdXJjZSA9IHBhcmFtLm5ld0VkZ2Uuc291cmNlO1xyXG4gICAgICAgcmVzdWx0Lm5ld0VkZ2UudGFyZ2V0ID0gcGFyYW0ubmV3RWRnZS50YXJnZXQ7XHJcbiAgICAgICByZXN1bHQubmV3RWRnZS5lZGdlUGFyYW1zID0gcGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zO1xyXG4gICAgICAgXHJcbiAgICAgICByZXR1cm4gcmVzdWx0O1xyXG5cclxuICAgICAgICBcclxuICAgICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDE0MlwiKSB7XHJcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLnJlbW92ZSgpOyAgICAgICBcclxuICAgICAgICByZXN1bHQubmV3RWRnZSA9e307XHJcbiAgICAgICAgdmFyIGVkZ2VjbGFzcyA9IHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcy5jbGFzcyA/IHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcy5jbGFzcyA6IHBhcmFtLm5ld0VkZ2UuZWRnZVBhcmFtcztcclxuICAgICAgICB2YXIgdmFsaWRhdGlvbiA9IGVsZW1lbnRVdGlsaXRpZXMudmFsaWRhdGVBcnJvd0VuZHMoZWRnZWNsYXNzLCBjeS5nZXRFbGVtZW50QnlJZChwYXJhbS5uZXdFZGdlLnNvdXJjZSksIGN5LmdldEVsZW1lbnRCeUlkKHBhcmFtLm5ld0VkZ2UudGFyZ2V0KSk7XHJcblxyXG4gICAgICAgIGlmICh2YWxpZGF0aW9uID09PSAncmV2ZXJzZScpIHtcclxuICAgICAgICAgdmFyIHRlbXAgPSBwYXJhbS5uZXdFZGdlLnNvdXJjZTtcclxuICAgICAgICAgcGFyYW0ubmV3RWRnZS5zb3VyY2UgPSBwYXJhbS5uZXdFZGdlLnRhcmdldDtcclxuICAgICAgICAgcGFyYW0ubmV3RWRnZS50YXJnZXQgPSB0ZW1wO1xyXG4gICAgICAgfVxyXG4gICAgICAgIHJlc3VsdC5uZXdFZGdlLmlkID1lbGVtZW50VXRpbGl0aWVzLmFkZEVkZ2UocGFyYW0ubmV3RWRnZS5zb3VyY2UscGFyYW0ubmV3RWRnZS50YXJnZXQscGFyYW0ubmV3RWRnZS5lZGdlUGFyYW1zKS5pZCgpO1xyXG4gICAgICAgIHJlc3VsdC5uZXdFZGdlLnNvdXJjZSA9IHBhcmFtLm5ld0VkZ2Uuc291cmNlO1xyXG4gICAgICAgIHJlc3VsdC5uZXdFZGdlLnRhcmdldCA9IHBhcmFtLm5ld0VkZ2UudGFyZ2V0O1xyXG4gICAgICAgIHJlc3VsdC5uZXdFZGdlLmVkZ2VQYXJhbXMgPSBwYXJhbS5uZXdFZGdlLmVkZ2VQYXJhbXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgfWVsc2Uge1xyXG5cclxuICAgICAgICByZXN1bHQubmV3U291cmNlID0gcGFyYW0uZWRnZS5zb3VyY2UoKS5pZCgpO1xyXG4gICAgICAgIHJlc3VsdC5uZXdUYXJnZXQgPSBwYXJhbS5lZGdlLnRhcmdldCgpLmlkKCk7XHJcbiAgICAgICAgcmVzdWx0LnBvcnR0YXJnZXQgPSBwYXJhbS5lZGdlLmRhdGEoXCJwb3J0dGFyZ2V0XCIpO1xyXG4gICAgICAgIHJlc3VsdC5lZGdlID0gcGFyYW0uZWRnZS5tb3ZlKHtcclxuICAgICAgICAgIHRhcmdldDogcGFyYW0ubmV3VGFyZ2V0LFxyXG4gICAgICAgICAgc291cmNlIDogcGFyYW0ubmV3U291cmNlICAgICAgXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShyZXN1bHQuZWRnZSwgJ3BvcnR0YXJnZXQnLCBwYXJhbS5wb3J0dGFyZ2V0KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gIH1cclxuICBcclxuICB1bmRvUmVkb0FjdGlvbkZ1bmN0aW9ucy51bmZpeEVycm9yID0gZnVuY3Rpb24ocGFyYW0pe1xyXG4gICAgdmFyIGVycm9yQ29kZSA9IHBhcmFtLmVycm9yQ29kZTtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIHJlc3VsdC5lcnJvckNvZGUgPSBlcnJvckNvZGU7XHJcbiAgICBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTAxXCIgfHwgZXJyb3JDb2RlID09ICdwZDEwMTAyJyl7XHJcbiAgICAgXHJcbiAgICAgICAgcmVzdWx0LmVkZ2UgPSBlbGVtZW50VXRpbGl0aWVzLnJldmVyc2VFZGdlKHBhcmFtLmVkZ2UpO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwM1wiIHx8IGVycm9yQ29kZSA9PSAncGQxMDEwNycpe1xyXG5cclxuICAgICAgcGFyYW0ubmV3Tm9kZXMuZm9yRWFjaChmdW5jdGlvbihuZXdOb2RlKXsgICAgXHJcbiAgICAgICAgY3kucmVtb3ZlKGN5LiQoJyMnK25ld05vZGUuaWQpKSAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHBhcmFtLm5vZGUucmVzdG9yZSgpO1xyXG5cclxuICAgICAgcGFyYW0ub2xkRWRnZXMuZm9yRWFjaChmdW5jdGlvbihvbGRFZGdlKXsgIFxyXG4gICAgICAgIG9sZEVkZ2UucmVzdG9yZSgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGN5LmFuaW1hdGUoe1xyXG4gICAgICAgIGR1cmF0aW9uOiAxMDAsXHJcbiAgICAgICAgZWFzaW5nOiAnZWFzZScsXHJcbiAgICAgICAgZml0IDp7ZWxlczp7fSxwYWRkaW5nOjIwfSwgXHJcbiAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBwYXJhbTtcclxuXHJcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA1XCIgfHwgZXJyb3JDb2RlID09ICdwZDEwMTA2Jyl7ICBcclxuXHJcbiAgICAgIHJlc3VsdC5lZGdlID0gZWxlbWVudFV0aWxpdGllcy5yZXZlcnNlRWRnZShwYXJhbS5lZGdlKTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTQwXCIpe1xyXG4gICAgICBwYXJhbS5ub2RlLnJlc3RvcmUoKTtcclxuICAgICAgY3kuYW5pbWF0ZSh7XHJcbiAgICAgICAgZHVyYXRpb246IDEwMCxcclxuICAgICAgICBlYXNpbmc6ICdlYXNlJyxcclxuICAgICAgICBmaXQgOntlbGVzOnt9LHBhZGRpbmc6MjB9LCBcclxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gcGFyYW07XHJcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTA0XCIpIHtcclxuICAgICAgXHJcbiAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgbm9kZS5yZXN0b3JlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBwYXJhbS5lZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2Upe1xyXG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHBhcmFtO1xyXG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDEwOFwiKXtcclxuICAgICAgXHJcbiAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgbm9kZS5yZXN0b3JlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBwYXJhbS5lZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2Upe1xyXG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHBhcmFtO1xyXG4gICAgfWVsc2UgaWYoZXJyb3JDb2RlID09IFwicGQxMDExMVwiKXtcclxuICAgICAgcGFyYW0uZWRnZXMuZm9yRWFjaChmdW5jdGlvbihlZGdlKXtcclxuICAgICAgICBlZGdlLnJlc3RvcmUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBwYXJhbTtcclxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMjZcIil7XHJcbiAgICAgIHBhcmFtLm5vZGVzLmZvckVhY2goZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgbm9kZS5yZXN0b3JlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBwYXJhbS5lZGdlcy5mb3JFYWNoKGZ1bmN0aW9uKGVkZ2Upe1xyXG4gICAgICAgIGVkZ2UucmVzdG9yZSgpO1xyXG4gICAgICB9KTsgICAgICAgXHJcbiAgICAgIHJldHVybiBwYXJhbTtcclxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMDlcIiB8fCBlcnJvckNvZGUgPT0gXCJwZDEwMTI0XCIpIHtcclxuXHJcbiAgICAgIHJlc3VsdC5uZXdTb3VyY2UgPSBwYXJhbS5lZGdlLnNvdXJjZSgpLmlkKCk7XHJcbiAgICAgIHJlc3VsdC5uZXdUYXJnZXQgPSBwYXJhbS5lZGdlLnRhcmdldCgpLmlkKCk7XHJcbiAgICAgIHJlc3VsdC5wb3J0c291cmNlID0gcGFyYW0ucG9ydHNvdXJjZTtcclxuICAgICAgcmVzdWx0LmVkZ2UgPSBwYXJhbS5lZGdlLm1vdmUoe1xyXG4gICAgICAgIHRhcmdldDogcGFyYW0ubmV3VGFyZ2V0LFxyXG4gICAgICAgIHNvdXJjZSA6IHBhcmFtLm5ld1NvdXJjZSAgICAgIFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGVsZW1lbnRVdGlsaXRpZXMuY2hhbmdlRGF0YShyZXN1bHQuZWRnZSwgJ3BvcnRzb3VyY2UnLCBwYXJhbS5wb3J0c291cmNlKTsgXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9ZWxzZSBpZihlcnJvckNvZGUgPT0gXCJwZDEwMTEyXCIpIHtcclxuICAgICBcclxuICAgICAgLy8gSWYgdGhpcyBpcyBmaXJzdCB0aW1lIHdlIHNob3VsZCBtb3ZlIHRoZSBub2RlIHRvIGl0cyBuZXcgcGFyZW50IGFuZCByZWxvY2F0ZSBpdCBieSBnaXZlbiBwb3NEaWZmIHBhcmFtc1xyXG4gICAgICAvLyBlbHNlIHdlIHNob3VsZCByZW1vdmUgdGhlIG1vdmVkIGVsZXMgYW5kIHJlc3RvcmUgdGhlIGVsZXMgdG8gcmVzdG9yZVxyXG4gICAgICBpZiAocGFyYW0uZmlyc3RUaW1lKSB7XHJcbiAgICAgICAgdmFyIG5ld1BhcmVudElkID0gcGFyYW0ucGFyZW50RGF0YSA9PSB1bmRlZmluZWQgPyBudWxsIDogcGFyYW0ucGFyZW50RGF0YTtcclxuICAgICAgICAvLyBUaGVzZSBlbGVzIGluY2x1ZGVzIHRoZSBub2RlcyBhbmQgdGhlaXIgY29ubmVjdGVkIGVkZ2VzIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZXMubW92ZSgpLlxyXG4gICAgICAgIC8vIFRoZXkgc2hvdWxkIGJlIHJlc3RvcmVkIGluIHVuZG9cclxuICAgICAgICB2YXIgd2l0aERlc2NlbmRhbnQgPSBwYXJhbS5ub2Rlcy51bmlvbihwYXJhbS5ub2Rlcy5kZXNjZW5kYW50cygpKTtcclxuICAgICAgICByZXN1bHQuZWxlc1RvUmVzdG9yZSA9IHdpdGhEZXNjZW5kYW50LnVuaW9uKHdpdGhEZXNjZW5kYW50LmNvbm5lY3RlZEVkZ2VzKCkpO1xyXG4gICAgICAgIC8vIFRoZXNlIGFyZSB0aGUgZWxlcyBjcmVhdGVkIGJ5IG5vZGVzLm1vdmUoKSwgdGhleSBzaG91bGQgYmUgcmVtb3ZlZCBpbiB1bmRvLlxyXG4gICAgICAgIHJlc3VsdC5tb3ZlZEVsZXMgPSBwYXJhbS5ub2Rlcy5tb3ZlKHtcInBhcmVudFwiOiBuZXdQYXJlbnRJZH0pO1xyXG5cclxuICAgICAgICB2YXIgcG9zRGlmZiA9IHtcclxuICAgICAgICAgIHg6IHBhcmFtLnBvc0RpZmZYLFxyXG4gICAgICAgICAgeTogcGFyYW0ucG9zRGlmZllcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBlbGVtZW50VXRpbGl0aWVzLm1vdmVOb2Rlcyhwb3NEaWZmLCByZXN1bHQubW92ZWRFbGVzKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXN1bHQuZWxlc1RvUmVzdG9yZSA9IHBhcmFtLm1vdmVkRWxlcy5yZW1vdmUoKTtcclxuICAgICAgICByZXN1bHQubW92ZWRFbGVzID0gcGFyYW0uZWxlc1RvUmVzdG9yZS5yZXN0b3JlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXJhbS5jYWxsYmFjaykge1xyXG4gICAgICAgIHJlc3VsdC5jYWxsYmFjayA9IHBhcmFtLmNhbGxiYWNrOyAvLyBrZWVwIHRoZSBwcm92aWRlZCBjYWxsYmFjayBzbyBpdCBjYW4gYmUgcmV1c2VkIGFmdGVyIHVuZG8vcmVkb1xyXG4gICAgICAgIHBhcmFtLmNhbGxiYWNrKHJlc3VsdC5tb3ZlZEVsZXMpOyAvLyBhcHBseSB0aGUgY2FsbGJhY2sgb24gbmV3bHkgY3JlYXRlZCBlbGVtZW50c1xyXG4gICAgICB9XHJcblxyXG4gICAgIFxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICBcclxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxMjVcIikge1xyXG5cclxuICAgICAgY3kuJCgnIycrcGFyYW0ubmV3RWRnZS5pZCkucmVtb3ZlKCk7XHJcbiAgICAgIHBhcmFtLmVkZ2UgPSBwYXJhbS5lZGdlLnJlc3RvcmUoKTtcclxuXHJcbiAgICBcclxuICAgICAgcmV0dXJuIHBhcmFtO1xyXG4gICAgICBcclxuICAgIH1lbHNlIGlmKGVycm9yQ29kZSA9PSBcInBkMTAxNDJcIikge1xyXG4gICAgICBjeS4kKCcjJytwYXJhbS5uZXdFZGdlLmlkKS5yZW1vdmUoKTtcclxuICAgICAgcGFyYW0uZWRnZSA9IHBhcmFtLmVkZ2UucmVzdG9yZSgpO1xyXG5cclxuICAgIFxyXG4gICAgICByZXR1cm4gcGFyYW07XHJcbiAgICB9ZWxzZSB7XHJcblxyXG4gICAgICByZXN1bHQubmV3U291cmNlID0gcGFyYW0uZWRnZS5zb3VyY2UoKS5pZCgpO1xyXG4gICAgICByZXN1bHQubmV3VGFyZ2V0ID0gcGFyYW0uZWRnZS50YXJnZXQoKS5pZCgpO1xyXG4gICAgICByZXN1bHQucG9ydHRhcmdldCA9IHBhcmFtLmVkZ2UuZGF0YShcInBvcnR0YXJnZXRcIik7XHJcbiAgICAgIHJlc3VsdC5lZGdlID0gcGFyYW0uZWRnZS5tb3ZlKHtcclxuICAgICAgICB0YXJnZXQ6IHBhcmFtLm5ld1RhcmdldCxcclxuICAgICAgICBzb3VyY2UgOiBwYXJhbS5uZXdTb3VyY2UgICAgICBcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLmNoYW5nZURhdGEocmVzdWx0LmVkZ2UsICdwb3J0dGFyZ2V0JywgcGFyYW0ucG9ydHRhcmdldCk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcblxyXG4gICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gIH1cclxuXHJcbiAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2xvbmVIaWdoRGVncmVlTm9kZSA9IGZ1bmN0aW9uKG5vZGUpe1xyXG5cclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIHZhciBvbGRYID0gbm9kZS5wb3NpdGlvbigpLng7XHJcbiAgICB2YXIgb2xkWSA9IG5vZGUucG9zaXRpb24oKS55O1xyXG4gICAgXHJcbiAgICBcclxuICAgIHZhciBjbGFjdWxhdGVOZXdDbG9uZVBvc2l0aW9uID0gZnVuY3Rpb24oc291cmNlRW5kUG9pbnRYLHNvdXJjZUVuZFBvaW50WSx0YXJnZXRFbmRQb2ludFgsdGFyZ2V0RW5kUG9pbnRZLGRlc2lyZWREaXN0YW5jZSxkaXJlY3Rpb24pe1xyXG4gICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3codGFyZ2V0RW5kUG9pbnRZLXNvdXJjZUVuZFBvaW50WSwyKSsgTWF0aC5wb3codGFyZ2V0RW5kUG9pbnRYLXNvdXJjZUVuZFBvaW50WCwyKSk7XHJcbiAgICAgIHZhciByYXRpbyA9IGRlc2lyZWREaXN0YW5jZS9kaXN0YW5jZTtcclxuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICBpZihkaXJlY3Rpb24gPT0gXCJzb3VyY2VcIil7IFxyXG4gICAgICAgIHJlc3VsdC5jeCA9ICgoMS1yYXRpbykgKiBzb3VyY2VFbmRQb2ludFgpICArIChyYXRpbyAqIHRhcmdldEVuZFBvaW50WCk7XHJcbiAgICAgICAgcmVzdWx0LmN5ID0gKCgxLXJhdGlvKSAqIHNvdXJjZUVuZFBvaW50WSkgICsgKHJhdGlvICogdGFyZ2V0RW5kUG9pbnRZKTtcclxuICAgICAgfWVsc2V7ICAgICAgXHJcbiAgICAgICAgcmVzdWx0LmN4ID0gKCgxLXJhdGlvKSAqIHRhcmdldEVuZFBvaW50WCkgICsgKHJhdGlvICogc291cmNlRW5kUG9pbnRYKTtcclxuICAgICAgICByZXN1bHQuY3kgPSAoKDEtcmF0aW8pICogdGFyZ2V0RW5kUG9pbnRZKSAgKyAocmF0aW8gKiBzb3VyY2VFbmRQb2ludFkpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTsgICBcclxuICAgIHZhciBlZGdlcyA9IG5vZGUuY29ubmVjdGVkRWRnZXMoKTtcclxuICAgIHZhciBkZXNpcmVkRGlzdGFuY2UgPSAobm9kZS5oZWlnaHQoKSA+IG5vZGUud2lkdGgoKT8gbm9kZS5oZWlnaHQoKTogbm9kZS53aWR0aCgpKSogMC4xO1xyXG4gICAgZm9yKHZhciBpID0gMSA7IGkgPCBlZGdlcy5sZW5ndGggOyBpKyspe1xyXG4gICAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xyXG4gICAgICB2YXIgaW5kZXggPSBpO1xyXG4gICAgICB2YXIgZWRnZUNsb25lID0gZWRnZS5jbG9uZSgpO1xyXG4gICAgICB2YXIgc3RhcnRQb3NpdGlvbiA9IGVkZ2Uuc291cmNlKCkuaWQoKSA9PSBub2RlLmlkKCkgPyBcInNvdXJjZVwiIDogXCJ0YXJnZXRcIjsgICAgXHJcbiAgICAgIHZhciBuZXdQb3NpdGlvbiA9IGNsYWN1bGF0ZU5ld0Nsb25lUG9zaXRpb24oZWRnZS5zb3VyY2VFbmRwb2ludCgpLngsZWRnZS5zb3VyY2VFbmRwb2ludCgpLnksZWRnZS50YXJnZXRFbmRwb2ludCgpLngsZWRnZS50YXJnZXRFbmRwb2ludCgpLnksZGVzaXJlZERpc3RhbmNlLHN0YXJ0UG9zaXRpb24pOyBcclxuICAgICAgdmFyIG5ld05vZGVJZCA9IG5vZGUuaWQoKSsnY2xvbmUtJytpbmRleDtcclxuICAgICAgLy9lZGdlQ2xvbmUuZGF0YSgpLmlkID0gZWRnZUNsb25lLmRhdGEoKS5pZCsgXCItXCIrbmV3Tm9kZUlkO1xyXG4gICAgICBpZihlZGdlLnNvdXJjZSgpLmlkKCkgPT0gbm9kZS5pZCgpKXsgICAgICAgIFxyXG4gICAgICAgIGVkZ2VDbG9uZS5kYXRhKCkuc291cmNlID0gbmV3Tm9kZUlkO1xyXG4gICAgICAgIGVkZ2VDbG9uZS5kYXRhKCkucG9ydHNvdXJjZSA9IG5ld05vZGVJZDsgICAgXHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgZWRnZUNsb25lLmRhdGEoKS50YXJnZXQgPSBuZXdOb2RlSWQ7XHJcbiAgICAgICAgZWRnZUNsb25lLmRhdGEoKS5wb3J0dGFyZ2V0ID0gbmV3Tm9kZUlkOyAgICBcclxuICAgICAgfVxyXG4gICAgICB2YXIgbmV3Tm9kZSA9IG5vZGUuY2xvbmUoKTtcclxuICAgICAgbmV3Tm9kZS5kYXRhKCkuaWQgPSBuZXdOb2RlSWQ7XHJcbiAgICAgIGN5LmFkZChuZXdOb2RlKTtcclxuICAgICBcclxuICAgICAgZWRnZS5yZW1vdmUoKTtcclxuICAgICAgY3kuYWRkKGVkZ2VDbG9uZSk7XHJcbiAgICAgIG5ld05vZGUucG9zaXRpb24oe1xyXG4gICAgICAgIHg6IG5ld1Bvc2l0aW9uLmN4LFxyXG4gICAgICAgIHk6IG5ld1Bvc2l0aW9uLmN5XHJcbiAgICAgIH0pO1xyXG4gICAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5ld05vZGUsIHRydWUpO1xyXG4gICAgICBcclxuICAgIH0gIFxyXG4gICAgXHJcbiAgICB2YXIgbmV3UG9zaXRpb24gPSBjbGFjdWxhdGVOZXdDbG9uZVBvc2l0aW9uKFxyXG4gICAgICBlZGdlc1swXS5zb3VyY2VFbmRwb2ludCgpLngsXHJcbiAgICAgIGVkZ2VzWzBdLnNvdXJjZUVuZHBvaW50KCkueSxcclxuICAgICAgZWRnZXNbMF0udGFyZ2V0RW5kcG9pbnQoKS54LFxyXG4gICAgICBlZGdlc1swXS50YXJnZXRFbmRwb2ludCgpLnksXHJcbiAgICAgIGRlc2lyZWREaXN0YW5jZSxlZGdlc1swXS5zb3VyY2UoKS5pZCgpID09IG5vZGUuaWQoKSA/IFwic291cmNlXCIgOiBcInRhcmdldFwiXHJcbiAgICAgICk7XHJcbiAgXHJcbiAgICB2YXIgY2xvbmVFZGdlID0gZWRnZXNbMF0uY2xvbmUoKTtcclxuICAgIC8vY2xvbmVFZGdlLmRhdGEoKS5pZCA9IGNsb25lRWRnZS5kYXRhKCkuaWQrIFwiLVwiK25vZGUuaWQoKSsnY2xvbmUtMCc7XHJcbiAgICBcclxuICAgIGVkZ2VzWzBdLnJlbW92ZSgpO1xyXG4gICAgY3kuYWRkKGNsb25lRWRnZSk7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldENsb25lTWFya2VyU3RhdHVzKG5vZGUsdHJ1ZSk7XHJcbiAgICBub2RlLnBvc2l0aW9uKHtcclxuICAgICAgeDogbmV3UG9zaXRpb24uY3gsXHJcbiAgICAgIHk6IG5ld1Bvc2l0aW9uLmN5XHJcbiAgICB9KTtcclxuICBcclxuICAgIHJlc3VsdC5vbGRYID0gb2xkWDsgICAgXHJcbiAgICByZXN1bHQub2xkWSA9IG9sZFk7XHJcbiAgICByZXN1bHQubm9kZSA9IG5vZGU7XHJcbiAgICByZXN1bHQubnVtYmVyT2ZFZGdlcyA9IGVkZ2VzLmxlbmd0aDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcblxyXG4gIH1cclxuXHJcbiAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMudW5DbG9uZUhpZ2hEZWdyZWVOb2RlID0gZnVuY3Rpb24ocGFyYW0pe1xyXG5cclxuICAgIHZhciBub2RlID0gcGFyYW0ubm9kZTtcclxuICAgIGVsZW1lbnRVdGlsaXRpZXMuc2V0Q2xvbmVNYXJrZXJTdGF0dXMobm9kZSxmYWxzZSk7XHJcbiAgICBub2RlLnBvc2l0aW9uKHtcclxuICAgICAgeDogcGFyYW0ub2xkWCxcclxuICAgICAgeTogcGFyYW0ub2xkWVxyXG4gICAgfSk7XHJcbiAgXHJcbiAgICBmb3IodmFyIGkgPSAxIDsgaSA8IHBhcmFtLm51bWJlck9mRWRnZXMgOyBpKyspe1xyXG4gICAgICB2YXIgY2xvbmVJZCA9IG5vZGUuaWQoKSsnY2xvbmUtJytpO1xyXG4gICAgICB2YXIgY2xvbmUgPSBjeS4kKFwiI1wiK2Nsb25lSWQpO1xyXG4gICAgICB2YXIgY2xvbmVFZGdlID0gY2xvbmUuY29ubmVjdGVkRWRnZXMoKVswXTtcclxuICAgICAgdmFyIGVkZ2UgPSBjbG9uZUVkZ2UuY2xvbmUoKTtcclxuICAgICAgXHJcbiAgICBcclxuICAgICAgaWYoZWRnZS5kYXRhKCkuc291cmNlID09IGNsb25lSWQpeyAgICAgICAgXHJcbiAgICAgICAgZWRnZS5kYXRhKCkuc291cmNlID0gbm9kZS5pZCgpO1xyXG4gICAgICAgIGVkZ2UuZGF0YSgpLnBvcnRzb3VyY2UgPSAgbm9kZS5pZCgpOyAgICBcclxuICAgICAgfWVsc2V7ICAgICAgICAgIFxyXG4gICAgICAgIGVkZ2UuZGF0YSgpLnRhcmdldCA9ICBub2RlLmlkKCk7XHJcbiAgICAgICAgZWRnZS5kYXRhKCkucG9ydHRhcmdldCA9ICBub2RlLmlkKCk7ICAgIFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjbG9uZUVkZ2UucmVtb3ZlKCk7XHJcbiAgICAgIGNsb25lLnJlbW92ZSgpO1xyXG4gICAgICBcclxuICAgICAgY3kuYWRkKGVkZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBub2RlO1xyXG4gIH1cclxuXHJcbiAgdW5kb1JlZG9BY3Rpb25GdW5jdGlvbnMuY2hhbmdlTWFwVHlwZSA9IGZ1bmN0aW9uKHBhcmFtKXtcclxuICAgIHZhciByZXN1bHQgPXt9O1xyXG4gICAgdmFyIGN1cnJlbnRNYXBUeXBlID0gZWxlbWVudFV0aWxpdGllcy5nZXRNYXBUeXBlKCk7XHJcbiAgICBlbGVtZW50VXRpbGl0aWVzLnNldE1hcFR5cGUocGFyYW0ubWFwVHlwZSk7XHJcbiAgICByZXN1bHQubWFwVHlwZSA9IGN1cnJlbnRNYXBUeXBlO1xyXG4gICAgcmVzdWx0LmNhbGxiYWNrID0gcGFyYW0uY2FsbGJhY2s7XHJcbiAgICBwYXJhbS5jYWxsYmFjaygpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHVuZG9SZWRvQWN0aW9uRnVuY3Rpb25zRXh0ZW5kZXI7XHJcbn07XHJcbiJdfQ==
