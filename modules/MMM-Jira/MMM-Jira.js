/* global Module */
Module.register("MMM-Jira", {
    // Load required additional scripts
    defaults: {
        width: 1200,
        height: 400,
        chartLineColor: "rgb(45, 41, 38)",
        chartAreaColor: "rgba(201, 226, 224, 1)",
        updateInterval: 1000 * 60,
        dataUpdateInterval: 1000 * 60 * 60,
        viewRotation: ["month", "week", "status"],
    },

    getScripts: function () {
        return [
            "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js",
            this.file("scripts/chartjs-plugin-datalabels.js")
        ];
    },

    start: function () {
        this.jira_data = "NO_JIRA_DATA";
        this.current_view = 0;

        this.sendSocketNotification("JIRA_GET_DATA", this.config);

        const self = this;
        setInterval(function () {
            self.sendSocketNotification("JIRA_GET_DATA", self.config);
        }, self.config.dataUpdateInterval);

        setInterval(function () {
            self.updateDom();
        }, self.config.updateInterval);
    },

    socketNotificationReceived(notification, payload) {
        if (notification === "JIRA_DATA") {
            this.jira_data = payload;
            this.updateDom();
        }
    },

    fetchJiraData: async function () {
        if (this.jira_data === "NO_JIRA_DATA") {
            console.log(this.name + ": NO_JIRA_DATA");
            return {x: [0], y: [0]};
        }

        const monthNames = ["Januar", "Februar", "Mars", "April", "Mai", "Juni",
            "Juli", "August", "September", "Oktober", "November", "Desember"
        ];

        const current_year = (new Date()).getFullYear();
        let title = "";

        const x = [];
        const y = [];

        const json_years= this.jira_data["status"]["years"];

        Object.entries(json_years).forEach(([key, value]) => {
            if(value["year"] === current_year) {

                if (this.config.viewRotation[this.current_view] === "month") {
                    Object.entries(value["months"]).forEach(([key, value]) => {
                        x.push(monthNames[value["month"] - 1]);
                        y.push(value["month_count"]);

                        title = "Anbud per mnd i " + current_year;
                    });
                }
                else if(this.config.viewRotation[this.current_view] === "week"){
                    Object.entries(value["weeks"]).forEach(([key, value]) => {
                        x.push(value["week"]);
                        y.push(value["week_count"]);

                        title = "Anbud per uke i " + current_year;
                    });
                }
                else if(this.config.viewRotation[this.current_view] === "status"){
                    Object.entries(value["issue_statuses"]).forEach(([key, value]) => {
                        x.push(value["status"]);
                        y.push(value["status_count"]);

                        title = "Status på anbud i " + current_year;
                    });
                }

                this.current_view++;
                if(this.current_view >= this.config.viewRotation.length){
                    this.current_view = 0;
                }
            }
        });

        return {x: x, y: y, title: title};
    },

    generateChart: function (canvas, chartData) {
        if (chartData) {
            const chart = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: chartData.x,
                    datasets: [{
                        label: "",
                        fill: true,
                        data: chartData.y,
                        borderColor: this.config.chartLineColor,
                        backgroundColor: this.config.chartAreaColor,
                        pointRadius: 0,
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        display: true,
                        text: chartData.title,
                        fontColor: "white",
                        fontSize: 14,
                        fontFamily: "'Raleway', sans-serif"
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            ticks: {
                                fontColor: 'white',
                                fontSize: 10,
                                fontFamily: "'Raleway', sans-serif"
                            },
                            gridLines: {
                                display: false,
                            },
                        }],
                        yAxes: [{
                            display: false,
                            ticks: {
                                beginAtZero: true
                            },
                            gridLines: {
                                display: false,
                            },
                        }]
                    },
                    layout: {
                        padding: {
                            right: 90,
                        }
                    },
                    legend: {
                        display: false,
                        labels: {
                            // This more specific font property overrides the global property
                            fontColor: 'white',
                            fontSize: 10,
                        }
                    },
                    plugins: {
                        datalabels: {
                            anchor: "end",
                            align: "top",
                            borderRadius: 4,
                            color: 'white',
                            display: () => true,
                            formatter: (value) => parseFloat(value).toFixed(0),
                            font: {
                                size: 10,
                                family: "'Raleway', sans-serif"
                            },
                        }
                    },
                }
            });
        }
    },
    // Override dom generator.
    getDom: async function () {
        const wrapper = document.createElement('canvas');
        wrapper.id = "chart";
        wrapper.width = this.config.width;
        wrapper.height = this.config.height;
        const ctx = wrapper.getContext("2d");
        const data = await this.fetchJiraData();
        this.generateChart(ctx, data);

        return wrapper;
    },
});
