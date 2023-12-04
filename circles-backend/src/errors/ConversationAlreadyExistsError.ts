export class ConversationAlreadyExistsError extends Error {
  constructor(
    public readonly conversationId: string,
    message: string = 'Conversation already exists!',
  ) {
    super(message);

    this.name = 'ConversationAlreadyExists';
  }
}
