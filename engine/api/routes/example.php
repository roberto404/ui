<?php

/**
 * Content Route Collection
 * Anonymous function return Phalcon Micro-MVC handlers to the ContentControllers
 */

return call_user_func(function() {

	$collection = new \Phalcon\Mvc\Micro\Collection();

	return $collection
		->setPrefix('/v3/example')
		->setHandler('App\Controllers\ExampleController')
		->setLazy(true)

		->get('/', 'exampleAction')
	;
});
