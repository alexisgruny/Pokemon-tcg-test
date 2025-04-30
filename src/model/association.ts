import Set from './set';
import Card from './card';
import User from './user';
import OwnedCard from './ownedCard';

// Définir les relations entre Set et Card
Set.hasMany(Card, { foreignKey: 'setId', as: 'cards' });
Card.belongsTo(Set, { foreignKey: 'setId', as: 'set' });

//définir les relations entre User et OwnedCard  
User.hasMany(OwnedCard, { foreignKey: 'userId', as: 'ownedCards' });
Card.hasMany(OwnedCard, { foreignKey: 'cardId', as: 'ownedCards' });
OwnedCard.belongsTo(User, { foreignKey: 'userId', as: 'user' });
OwnedCard.belongsTo(Card, { foreignKey: 'cardId', as: 'card' });