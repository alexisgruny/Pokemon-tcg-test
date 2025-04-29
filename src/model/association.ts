import Set from './set';
import Card from './card';

// Définir les relations entre Set et Card
Set.hasMany(Card, { foreignKey: 'setId', as: 'cards' });
Card.belongsTo(Set, { foreignKey: 'setId', as: 'set' });