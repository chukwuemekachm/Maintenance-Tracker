/**
 * Holds all the request in memory
 */
const db = {
  requests: [{
    id: 0,
    title: 'Bad Air Conditioner',
    type: 'Repair',
    description: "The air conditioner makes noise and doesn't cool",
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString(),
  },
  {
    id: 1,
    title: 'My Television',
    type: 'Repair',
    description: "My Television displays black and white and doesn't dispaly colors",
    createdAt: new Date().toLocaleDateString(),
    updatedAt: new Date().toLocaleDateString(),
  },
  ],
};

export default db;
