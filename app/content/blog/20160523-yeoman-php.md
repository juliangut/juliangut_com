image: 20160523-yeoman-php-header.jpg
image-cover: true
tags: yeoman scaffold php composer git homestead
title: Scaffolding package based PHP projects
subtitle: with <em>Yeoman</em>
----

Git init, composer init, require compatibility packages, create .gitignore, .gitattributes, npm init, install grunt, configure grunt, create README and CONTRIBUTING files, copy .editorconfig from another project, prepare travis file, create folder structure, etc

I'm pretty sure I'm forgetting a lot of steps I follow when starting a new project, whether it is a package or a full project, and that's the problem, all this steps are hard to remember so I skip it and just copy/paste from another project, empty source and tests folders and then Ctrl+R to replace old project name with new one. This again is very error prone, but there is a way to automate this tasks for you, being lazy in this matter **is** a good thing

## Yeoman

 I'm not going to introduce [Yeoman](http://yeoman.io) to anyone, not nowadays, it is already a well known tool used mainly by frontend developers that needs no presentation.

Yeoman's target is scaffolding projects so developers can jump directly into writing actual code without worrying about initial project configuring steps, such as those expressed at the beginning of this post, and much more.

There are tons of different awesome generators, from angular, to jQuery, cordoba, html5boilerplate, etc. They are a real time saver.

what might be new to PHP developers is that being an npm project it can be applied to PHP projects as well on an every day basis. What is the difference between scaffolding an "Angular + Browserify + Express" project and any PHP project? when it comes to project environment configuration there is none.

## BarePHP generator

Trying different generators for PHP development I realized most of them, more specifically those that really worth the shot and are in active maintenance, are laser focused on frameworks, Symfony, Laravel, CakePHP, and others. Given I tend to favor a combination of micro-frameworks + a plethora of well known packages (thank god we have Composer) instead of restricting myself to a full ecosystem I felt frustrated I didn't find a generator that suit my needs, all the different tools I use, which are a lot.

To fill this gap in "generators world" I've created a Yeoman generator focused in **just plain** PHP development, framework agnostic, scaffolding ready to develop projects with many tools bundled out of the box. You can see a list of all the features it brings together at [BarePHP generator repository](https://github.com/juliangut/generator-barephp)

![BarePHP screenshot](http://juliangut.com/images/20160523-yeoman-php-screenshot.jpg)

BarePHP assumes you work with GIT, Composer and installs by default several QA tools and PHPUnit, all coordinated with Grunt as task runner. All the other tools, from Laravel Homestead usage (with or without PhpMyAdmin) to license selection or integrations with travis, scrutinizer and other services, are completely optional so you don't get installed tools you won't use in the project.

It even creates default boilerplate source code and PHPUnit tests as well as kickoff documentation. I do specially love README file badges, awesome beautiful badges for everything :)

Interested in giving it a try? You should of course have nodeJS and npm installed in the first place:

```
npm install -g yo generator-barephp
mkdir project-name
cd project-name
yo barephp
```

If you think there are improvements to add, tools missing, or anything, get to the [repository](https://github.com/juliangut/generator-barephp) and open an issue, the generator is being actively maintained (It's v0.13 now and I don't know if it will ever reach 1.0).

I've great plans to add many more things:

* Composer packages selection
* Docker integration (Homestead vs Docker selection)
* Gulp integration (Grunt vs Gulp selection)
* Feature/tool based subgenerators
* Fork it into a new mixed frontend-backend generator
