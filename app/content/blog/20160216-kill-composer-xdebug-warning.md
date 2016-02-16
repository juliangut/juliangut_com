image: 20160216-kill-composer-xdebug-warning-header.jpg
image-cover: true
tags: composer xdebug environment
title: Kill Composer xdebug warning
subtitle: If it "reeeeeally" bothers you
----
Lately I've been bothered by the warning displayed by Composer when you have xdebug enabled on your system to which I didn't pay attention before, being honest it is not really that bad but as long as I have aliases to shorten many things: commands, paths, git prompts, etc, I don't want this warning displayed every time I run any Composer command.

![warning](/images/20160216-composer-xdebug-warning.png)

Having a look at Composer documentation on [CLI command](https://getcomposer.org/doc/03-cli.md) at the very end there it is an environment variable that controls the display of this warning `COMPOSER_DISABLE_XDEBUG_WARN`, so as simple as setting the variable and be gone.

#### *~/.bashrc*

```
export COMPOSER_DISABLE_XDEBUG_WARN=1
```

But I don't want another export in my .bashrc, and given I've an alias to run Composer ...

#### *~/.bash_aliases*

```
alias composer="COMPOSER_DISABLE_XDEBUG_WARN=1 php ~/.composer/composer.phar "
```

Absurd I didn't do it before, now I can have those lines to display really "important" information ;)

Actually there are many interesting environment variables to control Composer behavior I haven't had a look before and deserve some attention.
