import { Sequelize } from "sequelize-typescript"
import InvoiceModel from "../repository/invoice.model"
import InvoiceItemsModel from "../repository/invoice-items.model"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"

describe("Invoice Facade test", () => {

    let sequelize: Sequelize
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
      })
  
      sequelize.addModels([InvoiceModel, InvoiceItemsModel])
      await sequelize.sync()
    })
  
    afterEach(async () => {
      await sequelize.close()
    })
  
    it("should generate a invoice", async () => {
        const facade = InvoiceFacadeFactory.create()
    
        const input = {
            name: "Invoice 1",
            document: "Document 1",
            street: "Street 1",
            number: "1",
            complement: "Complement",
            city: "Lages",
            state: "SC",
            zipCode: "88888-888",
            items: [{
            id: "1",
            name: "Item 1",
            price: 2
            }]
        }
    
        await facade.generate(input)
    
        const result = await InvoiceModel.findAll({include: ["items"]})

        expect(result).toBeDefined()
        expect(result.length).toEqual(1)
        expect(result[0].id).toBeDefined()
        expect(result[0].name).toEqual(input.name)
        expect(result[0].document).toEqual(input.document)
        expect(result[0].street).toEqual(input.street)
        expect(result[0].number).toEqual(input.number)
        expect(result[0].complement).toEqual(input.complement)
        expect(result[0].city).toEqual(input.city)
        expect(result[0].state).toEqual(input.state)
        expect(result[0].zipCode).toEqual(input.zipCode)
        expect(result[0].items[0].id).toEqual(input.items[0].id)
        expect(result[0].items[0].name).toEqual(input.items[0].name)
        expect(result[0].items[0].price).toEqual(input.items[0].price)
        expect(result[0].createdAt).toBeDefined()
        expect(result[0].updatedAt).toBeDefined()
    })
  
    it("should find a invoice", async () => {
        const facade = InvoiceFacadeFactory.create()

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
            items: [{
                id: "1",
                name: "Item 1",
                price: 2
              },
              {
                id: "2",
                name: "Item 2",
                price: 4
              }],
            createdAt: new Date(),
            updatedAt: new Date()
        }
          
        await InvoiceModel.create(invoice, { include: [{ model: InvoiceItemsModel }] });
    
        const input = {
            id: "1"
        }

        await facade.find(input)

        const result = await facade.find(input)

        expect(result).toBeDefined()
        expect(result.id).toEqual(invoice.id)
        expect(result.name).toEqual(invoice.name)
        expect(result.document).toEqual(invoice.document)
        expect(result.address.street).toEqual(invoice.street)
        expect(result.address.number).toEqual(invoice.number)
        expect(result.address.complement).toEqual(invoice.complement)
        expect(result.address.city).toEqual(invoice.city)
        expect(result.address.state).toEqual(invoice.state)
        expect(result.address.zipCode).toEqual(invoice.zipCode)
        expect(result.items[0].id).toEqual(invoice.items[0].id)
        expect(result.items[0].name).toEqual(invoice.items[0].name)
        expect(result.items[0].price).toEqual(invoice.items[0].price)
        expect(result.items[1].id).toEqual(invoice.items[1].id)
        expect(result.items[1].name).toEqual(invoice.items[1].name)
        expect(result.items[1].price).toEqual(invoice.items[1].price)
        expect(result.total).toEqual(invoice.items[0].price + invoice.items[1].price)
        expect(result.createdAt).toStrictEqual(invoice.createdAt)
    })
  })