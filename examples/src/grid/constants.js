import React from 'react';

export const DATA = [
  { "id": 1, "name": "Megan J. Cushman", "gender": '1', "visits": "2017-07-23" },
  { "id": 2, "name": "Taylor R. Fallin", "gender": '2', "visits": "2017-07-22" },
  { "id": 3, "name": "Jose C. Rosado", "gender": 1, "visits": "2017-07-22" },
  { "id": 4, "name": "Sammy C. Brandt", "gender": 1, "visits": "2017-07-22" },
  { "id": 5, "name": "June K. Jenkins", "gender": 2, "visits": "2017-06-10" },
  { "id": 6, "name": "Pamela R. Benson", "gender": 2, "visits": "2017-05-23" },
  { "id": 7, "name": "James H. Kelly", "gender": 1, "visits": "2017-07-23" },
  { "id": 8, "name": "Joseph D. Black", "gender": 1, "visits": "2017-07-23" },
  { "id": 9, "name": "Kellie E. Franklin", "gender": 2, "visits": "2017-07-23" },
  { "id": 10, "name": "Wayne D. Price", "gender": 1, "visits": "2017-07-23" },
  { "id": 11, "name": "Michael P. Danley", "gender": 1, "visits": "2016-07-23" },
  { "id": 12, "name": "Weston S. Taylor", "gender": 1, "visits": "2015-07-23" },
];

