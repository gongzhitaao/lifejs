(function($) {

  var Live = "#222";
  var Dead = "#eee";
  var MaxSize = 80;
  var Edge = 8;

  var pat = {
    data: "bo$2bo$3o!",
    rule: "23/3"
  };

  var param = {
    width: 3 + 2 * Edge,
    height: 3 + 2 * Edge,
    startx: Edge,
    starty: Edge
  };

  var width, height, offx, offy;
  var size = MaxSize;
  var grid = 2;
  var ctx, gol, next;
  var tickid;

  function UrlParam(url) {

    "use strict";

    var rNull = /^\s*$/,
        rBool = /^(true|false)$/i;
    function conv(val) {
      if (rNull.test(val)) return null;
      if (rBool.test(val)) return val.toLowerCase() === "true";
      if (isFinite(val)) return parseFloat(val);
      if (isFinite(Date.parse(val))) return new Date(val);
      return val;
    }

    if (!url) return null;

    return url.split("?")[1].split("&")
      .reduce(function(acc, cur) {
        var pair = cur.split("=");
        acc[unescape(pair[0])] = pair.length > 1
          ? conv(unescape(pair[1]))
          : null;
        return acc;
      }, {});
  }

  function clearCanvas(ctx) {
    ctx.clearRect(0, 0, width, height);

    var s1 = width / param.width;
    var s2 = height / param.height;

    var a, b;
    if (s1 < s2) a = s1, b = s2;
    else a = s2, b = s1;

    if (a < MaxSize) size = Math.floor(a);
    else size = MaxSize;

    offx = Math.floor((width - param.width * size) / 2);
    offy = Math.floor((height - param.height * size) / 2);

    grid = Math.floor(size / 15);

    var i, j;
    ctx.fillStyle = Dead;
    for (i = 0; i < param.height; ++i) {
      for (j = 0; j < param.width; ++j) {
        ctx.fillRect(offx + size * j + grid, offy + size * i + grid,
                     size - 2 * grid, size - 2 * grid);
      }
    }
  }

  function draw() {
    var i, xy;

    ctx.fillStyle = Live;
    for (i = 0; i < next.born.length; ++i) {
      xy = next.born[i];
      ctx.fillRect(offx + size * xy[0] + grid, offy + size * xy[1] + grid,
                   size - 2 * grid, size - 2 * grid);
    }

    ctx.fillStyle = Dead;
    for (i = 0; i < next.dead.length; ++i) {
      xy = next.dead[i];
      ctx.fillRect(offx + size * xy[0] + grid, offy + size * xy[1] + grid,
                   size - 2 * grid, size - 2 * grid);
    }

    next = gol.next();
  }

  function tick() {
    draw();

    if (next.dead.length > 0 || next.born.length > 0)
      tickid = window.setTimeout(tick, 500);
  }

  function getInfo() {
    $("input[name=data]").val(pat.data);
    $("input[name=rule]").val(pat.rule ? pat.rule : "23/3");
    $("input[name=width]").val(param.width - 2 * Edge);
    $("input[name=height]").val(param.height - 2 * Edge);
  }

  $(document).ready(function() {

    width = $(document).width();
    height = $(document).height();

    var canvas = d3.select("body")
      .insert("canvas", ":first-child")
      .attr("width", width)
      .attr("height", height);
    ctx = canvas.node().getContext("2d");

    $(".toggle").click(function() {
      $(".control").slideToggle();
      $(".toggle").toggleClass("open");

      if ($(".toggle").hasClass("open")) {
        getInfo();
        clearTimeout(tickid);
      } else tick();
    });

    $(".yes").click(function() {
      pat.data = $("input[name=data]").val();
      pat.rule = $("input[name=rule]").val();
      param.width = parseInt($("input[name=width]").val()) + 2 * Edge;
      param.height = parseInt($("input[name=height]").val()) + 2 * Edge;

      clearCanvas(ctx);
      next = gol.reset(pat, param);
      draw();
    });

    $(".no").click(function(){
      getInfo();
    });

    var urlparam = new UrlParam(window.location.search);
    if (urlparam.data) pat.data = urlparam.data;
    if (urlparam.rule) pat.rule = urlparam.rule;
    if (urlparam.x) param.width = urlparam.x + 2 * Edge;
    if (urlparam.y) param.height = urlparam.y + 2 * Edge;

    clearCanvas(ctx);

    gol = life.wrapped();
    next = gol.reset(pat, param);

    tick();
  });

})(jQuery);
