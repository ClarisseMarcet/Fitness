import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

export class Exercise extends Model {
  public id!: number;
  public nom!: string;
  public categorie!: string;
  public niveau!: string;
  public muscles!: string;
  public materiel!: string;
  public description!: string;
  public videoUrl!: string;
  public thumbnailUrl!: string;
  public instructions!: string[];
  public variations!: string[];
  public startingPosition!: string;
  public execution!: string;
  public breathing!: string;
  public tips!: string;
}

Exercise.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categorie: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    niveau: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    muscles: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    materiel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instructions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    variations: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    startingPosition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    execution: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    breathing: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tips: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'exercises',
  }
);
