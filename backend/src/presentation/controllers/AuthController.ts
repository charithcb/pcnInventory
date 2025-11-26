import { Request, Response } from 'express';
import { MongoUserRepository } from '../../infrastructure/database/repositories/MongoUserRepository';
import { RegisterUserUseCase } from '../../application/usecases/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/usecases/auth/LoginUserUseCase';
import { AppError } from '../../shared/errors/AppError';
import { logAudit } from '../../shared/services/auditLogger';

const userRepository = new MongoUserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

export class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password } = req.body;

            const user = await registerUserUseCase.execute({ name, email, password });

            // Do not send password back
            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const { token, user } = await loginUserUseCase.execute({ email, password });

            await logAudit({
                action: 'LOGIN_SUCCESS',
                userId: user.id,
                entityType: 'USER',
                entityId: user.id,
                success: true,
                description: `User ${user.email} logged in`
            });

            res.json({ token });
        } catch (error) {
            const { email } = req.body;
            const existingUser = email ? await userRepository.findByEmail(email) : null;

            await logAudit({
                action: 'LOGIN_FAILURE',
                userId: existingUser?.id,
                entityType: 'USER',
                entityId: existingUser?.id,
                success: false,
                description: 'Login attempt failed',
                metadata: { email }
            });

            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
}
