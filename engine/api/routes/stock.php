<?php

return call_user_func(function()
{
	$collection = new \Phalcon\Mvc\Micro\Collection();

	return $collection
		->setPrefix('/v3/stock')
		->setHandler('App\Controllers\StockController')
		->setLazy(true)

    ->get('/match', 'productMatching')
	;
});
