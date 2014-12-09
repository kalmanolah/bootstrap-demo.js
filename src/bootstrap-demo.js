/**
 * bootstrap-demo.js
 *
 * @author Kalman Olah <hello@kalmanolah.net>
 * @license MIT
 */

Demo = function() {
    this.showing = false;
    this.options = {
        id:              false,
        persist:         true,
        cookie_name:     '_demo',
        cookie_days:     365,

        callback:        false,
        prevent_default: true,

        html:            true,
        placement:       'auto',
        title:           '<i class="glyphicon glyphicon-bell"></i> TIP',
        content:         'Click anywhere inside of the <span class="text-danger">highlighted</span> area to dismiss this popup.',
        styles:          '.demo-highlight{cursor:pointer;outline:3px solid #FBB829;}',
    };

    /**
     * Set a cookie to a value for a period.
     *
     * @param string        key   Name of cookie to set.
     * @param mixed         value Value to set for cookie.
     * @param integer|false days  Amount of days cookie should be valid for.
     */
    this.setCookie = function(key, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires="+date.toGMTString();
        } else {
            var expires = "";
        }

        document.cookie = key + "=" + value+expires + "; path=/; domain=" + window.location.hostname;
    };

    /**
     * Attempt to read a cookie and return its value.
     *
     * @param  string          key Name of cookie to read.
     * @param  mixed           def Default value to return.
     * @return mixed|undefined
     */
    this.getCookie = function(key, def) {
        var cookies = document.cookie.split(/;\s*/);
        key += '=';

        for (var i = cookies.length - 1; i >= 0; i--) {
            if (!cookies[i].indexOf(key)) {
                return cookies[i].replace(key, '');
            }
        }

        return def;
    };

    /**
     * Remove a cookie.
     *
     * @param  string key Name of cookie to remove.
     */
    this.removeCookie = function(key) {
        this.setCookie(key, "", -1);
    };

    /**
     * Return an array containing the identifiers of all seen demos.
     *
     * @return array
     */
    this.getSeenDemos = function() {
        var cookie = this.getCookie(this.options.cookie_name, '[]');
        return jQuery.parseJSON(cookie);
    };

    /**
     * Set seen demos to an array containing identifiers.
     *
     * @param array id_array Array of demo identifiers.
     */
    this.setSeenDemos = function(id_array) {
        var json = JSON.stringify(id_array);
        this.setCookie(this.options.cookie_name, json, this.options.cookie_days);
    };

    /**
     * Return a boolean indicating whether or not a certain demo has been seen.
     *
     * @param  mixed   id Identifier of the demo to check for.
     * @return boolean
     */
    this.isDemoSeen = function(id) {
        if (!this.options.persist) {
            return false;
        }

        var seen = this.getSeenDemos();
        return jQuery.inArray(id, seen) !== -1;
    };

    /**
     * Mark a certain demo has been seen or not.
     *
     * @param  mixed id Identifier of the demo to mark as seen.
     */
    this.setDemoSeen = function(id) {
        if (!this.options.persist) {
            return false;
        }

        var seen = this.getSeenDemos();
        seen.push(id);
        this.setSeenDemos(seen);
    };

    this.addStyles = function() {
        if (jQuery('style#demo-styles').length) {
            return;
        }

        jQuery('head').append('<style id="demo-styles" type="text/css">' + this.options.styles + '</style>');
    };
};

(function($) {
    window.demo = new Demo();

    $.fn.demo = function(options) {
        var demo = $.extend(true, {}, window.demo);

        // If we're already showing a demo, do nothing
        if (demo.showing) {
            return this;
        }

        $.extend(demo.options, this.data(), options);

        // Only execute if we haven't shown this demo yet
        if (demo.isDemoSeen(demo.options.id)) {
            return this;
        }

        // Mark as seen
        demo.setDemoSeen(demo.options.id);

        // Add highlight styling and class
        demo.addStyles();
        this.addClass('demo-highlight');

        var all = this;
        var first = this.first();

        // Create popover on the first of the elements
        first.popover({
            html:      demo.options.html,
            placement: demo.options.placement,
            title:     demo.options.title,
            content:   demo.options.content
        }).popover('show');

        // Add event blockers if needed
        if (demo.options.prevent_default) {
            setTimeout(function() {
                demo.showing = true;
                $(document).on('click.demo, submit.demo, mousedown.demo, change.demo', false);
            }, 0);
        }

        // Handle click
        this.one('click', function(e) {
            // Remove demo popover
            first.popover('destroy');

            // Remove highlight class
            all.removeClass('demo-highlight');

            // Remove event blockers
            demo.showing = false;
            $(document).off('click.demo, submit.demo, mousedown.demo, change.demo');

            // If callback is set and a string, assume it's a selector and call $.demo on it.
            // If callback is set and not a string, assume it's a function, pass it the event and run it.
            if (demo.options.callback) {
                if (typeof demo.options.callback == 'string') {
                    $(demo.options.callback).demo();
                } else {
                    demo.options.callback(e);
                }
            }

            return !demo.options.prevent_default;
        });

        return this;
    };

    // Data API support
    $(document).ready(function() {
        $('[data-provide="demo"]').each(function(e) {
            $(this).demo();
        });
    });
})(jQuery);
