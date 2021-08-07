var seeder = require('mongoose-seed');
require('dotenv').config();

// Data array containing seed data - documents organized by Model
var data = [
    {
        'model': 'Folder',
        'documents': [
            {
                'name': 'folder1',
            },
            {
                'name': 'folder2',
            }
        ]
    }
];
 
// Connect to MongoDB via Mongoose
seeder.connect(process.env.DB_CNN, function() {
 
  // Load Mongoose models
  seeder.loadModels([
    './models/folder.model.js',
  ]);
 
  // Clear specified collections
  seeder.clearModels(['Folder'], function() {
     // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });
 
  });
});
 
