image: vagrant-header.png
image-cover: false
tags: vagrant, ruby, yaml
title: Configure Vagrant hosts with YAML
subtitle: Automatic configuration of vagrant boxes through <em>YAML</em> definition file
----
The first time you hear about [Vagrant](https://www.vagrantup.com/) it seams not that much of a deal, yes it configures virtual machines and let you start and stop them from command line, but there is the moment you realise the true power unleashed by just *Vagrantfile* file, it really means the end of the endless developers' sentence "**It works locally**" and when we the code gets into production it breaks all pieces appart

With one file all the developers on a team will have the same machine to test code to, no more local web server, database, caching server, ..., they are not needed as they are provided by that single magic file. Well there is nothing magic about it but a lot of thoughfull configurations so your testing environment is exactly as your production machines

Lets assume from this point on you are already a proud user of Vagrant, whether you use it at work which I don't know of anyone doing at the moment, at your personal projects or on the open source projects you colaborate with

If you are the type of developer that uses only one host managed with Vagrant to perform your develop and/or testing, for example you configure both web server and database server on the same box, then you are good that way, there is no need to complicate your Vagrantfile any more, in fact there is no shorter and simpler configuration that just toss all those config lines in there

But if on the other hand your environment is more complicated and so you configure a plethora of hosts directly on your Vagrantfile, such as separate web and ddbb for connection testing, or testing your API, or queing messages for further process on another host, or ..., well, there is a better and cleaner way you can do

<blockquote>Based on <a href="http://laravel.com/docs/5.0/homestead" target="_blank">laravel/homestead</a></blockquote>

You can use a file in which write the configuration for all hosts, even shared configurations, and leave the heavy lifting of *actually* configuring Vagrant hosts to a script that parses that configuration. Lets see how

<blockquote>You can find all this files stored in <a href="https://github.com/juliangut/vagrantMultiHost" target="_blank">github</a></blockquote>

Either you are not working alone or yep! you are a solitary coding wolf, you are most certainly using a CVS like `git` to colaborate with each other on the team (or with past/future yourself). If that is the case it is easier to use a git module to use this configurations (read the [VagrantMultiHost documentation](https://github.com/juliangut/vagrantMultiHost/blob/master/README.md) to know how)

## How it works

#### *Hosts.rb*

The ruby script that actually does the work on transforming your hosts configurations into Vagrant configurations. There is no need to know Ruby in depth, I do not and I can manage to modify and extend Vagrant configurations

[view file](https://github.com/juliangut/vagrantMultiHost/blob/master/Hosts.rb)

#### *Hosts.yaml*

The hosts configuration file, should be copied to your project root. In here you define how many hosts you want and how to configure each one (*annotated*)

```yaml
---
# Path to run scripts directory
path: vagrant

# Custom boxes
boxes:
    trusty64: https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box

# Configured hosts
hosts:
      # host-name
    - name: web
      # VirtualBox identifier
      identifier: web.vagrantMultiHost.dev
      # automatic start on 'vagrant up'
      autostart: true
      # box to use
      box: laravel/homestead
      # host ip
      ip: 192.168.10.10
      # custon VirtualBox configuration
      provider:
          - { directive: memory, value: "2048" }
      # ports configured
      ports:
        - { map: 7777, to: 777, protocol: udp }
      # ssh keys
      authorize: ~/.ssh/id_rsa.pub
      keys:
        - ~/.ssh/id_rsa
      # shared folders
      folders:
        - { map: ./, to: /var/www/html }
      # nginx configured sites
      sites:
        - { map: vagrantMultiHost.dev, to: /var/www/html/public }
      # environment variables
      variables:
        - { key: APP_ENV, value: dev }
      # custom bash provisioning files
      provision:
        - ./vagrant/scripts/aliases.sh
        - ./vagrant/scripts/composer.sh
      #blackfire:
      #  - id: foo
      #    token: bar
      #    client-id: foo
      #    client-token: bar

    - name: ddbb
      identifier: ddbb.vagrantMultiHost.dev
      box: laravel/homestead
      ip: 192.168.10.80
      provider:
        - { directive: memory, value: "1024" }
      authorize: ~/.ssh/id_rsa.pub
      keys:
        - ~/.ssh/id_rsa
      databases:
        - vagrantMultiHost
      provision:
        - ./vagrant/scripts/aliases.sh
```

### path

In case you chose another directory name to `git module add` VagrantMultiHost project you should state it here

### boxes

`boxes` key is an interesting feature in case you have custom boxes, either they are public boxes or private company boxes. Here you can define those custom boxes url and give them a name to be used on host `box` key

<blockquote>There are lots of Vagrant boxes ready to use on <a href="http://vagrantbox.es" target="_blank">vagrantbox.es</a> like the one in the code</blockquote>

### provider

First of all I want to clarify that this configuration is ready to use with VirtualBox provider out of the box as it is the default provider for Vagrant, anyway if you're using other supported provider such as VMware you can change `Hosts.rb` to accommodate providers key to your prefered provider. Review Vagrant docs for [provider configuration](https://docs.vagrantup.com/v2/providers/configuration.html)

### autostart

Setting this key to true will make the host start automatically when `vagrant up`. If no host with autostart is set Vagrant will complain. More on this later

### provision

Is another interesting addition here, you can specify custom bash files to be used to provision the machine. Two handy bash files are already provided with VagrantMultiHost project, aliases.sh and composer.sh

#### *Vagrantfile*
```ruby
require 'yaml'

VAGRANTFILE_API_VERSION = "2"

configuration = YAML::load(File.read("#{File.dirname(__FILE__)}/Hosts.yaml"))
runPath = "#{File.dirname(__FILE__)}/" + configuration["path"]

require File.expand_path("#{runPath}/Hosts.rb")

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    Hosts.configure(config, configuration)
end

```

The only thing that is left for the end is of course the *Vagrantfile*, copied into your project root as well

This Vagrantfile is just delegating hosts configuration to out *Hosts.rb* script by providing it with the YAML definition, neat

## Usage

Now we have defined two hosts named `web` and `ddbb`, we are going to use this two names to manage both hosts

```shell
vagrant up
```

Will start automatically the hosts with `autostart` key to true. In the case you have none Vagrant will complain with a message like the following

```shell
No machines to bring up. This is usually because all machines are
set to `autostart: false`, which means you have to explicitly specify
the name of the machine to bring up.
```

If you want to manage one specific host (up, halt, reload, destroy, ...) you have to use its name

```shell
vagrant up ddbb
vagrant ssh web
vagrant halt ddbb
vagrant destroy ddbb
```
