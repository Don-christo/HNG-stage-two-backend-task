import { Router } from "express";
import {
  getOrganizations,
  getOrganizationById,
  createOrganisation,
  addUserToOrganization,
} from "../controllers/organization/organizationController";
import { auth } from "../middleware/authorization";

const router = Router();

router.get("/organisations", auth, getOrganizations);
router.get("/organisations/:orgId", auth, getOrganizationById);
router.post("/organisations", auth, createOrganisation);
router.post("/organisations/:orgId/users", auth, addUserToOrganization);

export default router;
