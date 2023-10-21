module.exports = {
  routes: [
    {
      method: "GET",
      path: "/orders/customOrder",
      handler: "order.customOrderController", //order is the file name  in the controller folder and customOrderController in the action or function
    },
    //  If we need more custom routers and controllers
    // {
    //   method: "GET",
    //   path: "/orders/customOrder",
    //   handler: "order.customOrderController", //order is the file name and customOrderController in the action of function
    // },
  ],
};
