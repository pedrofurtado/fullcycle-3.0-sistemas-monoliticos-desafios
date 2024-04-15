import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { checkoutRoute } from "./routes/checkout.route";
import { productRoute } from "./routes/product.route";
import { clientRoute } from "./routes/client.route";
import { invoiceRoute } from "./routes/invoice.route";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import InvoiceItemsModel from "../../modules/invoice/repository/invoice-items.model";

export const app: Express = express();
app.use(express.json());
app.use("/checkout", checkoutRoute);
app.use("/clients", clientRoute);
app.use("/invoice", invoiceRoute);
app.use("/products", productRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false
  });
  await sequelize.addModels([TransactionModel, ClientModel, InvoiceModel, ProductModel, InvoiceItemsModel]);
  await sequelize.sync();
}
setupDb();
