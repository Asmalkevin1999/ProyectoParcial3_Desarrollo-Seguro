export default () => ({

  jwt: {

    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',

    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',

    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',

    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d'

  }

});