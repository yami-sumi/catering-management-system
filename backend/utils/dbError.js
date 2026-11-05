// Maps PostgreSQL error codes to meaningful HTTP responses.
function sendDbError(res, error, fallbackMessage) {
    console.error(fallbackMessage, "-", error.message);

    switch (error.code) {
        case "23503": // foreign_key_violation
            return res.status(409).json({
                message: "Operation blocked: this record is still used by other records, or it points to a record that does not exist."
            });
        case "23505": // unique_violation
            return res.status(409).json({
                message: "A record with the same unique value already exists."
            });
        case "23502": // not_null_violation
            return res.status(400).json({
                message: "A required field is missing."
            });
        case "23514": // check_violation
        case "22P02": // invalid_text_representation
        case "22007": // invalid_datetime_format
        case "22003": // numeric_value_out_of_range
        case "22001": // string_data_right_truncation
            return res.status(400).json({
                message: "One or more values are invalid."
            });
        default:
            return res.status(500).json({ message: fallbackMessage });
    }
}

module.exports = { sendDbError };
