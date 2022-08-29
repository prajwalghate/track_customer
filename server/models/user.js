var mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

var userSchema = new mongoose.Schema(
	{
		key: {
			type: String,
			required: true,
			unique: true,
		},
		clientip: {
			type: String,
			required: true,
			maxlength: 32,
			trim: true,
		},
		cookiesAllowed: {
			type: Boolean,
		},
		lang: {
			type: String,
			trim: true,
		},
		device: {
			type: String,
			trim: true,
		},
		browser: {
			type: String,
		},
		windowDimensions: {
			width: {
				type: Number,
			},
			height: {
				type: Number,
			},
		},
	},
	{ timestamps: true }
);

// userSchema
// 	.virtual("password")
// 	.set(function (password) {
// 		this._password = password;
// 		this.salt = uuidv1();
// 		this.encry_password = this.securePassword(password);
// 	})
// 	.get(function () {
// 		return this._password;
// 	});

// userSchema.methods = {
// 	autheticate: function (plainpassword) {
// 		return this.securePassword(plainpassword) === this.encry_password;
// 	},

// 	securePassword: function (plainpassword) {
// 		if (!plainpassword) return "";
// 		try {
// 			return crypto
// 				.createHmac("sha256", this.salt)
// 				.update(plainpassword)
// 				.digest("hex");
// 		} catch (err) {
// 			return "";
// 		}
// 	},
// };

module.exports = mongoose.model("User", userSchema);
