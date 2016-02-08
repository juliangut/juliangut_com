require 'json'

VAGRANTFILE_API_VERSION = "2"
confDir = File.expand_path("vendor/laravel/homestead", File.dirname(__FILE__))

homesteadJsonPath = ".vagrant/homestead.json"
afterScriptPath = ".vagrant/after.sh"
aliasesPath = ".vagrant/aliases"

require File.expand_path(confDir + "/scripts/homestead.rb")

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    if File.exists? aliasesPath then
        config.vm.provision "file", source: aliasesPath, destination: "~/.bash_aliases"
    end

    settings = JSON.parse(File.read(homesteadJsonPath))

    config.hostsupdater.aliases = settings["hostaliases"] ||= []

    Homestead.configure(config, settings)

    if File.exists? afterScriptPath then
        config.vm.provision "shell", path: afterScriptPath
    end
end
