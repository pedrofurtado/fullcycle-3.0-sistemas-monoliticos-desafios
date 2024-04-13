import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItemsModel from "./invoice-items.model";

describe("InvoiceRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([InvoiceModel,InvoiceItemsModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });

    it("should generate a invoice", async () => {
        const invoiceRepository = new InvoiceRepository();

        const input = new Invoice({
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
            }]
        });

        await invoiceRepository.generate(input);

        const invoiceDb = await InvoiceModel.findOne({
            where: { id: "1" },
            include: ["items"]
        });

        expect(invoiceDb).toBeDefined();
        expect(invoiceDb.id).toEqual(input.id.id);
        expect(invoiceDb.name).toEqual(input.name);
        expect(invoiceDb.document).toEqual(input.document);
        expect(invoiceDb.street).toEqual(input.address.street);
        expect(invoiceDb.number).toEqual(input.address.number);
        expect(invoiceDb.complement).toEqual(input.address.complement);
        expect(invoiceDb.city).toEqual(input.address.city);
        expect(invoiceDb.state).toEqual(input.address.state);
        expect(invoiceDb.zipCode).toEqual(input.address.zipCode);
        expect(invoiceDb.items[0].id).toEqual(input.items[0].id.id);
        expect(invoiceDb.items[0].name).toEqual(input.items[0].name);
        expect(invoiceDb.items[0].price).toEqual(input.items[0].price);
        expect(invoiceDb.createdAt).toEqual(input.createdAt);
        expect(invoiceDb.updatedAt).toEqual(input.updatedAt);
    });

    it("should find a invoice", async () => {
        const invoice = await InvoiceModel.create({
          id: "2",
          name: "Invoice number 2",
          document: "Document 2",
          street: "Street 2",
          number: "2",
          complement: "Complement",
          city: "Lages",
          state: "SC",
          zipCode: "880000",
          items: [{
              id: "2",
              name: "Item 2",
              price: 4
          }],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          include: [{ model: InvoiceItemsModel }],
        });

        const invoiceRepository = new InvoiceRepository();
        const result = await invoiceRepository.find(invoice.id);

        expect(result).toBeDefined();
        expect(result.id.id).toEqual(invoice.id);
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.address.street).toEqual(invoice.street);
        expect(result.address.number).toEqual(invoice.number);
        expect(result.address.complement).toEqual(invoice.complement);
        expect(result.address.city).toEqual(invoice.city);
        expect(result.address.state).toEqual(invoice.state);
        expect(result.address.zipCode).toEqual(invoice.zipCode);
        expect(result.items[0].id.id).toEqual(invoice.items[0].id);
        expect(result.items[0].name).toEqual(invoice.items[0].name);
        expect(result.items[0].price).toEqual(invoice.items[0].price);
        expect(result.createdAt).toStrictEqual(invoice.createdAt)
        expect(result.updatedAt).toStrictEqual(invoice.updatedAt)
   
    });
})