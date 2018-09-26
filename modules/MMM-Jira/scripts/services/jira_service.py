from typing import List
from jira import JIRA
from jira.resources import Project, Issue

from helpers.app_constants import AppConstants


class JiraService:
    def __init__(self):
        self.jira = JIRA(AppConstants.JIRA_SERVER_URL, basic_auth=(AppConstants.JIRA_USERNAME, AppConstants.JIRA_PASSWORD))

    def get_all_projects(self) -> List[Project]:
        projects = self.jira.projects()
        return projects

    def get_project(self, project_id:str) -> Project:
        project = self.jira.project(id=project_id)
        return project

    def get_issues_for_project(self, project_id: str, max_results: int) -> List[Issue]:
        issues = self.jira.search_issues(f"project = '{project_id}'", maxResults=max_results)
        return issues
