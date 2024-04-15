import { Sequelize } from "sequelize-typescript"
import { OrderModel } from "../repository/order.model"
import { ClientModel } from "../repository/client.model"
import { ProductModel } from "../repository/product.model"
import { PlaceOrderFacadeInputDto } from "./checkout.facade.interface"
import CheckoutRepository from "../repository/checkout.repository"
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase"
import CheckoutFacade from "./checkout.facade"

describe("Checkout facade test", () => {
    let sequelize: Sequelize
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
      })
  
      await sequelize.addModels([OrderModel, ClientModel, ProductModel]);
      await sequelize.sync()
    })
  
    afterEach(async () => {
      await sequelize.close()
    })

    it("should generate a order", async () => {
      const client = {
        id: "1c",
        name: "Client 1",
        email: "client@x.com",
        document: "Document 1",
        address: {
          id: "1",
          street: "Street 1",
          number: "1",
          complement: "Complement 1",
          city: "Lages",
          state: "SC",
          zipCode: "88888-88"
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const product = {
        productId: "1p",
        stock: 10
      }

      const storeProduct = {
        id: "1p",
        name: "Product 1",
        description: "Description 1",
        salesPrice: 110
      }

      const invoice = {
        id: "1v",
        name: "Client 1",
        document: "Document 1",
        street: "Street 1",
        number: "1",
        complement: "Complement 1",
        city: "Lages",
        state: "SC",
        zipCode: "88888-88",
        items: [{
          id: "1p",
          name: "Product 1",
          price: 110
        }],
        total: 110
      }

      const payment = {
        transactionId: "t1",
        orderId: "o1",
        amount: 110,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date()    
      }

      const clientFacadeMock = {
        find: jest.fn().mockReturnValue(client),
        add: jest.fn()
      }
      const productFacadeMock = {
        checkStock: jest.fn().mockReturnValue(product),
        addProduct: jest.fn()
      }
      const storeCatalogFacadeMock = {
        find: jest.fn().mockReturnValue(storeProduct),
        findAll: jest.fn()
      }
      const checkoutRepository = new CheckoutRepository();
      const invoiceFacadeMock = {
        generate: jest.fn().mockReturnValue(invoice),
        find: jest.fn()
      }
      const paymentFacadeMock = {
        process: jest.fn().mockReturnValue(payment)
      }
      const placeOrderUseCase = new PlaceOrderUseCase(
          clientFacadeMock,
          productFacadeMock,
          storeCatalogFacadeMock,
          checkoutRepository,
          invoiceFacadeMock,
          paymentFacadeMock
      );

      const facade = new CheckoutFacade(placeOrderUseCase);

      const input: PlaceOrderFacadeInputDto = {
          clientId: "1c",
          products: [{
              productId: "1p"
          }]
      }

      await facade.placeOrder(input)

      const result = await OrderModel.findAll({include: ["client", "products"]})

      expect(result).toBeDefined()
      expect(result.length).toEqual(1)
      expect(result[0].id).toBeDefined()
      expect(result[0].client.id).toEqual(client.id)
      expect(result[0].client.name).toEqual(client.name)
      expect(result[0].client.email).toEqual(client.email)
      expect(result[0].client.address).toEqual(client.address.street)
      expect(result[0].products[0].id).toEqual(storeProduct.id)
      expect(result[0].products[0].name).toEqual(storeProduct.name)
      expect(result[0].products[0].description).toEqual(storeProduct.description)
      expect(result[0].products[0].salesPrice).toEqual(storeProduct.salesPrice)
      expect(result[0].status).toEqual(payment.status)
      expect(result[0].createdAt).toBeDefined()
      expect(result[0].updatedAt).toBeDefined()
    })
})