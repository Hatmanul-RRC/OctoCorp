import { Sequelize, DataTypes } from 'sequelize';
import express from 'express';

// .env Connection Data
import 'dotenv/config';

/**
 * 1. Database Configuration
 */
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
  host: process.env.DB_HOST,
  dialect: 'mariadb',
  logging: false,
  pool: {
    max: parseInt(process.env.DB_LIMIT) || 5, // Maximum number of connection in pool
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
const app = express();
app.use(express.json());

/**
 * 4. API Routes
 */

// --- USER ROUTES ---

// Create a new user (Registration)
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password_hash } = req.body;
    const user = await User.create({ username, email, password_hash });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'created_at'] // Hiding password fields for safety
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CHANNEL ROUTES ---

// Create a channel (Linking an Owner)
app.post('/api/channels', async (req, res) => {
  try {
    const { title, owner_id } = req.body;
    const channel = await Channel.create({ title, owner_id });
    res.status(201).json(channel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all channels including their Owner's info
app.get('/api/channels', async (req, res) => {
  try {
    const channels = await Channel.findAll({
      include: [{ model: User, as: 'Owner', attributes: ['username', 'email'] }]
    });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- MESSAGE ROUTES ---

// Post a message to a channel
app.post('/api/channels/:channelId/messages', async (req, res) => {
  try {
    const { content, sender_id } = req.body;
    const message = await ChannelMessage.create({
      content,
      sender_id,
      channel_id: req.params.channelId
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get messages for a channel with Sender details
app.get('/api/channels/:channelId/messages', async (req, res) => {
  try {
    const messages = await ChannelMessage.findAll({
      where: { channel_id: req.params.channelId },
      include: [{ model: User, as: 'Sender', attributes: ['username'] }],
      order: [['timestamp', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 5. Server Initialization
 */
const PORT = process.env.PORT || 3000;

async function demonstrateOwnership() {
  try {
    // 1. Create the User (The future Owner)
    const creator = await User.create({
      username: 'AliceDev',
      email: 'alice@octocorp.com',
      password_hash: 'hashed_password_here'
    });

    // 2. Create the Channel and assign Alice as the Owner
    const newChannel = await Channel.create({
      title: 'internship-projects',
      owner_id: creator.id // Using the ID from the user we just created
    });

    console.log(`✅ Channel "${newChannel.title}" created with Owner: ${creator.username}`);

    // 3. Fetch the Channel and "Eager Load" the Owner's details
    const channelWithInfo = await Channel.findOne({
      where: { title: 'internship-projects' },
      include: [{ 
        model: User, 
        as: 'Owner', 
        attributes: ['username', 'email'] // Don't fetch the password!
      }]
    });

    // Displaying the result
    console.log('--- Channel Ownership Data ---');
    console.log({
      ChannelName: channelWithInfo.title,
      OwnedBy: channelWithInfo.Owner.username,
      OwnerContact: channelWithInfo.Owner.email
    });

  } catch (error) {
    console.error('❌ Error in ownership example:', error);
  }
}

async function resetDatabase() {
  try {
    // force: true DROPS the tables and RECREATES them
    await sequelize.sync({ force: true });
    console.log('⚠️ Database dropped and recreated successfully.');
  } catch (error) {
    console.error('❌ Failed to reset database:', error);
  }
}

async function startServer() {
  try {
    // Authenticate connection
    await sequelize.authenticate();
    console.log('✅ Connection to MariaDB has been established successfully.');

    // Sync models (use { alter: true } in dev to update tables without losing data)
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized.');

    app.get('/', (req, res) => {
      res.send('<h1>OctoCorp API is Live!</h1><p>Try visiting /api/channels to see data.</p>');
    });

    // await resetDatabase();
    // await demonstrateOwnership();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start the server:', error);
  }
}

startServer();