<?php
namespace App\Models;

use
  Phalcon\Mvc\Model,
  Phalcon\Image\Adapter\Imagick as Image,
  \App\Exceptions\HTTPException;


/*
HTTPexception nem jo. model exception kell ami trazakciot rollbackeli, model errort hoz letre. Ezt kellene httpexceptionnak elkapni
 */

class Files extends Model
{
	public $id;
	public $title;
	public $path;
	public $name;
	public $ext;
	public $lead;
	public $size;
	public $mimeMajor;
	public $mimeMinor;

	public $physicalPath;
	public $physicalFullPath;
	public $publicPath;
	public $publicFullPath;

	private $basePath = './';
	private $baseFolder = 'library/';

	protected $chmod = 0777;
	protected $key = 'f4cDFa';

  protected $availableExt = array('jpg', 'jpeg', 'png', 'gif', 'pdf', 'csv');


  /* !- Methods of LifeCycles */

  public function onConstruct()
  {
  	$di = \Phalcon\DI::getDefault();

    $this->basePath = DOCUMENT_ROOT . $di->get('config')->application->publicDir . '/' . $di->get('config')->application->uploadDir . '/';

    if (!realpath($this->basePath))
    {
      throw new HTTPException(
				"File uploading Error",
				500,
				array(
          'code' => 'api.model.files.construct.basepath',
					'dev' => array(
            'dirNotExist' => $this->basePath
          ),
			));
    }
  }


  /* !- Getter & Setter */

  public function getId()
  {
		if (!$this->id)
    {
			$this->setId();
		}

		return $this->id;
	}


	public function setId($id)
  {
		if (!is_int($id))
    {
			throw new HTTPException(
				"File uploading Error",
				500,
				array(
					'dev' => 'id is not a number: '.$id,
					'internalCode' => 'Model\Files\setId',
					'more' => ''
			));
		}

		$this->id = $id;
	}


	public function getPath()
  {
		if (!$this->path)
    {
			$this->setPath();
		}

		return $this->path;
	}


	private function setPath($hash=false)
  {
		if (!$hash)
    {
      $hash = $this->getName();
    }

		if (!$hash || strlen($hash) < 6)
    {
			throw new HTTPException(
				"File uploading Error",
				500,
				array(
					'dev' => 'hash is not valid: '.$hash,
					'internalCode' => 'Model\Files\setPath',
					'more' => ''
			));
		}

		$path	= "";

		for ($n=0; $n < 7; $n+=2) {
			$path .= substr($hash, $n, 2).'/';
		}

		$this->path = $path;
	}


	public function getName()
  {
		if (!$this->name)
    {
			$this->setName();
		}

		return $this->name;
	}


	public function setName()
  {
		if (!$this->key || !$this->id)
    {
			throw new HTTPException(
				"File uploading Error",
				500,
				array(
					'dev' => 'key or id not set',
					'internalCode' => 'Model\Files\setName',
					'more' => ''
			));
		}

		$this->name = md5($this->key.$this->id);
	}


	public function getPhysicalPath() {

		if (!$this->physicalPath) {
			$this->setPhysicalPath();
		}

		return $this->physicalPath;

	}


	public function setPhysicalPath()
	{
    $basePath = realpath($this->basePath) . '/';

    if ( !is_writable($basePath) )
    {
			throw new HTTPException(
				"File uploading Error",
				500,
				array(
					'dev' => 'Files path not ready: ' . $basePath,
					'internalCode' => 'Model\Files\initialize'
			  )
      );
    }

    foreach (explode('/', $this->getPath()) as $path)
    {
      if (strlen($path) < 1)
      {
        continue;
      }

    	$basePath .= $path.'/';

			if ( !is_dir($basePath) )
      {
				if ( !mkdir($basePath, $this->chmod) )
        {
					throw new HTTPException(
						"File uploading Error",
						500,
						array(
							'dev' => 'cannot create physicalPath: ' . $basePath,
							'internalCode' => 'Model\Files\setPhysicalPath'
					  )
          );
				}
			}
		}

		$this->physicalPath = $basePath;
	}



	public function getPhysicalFullPath()
  {
		if (!$this->physicalFullPath)
    {
			$this->setPhysicalFullPath();
		}

		return $this->physicalFullPath;
	}


	public function setPhysicalFullPath()
  {
		$this->physicalFullPath = $this->getPhysicalPath().$this->getName().'.'.$this->ext;
	}


