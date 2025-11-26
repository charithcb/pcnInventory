import { IDocumentRepository } from "../../../domain/repositories/IDocumentRepository";
import { DocumentEntity } from "../../../domain/entities/Document";

export class UploadDocumentUseCase {
    constructor(private repo: IDocumentRepository) {}

    async execute(data: DocumentEntity) {
        return this.repo.upload(data);
    }
}
