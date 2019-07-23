<?php


return call_user_func(function()
{
	$collection = new \Phalcon\Mvc\Micro\Collection();

	return $collection
		->setPrefix('/v3/auth')
		->setHandler('App\Controllers\AuthController')
		->setLazy(true)

		->post('/login', 'loginAction')
		->get('/logout', 'logoutAction')
	;

});
