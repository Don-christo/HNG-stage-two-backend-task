import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { db } from "../config";

const TABLE_NAME = "Organizations";

class Organizations extends Model<
  InferAttributes<Organizations>,
  InferCreationAttributes<Organizations>
> {
  declare orgId: string;
  declare name: string;
  declare description: string;
}

Organizations.init(
  {
    orgId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: TABLE_NAME,
    timestamps: true,
  }
);

export default Organizations;
