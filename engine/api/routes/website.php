<?php

/**
 * Content Route Collection
 * Anonymous function return Phalcon Micro-MVC handlers to the ContentControllers
 */

return call_user_func(function() {

	$collection = new \Phalcon\Mvc\Micro\Collection();

	return $collection
		->setPrefix('/v3/website')
		->setHandler('App\Controllers\WebsiteController')
		->setLazy(true)

		->get('/menu', 'readAllMenu')
		->post('/menu/{id:[0-9]+}', 'updateOneMenu')
		->delete('/menu/{id:[0-9]+}','deleteOneMenu')
		->post('/menu', 'createOneMenu')

    // ->get('/{id:[0-9]+}', 'readOne')
	;
});