	public function getPublicPath()
  {
		if (!$this->publicPath)
    {
      $this->setPublicPath();
    }

		return $this->publicPath;
	}

	public function setPublicPath()
  {
		$this->publicPath = '/'.$this->baseFolder.$this->getPath();
	}



	public function getPublicFullPath() {

		if (!$this->publicFullPath)
			$this->setPublicFullPath();

		return $this->publicFullPath;
	}

	public function setPublicFullPath() {

		$this->publicFullPath = $this->getPublicPath().$this->getName().'.'.$this->ext;
	}

	public function getPostMaxSize($max = 0)
	{
		if (!$max) $max = '100M';

		return
			min(
				$this->convertHumanToBytes(ini_get('post_max_size')),
				$this->convertHumanToBytes(ini_get('upload_max_filesize')),
				$this->convertHumanToBytes($max)
			);
	}




  /* !- Public methods */


  public function saveUploadedFile($uploadedFile, $validation=false)
  {
  	if ($uploadedFile->getError())
    {
			throw new HTTPException(
				"File uploading Error",
				500,
				array(
          'level' => 'emergency',
          'code' => 'api.model.files.save.upload',
          'dev' => array(
            'uploadErrorCode' => $uploadedFile->getError(),
            'uploadMaxSize' => ini_get('upload_max_filesize'),
            'uploadedFile' => (array) $uploadedFile,
          )
			));
		}

  	// setter

	  $this->title = $uploadedFile->getName();
	  $this->ext = strtolower($uploadedFile->getExtension());
	  $this->size = $uploadedFile->getSize();

  	list($this->mimeMajor, $this->mimeMinor) =
  		explode('/', $uploadedFile->getRealType());

		if (property_exists($uploadedFile, 'lead'))
    {
      $this->lead = $uploadedFile->lead;
    }

  	// validation: ext, size (must have)

	  if (
      !$validation
      || !isset($validation['ext'])
      || !is_array($validation['ext'])
      || !in_array($this->ext, $validation['ext'])
      || !in_array($this->ext, $this->availableExt)
    )
    {
			throw new HTTPException(
				"File uploading Error",
				500,
				array(
          'level' => 'emergency',
          'code' => 'api.model.files.save.validationExt',
          'dev' => array(
            'validationExt' => $validation['ext'],
            'availableExt' => $this->availableExt,
            'uploadedFile' => (array) $uploadedFile,
          )
			));
		}


		if (!isset($validation['size']))
    {
      $validation['size'] = 0;
    }

		if ($this->size > $this->getPostMaxSize($validation['size']))
    {
			throw new HTTPException(
				"File uploading Error",
				500,
				array(
          'level' => 'emergency',
          'code' => 'api.model.files.save.validationSize',
          'dev' => array(
            'fileSize' => $this->size,
            'validationSize' => $validation['size'],
            'postMaxSize' => $this->getPostMaxSize($validation['size']),
          )
			));
		}

  	// save to db

		if ($this->create() == false)
    {
			throw new HTTPException(
				"File uploading Error",
				500,
				array(
          'level' => 'emergency',
          'code' => 'api.model.files.save.db',
          'dev' => array(
            'dbError' => (array) $this->getMessages()[0]->getMessage(),
          )
        )
      );
		}

  	// move and rename
  	//

		if (
			is_file($this->getPhysicalFullPath()) ||
			!move_uploaded_file($uploadedFile->getTempName(), $this->getPhysicalFullPath())
		)
    {
      // remove from db
			$this->delete();

			throw new HTTPException(
				"File uploading Error",
				500,
				array(
          'level' => 'emergency',
          'code' => 'api.model.files.save.rename',
          'dev' => array(
            'fileExistYet' => is_file($this->getPhysicalFullPath()),
            'newPath' => $this->getPhysicalFullPath(),
          )
        )
			);
		}

		return true;
  }


    public function convertHumanToBytes($size)
    {
    	$size = str_replace(array(" ", ",", "."), '', $size);
	    preg_match("/([0-9]+)(.*)/", $size, $match);
	    list($size, $value, $measure) = $match;

	    switch(strtolower($measure))
	    {
	        case 'g':
	        case 'gb':
	        case 'gbyte':
	            $value *= 1024;

	        case 'm':
	        case 'mb':
	        case 'mbyte':
	            $value *= 1024;

	        case 'k':
	        case 'kb':
	        case 'kbyte':
	            $value *= 1024;
	    }

	    return $value;
    }


