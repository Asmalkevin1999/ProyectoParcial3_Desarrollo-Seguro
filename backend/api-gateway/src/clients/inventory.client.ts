import axios from 'axios';

export class InventoryClient {

  async products(token: string) {

    return axios.get(

      process.env.INVENTORY_SERVICE +

      '/products',

      {

        headers: {

          Authorization: token

        }

      }

    );

  }

}