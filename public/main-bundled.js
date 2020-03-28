!(function(e) {
  var t = {};
  function n(r) {
    if (t[r]) return t[r].exports;
    var o = (t[r] = { i: r, l: !1, exports: {} });
    return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function(e, t, r) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
    }),
    (n.r = function(e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (n.t = function(e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if (
        (n.r(r),
        Object.defineProperty(r, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var o in e)
          n.d(
            r,
            o,
            function(t) {
              return e[t];
            }.bind(null, o)
          );
      return r;
    }),
    (n.n = function(e) {
      var t =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };
      return n.d(t, "a", t), t;
    }),
    (n.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ""),
    n((n.s = 27));
})([
  function(e, t, n) {
    "use strict";
    var r = n(2),
      o = Object.prototype.toString;
    function i(e) {
      return "[object Array]" === o.call(e);
    }
    function a(e) {
      return void 0 === e;
    }
    function s(e) {
      return null !== e && "object" == typeof e;
    }
    function l(e) {
      return "[object Function]" === o.call(e);
    }
    function c(e, t) {
      if (null != e)
        if (("object" != typeof e && (e = [e]), i(e)))
          for (var n = 0, r = e.length; n < r; n++) t.call(null, e[n], n, e);
        else
          for (var o in e)
            Object.prototype.hasOwnProperty.call(e, o) &&
              t.call(null, e[o], o, e);
    }
    e.exports = {
      isArray: i,
      isArrayBuffer: function(e) {
        return "[object ArrayBuffer]" === o.call(e);
      },
      isBuffer: function(e) {
        return (
          null !== e &&
          !a(e) &&
          null !== e.constructor &&
          !a(e.constructor) &&
          "function" == typeof e.constructor.isBuffer &&
          e.constructor.isBuffer(e)
        );
      },
      isFormData: function(e) {
        return "undefined" != typeof FormData && e instanceof FormData;
      },
      isArrayBufferView: function(e) {
        return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView
          ? ArrayBuffer.isView(e)
          : e && e.buffer && e.buffer instanceof ArrayBuffer;
      },
      isString: function(e) {
        return "string" == typeof e;
      },
      isNumber: function(e) {
        return "number" == typeof e;
      },
      isObject: s,
      isUndefined: a,
      isDate: function(e) {
        return "[object Date]" === o.call(e);
      },
      isFile: function(e) {
        return "[object File]" === o.call(e);
      },
      isBlob: function(e) {
        return "[object Blob]" === o.call(e);
      },
      isFunction: l,
      isStream: function(e) {
        return s(e) && l(e.pipe);
      },
      isURLSearchParams: function(e) {
        return (
          "undefined" != typeof URLSearchParams && e instanceof URLSearchParams
        );
      },
      isStandardBrowserEnv: function() {
        return (
          ("undefined" == typeof navigator ||
            ("ReactNative" !== navigator.product &&
              "NativeScript" !== navigator.product &&
              "NS" !== navigator.product)) &&
          "undefined" != typeof window && "undefined" != typeof document
        );
      },
      forEach: c,
      merge: function e() {
        var t = {};
        function n(n, r) {
          "object" == typeof t[r] && "object" == typeof n
            ? (t[r] = e(t[r], n))
            : (t[r] = n);
        }
        for (var r = 0, o = arguments.length; r < o; r++) c(arguments[r], n);
        return t;
      },
      deepMerge: function e() {
        var t = {};
        function n(n, r) {
          "object" == typeof t[r] && "object" == typeof n
            ? (t[r] = e(t[r], n))
            : (t[r] = "object" == typeof n ? e({}, n) : n);
        }
        for (var r = 0, o = arguments.length; r < o; r++) c(arguments[r], n);
        return t;
      },
      extend: function(e, t, n) {
        return (
          c(t, function(t, o) {
            e[o] = n && "function" == typeof t ? r(t, n) : t;
          }),
          e
        );
      },
      trim: function(e) {
        return e.replace(/^\s*/, "").replace(/\s*$/, "");
      }
    };
  },
  function(e, t, n) {
    e.exports = n(10);
  },
  function(e, t, n) {
    "use strict";
    e.exports = function(e, t) {
      return function() {
        for (var n = new Array(arguments.length), r = 0; r < n.length; r++)
          n[r] = arguments[r];
        return e.apply(t, n);
      };
    };
  },
  function(e, t, n) {
    "use strict";
    var r = n(0);
    function o(e) {
      return encodeURIComponent(e)
        .replace(/%40/gi, "@")
        .replace(/%3A/gi, ":")
        .replace(/%24/g, "$")
        .replace(/%2C/gi, ",")
        .replace(/%20/g, "+")
        .replace(/%5B/gi, "[")
        .replace(/%5D/gi, "]");
    }
    e.exports = function(e, t, n) {
      if (!t) return e;
      var i;
      if (n) i = n(t);
      else if (r.isURLSearchParams(t)) i = t.toString();
      else {
        var a = [];
        r.forEach(t, function(e, t) {
          null != e &&
            (r.isArray(e) ? (t += "[]") : (e = [e]),
            r.forEach(e, function(e) {
              r.isDate(e)
                ? (e = e.toISOString())
                : r.isObject(e) && (e = JSON.stringify(e)),
                a.push(o(t) + "=" + o(e));
            }));
        }),
          (i = a.join("&"));
      }
      if (i) {
        var s = e.indexOf("#");
        -1 !== s && (e = e.slice(0, s)),
          (e += (-1 === e.indexOf("?") ? "?" : "&") + i);
      }
      return e;
    };
  },
  function(e, t, n) {
    "use strict";
    e.exports = function(e) {
      return !(!e || !e.__CANCEL__);
    };
  },
  function(e, t, n) {
    "use strict";
    (function(t) {
      var r = n(0),
        o = n(16),
        i = { "Content-Type": "application/x-www-form-urlencoded" };
      function a(e, t) {
        !r.isUndefined(e) &&
          r.isUndefined(e["Content-Type"]) &&
          (e["Content-Type"] = t);
      }
      var s,
        l = {
          adapter:
            ("undefined" != typeof XMLHttpRequest
              ? (s = n(6))
              : void 0 !== t &&
                "[object process]" === Object.prototype.toString.call(t) &&
                (s = n(6)),
            s),
          transformRequest: [
            function(e, t) {
              return (
                o(t, "Accept"),
                o(t, "Content-Type"),
                r.isFormData(e) ||
                r.isArrayBuffer(e) ||
                r.isBuffer(e) ||
                r.isStream(e) ||
                r.isFile(e) ||
                r.isBlob(e)
                  ? e
                  : r.isArrayBufferView(e)
                  ? e.buffer
                  : r.isURLSearchParams(e)
                  ? (a(t, "application/x-www-form-urlencoded;charset=utf-8"),
                    e.toString())
                  : r.isObject(e)
                  ? (a(t, "application/json;charset=utf-8"), JSON.stringify(e))
                  : e
              );
            }
          ],
          transformResponse: [
            function(e) {
              if ("string" == typeof e)
                try {
                  e = JSON.parse(e);
                } catch (e) {}
              return e;
            }
          ],
          timeout: 0,
          xsrfCookieName: "XSRF-TOKEN",
          xsrfHeaderName: "X-XSRF-TOKEN",
          maxContentLength: -1,
          validateStatus: function(e) {
            return e >= 200 && e < 300;
          }
        };
      (l.headers = { common: { Accept: "application/json, text/plain, */*" } }),
        r.forEach(["delete", "get", "head"], function(e) {
          l.headers[e] = {};
        }),
        r.forEach(["post", "put", "patch"], function(e) {
          l.headers[e] = r.merge(i);
        }),
        (e.exports = l);
    }.call(this, n(15)));
  },
  function(e, t, n) {
    "use strict";
    var r = n(0),
      o = n(17),
      i = n(3),
      a = n(19),
      s = n(22),
      l = n(23),
      c = n(7);
    e.exports = function(e) {
      return new Promise(function(t, u) {
        var d = e.data,
          f = e.headers;
        r.isFormData(d) && delete f["Content-Type"];
        var m = new XMLHttpRequest();
        if (e.auth) {
          var h = e.auth.username || "",
            p = e.auth.password || "";
          f.Authorization = "Basic " + btoa(h + ":" + p);
        }
        var y = a(e.baseURL, e.url);
        if (
          (m.open(
            e.method.toUpperCase(),
            i(y, e.params, e.paramsSerializer),
            !0
          ),
          (m.timeout = e.timeout),
          (m.onreadystatechange = function() {
            if (
              m &&
              4 === m.readyState &&
              (0 !== m.status ||
                (m.responseURL && 0 === m.responseURL.indexOf("file:")))
            ) {
              var n =
                  "getAllResponseHeaders" in m
                    ? s(m.getAllResponseHeaders())
                    : null,
                r = {
                  data:
                    e.responseType && "text" !== e.responseType
                      ? m.response
                      : m.responseText,
                  status: m.status,
                  statusText: m.statusText,
                  headers: n,
                  config: e,
                  request: m
                };
              o(t, u, r), (m = null);
            }
          }),
          (m.onabort = function() {
            m && (u(c("Request aborted", e, "ECONNABORTED", m)), (m = null));
          }),
          (m.onerror = function() {
            u(c("Network Error", e, null, m)), (m = null);
          }),
          (m.ontimeout = function() {
            var t = "timeout of " + e.timeout + "ms exceeded";
            e.timeoutErrorMessage && (t = e.timeoutErrorMessage),
              u(c(t, e, "ECONNABORTED", m)),
              (m = null);
          }),
          r.isStandardBrowserEnv())
        ) {
          var v = n(24),
            b =
              (e.withCredentials || l(y)) && e.xsrfCookieName
                ? v.read(e.xsrfCookieName)
                : void 0;
          b && (f[e.xsrfHeaderName] = b);
        }
        if (
          ("setRequestHeader" in m &&
            r.forEach(f, function(e, t) {
              void 0 === d && "content-type" === t.toLowerCase()
                ? delete f[t]
                : m.setRequestHeader(t, e);
            }),
          r.isUndefined(e.withCredentials) ||
            (m.withCredentials = !!e.withCredentials),
          e.responseType)
        )
          try {
            m.responseType = e.responseType;
          } catch (t) {
            if ("json" !== e.responseType) throw t;
          }
        "function" == typeof e.onDownloadProgress &&
          m.addEventListener("progress", e.onDownloadProgress),
          "function" == typeof e.onUploadProgress &&
            m.upload &&
            m.upload.addEventListener("progress", e.onUploadProgress),
          e.cancelToken &&
            e.cancelToken.promise.then(function(e) {
              m && (m.abort(), u(e), (m = null));
            }),
          void 0 === d && (d = null),
          m.send(d);
      });
    };
  },
  function(e, t, n) {
    "use strict";
    var r = n(18);
    e.exports = function(e, t, n, o, i) {
      var a = new Error(e);
      return r(a, t, n, o, i);
    };
  },
  function(e, t, n) {
    "use strict";
    var r = n(0);
    e.exports = function(e, t) {
      t = t || {};
      var n = {},
        o = ["url", "method", "params", "data"],
        i = ["headers", "auth", "proxy"],
        a = [
          "baseURL",
          "url",
          "transformRequest",
          "transformResponse",
          "paramsSerializer",
          "timeout",
          "withCredentials",
          "adapter",
          "responseType",
          "xsrfCookieName",
          "xsrfHeaderName",
          "onUploadProgress",
          "onDownloadProgress",
          "maxContentLength",
          "validateStatus",
          "maxRedirects",
          "httpAgent",
          "httpsAgent",
          "cancelToken",
          "socketPath"
        ];
      r.forEach(o, function(e) {
        void 0 !== t[e] && (n[e] = t[e]);
      }),
        r.forEach(i, function(o) {
          r.isObject(t[o])
            ? (n[o] = r.deepMerge(e[o], t[o]))
            : void 0 !== t[o]
            ? (n[o] = t[o])
            : r.isObject(e[o])
            ? (n[o] = r.deepMerge(e[o]))
            : void 0 !== e[o] && (n[o] = e[o]);
        }),
        r.forEach(a, function(r) {
          void 0 !== t[r] ? (n[r] = t[r]) : void 0 !== e[r] && (n[r] = e[r]);
        });
      var s = o.concat(i).concat(a),
        l = Object.keys(t).filter(function(e) {
          return -1 === s.indexOf(e);
        });
      return (
        r.forEach(l, function(r) {
          void 0 !== t[r] ? (n[r] = t[r]) : void 0 !== e[r] && (n[r] = e[r]);
        }),
        n
      );
    };
  },
  function(e, t, n) {
    "use strict";
    function r(e) {
      this.message = e;
    }
    (r.prototype.toString = function() {
      return "Cancel" + (this.message ? ": " + this.message : "");
    }),
      (r.prototype.__CANCEL__ = !0),
      (e.exports = r);
  },
  function(e, t, n) {
    "use strict";
    var r = n(0),
      o = n(2),
      i = n(11),
      a = n(8);
    function s(e) {
      var t = new i(e),
        n = o(i.prototype.request, t);
      return r.extend(n, i.prototype, t), r.extend(n, t), n;
    }
    var l = s(n(5));
    (l.Axios = i),
      (l.create = function(e) {
        return s(a(l.defaults, e));
      }),
      (l.Cancel = n(9)),
      (l.CancelToken = n(25)),
      (l.isCancel = n(4)),
      (l.all = function(e) {
        return Promise.all(e);
      }),
      (l.spread = n(26)),
      (e.exports = l),
      (e.exports.default = l);
  },
  function(e, t, n) {
    "use strict";
    var r = n(0),
      o = n(3),
      i = n(12),
      a = n(13),
      s = n(8);
    function l(e) {
      (this.defaults = e),
        (this.interceptors = { request: new i(), response: new i() });
    }
    (l.prototype.request = function(e) {
      "string" == typeof e
        ? ((e = arguments[1] || {}).url = arguments[0])
        : (e = e || {}),
        (e = s(this.defaults, e)).method
          ? (e.method = e.method.toLowerCase())
          : this.defaults.method
          ? (e.method = this.defaults.method.toLowerCase())
          : (e.method = "get");
      var t = [a, void 0],
        n = Promise.resolve(e);
      for (
        this.interceptors.request.forEach(function(e) {
          t.unshift(e.fulfilled, e.rejected);
        }),
          this.interceptors.response.forEach(function(e) {
            t.push(e.fulfilled, e.rejected);
          });
        t.length;

      )
        n = n.then(t.shift(), t.shift());
      return n;
    }),
      (l.prototype.getUri = function(e) {
        return (
          (e = s(this.defaults, e)),
          o(e.url, e.params, e.paramsSerializer).replace(/^\?/, "")
        );
      }),
      r.forEach(["delete", "get", "head", "options"], function(e) {
        l.prototype[e] = function(t, n) {
          return this.request(r.merge(n || {}, { method: e, url: t }));
        };
      }),
      r.forEach(["post", "put", "patch"], function(e) {
        l.prototype[e] = function(t, n, o) {
          return this.request(r.merge(o || {}, { method: e, url: t, data: n }));
        };
      }),
      (e.exports = l);
  },
  function(e, t, n) {
    "use strict";
    var r = n(0);
    function o() {
      this.handlers = [];
    }
    (o.prototype.use = function(e, t) {
      return (
        this.handlers.push({ fulfilled: e, rejected: t }),
        this.handlers.length - 1
      );
    }),
      (o.prototype.eject = function(e) {
        this.handlers[e] && (this.handlers[e] = null);
      }),
      (o.prototype.forEach = function(e) {
        r.forEach(this.handlers, function(t) {
          null !== t && e(t);
        });
      }),
      (e.exports = o);
  },
  function(e, t, n) {
    "use strict";
    var r = n(0),
      o = n(14),
      i = n(4),
      a = n(5);
    function s(e) {
      e.cancelToken && e.cancelToken.throwIfRequested();
    }
    e.exports = function(e) {
      return (
        s(e),
        (e.headers = e.headers || {}),
        (e.data = o(e.data, e.headers, e.transformRequest)),
        (e.headers = r.merge(
          e.headers.common || {},
          e.headers[e.method] || {},
          e.headers
        )),
        r.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          function(t) {
            delete e.headers[t];
          }
        ),
        (e.adapter || a.adapter)(e).then(
          function(t) {
            return (
              s(e), (t.data = o(t.data, t.headers, e.transformResponse)), t
            );
          },
          function(t) {
            return (
              i(t) ||
                (s(e),
                t &&
                  t.response &&
                  (t.response.data = o(
                    t.response.data,
                    t.response.headers,
                    e.transformResponse
                  ))),
              Promise.reject(t)
            );
          }
        )
      );
    };
  },
  function(e, t, n) {
    "use strict";
    var r = n(0);
    e.exports = function(e, t, n) {
      return (
        r.forEach(n, function(n) {
          e = n(e, t);
        }),
        e
      );
    };
  },
  function(e, t) {
    var n,
      r,
      o = (e.exports = {});
    function i() {
      throw new Error("setTimeout has not been defined");
    }
    function a() {
      throw new Error("clearTimeout has not been defined");
    }
    function s(e) {
      if (n === setTimeout) return setTimeout(e, 0);
      if ((n === i || !n) && setTimeout)
        return (n = setTimeout), setTimeout(e, 0);
      try {
        return n(e, 0);
      } catch (t) {
        try {
          return n.call(null, e, 0);
        } catch (t) {
          return n.call(this, e, 0);
        }
      }
    }
    !(function() {
      try {
        n = "function" == typeof setTimeout ? setTimeout : i;
      } catch (e) {
        n = i;
      }
      try {
        r = "function" == typeof clearTimeout ? clearTimeout : a;
      } catch (e) {
        r = a;
      }
    })();
    var l,
      c = [],
      u = !1,
      d = -1;
    function f() {
      u &&
        l &&
        ((u = !1), l.length ? (c = l.concat(c)) : (d = -1), c.length && m());
    }
    function m() {
      if (!u) {
        var e = s(f);
        u = !0;
        for (var t = c.length; t; ) {
          for (l = c, c = []; ++d < t; ) l && l[d].run();
          (d = -1), (t = c.length);
        }
        (l = null),
          (u = !1),
          (function(e) {
            if (r === clearTimeout) return clearTimeout(e);
            if ((r === a || !r) && clearTimeout)
              return (r = clearTimeout), clearTimeout(e);
            try {
              r(e);
            } catch (t) {
              try {
                return r.call(null, e);
              } catch (t) {
                return r.call(this, e);
              }
            }
          })(e);
      }
    }
    function h(e, t) {
      (this.fun = e), (this.array = t);
    }
    function p() {}
    (o.nextTick = function(e) {
      var t = new Array(arguments.length - 1);
      if (arguments.length > 1)
        for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
      c.push(new h(e, t)), 1 !== c.length || u || s(m);
    }),
      (h.prototype.run = function() {
        this.fun.apply(null, this.array);
      }),
      (o.title = "browser"),
      (o.browser = !0),
      (o.env = {}),
      (o.argv = []),
      (o.version = ""),
      (o.versions = {}),
      (o.on = p),
      (o.addListener = p),
      (o.once = p),
      (o.off = p),
      (o.removeListener = p),
      (o.removeAllListeners = p),
      (o.emit = p),
      (o.prependListener = p),
      (o.prependOnceListener = p),
      (o.listeners = function(e) {
        return [];
      }),
      (o.binding = function(e) {
        throw new Error("process.binding is not supported");
      }),
      (o.cwd = function() {
        return "/";
      }),
      (o.chdir = function(e) {
        throw new Error("process.chdir is not supported");
      }),
      (o.umask = function() {
        return 0;
      });
  },
  function(e, t, n) {
    "use strict";
    var r = n(0);
    e.exports = function(e, t) {
      r.forEach(e, function(n, r) {
        r !== t &&
          r.toUpperCase() === t.toUpperCase() &&
          ((e[t] = n), delete e[r]);
      });
    };
  },
  function(e, t, n) {
    "use strict";
    var r = n(7);
    e.exports = function(e, t, n) {
      var o = n.config.validateStatus;
      !o || o(n.status)
        ? e(n)
        : t(
            r(
              "Request failed with status code " + n.status,
              n.config,
              null,
              n.request,
              n
            )
          );
    };
  },
  function(e, t, n) {
    "use strict";
    e.exports = function(e, t, n, r, o) {
      return (
        (e.config = t),
        n && (e.code = n),
        (e.request = r),
        (e.response = o),
        (e.isAxiosError = !0),
        (e.toJSON = function() {
          return {
            message: this.message,
            name: this.name,
            description: this.description,
            number: this.number,
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            config: this.config,
            code: this.code
          };
        }),
        e
      );
    };
  },
  function(e, t, n) {
    "use strict";
    var r = n(20),
      o = n(21);
    e.exports = function(e, t) {
      return e && !r(t) ? o(e, t) : t;
    };
  },
  function(e, t, n) {
    "use strict";
    e.exports = function(e) {
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e);
    };
  },
  function(e, t, n) {
    "use strict";
    e.exports = function(e, t) {
      return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e;
    };
  },
  function(e, t, n) {
    "use strict";
    var r = n(0),
      o = [
        "age",
        "authorization",
        "content-length",
        "content-type",
        "etag",
        "expires",
        "from",
        "host",
        "if-modified-since",
        "if-unmodified-since",
        "last-modified",
        "location",
        "max-forwards",
        "proxy-authorization",
        "referer",
        "retry-after",
        "user-agent"
      ];
    e.exports = function(e) {
      var t,
        n,
        i,
        a = {};
      return e
        ? (r.forEach(e.split("\n"), function(e) {
            if (
              ((i = e.indexOf(":")),
              (t = r.trim(e.substr(0, i)).toLowerCase()),
              (n = r.trim(e.substr(i + 1))),
              t)
            ) {
              if (a[t] && o.indexOf(t) >= 0) return;
              a[t] =
                "set-cookie" === t
                  ? (a[t] ? a[t] : []).concat([n])
                  : a[t]
                  ? a[t] + ", " + n
                  : n;
            }
          }),
          a)
        : a;
    };
  },
  function(e, t, n) {
    "use strict";
    var r = n(0);
    e.exports = r.isStandardBrowserEnv()
      ? (function() {
          var e,
            t = /(msie|trident)/i.test(navigator.userAgent),
            n = document.createElement("a");
          function o(e) {
            var r = e;
            return (
              t && (n.setAttribute("href", r), (r = n.href)),
              n.setAttribute("href", r),
              {
                href: n.href,
                protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
                host: n.host,
                search: n.search ? n.search.replace(/^\?/, "") : "",
                hash: n.hash ? n.hash.replace(/^#/, "") : "",
                hostname: n.hostname,
                port: n.port,
                pathname:
                  "/" === n.pathname.charAt(0) ? n.pathname : "/" + n.pathname
              }
            );
          }
          return (
            (e = o(window.location.href)),
            function(t) {
              var n = r.isString(t) ? o(t) : t;
              return n.protocol === e.protocol && n.host === e.host;
            }
          );
        })()
      : function() {
          return !0;
        };
  },
  function(e, t, n) {
    "use strict";
    var r = n(0);
    e.exports = r.isStandardBrowserEnv()
      ? {
          write: function(e, t, n, o, i, a) {
            var s = [];
            s.push(e + "=" + encodeURIComponent(t)),
              r.isNumber(n) && s.push("expires=" + new Date(n).toGMTString()),
              r.isString(o) && s.push("path=" + o),
              r.isString(i) && s.push("domain=" + i),
              !0 === a && s.push("secure"),
              (document.cookie = s.join("; "));
          },
          read: function(e) {
            var t = document.cookie.match(
              new RegExp("(^|;\\s*)(" + e + ")=([^;]*)")
            );
            return t ? decodeURIComponent(t[3]) : null;
          },
          remove: function(e) {
            this.write(e, "", Date.now() - 864e5);
          }
        }
      : {
          write: function() {},
          read: function() {
            return null;
          },
          remove: function() {}
        };
  },
  function(e, t, n) {
    "use strict";
    var r = n(9);
    function o(e) {
      if ("function" != typeof e)
        throw new TypeError("executor must be a function.");
      var t;
      this.promise = new Promise(function(e) {
        t = e;
      });
      var n = this;
      e(function(e) {
        n.reason || ((n.reason = new r(e)), t(n.reason));
      });
    }
    (o.prototype.throwIfRequested = function() {
      if (this.reason) throw this.reason;
    }),
      (o.source = function() {
        var e;
        return {
          token: new o(function(t) {
            e = t;
          }),
          cancel: e
        };
      }),
      (e.exports = o);
  },
  function(e, t, n) {
    "use strict";
    e.exports = function(e) {
      return function(t) {
        return e.apply(null, t);
      };
    };
  },
  function(e, t, n) {
    "use strict";
    function r(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    n.r(t);
    var o = (function() {
      function e() {
        !(function(e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          (this.showMoreProfileBtn = document.querySelector(
            "#more-profile-btn"
          )),
          (this.moreProfileContainer = document.querySelector(
            "#more-profile-container"
          )),
          this.events();
      }
      var t, n, o;
      return (
        (t = e),
        (n = [
          {
            key: "events",
            value: function() {
              var e = this;
              this.showMoreProfileBtn.addEventListener("click", function() {
                return e.showMoreProfileHandler();
              });
            }
          },
          {
            key: "showMoreProfileHandler",
            value: function() {
              "none" == this.moreProfileContainer.style.display
                ? ((this.moreProfileContainer.style.display = "block"),
                  (this.showMoreProfileBtn.innerHTML = "Show less &#8593"))
                : ((this.showMoreProfileBtn.innerHTML = "Show more &#8595"),
                  (this.moreProfileContainer.style.display = "none"));
            }
          }
        ]) && r(t.prototype, n),
        o && r(t, o),
        e
      );
    })();
    function i(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    var a = (function() {
      function e() {
        !(function(e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          (this.optionalFields = document.querySelector("#optional-fields")),
          (this.btnOptionalFields = document.querySelector(
            "#btn-optional-fields"
          )),
          (this.moreOptionalFields = document.querySelector(
            "#more-optional-fields"
          )),
          (this.btnMoreOptionalFields = document.querySelector(
            "#btn-more-optional-fields"
          )),
          this.events();
      }
      var t, n, r;
      return (
        (t = e),
        (n = [
          {
            key: "events",
            value: function() {
              var e = this;
              this.btnOptionalFields.addEventListener("click", function() {
                return e.toggleOptionalFields();
              }),
                this.btnMoreOptionalFields.addEventListener(
                  "click",
                  function() {
                    return e.toggleMoreOptionalFields();
                  }
                );
            }
          },
          {
            key: "toggleOptionalFields",
            value: function() {
              "block" == this.optionalFields.style.display
                ? ((this.optionalFields.style.display = "none"),
                  (this.btnOptionalFields.innerHTML = "Show &#8595"))
                : ((this.optionalFields.style.display = "block"),
                  (this.btnOptionalFields.innerHTML = "Hide &#8593"));
            }
          },
          {
            key: "toggleMoreOptionalFields",
            value: function() {
              "block" == this.moreOptionalFields.style.display
                ? ((this.moreOptionalFields.style.display = "none"),
                  (this.btnMoreOptionalFields.innerHTML = "Show &#8595"))
                : ((this.moreOptionalFields.style.display = "block"),
                  (this.btnMoreOptionalFields.innerHTML = "Hide &#8593"));
            }
          }
        ]) && i(t.prototype, n),
        r && i(t, r),
        e
      );
    })();
    function s(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    var l = (function() {
      function e() {
        !(function(e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          (this.barChatIconContainer = document.querySelector(
            "#bar-chart-icon-container"
          )),
          (this.statsContainer = document.querySelector("#myChart")),
          (this.filterIconContainer = document.querySelector(
            "#filter-icon-container"
          )),
          (this.formContainer = document.querySelector("#form-container")),
          this.events();
      }
      var t, n, r;
      return (
        (t = e),
        (n = [
          {
            key: "events",
            value: function() {
              var e = this;
              this.barChatIconContainer.addEventListener("click", function() {
                return e.toggleStats();
              });
            }
          },
          {
            key: "toggleStats",
            value: function() {
              "none" == this.statsContainer.style.display
                ? ((this.statsContainer.style.display = "block"),
                  (this.formContainer.style.display = "none"),
                  this.barChatIconContainer.classList.add("top-bar"),
                  this.filterIconContainer.classList.remove("top-bar"))
                : ((this.statsContainer.style.display = "none"),
                  this.barChatIconContainer.classList.remove("top-bar"));
            }
          }
        ]) && s(t.prototype, n),
        r && s(t, r),
        e
      );
    })();
    function c(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    var u = (function() {
      function e() {
        !(function(e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          (this.profileImage = document.querySelector("#profile-image")),
          (this.closeImage = document.querySelector("#close-image")),
          (this.profileImageModal = document.querySelector(
            "#profile-image-modal"
          )),
          (this.anchorTag = document.querySelector("#anchor-tag")),
          (this.body = document.querySelector("body")),
          this.events();
      }
      var t, n, r;
      return (
        (t = e),
        (n = [
          {
            key: "events",
            value: function() {
              var e = this;
              this.profileImage.addEventListener("click", function(t) {
                return e.profileImageHandler(t);
              }),
                this.closeImage.addEventListener("click", function() {
                  return e.closeImageHandler();
                }),
                this.anchorTag &&
                  this.anchorTag.addEventListener("click", function(t) {
                    return e.anchorTagHandler(t);
                  }),
                this.body.addEventListener("click", function() {
                  return e.closeImageHandler();
                });
            }
          },
          {
            key: "profileImageHandler",
            value: function(e) {
              e.stopPropagation(),
                "none" == this.profileImageModal.style.display
                  ? ((this.profileImageModal.style.display = "block"),
                    (this.body.style.backgroundColor = "black"))
                  : ((this.profileImageModal.style.display = "none"),
                    (this.body.style.backgroundColor = "#edf2f7"));
            }
          },
          {
            key: "closeImageHandler",
            value: function() {
              (this.profileImageModal.style.display = "none"),
                (this.body.style.backgroundColor = "#edf2f7");
            }
          },
          {
            key: "anchorTagHandler",
            value: function(e) {
              console.log(e.target);
            }
          }
        ]) && c(t.prototype, n),
        r && c(t, r),
        e
      );
    })();
    function d(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    var f = (function() {
        function e() {
          !(function(e, t) {
            if (!(e instanceof t))
              throw new TypeError("Cannot call a class as a function");
          })(this, e),
            (this.deleteBtn = document.querySelector("#delete-profile")),
            (this.deleteModal = document.querySelector(
              "#delete-profile-confirm-container"
            )),
            (this.closeModalBtn = document.querySelector("#close-modal")),
            (this.htmlBody = document.querySelector("html")),
            (this.body = document.querySelector("body")),
            this.events();
        }
        var t, n, r;
        return (
          (t = e),
          (n = [
            {
              key: "events",
              value: function() {
                var e = this;
                this.deleteBtn.addEventListener("click", function(t) {
                  return e.deleteHandler(t);
                }),
                  this.closeModalBtn.addEventListener("click", function() {
                    return e.closeModalHandler();
                  }),
                  this.htmlBody.addEventListener("click", function() {
                    return e.bodyHandler();
                  });
              }
            },
            {
              key: "deleteHandler",
              value: function(e) {
                e.stopPropagation(),
                  (this.deleteModal.style.display = "block"),
                  this.body.style.setProperty("background-color", "black");
              }
            },
            {
              key: "closeModalHandler",
              value: function() {
                (this.deleteModal.style.display = "none"),
                  (this.body.style.backgroundColor = "#edf2f7");
              }
            },
            {
              key: "bodyHandler",
              value: function() {
                (this.deleteModal.style.display = "none"),
                  (this.body.style.backgroundColor = "#edf2f7");
              }
            }
          ]) && d(t.prototype, n),
          r && d(t, r),
          e
        );
      })(),
      m = n(1),
      h = n.n(m);
    function p(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    var y = (function() {
      function e() {
        !(function(e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          (this.form = document.querySelector("#registration-form")),
          (this.allFields = document.querySelectorAll(
            "#registration-form .form-control"
          )),
          this.insertValidationElements(),
          (this.firstName = document.querySelector("#first-name")),
          (this.firstName.previousValue = ""),
          (this.lastName = document.querySelector("#last-name")),
          (this.lastName.previousValue = ""),
          (this.email = document.querySelector("#email")),
          (this.email.previousValue = ""),
          (this.email.isUnique = !1),
          (this.year = document.querySelector("#year")),
          (this.year.previousValue = ""),
          (this.password = document.querySelector("#password")),
          (this.password.previousValue = ""),
          this.events();
      }
      var t, n, r;
      return (
        (t = e),
        (n = [
          {
            key: "events",
            value: function() {
              var e = this;
              this.form.addEventListener("submit", function(t) {
                t.preventDefault(), e.formSubmitHandler();
              }),
                this.firstName.addEventListener("keyup", function() {
                  e.isDifferent(e.firstName, e.firstNameHandler);
                }),
                this.lastName.addEventListener("keyup", function() {
                  e.isDifferent(e.lastName, e.lastNameHandler);
                }),
                this.email.addEventListener("keyup", function() {
                  e.isDifferent(e.email, e.emailHandler);
                }),
                this.year.addEventListener("keyup", function() {
                  e.isDifferent(e.year, e.yearHandler());
                }),
                this.password.addEventListener("keyup", function() {
                  e.isDifferent(e.password, e.passwordHandler);
                }),
                this.firstName.addEventListener("blur", function() {
                  e.isDifferent(e.firstName, e.firstNameHandler);
                }),
                this.lastName.addEventListener("blur", function() {
                  e.isDifferent(e.lastName, e.lastNameHandler);
                }),
                this.year.addEventListener("blur", function() {
                  e.isDifferent(e.year, e.yearHandler());
                }),
                this.email.addEventListener("blur", function() {
                  e.isDifferent(e.email, e.emailHandler);
                }),
                this.password.addEventListener("blur", function() {
                  e.isDifferent(e.password, e.passwordHandler);
                });
            }
          },
          {
            key: "isDifferent",
            value: function(e, t) {
              e.previousValue != e.value && t.call(this),
                (e.previousValue = e.value);
            }
          },
          {
            key: "hideValidationError",
            value: function(e) {
              e.nextElementSibling.classList.remove(
                "liveValidationMessage--show"
              );
            }
          },
          {
            key: "showValidationError",
            value: function(e, t) {
              (e.nextElementSibling.innerText = t),
                e.nextElementSibling.classList.add(
                  "liveValidationMessage--show"
                ),
                (e.errors = !0);
            }
          },
          {
            key: "insertValidationElements",
            value: function() {
              this.allFields.forEach(function(e) {
                e.insertAdjacentHTML(
                  "afterend",
                  '<div class="bg-red-100 border-red-400 border-l border-t border-r text-red-700 text-center text-xs rounded liveValidationMessage">ada</div>'
                );
              });
            }
          },
          {
            key: "formSubmitHandler",
            value: function() {
              this.firstNameImmediately(),
                this.firstNameAfterDelay(),
                this.lastNameImmediately(),
                this.lastNameAfterDelay(),
                this.emailAfterDelay(),
                this.yearImmediately(),
                this.yearAfterDelay(),
                this.passwordImmediately(),
                this.passwordAfterDelay(),
                this.firstName.errors ||
                  this.lastName.errors ||
                  !this.email.isUnique ||
                  this.email.errors ||
                  this.year.errors ||
                  this.password.errors ||
                  this.form.submit();
            }
          },
          {
            key: "passwordHandler",
            value: function() {
              var e = this;
              (this.password.errors = !1),
                this.passwordImmediately(),
                clearTimeout(this.password.timer),
                (this.password.timer = setTimeout(function() {
                  return e.passwordAfterDelay();
                }, 1e3));
            }
          },
          {
            key: "passwordImmediately",
            value: function() {
              this.password.value.length > 50 &&
                this.showValidationError(
                  this.password,
                  "Password cannot exceed 50 characters."
                ),
                this.password.errors || this.hideValidationError(this.password);
            }
          },
          {
            key: "passwordAfterDelay",
            value: function() {
              this.password.value.length < 6 &&
                this.showValidationError(
                  this.password,
                  "Password must be at least 6 characters."
                );
            }
          },
          {
            key: "emailHandler",
            value: function() {
              var e = this;
              (this.email.errors = !1),
                clearTimeout(this.email.timer),
                (this.email.timer = setTimeout(function() {
                  return e.emailAfterDelay();
                }, 1e3));
            }
          },
          {
            key: "emailAfterDelay",
            value: function() {
              var e = this;
              this.isEmail(this.email.value) ||
                this.showValidationError(
                  this.email,
                  "You must provide a valid email address."
                ),
                this.email.errors ||
                  h.a
                    .post("/doesEmailExists", { email: this.email.value })
                    .then(function(t) {
                      t.data
                        ? (console.log(t.data),
                          (e.email.isUnique = !1),
                          e.showValidationError(
                            e.email,
                            "That email is already being used."
                          ))
                        : ((e.email.isUnique = !0),
                          e.hideValidationError(e.email));
                    })
                    .catch(function() {
                      console.log("Please try again later.");
                    });
            }
          },
          {
            key: "isEmail",
            value: function(e) {
              return !!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                e
              );
            }
          },
          {
            key: "firstNameHandler",
            value: function() {
              var e = this;
              (this.firstName.errors = !1),
                this.firstNameImmediately(),
                clearTimeout(this.firstName.timer),
                (this.firstName.timer = setTimeout(function() {
                  return e.firstNameAfterDelay();
                }, 1e3));
            }
          },
          {
            key: "firstNameImmediately",
            value: function() {
              "" == this.firstName.value ||
                /^[\w-]+$/.test(this.firstName.value) ||
                this.showValidationError(
                  this.firstName,
                  "First Name can only contain letters, numbers, dashes, and hyphens."
                ),
                this.firstName.value.length > 50 &&
                  this.showValidationError(
                    this.firstName,
                    "First name cannot exceed 50 characters."
                  ),
                this.firstName.errors ||
                  this.hideValidationError(this.firstName);
            }
          },
          {
            key: "firstNameAfterDelay",
            value: function() {
              "" == this.firstName.value &&
                this.showValidationError(
                  this.firstName,
                  "First name cannot be empty."
                );
            }
          },
          {
            key: "lastNameHandler",
            value: function() {
              var e = this;
              (this.lastName.errors = !1),
                this.lastNameImmediately(),
                clearTimeout(this.lastName.timer),
                (this.lastName.timer = setTimeout(function() {
                  return e.lastNameAfterDelay();
                }, 1e3));
            }
          },
          {
            key: "lastNameImmediately",
            value: function() {
              "" == this.lastName.value ||
                /^[\w-]+$/.test(this.lastName.value) ||
                this.showValidationError(
                  this.lastName,
                  "Last name can only contain letters, numbers, dashes, and hyphens."
                ),
                this.lastName.value.length > 50 &&
                  this.showValidationError(
                    this.lastName,
                    "Last name cannot exceed 50 characters."
                  ),
                this.lastName.errors || this.hideValidationError(this.lastName);
            }
          },
          {
            key: "lastNameAfterDelay",
            value: function() {
              "" == this.lastName.value &&
                this.showValidationError(
                  this.lastName,
                  "Last name cannot be empty."
                );
            }
          },
          {
            key: "yearHandler",
            value: function() {
              var e = this;
              (this.year.errors = !1),
                this.yearImmediately(),
                clearTimeout(this.year.timer),
                (this.year.timer = setTimeout(function() {
                  return e.yearAfterDelay();
                }, 1e3));
            }
          },
          {
            key: "yearImmediately",
            value: function() {
              "" == this.year.value ||
                /^[\d]+$/.test(this.year.value) ||
                this.showValidationError(
                  this.year,
                  "Year can only be numbers."
                ),
                this.year.value.length > 4 &&
                  this.showValidationError(
                    this.year,
                    "Year cannot exceed 4 characters."
                  ),
                this.year.errors || this.hideValidationError(this.year);
            }
          },
          {
            key: "yearAfterDelay",
            value: function() {
              this.year.value.length < 4 &&
                this.showValidationError(
                  this.year,
                  "Year cannot be less than 4 characters."
                );
            }
          }
        ]) && p(t.prototype, n),
        r && p(t, r),
        e
      );
    })();
    function v(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    var b = (function() {
      function e() {
        !(function(e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          (this.filterIconContainer = document.querySelector(
            "#filter-icon-container"
          )),
          (this.formContainer = document.querySelector("#form-container")),
          (this.statsContainer = document.querySelector("#myChart")),
          (this.barChatIconContainer = document.querySelector(
            "#bar-chart-icon-container"
          )),
          this.events();
      }
      var t, n, r;
      return (
        (t = e),
        (n = [
          {
            key: "events",
            value: function() {
              var e = this;
              this.filterIconContainer.addEventListener("click", function() {
                return e.handleFilterIcon();
              });
            }
          },
          {
            key: "handleFilterIcon",
            value: function() {
              "none" == this.formContainer.style.display
                ? ((this.formContainer.style.display = "block"),
                  (this.statsContainer.style.display = "none"),
                  this.filterIconContainer.classList.add("top-bar"),
                  this.barChatIconContainer.classList.remove("top-bar"))
                : (this.filterIconContainer.classList.remove("top-bar"),
                  (this.formContainer.style.display = "none"));
            }
          }
        ]) && v(t.prototype, n),
        r && v(t, r),
        e
      );
    })();
    function g(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    var C = (function() {
      function e() {
        !(function(e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          (this.showAllCommentsToggle = document.querySelector(
            "#show-all-comments-toggle"
          )),
          (this.allCommentsContainer = document.querySelector(
            "#all-comments-container"
          )),
          (this.beforeClickCommentsCount = document.querySelector(
            "#before-click-comments-count"
          )),
          (this.afterClickCommentsCount = document.querySelector(
            "#after-click-comments-count"
          )),
          this.onPageLoad(),
          this.events();
      }
      var t, n, r;
      return (
        (t = e),
        (n = [
          {
            key: "events",
            value: function() {
              var e = this;
              this.showAllCommentsToggle.addEventListener("click", function(t) {
                return e.handleshowAllCommentsToggle();
              });
            }
          },
          {
            key: "onPageLoad",
            value: function() {
              var e = Array.from(this.allCommentsContainer.children).slice(2);
              Array.prototype.forEach.call(e, function(e) {
                e.style.display = "none";
              });
            }
          },
          {
            key: "handleshowAllCommentsToggle",
            value: function() {
              var e = Array.from(this.allCommentsContainer.children).slice(2);
              (this.beforeClickCommentsCount.style.display = "none"),
                (this.afterClickCommentsCount.style.display = "block"),
                Array.prototype.forEach.call(e, function(e) {
                  e.style.display = "block";
                });
            }
          }
        ]) && g(t.prototype, n),
        r && g(t, r),
        e
      );
    })();
    function w(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    var k = n(1),
      E = (function() {
        function e() {
          !(function(e, t) {
            if (!(e instanceof t))
              throw new TypeError("Cannot call a class as a function");
          })(this, e),
            (this.likesButton = document.querySelector("#likes-button")),
            (this.likesContainer = document.querySelector("#likes-container")),
            (this.likesButtonSVG = document.querySelectorAll(
              "#like-button-svg"
            )),
            (this.likeWordContainer = document.querySelector("#like-word")),
            this.events();
        }
        var t, n, r;
        return (
          (t = e),
          (n = [
            {
              key: "events",
              value: function() {
                var e = this;
                this.likesButton.addEventListener("click", function() {
                  return e.handleButtonClick();
                });
              }
            },
            {
              key: "handleButtonClick",
              value: function() {
                var e = this,
                  t = 0,
                  n = "";
                this.likesButton.classList.contains("yes-toggle")
                  ? ((t = -1),
                    (n = "no"),
                    this.likesButton.classList.remove("yes-toggle"),
                    this.likesButton.classList.add("no-toggle"),
                    this.likeWordContainer.classList.remove("yes-like-color"),
                    Array.prototype.forEach.call(this.likesButtonSVG, function(
                      e
                    ) {
                      e.classList.remove("yes"),
                        e.classList.add("no"),
                        (e.style.fill = "white");
                    }))
                  : ((t = 1),
                    (n = "yes"),
                    this.likesButton.classList.remove("no-toggle"),
                    this.likesButton.classList.add("yes-toggle"),
                    this.likeWordContainer.classList.add("yes-like-color"),
                    Array.prototype.forEach.call(this.likesButtonSVG, function(
                      e
                    ) {
                      e.classList.add("yes"),
                        e.classList.remove("no"),
                        (e.style.fill = "#3182ce");
                    })),
                  k
                    .post("/likes", { like: t, color: n })
                    .then(function(t) {
                      k.post("/get-visited-profile-doc")
                        .then(function(t) {
                          for (var n = [], r = 0; r < t.data.length; r++)
                            if ("yes" == t.data[r].color) {
                              var o = t.data[r].visitorName.split(" ")[0];
                              n.push(o);
                            }
                          n.length < 1
                            ? (e.likesContainer.innerHTML = "")
                            : 1 == n.length
                            ? (e.likesContainer.innerHTML = "Liked by ".concat(
                                n[0]
                              ))
                            : 2 == n.length
                            ? (e.likesContainer.innerHTML = "Liked by "
                                .concat(n.slice(0, 1), " & ")
                                .concat(n.slice(1).length, " other"))
                            : (e.likesContainer.innerHTML = "Liked by "
                                .concat(n.slice(0, 1), " & ")
                                .concat(n.slice(1).length, " others"));
                        })
                        .catch(function(e) {
                          console.log(e);
                        });
                    })
                    .catch(function(e) {
                      console.log(e);
                    });
              }
            }
          ]) && w(t.prototype, n),
          r && w(t, r),
          e
        );
      })();
    function L(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    var x = n(1),
      S = (function() {
        function e() {
          !(function(e, t) {
            if (!(e instanceof t))
              throw new TypeError("Cannot call a class as a function");
          })(this, e),
            (this.likesContainer = document.querySelector("#likes-container")),
            (this.namesContainerUL = document.querySelector(
              "#names-container-ul"
            )),
            (this.main = document.querySelector("main")),
            this.events();
        }
        var t, n, r;
        return (
          (t = e),
          (n = [
            {
              key: "events",
              value: function() {
                var e = this;
                this.likesContainer.addEventListener("click", function(t) {
                  return e.handleButtonClick(t);
                }),
                  this.likesContainer.addEventListener("mouseover", function(
                    t
                  ) {
                    return e.handleButtonClick(t);
                  }),
                  this.main.addEventListener("click", function() {
                    return e.closeLikesContainer();
                  });
              }
            },
            {
              key: "closeLikesContainer",
              value: function() {
                this.namesContainerUL.style.display = "none";
              }
            },
            {
              key: "handleButtonClick",
              value: function(e) {
                var t = this;
                e.stopPropagation(),
                  x
                    .post("/get-visited-profile-doc")
                    .then(function(e) {
                      for (var n = [], r = 0; r < e.data.length; r++)
                        "yes" == e.data[r].color &&
                          n.push(e.data[r].visitorName);
                      "none" == t.namesContainerUL.style.display
                        ? ((t.namesContainerUL.innerHTML = n
                            .map(function(e) {
                              return "<li>".concat(e, "</li>");
                            })
                            .join("")),
                          (t.namesContainerUL.style.display = "block"))
                        : (t.namesContainerUL.style.display = "none");
                    })
                    .catch(function(e) {
                      t.namesContainerUL.innerHTML = e;
                    });
              }
            }
          ]) && L(t.prototype, n),
          r && L(t, r),
          e
        );
      })();
    function T(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    var N = (function() {
      function e() {
        !(function(e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          (this.clickToCommentBtn = document.getElementById(
            "click-to-comment"
          )),
          (this.textareaComment = document.getElementById("textarea-comments")),
          this.events();
      }
      var t, n, r;
      return (
        (t = e),
        (n = [
          {
            key: "events",
            value: function() {
              var e = this;
              this.clickToCommentBtn.addEventListener("click", function() {
                return e.handleClickcommentBtn();
              });
            }
          },
          {
            key: "handleClickcommentBtn",
            value: function() {
              this.textareaComment.focus();
            }
          }
        ]) && T(t.prototype, n),
        r && T(t, r),
        e
      );
    })();
    var A = function e() {
      !(function(e, t) {
        if (!(e instanceof t))
          throw new TypeError("Cannot call a class as a function");
      })(this, e);
    };
    function q(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    A.prototype.li = function(e) {
      var t = document.createElement("li");
      (t.id = "li-comment"), t.classList.add("my-2", "p-2", "rounded");
      var n = document.createElement("div");
      n.classList.add("flex");
      var r = document.createElement("div");
      r.classList.add("flex", "mr-1");
      var o = document.createElement("a");
      o.setAttribute("href", "/profile/".concat(e.visitorEmail));
      var i = document.createElement("img");
      i.setAttribute("src", "".concat(e.photo)),
        i.classList.add("w-8", "h-8", "rounded-full"),
        i.setAttribute("alt", "profile pic");
      var a = document.createElement("div");
      a.classList.add("rounded", "px-2"),
        a.setAttribute(
          "style",
          "overflow-wrap:break-word;min-width:0px;width:15rem;background-color:#F2F3F5;"
        );
      var s = document.createElement("a");
      s.setAttribute("href", "".concat(e.photo)),
        s.classList.add("font-medium"),
        (s.innerText = "".concat(e.visitorFirstName));
      var l = document.createElement("p");
      l.innerText = "".concat(e.comment);
      var c = document.createElement("div");
      c.classList.add(
        "flex",
        "justify-between",
        "items-center",
        "mt-2",
        "text-xs"
      );
      var u = document.createElement("p");
      u.innerText = "".concat(e.commentDate);
      var d = document.createElement("div");
      d.classList.add("flex");
      var f = document.createElement("input");
      f.setAttribute("type", "button"),
        f.setAttribute("value", "Edit"),
        (f.id = "edit-comment-button"),
        f.classList.add("flex", "bg-white", "items-center", "cursor-pointer");
      var m = document.createElement("input");
      m.setAttribute("type", "button"),
        m.setAttribute("value", "Delete"),
        m.setAttribute("data-id", "".concat(e.commentId)),
        (m.id = "delete-comment-button"),
        m.classList.add(
          "flex",
          "ml-3",
          "bg-white",
          "text-red-600",
          "items-center",
          "cursor-pointer"
        );
      var h = document.createElement("div");
      (h.id = "edit-comment-container"),
        h.classList.add("absolute", "w-full", "-ml-2", "-mt-10"),
        (h.style.display = "none");
      var p = document.createElement("input");
      p.setAttribute("type", "text"),
        p.setAttribute("value", "".concat(e.comment)),
        p.setAttribute("data-id", "".concat(e.commentId)),
        p.classList.add(
          "w-full",
          "p-2",
          "bg-gray-200",
          "border",
          "border-blue-400",
          "rounded"
        );
      var y = document.createElement("div");
      y.classList.add("flex", "justify-between");
      var v = document.createElement("button");
      (v.id = "cancel-edit-comment"),
        v.classList.add("bg-green-600", "text-white", "px-2", "rounded");
      var b = document.createTextNode("Cancel");
      v.appendChild(b);
      var g = document.createElement("button");
      (g.id = "update-comment-button"),
        g.setAttribute("data-id", "".concat(e.commentId)),
        g.classList.add("bg-blue-600", "text-white", "px-2", "rounded");
      var C = document.createTextNode("Update");
      return (
        g.appendChild(C),
        o.appendChild(i),
        r.appendChild(o),
        a.appendChild(s),
        a.appendChild(l),
        n.appendChild(r),
        n.appendChild(a),
        c.appendChild(u),
        d.appendChild(f),
        d.appendChild(m),
        c.appendChild(d),
        y.appendChild(v),
        y.appendChild(g),
        h.appendChild(p),
        h.appendChild(y),
        t.appendChild(n),
        t.appendChild(c),
        t.appendChild(h),
        t
      );
    };
    var O = n(1),
      B = (function() {
        function e() {
          !(function(e, t) {
            if (!(e instanceof t))
              throw new TypeError("Cannot call a class as a function");
          })(this, e),
            (this.input = document.querySelector("#input-comment")),
            (this.addCommentButton = document.querySelector("#button-comment")),
            (this.commentsContainerUl = document.querySelector(
              "#comment-container-ul"
            )),
            (this.editCommentButton = document.querySelectorAll(
              "#edit-comment-button-server-side"
            )),
            (this.updateButton = document.querySelectorAll(
              "#update-comment-button"
            )),
            (this.commentsCount = document.querySelector("#comment-count")),
            (this.commentWordContainer = document.querySelector(
              "#comment-word"
            )),
            (this.document = document),
            this.events();
        }
        var t, n, r;
        return (
          (t = e),
          (n = [
            {
              key: "events",
              value: function() {
                var e = this;
                this.addCommentButton.addEventListener("click", function() {
                  return e.handleAddCommentClick();
                }),
                  Array.prototype.forEach.call(this.updateButton, function(t) {
                    t.addEventListener("click", function(t) {
                      return e.handleUpdateComment(t);
                    });
                  }),
                  Array.prototype.forEach.call(this.editCommentButton, function(
                    t
                  ) {
                    t.addEventListener("click", function(t) {
                      return e.handleOpenCloseEditContainer(t);
                    });
                  }),
                  this.document.addEventListener("click", function(t) {
                    t.target &&
                      "delete-comment-button" == t.target.id &&
                      e.handleDeleteComment(t),
                      t.target &&
                        "edit-comment-button" == t.target.id &&
                        e.handleOpenCloseEditContainer(t),
                      t.target &&
                        "update-comment-button" == t.target.id &&
                        e.handleUpdateComment(t),
                      t.target &&
                        "cancel-edit-comment" == t.target.id &&
                        e.handleCancelEditCommentConatiner(t);
                  });
              }
            },
            {
              key: "handleCancelEditCommentConatiner",
              value: function(e) {
                e.target.parentElement.parentElement.parentElement.children[2].style.display =
                  "none";
              }
            },
            {
              key: "handleOpenCloseEditContainer",
              value: function(e) {
                var t =
                    e.target.parentElement.parentElement.parentElement
                      .children[2],
                  n = t.children[0];
                "none" == t.style.display
                  ? ((t.style.display = "block"), n.focus())
                  : (t.style.display = "none");
              }
            },
            {
              key: "handleUpdateComment",
              value: function(e) {
                var t =
                    e.target.parentElement.parentElement.parentElement
                      .children[2],
                  n = t.children[0],
                  r =
                    e.target.parentElement.parentElement.parentElement
                      .children[1].children[0],
                  o =
                    e.target.parentElement.parentElement.parentElement
                      .children[0].children[1].children[1];
                n.value &&
                  (O.post("/edit-comment", {
                    commentId: n.getAttribute("data-id"),
                    comment: n.value
                  })
                    .then(function(e) {
                      (o.innerText = e.data.comment),
                        (r.innerText = e.data.commentDate);
                    })
                    .catch(function(e) {
                      console.log("Error updating comment.");
                    }),
                  (t.style.display = "none"));
              }
            },
            {
              key: "handleDeleteComment",
              value: function(e) {
                var t = this;
                confirm("Are you sure?") &&
                  O.post("/delete-comment", {
                    commentId: e.target.getAttribute("data-id")
                  })
                    .then(function(n) {
                      t.handleCommentCountAndCommentGrammar(-1),
                        e.target.parentElement.parentElement.parentElement.remove();
                    })
                    .catch(function(e) {
                      console.log(e);
                    });
              }
            },
            {
              key: "handleCommentCountAndCommentGrammar",
              value: function(e) {
                1 == e
                  ? (this.commentsCount.innerText =
                      +this.commentsCount.innerText + 1)
                  : 1 == this.commentsCount.innerText
                  ? (this.commentsCount.innerText = "")
                  : (this.commentsCount.innerText =
                      +this.commentsCount.innerText - 1);
                var t = this.commentsCount.innerText;
                this.commentWordContainer.innerText =
                  0 == t ? "" : 1 == t ? "comment" : "comments";
              }
            },
            {
              key: "handleAddCommentClick",
              value: function() {
                var e = this;
                this.input.value &&
                  O.post("/get-comments", { comment: this.input.value })
                    .then(function(t) {
                      e.handleCommentCountAndCommentGrammar(1),
                        e.commentsContainerUl.insertAdjacentElement(
                          "afterbegin",
                          new A().li(t.data)
                        ),
                        (e.input.value = ""),
                        e.input.focus();
                    })
                    .catch(function(e) {
                      console.log(e);
                    });
              }
            }
          ]) && q(t.prototype, n),
          r && q(t, r),
          e
        );
      })();
    document.querySelector("#more-profile-btn") && new o(),
      document.querySelector("#btn-optional-fields") && new a(),
      document.querySelector("#bar-chart-icon-container") && new l(),
      document.querySelector("#profile-image") && new u(),
      document.querySelector("#anchor-tag") && new u(),
      document.querySelector("#delete-profile") && new f(),
      document.querySelector("#registration-form") && new y(),
      document.querySelector("#registration-form") && new y(),
      document.querySelector("#filter-icon-container") && new b(),
      document.querySelector("#show-all-comments-toggle") && new C(),
      document.querySelector("#likes-button") && new E(),
      document.querySelector("#likes-container") && new S(),
      document.getElementById("click-to-comment") && new N(),
      document.getElementById("button-comment") && new B();
  }
]);
