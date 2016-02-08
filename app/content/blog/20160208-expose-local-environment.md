image: 20160208-expose-local-environment-header.jpg
image-cover: true
tags: development local environment tunnel subdomain
title: Expose your local environment publicly
subtitle: Thanks to localtunnel
----
There are times when you have to show your local development environment, maybe because it is a very early development stage and you still don't have an online testing machine, or you're freelancing on some small project and you wnat to show something to the customer.

Anyway the point is you need to expose your local environment to the outside world for a small period of time. I'm currently developing an API for mobile devices and need to allow the Android and iOS developers to communicate with my local server.

Before I used a tool called [ngrok](http://ngrok.com) which is a nice tool with really great functionalities but the possibility to use subdomains is not among the ones freely available so I looked for an alternative.

Finally I found [localtunnel](http://localtunnel.me) which is a really small, fat free, all Open Source Node.js project with _exactly_ what I was looking for so I jumped into it eagerly.

## Installation

As `localtunnel` is available through npm it can be installed in a breeze:

```
npm install -g localtunnel
```

And just like that it is system wide available.

## Usage

```
lt --p 80
```

Done! Localtunnel will prompt an url like `https://nnxflaeupz.localtunnel.me`, you only have to provide this url to your customer and he/she will be accessing your local server (whether it is Apache, nginx, ...). The tunnel will remain open untill you close the `lt` process.

This is just nice but it was what ngrok provided, the reason why I looked for another tool remains: __the url localtunnel gives you will change every time you rerun the process__.

### Subdomain

To solve the subdomain problem localtunnel has an option to define your custom subdomain:

```
lt -s my-project -p 80s
```

And just like that you get `https://my-project.localtunnel.me`. Now when you run localtunnel you'll be opening the tunnel with the same URL every time.

That is what I wanted, now mobile developers don't need to change the endpoint url every time I reopen the tunnel!

### Local host

There is an issue though, I don't have a local running server listening on port 80 but I work using Laravel Homestead as development environment for a wide number of reasons, so my project servers are running in a virtual machine.

No problem, localtunnel got this covered by setting a local host redirection:

```
lt -l 192.168.100.100 -s my-project -p 80
```

Now `https://my-project.localtunnel.me` is pointing to the server running on virtual machine with IP 192.168.100.100, awesome

## Ultimate command

For the _ultimate_ command, if you have your virtual machine's IP mapped inside `/etc/hosts` then you can just redirect to your defined host name:

```
lt -l my-project.app -s my-project -p 80
```

`https://my-project.localtunnel.me` now gets you to my-project.app

You no longer need an online development environment to show off your progress
