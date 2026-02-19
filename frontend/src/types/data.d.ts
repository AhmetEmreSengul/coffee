interface Coffee {
  _id?: string;
  title: string;
  type: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Coffee {
  quantity: number;
}

interface OrderItem extends Coffee {
  quantity: number;
}