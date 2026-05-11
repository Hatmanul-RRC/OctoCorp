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
  seen_at: {
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

const ChannelMessageSeen = sequelize.define('ChannelMessageSeen', {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  seen_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

/**
 * 3. Relatii (Asocieri)
 */
// --- USER & ROLES ---
// Many-to-Many: "poseda" / "atribuit_prin"
User.belongsToMany(Role, { through: 'UserRoles', foreignKey: 'user_id' });
Role.belongsToMany(User, { through: 'UserRoles', foreignKey: 'role_id' });

// --- DIRECT MESSAGES ---
// One-to-Many: "expediaza" / "primeste"
User.hasMany(DirectMessage, { as: 'SentMessages', foreignKey: 'sender_id' });
DirectMessage.belongsTo(User, { as: 'Sender', foreignKey: 'sender_id' });

User.hasMany(DirectMessage, { as: 'ReceivedMessages', foreignKey: 'recipient_id' });
DirectMessage.belongsTo(User, { as: 'Recipient', foreignKey: 'recipient_id' });

// --- CHANNELS & ROLES ---
// Many-to-Many: "autorizeaza" / "permite_acces_la" 
Channel.belongsToMany(Role, { through: 'ChannelRoles', foreignKey: 'channel_id' });
Role.belongsToMany(Channel, { through: 'ChannelRoles', foreignKey: 'role_id' });

// One-to-Many: "gestioneaza" (Owner)
User.hasMany(Channel, { foreignKey: 'owner_id' });
Channel.belongsTo(User, { as: 'Owner', foreignKey: 'owner_id' });

// --- CHANNEL MESSAGES ---
// One-to-Many: "gazduieste"
Channel.hasMany(ChannelMessage, { foreignKey: 'channel_id' });
ChannelMessage.belongsTo(Channel, { foreignKey: 'channel_id' });

// One-to-Many: "trimite"
User.hasMany(ChannelMessage, { foreignKey: 'sender_id' });
ChannelMessage.belongsTo(User, { as: 'Sender', foreignKey: 'sender_id' });

// --- MESSAGE SEEN STATUS (Read Receipts) ---
// Many-to-Many: "vizualizeaza" / "marcat_ca"
// This connects Users to the messages they have read in a channel
User.belongsToMany(ChannelMessage, { 
  through: ChannelMessageSeen, 
  foreignKey: 'user_id',
  otherKey: 'message_id' 
});
ChannelMessage.belongsToMany(User, { 
  through: ChannelMessageSeen, 
  foreignKey: 'message_id',
  otherKey: 'user_id'
});

/**
 * 4. Main Execution Function
 */
