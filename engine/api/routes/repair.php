<?php

/**
 * Content Route Collection
 * Anonymous function return Phalcon Micro-MVC handlers to the ContentControllers
 */

return call_user_func(function() {

	$collection = new \Phalcon\Mvc\Micro\Collection();

	return $collection
		->setPrefix('/v3/repair')
		->setHandler('App\Controllers\RepairController')
		->setLazy(true)

		->get('', 'readAll')
		->post('', 'createProducts')


		->get('/0', 'readConfig')
    // ->get('/{id:[0-9]+}', 'readOne')
    // ->post('/{id:[0-9]+}', 'updateOne')
		// ->delete('/{id:[0-9]+}','deleteOne')
	;
});
