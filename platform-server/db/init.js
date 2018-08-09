var dbConfig = require('./config');

module.exports = {
  getDatabase: function() {
    const currentDb = dbConfig.currentDatabase;
    switch (currentDb) {
      case 'mongodb':
        return require('./mongodb/init');
      default:
        return null;
    }
  }
}
