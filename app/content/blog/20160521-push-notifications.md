image: 20160521-push-notifications-header.png
image-cover: true
tags: push notification apns gcm
title: Push notification services
subtitle: APNS and GCM
----

With the closing of [Parse](https://parse.com/) many people turned out to look for a new service to have an easy to use backend for their prototyping, mobile apps, etc, and there are several different options.

One of the features available in Parse and more difficult to find on a non-paid service out there is the possibility to push notifications to mobile devices. I guess (haven't checked) it's implemented on Parse server which is open-source right now, but as long as it is a nodeJS project and I wanted a PHP based solution I decided to create my own push notification service and not depend on a third party service, use another technology on the server or install a project with so many features I'm not going to use: [juliangut/tify](https://github.com/juliangut/tify), which finally reaches 1.0.

At the end I found the concepts behind notification services quite simple but the implementation quite complicated to accomplish as supporting the two major notification services APNS and GCM forces to work in two very different ways. Thankfully Zend have respective packages to abstract the connection with both services.

After learning and implementing this services I have to say that Google's path seems really much simple, robust and scalable to me, why Apple has to make things so hard?

I should probably try finishing the inclusion of MPNS (Microsoft Push Notification Service) into Tify, I had to stop because it really gave me some headache to undertand their service and deal with the concept of all their different message types.

### Notifications workflow

The following diagram shows the notification workflow:

![push notification diagram](http://juliangut.com/images/20160521-push-notifications-diagram.png)

There are three actors involved in a push notification, firstly the device that is going to receive the notification itself (A), the "official" push notification service provided by mobile devices OSs manufacturers (B), namely APNS (Apple Push Notification Service) and GCM (Google Cloud Messaging), and finally the server which is the origin of the actual notification being sent (C).

The notification flow starts on de device once an application has been installed. On first run the application must register itself on the push service (APNS or GCM) [1] and receive a device token in exchange for this registration [2]. This device token is unique for that application's installation, so with it not only notification services identify the application but that exact installation on the application on a concrete device.

 Once the application has its device token it must be sent to your notification server [3] so it can send the notifications to the device. This is where Tify comes into play.

 Now that the application is registered both on push service and notification server you can use Tify to send notifications using device tokens to the push services [4] and then this push services are responsible of delivering the notifications to the desired devices [5].

### Tify

APNS and GCM both use different message payload, connection methods and most importantly returning data. Due to this the ultimate goal of Tify was to abstract this differences as much as possible to provide a unified and easy api.

When creating your notification server you have to take care of two of the previous workflow steps:

* [3] Save the device token so it can be used for later notifications
* [4] Compose the notification and send it to registered devices

Once [3] is taken care of (the C on CRUD) lets consider what is needed for [4]

There are 4 elements to configure in Tify to send notifications, two of them are service dependent. "adapters" abstract the connectors to push services, and "receivers" represent each of the devices receiving the notification. the other non-service dependent elements are "messages" which abstract notification payloads so you don't have to deal with each service singularities, and "notifications" glues messages and receivers together so at every moment you can send several messages to the same devices or the same message to several devices.

Finally what makes Tify most useful is its abstraction of push services returning data. Success data and error messages are abstracted into a single object, so both push services results can be checked with the same api.

There's a lot of information on Tify project itself to start working with it, and I've said at the beginning of this post the concepts behind push notifications are quite simple so anyone can have their own notification service, test devices are needed though.

### Example

In order to show off the use of Tify I've created [Tify Example](https://github.com/juliangut/tify_example). A very simple implementation of Tify that works as kickoff code, it just covers the basic usage so there's plenty of room for improvement to work on:

* Securing server
* Un-register devices
* Identify expired tokens
* Identify recurring installations in the same device
* Filter devices per notification
* Customize notifications
* Use APNS sandbox mode
* Support different applications
* Delay notifications send
* etc
