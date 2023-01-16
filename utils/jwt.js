const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const createToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      sub: user._id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      allows: user.allows,
    };
    return jwt.sign(payload, secret, { expiresIn: "12h" }, (error, token) => {
      if (error) {
        console.log(error);
        reject("No se pudo generar el JWT");
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = {
  createToken,
};
