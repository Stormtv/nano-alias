module.exports = (sequelize, DataTypes) => {
  const Alias = sequelize.define('alias', {
    alias: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    address: {
      type: DataTypes.STRING,
      require: true,
      unique: true,
      validate: {
        is: /(xrb_[13][a-km-zA-HJ-NP-Z0-9]{59})/,
      }
    },
    email: {
      type: DataTypes.STRING,
      require: true,
      validate: {
        isEmail: true
      }
    }
  }, {
    freezeTableName: true,
    timestamps: true
  });
  return Alias;
};