// models/subscriptionModel.ts




import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Subscription extends Model {
  public id!: number;
  public user_id!: string;
  public credits!: number;
  public status!: string;
}

Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'subscription',
    tableName: 'subscriptions',
    timestamps: false,
  }
);

export default Subscription;
