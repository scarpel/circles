export class DuplicatedDocumentError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'DuplicatedDocumentError';
  }
}
