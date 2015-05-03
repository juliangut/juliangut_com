<?php

use Baun\Baun;

require dirname(__DIR__) . '/vendor/autoload.php';

define('BASE_PATH', dirname(__DIR__) . '/');

$baun = (new Baun())->run();
