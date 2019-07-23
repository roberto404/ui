
SELECT * FROM `products` WHERE category = '117' and features = '';

SELECT * FROM `products` WHERE category = '117' and features LIKE '%1%'



SELECT
  id,
  features_orig,
  count(id)
FROM
  products
WHERE
  category = '117'
GROUP BY
  features_orig


// remove old RSTOP

  UPDATE
    products
  SET
    flag = REPLACE (flag, '"RStop",', '')






// add new feature

UPDATE
  products
SET
  features = REPLACE (features, '}', ',"1":"5"}')
WHERE
  features_orig LIKE '%MDF%'
AND
  category = '117'



SELECT id, category, features_orig FROM products WHERE features_orig LIKE '%MDF%' AND category = '117'


// update where feature not found

UPDATE
  products
SET
  features = REPLACE (features, '}', ',"1":"5"}')
WHERE
  category = '117'
AND
  features NOT LIKE '%39%'




// add new feature to product of category

UPDATE
  products
SET
  features = REPLACE (features, '}', ',"1":"5"}')
WHERE
  category = '117'








SELECT * FROM `products` WHERE category = '117' AND features = ''
