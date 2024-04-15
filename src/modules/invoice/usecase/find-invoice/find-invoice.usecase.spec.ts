import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice ({
    id: new Id("1"),
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
        price: 5
    }]
})

const MockRepository = () => {
    return {
      generate: jest.fn(),
      find: jest.fn().mockReturnValue(invoice),
    };
};

describe("Find invoice usecase unit test", () => {
    it("should find a invoice", async () => {
        const invoiceRepository = MockRepository()
        const usecase = new FindInvoiceUseCase(invoiceRepository)

        const input = {
            id: "1"
        }

        const result = await usecase.execute(input)

        expect(invoiceRepository.find).toHaveBeenCalled()
        expect(result.id).toEqual(invoice.id.id)
        expect(result.name).toEqual(invoice.name)
        expect(result.document).toEqual(invoice.document)
        expect(result.address.street).toEqual(invoice.address.street)
        expect(result.address.number).toEqual(invoice.address.number)
        expect(result.address.complement).toEqual(invoice.address.complement)
        expect(result.address.city).toEqual(invoice.address.city)
        expect(result.address.state).toEqual(invoice.address.state)
        expect(result.address.zipCode).toEqual(invoice.address.zipCode)
        expect(result.items[0].id).toEqual(invoice.items[0].id.id);
        expect(result.items[0].name).toEqual(invoice.items[0].name)
        expect(result.items[0].price).toEqual(invoice.items[0].price)
        expect(result.items[1].id).toEqual(invoice.items[1].id.id);
        expect(result.items[1].name).toEqual(invoice.items[1].name)
        expect(result.items[1].price).toEqual(invoice.items[1].price)
        expect(result.total).toEqual(invoice.items[0].price + invoice.items[1].price)
        expect(result.createdAt).toStrictEqual(invoice.createdAt)
    })
})