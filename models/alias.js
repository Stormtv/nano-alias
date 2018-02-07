module.exports = (sequelize, DataTypes) => {
  const Alias = sequelize.define('alias', {
    alias: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    address: {
      type: DataTypes.STRING,
      require: true,
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
    },
    listed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    freezeTableName: true,
    timestamps: true
  });
  return Alias;
};