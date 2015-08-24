require.config({
    paths: {
        highlight: './highlight.pack',
        bootstrap: '../../../bower_components/bootstrap/dist/js/bootstrap',
        fontawesome: '../../../bower_components/fontawesome/fonts/*',
        imagesloaded: '../../../bower_components/imagesloaded/imagesloaded',
        'jQuery-One-Page-Nav': '../../../bower_components/jQuery-One-Page-Nav/jquery.nav',
        jquery: '../../../bower_components/jquery/dist/jquery',
        'jquery-backstretch': '../../../bower_components/jquery-backstretch/jquery.backstretch',
        'jquery-knob': '../../../bower_components/jquery-knob/js/jquery.knob',
        'jquery-migrate': '../../../bower_components/jquery-migrate/jquery-migrate',
        'jquery.easing': '../../../bower_components/jquery.easing/js/jquery.easing',
        'jquery.localScroll': '../../../bower_components/jquery.localScroll/jquery.localScroll',
        'jquery.nicescroll': '../../../bower_components/jquery.nicescroll/jquery.nicescroll',
        'jquery.scrollTo': '../../../bower_components/jquery.scrollTo/jquery.scrollTo',
        modernizr: '../../../bower_components/modernizr/modernizr',
        skrollr: '../../../bower_components/skrollr/src/skrollr',
        'slick-carousel': '../../../bower_components/slick-carousel/slick/slick.min',
        superslides: '../../../bower_components/superslides/dist/jquery.superslides',
        async: '../../../bower_components/requirejs-plugins/src/async',
        depend: '../../../bower_components/requirejs-plugins/src/depend',
        font: '../../../bower_components/requirejs-plugins/src/font',
        goog: '../../../bower_components/requirejs-plugins/src/goog',
        image: '../../../bower_components/requirejs-plugins/src/image',
        json: '../../../bower_components/requirejs-plugins/src/json',
        mdown: '../../../bower_components/requirejs-plugins/src/mdown',
        noext: '../../../bower_components/requirejs-plugins/src/noext',
        propertyParser: '../../../bower_components/requirejs-plugins/src/propertyParser',
        'Markdown.Converter': '../../../bower_components/requirejs-plugins/lib/Markdown.Converter',
        text: '../../../bower_components/requirejs-plugins/lib/text',
        'jquery-waypoints': '../../../bower_components/jquery-waypoints/lib/noframework.waypoints.min',
        'jquery.waypoints': '../../../bower_components/jquery-waypoints/lib/jquery.waypoints',
        raphael: '../../../bower_components/raphael/raphael',
        jssocials: '../../../bower_components/jssocials/dist/jssocials'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        modernizr: {
            exports: 'Modernizr'
        },
        highlight: {
            exports: 'hljs'
        },
        raphael: {
            exports: 'Raphael'
        },
        bootstrap: [
            'jquery'
        ],
        skrollr: {
            exports: 'skrollr'
        },
        'jquery.localScroll': [
            'jquery.scrollTo'
        ]
    },
    priority: [

    ],
    packages: [

    ]
});

require([
    'jquery',
    'modernizr',
    'highlight',
    'bootstrap',
    'jquery.easing',
    'jquery-migrate',
    'jquery.scrollTo',
    'jquery.localScroll',
    'jquery.nicescroll',
    'jquery.waypoints',
    'jssocials',
    'app'
], function($, Modernizr, hljs) {
    'use strict';

    $('html').niceScroll();

    $.localScroll();

    hljs.initHighlightingOnLoad();

    // goTo top
    $('body').waypoint(function() {
        $('#go-top').toggleClass('display');
    }, { offset: '-600px' });

    // Main top bar animation
    $('body.home').waypoint(function() {
        $('.navbar').toggleClass('navbar-min');
    }, { offset: '-500px' });
    $('body:not(.home)').waypoint(function() {
        $('.navbar').toggleClass('navbar-min');
    }, { offset: '-100px' });

    $('#menu-home').onePageNav();

    $('#menu-home a').click(function() {
        var $navbar = $('#navbar');
        if ($navbar.hasClass('collapsing') || $navbar.hasClass('in')) {
            $('.navbar-toggle').trigger('click');
        }
    });

    $('.parallax').each(function(){
        var $bgobj = $(this),
            coords = $bgobj.css('background-position').split(' '),
            baseYPos = parseInt(coords[1].replace('px', ''));

        $(window).scroll(function() {
            var yPos = parseInt($(window).scrollTop() / 10),
                newCoords = [coords[0], (baseYPos - yPos) + 'px'];

            $bgobj.css({ backgroundPosition: newCoords.join(' ') });
        });
    });

    $('#share').jsSocials({
        showLabel: false,
        showCount: false,
        shares: ['email', 'twitter', 'facebook', 'googleplus', 'linkedin']
    });
});
