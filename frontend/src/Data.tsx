interface NavItemsTypes {
  link: string;
  title: string;
  protected: boolean;
  requiresAuth: boolean;
}

export const navItems: NavItemsTypes[] = [
  {
    link: "/menu",
    title: "Explore The Menu",
    protected: false,
    requiresAuth: false,
  },
  {
    link: "/book-table",
    title: "Book a Table",
    protected: false,
    requiresAuth: true,
  },
  {
    link: "/my-bookings",
    title: "My Bookings",
    protected: true,
    requiresAuth: true,
  },
];
