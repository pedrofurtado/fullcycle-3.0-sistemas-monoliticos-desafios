import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "./invoice-items.entity";

type InvoiceProps = {
    id: Id;
    name: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    items: {
        id?: string;
        name: string;
        price: number;
    }[];
    createdAt?: Date
    updatedAt?: Date
};

export default class Invoice extends BaseEntity implements AggregateRoot {
    private _name: string;
    private _document: string;
    private _address: Address;
    private _items: InvoiceItems[];

    constructor(props: InvoiceProps) {
        super(props.id, props.createdAt, props.updatedAt);
        this._name = props.name;
        this._document = props.document;
        this._address = new Address(props.street, props.number, props.complement, props.city, props.state, props.zipCode);
        this._items = props.items.map((item) => new InvoiceItems({
            id: new Id(item.id),
            name: item.name,
            price: item.price
        }));
    }

    get name(): string {
        return this._name;
    }

    get document(): string {
        return this._document;
    }

    get address(): Address {
        return this._address;
    }

    get items(): InvoiceItems[] {
        return this._items;
    }

    set name(name: string) {
        this._name = name;
    }

    set document(document: string) {
        this._document = document;
    }

    set address(address: Address) {
        this._address = address;
    }

    set items(items: InvoiceItems[]) {
        this._items = items;
    }
}