const createOrderDetail = () => {
  const data = {
    FoodId: 0,
    quantity: 0,
    price: 0,
  };

  return data;
};

const buyerOrdersDetail = () => {
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

const recentOrder = () => {
  const data = {
    id: 0,
    buyer: '',
    status: 0,
  };

  return data;
};

const sellerOrdersDetail = () => {
  const orderList = {
    id: undefined,
    invoice: undefined,
    time: undefined,
    buyer: '',
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

export {
  createOrderDetail,
  buyerOrdersDetail,
  sellerOrdersDetail,
  recentOrder,
};
