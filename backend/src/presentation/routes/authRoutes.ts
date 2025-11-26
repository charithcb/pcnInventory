import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticateUser } from "../middlewares/authenticateUser";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get("/me", authenticateUser, (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({ user: req.user });
});

export default router;
