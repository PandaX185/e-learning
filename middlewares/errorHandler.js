import appError from "../utils/appError.js";

/* export default (err, req, res, next) => {
    if (err instanceof Error.ValidationError) {
        return res.status(err.code || 400).json({
            status: false,
            message: err.message || "Validation Error",
            errors: Object.keys(err.errors).map(
                (key) => err.errors[key].message
            ),
        });
    }
    if (err instanceof Error.CastError) {
        return res.status(err.code || 400).json({
            status: false,
            message: "Invalid ID Format",
        });
    }

    if (err.code === 11000) {
        // Duplicate key error
        return res.status(409).json({
            status: false,
            message: "Duplicate Key Error",
            details: err.keyValue,
        });
    }

    if (err.isOperational) {
        return res.status(err.statusCode || 400).json({
            status: false,
            message: err.message,
        });
    } else {
        return res.status( err.statusCode ||500).json({
            status: false,
            message: err.message || "Internal Server Error",
        });
    }
}; */

const duplicateError = (error) => {
    return new appError(`the ${JSON.stringify(error.keyValue)} is exist`, 400);
};

const sendErrorDev = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        error: error,
        stack: error.stack,
    });
};

const sendErrorProd = (error, res) => {
    if (error.isOperational === true) {
        console.log(error);
        return res.status(error.statusCode).json({
            status: false,
            message: error.message,
        });
    } else {
        return res.status(error.statusCode).json({
            status: false,
            message: "Something went wrong!",
        });
    }
};

export default (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || false;
    if (process.env.NODE_ENV === "dev") {
        sendErrorDev(error, res);
    } else if (
        process.env.NODE_ENV === "production" ||
        process.env.NODE_ENV === "test"
    ) {
        let err = { ...error };
        if (err.code === 11000) {
            err = duplicateError(err);
        }
        sendErrorProd(err, res);
    }
};
