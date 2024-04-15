import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
    tableName: "invoice-items",
    timestamps: false
})
export default class InvoiceItemsModel extends Model {
    @PrimaryKey
    @Column({allowNull: false})
    id: string;

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    invoice_id: string;

    @Column({allowNull: false})
    name: string;

    @Column({allowNull: false})
    price: number;
}