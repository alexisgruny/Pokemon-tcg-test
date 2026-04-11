import Set from './set';
import Card from './card';
import User from './user';
import OwnedCard from './ownedCard';
import WantedCard from './wantedCard';

// Définir les relations entre Set et Card
Set.hasMany(Card, { foreignKey: 'setId', as: 'cards' });
Card.belongsTo(Set, { foreignKey: 'setId', as: 'set' });

//définir les relations entre User et OwnedCard  
User.hasMany(OwnedCard, { foreignKey: 'userId', as: 'ownedCards' });
Card.hasMany(OwnedCard, { foreignKey: 'cardId', as: 'ownedCards' });
OwnedCard.belongsTo(User, { foreignKey: 'userId', as: 'user' });
OwnedCard.belongsTo(Card, { foreignKey: 'cardId', as: 'card' });

// WantedCard associations
User.hasMany(WantedCard, { foreignKey: 'userId', as: 'wantedCards' });
Card.hasMany(WantedCard, { foreignKey: 'cardId', as: 'wantedCards' });
WantedCard.belongsTo(User, { foreignKey: 'userId', as: 'user' });
WantedCard.belongsTo(Card, { foreignKey: 'cardId', as: 'card' });