<?php

/**
 * File Route Collection
 * Anonymous function return Phalcon Micro-MVC handlers to the ContentControllers
 */

return call_user_func(function() {

	$collection = new \Phalcon\Mvc\Micro\Collection();

	return $collection
		->setPrefix('/v3/file')
		->setHandler('App\Controllers\FileController')
		->setLazy(true)
		// ->options('/', 'optionsBase')
		// ->options('/{id}', 'optionsOne')
    //
    //
    //
		// ->post('/', 'createOne')
		->post('/upload', 'CreateAndResize')
		->get('/download', 'DownloadOne')
		// ->post('/wysiwyg', 'CreateWysiwygImage')
		//->get('/', 'readAllFeature')
		// ->get('/{id:[0-9]+}', 'readOne')
		// ->post('/{id:[0-9]+}', 'updateOne')
		// ->delete('/{id:[0-9]+}','deleteOne')


	;


	//setResponseHeaderBase
	//setResponseHeaderOne
});
