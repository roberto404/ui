<?php

/**
 * filterLoader loads a set of Phalcon Filters from
 * the collections directory.
 *
 * php files in the collections directory must return Collection objects only.
 */

return call_user_func(function()
{
	$collections = array();
	$collectionFiles = scandir(dirname(__FILE__) . '/collections');

	foreach($collectionFiles as $collectionFile)
    {
		$pathinfo = pathinfo($collectionFile);
        
		//Only include php files
		if ( $pathinfo['extension'] === 'php')
        {
			require_once(dirname(__FILE__) .'/collections/' . $collectionFile);
            $collections[$pathinfo['filename']] = new $pathinfo['filename']();
		}
	}

	return $collections;
});
