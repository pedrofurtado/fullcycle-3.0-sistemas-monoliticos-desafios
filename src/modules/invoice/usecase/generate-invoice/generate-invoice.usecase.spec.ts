import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const invoice = {
    name: "Invoice 1",
    document: "Document 1",
    street: "Street 1",
    number: "1",
    complement: "Complement",
    city: "Lages",
    state: "SC",
    zipCode: "880000",
    items: {
        id: "1",
        name: "Item 1",
        price: 2
    }
}

const MockRepository = () => {
    return {
      generate: jest.fn().mockReturnValue(invoice),
      find: jest.fn(),
    };
};

describe("Generate invoice usecase unit test", () => {
    it("should generate a invoice", async () => {
        const invoiceRepository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(invoiceRepository);

        const input = {
            name: "Invoice 1",
            document: "Document 1",
            street: "Street 1",
            number: "1",
            complement: "Complement",
            city: "Lages",
            state: "SC",
            zipCode: "880000",
            items: [{
                id: "1",
                name: "Item 1",
                price: 2
            },
            {
                id: "2",
                name: "Item 2",
                price: 3
            }]
        };

        const result = await usecase.execute(input);

        expect(invoiceRepository.generate).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        expect(result.items[0].id).toBe(input.items[0].id);
        expect(result.items[0].name).toBe(input.items[0].name);
        expect(result.items[0].price).toBe(input.items[0].price);
        expect(result.items[1].id).toBe(input.items[1].id);
        expect(result.items[1].name).toBe(input.items[1].name);
        expect(result.items[1].price).toBe(input.items[1].price);
        expect(result.total).toBe(input.items[0].price + input.items[1].price);
    });
});