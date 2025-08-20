import logger from "./logger.js";

class Shiprocket {
    constructor() {
        this.apiUrl = "https://apiv2.shiprocket.in/v1/external";
        this.email = process.env.SHIPROCKET_EMAIL;
        this.password = process.env.SHIPROCKET_PASSWORD;
        this.token = null;
    }

    async initialize() {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: this.email,
                    password: this.password,
                }),
            }).then((res) => res.json());
            this.token = response.token;
        } catch (error) {
            logger.error(error);
        }
    }

    async calculateShippingRate(deliveryPinCode, totalWeight) {
        try {
            const serviceabilityUrl = `${this.apiUrl}/courier/serviceability` +
                `?pickup_postcode=110045&delivery_postcode=${deliveryPinCode}` +
                `&weight=${totalWeight}&cod=0`;
            const response = await fetch(serviceabilityUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            }).then((res) => res.json());
            const companyId = response.data.shiprocket_recommended_courier_id;
            const deliveryData =
                response.data.available_courier_companies.find(
                    (x) => (x.courier_company_id = companyId),
                );
            return deliveryData;
        } catch (error) {
            logger.error(error);
        }
    }
    async createOrder(orderDetails, courierCompanyId) {
        try {
            const order = await fetch(`${this.apiUrl}/orders/create/adhoc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
                body: JSON.stringify(orderDetails),
            }).then((res) => res.json());
            const shipmentDetails = {
                shipment_id: order.shipment_id,
                courier_id: courierCompanyId,
            };
            const shipment = await fetch(`${this.apiUrl}/courier/assign/awb`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.token}`,
                },
                body: JSON.stringify(shipmentDetails),
            }).then((res) => res.json());
            return shipment;
        } catch (error) {
            logger.error(error);
        }
    }
}

export default new Shiprocket();
