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

export { allFoods, singleFood };
