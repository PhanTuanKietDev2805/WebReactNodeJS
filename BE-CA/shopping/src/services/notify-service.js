const { NotifyRepository } = require("../database");
const { FormateData } = require("../utils");

class NotifyService {
  constructor() {
    this.repository = new NotifyRepository();
  }

  async getAlls() {
    const notifies = await this.repository.getAlls();
    return FormateData(notifies);
  }

  async create(_message, detailId) {
    const newNotify = await this.repository.create(_message, detailId);
    return FormateData(newNotify);
  }

  async readNotify(_id) {
    const newNotify = await this.repository.readNotify(_id);
    return FormateData(newNotify);
  }
}

module.exports = NotifyService;
