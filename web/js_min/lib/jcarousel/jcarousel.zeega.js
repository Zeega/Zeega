/*
These functions are an extension to the jcarousel plugin so that the carousel can add and remove elements
and reset its state properly (something that's not included in default implementation! to my great chagrin!)

Feel free to move this to a more sensible location. 

-- Catherine
*/
$.jcarousel.fn.extend({
    removeAndAnimate: function(i) {

            var e = this.get(i);

            var d = this.dimension(e);

            if (i < this.first) this.list.css(this.lt, $.jcarousel.intval(this.list.css(this.lt)) + d + 'px');

            e.remove();
            this.options.size--;

            var di = this.options.visible != null ? Math.ceil(this.clipping() / this.options.visible) : null;
            var li = this.list.children('li');
            var self = this;

            if (li.size() > 0) {
                var wh = 0, i = this.options.offset;
                li.each(function() {
                    self.format(this, i++);
                    wh += self.dimension(this, di);
                });

                this.list.css(this.wh, wh + 'px');            
            }

            this.scroll(0,true);
            this.buttons();

        },
     addAndAnimate: function(e) {

            //var e = this.get(i);

            var d = this.dimension(e);

            if (i < this.first) this.list.css(this.lt, $.jcarousel.intval(this.list.css(this.lt)) + d + 'px');

            this.list.prepend(e);
            this.options.size++;

            var di = this.options.visible != null ? Math.ceil(this.clipping() / this.options.visible) : null;
            var li = this.list.children('li');
            var self = this;

            if (li.size() > 0) {
                var wh = 0, i = this.options.offset;
                li.each(function() {
                    self.format(this, i++);
                    wh += self.dimension(this, di);
                });

                this.list.css(this.wh, wh + 'px');            
            }

            this.scroll(0,true);
            this.buttons();

        }
});