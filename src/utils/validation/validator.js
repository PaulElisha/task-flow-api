/** @format */

class Validator {
  constructor(schemas) {
    this.schemas = schemas;

    Object.keys(schemas).forEach((key) => {
      this[key] = async (body) => {
        try {
          const { value } = await this.schemas[key].validateAsync(body);
          return value;
        } catch (error) {
          throw new Error(error);
        }
      };
    });
  }

  static withSchemas(schemas) {
    return new Validator(schemas);
  }
}

export default Validator;
