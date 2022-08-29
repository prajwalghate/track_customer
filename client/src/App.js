import React, { useEffect, useState } from "react";
import axios from "axios";
import CookieConsent, {
	Cookies,
	getCookieConsentValue,
	resetCookieConsentValue,
} from "react-cookie-consent";
import { isBrowser, isMobile, browserName } from "react-device-detect";
import logo from "./logo.svg";
import "./App.css";

function App() {
	const [clientip, setClientip] = useState("");
	const [cookiesAllowed, setCookiesAllowed] = useState(false);
	const lang = navigator.language || navigator.userLanguage;
	const [device, setDevice] = useState(isBrowser ? "browser" : "mobile");
	const [browser, setBrowser] = useState(browserName);
	const [windowDimensions, setWindowDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const getIpData = async () => {
		const res = await axios.get("https://geolocation-db.com/json/");
		console.log(res.data);
		setClientip(res.data.IPv4);
		return res.data.IPv4.toString();
	};

	const localStorageHandler = async () => {
		let pubKey = localStorage.getItem("pubKey");
		if (pubKey == null) {
			// localStorage.setItem("pubKey", "12345");
			await fetch("http://127.0.0.1:8000/api/user/getKey", {
				method: "GET",
				// headers: {
				// 	"Content-Type": "application/json",
				// },
			})
				.then((response) => response.json())
				.then(async (data) => {
					console.log(data.private, "data");
					localStorage.setItem("pubKey", data.public);
					let data1 = {
						clientip: await getIpData(),
						cookiesAllowed: getCookieConsentValue() == undefined ? false : true,
						lang,
						device,
						browser,
						windowDimensions,
					};

					fetch(`http://127.0.0.1:8000/api/user/update/key=${data.public}`, {
						method: "PUT", // or 'PUT'
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data1),
					})
						.then((response) => response.json())
						.then((data) => {
							console.log("Success:", data);
						})
						.catch((error) => {
							console.error("Error:", error);
						});
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {
					console.log("finally");
				});

			console.log("pubKey is null make api call to generate and set pubKey");
		} else {
			console.log("pubKey is ", pubKey);

			await fetch(`http://127.0.0.1:8000/api/user/getUser/key=${pubKey}`, {
				method: "GET",
				// headers: {
				// 	"Content-Type": "application/json",
				// },
			})
				.then((response) => response.json())
				.then(async (data) => {
					console.log(data._id, "data");
					let data1 = {
						key: pubKey,
						clientip: await getIpData(),
						cookiesAllowed: getCookieConsentValue() == undefined ? false : true,
						lang,
						device,
						browser,
						windowDimensions,
					};
					fetch(`http://127.0.0.1:8000/api/user/updatebyId/id=${data._id}`, {
						method: "PUT", // or 'PUT'
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data1),
					})
						.then((response) => response.json())
						.then((data) => {
							console.log("Success:", data);
						})
						.catch((error) => {
							console.error("Error:", error);
						});
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {
					console.log("finally");
				});
		}
	};

	useEffect(() => {
		// localStorage.removeItem("pubKey");
		getIpData();
		getCookieConsentValue() == undefined
			? setCookiesAllowed(false)
			: setCookiesAllowed(true);
		isBrowser ? setDevice("browser") : setDevice("mobile");
		// setBrowser(browserName);
		localStorageHandler();
	}, [getCookieConsentValue()]);

	return (
		<div className="App">
			<header className="App-header">
				<p style={{ fontSize: 40 }}>Client Side Information</p>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
					}}
				>
					<div style={{ fontSize: 20, marginTop: 10 }}>
						Client IP address : {clientip}
					</div>
					<div style={{ fontSize: 20, marginTop: 10 }}>
						Client Allowed Cookies : {cookiesAllowed == true ? "true" : "false"}
					</div>
					<div style={{ fontSize: 20, marginTop: 10 }}>
						Client Language : {lang}
					</div>
					<div style={{ fontSize: 20, marginTop: 10 }}>
						Client Device : {device}
					</div>
					<div style={{ fontSize: 20, marginTop: 10 }}>
						Client Browser Name : {browserName}
					</div>
					<div style={{ fontSize: 20, marginTop: 10 }}>
						Client Browser Dimension : {windowDimensions.width}x
						{windowDimensions.height}
					</div>
				</div>
			</header>
			<CookieConsent
				onAccept={(acceptedByScrolling) => {
					console.log("acceptedByScrolling");
					setCookiesAllowed(true);
				}}
			></CookieConsent>
		</div>
	);
}

export default App;
