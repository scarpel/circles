export default class NotInConversationError extends Error {
  constructor(public readonly conversationId: string) {
    super('Unable to send message to conversation');
  }
}
