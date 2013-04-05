bootstrap-demo.js
========

Unofficial extension for Twitter Bootstrap that adds 'demo' functionality.

In case you're wondering what is meant by 'demo' functionality: think a transparent
overlay and a popover. A simple way to instruct the users of your application in its
use, now made even easier.

This script supports both normal calls and activation using the data api. It requires
only Twitter Bootstrap (including jQuery and the Twitter Bootstrap popover feature)
to be present.

It supports demo chaining, multiple demo popovers on-screen at the same time, and
makes use of cookies to make sure these annoying things only show up once (by default).

Documentation
-------------

Clone the repo, cd to the directory and copy the minified script to wherever you actually need it to be. Standard practice, really.

    git clone git://github.com/kalmanolah/bootstrap-demo.js.git
    cp bootstrap-demo.js/src/bootstrap-demo.min.js /path/to/my/app/assets/js/

You could also save the good people at Github some bandwidth by doing:

    wget https://github.com/kalmanolah/bootstra-demo.js/raw/master/src/bootstrap-demo.min.js

Please remember to make sure that jQuery and Twitter Bootstrap (including popover functionality) are present before including this script.

For usage examples, visiting the [Github page](http://kalmanolah.github.com/bootstrap-demo.js/) would be your best bet. Alternately, you could check out the `examples/` directory of this project.

Dependencies
------------

[Twitter Bootstrap](http://twitter.github.com/bootstrap/) - Remember to include popover functionality if you're going to use a custom package.

License
-------

This hastily written script is MIT-licensed, but few people care. Check out the LICENSE file if you think you've got what it takes.