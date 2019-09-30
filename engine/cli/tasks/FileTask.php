<?php

use
  \App\Models\Files,
  \App\Models\Products,
  \App\Exceptions\HTTPException;


define("FILE_PATH", __DIR__ . '/../../../public_html/kontakt2/json/');
define("FILE_NAME", 'stock.json');


class FileTask extends \Phalcon\CLI\Task
{
  public function mainAction()
  {
    echo "\nAvailable Stock actions: \033[1;33mupdate, sync\033[0m\n\n";
  }

  /**
   * Create Stock cache file with database modified timestamp
   */
  public function productImagesAction()
  {
    $directory = DOCUMENT_ROOT . 'public_html/product_images/';

    foreach (array_diff(scandir($directory), array('..', '.')) as $subDir)
    {
      foreach(array_diff(scandir($directory . $subDir), array('..', '.')) as $srcFileName)
      {
        $srcFile = $directory . $subDir . '/' . $srcFileName;
        $sku = substr($srcFileName, 0, -7);

        $product = Products::findFirst("id = '{$sku}'");

        if ($product)
        {
          $file = Files::findFirst("title = '${sku}'");

          if (!$file)
          {
            $file = new Files();

            $file->title = $sku;
            $file->ext = 'jpg';
            $file->size = filesize($srcFile);
            $file->mimeMajor = 'image';
            $file->mimeMinor = 'jpeg';
            $file->create();

            copy($srcFile, $file->getPhysicalFullPath());

            $file->resizeImage([
              'size' => '36x36',
              'devicePixelRatio' => 4,
            ]);

            $file->resizeImage([
              'size' => '250x250',
              'devicePixelRatio' => 4,
            ]);

            $file->resizeImage([
              'size' => '640x480',
              'devicePixelRatio' => 4,
            ]);

            $product->images = json_encode([$file->id]);
            $product->save();
          }
          else
          {
            if (!$product->images)
            {
              $product->images = json_encode([$file->id]);
              $product->save();
            }
          }
        }
      }
    }
  }

}
