<?php
namespace App\Responses;

use
  \Phalcon\DI\Injectable;


/**
 * Enable $this->di->get(...)
 * This class allows to access services in the services container
 * by just only accessing a public property with the same name of a registered service.
 *
 * Determine head request
 **/
class Response extends Injectable
{
	protected $head = false;

	public function __construct()
	{
		$di = \Phalcon\DI::getDefault();
		$this->setDI($di);

		if (strtolower($this->di->get('request')->getMethod()) === 'head')
    {
			$this->head = true;
		}
	}
}
