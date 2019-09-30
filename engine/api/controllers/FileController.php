<?php
namespace App\Controllers;

use
  \App\Models\Files,
  \App\Exceptions\HTTPException;


class FileController extends BaseController
{
  protected $model = 'App\Models\Files';
  protected $listFields = 'id, status, title';
  protected $fetchFields = array(
    'title',
    'lead',
    'path',
  );

  /**
   * @example
   * ?ext=jpg|png&size=1M
   * ?resize=[{"size":"200x200"}]&path=products/NK2/NK21111&name=abc2
   */
  public function CreateOne($fetchFields = array())
  {
    $results = [];

    $request 	= $this->di->get('request');

    if (!$request->isPost() || !$this->request->hasFiles())
    {
      throw new HTTPException(
        'Method Not Allowed',
        405,
        array(
          'level' => 'emergency',
          'code' => 'controller.file.create.nofile',
          'dev' => array('message' => 'No post file')
        )
      );
    }

    foreach ($this->request->getUploadedFiles() as $uploadedFile)
    {
      $ext = array('jpg', 'jpeg', 'png', 'gif', 'pdf');

      if ($request->has('ext'))
      {
        $ext = explode('|', $request->get('ext'));
      }

      $size = '100MB';

      if ($request->has('size'))
      {
        $size = $request->get('size');
      }

      $this->file = new Files();
      $this->file->name = $request->get('name');
      $this->file->path = $request->get('path');
      $this->file->lead = $request->get('lead');

      if (
        !$this->file->saveUploadedFile(
          $uploadedFile,
          array(
            'ext' => $ext,
            'size' => $size,
          )
        )
      )
      {
        return $this->respond(false);
      }

      $results[] = array(
        "id" => $this->file->id,
        "title" => $this->file->name,
        "type" => $this->file->mime_minor,
        "url" => $this->file->getPublicFullPath()
      );
    }

    return sizeof($results) === 1 ? $results[0] : $results;
  }

	/**
	 * Create file and if the request has resize get param create resized clone image
	 * 180x180 thumbnail automaticly created
	 * @example
	 * ?resize=[{"size":"200x200"},{"size":"36x36","fitWidthIn":"width","aspectRatio":"1","devicePixelRatio":"4"}]
	 *
	 * dir=upload/products/NK2/NK21111
	 */
	public function CreateAndResize()
	{
		if ($respond = $this->CreateOne())
		{
			$request 	= $this->di->get('request');

			if ($request->has('resize'))
			{
				$resizeOptions = json_decode($request->get('resize'), true);

				if (sizeof($resizeOptions))
				{
					$resizedImages = array();

					foreach ($resizeOptions as $key => $value)
					{
						if (!isset($value['size']))
            {
              continue;
            }

						$resizedImage = $this->file->resizeImage(array(
							'size' => $value['size'],
							'fitWidthIn' => isset($value['fitWidthIn']) ? $value['fitWidthIn'] : 'width',
							'aspectRatio' => isset($value['aspectRatio']) ? $value['aspectRatio'] : 1,
							'devicePixelRatio' => isset($value['devicePixelRatio']) ? $value['devicePixelRatio'] : 4,
						));

						if ($resizedImage)
            {
              $resizedImages[] = $resizedImage;
            }
					}
				}
			}

			return $this->file->toArray();
		}
		else
			return false;
	}


  public function DownloadOne()
  {
    $contentTypes = array(
      'gif' => 'image/gif',
      'png' => 'image/png',
      'jpg' => 'image/jpg',
      'jpeg' => 'image/jpeg',
    );

    $request 	= $this->di->get('request');

    // slug name

    if ($request->has('file'))
    {
      $pattern = '/-([0-9]+)(_[0-9]+x[0-9]+)?(@[2-9]{1}x)?\.(jpg|png)$/';
      preg_match($pattern, $request->get('file'), $matches);

      if (count($matches) === 5)
      {
        list($match, $id, $size, $dpr, $ext) = $matches;

        $file = new Files();
        $file->id = $id;
        $file->setName();
        $file->name .= $size.$dpr;
        $file->ext = $ext;

        if (\is_file($file->getPhysicalFullPath()))
        {
          header('Content-type: ' . $contentTypes[$ext]);
          echo \file_get_contents($file->getPhysicalFullPath());
          die();
        }
        else
        {
          $file->physicalFullPath = '';
          $file->setName();

          if (\is_file($file->getPhysicalFullPath()))
          {
            $file->resizeImage(array(
              'size' => \substr($size, 1),
              'devicePixelRatio' => 4,
            ));

            $file->name .= $size.$dpr;
            $file->physicalFullPath = '';

            header('Content-type: ' . $contentTypes[$ext]);
            echo \file_get_contents($file->getPhysicalFullPath());
            die();
          }
        }
      }
    }

    // direct link

    $pattern = '/([0-9a-f]{32})(_[0-9]+x[0-9]+)(@[2-9]{1}x)?\.(jpg|png)$/';
    preg_match($pattern, $request->get('file'), $matches);


    if (count($matches) === 5)
    {
      list($match, $hash, $size, $dpr, $ext) = $matches;

      $file = new Files();
      $file->name = $hash;
      $file->ext = $ext;
      // $file->setName();
      // $file->name .= $size.$dpr;
      //

      if (\is_file($file->getPhysicalFullPath()))
      {
        $file->resizeImage(array(
          'size' => \substr($size, 1),
          'devicePixelRatio' => 4,
        ));

        $file->name .= $size.$dpr;
        $file->physicalFullPath = '';

        header('Content-type: ' . $contentTypes[$ext]);
        echo \file_get_contents($file->getPhysicalFullPath());
        die();
      }

    }

    throw new HTTPException(
      'File not found',
      404,
      array(
        'code' => 'controller.file.downloadone.nofile',
      )
    );
  }
}
