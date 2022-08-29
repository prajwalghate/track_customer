const User = require("../models/user");
const { generateKeyPair } = require("crypto");
const uuidv1 = require("uuid/v1");

async function generateAndWriteSSHKeyv2() {
	return new Promise((resolve, reject) => {
		generateKeyPair(
			"rsa",
			{
				namedCurve: "secp256k1", // Options
				modulusLength: 512, // Options
				publicKeyEncoding: {
					type: "spki",
					format: "der",
					//size
				},
				privateKeyEncoding: {
					type: "pkcs8",
					format: "der",
				},
			},
			(err, publicKey, privateKey) => {
				// Callback function
				if (!err) {
					// Prints new asymmetric key
					// pair after encoding
					// console.log("Public Key is: ", publicKey.toString("hex"));
					// console.log();
					// console.log("Private Key is: ", privateKey.toString("hex"));
					resolve({
						pubKey: publicKey.toString("hex"),
						priKey: privateKey.toString("hex"),
					});
				} else {
					// Prints error
					console.log("Errr is: ", err);
					resolve(console.log("Something went wrong: " + err));
				}
			}
		);
	});
}

exports.getKey = async (req, res) => {
	let { pubKey, priKey } = await generateAndWriteSSHKeyv2();
	return res.json({
		private: pubKey,
		public: priKey,
	});
};

exports.getUser = async (req, res) => {
	let pr = await User.findOne({ key: req.params.key.substring(4) });
	// console.log(pr, "user");
	return res.json(pr);
};

exports.updateUser = (req, res) => {
	console.log({ ...req.body, key: req.params.key.substring(4) });
	let user = new User({ ...req.body, key: req.params.key.substring(4) });
	user.save((err, user) => {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}
		return res.json({ user });
	});
};

exports.updatebyId = (req, res) => {
	console.log(req.body, req.params.id.substring(3));
	User.findByIdAndUpdate(
		{ _id: req.params.id.substring(3) },
		{ $set: req.body },
		(err, user) => {
			if (err) {
				return res.status(400).json({
					error: err,
				});
			}
			return res.json({ user });
		}
	).catch((err) => console.log(err));
};
