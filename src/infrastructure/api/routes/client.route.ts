import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../../../modules/@shared/domain/value-object/address";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
    try
    {
        const facade = ClientAdmFacadeFactory.create();
        const input = {
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: new Address(
                req.body.address._street,
                req.body.address._number,
                req.body.address._complement,
                req.body.address._city,
                req.body.address._state,
                req.body.address._zipCode
            )
        };
        await facade.add(input);
        res.send();
    } catch (err) {
        res.status(500).send(err);
    }
})