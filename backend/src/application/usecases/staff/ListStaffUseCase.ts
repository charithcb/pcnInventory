import { IUserRepository } from '../../interfaces/IUserRepository';
import { User } from '../../../domain/entities/User';

export class ListStaffUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(): Promise<User[]> {
        return this.userRepository.listStaff();
    }
}
