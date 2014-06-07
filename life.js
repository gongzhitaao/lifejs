var life = {};

life.wrapped = function() {

  var alive_ = {};
  var ghost_ = {};
  // var buff_ = [{alive: {}, ghost: {}},
  //              {alive: {}, ghost: {}}];
  // var curr_ = 0;
  var rule_ = {};

  var w_ = -1;
  var h_ = -1;
  var x_ = -1;
  var y_ = -1;

  function mod(m, n) {
    return ((m % n) + n) % n;
  }

  var key = {
    encode: function(x, y) {
      return x + ',' + y;
    },

    decode: function(xy) {
      return xy.split(',').map(function(_) { return parseInt(_, 10); });
    }
  };

  function rule() {
    var b_ = {};
    var s_ = {};

    function ret(rule) {
      rule(rule);
    };

    ret.rule = function(rule) {
      var r = "" === rule ? "23/3" :
            rule ? rule : null;
      if (r) {
        var bs = r.split('/');
        bs[0].split("").map(function(e) { s_[e] = true; });
        bs[1].split("").map(function(e) { b_[e] = true; });
        return ret;
      } else
        return Object.keys(s_).join("") + "/" +
            Object.keys(b_).join("");
    };

    ret.stays_alive = function(n) {
      return ("" + n) in s_;
    };

    ret.born = function(n) {
      return ("" + n) in b_;
    };

    return ret;
  }

  var rle = {
    encode: function() {},

    decode: function(rle) {
      rle = rle.replace(/\s+/g, "");
      var x = 0, y = 0, n = 0, i, j, c, r;
      var ret = [];

      for (i = 0; i < rle.length; ++i) {
        c = rle.charAt(i);
        if ("!" === c) {
          break;
        } else if ("$" === c) {
          y += 1;
          x = 0;
        } else if ("b" === c || "B" === c) {
          x += n > 0 ? n : 1;
          n = 0;
          continue;
        } else if ("0" <= c && c <= "9") {
          n = n * 10 + parseInt(c);
        } else if (("a" <= c && c <= "z") ||
                   ("A" <= c && c <= "Z")) {
          if (0 === n) n = 1;
          for (j = 0; j < n; ++j) {
            alive_[key.encode(x + j + x_, y + y_)] = -1;
            ret.push([x + j + x_, y + y_]);
          }
          x += n;
          n = 0;
        }
      }

      return ret;
    }
  };

  function clone(obj) {
    var copy = {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        copy[i] = obj[i];
      }
    }
    return copy;
  };

  function init() {
    ghost_ = {};

    var i, j, r, c, k, n, t, xy;
    for (k in alive_) {
      xy = key.decode(k);
      n = -1;
      for (i = -1; i <= 1; ++i) {
        r = mod(xy[1] + i, h_);
        for (j = -1; j <= 1; ++j) {
          c = mod(xy[0] + j, w_);
          t = key.encode(c, r);
          if (t in alive_) ++n;
          else {
            if (!(t in ghost_)) ghost_[t] = 1;
            else ++ghost_[t];
          }
        }
        alive_[k] = n;
      }
    }
  }

  function ret() { };

  // Example of pat:
  //
  // pat = {data: "bo$2bo$3o!", x: 3, y: 3, rule: "23/3"}
  //
  // The `rule` is optional, default "23/3", Conway's life rule.  More
  // on the data encoding, please refer to Run Length Encoding
  // http://www.conwaylife.com/wiki/.rle

  ret.reset = function(pat, param) {
    if (param) {
      w_ = param.width;
      h_ = param.height;
      x_ = param.startx || 0;
      y_ = param.starty || 0;
    }

    alive_ = {};
    rule_ = rule().rule(pat.rule ? pat.rule : "");

    var val = {
      dead: [],
      born: rle.decode(pat.data)
    };

    init();

    return val;
  };

  ret.next = function() {
    var newdead = [];
    var newborn = [];

    var k, n, xy;

    // process living cells
    for (k in alive_) {
      n = alive_[k];
      if (!rule_.stays_alive(n)) {
        xy = key.decode(k);
        newdead.push(xy);
        delete alive_[k];
      }
    }

    // process ghost cells
    for (k in ghost_) {
      n = ghost_[k];
      if (3 === n) {
        xy = key.decode(k);
        newborn.push(xy);
        alive_[k] = -1;
      }
    }

    init();

    return {
      dead: newdead,
      born: newborn
    };
  };

  return ret;
};
