Game of Life
============

Yet another **WRAPPED** implementation of game of live.

## How to use ##

See a live demo [here](http://gist.gongzhitaao.org/gist/?id=efb7b234c8366ed8857e);

1. Define a `pattern` as:

   ```javascript
   var pat = {
     data: "bo$2bo$3o!",
     rule: "23/3"
   };
   ```

   The `data` field is _Run Length Encoded_ (RLE) (see
   [lifewiki:rle](http://www.conwaylife.com/wiki/.rle)).  The `rule`
   field is the evolution rule, in the format of `S/B`, where `S`
   stands for _stays alive_ and `B` for _born_ (see
   [lifewiki:rule](http://www.conwaylife.com/wiki/Rules#Rules)).  The
   above is a small glider using Conway's life rule.

2. Define a canvas size:

   ```javascript
   var param = {
     width: 32,
     height: 16,
     startx: 3,
     starty: 3
   };
   ```

   Since this is a wrapped implementation, i.e. the right-most column
   is adjancent to the left-most one, first row to the last row, we
   need to know the size (`width` and `height` field) of the entire
   canvas where the automata evolves.  And also the upper-left
   position to put the init pattern (`startx` and `starty` field).

3. Init the `life` as:

    ```javascript
    var gol = life.wrapped();
    var next = gol.reset(pat, param);
    ```

4. Get the next generation:
   ```javascript
   next = gol.next();
   ```

   The `next` is in the format:
   ```javascript
   {
     dead: [[x0, y0], [x1, y1], ...],
     born: [[c0, r0], [c1, r1], ...]
   }
   ```

   The `dead` array contains all the cells that are *DEAD* in this
   generation.  And the `born` array contains all the cells that are
   *BORN* in this generation;

## Implementation ##

This implementation used the concept of **ghost cell**, the cells that
are 1) not live, 2) adjancent to a live cell.  Only the ghost cells
might be borned the next generation.

I maintain an array of live cells and an array of ghost cells for each
generation.  With the help of ghost cells, I don't need to scan the
whole canvas.
