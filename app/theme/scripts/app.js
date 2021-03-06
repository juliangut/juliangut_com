define([
    'jquery',
    'raphael',
    'superslides',
    'jquery-knob',
    'slick-carousel'
], function ($, Raphael) {
    'use strict';

    $('#slides').each(function() {
        $(this).superslides({
            play: 4000,
            animation: 'fade',
            slide_easing: 'easeInOutCubic',
            slide_speed: 1600,
            pagination: false,
            scrollable: false
        });
    });

    $('.presentation-block .head').each(function() {
        var $this = $(this);

        $this.parent().waypoint(function() {
            $this.addClass('animated fadeIn');
            $this.one(
                'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                function() {
                    $this.css({opacity: 1});
                }
            );
        },
        {
            offset: '90%',
            triggerOnce: true
        });
    });

    /* About */
    $('#about .identity').each(function() {
        var $this = $(this);

        $this.waypoint(function() {
            $this.addClass('animated ' + $this.data('animation'));
            $this.one(
                'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                function() {
                    $this.css({opacity: 1});
                }
            );
        },
        {
            offset: '80%',
            triggerOnce: true
        });
    });

    /* Expertise */
    var diagram = {
        init: function(el, dimension) {
            this.diagram(el, dimension);
        },
        random: function(l, u) {
            return Math.floor((Math.random() * (u - l + 1)) + l);
        },
        diagram: function(el, dimension) {
            var $el = $(el);
            $el.css('width', dimension);
            $el.css('height', dimension);
            $el.empty();

            var r = new Raphael(el, dimension, dimension),
                center = Math.floor(dimension / 2),
                defaultText = 'Skills',
                speed = 250,
                innerRad = 85,
                outerRad = center - innerRad - 10,
                rad = 73;

            r.circle(center, center, innerRad).attr({ stroke: 'none', fill: 'none' });

            var title = r.text(center, center, defaultText).attr({
                font: '20px Open Sans',
                fill: '#fff'
            }).toFront();

            r.customAttributes.arc = function(value, color, random, rad) {
                var v = 3.6 * value,
                    alpha = v > 360 ? 359.99 : v,
                    a = (random - alpha) * Math.PI / 180,
                    b = random * Math.PI / 180,
                    sx = center + rad * Math.cos(b),
                    sy = center - rad * Math.sin(b),
                    x = center + rad * Math.cos(a),
                    y = center - rad * Math.sin(a),
                    path = [['M', sx, sy], ['A', rad, rad, 0, + (alpha > 180), 1, x, y]];

                return { path: path, stroke: color };
            };

            var $elements = $el.siblings('.legend').find('li'),
                count = $elements.size(),
                radDiff = Math.min(30, Math.floor(outerRad / count));

            $elements.each(function() {
                var t = $(this),
                    value = t.data('percent'),
                    color = t.data('color'),
                    text  = t.html(),
                    random = t.data('random') || diagram.random(91, 240);

                t.data('random', random);

                rad += radDiff;
                var z = r.path().attr({ arc: [value, color, random, rad], 'stroke-width': radDiff - 4, opacity: 0.85 });

                z.mouseover(function() {
                    this.animate({ 'stroke-width': Math.floor(radDiff * 1.5), opacity: 0.75 }, 1000, 'elastic');
                    if (Raphael.type !== 'VML') { //solves IE problem
                        this.toFront();
                    }

                    title.stop().animate({ opacity: 0 }, speed, '>', function() {
                        this.attr({ text: text + '\n' + value + '%' }).animate({ opacity: 1 }, speed, '<');
                    });
                }).mouseout(function() {
                    this.stop().animate({ 'stroke-width': radDiff - 4, opacity: 0.85 }, speed * 4, 'elastic');
                    title.stop().animate({ opacity: 0 }, speed, '>', function(){
                        title.attr({ text: defaultText }).animate({ opacity: 1 }, speed, '<');
                    });
                });
            });

        }
    };
    $('#expertise .diagram').each(function() {
        var $this = $(this),
            dimension = Math.min(600, $this.parent().width());

        $this.css('width', dimension);
        $this.css('height', dimension);

        $this.waypoint(function() {
            $this.addClass('animated ' + $this.data('animation'));
            diagram.init($this[0], dimension);
            $this.one(
                'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                function() {
                    $this.css({opacity: 1});
                }
            );
        },
        {
            offset: '90%',
            triggerOnce: true
        });

        $(window).resize(function() {
            var dimension = $this.parent().width();

            diagram.init($this[0], dimension);
        });
    });

    $('.knob').each(function () {
        var $this = $(this);
        var myVal = $this.attr('value');

        $(this).attr('value', 0);

        $this.knob();

        var fired = false;
        $this.waypoint(function() {
            if (fired === false) {
                $({value: 0}).animate({ value: myVal },
                    {
                        duration: 2500,
                        easing: 'easeOutCubic',
                        step: function () {
                            $this.val(Math.ceil(this.value)).trigger('change');
                        }
                    }
                );
            }

            fired = true;
        }, {offset: '80%'});
    });

    /* Toolbox */
    $('#toolbox-rotator').each(function() {
        $(this).slick({
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: true,
            dots: false,
            cssEase: 'ease-in-out',
            autoplay: true,
            pauseOnHover: true,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 4
                    }
                }, {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 3,
                        arrows: false
                    }
                }, {
                    breakpoint: 540,
                    settings: {
                        slidesToShow: 2,
                        arrows: false
                    }
                }
            ]
        });
    });

    /* Contact */
    function formControls(el)
    {
        var $element = el || $('#contact .form-control');
        $element.each(function() {
            var $labels = $(this).parent().find('.float_label');

            $labels.removeClass('focused');

            if ($(this).val() !== '') {
                $labels.addClass('filled');
            } else {
                $labels.removeClass('filled');
            }
        });
    }
    formControls();
    $('#contact-form .form-control').on('focus active', function() {
        $(this).parent().find('.float_label').addClass('focused');
    });
    $('#contact .form-control').on('blur', function() {
        formControls($(this));
    });

    $('#contact-form').submit(function(event) {
        event.preventDefault();

        var $form = $(this),
            emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            url = $form.attr('action'),
            $message = $form.find('.contact-message'),
            name = $form.find('input[name=name]').val().replace(/^\s+/, '').replace(/\s+$/, ''),
            email = $form.find('input[name=email]').val().replace(/^\s+/, '').replace(/\s+$/, ''),
            mess = $form.find('input[name=message]').val().replace(/^\s+/, '').replace(/\s+$/, '');
        $form.find('.btn').attr('disabled', 'disabled');

        $message.html('');

        if (name === '' || !emailRegex.test(email) || mess === '') {
            if (name === '') {
                $message.html('Please fill your name');
            } else if (!emailRegex.test(email)) {
                $message.html('Please enter a valid email');
            } else if (mess === '') {
                $message.html('Please fill your message');
            }
            $message.addClass('alert-danger show');

            setTimeout(function() {
                $message.removeClass('alert-danger show');
                $message.html('');
                $form.find('.btn').removeAttr('disabled');
            }, 3000);
            return;
        }

        var post = $.post(url, {name: name, email: email, message: mess});

        post.done(function(data) {
            if (data === 'sent') {
                $message.html('Message sent, thank you for contacting');
                $message.addClass('alert-success show');

                $form.find('input').val('');
            } else {
                $message.html('It was not possible to send your message, ' + data);
                $message.addClass('alert-warning show');
            }

            setTimeout(function() {
                $message.removeClass('alert-success alert-warning show').html('');
                $message.html('');
                $form.find('.btn').removeAttr('disabled');
            }, 3000);
        }).error(function() {
            $message.html('It was not possible to send your message, please try again');
            $message.addClass('alert-warning show');

            setTimeout(function() {
                $message.removeClass('alert-warning show');
                $message.html('');
                $form.find('.btn').removeAttr('disabled');
            }, 3000);
        });
    });
});