export const DATA_MESSAGES = [
  { id: 1, sender: 1, name: 'Michael', content: 'first message', createdDateTime: '2020-06-03 20:05:52' },
  { id: 2, sender: 1, name: 'Michael', content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', createdDateTime: '2020-06-03 20:05:55' },
  { id: 5, sender: 2, name: 'Joseph', content: 're-second message', createdDateTime: '2020-06-03 20:06:55', deliveredDateTime: '2020-06-03 20:06:55' },
  { id: 3, sender: 1, name: 'Michael', content: 'first message', createdDateTime: '2020-06-04 20:05:52' },
  { id: 4, sender: 1, name: 'Michael', content: 'second message', createdDateTime: '2020-06-04 20:05:55' },
];

export const DATA_LOG = [{"id":"417682","title":"L\u00e9trej\u00f6tt","tag":[],"message":null,"crud":"C","recordFields":null,"model":"Orders","record":{"id":"1277","relatedId":"1276","orderId":"6.2.0059","status":0,"userOriginId":1,"originId":"6","userId":"825","createdDateTime":"2021-11-04 16:57:27","orderedDateTime":"2021-11-04 16:57:27","approvedDateTime":"2021-11-04 16:57:27","preparedDateTime":null,"deliveryDateTime":null,"fulfilledDate":"2021-11-10","orderType":1,"orderDelivery":1,"deposit":0,"paymentId":3,"takeoverId":2,"takeoverStore":"6","assembly":0,"message":null,"attachment":null},"insertDateTime":"2021-11-04 16:57:27","userName":"Joseph Michael"},{"id":"428900","title":"\u00c1tadhat\u00f3","tag":[{"title":"RS6","className":"green"}],"message":null,"crud":"U","recordFields":["preparedDateTime"],"model":"Orders","record":{"id":"1277","relatedId":"1276","orderId":"6.2.0059","status":0,"userOriginId":"1","originId":"6","userId":"825","createdDateTime":"2021-11-04 16:57:27","orderedDateTime":"2021-11-04 16:57:27","approvedDateTime":"2021-11-04 16:57:27","preparedDateTime":"2021-11-15 00:02:45","deliveryDateTime":null,"fulfilledDate":"2021-11-10","orderType":"1","orderDelivery":"1","deposit":"0","paymentId":"3","takeoverId":"2","takeoverStore":"6","assembly":"0","message":null,"attachment":null},"insertDateTime":"2021-11-15 00:02:45","userName":"Joseph Michael"},{"id":"425400","title":"M\u00f3dos\u00edt\u00e1s","tag":[],"message":"; P\u00e1c:; Sonoma","crud":"U","recordFields":["variant"],"model":"OrdersProducts","record":{"id":"2649","orderProductRelatedId":"2648","status":"1","orderId":"1277","productId":"K80082R","relatedId":"K80082R","flag":"[\"HUN\",\"FAV\"]","brand":"\u00c1mor","title":"\u00e9tkez\u0151asztal 90x160 cm","subtitle":"fa (b\u00fckk) nyithat\u00f3","titleOrig":"\u00c1mor asztal 160\/200","color":null,"variant":"[{\"id\":\"message\",\"title\":\"megjegyz\u00e9s\",\"desc\":\"\"},{\"id\":\"1\",\"title\":\"P\u00e1c:\",\"desc\":\"\"},{\"id\":\"12\",\"title\":\"Sonoma\",\"desc\":\"\"}]","vat":"27","priceSaleNet":"99992.13","priceSaleGross":"126990","priceWholesaleGross":"96510","priceDiscount":"0","quantity":"1","unit":null,"acquisitionId":"0","acquisitionNumber":null,"acquisitionExpected":null,"acquisitionFulfilled":null,"manufacturer":"K80","category":"15","features":"{\"1\":[\"6\"],\"25\":\"3\",\"27\":true,\"51\":\"2\"}","dimension":"{\"w\":\"160\",\"w1\":\"200\",\"h\":\"79\",\"d\":\"90\"}","images":"[{\"id\":\"2524\"}]","message":""},"insertDateTime":"2021-11-13 16:37:37","userName":"Joseph Michael"},{"id":"425402","title":"\u00c1tk\u00e9r\u00e9s","tag":[{"title":"2.1636817862","className":"border bg-white border-yellow text-yellow"}],"message":null,"crud":"U","recordFields":null,"model":"OrdersProducts","record":{"id":"2649","orderProductRelatedId":"2648","status":"1","orderId":"1277","productId":"K80082R","relatedId":"K80082R","flag":"[\"HUN\",\"FAV\"]","brand":"\u00c1mor","title":"\u00e9tkez\u0151asztal 90x160 cm","subtitle":"fa (b\u00fckk) nyithat\u00f3","titleOrig":"\u00c1mor asztal 160\/200","color":null,"variant":"[{\"id\":\"message\",\"title\":\"megjegyz\u00e9s\",\"desc\":\"\"},{\"id\":\"1\",\"title\":\"P\u00e1c:\",\"desc\":\"\"},{\"id\":\"12\",\"title\":\"Sonoma\",\"desc\":\"\"}]","vat":"27","priceSaleNet":"99992.13","priceSaleGross":"126990","priceWholesaleGross":"96510","priceDiscount":"0","quantity":"1.00","unit":null,"acquisitionId":1,"acquisitionNumber":"2.1636817862","acquisitionExpected":"2021-11-15","acquisitionFulfilled":null,"manufacturer":"K80","category":"15","features":"{\"1\":[\"6\"],\"25\":\"3\",\"27\":true,\"51\":\"2\"}","dimension":"{\"w\":\"160\",\"w1\":\"200\",\"h\":\"79\",\"d\":\"90\"}","images":"[{\"id\":\"2524\"}]","message":""},"insertDateTime":"2021-11-13 16:37:42","userName":"Joseph Michael"},{"id":"428898","title":"order.product.status.6","tag":[],"message":"K80082R","crud":"U","recordFields":["status"],"model":"OrdersProducts","record":{"id":"2649","orderProductRelatedId":"2648","status":6,"orderId":"1277","productId":"K80082R","relatedId":"K80082R","flag":"[\"HUN\",\"FAV\"]","brand":"\u00c1mor","title":"\u00e9tkez\u0151asztal 90x160 cm","subtitle":"fa (b\u00fckk) nyithat\u00f3","titleOrig":"\u00c1mor asztal 160\/200","color":null,"variant":"[{\"id\":\"message\",\"title\":\"megjegyz\u00e9s\",\"desc\":\"\"},{\"id\":\"1\",\"title\":\"P\u00e1c:\",\"desc\":\"\"},{\"id\":\"12\",\"title\":\"Sonoma\",\"desc\":\"\"}]","vat":"27","priceSaleNet":"99992.13","priceSaleGross":"126990","priceWholesaleGross":"96510","priceDiscount":"0","quantity":"1.00","unit":null,"acquisitionId":"1","acquisitionNumber":"2.1636817862","acquisitionExpected":"2021-11-15","acquisitionFulfilled":null,"manufacturer":"K80","category":"15","features":"{\"1\":[\"6\"],\"25\":\"3\",\"27\":true,\"51\":\"2\"}","dimension":"{\"w\":\"160\",\"w1\":\"200\",\"h\":\"79\",\"d\":\"90\"}","images":"[{\"id\":\"2524\"}]","message":""},"insertDateTime":"2021-11-15 00:02:45","userName":"Joseph Michael"},{"id":"431620","title":"Rendel\u00e9s visszavon\u00e1s","tag":[],"message":"Rendelni kell!","crud":"U","recordFields":null,"model":"OrdersProducts","record":{"id":"2649","orderProductRelatedId":"2648","status":"6","orderId":"1277","productId":"K80082R","relatedId":"K80082R","flag":"[\"HUN\",\"FAV\"]","brand":"\u00c1mor","title":"\u00e9tkez\u0151asztal 90x160 cm","subtitle":"fa (b\u00fckk) nyithat\u00f3","titleOrig":"\u00c1mor asztal 160\/200","color":null,"variant":"[{\"id\":\"message\",\"title\":\"megjegyz\u00e9s\",\"desc\":\"\"},{\"id\":\"1\",\"title\":\"P\u00e1c:\",\"desc\":\"\"},{\"id\":\"12\",\"title\":\"Sonoma\",\"desc\":\"\"}]","vat":"27","priceSaleNet":"99992.13","priceSaleGross":"126990","priceWholesaleGross":"96510","priceDiscount":"0","quantity":"1.00","unit":null,"acquisitionId":[],"acquisitionNumber":[],"acquisitionExpected":[],"acquisitionFulfilled":null,"manufacturer":"K80","category":"15","features":"{\"1\":[\"6\"],\"25\":\"3\",\"27\":true,\"51\":\"2\"}","dimension":"{\"w\":\"160\",\"w1\":\"200\",\"h\":\"79\",\"d\":\"90\"}","images":"[{\"id\":\"2524\"}]","message":""},"insertDateTime":"2021-11-17 09:35:21","userName":"Joseph Michael"},{"id":"431623","title":"Rendel\u00e9s","tag":[{"title":"62-K80-0003","className":"border bg-white border-yellow text-yellow"}],"message":null,"crud":"U","recordFields":null,"model":"OrdersProducts","record":{"id":"2649","orderProductRelatedId":"2648","status":"6","orderId":"1277","productId":"K80082R","relatedId":"K80082R","flag":"[\"HUN\",\"FAV\"]","brand":"\u00c1mor","title":"\u00e9tkez\u0151asztal 90x160 cm","subtitle":"fa (b\u00fckk) nyithat\u00f3","titleOrig":"\u00c1mor asztal 160\/200","color":null,"variant":"[{\"id\":\"message\",\"title\":\"megjegyz\u00e9s\",\"desc\":\"\"},{\"id\":\"1\",\"title\":\"P\u00e1c:\",\"desc\":\"\"},{\"id\":\"12\",\"title\":\"Sonoma\",\"desc\":\"\"}]","vat":"27","priceSaleNet":"99992.13","priceSaleGross":"126990","priceWholesaleGross":"96510","priceDiscount":"0","quantity":"1.00","unit":null,"acquisitionId":2,"acquisitionNumber":"62-K80-0003","acquisitionExpected":"2021-12-02","acquisitionFulfilled":null,"manufacturer":"K80","category":"15","features":"{\"1\":[\"6\"],\"25\":\"3\",\"27\":true,\"51\":\"2\"}","dimension":"{\"w\":\"160\",\"w1\":\"200\",\"h\":\"79\",\"d\":\"90\"}","images":"[{\"id\":\"2524\"}]","message":""},"insertDateTime":"2021-11-17 09:36:52","userName":"Joseph Michael"},{"id":"432002","title":"order.product.status.-1","tag":[],"message":"K80082R","crud":"U","recordFields":["status"],"model":"OrdersProducts","record":{"id":"2649","orderProductRelatedId":"2648","status":-1,"orderId":"1277","productId":"K80082R","relatedId":"K80082R","flag":"[\"HUN\",\"FAV\"]","brand":"\u00c1mor","title":"\u00e9tkez\u0151asztal 90x160 cm","subtitle":"fa (b\u00fckk) nyithat\u00f3","titleOrig":"\u00c1mor asztal 160\/200","color":null,"variant":"[{\"id\":\"message\",\"title\":\"megjegyz\u00e9s\",\"desc\":\"\"},{\"id\":\"1\",\"title\":\"P\u00e1c:\",\"desc\":\"\"},{\"id\":\"12\",\"title\":\"Sonoma\",\"desc\":\"\"}]","vat":"27","priceSaleNet":"99992.13","priceSaleGross":"126990","priceWholesaleGross":"96510","priceDiscount":"0","quantity":"1.00","unit":null,"acquisitionId":"2","acquisitionNumber":"62-K80-0003","acquisitionExpected":"2021-12-02","acquisitionFulfilled":null,"manufacturer":"K80","category":"15","features":"{\"1\":[\"6\"],\"25\":\"3\",\"27\":true,\"51\":\"2\"}","dimension":"{\"w\":\"160\",\"w1\":\"200\",\"h\":\"79\",\"d\":\"90\"}","images":"[{\"id\":\"2524\"}]","message":""},"insertDateTime":"2021-11-18 09:02:38","userName":"Joseph Michael"},{"id":"432009","title":"order.product.status.0","tag":[],"message":"K80082R","crud":"U","recordFields":["status"],"model":"OrdersProducts","record":{"id":"2649","orderProductRelatedId":"2648","status":0,"orderId":"1277","productId":"K80082R","relatedId":"K80082R","flag":"[\"HUN\",\"FAV\"]","brand":"\u00c1mor","title":"\u00e9tkez\u0151asztal 90x160 cm","subtitle":"fa (b\u00fckk) nyithat\u00f3","titleOrig":"\u00c1mor asztal 160\/200","color":null,"variant":"[{\"id\":\"message\",\"title\":\"megjegyz\u00e9s\",\"desc\":\"\"},{\"id\":\"1\",\"title\":\"P\u00e1c:\",\"desc\":\"\"},{\"id\":\"12\",\"title\":\"Sonoma\",\"desc\":\"\"}]","vat":"27","priceSaleNet":"99992.13","priceSaleGross":"126990","priceWholesaleGross":"96510","priceDiscount":"0","quantity":"1.00","unit":null,"acquisitionId":"2","acquisitionNumber":"62-K80-0003","acquisitionExpected":"2021-12-02","acquisitionFulfilled":null,"manufacturer":"K80","category":"15","features":"{\"1\":[\"6\"],\"25\":\"3\",\"27\":true,\"51\":\"2\"}","dimension":"{\"w\":\"160\",\"w1\":\"200\",\"h\":\"79\",\"d\":\"90\"}","images":"[{\"id\":\"2524\"}]","message":""},"insertDateTime":"2021-11-18 09:34:50","userName":"Joseph Michael"},{"id":"432011","title":"Rendel\u00e9s visszavon\u00e1s","tag":[],"message":"technikai hiba miatt.","crud":"U","recordFields":null,"model":"OrdersProducts","record":{"id":"2649","orderProductRelatedId":"2648","status":"0","orderId":"1277","productId":"K80082R","relatedId":"K80082R","flag":"[\"HUN\",\"FAV\"]","brand":"\u00c1mor","title":"\u00e9tkez\u0151asztal 90x160 cm","subtitle":"fa (b\u00fckk) nyithat\u00f3","titleOrig":"\u00c1mor asztal 160\/200","color":null,"variant":"[{\"id\":\"message\",\"title\":\"megjegyz\u00e9s\",\"desc\":\"\"},{\"id\":\"1\",\"title\":\"P\u00e1c:\",\"desc\":\"\"},{\"id\":\"12\",\"title\":\"Sonoma\",\"desc\":\"\"}]","vat":"27","priceSaleNet":"99992.13","priceSaleGross":"126990","priceWholesaleGross":"96510","priceDiscount":"0","quantity":"1.00","unit":null,"acquisitionId":[],"acquisitionNumber":[],"acquisitionExpected":[],"acquisitionFulfilled":null,"manufacturer":"K80","category":"15","features":"{\"1\":[\"6\"],\"25\":\"3\",\"27\":true,\"51\":\"2\"}","dimension":"{\"w\":\"160\",\"w1\":\"200\",\"h\":\"79\",\"d\":\"90\"}","images":"[{\"id\":\"2524\"}]","message":""},"insertDateTime":"2021-11-18 09:34:59","userName":"Joseph Michael"},{"id":"432016","title":"\u00c1tk\u00e9r\u00e9s","tag":[{"title":"2.1637224543","className":"border bg-white border-yellow text-yellow"}],"message":null,"crud":"U","recordFields":null,"model":"OrdersProducts","record":{"id":"2649","orderProductRelatedId":"2648","status":"0","orderId":"1277","productId":"K80082R","relatedId":"K80082R","flag":"[\"HUN\",\"FAV\"]","brand":"\u00c1mor","title":"\u00e9tkez\u0151asztal 90x160 cm","subtitle":"fa (b\u00fckk) nyithat\u00f3","titleOrig":"\u00c1mor asztal 160\/200","color":null,"variant":"[{\"id\":\"message\",\"title\":\"megjegyz\u00e9s\",\"desc\":\"\"},{\"id\":\"1\",\"title\":\"P\u00e1c:\",\"desc\":\"\"},{\"id\":\"12\",\"title\":\"Sonoma\",\"desc\":\"\"}]","vat":"27","priceSaleNet":"99992.13","priceSaleGross":"126990","priceWholesaleGross":"96510","priceDiscount":"0","quantity":"1.00","unit":null,"acquisitionId":1,"acquisitionNumber":"2.1637224543","acquisitionExpected":"2021-11-20","acquisitionFulfilled":null,"manufacturer":"K80","category":"15","features":"{\"1\":[\"6\"],\"25\":\"3\",\"27\":true,\"51\":\"2\"}","dimension":"{\"w\":\"160\",\"w1\":\"200\",\"h\":\"79\",\"d\":\"90\"}","images":"[{\"id\":\"2524\"}]","message":""},"insertDateTime":"2021-11-18 09:35:43","userName":"Joseph Michael"},{"id":"432019","title":"Rendel\u00e9s visszavon\u00e1s","tag":[],"message":"technikai.","crud":"U","recordFields":null,"model":"OrdersProducts","record":{"id":"2649","orderProductRelatedId":"2648","status":"0","orderId":"1277","productId":"K80082R","relatedId":"K80082R","flag":"[\"HUN\",\"FAV\"]","brand":"\u00c1mor","title":"\u00e9tkez\u0151asztal 90x160 cm","subtitle":"fa (b\u00fckk) nyithat\u00f3","titleOrig":"\u00c1mor asztal 160\/200","color":null,"variant":"[{\"id\":\"message\",\"title\":\"megjegyz\u00e9s\",\"desc\":\"\"},{\"id\":\"1\",\"title\":\"P\u00e1c:\",\"desc\":\"\"},{\"id\":\"12\",\"title\":\"Sonoma\",\"desc\":\"\"}]","vat":"27","priceSaleNet":"99992.13","priceSaleGross":"126990","priceWholesaleGross":"96510","priceDiscount":"0","quantity":"1.00","unit":null,"acquisitionId":[],"acquisitionNumber":[],"acquisitionExpected":[],"acquisitionFulfilled":null,"manufacturer":"K80","category":"15","features":"{\"1\":[\"6\"],\"25\":\"3\",\"27\":true,\"51\":\"2\"}","dimension":"{\"w\":\"160\",\"w1\":\"200\",\"h\":\"79\",\"d\":\"90\"}","images":"[{\"id\":\"2524\"}]","message":""},"insertDateTime":"2021-11-18 09:35:57","userName":"Joseph Michael"},{"id":"432022","title":"Rendel\u00e9s","tag":[{"title":"62-K80-0004","className":"border bg-white border-yellow text-yellow"}],"message":null,"crud":"U","recordFields":null,"model":"OrdersProducts","record":{"id":"2649","orderProductRelatedId":"2648","status":"0","orderId":"1277","productId":"K80082R","relatedId":"K80082R","flag":"[\"HUN\",\"FAV\"]","brand":"\u00c1mor","title":"\u00e9tkez\u0151asztal 90x160 cm","subtitle":"fa (b\u00fckk) nyithat\u00f3","titleOrig":"\u00c1mor asztal 160\/200","color":null,"variant":"[{\"id\":\"message\",\"title\":\"megjegyz\u00e9s\",\"desc\":\"\"},{\"id\":\"1\",\"title\":\"P\u00e1c:\",\"desc\":\"\"},{\"id\":\"12\",\"title\":\"Sonoma\",\"desc\":\"\"}]","vat":"27","priceSaleNet":"99992.13","priceSaleGross":"126990","priceWholesaleGross":"96510","priceDiscount":"0","quantity":"1.00","unit":null,"acquisitionId":2,"acquisitionNumber":"62-K80-0004","acquisitionExpected":"2021-12-02","acquisitionFulfilled":null,"manufacturer":"K80","category":"15","features":"{\"1\":[\"6\"],\"25\":\"3\",\"27\":true,\"51\":\"2\"}","dimension":"{\"w\":\"160\",\"w1\":\"200\",\"h\":\"79\",\"d\":\"90\"}","images":"[{\"id\":\"2524\"}]","message":""},"insertDateTime":"2021-11-18 09:36:16","userName":"Joseph Michael"}];


export const DATA_HIERARCHY =
[
  {
    name: 'mesh.1',
    title: 'Mesh #1',
    material: 'Wood',
    visibility: false,
  },
  {
    name: 'mesh.2',
    title: 'Mesh #2',
    material: 'Aluminum',
  },
  {
    name: 'mesh.3',
    title: 'Mesh #3',
    material: 'Wood',
  },
  {
    name: 'mesh.4',
    title: 'Mesh #4',
    material: 'Wood',
  },
  {
    parent: 'mesh.2',
    name: 'name.21',
    material: 'Wood',
    rotation: [0, 0, 90],
    position: [-0.15, 0.3, 0.02],
    filter: "texture=wood1|texture=wood2",
  },
  {
    parent: 'mesh.2',
    name: 'name.22',
    material: 'Wood',
    rotation: [0, 0, 90],
    position: [-0.15, 0.3, 0.02],
    filter: "texture!=wood1|texture!=wood2",
  },
  {
    parent: 'name.22',
    name: 'name.221',
    material: 'Wood',
    rotation: [0, 0, 90],
    position: [-0.15, 0.3, 0.02],
    filter: "texture=wood1|texture=wood2",
  },
  {
    parent: 'name.21',
    name: 'name.221',
    material: 'Wood',
    rotation: [0, 0, 90],
    position: [-0.15, 0.3, 0.02],
    filter: "texture=wood1|texture=wood2",
  },
  {
    parent: 'name.21',
    name: 'name.222',
    material: 'Wood',
    rotation: [0, 0, 90],
    position: [-0.15, 0.3, 0.02],
    filter: "texture=wood1|texture=wood2",
  },
  {
    parent: 'name.221',
    name: 'name.2211',
    material: 'Wood',
    rotation: [0, 0, 90],
    position: [-0.15, 0.3, 0.02],
    filter: "texture=wood1|texture=wood2",
  },
]

// const NOW = new Date();

export const SETTINGS =
{
  hook:
  {
    name: 'Name',
    visits:
    {
      title: 'Visits',
      format: ({ record }) => (
        <div>
          <div className="text-m bold">{record.visits}</div>
          <div className="text-xs text-gray">{record.name}</div>
        </div>
      ),
    },
    gender:
    {
      title: 'Gender',
      format: ({ value, helper }, config = {}) =>
        ((helper.gender) ? helper.gender[value] || value : value),
    },
    custom:
    {
      title: 'Visit Sort',
      format: ({ record }) => record.visits,
      sort: (a, b) => new Date(b.visits).getTime() < new Date(a.visits).getTime(),
    },
  },
  helper:
  {
    gender: { 1: 'male', 2: 'female' },
  },
  paginate:
  {
    limit: 2,
  },
  order:
  {
    column: 'name',
    direction: 'desc',
  },
  filters:
  [
    {
      id: 'search',
      handler: (record, value) =>
        record.name
          .toString()
          .toLowerCase()
          .indexOf(value.toString().toLowerCase()) >= 0,
      arguments: [],
      status: false,
    },
    {
      id: 'isMale',
      handler: record => parseInt(record.gender) === 1,
      arguments: [],
      status: false,
    },
    {
      id: 'gender',
      handler: (record, value) =>
        parseInt(record.gender) === parseInt(value),
      arguments: [],
      status: false,
    },
    {
      id: 'visit',
      handler: ({ visits }, value) => visits === value,
      arguments: [],
      status: false,
    },
  ],
  };


  export const HOOK_LIST = {
    id:
    {
      title: 'Termék',
      width: '100%',
      align: 'left',
      format: ({ record }) =>
      (
        <div className="pl-1">
          <div className="ellipsis">{record.name}</div>
          <div className="text-s text-gray light ellipsis" style={{ height: '1.5em' }}>{record.visits}</div>
        </div>
      ),
    },
  };
