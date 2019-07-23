<?php

return call_user_func(function()
{
	$collection = new \Phalcon\Mvc\Micro\Collection();

	return $collection
		->setPrefix('/v3/loyality')
		->setHandler('App\Controllers\LoyalityController')
		->setLazy(true)

    ->post('/totalAmount', 'TotalAmount')
	;
});
