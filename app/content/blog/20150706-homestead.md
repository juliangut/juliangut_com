image: 20150706-homestead-header.jpg
image-cover: true
tags: vagrant, laravel, homestead
title: How to use laravel/homestead in your projects
subtitle: Just homestead, no need of laravel
----
Laravel/Homestead Vagrant box is such a great tool to develop and so easy to insert in your current projects that I'm amazed how so many people don't really know how to use it in real life, in real projects and not those developed in Laravel.

This last point is a big deal, I've seen people thinking Homestead is only for Laravel projects, when in fact it is absolutely simple to include and adapt it to your need in any kind of project you're involved in.

We're going to see this with my own webpage project [juliangut_com](https://github.com/juliangut/juliangut_com) on Github which doesn't use Laravel but uses several other libraries.

If you have a look at the project you will notice two files `Homestead.yaml` and `Vagrantfile`. I already talked about Vagrant and Vagrantfile in an older [post](http://juliangut.com/blog/configure-vagrant-hosts-yaml) but in this case Homestead Vagrantfile is a bit different, we'll see how this files are generated and configured in depth.

But I'm just rushing, lets start from the begining. You have a project in which you are already using composer (as usual), so **first step** is to add Homestead to you dependencies.

```
composer require --dev laravel/homestead

Using version ^2.1 for laravel/homestead
./composer.json has been updated
Loading composer repositories with package information
Updating dependencies (including require-dev)
  - Installing symfony/process (v2.7.1)
    Loading from cache

  - Installing laravel/homestead (v2.1.4)
    Loading from cache

Writing lock file
Generating autoload files
```

Now Laravel Homestead is installed as a dependency, composer.json and composer.lock should have been updated, additionally symfony/process is added as a dependency of Homestead.

Now if you take a peak in `./vendor/bin` you will see `homestead` executable file, this is the command line tool included in homestead for you to easily configure it. So this is **second step**, we'll use the simplest way to create our files in need.

```
./vendor/bin/homestead make
```

This command will create `Homestead.yaml` and `Vagrantfile` files in our root directory.

#### *Vagrantfile*
```ruby
require 'json'
require 'yaml'

VAGRANTFILE_API_VERSION = "2"
confDir = $confDir ||= File.expand_path("vendor/laravel/homestead")

homesteadYamlPath = "Homestead.yaml"
afterScriptPath = "after.sh"
aliasesPath = "aliases"

require File.expand_path(confDir + '/scripts/homestead.rb')

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    if File.exists? aliasesPath then
        config.vm.provision "file", source: aliasesPath, destination: "~/.bash_aliases"
    end

    Homestead.configure(config, YAML::load(File.read(homesteadYamlPath)))

    if File.exists? afterScriptPath then
        config.vm.provision "shell", path: afterScriptPath
    end
end
```

Here you can see that a file called `homestead.rb` is required, which is in fact the actual Vagrantfile, all the configurations for vagrant will be done in that file using the configurations provided in `Homestead.yaml` file. If for whaterever reason you want to change `Homestead.yaml` file to another name you should change it in this file as well, otherwise Vagrant won't be configured.

If you are curious you'd have noticed that `aliases` and `after.sh` files are looked for too. This files contains shell aliases that will be automatically added to the box in `~/.bash_aliases` by the first file and will use the second file `after.sh` as a [shell provisioner](https://docs.vagrantup.com/v2/provisioning/shell.html) so you can run your own code to provision the box.

In order to create this two files you have to use the make command as before but give it a few extra parameters. This is absolutely optional, only in case you need it.

```
./vendor/bin/homestead make --after --aliases
```

Now for the **third step** the real thing comes into action, you will configure your box to be used specifically on your project.

#### *Homestead.yaml*
```yaml
---
ip: "192.168.10.10"
memory: 2048
cpus: 1
hostname: juliangut-com
name: juliangut-com
provider: virtualbox

authorize: ~/.ssh/id_rsa.pub

keys:
    - ~/.ssh/id_rsa

folders:
    - map: "/home/julian/Develop/juliangut_com"
      to: "/home/vagrant/juliangut-com"

sites:
    - map: juliangut.app
      to: "/home/vagrant/juliangut-com/dist/public"

#databases:
#    - homestead

variables:
    - key: APP_ENV
      value: local

# blackfire:
#     - id: foo
#       token: bar
#       client-id: foo
#       client-token: bar

# ports:
#     - send: 93000
#       to: 9300
#     - send: 7777
#       to: 777
#       protocol: udp
```

To configure the box you must edit this file to accommodate your needs, basically change `hostname`, `name`, `folders` and `sites` and `databases` configurations.

In the case of my project I use `juliangut-com` as hostname and name as suggested by Homestead itself (borrowed from current working directory).

Then I map my project's root directory to be located into `/home/vagrant/juliangut-com`. And the most important part is the configuration of sites, this will create Nginx configurations for the box, in my case the public server path is in `/home/vagrant/juliangut-com/dist/public`.

You can notice that I've commented out databases configuration, that is because in this project I don't have any database to be used. In case you need it both mysql and postgres databases will be created, user is `homestead` and pass is `secret`.

One important thing is missing, our **forth and last step**. You have your box fully configured by now, with your code already reachable and the Nginx server running but, how do you get to see the page? you have to update your `hosts` file:

#### */etc/hosts*
```
127.0.0.1               localhost.localdomain localhost
::1             localhost6.localdomain6 localhost6

192.168.10.10   juliangut.app
```

Adding that last line allows your browser to be redirected to your box instead of trying to resolve the URI's IP address, notice the defined IP is the same as in `Homestead.yaml` file. One thing I do is use the same IP for every box, so in hosts file I only have one line for all the projects. I only have to take care to halt Vagrant boxes before getting another up, you only work on one project at a time right?

```
192.168.10.10   project_a.app project_b.app project_c.app
```

And this is all, you have your testing environment set up with Homestead. Be aware though that `.gitignore` file needs to be updated to include the newlly created `.vagrant` directory, if not done you'll get dirt into your git repo, only Homestead.yaml and Vagrantfile are needed to be share with your team:

```
!.gitignore
.sass-cache/
.tmp/
.vagrant/
dist/
bower_components/
node_modules/
vendor/
!composer.lock
```

If after seeing this you still need reasons to use Homestead in your project Bruno Skvorc has an already one year old post for you, [6 reasons to move to Laravel Homestead](http://www.sitepoint.com/6-reasons-move-laravel-homestead/)
