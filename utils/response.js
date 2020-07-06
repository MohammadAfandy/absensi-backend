module.exports = ({ status, message, data, error }) => {
  return {
    status: status || 200,
    message: message || "",
    data: data || null,
    error: error || null,
  };
};
