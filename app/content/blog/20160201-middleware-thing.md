image: 20160201-middleware-thing-header.jpg
image-cover: true
tags: middleware psr7 http message
title: The middleware "thing"
subtitle: Explained for the untrained
----
PSR7 middleware were some time ago "the next big thing" in the PHP community (along with PSR7 itself I guess?), now it is already a thing happening right here. Many microframeworks use them wildly and other frameworks such as ZendFramework3 have moved towards it in a search for simplicity and decoupling.

Although all its benefits and the fact that it is something coming from other languages such as Node.js or Python a lot of developers don't yet get what it is exactly and how to use it.

To be honest among the many explanations of middlewares out there most of them are far from clear an easy. I'm going to try to explain the concept in the simplest way possible to me (with examples ;)

In this post I'm going to lean on PSR7 Http messages abstraction which you should definitely be using by now for every project (at least I am).

## What is it?

This is a really low formal definition of middleware that fits in our daily workflow:

> Middleware is software that wraps arround (executes before and after) our central piece of software (program) to handle input/output communication.

I think my previous sentence just states the most important topics the developers need to focus on when thinking about middleware.

To illustrate this concept there are lots of images on the internet, I've made my own to which we will reflect later on.

<div style="text-align: center">
  <img src="../images/20160201-middleware-layers.png">
</div>

In the image we have defined PSR7 HTTP Request and Response, `Core` which is our "program" and four middlewares identified by the "lambda" symbol, a color and a number (which indicates the order in which it was added). As a side note you'll normally see examples of middlewares implemented as lambda functions (thus the symbol) but in fact any callable would do just as good.

## How it works?

Lets start by having a look at the typical signature of a middleware, it is so simple you already memorize it the first time you see it:

```php
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

function (ServerRequestInterface $request, ResponseInterface $response, callable $next = null) {
    // Do stuff before next middleware or the program itself

    // Call next in the stack and collect its response
    if (!is_null($next)) {
        $response = $next($request, $response);
    }

    // Do stuff after the previous middleware has finished execution

    // Return response
    return $response;
}
```

Request and response are self explanatory objects, but what is the $next callable for? It is the following piece of software to be executed in the stack allowing you to define the point at which it will be called in the middleware, this is the mechanism that allows the middlewares to wrap other code. If we look at my previous schema and considering this middleware is red one, $next refers to the green, the next to be executed.

Got it, so if a middleware receives the $next callable parameter but then calls it without the "next" element in the stack (yellow middleware) how the execution continues?

That is actually the responsability of the "middleware stack handler" you are using, it will typically wrap your middleware into a simpler Closure so it can provide your function with the next middleware in the stack (which was in fact the last added):

```php
class MiddlewareHandler
{
    protected $middlewareStack;

    ...

    public function addMiddleware($callable)
    {
        $next = $this->middlewareStack->top();
        $this->middlewareStack[] = function (ServerRequestInterface $request, ResponseInterface $response) use ($callable, $next) {
            return call_user_func($callable, $request, $response, $next);
        }
    }

    ...
}
```
_Closures are awesome!_

All this previously discussed brings us to an interesting point to note, middlewares actually form sort of two stacks around your program (controller or whatever), the "in" stack before and the "out" stack after the program is executed.

Looking closely at the image above you can see this two stacks are order in reverse to one another. This is due to the fact that each middleware wraps not only the actual program (Core in the image) but also all previously defined middlewares as well. You should see it like the code before and after `$next($request, $response)` form an onion layer around the next middleware. This forces to keep an eye in the order they are added if they somehow depend on each other, will see this later.

Of course you're not obliged to do anything before of after the `$next()` call, but the whole point of adding middleware it to do "something" either with the Request, the Response or any other part of the app.

The last bit to learn to understand middlewares is that your central piece of code (app controller most probably) in fact is a middleware in itself as it's the last $next call in the line, and thus it won't receive a $next parameter.

Why is it that your program is a middleware too? The answer to this is that it receives Request and Response objects as well, and must return a Response object so the execution continues on the "out" stack.

Using the previous example on MiddlewareHandler this would be the constructor with your program as parameter:

```php
class MiddlewareHandler
{
    public function __construct(callalbe $final)
    {
        $this->middlewareStack = new SplStack;
        $this->middlewareStack[] = $final;
    }

    ...
}
```

## How do I use all of this?

Lets have a look at three very simple middleware to illustrate its use, I'll call them $yellow, $blue and $core so they can be tracked on the schema presented before:

```php
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

$yellow = function (ServerRequestInterface $request, ResponseInterface $response, callable $next) {
    $request = $request->withAttribute('environment', 'development');

    $response = $next($request, $response);

    $response = $response->withHeader('X-App-Environment', 'development');

    return $response;
}

class Blue
{
    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next) {
        $response->getBody()->write(sprintf('environment: "%s"\n', $request->getAttribute('environment')));

        $response = $next($request, $response);

        $response = $response->withStatus(200, 'OK');

        return $response;
    }
}
$blue = new Blue;

$core = function (ServerRequestInterface $request, ResponseInterface $response) {
    $response->getBody()->write('core executed!');

    return $response;
}
```

_Note I'm using a class for Blue to illustrate how any callable can be used_


And for the working example instead of using my simplistic approach shown before I'm going to use Zend Stratigility and Zend Diactoros as they are two popular packages to be used with middleware:

```php
use Zend\Stratigility\MiddlewarePipe;
use Zend\Diactoros\Server;

...

$app = new MiddlewarePipe();
$app
    ->pipe('/', $yellow)
    ->pipe('/', $blue)
    ->pipe('/', $core);

$server = Server::createServer($app, $_SERVER, $_GET, $_POST, $_COOKIE, $_FILES);
$server->listen();
```

Tracking the execution:

```txt
1. User requests to server looking for '/' path
    2. yellow middleware is executed and 'environment' attribute is added to the request
    3. yellow hands execution to blue
        4. blue adds the string 'environment: "development"' to the response body
        5. blue hands execution to core
            6. core adds a new line 'core executed!' to the response body
        7. blue continues execution by setting HTTP status 200 to response
    8. yellow continues execution adding 'X-App-Environment' custom header to response
9. The response is returned to the user
```

Take good note on the order $yellow and $blue were executed as $blue uses the 'environment' attribute from the Request object and that attribute is set in $yellow. If the middlewares were to be added in the other order, blue first, then an error will arise because 'environment' attribute won't be declared.

In the end you have to realise that your full program gets reduced to a list of middleware that gets stacked and executed, you create your "core" code and then toss some middleware around it, they can be yours or even better middleware created by any really clever developers out there.

### Failing

There is still one topic not covered, it is exiting early, or to put it on a more common way, execution failing.

In this topic middleware got you covered, they shine wonderfully because at any point in the execution of the stack you can return early easily. In the image at the top of the post this is shown as dotted lines from middlewares going directly to Response object.

```php
$green = function (ServerRequestInterface $request, ResponseInterface $response, callable $next) {
    try {
        // Some clever code goes here, maybe authentication or validation or caching or ddbb connection or ...
    } catch (\Exception $e) {
        // Stop execution here before anything worse happens and return gracefully
        return $response->withStatus(500);
    }

    // Normal execution path
    return $next($request, $response);
}
```

Of course frameworks have better ways to deal with exceptional cases, more complicated than this one, but at a very basic level this is what they all do.

It's been a rather long post but I hope I've made myself clear explaining the concept of PSR7 middlewares to the "untrained" as said in the post subtitle.

Go middleware it all!
