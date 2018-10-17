/* global Module */

/* Magic Mirror
 * Module: MMM-Facial-Recognition-OC3
 *
 * By Mathieu Goulène - Based on work made by Paul-Vincent Roll 
 * MIT Licensed.
 */

Module.register("MMM-Facial-Recognition-OCV3", {
	defaults: {
		// Threshold for the confidence of a recognized face before it's considered a
		// positive match.  Confidence values below this threshold will be considered
		// a positive match because the lower the confidence value, or distance, the
		// more confident the algorithm is that the face was correctly detected.
		threshold: 90,
		// force the use of a usb webcam on raspberry pi (on other platforms this is always true automatically)
		useUSBCam: false,
		// Path to your training xml
		trainingFile: "modules/MMM-Facial-Recognition-OCV3/training.xml",
		// recognition intervall in seconds (smaller number = faster but CPU intens!)
		interval: 2,
		// Logout delay after last recognition so that a user does not get instantly logged out if he turns away from the mirror for a few seconds
		logoutDelay: 15,
		//Module set used for strangers and if no user is detected
		defaultClass: "default",
		//Set of modules which should be shown for every user
		everyoneClass: "everyone",
		// Boolean to toggle welcomeMessage
		welcomeMessage: true,
	},

	start: function() {
		this.current_user = null;
		this.sendSocketNotification("CONFIG", this.config);
		Log.info("Starting module: " + this.name);
	},

	getScripts: function() {
		return [
			"classie.js",
			"modernizr.custom.js",
			"webcamnotification.js",
			"webcam.js",
		];
	},

	getStyles: function() {
		return ["MMM-Facial-Recognition-OCV3.css"];
	},

	// Define required translations.
	getTranslations: function() {
		return {
			en: "translations/en.json",
		};
	},

	login_user: function() {
		var self = this;
		this.sendNotification("CURRENT_USER", this.current_user);
	},
	logout_user: function() {
		var self = this;

		this.sendNotification("CURRENT_USER", "None");
	},

	inputCallback: function(input) {
		this.sendSocketNotification("FACIAL_CAMERA_CAPTURE", input);
	},

	createUser: function() {
		this.clearModal();
		const modalContent = this.container.querySelector("#modalContent");

		const title = document.createElement("p");
		title.className = "modal-title";
		title.innerHTML = "Create user";
		modalContent.appendChild(title);

		const description = document.createElement("div");
		description.className = "modal-description";
		description.innerHTML =
			"By creating a user with a username, the application will take 20 images of your face and store it locally on the machine attached to the username. The images will get processed with machine learning to allow facial recognition.";
		modalContent.appendChild(description);

		const formWrapper = document.createElement("form");
		formWrapper.id = "modalForm";
		formWrapper.className = "modal-form";

		const newline = document.createElement("br");
		formWrapper.appendChild(newline);

		const input = document.createElement("input");
		input.id = "modalInput";
		input.className = "modal-input";
		input.setAttribute("type", "text");
		input.setAttribute("name", "modal-input");
		input.required = true;
		input.placeholder = "Enter a username";
		input.addEventListener("focus", () => {
			const temp = this.container.querySelector("#modalError");
			temp.style.display = "none";
		});

		formWrapper.appendChild(input);

		const error = document.createElement("span");
		error.id = "modalError";
		error.className = "modal-error";
		error.innerHTML = "*The username only allows alphanumeric characters.";
		formWrapper.appendChild(error);

		const submit = document.createElement("input");
		submit.setAttribute("type", "submit");
		submit.className = "modal-button";

		formWrapper.addEventListener("submit", event => {
			event.preventDefault();
			var value = input.value;
			if (/[^a-zA-Z0-9\-\/]/.test(value)) {
				error.style.display = "block";
				return false;
			} else {
				this.initializeCamera(value);
			}
		});
		formWrapper.appendChild(submit);

		modalContent.appendChild(formWrapper);
	},

	initializeCamera: function(value) {
		this.clearModal();
		const modalContent = this.container.querySelector("#modalContent");

		const title = document.createElement("p");
		title.className = "modal-title";
		title.innerHTML = "Are you ready?";
		modalContent.appendChild(title);

		const description = document.createElement("p");
		description.className = "modal-description";
		description.innerHTML =
			"Please stay infront of the webcam. This process will take a couple of seconds. When you are ready, press start.";
		modalContent.appendChild(description);

		const startButton = document.createElement("button");
		startButton.className = "modal-button";
		startButton.innerHTML = "Start";
		startButton.addEventListener("click", () => {
			this.showLoading();
			this.sendSocketNotification("FACIAL_CAMERA_CAPTURE", value);
		});
		modalContent.appendChild(startButton);

		const cancelButton = document.createElement("button");
		cancelButton.className = "modal-cancel";
		cancelButton.innerHTML = "Cancel";
		cancelButton.addEventListener("click", () => {
			this.closeModal();
		});
		modalContent.appendChild(cancelButton);
	},

	showModal: function() {
		this.createModal();

		this.container.style.display = "flex";
		const modalContent = this.container.querySelector("#modalContent");

		const title = document.createElement("p");
		title.className = "modal-title";
		title.innerHTML = "Facial recognition";
		modalContent.appendChild(title);

		const description = document.createElement("p");
		description.className = "modal-description";
		description.innerHTML =
			"To activate facial recognition, it needs to be manually turned on. Use keyboard keyboard and mouse. Select an option:";
		modalContent.appendChild(description);

		//if (this.users && this.users.length > 0) {
		const startButton = document.createElement("button");
		startButton.className = "modal-button";
		startButton.innerHTML = "Start facial recognition";
		startButton.addEventListener("click", () => {
			this.closeModal();
			this.sendSocketNotification("GET_USERS_AND_START");
		});
		modalContent.appendChild(startButton);
		//}

		const createButton = document.createElement("button");
		createButton.className = "modal-button";
		createButton.innerHTML = "Create user";
		createButton.addEventListener("click", () => {
			this.createUser();
		});
		modalContent.appendChild(createButton);

		const deleteButton = document.createElement("button");
		deleteButton.className = "modal-button";
		deleteButton.innerHTML = "Delete user";
		deleteButton.addEventListener("click", () => this.deleteModal());
		modalContent.appendChild(deleteButton);
	},

	deleteModal: function() {
		this.clearModal();
		const modalContent = this.container.querySelector("#modalContent");
		modalContent.className = "modal-content center";

		const title = document.createElement("p");
		title.className = "modal-title";
		title.innerHTML = "Remove user";
		modalContent.appendChild(title);

		const description = document.createElement("p");
		description.className = "modal-description";
		description.innerHTML = "Select the user you want to delete:";
		modalContent.appendChild(description);

		const dropDown = document.createElement("select");
		dropDown.id = "dropDown";
		dropDown.style.fontSize = "16px";
		dropDown.required = true;

		const placeholder = document.createElement("option");
		placeholder.value = "none";
		placeholder.innerHTML = "Select user to remove";
		dropDown.appendChild(placeholder);

		this.users.forEach(user => {
			let option = document.createElement("option");
			option.value = user;
			option.innerHTML = user;
			dropDown.appendChild(option);
		});

		modalContent.appendChild(dropDown);

		const removeUser = document.createElement("button");
		removeUser.className = "modal-button";
		removeUser.innerHTML = "Remove";
		removeUser.addEventListener("click", () => {
			if (dropDown.value !== "none") {
				this.closeModal();
				this.sendSocketNotification("REMOVE_USER", dropDown.value);
			}
		});
		modalContent.appendChild(removeUser);
	},

	showLoading: function() {
		this.clearModal();
		this.container.querySelector("#closeButton").remove();
		const modalContent = this.container.querySelector("#modalContent");

		const description = document.createElement("p");
		description.className = "modal-description";
		description.innerHTML =
			"Stay still. Picture is being captured and processed. It will take a couple of seconds.";
		modalContent.appendChild(description);

		const loader = document.createElement("div");
		loader.className = "loader";

		modalContent.appendChild(loader);
	},

	finishModal: function() {
		this.clearModal();
		const modalContent = this.container.querySelector("#modalContent");

		const title = document.createElement("p");
		title.className = "modal-title";
		title.innerHTML = "Done!";
		modalContent.appendChild(title);

		const description = document.createElement("p");
		description.className = "modal-description";
		description.innerHTML =
			"Your images have been processed. Remember you can delete your user anytime. Please select an option:";
		modalContent.appendChild(description);

		const startButton = document.createElement("button");
		startButton.className = "modal-button";
		startButton.innerHTML = "Start facial recognition";
		startButton.addEventListener("click", () => {
			this.closeModal();
			this.sendSocketNotification("GET_USERS_AND_START");
		});
		modalContent.appendChild(startButton);

		const cancelButton = document.createElement("button");
		cancelButton.className = "modal-cancel";
		cancelButton.innerHTML = "Cancel";
		cancelButton.addEventListener("click", () => {
			this.closeModal();
		});
		modalContent.appendChild(cancelButton);
	},

	closeModal: function() {
		this.container.remove();
		this.container = null;
	},

	createModal: function(children) {
		if (!this.container) {
			this.container = document.createElement("div");
			this.container.id = "myModal";
			this.container.className = "modal";

			const modalBox = document.createElement("div");
			modalBox.id = "modalBox";
			modalBox.className = "modal-box";

			const closeButton = document.createElement("button");
			closeButton.id = "closeButton";
			closeButton.className = "close";
			closeButton.innerHTML = "&times;";
			closeButton.addEventListener("click", () => this.closeModal());
			modalBox.appendChild(closeButton);

			const modalContent = document.createElement("div");
			modalContent.id = "modalContent";
			modalContent.className = "modal-content";

			modalBox.appendChild(modalContent);
			this.container.appendChild(modalBox);

			document.body.insertBefore(
				this.container,
				document.body.nextSibling,
			);
		}
		return this.container;
	},

	clearModal: function() {
		this.container.querySelector("#modalContent").innerHTML = "";
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "FINISHED_TAKING_PICTURE") {
			this.sendSocketNotification("TRAIN_MODEL");
		} else if (notification === "FINISHED_TRAINING_MODEL") {
			this.finishModal();
		} else if (notification === "USER_RETRIEVED") {
			this.users = payload;
		} else if (notification === "USER_RETRIEVED_AND_START") {
			this.users = payload;
			this.toggleFacialRecognition();
		} else if (payload && payload.action === "login") {
			if (this.current_user_id !== payload.user) {
				this.logout_user();
			}
			if (payload.user === -1) {
				this.current_user_id = payload.user;
			} else {
				this.current_user = this.users[payload.user];
				if (this.config.welcomeMessage) {
					this.sendNotification(
						"FACE_RECOGNITION_USER_LOGIN",
						this.current_user,
					);
					this.current_user_id = payload.user;
					this.login_user();
				}
			}
		} else if (payload && payload.action === "logout") {
			this.sendNotification(
				"FACE_RECOGNITION_USER_LOGOUT",
				this.translate("logout"),
			);
			this.logout_user();
			this.current_user = null;
			this.toggleFacialRecognition();
		}
	},

	notificationReceived: function(notification, payload, sender) {
		if (notification === "BUTTON_TOGGLE_FACE_RECOGNITION") {
			this.toggleFacialRecognition();
		}
		if (notification === "KEYPRESS") {
			const self = this;
			switch (payload.KeyName) {
				case "ArrowUp":
					this.sendSocketNotification("GET_USERS");
					this.showModal();
					break;
				default:
					break;
			}
		}
	},

	toggleFacialRecognition: function() {
		this.sendSocketNotification("FACIAL_RECOGNITION_TOGGLE");
		if (this.alert) {
			this.alert.toggleOnOff();
			this.alert = null;
		} else {
			this.alert = new WebcamNotification();
			this.alert.toggleOnOff();

			const self = this;
			setTimeout(function() {
				if (self.current_user === null) {
					self.toggleFacialRecognition();
				}
			}, 1000 * (self.config.logoutDelay + 5));
		}
	},
});
