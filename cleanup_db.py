# Initial the database on Heroku start-up
from python.app import cleanup_db_tables

print("PERFORMING CLEAN-UP: Trends and Tweets Tables")
results = cleanup_db_tables("last week")
print(results)