    // !HTTP exeption helyet false es a controllerbe kell az execption



	/**
	 * This method crop and resize image model
	 *
	 * @method resizeImage
	 * @param {array} options Properties of resize process: size, resizeMethod, aspectRatio, fitWidthIn
	 * @param {string} [outputFileName] file name
	 * @return string outputFileName
	 */

  public function resizeImage($options, $outputFileName = false)
  {
  	// validation

  	if (!is_readable($this->getPhysicalFullPath()))
    {
      throw new HTTPException(
        "File resizing Error",
        400,
        array(
          'code' => 'api.model.files.resizeImage.file',
          'dev' => array(
            'file' => $this->getPhysicalFullPath(),
          )
      ));
    }

    /**
     * 1 GIF, 2 JPEG, 3 PNG, 6 BMP
     */
  	$imageType = exif_imagetype($this->getPhysicalFullPath());

    if (!$imageType || ($imageType > 3 && $imageType !== 6))
    {
      throw new HTTPException(
        "File resizing Error",
        400,
        array(
          'code' => 'api.model.files.resizeImage.image',
          'dev' => array(
            'imageType' => $imageType,
          )
      ));
    }


  	// setup output

  	if (!$outputFileName && isset($options['size']))
    {
  		$outputFileName = $this->getName().'_'.$options['size'].".".$this->ext;
    	$outputFullPath = $this->getPhysicalPath().$outputFileName;
    }
    else
    {
      throw new HTTPException(
        "File resizing Error",
        400,
        array(
          'code' => 'api.model.files.resizeImage.size',
          'dev' => array(
            'options' => $options,
          )
      ));
    }


  	// gd process

		if (
			list($cropWidth, $cropHeight, $cropOffsetX, $cropOffsetY, $resizeWidth, $resizeHeight, $resizeOptions) =
				$this->getCropAndResize($options)
		)
    {
      $devicePixelRatio = $options['devicePixelRatio'] ?: 1;

      for ($i=1; $i<=$devicePixelRatio; $i++)
      {
        // cannot clone Phalcon Adapter
        $image = new Image($this->getPhysicalFullPath());

        if ($cropWidth && $cropHeight)
        {
          $image->crop($cropWidth, $cropHeight, $cropOffsetX, $cropOffsetY);
        }

        $image->resize($resizeWidth * $i, $resizeHeight * $i);

        if (!$image->save($i === 1 ? $outputFullPath : str_replace(".", "@{$i}x.", $outputFullPath), 95))
        {
          throw new HTTPException(
            "File resizing Error",
            500,
            array(
              'code' => 'api.model.files.resizeImage.save',
          ));
        }

        // destruct destroys the loaded image to free up resources.
        $image = null;
      }

			return array(
				'resizeWidth' => $resizeWidth,
				'resizeHeight' => $resizeHeight,
				'resizeOptions' => $resizeOptions,
				'filePath' => $this->getPublicPath() . $outputFileName,
				'fileName' => $outputFileName,
			);
		}

    throw new HTTPException(
      "File resizing Error",
      400,
      array(
        'code' => 'api.model.files.resizeImage.options',
        'dev' => array(
          'options' => $options,
          'outputFileName' => $outputFileName,
        )
    ));
  }




	/**
	 * This method calculate crop width and height, crop x and y offsets, resize width and height
	 *
	 * From these options:
	 * -------------------
	 * size:
	 * resizeMethod: '(enlarge or reduce)', 'reduce', 'enlarge'
	 * aspectRatio: 'true', 'false';
	 * fitwidthin: '(width and height)', 'width', 'height'
	 *
	 * Description of these options:
	 * -----------------------------
	 * size: destination pixel dimension
	 * resizeMethod: enable the image reduce and/or enlarge for the process
	 * aspectRatio: keep the aspect ratio of the original dimenson
	 * fitWidthIn: the output width or height will be the destination value
	 *
	 * @method getCropAndResize
	 * @param {array} options Properties of resize process: size, resizeMethod, aspectRatio, fitWidthIn
	 * @return array Value of crop and resize: cropWidth, cropHeight, cropOffsetX, cropOffsetY, resizeWidth, resizeHeight
	 */

