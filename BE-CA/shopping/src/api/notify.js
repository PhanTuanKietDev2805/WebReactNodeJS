const NotifyService = require("../services/notify-service");
const { authorize } = require("./middlewares/authorize");
module.exports = async (app, channel) => {
  const service = new NotifyService();

  app.get("/getAllNotify", authorize("ADMIN"), async (req, res, next) => {
    const notifies = await service.getAlls();
    return res.status(200).json(notifies);
  });

  app.post("/readNotify/:id", authorize("ADMIN"), async (req, res, next) => {
    const { id } = req.params;
    const notify = await service.readNotify(id);
    return res.status(200).json(notify);
  });
};
