image: 20150512-environment-quality.png
image-cover: true
tags: git, github
title: Environment quality
subtitle: Not only code needs to be checked
----
On small projects you normally handle all the sides of it, from coding to testing to deployment. I tend to pay really much more attention to the development side, is what I like the most, but there is a matter many deleopers don't consider and it is the environment in which their code is run

Normally sysadmins take care of it but there are simple tasks we can do, and automate on deployment processes

Talking about PHP and what lays around it we have some environment security tools to help us assure our environment is as secured as possible, you can use these tools on production or in your testing machine ([Vagrant](http://juliangut.com/blog/configure-vagrant-hosts-yaml)), all these tools can be installed through [Composer](http://getcomposer.org)

## Iniscan

php.ini file is a source of all sorts of potencial security vulnerabilities, not by itself but because of how pourly and carelessly we manage it. for example leaving open access to functions such as exec or passthru can lead to a disaster, something easily solved with `disable_functions` directive

[iniscan](https://github.com/psecio/iniscan) is a tool by psec.io organization, it allows you to scan your php.ini file searching for security vulnerabilities in the configuration you are using

```
composer require psecio/iniscan

./venndor/bin/iniscan scan --fail-only
Results for /etc/php.ini:
============
Status | Severity | PHP Version | Key                      | Description
----------------------------------------------------------------------
FAIL   | WARNING  |             | session.cookie_domain    | It is recommended that you set the default domain for cookies.
FAIL   | ERROR    | 5.2.0       | session.cookie_httponly  | Setting session cookies to 'http only' makes them only readable by the browser
FAIL   | WARNING  |             | session.hash_function    | Weak hashing algorithms in use. Rather use one of these: sha224, sha256, sha384, sha512, ripemd128, ripemd160, ripemd256, ripemd320, whirlpool, tiger128,3, tiger160,3, tiger192,3, tiger128,4, tiger160,4, tiger192,4, snefru256, gost-crypto, adler32, crc32, crc32b, fnv132, fnv1a32, fnv164, fnv1a64, joaat, haval128,3, haval160,3, haval192,3, haval224,3, haval256,3, haval128,4, haval160,4, haval192,4, haval224,4, haval256,4, haval128,5, haval160,5, haval192,5, haval224,5, haval256,5
FAIL   | ERROR    | 4.0.4       | session.cookie_secure    | Cookie secure specifies whether cookies should only be sent over secure connections.
FAIL   | WARNING  | 5.5.2       | session.use_strict_mode  | Strict mode prevents uninitialized session IDs in the built-in session handling.
FAIL   | ERROR    | 4.0.3       | allow_url_fopen          | Do not allow the opening of remote file resources ('Off' recommended)
FAIL   | WARNING  |             | display_errors           | Don't show errors in production ('Off' recommended)
FAIL   | WARNING  |             | post_max_size            | Unless necessary, a maximum post size of 16M is too large
FAIL   | WARNING  |             | display_startup_errors   | Showing startup errors could provide extra information to potential attackers
FAIL   | WARNING  |             | open_basedir             | Restricting PHP's access to the file system to a certain directory prevents file-based attacks in unauthorized areas.
FAIL   | WARNING  |             | post_max_size            | The max upload size should not be too high, to prevent server overload from large requests
FAIL   | WARNING  |             | memory_limit             | The standard memory limit should not be too high, if you need more memory for a single script you can adjust that during runtime using ini_set()
FAIL   | WARNING  |             | xdebug.default_enable    | Xdebug should be disabled in production
FAIL   | WARNING  |             | disable_functions        | Methods still enabled - exec, passthru, shell_exec, system, proc_open, popen, curl_exec, curl_multi_exec

```

By default most GNU/Linux distributions don't provide the best options possible out of the box, so it is better to have this tool at hand to see what and how should we improve php.ini file

## Versionscan

[versionscan](https://github.com/psecio/versionscan), another tool from psec.io, provides feedback about *actual* PHP vulnerabilities given a PHP version. It is better to be always as updated as possible, but sometimes it is simply not possible so you'd be better knowing what you are not covered from

```
composer require psecio/versionscan

./venndor/bin/versionscan scan
Executing against version: 5.6.4
+--------+---------------+------+------------------------------------------------------------------------------------------------------+
| Status | CVE ID        | Risk | Summary                                                                                              |
+--------+---------------+------+------------------------------------------------------------------------------------------------------+
| FAIL   | CVE-2015-0273 | 0    | Use after free vulnerability in unserialize() with DateTimeZone                                      |
| FAIL   | CVE-2014-9425 | 7.5  | Double free vulnerability in the zend_ts_hash_graceful_destroy function in zend_ts_hash.c in the ... |
| FAIL   | CVE-2015-0232 | 6.8  | The exif_process_unicode function in ext/exif/exif.c in PHP before 5.4.37, 5.5.x before 5.5.21, a... |
| FAIL   | CVE-2014-9427 | 6.4  | sapi/cgi/cgi_main.c in the CGI component in PHP through 5.4.36, 5.5.x through 5.5.20, and 5.6.x t... |
| FAIL   | CVE-2015-0231 | 7.5  | Use-after-free vulnerability in the process_nested_data function in ext/standard/var_unserializer... |
| FAIL   | CVE-2014-9426 | 7.5  | The apprentice_load function in libmagic/apprentice.c in the Fileinfo component in PHP through 5.... |
+--------+---------------+------+------------------------------------------------------------------------------------------------------+

Scan complete
--------------------
Total checks: 315
Failures: 6
```

As a plus you can know the vulnerabilities of any given PHP version, out of curiosity these are the known issues of PHP5.3.3 which is the mimimum version supported by many packagist packages: huge list

```
./venndor/bin/versionscan scan --php-version=5.3.3
Executing against version: 5.3.3
+--------+---------------+------+------------------------------------------------------------------------------------------------------+
| Status | CVE ID        | Risk | Summary                                                                                              |
+--------+---------------+------+------------------------------------------------------------------------------------------------------+
| FAIL   | CVE-2012-1172 | 5.8  | The file-upload implementation in rfc1867.c in PHP before 5.4.0 does not properly handle invalid ... |
| FAIL   | CVE-2012-1171 | 5.0  | The libxml RSHUTDOWN function in PHP 5.x allows remote attackers to bypass the open_basedir prote... |
| FAIL   | CVE-2012-0831 | 6.8  | PHP before 5.3.10 does not properly perform a temporary change to the magic_quotes_gpc directive ... |
| FAIL   | CVE-2012-1823 | 7.5  | sapi/cgi/cgi_main.c in PHP before 5.3.12 and 5.4.x before 5.4.2, when configured as a CGI script ... |
| FAIL   | CVE-2012-2143 | 4.3  | The crypt_des (aka DES-based crypt) function in FreeBSD before 9.0-RELEASE-p2, as used in PHP, Po... |
| FAIL   | CVE-2012-2336 | 5.0  | sapi/cgi/cgi_main.c in PHP before 5.3.13 and 5.4.x before 5.4.3, when configured as a CGI script ... |
| FAIL   | CVE-2012-2335 | 7.5  | php-wrapper.fcgi does not properly handle command-line arguments, which allows remote attackers t... |
| FAIL   | CVE-2012-2311 | 7.5  | sapi/cgi/cgi_main.c in PHP before 5.3.13 and 5.4.x before 5.4.3, when configured as a CGI script ... |
| FAIL   | CVE-2012-0830 | 7.5  | The php_register_variable_ex function in php_variables.c in PHP 5.3.9 allows remote attackers to ... |
| FAIL   | CVE-2012-0789 | 5.0  | Memory leak in the timezone functionality in PHP before 5.3.9 allows remote attackers to cause a ... |
| FAIL   | CVE-2011-4718 | 6.8  | Session fixation vulnerability in the Sessions subsystem in PHP before 5.5.2 allows remote attack... |
| FAIL   | CVE-2011-4153 | 5.0  | PHP 5.3.8 does not always check the return value of the zend_strndup function, which might allow ... |
| FAIL   | CVE-2011-3379 | 7.5  | The is_a function in PHP 5.3.7 and 5.3.8 triggers a call to the __autoload function, which makes ... |
| FAIL   | CVE-2011-4885 | 5.0  | PHP before 5.3.9 computes hash values for form parameters without restricting the ability to trig... |
| FAIL   | CVE-2012-0057 | 6.4  | PHP before 5.3.9 has improper libxslt security settings, which allows remote attackers to create ... |
| FAIL   | CVE-2012-0788 | 5.0  | The PDORow implementation in PHP before 5.3.9 does not properly interact with the session feature... |
| FAIL   | CVE-2012-0781 | 5.0  | The tidy_diagnose function in PHP 5.3.8 might allow remote attackers to cause a denial of service... |
| FAIL   | CVE-2012-2376 | 10.0 | Buffer overflow in the com_print_typeinfo function in PHP 5.4.3 and earlier on Windows allows rem... |
| FAIL   | CVE-2012-2386 | 7.5  | Integer overflow in the phar_parse_tarfile function in tar.c in the phar extension in PHP before ... |
| FAIL   | CVE-2013-4635 | 5.0  | Integer overflow in the SdnToJewish function in jewish.c in the Calendar component in PHP before ... |
| FAIL   | CVE-2013-4248 | 4.3  | The openssl_x509_parse function in openssl.c in the OpenSSL module in PHP before 5.4.18 and 5.5.x... |
| FAIL   | CVE-2013-4113 | 6.8  | ext/xml/xml.c in PHP before 5.3.27 does not properly consider parsing depth, which allows remote ... |
| FAIL   | CVE-2013-6420 | 7.5  | The asn1_time_to_time_t function in ext/openssl/openssl.c in PHP before 5.3.28, 5.4.x before 5.4.... |
| FAIL   | CVE-2014-0237 | 5.0  | The cdf_unpack_summary_info function in cdf.c in the Fileinfo component in PHP before 5.4.29 and ... |
| FAIL   | CVE-2014-4721 | 2.6  | The phpinfo implementation in ext/standard/info.c in PHP before 5.4.30 and 5.5.x before 5.5.14 do... |
| FAIL   | CVE-2014-2497 | 4.3  | The gdImageCreateFromXpm function in gdxpm.c in libgd, as used in PHP 5.4.26 and earlier, allows ... |
| FAIL   | CVE-2014-0238 | 5.0  | The cdf_read_property_info function in cdf.c in the Fileinfo component in PHP before 5.4.29 and 5... |
| FAIL   | CVE-2013-2110 | 5.0  | Heap-based buffer overflow in the php_quot_print_encode function in ext/standard/quot_print.c in ... |
| FAIL   | CVE-2013-1824 | 4.3  | The SOAP parser in PHP before 5.3.22 and 5.4.x before 5.4.12 allows remote attackers to read arbi... |
| FAIL   | CVE-2012-3450 | 2.6  | pdo_sql_parser.re in the PDO extension in PHP before 5.3.14 and 5.4.x before 5.4.4 does not prope... |
| FAIL   | CVE-2012-3365 | 5.0  | The SQLite functionality in PHP before 5.3.15 allows remote attackers to bypass the open_basedir ... |
| FAIL   | CVE-2012-2688 | 10.0 | Unspecified vulnerability in the _php_stream_scandir function in the stream implementation in PHP... |
| FAIL   | CVE-2012-5381 | 6.0  | ** DISPUTED ** Untrusted search path vulnerability in the installation functionality in PHP 5.3.1... |
| FAIL   | CVE-2012-6113 | 5.0  | The openssl_encrypt function in ext/openssl/openssl.c in PHP 5.3.9 through 5.3.13 does not initia... |
| FAIL   | CVE-2013-1643 | 5.0  | The SOAP parser in PHP before 5.3.23 and 5.4.x before 5.4.13 allows remote attackers to read arbi... |
| FAIL   | CVE-2013-1635 | 7.5  | ext/soap/soap.c in PHP before 5.3.22 and 5.4.x before 5.4.13 does not validate the relationship b... |
| FAIL   | CVE-2011-3268 | 10.0 | Buffer overflow in the crypt function in PHP before 5.3.7 allows context-dependent attackers to h... |
| FAIL   | CVE-2011-3267 | 5.0  | PHP before 5.3.7 does not properly implement the error_log function, which allows context-depende... |
| FAIL   | CVE-2010-4700 | 6.8  | The set_magic_quotes_runtime function in PHP 5.3.2 and 5.3.3, when the MySQLi extension is used, ... |
| FAIL   | CVE-2010-4699 | 5.0  | The iconv_mime_decode_headers function in the Iconv extension in PHP before 5.3.4 does not proper... |
| FAIL   | CVE-2010-4698 | 5.0  | Stack-based buffer overflow in the GD extension in PHP before 5.2.15 and 5.3.x before 5.3.4 allow... |
| FAIL   | CVE-2011-0420 | 5.0  | The grapheme_extract function in the Internationalization extension (Intl) for ICU for PHP 5.3.5 ... |
| FAIL   | CVE-2011-0421 | 4.3  | The _zip_name_locate function in zip_name_locate.c in the Zip extension in PHP before 5.3.6 does ... |
| FAIL   | CVE-2011-0753 | 4.3  | Race condition in the PCNTL extension in PHP before 5.3.4, when a user-defined signal handler exi... |
| FAIL   | CVE-2011-0708 | 4.3  | exif.c in the Exif extension in PHP before 5.3.6 on 64-bit platforms performs an incorrect cast, ... |
| FAIL   | CVE-2011-0441 | 6.3  | The Debian GNU/Linux /etc/cron.d/php5 cron job for PHP 5.3.5 allows local users to delete arbitra... |
| FAIL   | CVE-2010-4697 | 6.8  | Use-after-free vulnerability in the Zend engine in PHP before 5.2.15 and 5.3.x before 5.3.4 might... |
| FAIL   | CVE-2010-4645 | 5.0  | strtod.c, as used in the zend_strtod function in PHP 5.2 before 5.2.17 and 5.3 before 5.3.5, and ... |
| FAIL   | CVE-2010-3709 | 4.3  | The ZipArchive::getArchiveComment function in PHP 5.2.x through 5.2.14 and 5.3.x through 5.3.3 al... |
| FAIL   | CVE-2010-3436 | 5.0  | fopen_wrappers.c in PHP 5.3.x through 5.3.3 might allow remote attackers to bypass open_basedir r... |
| FAIL   | CVE-2010-2950 | 6.8  | Format string vulnerability in stream.c in the phar extension in PHP 5.3.x through 5.3.3 allows c... |
| FAIL   | CVE-2010-3710 | 4.3  | Stack consumption vulnerability in the filter_var function in PHP 5.2.x through 5.2.14 and 5.3.x ... |
| FAIL   | CVE-2010-3870 | 6.8  | The utf8_decode function in PHP before 5.3.4 does not properly handle non-shortest form UTF-8 enc... |
| FAIL   | CVE-2010-4409 | 5.0  | Integer overflow in the NumberFormatter::getSymbol (aka numfmt_get_symbol) function in PHP 5.3.3 ... |
| FAIL   | CVE-2010-4150 | 5.0  | Double free vulnerability in the imap_do_open function in the IMAP extension (ext/imap/php_imap.c... |
| FAIL   | CVE-2011-0754 | 4.4  | The SplFileInfo::getType function in the Standard PHP Library (SPL) extension in PHP before 5.3.4... |
| FAIL   | CVE-2011-0755 | 5.0  | Integer overflow in the mt_rand function in PHP before 5.3.4 might make it easier for context-dep... |
| FAIL   | CVE-2011-1657 | 5.0  | The (1) ZipArchive::addGlob and (2) ZipArchive::addPattern functions in ext/zip/php_zip.c in PHP ... |
| FAIL   | CVE-2011-1471 | 4.3  | Integer signedness error in zip_stream.c in the Zip extension in PHP before 5.3.6 allows context-... |
| FAIL   | CVE-2011-1470 | 4.3  | The Zip extension in PHP before 5.3.6 allows context-dependent attackers to cause a denial of ser... |
| FAIL   | CVE-2011-1938 | 7.5  | Stack-based buffer overflow in the socket_connect function in ext/sockets/sockets.c in PHP 5.3.3 ... |
| FAIL   | CVE-2011-2202 | 6.4  | The rfc1867_post_handler function in main/rfc1867.c in PHP before 5.3.7 does not properly restric... |
| FAIL   | CVE-2011-3189 | 4.3  | The crypt function in PHP 5.3.7, when the MD5 hash type is used, returns the value of the salt ar... |
| FAIL   | CVE-2011-3182 | 5.0  | PHP before 5.3.7 does not properly check the return values of the malloc, calloc, and realloc lib... |
| FAIL   | CVE-2011-2483 | 5.0  | crypt_blowfish before 1.1, as used in PHP before 5.3.7 on certain platforms, PostgreSQL before 8.... |
| FAIL   | CVE-2011-1469 | 4.3  | Unspecified vulnerability in the Streams component in PHP before 5.3.6 allows context-dependent a... |
| FAIL   | CVE-2011-1468 | 4.3  | Multiple memory leaks in the OpenSSL extension in PHP before 5.3.6 might allow remote attackers t... |
| FAIL   | CVE-2011-1153 | 7.5  | Multiple format string vulnerabilities in phar_object.c in the phar extension in PHP 5.3.5 and ea... |
| FAIL   | CVE-2011-1148 | 7.5  | Use-after-free vulnerability in the substr_replace function in PHP 5.3.6 and earlier allows conte... |
| FAIL   | CVE-2011-1092 | 7.5  | Integer overflow in ext/shmop/shmop.c in PHP before 5.3.6 allows context-dependent attackers to c... |
| FAIL   | CVE-2011-1398 | 4.3  | The sapi_header_op function in main/SAPI.c in PHP before 5.3.11 and 5.4.x before 5.4.0RC2 does no... |
| FAIL   | CVE-2011-1464 | 4.3  | Buffer overflow in the strval function in PHP before 5.3.6, when the precision configuration opti... |
| FAIL   | CVE-2011-1467 | 5.0  | Unspecified vulnerability in the NumberFormatter::setSymbol (aka numfmt_set_symbol) function in t... |
| FAIL   | CVE-2011-1466 | 5.0  | Integer overflow in the SdnToJulian function in the Calendar extension in PHP before 5.3.6 allows... |
| FAIL   | CVE-2006-7243 | 5.0  | PHP before 5.3.4 accepts the \0 character in a pathname, which might allow context-dependent atta... |
+--------+---------------+------+------------------------------------------------------------------------------------------------------+

Scan complete
--------------------
Total checks: 315
Failures: 75
```

Be aware though that versionscan works on a static issue database to check PHP vulnerabilities, it doesn't look into your actual ./usr/bin/php, so depending on the distro you use you might have modification on the oficial PHP and some of these issues may not apply to you. The maintainers of the project seams to be working on improving this part

## Security-checker

Opposite to the previous two, [security-checker](https://github.com/sensiolabs/security-checker) by SensioLabs doesn't check PHP or its configuration but security issues on your dependencies, really neat to help you (or force you) to update your dependencies

Lets assume we have this composer.json file
```json
{
  "require": {
    "php": ">=5.4",
    "monolog/monolog": "1.10",
    "twig/twig": "1.12"
  }
}

```

Then

```
composer require sensiolabs/security-checker

./vendor/bin/security-checker security:check
Security Check Report
~~~~~~~~~~~~~~~~~~~~~

Checked file: /home/julian/Develop/tests/composer.lock

                                         
  [CRITICAL]                             
  2 packages have known vulnerabilities  
                                         

monolog/monolog (1.10.0)
------------------------

 * Header injection in NativeMailerHandler
   https://github.com/Seldaek/monolog/pull/448#issuecomment-68208704

twig/twig (v1.12.0)
-------------------

 * Vulnerability in the filesystem loader
   http://blog.twig.sensiolabs.org/post/47461911874/security-release-twig-1-12-3-released

             This checker can only detect vulnerabilities that are referenced
 Disclaimer  in the SensioLabs security advisories database. Execute this
             command regularly to check the newly discovered vulnerabilities.
```

There you have it, you should be updating both monolog and twig dependencies to a newer version.

This tool frees you from keeping track of other's libraries security issues, just run this tool periodically and see what it yields, of course it has its limitations but it is a workless starting point

## Automation

And this leads me to the lasting point, atomating this tools execution on deployment lets you forget about them, they won't interfere in your daily workload and still be there to check your environment when the dreaded day of production comes

As I personally use [Grunt](http://gruntjs.com/) as my prefered task runner, doesn't matter it is written in node its just fine to be used for PHP, I've created three Grunt tasks so these tools can be introduce in deployment processes or any process involving Grunt

* [grunt-iniscan](https://www.npmjs.com/package/grunt-iniscan)
* [grunt-versionscan](https://www.npmjs.com/package/grunt-versionscan)
* [grunt-security-checker](https://www.npmjs.com/package/grunt-security-checker)
