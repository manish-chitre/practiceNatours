class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let excludedFields = ["sort", "fields", "limit", "page"];
    let queryObj = {...this.queryString};
    excludedFields.forEach((ele) => delete queryObj[ele]);

    this.query = this.query.find(queryObj);

    return this;
  }

  fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = req.query.sort.split(",").join(" "); //{-price -ratingsAverage}
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-_id");
    }
    return this;
  }

  pagination() {
    //pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
