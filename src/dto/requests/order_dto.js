const createOrderDetail = () => {
  const data = {
    FoodId: 0,
    quantity: 0,
    price: 0,
  };

  return data;
};

const ordersDetail = () => {
  const orderList = {
    id: undefined,
    invoice: undefined,
    time: undefined,
    store: '',
    total: 0,
    status: 0,
    foods: [],
  };
  const foodList = {
    name: '',
    quantity: 0,
    price: 0,
    image: '',
  };

  return { orderList, foodList };
};

export { createOrderDetail, ordersDetail };
