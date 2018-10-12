(function(window) {
	"use strict";

	var docElem = window.document.documentElement;

	/**
	 * extend obj function
	 */
	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function Modal(options) {
		this.options = extend({}, this.options);
		extend(this.options, options);
		this._init();
	}

	Modal.prototype.options = {
		wrapper: document.body,
		title: "Title",
		message: "message",
		onClose: function() {
			return false;
		},
		onOpen: function() {
			return false;
		},
		onSubmit: function() {},
	};

	Modal.prototype._init = function() {
		this.container = document.createElement("div");
		this.container.className = "modal";

		this.container = document.createElement("div");
		this.container.id = "myModal";
		this.container.className = "modal";

		const modalContent = document.createElement("div");
		modalContent.className = "modal-content";

		const closeButton = document.createElement("button");
		closeButton.id = "closeButton";
		closeButton.className = "close";
		modalContent.appendChild(closeButton);

		const title = document.createElement("p");
		title.className = "modal-title";
		title.innerHTML = this.options.title;
		modalContent.appendChild(title);

		const message = document.createElement("div");
		message.className = "modal-message";
		message.innerHTML = this.options.message;
		modalContent.appendChild(message);

		const formWrapper = document.createElement("form");
		formWrapper.id = "modalForm";
		formWrapper.innerHTML = "Enter you name";

		const newline = document.createElement("br");

		const input = document.createElement("input");
		input.id = "modalInput";
		input.setAttribute("type", "text");
		input.setAttribute("name", "modal-input");
		input.className = "modal-input";

		const submit = document.createElement("input");
		submit.setAttribute("type", "submit");
		submit.className = "modal-submit";

		formWrapper.appendChild(newline);
		formWrapper.appendChild(input);
		formWrapper.appendChild(submit);

		modalContent.appendChild(formWrapper);
		this.container.appendChild(modalContent);

		this.options.wrapper.insertBefore(
			this.container,
			this.options.wrapper.nextSibling,
		);

		this.close();
		this.submit();
	};

	Modal.prototype.submit = function() {
		var self = this;
		var form = this.container.querySelector("#modalForm");

		form.addEventListener(
			"submit",
			function(event) {
				event.preventDefault();
				var value = event.target.querySelector("#modalInput").value;
				self.options.onSubmit(value);
			},
			false,
		);
	};

	Modal.prototype.close = function() {
		var self = this;
		this.container
			.querySelector(".close")
			.addEventListener("click", function() {
				self.container.style.display = "none";
			});
	};

	Modal.prototype.show = function() {
		var self = this;
		this.container.style.display = "flex";
	};

	window.Modal = Modal;
})(window);
