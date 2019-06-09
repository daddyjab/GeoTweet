# Initial the database on Heroku start-up
from python.app import cleanup_records_before

print("PERFORMING CLEAN-UP: Trends and Tweets Tables")
results = cleanup_records_before("6/4/2019 11:11:14.807341")
print(results)