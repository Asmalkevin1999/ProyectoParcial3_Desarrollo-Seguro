import axios from 'axios';

export class MasterClient {

  async login(data: any) {

    return axios.post(

      process.env.MASTER_SERVICE +

      '/auth/login',

      data

    );

  }

}