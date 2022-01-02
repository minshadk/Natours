const Tour = require("./../models/tourModel");

const APIFeatures = require("./../utils/apiFeatures");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    console.log(req.query.fields);

    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    // query.sort().select().skip().limit()
    // const tours = await query;

    // Sending response
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // finding value by fecthing value from params
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id:req.params.id})

    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    //   console.log(req.body)
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    // id,body , optional
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    // in rest api data is noted send to clinet in a delete operation
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      // Contetions  slect *
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          // Group by
          // _id: null,
          // _id: '$difficulty',
          _id: { $toUpper: "$difficulty" },
          // _id: "$ratingsAverage",

          //Agrigate function
          // Add 1 to the sum each item
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },
      {
        // 1 is for accending
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: "EASY" } }
      // }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

// exports.getMonthlyPlan = async (req, res) => {
//   try {
//     const year = req.params.year * 1;
//     console.log(year)

//     const plan = await Tour.aggregate([
//       {
//         $unwind: "$startDates"
//       }
//     ]);
//     console.log(plan)

//     res.stats(200).json({
//       status: "success",
//       data: {
//         plan
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err
//     });
//   }
// };

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates"
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          // grouping number of tours starting at same date
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          // push the tour starting at same date into a array
          tours: { $push: "$name" }
        }
      },
      // Adding new field month
      {
        $addFields: { month: "$_id" }
      },
      {
        $project:{
          _id:0
        }
      },
      {
        $sort:{numTourStarts:-1}
      },
      {
        $limit:12
      }
    ]);

    res.status(200).json({
      stats: "success",
      data: {
        plan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
