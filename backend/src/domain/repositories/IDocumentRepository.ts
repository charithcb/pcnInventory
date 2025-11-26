import { DocumentEntity } from "../entities/Document";

export interface IDocumentRepository {
    upload(doc: DocumentEntity): Promise<DocumentEntity>;
    getByOwner(ownerType: string, ownerId: string): Promise<DocumentEntity[]>;
    verify(documentId: string, verified: boolean): Promise<DocumentEntity | null>;
    delete(documentId: string): Promise<boolean>;
}
