<?php

return call_user_func(function()
{
	$collection = new \Phalcon\Mvc\Micro\Collection();

	return $collection
		->setPrefix('/v3/productWeb')
		->setHandler('App\Controllers\ProductWebController')
		->setLazy(true)

    ->get('/', 'readAll')
    ->post('/', 'readAll')
	;
});
