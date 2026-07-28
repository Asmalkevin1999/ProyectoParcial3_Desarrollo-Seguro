export default () => ({

  master:

  process.env.MASTER_SERVICE ||

  'http://master-service:3000',

  user:

  process.env.USER_SERVICE ||

  'http://user-service:3001',

  inventory:

  process.env.INVENTORY_SERVICE ||

  'http://inventory-service:3002',

  sales:

  process.env.SALES_SERVICE ||

  'http://sales-service:3003',

  hr:

  process.env.HR_SERVICE ||

  'http://hr-service:3004',

  reservations:

  process.env.RESERVATIONS_SERVICE ||

  'http://reservations-service:3001'

});