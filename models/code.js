module.exports = (sequelize, DataTypes) => {
  const Code = sequelize.define('code', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING,
      require: true
    },
    aliasId: {
      type: DataTypes.INTEGER,
      require: true
    }
  }, {
    freezeTableName: true,
    timestamps: true
  });
  return Code;
};