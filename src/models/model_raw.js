import { DataTypes } from 'sequelize';

const role = {
  name: 'Role',
  attributes: {
    id: {
      type: DataTypes.TINYINT,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  options: {
    tableName: 'roles',
  },
};

const account = {
  name: 'Account',
  attributes: {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  options: {
    tableName: 'accounts',
  },
};

const merchant = {
  name: 'Merchant',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    store: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seller: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: DataTypes.STRING,
    line: DataTypes.STRING,
    subdistrict: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    type: DataTypes.TINYINT,
    rating: DataTypes.TINYINT,
    maps_link: DataTypes.STRING,
    open_time: DataTypes.TIME,
    close_time: DataTypes.TIME,
  },
  options: {
    tableName: 'merchants',
  },
};

const food = {
  name: 'Food',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: DataTypes.STRING,
    last_photo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: DataTypes.INTEGER,
  },
  options: {
    tableName: 'foods',
    paranoid: true,
  },
};

const foodCategory = {
  name: 'FoodCategory',
  attributes: {
    id: {
      type: DataTypes.TINYINT,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  options: {
    tableName: 'food_categories',
  },
};

const order = {
  name: 'Order',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    notes: DataTypes.STRING,
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  options: {
    tableName: 'orders',
  },
};

const orderStatus = {
  name: 'OrderStatus',
  attributes: {
    id: {
      type: DataTypes.TINYINT,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  options: {
    tableName: 'order_status',
  },
};

const orderDetail = {
  name: 'OrderDetail',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  options: {
    tableName: 'order_details',
  },
};

const transaction = {
  name: 'Transaction',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    tax: DataTypes.FLOAT,
  },
  options: {
    tableName: 'transactions',
  },
};

const customer = {
  name: 'Customer',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: DataTypes.STRING,
  },
  options: {
    tableName: 'customers',
  },
};

const report = {
  name: 'Report',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  },
  options: {
    tableName: 'reports',
  },
};

export {
  role,
  account,
  merchant,
  food,
  foodCategory,
  order,
  orderStatus,
  orderDetail,
  transaction,
  report,
  customer,
};
