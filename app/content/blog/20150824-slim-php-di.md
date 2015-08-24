image: 20150824-slim-php-di-header.jpg
image-cover: true
tags: slim, framework, dependency injection, php-di, container-interop
title: Change Slim3 Dependency Injection container
subtitle: A case on PHP-DI container use
----
The other day I talked about [Slim3 controllers](slim-controller) that can be automatically loaded if they meet certain conditions, such as parameterless constructors. At the end of the post I commented about not needing the method shown in the post because of the use of other DI containers instead of the Slim3 default container (Pimple), I'm going to focus on this today.

On the contrary as how Pimple works (it is really simple) there are a bunch of other DI containers out there that comes with really neat features that can be directly used in Slim3. Among all of them I'm going to use [PHP-DI](http://php-di.org/) container by Matthieu Napoli which currently is in its 5th version. If you don't know about this DI container I really suggest you give it a look, a try, and stick to it in the future, it really is a nice piece of work and comes with really awesome features in it such as constructor dependencies automatic injection based on type-hinting, injection based on annotations and direct definition of dependencies by configuration.

I'm not going to explain all this features, you can go to PHP-DI homepage and they have a good documentation to get you started in virtually no time.

# Container interoperability

The important feature for what we want to achieve today is that PHP-DI implements `container-interop/container-interop` ContainerInterface, a requirement to be used as a Slim3 container and as such this PHP-DI can be directly used as a replacement for Pimple.

#### ContainerInterface.php

```php
namespace Interop\Container;

interface ContainerInterface
{
    public function get($id);

    public function has($id);
}
```

#### index.php

```php
$containerBuilder = new \DI\ContainerBuilder();
$container = $containerBuilder->build();

$app = new \Slim\App($container);

// Set your routes

$app->run();
```

And you should be good to go with this as you've provided Slim constructor with a container implementing `ContainerInterface`, it is used and incorporated to the app and you will be perfectly able to use it in your routes and middleware as if you didn't replaced Pimple at all.

# Default services

Truth be told this is not enough, if you take a look at default's Slim container you'll notice it is not a straight Pimple container but instead it extends one, this is done like this because Slim needs certain services to be present by default in the container (in the case of Slim's default container it also implements ContainerInterface as Pimple does not).

This default services needed by the framework are `settings`, `environment`, `request`, `response`, `router`, `foundHandler`, `errorHandler`, `notFoundHandler`, `notAllowedHandler` and `callableResolver`, quite a few you need to register manually in your container we'd agree.

Several of this default services can be registered very simply with PHP-DI, an example for registering `errorHandler` and `callableResolver` can be found here, some other services are more difficult to set up as `response` or `router`.

```php
$containerBuilder = new \DI\ContainerBuilder();
$container = $containerBuilder->build();

$container->set('errorHandler', function() {
    return new \Slim\Handlers\Error();
});
$container->set('CallableResolver', function($container) {
    return new \Slim\CallableResolver($container);
});

// Register the rest of the services

$app = new \Slim\App($container);

// Set your routes

$app->run();
```

You can definitely see this goes on and on for all services, they are 10!. You'll have to do this in all Slim apps you create using PHP-DI as container, in the end this is just boilerplate configuration code you really shouldn't be bothering about. So instead of doing this yourself you can use `juliangut/slim-php-di` (in [packagist](https://packagist.org/packages/juliangut/slim-php-di)) that will prepare PHP-DI container with default services out of the box, reducing all you have to type to:

```
composer require juliangut/slim-php-di
```

```php
$container = \Jgut\Slim\PHPDI\ContainerBuilder::build();
$app = new \Slim\App($container);

// Set your routes

$app->run();
```

# Setting services

If you've ever registered a service with Slim's default container you most probably have noticed something weird in the way I've registered those default services myself before, this is becasue you are used to how Pimple register services by implementing `ArrayAccess` Interface instead of a setter function which is how PHP-DI does it.

```php
// Service registering with Pimple
$container['my_service'] = function($continer) {
    return new \MyService($container);
};
// Service registering with PHP-DI
$container->set('my_service', function($continer) {
    return new \MyService($container);
});
```

This difference is due to a lack of deffinition on `ContainerInterface` on how services should be registered in the container, the interface only focuses on how to verify registered services and how to pull them out of the container, so you're free to implement the registration method you want.

In order to minimize the potential problems derived from this, in `juliangut/slim-php-di` I've decided to implement `ArrayAccess` on the bridge container as well, this way you can regiter your services either by the setter method or by using array syntax. This removes the error when someone tries to pull services out of the container using array syntax which is avoided by Slim team in the documentation but will definitely happen to some people, or many.

This decission gives more interoperability between containers as I'm pretty sure most of the developers won't change Slim's default container, and even if they do they will still expect to register services with Pimple syntax. Until `ContainerInterface` comes up with a setter interface or any other interoperability interface pops out I guess we're stuck on using both syntaxes, at least until other DI container comes with a third one.
