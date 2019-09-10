<?php

return call_user_func(function()
{
	$collection = new \Phalcon\Mvc\Micro\Collection();

	return $collection
		->setPrefix('/v3/analytics')
		->setHandler('App\Controllers\AnalyticsController')
		->setLazy(true)

    ->get('/', 'readAll')
	;
});
