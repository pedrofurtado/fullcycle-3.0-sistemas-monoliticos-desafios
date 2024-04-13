import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { ClientModel } from "./client.model";
import { OrderModel } from "./order.model";
import { ProductModel } from "./product.model";

export default class CheckoutRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        await OrderModel.create({
            id: order.id.id,
            client_id: order.client.id.id,
            client: {
                id: order.client.id.id,
                name: order.client.name,
                email: order.client.email,
                address: order.client.address,
                order_id: order.id.id
            },
            products: order.products.map((product) => ({
                id: product.id.id,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
                order_id: order.id.id
            })),
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        },
        {
            include: [{ model: ProductModel }, { model: ClientModel }]
        })
    }

    async findOrder(id: string): Promise<Order> {
        const order = await OrderModel.findOne({
            where: { id },
            include: ["client", "products"]
        })

        if (!order) {
            throw new Error("Order not found")
        }

        return new Order({
            id: new Id(order.id),
            client: new Client({
                id: new Id(order.client.id),
                name: order.client.name,
                email: order.client.email,
                address: order.client.address
            }),
            products: order.products.map((product) => new Product({
                id: new Id(product.id),
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice
            })),
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        })
    }
}