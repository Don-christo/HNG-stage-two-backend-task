import Users from "./users";
import Organizations from "./organizations";
import UserOrganization from "./userOrganization";

// Define associations
Users.belongsToMany(Organizations, {
  through: UserOrganization,
  foreignKey: "userId",
});
Organizations.belongsToMany(Users, {
  through: UserOrganization,
  foreignKey: "organizationId",
});

export { Users, Organizations, UserOrganization };
