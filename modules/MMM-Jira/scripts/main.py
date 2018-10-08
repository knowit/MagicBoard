from request import Request
from yeardata import YearData
from services.jira_service import JiraService
import dateutil.parser
import sys
import json

jira_service = JiraService()

year_data_dict = dict()


def to_node(type, message):
    try:
        print(json.dumps({type: message}))
    except Exception:
        pass
    sys.stdout.flush()


def data_init():
    issues = jira_service.get_issues_for_project(project_id="SALG", max_results=0)

    for issue in issues:
        if issue.fields.status.name in ("Rejected", "Done"):
            continue

        issue_datetime = dateutil.parser.parse(issue.fields.created)

        request = Request(issue, "SOURCE")

        if issue_datetime.year in year_data_dict:
            year_data_dict[issue_datetime.year].add_request(request)
        else:
            year_data_dict[issue_datetime.year] = YearData(issue_datetime.year)
            year_data_dict[issue_datetime.year].add_request(request)


def create_json_output():
    json_years = {"years": []}
    for year, year_data in year_data_dict.items():
        json_years["years"].append(year_data.json_issue_year())
    return json_years


data_init()
to_node("status", create_json_output())
