import { IDocumentRepository } from "../../../domain/repositories/IDocumentRepository";

export class GetDocumentsByOwnerUseCase {
    constructor(private repo: IDocumentRepository) {}

    async execute(ownerType: string, ownerId: string) {
        return this.repo.getByOwner(ownerType, ownerId);
    }
}
