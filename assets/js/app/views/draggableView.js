/*
 * The touch logic code is originally coming from this guy: http://evanyou.me
 * Who made this awesome demo: http://sketch.evanyou.me/layers
 * I tweaked it so it can fit the needs of a draggable panel
*/

App.DraggableView = Em.View.extend({

    // touch gestures properties
    startX      : 0,
    dist        : 0,
    active      : null,
    maxDist     : 250,
    threshold   : 40,
    activeWidth : null,

    didInsertElement: function(){
        var view = this;
        var $view = this.$().children('.pane');

        Em.run.later($view, function(){
            $view.css({ '-webkit-transform': 'translate3d(-100%, 0, 0)' });
        }, 100);
    },

    touchStart: function(event){
        var touchEvent = event.originalEvent.changedTouches[0];
        var layer = $(touchEvent.target).closest('.pane')[0];
        if (layer) {
            this.active = layer;
            this.onStart(event, touchEvent);
            this.activeWidth = $('.pane').outerWidth();
        }
    },

    touchMove: function(event){
        event.preventDefault();
        if (!this.active) return;
        this.onMove(event, event.originalEvent.changedTouches[0]);
    },

    touchEnd: function(event){
        if (!this.active) return;
        this.onEnd(event);
    },

    onStart: function(e,d) {
        e.stopPropagation();
        this.startX = d.pageX;
        this.active.classList.add('drag');
    },

    onMove: function(e,d) {
        e.stopPropagation();
        this.dist = (d.pageX - this.startX) / 2;

        // drag ⇚
        if (this.dist > 0) { 
            this.active.style.webkitTransform = 'translate3d(' + (-this.activeWidth + this.dist) + 'px, 0, 0)';
        } 
        // drag ⇛
        else { 
            this.active.style.webkitTransform = 'translate3d(' + (-this.activeWidth + this.dist) + 'px, 0, 0)';
        }
    },

    onEnd: function(e) {
        e.stopPropagation();
        this.active.classList.remove('drag');

        // dragged ⇛
        if (this.dist >= this.threshold) { 
            this.active.classList.remove('active');
            this.goBackAfterTransition('collapsePanel');
        }
        // dragged ⇚
        else { 
            this.openPanel();
        }

        this.dist = 0;
        this.active = null;
    },
    
    collapsePanel: function(){
        this.active.style.webkitTransform = 'translate3d(0%, 0, 0)';
    },
    
    openPanel: function(){
        this.active.style.webkitTransform = 'translate3d(-100%, 0, 0)';
    },
    
    goBackAfterTransition: function(transitionType){
        if (transitionType === 'collapsePanel') {

            this.collapsePanel();

            Em.run.later(this, function(){
                // there is no goBack method in the controller so it will bubble up to routes
                // until it finds the goBack event located in the ApplicationRoute
                this.get('controller').send('goBack');
            }, 600);

        }
    }
});