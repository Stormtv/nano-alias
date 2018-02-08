module.exports = (sequelize, DataTypes) => {
  const Alias = sequelize.define('alias', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    alias: {
      type: DataTypes.STRING,
      require: true,
      unique: true
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
      require: true
    },
    listed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    token: {
      type: DataTypes.STRING,
      require: true
    },
    registered: {
      type: DataTypes.BOOLEAN,
      require: true,
      defaultValue: false
    }
  }, {
    freezeTableName: true,
    timestamps: true
  });
  return Alias;
};