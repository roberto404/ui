<?php

/**
 * Content Route Collection
 * Anonymous function return Phalcon Micro-MVC handlers to the ContentControllers
 */

return call_user_func(function() {

	$collection = new \Phalcon\Mvc\Micro\Collection();

	return $collection
		->setPrefix('/v3/user')
		->setHandler('App\Controllers\UserController')
		->setLazy(true)

		->post('/login', 'loginAction')
		->get('/logout', 'logoutAction')
		->post('/switchAccount', 'switchAccountAction')

    // ->get('/', 'readAll')
    // ->get('/{id:[0-9]+}', 'readOne')
		// ->post('/', 'createOne')
    // ->post('/{id:[0-9]+}', 'updateOne')
		// ->delete('/{id:[0-9]+}','deleteOne')


		// ->post('/registerPassport', 'registerPassportAction')
		// ->get('/chk', 'chkSession')
	;
});
