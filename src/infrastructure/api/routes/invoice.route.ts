import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request<{ id: string} >, res: Response) => {
    try{
        const facade = InvoiceFacadeFactory.create();
        const input = {
            id: req.params.id
        };
        const output = await facade.find(input);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});