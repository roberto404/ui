<?php

return call_user_func(function()
{
	$collection = new \Phalcon\Mvc\Micro\Collection();

	return $collection
		->setPrefix('/v3/product')
		->setHandler('App\Controllers\ProductController')
		->setLazy(true)


    ->get('/', 'readAll')
    ->get('/{id:[A-Z0-9]+}', 'readOne')
		// ->post('/', 'createOne')
    ->post('/{id:[A-Z0-9,]+}', 'updateOne')
		// ->delete('/{id:[0-9]+}','deleteOne')

		->post('/checkout', 'checkout')
	;
});
