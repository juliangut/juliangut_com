image: 20160612-multiple-webpack-browserify-endpoints-header.jpg
image-cover: true
tags: browserify webpack
title: Multiple Webpack and Browserify endpoints
subtitle: Side by side
----

I've been playing around with [Webpack](http://webpack.github.io) lately, which I find being much better than Browserify, the building tool I'm currently using, I'll cover this thoughts in a future post though.

Today I'll cover a topic that bothers me about Browserify and that is cleanly solved by Webpack, having multiple script endpoints (entry points) generated at the same time.

Let's say I want all my application code merge into a single file and all the vendor code I'm using in another file, a really common pattern. We will see how to accoumplish this both with Webpack and Browserify.

> I'm using Gulp as task runner and 2015 syntax (or ES6 if you prefer) with [babel](https://babeljs.io) for the examples here. If you don't know about ES2015 [this](https://babeljs.io/docs/learn-es2015/) is a good place to head first.

Lets start with the cleaner solution

### Webpack

```javascript
'use strict';

import config from './config';
import gulp from 'gulp';
import through from 'through';
import plumber from 'gulp-plumber';
import webpack from 'webpack-stream';

const webpackOptions = {
  debug: config.debug,
  entry: {
    vendor: `${config.src}/${config.scripts}/vendor.js`,
    app: `${config.src}/${config.scripts}/app.js`
  },
  output: {
    filename: '[name].js'
  },
  module: {
    loaders: [{ test: /\.jsx?$/, loader: 'babel' }]
  }
};

gulp.task('webpack', () => {
  return through()
    .pipe(plumber())
    .pipe(webpack(webpackOptions))
    .pipe(gulp.dest(`${config.dist}/${config.scripts}`));
});
```

With Webpack you simply define several different entry points in just one place (the `entry` key on webpack configuration) and they are treated separately, they will end in different output files.

Additionally setting output filename to `[name].js` you ensure the output files will have the same name as their entry counterparts.

Mind that `webpackOptions` constant in reality is separated into `webpack.config.js` file. I love this cleanness.

### Browserify

```javascript
'use strict';

import config from './config';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import merge from 'merge-stream';

gulp.task('browserify', () => {
  const entries = [
    `${config.src}/${config.scripts}/vendor.js`,
    `${config.src}/${config.scripts}/app.js`
  ];

  const streams = entries.map((entry) => {
    return browserify({
      entries: [entry],
      debug: config.debug,
      insertGlobals: config.debug,
      fullPaths: config.debug,
      transform: ['babelify']
    }).bundle()
      .pipe(plumber())
      .pipe(source(entry.replace(`${config.src}/${config.scripts}/`, '')))
      .pipe(buffer())
      .pipe(gulp.dest(`${config.dist}/${config.scripts}`));
  });

  return merge.apply(this, streams);
});
```

Contrary to what Webpack can do if you define different entry scripts (in `entries` key) they will all be merged into a single stream, tough having a single output file, not what I want here.

To overcome this problem we need to be more creative with Browserify, by having an array of entries and using `Array.prototype.map` this entry points are transformed into "different" browserify streams, then we make sure the output files have the same name as the entries by removing the path to the file.

But that's not all, for Gulp to know when the task has finished (an important thing!) this different streams must be merged into a single one, but fear not as the streams are already configured as separate endpoints.

As you can see it's cumbersome, even when in the end the amount of code is not so different you need to use browserify and other tools together several times.

## Conclusion

The conclusion after my days toying with Webpack is that I'm moving towards it and leaving Browserify behind.

Webpack loaders are like Browserify syntaxes but way better, Webpack plugins are like Browserify plugins but better, the ability to import other kind of files (not just javascript) and be treated differently is awesome, Webpack resulting files are lighter than Browserify's, ...
