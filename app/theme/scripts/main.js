require.config({
    paths: {
        highlight: './highlight.pack',
        jquery: '../../../bower_components/jquery/dist/jquery',
        'jquery-migrate': '../../../bower_components/jquery-migrate/jquery-migrate',
        'jquery.easing': '../../../bower_components/jquery.easing/js/jquery.easing',
        bootstrap: '../../../bower_components/bootstrap/dist/js/bootstrap',
        fontawesome: '../../../bower_components/fontawesome/fonts/*',
        'jquery-knob': '../../../bower_components/jquery-knob/js/jquery.knob',
        'jquery.nicescroll': '../../../bower_components/jquery.nicescroll/jquery.nicescroll',
        'jquery.scrollTo': '../../../bower_components/jquery.scrollTo/jquery.scrollTo',
        'jquery.localScroll': '../../../bower_components/jquery.localScroll/jquery.localScroll',
        'jquery-waypoints': '../../../bower_components/jquery-waypoints/lib/noframework.waypoints.min',
        'jquery.waypoints': '../../../bower_components/jquery-waypoints/lib/jquery.waypoints',
        'slick-carousel': '../../../bower_components/slick-carousel/slick/slick.min',
        superslides: '../../../bower_components/superslides/dist/jquery.superslides',
        raphael: '../../../bower_components/raphael/raphael',
        jssocials: '../../../bower_components/jssocials/dist/jssocials'
    },
    shim: {
        jquery: {
            exports: '$'
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
    'highlight',
    'bootstrap',
    'jquery-migrate',
    'jquery.easing',
    'jquery.nicescroll',
    'jquery.scrollTo',
    'jquery.localScroll',
    'jquery.waypoints',
    'jssocials',
    'app'
], function($, hljs) {
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

    $('#menu-home a, #janitor-nav a').click(function() {
        var $navbar = $('#navbar');
        if ($navbar.hasClass('collapsing') || $navbar.hasClass('in')) {
            $('.navbar-toggle').trigger('click');
        }
    });

    if (document.location.hash) {
        var hash = document.location.hash.replace('#_', '#');
        $(window).scrollTo($(hash));
    }

    $('#share').jsSocials({
        showLabel: false,
        showCount: false,
        shares: ['email', 'twitter', 'facebook', 'googleplus', 'linkedin']
    });
});
