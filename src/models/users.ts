import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { db } from "../config";

const TABLE_NAME = "Users";

class Users extends Model<
  InferAttributes<Users>,
  InferCreationAttributes<Users>
> {
  declare userId: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare phone: string;
}

Users.init(
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: TABLE_NAME,
    timestamps: true,
  }
);

export default Users;