  private function getCropAndResize($options)
  {
    // validate

    if (!isset($options['size']))
    {
      return false;
    }

  	// setup

		$sourceSize = getimagesize($this->getPhysicalFullPath());
		list($_x1, $_y1) = $sourceSize;

		list($_x2, $_y2) = explode('x', $options['size']);

		$_c1 = $_c2 = $_c3 = $_c4 = 0;
		$_r1 = $_x2 / $_x1;
		$_r2 = $_y2 / $_y1;

		if (!isset($options['aspectRatio'])) $options['aspectRatio'] = 1;
		if (!isset($options['resizeMethod'])) $options['resizeMethod'] = 'reduce';
		if (!isset($options['fitWidthIn'])) $options['fitWidthIn'] = '';


		// calculate

		if (
			( $options['resizeMethod'] == 'reduce' && ( $_x2 < $_x1 || $_y2 < $_y1 ) ) ||
			( $options['resizeMethod'] == 'enlarge' && ( $_x2 > $_x1 || $_y2 > $_y1 ) ) ||
			( !$options['resizeMethod'] )

		) {

			switch ($options['fitWidthIn']) {

				case 'width':

					$_y2 = ($options['aspectRatio']) ? $_r1 * $_y1 : $_y1;
					break;


				case 'height':
					$_x2 = ($options['aspectRatio']) ? $_r2 * $_x1 : $_x1;
					break;

				default;

					if ($options['aspectRatio']) {

						$aspectratio = min($_r1, $_r2);
						$_x2 = $aspectratio * $_x1;
						$_y2 = $aspectratio * $_y1;
					}
					break;
			}

		} else {

			$_x2 = $_x1;
			$_y2 = $_y1;
		}


		if (!$options['aspectRatio']) {

			$ratio = min($_x1/$_x2, $_y1/$_y2);

			$_c3 = $_x2 * $ratio;
			$_c4 = $_y2 * $ratio;
			$_c1 = ($_x1 - $_c3) / 2;
			$_c2 = ($_y1 - $_c4) / 2;

		}


		return array(

			0 	=> intval($_c3),  	// cropWidth
			1 	=> intval($_c4), 	// cropHeight
			2 	=> intval($_c1),  	// cropOffsetX
			3 	=> intval($_c2), 	// cropOffsetY
			4 	=> intval($_x2),  	// resizeWidth
			5 	=> intval($_y2), 	// resizeHeight
			6 	=> $options, 		// options

			'cropWidth' 	=> intval($_c3),
			'cropHeight' 	=> intval($_c4),
			'cropOffsetX' 	=> intval($_c1),
			'cropOffsetY' 	=> intval($_c2),
			'resizeWidth' 	=> intval($_x2),
			'resizeHeight' 	=> intval($_y2),
			'options'		=> $options,
		);
    }




    public function insertFile() {

    }


    public function insertImage() {

//    	if (!$this->id) alt_img



    }




		// 	if (!$id) {

		// 		list($_x, $_y) = explode('x', $attr['size']);
		// 		return ($attr['alt'] && is_file(ROOTPATH.DIR_MEDIA.'img/private/'.$attr['alt'])) ? "<img src='".DIR_MEDIA.'img/private/'.$attr['alt']." width='{$_x}' height='{$_y}'>" : "<img src='".DIR_MEDIA."img/spacer.gif' width='{$_x}' height='{$_y}'>";
		// 	}


		// 	// M Á R   V A N
		// 	if (is_readable($this->file['url']) && filectime($this->file['original']) <= filectime($this->file['url'])
		// 		) {



		// 	// M É G   N I N C S

		// 	} elseif (($this->file['original'])) {

		// 		// méret arány
		// 		$original = getimagesize($this->file['original']);
		// 		$attr['size0'] = $original[0].'x'.$original[1];

		// 		// resize
		// 		if (!$this->resize_img($this->get_dimension($attr), $this->file['original']."_{$attr['size']}")) {
		// 			return false;
		// 		};
		// 	}


		// 	if (is_readable($this->file['url'])) {

		// 		$file 				= getimagesize($this->file['url']);
		// 		$this->file['tag']	= "<img src='".BASEURL.$this->drop_root($this->file['url'])."' ".$file[3]." ".$attr['tag'].">";

		// 	}

		// 	return (isset($this->file['tag'])) ? $this->file['tag'] : false;
		// }



}
