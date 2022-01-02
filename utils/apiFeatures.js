class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      // Filtering
      const queryObj = { ...this.queryString };
      const excluededFields = ["page", "sort", "limit", "fields"];
      excluededFields.forEach((el) => delete queryObj[el]);
  
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      // console.log(JSON.parse(queryStr))
  
      this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    sort() {
      //Sorting
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(",").join("");
        console.log(sortBy);
        this.query = this.query.sort(sortBy);
        //  sort (price ratingAverage)
      } else {
        // - is used for decsending order
        this.query = this.query.sort("-createdAt");
      }
  
      return this;
    }
  
    limitFields() {
      // Limiting
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else {
        // - remove the __v from the result
        this.query = this.query.select("-__v");
      }
  
      return this;
    }
  
    paginate() {
      // Pagination
      // Multiplying by number to string to integer
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      // current page - 1 * limit
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
  
      // if (this.queryString.page) {
      //   const numTours = await Tour.countDocuments();
      //   if (skip >= numTours) throw new Error("This page does not exist");
      // }
  
      return this;
    }
  }

module.exports = APIFeatures;