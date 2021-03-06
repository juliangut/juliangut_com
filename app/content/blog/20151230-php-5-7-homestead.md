image: 20151230-php-5-7-homestead-header.jpg
image-cover: true
tags: laravel homestead php5.6 php7
title: PHP5.6 and PHP7 development with Homestead
subtitle: Configure separate boxes and have it all
----
Long time no see.

So a new and shiny laravel homestead package (^3.0) and vagrant box (0.4.0) versions are out but don't rush to upgrade yet because this updates are meant for PHP7 and you are problably still working on PHP5.6. So if you are not ready to work on PHP7 or most problably your host is the problem here then keep reading.

In the project I'm working on right now we're developing for PHP5.6 but I want to work on other projects with PHP7 on the same pc, this is something that can be done using two separate boxes but there is a small issue to fix before you can do it.

If you upgrade either laravel/homestead or homestead vagrant box to the latest version you'll encounter a problem, php-fpm won't be in sync between the installed vagrant box and homestead scripts and so you'll end up with a non working testing environment:

* Starting laravel/homestead:^3.0 even when it requires php:>=5.5.9 it actually is configuring the box to [use php7](https://github.com/laravel/homestead/blob/v3.0.0/scripts/serve-laravel.sh#L43) and so you need to have vagrant box version 0.4.0 installed (latest update). If you are still using box version 0.3.3 and below you'll get the error **php7-fpm: unrecognized service**

* On the other side if you still use laravel/homestead:^2.1 (php:>=5.4) but for some reason you updated to box version 0.4.0 then you'll get the opposite error **php5-fpm: unrecognized service** because nginx is being configured to [use php5.6](https://github.com/laravel/homestead/blob/v2.1.8/scripts/serve-laravel.sh#L34)

## How to solve this?

> Lightning fast solution: configure vagrant to use a different box version for projects using different PHP versions.

The guys at Homestead have already considered this for future box versions by including a new key in Homestead.yaml, `version`, as simple as adding [this line](https://github.com/laravel/homestead/blob/v3.0.0/scripts/homestead.rb#L17). Unfortunately those using laravel/homestead < 3.0 don't have this option so we're going to include it manually.

Before anything else make sure you have both box versions installed otherwise this has no meaning:

```
vagrant box add laravel/homestead --box-version 0.3.3
vagrant box add laravel/homestead --box-version 0.4.0
```

As we all agree it is a **bad idea** to modify a package/library instead of extend from it, modifying `Vagrantfile` generated by `homestead make` command is all we need.

#### *Original Vagrantfile*

```ruby
require 'json'
require 'yaml'

VAGRANTFILE_API_VERSION ||= "2"
confDir = $confDir ||= File.expand_path("vendor/laravel/homestead", File.dirname(__FILE__))

homesteadYamlPath = "Homestead.yaml"
homesteadJsonPath = "Homestead.json"
afterScriptPath = "after.sh"
aliasesPath = "aliases"

require File.expand_path(confDir + '/scripts/homestead.rb')

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    if File.exists? aliasesPath then
        config.vm.provision "file", source: aliasesPath, destination: "~/.bash_aliases"
    end

    if File.exists? homesteadYamlPath then
        Homestead.configure(config, YAML::load(File.read(homesteadYamlPath)))
    elsif File.exists? homesteadJsonPath then
        Homestead.configure(config, JSON.parse(File.read(homesteadJsonPath)))
    end

    if File.exists? afterScriptPath then
        config.vm.provision "shell", path: afterScriptPath
    end
end
```

#### *Modified Vagrantfile*

```ruby
require 'json'
require 'yaml'

VAGRANTFILE_API_VERSION ||= "2"
confDir = $confDir ||= File.expand_path("vendor/laravel/homestead", File.dirname(__FILE__))

homesteadYamlPath = "Homestead.yaml"
homesteadJsonPath = "Homestead.json"
afterScriptPath = "after.sh"
aliasesPath = "aliases"

require File.expand_path(confDir + '/scripts/homestead.rb')

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    if File.exists? aliasesPath then
        config.vm.provision "file", source: aliasesPath, destination: "~/.bash_aliases"
    end

    settings = nil
    if File.exists? homesteadYamlPath then
        settings = YAML::load(File.read(homesteadYamlPath))
    elsif File.exists? homesteadJsonPath then
        settings = JSON.parse(File.read(homesteadJsonPath))
    end

    if settings != nil then
        config.vm.box_version = settings["version"] ||= ">= 0"

        Homestead.configure(config, settings)
    end

    if File.exists? afterScriptPath then
        config.vm.provision "shell", path: afterScriptPath
    end
end
```

It is not a huge modification after all and it allows us to extend with new options in the future should it be needed.

Anyway thanks to this simple change we can now define Vagrant box's `version` in our Homestead.yaml file and keep using box version 0.3.3 while having version 0.4.0 installed:

#### *Homestead.yaml*

```yaml
---
ip: "192.168.10.10"
version: "~> 0.3.0"
memory: 2048
cpus: 1
...
```

In those projects in which we want to use Homestead to develop in PHP7 we don't need to modify anything, actually right now we don't even need to declare a `version` as it will always use the latest box version.

> Happy new year!
