const allFoods = () => {
  const data = {
    id: 0,
    is_valid: false,
    name: '',
    price: 0,
    mam_rates: 0,
    image: '',
  };

  return data;
};

const findFoods = () => {
  const seller = {
    id: 0,
    name: '',
    address: '',
  };
  const food = {
    id: 0,
    name: 0,
    price: 0,
    mam_rates: 0,
    image: '',
    seller,
  };

  return food;
};

const singleFood = () => {
  const data = {
    name: '',
    category: '',
    price: 0,
    mam_rates: 0,
    image: '',
    mam_image: '',
  };

  return data;
};

export { allFoods, findFoods, singleFood };
