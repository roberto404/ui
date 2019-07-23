<?php

return call_user_func(function()
{
	$collection = new \Phalcon\Mvc\Micro\Collection();

	return $collection
		->setPrefix('/v3/productWebOutlet')
		->setHandler('App\Controllers\ProductWebOutletController')
		->setLazy(true)

    ->get('/', 'readAll')
    ->post('/', 'readAll')
	;
});
