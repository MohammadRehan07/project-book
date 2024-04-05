const rolesModel = require("../models/roles");
module.exports.createRole = async (req, res) => {
  try {
    const data = await rolesModel.create(req.body);
    return res
      .status(201)
      .send({ status: true, message: "created", data: data });
  } catch (err) {
    return res.status(500).send({ status: true, message: err.message });
  }
};
module.exports.RoleDetails = async (req, res) => {
  try {
    const getRole = req.params.roleId;
    const getDetails = await rolesModel.find({ _id: getRole });
    return res.status(200).send({ status: true, message: getDetails });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};
module.exports.deleteRole = async (req, res) => {
  try {
    let removeRole = req.params.Id;
    const removeData = await rolesModel.findOneAndDelete({ _id: removeRole });
    res
      .status(200)
      .send({ status: true, msg: "succesfully deleted", removeData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};
module.exports.updateRole = async (req, res) => {
  try {
    let roleId = req.params.Id;
    let requestBody = req.body;
    let update = await rolesModel.findOneAndUpdate(
      { _id: roleId },
      requestBody,
      { new: true }
    );
    res.status(201).send({ status: true, msg: "succesfull", data: update });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};