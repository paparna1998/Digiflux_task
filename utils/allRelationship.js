const allModels = require('./allModels');

exports.All_Model_Relationship = () => {
    //user realtion
    allModels.UserModel.hasMany(allModels.ShortUrl_Model);
    allModels.ShortUrl_Model.belongsTo(allModels.UserModel);

    allModels.ShortUrl_Model.hasMany(allModels.Click_Model);
    allModels.Click_Model.belongsTo(allModels.ShortUrl_Model);
};

