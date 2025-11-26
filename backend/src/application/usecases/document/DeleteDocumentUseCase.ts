import { IDocumentRepository } from "../../../domain/repositories/IDocumentRepository";

export class DeleteDocumentUseCase {
    constructor(private repo: IDocumentRepository) {}

    async execute(documentId: string) {
        return this.repo.delete(documentId);
    }
}
