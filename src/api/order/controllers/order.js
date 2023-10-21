"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
// This is my test secret API key.
const stripe = require("stripe")(`${process.env.STRAPI_SECRET_KEY}`);
const express = require("express");
const app = express();
app.use(express.static("public"));

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async customOrderController(ctx) {
    const entries = await strapi.entityService.findMany(
      "api::product.product",
      {
        fields: ["title"],
        limit: 2,
      }
    );
    const json = {
      data: entries,
    };
    return json;
  },

  async create(ctx) {
    try {
      console.log("This is running");
      const { products } = ctx.request.body;
      console.log("The products are :-", products);
      const lineItems = await Promise.all(
        products.map(async (product) => {
          const productEntities = await strapi.entityService.findMany(
            "api::product.product",
            {
              filters: {
                key: product.key,
              },
            }
          );
          const realProduct_backend = productEntities[0];
          return {
            price_data: {
              //price_data gives us more details about the price of the respective product
              currency: "inr",
              product_data: {
                name: realProduct_backend.title,
                images: [product.image],
              },
              unit_amount: realProduct_backend.price * 100,
            },
            quantity: product.quantity,
          };
        })
      );

      console.log("The lineItems are:-", lineItems);
      // This will create a session and return a session Id
      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {
          allowed_countries: ["IN"],
        },
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_BASE_URL}/payments/success`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/payments/failure`,
      });

      console.log("The session is:-", session);

      await strapi.entityService.create("api::order.order", {
        data: {
          stripeId: session.id,
          products,
        },
      });
      return { stripeId: session.id };
    } catch (error) {
      console.log("The error is :-", error);
      ctx.response.status = 500;
      return { error: error };
    }
    // try {
    //   // const { products } = ctx.request.body;

    //   // console.log("The products in this order are :-", ctx);
    //   // await strapi.entityService.create("api::order.order", {
    //   //   stripeId: "dummy",
    //   //   products,
    //   // });

    //   return { success: true };
    // } catch (error) {
    //   console.log("The error is", error);
    //   ctx.response.status = 500;
    //   return error;
    // }
  },
}));
