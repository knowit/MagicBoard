from services.jira_service import JiraService
import dateutil.parser
import sys
import json

jira_service = JiraService()

year_data_dict = dict()


class YearData:
    def __init__(self, year):
        self.year = year
        self.issues_in_year = []
        self.issues_in_months = [[] for i in range(12)]
        self.issues_in_weeks = [[] for i in range(52)]

    def add_issue(self, issue):
        issue_datetime = dateutil.parser.parse(issue.fields.created)

        self.issues_in_year.append(issue)
        self.issues_in_months[issue_datetime.month].append(issue)
        self.issues_in_weeks[issue_datetime.date().isocalendar()[1]].append(issue)

    def issue_statuses(self):
        status_list = dict()
        for issue in self.issues_in_year:
            status_name = issue.fields.status.name
            if status_name in status_list:
                status_list[status_name] += 1
            else:
                status_list[status_name] = 1

        json_issue_statuses = []
        for status, count in status_list.items():
            json_issue_statuses.append({"status": status, "status_count": count})

        return json_issue_statuses

    def issue_count_week(self):
        json_weeks = []
        week_number = 1
        for week in self.issues_in_weeks:
            json_weeks.append({"week": week_number, "week_count": len(week)})
            week_number += 1
        return json_weeks

    def issue_count_month(self):
        json_months = []
        month_number = 1
        for month in self.issues_in_months:
            json_months.append({"month": month_number, "month_count": len(month)})
            month_number += 1
        return json_months

    def json_issue_year(self):
        issue_year = {"year": self.year, "year_count": len(self.issues_in_year),
                      "months": self.issue_count_month(),
                      "weeks": self.issue_count_week(),
                      "issue_statuses": self.issue_statuses()}
        return issue_year


def to_node(type, message):
    try:
        print(json.dumps({type: message}))
    except Exception:
        pass
    sys.stdout.flush()


def data_init():
    issues = jira_service.get_issues_for_project(project_id="SALG", max_results=0)

    for issue in issues:
        issue_datetime = dateutil.parser.parse(issue.fields.created)

        if issue_datetime.year in year_data_dict:
            year_data_dict[issue_datetime.year].add_issue(issue)
        else:
            year_data_dict[issue_datetime.year] = YearData(issue_datetime.year)
            year_data_dict[issue_datetime.year].add_issue(issue)


def create_json_output():
    json_years = {"years": []}
    for year, year_data in year_data_dict.items():
        json_years["years"].append(year_data.json_issue_year())
    return json_years


data_init()

#print(create_json_output())
to_node("status", create_json_output())
