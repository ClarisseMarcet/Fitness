import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';

// ===============================
// Typage des attributs
// ===============================

interface CategorieAttributes {
  id: number;
  nom: string;
  slug: string;
  image_url: string | null;
  video_url: string | null;
}

interface CategorieCreationAttributes extends Optional<CategorieAttributes, 'id'> {}

export class Categorie extends Model<CategorieAttributes, CategorieCreationAttributes> implements CategorieAttributes {
  public id!: number;
  public nom!: string;
  public slug!: string;
  public image_url!: string | null;
  public video_url!: string | null;
}

// ===============================
// Initialisation du modèle Categorie
// ===============================

Categorie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Categorie',
    tableName: 'categories',
    timestamps: false,
  }
);

// ===============================
// Modèle : Entrainement
// ===============================

interface EntrainementAttributes {
  id: number;
  titre: string;
  description: string;
  niveau: string;
  categorie_id: number;
  duree_minutes: number;
  date_creation: Date;
  image_url: string | null;
  video_url: string | null;
}

interface EntrainementCreationAttributes extends Optional<EntrainementAttributes, 'id'> {}

export class Entrainement extends Model<EntrainementAttributes, EntrainementCreationAttributes>
  implements EntrainementAttributes {
  public id!: number;
  public titre!: string;
  public description!: string;
  public niveau!: string;
  public categorie_id!: number;
  public duree_minutes!: number;
  public date_creation!: Date;
  public image_url!: string | null;
  public video_url!: string | null;

  public categorie?: Categorie;
}

// ===============================
// Initialisation du modèle Entrainement
// ===============================

Entrainement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    niveau: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categorie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duree_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_creation: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Entrainement',
    tableName: 'entrainements',
    timestamps: false,
  }
);

// ===============================
// Associations
// ===============================

Categorie.hasMany(Entrainement, {
  foreignKey: 'categorie_id',
  as: 'entrainements',
});

Entrainement.belongsTo(Categorie, {
  foreignKey: 'categorie_id',
  as: 'categorie',
});
