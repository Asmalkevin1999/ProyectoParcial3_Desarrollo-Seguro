import { registerAs } from '@nestjs/config';

export default registerAs('http', () => ({

  master: process.env.MASTER_SERVICE,

  user: process.env.USER_SERVICE,

  inventory: process.env.INVENTORY_SERVICE,

  sales: process.env.SALES_SERVICE,

  hr: process.env.HR_SERVICE,

}));