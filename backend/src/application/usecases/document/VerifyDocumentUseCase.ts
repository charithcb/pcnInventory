import { IDocumentRepository } from "../../../domain/repositories/IDocumentRepository";

export class VerifyDocumentUseCase {
    constructor(private repo: IDocumentRepository) {}

    async execute(documentId: string, verified: boolean) {
        return this.repo.verify(documentId, verified);
    }
}
