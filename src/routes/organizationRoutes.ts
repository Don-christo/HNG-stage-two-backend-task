import { Router } from "express";
import {
  getOrganisations,
  getOrganisationById,
  createOrganisation,
  addUserToOrganization,
} from "../controllers/organization/organizationController";
import { auth } from "../middleware/authorization";

const router = Router();

router.get("/organisations", auth, getOrganisations);
router.get("/organisations/:orgId", auth, getOrganisationById);
router.post("/organisations", auth, createOrganisation);
router.post("/organisations/:orgId/users", auth, addUserToOrganization);

export default router;
