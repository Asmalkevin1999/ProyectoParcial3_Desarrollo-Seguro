import axios from 'axios';

export class SalesClient {

  async sales(token: string) {

    return axios.get(

      process.env.SALES_SERVICE +

      '/sales',

      {

        headers: {

          Authorization: token

        }

      }

    );

  }

}