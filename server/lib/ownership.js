const { notFoundError } = require("./errors");

const updateOwned = async (model, userId, id, data) => {
  const result = await model.updateMany({
    where: {
      id: Number(id),
      userId,
    },
    data,
  });

  if (result.count === 0) {
    throw notFoundError();
  }

  return model.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });
};

const deleteOwned = async (model, userId, id) => {
  const existing = await model.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!existing) {
    throw notFoundError();
  }

  return model.delete({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  updateOwned,
  deleteOwned,
};
