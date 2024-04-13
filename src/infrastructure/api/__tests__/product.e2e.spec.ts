import { Sequelize } from "sequelize-typescript"
import request from "supertest";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import express, { Express } from "express";
import { productRoute } from "../routes/product.route";

describe("E2E test for product", () => {
    let sequelize: Sequelize;
    const app: Express = express()
    app.use(express.json())
    app.use("/products", productRoute)

    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([ProductModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });

    it("should create a product", async () => {
        const input = {
            id: "1p",
            name: "Product A",
            description: "Description Product A",
            purchasePrice: 2,
            salesPrice: 110,
            stock: 10
        }

        const productsResponse = await request(app)
            .post("/products")
            .send(input);

        const product = await ProductModel.findOne({ where: { id: "1p" } });

        expect(productsResponse.status).toBe(200);
        expect(product.id).toBe(input.id);
        expect(product.name).toBe(input.name);
        expect(product.description).toBe(input.description);
        expect(product.purchasePrice).toBe(input.purchasePrice);
        expect(product.salesPrice).toBe(input.salesPrice);
        expect(product.stock).toBe(input.stock);
    });
})