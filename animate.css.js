/**
 * JS Lib for Animate.css (daneden.github.io/animate.css/)
 *
 * Created by thram on 31/03/15.
 */
var Animations = (function () {
    var AXES = {
        X: 'X',
        Y: 'Y'
    };

    var ANIMATIONS = {
        FADE: 'fade',
        ROTATE: 'rotate',
        FLIP: 'flip',
        LIGHT_SPEED: 'lightSpeed',
        BOUNCE: 'bounce',
        FLASH: 'flash',
        PULSE: 'pulse',
        WIGGLE: 'wiggle',
        SWING: 'swing',
        SHAKE: 'shake',
        TADA: 'tada',
        WOBBLE: 'wobble',
        HINGE: 'hinge',
        ROLL: 'roll',
        ZOOM: 'zoom'
    };
    var TRANSITIONS = {
        IN: 'In',
        OUT: 'Out'
    };
    var HORIZONTAL_DIRECTIONS = {
        UP: 'Up',
        DOWN: 'Down',
        LEFT: 'Left',
        RIGHT: 'Right'
    };
    var VERTICAL_DIRECTIONS = {
        UP: 'Up',
        DOWN: 'Down',
        LEFT: 'Left',
        RIGHT: 'Right'
    };

    function _clearAnimations(el) {
        _.each(ANIMATIONS, function (ANIMATION) {
            switch (ANIMATION) {
                case (ANIMATIONS.FADE):
                case (ANIMATIONS.BOUNCE):
                case (ANIMATIONS.ROTATE):
                case (ANIMATIONS.FLIP):
                case (ANIMATIONS.LIGHT_SPEED):
                case (ANIMATIONS.ROLL):
                case (ANIMATIONS.ZOOM):
                    _.each(TRANSITIONS, function (TRANSITION) {
                        el.removeClass(ANIMATION + TRANSITION);
                        switch (ANIMATION) {
                            case (ANIMATIONS.FADE):
                            case (ANIMATIONS.BOUNCE):
                            case (ANIMATIONS.ZOOM):
                                _.each(VERTICAL_DIRECTIONS, function (DIRECTION) {
                                    el.removeClass(ANIMATION + TRANSITION + DIRECTION);
                                    el.removeClass(ANIMATION + TRANSITION + DIRECTION + 'Big');
                                });
                                _.each(HORIZONTAL_DIRECTIONS, function (DIRECTION) {
                                    el.removeClass(ANIMATION + TRANSITION + DIRECTION);
                                    el.removeClass(ANIMATION + TRANSITION + DIRECTION + 'Big');
                                });
                                break;
                            case (ANIMATIONS.ROTATE):
                                _.each(VERTICAL_DIRECTIONS, function (V_DIRECTION) {
                                    _.each(HORIZONTAL_DIRECTIONS, function (H_DIRECTION) {
                                        el.removeClass(ANIMATION + TRANSITION + V_DIRECTION + H_DIRECTION);
                                    });
                                });
                                break;
                            case (ANIMATIONS.FLIP):
                                _.each(AXES, function (AXIS) {
                                    el.removeClass(ANIMATION + TRANSITION + AXIS);
                                });
                                break;

                        }

                    });
                    break;
                case (ANIMATIONS.FLASH):
                case (ANIMATIONS.PULSE):
                case (ANIMATIONS.WIGGLE):
                case (ANIMATIONS.SWING):
                case (ANIMATIONS.SHAKE):
                case (ANIMATIONS.TADA):
                case (ANIMATIONS.WOBBLE):
                case (ANIMATIONS.HINGE):
                default :
                    el.removeClass(ANIMATION);
            }
        });
    }

    function _buildAnimationData(animation, transition, direction, isBig, callback) {
        if (_.isFunction(transition)) {
            callback = transition;
            transition = null;
        }

        if (_.isFunction(direction)) {
            callback = direction;
            direction = null;
        }

        if (_.isFunction(isBig)) {
            callback = isBig;
            isBig = null;
        }
        var horizontal_direction = null;
        if (_.isString(isBig)) {
            horizontal_direction = isBig;
        }
        var animationClass = animation + (transition ? transition : '') + (direction ? direction : '') + (horizontal_direction ? horizontal_direction : '') + (isBig ? 'Big' : '');
        return {
            animationClass: animationClass,
            callback: callback
        }
    }

    function _oldBrowsersFallback(el, animation, transition, direction, isBig, callback) {
        if (el.velocity) {
            var params = {};
            var unit = {x: $('body').width() / 2, y: $('body').height() / 2};
            var options = {duration: this.duration, complete: callback};
            switch (animation) {
                case (ANIMATIONS.FADE):
                    switch (transition) {
                        case (TRANSITIONS.OUT):
                            params['opacity'] = 0;
                            options['display'] = 'none';
                            break;
                        case (TRANSITIONS.IN):
                        default :
                            el.css({opacity: 0});
                            options['display'] = 'block';
                            params['opacity'] = 1;
                    }
                    var distance, position;
                    switch (direction) {
                        case (VERTICAL_DIRECTIONS.DOWN):
                        case (VERTICAL_DIRECTIONS.UP):
                            distance = isBig ? unit.y : unit.y / 2;
                            position = (direction == VERTICAL_DIRECTIONS.UP ? 1 : -1 ) * distance;
                            el.css({top: transition == TRANSITIONS.OUT ? 0 : position});
                            params['top'] = transition == TRANSITIONS.IN ? 0 : position;
                            break;
                        case (HORIZONTAL_DIRECTIONS.RIGHT):
                        case (HORIZONTAL_DIRECTIONS.LEFT):
                            distance = isBig ? unit.x : unit.x / 2;
                            position = (direction == VERTICAL_DIRECTIONS.RIGHT ? 1 : -1 ) * distance;
                            el.css({left: transition == TRANSITIONS.OUT ? 0 : position});
                            params['left'] = transition == TRANSITIONS.IN ? 0 : position;
                            break;
                    }
                    el.velocity(params, options);
                    break;
                case (ANIMATIONS.PULSE):
                case (ANIMATIONS.BOUNCE):
                case (ANIMATIONS.ZOOM):
                    // TODO Think something using height/width top/left
                    el.velocity(params, options);
                    break;
                case (ANIMATIONS.SHAKE):
                case (ANIMATIONS.WOBBLE):
                    // TODO Think something using left
                    el.velocity(params, options);
                    break;
                case (ANIMATIONS.FLASH):
                    params['opacity'] = 0;
                    options['loop'] = 3;
                    options['duration'] = options['duration'] / options['loop'];
                    options['easing'] = 'easeInOutSine';
                    el.velocity(params, options);
                    break;
                // IMPOSSIBLES
                case (ANIMATIONS.WIGGLE):
                case (ANIMATIONS.SWING):
                case (ANIMATIONS.HINGE):
                case (ANIMATIONS.TADA):
                case (ANIMATIONS.ROTATE):
                case (ANIMATIONS.FLIP):
                case (ANIMATIONS.ROLL):
                case (ANIMATIONS.LIGHT_SPEED):
                default :
            }

        } else {
            switch (transition) {
                case (TRANSITIONS.OUT):
                    el.hide(callback);
                    break;
                case (TRANSITIONS.IN):
                default :
                    el.show(callback);
            }
        }

    }

    /**
     * Apply animation to the Element
     *
     * @param el
     * @param animation
     * @param transition
     * @param direction (or vertical_direction for ROTATE or axis for FLIP)
     * @param isBig (or horizontal_direction for ROTATE)
     * @param callback
     * @private
     */

    function _applyAnimation(el, animation, transition, direction, isBig, callback) {
        if (animation) {
            // IE6-IE8
            if (!document.defaultView || !document.defaultView.getComputedStyle) {
                _oldBrowsersFallback(el, animation, transition, direction, isBig, callback)
            } else {
                _clearAnimations(el);
                var animationData = _buildAnimationData(animation, transition, direction, isBig, callback)

                el.addClass('animated').addClass(animationData.animationClass);
                el.on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function () {
                    if (animationData.callback) animationData.callback();
                });
            }
        } else {
            throw new Error("'animation' param can't be null or undefined.");
        }

    }

    function fadeOut(el, direction, isBig, callback) {
        _applyAnimation(el, ANIMATIONS.FADE, TRANSITIONS.OUT, direction, isBig, callback);
    }

    function fadeIn(el, direction, isBig, callback) {
        _applyAnimation(el.show(), ANIMATIONS.FADE, TRANSITIONS.IN, direction, isBig, callback);
    }


    function bounce(el, callback) {
        _applyAnimation(el, ANIMATIONS.BOUNCE, callback);
    }

    function bounceIn(el, direction, callback) {
        _applyAnimation(el.show(), ANIMATIONS.BOUNCE, TRANSITIONS.IN, direction, callback);
    }

    function bounceOut(el, direction, callback) {
        _applyAnimation(el, ANIMATIONS.BOUNCE, TRANSITIONS.OUT, direction, callback);
    }

    function rotateIn(el, vertical_direction, horizontal_direction, callback) {
        _applyAnimation(el.show(), ANIMATIONS.ROTATE, TRANSITIONS.IN, vertical_direction, horizontal_direction, callback);
    }

    function rotateOut(el, vertical_direction, horizontal_direction, callback) {
        _applyAnimation(el, ANIMATIONS.ROTATE, TRANSITIONS.OUT, vertical_direction, horizontal_direction, callback);
    }

    function flip(el, callback) {
        _applyAnimation(el, ANIMATIONS.FLIP, callback);
    }

    function flipIn(el, axis, callback) {
        _applyAnimation(el.show(), ANIMATIONS.FLIP, TRANSITIONS.IN, axis, callback);
    }

    function flipOut(el, axis, callback) {
        _applyAnimation(el, ANIMATIONS.FLIP, TRANSITIONS.IN, axis, callback);
    }

    function lightSpeedIn(el, callback) {
        _applyAnimation(el.show(), ANIMATIONS.LIGHT_SPEED, TRANSITIONS.IN, callback);
    }

    function lightSpeedOut(el, callback) {
        _applyAnimation(el, ANIMATIONS.LIGHT_SPEED, TRANSITIONS.OUT, callback);
    }

    function flash(el, callback) {
        _applyAnimation(el, ANIMATIONS.FLASH, callback);
    }

    function pulse(el, callback) {
        _applyAnimation(el, ANIMATIONS.PULSE, callback);
    }

    function wiggle(el, callback) {
        _applyAnimation(el, ANIMATIONS.WIGGLE, callback);
    }

    function swing(el, callback) {
        _applyAnimation(el, ANIMATIONS.SWING, callback);
    }

    function shake(el, callback) {
        _applyAnimation(el, ANIMATIONS.SHAKE, callback);
    }

    function tada(el, callback) {
        _applyAnimation(el, ANIMATIONS.TADA, callback);
    }

    function wobble(el, callback) {
        _applyAnimation(el, ANIMATIONS.WOBBLE, callback);
    }

    function hinge(el, callback) {
        _applyAnimation(el, ANIMATIONS.HINGE, callback);
    }

    function rollIn(el, callback) {
        _applyAnimation(el.show(), ANIMATIONS.ROLL, TRANSITIONS.IN, callback);
    }

    function rollOut(el, callback) {
        _applyAnimation(el, ANIMATIONS.ROLL, TRANSITIONS.OUT, callback);
    }

    function zoomOut(el, direction, callback) {
        _applyAnimation(el, ANIMATIONS.ZOOM, TRANSITIONS.OUT, direction, callback);
    }

    function zoomIn(el, direction, callback) {
        _applyAnimation(el.show(), ANIMATIONS.ZOOM, TRANSITIONS.IN, direction, callback);
    }

    return {
        duration: 500,
        TRANSITIONS: TRANSITIONS,
        AXES: AXES,
        VERTICAL_DIRECTIONS: VERTICAL_DIRECTIONS,
        HORIZONTAL_DIRECTIONS: HORIZONTAL_DIRECTIONS,
        fadeIn: fadeIn,
        fadeOut: fadeOut,
        bounce: bounce,
        bounceIn: bounceIn,
        bounceOut: bounceOut,
        rotateIn: rotateIn,
        rotateOut: rotateOut,
        flip: flip,
        flipIn: flipIn,
        flipOut: flipOut,
        lightSpeedIn: lightSpeedIn,
        lightSpeedOut: lightSpeedOut,
        flash: flash,
        pulse: pulse,
        wiggle: wiggle,
        swing: swing,
        shake: shake,
        tada: tada,
        wobble: wobble,
        hinge: hinge,
        rollIn: rollIn,
        rollOut: rollOut,
        zoomOut: zoomOut,
        zoomIn: zoomIn
    }
})();
