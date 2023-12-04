export function generateMockModel() {
  return jest.fn((dto: any) => {
    return {
      save: () => dto,
      data: dto,
    };
  });
}
