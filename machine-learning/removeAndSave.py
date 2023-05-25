import json

# load the JSON file
with open('doge_synthetic_date.json', 'r') as f:
    data = json.load(f)

# save the last 50 elements from the target list
removed_items = data['target'][-50:]

# remove the last 100 elements from the target list
data['target'] = data['target'][:-50]

# save the modified JSON file
with open('doge_synthetic_date_train.json', 'w') as f:
    json.dump(data, f)



