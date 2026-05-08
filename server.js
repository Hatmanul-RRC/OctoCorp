import { Sequelize, DataTypes } from 'sequelize';

// .env Connection Data
require('dotenv').config()

/**
 * 1. Database Configuration
 */
const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PWD, {
  host: process.env.DB_HOST,
  dialect: 'mariadb',
  logging: false,
  pool: {
    max: parseInt(process.env.DB_LIMIT) | 5,  // Maximum number of connection in pool
    min: 0,                                   // Minimum number of connection in pool
    acquire: 30000,                           // Maximum time (ms) that pool will try to get connection before throwing error
    idle: 10000                               // Maximum time (ms) that a connection can be idle before being released
  },
  dialectOptions: {
    connectTimeout: 1000,
  },
});

/**
 * 2. Model Definition
 */
const User = sequelize.define('User', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  username: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  email: { 
    type: DataTypes.STRING, 
    validate: { 
        isEmail: true 
    } 
  },
  password_hash: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  password_salt: { 
    type: DataTypes.STRING 
  },
  last_seen: {
    type: DataTypes.DATE
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW 
  }
});

const Role = sequelize.define('Role', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  permissions_mask: { 
    type: DataTypes.INTEGER
  }
});

const Channel = sequelize.define('Channel', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  title: {
    type: DataTypes.STRING, 
    allowNull: false 
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW 
  }
});

const DirectMessage = sequelize.define('DirectMessage', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  content: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  timestamp: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  last_seen: {
    type: DataTypes.DATE
  }
});

const ChannelMessage = sequelize.define('ChannelMessage', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  content: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  timestamp: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
});

/**
 * 3. Relatii (Asocieri)
 */
User.belongsToMany(Role, { through: 'UserRoles' });
Role.belongsToMany(User, { through: 'UserRoles' });

User.hasMany(DirectMessage, { as: 'SentMessages', foreignKey: 'sender_id' });
User.hasMany(DirectMessage, { as: 'ReceivedMessages', foreignKey: 'recipient_id' });

Channel.belongsTo(User, { as: 'Owner', foreignKey: 'owner_id' });
Channel.hasMany(ChannelMessage, { foreignKey: 'channel_id' });
ChannelMessage.belongsTo(User, { foreignKey: 'sender_id' });

/**
 * 4. Main Execution Function
 */
