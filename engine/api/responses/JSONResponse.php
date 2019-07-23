<?php

namespace App\Responses;


class JSONResponse extends Response
{
	/**
	 * Enabled envelope mode.
	 * Client request able to disable via get request envelop=false
	 * @var boolean [true]
	 */
	protected $envelope = true;

	public function __construct()
  {
		parent::__construct();
	}

	/**
	 * Send response to client. Use envelop mode { status, version, count, records ...meta }
	 * or parent constructor determine head request send only headers.
	 * @param  array $records response body or envelop mode body.records
	 * @param  array  $meta    additional envelope data
	 * @param  boolean  $error    determine X-Status header [ERROR|SUCCESS], and it appear on envelope mode { status }
	 * @return JSONResponse          this
	 */
	public function send($records, $meta = array(), $error = false)
	{
    $response = $this->di->get('response');

		if (!\sizeof($meta))
		{
			$meta['config'] = [];
		}

		// Error's come from HTTPException. This helps set the proper data.
		$success = ($error) ? 'ERROR' : 'SUCCESS';

		// If the query string 'envelope' is set to false, do not use the envelope.
		// Instead, return headers.
		$request = $this->di->get('request');

		if ($request->get('envelope', null, null) === 'false')
    {
			$this->envelope = false;
		}

		$etag = md5(serialize($records));

		if ($this->envelope)
		{
			// Provide an envelope for JSON responses.
			$message = array_merge(
				$meta,
				array(
					'status' => $success,
	        'version' => $this->config->manifest->version,
					'count' => ($error) ? 1 : count($records),
					'config' => (isset($this->di->get('registry')->config)) ? $this->di->get('registry')->config : (isset($meta['config']) ? $meta['config'] : '' ),
				)
			);

			// Handle 0 record responses, or assign the records
			// if ($message['count'] === 0)
			// {
			// 	// This is required to make the response JSON return an empty JS object.  Without
			// 	// this, the JSON return an empty array:  [] instead of {}
			// 	$message['records'] = new \stdClass();
			// } else {
				$message['records'] = $records;
			// }

		}
    else
		{
			$response->setHeader('X-Records', count($records));
			$response->setHeader('X-Status', $success);
			$response->setHeader('X-Version', $this->config->manifest->version);
			$message = $records;
		}

		$response->setContentType('application/json');
		$response->setHeader('E-Tag', $etag);

		// HEAD requests are detected in the parent constructor. HEAD does everything exactly the
		// same as GET, but contains no body.
		if(!$this->head)
		{
			$response->setJsonContent($message);
		}

		$response->send();

		return $this;
	}

	public function useEnvelope($envelope)
	{
		$this->envelope = (bool) $envelope;
		return $this;
	}

}
