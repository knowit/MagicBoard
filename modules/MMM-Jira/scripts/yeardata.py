import dateutil.parser


class YearData:
    def __init__(self, year):
        self.year = year
        self.requests_in_year = []
        self.requests_per_month = [[] for i in range(12)]
        self.requests_per_week = [[] for i in range(52)]

    def add_request(self, request):
        request_datetime = dateutil.parser.parse(request.jira_issue.fields.created)

        self.requests_in_year.append(request)
        self.requests_per_month[request_datetime.month - 1].append(request)
        self.requests_per_week[request_datetime.date().isocalendar()[1] - 1].append(request)

    def request_statuses(self):
        status_list = dict()
        for request in self.requests_in_year:
            status_name = request.jira_issue.fields.status.name
            if status_name in status_list:
                status_list[status_name] += 1
            else:
                status_list[status_name] = 1

        json_request_statuses = []
        for status, count in status_list.items():
            json_request_statuses.append({"status": status, "status_count": count})

        return json_request_statuses

    def request_count_week(self):
        json_weeks = []
        week_number = 1
        for week in self.requests_per_week:
            json_weeks.append({"week": week_number, "week_count": len(week)})
            week_number += 1
        return json_weeks

    def request_count_month(self):
        json_months = []
        month_number = 1
        for month in self.requests_per_month:
            json_months.append({"month": month_number, "month_count": len(month)})
            month_number += 1
        return json_months

    def json_issue_year(self):
        issue_year = {"year": self.year, "year_count": len(self.requests_in_year),
                      "months": self.request_count_month(),
                      "weeks": self.request_count_week(),
                      "issue_statuses": self.request_statuses()}
        return issue_year
