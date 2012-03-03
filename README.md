# Demo #

[Live demo!](http://olalonde.github.com/kmeans.js/)

![K-means demo](http://dl.dropbox.com/u/3750008/Screenshots/1.png)

## On your machine ##

    python -m SimpleHTTPServer;

Open your browser at
[http://localhost:8000/demo/animation.html](http://localhost:8000/demo/animation.html)

# Usage #

    var kmeans = require('kmeans');
    var km = kmeans.create([
      [1, 2],
      [5, 4],
      [2, 5],
      [8, 4]
    ], 3);

    var result = km.process();

    console.log(result.means);
    console.log(result.clusters);

## Under the hood ##

    for(var i = 0; i < km.iteratoinCount(); i++) {
      // clusters and means generated at iteration i
      console.log(km.iteration(i));
    }

# License #

Copyright (c) 2012 Olivier Lalonde <olalonde@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
