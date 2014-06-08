(function($) {

  var width = 960;
  var height = 500;
  var live = "#222";
  var dead = "#eee";

  var pat = {
    data: "bo$2bo$3o!"
  };

  var param = {
    width: 32,
    height: 16,
    startx: 3,
    starty: 2
  };

  var size = 30;
  var offx = (width - param.width * size) / 2;
  var offy = (height - param.height * size) / 2;

  var canvas, ctx, gol, next;

  $(document).ready(function() {

    $('pre code').each(function(i, e) {hljs.highlightBlock(e);});

    canvas = d3.select("body")
      .insert("canvas", ":first-child")
      .attr("width", width)
      .attr("height", height);
    ctx = canvas.node().getContext("2d");

    gol = life.wrapped();
    next = gol.reset(pat, param);

    (function init() {
      var i, j;
      ctx.fillStyle = dead;
      for (i = 0; i < param.height; ++i) {
        for (j = 0; j < param.width; ++j) {
          ctx.fillRect(offx + size * j + 2, offy + size * i + 2,
                       size - 4, size - 4);
        }
      }
    })();

    (function tick() {
      var i, xy;

      ctx.fillStyle = live;
      for (i = 0; i < next.born.length; ++i) {
        xy = next.born[i];
        ctx.fillRect(offx + size * xy[0] + 2, offy + size * xy[1] + 2,
                     size - 4, size - 4);
      }

      ctx.fillStyle = dead;
      for (i = 0; i < next.dead.length; ++i) {
        xy = next.dead[i];
        ctx.fillRect(offx + size * xy[0] + 2, offy + size * xy[1] + 2,
                     size - 4, size - 4);
      }

      next = gol.next();

      if (next.dead.length > 0 || next.born.length > 0)
        setTimeout(tick, 500);
    })();

  });

})(jQuery);
