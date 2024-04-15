import express, { Request, Response } from "express";
import CheckoutFacadeFactory from "../../../modules/checkout/factory/checkout.facade.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
    try
    {
        const facade = CheckoutFacadeFactory.create()
        const input = {
            clientId: req.body.clientId,
            products: req.body.products
        }

        const output = await facade.placeOrder(input)
        res.send(output)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})