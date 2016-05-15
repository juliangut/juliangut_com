require 'json'

VAGRANTFILE_API_VERSION ||= "2"

confDir = $confDir ||= File.expand_path("vendor/laravel/homestead", File.dirname(__FILE__))

settingsFilePath = ".vagrant/homestead.json"
provisionScriptPath = ".vagrant/provision.sh"
aliasesPath = ".vagrant/aliases"

require File.expand_path(confDir + "/scripts/homestead.rb")

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    if File.exists? aliasesPath then
        config.vm.provision "file", source: aliasesPath, destination: "~/.bash_aliases"
    end

    if File.exists? settingsFilePath then
        settings = JSON.parse(File.read(settingsFilePath))
    else
        abort("Configuration file \"" + settingsFilePath + "\" not found")
    end

    if Vagrant.has_plugin?("vagrant-hostsupdater") then
        config.hostsupdater.aliases = settings["hostaliases"].kind_of?(Array) ? settings["hostaliases"] : []
    end

    Homestead.configure(config, settings)

    if File.exists? provisionScriptPath then
        config.vm.provision "shell", path: provisionScriptPath
    end
end
