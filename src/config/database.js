module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'root',
  database: 'auth',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};