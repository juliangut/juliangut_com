image: 20150813-slim-controller-header.jpg
image-cover: true
tags: slim, framework, dependency injection
title: Slim3 automatic controllers
subtitle: Don't repeat yourself
----
Slim Framework version 3 is in active development, [Beta2](http://www.slimframework.com/2015/08/10/slim3-beta2.html) was released last 10th of August.

Slim Framework comes with lots of great stuff, there is one that bothered me the most about Slim2 and it was the definition of routes in a single file, oh yes you could strip it into several files but then you have to require them all.

Now in Slim3 appart from the use of `Closures` to define route callback you can define route with a class and method that will be used instead (className:methodName), of course that method should have a special signature so it can be used in the execution stack:

```php
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

class HomeController
{
    public function dispatch(ServerRequestInterface $request, ResponseInterface $response, array $args)
    {
        // Do your stuff here

        return $response;
    }
}
```

Only this option by itself simplifies the routing in Slim3 a lot, now our routing file can be much simpler and concise leaving behind that long bloated old file from the past, and leveraging the execution of our code to encapsulated classes

```php
$app->get('/', 'HomeController:dispatch');

$app->group('/users/{id:[0-9]+}', function () {
    $this->get('', 'UserController:get')->setName('user');
    $this->delete('', 'UserController::delete')->setName('user-delete');
    $this->get('/reset-password', 'UserController:reset')->setName('user-password-reset');
});
```

It would be clean and nice if we didn't need to include the classess in the DI container manually so that routing mechanism could instantiate the class later in the execution

```php
$container = $app->getContainer();

$container['HomeController'] = function ($container) {
    return new \HomeController();
};
$container['UserController'] = function ($container) {
    return new \UserController($container->get('settings'));
};
// And so on
```

I have a file called `services.php` in which I register all the services I need such as [slim/twig-view](https://github.com/slimphp/Twig-View) and this classes injectors.

We can see a pattern here, most of controllers share a common creation schema in which $container is used to pull out parameters needed by the controller, like 'settings' or 'view' to render Twig templates, what if we can normalize this pattern so that someone else take care of it? Well there is a way

[juliangut/slim-controller](https://github.com/juliangut/slim-controller) does just that for you, there is one caveat though but we'll get to that soon enough.

```
composer require juliangut/slim-controller:^1.0
```

Now that we have it installed we will use two different classess. First one `Controller` from which we'll extend our controllers, this class will provide with access to DI container content itself as if you where using a Closure route instead of a Class.

```php
namespace MyWeb;

use Jgut\Slim\Controller\Controller;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

class UserController extends Controller
{
    public function reset(ServerRequestInterface $request, ResponseInterface $response, array $args)
    {
        // Awesome code here

        // Assuming you havee Twig view service (slim/twig-view)
        $this->view->render($response, 'dispatch.twig');

        return $response;
    }
}
```

It really doesn't interfere with our development process including lots of lines of code, just extend `Jgut\Slim\Controller\Controller` and you can start pulling services out of DI container by using `$this->{serviceName}`. There is only one thing to remember, do not override $this->container attribute ;)

For this to work properly we need an extra service to be registered on the DI container `Jgut\Slim\Controller\Registrator` that will be responsible, as its name states, of registering the controllers for you:

```php
$container = $app->getContainer();

$container->register(new \Jgut\Slim\Controller\Registrator);

// Continue registering other services
```

We need a way to tell Registrator what controller we want to be registered, we do this using Slim App settings, here we have everything in a single file. Check Rob Allen's [slim3-skeleton](https://github.com/akrabat/slim3-skeleton/) to see how to separate a Slim3 application in several logical files.

```php
$settings = [
    'controllers' => [
        'MyWeb\HomeController',
        'MyWeb\UserController',
    ],
];

$app = new \Slim\App($settings);

$container = $app->getContainer();

$container->register(new \Jgut\Slim\Controller\Registrator);

// Register other services in $container here

$app->get('/', 'HomeController:dispatch');

$app->group('/users/{id:[0-9]+}', function () {
    $this->get('', 'MyWeb\UserController:get')->setName('user');
    $this->delete('', 'MyWeb\UserController::delete')->setName('user-delete');
    $this->get('/reset-password', 'MyWeb\UserController:reset')->setName('user-password-reset');
});

$app->run();
```

And you are good to go without registering your own controllers in the DI container.

But I mentioned before there was a problem with this solution, what if any of my controller classess needs parameters in their constructor? that prevents you from using `Registrator` to automatically register the controller for you so you have to do it yourself but you are still able to extend `Jgut\Slim\Controller\Controller` and benefit from it, though you have to call `setContainer` method yourself.

We have this controller class, mind it is still extending `Jgut\Slim\Controller\Controller`:

```php
namespace MyWeb;

use Jgut\Slim\Controller\Controller;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;

class BlogController extends Controller
{
    protected $pager;

    public function __construct($pager)
    {
        // Initializations
    }
    
    ...
}
```

So we have to register the controller as usual:

```php
$container = $app->getContainer();

$container['MyWeb\BlogController'] = function ($container) {
    $controller = new \MyWeb\BlogController(new \Fake\Pager);
    $controller->setContainer($container);

    return $controller;
}
```

This is a good way to cut off repetitive lines of code for each class route and have access to DI container at the same time. I hope this package to be usefull in a day to day basis to speed development a bit.


## Note

Using another container such as [PHP-DI](http://php-di.org) (which was discussed to be used in Slim3) and its automatic capabilities to determine class dependencies and inject them the mechanism expressed here is not neccessary, but I'll cover that in a future post.
