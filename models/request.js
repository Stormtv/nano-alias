module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('request', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    alias: {
      type: DataTypes.STRING,
      require: true
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
    },
    text: {
      type: DataTypes.STRING(500),
      require: true
    },
    reviewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    freezeTableName: true,
    timestamps: true
  });
  return Request;
};