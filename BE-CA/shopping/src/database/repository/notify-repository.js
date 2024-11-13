const mongoose = require("mongoose");
const { NotifyModel } = require("../models");

class NotifyRepository {
  async getAlls() {
    const notifies = await NotifyModel.find().sort([["createdAt", "desc"]]);
    return notifies;
  }

  async create(_message, detailId) {
    const newNotify = new NotifyModel({
      massage: _message,
      detailId: detailId,
      isRead: false,
    });
    newNotify.save();
    return newNotify;
  }

  async readNotify(_id) {
    const notify = await NotifyModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          isRead: true,
        },
      },
      { new: true }
    );
    return notify;
  }
}
module.exports = NotifyRepository;
