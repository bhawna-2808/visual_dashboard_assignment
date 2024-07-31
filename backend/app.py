from flask import Flask, jsonify, request, render_template, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import json

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['visualization_dashboard']
collection = db['data_points']

# Function to import data
def import_data():
    # Read data from jsondata.json
    with open('jsondata.json', 'r') as file:
        data = json.load(file)
    
    collection.delete_many({})  # Clear existing data
    collection.insert_many(data)
    print("Data imported successfully!")


@app.route('/')
def index():
    # return send_from_directory('frontend', 'index.html')
    return render_template('frontend/index.html')


@app.route('/api/data', methods=['GET'])
def get_data():
    # Get query parameters
    sector = request.args.get('sector')
    topic = request.args.get('topic')
    region = request.args.get('region')
    
    # Build query
    query = {}
    if sector:
        query['sector'] = sector
    if topic:
        query['topic'] = topic
    if region:
        query['region'] = region
    
    # Query the database
    result = list(collection.find(query, {'_id': 0}))
    print(f"Number of documents retrieved: {len(result)}")
    print(f"First document: {result[0] if result else None}")
    return jsonify(result)

@app.route('/api/import', methods=['POST'])
def trigger_import():
    import_data()
    return jsonify({"message": "Data import completed successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)