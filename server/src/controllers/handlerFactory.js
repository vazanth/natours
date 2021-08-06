const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document)
      return next(
        new AppError(`No document found with ID ${req.params.id}`, 404),
      );
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document)
      return next(
        new AppError(`Id - ${req.params.id} provided is not available`),
      );

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        document,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (popOptions) query.populate('reviews');
    const document = await query;
    // document.findOne({_id: req.params.id})
    if (!document) {
      return next(
        new AppError(`Id - ${req.params.id} provided is not available`),
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // to allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const queryResult = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .limitFields()
      .sort()
      .paginate();
    // const document = await queryResult.query.explain();
    const document = await queryResult.query;
    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        document,
      },
    });
  });
