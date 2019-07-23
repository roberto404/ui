<?php


return call_user_func(function()
{
	$collection = new \Phalcon\Mvc\Micro\Collection();

	return $collection
		->setPrefix('/v3/dictionary')
		->setHandler('App\Controllers\DictionaryController')
		->setLazy(true)


    ->get('/', 'readAll')
    ->get('/{id:[0-9]+}', 'readOne')
		// ->post('/', 'createOne')
    ->post('/{id:[0-9]+}', 'updateOne')
		// ->delete('/{id:[0-9]+}','deleteOne')
	;
});
