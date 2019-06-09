# Initial the database on Heroku start-up
# Best value: 6/4/2019 11:11:14.807341 
from python.app import cleanup_records_before, pprint

print("PERFORMING CLEAN-UP: Trends and Tweets Tables")
results = cleanup_records_before("yesterday")
pprint(results)