interface NavItemsTypes {
  link: string;
  title: string;
  protected: boolean;
  requiresAuth: boolean;
  requireAdmin: boolean;
}

export const navItems: NavItemsTypes[] = [
  {
    link: "/menu",
    title: "Explore The Menu",
    protected: false,
    requiresAuth: false,
    requireAdmin: false,
  },
  {
    link: "/book-table",
    title: "Book a Table",
    protected: false,
    requiresAuth: true,
    requireAdmin: false,
  },
  {
    link: "/my-bookings",
    title: "My Bookings",
    protected: true,
    requiresAuth: true,
    requireAdmin: false,
  },
  {
    link: "/order-history",
    title: "Order History",
    protected: true,
    requiresAuth: true,
    requireAdmin: false,
  },
  {
    link: "/admin",
    title: "Admin Dashboard",
    protected: true,
    requiresAuth: true,
    requireAdmin: true,
  },
];
