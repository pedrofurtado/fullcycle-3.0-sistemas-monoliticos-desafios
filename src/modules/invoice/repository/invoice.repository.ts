import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: { id: id },
            include: ["items"]
        });

        if (!invoice) {
            throw new Error("Invoice not found");
        }

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            street: invoice.street,
            number: invoice.number,
            complement: invoice.complement,
            city: invoice.city,
            state: invoice.state,
            zipCode: invoice.zipCode,
            items: invoice.items.map((productItem) => ({
                id: productItem.id,
                name: productItem.name,
                price: productItem.price
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        });
    }
    async generate(input: Invoice): Promise<void> {
        await InvoiceModel.create({
            id: input.id.id,
            name: input.name,
            document: input.document,
            street: input.address.street,
            number: input.address.number,
            complement: input.address.complement,
            city: input.address.city,
            state: input.address.state,
            zipCode: input.address.zipCode,
            items: input.items.map((productItem) => ({
                id: productItem.id.id,
                name: productItem.name,
                price: productItem.price
            })),
            createdAt: input.createdAt,
            updatedAt: input.updatedAt
        },
        {
            include: [{ model: InvoiceItemsModel }],
        });
    }
}