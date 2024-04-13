import { Sequelize } from "sequelize-typescript"
import request from "supertest";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import InvoiceItemsModel from "../../../modules/invoice/repository/invoice-items.model";
import express, { Express } from "express";
import { invoiceRoute } from "../routes/invoice.route";

describe("E2E test for invoice", () => {
    let sequelize: Sequelize
    const app: Express = express()
    app.use(express.json())
    app.use("/invoice", invoiceRoute);

    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
      })
  
      await sequelize.addModels([InvoiceModel,InvoiceItemsModel])
      await sequelize.sync()
    })
  
    afterEach(async () => {
      await sequelize.close()
    })

    it("should find a invoice", async () => {
        const invoice = {
            id: "1",
            name: "Invoice 1",
            document: "Document 1",
            street: "Street 1",
            number: "1",
            complement: "Complement",
            city: "Lages",
            state: "SC",
            zipCode: "88888-888",
            items: [
              {
                id: "1",
                name: "Item 1",
                price: 2
              },
              {
                id: "2",
                name: "Item 2",
                price: 4
              }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        }
          
        await InvoiceModel.create(invoice, { include: [{ model: InvoiceItemsModel }] });

        const invoiceResponse = await request(app)
            .get("/invoice/" + invoice.id)
        
        expect(invoiceResponse.status).toEqual(200)
        expect(invoiceResponse.body.id).toEqual(invoice.id)
        expect(invoiceResponse.body.name).toEqual(invoice.name)
        expect(invoiceResponse.body.document).toEqual(invoice.document)
        expect(invoiceResponse.body.address.street).toEqual(invoice.street)
        expect(invoiceResponse.body.address.number).toEqual(invoice.number)
        expect(invoiceResponse.body.address.complement).toEqual(invoice.complement)
        expect(invoiceResponse.body.address.city).toEqual(invoice.city)
        expect(invoiceResponse.body.address.state).toEqual(invoice.state)
        expect(invoiceResponse.body.address.zipCode).toEqual(invoice.zipCode)
        expect(invoiceResponse.body.items[0].id).toEqual(invoice.items[0].id)
        expect(invoiceResponse.body.items[0].name).toEqual(invoice.items[0].name)
        expect(invoiceResponse.body.items[0].price).toEqual(invoice.items[0].price)
        expect(invoiceResponse.body.items[1].id).toEqual(invoice.items[1].id)
        expect(invoiceResponse.body.items[1].name).toEqual(invoice.items[1].name)
        expect(invoiceResponse.body.items[1].price).toEqual(invoice.items[1].price)
        expect(invoiceResponse.body.total).toEqual(invoice.items[0].price + invoice.items[1].price)
        expect(new Date(invoiceResponse.body.createdAt)).toEqual(invoice.createdAt)
    });
})