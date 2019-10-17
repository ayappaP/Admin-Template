import { Auth } from "aws-amplify";

const sideBarMenu = () => {
  let role = localStorage.getItem("role") || "Default";
  console.log("role",role)
  const data = [
    {
      id: "orders",
      icon: "iconsminds-blinklist",
      label: "menu.orders",
      to: "/app/orders",
      permission: ["Super", "Owner", "Staff"]
    },
    {
      id: "pages",
      icon: "simple-icon-people",
      label: "menu.staff",
      to: "/app/listUsers",
      permission: ["Super", "Owner"]
    },
    // {
    //   id: "Carousel",
    //   icon: "simple-icon-picture",
    //   label: "menu.carousel",
    //   to: "/app/carousel",
    //   permission: ["Super", "Owner"]
    // },
    // {
    //   id: "Products",
    //   icon: "iconsminds-pantone",
    //   label: "menu.products",
    //   to: "/app/products",
    //   permission: ["Super"]
    // },
    // {
    //   id: "Shop",
    //   icon: "iconsminds-shop-2",
    //   label: "menu.shops",
    //   to: "/app/shops",
    //   permission: ["Super"]
    // },
    // {
    //   id: "Offers",
    //   icon: "simple-icon-tag",
    //   label: "menu.offers",
    //   to: "/app/offers",
    //   permission: ["Super", "Owner"]
    // },
    // {
    //   id: "Transactions",
    //   icon: "iconsminds-bank",
    //   label: "menu.transactions",
    //   to: "/app/transactions",
    //   permission: ["Super", "Owner"]
    // },
    // {
    //   id: "Order History",
    //   icon: "iconsminds-receipt-4",
    //   label: "menu.orderHistory",
    //   to: "/app/orderHistory",
    //   permission: ["Super", "Owner", "Staff", "Default"]
    // }
  ];

  const sidebarRoutes = data.filter(route => {
    return route.permission && route.permission.indexOf(role) > -1;
  });
  return sidebarRoutes;
};

export default sideBarMenu;
