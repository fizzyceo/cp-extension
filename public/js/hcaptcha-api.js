/* { "version": "1", "hash": "MEUCIBqAaiKdxLMPTuxUYkPchXabTG2YHn4bzOR+pIB+7jRuAiEAo9OGCu47idNlzHJhcO2wtv3V258ooAGHphMRXA+8Xk0=" } */
/* https://hcaptcha.com/license */
!(function () {
  "use strict";
  function e(e) {
    var t = this.constructor;
    return this.then(
      function (n) {
        return t.resolve(e()).then(function () {
          return n;
        });
      },
      function (n) {
        return t.resolve(e()).then(function () {
          return t.reject(n);
        });
      }
    );
  }
  function t(e) {
    return new this(function (t, n) {
      if (!e || "undefined" == typeof e.length)
        return n(
          new TypeError(
            typeof e +
              " " +
              e +
              " is not iterable(cannot read property Symbol(Symbol.iterator))"
          )
        );
      var r = Array.prototype.slice.call(e);
      if (0 === r.length) return t([]);
      var i = r.length;
      function o(e, n) {
        if (n && ("object" == typeof n || "function" == typeof n)) {
          var a = n.then;
          if ("function" == typeof a)
            return void a.call(
              n,
              function (t) {
                o(e, t);
              },
              function (n) {
                (r[e] = { status: "rejected", reason: n }), 0 == --i && t(r);
              }
            );
        }
        (r[e] = { status: "fulfilled", value: n }), 0 == --i && t(r);
      }
      for (var a = 0; a < r.length; a++) o(a, r[a]);
    });
  }
  var n = setTimeout,
    r = "undefined" != typeof setImmediate ? setImmediate : null;
  function i(e) {
    return Boolean(e && "undefined" != typeof e.length);
  }
  function o() {}
  function a(e) {
    if (!(this instanceof a))
      throw new TypeError("Promises must be constructed via new");
    if ("function" != typeof e) throw new TypeError("not a function");
    (this._state = 0),
      (this._handled = !1),
      (this._value = undefined),
      (this._deferreds = []),
      p(e, this);
  }
  function s(e, t) {
    for (; 3 === e._state; ) e = e._value;
    0 !== e._state
      ? ((e._handled = !0),
        a._immediateFn(function () {
          var n = 1 === e._state ? t.onFulfilled : t.onRejected;
          if (null !== n) {
            var r;
            try {
              r = n(e._value);
            } catch (i) {
              return void l(t.promise, i);
            }
            c(t.promise, r);
          } else (1 === e._state ? c : l)(t.promise, e._value);
        }))
      : e._deferreds.push(t);
  }
  function c(e, t) {
    try {
      if (t === e)
        throw new TypeError("A promise cannot be resolved with itself.");
      if (t && ("object" == typeof t || "function" == typeof t)) {
        var n = t.then;
        if (t instanceof a) return (e._state = 3), (e._value = t), void u(e);
        if ("function" == typeof n)
          return void p(
            ((r = n),
            (i = t),
            function () {
              r.apply(i, arguments);
            }),
            e
          );
      }
      (e._state = 1), (e._value = t), u(e);
    } catch (o) {
      l(e, o);
    }
    var r, i;
  }
  function l(e, t) {
    (e._state = 2), (e._value = t), u(e);
  }
  function u(e) {
    2 === e._state &&
      0 === e._deferreds.length &&
      a._immediateFn(function () {
        e._handled || a._unhandledRejectionFn(e._value);
      });
    for (var t = 0, n = e._deferreds.length; t < n; t++) s(e, e._deferreds[t]);
    e._deferreds = null;
  }
  function h(e, t, n) {
    (this.onFulfilled = "function" == typeof e ? e : null),
      (this.onRejected = "function" == typeof t ? t : null),
      (this.promise = n);
  }
  function p(e, t) {
    var n = !1;
    try {
      e(
        function (e) {
          n || ((n = !0), c(t, e));
        },
        function (e) {
          n || ((n = !0), l(t, e));
        }
      );
    } catch (r) {
      if (n) return;
      (n = !0), l(t, r);
    }
  }
  (a.prototype["catch"] = function (e) {
    return this.then(null, e);
  }),
    (a.prototype.then = function (e, t) {
      var n = new this.constructor(o);
      return s(this, new h(e, t, n)), n;
    }),
    (a.prototype["finally"] = e),
    (a.all = function (e) {
      return new a(function (t, n) {
        if (!i(e)) return n(new TypeError("Promise.all accepts an array"));
        var r = Array.prototype.slice.call(e);
        if (0 === r.length) return t([]);
        var o = r.length;
        function a(e, i) {
          try {
            if (i && ("object" == typeof i || "function" == typeof i)) {
              var s = i.then;
              if ("function" == typeof s)
                return void s.call(
                  i,
                  function (t) {
                    a(e, t);
                  },
                  n
                );
            }
            (r[e] = i), 0 == --o && t(r);
          } catch (c) {
            n(c);
          }
        }
        for (var s = 0; s < r.length; s++) a(s, r[s]);
      });
    }),
    (a.allSettled = t),
    (a.resolve = function (e) {
      return e && "object" == typeof e && e.constructor === a
        ? e
        : new a(function (t) {
            t(e);
          });
    }),
    (a.reject = function (e) {
      return new a(function (t, n) {
        n(e);
      });
    }),
    (a.race = function (e) {
      return new a(function (t, n) {
        if (!i(e)) return n(new TypeError("Promise.race accepts an array"));
        for (var r = 0, o = e.length; r < o; r++) a.resolve(e[r]).then(t, n);
      });
    }),
    (a._immediateFn =
      ("function" == typeof r &&
        function (e) {
          r(e);
        }) ||
      function (e) {
        n(e, 0);
      }),
    (a._unhandledRejectionFn = function (e) {
      "undefined" != typeof console &&
        console &&
        console.warn("Possible Unhandled Promise Rejection:", e);
    });
  var d = (function () {
    if ("undefined" != typeof self) return self;
    if ("undefined" != typeof window) return window;
    if ("undefined" != typeof global) return global;
    throw new Error("unable to locate global object");
  })();
  function f(e, t, n) {
    return t <= e && e <= n;
  }
  function m(e) {
    if (e === undefined) return {};
    if (e === Object(e)) return e;
    throw TypeError("Could not convert argument to dictionary");
  }
  "function" != typeof d.Promise
    ? (d.Promise = a)
    : (d.Promise.prototype["finally"] || (d.Promise.prototype["finally"] = e),
      d.Promise.allSettled || (d.Promise.allSettled = t));
  var g = function (e) {
      return e >= 0 && e <= 127;
    },
    y = -1;
  function v(e) {
    (this.tokens = [].slice.call(e)), this.tokens.reverse();
  }
  v.prototype = {
    endOfStream: function () {
      return !this.tokens.length;
    },
    read: function () {
      return this.tokens.length ? this.tokens.pop() : y;
    },
    prepend: function (e) {
      if (Array.isArray(e))
        for (var t = e; t.length; ) this.tokens.push(t.pop());
      else this.tokens.push(e);
    },
    push: function (e) {
      if (Array.isArray(e))
        for (var t = e; t.length; ) this.tokens.unshift(t.shift());
      else this.tokens.unshift(e);
    },
  };
  var b = -1;
  function w(e, t) {
    if (e) throw TypeError("Decoder error");
    return t || 65533;
  }
  function _(e) {
    return (
      (e = String(e).trim().toLowerCase()),
      Object.prototype.hasOwnProperty.call(S, e) ? S[e] : null
    );
  }
  var S = {};
  [
    {
      encodings: [
        { labels: ["unicode-1-1-utf-8", "utf-8", "utf8"], name: "UTF-8" },
      ],
      heading: "The Encoding",
    },
  ].forEach(function (e) {
    e.encodings.forEach(function (e) {
      e.labels.forEach(function (t) {
        S[t] = e;
      });
    });
  });
  var E,
    k = {
      "UTF-8": function (e) {
        return new T(e);
      },
    },
    U = {
      "UTF-8": function (e) {
        return new W(e);
      },
    },
    x = "utf-8";
  function V(e, t) {
    if (!(this instanceof V))
      throw TypeError("Called as a function. Did you forget 'new'?");
    (e = e !== undefined ? String(e) : x),
      (t = m(t)),
      (this._encoding = null),
      (this._decoder = null),
      (this._ignoreBOM = !1),
      (this._BOMseen = !1),
      (this._error_mode = "replacement"),
      (this._do_not_flush = !1);
    var n = _(e);
    if (null === n || "replacement" === n.name)
      throw RangeError("Unknown encoding: " + e);
    if (!U[n.name])
      throw Error(
        "Decoder not present. Did you forget to include encoding-indexes.js first?"
      );
    var r = this;
    return (
      (r._encoding = n),
      t.fatal && (r._error_mode = "fatal"),
      t.ignoreBOM && (r._ignoreBOM = !0),
      Object.defineProperty ||
        ((this.encoding = r._encoding.name.toLowerCase()),
        (this.fatal = "fatal" === r._error_mode),
        (this.ignoreBOM = r._ignoreBOM)),
      r
    );
  }
  function R(e, t) {
    if (!(this instanceof R))
      throw TypeError("Called as a function. Did you forget 'new'?");
    (t = m(t)),
      (this._encoding = null),
      (this._encoder = null),
      (this._do_not_flush = !1),
      (this._fatal = t.fatal ? "fatal" : "replacement");
    var n = this;
    if (t.NONSTANDARD_allowLegacyEncoding) {
      var r = _((e = e !== undefined ? String(e) : x));
      if (null === r || "replacement" === r.name)
        throw RangeError("Unknown encoding: " + e);
      if (!k[r.name])
        throw Error(
          "Encoder not present. Did you forget to include encoding-indexes.js first?"
        );
      n._encoding = r;
    } else n._encoding = _("utf-8");
    return (
      Object.defineProperty || (this.encoding = n._encoding.name.toLowerCase()),
      n
    );
  }
  function W(e) {
    var t = e.fatal,
      n = 0,
      r = 0,
      i = 0,
      o = 128,
      a = 191;
    this.handler = function (e, s) {
      if (s === y && 0 !== i) return (i = 0), w(t);
      if (s === y) return b;
      if (0 === i) {
        if (f(s, 0, 127)) return s;
        if (f(s, 194, 223)) (i = 1), (n = 31 & s);
        else if (f(s, 224, 239))
          224 === s && (o = 160), 237 === s && (a = 159), (i = 2), (n = 15 & s);
        else {
          if (!f(s, 240, 244)) return w(t);
          240 === s && (o = 144), 244 === s && (a = 143), (i = 3), (n = 7 & s);
        }
        return null;
      }
      if (!f(s, o, a))
        return (n = i = r = 0), (o = 128), (a = 191), e.prepend(s), w(t);
      if (((o = 128), (a = 191), (n = (n << 6) | (63 & s)), (r += 1) !== i))
        return null;
      var c = n;
      return (n = i = r = 0), c;
    };
  }
  function T(e) {
    e.fatal;
    this.handler = function (e, t) {
      if (t === y) return b;
      if (g(t)) return t;
      var n, r;
      f(t, 128, 2047)
        ? ((n = 1), (r = 192))
        : f(t, 2048, 65535)
        ? ((n = 2), (r = 224))
        : f(t, 65536, 1114111) && ((n = 3), (r = 240));
      for (var i = [(t >> (6 * n)) + r]; n > 0; ) {
        var o = t >> (6 * (n - 1));
        i.push(128 | (63 & o)), (n -= 1);
      }
      return i;
    };
  }
  Object.defineProperty &&
    (Object.defineProperty(V.prototype, "encoding", {
      get: function () {
        return this._encoding.name.toLowerCase();
      },
    }),
    Object.defineProperty(V.prototype, "fatal", {
      get: function () {
        return "fatal" === this._error_mode;
      },
    }),
    Object.defineProperty(V.prototype, "ignoreBOM", {
      get: function () {
        return this._ignoreBOM;
      },
    })),
    (V.prototype.decode = function (e, t) {
      var n;
      (n =
        "object" == typeof e && e instanceof ArrayBuffer
          ? new Uint8Array(e)
          : "object" == typeof e &&
            "buffer" in e &&
            e.buffer instanceof ArrayBuffer
          ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength)
          : new Uint8Array(0)),
        (t = m(t)),
        this._do_not_flush ||
          ((this._decoder = U[this._encoding.name]({
            fatal: "fatal" === this._error_mode,
          })),
          (this._BOMseen = !1)),
        (this._do_not_flush = Boolean(t.stream));
      for (var r, i = new v(n), o = []; ; ) {
        var a = i.read();
        if (a === y) break;
        if ((r = this._decoder.handler(i, a)) === b) break;
        null !== r && (Array.isArray(r) ? o.push.apply(o, r) : o.push(r));
      }
      if (!this._do_not_flush) {
        do {
          if ((r = this._decoder.handler(i, i.read())) === b) break;
          null !== r && (Array.isArray(r) ? o.push.apply(o, r) : o.push(r));
        } while (!i.endOfStream());
        this._decoder = null;
      }
      return function (e) {
        var t, n;
        return (
          (t = ["UTF-8", "UTF-16LE", "UTF-16BE"]),
          (n = this._encoding.name),
          -1 === t.indexOf(n) ||
            this._ignoreBOM ||
            this._BOMseen ||
            (e.length > 0 && 65279 === e[0]
              ? ((this._BOMseen = !0), e.shift())
              : e.length > 0 && (this._BOMseen = !0)),
          (function (e) {
            for (var t = "", n = 0; n < e.length; ++n) {
              var r = e[n];
              r <= 65535
                ? (t += String.fromCharCode(r))
                : ((r -= 65536),
                  (t += String.fromCharCode(
                    55296 + (r >> 10),
                    56320 + (1023 & r)
                  )));
            }
            return t;
          })(e)
        );
      }.call(this, o);
    }),
    Object.defineProperty &&
      Object.defineProperty(R.prototype, "encoding", {
        get: function () {
          return this._encoding.name.toLowerCase();
        },
      }),
    (R.prototype.encode = function (e, t) {
      (e = e === undefined ? "" : String(e)),
        (t = m(t)),
        this._do_not_flush ||
          (this._encoder = k[this._encoding.name]({
            fatal: "fatal" === this._fatal,
          })),
        (this._do_not_flush = Boolean(t.stream));
      for (
        var n,
          r = new v(
            (function (e) {
              for (var t = String(e), n = t.length, r = 0, i = []; r < n; ) {
                var o = t.charCodeAt(r);
                if (o < 55296 || o > 57343) i.push(o);
                else if (o >= 56320 && o <= 57343) i.push(65533);
                else if (o >= 55296 && o <= 56319)
                  if (r === n - 1) i.push(65533);
                  else {
                    var a = t.charCodeAt(r + 1);
                    if (a >= 56320 && a <= 57343) {
                      var s = 1023 & o,
                        c = 1023 & a;
                      i.push(65536 + (s << 10) + c), (r += 1);
                    } else i.push(65533);
                  }
                r += 1;
              }
              return i;
            })(e)
          ),
          i = [];
        ;

      ) {
        var o = r.read();
        if (o === y) break;
        if ((n = this._encoder.handler(r, o)) === b) break;
        Array.isArray(n) ? i.push.apply(i, n) : i.push(n);
      }
      if (!this._do_not_flush) {
        for (; (n = this._encoder.handler(r, r.read())) !== b; )
          Array.isArray(n) ? i.push.apply(i, n) : i.push(n);
        this._encoder = null;
      }
      return new Uint8Array(i);
    }),
    window.TextDecoder || (window.TextDecoder = V),
    window.TextEncoder || (window.TextEncoder = R),
    (function (e) {
      if ("function" != typeof Promise) throw "Promise support required";
      var t = e.crypto || e.msCrypto;
      if (t) {
        var n = t.subtle || t.webkitSubtle;
        if (n) {
          var r = e.Crypto || t.constructor || Object,
            i = e.SubtleCrypto || n.constructor || Object,
            o =
              (e.CryptoKey || e.Key,
              e.navigator.userAgent.indexOf("Edge/") > -1),
            a = !!e.msCrypto && !o,
            s = !t.subtle && !!t.webkitSubtle;
          if (a || s) {
            var c = { KoZIhvcNAQEB: "1.2.840.113549.1.1.1" },
              l = { "1.2.840.113549.1.1.1": "KoZIhvcNAQEB" };
            if (
              (["generateKey", "importKey", "unwrapKey"].forEach(function (e) {
                var r = n[e];
                n[e] = function (i, o, c) {
                  var l,
                    u,
                    h,
                    f,
                    w = [].slice.call(arguments);
                  switch (e) {
                    case "generateKey":
                      (l = m(i)), (u = o), (h = c);
                      break;
                    case "importKey":
                      (l = m(c)),
                        (u = w[3]),
                        (h = w[4]),
                        "jwk" === i &&
                          ((o = y(o)).alg || (o.alg = g(l)),
                          o.key_ops ||
                            (o.key_ops =
                              "oct" !== o.kty
                                ? "d" in o
                                  ? h.filter(U)
                                  : h.filter(k)
                                : h.slice()),
                          (w[1] = v(o)));
                      break;
                    case "unwrapKey":
                      (l = w[4]), (u = w[5]), (h = w[6]), (w[2] = c._key);
                  }
                  if ("generateKey" === e && "HMAC" === l.name && l.hash)
                    return (
                      (l.length =
                        l.length ||
                        {
                          "SHA-1": 512,
                          "SHA-256": 512,
                          "SHA-384": 1024,
                          "SHA-512": 1024,
                        }[l.hash.name]),
                      n.importKey(
                        "raw",
                        t.getRandomValues(new Uint8Array((l.length + 7) >> 3)),
                        l,
                        u,
                        h
                      )
                    );
                  if (
                    s &&
                    "generateKey" === e &&
                    "RSASSA-PKCS1-v1_5" === l.name &&
                    (!l.modulusLength || l.modulusLength >= 2048)
                  )
                    return (
                      ((i = m(i)).name = "RSAES-PKCS1-v1_5"),
                      delete i.hash,
                      n
                        .generateKey(i, !0, ["encrypt", "decrypt"])
                        .then(function (e) {
                          return Promise.all([
                            n.exportKey("jwk", e.publicKey),
                            n.exportKey("jwk", e.privateKey),
                          ]);
                        })
                        .then(function (e) {
                          return (
                            (e[0].alg = e[1].alg = g(l)),
                            (e[0].key_ops = h.filter(k)),
                            (e[1].key_ops = h.filter(U)),
                            Promise.all([
                              n.importKey("jwk", e[0], l, !0, e[0].key_ops),
                              n.importKey("jwk", e[1], l, u, e[1].key_ops),
                            ])
                          );
                        })
                        .then(function (e) {
                          return { publicKey: e[0], privateKey: e[1] };
                        })
                    );
                  if (
                    (s || (a && "SHA-1" === (l.hash || {}).name)) &&
                    "importKey" === e &&
                    "jwk" === i &&
                    "HMAC" === l.name &&
                    "oct" === o.kty
                  )
                    return n.importKey("raw", d(p(o.k)), c, w[3], w[4]);
                  if (s && "importKey" === e && ("spki" === i || "pkcs8" === i))
                    return n.importKey("jwk", b(o), c, w[3], w[4]);
                  if (a && "unwrapKey" === e)
                    return n.decrypt(w[3], c, o).then(function (e) {
                      return n.importKey(i, e, w[4], w[5], w[6]);
                    });
                  try {
                    f = r.apply(n, w);
                  } catch (_) {
                    return Promise.reject(_);
                  }
                  return (
                    a &&
                      (f = new Promise(function (e, t) {
                        (f.onabort = f.onerror =
                          function (e) {
                            t(e);
                          }),
                          (f.oncomplete = function (t) {
                            e(t.target.result);
                          });
                      })),
                    (f = f.then(function (e) {
                      return (
                        "HMAC" === l.name &&
                          (l.length || (l.length = 8 * e.algorithm.length)),
                        0 == l.name.search("RSA") &&
                          (l.modulusLength ||
                            (l.modulusLength = (
                              e.publicKey || e
                            ).algorithm.modulusLength),
                          l.publicExponent ||
                            (l.publicExponent = (
                              e.publicKey || e
                            ).algorithm.publicExponent)),
                        (e =
                          e.publicKey && e.privateKey
                            ? {
                                publicKey: new E(
                                  e.publicKey,
                                  l,
                                  u,
                                  h.filter(k)
                                ),
                                privateKey: new E(
                                  e.privateKey,
                                  l,
                                  u,
                                  h.filter(U)
                                ),
                              }
                            : new E(e, l, u, h))
                      );
                    }))
                  );
                };
              }),
              ["exportKey", "wrapKey"].forEach(function (e) {
                var t = n[e];
                n[e] = function (r, i, o) {
                  var c,
                    l = [].slice.call(arguments);
                  switch (e) {
                    case "exportKey":
                      l[1] = i._key;
                      break;
                    case "wrapKey":
                      (l[1] = i._key), (l[2] = o._key);
                  }
                  if (
                    ((s || (a && "SHA-1" === (i.algorithm.hash || {}).name)) &&
                      "exportKey" === e &&
                      "jwk" === r &&
                      "HMAC" === i.algorithm.name &&
                      (l[0] = "raw"),
                    !s ||
                      "exportKey" !== e ||
                      ("spki" !== r && "pkcs8" !== r) ||
                      (l[0] = "jwk"),
                    a && "wrapKey" === e)
                  )
                    return n.exportKey(r, i).then(function (e) {
                      return (
                        "jwk" === r &&
                          (e = d(
                            unescape(encodeURIComponent(JSON.stringify(y(e))))
                          )),
                        n.encrypt(l[3], o, e)
                      );
                    });
                  try {
                    c = t.apply(n, l);
                  } catch (u) {
                    return Promise.reject(u);
                  }
                  return (
                    a &&
                      (c = new Promise(function (e, t) {
                        (c.onabort = c.onerror =
                          function (e) {
                            t(e);
                          }),
                          (c.oncomplete = function (t) {
                            e(t.target.result);
                          });
                      })),
                    "exportKey" === e &&
                      "jwk" === r &&
                      (c = c.then(function (e) {
                        return (s ||
                          (a && "SHA-1" === (i.algorithm.hash || {}).name)) &&
                          "HMAC" === i.algorithm.name
                          ? {
                              kty: "oct",
                              alg: g(i.algorithm),
                              key_ops: i.usages.slice(),
                              ext: !0,
                              k: h(f(e)),
                            }
                          : ((e = y(e)).alg || (e.alg = g(i.algorithm)),
                            e.key_ops ||
                              (e.key_ops =
                                "public" === i.type
                                  ? i.usages.filter(k)
                                  : "private" === i.type
                                  ? i.usages.filter(U)
                                  : i.usages.slice()),
                            e);
                      })),
                    !s ||
                      "exportKey" !== e ||
                      ("spki" !== r && "pkcs8" !== r) ||
                      (c = c.then(function (e) {
                        return (e = w(y(e)));
                      })),
                    c
                  );
                };
              }),
              ["encrypt", "decrypt", "sign", "verify"].forEach(function (e) {
                var t = n[e];
                n[e] = function (r, i, o, s) {
                  if (a && (!o.byteLength || (s && !s.byteLength)))
                    throw new Error("Empty input is not allowed");
                  var c,
                    l = [].slice.call(arguments),
                    u = m(r);
                  if (
                    (!a ||
                      ("sign" !== e && "verify" !== e) ||
                      ("RSASSA-PKCS1-v1_5" !== r && "HMAC" !== r) ||
                      (l[0] = { name: r }),
                    a &&
                      i.algorithm.hash &&
                      (l[0].hash = l[0].hash || i.algorithm.hash),
                    a && "decrypt" === e && "AES-GCM" === u.name)
                  ) {
                    var h = r.tagLength >> 3;
                    (l[2] = (o.buffer || o).slice(0, o.byteLength - h)),
                      (r.tag = (o.buffer || o).slice(o.byteLength - h));
                  }
                  a &&
                    "AES-GCM" === u.name &&
                    l[0].tagLength === undefined &&
                    (l[0].tagLength = 128),
                    (l[1] = i._key);
                  try {
                    c = t.apply(n, l);
                  } catch (p) {
                    return Promise.reject(p);
                  }
                  return (
                    a &&
                      (c = new Promise(function (t, n) {
                        (c.onabort = c.onerror =
                          function (e) {
                            n(e);
                          }),
                          (c.oncomplete = function (n) {
                            n = n.target.result;
                            if (
                              "encrypt" === e &&
                              n instanceof AesGcmEncryptResult
                            ) {
                              var r = n.ciphertext,
                                i = n.tag;
                              (n = new Uint8Array(
                                r.byteLength + i.byteLength
                              )).set(new Uint8Array(r), 0),
                                n.set(new Uint8Array(i), r.byteLength),
                                (n = n.buffer);
                            }
                            t(n);
                          });
                      })),
                    c
                  );
                };
              }),
              a)
            ) {
              var u = n.digest;
              (n.digest = function (e, t) {
                if (!t.byteLength)
                  throw new Error("Empty input is not allowed");
                var r;
                try {
                  r = u.call(n, e, t);
                } catch (i) {
                  return Promise.reject(i);
                }
                return (
                  (r = new Promise(function (e, t) {
                    (r.onabort = r.onerror =
                      function (e) {
                        t(e);
                      }),
                      (r.oncomplete = function (t) {
                        e(t.target.result);
                      });
                  })),
                  r
                );
              }),
                (e.crypto = Object.create(t, {
                  getRandomValues: {
                    value: function (e) {
                      return t.getRandomValues(e);
                    },
                  },
                  subtle: { value: n },
                })),
                (e.CryptoKey = E);
            }
            s &&
              ((t.subtle = n),
              (e.Crypto = r),
              (e.SubtleCrypto = i),
              (e.CryptoKey = E));
          }
        }
      }
      function h(e) {
        return btoa(e)
          .replace(/\=+$/, "")
          .replace(/\+/g, "-")
          .replace(/\//g, "_");
      }
      function p(e) {
        return (
          (e = (e += "===").slice(0, -e.length % 4)),
          atob(e.replace(/-/g, "+").replace(/_/g, "/"))
        );
      }
      function d(e) {
        for (var t = new Uint8Array(e.length), n = 0; n < e.length; n++)
          t[n] = e.charCodeAt(n);
        return t;
      }
      function f(e) {
        return (
          e instanceof ArrayBuffer && (e = new Uint8Array(e)),
          String.fromCharCode.apply(String, e)
        );
      }
      function m(e) {
        var t = { name: (e.name || e || "").toUpperCase().replace("V", "v") };
        switch (t.name) {
          case "SHA-1":
          case "SHA-256":
          case "SHA-384":
          case "SHA-512":
            break;
          case "AES-CBC":
          case "AES-GCM":
          case "AES-KW":
            e.length && (t.length = e.length);
            break;
          case "HMAC":
            e.hash && (t.hash = m(e.hash)), e.length && (t.length = e.length);
            break;
          case "RSAES-PKCS1-v1_5":
            e.publicExponent &&
              (t.publicExponent = new Uint8Array(e.publicExponent)),
              e.modulusLength && (t.modulusLength = e.modulusLength);
            break;
          case "RSASSA-PKCS1-v1_5":
          case "RSA-OAEP":
            e.hash && (t.hash = m(e.hash)),
              e.publicExponent &&
                (t.publicExponent = new Uint8Array(e.publicExponent)),
              e.modulusLength && (t.modulusLength = e.modulusLength);
            break;
          default:
            throw new SyntaxError("Bad algorithm name");
        }
        return t;
      }
      function g(e) {
        return {
          HMAC: {
            "SHA-1": "HS1",
            "SHA-256": "HS256",
            "SHA-384": "HS384",
            "SHA-512": "HS512",
          },
          "RSASSA-PKCS1-v1_5": {
            "SHA-1": "RS1",
            "SHA-256": "RS256",
            "SHA-384": "RS384",
            "SHA-512": "RS512",
          },
          "RSAES-PKCS1-v1_5": { "": "RSA1_5" },
          "RSA-OAEP": { "SHA-1": "RSA-OAEP", "SHA-256": "RSA-OAEP-256" },
          "AES-KW": { 128: "A128KW", 192: "A192KW", 256: "A256KW" },
          "AES-GCM": { 128: "A128GCM", 192: "A192GCM", 256: "A256GCM" },
          "AES-CBC": { 128: "A128CBC", 192: "A192CBC", 256: "A256CBC" },
        }[e.name][(e.hash || {}).name || e.length || ""];
      }
      function y(e) {
        (e instanceof ArrayBuffer || e instanceof Uint8Array) &&
          (e = JSON.parse(decodeURIComponent(escape(f(e)))));
        var t = { kty: e.kty, alg: e.alg, ext: e.ext || e.extractable };
        switch (t.kty) {
          case "oct":
            t.k = e.k;
          case "RSA":
            ["n", "e", "d", "p", "q", "dp", "dq", "qi", "oth"].forEach(
              function (n) {
                n in e && (t[n] = e[n]);
              }
            );
            break;
          default:
            throw new TypeError("Unsupported key type");
        }
        return t;
      }
      function v(e) {
        var t = y(e);
        return (
          a && ((t.extractable = t.ext), delete t.ext),
          d(unescape(encodeURIComponent(JSON.stringify(t)))).buffer
        );
      }
      function b(e) {
        var t = _(e),
          n = !1;
        t.length > 2 && ((n = !0), t.shift());
        var r = { ext: !0 };
        if ("1.2.840.113549.1.1.1" !== t[0][0])
          throw new TypeError("Unsupported key type");
        var i = ["n", "e", "d", "p", "q", "dp", "dq", "qi"],
          o = _(t[1]);
        n && o.shift();
        for (var a = 0; a < o.length; a++)
          o[a][0] || (o[a] = o[a].subarray(1)), (r[i[a]] = h(f(o[a])));
        return (r.kty = "RSA"), r;
      }
      function w(e) {
        var t,
          n = [["", null]],
          r = !1;
        if ("RSA" !== e.kty) throw new TypeError("Unsupported key type");
        for (
          var i = ["n", "e", "d", "p", "q", "dp", "dq", "qi"], o = [], a = 0;
          a < i.length && i[a] in e;
          a++
        ) {
          var s = (o[a] = d(p(e[i[a]])));
          128 & s[0] && ((o[a] = new Uint8Array(s.length + 1)), o[a].set(s, 1));
        }
        return (
          o.length > 2 && ((r = !0), o.unshift(new Uint8Array([0]))),
          (n[0][0] = "1.2.840.113549.1.1.1"),
          (t = o),
          n.push(new Uint8Array(S(t)).buffer),
          r ? n.unshift(new Uint8Array([0])) : (n[1] = { tag: 3, value: n[1] }),
          new Uint8Array(S(n)).buffer
        );
      }
      function _(e, t) {
        if (
          (e instanceof ArrayBuffer && (e = new Uint8Array(e)),
          t || (t = { pos: 0, end: e.length }),
          t.end - t.pos < 2 || t.end > e.length)
        )
          throw new RangeError("Malformed DER");
        var n,
          r = e[t.pos++],
          i = e[t.pos++];
        if (i >= 128) {
          if (((i &= 127), t.end - t.pos < i))
            throw new RangeError("Malformed DER");
          for (var o = 0; i--; ) (o <<= 8), (o |= e[t.pos++]);
          i = o;
        }
        if (t.end - t.pos < i) throw new RangeError("Malformed DER");
        switch (r) {
          case 2:
            n = e.subarray(t.pos, (t.pos += i));
            break;
          case 3:
            if (e[t.pos++]) throw new Error("Unsupported bit string");
            i--;
          case 4:
            n = new Uint8Array(e.subarray(t.pos, (t.pos += i))).buffer;
            break;
          case 5:
            n = null;
            break;
          case 6:
            var a = btoa(f(e.subarray(t.pos, (t.pos += i))));
            if (!(a in c)) throw new Error("Unsupported OBJECT ID " + a);
            n = c[a];
            break;
          case 48:
            n = [];
            for (var s = t.pos + i; t.pos < s; ) n.push(_(e, t));
            break;
          default:
            throw new Error("Unsupported DER tag 0x" + r.toString(16));
        }
        return n;
      }
      function S(e, t) {
        t || (t = []);
        var n = 0,
          r = 0,
          i = t.length + 2;
        if ((t.push(0, 0), e instanceof Uint8Array)) {
          (n = 2), (r = e.length);
          for (var o = 0; o < r; o++) t.push(e[o]);
        } else if (e instanceof ArrayBuffer) {
          (n = 4), (r = e.byteLength), (e = new Uint8Array(e));
          for (o = 0; o < r; o++) t.push(e[o]);
        } else if (null === e) (n = 5), (r = 0);
        else if ("string" == typeof e && e in l) {
          var a = d(atob(l[e]));
          (n = 6), (r = a.length);
          for (o = 0; o < r; o++) t.push(a[o]);
        } else if (e instanceof Array) {
          for (o = 0; o < e.length; o++) S(e[o], t);
          (n = 48), (r = t.length - i);
        } else {
          if (
            !(
              "object" == typeof e &&
              3 === e.tag &&
              e.value instanceof ArrayBuffer
            )
          )
            throw new Error("Unsupported DER value " + e);
          (n = 3), (r = (e = new Uint8Array(e.value)).byteLength), t.push(0);
          for (o = 0; o < r; o++) t.push(e[o]);
          r++;
        }
        if (r >= 128) {
          var s = r;
          r = 4;
          for (
            t.splice(
              i,
              0,
              (s >> 24) & 255,
              (s >> 16) & 255,
              (s >> 8) & 255,
              255 & s
            );
            r > 1 && !(s >> 24);

          )
            (s <<= 8), r--;
          r < 4 && t.splice(i, 4 - r), (r |= 128);
        }
        return t.splice(i - 2, 2, n, r), t;
      }
      function E(e, t, n, r) {
        Object.defineProperties(this, {
          _key: { value: e },
          type: { value: e.type, enumerable: !0 },
          extractable: {
            value: n === undefined ? e.extractable : n,
            enumerable: !0,
          },
          algorithm: {
            value: t === undefined ? e.algorithm : t,
            enumerable: !0,
          },
          usages: { value: r === undefined ? e.usages : r, enumerable: !0 },
        });
      }
      function k(e) {
        return "verify" === e || "encrypt" === e || "wrapKey" === e;
      }
      function U(e) {
        return "sign" === e || "decrypt" === e || "unwrapKey" === e;
      }
    })(window),
    Array.prototype.indexOf ||
      (Array.prototype.indexOf = (function (e) {
        return function (t, n) {
          if (null === this || this === undefined)
            throw TypeError(
              "Array.prototype.indexOf called on null or undefined"
            );
          var r = e(this),
            i = r.length >>> 0,
            o = Math.min(0 | n, i);
          if (o < 0) o = Math.max(0, i + o);
          else if (o >= i) return -1;
          if (void 0 === t) {
            for (; o !== i; ++o) if (void 0 === r[o] && o in r) return o;
          } else if (t != t) {
            for (; o !== i; ++o) if (r[o] != r[o]) return o;
          } else for (; o !== i; ++o) if (r[o] === t) return o;
          return -1;
        };
      })(Object)),
    Array.isArray ||
      (Array.isArray = function (e) {
        return "[object Array]" === Object.prototype.toString.call(e);
      }),
    document.getElementsByClassName ||
      (window.Element.prototype.getElementsByClassName =
        document.constructor.prototype.getElementsByClassName =
          function (e) {
            if (document.querySelectorAll)
              return document.querySelectorAll("." + e);
            for (
              var t = document.getElementsByTagName("*"),
                n = new RegExp("(^|\\s)" + e + "(\\s|$)"),
                r = [],
                i = 0;
              i < t.length;
              i++
            )
              n.test(t[i].className) && r.push(t[i]);
            return r;
          }),
    String.prototype.startsWith ||
      (String.prototype.startsWith = function (e, t) {
        return this.substr(!t || t < 0 ? 0 : +t, e.length) === e;
      }),
    String.prototype.endsWith ||
      (String.prototype.endsWith = function (e, t) {
        return (
          (t === undefined || t > this.length) && (t = this.length),
          this.substring(t - e.length, t) === e
        );
      });
  try {
    if (
      Object.defineProperty &&
      Object.getOwnPropertyDescriptor &&
      Object.getOwnPropertyDescriptor(Element.prototype, "textContent") &&
      !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get
    ) {
      var O = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
      Object.defineProperty(Element.prototype, "textContent", {
        get: function () {
          return O.get.call(this);
        },
        set: function (e) {
          O.set.call(this, e);
        },
      });
    }
  } catch (tr) {}
  Function.prototype.bind ||
    (Function.prototype.bind = function (e) {
      if ("function" != typeof this)
        throw new TypeError("Function.prototype.bind: Item Can Not Be Bound.");
      var t = Array.prototype.slice.call(arguments, 1),
        n = this,
        r = function () {},
        i = function () {
          return n.apply(
            this instanceof r ? this : e,
            t.concat(Array.prototype.slice.call(arguments))
          );
        };
      return (
        this.prototype && (r.prototype = this.prototype),
        (i.prototype = new r()),
        i
      );
    }),
    "function" != typeof Object.create &&
      (Object.create = function (e, t) {
        function n() {}
        if (((n.prototype = e), "object" == typeof t))
          for (var r in t) t.hasOwnProperty(r) && (n[r] = t[r]);
        return new n();
      }),
    Date.now ||
      (Date.now = function () {
        return new Date().getTime();
      }),
    window.console || (window.console = {});
  for (
    var C,
      M,
      P,
      A,
      j = ["error", "info", "log", "show", "table", "trace", "warn"],
      D = function (e) {},
      G = j.length;
    --G > -1;

  )
    (E = j[G]), window.console[E] || (window.console[E] = D);
  if (window.atob)
    try {
      window.atob(" ");
    } catch (nr) {
      window.atob = (function (e) {
        var t = function (t) {
          return e(String(t).replace(/[\t\n\f\r ]+/g, ""));
        };
        return (t.original = e), t;
      })(window.atob);
    }
  else {
    var H = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      F =
        /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
    window.atob = function (e) {
      if (((e = String(e).replace(/[\t\n\f\r ]+/g, "")), !F.test(e)))
        throw new TypeError(
          "Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded."
        );
      var t, n, r;
      e += "==".slice(2 - (3 & e.length));
      for (var i = "", o = 0; o < e.length; )
        (t =
          (H.indexOf(e.charAt(o++)) << 18) |
          (H.indexOf(e.charAt(o++)) << 12) |
          ((n = H.indexOf(e.charAt(o++))) << 6) |
          (r = H.indexOf(e.charAt(o++)))),
          (i +=
            64 === n
              ? String.fromCharCode((t >> 16) & 255)
              : 64 === r
              ? String.fromCharCode((t >> 16) & 255, (t >> 8) & 255)
              : String.fromCharCode((t >> 16) & 255, (t >> 8) & 255, 255 & t));
      return i;
    };
  }
  if (
    (Event.prototype.preventDefault ||
      (Event.prototype.preventDefault = function () {
        this.returnValue = !1;
      }),
    Event.prototype.stopPropagation ||
      (Event.prototype.stopPropagation = function () {
        this.cancelBubble = !0;
      }),
    window.Prototype && Array.prototype.toJSON)
  ) {
    console.error(
      "[hCaptcha] Custom JSON polyfill detected, please remove to ensure hCaptcha works properly"
    );
    var N = Array.prototype.toJSON,
      B = JSON.stringify;
    JSON.stringify = function (e) {
      try {
        return delete Array.prototype.toJSON, B(e);
      } finally {
        Array.prototype.toJSON = N;
      }
    };
  }
  if (
    (Object.keys ||
      (Object.keys =
        ((C = Object.prototype.hasOwnProperty),
        (M = !Object.prototype.propertyIsEnumerable.call(
          { toString: null },
          "toString"
        )),
        (A = (P = [
          "toString",
          "toLocaleString",
          "valueOf",
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "constructor",
        ]).length),
        function (e) {
          if ("function" != typeof e && ("object" != typeof e || null === e))
            throw new TypeError("Object.keys called on non-object");
          var t,
            n,
            r = [];
          for (t in e) C.call(e, t) && r.push(t);
          if (M) for (n = 0; n < A; n++) C.call(e, P[n]) && r.push(P[n]);
          return r;
        })),
    !Uint8Array.prototype.slice)
  )
    try {
      Object.defineProperty(Uint8Array.prototype, "slice", {
        value: function (e, t) {
          return new Uint8Array(Array.prototype.slice.call(this, e, t));
        },
        writable: !0,
      });
    } catch (nr) {
      if ("function" != typeof Uint8Array.prototype.slice)
        try {
          Uint8Array.prototype.slice = function (e, t) {
            return new Uint8Array(Array.prototype.slice.call(this, e, t));
          };
        } catch (rr) {}
    }
  /*! Raven.js 3.27.2 (6d91db933) | github.com/getsentry/raven-js */ !(function (
    e
  ) {
    if ("object" == typeof exports && "undefined" != typeof module)
      module.exports = e();
    else if ("function" == typeof define && define.amd) define("raven-js", e);
    else {
      ("undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : this
      ).Raven = e();
    }
  })(function () {
    return (function e(t, n, r) {
      function i(a, s) {
        if (!n[a]) {
          if (!t[a]) {
            var c = "function" == typeof require && require;
            if (!s && c) return c(a, !0);
            if (o) return o(a, !0);
            var l = new Error("Cannot find module '" + a + "'");
            throw ((l.code = "MODULE_NOT_FOUND"), l);
          }
          var u = (n[a] = { exports: {} });
          t[a][0].call(
            u.exports,
            function (e) {
              var n = t[a][1][e];
              return i(n || e);
            },
            u,
            u.exports,
            e,
            t,
            n,
            r
          );
        }
        return n[a].exports;
      }
      for (
        var o = "function" == typeof require && require, a = 0;
        a < r.length;
        a++
      )
        i(r[a]);
      return i;
    })(
      {
        1: [
          function (e, t, n) {
            function r(e) {
              (this.name = "RavenConfigError"), (this.message = e);
            }
            (r.prototype = new Error()),
              (r.prototype.constructor = r),
              (t.exports = r);
          },
          {},
        ],
        2: [
          function (e, t, n) {
            var r = e(5);
            t.exports = {
              wrapMethod: function (e, t, n) {
                var i = e[t],
                  o = e;
                if (t in e) {
                  var a = "warn" === t ? "warning" : t;
                  e[t] = function () {
                    var e = [].slice.call(arguments),
                      s = r.safeJoin(e, " "),
                      c = {
                        level: a,
                        logger: "console",
                        extra: { arguments: e },
                      };
                    "assert" === t
                      ? !1 === e[0] &&
                        ((s =
                          "Assertion failed: " +
                          (r.safeJoin(e.slice(1), " ") || "console.assert")),
                        (c.extra.arguments = e.slice(1)),
                        n && n(s, c))
                      : n && n(s, c),
                      i && Function.prototype.apply.call(i, o, e);
                  };
                }
              },
            };
          },
          { 5: 5 },
        ],
        3: [
          function (e, t, n) {
            (function (n) {
              function r() {
                return +new Date();
              }
              function i(e, t) {
                return v(t)
                  ? function (n) {
                      return t(n, e);
                    }
                  : t;
              }
              function o() {
                for (var e in ((this.a = !(
                  "object" != typeof JSON || !JSON.stringify
                )),
                (this.b = !y(I)),
                (this.c = !y(Z)),
                (this.d = null),
                (this.e = null),
                (this.f = null),
                (this.g = null),
                (this.h = null),
                (this.i = null),
                (this.j = {}),
                (this.k = {
                  release: Y.SENTRY_RELEASE && Y.SENTRY_RELEASE.id,
                  logger: "javascript",
                  ignoreErrors: [],
                  ignoreUrls: [],
                  whitelistUrls: [],
                  includePaths: [],
                  headers: null,
                  collectWindowErrors: !0,
                  captureUnhandledRejections: !0,
                  maxMessageLength: 0,
                  maxUrlLength: 250,
                  stackTraceLimit: 50,
                  autoBreadcrumbs: !0,
                  instrument: !0,
                  sampleRate: 1,
                  sanitizeKeys: [],
                }),
                (this.l = {
                  method: "POST",
                  referrerPolicy: j() ? "origin" : "",
                }),
                (this.m = 0),
                (this.n = !1),
                (this.o = Error.stackTraceLimit),
                (this.p = Y.console || {}),
                (this.q = {}),
                (this.r = []),
                (this.s = r()),
                (this.t = []),
                (this.u = []),
                (this.v = null),
                (this.w = Y.location),
                (this.x = this.w && this.w.href),
                this.y(),
                this.p))
                  this.q[e] = this.p[e];
              }
              var a = e(6),
                s = e(7),
                c = e(8),
                l = e(1),
                u = e(5),
                h = u.isErrorEvent,
                p = u.isDOMError,
                d = u.isDOMException,
                f = u.isError,
                m = u.isObject,
                g = u.isPlainObject,
                y = u.isUndefined,
                v = u.isFunction,
                b = u.isString,
                w = u.isArray,
                _ = u.isEmptyObject,
                S = u.each,
                E = u.objectMerge,
                k = u.truncate,
                U = u.objectFrozen,
                x = u.hasKey,
                V = u.joinRegExp,
                R = u.urlencode,
                W = u.uuid4,
                T = u.htmlTreeAsString,
                O = u.isSameException,
                C = u.isSameStacktrace,
                M = u.parseUrl,
                P = u.fill,
                A = u.supportsFetch,
                j = u.supportsReferrerPolicy,
                D = u.serializeKeysForMessage,
                G = u.serializeException,
                H = u.sanitize,
                F = e(2).wrapMethod,
                N = "source protocol user pass host port path".split(" "),
                B =
                  /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/,
                Y =
                  "undefined" != typeof window
                    ? window
                    : void 0 !== n
                    ? n
                    : "undefined" != typeof self
                    ? self
                    : {},
                I = Y.document,
                Z = Y.navigator;
              (o.prototype = {
                VERSION: "3.27.2",
                debug: !1,
                TraceKit: a,
                config: function (e, t) {
                  var n = this;
                  if (n.g)
                    return (
                      this.z(
                        "error",
                        "Error: Raven has already been configured"
                      ),
                      n
                    );
                  if (!e) return n;
                  var r = n.k;
                  t &&
                    S(t, function (e, t) {
                      "tags" === e || "extra" === e || "user" === e
                        ? (n.j[e] = t)
                        : (r[e] = t);
                    }),
                    n.setDSN(e),
                    r.ignoreErrors.push(/^Script error\.?$/),
                    r.ignoreErrors.push(
                      /^Javascript error: Script error\.? on line 0$/
                    ),
                    (r.ignoreErrors = V(r.ignoreErrors)),
                    (r.ignoreUrls = !!r.ignoreUrls.length && V(r.ignoreUrls)),
                    (r.whitelistUrls =
                      !!r.whitelistUrls.length && V(r.whitelistUrls)),
                    (r.includePaths = V(r.includePaths)),
                    (r.maxBreadcrumbs = Math.max(
                      0,
                      Math.min(r.maxBreadcrumbs || 100, 100)
                    ));
                  var i = {
                      xhr: !0,
                      console: !0,
                      dom: !0,
                      location: !0,
                      sentry: !0,
                    },
                    o = r.autoBreadcrumbs;
                  "[object Object]" === {}.toString.call(o)
                    ? (o = E(i, o))
                    : !1 !== o && (o = i),
                    (r.autoBreadcrumbs = o);
                  var s = { tryCatch: !0 },
                    c = r.instrument;
                  return (
                    "[object Object]" === {}.toString.call(c)
                      ? (c = E(s, c))
                      : !1 !== c && (c = s),
                    (r.instrument = c),
                    (a.collectWindowErrors = !!r.collectWindowErrors),
                    n
                  );
                },
                install: function () {
                  var e = this;
                  return (
                    e.isSetup() &&
                      !e.n &&
                      (a.report.subscribe(function () {
                        e.A.apply(e, arguments);
                      }),
                      e.k.captureUnhandledRejections && e.B(),
                      e.C(),
                      e.k.instrument && e.k.instrument.tryCatch && e.D(),
                      e.k.autoBreadcrumbs && e.E(),
                      e.F(),
                      (e.n = !0)),
                    (Error.stackTraceLimit = e.k.stackTraceLimit),
                    this
                  );
                },
                setDSN: function (e) {
                  var t = this,
                    n = t.G(e),
                    r = n.path.lastIndexOf("/"),
                    i = n.path.substr(1, r);
                  (t.H = e),
                    (t.h = n.user),
                    (t.I = n.pass && n.pass.substr(1)),
                    (t.i = n.path.substr(r + 1)),
                    (t.g = t.J(n)),
                    (t.K = t.g + "/" + i + "api/" + t.i + "/store/"),
                    this.y();
                },
                context: function (e, t, n) {
                  return (
                    v(e) && ((n = t || []), (t = e), (e = {})),
                    this.wrap(e, t).apply(this, n)
                  );
                },
                wrap: function (e, t, n) {
                  function r() {
                    var r = [],
                      o = arguments.length,
                      a = !e || (e && !1 !== e.deep);
                    for (n && v(n) && n.apply(this, arguments); o--; )
                      r[o] = a ? i.wrap(e, arguments[o]) : arguments[o];
                    try {
                      return t.apply(this, r);
                    } catch (s) {
                      throw (i.L(), i.captureException(s, e), s);
                    }
                  }
                  var i = this;
                  if (y(t) && !v(e)) return e;
                  if ((v(e) && ((t = e), (e = void 0)), !v(t))) return t;
                  try {
                    if (t.M) return t;
                    if (t.N) return t.N;
                  } catch (o) {
                    return t;
                  }
                  for (var a in t) x(t, a) && (r[a] = t[a]);
                  return (
                    (r.prototype = t.prototype),
                    (t.N = r),
                    (r.M = !0),
                    (r.O = t),
                    r
                  );
                },
                uninstall: function () {
                  return (
                    a.report.uninstall(),
                    this.P(),
                    this.Q(),
                    this.R(),
                    this.S(),
                    (Error.stackTraceLimit = this.o),
                    (this.n = !1),
                    this
                  );
                },
                T: function (e) {
                  this.z(
                    "debug",
                    "Raven caught unhandled promise rejection:",
                    e
                  ),
                    this.captureException(e.reason, {
                      mechanism: { type: "onunhandledrejection", handled: !1 },
                    });
                },
                B: function () {
                  return (
                    (this.T = this.T.bind(this)),
                    Y.addEventListener &&
                      Y.addEventListener("unhandledrejection", this.T),
                    this
                  );
                },
                P: function () {
                  return (
                    Y.removeEventListener &&
                      Y.removeEventListener("unhandledrejection", this.T),
                    this
                  );
                },
                captureException: function (e, t) {
                  if (
                    ((t = E({ trimHeadFrames: 0 }, t || {})), h(e) && e.error)
                  )
                    e = e.error;
                  else {
                    if (p(e) || d(e)) {
                      var n = e.name || (p(e) ? "DOMError" : "DOMException"),
                        r = e.message ? n + ": " + e.message : n;
                      return this.captureMessage(
                        r,
                        E(t, {
                          stacktrace: !0,
                          trimHeadFrames: t.trimHeadFrames + 1,
                        })
                      );
                    }
                    if (f(e)) e = e;
                    else {
                      if (!g(e))
                        return this.captureMessage(
                          e,
                          E(t, {
                            stacktrace: !0,
                            trimHeadFrames: t.trimHeadFrames + 1,
                          })
                        );
                      (t = this.U(t, e)), (e = new Error(t.message));
                    }
                  }
                  this.d = e;
                  try {
                    var i = a.computeStackTrace(e);
                    this.V(i, t);
                  } catch (o) {
                    if (e !== o) throw o;
                  }
                  return this;
                },
                U: function (e, t) {
                  var n = Object.keys(t).sort(),
                    r = E(e, {
                      message:
                        "Non-Error exception captured with keys: " + D(n),
                      fingerprint: [c(n)],
                      extra: e.extra || {},
                    });
                  return (r.extra.W = G(t)), r;
                },
                captureMessage: function (e, t) {
                  if (
                    !this.k.ignoreErrors.test ||
                    !this.k.ignoreErrors.test(e)
                  ) {
                    var n,
                      r = E({ message: (e += "") }, (t = t || {}));
                    try {
                      throw new Error(e);
                    } catch (i) {
                      n = i;
                    }
                    n.name = null;
                    var o = a.computeStackTrace(n),
                      s = w(o.stack) && o.stack[1];
                    s &&
                      "Raven.captureException" === s.func &&
                      (s = o.stack[2]);
                    var c = (s && s.url) || "";
                    if (
                      (!this.k.ignoreUrls.test || !this.k.ignoreUrls.test(c)) &&
                      (!this.k.whitelistUrls.test ||
                        this.k.whitelistUrls.test(c))
                    ) {
                      if (
                        this.k.stacktrace ||
                        t.stacktrace ||
                        "" === r.message
                      ) {
                        (r.fingerprint =
                          null == r.fingerprint ? e : r.fingerprint),
                          ((t = E(
                            { trimHeadFrames: 0 },
                            t
                          )).trimHeadFrames += 1);
                        var l = this.X(o, t);
                        r.stacktrace = { frames: l.reverse() };
                      }
                      return (
                        r.fingerprint &&
                          (r.fingerprint = w(r.fingerprint)
                            ? r.fingerprint
                            : [r.fingerprint]),
                        this.Y(r),
                        this
                      );
                    }
                  }
                },
                captureBreadcrumb: function (e) {
                  var t = E({ timestamp: r() / 1e3 }, e);
                  if (v(this.k.breadcrumbCallback)) {
                    var n = this.k.breadcrumbCallback(t);
                    if (m(n) && !_(n)) t = n;
                    else if (!1 === n) return this;
                  }
                  return (
                    this.u.push(t),
                    this.u.length > this.k.maxBreadcrumbs && this.u.shift(),
                    this
                  );
                },
                addPlugin: function (e) {
                  var t = [].slice.call(arguments, 1);
                  return this.r.push([e, t]), this.n && this.F(), this;
                },
                setUserContext: function (e) {
                  return (this.j.user = e), this;
                },
                setExtraContext: function (e) {
                  return this.Z("extra", e), this;
                },
                setTagsContext: function (e) {
                  return this.Z("tags", e), this;
                },
                clearContext: function () {
                  return (this.j = {}), this;
                },
                getContext: function () {
                  return JSON.parse(s(this.j));
                },
                setEnvironment: function (e) {
                  return (this.k.environment = e), this;
                },
                setRelease: function (e) {
                  return (this.k.release = e), this;
                },
                setDataCallback: function (e) {
                  var t = this.k.dataCallback;
                  return (this.k.dataCallback = i(t, e)), this;
                },
                setBreadcrumbCallback: function (e) {
                  var t = this.k.breadcrumbCallback;
                  return (this.k.breadcrumbCallback = i(t, e)), this;
                },
                setShouldSendCallback: function (e) {
                  var t = this.k.shouldSendCallback;
                  return (this.k.shouldSendCallback = i(t, e)), this;
                },
                setTransport: function (e) {
                  return (this.k.transport = e), this;
                },
                lastException: function () {
                  return this.d;
                },
                lastEventId: function () {
                  return this.f;
                },
                isSetup: function () {
                  return !(
                    !this.a ||
                    (!this.g &&
                      (this.ravenNotConfiguredError ||
                        ((this.ravenNotConfiguredError = !0),
                        this.z(
                          "error",
                          "Error: Raven has not been configured."
                        )),
                      1))
                  );
                },
                afterLoad: function () {
                  var e = Y.RavenConfig;
                  e && this.config(e.dsn, e.config).install();
                },
                showReportDialog: function (e) {
                  if (I) {
                    if (
                      !(e = E(
                        {
                          eventId: this.lastEventId(),
                          dsn: this.H,
                          user: this.j.user || {},
                        },
                        e
                      )).eventId
                    )
                      throw new l("Missing eventId");
                    if (!e.dsn) throw new l("Missing DSN");
                    var t = encodeURIComponent,
                      n = [];
                    for (var r in e)
                      if ("user" === r) {
                        var i = e.user;
                        i.name && n.push("name=" + t(i.name)),
                          i.email && n.push("email=" + t(i.email));
                      } else n.push(t(r) + "=" + t(e[r]));
                    var o = this.J(this.G(e.dsn)),
                      a = I.createElement("script");
                    (a.async = !0),
                      (a.src = o + "/api/embed/error-page/?" + n.join("&")),
                      (I.head || I.body).appendChild(a);
                  }
                },
                L: function () {
                  var e = this;
                  (this.m += 1),
                    setTimeout(function () {
                      e.m -= 1;
                    });
                },
                $: function (e, t) {
                  var n, r;
                  if (this.b) {
                    for (r in ((t = t || {}),
                    (e = "raven" + e.substr(0, 1).toUpperCase() + e.substr(1)),
                    I.createEvent
                      ? (n = I.createEvent("HTMLEvents")).initEvent(e, !0, !0)
                      : ((n = I.createEventObject()).eventType = e),
                    t))
                      x(t, r) && (n[r] = t[r]);
                    if (I.createEvent) I.dispatchEvent(n);
                    else
                      try {
                        I.fireEvent("on" + n.eventType.toLowerCase(), n);
                      } catch (i) {}
                  }
                },
                _: function (e) {
                  var t = this;
                  return function (n) {
                    if (((t.aa = null), t.v !== n)) {
                      var r;
                      t.v = n;
                      try {
                        r = T(n.target);
                      } catch (i) {
                        r = "<unknown>";
                      }
                      t.captureBreadcrumb({ category: "ui." + e, message: r });
                    }
                  };
                },
                ba: function () {
                  var e = this;
                  return function (t) {
                    var n;
                    try {
                      n = t.target;
                    } catch (i) {
                      return;
                    }
                    var r = n && n.tagName;
                    if (
                      r &&
                      ("INPUT" === r || "TEXTAREA" === r || n.isContentEditable)
                    ) {
                      var o = e.aa;
                      o || e._("input")(t),
                        clearTimeout(o),
                        (e.aa = setTimeout(function () {
                          e.aa = null;
                        }, 1e3));
                    }
                  };
                },
                ca: function (e, t) {
                  var n = M(this.w.href),
                    r = M(t),
                    i = M(e);
                  (this.x = t),
                    n.protocol === r.protocol &&
                      n.host === r.host &&
                      (t = r.relative),
                    n.protocol === i.protocol &&
                      n.host === i.host &&
                      (e = i.relative),
                    this.captureBreadcrumb({
                      category: "navigation",
                      data: { to: t, from: e },
                    });
                },
                C: function () {
                  var e = this;
                  (e.da = Function.prototype.toString),
                    (Function.prototype.toString = function () {
                      return "function" == typeof this && this.M
                        ? e.da.apply(this.O, arguments)
                        : e.da.apply(this, arguments);
                    });
                },
                Q: function () {
                  this.da && (Function.prototype.toString = this.da);
                },
                D: function () {
                  function e(e) {
                    return function (t, r) {
                      for (
                        var i = new Array(arguments.length), o = 0;
                        o < i.length;
                        ++o
                      )
                        i[o] = arguments[o];
                      var a = i[0];
                      return (
                        v(a) &&
                          (i[0] = n.wrap(
                            {
                              mechanism: {
                                type: "instrument",
                                data: { function: e.name || "<anonymous>" },
                              },
                            },
                            a
                          )),
                        e.apply ? e.apply(this, i) : e(i[0], i[1])
                      );
                    };
                  }
                  function t(e) {
                    var t = Y[e] && Y[e].prototype;
                    t &&
                      t.hasOwnProperty &&
                      t.hasOwnProperty("addEventListener") &&
                      (P(
                        t,
                        "addEventListener",
                        function (t) {
                          return function (r, o, a, s) {
                            try {
                              o &&
                                o.handleEvent &&
                                (o.handleEvent = n.wrap(
                                  {
                                    mechanism: {
                                      type: "instrument",
                                      data: {
                                        target: e,
                                        function: "handleEvent",
                                        handler: (o && o.name) || "<anonymous>",
                                      },
                                    },
                                  },
                                  o.handleEvent
                                ));
                            } catch (c) {}
                            var l, u, h;
                            return (
                              i &&
                                i.dom &&
                                ("EventTarget" === e || "Node" === e) &&
                                ((u = n._("click")),
                                (h = n.ba()),
                                (l = function (e) {
                                  if (e) {
                                    var t;
                                    try {
                                      t = e.type;
                                    } catch (n) {
                                      return;
                                    }
                                    return "click" === t
                                      ? u(e)
                                      : "keypress" === t
                                      ? h(e)
                                      : void 0;
                                  }
                                })),
                              t.call(
                                this,
                                r,
                                n.wrap(
                                  {
                                    mechanism: {
                                      type: "instrument",
                                      data: {
                                        target: e,
                                        function: "addEventListener",
                                        handler: (o && o.name) || "<anonymous>",
                                      },
                                    },
                                  },
                                  o,
                                  l
                                ),
                                a,
                                s
                              )
                            );
                          };
                        },
                        r
                      ),
                      P(
                        t,
                        "removeEventListener",
                        function (e) {
                          return function (t, n, r, i) {
                            try {
                              n = n && (n.N ? n.N : n);
                            } catch (o) {}
                            return e.call(this, t, n, r, i);
                          };
                        },
                        r
                      ));
                  }
                  var n = this,
                    r = n.t,
                    i = this.k.autoBreadcrumbs;
                  P(Y, "setTimeout", e, r),
                    P(Y, "setInterval", e, r),
                    Y.requestAnimationFrame &&
                      P(
                        Y,
                        "requestAnimationFrame",
                        function (e) {
                          return function (t) {
                            return e(
                              n.wrap(
                                {
                                  mechanism: {
                                    type: "instrument",
                                    data: {
                                      function: "requestAnimationFrame",
                                      handler: (e && e.name) || "<anonymous>",
                                    },
                                  },
                                },
                                t
                              )
                            );
                          };
                        },
                        r
                      );
                  for (
                    var o = [
                        "EventTarget",
                        "Window",
                        "Node",
                        "ApplicationCache",
                        "AudioTrackList",
                        "ChannelMergerNode",
                        "CryptoOperation",
                        "EventSource",
                        "FileReader",
                        "HTMLUnknownElement",
                        "IDBDatabase",
                        "IDBRequest",
                        "IDBTransaction",
                        "KeyOperation",
                        "MediaController",
                        "MessagePort",
                        "ModalWindow",
                        "Notification",
                        "SVGElementInstance",
                        "Screen",
                        "TextTrack",
                        "TextTrackCue",
                        "TextTrackList",
                        "WebSocket",
                        "WebSocketWorker",
                        "Worker",
                        "XMLHttpRequest",
                        "XMLHttpRequestEventTarget",
                        "XMLHttpRequestUpload",
                      ],
                      a = 0;
                    a < o.length;
                    a++
                  )
                    t(o[a]);
                },
                E: function () {
                  function e(e, n) {
                    e in n &&
                      v(n[e]) &&
                      P(n, e, function (n) {
                        return t.wrap(
                          {
                            mechanism: {
                              type: "instrument",
                              data: {
                                function: e,
                                handler: (n && n.name) || "<anonymous>",
                              },
                            },
                          },
                          n
                        );
                      });
                  }
                  var t = this,
                    n = this.k.autoBreadcrumbs,
                    r = t.t;
                  if (n.xhr && "XMLHttpRequest" in Y) {
                    var i = Y.XMLHttpRequest && Y.XMLHttpRequest.prototype;
                    P(
                      i,
                      "open",
                      function (e) {
                        return function (n, r) {
                          return (
                            b(r) &&
                              -1 === r.indexOf(t.h) &&
                              (this.ea = {
                                method: n,
                                url: r,
                                status_code: null,
                              }),
                            e.apply(this, arguments)
                          );
                        };
                      },
                      r
                    ),
                      P(
                        i,
                        "send",
                        function (n) {
                          return function () {
                            function r() {
                              if (i.ea && 4 === i.readyState) {
                                try {
                                  i.ea.status_code = i.status;
                                } catch (e) {}
                                t.captureBreadcrumb({
                                  type: "http",
                                  category: "xhr",
                                  data: i.ea,
                                });
                              }
                            }
                            for (
                              var i = this,
                                o = ["onload", "onerror", "onprogress"],
                                a = 0;
                              a < o.length;
                              a++
                            )
                              e(o[a], i);
                            return (
                              "onreadystatechange" in i &&
                              v(i.onreadystatechange)
                                ? P(i, "onreadystatechange", function (e) {
                                    return t.wrap(
                                      {
                                        mechanism: {
                                          type: "instrument",
                                          data: {
                                            function: "onreadystatechange",
                                            handler:
                                              (e && e.name) || "<anonymous>",
                                          },
                                        },
                                      },
                                      e,
                                      r
                                    );
                                  })
                                : (i.onreadystatechange = r),
                              n.apply(this, arguments)
                            );
                          };
                        },
                        r
                      );
                  }
                  n.xhr &&
                    A() &&
                    P(
                      Y,
                      "fetch",
                      function (e) {
                        return function () {
                          for (
                            var n = new Array(arguments.length), r = 0;
                            r < n.length;
                            ++r
                          )
                            n[r] = arguments[r];
                          var i,
                            o = n[0],
                            a = "GET";
                          if (
                            ("string" == typeof o
                              ? (i = o)
                              : "Request" in Y && o instanceof Y.Request
                              ? ((i = o.url), o.method && (a = o.method))
                              : (i = "" + o),
                            -1 !== i.indexOf(t.h))
                          )
                            return e.apply(this, n);
                          n[1] && n[1].method && (a = n[1].method);
                          var s = { method: a, url: i, status_code: null };
                          return e
                            .apply(this, n)
                            .then(function (e) {
                              return (
                                (s.status_code = e.status),
                                t.captureBreadcrumb({
                                  type: "http",
                                  category: "fetch",
                                  data: s,
                                }),
                                e
                              );
                            })
                            ["catch"](function (e) {
                              throw (
                                (t.captureBreadcrumb({
                                  type: "http",
                                  category: "fetch",
                                  data: s,
                                  level: "error",
                                }),
                                e)
                              );
                            });
                        };
                      },
                      r
                    ),
                    n.dom &&
                      this.b &&
                      (I.addEventListener
                        ? (I.addEventListener("click", t._("click"), !1),
                          I.addEventListener("keypress", t.ba(), !1))
                        : I.attachEvent &&
                          (I.attachEvent("onclick", t._("click")),
                          I.attachEvent("onkeypress", t.ba())));
                  var o = Y.chrome,
                    a =
                      !(o && o.app && o.app.runtime) &&
                      Y.history &&
                      Y.history.pushState &&
                      Y.history.replaceState;
                  if (n.location && a) {
                    var s = Y.onpopstate;
                    Y.onpopstate = function () {
                      var e = t.w.href;
                      if ((t.ca(t.x, e), s)) return s.apply(this, arguments);
                    };
                    var c = function (e) {
                      return function () {
                        var n = arguments.length > 2 ? arguments[2] : void 0;
                        return n && t.ca(t.x, n + ""), e.apply(this, arguments);
                      };
                    };
                    P(Y.history, "pushState", c, r),
                      P(Y.history, "replaceState", c, r);
                  }
                  if (n.console && "console" in Y && console.log) {
                    var l = function (e, n) {
                      t.captureBreadcrumb({
                        message: e,
                        level: n.level,
                        category: "console",
                      });
                    };
                    S(
                      ["debug", "info", "warn", "error", "log"],
                      function (e, t) {
                        F(console, t, l);
                      }
                    );
                  }
                },
                R: function () {
                  for (var e; this.t.length; ) {
                    var t = (e = this.t.shift())[0],
                      n = e[1],
                      r = e[2];
                    t[n] = r;
                  }
                },
                S: function () {
                  for (var e in this.q) this.p[e] = this.q[e];
                },
                F: function () {
                  var e = this;
                  S(this.r, function (t, n) {
                    var r = n[0],
                      i = n[1];
                    r.apply(e, [e].concat(i));
                  });
                },
                G: function (e) {
                  var t = B.exec(e),
                    n = {},
                    r = 7;
                  try {
                    for (; r--; ) n[N[r]] = t[r] || "";
                  } catch (i) {
                    throw new l("Invalid DSN: " + e);
                  }
                  if (n.pass && !this.k.allowSecretKey)
                    throw new l(
                      "Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key"
                    );
                  return n;
                },
                J: function (e) {
                  var t = "//" + e.host + (e.port ? ":" + e.port : "");
                  return e.protocol && (t = e.protocol + ":" + t), t;
                },
                A: function (e, t) {
                  ((t = t || {}).mechanism = t.mechanism || {
                    type: "onerror",
                    handled: !1,
                  }),
                    this.m || this.V(e, t);
                },
                V: function (e, t) {
                  var n = this.X(e, t);
                  this.$("handle", { stackInfo: e, options: t }),
                    this.fa(e.name, e.message, e.url, e.lineno, n, t);
                },
                X: function (e, t) {
                  var n = this,
                    r = [];
                  if (
                    e.stack &&
                    e.stack.length &&
                    (S(e.stack, function (t, i) {
                      var o = n.ga(i, e.url);
                      o && r.push(o);
                    }),
                    t && t.trimHeadFrames)
                  )
                    for (var i = 0; i < t.trimHeadFrames && i < r.length; i++)
                      r[i].in_app = !1;
                  return (r = r.slice(0, this.k.stackTraceLimit));
                },
                ga: function (e, t) {
                  var n = {
                    filename: e.url,
                    lineno: e.line,
                    colno: e.column,
                    function: e.func || "?",
                  };
                  return (
                    e.url || (n.filename = t),
                    (n.in_app = !(
                      (this.k.includePaths.test &&
                        !this.k.includePaths.test(n.filename)) ||
                      /(Raven|TraceKit)\./.test(n["function"]) ||
                      /raven\.(min\.)?js$/.test(n.filename)
                    )),
                    n
                  );
                },
                fa: function (e, t, n, r, i, o) {
                  var a,
                    s = (e ? e + ": " : "") + (t || "");
                  if (
                    (!this.k.ignoreErrors.test ||
                      (!this.k.ignoreErrors.test(t) &&
                        !this.k.ignoreErrors.test(s))) &&
                    (i && i.length
                      ? ((n = i[0].filename || n),
                        i.reverse(),
                        (a = { frames: i }))
                      : n &&
                        (a = {
                          frames: [{ filename: n, lineno: r, in_app: !0 }],
                        }),
                    (!this.k.ignoreUrls.test || !this.k.ignoreUrls.test(n)) &&
                      (!this.k.whitelistUrls.test ||
                        this.k.whitelistUrls.test(n)))
                  ) {
                    var c = E(
                        {
                          exception: {
                            values: [{ type: e, value: t, stacktrace: a }],
                          },
                          transaction: n,
                        },
                        o
                      ),
                      l = c.exception.values[0];
                    null == l.type &&
                      "" === l.value &&
                      (l.value = "Unrecoverable error caught"),
                      !c.exception.mechanism &&
                        c.mechanism &&
                        ((c.exception.mechanism = c.mechanism),
                        delete c.mechanism),
                      (c.exception.mechanism = E(
                        { type: "generic", handled: !0 },
                        c.exception.mechanism || {}
                      )),
                      this.Y(c);
                  }
                },
                ha: function (e) {
                  var t = this.k.maxMessageLength;
                  if (
                    (e.message && (e.message = k(e.message, t)), e.exception)
                  ) {
                    var n = e.exception.values[0];
                    n.value = k(n.value, t);
                  }
                  var r = e.request;
                  return (
                    r &&
                      (r.url && (r.url = k(r.url, this.k.maxUrlLength)),
                      r.Referer &&
                        (r.Referer = k(r.Referer, this.k.maxUrlLength))),
                    e.breadcrumbs &&
                      e.breadcrumbs.values &&
                      this.ia(e.breadcrumbs),
                    e
                  );
                },
                ia: function (e) {
                  for (
                    var t, n, r, i = ["to", "from", "url"], o = 0;
                    o < e.values.length;
                    ++o
                  )
                    if (
                      (n = e.values[o]).hasOwnProperty("data") &&
                      m(n.data) &&
                      !U(n.data)
                    ) {
                      r = E({}, n.data);
                      for (var a = 0; a < i.length; ++a)
                        (t = i[a]),
                          r.hasOwnProperty(t) &&
                            r[t] &&
                            (r[t] = k(r[t], this.k.maxUrlLength));
                      e.values[o].data = r;
                    }
                },
                ja: function () {
                  if (this.c || this.b) {
                    var e = {};
                    return (
                      this.c &&
                        Z.userAgent &&
                        (e.headers = { "User-Agent": Z.userAgent }),
                      Y.location &&
                        Y.location.href &&
                        (e.url = Y.location.href),
                      this.b &&
                        I.referrer &&
                        (e.headers || (e.headers = {}),
                        (e.headers.Referer = I.referrer)),
                      e
                    );
                  }
                },
                y: function () {
                  (this.ka = 0), (this.la = null);
                },
                ma: function () {
                  return this.ka && r() - this.la < this.ka;
                },
                na: function (e) {
                  var t = this.e;
                  return (
                    !(
                      !t ||
                      e.message !== t.message ||
                      e.transaction !== t.transaction
                    ) &&
                    (e.stacktrace || t.stacktrace
                      ? C(e.stacktrace, t.stacktrace)
                      : e.exception || t.exception
                      ? O(e.exception, t.exception)
                      : (!e.fingerprint && !t.fingerprint) ||
                        (Boolean(e.fingerprint && t.fingerprint) &&
                          JSON.stringify(e.fingerprint) ===
                            JSON.stringify(t.fingerprint)))
                  );
                },
                oa: function (e) {
                  if (!this.ma()) {
                    var t = e.status;
                    if (400 === t || 401 === t || 429 === t) {
                      var n;
                      try {
                        (n = A()
                          ? e.headers.get("Retry-After")
                          : e.getResponseHeader("Retry-After")),
                          (n = 1e3 * parseInt(n, 10));
                      } catch (i) {}
                      (this.ka = n || 2 * this.ka || 1e3), (this.la = r());
                    }
                  }
                },
                Y: function (e) {
                  var t = this.k,
                    n = {
                      project: this.i,
                      logger: t.logger,
                      platform: "javascript",
                    },
                    i = this.ja();
                  if (
                    (i && (n.request = i),
                    e.trimHeadFrames && delete e.trimHeadFrames,
                    ((e = E(n, e)).tags = E(E({}, this.j.tags), e.tags)),
                    (e.extra = E(E({}, this.j.extra), e.extra)),
                    (e.extra["session:duration"] = r() - this.s),
                    this.u &&
                      this.u.length > 0 &&
                      (e.breadcrumbs = { values: [].slice.call(this.u, 0) }),
                    this.j.user && (e.user = this.j.user),
                    t.environment && (e.environment = t.environment),
                    t.release && (e.release = t.release),
                    t.serverName && (e.server_name = t.serverName),
                    (e = this.pa(e)),
                    Object.keys(e).forEach(function (t) {
                      (null == e[t] || "" === e[t] || _(e[t])) && delete e[t];
                    }),
                    v(t.dataCallback) && (e = t.dataCallback(e) || e),
                    e &&
                      !_(e) &&
                      (!v(t.shouldSendCallback) || t.shouldSendCallback(e)))
                  )
                    return this.ma()
                      ? void this.z(
                          "warn",
                          "Raven dropped error due to backoff: ",
                          e
                        )
                      : void ("number" == typeof t.sampleRate
                          ? Math.random() < t.sampleRate && this.qa(e)
                          : this.qa(e));
                },
                pa: function (e) {
                  return H(e, this.k.sanitizeKeys);
                },
                ra: function () {
                  return W();
                },
                qa: function (e, t) {
                  var n = this,
                    r = this.k;
                  if (this.isSetup()) {
                    if (
                      ((e = this.ha(e)), !this.k.allowDuplicates && this.na(e))
                    )
                      return void this.z(
                        "warn",
                        "Raven dropped repeat event: ",
                        e
                      );
                    (this.f = e.event_id || (e.event_id = this.ra())),
                      (this.e = e),
                      this.z("debug", "Raven about to send:", e);
                    var i = {
                      sentry_version: "7",
                      sentry_client: "raven-js/" + this.VERSION,
                      sentry_key: this.h,
                    };
                    this.I && (i.sentry_secret = this.I);
                    var o = e.exception && e.exception.values[0];
                    this.k.autoBreadcrumbs &&
                      this.k.autoBreadcrumbs.sentry &&
                      this.captureBreadcrumb({
                        category: "sentry",
                        message: o
                          ? (o.type ? o.type + ": " : "") + o.value
                          : e.message,
                        event_id: e.event_id,
                        level: e.level || "error",
                      });
                    var a = this.K;
                    (r.transport || this._makeRequest).call(this, {
                      url: a,
                      auth: i,
                      data: e,
                      options: r,
                      onSuccess: function () {
                        n.y(), n.$("success", { data: e, src: a }), t && t();
                      },
                      onError: function (r) {
                        n.z("error", "Raven transport failed to send: ", r),
                          r.request && n.oa(r.request),
                          n.$("failure", { data: e, src: a }),
                          (r =
                            r ||
                            new Error(
                              "Raven send failed (no additional details provided)"
                            )),
                          t && t(r);
                      },
                    });
                  }
                },
                _makeRequest: function (e) {
                  var t = e.url + "?" + R(e.auth),
                    n = null,
                    r = {};
                  if (
                    (e.options.headers && (n = this.sa(e.options.headers)),
                    e.options.fetchParameters &&
                      (r = this.sa(e.options.fetchParameters)),
                    A())
                  ) {
                    r.body = s(e.data);
                    var i = E({}, this.l),
                      o = E(i, r);
                    return (
                      n && (o.headers = n),
                      Y.fetch(t, o)
                        .then(function (t) {
                          if (t.ok) e.onSuccess && e.onSuccess();
                          else {
                            var n = new Error("Sentry error code: " + t.status);
                            (n.request = t), e.onError && e.onError(n);
                          }
                        })
                        ["catch"](function () {
                          e.onError &&
                            e.onError(
                              new Error(
                                "Sentry error code: network unavailable"
                              )
                            );
                        })
                    );
                  }
                  var a = Y.XMLHttpRequest && new Y.XMLHttpRequest();
                  a &&
                    ("withCredentials" in a ||
                      "undefined" != typeof XDomainRequest) &&
                    ("withCredentials" in a
                      ? (a.onreadystatechange = function () {
                          if (4 === a.readyState)
                            if (200 === a.status) e.onSuccess && e.onSuccess();
                            else if (e.onError) {
                              var t = new Error(
                                "Sentry error code: " + a.status
                              );
                              (t.request = a), e.onError(t);
                            }
                        })
                      : ((a = new XDomainRequest()),
                        (t = t.replace(/^https?:/, "")),
                        e.onSuccess && (a.onload = e.onSuccess),
                        e.onError &&
                          (a.onerror = function () {
                            var t = new Error(
                              "Sentry error code: XDomainRequest"
                            );
                            (t.request = a), e.onError(t);
                          })),
                    a.open("POST", t),
                    n &&
                      S(n, function (e, t) {
                        a.setRequestHeader(e, t);
                      }),
                    a.send(s(e.data)));
                },
                sa: function (e) {
                  var t = {};
                  for (var n in e)
                    if (e.hasOwnProperty(n)) {
                      var r = e[n];
                      t[n] = "function" == typeof r ? r() : r;
                    }
                  return t;
                },
                z: function (e) {
                  this.q[e] &&
                    (this.debug || this.k.debug) &&
                    Function.prototype.apply.call(
                      this.q[e],
                      this.p,
                      [].slice.call(arguments, 1)
                    );
                },
                Z: function (e, t) {
                  y(t) ? delete this.j[e] : (this.j[e] = E(this.j[e] || {}, t));
                },
              }),
                (o.prototype.setUser = o.prototype.setUserContext),
                (o.prototype.setReleaseContext = o.prototype.setRelease),
                (t.exports = o);
            }).call(
              this,
              "undefined" != typeof global
                ? global
                : "undefined" != typeof self
                ? self
                : "undefined" != typeof window
                ? window
                : {}
            );
          },
          { 1: 1, 2: 2, 5: 5, 6: 6, 7: 7, 8: 8 },
        ],
        4: [
          function (e, t, n) {
            (function (n) {
              var r = e(3),
                i =
                  "undefined" != typeof window
                    ? window
                    : void 0 !== n
                    ? n
                    : "undefined" != typeof self
                    ? self
                    : {},
                o = i.Raven,
                a = new r();
              (a.noConflict = function () {
                return (i.Raven = o), a;
              }),
                a.afterLoad(),
                (t.exports = a),
                (t.exports.Client = r);
            }).call(
              this,
              "undefined" != typeof global
                ? global
                : "undefined" != typeof self
                ? self
                : "undefined" != typeof window
                ? window
                : {}
            );
          },
          { 3: 3 },
        ],
        5: [
          function (e, t, n) {
            (function (n) {
              function r(e) {
                switch (Object.prototype.toString.call(e)) {
                  case "[object Error]":
                  case "[object Exception]":
                  case "[object DOMException]":
                    return !0;
                  default:
                    return e instanceof Error;
                }
              }
              function i(e) {
                return (
                  "[object DOMError]" === Object.prototype.toString.call(e)
                );
              }
              function o(e) {
                return void 0 === e;
              }
              function a(e) {
                return "[object Object]" === Object.prototype.toString.call(e);
              }
              function s(e) {
                return "[object String]" === Object.prototype.toString.call(e);
              }
              function c(e) {
                return "[object Array]" === Object.prototype.toString.call(e);
              }
              function l() {
                if (!("fetch" in _)) return !1;
                try {
                  return new Headers(), new Request(""), new Response(), !0;
                } catch (e) {
                  return !1;
                }
              }
              function u(e, t) {
                var n, r;
                if (o(e.length)) for (n in e) p(e, n) && t.call(null, n, e[n]);
                else if ((r = e.length))
                  for (n = 0; n < r; n++) t.call(null, n, e[n]);
              }
              function h(e, t) {
                if ("number" != typeof t)
                  throw new Error(
                    "2nd argument to `truncate` function should be a number"
                  );
                return "string" != typeof e || 0 === t || e.length <= t
                  ? e
                  : e.substr(0, t) + "â€¦";
              }
              function p(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t);
              }
              function d(e) {
                for (var t, n = [], r = 0, i = e.length; r < i; r++)
                  s((t = e[r]))
                    ? n.push(t.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"))
                    : t && t.source && n.push(t.source);
                return new RegExp(n.join("|"), "i");
              }
              function f(e) {
                var t,
                  n,
                  r,
                  i,
                  o,
                  a = [];
                if (!e || !e.tagName) return "";
                if (
                  (a.push(e.tagName.toLowerCase()),
                  e.id && a.push("#" + e.id),
                  (t = e.className) && s(t))
                )
                  for (n = t.split(/\s+/), o = 0; o < n.length; o++)
                    a.push("." + n[o]);
                var c = ["type", "name", "title", "alt"];
                for (o = 0; o < c.length; o++)
                  (r = c[o]),
                    (i = e.getAttribute(r)) &&
                      a.push("[" + r + '="' + i + '"]');
                return a.join("");
              }
              function m(e, t) {
                return !!(!!e ^ !!t);
              }
              function g(e, t) {
                if (m(e, t)) return !1;
                var n = e.frames,
                  r = t.frames;
                if (void 0 === n || void 0 === r) return !1;
                if (n.length !== r.length) return !1;
                for (var i, o, a = 0; a < n.length; a++)
                  if (
                    ((i = n[a]),
                    (o = r[a]),
                    i.filename !== o.filename ||
                      i.lineno !== o.lineno ||
                      i.colno !== o.colno ||
                      i["function"] !== o["function"])
                  )
                    return !1;
                return !0;
              }
              function y(e) {
                return (function (e) {
                  return ~-encodeURI(e).split(/%..|./).length;
                })(JSON.stringify(e));
              }
              function v(e) {
                if ("string" == typeof e) {
                  return h(e, 40);
                }
                if (
                  "number" == typeof e ||
                  "boolean" == typeof e ||
                  void 0 === e
                )
                  return e;
                var t = Object.prototype.toString.call(e);
                return "[object Object]" === t
                  ? "[Object]"
                  : "[object Array]" === t
                  ? "[Array]"
                  : "[object Function]" === t
                  ? e.name
                    ? "[Function: " + e.name + "]"
                    : "[Function]"
                  : e;
              }
              function b(e, t) {
                return 0 === t
                  ? v(e)
                  : a(e)
                  ? Object.keys(e).reduce(function (n, r) {
                      return (n[r] = b(e[r], t - 1)), n;
                    }, {})
                  : Array.isArray(e)
                  ? e.map(function (e) {
                      return b(e, t - 1);
                    })
                  : v(e);
              }
              var w = e(7),
                _ =
                  "undefined" != typeof window
                    ? window
                    : void 0 !== n
                    ? n
                    : "undefined" != typeof self
                    ? self
                    : {},
                S = 3,
                E = 51200,
                k = 40;
              t.exports = {
                isObject: function (e) {
                  return "object" == typeof e && null !== e;
                },
                isError: r,
                isErrorEvent: function (e) {
                  return (
                    "[object ErrorEvent]" === Object.prototype.toString.call(e)
                  );
                },
                isDOMError: i,
                isDOMException: function (e) {
                  return (
                    "[object DOMException]" ===
                    Object.prototype.toString.call(e)
                  );
                },
                isUndefined: o,
                isFunction: function (e) {
                  return "function" == typeof e;
                },
                isPlainObject: a,
                isString: s,
                isArray: c,
                isEmptyObject: function (e) {
                  if (!a(e)) return !1;
                  for (var t in e) if (e.hasOwnProperty(t)) return !1;
                  return !0;
                },
                supportsErrorEvent: function () {
                  try {
                    return new ErrorEvent(""), !0;
                  } catch (e) {
                    return !1;
                  }
                },
                supportsDOMError: function () {
                  try {
                    return new DOMError(""), !0;
                  } catch (e) {
                    return !1;
                  }
                },
                supportsDOMException: function () {
                  try {
                    return new DOMException(""), !0;
                  } catch (e) {
                    return !1;
                  }
                },
                supportsFetch: l,
                supportsReferrerPolicy: function () {
                  if (!l()) return !1;
                  try {
                    return (
                      new Request("pickleRick", { referrerPolicy: "origin" }),
                      !0
                    );
                  } catch (e) {
                    return !1;
                  }
                },
                supportsPromiseRejectionEvent: function () {
                  return "function" == typeof PromiseRejectionEvent;
                },
                wrappedCallback: function (e) {
                  return function (t, n) {
                    var r = e(t) || t;
                    return (n && n(r)) || r;
                  };
                },
                each: u,
                objectMerge: function (e, t) {
                  return t
                    ? (u(t, function (t, n) {
                        e[t] = n;
                      }),
                      e)
                    : e;
                },
                truncate: h,
                objectFrozen: function (e) {
                  return !!Object.isFrozen && Object.isFrozen(e);
                },
                hasKey: p,
                joinRegExp: d,
                urlencode: function (e) {
                  var t = [];
                  return (
                    u(e, function (e, n) {
                      t.push(
                        encodeURIComponent(e) + "=" + encodeURIComponent(n)
                      );
                    }),
                    t.join("&")
                  );
                },
                uuid4: function () {
                  var e = _.crypto || _.msCrypto;
                  if (!o(e) && e.getRandomValues) {
                    var t = new Uint16Array(8);
                    e.getRandomValues(t),
                      (t[3] = (4095 & t[3]) | 16384),
                      (t[4] = (16383 & t[4]) | 32768);
                    var n = function (e) {
                      for (var t = e.toString(16); t.length < 4; ) t = "0" + t;
                      return t;
                    };
                    return (
                      n(t[0]) +
                      n(t[1]) +
                      n(t[2]) +
                      n(t[3]) +
                      n(t[4]) +
                      n(t[5]) +
                      n(t[6]) +
                      n(t[7])
                    );
                  }
                  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(
                    /[xy]/g,
                    function (e) {
                      var t = (16 * Math.random()) | 0;
                      return ("x" === e ? t : (3 & t) | 8).toString(16);
                    }
                  );
                },
                htmlTreeAsString: function (e) {
                  for (
                    var t, n = [], r = 0, i = 0, o = " > ".length;
                    e &&
                    r++ < 5 &&
                    !(
                      "html" === (t = f(e)) ||
                      (r > 1 && i + n.length * o + t.length >= 80)
                    );

                  )
                    n.push(t), (i += t.length), (e = e.parentNode);
                  return n.reverse().join(" > ");
                },
                htmlElementAsString: f,
                isSameException: function (e, t) {
                  return (
                    !m(e, t) &&
                    ((e = e.values[0]),
                    (t = t.values[0]),
                    e.type === t.type &&
                      e.value === t.value &&
                      !(function (e, t) {
                        return o(e) && o(t);
                      })(e.stacktrace, t.stacktrace) &&
                      g(e.stacktrace, t.stacktrace))
                  );
                },
                isSameStacktrace: g,
                parseUrl: function (e) {
                  if ("string" != typeof e) return {};
                  var t = e.match(
                      /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/
                    ),
                    n = t[6] || "",
                    r = t[8] || "";
                  return {
                    protocol: t[2],
                    host: t[4],
                    path: t[5],
                    relative: t[5] + n + r,
                  };
                },
                fill: function (e, t, n, r) {
                  if (null != e) {
                    var i = e[t];
                    (e[t] = n(i)),
                      (e[t].M = !0),
                      (e[t].O = i),
                      r && r.push([e, t, i]);
                  }
                },
                safeJoin: function (e, t) {
                  if (!c(e)) return "";
                  for (var n = [], i = 0; i < e.length; i++)
                    try {
                      n.push(String(e[i]));
                    } catch (r) {
                      n.push("[value cannot be serialized]");
                    }
                  return n.join(t);
                },
                serializeException: function U(e, t, n) {
                  if (!a(e)) return e;
                  n =
                    "number" != typeof (t = "number" != typeof t ? S : t)
                      ? E
                      : n;
                  var r = b(e, t);
                  return y(w(r)) > n ? U(e, t - 1) : r;
                },
                serializeKeysForMessage: function (e, t) {
                  if ("number" == typeof e || "string" == typeof e)
                    return e.toString();
                  if (!Array.isArray(e)) return "";
                  if (
                    0 ===
                    (e = e.filter(function (e) {
                      return "string" == typeof e;
                    })).length
                  )
                    return "[object has no keys]";
                  if (((t = "number" != typeof t ? k : t), e[0].length >= t))
                    return e[0];
                  for (var n = e.length; n > 0; n--) {
                    var r = e.slice(0, n).join(", ");
                    if (!(r.length > t)) return n === e.length ? r : r + "â€¦";
                  }
                  return "";
                },
                sanitize: function (e, t) {
                  if (!c(t) || (c(t) && 0 === t.length)) return e;
                  var n,
                    r = d(t),
                    o = "********";
                  try {
                    n = JSON.parse(w(e));
                  } catch (i) {
                    return e;
                  }
                  return (function s(e) {
                    return c(e)
                      ? e.map(function (e) {
                          return s(e);
                        })
                      : a(e)
                      ? Object.keys(e).reduce(function (t, n) {
                          return (t[n] = r.test(n) ? o : s(e[n])), t;
                        }, {})
                      : e;
                  })(n);
                },
              };
            }).call(
              this,
              "undefined" != typeof global
                ? global
                : "undefined" != typeof self
                ? self
                : "undefined" != typeof window
                ? window
                : {}
            );
          },
          { 7: 7 },
        ],
        6: [
          function (e, t, n) {
            (function (n) {
              function r() {
                return "undefined" == typeof document ||
                  null == document.location
                  ? ""
                  : document.location.href;
              }
              var i = e(5),
                o = { collectWindowErrors: !0, debug: !1 },
                a =
                  "undefined" != typeof window
                    ? window
                    : void 0 !== n
                    ? n
                    : "undefined" != typeof self
                    ? self
                    : {},
                s = [].slice,
                c = "?",
                l =
                  /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
              (o.report = (function () {
                function e(t, n) {
                  var r = null;
                  if (!n || o.collectWindowErrors) {
                    for (var i in d)
                      if (d.hasOwnProperty(i))
                        try {
                          d[i].apply(null, [t].concat(s.call(arguments, 2)));
                        } catch (e) {
                          r = e;
                        }
                    if (r) throw r;
                  }
                }
                function t(t, a, s, u, p) {
                  var d = i.isErrorEvent(p) ? p.error : p,
                    f = i.isErrorEvent(t) ? t.message : t;
                  if (g)
                    o.computeStackTrace.augmentStackTraceWithInitialElement(
                      g,
                      a,
                      s,
                      f
                    ),
                      n();
                  else if (d && i.isError(d)) e(o.computeStackTrace(d), !0);
                  else {
                    var m,
                      y = { url: a, line: s, column: u },
                      v = void 0;
                    if ("[object String]" === {}.toString.call(f))
                      (m = f.match(l)) && ((v = m[1]), (f = m[2]));
                    (y.func = c),
                      e({ name: v, message: f, url: r(), stack: [y] }, !0);
                  }
                  return !!h && h.apply(this, arguments);
                }
                function n() {
                  var t = g,
                    n = f;
                  (f = null),
                    (g = null),
                    (m = null),
                    e.apply(null, [t, !1].concat(n));
                }
                function u(e, t) {
                  var r = s.call(arguments, 1);
                  if (g) {
                    if (m === e) return;
                    n();
                  }
                  var i = o.computeStackTrace(e);
                  if (
                    ((g = i),
                    (m = e),
                    (f = r),
                    setTimeout(
                      function () {
                        m === e && n();
                      },
                      i.incomplete ? 2e3 : 0
                    ),
                    !1 !== t)
                  )
                    throw e;
                }
                var h,
                  p,
                  d = [],
                  f = null,
                  m = null,
                  g = null;
                return (
                  (u.subscribe = function (e) {
                    p || ((h = a.onerror), (a.onerror = t), (p = !0)),
                      d.push(e);
                  }),
                  (u.unsubscribe = function (e) {
                    for (var t = d.length - 1; t >= 0; --t)
                      d[t] === e && d.splice(t, 1);
                  }),
                  (u.uninstall = function () {
                    p && ((a.onerror = h), (p = !1), (h = void 0)), (d = []);
                  }),
                  u
                );
              })()),
                (o.computeStackTrace = (function () {
                  function e(e) {
                    if ("undefined" != typeof e.stack && e.stack) {
                      for (
                        var t,
                          n,
                          i,
                          o =
                            /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
                          a =
                            /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx(?:-web)|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
                          s =
                            /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|moz-extension).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js))(?::(\d+))?(?::(\d+))?\s*$/i,
                          l = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
                          u = /\((\S*)(?::(\d+))(?::(\d+))\)/,
                          h = e.stack.split("\n"),
                          p = [],
                          d = (/^(.*) is undefined$/.exec(e.message), 0),
                          f = h.length;
                        d < f;
                        ++d
                      ) {
                        if ((n = o.exec(h[d]))) {
                          var m = n[2] && 0 === n[2].indexOf("native");
                          n[2] &&
                            0 === n[2].indexOf("eval") &&
                            (t = u.exec(n[2])) &&
                            ((n[2] = t[1]), (n[3] = t[2]), (n[4] = t[3])),
                            (i = {
                              url: m ? null : n[2],
                              func: n[1] || c,
                              args: m ? [n[2]] : [],
                              line: n[3] ? +n[3] : null,
                              column: n[4] ? +n[4] : null,
                            });
                        } else if ((n = a.exec(h[d])))
                          i = {
                            url: n[2],
                            func: n[1] || c,
                            args: [],
                            line: +n[3],
                            column: n[4] ? +n[4] : null,
                          };
                        else {
                          if (!(n = s.exec(h[d]))) continue;
                          n[3] &&
                          n[3].indexOf(" > eval") > -1 &&
                          (t = l.exec(n[3]))
                            ? ((n[3] = t[1]), (n[4] = t[2]), (n[5] = null))
                            : 0 !== d ||
                              n[5] ||
                              "undefined" == typeof e.columnNumber ||
                              (p[0].column = e.columnNumber + 1),
                            (i = {
                              url: n[3],
                              func: n[1] || c,
                              args: n[2] ? n[2].split(",") : [],
                              line: n[4] ? +n[4] : null,
                              column: n[5] ? +n[5] : null,
                            });
                        }
                        if (
                          (!i.func && i.line && (i.func = c),
                          i.url && "blob:" === i.url.substr(0, 5))
                        ) {
                          var g = new XMLHttpRequest();
                          if (
                            (g.open("GET", i.url, !1),
                            g.send(null),
                            200 === g.status)
                          ) {
                            var y = g.responseText || "",
                              v = (y = y.slice(-300)).match(
                                /\/\/# sourceMappingURL=(.*)$/
                              );
                            if (v) {
                              var b = v[1];
                              "~" === b.charAt(0) &&
                                (b =
                                  ("undefined" == typeof document ||
                                  null == document.location
                                    ? ""
                                    : document.location.origin
                                    ? document.location.origin
                                    : document.location.protocol +
                                      "//" +
                                      document.location.hostname +
                                      (document.location.port
                                        ? ":" + document.location.port
                                        : "")) + b.slice(1)),
                                (i.url = b.slice(0, -4));
                            }
                          }
                        }
                        p.push(i);
                      }
                      return p.length
                        ? {
                            name: e.name,
                            message: e.message,
                            url: r(),
                            stack: p,
                          }
                        : null;
                    }
                  }
                  function t(e, t, n, r) {
                    var i = { url: t, line: n };
                    if (i.url && i.line) {
                      if (
                        ((e.incomplete = !1),
                        i.func || (i.func = c),
                        e.stack.length > 0 && e.stack[0].url === i.url)
                      ) {
                        if (e.stack[0].line === i.line) return !1;
                        if (!e.stack[0].line && e.stack[0].func === i.func)
                          return (e.stack[0].line = i.line), !1;
                      }
                      return e.stack.unshift(i), (e.partial = !0), !0;
                    }
                    return (e.incomplete = !0), !1;
                  }
                  function n(e, a) {
                    for (
                      var s,
                        l,
                        u =
                          /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,
                        h = [],
                        p = {},
                        d = !1,
                        f = n.caller;
                      f && !d;
                      f = f.caller
                    )
                      if (f !== i && f !== o.report) {
                        if (
                          ((l = {
                            url: null,
                            func: c,
                            line: null,
                            column: null,
                          }),
                          f.name
                            ? (l.func = f.name)
                            : (s = u.exec(f.toString())) && (l.func = s[1]),
                          "undefined" == typeof l.func)
                        )
                          try {
                            l.func = s.input.substring(0, s.input.indexOf("{"));
                          } catch (g) {}
                        p["" + f] ? (d = !0) : (p["" + f] = !0), h.push(l);
                      }
                    a && h.splice(0, a);
                    var m = {
                      name: e.name,
                      message: e.message,
                      url: r(),
                      stack: h,
                    };
                    return (
                      t(
                        m,
                        e.sourceURL || e.fileName,
                        e.line || e.lineNumber,
                        e.message || e.description
                      ),
                      m
                    );
                  }
                  function i(t, i) {
                    var s = null;
                    i = null == i ? 0 : +i;
                    try {
                      if ((s = e(t))) return s;
                    } catch (a) {
                      if (o.debug) throw a;
                    }
                    try {
                      if ((s = n(t, i + 1))) return s;
                    } catch (a) {
                      if (o.debug) throw a;
                    }
                    return { name: t.name, message: t.message, url: r() };
                  }
                  return (
                    (i.augmentStackTraceWithInitialElement = t),
                    (i.computeStackTraceFromStackProp = e),
                    i
                  );
                })()),
                (t.exports = o);
            }).call(
              this,
              "undefined" != typeof global
                ? global
                : "undefined" != typeof self
                ? self
                : "undefined" != typeof window
                ? window
                : {}
            );
          },
          { 5: 5 },
        ],
        7: [
          function (e, t, n) {
            function r(e, t) {
              for (var n = 0; n < e.length; ++n) if (e[n] === t) return n;
              return -1;
            }
            function i(e, t) {
              var n = [],
                i = [];
              return (
                null == t &&
                  (t = function (e, t) {
                    return n[0] === t
                      ? "[Circular ~]"
                      : "[Circular ~." + i.slice(0, r(n, t)).join(".") + "]";
                  }),
                function (o, a) {
                  if (n.length > 0) {
                    var s = r(n, this);
                    ~s ? n.splice(s + 1) : n.push(this),
                      ~s ? i.splice(s, 1 / 0, o) : i.push(o),
                      ~r(n, a) && (a = t.call(this, o, a));
                  } else n.push(a);
                  return null == e
                    ? a instanceof Error
                      ? (function (e) {
                          var t = {
                            stack: e.stack,
                            message: e.message,
                            name: e.name,
                          };
                          for (var n in e)
                            Object.prototype.hasOwnProperty.call(e, n) &&
                              (t[n] = e[n]);
                          return t;
                        })(a)
                      : a
                    : e.call(this, o, a);
                }
              );
            }
            (n = t.exports =
              function (e, t, n, r) {
                return JSON.stringify(e, i(t, r), n);
              }),
              (n.getSerialize = i);
          },
          {},
        ],
        8: [
          function (e, t, n) {
            function r(e, t) {
              var n = (65535 & e) + (65535 & t);
              return (((e >> 16) + (t >> 16) + (n >> 16)) << 16) | (65535 & n);
            }
            function i(e, t, n, i, o, a) {
              return r(
                (function (e, t) {
                  return (e << t) | (e >>> (32 - t));
                })(r(r(t, e), r(i, a)), o),
                n
              );
            }
            function o(e, t, n, r, o, a, s) {
              return i((t & n) | (~t & r), e, t, o, a, s);
            }
            function a(e, t, n, r, o, a, s) {
              return i((t & r) | (n & ~r), e, t, o, a, s);
            }
            function s(e, t, n, r, o, a, s) {
              return i(t ^ n ^ r, e, t, o, a, s);
            }
            function c(e, t, n, r, o, a, s) {
              return i(n ^ (t | ~r), e, t, o, a, s);
            }
            function l(e, t) {
              (e[t >> 5] |= 128 << t % 32),
                (e[14 + (((t + 64) >>> 9) << 4)] = t);
              var n,
                i,
                l,
                u,
                h,
                p = 1732584193,
                d = -271733879,
                f = -1732584194,
                m = 271733878;
              for (n = 0; n < e.length; n += 16)
                (i = p),
                  (l = d),
                  (u = f),
                  (h = m),
                  (p = o(p, d, f, m, e[n], 7, -680876936)),
                  (m = o(m, p, d, f, e[n + 1], 12, -389564586)),
                  (f = o(f, m, p, d, e[n + 2], 17, 606105819)),
                  (d = o(d, f, m, p, e[n + 3], 22, -1044525330)),
                  (p = o(p, d, f, m, e[n + 4], 7, -176418897)),
                  (m = o(m, p, d, f, e[n + 5], 12, 1200080426)),
                  (f = o(f, m, p, d, e[n + 6], 17, -1473231341)),
                  (d = o(d, f, m, p, e[n + 7], 22, -45705983)),
                  (p = o(p, d, f, m, e[n + 8], 7, 1770035416)),
                  (m = o(m, p, d, f, e[n + 9], 12, -1958414417)),
                  (f = o(f, m, p, d, e[n + 10], 17, -42063)),
                  (d = o(d, f, m, p, e[n + 11], 22, -1990404162)),
                  (p = o(p, d, f, m, e[n + 12], 7, 1804603682)),
                  (m = o(m, p, d, f, e[n + 13], 12, -40341101)),
                  (f = o(f, m, p, d, e[n + 14], 17, -1502002290)),
                  (p = a(
                    p,
                    (d = o(d, f, m, p, e[n + 15], 22, 1236535329)),
                    f,
                    m,
                    e[n + 1],
                    5,
                    -165796510
                  )),
                  (m = a(m, p, d, f, e[n + 6], 9, -1069501632)),
                  (f = a(f, m, p, d, e[n + 11], 14, 643717713)),
                  (d = a(d, f, m, p, e[n], 20, -373897302)),
                  (p = a(p, d, f, m, e[n + 5], 5, -701558691)),
                  (m = a(m, p, d, f, e[n + 10], 9, 38016083)),
                  (f = a(f, m, p, d, e[n + 15], 14, -660478335)),
                  (d = a(d, f, m, p, e[n + 4], 20, -405537848)),
                  (p = a(p, d, f, m, e[n + 9], 5, 568446438)),
                  (m = a(m, p, d, f, e[n + 14], 9, -1019803690)),
                  (f = a(f, m, p, d, e[n + 3], 14, -187363961)),
                  (d = a(d, f, m, p, e[n + 8], 20, 1163531501)),
                  (p = a(p, d, f, m, e[n + 13], 5, -1444681467)),
                  (m = a(m, p, d, f, e[n + 2], 9, -51403784)),
                  (f = a(f, m, p, d, e[n + 7], 14, 1735328473)),
                  (p = s(
                    p,
                    (d = a(d, f, m, p, e[n + 12], 20, -1926607734)),
                    f,
                    m,
                    e[n + 5],
                    4,
                    -378558
                  )),
                  (m = s(m, p, d, f, e[n + 8], 11, -2022574463)),
                  (f = s(f, m, p, d, e[n + 11], 16, 1839030562)),
                  (d = s(d, f, m, p, e[n + 14], 23, -35309556)),
                  (p = s(p, d, f, m, e[n + 1], 4, -1530992060)),
                  (m = s(m, p, d, f, e[n + 4], 11, 1272893353)),
                  (f = s(f, m, p, d, e[n + 7], 16, -155497632)),
                  (d = s(d, f, m, p, e[n + 10], 23, -1094730640)),
                  (p = s(p, d, f, m, e[n + 13], 4, 681279174)),
                  (m = s(m, p, d, f, e[n], 11, -358537222)),
                  (f = s(f, m, p, d, e[n + 3], 16, -722521979)),
                  (d = s(d, f, m, p, e[n + 6], 23, 76029189)),
                  (p = s(p, d, f, m, e[n + 9], 4, -640364487)),
                  (m = s(m, p, d, f, e[n + 12], 11, -421815835)),
                  (f = s(f, m, p, d, e[n + 15], 16, 530742520)),
                  (p = c(
                    p,
                    (d = s(d, f, m, p, e[n + 2], 23, -995338651)),
                    f,
                    m,
                    e[n],
                    6,
                    -198630844
                  )),
                  (m = c(m, p, d, f, e[n + 7], 10, 1126891415)),
                  (f = c(f, m, p, d, e[n + 14], 15, -1416354905)),
                  (d = c(d, f, m, p, e[n + 5], 21, -57434055)),
                  (p = c(p, d, f, m, e[n + 12], 6, 1700485571)),
                  (m = c(m, p, d, f, e[n + 3], 10, -1894986606)),
                  (f = c(f, m, p, d, e[n + 10], 15, -1051523)),
                  (d = c(d, f, m, p, e[n + 1], 21, -2054922799)),
                  (p = c(p, d, f, m, e[n + 8], 6, 1873313359)),
                  (m = c(m, p, d, f, e[n + 15], 10, -30611744)),
                  (f = c(f, m, p, d, e[n + 6], 15, -1560198380)),
                  (d = c(d, f, m, p, e[n + 13], 21, 1309151649)),
                  (p = c(p, d, f, m, e[n + 4], 6, -145523070)),
                  (m = c(m, p, d, f, e[n + 11], 10, -1120210379)),
                  (f = c(f, m, p, d, e[n + 2], 15, 718787259)),
                  (d = c(d, f, m, p, e[n + 9], 21, -343485551)),
                  (p = r(p, i)),
                  (d = r(d, l)),
                  (f = r(f, u)),
                  (m = r(m, h));
              return [p, d, f, m];
            }
            function u(e) {
              var t,
                n = "",
                r = 32 * e.length;
              for (t = 0; t < r; t += 8)
                n += String.fromCharCode((e[t >> 5] >>> t % 32) & 255);
              return n;
            }
            function h(e) {
              var t,
                n = [];
              for (n[(e.length >> 2) - 1] = void 0, t = 0; t < n.length; t += 1)
                n[t] = 0;
              var r = 8 * e.length;
              for (t = 0; t < r; t += 8)
                n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
              return n;
            }
            function p(e) {
              var t,
                n,
                r = "0123456789abcdef",
                i = "";
              for (n = 0; n < e.length; n += 1)
                (t = e.charCodeAt(n)),
                  (i += r.charAt((t >>> 4) & 15) + r.charAt(15 & t));
              return i;
            }
            function d(e) {
              return unescape(encodeURIComponent(e));
            }
            function f(e) {
              return (function (e) {
                return u(l(h(e), 8 * e.length));
              })(d(e));
            }
            function m(e, t) {
              return (function (e, t) {
                var n,
                  r,
                  i = h(e),
                  o = [],
                  a = [];
                for (
                  o[15] = a[15] = void 0,
                    i.length > 16 && (i = l(i, 8 * e.length)),
                    n = 0;
                  n < 16;
                  n += 1
                )
                  (o[n] = 909522486 ^ i[n]), (a[n] = 1549556828 ^ i[n]);
                return (
                  (r = l(o.concat(h(t)), 512 + 8 * t.length)),
                  u(l(a.concat(r), 640))
                );
              })(d(e), d(t));
            }
            t.exports = function (e, t, n) {
              return t
                ? n
                  ? m(t, e)
                  : (function (e, t) {
                      return p(m(e, t));
                    })(t, e)
                : n
                ? f(e)
                : (function (e) {
                    return p(f(e));
                  })(e);
            };
          },
          {},
        ],
      },
      {},
      [4]
    )(4);
  });
  var Y = [
      {
        family: "UC Browser",
        patterns: ["(UC? ?Browser|UCWEB|U3)[ /]?(\\d+)\\.(\\d+)\\.(\\d+)"],
      },
      {
        family: "Opera",
        name_replace: "Opera Mobile",
        patterns: [
          "(Opera)/.+Opera Mobi.+Version/(\\d+)\\.(\\d+)",
          "(Opera)/(\\d+)\\.(\\d+).+Opera Mobi",
          "Opera Mobi.+(Opera)(?:/|\\s+)(\\d+)\\.(\\d+)",
          "Opera Mobi",
          "(?:Mobile Safari).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        family: "Opera",
        name_replace: "Opera Mini",
        patterns: [
          "(Opera Mini)(?:/att|)/?(\\d+|)(?:\\.(\\d+)|)(?:\\.(\\d+)|)",
          "(OPiOS)/(\\d+).(\\d+).(\\d+)",
        ],
      },
      {
        family: "Opera",
        name_replace: "Opera Neon",
        patterns: ["Chrome/.+( MMS)/(\\d+).(\\d+).(\\d+)"],
      },
      {
        name_replace: "Opera",
        patterns: [
          "(Opera)/9.80.*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(?:Chrome).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        family: "Firefox",
        name_replace: "Firefox Mobile",
        patterns: [
          "(Fennec)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)",
          "(Fennec)/(\\d+)\\.(\\d+)(pre)",
          "(Fennec)/(\\d+)\\.(\\d+)",
          "(?:Mobile|Tablet);.*(Firefox)/(\\d+)\\.(\\d+)",
          "(FxiOS)/(\\d+)\\.(\\d+)(\\.(\\d+)|)(\\.(\\d+)|)",
        ],
      },
      {
        name_replace: "Coc Coc",
        patterns: ["(coc_coc_browser)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)"],
      },
      {
        family: "QQ",
        name_replace: "QQ Mini",
        patterns: ["(MQQBrowser/Mini)(?:(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)"],
      },
      {
        family: "QQ",
        name_replace: "QQ Mobile",
        patterns: ["(MQQBrowser)(?:/(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)"],
      },
      {
        name_replace: "QQ",
        patterns: [
          "(QQBrowser)(?:/(\\d+)(?:\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)|)",
        ],
      },
      {
        family: "Edge",
        name: "Edge Mobile",
        patterns: [
          "Windows Phone .*(Edge)/(\\d+)\\.(\\d+)",
          "(EdgiOS|EdgA)/(\\d+)\\.(\\d+).(\\d+).(\\d+)",
        ],
      },
      { name_replace: "Edge", patterns: ["(Edge|Edg)/(\\d+)(?:\\.(\\d+)|)"] },
      { patterns: ["(Puffin)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)"] },
      {
        family: "Chrome",
        name_replace: "Chrome Mobile",
        patterns: [
          "Version/.+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "; wv\\).+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "(CriOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "(CrMo)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
          "(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+) Mobile(?:[ /]|$)",
          " Mobile .*(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        family: "Yandex",
        name_replace: "Yandex Mobile",
        patterns: ["(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+).*Mobile"],
      },
      {
        name_replace: "Yandex",
        patterns: ["(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)"],
      },
      {
        patterns: [
          "(Vivaldi)/(\\d+)\\.(\\d+)",
          "(Vivaldi)/(\\d+)\\.(\\d+)\\.(\\d+)",
        ],
      },
      {
        name_replace: "Brave",
        patterns: ["(brave)/(\\d+)\\.(\\d+)\\.(\\d+) Chrome"],
      },
      {
        family: "Chrome",
        patterns: [
          "(Chromium|Chrome)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)",
        ],
      },
      {
        name_replace: "Internet Explorer Mobile",
        patterns: ["(IEMobile)[ /](\\d+)\\.(\\d+)"],
      },
      {
        family: "Safari",
        name_replace: "Safari Mobile",
        patterns: [
          "(iPod|iPhone|iPad).+Version/(d+).(d+)(?:.(d+)|).*[ +]Safari",
          "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).* AppleNews\\/\\d+\\.\\d+\\.\\d+?",
          "(iPod|iPhone|iPad).+Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile.*[ +]Safari",
          "(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile",
          "(iPod|iPod touch|iPhone|iPad).* Safari",
          "(iPod|iPod touch|iPhone|iPad)",
        ],
      },
      {
        name_replace: "Safari",
        patterns: ["(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|).*Safari/"],
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(7|8).(0)"],
        major_replace: "11",
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(6)\\.(0)"],
        major_replace: "10",
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(5)\\.(0)"],
        major_replace: "9",
      },
      {
        name_replace: "Internet Explorer",
        patterns: ["(Trident)/(4)\\.(0)"],
        major_replace: "8",
      },
      {
        family: "Firefox",
        patterns: [
          "(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+)",
          "(Firefox)/(\\d+)\\.(\\d+)(pre|[ab]\\d+[a-z]*|)",
        ],
      },
    ],
    I = [
      {
        family: "Windows",
        name_replace: "Windows Phone",
        patterns: [
          "(Windows Phone) (?:OS[ /])?(\\d+)\\.(\\d+)",
          "^UCWEB.*; (wds) (\\d+)\\.(d+)(?:\\.(\\d+)|);",
          "^UCWEB.*; (wds) (\\d+)\\.(\\d+)(?:\\.(\\d+)|);",
        ],
      },
      {
        family: "Windows",
        name_replace: "Windows Mobile",
        patterns: ["(Windows ?Mobile)"],
      },
      {
        name_replace: "Android",
        patterns: [
          "(Android)[ \\-/](\\d+)(?:\\.(\\d+)|)(?:[.\\-]([a-z0-9]+)|)",
          "(Android) (d+);",
          "^UCWEB.*; (Adr) (\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+)|);",
          "^(JUC).*; ?U; ?(?:Android|)(\\d+)\\.(\\d+)(?:[\\.\\-]([a-z0-9]+)|)",
          "(android)\\s(?:mobile\\/)(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)|)|)",
          "(Silk-Accelerated=[a-z]{4,5})",
          "Puffin/[\\d\\.]+AT",
          "Puffin/[\\d\\.]+AP",
        ],
      },
      {
        name_replace: "Chrome OS",
        patterns: [
          "(x86_64|aarch64)\\ (\\d+)\\.(\\d+)\\.(\\d+).*Chrome.*(?:CitrixChromeApp)$",
          "(CrOS) [a-z0-9_]+ (\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
        ],
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows 10)", "(Windows NT 6\\.4)", "(Windows NT 10\\.0)"],
        major_replace: "10",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.3; ARM;)", "(Windows NT 6.3)"],
        major_replace: "8",
        minor_replace: "1",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.2)"],
        major_replace: "8",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.1)"],
        major_replace: "7",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows NT 6\\.0)"],
        major_replace: "Vista",
      },
      {
        name_replace: "Windows",
        patterns: ["(Windows (?:NT 5\\.2|NT 5\\.1))"],
        major_replace: "XP",
      },
      {
        name_replace: "Mac OS X",
        patterns: [
          "((?:Mac[ +]?|; )OS[ +]X)[\\s+/](?:(\\d+)[_.](\\d+)(?:[_.](\\d+)|)|Mach-O)",
          "\\w+\\s+Mac OS X\\s+\\w+\\s+(\\d+).(\\d+).(\\d+).*",
          "(?:PPC|Intel) (Mac OS X)",
        ],
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(10).(d+).*((?:i386|x86_64))"],
        major_replace: "10",
        minor_replace: "6",
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(11).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "7",
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(12).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "8",
      },
      {
        name_replace: "Mac OS X",
        patterns: [" (Dar)(win)/(13).(\\d+).*\\((?:i386|x86_64)\\)"],
        major_replace: "10",
        minor_replace: "9",
      },
      {
        name_replace: "iOS",
        patterns: [
          "^UCWEB.*; (iPad|iPh|iPd) OS (\\d+)_(\\d+)(?:_(\\d+)|);",
          "(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(\\d+)[_\\.](\\d+)(?:[_\\.](\\d+)|)",
          "(iPhone|iPad|iPod); Opera",
          "(iPhone|iPad|iPod).*Mac OS X.*Version/(\\d+)\\.(\\d+)",
          "\\b(iOS[ /]|iOS; |iPhone(?:/| v|[ _]OS[/,]|; | OS : |\\d,\\d/|\\d,\\d; )|iPad/)(\\d{1,2})[_\\.](\\d{1,2})(?:[_\\.](\\d+)|)",
          "\\((iOS);",
          "(iPod|iPhone|iPad)",
          "Puffin/[\\d\\.]+IT",
          "Puffin/[\\d\\.]+IP",
        ],
      },
      {
        family: "Chrome",
        name_replace: "Chromecast",
        patterns: [
          "(CrKey -)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
          "(CrKey[ +]armv7l)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
          "(CrKey)(?:[/](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
        ],
      },
      { name_replace: "Debian", patterns: ["([Dd]ebian)"] },
      {
        family: "Linux",
        name_replace: "Linux",
        patterns: ["(Linux Mint)(?:/(\\d+)|)"],
      },
      {
        family: "Linux",
        patterns: [
          "(Ubuntu|Kubuntu|Arch Linux|CentOS|Slackware|Gentoo|openSUSE|SUSE|Red Hat|Fedora|PCLinuxOS|Mageia|(?:Free|Open|Net|\\b)BSD)",
          "(Mandriva)(?: Linux|)/(?:[\\d.-]+m[a-z]{2}(\\d+).(\\d)|)",
          "(Linux)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)",
          "\\(linux-gnu\\)",
        ],
      },
      {
        family: "BlackBerry",
        name_replace: "BlackBerry OS",
        patterns: [
          "(BB10);.+Version/(\\d+)\\.(\\d+)\\.(\\d+)",
          "(Black[Bb]erry)[0-9a-z]+/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(Black[Bb]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)",
          "(Black[Bb]erry)",
        ],
      },
      {
        patterns: [
          "(Fedora|Red Hat|PCLinuxOS|Puppy|Ubuntu|Kindle|Bada|Sailfish|Lubuntu|BackTrack|Slackware|(?:Free|Open|Net|\\b)BSD)[/ ](\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)",
        ],
      },
    ],
    Z = navigator.userAgent,
    L = function () {
      return Z;
    },
    z = function (e) {
      return J(e || Z, Y);
    },
    K = function (e) {
      return J(e || Z, I);
    };
  function $(e, t) {
    try {
      var n = new RegExp(t).exec(e);
      return n
        ? {
            name: n[1] || "Other",
            major: n[2] || "0",
            minor: n[3] || "0",
            patch: n[4] || "0",
          }
        : null;
    } catch (nr) {
      return null;
    }
  }
  function J(e, t) {
    for (var n = null, r = null, i = -1, o = !1; ++i < t.length && !o; ) {
      n = t[i];
      for (var a = -1; ++a < n.patterns.length && !o; )
        o = null !== (r = $(e, n.patterns[a]));
    }
    return o
      ? ((r.family = n.family || n.name_replace || r.name),
        n.name_replace && (r.name = n.name_replace),
        n.major_replace && (r.major = n.major_replace),
        n.minor_replace && (r.minor = n.minor_replace),
        n.patch_replace && (r.minor = n.patch_replace),
        r)
      : { family: "Other", name: "Other", major: "0", minor: "0", patch: "0" };
  }
  function X() {
    var e = this,
      t = z(),
      n = L();
    (this.agent = n.toLowerCase()),
      (this.language =
        window.navigator.userLanguage || window.navigator.language),
      (this.isCSS1 = "CSS1Compat" === (document.compatMode || "")),
      (this.width = function () {
        return window.innerWidth && window.document.documentElement.clientWidth
          ? Math.min(window.innerWidth, document.documentElement.clientWidth)
          : window.innerWidth ||
              window.document.documentElement.clientWidth ||
              document.body.clientWidth;
      }),
      (this.height = function () {
        return (
          window.innerHeight ||
          window.document.documentElement.clientHeight ||
          document.body.clientHeight
        );
      }),
      (this.scrollX = function () {
        return window.pageXOffset !== undefined
          ? window.pageXOffset
          : e.isCSS1
          ? document.documentElement.scrollLeft
          : document.body.scrollLeft;
      }),
      (this.scrollY = function () {
        return window.pageYOffset !== undefined
          ? window.pageYOffset
          : e.isCSS1
          ? document.documentElement.scrollTop
          : document.body.scrollTop;
      }),
      (this.type =
        "Edge" === t.family
          ? "edge"
          : "Internet Explorer" === t.family
          ? "ie"
          : "Chrome" === t.family
          ? "chrome"
          : "Safari" === t.family
          ? "safari"
          : "Firefox" === t.family
          ? "firefox"
          : t.family.toLowerCase()),
      (this.version = 1 * (t.major + "." + t.minor) || 0),
      (this.hasPostMessage = !!window.postMessage);
  }
  (X.prototype.hasEvent = function (e, t) {
    return "on" + e in (t || document.createElement("div"));
  }),
    (X.prototype.getScreenDimensions = function () {
      var e = {};
      for (var t in window.screen) e[t] = window.screen[t];
      return delete e.orientation, e;
    }),
    (X.prototype.getOrientation = function () {
      return "function" == typeof matchMedia
        ? matchMedia("(orientation: landscape)").matches
          ? "landscape"
          : "portrait"
        : window.screen.orientation
        ? screen.orientation.type.startsWith("landscape")
          ? "landscape"
          : "portrait"
        : this.width() > this.height()
        ? "landscape"
        : "portrait";
    }),
    (X.prototype.getWindowDimensions = function () {
      return [this.width(), this.height()];
    }),
    (X.prototype.interrogateNavigator = function () {
      var e = {};
      for (var t in window.navigator)
        if ("webkitPersistentStorage" !== t)
          try {
            e[t] = window.navigator[t];
          } catch (tr) {}
      if (
        (delete e.plugins,
        delete e.mimeTypes,
        (e.plugins = []),
        window.navigator.plugins)
      )
        for (var n = 0; n < window.navigator.plugins.length; n++)
          e.plugins[n] = window.navigator.plugins[n].filename;
      return e;
    }),
    (X.prototype.supportsPST = function () {
      return document.hasPrivateToken !== undefined;
    }),
    (X.prototype.supportsCanvas = function () {
      var e = document.createElement("canvas");
      return !(!e.getContext || !e.getContext("2d"));
    }),
    (X.prototype.supportsWebAssembly = function () {
      try {
        if (
          "object" == typeof WebAssembly &&
          "function" == typeof WebAssembly.instantiate
        ) {
          var e = new WebAssembly.Module(
            Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0)
          );
          if (e instanceof WebAssembly.Module)
            return new WebAssembly.Instance(e) instanceof WebAssembly.Instance;
        }
      } catch (nr) {
        return !1;
      }
    });
  var q = new X(),
    Q = new (function () {
      var e,
        t,
        n = K(),
        r = L();
      (this.mobile =
        ((e = !!(
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
        )),
        (t = !1),
        n &&
          (t =
            [
              "iOS",
              "Windows Phone",
              "Windows Mobile",
              "Android",
              "BlackBerry OS",
            ].indexOf(n.name) >= 0),
        e && t)),
        (this.dpr = function () {
          return window.devicePixelRatio || 1;
        }),
        this.mobile &&
          n &&
          "Windows" === n.family &&
          r.indexOf("touch") < 0 &&
          (this.mobile = !1),
        (this.os =
          "iOS" === n.family
            ? "ios"
            : "Android" === n.family
            ? "android"
            : "Mac OS X" === n.family
            ? "mac"
            : "Windows" === n.family
            ? "windows"
            : "Linux" === n.family
            ? "linux"
            : n.family.toLowerCase()),
        (this.version = (function () {
          if (!n) return "unknown";
          var e = n.major;
          return (
            n.minor && (e += "." + n.minor), n.patch && (e += "." + n.patch), e
          );
        })());
    })(),
    ee = {
      Browser: q,
      System: Q,
      supportsPAT: function () {
        return (
          ("mac" === Q.os || "ios" === Q.os) &&
          "safari" === q.type &&
          q.version >= 16.2
        );
      },
    },
    te = "challenge-passed",
    ne = "challenge-escaped",
    re = "challenge-closed",
    ie = "challenge-expired",
    oe = "invalid-data",
    ae = "bundle-error",
    se = "rate-limited",
    ce = "network-error",
    le = "challenge-error",
    ue = "incomplete-answer",
    he = "missing-captcha",
    pe = "missing-sitekey",
    de = "invalid-captcha-id",
    fe = "https://api.hcaptcha.com",
    me = "https://api2.hcaptcha.com",
    ge = "auto",
    ye = {
      host: null,
      file: null,
      sitekey: null,
      a11y_tfe: null,
      pingdom:
        "safari" === ee.Browser.type &&
        "windows" !== ee.System.os &&
        "mac" !== ee.System.os &&
        "ios" !== ee.System.os &&
        "android" !== ee.System.os,
      assetDomain: "https://newassets.hcaptcha.com",
      assetUrl:
        "https://newassets.hcaptcha.com/captcha/v1/1b564ae232134bc294a3d1294b86767efc3e7747/static",
      width: null,
      height: null,
      mobile: null,
      orientation: "portrait",
      challenge_type: null,
    },
    ve = {
      se: null,
      custom: !1,
      tplinks: "on",
      language: null,
      reportapi: "https://accounts.hcaptcha.com",
      endpoint: fe,
      pstIssuer: "https://pst-issuer.hcaptcha.com",
      size: "normal",
      theme: "light",
      mode: undefined,
      assethost: null,
      imghost: null,
      recaptchacompat: "true",
      pat: "on",
      andint: "off",
      confirmNav: !1,
    },
    be = "https://30910f52569b4c17b1081ead2dae43b4@sentry.hcaptcha.com/6",
    we = "1b564ae232134bc294a3d1294b86767efc3e7747",
    _e = "prod";
  function Se(e, t) {
    (e.style.width = "302px"),
      (e.style.height = "76px"),
      (e.style.backgroundColor = "#f9e5e5"),
      (e.style.position = "relative"),
      (e.innerHTML = "");
    var n = document.createElement("div");
    (n.style.width = "284px"),
      (n.style.position = "absolute"),
      (n.style.top = "12px"),
      (n.style.left = "10px"),
      (n.style.color = "#7c0a06"),
      (n.style.fontSize = "14px"),
      (n.style.fontWeight = "normal"),
      (n.style.lineHeight = "18px"),
      (n.innerHTML =
        t ||
        "Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> to complete this captcha."),
      e.appendChild(n);
  }
  function Ee(e) {
    for (
      var t = document.getElementsByClassName("h-captcha"), n = [], r = 0;
      r < t.length;
      r++
    )
      n.push(t[r]);
    var i = [];
    if ("off" !== ve.recaptchacompat)
      for (
        var o = document.getElementsByClassName("g-recaptcha"), a = 0;
        a < o.length;
        a++
      )
        i.push(o[a]);
    for (var s = [].concat(n, i), c = 0; c < s.length; c++) e(s[c]);
  }
  var ke = "The captcha failed to load.",
    Ue = [],
    xe = /(https?|wasm):\/\//,
    Ve = /^at\s/,
    Re = /:\d+:\d+/g,
    We = [
      "Rate limited or network error. Please retry.",
      "Unreachable code should not be executed",
      "Out of bounds memory access",
    ];
  function Te(e) {
    return xe.test(e) ? null : e.trim().replace(Ve, "").replace(Re, "");
  }
  function Oe(e) {
    for (var t = [], n = 0, r = e.length; n < r; n++) {
      var i = Te(e[n]);
      null !== i && t.push(i);
    }
    return t.join("\n").trim();
  }
  function Ce(e) {
    if (
      e &&
      "string" == typeof e &&
      -1 === Ue.indexOf(e) &&
      !(Ue.length >= 10)
    ) {
      var t = Oe(e.trim().split("\n").slice(0, 2));
      Ue.push(t);
    }
  }
  function Me(e) {
    (e && "object" == typeof e) ||
      (e = { name: "error", message: "", stack: "" });
    var t = { message: e.name + ": " + e.message };
    e.stack && (t.stack_trace = { trace: e.stack }),
      Ge("report error", "internal", "debug", t),
      je(e.message || "internal error", "error", ye.file, e);
  }
  function Pe(e) {
    return function () {
      try {
        return e.apply(this, arguments);
      } catch (tr) {
        throw (
          (Me(tr),
          Ee(function (e) {
            Se(e, ke);
          }),
          tr)
        );
      }
    };
  }
  function Ae(e) {
    var t = !1,
      n = !1,
      r = !1;
    try {
      (n = -1 !== window.location.href.indexOf("chargebee.com")),
        (r = -1 !== window.location.href.indexOf("kobo")),
        (t =
          "8d3aee53-3b2b-414d-b043-a67de5b00328.ios-sdk.hcaptcha.com" ===
          ye.host);
    } catch (nr) {}
    (ve.sentry || t) &&
      (window.Raven &&
        Raven.config(be, {
          release: we,
          environment: _e,
          autoBreadcrumbs: { xhr: !0, dom: !0, sentry: !0 },
          tags: {
            "site-host": ye.host,
            "site-key": ye.sitekey,
            "endpoint-url": ve.endpoint,
            "asset-url": ye.assetUrl,
          },
          sampleRate: n || r || t ? 1 : 0.01,
          ignoreErrors: [
            "Cannot set properties of undefined (setting 'data')",
            "canvas.contentDocument",
            "Can't find variable: ZiteReader",
            "Cannot redefine property: hcaptcha",
            "Cannot redefine property: BetterJsPop",
            "grecaptcha is not defined",
            "jQuery is not defined",
            "$ is not defined",
            "Script is not a function",
          ],
        }),
      window.Raven &&
        Raven.setUserContext({
          "Browser-Agent": ee.Browser.agent,
          "Browser-Type": ee.Browser.type,
          "Browser-Version": ee.Browser.version,
          "System-OS": ee.System.os,
          "System-Version": ee.System.version,
          "Is-Mobile": ee.System.mobile,
        }),
      Ge(ye.file + "_internal", "setup", "info"),
      e &&
        (window.onerror = function (e, t, n, r, i) {
          (i && "object" == typeof i) || (i = {});
          var o = i.name || "Error",
            a = i.stack || "";
          Pe(Ce)(a),
            -1 === a.indexOf("chrome-extension://") &&
              -1 === a.indexOf("safari-extension://") &&
              -1 === a.indexOf("moz-extension://") &&
              -1 === a.indexOf("chrome://internal-") &&
              -1 === a.indexOf("/hammerhead.js") &&
              -1 === a.indexOf("eval at buildCode") &&
              -1 === a.indexOf("u.c.b.r.o.w.s.e.r/ucbrowser_script.js") &&
              (Ge(e, "global", "debug", {
                name: o,
                url: t,
                line: n,
                column: r,
                stack: a,
              }),
              De("global", i, { message: e }));
        }));
  }
  function je(e, t, n, r) {
    t = t || "error";
    var i =
      "8d3aee53-3b2b-414d-b043-a67de5b00328.ios-sdk.hcaptcha.com" === ye.host;
    if ("string" == typeof e) {
      for (var o = We.length; o--; )
        if (e.indexOf(We[o]) >= 0) {
          e = We[o];
          break;
        }
      /^self\.\w* is not a function$/.test(e)
        ? (e = "self.X is not a function")
        : /^\w\._Fun.* is not a function$/.test(e) &&
          (e = "x._Fun* is not a function");
    }
    if (ve.sentry || i) {
      var a = "warn" === t ? "warning" : t;
      window.Raven &&
        Raven.captureMessage(e, { level: a, logger: n, extra: r });
    }
  }
  function De(e, t, n) {
    return (
      ((n = n || {}).error = t),
      je(
        ("string" == typeof t ? t : t && t.message) ||
          n.message ||
          "Missing Error",
        "error",
        e,
        n
      )
    );
  }
  function Ge(e, t, n, r) {
    var i =
      "8d3aee53-3b2b-414d-b043-a67de5b00328.ios-sdk.hcaptcha.com" === ye.host;
    (ve.sentry || i) &&
      window.Raven &&
      Raven.captureBreadcrumb({ message: e, category: t, level: n, data: r });
  }
  var He = {
    __proto__: null,
    _stackTraceSet: Ue,
    refineLine: Te,
    toRefinedString: Oe,
    reportError: Me,
    errorWrapper: Pe,
    initSentry: Ae,
    sentryMessage: je,
    sentryError: De,
    sentryBreadcrumb: Ge,
  };
  function Fe() {
    var e = [],
      t = null,
      n = !1,
      r = [],
      i = function (t) {
        try {
          if (e.length >= 10) return;
          var n = t.stack;
          if ("string" != typeof n) return;
          var r = n.trim().split("\n");
          "Error" === r[0] && (r = r.slice(1));
          for (
            var i = /extension/, o = r.length - 1, a = [], s = 0;
            o >= 0 && a.length < 6;

          ) {
            var c = r[o],
              l = Te(c);
            if (null !== l) {
              if (i.test(c)) {
                a = [l];
                break;
              }
              if (
                (a.unshift(l),
                (s = Math.max(s, l.length)),
                a.length >= 2 && s >= 30)
              )
                break;
              o--;
            } else o--;
          }
          var u = a.join("\n").trim();
          u && -1 === e.indexOf(u) && e.push(u);
        } catch (t) {
          return;
        }
      },
      o = function () {
        if (n)
          try {
            for (var e = 0, o = r.length; e < o; e++) r[e]();
            null !== t && clearTimeout(t);
          } catch (a) {
            i(a);
          } finally {
            (r = []), (t = null), (n = !1);
          }
      },
      a = function (t, a) {
        var s = Object.getOwnPropertyDescriptor(t, a);
        if (!(s && !1 === s.writable)) {
          var c,
            l = Object.prototype.hasOwnProperty.call(t, a),
            u = t[a];
          (c =
            "undefined" != typeof Proxy && "undefined" != typeof Reflect
              ? new Proxy(u, {
                  apply: function (t, r, a) {
                    return (
                      n && (e.length >= 10 && o(), i(new Error())),
                      Reflect.apply(t, r, a)
                    );
                  },
                })
              : function () {
                  return (
                    n && (e.length >= 10 && o(), i(new Error())),
                    u.apply(this, arguments)
                  );
                }),
            Object.defineProperty(t, a, {
              configurable: !0,
              enumerable: !s || s.enumerable,
              writable: !0,
              value: c,
            }),
            r.push(function () {
              l
                ? Object.defineProperty(t, a, {
                    configurable: !0,
                    enumerable: !s || s.enumerable,
                    writable: !0,
                    value: u,
                  })
                : delete t[a];
            });
        }
      };
    return {
      run: function (e) {
        var r = (e = e || {}).timeout,
          s = !0 === e.topLevel && e.topLevel;
        if (!n) {
          (n = !0),
            "number" == typeof r &&
              isFinite(r) &&
              (t = setTimeout(function () {
                o();
              }, r));
          try {
            a(Document.prototype, "getElementsByClassName"),
              a(Document.prototype, "getElementById"),
              a(Document.prototype, "getElementsByTagName"),
              a(Document.prototype, "querySelector"),
              a(Document.prototype, "querySelectorAll"),
              a(Element.prototype, "getElementsByClassName"),
              a(Element.prototype, "getElementsByTagName"),
              a(Element.prototype, "querySelector"),
              a(Element.prototype, "querySelectorAll"),
              a(HTMLElement.prototype, "click"),
              a(HTMLElement.prototype, "getElementsByClassName"),
              a(HTMLElement.prototype, "getElementsByTagName"),
              a(HTMLElement.prototype, "querySelector"),
              a(HTMLElement.prototype, "querySelectorAll"),
              s || a(console, "log");
          } catch (c) {
            o(), i(c);
          }
        }
      },
      collect: function () {
        return e.concat(Ue);
      },
    };
  }
  var Ne = {
      getCookie: function (e) {
        var t = document.cookie.replace(/ /g, "").split(";");
        try {
          for (var n = "", r = t.length; r-- && !n; )
            t[r].indexOf(e) >= 0 && (n = t[r]);
          return n;
        } catch (nr) {
          return "";
        }
      },
      hasCookie: function (e) {
        return !!Ne.getCookie(e);
      },
      supportsAPI: function () {
        try {
          return (
            "hasStorageAccess" in document && "requestStorageAccess" in document
          );
        } catch (nr) {
          return !1;
        }
      },
      hasAccess: function () {
        return new Promise(function (e) {
          document
            .hasStorageAccess()
            .then(function () {
              e(!0);
            })
            ["catch"](function () {
              e(!1);
            });
        });
      },
      requestAccess: function () {
        try {
          return document.requestStorageAccess();
        } catch (nr) {
          return Promise.resolve();
        }
      },
    },
    Be = {
      array: function (e) {
        if (0 === e.length) return e;
        for (var t, n, r = e.length; --r > -1; )
          (n = Math.floor(Math.random() * (r + 1))),
            (t = e[r]),
            (e[r] = e[n]),
            (e[n] = t);
        return e;
      },
    };
  function Ye(e) {
    (this.r = 255),
      (this.g = 255),
      (this.b = 255),
      (this.a = 1),
      (this.h = 1),
      (this.s = 1),
      (this.l = 1),
      this.parseString(e);
  }
  function Ie(e, t, n) {
    return (
      n < 0 && (n += 1),
      n > 1 && (n -= 1),
      n < 1 / 6
        ? e + 6 * (t - e) * n
        : n < 0.5
        ? t
        : n < 2 / 3
        ? e + (t - e) * (2 / 3 - n) * 6
        : e
    );
  }
  (Ye.hasAlpha = function (e) {
    return (
      "string" == typeof e &&
      (-1 !== e.indexOf("rgba") || (9 === e.length && "#" === e[0]))
    );
  }),
    (Ye.prototype.parseString = function (e) {
      e &&
        (0 === e.indexOf("#")
          ? this.fromHex(e)
          : 0 === e.indexOf("rgb") && this.fromRGBA(e));
    }),
    (Ye.prototype.fromHex = function (e) {
      var t = 1;
      9 === e.length && (t = parseInt(e.substr(7, 2), 16) / 255);
      var n = (e = e.substr(1, 6)).replace(
          /^([a-f\d])([a-f\d])([a-f\d])?$/i,
          function (e, t, n, r) {
            return t + t + n + n + r + r;
          }
        ),
        r = parseInt(n, 16),
        i = r >> 16,
        o = (r >> 8) & 255,
        a = 255 & r;
      this.setRGBA(i, o, a, t);
    }),
    (Ye.prototype.fromRGBA = function (e) {
      var t = e.indexOf("rgba"),
        n = e
          .substr(t)
          .replace(/rgba?\(/, "")
          .replace(/\)/, "")
          .replace(/[\s+]/g, "")
          .split(","),
        r = Math.floor(parseInt(n[0])),
        i = Math.floor(parseInt(n[1])),
        o = Math.floor(parseInt(n[2])),
        a = parseFloat(n[3]);
      this.setRGBA(r, i, o, a);
    }),
    (Ye.prototype.setRGB = function (e, t, n) {
      this.setRGBA(e, t, n, 1);
    }),
    (Ye.prototype.setRGBA = function (e, t, n, r) {
      (this.r = e),
        (this.g = t),
        (this.b = n),
        (this.a = isNaN(r) ? this.a : r),
        this.updateHSL();
    }),
    (Ye.prototype.hsl2rgb = function (e, t, n) {
      if (0 === t) {
        var r = Math.round(255 * n);
        return this.setRGB(r, r, r), this;
      }
      var i = n <= 0.5 ? n * (1 + t) : n + t - n * t,
        o = 2 * n - i;
      return (
        (this.r = Math.round(255 * Ie(o, i, e + 1 / 3))),
        (this.g = Math.round(255 * Ie(o, i, e))),
        (this.b = Math.round(255 * Ie(o, i, e - 1 / 3))),
        (this.h = e),
        (this.s = t),
        (this.l = n),
        this
      );
    }),
    (Ye.prototype.updateHSL = function () {
      var e,
        t = this.r / 255,
        n = this.g / 255,
        r = this.b / 255,
        i = Math.max(t, n, r),
        o = Math.min(t, n, r),
        a = null,
        s = (i + o) / 2;
      if (i === o) a = e = 0;
      else {
        var c = i - o;
        switch (((e = s > 0.5 ? c / (2 - i - o) : c / (i + o)), i)) {
          case t:
            a = (n - r) / c + (n < r ? 6 : 0);
            break;
          case n:
            a = (r - t) / c + 2;
            break;
          case r:
            a = (t - n) / c + 4;
        }
        a /= 6;
      }
      return (this.h = a), (this.s = e), (this.l = s), this;
    }),
    (Ye.prototype.getHex = function () {
      return (
        "#" +
        ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b)
          .toString(16)
          .slice(1)
      );
    }),
    (Ye.prototype.getRGBA = function () {
      return (
        "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")"
      );
    }),
    (Ye.prototype.clone = function () {
      var e = new Ye();
      return e.setRGBA(this.r, this.g, this.b, this.a), e;
    }),
    (Ye.prototype.mix = function (e, t) {
      e instanceof Ye || (e = new Ye(e));
      var n = new Ye(),
        r = Math.round(this.r + t * (e.r - this.r)),
        i = Math.round(this.g + t * (e.g - this.g)),
        o = Math.round(this.b + t * (e.b - this.b));
      return n.setRGB(r, i, o), n;
    }),
    (Ye.prototype.blend = function (e, t) {
      var n;
      e instanceof Ye || (e = new Ye(e));
      for (var r = [], i = 0; i < t; i++)
        (n = this.mix.call(this, e, i / t)), r.push(n);
      return r;
    }),
    (Ye.prototype.lightness = function (e) {
      return e > 1 && (e /= 100), this.hsl2rgb(this.h, this.s, e), this;
    }),
    (Ye.prototype.saturation = function (e) {
      return e > 1 && (e /= 100), this.hsl2rgb(this.h, e, this.l), this;
    }),
    (Ye.prototype.hue = function (e) {
      return this.hsl2rgb(e / 360, this.s, this.l), this;
    });
  var Ze = {
      decode: function (e) {
        try {
          var t = e.split(".");
          return {
            header: JSON.parse(atob(t[0])),
            payload: JSON.parse(atob(t[1])),
            signature: atob(t[2].replace(/_/g, "/").replace(/-/g, "+")),
            raw: { header: t[0], payload: t[1], signature: t[2] },
          };
        } catch (nr) {
          throw new Error("Token is invalid.");
        }
      },
      checkExpiration: function (e) {
        if (new Date(1e3 * e) <= new Date(Date.now()))
          throw new Error("Token is expired.");
        return !0;
      },
    },
    Le = {
      _setup: !1,
      _af: null,
      _fps: 60,
      _singleFrame: 1 / 60,
      _lagThreshold: 500,
      _adjustedLag: (1 / 60) * 2,
      _startTime: 0,
      _lastTime: 0,
      _nextTime: 1 / 60,
      _elapsed: 0,
      _difference: 0,
      _renders: [],
      _paused: !1,
      _running: !1,
      _tick: !1,
      frame: 0,
      time: 0,
      requestFrame: null,
      cancelFrame: null,
      _init: function () {
        for (
          var e,
            t = window.requestAnimationFrame,
            n = window.cancelAnimationFrame,
            r = ["ms", "moz", "webkit", "o"],
            i = r.length;
          --i > -1 && !t;

        )
          (t = window[r[i] + "RequestAnimationFrame"]),
            (n =
              window[r[i] + "CancelAnimationFrame"] ||
              window[r[i] + "CancelRequestAnimationFrame"]);
        t
          ? ((Le.requestFrame = t.bind(window)),
            (Le.cancelFrame = n.bind(window)))
          : ((Le.requestFrame =
              ((e = Date.now()),
              function (t) {
                window.setTimeout(function () {
                  t(Date.now() - e);
                }, 1e3 * Le._singleFrame);
              })),
            (Le.cancelFrame = function (e) {
              return clearTimeout(e), null;
            })),
          (Le._setup = !0),
          (Le._startTime = Le._lastTime = Date.now());
      },
      add: function (e, t) {
        Le._renders.push({ callback: e, paused: !1 == !t || !1 }),
          !1 == !t && Le.start();
      },
      remove: function (e) {
        for (var t = Le._renders.length; --t > -1; )
          Le._renders[t].callback === e &&
            ((Le._renders[t].paused = !0), Le._renders.splice(t, 1));
      },
      start: function (e) {
        if ((!1 === Le._setup && Le._init(), e))
          for (var t = Le._renders.length; --t > -1; )
            Le._renders[t].callback === e && (Le._renders[t].paused = !1);
        !0 !== Le._running &&
          ((Le._paused = !1),
          (Le._running = !0),
          (Le._af = Le.requestFrame(Le._update)));
      },
      stop: function (e) {
        if (e)
          for (var t = Le._renders.length; --t > -1; )
            Le._renders[t].callback === e && (Le._renders[t].paused = !0);
        else
          !1 !== Le._running &&
            ((Le._af = Le.cancelFrame(Le._af)),
            (Le._paused = !0),
            (Le._running = !1));
      },
      elapsed: function () {
        return Date.now() - Le._startTime;
      },
      fps: function (e) {
        return arguments.length
          ? ((Le._fps = e),
            (Le._singleFrame = 1 / (Le._fps || 60)),
            (Le._adjustedLag = 2 * Le._singleFrame),
            (Le._nextTime = Le.time + Le._singleFrame),
            Le._fps)
          : Le._fps;
      },
      isRunning: function () {
        return Le._running;
      },
      _update: function () {
        if (
          !Le._paused &&
          ((Le._elapsed = Date.now() - Le._lastTime),
          (Le._tick = !1),
          Le._elapsed > Le._lagThreshold &&
            (Le._startTime += Le._elapsed - Le._adjustedLag),
          (Le._lastTime += Le._elapsed),
          (Le.time = (Le._lastTime - Le._startTime) / 1e3),
          (Le._difference = Le.time - Le._nextTime),
          Le._difference > 0 &&
            (Le.frame++,
            (Le._nextTime +=
              Le._difference +
              (Le._difference >= Le._singleFrame
                ? Le._singleFrame / 4
                : Le._singleFrame - Le._difference)),
            (Le._tick = !0)),
          (Le._af = Le.requestFrame(Le._update)),
          !0 === Le._tick && Le._renders.length > 0)
        )
          for (var e = Le._renders.length; --e > -1; )
            Le._renders[e] &&
              !1 === Le._renders[e].paused &&
              Le._renders[e].callback(Le.time);
      },
    };
  var ze = function (e) {
      for (
        var t,
          n,
          r,
          i = {},
          o = e ? (e.indexOf("&") >= 0 ? e.split("&") : [e]) : [],
          a = 0;
        a < o.length;
        a++
      )
        if (o[a].indexOf("=") >= 0) {
          if (
            ((t = o[a].split("=")),
            (n = decodeURIComponent(t[0])),
            ("false" !== (r = decodeURIComponent(t[1])) && "true" !== r) ||
              (r = "true" === r),
            "theme" === n || "themeConfig" === n)
          )
            try {
              r = JSON.parse(r);
            } catch (nr) {}
          i[n] = r;
        }
      return i;
    },
    Ke = function (e) {
      var t = [];
      for (var n in e) {
        var r = e[n];
        (r = "object" == typeof r ? JSON.stringify(r) : r),
          t.push([encodeURIComponent(n), encodeURIComponent(r)].join("="));
      }
      return t.join("&");
    },
    $e = { __proto__: null, Decode: ze, Encode: Ke };
  function Je(e, t, n) {
    return Math.min(Math.max(e, t), n);
  }
  var Xe = {
    __proto__: null,
    clamp: Je,
    range: function (e, t, n, r, i, o) {
      var a = ((e - t) * (i - r)) / (n - t) + r;
      return !1 === o ? a : Je(a, Math.min(r, i), Math.max(r, i));
    },
    toRadians: function (e) {
      return e * (Math.PI / 180);
    },
    toDegrees: function (e) {
      return (180 * e) / Math.PI;
    },
    lerp: function (e, t, n) {
      return e + (t - e) * n;
    },
  };
  function qe(e, t, n) {
    (this._period = e),
      (this._interval = t),
      (this._date = []),
      (this._data = []),
      (this._prevTimestamp = 0),
      (this._meanPeriod = 0),
      (this._medianPeriod = 0),
      (this._medianMaxHeapSize = 32),
      (this._medianMinHeap = []),
      (this._medianMaxHeap = []),
      (this._meanCounter = 0),
      (this._baseTime = n || 0);
  }
  function Qe(e) {
    return new Promise(function (t, n) {
      e(t, n, function r() {
        e(t, n, r);
      });
    });
  }
  function et(e, t) {
    var n = "attempts" in (t = t || {}) ? t.attempts : 1,
      r = t.delay || 0,
      i = t.onFail;
    return Qe(function (t, o, a) {
      e().then(t, function (e) {
        var t = n-- > 0;
        if (i) {
          var s = i(e, n);
          s && ((t = !1 !== s.retry && t), (r = s.delay));
        }
        t ? setTimeout(a, r || 0) : o(e);
      });
    });
  }
  function tt(e, t) {
    var n = "attempts" in (t = t || {}) ? t.attempts : 1,
      r = t.delay || 0,
      i = t.onFail,
      o = null,
      a = !1,
      s = Qe(function (t, s, c) {
        a
          ? s(new Error("Request cancelled"))
          : e().then(t, function (e) {
              if (a) s(new Error("Request cancelled"));
              else {
                var t = n-- > 0;
                if (i) {
                  var l = i(e, n);
                  l && ((t = !1 !== l.retry && t), (r = l.delay));
                }
                t ? (o = setTimeout(c, r || 0)) : s(e);
              }
            });
      });
    return (
      (s.cancel = function () {
        (a = !0), o && (clearTimeout(o), (o = null));
      }),
      s
    );
  }
  function nt(e, t) {
    return new Promise(function (n, r) {
      var i = setTimeout(function () {
        r(new Error("timeout"));
      }, t);
      e.then(function (e) {
        clearTimeout(i), n(e);
      })["catch"](function (e) {
        clearTimeout(i), r(e);
      });
    });
  }
  function rt(e) {
    var t = [].slice.call(arguments, 1);
    "string" == typeof e
      ? window[e]
        ? "function" == typeof window[e]
          ? window[e].apply(null, t)
          : console.log("[hCaptcha] Callback '" + e + "' is not a function.")
        : console.log("[hCaptcha] Callback '" + e + "' is not defined.")
      : "function" == typeof e
      ? e.apply(null, t)
      : console.log("[hcaptcha] Invalid callback '" + e + "'.");
  }
  function it() {
    try {
      rt.apply(null, arguments);
    } catch (tr) {
      console.error("[hCaptcha] There was an error in your callback."),
        console.error(tr);
    }
  }
  function ot(e, t) {
    for (
      var n = [
          "hl",
          "custom",
          "andint",
          "tplinks",
          "sitekey",
          "theme",
          "type",
          "size",
          "tabindex",
          "callback",
          "expired-callback",
          "chalexpired-callback",
          "error-callback",
          "open-callback",
          "close-callback",
          "endpoint",
          "challenge-container",
          "confirm-nav",
          "orientation",
          "mode",
        ],
        r = {},
        i = 0;
      i < n.length;
      i++
    ) {
      var o = n[i],
        a = t && t[o];
      a || (a = e.getAttribute("data-" + o)), a && (r[o] = a);
    }
    return r;
  }
  (qe.prototype.getMeanPeriod = function () {
    return this._meanPeriod;
  }),
    (qe.prototype.getMedianPeriod = function () {
      return this._medianPeriod;
    }),
    (qe.prototype.getData = function () {
      return this._cleanStaleData(), this._data;
    }),
    (qe.prototype.getSize = function () {
      return this._cleanStaleData(), this._data.length;
    }),
    (qe.prototype.getCapacity = function () {
      return 0 === this._period
        ? this._interval
        : Math.ceil(this._interval / this._period);
    }),
    (qe.prototype.push = function (e, t) {
      this._cleanStaleData();
      var n = 0 === this._date.length;
      if (
        (e - (this._date[this._date.length - 1] || 0) >= this._period &&
          (this._date.push(e), this._data.push(t)),
        !n)
      ) {
        var r = e - this._prevTimestamp;
        (this._meanPeriod =
          (this._meanPeriod * this._meanCounter + r) / (this._meanCounter + 1)),
          this._meanCounter++,
          (this._medianPeriod = this._calculateMedianPeriod(r));
      }
      this._prevTimestamp = e;
    }),
    (qe.prototype._calculateMedianPeriod = function (e) {
      this._medianMaxHeap || (this._medianMaxHeap = []),
        this._medianMinHeap || (this._medianMinHeap = []);
      var t = this._fetchMedianPeriod();
      return (
        0 === this._medianMaxHeap.length && 0 === this._medianMinHeap.length
          ? this._medianMaxHeap.push(e)
          : e <= t
          ? (this._medianMaxHeap.push(e),
            this._medianMaxHeap.sort(function (e, t) {
              return t - e;
            }))
          : (this._medianMinHeap.push(e),
            this._medianMinHeap.sort(function (e, t) {
              return e - t;
            })),
        this._rebalanceHeaps(),
        this._fetchMedianPeriod()
      );
    }),
    (qe.prototype._rebalanceHeaps = function () {
      var e = null;
      this._medianMaxHeap.length > this._medianMinHeap.length + 1
        ? ((e = this._medianMaxHeap.shift()),
          this._medianMinHeap.push(e),
          this._medianMinHeap.sort(function (e, t) {
            return e - t;
          }))
        : this._medianMinHeap.length > this._medianMaxHeap.length + 1 &&
          ((e = this._medianMinHeap.shift()),
          this._medianMaxHeap.push(e),
          this._medianMaxHeap.sort(function (e, t) {
            return t - e;
          })),
        this._medianMinHeap.length == this._medianMaxHeap.length &&
          this._medianMaxHeap.length > this._medianMaxHeapSize &&
          (this._medianMinHeap.pop(), this._medianMaxHeap.pop());
    }),
    (qe.prototype._fetchMedianPeriod = function () {
      return this._medianMaxHeap.length > this._medianMinHeap.length
        ? this._medianMaxHeap[0]
        : this._medianMinHeap.length > this._medianMaxHeap.length
        ? this._medianMinHeap[0]
        : 0 !== this._medianMaxHeap.length && 0 !== this._medianMinHeap.length
        ? (this._medianMaxHeap[0] + this._medianMinHeap[0]) / 2
        : -1;
    }),
    (qe.prototype._cleanStaleData = function () {
      for (
        var e = Date.now() - this._baseTime, t = this._date.length - 1;
        t >= 0;
        t--
      ) {
        if (e - this._date[t] >= this._interval) {
          this._date.splice(0, t + 1), this._data.splice(0, t + 1);
          break;
        }
      }
    });
  var at,
    st = {
      UUID: function (e) {
        return (
          /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(
            e
          ) || !1
        );
      },
      UUIDv4: function (e) {
        return (
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            e
          ) || !1
        );
      },
      URL: function (e) {
        var t = new RegExp("^(http|https)://"),
          n = new RegExp("^((?!(data|javascript):).)*$");
        return t.test(e) && n.test(e) && -1 === e.indexOf("#");
      },
      IMAGE: function (e) {
        return (
          (0 === e.indexOf("https://") || 0 === e.indexOf("/")) &&
          e.endsWith(".png")
        );
      },
    };
  function ct(e) {
    var t,
      n,
      r = "string" == typeof e ? e : JSON.stringify(e),
      i = -1;
    for (
      at =
        at ||
        (function () {
          var e,
            t,
            n,
            r = [];
          for (t = 0; t < 256; t++) {
            for (e = t, n = 0; n < 8; n++)
              e = 1 & e ? 3988292384 ^ (e >>> 1) : e >>> 1;
            r[t] = e;
          }
          return r;
        })(),
        t = 0,
        n = r.length;
      t < n;
      t += 1
    )
      i = (i >>> 8) ^ at[255 & (i ^ r.charCodeAt(t))];
    return (-1 ^ i) >>> 0;
  }
  var lt = {
    __proto__: null,
    createErrorsAggregator: Fe,
    uuid: function () {
      return Math.random().toString(36).substr(2);
    },
    Render: Le,
    JWT: Ze,
    Color: Ye,
    Shuffle: Be,
    MathUtil: Xe,
    Storage: Ne,
    Query: $e,
    TimeBuffer: qe,
    PromiseUtil: {
      __proto__: null,
      promiseRecursive: Qe,
      promiseRetry: et,
      promiseRetryWithCancel: tt,
      withTimeout: nt,
    },
    ErrorUtil: He,
    _stackTraceSet: Ue,
    refineLine: Te,
    toRefinedString: Oe,
    reportError: Me,
    errorWrapper: Pe,
    initSentry: Ae,
    sentryMessage: je,
    sentryError: De,
    sentryBreadcrumb: Ge,
    renderFallback: Se,
    forEachCaptchaNode: Ee,
    callUserFunction: it,
    composeParams: ot,
    is: st,
    promiseRecursive: Qe,
    promiseRetry: et,
    promiseRetryWithCancel: tt,
    withTimeout: nt,
    crc32: ct,
    TaskContext: {
      container: {},
      set: function (e, t) {
        this.container[e] = t;
      },
      clear: function () {
        this.container = {};
      },
    },
  };
  function ut(e) {
    try {
      if (!e) throw new Error("Event object is required");
      if (e.touches || e.changedTouches) {
        var t =
          e.touches && e.touches.length >= 1 ? e.touches : e.changedTouches;
        if (t && t[0])
          return (t[0].x = t[0].clientX), (t[0].y = t[0].clientY), t[0];
      }
      var n = "number" == typeof e.pageX && "number" == typeof e.pageY,
        r = "number" == typeof e.clientX && "number" == typeof e.clientY;
      return n
        ? { x: e.pageX, y: e.pageY }
        : r
        ? { x: e.clientX, y: e.clientY }
        : null;
    } catch (tr) {
      return console.error("Error: Get pointer coords failed", tr), null;
    }
  }
  function ht(e, t) {
    var n = e;
    "down" === e || "up" === e || "move" === e || "over" === e || "out" === e
      ? (n =
          !((ee.System.mobile && "desktop" !== t) || "mobile" === t) ||
          ("down" !== e && "up" !== e && "move" !== e)
            ? "mouse" + e
            : "down" === e
            ? "touchstart"
            : "up" === e
            ? "touchend"
            : "touchmove")
      : "enter" === e && (n = "keydown");
    return n;
  }
  function pt(e, t, n, r) {
    var i = ht(t),
      o = t,
      a = 0,
      s = 0,
      c = t.indexOf("swipe") >= 0,
      l = 0;
    function u(e) {
      var t = ut(e);
      (a = t.pageX), (s = t.pageY), (l = Date.now());
    }
    function h(t) {
      var r,
        o,
        c = ut(t),
        u = c.pageX - a,
        h = c.pageY - s,
        p = Date.now() - l;
      if (
        !(p > 300) &&
        (u <= -25 ? (r = "swipeleft") : u >= 25 && (r = "swiperight"),
        h <= -25 ? (o = "swipeup") : h >= 25 && (o = "swipedown"),
        i === r || i === o)
      ) {
        var d = r === i ? r : o;
        (t.action = d),
          (t.targetElement = e),
          (t.swipeSpeed = Math.sqrt(u * u + h * h) / p),
          (t.deltaX = u),
          (t.deltaY = h),
          n(t);
      }
    }
    function p(r) {
      var i = (function (e) {
        var t = e.type;
        return (
          "touchstart" === t || "mousedown" === t
            ? (t = "down")
            : "touchmove" === t || "mousemove" === t
            ? (t = "move")
            : "touchend" === t || "mouseup" === t
            ? (t = "up")
            : "mouseover" === t
            ? (t = "over")
            : "mouseout" === t && (t = "out"),
          t
        );
      })(r);
      if (
        ((r = r || window.event),
        "down" === i ||
          "move" === i ||
          "up" === i ||
          "over" === i ||
          "out" === i ||
          "click" === i)
      ) {
        var o = ut(r);
        if (!o) return;
        var a = e.getBoundingClientRect();
        (r.windowX = o.x),
          (r.windowY = o.y),
          (r.elementX = r.windowX - (a.x || a.left)),
          (r.elementY = r.windowY - (a.y || a.top));
      }
      (r.keyNum = r.which || r.keyCode || 0),
        ("enter" === t && 13 !== r.keyNum && 32 !== r.keyNum) ||
          ((r.action = i), (r.targetElement = e), n(r));
    }
    return (
      r || (r = {}),
      c
        ? (function () {
            if (!("addEventListener" in e)) return;
            e.addEventListener("mousedown", u, r),
              e.addEventListener("mouseup", h, r),
              e.addEventListener("touchstart", u, r),
              e.addEventListener("touchend", h, r);
          })()
        : (function () {
            if (!("addEventListener" in e))
              return void e.attachEvent("on" + i, p);
            e.addEventListener(i, p, r);
          })(),
      {
        event: i,
        rawEvent: o,
        callback: n,
        remove: function () {
          c
            ? (e.removeEventListener("mousedown", u, r),
              e.removeEventListener("mouseup", h, r),
              e.removeEventListener("touchstart", u, r),
              e.removeEventListener("touchend", h, r))
            : "removeEventListener" in e
            ? e.removeEventListener(i, p, r)
            : e.detachEvent("on" + i, p);
        },
      }
    );
  }
  var dt = ["Webkit", "Moz", "ms"],
    ft = document.createElement("div").style,
    mt = {};
  function gt(e) {
    var t = mt[e];
    return (
      t ||
      (e in ft
        ? e
        : (mt[e] =
            (function (e) {
              for (
                var t = e[0].toUpperCase() + e.slice(1), n = dt.length;
                n--;

              )
                if ((e = dt[n] + t) in ft) return e;
            })(e) || e))
    );
  }
  function yt(e, t, n) {
    if (
      ((this.dom = null),
      (this._clss = []),
      (this._nodes = []),
      (this._listeners = []),
      (this._frag = null),
      e && "object" == typeof e)
    ) {
      this.dom = e;
      var r = [],
        i = [];
      "string" == typeof e.className && (i = e.className.split(" "));
      for (var o = 0; o < i.length; o++)
        "" !== i[o] && " " !== i[o] && r.push(i[o]);
      this._clss = r;
    } else
      (n !== undefined && null !== n) || (n = !0),
        (!e ||
          ("string" == typeof e &&
            (e.indexOf("#") >= 0 || e.indexOf(".") >= 0))) &&
          (e && (t = e), (e = "div")),
        (this.dom = document.createElement(e)),
        t &&
          (t.indexOf("#") >= 0
            ? (this.dom.id = t.split("#")[1])
            : (t.indexOf(".") >= 0 && (t = t.split(".")[1]),
              this.addClass.call(this, t)));
    !0 === n &&
      ((this._frag = document.createDocumentFragment()),
      this._frag.appendChild(this.dom));
  }
  (yt.prototype.cloneNode = function (e) {
    try {
      return this.dom.cloneNode(e);
    } catch (nr) {
      return De("element", nr), null;
    }
  }),
    (yt.prototype.createElement = function (e, t) {
      try {
        var n = new yt(e, t, !1);
        return this.appendElement.call(this, n), this._nodes.push(n), n;
      } catch (nr) {
        return De("element", nr), null;
      }
    }),
    (yt.prototype.appendElement = function (e) {
      if (e === undefined)
        return Me({
          name: "DomElement Add Child",
          message: "Child Element is undefined",
        });
      var t;
      t =
        e._frag !== undefined && null !== e._frag
          ? e._frag
          : e.dom !== undefined
          ? e.dom
          : e;
      try {
        e instanceof yt && (e._parent = this), this.dom.appendChild(t);
      } catch (nr) {
        Me({
          name: "DomElement Add Child",
          message: "Failed to append child.",
        });
      }
      return this;
    }),
    (yt.prototype.removeElement = function (e) {
      try {
        var t;
        if (e._nodes)
          for (t = e._nodes.length; t--; ) e.removeElement(e._nodes[t]);
        for (t = this._nodes.length; --t > -1; )
          this._nodes[t] === e && this._nodes.splice(t, 1);
        var n = e instanceof yt ? e.dom : e,
          r = n.parentNode === this.dom ? this.dom : n.parentNode;
        if ((r.removeChild && r.removeChild(n), !r))
          throw new Error("Child component does not have correct setup");
        e.__destroy && e.__destroy();
      } catch (nr) {
        Me({
          name: "DomElement Remove Child",
          message: nr.message || "Failed to remove child.",
        });
      }
    }),
    (yt.prototype.addClass = function (e) {
      return (
        !1 === this.hasClass.call(this, e) &&
          (this._clss.push(e), (this.dom.className = this._clss.join(" "))),
        this
      );
    }),
    (yt.prototype.hasClass = function (e) {
      for (
        var t = -1 !== this.dom.className.split(" ").indexOf(e),
          n = this._clss.length;
        n-- && !t;

      )
        t = this._clss[n] === e;
      return t;
    }),
    (yt.prototype.removeClass = function (e) {
      for (var t = this._clss.length; --t > -1; )
        this._clss[t] === e && this._clss.splice(t, 1);
      return (this.dom.className = this._clss.join(" ")), this;
    }),
    (yt.prototype.text = function (e) {
      if (this && this.dom) {
        if (!e) return this.dom.textContent;
        for (
          var t, n, r, i, o = /&(.*?);/g, a = /<[a-z][\s\S]*>/i;
          null !== (t = o.exec(e));

        ) {
          !1 === a.test(t[0])
            ? ((r = t[0]),
              (i = void 0),
              ((i = document.createElement("div")).innerHTML = r),
              (n = i.textContent),
              (e = e.replace(new RegExp(t[0], "g"), n)))
            : (e = e.replace(t[0], ""));
        }
        return (this.dom.textContent = e), this;
      }
    }),
    (yt.prototype.content = yt.prototype.text),
    (yt.prototype.css = function (e) {
      var t,
        n = "ie" === ee.Browser.type && 8 === ee.Browser.version,
        r =
          "safari" === ee.Browser.type && 12 === Math.floor(ee.Browser.version);
      for (var i in e) {
        t = e[i];
        try {
          if ("transition" === i && r) continue;
          "opacity" !== i &&
            "zIndex" !== i &&
            "fontWeight" !== i &&
            isFinite(t) &&
            parseFloat(t) === t &&
            (t += "px");
          var o = gt(i);
          n && "opacity" === i
            ? (this.dom.style.filter = "alpha(opacity=" + 100 * t + ")")
            : n && Ye.hasAlpha(t)
            ? (this.dom.style[o] = new Ye(t).getHex())
            : (this.dom.style[o] = t);
        } catch (tr) {}
      }
      return this;
    }),
    (yt.prototype.backgroundImage = function (e, t, n, r) {
      var i = t !== undefined && n !== undefined,
        o = { "-ms-high-contrast-adjust": "none" };
      if (("object" == typeof t && (r = t), r === undefined && (r = {}), i)) {
        var a = e.width / e.height,
          s = t,
          c = s / a;
        r.cover && c < n && (s = (c = n) * a),
          r.contain && c > n && (s = (c = n) * a),
          (o.width = s),
          (o.height = c),
          r.center &&
            ((o.marginLeft = -s / 2),
            (o.marginTop = -c / 2),
            (o.position = "absolute"),
            (o.left = "50%"),
            (o.top = "50%")),
          (r.left || r.right) && ((o.left = r.left || 0), (o.top = r.top || 0));
      }
      "ie" === ee.Browser.type && 8 === ee.Browser.version
        ? (o.filter =
            "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
            e.src +
            "',sizingMethod='scale')")
        : ((o.background = "url(" + e.src + ")"),
          (o.backgroundPosition = "50% 50%"),
          (o.backgroundRepeat = "no-repeat"),
          (o.backgroundSize = i
            ? s + "px " + c + "px"
            : r.cover
            ? "cover"
            : r.contain
            ? "contain"
            : "100%")),
        this.css.call(this, o);
    }),
    (yt.prototype.setAttribute = function (e, t) {
      var n;
      if ("object" == typeof e)
        for (var r in e) (n = e[r]), this.dom.setAttribute(r, n);
      else this.dom.setAttribute(e, t);
    }),
    (yt.prototype.removeAttribute = function (e, t) {
      var n;
      if ("object" == typeof e)
        for (var r in e) (n = e[r]), this.dom.removeAttribute(r, n);
      else this.dom.removeAttribute(e, t);
    }),
    (yt.prototype.addEventListener = function (e, t, n) {
      var r = new pt(this.dom, e, t, n);
      if (
        (this._listeners.push(r),
        e !== r.event &&
          (r.event.indexOf("mouse") >= 0 || r.event.indexOf("touch") >= 0))
      ) {
        var i = ht(e, r.event.indexOf("touch") >= 0 ? "desktop" : "mobile");
        if (i === r.event) return;
        this.addEventListener.call(this, i, t, n);
      }
    }),
    (yt.prototype.removeEventListener = function (e, t, n) {
      for (var r, i = this._listeners.length, o = ht(e); --i > -1; )
        (r = this._listeners[i]).event === o &&
          r.callback === t &&
          (this._listeners.splice(i, 1), r.remove());
    }),
    (yt.prototype.focus = function () {
      this.dom.focus();
    }),
    (yt.prototype.blur = function () {
      this.dom.blur();
    }),
    (yt.prototype.html = function (e) {
      return e && (this.dom.innerHTML = e), this.dom.innerHTML;
    }),
    (yt.prototype.__destroy = function () {
      for (var e, t = this._listeners.length; --t > -1; )
        (e = this._listeners[t]),
          this._listeners.splice(t, 1),
          this.dom.removeEventListener
            ? this.dom.removeEventListener(e.event, e.handler)
            : this.dom.detachEvent("on" + e.event, e.handler);
      return (
        (this.dom = null),
        (this._clss = []),
        (this._nodes = []),
        (this._listeners = []),
        (this._frag = null),
        (e = null),
        null
      );
    }),
    (yt.prototype.isConnected = function () {
      return (
        !!this.dom &&
        ("isConnected" in this.dom
          ? this.dom.isConnected
          : !(
              this.dom.ownerDocument &&
              this.dom.ownerDocument.compareDocumentPosition(this.dom) &
                this.dom.DOCUMENT_POSITION_DISCONNECTED
            ))
      );
    });
  var vt = {
    eventName: function (e, t) {
      var n = e;
      "down" === e || "up" === e || "move" === e || "over" === e || "out" === e
        ? (n =
            !((ee.System.mobile && "desktop" !== t) || "mobile" === t) ||
            ("down" !== e && "up" !== e && "move" !== e)
              ? "mouse" + e
              : "down" === e
              ? "touchstart"
              : "up" === e
              ? "touchend"
              : "touchmove")
        : "enter" === e && (n = "keydown");
      return n;
    },
    actionName: function (e) {
      var t = e;
      return (
        "touchstart" === t || "mousedown" === t
          ? (t = "down")
          : "touchmove" === t || "mousemove" === t
          ? (t = "move")
          : "touchend" === t || "mouseup" === t
          ? (t = "up")
          : "mouseover" === t
          ? (t = "over")
          : "mouseout" === t && (t = "out"),
        t
      );
    },
    eventCallback: function (e, t, n) {
      var r = vt.actionName(e);
      return function (i) {
        if (
          ((i = i || window.event),
          "down" === r ||
            "move" === r ||
            "up" === r ||
            "over" === r ||
            "out" === r ||
            "click" === r)
        ) {
          var o = vt.eventCoords(i);
          if (!o) return;
          var a = n.getBoundingClientRect();
          (i.windowX = o.x),
            (i.windowY = o.y),
            (i.elementX = i.windowX - (a.x || a.left)),
            (i.elementY = i.windowY - (a.y || a.top));
        }
        (i.keyNum = i.which || i.keyCode || 0),
          ("enter" === e && 13 !== i.keyNum && 32 !== i.keyNum) ||
            ((i.action = r), (i.targetElement = n), t(i));
      };
    },
    eventCoords: function (e) {
      if (!e) return null;
      var t = e;
      if (e.touches || e.changedTouches) {
        var n =
          e.touches && e.touches.length >= 1 ? e.touches : e.changedTouches;
        n && n[0] && (t = n[0]);
      }
      return "number" == typeof t.pageX && "number" == typeof t.pageY
        ? { x: t.pageX, y: t.pageY }
        : "number" == typeof t.clientX && "number" == typeof t.clientY
        ? { x: t.clientX, y: t.clientY }
        : null;
    },
  };
  function bt(e) {
    if (null === e) return "";
    var t = [];
    return wt(e, t), t.join("&");
  }
  function wt(e, t) {
    var n, r;
    if ("object" == typeof e)
      for (r in e) !0 === _t((n = e[r])) ? wt(n, t) : (t[t.length] = St(r, n));
    else if (!0 === Array.isArray(e))
      for (var i = 0; i < e.length; i++)
        !0 === _t((n = e[i])) ? wt(e, t) : (t[t.length] = St(r, n));
    else t[t.length] = St(e);
  }
  function _t(e) {
    return !0 === Array.isArray(e) || "object" == typeof e;
  }
  function St(e, t) {
    return (
      encodeURIComponent(e) + "=" + encodeURIComponent(null === t ? "" : t)
    );
  }
  var Et = {
      af: "Afrikaans",
      sq: "Albanian",
      am: "Amharic",
      ar: "Arabic",
      hy: "Armenian",
      az: "Azerbaijani",
      eu: "Basque",
      be: "Belarusian",
      bn: "Bengali",
      bg: "Bulgarian",
      bs: "Bosnian",
      my: "Burmese",
      ca: "Catalan",
      ceb: "Cebuano",
      zh: "Chinese",
      "zh-CN": "Chinese Simplified",
      "zh-TW": "Chinese Traditional",
      co: "Corsican",
      hr: "Croatian",
      cs: "Czech",
      da: "Danish",
      nl: "Dutch",
      en: "English",
      eo: "Esperanto",
      et: "Estonian",
      fi: "Finnish",
      fr: "French",
      fy: "Frisian",
      gd: "Gaelic",
      gl: "Galacian",
      ka: "Georgian",
      de: "German",
      el: "Greek",
      gu: "Gujurati",
      ht: "Haitian",
      ha: "Hausa",
      haw: "Hawaiian",
      he: "Hebrew",
      hi: "Hindi",
      hmn: "Hmong",
      hu: "Hungarian",
      is: "Icelandic",
      ig: "Igbo",
      id: "Indonesian",
      ga: "Irish",
      it: "Italian",
      ja: "Japanese",
      jw: "Javanese",
      kn: "Kannada",
      kk: "Kazakh",
      km: "Khmer",
      rw: "Kinyarwanda",
      ky: "Kirghiz",
      ko: "Korean",
      ku: "Kurdish",
      lo: "Lao",
      la: "Latin",
      lv: "Latvian",
      lt: "Lithuanian",
      lb: "Luxembourgish",
      mk: "Macedonian",
      mg: "Malagasy",
      ms: "Malay",
      ml: "Malayalam",
      mt: "Maltese",
      mi: "Maori",
      mr: "Marathi",
      mn: "Mongolian",
      ne: "Nepali",
      no: "Norwegian",
      ny: "Nyanja",
      or: "Oriya",
      fa: "Persian",
      pl: "Polish",
      "pt-BR": "Portuguese (Brazil)",
      pt: "Portuguese (Portugal)",
      ps: "Pashto",
      pa: "Punjabi",
      ro: "Romanian",
      ru: "Russian",
      sm: "Samoan",
      sn: "Shona",
      sd: "Sindhi",
      si: "Sinhalese",
      sr: "Serbian",
      sk: "Slovak",
      sl: "Slovenian",
      so: "Somali",
      st: "Southern Sotho",
      es: "Spanish",
      su: "Sundanese",
      sw: "Swahili",
      sv: "Swedish",
      tl: "Tagalog",
      tg: "Tajik",
      ta: "Tamil",
      tt: "Tatar",
      te: "Teluga",
      th: "Thai",
      tr: "Turkish",
      tk: "Turkmen",
      ug: "Uyghur",
      uk: "Ukrainian",
      ur: "Urdu",
      uz: "Uzbek",
      vi: "Vietnamese",
      cy: "Welsh",
      xh: "Xhosa",
      yi: "Yiddish",
      yo: "Yoruba",
      zu: "Zulu",
    },
    kt = {
      zh: { "I am human": "æˆ‘æ˜¯çœŸå®žè®¿å®¢" },
      ar: { "I am human": "Ø£Ù†Ø§ Ø§Ù„Ø¥Ù†Ø³Ø§Ù†" },
      af: { "I am human": "Ek is menslike" },
      am: { "I am human": "áŠ¥áŠ” áˆ°á‹ áŠáŠ" },
      hy: { "I am human": "ÔµÕ½ Õ´Õ¡Ö€Õ¤ Õ¥Õ´" },
      az: { "I am human": "MÉ™n insanam" },
      eu: { "I am human": "Gizakia naiz" },
      bn: { "I am human": "à¦†à¦®à¦¿ à¦®à¦¾à¦¨à¦¬ à¦¨à¦‡" },
      bg: { "I am human": "ÐÐ· ÑÑŠÐ¼ Ñ‡Ð¾Ð²ÐµÐº" },
      ca: { "I am human": "SÃ³c humÃ " },
      hr: { "I am human": "Ja sam Äovjek" },
      cs: { "I am human": "Jsem ÄlovÄ›k" },
      da: { "I am human": "Jeg er et menneske" },
      nl: { "I am human": "Ik ben een mens" },
      et: { "I am human": "Ma olen inimeste" },
      fi: { "I am human": "Olen ihminen" },
      fr: { "I am human": "Je suis humain" },
      gl: { "I am human": "Eu son humano" },
      ka: { "I am human": "áƒ›áƒ” áƒ•áƒáƒ  áƒáƒ“áƒáƒ›áƒ˜áƒáƒœáƒ˜" },
      de: { "I am human": "Ich bin ein Mensch" },
      el: { "I am human": "Î•Î¯Î¼Î±Î¹ Î¬Î½Î¸ÏÏ‰Ï€Î¿Ï‚" },
      gu: { "I am human": "àª¹à«àª‚ àª®àª¾àª¨àªµ àª›à«àª‚" },
      iw: { "I am human": ". ×× ×™ ×× ×•×©×™" },
      hi: { "I am human": "à¤®à¥ˆà¤‚ à¤®à¤¾à¤¨à¤µ à¤¹à¥‚à¤‚" },
      hu: { "I am human": "Nem vagyok robot" },
      is: { "I am human": "Ã‰g er manneskja" },
      id: { "I am human": "Aku manusia" },
      it: { "I am human": "Sono un essere umano" },
      ja: { "I am human": "ç§ã¯äººé–“ã§ã™" },
      kn: { "I am human": "à²¨à²¾à²¨à³ à²®à²¾à²¨à²µà²¨à³" },
      ko: { "I am human": "ì‚¬ëžŒìž…ë‹ˆë‹¤" },
      lo: { "I am human": "àº‚à»‰àº­àºà»€àº›àº±àº™àº¡àº°àº™àº¸àº”" },
      lv: { "I am human": "Es esmu cilvÄ“ks" },
      lt: { "I am human": "AÅ¡ esu Å¾mogaus" },
      ms: { "I am human": "Saya manusia" },
      ml: { "I am human": "à´žà´¾àµ» à´®à´¨àµà´·àµà´¯à´¨à´¾à´£àµ" },
      mr: { "I am human": "à¤®à¥€ à¤®à¤¾à¤¨à¤µà¥€ à¤†à¤¹à¥‡" },
      mn: { "I am human": "Ð‘Ð¸ Ð±Ð¾Ð» Ñ…Ò¯Ð½" },
      no: { "I am human": "Jeg er menneskelig" },
      fa: { "I am human": "Ù…Ù† Ø§Ù†Ø³Ø§Ù†ÛŒ Ù‡Ø³ØªÙ…" },
      pl: { "I am human": "Jestem czÅ‚owiekiem" },
      pt: { "I am human": "Sou humano" },
      ro: { "I am human": "Eu sunt om" },
      ru: { "I am human": "Ð¯ Ñ‡ÐµÐ»Ð¾Ð²ÐµÐº" },
      sr: { "I am human": "Ja sam ljudski" },
      si: { "I am human": "à¶¸à¶¸ à¶¸à·’à¶±à·’à·ƒà·Šà·ƒà·”" },
      sk: { "I am human": "Ja som Älovek" },
      sl: { "I am human": "Jaz sem ÄloveÅ¡ki" },
      es: { "I am human": "Soy humano" },
      sw: { "I am human": "Mimi ni binadamu" },
      sv: { "I am human": "Jag Ã¤r mÃ¤nniska" },
      ta: { "I am human": "à®¨à®¾à®©à¯ à®®à®©à®¿à®¤" },
      te: { "I am human": "à°¨à±‡à°¨à± à°®à°¨à°¿à°·à°¿à°¨à°¿" },
      th: { "I am human": "à¸œà¸¡à¸¡à¸™à¸¸à¸©à¸¢à¹Œ" },
      tr: { "I am human": "Ben bir insanÄ±m" },
      uk: { "I am human": "Ð¯ Ð»ÑŽÐ´Ð¸Ð½Ð¸" },
      ur: { "I am human": "Ù…ÛŒÚº Ø§Ù†Ø³Ø§Ù† ÛÙˆÚº" },
      vi: { "I am human": "TÃ´i lÃ  con ngÆ°á»i" },
      zu: { "I am human": "Ngingumuntu" },
    },
    Ut = null,
    xt = {
      translate: function (e, t) {
        var n = xt.getBestTrans(kt),
          r = n && n[e];
        if (((r = r || e), t))
          for (var i = Object.keys(t), o = i.length; o--; )
            r = r.replace(new RegExp("{{" + i[o] + "}}", "g"), t[i[o]]);
        return r;
      },
      getBestTrans: function (e) {
        var t = xt.getLocale();
        return t in e
          ? e[t]
          : xt.getShortLocale(t) in e
          ? e[xt.getShortLocale(t)]
          : "en" in e
          ? e.en
          : null;
      },
      resolveLocale: function (e) {
        var t = xt.getShortLocale(e);
        return (
          "in" === t && (e = "id"),
          "iw" === t && (e = "he"),
          "nb" === t && (e = "no"),
          "ji" === t && (e = "yi"),
          "zh-CN" === e && (e = "zh"),
          "jv" === t && (e = "jw"),
          "me" === t && (e = "bs"),
          Et[e] ? e : Et[t] ? t : "en"
        );
      },
      getLocale: function () {
        return xt.resolveLocale(
          Ut || window.navigator.userLanguage || window.navigator.language
        );
      },
      setLocale: function (e) {
        "zh-Hans" === e ? (e = "zh-CN") : "zh-Hant" === e && (e = "zh-TW"),
          (Ut = e);
      },
      getShortLocale: function (e) {
        return e.indexOf("-") >= 0 ? e.substring(0, e.indexOf("-")) : e;
      },
      getLangName: function (e) {
        return Et[e];
      },
      isShortLocale: function (e) {
        return 2 === e.length || 3 === e.length;
      },
      addTable: function (e, t) {
        if ((t || (t = Object.create(null)), kt[e])) {
          var n = kt[e];
          for (var r in t) n[r] = t[r];
        } else kt[e] = t;
        return kt[e];
      },
      getTable: function (e) {
        return kt[e];
      },
      addTables: function (e) {
        for (var t in e) xt.addTable(t, e[t]);
        return kt;
      },
      getTables: function () {
        return kt;
      },
    },
    Vt = {
      400: "Rate limited or network error. Please retry.",
      429: "Your computer or network has sent too many requests.",
      500: "Cannot contact hCaptcha. Check your connection and try again.",
    },
    Rt = function (e) {
      try {
        return xt.translate(Vt[e]);
      } catch (nr) {
        return !1;
      }
    },
    Wt =
      "undefined" != typeof XDomainRequest &&
      !("withCredentials" in XMLHttpRequest.prototype);
  function Tt(e, t, n) {
    n = n || {};
    var r = {
      url: t,
      method: e.toUpperCase(),
      responseType: n.responseType || "string",
      dataType: n.dataType || null,
      withCredentials: n.withCredentials || !1,
      headers: n.headers || null,
      data: n.data || null,
      timeout: n.timeout || null,
      pst: n.pst || null,
    };
    r.legacy = r.withCredentials && Wt;
    var i = "fetch" in window && r.pst ? Ct : Ot;
    return n.retry
      ? (n.retry.cancellable || !1 ? tt : et)(function () {
          return (
            n.data &&
              ((r.data = "function" == typeof n.data ? n.data() : n.data),
              "json" === r.dataType && "object" == typeof r.data
                ? (r.data = JSON.stringify(r.data))
                : "query" === r.dataType && (r.data = bt(r.data))),
            i(r)
          );
        }, n.retry)
      : (n.data &&
          ((r.data = "function" == typeof n.data ? n.data() : n.data),
          "json" === r.dataType && "object" == typeof r.data
            ? (r.data = JSON.stringify(r.data))
            : "query" === r.dataType && (r.data = bt(r.data))),
        i(r));
  }
  function Ot(e) {
    var t = e.legacy ? new XDomainRequest() : new XMLHttpRequest(),
      n = "function" == typeof e.url ? e.url() : e.url;
    return new Promise(function (r, i) {
      var o,
        a = function (o) {
          return function () {
            var a = t.response,
              s = t.statusText || "",
              c = t.status,
              l = t.readyState;
            if (
              (a ||
                ("" !== t.responseType && "text" !== t.responseType) ||
                (a = t.responseText),
              4 === l || e.legacy)
            ) {
              try {
                if (a) {
                  var u = t.contentType;
                  t.getResponseHeader &&
                    (u = t.getResponseHeader("content-type"));
                  var h =
                    -1 !==
                    (u = u ? u.toLowerCase() : "").indexOf("application/json");
                  if (
                    ("ArrayBuffer" in window &&
                      a instanceof ArrayBuffer &&
                      h &&
                      (a = new TextDecoder().decode(new Uint8Array(a))),
                    "string" == typeof a)
                  )
                    try {
                      a = JSON.parse(a);
                    } catch (p) {
                      h &&
                        De("http", p, {
                          url: n,
                          config: e,
                          responseType: t.responseType,
                          contentType: u,
                          response: a,
                        });
                    }
                }
              } catch (p) {
                return (
                  De("http", p, { contentType: u }),
                  void i({
                    event: ce,
                    endpoint: n,
                    response: a,
                    state: l,
                    status: c,
                    message: Rt(c || 400) || s,
                  })
                );
              }
              if ("error" === o || (c >= 400 && c <= 511))
                return void i({
                  event: ce,
                  endpoint: n,
                  response: a,
                  state: l,
                  status: c,
                  message: (409 === c && a.error) || Rt(c || 400) || s,
                });
              r({ state: l, status: c, body: a, message: s });
            }
          };
        };
      if (
        ((t.onload = a("complete")),
        (t.onerror = t.ontimeout = a("error")),
        t.open(e.method, n),
        "arraybuffer" === e.responseType &&
          (!e.legacy && "TextDecoder" in window && "ArrayBuffer" in window
            ? (t.responseType = "arraybuffer")
            : ((e.responseType = "json"),
              (e.headers.accept = "application/json"))),
        e.timeout &&
          (t.timeout =
            "function" == typeof e.timeout ? e.timeout(n) : e.timeout),
        !e.legacy) &&
        ((t.withCredentials = e.withCredentials), e.headers)
      )
        for (var s in e.headers) (o = e.headers[s]), t.setRequestHeader(s, o);
      setTimeout(function () {
        t.send(e.data);
      }, 0);
    });
  }
  function Ct(e) {
    var t,
      n = "function" == typeof e.url ? e.url() : e.url,
      r = new Headers();
    if (
      ("json" === e.responseType && r.set("content-type", "application/json"),
      e.headers)
    )
      for (var i in e.headers) (t = e.headers[i]), r.set(i, t);
    var o = {
      method: e.method,
      credentials: "include",
      body: e.data,
      headers: r,
    };
    if (e.pst) {
      var a = {};
      "token-request" === e.pst
        ? (a = { version: 1, operation: "token-request" })
        : "token-redemption" === e.pst
        ? (a = {
            version: 1,
            operation: "token-redemption",
            refreshPolicy: "refresh",
          })
        : "send-redemption-record" === e.pst &&
          (a = {
            version: 1,
            operation: "send-redemption-record",
            issuers: [ve.pstIssuer],
          }),
        (o.privateToken = a);
    }
    return new Promise(function (t, r) {
      fetch(n, o)
        .then(function (i) {
          return 200 !== i.status
            ? r({
                event: ce,
                endpoint: n,
                response: i,
                state: 4,
                status: i.status,
                message: Rt(i.status || 400),
              })
            : ("arraybuffer" === e.responseType
                ? i.arrayBuffer()
                : "json" === e.responseType
                ? i.json()
                : i.text()
              ).then(function (e) {
                t({
                  state: 4,
                  status: i.status,
                  body: e,
                  message: Rt(i.status || 400),
                });
              });
        })
        ["catch"](function (e) {
          r({
            event: ce,
            endpoint: n,
            response: e.error,
            state: 4,
            status: 400,
            message: Rt(400),
          });
        });
    });
  }
  var Mt = function (e, t) {
      if (
        ("object" == typeof e && t === undefined && (e = (t = e).url),
        null === e)
      )
        throw new Error("Url missing");
      return Tt("GET", e, t);
    },
    Pt = ["svg", "gif", "png"];
  function At(e, t) {
    t = t || {};
    var n,
      r = e;
    if (0 === r.indexOf("data:image"))
      for (var i = !1, o = Pt.length, a = -1; a++ < o && !i; )
        (i = r.indexOf(Pt[a]) >= 0) && (n = Pt[a]);
    else n = r.substr(r.lastIndexOf(".") + 1, r.length);
    !!(
      !document.createElementNS ||
      !document.createElementNS("http://www.w3.org/2000/svg", "svg")
        .createSVGRect
    ) &&
      t.fallback &&
      (t.fallback.indexOf(".") >= 0
        ? (n = (r = t.fallback).substr(r.lastIndexOf(".") + 1, r.length))
        : ((r = e.substr(0, e.indexOf(n)) + t.fallback), (n = t.fallback))),
      t.prefix && (r = t.prefix + "/" + r),
      (this.attribs = { crossOrigin: t.crossOrigin || null }),
      (this.id = r),
      (this.src = (function (e) {
        if (ve.assethost && 0 === e.indexOf(ye.assetDomain))
          return ve.assethost + e.replace(ye.assetDomain, "");
        if (ve.imghost && e.indexOf("imgs") >= 0) {
          var t =
            e.indexOf(".ai") >= 0
              ? e.indexOf(".ai") + 3
              : e.indexOf(".com") + 4;
          return ve.imghost + e.substr(t, e.length);
        }
        return e;
      })(r)),
      (this.ext = n),
      (this.width = 0),
      (this.height = 0),
      (this.aspect = 0),
      (this.loaded = !1),
      (this.error = !1),
      (this.element = null),
      (this.cb = { load: [], error: [] });
  }
  function jt(e, t, n) {
    for (var r = e[t], i = r.length, o = null; --i > -1; )
      (o = r[i]), r.splice(i, 1), o(n);
    "error" === t ? (e.load = []) : (e.error = []);
  }
  function Dt(e, t) {
    var n = e;
    t || (t = {}),
      t.prefix && (n = t.prefix + "/" + e),
      (this.attribs = {
        defer: t.defer || null,
        async: t.async || null,
        crossOrigin: t.crossOrigin || null,
        integrity: t.integrity || null,
      }),
      (this.id = n),
      (this.src = (function (e) {
        if (ve.assethost && 0 === e.indexOf(ye.assetDomain))
          return ve.assethost + e.replace(ye.assetDomain, "");
        return e;
      })(n)),
      (this.loaded = !1),
      (this.error = !1),
      (this.element = null),
      (this.cb = { load: [], error: [] });
  }
  function Gt(e, t, n) {
    for (var r = e[t], i = r.length, o = null; --i > -1; )
      (o = r[i]), r.splice(i, 1), o(n);
    "error" === t ? (e.load = []) : (e.error = []);
  }
  function Ht(e, t) {
    var n = e;
    t || (t = {}),
      t.prefix && (n = t.prefix + "/" + e),
      (this.responseType = t.responseType),
      (this.id = n),
      (this.src = (function (e) {
        if (ve.assethost && 0 === e.indexOf(ye.assetDomain))
          return ve.assethost + e.replace(ye.assetDomain, "");
        return e;
      })(n)),
      (this.loaded = !1),
      (this.error = !1),
      (this.cb = { load: [], error: [] }),
      (this.data = null);
  }
  function Ft(e, t, n) {
    for (var r = e[t], i = r.length, o = null; --i > -1; )
      (o = r[i]), r.splice(i, 1), o(n);
    "error" === t ? (e.load = []) : (e.error = []);
  }
  (At.prototype.load = function () {
    return ("svg" === this.ext ? this._loadSvg() : this._loadImg())["catch"](
      function (e) {
        throw (je("Asset failed", "error", "assets", { error: e }), e);
      }
    );
  }),
    (At.prototype._loadSvg = function () {
      var e,
        t = this,
        n = this.src,
        r = this.id;
      if (0 === n.indexOf("data:image/svg+xml")) {
        var i = n.slice("data:image/svg+xml,".length);
        e = Promise.resolve(decodeURIComponent(i));
      } else
        e = Mt(n).then(function (e) {
          return e.body;
        });
      return e
        .then(function (e) {
          var n = new DOMParser().parseFromString(
              e,
              "image/svg+xml"
            ).documentElement,
            r = parseInt(n.getAttribute("width")),
            i = parseInt(n.getAttribute("height"));
          return t._imgLoaded(n, r, i), t;
        })
        ["catch"](function (e) {
          t.error = !0;
          var n =
            (e && e.message ? e.message : e || "Loading Error") + ": " + r;
          throw (jt(t.cb, "error", n), n);
        });
    }),
    (At.prototype._loadImg = function () {
      var e = this,
        t = this.attribs,
        n = this.src,
        r = this.id;
      return new Promise(function (i, o) {
        function a() {
          e.loaded ||
            (e._imgLoaded(s, s.width, s.height),
            (s.onload = s.onerror = null),
            i(e));
        }
        var s = new Image();
        t.crossOrigin && (s.crossOrigin = t.crossOrigin),
          (s.onerror = function () {
            (e.error = !0), (s.onload = s.onerror = null);
            var t = "Loading Error: " + r;
            jt(e.cb, "error", t), o(t);
          }),
          (s.onload = a),
          (s.src = n),
          s.complete && a();
      });
    }),
    (At.prototype._imgLoaded = function (e, t, n) {
      (this.element = new yt(e)),
        (this.width = t),
        (this.height = n),
        (this.aspect = t / n),
        (this.loaded = !0),
        jt(this.cb, "load", this);
    }),
    (At.prototype.onload = function (e) {
      this.error || (this.loaded ? e(this) : this.cb.load.push(e));
    }),
    (At.prototype.onerror = function (e) {
      (this.loaded && !this.error) ||
        (this.error ? e(this) : this.cb.error.push(e));
    }),
    (Dt.prototype.load = function () {
      var e = this,
        t = this.attribs,
        n = this.src,
        r = this.id;
      return new Promise(function (i, o) {
        var a = document.createElement("script");
        (e.element = a),
          (a.onerror = function () {
            (e.error = !0),
              (a.onload = a.onreadystatechange = a.onerror = null);
            var t = new Error("Loading Error: " + r);
            Gt(e.cb, "error", t), o(t);
          }),
          (a.onload = a.onreadystatechange =
            function () {
              this.loaded ||
                (a.readyState &&
                  "loaded" !== a.readyState &&
                  "complete" !== a.readyState) ||
                ((e.loaded = !0),
                (a.onload = a.onreadystatechange = a.onerror = null),
                document.body.removeChild(a),
                Gt(e.cb, "load", e),
                i(e));
            }),
          (a.type = "text/javascript"),
          (a.src = n),
          t.crossOrigin && (a.crossorigin = t.crossOrigin),
          t.async && (a.async = !0),
          t.defer && (a.defer = !0),
          t.integrity && (a.integrity = t.integrity),
          document.body.appendChild(a),
          a.complete && a.onload();
      });
    }),
    (Dt.prototype.onload = function (e) {
      this.error || (this.loaded ? e(this) : this.cb.load.push(e));
    }),
    (Dt.prototype.onerror = function (e) {
      (this.loaded && !this.error) ||
        (this.error ? e(this) : this.cb.error.push(e));
    }),
    (Ht.prototype.load = function () {
      var e = this,
        t = this.src,
        n = this.id;
      return new Promise(function (r, i) {
        var o = {};
        "arraybuffer" === e.responseType
          ? (o.responseType = "arraybuffer")
          : t.indexOf("json") >= 0 && (o.responseType = "json"),
          Mt(t, o)
            .then(function (t) {
              (e.loaded = !0), (e.data = t.body), Ft(e.cb, "load", e), r(e);
            })
            ["catch"](function (t) {
              e.error = !0;
              var r = (t && t.message ? t.message : "Loading Error") + ": " + n;
              Ft(e.cb, "error", r), i(r);
            });
      });
    }),
    (Ht.prototype.onload = function (e) {
      this.error || (this.loaded ? e(this) : this.cb.load.push(e));
    }),
    (Ht.prototype.onerror = function (e) {
      (this.loaded && !this.error) ||
        (this.error ? e(this) : this.cb.error.push(e));
    });
  var Nt = [],
    Bt = function (e, t) {
      var n = new Ht(e, t);
      return Nt.push(n), n.load();
    },
    Yt = function (e) {
      return new Promise(function (t, n) {
        for (var r = Nt.length, i = !1, o = null; --r > -1 && !i; )
          i =
            (o = Nt[r]).id === e ||
            -1 !== o.id.indexOf("/" === e[0] ? "" : "/" + e);
        if (!i) return t(null);
        o.onload(t), o.onerror(n);
      });
    },
    It = [],
    Zt = !1,
    Lt = !1;
  function zt() {
    document.addEventListener
      ? (document.addEventListener("DOMContentLoaded", $t),
        window.addEventListener("load", $t))
      : (document.attachEvent("onreadystatechange", Kt),
        window.attachEvent("onload", $t)),
      (Zt = !0);
  }
  function Kt() {
    ("interactive" !== document.readyState &&
      "loaded" !== document.readyState &&
      "complete" !== document.readyState) ||
      $t();
  }
  function $t() {
    if (!1 === Lt) {
      for (var e = 0; e < It.length; e++) It[e].fn.apply(null, It[e].args);
      It = [];
    }
    (Lt = !0),
      document.removeEventListener
        ? (document.removeEventListener("DOMContentLoaded", $t),
          window.removeEventListener("load", $t))
        : (document.detachEvent("onreadystatechange", Kt),
          window.detachEvent("onload", $t));
  }
  new yt(document);
  var Jt = new yt(window),
    Xt = {
      touchstart: "ts",
      touchend: "te",
      touchmove: "tm",
      touchcancel: "tc",
    },
    qt = { mousedown: "md", mouseup: "mu", mousemove: "mm" },
    Qt = { pointermove: "pm" },
    en = { keydown: "kd", keyup: "ku" },
    tn = { devicemotion: "dm" },
    nn = function (e, t) {
      var n = qt[e],
        r = null;
      return function (e) {
        (r = (function (e) {
          return [e.windowX, e.windowY, Date.now()];
        })(e)),
          t(n, r);
      };
    },
    rn = function (e, t) {
      var n = Qt[e],
        r = null;
      return function (e) {
        r = (function (e) {
          var t = [],
            n = [];
          e.getCoalescedEvents && (n = e.getCoalescedEvents());
          for (var r = 0; r < n.length; r++) {
            var i = n[r];
            t.push([i.x, i.y, Date.now()]);
          }
          return t;
        })(e);
        for (var i = 0; i < r.length; i++) t(n, r[i]);
      };
    },
    on = function (e, t) {
      var n = Xt[e],
        r = null;
      return function (e) {
        (r = (function (e) {
          var t = [];
          try {
            var n, r;
            if (
              (e.touches && e.touches.length >= 1
                ? (n = e.touches)
                : e.changedTouches &&
                  e.changedTouches.length >= 1 &&
                  (n = e.changedTouches),
              n)
            ) {
              for (var i = 0; i < n.length; i++)
                (r = vt.eventCoords(n[i])) &&
                  t.push([n[i].identifier, r.x, r.y]);
              t.push(Date.now());
            }
            return t;
          } catch (nr) {
            return t;
          }
        })(e)),
          t(n, r);
      };
    },
    an = function (e, t) {
      var n = en[e],
        r = null;
      return function (e) {
        (r = (function (e) {
          return [e.keyNum, Date.now()];
        })(e)),
          t(n, r);
      };
    },
    sn = function (e, t) {
      var n = tn[e],
        r = null,
        i = [];
      return function (e) {
        (r = (function (e, t) {
          (e.acceleration === undefined ||
            (e.acceleration && e.acceleration.x === undefined)) &&
            (e.acceleration = { x: 0, y: 0, z: 0 });
          (e.rotationRate === undefined ||
            (e.rotationRate && e.rotationRate.alpha === undefined)) &&
            (e.rotationRate = { alpha: 0, beta: 0, gamma: 0 });
          var n = [
              e.acceleration.x,
              e.acceleration.y,
              e.acceleration.z,
              e.rotationRate.alpha,
              e.rotationRate.beta,
              e.rotationRate.gamma,
              Date.now(),
            ],
            r = [];
          if (0 === t.length) (t = n), (r = n);
          else {
            for (var i, o = 0, a = 0; a < 6; a++)
              (i = t[a] - n[a]), r.push(n[a]), (o += Math.abs(i));
            if ((r.push(Date.now()), (t = n), o <= 0)) return null;
          }
          return { motion: r, prevmotion: t };
        })(e, i)),
          null !== r && ((i = r.prevmotion), (r = r.motion), t(n, r));
      };
    };
  function cn() {
    (this._manifest = {}),
      (this.state = {
        timeBuffers: {},
        loadTime: Date.now(),
        recording: !1,
        initRecord: !1,
        record: { mouse: !0, touch: !0, keys: !1, motion: !1 },
      }),
      (this._recordEvent = this._recordEvent.bind(this));
  }
  (cn.prototype.record = function (e, t, n, r) {
    if (
      ((this._manifest.st = Date.now()),
      (this.state.record.mouse = e === undefined ? this.state.record.mouse : e),
      (this.state.record.touch = n === undefined ? this.state.record.touch : n),
      (this.state.record.keys = t === undefined ? this.state.record.keys : t),
      (this.state.record.motion =
        r === undefined ? this.state.record.motion : r),
      !1 === this.state.initRecord)
    ) {
      var i = new yt(document.body);
      this.state.record.mouse &&
        (i.addEventListener(
          "mousedown",
          nn("mousedown", this._recordEvent),
          !0
        ),
        i.addEventListener("mousemove", nn("mousemove", this._recordEvent), !0),
        i.addEventListener("mouseup", nn("mouseup", this._recordEvent), !0),
        i.addEventListener(
          "pointermove",
          rn("pointermove", this._recordEvent),
          !0
        )),
        !0 === this.state.record.keys &&
          (i.addEventListener("keyup", an("keyup", this._recordEvent), !0),
          i.addEventListener("keydown", an("keydown", this._recordEvent), !0)),
        this.state.record.touch &&
          !0 === ee.Browser.hasEvent("touchstart", document.body) &&
          (i.addEventListener(
            "touchstart",
            on("touchstart", this._recordEvent),
            !0
          ),
          i.addEventListener(
            "touchmove",
            on("touchmove", this._recordEvent),
            !0
          ),
          i.addEventListener(
            "touchend",
            on("touchend", this._recordEvent),
            !0
          )),
        this.state.record.motion &&
          !0 === ee.Browser.hasEvent("devicemotion", window) &&
          i.addEventListener(
            "devicemotion",
            sn("devicemotion", this._recordEvent),
            !0
          ),
        (this.state.initRecord = !0);
    }
    this.state.recording = !0;
  }),
    (cn.prototype.stop = function () {
      this.state.recording = !1;
    }),
    (cn.prototype.time = function () {
      return this.state.loadTime;
    }),
    (cn.prototype.getData = function () {
      for (var e in this.state.timeBuffers)
        (this._manifest[e] = this.state.timeBuffers[e].getData()),
          (this._manifest[e + "-mp"] =
            this.state.timeBuffers[e].getMeanPeriod());
      return this._manifest;
    }),
    (cn.prototype.setData = function (e, t) {
      this._manifest[e] = t;
    }),
    (cn.prototype.resetData = function () {
      (this._manifest = {}), (this.state.timeBuffers = {});
    }),
    (cn.prototype.circBuffPush = function (e, t) {
      this._recordEvent(e, t);
    }),
    (cn.prototype._recordEvent = function (e, t) {
      if (!1 !== this.state.recording)
        try {
          var n = t[t.length - 1];
          this.state.timeBuffers[e] ||
            (this.state.timeBuffers[e] = new qe(16, 15e3)),
            this.state.timeBuffers[e].push(n, t);
        } catch (tr) {
          De("motion", tr);
        }
    });
  var ln,
    un,
    hn,
    pn,
    dn,
    fn = new cn();
  try {
    (ln = (function () {
      var e = {
        _sAEoUGclR6: 0,
        _YtF3hY: 0,
        _HWD8UYGSW: [],
        _OVyTbB4bc: [],
        _xqKO: [],
        _ezKNTlP: {},
        _H1P0png: window,
        _X3J2E: [
          function (e) {
            var n = e._HWD8UYGSW.pop(),
              r = function () {
                var i = !1,
                  o = Array.prototype.slice.call(arguments);
                o.length > 0 && o[0] && o[0]._l
                  ? (o = o.splice(1, o.length - 1))
                  : (i = !0);
                var a = e._H1P0png,
                  s = e._YtF3hY,
                  c = e._xqKO;
                if (
                  (e._HWD8UYGSW.push(e._sAEoUGclR6),
                  e._HWD8UYGSW.push(e._H1P0png),
                  e._HWD8UYGSW.push(e._OVyTbB4bc),
                  e._HWD8UYGSW.push(o),
                  e._HWD8UYGSW.push(r),
                  (e._YtF3hY = e._sAEoUGclR6),
                  (e._sAEoUGclR6 = n),
                  (e._H1P0png = this),
                  (e._xqKO = r._r),
                  t(e),
                  (e._H1P0png = a),
                  (e._YtF3hY = s),
                  (e._xqKO = c),
                  i)
                )
                  return e._HWD8UYGSW.pop();
              };
            (r._l = {}),
              (r._r = Array.prototype.slice.call(e._xqKO)),
              e._HWD8UYGSW.push(r);
          },
          function () {
            var t = e._HWD8UYGSW.pop(),
              n = e._GO31Pjn[e._sAEoUGclR6++];
            (e._OVyTbB4bc = t), (e._xqKO[n] = t);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n + t);
          },
          function () {
            var t = e._HWD8UYGSW.pop(),
              n = e._GO31Pjn[e._sAEoUGclR6++];
            e._xqKO[n]
              ? (e._OVyTbB4bc = e._xqKO[n])
              : ((e._OVyTbB4bc = t), (e._xqKO[n] = t));
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._GO31Pjn[e._sAEoUGclR6++],
              r = e._GO31Pjn[e._sAEoUGclR6++],
              i = -1 == n ? e._OVyTbB4bc : e._xqKO[n];
            e._HWD8UYGSW.push((i[r] |= t));
          },
          function (e) {
            e._HWD8UYGSW.push(yt);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n >>> t);
          },
          function (e) {
            e._HWD8UYGSW.push(undefined);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._GO31Pjn[e._sAEoUGclR6++],
              r = e._GO31Pjn[e._sAEoUGclR6++],
              i = -1 == n ? e._OVyTbB4bc : e._xqKO[n];
            e._HWD8UYGSW.push((i[r] ^= t));
          },
          function (e) {
            e._HWD8UYGSW.push(null);
          },
          function (e) {
            (e._sAEoUGclR6 = e._HWD8UYGSW.splice(
              e._HWD8UYGSW.length - 4,
              1
            )[0]),
              (e._H1P0png = e._HWD8UYGSW.splice(e._HWD8UYGSW.length - 3, 1)[0]),
              (e._OVyTbB4bc = e._HWD8UYGSW.splice(
                e._HWD8UYGSW.length - 2,
                1
              )[0]);
          },
          function (e) {
            e._HWD8UYGSW.pop();
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._GO31Pjn[e._sAEoUGclR6++],
              r = e._GO31Pjn[e._sAEoUGclR6++];
            e._OVyTbB4bc[r] = t;
            for (var i = 0; i < n; i++)
              e._OVyTbB4bc[e._GO31Pjn[e._sAEoUGclR6++]] = t[i];
          },
          function (e) {
            e._HWD8UYGSW.push(e._GO31Pjn[e._sAEoUGclR6++]);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n & t);
          },
          function () {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop(),
              r = !1;
            t._l !== undefined && ((r = !0), n.splice(0, 0, { _l: {} }));
            var i = new (Function.prototype.bind.apply(t, [null].concat(n)))();
            r && e._HWD8UYGSW.pop(), e._HWD8UYGSW.push(i);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n < t);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._GO31Pjn[e._sAEoUGclR6++],
              r = e._GO31Pjn[e._sAEoUGclR6++],
              i = -1 == n ? e._OVyTbB4bc : e._xqKO[n];
            e._HWD8UYGSW.push((i[r] += t));
          },
          function (e) {
            e._HWD8UYGSW.push(ct);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n << t);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n | t);
          },
          function (e) {
            e._ezKNTlP[e._HWD8UYGSW[e._HWD8UYGSW.length - 1]] =
              e._HWD8UYGSW[e._HWD8UYGSW.length - 2];
          },
          function (e) {
            for (
              var t = e._GO31Pjn[e._sAEoUGclR6++],
                n = e._GO31Pjn[e._sAEoUGclR6++],
                r = e._GO31Pjn[e._sAEoUGclR6++],
                i = decodeURIComponent(atob(e._WQDqzIY.slice(t, t + n))),
                o = "",
                a = 0;
              a < i.length;
              a++
            )
              o += String.fromCharCode((256 + i.charCodeAt(a) + r) % 256);
            e._HWD8UYGSW.push(o);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n == t);
          },
          function (e) {
            var t = e._GO31Pjn[e._sAEoUGclR6++];
            e._YtF3hY = t;
          },
          function (e) {
            var t = e._GO31Pjn[e._sAEoUGclR6++],
              n = e._GO31Pjn[e._sAEoUGclR6++],
              r = -1 == t ? e._OVyTbB4bc : e._xqKO[t];
            e._HWD8UYGSW.push(r[n]);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n ^ t);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop(),
              r = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push((n[t] = r));
          },
          function (e) {
            for (
              var t = e._GO31Pjn[e._sAEoUGclR6++], n = {}, r = 0;
              r < t;
              r++
            ) {
              var i = e._HWD8UYGSW.pop();
              n[e._HWD8UYGSW.pop()] = i;
            }
            e._HWD8UYGSW.push(n);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(typeof t);
          },
          function (e) {
            var t = e._GO31Pjn[e._sAEoUGclR6++],
              n = e._GO31Pjn[e._sAEoUGclR6++],
              r = e._GO31Pjn[e._sAEoUGclR6++],
              i = -1 == t ? e._OVyTbB4bc : e._xqKO[t];
            r ? e._HWD8UYGSW.push(++i[n]) : e._HWD8UYGSW.push(i[n]++);
          },
          function (e) {
            e._HWD8UYGSW.push(vt);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._GO31Pjn[e._sAEoUGclR6++],
              r = e._GO31Pjn[e._sAEoUGclR6++];
            (-1 == n ? e._OVyTbB4bc : e._xqKO[n])[r] = t;
          },
          function (e) {
            e._HWD8UYGSW.push(e._H1P0png);
          },
          function (e) {
            e._HWD8UYGSW.push(e._HWD8UYGSW[e._HWD8UYGSW.length - 1]);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(window[t]);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(-t);
          },
          function (e) {
            var n = e._YtF3hY,
              r = e._GO31Pjn[e._sAEoUGclR6++];
            try {
              t(e);
            } catch (i) {
              e._HWD8UYGSW.push(i), (e._sAEoUGclR6 = r), t(e);
            }
            e._YtF3hY = n;
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n !== t);
          },
          function (e) {
            for (var t = e._GO31Pjn[e._sAEoUGclR6++], n = [], r = 0; r < t; r++)
              n.push(e._HWD8UYGSW.pop());
            e._HWD8UYGSW.push(n);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n * t);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            if (t && t._l !== undefined)
              n.splice(0, 0, { _l: {} }), t.apply(e._H1P0png, n);
            else {
              var r = t.apply(e._H1P0png, n);
              e._HWD8UYGSW.push(r);
            }
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n > t);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n - t);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._GO31Pjn[e._sAEoUGclR6++];
            t || (e._sAEoUGclR6 = n);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n in t);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop(),
              r = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push((n[t] += r));
          },
          function (e) {
            e._HWD8UYGSW.push(!!e._GO31Pjn[e._sAEoUGclR6++]);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n / t);
          },
          function (e) {
            e._HWD8UYGSW.push(lt);
          },
          function (e) {
            e._HWD8UYGSW.pop(), e._HWD8UYGSW.push(void 0);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop(),
              r = n[t];
            "function" == typeof r && (r = r.bind(n)), e._HWD8UYGSW.push(r);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n instanceof t);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n != t);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(!t);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._GO31Pjn[e._sAEoUGclR6++],
              r = e._GO31Pjn[e._sAEoUGclR6++],
              i = -1 == n ? e._OVyTbB4bc : e._xqKO[n];
            e._HWD8UYGSW.push((i[r] = t));
          },
          function (e) {
            e._HWD8UYGSW.push(lt);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n === t);
          },
          function (e) {
            var t = e._HWD8UYGSW.pop(),
              n = e._HWD8UYGSW.pop();
            e._HWD8UYGSW.push(n >= t);
          },
        ],
        _GO31Pjn: [
          39, 0, 3, 0, 13, 14, 0, 32, -1, 0, 47, 0, 44, 113, 39, 0, 1, 1, 11,
          12, 1, 0, 1, 25, -1, 1, 22, 2792, 20, 6, 57, 44, 44, 25, 0, 52, 47, 0,
          44, 112, 47, 0, 44, 54, 25, -1, 1, 22, 916, 12, 0, 57, 44, 65, 25, 0,
          53, 47, 0, 44, 112, 47, 0, 44, 75, 25, -1, 1, 22, 2732, 20, 13, 57,
          44, 86, 25, 0, 54, 47, 0, 44, 112, 47, 0, 44, 90, 47, 0, 44, 99, 9,
          47, 0, 44, 112, 47, 0, 44, 103, 47, 0, 44, 90, 22, 2052, 12, -3, 35,
          47, 0, 44, 112, 10, 13, 123, 0, 32, -1, 1, 47, 0, 44, 222, 39, 0, 1,
          2, 11, 12, 1, 0, 1, 25, -1, 1, 22, 1156, 16, 13, 57, 44, 153, 25, 0,
          55, 47, 0, 44, 221, 47, 0, 44, 163, 25, -1, 1, 22, 816, 28, -11, 57,
          44, 174, 25, 0, 56, 47, 0, 44, 221, 47, 0, 44, 184, 25, -1, 1, 22,
          152, 12, -4, 57, 44, 195, 25, 0, 57, 47, 0, 44, 221, 47, 0, 44, 199,
          47, 0, 44, 208, 9, 47, 0, 44, 221, 47, 0, 44, 212, 47, 0, 44, 199, 22,
          2052, 12, -3, 35, 47, 0, 44, 221, 10, 13, 232, 0, 32, -1, 2, 47, 0,
          44, 310, 39, 0, 1, 3, 11, 12, 1, 0, 1, 25, -1, 1, 22, 1220, 12, 5, 57,
          44, 262, 25, 0, 59, 47, 0, 44, 309, 47, 0, 44, 272, 25, -1, 1, 22,
          4240, 12, -3, 57, 44, 283, 25, 0, 60, 47, 0, 44, 309, 47, 0, 44, 287,
          47, 0, 44, 296, 9, 47, 0, 44, 309, 47, 0, 44, 300, 47, 0, 44, 287, 22,
          2052, 12, -3, 35, 47, 0, 44, 309, 10, 13, 320, 0, 32, -1, 3, 47, 0,
          44, 377, 39, 0, 1, 4, 11, 12, 1, 0, 1, 25, -1, 1, 22, 2672, 20, 14,
          57, 44, 350, 25, 0, 61, 47, 0, 44, 376, 47, 0, 44, 354, 47, 0, 44,
          363, 9, 47, 0, 44, 376, 47, 0, 44, 367, 47, 0, 44, 354, 22, 2052, 12,
          -3, 35, 47, 0, 44, 376, 10, 13, 387, 0, 32, -1, 4, 47, 0, 44, 427, 39,
          0, 1, 5, 11, 12, 1, 0, 1, 25, -1, 1, 22, 3556, 24, 6, 57, 44, 417, 25,
          0, 67, 47, 0, 44, 426, 47, 0, 44, 417, 22, 2052, 12, -3, 35, 47, 0,
          44, 426, 10, 13, 437, 0, 32, -1, 5, 47, 0, 44, 788, 39, 0, 1, 6, 11,
          12, 1, 0, 1, 25, -1, 1, 22, 164, 4, 17, 57, 44, 467, 25, 0, 64, 47, 0,
          44, 787, 47, 0, 44, 477, 25, -1, 1, 22, 1952, 4, 0, 57, 44, 488, 25,
          0, 65, 47, 0, 44, 787, 47, 0, 44, 498, 25, -1, 1, 22, 2236, 24, -20,
          57, 44, 509, 25, 0, 66, 47, 0, 44, 787, 47, 0, 44, 519, 25, -1, 1, 22,
          2696, 4, 0, 57, 44, 530, 25, 0, 63, 47, 0, 44, 787, 47, 0, 44, 540,
          25, -1, 1, 22, 3324, 8, -2, 57, 44, 551, 25, 0, 72, 47, 0, 44, 787,
          47, 0, 44, 561, 25, -1, 1, 22, 16, 4, -4, 57, 44, 572, 25, 0, 73, 47,
          0, 44, 787, 47, 0, 44, 582, 25, -1, 1, 22, 792, 8, 3, 57, 44, 593, 25,
          0, 74, 47, 0, 44, 787, 47, 0, 44, 603, 25, -1, 1, 22, 3944, 8, -1, 57,
          44, 614, 25, 0, 75, 47, 0, 44, 787, 47, 0, 44, 624, 25, -1, 1, 22,
          264, 8, 17, 57, 44, 635, 25, 0, 76, 47, 0, 44, 787, 47, 0, 44, 645,
          25, -1, 1, 22, 760, 4, 13, 57, 44, 656, 25, 0, 69, 47, 0, 44, 787, 47,
          0, 44, 666, 25, -1, 1, 22, 2196, 8, 4, 57, 44, 677, 25, 0, 70, 47, 0,
          44, 787, 47, 0, 44, 687, 25, -1, 1, 22, 1692, 8, -5, 57, 44, 698, 25,
          0, 71, 47, 0, 44, 787, 47, 0, 44, 708, 25, -1, 1, 22, 1688, 4, 13, 57,
          44, 719, 25, 0, 68, 47, 0, 44, 787, 47, 0, 44, 729, 25, -1, 1, 22,
          1172, 4, -4, 57, 44, 740, 25, 0, 77, 47, 0, 44, 787, 47, 0, 44, 750,
          25, -1, 1, 22, 2216, 4, 1, 57, 44, 761, 25, 0, 78, 47, 0, 44, 787, 47,
          0, 44, 765, 47, 0, 44, 774, 9, 47, 0, 44, 787, 47, 0, 44, 778, 47, 0,
          44, 765, 22, 2052, 12, -3, 35, 47, 0, 44, 787, 10, 13, 798, 0, 32, -1,
          6, 47, 0, 44, 884, 39, 0, 1, 7, 11, 12, 2, 0, 1, 2, 13, 815, 0, 47, 0,
          44, 879, 39, 0, 1, 8, 32, -1, 0, 12, 2, 1, 2, 3, 13, 834, 0, 47, 0,
          44, 874, 39, 0, 1, 9, 32, -1, 0, 12, 1, 1, 2, 25, -1, 2, 39, 1, 25, 7,
          2, 41, 25, 8, 2, 39, 1, 25, 7, 1, 41, 39, 2, 25, 8, 3, 41, 47, 0, 44,
          873, 10, 47, 0, 44, 878, 10, 47, 0, 44, 883, 10, 13, 894, 0, 32, -1,
          7, 47, 0, 44, 1034, 39, 0, 1, 10, 11, 12, 2, 0, 1, 2, 13, 911, 0, 47,
          0, 44, 1029, 39, 0, 1, 11, 32, -1, 0, 12, 2, 1, 2, 3, 13, 930, 0, 47,
          0, 44, 1024, 39, 0, 1, 12, 32, -1, 0, 12, 1, 1, 2, 25, -1, 2, 39, 1,
          25, 10, 2, 41, 32, -1, 3, 25, -1, 3, 22, 3332, 16, 7, 51, 32, -1, 4,
          13, 0, 32, -1, 5, 25, -1, 5, 25, -1, 4, 16, 44, 1014, 25, -1, 3, 25,
          -1, 5, 51, 25, 11, 2, 39, 1, 25, 10, 1, 41, 39, 2, 25, 11, 3, 41, 47,
          0, 44, 1023, 13, 1, 17, -1, 5, 11, 47, 0, 44, 969, 22, 2052, 12, -3,
          35, 47, 0, 44, 1023, 10, 47, 0, 44, 1028, 10, 47, 0, 44, 1033, 10, 13,
          1044, 0, 32, -1, 8, 47, 0, 44, 1161, 39, 0, 1, 13, 11, 12, 1, 0, 1,
          25, -1, 1, 22, 864, 12, 19, 51, 25, -1, 1, 22, 4184, 12, 1, 51, 23,
          34, 44, 1091, 11, 25, -1, 1, 22, 4032, 16, -20, 51, 25, -1, 1, 22,
          2700, 12, -6, 51, 23, 32, -1, 2, 39, 0, 22, 580, 8, 17, 35, 22, 1204,
          8, -5, 51, 41, 25, -1, 2, 44, 1118, 13, 1, 47, 0, 44, 1120, 13, 0, 25,
          -1, 1, 22, 1844, 28, 21, 51, 44, 1136, 13, 1, 47, 0, 44, 1138, 13, 0,
          25, -1, 1, 22, 956, 12, 8, 51, 25, -1, 1, 22, 2356, 16, 18, 51, 39, 5,
          47, 0, 44, 1160, 10, 13, 1171, 0, 32, -1, 9, 47, 0, 44, 1330, 39, 0,
          1, 14, 11, 12, 1, 0, 1, 39, 0, 32, -1, 2, 39, 0, 32, -1, 3, 25, -1, 1,
          22, 1896, 24, -3, 51, 44, 1215, 39, 0, 25, -1, 1, 22, 1896, 24, -3,
          51, 41, 55, -1, 3, 11, 13, 0, 32, -1, 4, 25, -1, 4, 25, -1, 3, 22,
          3332, 16, 7, 51, 16, 44, 1322, 25, -1, 3, 25, -1, 4, 51, 32, -1, 5,
          39, 0, 22, 580, 8, 17, 35, 22, 1204, 8, -5, 51, 41, 25, -1, 5, 22,
          132, 8, -8, 51, 39, 1, 22, 1212, 8, 1, 35, 22, 3100, 12, -10, 51, 41,
          25, -1, 5, 22, 4544, 4, 16, 51, 39, 1, 22, 1212, 8, 1, 35, 22, 3100,
          12, -10, 51, 41, 39, 3, 39, 1, 25, -1, 2, 22, 292, 8, -5, 51, 41, 11,
          30, -1, 4, 0, 11, 47, 0, 44, 1220, 25, -1, 2, 47, 0, 44, 1329, 10, 13,
          1340, 0, 32, -1, 10, 47, 0, 44, 1371, 39, 0, 1, 15, 11, 12, 1, 0, 1,
          39, 0, 22, 580, 8, 17, 35, 22, 1204, 8, -5, 51, 41, 13, 0, 39, 2, 47,
          0, 44, 1370, 10, 13, 1381, 0, 32, -1, 11, 47, 0, 44, 1669, 39, 0, 1,
          16, 11, 12, 1, 0, 1, 39, 0, 32, -1, 2, 37, 1649, 25, -1, 1, 22, 212,
          32, -14, 51, 34, 44, 1425, 11, 25, -1, 1, 22, 212, 32, -14, 51, 22,
          3332, 16, 7, 51, 13, 1, 58, 44, 1443, 25, -1, 1, 22, 212, 32, -14, 51,
          55, -1, 3, 11, 47, 0, 44, 1485, 25, -1, 1, 22, 3844, 20, -4, 51, 34,
          44, 1471, 11, 25, -1, 1, 22, 3844, 20, -4, 51, 22, 3332, 16, 7, 51,
          13, 1, 58, 44, 1485, 25, -1, 1, 22, 3844, 20, -4, 51, 55, -1, 3, 11,
          25, -1, 3, 44, 1636, 13, 0, 32, -1, 5, 25, -1, 5, 25, -1, 3, 22, 3332,
          16, 7, 51, 16, 44, 1611, 25, -1, 3, 25, -1, 5, 51, 39, 1, 31, 22,
          2076, 44, -15, 51, 41, 55, -1, 4, 11, 25, -1, 4, 44, 1602, 25, -1, 4,
          22, 132, 8, -8, 51, 39, 1, 22, 1212, 8, 1, 35, 22, 3100, 12, -10, 51,
          41, 25, -1, 4, 22, 4544, 4, 16, 51, 39, 1, 22, 1212, 8, 1, 35, 22,
          3100, 12, -10, 51, 41, 25, -1, 3, 25, -1, 5, 51, 22, 168, 28, -13, 51,
          39, 3, 39, 1, 25, -1, 2, 22, 292, 8, -5, 51, 41, 11, 30, -1, 5, 0, 11,
          47, 0, 44, 1495, 39, 0, 22, 580, 8, 17, 35, 22, 1204, 8, -5, 51, 41,
          39, 1, 25, -1, 2, 22, 292, 8, -5, 51, 41, 11, 25, -1, 2, 47, 0, 44,
          1668, 24, 1645, 47, 0, 44, 1659, 32, -1, 6, 25, -1, 2, 47, 0, 44,
          1668, 22, 2052, 12, -3, 35, 47, 0, 44, 1668, 10, 13, 1679, 0, 32, -1,
          12, 47, 0, 44, 1962, 39, 0, 1, 17, 11, 12, 1, 0, 1, 25, -1, 1, 22,
          1700, 24, 16, 51, 13, 0, 50, 57, 34, 54, 44, 1734, 11, 25, -1, 1, 22,
          1700, 24, 16, 51, 34, 44, 1734, 11, 25, -1, 1, 22, 1700, 24, 16, 51,
          22, 4544, 4, 16, 51, 13, 0, 50, 57, 44, 1765, 22, 2320, 8, -15, 13, 0,
          22, 132, 8, -8, 13, 0, 22, 4544, 4, 16, 13, 0, 28, 3, 25, -1, 1, 22,
          1700, 24, 16, 27, 11, 25, -1, 1, 22, 3820, 24, 15, 51, 13, 0, 50, 57,
          34, 54, 44, 1811, 11, 25, -1, 1, 22, 3820, 24, 15, 51, 34, 44, 1811,
          11, 25, -1, 1, 22, 3820, 24, 15, 51, 22, 1996, 12, 10, 51, 13, 0, 50,
          57, 44, 1842, 22, 2844, 12, 15, 13, 0, 22, 1444, 8, -9, 13, 0, 22,
          1996, 12, 10, 13, 0, 28, 3, 25, -1, 1, 22, 3820, 24, 15, 27, 11, 39,
          0, 22, 580, 8, 17, 35, 22, 1204, 8, -5, 51, 41, 25, -1, 1, 22, 800,
          16, 11, 51, 34, 54, 44, 1871, 11, 13, 2, 36, 25, -1, 1, 22, 3820, 24,
          15, 51, 22, 2844, 12, 15, 51, 25, -1, 1, 22, 3820, 24, 15, 51, 22,
          1444, 8, -9, 51, 25, -1, 1, 22, 3820, 24, 15, 51, 22, 1996, 12, 10,
          51, 25, -1, 1, 22, 1700, 24, 16, 51, 22, 2320, 8, -15, 51, 25, -1, 1,
          22, 1700, 24, 16, 51, 22, 132, 8, -8, 51, 25, -1, 1, 22, 1700, 24, 16,
          51, 22, 4544, 4, 16, 51, 39, 8, 32, -1, 2, 25, -1, 2, 47, 0, 44, 1961,
          10, 13, 1972, 0, 32, -1, 13, 47, 0, 44, 2181, 39, 0, 1, 18, 11, 12, 0,
          0, 28, 0, 33, 22, 1176, 28, -13, 27, 11, 22, 2720, 8, 16, 22, 2712, 8,
          4, 47, 1, 22, 52, 24, -20, 47, 1, 22, 4512, 8, 0, 47, 1, 22, 1452, 28,
          -14, 47, 1, 28, 4, 22, 444, 48, -19, 47, 0, 22, 4048, 20, 11, 47, 0,
          22, 1920, 32, -21, 39, 0, 22, 580, 8, 17, 35, 22, 1204, 8, -5, 51, 41,
          22, 2260, 44, -17, 28, 0, 28, 5, 33, 22, 1e3, 12, 9, 27, 11, 28, 0,
          33, 22, 1e3, 12, 9, 51, 22, 2720, 8, 16, 27, 11, 47, 1, 33, 22, 1e3,
          12, 9, 51, 22, 2720, 8, 16, 51, 25, 0, 86, 27, 11, 47, 1, 33, 22, 1e3,
          12, 9, 51, 22, 2720, 8, 16, 51, 25, 0, 87, 27, 11, 47, 1, 33, 22, 1e3,
          12, 9, 51, 22, 2720, 8, 16, 51, 25, 0, 88, 27, 11, 47, 1, 33, 22, 1e3,
          12, 9, 51, 22, 2720, 8, 16, 51, 25, 0, 89, 27, 11, 33, 39, 1, 33, 22,
          608, 20, 14, 51, 22, 628, 8, -4, 51, 41, 33, 22, 608, 20, 14, 27, 11,
          22, 2052, 12, -3, 35, 47, 0, 44, 2180, 10, 13, 2191, 0, 32, -1, 14,
          47, 0, 44, 2440, 39, 0, 1, 19, 11, 12, 1, 0, 1, 25, 0, 93, 44, 2238,
          25, -1, 1, 39, 1, 25, 0, 93, 22, 1492, 4, 3, 51, 41, 32, -1, 2, 25,
          -1, 2, 13, 0, 50, 38, 44, 2238, 25, -1, 2, 47, 0, 44, 2439, 39, 0, 25,
          -1, 1, 22, 3268, 12, 19, 51, 22, 1288, 20, 13, 51, 41, 32, -1, 3, 25,
          -1, 1, 22, 1736, 4, 2, 51, 34, 54, 44, 2274, 11, 22, 1884, 0, 8, 32,
          -1, 4, 25, -1, 1, 22, 4232, 8, 19, 51, 34, 54, 44, 2294, 11, 22, 1884,
          0, 8, 32, -1, 5, 25, -1, 1, 22, 3756, 24, -12, 51, 34, 54, 44, 2314,
          11, 22, 1884, 0, 8, 32, -1, 6, 25, -1, 1, 22, 3348, 36, -15, 51, 34,
          54, 44, 2334, 11, 22, 1884, 0, 8, 32, -1, 7, 25, -1, 1, 22, 3236, 20,
          1, 51, 34, 54, 44, 2354, 11, 22, 1884, 0, 8, 32, -1, 8, 25, -1, 1, 39,
          1, 25, 0, 15, 41, 32, -1, 9, 25, -1, 3, 25, -1, 4, 2, 25, -1, 5, 2,
          25, -1, 6, 2, 25, -1, 7, 2, 25, -1, 8, 2, 25, -1, 9, 2, 32, -1, 10,
          25, -1, 10, 39, 1, 18, 41, 32, -1, 11, 25, 0, 93, 44, 2432, 25, -1,
          11, 25, -1, 1, 39, 2, 25, 0, 93, 22, 380, 20, -17, 51, 41, 11, 25, -1,
          11, 47, 0, 44, 2439, 10, 13, 2450, 0, 32, -1, 15, 47, 0, 44, 2867, 39,
          0, 1, 20, 11, 12, 1, 0, 1, 25, -1, 1, 22, 1736, 4, 2, 51, 22, 1884, 0,
          8, 38, 44, 2496, 22, 3736, 20, -17, 25, -1, 1, 22, 1736, 4, 2, 51, 2,
          22, 1588, 8, 10, 2, 47, 0, 44, 2866, 25, -1, 1, 22, 940, 16, 20, 35,
          22, 2120, 12, 4, 51, 57, 44, 2520, 22, 4344, 36, -13, 47, 0, 44, 2866,
          22, 1884, 0, 8, 32, -1, 2, 13, 0, 32, -1, 3, 25, -1, 1, 22, 1496, 36,
          -14, 51, 44, 2859, 25, -1, 3, 25, 0, 91, 42, 44, 2555, 47, 0, 44,
          2859, 13, 0, 32, -1, 4, 13, 0, 32, -1, 5, 25, -1, 1, 22, 1496, 36,
          -14, 51, 22, 2812, 24, 12, 51, 22, 3332, 16, 7, 51, 32, -1, 6, 25, 0,
          92, 25, -1, 6, 39, 2, 22, 1212, 8, 1, 35, 22, 1840, 4, -8, 51, 41, 32,
          -1, 7, 13, 0, 32, -1, 8, 25, -1, 8, 25, -1, 7, 16, 44, 2694, 25, -1,
          1, 22, 1496, 36, -14, 51, 22, 2812, 24, 12, 51, 25, -1, 8, 51, 32, -1,
          9, 25, -1, 9, 22, 272, 20, 19, 51, 25, -1, 1, 22, 272, 20, 19, 51, 57,
          44, 2685, 25, -1, 9, 25, -1, 1, 57, 44, 2680, 25, -1, 4, 13, 1, 2, 55,
          -1, 5, 11, 30, -1, 4, 0, 11, 30, -1, 8, 0, 11, 47, 0, 44, 2613, 22,
          4232, 8, 19, 39, 1, 25, -1, 1, 22, 3952, 32, -9, 51, 41, 34, 44, 2733,
          11, 22, 4232, 8, 19, 39, 1, 25, -1, 1, 22, 3680, 56, -17, 51, 41, 22,
          1884, 0, 8, 38, 44, 2794, 22, 300, 4, -2, 39, 0, 25, -1, 1, 22, 272,
          20, 19, 51, 22, 1288, 20, 13, 51, 41, 2, 22, 588, 16, 19, 2, 22, 4232,
          8, 19, 39, 1, 25, -1, 1, 22, 3680, 56, -17, 51, 41, 2, 22, 1588, 8,
          10, 2, 25, -1, 2, 2, 55, -1, 2, 11, 47, 0, 44, 2837, 22, 300, 4, -2,
          39, 0, 25, -1, 1, 22, 272, 20, 19, 51, 22, 1288, 20, 13, 51, 41, 2,
          22, 256, 4, 18, 2, 25, -1, 5, 2, 22, 2924, 4, -8, 2, 25, -1, 2, 2, 55,
          -1, 2, 11, 25, -1, 1, 22, 1496, 36, -14, 51, 55, -1, 1, 11, 13, 1, 17,
          -1, 3, 11, 47, 0, 44, 2532, 25, -1, 2, 47, 0, 44, 2866, 10, 13, 2877,
          0, 32, -1, 16, 47, 0, 44, 2899, 39, 0, 1, 21, 11, 12, 2, 0, 1, 2, 25,
          -1, 1, 25, -1, 2, 20, 47, 0, 44, 2898, 10, 13, 2909, 0, 32, -1, 17,
          47, 0, 44, 3062, 39, 0, 1, 22, 11, 12, 1, 0, 1, 25, -1, 1, 39, 1, 25,
          0, 14, 41, 32, -1, 2, 25, -1, 2, 39, 1, 25, 0, 103, 22, 1492, 4, 3,
          51, 41, 32, -1, 3, 25, -1, 3, 44, 2959, 25, -1, 3, 47, 0, 44, 3061,
          25, -1, 1, 22, 4068, 16, 14, 51, 44, 2975, 13, 1, 47, 0, 44, 2977, 13,
          0, 25, -1, 1, 22, 196, 16, 16, 51, 44, 2993, 13, 1, 47, 0, 44, 2995,
          13, 0, 25, -1, 1, 22, 1092, 12, -3, 51, 44, 3011, 13, 1, 47, 0, 44,
          3013, 13, 0, 25, -1, 1, 39, 1, 25, 0, 19, 41, 25, -1, 1, 39, 1, 25, 0,
          18, 41, 39, 5, 32, -1, 4, 25, -1, 4, 25, -1, 2, 39, 2, 25, 0, 103, 22,
          380, 20, -17, 51, 41, 11, 25, -1, 4, 47, 0, 44, 3061, 10, 13, 3072, 0,
          32, -1, 18, 47, 0, 44, 3588, 39, 0, 1, 23, 11, 12, 1, 0, 1, 25, -1, 1,
          22, 4548, 12, 21, 51, 22, 1232, 8, 11, 51, 44, 3103, 25, 0, 102, 47,
          0, 44, 3587, 39, 0, 25, -1, 1, 22, 3268, 12, 19, 51, 22, 1288, 20, 13,
          51, 41, 22, 2328, 28, -9, 57, 44, 3133, 25, 0, 96, 47, 0, 44, 3587,
          25, -1, 1, 22, 3756, 24, -12, 51, 44, 3163, 39, 0, 25, -1, 1, 22,
          3756, 24, -12, 51, 22, 1288, 20, 13, 51, 41, 47, 0, 44, 3167, 22,
          1884, 0, 8, 32, -1, 2, 25, -1, 2, 22, 2836, 8, -5, 57, 44, 3191, 25,
          0, 94, 47, 0, 44, 3587, 47, 0, 44, 3201, 25, -1, 2, 22, 316, 12, 13,
          57, 44, 3212, 25, 0, 95, 47, 0, 44, 3587, 47, 0, 44, 3222, 25, -1, 2,
          22, 1480, 12, 19, 57, 44, 3233, 25, 0, 97, 47, 0, 44, 3587, 47, 0, 44,
          3243, 25, -1, 2, 22, 1828, 12, -14, 57, 44, 3254, 25, 0, 99, 47, 0,
          44, 3587, 47, 0, 44, 3264, 25, -1, 2, 22, 1580, 8, -9, 57, 44, 3275,
          25, 0, 100, 47, 0, 44, 3587, 47, 0, 44, 3285, 25, -1, 2, 22, 4160, 24,
          -19, 57, 44, 3296, 25, 0, 98, 47, 0, 44, 3587, 47, 0, 44, 3300, 47, 0,
          44, 3574, 25, -1, 1, 22, 4232, 8, 19, 51, 34, 54, 44, 3317, 11, 22,
          1884, 0, 8, 22, 3004, 4, 10, 2, 25, -1, 1, 22, 1736, 4, 2, 51, 34, 54,
          44, 3339, 11, 22, 1884, 0, 8, 2, 22, 3004, 4, 10, 2, 25, -1, 1, 22,
          3236, 20, 1, 51, 34, 54, 44, 3362, 11, 22, 1884, 0, 8, 2, 22, 3004, 4,
          10, 2, 25, -1, 1, 22, 3348, 36, -15, 51, 34, 54, 44, 3385, 11, 22,
          1884, 0, 8, 2, 32, -1, 3, 39, 0, 25, -1, 3, 22, 1288, 20, 13, 51, 41,
          32, -1, 4, 25, 0, 99, 22, 2156, 32, -20, 39, 2, 25, 0, 95, 22, 316,
          12, 13, 39, 2, 25, 0, 94, 22, 2836, 8, -5, 39, 2, 39, 3, 32, -1, 5,
          13, 0, 32, -1, 6, 25, -1, 5, 22, 3332, 16, 7, 51, 32, -1, 7, 25, -1,
          6, 25, -1, 7, 16, 44, 3510, 25, -1, 5, 25, -1, 6, 51, 13, 0, 51, 39,
          1, 25, -1, 4, 22, 2132, 24, -15, 51, 41, 13, 1, 36, 38, 44, 3501, 25,
          -1, 5, 25, -1, 6, 51, 13, 1, 51, 47, 0, 44, 3587, 30, -1, 6, 0, 11,
          47, 0, 44, 3451, 25, -1, 3, 39, 1, 22, 4116, 4, 11, 22, 1740, 16, -2,
          39, 2, 22, 1596, 16, 10, 35, 15, 22, 1232, 8, 11, 51, 41, 44, 3546,
          25, 0, 99, 47, 0, 44, 3587, 25, -1, 2, 22, 4252, 8, 1, 57, 44, 3563,
          25, 0, 96, 47, 0, 44, 3566, 25, 0, 101, 47, 0, 44, 3587, 47, 0, 44,
          3578, 47, 0, 44, 3300, 22, 2052, 12, -3, 35, 47, 0, 44, 3587, 10, 13,
          3598, 0, 32, -1, 19, 47, 0, 44, 3736, 39, 0, 1, 24, 11, 12, 1, 0, 1,
          22, 3236, 20, 1, 22, 4152, 8, -5, 22, 4232, 8, 19, 22, 1736, 4, 2, 39,
          4, 32, -1, 2, 39, 0, 32, -1, 3, 25, -1, 2, 22, 3332, 16, 7, 51, 32,
          -1, 4, 13, 0, 32, -1, 5, 25, -1, 5, 25, -1, 4, 16, 44, 3728, 25, -1,
          2, 25, -1, 5, 51, 32, -1, 6, 25, -1, 6, 39, 1, 25, -1, 1, 22, 3952,
          32, -9, 51, 41, 44, 3706, 25, -1, 6, 39, 1, 25, -1, 1, 22, 3680, 56,
          -17, 51, 41, 39, 1, 18, 41, 47, 0, 44, 3707, 9, 39, 1, 25, -1, 3, 22,
          292, 8, -5, 51, 41, 11, 30, -1, 5, 0, 11, 47, 0, 44, 3649, 25, -1, 3,
          47, 0, 44, 3735, 10, 13, 3746, 0, 32, -1, 20, 47, 0, 44, 3866, 39, 0,
          1, 25, 11, 12, 1, 0, 1, 25, -1, 1, 22, 2792, 20, 6, 57, 44, 3776, 25,
          0, 104, 47, 0, 44, 3865, 47, 0, 44, 3786, 25, -1, 1, 22, 916, 12, 0,
          57, 44, 3797, 25, 0, 105, 47, 0, 44, 3865, 47, 0, 44, 3807, 25, -1, 1,
          22, 2732, 20, 13, 57, 44, 3818, 25, 0, 106, 47, 0, 44, 3865, 47, 0,
          44, 3828, 25, -1, 1, 22, 2864, 20, 9, 57, 44, 3839, 25, 0, 107, 47, 0,
          44, 3865, 47, 0, 44, 3843, 47, 0, 44, 3852, 9, 47, 0, 44, 3865, 47, 0,
          44, 3856, 47, 0, 44, 3843, 22, 2052, 12, -3, 35, 47, 0, 44, 3865, 10,
          13, 3876, 0, 32, -1, 21, 47, 0, 44, 3996, 39, 0, 1, 26, 11, 12, 1, 0,
          1, 25, -1, 1, 22, 1156, 16, 13, 57, 44, 3906, 25, 0, 108, 47, 0, 44,
          3995, 47, 0, 44, 3916, 25, -1, 1, 22, 816, 28, -11, 57, 44, 3927, 25,
          0, 109, 47, 0, 44, 3995, 47, 0, 44, 3937, 25, -1, 1, 22, 152, 12, -4,
          57, 44, 3948, 25, 0, 110, 47, 0, 44, 3995, 47, 0, 44, 3958, 25, -1, 1,
          22, 3864, 20, 12, 57, 44, 3969, 25, 0, 111, 47, 0, 44, 3995, 47, 0,
          44, 3973, 47, 0, 44, 3982, 9, 47, 0, 44, 3995, 47, 0, 44, 3986, 47, 0,
          44, 3973, 22, 2052, 12, -3, 35, 47, 0, 44, 3995, 10, 13, 4006, 0, 32,
          -1, 22, 47, 0, 44, 4084, 39, 0, 1, 27, 11, 12, 1, 0, 1, 25, -1, 1, 22,
          1220, 12, 5, 57, 44, 4036, 25, 0, 112, 47, 0, 44, 4083, 47, 0, 44,
          4046, 25, -1, 1, 22, 4240, 12, -3, 57, 44, 4057, 25, 0, 113, 47, 0,
          44, 4083, 47, 0, 44, 4061, 47, 0, 44, 4070, 9, 47, 0, 44, 4083, 47, 0,
          44, 4074, 47, 0, 44, 4061, 22, 2052, 12, -3, 35, 47, 0, 44, 4083, 10,
          13, 4094, 0, 32, -1, 23, 47, 0, 44, 4126, 39, 0, 1, 28, 11, 12, 1, 0,
          1, 25, -1, 1, 22, 1028, 8, 4, 57, 44, 4120, 25, 0, 114, 47, 0, 44,
          4125, 9, 47, 0, 44, 4125, 10, 13, 4136, 0, 32, -1, 24, 47, 0, 44,
          4214, 39, 0, 1, 29, 11, 12, 1, 0, 1, 25, -1, 1, 22, 3884, 28, -20, 57,
          44, 4166, 25, 0, 115, 47, 0, 44, 4213, 47, 0, 44, 4176, 25, -1, 1, 22,
          544, 12, -10, 57, 44, 4187, 25, 0, 116, 47, 0, 44, 4213, 47, 0, 44,
          4191, 47, 0, 44, 4200, 9, 47, 0, 44, 4213, 47, 0, 44, 4204, 47, 0, 44,
          4191, 22, 2052, 12, -3, 35, 47, 0, 44, 4213, 10, 13, 4224, 0, 32, -1,
          25, 47, 0, 44, 4344, 39, 0, 1, 30, 11, 12, 1, 0, 1, 25, -1, 1, 22,
          1332, 8, -2, 57, 44, 4254, 25, 0, 117, 47, 0, 44, 4343, 47, 0, 44,
          4264, 25, -1, 1, 22, 2884, 16, -11, 57, 44, 4275, 25, 0, 118, 47, 0,
          44, 4343, 47, 0, 44, 4285, 25, -1, 1, 22, 3620, 16, -6, 57, 44, 4296,
          25, 0, 119, 47, 0, 44, 4343, 47, 0, 44, 4306, 25, -1, 1, 22, 3068, 16,
          -1, 57, 44, 4317, 25, 0, 120, 47, 0, 44, 4343, 47, 0, 44, 4321, 47, 0,
          44, 4330, 9, 47, 0, 44, 4343, 47, 0, 44, 4334, 47, 0, 44, 4321, 22,
          2052, 12, -3, 35, 47, 0, 44, 4343, 10, 13, 4354, 0, 32, -1, 26, 47, 0,
          44, 4453, 39, 0, 1, 31, 11, 12, 1, 0, 1, 25, -1, 1, 22, 1036, 28, 17,
          57, 44, 4384, 25, 0, 121, 47, 0, 44, 4452, 47, 0, 44, 4394, 25, -1, 1,
          22, 3028, 40, -14, 57, 44, 4405, 25, 0, 122, 47, 0, 44, 4452, 47, 0,
          44, 4415, 25, -1, 1, 22, 2672, 20, 14, 57, 44, 4426, 25, 0, 123, 47,
          0, 44, 4452, 47, 0, 44, 4430, 47, 0, 44, 4439, 9, 47, 0, 44, 4452, 47,
          0, 44, 4443, 47, 0, 44, 4430, 22, 2052, 12, -3, 35, 47, 0, 44, 4452,
          10, 13, 4463, 0, 32, -1, 27, 47, 0, 44, 4549, 39, 0, 1, 32, 11, 12, 2,
          0, 1, 2, 13, 4480, 0, 47, 0, 44, 4544, 39, 0, 1, 33, 32, -1, 0, 12, 2,
          1, 2, 3, 13, 4499, 0, 47, 0, 44, 4539, 39, 0, 1, 34, 32, -1, 0, 12, 1,
          1, 2, 25, -1, 2, 39, 1, 25, 32, 2, 41, 25, 33, 2, 39, 1, 25, 32, 1,
          41, 39, 2, 25, 33, 3, 41, 47, 0, 44, 4538, 10, 47, 0, 44, 4543, 10,
          47, 0, 44, 4548, 10, 13, 4559, 0, 32, -1, 28, 47, 0, 44, 4662, 39, 0,
          1, 35, 11, 12, 1, 0, 1, 39, 0, 22, 580, 8, 17, 35, 22, 1204, 8, -5,
          51, 41, 25, -1, 1, 22, 4084, 8, -6, 51, 39, 1, 25, 0, 14, 41, 25, -1,
          1, 22, 956, 12, 8, 51, 44, 4617, 25, -1, 1, 22, 956, 12, 8, 51, 47, 0,
          44, 4625, 25, -1, 1, 22, 1372, 16, 9, 51, 25, -1, 1, 22, 2356, 16, 18,
          51, 44, 4647, 25, -1, 1, 22, 2356, 16, 18, 51, 47, 0, 44, 4655, 25,
          -1, 1, 22, 2204, 12, 21, 51, 39, 4, 47, 0, 44, 4661, 10, 13, 4672, 0,
          32, -1, 29, 47, 0, 44, 4783, 39, 0, 1, 36, 11, 12, 1, 0, 1, 39, 0, 22,
          580, 8, 17, 35, 22, 1204, 8, -5, 51, 41, 25, -1, 1, 22, 4084, 8, -6,
          51, 39, 1, 25, 0, 14, 41, 25, -1, 1, 22, 4532, 12, 6, 51, 25, -1, 1,
          22, 956, 12, 8, 51, 44, 4738, 25, -1, 1, 22, 956, 12, 8, 51, 47, 0,
          44, 4746, 25, -1, 1, 22, 1372, 16, 9, 51, 25, -1, 1, 22, 2356, 16, 18,
          51, 44, 4768, 25, -1, 1, 22, 2356, 16, 18, 51, 47, 0, 44, 4776, 25,
          -1, 1, 22, 2204, 12, 21, 51, 39, 5, 47, 0, 44, 4782, 10, 13, 4793, 0,
          32, -1, 30, 47, 0, 44, 5056, 39, 0, 1, 37, 11, 12, 1, 0, 1, 13, 0, 32,
          -1, 2, 22, 1016, 12, 19, 25, 0, 135, 22, 1260, 28, -16, 25, 0, 134,
          22, 2064, 12, -5, 25, 0, 133, 22, 2636, 32, -15, 25, 0, 132, 28, 4,
          32, -1, 3, 22, 2028, 12, 17, 25, 0, 140, 22, 1308, 20, -14, 25, 0,
          139, 22, 4004, 28, -18, 25, 0, 138, 22, 636, 20, 8, 25, 0, 137, 22,
          604, 4, -3, 25, 0, 136, 28, 5, 32, -1, 4, 25, -1, 3, 39, 1, 22, 3256,
          12, 18, 35, 22, 52, 24, -20, 51, 41, 32, -1, 5, 25, -1, 5, 22, 3332,
          16, 7, 51, 32, -1, 6, 13, 0, 32, -1, 7, 25, -1, 7, 25, -1, 6, 16, 44,
          4972, 25, -1, 5, 25, -1, 7, 51, 32, -1, 8, 25, -1, 1, 25, -1, 8, 51,
          44, 4963, 25, -1, 3, 25, -1, 8, 51, 25, -1, 2, 39, 2, 25, 0, 16, 41,
          55, -1, 2, 11, 30, -1, 7, 0, 11, 47, 0, 44, 4915, 25, -1, 4, 25, -1,
          1, 22, 1784, 4, 1, 51, 51, 44, 5011, 25, -1, 4, 25, -1, 1, 22, 1784,
          4, 1, 51, 51, 25, -1, 2, 39, 2, 25, 0, 16, 41, 55, -1, 2, 11, 39, 0,
          22, 580, 8, 17, 35, 22, 1204, 8, -5, 51, 41, 25, -1, 1, 22, 4084, 8,
          -6, 51, 39, 1, 25, 0, 14, 41, 25, -1, 2, 25, -1, 1, 22, 328, 20, 14,
          51, 39, 4, 47, 0, 44, 5055, 10, 13, 5066, 0, 32, -1, 31, 47, 0, 44,
          5408, 39, 0, 1, 38, 11, 12, 1, 0, 1, 39, 0, 32, -1, 2, 37, 5388, 25,
          -1, 1, 22, 212, 32, -14, 51, 34, 44, 5110, 11, 25, -1, 1, 22, 212, 32,
          -14, 51, 22, 3332, 16, 7, 51, 13, 1, 58, 44, 5128, 25, -1, 1, 22, 212,
          32, -14, 51, 55, -1, 3, 11, 47, 0, 44, 5170, 25, -1, 1, 22, 3844, 20,
          -4, 51, 34, 44, 5156, 11, 25, -1, 1, 22, 3844, 20, -4, 51, 22, 3332,
          16, 7, 51, 13, 1, 58, 44, 5170, 25, -1, 1, 22, 3844, 20, -4, 51, 55,
          -1, 3, 11, 25, -1, 3, 44, 5375, 25, -1, 3, 22, 3332, 16, 7, 51, 32,
          -1, 5, 13, 0, 32, -1, 6, 25, -1, 6, 25, -1, 5, 16, 44, 5324, 25, -1,
          3, 25, -1, 6, 51, 39, 1, 31, 22, 2076, 44, -15, 51, 41, 55, -1, 4, 11,
          25, -1, 4, 44, 5315, 25, -1, 3, 25, -1, 6, 51, 22, 168, 28, -13, 51,
          39, 1, 25, -1, 2, 22, 292, 8, -5, 51, 41, 11, 25, -1, 4, 22, 4544, 4,
          16, 51, 39, 1, 22, 1212, 8, 1, 35, 22, 3100, 12, -10, 51, 41, 39, 1,
          25, -1, 2, 22, 292, 8, -5, 51, 41, 11, 25, -1, 4, 22, 132, 8, -8, 51,
          39, 1, 22, 1212, 8, 1, 35, 22, 3100, 12, -10, 51, 41, 39, 1, 25, -1,
          2, 22, 292, 8, -5, 51, 41, 11, 30, -1, 6, 0, 11, 47, 0, 44, 5191, 25,
          -1, 1, 22, 4084, 8, -6, 51, 39, 1, 25, 0, 14, 41, 39, 1, 25, -1, 2,
          22, 292, 8, -5, 51, 41, 11, 39, 0, 22, 580, 8, 17, 35, 22, 1204, 8,
          -5, 51, 41, 39, 1, 25, -1, 2, 22, 292, 8, -5, 51, 41, 11, 25, -1, 2,
          47, 0, 44, 5407, 24, 5384, 47, 0, 44, 5398, 32, -1, 7, 25, -1, 2, 47,
          0, 44, 5407, 22, 2052, 12, -3, 35, 47, 0, 44, 5407, 10, 13, 5418, 0,
          32, -1, 32, 47, 0, 44, 5461, 39, 0, 1, 39, 11, 12, 1, 0, 1, 39, 0, 22,
          580, 8, 17, 35, 22, 1204, 8, -5, 51, 41, 25, -1, 1, 22, 4084, 8, -6,
          51, 39, 1, 25, 0, 14, 41, 39, 2, 47, 0, 44, 5460, 10, 13, 5471, 0, 32,
          -1, 33, 47, 0, 44, 5758, 39, 0, 1, 40, 11, 12, 1, 0, 1, 25, -1, 1, 22,
          4084, 8, -6, 51, 32, -1, 2, 25, -1, 1, 22, 3756, 24, -12, 51, 22,
          3884, 28, -20, 57, 44, 5513, 25, 0, 141, 47, 0, 44, 5516, 25, 0, 142,
          32, -1, 3, 25, -1, 2, 22, 112, 20, -13, 51, 34, 54, 44, 5536, 11, 22,
          1884, 0, 8, 32, -1, 4, 22, 4252, 8, 1, 39, 1, 25, -1, 1, 22, 3168, 24,
          17, 51, 22, 492, 28, -22, 51, 41, 32, -1, 5, 13, 0, 32, -1, 6, 25, -1,
          3, 25, 0, 142, 57, 44, 5652, 25, -1, 2, 22, 2928, 76, -20, 51, 13, 0,
          39, 2, 25, -1, 4, 22, 2856, 8, 0, 51, 41, 25, -1, 5, 2, 25, -1, 2, 22,
          1116, 40, -14, 51, 39, 1, 25, -1, 4, 22, 2856, 8, 0, 51, 41, 2, 32,
          -1, 7, 25, -1, 5, 22, 3332, 16, 7, 51, 25, -1, 7, 22, 3332, 16, 7, 51,
          48, 13, 100, 40, 55, -1, 6, 11, 47, 0, 44, 5706, 25, -1, 2, 22, 1116,
          40, -14, 51, 25, -1, 2, 22, 2928, 76, -20, 51, 39, 2, 25, -1, 4, 22,
          2856, 8, 0, 51, 41, 32, -1, 8, 25, -1, 8, 22, 3332, 16, 7, 51, 25, -1,
          4, 22, 3332, 16, 7, 51, 48, 13, 100, 40, 55, -1, 6, 11, 39, 0, 22,
          580, 8, 17, 35, 22, 1204, 8, -5, 51, 41, 25, -1, 2, 39, 1, 25, 0, 14,
          41, 25, -1, 3, 25, 0, 142, 57, 44, 5744, 13, 1, 36, 47, 0, 44, 5745,
          9, 25, -1, 6, 25, -1, 3, 39, 5, 47, 0, 44, 5757, 10, 13, 5768, 0, 32,
          -1, 34, 47, 0, 44, 5985, 39, 0, 1, 41, 11, 12, 1, 0, 1, 13, 0, 32, -1,
          2, 25, -1, 1, 22, 4084, 8, -6, 51, 22, 4264, 80, -21, 35, 52, 34, 54,
          44, 5815, 11, 25, -1, 1, 22, 4084, 8, -6, 51, 22, 4468, 44, 22, 35,
          52, 44, 5843, 25, -1, 1, 22, 4084, 8, -6, 51, 22, 112, 20, -13, 51,
          22, 3332, 16, 7, 51, 55, -1, 2, 11, 47, 0, 44, 5898, 25, -1, 1, 22,
          4084, 8, -6, 51, 22, 1240, 16, -6, 35, 52, 34, 44, 5874, 11, 25, -1,
          1, 22, 4084, 8, -6, 51, 22, 4196, 36, 20, 51, 44, 5898, 25, -1, 1, 22,
          4084, 8, -6, 51, 22, 3804, 16, -3, 51, 22, 3332, 16, 7, 51, 55, -1, 2,
          11, 25, -1, 1, 22, 3140, 12, -14, 51, 44, 5925, 25, -1, 1, 22, 3140,
          12, -14, 51, 22, 3332, 16, 7, 51, 47, 0, 44, 5928, 13, 1, 36, 32, -1,
          3, 39, 0, 22, 580, 8, 17, 35, 22, 1204, 8, -5, 51, 41, 25, -1, 1, 22,
          4084, 8, -6, 51, 39, 1, 25, 0, 14, 41, 25, -1, 1, 22, 4084, 8, -6, 51,
          39, 1, 25, 0, 17, 41, 25, -1, 3, 25, -1, 2, 39, 5, 47, 0, 44, 5984,
          10, 13, 5995, 0, 32, -1, 35, 47, 0, 44, 6247, 39, 0, 1, 42, 11, 12, 1,
          0, 1, 25, -1, 1, 22, 3756, 24, -12, 51, 22, 2672, 20, 14, 57, 34, 44,
          6029, 11, 25, -1, 1, 22, 1896, 24, -3, 51, 44, 6164, 39, 0, 25, -1, 1,
          22, 1896, 24, -3, 51, 41, 32, -1, 2, 39, 0, 13, 6054, 0, 47, 0, 44,
          6139, 39, 0, 1, 43, 32, -1, 0, 12, 1, 1, 2, 39, 0, 22, 580, 8, 17, 35,
          22, 1204, 8, -5, 51, 41, 25, -1, 2, 22, 4084, 8, -6, 51, 39, 1, 25, 0,
          14, 41, 25, -1, 2, 22, 3384, 28, -11, 51, 25, -1, 2, 22, 3920, 24, 18,
          51, 25, -1, 2, 22, 1808, 20, 12, 51, 25, -1, 2, 22, 1372, 16, 9, 51,
          25, -1, 2, 22, 2204, 12, 21, 51, 39, 7, 47, 0, 44, 6138, 10, 39, 1,
          25, -1, 2, 22, 252, 4, -3, 51, 41, 22, 3280, 8, 0, 51, 41, 47, 0, 44,
          6246, 47, 0, 44, 6237, 39, 0, 22, 580, 8, 17, 35, 22, 1204, 8, -5, 51,
          41, 25, -1, 1, 22, 4084, 8, -6, 51, 39, 1, 25, 0, 14, 41, 25, -1, 1,
          22, 3384, 28, -11, 51, 25, -1, 1, 22, 3920, 24, 18, 51, 25, -1, 1, 22,
          1808, 20, 12, 51, 25, -1, 1, 22, 1372, 16, 9, 51, 25, -1, 1, 22, 2204,
          12, 21, 51, 39, 7, 47, 0, 44, 6246, 22, 2052, 12, -3, 35, 47, 0, 44,
          6246, 10, 13, 6257, 0, 32, -1, 36, 47, 0, 44, 6490, 39, 0, 1, 44, 11,
          12, 0, 0, 28, 0, 33, 22, 1176, 28, -13, 27, 11, 22, 1920, 32, -21, 39,
          0, 22, 580, 8, 17, 35, 22, 1204, 8, -5, 51, 41, 22, 3288, 20, 22, 13,
          0, 22, 1420, 24, 16, 28, 0, 22, 4260, 4, 3, 28, 0, 22, 2260, 44, -17,
          28, 0, 22, 444, 48, -19, 47, 0, 22, 4048, 20, 11, 47, 0, 28, 7, 33,
          22, 1e3, 12, 9, 27, 11, 28, 0, 33, 22, 1e3, 12, 9, 51, 22, 2720, 8,
          16, 27, 11, 47, 1, 33, 22, 1e3, 12, 9, 51, 22, 2720, 8, 16, 51, 25, 0,
          145, 27, 11, 47, 1, 33, 22, 1e3, 12, 9, 51, 22, 2720, 8, 16, 51, 25,
          0, 146, 27, 11, 47, 1, 33, 22, 1e3, 12, 9, 51, 22, 2720, 8, 16, 51,
          25, 0, 147, 27, 11, 47, 1, 33, 22, 1e3, 12, 9, 51, 22, 2720, 8, 16,
          51, 25, 0, 148, 27, 11, 47, 1, 33, 22, 1e3, 12, 9, 51, 22, 2720, 8,
          16, 51, 25, 0, 149, 27, 11, 47, 1, 33, 22, 1e3, 12, 9, 51, 22, 2720,
          8, 16, 51, 25, 0, 150, 27, 11, 33, 39, 1, 33, 22, 608, 20, 14, 51, 22,
          628, 8, -4, 51, 41, 33, 22, 608, 20, 14, 27, 11, 22, 2052, 12, -3, 35,
          47, 0, 44, 6489, 10, 13, 6500, 0, 32, -1, 37, 47, 0, 44, 6528, 39, 0,
          1, 45, 11, 12, 0, 0, 13, 0, 50, 33, 22, 3580, 40, -14, 27, 11, 22,
          2052, 12, -3, 35, 47, 0, 44, 6527, 10, 13, 6538, 0, 32, -1, 38, 47, 0,
          44, 6675, 39, 0, 1, 46, 11, 12, 0, 0, 22, 1532, 16, -4, 35, 22, 1724,
          12, -4, 51, 32, -1, 1, 25, -1, 1, 54, 44, 6571, 13, 0, 47, 0, 44,
          6674, 22, 1884, 0, 8, 32, -1, 2, 25, -1, 1, 39, 1, 22, 3256, 12, 18,
          35, 22, 52, 24, -20, 51, 41, 32, -1, 3, 25, -1, 3, 22, 3332, 16, 7,
          51, 32, -1, 4, 13, 0, 32, -1, 5, 25, -1, 5, 25, -1, 4, 16, 44, 6661,
          25, -1, 3, 25, -1, 5, 51, 32, -1, 6, 25, -1, 6, 22, 4e3, 4, -22, 2,
          25, -1, 1, 25, -1, 6, 51, 2, 17, -1, 2, 11, 30, -1, 5, 0, 11, 47, 0,
          44, 6613, 25, -1, 2, 39, 1, 25, 0, 154, 41, 47, 0, 44, 6674, 10, 13,
          6685, 0, 32, -1, 39, 47, 0, 44, 6778, 39, 0, 1, 47, 11, 12, 0, 0, 37,
          6760, 22, 3540, 16, -6, 39, 1, 22, 3008, 20, 13, 35, 22, 3780, 24, 13,
          51, 41, 32, -1, 1, 25, -1, 1, 22, 3332, 16, 7, 51, 13, 0, 42, 44,
          6747, 25, -1, 1, 13, 0, 51, 22, 3524, 16, 21, 51, 47, 0, 44, 6777, 47,
          0, 44, 6754, 13, 1, 36, 47, 0, 44, 6777, 24, 6756, 47, 0, 44, 6768,
          32, -1, 2, 9, 47, 0, 44, 6777, 22, 2052, 12, -3, 35, 47, 0, 44, 6777,
          10, 13, 6788, 0, 32, -1, 40, 47, 0, 44, 6841, 39, 0, 1, 48, 11, 12, 0,
          0, 37, 6823, 22, 940, 16, 20, 35, 22, 328, 20, 14, 51, 22, 1976, 8,
          19, 51, 47, 0, 44, 6840, 24, 6819, 47, 0, 44, 6831, 32, -1, 1, 9, 47,
          0, 44, 6840, 22, 2052, 12, -3, 35, 47, 0, 44, 6840, 10, 13, 6851, 0,
          32, -1, 41, 47, 0, 44, 6900, 39, 0, 1, 49, 11, 12, 0, 0, 37, 6882, 39,
          0, 25, 0, 153, 22, 492, 28, -22, 51, 41, 47, 0, 44, 6899, 24, 6878,
          47, 0, 44, 6890, 32, -1, 1, 9, 47, 0, 44, 6899, 22, 2052, 12, -3, 35,
          47, 0, 44, 6899, 10, 13, 6910, 0, 32, -1, 42, 47, 0, 44, 6959, 39, 0,
          1, 50, 11, 12, 0, 0, 37, 6941, 39, 0, 25, 0, 151, 22, 492, 28, -22,
          51, 41, 47, 0, 44, 6958, 24, 6937, 47, 0, 44, 6949, 32, -1, 1, 9, 47,
          0, 44, 6958, 22, 2052, 12, -3, 35, 47, 0, 44, 6958, 10, 13, 6969, 0,
          32, -1, 43, 47, 0, 44, 7022, 39, 0, 1, 51, 11, 12, 0, 0, 37, 7004, 22,
          1532, 16, -4, 35, 22, 328, 20, 14, 51, 22, 1976, 8, 19, 51, 47, 0, 44,
          7021, 24, 7e3, 47, 0, 44, 7012, 32, -1, 1, 9, 47, 0, 44, 7021, 22,
          2052, 12, -3, 35, 47, 0, 44, 7021, 10, 13, 7032, 0, 32, -1, 44, 47, 0,
          44, 7076, 39, 0, 1, 52, 11, 12, 0, 0, 37, 7058, 39, 0, 25, 0, 38, 41,
          47, 0, 44, 7075, 24, 7054, 47, 0, 44, 7066, 32, -1, 1, 9, 47, 0, 44,
          7075, 22, 2052, 12, -3, 35, 47, 0, 44, 7075, 10, 13, 7086, 0, 32, -1,
          45, 47, 0, 44, 7135, 39, 0, 1, 53, 11, 12, 0, 0, 37, 7117, 39, 0, 25,
          0, 90, 22, 492, 28, -22, 51, 41, 47, 0, 44, 7134, 24, 7113, 47, 0, 44,
          7125, 32, -1, 1, 9, 47, 0, 44, 7134, 22, 2052, 12, -3, 35, 47, 0, 44,
          7134, 10, 13, 7145, 0, 32, -1, 46, 47, 0, 44, 7355, 39, 0, 1, 54, 11,
          12, 1, 0, 1, 37, 7342, 25, -1, 1, 22, 3140, 12, -14, 51, 32, -1, 2,
          25, -1, 2, 13, 0, 50, 38, 34, 44, 7190, 11, 25, -1, 2, 22, 656, 8,
          -18, 51, 13, 0, 50, 38, 44, 7336, 25, -1, 2, 22, 656, 8, -18, 51, 22,
          1012, 4, 5, 57, 44, 7244, 25, -1, 1, 22, 844, 20, -15, 51, 25, -1, 1,
          22, 1788, 20, -12, 51, 39, 2, 39, 1, 25, 0, 157, 13, 0, 51, 22, 292,
          8, -5, 51, 41, 11, 47, 0, 44, 7336, 25, -1, 2, 22, 656, 8, -18, 51,
          22, 312, 4, 16, 57, 44, 7288, 25, -1, 1, 22, 844, 20, -15, 51, 25, -1,
          1, 22, 1788, 20, -12, 51, 39, 2, 25, 0, 157, 13, 1, 27, 11, 47, 0, 44,
          7336, 25, -1, 2, 22, 656, 8, -18, 51, 22, 1328, 4, -16, 57, 44, 7336,
          25, -1, 2, 22, 1012, 4, 5, 51, 25, -1, 2, 22, 2668, 4, 2, 51, 39, 2,
          39, 1, 25, 0, 157, 13, 2, 51, 22, 292, 8, -5, 51, 41, 11, 24, 7338,
          47, 0, 44, 7345, 32, -1, 3, 22, 2052, 12, -3, 35, 47, 0, 44, 7354, 10,
          13, 7365, 0, 32, -1, 47, 47, 0, 44, 7562, 39, 0, 1, 55, 11, 12, 3, 0,
          1, 2, 3, 37, 7549, 25, -1, 1, 22, 3140, 12, -14, 51, 32, -1, 4, 25,
          -1, 4, 13, 0, 50, 38, 34, 44, 7412, 11, 25, -1, 4, 22, 656, 8, -18,
          51, 13, 0, 50, 38, 44, 7543, 25, -1, 4, 22, 656, 8, -18, 51, 22, 2784,
          8, 21, 57, 44, 7543, 25, -1, 4, 22, 4116, 4, 11, 51, 9, 53, 34, 44,
          7455, 11, 25, -1, 4, 22, 4116, 4, 11, 51, 25, -1, 3, 38, 44, 7462, 7,
          47, 0, 44, 7561, 39, 0, 25, 0, 48, 41, 11, 22, 1548, 4, 14, 22, 1012,
          4, 5, 25, 0, 155, 39, 1, 22, 244, 8, 3, 35, 22, 2040, 12, 1, 51, 41,
          39, 1, 25, 0, 49, 41, 22, 2668, 4, 2, 25, -1, 2, 22, 656, 8, -18, 22,
          1328, 4, -16, 22, 1788, 20, -12, 22, 1724, 12, -4, 28, 4, 39, 2, 22,
          1532, 16, -4, 35, 22, 764, 8, -2, 51, 22, 1388, 32, 19, 51, 41, 11,
          24, 7545, 47, 0, 44, 7552, 32, -1, 5, 22, 2052, 12, -3, 35, 47, 0, 44,
          7561, 10, 13, 7572, 0, 32, -1, 48, 47, 0, 44, 7651, 39, 0, 1, 56, 11,
          12, 0, 0, 13, 0, 32, -1, 1, 25, -1, 1, 25, 0, 156, 22, 3332, 16, 7,
          51, 16, 44, 7641, 25, 0, 156, 25, -1, 1, 51, 29, 22, 2220, 16, 10, 57,
          44, 7632, 39, 0, 25, 0, 156, 25, -1, 1, 51, 41, 25, 0, 155, 25, -1, 1,
          27, 11, 30, -1, 1, 0, 11, 47, 0, 44, 7585, 22, 2052, 12, -3, 35, 47,
          0, 44, 7650, 10, 13, 7661, 0, 32, -1, 49, 47, 0, 44, 7678, 39, 0, 1,
          57, 11, 12, 1, 0, 1, 25, -1, 1, 47, 0, 44, 7677, 10, 13, 7688, 0, 32,
          -1, 50, 47, 0, 44, 8229, 39, 0, 1, 58, 11, 12, 1, 0, 1, 37, 8169, 39,
          0, 25, 0, 48, 41, 11, 13, 0, 32, -1, 2, 25, -1, 2, 25, 0, 157, 13, 0,
          51, 22, 3332, 16, 7, 51, 16, 44, 7797, 25, 0, 157, 13, 0, 51, 25, -1,
          2, 51, 13, 1, 51, 22, 4116, 4, 11, 25, -1, 1, 22, 656, 8, -18, 22,
          2784, 8, 21, 22, 1788, 20, -12, 22, 1724, 12, -4, 28, 3, 39, 2, 25, 0,
          157, 13, 0, 51, 25, -1, 2, 51, 13, 0, 51, 22, 1388, 32, 19, 51, 41,
          11, 30, -1, 2, 0, 11, 47, 0, 44, 7711, 25, 0, 155, 39, 1, 22, 244, 8,
          3, 35, 22, 2040, 12, 1, 51, 41, 39, 1, 25, 0, 49, 41, 13, 0, 39, 2,
          39, 1, 25, 0, 157, 13, 2, 51, 22, 292, 8, -5, 51, 41, 11, 13, 7845, 0,
          47, 0, 44, 8151, 39, 0, 1, 59, 32, -1, 0, 12, 1, 1, 2, 13, 7866, 0,
          32, -1, 3, 47, 0, 44, 8132, 39, 0, 1, 60, 11, 12, 1, 0, 1, 25, 0, 157,
          13, 1, 51, 32, -1, 2, 25, 0, 157, 13, 2, 51, 32, -1, 3, 25, -1, 2, 13,
          0, 50, 57, 34, 54, 44, 7912, 11, 25, -1, 3, 13, 0, 50, 57, 34, 54, 44,
          7928, 11, 25, -1, 3, 22, 3332, 16, 7, 51, 13, 3, 16, 34, 44, 7938, 11,
          25, -1, 1, 13, 30, 16, 44, 8010, 25, -1, 1, 13, 10, 16, 44, 7954, 13,
          1, 47, 0, 44, 7956, 13, 3, 32, -1, 4, 25, -1, 4, 13, 7969, 0, 47, 0,
          44, 7997, 39, 0, 1, 61, 32, -1, 0, 12, 0, 1, 25, 60, 1, 25, 60, 4, 2,
          39, 1, 25, 59, 3, 41, 47, 0, 44, 7996, 10, 39, 2, 22, 2304, 16, 16,
          35, 41, 11, 47, 0, 44, 8122, 25, -1, 2, 13, 0, 50, 38, 34, 44, 8032,
          11, 25, -1, 2, 22, 3332, 16, 7, 51, 13, 2, 57, 44, 8099, 22, 3912, 8,
          -17, 25, -1, 3, 39, 1, 22, 244, 8, 3, 35, 22, 2040, 12, 1, 51, 41, 22,
          656, 8, -18, 22, 2692, 4, -9, 22, 1788, 20, -12, 22, 1724, 12, -4, 28,
          3, 32, -1, 5, 25, -1, 2, 13, 1, 51, 25, -1, 5, 39, 2, 25, -1, 2, 13,
          0, 51, 22, 1388, 32, 19, 51, 41, 11, 39, 0, 25, 0, 157, 13, 2, 27, 11,
          13, 0, 25, 59, 2, 39, 2, 22, 2304, 16, 16, 35, 41, 11, 22, 2052, 12,
          -3, 35, 47, 0, 44, 8131, 10, 13, 0, 39, 1, 25, -1, 3, 41, 11, 22,
          2052, 12, -3, 35, 47, 0, 44, 8150, 10, 39, 1, 22, 20, 32, -14, 35, 15,
          47, 0, 44, 8228, 24, 8165, 47, 0, 44, 8219, 32, -1, 3, 13, 8179, 0,
          47, 0, 44, 8207, 39, 0, 1, 62, 32, -1, 0, 12, 1, 1, 2, 39, 0, 25, -1,
          2, 41, 11, 22, 2052, 12, -3, 35, 47, 0, 44, 8206, 10, 39, 1, 22, 20,
          32, -14, 35, 15, 47, 0, 44, 8228, 22, 2052, 12, -3, 35, 47, 0, 44,
          8228, 10, 13, 8239, 0, 32, -1, 51, 47, 0, 44, 8484, 39, 0, 1, 63, 11,
          12, 2, 0, 1, 2, 25, -1, 1, 39, 1, 25, 0, 158, 22, 2132, 24, -15, 51,
          41, 13, 1, 36, 38, 44, 8274, 7, 47, 0, 44, 8483, 25, -1, 1, 39, 1, 25,
          0, 158, 22, 292, 8, -5, 51, 41, 11, 25, -1, 1, 13, 0, 57, 44, 8322,
          25, 0, 46, 22, 568, 12, 1, 39, 2, 22, 1532, 16, -4, 35, 22, 2900, 24,
          -1, 51, 41, 11, 47, 0, 44, 8474, 13, 8329, 0, 47, 0, 44, 8366, 39, 0,
          1, 64, 32, -1, 0, 12, 1, 1, 2, 25, 63, 2, 25, 63, 1, 25, -1, 2, 39, 3,
          25, 0, 47, 41, 11, 22, 2052, 12, -3, 35, 47, 0, 44, 8365, 10, 22, 568,
          12, 1, 39, 2, 22, 1532, 16, -4, 35, 22, 2900, 24, -1, 51, 41, 11, 22,
          1548, 4, 14, 22, 656, 8, -18, 22, 1012, 4, 5, 22, 1788, 20, -12, 22,
          1724, 12, -4, 28, 2, 39, 2, 22, 1532, 16, -4, 35, 22, 764, 8, -2, 51,
          22, 1388, 32, 19, 51, 41, 11, 25, -1, 1, 13, 2, 57, 44, 8474, 22,
          1548, 4, 14, 22, 656, 8, -18, 22, 312, 4, 16, 22, 1788, 20, -12, 22,
          1724, 12, -4, 28, 2, 39, 2, 22, 1532, 16, -4, 35, 22, 764, 8, -2, 51,
          22, 1388, 32, 19, 51, 41, 11, 22, 2052, 12, -3, 35, 47, 0, 44, 8483,
          10, 13, 100, 32, -1, 52, 13, 101, 32, -1, 53, 13, 102, 32, -1, 54, 13,
          110, 32, -1, 55, 13, 111, 32, -1, 56, 13, 112, 32, -1, 57, 13, 113,
          32, -1, 58, 13, 120, 32, -1, 59, 13, 121, 32, -1, 60, 13, 130, 32, -1,
          61, 13, 131, 32, -1, 62, 13, 140, 32, -1, 63, 13, 150, 32, -1, 64, 13,
          151, 32, -1, 65, 13, 152, 32, -1, 66, 13, 160, 32, -1, 67, 13, 161,
          32, -1, 68, 13, 162, 32, -1, 69, 13, 164, 32, -1, 70, 13, 165, 32, -1,
          71, 13, 170, 32, -1, 72, 13, 171, 32, -1, 73, 13, 172, 32, -1, 74, 13,
          173, 32, -1, 75, 13, 174, 32, -1, 76, 13, 180, 32, -1, 77, 13, 181,
          32, -1, 78, 25, -1, 11, 25, -1, 0, 39, 2, 25, -1, 6, 41, 32, -1, 79,
          25, -1, 8, 25, -1, 1, 39, 2, 25, -1, 6, 41, 32, -1, 80, 25, -1, 10,
          25, -1, 2, 39, 2, 25, -1, 6, 41, 32, -1, 81, 25, -1, 9, 25, -1, 3, 39,
          2, 25, -1, 7, 41, 32, -1, 82, 25, -1, 12, 25, -1, 4, 39, 2, 25, -1, 6,
          41, 32, -1, 83, 13, 16, 32, -1, 84, 13, 15, 13, 1e3, 40, 32, -1, 85,
          13, 1, 32, -1, 86, 13, 2, 32, -1, 87, 13, 3, 32, -1, 88, 13, 4, 32,
          -1, 89, 13, 8734, 0, 47, 0, 44, 9231, 39, 0, 1, 65, 32, -1, 0, 12, 1,
          1, 2, 25, -1, 2, 34, 54, 44, 8755, 11, 28, 0, 55, -1, 2, 11, 28, 0,
          33, 22, 1e3, 12, 9, 51, 22, 2720, 8, 16, 27, 11, 25, -1, 2, 25, 0, 86,
          51, 47, 0, 38, 33, 22, 1e3, 12, 9, 51, 22, 2720, 8, 16, 51, 25, 0, 86,
          27, 11, 25, -1, 2, 25, 0, 87, 51, 47, 0, 38, 33, 22, 1e3, 12, 9, 51,
          22, 2720, 8, 16, 51, 25, 0, 87, 27, 11, 25, -1, 2, 25, 0, 88, 51, 47,
          0, 38, 33, 22, 1e3, 12, 9, 51, 22, 2720, 8, 16, 51, 25, 0, 88, 27, 11,
          25, -1, 2, 25, 0, 89, 51, 47, 0, 38, 33, 22, 1e3, 12, 9, 51, 22, 2720,
          8, 16, 51, 25, 0, 89, 27, 11, 39, 0, 22, 580, 8, 17, 35, 22, 1204, 8,
          -5, 51, 41, 33, 22, 1e3, 12, 9, 51, 22, 3152, 16, -4, 27, 11, 33, 22,
          1e3, 12, 9, 51, 22, 3152, 16, -4, 51, 33, 22, 1176, 28, -13, 51, 25,
          0, 64, 27, 11, 33, 22, 1e3, 12, 9, 51, 22, 444, 48, -19, 51, 47, 0,
          57, 44, 9207, 22, 940, 16, 20, 35, 22, 2120, 12, 4, 51, 39, 1, 5, 15,
          32, -1, 3, 25, 0, 83, 22, 3556, 24, 6, 25, 0, 89, 39, 3, 25, 0, 79,
          22, 916, 12, 0, 25, 0, 88, 39, 3, 25, 0, 79, 22, 2732, 20, 13, 25, 0,
          88, 39, 3, 25, 0, 79, 22, 2792, 20, 6, 25, 0, 88, 39, 3, 25, 0, 81,
          22, 1220, 12, 5, 25, 0, 87, 39, 3, 25, 0, 81, 22, 4240, 12, -3, 25, 0,
          87, 39, 3, 25, 0, 82, 22, 2672, 20, 14, 25, 0, 86, 39, 3, 25, 0, 80,
          22, 152, 12, -4, 25, 0, 86, 39, 3, 25, 0, 80, 22, 816, 28, -11, 25, 0,
          86, 39, 3, 25, 0, 80, 22, 1156, 16, 13, 25, 0, 86, 39, 3, 39, 10, 32,
          -1, 4, 25, -1, 4, 22, 3332, 16, 7, 51, 32, -1, 5, 13, 0, 32, -1, 6,
          25, -1, 6, 25, -1, 5, 16, 44, 9193, 25, -1, 4, 25, -1, 6, 51, 32, -1,
          7, 25, -1, 7, 13, 1, 51, 32, -1, 8, 33, 22, 1e3, 12, 9, 51, 22, 2720,
          8, 16, 51, 25, -1, 7, 13, 0, 51, 51, 47, 1, 57, 44, 9184, 47, 1, 33,
          22, 608, 20, 14, 51, 25, -1, 8, 39, 2, 25, -1, 7, 13, 2, 51, 41, 25,
          -1, 8, 39, 3, 25, -1, 3, 22, 2900, 24, -1, 51, 41, 11, 30, -1, 6, 0,
          11, 47, 0, 44, 9098, 47, 1, 33, 22, 1e3, 12, 9, 51, 22, 444, 48, -19,
          27, 11, 47, 1, 33, 22, 1e3, 12, 9, 51, 22, 4048, 20, 11, 27, 11, 22,
          2052, 12, -3, 35, 47, 0, 44, 9230, 10, 25, -1, 13, 22, 3192, 44, -12,
          51, 22, 2720, 8, 16, 27, 11, 13, 9252, 0, 47, 0, 44, 9286, 39, 0, 1,
          66, 32, -1, 0, 12, 0, 1, 47, 0, 33, 22, 1e3, 12, 9, 51, 22, 4048, 20,
          11, 27, 11, 22, 2052, 12, -3, 35, 47, 0, 44, 9285, 10, 25, -1, 13, 22,
          3192, 44, -12, 51, 22, 928, 12, 22, 27, 11, 13, 9307, 0, 47, 0, 44,
          9333, 39, 0, 1, 67, 32, -1, 0, 12, 0, 1, 33, 22, 1e3, 12, 9, 51, 22,
          1920, 32, -21, 51, 47, 0, 44, 9332, 10, 25, -1, 13, 22, 3192, 44, -12,
          51, 22, 1104, 12, -17, 27, 11, 13, 9354, 0, 47, 0, 44, 9588, 39, 0, 1,
          68, 32, -1, 0, 12, 0, 1, 33, 22, 1e3, 12, 9, 51, 22, 2260, 44, -17,
          51, 39, 1, 22, 3256, 12, 18, 35, 22, 52, 24, -20, 51, 41, 32, -1, 2,
          25, -1, 2, 22, 3332, 16, 7, 51, 32, -1, 3, 13, 0, 32, -1, 4, 25, -1,
          4, 25, -1, 3, 16, 44, 9577, 25, -1, 2, 25, -1, 4, 51, 32, -1, 5, 39,
          0, 33, 22, 1e3, 12, 9, 51, 22, 2260, 44, -17, 51, 25, -1, 5, 51, 22,
          492, 28, -22, 51, 41, 33, 22, 1176, 28, -13, 51, 25, -1, 5, 27, 11,
          25, -1, 5, 25, 0, 57, 23, 44, 9503, 39, 0, 33, 22, 1e3, 12, 9, 51, 22,
          2260, 44, -17, 51, 25, -1, 5, 51, 22, 4120, 32, 18, 51, 41, 33, 22,
          1176, 28, -13, 51, 25, 0, 58, 27, 11, 25, -1, 5, 25, 0, 61, 23, 44,
          9546, 39, 0, 33, 22, 1e3, 12, 9, 51, 22, 2260, 44, -17, 51, 25, -1, 5,
          51, 22, 4120, 32, 18, 51, 41, 33, 22, 1176, 28, -13, 51, 25, 0, 62,
          27, 11, 25, -1, 5, 25, 0, 61, 23, 44, 9568, 39, 0, 33, 22, 1176, 28,
          -13, 51, 25, 0, 61, 27, 11, 30, -1, 4, 0, 11, 47, 0, 44, 9407, 33, 22,
          1176, 28, -13, 51, 47, 0, 44, 9587, 10, 25, -1, 13, 22, 3192, 44, -12,
          51, 22, 492, 28, -22, 27, 11, 13, 9609, 0, 47, 0, 44, 9671, 39, 0, 1,
          69, 32, -1, 0, 12, 2, 1, 2, 3, 25, -1, 2, 39, 1, 22, 968, 12, 21, 35,
          41, 44, 9647, 25, -1, 2, 39, 1, 25, 0, 5, 41, 55, -1, 2, 11, 25, -1,
          3, 33, 22, 1176, 28, -13, 51, 25, -1, 2, 27, 11, 22, 2052, 12, -3, 35,
          47, 0, 44, 9670, 10, 25, -1, 13, 22, 3192, 44, -12, 51, 22, 1956, 20,
          22, 27, 11, 13, 9692, 0, 47, 0, 44, 9735, 39, 0, 1, 70, 32, -1, 0, 12,
          0, 1, 28, 0, 33, 22, 1176, 28, -13, 27, 11, 28, 0, 33, 22, 1e3, 12, 9,
          51, 22, 2260, 44, -17, 27, 11, 22, 2052, 12, -3, 35, 47, 0, 44, 9734,
          10, 25, -1, 13, 22, 3192, 44, -12, 51, 22, 980, 20, 4, 27, 11, 13,
          9756, 0, 47, 0, 44, 9794, 39, 0, 1, 71, 32, -1, 0, 12, 2, 1, 2, 3, 25,
          -1, 3, 25, -1, 2, 39, 2, 33, 22, 608, 20, 14, 51, 41, 11, 22, 2052,
          12, -3, 35, 47, 0, 44, 9793, 10, 25, -1, 13, 22, 3192, 44, -12, 51,
          22, 4092, 24, 13, 27, 11, 13, 9815, 0, 47, 0, 44, 10082, 39, 0, 1, 72,
          32, -1, 0, 12, 2, 1, 2, 3, 33, 22, 1e3, 12, 9, 51, 22, 4048, 20, 11,
          51, 47, 0, 57, 44, 9848, 7, 47, 0, 44, 10081, 37, 10052, 25, -1, 2,
          39, 1, 22, 968, 12, 21, 35, 41, 44, 9876, 25, -1, 2, 39, 1, 25, 0, 5,
          41, 55, -1, 2, 11, 13, 10, 25, -1, 2, 39, 2, 22, 140, 12, -4, 35, 41,
          55, -1, 2, 11, 25, -1, 3, 22, 3332, 16, 7, 51, 13, 1, 43, 32, -1, 4,
          25, -1, 3, 25, -1, 4, 51, 33, 22, 1e3, 12, 9, 51, 22, 3152, 16, -4,
          51, 43, 32, -1, 5, 33, 22, 1e3, 12, 9, 51, 22, 2260, 44, -17, 51, 25,
          -1, 2, 51, 54, 44, 9989, 33, 22, 1e3, 12, 9, 51, 22, 3152, 16, -4, 51,
          25, 0, 85, 25, 0, 84, 39, 3, 49, 22, 3084, 16, 17, 51, 15, 33, 22,
          1e3, 12, 9, 51, 22, 2260, 44, -17, 51, 25, -1, 2, 27, 11, 25, -1, 3,
          25, -1, 4, 51, 33, 22, 1e3, 12, 9, 51, 22, 3152, 16, -4, 51, 43, 25,
          -1, 3, 25, -1, 4, 27, 11, 25, -1, 3, 25, -1, 5, 39, 2, 33, 22, 1e3,
          12, 9, 51, 22, 2260, 44, -17, 51, 25, -1, 2, 51, 22, 292, 8, -5, 51,
          41, 11, 24, 10048, 47, 0, 44, 10072, 32, -1, 6, 25, -1, 6, 22, 2712,
          8, 4, 39, 2, 49, 22, 876, 40, -9, 51, 41, 11, 22, 2052, 12, -3, 35,
          47, 0, 44, 10081, 10, 25, -1, 13, 22, 3192, 44, -12, 51, 22, 608, 20,
          14, 27, 11, 39, 0, 25, -1, 13, 15, 32, -1, 90, 13, 1, 32, -1, 91, 13,
          2, 32, -1, 92, 22, 1884, 12, -11, 35, 29, 22, 2052, 12, -3, 38, 44,
          10140, 39, 0, 22, 1884, 12, -11, 35, 15, 47, 0, 44, 10141, 9, 32, -1,
          93, 13, 0, 32, -1, 94, 13, 1, 32, -1, 95, 13, 2, 32, -1, 96, 13, 3,
          32, -1, 97, 13, 4, 32, -1, 98, 13, 5, 32, -1, 99, 13, 6, 32, -1, 100,
          13, 7, 32, -1, 101, 13, 8, 32, -1, 102, 39, 0, 13, 10198, 0, 47, 0,
          44, 10298, 39, 0, 1, 73, 32, -1, 0, 12, 0, 1, 28, 0, 32, -1, 2, 22,
          380, 20, -17, 13, 10224, 0, 47, 0, 44, 10257, 39, 0, 1, 74, 32, -1, 0,
          12, 2, 1, 2, 3, 25, -1, 3, 25, 73, 2, 25, -1, 2, 27, 11, 22, 2052, 12,
          -3, 35, 47, 0, 44, 10256, 10, 22, 1492, 4, 3, 13, 10268, 0, 47, 0, 44,
          10291, 39, 0, 1, 75, 32, -1, 0, 12, 1, 1, 2, 25, 73, 2, 25, -1, 2, 51,
          47, 0, 44, 10290, 10, 28, 2, 47, 0, 44, 10297, 10, 41, 32, -1, 103,
          13, 0, 32, -1, 104, 13, 1, 32, -1, 105, 13, 2, 32, -1, 106, 13, 3, 32,
          -1, 107, 13, 10, 32, -1, 108, 13, 11, 32, -1, 109, 13, 12, 32, -1,
          110, 13, 13, 32, -1, 111, 13, 20, 32, -1, 112, 13, 21, 32, -1, 113,
          13, 30, 32, -1, 114, 13, 40, 32, -1, 115, 13, 41, 32, -1, 116, 13, 50,
          32, -1, 117, 13, 51, 32, -1, 118, 13, 52, 32, -1, 119, 13, 53, 32, -1,
          120, 13, 60, 32, -1, 121, 13, 61, 32, -1, 122, 13, 62, 32, -1, 123,
          25, -1, 28, 25, -1, 21, 39, 2, 25, -1, 27, 41, 32, -1, 124, 25, -1,
          29, 25, -1, 21, 39, 2, 25, -1, 27, 41, 32, -1, 125, 25, -1, 31, 25,
          -1, 20, 39, 2, 25, -1, 27, 41, 32, -1, 126, 25, -1, 30, 25, -1, 22,
          39, 2, 25, -1, 27, 41, 32, -1, 127, 25, -1, 32, 25, -1, 25, 39, 2, 25,
          -1, 27, 41, 32, -1, 128, 25, -1, 33, 25, -1, 24, 39, 2, 25, -1, 27,
          41, 32, -1, 129, 25, -1, 34, 25, -1, 23, 39, 2, 25, -1, 27, 41, 32,
          -1, 130, 25, -1, 35, 25, -1, 26, 39, 2, 25, -1, 27, 41, 32, -1, 131,
          13, 1, 13, 0, 19, 32, -1, 132, 13, 1, 13, 1, 19, 32, -1, 133, 13, 1,
          13, 2, 19, 32, -1, 134, 13, 1, 13, 3, 19, 32, -1, 135, 13, 1, 13, 4,
          19, 32, -1, 136, 13, 1, 13, 5, 19, 32, -1, 137, 13, 1, 13, 6, 19, 32,
          -1, 138, 13, 1, 13, 7, 19, 32, -1, 139, 13, 1, 13, 8, 19, 32, -1, 140,
          13, 0, 32, -1, 141, 13, 1, 32, -1, 142, 13, 16, 32, -1, 143, 13, 150,
          13, 1e3, 40, 32, -1, 144, 13, 1, 32, -1, 145, 13, 2, 32, -1, 146, 13,
          3, 32, -1, 147, 13, 4, 32, -1, 148, 13, 5, 32, -1, 149, 13, 6, 32, -1,
          150, 13, 10654, 0, 47, 0, 44, 10978, 39, 0, 1, 76, 32, -1, 0, 12, 0,
          1, 33, 32, -1, 2, 13, 10675, 0, 47, 0, 44, 10841, 39, 0, 1, 77, 32,
          -1, 0, 12, 1, 1, 2, 13, 10693, 0, 47, 0, 44, 10819, 39, 0, 1, 78, 32,
          -1, 0, 12, 1, 1, 2, 25, -1, 2, 22, 3756, 24, -12, 51, 22, 92, 20, 15,
          57, 44, 10809, 13, 0, 32, -1, 3, 25, -1, 2, 22, 76, 16, 3, 51, 22,
          3332, 16, 7, 51, 32, -1, 4, 25, -1, 3, 25, -1, 4, 16, 44, 10809, 25,
          -1, 2, 22, 76, 16, 3, 51, 25, -1, 3, 51, 32, -1, 5, 25, -1, 5, 22,
          3984, 16, 10, 51, 22, 304, 8, -8, 35, 22, 772, 20, -1, 51, 57, 44,
          10800, 25, -1, 5, 39, 1, 25, 76, 2, 22, 400, 44, 5, 51, 41, 11, 30,
          -1, 3, 0, 11, 47, 0, 44, 10740, 22, 2052, 12, -3, 35, 47, 0, 44,
          10818, 10, 39, 1, 25, -1, 2, 22, 1064, 12, 13, 51, 41, 11, 22, 2052,
          12, -3, 35, 47, 0, 44, 10840, 10, 32, -1, 3, 22, 1872, 12, 18, 35, 29,
          22, 348, 32, -22, 57, 34, 44, 10875, 11, 22, 1872, 12, 18, 35, 22,
          4520, 12, 13, 51, 29, 22, 2220, 16, 10, 57, 44, 10911, 25, -1, 3, 39,
          1, 22, 520, 24, 1, 35, 39, 2, 22, 1872, 12, 18, 35, 22, 4520, 12, 13,
          51, 41, 33, 22, 3636, 44, -14, 27, 11, 47, 0, 44, 10929, 25, -1, 3,
          39, 1, 22, 520, 24, 1, 35, 15, 33, 22, 3636, 44, -14, 27, 11, 22,
          3308, 16, 9, 47, 1, 22, 92, 20, 15, 47, 1, 28, 2, 22, 940, 16, 20, 35,
          22, 2120, 12, 4, 51, 39, 2, 33, 22, 3636, 44, -14, 51, 22, 556, 12, 6,
          51, 41, 11, 22, 2052, 12, -3, 35, 47, 0, 44, 10977, 10, 25, -1, 36,
          22, 3192, 44, -12, 51, 22, 2752, 32, 4, 27, 11, 13, 10999, 0, 47, 0,
          44, 11151, 39, 0, 1, 79, 32, -1, 0, 12, 0, 1, 28, 0, 32, -1, 2, 33,
          22, 1e3, 12, 9, 51, 22, 4260, 4, 3, 51, 39, 1, 22, 3256, 12, 18, 35,
          22, 52, 24, -20, 51, 41, 32, -1, 3, 25, -1, 3, 22, 3332, 16, 7, 51,
          32, -1, 4, 13, 0, 32, -1, 5, 25, -1, 5, 25, -1, 4, 16, 44, 11143, 25,
          -1, 3, 25, -1, 5, 51, 32, -1, 6, 25, -1, 6, 33, 22, 1e3, 12, 9, 51,
          22, 1420, 24, 16, 51, 45, 44, 11134, 33, 22, 1e3, 12, 9, 51, 22, 1420,
          24, 16, 51, 25, -1, 6, 51, 32, -1, 7, 33, 22, 1e3, 12, 9, 51, 22,
          4260, 4, 3, 51, 25, -1, 6, 51, 25, -1, 2, 25, -1, 7, 27, 11, 30, -1,
          5, 0, 11, 47, 0, 44, 11057, 25, -1, 2, 47, 0, 44, 11150, 10, 25, -1,
          36, 22, 3192, 44, -12, 51, 22, 1552, 28, -1, 27, 11, 13, 11172, 0, 47,
          0, 44, 11332, 39, 0, 1, 80, 32, -1, 0, 12, 1, 1, 2, 33, 22, 1e3, 12,
          9, 51, 22, 4260, 4, 3, 51, 54, 44, 11211, 28, 0, 33, 22, 1e3, 12, 9,
          51, 22, 4260, 4, 3, 27, 11, 33, 22, 1e3, 12, 9, 51, 22, 1420, 24, 16,
          51, 54, 44, 11253, 28, 0, 33, 22, 1e3, 12, 9, 51, 22, 1420, 24, 16,
          27, 11, 13, 0, 33, 22, 1e3, 12, 9, 51, 22, 3288, 20, 22, 27, 11, 22,
          3412, 112, -20, 39, 1, 25, -1, 2, 22, 1612, 76, -17, 51, 41, 32, -1,
          3, 25, -1, 3, 22, 3332, 16, 7, 51, 32, -1, 4, 13, 0, 32, -1, 5, 25,
          -1, 5, 25, -1, 4, 16, 44, 11322, 25, -1, 3, 25, -1, 5, 51, 39, 1, 33,
          22, 716, 44, -15, 51, 41, 11, 30, -1, 5, 0, 11, 47, 0, 44, 11287, 22,
          2052, 12, -3, 35, 47, 0, 44, 11331, 10, 25, -1, 36, 22, 3192, 44, -12,
          51, 22, 400, 44, 5, 27, 11, 13, 11353, 0, 47, 0, 44, 11476, 39, 0, 1,
          81, 32, -1, 0, 12, 1, 1, 2, 25, -1, 2, 39, 1, 25, 0, 14, 41, 32, -1,
          3, 25, -1, 3, 33, 22, 1e3, 12, 9, 51, 22, 4260, 4, 3, 51, 45, 54, 44,
          11466, 25, -1, 2, 39, 1, 25, 0, 17, 41, 32, -1, 4, 25, -1, 4, 33, 22,
          1e3, 12, 9, 51, 22, 4260, 4, 3, 51, 25, -1, 3, 27, 11, 33, 22, 1e3,
          12, 9, 51, 22, 3288, 20, 22, 51, 33, 22, 1e3, 12, 9, 51, 22, 1420, 24,
          16, 51, 25, -1, 3, 27, 11, 13, 1, 33, 22, 1e3, 12, 9, 51, 22, 3288,
          20, 22, 46, 11, 22, 2052, 12, -3, 35, 47, 0, 44, 11475, 10, 25, -1,
          36, 22, 3192, 44, -12, 51, 22, 716, 44, -15, 27, 11, 13, 11497, 0, 47,
          0, 44, 12162, 39, 0, 1, 82, 32, -1, 0, 12, 1, 1, 2, 25, -1, 2, 34, 54,
          44, 11518, 11, 28, 0, 55, -1, 2, 11, 28, 0, 33, 22, 1e3, 12, 9, 51,
          22, 2720, 8, 16, 27, 11, 25, -1, 2, 25, 0, 145, 51, 47, 0, 38, 33, 22,
          1e3, 12, 9, 51, 22, 2720, 8, 16, 51, 25, 0, 145, 27, 11, 25, -1, 2,
          25, 0, 146, 51, 47, 0, 38, 33, 22, 1e3, 12, 9, 51, 22, 2720, 8, 16,
          51, 25, 0, 146, 27, 11, 25, -1, 2, 25, 0, 147, 51, 47, 0, 38, 33, 22,
          1e3, 12, 9, 51, 22, 2720, 8, 16, 51, 25, 0, 147, 27, 11, 25, -1, 2,
          25, 0, 148, 51, 47, 0, 38, 33, 22, 1e3, 12, 9, 51, 22, 2720, 8, 16,
          51, 25, 0, 148, 27, 11, 25, -1, 2, 25, 0, 149, 51, 47, 0, 38, 33, 22,
          1e3, 12, 9, 51, 22, 2720, 8, 16, 51, 25, 0, 149, 27, 11, 25, -1, 2,
          25, 0, 150, 51, 47, 0, 38, 33, 22, 1e3, 12, 9, 51, 22, 2720, 8, 16,
          51, 25, 0, 150, 27, 11, 39, 0, 22, 580, 8, 17, 35, 22, 1204, 8, -5,
          51, 41, 33, 22, 1e3, 12, 9, 51, 22, 3152, 16, -4, 27, 11, 39, 0, 33,
          22, 2752, 32, 4, 51, 41, 11, 22, 940, 16, 20, 35, 22, 2120, 12, 4, 51,
          39, 1, 33, 22, 400, 44, 5, 51, 41, 11, 33, 22, 1e3, 12, 9, 51, 22,
          444, 48, -19, 51, 47, 0, 57, 44, 12138, 22, 940, 16, 20, 35, 22, 2120,
          12, 4, 51, 39, 1, 5, 15, 32, -1, 3, 25, 0, 129, 22, 544, 12, -10, 25,
          0, 150, 39, 3, 25, 0, 129, 22, 3884, 28, -20, 25, 0, 150, 39, 3, 25,
          0, 130, 22, 1028, 8, 4, 25, 0, 149, 39, 3, 25, 0, 128, 22, 3068, 16,
          -1, 25, 0, 148, 39, 3, 25, 0, 128, 22, 3620, 16, -6, 25, 0, 148, 39,
          3, 25, 0, 128, 22, 2884, 16, -11, 25, 0, 148, 39, 3, 25, 0, 128, 22,
          1332, 8, -2, 25, 0, 148, 39, 3, 25, 0, 126, 22, 916, 12, 0, 25, 0,
          147, 39, 3, 25, 0, 126, 22, 2732, 20, 13, 25, 0, 147, 39, 3, 25, 0,
          126, 22, 2792, 20, 6, 25, 0, 147, 39, 3, 25, 0, 127, 22, 1220, 12, 5,
          25, 0, 146, 39, 3, 25, 0, 127, 22, 4240, 12, -3, 25, 0, 146, 39, 3,
          25, 0, 125, 22, 3864, 20, 12, 25, 0, 145, 39, 3, 25, 0, 125, 22, 816,
          28, -11, 25, 0, 145, 39, 3, 25, 0, 124, 22, 152, 12, -4, 25, 0, 145,
          39, 3, 25, 0, 125, 22, 1156, 16, 13, 25, 0, 145, 39, 3, 25, 0, 131,
          22, 3028, 40, -14, 25, 0, 145, 39, 3, 25, 0, 131, 22, 2672, 20, 14,
          25, 0, 145, 39, 3, 25, 0, 131, 22, 1036, 28, 17, 25, 0, 145, 39, 3,
          39, 19, 32, -1, 4, 25, -1, 4, 22, 3332, 16, 7, 51, 32, -1, 5, 13, 0,
          32, -1, 6, 25, -1, 6, 25, -1, 5, 16, 44, 12124, 25, -1, 4, 25, -1, 6,
          51, 32, -1, 7, 25, -1, 7, 13, 1, 51, 32, -1, 8, 33, 22, 1e3, 12, 9,
          51, 22, 2720, 8, 16, 51, 25, -1, 7, 13, 0, 51, 51, 47, 1, 57, 44,
          12115, 47, 1, 33, 22, 608, 20, 14, 51, 25, -1, 8, 39, 2, 25, -1, 7,
          13, 2, 51, 41, 25, -1, 8, 39, 3, 25, -1, 3, 22, 2900, 24, -1, 51, 41,
          11, 30, -1, 6, 0, 11, 47, 0, 44, 12029, 47, 1, 33, 22, 1e3, 12, 9, 51,
          22, 444, 48, -19, 27, 11, 47, 1, 33, 22, 1e3, 12, 9, 51, 22, 4048, 20,
          11, 27, 11, 22, 2052, 12, -3, 35, 47, 0, 44, 12161, 10, 25, -1, 36,
          22, 3192, 44, -12, 51, 22, 2720, 8, 16, 27, 11, 13, 12183, 0, 47, 0,
          44, 12240, 39, 0, 1, 83, 32, -1, 0, 12, 0, 1, 33, 22, 3636, 44, -14,
          51, 44, 12216, 39, 0, 33, 22, 3636, 44, -14, 51, 22, 1076, 16, 15, 51,
          41, 11, 47, 0, 33, 22, 1e3, 12, 9, 51, 22, 4048, 20, 11, 27, 11, 22,
          2052, 12, -3, 35, 47, 0, 44, 12239, 10, 25, -1, 36, 22, 3192, 44, -12,
          51, 22, 928, 12, 22, 27, 11, 13, 12261, 0, 47, 0, 44, 12417, 39, 0, 1,
          84, 32, -1, 0, 12, 0, 1, 28, 0, 32, -1, 2, 33, 22, 1e3, 12, 9, 51, 22,
          2260, 44, -17, 51, 39, 1, 22, 3256, 12, 18, 35, 22, 52, 24, -20, 51,
          41, 32, -1, 3, 25, -1, 3, 22, 3332, 16, 7, 51, 32, -1, 4, 13, 0, 32,
          -1, 5, 25, -1, 5, 25, -1, 4, 16, 44, 12378, 25, -1, 3, 25, -1, 5, 51,
          32, -1, 6, 39, 0, 33, 22, 1e3, 12, 9, 51, 22, 2260, 44, -17, 51, 25,
          -1, 6, 51, 22, 492, 28, -22, 51, 41, 25, -1, 2, 25, -1, 6, 27, 11, 30,
          -1, 5, 0, 11, 47, 0, 44, 12319, 33, 22, 1e3, 12, 9, 51, 22, 3152, 16,
          -4, 51, 39, 0, 33, 22, 1552, 28, -1, 51, 41, 25, -1, 2, 39, 0, 33, 22,
          668, 48, 11, 51, 41, 39, 4, 47, 0, 44, 12416, 10, 25, -1, 36, 22,
          3192, 44, -12, 51, 22, 492, 28, -22, 27, 11, 13, 12438, 0, 47, 0, 44,
          12474, 39, 0, 1, 85, 32, -1, 0, 12, 2, 1, 2, 3, 25, -1, 3, 33, 22,
          1176, 28, -13, 51, 25, -1, 2, 27, 11, 22, 2052, 12, -3, 35, 47, 0, 44,
          12473, 10, 25, -1, 36, 22, 3192, 44, -12, 51, 22, 1956, 20, 22, 27,
          11, 13, 12495, 0, 47, 0, 44, 12538, 39, 0, 1, 86, 32, -1, 0, 12, 0, 1,
          28, 0, 33, 22, 1176, 28, -13, 27, 11, 28, 0, 33, 22, 1e3, 12, 9, 51,
          22, 2260, 44, -17, 27, 11, 22, 2052, 12, -3, 35, 47, 0, 44, 12537, 10,
          25, -1, 36, 22, 3192, 44, -12, 51, 22, 980, 20, 4, 27, 11, 13, 12559,
          0, 47, 0, 44, 13006, 39, 0, 1, 87, 32, -1, 0, 12, 2, 1, 2, 3, 33, 22,
          1e3, 12, 9, 51, 22, 4048, 20, 11, 51, 47, 0, 57, 44, 12592, 7, 47, 0,
          44, 13005, 37, 12976, 13, 10, 25, -1, 2, 39, 2, 22, 140, 12, -4, 35,
          41, 55, -1, 2, 11, 25, -1, 3, 22, 3332, 16, 7, 51, 13, 1, 43, 32, -1,
          4, 25, -1, 3, 25, -1, 4, 51, 33, 22, 1e3, 12, 9, 51, 22, 3152, 16, -4,
          51, 43, 32, -1, 5, 25, -1, 3, 25, -1, 3, 22, 3332, 16, 7, 51, 13, 2,
          43, 51, 32, -1, 6, 33, 22, 1e3, 12, 9, 51, 22, 2260, 44, -17, 51, 25,
          -1, 2, 51, 54, 44, 12725, 33, 22, 1e3, 12, 9, 51, 22, 3152, 16, -4,
          51, 25, 0, 144, 25, 0, 143, 39, 3, 56, 22, 3084, 16, 17, 51, 15, 33,
          22, 1e3, 12, 9, 51, 22, 2260, 44, -17, 51, 25, -1, 2, 27, 11, 25, -1,
          2, 25, 0, 114, 58, 34, 44, 12743, 11, 25, -1, 2, 25, 0, 115, 16, 44,
          12803, 25, -1, 3, 13, 2, 51, 32, -1, 7, 25, -1, 7, 33, 22, 1e3, 12, 9,
          51, 22, 4260, 4, 3, 51, 25, -1, 6, 27, 11, 25, -1, 3, 13, 4, 51, 25,
          -1, 3, 13, 3, 51, 25, -1, 3, 13, 1, 51, 25, -1, 3, 13, 0, 51, 39, 4,
          55, -1, 3, 11, 25, -1, 3, 22, 3332, 16, 7, 51, 13, 1, 43, 55, -1, 4,
          11, 25, -1, 3, 25, -1, 4, 51, 33, 22, 1e3, 12, 9, 51, 22, 3152, 16,
          -4, 51, 43, 25, -1, 3, 25, -1, 4, 27, 11, 25, -1, 3, 22, 3332, 16, 7,
          51, 13, 2, 43, 32, -1, 8, 33, 22, 1e3, 12, 9, 51, 22, 1420, 24, 16,
          51, 25, -1, 6, 51, 32, -1, 9, 25, -1, 9, 25, -1, 3, 25, -1, 8, 27, 11,
          33, 22, 1e3, 12, 9, 51, 22, 4260, 4, 3, 51, 25, -1, 6, 51, 32, -1, 10,
          25, -1, 10, 54, 44, 12917, 7, 47, 0, 44, 13005, 25, -1, 10, 13, 0, 51,
          32, -1, 11, 25, -1, 11, 25, 0, 101, 57, 44, 12940, 7, 47, 0, 44,
          13005, 25, -1, 3, 25, -1, 5, 39, 2, 33, 22, 1e3, 12, 9, 51, 22, 2260,
          44, -17, 51, 25, -1, 2, 51, 22, 292, 8, -5, 51, 41, 11, 24, 12972, 47,
          0, 44, 12996, 32, -1, 12, 25, -1, 12, 22, 1756, 28, -13, 39, 2, 56,
          22, 876, 40, -9, 51, 41, 11, 22, 2052, 12, -3, 35, 47, 0, 44, 13005,
          10, 25, -1, 36, 22, 3192, 44, -12, 51, 22, 608, 20, 14, 27, 11, 13,
          13027, 0, 47, 0, 44, 13065, 39, 0, 1, 88, 32, -1, 0, 12, 2, 1, 2, 3,
          25, -1, 3, 25, -1, 2, 39, 2, 33, 22, 608, 20, 14, 51, 41, 11, 22,
          2052, 12, -3, 35, 47, 0, 44, 13064, 10, 25, -1, 36, 22, 3192, 44, -12,
          51, 22, 1984, 12, 1, 27, 11, 13, 13086, 0, 47, 0, 44, 13231, 39, 0, 1,
          89, 32, -1, 0, 12, 0, 1, 13, 0, 32, -1, 2, 33, 22, 1e3, 12, 9, 51, 22,
          2720, 8, 16, 51, 32, -1, 3, 25, -1, 3, 25, 0, 145, 51, 44, 13133, 13,
          1, 13, 0, 19, 4, -1, 2, 11, 25, -1, 3, 25, 0, 146, 51, 44, 13151, 13,
          1, 13, 1, 19, 4, -1, 2, 11, 25, -1, 3, 25, 0, 147, 51, 44, 13169, 13,
          1, 13, 2, 19, 4, -1, 2, 11, 25, -1, 3, 25, 0, 148, 51, 44, 13187, 13,
          1, 13, 3, 19, 4, -1, 2, 11, 25, -1, 3, 25, 0, 149, 51, 44, 13205, 13,
          1, 13, 4, 19, 4, -1, 2, 11, 25, -1, 3, 25, 0, 150, 51, 44, 13223, 13,
          1, 13, 5, 19, 4, -1, 2, 11, 25, -1, 2, 47, 0, 44, 13230, 10, 25, -1,
          36, 22, 3192, 44, -12, 51, 22, 668, 48, 11, 27, 11, 39, 0, 25, -1, 36,
          15, 32, -1, 151, 13, 13261, 0, 47, 0, 44, 13291, 39, 0, 1, 90, 32, -1,
          0, 12, 0, 1, 13, 0, 50, 33, 22, 3580, 40, -14, 27, 11, 22, 2052, 12,
          -3, 35, 47, 0, 44, 13290, 10, 25, -1, 37, 22, 3192, 44, -12, 51, 22,
          3112, 28, 5, 27, 11, 13, 13312, 0, 47, 0, 44, 13343, 39, 0, 1, 91, 32,
          -1, 0, 12, 1, 1, 2, 25, -1, 2, 33, 22, 3580, 40, -14, 27, 11, 22,
          2052, 12, -3, 35, 47, 0, 44, 13342, 10, 25, -1, 37, 22, 3192, 44, -12,
          51, 22, 2008, 20, -10, 27, 11, 13, 13364, 0, 47, 0, 44, 13385, 39, 0,
          1, 92, 32, -1, 0, 12, 0, 1, 33, 22, 3580, 40, -14, 51, 47, 0, 44,
          13384, 10, 25, -1, 37, 22, 3192, 44, -12, 51, 22, 492, 28, -22, 27,
          11, 25, -1, 37, 32, -1, 152, 39, 0, 25, -1, 152, 15, 32, -1, 153, 13,
          13421, 0, 47, 0, 44, 13693, 39, 0, 1, 93, 11, 12, 2, 0, 1, 2, 25, -1,
          2, 13, 0, 50, 57, 44, 13446, 13, 0, 55, -1, 2, 11, 13, 3735928559, 25,
          -1, 2, 26, 32, -1, 3, 13, 1103547991, 25, -1, 2, 26, 32, -1, 4, 22,
          1212, 8, 1, 35, 22, 2188, 8, -10, 51, 32, -1, 5, 25, -1, 1, 39, 1, 25,
          -1, 1, 22, 1340, 32, -16, 51, 22, 628, 8, -4, 51, 41, 32, -1, 6, 25,
          -1, 1, 22, 3332, 16, 7, 51, 32, -1, 7, 13, 0, 32, -1, 8, 25, -1, 8,
          25, -1, 7, 16, 44, 13584, 25, -1, 8, 39, 1, 25, -1, 6, 41, 55, -1, 9,
          11, 13, 2654435761, 25, -1, 3, 25, -1, 9, 26, 39, 2, 25, -1, 5, 41,
          55, -1, 3, 11, 13, 1597334677, 25, -1, 4, 25, -1, 9, 26, 39, 2, 25,
          -1, 5, 41, 55, -1, 4, 11, 30, -1, 8, 0, 11, 47, 0, 44, 13515, 13,
          2246822507, 25, -1, 3, 25, -1, 3, 13, 16, 6, 26, 39, 2, 25, -1, 5, 41,
          55, -1, 3, 11, 13, 3266489909, 25, -1, 4, 25, -1, 4, 13, 13, 6, 26,
          39, 2, 25, -1, 5, 41, 8, -1, 3, 11, 13, 2246822507, 25, -1, 4, 25, -1,
          4, 13, 16, 6, 26, 39, 2, 25, -1, 5, 41, 55, -1, 4, 11, 13, 3266489909,
          25, -1, 3, 25, -1, 3, 13, 13, 6, 26, 39, 2, 25, -1, 5, 41, 8, -1, 4,
          11, 13, 4294967296, 13, 2097151, 25, -1, 4, 14, 40, 25, -1, 3, 13, 0,
          6, 2, 47, 0, 44, 13692, 10, 32, -1, 154, 22, 2372, 264, 14, 13, 1, 36,
          13, 1, 36, 39, 0, 25, -1, 43, 41, 13, 1, 36, 13, 1, 36, 39, 0, 25, -1,
          40, 41, 39, 0, 25, -1, 39, 41, 39, 8, 32, -1, 155, 13, 13742, 0, 47,
          0, 44, 13757, 39, 0, 1, 94, 11, 12, 0, 0, 39, 0, 25, 0, 45, 41, 10,
          13, 13764, 0, 47, 0, 44, 13779, 39, 0, 1, 95, 11, 12, 0, 0, 39, 0, 25,
          0, 44, 41, 10, 9, 13, 13787, 0, 47, 0, 44, 13802, 39, 0, 1, 96, 11,
          12, 0, 0, 39, 0, 25, 0, 42, 41, 10, 13, 13809, 0, 47, 0, 44, 13824,
          39, 0, 1, 97, 11, 12, 0, 0, 39, 0, 25, 0, 41, 41, 10, 9, 9, 39, 7, 32,
          -1, 156, 39, 0, 13, 0, 50, 39, 0, 39, 3, 32, -1, 157, 39, 0, 32, -1,
          158, 25, -1, 153, 22, 2728, 4, -15, 21, 25, -1, 151, 22, 260, 4, -20,
          21, 25, -1, 90, 22, 1256, 4, -4, 21, 25, -1, 50, 22, 664, 4, -3, 21,
          25, -1, 51, 22, 0, 16, 20, 21, 25, -1, 50, 22, 4380, 88, -20, 21,
        ],
        _WQDqzIY: atob(
          "WHlVMk1FMGxOVVVsTmpBPWRHbHdKVFZGSlVNeUpUZ3dKVGRFSlRkQ2R5VkRNaVU0TVhNPUpUZEdlU1ZETWlVNFJDVkRNaVU0Tnc9PUpUVkZZV0ZpWVV0c1lXSndWRmxhSlRWRVZTVXpSRnBrWlE9PUpVTXlKVGd6Ym5rbFF6SWxPREp5SlVNeUpUZ3hkR1YyZDJsTmNuZz1jWE41ZDJseGMzcHBZbU09ZG5GeUpUZENKVU15SlRneGRuTjJjaVUzUmc9PVZGbGpVVklsTlVOVlZBPT1KVU15SlRneUpUZEVKVU15SlRnemNYWnpKVU15SlRneFIxQk1Tdz09Y0dSelNRPT1kZz09V0NVMVJHVT1KVFZDSlRWRFVWSWxNMEpPV2xJPWRYcDRiUT09TVE9PVZuZHNiUT09WWxrPVkxUm1abXBpWlZjPUpUVkZZVlZUWmlVMVFtRWxOakE9SlVNeUpUZzFlQ1ZETWlVNE1DVTNRbmtsUXpJbE9FRT1KVU15SlRnMGRpVkRNaVU0TlE9PWF5VTFRMjF1SlRZd1NTVTJNSEpCYW0xb0pUUXdaeVUyTUdnbE5qQnBiMjQ9SlRkREpVTXlKVGd4SlRkREpVTXlKVGczWlhoMkpVTXlKVGd5SlVNeUpUZzFkdz09SlRkRUpUZENKVU15SlRoQlduY2xReklsT0VGM1RIUnpKVFl3YzJodWJVNWhjbVJ4ZFdSeGVtc2xOMFIrYnc9PWFTVTFRMjFmYkhCZmJHUnljaVUyTUdaa00xQmpWQT09U0MwbE5VSk9XbElxSlRCR1YyUmxVV1JYVldGa1ZqZG9WeVUyTUdZPVptMXlhQT09SlROREpUVkVaQ1UxUkd3bE5VUT1KVU15SlRnMmRnPT1WRnBqV0dSWldqaGtZeVUxUWlVMVJTVTFRMGxrTnlVMVJXa2xOVUpoVmlVMVEyZz1jSE56Vlg0bFF6SWxPREVsTjBOVUpUZENkQ1UzUTNRbE4wUWxReklsT0RNPVpsWT1jbU4wWjNCMlJrMUdUa1pQVlNVMk1FOVFSVVk9Y0daM1lnPT1KVFZGWTJsYVoydFdZUT09ZUhvbFF6SWxPREIrY0NWRE1pVTRNQ1UzUWc9PWZpVkRNaVU0TVhoMmVDVTNSQT09SlRWRVRsUlNSZz09SlRkRGJuY2xOMFFsTjBJbFF6SWxPREpPSlRkQ0pUZENlQ1UzUWc9PWRHOTFZMmhsYm1RPUpUVkVKVFZGV1ZvPVVDVTFRazloV1ZGYUpUWXdiMkZtSlRWRFoyOVJWQ1UxUlRsTU9RPT1ibUZ2WVhBbE5EQWxOVVJ3SlRWRWFtdFlheVUxUXc9PWJRPT1XbEpoVGpoU1pnPT1aV3BzY1hBPVh5VTFSVmdsTlVSalZHRlRKVFZGWmlVMVJBPT1XV0psT0ZSV0pUVkNWVnBrVkNVMk1GOWZWbFJsZFdoMGVHeDFhR2M9SlVNeUpUZzFlbjUySlVNeUpUZ3hjM3B6Y1NWRE1pVTRNbmNsTjBRbE4wTlRKVGREY2c9PUpUWXdZbWhtV0ZkaWFtRT1lZz09YkhwdUpUZENkbk55SlVNeUpUZ3dKVU15SlRneGMzUWxOME09VENVMk1ITm5aaVUyTUhSZmFuSnBhVnBvYVE9PVRscFRVa3R5YTNOcmRIbz1jUT09Y1NVM1F5VkRNaVU0TkNVMVFuVWxReklsT0RrPVoySWxNMFppYWxobE5sUm1XQT09VVc5K0pVTXlKVGd4V2lVM1JIRjVjdz09YUhGbGQzVT1jM2h4SlVNeUpUZ3lVeVUzUm5SMVVTVkRNaVU0TkE9PVdtTWxOakFsTlVObGExQT1KVFZFSlRWREpUWXdZU1V6UVZJbE5qQWxOakJPVkZJPVZpVTFSRTlZVVdOWVR5VTFSRkVsTmpBPWEyNGxOMFJxSlRkQ0pUZEVKVU15SlRnekpVTXlKVGd4Y3c9PUpUVkNZbHBQVWw4PVpHSnhmbThsUXpJbE9EQnpKVGRESlVNeUpUZ3lKVFZESlRkRWNuTT1KVGRDYlhKb2N5VTNRZz09SlRGRGFHWjFSMjVVZFdKMVpsaHFkV2xLYjJWcVpHWjBmaVUzUW5VPUpURTRVdz09U0NVMVFpVTFSQ1V6UW01bUpVTXlKVGd5SlVNeUpUZzJkaVZETWlVNE15VkRNaVU0UVdSMkpUZEVkblFsUXpJbE9EVWxReklsT0RBbFF6SWxPRE5TSlRkRUpUZEVZbVU9SlRkRGJnPT1VVk5UVlNVMVExVmlVV1JaWHlVMVJRPT1iR2RsZEhobmJHVT1aMkk9SlRWRlpIWm5iaVUxUldRPVQxWmFKVGRESlVNeUpUZ3hkaVUzUXlVM1FnPT1hbVI0SlRkR0pUZENKVU15SlRneGZtOXhaR01sTlVSaWFGbG1TRzFrV1E9PUpVTXlKVGd5YzNvPWRYRjJWQ1UxUlNVelJpVTFSQ1UyTUNVMVJWOVFUdz09SlRRd1UxUmFVMUZpWW5Cc2RsaHNKVGRDYW1oM1JuSmtiMmgyWm1oblNIbG9jWGQySlVNeUpUZ3hKVU15SlRnMGRubHBmaVZETWlVNE1ubz1aR04wSlRWRVR5VTFSUzVMSlRWRlN3PT1WVjlTVXc9PWIzUnlaMFIxWkcxelYySm1KVFZGVnc9PUpUZEVmbmtsTjBOdlRtdCthdz09TkNVMVJHTlVZUT09Y25OeGFHMW1hR1Y0ZUhGbmFHbHNjV2huZUcxdWEzbFFhbjQ9ZENWRE1pVTROWFFsTjBRbFF6SWxPRE5TZm40bFF6SWxPREZ6SlVNeUpUZ3lKVFZGYXlVMk1IVT1lQ1UzUkhOMEpVTXlKVGczSlRWRmRRPT1KVU15SlRnMEpUZERKVU15SlRnekpVTXlKVGd5ZVE9PWMzY2xOMFoySlRZd2JnPT1UbGRVVUZsZlF3PT1jMkk9SlRWRGEyUlphbDlsWkE9PUpVTXlKVGd3SlVNeUpUZzBKVU15SlRnNEpVTXlKVGcxZW41MlV5VkRNaVU0Tm5kM2RpVkRNaVU0TXlWRE1pVTROQT09WTFWa1JGa2xOVVJWWDJWa0pVTXlKVGc1SlRkRWJpVkRNaVU0TVNVM1JHb2xOMEp1YWc9PVpWY2xOVU5TSlRWRVpVWT1KVE5GTTBRbE5qQmFLRVZKUkVGbk5VRWxNMFFsTWpOakpUVkNOamcxWlNVelFTVXlOU1V5TkRRcFNWbEZSMnBoSlROQ1ZTY3pKVE5ESjJOTEpUSXlWa2NsTWpKaElUTTRhU1V6UmtvbE5VTlRURGhYSlRWREpUWXdRVk1sTWpZbE0wSm9OVVFsTTBOS1dtbEhLa2tsTTBORUtTVXpSRFZUWlZWR0lTb3BKVEl6UlZnbE0wVkdZaVV6UlNVMVJDbEVaeVV5TkdaTWFVZ2xOVU1sTWpaV1ZHdzRheVV4UkNwaE5tUkxTR01sTTBKVWFDVTFReVV4UkdNaEpUVkNaaWdsTTBGSE13PT1jaVZETWlVNE15VkRNaVU0TVNVM1FscDBKVU15SlRnNFpBPT1ZbUVsTlVJbE5qQm1WMlJmWVdoWGJRPT1lSGs9ZVdsNGEydDBKVFZGYVd0d1pXdHFZbFZUWDJKVWNBPT1aMkpvVmlVMVFpVTJNR0pwV0E9PVpXcGxjRWx4Y0NVMVJIQmxhMnBMSlRWRmIyRnVjbUZ1SlRWRVRnPT1ibWx2SlRWRVltMXVKVFZDYkc0PVZ5VTFReVUxUkNVMk1GaENZMWhaWnc9PWFuSm1ibkU9V0ZJbE5VVWxOVVZTYzJ4cFkyVT1hMlpzV2w5YVdHVmFKVFZEWXc9PWJYY2xReklsT0RBbE4wUT1ZbVZsUm5kbWIzVk5hblIxWm05bWN3PT1aUT09SlVNeUpUZzNlU1ZETWlVNE1IbDNKVU15SlRnNEpUZEVKVU15SlRnekpVTXlKVGd5WnlWRE1pVTRPSFVsUXpJbE9EWWxReklsT0RnPUpUSXlZMWhsV1dKbEpUWXdWR0ZXV0E9PWZpVTNSSGNsTjBNbFF6SWxPREp6SlVNeUpUZ3dKVU15SlRnemZnPT1ibkIyZEdadFptSjNaZz09UTFnbE5VTlVNV1JWVlZSaEpUZERlU1UzUm5odUpUVkZaeVUyTUNVMVEyMGxNMFlsTlVOdkpUVkRjbThsUXpJbE9ESnZkbWxuYzNab1dHMXhhUT09VWlVMVFsaGZVU1UxUlZCaFV6TlFZMUE9SlRkRGZpVTNRaVZETWlVNE1DVTNRaVZETWlVNE1DVkRNaVU0TlNVM1EzRT1iMnNsTmpCaVpHZHVhMk5rY1E9PUpUTkVVRmhUVVdJPVlVNVVKVE5DVGxwU1pteGhkQT09VUZkSlVrc2xOVVJTU1ZOWVRrOWlhbXhaYTJrbE5VTWxOVU09WjNwblpRPT1aU1UxUldjbE5qQnRZUT09Y2lVM1FuQWxReklsT0RJbFF6SWxPRElsTlVSd0pUZERkQT09SlRkQ0pUZEVjSDUrSlVNeUpUZ3dKVGRFY0E9PUpUZEVKVU15SlRneUpVTXlKVGcwSlVNeUpUZzVKVU15SlRnNEpUUXdOQ1ZETWlVNE4za2xReklsT0RCNWR5VkRNaVU0T0NVME1EUWxReklsT0RoNUpVTXlKVGhESlVNeUpUZzRkU1ZETWlVNE5ubDFUeVUyTUNVMVJFeGZWRnBaZEdjbE4wTnZiV2Q2YjNWMEpUVkZYM0JqSlRWRVgyZHBibU5wYUE9PWJ5VTNReVZETWlVNE1TVkRNaVU0TlhNbFF6SWxPREFsUXpJbE9ERT1jM1VsTjBKNWEydDBlbXQ0YlNVM1JIQWxReklsT0RGekpVTXlKVGd3SlVNeUpUZzBjeVZETWlVNE1BPT1lSFlsUXpJbE9EVlNKVU15SlRnMUpVTXlKVGcxSlVNeUpUZ3plbk1sUXpJbE9EWWxReklsT0RWMkpUUXdKVFF3SlROQ2JGRjZkVTR6SlVNeUpUZ3dKVU15SlRnMUpUZERjUT09V2xobk9HRm5aU1UxUTFobU5XeEhiR05ZYkhGeGFIVlhhQ1UzUW5jPVl5VTJNR1ZTWlZvbE5qQmZRMUpsVmc9PVoyeGxjbXRwYUZoemVXZHNhWGM9V0ZZbE5qQlhKVFl3SlRWRVYxOD1keVZETWlVNE15VkRNaVU0TkNWRE1pVTRSQT09SlVNeUpUZ3hKVFZGSlRWRVZ5VTFRMkpUSlRZd04xST1kV2xtYm1ZPWNXb2xOME5LSlRkRUpUZEVKVGRDY210K0pUZEViZz09WkdWYUpUVkNTbTltSlRWQ0pUSXdWSE4xSlRkRUpVTXlKVGcxSlVNeUpUZ3ljM1YzSlVNeUpUZzBkU1UzUW5sc1oxcFlaR2RaSlRWRll5VTFRdz09WkZkVFZrRWxOakFsTlVWcmVtZDRiV3Q2VmlVMVEyVldOV2haV1VOb1ppVTFRZz09SlRWRlZWTmlKVE5DVTA4bE5VTWxNMFZUSlRZd1Z5VTFSRkk9YUhGbWVIZz1KVU15SlRnMmVIUWxReklsT0RWMkpUZENjbUp4WkdSdFdBPT1WVjhsTWtZbE5VSmFKVFl3VVZvbE5qQXhVRlVsTmpCTlRsaFJKVFZDVGxwU2JtZ2xOME40Y3c9PWMyUjNjdz09WTJvPUpUVkVhV0poSlRWRkpVTXlKVGd6SlVNeUpUZzFKVU15SlRoQkpVTXlKVGc1V2lWRE1pVTRNWG9sUXpJbE9ESjZKVU15SlRnekpVTXlKVGc1SlRORGRTVkRNaVU0TVhwNUpUTkRieVUzUTNFbFF6SWxPRFk9SlVNeUpUZzNKVU15SlRnNWRpVkRNaVU0TVNVM1JDVkRNaVU0T0dnbFF6SWxPRE1sTlVRbFF6SWxPRElsUXpJbE9EY2xReklsT0RSNUpUZEdKVU15SlRnNE1pVXpSVGMySlRORlQySWxOVVVsTWtJbE5VTlBTeVV5UmxaUFYwOVlKVFZGZEc5MVkyZz1WbUpoWm1kbGFGWm5KVFZEYjI1dWFXZz1hQT09VDB4ZlRDVTFSVkJm"
        ),
      };
      function t(e) {
        for (; e._sAEoUGclR6 !== e._YtF3hY; ) {
          var t = e._GO31Pjn[e._sAEoUGclR6++],
            n = e._X3J2E[t];
          "function" == typeof n && n(e);
        }
      }
      return (e._YtF3hY = e._GO31Pjn.length), t(e), e._ezKNTlP;
    })()),
      (pn = ln.s),
      (un = ln.m),
      (hn = ln.b),
      ln.a,
      (dn = ln.start);
  } catch (ir) {
    je("ob-error", "error", "api", { message: ir.message });
    var mn = function () {};
    (pn = function () {
      return Promise.resolve();
    }),
      (un = {
        record: mn,
        resetData: mn,
        setData: mn,
        getData: mn,
        stop: mn,
        circBuffPush: mn,
      }),
      (hn = { record: mn, stop: mn }),
      { storeData: mn, clearData: mn, getData: mn },
      (dn = mn);
  }
  function gn(e, t) {
    (this.cause = e), (this.message = t);
  }
  function yn(e) {
    gn.call(this, de, "Invalid hCaptcha id: " + e);
  }
  function vn() {
    gn.call(this, he, "No hCaptcha exists.");
  }
  function bn() {
    gn.call(
      this,
      pe,
      "Missing sitekey - https://docs.hcaptcha.com/configuration#javascript-api"
    );
  }
  gn.prototype = Error.prototype;
  var wn = [],
    _n = [],
    Sn = {
      add: function (e) {
        wn.push(e);
      },
      remove: function (e) {
        for (var t = !1, n = wn.length; --n > -1 && !1 === t; )
          wn[n].id === e.id && ((t = wn[n]), wn.splice(n, 1));
        return t;
      },
      each: function (e) {
        for (var t = -1; ++t < wn.length; ) e(wn[t]);
      },
      isValidId: function (e) {
        for (var t = !1, n = -1; ++n < wn.length && !1 === t; )
          wn[n].id === e && (t = !0);
        return t;
      },
      getByIndex: function (e) {
        for (var t = !1, n = -1; ++n < wn.length && !1 === t; )
          n === e && (t = wn[n]);
        return t;
      },
      getById: function (e) {
        for (var t = !1, n = -1; ++n < wn.length && !1 === t; )
          wn[n].id === e && (t = wn[n]);
        return t;
      },
      getCaptchaIdList: function () {
        var e = [];
        return (
          Sn.each(function (t) {
            e.push(t.id);
          }),
          e
        );
      },
      pushSession: function (e, t) {
        _n.push([e, t]), _n.length > 10 && _n.splice(0, _n.length - 10);
      },
      getSession: function () {
        return _n;
      },
    };
  function En(e, t) {
    "object" != typeof e || t || ((t = e), (e = null));
    var n,
      r,
      i,
      o = !0 === (t = t || {}).async,
      a = new Promise(function (e, t) {
        (r = e), (i = t);
      });
    if (
      ((a.resolve = r),
      (a.reject = i),
      (n = e ? Sn.getById(e) : Sn.getByIndex(0)))
    ) {
      Ge("Execute called", "hCaptcha", "info");
      try {
        fn.setData("exec", "api"), un.setData("exec", "api");
      } catch (tr) {
        je("Set MD Failed", "error", "execute", tr);
      }
      o && n.setPromise(a);
      try {
        nt(pn(n.id), 100)
          ["finally"](function () {
            try {
              n.onReady(n.initChallenge, t);
            } catch (tr) {
              De("onready", tr);
            }
          })
          ["catch"](function (e) {});
      } catch (tr) {
        je("SubmitVM Failed", "error", "execute", tr);
      }
    } else if (e) {
      if (!o) throw new yn(e);
      a.reject(de);
    } else {
      if (!o) throw new vn();
      a.reject(he);
    }
    if (o) return a;
  }
  function kn(e) {
    var t = "",
      n = null;
    n = e ? Sn.getById(e) : Sn.getByIndex(0);
    try {
      for (var r = Sn.getSession(), i = r.length, o = !1; --i > -1 && !o; )
        (o = r[i][1] === n.id) && (t = r[i][0]);
    } catch (ir) {
      t = "";
    }
    return t;
  }
  function Un(e, t, n) {
    (this.target = e),
      this.setTargetOrigin(n),
      (this.id = t),
      (this.messages = []),
      (this.incoming = []),
      (this.waiting = []),
      (this.isReady = !0),
      (this.queue = []);
  }
  (Un.prototype._sendMessage = function (e, t) {
    var n = e instanceof HTMLIFrameElement;
    try {
      n
        ? e.contentWindow.postMessage(JSON.stringify(t), this.targetOrigin)
        : e.postMessage(JSON.stringify(t), this.targetOrigin);
    } catch (tr) {
      De("messaging", tr),
        "*" !== this.targetOrigin &&
          (this.setTargetOrigin("*"), this._sendMessage(e, t));
    }
  }),
    (Un.prototype.setReady = function (e) {
      var t = this;
      (t.isReady = e),
        t.isReady &&
          t.queue.length &&
          (t.queue.forEach(function (e) {
            t._sendMessage.apply(t, e);
          }),
          t.clearQueue());
    }),
    (Un.prototype.clearQueue = function () {
      this.queue = [];
    }),
    (Un.prototype.setID = function (e) {
      this.id = e;
    }),
    (Un.prototype.setTargetOrigin = function (e) {
      this.targetOrigin = "*";
    }),
    (Un.prototype.contact = function (e, t) {
      if (!this.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      var n = this,
        r = Math.random().toString(36).substr(2),
        i = {
          source: "hcaptcha",
          label: e,
          id: this.id,
          promise: "create",
          lookup: r,
        };
      if (t) {
        if ("object" != typeof t) throw new Error("Message must be an object.");
        i.contents = t;
      }
      return new Promise(function (t, o) {
        n.waiting.push({ label: e, reject: o, resolve: t, lookup: r }),
          n._addToQueue(n.target, i);
      });
    }),
    (Un.prototype.listen = function (e, t) {
      if (!this.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      for (var n = this.messages.length, r = !1; --n > -1 && !1 === r; )
        this.messages[n].label === e && (r = this.messages[n]);
      !1 === r && ((r = { label: e, listeners: [] }), this.messages.push(r)),
        r.listeners.push(t);
    }),
    (Un.prototype.answer = function (e, t) {
      if (!this.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      for (var n = this.incoming.length, r = !1; --n > -1 && !1 === r; )
        this.incoming[n].label === e && (r = this.incoming[n]);
      !1 === r && ((r = { label: e, listeners: [] }), this.incoming.push(r)),
        r.listeners.push(t);
    }),
    (Un.prototype.send = function (e, t) {
      var n = this;
      if (!n.id)
        throw new Error(
          "Chat requires unique id to communicate between windows"
        );
      var r = { source: "hcaptcha", label: e, id: n.id };
      if (t) {
        if ("object" != typeof t) throw new Error("Message must be an object.");
        r.contents = t;
      }
      n._addToQueue(n.target, r);
    }),
    (Un.prototype.check = function (e, t) {
      for (
        var n = [].concat.apply(
            [],
            [this.messages, this.incoming, this.waiting]
          ),
          r = [],
          i = -1;
        ++i < n.length;

      )
        if (n[i].label === e) {
          if (t && n[i].lookup && t !== n[i].lookup) continue;
          r.push(n[i]);
        }
      return r;
    }),
    (Un.prototype.respond = function (e) {
      for (
        var t,
          n,
          r = -1,
          i = 0,
          o = [].concat.apply([], [this.messages, this.incoming, this.waiting]);
        ++r < o.length;

      )
        if (o[r].label === e.label) {
          if (e.lookup && o[r].lookup && e.lookup !== o[r].lookup) continue;
          var a = [];
          if (
            ((t = o[r]),
            e.error && a.push(e.error),
            e.contents && a.push(e.contents),
            e.promise && "create" !== e.promise)
          ) {
            t[e.promise].apply(t[e.promise], a);
            for (var s = this.waiting.length, c = !1; --s > -1 && !1 === c; )
              this.waiting[s].label === t.label &&
                this.waiting[s].lookup === t.lookup &&
                ((c = !0), this.waiting.splice(s, 1));
            continue;
          }
          for (i = 0; i < t.listeners.length; i++) {
            if (((n = t.listeners[i]), "create" === e.promise)) {
              var l = this._contactPromise(t.label, e.lookup);
              a.push(l);
            }
            n.apply(n, a);
          }
        }
      o = null;
    }),
    (Un.prototype.destroy = function () {
      return (
        this.clearQueue(),
        (this.messages = null),
        (this.incoming = null),
        (this.waiting = null),
        (this.isReady = !1),
        null
      );
    }),
    (Un.prototype._contactPromise = function (e, t) {
      var n = this,
        r = {},
        i = new Promise(function (e, t) {
          (r.resolve = e), (r.reject = t);
        }),
        o = {
          source: "hcaptcha",
          label: e,
          id: n.id,
          promise: null,
          lookup: t,
        };
      return (
        i
          .then(function (e) {
            (o.promise = "resolve"),
              null !== e && (o.contents = e),
              n._addToQueue(n.target, o);
          })
          ["catch"](function (e) {
            (o.promise = "reject"),
              null !== e && (o.error = e),
              n._addToQueue(n.target, o);
          }),
        r
      );
    }),
    (Un.prototype._addToQueue = function (e, t) {
      this.isReady ? this._sendMessage(e, t) : this.queue.push([e, t]);
    });
  var xn = {
    chats: [],
    messages: [],
    globalEnabled: !1,
    isSupported: function () {
      return !!window.postMessage;
    },
    createChat: function (e, t, n) {
      var r = new Un(e, t, n);
      return xn.chats.push(r), r;
    },
    addChat: function (e) {
      xn.chats.push(e);
    },
    removeChat: function (e) {
      for (var t = !1, n = xn.chats.length; --n > -1 && !1 === t; )
        e.id === xn.chats[n].id &&
          e.target === xn.chats[n].target &&
          ((t = xn.chats[n]), xn.chats.splice(n, 1));
      return t;
    },
    consumeMessages: function () {
      var e = xn.messages;
      return (xn.messages = []), e;
    },
    handleGlobal: function (e) {
      if (xn.globalEnabled) {
        var t = xn.messages;
        if (t.length >= 10) xn.globalEnabled = !1;
        else {
          var n = t.some(function (t) {
            return JSON.stringify(t.data) === JSON.stringify(e.data);
          });
          n || t.push(e);
        }
      }
    },
    handle: function (e) {
      var t = e.data,
        n =
          ("string" == typeof t && t.indexOf("hcaptcha") >= 0) ||
          ("object" == typeof t && JSON.stringify(t).indexOf("hcaptcha") >= 0);
      try {
        if (!n) return void xn.handleGlobal(e);
        "string" == typeof t && (t = JSON.parse(t)),
          "d" === t.t && xn.messages.push(e);
        for (var r, i = xn.chats, o = -1; ++o < i.length; ) {
          var a =
            "*" === (r = i[o]).targetOrigin || e.origin === r.targetOrigin;
          r.id === t.id && a && r.respond(t);
        }
      } catch (tr) {
        Ge("postMessage handler error", "postMessage", "debug", {
          event: e,
          error: tr,
        });
      }
    },
  };
  function Vn(e) {
    var t = e ? Sn.getById(e) : Sn.getByIndex(0);
    if (!t) throw e ? new yn(e) : new vn();
    Sn.remove(t), t.destroy(), (t = null);
  }
  function Rn() {
    try {
      return Object.keys(window).sort().join(",");
    } catch (nr) {
      return null;
    }
  }
  window.addEventListener
    ? window.addEventListener("message", xn.handle)
    : window.attachEvent("onmessage", xn.handle);
  var Wn = Fe();
  function Tn(e, t) {
    for (var n in t) {
      var r = t[n];
      switch (typeof r) {
        case "string":
          e[n] = r;
          break;
        case "object":
          (e[n] = e[n] || {}), Tn(e[n], r);
          break;
        default:
          throw new Error(
            "Source theme contains invalid data types. Only string and object types are supported."
          );
      }
    }
  }
  function On(e, t) {
    try {
      return e in t;
    } catch (n) {
      return !1;
    }
  }
  function Cn(e) {
    return !!e && "object" == typeof e;
  }
  function Mn(e) {
    return Cn(e) ? Pn({}, e) : e;
  }
  function Pn(e, t) {
    var n,
      r = {},
      i = Object.keys(e);
    for (n = 0; n < i.length; n++) r[i[n]] = Mn(e[i[n]]);
    var o,
      a,
      s = Object.keys(t);
    for (n = 0; n < s.length; n++) {
      var c = s[n];
      if (
        !(
          !On((o = c), (a = e)) ||
          (Object.hasOwnProperty.call(a, o) &&
            Object.propertyIsEnumerable.call(a, o))
        )
      )
        return;
      On(c, e) && Cn(e[c]) ? (r[c] = Pn(e[c], t[c])) : (r[c] = Mn(t[c]));
    }
    return r;
  }
  var An = {
      transparent: "transparent",
      white: "#ffffff",
      black: "#000000",
      grey: "#707070",
    },
    jn = {
      100: "#fafafa",
      200: "#f5f5f5",
      300: "#E0E0E0",
      400: "#D7D7D7",
      500: "#BFBFBF",
      600: "#919191",
      700: "#555555",
      800: "#333333",
      900: "#222222",
      1e3: "#14191F",
    },
    Dn = "#4DE1D2",
    Gn = "#00838F",
    Hn = {
      mode: "light",
      grey: jn,
      primary: { main: Gn },
      secondary: { main: Dn },
      warn: { light: "#BF1722", main: "#BF1722", dark: "#9D1B1B" },
      text: { heading: jn[700], body: jn[700] },
    },
    Fn = {
      mode: "dark",
      grey: jn,
      primary: { main: Gn },
      secondary: { main: Dn },
      text: { heading: jn[200], body: jn[200] },
    };
  function Nn(e, t) {
    return "dark" === t && e in Fn ? Fn[e] : Hn[e];
  }
  function Bn() {
    (this._themes = Object.create(null)),
      (this._active = "light"),
      this.add("light", {}),
      this.add("dark", { palette: { mode: "dark" } });
  }
  (Bn.prototype.get = function (e) {
    if (!e) return this._themes[this._active];
    var t = this._themes[e];
    if (!t) throw new Error("Cannot find theme with name: " + e);
    return t;
  }),
    (Bn.prototype.use = function (e) {
      this._themes[e]
        ? (this._active = e)
        : console.error("Cannot find theme with name: " + e);
    }),
    (Bn.prototype.active = function () {
      return this._active;
    }),
    (Bn.prototype.add = function (e, t) {
      t || (t = {}),
        (t.palette = (function (e) {
          e || (e = {});
          var t = e.mode || "light",
            n = e.primary || Nn("primary", t),
            r = e.secondary || Nn("secondary", t),
            i = e.warn || Nn("warn", t),
            o = e.grey || Nn("grey", t),
            a = e.text || Nn("text", t);
          return Pn(
            {
              common: An,
              mode: t,
              primary: n,
              secondary: r,
              grey: o,
              warn: i,
              text: a,
            },
            e
          );
        })(t.palette)),
        (t.component = t.component || Object.create(null)),
        (this._themes[e] = t);
    }),
    (Bn.prototype.extend = function (e, t) {
      "string" == typeof t && (t = JSON.parse(t));
      var n = JSON.parse(JSON.stringify(this.get(e)));
      return Tn(n, t), n;
    }),
    (Bn.merge = function (e, t) {
      return Pn(e, t || {});
    });
  var Yn = ["light", "dark", "contrast", "grey-red"],
    In = new Bn();
  In.add("contrast", {}),
    In.add("grey-red", {
      component: { challenge: { main: { border: "#6a6a6a" } } },
    });
  function Zn(e, t) {
    var n = this;
    (this.id = e),
      (this.width = null),
      (this.height = null),
      (this.mobile = !1),
      (this.ready = !1),
      (this.listeners = []),
      (this.config = t),
      (this._visible = !1),
      (this._selected = !1),
      (this.$iframe = new yt("iframe")),
      (this._host = ye.host || window.location.hostname);
    var r = ye.assetUrl;
    ve.assethost &&
      (r = ve.assethost + ye.assetUrl.replace(ye.assetDomain, ""));
    var i = r.match(/^.+\:\/\/[^\/]+/),
      o = i ? i[0] : null,
      a =
        r +
        "/hcaptcha.html#frame=challenge&id=" +
        this.id +
        "&host=" +
        this._host +
        (t ? "&" + Ke(this.config) : ""),
      s = ee.Browser.supportsPST();
    this.setupParentContainer(t),
      (this.chat = xn.createChat(this.$iframe.dom, e, o)),
      this.chat.setReady(!1),
      (this._timeoutFailedToInitialize = setTimeout(function () {
        n.$iframe && n.$iframe.isConnected()
          ? je(
              "Failed to initialize. Iframe attached",
              "error",
              "frame:challenge",
              {
                contentWindow: !!n.$iframe.dom.contentWindow,
                iframeSrc: a,
                supportsPST: s,
                customContainer: n._hasCustomContainer,
              }
            )
          : je(
              "Failed to initialize. Iframe detached",
              "error",
              "frame:challenge"
            );
      }, 6e4)),
      (this.$iframe.dom.src = a),
      (this.$iframe.dom.frameBorder = 0),
      (this.$iframe.dom.scrolling = "no"),
      ee.Browser.supportsPST() &&
        (this.$iframe.dom.allow =
          "private-state-token-issuance 'src'; private-state-token-redemption 'src'"),
      this.translate(),
      this._hasCustomContainer
        ? (this._hideIframe(), this._parent.appendChild(this.$iframe.dom))
        : ((this.$container = new yt("div")),
          (this.$wrapper = this.$container.createElement("div")),
          (this.$overlay = this.$container.createElement("div")),
          (this.$arrow = this.$container.createElement("div")),
          (this.$arrow.fg = this.$arrow.createElement("div")),
          (this.$arrow.bg = this.$arrow.createElement("div")),
          this.style.call(this),
          this.$wrapper.appendElement(this.$iframe),
          this._parent.appendChild(this.$container.dom),
          this.$container.setAttribute("aria-hidden", !0)),
      this.style();
  }
  (Zn.prototype.setupParentContainer = function (e) {
    var t,
      n = e["challenge-container"];
    n && (t = "string" == typeof n ? document.getElementById(n) : n),
      t
        ? ((this._hasCustomContainer = !0), (this._parent = t))
        : ((this._hasCustomContainer = !1), (this._parent = document.body));
  }),
    (Zn.prototype._hideIframe = function () {
      var e = {};
      "ie" !== ee.Browser.type ||
      ("ie" === ee.Browser.type && 8 !== ee.Browser.version)
        ? ((e.opacity = 0), (e.visibility = "hidden"))
        : (e.display = "none"),
        this.$iframe.setAttribute("aria-hidden", !0),
        this.$iframe.css(e);
    }),
    (Zn.prototype._showIframe = function () {
      var e = {};
      "ie" !== ee.Browser.type ||
      ("ie" === ee.Browser.type && 8 !== ee.Browser.version)
        ? ((e.opacity = 1), (e.visibility = "visible"))
        : (e.display = "block"),
        this.$iframe.removeAttribute("aria-hidden"),
        this.$iframe.css(e);
    }),
    (Zn.prototype.style = function () {
      var e = (function (e) {
        var t = e.palette,
          n = e.component;
        return Bn.merge(
          { main: { fill: t.common.white, border: t.grey[400] } },
          n.challenge
        );
      })(In.get());
      if (this._hasCustomContainer)
        this.$iframe.css({
          border: 0,
          position: "relative",
          backgroundColor: e.main.fill,
        });
      else {
        var t = {
          backgroundColor: e.main.fill,
          border: "1px solid " + e.main.border,
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 4px",
          borderRadius: 4,
          left: "auto",
          top: -1e4,
          zIndex: -9999999999999,
          position: "absolute",
          pointerEvents: "auto",
        };
        "ie" !== ee.Browser.type ||
        ("ie" === ee.Browser.type && 8 !== ee.Browser.version)
          ? ((t.transition = "opacity 0.15s ease-out"),
            (t.opacity = 0),
            (t.visibility = "hidden"))
          : (t.display = "none"),
          this.$container.css(t),
          this.$wrapper.css({ position: "relative", zIndex: 1 }),
          this.$overlay.css({
            width: "100%",
            height: "100%",
            position: "fixed",
            pointerEvents: "none",
            top: 0,
            left: 0,
            zIndex: 0,
            backgroundColor: e.main.fill,
            opacity: 0.05,
          }),
          this.$arrow.css({
            borderWidth: 11,
            position: "absolute",
            pointerEvents: "none",
            marginTop: -11,
            zIndex: 1,
            right: "100%",
          }),
          this.$arrow.fg.css({
            borderWidth: 10,
            borderStyle: "solid",
            borderColor:
              "transparent rgb(255, 255, 255) transparent transparent",
            position: "relative",
            top: 10,
            zIndex: 1,
          }),
          this.$arrow.bg.css({
            borderWidth: 11,
            borderStyle: "solid",
            borderColor:
              "transparent " + e.main.border + " transparent transparent",
            position: "relative",
            top: -11,
            zIndex: 0,
          }),
          this.$iframe.css({ border: 0, zIndex: 2e9, position: "relative" });
      }
    }),
    (Zn.prototype.setup = function (e) {
      return this.chat.send("create-challenge", e);
    }),
    (Zn.prototype.sendTranslation = function (e) {
      var t = { locale: e, table: xt.getTable(e) || {} };
      this.chat && this.chat.send("challenge-translate", t), this.translate();
    }),
    (Zn.prototype.translate = function () {
      this.$iframe.dom.title = xt.translate(
        "Main content of the hCaptcha challenge"
      );
    }),
    (Zn.prototype.isVisible = function () {
      return this._visible;
    }),
    (Zn.prototype.getDimensions = function (e, t) {
      return this._visible
        ? this.chat.contact("resize-challenge", { width: e, height: t })
        : Promise.resolve(null);
    }),
    (Zn.prototype.show = function () {
      if (!0 !== this._visible)
        if (((this._visible = !0), this._hasCustomContainer))
          this._showIframe();
        else {
          var e = { zIndex: 9999999999999, display: "block" };
          ("ie" !== ee.Browser.type ||
            ("ie" === ee.Browser.type && 8 !== ee.Browser.version)) &&
            ((e.opacity = 1), (e.visibility = "visible")),
            this.$container.css(e),
            this.$container.removeAttribute("aria-hidden"),
            this.$overlay.css({ pointerEvents: "auto", cursor: "pointer" });
        }
    }),
    (Zn.prototype.focus = function () {
      this.$iframe.dom.focus();
    }),
    (Zn.prototype.close = function (e) {
      if (!1 !== this._visible) {
        if (((this._visible = !1), this._hasCustomContainer))
          return (
            this._hideIframe(),
            void this.chat.send("close-challenge", { event: e })
          );
        var t = { left: "auto", top: -1e4, zIndex: -9999999999999 };
        "ie" !== ee.Browser.type ||
        ("ie" === ee.Browser.type && 8 !== ee.Browser.version)
          ? ((t.opacity = 0), (t.visibility = "hidden"))
          : (t.display = "none"),
          this.$container.css(t),
          this._hasCustomContainer ||
            this.$overlay.css({ pointerEvents: "none", cursor: "default" }),
          this.chat.send("close-challenge", { event: e }),
          this.$container.setAttribute("aria-hidden", !0);
      }
    }),
    (Zn.prototype.size = function (e, t, n) {
      (this.width = e),
        (this.height = t),
        (this.mobile = n),
        this.$iframe.css({ width: e, height: t }),
        this._hasCustomContainer ||
          (this.$wrapper.css({ width: e, height: t }),
          n
            ? this.$overlay.css({ opacity: 0.5 })
            : this.$overlay.css({ opacity: 0.05 }));
    }),
    (Zn.prototype.position = function (e) {
      if (!this._hasCustomContainer && e) {
        var t = 10,
          n = window.document.documentElement,
          r = ee.Browser.scrollY(),
          i = ee.Browser.width(),
          o = ee.Browser.height(),
          a =
            this.mobile ||
            "invisible" === this.config.size ||
            e.offset.left + e.tick.x <= e.tick.width / 2,
          s = Math.round(e.bounding.top) + r !== e.offset.top,
          c = a ? (i - this.width) / 2 : e.bounding.left + e.tick.right + 10;
        (c + this.width + t > i || c < 0) &&
          ((c = (i - this.width) / 2), (a = !0));
        var l =
            (n.scrollHeight < n.clientHeight
              ? n.clientHeight
              : n.scrollHeight) -
            this.height -
            t,
          u = a
            ? (o - this.height) / 2 + r
            : e.bounding.top + e.tick.y + r - this.height / 2;
        s && u < r && (u = r + t),
          s && u + this.height >= r + o && (u = r + o - (this.height + t)),
          (u = Math.max(Math.min(u, l), 10));
        var h = e.bounding.top + e.tick.y + r - u - 10,
          p = this.height - 10 - 30;
        (h = Math.max(Math.min(h, p), t)),
          this.$container.css({ left: c, top: u }),
          this.$arrow.fg.css({ display: a ? "none" : "block" }),
          this.$arrow.bg.css({ display: a ? "none" : "block" }),
          this.$arrow.css({ top: h }),
          (this.top = u),
          this.$container.dom.getBoundingClientRect();
      }
    }),
    (Zn.prototype.destroy = function () {
      this._timeoutFailedToInitialize &&
        (clearTimeout(this._timeoutFailedToInitialize),
        (this._timeoutFailedToInitialize = null)),
        this._visible && this.close.call(this),
        xn.removeChat(this.chat),
        (this.chat = this.chat.destroy()),
        this._hasCustomContainer
          ? this._parent.removeChild(this.$iframe.dom)
          : (this._parent.removeChild(this.$container.dom),
            (this.$container = this.$container.__destroy())),
        (this.$iframe = this.$iframe.__destroy());
    }),
    (Zn.prototype.setReady = function () {
      var e;
      this._timeoutFailedToInitialize &&
        (clearTimeout(this._timeoutFailedToInitialize),
        (this._timeoutFailedToInitialize = null)),
        this.chat && this.chat.setReady(!0),
        (this.ready = !0);
      for (var t = this.listeners.length; --t > -1; )
        (e = this.listeners[t]), this.listeners.splice(t, 1), e();
    }),
    (Zn.prototype.onReady = function (e) {
      var t = Array.prototype.slice.call(arguments, 1),
        n = function () {
          e.apply(null, t);
        };
      this.ready ? n() : this.listeners.push(n);
    }),
    (Zn.prototype.onOverlayClick = function (e) {
      this._hasCustomContainer || this.$overlay.addEventListener("click", e);
    }),
    (Zn.prototype.setData = function (e) {
      this.chat && this.chat.send("challenge-data", e);
    });
  function Ln(e, t, n) {
    var r = this;
    (this.id = t),
      (this.response = null),
      (this.location = { tick: null, offset: null, bounding: null }),
      (this.config = n),
      (this._ticked = !0),
      (this.$container = e instanceof yt ? e : new yt(e)),
      (this._host = ye.host || window.location.hostname),
      (this.$iframe = new yt("iframe"));
    var i = ye.assetUrl;
    ve.assethost &&
      (i = ve.assethost + ye.assetUrl.replace(ye.assetDomain, ""));
    var o = i.match(/^.+\:\/\/[^\/]+/),
      a = o ? o[0] : null,
      s =
        i +
        "/hcaptcha.html#frame=checkbox&id=" +
        this.id +
        "&host=" +
        this._host +
        (n ? "&" + Ke(this.config) : "");
    (this.chat = xn.createChat(this.$iframe.dom, t, a)),
      this.chat.setReady(!1),
      (this._timeoutFailedToInitialize = setTimeout(function () {
        r.$iframe && r.$iframe.isConnected()
          ? je(
              "Failed to initialize. Iframe attached",
              "error",
              "frame:checkbox",
              { contentWindow: !!r.$iframe.dom.contentWindow, iframeSrc: s }
            )
          : je(
              "Failed to initialize. Iframe detached",
              "error",
              "frame:checkbox"
            );
      }, 6e4)),
      (this.$iframe.dom.src = s),
      (this.$iframe.dom.tabIndex = this.config.tabindex || 0),
      (this.$iframe.dom.frameBorder = "0"),
      (this.$iframe.dom.scrolling = "no"),
      ee.Browser.supportsPST() &&
        (this.$iframe.dom.allow =
          "private-state-token-issuance 'src'; private-state-token-redemption 'src'"),
      this.translate(),
      this.config.size &&
        "invisible" === this.config.size &&
        this.$iframe.setAttribute("aria-hidden", "true"),
      this.$iframe.setAttribute("data-hcaptcha-widget-id", t),
      this.$iframe.setAttribute("data-hcaptcha-response", ""),
      this.$container.appendElement(this.$iframe),
      "off" !== ve.recaptchacompat &&
        ((this.$textArea0 = this.$container.createElement(
          "textarea",
          "#g-recaptcha-response-" + t
        )),
        (this.$textArea0.dom.name = "g-recaptcha-response"),
        this.$textArea0.css({ display: "none" })),
      (this.$textArea1 = this.$container.createElement(
        "textarea",
        "#h-captcha-response-" + t
      )),
      (this.$textArea1.dom.name = "h-captcha-response"),
      this.$textArea1.css({ display: "none" }),
      (this.ready = new Promise(function (e) {
        r.chat.listen("checkbox-ready", e);
      }).then(function () {
        r._timeoutFailedToInitialize &&
          (clearTimeout(r._timeoutFailedToInitialize),
          (r._timeoutFailedToInitialize = null)),
          r.chat && r.chat.setReady(!0);
      })),
      (this.clearLoading = this.clearLoading.bind(this)),
      this.style();
  }
  function zn(e, t, n) {
    (this.id = t),
      (this.response = null),
      (this.location = { tick: null, offset: null, bounding: null }),
      (this.config = n),
      (this.$container = e instanceof yt ? e : new yt(e)),
      (this.$iframe = new yt("iframe")),
      this.$iframe.setAttribute("aria-hidden", "true"),
      this.$iframe.css({ display: "none" }),
      this.$iframe.setAttribute("data-hcaptcha-widget-id", t),
      this.$iframe.setAttribute("data-hcaptcha-response", "");
    var r = ye.assetUrl;
    ve.assethost &&
      (r = ve.assethost + ye.assetUrl.replace(ye.assetDomain, "")),
      (this.$iframe.dom.src = r + "/hcaptcha.html#frame=checkbox-invisible"),
      this.$container.appendElement(this.$iframe),
      "off" !== ve.recaptchacompat &&
        ((this.$textArea0 = this.$container.createElement(
          "textarea",
          "#g-recaptcha-response-" + t
        )),
        (this.$textArea0.dom.name = "g-recaptcha-response"),
        this.$textArea0.css({ display: "none" })),
      (this.$textArea1 = this.$container.createElement(
        "textarea",
        "#h-captcha-response-" + t
      )),
      (this.$textArea1.dom.name = "h-captcha-response"),
      this.$textArea1.css({ display: "none" });
  }
  function Kn(e, t, n) {
    if (!n.sitekey) throw new bn();
    (this.id = t),
      (this.visible = !1),
      (this.overflow = { override: !1, cssUsed: !0, value: null, scroll: 0 }),
      (this.onError = null),
      (this.onPass = null),
      (this.onExpire = null),
      (this.onChalExpire = null),
      (this.onOpen = null),
      (this.onClose = null),
      (this._ready = !1),
      (this._active = !1),
      (this._listeners = []),
      (this.config = n),
      Yn.indexOf(n.theme) >= 0 && In.use(n.theme),
      (this._state = {
        escaped: !1,
        passed: !1,
        expiredChallenge: !1,
        expiredResponse: !1,
      }),
      (this._origData = null),
      (this._langSet = !1),
      (this._promise = null),
      (this._responseTimer = null),
      (this.initChallenge = this.initChallenge.bind(this)),
      (this.closeChallenge = this.closeChallenge.bind(this)),
      (this.displayChallenge = this.displayChallenge.bind(this)),
      (this.getGetCaptchaManifest = this.getGetCaptchaManifest.bind(this)),
      (this.challenge = new Zn(t, n)),
      "invisible" === this.config.size
        ? (Ge("Invisible mode is set", "hCaptcha", "info"),
          (this.checkbox = new zn(e, t, n)))
        : (this.checkbox = new Ln(e, t, n));
  }
  function $n(e) {
    if ("en" === e) return Promise.resolve();
    var t = e + ".json";
    return new Promise(function (n, r) {
      Yt(t)
        .then(function (n) {
          return (
            n ||
            Bt(t, {
              prefix:
                "https://newassets.hcaptcha.com/captcha/v1/1b564ae232134bc294a3d1294b86767efc3e7747/static/i18n",
            }).then(function (t) {
              return xt.addTable(e, t.data), t;
            })
          );
        })
        .then(function (e) {
          n(e.data);
        })
        ["catch"](function (e) {
          r(e);
        });
    });
  }
  (Ln.prototype.setResponse = function (e) {
    (this.response = e),
      this.$iframe.dom.setAttribute("data-hcaptcha-response", e),
      "off" !== ve.recaptchacompat && (this.$textArea0.dom.value = e),
      (this.$textArea1.dom.value = e);
  }),
    (Ln.prototype.style = function () {
      var e = this.config.size;
      switch (
        (this.$iframe.css({
          pointerEvents: "auto",
          backgroundColor: "rgba(255,255,255,0)",
          borderRadius: 4,
        }),
        e)
      ) {
        case "compact":
          this.$iframe.css({ width: 158, height: 138 });
          break;
        case "invisible":
          this.$iframe.css({ display: "none" });
          break;
        default:
          this.$iframe.css({ width: 302, height: 76, overflow: "hidden" });
      }
    }),
    (Ln.prototype.reset = function () {
      (this._ticked = !1),
        this.$iframe &&
          this.$iframe.dom.contentWindow &&
          this.chat &&
          this.chat.send("checkbox-reset");
    }),
    (Ln.prototype.clearLoading = function () {
      this.chat && this.chat.send("checkbox-clear");
    }),
    (Ln.prototype.sendTranslation = function (e) {
      var t = { locale: e, table: xt.getTable(e) || {} };
      this.chat && this.chat.send("checkbox-translate", t), this.translate();
    }),
    (Ln.prototype.translate = function () {
      this.$iframe.dom.title = xt.translate(
        "Widget containing checkbox for hCaptcha security challenge"
      );
    }),
    (Ln.prototype.status = function (e, t) {
      this.$iframe &&
        this.$iframe.dom.contentWindow &&
        this.chat &&
        this.chat.send("checkbox-status", {
          text: e || null,
          a11yOnly: t || !1,
        });
    }),
    (Ln.prototype.tick = function () {
      (this._ticked = !0), this.chat && this.chat.send("checkbox-tick");
    }),
    (Ln.prototype.getTickLocation = function () {
      return this.chat.contact("checkbox-location");
    }),
    (Ln.prototype.getOffset = function () {
      var e = this.$iframe.dom;
      e.offsetParent || (e = e.parentElement);
      for (var t = 0, n = 0; e; )
        (t += e.offsetLeft), (n += e.offsetTop), (e = e.offsetParent);
      return { top: n, left: t };
    }),
    (Ln.prototype.getBounding = function () {
      return this.$iframe.dom.getBoundingClientRect();
    }),
    (Ln.prototype.destroy = function () {
      this._timeoutFailedToInitialize &&
        (clearTimeout(this._timeoutFailedToInitialize),
        (this._timeoutFailedToInitialize = null)),
        this._ticked && this.reset(),
        xn.removeChat(this.chat),
        (this.chat = this.chat.destroy()),
        this.$container.removeElement(this.$iframe),
        this.$container.removeElement(this.$textArea1),
        "off" !== ve.recaptchacompat &&
          (this.$container.removeElement(this.$textArea0),
          (this.$textArea0 = this.$textArea0.__destroy())),
        (this.$textArea1 = this.$textArea1.__destroy()),
        (this.$container = this.$container.__destroy()),
        (this.$iframe = this.$iframe.__destroy());
    }),
    (zn.prototype.setResponse = function (e) {
      (this.response = e),
        this.$iframe.dom.setAttribute("data-hcaptcha-response", e),
        "off" !== ve.recaptchacompat && (this.$textArea0.dom.value = e),
        (this.$textArea1.dom.value = e);
    }),
    (zn.prototype.reset = function () {}),
    (zn.prototype.clearLoading = function () {}),
    (zn.prototype.sendTranslation = function (e) {}),
    (zn.prototype.status = function (e, t) {}),
    (zn.prototype.tick = function () {}),
    (zn.prototype.getTickLocation = function () {
      return Promise.resolve({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      });
    }),
    (zn.prototype.getOffset = function () {
      var e = this.$iframe.dom;
      e.offsetParent || (e = e.parentElement);
      for (var t = 0, n = 0; e; )
        (t += e.offsetLeft), (n += e.offsetTop), (e = e.offsetParent);
      return { top: n, left: t };
    }),
    (zn.prototype.getBounding = function () {
      return this.$iframe.dom.getBoundingClientRect();
    }),
    (zn.prototype.destroy = function () {
      this._ticked && this.reset(),
        this.$container.removeElement(this.$iframe),
        this.$container.removeElement(this.$textArea1),
        "off" !== ve.recaptchacompat &&
          (this.$container.removeElement(this.$textArea0),
          (this.$textArea0 = this.$textArea0.__destroy())),
        (this.$textArea1 = this.$textArea1.__destroy()),
        (this.$container = this.$container.__destroy()),
        (this.$iframe = this.$iframe.__destroy());
    }),
    (Kn.prototype._resetTimer = function () {
      null !== this._responseTimer &&
        (clearTimeout(this._responseTimer), (this._responseTimer = null));
    }),
    (Kn.prototype.initChallenge = function (e) {
      e || (e = {}),
        Ge("Initiate challenge", "hCaptcha", "info"),
        (this._origData = e);
      var t = this.getGetCaptchaManifest(),
        n = e.charity || null,
        r = e.a11yChallenge || !1,
        i = e.link || null,
        o = e.action || "",
        a = e.rqdata || null,
        s = e.errors || [],
        c = ee.Browser.width(),
        l = ee.Browser.height();
      (this._active = !0),
        this._resetTimer(),
        this._resetState(),
        this.checkbox.setResponse(""),
        this.challenge.setup({
          a11yChallenge: r,
          manifest: t,
          width: c,
          height: l,
          charity: n,
          link: i,
          action: o,
          rqdata: a,
          wdata: Rn(),
          errors: s.concat(Wn.collect()),
        });
    }),
    (Kn.prototype.getGetCaptchaManifest = function () {
      var e = (this._origData || {}).manifest || null;
      return (
        e || ((e = Object.create(null)).st = Date.now()),
        (e.v = 1),
        (e.topLevel = fn.getData()),
        (e.session = Sn.getSession()),
        (e.widgetList = Sn.getCaptchaIdList()),
        (e.widgetId = this.id),
        (e.href = window.location.href),
        (e.prev = JSON.parse(JSON.stringify(this._state))),
        e
      );
    }),
    (Kn.prototype.displayChallenge = function (e) {
      if (this._active) {
        var t = this;
        this.visible = !0;
        var n = this.checkbox,
          r = this.challenge,
          i = ee.Browser.height();
        if (!("ie" === ee.Browser.type && 8 === ee.Browser.version)) {
          var o = window
            .getComputedStyle(document.body)
            .getPropertyValue("overflow-y");
          (this.overflow.override = "hidden" === o),
            this.overflow.override &&
              ((this.overflow.cssUsed =
                "" === document.body.style.overflow &&
                "" === document.body.style.overflowY),
              this.overflow.cssUsed ||
                (this.overflow.value = "" === o ? "auto" : o),
              (this.overflow.scroll = ee.Browser.scrollY()),
              (document.body.style.overflowY = "auto"));
        }
        return new Promise(function (o) {
          n.status(),
            n.getTickLocation().then(function (a) {
              if (t._active) {
                if (
                  (r.size(e.width, e.height, e.mobile),
                  r.show(),
                  n.clearLoading(),
                  (n.location.bounding = n.getBounding()),
                  (n.location.tick = a),
                  (n.location.offset = n.getOffset()),
                  r.position(n.location),
                  r.focus(),
                  r.height > window.document.documentElement.clientHeight)
                )
                  (
                    window.document.scrollingElement ||
                    document.getElementsByTagName("html")[0]
                  ).scrollTop = Math.abs(r.height - i) + r.top;
                o();
              }
            });
        }).then(function () {
          Ge("Challenge is displayed", "hCaptcha", "info"),
            t.onOpen && it(t.onOpen);
        });
      }
    }),
    (Kn.prototype.resize = function (e, t, n) {
      var r = this,
        i = this.checkbox,
        o = this.challenge;
      o.getDimensions(e, t)
        .then(function (e) {
          e && o.size(e.width, e.height, e.mobile),
            (i.location.bounding = i.getBounding()),
            (i.location.offset = i.getOffset()),
            (ee.System.mobile && !n) || o.position(i.location);
        })
        ["catch"](function (e) {
          r.closeChallenge.call(r, {
            event: le,
            message: "Captcha resize caused error.",
            error: e,
          });
        });
    }),
    (Kn.prototype.position = function () {
      var e = this.checkbox,
        t = this.challenge;
      ee.System.mobile ||
        ((e.location.bounding = e.getBounding()), t.position(e.location));
    }),
    (Kn.prototype.reset = function () {
      Ge("Captcha Reset", "hCaptcha", "info");
      try {
        this.checkbox.reset(),
          this.checkbox.setResponse(""),
          this._resetTimer(),
          this._resetState();
      } catch (ir) {
        De("hCaptcha", ir);
      }
    }),
    (Kn.prototype._resetState = function () {
      for (var e in this._state) this._state[e] = !1;
    }),
    (Kn.prototype.closeChallenge = function (e) {
      (this.visible = !1), (this._active = !1);
      var t = this,
        n = this.checkbox,
        r = this.challenge;
      this.overflow.override &&
        (((
          window.document.scrollingElement ||
          document.getElementsByTagName("html")[0]
        ).scrollTop = this.overflow.scroll),
        (this.overflow.override = !1),
        (this.overflow.scroll = 0),
        (document.body.style.overflowY = this.overflow.cssUsed
          ? null
          : this.overflow.value));
      var i = e.response || "";
      n.setResponse(i);
      var o = e.event;
      switch (
        (("string" == typeof i && "" !== i) ||
          o !== te ||
          ((o = ne), je("Passed without response", "error", "api", e)),
        r.close(o),
        n.$iframe.dom.focus(),
        Ge("Challenge has closed", "hCaptcha", "info", {
          event: o,
          response: e.response,
          message: e.message,
        }),
        o)
      ) {
        case ne:
          (this._state.escaped = !0),
            n.reset(),
            t.onClose && it(t.onClose),
            t._promise && t._promise.reject(re);
          break;
        case ie:
          (this._state.expiredChallenge = !0),
            n.reset(),
            n.status("hCaptcha window closed due to timeout.", !0),
            t.onChalExpire && it(t.onChalExpire),
            t._promise && t._promise.reject(ie);
          break;
        case le:
        case ae:
        case ce:
          var a = o;
          n.reset(),
            o === ce
              ? (n.status(e.message),
                429 === e.status
                  ? (a = se)
                  : "invalid-data" === e.message
                  ? (a = oe)
                  : "client-fail" === e.message && (a = le))
              : o === ae
              ? (a = le)
              : o === le && "Answers are incomplete" === e.message && (a = ue),
            je("Failed to execute", "error", "hCaptcha", {
              error: a,
              event: o,
              message: e.message,
            }),
            this.onError && it(this.onError, a),
            t._promise && t._promise.reject(a);
          break;
        case te:
          (this._state.passed = !0),
            n.tick(),
            this.onPass && it(this.onPass, i),
            t._promise && t._promise.resolve({ response: i, key: kn(this.id) }),
            "number" == typeof e.expiration &&
              (t._resetTimer(),
              (t._responseTimer = setTimeout(function () {
                try {
                  n.$iframe &&
                    (n.$iframe.dom.contentWindow
                      ? (n.reset(),
                        n.setResponse(""),
                        n.status(
                          "hCaptcha security token has expired. Please complete the challenge again.",
                          !0
                        ))
                      : Vn(t.id));
                } catch (tr) {
                  De("global", tr);
                }
                t.onExpire && it(t.onExpire),
                  (t._responseTimer = null),
                  (t._state.expiredResponse = !0);
              }, 1e3 * e.expiration)));
      }
      t._promise = null;
    }),
    (Kn.prototype.updateTranslation = function (e) {
      (this.config.hl = e),
        (this._langSet = !0),
        this.checkbox && this.checkbox.sendTranslation(e),
        this.challenge && this.challenge.sendTranslation(e);
    }),
    (Kn.prototype.isLangSet = function () {
      return this._langSet;
    }),
    (Kn.prototype.isReady = function () {
      return this._ready;
    }),
    (Kn.prototype.isActive = function () {
      return this._active;
    }),
    (Kn.prototype.setReady = function (e) {
      if (((this._ready = e), this._ready)) {
        var t;
        Ge("Instance is ready", "hCaptcha", "info");
        for (var n = this._listeners.length; --n > -1; )
          (t = this._listeners[n]), this._listeners.splice(n, 1), t();
      }
    }),
    (Kn.prototype.setPromise = function (e) {
      this._promise = e;
    }),
    (Kn.prototype.onReady = function (e) {
      var t = Array.prototype.slice.call(arguments, 1),
        n = function () {
          e.apply(null, t);
        };
      this._ready ? n() : this._listeners.push(n);
    }),
    (Kn.prototype.destroy = function () {
      (Ge("Captcha Destroy", "hCaptcha", "info"),
      this._resetTimer(),
      this.overflow.override) &&
        (((
          window.document.scrollingElement ||
          document.getElementsByTagName("html")[0]
        ).scrollTop = this.overflow.scroll),
        (this.overflow.override = !1),
        (this.overflow.scroll = 0),
        (document.body.style.overflowY = this.overflow.cssUsed
          ? null
          : this.overflow.value));
      this.challenge.destroy(),
        this.checkbox.destroy(),
        (this.challenge = null),
        (this.checkbox = null);
    }),
    (Kn.prototype.setSiteConfig = function (e) {
      var t = this;
      if ("ok" in e) {
        var n = e.ok.features || {};
        if (this.config.themeConfig && n.custom_theme) {
          var r = "custom-" + this.id;
          In.add(r, In.extend(In.active(), this.config.themeConfig)),
            In.use(r),
            this.challenge.style();
        }
      }
      return "invisible" === this.config.size
        ? ("err" in e && console.error("[hCaptcha] " + e.err.message),
          Promise.resolve())
        : this.checkbox.ready.then(function () {
            return (
              t.checkbox.chat.send("site-setup", e),
              new Promise(function (e) {
                t.checkbox.chat.listen("checkbox-loaded", function () {
                  e();
                });
              })
            );
          });
    });
  var Jn = 0,
    Xn = [
      "hl",
      "custom",
      "andint",
      "tplinks",
      "sitekey",
      "theme",
      "size",
      "tabindex",
      "challenge-container",
      "confirm-nav",
      "orientation",
      "mode",
    ];
  function qn(e, t) {
    if (e)
      try {
        e.updateTranslation(t);
      } catch (tr) {
        De("translation", tr);
      }
  }
  var Qn,
    er = {
      render:
        ((Qn = function (e, t) {
          if (
            ("string" == typeof e && (e = document.getElementById(e)),
            e && 1 === e.nodeType)
          )
            if (
              (function (e) {
                if (!e || !("challenge-container" in e)) return !0;
                var t = e["challenge-container"];
                return (
                  "string" == typeof t && (t = document.getElementById(t)),
                  !!t && 1 === t.nodeType
                );
              })(t)
            ) {
              if (!1 !== xn.isSupported()) {
                for (
                  var n, r, i = e.getElementsByTagName("iframe"), o = -1;
                  ++o < i.length && !n;

                )
                  (r = i[o].getAttribute("data-hcaptcha-widget-id")) &&
                    (n = !0);
                if (n)
                  return (
                    console.error(
                      "Only one captcha is permitted per parent container."
                    ),
                    r
                  );
                Ge("Render instance", "hCaptcha", "info");
                var a = ot(e, t),
                  s = Jn++ + Math.random().toString(36).substr(2),
                  c = Object.create(null);
                (c.sentry = ve.sentry),
                  (c.reportapi = ve.reportapi),
                  (c.recaptchacompat = ve.recaptchacompat),
                  (c.custom = ve.custom),
                  null !== ve.language && (c.hl = xt.getLocale()),
                  ve.assethost && (c.assethost = ve.assethost),
                  ve.imghost && (c.imghost = ve.imghost),
                  ve.tplinks && (c.tplinks = ve.tplinks),
                  ve.andint && (c.andint = ve.andint),
                  ve.se && (c.se = ve.se),
                  "off" === ve.pat && (c.pat = ve.pat),
                  (c.pstissuer = ve.pstIssuer),
                  "landscape" === ve.orientation &&
                    (c.orientation = ve.orientation);
                for (var l = 0; l < Xn.length; l++) {
                  var u = Xn[l];
                  u in a && (c[u] = a[u]);
                }
                var h = ve.endpoint,
                  p = c.sitekey;
                if (
                  ("78c843a4-f80d-4a14-b3e5-74b492762487" === p && (h = me),
                  -1 !==
                    [
                      "463b917e-e264-403f-ad34-34af0ee10294",
                      "24ed0064-62cf-4d42-9960-5dd1a41d4e29",
                      "ec637546-e9b8-447a-ab81-b5fb6d228ab8",
                      "9883b18b-8cd9-4469-b478-05c06d8252d8",
                      "56a65d68-17e9-4a0f-a6ca-5d48fb0fdfea",
                    ].indexOf(p))
                )
                  try {
                    hn.stop();
                  } catch (tr) {
                    De("bivm", tr);
                  }
                h === fe &&
                  -1 === ["pt-BR", "es-BR"].indexOf(navigator.language) &&
                  Math.random() < 0.001 &&
                  p &&
                  -1 === p.indexOf("-0000-0000-0000-") &&
                  (h = me),
                  h !== fe && (c.endpoint = h),
                  (c.theme = ve.theme);
                var d = window.location,
                  f =
                    d.origin ||
                    d.protocol +
                      "//" +
                      d.hostname +
                      (d.port ? ":" + d.port : "");
                if (("null" !== f && (c.origin = f), a.theme))
                  try {
                    var m = a.theme;
                    "string" == typeof m && (m = JSON.parse(m)),
                      (c.themeConfig = m),
                      (c.custom = !0);
                  } catch (nr) {
                    c.theme = m;
                  }
                if (
                  e instanceof HTMLButtonElement ||
                  e instanceof HTMLInputElement
                ) {
                  var g = new yt("div", ".h-captcha");
                  g.css({ display: "none" });
                  for (var y = null, v = 0; v < e.attributes.length; v++)
                    (y = e.attributes[v]).name.startsWith("data-") &&
                      g.setAttribute(y.name, y.value);
                  var b =
                    e.tagName.toLowerCase() +
                    "[data-hcaptcha-widget-id='" +
                    s +
                    "']";
                  e.setAttribute("data-hcaptcha-widget-id", s),
                    g.setAttribute("data-hcaptcha-source-id", b),
                    e.parentNode.insertBefore(g.dom, e),
                    (e.onclick = function (e) {
                      return (
                        e.preventDefault(),
                        Ge("User initiated", "hCaptcha", "info", e),
                        En(s)
                      );
                    }),
                    (e = g),
                    (c.size = "invisible");
                }
                c.mode === ge &&
                  "invisible" === c.size &&
                  (console.warn(
                    "[hCaptcha] mode='auto' cannot be used in combination with size='invisible'."
                  ),
                  delete c.mode);
                try {
                  var w = new Kn(e, s, c);
                } catch (tr) {
                  var _ =
                    "Your browser plugins or privacy policies are blocking the hCaptcha service. Please disable them for hCaptcha.com";
                  return (
                    tr instanceof bn &&
                      ((_ =
                        "hCaptcha has failed to initialize. Please see the developer tools console for more information."),
                      console.error(tr.message)),
                    Se(e, _),
                    void De("api", tr)
                  );
                }
                a.callback && (w.onPass = a.callback),
                  a["expired-callback"] && (w.onExpire = a["expired-callback"]),
                  a["chalexpired-callback"] &&
                    (w.onChalExpire = a["chalexpired-callback"]),
                  a["open-callback"] && (w.onOpen = a["open-callback"]),
                  a["close-callback"] && (w.onClose = a["close-callback"]),
                  a["error-callback"] && (w.onError = a["error-callback"]);
                try {
                  fn.setData("inv", "invisible" === c.size),
                    fn.setData("size", c.size),
                    fn.setData("theme", ct(c.themeConfig || c.theme)),
                    fn.setData(
                      "pel",
                      (e.outerHTML || "").replace(e.innerHTML, "")
                    ),
                    un.setData("inv", "invisible" === c.size),
                    un.setData("size", c.size),
                    un.setData("theme", ct(c.themeConfig || c.theme)),
                    un.setData(
                      "pel",
                      (e.outerHTML || "").replace(e.innerHTML, "")
                    );
                } catch (ir) {
                  De("api", ir);
                }
                return (
                  (function (e, t) {
                    "invisible" !== t.size &&
                      (e.checkbox.chat.listen(
                        "checkbox-selected",
                        function (t) {
                          Ge("User initiated", "hCaptcha", "info");
                          try {
                            var n = "enter" === t.action ? "kb" : "m";
                            fn.setData("exec", n),
                              un.setData("exec", n),
                              nt(pn(e.id), 100)
                                ["finally"](function () {
                                  try {
                                    e.onReady(e.initChallenge, t);
                                  } catch (tr) {
                                    De("onready", tr);
                                  }
                                })
                                ["catch"](function (e) {});
                          } catch (tr) {
                            je("Checkbox Select Failed", "error", "render", tr);
                          }
                        }
                      ),
                      e.checkbox.chat.listen("checkbox-loaded", function (n) {
                        Ge("Loaded", "frame:checkbox", "info"),
                          (e.checkbox.location.bounding =
                            e.checkbox.getBounding()),
                          (e.checkbox.location.tick = n),
                          (e.checkbox.location.offset = e.checkbox.getOffset()),
                          e.checkbox.sendTranslation(t.hl);
                      }),
                      t.mode === ge &&
                        e.onReady(function () {
                          En(e.id);
                        }, t));
                  })(w, c),
                  (function (e, t) {
                    function n(t, n) {
                      if (t.locale) {
                        var r = xt.resolveLocale(t.locale);
                        $n(r)
                          .then(function () {
                            n
                              ? qn(e, r)
                              : (xt.setLocale(r),
                                Sn.each(function (e) {
                                  qn(e, r);
                                }));
                          })
                          ["catch"](function (e) {
                            je("lang:loading-error", "error", "api", {
                              locale: r,
                              error: e,
                            });
                          });
                      }
                    }
                    e.challenge.chat.listen("site-setup", function (t) {
                      var n = e.setSiteConfig(t);
                      e.challenge.onReady(function () {
                        n.then(function () {
                          e.setReady(!0);
                        });
                      });
                    }),
                      e.challenge.chat.listen("challenge-loaded", function () {
                        Ge("Loaded", "frame:challenge", "info"),
                          e.challenge.setReady(),
                          e.challenge.sendTranslation(t.hl);
                      }),
                      e.challenge.chat.answer(
                        "challenge-ready",
                        function (t, n) {
                          if (e && e.isActive())
                            try {
                              e.displayChallenge(t)
                                .then(n.resolve)
                                ["catch"](function (e) {
                                  De("display-challenge", e), n.reject(e);
                                });
                            } catch (tr) {
                              De("challenge-ready", tr), n.reject(tr);
                            }
                          else
                            e.isActive()
                              ? Ge(
                                  "hCaptcha instance no longer exists.",
                                  "frame:challenge",
                                  "info"
                                )
                              : Ge(
                                  "hCaptcha instance was stopped during execution flow.",
                                  "frame:challenge",
                                  "info"
                                );
                        }
                      ),
                      e.challenge.chat.listen("challenge-resize", function () {
                        var t = ee.Browser.width(),
                          n = ee.Browser.height();
                        e.resize(t, n);
                      }),
                      e.challenge.chat.listen(re, function (t) {
                        try {
                          fn.setData("lpt", Date.now()),
                            un.setData("lpt", Date.now()),
                            e.closeChallenge(t);
                        } catch (tr) {
                          De("challenge-closed", tr);
                        }
                      }),
                      e.challenge.chat.answer("get-url", function (e) {
                        try {
                          e.resolve(window.location.href);
                        } catch (tr) {
                          De("get-url", tr), e.reject(tr);
                        }
                      }),
                      e.challenge.chat.answer(
                        "getcaptcha-manifest",
                        function (t) {
                          try {
                            var n = e.getGetCaptchaManifest();
                            t.resolve(n);
                          } catch (tr) {
                            De("getcaptcha-manifest", tr), t.reject(tr);
                          }
                        }
                      ),
                      e.challenge.chat.answer("check-api", function (t) {
                        try {
                          nt(pn(e.id), 100)
                            ["finally"](function () {
                              try {
                                var e = fn.getData();
                                t.resolve(e);
                              } catch (tr) {
                                De("submitvm", tr), t.reject(tr);
                              }
                            })
                            ["catch"](function (e) {
                              t.reject(e);
                            });
                        } catch (tr) {
                          je("check api error", "error", "render", tr),
                            t.reject(tr);
                        }
                      }),
                      e.challenge.chat.listen("challenge-key", function (t) {
                        Sn.pushSession(t.key, e.id);
                      }),
                      e.challenge.onOverlayClick(function () {
                        e.closeChallenge({ event: ne });
                      }),
                      e.challenge.chat.listen("challenge-language", n),
                      n({ locale: t.hl }, !0),
                      e.challenge.chat.answer("get-ac", function (e) {
                        try {
                          var t = Ne.hasCookie("hc_accessibility");
                          e.resolve(t);
                        } catch (tr) {
                          De("get-ac", tr), e.reject(tr);
                        }
                      });
                  })(w, c),
                  Sn.add(w),
                  s
                );
              }
              Se(
                e,
                "Your browser is missing or has disabled Cross-Window Messaging. Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> or enable it for hCaptcha.com"
              );
            } else
              console.log(
                "[hCaptcha] render: invalid challenge container '" +
                  t["challenge-container"] +
                  "'."
              );
          else console.log("[hCaptcha] render: invalid container '" + e + "'.");
        }),
        function () {
          try {
            return Qn.apply(this, arguments);
          } catch (tr) {
            De("global", tr);
          }
        }),
      reset: function (e) {
        var t;
        if (e) {
          if (!(t = Sn.getById(e))) throw new yn(e);
          t.reset();
        } else {
          if (!(t = Sn.getByIndex(0))) throw new vn();
          t.reset();
        }
      },
      remove: Vn,
      execute: En,
      getResponse: function (e) {
        var t, n;
        if (
          ((n = e ? Sn.getById(e) : Sn.getByIndex(0)) &&
            (t = n.checkbox.response || ""),
          void 0 !== t)
        )
          return t;
        throw e ? new yn(e) : new vn();
      },
      getRespKey: kn,
      close: function (e) {
        var t = !1;
        if (!(t = e ? Sn.getById(e) : Sn.getByIndex(0)))
          throw e ? new yn(e) : new vn();
        t.closeChallenge({ event: ne });
      },
      setData: function (e, t) {
        if (
          ("object" != typeof e || t || ((t = e), (e = null)),
          !t || "object" != typeof t)
        )
          throw Error("[hCaptcha] invalid data supplied");
        var n = !1;
        if (!(n = e ? Sn.getById(e) : Sn.getByIndex(0)))
          throw e ? new yn(e) : new vn();
        Ge("Set data", "hCaptcha", "info");
        var r = n.challenge.setData.bind(n.challenge);
        n.onReady(r, t);
      },
      nodes: Sn,
    };
  !(function (e) {
    try {
      dn(0);
    } catch (tr) {
      De("vm", tr);
    }
    ye.file = "hcaptcha";
    var t = document.currentScript,
      n = !1,
      r = !1,
      i = "on",
      o = ee.Browser.width() / ee.Browser.height(),
      a = !(!window.hcaptcha || !window.hcaptcha.render);
    function s() {
      var e = ee.Browser.width(),
        t = ee.Browser.height(),
        n = ee.System.mobile && o !== e / t;
      (o = e / t),
        u(),
        er.nodes.each(function (r) {
          r.visible && r.resize(e, t, n);
        });
    }
    function c(e) {
      l(),
        er.nodes.each(function (e) {
          e.visible && e.position();
        });
    }
    function l() {
      try {
        var e = [
          ee.Browser.scrollX(),
          ee.Browser.scrollY(),
          document.documentElement.clientWidth / ee.Browser.width(),
          Date.now(),
        ];
        fn.circBuffPush("xy", e), un.circBuffPush("xy", e);
      } catch (tr) {
        De("motion", tr);
      }
    }
    function u() {
      try {
        var e = [
          ee.Browser.width(),
          ee.Browser.height(),
          ee.System.dpr(),
          Date.now(),
        ];
        fn.circBuffPush("wn", e);
      } catch (tr) {
        De("motion", tr);
      }
    }
    (window.hcaptcha = {
      render: function () {
        return (
          a ||
            console.warn(
              "[hCaptcha] should not render before js api is fully loaded. `render=explicit` should be used in combination with `onload`."
            ),
          er.render.apply(this, arguments)
        );
      },
      remove: er.remove,
      execute: er.execute,
      reset: er.reset,
      close: er.close,
      setData: er.setData,
      getResponse: er.getResponse,
      getRespKey: er.getRespKey,
    }),
      Wn.run({ topLevel: !0 }),
      (function (e) {
        var t = Array.prototype.slice.call(arguments, 1);
        !0 !== Lt &&
        "interactive" !== document.readyState &&
        "loaded" !== document.readyState &&
        "complete" !== document.readyState
          ? (It.push({ fn: e, args: t }), !1 === Zt && zt())
          : setTimeout(function () {
              e(t);
            }, 1);
      })(function () {
        !(function () {
          var o;
          o = t ? [t] : document.getElementsByTagName("script");
          var a = -1,
            s = !1,
            c = null,
            l = null;
          for (; ++a < o.length && !1 === s; )
            o[a] &&
              o[a].src &&
              ((l = (c = o[a].src.split("?"))[0]),
              /\/(hcaptcha|1\/api)\.js$/.test(l) &&
                ((s = o[a]),
                l &&
                  -1 !== l.toLowerCase().indexOf("www.") &&
                  console.warn(
                    "[hCaptcha] JS API is being loaded from www.hcaptcha.com. Please use https://js.hcaptcha.com/1/api.js"
                  )));
          if (!1 === s) return;
          (e = e || ze(c[1])),
            (n = e.onload || !1),
            (r = e.render || !1),
            "off" === e.tplinks && (i = "off");
          (ve.tplinks = i),
            (ve.language = e.hl || null),
            e.endpoint && (ve.endpoint = e.endpoint);
          (ve.reportapi = e.reportapi || ve.reportapi),
            (ve.imghost = e.imghost || null),
            (ve.custom = e.custom || ve.custom),
            (ve.se = e.se || null),
            (ve.pat = e.pat || ve.pat),
            (ve.pstIssuer = e.pstissuer || ve.pstIssuer),
            (ve.andint = e.andint || ve.andint),
            (ve.orientation = e.orientation || null),
            e.assethost &&
              (st.URL(e.assethost)
                ? (ve.assethost = e.assethost)
                : console.error("Invalid assethost uri."));
          (ve.recaptchacompat = e.recaptchacompat || ve.recaptchacompat),
            (ye.host = e.host || window.location.hostname),
            (ve.sentry = !1 !== e.sentry),
            Ae(!1),
            (ve.language =
              ve.language ||
              window.navigator.userLanguage ||
              window.navigator.language),
            xt.setLocale(ve.language),
            "off" === ve.recaptchacompat
              ? console.log("recaptchacompat disabled")
              : (window.grecaptcha = window.hcaptcha);
        })(),
          n &&
            setTimeout(function () {
              it(n);
            }, 1),
          a ||
            ((a = !0),
            (function () {
              var e = xt.getLocale();
              if ("en" === e) return;
              $n(e)
                .then(function () {
                  er.nodes.each(function (t) {
                    if (t)
                      try {
                        t.isLangSet() || t.updateTranslation(e);
                      } catch (tr) {
                        De("translation", tr);
                      }
                  });
                })
                ["catch"](function (t) {
                  je("lang:loading-error", "error", "api", {
                    locale: e,
                    error: t,
                  });
                });
            })(),
            !1 === r || "onload" === r
              ? Ee(er.render)
              : "explicit" !== r &&
                console.log(
                  "hcaptcha: invalid render parameter '" +
                    r +
                    "', using 'explicit' instead."
                ),
            (function () {
              try {
                fn.record(),
                  un.record({ 1: !0, 2: !0, 3: !0, 4: !1 }),
                  fn.setData("sc", ee.Browser.getScreenDimensions()),
                  fn.setData("or", ee.Browser.getOrientation()),
                  fn.setData("wi", ee.Browser.getWindowDimensions()),
                  fn.setData("nv", ee.Browser.interrogateNavigator()),
                  fn.setData("dr", document.referrer),
                  un.setData("sc", ee.Browser.getScreenDimensions()),
                  un.setData("wi", ee.Browser.getWindowDimensions()),
                  un.setData("or", ee.Browser.getOrientation()),
                  un.setData("dr", document.referrer),
                  u(),
                  l();
              } catch (tr) {
                De("motion", tr);
              }
            })(),
            (function () {
              try {
                hn.record({ 1: !1, 2: !0, 3: !0, 4: !0, 5: !0, 6: !0 });
              } catch (tr) {
                De("bi-vm", tr);
              }
            })(),
            Jt.addEventListener("resize", s),
            Jt.addEventListener("scroll", c));
      });
  })();
})();
