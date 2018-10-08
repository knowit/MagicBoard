# MMM-Jira

##Instructions
* Rename app_constants_copy.py to app_constants.py and add your credentials
* Requires Python 3.7. Install packages:
    * pip install jira
    * pip install python-dateutil
    
## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
All config values are default and only needs to be added if changed.
{
    module: 'MMM-Jira',
    config: {
        width: 1200,
        height: 600,
        chartLineColor: "rgb(45, 41, 38)",
        chartAreaColor: "rgba(201, 226, 224, 1)",
        updateInterval: 1000 * 60,
        dataUpdateInterval: 1000 * 60 * 60,
        viewRotation: ["month", "week", "status"],
    }
}
```


##  Jira data
```
JSON data recived from node_helper:

{'years': [
    {'year': 2018, 
     'year_count': 0, 
     'months': [
        {'month': 1, 'month_count': 0}, {'month': 2, 'month_count': 0}, {'month': 3, 'month_count': 0}, {'month': 4, 'month_count': 0}, {'month': 5, 'month_count': 0}, {'month': 6, 'month_count': 0}, {'month': 7, 'month_count': 0}, {'month': 8, 'month_count': 0}, {'month': 9, 'month_count': 0}, {'month': 10, 'month_count': 0}, {'month': 11, 'month_count': 0}, {'month': 12, 'month_count': 0}], 
     'weeks': [
        {'week': 1, 'week_count': 0}, {'week': 2, 'week_count': 0}, {'week': 3, 'week_count': 0}, {'week': 4, 'week_count': 0}, {'week': 5, 'week_count': 0}, {'week': 6, 'week_count': 0}, {'week': 7, 'week_count': 0}, {'week': 8, 'week_count': 0}, {'week': 9, 'week_count': 0}, {'week': 10, 'week_count': 0}, {'week': 11, 'week_count': 0}, {'week': 12, 'week_count': 0}, {'week': 13, 'week_count': 0}, {'week': 14, 'week_count': 0}, {'week': 15, 'week_count': 0}, {'week': 16, 'week_count': 0}, {'week': 17, 'week_count': 0}, {'week': 18, 'week_count': 0}, {'week': 19, 'week_count': 0}, {'week': 20, 'week_count': 0}, {'week': 21, 'week_count': 0}, {'week': 22, 'week_count': 0}, {'week': 23, 'week_count': 0}, {'week': 24, 'week_count': 0}, {'week': 25, 'week_count': 0}, {'week': 26, 'week_count': 0}, {'week': 27, 'week_count': 0}, {'week': 28, 'week_count': 0}, {'week': 29, 'week_count': 0}, {'week': 30, 'week_count': 0}, {'week': 31, 'week_count': 0}, {'week': 32, 'week_count': 0}, {'week': 33, 'week_count': 0}, {'week': 34, 'week_count': 0}, {'week': 35, 'week_count': 0}, {'week': 36, 'week_count': 0}, {'week': 37, 'week_count': 0}, {'week': 38, 'week_count': 0}, {'week': 39, 'week_count': 0}, {'week': 40, 'week_count': 0}, {'week': 41, 'week_count': 0}, {'week': 42, 'week_count': 0}, {'week': 43, 'week_count': 0}, {'week': 44, 'week_count': 0}, {'week': 45, 'week_count': 0}, {'week': 46, 'week_count': 0}, {'week': 47, 'week_count': 0}, {'week': 48, 'week_count': 0}, {'week': 49, 'week_count': 0}, {'week': 50, 'week_count': 0}, {'week': 51, 'week_count': 0}, {'week': 52, 'week_count': 0}], 
     'issue_statuses': [
        {'status': 'To Do', 'status_count': 0}, {'status': 'Vunnet', 'status_count': 0]}]}
```