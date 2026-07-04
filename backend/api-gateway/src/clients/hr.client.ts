import axios from 'axios';

export class HrClient {

  async employees(token: string) {

    return axios.get(

      process.env.HR_SERVICE +

      '/employees',

      {

        headers: {

          Authorization: token

        }

      }

    );

  }

}