const storeDetail = () => {
  const data = {
    name: '',
    address: '',
    image: '',
  };

  return data;
};

const sellerAccount = () => {
  const data = {
    store: '',
    address: '',
    seller: '',
    email: '',
    image: '',
  };

  return data;
};

const buyerAccount = () => {
  const data = {
    name: '',
    email: '',
    image: '',
  };

  return data;
};

export { storeDetail, sellerAccount, buyerAccount };
