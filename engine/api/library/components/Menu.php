<?php
namespace App\Components;


use FordEDM\Models\Files;
use Phalcon\Mvc\User\Component;
use Phalcon\Db;

/**
 * Menu
 *
 * Helps to build UI elements for the application
 */
class Menu extends Component
{

    public $_menu 		= array(),
    		$_pid_menu 	= array();


	public 	$me 		= 0,
			$family,
			$sibling 	= array(),
			$path,
			$child 		= array(),
			$tree;


	public 	$cars_menu_id,
			$cvs_menu_id;


	public function __construct()
    {
    	$this->_structureData();
    }

    /**
     * Get raw menu data from Database
     * @param  string $id id of menu category
     * @return array     raw data from db
     */
    private function _collectDatas($id)
    {
    	if ($id<0)
    		return false;

    	$dataResults = $this->db->query
        ("
            SELECT
                id, title, pid, pos, categories
            FROM
                categories_web
            WHERE
            	status = 1
            ORDER BY
                pid asc,
                pos asc
        ", array($id));

    	// $dataResults = $this->db->query
      //   ("
      //       SELECT
      //           id, title, pid, pos, modul, action, link, q_url
      //       FROM
      //           menu
      //       WHERE
      //           mc_id = ?
      //       AND
      //       	status = 1
      //       ORDER BY
      //           pid asc,
      //           pos asc
      //   ", array($id));

        return $dataResults->fetchAll();
    }

	private function _setMenu()
	{

		//$mc_id = $this->config->locale->language_code;
		$mc_id = 1;

		if (!$mc_id || $mc_id < 1)
			throw new \Phalcon\Exception('Wrong or missing menu category!');

        foreach ($this->_collectDatas($mc_id) as $i => $z)
        {
        	$this->_menu[$z['id']] = $z;
        	$this->_pid_menu[$z['pid']][] = $z['id'];
        }

        return $this->_menu;
	}

	private function _getMenu()
	{
		return ($this->_menu) ? $this->_menu : $this->_setMenu();
	}



	private function _structureData($me=false)
	{

		/**
		*  @thisId [int] current menu id
		*  @thisPath [array] path to current id
		*  @firstChild	- elsoagi szulo, vagyis a path elso eleme
		*  @thisPosition [int] the depth of a node, sibling position
		*  @parentPosition [array]  count the current position of all parents
		*/

		$thisId = 0;
		$thisPath = array(0);

		for ($i=0; $i<=sizeof($this->_getMenu()); $i++)
		{

			// get position: If the previous (hightest sibling) path reached the end,
			// than iteration go back to common parent
			$thisPosition = (isset($thisId) && isset($parentPositions[$thisId])) ? $parentPositions[$thisId] : 0;

			// define the parentPosition, where thisId mean the parent Id
			if (isset($thisId))
				$parentPositions[$thisId] = 1;

			// set new thisId: previous thisId mean the parent Id
			$thisId = (isset($thisId) && isset($this->_pid_menu[$thisId][$thisPosition]))
				?
				$this->_pid_menu[$thisId][$thisPosition] : null;


			// This condition execute, when it has not got child
			while ( !isset($thisId) )
			{

				// because it has not got child thisPath go back one
				array_pop($thisPath);

				// break process, because we came back to the root
				if (sizeof($thisPath)==0)
					break;

				// get this parent Id
				$thisParent = $thisPath[sizeof($thisPath)-1];

				// set this position
				$thisPosition = $parentPositions[$thisParent];
				$parentPositions[$thisParent]++;

				// get new item id, if it is valid
				// based on next sibling from this parent
				if (isset($this->_pid_menu[$thisParent][$thisPosition]))
				{
					$thisId = $this->_pid_menu[$thisParent][$thisPosition];
				}
				else
				{
					unset($thisId);
				}

			}

			// this is a exception, when
			// parent is inactive but the childs are active
			if (!isset($thisId)) continue;


			// In the end of each iteration:
			// The current path expanding the thisId
			$thisPath[] = $thisId;

			$this->tree[$thisId] = sizeof($thisPath)-1;
			$this->_menu[$thisId]['path'] = $thisPath;
			$this->_menu[$thisId]['url'] = ''; //$this->getItemUrl($thisId);

			// isTree props mean that, this menu is part of the tree
			// (ex. inactive menu item has not it)
			$this->_menu[$thisId]['isTree'] = true;

			if (!$this->me /*&& $this->_menu[$thisId]['url'] == $this->router->getRewriteUri()*/)
			{
				$this->me = $thisId;
			}
		}
	}








	/* !- Public Methods */


	public function getItem($id)
	{
		if ($id < 0 || !isset($this->_menu[$id]))
			return false;

		return $this->_menu[$id];
	}

	/**
	 * Tree Getter
	 * @return array full tree
	 */
    public function getTree()
    {
    	if (!$this->tree)
    	{
	        $this->_structure();
    	}
    	return ($this->tree);
    }



	/**
	 * Return title fo menu item
	 * @param  int $id id of menu item
	 * @return string     title of item
	 */
    public function getItemTitle($id)
    {
    	if ( $id < 0 || !isset($this->_menu[$id]) || !isset($this->_menu[$id]['title']) )
    		return false;

    	return $this->_menu[$id]['title'];
    }


	/**
	 * Return full path url of menu item
	 */

    public function getItemUrl($id)
    {

     	if ( $id < 0 || !isset($this->_menu[$id]) || !$thisPath = $this->getItemPath($id) )
    		return false;

    	foreach ($thisPath as $parentId) {

    		if (!$parentId)
    			$url = substr($this->config->application->baseUri,1);
    		else
    			$url .= "/".$this->_menu[$parentId]['q_url'];
    	}

    	return $url;
    }


	/**
	 * Return siblings id
	 */


    public function getItemSiblings($id)
    {
		if ($id<0 || !$thisPath = $this->getItemPath($id))
			return false;

		$thisParentId = $thisPath[sizeof($thisPath)-2];

    	return $this->getItemChilds($thisParentId);
    }


	/**
	 * Return menu childs id
	 */

	public function getItemChilds($id = false)
	{
		if ($id === false || $id < 0)
			$id = $this->me;

		if (!isset($this->_pid_menu[$id]))
				return false;

		return $this->_pid_menu[$id];
	}

	public function getItemParent($id = false)
	{
		if ($id === false || $id < 0)
			$id = $this->me;

		if (!isset($this->_menu[$id]))
				return false;

		return $this->_menu[$id]['pid'];
	}

	/**
	 * Return menu first child id
	 */

	public function getItemFirstChild($id = false)
	{
		if ($id === false || $id < 0)
			$id = $this->me;

		$childs = $this->getItemChilds($id);

		if ($childs && isset($childs[0]))
			return $childs[0];

		return false;
	}

	/**
	 * Return menu parents id (direct path in the family)
	 */

	public function getItemPath($id)
	{
		if ($id<0 || !isset($this->_menu[$id]) || !isset($this->_menu[$id]['path']) )
			return false;

		return $this->_menu[$id]['path'];
	}


	public function getFirstItemByProps($condition)
	{
		if (!$condition || !sizeof($condition))
			return false;

		foreach ($this->_menu as $menuIndex => $menuData)
		{
			$result = 0;

			foreach ($condition as $conditionKey => $conditionValue)
			{
				if (!isset($menuData[$conditionKey]) || $menuData[$conditionKey] != $conditionValue)
				{
					break;
				}
				else
				{
					$result++;
				}
			}

			if (sizeof($condition) == $result)
			{
				return $menuData['id'];
			}
		}
		return false;
	}
}
