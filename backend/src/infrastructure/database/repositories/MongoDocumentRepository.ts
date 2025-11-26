import { IDocumentRepository } from "../../../domain/repositories/IDocumentRepository";
import { DocumentEntity } from "../../../domain/entities/Document";
import { DocumentModel } from "../models/DocumentModel";

export class MongoDocumentRepository implements IDocumentRepository {
    async upload(doc: DocumentEntity) {
        const created = await DocumentModel.create(doc);
        return created.toObject();
    }

    async getByOwner(ownerType: string, ownerId: string) {
        const docs = await DocumentModel.find({ ownerType, ownerId });
        return docs.map(d => d.toObject());
    }

    async verify(documentId: string, verified: boolean) {
        const updated = await DocumentModel.findByIdAndUpdate(
            documentId,
            { verified },
            { new: true }
        );

        return updated ? updated.toObject() : null;
    }

    async delete(documentId: string) {
        const res = await DocumentModel.findByIdAndDelete(documentId);
        return !!res;
    }
}
