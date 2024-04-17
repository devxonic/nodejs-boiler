export const successResponse = (req, res, data = {}) => {
    res.status(200).send({
      error: false,
      success: true,
      data: {
        successResult: data,
      },
    });
  };
  
  export const failResponse = (req, res, data = {}, extra) => {
    res.status(200).send({
      error: false,
      success: false,
      data: {
        errorResult: data,
        data: extra,
      },
    });
  };
  
  export const errorResponse = (req, res, errorDesc, errorKey, resCode = 500) => {
    console.log(">>>>>>>>>>>>>   ERROR\n", errorDesc);
    try {
    } catch (error) {
      console.log(error);
    }
    res.status(500).send({
      error: true,
      errorKey,
      errorDesc: errorDesc,
      errorMessage: errorDesc.message,
      errorStack: errorDesc.stack,
    });
  };
  