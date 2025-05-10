// chatGptModel.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';  // Assurez-vous que sequelize est correctement configuré

class ChatGptUser extends Model {
  public id!: number;
  public firebase_uid!: string;   
  public email!: string;          
  public api_key!: string;        
  public chat_history!: string[]; 
}

ChatGptUser.init(
  {
    firebase_uid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    api_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    chat_history: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    }
  },
  {
    sequelize,
    tableName: 'chatgpt_users',
    timestamps: true
  }
);

export default ChatGptUser;
