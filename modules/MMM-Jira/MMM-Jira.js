/* global Module */
Module.register("MMM-Jira", {
    // Load required additional scripts
    defaults: {
        title: "Jira",
        width: 600,
        height: 300,
        chartLineColor: "rgb(45, 41, 38)",
        chartAreaColor: "rgba(201, 226, 224, 1)",
        updateInterval: 1000 * 60 * 60
    },

    getScripts: function () {
        return [
            "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js",
            this.file("scripts/chartjs-plugin-datalabels.js")
        ];
    },

    start: function () {
        const self = this;
        self.updateDom();
        setInterval(function () {
            self.updateDom()
        }, self.config.updateInterval)
    },

    fetchJiraData: async function () {
        const serie = {"1" : {"4. close" : 400}, "2" : {"4. close" : 400}, "3" : {"4. close" : 700}, "4" : {"4. close" : 600}, "5" : {"4. close" : 500}};

        const x = [];
        const y = [];

        if (serie) {
            Object.entries(serie).forEach(([key, value]) => {
                x.unshift(value["4. close"]);
                y.unshift(key)
            });

            return {x: x.reverse(), y: y.reverse()};
        }
    },

    generateChart: function (canvas, chartData) {
        if (chartData) {
            const chart = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: chartData.y,
                    datasets: [{
                        label: this.config.symbol,
                        fill: true,
                        data: chartData.x,
                        borderColor: this.config.chartLineColor,
                        backgroundColor: this.config.chartAreaColor,
                        pointRadius: 0,
                    }]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: this.config.title,
                        fontColor: "white",
                        fontSize: 16
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                        }],
                        yAxes: [{
                            display: true,
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    layout: {
                        padding: {
                            right: 90,
                        }
                    },
                    legend: {
                        labels: {
                            // This more specific font property overrides the global property
                            fontColor: 'white',
                            fontSize: 18
                        }
                    },
                    plugins: {
                        datalabels: {
                            anchor: "end",
                            align: "top",
                            borderRadius: 4,
                            color: 'white',
                            display: () => true,
                            formatter: (value) => parseFloat(value).toFixed(2),
                            font: {
                                size: 40,
                                family: "'Raleway', sans-serif",
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
