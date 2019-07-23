<?php

namespace App\Exceptions;

use
  Phalcon\Logger as Logger,
  Phalcon\Logger\Adapter\File as FileLogger;


/**
 * Custom exception. Create API standard response and logging exception,
 * which depends on settings of log level.
 * @example
 * use \App\Exceptions\HTTPException;
 * throw new HTTPException(
 *   'Message which appear on the client',
 *   404,
 *   array(
 *     'code' => 'public.code',
 *     'more' => 'Public alternative message',
 *     'level' => 'notice|emergency ...',
 *     'dev' => 'array'
 *   )
 * );
 */
class HTTPException extends \Exception
{
  /**
   * Alias level.
   * Determine level of exception. Level hierarchy: emergency > error > warning > notice.
   * If application.logLevel = error, then disable warning and notice logging.
   * If http status code >500, log level automatically emergency.
   * @var string
   */
  public $logLevel;
  /**
   * Alias dev.
   * Developer info appear only the log file.
   * @var array|string
   */
	public $errorInfo;
  /**
   * Alias code.
   * Internal application error code. Visible for the client.
   * @var string
   */
	public $errorCode;
  /**
   * Alias more.
   * Alternative public message.
   * @var string
   */
  public $userInfo;
  /**
   * Alias title of Http status code
   * @var string
   */
	public $response;


	public function __construct($message, $code, $error = array())
	{
		$this->message = $message;
		$this->code = $code;

		$this->userInfo = (isset($error['more'])) ? $error['more'] : '';
		$this->errorInfo = (isset($error['dev'])) ? $error['dev'] : '';
		$this->errorCode = (isset($error['code'])) ? $error['code'] : '';
		$this->response = $this->getResponseDescription($code);
		$this->logLevel = $this->getLevel((isset($error['level'])) ? $error['level'] : $code);
	}

  /**
   * Send \App\Responses to user { code, message, more } and create log record
   * via HTTPExceptionTemplate. Response format depends on user request (responseType).
   */
	public function send()
	{

		$di = \Phalcon\DI::getDefault();

		$response = $di->get('response');
		$request = $di->get('request');

    // if you get back 200 status code send this header
		if (!$request->get('suppress_response_codes', null, null))
		{
			$response->setStatusCode($this->getCode(), $this->response)->sendHeaders();
		}
		else
		{
			$response->setStatusCode('200', 'OK')->sendHeaders();
		}

		$message = array(
			'code' => $this->errorCode,
			'message' => $this->getMessage(),
      'more' => $this->userInfo
		);

    $logfile = DOCUMENT_ROOT . 'logs/exception.log';

    if ( is_writable(DOCUMENT_ROOT . 'logs'))
    {
      if (!is_file($logfile))
      {
         touch($logfile);
      }

      $logger = new FileLogger($logfile);

      $logger->setLogLevel($this->getLevel($di->get('config')->application->logLevel));

      $vars = array(
        'errorInfo' => json_encode($this->errorInfo),
        'errorFile' => $this->getFile(),
        'errorLine' => $this->getLine(),
        'requestUri' => $_SERVER['REQUEST_URI'],
        'requestMethod' => $_SERVER['REQUEST_METHOD'],
        'requestParams' => json_encode($_REQUEST),
        'referer' => isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '',
        'ip' => $_SERVER['REMOTE_ADDR']
      );

      $logger
        ->log(
          $this->logLevel,
          include('HTTPExceptionTemplate.php'),
          array_merge($message, $vars)
        )
        ->close();
    }
    else
    {
      $message['message'] = 'Log directory missing.';
    }

    switch ($request->get('responseType'))
    {
      case 'csv':
        $response = new \App\Responses\CSVResponse();
        $response
          ->useHeaderRow(false)
          ->send(array($message));
        break;

      case 'json':
      default:
        $response = new \App\Responses\JSONResponse();
        $response
          ->useEnvelope(true)
          ->send(null, $message, true);
        break;
    }

		return;
	}

  /**
   * Respond title of HTTP status code
   * @param  int $code HTTP Status code
   * @return string       ['Unknown Status Code'] Title of HTTP Status code
   * @example
   * getResponseDescription(500)
   * //=> 'Internal Server Error'
   */
	protected function getResponseDescription($code)
	{
		$codes = array(

			// Informational 1xx
			100 => 'Continue',
			101 => 'Switching Protocols',

			// Success 2xx
			200 => 'OK',
			201 => 'Created',
			202 => 'Accepted',
			203 => 'Non-Authoritative Information',
			204 => 'No Content',
			205 => 'Reset Content',
			206 => 'Partial Content',

			// Redirection 3xx
			300 => 'Multiple Choices',
			301 => 'Moved Permanently',
			302 => 'Found',
			303 => 'See Other',
			304 => 'Not Modified',
			305 => 'Use Proxy',
			// 306 is deprecated but reserved
			307 => 'Temporary Redirect',

			// Client Error 4xx
			400 => 'Bad Request',
			401 => 'Unauthorized',
			402 => 'Payment Required',
			403 => 'Forbidden',
			404 => 'Not Found',
			405 => 'Method Not Allowed',
			406 => 'Not Acceptable',
			407 => 'Proxy Authentication Required',
			408 => 'Request Timeout',
			409 => 'Conflict',
			410 => 'Gone',
			411 => 'Length Required',
			412 => 'Precondition Failed',
			413 => 'Request Entity Too Large',
			414 => 'Request-URI Too Long',
			415 => 'Unsupported Media Type',
			416 => 'Requested Range Not Satisfiable',
			417 => 'Expectation Failed',

			// Server Error 5xx
			500 => 'Internal Server Error',
			501 => 'Not Implemented',
			502 => 'Bad Gateway',
			503 => 'Service Unavailable',
			504 => 'Gateway Timeout',
			505 => 'HTTP Version Not Supported',
			509 => 'Bandwidth Limit Exceeded'
		);

		$result = (isset($codes[$code])) ?
			$codes[$code] :
			'Unknown Status Code';

		return $result;
	}

  /**
   * Transform level name to Phalcon Logger.
   * @param  string $level title of $level
   * @return Phalcon\Logger
   */
  protected function getLevel($level)
  {
    switch (strtolower($level))
    {
      case 'emergency':
        return Logger::EMERGENCY;

      case 'error':
        return Logger::ERROR;

      case 'warning':
        return Logger::WARNING;

      case 'notice':
        return Logger::NOTICE;

      default:
        if ($level >= 500)
        {
          return Logger::EMERGENCY;
        }
        return Logger::ERROR;
    }
  }
}
