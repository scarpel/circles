export class MissingDocumentError extends Error {
  id: string;

  constructor(message: string, id?: string) {
    super(message);

    this.name = 'MissingDocumentError';
    this.id = id;
  }
}
