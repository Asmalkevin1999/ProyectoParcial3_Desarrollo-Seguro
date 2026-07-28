export default () => ({

  master:

  process.env.MASTER_SERVICE ||

  'http://localhost:3000',

  user:

  process.env.USER_SERVICE ||

  'http://localhost:3001',

  inventory:

  process.env.INVENTORY_SERVICE ||

  'http://localhost:3002',

  sales:

  process.env.SALES_SERVICE ||

  'http://localhost:3003',

  hr:

  process.env.HR_SERVICE ||

  'http://localhost:3004'

});