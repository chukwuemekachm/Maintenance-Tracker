export default {
  test: {
    use_env_variable: 'DATABASE_URL_TEST',
    dialect: 'postgres',
  },
  development: {
    use_env_variable: 'DATABASE_URL_DEV',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
  },
};
