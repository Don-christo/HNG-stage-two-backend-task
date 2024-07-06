// models/userOrganization.ts
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { db } from "../config";
import Users from "./users";
import Organizations from "./organizations";

const TABLE_NAME = "UserOrganizations";

class UserOrganization extends Model<
  InferAttributes<UserOrganization>,
  InferCreationAttributes<UserOrganization>
> {
  declare userId: string;
  declare organizationId: string;
}

UserOrganization.init(
  {
    userId: {
      type: DataTypes.UUID,
      references: {
        model: Users,
        key: "id",
      },
    },
    organizationId: {
      type: DataTypes.UUID,
      references: {
        model: Organizations,
        key: "orgId",
      },
    },
  },
  {
    sequelize: db,
    modelName: TABLE_NAME,
    timestamps: true,
  }
);

export default UserOrganization;
